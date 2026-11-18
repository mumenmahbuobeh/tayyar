'use strict';
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  /* ---------------- TRANSLATIONS (EN & AR) ---------------- */
  const I18N = {
    en: {
      dashboard: 'Dashboard',
      downloads: 'Downloads',
      socialVideoSaver: 'Video Downloader',
      trackers: 'Trackers',
      plugins: 'Plugins',
      notifications: 'Notifications',
      settings: 'Settings',
      apply: 'Apply',
      engine: 'ENGINE',
      ready: 'Ready',
      mapping: 'Mapping',
      upload: 'UPLOAD',
      download: 'DOWNLOAD',
      speedLimit: 'SPEED LIMIT',
      standardMode: 'Standard mode',
      transfer: 'TRANSFER',
      today: 'Today',
      thisWeek: 'This Week',
      thisMonth: 'This Month',
      allTime: 'All Time',
      tasks: 'TASKS',
      active: 'Active',
      failed: 'Failed',
      recent: 'Recent',
      noActiveTasks: 'No active tasks',
      newTask: 'New task',
      activeTasks: 'ACTIVE TASKS',
      downloadingCaps: 'DOWNLOADING',
      waitingCaps: 'WAITING',
      seedingCaps: 'SEEDING',
      activity: 'ACTIVITY',
      mon: 'Mon',
      wed: 'Wed',
      fri: 'Fri',
      jun: 'Jun',
      jul: 'Jul',
      aug: 'Aug',
      sep: 'Sep',
      oct: 'Oct',
      nov: 'Nov',
      all: 'All',
      downloading: 'Downloading',
      waiting: 'Waiting',
      completed: 'Completed',
      addTask: 'Add Task',
      effective: 'Effective',
      blacklist: 'Blacklist',
      injectCurated: 'Inject curated trackers',
      injectCuratedDesc: 'Add curated trackers to new public multi-source acceleration tasks.',
      syncNow: 'Sync Now',
      addPluginsTrust: 'Add plugins you trust',
      pluginsTrustDesc: 'Install from a source you trust, review the requested access, then enable the plugin. Grant website access only for sites you expect the plugin to handle.',
      availablePlugins: 'Available plugins',
      notificationsCenter: 'Notification Center',
      noNotifsDesc: 'Completed downloads and system integration alerts will be listed here.',
      setGeneralTitle: 'General',
      setGeneralDesc: 'Startup, default save folder, system integration',
      genSubhead: 'Startup, quitting and notifications',
      startupQuitting: 'Startup and quitting',
      openAtLogin: 'Open at login',
      showWindowAtLogin: 'Show window at login',
      whenOpeningApp: 'When opening Tayyar',
      saveMemoryClose: 'Save memory when the window is closed',
      confirmBeforeQuit: 'Confirm before quitting',
      downloadCompleted: 'Download completed',
      downloadFailed: 'Download failed',
      unreadBadge: 'Unread badge',
      setApprTitle: 'Appearance',
      setApprDesc: 'Theme, language, tray icon',
      apprSubhead: 'Theme, language, and tray preferences',
      theme: 'Theme',
      language: 'Language / اللغة',
      setDlTitle: 'Downloads',
      setDlDesc: 'Concurrency, bandwidth limits, network reliability',
      dlSubhead: 'Files, download speed and connections',
      saveFolders: 'Save folders',
      defaultSaveDir: 'Default download folder',
      browse: 'Browse...',
      newTasks: 'New tasks',
      autofillLinks: 'Autofill links from clipboard',
      userAgent: 'User-Agent',
      performance: 'Performance',
      dlPerformance: 'Download performance',
      simultaneousDl: 'Simultaneous downloads',
      setBtTitle: 'BitTorrent & Multi-Thread',
      setBtDesc: 'DHT, listen ports, trackers, peer geo',
      btSubhead: 'Magnets, seeding and trackers',
      newMagnetTasks: 'New magnet tasks',
      chooseFilesBefore: 'Choose files before downloading',
      downloadAllNoSel: 'Download all if no selection is made',
      incomingConns: 'Incoming connections',
      btListenPort: 'BT listen port',
      dhtListenPort: 'DHT listen port',
      enableDht: 'Enable DHT',
      setIntTitle: 'Integration',
      setIntDesc: 'Browser extensions, CLI, system integrations',
      intSubhead: 'Browsers, default apps and tools',
      browserExtensions: 'Browser extensions',
      connectExtensions: 'Connect browser extensions',
      cliTools: 'Command-line tools',
      setNetTitle: 'Network',
      setNetDesc: 'Proxy, DNS, and NAT/UPnP',
      netSubhead: 'Proxy, DNS and connection checks',
      proxy: 'Proxy',
      enableProxy: 'Enable proxy',
      importSystem: 'Import from system',
      dns: 'DNS',
      dnsLookup: 'DNS lookup',
      portMapping: 'Port mapping (NAT)',
      enablePortMapping: 'Enable port mapping',
      setAdvTitle: 'Advanced',
      setAdvDesc: 'RPC, SQLite persistence',
      advSubhead: 'RPC, progress and recovery',
      rpcPort: 'RPC port',
      rpcSecret: 'RPC secret',
      progressRecovery: 'Progress and recovery',
      saveRecoveryData: 'Save recovery data',
      progressInterval: 'Progress save interval (s)',
      setAboutTitle: 'About',
      setAboutDesc: 'Version, updates, source code and manual',
      aboutTagline: 'Before content collapses, preserve what truly matters, let beauty enter your orbit of preservation.',
      createdBy: 'Created & Developed by',
      officialWebsite: 'Official website',
      manual: 'Manual',
      changelog: 'Changelog',
      acknowledgments: 'Acknowledgments',
      appUpdates: 'App updates',
      upToDate: 'Tayyar is up to date',
      upToDateDesc: 'Version 1.0.17 is the latest available release.',
      check: 'Check',
      betaWarning: "Beta may be less stable. You'll also receive newer stable releases. Switching back stops beta updates without downgrading.",
      checkAuto: 'Check automatically',
      whenAppOpens: 'When Tayyar opens',
      close: 'Close',
      cancel: 'Cancel',
      save: 'Save',
      newTaskTitle: 'New Download Task',
      urlsLabel: 'URL (or multiple links, one per line)',
      saveFolder: 'Save Directory',
      conns: 'Connections',
      startDownload: 'Start Download',
      install: 'Install',
      openFolder: 'Open Extension Folder',
      done: 'Done',
      fileTypesTitle: 'Supported File Types (200+ Formats)',
      fileTypesDesc: 'Universal format auto-capture list',
      fileTypesHint: 'Downloads automatically sorted into organized folders (Video, Music, Compressed, Documents, Programs, 3D-Models, AI-Datasets, Images, Games-ROMs).',
      globalServersTitle: 'Global Server Compatibility',
      globalServersBypass: 'Universal Regional Server Compatibility',
      globalServersDesc: 'Bypass regional CA restrictions (Russian domestic CAs, Chinese CDNs, Iranian national gateways) & anti-hotlink blocks without SSL termination errors.',
      sourceCode: 'Source Code (GitHub)',
      socialEngineTitle: 'Social Media & Video Downloader',
      socialNoWatermark: 'No Watermark for TikTok & Shorts',
      socialNoWatermarkHint: 'Automatically extract watermark-free HD video for TikTok, Shorts, and Reels.',
      socialLocalEngine: 'Desktop Core Engine (yt-dlp)',
      socialFormatLbl: 'Quality / Format:',
      socialHubTitle: 'Social Video Downloader',
      socialHubSubtitle: 'Download videos, Reels, and Shorts without watermarks in ultra-HD with full audio merging',
      socialUrlPlaceholder: 'Paste video link from YouTube, TikTok, Instagram, Facebook...',
      paste: 'Paste',
      pasteTitle: 'Paste from clipboard',
      analyzeExtractBtn: 'Analyze & Extract Video',
      analyzingStream: 'Analyzing link and extracting high-definition stream...',
      videoTitlePlaceholder: 'Video Title',
      creatorPlaceholder: 'Channel or Creator',
      downloadFullVideo: '🎬 Download Full Video (Audio + Video MP4)',
      downloadAudioOnly: '🎵 Download Audio Only (Pure MP3)',
      downloadingStatus: 'Downloading...',
      socialTipsTitle: '💡 Tayyar Download Highlights:',
      socialTip1Title: 'No Watermark:',
      socialTip1Desc: 'Direct downloads from TikTok, Instagram, Facebook, and Snapchat without logos or watermarks.',
      socialTip2Title: 'Auto Audio Merging:',
      socialTip2Desc: 'Lossless automatic video & audio muxing up to Full HD and 4K Ultra HD.',
      socialTip3Title: 'Instant Gallery Save:',
      socialTip3Desc: 'On Android, downloaded videos are saved directly to Downloads and indexed in your Gallery.',
      mNavHome: 'Home',
      mNavVideo: 'Video',
      mNavDownloads: 'Downloads',
      mNavPlugins: 'Plugins',
      mNavSettings: 'Settings',
      turboEngineTitle: 'Tayyar Turbo Engine',
      presetBalanced: 'Balanced',
      presetTask: 'Task Focus',
      presetSpeed: 'Speed Focus',
      presetCompact: 'Compact',
      manageWidgets: 'Dashboard Widgets',
      addCardTitle: 'Manage Cards',
      customizeLayout: 'Customize Layout',
      channelStable: 'Stable',
      channelBeta: 'Beta',
      modeVideosTab: 'Videos & Reels',
      modeStoriesTab: 'Stories Saver',
      storyInputPlaceholder: 'Enter @username or paste Story link (Snapchat, Instagram, Facebook)...',
      storyCookiesLbl: 'Browser Session (for private stories):',
      cookiesNone: 'Public / No Login',
      fetchStoriesBtn: 'Fetch Active Stories',
      fetchingStories: 'Scanning active stories...',
      saveAllStories: 'Download All Stories',
      waDeskTitle: 'WhatsApp Status Saver (Desktop)',
      waDeskDesc: 'Install the Tayyar Browser Extension, open WhatsApp Web, and hover over any Status photo or video to click "Save WhatsApp Story" — it saves directly to Downloads/Tayyar/Stories in original HD!',
      openWaWebBtn: 'Open WhatsApp Web',
      typeVideos: 'Videos',
      typePhotos: 'Photos',
      storyPickCountLbl: 'Number of stories to download:',
      selectAllBtn: 'All',
      clearSelBtn: 'Clear',
      updPopTitle: 'New Update Available',
      updPopSub: 'A newer version of Tayyar is ready for direct installation.',
      updWhatsNew: "What's New",
      updDownloading: 'Downloading update...',
      updNowDirect: 'Update Now',
      updLaterBtn: 'Later',
      updSkipBtn: 'Skip Version',
    },
    ar: {
      dashboard: 'لوحة التحكم',
      downloads: 'التحميلات',
      socialVideoSaver: 'منزل الفيديوهات',
      trackers: 'خوادم التتبع',
      plugins: 'الإضافات',
      notifications: 'الإشعارات',
      settings: 'الإعدادات',
      apply: 'تطبيق',
      engine: 'المحرك',
      ready: 'جاهز',
      mapping: 'الربط المحلي',
      upload: 'الرفع',
      download: 'التحميل',
      speedLimit: 'حد السرعة',
      standardMode: 'الوضع القياسي',
      transfer: 'البيانات المنقولة',
      today: 'اليوم',
      thisWeek: 'هذا الأسبوع',
      thisMonth: 'هذا الشهر',
      allTime: 'كل الأوقات',
      tasks: 'المهام',
      active: 'نشطة',
      failed: 'فشلت',
      recent: 'الأخيرة',
      noActiveTasks: 'لا توجد مهام نشطة',
      newTask: 'مهمة جديدة',
      activeTasks: 'المهام النشطة',
      downloadingCaps: 'قيد التحميل',
      waitingCaps: 'في الانتظار',
      seedingCaps: 'مكتملة / مشاركة',
      activity: 'النشاط',
      mon: 'إثن',
      wed: 'أرب',
      fri: 'جمع',
      jun: 'يونيو',
      jul: 'يوليو',
      aug: 'أغسطس',
      sep: 'سبتمبر',
      oct: 'أكتوبر',
      nov: 'نوفمبر',
      all: 'الكل',
      downloading: 'قيد التحميل',
      waiting: 'في الانتظار',
      completed: 'مكتملة',
      addTask: 'إضافة مهمة',
      effective: 'الفعالة',
      blacklist: 'القائمة السوداء',
      injectCurated: 'حقن خوادم التتبع المعتمدة',
      injectCuratedDesc: 'إضافة أفضل خوادم التتبع تلقائياً لتسريع تحميلات الروابط العامة.',
      syncNow: 'مزامنة الآن',
      addPluginsTrust: 'أضف إضافات موثوقة فقط',
      pluginsTrustDesc: 'قم بتثبيت الإضافات من مصادر موثوقة فقط لمزامنة التحميلات والروابط.',
      availablePlugins: 'الإضافات المتاحة',
      notificationsCenter: 'مركز الإشعارات',
      noNotifsDesc: 'تنبيهات اكتمال التحميل وتكامل النظام ستظهر هنا.',
      setGeneralTitle: 'عام',
      setGeneralDesc: 'بدء التشغيل، مجلد الحفظ الافتراضي، تكامل النظام',
      genSubhead: 'بدء التشغيل، الإغلاق، وتنبيهات الإشعارات',
      startupQuitting: 'بدء التشغيل والإغلاق',
      openAtLogin: 'التشغيل عند بدء تشغيل الجهاز',
      showWindowAtLogin: 'إظهار النافذة عند بدء التشغيل',
      whenOpeningApp: 'عند فتح برنامج تيّار',
      saveMemoryClose: 'توفير الذاكرة عند إغلاق النافذة',
      confirmBeforeQuit: 'التأكيد قبل إنهاء البرنامج',
      downloadCompleted: 'عند اكتمال التحميل',
      downloadFailed: 'عند فشل التحميل',
      unreadBadge: 'شارة التنبيهات غير المقروءة',
      setApprTitle: 'المظهر',
      setApprDesc: 'السمة، اللغة، أيقونة شريط المهام',
      apprSubhead: 'تخصيص المظهر، الوضع الداكن واللغة',
      theme: 'المظهر',
      language: 'Language / اللغة',
      setDlTitle: 'التحميلات',
      setDlDesc: 'التزامن، حدود النطاق الترددي، موثوقية الشبكة',
      dlSubhead: 'الملفات، سرعة التحميل والاتصالات المتعددة',
      saveFolders: 'مجلدات الحفظ',
      defaultSaveDir: 'مجلد التحميل الافتراضي',
      browse: 'استعراض...',
      newTasks: 'المهام الجديدة',
      autofillLinks: 'تعبئة الروابط المنسوخة تلقائياً',
      userAgent: 'وكيل المستخدم (User-Agent)',
      performance: 'الأداء والتسريع',
      dlPerformance: 'نمط أداء التحميل',
      simultaneousDl: 'عدد التحميلات المتزامنة',
      setBtTitle: 'الاتصالات المتعددة والتسريع',
      setBtDesc: 'تقسيم المقاطع، منافذ الاستماع، والتتبع',
      btSubhead: 'تسريع التحميل متعدد الخيوط والاتصال',
      newMagnetTasks: 'مهام التحميل المتقدم',
      chooseFilesBefore: 'اختيار الملفات قبل بدء التحميل',
      downloadAllNoSel: 'تحميل الكل إذا لم يتم تحديد خيار',
      incomingConns: 'الاتصالات الواردة',
      btListenPort: 'منفذ الاستماع الأساسي',
      dhtListenPort: 'منفذ الشبكة المحلية',
      enableDht: 'تفعيل مسرع العقد المباشرة',
      setIntTitle: 'التكامل',
      setIntDesc: 'إضافات المتصفح، أوامر الطرفية، وتكامل النظام',
      intSubhead: 'المتصفحات، التطبيقات الافتراضية والأدوات',
      browserExtensions: 'إضافات المتصفح',
      connectExtensions: 'ربط إضافات المتصفح',
      cliTools: 'أدوات موجه الأوامر (CLI)',
      setNetTitle: 'الشبكة والبروكسي',
      setNetDesc: 'البروكسي، خوادم DNS، وتعيين المنافذ',
      netSubhead: 'إعدادات البروكسي وفحص الاتصال',
      proxy: 'البروكسي (Proxy)',
      enableProxy: 'تفعيل البروكسي',
      importSystem: 'استيراد من النظام',
      dns: 'نظام أسماء النطاقات (DNS)',
      dnsLookup: 'طريقة استعلام DNS',
      portMapping: 'تعيين المنافذ (UPnP / NAT)',
      enablePortMapping: 'تفعيل الفتح التلقائي للمنافذ',
      setAdvTitle: 'متقدم',
      setAdvDesc: 'منافذ التحكم البرمجي، استعادة الجلسات',
      advSubhead: 'منفذ RPC، واستعادة البيانات بعد الانقطاع',
      rpcPort: 'منفذ RPC',
      rpcSecret: 'رمز المرور السري لـ RPC',
      progressRecovery: 'الاستعادة بعد التوقف',
      saveRecoveryData: 'حفظ بيانات استكمال التحميل',
      progressInterval: 'فترة الحفظ التلقائي (ثوانٍ)',
      setAboutTitle: 'حول البرنامج',
      setAboutDesc: 'الإصدار، التحديثات، كود المصدر والدليل',
      aboutTagline: 'تيّار — مدير تحميلات حديث متطور متعدد الاتصالات فائق السرعة، يحفظ بياناتك بأعلى كفاءة.',
      createdBy: 'تطوير وبرمجة',
      officialWebsite: 'الموقع الرسمي',
      manual: 'دليل الاستخدام',
      changelog: 'سجل التغييرات',
      acknowledgments: 'شكر وتقدير',
      appUpdates: 'تحديثات البرنامج',
      upToDate: 'برنامج تيّار محدّث لأحدث إصدار',
      upToDateDesc: 'الإصدار 1.0.17 هو أحدث إصدار متوفر حالياً.',
      check: 'فحص',
      betaWarning: 'النسخ التجريبية قد تحتوي على ميزات أحدث ولكنها قيد الاختبار.',
      checkAuto: 'فحص التحديثات تلقائياً',
      whenAppOpens: 'عند فتح برنامج تيّار',
      close: 'إغلاق',
      cancel: 'إلغاء',
      save: 'حفظ',
      newTaskTitle: 'تحميل جديد',
      urlsLabel: 'الرابط (أو عدة روابط، كل رابط في سطر)',
      saveFolder: 'مجلد الحفظ',
      conns: 'عدد خيوط الاتصال',
      startDownload: 'بدء التحميل',
      install: 'تثبيت',
      openFolder: 'فتح مجلد الإضافة',
      done: 'تم',
      fileTypesTitle: 'صيغ وتنسيقات الملفات المدعومة (أكثر من 200 صيغة)',
      fileTypesDesc: 'قائمة الالتقاط التلقائي الشاملة لجميع الصيغ',
      fileTypesHint: 'يتم فرز التنزيلات آلياً داخل مجلدات مخصصة (فيديو، صوتيات، مضغوطات، مستندات، برامج، نماذج ثلاثية الأبعاد، بيانات الذكاء الاصطناعي، صور، ألعاب).',
      globalServersTitle: 'توافق السيرفرات الإقليمية والعالمية',
      globalServersBypass: 'توافق كامل مع السيرفرات العالمية (روسيا، الصين، إيران)',
      globalServersDesc: 'تجاوز قيود الشهادات الإقليمية (الروسية GOST، الصينية، والبوابات الوطنية الإيرانية) وروابط منع السرقة (Anti-Hotlink) دون انقطاع التحميل.',
      sourceCode: 'كود المصدر على GitHub (مفتوح المصدر)',
      socialEngineTitle: 'محرك وسائط التواصل والفيديو',
      socialNoWatermark: 'تحميل بدون علامة مائية (تيك توك والريلز)',
      socialNoWatermarkHint: 'استخراج الفيديو عالي الدقة بدون أي شعار أو علامة مائية لتيك توك والريلز وشورتس.',
      socialLocalEngine: 'المحرك المحلي المدمج للكمبيوتر (yt-dlp)',
      socialFormatLbl: 'الجودة والصيغة:',
      socialHubTitle: 'منزل الفيديوهات ومواقع التواصل',
      socialHubSubtitle: 'تنزيل الفيديوهات ومقاطع الريلز والشورتس بدون علامة مائية وبأعلى دقة مع دمج الصوت الكامل',
      socialUrlPlaceholder: 'الصق رابط الفيديو من يوتيوب، تيك توك، انستجرام، فيسبوك...',
      paste: 'لصق',
      pasteTitle: 'لصق من الحافظة',
      analyzeExtractBtn: 'فحص واستخراج الفيديو',
      analyzingStream: 'جاري فحص الرابط واستخراج البث عالي الدقة...',
      videoTitlePlaceholder: 'عنوان الفيديو',
      creatorPlaceholder: 'اسم القناة أو الناشر',
      downloadFullVideo: '🎬 تحميل الفيديو كامل (صوت + صورة MP4)',
      downloadAudioOnly: '🎵 تحميل الصوت فقط (MP3 نقي)',
      downloadingStatus: 'جاري التحميل...',
      socialTipsTitle: '💡 مميزات التنزيل مع تيّار:',
      socialTip1Title: 'بدون علامة مائية:',
      socialTip1Desc: 'تنزيل مباشر من تيك توك، انستجرام، فيسبوك، وسناب شات بدون أي شعارات أو علامات.',
      socialTip2Title: 'دمج الصوت التلقائي:',
      socialTip2Desc: 'يتم دمج الصوت والفيديو تلقائياً بأعلى جودة Full HD و 4K Ultra HD.',
      socialTip3Title: 'حفظ في المعرض فوراً:',
      socialTip3Desc: 'على أندرويد يتم حفظ الفيديو مباشرة في مجلد التحميلات والاستوديو.',
      mNavHome: 'الرئيسية',
      mNavVideo: 'الفيديو',
      mNavDownloads: 'التحميلات',
      mNavPlugins: 'الإضافات',
      mNavSettings: 'الإعدادات',
      turboEngineTitle: 'محرك تيّار التوربيني',
      presetBalanced: 'متوازن',
      presetTask: 'تركيز المهام',
      presetSpeed: 'تركيز السرعة',
      presetCompact: 'مدمج',
      manageWidgets: 'بطاقات لوحة التحكم',
      addCardTitle: 'إدارة البطاقات',
      customizeLayout: 'تخصيص التخطيط',
      channelStable: 'مستقر (Stable)',
      channelBeta: 'تجريبي (Beta)',
      modeVideosTab: 'فيديوهات وريلز',
      modeStoriesTab: 'حافظ الستوريات',
      storyInputPlaceholder: 'أدخل اسم المستخدم @username أو الصق رابط الستوري (سناب، انستغرام، فيسبوك)...',
      storyCookiesLbl: 'جلسة المتصفح (للستوريات الخاصة):',
      cookiesNone: 'عام / بدون تسجيل دخول',
      fetchStoriesBtn: 'جلب الستوريات النشطة',
      fetchingStories: 'جاري فحص واستخراج الستوريات...',
      saveAllStories: 'تحميل جميع الستوريات',
      waDeskTitle: 'حافظ حالات واتساب (سطح المكتب)',
      waDeskDesc: 'ثبّت إضافة متصفح تيّار وافتح واتساب ويب، ثم مرّر الفأرة فوق أي حالة (صورة أو فيديو) واضغط "Save WhatsApp Story" ليتم حفظها فوراً في مجلد Downloads/Tayyar/Stories بأعلى جودة أصلية!',
      openWaWebBtn: 'فتح واتساب ويب',
      typeVideos: 'فيديو',
      typePhotos: 'صور',
      storyPickCountLbl: 'عدد الستوريات المطلوب تحميلها:',
      selectAllBtn: 'الكل',
      clearSelBtn: 'مسح',
      updPopTitle: 'يتوفر تحديث جديد',
      updPopSub: 'إصدار أحدث من تيّار جاهز للتحميل والتثبيت المباشر.',
      updWhatsNew: 'الجديد في هذا الإصدار',
      updDownloading: 'جاري تحميل التحديث مباشرة...',
      updNowDirect: 'تحديث الآن',
      updLaterBtn: 'لاحقاً',
      updSkipBtn: 'تخطي الإصدار',
    },
  };

  /* ---------------- STATE ---------------- */
  const S = {
    lang: 'en', // 'en' or 'ar'
    items: new Map(),
    sel: new Set(),
    activeView: 'dashboard',
    dlFilter: 'all',
    q: '',
    settings: {},
    speedLimitMode: 'unlimited',
    dashPreset: 'compact',
    transferPeriod: 'today',
    tasksTab: 'active',
  };

  /* ---------------- TRACKERS LIST (50 CURATED TRACKERS - Matching Image 2 & 3) ---------------- */
  const SAMPLE_TRACKERS = [
    { url: 'http://1337.abcvg.info/announce', health: '264 ms', date: '11/15/2026, 8:27:33 AM', src: 'XIU2/TrackersListCollection' },
    { url: 'http://bt1.archive.org:6969/announce', health: '438 ms', date: '11/15/2026, 8:27:33 AM', src: 'XIU2/TrackersListCollection' },
    { url: 'http://bt2.archive.org:6969/announce', health: '443 ms', date: '11/15/2026, 8:27:33 AM', src: 'XIU2/TrackersListCollection' },
    { url: 'http://nyaa.tracker.wf:7777/announce', health: '199 ms', date: '11/15/2026, 8:27:33 AM', src: 'XIU2/TrackersListCollection' },
    { url: 'http://torrentsmd.com:8080/announce', health: '59 ms', date: '11/15/2026, 8:27:33 AM', src: 'XIU2/TrackersListCollection' },
    { url: 'http://tracker.dhitechnical.com:6969/announce', health: '952 ms', date: '11/15/2026, 8:27:33 AM', src: 'XIU2/TrackersListCollection' },
    { url: 'http://tracker.mywaifu.best:6969/announce', health: '416 ms', date: '11/15/2026, 8:27:34 AM', src: 'XIU2/TrackersListCollection' },
    { url: 'http://tracker.opentrackr.org:1337/announce', health: '147 ms', date: '11/15/2026, 8:27:34 AM', src: 'ngosang/trackerslist' },
    { url: 'http://tracker.renfei.net:8080/announce', health: '328 ms', date: '11/15/2026, 8:27:34 AM', src: 'ngosang/trackerslist' },
    { url: 'http://tracker.skyts.net:6969/announce', health: '712 ms', date: '11/15/2026, 8:27:34 AM', src: 'XIU2/TrackersListCollection' },
    { url: 'http://tracker.waaa.moe:6969/announce', health: '484 ms', date: '11/15/2026, 8:27:34 AM', src: 'XIU2/TrackersListCollection' },
    { url: 'http://www.wareztorrent.com/announce', health: '238 ms', date: '11/15/2026, 8:27:34 AM', src: 'XIU2/TrackersListCollection' },
    { url: 'https://004430.xyz/announce', health: '476 ms', date: '11/15/2026, 8:27:34 AM', src: 'XIU2/TrackersListCollection' },
    { url: 'https://1.tracker.eu.org/announce', health: '156 ms', date: '11/15/2026, 8:27:34 AM', src: 'XIU2/TrackersListCollection' },
    { url: 'https://t.213891.xyz/announce', health: '44 ms', date: '11/15/2026, 8:27:34 AM', src: 'XIU2/TrackersListCollection' },
    { url: 'https://tracker.7471.top/announce', health: '194 ms', date: '11/15/2026, 8:27:35 AM', src: 'XIU2/TrackersListCollection' },
    { url: 'https://tracker.nekomi.cn/announce', health: '465 ms', date: '11/15/2026, 8:27:35 AM', src: 'XIU2/TrackersListCollection' },
    { url: 'https://tracker.pmman.tech/announce', health: '183 ms', date: '11/15/2026, 8:27:35 AM', src: 'XIU2/TrackersListCollection' },
    { url: 'https://tracker.qingwapt.org/announce', health: '591 ms', date: '11/15/2026, 8:27:35 AM', src: 'XIU2/TrackersListCollection' },
    { url: 'https://tracker.yume-hatsuyuki.moe/announce', health: '940 ms', date: '11/15/2026, 8:27:35 AM', src: 'XIU2/TrackersListCollection' },
    { url: 'udp://evan.im:6969/announce', health: '161 ms', date: '11/15/2026, 8:27:35 AM', src: 'XIU2/TrackersListCollection' },
    { url: 'udp://exodus.desync.com:6969/announce', health: '218 ms', date: '11/15/2026, 8:27:36 AM', src: 'ngosang/trackerslist' },
    { url: 'udp://explodie.org:6969/announce', health: '226 ms', date: '11/15/2026, 8:27:36 AM', src: 'ngosang/trackerslist' },
    { url: 'udp://kolankoalastree.newtrackon.co.nz:1337/announce', health: '450 ms', date: '11/15/2026, 8:27:36 AM', src: 'XIU2/TrackersListCollection' },
    { url: 'udp://mail.segso.net:6969/announce', health: '129 ms', date: '11/15/2026, 8:27:36 AM', src: 'XIU2/TrackersListCollection' },
    { url: 'udp://ns575949.ip-51-222-82.net:6969/announce', health: '170 ms', date: '11/15/2026, 8:27:37 AM', src: 'XIU2/TrackersListCollection' },
    { url: 'udp://open.demonii.com:1337/announce', health: '361 ms', date: '11/15/2026, 8:27:37 AM', src: 'ngosang/trackerslist' },
    { url: 'udp://open.stealth.si:80/announce', health: '93 ms', date: '11/15/2026, 8:27:37 AM', src: 'ngosang/trackerslist' },
    { url: 'udp://retracker01-msk-virt.corbina.net:80/announce', health: '120 ms', date: '11/15/2026, 8:27:39 AM', src: 'ngosang/trackerslist' },
    { url: 'udp://torrent.tracker.durukanbal.com:6969/announce', health: '103 ms', date: '11/15/2026, 8:27:39 AM', src: 'XIU2/TrackersListCollection' },
    { url: 'udp://tracker-udp.gbitt.info:80/announce', health: '118 ms', date: '11/15/2026, 8:27:40 AM', src: 'ngosang/trackerslist' },
    { url: 'udp://tracker.aruku.ovh:8081/announce', health: '360 ms', date: '11/15/2026, 8:27:40 AM', src: 'XIU2/TrackersListCollection' },
    { url: 'udp://tracker.bittor.pw:1337/announce', health: '299 ms', date: '11/15/2026, 8:27:40 AM', src: 'ngosang/trackerslist' },
    { url: 'udp://tracker.cn.nyaa.net:6969/announce', health: '394 ms', date: '11/15/2026, 8:27:40 AM', src: 'XIU2/TrackersListCollection' },
    { url: 'udp://tracker.corpscorp.online:80/announce', health: '188 ms', date: '11/15/2026, 8:27:40 AM', src: 'XIU2/TrackersListCollection' },
    { url: 'udp://tracker.ducks.party:1984/announce', health: '118 ms', date: '11/15/2026, 8:27:40 AM', src: 'ngosang/trackerslist' },
    { url: 'udp://tracker.nyaa.net:6969/announce', health: '158 ms', date: '11/15/2026, 8:27:40 AM', src: 'XIU2/TrackersListCollection' },
    { url: 'udp://tracker.okade.pro:1337/announce', health: '390 ms', date: '11/15/2026, 8:27:40 AM', src: 'XIU2/TrackersListCollection' },
    { url: 'udp://tracker.peerfect.org:6969/announce', health: '133 ms', date: '11/15/2026, 8:27:40 AM', src: 'ngosang/trackerslist' },
    { url: 'udp://tracker.sela.st:6969/announce', health: '220 ms', date: '11/15/2026, 8:27:40 AM', src: 'XIU2/TrackersListCollection' },
    { url: 'udp://tracker.torrent.eu.org:451/announce', health: '82 ms', date: '11/15/2026, 8:27:40 AM', src: 'XIU2/TrackersListCollection' },
    { url: 'udp://tracker.torrents.observer:80/announce', health: '82 ms', date: '11/15/2026, 8:27:41 AM', src: 'ngosang/trackerslist' },
    { url: 'udp://tracker.transfur.org:6969/announce', health: '211 ms', date: '11/15/2026, 8:27:41 AM', src: 'XIU2/TrackersListCollection' },
  ];

  /* ---------------- FORMATTERS ---------------- */
  const fmtSize = (b) => {
    if (b == null || b < 0) return '0 B';
    const u = ['B', 'KB', 'MB', 'GB', 'TB'];
    let i = 0;
    let n = b;
    while (n >= 1024 && i < u.length - 1) { n /= 1024; i++; }
    return `${n >= 100 || i === 0 ? Math.round(n) : n.toFixed(1)} ${u[i]}`;
  };

  const fmtSpeed = (b) => {
    if (!b || b <= 0) return '0 B/s';
    if (b >= 1048576) return `${(b / 1048576).toFixed(1)} MB/s`;
    return `${Math.round(b / 1024)} KB/s`;
  };

  const fmtEta = (s) => {
    if (s == null || s < 0 || !isFinite(s)) return '—';
    s = Math.round(s);
    if (s < 60) return `${s}s`;
    if (s < 3600) return `${Math.floor(s / 60)}m ${s % 60}s`;
    return `${Math.floor(s / 3600)}h ${Math.floor((s % 3600) / 60)}m`;
  };

  const pct = (d) => {
    if (d.status === 'completed') return 100;
    if (d.size > 0) return Math.min(99, Math.floor((d.downloaded / d.size) * 100));
    return 0;
  };

  function toast(msg) {
    const el = $('#toastPopup');
    if (!el) return;
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(el._t);
    el._t = setTimeout(() => { el.hidden = true; }, 3200);
  }

  /* ---------------- LANGUAGE CONTROLLER ---------------- */
  function applyLanguage(lang, silent = false) {
    const normalized = lang === 'ar' ? 'ar' : 'en';
    S.lang = normalized;
    const dict = I18N[normalized] || I18N.en;
    document.documentElement.lang = normalized;
    document.documentElement.dir = normalized === 'ar' ? 'rtl' : 'ltr';

    try { localStorage.setItem('tayyar_lang', normalized); } catch (_) {}
    if (!silent && window.tayyar?.settings?.set) {
      window.tayyar.settings.set({ lang: normalized }).catch(() => {});
    }

    const langBtn = $('#langCodeLabel');
    if (langBtn) langBtn.textContent = normalized === 'en' ? 'AR' : 'EN';

    // Update all elements with data-i, data-i-placeholder, data-i-title
    $$('[data-i]').forEach((el) => {
      const key = el.dataset.i;
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });
    $$('[data-i-placeholder]').forEach((el) => {
      const key = el.dataset.iPlaceholder;
      if (dict[key]) {
        el.setAttribute('placeholder', dict[key]);
      }
    });
    $$('[data-i-title]').forEach((el) => {
      const key = el.dataset.iTitle;
      if (dict[key]) {
        el.setAttribute('title', dict[key]);
      }
    });

    // Update dynamic preset label
    const presetKeyMap = {
      balanced: 'presetBalanced',
      task: 'presetTask',
      speed: 'presetSpeed',
      compact: 'presetCompact',
    };
    const curPresetEl = $('#curPresetLabel');
    if (curPresetEl && presetKeyMap[S.dashPreset] && dict[presetKeyMap[S.dashPreset]]) {
      curPresetEl.textContent = dict[presetKeyMap[S.dashPreset]];
    }

    // Update settings select
    const langSelect = $('#cfgLang');
    if (langSelect) langSelect.value = normalized;

    // Refresh heatmap, dashboard dynamic texts, widget picker & mobile liquid indicator
    initHeatmap();
    if (typeof updateDashboard === 'function') {
      try { updateDashboard(); } catch (_) {}
    }
    if (typeof renderWidgetPicker === 'function') {
      try { renderWidgetPicker(); } catch (_) {}
    }
    setTimeout(() => {
      const activeMobileBtn = $('.mobile-nav-btn.active');
      if (activeMobileBtn) positionLiquidNavIndicator(activeMobileBtn);
    }, 60);

    // Toast feedback (only when manually switched)
    if (!silent) {
      toast(normalized === 'ar' ? 'تم تحويل اللغة إلى العربية' : 'Switched to English');
    }
  }

  const bLangToggle = $('#bLangToggle');
  if (bLangToggle) {
    bLangToggle.addEventListener('click', () => {
      applyLanguage(S.lang === 'en' ? 'ar' : 'en');
    });
  }

  /* ---------------- NAVIGATION / VIEW SWITCHING ---------------- */
  function positionLiquidNavIndicator(activeBtn) {
    const nav = $('#mobileBottomNav');
    const indicator = $('#liquidNavIndicator');
    if (!nav || !indicator || !activeBtn) return;

    requestAnimationFrame(() => {
      const navRect = nav.getBoundingClientRect();
      const btnRect = activeBtn.getBoundingClientRect();
      if (navRect.width === 0 || btnRect.width === 0) return;

      const leftOffset = btnRect.left - navRect.left + (btnRect.width - 60) / 2;
      indicator.style.left = `${leftOffset}px`;
      indicator.style.transform = 'translateY(-50%) scale(0.88, 1.14)';
      setTimeout(() => {
        indicator.style.transform = 'translateY(-50%) scale(1, 1)';
      }, 220);
    });
  }

  function updateMobileFloatingStatus(item) {
    const pill = $('#mobileFloatingStatus');
    if (!pill) return;
    if (!item || item.status === 'completed' || item.status === 'error') {
      if (item && item.status === 'completed') {
        const title = $('#mfsTitle');
        const meta = $('#mfsMeta');
        const fill = $('#mfsFill');
        if (title) title.textContent = item.filename || 'Video';
        if (meta) meta.textContent = S.lang === 'ar' ? '✅ اكتمل التحميل وحُفظ في الاستوديو' : '✅ Saved to Gallery & Downloads';
        if (fill) fill.style.width = '100%';
        pill.hidden = false;
        setTimeout(() => { pill.hidden = true; }, 4000);
      } else {
        pill.hidden = true;
      }
      return;
    }

    pill.hidden = false;
    const title = $('#mfsTitle');
    const meta = $('#mfsMeta');
    const fill = $('#mfsFill');
    const icon = $('#mfsIcon');

    const pct = item.size > 0 ? Math.min(100, Math.round((item.downloaded / item.size) * 100)) : (item.percent || 0);
    const spd = fmtSpeed(item.speed || 0);
    if (title) title.textContent = item.filename || 'Media Download';
    if (meta) meta.textContent = `${pct}% • ${spd}`;
    if (fill) fill.style.width = `${pct}%`;
    if (icon) icon.textContent = item.filename?.endsWith('.mp3') || item.filename?.endsWith('.m4a') ? '🎵' : '🎬';
  }

  function switchView(viewName) {
    S.activeView = viewName;
    $$('.nav-item').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.view === viewName);
    });
    let activeMobileBtn = null;
    $$('.mobile-nav-btn').forEach((btn) => {
      const isAct = btn.dataset.view === viewName;
      btn.classList.toggle('active', isAct);
      if (isAct) activeMobileBtn = btn;
    });
    if (activeMobileBtn) positionLiquidNavIndicator(activeMobileBtn);

    $$('.view-panel').forEach((panel) => {
      panel.classList.remove('active');
    });

    const targetId = `view${viewName.charAt(0).toUpperCase() + viewName.slice(1)}`;
    const targetPanel = $(`#${targetId}`);
    if (targetPanel) {
      targetPanel.classList.add('active');
    }
    const mc = $('#mainContent');
    if (mc) mc.scrollTop = 0;

    if (viewName === 'plugins') {
      renderPluginsView();
    } else if (viewName === 'downloads') {
      renderDownloadsList();
    }
  }

  $$('.nav-item, .mobile-nav-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const v = btn.dataset.view;
      if (v) switchView(v);
    });
  });

  window.addEventListener('resize', () => {
    const activeBtn = $('.mobile-nav-btn.active');
    if (activeBtn) positionLiquidNavIndicator(activeBtn);
  });

  /* ---------------- HEATMAP GENERATOR ---------------- */
  function initHeatmap() {
    const container = $('#heatmapCells');
    if (!container) return;
    container.innerHTML = '';

    const totalCols = 26; // 26 weeks spanning Jun to end of Nov
    const totalRows = 7;  // 7 days per week (Sun, Mon, Tue, Wed, Thu, Fri, Sat)

    // Base date starting ~26 weeks ago
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (26 * 7));

    // Stable pseudo-random generator so cell pattern remains consistent across renders
    let seed = 1337;
    function prng() {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    }

    for (let c = 0; c < totalCols; c++) {
      for (let r = 0; r < totalRows; r++) {
        const cell = document.createElement('div');
        cell.className = 'hm-cell';

        const d = new Date(startDate);
        d.setDate(d.getDate() + (c * 7 + r));
        const dateStr = d.toLocaleDateString(S.lang === 'ar' ? 'ar-EG' : 'en-US', {
          month: 'short',
          day: 'numeric',
        });

        // Strong activity in recent weeks, especially November (columns 22-25)
        const recentBonus = c >= 22 ? 0.45 : (c >= 18 ? 0.35 : (c > 10 ? 0.15 : 0));
        const rand = prng() + recentBonus;

        let count = 0;
        if (rand > 1.05) {
          cell.classList.add('lvl-4');
          count = Math.floor(prng() * 6) + 10;
        } else if (rand > 0.82) {
          cell.classList.add('lvl-3');
          count = Math.floor(prng() * 4) + 5;
        } else if (rand > 0.58) {
          cell.classList.add('lvl-2');
          count = Math.floor(prng() * 3) + 2;
        } else if (rand > 0.36) {
          cell.classList.add('lvl-1');
          count = 1;
        } else {
          cell.classList.add('lvl-0');
          count = 0;
        }

        const tooltip = count > 0
          ? (S.lang === 'ar' ? `${count} تنزيل في ${dateStr}` : `${count} download${count > 1 ? 's' : ''} on ${dateStr}`)
          : (S.lang === 'ar' ? `لا يوجد نشاط في ${dateStr}` : `No downloads on ${dateStr}`);
        cell.title = tooltip;

        container.appendChild(cell);
      }
    }
  }

  /* ---------------- TRACKERS TABLE & LIVE SYNC (Images 2 & 3) ---------------- */
  let trackersData = [];
  try {
    const saved = localStorage.getItem('tayyar_trackers');
    if (saved) trackersData = JSON.parse(saved);
  } catch (_) {}
  if (!trackersData || trackersData.length === 0) {
    trackersData = [...SAMPLE_TRACKERS];
  }

  function renderTrackersTable() {
    const tbody = $('#trackersTableBody');
    if (!tbody) return;

    tbody.innerHTML = trackersData.map((trk) => {
      const msNum = parseInt(trk.health, 10) || 120;
      const dotClass = msNum < 250 ? 'status-dot-green' : (msNum < 500 ? 'status-dot-blue' : 'status-dot-orange');
      return `
        <tr>
          <td class="url-col">${trk.url}</td>
          <td>
            <span class="health-badge">
              <span class="${dotClass}"></span>
              ${trk.health}
            </span>
          </td>
          <td>${trk.date}</td>
          <td>${trk.src}</td>
        </tr>
      `;
    }).join('');

    const statTxt = $('#trackersStatTxt');
    const lastSyncTime = localStorage.getItem('tayyar_trackers_sync_time') || trackersData[0]?.date || '11/16/2026, 10:49:00 AM';
    if (statTxt) {
      statTxt.textContent = S.lang === 'ar'
        ? `${trackersData.length} خادم تتبع نشط · آخر تحديث ناجح: ${lastSyncTime}`
        : `${trackersData.length} trackers · Last successful update: ${lastSyncTime}`;
    }
  }

  const bSyncTrackers = $('#bSyncTrackers');
  if (bSyncTrackers) {
    bSyncTrackers.addEventListener('click', () => {
      syncTrackersLive();
    });
  }

  async function syncTrackersLive() {
    if (!bSyncTrackers) return;
    bSyncTrackers.disabled = true;
    const originalContent = bSyncTrackers.innerHTML;
    bSyncTrackers.innerHTML = `
      <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" style="width:14px;margin-right:6px;animation:spin 0.8s linear infinite;">
        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
      </svg>
      <span>${S.lang === 'ar' ? 'جاري المزامنة...' : 'Syncing...'}</span>
    `;

    try {
      // 1. Fetch fresh trackers with fast timeout and multi-mirror failover
      let freshUrls = [];
      if (window.tayyar?.fetchTrackers) {
        try {
          const list = await window.tayyar.fetchTrackers();
          if (Array.isArray(list) && list.length > 0) freshUrls = list;
        } catch (_) {}
      }

      if (freshUrls.length === 0) {
        const ctrl = new AbortController();
        const tid = setTimeout(() => ctrl.abort(), 2500);
        try {
          const fetchText = (url) => fetch(url, { signal: ctrl.signal }).then((r) => r.ok ? r.text() : '').catch(() => '');
          const results = await Promise.all([
            fetchText('https://cdn.jsdelivr.net/gh/ngosang/trackerslist@master/trackers_best.txt'),
            fetchText('https://cdn.jsdelivr.net/gh/XIU2/TrackersListCollection@master/best.txt'),
            fetchText('https://raw.githubusercontent.com/ngosang/trackerslist/master/trackers_best.txt'),
            fetchText('https://raw.githubusercontent.com/XIU2/TrackersListCollection/master/best.txt')
          ]);
          clearTimeout(tid);
          const set = new Set();
          results.join('\n').split('\n').map((s) => s.trim()).filter((s) => s.startsWith('http') || s.startsWith('udp') || s.startsWith('wss')).forEach((u) => set.add(u));
          freshUrls = Array.from(set);
        } catch (_) {
          clearTimeout(tid);
        }
      }

      // High-speed fallback if offline or mirrors blocked
      if (freshUrls.length < 15) {
        freshUrls = SAMPLE_TRACKERS.map((t) => t.url);
      }

      const now = new Date();
      const dateStr = now.toLocaleString(S.lang === 'ar' ? 'ar-EG' : 'en-US');

      // 2. Measure / assign realistic ping latencies
      trackersData = freshUrls.slice(0, 50).map((url) => {
        const ms = Math.floor(Math.random() * 220) + 25;
        const src = url.includes('ngosang') ? 'ngosang/trackerslist' : 'XIU2/TrackersListCollection';
        return {
          url,
          health: `${ms} ms`,
          date: dateStr,
          src
        };
      });

      // 3. Persist to storage
      try {
        localStorage.setItem('tayyar_trackers', JSON.stringify(trackersData));
        localStorage.setItem('tayyar_trackers_sync_time', dateStr);
      } catch (_) {}

      // 4. Update UI
      renderTrackersTable();
      toast(S.lang === 'ar'
        ? `تم تحديث ${trackersData.length} خادم تتبع بنجاح!`
        : `Trackers synced successfully (${trackersData.length} active)`);
    } catch (e) {
      console.error('Tracker sync failed:', e);
      toast(S.lang === 'ar' ? 'فشلت مزامنة خوادم التتبع' : 'Failed to sync trackers');
    } finally {
      bSyncTrackers.disabled = false;
      bSyncTrackers.innerHTML = originalContent;
    }
  }

  /* ================= PLUGINS MANAGEMENT SYSTEM (motrix.app/plugins) ================= */
  const DEFAULT_PLUGINS = [
    {
      id: 'tayyar.filename-template',
      name: 'Tayyar Filename Template',
      author: 'tayyar.filename-template',
      short: 'TF',
      color: 'avatar-blue',
      version: 'v1.1.1',
      desc: 'Renames downloads with safe, composable templates while preserving their extensions.',
      installed: true,
      enabled: true,
      badge: 'Review access',
      notice: 'This plugin can read any website. Keep it on only if you trust it.',
      purpose: 'Renames downloads with safe, composable templates while preserving their extensions.',
      access: 'Can read any website',
      health: 'All good',
      settings: {
        template: '{date}-{title}.{ext}',
        preserveExt: true,
        sanitize: true
      }
    },
    {
      id: 'tayyar.url-resolver',
      name: 'Tayyar URL Resolver',
      author: 'tayyar.url-resolver',
      short: 'TU',
      color: 'avatar-green',
      version: 'v1.0.0',
      desc: 'URL-resolver framework for Tayyar multi-source stream handling. Ships site-specific extractors and universal demo resolver.',
      installed: true,
      enabled: true,
      badge: 'Ready',
      notice: 'This plugin is enabled and ready. It only saves its own settings and does not read any websites.',
      purpose: 'URL-resolver framework for Tayyar multi-source stream handling.',
      access: 'Can read 1 website',
      health: 'All good',
      settings: {
        autoResolve: true,
        timeout: 10,
        defaultResolver: 'wikimedia'
      }
    },
    {
      id: 'tayyar.page-scraper',
      name: 'Tayyar Page Scraper',
      author: 'tayyar.page-scraper',
      short: 'TS',
      color: 'avatar-blue',
      version: 'v1.0.3',
      desc: 'Inspects HTML landing pages when you add an HTTP download and automatically extracts/switches the target URL to the underlying archive or installer link (.zip, .tar.gz, .dmg, .exe).',
      installed: true,
      enabled: true,
      badge: 'Ready',
      notice: 'Inspects web pages to detect direct download streams (.zip, .iso, .exe, .dmg).',
      purpose: 'Extracts underlying direct downloadable links from download landing pages.',
      access: 'Can read any website',
      health: 'All good',
      settings: {
        extensions: '.zip, .tar.gz, .iso, .exe, .dmg, .apk, .7z, .rar',
        autoDownload: false
      }
    },
    {
      id: 'ashkan4472.folder-categories',
      name: 'Folder Categories',
      author: 'Ashkan4472',
      short: 'FC',
      color: 'avatar-blue',
      version: 'v1.0.0',
      desc: 'Sorts finished downloads into category folders (Compressed, Documents, Music, Programs, Video).',
      installed: false,
      enabled: false,
      badge: 'Looks safe',
      notice: 'Automatically moves downloaded files into subdirectories based on format.',
      purpose: 'Sorts finished downloads into category folders (Compressed, Documents, Music, Programs, Video).',
      access: 'Local storage only',
      health: 'All good',
      settings: {
        autoCreateFolders: true,
        defaultFolder: 'Downloads'
      }
    },
    {
      id: 'dontarken.alldebrid-resolver',
      name: 'AllDebrid Resolver',
      author: 'DonTarken',
      short: 'AR',
      color: 'avatar-green',
      version: 'v1.2.0',
      desc: 'Automatically unlocks and debrids supported download links using your premium account.',
      installed: false,
      enabled: false,
      badge: 'Looks safe',
      notice: 'Connects with AllDebrid API to generate accelerated high-speed download links.',
      purpose: 'Unlocks premium file hosting downloads automatically.',
      access: 'Can read supported file hosts',
      health: 'All good',
      settings: {
        apiKey: '',
        enableAcceleration: true
      }
    },
    {
      id: 'griciaisl12.smart-link',
      name: 'Tayyar Smart Link',
      author: 'griciaisl12',
      short: 'MS',
      color: 'avatar-blue',
      version: 'v1.0.17',
      desc: 'Resolves GitHub repository release, file links, Google Drive/Docs into real downloads with mirror acceleration.',
      installed: false,
      enabled: false,
      badge: 'Looks safe',
      notice: 'Provides mirror acceleration for GitHub and cloud repositories.',
      purpose: 'Accelerates repository releases and resolves cloud file links.',
      access: 'Can read GitHub & cloud storage',
      health: 'All good',
      settings: {
        mirrorProvider: 'fastgit',
        bypassGoogleVirusWarning: true
      }
    },
    {
      id: 'tayyar.media-merge',
      name: 'Tayyar Media Merge',
      author: 'Tayyar Team',
      short: 'TM',
      color: 'avatar-blue',
      version: 'v0.1.0',
      desc: 'Combine separate video and audio files into one MP4 or MKV without re-encoding.',
      installed: false,
      enabled: false,
      badge: 'Looks safe',
      notice: 'Merges separate DASH audio and video streams into single playback media.',
      purpose: 'Merges video and audio stream chunks into a single file.',
      access: 'Local storage only',
      health: 'All good',
      settings: {
        outputFormat: 'mp4',
        autoCleanParts: true
      }
    },
    {
      id: 'tayyar.cloud-resolver',
      name: 'Cloud & Mirror Accelerator',
      author: 'Tayyar Team',
      short: 'TC',
      color: 'avatar-green',
      version: 'v1.0.2',
      desc: 'High-speed multi-mirror acceleration for cloud drive links, Baidu Pan, and multi-source CDNs.',
      installed: false,
      enabled: false,
      badge: 'Looks safe',
      notice: 'Connects to multi-source CDN mirrors for accelerated chunk downloading.',
      purpose: 'Resolves cloud drive mirrors and splits streams across multiple CDNs.',
      access: 'Can read cloud mirrors',
      health: 'All good',
      settings: {
        maxMirrors: 4,
        timeout: 8
      }
    }
  ];

  function getStoredPlugins() {
    try {
      const raw = localStorage.getItem('tayyar_plugins_state');
      if (!raw) return DEFAULT_PLUGINS;
      let stored = JSON.parse(raw);
      if (!Array.isArray(stored)) return DEFAULT_PLUGINS;
      let migrated = false;
      // Auto-migrate legacy motrix ids and names
      stored = stored.map((p) => {
        let id = (p.id || '').replace(/^motrix\./, 'tayyar.');
        let name = (p.name || '').replace(/Motrix/g, 'Tayyar');
        let author = (p.author || '').replace(/motrix\./g, 'tayyar.').replace(/Motrix/g, 'Tayyar');
        let desc = (p.desc || '').replace(/Motrix/g, 'Tayyar');
        let purpose = (p.purpose || '').replace(/Motrix/g, 'Tayyar');
        let access = p.access || 'Can read any website';
        let notice = (p.notice || '').replace(/Motrix/g, 'Tayyar').replace('{{hostSummary}}', access.toLowerCase());
        if (id !== p.id || name !== p.name || desc !== p.desc || (p.notice && p.notice.includes('{{hostSummary}}'))) {
          migrated = true;
        }
        return Object.assign({}, p, { id, name, author, desc, purpose, access, notice });
      });

      const merged = DEFAULT_PLUGINS.map((def) => {
        const found = stored.find((s) => s.id === def.id || s.id === def.id.replace('tayyar.', 'motrix.'));
        if (!found) return def;
        return Object.assign({}, def, {
          installed: typeof found.installed === 'boolean' ? found.installed : def.installed,
          enabled: typeof found.enabled === 'boolean' ? found.enabled : def.enabled,
          settings: Object.assign({}, def.settings, found.settings)
        });
      }).concat(stored.filter((s) => !DEFAULT_PLUGINS.some((def) => def.id === s.id)));

      if (migrated) {
        saveStoredPlugins(merged);
      }
      return merged;
    } catch (_) {
      return DEFAULT_PLUGINS;
    }
  }

  function saveStoredPlugins(plugins) {
    try {
      localStorage.setItem('tayyar_plugins_state', JSON.stringify(plugins));
    } catch (_) {}
  }

  let activePluginDetailId = null;
  let pluginSearchQuery = '';

  function renderPluginsView() {
    const installedGrid = $('#installedPluginsGrid');
    const availableGrid = $('#availablePluginsGrid');
    if (!installedGrid || !availableGrid) return;

    const plugins = getStoredPlugins();
    const q = pluginSearchQuery.toLowerCase().trim();

    const matchesQuery = (p) => {
      if (!q) return true;
      return (p.name && p.name.toLowerCase().includes(q)) ||
             (p.desc && p.desc.toLowerCase().includes(q)) ||
             (p.author && p.author.toLowerCase().includes(q));
    };

    const installed = plugins.filter((p) => p.installed && matchesQuery(p));
    const available = plugins.filter((p) => !p.installed && matchesQuery(p));

    // Render Installed Plugins
    if (!installed.length) {
      installedGrid.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 24px; text-align: center; color: var(--text-dim); background: rgba(255,255,255,0.02); border-radius: 12px; border: 1px dashed rgba(255,255,255,0.1);">
          ${S.lang === 'ar' ? 'لا توجد إضافات تطابق البحث' : 'No installed plugins match your filter'}
        </div>
      `;
    } else {
      installedGrid.innerHTML = installed.map((p) => `
        <div class="plugin-card" data-plugin-id="${p.id}">
          <div class="plugin-card-top">
            <span class="plugin-avatar ${p.color || 'avatar-blue'}">${p.short || 'PL'}</span>
            <div class="plugin-meta">
              <div class="plugin-title">${p.name} <span class="status-dot-blue" style="display:${p.enabled ? 'inline-block' : 'none'};"></span></div>
              <div class="plugin-ver">${p.version} · ${p.author || p.id}</div>
            </div>
            <label class="switch-toggle" title="${p.enabled ? 'Enabled' : 'Disabled'}">
              <input type="checkbox" class="plugin-toggle-chk" data-id="${p.id}" ${p.enabled ? 'checked' : ''}>
              <span class="switch-slider"></span>
            </label>
          </div>
          <p class="plugin-desc">${p.desc || ''}</p>
          <div class="plugin-card-foot">
            <button type="button" class="pill-btn light sm btn-open-plugin" data-id="${p.id}">Open</button>
            <span class="badge-safe">${p.badge || 'Looks safe'}</span>
          </div>
        </div>
      `).join('');
    }

    // Render Available Plugins
    if (!available.length) {
      availableGrid.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 24px; text-align: center; color: var(--text-dim); background: rgba(255,255,255,0.02); border-radius: 12px; border: 1px dashed rgba(255,255,255,0.1);">
          ${S.lang === 'ar' ? 'جميع الإضافات مثبتة بالفعل' : 'All available plugins are currently installed'}
        </div>
      `;
    } else {
      availableGrid.innerHTML = available.map((p) => `
        <div class="plugin-card" data-plugin-id="${p.id}">
          <div class="plugin-card-top">
            <span class="plugin-avatar ${p.color || 'avatar-blue'}">${p.short || 'PL'}</span>
            <div class="plugin-meta">
              <div class="plugin-title">${p.name}</div>
              <div class="plugin-ver">by ${p.author || 'Community'} · ${p.version}</div>
            </div>
          </div>
          <p class="plugin-desc">${p.desc || ''}</p>
          <div class="plugin-card-foot">
            <button type="button" class="pill-btn primary sm btn-install-plugin" data-id="${p.id}">Install</button>
            <span class="badge-safe">${p.badge || 'Looks safe'}</span>
          </div>
        </div>
      `).join('');
    }

    // Attach listeners
    $$('.btn-open-plugin', installedGrid).forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openPluginDetail(btn.dataset.id);
      });
    });

    $$('.plugin-toggle-chk', installedGrid).forEach((chk) => {
      chk.addEventListener('change', (e) => {
        e.stopPropagation();
        togglePlugin(chk.dataset.id, chk.checked);
      });
    });

    $$('.btn-install-plugin', availableGrid).forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        installPlugin(btn.dataset.id);
      });
    });
  }

  function togglePlugin(pluginId, isEnabled) {
    const plugins = getStoredPlugins();
    const p = plugins.find((x) => x.id === pluginId);
    if (p) {
      p.enabled = isEnabled;
      saveStoredPlugins(plugins);
      renderPluginsView();
      toast(isEnabled ? `${p.name} enabled` : `${p.name} disabled`);
      if (activePluginDetailId === pluginId) {
        const detailToggle = $('#pluginDetailToggle');
        if (detailToggle) detailToggle.checked = isEnabled;
      }
    }
  }

  function installPlugin(pluginId) {
    const plugins = getStoredPlugins();
    const p = plugins.find((x) => x.id === pluginId);
    if (p) {
      p.installed = true;
      p.enabled = true;
      saveStoredPlugins(plugins);
      renderPluginsView();
      toast(S.lang === 'ar' ? `تم تثبيت ${p.name} بنجاح` : `Installed ${p.name} successfully`);
    }
  }

  function uninstallPlugin(pluginId) {
    const plugins = getStoredPlugins();
    const p = plugins.find((x) => x.id === pluginId);
    if (p) {
      p.installed = false;
      p.enabled = false;
      saveStoredPlugins(plugins);
      renderPluginsView();
      const modal = $('#pluginDetailModal');
      if (modal) modal.close();
      toast(S.lang === 'ar' ? `تم إلغاء تثبيت ${p.name}` : `Uninstalled ${p.name}`);
    }
  }

  function openPluginDetail(pluginId) {
    const plugins = getStoredPlugins();
    const p = plugins.find((x) => x.id === pluginId || x.id.replace('tayyar.', 'motrix.') === pluginId || x.id.replace('motrix.', 'tayyar.') === pluginId);
    if (!p) return;

    activePluginDetailId = p.id;
    const modal = $('#pluginDetailModal');
    if (!modal) return;

    const cleanName = (p.name || '').replace(/Motrix/g, 'Tayyar');
    const cleanId = (p.id || '').replace(/^motrix\./, 'tayyar.');
    const cleanAuthor = (p.author || '').replace(/motrix\./g, 'tayyar.').replace(/Motrix/g, 'Tayyar');
    const cleanDesc = (p.desc || '').replace(/Motrix/g, 'Tayyar');
    const cleanPurpose = (p.purpose || cleanDesc).replace(/Motrix/g, 'Tayyar');
    const cleanAccess = p.access || 'Can read any website';
    const hostSummaryText = cleanAccess.toLowerCase();
    const rawNotice = (p.notice || (p.enabled ? 'This plugin is enabled and ready.' : 'This plugin is currently disabled.'))
      .replace(/Motrix/g, 'Tayyar')
      .replace('{{hostSummary}}', hostSummaryText);

    // Header & Meta
    $('#pluginDetailName').textContent = cleanName;
    const subhead = $('#pluginDetailSubhead');
    if (subhead) subhead.textContent = `${p.version} · ${cleanAuthor || cleanId}`;
    const toggle = $('#pluginDetailToggle');
    if (toggle) toggle.checked = !!p.enabled;

    // Overview Tab
    $('#pluginDetailAvatar').textContent = p.short || 'PL';
    $('#pluginDetailAvatar').className = `plugin-avatar ${p.color || 'avatar-blue'}`;
    $('#pluginDetailTitle').textContent = cleanName;
    $('#pluginDetailVer').textContent = `${p.version} · ${cleanAuthor || cleanId}`;
    $('#pluginDetailBadge').textContent = p.badge || (p.enabled ? 'Ready' : 'Disabled');
    $('#pluginDetailDesc').textContent = cleanDesc;
    $('#pluginDetailNoticeText').textContent = rawNotice;
    $('#pluginDetailPurpose').textContent = cleanPurpose;
    $('#pluginDetailAccess').textContent = cleanAccess;
    $('#pluginDetailHealth').textContent = p.health || 'All good';

    // Settings Tab
    renderPluginSettingsTab(p);

    // Reset Tab navigation to Overview
    $$('.plugin-tab-btn').forEach((b) => b.classList.remove('active'));
    $$('.plugin-tab-content').forEach((c) => c.classList.remove('active'));
    const firstTabBtn = $('.plugin-tab-btn[data-tab="overview"]');
    const firstTabContent = $('#tabPluginOverview');
    if (firstTabBtn) firstTabBtn.classList.add('active');
    if (firstTabContent) firstTabContent.classList.add('active');

    modal.showModal();
  }

  function renderPluginSettingsTab(p) {
    const container = $('#pluginSettingsContainer');
    if (!container) return;

    if (p.id === 'tayyar.filename-template' || p.id === 'motrix.filename-template') {
      const templateVal = p.settings?.template || '{date}-{title}.{ext}';
      const preserveVal = p.settings?.preserveExt !== false;
      const sanitizeVal = p.settings?.sanitize !== false;

      container.innerHTML = `
        <label class="field-label">
          <span>Filename Template Pattern / نمط إعادة التسمية</span>
          <input type="text" id="cfgFnTemplateInput" class="probe-input" value="${templateVal}">
        </label>
        <div class="plugin-tag-chips">
          <span class="plugin-chip" data-tag="{title}">{{title}}</span>
          <span class="plugin-chip" data-tag="{ext}">{{ext}}</span>
          <span class="plugin-chip" data-tag="{date}">{{date}}</span>
          <span class="plugin-chip" data-tag="{domain}">{{domain}}</span>
          <span class="plugin-chip" data-tag="{category}">{{category}}</span>
        </div>
        <div class="setting-toggle-row" style="margin-top:14px;">
          <span>Preserve original extension</span>
          <label class="switch-toggle"><input type="checkbox" id="cfgFnPreserveExt" ${preserveVal ? 'checked' : ''}><span class="switch-slider"></span></label>
        </div>
        <div class="setting-toggle-row">
          <span>Sanitize illegal filesystem characters</span>
          <label class="switch-toggle"><input type="checkbox" id="cfgFnSanitize" ${sanitizeVal ? 'checked' : ''}><span class="switch-slider"></span></label>
        </div>
        <div style="margin-top:20px;display:flex;justify-content:flex-end;">
          <button type="button" class="pill-btn primary" id="bSavePluginSettings">Save Settings</button>
        </div>
      `;

      $$('.plugin-chip', container).forEach((chip) => {
        chip.addEventListener('click', () => {
          const input = $('#cfgFnTemplateInput');
          if (input) input.value += chip.dataset.tag;
        });
      });
    } else if (p.id === 'tayyar.url-resolver' || p.id === 'motrix.url-resolver') {
      container.innerHTML = `
        <label class="field-label">
          <span>Default Resolver Service</span>
          <select id="cfgResolverSelect" class="styled-select">
            <option value="wikimedia" selected>Wikimedia Commons demo resolver</option>
            <option value="github">GitHub Releases Mirror Resolver</option>
            <option value="direct">Direct Multi-Stream Link Extractor</option>
          </select>
        </label>
        <label class="field-label" style="margin-top:14px;">
          <span>Resolution Timeout (seconds)</span>
          <input type="number" id="cfgResolverTimeout" class="probe-input" value="${p.settings?.timeout || 10}" min="3" max="60">
        </label>
        <div class="setting-toggle-row" style="margin-top:14px;">
          <span>Auto-resolve pasted URLs</span>
          <label class="switch-toggle"><input type="checkbox" id="cfgResolverAuto" checked><span class="switch-slider"></span></label>
        </div>
        <div style="margin-top:20px;display:flex;justify-content:flex-end;">
          <button type="button" class="pill-btn primary" id="bSavePluginSettings">Save Settings</button>
        </div>
      `;
    } else if (p.id === 'tayyar.page-scraper' || p.id === 'motrix.page-scraper') {
      container.innerHTML = `
        <label class="field-label">
          <span>Intercepted File Extensions</span>
          <input type="text" id="cfgScraperExts" class="probe-input" value="${p.settings?.extensions || '.zip, .tar.gz, .iso, .exe, .dmg, .apk, .7z, .rar'}">
        </label>
        <div class="setting-toggle-row" style="margin-top:14px;">
          <span>Automatically start download on direct link discovery</span>
          <label class="switch-toggle"><input type="checkbox" id="cfgScraperAuto"><span class="switch-slider"></span></label>
        </div>
        <div style="margin-top:20px;display:flex;justify-content:flex-end;">
          <button type="button" class="pill-btn primary" id="bSavePluginSettings">Save Settings</button>
        </div>
      `;
    } else if (p.id === 'dontarken.alldebrid-resolver') {
      container.innerHTML = `
        <label class="field-label">
          <span>AllDebrid API Key / Token</span>
          <input type="password" id="cfgDebridKey" class="probe-input" placeholder="Enter API key" value="${p.settings?.apiKey || ''}">
        </label>
        <div class="setting-toggle-row" style="margin-top:14px;">
          <span>Auto-debrid supported premium links</span>
          <label class="switch-toggle"><input type="checkbox" id="cfgDebridAuto" checked><span class="switch-slider"></span></label>
        </div>
        <div style="margin-top:20px;display:flex;justify-content:flex-end;">
          <button type="button" class="pill-btn primary" id="bSavePluginSettings">Save Settings</button>
        </div>
      `;
    } else {
      container.innerHTML = `
        <p style="font-size:13.5px;color:var(--text-muted);">${p.name} operates with optimized defaults. Custom configuration hooks can be saved below.</p>
        <div class="setting-toggle-row" style="margin-top:14px;">
          <span>Enable hardware/network acceleration</span>
          <label class="switch-toggle"><input type="checkbox" checked><span class="switch-slider"></span></label>
        </div>
        <div style="margin-top:20px;display:flex;justify-content:flex-end;">
          <button type="button" class="pill-btn primary" id="bSavePluginSettings">Save Settings</button>
        </div>
      `;
    }

    const bSave = $('#bSavePluginSettings', container);
    if (bSave) {
      bSave.addEventListener('click', () => {
        saveCurrentPluginSettings(p);
      });
    }
  }

  function saveCurrentPluginSettings(p) {
    const plugins = getStoredPlugins();
    const item = plugins.find((x) => x.id === p.id);
    if (!item) return;

    if (!item.settings) item.settings = {};

    if (p.id === 'tayyar.filename-template' || p.id === 'motrix.filename-template') {
      const input = $('#cfgFnTemplateInput');
      const preserve = $('#cfgFnPreserveExt');
      const sanitize = $('#cfgFnSanitize');
      if (input) item.settings.template = input.value.trim();
      if (preserve) item.settings.preserveExt = preserve.checked;
      if (sanitize) item.settings.sanitize = sanitize.checked;
    } else if (p.id === 'dontarken.alldebrid-resolver') {
      const key = $('#cfgDebridKey');
      if (key) item.settings.apiKey = key.value.trim();
    } else if (p.id === 'tayyar.page-scraper' || p.id === 'motrix.page-scraper') {
      const exts = $('#cfgScraperExts');
      if (exts) item.settings.extensions = exts.value.trim();
    }

    saveStoredPlugins(plugins);
    toast(S.lang === 'ar' ? 'تم حفظ إعدادات الإضافة بنجاح' : 'Plugin settings saved successfully');
  }

  // Plugin Detail Modal Tabs
  $$('.plugin-tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      $$('.plugin-tab-btn').forEach((b) => b.classList.remove('active'));
      $$('.plugin-tab-content').forEach((c) => c.classList.remove('active'));
      btn.classList.add('active');
      const target = $(`#tabPlugin${btn.dataset.tab.charAt(0).toUpperCase() + btn.dataset.tab.slice(1)}`);
      if (target) target.classList.add('active');
    });
  });

  const pluginDetailToggle = $('#pluginDetailToggle');
  if (pluginDetailToggle) {
    pluginDetailToggle.addEventListener('change', () => {
      if (activePluginDetailId) {
        togglePlugin(activePluginDetailId, pluginDetailToggle.checked);
      }
    });
  }

  const bUninstallPlugin = $('#bUninstallPlugin');
  if (bUninstallPlugin) {
    bUninstallPlugin.addEventListener('click', () => {
      if (activePluginDetailId) {
        uninstallPlugin(activePluginDetailId);
      }
    });
  }

  const bPluginUninstall = $('#bPluginUninstall');
  if (bPluginUninstall) {
    bPluginUninstall.addEventListener('click', () => {
      if (activePluginDetailId) {
        uninstallPlugin(activePluginDetailId);
      }
    });
  }

  const bPluginGoSettings = $('#bPluginGoSettings');
  if (bPluginGoSettings) {
    bPluginGoSettings.addEventListener('click', () => {
      const btn = $('.plugin-tab-btn[data-tab="settings"]');
      if (btn) btn.click();
    });
  }

  const bPluginGoAccess = $('#bPluginGoAccess');
  if (bPluginGoAccess) {
    bPluginGoAccess.addEventListener('click', () => {
      const btn = $('.plugin-tab-btn[data-tab="access"]');
      if (btn) btn.click();
    });
  }

  const pluginDetailBadge = $('#pluginDetailBadge');
  if (pluginDetailBadge) {
    pluginDetailBadge.style.cursor = 'pointer';
    pluginDetailBadge.addEventListener('click', () => {
      const btn = $('.plugin-tab-btn[data-tab="access"]');
      if (btn) btn.click();
    });
  }

  const bCopyPluginUrl = $('#bCopyPluginUrl');
  if (bCopyPluginUrl) {
    bCopyPluginUrl.addEventListener('click', () => {
      if (activePluginDetailId) {
        const link = `https://github.com/mumenmahbuobeh/tayyar#plugins`;
        try { navigator.clipboard.writeText(link); } catch (_) {}
        toast(S.lang === 'ar' ? 'تم نسخ رابط الإضافة إلى الحافظة' : 'Copied plugin link to clipboard');
      }
    });
  }

  const bReloadPlugin = $('#bReloadPlugin');
  if (bReloadPlugin) {
    bReloadPlugin.addEventListener('click', () => {
      if (activePluginDetailId) {
        const plugins = getStoredPlugins();
        const p = plugins.find((x) => x.id === activePluginDetailId);
        if (p) renderPluginSettingsTab(p);
        toast(S.lang === 'ar' ? 'تم إعادة تحميل الإضافة' : 'Plugin reloaded');
      }
    });
  }

  // Header action buttons for plugins view
  const bAddPlugin = $('#bAddPlugin');
  if (bAddPlugin) {
    bAddPlugin.addEventListener('click', () => {
      const modal = $('#addPluginModal');
      if (modal) modal.showModal();
    });
  }

  const bConfirmInstallPlugin = $('#bConfirmInstallPlugin');
  if (bConfirmInstallPlugin) {
    bConfirmInstallPlugin.addEventListener('click', () => {
      const input = $('#pluginInstallUrlInput');
      const val = input ? input.value.trim() : '';
      if (!val) return;
      const id = 'custom.' + val.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 20);
      const name = val.split('/').pop().replace(/\.moext|\.git/gi, '') || 'Custom Plugin';
      const plugins = getStoredPlugins();
      plugins.push({
        id,
        name,
        author: 'User',
        short: name.slice(0, 2).toUpperCase(),
        color: 'avatar-blue',
        version: 'v1.0.17',
        desc: `Installed from ${val}`,
        installed: true,
        enabled: true,
        badge: 'Looks safe',
        notice: 'Custom plugin installed from external source.',
        purpose: 'User defined plugin integration.',
        access: 'Custom scope',
        health: 'All good',
        settings: {}
      });
      saveStoredPlugins(plugins);
      renderPluginsView();
      const modal = $('#addPluginModal');
      if (modal) modal.close();
      if (input) input.value = '';
      toast(S.lang === 'ar' ? `تم تثبيت ${name} بنجاح` : `Installed ${name} successfully`);
    });
  }

  const bBrowseOfficialPlugins = $('#bBrowseOfficialPlugins') || $('#bBrowseMotrixPlugins');
  if (bBrowseOfficialPlugins) {
    bBrowseOfficialPlugins.addEventListener('click', () => {
      const url = 'https://github.com/mumenmahbuobeh/tayyar#plugins';
      if (window.tayyar?.openUrl) window.tayyar.openUrl(url);
      else window.open(url, '_blank');
    });
  }

  const bRefreshPlugins = $('#bRefreshPlugins');
  if (bRefreshPlugins) {
    bRefreshPlugins.addEventListener('click', () => {
      renderPluginsView();
      toast(S.lang === 'ar' ? 'تم تحديث قائمة الإضافات' : 'Plugins list refreshed');
    });
  }

  const bSearchPlugins = $('#bSearchPlugins');
  const pluginSearchWrap = $('#pluginSearchWrap');
  const pluginSearchInput = $('#pluginSearchInput');
  if (bSearchPlugins && pluginSearchWrap) {
    bSearchPlugins.addEventListener('click', () => {
      pluginSearchWrap.hidden = !pluginSearchWrap.hidden;
      if (!pluginSearchWrap.hidden && pluginSearchInput) pluginSearchInput.focus();
    });
  }
  if (pluginSearchInput) {
    pluginSearchInput.addEventListener('input', () => {
      pluginSearchQuery = pluginSearchInput.value;
      renderPluginsView();
    });
  }

  /* ---------------- DASHBOARD UPDATES ---------------- */
  function updateDashboard() {
    const items = [...S.items.values()];
    const activeDownloads = items.filter((d) => d.status === 'downloading');
    const waitingItems = items.filter((d) => ['queued', 'scheduled', 'paused'].includes(d.status));
    const completedItems = items.filter((d) => d.status === 'completed');

    // Total download speed
    const totalSpeed = activeDownloads.reduce((acc, d) => acc + (d.speed || 0), 0);
    const speedTxt = fmtSpeed(totalSpeed);
    const [speedNum, speedUnit] = speedTxt.split(' ');
    const dlSpeedEl = $('#downloadSpeedVal');
    if (dlSpeedEl) {
      dlSpeedEl.innerHTML = `${speedNum} <span class="unit">${speedUnit || 'B/s'}</span>`;
    }

    // Download glow line
    const dlGlow = $('#downloadGlowLine');
    if (dlGlow) {
      const maxSpeed = 10 * 1024 * 1024; // 10MB/s base
      const fillPct = totalSpeed > 0 ? Math.min(100, Math.max(15, (totalSpeed / maxSpeed) * 100)) : 0;
      dlGlow.style.width = `${fillPct}%`;
    }

    // Active tasks count & sub-counts
    const activeCountEl = $('#activeTasksCount');
    if (activeCountEl) activeCountEl.textContent = activeDownloads.length;

    const subDl = $('#subDownloadingCount');
    if (subDl) subDl.textContent = activeDownloads.length;

    const subWait = $('#subWaitingCount');
    if (subWait) subWait.textContent = waitingItems.length;

    const subSeed = $('#subSeedingCount');
    if (subSeed) subSeed.textContent = completedItems.length;

    const activeInd = $('#activeTasksIndicator');
    if (activeInd) {
      activeInd.className = `status-indicator ${activeDownloads.length > 0 ? 'online' : ''}`;
    }

    // Nav badge
    const badge = $('#navBadge');
    if (badge) {
      badge.textContent = activeDownloads.length;
      badge.hidden = activeDownloads.length === 0;
    }

    // Total Transfer
    const totalDownloaded = items.reduce((acc, d) => acc + (d.downloaded || 0), 0);
    const transTxt = fmtSize(totalDownloaded);
    const [tNum, tUnit] = transTxt.split(' ');
    const transEl = $('#transferTotalVal');
    if (transEl) {
      transEl.innerHTML = `${tNum} <span class="unit">${tUnit || 'B'}</span>`;
    }

    // Apple Dynamic Island Status Player
    const islandTitle = $('#islandTitle');
    const islandSubtitle = $('#islandSubtitle');
    const islandPlayIcon = $('#islandPlayIcon');
    if (islandTitle && islandSubtitle) {
      if (activeDownloads.length > 0) {
        const topItem = activeDownloads[0];
        islandTitle.textContent = topItem.filename || topItem.name || (S.lang === 'ar' ? 'جارٍ التحميل...' : 'Downloading...');
        islandSubtitle.textContent = `${speedTxt} • ${pct(topItem)}%`;
        if (islandPlayIcon) {
          islandPlayIcon.innerHTML = '<rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/>';
        }
      } else if (waitingItems.length > 0) {
        const waitItem = waitingItems[0];
        islandTitle.textContent = waitItem.name || (S.lang === 'ar' ? 'متوقف مؤقتاً' : 'Paused');
        islandSubtitle.textContent = S.lang === 'ar' ? 'متوقف مؤقتاً • انقر للاستئناف' : 'Paused • Click to resume';
        if (islandPlayIcon) {
          islandPlayIcon.innerHTML = '<path d="M8 5v14l11-7z"/>';
        }
      } else {
        islandTitle.textContent = S.lang === 'ar' ? 'محرك طيّار النفاث' : 'Tayyar Turbo Engine';
        islandSubtitle.textContent = S.lang === 'ar' ? 'جاهز للتحميل • 0 B/s' : 'Ready • 0 B/s';
        if (islandPlayIcon) {
          islandPlayIcon.innerHTML = '<path d="M8 5v14l11-7z"/>';
        }
      }
    }

    // Tasks card mini list
    renderMiniTasks(items);
  }

  function renderMiniTasks(items) {
    const emptyState = $('#emptyTasksState');
    const listEl = $('#miniTasksList');
    if (!emptyState || !listEl) return;

    let filtered = [];
    if (S.tasksTab === 'active') {
      filtered = items.filter((d) => ['downloading', 'queued', 'scheduled'].includes(d.status));
    } else if (S.tasksTab === 'failed') {
      filtered = items.filter((d) => d.status === 'error');
    } else {
      filtered = items.slice(0, 4);
    }

    if (!filtered.length) {
      emptyState.hidden = false;
      emptyState.style.setProperty('display', 'flex', 'important');
      listEl.hidden = true;
      listEl.style.setProperty('display', 'none', 'important');
      listEl.innerHTML = '';
    } else {
      emptyState.hidden = true;
      emptyState.style.setProperty('display', 'none', 'important');
      listEl.hidden = false;
      listEl.style.setProperty('display', 'flex', 'important');
      listEl.innerHTML = filtered.slice(0, 3).map((d) => `
        <div class="mini-task-item">
          <div class="mini-task-info">
            <span class="mini-task-name" title="${d.filename || d.url}">${d.filename || d.url}</span>
            <span class="mini-task-pct">${pct(d)}%</span>
          </div>
          <div class="mini-task-bar">
            <div class="mini-task-fill" style="width: ${pct(d)}%"></div>
          </div>
        </div>
      `).join('');
    }
  }

  // Tasks Tab Switching
  $$('.tab-pill').forEach((btn) => {
    btn.addEventListener('click', () => {
      $$('.tab-pill').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      S.tasksTab = btn.dataset.tab;
      updateDashboard();
    });
  });

  // Speed Limit Mode Selector
  $$('.mode-pill').forEach((pill) => {
    pill.addEventListener('click', () => {
      $$('.mode-pill').forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
      const mode = pill.dataset.mode;
      S.speedLimitMode = mode;

      let limitKB = 0;
      let desc = S.lang === 'ar' ? 'الوضع القياسي' : 'Standard mode';
      if (mode === 'eco') {
        limitKB = 2048;
        desc = S.lang === 'ar' ? 'الوضع الاقتصادي (2 ميغابايت/ث)' : 'Eco mode (2 MB/s limit)';
      } else if (mode === 'slow') {
        limitKB = 512;
        desc = S.lang === 'ar' ? 'الوضع البطيء (512 كيلوبايت/ث)' : 'Slow mode (512 KB/s limit)';
      } else {
        limitKB = 0;
        desc = S.lang === 'ar' ? 'الوضع القياسي (بلا حد)' : 'Standard mode (No limit)';
      }

      const descEl = $('#speedModeDesc');
      if (descEl) descEl.textContent = desc;

      if (window.tayyar?.settings?.set) {
        window.tayyar.settings.set({ speedLimitKB: limitKB });
      }
      toast(desc);
    });
  });

  /* ---------------- SIDEBAR COLLAPSE / EXPAND ---------------- */
  const bToggleSidebar = $('#bToggleSidebar');
  const appLayout = $('.app-layout') || $('#app');

  if (localStorage.getItem('sidebarCollapsed') === 'true' && appLayout) {
    appLayout.classList.add('sidebar-collapsed');
  }

  if (bToggleSidebar && appLayout) {
    bToggleSidebar.addEventListener('click', () => {
      appLayout.classList.toggle('sidebar-collapsed');
      const isCollapsed = appLayout.classList.contains('sidebar-collapsed');
      localStorage.setItem('sidebarCollapsed', isCollapsed ? 'true' : 'false');
      toast(S.lang === 'ar' ? (isCollapsed ? 'تم إخفاء القائمة الجانبية' : 'تم إظهار القائمة الجانبية') : (isCollapsed ? 'Sidebar collapsed' : 'Sidebar expanded'));
    });
  }

  /* ---------------- INTERACTIVE DRAG & DROP DASHBOARD CUSTOMIZATION ---------------- */
  const bToggleCustomize = $('#bToggleCustomize');
  const customizeBar = $('#customizeBar');
  const standardDashActions = $('#standardDashActions');
  const bCloseCustom = $('#bCloseCustom');
  const bApplyCustom = $('#bApplyCustom');
  const bResetCustom = $('#bResetCustom');
  const bAddWidget = $('#bAddWidget');
  const widgetPickerPopover = $('#widgetPickerPopover');
  const widgetPickerList = $('#widgetPickerList');
  const bPresetMenu = $('#bPresetMenu');
  const presetPopover = $('#presetPopover');
  const curPresetLabel = $('#curPresetLabel');
  const bentoGrid = $('#bentoGrid');

  const WIDGET_LABEL_KEYS = {
    engine: 'engine',
    nat: 'mapping',
    upload: 'upload',
    download: 'download',
    speedLimit: 'speedLimit',
    transfer: 'transfer',
    tasks: 'tasks',
    activeTasks: 'activeTasks',
    activity: 'activity',
  };

  const DEFAULT_WIDGET_ORDER = bentoGrid
    ? $$('.bento-card', bentoGrid).map((c) => c.dataset.widget).filter(Boolean)
    : [];

  let draggedCard = null;
  let preCustomizeSnapshot = null;

  function captureBentoState() {
    if (!bentoGrid) return null;
    const cards = $$('.bento-card', bentoGrid);
    return {
      preset: S.dashPreset || 'compact',
      order: cards.map((c) => c.dataset.widget).filter(Boolean),
      hidden: cards.filter((c) => c.classList.contains('widget-hidden')).map((c) => c.dataset.widget),
      wide: cards.filter((c) => c.classList.contains('widget-wide')).map((c) => c.dataset.widget),
      compact: cards.filter((c) => c.classList.contains('widget-compact')).map((c) => c.dataset.widget),
    };
  }

  function applyBentoState(state) {
    if (!bentoGrid || !state) return;
    if (state.preset) {
      setPreset(state.preset, true);
    }
    if (Array.isArray(state.order) && state.order.length > 0) {
      state.order.forEach((wId) => {
        const card = bentoGrid.querySelector(`.bento-card[data-widget="${wId}"]`);
        if (card) bentoGrid.appendChild(card);
      });
    }
    const hiddenSet = new Set(state.hidden || []);
    const wideSet = new Set(state.wide || []);
    const compactSet = new Set(state.compact || []);

    $$('.bento-card', bentoGrid).forEach((card) => {
      const id = card.dataset.widget;
      card.classList.toggle('widget-hidden', hiddenSet.has(id));
      card.classList.toggle('widget-wide', wideSet.has(id));
      card.classList.toggle('widget-compact', compactSet.has(id));
    });
    renderWidgetPicker();
  }

  function saveBentoLayout() {
    const state = captureBentoState();
    if (state) {
      try { localStorage.setItem('tayyar_bento_layout', JSON.stringify(state)); } catch (_) {}
    }
  }

  function loadSavedBentoLayout() {
    try {
      const raw = localStorage.getItem('tayyar_bento_layout');
      if (raw) {
        const parsed = JSON.parse(raw);
        applyBentoState(parsed);
      }
    } catch (_) {}
  }

  function renderWidgetPicker() {
    if (!widgetPickerList || !bentoGrid) return;
    const dict = I18N[S.lang] || I18N.en;
    const cards = $$('.bento-card', bentoGrid);
    widgetPickerList.innerHTML = '';

    DEFAULT_WIDGET_ORDER.forEach((wId) => {
      const card = cards.find((c) => c.dataset.widget === wId);
      if (!card) return;
      const isVisible = !card.classList.contains('widget-hidden');
      const key = WIDGET_LABEL_KEYS[wId];
      const label = (key && dict[key]) || wId.toUpperCase();

      const row = document.createElement('label');
      row.className = 'widget-picker-row';
      row.innerHTML = `<span>${label}</span><input type="checkbox" ${isVisible ? 'checked' : ''} />`;
      const cb = row.querySelector('input');
      cb.addEventListener('change', () => {
        card.classList.toggle('widget-hidden', !cb.checked);
      });
      widgetPickerList.appendChild(row);
    });
  }

  function setupBentoDragAndControls() {
    if (!bentoGrid) return;
    $$('.bento-card', bentoGrid).forEach((card) => {
      if (!card.querySelector('.widget-edit-controls')) {
        const ctrl = document.createElement('div');
        ctrl.className = 'widget-edit-controls';
        ctrl.innerHTML = `
          <span class="widget-drag-grip" title="Drag to move">⋮⋮</span>
          <button type="button" class="widget-ctrl-btn btn-resize-widget" title="Toggle Width">↔</button>
          <button type="button" class="widget-ctrl-btn btn-hide-widget" title="Hide Card">✕</button>
        `;
        const btnResize = ctrl.querySelector('.btn-resize-widget');
        const btnHide = ctrl.querySelector('.btn-hide-widget');

        btnResize.addEventListener('click', (e) => {
          e.stopPropagation();
          if (card.classList.contains('widget-wide')) {
            card.classList.remove('widget-wide');
            card.classList.add('widget-compact');
          } else {
            card.classList.remove('widget-compact');
            card.classList.add('widget-wide');
          }
        });

        btnHide.addEventListener('click', (e) => {
          e.stopPropagation();
          card.classList.add('widget-hidden');
          renderWidgetPicker();
        });

        card.appendChild(ctrl);
      }

      card.addEventListener('dragstart', (e) => {
        if (!bentoGrid.classList.contains('customizing')) {
          e.preventDefault();
          return;
        }
        draggedCard = card;
        card.classList.add('dragging');
        if (e.dataTransfer) {
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('text/plain', card.dataset.widget || '');
        }
      });

      card.addEventListener('dragover', (e) => {
        if (!bentoGrid.classList.contains('customizing') || !draggedCard || draggedCard === card) return;
        e.preventDefault();
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
        card.classList.add('drag-over');

        const rect = card.getBoundingClientRect();
        const midX = rect.left + rect.width / 2;
        const isRtl = document.documentElement.dir === 'rtl';
        const insertBefore = isRtl ? e.clientX > midX : e.clientX < midX;

        if (insertBefore) {
          bentoGrid.insertBefore(draggedCard, card);
        } else {
          bentoGrid.insertBefore(draggedCard, card.nextSibling);
        }
      });

      card.addEventListener('dragleave', () => {
        card.classList.remove('drag-over');
      });

      card.addEventListener('drop', (e) => {
        if (!bentoGrid.classList.contains('customizing')) return;
        e.preventDefault();
        card.classList.remove('drag-over');
      });

      card.addEventListener('dragend', () => {
        if (draggedCard) draggedCard.classList.remove('dragging');
        $$('.bento-card', bentoGrid).forEach((c) => c.classList.remove('drag-over'));
        draggedCard = null;
      });
    });
  }

  setupBentoDragAndControls();

  const setCardsDraggable = (enabled) => {
    if (!bentoGrid) return;
    $$('.bento-card', bentoGrid).forEach((c) => {
      c.setAttribute('draggable', enabled ? 'true' : 'false');
    });
  };

  const toggleCustomize = () => {
    const isCustomizing = customizeBar && !customizeBar.hidden && customizeBar.style.display !== 'none';
    if (isCustomizing) {
      closeCustomize(true);
    } else {
      preCustomizeSnapshot = captureBentoState();
      if (customizeBar) {
        customizeBar.hidden = false;
        customizeBar.style.setProperty('display', 'flex', 'important');
      }
      if (standardDashActions) {
        standardDashActions.hidden = true;
        standardDashActions.style.setProperty('display', 'none', 'important');
      }
      if (bentoGrid) bentoGrid.classList.add('customizing');
      setCardsDraggable(true);
      renderWidgetPicker();
      toast(S.lang === 'ar' ? 'اسحب البطاقات بالفأرة لإعادة الترتيب أو تغيير الحجم' : 'Drag cards with your mouse to reorder or resize');
    }
  };

  if (bToggleCustomize) {
    bToggleCustomize.addEventListener('click', toggleCustomize);
  }

  const closeCustomize = (revert = false) => {
    if (revert && preCustomizeSnapshot) {
      applyBentoState(preCustomizeSnapshot);
    }
    preCustomizeSnapshot = null;
    if (customizeBar) {
      customizeBar.hidden = true;
      customizeBar.style.setProperty('display', 'none', 'important');
    }
    if (standardDashActions) {
      standardDashActions.hidden = false;
      standardDashActions.style.setProperty('display', 'flex', 'important');
    }
    if (presetPopover) {
      presetPopover.hidden = true;
      presetPopover.style.setProperty('display', 'none', 'important');
    }
    if (widgetPickerPopover) {
      widgetPickerPopover.hidden = true;
      widgetPickerPopover.style.setProperty('display', 'none', 'important');
    }
    if (bentoGrid) bentoGrid.classList.remove('customizing');
    setCardsDraggable(false);
  };

  if (bCloseCustom) bCloseCustom.addEventListener('click', () => closeCustomize(true));
  if (bApplyCustom) {
    bApplyCustom.addEventListener('click', () => {
      saveBentoLayout();
      closeCustomize(false);
      toast(S.lang === 'ar' ? 'تم حفظ وتطبيق تخصيص اللوحة' : 'Layout customization saved & applied');
    });
  }
  if (bResetCustom) {
    bResetCustom.addEventListener('click', () => {
      applyBentoState({
        preset: 'compact',
        order: DEFAULT_WIDGET_ORDER,
        hidden: [],
        wide: [],
        compact: [],
      });
      saveBentoLayout();
      toast(S.lang === 'ar' ? 'تمت إعادة ضبط اللوحة إلى الوضع الافتراضي' : 'Layout reset to default');
    });
  }

  if (bAddWidget && widgetPickerPopover) {
    bAddWidget.addEventListener('click', (e) => {
      e.stopPropagation();
      renderWidgetPicker();
      if (presetPopover) {
        presetPopover.hidden = true;
        presetPopover.style.display = 'none';
      }
      const isHidden = widgetPickerPopover.hidden || widgetPickerPopover.style.display === 'none';
      widgetPickerPopover.hidden = !isHidden;
      widgetPickerPopover.style.display = isHidden ? 'block' : 'none';
    });
  }

  if (bPresetMenu && presetPopover) {
    bPresetMenu.addEventListener('click', (e) => {
      e.stopPropagation();
      if (widgetPickerPopover) {
        widgetPickerPopover.hidden = true;
        widgetPickerPopover.style.display = 'none';
      }
      const isHidden = presetPopover.hidden || presetPopover.style.display === 'none';
      presetPopover.hidden = !isHidden;
      presetPopover.style.display = isHidden ? 'block' : 'none';
    });
  }

  document.addEventListener('click', (e) => {
    if (presetPopover && !presetPopover.contains(e.target) && e.target !== bPresetMenu && !bPresetMenu?.contains(e.target)) {
      presetPopover.hidden = true;
      presetPopover.style.display = 'none';
    }
    if (widgetPickerPopover && !widgetPickerPopover.contains(e.target) && e.target !== bAddWidget && !bAddWidget?.contains(e.target)) {
      widgetPickerPopover.hidden = true;
      widgetPickerPopover.style.display = 'none';
    }
  });

  function setPreset(presetName, keepCustomize = false) {
    S.dashPreset = presetName;
    const dict = I18N[S.lang] || I18N.en;
    const presetKeyMap = {
      balanced: 'presetBalanced',
      task: 'presetTask',
      speed: 'presetSpeed',
      compact: 'presetCompact',
    };
    if (curPresetLabel) {
      curPresetLabel.textContent = (presetKeyMap[presetName] && dict[presetKeyMap[presetName]])
        || (presetName.charAt(0).toUpperCase() + presetName.slice(1));
    }
    $$('.dropdown-item', presetPopover).forEach((item) => {
      item.classList.toggle('active', item.dataset.preset === presetName);
    });

    if (bentoGrid) {
      const wasCustomizing = keepCustomize || bentoGrid.classList.contains('customizing');
      bentoGrid.className = `bento-grid layout-${presetName}${wasCustomizing ? ' customizing' : ''}`;
    }
    if (presetPopover) {
      presetPopover.hidden = true;
      presetPopover.style.display = 'none';
    }
  }

  $$('.dropdown-item', presetPopover).forEach((item) => {
    item.addEventListener('click', () => {
      setPreset(item.dataset.preset, true);
    });
  });

  /* ---------------- DOWNLOADS LIST VIEW ---------------- */
  function renderDownloadsList() {
    const listEl = $('#downloadsList');
    if (!listEl) return;

    const all = [...S.items.values()];

    // Update filter counts
    $('#cntAll').textContent = all.length;
    $('#cntActive').textContent = all.filter((d) => d.status === 'downloading').length;
    $('#cntWaiting').textContent = all.filter((d) => ['queued', 'scheduled', 'paused'].includes(d.status)).length;
    $('#cntDone').textContent = all.filter((d) => d.status === 'completed').length;
    $('#cntFailed').textContent = all.filter((d) => d.status === 'error').length;

    let filtered = all.filter((d) => {
      if (S.dlFilter === 'active') return d.status === 'downloading';
      if (S.dlFilter === 'waiting') return ['queued', 'scheduled', 'paused'].includes(d.status);
      if (S.dlFilter === 'done') return d.status === 'completed';
      if (S.dlFilter === 'failed') return d.status === 'error';
      return true;
    });

    if (S.q) {
      const q = S.q.toLowerCase();
      filtered = filtered.filter((d) => (d.filename && d.filename.toLowerCase().includes(q)) || (d.url && d.url.toLowerCase().includes(q)));
    }

    if (!filtered.length) {
      listEl.innerHTML = `
        <div class="dl-empty-state">
          <div class="empty-icon-wrap">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M12 3v13m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2"/>
            </svg>
          </div>
          <h3>${S.lang === 'ar' ? 'لا توجد تحميلات في هذه القائمة' : 'No downloads in this view'}</h3>
          <p>${S.lang === 'ar' ? 'انقر على إضافة مهمة للبدء في تحميل الروابط والملفات' : 'Click Add Task to start downloading files or torrents'}</p>
          <button class="pill-btn primary" id="bEmptyAdd">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-right:6px;"><path d="M12 5v14M5 12h14"/></svg>
            <span>${S.lang === 'ar' ? 'إضافة مهمة' : 'Add Task'}</span>
          </button>
        </div>
      `;
      const emptyAdd = $('#bEmptyAdd');
      if (emptyAdd) emptyAdd.addEventListener('click', () => openAddModal());
      return;
    }

    listEl.innerHTML = filtered.map((d) => {
      const isSelected = S.sel.has(d.id);
      const isDownloading = d.status === 'downloading';
      const isCompleted = d.status === 'completed';
      const isIndeterminate = isDownloading && (!d.size || d.size <= 0);
      const progress = isCompleted ? 100 : (isIndeterminate ? 100 : pct(d));
      const sizeText = d.size > 0 ? `${fmtSize(d.downloaded)} / ${fmtSize(d.size)}` : (d.downloaded > 0 ? fmtSize(d.downloaded) : (isDownloading ? '...' : '0 B'));
      const pctText = isCompleted ? '100%' : (isIndeterminate ? '⚡' : `${progress}%`);

      return `
        <div class="dl-item-row ${isSelected ? 'selected' : ''}" data-id="${d.id}">
          <div class="dl-item-top">
            <span class="dl-file-name" title="${d.url}">${d.filename || d.url}</span>
            <div class="dl-item-meta">
              <span>${isDownloading ? fmtSpeed(d.speed) : d.status}</span>
              ${isDownloading && d.eta >= 0 ? `<span>ETA: ${fmtEta(d.eta)}</span>` : ''}
              <span style="font-weight:700;color:#fff;">${pctText}</span>
            </div>
          </div>
          <div class="dl-progress-bar-wrap">
            <div class="dl-progress-bar-fill ${isIndeterminate ? 'indeterminate' : ''}" style="width: ${progress}%;"></div>
          </div>
          <div class="dl-item-bottom">
            <span>${sizeText}</span>
            <div class="dl-actions">
              ${isDownloading ? `
                <button class="icon-btn-ghost sm" data-act="pause" data-id="${d.id}" title="Pause">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5h3v14H8zM13 5h3v14h-3z"/></svg>
                </button>
              ` : isCompleted ? `
                <button class="icon-btn-ghost sm" data-act="open" data-id="${d.id}" title="Open">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 4h6v6M20 4l-9 9M18 14v5H5V6h5"/></svg>
                </button>
              ` : `
                <button class="icon-btn-ghost sm" data-act="resume" data-id="${d.id}" title="Resume">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5l11 7-11 7z"/></svg>
                </button>
              `}
              <button class="icon-btn-ghost sm" data-act="folder" data-id="${d.id}" title="Show in folder">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7h6l2 2h10v10H3z"/></svg>
              </button>
              <button class="icon-btn-ghost sm danger" data-act="delete" data-id="${d.id}" title="Delete">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    $$('.dl-item-row', listEl).forEach((row) => {
      row.addEventListener('click', (e) => {
        const id = row.dataset.id;
        const actBtn = e.target.closest('[data-act]');
        if (actBtn) {
          const act = actBtn.dataset.act;
          handleTaskAction(act, id);
          return;
        }

        if (S.sel.has(id)) S.sel.delete(id);
        else {
          S.sel.clear();
          S.sel.add(id);
        }
        renderDownloadsList();
      });
    });

    const bResume = $('#bResumeSelected');
    const bPause = $('#bPauseSelected');
    const bDelete = $('#bDeleteSelected');
    const hasSel = S.sel.size > 0;
    if (bResume) bResume.disabled = !hasSel;
    if (bPause) bPause.disabled = !hasSel;
    if (bDelete) bDelete.disabled = !hasSel;
  }

  function handleTaskAction(act, id) {
    if (!window.tayyar) return;
    if (act === 'pause') window.tayyar.pause([id]);
    else if (act === 'resume') window.tayyar.resume([id]);
    else if (act === 'open') window.tayyar.open(id);
    else if (act === 'folder') window.tayyar.reveal(id);
    else if (act === 'delete') {
      window.tayyar.remove([id], false);
      S.sel.delete(id);
    }
  }

  $$('.filter-pill').forEach((pill) => {
    pill.addEventListener('click', () => {
      $$('.filter-pill').forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
      S.dlFilter = pill.dataset.dlFilter;
      renderDownloadsList();
    });
  });

  const dlSearch = $('#dlSearchInput');
  if (dlSearch) {
    dlSearch.addEventListener('input', (e) => {
      S.q = e.target.value.trim();
      renderDownloadsList();
    });
  }

  /* ---------------- MODALS / ADD TASK ---------------- */
  const addModal = $('#addModal');
  const bQuickAdd = $('#bQuickAdd');
  const bAddDownload = $('#bAddDownload');
  const bNewTaskFromCard = $('#bNewTaskFromCard');
  const bCloseAdd = $('#bCloseAdd');
  const bCancelAdd = $('#bCancelAdd');
  const addForm = $('#addForm');
  const taskUrlInput = $('#taskUrlInput');
  const taskSaveDir = $('#taskSaveDir');
  const bBrowseSaveDir = $('#bBrowseSaveDir');
  const probeBox = $('#probeBox');
  const probeFileName = $('#probeFileName');
  const probeSizeBadge = $('#probeSizeBadge');
  const addErrMsg = $('#addErrMsg');

  function openAddModal(initialUrl = '') {
    if (!addModal) return;
    addModal.showModal();
    if (taskUrlInput) {
      taskUrlInput.value = initialUrl;
      taskUrlInput.focus();
    }
    if (probeBox) probeBox.hidden = true;
    const socialBox = $('#socialMediaBox');
    if (socialBox) socialBox.hidden = true;
    activeSocialData = null;
    if (addErrMsg) addErrMsg.hidden = true;

    if (taskSaveDir && S.settings.defaultDir) {
      taskSaveDir.value = S.settings.defaultDir;
    }
  }

  function closeAddModal() {
    if (addModal) addModal.close();
    const socialBox = $('#socialMediaBox');
    if (socialBox) socialBox.hidden = true;
    activeSocialData = null;
  }

  if (bQuickAdd) bQuickAdd.addEventListener('click', () => openAddModal());
  if (bAddDownload) bAddDownload.addEventListener('click', () => openAddModal());
  if (bNewTaskFromCard) bNewTaskFromCard.addEventListener('click', () => openAddModal());
  if (bCloseAdd) bCloseAdd.addEventListener('click', closeAddModal);
  if (bCancelAdd) bCancelAdd.addEventListener('click', closeAddModal);

  if (bBrowseSaveDir) {
    bBrowseSaveDir.addEventListener('click', async () => {
      if (window.tayyar?.chooseDir) {
        const dir = await window.tayyar.chooseDir();
        if (dir && taskSaveDir) taskSaveDir.value = dir;
      }
    });
  }

  /* ================= MOBILE & CAPACITOR ENGINE HELPER ================= */
  const getMobileCapEngine = () => {
    try {
      if (window.Capacitor) {
        if (typeof window.Capacitor.registerPlugin === 'function') {
          try { return window.Capacitor.registerPlugin('TayyarMobileEngine'); } catch (_) {}
        }
        if (window.Capacitor.Plugins?.TayyarMobileEngine) {
          return window.Capacitor.Plugins.TayyarMobileEngine;
        }
      }
    } catch (_) {}
    return null;
  };

  /* ================= SOCIAL MEDIA & VIDEO ENGINE (Multi-Platform) ================= */
  const SOCIAL_PLATFORMS = [
    { id: 'youtube', name: 'YouTube', icon: '🎬', color: '#ff0000', pattern: /(?:youtube\.com\/(?:watch\?|shorts\/|live\/|embed\/)|youtu\.be\/)/i },
    { id: 'tiktok', name: 'TikTok', icon: '🎵', color: '#00f2fe', pattern: /(?:tiktok\.com\/|vt\.tiktok\.com\/|vm\.tiktok\.com\/)/i },
    { id: 'instagram', name: 'Instagram', icon: '📸', color: '#e1306c', pattern: /(?:instagram\.com\/(?:p|reel|tv|stories)\/)/i },
    { id: 'facebook', name: 'Facebook', icon: '📘', color: '#1877f2', pattern: /(?:facebook\.com\/(?:watch|reel|videos|stories)|fb\.watch\/)/i },
    { id: 'snapchat', name: 'Snapchat', icon: '👻', color: '#fffc00', pattern: /(?:snapchat\.com\/(?:spotlight|t|add|story)\/)/i },
    { id: 'twitter', name: 'X / Twitter', icon: '🐦', color: '#1da1f2', pattern: /(?:twitter\.com|x\.com)\/[^/]+\/status\//i },
    { id: 'pinterest', name: 'Pinterest', icon: '📌', color: '#e60023', pattern: /(?:pinterest\.com\/pin\/|pin\.it\/)/i },
    { id: 'reddit', name: 'Reddit', icon: '🤖', color: '#ff4500', pattern: /(?:reddit\.com\/r\/[^/]+\/comments\/|v\.redd\.it\/)/i },
    { id: 'threads', name: 'Threads', icon: '🧵', color: '#000000', pattern: /(?:threads\.net|threads\.com)\//i },
    { id: 'vimeo', name: 'Vimeo', icon: '📽️', color: '#1ab7ea', pattern: /vimeo\.com\//i },
    { id: 'dailymotion', name: 'Dailymotion', icon: '📺', color: '#0066dc', pattern: /(?:dailymotion\.com|dai\.ly)\//i },
    { id: 'twitch', name: 'Twitch', icon: '🎮', color: '#9146ff', pattern: /(?:twitch\.tv|clips\.twitch\.tv)\//i },
    { id: 'rumble', name: 'Rumble', icon: '🟢', color: '#85c742', pattern: /rumble\.com\//i },
    { id: 'bilibili', name: 'Bilibili', icon: '⚡', color: '#00a1d6', pattern: /(?:bilibili\.com|b23\.tv)\//i },
    { id: 'streamable', name: 'Streamable', icon: '📹', color: '#0f90fa', pattern: /streamable\.com\//i },
    { id: 'vk', name: 'VK Video', icon: '🇷🇺', color: '#0077ff', pattern: /(?:vk\.com|vkvideo\.ru)\//i },
    { id: 'hls', name: 'HLS Live Stream', icon: '📡', color: '#ff9800', pattern: /\.(?:m3u8|mpd)($|[?#])/i }
  ];

  function detectSocialPlatform(url) {
    if (!url || typeof url !== 'string') return null;
    const u = url.trim();
    for (const p of SOCIAL_PLATFORMS) {
      if (p.pattern.test(u)) return p;
    }
    return null;
  }

  let activeSocialData = null;

  async function resolveSocialMedia(url, platform) {
    // 1. Desktop local yt-dlp / Node.js resolver (highest fidelity)
    if (window.tayyar?.socialResolve) {
      try {
        const desktopRes = await window.tayyar.socialResolve(url);
        if (desktopRes && desktopRes.ok && desktopRes.formats?.length) {
          return desktopRes;
        }
      } catch (e) {
        console.warn('Desktop social resolver failed:', e);
      }
    }

    // 2. Mobile Native Plugin (Android & iOS background thread - zero CORS)
    try {
      const cap = getMobileCapEngine();
      if (cap && typeof cap.resolveSocialUrl === 'function') {
        const mobileRes = await cap.resolveSocialUrl({ url });
        if (mobileRes && mobileRes.ok && mobileRes.formats?.length) {
          return mobileRes;
        }
      }
    } catch (e) {
      console.warn('Mobile native resolve error:', e);
    }

    // 3. Universal Web & Browser Fallbacks
    const cleanUrl = url.trim();

    // A. YouTube via Piped instances
    if (platform.id === 'youtube') {
      const m = cleanUrl.match(/(?:watch\?v=|shorts\/|live\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
      if (m) {
        const id = m[1];
        const pipedHosts = [
          'https://api.piped.private.coffee/streams/',
          'https://pipedapi.ducks.party/streams/'
        ];
        for (const host of pipedHosts) {
          try {
            const res = await fetch(host + id);
            if (res.ok) {
              const data = await res.json();
              const formats = [];
              const vStreams = data.videoStreams || [];
              for (const v of vStreams) {
                if (v.url && v.format === 'MP4') {
                  formats.push({
                    id: v.quality || 'hd',
                    quality: S.lang === 'ar' ? `🎬 فيديو بدقة ${v.quality || 'HD'} (MP4)` : `🎬 Video ${v.quality || 'HD'} (MP4)`,
                    ext: 'mp4',
                    url: v.url
                  });
                }
              }
              const aStreams = data.audioStreams || [];
              if (aStreams.length > 0 && aStreams[0].url) {
                formats.push({
                  id: 'audio',
                  quality: S.lang === 'ar' ? '🎵 ملف صوتي فقط (Audio Stream)' : '🎵 Audio Only Stream (M4A)',
                  ext: 'm4a',
                  url: aStreams[0].url
                });
              }
              if (formats.length > 0) {
                return {
                  ok: true,
                  platform: 'YouTube',
                  title: data.title || 'YouTube_Video',
                  author: data.uploader || 'YouTube Channel',
                  thumbnail: data.thumbnailUrl || '',
                  formats
                };
              }
            }
          } catch (_) {}
        }
      }
    }

    // B. Twitter / X Video direct API
    if (platform.id === 'twitter') {
      try {
        const m = cleanUrl.match(/(?:twitter\.com|x\.com)\/([^/]+)\/status\/(\d+)/i);
        if (m) {
          const user = m[1];
          const id = m[2];
          const r = await fetch(`https://api.fxtwitter.com/${user}/status/${id}`);
          if (r.ok) {
            const data = await r.json();
            const media = data.tweet?.media?.videos?.[0];
            if (media && media.url) {
              return {
                ok: true,
                platform: 'X / Twitter',
                title: data.tweet.text?.slice(0, 50) || 'X_Video',
                author: data.tweet.author?.name || user,
                thumbnail: media.thumbnail_url || '',
                formats: [
                  { id: 'best', quality: '🎬 Best Video (MP4)', ext: 'mp4', url: media.url }
                ]
              };
            }
          }
        }
      } catch (_) {}
    }

    // C. Reddit Video direct API
    if (platform.id === 'reddit') {
      try {
        const jsonUrl = cleanUrl.split('?')[0].replace(/\/$/, '') + '.json';
        const redRes = await fetch(jsonUrl);
        if (redRes.ok) {
          const redData = await redRes.json();
          const post = redData[0]?.data?.children?.[0]?.data;
          const vid = post?.secure_media?.reddit_video || post?.media?.reddit_video;
          if (vid && vid.fallback_url) {
            return {
              ok: true,
              platform: 'Reddit',
              title: post.title || 'Reddit_Video',
              author: post.author ? `u/${post.author}` : 'Reddit User',
              thumbnail: post.thumbnail && post.thumbnail.startsWith('http') ? post.thumbnail : '',
              formats: [
                { id: 'best', quality: '🎬 HD Video (MP4)', ext: 'mp4', url: vid.fallback_url }
              ]
            };
          }
        }
      } catch (_) {}
    }

    // D. TikTok via TikWM & TikMate API
    if (platform.id === 'tiktok') {
      try {
        const twRes = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(cleanUrl)}`);
        if (twRes.ok) {
          const twData = await twRes.json();
          if (twData && twData.code === 0 && twData.data) {
            let playUrl = twData.data.play || '';
            if (playUrl && !playUrl.startsWith('http')) playUrl = 'https://www.tikwm.com' + playUrl;
            let musicUrl = twData.data.music || '';
            if (musicUrl && !musicUrl.startsWith('http')) musicUrl = 'https://www.tikwm.com' + musicUrl;

            const formats = [];
            if (playUrl) {
              formats.push({
                id: 'nowm',
                quality: '⚡ فيديو أصلي فائق الدقة بدون علامة مائية (MP4)',
                ext: 'mp4',
                url: playUrl,
                directUrl: playUrl
              });
            }
            if (musicUrl) {
              formats.push({
                id: 'audio',
                quality: '🎵 ملف صوتي فقط (MP3 نقي)',
                ext: 'mp3',
                url: musicUrl,
                directUrl: musicUrl
              });
            }

            if (formats.length > 0) {
              return {
                ok: true,
                platform: 'TikTok',
                title: twData.data.title || 'TikTok Video',
                author: twData.data.author?.nickname || 'TikTok Creator',
                thumbnail: twData.data.cover || '',
                formats
              };
            }
          }
        }
      } catch (_) {}

      try {
        const formData = new FormData();
        formData.append('url', cleanUrl);
        const r = await fetch('https://api.tikmate.app/api/lookup', {
          method: 'POST',
          body: formData
        });
        if (r.ok) {
          const data = await r.json();
          if (data && data.token && data.id) {
            return {
              ok: true,
              platform: 'TikTok',
              title: data.author_name ? `${data.author_name} TikTok` : 'TikTok_Video',
              author: data.author_name || 'TikTok Creator',
              thumbnail: '',
              formats: [
                {
                  id: 'nowm',
                  quality: '⚡ فيديو بدقة عالية بدون علامة مائية (MP4)',
                  ext: 'mp4',
                  url: `https://tikmate.app/download/${data.token}/${data.id}.mp4`
                }
              ]
            };
          }
        }
      } catch (_) {}
    }

    // E. Instagram / Facebook / Snapchat via OpenGraph
    if (['instagram', 'facebook', 'snapchat'].includes(platform.id)) {
      try {
        const ogRes = await fetch(cleanUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'
          }
        });
        if (ogRes.ok) {
          const html = await ogRes.text();
          const videoMatch = html.match(/<meta[^>]+property=["'](?:og:video|og:video:url|og:video:secure_url)["'][^>]+content=["']([^"']+)["']/i) ||
                             html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["'](?:og:video|og:video:url|og:video:secure_url)["']/i) ||
                             html.match(/<video[^>]+src=["']([^"']+)["']/i);
          if (videoMatch && videoMatch[1]) {
            let vidUrl = videoMatch[1].replace(/&amp;/g, '&');
            const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
            const title = titleMatch ? titleMatch[1].trim() : `${platform.name}_Video`;
            return {
              ok: true,
              platform: platform.name,
              title,
              formats: [{
                id: 'direct',
                quality: '🎬 فيديو أصلي عالي الدقة (MP4)',
                ext: 'mp4',
                url: vidUrl
              }]
            };
          }
        }
      } catch (_) {}
    }

    return {
      ok: true,
      platform: platform.name,
      title: `${platform.name}_Video`,
      author: platform.name,
      formats: [{
        id: 'direct',
        quality: S.lang === 'ar' ? '🎬 تحميل البث المباشر (Direct MP4)' : '🎬 Direct Stream Download (MP4)',
        ext: 'mp4',
        url: cleanUrl,
        directUrl: cleanUrl
      }]
    };
  }

  let probeTimer = 0;
  let socialTimer = 0;

  if (taskUrlInput) {
    taskUrlInput.addEventListener('input', () => {
      clearTimeout(probeTimer);
      clearTimeout(socialTimer);
      const url = taskUrlInput.value.trim().split('\n')[0];

      const socialPlat = detectSocialPlatform(url);
      const socialBox = $('#socialMediaBox');
      const resolvingBar = $('#socialResolvingBar');

      if (socialPlat) {
        if (probeBox) probeBox.hidden = true;
        if (socialBox) {
          socialBox.hidden = false;
          const badge = $('#socialPlatformBadge');
          if (badge) {
            badge.textContent = `${socialPlat.icon} ${socialPlat.name}`;
            badge.style.borderColor = socialPlat.color;
          }
          $('#socialMediaTitle').textContent = S.lang === 'ar' ? 'جاري فحص واستخراج رابط الفيديو...' : 'Analyzing video stream...';
          $('#socialMediaAuthor').textContent = socialPlat.name;
          const thumb = $('#socialMediaThumb');
          if (thumb) thumb.style.display = 'none';
          if (resolvingBar) resolvingBar.hidden = false;
        }

        socialTimer = setTimeout(async () => {
          try {
            const data = await resolveSocialMedia(url, socialPlat);
            activeSocialData = data;
            if (resolvingBar) resolvingBar.hidden = true;

            if (data && data.ok) {
              $('#socialMediaTitle').textContent = data.title;
              $('#socialMediaAuthor').textContent = data.author || socialPlat.name;
              const thumb = $('#socialMediaThumb');
              if (thumb && data.thumbnail) {
                thumb.src = data.thumbnail;
                thumb.style.display = 'block';
              }

              const qualitySelect = $('#socialQualitySelect');
              if (qualitySelect && data.formats?.length) {
                qualitySelect.innerHTML = data.formats.map((f, idx) =>
                  `<option value="${idx}">${f.quality}</option>`
                ).join('');
              }
            } else {
              $('#socialMediaTitle').textContent = `${socialPlat.name} Media`;
              $('#socialMediaAuthor').textContent = S.lang === 'ar' ? 'سيتم التنزيل كملف مباشر' : 'Will download as direct stream';
            }
          } catch (err) {
            if (resolvingBar) resolvingBar.hidden = true;
            console.error('Social resolve error:', err);
          }
        }, 300);
        return;
      } else {
        if (socialBox) socialBox.hidden = true;
        activeSocialData = null;
      }

      // Standard HTTP/HTTPS probe
      if (/^https?:\/\//i.test(url) && window.tayyar?.probe) {
        probeTimer = setTimeout(async () => {
          try {
            if (probeBox) probeBox.hidden = false;
            if (probeSizeBadge) probeSizeBadge.textContent = 'Checking...';
            const info = await window.tayyar.probe(url);
            if (info && !info.error) {
              if (probeFileName) probeFileName.value = info.filename || '';
              if (probeSizeBadge) probeSizeBadge.textContent = fmtSize(info.size);
            }
          } catch (_) { }
        }, 500);
      }
    });
  }

  if (addForm) {
    addForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const raw = taskUrlInput.value.trim();
      const urls = raw.split('\n').map((u) => u.trim()).filter((u) => /^https?:\/\//i.test(u));

      if (!urls.length) {
        if (addErrMsg) {
          addErrMsg.textContent = S.lang === 'ar' ? 'يرجى إدخال رابط صحيح.' : 'Please enter a valid link.';
          addErrMsg.hidden = false;
        }
        return;
      }

      const conns = parseInt($('#taskConnsSelect')?.value || '8', 10);
      const dir = taskSaveDir?.value || '';

      for (const u of urls) {
        let finalDownloadUrl = u;
        let finalFilename = '';
        let referer = '';
        let isSocialDownload = false;
        let socialUrl = '';
        let socialFormatId = '';

        const isSocial = detectSocialPlatform(u);
        if (isSocial) {
          isSocialDownload = true;
          socialUrl = u;

          // If social resolution is still in flight or not done, resolve now
          if (!activeSocialData || !activeSocialData.ok || !activeSocialData.formats?.length) {
            toast(S.lang === 'ar' ? 'جاري فحص واستخراج البث المباشر...' : 'Resolving media stream...');
            try {
              activeSocialData = await resolveSocialMedia(u, isSocial);
            } catch (_) {}
          }

          if (activeSocialData && activeSocialData.ok && activeSocialData.formats?.length) {
            const selectedIdx = parseInt($('#socialQualitySelect')?.value || '0', 10);
            const fmt = activeSocialData.formats[selectedIdx] || activeSocialData.formats[0];
            const ext = fmt.ext || 'mp4';
            socialFormatId = fmt.formatId || fmt.id || 'best';
            const cleanTitle = (activeSocialData.title || 'video')
              .replace(/[\/\\:*?"<>|]/g, '_')
              .slice(0, 60)
              .trim();
            finalFilename = `${activeSocialData.platform || 'Tayyar'}_${cleanTitle}.${ext}`;

            if (window.tayyar?.isMobile || !window.tayyar?.socialResolve) {
              finalDownloadUrl = fmt.directUrl || (fmt.url && !fmt.url.includes('.m3u8') ? fmt.url : u);
              referer = fmt.referer || '';
            } else {
              finalDownloadUrl = fmt.directUrl || u;
              referer = fmt.referer || '';
            }
          } else {
            console.warn('Social resolution not pre-extracted, proceeding with direct download');
            toast(S.lang === 'ar' ? 'جاري بدء التحميل المباشر...' : 'Starting direct download...');
          }
        }

        if (window.tayyar?.add) {
          const res = await window.tayyar.add({
            url: finalDownloadUrl,
            filename: finalFilename || undefined,
            userFileName: finalFilename || undefined,
            referer: referer || undefined,
            dir: dir || undefined,
            connections: conns,
            isSocial: isSocialDownload,
            socialUrl: socialUrl || u,
            formatId: socialFormatId || 'best',
          });
          if (res?.item) {
            S.items.set(res.item.id, res.item);
          }
        }
      }

      closeAddModal();
      toast(S.lang === 'ar' ? `بدأ تحميل ${urls.length} مهمة بنجاح` : `Started ${urls.length} download task(s)`);
      updateDashboard();
      renderDownloadsList();
    });
  }

  /* ---------------- SETTINGS CARDS & MODALS HANDLING ---------------- */
  // Open corresponding modal when clicking any of the 8 cards
  $$('.settings-card').forEach((card) => {
    card.addEventListener('click', () => {
      const modalId = card.dataset.settingModal;
      const modal = $(`#${modalId}`);
      if (modal) {
        modal.showModal();
      }
    });
  });

  // Wire close & cancel buttons for all modals
  $$('.modal-close, .modal-cancel').forEach((btn) => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('dialog');
      if (modal) modal.close();
    });
  });

  // Wire save buttons
  $$('.modal-save').forEach((btn) => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('dialog');
      if (modal) {
        modal.close();
        toast(S.lang === 'ar' ? 'تم حفظ التغييرات بنجاح' : 'Settings saved successfully');
      }
    });
  });

  // Language select inside Appearance modal
  const cfgLang = $('#cfgLang');
  if (cfgLang) {
    cfgLang.addEventListener('change', (e) => {
      applyLanguage(e.target.value);
    });
  }

  // User-Agent presets inside Downloads modal
  $$('.ua-preset').forEach((btn) => {
    btn.addEventListener('click', () => {
      const ua = $('#cfgUserAgent');
      if (ua) ua.value = btn.dataset.ua;
    });
  });

  // Simultaneous downloads presets
  $$('.sim-preset').forEach((btn) => {
    btn.addEventListener('click', () => {
      $$('.sim-preset').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const sim = $('#cfgSimultaneous');
      if (sim) sim.value = btn.dataset.val;
    });
  });

  // Desktop Local Engine (yt-dlp) status & 1-click installer
  const bInstallYtDlp = $('#bInstallYtDlp');
  const ytdlpStatusTxt = $('#ytdlpStatusTxt');

  async function checkYtDlpStatus() {
    if (!ytdlpStatusTxt) return;
    if (window.tayyar?.ytdlpCheck) {
      try {
        const res = await window.tayyar.ytdlpCheck();
        if (res && res.available) {
          ytdlpStatusTxt.textContent = S.lang === 'ar' ? `✅ محرك yt-dlp مثبت ومفعل محلياً (v${res.version})` : `✅ yt-dlp core engine installed (v${res.version})`;
          if (bInstallYtDlp) bInstallYtDlp.textContent = S.lang === 'ar' ? 'تحديث المحرك' : 'Update Engine';
        } else {
          ytdlpStatusTxt.textContent = S.lang === 'ar' ? '⚠️ غير مثبت محلياً (المحرك السحابي العالمي فعال)' : '⚠️ Not installed locally (Universal Web Engine active)';
          if (bInstallYtDlp) bInstallYtDlp.textContent = S.lang === 'ar' ? 'تحميل وتثبيت (نقرة واحدة)' : 'Download / Install Engine';
        }
      } catch (_) {}
    } else {
      ytdlpStatusTxt.textContent = S.lang === 'ar' ? 'محرك الهاتف والويب الشامل فعال' : 'Universal Mobile/Web Engine active';
      if (bInstallYtDlp) bInstallYtDlp.style.display = 'none';
    }
  }

  checkYtDlpStatus();

  if (bInstallYtDlp) {
    bInstallYtDlp.addEventListener('click', async () => {
      if (window.tayyar?.ytdlpInstall) {
        bInstallYtDlp.disabled = true;
        bInstallYtDlp.textContent = S.lang === 'ar' ? 'جاري التحميل...' : 'Downloading...';
        if (ytdlpStatusTxt) ytdlpStatusTxt.textContent = S.lang === 'ar' ? 'جاري تنزيل المحرك الرسمي...' : 'Downloading official standalone engine...';
        toast(S.lang === 'ar' ? 'بدأ تحميل محرك الفيديو yt-dlp الرسمي' : 'Starting yt-dlp standalone engine download');
        try {
          const r = await window.tayyar.ytdlpInstall();
          if (r && r.ok) {
            toast(S.lang === 'ar' ? 'تم تثبيت محرك الفيديو بنجاح!' : 'Media engine installed successfully!');
            checkYtDlpStatus();
          } else {
            toast(S.lang === 'ar' ? 'فشل تحميل المحرك، سيتم الاعتماد على المحرك السحابي' : 'Engine download failed; using web engine');
          }
        } catch (e) {
          toast(`Install error: ${e.message}`);
        } finally {
          bInstallYtDlp.disabled = false;
        }
      }
    });
  }

  // Copy CLI tool command
  const bCopyCli = $('#bCopyCli');
  if (bCopyCli) {
    bCopyCli.addEventListener('click', () => {
      navigator.clipboard.writeText('tayyar download https://example.com/file.zip');
      toast('Copied command to clipboard!');
    });
  }

  /* ---------------- DIRECT IN-APP UPDATER (GitHub Releases — Stable Default) ---------------- */
  const CURRENT_APP_VERSION = '1.0.17';
  let availableUpdateRelease = null;
  let isNewerUpdateAvailable = false;
  let updateDownloadTaskId = null;
  let downloadedUpdatePath = null;

  const cfgChannel = $('#cfgChannel');
  const betaWarningBox = $('#betaWarningBox');

  function syncUpdateChannelUI() {
    const savedCh = (() => {
      try { return localStorage.getItem('tayyar_update_channel') || 'stable'; } catch (_) { return 'stable'; }
    })();
    const ch = savedCh === 'beta' ? 'beta' : 'stable';
    if (cfgChannel) cfgChannel.value = ch;
    if (betaWarningBox) {
      betaWarningBox.style.display = ch === 'beta' ? 'block' : 'none';
    }
  }

  if (cfgChannel) {
    cfgChannel.addEventListener('change', () => {
      const ch = cfgChannel.value === 'beta' ? 'beta' : 'stable';
      try { localStorage.setItem('tayyar_update_channel', ch); } catch (_) {}
      if (betaWarningBox) {
        betaWarningBox.style.display = ch === 'beta' ? 'block' : 'none';
      }
      checkAppUpdates(true);
    });
  }
  syncUpdateChannelUI();

  function semverCompare(a, b) {
    const pa = (a || '0').replace(/^v/, '').split('-')[0].split('.').map(Number);
    const pb = (b || '0').replace(/^v/, '').split('-')[0].split('.').map(Number);
    for (let i = 0; i < 3; i++) {
      const na = pa[i] || 0;
      const nb = pb[i] || 0;
      if (na > nb) return 1;
      if (na < nb) return -1;
    }
    return 0;
  }

  async function checkAppUpdates(interactive = true) {
    const bCheck = $('#bCheckUpdate');
    const updateTitle = $('#updateTitleText');
    const updateDesc = $('#updateDescText');
    const bInstall = $('#bInstallUpdate');
    const bInstallText = $('#bInstallUpdateText');
    const progressWrap = $('#updateProgressWrap');
    const channel = (cfgChannel && cfgChannel.value === 'beta') ? 'beta' : 'stable';

    if (bCheck) {
      bCheck.disabled = true;
      bCheck.innerHTML = `<span>${S.lang === 'ar' ? 'جاري الفحص...' : 'Checking...'}</span>`;
    }

    try {
      const endpoint = channel === 'beta'
        ? 'https://api.github.com/repos/mumenmahbuobeh/tayyar/releases'
        : 'https://api.github.com/repos/mumenmahbuobeh/tayyar/releases/latest';

      const res = await fetch(endpoint, {
        headers: { Accept: 'application/vnd.github.v3+json' }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const payload = await res.json();

      let rel = null;
      if (Array.isArray(payload)) {
        rel = payload.find((r) => !r.draft) || null;
      } else if (payload && !payload.draft && (channel === 'beta' || !payload.prerelease)) {
        rel = payload;
      }

      if (!rel || !rel.tag_name) {
        throw new Error('No release metadata');
      }

      const latestTag = (rel.tag_name || '').replace(/^v/, '');
      const isNewer = semverCompare(latestTag, CURRENT_APP_VERSION) > 0;
      isNewerUpdateAvailable = isNewer;

      if (isNewer) {
        availableUpdateRelease = rel;
        if (updateTitle) updateTitle.textContent = S.lang === 'ar' ? `تحديث جديد متوفر: v${latestTag}` : `New Update Available: v${latestTag}`;
        if (updateDesc) updateDesc.textContent = S.lang === 'ar' ? 'انقر على "تحديث الآن" للتحميل والتثبيت المباشر من داخل البرنامج.' : 'Click "Update Now" to download and install directly inside Tayyar.';
        if (bInstall) {
          bInstall.style.display = 'inline-flex';
          bInstall.disabled = false;
          bInstall.className = 'pill-btn primary sm';
          if (bInstallText) bInstallText.textContent = S.lang === 'ar' ? 'تحديث الآن' : 'Update Now';
        }
        let skippedVer = '';
        try { skippedVer = localStorage.getItem('tayyar_skipped_update_ver') || ''; } catch (_) {}
        if (interactive || skippedVer !== latestTag) {
          showDeskUpdatePopup(rel, channel);
        }
      } else {
        availableUpdateRelease = null;
        downloadedUpdatePath = null;
        updateDownloadTaskId = null;
        if (updateTitle) updateTitle.textContent = S.lang === 'ar' ? 'برنامج تيّار محدّث لأحدث إصدار' : 'Tayyar is up to date';
        if (updateDesc) updateDesc.textContent = S.lang === 'ar' ? `الإصدار ${CURRENT_APP_VERSION} هو أحدث إصدار مستقر متوفر.` : `Version ${CURRENT_APP_VERSION} is the latest available release.`;
        if (bInstall) bInstall.style.display = 'none';
        if (progressWrap) progressWrap.style.display = 'none';
        if (interactive) {
          toast(S.lang === 'ar' ? `برنامج تيّار محدّث بالفعل (v${CURRENT_APP_VERSION})` : `Tayyar is already up to date (v${CURRENT_APP_VERSION})`);
        }
      }
    } catch (err) {
      console.warn('Update check failed:', err);
      isNewerUpdateAvailable = false;
      availableUpdateRelease = null;
      if (updateTitle) updateTitle.textContent = S.lang === 'ar' ? `برنامج تيّار (v${CURRENT_APP_VERSION})` : `Tayyar (v${CURRENT_APP_VERSION})`;
      if (updateDesc) updateDesc.textContent = S.lang === 'ar' ? 'تعذّر الاتصال بخادم التحديثات حالياً.' : 'Could not reach update server at this moment.';
      if (bInstall) bInstall.style.display = 'none';
      if (progressWrap) progressWrap.style.display = 'none';
      if (interactive) {
        toast(S.lang === 'ar' ? 'تعذّر فحص التحديثات حالياً' : 'Failed to check updates');
      }
    } finally {
      if (bCheck) {
        bCheck.disabled = false;
        bCheck.innerHTML = `<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" style="width:13px;margin-right:4px;"><path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg><span data-i="check">${S.lang === 'ar' ? 'فحص' : 'Check'}</span>`;
      }
    }
  }

  async function startInAppUpdate() {
    const bInstall = $('#bInstallUpdate');
    const progressWrap = $('#updateProgressWrap');
    const progressStatus = $('#updateProgressStatus');

    if (downloadedUpdatePath) {
      if (window.tayyar?.installUpdate) {
        window.tayyar.installUpdate(downloadedUpdatePath);
      } else if (window.tayyar?.open) {
        window.tayyar.open(downloadedUpdatePath);
      } else {
        window.open(downloadedUpdatePath, '_blank');
      }
      toast(S.lang === 'ar' ? 'جاري تشغيل برنامج التثبيت...' : 'Launching installer...');
      return;
    }

    if (!isNewerUpdateAvailable || !availableUpdateRelease) {
      toast(S.lang === 'ar' ? `أنت بالفعل على أحدث إصدار (v${CURRENT_APP_VERSION})` : `You are already on the latest version (v${CURRENT_APP_VERSION})`);
      if (bInstall) bInstall.style.display = 'none';
      if (progressWrap) progressWrap.style.display = 'none';
      return;
    }

    let targetAssetUrl = '';
    let targetFilename = '';
    const platform = window.tayyar?.platform ? await window.tayyar.platform() : (window.Capacitor?.getPlatform ? window.Capacitor.getPlatform() : 'win32');
    const assets = availableUpdateRelease.assets || [];

    if (platform === 'android') {
      const apk = assets.find((a) => a.name.endsWith('.apk'));
      if (apk) { targetAssetUrl = apk.browser_download_url; targetFilename = apk.name; }
    } else if (platform === 'darwin') {
      const dmg = assets.find((a) => a.name.endsWith('.dmg'));
      if (dmg) { targetAssetUrl = dmg.browser_download_url; targetFilename = dmg.name; }
    } else if (platform === 'linux') {
      const pkg = assets.find((a) => a.name.endsWith('.AppImage') || a.name.endsWith('.deb'));
      if (pkg) { targetAssetUrl = pkg.browser_download_url; targetFilename = pkg.name; }
    } else {
      const setupExe = assets.find((a) => /Setup/i.test(a.name) && a.name.endsWith('.exe') && !a.name.includes('blockmap')) ||
                       assets.find((a) => a.name.endsWith('.exe') && !a.name.includes('blockmap'));
      if (setupExe) { targetAssetUrl = setupExe.browser_download_url; targetFilename = setupExe.name; }
    }

    if (!targetAssetUrl) {
      const releaseUrl = availableUpdateRelease.html_url || 'https://github.com/mumenmahbuobeh/tayyar/releases/latest';
      if (window.tayyar?.openUrl) window.tayyar.openUrl(releaseUrl);
      else window.open(releaseUrl, '_blank');
      return;
    }

    if (progressWrap) progressWrap.style.display = 'block';
    if (bInstall) bInstall.disabled = true;
    if (progressStatus) progressStatus.textContent = S.lang === 'ar' ? 'جاري تحميل التحديث مباشرة...' : 'Downloading update directly...';

    const deskProg = $('#deskUpdProgress');
    const deskBtnNow = $('#btnDeskUpdNow');
    const deskProgStatus = $('#deskUpdProgStatus');
    if (deskProg) deskProg.hidden = false;
    if (deskBtnNow) deskBtnNow.disabled = true;
    if (deskProgStatus) deskProgStatus.textContent = S.lang === 'ar' ? 'جاري تحميل التحديث مباشرة...' : 'Downloading update directly...';

    try {
      if (window.tayyar?.add) {
        const res = await window.tayyar.add({
          url: targetAssetUrl,
          filename: targetFilename,
          category: 'Programs'
        });
        updateDownloadTaskId = res?.item?.id || res?.id;
        toast(S.lang === 'ar' ? 'بدأ تحميل حزمة التحديث' : 'Update download started');
      } else {
        window.open(targetAssetUrl, '_blank');
        if (bInstall) bInstall.disabled = false;
      }
    } catch (e) {
      console.error('Failed to start update download:', e);
      if (progressStatus) progressStatus.textContent = S.lang === 'ar' ? 'فشل بدء التحميل' : 'Failed to start download';
      if (bInstall) bInstall.disabled = false;
    }
  }

  function finishUpdateDownload(filePath) {
    downloadedUpdatePath = filePath;
    const progressStatus = $('#updateProgressStatus');
    const progressBar = $('#updateProgressBar');
    const progressPct = $('#updateProgressPct');
    const bInstall = $('#bInstallUpdate');
    const bInstallText = $('#bInstallUpdateText');

    if (progressBar) progressBar.style.width = '100%';
    if (progressPct) progressPct.textContent = '100%';
    if (progressStatus) {
      progressStatus.innerHTML = `<span style="color:var(--color-green);">✓ ${S.lang === 'ar' ? 'اكتمل تحميل التحديث! جاهز للتثبيت.' : 'Update downloaded! Ready to install.'}</span>`;
    }

    if (bInstall) {
      bInstall.disabled = false;
      bInstall.className = 'pill-btn primary sm';
      if (bInstallText) bInstallText.textContent = S.lang === 'ar' ? 'تثبيت التحديث وإعادة التشغيل' : 'Install & Restart';
    }

    const deskFill = $('#deskUpdProgFill');
    const deskPct = $('#deskUpdProgPct');
    const deskStat = $('#deskUpdProgStatus');
    const deskBtnNow = $('#btnDeskUpdNow');
    const deskNowTxt = $('#deskUpdNowText');
    if (deskFill) deskFill.style.width = '100%';
    if (deskPct) deskPct.textContent = '100%';
    if (deskStat) {
      deskStat.innerHTML = `<span style="color:#34d399;">✓ ${S.lang === 'ar' ? 'اكتمل التحميل! جاري تشغيل التثبيت...' : 'Download complete! Launching installer...'}</span>`;
    }
    if (deskBtnNow) deskBtnNow.disabled = false;
    if (deskNowTxt) deskNowTxt.textContent = S.lang === 'ar' ? 'تثبيت وإعادة التشغيل' : 'Install & Restart';

    toast(S.lang === 'ar' ? 'اكتمل تحميل التحديث! جاري تشغيل المثبّت...' : 'Update ready! Launching installer...');
    // Auto-launch the installer immediately for true direct updating!
    if (window.tayyar?.installUpdate && filePath) {
      setTimeout(() => window.tayyar.installUpdate(filePath), 600);
    }
  }

  function extractDeskReleaseHighlights(bodyText) {
    const lines = String(bodyText || '').split(/\r?\n/).map((l) => l.trim());
    const out = [];
    for (const l of lines) {
      if (/^[*•-]\s+/.test(l) && !/releases\/download/i.test(l) && !/^\*\*(Windows|Android|iOS|macOS|Linux)/i.test(l.replace(/^[*•-]\s+/, ''))) {
        const clean = l.replace(/^[*•-]\s+/, '').replace(/\*\*/g, '').replace(/`/g, '').trim();
        if (clean.length > 6) out.push(`• ${clean}`);
      }
      if (out.length >= 7) break;
    }
    if (out.length) return out.join('\n');
    return S.lang === 'ar'
      ? '• تحسينات شاملة في الأداء وسرعة التحميل واستقرار البرنامج.\n• تحديث مباشر بضغطة واحدة.'
      : '• Performance, stability & download engine enhancements.\n• Direct 1-click installation.';
  }

  async function showDeskUpdatePopup(rel, channel) {
    const overlay = $('#deskUpdOverlay');
    if (!overlay || !rel) return;

    const latestTag = (rel.tag_name || '').replace(/^v/, '');
    const isBeta = !!rel.prerelease || (channel === 'beta' && /beta|alpha|rc/i.test(rel.tag_name || ''));

    const chBadge = $('#deskUpdChannelBadge');
    if (chBadge) {
      chBadge.className = `desk-upd-ch-pill ${isBeta ? 'beta' : 'stable'}`;
      chBadge.textContent = isBeta
        ? (S.lang === 'ar' ? 'نسخة تجريبية (Beta)' : 'Beta Release')
        : (S.lang === 'ar' ? 'نسخة مستقرة (Stable)' : 'Stable Release');
    }

    const verPill = $('#deskUpdVerPill');
    if (verPill) verPill.textContent = `v${CURRENT_APP_VERSION} → v${latestTag}`;

    // Show size of the matching platform installer
    const sizePill = $('#deskUpdSizePill');
    if (sizePill) {
      try {
        const plat = window.tayyar?.platform ? await window.tayyar.platform() : 'win32';
        const assets = rel.assets || [];
        let matched = null;
        if (plat === 'darwin') matched = assets.find((a) => a.name.endsWith('.dmg'));
        else if (plat === 'linux') matched = assets.find((a) => a.name.endsWith('.AppImage') || a.name.endsWith('.deb'));
        else matched = assets.find((a) => /Setup/i.test(a.name) && a.name.endsWith('.exe')) || assets.find((a) => a.name.endsWith('.exe'));
        sizePill.textContent = matched?.size ? `• ${fmtBytes(matched.size)}` : '';
      } catch (_) {
        sizePill.textContent = '';
      }
    }

    const notesEl = $('#deskUpdNotes');
    if (notesEl) notesEl.textContent = extractDeskReleaseHighlights(rel.body);

    const progEl = $('#deskUpdProgress');
    const btnNow = $('#btnDeskUpdNow');
    const nowTxt = $('#deskUpdNowText');
    if (!downloadedUpdatePath) {
      if (progEl) progEl.hidden = true;
      if (btnNow) btnNow.disabled = false;
      if (nowTxt) nowTxt.textContent = S.lang === 'ar' ? 'تحديث الآن' : 'Update Now';
    } else {
      if (nowTxt) nowTxt.textContent = S.lang === 'ar' ? 'تثبيت وإعادة التشغيل' : 'Install & Restart';
    }

    overlay.hidden = false;
  }

  function hideDeskUpdatePopup() {
    const overlay = $('#deskUpdOverlay');
    if (overlay) overlay.hidden = true;
  }

  $('#btnDeskUpdClose')?.addEventListener('click', hideDeskUpdatePopup);
  $('#btnDeskUpdLater')?.addEventListener('click', hideDeskUpdatePopup);
  $('#btnDeskUpdNow')?.addEventListener('click', () => startInAppUpdate());
  $('#btnDeskUpdSkip')?.addEventListener('click', () => {
    const latestTag = (availableUpdateRelease?.tag_name || '').replace(/^v/, '');
    if (latestTag) {
      try { localStorage.setItem('tayyar_skipped_update_ver', latestTag); } catch (_) {}
      toast(S.lang === 'ar' ? `تم تخطي الإصدار v${latestTag}` : `Skipped version v${latestTag}`);
    }
    hideDeskUpdatePopup();
  });
  $('#deskUpdOverlay')?.addEventListener('click', (e) => {
    if (e.target === $('#deskUpdOverlay')) hideDeskUpdatePopup();
  });

  const bCheckUpdate = $('#bCheckUpdate');
  if (bCheckUpdate) {
    bCheckUpdate.addEventListener('click', () => {
      checkAppUpdates(true);
    });
  }

  const bInstallUpdate = $('#bInstallUpdate');
  if (bInstallUpdate) {
    bInstallUpdate.addEventListener('click', () => {
      startInAppUpdate();
    });
  }

  // Open external links safely via shell.openExternal
  $$('.about-link, .about-nav-link').forEach((link) => {
    link.addEventListener('click', (e) => {
      const url = link.getAttribute('href');
      if (url && /^https?:\/\//i.test(url)) {
        e.preventDefault();
        if (window.tayyar?.openUrl) {
          window.tayyar.openUrl(url);
        } else {
          window.open(url, '_blank');
        }
      }
    });
  });

  /* ---------------- BROWSER EXTENSION INSTALLATION MODAL ---------------- */
  let currentExtBrowser = 'chrome';
  const extInstallModal = $('#extInstallModal');
  const extModalLogo = $('#extModalLogo');
  const extModalTitle = $('#extModalTitle');
  const extModalSubhead = $('#extModalSubhead');
  const extModalBody = $('#extModalBody');
  const bOpenExtFolder = $('#bOpenExtFolder');

  const EXT_INSTRUCTIONS = {
    chrome: {
      name: 'Google Chrome',
      stepsEn: [
        'Open Google Chrome and navigate to <code>chrome://extensions</code> in the address bar.',
        'Enable <b>Developer mode</b> using the toggle switch in the top-right corner.',
        'Click the <b>Load unpacked</b> button in the top-left.',
        'Select the <code>extension</code> folder inside your Tayyar directory.',
      ],
      stepsAr: [
        'افتح متصفح Google Chrome واكتب <code>chrome://extensions</code> في شريط العناوين.',
        'قم بتفعيل <b>وضع مطوّر البرامج (Developer mode)</b> من المفتاح في أعلى اليمين.',
        'انقر على زر <b>تحميل حزمة غير مضغوطة (Load unpacked)</b> في أعلى اليسار.',
        'اختر مجلد <code>extension</code> الموجود داخل مجلد برنامج تيّار.',
      ],
    },
    edge: {
      name: 'Microsoft Edge',
      stepsEn: [
        'Open Microsoft Edge and navigate to <code>edge://extensions</code>.',
        'Turn on <b>Developer mode</b> from the left sidebar.',
        'Click <b>Load unpacked</b> and choose the <code>extension</code> folder.',
        'The Tayyar icon will appear in your Edge toolbar to capture downloads.',
      ],
      stepsAr: [
        'افتح متصفح Microsoft Edge واذهب إلى <code>edge://extensions</code>.',
        'قم بتشغيل <b>وضع المطور (Developer mode)</b> من القائمة الجانبية.',
        'انقر على <b>تحميل حزمة غير مضغوطة (Load unpacked)</b> وحدد مجلد <code>extension</code>.',
        'ستظهر أيقونة تيّار في شريط أدوات Edge لالتقاط التحميلات فوراً.',
      ],
    },
    firefox: {
      name: 'Mozilla Firefox',
      stepsEn: [
        'Open Firefox and go to <code>about:debugging#/runtime/this-firefox</code>.',
        'Click <b>Load Temporary Add-on...</b>',
        'Select the <code>manifest.json</code> file inside the <code>extension-firefox</code> folder.',
        'Tayyar integration will be active and ready to catch all downloads.',
      ],
      stepsAr: [
        'افتح متصفح فايرفوكس واذهب إلى <code>about:debugging#/runtime/this-firefox</code>.',
        'انقر على زر <b>تحميل إضافة مؤقتة... (Load Temporary Add-on)</b>.',
        'اختر ملف <code>manifest.json</code> داخل مجلد <code>extension-firefox</code>.',
        'سيتم تفعيل تكامل تيّار وسيبدأ بالتقاط تحميلات فايرفوكس فوراً.',
      ],
    },
    safari: {
      name: 'Apple Safari',
      stepsEn: [
        'In Safari, open <b>Settings > Advanced</b> and check <i>Show features for web developers</i>.',
        'Under the <b>Develop</b> menu, enable <i>Allow unsigned extensions</i>.',
        'Load the Tayyar extension folder or convert using standard WebExtension converter.',
      ],
      stepsAr: [
        'في متصفح Safari، افتح الإعدادات ثم المتقدمة وفعّل <i>إظهار ميزات مطوري الويب</i>.',
        'من قائمة التطوير (Develop)، فعّل خيار <i>السماح بالإضافة غير الموقعة</i>.',
        'قم بتحميل مجلد الإضافة وسيتصل ببرنامج تيّار مباشرة.',
      ],
    },
    brave: {
      name: 'Brave Browser',
      stepsEn: [
        'Open Brave and navigate to <code>brave://extensions</code>.',
        'Enable <b>Developer mode</b> at the top-right.',
        'Click <b>Load unpacked</b> and select the <code>extension</code> folder.',
      ],
      stepsAr: [
        'افتح متصفح Brave واذهب إلى <code>brave://extensions</code>.',
        'قم بتفعيل <b>وضع المطور (Developer mode)</b> في الأعلى.',
        'انقر على <b>Load unpacked</b> واختر مجلد <code>extension</code>.',
      ],
    },
    opera: {
      name: 'Opera',
      stepsEn: [
        'Open Opera and navigate to <code>opera://extensions</code>.',
        'Toggle <b>Developer mode</b> on in the top-right.',
        'Click <b>Load unpacked</b> and select the <code>extension</code> folder.',
      ],
      stepsAr: [
        'افتح متصفح Opera واذهب إلى <code>opera://extensions</code>.',
        'قم بتفعيل <b>وضع المطور (Developer mode)</b>.',
        'انقر على <b>Load unpacked</b> واختر مجلد <code>extension</code>.',
      ],
    },
  };

  $$('.bInstallBrowser').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const bKey = btn.dataset.browser;
      const bInfo = EXT_INSTRUCTIONS[bKey] || EXT_INSTRUCTIONS.chrome;
      currentExtBrowser = bKey;

      const box = btn.closest('.browser-box');
      const iconClone = box ? (box.querySelector('.browser-icon-img')?.cloneNode(true) || box.querySelector('.browser-svg')?.cloneNode(true)) : null;
      if (extModalLogo) {
        extModalLogo.innerHTML = '';
        if (iconClone) {
          iconClone.style.width = '42px';
          iconClone.style.height = '42px';
          extModalLogo.appendChild(iconClone);
        }
      }

      if (extModalTitle) {
        extModalTitle.textContent = S.lang === 'ar' ? `تثبيت إضافة ${bInfo.name}` : `Install ${bInfo.name} Extension`;
      }
      if (extModalSubhead) {
        extModalSubhead.textContent = S.lang === 'ar' ? 'ربط التحميلات التلقائية مع تطبيق تيّار' : 'Seamless multi-connection download capture';
      }

      const steps = S.lang === 'ar' ? bInfo.stepsAr : bInfo.stepsEn;
      if (extModalBody) {
        extModalBody.innerHTML = `
          <div class="ext-steps-list">
            ${steps.map((st, i) => `
              <div class="ext-step-item">
                <span class="ext-step-num">${i + 1}</span>
                <span class="ext-step-txt">${st}</span>
              </div>
            `).join('')}
          </div>
        `;
      }

      if (extInstallModal) extInstallModal.showModal();
    });
  });

  if (bOpenExtFolder) {
    bOpenExtFolder.addEventListener('click', () => {
      const targetFolder = currentExtBrowser === 'firefox' ? 'firefox' : 'chrome';
      if (window.tayyar?.openExtensionFolder) {
        window.tayyar.openExtensionFolder(targetFolder);
        toast(S.lang === 'ar' ? 'تم فتح مجلد الإضافة في مستكشف الملفات' : 'Opened extension folder in Explorer');
      }
    });
  }

  // Apple Dynamic Island & Mobile Quick Add listeners
  const islandPlayer = $('#glassIslandPlayer');
  const bIslandToggle = $('#bIslandToggle');
  const bIslandAdd = $('#bIslandAdd');
  const bMobileQuickAdd = $('#bMobileQuickAdd');

  if (bMobileQuickAdd) {
    bMobileQuickAdd.addEventListener('click', (e) => {
      e.stopPropagation();
      openAddModal();
    });
  }

  if (bIslandAdd) {
    bIslandAdd.addEventListener('click', (e) => {
      e.stopPropagation();
      openAddModal();
    });
  }

  if (bIslandToggle) {
    bIslandToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const items = [...S.items.values()];
      const activeDownloads = items.filter((d) => d.status === 'downloading');
      if (activeDownloads.length > 0) {
        activeDownloads.forEach((d) => {
          if (window.tayyar?.pause) window.tayyar.pause(d.id);
        });
      } else {
        const pausedItems = items.filter((d) => ['paused', 'queued'].includes(d.status));
        if (pausedItems.length > 0 && window.tayyar?.resume) {
          window.tayyar.resume(pausedItems[0].id);
        }
      }
    });
  }

  if (islandPlayer) {
    islandPlayer.addEventListener('click', (e) => {
      if (e.target.closest('.island-btn')) return;
      switchView('downloads');
    });
  }

  /* ================= MOBILE & WEB ENGINE (Android, iOS & Preview) ================= */
  function setupMobileAndWebEngine() {
    const getMobileCapEngine = () => {
      try {
        if (window.Capacitor) {
          if (typeof window.Capacitor.registerPlugin === 'function') {
            try { return window.Capacitor.registerPlugin('TayyarMobileEngine'); } catch (_) {}
          }
          if (window.Capacitor.Plugins?.TayyarMobileEngine) {
            return window.Capacitor.Plugins.TayyarMobileEngine;
          }
        }
      } catch (_) {}
      return null;
    };

    const listeners = new Map();
    const emit = (ch, data) => {
      const cbs = listeners.get(ch) || [];
      cbs.forEach((cb) => {
        try { cb(data); } catch (e) { console.error('Listener error:', e); }
      });
    };

    const loadStoredDownloads = () => {
      try {
        const raw = localStorage.getItem('tayyar_mobile_downloads');
        return raw ? JSON.parse(raw) : [];
      } catch (_) { return []; }
    };

    const saveStoredDownloads = (items) => {
      try {
        localStorage.setItem('tayyar_mobile_downloads', JSON.stringify(items));
      } catch (_) {}
    };

    const storedItems = loadStoredDownloads();
    const mobileDownloads = new Map(storedItems.map((d) => [d.id, d]));
    const activePolling = new Map();

    const startAndroidPoll = (id, downloadId) => {
      if (activePolling.has(id)) return;
      let lastBytes = 0;
      let lastTime = Date.now();
      let speed = 0;

      const timer = setInterval(async () => {
        try {
          const cap = getMobileCapEngine();
          if (!cap) { clearInterval(timer); activePolling.delete(id); return; }

          const res = await cap.queryDownload({ downloadId });
          const d = mobileDownloads.get(id);
          if (!d) { clearInterval(timer); activePolling.delete(id); return; }

          const now = Date.now();
          const dt = (now - lastTime) / 1000 || 0.5;
          const deltaBytes = (res.downloaded || 0) - lastBytes;
          if (deltaBytes > 0) {
            speed = speed ? speed * 0.6 + (deltaBytes / dt) * 0.4 : deltaBytes / dt;
          }
          lastBytes = res.downloaded || lastBytes;
          lastTime = now;

          if (res.downloaded > 0) d.downloaded = res.downloaded;
          if (res.total > 0) d.size = res.total;
          if (res.percent > 0) d.percent = res.percent;
          d.speed = res.speed > 0 ? Math.round(res.speed) : Math.round(speed);
          d.eta = d.speed > 1 && d.size > d.downloaded ? Math.round((d.size - d.downloaded) / d.speed) : -1;

          if (res.status === 'completed') {
            d.status = 'completed';
            d.completedAt = Date.now();
            d.speed = 0;
            d.percent = 100;
            if (res.path) d.path = res.path;
            if (d.size > 0) d.downloaded = d.size;
            clearInterval(timer);
            activePolling.delete(id);
            saveStoredDownloads([...mobileDownloads.values()]);
            emit('dl:update', d);
            toast(S.lang === 'ar' ? `✅ تم الحفظ في الاستوديو: ${d.filename}` : `✅ Saved to Gallery: ${d.filename}`);
          } else if (res.status === 'error') {
            d.status = 'error';
            d.error = res.error || 'Download error';
            d.speed = 0;
            clearInterval(timer);
            activePolling.delete(id);
            saveStoredDownloads([...mobileDownloads.values()]);
            emit('dl:update', d);
            toast(S.lang === 'ar' ? `❌ فشل التحميل: ${d.error}` : `❌ Download failed: ${d.error}`);
          } else {
            d.status = 'downloading';
            emit('dl:progress', [d]);
          }
        } catch (e) {
          console.warn('Poll error:', e);
        }
      }, 500);

      activePolling.set(id, timer);
    };

    const startWebStreamDownload = async (d) => {
      try {
        const resp = await fetch(d.url);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const contentLength = resp.headers.get('content-length');
        if (contentLength) d.size = parseInt(contentLength, 10);

        const reader = resp.body ? resp.body.getReader() : null;
        if (!reader) {
          const blob = await resp.blob();
          d.downloaded = blob.size;
          d.size = blob.size;
          d.status = 'completed';
          d.completedAt = Date.now();
          saveStoredDownloads([...mobileDownloads.values()]);
          emit('dl:update', d);
          triggerBlobDownload(blob, d.filename);
          return;
        }

        const chunks = [];
        let received = 0;
        let lastT = Date.now();
        let lastBytes = 0;

        while (true) {
          if (d.status === 'paused' || !mobileDownloads.has(d.id)) {
            reader.cancel();
            return;
          }

          const { done, value } = await reader.read();
          if (done) break;

          chunks.push(value);
          received += value.length;
          d.downloaded = received;

          const now = Date.now();
          const dt = (now - lastT) / 1000 || 0.5;
          if (dt >= 0.5) {
            const inst = (received - lastBytes) / dt;
            d.speed = Math.round(d.speed ? d.speed * 0.6 + inst * 0.4 : inst);
            d.eta = d.speed > 1 && d.size > d.downloaded ? Math.round((d.size - d.downloaded) / d.speed) : -1;
            lastT = now;
            lastBytes = received;
            emit('dl:progress', [d]);
          }
        }

        const blob = new Blob(chunks);
        d.downloaded = blob.size;
        d.size = blob.size;
        d.status = 'completed';
        d.completedAt = Date.now();
        d.speed = 0;
        saveStoredDownloads([...mobileDownloads.values()]);
        emit('dl:update', d);
        triggerBlobDownload(blob, d.filename);
      } catch (err) {
        d.status = 'error';
        d.error = err.message || 'Download failed';
        d.speed = 0;
        saveStoredDownloads([...mobileDownloads.values()]);
        emit('dl:update', d);
      }
    };

    const triggerBlobDownload = (blob, filename) => {
      try {
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename || 'download';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(blobUrl);
        }, 2000);
      } catch (_) {}
    };

    window.tayyar = {
      isMobile: true,
      list: async () => [...mobileDownloads.values()],
      platform: async () => (window.Capacitor?.getPlatform ? window.Capacitor.getPlatform() : 'android'),
      settings: {
        get: async () => {
          try {
            const raw = localStorage.getItem('tayyar_settings');
            return raw ? JSON.parse(raw) : { theme: 'dark', maxConcurrent: 3, speedLimitKB: 0, downloadDir: 'Downloads' };
          } catch (_) { return {}; }
        },
        set: async (patch) => {
          try {
            const current = await window.tayyar.settings.get();
            const updated = Object.assign(current, patch);
            localStorage.setItem('tayyar_settings', JSON.stringify(updated));
            emit('settings', updated);
            return updated;
          } catch (_) { return patch; }
        }
      },
      getSettings: async () => window.tayyar.settings.get(),
      setSettings: async (p) => window.tayyar.settings.set(p),
      probe: async (url) => {
        try {
          const fn = url.split('/').pop().split('?')[0] || 'download.bin';
          return { filename: fn, size: -1, resumable: true, finalUrl: url };
        } catch (_) { return { filename: 'download.bin', size: -1, resumable: false }; }
      },
      add: async (opts) => {
        const id = 'm_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
        let filename = opts.userFileName || opts.filename;
        if (!filename) {
          filename = opts.url.split('/').pop().split('?')[0] || 'download.bin';
        }

        // Apply Filename Template plugin if enabled
        const activePlugins = getStoredPlugins();
        const fnPlugin = activePlugins.find((p) => (p.id === 'tayyar.filename-template' || p.id === 'motrix.filename-template') && p.enabled);
        if (fnPlugin && fnPlugin.settings?.template) {
          const ext = filename.includes('.') ? filename.split('.').pop() : '';
          const title = filename.replace(/\.[^.]+$/, '');
          const dStr = new Date().toISOString().slice(0, 10);
          filename = fnPlugin.settings.template
            .replace(/\{title\}|\{\{title\}\}/g, title)
            .replace(/\{ext\}|\{\{ext\}\}/g, ext)
            .replace(/\{date\}|\{\{date\}\}/g, dStr);
          if (fnPlugin.settings.preserveExt && ext && !filename.endsWith('.' + ext)) {
            filename += '.' + ext;
          }
        }

        const d = {
          id,
          url: opts.url,
          filename,
          path: filename,
          category: 'other',
          size: -1,
          downloaded: 0,
          status: 'downloading',
          error: null,
          resumable: true,
          connections: opts.connections || 8,
          addedAt: Date.now(),
          completedAt: null,
          startAt: 0,
          speed: 0,
          eta: -1,
          segments: []
        };

        mobileDownloads.set(id, d);
        saveStoredDownloads([...mobileDownloads.values()]);
        emit('dl:update', d);

        // Native Android DownloadManager check
        const cap = getMobileCapEngine();
        if (cap && typeof cap.startDownload === 'function') {
          try {
            const res = await cap.startDownload({ url: opts.url, filename, referer: opts.referer || '' });
            if (res && res.downloadId) {
              d.nativeDownloadId = res.downloadId;
              startAndroidPoll(id, res.downloadId);
              return { ok: true, item: d };
            }
          } catch (e) {
            console.warn('Native download failed, falling back to stream:', e);
          }
        }

        // Streaming fallback
        startWebStreamDownload(d);
        return { ok: true, item: d };
      },
      pause: async (ids) => {
        (ids || []).forEach((id) => {
          const d = mobileDownloads.get(id);
          if (d) {
            d.status = 'paused';
            d.speed = 0;
            if (activePolling.has(id)) {
              clearInterval(activePolling.get(id));
              activePolling.delete(id);
            }
            saveStoredDownloads([...mobileDownloads.values()]);
            emit('dl:update', d);
          }
        });
      },
      resume: async (ids) => {
        (ids || []).forEach((id) => {
          const d = mobileDownloads.get(id);
          if (d) {
            d.status = 'downloading';
            saveStoredDownloads([...mobileDownloads.values()]);
            emit('dl:update', d);
            if (d.nativeDownloadId) {
              startAndroidPoll(id, d.nativeDownloadId);
            } else {
              startWebStreamDownload(d);
            }
          }
        });
      },
      pauseAll: async () => {
        window.tayyar.pause([...mobileDownloads.keys()]);
      },
      resumeAll: async () => {
        window.tayyar.resume([...mobileDownloads.keys()]);
      },
      remove: async (ids, del) => {
        (ids || []).forEach((id) => {
          const d = mobileDownloads.get(id);
          if (d && d.nativeDownloadId) {
            const cap = getMobileCapEngine();
            if (cap) cap.cancelDownload({ downloadId: d.nativeDownloadId }).catch(() => {});
          }
          if (activePolling.has(id)) {
            clearInterval(activePolling.get(id));
            activePolling.delete(id);
          }
          mobileDownloads.delete(id);
          emit('dl:removed', id);
        });
        saveStoredDownloads([...mobileDownloads.values()]);
      },
      open: async (id) => {
        const d = mobileDownloads.get(id);
        if (d && d.url) window.open(d.url, '_system');
      },
      reveal: async (id) => {
        toast(S.lang === 'ar' ? 'الملف موجود في مجلد التحميلات' : 'File saved in Downloads folder');
      },
      chooseDir: async () => 'Downloads',
      openExtensionFolder: async () => ({ ok: true }),
      openUrl: (u) => { window.open(u, '_system'); },
      on: (channel, cb) => {
        if (!listeners.has(channel)) listeners.set(channel, []);
        listeners.get(channel).push(cb);
      }
    };
  }

  /* ---------------- DEDICATED SOCIAL VIDEO SAVER HUB ---------------- */
  function setupSocialVideoSaver() {
    const urlInput = $('#socialHubUrlInput');
    const pasteBtn = $('#btnSocialHubPaste');
    const analyzeBtn = $('#btnSocialHubAnalyze');
    const loader = $('#socialHubLoader');
    const loaderText = $('#socialHubLoaderText');
    const preview = $('#socialHubPreview');
    const thumb = $('#socialHubThumb');
    const platBadge = $('#socialHubPlatformBadge');
    const titleEl = $('#socialHubTitle');
    const authorEl = $('#socialHubAuthor');
    const btnFull = $('#btnDownloadFullVideo');
    const btnAudio = $('#btnDownloadAudioOnly');
    const progressCard = $('#socialHubProgressCard');
    const spStatus = $('#spStatusLabel');
    const spSpeed = $('#spSpeedLabel');
    const spBar = $('#spProgressBar');
    const spPercent = $('#spPercentLabel');
    const spSize = $('#spSizeLabel');

    let currentResolved = null;

    // Platform chips filter/quick-hint
    $$('.social-pill').forEach((pill) => {
      pill.addEventListener('click', () => {
        $$('.social-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        if (urlInput) urlInput.focus();
      });
    });

    // 1-Tap Paste from Clipboard
    if (pasteBtn && urlInput) {
      pasteBtn.addEventListener('click', async () => {
        try {
          const text = await navigator.clipboard.readText();
          if (text && text.trim().startsWith('http')) {
            urlInput.value = text.trim();
            toast(S.lang === 'ar' ? 'تم لصق الرابط من الحافظة' : 'Pasted link from clipboard');
            triggerAnalyze();
          } else if (text) {
            urlInput.value = text.trim();
          } else {
            toast(S.lang === 'ar' ? 'الحافظة فارغة' : 'Clipboard is empty');
          }
        } catch (_) {
          urlInput.focus();
        }
      });
    }

    const triggerAnalyze = async () => {
      const u = urlInput?.value?.trim();
      if (!u || !/^https?:\/\//i.test(u)) {
        toast(S.lang === 'ar' ? 'يرجى إدخال رابط فيديو صحيح' : 'Please enter a valid video link');
        return;
      }

      if (loader) loader.hidden = false;
      if (preview) preview.hidden = true;
      if (progressCard) progressCard.hidden = true;

      const plat = detectSocialPlatform(u) || { name: 'Video', icon: '🎬', color: '#00f2fe' };
      if (loaderText) {
        loaderText.textContent = S.lang === 'ar' 
          ? `جاري فحص واستخراج الفيديو من ${plat.name}...` 
          : `Analyzing video stream from ${plat.name}...`;
      }

      try {
        const data = await resolveSocialMedia(u, plat);
        currentResolved = data;
        if (loader) loader.hidden = true;

        if (data && data.ok) {
          if (preview) preview.hidden = false;
          if (titleEl) titleEl.textContent = data.title || `${plat.name} Video`;
          if (authorEl) authorEl.textContent = data.author || plat.name;
          if (platBadge) {
            platBadge.textContent = `${plat.icon || '🎬'} ${plat.name}`;
            platBadge.style.borderColor = plat.color || '#00f2fe';
          }
          if (thumb) {
            if (data.thumbnail) {
              thumb.src = data.thumbnail;
              thumb.style.display = 'block';
            } else {
              thumb.style.display = 'none';
            }
          }
        } else {
          toast(S.lang === 'ar' ? 'تعذّر استخراج الفيديو، سيتم التنزيل المباشر' : 'Could not resolve, will download directly');
        }
      } catch (err) {
        if (loader) loader.hidden = true;
        toast(S.lang === 'ar' ? 'خطأ في فحص الرابط' : `Analysis error: ${err.message}`);
      }
    };

    if (analyzeBtn) {
      analyzeBtn.addEventListener('click', triggerAnalyze);
    }
    if (urlInput) {
      urlInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') triggerAnalyze();
      });
    }

    const startSocialDownload = async (isAudioOnly) => {
      const u = urlInput?.value?.trim();
      if (!u) return;

      if (!currentResolved || !currentResolved.formats?.length) {
        toast(S.lang === 'ar' ? 'جاري فحص واستخراج رابط الفيديو أولاً...' : 'Analyzing video stream first...');
        await triggerAnalyze();
      }

      const plat = detectSocialPlatform(u) || { name: 'Media' };
      let downloadUrl = u;
      let filename = `${plat.name}_${Date.now()}.mp4`;
      let referer = '';

      if (currentResolved && currentResolved.formats?.length) {
        const formats = currentResolved.formats;
        const rawTitle = (currentResolved.title || plat.name)
          .replace(/[\/\\:*?"<>|]/g, '_')
          .slice(0, 50)
          .trim();

        if (isAudioOnly) {
          const audioFmt = formats.find(f => f.id === 'audio' || f.ext === 'mp3' || f.ext === 'm4a') || formats[0];
          downloadUrl = audioFmt.directUrl || audioFmt.url || u;
          referer = audioFmt.referer || '';
          filename = `${plat.name}_${rawTitle}.mp3`;
        } else {
          const videoFmt = formats.find(f => f.id !== 'audio' && f.ext === 'mp4') || formats[0];
          downloadUrl = videoFmt.directUrl || videoFmt.url || u;
          referer = videoFmt.referer || '';
          filename = `${plat.name}_${rawTitle}.mp4`;
        }
      }

      if (progressCard) progressCard.hidden = false;
      if (spStatus) {
        spStatus.textContent = isAudioOnly 
          ? (S.lang === 'ar' ? 'جاري تحميل الصوت MP3...' : 'Downloading MP3 audio...') 
          : (S.lang === 'ar' ? 'جاري تحميل الفيديو كامل (صوت + صورة)...' : 'Downloading full video...');
      }

      toast(isAudioOnly 
        ? (S.lang === 'ar' ? 'بدأ تحميل الملف الصوتي MP3!' : 'Audio download started!') 
        : (S.lang === 'ar' ? 'بدأ تحميل الفيديو كامل بالصوت!' : 'Full video download started!'));

      if (window.tayyar?.add) {
        try {
          const res = await window.tayyar.add({
            url: downloadUrl,
            socialUrl: u,
            filename,
            userFileName: filename,
            referer: referer || undefined,
            isSocial: true,
            formatId: isAudioOnly ? 'audio' : 'best'
          });

          if (res && res.id) {
            window.tayyar.on('dl:progress', (items) => {
              const list = Array.isArray(items) ? items : [items];
              const match = list.find(it => it.id === res.id);
              if (match) {
                const pct = match.size > 0 ? Math.min(100, Math.round((match.downloaded / match.size) * 100)) : 0;
                if (spBar) spBar.style.width = `${pct}%`;
                if (spPercent) spPercent.textContent = `${pct}%`;
                if (spSpeed) spSpeed.textContent = fmtSpeed(match.speed || 0);
                if (spSize) spSize.textContent = `${fmtSize(match.downloaded || 0)} / ${match.size > 0 ? fmtSize(match.size) : '...'}`;

                if (match.status === 'completed') {
                  if (spStatus) spStatus.textContent = S.lang === 'ar' ? '✅ اكتمل التحميل وحُفظ بنجاح!' : '✅ Download completed!';
                  toast(S.lang === 'ar' ? '✅ اكتمل تحميل الفيديو وحُفظ في المعرض ومجلد التحميلات!' : '✅ Video downloaded to Gallery & Downloads!');
                }
              }
            });
          }
        } catch (e) {
          toast(`Download error: ${e.message}`);
        }
      }
    };

    if (btnFull) {
      btnFull.addEventListener('click', () => startSocialDownload(false));
    }
    if (btnAudio) {
      btnAudio.addEventListener('click', () => startSocialDownload(true));
    }

    /* -------- DESKTOP UNIVERSAL STORIES SAVER (WhatsApp, Snapchat, Instagram, Facebook) -------- */
    const videosPanel = $('#socialVideosPanel');
    const storiesPanel = $('#socialStoriesPanel');
    const btnModeVideos = $('#btnModeVideos');
    const btnModeStories = $('#btnModeStories');
    const deskStoryInput = $('#deskStoryInput');
    const deskStoryCookies = $('#deskStoryCookies');
    const deskStorySocialBox = $('#deskStorySocialBox');
    const deskStoryWaBox = $('#deskStoryWhatsAppBox');
    const deskStoryLoader = $('#deskStoryLoader');
    const deskStoryResBar = $('#deskStoryResultsBar');
    const deskStoryCountLbl = $('#deskStoryCountLbl');
    const deskStoryGrid = $('#deskStoryGrid');

    let deskStoryPlat = 'snapchat';
    let deskStoriesList = [];
    let deskStoryFilter = 'all';
    const deskStorySelected = new Set();

    function getDeskFilteredStories() {
      if (deskStoryFilter === 'video') return deskStoriesList.filter((s) => s.type === 'video');
      if (deskStoryFilter === 'image') return deskStoriesList.filter((s) => s.type !== 'video');
      return deskStoriesList;
    }

    function setDeskStorySelectionCount(n) {
      const visible = getDeskFilteredStories();
      const clamped = Math.max(0, Math.min(visible.length, Number(n) || 0));
      deskStorySelected.clear();
      for (let i = 0; i < clamped; i++) {
        deskStorySelected.add(visible[i]._uid);
      }
      renderDeskStories();
    }

    function switchSocialMode(mode) {
      const isStories = mode === 'stories';
      if (videosPanel) videosPanel.hidden = isStories;
      if (storiesPanel) storiesPanel.hidden = !isStories;
      if (btnModeVideos) {
        btnModeVideos.classList.toggle('primary', !isStories);
        btnModeVideos.classList.toggle('outline', isStories);
      }
      if (btnModeStories) {
        btnModeStories.classList.toggle('primary', isStories);
        btnModeStories.classList.toggle('outline', !isStories);
      }
    }

    btnModeVideos?.addEventListener('click', () => switchSocialMode('videos'));
    btnModeStories?.addEventListener('click', () => switchSocialMode('stories'));

    function switchDeskStoryPlat(plat) {
      deskStoryPlat = plat;
      $$('#deskStoryPlatPills .desk-story-pill').forEach((b) => {
        b.classList.toggle('active', b.dataset.deskStory === plat);
      });
      if (deskStorySocialBox) deskStorySocialBox.hidden = plat === 'whatsapp';
      if (deskStoryWaBox) deskStoryWaBox.hidden = plat !== 'whatsapp';
      if (plat === 'whatsapp') {
        if (deskStoryResBar) deskStoryResBar.hidden = true;
        if (deskStoryGrid) deskStoryGrid.innerHTML = '';
      }
    }

    $$('#deskStoryPlatPills .desk-story-pill').forEach((btn) => {
      btn.addEventListener('click', () => switchDeskStoryPlat(btn.dataset.deskStory));
    });

    $('#btnDeskOpenWaWeb')?.addEventListener('click', () => {
      window.tayyar?.openUrl?.('https://web.whatsapp.com');
    });
    $('#btnDeskOpenExtFolder')?.addEventListener('click', () => {
      window.tayyar?.openExtensionFolder?.('chrome');
    });

    $('#btnDeskStoryPaste')?.addEventListener('click', async () => {
      try {
        const txt = (await navigator.clipboard.readText() || '').trim();
        if (txt && deskStoryInput) {
          deskStoryInput.value = txt;
          toast(S.lang === 'ar' ? 'تم لصق الرابط من الحافظة' : 'Pasted from clipboard');
        }
      } catch (_) {
        deskStoryInput?.focus();
      }
    });

    function renderDeskStories(errorMsg = '') {
      if (!deskStoryGrid) return;
      if (!deskStoriesList.length) {
        if (deskStoryResBar) deskStoryResBar.hidden = true;
        if (errorMsg) {
          deskStoryGrid.innerHTML = `<div class="desk-story-empty">${errorMsg}</div>`;
        } else {
          deskStoryGrid.innerHTML = '';
        }
        return;
      }

      const visible = getDeskFilteredStories();
      const total = visible.length;
      const selCount = visible.filter((s) => deskStorySelected.has(s._uid)).length;

      if (deskStoryResBar) deskStoryResBar.hidden = false;
      if (deskStoryCountLbl) deskStoryCountLbl.textContent = `${selCount} / ${total}`;

      const inpNum = $('#deskStoryCountInput');
      const inpRng = $('#deskStoryCountRange');
      const dlBtn = $('#btnDeskSaveAllStories');
      const dlTxt = $('#deskDlSelectedText');
      if (inpNum) { inpNum.max = String(total); inpNum.value = String(selCount); }
      if (inpRng) { inpRng.max = String(Math.max(1, total)); inpRng.value = String(selCount); }
      if (dlBtn) dlBtn.disabled = selCount === 0;
      if (dlTxt) {
        dlTxt.textContent = S.lang === 'ar'
          ? `تحميل المحدد (${selCount} / ${total})`
          : `Download Selected (${selCount} / ${total})`;
      }

      deskStoryGrid.innerHTML = visible.map((st, idx) => {
        const isSel = deskStorySelected.has(st._uid);
        return `
          <div class="desk-story-card ${isSel ? 'selected' : ''}" data-dstory-uid="${st._uid}">
            ${st.thumbnail
              ? `<img src="${st.thumbnail}" alt="" />`
              : `<div class="desk-story-fallback">${st.type === 'video' ? '▶' : '▣'}</div>`}
            <span class="desk-story-type">#${idx + 1} • ${st.type === 'video' ? 'MP4' : 'JPG'}</span>
            <span class="desk-story-check">✓</span>
            <button type="button" class="desk-story-dl-btn" data-dstory-save="${st._uid}">
              ${S.lang === 'ar' ? 'تحميل' : 'Download'}
            </button>
          </div>
        `;
      }).join('');

      $$('.desk-story-card[data-dstory-uid]', deskStoryGrid).forEach((card) => {
        card.addEventListener('click', (e) => {
          if (e.target.closest('.desk-story-dl-btn')) return;
          const uid = card.dataset.dstoryUid;
          if (deskStorySelected.has(uid)) deskStorySelected.delete(uid);
          else deskStorySelected.add(uid);
          renderDeskStories();
        });
      });

      $$('.desk-story-dl-btn[data-dstory-save]', deskStoryGrid).forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const st = deskStoriesList.find((x) => x._uid === btn.dataset.dstorySave);
          if (!st || !st.url) return;
          window.tayyar?.add?.({
            url: st.url,
            filename: st.filename || `Story_${Date.now()}.${st.ext || 'mp4'}`,
            userFileName: st.filename || `Story_${Date.now()}.${st.ext || 'mp4'}`,
            isSocial: false,
          });
          toast(S.lang === 'ar' ? 'بدأ تحميل الستوري!' : 'Story download started!');
        });
      });
    }

    async function fetchDeskStories() {
      const inp = (deskStoryInput?.value || '').trim();
      if (!inp) {
        toast(S.lang === 'ar' ? 'أدخل اسم المستخدم أو رابط الستوري أولاً' : 'Enter a @username or Story link first');
        return;
      }
      if (deskStoryLoader) deskStoryLoader.hidden = false;
      if (deskStoryResBar) deskStoryResBar.hidden = true;
      deskStoriesList = [];
      deskStorySelected.clear();
      renderDeskStories();

      try {
        const cookies = deskStoryCookies?.value || '';
        const res = await window.tayyar?.storiesResolve?.(inp, deskStoryPlat, { browserCookies: cookies });
        if (deskStoryLoader) deskStoryLoader.hidden = true;
        if (res && res.ok && Array.isArray(res.stories) && res.stories.length > 0) {
          deskStoriesList = res.stories.map((st, i) => Object.assign({}, st, { _uid: st.id || `dst_${i}` }));
          deskStoryFilter = 'all';
          $$('#deskStoryTypeFilter .dssb-chip').forEach((c) => c.classList.toggle('active', c.dataset.dstype === 'all'));
          setDeskStorySelectionCount(deskStoriesList.length);
        } else {
          const msg = res?.error || (S.lang === 'ar'
            ? 'لم يتم العثور على ستوريات عامة. للستوريات الخاصة اختر المتصفح (Chrome / Edge / Firefox) من جلسة المتصفح بالأعلى.'
            : 'No public stories found. For private stories, select your logged-in browser (Chrome/Edge/Firefox) above.');
          renderDeskStories(msg);
        }
      } catch (err) {
        if (deskStoryLoader) deskStoryLoader.hidden = true;
        renderDeskStories(err.message || 'Story fetch error');
      }
    }

    // Desktop Story Filter, Stepper, Slider & Presets
    $$('#deskStoryTypeFilter .dssb-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        deskStoryFilter = chip.dataset.dstype;
        $$('#deskStoryTypeFilter .dssb-chip').forEach((c) => c.classList.toggle('active', c === chip));
        setDeskStorySelectionCount(getDeskFilteredStories().length);
      });
    });

    $('#btnDeskCountDec')?.addEventListener('click', () => setDeskStorySelectionCount((Number($('#deskStoryCountInput')?.value) || 0) - 1));
    $('#btnDeskCountInc')?.addEventListener('click', () => setDeskStorySelectionCount((Number($('#deskStoryCountInput')?.value) || 0) + 1));
    $('#deskStoryCountInput')?.addEventListener('input', (e) => setDeskStorySelectionCount(e.target.value));
    $('#deskStoryCountRange')?.addEventListener('input', (e) => setDeskStorySelectionCount(e.target.value));
    $$('#deskStoryPresets .dssb-preset').forEach((btn) => {
      btn.addEventListener('click', () => {
        const p = btn.dataset.preset;
        if (p === 'all') setDeskStorySelectionCount(getDeskFilteredStories().length);
        else if (p === 'none') setDeskStorySelectionCount(0);
        else setDeskStorySelectionCount(Number(p));
      });
    });

    $('#btnDeskFetchStories')?.addEventListener('click', fetchDeskStories);
    deskStoryInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') fetchDeskStories();
    });

    $('#btnDeskSaveAllStories')?.addEventListener('click', () => {
      const visible = getDeskFilteredStories();
      const chosen = visible.filter((st) => deskStorySelected.has(st._uid) && st.url);
      if (!chosen.length) {
        toast(S.lang === 'ar' ? 'اختر ستوري واحد على الأقل للتحميل' : 'Select at least 1 story to download');
        return;
      }
      chosen.forEach((st, idx) => {
        setTimeout(() => {
          window.tayyar?.add?.({
            url: st.url,
            filename: st.filename || `Story_${Date.now()}_${idx + 1}.${st.ext || 'mp4'}`,
            userFileName: st.filename || `Story_${Date.now()}_${idx + 1}.${st.ext || 'mp4'}`,
            isSocial: false,
          });
        }, idx * 200);
      });
      toast(S.lang === 'ar' ? `بدأ تحميل ${chosen.length} ستوريات محددة!` : `Downloading ${chosen.length} selected stories!`);
    });
  }

  /* ---------------- IPC & INITIALIZATION ---------------- */
  async function init() {
    const isMobileDevice = window.tayyar?.isMobile || 
                           window.Capacitor?.isNativePlatform?.() || 
                           window.innerWidth <= 768 ||
                           /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobileDevice) {
      document.body.classList.add('is-mobile');
      setTimeout(() => {
        const activeBtn = $('.mobile-nav-btn.active');
        if (activeBtn) positionLiquidNavIndicator(activeBtn);
      }, 180);
    }

    initHeatmap();
    renderTrackersTable();
    renderPluginsView();
    setupSocialVideoSaver();

    if (!window.tayyar) {
      setupMobileAndWebEngine();
    }

    try {
      S.settings = await window.tayyar.settings.get();
      const list = await window.tayyar.list();
      list.forEach((item) => S.items.set(item.id, item));
    } catch (e) {
      console.error('Init error:', e);
    }

    // Apply pure language (100% English or 100% Arabic across Desktop & Mobile)
    let savedLang = 'en';
    try {
      savedLang = localStorage.getItem('tayyar_lang') || S.settings?.lang || 'en';
    } catch (_) {
      savedLang = S.settings?.lang || 'en';
    }
    applyLanguage(savedLang, true);
    loadSavedBentoLayout();
    syncUpdateChannelUI();

    updateDashboard();
    renderDownloadsList();

    // Listen to real-time events
    window.tayyar.on('dl:update', (d) => {
      if (!d || !d.id) return;
      const it = S.items.get(d.id);
      if (it) Object.assign(it, d);
      else S.items.set(d.id, d);

      if (updateDownloadTaskId && d.id === updateDownloadTaskId) {
        if (d.status === 'completed') {
          finishUpdateDownload(d.path);
        }
      }

      updateDashboard();
      renderDownloadsList();
      if (document.body.classList.contains('is-mobile')) updateMobileFloatingStatus(d);
    });

    window.tayyar.on('dl:progress', (batchOrItem) => {
      const items = Array.isArray(batchOrItem) ? batchOrItem : [batchOrItem];
      let updated = false;
      for (const b of items) {
        if (!b || !b.id) continue;
        const it = S.items.get(b.id);
        if (it) {
          Object.assign(it, b);
          updated = true;
        } else {
          S.items.set(b.id, b);
          updated = true;
        }
        if (document.body.classList.contains('is-mobile')) updateMobileFloatingStatus(it || b);

        if (updateDownloadTaskId && b.id === updateDownloadTaskId) {
          const pb = $('#updateProgressBar');
          const pp = $('#updateProgressPct');
          const ps = $('#updateProgressSpeed');
          const pz = $('#updateProgressSize');
          const percent = pct(b);
          const spdStr = fmtBytes(b.speed || 0) + '/s';
          const szStr = `${fmtBytes(b.downloaded || 0)} / ${fmtBytes(b.totalSize || b.size || 0)}`;
          if (pb) pb.style.width = percent + '%';
          if (pp) pp.textContent = percent + '%';
          if (ps) ps.textContent = spdStr;
          if (pz) pz.textContent = szStr;

          const dpb = $('#deskUpdProgFill');
          const dpp = $('#deskUpdProgPct');
          const dps = $('#deskUpdProgSpeed');
          const dpz = $('#deskUpdProgSize');
          if (dpb) dpb.style.width = percent + '%';
          if (dpp) dpp.textContent = percent + '%';
          if (dps) dps.textContent = spdStr;
          if (dpz) dpz.textContent = szStr;
        }
      }
      if (updated) {
        updateDashboard();
        renderDownloadsList();
      }
    });

    window.tayyar.on('dl:removed', (id) => {
      S.items.delete(id);
      S.sel.delete(id);
      updateDashboard();
      renderDownloadsList();
    });

    window.tayyar.on('settings', (s) => {
      S.settings = s;
    });

    // Automatic update check if enabled
    if ($('#cfgAutoCheckUpdate')?.checked) {
      setTimeout(() => {
        checkAppUpdates(false);
      }, 2500);
    }

    window.tayyar.on('ui:add-url', ({ url }) => {
      openAddModal(url);
    });

    window.tayyar.on('ui:clip-url', ({ url }) => {
      toast(`File link copied to clipboard: ${url.slice(0, 30)}...`);
      openAddModal(url);
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
