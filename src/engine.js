'use strict';
/**
 * Tayyar download engine — pure Node.js (no Electron dependency, so it is testable).
 * Features: multi-segment downloads with dynamic re-splitting, pause/resume (persisted),
 * queue with max concurrency, scheduler, global speed limiter, retries, auto-categorizing,
 * universal file types support (200+ formats), and resilient global server compatibility
 * (Russian, Chinese, Iranian, and international CDN servers).
 */
const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const crypto = require('crypto');
const { URL } = require('url');
const { EventEmitter } = require('events');

// Realistic Modern Browser Headers for maximum server compatibility (bypasses WAF, Anti-Hotlink, and Cloudflare)
const DEFAULT_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
const MIN_SEGMENT = 512 * 1024;
const MAX_SEGMENTS = 64;

// High-performance HTTP/HTTPS Agents with relaxed TLS verification for global/regional certificate authorities
const httpAgent = new http.Agent({
  keepAlive: true,
  keepAliveMsecs: 30000,
  maxSockets: 128,
  timeout: 30000,
});

const httpsAgent = new https.Agent({
  keepAlive: true,
  keepAliveMsecs: 30000,
  maxSockets: 128,
  timeout: 30000,
  rejectUnauthorized: false, // Allows Russian (Gost/MinTsifry), Iranian, and Chinese internal/self-signed SSL certificates
});

// Comprehensive list of 200+ file extensions requested by user
const ALL_SUPPORTED_EXTENSIONS = [
  '00*', '3dm', '3ds', '3gp', '3mf', '7z', 'aab', 'aac', 'abc', 'ace', 'afdesign', 'afphoto', 'ai', 'aif', 'aiff',
  'ape', 'apk', 'apkm', 'apks', 'appimage', 'appx', 'appxbundle', 'arj', 'arrow', 'arw', 'asf', 'au', 'avi', 'avro',
  'azw', 'azw3', 'bak', 'bam', 'bin', 'blend', 'bz', 'bz2', 'c4d', 'cab', 'caf', 'cbr', 'cbz', 'ccd', 'chd', 'ckpt',
  'cpio', 'cr2', 'cr3', 'cram', 'cso', 'dae', 'dat', 'dcm', 'dds', 'deb', 'dff', 'divx', 'djvu', 'dmg', 'dng',
  'doc', 'docx', 'dsf', 'dwg', 'dxf', 'eps', 'epub', 'exe', 'exr', 'f3d', 'f4v', 'fasta', 'fastq', 'fb2', 'fbx',
  'feather', 'fig', 'fits', 'flac', 'flatpak', 'fq', 'gcode', 'gcz', 'gem', 'ggml', 'gguf', 'glb', 'gltf', 'gpkg',
  'grib', 'grib2', 'gz', 'gzip', 'h5', 'hdf5', 'hdr', 'iges', 'igs', 'img', 'indd', 'ipa', 'iso', 'isz', 'jar',
  'joblib', 'jsonl', 'keras', 'kra', 'las', 'laz', 'llamafile', 'lwo', 'lz', 'lz4', 'lzh', 'lzma', 'm2t', 'm2ts',
  'm2v', 'm4a', 'm4b', 'm4v', 'ma', 'mat', 'max', 'mb', 'mbtiles', 'mdf', 'mds', 'mid', 'midi', 'mka', 'mkv',
  'mlmodel', 'mobi', 'mov', 'mp3', 'mp4', 'mpa', 'mpe', 'mpeg', 'mpg', 'msi', 'msix', 'msixbundle', 'msp', 'msu',
  'mts', 'mxf', 'nc', 'ndjson', 'nef', 'nemo', 'nii', 'npy', 'npz', 'nrg', 'nsp', 'nsz', 'nupkg', 'obj', 'odp',
  'ods', 'odt', 'ogg', 'ogm', 'ogv', 'onnx', 'opus', 'orc', 'orf', 'otf', 'ova', 'ovf', 'pak', 'parquet', 'pb',
  'pbf', 'pdf', 'pickle', 'pk3', 'pk4', 'pkg', 'pkl', 'plj', 'ply', 'potx', 'pps', 'ppsx', 'ppt', 'pptx', 'psb',
  'psd', 'pt', 'pth', 'qcow', 'qcow2', 'qt', 'r0*', 'r1*', 'r2*', 'r3*', 'r4*', 'r5*', 'r6*', 'r7*', 'r8*', 'r9*',
  'ra', 'raf', 'rar', 'rds', 'rm', 'rmvb', 'rpm', 'rtf', 'run', 'rvz', 'rw2', 'safetensors', 'sea', 'sf2', 'sfz',
  'shp', 'sit', 'sitx', 'sketch', 'skp', 'sldasm', 'sldprt', 'snap', 'sqlite', 'sqlite3', 'step', 'stl', 'stp',
  'tar', 'tbz', 'tbz2', 'tflite', 'tga', 'tgz', 'tif', 'tiff', 'tlz', 'torrent', 'tta', 'ttc', 'ttf', 'txz',
  'tzst', 'unitypackage', 'usd', 'usda', 'usdc', 'usdz', 'vdb', 'vdi', 'vhd', 'vhdx', 'vmdk', 'vob', 'vpk',
  'vsix', 'wav', 'wbfs', 'webm', 'whl', 'wim', 'wma', 'wmv', 'wrl', 'wtv', 'wua', 'wv', 'x3d', 'xapk', 'xcf',
  'xci', 'xls', 'xlsb', 'xlsm', 'xlsx', 'xz', 'z', 'z0*', 'zip', 'zipx', 'zpr', 'zst', 'ztl'
];

