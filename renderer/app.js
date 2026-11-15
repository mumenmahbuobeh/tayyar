'use strict';
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  /* ---------------- TRANSLATIONS (EN & AR) ---------------- */
  const I18N = {
    en: {
      dashboard: 'Dashboard',
      downloads: 'Downloads',
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
      upToDateDesc: 'Version 1.0.0 is the latest available release.',
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
    },
    ar: {
      dashboard: 'لوحة التحكم',
      downloads: 'التحميلات',
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
      upToDateDesc: 'الإصدار 1.0.0 هو أحدث إصدار متوفر حالياً.',
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
  function applyLanguage(lang) {
    S.lang = lang;
    const dict = I18N[lang] || I18N.en;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    const langBtn = $('#langCodeLabel');
    if (langBtn) langBtn.textContent = lang === 'en' ? 'AR' : 'EN';

    // Update all elements with data-i
    $$('[data-i]').forEach((el) => {
      const key = el.dataset.i;
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });

    // Update settings select
    const langSelect = $('#cfgLang');
    if (langSelect) langSelect.value = lang;

    // Toast feedback
    toast(lang === 'ar' ? 'تم تحويل اللغة إلى العربية' : 'Switched to English');
  }

  const bLangToggle = $('#bLangToggle');
  if (bLangToggle) {
    bLangToggle.addEventListener('click', () => {
      applyLanguage(S.lang === 'en' ? 'ar' : 'en');
    });
  }

  /* ---------------- NAVIGATION / VIEW SWITCHING ---------------- */
  function switchView(viewName) {
    S.activeView = viewName;
    $$('.nav-item').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.view === viewName);
    });
    $$('.view-panel').forEach((panel) => {
      panel.classList.remove('active');
    });

    const targetId = `view${viewName.charAt(0).toUpperCase() + viewName.slice(1)}`;
    const targetPanel = $(`#${targetId}`);
    if (targetPanel) {
      targetPanel.classList.add('active');
    }
  }

  $$('.nav-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      const v = btn.dataset.view;
      if (v) switchView(v);
    });
  });

  /* ---------------- HEATMAP GENERATOR ---------------- */
  function initHeatmap() {
    const container = $('#heatmapCells');
    if (!container || container.children.length > 0) return;

    const totalCols = 24;
    const totalRows = 4;
    for (let c = 0; c < totalCols; c++) {
      for (let r = 0; r < totalRows; r++) {
        const cell = document.createElement('div');
        cell.className = 'hm-cell';
        const rand = Math.random();
        if (rand > 0.85) cell.classList.add('lvl-3');
        else if (rand > 0.65) cell.classList.add('lvl-2');
        else if (rand > 0.45) cell.classList.add('lvl-1');
        container.appendChild(cell);
      }
    }
  }

  /* ---------------- TRACKERS TABLE (Images 2 & 3) ---------------- */
  function renderTrackersTable() {
    const tbody = $('#trackersTableBody');
    if (!tbody) return;

    tbody.innerHTML = SAMPLE_TRACKERS.map((trk) => `
      <tr>
        <td class="url-col">${trk.url}</td>
        <td>
          <span class="health-badge">
            <span class="status-dot-green"></span>
            ${trk.health}
          </span>
        </td>
        <td>${trk.date}</td>
        <td>${trk.src}</td>
      </tr>
    `).join('');
  }

  const bSyncTrackers = $('#bSyncTrackers');
  if (bSyncTrackers) {
    bSyncTrackers.addEventListener('click', () => {
      bSyncTrackers.disabled = true;
      bSyncTrackers.innerHTML = `<span>Syncing...</span>`;
      setTimeout(() => {
        bSyncTrackers.disabled = false;
        bSyncTrackers.innerHTML = `<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" style="width:14px;margin-right:6px;"><path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg> <span>Sync Now</span>`;
        toast('Trackers updated successfully (50 active)');
      }, 900);
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

    // Tasks card mini list
    renderMiniTasks(items);
  }

  function renderMiniTasks(items) {
    const emptyState = $('#emptyTasksState');
    const listEl = $('#miniTasksList');
    if (!emptyState || !listEl) return;

    let filtered = [];
    if (S.tasksTab === 'active') {
      filtered = items.filter((d) => d.status === 'downloading');
    } else if (S.tasksTab === 'failed') {
      filtered = items.filter((d) => d.status === 'error');
    } else {
      filtered = items.slice(0, 4);
    }

    if (!filtered.length) {
      emptyState.hidden = false;
      emptyState.style.display = 'flex';
      listEl.hidden = true;
      listEl.style.display = 'none';
    } else {
      emptyState.hidden = true;
      emptyState.style.display = 'none';
      listEl.hidden = false;
      listEl.style.display = 'flex';
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

  /* ---------------- CUSTOMIZE MODE (Image 2) ---------------- */
  const bToggleCustomize = $('#bToggleCustomize');
  const customizeBar = $('#customizeBar');
  const standardDashActions = $('#standardDashActions');
  const bCloseCustom = $('#bCloseCustom');
  const bApplyCustom = $('#bApplyCustom');
  const bResetCustom = $('#bResetCustom');
  const bAddWidget = $('#bAddWidget');
  const bPresetMenu = $('#bPresetMenu');
  const presetPopover = $('#presetPopover');
  const curPresetLabel = $('#curPresetLabel');
  const bentoGrid = $('#bentoGrid');

  if (bToggleCustomize) {
    bToggleCustomize.addEventListener('click', () => {
      if (customizeBar) {
        customizeBar.hidden = false;
        customizeBar.style.display = 'flex';
      }
      if (standardDashActions) {
        standardDashActions.hidden = true;
        standardDashActions.style.display = 'none';
      }
      if (bentoGrid) bentoGrid.classList.add('customizing');
    });
  }

  const closeCustomize = () => {
    if (customizeBar) {
      customizeBar.hidden = true;
      customizeBar.style.display = 'none';
    }
    if (standardDashActions) {
      standardDashActions.hidden = false;
      standardDashActions.style.display = 'flex';
    }
    if (presetPopover) {
      presetPopover.hidden = true;
      presetPopover.style.display = 'none';
    }
    if (bentoGrid) bentoGrid.classList.remove('customizing');
  };

  if (bCloseCustom) bCloseCustom.addEventListener('click', closeCustomize);
  if (bApplyCustom) {
    bApplyCustom.addEventListener('click', () => {
      closeCustomize();
      toast(S.lang === 'ar' ? 'تم تطبيق تخصيص اللوحة' : 'Layout customization applied');
    });
  }
  if (bResetCustom) {
    bResetCustom.addEventListener('click', () => {
      setPreset('compact');
      toast(S.lang === 'ar' ? 'تمت إعادة ضبط اللوحة إلى الوضع الافتراضي' : 'Layout reset to default');
    });
  }

  if (bAddWidget) {
    bAddWidget.addEventListener('click', () => {
      toast(S.lang === 'ar' ? 'جميع البطاقات مفعلة حالياً على اللوحة' : 'All widgets are active on dashboard');
    });
  }

  if (bPresetMenu && presetPopover) {
    bPresetMenu.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = presetPopover.hidden || presetPopover.style.display === 'none';
      presetPopover.hidden = !isHidden;
      presetPopover.style.display = isHidden ? 'block' : 'none';
    });
  }

  document.addEventListener('click', (e) => {
    if (presetPopover && !presetPopover.contains(e.target) && e.target !== bPresetMenu) {
      presetPopover.hidden = true;
      presetPopover.style.display = 'none';
    }
  });

  function setPreset(presetName) {
    S.dashPreset = presetName;
    if (curPresetLabel) {
      curPresetLabel.textContent = presetName.charAt(0).toUpperCase() + presetName.slice(1);
    }
    $$('.dropdown-item', presetPopover).forEach((item) => {
      item.classList.toggle('active', item.dataset.preset === presetName);
    });

    if (bentoGrid) {
      bentoGrid.className = `bento-grid layout-${presetName}`;
    }
    if (presetPopover) {
      presetPopover.hidden = true;
      presetPopover.style.display = 'none';
    }
  }

  $$('.dropdown-item', presetPopover).forEach((item) => {
    item.addEventListener('click', () => {
      setPreset(item.dataset.preset);
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
      const progress = pct(d);
      const isDownloading = d.status === 'downloading';
      const isCompleted = d.status === 'completed';

      return `
        <div class="dl-item-row ${isSelected ? 'selected' : ''}" data-id="${d.id}">
          <div class="dl-item-top">
            <span class="dl-file-name" title="${d.url}">${d.filename || d.url}</span>
            <div class="dl-item-meta">
              <span>${isDownloading ? fmtSpeed(d.speed) : d.status}</span>
              ${isDownloading && d.eta >= 0 ? `<span>ETA: ${fmtEta(d.eta)}</span>` : ''}
              <span style="font-weight:700;color:#fff;">${progress}%</span>
            </div>
          </div>
          <div class="dl-progress-bar-wrap">
            <div class="dl-progress-bar-fill" style="width: ${progress}%;"></div>
          </div>
          <div class="dl-item-bottom">
            <span>${fmtSize(d.downloaded)} / ${fmtSize(d.size)}</span>
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
    if (addErrMsg) addErrMsg.hidden = true;

    if (taskSaveDir && S.settings.defaultDir) {
      taskSaveDir.value = S.settings.defaultDir;
    }
  }

  function closeAddModal() {
    if (addModal) addModal.close();
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

  let probeTimer = 0;
  if (taskUrlInput) {
    taskUrlInput.addEventListener('input', () => {
      clearTimeout(probeTimer);
      const url = taskUrlInput.value.trim().split('\n')[0];
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
          addErrMsg.textContent = 'Please enter a valid HTTP or HTTPS link.';
          addErrMsg.hidden = false;
        }
        return;
      }

      const conns = parseInt($('#taskConnsSelect')?.value || '8', 10);
      const dir = taskSaveDir?.value || '';

      for (const u of urls) {
        if (window.tayyar?.add) {
          const res = await window.tayyar.add({
            url: u,
            dir: dir || undefined,
            connections: conns,
          });
          if (res?.item) {
            S.items.set(res.item.id, res.item);
          }
        }
      }

      closeAddModal();
      toast(`Started ${urls.length} download task(s)`);
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

  // Copy CLI tool command
  const bCopyCli = $('#bCopyCli');
  if (bCopyCli) {
    bCopyCli.addEventListener('click', () => {
      navigator.clipboard.writeText('tayyar download https://example.com/file.zip');
      toast('Copied command to clipboard!');
    });
  }

  // Check update simulation in About modal (Image 13)
  const bCheckUpdate = $('#bCheckUpdate');
  if (bCheckUpdate) {
    bCheckUpdate.addEventListener('click', () => {
      bCheckUpdate.disabled = true;
      const originalHtml = bCheckUpdate.innerHTML;
      bCheckUpdate.innerHTML = `<span>Checking...</span>`;
      setTimeout(() => {
        bCheckUpdate.disabled = false;
        bCheckUpdate.innerHTML = originalHtml;
        toast(S.lang === 'ar' ? 'برنامج تيّار محدّث لأحدث إصدار!' : 'Tayyar is up to date (Version 1.0.0)');
      }, 1000);
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
      const svgClone = box ? box.querySelector('.browser-svg')?.cloneNode(true) : null;
      if (extModalLogo) {
        extModalLogo.innerHTML = '';
        if (svgClone) extModalLogo.appendChild(svgClone);
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

  /* ---------------- IPC INITIALIZATION ---------------- */
  async function init() {
    initHeatmap();
    renderTrackersTable();

    if (!window.tayyar) {
      console.warn('Tayyar IPC bridge not found (running in preview)');
      return;
    }

    try {
      S.settings = await window.tayyar.settings.get();
      const list = await window.tayyar.list();
      list.forEach((item) => S.items.set(item.id, item));
    } catch (e) {
      console.error('Init error:', e);
    }

    updateDashboard();
    renderDownloadsList();

    // Listen to real-time events
    window.tayyar.on('dl:update', (d) => {
      S.items.set(d.id, d);
      updateDashboard();
      renderDownloadsList();
    });

    window.tayyar.on('dl:progress', (b) => {
      const it = S.items.get(b.id);
      if (it) {
        Object.assign(it, b);
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
