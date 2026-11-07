// Reference Lab: film a reference site MOVING and measure its motion and layout.
// Usage: node docs/refs/lab/film.mjs <url> <outdir> [--open "<css selector of a card to click>"] [--seconds 32]
//   CHROME=/path/to/chrome overrides the browser (default: Chrome for Testing if installed, else /opt/pw-browsers/chromium).
// Writes to <outdir>: desktop.mp4 (1470x801 walk), phone.mp4 (375x812 walk), frames/*.jpg, measure.json, summary.md.
// What it measures (desktop unless noted):
//   - every animation and transition the browser starts (CDP Animation domain), labelled by what the "person" was doing
//   - document.getAnimations() at rest (idle loops), videos, canvases, style mutations with no input (JS-driven motion)
//   - the CSS and JS the site ships: durations, cubic-beziers, @keyframes, GSAP/ScrollTrigger/Lenis/Motion params
//   - 10 scroll positions down then back up: which elements are scroll-linked (reversible), triggered once, or pinned
//   - sticky/pinned scene lengths, hover response of each kind of control, press response, custom cursor, menu open,
//     and the card-to-page open (time to URL change, animations it starts, frames)
//   - layout: type scale, line height, tracking, section spacing, containers, grids, colours (desktop and phone)
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(new URL('../../../package.json', import.meta.url));
const puppeteer = require('puppeteer-core');

const argv = process.argv.slice(2);
const url = argv[0], out = argv[1];
const opt = (k, d) => { const i = argv.indexOf(k); return i > -1 ? argv[i + 1] : d; };
const openSel = opt('--open', null);
const seconds = +opt('--seconds', 36);
if (!url || !out) { console.log('usage: node docs/refs/lab/film.mjs <url> <outdir> [--open sel] [--seconds 32]'); process.exit(2); }
fs.mkdirSync(path.join(out, 'frames'), { recursive: true });
const tmp = fs.mkdtempSync(path.join(process.env.LAB_TMP || '/tmp', 'lab-')); // LAB_TMP: where screenshots and raw video go (Chrome keeps its own temp)
const cft = fs.existsSync('chrome') ? execFileSync('bash', ['-c', 'ls -d chrome/linux-*/chrome-linux64/chrome 2>/dev/null | tail -1']).toString().trim() : '';
const CHROME = process.env.CHROME || cft || '/opt/pw-browsers/chromium';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const DESK = { width: 1470, height: 801 };
const PHONE = { width: 375, height: 812, deviceScaleFactor: 1, isMobile: true, hasTouch: true };
const IPHONE_UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, protocolTimeout: 300000,
  args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required', '--hide-scrollbars'] }); // no --use-gl=angle: it breaks WebGL2 heroes in headless

