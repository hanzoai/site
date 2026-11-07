// Local preview of the static build (out/). Anything the build does not contain yet — Hanzo's own images, logos and
// media under /public on hanzo.ai — is fetched from hanzo.ai, so ported pages look complete before public/ is copied over.
// Usage: node scripts/serve.mjs [port]
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'out');
const PORT = +(process.argv[2] || 4181);
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.txt': 'text/plain; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.webm': 'video/webm', '.mp4': 'video/mp4', '.woff2': 'font/woff2', '.ico': 'image/x-icon' };

function local(url) {
  let p = path.join(ROOT, decodeURIComponent(url.split('?')[0]));
  if (!p.startsWith(ROOT)) return null; // no escaping the build folder
  if (fs.existsSync(p) && fs.statSync(p).isDirectory()) p = path.join(p, 'index.html');
  else if (!fs.existsSync(p) && fs.existsSync(p + '.html')) p += '.html';
  return fs.existsSync(p) ? p : null;
}

http.createServer(async (req, res) => {
  const f = local(req.url);
  if (f) {
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
    return;
  }
  try {
    const r = await fetch('https://hanzo.ai' + req.url, { headers: { 'User-Agent': 'hanzo-preview' } });
    const type = r.headers.get('content-type') || 'application/octet-stream';
    if (type.includes('text/html')) { res.writeHead(404, { 'Content-Type': 'text/plain' }); res.end('Not in this build: ' + req.url); return; }
    res.writeHead(r.status, { 'Content-Type': type, 'Cache-Control': 'max-age=3600' });
    res.end(Buffer.from(await r.arrayBuffer()));
  } catch {
    res.writeHead(502); res.end();
  }
}).listen(PORT, '127.0.0.1', () => console.log('preview on http://localhost:' + PORT));
