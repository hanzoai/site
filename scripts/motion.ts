// Watch a page MOVE, not just sit: records a real video of a person using it (wheel scrolling, dwelling on each
// screen, hovering the controls on desktop, tapping tabs and toggles on a phone), then measures what moved.
// Per page and width it writes shots/<page>/<d|p>.webm, film-strip sheets shots/<page>/<d|p>-sheet-NN.jpg (3 frames a
// second, read left to right, top to bottom) and a report: which screens move by themselves (STILL = nothing moves
// without input), which hovers answer (DEAD HOVER = no response), scroll frame rate, long frames, layout shift.
// Usage: node scripts/motion.mjs /page ... [--desk-only|--phone-only]      (dev server on :4180, ffmpeg on PATH)
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import puppeteer from 'puppeteer-core';
import { lock } from './lock.ts';

const args = process.argv.slice(2);
const paths = args.filter((a) => a.startsWith('/'));
const modes = [!args.includes('--phone-only') && 'd', !args.includes('--desk-only') && 'p'].filter(Boolean);
if (!paths.length) { console.log('usage: node scripts/motion.mjs /path ... [--desk-only|--phone-only]'); process.exit(2); }
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
await lock();
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, protocolTimeout: 240000, args: ['--use-gl=angle', '--autoplay-policy=no-user-gesture-required'] });

