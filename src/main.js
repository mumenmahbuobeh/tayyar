'use strict';
const { app, BrowserWindow, ipcMain, dialog, shell, Notification, clipboard, Menu } = require('electron');
const path = require('path');
const http = require('http');
const { DownloadManager } = require('./engine');

const BRIDGE_PORT = 6824;
const THEMES = {
  dark: { color: '#101C2C', symbolColor: '#9FB2CC' },
  light: { color: '#EEF2F8', symbolColor: '#3A4B66' },
};

let win = null;
let mgr = null;

if (!app.requestSingleInstanceLock()) app.quit();
app.on('second-instance', () => { if (win) { if (win.isMinimized()) win.restore(); win.focus(); } });

const send = (ch, payload) => { if (win && !win.isDestroyed()) win.webContents.send(ch, payload); };

function applyTheme() {
  if (!win || process.platform === 'darwin') return;
  const t = THEMES[mgr.settings.theme] || THEMES.dark;
  win.setBackgroundColor(t.color);
  win.setTitleBarOverlay({ color: t.color, symbolColor: t.symbolColor, height: 52 });
}

function createWindow() {
  const t = THEMES[mgr.settings.theme] || THEMES.dark;
  win = new BrowserWindow({
    width: 1320, height: 820, minWidth: 920, minHeight: 560,
    show: false, title: 'تيّار', backgroundColor: t.color,
    titleBarStyle: 'hidden',
    titleBarOverlay: process.platform === 'darwin' ? undefined : { color: t.color, symbolColor: t.symbolColor, height: 52 },
    trafficLightPosition: { x: 20, y: 18 },
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, sandbox: true, nodeIntegration: false },
  });
  win.once('ready-to-show', () => win.show());
  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  win.webContents.on('will-navigate', (e) => e.preventDefault());
  win.loadFile(path.join(__dirname, '..', 'renderer', 'index.html'));
  win.on('closed', () => { win = null; });
}

/** Local bridge so the browser extension can hand links to the app (like IDM's browser integration). */
function startBridge() {
  const srv = http.createServer((req, res) => {
    const origin = req.headers.origin || '';
    const fromExtension = /^(chrome|moz)-extension:\/\//.test(origin);
    res.setHeader('Access-Control-Allow-Origin', fromExtension ? origin : 'null');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Tayyar');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }
    if (req.method !== 'POST' || req.url !== '/add' || !fromExtension || req.headers['x-tayyar'] !== '1') {
      res.writeHead(403); return res.end();
    }
    let body = '';
    req.on('data', (c) => { body += c; if (body.length > 65536) req.destroy(); });
    req.on('end', () => {
      try {
        const { url, referer } = JSON.parse(body);
        if (win) { if (win.isMinimized()) win.restore(); win.show(); win.focus(); }
        send('ui:add-url', { url: String(url || ''), referer: String(referer || '') });
        res.writeHead(200); res.end('ok');
      } catch (_) { res.writeHead(400); res.end(); }
    });
  });
  srv.on('error', () => { /* port busy: extension integration disabled */ });
  srv.listen(BRIDGE_PORT, '127.0.0.1');
}

/** Suggest a download when a file link is copied (IDM-style clipboard monitoring). */
function watchClipboard() {
  let last = '';
  const fileLink = /^https?:\/\/\S+\.(zip|rar|7z|tar|gz|iso|exe|msi|dmg|pkg|deb|apk|mp4|mkv|avi|mov|webm|mp3|flac|wav|pdf|docx?|xlsx?|pptx?)(\?\S*)?$/i;
  setInterval(() => {
    if (!mgr.settings.watchClipboard) return;
    const text = clipboard.readText().trim();
    if (text && text !== last && fileLink.test(text)) { last = text; send('ui:clip-url', { url: text }); }
  }, 1200);
}

function wireIpc() {
  const h = (name, fn) => ipcMain.handle(name, (_e, ...a) => fn(...a));
  h('list', () => mgr.list());
  h('platform', () => process.platform);
  h('settings:get', () => mgr.settings);
  h('settings:set', (patch) => { const s = mgr.setSettings(patch); applyTheme(); return s; });
  h('probe', async (url, referer) => {
    try { return await mgr.probe(url, referer); } catch (e) { return { error: e.message }; }
  });
  h('add', (opts) => {
    try { return { ok: true, item: mgr.add(opts) }; } catch (e) { return { ok: false, error: e.message }; }
  });
  h('pause', (ids) => ids.forEach((id) => mgr.pause(id)));
  h('resume', (ids) => ids.forEach((id) => mgr.resume(id)));
  h('pauseAll', () => mgr.pauseAll());
  h('resumeAll', () => mgr.resumeAll());
  h('remove', (ids, del) => ids.forEach((id) => mgr.remove(id, !!del)));
  h('open', (id) => { const d = mgr.list().find((x) => x.id === id); if (d && d.status === 'completed') return shell.openPath(d.path); });
  h('reveal', (id) => { const d = mgr.list().find((x) => x.id === id); if (d && d.path) shell.showItemInFolder(d.status === 'completed' ? d.path : d.path + '.part'); });
  h('chooseDir', async () => {
    const r = await dialog.showOpenDialog(win, { properties: ['openDirectory', 'createDirectory'] });
    return r.canceled ? null : r.filePaths[0];
  });
}

app.whenReady().then(() => {
  if (process.platform !== 'darwin') Menu.setApplicationMenu(null);
  mgr = new DownloadManager({
    stateFile: path.join(app.getPath('userData'), 'state.json'),
    defaultDir: path.join(app.getPath('downloads'), 'Tayyar'),
  });
  mgr.on('update', (d) => send('dl:update', d));
  mgr.on('progress', (b) => send('dl:progress', b));
  mgr.on('removed', (id) => send('dl:removed', id));
  mgr.on('settings', (s) => send('settings', s));
  mgr.on('complete', (d) => {
    if (Notification.isSupported()) new Notification({ title: 'اكتمل التحميل', body: d.filename }).show();
  });
  wireIpc();
  createWindow();
  startBridge();
  watchClipboard();
  app.on('activate', () => { if (!win) createWindow(); });
});

app.on('before-quit', () => { if (mgr) mgr.shutdown(); });
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
