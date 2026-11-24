'use strict';
const cp = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const qs = require('querystring');

const PLATFORMS = [
  { id: 'youtube', name: 'YouTube', color: '#ff0000', icon: '🎬', pattern: /(?:youtube\.com\/(?:watch\?|shorts\/|live\/|embed\/)|youtu\.be\/)/i },
  { id: 'tiktok', name: 'TikTok', color: '#00f2fe', icon: '🎵', pattern: /(?:tiktok\.com\/|vt\.tiktok\.com\/|vm\.tiktok\.com\/)/i },
  { id: 'instagram', name: 'Instagram', color: '#e1306c', icon: '📸', pattern: /(?:instagram\.com\/(?:p|reel|tv|stories)\/)/i },
  { id: 'facebook', name: 'Facebook', color: '#1877f2', icon: '📘', pattern: /(?:facebook\.com\/(?:watch|reel|videos|stories)|m\.facebook\.com\/stories|fb\.watch\/)/i },
  { id: 'snapchat', name: 'Snapchat', color: '#fffc00', icon: '👻', pattern: /(?:(?:www\.|story\.)?snapchat\.com\/(?:spotlight|t|add|story|s)\/)/i },
  { id: 'whatsapp', name: 'WhatsApp', color: '#25d366', icon: '💬', pattern: /(?:web\.whatsapp\.com|whatsapp\.com)/i },
  { id: 'twitter', name: 'X / Twitter', color: '#1da1f2', icon: '🐦', pattern: /(?:twitter\.com|x\.com)\/[^/]+\/status\//i },
  { id: 'pinterest', name: 'Pinterest', color: '#e60023', icon: '📌', pattern: /(?:pinterest\.com\/pin\/|pin\.it\/)/i },
  { id: 'reddit', name: 'Reddit', color: '#ff4500', icon: '🤖', pattern: /(?:reddit\.com\/r\/[^/]+\/comments\/|v\.redd\.it\/)/i },
  { id: 'threads', name: 'Threads', color: '#000000', icon: '🧵', pattern: /(?:threads\.net|threads\.com)\//i },
  { id: 'vimeo', name: 'Vimeo', color: '#1ab7ea', icon: '📽️', pattern: /vimeo\.com\//i },
  { id: 'dailymotion', name: 'Dailymotion', color: '#0066dc', icon: '📺', pattern: /(?:dailymotion\.com|dai\.ly)\//i },
  { id: 'twitch', name: 'Twitch', color: '#9146ff', icon: '🎮', pattern: /(?:twitch\.tv|clips\.twitch\.tv)\//i },
  { id: 'rumble', name: 'Rumble', color: '#85c742', icon: '🟢', pattern: /rumble\.com\//i },
  { id: 'bilibili', name: 'Bilibili', color: '#00a1d6', icon: '⚡', pattern: /(?:bilibili\.com|b23\.tv)\//i },
  { id: 'streamable', name: 'Streamable', color: '#0f90fa', icon: '📹', pattern: /streamable\.com\//i },
  { id: 'vk', name: 'VK Video', color: '#0077ff', icon: '🇷🇺', pattern: /(?:vk\.com|vkvideo\.ru)\//i },
  { id: 'hls', name: 'HLS Live Stream', color: '#ff9800', icon: '📡', pattern: /\.(?:m3u8|mpd)($|[?#])/i }
];

function detectPlatform(url) {
  if (!url || typeof url !== 'string') return null;
  const u = url.trim();
  for (const p of PLATFORMS) {
    if (p.pattern.test(u)) {
      return { id: p.id, name: p.name, color: p.color, icon: p.icon };
    }
  }
  return null;
}

function getBinDir() {
  const appData = process.env.APPDATA || (process.platform === 'darwin' ? path.join(process.env.HOME, 'Library/Application Support') : path.join(process.env.HOME, '.config'));
  const binDir = path.join(appData, 'tayyar', 'bin');
  try { fs.mkdirSync(binDir, { recursive: true }); } catch (_) {}
  return binDir;
}

function getYtDlpPath() {
  const exe = process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp';
  
  // 1. Packaged Electron app extraResources directory (resources/bin/yt-dlp.exe)
  if (process.resourcesPath) {
    const resBin = path.join(process.resourcesPath, 'bin', exe);
    if (fs.existsSync(resBin)) return resBin;
  }

  // 2. Root local bin folder inside app directory
  const localBin = path.join(__dirname, '..', 'bin', exe);
  if (fs.existsSync(localBin)) return localBin;

  // 3. AppData custom bin directory
  const custom = path.join(getBinDir(), exe);
  if (fs.existsSync(custom)) return custom;

  // 4. Fallback to system PATH
  return exe;
}

function getFfmpegDir() {
  const exe = process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg';

  // 1. Packaged Electron app extraResources directory
  if (process.resourcesPath) {
    const resBin = path.join(process.resourcesPath, 'bin');
    if (fs.existsSync(path.join(resBin, exe))) return resBin;
  }

  // 2. Root local bin folder inside app directory
  const localBin = path.join(__dirname, '..', 'bin');
  if (fs.existsSync(path.join(localBin, exe))) return localBin;

  // 3. AppData custom bin directory
  const custom = getBinDir();
  if (fs.existsSync(path.join(custom, exe))) return custom;

  return localBin;
}

function getFfmpegPath() {
  const exe = process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg';
  const dir = getFfmpegDir();
  const full = path.join(dir, exe);
  if (fs.existsSync(full)) return full;
  return exe;
}

function isYtDlpAvailable() {
  return new Promise((resolve) => {
    const bin = getYtDlpPath();
    cp.execFile(bin, ['--version'], { windowsHide: true, timeout: 6000 }, (err, stdout) => {
      if (err) resolve({ available: false, path: bin });
      else resolve({ available: true, version: stdout ? stdout.trim() : 'active', path: bin });
    });
  });
}

function downloadYtDlp(onProgress) {
  return new Promise((resolve, reject) => {
    const binDir = path.join(__dirname, '..', 'bin');
    try { fs.mkdirSync(binDir, { recursive: true }); } catch (_) {}
    const exe = process.platform === 'win32' ? 'yt-dlp.exe' : (process.platform === 'darwin' ? 'yt-dlp_macos' : 'yt-dlp');
    const targetFile = path.join(binDir, process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp');
    const url = `https://github.com/yt-dlp/yt-dlp/releases/latest/download/${exe}`;

    function fetchUrl(targetUrl) {
      const u = new URL(targetUrl);
      const proto = u.protocol === 'https:' ? https : http;
      proto.get(targetUrl, { headers: { 'User-Agent': 'Tayyar-Downloader/1.0.6' } }, (res) => {
        if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
          return fetchUrl(res.headers.location);
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`Download failed HTTP ${res.statusCode}`));
        }

        const total = parseInt(res.headers['content-length'] || '0', 10);
        let received = 0;
        const fileStream = fs.createWriteStream(targetFile);

        res.on('data', (chunk) => {
          received += chunk.length;
          fileStream.write(chunk);
          if (total > 0 && typeof onProgress === 'function') {
            onProgress({ received, total, percent: Math.round((received / total) * 100) });
          }
        });

        res.on('end', () => {
          fileStream.end();
          try {
            if (process.platform !== 'win32') {
              fs.chmodSync(targetFile, 0o755);
            }
          } catch (_) {}
          resolve({ ok: true, path: targetFile });
        });

        res.on('error', (err) => {
          fileStream.close();
          try { fs.unlinkSync(targetFile); } catch (_) {}
          reject(err);
        });
      }).on('error', reject);
    }

    fetchUrl(url);
  });
}

/**
 * Direct TikWM API resolution (fastest, no watermark, zero scraping token required).
 */
function resolveTikTokTikwm(url) {
  return new Promise((resolve, reject) => {
    const api = `https://www.tikwm.com/api/?url=${encodeURIComponent(url.trim())}`;
    const req = https.get(api, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
      },
      timeout: 10000
    }, (res) => {
      let data = '';
      res.on('data', (c) => data += c);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json && json.code === 0 && json.data) {
            const d = json.data;
            let play = d.play || '';
            if (play && !play.startsWith('http')) play = 'https://www.tikwm.com' + play;
            let wmplay = d.wmplay || '';
            if (wmplay && !wmplay.startsWith('http')) wmplay = 'https://www.tikwm.com' + wmplay;
            let music = d.music || '';
            if (music && !music.startsWith('http')) music = 'https://www.tikwm.com' + music;

            const formats = [];
            if (play) {
              formats.push({
                id: 'nowm',
                formatId: 'nowm',
                quality: '⚡ فيديو أصلي عالي الدقة بدون علامة مائية (MP4)',
                ext: 'mp4',
                url: play,
                directUrl: play,
                isSocial: true
              });
            }
            if (wmplay) {
              formats.push({
                id: 'wm',
                formatId: 'wm',
                quality: '🎬 فيديو بالعلامة المائية (MP4)',
                ext: 'mp4',
                url: wmplay,
                directUrl: wmplay,
                isSocial: true
              });
            }
            if (music) {
              formats.push({
                id: 'audio',
                formatId: 'audio',
                quality: '🎵 ملف صوتي فقط (MP3)',
                ext: 'mp3',
                url: music,
                directUrl: music,
                isSocial: true
              });
            }
            if (formats.length > 0) {
              return resolve({
                ok: true,
                platform: 'TikTok',
                title: d.title || 'TikTok_Video',
                author: d.author?.nickname || d.author?.unique_id || 'TikTok Creator',
                thumbnail: d.cover ? (d.cover.startsWith('http') ? d.cover : 'https://www.tikwm.com' + d.cover) : '',
                duration: d.duration || 0,
                formats
              });
            }
          }
          reject(new Error('TikWM returned no stream data'));
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('TikWM timeout')); });
  });
}

/**
 * Universal fast TikTok scraper via SSSTik (global Cloudflare tikcdn.io CDN — bypasses regional ISP blocks).
 */
async function resolveTikTokSsstik(url) {
  let tt = '';
  try {
    const home = await httpFetchText('https://ssstik.io/');
    const mTt = (home.body || '').match(/tt\s*=\s*'([^']+)'/);
    if (mTt && mTt[1]) tt = mTt[1];
  } catch (_) {}

  return new Promise((resolve, reject) => {
    const postData = qs.stringify({ id: url.trim(), locale: 'en', tt });
    const req = https.request('https://ssstik.io/abc?url=dl', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'Origin': 'https://ssstik.io',
        'Referer': 'https://ssstik.io/en'
      },
      timeout: 12000
    }, (res) => {
      let html = '';
      res.on('data', (c) => html += c);
      res.on('end', () => {
        const titleMatch = html.match(/<p class="maintext">(.*?)<\/p>/s);
        const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : 'TikTok_Video';
        const thumbMatch = html.match(/<img[^>]+src="(https:\/\/tikcdn\.io\/ssstik\/thumb\/[^"]+)"/);
        const thumb = thumbMatch ? thumbMatch[1] : '';

        const formats = [];
        const dlMatches = [...html.matchAll(/href="(https:\/\/tikcdn\.io\/ssstik\/[^"]+)"/g)];
        if (dlMatches.length > 0) {
          formats.push({
            id: 'nowm',
            quality: '⚡ فيديو أصلي عالي الدقة بدون علامة مائية (MP4)',
            ext: 'mp4',
            url: dlMatches[0][1],
            directUrl: dlMatches[0][1],
            referer: 'https://ssstik.io/',
            isSocial: true
          });
        }
        if (dlMatches.length > 1) {
          formats.push({
            id: 'hd',
            quality: '🎬 جودة فائقة HD بدون علامة مائية (MP4)',
            ext: 'mp4',
            url: dlMatches[1][1],
            directUrl: dlMatches[1][1],
            referer: 'https://ssstik.io/',
            isSocial: true
          });
        }
        const audioMatch = html.match(/href="(https:\/\/tikcdn\.io\/ssstik\/mp3\/[^"]+)"/);
        if (audioMatch) {
          formats.push({
            id: 'audio',
            quality: '🎵 ملف صوتي فقط (MP3)',
            ext: 'mp3',
            url: audioMatch[1],
            directUrl: audioMatch[1],
            referer: 'https://ssstik.io/',
            isSocial: true
          });
        }

        if (formats.length > 0) {
          return resolve({
            ok: true,
            platform: 'TikTok',
            title,
            thumbnail: thumb,
            formats
          });
        }
        reject(new Error('No media links returned from TikTok resolver'));
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('TikTok resolver timed out'));
    });
    req.write(postData);
    req.end();
  });
}

/**
 * Piped fallback for YouTube when yt-dlp is absent or fails.
 */
function resolveYouTubePiped(url) {
  return new Promise((resolve, reject) => {
    const m = url.match(/(?:watch\?v=|shorts\/|live\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (!m) return reject(new Error('Invalid YouTube URL'));
    const id = m[1];

    const instances = [
      'https://api.piped.private.coffee',
      'https://pipedapi.ducks.party'
    ];

    let tried = 0;
    function tryInstance(idx) {
      if (idx >= instances.length) return reject(new Error('All Piped instances failed'));
      const host = instances[idx];
      https.get(`${host}/streams/${id}`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        timeout: 8000
      }, (res) => {
        let body = '';
        res.on('data', (c) => body += c);
        res.on('end', () => {
          if (res.statusCode !== 200) return tryInstance(idx + 1);
          try {
            const data = JSON.parse(body);
            const formats = [];
            const vStreams = data.videoStreams || [];
            for (const v of vStreams) {
              if (v.url && v.format === 'MP4') {
                formats.push({
                  id: v.quality || 'video',
                  quality: `🎬 فيديو بدقة ${v.quality || 'HD'} (MP4)`,
                  ext: 'mp4',
                  url: v.url
                });
              }
            }
            const aStreams = data.audioStreams || [];
            if (aStreams.length > 0 && aStreams[0].url) {
              formats.push({
                id: 'audio',
                quality: '🎵 ملف صوتي فقط (Audio Stream)',
                ext: 'm4a',
                url: aStreams[0].url
              });
            }
            if (formats.length > 0) {
              return resolve({
                ok: true,
                platform: 'YouTube',
                title: data.title || 'YouTube_Video',
                author: data.uploader || 'YouTube Channel',
                thumbnail: data.thumbnailUrl || '',
                duration: data.duration || 0,
                formats
              });
            }
            tryInstance(idx + 1);
          } catch (_) {
            tryInstance(idx + 1);
          }
        });
      }).on('error', () => tryInstance(idx + 1));
    }

    tryInstance(0);
  });
}

function resolveYouTubeInnerTube(url) {
  return new Promise((resolve) => {
    const m = url.match(/(?:watch\?v=|shorts\/|live\/|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
    if (!m) return resolve(null);
    const videoId = m[1];
    const postData = JSON.stringify({
      videoId,
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
          gl: 'US'
        }
      },
      contentCheckOk: true,
      racyCheckOk: true
    });
    const ytUa = 'com.google.android.apps.youtube.vr.oculus/1.60.19 (Linux; U; Android 12L; eureka-user Build/SQ3A.220605.009.A1) gzip';
    const req = https.request('https://www.youtube.com/youtubei/v1/player?prettyPrint=false', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': ytUa
      },
      timeout: 10000
    }, (res) => {
      let buf = '';
      res.on('data', c => buf += c);
      res.on('end', () => {
        try {
          const j = JSON.parse(buf);
          const title = j.videoDetails?.title || 'YouTube Video';
          const author = j.videoDetails?.author || 'YouTube';
          const thumb = j.videoDetails?.thumbnail?.thumbnails?.pop()?.url || '';
          const formats = [];
          const prog = j.streamingData?.formats || [];
          for (let i = prog.length - 1; i >= 0; i--) {
            if (prog[i]?.url) {
              const qLabel = prog[i].qualityLabel || 'HD';
              formats.push({
                id: `video_${qLabel}`,
                formatId: `video_${qLabel}`,
                quality: `🌟 فيديو مباشر MP4 مع صوت (${qLabel})`,
                ext: 'mp4',
                url: prog[i].url,
                directUrl: prog[i].url,
                userAgent: ytUa,
                isSocial: false,
                filesize: parseInt(prog[i].contentLength || '0', 10) || -1
              });
              break;
            }
          }
          const adaptive = j.streamingData?.adaptiveFormats || [];
          if (formats.length === 0) {
            const bestVid = adaptive.find((f) => f?.url && String(f.mimeType || '').toLowerCase().startsWith('video/mp4'));
            if (bestVid?.url) {
              formats.push({
                id: 'video_adaptive',
                formatId: 'video_adaptive',
                quality: `🌟 فيديو MP4 عالي الجودة (${bestVid.qualityLabel || 'HD'})`,
                ext: 'mp4',
                url: bestVid.url,
                directUrl: bestVid.url,
                userAgent: ytUa,
                isSocial: false,
                filesize: parseInt(bestVid.contentLength || '0', 10) || -1
              });
            }
          }
          const bestAud = adaptive
            .filter((f) => f?.url && String(f.mimeType || '').toLowerCase().startsWith('audio/mp4'))
            .sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0))[0];
          if (bestAud?.url) {
            formats.push({
              id: 'audio_m4a',
              formatId: 'audio_m4a',
              quality: '🎵 ملف صوتي نقي بدون فيديو (M4A / MP3)',
              ext: 'm4a',
              url: bestAud.url,
              directUrl: bestAud.url,
              userAgent: ytUa,
              isSocial: false,
              filesize: parseInt(bestAud.contentLength || '0', 10) || -1
            });
          }
          if (formats.length) {
            return resolve({
              ok: true,
              platform: 'YouTube',
              platformId: 'youtube',
              title,
              author,
              thumbnail: thumb,
              formats
            });
          }
          resolve(null);
        } catch (_) {
          resolve(null);
        }
      });
    });
    req.on('error', () => resolve(null));
    req.on('timeout', () => { req.destroy(); resolve(null); });
    req.write(postData);
    req.end();
  });
}

