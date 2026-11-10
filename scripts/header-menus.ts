// Read what Hanzo's signed-out header controls show (language, log in, search) so the rebuild keeps all of it.
// Usage: node scripts/header-menus.mjs
import puppeteer from 'puppeteer-core';
import { lock } from './lock.ts';
await lock();

const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const p = await b.newPage();
await p.setViewport({ width: 1470, height: 900 });
await p.goto('https://hanzo.ai/', { waitUntil: 'networkidle2' });
const W = (ms) => new Promise((r) => setTimeout(r, ms));
const dump = (label) => p.evaluate((label) => {
  const vis = [...document.querySelectorAll('[role=menu],[role=dialog],[role=listbox],[data-state=open]')].filter((e) => e.offsetHeight > 30);
  return label + ' :: ' + vis.map((v) => v.getAttribute('role') + ' | ' + v.innerText.replace(/\n+/g, ' ; ').slice(0, 2500) + ' | links: ' + [...v.querySelectorAll('a')].map((a) => a.getAttribute('href')).join(' ')).join(' ### ');
}, label);
const clickText = async (text) => {
  for (const x of await p.$$('header button')) {
    if ((await x.evaluate((e) => e.textContent.trim())) === text) { await x.click(); return true; }
  }
  return false;
};
// the cookie notice is taken out of this throwaway page (no choice is made on it), so it does not cover the menus
const banner = await p.evaluate(() => { const d = [...document.querySelectorAll('[role=dialog]')].find((x) => /Essential cookies/.test(x.innerText)); const html = d ? d.outerHTML.length + ' chars | ' + d.innerText.replace(/\n+/g, ' ; ') + ' | buttons: ' + [...d.querySelectorAll('button,a')].map((x) => x.textContent.trim()).join(' / ') : 'none'; d?.remove(); return html; });
console.log('COOKIES ::', banner);
await p.click('header button[aria-label^="Language"]'); await W(800); console.log(await dump('LANG')); await p.keyboard.press('Escape'); await W(400);
await clickText('Log in'); await W(800); console.log(await dump('LOGIN')); await p.keyboard.press('Escape'); await W(400);
await p.click('header button[aria-label^="Search"]'); await W(800); console.log(await dump('SEARCH'));
await p.keyboard.type('pricing'); await W(1800); console.log(await dump('SEARCH pricing'));
await b.close();
