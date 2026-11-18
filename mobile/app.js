'use strict';

(() => {
  const APP_VERSION = '1.0.14';
  const STORAGE_KEY_DLS = 'tayyar_mobile_downloads_v2';
  const STORAGE_KEY_LANG = 'tayyar_lang';
  const STORAGE_KEY_AURA = 'tayyar_mobile_aura_oled';
  const STORAGE_KEY_PREFS = 'tayyar_mobile_prefs';
  const STORAGE_KEY_CHANNEL = 'tayyar_update_channel';

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

  /* ==================== 100% BILINGUAL I18N (EN & AR) ==================== */
  const I18N = {
    en: {
      appTitle: 'Tayyar',
      tabHomeTitle: 'Tayyar',
      homeSubtitle: 'Media & File Downloader',
      quickDownloadLbl: 'Quick Download',
      supportedSources: 'Supported Sources',
      totalFilesLbl: 'Files',
      totalSizeLbl: 'Saved Size',
      searchSubtitle: 'Filter saved files or paste any URL',
      addFirstBtn: 'Add Download',
      engineReady: 'Turbo Engine Ready',
      urlPlaceholder: 'Paste video or direct file URL...',
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
      downloadsSubtitle: 'Gallery (Movies/Tayyar) & Downloads',
      clearCompleted: 'Clear Completed',
      filterAll: 'All',
      filterActive: 'Active',
      filterCompleted: 'Saved',
      filterFailed: 'Failed',
      settingsTitle: 'Settings',
      identitySub: 'Universal Media & Story Downloader',
      grpGeneral: 'Language & Appearance',
      languageLbl: 'Language',
      languageHint: 'Switch between full English & Arabic',
      auraThemeLbl: 'Top Accent Glow',
      auraThemeHint: 'Pure OLED Black or subtle top tint',
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
      storiesHubTitle: 'Stories & Status Saver',
      storiesHubSub: 'WhatsApp • Instagram • Facebook • Snapchat',
      storiesHubDesc: 'Download active photo & video stories in original quality',
      storiesBadge: 'HD Stories',
      waGrantBtn: 'Allow WhatsApp',
      waGrantBizBtn: 'WA Business',
      refresh: 'Refresh',
      storyInputPlaceholder: 'Enter @username or paste Story link...',
      fetchStoriesBtn: 'Fetch Active Stories',
      fetchingStories: 'Scanning active stories...',
      saveAllStories: 'Save All',
      allPlatformsLbl: 'Video & File Platforms',
      saveBtn: 'Save',
      savedBtn: 'Saved',
      waNeedPermTitle: 'Grant WhatsApp Status Access',
      waNeedPermDesc: 'Tap "Allow WhatsApp" above and select "Use this folder" to view & save all WhatsApp photo and video statuses directly to your Gallery.',
      waEmptyTitle: 'No WhatsApp statuses found yet',
      waEmptyDesc: 'Open WhatsApp and view a status first, then tap Refresh here to save it in HD.',
      waIosTitle: 'WhatsApp Statuses on iOS',
      waIosDesc: 'iOS isolates WhatsApp files for privacy. You can save Snapchat, Instagram & Facebook stories directly using the tabs above, or import any saved clip below.',
      waIosImportBtn: 'Import Photo / Video',
      storyEmptyPromptTitle: 'Enter @username or Story Link',
      storyEmptyPromptDesc: 'Type any public Snapchat/Instagram username or paste a Story link to extract all active photos and videos.',
      storyNotFoundTitle: 'No public stories found',
      storyAuthHint: 'This story may be private or require login. Try a public username or copy a direct public Story link.',
      storySavedToast: 'Story saved to Downloads/Tayyar/Stories & Gallery!',
      storiesFoundCount: 'stories found',
      waGrantedToast: 'WhatsApp folder connected!',
    },
    ar: {
      appTitle: 'تيّار',
      tabHomeTitle: 'تيّار',
      homeSubtitle: 'منزّل الوسائط والملفات',
      quickDownloadLbl: 'تحميل سريع',
      supportedSources: 'المنصات المدعومة',
      totalFilesLbl: 'الملفات',
      totalSizeLbl: 'الحجم المحفوظ',
      searchSubtitle: 'ابحث في الملفات أو الصق أي رابط',
      addFirstBtn: 'إضافة تحميل',
      engineReady: 'المحرك جاهز',
      urlPlaceholder: 'الصق رابط فيديو أو ملف مباشر...',
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
      downloadsSubtitle: 'تُحفظ مباشرة في الاستوديو (Movies/Tayyar) والتحميلات',
      clearCompleted: 'مسح المكتملة',
      filterAll: 'الكل',
      filterActive: 'النشطة',
      filterCompleted: 'المحفوظة',
      filterFailed: 'فشلت',
      settingsTitle: 'الإعدادات',
      identitySub: 'منزّل الوسائط والستوريات الشامل',
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
      storiesHubTitle: 'حافظ الستوريات والحالات',
      storiesHubSub: 'واتساب • انستغرام • فيسبوك • سناب شات',
      storiesHubDesc: 'تحميل حالات وستوريات الصور والفيديو بأعلى جودة أصلية',
      storiesBadge: 'ستوريات HD',
      waGrantBtn: 'السماح لواتساب',
      waGrantBizBtn: 'واتساب للأعمال',
      refresh: 'تحديث',
      storyInputPlaceholder: 'أدخل اسم المستخدم @username أو الصق رابط الستوري...',
      fetchStoriesBtn: 'جلب الستوريات النشطة',
      fetchingStories: 'جاري فحص واستخراج الستوريات...',
      saveAllStories: 'حفظ الكل',
      allPlatformsLbl: 'منصات الفيديو والملفات',
      saveBtn: 'حفظ',
      savedBtn: 'تم الحفظ',
      waNeedPermTitle: 'منح صلاحية حالات واتساب',
      waNeedPermDesc: 'اضغط على "السماح لواتساب" بالأعلى ثم اختر "استخدام هذا المجلد" لعرض وحفظ جميع حالات واتساب (صور وفيديو) مباشرة في الاستوديو.',
      waEmptyTitle: 'لا توجد حالات واتساب حالياً',
      waEmptyDesc: 'افتح تطبيق واتساب وشاهد الحالة أولاً، ثم اضغط على تحديث هنا لحفظها فوراً بجودتها الأصلية.',
      waIosTitle: 'حالات واتساب على آيفون (iOS)',
      waIosDesc: 'نظام iOS يعزل ملفات واتساب للخصوصية. يمكنك تحميل ستوريات سناب شات وانستغرام وفيسبوك مباشرة من التبويبات أعلاه.',
      waIosImportBtn: 'استيراد صورة / فيديو',
      storyEmptyPromptTitle: 'أدخل اسم المستخدم أو رابط الستوري',
      storyEmptyPromptDesc: 'اكتب اسم مستخدم عام في سناب شات أو انستغرام أو الصق رابط ستوري لاستخراج جميع الصور والفيديوهات النشطة.',
      storyNotFoundTitle: 'لم يتم العثور على ستوريات عامة',
      storyAuthHint: 'قد يكون الحساب خاصاً أو يتطلب تسجيل دخول. جرّب حساباً عاماً أو الصق رابط ستوري عام مباشر.',
      storySavedToast: 'تم حفظ الستوري في Downloads/Tayyar/Stories والمعرض!',
      storiesFoundCount: 'ستوريات متاحة',
      waGrantedToast: 'تم ربط مجلد حالات واتساب بنجاح!',
    },
  };

  /* ==================== STATE ==================== */
  const state = {
    lang: 'en',
    activeTab: 'home',
    filter: 'all',
    aura: 'theme-oled',
    prefs: {
      defaultFormat: 'video',
      autoGallery: true,
      autoAnalyze: true,
    },
    downloads: [],
    currentResolved: null,
    activePolls: new Map(),
    updateRelease: null,
    hasNewerUpdate: false,
    storyPlatform: 'whatsapp',
    waStatuses: [],
    waNeedsSaf: false,
    waLoadedOnce: false,
    socialStories: [],
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
    state.aura = auraClass || 'theme-oled';
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
    if (tabName === 'platforms' && state.storyPlatform === 'whatsapp' && !state.waLoadedOnce) {
      loadWhatsAppStatuses();
    }
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
            if (play) formats.push({ id: 'video', ext: 'mp4', url: play, directUrl: play, referer: 'https://www.tiktok.com/' });
            if (music) formats.push({ id: 'audio', ext: 'mp3', url: music, directUrl: music, referer: 'https://www.tiktok.com/' });
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
      try {
        const r2 = await fetch(`https://nntech-free-tt-api.vercel.app/api/tiktok/mp4?url=${encodeURIComponent(cleanUrl)}`);
        if (r2.ok) {
          const j2 = await r2.json();
          if (j2?.download && j2.download.startsWith('http')) {
            return {
              ok: true,
              platform: 'TikTok',
              platformId: 'tiktok',
              platformIcon: '⚡',
              title: j2.title || 'TikTok Video',
              author: 'TikTok',
              thumbnail: '',
              formats: [{ id: 'video', ext: 'mp4', url: j2.download, directUrl: j2.download, referer: 'https://www.tiktok.com/' }],
            };
          }
        }
      } catch (_) {}
    }

    if (plat.id === 'youtube') {
      const m = cleanUrl.match(/(?:watch\?v=|shorts\/|live\/|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
      if (m) {
        const vidId = m[1];
        // Primary: YouTube Official InnerTube ANDROID_VR (direct progressive MP4 with FULL AUDIO!)
        try {
          const ytUa = 'com.google.android.apps.youtube.vr.oculus/1.60.19 (Linux; U; Android 12L; eureka-user Build/SQ3A.220605.009.A1) gzip';
          const rYt = await fetch('https://www.youtube.com/youtubei/v1/player?prettyPrint=false', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'User-Agent': ytUa },
            body: JSON.stringify({
              videoId: vidId,
              context: {
                client: {
                  clientName: 'ANDROID_VR',
                  clientVersion: '1.60.19',
                  deviceMake: 'Oculus',
                  deviceModel: 'Quest 3',
                  osName: 'Android',
                  osVersion: '12L',
                  androidSdkVersion: 32,
                  hl: 'en',
                  gl: 'US',
                },
              },
              contentCheckOk: true,
              racyCheckOk: true,
            }),
          });
          if (rYt.ok) {
            const ytJson = await rYt.json();
            const formats = [];
            const prog = ytJson?.streamingData?.formats || [];
            for (let i = prog.length - 1; i >= 0; i--) {
              if (prog[i]?.url) {
                formats.push({ id: 'video', ext: 'mp4', url: prog[i].url, directUrl: prog[i].url, userAgent: ytUa });
                break;
              }
            }
            const adaptive = ytJson?.streamingData?.adaptiveFormats || [];
            const bestAud = adaptive
              .filter((f) => f?.url && String(f.mimeType || '').toLowerCase().startsWith('audio/mp4'))
              .sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0))[0];
            if (bestAud?.url) {
              formats.push({ id: 'audio', ext: 'm4a', url: bestAud.url, directUrl: bestAud.url, userAgent: ytUa });
            }
            if (formats.length) {
              return {
                ok: true,
                platform: 'YouTube',
                platformId: 'youtube',
                platformIcon: '▶',
                title: ytJson?.videoDetails?.title || 'YouTube Video',
                author: ytJson?.videoDetails?.author || 'YouTube',
                thumbnail: `https://i.ytimg.com/vi/${vidId}/hqdefault.jpg`,
                formats,
              };
            }
          }
        } catch (_) {}
      }
    }

    if (plat.id === 'facebook') {
      try {
        const rFb = await fetch('https://fdown.co.in/ajax', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Origin: 'https://fdown.co.in', Referer: 'https://fdown.co.in/' },
          body: JSON.stringify({ url: cleanUrl }),
        });
        if (rFb.ok) {
          const jFb = await rFb.json();
          if (jFb?.success && jFb.links) {
            const entries = Object.entries(jFb.links).filter(([, v]) => typeof v === 'string' && v.startsWith('http'));
            if (entries.length) {
              const best = entries.find(([k]) => /hd|1080|720/i.test(k)) || entries[0];
              return {
                ok: true,
                platform: 'Facebook',
                platformId: 'facebook',
                platformIcon: '📘',
                title: jFb.title || 'Facebook Video',
                author: jFb.uploader || 'Facebook',
                thumbnail: jFb.thumbnail || '',
                formats: [{ id: 'video', ext: 'mp4', url: best[1], directUrl: best[1] }],
              };
            }
          }
        }
      } catch (_) {}
    }

    if (plat.id === 'instagram') {
      try {
        const sc = cleanUrl.match(/\/(?:p|reel|tv)\/([A-Za-z0-9_-]+)/);
        if (sc) {
          const rIg = await fetch(`https://www.instagram.com/p/${sc[1]}/embed/captioned/`);
          if (rIg.ok) {
            const html = await rIg.text();
            const mv = html.match(/"video_url"\s*:\s*"(https:[^"\\]+)"/);
            const mi = html.match(/"display_url"\s*:\s*"(https:[^"\\]+)"/);
            const vUrl = mv ? mv[1].replace(/\\u0026/g, '&').replace(/\\\//g, '/').replace(/\\u002F/g, '/') : '';
            const iUrl = mi ? mi[1].replace(/\\u0026/g, '&').replace(/\\\//g, '/').replace(/\\u002F/g, '/') : '';
            if (vUrl || iUrl) {
              return {
                ok: true,
                platform: 'Instagram',
                platformId: 'instagram',
                platformIcon: '📷',
                title: `Instagram_${sc[1]}`,
                author: 'Instagram',
                thumbnail: iUrl,
                formats: [{ id: vUrl ? 'video' : 'image', ext: vUrl ? 'mp4' : 'jpg', url: vUrl || iUrl, directUrl: vUrl || iUrl }],
              };
            }
          }
        }
      } catch (_) {}
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

  async function startDownload({ url, filename, referer = '', userAgent = '', platformIcon = '🎬', isAudio = false }) {
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

    // 1. Android Native Java Background Thread Downloader (MediaStore Gallery + Downloads)
    const native = getNativeEngine();
    if (native && typeof native.startDownload === 'function') {
      try {
        const res = await native.startDownload({ url, filename, referer, userAgent });
        if (res && res.downloadId) {
          item.nativeId = String(res.downloadId);
          saveDownloads();
          pollNativeDownload(item);
          return;
        }
      } catch (e) {
        console.warn('Native Android startDownload error:', e);
      }
    }

    // 2. iOS / Web Native Binary Download (XHR responseType='blob' routes through Capacitor native proxy without Base64 corruption!)
    try {
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        let lastT = Date.now();
        let lastB = 0;

        xhr.onprogress = (ev) => {
          if (item.status === 'cancelled') {
            try { xhr.abort(); } catch (_) {}
            return;
          }
          item.downloaded = ev.loaded || 0;
          if (ev.lengthComputable && ev.total > 0) {
            item.total = ev.total;
            item.percent = Math.min(99, Math.round((ev.loaded / ev.total) * 100));
          }
          const now = Date.now();
          if (now - lastT >= 300) {
            item.speed = Math.round(((item.downloaded - lastB) / ((now - lastT) / 1000)) || 0);
            lastT = now;
            lastB = item.downloaded;
            renderAllViews();
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 400 && xhr.response && xhr.response.size > 0) {
            const ct = String(xhr.getResponseHeader('Content-Type') || xhr.response.type || '').toLowerCase();
            if (ct.includes('text/html') && /\.(mp4|mp3|m4a|jpg|jpeg|png)$/i.test(filename)) {
              reject(new Error('Could not extract direct media stream'));
              return;
            }
            resolve(xhr.response);
          } else {
            reject(new Error(`HTTP ${xhr.status || 'Network Error'}`));
          }
        };
        xhr.onerror = () => reject(new Error('Network error'));
        xhr.onabort = () => reject(new Error('Cancelled'));
        xhr.send();
      });

      if (item.status === 'cancelled') return;

      item.status = 'completed';
      item.percent = 100;
      item.speed = 0;
      item.downloaded = blob.size;
      if (item.total <= 0) item.total = blob.size;
      saveDownloads();
      renderAllViews();
      showToast(t('dlDoneToast'));

      // Native iOS Share Sheet ("Save Video" -> Apple Photos / Save to Files) or Blob download
      try {
        const mime = isAudio ? 'audio/mpeg' : (filename.endsWith('.jpg') ? 'image/jpeg' : 'video/mp4');
        const fileObj = new File([blob], filename, { type: blob.type || mime });
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
      setTimeout(() => URL.revokeObjectURL(objUrl), 8000);
    } catch (err) {
      if (item.status === 'cancelled') return;
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
          <div class="dl-thumb-ic">${getMediaTypeSvg(d.filename)}</div>
          <div class="dl-info">
            <div class="dl-name">${escapeHtml(d.filename)}</div>
            <div class="dl-meta">
              <span class="dl-status-tag ${statusCls}">${statusText}</span>
              ${metaRight ? `<span>• ${escapeHtml(metaRight)}</span>` : ''}
            </div>
          </div>
          <div class="dl-actions">
            ${isRun
              ? `<button type="button" class="dl-ic-btn" data-act="cancel" data-id="${d.id}" aria-label="Cancel"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg></button>`
              : `<button type="button" class="dl-ic-btn" data-act="remove" data-id="${d.id}" aria-label="Delete"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg></button>`}
          </div>
        </div>
        <div class="dl-bar-track">
          <div class="dl-bar-fill ${statusCls}" style="width:${pct}%"></div>
        </div>
      </div>
    `;
  }

  function getMediaTypeSvg(filename) {
    const low = String(filename || '').toLowerCase();
    if (low.endsWith('.mp3') || low.endsWith('.m4a') || low.endsWith('.wav')) {
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>';
    }
    if (low.endsWith('.mp4') || low.endsWith('.mkv') || low.endsWith('.webm') || low.endsWith('.mov')) {
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="3"/><polygon points="10 9 15 12 10 15 10 9" fill="currentColor" stroke="none"/></svg>';
    }
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>';
  }

  const EMPTY_DL_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>';
  const EMPTY_SEARCH_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="11" cy="11" r="7.5"/><line x1="20.5" y1="20.5" x2="16.4" y2="16.4"/></svg>';

  function escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  }

  function renderStatsAndMiniBar() {
    const active = state.downloads.filter((d) => d.status === 'downloading');
    const done = state.downloads.filter((d) => d.status === 'completed');
    const failed = state.downloads.filter((d) => d.status === 'error');
    const totalSpeed = active.reduce((sum, d) => sum + (d.speed || 0), 0);
    const totalSavedBytes = done.reduce((sum, d) => sum + (d.total || d.downloaded || 0), 0);
    const speedStr = fmtSpeed(totalSpeed);

    const elAct = $('#statActive');
    const elDone = $('#statDone');
    const elSpd = $('#statSpeed');
    const topSpd = $('#topSpeedReadout');
    if (elAct) elAct.textContent = String(active.length);
    if (elDone) elDone.textContent = String(done.length);
    if (elSpd) elSpd.textContent = speedStr;
    if (topSpd) topSpd.textContent = speedStr;

    const sFiles = $('#sumTotalFiles');
    const sSize = $('#sumTotalSize');
    const sSpd = $('#sumActiveSpeed');
    if (sFiles) sFiles.textContent = String(done.length);
    if (sSize) sSize.textContent = fmtBytes(totalSavedBytes);
    if (sSpd) sSpd.textContent = speedStr;

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

    const miniBar = $('#miniBar');
    if (miniBar) {
      const top = active[0];
      if (top) {
        miniBar.hidden = false;
        $('#miniArt').innerHTML = getMediaTypeSvg(top.filename);
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
          <div class="empty-svg-circle">${EMPTY_DL_SVG}</div>
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
          <div class="empty-svg-circle">${EMPTY_DL_SVG}</div>
          <div class="empty-state-title">${t('emptyListTitle')}</div>
          <div class="empty-state-sub">${t('emptyListSub')}</div>
          <button type="button" class="empty-cta-btn" id="emptyAddFirstBtn">${t('addFirstBtn')}</button>
        </div>
      `;
      $('#emptyAddFirstBtn')?.addEventListener('click', () => {
        switchTab('home');
        setTimeout(() => urlInput?.focus(), 160);
      });
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
          <div class="empty-svg-circle">${EMPTY_SEARCH_SVG}</div>
          <div class="empty-state-title">${t('emptySearchTitle')}</div>
          <div class="empty-state-sub">${t('emptySearchSub')}</div>
        </div>
      `;
      return;
    }

    if (/^https?:\/\//i.test(q)) {
      wrap.innerHTML = `
        <div class="pro-glass-card" style="display:flex;flex-direction:column;gap:10px;">
          <div style="font-size:13px;color:var(--text-2);word-break:break-all;">${escapeHtml(q)}</div>
          <button type="button" class="cta-primary-btn" style="margin-top:0;" id="btnSearchQuickGo">${t('openOrAnalyze')}</button>
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
          <div class="empty-svg-circle">${EMPTY_SEARCH_SVG}</div>
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
    if (typeof renderWhatsAppStatusesGrid === 'function') renderWhatsAppStatusesGrid();
    if (typeof renderSocialStoriesGrid === 'function') renderSocialStoriesGrid();
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

      // If it's a direct downloadable file URL, start downloading IMMEDIATELY!
      if (data.platformId === 'direct' && /\.(mp4|mp3|m4a|mkv|webm|apk|zip|rar|7z|pdf|jpg|jpeg|png|webp|exe|dmg|iso)(\?.*)?$/i.test(raw)) {
        await triggerResolvedDownload(false);
        return;
      }

      if (previewCard) {
        previewCard.hidden = false;
        setTimeout(() => previewCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 80);
      }
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
          fallback.style.display = 'flex';
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
      userAgent: chosen?.userAgent || '',
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

  // Platform quick selection (from Source Chips & Platforms Grid)
  $$('[data-plat]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const pName = btn.querySelector('.plat-card-name, .chip-name')?.textContent || btn.dataset.plat;
      switchTab('home');
      setTimeout(() => {
        if (urlInput) urlInput.focus();
        showToast(`${t('platSelectedHint')} ${pName}`);
      }, 180);
    });
  });

  $('#btnSeeAllPlatforms')?.addEventListener('click', () => switchTab('platforms'));
  $('#btnSeeAllDownloads')?.addEventListener('click', () => switchTab('downloads'));
  $('#btnAddNewFromDl')?.addEventListener('click', () => {
    switchTab('home');
    setTimeout(() => urlInput?.focus(), 160);
  });

  // Spotlight quick filter chips in Search tab
  $$('#spotlightChips .spot-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      const si = $('#searchInput');
      if (si) {
        si.value = chip.dataset.q || '';
        renderSearchResults();
      }
    });
  });

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

  /* ==================== UNIVERSAL STORIES & STATUS SAVER (WA / SNAP / IG / FB) ==================== */
  const STORY_DL_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>';
  const STORY_PLAY_SVG = '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4"/></svg>';
  const STORY_IMG_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>';

  function isAndroidNative() {
    try {
      const cap = window.Capacitor;
      if (cap && typeof cap.getPlatform === 'function') {
        return cap.getPlatform() === 'android';
      }
    } catch (_) {}
    return /Android/i.test(navigator.userAgent) && !!getNativeEngine();
  }

  function switchStoryPlatform(plat) {
    state.storyPlatform = plat;
    $$('#storyPlatPills .story-pill').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.storyPlat === plat);
    });
    const waPanel = $('#storyPanelWhatsApp');
    const socPanel = $('#storyPanelSocial');
    if (waPanel) waPanel.hidden = plat !== 'whatsapp';
    if (socPanel) socPanel.hidden = plat === 'whatsapp';

    if (plat === 'whatsapp') {
      loadWhatsAppStatuses();
    } else {
      renderSocialStoriesGrid();
    }
  }

  function renderWhatsAppStatusesGrid() {
    const grid = $('#waStatusGrid');
    if (!grid) return;

    const native = getNativeEngine();
    const canNativeWa = isAndroidNative() && native && typeof native.listWhatsAppStatuses === 'function';

    // Hide Android-only toolbar buttons on iOS / Web
    const waToolbar = $('.wa-toolbar');
    if (waToolbar) waToolbar.hidden = !canNativeWa;

    if (!canNativeWa) {
      grid.innerHTML = `
        <div class="story-empty-card">
          <div class="story-empty-title">${t('waIosTitle')}</div>
          <div class="story-empty-desc">${t('waIosDesc')}</div>
        </div>
      `;
      return;
    }

    if (state.waNeedsSaf && state.waStatuses.length === 0) {
      grid.innerHTML = `
        <div class="story-empty-card">
          <div class="story-empty-title">${t('waNeedPermTitle')}</div>
          <div class="story-empty-desc">${t('waNeedPermDesc')}</div>
        </div>
      `;
      return;
    }

    if (state.waStatuses.length === 0) {
      grid.innerHTML = `
        <div class="story-empty-card">
          <div class="story-empty-title">${t('waEmptyTitle')}</div>
          <div class="story-empty-desc">${t('waEmptyDesc')}</div>
        </div>
      `;
      return;
    }

    grid.innerHTML = state.waStatuses.map((item, idx) => `
      <div class="story-tile">
        ${item.thumbnail
          ? `<img class="story-tile-img" src="${item.thumbnail}" alt="" />`
          : `<div class="story-tile-fallback">${item.type === 'video' ? STORY_PLAY_SVG : STORY_IMG_SVG}</div>`}
        <span class="story-type-pill">${item.type === 'video' ? 'MP4' : 'IMG'}</span>
        <button type="button" class="story-save-btn" data-wa-idx="${idx}">
          ${STORY_DL_SVG}
          <span>${item._saved ? t('savedBtn') : t('saveBtn')}</span>
        </button>
      </div>
    `).join('');

    $$('.story-save-btn[data-wa-idx]', grid).forEach((btn) => {
      btn.addEventListener('click', async () => {
        const idx = Number(btn.dataset.waIdx);
        const entry = state.waStatuses[idx];
        if (!entry) return;
        const eng = getNativeEngine();
        if (!eng || typeof eng.saveWhatsAppStatus !== 'function') return;
        try {
          const res = await eng.saveWhatsAppStatus({
            uri: entry.uri || '',
            path: entry.path || '',
            name: entry.name || `Status_${Date.now()}.${entry.type === 'video' ? 'mp4' : 'jpg'}`,
          });
          if (res && res.ok) {
            entry._saved = true;
            state.downloads.unshift({
              id: `wa_${Date.now()}_${idx}`,
              url: entry.uri || entry.path || 'whatsapp://status',
              filename: res.filename || entry.name,
              status: 'completed',
              downloaded: res.size || entry.size || 0,
              total: res.size || entry.size || 0,
              percent: 100,
              speed: 0,
              addedAt: Date.now(),
            });
            saveDownloads();
            renderAllViews();
            showToast(t('storySavedToast'));
          }
        } catch (err) {
          showToast(`${t('dlFailToast')}: ${err.message || ''}`);
        }
      });
    });
  }

  async function loadWhatsAppStatuses() {
    state.waLoadedOnce = true;
    const native = getNativeEngine();
    if (!isAndroidNative() || !native || typeof native.listWhatsAppStatuses !== 'function') {
      renderWhatsAppStatusesGrid();
      return;
    }
    try {
      const res = await native.listWhatsAppStatuses();
      state.waStatuses = Array.isArray(res?.items) ? res.items : [];
      state.waNeedsSaf = !!res?.needsSaf;
      renderWhatsAppStatusesGrid();
    } catch (_) {
      renderWhatsAppStatusesGrid();
    }
  }

  async function requestWhatsAppFolder(isBusiness) {
    const native = getNativeEngine();
    if (!native || typeof native.requestWhatsAppStatusAccess !== 'function') return;
    try {
      const res = await native.requestWhatsAppStatusAccess({ business: !!isBusiness });
      if (res && res.granted) {
        showToast(t('waGrantedToast'));
        await loadWhatsAppStatuses();
      }
    } catch (e) {
      showToast(e.message || t('dlFailToast'));
    }
  }

  // Cross-platform JS fallback for iOS (CapacitorHttp handles zero-CORS natively!)
  async function resolveStoriesViaJs(rawInput, plat) {
    const clean = rawInput.trim();
    const stories = [];
    const seen = new Set();

    if (plat === 'snapchat') {
      let user = clean.replace(/^@/, '').split(/[/?#]/)[0];
      const urls = /^https?:\/\//i.test(clean)
        ? [clean]
        : [
            `https://www.snapchat.com/@${encodeURIComponent(user)}`,
            `https://www.snapchat.com/add/${encodeURIComponent(user)}`,
            `https://story.snapchat.com/s/${encodeURIComponent(user)}`,
          ];
      for (const u of urls) {
        try {
          const r = await fetch(u);
          if (!r.ok) continue;
          const html = await r.text();
          const m = html.match(/<script[^>]+id=["']__NEXT_DATA__["'][^>]*>([\s\S]*?)<\/script>/i);
          if (m && m[1]) {
            const j = JSON.parse(m[1]);
            const pp = j?.props?.pageProps || {};
            const prof = pp.userProfile?.publicProfileInfo || pp.userProfile?.userInfo || {};
            const uname = prof.username || user || 'snapchat';
            const avatar = prof.profilePictureUrl || '';
            const addList = (arr, prefix) => {
              if (!Array.isArray(arr)) return;
              arr.forEach((snap, idx) => {
                const mUrl = snap?.snapUrls?.mediaUrl || snap?.mediaUrl || '';
                if (!mUrl || seen.has(mUrl)) return;
                seen.add(mUrl);
                const isVid = snap?.snapMediaType === 1 || /\.mp4/i.test(mUrl);
                const ext = isVid ? 'mp4' : 'jpg';
                stories.push({
                  id: `snap_${prefix}_${idx}`,
                  type: isVid ? 'video' : 'image',
                  url: mUrl,
                  thumbnail: snap?.snapUrls?.mediaPreviewUrl?.value || (isVid ? avatar : mUrl),
                  ext,
                  filename: sanitizeName(`Snapchat_${uname}_${prefix}_${idx + 1}`, ext),
                });
              });
            };
            addList(pp.story?.snapList, 'story');
            (pp.curatedHighlights || []).forEach((h, i) => addList(h?.snapList, `hl${i + 1}`));
            (pp.spotlightHighlights || []).forEach((h, i) => addList(h?.snapList, `spot${i + 1}`));
            if (stories.length > 0) return { ok: true, stories };
          }
        } catch (_) {}
      }
      return { ok: false, stories: [] };
    }

    // Instagram / Facebook iOS CapacitorHttp HTML extraction
    try {
      const targetUrl = /^https?:\/\//i.test(clean)
        ? clean
        : (plat === 'instagram'
            ? `https://www.instagram.com/stories/${encodeURIComponent(clean.replace(/^@/, ''))}/`
            : `https://www.facebook.com/stories/${encodeURIComponent(clean.replace(/^@/, ''))}/`);
      const r = await fetch(targetUrl);
      if (r.ok) {
        const html = await r.text();
        const matches = [...html.matchAll(/"(?:browser_native_hd_url|playable_url_quality_hd|playable_url|video_url)":"(https:[^"\\]+)"/g)];
        matches.forEach((m, i) => {
          const vUrl = m[1].replace(/\\\//g, '/').replace(/\\u0026/g, '&');
          if (!seen.has(vUrl)) {
            seen.add(vUrl);
            stories.push({
              id: `${plat}_${i}`,
              type: 'video',
              url: vUrl,
              thumbnail: '',
              ext: 'mp4',
              filename: sanitizeName(`${plat}_Story_${i + 1}`, 'mp4'),
            });
          }
        });
        if (stories.length === 0) {
          const ogV = html.match(/<meta[^>]+property=["']og:video(?::secure_url|:url)?["'][^>]+content=["']([^"']+)["']/i);
          if (ogV && ogV[1]) {
            stories.push({
              id: `${plat}_og`,
              type: 'video',
              url: ogV[1].replace(/&amp;/g, '&'),
              thumbnail: '',
              ext: 'mp4',
              filename: sanitizeName(`${plat}_Story_1`, 'mp4'),
            });
          }
        }
      }
    } catch (_) {}

    return { ok: stories.length > 0, stories, needsAuth: stories.length === 0 };
  }

  function renderSocialStoriesGrid(emptyMode = 'prompt') {
    const grid = $('#socialStoriesGrid');
    const resBar = $('#storyResultsBar');
    const countLbl = $('#storyCountLbl');
    if (!grid) return;

    if (state.socialStories.length === 0) {
      if (resBar) resBar.hidden = true;
      const isNotFound = emptyMode === 'notfound';
      grid.innerHTML = `
        <div class="story-empty-card">
          <div class="story-empty-title">${isNotFound ? t('storyNotFoundTitle') : t('storyEmptyPromptTitle')}</div>
          <div class="story-empty-desc">${isNotFound ? t('storyAuthHint') : t('storyEmptyPromptDesc')}</div>
        </div>
      `;
      return;
    }

    if (resBar) resBar.hidden = false;
    if (countLbl) countLbl.textContent = `${state.socialStories.length} ${t('storiesFoundCount')}`;

    grid.innerHTML = state.socialStories.map((st, idx) => `
      <div class="story-tile">
        ${st.thumbnail
          ? `<img class="story-tile-img" src="${escapeHtml(st.thumbnail)}" alt="" />`
          : `<div class="story-tile-fallback">${st.type === 'video' ? STORY_PLAY_SVG : STORY_IMG_SVG}</div>`}
        <span class="story-type-pill">${st.type === 'video' ? 'MP4' : 'JPG'}</span>
        <button type="button" class="story-save-btn" data-story-idx="${idx}">
          ${STORY_DL_SVG}
          <span>${t('saveBtn')}</span>
        </button>
      </div>
    `).join('');

    $$('.story-save-btn[data-story-idx]', grid).forEach((btn) => {
      btn.addEventListener('click', () => {
        const st = state.socialStories[Number(btn.dataset.storyIdx)];
        if (!st || !st.url) return;
        startDownload({
          url: st.url,
          filename: st.filename || sanitizeName(`Story_${Date.now()}`, st.ext || 'mp4'),
          isAudio: false,
        });
      });
    });
  }

  async function fetchSocialStories() {
    const inp = ($('#storyInput')?.value || '').trim();
    if (!inp) {
      showToast(t('storyEmptyPromptTitle'));
      return;
    }
    const loader = $('#storyLoader');
    if (loader) loader.hidden = false;
    state.socialStories = [];
    renderSocialStoriesGrid('prompt');

    let result = null;
    const native = getNativeEngine();
    if (native && typeof native.resolveStories === 'function') {
      try {
        result = await native.resolveStories({ input: inp, platform: state.storyPlatform });
      } catch (_) {}
    }
    if (!result || !Array.isArray(result.stories) || result.stories.length === 0) {
      result = await resolveStoriesViaJs(inp, state.storyPlatform);
    }

    if (loader) loader.hidden = true;
    state.socialStories = Array.isArray(result?.stories) ? result.stories : [];
    renderSocialStoriesGrid(state.socialStories.length ? 'ok' : 'notfound');
  }

  // Wire Stories Hub events
  $('#btnOpenStoriesHub')?.addEventListener('click', () => {
    switchTab('platforms');
    switchStoryPlatform('whatsapp');
  });

  $$('#storyPlatPills .story-pill').forEach((pill) => {
    pill.addEventListener('click', () => switchStoryPlatform(pill.dataset.storyPlat));
  });

  $('#btnWaGrantNormal')?.addEventListener('click', () => requestWhatsAppFolder(false));
  $('#btnWaGrantBiz')?.addEventListener('click', () => requestWhatsAppFolder(true));
  $('#btnWaRefresh')?.addEventListener('click', () => loadWhatsAppStatuses());

  $('#btnStoryPaste')?.addEventListener('click', async () => {
    try {
      const txt = (await navigator.clipboard.readText() || '').trim();
      if (txt && $('#storyInput')) {
        $('#storyInput').value = txt;
        showToast(t('pasteSuccess'));
      }
    } catch (_) {
      $('#storyInput')?.focus();
    }
  });

  $('#btnFetchStories')?.addEventListener('click', fetchSocialStories);
  $('#storyInput')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      $('#storyInput')?.blur();
      fetchSocialStories();
    }
  });

  $('#btnSaveAllStories')?.addEventListener('click', () => {
    state.socialStories.forEach((st) => {
      if (st && st.url) {
        startDownload({
          url: st.url,
          filename: st.filename || sanitizeName(`Story_${Date.now()}`, st.ext || 'mp4'),
          isAudio: false,
        });
      }
    });
  });

  /* ==================== BOOTSTRAP ==================== */
  function init() {
    loadStorage();
    applyAura(state.aura);

    if (cfgDefaultFormat) cfgDefaultFormat.value = state.prefs.defaultFormat;
    if (cfgAutoGallery) cfgAutoGallery.checked = state.prefs.autoGallery;
    if (cfgAutoAnalyze) cfgAutoAnalyze.checked = state.prefs.autoAnalyze;

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
    requestAnimationFrame(() => snapLiquidLens(state.activeTab, false));
  }

  init();
})();