// ---------- in-page probe: style mutations (JS-driven motion), text changes (typing/streaming), frame times ----------
const PROBE = () => {
  const P = (window.__lab = { phase: 'arrival', muts: {}, chars: {}, styleTargets: new Map(), frames: [] });
  const label = (n) => { if (!n || !n.tagName) return '?'; const c = typeof n.className === 'string' ? n.className.trim().split(/\s+/).slice(0, 2).join('.') : ''; return n.tagName.toLowerCase() + (n.id ? '#' + n.id : '') + (c ? '.' + c : ''); };
  P.label = label;
  const start = () => new MutationObserver((list) => {
    for (const m of list) {
      P.muts[P.phase] = (P.muts[P.phase] || 0) + 1;
      if (m.type === 'characterData' || m.type === 'childList' && m.target.nodeType === 1 && m.addedNodes.length && [...m.addedNodes].some((x) => x.nodeType === 3)) P.chars[P.phase] = (P.chars[P.phase] || 0) + 1;
      if (m.type === 'attributes' && m.attributeName === 'style') {
        const k = label(m.target); const e = P.styleTargets.get(k) || { n: 0, phases: {}, sample: '' };
        e.n++; e.phases[P.phase] = (e.phases[P.phase] || 0) + 1; e.sample = (m.target.getAttribute('style') || '').slice(0, 160);
        P.styleTargets.set(k, e);
      }
    }
  }).observe(document.documentElement, { subtree: true, attributes: true, attributeFilter: ['style', 'class', 'd', 'transform', 'aria-expanded', 'aria-selected', 'data-state'], characterData: true, childList: true });
  if (document.documentElement) start(); else addEventListener('DOMContentLoaded', start);
  let last = performance.now();
  const tick = (t) => { if (P.frames.length < 20000) P.frames.push(Math.round(t - last)); last = t; requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
};

// ---------- CDP Animation domain: every CSS transition / CSS animation / WAAPI animation the browser starts ----------
async function animRecorder(page) {
  const cdp = await page.target().createCDPSession();
  const events = []; let phase = 'arrival'; const t0 = Date.now();
  await cdp.send('Animation.enable');
  cdp.on('Animation.animationStarted', ({ animation: a }) => {
    if (events.length > 6000) return;
    const s = a.source || {};
    events.push({ t: Date.now() - t0, phase, type: a.type, name: a.name || s.keyframesRule?.name || '', duration: Math.round(s.duration || 0), delay: Math.round(s.delay || 0),
      iterations: s.iterations === null || s.iterations > 1e6 ? 'infinite' : s.iterations, easing: s.easing, direction: s.direction,
      kfEasing: (s.keyframesRule?.keyframes || []).map((k) => k.easing).filter((e) => e && e !== 'ease').slice(0, 2).join(' | '), node: s.backendNodeId });
  });
  const describe = async () => {
    const ids = [...new Set(events.map((e) => e.node).filter(Boolean))].slice(0, 400), names = {};
    for (const id of ids) {
      try { const { node } = await cdp.send('DOM.describeNode', { backendNodeId: id }); const at = {}; for (let i = 0; i < (node.attributes || []).length; i += 2) at[node.attributes[i]] = node.attributes[i + 1];
        names[id] = node.nodeName.toLowerCase() + (at.id ? '#' + at.id : '') + (at.class ? '.' + at.class.trim().split(/\s+/).slice(0, 2).join('.') : ''); } catch { names[id] = '?'; }
    }
    for (const e of events) e.target = names[e.node] || '?';
  };
  return { cdp, events, setPhase: (p) => { phase = p; }, describe };
}
const setPhase = async (page, rec, p) => { rec.setPhase(p); await page.evaluate((x) => { if (window.__lab) window.__lab.phase = x; }, p).catch(() => {}); };

async function dismissBanners(page) {
  await page.evaluate(() => {
    const re = /^(accept|accept all|allow all|agree|i agree|got it|ok|okay|allow|continue|accept cookies|reject all|decline)$/i;
    for (const b of document.querySelectorAll('button, a, [role=button]')) { const t = (b.innerText || '').trim(); if (re.test(t) && b.getBoundingClientRect().width > 0) { b.click(); break; } }
  }).catch(() => {});
}

// ---------- assets: CSS + JS bodies the site ships, scanned for motion values ----------
function collectAssets(page) {
  const css = [], js = [];
  page.on('response', async (r) => {
    try {
      const type = r.request().resourceType(); const u = r.url();
      if (/googletagmanager|google-analytics|segment|hotjar|intercom|doubleclick|clarity|sentry|datadog|onetrust|cookielaw|recaptcha|stripe/i.test(u)) return;
      if (type === 'stylesheet') css.push({ u, body: (await r.text()).slice(0, 4e6) });
      else if (type === 'script' && r.status() < 300) { const b = await r.text(); if (b.length < 6e6) js.push({ u, body: b }); }
    } catch {}
  });
  return { css, js };
}
const tally = (arr) => { const m = {}; for (const x of arr) m[x] = (m[x] || 0) + 1; return Object.entries(m).sort((a, b) => b[1] - a[1]); };
function scanCSS(texts) {
  const all = texts.join('\n');
  const beziers = tally(all.match(/cubic-bezier\([^)]*\)/g) || []).slice(0, 15);
  const trans = tally((all.match(/transition(?:-duration)?\s*:[^;}]{1,200}/g) || []).map((s) => s.replace(/\s+/g, ' ').trim())).slice(0, 40);
  const durs = tally((all.match(/(?:transition|animation)[^;{}]*?(\d*\.?\d+m?s)/g) || []).map((s) => s.match(/(\d*\.?\d+m?s)/)[1])).slice(0, 15);
  const kf = []; const re = /@(?:-webkit-)?keyframes\s+([\w-]+)\s*\{((?:[^{}]*\{[^{}]*\})*)\s*\}/g; let m;
  while ((m = re.exec(all)) && kf.length < 60) kf.push({ name: m[1], body: m[2].replace(/\s+/g, ' ').slice(0, 300) });
  const anim = tally((all.match(/animation(?:-name)?\s*:[^;}]{1,160}/g) || []).map((s) => s.replace(/\s+/g, ' ').trim())).slice(0, 30);
  const scrollDriven = tally(all.match(/(animation-timeline|view-timeline|scroll-timeline|animation-range)\s*:[^;}]{1,80}/g) || []).slice(0, 20);
  const vt = tally(all.match(/::view-transition[\w-]*(\([^)]*\))?|view-transition-name\s*:[^;}]{1,60}/g) || []).slice(0, 20);
  const reduced = (all.match(/prefers-reduced-motion/g) || []).length;
  const fonts = tally((all.match(/font-family\s*:[^;}]{1,120}/g) || []).map((s) => s.replace(/\s+/g, ' '))).slice(0, 12);
  const vars = tally(all.match(/--[\w-]*(?:ease|duration|dur|speed|timing|motion|spring)[\w-]*\s*:[^;}]{1,80}/gi) || []).slice(0, 40);
  return { bytes: all.length, beziers, durations: durs, transitions: trans, animations: anim, keyframes: kf, scrollDriven, viewTransitions: vt, reducedMotionQueries: reduced, fonts, motionVars: vars };
}
function scanJS(files) {
  const libs = {}; const hits = { beziers: [], easeArrays: [], gsapEases: [], tweens: [], springs: [], scrollTriggers: [], lenis: [], misc: [] };
  const fp = { gsap: /gsap\.(to|from|timeline|registerPlugin)|GreenSock/, ScrollTrigger: /ScrollTrigger/, SplitText: /SplitText/, Lenis: /lenis/i, 'motion/framer-motion': /framer-motion|motion-dom|useScroll|animateValue|MotionValue/, three: /THREE\.|WebGLRenderer/, ogl: /\bogl\b|new Renderer\(\{[^}]*dpr/, barba: /barba/i, swup: /swup/i, locomotive: /locomotive/i, lottie: /lottie|bodymovin/, rive: /@rive-app|rive\.wasm/, theatre: /@theatre/, swiper: /swiper/i, embla: /embla/i, 'Webflow IX2': /ixData|webflow\.ix|IX2/, 'Framer': /framer\.com\/m\/|__framer|framer-motion/, 'View Transitions API': /startViewTransition/ };
  for (const { u, body } of files) {
    for (const [k, re] of Object.entries(fp)) if (re.test(body)) (libs[k] = libs[k] || []).push(u.split('/').slice(-1)[0].slice(0, 40));
    const push = (arr, re, n = 40) => { let m; const r = new RegExp(re.source, 'g'); let c = 0; while ((m = r.exec(body)) && c++ < 300) { if (arr.length < 4000) arr.push(m[0].replace(/\s+/g, ' ').slice(0, 220)); } };
    push(hits.beziers, /cubic-bezier\([^)]*\)/);
    push(hits.easeArrays, /(?:ease|easing|transition)\s*:\s*\[\s*-?[\d.]+\s*,\s*-?[\d.]+\s*,\s*-?[\d.]+\s*,\s*-?[\d.]+\s*\]/);
    push(hits.gsapEases, /ease\s*:\s*["'](?:power\d|expo|circ|sine|back|quart|quint|cubic|elastic|bounce|steps|none|linear|CustomEase)[\w.()"',-]*["']/);
    push(hits.tweens, /\{[^{}]{0,160}\b(?:duration|stagger)\s*:\s*[\d.!]+[^{}]{0,160}\}/);
    push(hits.springs, /\{[^{}]{0,80}(?:stiffness|damping|bounce|visualDuration)\s*:\s*[\d.]+[^{}]{0,120}\}/);
    push(hits.scrollTriggers, /scrollTrigger\s*:\s*\{[^{}]{0,300}\}|ScrollTrigger\.create\(\{[^{}]{0,300}\}/);
    push(hits.lenis, /new\s+\w+\(\{[^{}]{0,200}(?:lerp|smoothWheel|wheelMultiplier)[^{}]{0,200}\}/);
    push(hits.misc, /(?:scrub|pin|pinSpacing|anticipatePin)\s*:\s*(?:!0|!1|true|false|[\d.]+|["'][^"']{1,40}["'])/);
  }
  const top = (a, n = 25) => tally(a).slice(0, n);
  return { files: files.length, bytes: files.reduce((s, f) => s + f.body.length, 0), libs: Object.fromEntries(Object.entries(libs).map(([k, v]) => [k, [...new Set(v)].slice(0, 4)])),
    beziers: top(hits.beziers, 15), easeArrays: top(hits.easeArrays, 15), gsapEases: top(hits.gsapEases, 15), tweens: top(hits.tweens.filter((t) => /ease|delay|stagger|duration/.test(t)), 40), springs: top(hits.springs, 25), scrollTriggers: top(hits.scrollTriggers, 25), lenis: top(hits.lenis, 8), scrubPin: top(hits.misc, 20) };
}

// ---------- in-page measurements ----------
const LAYOUT = () => {
  const vw = innerWidth, cs = (e) => getComputedStyle(e), px = (v) => Math.round(parseFloat(v) * 10) / 10;
  const hex = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return c; const [r, g, b, a = 1] = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); if (a === 0) return null; return '#' + [r, g, b].map((x) => Math.round(x).toString(16).padStart(2, '0')).join('') + (a < 1 ? `@${Math.round(a * 100)}%` : ''); };
  const lab = window.__lab?.label || ((n) => n.tagName.toLowerCase());
  const type = {};
  for (const tag of ['h1', 'h2', 'h3', 'h4', 'p', 'li', 'a', 'button', 'small', 'figcaption', 'blockquote', 'label', 'span']) {
    const combos = {};
    for (const e of [...document.querySelectorAll(tag)].slice(0, 400)) {
      const r = e.getBoundingClientRect(); if (!r.width || !(e.innerText || '').trim()) continue; const s = cs(e); if (s.visibility === 'hidden' || s.display === 'none') continue;
      const fs = parseFloat(s.fontSize), lh = s.lineHeight === 'normal' ? 'normal' : Math.round(parseFloat(s.lineHeight) / fs * 100) / 100;
      const ls = s.letterSpacing === 'normal' ? 0 : Math.round(parseFloat(s.letterSpacing) / fs * 1000) / 1000;
      const k = `${px(s.fontSize)}px / lh ${lh} / ls ${ls}em / w${s.fontWeight} / ${s.fontFamily.split(',')[0].replace(/["']/g, '')}${s.textTransform !== 'none' ? ' / ' + s.textTransform : ''}`;
      combos[k] = combos[k] || { n: 0, color: hex(s.color), sample: (e.innerText || '').trim().slice(0, 50).replace(/\s+/g, ' ') }; combos[k].n++;
    }
    const list = Object.entries(combos).sort((a, b) => parseFloat(b[0]) - parseFloat(a[0])).slice(0, tag === 'span' ? 6 : 5);
    if (list.length) type[tag] = list.map(([k, v]) => `${k}  (x${v.n}, ${v.color}) "${v.sample}"`);
  }
  // sections: top-level blocks of main (or body) and the gaps between them
  const main = document.querySelector('main') || document.body;
  let blocks = [...main.children].filter((e) => e.getBoundingClientRect().height > 80);
  if (blocks.length === 1) blocks = [...blocks[0].children].filter((e) => e.getBoundingClientRect().height > 80);
  const sections = blocks.slice(0, 30).map((e) => { const r = e.getBoundingClientRect(), s = cs(e); return { el: lab(e), top: Math.round(r.top + scrollY), h: Math.round(r.height), pad: `${px(s.paddingTop)} / ${px(s.paddingBottom)}`, margin: `${px(s.marginTop)} / ${px(s.marginBottom)}`, bg: hex(s.backgroundColor), text: (e.innerText || '').trim().slice(0, 60).replace(/\s+/g, ' ') }; });
  // containers, grids, radii, colours
  const widths = {}, maxw = {}, grids = {}, radii = {}, bgs = {}, fgs = {}, gaps = {};
  for (const e of [...document.querySelectorAll('body *')].slice(0, 6000)) {
    const r = e.getBoundingClientRect(); if (r.width < 2 || r.height < 2) continue; const s = cs(e);
    if (s.maxWidth !== 'none' && !s.maxWidth.includes('%')) maxw[s.maxWidth] = (maxw[s.maxWidth] || 0) + 1;
    if (r.width >= 500 && r.width < vw - 8 && Math.abs(r.left - (vw - r.right)) < 3) widths[Math.round(r.width)] = (widths[Math.round(r.width)] || 0) + 1;
    if (s.display.includes('grid') && s.gridTemplateColumns.split(' ').length > 1) { const k = `${s.gridTemplateColumns.split(' ').length} cols [${s.gridTemplateColumns.slice(0, 70)}] gap ${s.columnGap}/${s.rowGap}`; grids[k] = (grids[k] || 0) + 1; }
    if (s.display.includes('flex') && s.gap !== 'normal' && s.gap !== '0px') gaps[s.gap] = (gaps[s.gap] || 0) + 1;
    if (s.borderRadius !== '0px') radii[s.borderRadius] = (radii[s.borderRadius] || 0) + 1;
    const bg = hex(s.backgroundColor); if (bg) bgs[bg] = (bgs[bg] || 0) + Math.round(r.width * r.height / 1000);
    const t = [...e.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).join(''); if (t) { const c = hex(s.color); fgs[c] = (fgs[c] || 0) + t.length; }
  }
  const top = (o, n) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, n);
  const root = cs(document.documentElement), body = cs(document.body);
  return { viewport: `${innerWidth}x${innerHeight}`, scrollHeight: document.documentElement.scrollHeight, screens: Math.round(document.documentElement.scrollHeight / innerHeight * 10) / 10,
    rootFont: root.fontSize, bodyFont: `${body.fontSize} ${body.fontFamily.split(',')[0]}`, bodyBg: hex(body.backgroundColor) || hex(root.backgroundColor), type, sections,
    centeredWidths: top(widths, 8), maxWidths: top(maxw, 8), grids: top(grids, 10), flexGaps: top(gaps, 10), radii: top(radii, 8), backgrounds: top(bgs, 10), textColours: top(fgs, 10) };
};

