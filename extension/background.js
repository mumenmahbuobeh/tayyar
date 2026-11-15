// Hands links to the Tayyar desktop app through its local bridge (127.0.0.1:6824).
const BRIDGE = 'http://127.0.0.1:6824/add';

async function sendToTayyar(url, referer) {
  try {
    const r = await fetch(BRIDGE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Tayyar': '1' },
      body: JSON.stringify({ url, referer: referer || '' }),
    });
    return r.ok;
  } catch (_) {
    return false; // app not running: let the browser handle it
  }
}

async function enabled() { return (await chrome.storage.local.get({ capture: true })).capture; }
async function paintBadge() { chrome.action.setBadgeText({ text: (await enabled()) ? '' : 'OFF' }); }

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({ id: 'tayyar-link', title: 'Download with Tayyar | حمّل بواسطة تيّار', contexts: ['link', 'video', 'audio'] });
  paintBadge();
});
chrome.runtime.onStartup.addListener(paintBadge);

chrome.contextMenus.onClicked.addListener((info, tab) => {
  const url = info.linkUrl || info.srcUrl;
  if (url) sendToTayyar(url, tab && tab.url);
});

// Capture normal browser downloads (only if the app is running; otherwise the browser continues).
chrome.downloads.onCreated.addListener(async (item) => {
  if (!(await enabled()) || !/^https?:/i.test(item.url)) return;
  if (await sendToTayyar(item.finalUrl || item.url, item.referrer)) {
    chrome.downloads.cancel(item.id, () => chrome.downloads.erase({ id: item.id }));
  }
});

chrome.action.onClicked.addListener(async () => {
  await chrome.storage.local.set({ capture: !(await enabled()) });
  paintBadge();
});