// runs inside the page: counts what changes on screen, frame timing and layout shift
const PROBE = () => {
  const P = (window.__probe = { muts: 0, frames: [], cls: 0, rec: false, shifts: {} });
  const watch = () => new MutationObserver((l) => { P.muts += l.length; }).observe(document.documentElement, { subtree: true, attributes: true, attributeFilter: ['style', 'class', 'd', 'transform', 'data-on', 'aria-selected', 'aria-expanded'], characterData: true, childList: true });
  if (document.documentElement) watch(); else addEventListener('DOMContentLoaded', watch);
  let last = performance.now();
  const tick = (t) => { if (P.rec) P.frames.push(t - last); last = t; requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
  try { new PerformanceObserver((l) => l.getEntries().forEach((e) => { if (e.hadRecentInput) return; P.cls += e.value; (e.sources || []).forEach((x) => { const n = x.node; if (!n || !n.tagName) return; const k = n.tagName.toLowerCase() + (n.className && typeof n.className === 'string' ? '.' + n.className.trim().split(/\s+/).slice(0, 2).join('.') : ''); P.shifts[k] = (P.shifts[k] || 0) + e.value; }); })).observe({ type: 'layout-shift', buffered: true }); } catch {}
  P.inView = () => {
    const H = innerHeight, vis = (el) => { const r = el.getBoundingClientRect?.(); return r && r.bottom > 0 && r.top < H && r.width > 0; };
    const anims = document.getAnimations().filter((a) => a.playState === 'running' && a.effect?.target && vis(a.effect.target)).length;
    const vids = [...document.querySelectorAll('video')].filter((v) => !v.paused && vis(v)).length;
    const gl = [...document.querySelectorAll('canvas')].filter((c) => vis(c) && c.width > 50 && getComputedStyle(c).opacity !== '0').length;
    return { anims, vids, gl };
  };
};

const report = [];
for (const p of paths) {
  const dir = 'shots/' + (p.replace(/^\/|\/$/g, '').replace(/\//g, '_') || 'home');
  fs.mkdirSync(dir, { recursive: true });
  for (const m of modes) {
    const D = m === 'd', V = D ? 900 : 812, page = await b.newPage();
    if (D) await page.setViewport({ width: 1470, height: 900 });
    else await page.emulate({ viewport: { width: 375, height: 812, deviceScaleFactor: 1, isMobile: true, hasTouch: true }, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1' });
    const errs = [];
    page.on('pageerror', (e) => errs.push(e.message.slice(0, 140)));
    page.on('console', (x) => x.type() === 'error' && !/favicon|Failed to load resource/.test(x.text()) && errs.push(x.text().slice(0, 140)));
    await page.evaluateOnNewDocument(() => { try { localStorage.setItem('hz-consent', JSON.stringify({ necessary: true })); } catch {} });
    await page.evaluateOnNewDocument(PROBE);
    const out = [`${p} ${D ? 'desktop 1470' : 'phone 375'}`];
    const video = `${dir}/${m}.webm`;
    try {
      const rec = await page.screencast({ path: video, speed: 1 }); // started first, so the page's arrival is filmed too
      await page.goto('http://localhost:4180' + p.replace(/\/?$/, '/'), { waitUntil: 'domcontentloaded', timeout: 120000 });
      await page.waitForNetworkIdle({ idleTime: 500, timeout: 30000 }).catch(() => {});
      await page.evaluate(() => document.querySelectorAll('[role=dialog]').forEach((d) => /cookie/i.test(d.innerText) && d.remove()));
      if (D) await page.mouse.move(735, 450);
      const H = await page.evaluate(() => document.documentElement.scrollHeight);
      const screens = Math.min(14, Math.ceil(H / V));
      let still = 0, dead = 0;
      for (let s = 0; s < screens; s++) {
        if (s) { // a person scrolling one screen: wheel on desktop (drives Lenis), finger flick on phone
          await page.evaluate(() => { __probe.rec = true; });
          if (D) for (let k = 0; k < 9; k++) { await page.mouse.wheel({ deltaY: V / 9 }); await wait(45); }
          else await page.evaluate(async (v) => { for (let k = 0; k < 12; k++) { scrollBy(0, v / 12); await new Promise((r) => requestAnimationFrame(r)); } }, V * 0.9);
          await wait(250);
          await page.evaluate(() => { __probe.rec = false; });
        }
        // dwell: does anything move by itself?
        await wait(500);
        const m0 = await page.evaluate(() => __probe.muts);
        await wait(1500);
        const idle = (await page.evaluate(() => __probe.muts)) - m0;
        const live = await page.evaluate(() => __probe.inView());
        const moving = idle > 2 || live.anims || live.vids || live.gl;
        if (!moving) still++;
        const y = await page.evaluate(() => Math.round(scrollY));
        let line = `  screen ${String(s + 1).padStart(2)} y=${y}: ${moving ? 'moves' : 'STILL'} (changes ${idle}, css/waapi ${live.anims}, video ${live.vids}, canvas ${live.gl})`;
        // interact with up to 3 controls on this screen
        const targets = await page.evaluate((D) => {
          const H = innerHeight, W = innerWidth, seen = new Set();
          const sel = D ? 'main a, main button, main [role=tab], main [data-card], main [tabindex="0"], main label' : 'main [role=tab], main button[aria-expanded], main button[aria-pressed], main [role=radio]';
          return [...document.querySelectorAll(sel)].map((el) => {
            const r = el.getBoundingClientRect();
            if (r.width < 24 || r.height < 16 || r.top < 70 || r.bottom > H - 10 || r.left < 0 || r.right > W) return null;
            if (el.closest('form') && (el.type === 'submit')) return null;
            const k = Math.round(r.top / 120) + ':' + Math.round(r.left / 300);
            if (seen.has(k)) return null; seen.add(k);
            el.setAttribute('data-probe', k);
            return { k, x: r.left + r.width / 2, y: r.top + r.height / 2, label: (el.getAttribute('aria-label') || el.innerText || el.tagName).trim().replace(/\s+/g, ' ').slice(0, 28) };
          }).filter(Boolean).sort((a, b) => b.y - a.y).slice(0, 3);
        }, D);
        const res = [];
        for (const t of targets) {
          const look = (k) => { const el = document.querySelector(`[data-probe="${k}"]`); if (!el) return ''; return [el, ...el.querySelectorAll('*')].slice(0, 8).map((e) => { const c = getComputedStyle(e); return [c.color, c.backgroundColor, c.transform, c.opacity, c.textDecorationLine, c.boxShadow, c.borderColor, c.filter, c.translate, c.scale].join('|'); }).join('/'); };
          const css0 = await page.evaluate(look, t.k);
          const before = await page.evaluate(() => __probe.muts);
          if (D) { await page.mouse.move(t.x, t.y, { steps: 8 }); await wait(650); }
          else { await page.touchscreen.tap(t.x, t.y); await wait(700); if (!(await page.evaluate((p) => location.pathname.replace(/\/$/, '') === p.replace(/\/$/, ''), p))) { await page.goBack(); break; } }
          const n = (await page.evaluate(() => __probe.muts)) - before + ((await page.evaluate(look, t.k)) !== css0 ? 1 : 0);
          if (n === 0) dead++;
          res.push(`${n ? '' : 'DEAD '}${D ? 'hover' : 'tap'} "${t.label}" ${n}`);
        }
        if (D) await page.mouse.move(735, 450, { steps: 4 });
        if (res.length) line += '  | ' + res.join(' · ');
        out.push(line);
      }
      await rec.stop();
      const f = await page.evaluate(() => { const a = __probe.frames.filter((x) => x < 1000).sort((x, y) => x - y); return { n: a.length, med: a[a.length >> 1] || 0, long: a.filter((x) => x > 50).length, cls: __probe.cls, who: Object.entries(__probe.shifts).sort((x, y) => y[1] - x[1]).slice(0, 3).map(([k, v]) => k + ' ' + v.toFixed(3)).join(', ') }; });
      out.splice(1, 0, `  scroll: ${f.med ? Math.round(1000 / f.med) : '?'} fps median (headless, relative only), ${f.long}/${f.n} frames over 50ms, layout shift ${f.cls.toFixed(3)}${f.cls > 0.05 ? ' (moved: ' + f.who + ')' : ''}, ${still} still screen(s), ${dead} dead control(s)${errs.length ? ', ERRORS: ' + errs.slice(0, 2).join(' | ') : ''}`);
      // film-strip sheets: 3 frames a second
      for (const old of fs.readdirSync(dir).filter((x) => x.startsWith(m + '-sheet-'))) fs.rmSync(`${dir}/${old}`);
      const tile = D ? 'scale=490:-1,tile=3x4' : 'scale=188:-1,tile=8x2';
      execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', video, '-vf', `fps=3,${tile}`, '-q:v', '5', `${dir}/${m}-sheet-%02d.jpg`]);
      out.push(`  film: ${video} and ${fs.readdirSync(dir).filter((x) => x.startsWith(m + '-sheet-')).length} sheets (${D ? '12' : '16'} frames each, 3 per second)`);
    } catch (e) { out.push('  FAILED ' + e.message.slice(0, 160)); }
    finally { await page.close(); }
    console.log(out.join('\n')); report.push(...out);
  }
}
await b.close();
fs.writeFileSync('shots/motion-report.txt', report.join('\n') + '\n', { flag: 'a' });
