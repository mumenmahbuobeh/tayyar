'use strict';

/**
 * Tayyar Browser Extension — Background Service Worker
 * Coordinates link interception, context menus, and communication with the Tayyar desktop app.
 */

const BRIDGE_ADD = 'http://127.0.0.1:6824/add';
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

async function sendToTayyar(url, referer) {
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

// Automatic browser download interception (like IDM)
chrome.downloads.onCreated.addListener(async (downloadItem) => {
  const cfg = await getSettings();
  if (!cfg.captureDownloads) return;

  const url = downloadItem.finalUrl || downloadItem.url;
  if (!url || !/^https?:\/\//i.test(url)) return;

  // Attempt to delegate to Tayyar
  const handled = await sendToTayyar(url, downloadItem.referrer);
  if (handled) {
    // Successfully handed off to desktop manager: cancel the native browser download
    try {
      chrome.downloads.cancel(downloadItem.id, () => {
        chrome.downloads.erase({ id: downloadItem.id }, () => {});
      });
    } catch (_) {}
  }
});

// Message listener for popup & content scripts
chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  if (req.type === 'PING') {
    pingTayyar().then((online) => sendResponse({ online }));
    return true;
  }
  if (req.type === 'SEND_URL') {
    sendToTayyar(req.url, req.referer || sender?.tab?.url).then((ok) => sendResponse({ ok }));
    return true;
  }
  if (req.type === 'UPDATE_BADGE') {
    updateBadge();
    sendResponse({ ok: true });
    return false;
  }
});
