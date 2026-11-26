'use strict';

/**
 * Tayyar Content Script — Next-Generation IDM-Grade Video & Media Downloader
 * Overcomes transparent player overlays via proximity coordinate tracking.
 * Captures HTML5 videos, MSE/Blob streams, HLS playlists, Social Media, and Fullscreen players.
 */

(function () {
  let isBadgeEnabled = true;
  let activePlayerEl = null;
  let hideTimer = null;
  let detectedStreamsForTab = [];
  let isMenuOpen = false;

  // Retrieve user preferences and watch for live changes
  chrome.storage?.local?.get({ showVideoBadge: true }, (res) => {
    if (res && res.showVideoBadge === false) isBadgeEnabled = false;
  });

  chrome.storage?.onChanged?.addListener((changes) => {
    if (changes.showVideoBadge) {
      isBadgeEnabled = changes.showVideoBadge.newValue;
      if (!isBadgeEnabled && badgeEl) {
        badgeEl.classList.remove('visible');
        closeDropdown();
      }
    }
  });

  // Listen for real-time stream notifications from background sniffer
  chrome.runtime?.onMessage?.addListener((msg) => {
    if (msg.type === 'TAYYAR_STREAM_DETECTED' && msg.media) {
      if (!detectedStreamsForTab.some((m) => m.url === msg.media.url)) {
        detectedStreamsForTab.unshift(msg.media);
        if (detectedStreamsForTab.length > 25) detectedStreamsForTab.pop();
        updateBadgeStreamInfo();
      }
    }
  });

  function fetchTabStreams() {
    try {
      chrome.runtime.sendMessage({ type: 'GET_TAB_MEDIA' }, (resp) => {
        if (resp && Array.isArray(resp.media)) {
          detectedStreamsForTab = resp.media;
          updateBadgeStreamInfo();
        }
      });
    } catch (_) {}
  }

  // Detect platform host
  function getPlatformInfo() {
    const h = location.hostname.toLowerCase();
    const p = location.pathname.toLowerCase();
    if (h.includes('youtube.com') || h.includes('youtu.be')) return { id: 'youtube', name: 'YouTube', icon: '🎬', isSocial: true };
    if (h.includes('tiktok.com')) return { id: 'tiktok', name: 'TikTok', icon: '🎵', isSocial: true };
    if (h.includes('instagram.com')) return { id: 'instagram', name: 'Instagram', icon: '📸', isSocial: true, isStory: p.includes('/stories') };
    if (h.includes('facebook.com') || h.includes('fb.watch')) return { id: 'facebook', name: 'Facebook', icon: '📘', isSocial: true, isStory: p.includes('/stories') };
    if (h.includes('snapchat.com')) return { id: 'snapchat', name: 'Snapchat', icon: '👻', isSocial: true, isStory: true };
    if (h.includes('twitter.com') || h.includes('x.com')) return { id: 'twitter', name: 'X / Twitter', icon: '𝕏', isSocial: true };
    if (h.includes('reddit.com')) return { id: 'reddit', name: 'Reddit', icon: '👽', isSocial: true };
    if (h.includes('vimeo.com')) return { id: 'vimeo', name: 'Vimeo', icon: '📽️', isSocial: true };
    if (h.includes('dailymotion.com')) return { id: 'dailymotion', name: 'Dailymotion', icon: '📺', isSocial: true };
    if (h.includes('twitch.tv')) return { id: 'twitch', name: 'Twitch', icon: '🎮', isSocial: true };
    if (h.includes('web.whatsapp.com')) return { id: 'whatsapp', name: 'WhatsApp', icon: '💬', isStory: true };
    return { id: 'generic', name: 'Web Player', icon: '⚡', isSocial: false };
  }

  /* ================= CREATE FLOATING UI ================= */
  let badgeEl = null;
  let mainActionBtn = null;
  let menuToggleBtn = null;
  let dropdownEl = null;
  let qualityTagEl = null;
  let labelTextEl = null;

  function initBadgeDOM() {
    if (badgeEl) return;
    badgeEl = document.createElement('div');
    badgeEl.className = 'tayyar-floating-video-badge';
    badgeEl.setAttribute('dir', 'ltr');

    badgeEl.innerHTML = `
      <div class="tayyar-badge-pill" id="tayyarPill">
        <button class="tayyar-badge-main-action" id="tayyarMainBtn" title="تحميل بواسطة تيّار | Download with Tayyar">
          <span class="tayyar-badge-bolt">⚡</span>
          <span class="tayyar-badge-label" id="tayyarLabel">تحميل الفيديو</span>
          <span class="tayyar-badge-quality-tag" id="tayyarQualityTag" style="display:none">HD</span>
        </button>
        <div class="tayyar-badge-divider"></div>
        <button class="tayyar-badge-menu-toggle" id="tayyarToggleBtn" title="خيارات وصيغ التحميل (Streams & Qualities)">
          <svg viewBox="0 0 16 16" width="10" height="10" fill="currentColor">
            <path d="M3 6l5 5 5-5z"/>
          </svg>
        </button>
      </div>
      <div class="tayyar-badge-dropdown" id="tayyarDropdown">
        <div class="tayyar-menu-header">
          <div class="tayyar-menu-header-title">
            <span>⚡</span>
            <span>بثوث ومسارات الفيديو المكتشفة</span>
          </div>
          <span id="tayyarStreamCount" style="color:#00f0ff;font-weight:800;">1</span>
        </div>
        <div class="tayyar-menu-items-list" id="tayyarStreamsList">
          <!-- Populated dynamically -->
        </div>
        <div class="tayyar-menu-footer">
          <button class="tayyar-menu-footer-btn" id="tayyarCopyLinkBtn">
            <span>📋</span> نسخ رابط الفيديو
          </button>
          <button class="tayyar-menu-footer-btn" id="tayyarOpenAppBtn">
            <span>🚀</span> فتح تطبيق تيّار
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(badgeEl);

    mainActionBtn = badgeEl.querySelector('#tayyarMainBtn');
    menuToggleBtn = badgeEl.querySelector('#tayyarToggleBtn');
    dropdownEl = badgeEl.querySelector('#tayyarDropdown');
    qualityTagEl = badgeEl.querySelector('#tayyarQualityTag');
    labelTextEl = badgeEl.querySelector('#tayyarLabel');

    // Keep badge visible when mouse enters badge or dropdown
    badgeEl.addEventListener('mouseenter', () => {
      clearTimeout(hideTimer);
    });

    badgeEl.addEventListener('mouseleave', () => {
      if (!isMenuOpen) {
        scheduleHide(1800);
      }
    });

    // Main 1-click Download Action
    mainActionBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      triggerBestDownload();
    });

    // Dropdown Toggle
    menuToggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleDropdown();
    });

    // Footer actions
    badgeEl.querySelector('#tayyarCopyLinkBtn').addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const best = getBestStreamInfo();
      const targetUrl = best.url || window.location.href;
      navigator.clipboard?.writeText(targetUrl).then(() => {
        showStatusFeedback('✓ تم نسخ الرابط!', 'success');
        setTimeout(() => closeDropdown(), 1200);
      });
    });

    badgeEl.querySelector('#tayyarOpenAppBtn').addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      fetch('http://127.0.0.1:6824/show-app', { method: 'POST' }).catch(() => {});
      closeDropdown();
    });

    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
      if (isMenuOpen && !badgeEl.contains(e.target)) {
        closeDropdown();
      }
    }, true);
  }

  function scheduleHide(ms = 2200) {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      if (!isMenuOpen && badgeEl) {
        badgeEl.classList.remove('visible');
      }
    }, ms);
  }

  function toggleDropdown() {
    if (isMenuOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  }

  function openDropdown() {
    fetchTabStreams();
    populateDropdownStreams();
    isMenuOpen = true;
    badgeEl.classList.add('menu-open');
    clearTimeout(hideTimer);
  }

  function closeDropdown() {
    isMenuOpen = false;
    badgeEl.classList.remove('menu-open');
  }

  /* ================= MEDIA DETECTION & STREAM EXTRACTION ================= */
  async function fetchAsDataUrl(srcUrl) {
    const resp = await fetch(srcUrl);
    const blob = await resp.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve({ dataUrl: reader.result, mime: blob.type || '' });
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  function fallbackBrowserDownload(srcUrl, filename) {
    const a = document.createElement('a');
    a.href = srcUrl;
    a.download = filename || 'video.mp4';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function getBestStreamInfo() {
    const plat = getPlatformInfo();
    const mediaEl = activePlayerEl ? (activePlayerEl.tagName === 'VIDEO' || activePlayerEl.tagName === 'AUDIO' ? activePlayerEl : activePlayerEl.querySelector('video, audio')) : null;
    const directSrc = mediaEl ? (mediaEl.currentSrc || mediaEl.src || mediaEl.querySelector('source')?.src || '') : '';

    // 1. Social Platforms (when not a story page, send URL to desktop engine)
    if (plat.isSocial && !plat.isStory && !location.pathname.includes('/stories')) {
      return {
        type: 'social',
        url: window.location.href,
        title: document.title.replace(/ - YouTube$/, '').trim() || `${plat.name} Video`,
        platform: plat.name,
        quality: '4K / Full HD',
        icon: plat.icon
      };
    }

    // 1b. Story Pages (Instagram Stories, Facebook Stories, WhatsApp Web)
    if (plat.isStory || location.pathname.includes('/stories')) {
      const v = activePlayerEl ? (activePlayerEl.tagName === 'VIDEO' ? activePlayerEl : activePlayerEl.querySelector('video')) : document.querySelector('video');
      if (v) {
        const vSrc = v.currentSrc || v.src || '';
        return {
          type: vSrc.startsWith('blob:') ? 'blob' : 'direct',
          url: vSrc,
          title: `${plat.name}_Story_${Date.now()}`,
          platform: plat.name,
          quality: 'MP4',
          icon: '🎬'
        };
      }
      const im = activePlayerEl ? (activePlayerEl.tagName === 'IMG' ? activePlayerEl : activePlayerEl.querySelector('img')) : document.querySelector('section img, div[role="dialog"] img, img.x5yr21d');
      if (im) {
        return {
          type: 'story_img',
          url: im.currentSrc || im.src || '',
          title: `${plat.name}_Story_${Date.now()}`,
          platform: plat.name,
          quality: 'JPG',
          icon: '📸'
        };
      }
    }

    // 2. Intercepted HLS (.m3u8), DASH (.mpd), or direct video stream from background
    if (detectedStreamsForTab.length > 0) {
      const hls = detectedStreamsForTab.find((s) => s.isHLS || s.isDASH || s.url.includes('.m3u8') || s.url.includes('.mpd'));
      if (hls) {
        return {
          type: 'hls',
          url: hls.url,
          title: document.title || 'HLS/DASH Stream',
          platform: 'HLS/DASH Stream',
          quality: hls.isDASH || hls.url.includes('.mpd') ? 'MPD' : 'M3U8',
          icon: '📡'
        };
      }
      const topStream = detectedStreamsForTab[0];
      return {
        type: 'stream',
        url: topStream.url,
        title: topStream.title || document.title || 'Media Video',
        platform: 'Video Stream',
        quality: topStream.mime.includes('mp4') ? 'MP4' : 'Video',
        icon: '🎬'
      };
    }

    // 3. Direct HTML5 video source
    if (directSrc && !directSrc.startsWith('blob:') && !directSrc.startsWith('data:')) {
      return {
        type: 'direct',
        url: directSrc,
        title: document.title || 'Video',
        platform: 'Direct Stream',
        quality: 'MP4',
        icon: '🎬'
      };
    }

    // 4. Blob or fallback to current page URL
    return {
      type: directSrc.startsWith('blob:') ? 'blob' : 'page',
      url: directSrc || window.location.href,
      title: document.title || 'Video',
      platform: plat.name,
      quality: 'Auto',
      icon: '⚡'
    };
  }

  function updateBadgeStreamInfo() {
    if (!badgeEl) return;
    const best = getBestStreamInfo();
    if (best.quality && best.quality !== 'Auto') {
      qualityTagEl.textContent = best.quality;
      qualityTagEl.style.display = 'inline-block';
    } else {
      qualityTagEl.style.display = 'none';
    }
  }

  function populateDropdownStreams() {
    const listEl = badgeEl.querySelector('#tayyarStreamsList');
    const countEl = badgeEl.querySelector('#tayyarStreamCount');
    listEl.innerHTML = '';

    const plat = getPlatformInfo();
    const streams = [];

    // Option 1: Full HD / 4K Lossless muxing via Tayyar Turbo Engine
    if (plat.isSocial) {
      streams.push({
        title: `أعلى جودة فائقة الوضوح (Full HD / 4K)`,
        subtitle: `تحميل مباشر بأعلى جودة مع دمج الصوت تلقائياً عبر محرك تيّار`,
        badge: `TURBO`,
        icon: plat.icon || '🎬',
        action: () => sendDownloadToTayyar(window.location.href, document.title, true)
      });

      streams.push({
        title: `استخراج مسار الصوت نقي (MP3 Audio)`,
        subtitle: `تحويل وحفظ الصوت بأعلى نقاوة 320kbps`,
        badge: `MP3`,
        icon: '🎵',
        action: () => sendDownloadToTayyar(window.location.href, `${document.title}.mp3`, true)
      });
    }

    // Option 2: Detected Network Streams (HLS, MP4, WebM)
    detectedStreamsForTab.forEach((st, idx) => {
      const isM3u8 = st.isHLS || st.isDASH || st.url.includes('.m3u8') || st.url.includes('.mpd');
      streams.push({
        title: isM3u8 ? `بث مباشر HLS/DASH Stream` : `فيديو مسار مباشر (${st.mime || 'MP4'})`,
        subtitle: st.url.length > 55 ? st.url.slice(0, 52) + '...' : st.url,
        badge: isM3u8 ? 'STREAM' : 'DIRECT',
        icon: isM3u8 ? '📡' : '📹',
        action: () => sendDownloadToTayyar(st.url, document.title || `stream_${idx + 1}.mp4`, isM3u8)
      });
    });

    // Option 3: Direct video src if available
    const mediaEl = activePlayerEl ? (activePlayerEl.tagName === 'VIDEO' ? activePlayerEl : activePlayerEl.querySelector('video')) : null;
    const directSrc = mediaEl ? (mediaEl.currentSrc || mediaEl.src) : '';
    if (directSrc && !directSrc.startsWith('blob:') && !streams.some(s => s.subtitle === directSrc)) {
      streams.push({
        title: `رابط ملف الفيديو الأصلي المباشر`,
        subtitle: directSrc.slice(0, 50) + '...',
        badge: 'SOURCE',
        icon: '🎬',
        action: () => sendDownloadToTayyar(directSrc, document.title || 'video.mp4', false)
      });
    }

    if (streams.length === 0) {
      streams.push({
        title: `تحميل الفيديو الحالي عبر تيّار`,
        subtitle: window.location.href.slice(0, 50) + '...',
        badge: 'LINK',
        icon: '⚡',
        action: () => triggerBestDownload()
      });
    }

    countEl.textContent = streams.length;

    streams.forEach((item) => {
      const row = document.createElement('div');
      row.className = 'tayyar-menu-item';
      row.innerHTML = `
        <div class="tayyar-menu-item-left">
          <span class="tayyar-menu-item-icon">${item.icon}</span>
          <div class="tayyar-menu-item-info">
            <span class="tayyar-menu-item-title">${item.title}</span>
            <span class="tayyar-menu-item-subtitle">${item.subtitle}</span>
          </div>
        </div>
        <span class="tayyar-menu-item-badge">${item.badge}</span>
      `;
      row.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeDropdown();
        item.action();
      });
      listEl.appendChild(row);
    });
  }

  function showStatusFeedback(text, state = 'success') {
    if (!badgeEl) return;
    const pill = badgeEl.querySelector('#tayyarPill');
    const label = badgeEl.querySelector('#tayyarLabel');
    const origText = 'تحميل الفيديو';

    label.textContent = text;
    pill.classList.remove('status-success', 'status-offline');
    if (state === 'success') pill.classList.add('status-success');
    if (state === 'offline') pill.classList.add('status-offline');

    setTimeout(() => {
      label.textContent = origText;
      pill.classList.remove('status-success', 'status-offline');
    }, 2800);
  }

  function sendDownloadToTayyar(url, filename = '', isSocial = false) {
    showStatusFeedback('⚡ جاري الإرسال...', 'default');

    chrome.runtime.sendMessage({
      type: 'SEND_URL',
      url: url.trim(),
      referer: window.location.href,
      filename: filename || document.title || 'video.mp4',
      isSocial
    }, (resp) => {
      if (resp && resp.ok) {
        showStatusFeedback('✓ تم الإرسال لتيّار!', 'success');
      } else {
        showStatusFeedback('✕ شغّل تطبيق تيّار', 'offline');
        // If desktop app is closed, offer browser fallback if direct link
        if (!isSocial && /^https?:\/\//i.test(url) && !url.includes('.m3u8')) {
          setTimeout(() => {
            fallbackBrowserDownload(url, filename);
          }, 800);
        }
      }
    });
  }

  async function triggerBestDownload() {
    const best = getBestStreamInfo();
    const plat = getPlatformInfo();

    // 1. Direct Instagram Stories, Facebook Stories, and WhatsApp Web Status Handling
    if (plat.isStory || location.pathname.includes('/stories')) {
      showStatusFeedback('⚡ حفظ الستوري...', 'default');

      // Check for video story element
      const v = (activePlayerEl && activePlayerEl.tagName === 'VIDEO') ? activePlayerEl : (activePlayerEl?.querySelector?.('video') || document.querySelector('section video, div[role="dialog"] video, video'));
      if (v) {
        const vSrc = v.currentSrc || v.src || '';
        // Direct signed CDN URL from Instagram or Facebook!
        if (vSrc && !vSrc.startsWith('blob:') && !vSrc.startsWith('data:')) {
          sendDownloadToTayyar(vSrc, `${plat.name}_Story_${Date.now()}.mp4`, false);
          return;
        }
        // MediaSource/Blob video stream: convert to base64 DataURL and deliver directly to Tayyar
        if (vSrc && (vSrc.startsWith('blob:') || vSrc.startsWith('data:'))) {
          try {
            const res = vSrc.startsWith('data:') ? { dataUrl: vSrc, mime: 'video/mp4' } : await fetchAsDataUrl(vSrc);
            const fname = `${plat.name}_Story_${Date.now()}.mp4`;
            chrome.runtime.sendMessage({ type: 'SEND_BLOB', dataUrl: res.dataUrl, filename: fname }, (resp) => {
              if (resp && resp.ok) {
                showStatusFeedback('✓ تم حفظ الستوري!', 'success');
              } else {
                fallbackBrowserDownload(vSrc, fname);
                showStatusFeedback('✓ تم الحفظ بالمتصفح', 'success');
              }
            });
            return;
          } catch (_) {}
        }
      }

      // Check for photo story element
      const im = (activePlayerEl && activePlayerEl.tagName === 'IMG') ? activePlayerEl : (activePlayerEl?.querySelector?.('img') || document.querySelector('section img, div[role="dialog"] img, img.x5yr21d'));
      if (im) {
        const iSrc = im.currentSrc || im.src || '';
        if (iSrc) {
          try {
            const res = iSrc.startsWith('data:') ? { dataUrl: iSrc, mime: 'image/jpeg' } : await fetchAsDataUrl(iSrc);
            const fname = `${plat.name}_Story_${Date.now()}.jpg`;
            chrome.runtime.sendMessage({ type: 'SEND_BLOB', dataUrl: res.dataUrl, filename: fname }, (resp) => {
              if (resp && resp.ok) {
                showStatusFeedback('✓ تم حفظ الستوري!', 'success');
              } else {
                fallbackBrowserDownload(iSrc, fname);
                showStatusFeedback('✓ تم الحفظ بالمتصفح', 'success');
              }
            });
            return;
          } catch (_) {}
        }
      }
    }

    if (best.type === 'social') {
      sendDownloadToTayyar(window.location.href, best.title, true);
    } else if (best.type === 'hls') {
      sendDownloadToTayyar(best.url, best.title, true);
    } else if (best.type === 'stream' || best.type === 'direct') {
      sendDownloadToTayyar(best.url, best.title, false);
    } else {
      sendDownloadToTayyar(window.location.href, document.title, true);
    }
  }

  /* ================= OVERLAY-PROOF COORDINATE PROXIMITY TRACKING ================= */
  let lastMoveTime = 0;

  function findVideoPlayerUnderPoint(x, y) {
    const elUnder = document.elementFromPoint(x, y);
    if (!elUnder) return null;

    const plat = getPlatformInfo();

    // 0. Dedicated Story Viewer Match (Instagram Stories, Facebook Stories, WhatsApp Web)
    if (plat.isStory || location.pathname.includes('/stories')) {
      const storyContainer = elUnder.closest(`
        section,
        div[role="dialog"],
        [data-testid="story-player"],
        div._ac0q,
        div._ab6-,
        div.x1ned7t2,
        div[role="region"],
        div:has(> video),
        div:has(> img)
      `);
      if (storyContainer) {
        const v = storyContainer.tagName === 'VIDEO' ? storyContainer : storyContainer.querySelector('video');
        if (v) {
          const r = v.getBoundingClientRect();
          if (r.width >= 100 && r.height >= 100) return v;
        }
        const img = storyContainer.tagName === 'IMG' ? storyContainer : storyContainer.querySelector('img');
        if (img) {
          const r = img.getBoundingClientRect();
          if (r.width >= 120 && r.height >= 120) return img;
        }
        return storyContainer;
      }
    }

    // 1. Direct container match
    const container = elUnder.closest(`
      video,
      audio,
      .html5-video-player,
      .html5-video-container,
      .video-js,
      .jwplayer,
      .plyr,
      [data-video-id],
      [data-testid="videoPlayer"],
      [data-testid="videoComponent"],
      .tiktok-video-player,
      .xgplayer,
      div[role="region"]:has(video),
      div:has(> video)
    `);

    if (container) {
      const v = container.tagName === 'VIDEO' ? container : container.querySelector('video');
      if (v) {
        const r = (container.tagName === 'VIDEO' ? v : container).getBoundingClientRect();
        if (r.width >= 120 && r.height >= 70) return container;
      }
    }

    // 2. Scan all visible videos on the page and check coordinate intersection
    const videos = document.querySelectorAll('video, audio');
    for (let i = 0; i < videos.length; i++) {
      const v = videos[i];
      const r = v.getBoundingClientRect();
      if (r.width >= 120 && r.height >= 70 &&
          x >= r.left - 15 && x <= r.right + 15 &&
          y >= r.top - 15 && y <= r.bottom + 15) {
        return v.closest('.html5-video-player, .video-js, .jwplayer, [data-testid="videoPlayer"], .tiktok-video-player') || v;
      }
    }

    return null;
  }

  function positionBadgeOnPlayer(playerEl) {
    initBadgeDOM();
    const isFs = !!document.fullscreenElement;
    const plat = getPlatformInfo();

    // Handle Fullscreen mode: append badge into fullscreen element so it never disappears!
    if (isFs && document.fullscreenElement && badgeEl.parentElement !== document.fullscreenElement) {
      document.fullscreenElement.appendChild(badgeEl);
    } else if (!isFs && badgeEl.parentElement !== document.body) {
      document.body.appendChild(badgeEl);
    }

    const rect = playerEl.getBoundingClientRect();
    const scrollY = isFs ? 0 : window.scrollY;
    const scrollX = isFs ? 0 : window.scrollX;

    // Position at top-right corner of player
    const topPx = Math.max(10, rect.top + scrollY + 12);
    const rightPx = Math.max(12, (isFs ? (playerEl.clientWidth - rect.right) : (window.innerWidth - (rect.right + scrollX))) + 14);

    badgeEl.style.top = `${topPx}px`;
    badgeEl.style.right = `${rightPx}px`;
    badgeEl.style.left = 'auto';

    // Tailor label for Stories vs Videos
    if (playerEl.tagName === 'IMG') {
      labelTextEl.textContent = 'حفظ الستوري (صورة)';
      qualityTagEl.textContent = 'JPG';
      qualityTagEl.style.display = 'inline-block';
    } else if (plat.isStory || location.pathname.includes('/stories')) {
      labelTextEl.textContent = 'حفظ الستوري (فيديو)';
      qualityTagEl.textContent = 'MP4';
      qualityTagEl.style.display = 'inline-block';
    } else {
      labelTextEl.textContent = 'تحميل الفيديو';
      updateBadgeStreamInfo();
    }

    badgeEl.classList.add('visible');
  }

  function handleMouseMove(e) {
    if (!isBadgeEnabled) return;
    const now = Date.now();
    if (now - lastMoveTime < 60) return; // 60ms throttle for silky smooth 60fps
    lastMoveTime = now;

    // If mouse is over the badge itself, keep it open
    if (badgeEl && badgeEl.contains(e.target)) {
      clearTimeout(hideTimer);
      return;
    }

    const player = findVideoPlayerUnderPoint(e.clientX, e.clientY);
    if (player) {
      if (activePlayerEl !== player) {
        activePlayerEl = player;
        fetchTabStreams();
      }
      clearTimeout(hideTimer);
      positionBadgeOnPlayer(player);
    } else if (!isMenuOpen) {
      scheduleHide(2200);
    }
  }

  window.addEventListener('mousemove', handleMouseMove, { passive: true });

  // Hook fullscreen changes to maintain badge visibility
  document.addEventListener('fullscreenchange', () => {
    if (activePlayerEl) {
      setTimeout(() => positionBadgeOnPlayer(activePlayerEl), 100);
    }
  });

  // Hook playback start so badge is ready the moment a video plays
  document.addEventListener('play', (e) => {
    if (e.target && (e.target.tagName === 'VIDEO' || e.target.tagName === 'AUDIO')) {
      activePlayerEl = e.target;
      fetchTabStreams();
    }
  }, true);

  // Initial fetch of detected streams
  fetchTabStreams();
})();