const STATIC_MOTION = () => {
  const lab = window.__lab?.label || ((n) => n.tagName.toLowerCase()); const all = [...document.querySelectorAll('*')];
  const trans = {}, sticky = [], fixed = [], timelines = [];
  for (const e of all.slice(0, 8000)) {
    const s = getComputedStyle(e);
    if (s.transitionDuration && s.transitionDuration !== '0s') { const k = `${s.transitionProperty.slice(0, 80)} | ${s.transitionDuration} | ${s.transitionTimingFunction.slice(0, 90)} | delay ${s.transitionDelay}`; (trans[k] = trans[k] || { n: 0, eg: lab(e) }).n++; }
    if (s.position === 'sticky') { const r = e.getBoundingClientRect(), pr = e.parentElement.getBoundingClientRect(); sticky.push({ el: lab(e), top: s.top, h: Math.round(r.height), parent: lab(e.parentElement), parentH: Math.round(pr.height), pinnedFor: Math.round(pr.height - r.height), pinnedScreens: Math.round((pr.height - r.height) / innerHeight * 100) / 100, docTop: Math.round(pr.top + scrollY) }); }
    if (s.position === 'fixed') { const r = e.getBoundingClientRect(); if (r.width && r.height) fixed.push({ el: lab(e), rect: [r.x, r.y, r.width, r.height].map(Math.round), pe: s.pointerEvents, z: s.zIndex, mix: s.mixBlendMode }); }
    if (s.animationTimeline && s.animationTimeline !== 'auto') timelines.push({ el: lab(e), timeline: s.animationTimeline, range: s.animationRangeStart + ' → ' + s.animationRangeEnd, name: s.animationName });
  }
  const anims = document.getAnimations().map((a) => { const t = a.effect?.getTiming?.() || {}; return { type: a.constructor.name, name: a.animationName || a.transitionProperty || a.id || '', target: a.effect?.target ? lab(a.effect.target) : '?', duration: t.duration, delay: t.delay, easing: t.easing, iterations: t.iterations === Infinity ? 'infinite' : t.iterations, state: a.playState, timeline: a.timeline && a.timeline.constructor.name }; });
  const vids = [...document.querySelectorAll('video')].map((v) => ({ src: (v.currentSrc || '').split('?')[0].slice(-60), autoplay: v.autoplay, loop: v.loop, muted: v.muted, paused: v.paused, dur: Math.round(v.duration * 10) / 10, size: `${v.clientWidth}x${v.clientHeight}`, top: Math.round(v.getBoundingClientRect().top + scrollY) }));
  const canv = [...document.querySelectorAll('canvas')].map((c) => ({ el: lab(c), size: `${c.width}x${c.height}`, css: `${c.clientWidth}x${c.clientHeight}`, top: Math.round(c.getBoundingClientRect().top + scrollY) }));
  const libs = { gsap: !!window.gsap && (window.gsap.version || true), ScrollTrigger: !!window.ScrollTrigger, Lenis: !!(window.Lenis || window.lenis || document.documentElement.classList.contains('lenis')), Webflow: !!window.Webflow, Framer: !!document.querySelector('[data-framer-name],[data-framer-component-type]'), next: !!(window.__NEXT_DATA__ || window.next), THREE: !!window.THREE, nuxt: !!window.__NUXT__, astro: !!document.querySelector('astro-island'), viewTransition: !!document.startViewTransition, htmlClass: document.documentElement.className.slice(0, 120), bodyCursor: getComputedStyle(document.body).cursor };
  const trs = Object.entries(trans).sort((a, b) => b[1].n - a[1].n).slice(0, 40).map(([k, v]) => `${k}  (x${v.n}, e.g. ${v.eg})`);
  return { transitions: trs, sticky: sticky.slice(0, 20), fixed: fixed.slice(0, 15), cssScrollTimelines: timelines.slice(0, 20), animations: anims.slice(0, 80), videos: vids.slice(0, 20), canvases: canv, libs };
};