/**
 * Primary multi-platform social media resolver.
 */
async function resolveSocialMedia(url) {
  const plat = detectPlatform(url);
  const platId = plat ? plat.id : 'unknown';

  // 1. TikTok: High-speed resolution (SSSTik Cloudflare tikcdn.io FIRST to avoid regional tiktokcdn-us.com blocks!)
  if (platId === 'tiktok') {
    try {
      const res = await resolveTikTokSsstik(url);
      if (res && res.ok && res.formats?.length) {
        return res;
      }
    } catch (e) {
      console.warn('SSSTik failed, trying TikWM / yt-dlp:', e.message);
    }
    try {
      const res = await resolveTikTokTikwm(url);
      if (res && res.ok && res.formats?.length) {
        return res;
      }
    } catch (_) {}
  }

  // 2. YouTube: High-speed InnerTube ANDROID_VR Progressive Direct Stream (zero wait, full audio)
  if (platId === 'youtube') {
    try {
      const ytRes = await resolveYouTubeInnerTube(url);
      if (ytRes && ytRes.ok && ytRes.formats?.length) {
        return ytRes;
      }
    } catch (e) {
      console.warn('InnerTube resolution warning, falling back to yt-dlp:', e.message);
    }
  }

  // 2. Desktop Resolution using yt-dlp
  try {
    let bin = getYtDlpPath();
    if (!fs.existsSync(bin)) {
      try {
        await downloadYtDlp();
        bin = getYtDlpPath();
      } catch (_) {}
    }

    const args = ['--dump-single-json', '--no-warnings', '--prefer-free-formats', url.trim()];

    const res = await new Promise((resolve, reject) => {
      cp.execFile(bin, args, { maxBuffer: 15 * 1024 * 1024, windowsHide: true, timeout: 20000 }, (err, stdout, stderr) => {
        if (err) return reject(new Error(stderr || err.message));
        try {
          const info = JSON.parse(stdout);
          const formats = [];

          // Single direct URL (TikTok, Instagram, Twitter)
          if (info.url && (!info.formats || !info.formats.length)) {
            formats.push({
              id: 'direct',
              quality: '⚡ فيديو مباشر بدون علامة مائية (Direct MP4)',
              ext: info.ext || 'mp4',
              url: info.url,
              directUrl: info.url,
              isSocial: true,
              filesize: info.filesize || -1
            });
          }

          // Multi-format streams (YouTube, Facebook, etc.)
          if (Array.isArray(info.formats)) {
            // 1. High resolution streams (4K, 2K, 1080p, 720p)
            const videoStreams = info.formats
              .filter(f => f.vcodec && f.vcodec !== 'none' && f.height)
              .sort((a, b) => (b.height || 0) - (a.height || 0));

            const seenHeights = new Set();
            for (const f of videoStreams) {
              const h = f.height || 720;
              if (!seenHeights.has(h)) {
                seenHeights.add(h);
                const qLabel = h >= 2160 ? '4K Ultra HD (2160p)' :
                               h >= 1440 ? '2K Quad HD (1440p)' :
                               h >= 1080 ? 'Full HD (1080p)' :
                               h >= 720  ? 'HD (720p)' : `${h}p`;
                const isProgressive = f.acodec && f.acodec !== 'none';
                formats.push({
                  id: f.format_id || String(h),
                  formatId: f.format_id || `bestvideo[height<=${h}]+bestaudio/best`,
                  quality: `🌟 فائقة الوضوح ${qLabel} (MP4)`,
                  ext: 'mp4',
                  url: url.trim(), // Source URL so yt-dlp downloads & merges losslessly
                  directUrl: (isProgressive && f.url && !f.url.includes('.m3u8')) ? f.url : '',
                  isSocial: true,
                  filesize: f.filesize || f.filesize_approx || -1
                });
              }
            }

            // 2. Audio-only stream
            const audioStreams = info.formats
              .filter(f => f.acodec && f.acodec !== 'none' && (!f.vcodec || f.vcodec === 'none'))
              .sort((a, b) => (b.abr || 0) - (a.abr || 0));

            if (audioStreams.length > 0) {
              const a = audioStreams[0];
              formats.push({
                id: a.format_id || 'audio',
                formatId: a.format_id || 'bestaudio/best',
                quality: '🎵 ملف صوتي نقي بدون فيديو (MP3 Audio)',
                ext: 'mp3',
                url: url.trim(),
                directUrl: (a.url && !a.url.includes('.m3u8')) ? a.url : '',
                isSocial: true,
                filesize: a.filesize || -1
              });
            }
          }

          // Fallback format if formats array is empty
          if (formats.length === 0) {
            formats.push({
              id: 'best',
              formatId: 'bestvideo+bestaudio/best',
              quality: '🎬 أعلى جودة متاحة (MP4)',
              ext: 'mp4',
              url: info.url || url.trim(),
              directUrl: info.url || '',
              isSocial: true,
              filesize: info.filesize || -1
            });
          }

          resolve({
            ok: true,
            platform: detectPlatform(url)?.name || 'Media',
            title: info.title || 'Tayyar_Video',
            author: info.uploader || info.channel || info.creator || '',
            thumbnail: info.thumbnail || '',
            duration: info.duration || 0,
            formats
          });
        } catch (parseErr) {
          reject(parseErr);
        }
      });
    });

    return res;
  } catch (err) {
    console.warn('yt-dlp resolution error:', err.message);
  }

  // 3. Fallback: rahad-all-downloader-v2 (Instagram, Facebook, Snapchat, TikTok, Pinterest, Threads, etc.)
  try {
    const { alldl } = require('rahad-all-downloader-v2');
    const dlRes = await alldl(url.trim(), { retries: 1 });
    if (dlRes && dlRes.data && dlRes.data.videoUrl) {
      const vidUrl = dlRes.data.videoUrl;
      const pName = detectPlatform(url)?.name || dlRes.data.source || 'Media';
      return {
        ok: true,
        platform: pName,
        title: dlRes.data.title || `${pName}_Video`,
        author: pName,
        thumbnail: dlRes.data.thumbnail || '',
        formats: [
          {
            id: 'best',
            formatId: 'best',
            quality: '🎬 فيديو أصلي عالي الدقة (MP4)',
            ext: 'mp4',
            url: vidUrl,
            directUrl: vidUrl,
            isSocial: true
          }
        ]
      };
    }
  } catch (alldlErr) {
    console.warn('alldl fallback error:', alldlErr.message);
  }

  // 4. YouTube Fallback via Piped if yt-dlp failed
  if (platId === 'youtube') {
    try {
      return await resolveYouTubePiped(url);
    } catch (pipedErr) {
      console.warn('Piped fallback error:', pipedErr.message);
    }
  }

  // 5. OpenGraph video fallback (Instagram, Facebook, Twitter, TikTok, direct video)
  try {
    return await resolveOpenGraphVideo(url);
  } catch (_) {}

  // 6. Universal Safe Fallback: ALWAYS return a valid playable entry so the download never blocks or fails with an error toast!
  const pName = detectPlatform(url)?.name || 'Media';
  return {
    ok: true,
    platform: pName,
    title: `${pName}_Video`,
    author: pName,
    thumbnail: '',
    formats: [
      {
        id: 'best',
        formatId: 'bestvideo+bestaudio/best',
        quality: '🎬 تحميل مباشر للبث (MP4)',
        ext: 'mp4',
        url: url.trim(),
        directUrl: url.trim(),
        isSocial: true
      }
    ]
  };
}

