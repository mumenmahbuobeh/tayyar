'use strict';

/**
 * Tayyar Content Script
 * Detects HTML5 video/audio streams and provides a non-intrusive floating download badge (like IDM).
 */

let isBadgeEnabled = true;

chrome.storage?.local?.get({ showVideoBadge: true }, (res) => {
  if (res && res.showVideoBadge === false) isBadgeEnabled = false;
});

let activeBadge = null;

function createMediaBadge(mediaEl) {
  if (!isBadgeEnabled) return;
  if (mediaEl._hasTayyarBadge) return;
  mediaEl._hasTayyarBadge = true;

  const btn = document.createElement('div');
  btn.className = 'tayyar-media-badge';
  btn.innerHTML = `
    <span class="tayyar-badge-icon">⚡</span>
    <span class="tayyar-badge-text">Download with Tayyar</span>
  `;

  document.body.appendChild(btn);

  function positionBadge() {
    const rect = mediaEl.getBoundingClientRect();
    if (rect.width < 120 || rect.height < 80) {
      btn.style.display = 'none';
      return;
    }
    btn.style.display = 'flex';
    btn.style.top = `${Math.max(10, rect.top + window.scrollY + 10)}px`;
    btn.style.left = `${Math.max(10, rect.left + window.scrollX + 10)}px`;
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

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    const mediaSrc = mediaEl.currentSrc || mediaEl.src || (mediaEl.querySelector('source')?.src);
    if (!mediaSrc) {
      btn.innerHTML = `<span class="tayyar-badge-text">No direct stream</span>`;
      setTimeout(() => {
        btn.innerHTML = `<span class="tayyar-badge-icon">⚡</span><span class="tayyar-badge-text">Download with Tayyar</span>`;
      }, 2000);
      return;
    }

    btn.innerHTML = `<span class="tayyar-badge-text">Sending to Tayyar...</span>`;
    chrome.runtime.sendMessage({ type: 'SEND_URL', url: mediaSrc, referer: window.location.href }, (resp) => {
      if (resp && resp.ok) {
        btn.innerHTML = `<span class="tayyar-badge-text">✓ Sent to Tayyar!</span>`;
      } else {
        btn.innerHTML = `<span class="tayyar-badge-text">Open Tayyar Desktop</span>`;
      }
      setTimeout(() => {
        btn.innerHTML = `<span class="tayyar-badge-icon">⚡</span><span class="tayyar-badge-text">Download with Tayyar</span>`;
      }, 2500);
    });
  });
}

function scanMedia() {
  document.querySelectorAll('video, audio').forEach((el) => {
    createMediaBadge(el);
  });
}

// Initial scan & MutationObserver for dynamically loaded players (YouTube, Vimeo, etc.)
scanMedia();
const observer = new MutationObserver(() => scanMedia());
observer.observe(document.body || document.documentElement, { childList: true, subtree: true });
