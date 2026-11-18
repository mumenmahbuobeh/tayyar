'use strict';

/**
 * Tayyar Content Script (Firefox)
 * Detects HTML5 video/audio streams AND Story/Status media (WhatsApp Web, Instagram, Facebook, Snapchat)
 * and provides a non-intrusive floating download badge.
 */

let isBadgeEnabled = true;

chrome.storage?.local?.get({ showVideoBadge: true }, (res) => {
  if (res && res.showVideoBadge === false) isBadgeEnabled = false;
});

let latestDetectedStream = null;
chrome.runtime.onMessage?.addListener((msg) => {
  if (msg.type === 'TAYYAR_STREAM_DETECTED' && msg.media) {
    latestDetectedStream = msg.media;
  }
});

function isStoryPlatformHost() {
  const h = location.hostname.toLowerCase();
  const p = location.pathname.toLowerCase();
  if (h.includes('web.whatsapp.com')) return 'WhatsApp';
  if (h.includes('instagram.com') && p.includes('/stories')) return 'Instagram';
  if (h.includes('facebook.com') && p.includes('/stories')) return 'Facebook';
  if (h.includes('snapchat.com')) return 'Snapchat';
  return '';
}

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
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function createMediaBadge(mediaEl, isStoryImg = false) {
  if (!isBadgeEnabled) return;
  if (mediaEl._hasTayyarBadge) return;
  mediaEl._hasTayyarBadge = true;

  const storyPlat = isStoryPlatformHost();
  const labelText = storyPlat ? `Save ${storyPlat} Story` : 'Download with Tayyar';

  const btn = document.createElement('div');
  btn.className = 'tayyar-media-badge';
  btn.innerHTML = `
    <span class="tayyar-badge-icon">⚡</span>
    <span class="tayyar-badge-text">${labelText}</span>
  `;

  document.body.appendChild(btn);

  function positionBadge() {
    const rect = mediaEl.getBoundingClientRect();
    const minW = isStoryImg ? 220 : 120;
    const minH = isStoryImg ? 220 : 80;
    if (rect.width < minW || rect.height < minH) {
      btn.style.display = 'none';
      return;
    }
    btn.style.display = 'flex';
    btn.style.top = `${Math.max(10, rect.top + window.scrollY + 12)}px`;
    btn.style.left = `${Math.max(10, rect.left + window.scrollX + 12)}px`;
  }

  let hoverTimer = 0;
  mediaEl.addEventListener('mouseenter', () => {
    clearTimeout(hoverTimer);
    positionBadge();
    btn.classList.add('visible');
  });

  mediaEl.addEventListener('mouseleave', () => {
    hoverTimer = setTimeout(() => {
      btn.classList.remove('visible');
    }, 1800);
  });

  btn.addEventListener('mouseenter', () => clearTimeout(hoverTimer));
  btn.addEventListener('mouseleave', () => {
    hoverTimer = setTimeout(() => {
      btn.classList.remove('visible');
    }, 800);
  });

  btn.addEventListener('click', async (e) => {
    e.preventDefault();
    e.stopPropagation();

    let mediaSrc = isStoryImg
      ? (mediaEl.currentSrc || mediaEl.src)
      : (mediaEl.currentSrc || mediaEl.src || (mediaEl.querySelector('source')?.src));

    btn.innerHTML = `<span class="tayyar-badge-text">Saving to Tayyar...</span>`;

    if (mediaSrc && (mediaSrc.startsWith('blob:') || mediaSrc.startsWith('data:'))) {
      try {
        const res = mediaSrc.startsWith('data:')
          ? { dataUrl: mediaSrc, mime: '' }
          : await fetchAsDataUrl(mediaSrc);
        const ext = res.mime.includes('video') || (!isStoryImg && !res.mime.includes('image')) ? 'mp4'
          : res.mime.includes('png') ? 'png'
          : res.mime.includes('webp') ? 'webp' : 'jpg';
        const fname = `${storyPlat || 'Tayyar'}_Story_${Date.now()}.${ext}`;

        chrome.runtime.sendMessage({ type: 'SEND_BLOB', dataUrl: res.dataUrl, filename: fname }, (resp) => {
          if (resp && resp.ok) {
            btn.innerHTML = `<span class="tayyar-badge-text">✓ Saved to Tayyar!</span>`;
          } else {
            fallbackBrowserDownload(mediaSrc, fname);
            btn.innerHTML = `<span class="tayyar-badge-text">✓ Saved via Browser</span>`;
          }
          setTimeout(() => {
            btn.innerHTML = `<span class="tayyar-badge-icon">⚡</span><span class="tayyar-badge-text">${labelText}</span>`;
          }, 2500);
        });
        return;
      } catch (_) {}
    }

    if (!mediaSrc || mediaSrc.startsWith('blob:') || mediaSrc.startsWith('data:')) {
      if (latestDetectedStream && latestDetectedStream.url) {
        mediaSrc = latestDetectedStream.url;
      } else {
        mediaSrc = window.location.href;
      }
    }

    chrome.runtime.sendMessage({ type: 'SEND_URL', url: mediaSrc, referer: window.location.href }, (resp) => {
      if (resp && resp.ok) {
        btn.innerHTML = `<span class="tayyar-badge-text">✓ Sent to Tayyar!</span>`;
      } else {
        btn.innerHTML = `<span class="tayyar-badge-text">Open Tayyar Desktop</span>`;
      }
      setTimeout(() => {
        btn.innerHTML = `<span class="tayyar-badge-icon">⚡</span><span class="tayyar-badge-text">${labelText}</span>`;
      }, 2500);
    });
  });
}

function scanMedia() {
  document.querySelectorAll('video, audio').forEach((el) => {
    createMediaBadge(el, false);
  });

  const storyHost = isStoryPlatformHost();
  if (storyHost) {
    document.querySelectorAll('img').forEach((img) => {
      if (img._hasTayyarBadge) return;
      const src = img.currentSrc || img.src || '';
      if (!src || src.startsWith('data:image/svg')) return;
      const r = img.getBoundingClientRect();
      if (r.width >= 220 && r.height >= 220) {
        createMediaBadge(img, true);
      }
    });
  }
}

scanMedia();
const observer = new MutationObserver(() => scanMedia());
observer.observe(document.body || document.documentElement, { childList: true, subtree: true });
