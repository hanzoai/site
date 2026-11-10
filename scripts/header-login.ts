// What Hanzo's "Log in" control and the cookie notice's "Manage preferences" show (read once, signed out, throwaway browser).
import puppeteer from 'puppeteer-core';
import { lock } from './lock.ts';
await lock();

const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const p = await b.newPage();
await p.setViewport({ width: 1470, height: 900 });
await p.goto('https://hanzo.ai/', { waitUntil: 'networkidle2' });
const W = (ms) => new Promise((r) => setTimeout(r, ms));
const visible = () => p.evaluate(() => [...document.querySelectorAll('body *')].filter((e) => e.offsetParent !== null && e.childElementCount === 0 && e.textContent.trim()).map((e) => e.textContent.trim()));
// Manage preferences: opens the choices, nothing is chosen
for (const x of await p.$$('button')) {
  if ((await x.evaluate((e) => e.textContent.trim())) === 'Manage preferences') { await x.click(); break; }
}
await W(800);
console.log('PREFS ::', await p.evaluate(() => { const d = [...document.querySelectorAll('[role=dialog]')].pop(); return d ? d.innerText.replace(/\n+/g, ' ; ') + ' | controls: ' + [...d.querySelectorAll('button,a,input,[role=switch]')].map((x) => (x.getAttribute('aria-label') || x.textContent.trim() || x.type) + (x.getAttribute('href') ? '->' + x.getAttribute('href') : '')).join(' / ') : 'none'; }));
await p.evaluate(() => document.querySelectorAll('[role=dialog]').forEach((d) => d.remove()));
const before = new Set(await visible());
for (const x of await p.$$('header button')) {
  if ((await x.evaluate((e) => e.textContent.trim())) === 'Log in') { await x.click(); break; }
}
await W(1200);
const after = (await visible()).filter((t) => !before.has(t));
console.log('LOGIN ::', p.url(), '|', after.join(' ; ').slice(0, 1500));
console.log('LOGIN links ::', await p.evaluate(() => [...document.querySelectorAll('a')].filter((a) => a.offsetParent && a.getBoundingClientRect().top < 400 && a.getBoundingClientRect().left > 900).map((a) => a.textContent.trim() + '->' + a.getAttribute('href')).join(' / ')));
await b.close();
