'use strict';

(() => {
  const APP_VERSION = '1.0.10';
  const STORAGE_KEY_DLS = 'tayyar_mobile_downloads_v2';
  const STORAGE_KEY_LANG = 'tayyar_lang';
  const STORAGE_KEY_AURA = 'tayyar_mobile_aura';
  const STORAGE_KEY_PREFS = 'tayyar_mobile_prefs';
  const STORAGE_KEY_CHANNEL = 'tayyar_update_channel';

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

  /* ==================== 100% BILINGUAL I18N (EN & AR) ==================== */
  const I18N = {
    en: {
      appTitle: 'Tayyar',
      tabHomeTitle: 'Tayyar',
      homeSubtitle: 'Universal Liquid Glass Downloader',
      engineReady: 'Turbo Engine Ready',
      urlPlaceholder: 'Paste TikTok, YouTube, Instagram, or file link...',
      paste: 'Paste',
      extractBtn: 'Analyze & Download',
      statActive: 'Active',
      statDone: 'Saved',
      statSpeed: 'Speed',
      analyzingStream: 'Extracting highest quality stream...',
      noWatermarkBadge: 'No Watermark • Full Audio',
      dlFullVideo: 'Download Full Video (MP4 + Audio)',
      dlAudioOnly: 'Download Pure Audio (MP3)',
      quickPlatforms: 'Quick Platforms',
      seeAll: 'See all',
      recentDownloads: 'Recent Downloads',
      platformsTitle: 'Platforms',
      platformsSubtitle: 'Choose a source for 1-tap watermark-free saving',
      tileNoWm: 'No Watermark HD',
      tileYtDesc: 'Video MP4 & MP3',
      tileIgDesc: 'Reels & Stories',
      tileFbDesc: 'HD Watch & Reels',
      tileSnapDesc: 'Spotlight Videos',
      tileXDesc: 'Direct HD MP4',
      tileRedditDesc: 'Posts & Clips',
      tileDirectDesc: 'APK, ZIP, PDF, Any File',
      directFiles: 'Direct Files',
      downloadsTitle: 'Downloads',
      downloadsSubtitle: 'Saved directly to Downloads/Tayyar & Gallery',
      clearCompleted: 'Clear Completed',
      filterAll: 'All',
      filterActive: 'Active',
      filterCompleted: 'Saved',
      filterFailed: 'Failed',
      settingsTitle: 'Settings',
      identitySub: 'Apple Liquid Glass Edition • Native Android & iOS',
      grpGeneral: 'Language & Appearance',
      languageLbl: 'Language',
      languageHint: 'Switch between full English & Arabic',
      auraThemeLbl: 'Liquid Glass Aura',
      auraThemeHint: 'Top atmospheric glow color',
      spatialPhysicsLbl: 'Antigravity 3D Physics',
      spatialPhysicsHint: 'Weightless floating inertia, tilt & glass refraction',
      grpDownload: 'Download Preferences',
      defaultFormatLbl: 'Default Mode',
      defaultFormatHint: 'Preferred stream when downloading',
      fmtVideoOpt: 'Video MP4',
      fmtAudioOpt: 'Audio MP3',
      autoGalleryLbl: 'Save to Gallery',
      autoGalleryHint: 'Index videos immediately in Photos / Gallery',
      autoAnalyzeLbl: 'Auto-Analyze on Paste',
      autoAnalyzeHint: 'Extract video immediately after pasting',
      grpUpdates: 'App Updates',
      upToDate: 'Tayyar is up to date',
      upToDateDesc: `Version ${APP_VERSION} is the latest stable release.`,
      check: 'Check',
      checking: 'Checking...',
      updateNow: 'Download New Update',
      updateChannelLbl: 'Update Channel',
      updateChannelHint: 'Stable releases recommended',
      channelStable: 'Stable',
      channelBeta: 'Beta',
      betaWarning: 'Beta builds may be less stable. Switching back to Stable stops beta notifications.',
      grpAbout: 'About',
      githubRepo: 'GitHub Repository',
      developerLbl: 'Developer',
      searchTitle: 'Search',
      searchPlaceholder: 'Search saved files or paste any video URL...',
      navHome: 'Home',
      navPlatforms: 'Platforms',
      navDownloads: 'Downloads',
      navSettings: 'Settings',
      navSearch: 'Search',
      statusDownloading: 'Downloading',
      statusSaved: 'Saved to Gallery',
      statusFailed: 'Failed',
      statusPaused: 'Cancelled',
      emptyRecentTitle: 'No downloads yet',
      emptyRecentSub: 'Paste any video or file link above to start instantly',
      emptyListTitle: 'Nothing here yet',
      emptyListSub: 'Your active and completed downloads appear here',
      emptySearchTitle: 'Search or Paste URL',
      emptySearchSub: 'Type a filename to filter or paste a video link to download',
      pasteSuccess: 'Link pasted from clipboard',
      clipboardEmpty: 'Clipboard is empty',
      invalidUrl: 'Please enter a valid http/https link',
      dlStartedVideo: 'Downloading full video with audio...',
      dlStartedAudio: 'Downloading pure MP3 audio...',
      dlStartedFile: 'Download started!',
      dlDoneToast: 'Saved to Downloads & Gallery!',
      dlFailToast: 'Download failed',
      dlCancelled: 'Download cancelled',
      clearedDone: 'Cleared completed items',
      langSwitched: 'Switched to English',
      platSelectedHint: 'Paste your link to download from',
      alreadyLatestToast: `Tayyar is already up to date (v${APP_VERSION})`,
      newVerAvailable: 'New update available:',
      openOrAnalyze: 'Analyze & Download this link',
    },
    ar: {
      appTitle: 'تيّار',
      tabHomeTitle: 'تيّار',
      homeSubtitle: 'منزّل الفيديوهات والملفات بتصميم Apple Liquid Glass',
      engineReady: 'المحرك التوربيني جاهز',
      urlPlaceholder: 'الصق رابط تيك توك، يوتيوب، انستجرام، أو أي ملف...',
      paste: 'لصق',
      extractBtn: 'فحص وتحميل',
      statActive: 'نشط',
      statDone: 'محفوظ',
      statSpeed: 'السرعة',
      analyzingStream: 'جاري استخراج أعلى جودة متاحة...',
      noWatermarkBadge: 'بدون علامة مائية • صوت كامل',
      dlFullVideo: 'تحميل الفيديو كامل (صوت + صورة MP4)',
      dlAudioOnly: 'تحميل الصوت فقط (MP3 نقي)',
      quickPlatforms: 'منصات سريعة',
      seeAll: 'عرض الكل',
      recentDownloads: 'أحدث التحميلات',
      platformsTitle: 'المنصات',
      platformsSubtitle: 'اختر المنصة للحفظ المباشر بدون علامة مائية',
      tileNoWm: 'عالي الدقة بدون شعار',
      tileYtDesc: 'فيديو MP4 وصوت MP3',
      tileIgDesc: 'ريلز وستوريات',
      tileFbDesc: 'مقاطع HD وريلز',
      tileSnapDesc: 'مقاطع Spotlight',
      tileXDesc: 'فيديو MP4 مباشر',
      tileRedditDesc: 'منشورات ومقاطع',
      tileDirectDesc: 'APK، ZIP، PDF، وأي ملف',
      directFiles: 'ملفات مباشرة',
      downloadsTitle: 'التحميلات',
      downloadsSubtitle: 'تُحفظ مباشرة في مجلد Downloads/Tayyar والاستوديو',
      clearCompleted: 'مسح المكتملة',
      filterAll: 'الكل',
      filterActive: 'النشطة',
      filterCompleted: 'المحفوظة',
      filterFailed: 'فشلت',
      settingsTitle: 'الإعدادات',
      identitySub: 'إصدار Apple Liquid Glass • مخصص لأندرويد وآيفون',
      grpGeneral: 'اللغة والمظهر',
      languageLbl: 'اللغة',
      languageHint: 'التبديل بين العربية الكاملة والإنجليزية الكاملة',
      auraThemeLbl: 'هالة الزجاج السائل',
      auraThemeHint: 'لون الإضاءة العلوية للواجهة',
      spatialPhysicsLbl: 'فيزياء Antigravity ثلاثية الأبعاد',
      spatialPhysicsHint: 'طفو انسيابي، إمالة تفاعلية، وانكسار ضوئي للزجاج',
      grpDownload: 'تفضيلات التحميل',
      defaultFormatLbl: 'الوضع الافتراضي',
      defaultFormatHint: 'الصيغة المفضلة عند التحميل',
      fmtVideoOpt: 'فيديو MP4',
      fmtAudioOpt: 'صوت MP3',
      autoGalleryLbl: 'الحفظ في المعرض تلقائياً',
      autoGalleryHint: 'إظهار الفيديوهات فوراً في استوديو الهاتف',
      autoAnalyzeLbl: 'فحص تلقائي عند اللصق',
      autoAnalyzeHint: 'استخراج الفيديو مباشرة فور لصق الرابط',
      grpUpdates: 'تحديثات التطبيق',
      upToDate: 'تطبيق تيّار محدّث لأحدث إصدار',
      upToDateDesc: `الإصدار ${APP_VERSION} هو أحدث إصدار مستقر متوفر.`,
      check: 'فحص',
      checking: 'جاري الفحص...',
      updateNow: 'تحميل التحديث الجديد',
      updateChannelLbl: 'قناة التحديثات',
      updateChannelHint: 'يُنصح بالإصدارات المستقرة',
      channelStable: 'مستقر (Stable)',
      channelBeta: 'تجريبي (Beta)',
      betaWarning: 'الإصدارات التجريبية قد تكون أقل استقراراً. العودة للمستقر توقف تنبيهات التجريبي.',
      grpAbout: 'حول التطبيق',
      githubRepo: 'مستودع GitHub الرسمي',
      developerLbl: 'المطور',
      searchTitle: 'بحث',
      searchPlaceholder: 'ابحث في الملفات المحفوظة أو الصق رابط فيديو...',
      navHome: 'الرئيسية',
      navPlatforms: 'المنصات',
      navDownloads: 'التحميلات',
      navSettings: 'الإعدادات',
      navSearch: 'بحث',
      statusDownloading: 'جاري التحميل',
      statusSaved: 'محفوظ في الاستوديو',
      statusFailed: 'فشل',
      statusPaused: 'تم الإلغاء',
      emptyRecentTitle: 'لا توجد تحميلات بعد',
      emptyRecentSub: 'الصق أي رابط فيديو أو ملف بالأعلى للبدء فوراً',
      emptyListTitle: 'القائمة فارغة حالياً',
      emptyListSub: 'ستظهر جميع تحميلاتك النشطة والمحفوظة هنا',
      emptySearchTitle: 'ابحث أو الصق رابطاً',
      emptySearchSub: 'اكتب اسم ملف للبحث أو الصق رابط فيديو لتحميله فوراً',
      pasteSuccess: 'تم لصق الرابط من الحافظة',
      clipboardEmpty: 'الحافظة فارغة',
      invalidUrl: 'يرجى إدخال رابط صحيح يبدأ بـ http أو https',
      dlStartedVideo: 'بدأ تحميل الفيديو كامل بالصوت...',
      dlStartedAudio: 'بدأ تحميل الصوت MP3...',
      dlStartedFile: 'بدأ التحميل الآن!',
      dlDoneToast: 'تم الحفظ في التحميلات والمعرض بنجاح!',
      dlFailToast: 'فشل التحميل',
      dlCancelled: 'تم إلغاء التحميل',
      clearedDone: 'تم مسح العناصر المكتملة',
      langSwitched: 'تم التحويل إلى العربية',
      platSelectedHint: 'الصق الرابط الآن للتحميل من',
      alreadyLatestToast: `تطبيق تيّار محدّث بالفعل على أحدث إصدار (v${APP_VERSION})`,
      newVerAvailable: 'تحديث جديد متوفر:',
      openOrAnalyze: 'فحص وتحميل هذا الرابط',
    },
  };

  /* ==================== STATE ==================== */
  const state = {
    lang: 'en',
    activeTab: 'home',
    filter: 'all',
    aura: 'theme-spatial',
    prefs: {
      defaultFormat: 'video',
      autoGallery: true,
      autoAnalyze: true,
      spatialPhysics: true,
    },
    downloads: [],
    currentResolved: null,
    activePolls: new Map(),
    updateRelease: null,
    hasNewerUpdate: false,
  };

  function t(key) {
    return (I18N[state.lang] && I18N[state.lang][key]) || I18N.en[key] || key;
  }

  /* ==================== UTILITIES ==================== */
  function fmtBytes(bytes) {
    const n = Number(bytes) || 0;
    if (n <= 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    let v = n;
    let i = 0;
    while (v >= 1024 && i < units.length - 1) { v /= 1024; i++; }
    return `${v.toFixed(i > 0 ? 1 : 0)} ${units[i]}`;
  }

  function fmtSpeed(bps) {
    const n = Number(bps) || 0;
    if (n <= 0) return '0 KB/s';
    return `${fmtBytes(n)}/s`;
  }

  let toastTimer = null;
  function showToast(msg) {
    const el = $('#liquidToast');
    if (!el) return;
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.hidden = true; }, 2800);
  }

  function loadStorage() {
    try {
      const savedLang = localStorage.getItem(STORAGE_KEY_LANG);
      if (savedLang === 'ar' || savedLang === 'en') state.lang = savedLang;
      const savedAura = localStorage.getItem(STORAGE_KEY_AURA);
      if (savedAura) state.aura = savedAura;
      const savedPrefs = JSON.parse(localStorage.getItem(STORAGE_KEY_PREFS) || '{}');
      Object.assign(state.prefs, savedPrefs);
      const savedDls = JSON.parse(localStorage.getItem(STORAGE_KEY_DLS) || '[]');
      if (Array.isArray(savedDls)) state.downloads = savedDls;
    } catch (_) {}
  }

  function saveDownloads() {
    try {
      localStorage.setItem(STORAGE_KEY_DLS, JSON.stringify(state.downloads.slice(0, 80)));
    } catch (_) {}
  }

  function savePrefs() {
    try {
      localStorage.setItem(STORAGE_KEY_PREFS, JSON.stringify(state.prefs));
    } catch (_) {}
  }

  /* ==================== NATIVE CAPACITOR BRIDGE ==================== */
  function getNativeEngine() {
    try {
      if (window.Capacitor) {
        if (window.Capacitor.Plugins?.TayyarMobileEngine) {
          return window.Capacitor.Plugins.TayyarMobileEngine;
        }
        if (typeof window.Capacitor.registerPlugin === 'function') {
          return window.Capacitor.registerPlugin('TayyarMobileEngine');
        }
      }
    } catch (_) {}
    return null;
  }

  /* ==================== LANGUAGE & THEME ENGINE ==================== */
  function applyLanguage(lang, silent = false) {
    const norm = lang === 'ar' ? 'ar' : 'en';
    state.lang = norm;
    document.documentElement.lang = norm;
    document.documentElement.dir = norm === 'ar' ? 'rtl' : 'ltr';
    try { localStorage.setItem(STORAGE_KEY_LANG, norm); } catch (_) {}

    const toggleCode = norm === 'en' ? 'AR' : 'EN';
    const topBtn = $('#btnTopLang');
    const hdrCode = $('#headerLangCode');
    if (topBtn) topBtn.textContent = toggleCode;
    if (hdrCode) hdrCode.textContent = toggleCode;

    $$('[data-i]').forEach((el) => {
      const val = t(el.dataset.i);
      if (val) el.textContent = val;
    });
    $$('[data-i-placeholder]').forEach((el) => {
      const val = t(el.dataset.iPlaceholder);
      if (val) el.setAttribute('placeholder', val);
    });
    $$('[data-i-title]').forEach((el) => {
      const val = t(el.dataset.iTitle);
      if (val) el.setAttribute('title', val);
    });

    $$('#langSegment .seg-opt').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.lang === norm);
    });

    updateStickyHeaderTitle();
    renderAllViews();
    setTimeout(() => snapLiquidLens(state.activeTab, false), 50);

    if (!silent) showToast(t('langSwitched'));
  }

  function applyAura(auraClass) {
    state.aura = auraClass || 'theme-spatial';
    document.body.classList.remove('theme-spatial', 'theme-royal', 'theme-cyan', 'theme-violet', 'theme-oled');
    document.body.classList.add(state.aura);
    try { localStorage.setItem(STORAGE_KEY_AURA, state.aura); } catch (_) {}
    $$('#auraPicker .aura-dot').forEach((d) => {
      d.classList.toggle('active', d.dataset.aura === state.aura);
    });
  }

  /* ==================== APPLE LIQUID GLASS DRAGGABLE TAB DOCK ==================== */
  const liquidDock = $('#liquidDock');
  const liquidLens = $('#liquidLens');
  const dockTabs = $$('.dock-tab');

  function isDockVertical() {
    if (!liquidDock) return false;
    const r = liquidDock.getBoundingClientRect();
    return r.height > r.width;
  }

  function snapLiquidLens(tabName, animate = true) {
    if (!liquidDock || !liquidLens) return;
    const btn = dockTabs.find((b) => b.dataset.tab === tabName) || dockTabs[0];
    if (!btn) return;

    const dockRect = liquidDock.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    if (dockRect.width === 0 || btnRect.width === 0) return;

    if (!animate) {
      liquidLens.style.transition = 'none';
    } else {
      liquidLens.style.transition = '';
    }

    if (isDockVertical()) {
      const lensH = 54;
      const topPos = btnRect.top - dockRect.top + (btnRect.height - lensH) / 2;
      liquidLens.style.left = '50%';
      liquidLens.style.top = `${topPos}px`;
      liquidLens.style.transform = 'translate3d(-50%, 0, 0)';
    } else {
      const lensW = Math.min(72, Math.max(58, btnRect.width - 6));
      const leftPos = btnRect.left - dockRect.left + (btnRect.width - lensW) / 2;
      liquidLens.style.width = `${lensW}px`;
      liquidLens.style.top = '50%';
      liquidLens.style.left = `${leftPos}px`;
      liquidLens.style.transform = 'translate3d(0, -50%, 0)';
    }

    if (!animate) {
      void liquidLens.offsetHeight;
      liquidLens.style.transition = '';
    }
  }

  function updateStickyHeaderTitle() {
    const titleEl = $('#stickyTitle');
    if (!titleEl) return;
    const map = {
      home: 'tabHomeTitle',
      platforms: 'platformsTitle',
      downloads: 'downloadsTitle',
      settings: 'settingsTitle',
      search: 'searchTitle',
    };
    titleEl.textContent = t(map[state.activeTab] || 'tabHomeTitle');
  }

  function switchTab(tabName) {
    if (!tabName) return;
    state.activeTab = tabName;

    dockTabs.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
      btn.classList.remove('hovered');
    });

    $$('.tab-view').forEach((sec) => {
      sec.classList.toggle('active', sec.dataset.tab === tabName);
    });

    const scrollEl = $('#appScroll');
    if (scrollEl) scrollEl.scrollTop = 0;
    const sticky = $('#stickyTopBar');
    if (sticky) sticky.classList.remove('visible');

    updateStickyHeaderTitle();
    snapLiquidLens(tabName, true);

    if (tabName === 'downloads') renderDownloadsList();
    if (tabName === 'search') renderSearchResults();
  }

  // Interactive Finger-Slide Chromatic Liquid Glass Lens Controller (Matches Quranify Video!)
  (function initLiquidDockGestures() {
    if (!liquidDock || !liquidLens) return;

    let pointerId = null;
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let hoveredTab = null;

    function findTabAtPoint(clientX, clientY) {
      let closest = dockTabs[0];
      let bestDist = Infinity;
      const vertical = isDockVertical();

      dockTabs.forEach((btn) => {
        const r = btn.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dist = vertical ? Math.abs(clientY - cy) : Math.abs(clientX - cx);
        if (dist < bestDist) {
          bestDist = dist;
          closest = btn;
        }
      });
      return closest;
    }

    function moveLensToPointer(clientX, clientY) {
      const dockRect = liquidDock.getBoundingClientRect();
      if (isDockVertical()) {
        const lensH = 64;
        const rawTop = clientY - dockRect.top - lensH / 2;
        const clamped = Math.max(4, Math.min(dockRect.height - lensH - 4, rawTop));
        liquidLens.style.left = '50%';
        liquidLens.style.top = `${clamped}px`;
        liquidLens.style.transform = 'translate3d(-50%, 0, 0)';
      } else {
        const lensW = 82;
        const rawLeft = clientX - dockRect.left - lensW / 2;
        const clamped = Math.max(4, Math.min(dockRect.width - lensW - 4, rawLeft));
        liquidLens.style.top = '50%';
        liquidLens.style.left = `${clamped}px`;
        liquidLens.style.transform = 'translate3d(0, -50%, 0)';
      }

      const targetBtn = findTabAtPoint(clientX, clientY);
      hoveredTab = targetBtn ? targetBtn.dataset.tab : null;
      dockTabs.forEach((b) => b.classList.toggle('hovered', b === targetBtn));
    }

    liquidDock.addEventListener('pointerdown', (e) => {
      pointerId = e.pointerId;
      startX = e.clientX;
      startY = e.clientY;
      isDragging = false;
      hoveredTab = findTabAtPoint(e.clientX, e.clientY)?.dataset.tab || state.activeTab;
      try { liquidDock.setPointerCapture(pointerId); } catch (_) {}
    });

    liquidDock.addEventListener('pointermove', (e) => {
      if (pointerId !== e.pointerId) return;
      const dx = Math.abs(e.clientX - startX);
      const dy = Math.abs(e.clientY - startY);
      if (!isDragging && (dx > 6 || dy > 6)) {
        isDragging = true;
        liquidLens.classList.add('dragging');
      }
      if (isDragging) {
        moveLensToPointer(e.clientX, e.clientY);
      }
    });

    const finishGesture = (e) => {
      if (pointerId !== e.pointerId) return;
      try { liquidDock.releasePointerCapture(pointerId); } catch (_) {}
      pointerId = null;

      const targetTab = hoveredTab || findTabAtPoint(e.clientX, e.clientY)?.dataset.tab || state.activeTab;
      liquidLens.classList.remove('dragging');
      dockTabs.forEach((b) => b.classList.remove('hovered'));
      isDragging = false;
      switchTab(targetTab);
    };

    liquidDock.addEventListener('pointerup', finishGesture);
    liquidDock.addEventListener('pointercancel', finishGesture);

    // Re-align on resize & orientation change
    window.addEventListener('resize', () => {
      setTimeout(() => snapLiquidLens(state.activeTab, false), 60);
    });
    window.addEventListener('orientationchange', () => {
      setTimeout(() => snapLiquidLens(state.activeTab, false), 140);
    });
  })();

  /* ==================== SCROLL-AWARE COLLAPSING TOP HEADER ==================== */
  const appScroll = $('#appScroll');
  const stickyTopBar = $('#stickyTopBar');
  if (appScroll && stickyTopBar) {
    appScroll.addEventListener('scroll', () => {
      stickyTopBar.classList.toggle('visible', appScroll.scrollTop > 48);
    }, { passive: true });
  }

  /* ==================== PLATFORM DETECTION & STREAM EXTRACTOR ==================== */
  const PLATFORMS = [
    { id: 'tiktok', name: 'TikTok', icon: '⚡', rx: /(?:tiktok\.com|vt\.tiktok\.com|vm\.tiktok\.com)/i },
    { id: 'youtube', name: 'YouTube', icon: '▶', rx: /(?:youtube\.com|youtu\.be)/i },
    { id: 'instagram', name: 'Instagram', icon: '📷', rx: /instagram\.com/i },
    { id: 'facebook', name: 'Facebook', icon: '📘', rx: /(?:facebook\.com|fb\.watch|fb\.com)/i },
    { id: 'snapchat', name: 'Snapchat', icon: '👻', rx: /snapchat\.com/i },
    { id: 'twitter', name: 'Twitter / X', icon: '𝕏', rx: /(?:twitter\.com|x\.com)/i },
    { id: 'reddit', name: 'Reddit', icon: '👽', rx: /(?:reddit\.com|redd\.it)/i },
    { id: 'pinterest', name: 'Pinterest', icon: '📌', rx: /(?:pinterest\.com|pin\.it)/i },
  ];

  function detectPlatform(url) {
    for (const p of PLATFORMS) {
      if (p.rx.test(url)) return p;
    }
    return { id: 'direct', name: t('directFiles'), icon: '🚀' };
  }

  async function resolveMediaUrl(rawUrl) {
    const cleanUrl = rawUrl.trim();
    const plat = detectPlatform(cleanUrl);

    // 1. Native Android Java Resolver (zero CORS, background thread)
    const native = getNativeEngine();
    if (native && typeof native.resolveSocialUrl === 'function') {
      try {
        const res = await native.resolveSocialUrl({ url: cleanUrl });
        if (res && res.ok && res.formats && res.formats.length > 0) {
          const first = res.formats[0];
          const isRealStream = first.directUrl && first.directUrl !== cleanUrl;
          if (isRealStream || plat.id === 'direct') {
            return { ...res, platformId: plat.id, platformIcon: plat.icon };
          }
        }
      } catch (e) {
        console.warn('Native resolveSocialUrl fallback:', e);
      }
    }

    // 2. Universal APIs (Routed natively via CapacitorHttp on iOS & Android — zero CORS)
    if (plat.id === 'tiktok') {
      try {
        const r = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(cleanUrl)}`);
        if (r.ok) {
          const j = await r.json();
          if (j && j.code === 0 && j.data) {
            let play = j.data.play || '';
            if (play && !play.startsWith('http')) play = 'https://www.tikwm.com' + play;
            let music = j.data.music || '';
            if (music && !music.startsWith('http')) music = 'https://www.tikwm.com' + music;
            const formats = [];
            if (play) formats.push({ id: 'video', ext: 'mp4', url: play, directUrl: play });
            if (music) formats.push({ id: 'audio', ext: 'mp3', url: music, directUrl: music });
            if (formats.length) {
              return {
                ok: true,
                platform: 'TikTok',
                platformId: 'tiktok',
                platformIcon: '⚡',
                title: j.data.title || 'TikTok Video',
                author: j.data.author?.nickname || 'TikTok Creator',
                thumbnail: j.data.cover || '',
                formats,
              };
            }
          }
        }
      } catch (_) {}
    }

    if (plat.id === 'youtube') {
      const m = cleanUrl.match(/(?:watch\?v=|shorts\/|live\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
      if (m) {
        const vidId = m[1];
        const hosts = [
          'https://api.piped.private.coffee/streams/',
          'https://pipedapi.ducks.party/streams/',
        ];
        for (const h of hosts) {
          try {
            const r = await fetch(h + vidId);
            if (!r.ok) continue;
            const d = await r.json();
            const formats = [];
            if (Array.isArray(d.formatStreams) && d.formatStreams.length) {
              formats.push({ id: 'video', ext: 'mp4', url: d.formatStreams[0].url, directUrl: d.formatStreams[0].url });
            } else if (Array.isArray(d.videoStreams)) {
              const mp4 = d.videoStreams.find((v) => v.url && v.format === 'MP4');
              if (mp4) formats.push({ id: 'video', ext: 'mp4', url: mp4.url, directUrl: mp4.url });
            }
            if (Array.isArray(d.audioStreams) && d.audioStreams[0]?.url) {
              formats.push({ id: 'audio', ext: 'm4a', url: d.audioStreams[0].url, directUrl: d.audioStreams[0].url });
            }
            if (formats.length) {
              return {
                ok: true,
                platform: 'YouTube',
                platformId: 'youtube',
                platformIcon: '▶',
                title: d.title || 'YouTube Video',
                author: d.uploader || 'YouTube Channel',
                thumbnail: d.thumbnailUrl || '',
                formats,
              };
            }
          } catch (_) {}
        }
      }
    }

    if (plat.id === 'twitter') {
      const m = cleanUrl.match(/(?:twitter\.com|x\.com)\/([^/]+)\/status\/(\d+)/i);
      if (m) {
        try {
          const r = await fetch(`https://api.fxtwitter.com/${m[1]}/status/${m[2]}`);
          if (r.ok) {
            const j = await r.json();
            const vid = j.tweet?.media?.videos?.[0];
            if (vid?.url) {
              return {
                ok: true,
                platform: 'Twitter / X',
                platformId: 'twitter',
                platformIcon: '𝕏',
                title: (j.tweet.text || 'X Video').slice(0, 60),
                author: j.tweet.author?.name || m[1],
                thumbnail: vid.thumbnail_url || '',
                formats: [{ id: 'video', ext: 'mp4', url: vid.url, directUrl: vid.url }],
              };
            }
          }
        } catch (_) {}
      }
    }

    if (plat.id === 'reddit') {
      try {
        const r = await fetch(cleanUrl.split('?')[0].replace(/\/$/, '') + '.json');
        if (r.ok) {
          const j = await r.json();
          const post = j[0]?.data?.children?.[0]?.data;
          const vid = post?.secure_media?.reddit_video || post?.media?.reddit_video;
          if (vid?.fallback_url) {
            return {
              ok: true,
              platform: 'Reddit',
              platformId: 'reddit',
              platformIcon: '👽',
              title: post.title || 'Reddit Video',
              author: post.author ? `u/${post.author}` : 'Reddit',
              thumbnail: post.thumbnail?.startsWith('http') ? post.thumbnail : '',
              formats: [{ id: 'video', ext: 'mp4', url: vid.fallback_url, directUrl: vid.fallback_url }],
            };
          }
        }
      } catch (_) {}
    }

    // Fallback direct file or OpenGraph stream
    let guessName = `${plat.name}_Media`;
    try {
      const uObj = new URL(cleanUrl);
      const seg = decodeURIComponent(uObj.pathname.split('/').filter(Boolean).pop() || '');
      if (seg && seg.includes('.')) guessName = seg;
    } catch (_) {}

    return {
      ok: true,
      platform: plat.name,
      platformId: plat.id,
      platformIcon: plat.icon,
      title: guessName,
      author: plat.name,
      thumbnail: '',
      formats: [{ id: 'video', ext: 'mp4', url: cleanUrl, directUrl: cleanUrl }],
    };
  }

  /* ==================== NATIVE DOWNLOAD RUNNER (ANDROID + iOS) ==================== */
  function sanitizeName(str, fallbackExt) {
    const clean = (str || 'Tayyar_Media')
      .replace(/[\\/:*?"<>|\r\n]/g, '_')
      .replace(/\s+/g, '_')
      .slice(0, 60)
      .trim();
    if (clean.includes('.')) return clean;
    return `${clean}.${fallbackExt}`;
  }

  async function startDownload({ url, filename, referer = '', platformIcon = '🎬', isAudio = false }) {
    const id = `dl_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const item = {
      id,
      url,
      filename,
      referer,
      platformIcon: isAudio ? '🎵' : platformIcon,
      status: 'downloading',
      downloaded: 0,
      total: 0,
      percent: 0,
      speed: 0,
      error: '',
      addedAt: Date.now(),
      nativeId: null,
    };

    state.downloads.unshift(item);
    saveDownloads();
    renderAllViews();
    showToast(isAudio ? t('dlStartedAudio') : (filename.endsWith('.mp4') ? t('dlStartedVideo') : t('dlStartedFile')));

    // 1. Android Native Java Background Thread Downloader (MediaStore + Gallery)
    const native = getNativeEngine();
    if (native && typeof native.startDownload === 'function') {
      try {
        const res = await native.startDownload({ url, filename, referer });
        if (res && res.downloadId) {
          item.nativeId = res.downloadId;
          saveDownloads();
          pollNativeDownload(item);
          return;
        }
      } catch (e) {
        console.warn('Native Android startDownload error:', e);
      }
    }

    // 2. iOS / Web Native Stream Download + iOS Share Sheet / File Save
    try {
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const cl = parseInt(resp.headers.get('content-length') || '0', 10);
      if (cl > 0) item.total = cl;

      let blob;
      if (resp.body && typeof resp.body.getReader === 'function') {
        const reader = resp.body.getReader();
        const chunks = [];
        let received = 0;
        let lastT = Date.now();
        let lastB = 0;

        while (true) {
          if (item.status === 'cancelled') {
            try { reader.cancel(); } catch (_) {}
            return;
          }
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
          received += value.length;
          item.downloaded = received;

          const now = Date.now();
          if (now - lastT >= 300) {
            item.speed = Math.round(((received - lastB) / ((now - lastT) / 1000)) || 0);
            item.percent = item.total > 0 ? Math.min(100, Math.round((received / item.total) * 100)) : 50;
            lastT = now;
            lastB = received;
            renderAllViews();
          }
        }
        blob = new Blob(chunks);
      } else {
        blob = await resp.blob();
        item.downloaded = blob.size;
        item.total = blob.size;
      }

      item.status = 'completed';
      item.percent = 100;
      item.speed = 0;
      if (item.total <= 0) item.total = blob.size;
      saveDownloads();
      renderAllViews();
      showToast(t('dlDoneToast'));

      // Native iOS Share Sheet (Save Video / Save to Files) or Blob download
      try {
        const fileObj = new File([blob], filename, { type: blob.type || (isAudio ? 'audio/mpeg' : 'video/mp4') });
        if (navigator.canShare && navigator.canShare({ files: [fileObj] })) {
          await navigator.share({ files: [fileObj], title: filename });
          return;
        }
      } catch (_) {}

      const objUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(objUrl), 5000);
    } catch (err) {
      item.status = 'error';
      item.speed = 0;
      item.error = err.message || 'Network error';
      saveDownloads();
      renderAllViews();
      showToast(`${t('dlFailToast')}: ${item.error}`);
    }
  }

  function pollNativeDownload(item) {
    if (state.activePolls.has(item.id)) return;
    const timer = setInterval(async () => {
      const native = getNativeEngine();
      if (!native) {
        clearInterval(timer);
        state.activePolls.delete(item.id);
        return;
      }
      try {
        const res = await native.queryDownload({ downloadId: item.nativeId });
        if (!res) return;
        if (res.downloaded > 0) item.downloaded = res.downloaded;
        if (res.total > 0) item.total = res.total;
        if (res.speed > 0) item.speed = Math.round(res.speed);
        if (res.percent > 0) item.percent = res.percent;
        else if (item.total > 0) item.percent = Math.min(100, Math.round((item.downloaded / item.total) * 100));

        if (res.status === 'completed') {
          item.status = 'completed';
          item.percent = 100;
          item.speed = 0;
          clearInterval(timer);
          state.activePolls.delete(item.id);
          saveDownloads();
          renderAllViews();
          showToast(t('dlDoneToast'));
        } else if (res.status === 'error') {
          item.status = 'error';
          item.speed = 0;
          item.error = res.error || 'Error';
          clearInterval(timer);
          state.activePolls.delete(item.id);
          saveDownloads();
          renderAllViews();
          showToast(`${t('dlFailToast')}: ${item.error}`);
        } else if (res.status === 'paused') {
          item.status = 'cancelled';
          item.speed = 0;
          clearInterval(timer);
          state.activePolls.delete(item.id);
          saveDownloads();
          renderAllViews();
        } else {
          renderAllViews();
        }
      } catch (_) {}
    }, 420);
    state.activePolls.set(item.id, timer);
  }

  function cancelOrRemoveDownload(id, removeEntry = false) {
    const idx = state.downloads.findIndex((d) => d.id === id);
    if (idx < 0) return;
    const item = state.downloads[idx];

    if (item.status === 'downloading') {
      item.status = 'cancelled';
      item.speed = 0;
      if (state.activePolls.has(id)) {
        clearInterval(state.activePolls.get(id));
        state.activePolls.delete(id);
      }
      const native = getNativeEngine();
      if (native && item.nativeId && typeof native.cancelDownload === 'function') {
        native.cancelDownload({ downloadId: item.nativeId }).catch(() => {});
      }
      if (!removeEntry) showToast(t('dlCancelled'));
    }

    if (removeEntry) {
      state.downloads.splice(idx, 1);
    }
    saveDownloads();
    renderAllViews();
  }

  /* ==================== UI RENDERING ==================== */
  function buildDownloadCardHTML(d) {
    const isDone = d.status === 'completed';
    const isErr = d.status === 'error';
    const isRun = d.status === 'downloading';

    const statusText = isDone ? t('statusSaved') : isErr ? t('statusFailed') : isRun ? t('statusDownloading') : t('statusPaused');
    const statusCls = isDone ? 'done' : isErr ? 'err' : isRun ? 'run' : '';
    const pct = isDone ? 100 : (d.percent || 0);
    const metaRight = isRun
      ? `${pct}% • ${fmtSpeed(d.speed)} • ${fmtBytes(d.downloaded)}${d.total > 0 ? ' / ' + fmtBytes(d.total) : ''}`
      : isDone
        ? fmtBytes(d.total || d.downloaded)
        : (d.error || '');

    return `
      <div class="dl-card" data-id="${d.id}">
        <div class="dl-row-top">
          <div class="dl-thumb-ic">${d.platformIcon || '🎬'}</div>
          <div class="dl-info">
            <div class="dl-name">${escapeHtml(d.filename)}</div>
            <div class="dl-meta">
              <span class="dl-status-tag ${statusCls}">${statusText}</span>
              ${metaRight ? `<span>• ${escapeHtml(metaRight)}</span>` : ''}
            </div>
          </div>
          <div class="dl-actions">
            ${isRun
              ? `<button type="button" class="dl-ic-btn" data-act="cancel" data-id="${d.id}" aria-label="Cancel">✕</button>`
              : `<button type="button" class="dl-ic-btn" data-act="remove" data-id="${d.id}" aria-label="Delete">🗑</button>`}
          </div>
        </div>
        <div class="dl-bar-track">
          <div class="dl-bar-fill ${statusCls}" style="width:${pct}%"></div>
        </div>
      </div>
    `;
  }

  function escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  }

  function renderStatsAndMiniBar() {
    const active = state.downloads.filter((d) => d.status === 'downloading');
    const done = state.downloads.filter((d) => d.status === 'completed');
    const failed = state.downloads.filter((d) => d.status === 'error');
    const totalSpeed = active.reduce((sum, d) => sum + (d.speed || 0), 0);

    const elAct = $('#statActive');
    const elDone = $('#statDone');
    const elSpd = $('#statSpeed');
    if (elAct) elAct.textContent = String(active.length);
    if (elDone) elDone.textContent = String(done.length);
    if (elSpd) elSpd.textContent = fmtSpeed(totalSpeed);

    const cAll = $('#cntAll');
    const cAct = $('#cntActive');
    const cDone = $('#cntDone');
    const cErr = $('#cntError');
    if (cAll) cAll.textContent = String(state.downloads.length);
    if (cAct) cAct.textContent = String(active.length);
    if (cDone) cDone.textContent = String(done.length);
    if (cErr) cErr.textContent = String(failed.length);

    const badge = $('#dockBadge');
    if (badge) {
      badge.hidden = active.length === 0;
      badge.textContent = String(active.length);
    }

    // Floating Mini-Bar (Quranify Mini-Player style)
    const miniBar = $('#miniBar');
    if (miniBar) {
      const top = active[0];
      if (top) {
        miniBar.hidden = false;
        $('#miniArt').textContent = top.platformIcon || '🎬';
        $('#miniTitle').textContent = top.filename;
        $('#miniSub').textContent = `${top.percent || 0}% • ${fmtSpeed(top.speed)}`;
        $('#miniProgressFill').style.width = `${top.percent || 0}%`;
        miniBar.dataset.activeId = top.id;
      } else {
        miniBar.hidden = true;
      }
    }
  }

  function renderHomeRecent() {
    const wrap = $('#homeRecentList');
    if (!wrap) return;
    const recent = state.downloads.slice(0, 4);
    if (recent.length === 0) {
      wrap.innerHTML = `
        <div class="empty-state-box">
          <div class="empty-state-ic">📥</div>
          <div class="empty-state-title">${t('emptyRecentTitle')}</div>
          <div class="empty-state-sub">${t('emptyRecentSub')}</div>
        </div>
      `;
      return;
    }
    wrap.innerHTML = recent.map(buildDownloadCardHTML).join('');
  }

  function renderDownloadsList() {
    const wrap = $('#downloadsList');
    if (!wrap) return;
    let items = state.downloads;
    if (state.filter === 'active') items = items.filter((d) => d.status === 'downloading');
    else if (state.filter === 'completed') items = items.filter((d) => d.status === 'completed');
    else if (state.filter === 'error') items = items.filter((d) => d.status === 'error');

    if (items.length === 0) {
      wrap.innerHTML = `
        <div class="empty-state-box">
          <div class="empty-state-ic">✨</div>
          <div class="empty-state-title">${t('emptyListTitle')}</div>
          <div class="empty-state-sub">${t('emptyListSub')}</div>
        </div>
      `;
      return;
    }
    wrap.innerHTML = items.map(buildDownloadCardHTML).join('');
  }

  function renderSearchResults() {
    const wrap = $('#searchResults');
    const q = ($('#searchInput')?.value || '').trim();
    if (!wrap) return;

    if (!q) {
      wrap.innerHTML = `
        <div class="empty-state-box">
          <div class="empty-state-ic">🔍</div>
          <div class="empty-state-title">${t('emptySearchTitle')}</div>
          <div class="empty-state-sub">${t('emptySearchSub')}</div>
        </div>
      `;
      return;
    }

    if (/^https?:\/\//i.test(q)) {
      wrap.innerHTML = `
        <div class="glass-card" style="display:flex;flex-direction:column;gap:12px;">
          <div style="font-size:13px;color:var(--text-secondary);word-break:break-all;">${escapeHtml(q)}</div>
          <button type="button" class="glass-btn primary full" id="btnSearchQuickGo">${t('openOrAnalyze')}</button>
        </div>
      `;
      const goBtn = $('#btnSearchQuickGo');
      if (goBtn) {
        goBtn.addEventListener('click', () => {
          $('#urlInput').value = q;
          $('#btnClearUrl').hidden = false;
          switchTab('home');
          triggerAnalyze();
        });
      }
      return;
    }

    const low = q.toLowerCase();
    const matches = state.downloads.filter((d) => (d.filename || '').toLowerCase().includes(low));
    if (matches.length === 0) {
      wrap.innerHTML = `
        <div class="empty-state-box">
          <div class="empty-state-ic">🔍</div>
          <div class="empty-state-title">${t('emptyListTitle')}</div>
          <div class="empty-state-sub">${escapeHtml(q)}</div>
        </div>
      `;
      return;
    }
    wrap.innerHTML = matches.map(buildDownloadCardHTML).join('');
  }

  function renderAllViews() {
    renderStatsAndMiniBar();
    renderHomeRecent();
    if (state.activeTab === 'downloads') renderDownloadsList();
    if (state.activeTab === 'search') renderSearchResults();
  }

  /* ==================== HOME EXTRACTOR HANDLERS ==================== */
  const urlInput = $('#urlInput');
  const btnClearUrl = $('#btnClearUrl');
  const analyzeLoader = $('#analyzeLoader');
  const previewCard = $('#previewCard');

  async function triggerAnalyze() {
    const raw = (urlInput?.value || '').trim();
    if (!raw || !/^https?:\/\//i.test(raw)) {
      showToast(t('invalidUrl'));
      return;
    }

    if (analyzeLoader) analyzeLoader.hidden = false;
    if (previewCard) previewCard.hidden = true;
    state.currentResolved = null;

    try {
      const data = await resolveMediaUrl(raw);
      state.currentResolved = data;
      if (analyzeLoader) analyzeLoader.hidden = true;

      if (previewCard) previewCard.hidden = false;
      $('#previewTitle').textContent = data.title || data.platform || 'Media';
      $('#previewAuthor').textContent = data.author || data.platform || '';
      $('#previewPlatTag').textContent = data.platform || 'Media';

      const thumb = $('#previewThumb');
      const fallback = $('#previewThumbFallback');
      if (data.thumbnail) {
        thumb.src = data.thumbnail;
        thumb.style.display = 'block';
        if (fallback) fallback.style.display = 'none';
      } else {
        thumb.style.display = 'none';
        if (fallback) {
          fallback.style.display = 'block';
          fallback.textContent = data.platformIcon || '🎬';
        }
      }
    } catch (e) {
      if (analyzeLoader) analyzeLoader.hidden = true;
      showToast(e.message || t('dlFailToast'));
    }
  }

  async function triggerResolvedDownload(isAudio) {
    const raw = (urlInput?.value || '').trim();
    if (!raw) return;
    if (!state.currentResolved) {
      await triggerAnalyze();
    }
    const res = state.currentResolved;
    const formats = res?.formats || [];
    let chosen = null;

    if (isAudio) {
      chosen = formats.find((f) => f.id === 'audio' || f.ext === 'mp3' || f.ext === 'm4a') || formats[0];
    } else {
      chosen = formats.find((f) => f.id !== 'audio') || formats[0];
    }

    const dlUrl = chosen?.directUrl || chosen?.url || raw;
    const ext = isAudio ? (chosen?.ext === 'm4a' ? 'm4a' : 'mp3') : (chosen?.ext || 'mp4');
    const filename = sanitizeName(`${res?.platform || 'Tayyar'}_${res?.title || Date.now()}`, ext);

    await startDownload({
      url: dlUrl,
      filename,
      referer: chosen?.referer || '',
      platformIcon: res?.platformIcon || '🎬',
      isAudio,
    });
  }

  if (urlInput) {
    urlInput.addEventListener('input', () => {
      if (btnClearUrl) btnClearUrl.hidden = !urlInput.value.trim();
    });
    urlInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        urlInput.blur();
        triggerAnalyze();
      }
    });
  }

  if (btnClearUrl) {
    btnClearUrl.addEventListener('click', () => {
      urlInput.value = '';
      btnClearUrl.hidden = true;
      if (previewCard) previewCard.hidden = true;
      state.currentResolved = null;
      urlInput.focus();
    });
  }

  $('#btnPaste')?.addEventListener('click', async () => {
    try {
      const txt = (await navigator.clipboard.readText() || '').trim();
      if (txt) {
        urlInput.value = txt;
        if (btnClearUrl) btnClearUrl.hidden = false;
        showToast(t('pasteSuccess'));
        if (state.prefs.autoAnalyze && /^https?:\/\//i.test(txt)) {
          triggerAnalyze();
        }
      } else {
        showToast(t('clipboardEmpty'));
      }
    } catch (_) {
      urlInput.focus();
    }
  });

  $('#btnAnalyze')?.addEventListener('click', triggerAnalyze);
  $('#btnDlVideo')?.addEventListener('click', () => triggerResolvedDownload(false));
  $('#btnDlAudio')?.addEventListener('click', () => triggerResolvedDownload(true));

  // Platform quick selection (from Carousel & Mesh Bento Tiles)
  $$('[data-plat]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const pName = btn.querySelector('.tile-title, .plat-name')?.textContent || btn.dataset.plat;
      switchTab('home');
      setTimeout(() => {
        if (urlInput) urlInput.focus();
        showToast(`${t('platSelectedHint')} ${pName}`);
      }, 180);
    });
  });

  $('#btnSeeAllPlatforms')?.addEventListener('click', () => switchTab('platforms'));
  $('#btnSeeAllDownloads')?.addEventListener('click', () => switchTab('downloads'));

  // Mini-Bar tap & cancel
  $('#miniBarTap')?.addEventListener('click', () => switchTab('downloads'));
  $('#btnMiniCancel')?.addEventListener('click', () => {
    const id = $('#miniBar')?.dataset.activeId;
    if (id) cancelOrRemoveDownload(id, false);
  });

  // Delegated Cancel / Delete buttons across all download lists
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.dl-ic-btn');
    if (!btn) return;
    const act = btn.dataset.act;
    const id = btn.dataset.id;
    if (act === 'cancel') cancelOrRemoveDownload(id, false);
    if (act === 'remove') cancelOrRemoveDownload(id, true);
  });

  // Filter pills
  $$('#dlFilterBar .filter-pill').forEach((pill) => {
    pill.addEventListener('click', () => {
      state.filter = pill.dataset.filter;
      $$('#dlFilterBar .filter-pill').forEach((p) => p.classList.toggle('active', p === pill));
      renderDownloadsList();
    });
  });

  $('#btnClearDone')?.addEventListener('click', () => {
    state.downloads = state.downloads.filter((d) => d.status === 'downloading');
    saveDownloads();
    renderAllViews();
    showToast(t('clearedDone'));
  });

  // Search input
  $('#searchInput')?.addEventListener('input', renderSearchResults);

  /* ==================== SETTINGS & STRICT STABLE AUTO-UPDATER ==================== */
  $('#btnTopLang')?.addEventListener('click', () => applyLanguage(state.lang === 'en' ? 'ar' : 'en'));
  $('#btnHeaderLang')?.addEventListener('click', () => applyLanguage(state.lang === 'en' ? 'ar' : 'en'));
  $$('#langSegment .seg-opt').forEach((btn) => {
    btn.addEventListener('click', () => applyLanguage(btn.dataset.lang));
  });

  $$('#auraPicker .aura-dot').forEach((dot) => {
    dot.addEventListener('click', () => applyAura(dot.dataset.aura));
  });

  const cfgDefaultFormat = $('#cfgDefaultFormat');
  const cfgAutoGallery = $('#cfgAutoGallery');
  const cfgAutoAnalyze = $('#cfgAutoAnalyze');

  if (cfgDefaultFormat) {
    cfgDefaultFormat.addEventListener('change', () => {
      state.prefs.defaultFormat = cfgDefaultFormat.value;
      savePrefs();
    });
  }
  if (cfgAutoGallery) {
    cfgAutoGallery.addEventListener('change', () => {
      state.prefs.autoGallery = cfgAutoGallery.checked;
      savePrefs();
    });
  }
  if (cfgAutoAnalyze) {
    cfgAutoAnalyze.addEventListener('change', () => {
      state.prefs.autoAnalyze = cfgAutoAnalyze.checked;
      savePrefs();
    });
  }

  // Strict Stable-Default Update Checker (NEVER updates when already on latest!)
  const cfgUpdateChannel = $('#cfgUpdateChannel');
  const betaChannelNote = $('#betaChannelNote');
  const updActionRow = $('#updActionRow');
  const btnCheckUpdate = $('#btnCheckUpdate');
  const btnDownloadUpdate = $('#btnDownloadUpdate');

  function semverCompare(a, b) {
    const pa = (a || '0').replace(/^v/, '').split('-')[0].split('.').map(Number);
    const pb = (b || '0').replace(/^v/, '').split('-')[0].split('.').map(Number);
    for (let i = 0; i < 3; i++) {
      if ((pa[i] || 0) > (pb[i] || 0)) return 1;
      if ((pa[i] || 0) < (pb[i] || 0)) return -1;
    }
    return 0;
  }

  function syncChannelUI() {
    let ch = 'stable';
    try { ch = localStorage.getItem(STORAGE_KEY_CHANNEL) === 'beta' ? 'beta' : 'stable'; } catch (_) {}
    if (cfgUpdateChannel) cfgUpdateChannel.value = ch;
    if (betaChannelNote) betaChannelNote.hidden = ch !== 'beta';
  }

  async function checkUpdates(interactive = true) {
    const ch = cfgUpdateChannel?.value === 'beta' ? 'beta' : 'stable';
    if (btnCheckUpdate) {
      btnCheckUpdate.disabled = true;
      btnCheckUpdate.textContent = t('checking');
    }
    try {
      const url = ch === 'beta'
        ? 'https://api.github.com/repos/mumenmahbuobeh/tayyar/releases'
        : 'https://api.github.com/repos/mumenmahbuobeh/tayyar/releases/latest';
      const r = await fetch(url, { headers: { Accept: 'application/vnd.github.v3+json' } });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const payload = await r.json();
      const rel = Array.isArray(payload) ? payload.find((x) => !x.draft) : (!payload.draft ? payload : null);
      if (!rel?.tag_name) throw new Error('No release');

      const latest = rel.tag_name.replace(/^v/, '');
      const isNewer = semverCompare(latest, APP_VERSION) > 0;
      state.hasNewerUpdate = isNewer;

      if (isNewer) {
        state.updateRelease = rel;
        $('#updStatusTitle').textContent = `${t('newVerAvailable')} v${latest}`;
        $('#updStatusDesc').textContent = `v${APP_VERSION} → v${latest}`;
        if (updActionRow) updActionRow.hidden = false;
        if (interactive) showToast(`${t('newVerAvailable')} v${latest}`);
      } else {
        state.updateRelease = null;
        $('#updStatusTitle').textContent = t('upToDate');
        $('#updStatusDesc').textContent = t('upToDateDesc');
        if (updActionRow) updActionRow.hidden = true;
        if (interactive) showToast(t('alreadyLatestToast'));
      }
    } catch (_) {
      state.hasNewerUpdate = false;
      state.updateRelease = null;
      if (updActionRow) updActionRow.hidden = true;
      if (interactive) showToast(t('dlFailToast'));
    } finally {
      if (btnCheckUpdate) {
        btnCheckUpdate.disabled = false;
        btnCheckUpdate.textContent = t('check');
      }
    }
  }

  cfgUpdateChannel?.addEventListener('change', () => {
    const ch = cfgUpdateChannel.value === 'beta' ? 'beta' : 'stable';
    try { localStorage.setItem(STORAGE_KEY_CHANNEL, ch); } catch (_) {}
    if (betaChannelNote) betaChannelNote.hidden = ch !== 'beta';
    checkUpdates(true);
  });

  btnCheckUpdate?.addEventListener('click', () => checkUpdates(true));

  btnDownloadUpdate?.addEventListener('click', () => {
    if (!state.hasNewerUpdate || !state.updateRelease) {
      showToast(t('alreadyLatestToast'));
      if (updActionRow) updActionRow.hidden = true;
      return;
    }
    const assets = state.updateRelease.assets || [];
    const isIos = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    const asset = isIos
      ? assets.find((a) => a.name.endsWith('.ipa'))
      : assets.find((a) => a.name.endsWith('.apk'));

    if (asset?.browser_download_url) {
      startDownload({
        url: asset.browser_download_url,
        filename: asset.name,
        platformIcon: isIos ? '🍏' : '📱',
        isAudio: false,
      });
      switchTab('downloads');
    } else if (state.updateRelease.html_url) {
      window.open(state.updateRelease.html_url, '_blank');
    }
  });

  /* ==================== 60FPS ANTIGRAVITY SPATIAL PHYSICS ENGINE ==================== */
  const cfgSpatialPhysics = $('#cfgSpatialPhysics');

  function applySpatialPhysicsPref(enabled) {
    state.prefs.spatialPhysics = !!enabled;
    document.body.classList.toggle('no-spatial-physics', !enabled);
    if (!enabled) {
      $$('.mesh-tile, .glass-hero-card').forEach((el) => {
        el.style.transform = '';
      });
    }
  }

  cfgSpatialPhysics?.addEventListener('change', () => {
    applySpatialPhysicsPref(cfgSpatialPhysics.checked);
    savePrefs();
  });

  function initAntigravityPhysics() {
    const pointer = { x: -9999, y: -9999, active: false };
    const physicsNodes = [];

    // Register interactive spatial floating elements
    $$('.mesh-tile, .glass-hero-card').forEach((el, idx) => {
      physicsNodes.push({
        el,
        phase: idx * 0.9,
        x: 0, y: 0,
        vx: 0, vy: 0,
        rx: 0, ry: 0,
        vrx: 0, vry: 0,
        isHero: el.classList.contains('glass-hero-card'),
      });
    });

    const updatePointer = (x, y, active) => {
      pointer.x = x;
      pointer.y = y;
      pointer.active = active;
      if (active) {
        const lx = Math.max(5, Math.min(95, (x / window.innerWidth) * 100));
        const ly = Math.max(5, Math.min(95, (y / window.innerHeight) * 100));
        document.documentElement.style.setProperty('--light-x', `${lx.toFixed(1)}%`);
        document.documentElement.style.setProperty('--light-y', `${ly.toFixed(1)}%`);
      }
    };

    window.addEventListener('pointermove', (e) => {
      if (!state.prefs.spatialPhysics) return;
      updatePointer(e.clientX, e.clientY, true);
    }, { passive: true });

    window.addEventListener('pointerdown', (e) => {
      if (!state.prefs.spatialPhysics) return;
      updatePointer(e.clientX, e.clientY, true);
    }, { passive: true });

    window.addEventListener('pointerup', () => {
      pointer.active = false;
    }, { passive: true });

    window.addEventListener('pointercancel', () => {
      pointer.active = false;
    }, { passive: true });

    // Real Gyroscope Parallax & Specular Light Shift on Android & iOS
    window.addEventListener('deviceorientation', (e) => {
      if (!state.prefs.spatialPhysics || e.gamma == null || e.beta == null) return;
      const gx = Math.max(-22, Math.min(22, (e.gamma || 0) * 0.55));
      const gy = Math.max(-22, Math.min(22, ((e.beta || 45) - 45) * 0.45));
      document.documentElement.style.setProperty('--gyro-x', `${gx.toFixed(1)}px`);
      document.documentElement.style.setProperty('--gyro-y', `${gy.toFixed(1)}px`);
      if (!pointer.active) {
        const lx = Math.max(10, Math.min(90, 50 + gx * 1.4));
        const ly = Math.max(10, Math.min(90, 35 + gy * 1.4));
        document.documentElement.style.setProperty('--light-x', `${lx.toFixed(1)}%`);
        document.documentElement.style.setProperty('--light-y', `${ly.toFixed(1)}%`);
      }
    }, { passive: true });

    // 60fps Weightless Spring-Inertia & Repulsion Loop
    const STIFFNESS = 0.085;
    const DAMPING = 0.78;
    let tNow = 0;

    function tick() {
      requestAnimationFrame(tick);
      if (document.hidden || !state.prefs.spatialPhysics) return;
      tNow += 0.016;

      for (let i = 0; i < physicsNodes.length; i++) {
        const n = physicsNodes[i];
        const view = n.el.closest('.tab-view');
        if (!view || !view.classList.contains('active')) continue;

        // Subtle zero-gravity sinusoidal micro-drift
        const floatAmp = n.isHero ? 1.6 : 2.4;
        let targetX = Math.cos(tNow * 0.7 + n.phase) * (floatAmp * 0.45);
        let targetY = Math.sin(tNow * 0.95 + n.phase) * floatAmp;
        let targetRx = 0;
        let targetRy = 0;

        if (pointer.active) {
          const r = n.el.getBoundingClientRect();
          const cx = r.left + r.width / 2;
          const cy = r.top + r.height / 2;
          const dx = cx - pointer.x;
          const dy = cy - pointer.y;
          const dist = Math.hypot(dx, dy);
          const radius = n.isHero ? 260 : 210;

          if (dist < radius && dist > 1) {
            const force = (1 - dist / radius);
            if (!n.isHero) {
              // Subtle spatial repulsion push on nearby floating tiles
              const push = force * 6.5;
              targetX += (dx / dist) * push;
              targetY += (dy / dist) * push;
            }
            // Smooth 3D specular glass tilt toward/away from finger force
            const maxTilt = n.isHero ? 3.2 : 6.0;
            targetRy = Math.max(-maxTilt, Math.min(maxTilt, (-dx / (r.width / 2)) * maxTilt * force));
            targetRx = Math.max(-maxTilt, Math.min(maxTilt, (dy / (r.height / 2)) * maxTilt * force));
          }
        }

        // Spring-damped inertia physics
        n.vx = (n.vx + (targetX - n.x) * STIFFNESS) * DAMPING;
        n.vy = (n.vy + (targetY - n.y) * STIFFNESS) * DAMPING;
        n.vrx = (n.vrx + (targetRx - n.rx) * STIFFNESS) * DAMPING;
        n.vry = (n.vry + (targetRy - n.ry) * STIFFNESS) * DAMPING;

        n.x += n.vx;
        n.y += n.vy;
        n.rx += n.vrx;
        n.ry += n.vry;

        n.el.style.transform = `translate3d(${n.x.toFixed(2)}px, ${n.y.toFixed(2)}px, 0) rotateX(${n.rx.toFixed(2)}deg) rotateY(${n.ry.toFixed(2)}deg)`;
      }
    }

    requestAnimationFrame(tick);
  }

  /* ==================== BOOTSTRAP ==================== */
  function init() {
    loadStorage();
    applyAura(state.aura);
    applySpatialPhysicsPref(state.prefs.spatialPhysics !== false);

    if (cfgDefaultFormat) cfgDefaultFormat.value = state.prefs.defaultFormat;
    if (cfgAutoGallery) cfgAutoGallery.checked = state.prefs.autoGallery;
    if (cfgAutoAnalyze) cfgAutoAnalyze.checked = state.prefs.autoAnalyze;
    if (cfgSpatialPhysics) cfgSpatialPhysics.checked = state.prefs.spatialPhysics !== false;

    syncChannelUI();
    applyLanguage(state.lang, true);

    // Resume polling for any active Android downloads
    state.downloads.forEach((d) => {
      if (d.status === 'downloading' && d.nativeId) {
        pollNativeDownload(d);
      } else if (d.status === 'downloading') {
        d.status = 'cancelled';
      }
    });

    renderAllViews();
    initAntigravityPhysics();
    requestAnimationFrame(() => snapLiquidLens(state.activeTab, false));
  }

  init();
})();
