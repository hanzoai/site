// The browser checks run after `pnpm build` (scripts/events.ts, scripts/ladder.ts): Playwright, the one in
// ~/work/hanzo-inc/app/node_modules with its browsers, and the export in out/ served as https://hanzo.ai the way the
// Sites plane serves it (<route>, <route>.html, <route>/index.html), so the host's own keys and links apply.
import { createRequire } from 'node:module';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(path.join(os.homedir(), 'work/hanzo-inc/app/package.json'));
export const { chromium } = require('@playwright/test');

export const OUT = fileURLToPath(new URL('../out/', import.meta.url));
export const HOST = 'https://hanzo.ai';
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.woff2': 'font/woff2', '.txt': 'text/plain', '.webm': 'video/webm', '.jpg': 'image/jpeg', '.ico': 'image/x-icon', '.md': 'text/markdown', '.xml': 'application/xml' };

/** Every request to https://hanzo.ai in the context is answered from out/; a page the build lacks is a 404. */
export const host = (ctx) => ctx.route(/^https:\/\/hanzo\.ai\//, (route) => {
  const p = decodeURIComponent(new URL(route.request().url()).pathname);
  const clean = p.replace(/\/$/, '') || '/index';
  const f = [path.join(OUT, p), path.join(OUT, clean + '.html'), path.join(OUT, p, 'index.html')].find((c) => fs.existsSync(c) && !fs.statSync(c).isDirectory());
  if (!f) return route.fulfill({ status: 404, body: 'missing' });
  route.fulfill({ status: 200, body: fs.readFileSync(f), headers: { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' } });
});
