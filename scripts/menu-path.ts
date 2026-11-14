// Menu reality check with a real mouse path: hover each header menu, then travel to a link in its panel the way people
// do (slowly, diagonally across neighbouring headings, pausing on the way) and expect the SAME menu to still be open
// with the link under the pointer. Usage: node scripts/menu-path.mjs [/page]      (dev server on :4180)
import puppeteer from 'puppeteer-core';
import { lock } from './lock.ts';
await lock();
const page0 = process.argv[2] || '/about/';
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, protocolTimeout: 240000 });
const page = await b.newPage();
let reloaded = false; // the dev server reloads the page when someone saves a file; such a case is re-run, not failed
page.on('framenavigated', (f) => { if (f === page.mainFrame()) reloaded = true; });
await page.setViewport({ width: 1470, height: 900 });
await page.evaluateOnNewDocument(() => { try { sessionStorage.setItem('hz-arrived', '1'); localStorage.setItem('hz-consent', '{"necessary":true}'); } catch {} });
await page.goto('http://127.0.0.1:4180' + page0, { waitUntil: 'domcontentloaded', timeout: 180000 });
await page.waitForSelector('header button[aria-controls="x-nav-panel"]', { timeout: 120000 }); // hydrated
await new Promise((r) => setTimeout(r, 2500));
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const btns = await page.evaluate(() => [...document.querySelectorAll('header button[aria-controls="x-nav-panel"]')].map((b) => { const r = b.getBoundingClientRect(); return { name: b.getAttribute('aria-label') === 'Company' ? 'Company' : b.textContent.trim(), x: r.left + r.width / 2, y: r.top + r.height / 2 }; }));
let bad = 0;
const state = () => page.evaluate(() => { const p = document.querySelector('#x-nav-panel'); return p ? p.getAttribute('aria-label') : null; });
for (const [i, btn] of btns.entries()) {
  for (let si = 0, tries = 0; si < 3; si++) {
    const style = ['straight', 'diagonal', 'slow'][si];
    reloaded = false;
    await page.mouse.move(735, 880, { steps: 4 }); await wait(1000); // start each trip with every menu closed
    if (await state()) { console.log(`${btn.name}: menu did not close when the pointer left`); bad++; }
    await page.mouse.move(btn.x, btn.y, { steps: 6 });
    await page.waitForFunction((n) => document.querySelector('#x-nav-panel')?.getAttribute('aria-label') === n + ' menu', { timeout: 3000 }, btn.name).catch(() => {});
    await wait(500); // let the columns arrive
    const opened = await state();
    // pick a target link in the panel: far right column for diagonal (crosses the neighbours), first link otherwise
    const t = await page.evaluate((style) => { const a = [...document.querySelectorAll('#x-nav-panel a')]; if (!a.length) return null; const e = style === 'diagonal' ? a[a.length - 1] : a[0]; const r = e.getBoundingClientRect(); return { x: r.left + Math.min(40, r.width / 2), y: r.top + r.height / 2, label: e.textContent.trim().slice(0, 30) }; }, style);
    if (!t && reloaded && tries++ < 3) { await page.waitForSelector('header button[aria-controls="x-nav-panel"]', { timeout: 120000 }); await wait(1500); si--; continue; }
    if (!t) { const why = await page.evaluate((x, y) => { const e = document.elementFromPoint(x, y); const b = e?.closest('button'); return 'wired=' + document.querySelectorAll('[aria-controls="x-nav-panel"]').length + ' loadedAt=' + Math.round(performance.timeOrigin % 1e6) + ' now=' + Math.round(performance.now()) + ' ' + (e ? e.tagName : 'none') + ' hover=' + (b ? b.matches(':hover') : 'no button') + ' expanded=' + (b?.getAttribute('aria-expanded')); }, btn.x, btn.y); console.log(`${btn.name} ${style}: panel did not open (under pointer: ${why})`); bad++; continue; }
    const steps = style === 'slow' ? 40 : 14;
    for (let k = 1; k <= steps; k++) {
      await page.mouse.move(btn.x + ((t.x - btn.x) * k) / steps, btn.y + ((t.y - btn.y) * k) / steps);
      await wait(style === 'slow' ? 45 : 22);
      if (style === 'slow' && k === 10) await wait(500); // people pause halfway
    }
    await wait(900);
    const now = await state();
    const under = await page.evaluate((x, y) => document.elementFromPoint(x, y)?.closest('a')?.textContent.trim().slice(0, 30) || null, t.x, t.y);
    if (reloaded && tries++ < 3) { await page.waitForSelector('header button[aria-controls="x-nav-panel"]', { timeout: 120000 }); await wait(1500); si--; continue; }
    const ok = opened === btn.name + ' menu' && now === opened && under === t.label;
    if (!ok) bad++;
    console.log(`${btn.name} ${style}: ${ok ? 'OK' : 'PROBLEM'}  opened=${opened} after=${now} pointer over "${under}" (wanted "${t.label}")`);
  }
}
await b.close();
process.exit(bad ? 1 : 0);
