// Click-to-open check: from each page, click a model card, land on the model page, press ✕, and expect to fly back to
// the same page and scroll position. Usage: node scripts/opener.mjs     (dev server on :4180)
import puppeteer from 'puppeteer-core';
import { lock } from './lock.ts';
await lock();
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, args: ['--use-gl=angle'] });
let bad = 0;
for (const [from, sel] of [['/', '.x-mgrid [data-card]'], ['/models/', '.xmo-tile[data-card]']]) {
  const page = await b.newPage();
  await page.setViewport({ width: 1470, height: 900 });
  try {
    await page.goto('http://localhost:4180' + from, { waitUntil: 'networkidle2', timeout: 120000 });
    const y = await page.evaluate(async (sel) => { const c = document.querySelector(sel); c.scrollIntoView({ block: 'center' }); await new Promise((r) => setTimeout(r, 900)); return Math.round(scrollY); }, sel);
    const slug = await page.$eval(sel, (c) => c.dataset.card);
    await page.click(sel);
    await page.waitForFunction((s) => location.pathname.replace(/\/$/, '') === '/' + s, { timeout: 15000 }, slug);
    await page.waitForSelector('.x-mclose', { timeout: 15000 });
    await new Promise((r) => setTimeout(r, 1500));
    await page.click('.x-mclose');
    await page.waitForFunction((f) => location.pathname === f, { timeout: 15000 }, from);
    await new Promise((r) => setTimeout(r, 2200));
    const back = await page.evaluate(() => Math.round(scrollY));
    const ok = Math.abs(back - y) < 80;
    if (!ok) bad++;
    console.log(`${from} -> /${slug} -> ${from}: ${ok ? 'OK' : 'PROBLEM'}  scroll ${y} -> ${back}`);
  } catch (e) { bad++; console.log(`${from}: FAILED ${e.message.slice(0, 140)}`); }
  finally { await page.close(); }
}
await b.close();
process.exit(bad ? 1 : 0);