const CATEGORY_EXT = {
  video: [
    '3gp', 'asf', 'avi', 'divx', 'f4v', 'm2t', 'm2ts', 'm2v', 'm4v', 'mkv', 'mov', 'mp4',
    'mpe', 'mpeg', 'mpg', 'mts', 'mxf', 'ogm', 'ogv', 'qt', 'rm', 'rmvb', 'vob', 'webm', 'wmv', 'wtv', 'flv', 'ts'
  ],
  audio: [
    'aac', 'abc', 'aif', 'aiff', 'ape', 'au', 'caf', 'dff', 'dsf', 'flac', 'm4a', 'm4b',
    'mid', 'midi', 'mka', 'mp3', 'mpa', 'ogg', 'opus', 'ra', 'sf2', 'sfz', 'tta', 'wav', 'wma', 'wv'
  ],
  compressed: [
    '00*', '7z', 'ace', 'arj', 'bz', 'bz2', 'cab', 'cbr', 'cbz', 'ccd', 'chd', 'cpio', 'cso',
    'dmg', 'gcz', 'gz', 'gzip', 'img', 'iso', 'isz', 'lz', 'lz4', 'lzh', 'lzma', 'mdf', 'mds',
    'nrg', 'ova', 'ovf', 'pak', 'pk3', 'pk4', 'qcow', 'qcow2', 'r0*', 'r1*', 'r2*', 'r3*', 'r4*',
    'r5*', 'r6*', 'r7*', 'r8*', 'r9*', 'rar', 'rvz', 'sea', 'sit', 'sitx', 'tar', 'tbz', 'tbz2',
    'tgz', 'tlz', 'txz', 'tzst', 'vdi', 'vhd', 'vhdx', 'vmdk', 'wbfs', 'wim', 'xz', 'z', 'z0*', 'zip', 'zipx', 'zst'
  ],
  documents: [
    'azw', 'azw3', 'djvu', 'doc', 'docx', 'epub', 'fb2', 'mobi', 'odp', 'ods', 'odt', 'pdf',
    'potx', 'pps', 'ppsx', 'ppt', 'pptx', 'rtf', 'txt', 'xls', 'xlsb', 'xlsm', 'xlsx', 'csv'
  ],
  programs: [
    'aab', 'apk', 'apkm', 'apks', 'appimage', 'appx', 'appxbundle', 'deb', 'exe', 'flatpak',
    'ipa', 'jar', 'llamafile', 'msi', 'msix', 'msixbundle', 'msp', 'msu', 'nupkg', 'pkg', 'rpm',
    'run', 'snap', 'vpk', 'vsix', 'whl', 'xapk'
  ],
  design3d: [
    '3dm', '3ds', '3mf', 'blend', 'c4d', 'dae', 'dxf', 'dwg', 'f3d', 'fbx', 'gcode', 'glb',
    'gltf', 'iges', 'igs', 'lwo', 'ma', 'max', 'mb', 'obj', 'ply', 'skp', 'sldasm', 'sldprt',
    'step', 'stl', 'stp', 'unitypackage', 'usd', 'usda', 'usdc', 'usdz', 'vdb', 'wrl', 'x3d', 'zpr', 'ztl'
  ],
  graphics: [
    'afdesign', 'afphoto', 'ai', 'arw', 'cr2', 'cr3', 'dcm', 'dds', 'dng', 'eps', 'exr',
    'fig', 'fits', 'hdr', 'indd', 'kra', 'nef', 'orf', 'psb', 'psd', 'raf', 'rw2', 'sketch',
    'tga', 'tif', 'tiff', 'xcf', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'
  ],
  aiml: [
    'arrow', 'avro', 'bam', 'ckpt', 'cram', 'dat', 'fasta', 'fastq', 'feather', 'fq', 'gem',
    'ggml', 'gguf', 'gpkg', 'grib', 'grib2', 'h5', 'hdf5', 'joblib', 'jsonl', 'keras', 'las',
    'laz', 'mat', 'mbtiles', 'mlmodel', 'nc', 'ndjson', 'nemo', 'nii', 'npy', 'npz', 'onnx',
    'orc', 'parquet', 'pb', 'pbf', 'pickle', 'pkl', 'plj', 'pt', 'pth', 'rds', 'safetensors',
    'shp', 'sqlite', 'sqlite3', 'tflite'
  ],
  fonts: ['otf', 'ttc', 'ttf'],
  gaming: ['nsp', 'nsz', 'xci', 'wua'],
  torrent: ['torrent'],
  backup: ['bak', 'bin'],
};