function resolveOpenGraphVideo(url) {
  return new Promise((resolve, reject) => {
    try {
      const u = new URL(url);
      const client = u.protocol === 'http:' ? http : https;
      const req = client.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        },
        timeout: 10000
      }, (res) => {
        if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
          return resolve(resolveOpenGraphVideo(res.headers.location));
        }
        let html = '';
        res.on('data', (c) => {
          html += c;
          if (html.length > 800000) res.destroy();
        });
        res.on('end', () => {
          const videoMatch = html.match(/<meta[^>]+property=["'](?:og:video|og:video:url|og:video:secure_url)["'][^>]+content=["']([^"']+)["']/i) ||
                             html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["'](?:og:video|og:video:url|og:video:secure_url)["']/i) ||
                             html.match(/<video[^>]+src=["']([^"']+)["']/i);
          if (videoMatch && videoMatch[1]) {
            let vidUrl = videoMatch[1].replace(/&amp;/g, '&');
            const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
            const title = titleMatch ? titleMatch[1].trim() : 'Media_Video';
            return resolve({
              ok: true,
              platform: detectPlatform(url)?.name || 'Media',
              title,
              formats: [{
                id: 'og-direct',
                quality: '🎬 فيديو مباشر عالي الدقة (MP4)',
                ext: 'mp4',
                url: vidUrl
              }]
            });
          }
          reject(new Error('No OpenGraph video stream found'));
        });
      });
      req.on('error', reject);
      req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
    } catch (e) {
      reject(e);
    }
  });
}

