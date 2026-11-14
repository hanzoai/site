// Dev issues: console errors and warnings plus the text of Next's dev issue overlay, per page. Usage: node scripts/issues.mjs /page ...
import puppeteer from 'puppeteer-core';
import { lock } from './lock.ts';
await lock();
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
for (const p of process.argv.slice(2)) {
  const page = await b.newPage(); await page.setViewport({ width: 1470, height: 900 });
  const msgs: string[] = [];
  page.on('console', (m) => { if (['error', 'warn', 'warning'].includes(m.type())) msgs.push(m.type() + ': ' + (process.env.FULL ? m.text().split('\n').filter((l) => /^\s*[+-] |^\s*</.test(l)).slice(0, 40).join('\n') : m.text().slice(0, 300))); });
  page.on('pageerror', (e) => msgs.push('pageerror: ' + e.message.slice(0, 300)));
  await page.goto('http://127.0.0.1:4180' + p, { waitUntil: 'domcontentloaded', timeout: 180000 }); await page.waitForSelector('header button', { timeout: 60000 });
  await new Promise((r) => setTimeout(r, 2500));
  const overlay = await page.evaluate(async () => {
    const h = document.querySelector('nextjs-portal'); if (!h?.shadowRoot) return 'no overlay';
    const R = h.shadowRoot, txt = () => [...R.querySelectorAll('*')].filter((e) => e.tagName !== 'STYLE' && !e.children.length).map((e) => e.textContent.trim()).filter(Boolean).join(' · ');
    const badge = R.querySelector('[data-issues-open], [data-nextjs-dev-tools-button], button[aria-label*="ssue"]');
    if (badge) { (badge as HTMLElement).click(); await new Promise((r) => setTimeout(r, 800)); }
    return txt().slice(0, 700);
  });
  console.log(p, '\n  ', [...new Set(msgs)].slice(0, 6).join('\n   '), '\n   overlay:', overlay);
  await page.close();
}
await b.close();
