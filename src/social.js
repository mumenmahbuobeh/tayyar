'use strict';
const cp = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

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
  fs.mkdirSync(binDir, { recursive: true });
  return binDir;
}

function getYtDlpPath() {
  const binDir = getBinDir();
  const exe = process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp';
  const custom = path.join(binDir, exe);
  if (fs.existsSync(custom)) return custom;

  // Check local root bin folder
  const localBin = path.join(__dirname, '..', 'bin', exe);
  if (fs.existsSync(localBin)) return localBin;

  return exe; // system PATH
}

function isYtDlpAvailable() {
  return new Promise((resolve) => {
    const bin = getYtDlpPath();
    cp.execFile(bin, ['--version'], (err, stdout) => {
      if (err) resolve({ available: false, path: bin });
      else resolve({ available: true, version: stdout.trim(), path: bin });
    });
  });
}

function downloadYtDlp(onProgress) {
  return new Promise((resolve, reject) => {
    const binDir = getBinDir();
    const exe = process.platform === 'win32' ? 'yt-dlp.exe' : (process.platform === 'darwin' ? 'yt-dlp_macos' : 'yt-dlp');
    const targetFile = path.join(binDir, process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp');
    const url = `https://github.com/yt-dlp/yt-dlp/releases/latest/download/${exe}`;

    function fetchUrl(targetUrl) {
      const u = new URL(targetUrl);
      const proto = u.protocol === 'https:' ? https : http;
      proto.get(targetUrl, { headers: { 'User-Agent': 'Tayyar-Downloader' } }, (res) => {
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

function resolveWithYtDlp(url) {
  return new Promise((resolve, reject) => {
    const bin = getYtDlpPath();
    const args = ['--dump-single-json', '--no-warnings', '--prefer-free-formats', url];

    cp.execFile(bin, args, { maxBuffer: 10 * 1024 * 1024 }, (err, stdout, stderr) => {
      if (err) return reject(new Error(stderr || err.message));
      try {
        const info = JSON.parse(stdout);
        const formats = [];

        // 1. TikTok No-Watermark / Direct Single URL
        if (info.url && !info.formats) {
          formats.push({
            id: 'direct',
            quality: 'Direct Video (No Watermark)',
            ext: info.ext || 'mp4',
            url: info.url,
            filesize: info.filesize || -1
          });
        }

        // 2. Multi-format videos (YouTube, Facebook, etc.)
        if (Array.isArray(info.formats)) {
          // Find best combined or video-only streams
          const videoStreams = info.formats
            .filter(f => f.vcodec && f.vcodec !== 'none' && f.url)
            .sort((a, b) => (b.height || 0) - (a.height || 0));

          const seenQualities = new Set();
          for (const f of videoStreams) {
            const h = f.height || 720;
            const qLabel = h >= 2160 ? '4K Ultra HD (2160p)' :
                           h >= 1440 ? '2K Quad HD (1440p)' :
                           h >= 1080 ? 'Full HD (1080p)' :
                           h >= 720  ? 'HD (720p)' :
                           h >= 480  ? 'SD (480p)' : `${h}p`;

            if (!seenQualities.has(qLabel)) {
              seenQualities.add(qLabel);
              formats.push({
                id: f.format_id,
                quality: qLabel,
                ext: f.ext || 'mp4',
                url: f.url,
                filesize: f.filesize || f.filesize_approx || -1
              });
            }
          }

          // Audio-only option
          const audio = info.formats.find(f => f.acodec && f.acodec !== 'none' && (!f.vcodec || f.vcodec === 'none') && f.url);
          if (audio) {
            formats.push({
              id: audio.format_id || 'audio',
              quality: '🎵 Audio Only (MP3/M4A)',
              ext: 'mp3',
              url: audio.url,
              filesize: audio.filesize || -1
            });
          }
        }

        // Fallback default format if empty
        if (formats.length === 0 && info.url) {
          formats.push({
            id: 'best',
            quality: 'Best Available (MP4)',
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
}

module.exports = {
  detectPlatform,
  isYtDlpAvailable,
  downloadYtDlp,
  resolveWithYtDlp,
  PLATFORMS
};
