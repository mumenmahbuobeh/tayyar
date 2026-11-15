'use strict';
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------------- i18n ---------------- */
  const T = {
    ar: {
      app: 'تيّار', add: 'إضافة رابط', resume: 'استئناف', pause: 'إيقاف مؤقت', pauseAll: 'إيقاف الكل', remove: 'حذف',
      categories: 'التصنيفات', addTitle: 'تحميل جديد', urls: 'الرابط (أو عدة روابط، كل رابط في سطر)', saveTo: 'حفظ في',
      browse: 'استعراض', conns: 'الاتصالات', startNow: 'ابدأ الآن', later: 'حمّل لاحقاً', sched: 'جدولة', cancel: 'إلغاء',
      download: 'تحميل', settings: 'الإعدادات', maxActive: 'تحميلات متزامنة', limit: 'حد السرعة (KB/s، 0 = بلا حد)',
      retries: 'إعادة المحاولة', theme: 'المظهر', dark: 'داكن', light: 'فاتح', lang: 'اللغة',
      autoCat: 'ترتيب الملفات في مجلدات حسب النوع', watchClip: 'اقتراح التحميل عند نسخ رابط ملف', save: 'حفظ',
      search: 'بحث في التحميلات',
      all: 'كل التحميلات', active: 'قيد التحميل', waiting: 'في الانتظار', done: 'مكتملة', failed: 'فشلت',
      video: 'فيديو', audio: 'صوتيات', compressed: 'مضغوطات', documents: 'مستندات', programs: 'برامج', images: 'صور', other: 'أخرى',
      s_downloading: 'قيد التحميل', s_completed: 'مكتمل', s_paused: 'متوقف مؤقتاً', s_error: 'فشل', s_queued: 'في الطابور', s_scheduled: 'مجدول',
      size: 'الحجم', downloaded: 'تم تحميله', speed: 'السرعة', eta: 'المتبقي', resumable: 'الاستئناف', yes: 'مدعوم', no: 'غير مدعوم',
      addedAt: 'أُضيف', path: 'المسار', url: 'الرابط', status: 'الحالة', connsNow: 'الاتصالات', unknown: 'غير معروف',
      emptyTitle: 'لا توجد تحميلات هنا', emptyText: 'الصق رابطاً (Ctrl+V) أو انسخ رابط ملف وسنقترح تحميله.',
      pickOne: 'اختر تحميلاً لرؤية توزيع الاتصالات وسرعته.', openFile: 'فتح الملف', openDir: 'إظهار في المجلد',
      checking: 'جارٍ فحص الرابط…', links: 'روابط', probeFail: 'تعذّر فحص الرابط', invalid: 'أدخل رابط http أو https صالحاً',
      badTime: 'اختر وقتاً في المستقبل', resumeYes: 'يدعم الاستئناف', resumeNo: 'لا يدعم الاستئناف',
      confirmDel: 'حذف التحميلات المحددة من القائمة؟', delFile: 'هل تريد حذف الملفات المكتملة من القرص أيضاً؟',
      clip: 'نسخت رابط ملف', waitingSub: 'ينتظر', activeSub: 'يعمل', s: 'ث', m: 'د', h: 'س',
    },
    en: {
      app: 'Tayyar', add: 'Add URL', resume: 'Resume', pause: 'Pause', pauseAll: 'Pause all', remove: 'Delete',
      categories: 'Categories', addTitle: 'New download', urls: 'URL (or several, one per line)', saveTo: 'Save to',
      browse: 'Browse', conns: 'Connections', startNow: 'Start now', later: 'Download later', sched: 'Schedule', cancel: 'Cancel',
      download: 'Download', settings: 'Settings', maxActive: 'Simultaneous downloads', limit: 'Speed limit (KB/s, 0 = none)',
      retries: 'Retries', theme: 'Theme', dark: 'Dark', light: 'Light', lang: 'Language',
      autoCat: 'Sort files into folders by type', watchClip: 'Suggest a download when a file link is copied', save: 'Save',
      search: 'Search downloads',
      all: 'All downloads', active: 'Downloading', waiting: 'Waiting', done: 'Completed', failed: 'Failed',
      video: 'Video', audio: 'Audio', compressed: 'Archives', documents: 'Documents', programs: 'Programs', images: 'Images', other: 'Other',
      s_downloading: 'Downloading', s_completed: 'Completed', s_paused: 'Paused', s_error: 'Failed', s_queued: 'Queued', s_scheduled: 'Scheduled',
      size: 'Size', downloaded: 'Downloaded', speed: 'Speed', eta: 'Time left', resumable: 'Resume', yes: 'Supported', no: 'Not supported',
      addedAt: 'Added', path: 'Location', url: 'URL', status: 'Status', connsNow: 'Connections', unknown: 'Unknown',
      emptyTitle: 'No downloads here', emptyText: 'Paste a link (Ctrl+V) or copy a file link and we will offer to download it.',
      pickOne: 'Select a download to see its connections and speed.', openFile: 'Open file', openDir: 'Show in folder',
      checking: 'Checking link…', links: 'links', probeFail: 'Could not check this link', invalid: 'Enter a valid http or https link',
      badTime: 'Pick a time in the future', resumeYes: 'Supports resume', resumeNo: 'No resume support',
      confirmDel: 'Remove the selected downloads from the list?', delFile: 'Also delete completed files from disk?',
      clip: 'You copied a file link', waitingSub: 'waiting', activeSub: 'active', s: 's', m: 'm', h: 'h',
    },
  };
  let lang = 'ar';
  const t = (k) => (T[lang] && T[lang][k]) || k;

  /* ---------------- icons ---------------- */
  const P = {
    plus: '<path d="M12 5v14M5 12h14"/>', play: '<path d="M8 5l11 7-11 7z"/>', pause: '<path d="M9 5v14M15 5v14"/>',
    stop: '<rect x="6" y="6" width="12" height="12" rx="2"/>', trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
    search: '<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/>',
    sliders: '<path d="M4 7h8M18 7h2M4 17h2M12 17h8"/><circle cx="15" cy="7" r="2.2"/><circle cx="9" cy="17" r="2.2"/>',
    folder: '<path d="M3 7h6l2 2h10v10H3z"/>', open: '<path d="M14 4h6v6M20 4l-9 9M18 14v5H5V6h5"/>',
    all: '<path d="M4 6h16M4 12h16M4 18h16"/>', down: '<path d="M12 4v11m0 0l-4-4m4 4l4-4M5 20h14"/>', wait: '<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>',
    check: '<path d="M5 13l4 4 10-10"/>', warn: '<path d="M12 4l9 16H3zM12 10v4M12 17h.01"/>',
    video: '<rect x="4" y="5" width="16" height="14" rx="2"/><path d="M10 9l5 3-5 3z"/>',
    audio: '<path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/>',
    compressed: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M12 3v8M10 7h4M10 12h4v4h-4z"/>',
    documents: '<path d="M6 3h9l4 4v14H6zM15 3v4h4M9 12h7M9 16h7"/>',
    programs: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 9h18M6.5 7h.01"/>',
    images: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 16l5-5 4 4 3-3 6 6M15 9h.01"/>',
    other: '<path d="M6 3h9l4 4v14H6zM15 3v4h4"/>',
  };
  const svg = (n) => `<svg viewBox="0 0 24 24" aria-hidden="true">${P[n] || P.other}</svg>`;

  /* ---------------- state ---------------- */
  const S = { items: new Map(), sel: new Set(), filter: 'all', q: '', settings: {}, hist: new Map(), gHist: [], anchor: null };
  const CATS = ['video', 'audio', 'compressed', 'documents', 'programs', 'images', 'other'];
  const NAV = [['all', 'all'], ['active', 'down'], ['waiting', 'wait'], ['done', 'check'], ['failed', 'warn']];

  /* ---------------- formatting ---------------- */
  const fmtSize = (b) => {
    if (b == null || b < 0) return t('unknown');
    const u = ['B', 'KB', 'MB', 'GB', 'TB'];
    let i = 0;
    let n = b;
    while (n >= 1024 && i < u.length - 1) { n /= 1024; i++; }
    return `${n >= 100 || i === 0 ? Math.round(n) : n.toFixed(1)} ${u[i]}`;
  };
  const fmtSpeed = (b) => (b >= 1048576 ? `${(b / 1048576).toFixed(1)} MB/s` : `${Math.round(b / 1024)} KB/s`);
  const fmtEta = (s) => {
    if (s == null || s < 0 || !isFinite(s)) return '—';
    s = Math.round(s);
    if (s < 60) return `${s} ${t('s')}`;
    if (s < 3600) return `${Math.floor(s / 60)} ${t('m')} ${s % 60} ${t('s')}`;
    return `${Math.floor(s / 3600)} ${t('h')} ${Math.floor((s % 3600) / 60)} ${t('m')}`;
  };
  const fmtDate = (ts) => {
    try { return new Date(ts).toLocaleString(lang === 'ar' ? 'ar-u-nu-latn' : 'en-GB', { dateStyle: 'medium', timeStyle: 'short' }); } catch (_) { return new Date(ts).toLocaleString(); }
  };
  const pct = (d) => (d.status === 'completed' ? 100 : d.size > 0 ? Math.min(99, Math.floor((d.downloaded / d.size) * 100)) : null);

  /* ---------------- ribbon + sparkline ---------------- */
  function drawRibbon(el, d) {
    el.replaceChildren();
    el.classList.toggle('unknown', d.status === 'downloading' && !(d.size > 0));
    const add = (startPct, widthPct) => {
      const i = document.createElement('i');
      i.style.insetInlineStart = `${startPct}%`;
      i.style.width = `${widthPct}%`;
      el.appendChild(i);
    };
    if (d.status === 'completed') return add(0, 100);
    if (!(d.size > 0)) return;
    for (const [s, e, p] of d.segments) {
      const w = Math.min(p, e >= 0 ? e + 1 : p) - s;
      if (w > 0) add((s / d.size) * 100, (w / d.size) * 100);
    }
  }

  function drawSpark(cv, arr) {
    if (!cv) return;
    const dpr = window.devicePixelRatio || 1;
    const w = cv.clientWidth;
    const h = cv.clientHeight;
    if (!w || !h) return;
    cv.width = w * dpr; cv.height = h * dpr;
    const c = cv.getContext('2d');
    c.scale(dpr, dpr);
    const cs = getComputedStyle(document.documentElement);
    const accent = cs.getPropertyValue('--accent').trim();
    const max = Math.max(1, ...arr) * 1.15;
    const rtl = document.documentElement.dir === 'rtl';
    const x = (i) => { const f = arr.length > 1 ? i / (arr.length - 1) : 1; return (rtl ? 1 - f : f) * w; };
    const y = (v) => h - 4 - (v / max) * (h - 10);
    if (!arr.length) return;
    c.beginPath();
    arr.forEach((v, i) => (i ? c.lineTo(x(i), y(v)) : c.moveTo(x(i), y(v))));
    c.strokeStyle = accent; c.lineWidth = 2; c.lineJoin = 'round'; c.stroke();
    c.lineTo(x(arr.length - 1), h); c.lineTo(x(0), h); c.closePath();
    c.globalAlpha = 0.16; c.fillStyle = accent; c.fill(); c.globalAlpha = 1;
  }

  /* ---------------- list ---------------- */
  const matchFilter = (d) => {
    switch (S.filter) {
      case 'all': return true;
      case 'active': return d.status === 'downloading';
      case 'waiting': return ['queued', 'scheduled', 'paused'].includes(d.status);
      case 'done': return d.status === 'completed';
      case 'failed': return d.status === 'error';
      default: return d.category === S.filter;
    }
  };
  const visible = () => [...S.items.values()]
    .filter((d) => matchFilter(d) && (!S.q || d.filename.toLowerCase().includes(S.q) || d.url.toLowerCase().includes(S.q)))
    .sort((a, b) => b.addedAt - a.addedAt);

  function makeRow(id) {
    const row = document.createElement('div');
    row.className = 'row';
    row.dataset.id = id;
    row.innerHTML = `<div class="r-ico"></div>
      <div class="r-body"><div class="r-name"></div><div class="r-meta"><span class="chip"></span><span class="m-size"></span><span class="m-speed"></span><span class="m-eta"></span></div></div>
      <div class="r-side"><div class="r-pct num"></div><div class="r-act"></div></div>
      <div class="ribbon"></div>`;
    return row;
  }

  function actionsFor(d) {
    const b = (act, ic, title) => `<button class="btn icon sm" data-act="${act}" title="${esc(title)}" aria-label="${esc(title)}"><span class="ic">${svg(ic)}</span></button>`;
    let h = '';
    if (d.status === 'downloading') h += b('pause', 'pause', t('pause'));
    else if (d.status === 'completed') h += b('open', 'open', t('openFile'));
    else h += b('resume', 'play', t('resume'));
    h += b('reveal', 'folder', t('openDir')) + b('remove', 'trash', t('remove'));
    return h;
  }

  function updateRow(row, d) {
    row.className = `row s-${d.status}${S.sel.has(d.id) ? ' sel' : ''}`;
    $('.r-ico', row).innerHTML = svg(d.category);
    $('.r-name', row).textContent = d.filename || d.url;
    $('.r-name', row).title = d.url;
    $('.chip', row).textContent = d.status === 'error' && d.error ? `${t('s_error')}: ${d.error}` : t(`s_${d.status}`);
    $('.m-size', row).textContent = d.size > 0 && d.status !== 'completed' ? `${fmtSize(d.downloaded)} / ${fmtSize(d.size)}` : fmtSize(d.status === 'completed' ? d.size : d.downloaded || -1);
    $('.m-speed', row).textContent = d.status === 'downloading' ? fmtSpeed(d.speed) : '';
    $('.m-eta', row).textContent = d.status === 'downloading' && d.eta >= 0 ? fmtEta(d.eta) : '';
    const p = pct(d);
    $('.r-pct', row).textContent = p == null ? '' : `${p}%`;
    const act = $('.r-act', row);
    const sig = `${d.status}|${lang}`;
    if (act.dataset.sig !== sig) { act.innerHTML = actionsFor(d); act.dataset.sig = sig; }
    drawRibbon($('.ribbon', row), d);
  }

  let raf = 0;
  const scheduleRender = () => { if (!raf) raf = requestAnimationFrame(render); };

  function render() {
    raf = 0;
    const root = $('#list');
    const list = visible();
    if (!list.length) {
      root.innerHTML = `<div class="empty"><h2>${esc(t('emptyTitle'))}</h2><p>${esc(t('emptyText'))}</p>
        <button class="btn primary" data-act="new"><span class="ic">${svg('plus')}</span><span>${esc(t('add'))}</span></button></div>`;
    } else {
      if ($('.empty', root)) root.replaceChildren();
      const existing = new Map($$('.row', root).map((r) => [r.dataset.id, r]));
      const keep = new Set(list.map((d) => d.id));
      existing.forEach((r, id) => { if (!keep.has(id)) r.remove(); });
      list.forEach((d, i) => {
        let row = existing.get(d.id);
        if (!row) row = makeRow(d.id);
        updateRow(row, d);
        if (root.children[i] !== row) root.insertBefore(row, root.children[i] || null);
      });
    }
    renderNav();
    renderToolbar();
    renderDetail();
    renderGauge();
  }

  function renderNav() {
    const all = [...S.items.values()];
    const count = (f) => { const keep = S.filter; S.filter = f; const n = all.filter(matchFilter).length; S.filter = keep; return n; };
    const build = (ul, entries) => {
      if (!ul.children.length) {
        ul.innerHTML = entries.map(([k, ic]) => `<li><button class="nav" data-f="${k}"><span class="ic">${svg(ic)}</span><span class="lbl"></span><span class="cnt num"></span></button></li>`).join('');
      }
      $$('.nav', ul).forEach((b) => {
        const k = b.dataset.f;
        $('.lbl', b).textContent = t(k);
        $('.cnt', b).textContent = count(k);
        b.classList.toggle('on', S.filter === k);
      });
    };
    build($('#navMain'), NAV);
    build($('#navCats'), CATS.map((c) => [c, c]));
  }

  function renderToolbar() {
    const sel = [...S.sel].map((id) => S.items.get(id)).filter(Boolean);
    $('#bResume').disabled = !sel.some((d) => ['paused', 'error', 'scheduled'].includes(d.status));
    $('#bPause').disabled = !sel.some((d) => ['downloading', 'queued', 'scheduled'].includes(d.status));
    $('#bDelete').disabled = !sel.length;
  }

  function renderGauge() {
    const all = [...S.items.values()];
    const total = all.reduce((a, d) => a + (d.status === 'downloading' ? d.speed : 0), 0);
    const txt = fmtSpeed(total).split(' ');
    $('#gSpeed').textContent = txt[0];
    $('#gUnit').textContent = txt[1];
    const act = all.filter((d) => d.status === 'downloading').length;
    const wait = all.filter((d) => d.status === 'queued').length;
    $('#gSub').textContent = `${act} ${t('activeSub')} · ${wait} ${t('waitingSub')}`;
    drawSpark($('#gSpark'), S.gHist);
  }

  /* ---------------- detail ---------------- */
  let detailId = null;
  function renderDetail() {
    const box = $('#detail');
    const id = [...S.sel][0];
    const d = id && S.items.get(id);
    if (!d) { detailId = null; box.innerHTML = `<p class="none">${esc(t('pickOne'))}</p>`; return; }
    if (detailId !== id || box.dataset.lang !== lang) {
      detailId = id;
      box.dataset.lang = lang;
      box.innerHTML = `<h2 id="dName"></h2><div class="chip" id="dChip"></div>
        <div class="ribbon" id="dRibbon"></div><canvas id="dSpark"></canvas>
        <dl>
          <dt>${esc(t('size'))}</dt><dd id="dSize"></dd>
          <dt>${esc(t('downloaded'))}</dt><dd id="dDone"></dd>
          <dt>${esc(t('speed'))}</dt><dd id="dSpeed"></dd>
          <dt>${esc(t('eta'))}</dt><dd id="dEta"></dd>
          <dt>${esc(t('connsNow'))}</dt><dd id="dConns"></dd>
          <dt>${esc(t('resumable'))}</dt><dd id="dRes"></dd>
          <dt>${esc(t('addedAt'))}</dt><dd id="dAdded"></dd>
          <dt>${esc(t('path'))}</dt><dd id="dPath" dir="ltr"></dd>
          <dt>${esc(t('url'))}</dt><dd id="dUrl" dir="ltr"></dd>
        </dl>`;
    }
    patchDetail(d);
  }

  function patchDetail(d) {
    if (!$('#dName')) return;
    $('#dName').textContent = d.filename || d.url;
    $('#dChip').textContent = t(`s_${d.status}`);
    drawRibbon($('#dRibbon'), d);
    $('#dSize').textContent = fmtSize(d.size);
    $('#dDone').textContent = `${fmtSize(d.downloaded)}${pct(d) != null ? ` (${pct(d)}%)` : ''}`;
    $('#dSpeed').textContent = d.status === 'downloading' ? fmtSpeed(d.speed) : '—';
    $('#dEta').textContent = d.status === 'downloading' ? fmtEta(d.eta) : '—';
    $('#dConns').textContent = d.segments.length ? `${d.segments.filter((s) => s[2] <= s[1] || s[1] < 0).length} / ${d.segments.length}` : '—';
    $('#dRes').textContent = d.segments.length ? (d.resumable ? t('yes') : t('no')) : '—';
    $('#dAdded').textContent = fmtDate(d.addedAt);
    $('#dPath').textContent = d.path || '—';
    $('#dUrl').textContent = d.url;
    drawSpark($('#dSpark'), S.hist.get(d.id) || []);
  }

  /* ---------------- selection & actions ---------------- */
  function select(id, e) {
    if (e && (e.ctrlKey || e.metaKey)) { S.sel.has(id) ? S.sel.delete(id) : S.sel.add(id); S.anchor = id; }
    else if (e && e.shiftKey && S.anchor) {
      const ids = visible().map((d) => d.id);
      const a = ids.indexOf(S.anchor);
      const b = ids.indexOf(id);
      if (a >= 0 && b >= 0) { S.sel = new Set(ids.slice(Math.min(a, b), Math.max(a, b) + 1)); }
    } else { S.sel = new Set([id]); S.anchor = id; }
    scheduleRender();
  }

  async function removeIds(ids) {
    if (!ids.length || !confirm(t('confirmDel'))) return;
    const hasDone = ids.some((id) => (S.items.get(id) || {}).status === 'completed');
    const delFile = hasDone && confirm(t('delFile'));
    await window.api.remove(ids, delFile);
  }

  $('#list').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-act]');
    const row = e.target.closest('.row');
    if (btn && btn.dataset.act === 'new') return openAdd();
    if (btn && row) {
      e.stopPropagation();
      const id = row.dataset.id;
      const a = btn.dataset.act;
      if (a === 'pause') window.api.pause([id]);
      else if (a === 'resume') window.api.resume([id]);
      else if (a === 'open') window.api.open(id);
      else if (a === 'reveal') window.api.reveal(id);
      else if (a === 'remove') removeIds([id]);
      return;
    }
    if (row) select(row.dataset.id, e);
    else { S.sel.clear(); scheduleRender(); }
  });
  $('#list').addEventListener('dblclick', (e) => {
    const row = e.target.closest('.row');
    if (row && !e.target.closest('[data-act]')) window.api.open(row.dataset.id);
  });
  $('.rail').addEventListener('click', (e) => {
    const b = e.target.closest('.nav');
    if (b) { S.filter = b.dataset.f; scheduleRender(); }
  });
  $('#bAdd').onclick = () => openAdd();
  $('#bResume').onclick = () => window.api.resume([...S.sel]);
  $('#bPause').onclick = () => window.api.pause([...S.sel]);
  $('#bPauseAll').onclick = () => window.api.pauseAll();
  $('#bDelete').onclick = () => removeIds([...S.sel]);
  $('#q').addEventListener('input', (e) => { S.q = e.target.value.trim().toLowerCase(); scheduleRender(); });

  document.addEventListener('keydown', (e) => {
    const typing = /INPUT|TEXTAREA|SELECT/.test((document.activeElement || {}).tagName || '');
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') { e.preventDefault(); openAdd(); }
    else if (!typing && e.key === 'Delete') removeIds([...S.sel]);
    else if (!typing && (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') { e.preventDefault(); S.sel = new Set(visible().map((d) => d.id)); scheduleRender(); }
    else if (!typing && e.key === 'Enter' && S.sel.size === 1) window.api.open([...S.sel][0]);
  });
  document.addEventListener('paste', (e) => {
    if (/INPUT|TEXTAREA/.test((document.activeElement || {}).tagName || '') || $('dialog[open]')) return;
    const text = (e.clipboardData.getData('text') || '').trim();
    if (/^https?:\/\/\S+/i.test(text)) openAdd(text);
  });

  /* ---------------- toast ---------------- */
  let toastTimer = 0;
  function toast(text, label, cb) {
    const el = $('#toast');
    el.innerHTML = `<span></span><button class="btn primary sm"></button>`;
    $('span', el).textContent = text;
    $('button', el).textContent = label;
    $('button', el).onclick = () => { el.hidden = true; cb(); };
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.hidden = true; }, 9000);
  }

  /* ---------------- add dialog ---------------- */
  const addDlg = $('#addDlg');
  let probeSeq = 0;
  let probeTimer = 0;
  let dirTouched = false;
  let refererFor = '';

  const urlLines = () => $('#aUrl').value.split(/\s*\n\s*/).map((s) => s.trim()).filter(Boolean);
  const defaultAt = () => { const d = new Date(Date.now() + 3600e3); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 16); };

  function openAdd(url = '', referer = '') {
    refererFor = referer;
    dirTouched = false;
    $('#aUrl').value = url;
    $('#aDir').value = S.settings.downloadDir || '';
    $('#aConns').value = String(S.settings.connections || 8);
    $('#aProbe').hidden = true;
    $('#aErr').hidden = true;
    $('#aAt').value = defaultAt();
    $('#aAt').disabled = true;
    $('input[name="aWhen"][value="now"]').checked = true;
    $('#aGo').textContent = t('download');
    if (!addDlg.open) addDlg.showModal();
    $('#aUrl').focus();
    if (url) onUrlInput();
  }

  function onUrlInput() {
    clearTimeout(probeTimer);
    const lines = urlLines();
    $('#aErr').hidden = true;
    $('#aGo').textContent = lines.length > 1 ? `${t('download')} (${lines.length} ${t('links')})` : t('download');
    if (lines.length !== 1 || !/^https?:\/\/\S+$/i.test(lines[0])) { $('#aProbe').hidden = true; return; }
    probeTimer = setTimeout(async () => {
      const seq = ++probeSeq;
      $('#aProbe').hidden = false;
      $('#aName').value = '';
      $('#aMeta').textContent = t('checking');
      $('#aSub').textContent = '';
      const r = await window.api.probe(lines[0], refererFor);
      if (seq !== probeSeq) return;
      if (r.error) { $('#aMeta').textContent = t('probeFail'); $('#aSub').textContent = r.error; return; }
      $('#aName').value = r.filename;
      $('#aMeta').textContent = fmtSize(r.size);
      $('#aSub').textContent = r.resumable ? t('resumeYes') : t('resumeNo');
    }, 450);
  }

  $('#aUrl').addEventListener('input', onUrlInput);
  $$('input[name="aWhen"]').forEach((r) => r.addEventListener('change', () => { $('#aAt').disabled = r.value !== 'sched' || !r.checked; if (r.checked && r.value === 'sched') $('#aAt').disabled = false; }));
  $('#aBrowse').onclick = async () => { const d = await window.api.chooseDir(); if (d) { $('#aDir').value = d; dirTouched = true; } };
  $('#aCancel').onclick = () => addDlg.close();
  $('#addForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const lines = urlLines();
    const err = (m) => { $('#aErr').textContent = m; $('#aErr').hidden = false; };
    if (!lines.length || !lines.every((u) => /^https?:\/\/\S+$/i.test(u))) return err(t('invalid'));
    const when = $('input[name="aWhen"]:checked').value;
    let startAt = 0;
    if (when === 'sched') {
      startAt = Date.parse($('#aAt').value);
      if (!startAt || startAt <= Date.now()) return err(t('badTime'));
    }
    for (const url of lines) {
      const r = await window.api.add({
        url, referer: refererFor, startAt,
        filename: lines.length === 1 ? $('#aName').value.trim() : '',
        saveDir: dirTouched ? $('#aDir').value : '',
        connections: +$('#aConns').value, startNow: when !== 'later',
      });
      if (!r.ok) return err(r.error);
    }
    addDlg.close();
  });

  /* ---------------- settings dialog ---------------- */
  const setDlg = $('#setDlg');
  $('#bSettings').onclick = () => {
    const s = S.settings;
    $('#sDir').value = s.downloadDir; $('#sConns').value = s.connections; $('#sMax').value = s.maxConcurrent;
    $('#sLimit').value = s.speedLimitKB; $('#sRetries').value = s.retries; $('#sTheme').value = s.theme; $('#sLang').value = s.lang;
    $('#sCat').checked = !!s.autoCategorize; $('#sClip').checked = !!s.watchClipboard;
    setDlg.showModal();
  };
  $('#sBrowse').onclick = async () => { const d = await window.api.chooseDir(); if (d) $('#sDir').value = d; };
  $('#sCancel').onclick = () => setDlg.close();
  $('#setForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const s = await window.api.setSettings({
      downloadDir: $('#sDir').value, connections: +$('#sConns').value, maxConcurrent: +$('#sMax').value,
      speedLimitKB: +$('#sLimit').value, retries: +$('#sRetries').value, theme: $('#sTheme').value, lang: $('#sLang').value,
      autoCategorize: $('#sCat').checked, watchClipboard: $('#sClip').checked,
    });
    applySettings(s);
    setDlg.close();
  });

  /* ---------------- settings / i18n application ---------------- */
  function applyI18n() {
    $$('[data-i]').forEach((el) => { el.textContent = t(el.dataset.i); });
    $$('[data-ip]').forEach((el) => { el.placeholder = t(el.dataset.ip); });
    $$('[data-it]').forEach((el) => { el.title = t(el.dataset.it); });
  }
  function applySettings(s) {
    S.settings = s;
    lang = s.lang === 'en' ? 'en' : 'ar';
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dataset.theme = s.theme === 'light' ? 'light' : 'dark';
    document.title = t('app');
    applyI18n();
    $$('#list .row .r-act').forEach((a) => { delete a.dataset.sig; });
    scheduleRender();
  }

  /* ---------------- events from main ---------------- */
  window.api.on('dl:update', (d) => { S.items.set(d.id, d); scheduleRender(); });
  window.api.on('dl:removed', (id) => { S.items.delete(id); S.sel.delete(id); S.hist.delete(id); scheduleRender(); });
  window.api.on('settings', applySettings);
  window.api.on('dl:progress', (batch) => {
    let total = 0;
    for (const d of batch) {
      S.items.set(d.id, d);
      total += d.speed;
      const h = S.hist.get(d.id) || [];
      h.push(d.speed); if (h.length > 60) h.shift();
      S.hist.set(d.id, h);
      const row = $(`.row[data-id="${CSS.escape(d.id)}"]`);
      if (row) updateRow(row, d);
      if (S.sel.has(d.id) && detailId === d.id) patchDetail(d);
    }
    S.gHist.push(total); if (S.gHist.length > 60) S.gHist.shift();
    renderGauge();
    renderNav();
  });
  window.api.on('ui:add-url', ({ url, referer }) => openAdd(url, referer));
  window.api.on('ui:clip-url', ({ url }) => { if (!addDlg.open) toast(`${t('clip')}: ${url}`, t('download'), () => openAdd(url)); });

  /* ---------------- boot ---------------- */
  (async () => {
    $$('[data-ic]').forEach((el) => { el.innerHTML = svg(el.dataset.ic); });
    const plat = await window.api.platform();
    document.body.classList.add(plat === 'darwin' ? 'mac' : plat === 'win32' ? 'win' : 'linux');
    applySettings(await window.api.getSettings());
    (await window.api.list()).forEach((d) => S.items.set(d.id, d));
    scheduleRender();
  })();
})();
