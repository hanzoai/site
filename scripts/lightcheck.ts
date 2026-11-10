// Bright mode unchanged? (docs/DARK-MODE.md) Compares every element's computed colours, device set to light, between a
// server running the code before your change (HZ_OLD, e.g. a git worktree of origin/main on :4190) and yours (HZ_BASE,
// default :4180). Elements are matched by their DOM path; reduced motion keeps the animations still. Done means "0 diffs".
// Usage: HZ_OLD=http://localhost:4190 node scripts/lightcheck.mjs /pricing /chat   (CHROME=path on Linux)
import puppeteer from 'puppeteer-core';

const NEW = process.env.HZ_BASE || 'http://localhost:4180', OLD = process.env.HZ_OLD;
if (!OLD) { console.error('Set HZ_OLD to a server running the code before your change.'); process.exit(2); }
const PROPS = ['color', 'backgroundColor', 'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor', 'outlineColor', 'fill', 'stroke', 'boxShadow', 'backgroundImage'];
const b = await puppeteer.launch({ executablePath: process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, args: ['--no-sandbox'] });

async function grab(base, path, w) {
  const p = await b.newPage();
  await p.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }, { name: 'prefers-reduced-motion', value: 'reduce' }]);
  await p.setViewport({ width: w, height: w < 500 ? 812 : 801, isMobile: w < 500, hasTouch: w < 500 });
  await p.goto(base + path.replace(/\/?$/, '/'), { waitUntil: 'networkidle2', timeout: 120000 });
  await new Promise((r) => setTimeout(r, 1500));
  const out = await p.evaluate((PROPS) => {
    const key = (e) => { const a = []; for (let x = e; x && x !== document.body; x = x.parentElement) { const sib = x.parentElement ? [...x.parentElement.children].filter((y) => y.tagName === x.tagName) : []; a.unshift(x.tagName + (typeof x.className === 'string' && x.className ? '.' + x.className.trim().split(/\s+/)[0] : '') + ':' + sib.indexOf(x)); } return a.join('>'); };
    const o = {};
    for (const e of document.querySelectorAll('body *')) { const cs = getComputedStyle(e); o[key(e)] = PROPS.map((q) => String(cs[q]).replace(/https?:\/\/[^/)"]+/g, '')).join('|'); }
    return o;
  }, PROPS);
  await p.close();
  return out;
}

let total = 0;
for (const path of process.argv.slice(2)) for (const w of [1470, 375]) {
  const A = await grab(OLD, path, w), B = await grab(NEW, path, w);
  const diff = [];
  for (const k of Object.keys(A)) if (B[k] !== undefined && A[k] !== B[k]) { const a = A[k].split('|'), c = B[k].split('|'); PROPS.forEach((q, i) => { if (a[i] !== c[i]) diff.push(`${k.split('>').slice(-2).join('>')}  ${q}: ${a[i]} -> ${c[i]}`); }); }
  total += diff.length;
  console.log(`${path.padEnd(14)} ${w}px  ${diff.length} diffs`);
  diff.slice(0, 12).forEach((d) => console.log('   ' + d.slice(0, 220)));
}
await b.close();
console.log(total ? `light: ${total} diffs` : 'light: OK (bright mode unchanged)');
process.exit(total ? 1 : 0);