// 10 scroll positions down then the same 10 back up: scroll-linked (reversible) vs triggered once vs pinned
const SCROLL_SAMPLE = async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms)); const lab = window.__lab?.label || ((n) => n.tagName.toLowerCase());
  const H = document.documentElement.scrollHeight - innerHeight, pos = [...Array(10)].map((_, i) => Math.round(H * i / 9));
  const els = [...document.querySelectorAll('body *')].filter((e) => { const r = e.getBoundingClientRect(); return r.width * r.height > 900; }).slice(0, 5000);
  const parse = (t) => { if (!t || t === 'none') return [0, 0, 1, 0]; const m = t.match(/matrix(3d)?\(([^)]+)\)/); if (!m) return [0, 0, 1, 0]; const v = m[2].split(',').map(Number); if (m[1]) return [v[12], v[13], Math.hypot(v[0], v[1], v[2]), Math.atan2(v[1], v[0]) * 57.3]; return [v[4], v[5], Math.hypot(v[0], v[1]), Math.atan2(v[1], v[0]) * 57.3]; };
  const snap = () => els.map((e) => { const r = e.getBoundingClientRect(); const vis = r.bottom > 0 && r.top < innerHeight; if (!vis) return null; const s = getComputedStyle(e); const [tx, ty, sc, rot] = parse(s.transform); return { tx: Math.round(tx), ty: Math.round(ty), sc: Math.round(sc * 1000) / 1000, rot: Math.round(rot * 10) / 10, op: Math.round(+s.opacity * 100) / 100, clip: s.clipPath === 'none' ? '' : s.clipPath.slice(0, 50), docTop: Math.round(r.top + scrollY), vtop: Math.round(r.top) }; });
  const fwd = [], back = [];
  for (const y of pos) { window.scrollTo({ top: y, behavior: 'instant' }); await sleep(1000); fwd.push(snap()); }
  for (const y of [...pos].reverse()) { window.scrollTo({ top: y, behavior: 'instant' }); await sleep(1000); back.unshift(snap()); }
  window.scrollTo({ top: 0, behavior: 'instant' });
  const key = (s) => s && `${s.tx},${s.ty},${s.sc},${s.rot},${s.op},${s.clip}`;
  const res = [];
  els.forEach((e, i) => {
    const f = fwd.map((s) => s[i]), b = back.map((s) => s[i]); const visIdx = f.map((s, k) => s ? k : -1).filter((k) => k > -1); if (visIdx.length < 1) return;
    const vals = visIdx.map((k) => key(f[k])); const changes = new Set(vals).size;
    const pinned = visIdx.length >= 2 && visIdx.some((k, j) => j && Math.abs(f[k].docTop - f[visIdx[j - 1]].docTop) > 40 && Math.abs(f[k].vtop - f[visIdx[j - 1]].vtop) < 10);
    if (changes < 2 && !pinned) return;
    const rev = visIdx.filter((k) => b[k]).every((k) => key(b[k]) === key(f[k]));
    const parallax = visIdx.length >= 2 && visIdx.some((k, j) => j && f[k].ty !== f[visIdx[j - 1]].ty);
    res.push({ el: lab(e), kind: pinned ? 'pinned' : rev ? 'scroll-linked' : 'triggered once / time', at: visIdx.map((k) => `y${pos[k]}: ty${f[k].ty} tx${f[k].tx} s${f[k].sc} r${f[k].rot} o${f[k].op}${f[k].clip ? ' clip ' + f[k].clip : ''}${pinned ? ' vtop' + f[k].vtop : ''}`), area: Math.round(e.getBoundingClientRect().width * e.getBoundingClientRect().height), parallax });
  });
  // keep the biggest, one per label
  const seen = new Set();
  return { positions: pos, elements: res.sort((a, b) => b.area - a.area).filter((r) => { const k = r.el + r.kind; if (seen.has(k)) return false; seen.add(k); return true; }).slice(0, 40) };
};

// hover + press responses of each kind of control
const CANDIDATES = () => {
  const lab = window.__lab?.label || ((n) => n.tagName.toLowerCase());
  const vis = (e) => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 8 && r.height > 8 && s.visibility !== 'hidden' && s.display !== 'none' && +s.opacity > 0.05; };
  const sig = (e) => e.tagName + '|' + (typeof e.className === 'string' ? e.className.trim().split(/\s+/).slice(0, 3).join('.') : '') + '|' + (e.closest('header,nav') ? 'nav' : e.closest('footer') ? 'foot' : 'body');
  const out = [], seen = new Set();
  const add = (e, kind) => { const k = sig(e); if (seen.has(k) || !vis(e)) return; seen.add(k); const r = e.getBoundingClientRect(); window.__labC = window.__labC || []; window.__labC.push(e);
    out.push({ i: window.__labC.length - 1, kind, el: lab(e), text: (e.innerText || e.getAttribute('aria-label') || '').trim().slice(0, 40).replace(/\s+/g, ' '), w: Math.round(r.width), h: Math.round(r.height), href: e.getAttribute('href') || '' }); };
  window.__labC = [];
  document.querySelectorAll('header a, header button, nav a, nav button').forEach((e) => add(e, 'nav'));
  document.querySelectorAll('button, [role=button], a[class*=btn], a[class*=button], a[class*=cta]').forEach((e) => add(e, 'button'));
  [...document.querySelectorAll('a, [role=link], [onclick], [class*=card]')].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 180 && r.height > 120; }).forEach((e) => add(e, 'card'));
  document.querySelectorAll('[role=tab], summary, [aria-expanded]').forEach((e) => add(e, 'toggle'));
  document.querySelectorAll('main a, footer a, a').forEach((e) => add(e, 'link'));
  const order = { nav: 0, button: 1, card: 2, toggle: 3, link: 4 }, cap = { nav: 5, button: 7, card: 7, toggle: 4, link: 4 }, n = {};
  return out.sort((a, b) => order[a.kind] - order[b.kind]).filter((c) => (n[c.kind] = (n[c.kind] || 0) + 1) <= cap[c.kind]);
};
const SNAP_STYLE = (i) => {
  const e = window.__labC[i]; if (!e) return null; const props = ['transform', 'scale', 'translate', 'rotate', 'opacity', 'color', 'backgroundColor', 'backgroundImage', 'boxShadow', 'borderColor', 'borderRadius', 'textDecorationLine', 'filter', 'clipPath', 'letterSpacing', 'fontWeight', 'outlineStyle', 'width', 'height'];
  const nodes = [e, ...[...e.querySelectorAll('*')].slice(0, 30)];
  const lab = window.__lab?.label || ((n) => n.tagName.toLowerCase());
  const r = e.getBoundingClientRect();
  return { rect: [r.x, r.y, r.width, r.height].map(Math.round), nodes: nodes.map((n) => { const s = getComputedStyle(n); const o = { el: lab(n) }; for (const p of props) o[p] = String(s[p]).slice(0, 90); const rr = n.getBoundingClientRect(); o.box = `${Math.round(rr.width)}x${Math.round(rr.height)}`; return o; }), cursor: getComputedStyle(e).cursor };
};
const diffSnap = (a, b) => { if (!a || !b) return []; const d = []; a.nodes.forEach((n, k) => { const m = b.nodes[k]; if (!m) return; for (const p of Object.keys(n)) if (p !== 'el' && n[p] !== m[p]) d.push(`${n.el}.${p}: ${n[p]} → ${m[p]}`); }); return d.slice(0, 12); };

