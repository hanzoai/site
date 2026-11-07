// Look at pages without a visible browser: scroll each page like a person at desktop (1470×900) and phone (375×812),
// letting motion settle, and save one JPEG per screen to shots/<page>/d-01.jpg … p-01.jpg. Fails on console errors.
// Usage: node scripts/shot.mjs /about /pricing ...   [--desk-only|--phone-only] [--max=10]     (dev server on :4180)
import fs from 'node:fs';
import puppeteer from 'puppeteer-core';
import { lock } from './lock.mjs';

const args = process.argv.slice(2);
const paths = args.filter((a) => a.startsWith('/'));
const max = +(args.find((a) => a.startsWith('--max=')) || '--max=10').slice(6);
const modes = [!args.includes('--phone-only') && 'd', !args.includes('--desk-only') && 'p'].filter(Boolean);
if (!paths.length) { console.log('usage: node scripts/shot.mjs /path ... [--desk-only|--phone-only] [--max=10]'); process.exit(2); }
await lock();
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
let bad = 0;
for (const p of paths) {
  const dir = 'shots/' + (p.replace(/^\/|\/$/g, '').replace(/\//g, '_') || 'home');
  fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  for (const m of modes) {
    const page = await b.newPage();
    if (m === 'd') await page.setViewport({ width: 1470, height: 900 });
    else await page.emulate({ viewport: { width: 375, height: 812, deviceScaleFactor: 1, isMobile: true, hasTouch: true }, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1' });
    const errs = [];
    page.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
    page.on('console', (x) => x.type() === 'error' && !/favicon|Failed to load resource/.test(x.text()) && errs.push(x.text().slice(0, 160)));
    try {
      await page.goto('http://localhost:4180' + p.replace(/\/?$/, '/'), { waitUntil: 'networkidle2', timeout: 120000 });
      await page.evaluate(() => { localStorage.setItem('hz-consent', JSON.stringify({ necessary: true })); document.querySelectorAll('[role=dialog]').forEach((d) => /cookie/i.test(d.innerText) && d.remove()); });
      await new Promise((r) => setTimeout(r, 1800));
      const H = await page.evaluate(() => document.documentElement.scrollHeight), V = m === 'd' ? 900 : 812;
      const step = Math.max(V * 0.9, (H - V) / Math.max(1, max - 1));
      let n = 0;
      for (let y = 0; n < max; y += step) {
        // glide there in small steps so scroll-linked and in-view motion fires as it would for a person
        await page.evaluate(async (to) => { const from = scrollY; for (let k = 1; k <= 8; k++) { scrollTo(0, from + ((to - from) * k) / 8); await new Promise((r) => setTimeout(r, 40)); } }, Math.min(y, H - V));
        await new Promise((r) => setTimeout(r, 1100));
        await page.screenshot({ path: `${dir}/${m}-${String(++n).padStart(2, '0')}.jpg`, type: 'jpeg', quality: 62 });
        if (y >= H - V) break;
      }
      const sw = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      if (errs.length || sw > 0) bad++;
      console.log(`${p} ${m === 'd' ? 'desktop' : 'phone'}: ${n} shots, height ${H}${sw > 0 ? '  SIDEWAYS SCROLL +' + sw : ''}${errs.length ? '  errors: ' + errs.slice(0, 2).join(' | ') : ''}  -> ${dir}`);
    } catch (e) { bad++; console.log(`${p} ${m}: FAILED ${e.message.slice(0, 120)}`); }
    finally { await page.close(); }
  }
}
await b.close();
process.exit(bad ? 1 : 0);
