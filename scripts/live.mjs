// Render hanzo.ai pages in headless Chrome and keep what a visitor actually sees: the text of every block, every link,
// and the text that only appears on interaction (tab panels, accordions are opened before reading).
// Usage: node scripts/live.mjs [/path ...]     (no paths: every page in content/pages.json, top level first)
// Output: content/live/<path>.json  { text: [...], links: [...] }
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'content', 'live');
const idx = JSON.parse(fs.readFileSync(path.join(ROOT, 'content', 'pages.json'), 'utf8'));
let paths = process.argv.slice(2);
if (!paths.length) paths = Object.keys(idx).sort((a, b) => a.split('/').length - b.split('/').length || a.localeCompare(b));
paths = paths.filter((p) => !fs.existsSync(path.join(OUT, (p.slice(1) || 'index') + '.json')) || process.env.FORCE);

const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, args: ['--no-first-run', '--mute-audio'] });
const read = async (p) => {
  const page = await browser.newPage();
  await page.setViewport({ width: 1470, height: 900 });
  try {
    await page.goto('https://hanzo.ai' + p, { waitUntil: 'networkidle2', timeout: 45000 });
    await new Promise((r) => setTimeout(r, 1200));
    const data = await page.evaluate(async () => {
      const main = document.querySelector('main') || document.body;
      const seen = new Set();
      const text = [];
      const grab = () => main.querySelectorAll('*').forEach((el) => {
        if (/^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE)$/.test(el.tagName)) return;
        // each text node on its own, so a sentence with a link in it is read as its two halves
        for (const c of el.childNodes) {
          if (c.nodeType !== 3) continue;
          const own = c.textContent.replace(/\s+/g, ' ').trim();
          if (own.length > 1 && !seen.has(own)) { seen.add(own); text.push(own); }
        }
      });
      grab();
      // open what is hidden behind a click: tabs and accordions, then read again
      for (const b of [...main.querySelectorAll('[role=tab], summary, button[aria-expanded="false"]')].slice(0, 60)) {
        try { b.click(); await new Promise((r) => setTimeout(r, 120)); grab(); } catch {}
      }
      const links = [...new Set([...main.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')))];
      return { text, links };
    });
    fs.mkdirSync(path.dirname(path.join(OUT, (p.slice(1) || 'index') + '.json')), { recursive: true });
    fs.writeFileSync(path.join(OUT, (p.slice(1) || 'index') + '.json'), JSON.stringify(data));
    return true;
  } catch (e) {
    console.log('FAIL', p, e.message.slice(0, 80));
    return false;
  } finally {
    await page.close();
  }
};
let ok = 0;
for (let i = 0; i < paths.length; i += 3) ok += (await Promise.all(paths.slice(i, i + 3).map(read))).filter(Boolean).length;
await browser.close();
console.log('live pages read', ok, 'of', paths.length);