// ---------- pixel change between two screenshots (does the screen move without input?) ----------
const PYDIFF = path.join(tmp, 'diff.py');
fs.writeFileSync(PYDIFF, 'import sys\nfrom PIL import Image, ImageChops\na=Image.open(sys.argv[1]).convert("L");b=Image.open(sys.argv[2]).convert("L")\nd=ImageChops.difference(a,b).point(lambda v:255 if v>12 else 0)\nh=d.histogram();print(round(100*h[255]/(a.size[0]*a.size[1]),2))\n');
async function idleChange(page, label, ms = 1500) {
  const a = path.join(tmp, `${label}-a.png`), b = path.join(tmp, `${label}-b.png`);
  const m0 = await page.evaluate(() => Object.values(window.__lab?.muts || {}).reduce((s, x) => s + x, 0)).catch(() => 0);
  await page.screenshot({ path: a }); await wait(ms); await page.screenshot({ path: b });
  const m1 = await page.evaluate(() => Object.values(window.__lab?.muts || {}).reduce((s, x) => s + x, 0)).catch(() => 0);
  let pct = -1; try { pct = +execFileSync('python3', ['-I', PYDIFF, a, b]).toString().trim(); } catch {}
  return { pixelsChangedPct: pct, domChanges: m1 - m0 };
}

const summary = { url, chrome: CHROME, at: new Date().toISOString() };

// =============== 1. DESKTOP VIDEO WALK ===============
async function walk(mode) {
  const D = mode === 'desktop', page = await browser.newPage();
  if (D) await page.setViewport(DESK); else { await page.setUserAgent(IPHONE_UA); await page.setViewport(PHONE); }
  await page.evaluateOnNewDocument(PROBE);
  const rec = await animRecorder(page); const assets = D ? collectAssets(page) : { css: [], js: [] };
  const failed = {}; page.on('requestfailed', (r) => { try { const h = new URL(r.url()).host; failed[h] = (failed[h] || 0) + 1; } catch {} });
  const webm = path.join(tmp, `${mode}.webm`); const t0 = Date.now(); const marks = [];
  const mark = async (p) => { marks.push({ t: ((Date.now() - t0) / 1000).toFixed(1), p }); await setPhase(page, rec, p); };
  await page.setContent('<meta name=viewport content="width=device-width,initial-scale=1"><body style="background:#fff"></body>');
  const sc = await page.screencast({ path: webm });
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 }).catch((e) => marks.push({ err: e.message }));
  await page.waitForNetworkIdle({ idleTime: 600, timeout: 9000 }).catch(() => {});
  await wait(1500); await dismissBanners(page); await mark('idle-top');
  const idleTop = await idleChange(page, mode + '-top', 2000);
  const topFrames = await page.evaluate(() => { const f = (window.__lab?.frames || []).slice(-40).sort((a, b) => a - b); return f.length ? f[Math.floor(f.length * 0.9)] : 0; }).catch(() => 0);
  const heavy = topFrames > 250; idleTop.p90FrameMs = topFrames; idleTop.heavy = heavy;
  if (heavy) { await mark('heavy-top: leave the first screen before hovering'); if (D) { for (let k = 0; k < 18; k++) { await page.mouse.wheel({ deltaY: DESK.height / 9 }); await wait(40); } } else await page.evaluate((v) => window.scrollTo({ top: v, behavior: 'smooth' }), PHONE.height * 2); // two screens: the heavy hero must be fully out of view await wait(1500);
    // a hide-on-scroll header comes back on a small scroll up
    if (D) await page.mouse.wheel({ deltaY: -160 }); else await page.evaluate(() => window.scrollBy({ top: -160, behavior: 'smooth' })); await wait(800); }
  const V = D ? DESK.height : PHONE.height;
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  const cdp = rec.cdp; const menu = {};
  if (D) {
    await mark('pointer-sweep');
    for (let k = 0; k <= 30; k++) { await page.mouse.move(300 + 870 * k / 30, 250 + 200 * Math.sin(k / 30 * Math.PI)); await wait(45); }
    // hover header items like a person reading the nav
    const navPts = await page.evaluate(() => [...document.querySelectorAll('header a, header button, nav a, nav button')].map((e) => e.getBoundingClientRect()).filter((r) => r.width > 10 && r.top < 120 && r.top >= 0).slice(0, 6).map((r) => [r.x + r.width / 2, r.y + r.height / 2]));
    for (const [x, y] of navPts.slice(0, 5)) { await mark('hover-nav'); await page.mouse.move(x, y, { steps: 8 }); await wait(500); }
  }
  // open a menu (dropdown on desktop, hamburger on phone)
  await mark('menu-open');
  const opened = await page.evaluate((D) => {
    const cands = [...document.querySelectorAll('header [aria-expanded], nav [aria-expanded], header button, [aria-label*=menu i], [class*=burger], [class*=menu-toggle]')].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 8 && r.top < 140 && r.top >= 0 && getComputedStyle(e).visibility !== 'hidden'; });
    const pick = D ? cands.find((e) => e.getAttribute('aria-expanded') === 'false') || cands.find((e) => e.tagName === 'BUTTON') : cands.find((e) => /menu|nav/i.test((e.getAttribute('aria-label') || '') + e.className)) || cands.find((e) => e.tagName === 'BUTTON');
    if (!pick) return null; const r = pick.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, label: (pick.innerText || pick.getAttribute('aria-label') || '').trim().slice(0, 30) };
  }, D);
  if (opened) {
    const n0 = rec.events.length; const t1 = Date.now();
    if (D) { await page.mouse.move(opened.x, opened.y, { steps: 6 }); await wait(250); await page.mouse.click(opened.x, opened.y); } else await page.touchscreen.tap(opened.x, opened.y);
    await wait(1400); menu.opened = opened; menu.anims = rec.events.slice(n0).map((e) => `${e.type} ${e.name} ${e.duration}ms +${e.delay} ${e.easing}${e.kfEasing ? ' kf:' + e.kfEasing : ''}`);
    menu.ms = Date.now() - t1; await page.screenshot({ path: path.join(tmp, `${mode}-menu.png`) });
    await mark('menu-close'); await page.keyboard.press('Escape'); await wait(400);
    const still = await page.evaluate(() => !!document.querySelector('[aria-expanded=true]'));
    if (still) { if (D) await page.mouse.click(opened.x, opened.y); else await page.touchscreen.tap(opened.x, opened.y); } await wait(600);
    if (D) await page.mouse.move(DESK.width - 4, 400);
  }
  // scroll the page like a person: one screen at a time, dwell, hover or tap something in view
  const screens = Math.min(Math.ceil(H / V), D ? 20 : 16);
  const firstScreen = heavy ? 3 : 1;
  const budget = Math.max(500, (seconds * 1000 - (Date.now() - t0) - 4500) / Math.max(1, screens - 1) - 900);
  const perScreen = [];
  for (let s = firstScreen; s < screens; s++) {
    await mark(`scroll-${s}`);
    if (D) { for (let k = 0; k < 9; k++) { await page.mouse.wheel({ deltaY: V / 9 }); await wait(40); } }
    else {
      const y0 = await page.evaluate(() => scrollY);
      await cdp.send('Input.synthesizeScrollGesture', { x: 187, y: 600, yDistance: -Math.round(V * 0.85), speed: 2200, gestureSourceType: 'touch' }).catch(() => {});
      if (Math.abs((await page.evaluate(() => scrollY)) - y0) < 20) await page.evaluate(async (d) => { const s = scrollY, t0 = performance.now(); await new Promise((res) => { const f = (t) => { const k = Math.min(1, (t - t0) / 520); window.scrollTo(0, s + d * (1 - Math.pow(1 - k, 3))); k < 1 ? requestAnimationFrame(f) : res(); }; requestAnimationFrame(f); }); }, Math.round(V * 0.85));
    }
    await wait(Math.min(700, budget * 0.4));
    if (D) { // hover the most prominent interactive thing on this screen
      const pt = await page.evaluate(() => { const c = [...document.querySelectorAll('a, button, [role=button], [role=tab]')].map((e) => [e, e.getBoundingClientRect()]).filter(([, r]) => r.top > 80 && r.bottom < innerHeight - 20 && r.width > 40).sort((a, b) => b[1].width * b[1].height - a[1].width * a[1].height)[0]; return c ? [c[1].x + c[1].width / 2, c[1].y + c[1].height / 2] : null; });
      if (pt) { await mark(`hover-${s}`); await page.mouse.move(pt[0], pt[1], { steps: 10 }); }
    }
    const ic = await idleChange(page, `${mode}-s${s}`, Math.max(500, budget * 0.5));
    perScreen.push({ screen: s + 1, y: await page.evaluate(() => Math.round(scrollY)), ...ic });
    if (await page.evaluate(() => innerHeight + scrollY >= document.documentElement.scrollHeight - 4)) break;
  }
  const probe = await page.evaluate(() => ({ muts: window.__lab?.muts, chars: window.__lab?.chars, styleTargets: [...(window.__lab?.styleTargets || new Map())].sort((a, b) => b[1].n - a[1].n).slice(0, 25), frames: window.__lab?.frames })).catch(() => ({}));
  // the card-to-page open (if the page has an internal card link)
  await mark('open-card'); const transition = {};
  const cardSel = openSel;
  const target = await page.evaluate((sel) => {
    const here = location.pathname; const list = sel ? [...document.querySelectorAll(sel)] : [...document.querySelectorAll('a[href]')].filter((a) => { try { const u = new URL(a.href); return u.host === location.host && u.pathname !== here && !u.hash && (a.querySelector('img,video,picture,canvas') || a.getBoundingClientRect().height > 160) && a.getBoundingClientRect().width > 160; } catch { return false; } });
    const a = list[0]; if (!a) return null; a.scrollIntoView({ block: 'center', behavior: 'instant' }); const r = a.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, href: a.href || '', w: Math.round(r.width), h: Math.round(r.height) };
  }, cardSel);
  if (target) {
    await wait(900); if (D) { await page.mouse.move(target.x, target.y, { steps: 12 }); await wait(700); }
    const n0 = rec.events.length; const before = page.url(); let full = false; let tc = 0; const onNav = (f) => { if (f === page.mainFrame() && !full) full = Date.now() - tc; };
    page.on('framenavigated', onNav);
    tc = Date.now(); const urlAt = page.evaluate(async (b) => { const t = performance.now(); while (location.href === b && performance.now() - t < 4000) await new Promise((r) => requestAnimationFrame(r)); return Math.round(performance.now() - t); }, before).catch(() => -1);
    if (D) await page.mouse.click(target.x, target.y); else await page.touchscreen.tap(target.x, target.y);
    const shots = [];
    for (const ms of [120, 300, 600, 1000, 1600]) { await wait(ms - (Date.now() - tc)); const f = path.join(tmp, `${mode}-open-${ms}.png`); await page.screenshot({ path: f }).catch(() => {}); shots.push(f); }
    await wait(1200);
    Object.assign(transition, { card: target, from: before, to: page.url(), msToUrlChange: await urlAt.catch(() => -1), fullDocumentLoadAtMs: full, anims: rec.events.slice(n0).map((e) => `${e.type} ${e.name} on ${e.node} ${e.duration}ms +${e.delay} ${e.easing}`).slice(0, 30), shots });
    page.off('framenavigated', onNav);
  }
  await sc.stop();
  await rec.describe();
  const fr = (probe.frames || []).slice(30).sort((a, b) => a - b); const fps = fr.length ? { medianFrameMs: fr[Math.floor(fr.length / 2)], p95FrameMs: fr[Math.floor(fr.length * 0.95)] } : {};
  delete probe.frames;
  await page.close();
  return { webm, heavy, marks, failedHosts: failed, idleTop, perScreen, menu, transition, events: rec.events, probe, fps, assets };
}

