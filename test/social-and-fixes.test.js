'use strict';
const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');
const cp = require('child_process');
const assert = require('assert');
const { DownloadManager } = require('../src/engine');
const social = require('../src/social');

const listen = (s) => new Promise((r) => s.listen(0, '127.0.0.1', () => r(s.address().port)));
const waitFor = (mgr, id, status, ms = 30000) => new Promise((res, rej) => {
  const t0 = Date.now();
  const iv = setInterval(() => {
    const d = mgr.list().find((x) => x.id === id);
    if (d && d.status === status) { clearInterval(iv); res(d); }
    else if (d && d.status === 'error' && status !== 'error') {
      clearInterval(iv);
      rej(new Error(`unexpected error state: ${d.error}`));
    }
    else if (Date.now() - t0 > ms) {
      clearInterval(iv);
      rej(new Error(`timeout waiting for ${status} (now ${d && d.status}, error: ${d && d.error})`));
    }
  }, 50);
});

(async () => {
  // 1. Platform detection edge cases
  assert.strictEqual(social.detectPlatform('https://www.instagram.com/share/reel/abc123/').id, 'instagram');
  assert.strictEqual(social.detectPlatform('https://www.instagram.com/reels/abc123/').id, 'instagram');
  assert.strictEqual(social.detectPlatform('https://www.facebook.com/share/v/abc123/').id, 'facebook');
  assert.strictEqual(social.detectPlatform('https://www.snapchat.com/@someuser').id, 'snapchat');
  assert.strictEqual(social.detectPlatform('https://t.snapchat.com/AbCdEf').id, 'snapchat');
  console.log('PASS platform detection edge cases');

  // 2. Reject HTML returned as MP4 / WEBM (no fake HTML downloads)
  const htmlSrv = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Content-Length': '27' });
    res.end('<html><body>Login</body></html>');
  });
  let port = await listen(htmlSrv);
  let tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tayyar-fix-'));
  let mgr = new DownloadManager({ stateFile: path.join(tmpDir, 'state.json'), defaultDir: path.join(tmpDir, 'dl') });
  mgr.setSettings({ retries: 0 });
  let d = mgr.add({ url: `http://127.0.0.1:${port}/video.mp4`, filename: 'fake.mp4', isSocial: false });
  d = await waitFor(mgr, d.id, 'error', 10000);
  assert.ok(/text\/html/i.test(d.error), `expected HTML rejection error, got: ${d.error}`);
  let dWebm = mgr.add({ url: `http://127.0.0.1:${port}/clip.webm`, filename: 'fake.webm', isSocial: false });
  dWebm = await waitFor(mgr, dWebm.id, 'error', 10000);
  assert.ok(/text\/html/i.test(dWebm.error), `expected HTML rejection error for .webm, got: ${dWebm.error}`);
  htmlSrv.close();
  console.log('PASS HTML-as-MP4/WEBM rejection');

  // 3. Custom dir, Referer, and User-Agent forwarding
  let seenHeaders = null;
  const mediaBuf = Buffer.alloc(64 * 1024, 0x41);
  const mediaSrv = http.createServer((req, res) => {
    seenHeaders = req.headers;
    res.writeHead(200, { 'Content-Type': 'video/mp4', 'Content-Length': String(mediaBuf.length) });
    res.end(mediaBuf);
  });
  port = await listen(mediaSrv);
  const customDir = path.join(tmpDir, 'custom_out');
  d = mgr.add({
    url: `http://127.0.0.1:${port}/clip.mp4`,
    filename: 'protected_clip.mp4',
    dir: customDir,
    referer: 'https://protected.example.com/embed',
    userAgent: 'TayyarCustomUA/2.0',
    isSocial: false
  });
  d = await waitFor(mgr, d.id, 'completed', 10000);
  assert.strictEqual(path.dirname(d.path), customDir, 'expected file saved in custom dir');
  assert.strictEqual(seenHeaders.referer, 'https://protected.example.com/embed');
  assert.strictEqual(seenHeaders['user-agent'], 'TayyarCustomUA/2.0');
  mediaSrv.close();
  console.log('PASS custom dir, Referer, and User-Agent forwarding');

  // 4. Real yt-dlp.exe + ffmpeg.exe social video & MP3 audio download against local HTTP server
  const ffmpegPath = social.getFfmpegPath();
  const sampleMp4 = path.join(tmpDir, 'sample_src.mp4');
  cp.execFileSync(ffmpegPath, [
    '-y', '-f', 'lavfi', '-i', 'color=c=blue:s=160x120:d=1',
    '-f', 'lavfi', '-i', 'sine=frequency=440:duration=1',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-shortest', sampleMp4
  ], { windowsHide: true, timeout: 15000 });
  const sampleBytes = fs.readFileSync(sampleMp4);

  const ytMediaSrv = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'video/mp4', 'Content-Length': String(sampleBytes.length) });
    res.end(sampleBytes);
  });
  port = await listen(ytMediaSrv);

  // 4a. Video download with empty filename (tests baseName fix + yt-dlp pipeline)
  const vidDir = path.join(tmpDir, 'dl', 'Video');
  fs.mkdirSync(vidDir, { recursive: true });
  fs.writeFileSync(path.join(vidDir, 'unrelated_existing.mp4'), 'old');
  let dVid = mgr.add({
    url: `http://127.0.0.1:${port}/sample_src.mp4`,
    isSocial: true,
    formatId: 'nowm' // placeholder formatId should not break yt-dlp
  });
  dVid = await waitFor(mgr, dVid.id, 'completed', 25000);
  assert.ok(dVid.size > 1000, `expected real video size > 1000, got ${dVid.size}`);
  assert.ok(!dVid.path.endsWith('unrelated_existing.mp4'), 'must not match unrelated file when filename was empty');
  assert.ok(fs.existsSync(dVid.path), 'video file must exist');

  // 4b. Audio-only MP3 extraction via yt-dlp + ffmpeg
  let dAud = mgr.add({
    url: `http://127.0.0.1:${port}/sample_src.mp4`,
    filename: 'Test_Audio.mp3',
    isSocial: true,
    formatId: 'audio'
  });
  dAud = await waitFor(mgr, dAud.id, 'completed', 25000);
  assert.ok(dAud.path.endsWith('.mp3'), `expected .mp3 output, got ${dAud.path}`);
  assert.ok(dAud.size > 500, `expected real mp3 size > 500, got ${dAud.size}`);
  const mp3Header = fs.readFileSync(dAud.path).subarray(0, 3).toString('ascii');
  assert.ok(mp3Header === 'ID3' || fs.readFileSync(dAud.path)[0] === 0xff, 'expected valid MP3 header (ID3 or MPEG frame)');
  ytMediaSrv.close();
  console.log('PASS real yt-dlp + ffmpeg social video & MP3 audio extraction');

  // 5. Extension manifests have all_frames: true
  const chromeMf = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'extension', 'manifest.json'), 'utf8'));
  const ffMf = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'extension-firefox', 'manifest.json'), 'utf8'));
  assert.strictEqual(chromeMf.content_scripts[0].all_frames, true, 'Chrome manifest must have all_frames: true');
  assert.strictEqual(ffMf.content_scripts[0].all_frames, true, 'Firefox manifest must have all_frames: true');
  console.log('PASS extension manifests all_frames: true');

  // 6. _tick() must never produce NaN speed/eta for social downloads
  mgr._tick();
  assert.ok(!Number.isNaN(dVid.speed) && !Number.isNaN(dVid.eta), 'social download speed/eta must not be NaN');
  console.log('PASS _tick() social speed/eta non-NaN');

  // 7. Snapchat __NEXT_DATA__ with object snapUrls.mediaUrl.value
  const snapHtml = `<html><head></head><body><script id="__NEXT_DATA__" type="application/json">${JSON.stringify({
    props: {
      pageProps: {
        userProfile: { publicProfileInfo: { username: 'snap_tester' } },
        story: {
          snapList: [
            { snapMediaType: 1, snapUrls: { mediaUrl: { value: 'https://cf-st.sc-cdn.net/d/test_video.mp4' }, mediaPreviewUrl: { value: 'https://cf-st.sc-cdn.net/d/thumb.jpg' } } }
          ]
        }
      }
    }
  })}</script></body></html>`;
  const snapSrv = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(snapHtml);
  });
  port = await listen(snapSrv);
  const snapRes = await social.resolveStories(`http://127.0.0.1:${port}/@snap_tester`, 'snapchat');
  snapSrv.close();
  assert.strictEqual(snapRes.ok, true, 'expected Snapchat __NEXT_DATA__ object mediaUrl.value to resolve');
  assert.strictEqual(snapRes.stories.length, 1);
  assert.strictEqual(snapRes.stories[0].url, 'https://cf-st.sc-cdn.net/d/test_video.mp4');
  console.log('PASS Snapchat __NEXT_DATA__ mediaUrl.value extraction');

  mgr.shutdown();
  process.exit(0);
})().catch((e) => {
  console.error('FAIL', e);
  process.exit(1);
});