const CATEGORY_DIR = {
  video: 'Video',
  audio: 'Music',
  compressed: 'Compressed',
  documents: 'Documents',
  programs: 'Programs',
  design3d: '3D-Models',
  graphics: 'Images',
  aiml: 'AI-Datasets',
  fonts: 'Fonts',
  gaming: 'Games-ROMs',
  torrent: 'Torrents',
  backup: 'Backups',
  other: 'General',
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

function matchExtPattern(ext, pat) {
  if (pat.endsWith('*')) {
    return ext.startsWith(pat.slice(0, -1));
  }
  return ext === pat;
}

function categoryOf(name) {
  const ext = path.extname(name || '').slice(1).toLowerCase();
  if (!ext) return 'other';

  for (const [k, list] of Object.entries(CATEGORY_EXT)) {
    for (const pat of list) {
      if (matchExtPattern(ext, pat)) return k;
    }
  }
  return 'other';
}

function sanitizeName(name) {
  // Retains full UTF-8 Unicode characters (Arabic, Cyrillic, Chinese, Persian) while stripping forbidden Windows filesystem characters
  let n = String(name || '').replace(/[\x00-\x1f<>:"/\\|?*]+/g, '_').replace(/^[\s.]+|[\s.]+$/g, '');
  if (/^(con|prn|aux|nul|com\d|lpt\d)(\..*)?$/i.test(n)) n = '_' + n;
  if (n.length > 200) {
    const ext = path.extname(n).slice(0, 16);
    n = n.slice(0, 200 - ext.length) + ext;
  }
  return n || 'download';
}

function mimeToExt(mime) {
  if (!mime) return '';
  const m = mime.toLowerCase();
  if (m.includes('application/pdf')) return '.pdf';
  if (m.includes('application/zip') || m.includes('application/x-zip')) return '.zip';
  if (m.includes('application/x-rar') || m.includes('application/vnd.rar')) return '.rar';
  if (m.includes('application/x-7z')) return '.7z';
  if (m.includes('application/x-tar')) return '.tar';
  if (m.includes('application/gzip')) return '.gz';
  if (m.includes('video/mp4')) return '.mp4';
  if (m.includes('video/x-matroska')) return '.mkv';
  if (m.includes('audio/mpeg')) return '.mp3';
  if (m.includes('audio/mp4') || m.includes('audio/m4a')) return '.m4a';
  if (m.includes('image/jpeg')) return '.jpg';
  if (m.includes('image/png')) return '.png';
  if (m.includes('image/webp')) return '.webp';
  if (m.includes('application/vnd.android.package-archive')) return '.apk';
  if (m.includes('application/msword')) return '.doc';
  if (m.includes('wordprocessingml.document')) return '.docx';
  if (m.includes('application/vnd.ms-excel')) return '.xls';
  if (m.includes('spreadsheetml.sheet')) return '.xlsx';
  if (m.includes('presentationml.presentation')) return '.pptx';
  return '';
}

function filenameFrom(headers, urlStr) {
  const cd = headers['content-disposition'] || '';
  let foundName = '';

  // 1. RFC 5987 / RFC 6266 filename*=utf-8''... (Standard for international Russian, Chinese, Iranian file servers)
  let m = /filename\*\s*=\s*([^']*)''([^;]+)/i.exec(cd);
  if (m) {
    try {
      const decoded = decodeURIComponent(m[2].trim());
      if (decoded) foundName = sanitizeName(decoded);
    } catch (_) { /* fall through */ }
  }

  // 2. Standard filename="..." (with multi-encoding fallback for legacy servers)
  if (!foundName) {
    m = /filename\s*=\s*"([^"]+)"|filename\s*=\s*([^;]+)/i.exec(cd);
    if (m) {
      let raw = (m[1] || m[2] || '').trim();
      try { raw = decodeURIComponent(raw); } catch (_) {}
      try {
        // Fix ISO-8859-1 misinterpretation of UTF-8 sequences (frequent on Russian and Persian servers)
        const buf = Buffer.from(raw, 'binary');
        if (buf.length > 0) {
          const utf8 = buf.toString('utf8');
          if (!utf8.includes('\ufffd')) raw = utf8;
        }
      } catch (_) {}
      if (raw) foundName = sanitizeName(raw);
    }
  }

  // 3. Fallback to URL pathname or query parameters
  if (!foundName) {
    try {
      const parsed = new URL(urlStr);
      const pathname = parsed.pathname;
      const last = decodeURIComponent(path.basename(pathname));
      if (last && last !== '/' && last !== '.') {
        foundName = sanitizeName(last);
      } else {
        // Check query parameters like ?file=document.pdf or ?filename=paper.pdf or ?name=xyz.pdf
        for (const [k, v] of parsed.searchParams.entries()) {
          if (/(file|filename|name|doc|document|title)/i.test(k) && /\.[a-z0-9]{2,5}$/i.test(v)) {
            foundName = sanitizeName(decodeURIComponent(v));
            break;
          }
        }
      }
    } catch (_) { /* ignore */ }
  }

  if (!foundName) foundName = 'download';

  // 4. Ensure proper extension based on Content-Type (guarantees PDF / Docs / Archives are never saved as script or extensionless files!)
  const scriptExts = ['.php', '.asp', '.aspx', '.jsp', '.cgi', '.do', '.action', '.ashx', '.pl'];
  const curExt = path.extname(foundName).toLowerCase();
  const expectedExt = mimeToExt(headers['content-type'] || '');
  if (expectedExt) {
    if (!curExt || curExt === '.' || scriptExts.includes(curExt)) {
      if (scriptExts.includes(curExt)) {
        foundName = foundName.slice(0, -curExt.length);
      }
      foundName += expectedExt;
    }
  } else if (!curExt && /pdf/i.test(urlStr)) {
    foundName += '.pdf';
  }

  return foundName || 'download';
}

function uniquePath(dir, name) {
  const ext = path.extname(name);
  const base = path.basename(name, ext);
  let p = path.join(dir, name);
  let i = 1;
  while (fs.existsSync(p) || fs.existsSync(p + '.part')) p = path.join(dir, `${base} (${i++})${ext}`);
  return p;
}

/**
 * Robust HTTP(S) request that handles:
 * - Complex multi-hop redirects (accumulating Set-Cookie)
 * - Self-signed, Russian domestic CA, and Iranian SSL certificates (rejectUnauthorized: false)
 * - Anti-hotlink header spoofing (Referer, Sec-CH-UA, Chrome 131 User-Agent)
 * - Connection timeouts & high latency resilience
 */
function request(urlStr, { headers = {}, redirects = 10, timeout = 30000, cookies = [], userAgent = '', isMedia = false } = {}) {
  return new Promise((resolve, reject) => {
    let u;
    try { u = new URL(urlStr); } catch (_) { return reject(new Error('Invalid URL')); }
    if (!/^https?:$/.test(u.protocol)) return reject(new Error('Only http/https links are supported'));

    const isHttps = u.protocol === 'https:';
    const lib = isHttps ? https : http;
    const agent = isHttps ? httpsAgent : httpAgent;

    // Cookie jar accumulation across redirects
    const cookieHeader = cookies.length ? { Cookie: cookies.join('; ') } : {};

    // Standard modern browser headers for maximum compatibility across global servers
    const reqHeaders = isMedia ? {
      'User-Agent': userAgent || DEFAULT_UA,
      'Accept': '*/*',
      'Accept-Language': 'en-US,en;q=0.9,ar;q=0.8',
      'Accept-Encoding': 'identity',
      'Referer': u.origin + '/',
      ...cookieHeader,
      ...headers,
    } : {
      'User-Agent': userAgent || DEFAULT_UA,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'Accept-Language': 'en-US,en;q=0.9,ar;q=0.8,ru;q=0.7,zh-CN;q=0.6,fa;q=0.5',
      'Accept-Encoding': 'identity',
      'Sec-CH-UA': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
      'Sec-CH-UA-Mobile': '?0',
      'Sec-CH-UA-Platform': '"Windows"',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'Upgrade-Insecure-Requests': '1',
      'Referer': u.origin + '/',
      ...cookieHeader,
      ...headers,
    };

    const req = lib.request(u, {
      method: 'GET',
      agent,
      timeout,
      rejectUnauthorized: false, // Essential for Russian/Iranian/Chinese regional and private SSL certs
      headers: reqHeaders,
    }, (res) => {
      // Accumulate cookies across redirect hops
      const setCookies = res.headers['set-cookie'];
      if (setCookies) {
        for (const c of setCookies) {
          const cookiePart = c.split(';')[0];
          if (cookiePart && !cookies.includes(cookiePart)) cookies.push(cookiePart);
        }
      }

      if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
        res.resume();
        if (redirects <= 0) return reject(new Error('Too many redirects'));
        const nextUrl = new URL(res.headers.location, u).toString();
        const nextHeaders = { ...headers, Referer: u.toString() };
        return resolve(request(nextUrl, { headers: nextHeaders, redirects: redirects - 1, timeout, cookies, userAgent, isMedia }));
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
  constructor({ stateFile, defaultDir, downloadDir } = {}) {
    super();
    this.stateFile = stateFile;
    const os = require('os');
    const safeDefault = defaultDir || downloadDir || path.join(os.homedir(), 'Downloads', 'Tayyar');
    this.settings = {
      downloadDir: safeDefault,
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

  async probe(url, referer = '', userAgent = '') {
    let resObj;
    const isMediaUrl = /\.(mp4|mkv|avi|mov|webm|mp3|m4a|wav|flac|aac|ogg)(\?|$)/i.test(url);
    try {
      resObj = await request(url, { headers: { Range: 'bytes=0-0', ...(referer ? { Referer: referer } : {}) }, userAgent, isMedia: isMediaUrl });
      if (resObj.res.statusCode >= 400 && resObj.res.statusCode !== 416) {
        throw new Error(`HTTP ${resObj.res.statusCode}`);
      }
    } catch (_) {
      // Fallback: request without Range for servers rejecting byte ranges on probe (common on PDF/docs portals)
      resObj = await request(url, { headers: { ...(referer ? { Referer: referer } : {}) }, userAgent, isMedia: isMediaUrl });
    }
    const { req, res } = resObj;
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
      if ((h['accept-ranges'] || '').toLowerCase().includes('bytes')) {
        resumable = true;
      }
    }
    return { finalUrl: res.finalUrl, size, resumable, filename: filenameFrom(h, res.finalUrl), mime: h['content-type'] || '' };
  }

  add({ url, referer = '', userAgent = '', filename = '', saveDir = '', dir = '', connections, startNow = true, startAt = 0, isSocial = false, socialUrl = '', formatId = '' }) {
    const u = new URL(url);
    if (!/^https?:$/.test(u.protocol)) throw new Error('Only http/https links are supported');
    const name = filename ? sanitizeName(filename) : '';
    let isSocialDownload = !!isSocial;
    try {
      const social = require('./social');
      if (social.detectPlatform(url) || url.includes('.m3u8') || url.includes('.mpd')) {
        isSocialDownload = true;
      }
    } catch (_) {}
    const d = {
      id: crypto.randomUUID(),
      url: u.toString(), finalUrl: '', referer, userAgent,
      filename: name, saveDir: saveDir || dir || '', path: '',
      category: isSocialDownload ? (name.endsWith('.mp3') || name.endsWith('.m4a') ? 'audio' : 'video') : (name ? categoryOf(name) : categoryOf(path.basename(u.pathname))),
      connections: clamp(+connections || this.settings.connections, 1, 32),
      size: -1, downloaded: 0, resumable: isSocialDownload ? true : false, segments: [],
      status: startAt > Date.now() ? 'scheduled' : (startNow ? 'queued' : 'paused'),
      startAt: startAt || 0, error: null, addedAt: Date.now(), completedAt: 0,
      isSocial: isSocialDownload,
      socialUrl: socialUrl || url,
      formatId: formatId || 'best',
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
    const eta = speed > 1 && d.size > 0 ? (d.size - d.downloaded) / speed : (d.eta != null ? d.eta : -1);
    return {
      id: d.id, url: d.url, filename: d.filename, path: d.path, category: d.category,
      size: d.size, downloaded: d.downloaded, status: d.status, error: d.error,
      resumable: d.resumable, connections: d.connections, addedAt: d.addedAt,
      completedAt: d.completedAt, startAt: d.startAt, speed, eta: Math.round(eta),
      isSocial: !!d.isSocial,
      segments: (d.segments || []).map((s) => [s.start, s.end, s.pos]),
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
      if (job.proc || typeof job.bytes !== 'number') {
        batch.push(this._pub(job.d));
        continue;
      }
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
    if (job.proc) {
      try { job.proc.kill('SIGTERM'); } catch (_) {}
      job.proc = null;
    }
    if (job.reqs) {
      for (const r of job.reqs) r.destroy();
      job.reqs.clear();
    }
    if (job.fd != null) { try { fs.closeSync(job.fd); } catch (_) { /* ignore */ } job.fd = null; }
  }

  async _startSocial(d) {
    const job = { d, proc: null, reqs: new Set(), stopped: false, fd: null, speed: 0, lastBytes: 0, lastT: Date.now() };
    this.active.set(d.id, job);
    d.status = 'downloading';
    d.error = null;
    this.emit('update', this._pub(d));

    try {
      const social = require('./social');
      const bin = social.getYtDlpPath();
      const ffmpegDir = social.getFfmpegDir();

      const base = d.saveDir || this.settings.downloadDir;
      const dir = !d.saveDir && this.settings.autoCategorize ? path.join(base, CATEGORY_DIR[d.category] || 'Video') : base;
      fs.mkdirSync(dir, { recursive: true });

      const isAudio = d.filename.endsWith('.mp3') || d.filename.endsWith('.m4a') || d.category === 'audio' || d.formatId === 'audio' || d.formatId === 'audio_m4a';

      if (!d.filename || d.filename.startsWith('.')) {
        d.filename = `Tayyar_Media_${Date.now()}${isAudio ? '.mp3' : '.mp4'}`;
      }
      if (isAudio) {
        if (!d.filename.endsWith('.mp3') && !d.filename.endsWith('.m4a')) {
          d.filename = d.filename.replace(/\.[a-z0-9]+$/i, '') + '.mp3';
        }
      } else {
        if (!path.extname(d.filename)) d.filename += '.mp4';
      }
      if (!d.path) {
        d.path = uniquePath(dir, d.filename);
      }

      const dirName = path.dirname(d.path);
      const ext = path.extname(d.path) || (isAudio ? '.mp3' : '.mp4');
      const baseName = path.basename(d.path, ext) || `Tayyar_Media_${Date.now()}`;

      const args = [
        '--newline',
        '--no-colors',
        '--no-playlist',
        '--continue',
        '--progress-template', 'progress:%(progress.downloaded_bytes)s/%(progress.total_bytes,progress.total_bytes_estimate)s|%(progress.speed)s|%(progress.eta)s',
      ];

      if (d.referer) {
        args.push('--referer', d.referer);
      }
      if (d.userAgent) {
        args.push('--user-agent', d.userAgent);
      }
      if (ffmpegDir && fs.existsSync(ffmpegDir)) {
        args.push('--ffmpeg-location', ffmpegDir);
      }

      const placeholderIds = new Set(['best', 'direct', 'nowm', 'wm', 'hd', 'og-direct', 'video_adaptive']);
      const isPlaceholderFormat = !d.formatId || placeholderIds.has(d.formatId) || /^video_\d+p?$/i.test(d.formatId);

      if (isAudio) {
        args.push('-f', 'bestaudio/best');
        args.push('-x', '--audio-format', 'mp3');
      } else if (!isPlaceholderFormat) {
        if (d.formatId.includes('+') || d.formatId.includes('[') || d.formatId.includes('/')) {
          args.push('-f', d.formatId);
        } else {
          args.push('-f', `${d.formatId}+bestaudio/${d.formatId}/bestvideo[ext=mp4]+bestaudio[ext=m4a]/bestvideo+bestaudio/best`);
        }
        args.push('--merge-output-format', 'mp4');
      } else {
        args.push('-f', 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/bestvideo+bestaudio/best[ext=mp4]/best');
        args.push('--merge-output-format', 'mp4');
      }

      // Output template: let yt-dlp manage container extension cleanly
      args.push('-o', path.join(dirName, `${baseName}.%(ext)s`));
      args.push(d.socialUrl || d.url);

      await new Promise((resolve, reject) => {
        let stderrBuf = '';
        const cp = require('child_process');
        const proc = cp.spawn(bin, args, { windowsHide: true });
        job.proc = proc;

        proc.stdout.on('data', (chunk) => {
          if (job.stopped) return;
          const text = chunk.toString();
          const match = text.match(/progress:(\d+|NA)\/(\d+(?:\.\d+)?|NA)\|([0-9.]+|NA)\|([0-9.]+|NA)/);
          if (match) {
            if (match[1] !== 'NA') d.downloaded = parseInt(match[1], 10);
            if (match[2] !== 'NA') d.size = Math.round(parseFloat(match[2]));
            const spd = match[3] !== 'NA' ? parseFloat(match[3]) : 0;
            d.speed = Number.isFinite(spd) ? spd : 0;
            job.speed = d.speed;
            d.eta = match[4] !== 'NA' ? Math.round(parseFloat(match[4])) : -1;
            const pub = this._pub(d);
            this.emit('update', pub);
            this.emit('progress', [pub]);
          }
        });

        proc.stderr.on('data', (c) => {
          stderrBuf += c.toString();
        });

        proc.on('error', (err) => {
          if (job.stopped) return resolve();
          reject(err);
        });

        proc.on('close', (code) => {
          job.proc = null;
          if (job.stopped) return resolve();
          if (code === 0) {
            let finalPath = d.path;

            // Check if finalPath exists, or check expected extensions / candidate files
            if (!fs.existsSync(finalPath)) {
              const expectedExts = isAudio ? ['.mp3', '.m4a', '.webm', '.opus'] : ['.mp4', '.mkv', '.webm'];
              for (const ex of expectedExts) {
                const cand = path.join(dirName, `${baseName}${ex}`);
                if (fs.existsSync(cand)) {
                  finalPath = cand;
                  d.path = finalPath;
                  d.filename = path.basename(finalPath);
                  break;
                }
              }
              if (!fs.existsSync(finalPath) && baseName) {
                try {
                  const candidates = fs.readdirSync(dirName).filter((f) => f.startsWith(baseName + '.') && !f.endsWith('.part') && !f.endsWith('.ytdl'));
                  if (candidates.length > 0) {
                    finalPath = path.join(dirName, candidates[0]);
                    d.path = finalPath;
                    d.filename = path.basename(finalPath);
                  }
                } catch (_) {}
              }
            }

            if (fs.existsSync(finalPath)) {
              const stat = fs.statSync(finalPath);
              if (stat.size > 0) {
                d.size = stat.size;
                d.downloaded = stat.size;
                d.speed = 0;
                d.eta = 0;
                d.status = 'completed';
                d.completedAt = Date.now();
                const pub = this._pub(d);
                this.emit('update', pub);
                this.emit('progress', [pub]);
                this.emit('complete', pub);
                return resolve();
              }
              try { fs.unlinkSync(finalPath); } catch (_) {}
              return reject(new Error('Downloaded file is empty (0 bytes)'));
            }
          }
          reject(new Error(stderrBuf.trim() || `Download process exited with code ${code}`));
        });
      });
    } catch (e) {
      if (job.stopped) return;
      console.warn('yt-dlp exited with error, attempting built-in direct stream resolver:', e.message);
      try {
        const social = require('./social');
        const resolved = await social.resolveSocialMedia(d.socialUrl || d.url);
        if (resolved && resolved.ok && resolved.formats && resolved.formats.length > 0) {
          const isAudio = d.filename.endsWith('.mp3') || d.filename.endsWith('.m4a') || d.category === 'audio' || d.formatId === 'audio' || d.formatId === 'audio_m4a';
          const chosen = isAudio
            ? (resolved.formats.find((f) => f.id === 'audio' || f.ext === 'mp3' || f.ext === 'm4a') || resolved.formats[0])
            : (resolved.formats.find((f) => !String(f.id || '').includes('audio')) || resolved.formats[0]);
          const streamUrl = chosen.directUrl || chosen.url;
          const origUrl = d.socialUrl || d.url;
          if (streamUrl && streamUrl !== origUrl && streamUrl !== d.url && !streamUrl.includes('.m3u8') && !streamUrl.includes('.mpd')) {
            console.log('Built-in resolver extracted direct stream, switching to turbo engine:', streamUrl);
            d.url = streamUrl;
            d.finalUrl = streamUrl;
            d.referer = chosen.referer || d.referer || '';
            d.userAgent = chosen.userAgent || d.userAgent || '';
            d.isSocial = false;
            d.segments = [];
            d.path = '';
            return await this._start(d);
          }
        }
      } catch (resErr) {
        console.warn('Built-in fallback resolution error:', resErr.message);
      }
      this._stop(job);
      d.status = 'error';
      d.error = e.message || String(e);
      const pub = this._pub(d);
      this.emit('update', pub);
      this.emit('progress', [pub]);
      this.emit('error-download', pub);
    } finally {
      if (this.active.get(d.id) === job) this.active.delete(d.id);
      this._saveSoon();
      this._schedule();
    }
  }

  async _prepare(d) {
    const info = await this.probe(d.url, d.referer, d.userAgent);
    d.finalUrl = info.finalUrl;
    d.size = info.size;
    d.resumable = info.resumable;
    if (!d.filename) d.filename = info.filename;
    d.filename = sanitizeName(d.filename);
    const ct = (info.mime || '').toLowerCase();
    if (d.filename && /\.(mp4|mkv|avi|mov|webm|flv|ts|mp3|m4a|wav|aac|ogg|flac|zip|rar|7z|iso|exe|dmg|apk|pdf)$/i.test(d.filename)) {
      if (ct.includes('text/html') || ct.includes('application/xhtml+xml') || ct.includes('application/vnd.apple.mpegurl') || ct.includes('application/x-mpegurl') || ct.includes('application/dash+xml')) {
        throw new Error(`Server returned ${ct} instead of downloadable file`);
      }
    }
    d.category = categoryOf(d.filename);
    const os = require('os');
    const base = d.saveDir || this.settings.downloadDir || path.join(os.homedir(), 'Downloads', 'Tayyar');
    const dir = !d.saveDir && this.settings.autoCategorize ? path.join(base, CATEGORY_DIR[d.category] || 'General') : base;
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
    if (d.isSocial) {
      return this._startSocial(d);
    }
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

      const isMedia = d.category === 'video' || d.category === 'audio' || /\.(mp4|mkv|avi|mov|webm|mp3|m4a|wav|aac)(\?|$)/i.test(d.filename || d.url);
      request(d.finalUrl || d.url, { headers, userAgent: d.userAgent || '', isMedia }).then(({ req, res }) => {
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
        const ct = (res.headers['content-type'] || '').toLowerCase();
        if (d.filename && /\.(mp4|mkv|avi|mov|mp3|zip|rar|iso|exe|dmg|apk|pdf)$/i.test(d.filename)) {
          if (ct.includes('text/html') || ct.includes('text/xml') || ct.includes('application/xml') || ct.includes('application/vnd.apple.mpegurl')) {
            res.resume(); req.destroy();
            return done(reject, new Error(`Server returned error response (${ct || 'text/html'}) instead of media file`));
          }
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

function isSupportedExt(ext) {
  if (!ext) return false;
  const clean = ext.toLowerCase().replace(/^\./, '');
  for (const pat of ALL_SUPPORTED_EXTENSIONS) {
    if (matchExtPattern(clean, pat)) return true;
  }
  return false;
}

function isDownloadableUrl(urlStr) {
  try {
    const u = new URL(urlStr);
    if (!/^https?:$/i.test(u.protocol)) return false;
    const ext = path.extname(u.pathname).slice(1).toLowerCase();
    if (ext && isSupportedExt(ext)) return true;
    const full = (u.pathname + u.search).toLowerCase();
    for (const pat of ALL_SUPPORTED_EXTENSIONS) {
      if (pat.endsWith('*')) {
        const prefix = pat.slice(0, -1);
        if (new RegExp(`\\.${prefix}\\d+($|[?&])`, 'i').test(full)) return true;
      } else {
        if (new RegExp(`\\.${pat}($|[?&])`, 'i').test(full)) return true;
      }
    }
    return false;
  } catch (_) {
    return false;
  }
}

module.exports = {
  DownloadManager,
  categoryOf,
  sanitizeName,
  CATEGORY_DIR,
  CATEGORY_EXT,
  ALL_SUPPORTED_EXTENSIONS,
  isSupportedExt,
  isDownloadableUrl,
};