function httpFetchText(targetUrl, extraHeaders = {}, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    try {
      const u = new URL(targetUrl);
      const client = u.protocol === 'http:' ? http : https;
      const req = client.get(targetUrl, {
        headers: Object.assign({
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,application/json,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9'
        }, extraHeaders),
        timeout: 12000
      }, (res) => {
        if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location && maxRedirects > 0) {
          let nextUrl = res.headers.location;
          if (nextUrl.startsWith('/')) nextUrl = `${u.protocol}//${u.host}${nextUrl}`;
          res.resume();
          return resolve(httpFetchText(nextUrl, extraHeaders, maxRedirects - 1));
        }
        let body = '';
        res.on('data', (chunk) => {
          body += chunk;
          if (body.length > 2500000) res.destroy();
        });
        res.on('end', () => resolve({ status: res.statusCode || 0, body, url: targetUrl }));
      });
      req.on('error', reject);
      req.on('timeout', () => { req.destroy(); reject(new Error('Request timed out')); });
    } catch (e) {
      reject(e);
    }
  });
}

function cleanStoryName(str, fallback) {
  return String(str || fallback || 'story')
    .replace(/[^a-zA-Z0-9._\-\u0600-\u06FF]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 48) || (fallback || 'story');
}

function extractSnapchatStoriesFromNextData(html, usernameHint) {
  const m = html.match(/<script[^>]+id=["']__NEXT_DATA__["'][^>]*>([\s\S]*?)<\/script>/i);
  if (!m || !m[1]) return { username: usernameHint, stories: [] };
  const json = JSON.parse(m[1]);
  const pp = json?.props?.pageProps || {};
  const userProfile = pp.userProfile?.publicProfileInfo || pp.userProfile?.userInfo || {};
  const username = userProfile.username || userProfile.title || usernameHint || 'snapchat_user';
  const avatar = userProfile.profilePictureUrl || userProfile.squareHeroImageUrl || '';
  const stories = [];
  const seen = new Set();

  const pushSnap = (snap, idx, prefix) => {
    const mediaUrl = snap?.snapUrls?.mediaUrl || snap?.mediaUrl || '';
    if (!mediaUrl || seen.has(mediaUrl)) return;
    seen.add(mediaUrl);
    const isVideo = snap?.snapMediaType === 1 || /\.mp4(\?|$)/i.test(mediaUrl) || mediaUrl.includes('mp4');
    const thumb = snap?.snapUrls?.mediaPreviewUrl?.value || snap?.thumbnailUrl || avatar || (isVideo ? '' : mediaUrl);
    const ext = isVideo ? 'mp4' : 'jpg';
    stories.push({
      id: snap?.snapId?.value || `snap_${prefix}_${idx}`,
      type: isVideo ? 'video' : 'image',
      url: mediaUrl,
      thumbnail: thumb,
      ext,
      filename: `Snapchat_${cleanStoryName(username, 'story')}_${prefix}_${idx + 1}.${ext}`,
      timestamp: snap?.timestampInSec?.value ? Number(snap.timestampInSec.value) * 1000 : Date.now()
    });
  };

  if (Array.isArray(pp.story?.snapList)) {
    pp.story.snapList.forEach((s, i) => pushSnap(s, i, 'story'));
  }
  if (Array.isArray(pp.curatedHighlights)) {
    pp.curatedHighlights.forEach((hl, hIdx) => {
      if (Array.isArray(hl?.snapList)) {
        hl.snapList.forEach((s, i) => pushSnap(s, i, `hl${hIdx + 1}`));
      }
    });
  }
  if (Array.isArray(pp.spotlightHighlights)) {
    pp.spotlightHighlights.forEach((hl, hIdx) => {
      if (Array.isArray(hl?.snapList)) {
        hl.snapList.forEach((s, i) => pushSnap(s, i, `spot${hIdx + 1}`));
      }
    });
  }

  return { username, avatar, stories };
}

async function resolveSnapchatStories(input) {
  let clean = String(input || '').trim();
  let username = '';
  let targetUrls = [];

  if (/^https?:\/\//i.test(clean)) {
    targetUrls.push(clean);
    const uMatch = clean.match(/snapchat\.com\/(?:@|add\/|s\/|story\/|spotlight\/)?([a-zA-Z0-9._-]+)/i);
    if (uMatch) username = uMatch[1];
  } else {
    username = clean.replace(/^@/, '').split(/[/?#]/)[0].trim();
    if (!username) return { ok: false, platform: 'Snapchat', stories: [], error: 'Invalid Snapchat username or URL' };
    targetUrls.push(`https://www.snapchat.com/@${encodeURIComponent(username)}`);
    targetUrls.push(`https://www.snapchat.com/add/${encodeURIComponent(username)}`);
    targetUrls.push(`https://story.snapchat.com/s/${encodeURIComponent(username)}`);
  }

  for (const url of targetUrls) {
    try {
      const { status, body } = await httpFetchText(url, {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
      });
      if (status >= 200 && status < 400 && body) {
        const parsed = extractSnapchatStoriesFromNextData(body, username);
        if (parsed.stories.length > 0) {
          return {
            ok: true,
            platform: 'Snapchat',
            username: parsed.username,
            avatar: parsed.avatar || '',
            stories: parsed.stories
          };
        }
        // Fallback 1: OpenGraph video or image (Spotlight, story shares, /t/ links)
        const ogVid = body.match(/<meta[^>]+property=["']og:video(?::secure_url|:url)?["'][^>]+content=["']([^"']+)["']/i) ||
                      body.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:video(?::secure_url|:url)?["']/i);
        const ogImg = body.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
                      body.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
        if (ogVid && ogVid[1]) {
          const vUrl = ogVid[1].replace(/&amp;/g, '&');
          return {
            ok: true,
            platform: 'Snapchat',
            username: username || 'snapchat',
            stories: [{
              id: 'snap_og_1',
              type: 'video',
              url: vUrl,
              thumbnail: (ogImg && !ogImg[1].includes('facebook') && !ogImg[1].includes('default-preview')) ? ogImg[1].replace(/&amp;/g, '&') : '',
              ext: 'mp4',
              filename: `Snapchat_${cleanStoryName(username || 'story', 'story')}_1.mp4`
            }]
          };
        }

        // Fallback 2: JSON-LD VideoObject
        const jsonLdMatch = body.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
        if (jsonLdMatch) {
          for (const s of jsonLdMatch) {
            try {
              const jText = s.replace(/<script[^>]*>|<\/script>/gi, '');
              const j = JSON.parse(jText);
              if (j['@type'] === 'VideoObject' && (j.contentUrl || j.embedUrl || j.url)) {
                const vidUrl = (j.contentUrl || j.url || '').replace(/&amp;/g, '&');
                if (vidUrl.startsWith('http')) {
                  return {
                    ok: true,
                    platform: 'Snapchat',
                    username: username || 'snapchat',
                    stories: [{
                      id: 'snap_ld_1',
                      type: 'video',
                      url: vidUrl,
                      thumbnail: j.thumbnailUrl || ((ogImg && !ogImg[1].includes('facebook') && !ogImg[1].includes('default-preview')) ? ogImg[1].replace(/&amp;/g, '&') : ''),
                      ext: 'mp4',
                      filename: `Snapchat_${cleanStoryName(username || 'story', 'story')}_1.mp4`
                    }]
                  };
                }
              }
            } catch (_) {}
          }
        }

        // Fallback 3: Direct CDN media link regex (bolt-gcdn.sc-cdn.net / cf-st.sc-cdn.net)
        const cdnMatches = [...body.matchAll(/https:\/\/(?:bolt-gcdn|cf-st)\.sc-cdn\.net\/[^\s"'\\]+/g)];
        if (cdnMatches.length > 0) {
          const stories = [];
          const seen = new Set();
          cdnMatches.forEach((cm, i) => {
            const mUrl = cm[0].replace(/&amp;/g, '&').replace(/\\\//g, '/');
            if (!seen.has(mUrl) && 
                !mUrl.includes('.vtt') && 
                !mUrl.includes('.webp') && 
                !mUrl.includes('preview') && 
                !mUrl.includes('facebook') && 
                !mUrl.includes('.27.') && 
                !mUrl.includes('.256.') && 
                !mUrl.includes('logo') && 
                !mUrl.includes('icon')) {
              seen.add(mUrl);
              const isVid = mUrl.includes('.mp4') || mUrl.includes('SpotlightSharing') || mUrl.includes('DfMedia');
              const ext = isVid ? 'mp4' : 'jpg';
              const rawThumb = ogImg ? ogImg[1].replace(/&amp;/g, '&') : '';
              const validThumb = (rawThumb && !rawThumb.includes('default-preview') && !rawThumb.includes('facebook')) ? rawThumb : (isVid ? '' : mUrl);
              stories.push({
                id: `snap_cdn_${stories.length + 1}`,
                type: isVid ? 'video' : 'image',
                url: mUrl,
                thumbnail: validThumb,
                ext,
                filename: `Snapchat_${cleanStoryName(username || 'story', 'story')}_${stories.length + 1}.${ext}`
              });
            }
          });
          if (stories.length > 0) {
            return {
              ok: true,
              platform: 'Snapchat',
              username: username || 'snapchat',
              stories
            };
          }
        }
      }
    } catch (_) {}
  }

  return {
    ok: false,
    platform: 'Snapchat',
    username,
    stories: [],
    error: 'لم يتم العثور على ستوريات أو مقاطع Spotlight عامة نشطة لهذا الحساب أو الرابط (قد تكون منتهية أو الحساب خاص).'
  };
}

async function runYtDlpStories(targetUrl, platformName, browserCookies) {
  let bin = getYtDlpPath();
  if (!fs.existsSync(bin)) {
    try { await downloadYtDlp(); bin = getYtDlpPath(); } catch (_) {}
  }
  const args = ['--dump-single-json', '--no-warnings', '--ignore-errors'];
  if (browserCookies && ['chrome', 'edge', 'firefox', 'brave', 'opera', 'safari'].includes(browserCookies)) {
    args.push('--cookies-from-browser', browserCookies);
  }
  args.push(targetUrl);

  return new Promise((resolve, reject) => {
    cp.execFile(bin, args, { maxBuffer: 25 * 1024 * 1024, windowsHide: true, timeout: 30000 }, (err, stdout, stderr) => {
      if (err && !stdout) return reject(new Error(stderr || err.message));
      try {
        const info = JSON.parse(stdout);
        const entries = Array.isArray(info.entries) && info.entries.length ? info.entries : [info];
        const stories = [];
        const baseName = cleanStoryName(info.uploader || info.channel || info.title || platformName, platformName);

        entries.forEach((entry, idx) => {
          if (!entry) return;
          let mediaUrl = entry.url || '';
          let ext = entry.ext || 'mp4';
          if (Array.isArray(entry.formats) && entry.formats.length) {
            const bestMp4 = entry.formats
              .filter(f => f.url && !String(f.url).includes('.m3u8') && f.vcodec !== 'none' && f.acodec !== 'none')
              .sort((a, b) => (b.height || 0) - (a.height || 0))[0];
            const anyBest = entry.formats
              .filter(f => f.url && !String(f.url).includes('.m3u8'))
              .sort((a, b) => (b.height || 0) - (a.height || 0))[0];
            if (bestMp4) { mediaUrl = bestMp4.url; ext = bestMp4.ext || 'mp4'; }
            else if (anyBest) { mediaUrl = anyBest.url; ext = anyBest.ext || 'mp4'; }
          }
          if (!mediaUrl && entry.thumbnail) {
            mediaUrl = entry.thumbnail;
            ext = 'jpg';
          }
          if (!mediaUrl) return;
          const isImg = ['jpg', 'jpeg', 'png', 'webp'].includes(String(ext).toLowerCase());
          stories.push({
            id: entry.id || `${platformName.toLowerCase()}_${idx}`,
            type: isImg ? 'image' : 'video',
            url: mediaUrl,
            sourceUrl: entry.webpage_url || targetUrl,
            thumbnail: entry.thumbnail || (isImg ? mediaUrl : ''),
            ext: isImg ? 'jpg' : 'mp4',
            filename: `${platformName}_${baseName}_story_${idx + 1}.${isImg ? 'jpg' : 'mp4'}`,
            duration: entry.duration || 0
          });
        });

        resolve({
          ok: stories.length > 0,
          platform: platformName,
          username: info.uploader || info.channel || baseName,
          stories
        });
      } catch (e) {
        reject(e);
      }
    });
  });
}

async function resolveInstagramStories(input, opts = {}) {
  let clean = String(input || '').trim();
  let username = '';
  let targetUrl = clean;

  // Direct Post, Reel, or Video URL passed into Story downloader
  if (/(?:instagram\.com\/(?:p|reel|tv|share)\/)/i.test(clean)) {
    try {
      const vidRes = await resolveSocialMedia(clean);
      if (vidRes && vidRes.ok && vidRes.formats?.length) {
        const bestFmt = vidRes.formats.find(f => !f.id?.includes('audio') && f.url) || vidRes.formats[0];
        if (bestFmt?.url) {
          return {
            ok: true,
            platform: 'Instagram',
            username: vidRes.author || 'instagram',
            stories: [{
              id: 'ig_direct_1',
              type: 'video',
              url: bestFmt.url,
              thumbnail: vidRes.thumbnail || '',
              ext: 'mp4',
              filename: `Instagram_${cleanStoryName(vidRes.title || 'media', 'media')}.mp4`
            }]
          };
        }
      }
    } catch (_) {}
  }

  if (/^https?:\/\//i.test(clean)) {
    const m = clean.match(/instagram\.com\/(?:stories\/)?([a-zA-Z0-9._]+)/i);
    if (m && !['p', 'reel', 'tv', 'explore'].includes(m[1].toLowerCase())) username = m[1];
  } else {
    username = clean.replace(/^@/, '').split(/[/?#]/)[0].trim();
    if (!username) return { ok: false, platform: 'Instagram', stories: [], error: 'يرجى إدخال اسم مستخدم صحيح أو رابط ستوري/ريلز إنستجرام' };
    targetUrl = `https://www.instagram.com/stories/${encodeURIComponent(username)}/`;
  }

  // 1. Try yt-dlp (supports stories with browser cookies)
  const candidateBrowsers = opts.browserCookies && opts.browserCookies !== 'none'
    ? [opts.browserCookies]
    : [null];

  for (const b of candidateBrowsers) {
    try {
      const yRes = await runYtDlpStories(targetUrl, 'Instagram', b);
      if (yRes && yRes.ok && yRes.stories.length > 0) return yRes;
    } catch (_) {}
  }

  // 2. Try rahad-all-downloader-v2 if a direct URL was provided
  if (/^https?:\/\//i.test(targetUrl)) {
    try {
      const { alldl } = require('rahad-all-downloader-v2');
      const dlRes = await alldl(targetUrl, { retries: 1 });
      if (dlRes?.data?.videoUrl) {
        return {
          ok: true,
          platform: 'Instagram',
          username: username || 'instagram',
          stories: [{
            id: 'ig_alldl_1',
            type: 'video',
            url: dlRes.data.videoUrl,
            thumbnail: dlRes.data.thumbnail || '',
            ext: 'mp4',
            filename: `Instagram_${cleanStoryName(username || 'story', 'story')}_1.mp4`
          }]
        };
      }
    } catch (_) {}
  }

  // 3. Try OpenGraph / JSON metadata extraction
  try {
    const { status, body } = await httpFetchText(targetUrl, {
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1'
    });
    if (status === 200 && body) {
      const stories = [];
      const seen = new Set();
      const vidMatches = [...body.matchAll(/"video_url":"(https:[^"\\]+)"/g)];
      vidMatches.forEach((vm, idx) => {
        const u = vm[1].replace(/\\u0026/g, '&').replace(/\\\//g, '/');
        if (!seen.has(u)) {
          seen.add(u);
          stories.push({
            id: `ig_vid_${idx}`,
            type: 'video',
            url: u,
            thumbnail: '',
            ext: 'mp4',
            filename: `Instagram_${cleanStoryName(username || 'story', 'story')}_${stories.length + 1}.mp4`
          });
        }
      });
      if (stories.length === 0) {
        const ogVid = body.match(/<meta[^>]+property=["']og:video(?::secure_url|:url)?["'][^>]+content=["']([^"']+)["']/i);
        const ogImg = body.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
        if (ogVid && ogVid[1]) {
          stories.push({
            id: 'ig_og_vid',
            type: 'video',
            url: ogVid[1].replace(/&amp;/g, '&'),
            thumbnail: ogImg ? ogImg[1].replace(/&amp;/g, '&') : '',
            ext: 'mp4',
            filename: `Instagram_${cleanStoryName(username || 'story', 'story')}_1.mp4`
          });
        }
      }
      if (stories.length > 0) {
        return { ok: true, platform: 'Instagram', username: username || 'instagram', stories };
      }
    }
  } catch (_) {}

  return {
    ok: false,
    needsAuth: true,
    platform: 'Instagram',
    username,
    stories: [],
    error: 'Instagram requires a logged-in session for Stories. Select your browser (Chrome/Edge/Firefox) in Browser Cookies above, or use the Tayyar Browser Extension while viewing the story.'
  };
}

async function resolveFacebookStories(input, opts = {}) {
  let clean = String(input || '').trim();

  // Direct Watch, Reel, or Video URL passed into Story downloader
  if (/(?:facebook\.com\/(?:watch|reel|videos|share)|fb\.watch\/)/i.test(clean)) {
    try {
      const vidRes = await resolveSocialMedia(clean);
      if (vidRes && vidRes.ok && vidRes.formats?.length) {
        const bestFmt = vidRes.formats.find(f => !f.id?.includes('audio') && f.url) || vidRes.formats[0];
        if (bestFmt?.url) {
          return {
            ok: true,
            platform: 'Facebook',
            username: vidRes.author || 'facebook',
            stories: [{
              id: 'fb_direct_1',
              type: 'video',
              url: bestFmt.url,
              thumbnail: vidRes.thumbnail || '',
              ext: 'mp4',
              filename: `Facebook_${cleanStoryName(vidRes.title || 'media', 'media')}.mp4`
            }]
          };
        }
      }
    } catch (_) {}
  }

  if (!/^https?:\/\//i.test(clean)) {
    const user = clean.replace(/^@/, '').trim();
    if (!user) return { ok: false, platform: 'Facebook', stories: [], error: 'يرجى إدخال اسم مستخدم صحيح أو رابط ستوري/فيديو فيسبوك' };
    clean = `https://www.facebook.com/stories/${encodeURIComponent(user)}/`;
  }

  // 1. Try yt-dlp (with optional browser cookies for friends-only stories)
  const candidateBrowsers = opts.browserCookies && opts.browserCookies !== 'none'
    ? [opts.browserCookies]
    : [null];

  for (const b of candidateBrowsers) {
    try {
      const yRes = await runYtDlpStories(clean, 'Facebook', b);
      if (yRes && yRes.ok && yRes.stories.length > 0) return yRes;
    } catch (_) {}
  }

  // 2. Try rahad-all-downloader-v2
  try {
    const { alldl } = require('rahad-all-downloader-v2');
    const dlRes = await alldl(clean, { retries: 1 });
    if (dlRes?.data?.videoUrl) {
      return {
        ok: true,
        platform: 'Facebook',
        username: 'facebook',
        stories: [{
          id: 'fb_alldl_1',
          type: 'video',
          url: dlRes.data.videoUrl,
          thumbnail: dlRes.data.thumbnail || '',
          ext: 'mp4',
          filename: `Facebook_Story_${Date.now()}.mp4`
        }]
      };
    }
  } catch (_) {}

  // 3. Mobile HTML scraper (playable_url_quality_hd / browser_native_hd_url / og:video / og:image)
  try {
    const { status, body } = await httpFetchText(clean, {
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1'
    });
    if (status === 200 && body) {
      const stories = [];
      const seen = new Set();
      const rxList = [
        /"(?:browser_native_hd_url|playable_url_quality_hd|browser_native_sd_url|playable_url)":"(https:[^"\\]+)"/g
      ];
      for (const rx of rxList) {
        for (const m of body.matchAll(rx)) {
          const u = m[1].replace(/\\\//g, '/').replace(/\\u0025/g, '%').replace(/\\u0026/g, '&');
          if (!seen.has(u)) {
            seen.add(u);
            stories.push({
              id: `fb_hd_${stories.length}`,
              type: 'video',
              url: u,
              thumbnail: '',
              ext: 'mp4',
              filename: `Facebook_Story_${stories.length + 1}.mp4`
            });
          }
        }
      }
      if (stories.length === 0) {
        const ogVid = body.match(/<meta[^>]+property=["']og:video(?::secure_url|:url)?["'][^>]+content=["']([^"']+)["']/i);
        const ogImg = body.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
        if (ogVid && ogVid[1]) {
          stories.push({
            id: 'fb_og_1',
            type: 'video',
            url: ogVid[1].replace(/&amp;/g, '&'),
            thumbnail: ogImg ? ogImg[1].replace(/&amp;/g, '&') : '',
            ext: 'mp4',
            filename: `Facebook_Story_1.mp4`
          });
        }
      }
      if (stories.length > 0) {
        return { ok: true, platform: 'Facebook', username: 'facebook', stories };
      }
    }
  } catch (_) {}

  return {
    ok: false,
    needsAuth: true,
    platform: 'Facebook',
    stories: [],
    error: 'Could not fetch this Facebook Story publicly. Select your browser in Browser Cookies above or use the Tayyar Browser Extension while viewing the story.'
  };
}

async function resolveStories(input, platform, opts = {}) {
  const raw = String(input || '').trim();
  let plat = String(platform || '').toLowerCase();

  if (!plat || plat === 'auto') {
    if (/snapchat\.com/i.test(raw)) plat = 'snapchat';
    else if (/instagram\.com/i.test(raw)) plat = 'instagram';
    else if (/facebook\.com|fb\.watch/i.test(raw)) plat = 'facebook';
    else if (/whatsapp\.com/i.test(raw)) plat = 'whatsapp';
  }

  if (plat === 'snapchat') return resolveSnapchatStories(raw);
  if (plat === 'instagram') return resolveInstagramStories(raw, opts);
  if (plat === 'facebook') return resolveFacebookStories(raw, opts);
  if (plat === 'whatsapp') {
    return {
      ok: false,
      platform: 'WhatsApp',
      isWhatsAppWeb: true,
      stories: [],
      error: 'Open WhatsApp Web with the Tayyar Browser Extension to save any WhatsApp Status (photo or video) directly to Tayyar in 1 click.'
    };
  }

  return { ok: false, platform: plat || 'Unknown', stories: [], error: 'Unsupported story platform' };
}

module.exports = {
  detectPlatform,
  isYtDlpAvailable,
  downloadYtDlp,
  resolveSocialMedia,
  resolveStories,
  resolveSnapchatStories,
  resolveInstagramStories,
  resolveFacebookStories,
  resolveTikTokSsstik,
  resolveYouTubePiped,
  getYtDlpPath,
  getFfmpegDir,
  getFfmpegPath,
  PLATFORMS
};
