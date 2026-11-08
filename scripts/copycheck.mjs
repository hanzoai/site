// Real copy check (James, 8 Nov): every line of text on live hanzo.ai must appear, word for word, on our page.
// Usage: node scripts/copycheck.mjs /about /dev ...   (dev server on :4180, or HZ_BASE=...; CHROME=path on Linux). Done means "missing 0".
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';

const OUT = 'shots/copycheck';
fs.mkdirSync(OUT, { recursive: true });
const norm = (s) => s.toLowerCase().replace(/[’']/g, "'").replace(/[“”]/g, '"').replace(/[–—]/g, '-').replace(/\s+/g, ' ').trim();
const b = await puppeteer.launch({ executablePath: process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });

async function text(url) {
  const p = await b.newPage();
  await p.setViewport({ width: 1470, height: 900 });
  await p.goto(url, { waitUntil: 'networkidle2', timeout: 120000 }).catch(() => {});
  // open every collapsed thing and scroll through so lazy sections render
  await p.evaluate(async () => {
    document.querySelectorAll('details').forEach((d) => (d.open = true));
    for (let y = 0; y < document.documentElement.scrollHeight; y += 700) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); }
  });
  await new Promise((r) => setTimeout(r, 800));
  // textContent (not innerText) so hidden tabs, accordions and visually-hidden copy still count
  const t = await p.evaluate(() => {
    const main = document.querySelector('main') || document.body;
    main.querySelectorAll('script,style,noscript,svg').forEach((n) => n.remove());
    return [...main.querySelectorAll('h1,h2,h3,h4,h5,p,li,dt,dd,td,th,button,a,span,div,label,figcaption,blockquote')]
      .filter((e) => !e.children.length).map((e) => e.textContent);
  });
  await p.close();
  return t;
}

for (const path of process.argv.slice(2)) {
  const live = [...new Set((await text('https://hanzo.ai' + path)).map(norm).filter((s) => s.length >= 12 && /[a-z]{3}/.test(s)))];
  const ours = norm((await text((process.env.HZ_BASE || 'http://localhost:4180') + path.replace(/\/?$/, '/'))).join(' \n '));
  const missing = live.filter((s) => !ours.includes(s));
  fs.writeFileSync(`${OUT}/${path === '/' ? 'home' : path.slice(1).replace(/\//g, '_')}.txt`, missing.join('\n'));
  console.log(`${path.padEnd(14)} missing ${missing.length} of ${live.length} lines`);
}
await b.close();
