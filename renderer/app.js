'use strict';
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  /* ---------------- STATE ---------------- */
  const S = {
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

  /* ---------------- FORMATTERS ---------------- */
  const fmtSize = (b) => {
    if (b == null || b < 0) return 'Unknown';
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

    // 4 rows x 24 columns
    const totalCols = 24;
    const totalRows = 4;
    for (let c = 0; c < totalCols; c++) {
      for (let r = 0; r < totalRows; r++) {
        const cell = document.createElement('div');
        cell.className = 'hm-cell';
        // Give some nice random realistic heatmap pattern
        const rand = Math.random();
        if (rand > 0.85) cell.classList.add('lvl-3');
        else if (rand > 0.65) cell.classList.add('lvl-2');
        else if (rand > 0.45) cell.classList.add('lvl-1');
        container.appendChild(cell);
      }
    }
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
      listEl.hidden = true;
    } else {
      emptyState.hidden = true;
      listEl.hidden = false;
      listEl.innerHTML = filtered.slice(0, 3).map((d) => `
        <div class="mini-task-item" style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.05);font-size:12px;">
          <span style="max-width:65%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#fff;">${d.filename || d.url}</span>
          <span style="color:var(--color-cyan);font-weight:600;">${pct(d)}%</span>
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
      let desc = 'Standard mode';
      if (mode === 'eco') {
        limitKB = 2048; // 2 MB/s
        desc = 'Eco mode (2 MB/s limit)';
      } else if (mode === 'slow') {
        limitKB = 512; // 500 KB/s
        desc = 'Slow mode (512 KB/s limit)';
      } else {
        limitKB = 0; // unlimited
        desc = 'Standard mode (No limit)';
      }

      const descEl = $('#speedModeDesc');
      if (descEl) descEl.textContent = desc;

      if (window.tayyar?.settings?.set) {
        window.tayyar.settings.set({ speedLimitKB: limitKB });
      }
      toast(`Speed mode set: ${desc}`);
    });
  });

  /* ---------------- CUSTOMIZE MODE (Image 2) ---------------- */
  const bToggleCustomize = $('#bToggleCustomize');
  const customizeBar = $('#customizeBar');
  const bCloseCustom = $('#bCloseCustom');
  const bApplyCustom = $('#bApplyCustom');
  const bResetCustom = $('#bResetCustom');
  const bPresetMenu = $('#bPresetMenu');
  const presetPopover = $('#presetPopover');
  const curPresetLabel = $('#curPresetLabel');
  const bentoGrid = $('#bentoGrid');

  if (bToggleCustomize) {
    bToggleCustomize.addEventListener('click', () => {
      customizeBar.hidden = false;
      bToggleCustomize.hidden = true;
    });
  }

  const closeCustomize = () => {
    if (customizeBar) customizeBar.hidden = true;
    if (bToggleCustomize) bToggleCustomize.hidden = false;
    if (presetPopover) presetPopover.hidden = true;
  };

  if (bCloseCustom) bCloseCustom.addEventListener('click', closeCustomize);
  if (bApplyCustom) bApplyCustom.addEventListener('click', closeCustomize);
  if (bResetCustom) {
    bResetCustom.addEventListener('click', () => {
      setPreset('compact');
      toast('Layout reset to default');
    });
  }

  if (bPresetMenu) {
    bPresetMenu.addEventListener('click', (e) => {
      e.stopPropagation();
      presetPopover.hidden = !presetPopover.hidden;
    });
  }

  document.addEventListener('click', (e) => {
    if (presetPopover && !presetPopover.contains(e.target) && e.target !== bPresetMenu) {
      presetPopover.hidden = true;
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
    if (presetPopover) presetPopover.hidden = true;
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
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:240px;gap:12px;color:var(--text-dim);">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:48px;height:48px;opacity:0.4;">
            <path d="M12 3v13m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2"/>
          </svg>
          <p style="font-size:14px;">No downloads in this view</p>
          <button class="pill-btn primary" id="bEmptyAdd">Add Download</button>
        </div>
      `;
      const emptyAdd = $('#bEmptyAdd');
      if (emptyAdd) emptyAdd.addEventListener('click', openAddModal);
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

    // Wire clicks on items
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

    // Update toolbar buttons
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

  // Filter pills
  $$('.filter-pill').forEach((pill) => {
    pill.addEventListener('click', () => {
      $$('.filter-pill').forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
      S.dlFilter = pill.dataset.dlFilter;
      renderDownloadsList();
    });
  });

  // Search input
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
          } catch (_) {}
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

  /* ---------------- SETTINGS DETAIL MODAL (Image 3) ---------------- */
  const settingsModal = $('#settingsDetailModal');
  const bCloseSettingsDetail = $('#bCloseSettingsDetail');
  const bSaveSettingsDetail = $('#bSaveSettingsDetail');
  const setModalTitle = $('#setModalTitle');
  const setModalBody = $('#setModalBody');

  const SETTINGS_SECTIONS = {
    general: {
      title: 'General Settings',
      render: () => `
        <label class="field-label">Default Save Folder
          <div class="input-with-btn">
            <input type="text" id="cfgDefaultDir" value="${S.settings.defaultDir || ''}" readonly>
            <button type="button" class="pill-btn outline sm" id="bBrowseCfgDir">Browse</button>
          </div>
        </label>
        <label class="field-label" style="flex-direction:row;align-items:center;gap:10px;margin-top:10px;">
          <input type="checkbox" id="cfgWatchClip" ${S.settings.watchClipboard ? 'checked' : ''}>
          <span>Suggest download when a file link is copied to clipboard</span>
        </label>
      `,
      save: () => ({
        defaultDir: $('#cfgDefaultDir')?.value,
        watchClipboard: $('#cfgWatchClip')?.checked,
      }),
    },
    appearance: {
      title: 'Appearance',
      render: () => `
        <label class="field-label">Theme
          <select id="cfgTheme" class="styled-select">
            <option value="dark" ${S.settings.theme === 'dark' ? 'selected' : ''}>Dark Slate (Motrix Next)</option>
            <option value="light" ${S.settings.theme === 'light' ? 'selected' : ''}>Light Theme</option>
          </select>
        </label>
        <label class="field-label">Language
          <select id="cfgLang" class="styled-select">
            <option value="en" selected>English</option>
            <option value="ar">العربية (Arabic)</option>
          </select>
        </label>
      `,
      save: () => ({
        theme: $('#cfgTheme')?.value,
      }),
    },
    downloads: {
      title: 'Download Settings',
      render: () => `
        <label class="field-label">Max Simultaneous Active Downloads
          <input type="number" id="cfgMaxActive" min="1" max="10" value="${S.settings.maxActive || 3}">
        </label>
        <label class="field-label">Default Connections per Download
          <input type="number" id="cfgConns" min="1" max="32" value="${S.settings.connections || 8}">
        </label>
        <label class="field-label">Max Retries on Connection Failure
          <input type="number" id="cfgRetries" min="0" max="20" value="${S.settings.retries || 5}">
        </label>
      `,
      save: () => ({
        maxActive: parseInt($('#cfgMaxActive')?.value || '3', 10),
        connections: parseInt($('#cfgConns')?.value || '8', 10),
        retries: parseInt($('#cfgRetries')?.value || '5', 10),
      }),
    },
    bittorrent: {
      title: 'Multi-Connection & Acceleration',
      render: () => `
        <p style="font-size:13px;color:var(--text-muted);line-height:1.5;">
          Tayyar uses a dynamic multi-segment HTTP range chunking engine capable of splitting files into up to 32 concurrent connections.
        </p>
        <label class="field-label" style="margin-top:10px;">Dynamic Segment Splitting
          <select class="styled-select">
            <option selected>Aggressive (re-split largest remaining chunk)</option>
            <option>Balanced</option>
            <option>Static allocation</option>
          </select>
        </label>
      `,
      save: () => ({}),
    },
    integration: {
      title: 'Browser & System Integration',
      render: () => `
        <div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:14px;display:flex;flex-direction:column;gap:8px;">
          <div style="display:flex;align-items:center;gap:8px;">
            <span class="status-indicator online"></span>
            <b style="color:#fff;font-size:13px;">Local Extension Bridge</b>
          </div>
          <p style="font-size:12.5px;color:var(--text-muted);">Listening on <code>127.0.0.1:6824</code>. Compatible with Tayyar Chrome & Edge extensions.</p>
        </div>
      `,
      save: () => ({}),
    },
    network: {
      title: 'Network & Proxy',
      render: () => `
        <label class="field-label">Proxy Mode
          <select class="styled-select">
            <option selected>Direct Connection (No proxy)</option>
            <option>Use System Proxy</option>
            <option>HTTP Proxy</option>
            <option>SOCKS5 Proxy</option>
          </select>
        </label>
      `,
      save: () => ({}),
    },
    advanced: {
      title: 'Advanced Settings',
      render: () => `
        <p style="font-size:13px;color:var(--text-muted);">State persistence file:</p>
        <code style="display:block;background:rgba(0,0,0,0.3);padding:8px;border-radius:6px;font-size:11.5px;color:var(--color-cyan);word-break:break-all;">
          ${S.settings.stateFile || 'AppData/Roaming/Tayyar/state.json'}
        </code>
      `,
      save: () => ({}),
    },
    about: {
      title: 'About Tayyar',
      render: () => `
        <div style="text-align:center;padding:12px 0;">
          <h3 style="font-size:18px;color:#fff;margin-bottom:4px;">Tayyar Download Manager</h3>
          <p style="font-size:13px;color:var(--text-muted);">Version 1.0.0 (Open Source Edition)</p>
          <p style="font-size:12px;color:var(--text-dim);margin-top:10px;">Multi-connection download manager with modern Bento UI.</p>
        </div>
      `,
      save: () => ({}),
    },
  };

  let curSectionKey = 'general';

  $$('.settings-card').forEach((card) => {
    card.addEventListener('click', () => {
      const tabKey = card.dataset.settingTab;
      const sec = SETTINGS_SECTIONS[tabKey] || SETTINGS_SECTIONS.general;
      curSectionKey = tabKey;

      if (setModalTitle) setModalTitle.textContent = sec.title;
      if (setModalBody) {
        setModalBody.innerHTML = sec.render();
        const browseBtn = $('#bBrowseCfgDir', setModalBody);
        if (browseBtn) {
          browseBtn.addEventListener('click', async () => {
            if (window.tayyar?.chooseDir) {
              const dir = await window.tayyar.chooseDir();
              if (dir) $('#cfgDefaultDir').value = dir;
            }
          });
        }
      }
      if (settingsModal) settingsModal.showModal();
    });
  });

  if (bCloseSettingsDetail) {
    bCloseSettingsDetail.addEventListener('click', () => {
      if (settingsModal) settingsModal.close();
    });
  }

  if (bSaveSettingsDetail) {
    bSaveSettingsDetail.addEventListener('click', async () => {
      const sec = SETTINGS_SECTIONS[curSectionKey];
      if (sec?.save && window.tayyar?.settings?.set) {
        const patch = sec.save();
        if (patch && Object.keys(patch).length) {
          S.settings = await window.tayyar.settings.set(patch);
          toast('Settings saved successfully');
        }
      }
      if (settingsModal) settingsModal.close();
    });
  }

  /* ---------------- IPC INITIALIZATION ---------------- */
  async function init() {
    initHeatmap();

    if (!window.tayyar) {
      console.warn('Tayyar IPC bridge not found (running in pure browser)');
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