// =============== 2. DESKTOP MEASURE PASS (no filming) ===============
async function measure(heavy = false) {
  const page = await browser.newPage(); await page.setViewport(DESK); await page.evaluateOnNewDocument(PROBE);
  const rec = await animRecorder(page);
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForNetworkIdle({ idleTime: 600, timeout: 9000 }).catch(() => {});
  await wait(2500); await dismissBanners(page); await page.mouse.move(DESK.width - 4, 400);
  const layout = await page.evaluate(LAYOUT);
  const stat = await page.evaluate(STATIC_MOTION);
  await setPhase(page, rec, 'scroll-sample');
  const scroll = await page.evaluate(SCROLL_SAMPLE);
  await wait(800);
  const statAfter = await page.evaluate(STATIC_MOTION); // sticky lengths after lazy content
  // custom cursor: does a fixed element follow the pointer?
  const fixedBefore = await page.evaluate(() => [...document.querySelectorAll('*')].filter((e) => getComputedStyle(e).position === 'fixed').map((e) => { const r = e.getBoundingClientRect(); return [r.x, r.y, r.width, r.height].map(Math.round).join(','); }));
  await page.mouse.move(400, 300, { steps: 5 }); await wait(120); const tA = await page.evaluate(() => [...document.querySelectorAll('*')].filter((e) => getComputedStyle(e).position === 'fixed').map((e) => { const r = e.getBoundingClientRect(); return { el: window.__lab.label(e), x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width) }; }));
  await page.mouse.move(900, 500, { steps: 5 }); await wait(60); const tB = await page.evaluate(() => [...document.querySelectorAll('*')].filter((e) => getComputedStyle(e).position === 'fixed').map((e) => { const r = e.getBoundingClientRect(); return { el: window.__lab.label(e), x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width) }; }));
  await wait(600); const tC = await page.evaluate(() => [...document.querySelectorAll('*')].filter((e) => getComputedStyle(e).position === 'fixed').map((e) => { const r = e.getBoundingClientRect(); return { el: window.__lab.label(e), x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width) }; }));
  const cursor = tA.map((a, k) => ({ a, b: tB[k], c: tC[k] })).filter((o) => o.b && o.c && (o.a.x !== o.c.x || o.a.y !== o.c.y) && o.a.w < 200).map((o) => ({ el: o.a.el, at400_300: [o.a.x, o.a.y], after60ms: [o.b.x, o.b.y], after660ms: [o.c.x, o.c.y], note: 'moved toward 900,500: a lag between 60ms and 660ms means a lerped/spring cursor' }));
  // hover + press on each kind of control
  await setPhase(page, rec, 'hover');
  if (heavy) { await page.evaluate(() => window.scrollTo({ top: innerHeight * 1.5, behavior: 'instant' })); await wait(800); }
  const cands = await page.evaluate(CANDIDATES); const hovers = [], presses = [];
  for (const c of cands.slice(0, 26)) {
    const pt = await page.evaluate((i) => { const e = window.__labC[i]; e.scrollIntoView({ block: 'center', behavior: 'instant' }); const r = e.getBoundingClientRect(); return r.width ? [r.x + Math.min(r.width / 2, r.width - 4), r.y + r.height / 2] : null; }, c.i);
    if (!pt) continue; await page.mouse.move(DESK.width - 4, Math.min(780, pt[1] + 300)); await wait(450);
    const base = await page.evaluate(SNAP_STYLE, c.i); const n0 = rec.events.length; rec.setPhase('hover:' + c.el);
    await page.mouse.move(pt[0], pt[1], { steps: 4 }); const curve = [];
    for (const ms of [60, 200, 450, 900]) { await wait(ms - (curve.length ? [60, 200, 450, 900][curve.length - 1] : 0)); curve.push({ ms, d: diffSnap(base, await page.evaluate(SNAP_STYLE, c.i)) }); }
    const after = await page.evaluate(SNAP_STYLE, c.i);
    const jump = base && after && (Math.abs(base.rect[2] - after.rect[2]) > 1 || Math.abs(base.rect[3] - after.rect[3]) > 1) ? `size ${base.rect[2]}x${base.rect[3]} → ${after.rect[2]}x${after.rect[3]}` : '';
    hovers.push({ ...c, cursor: after?.cursor, response: curve.find((x) => x.d.length)?.ms || null, changes: curve[curve.length - 1].d, earlyChanges: curve[0].d.length, jump, transitions: rec.events.slice(n0).map((e) => `${e.type} ${e.name} ${e.duration}ms +${e.delay} ${e.easing}${e.kfEasing ? ' kf:' + e.kfEasing : ''} (${e.node})`).slice(0, 8) });
    if (presses.length < 6 && /button|card|nav/.test(c.kind)) {
      await page.evaluate(() => { window.addEventListener('click', (e) => { e.preventDefault(); e.stopImmediatePropagation(); }, { capture: true, once: true }); });
      const n1 = rec.events.length; await page.mouse.down(); await wait(160); const pr = await page.evaluate(SNAP_STYLE, c.i);
      presses.push({ el: c.el, kind: c.kind, text: c.text, changes: diffSnap(after, pr), transitions: rec.events.slice(n1).map((e) => `${e.type} ${e.name} ${e.duration}ms ${e.easing}`).slice(0, 4) });
      await page.mouse.up(); await wait(150);
    }
  }
  await rec.describe();
  await page.close();
  return { layout, stat, statAfter: { sticky: statAfter.sticky, cssScrollTimelines: statAfter.cssScrollTimelines }, scroll, cursor, fixedCount: fixedBefore.length, hovers, presses, events: rec.events };
}

