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
  { id: 'facebook', name: 'Facebook', color: '#1877f2', icon: '📘', pattern: /(?:facebook\.com\/(?:watch|reel|videos|stories)|fb\.watch\/)/i },
  { id: 'snapchat', name: 'Snapchat', color: '#fffc00', icon: '👻', pattern: /(?:snapchat\.com\/(?:spotlight|t|add|story)\/)/i },
  { id: 'twitter', name: 'X / Twitter', color: '#1da1f2', icon: '🐦', pattern: /(?:twitter\.com|x\.com)\/[^/]+\/status\//i },
  { id: 'pinterest', name: 'Pinterest', color: '#e60023', icon: '📌', pattern: /(?:pinterest\.com\/pin\/|pin\.it\/)/i },
  { id: 'reddit', name: 'Reddit', color: '#ff4500', icon: '🤖', pattern: /(?:reddit\.com\/r\/[^/]+\/comments\/|v\.redd\.it\/)/i }
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
      proto.get(targetUrl, { headers: { 'User-Agent': 'Tayyar-Downloader/1.0.5' } }, (res) => {
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
 * Universal fast TikTok scraper via SSSTik (no watermark, bypasses regional ISP blocks).
 */
function resolveTikTokSsstik(url) {
  return new Promise((resolve, reject) => {
    const postData = qs.stringify({ id: url.trim(), locale: 'en', tt: '' });
    const req = https.request('https://ssstik.io/abc?url=dl', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        'Origin': 'https://ssstik.io',
        'Referer': 'https://ssstik.io/en'
      },
      timeout: 10000
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
            referer: 'https://ssstik.io/'
          });
        }
        if (dlMatches.length > 1) {
          formats.push({
            id: 'hd',
            quality: '🎬 جودة فائقة HD بدون علامة مائية (MP4)',
            ext: 'mp4',
            url: dlMatches[1][1],
            referer: 'https://ssstik.io/'
          });
        }
        const audioMatch = html.match(/href="(https:\/\/tikcdn\.io\/ssstik\/mp3\/[^"]+)"/);
        if (audioMatch) {
          formats.push({
            id: 'audio',
            quality: '🎵 ملف صوتي فقط (MP3)',
            ext: 'mp3',
            url: audioMatch[1],
            referer: 'https://ssstik.io/'
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

/**
 * Primary multi-platform social media resolver.
 */
async function resolveSocialMedia(url) {
  const plat = detectPlatform(url);
  const platId = plat ? plat.id : 'unknown';

  // 1. TikTok: Always prioritize SSSTik (instant, no watermark, works under ISP blocks)
  if (platId === 'tiktok') {
    try {
      const res = await resolveTikTokSsstik(url);
      if (res && res.ok && res.formats?.length) {
        return res;
      }
    } catch (e) {
      console.warn('SSSTik failed, falling back to yt-dlp:', e.message);
    }
  }

  // 2. General Desktop Resolution using yt-dlp
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
      cp.execFile(bin, args, { maxBuffer: 15 * 1024 * 1024, windowsHide: true, timeout: 25000 }, (err, stdout, stderr) => {
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
              filesize: info.filesize || -1
            });
          }

          // Multi-format streams (YouTube, Facebook, etc.)
          if (Array.isArray(info.formats)) {
            // Progressive video streams (contain both audio and video)
            const progressiveStreams = info.formats
              .filter(f => f.vcodec && f.vcodec !== 'none' && f.acodec && f.acodec !== 'none' && f.url)
              .sort((a, b) => (b.height || 0) - (a.height || 0));

            for (const f of progressiveStreams) {
              const h = f.height || 720;
              formats.push({
                id: f.format_id,
                quality: `🎬 جودة ${h}p عالية متكاملة (فيديو + صوت MP4)`,
                ext: f.ext || 'mp4',
                url: f.url,
                filesize: f.filesize || -1
              });
            }

            // High resolution adaptive streams (1080p, 1440p, 2160p 4K)
            const adaptiveStreams = info.formats
              .filter(f => f.vcodec && f.vcodec !== 'none' && (!f.acodec || f.acodec === 'none') && f.url && (f.height || 0) >= 1080)
              .sort((a, b) => (b.height || 0) - (a.height || 0));

            const seenHeights = new Set();
            for (const f of adaptiveStreams) {
              const h = f.height || 1080;
              if (!seenHeights.has(h)) {
                seenHeights.add(h);
                const qLabel = h >= 2160 ? '4K Ultra HD (2160p)' :
                               h >= 1440 ? '2K Quad HD (1440p)' :
                               'Full HD (1080p)';
                formats.push({
                  id: f.format_id,
                  quality: `🌟 فائقة الوضوح ${qLabel} (MP4)`,
                  ext: f.ext || 'mp4',
                  url: f.url,
                  filesize: f.filesize || f.filesize_approx || -1
                });
              }
            }

            // Audio-only streams
            const audioStreams = info.formats
              .filter(f => f.acodec && f.acodec !== 'none' && (!f.vcodec || f.vcodec === 'none') && f.url)
              .sort((a, b) => (b.abr || 0) - (a.abr || 0));

            if (audioStreams.length > 0) {
              const a = audioStreams[0];
              formats.push({
                id: a.format_id || 'audio',
                quality: '🎵 ملف صوتي فقط نقي (MP3 / M4A Audio)',
                ext: 'mp3',
                url: a.url,
                filesize: a.filesize || -1
              });
            }
          }

          // Fallback format if formats array is empty
          if (formats.length === 0 && info.url) {
            formats.push({
              id: 'best',
              quality: '🎬 أعلى جودة متاحة (MP4)',
              ext: info.ext || 'mp4',
              url: info.url,
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

    // 3. YouTube Fallback via Piped if yt-dlp failed
    if (platId === 'youtube') {
      try {
        return await resolveYouTubePiped(url);
      } catch (pipedErr) {
        console.warn('Piped fallback error:', pipedErr.message);
      }
    }

    // 4. OpenGraph video fallback (Instagram, Facebook, Twitter, TikTok, direct video)
    try {
      return await resolveOpenGraphVideo(url);
    } catch (_) {}

    throw err;
  }
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

module.exports = {
  detectPlatform,
  isYtDlpAvailable,
  downloadYtDlp,
  resolveSocialMedia,
  resolveTikTokSsstik,
  resolveYouTubePiped,
  getYtDlpPath,
  PLATFORMS
};
