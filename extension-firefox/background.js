'use strict';

/**
 * Tayyar Browser Extension — Background Service Worker (Firefox)
 * Coordinates link interception, context menus, media sniffing, and communication with the Tayyar desktop app.
 */

const BRIDGE_ADD = 'http://127.0.0.1:6824/add';
const BRIDGE_ADD_BLOB = 'http://127.0.0.1:6824/add-blob';
const BRIDGE_PING = 'http://127.0.0.1:6824/ping';

async function getSettings() {
  return await chrome.storage.local.get({
    captureDownloads: true,
    showVideoBadge: true,
    bypassList: ['blob:', 'data:', 'file:'],
  });
}

async function pingTayyar() {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 1200);
    const res = await fetch(BRIDGE_PING, { signal: ctrl.signal });
    clearTimeout(t);
    return res.ok;
  } catch (_) {
    return false;
  }
}

async function sendToTayyar(url, referer, filename = '', isSocial = false) {
  if (!url || typeof url !== 'string') return false;
  try {
    const res = await fetch(BRIDGE_ADD, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Tayyar': '1',
      },
      body: JSON.stringify({
        url: url.trim(),
        referer: referer || '',
        filename: filename || '',
        isSocial: !!isSocial,
      }),
    });
    return res.ok;
  } catch (_) {
    return false; // Desktop app offline
  }
}

async function updateBadge() {
  const cfg = await getSettings();
  if (!cfg.captureDownloads) {
    chrome.action.setBadgeText({ text: 'OFF' });
    chrome.action.setBadgeBackgroundColor({ color: '#64748b' });
    return;
  }

  const isOnline = await pingTayyar();
  if (isOnline) {
    chrome.action.setBadgeText({ text: 'ON' });
    chrome.action.setBadgeBackgroundColor({ color: '#06b6d4' }); // Tayyar Cyan
  } else {
    chrome.action.setBadgeText({ text: '!' });
    chrome.action.setBadgeBackgroundColor({ color: '#f59e0b' });
  }
}

// Setup context menus
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: 'tayyar-download-link',
      title: '⚡ Download with Tayyar | حمّل بواسطة تيّار',
      contexts: ['link', 'video', 'audio', 'image'],
    });
    chrome.contextMenus.create({
      id: 'tayyar-download-page',
      title: '📥 Send Page to Tayyar | إرسال الرابط لتيّار',
      contexts: ['page'],
    });
  });
  updateBadge();
});

chrome.runtime.onStartup.addListener(updateBadge);

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  const targetUrl = info.linkUrl || info.srcUrl || (info.menuItemId === 'tayyar-download-page' ? tab?.url : null);
  if (targetUrl) {
    const ok = await sendToTayyar(targetUrl, tab?.url);
    if (!ok) {
      chrome.notifications?.create({
        type: 'basic',
        iconUrl: 'icons/icon-48.png',
        title: 'Tayyar Download Manager',
        message: 'Could not connect to Tayyar desktop app. Please ensure Tayyar is running.',
      });
    }
  }
});

// Network Media Sniffer (captures HLS, DASH, direct MP4, WebM, audio streams)
const tabMediaRegistry = new Map();

