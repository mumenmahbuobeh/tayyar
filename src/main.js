'use strict';
const { app, BrowserWindow, ipcMain, dialog, shell, Notification, clipboard, Menu } = require('electron');
const path = require('path');
const fs = require('fs');
const http = require('http');
const https = require('https');
const { DownloadManager, isDownloadableUrl } = require('./engine');
const social = require('./social');

const BRIDGE_PORT = 6824;
const THEMES = {
  dark: { color: '#151f23', symbolColor: '#9FB2CC' },
  light: { color: '#EEF2F8', symbolColor: '#3A4B66' },
};

let win = null;
let mgr = null;

if (!app.requestSingleInstanceLock()) {
  console.log('Another instance is holding single instance lock! Quitting.');
  app.quit();
}
app.on('second-instance', () => {
  if (win) {
    if (win.isMinimized()) win.restore();
    win.focus();
    try { win.webContents.reloadIgnoringCache(); } catch (_) {}
  }
});

const send = (ch, payload) => { if (win && !win.isDestroyed()) win.webContents.send(ch, payload); };

function applyTheme() {
  if (!win || process.platform === 'darwin') return;
  const t = THEMES[mgr.settings.theme] || THEMES.dark;
  try { win.setBackgroundColor(t.color); } catch (_) {}
}

function createWindow() {
  console.log('createWindow called');
  const t = THEMES[mgr.settings.theme] || THEMES.dark;
  win = new BrowserWindow({
    width: 1320, height: 820, minWidth: 800, minHeight: 520,
    show: true, title: 'تيّار', backgroundColor: t.color,
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, sandbox: true, nodeIntegration: false },
  });
  win.webContents.on('did-finish-load', () => {
    console.log('HTML loaded successfully');
    win.show();
    win.focus();
  });
  win.webContents.on('before-input-event', (event, input) => {
    if (input.type === 'keyDown') {
      if (input.key === 'F5' || ((input.control || input.meta) && input.key.toLowerCase() === 'r')) {
        win.webContents.reloadIgnoringCache();
      }
    }
  });
  win.webContents.on('did-fail-load', (_e, code, desc) => {
    console.error('did-fail-load error:', code, desc);
  });
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:\/\//i.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });
  win.webContents.on('will-navigate', (e) => e.preventDefault());
  win.loadFile(path.join(__dirname, '..', 'renderer', 'index.html'));
  win.on('closed', () => { win = null; });
  console.log('loadFile dispatched');
}

/** Local bridge so the browser extension can hand links to the app (like IDM's browser integration). */
function startBridge() {
  const srv = http.createServer((req, res) => {
    const origin = req.headers.origin || '';
    const fromExtension = !origin || /^(chrome|moz|safari-web)-extension:\/\/|^http:\/\/127\.0\.0\.1/i.test(origin);
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Tayyar');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

    if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }

    if (req.method === 'GET' && (req.url === '/ping' || req.url === '/status')) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ ok: true, app: 'Tayyar', version: '1.0.17', bridge: true, stories: true }));
    }

    // Receive Story/Status media blob (WhatsApp Web, Instagram/Facebook/Snapchat Web Stories)
    if (req.method === 'POST' && req.url === '/add-blob' && fromExtension && req.headers['x-tayyar'] === '1') {
      const chunks = [];
      let totalLen = 0;
      req.on('data', (c) => {
        totalLen += c.length;
        if (totalLen > 60 * 1024 * 1024) { req.destroy(); return; }
        chunks.push(c);
      });
      req.on('end', () => {
        try {
          const payload = JSON.parse(Buffer.concat(chunks).toString('utf8'));
          const dataUrl = String(payload.dataUrl || '');
          const m = dataUrl.match(/^data:([^;]+);base64,(.+)$/s);
          if (!m) { res.writeHead(400); return res.end(); }
          const mime = m[1].toLowerCase();
          const buf = Buffer.from(m[2], 'base64');
          const ext = mime.includes('mp4') || mime.includes('video') ? 'mp4'
            : mime.includes('png') ? 'png'
            : mime.includes('webp') ? 'webp' : 'jpg';
          const rawName = String(payload.filename || `Story_${Date.now()}.${ext}`)
            .replace(/[\\/:*?"<>|\r\n]/g, '_');
          const finalName = rawName.includes('.') ? rawName : `${rawName}.${ext}`;
          const storiesDir = path.join(mgr?.settings?.saveDir || path.join(app.getPath('downloads'), 'Tayyar'), 'Stories');
          fs.mkdirSync(storiesDir, { recursive: true });
          const destPath = path.join(storiesDir, finalName);
          fs.writeFileSync(destPath, buf);
          if (Notification.isSupported()) {
            new Notification({ title: 'Tayyar Story Saved', body: finalName }).show();
          }
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true, path: destPath, filename: finalName }));
        } catch (_) {
          res.writeHead(400); res.end();
        }
      });
      return;
    }

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
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true }));
      } catch (_) { res.writeHead(400); res.end(); }
    });
  });
  srv.on('error', () => { /* port busy: extension integration disabled */ });
  srv.listen(BRIDGE_PORT, '127.0.0.1');
}

