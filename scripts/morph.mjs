// Morph navigation check: click real links and expect a view transition (open for big cards, turn for small links),
// a new page, and the page at the top. Films each click (shots/morph/NN.webm, sheets at 10 frames a second).
// Usage: node scripts/morph.mjs      (dev server on :4180)
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import puppeteer from 'puppeteer-core';
import { lock } from './lock.mjs';
const CASES = [
  ['/legal/', '.xlg-card[href*="/legal/"]', 'open'],
  ['/enterprise/', 'main a[href="/contact-sales"], main a[href="/contact-sales/"]', 'any'],
  ['/about/', 'main a[href^="/"]:not([href="/"])', 'any'],
];
await lock();
fs.mkdirSync('shots/morph', { recursive: true });
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, protocolTimeout: 240000 });
let bad = 0, n = 0;
for (const [from, sel, want] of CASES) {
  const page = await b.newPage();
  await page.setViewport({ width: 1470, height: 900 });
  await page.evaluateOnNewDocument(() => { try { localStorage.setItem('hz-consent', '{"necessary":true}'); } catch {} window.__vt = []; const o = document.startViewTransition?.bind(document); if (o) document.startViewTransition = (f) => { window.__vt.push(document.documentElement.dataset.morph || '?'); return o(f); }; });
  try {
    await page.goto('http://localhost:4180' + from, { waitUntil: 'networkidle2', timeout: 120000 });
    const el = await page.$(sel);
    if (!el) { console.log(`${from}: no link matches ${sel}`); bad++; continue; }
    await el.evaluate((e) => e.scrollIntoView({ block: 'center' }));
    await new Promise((r) => setTimeout(r, 900));
    const to = await el.evaluate((e) => new URL(e.href).pathname);
    const file = `shots/morph/${String(++n).padStart(2, '0')}`;
    // screenshots force a frame each time, so they catch the transition itself (a screencast can miss it)
    const ys = [];
    const click = el.click();
    for (let k = 0; k < 16; k++) { await page.screenshot({ path: `${file}-f${String(k).padStart(2, '0')}.jpg`, type: 'jpeg', quality: 55 }); ys.push(await page.evaluate(() => Math.round(scrollY))); await new Promise((r) => setTimeout(r, 70)); }
    await click;
    await page.waitForFunction((t) => location.pathname.replace(/\/$/, '') === t.replace(/\/$/, ''), { timeout: 20000 }, to);
    await new Promise((r) => setTimeout(r, 1600));
    const r = await page.evaluate(() => ({ vt: window.__vt, y: Math.round(scrollY) }));
    // a client-side transition keeps window state; a full reload would have wiped __vt
    const ok = (want === 'any' ? !!r.vt[0] : r.vt[0] === want) && r.y < 5;
    if (!ok) bad++;
    execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-framerate', '10', '-i', `${file}-f%02d.jpg`, '-vf', 'scale=368:-1,tile=4x4', '-frames:v', '1', '-q:v', '5', `${file}-sheet.jpg`]);
    for (const f of fs.readdirSync('shots/morph').filter((x) => x.startsWith(file.split('/').pop() + '-f'))) fs.unlinkSync('shots/morph/' + f);
    console.log(`${from} -> ${to}: ${ok ? 'OK' : 'PROBLEM'}  transition ${r.vt.join(',') || 'none'} (want ${want}), landed at y=${r.y}, scroll during: ${ys.join(' ')}  sheet ${file}-sheet.jpg`);
  } catch (e) { bad++; console.log(`${from}: FAILED ${e.message.slice(0, 140)}`); }
  finally { await page.close(); }
}
await b.close();
process.exit(bad ? 1 : 0);
