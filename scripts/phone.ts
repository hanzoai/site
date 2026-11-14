// Phone check: open pages at 375×812 as a touch phone, scroll through, and fail on sideways scroll, elements wider than the
// screen, console errors, or a page that does not load. Screenshots go to /tmp/hz-phone/<path>.png for review.
// Usage: node scripts/phone.mjs /enterprise /about ...      (dev server on :4180)
import fs from 'node:fs';
import puppeteer from 'puppeteer-core';
import { lock } from './lock.ts';
import { why } from './why.ts';
await lock();

const paths = process.argv.slice(2);
if (!paths.length) { console.log('usage: node scripts/phone.mjs /path ...'); process.exit(2); }
fs.mkdirSync('/tmp/hz-phone', { recursive: true });
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
let bad = 0;
for (const p of paths) {
  const page = await b.newPage();
  await page.emulate({ viewport: { width: 375, height: 812, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1' });
  const errs: string[] = [];
  page.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  page.on('console', (m) => m.type() === 'error' && !/favicon|Failed to load resource/.test(m.text()) && errs.push(m.text().slice(0, 160)));
  try {
    await page.goto('http://localhost:4180' + p.replace(/\/?$/, '/'), { waitUntil: 'networkidle2', timeout: 120000 });
    const H = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < H; y += 700) { await page.evaluate((y) => window.scrollTo(0, y), y); await new Promise((r) => setTimeout(r, 120)); }
    await new Promise((r) => setTimeout(r, 400));
    const r = await page.evaluate(() => {
      const W = innerWidth;
      const wide = [...document.querySelectorAll('main *')].filter((e) => {
        const b = e.getBoundingClientRect();
        if (!b.width || getComputedStyle(e).position === 'fixed') return false;
        let a = e.parentElement; // overflow inside a scroller (rails, tables) is fine
        while (a && a !== document.body) { const s = getComputedStyle(a); if (/(auto|scroll|hidden|clip)/.test(s.overflowX)) return false; a = a.parentElement; }
        return b.right > W + 1 || b.left < -1;
      }).slice(0, 5).map((e) => (e.className && e.className.toString().split(' ').slice(0, 2).join('.')) || e.tagName);
      return { sw: document.documentElement.scrollWidth, W, wide };
    });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: '/tmp/hz-phone/' + (p.replace(/\//g, '_') || '_home') + '.png', fullPage: false });
    const ok = r.sw <= r.W && !r.wide.length && !errs.length;
    if (!ok) bad++;
    console.log(`${p}: ${ok ? 'OK' : 'PROBLEM'}  width ${r.sw}/${r.W}${r.wide.length ? '  too wide: ' + r.wide.join(', ') : ''}${errs.length ? '  errors: ' + errs.slice(0, 3).join(' | ') : ''}`);
  } catch (e) {
    bad++; console.log(`${p}: FAILED ${why(e, 120)}`);
  } finally { await page.close(); }
}
await b.close();
process.exit(bad ? 1 : 0);
