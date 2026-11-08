// Dark mode check (docs/DARK-MODE.md): opens each page with the device set to dark, at 1470x801 and 375x812, scrolls it
// through, and lists what still reads as bright mode: visible light backgrounds, and text too close to what sits behind it.
// Solid ink buttons are meant to turn light in dark (Hanzo's primary), so they are not listed.
// Usage: node scripts/darkcheck.mjs /pricing /chat ...   (dev server on :4180, or HZ_BASE=...; CHROME=path on Linux)
import puppeteer from 'puppeteer-core';

const BASE = process.env.HZ_BASE || 'http://localhost:4180';
const b = await puppeteer.launch({ executablePath: process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, args: ['--no-sandbox'] });
let total = 0;
for (const path of process.argv.slice(2)) for (const [w, h] of [[1470, 801], [375, 812]]) {
  const p = await b.newPage();
  await p.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'dark' }]);
  await p.setViewport({ width: w, height: h, isMobile: w < 500, hasTouch: w < 500 });
  const errs = [];
  p.on('pageerror', (e) => errs.push(String(e).slice(0, 160)));
  await p.goto(BASE + path.replace(/\/?$/, '/'), { waitUntil: 'networkidle2', timeout: 120000 });
  await p.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 600) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } });
  await new Promise((r) => setTimeout(r, 600));
  const r = await p.evaluate(() => {
    const lum = (c) => { const m = c.match(/[\d.]+/g); if (!m) return null; if (m[3] != null && +m[3] < 0.5) return null; return (0.2126 * m[0] + 0.7152 * m[1] + 0.0722 * m[2]) / 255; };
    const bgOf = (e) => { for (let x = e; x; x = x.parentElement) { const l = lum(getComputedStyle(x).backgroundColor); if (l != null) return l; } return 0.05; };
    const name = (e) => (typeof e.className === 'string' && e.className.trim() ? '.' + e.className.trim().split(/\s+/).slice(0, 2).join('.') : e.tagName.toLowerCase());
    const ink = (e) => { const cs = getComputedStyle(e); return (lum(cs.backgroundColor) ?? 0) > 0.8 && (lum(cs.color) ?? 1) < 0.2; }; // a solid primary: light fill, dark text
    const out = {}; const add = (k) => (out[k] = (out[k] || 0) + 1);
    for (const e of document.querySelectorAll('main *, body > div *')) {
      const rc = e.getBoundingClientRect(); if (rc.width < 8 || rc.height < 8) continue;
      const cs = getComputedStyle(e); if (cs.visibility === 'hidden' || +cs.opacity === 0) continue;
      if (e.closest('[data-room=dark], video, img, canvas, svg, header, footer')) continue;
      const l = lum(cs.backgroundColor);
      if (l != null && l > 0.8 && rc.width * rc.height > 400 && !ink(e)) add('bright background  ' + name(e));
      if ([...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) {
        const t = lum(cs.color), bg = bgOf(e);
        if (t != null && Math.abs(t - bg) < 0.25 && !ink(e) && !(e.parentElement && ink(e.parentElement))) add('low-contrast text  ' + name(e));
      }
    }
    return out;
  });
  const n = Object.values(r).reduce((a, c) => a + c, 0); total += n;
  console.log(`${path.padEnd(14)} ${w}px  ${n} to convert${errs.length ? '  page errors: ' + errs.join(' | ') : ''}`);
  for (const [k, v] of Object.entries(r).sort((a, c) => c[1] - a[1]).slice(0, 25)) console.log(`   ${String(v).padStart(3)}  ${k}`);
  await p.close();
}
await b.close();
console.log(total ? `dark: ${total} to convert` : 'dark: OK');
process.exit(total ? 1 : 0);
