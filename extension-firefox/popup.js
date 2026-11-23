'use strict';

const I18N = {
  en: {
    tagline: 'Next Gen Download Manager',
    connected: 'Desktop App: Connected',
    offline: 'Desktop App: Offline (Start Tayyar)',
    bridgeMeta: 'Bridge (127.0.0.1:6824)',
    onlineTag: 'ONLINE',
    offlineTag: 'OFFLINE',
    quickAdd: 'Quick Download',
    quickHint: 'Direct URL & Streams',
    placeholder: 'https://example.com/file.zip',
    capture: 'Intercept Downloads',
    captureDesc: 'Capture browser downloads automatically',
    videoBadge: 'Floating Video Button',
    videoBadgeDesc: 'Show quick download badge on video players',
    openDesktop: 'Open Desktop App',
    downloadZip: 'Export .ZIP',
    sentOk: '✓ Sent to Tayyar Turbo Engine!',
    sentFail: '✕ Could not reach Tayyar desktop app',
    invalidUrl: 'Please enter a valid HTTP or HTTPS link',
    langBtn: 'AR',
  },
  ar: {
    tagline: 'مدير تحميلات الجيل القادم فائق السرعة',
    connected: 'التطبيق المكتبي: متصل وجاهز',
    offline: 'التطبيق المكتبي: غير متصل (شغّل تيّار)',
    bridgeMeta: 'الربط المباشر (127.0.0.1:6824)',
    onlineTag: 'متصل',
    offlineTag: 'غير متصل',
    quickAdd: 'تحميل فوري سريع',
    quickHint: 'روابط مباشرة وفيديوهات',
    placeholder: 'ضع رابط الملف هنا (https://)...',
    capture: 'التقاط التحميلات تلقائياً',
    captureDesc: 'تحويل كافة تحميلات المتصفح لتيّار',
    videoBadge: 'زر التحميل العائم',
    videoBadgeDesc: 'إظهار زر التحميل فوق مشغلات الفيديو',
    openDesktop: 'فتح التطبيق',
    downloadZip: 'تصدير كـ ZIP',
    sentOk: '✓ تم إرسال الرابط لمحرك تيّار بنجاح!',
    sentFail: '✕ تعذر الاتصال ببرنامج تيّار المكتبي',
    invalidUrl: 'الرجاء إدخال رابط تحميل صحيح يبدأ بـ http',
    langBtn: 'EN',
  },
};

let currentLang = 'en';

function applyLang(lang) {
  currentLang = lang;
  const d = I18N[lang];
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

  document.getElementById('bLang').textContent = d.langBtn;
  document.getElementById('txtTagline').textContent = d.tagline;
  document.getElementById('lblQuickAdd').textContent = d.quickAdd;
  document.getElementById('lblQuickHint').textContent = d.quickHint;
  document.getElementById('quickUrlInput').placeholder = d.placeholder;
  document.getElementById('lblCapture').textContent = d.capture;
  document.getElementById('descCapture').textContent = d.captureDesc;
  document.getElementById('lblVideoBadge').textContent = d.videoBadge;
  document.getElementById('descVideoBadge').textContent = d.videoBadgeDesc;
  document.getElementById('txtOpenDesk').textContent = d.openDesktop;
  document.getElementById('txtDownloadZip').textContent = d.downloadZip;
  document.getElementById('statusSub').textContent = d.bridgeMeta;
}

document.addEventListener('DOMContentLoaded', async () => {
  const bLang = document.getElementById('bLang');
  const statusCard = document.getElementById('statusCard');
  const statusTxt = document.getElementById('statusTxt');
  const statusTag = document.getElementById('statusTag');
  const chkCapture = document.getElementById('chkCapture');
  const chkVideoBadge = document.getElementById('chkVideoBadge');
  const quickUrlInput = document.getElementById('quickUrlInput');
  const bSendDownload = document.getElementById('bSendDownload');
  const bOpenDesktop = document.getElementById('bOpenDesktop');
  const bDownloadZip = document.getElementById('bDownloadZip');
  const feedbackMsg = document.getElementById('feedbackMsg');

  // Load preferences
  const prefs = await chrome.storage.local.get({
    captureDownloads: true,
    showVideoBadge: true,
    lang: 'en',
  });

  chkCapture.checked = prefs.captureDownloads;
  chkVideoBadge.checked = prefs.showVideoBadge;
  if (prefs.lang) applyLang(prefs.lang);

  bLang.addEventListener('click', () => {
    const next = currentLang === 'en' ? 'ar' : 'en';
    applyLang(next);
    chrome.storage.local.set({ lang: next });
    checkConnection();
  });

  // Check connection status with Tayyar Desktop
  function checkConnection() {
    chrome.runtime.sendMessage({ type: 'PING' }, (resp) => {
      const d = I18N[currentLang];
      if (resp && resp.online) {
        statusCard.className = 'status-card';
        statusTxt.textContent = d.connected;
        statusTxt.style.color = '#ffffff';
        statusTag.textContent = d.onlineTag;
      } else {
        statusCard.className = 'status-card offline';
        statusTxt.textContent = d.offline;
        statusTxt.style.color = '#ef4444';
        statusTag.textContent = d.offlineTag;
      }
    });
  }

  checkConnection();

  // Settings Toggles
  chkCapture.addEventListener('change', () => {
    chrome.storage.local.set({ captureDownloads: chkCapture.checked }, () => {
      chrome.runtime.sendMessage({ type: 'UPDATE_BADGE' });
    });
  });

  chkVideoBadge.addEventListener('change', () => {
    chrome.storage.local.set({ showVideoBadge: chkVideoBadge.checked });
  });

  // Send Quick Download
  function sendDownload() {
    const raw = quickUrlInput.value.trim();
    const d = I18N[currentLang];
    if (!/^https?:\/\//i.test(raw)) {
      feedbackMsg.textContent = d.invalidUrl;
      feedbackMsg.style.color = '#ef4444';
      feedbackMsg.hidden = false;
      return;
    }

    feedbackMsg.textContent = currentLang === 'ar' ? 'جارٍ الإرسال إلى تيّار...' : 'Sending to Tayyar...';
    feedbackMsg.style.color = '#00f0ff';
    feedbackMsg.hidden = false;

    chrome.runtime.sendMessage({ type: 'SEND_URL', url: raw }, (resp) => {
      if (resp && resp.ok) {
        feedbackMsg.textContent = d.sentOk;
        feedbackMsg.style.color = '#10b981';
        quickUrlInput.value = '';
        setTimeout(() => { feedbackMsg.hidden = true; }, 3200);
      } else {
        feedbackMsg.textContent = d.sentFail;
        feedbackMsg.style.color = '#ef4444';
      }
    });
  }

  bSendDownload.addEventListener('click', sendDownload);
  quickUrlInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendDownload();
  });

  // Open Desktop App Action
  bOpenDesktop.addEventListener('click', async () => {
    try {
      await fetch('http://127.0.0.1:6824/show-app', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Tayyar': '1' },
        body: JSON.stringify({ action: 'show' }),
      });
    } catch (_) {
      // If offline, inform user
      feedbackMsg.textContent = I18N[currentLang].offline;
      feedbackMsg.style.color = '#ef4444';
      feedbackMsg.hidden = false;
      setTimeout(() => { feedbackMsg.hidden = true; }, 3000);
    }
  });

  // Download / Export ZIP Action
  bDownloadZip.addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://github.com/mumenmahbuobeh/tayyar/releases/latest' });
  });
});
