'use strict';
/**
 * Tayyar download engine — pure Node.js (no Electron dependency, so it is testable).
 * Features: multi-segment downloads with dynamic re-splitting, pause/resume (persisted),
 * queue with max concurrency, scheduler, global speed limiter, retries, auto-categorizing.
 */
const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const crypto = require('crypto');
const { URL } = require('url');
const { EventEmitter } = require('events');

const UA = 'Mozilla/5.0 (compatible; TayyarDM/1.0)';
const MIN_SEGMENT = 512 * 1024;
const MAX_SEGMENTS = 64;

const CATEGORY_EXT = {
  video: ['mp4', 'mkv', 'avi', 'mov', 'wmv', 'flv', 'webm', 'm4v', 'ts'],
  audio: ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'wma'],
  compressed: ['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz', 'iso'],
  documents: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'epub', 'csv'],
  programs: ['exe', 'msi', 'dmg', 'pkg', 'deb', 'rpm', 'apk', 'appimage'],
  images: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'tiff'],
};
const CATEGORY_DIR = {
  video: 'Video', audio: 'Music', compressed: 'Compressed', documents: 'Documents',
  programs: 'Programs', images: 'Images', other: 'General',
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

function categoryOf(name) {
  const ext = path.extname(name || '').slice(1).toLowerCase();
  for (const [k, v] of Object.entries(CATEGORY_EXT)) if (v.includes(ext)) return k;
  return 'other';
}

function sanitizeName(name) {
  let n = String(name || '').replace(/[\x00-\x1f<>:"/\\|?*]+/g, '_').replace(/^[\s.]+|[\s.]+$/g, '');
  if (/^(con|prn|aux|nul|com\d|lpt\d)(\..*)?$/i.test(n)) n = '_' + n;
  if (n.length > 180) {
    const ext = path.extname(n).slice(0, 12);
    n = n.slice(0, 180 - ext.length) + ext;
  }
  return n || 'download';
}

function filenameFrom(headers, urlStr) {
  const cd = headers['content-disposition'] || '';
  let m = /filename\*\s*=\s*([^']*)''([^;]+)/i.exec(cd);
  if (m) {
    try { return sanitizeName(decodeURIComponent(m[2].trim())); } catch (_) { /* fall through */ }
  }
  m = /filename\s*=\s*"?([^";]+)"?/i.exec(cd);
  if (m) return sanitizeName(m[1].trim());
  try {
    const last = decodeURIComponent(path.basename(new URL(urlStr).pathname));
    if (last) return sanitizeName(last);
  } catch (_) { /* ignore */ }
  return 'download';
}

function uniquePath(dir, name) {
  const ext = path.extname(name);
  const base = path.basename(name, ext);
  let p = path.join(dir, name);
  let i = 1;
  while (fs.existsSync(p) || fs.existsSync(p + '.part')) p = path.join(dir, `${base} (${i++})${ext}`);
  return p;
}

/** HTTP(S) request that follows redirects. Resolves { req, res } with res.finalUrl set. */
function request(urlStr, { headers = {}, redirects = 10, timeout = 20000 } = {}) {
  return new Promise((resolve, reject) => {
    let u;
    try { u = new URL(urlStr); } catch (_) { return reject(new Error('Invalid URL')); }
    if (!/^https?:$/.test(u.protocol)) return reject(new Error('Only http/https links are supported'));
    const lib = u.protocol === 'https:' ? https : http;
    const req = lib.request(u, {
      method: 'GET',
      timeout,
      headers: { 'User-Agent': UA, Accept: '*/*', 'Accept-Encoding': 'identity', ...headers },
    }, (res) => {
      if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
        res.resume();
        if (redirects <= 0) return reject(new Error('Too many redirects'));
        return resolve(request(new URL(res.headers.location, u).toString(), { headers, redirects: redirects - 1, timeout }));
      }
      res.finalUrl = u.toString();
      resolve({ req, res });
    });
    req.on('timeout', () => req.destroy(new Error('Connection timed out')));
    req.on('error', reject);
    req.end();
  });
}

class DownloadManager extends EventEmitter {
  constructor({ stateFile, defaultDir }) {
    super();
    this.stateFile = stateFile;
    this.settings = {
      downloadDir: defaultDir,
      connections: 8,
      maxConcurrent: 3,
      speedLimitKB: 0,
      retries: 5,
      autoCategorize: true,
      watchClipboard: true,
      theme: 'dark',
      lang: 'ar',
    };
    this.downloads = [];
    this.active = new Map();
    this._nextFree = 0;
    this._saveTimer = null;
    this._tickN = 0;
    this._load();
    this._timer = setInterval(() => this._tick(), 500);
    if (this._timer.unref) this._timer.unref();
    setImmediate(() => this._schedule());
  }

  /* ---------- persistence ---------- */
  _load() {
    try {
      const s = JSON.parse(fs.readFileSync(this.stateFile, 'utf8'));
      Object.assign(this.settings, s.settings || {});
      this.downloads = Array.isArray(s.downloads) ? s.downloads : [];
      for (const d of this.downloads) if (d.status === 'downloading') d.status = 'paused';
    } catch (_) { /* first run */ }
  }

  _saveSoon() {
    if (this._saveTimer) return;
    this._saveTimer = setTimeout(() => { this._saveTimer = null; this.saveNow(); }, 300);
  }

  saveNow() {
    try {
      fs.mkdirSync(path.dirname(this.stateFile), { recursive: true });
      const tmp = this.stateFile + '.tmp';
      fs.writeFileSync(tmp, JSON.stringify({ settings: this.settings, downloads: this.downloads }));
      fs.renameSync(tmp, this.stateFile);
    } catch (_) { /* best effort */ }
  }

  shutdown() {
    for (const job of [...this.active.values()]) {
      this._stop(job);
      job.d.status = 'paused';
    }
    this.saveNow();
  }

  /* ---------- public API ---------- */
  list() { return this.downloads.map((d) => this._pub(d)); }

  setSettings(patch) {
    const p = { ...patch };
    if ('connections' in p) p.connections = clamp(+p.connections || 8, 1, 32);
    if ('maxConcurrent' in p) p.maxConcurrent = clamp(+p.maxConcurrent || 3, 1, 10);
    if ('speedLimitKB' in p) p.speedLimitKB = Math.max(0, +p.speedLimitKB || 0);
    if ('retries' in p) p.retries = clamp(+p.retries || 0, 0, 20);
    Object.assign(this.settings, p);
    this._saveSoon();
    this._schedule();
    this.emit('settings', this.settings);
    return this.settings;
  }

  async probe(url, referer = '') {
    const { req, res } = await request(url, { headers: { Range: 'bytes=0-0', ...(referer ? { Referer: referer } : {}) } });
    const h = res.headers;
    const code = res.statusCode;
    res.resume();
    req.destroy();
    if (code >= 400 && code !== 416) throw new Error(`HTTP ${code}`);
    let size = -1;
    let resumable = false;
    if (code === 206 || code === 416) {
      const m = /\/(\d+)\s*$/.exec(h['content-range'] || '');
      if (m) { size = +m[1]; resumable = code === 206; }
    } else {
      const cl = parseInt(h['content-length'], 10);
      size = Number.isFinite(cl) ? cl : -1;
    }
    return { finalUrl: res.finalUrl, size, resumable, filename: filenameFrom(h, res.finalUrl), mime: h['content-type'] || '' };
  }

  add({ url, referer = '', filename = '', saveDir = '', connections, startNow = true, startAt = 0 }) {
    const u = new URL(url);
    if (!/^https?:$/.test(u.protocol)) throw new Error('Only http/https links are supported');
    const name = filename ? sanitizeName(filename) : '';
    const d = {
      id: crypto.randomUUID(),
      url: u.toString(), finalUrl: '', referer,
      filename: name, saveDir, path: '',
      category: name ? categoryOf(name) : categoryOf(path.basename(u.pathname)),
      connections: clamp(+connections || this.settings.connections, 1, 32),
      size: -1, downloaded: 0, resumable: false, segments: [],
      status: startAt > Date.now() ? 'scheduled' : (startNow ? 'queued' : 'paused'),
      startAt: startAt || 0, error: null, addedAt: Date.now(), completedAt: 0,
    };
    this.downloads.push(d);
    this.emit('update', this._pub(d));
    this._saveSoon();
    this._schedule();
    return this._pub(d);
  }

  pause(id) {
    const d = this._get(id);
    if (!d) return;
    const job = this.active.get(id);
    if (job) this._stop(job);
    if (['downloading', 'queued', 'scheduled'].includes(d.status)) {
      d.status = 'paused';
      this.emit('update', this._pub(d));
      this._saveSoon();
      this._schedule();
    }
  }

  resume(id) {
    const d = this._get(id);
    if (!d || !['paused', 'error', 'scheduled'].includes(d.status)) return;
    d.status = 'queued';
    d.error = null;
    this.emit('update', this._pub(d));
    this._saveSoon();
    this._schedule();
  }

  pauseAll() { this.downloads.forEach((d) => this.pause(d.id)); }
  resumeAll() { this.downloads.forEach((d) => this.resume(d.id)); }

  remove(id, deleteFile = false) {
    const d = this._get(id);
    if (!d) return;
    const job = this.active.get(id);
    if (job) this._stop(job);
    this.active.delete(id);
    if (d.path) {
      try { fs.unlinkSync(d.path + '.part'); } catch (_) { /* none */ }
      if (deleteFile && d.status === 'completed') { try { fs.unlinkSync(d.path); } catch (_) { /* none */ } }
    }
    this.downloads = this.downloads.filter((x) => x.id !== id);
    this.emit('removed', id);
    this._saveSoon();
    this._schedule();
  }

  /* ---------- internals ---------- */
  _get(id) { return this.downloads.find((d) => d.id === id); }

  _pub(d) {
    const job = this.active.get(d.id);
    const speed = job ? job.speed : 0;
    const eta = speed > 1 && d.size > 0 ? (d.size - d.downloaded) / speed : -1;
    return {
      id: d.id, url: d.url, filename: d.filename, path: d.path, category: d.category,
      size: d.size, downloaded: d.downloaded, status: d.status, error: d.error,
      resumable: d.resumable, connections: d.connections, addedAt: d.addedAt,
      completedAt: d.completedAt, startAt: d.startAt, speed, eta,
      segments: d.segments.map((s) => [s.start, s.end, s.pos]),
    };
  }

  _schedule() {
    const free = this.settings.maxConcurrent - this.active.size;
    if (free <= 0) return;
    const queued = this.downloads.filter((d) => d.status === 'queued' && !this.active.has(d.id)).slice(0, free);
    for (const d of queued) this._start(d);
  }

  _tick() {
    const now = Date.now();
    let changed = false;
    for (const d of this.downloads) {
      if (d.status === 'scheduled' && d.startAt <= now) {
        d.status = 'queued';
        changed = true;
        this.emit('update', this._pub(d));
      }
    }
    if (changed) { this._schedule(); this._saveSoon(); }
    const batch = [];
    for (const job of this.active.values()) {
      const dt = (now - job.lastT) / 1000 || 0.5;
      const inst = (job.bytes - job.lastBytes) / dt;
      job.speed = job.speed ? job.speed * 0.6 + inst * 0.4 : inst;
      job.lastBytes = job.bytes;
      job.lastT = now;
      batch.push(this._pub(job.d));
    }
    if (batch.length) {
      this.emit('progress', batch);
      if (++this._tickN % 10 === 0) this._saveSoon();
    }
  }

  _throttle(n) {
    const limit = this.settings.speedLimitKB * 1024;
    if (!limit) return 0;
    const now = Date.now();
    this._nextFree = Math.max(this._nextFree, now) + (n / limit) * 1000;
    return Math.max(0, this._nextFree - now);
  }

  _stop(job) {
    job.stopped = true;
    for (const r of job.reqs) r.destroy();
    job.reqs.clear();
    if (job.fd != null) { try { fs.closeSync(job.fd); } catch (_) { /* ignore */ } job.fd = null; }
  }

  async _prepare(d) {
    const info = await this.probe(d.url, d.referer);
    d.finalUrl = info.finalUrl;
    d.size = info.size;
    d.resumable = info.resumable;
    if (!d.filename) d.filename = info.filename;
    d.filename = sanitizeName(d.filename);
    d.category = categoryOf(d.filename);
    const base = d.saveDir || this.settings.downloadDir;
    const dir = !d.saveDir && this.settings.autoCategorize ? path.join(base, CATEGORY_DIR[d.category]) : base;
    fs.mkdirSync(dir, { recursive: true });
    d.path = uniquePath(dir, d.filename);
    d.downloaded = 0;
    if (info.resumable && info.size > 0) {
      const n = Math.max(1, Math.min(d.connections, Math.floor(info.size / MIN_SEGMENT)));
      const per = Math.ceil(info.size / n);
      d.segments = [];
      for (let i = 0; i < n; i++) {
        const start = i * per;
        const end = Math.min(info.size - 1, start + per - 1);
        if (start > end) break;
        d.segments.push({ start, end, pos: start });
      }
    } else {
      d.segments = [{ start: 0, end: info.size > 0 ? info.size - 1 : -1, pos: 0 }];
    }
  }

  async _start(d) {
    const job = { d, reqs: new Set(), stopped: false, fd: null, bytes: 0, lastBytes: 0, lastT: Date.now(), speed: 0 };
    this.active.set(d.id, job);
    d.status = 'downloading';
    d.error = null;
    this.emit('update', this._pub(d));
    try {
      if (d.segments.length) {
        const partExists = d.path && fs.existsSync(d.path + '.part');
        if (!partExists || !d.resumable) {
          // Nothing reusable on disk (or server can't resume): restart from zero.
          for (const s of d.segments) s.pos = s.start;
        }
      }
      if (!d.segments.length) await this._prepare(d);
      if (job.stopped) return;
      const part = d.path + '.part';
      job.fd = fs.openSync(part, d.resumable && fs.existsSync(part) ? 'r+' : 'w');
      if (d.resumable && d.size > 0) fs.ftruncateSync(job.fd, d.size);
      d.downloaded = d.segments.reduce((a, s) => a + Math.max(0, s.pos - s.start), 0);
      this.emit('update', this._pub(d));

      await Promise.all(d.segments.slice().map((s) => this._worker(job, s)));
      if (job.stopped) return;

      fs.closeSync(job.fd);
      job.fd = null;
      fs.renameSync(part, d.path);
      if (d.size < 0) d.size = d.downloaded;
      d.downloaded = d.size;
      d.status = 'completed';
      d.completedAt = Date.now();
      this.emit('update', this._pub(d));
      this.emit('complete', this._pub(d));
    } catch (e) {
      if (job.stopped) return;
      this._stop(job);
      d.status = 'error';
      d.error = e.message || String(e);
      this.emit('update', this._pub(d));
      this.emit('error-download', this._pub(d));
    } finally {
      if (this.active.get(d.id) === job) this.active.delete(d.id);
      this._saveSoon();
      this._schedule();
    }
  }

  /** A worker owns one connection: finish its segment, then steal half of the biggest remaining one. */
  async _worker(job, seg) {
    let s = seg;
    while (s && !job.stopped) {
      await this._segmentLoop(job, s);
      s = job.stopped ? null : this._steal(job);
    }
  }

  _steal(job) {
    const d = job.d;
    if (!d.resumable || d.segments.length >= MAX_SEGMENTS) return null;
    let best = null;
    let rem = 0;
    for (const s of d.segments) {
      if (s.end < 0) continue;
      const r = s.end - s.pos + 1;
      if (r > rem) { rem = r; best = s; }
    }
    if (!best || rem < 2 * MIN_SEGMENT) return null;
    const mid = best.pos + Math.floor(rem / 2);
    const ns = { start: mid, end: best.end, pos: mid };
    best.end = mid - 1;
    d.segments.push(ns);
    d.segments.sort((a, b) => a.start - b.start);
    return ns;
  }

  async _segmentLoop(job, seg) {
    let attempt = 0;
    while (!job.stopped) {
      if (seg.end >= 0 && seg.pos > seg.end) return;
      try {
        await this._streamOnce(job, seg);
        return;
      } catch (e) {
        if (job.stopped) return;
        if (e.fatal || ++attempt > this.settings.retries) throw e;
        await sleep(Math.min(1000 * attempt, 8000));
      }
    }
  }

  _streamOnce(job, seg) {
    const d = job.d;
    return new Promise((resolve, reject) => {
      const headers = {};
      if (d.referer) headers.Referer = d.referer;
      if (d.resumable) headers.Range = `bytes=${seg.pos}-${seg.end >= 0 ? seg.end : ''}`;
      else { d.downloaded = 0; seg.pos = 0; }

      request(d.finalUrl || d.url, { headers }).then(({ req, res }) => {
        job.reqs.add(req);
        const done = (fn, arg) => { job.reqs.delete(req); fn(arg); };
        if (d.resumable && res.statusCode !== 206) {
          res.resume(); req.destroy();
          return done(reject, new Error(`Server ignored range request (HTTP ${res.statusCode})`));
        }
        if (res.statusCode >= 400) {
          if (d.finalUrl && d.finalUrl !== d.url) d.finalUrl = d.url; // signed URL may have expired
          res.resume(); req.destroy();
          return done(reject, new Error(`HTTP ${res.statusCode}`));
        }
        res.on('data', (chunk) => {
          if (job.stopped) return;
          let buf = chunk;
          if (seg.end >= 0) buf = buf.subarray(0, Math.max(0, seg.end - seg.pos + 1));
          if (buf.length) {
            try {
              fs.writeSync(job.fd, buf, 0, buf.length, seg.pos);
            } catch (e) {
              e.fatal = true;
              req.destroy();
              return done(reject, e);
            }
            seg.pos += buf.length;
            d.downloaded += buf.length;
            job.bytes += buf.length;
          }
          if (seg.end >= 0 && seg.pos > seg.end) { // finished (or our tail was taken by another worker)
            req.destroy();
            return done(resolve);
          }
          const wait = this._throttle(chunk.length);
          if (wait > 0) { res.pause(); setTimeout(() => res.resume(), wait); }
        });
        res.on('end', () => {
          if (seg.end >= 0 && seg.pos <= seg.end) return done(reject, new Error('Connection closed early'));
          if (seg.end < 0) seg.end = seg.pos - 1; // size was unknown
          done(resolve);
        });
        res.on('error', (e) => done(reject, e));
        res.on('close', () => { if (!res.complete) done(reject, new Error('Connection closed')); });
      }).catch(reject);
    });
  }
}

module.exports = { DownloadManager, categoryOf, sanitizeName, CATEGORY_DIR };
