'use strict';

(() => {
  const APP_VERSION = '1.0.24';
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
      storyAuthHint: 'Instagram and Facebook Stories are 24-hour private media that require login. For Reels & Posts, paste their direct link to download in HD. For stories, open in your browser with the Tayyar extension.',
      storySavedToast: 'Story saved to Downloads/Tayyar/Stories & Gallery!',
      storiesFoundCount: 'stories found',
      waGrantedToast: 'WhatsApp folder connected!',
      typeVideos: 'Videos',
      typePhotos: 'Photos',
      storyPickCountLbl: 'Number of stories to download',
      selectAllBtn: 'All',
      clearSelBtn: 'Clear',
      downloadSelectedBtn: 'Download Selected',
      batchStartedToast: 'Downloading selected stories:',
      batchSavedToast: 'Saved selected statuses to Gallery:',
      selectAtLeastOne: 'Select at least 1 story to download',
      updPopTitle: 'New Update Available',
      updWhatsNew: "What's New",
      updDownloading: 'Downloading update...',
      updNowDirect: 'Update Now',
      updInstallNow: 'Install Update',
      updReadyInstall: 'Ready to install!',
      updLaterBtn: 'Later',
      updSkipBtn: 'Skip Version',
      updStableBadge: 'Stable',
      updBetaBadge: 'Beta',
      updSkippedToast: 'Skipped version',
      streamExtractFailed: 'Could not extract direct media stream (link may be private, restricted, or invalid)',
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
      storyAuthHint: 'ستوريات إنستجرام وفيسبوك محتوى مؤقت (24 ساعة) وخاص محمي بتسجيل الدخول. بالنسبة للريلز والمنشورات العامة يمكنك تحميلها فوراً بنسخ رابط الـ Reel أو Post، أما الستوريات فيمكنك حفظها عبر فتحها بالمتصفح مع إضافة تيّار.',
      storySavedToast: 'تم حفظ الستوري في Downloads/Tayyar/Stories والمعرض!',
      storiesFoundCount: 'ستوريات متاحة',
      waGrantedToast: 'تم ربط مجلد حالات واتساب بنجاح!',
      typeVideos: 'فيديو',
      typePhotos: 'صور',
      storyPickCountLbl: 'عدد الستوريات المطلوب تحميلها',
      selectAllBtn: 'الكل',
      clearSelBtn: 'مسح',
      downloadSelectedBtn: 'تحميل المحدد',
      batchStartedToast: 'بدأ تحميل الستوريات المحددة:',
      batchSavedToast: 'تم حفظ الحالات المحددة في المعرض:',
      selectAtLeastOne: 'اختر ستوري واحد على الأقل للتحميل',
      updPopTitle: 'يتوفر تحديث جديد',
      updWhatsNew: 'الجديد في هذا الإصدار',
      updDownloading: 'جاري تحميل التحديث مباشرة...',
      updNowDirect: 'تحديث الآن',
      updInstallNow: 'تثبيت التحديث',
      updReadyInstall: 'اكتمل التحميل! جاهز للتثبيت.',
      updLaterBtn: 'لاحقاً',
      updSkipBtn: 'تخطي الإصدار',
      updStableBadge: 'مستقر',
      updBetaBadge: 'تجريبي',
      updSkippedToast: 'تم تخطي الإصدار',
      streamExtractFailed: 'تعذر استخراج رابط الوسائط المباشر (قد يكون الرابط خاصاً أو مقيداً أو غير متاح)',
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
    waFilter: 'all',
    waSelected: new Set(),
    socialStories: [],
    socialFilter: 'all',
    socialSelected: new Set(),
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
  let _cachedNativeEngine = null;
  function getNativeEngine() {
    if (_cachedNativeEngine) return _cachedNativeEngine;
    try {
      if (typeof window !== 'undefined' && window.Capacitor) {
        if (typeof window.Capacitor.registerPlugin === 'function') {
          _cachedNativeEngine = window.Capacitor.registerPlugin('TayyarMobileEngine');
          return _cachedNativeEngine;
        }
        if (window.Capacitor.Plugins?.TayyarMobileEngine) {
          _cachedNativeEngine = window.Capacitor.Plugins.TayyarMobileEngine;
          return _cachedNativeEngine;
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

  async function httpFetch(url, options = {}) {
    const cap = window.Capacitor?.Plugins?.CapacitorHttp || window.CapacitorHttp;
    if (cap && typeof cap.request === 'function') {
      try {
        const method = (options.method || 'GET').toUpperCase();
        let headers = options.headers || {};
        if (headers instanceof Headers) {
          const hObj = {};
          headers.forEach((v, k) => { hObj[k] = v; });
          headers = hObj;
        }
        const res = await cap.request({
          url,
          method,
          headers,
          data: options.body,
        });
        const status = typeof res.status === 'number' ? res.status : 200;
        const resData = res.data;
        return {
          ok: status >= 200 && status < 300,
          status,
          statusText: String(status),
          headers: new Headers(res.headers || {}),
          text: async () => typeof resData === 'string' ? resData : JSON.stringify(resData),
          json: async () => typeof resData === 'object' ? resData : JSON.parse(resData),
        };
      } catch (err) {
        console.warn('CapacitorHttp request warning, falling back to window.fetch:', err);
      }
    }
    return window.fetch(url, options);
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
          const streamUrl = first.directUrl || first.url || '';
          const isEmbed = streamUrl.includes('/embed/') || streamUrl.includes('youtube.com/embed') || streamUrl.includes('facebook.com/plugins');
          const isRealStream = streamUrl && streamUrl !== cleanUrl && !isEmbed;
          if ((isRealStream || plat.id === 'direct') && !isEmbed) {
            return { ...res, platformId: plat.id, platformIcon: plat.icon };
          }
        }
      } catch (e) {
        console.warn('Native resolveSocialUrl fallback:', e);
      }
    }

    // 2. Universal APIs (Routed natively via CapacitorHttp on iOS & Android — zero CORS)
    if (plat.id === 'tiktok') {
      // 1st priority: SSSTik (global Cloudflare tikcdn.io CDN — bypasses regional tiktokcdn-us.com blocks!)
      try {
        const home = await httpFetch('https://ssstik.io/');
        const homeHtml = home.ok ? await home.text() : '';
        const tt = (homeHtml.match(/tt\s*=\s*'([^']+)'/) || [])[1] || '';
        const rSss = await httpFetch('https://ssstik.io/abc?url=dl', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded', Origin: 'https://ssstik.io', Referer: 'https://ssstik.io/en' },
          body: `id=${encodeURIComponent(cleanUrl)}&locale=en&tt=${encodeURIComponent(tt)}`,
        });
        if (rSss.ok) {
          const sHtml = await rSss.text();
          const vidM = sHtml.match(/href="(https:\/\/tikcdn\.io\/ssstik\/[^"]+)"/);
          const audM = sHtml.match(/href="(https:\/\/tikcdn\.io\/ssstik\/mp3\/[^"]+)"/);
          const thumbM = sHtml.match(/src="(https:\/\/tikcdn\.io\/ssstik\/thumb\/[^"]+)"/);
          const titleM = sHtml.match(/<p class="maintext">([\s\S]*?)<\/p>/);
          const formats = [];
          if (vidM?.[1]) formats.push({ id: 'video', ext: 'mp4', url: vidM[1], directUrl: vidM[1], referer: 'https://ssstik.io/' });
          if (audM?.[1]) formats.push({ id: 'audio', ext: 'mp3', url: audM[1], directUrl: audM[1], referer: 'https://ssstik.io/' });
          if (formats.length) {
            return {
              ok: true,
              platform: 'TikTok',
              platformId: 'tiktok',
              platformIcon: '⚡',
              title: titleM ? titleM[1].replace(/<[^>]+>/g, '').trim() || 'TikTok Video' : 'TikTok Video',
              author: 'TikTok',
              thumbnail: thumbM?.[1] || '',
              formats,
            };
          }
        }
      } catch (_) {}
      // 2nd priority: NNTech
      try {
        const r2 = await httpFetch(`https://nntech-free-tt-api.vercel.app/api/tiktok/mp4?url=${encodeURIComponent(cleanUrl)}`);
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
      // 3rd priority: TikWM
      try {
        const r = await httpFetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(cleanUrl)}`);
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
    }

    if (plat.id === 'youtube') {
      const m = cleanUrl.match(/(?:watch\?v=|v=|v%3D|shorts\/|live\/|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/i);
      if (m) {
        const vidId = m[1];
        const ytUa = 'com.google.android.apps.youtube.vr.oculus/1.60.19 (Linux; U; Android 12L; eureka-user Build/SQ3A.220605.009.A1) gzip';

        // 1. Primary: YouTube Official InnerTube ANDROID_VR (direct progressive MP4 with FULL AUDIO!)
        try {
          const rYt = await httpFetch('https://www.youtube.com/youtubei/v1/player?prettyPrint=false', {
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
            if (formats.length === 0) {
              const bestVid = adaptive.find((f) => f?.url && String(f.mimeType || '').toLowerCase().startsWith('video/mp4'));
              if (bestVid?.url) {
                formats.push({ id: 'video', ext: 'mp4', url: bestVid.url, directUrl: bestVid.url, userAgent: ytUa });
              }
            }
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

        // 2. Secondary: InnerTube VISIONOS + SOCS=CAI Consent + visitorData (Direct unciphered HD MP4 & Audio)
        try {
          const rPage = await httpFetch(`https://www.youtube.com/watch?v=${vidId}&bpctr=9999999999&has_verified=1`, {
            headers: { 'Cookie': 'PREF=hl=en&tz=UTC; SOCS=CAI' }
          });
          if (rPage.ok) {
            const pageHtml = await rPage.text();
            const mVisitor = pageHtml.match(/"visitorData"\s*:\s*"([^"]+)"/);
            const visitorData = mVisitor ? mVisitor[1] : '';
            const mTitle = pageHtml.match(/<title>([^<]+)<\/title>/i);
            const fallbackTitle = mTitle ? mTitle[1].replace(' - YouTube', '').trim() : 'YouTube Video';

            const rVis = await httpFetch('https://www.youtube.com/youtubei/v1/player?prettyPrint=false', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 15_7_3) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Safari/605.1.15',
                'X-Youtube-Client-Name': '101',
                'X-Youtube-Client-Version': '1.02',
                'X-Goog-Visitor-Id': visitorData,
                'Cookie': 'PREF=hl=en&tz=UTC; SOCS=CAI'
              },
              body: JSON.stringify({
                context: {
                  client: {
                    clientName: 'VISIONOS',
                    clientVersion: '1.02',
                    deviceMake: 'Apple',
                    deviceModel: 'RealityDevice17,1',
                    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 15_7_3) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Safari/605.1.15',
                    osName: 'visionOS',
                    osVersion: '26.5.23O471',
                    hl: 'en',
                    gl: 'US',
                    visitorData: visitorData
                  }
                },
                videoId: vidId,
                contentCheckOk: true,
                racyCheckOk: true
              })
            });
            if (rVis.ok) {
              const jVis = await rVis.json();
              const formats = [];
              const adaptive = jVis?.streamingData?.adaptiveFormats || [];
              const bestVid = adaptive.find((f) => f?.url && String(f.mimeType || '').toLowerCase().startsWith('video/mp4'));
              if (bestVid?.url) {
                formats.push({ id: 'video', ext: 'mp4', url: bestVid.url, directUrl: bestVid.url });
              }
              const bestAud = adaptive
                .filter((f) => f?.url && String(f.mimeType || '').toLowerCase().startsWith('audio/mp4'))
                .sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0))[0];
              if (bestAud?.url) {
                formats.push({ id: 'audio', ext: 'm4a', url: bestAud.url, directUrl: bestAud.url });
              }
              if (formats.length) {
                return {
                  ok: true,
                  platform: 'YouTube',
                  platformId: 'youtube',
                  platformIcon: '▶',
                  title: jVis?.videoDetails?.title || fallbackTitle,
                  author: jVis?.videoDetails?.author || 'YouTube',
                  thumbnail: `https://i.ytimg.com/vi/${vidId}/hqdefault.jpg`,
                  formats,
                };
              }
            }
          }
        } catch (_) {}
      }
    }

    if (plat.id === 'snapchat') {
      try {
        let snapUrl = cleanUrl;
        const rPage = await httpFetch(snapUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
          }
        });
        if (rPage.ok) {
          const html = await rPage.text();
          let directMediaUrl = '';
          let thumb = '';
          let title = 'Snapchat Video';

          // 1. __NEXT_DATA__ extraction
          const mNext = html.match(/<script[^>]+id=["']__NEXT_DATA__["'][^>]*>([\s\S]*?)<\/script>/i);
          if (mNext && mNext[1]) {
            try {
              const jData = JSON.parse(mNext[1]);
              const pp = jData?.props?.pageProps || {};
              const spotlight = pp.spotlightStory || pp.storyResponse || pp.userProfile;
              const snaps = pp.storyResponse?.story?.snaps || pp.curatedSnaps || [];
              const rawSnapUrl = snaps.length ? (snaps[0]?.snapUrls?.mediaUrl?.value || snaps[0]?.snapUrls?.mediaUrl) : '';
              const rawSpotUrl = spotlight?.mediaUrl?.value || spotlight?.mediaUrl || '';
              if (typeof rawSnapUrl === 'string' && rawSnapUrl) {
                directMediaUrl = rawSnapUrl;
                const rawPreview = snaps[0]?.snapUrls?.mediaPreviewUrl?.value || snaps[0]?.snapUrls?.mediaPreviewUrl || '';
                thumb = typeof rawPreview === 'string' ? rawPreview : '';
              } else if (typeof rawSpotUrl === 'string' && rawSpotUrl) {
                directMediaUrl = rawSpotUrl;
              }
              if (pp.userProfile?.userInfo?.displayName) {
                title = `Snapchat - ${pp.userProfile.userInfo.displayName}`;
              }
            } catch (_) {}
          }

          // 2. OpenGraph / JSON-LD / CDN extraction
          if (!directMediaUrl) {
            const mOg = html.match(/<meta[^>]+property=["'](?:og:video|og:video:url|og:video:secure_url)["'][^>]+content=["']([^"']+)["']/i) ||
                        html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["'](?:og:video|og:video:url|og:video:secure_url)["']/i);
            if (mOg && mOg[1]) directMediaUrl = mOg[1].replace(/&amp;/g, '&');
          }
          if (!directMediaUrl) {
            const mCdn = html.match(/https:\/\/(?:bolt-gcdn\.sc-cdn\.net|cf-st\.sc-cdn\.net)\/[^\s"'\\]+/i);
            if (mCdn && mCdn[0]) directMediaUrl = mCdn[0].replace(/\\u0026/g, '&').replace(/\\\//g, '/');
          }

          if (directMediaUrl) {
            return {
              ok: true,
              platform: 'Snapchat',
              platformId: 'snapchat',
              platformIcon: '👻',
              title,
              author: 'Snapchat',
              thumbnail: thumb,
              formats: [{ id: 'video', ext: 'mp4', url: directMediaUrl, directUrl: directMediaUrl }]
            };
          }
        }
      } catch (_) {}
    }

    if (plat.id === 'facebook') {
      try {
        const rFb = await httpFetch('https://fdown.co.in/ajax', {
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

      // Fallback Facebook OpenGraph
      try {
        const rOg = await httpFetch(cleanUrl, {
          headers: { 'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)' }
        });
        if (rOg.ok) {
          const html = await rOg.text();
          const m = html.match(/<meta[^>]+property=["'](?:og:video|og:video:url|og:video:secure_url)["'][^>]+content=["']([^"']+)["']/i);
          if (m && m[1]) {
            const directUrl = m[1].replace(/&amp;/g, '&');
            return {
              ok: true,
              platform: 'Facebook',
              platformId: 'facebook',
              platformIcon: '📘',
              title: 'Facebook Video',
              author: 'Facebook',
              thumbnail: '',
              formats: [{ id: 'video', ext: 'mp4', url: directUrl, directUrl }],
            };
          }
        }
      } catch (_) {}
    }

    if (plat.id === 'instagram') {
      if (/\/stories\//i.test(cleanUrl)) {
        try {
          const stRes = await resolveStoriesViaJs(cleanUrl, 'instagram');
          if (stRes?.ok && stRes.stories?.length) {
            const s = stRes.stories[0];
            return {
              ok: true,
              platform: 'Instagram',
              platformId: 'instagram',
              platformIcon: '📷',
              title: s.filename || 'Instagram_Story',
              author: 'Instagram',
              thumbnail: s.thumbnail || '',
              formats: [{ id: s.type || 'video', ext: s.ext || 'mp4', url: s.url, directUrl: s.url }],
            };
          }
        } catch (_) {}
        throw new Error(state.lang === 'ar'
          ? 'ستوري إنستجرام محمي بتسجيل الدخول؛ استخدم زر الإضافة من المتصفح أو رابط ريلز/منشور عام.'
          : 'Instagram Stories require a logged-in session; use the browser extension or a public Reel/Post link.');
      }
      try {
        const sc = cleanUrl.match(/\/(?:p|reel|reels|tv)\/([A-Za-z0-9_-]+)/);
        if (sc) {
          const rIg = await httpFetch(`https://www.instagram.com/p/${sc[1]}/embed/captioned/`);
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

      // Fallback via DDInstagram / InstaFix API
      try {
        const sc = cleanUrl.match(/\/(?:p|reel|tv)\/([A-Za-z0-9_-]+)/);
        if (sc) {
          const rDd = await httpFetch(`https://api.ddinstagram.com/v1/post/${sc[1]}`);
          if (rDd.ok) {
            const jDd = await rDd.json();
            const media = jDd?.item || jDd;
            const vUrl = media?.video_url || media?.videos?.[0]?.url || '';
            const iUrl = media?.image_url || media?.images?.[0]?.url || '';
            if (vUrl || iUrl) {
              return {
                ok: true,
                platform: 'Instagram',
                platformId: 'instagram',
                platformIcon: '📷',
                title: `Instagram_${sc[1]}`,
                author: media?.user?.username || 'Instagram',
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
          const r = await httpFetch(`https://api.fxtwitter.com/${m[1]}/status/${m[2]}`);
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
        const r = await httpFetch(cleanUrl.split('?')[0].replace(/\/$/, '') + '.json');
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

    // If the URL is from a social media platform and failed to extract a stream,
    // do NOT treat the web page HTML as an MP4! Throw a descriptive error.
    if (['youtube', 'tiktok', 'facebook', 'instagram', 'twitter', 'reddit', 'snapchat', 'pinterest'].includes(plat.id)) {
      throw new Error(t('streamExtractFailed') || 'Could not extract direct media stream (link may be private, restricted, or invalid)');
    }

    // Fallback direct file or OpenGraph stream
    let guessName = `${plat.name}_Media`;
    let detectedExt = 'mp4';
    try {
      const uObj = new URL(cleanUrl);
      const seg = decodeURIComponent(uObj.pathname.split('/').filter(Boolean).pop() || '');
      if (seg && seg.includes('.')) {
        guessName = seg;
        detectedExt = seg.split('.').pop().toLowerCase();
      }
    } catch (_) {}

    return {
      ok: true,
      platform: plat.name,
      platformId: plat.id,
      platformIcon: plat.icon,
      title: guessName,
      author: plat.name,
      thumbnail: '',
      formats: [{ id: 'direct', ext: detectedExt, url: cleanUrl, directUrl: cleanUrl }],
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
          setTimeout(() => switchTab('downloads'), 500);
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
      if (data.platformId === 'direct' && /\.(mp4|mp3|m4a|mkv|webm|avi|mov|apk|zip|rar|7z|tar|gz|pdf|doc|docx|xls|xlsx|ppt|pptx|txt|exe|dmg|iso)(\?.*)?$/i.test(raw)) {
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

      // Start downloading the resolved media immediately
      await triggerResolvedDownload(false);
    } catch (e) {
      if (analyzeLoader) analyzeLoader.hidden = true;
      showToast(e.message || t('dlFailToast'));
    }
  }

  async function triggerResolvedDownload(isAudio) {
    const raw = (urlInput?.value || '').trim();
    if (!raw) return;
    if (!state.currentResolved) {
      state.currentResolved = await resolveMediaUrl(raw);
    }
    const res = state.currentResolved;
    if (!res) return;
    const formats = res?.formats || [];
    let chosen = null;

    if (isAudio) {
      chosen = formats.find((f) => f.id === 'audio' || f.ext === 'mp3' || f.ext === 'm4a') || formats[0];
    } else {
      chosen = formats.find((f) => f.id !== 'audio') || formats[0];
    }

    const dlUrl = chosen?.directUrl || chosen?.url || raw;
    let ext = chosen?.ext;
    if (!ext) {
      ext = isAudio ? 'mp3' : 'mp4';
      try {
        const uObj = new URL(dlUrl);
        const match = uObj.pathname.match(/\.([a-zA-Z0-9]{2,5})$/);
        if (match) ext = match[1].toLowerCase();
      } catch (_) {}
    }

    let title = res?.title || 'Tayyar_File';
    let filename = '';
    if (title.includes('.')) {
      filename = sanitizeName(title, ext);
    } else {
      filename = sanitizeName(`${res?.platform || 'Tayyar'}_${title}`, ext);
    }

    await startDownload({
      url: dlUrl,
      filename,
      referer: chosen?.referer || '',
      userAgent: chosen?.userAgent || '',
      platformIcon: isAudio ? '🎵' : (res?.platformIcon || '🎬'),
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

  // Strict Stable-Default Update Checker + Pro Update Arrival Popup (Stable & Beta)
  const STORAGE_KEY_SKIPPED_VER = 'tayyar_skipped_update_ver';
  const cfgUpdateChannel = $('#cfgUpdateChannel');
  const betaChannelNote = $('#betaChannelNote');
  const updActionRow = $('#updActionRow');
  const btnCheckUpdate = $('#btnCheckUpdate');
  const btnDownloadUpdate = $('#btnDownloadUpdate');
  const updPopupOverlay = $('#updPopupOverlay');

  let downloadedUpdateApkPath = '';
  let updPollTimer = null;

  function semverCompare(a, b) {
    const pa = (a || '0').replace(/^v/, '').split('-')[0].split('.').map(Number);
    const pb = (b || '0').replace(/^v/, '').split('-')[0].split('.').map(Number);
    for (let i = 0; i < 3; i++) {
      if ((pa[i] || 0) > (pb[i] || 0)) return 1;
      if ((pa[i] || 0) < (pb[i] || 0)) return -1;
    }
    return 0;
  }

  function extractReleaseHighlights(bodyText) {
    const raw = String(bodyText || '');
    const lines = raw.split(/\r?\n/).map((l) => l.trim());
    const bullets = [];
    for (const l of lines) {
      if (/^[*•-]\s+/.test(l) && !/releases\/download/i.test(l) && !/^\*\*(Windows|Android|iOS|macOS|Linux)/i.test(l.replace(/^[*•-]\s+/, ''))) {
        const clean = l.replace(/^[*•-]\s+/, '').replace(/\*\*/g, '').replace(/`/g, '').trim();
        if (clean.length > 6) bullets.push(`• ${clean}`);
      }
      if (bullets.length >= 6) break;
    }
    if (bullets.length) return bullets.join('\n');
    return state.lang === 'ar'
      ? '• تحسينات جديدة في الأداء والاستقرار ومحرك التحميل.\n• تحديث مباشر وسريع بضغطة واحدة.'
      : '• Performance, stability & download engine improvements.\n• Fast 1-tap direct update.';
  }

  function getMobileReleaseAsset(rel) {
    const assets = rel?.assets || [];
    const isIos = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    return isIos
      ? assets.find((a) => a.name.endsWith('.ipa'))
      : assets.find((a) => a.name.endsWith('.apk'));
  }

  function setMobStepperStage(stage, pct = 0, statusText = '') {
    const sDl = $('#stepMobDl');
    const sCheck = $('#stepMobCheck');
    const sInstall = $('#stepMobInstall');
    const sReopen = $('#stepMobReopen');
    const c1 = $('#connMob1');
    const c2 = $('#connMob2');
    const c3 = $('#connMob3');
    const fill = $('#updPopProgFill');
    const stat = $('#updPopProgStatus');

    if (pct >= 0 && fill) fill.style.width = `${Math.min(100, Math.max(0, pct))}%`;
    if (statusText && stat) stat.textContent = statusText;

    [sDl, sCheck, sInstall, sReopen].forEach((el) => {
      if (el) el.classList.remove('active', 'completed');
    });
    [c1, c2, c3].forEach((el) => {
      if (el) el.classList.remove('active');
    });

    if (stage === 'download') {
      if (sDl) sDl.classList.add('active');
    } else if (stage === 'check') {
      if (sDl) sDl.classList.add('completed');
      if (c1) c1.classList.add('active');
      if (sCheck) sCheck.classList.add('active');
    } else if (stage === 'install') {
      if (sDl) sDl.classList.add('completed');
      if (sCheck) sCheck.classList.add('completed');
      if (c1) c1.classList.add('active');
      if (c2) c2.classList.add('active');
      if (sInstall) sInstall.classList.add('active');
    } else if (stage === 'reopen') {
      if (sDl) sDl.classList.add('completed');
      if (sCheck) sCheck.classList.add('completed');
      if (sInstall) sInstall.classList.add('completed');
      if (c1) c1.classList.add('active');
      if (c2) c2.classList.add('active');
      if (c3) c3.classList.add('active');
      if (sReopen) sReopen.classList.add('active');
    }
  }

  function showUpdatePopup(rel, isLatest = false) {
    if (!updPopupOverlay) return;
    const r = rel || { tag_name: 'v' + APP_VERSION, published_at: new Date() };
    const latest = (r.tag_name || APP_VERSION).replace(/^v/, '');
    const isBeta = !!r.prerelease || (cfgUpdateChannel?.value === 'beta' && /beta|alpha|rc/i.test(r.tag_name || ''));
    const isAr = state.lang === 'ar';

    const badge = $('#updPopChannelBadge');
    if (badge) {
      if (isLatest) {
        badge.textContent = isAr ? 'أنت على أحدث إصدار' : 'You are on the latest version';
      } else {
        badge.textContent = isBeta
          ? (isAr ? 'إصدار تجريبي جديد متوفر' : 'New Beta available')
          : (isAr ? 'إصدار جديد متوفر' : 'New version available');
      }
    }
    if ($('#updPopTitle')) {
      if (isLatest) {
        $('#updPopTitle').textContent = isAr ? `تطبيق طيار محدث بالكامل (${APP_VERSION})` : `Tayyar ${APP_VERSION} is Up to Date`;
      } else {
        $('#updPopTitle').textContent = isAr ? `طيار ${latest} متوفر الآن` : `Tayyar ${latest} is here`;
      }
    }
    if ($('#updPopOldVer')) $('#updPopOldVer').textContent = APP_VERSION;
    if ($('#updPopNewVer')) $('#updPopNewVer').textContent = isLatest ? APP_VERSION : latest;
    if ($('#updPopDate')) {
      const d = r.published_at ? new Date(r.published_at) : new Date();
      $('#updPopDate').textContent = d.toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }

    const btnNow = $('#btnUpdPopNow');
    const txtNow = $('#updPopNowText');
    if (isLatest) {
      setMobStepperStage('reopen', 100, isAr ? `تطبيق تيّار محدث لأحدث إصدار (v${APP_VERSION}). النظام جاهز للعمل بكامل الميزات.` : `Tayyar is up to date (v${APP_VERSION}). System ready.`);
      if (btnNow) btnNow.disabled = false;
      if (txtNow) txtNow.textContent = isAr ? 'إعادة الفحص والتحميل' : 'Re-check & Download';
    } else if (!downloadedUpdateApkPath) {
      setMobStepperStage('download', 0, isAr ? 'جاهز للتحميل والتثبيت المباشر' : 'Ready to download and install');
      if (btnNow) btnNow.disabled = false;
      if (txtNow) txtNow.textContent = isAr ? 'تحديث الآن' : 'Update Now';
    } else {
      setMobStepperStage('install', 100, isAr ? 'الحزمة جاهزة للتثبيت' : 'Package ready to install');
      if (btnNow) btnNow.disabled = false;
      if (txtNow) txtNow.textContent = isAr ? 'تثبيت الآن' : 'Install Now';
    }

    updPopupOverlay.style.display = 'flex';
    updPopupOverlay.removeAttribute('hidden');
    updPopupOverlay.hidden = false;
  }

  function hideUpdatePopup() {
    if (updPopupOverlay) {
      updPopupOverlay.style.display = 'none';
      updPopupOverlay.setAttribute('hidden', '');
      updPopupOverlay.hidden = true;
    }
  }

  async function runDirectMobileUpdate() {
    if (!state.updateRelease) {
      checkUpdates(true);
      return;
    }

    const native = getNativeEngine();
    const isAr = state.lang === 'ar';

    // If APK already downloaded on Android, launch installer immediately!
    if (downloadedUpdateApkPath && native && typeof native.installApk === 'function') {
      try {
        setMobStepperStage('install', 100, isAr ? 'جاري فتح مثبت الحزم...' : 'Opening Package Installer...');
        await native.installApk({ path: downloadedUpdateApkPath });
        return;
      } catch (e) {
        showToast(e.message || t('dlFailToast'));
      }
    }

    const asset = getMobileReleaseAsset(state.updateRelease);
    if (!asset?.browser_download_url) {
      if (state.updateRelease.html_url) window.open(state.updateRelease.html_url, '_blank');
      return;
    }

    const btnNow = $('#btnUpdPopNow');
    const txtNow = $('#updPopNowText');

    setMobStepperStage('download', 0, isAr ? 'بدء تحميل التحديث...' : 'Starting update download...');
    if (btnNow) btnNow.disabled = true;

    // Android Native Direct APK Download + Auto-Launch Package Installer!
    if (isAndroidNative() && native && typeof native.startDownload === 'function') {
      try {
        const res = await native.startDownload({
          url: asset.browser_download_url,
          filename: asset.name,
          forUpdate: true,
        });
        if (res && res.downloadId) {
          const dlId = String(res.downloadId);
          if (updPollTimer) clearInterval(updPollTimer);
          updPollTimer = setInterval(async () => {
            try {
              const q = await native.queryDownload({ downloadId: dlId });
              if (!q) return;
              const pctVal = q.percent || (q.total > 0 ? Math.min(99, Math.round((q.downloaded / q.total) * 100)) : 0);
              const statStr = isAr
                ? `جاري التحميل، ${fmtBytes(q.downloaded || 0)} من ${fmtBytes(q.total || 0)}`
                : `Downloading, ${fmtBytes(q.downloaded || 0)} of ${fmtBytes(q.total || 0)}`;
              setMobStepperStage('download', pctVal, statStr);

              if (q.status === 'completed') {
                clearInterval(updPollTimer);
                updPollTimer = null;
                downloadedUpdateApkPath = q.path || '';

                // Transition through Check -> Install -> Reopen
                setMobStepperStage('check', 100, isAr ? 'جاري التحقق من سلامة الحزمة...' : 'Verifying package integrity...');
                setTimeout(() => {
                  setMobStepperStage('install', 100, isAr ? 'جاري التثبيت...' : 'Installing update...');
                  if (btnNow) btnNow.disabled = false;
                  if (txtNow) txtNow.textContent = isAr ? 'إعادة التشغيل' : 'Restart Now';
                  if (downloadedUpdateApkPath && typeof native.installApk === 'function') {
                    native.installApk({ path: downloadedUpdateApkPath }).catch(() => {});
                  }
                  setTimeout(() => {
                    setMobStepperStage('reopen', 100, isAr ? 'إعادة تشغيل طيار...' : 'Reopening Tayyar...');
                  }, 1200);
                }, 700);
              } else if (q.status === 'error') {
                clearInterval(updPollTimer);
                updPollTimer = null;
                setMobStepperStage('download', 0, `${t('dlFailToast')}: ${q.error || ''}`);
                if (btnNow) btnNow.disabled = false;
              }
            } catch (_) {}
          }, 360);
          return;
        }
      } catch (e) {
        console.warn('Direct APK update fallback:', e);
      }
    }

    // iOS / Web fallback: download directly via startDownload
    hideUpdatePopup();
    startDownload({
      url: asset.browser_download_url,
      filename: asset.name,
      isAudio: false,
    });
    switchTab('downloads');
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
      let rel = null;

      // 1. Primary: GitHub Releases API
      const endpoints = ch === 'beta'
        ? ['https://api.github.com/repos/mumenmahbuobeh/tayyar/releases']
        : ['https://api.github.com/repos/mumenmahbuobeh/tayyar/releases', 'https://api.github.com/repos/mumenmahbuobeh/tayyar/releases/latest'];
      for (const url of endpoints) {
        try {
          const r = await httpFetch(url, { headers: { Accept: 'application/vnd.github.v3+json' } });
          if (r.ok) {
            const payload = await r.json();
            if (Array.isArray(payload)) {
              rel = payload.find((x) => !x.draft && (ch === 'beta' || !x.prerelease)) || null;
            } else if (payload && !payload.draft && (ch === 'beta' || !payload.prerelease)) {
              rel = payload;
            }
            if (rel?.tag_name) break;
          }
        } catch (_) {}
      }

      // 2. Fallback: jsDelivr CDN & Raw package.json (no GitHub API rate limit)
      if (!rel) {
        const fallbacks = [
          'https://cdn.jsdelivr.net/gh/mumenmahbuobeh/tayyar@main/package.json',
          'https://raw.githubusercontent.com/mumenmahbuobeh/tayyar/main/package.json'
        ];
        for (const fb of fallbacks) {
          try {
            const r = await httpFetch(fb);
            if (r.ok) {
              const pkg = await r.json();
              if (pkg?.version) {
                const ver = pkg.version;
                const tag = `v${ver}`;
                rel = {
                  tag_name: tag,
                  name: ver,
                  html_url: `https://github.com/mumenmahbuobeh/tayyar/releases/tag/${tag}`,
                  published_at: new Date().toISOString(),
                  assets: [
                    {
                      name: `Tayyar-Android-${tag}.apk`,
                      browser_download_url: `https://github.com/mumenmahbuobeh/tayyar/releases/download/${tag}/Tayyar-Android-${tag}.apk`
                    },
                    {
                      name: `Tayyar-iOS-${tag}.ipa`,
                      browser_download_url: `https://github.com/mumenmahbuobeh/tayyar/releases/download/${tag}/Tayyar-iOS-${tag}.ipa`
                    },
                    {
                      name: `Tayyar-Setup-${ver}.exe`,
                      browser_download_url: `https://github.com/mumenmahbuobeh/tayyar/releases/download/${tag}/Tayyar-Setup-${ver}.exe`
                    }
                  ]
                };
                break;
              }
            }
          } catch (_) {}
        }
      }

      if (!rel?.tag_name) throw new Error('No release metadata available');

      const latest = rel.tag_name.replace(/^v/, '');
      const isNewer = semverCompare(latest, APP_VERSION) > 0;
      state.hasNewerUpdate = isNewer;

      if (isNewer) {
        state.updateRelease = rel;
        $('#updStatusTitle').textContent = `${t('newVerAvailable')} v${latest}`;
        $('#updStatusDesc').textContent = `v${APP_VERSION} → v${latest}`;
        if (updActionRow) updActionRow.hidden = false;
        if (interactive) {
          toast(`${t('newVerAvailable')} v${latest}`);
        }
      } else {
        state.updateRelease = rel;
        downloadedUpdateApkPath = '';
        $('#updStatusTitle').textContent = t('upToDate');
        $('#updStatusDesc').textContent = t('upToDateDesc');
        if (updActionRow) updActionRow.hidden = true;
        if (interactive) {
          toast(t('upToDate'));
        }
      }
    } catch (_) {
      state.hasNewerUpdate = false;
      if (updActionRow) updActionRow.hidden = true;
      if (interactive) {
        toast(state.lang === 'ar' ? 'تعذّر فحص التحديثات حالياً' : 'Failed to check updates');
      }
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
    if (state.hasNewerUpdate && state.updateRelease) {
      runDirectMobileUpdate();
    }
  });

  $('#btnUpdPopNow')?.addEventListener('click', runDirectMobileUpdate);
  $('#btnUpdPopClose')?.addEventListener('click', hideUpdatePopup);
  $('#btnUpdPopLater')?.addEventListener('click', hideUpdatePopup);
  $('#btnUpdPopSkip')?.addEventListener('click', () => {
    const latest = (state.updateRelease?.tag_name || '').replace(/^v/, '');
    if (latest) {
      try { localStorage.setItem(STORAGE_KEY_SKIPPED_VER, latest); } catch (_) {}
      showToast(`${t('updSkippedToast')} v${latest}`);
    }
    hideUpdatePopup();
  });
  updPopupOverlay?.addEventListener('click', (e) => {
    if (e.target === updPopupOverlay) hideUpdatePopup();
  });

  /* ==================== UNIVERSAL STORIES & STATUS SAVER (WA / SNAP / IG / FB) ==================== */
  const STORY_DL_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>';
  const STORY_PLAY_SVG = '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4"/></svg>';
  const STORY_IMG_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>';
  const STORY_CHK_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';

  function getFilteredItems(list, typeFilter) {
    if (typeFilter === 'video') return list.filter((it) => it.type === 'video');
    if (typeFilter === 'image') return list.filter((it) => it.type !== 'video');
    return list;
  }

  function applySelectionCount(list, typeFilter, selectedSet, count) {
    const visible = getFilteredItems(list, typeFilter);
    const n = Math.max(0, Math.min(visible.length, Number(count) || 0));
    selectedSet.clear();
    for (let i = 0; i < n; i++) {
      selectedSet.add(visible[i]._uid);
    }
  }

  function syncSelectorControls({ list, typeFilter, selectedSet, barEl, badgeEl, inputEl, rangeEl, dlBtnEl, dlTextEl }) {
    const visible = getFilteredItems(list, typeFilter);
    const total = visible.length;
    if (barEl) barEl.hidden = list.length === 0;
    if (list.length === 0) return;

    const selCount = visible.filter((it) => selectedSet.has(it._uid)).length;
    if (badgeEl) badgeEl.textContent = `${selCount} / ${total}`;
    if (inputEl) {
      inputEl.max = String(total);
      inputEl.value = String(selCount);
    }
    if (rangeEl) {
      rangeEl.max = String(Math.max(1, total));
      rangeEl.value = String(selCount);
    }
    if (dlBtnEl) dlBtnEl.disabled = selCount === 0;
    if (dlTextEl) dlTextEl.textContent = `${t('downloadSelectedBtn')} (${selCount} / ${total})`;
  }

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

  async function saveSingleWhatsAppStatus(entry, silent = false) {
    const eng = getNativeEngine();
    if (!entry || !eng || typeof eng.saveWhatsAppStatus !== 'function') return false;
    try {
      const res = await eng.saveWhatsAppStatus({
        uri: entry.uri || '',
        path: entry.path || '',
        name: entry.name || `Status_${Date.now()}.${entry.type === 'video' ? 'mp4' : 'jpg'}`,
      });
      if (res && res.ok) {
        entry._saved = true;
        state.downloads.unshift({
          id: `wa_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
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
        if (!silent) {
          renderAllViews();
          showToast(t('storySavedToast'));
        }
        return true;
      }
    } catch (err) {
      if (!silent) showToast(`${t('dlFailToast')}: ${err.message || ''}`);
    }
    return false;
  }

  function renderWhatsAppStatusesGrid() {
    const grid = $('#waStatusGrid');
    const bar = $('#waSelectorBar');
    if (!grid) return;

    const native = getNativeEngine();
    const canNativeWa = isAndroidNative() && native && typeof native.listWhatsAppStatuses === 'function';

    const waToolbar = $('.wa-toolbar');
    if (waToolbar) waToolbar.hidden = !canNativeWa;

    if (!canNativeWa) {
      if (bar) bar.hidden = true;
      grid.innerHTML = `
        <div class="story-empty-card">
          <div class="story-empty-title">${t('waIosTitle')}</div>
          <div class="story-empty-desc">${t('waIosDesc')}</div>
        </div>
      `;
      return;
    }

    if (state.waNeedsSaf && state.waStatuses.length === 0) {
      if (bar) bar.hidden = true;
      grid.innerHTML = `
        <div class="story-empty-card">
          <div class="story-empty-title">${t('waNeedPermTitle')}</div>
          <div class="story-empty-desc">${t('waNeedPermDesc')}</div>
        </div>
      `;
      return;
    }

    if (state.waStatuses.length === 0) {
      if (bar) bar.hidden = true;
      grid.innerHTML = `
        <div class="story-empty-card">
          <div class="story-empty-title">${t('waEmptyTitle')}</div>
          <div class="story-empty-desc">${t('waEmptyDesc')}</div>
        </div>
      `;
      return;
    }

    syncSelectorControls({
      list: state.waStatuses,
      typeFilter: state.waFilter,
      selectedSet: state.waSelected,
      barEl: bar,
      badgeEl: $('#waSelectedBadge'),
      inputEl: $('#waCountInput'),
      rangeEl: $('#waCountRange'),
      dlBtnEl: $('#btnWaDownloadSelected'),
      dlTextEl: $('#waDlSelectedText'),
    });

    const visible = getFilteredItems(state.waStatuses, state.waFilter);
    grid.innerHTML = visible.map((item, idx) => {
      const isSel = state.waSelected.has(item._uid);
      return `
        <div class="story-tile ${isSel ? 'selected' : ''}" data-wa-uid="${escapeHtml(item._uid)}">
          ${item.thumbnail
            ? `<img class="story-tile-img" src="${item.thumbnail}" alt="" />`
            : `<div class="story-tile-fallback">${item.type === 'video' ? STORY_PLAY_SVG : STORY_IMG_SVG}</div>`}
          <span class="story-type-pill">#${idx + 1} • ${item.type === 'video' ? 'MP4' : 'IMG'}</span>
          <span class="story-check-circle">${STORY_CHK_SVG}</span>
          <button type="button" class="story-save-btn" data-wa-save="${escapeHtml(item._uid)}">
            ${STORY_DL_SVG}
            <span>${item._saved ? t('savedBtn') : t('saveBtn')}</span>
          </button>
        </div>
      `;
    }).join('');

    $$('.story-tile[data-wa-uid]', grid).forEach((tile) => {
      tile.addEventListener('click', (e) => {
        if (e.target.closest('.story-save-btn')) return;
        const uid = tile.dataset.waUid;
        if (state.waSelected.has(uid)) state.waSelected.delete(uid);
        else state.waSelected.add(uid);
        renderWhatsAppStatusesGrid();
      });
    });

    $$('.story-save-btn[data-wa-save]', grid).forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const entry = state.waStatuses.find((x) => x._uid === btn.dataset.waSave);
        await saveSingleWhatsAppStatus(entry, false);
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
      const items = Array.isArray(res?.items) ? res.items : [];
      state.waStatuses = items.map((it, i) => ({ ...it, _uid: it.id || `wa_${i}` }));
      state.waNeedsSaf = !!res?.needsSaf;
      // Pre-select all loaded statuses by default so user can dial down or pick exact count immediately
      applySelectionCount(state.waStatuses, state.waFilter, state.waSelected, state.waStatuses.length);
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
    if (/snapchat\.com|t\.snapchat\.com/i.test(clean)) plat = 'snapchat';
    else if (/instagram\.com/i.test(clean)) plat = 'instagram';
    else if (/facebook\.com|fb\.watch/i.test(clean)) plat = 'facebook';
    const stories = [];
    const seen = new Set();

    // 1. Direct Reels / Posts / Videos pasted into Story Hub
    if (plat === 'instagram' && /(?:instagram\.com\/(?:p|reel|reels|tv|share|s)\/)/i.test(clean)) {
      try {
        const res = await resolveMediaUrl(clean);
        const fmt = res?.formats?.find((f) => f.id !== 'audio' && (f.directUrl || f.url)) || res?.formats?.[0];
        const vidUrl = fmt?.directUrl || fmt?.url || '';
        if (vidUrl && vidUrl !== clean) {
          return {
            ok: true,
            stories: [{
              id: 'ig_direct',
              type: 'video',
              url: vidUrl,
              thumbnail: res.thumbnail || '',
              ext: 'mp4',
              filename: sanitizeName(`Instagram_${res.title || 'media'}`, 'mp4'),
            }]
          };
        }
      } catch (_) {}
    }

    if (plat === 'facebook' && /(?:facebook\.com\/(?:watch|reel|videos|share)|fb\.watch\/)/i.test(clean)) {
      try {
        const res = await resolveMediaUrl(clean);
        const fmt = res?.formats?.find((f) => f.id !== 'audio' && (f.directUrl || f.url)) || res?.formats?.[0];
        const vidUrl = fmt?.directUrl || fmt?.url || '';
        if (vidUrl && vidUrl !== clean) {
          return {
            ok: true,
            stories: [{
              id: 'fb_direct',
              type: 'video',
              url: vidUrl,
              thumbnail: res.thumbnail || '',
              ext: 'mp4',
              filename: sanitizeName(`Facebook_${res.title || 'media'}`, 'mp4'),
            }]
          };
        }
      } catch (_) {}
    }

    if (plat === 'snapchat') {
      let user = clean.replace(/^@/, '').split(/[/?#]/)[0];
      const uMatch = clean.match(/snapchat\.com\/(?:@|add\/|s\/|story\/|spotlight\/)([a-zA-Z0-9._-]+)/i);
      if (uMatch && !/^(?:t|spotlight|add|story|s)$/i.test(uMatch[1])) user = uMatch[1];
      const urls = /^https?:\/\//i.test(clean)
        ? [clean, ...(user && !clean.includes('/@') ? [`https://www.snapchat.com/@${encodeURIComponent(user)}`] : [])]
        : [
            `https://www.snapchat.com/@${encodeURIComponent(user)}`,
            `https://www.snapchat.com/add/${encodeURIComponent(user)}`,
            `https://story.snapchat.com/s/${encodeURIComponent(user)}`,
          ];
      for (const u of urls) {
        try {
          const r = await httpFetch(u);
          if (!r.ok) continue;
          const html = await r.text();
          const m = html.match(/<script[^>]+id=["']__NEXT_DATA__["'][^>]*>([\s\S]*?)<\/script>/i);
          if (m && m[1]) {
            try {
              const j = JSON.parse(m[1]);
              const pp = j?.props?.pageProps || {};
              const prof = pp.userProfile?.publicProfileInfo || pp.userProfile?.userInfo || {};
              const uname = prof.username || user || 'snapchat';
              const avatar = prof.profilePictureUrl || prof.squareHeroImageUrl || '';
              const addList = (arr, prefix) => {
                if (!Array.isArray(arr)) return;
                arr.forEach((snap, idx) => {
                  const rawMUrl = snap?.snapUrls?.mediaUrl?.value || snap?.snapUrls?.mediaUrl || snap?.mediaUrl?.value || snap?.mediaUrl || '';
                  const mUrl = typeof rawMUrl === 'string' ? rawMUrl : '';
                  if (!mUrl || seen.has(mUrl)) return;
                  seen.add(mUrl);
                  const isVid = snap?.snapMediaType === 1 || /\.mp4/i.test(mUrl) || mUrl.includes('SpotlightSharing');
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
              addList(prof.snapList, 'prof');
              (pp.curatedHighlights || []).forEach((h, i) => addList(h?.snapList, `hl${i + 1}`));
              (pp.spotlightHighlights || []).forEach((h, i) => addList(h?.snapList, `spot${i + 1}`));
              if (stories.length > 0) return { ok: true, stories };
            } catch (_) {}
          }
          // Fallback 1: OpenGraph video
          const ogV = html.match(/<meta[^>]+property=["']og:video(?::secure_url|:url)?["'][^>]+content=["']([^"']+)["']/i);
          const ogI = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
          if (ogV && ogV[1]) {
            const vUrl = ogV[1].replace(/&amp;/g, '&');
            return {
              ok: true,
              stories: [{
                id: 'snap_og',
                type: 'video',
                url: vUrl,
                thumbnail: (ogI && !ogI[1].includes('default-preview')) ? ogI[1].replace(/&amp;/g, '&') : '',
                ext: 'mp4',
                filename: sanitizeName(`Snapchat_${user || 'story'}_1`, 'mp4'),
              }]
            };
          }
          // Fallback 2: Direct sc-cdn.net media links
          const cdnMatches = [...html.matchAll(/https:\/\/(?:bolt-gcdn|cf-st)\.sc-cdn\.net\/[^\s"'\\]+/g)];
          for (const cm of cdnMatches) {
            const mUrl = cm[0].replace(/&amp;/g, '&').replace(/\\\//g, '/');
            if (!seen.has(mUrl) && !mUrl.includes('.vtt') && !mUrl.includes('.webp') && !mUrl.includes('preview') && !mUrl.includes('logo') && !mUrl.includes('icon') && !mUrl.includes('.27.') && !mUrl.includes('.256.')) {
              seen.add(mUrl);
              const isVid = mUrl.includes('.mp4') || mUrl.includes('SpotlightSharing') || mUrl.includes('DfMedia');
              const ext = isVid ? 'mp4' : 'jpg';
              stories.push({
                id: `snap_cdn_${stories.length + 1}`,
                type: isVid ? 'video' : 'image',
                url: mUrl,
                thumbnail: isVid ? '' : mUrl,
                ext,
                filename: sanitizeName(`Snapchat_${user || 'story'}_${stories.length + 1}`, ext),
              });
            }
          }
          if (stories.length > 0) return { ok: true, stories };
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
      const r = await httpFetch(targetUrl);
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

    syncSelectorControls({
      list: state.socialStories,
      typeFilter: state.socialFilter,
      selectedSet: state.socialSelected,
      barEl: resBar,
      badgeEl: $('#storyCountLbl'),
      inputEl: $('#socialCountInput'),
      rangeEl: $('#socialCountRange'),
      dlBtnEl: $('#btnSaveAllStories'),
      dlTextEl: $('#socialDlSelectedText'),
    });

    const visible = getFilteredItems(state.socialStories, state.socialFilter);
    grid.innerHTML = visible.map((st, idx) => {
      const isSel = state.socialSelected.has(st._uid);
      return `
        <div class="story-tile ${isSel ? 'selected' : ''}" data-story-uid="${escapeHtml(st._uid)}">
          ${st.thumbnail
            ? `<img class="story-tile-img" src="${escapeHtml(st.thumbnail)}" alt="" />`
            : `<div class="story-tile-fallback">${st.type === 'video' ? STORY_PLAY_SVG : STORY_IMG_SVG}</div>`}
          <span class="story-type-pill">#${idx + 1} • ${st.type === 'video' ? 'MP4' : 'JPG'}</span>
          <span class="story-check-circle">${STORY_CHK_SVG}</span>
          <button type="button" class="story-save-btn" data-story-save="${escapeHtml(st._uid)}">
            ${STORY_DL_SVG}
            <span>${t('saveBtn')}</span>
          </button>
        </div>
      `;
    }).join('');

    $$('.story-tile[data-story-uid]', grid).forEach((tile) => {
      tile.addEventListener('click', (e) => {
        if (e.target.closest('.story-save-btn')) return;
        const uid = tile.dataset.storyUid;
        if (state.socialSelected.has(uid)) state.socialSelected.delete(uid);
        else state.socialSelected.add(uid);
        renderSocialStoriesGrid('ok');
      });
    });

    $$('.story-save-btn[data-story-save]', grid).forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const st = state.socialStories.find((x) => x._uid === btn.dataset.storySave);
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
    state.socialSelected.clear();
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
    const rawList = Array.isArray(result?.stories) ? result.stories : [];
    state.socialStories = rawList.map((st, i) => ({ ...st, _uid: st.id || `st_${i}` }));
    state.socialFilter = 'all';
    $$('#socialTypeFilter .ssb-chip').forEach((c) => c.classList.toggle('active', c.dataset.stype === 'all'));
    applySelectionCount(state.socialStories, state.socialFilter, state.socialSelected, state.socialStories.length);
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

  // WhatsApp Selector Controls (Filter, Stepper, Slider, Presets, Batch Save)
  $$('#waTypeFilter .ssb-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      state.waFilter = chip.dataset.stype;
      $$('#waTypeFilter .ssb-chip').forEach((c) => c.classList.toggle('active', c === chip));
      const vis = getFilteredItems(state.waStatuses, state.waFilter);
      applySelectionCount(state.waStatuses, state.waFilter, state.waSelected, vis.length);
      renderWhatsAppStatusesGrid();
    });
  });

  const setWaCount = (n) => {
    applySelectionCount(state.waStatuses, state.waFilter, state.waSelected, n);
    renderWhatsAppStatusesGrid();
  };
  $('#btnWaCountDec')?.addEventListener('click', () => setWaCount((Number($('#waCountInput')?.value) || 0) - 1));
  $('#btnWaCountInc')?.addEventListener('click', () => setWaCount((Number($('#waCountInput')?.value) || 0) + 1));
  $('#waCountInput')?.addEventListener('input', (e) => setWaCount(e.target.value));
  $('#waCountRange')?.addEventListener('input', (e) => setWaCount(e.target.value));
  $$('#waPresets .ssb-preset').forEach((btn) => {
    btn.addEventListener('click', () => {
      const p = btn.dataset.preset;
      const vis = getFilteredItems(state.waStatuses, state.waFilter);
      if (p === 'all') setWaCount(vis.length);
      else if (p === 'none') setWaCount(0);
      else setWaCount(Number(p));
    });
  });

  $('#btnWaDownloadSelected')?.addEventListener('click', async () => {
    const visible = getFilteredItems(state.waStatuses, state.waFilter);
    const chosen = visible.filter((it) => state.waSelected.has(it._uid));
    if (!chosen.length) {
      showToast(t('selectAtLeastOne'));
      return;
    }
    let savedOk = 0;
    for (const entry of chosen) {
      const ok = await saveSingleWhatsAppStatus(entry, true);
      if (ok) savedOk++;
    }
    renderAllViews();
    showToast(`${t('batchSavedToast')} ${savedOk}`);
  });

  // Social Stories Selector Controls (Filter, Stepper, Slider, Presets, Batch Download)
  $$('#socialTypeFilter .ssb-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      state.socialFilter = chip.dataset.stype;
      $$('#socialTypeFilter .ssb-chip').forEach((c) => c.classList.toggle('active', c === chip));
      const vis = getFilteredItems(state.socialStories, state.socialFilter);
      applySelectionCount(state.socialStories, state.socialFilter, state.socialSelected, vis.length);
      renderSocialStoriesGrid('ok');
    });
  });

  const setSocialCount = (n) => {
    applySelectionCount(state.socialStories, state.socialFilter, state.socialSelected, n);
    renderSocialStoriesGrid('ok');
  };
  $('#btnSocialCountDec')?.addEventListener('click', () => setSocialCount((Number($('#socialCountInput')?.value) || 0) - 1));
  $('#btnSocialCountInc')?.addEventListener('click', () => setSocialCount((Number($('#socialCountInput')?.value) || 0) + 1));
  $('#socialCountInput')?.addEventListener('input', (e) => setSocialCount(e.target.value));
  $('#socialCountRange')?.addEventListener('input', (e) => setSocialCount(e.target.value));
  $$('#socialPresets .ssb-preset').forEach((btn) => {
    btn.addEventListener('click', () => {
      const p = btn.dataset.preset;
      const vis = getFilteredItems(state.socialStories, state.socialFilter);
      if (p === 'all') setSocialCount(vis.length);
      else if (p === 'none') setSocialCount(0);
      else setSocialCount(Number(p));
    });
  });

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
    const visible = getFilteredItems(state.socialStories, state.socialFilter);
    const chosen = visible.filter((st) => state.socialSelected.has(st._uid) && st.url);
    if (!chosen.length) {
      showToast(t('selectAtLeastOne'));
      return;
    }
    showToast(`${t('batchStartedToast')} ${chosen.length}`);
    chosen.forEach((st, idx) => {
      setTimeout(() => {
        startDownload({
          url: st.url,
          filename: st.filename || sanitizeName(`Story_${Date.now()}_${idx + 1}`, st.ext || 'mp4'),
          isAudio: false,
        });
      }, idx * 240);
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

    // Automatic background update check (pops up sleek Update Arrival Popup only when newer release exists!)
    setTimeout(() => checkUpdates(false), 2200);
  }

  init();
})();
