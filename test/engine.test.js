'use strict';
// Self-test: spins up a local Range-capable server and verifies the engine byte-for-byte.
const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const assert = require('assert');
const { DownloadManager } = require('../src/engine');

const DATA = crypto.randomBytes(9 * 1024 * 1024 + 123);
const sha = (b) => crypto.createHash('sha256').update(b).digest('hex');

function server({ ranges = true, slowKBps = 0 }) {
  return http.createServer((req, res) => {
    if (req.url.startsWith('/redir')) { res.writeHead(302, { Location: '/file.bin' }); return res.end(); }
    const m = /bytes=(\d+)-(\d*)/.exec(req.headers.range || '');
    const headers = { 'Content-Disposition': 'attachment; filename="test file.zip"', 'Accept-Ranges': ranges ? 'bytes' : 'none' };
    let body = DATA;
    let code = 200;
    if (ranges && m) {
      const s = +m[1];
      const e = m[2] ? Math.min(+m[2], DATA.length - 1) : DATA.length - 1;
      body = DATA.subarray(s, e + 1);
      code = 206;
      headers['Content-Range'] = `bytes ${s}-${e}/${DATA.length}`;
    }
    headers['Content-Length'] = body.length;
    res.writeHead(code, headers);
    if (!slowKBps) return res.end(body);
    let off = 0;
    const t = setInterval(() => {
      if (off >= body.length) { clearInterval(t); return res.end(); }
      res.write(body.subarray(off, off + slowKBps * 1024));
      off += slowKBps * 1024;
    }, 100);
    res.on('close', () => clearInterval(t));
  });
}
const listen = (s) => new Promise((r) => s.listen(0, '127.0.0.1', () => r(s.address().port)));
const waitFor = (mgr, id, status, ms = 30000) => new Promise((res, rej) => {
  const t0 = Date.now();
  const iv = setInterval(() => {
    const d = mgr.list().find((x) => x.id === id);
    if (d && d.status === status) { clearInterval(iv); res(d); }
    else if (Date.now() - t0 > ms) { clearInterval(iv); rej(new Error(`timeout waiting for ${status} (now ${d && d.status}, error: ${d && d.error})`)); }
  }, 50);
});
const mk = () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'tayyar-'));
  return { dir, mgr: new DownloadManager({ stateFile: path.join(dir, 'state.json'), defaultDir: path.join(dir, 'dl') }) };
};

(async () => {
  // 1) multi-segment + redirect + filename + categorize
  let s = server({});
  let port = await listen(s);
  let { dir, mgr } = mk();
  let d = mgr.add({ url: `http://127.0.0.1:${port}/redir`, connections: 8 });
  d = await waitFor(mgr, d.id, 'completed');
  assert.strictEqual(sha(fs.readFileSync(d.path)), sha(DATA), 'hash mismatch (multi-segment)');
  assert.ok(d.path.includes('Compressed') && d.path.endsWith('test file.zip'), `categorize/filename: ${d.path}`);
  assert.ok(d.segments.length >= 8, `expected >=8 segments, got ${d.segments.length}`);
  console.log(`PASS multi-segment (${d.segments.length} segments), redirect, filename, category`);

  // 2) server without Range support -> single stream
  s.close(); s = server({ ranges: false }); port = await listen(s);
  ({ dir, mgr } = mk());
  d = mgr.add({ url: `http://127.0.0.1:${port}/x.bin` });
  d = await waitFor(mgr, d.id, 'completed');
  assert.strictEqual(sha(fs.readFileSync(d.path)), sha(DATA));
  assert.strictEqual(d.resumable, false);
  console.log('PASS non-resumable server');

  // 3) pause / persist / resume across a new manager instance
  s.close(); s = server({ slowKBps: 40 }); port = await listen(s);
  ({ dir, mgr } = mk());
  d = mgr.add({ url: `http://127.0.0.1:${port}/y.bin`, connections: 4 });
  await new Promise((r) => setTimeout(r, 1500));
  mgr.pause(d.id);
  await new Promise((r) => setTimeout(r, 400));
  const paused = mgr.list()[0];
  assert.strictEqual(paused.status, 'paused');
  assert.ok(paused.downloaded > 0 && paused.downloaded < DATA.length, 'partial progress expected');
  mgr.shutdown();
  const mgr2 = new DownloadManager({ stateFile: path.join(dir, 'state.json'), defaultDir: path.join(dir, 'dl') });
  assert.strictEqual(mgr2.list()[0].status, 'paused');
  mgr2.resume(d.id);
  d = await waitFor(mgr2, d.id, 'completed', 60000);
  assert.strictEqual(sha(fs.readFileSync(d.path)), sha(DATA), 'hash mismatch after resume');
  console.log('PASS pause / persist / resume');

  // 4) speed limit
  s.close(); s = server({}); port = await listen(s);
  ({ dir, mgr } = mk());
  mgr.setSettings({ speedLimitKB: 3000 });
  const t0 = Date.now();
  d = mgr.add({ url: `http://127.0.0.1:${port}/z.bin` });
  await waitFor(mgr, d.id, 'completed', 30000);
  const secs = (Date.now() - t0) / 1000;
  assert.ok(secs > 1.8, `speed limit not applied (took ${secs}s)`);
  console.log(`PASS speed limit (${secs.toFixed(1)}s for ${(DATA.length / 1048576).toFixed(1)}MB @3MB/s)`);

  // 5) error reporting
  s.close();
  ({ mgr } = mk());
  mgr.setSettings({ retries: 0 });
  d = mgr.add({ url: 'http://127.0.0.1:1/nope.bin' });
  d = await waitFor(mgr, d.id, 'error', 10000);
  assert.ok(d.error);
  console.log('PASS error reporting');
  process.exit(0);
})().catch((e) => { console.error('FAIL', e); process.exit(1); });