/** Suggest a download when a file link is copied (IDM-style clipboard monitoring for 200+ formats). */
function watchClipboard() {
  let last = '';
  setInterval(() => {
    if (!mgr || !mgr.settings || !mgr.settings.watchClipboard) return;
    const text = clipboard.readText().trim();
    if (text && text !== last && isDownloadableUrl(text)) {
      last = text;
      send('ui:clip-url', { url: text });
    }
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
  h('add', (opts, extra) => {
    try {
      let finalOpts = opts;
      if (typeof opts === 'string') {
        finalOpts = Object.assign({ url: opts }, extra || {});
      }
      return { ok: true, item: mgr.add(finalOpts) };
    } catch (e) {
      return { ok: false, error: e.message };
    }
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
  h('openExtensionFolder', (type) => {
    const folder = type === 'firefox' ? 'extension-firefox' : 'extension';
    const p = path.join(__dirname, '..', folder);
    shell.openPath(p);
    return { ok: true, path: p };
  });
  h('openUrl', (u) => {
    if (/^https?:\/\//i.test(u)) shell.openExternal(u);
  });
  h('installUpdate', (filePath) => {
    if (filePath) {
      shell.openPath(filePath);
      return { ok: true };
    }
    return { ok: false };
  });
  h('trackers:fetch', async () => {
    const urls = [
      'https://cdn.jsdelivr.net/gh/ngosang/trackerslist@master/trackers_best.txt',
      'https://cdn.jsdelivr.net/gh/XIU2/TrackersListCollection@master/best.txt',
      'https://raw.githubusercontent.com/ngosang/trackerslist/master/trackers_best.txt',
      'https://raw.githubusercontent.com/XIU2/TrackersListCollection/master/best.txt'
    ];
    const fetchOne = (u) => new Promise((resolve) => {
      const client = u.startsWith('https:') ? https : http;
      client.get(u, { timeout: 6000 }, (res) => {
        if (res.statusCode !== 200) return resolve([]);
        let b = '';
        res.on('data', (c) => b += c);
        res.on('end', () => {
          const lines = b.split('\n').map((l) => l.trim()).filter((l) => l.startsWith('http') || l.startsWith('udp') || l.startsWith('wss'));
          resolve(lines);
        });
      }).on('error', () => resolve([])).on('timeout', () => resolve([]));
    });

    const results = await Promise.all(urls.map(fetchOne));
    const set = new Set();
    results.flat().forEach((t) => set.add(t));
    return Array.from(set);
  });
  h('social:detect', (url) => social.detectPlatform(url));
  h('social:resolve', async (url) => {
    try {
      return await social.resolveSocialMedia(url);
    } catch (e) {
      return { ok: false, error: e.message };
    }
  });
  h('stories:resolve', async (input, platform, opts) => {
    try {
      return await social.resolveStories(input, platform, opts || {});
    } catch (e) {
      return { ok: false, stories: [], error: e.message };
    }
  });
  h('ytdlp:check', async () => social.isYtDlpAvailable());
  h('ytdlp:install', async () => {
    try {
      return await social.downloadYtDlp((prog) => send('ytdlp:progress', prog));
    } catch (e) {
      return { ok: false, error: e.message };
    }
  });
}

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('UNHANDLED REJECTION:', reason);
});

app.whenReady().then(() => {
  console.log('App ready triggered');
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
  console.log('All initialized');
  app.on('activate', () => { if (!win) createWindow(); });
}).catch((err) => {
  console.error('whenReady error:', err);
});

app.on('before-quit', () => { if (mgr) mgr.shutdown(); });
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
