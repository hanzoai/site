// Proves the seven site-wide layers of docs/MASTER.md in a real browser: desktop 1470 (fine pointer), phone 375
// (touch) and reduced motion, on / /models /enterprise (or the paths given), plus the 404 room, a family page and the
// share cards. Hanzo's chat endpoint is intercepted and mocked (stream, JSON and failure); nothing reaches Hanzo's API.
// Every page load is also checked for hydration warnings and console errors.
// Usage: node scripts/layers.test.mjs [/path ...]   (dev server on :4180, or HZ_BASE=http://localhost:4181 for the
// built preview; one path checks only that page; queues behind other browser jobs)
import crypto from 'node:crypto';
import puppeteer from 'puppeteer-core';
import { lock } from './lock.mjs';

const BASE = process.env.HZ_BASE || 'http://localhost:4180'; // HZ_BASE=http://localhost:4181 runs it on the static export
const PAGES = process.argv.slice(2).filter((a) => a.startsWith('/'));
const FULL = !PAGES.length; // with no paths: also the 404 room, the Sigil, a family swipe, a card morph and the share cards
if (FULL) PAGES.push('/', '/models', '/enterprise');
const CHAT = 'https://api.hanzo.ai/v1/chat/public';
const ANSWER = 'Zen is Hanzo’s own model family.';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let fails = 0, warns = 0;
const check = (name, pass, detail = '') => { if (!pass) fails++; console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? '  — ' + detail : ''}`); };
// one check's crash (a slow dev compile, a missing element) fails that check only, never the run
const step = async (name, fn) => { try { await fn(); } catch (e) { check(name, false, 'crashed: ' + e.message.split('\n')[0].slice(0, 140)); } };
// the dev server compiles a page on its first visit (seconds under load): fetch it once so a click measures the transition
const warm = (p) => fetch(BASE + p.replace(/\/?$/, '/')).then((r) => r.text()).catch(() => {});

// compile every page under test once before timing anything (the dev server compiles on first visit); no browser needed yet
for (const p of [...PAGES, ...(FULL ? ['/legal', '/legal/terms', '/legal/privacy', '/no-such-page-hz-test'] : [])]) await warm(p);
await lock();
const launch = () => puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, protocolTimeout: 240000 });
let b = await launch();

// chat: 'sse' | 'json' | 'fail'. Records what the page asked the chat endpoint; aborts any other call to Hanzo's API.
async function open(path, { phone = false, reduce = false, noVT = false, chat = 'sse' } = {}) {
  if (!b.connected) { console.log('      (Chrome was closed under memory pressure: relaunching)'); b = await launch(); }
  const page = await b.newPage();
  if (phone) await page.emulate({ viewport: { width: 375, height: 812, deviceScaleFactor: 1, isMobile: true, hasTouch: true }, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1' });
  else await page.setViewport({ width: 1470, height: 900 });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: reduce ? 'reduce' : 'no-preference' }]);
  page.issues = []; page.sent = [];
  page.on('console', (m) => { const t = m.text(); if (/hydrat|did not match|server rendered HTML/i.test(t)) page.issues.push('HYDRATION ' + (t.split('\n').filter((l) => /^\s*[+-]\s+[\w-]+=/.test(l)).join(' ').replace(/\s+/g, ' ').slice(0, 300) || t.slice(0, 200))); else if (m.type() === 'error' && !/favicon|Failed to load resource|ERR_FAILED|net::/.test(t)) page.issues.push(t.slice(0, 160)); });
  page.on('pageerror', (e) => page.issues.push('PAGEERROR ' + e.message.slice(0, 160)));
  await page.setRequestInterception(true);
  page.on('request', (r) => {
    const u = r.url();
    const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'content-type' };
    if (u.startsWith(CHAT) && r.method() === 'OPTIONS') return r.respond({ status: 204, headers: cors }); // the preflight never leaves the machine either
    if (u.startsWith(CHAT) && r.method() === 'POST') {
      page.sent.push(JSON.parse(r.postData() || '{}'));
      if (chat === 'fail') return r.respond({ status: 503, headers: cors, contentType: 'application/json', body: '{"error":"down"}' });
      if (chat === 'json') return r.respond({ status: 200, headers: cors, contentType: 'application/json', body: JSON.stringify({ model: 'zen', choices: [{ message: { role: 'assistant', content: ANSWER } }] }) });
      const parts = ANSWER.match(/.{1,6}/g).map((c) => `data: ${JSON.stringify({ choices: [{ delta: { content: c } }] })}\n\n`).join('');
      return r.respond({ status: 200, headers: cors, contentType: 'text/event-stream', body: parts + 'data: [DONE]\n\n' });
    }
    if (u.startsWith('https://api.hanzo.ai/') && r.method() !== 'GET') return r.abort();
    r.continue();
  });
  await page.evaluateOnNewDocument((noVT) => {
    try { localStorage.setItem('hz-consent', '{"necessary":true}'); sessionStorage.setItem('hz-arrived', '1'); } catch {}
    if (noVT) { delete Document.prototype.startViewTransition; return; }
    window.__vt = [];
    const o = Document.prototype.startViewTransition;
    if (o) Document.prototype.startViewTransition = function (f) {
      const rec = { kind: document.documentElement.dataset.morph || '?', anims: [] };
      window.__vt.push(rec);
      const vt = o.call(this, f);
      vt.ready.then(() => { rec.anims = document.getAnimations().filter((a) => a.effect?.pseudoElement?.startsWith('::view-transition')).map((a) => [a.effect.pseudoElement, Math.round(a.effect.getComputedTiming().endTime)]); }).catch((e) => { rec.skipped = e.message.slice(0, 90); });
      return vt;
    };
  }, noVT);
  const res = await page.goto(BASE + path.replace(/\/?$/, '/'), { waitUntil: 'domcontentloaded', timeout: 300000 });
  page.status = res.status();
  await page.waitForNetworkIdle({ idleTime: 500, timeout: 30000 }).catch(() => {});
  await wait(600);
  return page;
}
const done = async (page, label) => { if (page.issues.length) { warns++; console.log(`      console on ${label}: ${page.issues.slice(0, 3).join(' | ')}`); } check(`no hydration warning: ${label}`, !page.issues.some((x) => x.startsWith('HYDRATION'))); await page.close(); };

// first in-site link in main that is big (a card) or small (a text link), skipping the WebGL opener's cards
const pickLink = (page, big) => page.evaluate((big) => {
  const ok = (a) => { const u = new URL(a.href, location.href); return u.origin === location.origin && u.pathname !== location.pathname && !a.target && !a.closest('[data-card],[data-no-morph]') && !/\.\w{2,4}$/.test(u.pathname); };
  const a = [...document.querySelectorAll('main a[href]')].find((a) => { const r = a.getBoundingClientRect(); const isBig = r.width >= 160 && r.height >= 90; return r.width > 0 && ok(a) && isBig === big; });
  if (!a) return null;
  a.setAttribute('data-test-link', '');
  a.scrollIntoView({ block: 'center' });
  return new URL(a.href).pathname;
}, big);
const clickAndLand = async (page, to) => {
  await warm(to);
  await wait(700);
  await page.$eval('[data-test-link]', (a) => a.scrollIntoView({ block: 'center' }));
  await wait(300);
  await page.$eval('[data-test-link]', (a) => a.click()); // a plain left click, as Morph sees a real one
  const landed = await page.waitForFunction((t) => location.pathname.replace(/\/$/, '') === t.replace(/\/$/, ''), { timeout: 90000 }, to).then(() => true, () => false);
  if (!landed) throw new Error(`no landing on ${to}: still at ${await page.evaluate(() => location.pathname)}, transitions ${await page.evaluate(() => JSON.stringify((window.__vt || []).map((v) => v.kind)))}`);
  await wait(1200);
  return page.evaluate(() => ({ vt: window.__vt || null, y: Math.round(scrollY), soft: !!window.__vt }));
};

// open a page, run the checks, always close it and report its console
const withPage = async (path, opt, label, fn) => { const page = await open(path, opt); try { await fn(page); } finally { await done(page, label); } };

const morph = (path, big) => step(`morph ${big ? 'card' : 'text link'} ${path}`, () => withPage(path, {}, `${path} desktop`, async (page) => {
  const to = await pickLink(page, big);
  if (!to) return console.log(`      (no plain ${big ? 'card' : 'text'} link on ${path}: its cards use the WebGL opener)`);
  const r = await clickAndLand(page, to);
  const v = r.vt[0] || { kind: 'none', anims: [] };
  const end = Math.max(0, ...v.anims.map((a) => a[1]));
  const heroed = v.anims.some(([p]) => p === '::view-transition-new(hz-morph)');
  check(`morph ${big ? 'card → hero' : 'text link → turn'} ${path} → ${to}`, v.kind === (big ? 'open' : 'turn') && (!big || heroed) && end >= 450 && end <= 800 && r.y < 5, `transition ${v.kind}, ${end} ms, hero named ${heroed}, landed y=${r.y}${v.skipped ? ', browser skipped it: ' + v.skipped : ''}`);
}));

for (const path of PAGES) {
  console.log(`\n== ${path}`);
  // 1. Morph: a card opens into the next hero, a text link turns the page, ~600 ms, page lands at its top
  await morph(path, true);
  await morph(path, false);
  // 1b. instant fallback: reduced motion and browsers without View Transitions still navigate in place
  for (const opt of [{ reduce: true }, { noVT: true }]) {
    const kind = opt.reduce ? 'reduced motion' : 'no View Transitions';
    await step(`morph fallback (${kind}) ${path}`, () => withPage(path, opt, `${path} ${opt.reduce ? 'reduced' : 'no-VT'}`, async (page) => {
      const to = await pickLink(page, false) || await pickLink(page, true);
      if (!to) return;
      const r = await clickAndLand(page, to);
      check(`morph fallback (${kind}) ${path}`, !r.vt || r.vt.length === 0, `navigated to ${to} without a transition`);
    }));
  }
  // 4. cursor label on a card, system cursor kept; 6. ⌘K answers in place (mock: stream on /, JSON on /models, failure on /enterprise)
  const chat = { '/': 'sse', '/models': 'json', '/enterprise': 'fail' }[path] || 'sse';
  await step(`cursor + ask ${path}`, () => withPage(path, { chat }, `${path} desktop+ask`, async (page) => {
    const to = await pickLink(page, true);
    if (to) {
      await wait(500);
      const box = await (await page.$('[data-test-link]')).boundingBox();
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 6 });
      await wait(450);
      const c = await page.evaluate(() => ({ on: document.querySelector('.x-cur')?.classList.contains('on'), w: document.querySelector('.x-cur span')?.textContent, sys: getComputedStyle(document.querySelector('[data-test-link]')).cursor }));
      check(`cursor says Open on a card ${path}`, c.on && c.w === 'Open' && c.sys !== 'none', `label "${c.w}", system cursor "${c.sys}"`);
    }
    await page.keyboard.down('Meta'); await page.keyboard.press('k'); await page.keyboard.up('Meta');
    await page.waitForSelector('.x-pal input', { timeout: 5000 });
    await page.type('.x-pal input', 'What is Zen?');
    await wait(300);
    const ask = await page.$('.x-pal [data-ask]');
    if (!ask) return check(`ask inline ${path}`, false, 'no in-place Ask control in the palette');
    await ask.click();
    await wait(1800);
    const a = await page.evaluate(() => ({ text: document.querySelector('.x-pal-ans')?.textContent || '', fall: document.querySelector('.x-pal-answer a[href^="https://hanzo.ai/chat"]')?.href || '' }));
    const sent = page.sent[0];
    const aware = !!sent && JSON.stringify(sent.messages).includes(path === '/' ? 'hanzo.ai/' : path);
    if (chat === 'fail') check(`ask falls back to hanzo.ai/chat ${path}`, !!sent && a.fall.includes('q=What'), `request sent ${!!sent}, fallback link ${a.fall}`);
    else check(`ask answers in place (${chat}) ${path}`, a.text.includes(ANSWER) && aware && sent.model === 'enso', `answer "${a.text.slice(0, 40)}", page-aware ${aware}, model ${sent?.model}, requests ${page.sent.length}`);
  }));
  // 3. phone: thumb bar after the hero, 44 px hit areas, sheets rise from the bottom
  await step(`phone ${path}`, () => withPage(path, { phone: true }, `${path} phone`, async (page) => {
    const top = await page.$('.x-thumb');
    await page.evaluate(() => { const h = document.querySelector('main')?.firstElementChild; scrollTo(0, (h ? h.getBoundingClientRect().bottom + scrollY : innerHeight) + 200); });
    await wait(1400);
    const t = await page.evaluate(() => { const el = document.querySelector('.x-thumb'); return el && [...el.querySelectorAll('a,button')].map((x) => { const r = x.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height), x.textContent.trim()]; }); });
    check(`thumb bar after the hero ${path}`, !top && !!t && t.every(([w, h]) => w >= 44 && h >= 44), t ? t.map((x) => x.join('×')).join(', ') : 'none shown');
    // every control in the header and the layers answers a tap anywhere in a 44 px square around its centre
    const small = await page.evaluate(() => [...document.querySelectorAll('header a, header button, .x-thumb a, .x-thumb button')].filter((el) => { const r = el.getBoundingClientRect(); return r.width && r.height && r.top >= 0 && r.bottom <= innerHeight && getComputedStyle(el).visibility !== 'hidden'; }).filter((el) => {
      const r = el.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      return [[-21, 0], [21, 0], [0, -21], [0, 21]].some(([dx, dy]) => { const h = document.elementFromPoint(Math.min(innerWidth - 1, Math.max(0, cx + dx)), Math.max(0, cy + dy)); return !h || !(h === el || el.contains(h) || h.contains(el)); });
    }).map((el) => (el.getAttribute('aria-label') || el.textContent.trim() || el.tagName).slice(0, 24)));
    check(`44 px hit areas ${path}`, !small.length, small.length ? 'too small: ' + small.join(', ') : 'all header and layer controls');
    const s = await page.$('.x-thumb-s');
    if (s) {
      await s.tap();
      await page.waitForFunction(() => { const p = document.querySelector('.x-pal'); return p && Math.abs(p.getBoundingClientRect().bottom - innerHeight) < 2; }, { timeout: 5000 }).catch(() => {});
      const sh = await page.evaluate(() => { const p = document.querySelector('.x-pal'); if (!p) return null; const r = p.getBoundingClientRect(); return { bottom: Math.round(r.bottom), H: innerHeight, top: Math.round(r.top) }; });
      check(`search rises as a bottom sheet ${path}`, !!sh && Math.abs(sh.bottom - sh.H) < 2, sh ? `sheet ${sh.top}–${sh.bottom} of ${sh.H}` : 'no sheet');
    }
  }));
  // reduced motion: first-screen headings at their final state, nothing transformed
  await step(`reduced motion ${path}`, () => withPage(path, { reduce: true }, `${path} reduced`, async (page) => {
    await wait(1200);
    const r = await page.evaluate(() => [...document.querySelectorAll('main h1, main h2, main p')].filter((e) => { const b = e.getBoundingClientRect(); return b.top < innerHeight && b.bottom > 0 && b.width && !e.closest('[aria-hidden="true"]') && e.checkVisibility({ opacityProperty: true, visibilityProperty: true }); }).slice(0, 8).map((e) => [e.tagName, +getComputedStyle(e).opacity, e.closest('[style*="transform"]')?.style.transform || 'none']));
    const bad = r.filter(([, o, t]) => o < 0.99 || (t !== 'none' && !/^(none|translateY\(0px\)|translateX\(0px\)|translateY\(0%\)|translateY\(0\)|scale\(1\)|)$/.test(t)));
    check(`reduced motion shows final states ${path}`, r.length && !bad.length, bad.length ? 'not final: ' + JSON.stringify(bad.slice(0, 3)) : `${r.length} first-screen elements final`);
  }));
}
if (FULL) {
// a page whose cards are plain links (the legal index) proves card → hero wherever the pages above use the WebGL opener
await morph('/legal', true);

// 2. Sigil and 5. the 404 room
const sig = (page) => page.evaluate(() => { const c = document.querySelector('canvas.x-sigil'); if (!c) return null; const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let h = 0; for (let i = 0; i < d.length; i += 97) h = (h * 31 + d[i]) | 0; return h; });
await step('404 room + sigil', () => withPage('/no-such-page-hz-test', {}, '404 desktop', async (page) => {
  check('404 room answers 404', page.status === 404, `status ${page.status}`);
  const a = await sig(page); await wait(1200); const bb = await sig(page);
  check('sigil moves by itself', a !== null && a !== bb, `frames ${a} → ${bb}`);
  await page.evaluate(() => { const c = document.querySelector('canvas.x-sigil'); c.style.position = 'fixed'; c.style.top = '200vh'; });
  await wait(400); const off1 = await sig(page); await wait(1000); const off2 = await sig(page);
  check('sigil pauses off screen', off1 === off2, `frames ${off1} → ${off2}`);
  await page.type('.xlo-find input', 'zen');
  await wait(400);
  const hits = await page.$$eval('.xlo-hit', (h) => h.map((x) => x.getAttribute('href')));
  check('404 searches every page', hits.length >= 3, `"zen" → ${hits.slice(0, 4).join(', ')}`);
}));
await step('sigil reduced motion', () => withPage('/no-such-page-hz-test', { reduce: true }, '404 reduced', async (page) => {
  const f1 = await sig(page); await wait(1200); const f2 = await sig(page);
  check('sigil freezes for reduced motion', f1 !== null && f1 === f2 && f1 !== 0, `frames ${f1} → ${f2}`);
}));
await step('404 room phone', () => withPage('/no-such-page-hz-test', { phone: true }, '404 phone', async (page) => {
  const r = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, W: innerWidth, h: document.querySelector('.xlo-find input')?.getBoundingClientRect().height }));
  check('404 room fits a phone', r.sw <= r.W && r.h >= 44, `width ${r.sw}/${r.W}, search field ${r.h}px tall`);
}));

// 3b. sibling swipe on a family page (phone)
await step('phone swipe', () => withPage('/legal/terms', { phone: true }, '/legal/terms phone', async (page) => {
  await warm('/legal/privacy'); await warm('/legal/aup');
  await page.evaluate(() => scrollTo(0, 400)); await wait(1500); // the sibling list loads on a phone, after the page
  const t = await page.touchscreen.touchStart(300, 420);
  for (const x of [270, 230, 190, 150, 110, 80]) { await t.move(x, 424); await wait(30); }
  await t.end();
  await page.waitForFunction(() => !location.pathname.startsWith('/legal/terms'), { timeout: 30000 }).catch(() => {});
  const to = await page.evaluate(() => location.pathname);
  check('phone swipe turns to the next sibling', to.startsWith('/legal/') && !to.startsWith('/legal/terms'), `/legal/terms → ${to}`);
}));

// 7. share cards: each route names its own image in <head>, and the images differ
await step('share cards', async () => {
  const routes = ['/', '/models', '/enterprise', '/about', '/legal/terms'];
  const seen = new Map();
  for (const r of routes) {
    const html = await (await fetch(BASE + r.replace(/\/?$/, '/'))).text();
    const head = html.slice(0, html.indexOf('</head>'));
    const url = (head.match(/<meta property="og:image" content="([^"]+)"/) || [])[1];
    let info = 'no og:image in <head>';
    if (url) {
      const res = await fetch(url.replace('https://hanzo.ai', BASE));
      const buf = Buffer.from(await res.arrayBuffer());
      const hash = crypto.createHash('md5').update(buf).digest('hex').slice(0, 10);
      info = `${url}  ${res.status} ${res.headers.get('content-type')} ${buf.length} B  md5 ${hash}`;
      if (res.status === 200 && /image\/png/.test(res.headers.get('content-type'))) seen.set(r, hash);
    }
    check(`share card ${r}`, seen.has(r), info);
  }
  check('share cards differ', new Set(seen.values()).size === routes.length, `${new Set(seen.values()).size} distinct of ${routes.length}`);
});

}
await b.close();
console.log(`\n${fails ? fails + ' FAILED' : 'ALL PASS'}${warns ? `, ${warns} page(s) logged console messages (above)` : ''}`);
process.exit(fails ? 1 : 0);
