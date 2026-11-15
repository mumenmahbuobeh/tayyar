'use strict';

const I18N = {
  en: {
    tagline: 'Next Gen Download Manager',
    connected: 'Desktop App: Connected',
    offline: 'Desktop App: Offline (Open Tayyar)',
    quickAdd: 'Quick Download',
    placeholder: 'https://example.com/file.zip',
    capture: 'Intercept Downloads',
    captureDesc: 'Capture browser downloads automatically',
    videoBadge: 'Floating Video Button',
    videoBadgeDesc: 'Show quick download badge on video players',
    sentOk: '✓ Sent to Tayyar desktop app!',
    sentFail: '✕ Could not reach Tayyar desktop app',
    invalidUrl: 'Please enter a valid HTTP or HTTPS link',
    langBtn: 'AR',
  },
  ar: {
    tagline: 'مدير تحميلات فائق السرعة',
    connected: 'التطبيق المكتبي: متصل وجاهز',
    offline: 'التطبيق المكتبي: غير متصل (افتح تيّار)',
    quickAdd: 'تحميل سريع',
    placeholder: 'ضع رابط الملف هنا...',
    capture: 'التقاط التحميلات تلقائياً',
    captureDesc: 'تحويل كافة تحميلات المتصفح لتيّار',
    videoBadge: 'زر تحميل الفيديوهات',
    videoBadgeDesc: 'إظهار زر التحميل العائم فوق مشغلات الفيديو',
    sentOk: '✓ تم إرسال الرابط لبرنامج تيّار بنجاح!',
    sentFail: '✕ تعذر الاتصال ببرنامج تيّار المكتبي',
    invalidUrl: 'الرجاء إدخال رابط تحميل صحيح',
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
  document.getElementById('quickUrlInput').placeholder = d.placeholder;
  document.getElementById('lblCapture').textContent = d.capture;
  document.getElementById('descCapture').textContent = d.captureDesc;
  document.getElementById('lblVideoBadge').textContent = d.videoBadge;
  document.getElementById('descVideoBadge').textContent = d.videoBadgeDesc;
}

document.addEventListener('DOMContentLoaded', async () => {
  const bLang = document.getElementById('bLang');
  const statusDot = document.getElementById('statusDot');
  const statusTxt = document.getElementById('statusTxt');
  const chkCapture = document.getElementById('chkCapture');
  const chkVideoBadge = document.getElementById('chkVideoBadge');
  const quickUrlInput = document.getElementById('quickUrlInput');
  const bSendDownload = document.getElementById('bSendDownload');
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

  // Check connection status
  function checkConnection() {
    chrome.runtime.sendMessage({ type: 'PING' }, (resp) => {
      const d = I18N[currentLang];
      if (resp && resp.online) {
        statusDot.className = 'status-dot online';
        statusTxt.textContent = d.connected;
        statusTxt.style.color = '#10b981';
      } else {
        statusDot.className = 'status-dot offline';
        statusTxt.textContent = d.offline;
        statusTxt.style.color = '#ef4444';
      }
    });
  }

  checkConnection();

  // Toggles
  chkCapture.addEventListener('change', () => {
    chrome.storage.local.set({ captureDownloads: chkCapture.checked }, () => {
      chrome.runtime.sendMessage({ type: 'UPDATE_BADGE' });
    });
  });

  chkVideoBadge.addEventListener('change', () => {
    chrome.storage.local.set({ showVideoBadge: chkVideoBadge.checked });
  });

  // Quick download send
  function sendDownload() {
    const raw = quickUrlInput.value.trim();
    const d = I18N[currentLang];
    if (!/^https?:\/\//i.test(raw)) {
      feedbackMsg.textContent = d.invalidUrl;
      feedbackMsg.style.color = '#ef4444';
      feedbackMsg.hidden = false;
      return;
    }

    feedbackMsg.textContent = 'Sending...';
    feedbackMsg.style.color = '#06b6d4';
    feedbackMsg.hidden = false;

    chrome.runtime.sendMessage({ type: 'SEND_URL', url: raw }, (resp) => {
      if (resp && resp.ok) {
        feedbackMsg.textContent = d.sentOk;
        feedbackMsg.style.color = '#10b981';
        quickUrlInput.value = '';
        setTimeout(() => { feedbackMsg.hidden = true; }, 3000);
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
});