async function phoneLayout() {
  const page = await browser.newPage(); await page.setUserAgent(IPHONE_UA); await page.setViewport(PHONE); await page.evaluateOnNewDocument(PROBE);
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForNetworkIdle({ idleTime: 600, timeout: 9000 }).catch(() => {});
  await wait(2000); await dismissBanners(page);
  const layout = await page.evaluate(LAYOUT); const stat = await page.evaluate(STATIC_MOTION);
  await page.close(); return { layout, sticky: stat.sticky, videos: stat.videos, canvases: stat.canvases };
}

const evSum = (events) => { const m = {}; for (const e of events) { const ph = e.phase.replace(/^(scroll|hover)-\d+$/, '$1-*').replace(/^hover:.*/, 'hover:*'); const k = `${ph} :: ${e.type} ${e.name || ''} ${e.duration}ms +${e.delay}ms ${e.easing}${e.kfEasing ? ' kf:' + e.kfEasing : ''} x${e.iterations} on ${String(e.target || e.node).replace(/#[^.\s]+/g, '')}`; m[k] = (m[k] || 0) + 1; } return Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 80).map(([k, n]) => `${n}× ${k}`); };

const desk = await walk('desktop');
console.log('desktop walk done', desk.marks.length, 'marks');
const meas = await measure(desk.heavy);
console.log('measure done');
const ph = await walk('phone');
console.log('phone walk done');
const phl = await phoneLayout();