if (chrome.webRequest?.onHeadersReceived) {
  try {
    chrome.webRequest.onHeadersReceived.addListener(
      (details) => {
        if (!details.tabId || details.tabId < 0) return;
        const url = details.url;
        if (!url || !/^https?:\/\//i.test(url)) return;

        const headers = details.responseHeaders || [];
        const ctHeader = headers.find((h) => h.name.toLowerCase() === 'content-type');
        const clHeader = headers.find((h) => h.name.toLowerCase() === 'content-length');
        const mime = ctHeader?.value?.toLowerCase() || '';
        const size = clHeader ? parseInt(clHeader.value, 10) : 0;

        const isHLS = mime.includes('mpegurl') || mime.includes('x-mpegurl') || url.includes('.m3u8');
        const isDASH = mime.includes('dash+xml') || url.includes('.mpd');
        const isSegment = /\.(ts|m4s)(\?|$)/i.test(url) && !isHLS && !isDASH;
        const isVideoAudio = !isSegment && (mime.startsWith('video/') || mime.startsWith('audio/') || isHLS || isDASH);
        const isMediaExt = !isSegment && /\.(m3u8|mpd|mp4|webm|m4a|mp3|flv|mkv|aac|ogg)(\?|$)/i.test(url);

        if (size > 0 && size < 4096 && !isHLS && !isDASH) return;

        if (isVideoAudio || isMediaExt) {
          if (!tabMediaRegistry.has(details.tabId)) {
            tabMediaRegistry.set(details.tabId, []);
          }
          const list = tabMediaRegistry.get(details.tabId);
          if (!list.some((m) => m.url === url)) {
            let guessTitle = 'media_stream';
            try {
              const uObj = new URL(url);
              const pathEnd = uObj.pathname.split('/').filter(Boolean).pop();
              if (pathEnd) guessTitle = decodeURIComponent(pathEnd).split('?')[0];
            } catch (_) {}

            const item = {
              url,
              mime: mime || (isHLS ? 'application/x-mpegurl' : 'video/mp4'),
              size,
              isHLS,
              isDASH,
              title: guessTitle,
              timestamp: Date.now()
            };
            list.unshift(item);
            if (list.length > 30) list.pop();

            try {
              chrome.tabs.sendMessage(details.tabId, {
                type: 'TAYYAR_STREAM_DETECTED',
                media: item
              }).catch(() => {});
            } catch (_) {}
          }
        }
      },
      { urls: ['<all_urls>'] },
      ['responseHeaders']
    );
  } catch (_) {}
}

chrome.tabs?.onRemoved?.addListener((tabId) => {
  tabMediaRegistry.delete(tabId);
});

// Automatic browser download interception (like IDM)
chrome.downloads.onCreated.addListener(async (downloadItem) => {
  const cfg = await getSettings();
  if (!cfg.captureDownloads) return;

  const url = downloadItem.finalUrl || downloadItem.url;
  if (!url || !/^https?:\/\//i.test(url)) return;

  let suggestedName = '';
  if (downloadItem.filename) {
    suggestedName = downloadItem.filename.replace(/^.*[\\\/]/, '');
  }

  const handled = await sendToTayyar(url, downloadItem.referrer, suggestedName);
  if (handled) {
    try {
      chrome.downloads.cancel(downloadItem.id, () => {
        chrome.downloads.erase({ id: downloadItem.id }, () => {});
      });
    } catch (_) {}
  }
});

async function sendBlobToTayyar(dataUrl, filename) {
  if (!dataUrl || typeof dataUrl !== 'string') return false;
  try {
    const res = await fetch(BRIDGE_ADD_BLOB, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Tayyar': '1',
      },
      body: JSON.stringify({ dataUrl, filename: filename || `Story_${Date.now()}.mp4` }),
    });
    return res.ok;
  } catch (_) {
    return false;
  }
}

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  if (req.type === 'PING') {
    pingTayyar().then((online) => sendResponse({ online }));
    return true;
  }
  if (req.type === 'SEND_URL') {
    sendToTayyar(req.url, req.referer || sender?.tab?.url, req.filename, req.isSocial).then((ok) => sendResponse({ ok }));
    return true;
  }
  if (req.type === 'SEND_BLOB') {
    sendBlobToTayyar(req.dataUrl, req.filename).then((ok) => sendResponse({ ok }));
    return true;
  }
  if (req.type === 'GET_TAB_MEDIA') {
    const tabId = sender?.tab?.id;
    if (tabId) {
      sendResponse({ media: tabMediaRegistry.get(tabId) || [] });
      return false;
    }
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeId = tabs?.[0]?.id;
      sendResponse({ media: (activeId ? tabMediaRegistry.get(activeId) : []) || [] });
    });
    return true;
  }
  if (req.type === 'UPDATE_BADGE') {
    updateBadge();
    sendResponse({ ok: true });
    return false;
  }
});