fs.writeFileSync(path.join(tmp, 'raw.json'), JSON.stringify({ desk: { ...desk, assets: undefined }, meas, ph: { ...ph, assets: undefined }, phl }));
fs.copyFileSync(path.join(tmp, 'raw.json'), path.join(out, '.raw.json'));
// video: small mp4s + frames
const mp4 = (src, dst, w) => execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', src, '-vf', `scale=${w}:-2,fps=30`, '-c:v', 'libx264', '-preset', 'slow', '-crf', '31', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', dst]);
const dur = (f) => +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString().trim();
mp4(desk.webm, path.join(out, 'desktop.mp4'), 1102); mp4(ph.webm, path.join(out, 'phone.mp4'), 374);
const frames = [];
const grab = (src, t, name, w) => { const f = path.join(out, 'frames', name); execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-ss', String(t), '-i', src, '-frames:v', '1', '-vf', `scale=${w}:-2`, '-q:v', '5', f]); frames.push('frames/' + name); };
const dd = dur(path.join(out, 'desktop.mp4')), pd = dur(path.join(out, 'phone.mp4'));
const at = (re, plus) => { const m = desk.marks.find((x) => re.test(x.p || '')); return m ? Math.min(dd - 0.2, +m.t + plus) : null; };
const scrollMarks = desk.marks.filter((x) => /^scroll-/.test(x.p || ''));
const pickT = [Math.min(1.5, dd * 0.05), at(/^idle-top/, 1.8), ...[0.25, 0.5, 0.8].map((f) => { const m = scrollMarks[Math.floor(f * (scrollMarks.length - 1))]; return m ? Math.min(dd - 0.2, +m.t + 0.9) : dd * f; })].filter((x) => x != null);
pickT.forEach((t, k) => grab(path.join(out, 'desktop.mp4'), t.toFixed(2), `d${k + 1}-${Math.round(t)}s.jpg`, 980));
[0.1, 0.45, 0.8].forEach((f, k) => grab(path.join(out, 'phone.mp4'), (pd * f).toFixed(2), `p${k + 1}-${Math.round(pd * f)}s.jpg`, 374));
for (const s of (desk.transition.shots || []).filter((_, k) => k === 1 || k === 3)) { const n = 'open-' + path.basename(s).replace(/\.png$/, '.jpg').replace('desktop-open-', ''); execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', s, '-vf', 'scale=980:-2', '-q:v', '5', path.join(out, 'frames', n)]); frames.push('frames/' + n); }
if (fs.existsSync(path.join(tmp, 'desktop-menu.png'))) { execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', path.join(tmp, 'desktop-menu.png'), '-vf', 'scale=980:-2', '-q:v', '5', path.join(out, 'frames', 'menu-desktop.jpg')]); frames.push('frames/menu-desktop.jpg'); }

const cssScan = scanCSS(desk.assets.css.map((c) => c.body)), jsScan = scanJS(desk.assets.js);
const result = { ...summary, video: { desktop: { seconds: Math.round(dd), marks: desk.marks }, phone: { seconds: Math.round(pd), marks: ph.marks } }, frames,
  blockedOrFailedHosts: { desktop: desk.failedHosts, phone: ph.failedHosts },
  nonScrollMotion: { idleAtTopDesktop: desk.idleTop, idleAtTopPhone: ph.idleTop, perScreenDesktop: desk.perScreen, perScreenPhone: ph.perScreen, runningAtRest: meas.stat.animations, videos: meas.stat.videos, canvases: meas.stat.canvases, jsStyleWriters: desk.probe.styleTargets, textChangesByPhase: desk.probe.chars, cursor: meas.cursor },
  animationsByPhaseDesktop: evSum(desk.events), animationsByPhasePhone: evSum(ph.events), animationsMeasurePass: evSum(meas.events),
  computedTransitions: meas.stat.transitions, sticky: meas.statAfter.sticky, cssScrollTimelines: meas.statAfter.cssScrollTimelines, fixed: meas.stat.fixed, libs: { runtime: meas.stat.libs, bundles: jsScan.libs },
  scroll: meas.scroll, hovers: meas.hovers, presses: meas.presses, menu: { desktop: desk.menu, phone: ph.menu }, transition: { desktop: { ...desk.transition, shots: undefined }, phone: { ...ph.transition, shots: undefined } },
  frameTiming: { desktop: desk.fps, phone: ph.fps }, css: cssScan, js: { ...jsScan, libs: undefined },
  layout: { desktop: meas.layout, phone: phl.layout, phoneSticky: phl.sticky } };
fs.writeFileSync(path.join(out, 'measure.json'), JSON.stringify(result, null, 1));

// readable summary for writing SPEC.md
const L = []; const p = (...a) => L.push(a.join(' '));
const list = (title, arr, f = (x) => (Array.isArray(x) ? `${x[1]}× ${x[0]}` : typeof x === 'string' ? x : JSON.stringify(x))) => { p(`\n## ${title}`); if (!arr || !arr.length) p('- (none)'); else for (const x of arr) p('- ' + f(x)); };
p(`# Lab summary: ${url}`); p(`measured ${result.at} with ${CHROME.split('/').slice(-3).join('/')}`);
p(`\nVideos: desktop ${Math.round(dd)}s, phone ${Math.round(pd)}s. Hosts that failed to load: ${JSON.stringify(result.blockedOrFailedHosts.desktop)}`);
list('Libraries (runtime)', Object.entries(meas.stat.libs).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`));
list('Libraries (found in bundles)', Object.entries(jsScan.libs).map(([k, v]) => `${k}: ${v.join(', ')}`));
list('Desktop walk timeline (s)', desk.marks.map((m) => `${m.t}s ${m.p || m.err}`));
list('Non-scroll motion: idle at top (no input)', [`desktop: ${JSON.stringify(desk.idleTop)}`, `phone: ${JSON.stringify(ph.idleTop)}`]);
list('Non-scroll motion: per screen while dwelling (desktop)', desk.perScreen.map((s) => `screen ${s.screen} y=${s.y}: ${s.pixelsChangedPct}% pixels changed, ${s.domChanges} DOM changes`));
list('Non-scroll motion: per screen while dwelling (phone)', ph.perScreen.map((s) => `screen ${s.screen} y=${s.y}: ${s.pixelsChangedPct}% pixels, ${s.domChanges} DOM`));
list('Running animations at rest (getAnimations)', meas.stat.animations.map((a) => `${a.type} ${a.name} on ${a.target}: ${a.duration}ms +${a.delay} ${a.easing} x${a.iterations} ${a.state} ${a.timeline}`));
list('Videos', meas.stat.videos); list('Canvases', meas.stat.canvases);
list('JS style writers (elements whose inline style JS rewrites; count by phase)', desk.probe.styleTargets.map(([k, v]) => `${k}: ${v.n} writes ${JSON.stringify(v.phases).slice(0, 160)} e.g. "${v.sample}"`));
list('Text changes by phase (typing/streaming/counters)', Object.entries(desk.probe.chars || {}).map(([k, v]) => `${k}: ${v}`));
list('Custom cursor', meas.cursor);
list('Animations the browser started, by phase (desktop walk)', evSum(desk.events));
list('Animations the browser started (measure pass: scroll sample + hovers)', evSum(meas.events));
list('Animations the browser started, by phase (phone walk)', evSum(ph.events));
list('Computed transitions (most common)', meas.stat.transitions);
list('Sticky / pinned scenes', meas.statAfter.sticky.map((s) => `${s.el} top:${s.top} in ${s.parent} (${s.parentH}px) → pinned for ${s.pinnedFor}px = ${s.pinnedScreens} screens, starts y=${s.docTop}`));
list('CSS scroll-driven timelines', meas.statAfter.cssScrollTimelines);
list(`Scroll sample at 10 positions ${JSON.stringify(meas.scroll.positions)}`, meas.scroll.elements.map((e) => `[${e.kind}${e.parallax ? ', moves in y' : ''}] ${e.el}: ${e.at.join(' | ')}`));
list('Hover responses', meas.hovers.map((h) => `[${h.kind}] ${h.el} "${h.text}" ${h.w}x${h.h} cursor:${h.cursor} first change at ${h.response}ms${h.jump ? ' LAYOUT JUMP ' + h.jump : ''}: ${h.changes.join('; ') || 'NO VISIBLE CHANGE'}${h.transitions.length ? ' || ' + h.transitions.join(' ; ') : ''}`));
list('Press responses (mouse down 160ms)', meas.presses.map((h) => `${h.el} "${h.text}": ${h.changes.join('; ') || 'no change'} ${h.transitions.join(' ; ')}`));
list('Menu open (desktop)', [JSON.stringify(desk.menu.opened || null), ...(desk.menu.anims || [])]);
list('Menu open (phone)', [JSON.stringify(ph.menu.opened || null), ...(ph.menu.anims || [])]);
list('Card / page open (desktop)', [JSON.stringify({ ...desk.transition, anims: undefined, shots: undefined }), ...(desk.transition.anims || [])]);
list('Card / page open (phone)', [JSON.stringify({ ...ph.transition, anims: undefined, shots: undefined }), ...(ph.transition.anims || [])]);
list('Frame timing', [JSON.stringify(result.frameTiming)]);
list('CSS: cubic-beziers shipped', cssScan.beziers); list('CSS: durations shipped', cssScan.durations); list('CSS: transition declarations', cssScan.transitions);
list('CSS: animation declarations', cssScan.animations); list('CSS: @keyframes', cssScan.keyframes.map((k) => `${k.name}: ${k.body}`)); list('CSS: motion variables', cssScan.motionVars);
list('CSS: scroll-driven / view-transition rules', [...cssScan.scrollDriven, ...cssScan.viewTransitions]); p(`\nprefers-reduced-motion queries in CSS: ${cssScan.reducedMotionQueries}`);
list('JS: cubic-beziers', jsScan.beziers); list('JS: easing arrays', jsScan.easeArrays); list('JS: GSAP eases', jsScan.gsapEases); list('JS: tween objects (duration/ease/stagger)', jsScan.tweens);
list('JS: springs', jsScan.springs); list('JS: ScrollTrigger configs', jsScan.scrollTriggers); list('JS: scrub/pin', jsScan.scrubPin); list('JS: smooth-scroll (Lenis) config', jsScan.lenis);
for (const [k, lay] of [['desktop 1470x801', meas.layout], ['phone 375x812', phl.layout]]) {
  p(`\n## Layout ${k}: page ${lay.scrollHeight}px = ${lay.screens} screens, root ${lay.rootFont}, body ${lay.bodyFont}, bg ${lay.bodyBg}`);
  for (const [tag, rows] of Object.entries(lay.type)) { p(`- ${tag}:`); rows.forEach((r) => p(`    - ${r}`)); }
  list(`Sections ${k}`, lay.sections.map((s) => `${s.el} y=${s.top} h=${s.h} pad ${s.pad} margin ${s.margin} bg ${s.bg} "${s.text}"`));
  list(`Centered container widths ${k}`, lay.centeredWidths); list(`max-width values ${k}`, lay.maxWidths); list(`Grids ${k}`, lay.grids); list(`Flex gaps ${k}`, lay.flexGaps); list(`Radii ${k}`, lay.radii); list(`Backgrounds by area ${k}`, lay.backgrounds); list(`Text colours by amount ${k}`, lay.textColours);
}
fs.writeFileSync(path.join(out, 'summary.md'), L.join('\n') + '\n');
fs.rmSync(path.join(out, '.raw.json'), { force: true });
await browser.close();
fs.rmSync(tmp, { recursive: true, force: true });
console.log('done →', out, 'desktop', Math.round(dd) + 's', 'phone', Math.round(pd) + 's');
