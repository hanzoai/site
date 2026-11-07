'use client';
/* Sentinel (v2, Cloud 4 chat). Archetype A, Launch: a side Stage hero with the issue view → the dark room where the
   events collapse (it plays by itself) → five facts as plain sheets in two runs → Get Sentinel → closing band. Ink, greys
   and white only.
   Persona: an engineer whose frontend and services throw errors they can't reproduce. Goal: read the migration docs.
   CTA: "Read the docs" (hero, header ask, close; data-cta primary / close).
   Metric: cta_click:sentinel.primary
   V2: 8/10 no more pinned room or stacking sheets: the page decodes (headlines and figures resolve out of scrambled characters, the minified frame decodes into its source line), the rain room plays by itself, and each section enters its own way
   Signature: decode. Headlines and figures resolve out of scrambled characters as they arrive (the hero's error, the
   room's headings and its "1 issue", each fact's heading and number, the close); the issue's top frame decodes from the
   minified line into checkout/cart.ts:42 each time the source map resolves it; hovering any of them (a tap on touch)
   re-scrambles it and it decodes again. Text only changes in place: every glyph keeps its width, so nothing reflows.
   Entrances: 1 hero = typewriter (the h1 types itself with a caret); 2 the dark room = conveyor (its lines and the card
   ride in from the right one after another); 3 facts 02–04 = glitch-in (each sheet arrives in a short monochrome slice
   glitch, then holds); 4 facts 05–06 = page-curl (a grey surface curls away from the bottom-right corner); 5 the close =
   slot-roll (its headings roll down into place word by word, like reels).
   Beyond: "Route an alert". Choose what happened (new issue, regression, spike), where it goes and which tracker opens
   the ticket, and the rule reads back as a sentence: only the destinations and trackers Hanzo names.
   Motion: decode (signature) + canvas rain (idle, with Pause) + the hero's ticking issue (idle, with Pause) + the
   alert router (state) + five entrances, each once. Every word and link is Hanzo's; the error, its frames and its counts
   are made-up examples. */
import { useEffect, useRef, useState } from 'react';
import { useInView } from 'motion/react';
import useCalm from '../../v2/useCalm';
import { useDemo, PauseBtn, useTick } from '../../v2/x-hamilton/Demo';
import StageHero from '../../v2/StageHero';
import Finale from '../../v2/Finale';
import './Sentinel.css';

const DOCS = 'https://docs.hanzo.ai/docs/guides/migrate/sentry';
const GH = 'https://github.com/hanzoai';
const rnd = (i) => { const x = Math.sin(i * 51.7) * 9301.3; return x - Math.floor(x); };
const CRUMBS = ['navigation /cart', 'click “Apply code”', 'fetch POST /discount', 'exception'];

/* ---------- decode (page-local): text nodes are split into fixed-width glyph cells while they scramble, then the
   original text nodes are put back, so React's DOM and the final typography are untouched. ---------- */
const GLY = 'ABCDEFGHJKLMNPRSTUVXYZabdeghknopqrsuvxyz0123456789#%&*+=<>/';
const still = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
const glyph = () => GLY[Math.floor(Math.random() * GLY.length)];
const isGlyph = (ch) => /[0-9A-Za-zÀ-ɏ]/.test(ch);

function split(el) {
  const nodes = [];
  const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  for (let n = w.nextNode(); n; n = w.nextNode()) if (n.nodeValue.trim()) nodes.push(n);
  const cells = [], pairs = [];
  nodes.forEach((n) => {
    const box = document.createElement('span');
    box.className = 'sn2-dt';
    n.nodeValue.split(/(\s+)/).forEach((part) => {
      if (!part) return;
      if (/^\s+$/.test(part)) { box.appendChild(document.createTextNode(part)); return; }
      const word = document.createElement('span');
      word.className = 'sn2-dw';
      for (const ch of part) { const c = document.createElement('span'); c.className = 'sn2-dc'; c.textContent = ch; word.appendChild(c); cells.push([c, ch]); }
      box.appendChild(word);
    });
    n.parentNode.replaceChild(box, n);
    pairs.push([box, n]);
  });
  cells.forEach(([c]) => { c.style.width = c.getBoundingClientRect().width + 'px'; });
  return { cells, undo: () => pairs.forEach(([box, n]) => box.parentNode && box.parentNode.replaceChild(n, box)) };
}

function decode(el, dur = 700) {
  if (!el || el.__busy || still()) return;
  el.__busy = true;
  const { cells, undo } = split(el);
  const n = cells.length, t0 = performance.now();
  const at = cells.map((_, i) => dur * (0.2 + 0.8 * (i / Math.max(1, n - 1))) * (0.85 + rnd(i + n) * 0.15));
  let last = 0;
  const step = (now) => {
    const t = now - t0;
    if (now - last > 48 || t >= dur) {
      last = now;
      cells.forEach(([c, ch], i) => { c.textContent = t >= at[i] || !isGlyph(ch) ? ch : glyph(); });
    }
    if (t < dur) requestAnimationFrame(step);
    else { undo(); el.__busy = false; }
  };
  cells.forEach(([c, ch]) => { if (isGlyph(ch)) c.textContent = glyph(); });
  requestAnimationFrame(step);
}

/* entrance 1, typewriter: the glyphs appear one by one behind a caret (hidden until typed, so nothing reflows) */
function type(el, gap = 70) {
  if (!el || el.__busy) return;
  if (still()) { el.classList.add('go'); return; }
  el.__busy = true;
  const { cells, undo } = split(el);
  cells.forEach(([c]) => { c.style.visibility = 'hidden'; });
  const caret = document.createElement('i');
  caret.className = 'sn2-caret';
  caret.setAttribute('aria-hidden', 'true');
  el.classList.add('go');
  let k = 0;
  const put = () => {
    if (k < cells.length) {
      const [c] = cells[k++];
      c.style.visibility = '';
      c.after(caret);
      setTimeout(put, gap);
    } else setTimeout(() => { caret.remove(); undo(); el.__busy = false; }, 900);
  };
  setTimeout(put, 260);
}

/* entrance 5, slot-roll: each word rolls down through three scrambled reels into place */
function roll(el, delay = 0) {
  if (!el || el.__busy) return;
  if (still()) { el.classList.add('go'); return; }
  el.__busy = true;
  const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const nodes = [];
  for (let n = w.nextNode(); n; n = w.nextNode()) if (n.nodeValue.trim()) nodes.push(n);
  const pairs = [], reels = [];
  nodes.forEach((n) => {
    const box = document.createElement('span');
    box.className = 'sn2-dt';
    n.nodeValue.split(/(\s+)/).forEach((part) => {
      if (!part) return;
      if (/^\s+$/.test(part)) { box.appendChild(document.createTextNode(part)); return; }
      const mask = document.createElement('span');
      mask.className = 'sn2-slot';
      const r = document.createElement('span');
      r.className = 'sn2-reel';
      r.appendChild(document.createTextNode(part));
      const col = document.createElement('span');
      col.className = 'sn2-reel-up';
      col.setAttribute('aria-hidden', 'true');
      for (let j = 0; j < 3; j++) { const row = document.createElement('span'); row.textContent = [...part].map((ch) => (isGlyph(ch) ? glyph() : ch)).join(''); col.appendChild(row); }
      r.appendChild(col);
      mask.appendChild(r);
      box.appendChild(mask);
      reels.push(r);
    });
    n.parentNode.replaceChild(box, n);
    pairs.push([box, n]);
  });
  el.classList.add('go');
  reels.forEach((r, i) => { r.style.transitionDelay = delay + i * 60 + 'ms'; });
  requestAnimationFrame(() => requestAnimationFrame(() => reels.forEach((r) => r.classList.add('on'))));
  setTimeout(() => { pairs.forEach(([box, n]) => box.parentNode && box.parentNode.replaceChild(n, box)); el.__busy = false; }, delay + reels.length * 60 + 560);
}

/* <Dec>: decodes once when it arrives (or types / rolls, for the entrances), and re-scrambles on hover or tap */
function Dec({ as: T = 'span', className = '', arrive = 'decode', children, ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let io;
    if (arrive === 'type') type(el);
    else if (arrive) {
      io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); arrive === 'roll' ? roll(el) : decode(el); } }, { threshold: 0.6 });
      io.observe(el);
    }
    const hover = (e) => { if (e.pointerType !== 'touch') decode(el, 520); };
    const tap = (e) => { if (e.pointerType === 'touch') decode(el, 520); };
    el.addEventListener('pointerenter', hover);
    el.addEventListener('pointerdown', tap);
    return () => { io && io.disconnect(); el.removeEventListener('pointerenter', hover); el.removeEventListener('pointerdown', tap); };
  }, [arrive]);
  return <T ref={ref} className={'sn2-dec' + (arrive === 'type' ? ' sn2-tw' : arrive === 'roll' ? ' sn2-roll' : '') + (className ? ' ' + className : '')} {...rest}>{children}</T>;
}

/* adds .in once the element is a quarter on screen (each section's entrance) */
function useEnter(amount = 0.25) {
  const ref = useRef(null);
  const [inn, setIn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setIn(true); io.disconnect(); } }, { threshold: amount });
    io.observe(el);
    return () => io.disconnect();
  }, [amount]);
  return [ref, inn];
}

/* The Stage object: the issue as Sentinel shows it, live. Events arrive (the count and the last bar grow), the top frame
   decodes through the source map, and the breadcrumbs line up under it. */
function Issue() {
  const [ref, live, , paused, toggle] = useDemo(0.05);
  const calm = useCalm();
  const [n, setN] = useState(4211);
  const [bars, setBars] = useState(() => Array.from({ length: 28 }, (_, i) => +(0.18 + rnd(i + 3) * 0.5 + (i > 20 ? (i - 20) * 0.04 : 0)).toFixed(3)));
  const [t, setT] = useState(0);
  useTick(140, live, () => { setN((v) => v + 1 + Math.floor(rnd(v) * 9)); setT((x) => x + 1); if (rnd(t) > 0.82) setBars((b) => [...b.slice(1), 0.3 + rnd(t + 9) * 0.65]); });
  const resolved = calm || Math.floor(t / 22) % 2 === 1;
  return (
    <div className="l2-obj sn2-issue" ref={ref}>
      <PauseBtn paused={paused} onClick={toggle} />
      <div className="sn2-top" aria-hidden="true">
        <span className="sn2-dots"><i /><i /><i /></span>
        <span className="l2-mono sn2-host">sentry.hanzo.ai</span>
      </div>
      <div className="sn2-body" aria-hidden="true">
        <div className="sn2-head">
          <span className="sn2-tag l2-mono">TypeError</span>
          <span className="sn2-unres l2-mono">unresolved</span>
        </div>
        <Dec as="p" className="sn2-msg">Cannot read properties of undefined</Dec>
        <div className="sn2-stats">
          <p><b className="l2-fig">{n.toLocaleString('en-US')}</b><span>events</span></p>
          <p><Dec as="b" className="l2-fig">1</Dec><span>issue</span></p>
          <div className="sn2-hist">{bars.map((h, i) => <i key={i} style={{ transform: `scaleY(${h})` }} className={i === bars.length - 1 ? 'now' : ''} />)}</div>
        </div>
        <div className="sn2-frame">
          <p className="sn2-k l2-mono">Top frame</p>
          <div className="sn2-code">
            {/* the source map resolving IS the decode: the minified frame scrambles into the source line */}
            {resolved
              ? <Dec as="code" key="r"><b>checkout/cart.ts:42</b> · applyDiscount()</Dec>
              : <Dec as="code" key="m" className="min">main.3f9a.js:1:88213 · t.a()</Dec>}
            <span className={'sn2-map l2-mono' + (resolved ? ' on' : '')}>source map</span>
          </div>
        </div>
        <ol className="sn2-crumbs">
          <li className="sn2-k l2-mono">Breadcrumbs</li>
          {CRUMBS.map((c, i) => <li key={c} className={i === 3 ? 'ex' : ''}><i />{c}</li>)}
        </ol>
      </div>
    </div>
  );
}

/* The dark room: the events rain down a canvas and are pulled into one issue, by themselves (4.5 s, a hold, again);
   the card's count is written straight into its text node. */
const N = 900;
const P = Array.from({ length: N }, (_, i) => ({ x: rnd(i), y: rnd(i + 1777), v: 0.05 + rnd(i + 31) * 0.12, d: rnd(i + 99) * 0.42, jx: rnd(i + 5), jy: rnd(i + 8) }));
const ease = (u) => (u <= 0 ? 0 : u >= 1 ? 1 : 1 - Math.pow(1 - u, 3));

function Collapse() {
  const cv = useRef(null);
  const card = useRef(null);
  const copy = useRef(null);
  const num = useRef(null);
  const one = useRef(null);
  const [ref, live, , paused, toggle] = useDemo(0.25);
  const calm = useCalm();
  const [scene, inn] = useEnter(0.2);
  const [done, setDone] = useState(false);
  const doneR = useRef(false);
  useEffect(() => {
    const c = cv.current;
    if (!c) return;
    const g = c.getContext('2d');
    let raf = 0, t0 = performance.now(), last = -1;
    const draw = (now) => {
      const w = c.clientWidth, h = c.clientHeight, dpr = Math.min(2, devicePixelRatio || 1);
      if (c.width !== Math.round(w * dpr) || c.height !== Math.round(h * dpr)) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); }
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, w, h);
      const t = (now - t0) / 1000;
      // it plays by itself: 1 s of rain, 4.5 s of collapse, a hold, then again
      const p = calm ? 1 : Math.min(1, Math.max(0, ((t % 9) - 1) / 4.5));
      const cr = card.current.getBoundingClientRect(), r = c.getBoundingClientRect();
      const cx = cr.left - r.left, cy = cr.top - r.top;
      // the rain never falls through the words: particles still in the air skip the copy's box
      const tr = copy.current.getBoundingClientRect();
      const ax = tr.left - r.left - 24, ay = tr.top - r.top - 24, bx = tr.right - r.left + 24, by = tr.bottom - r.top + 24;
      g.fillStyle = '#d4d4d4';
      for (let n = 0; n < P.length; n++) {
        const q = P[n];
        // once everything has landed, one in twenty keeps falling into the issue: the room stays alive
        const late = p >= 0.98 && n % 20 === 0;
        const k = late ? ease(((t * 0.22 + q.x) % 1) * 1.4) : ease((p - q.d) / 0.5);
        const rx = q.x * w, ry = ((q.y + t * q.v) % 1) * h * 1.1 - h * 0.05;
        const tx = cx + 18 + q.jx * (cr.width - 36), ty = cy + 18 + q.jy * (cr.height - 36);
        const x = rx + (tx - rx) * k, y = ry + (ty - ry) * k;
        if (k < 0.5 && x > ax && x < bx && y > ay && y < by) continue;
        g.globalAlpha = (0.25 + q.v * 4) * (1 - k * 0.85);
        g.fillRect(x, y, 2.5, k > 0.02 ? 2.5 : 9);
      }
      g.globalAlpha = 1;
      const shown = Math.round(Math.min(1, p / 0.95) * 10000);
      if (shown !== last && num.current && !num.current.__busy) { num.current.textContent = shown.toLocaleString('en-US'); last = shown; }
      card.current.style.setProperty('--k', String(Math.min(1, Math.max(0, (p - 0.35) / 0.55))));
      if (p >= 0.98 !== doneR.current) { doneR.current = p >= 0.98; setDone(doneR.current); }
      if (!calm && live) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [live, calm, paused]);
  // the figure decodes as the events land in it
  useEffect(() => { if (done) decode(one.current, 600); }, [done]);
  return (
    <section className={'l2-dark sn2-col' + (inn ? ' in' : '')} data-room="dark" ref={scene}>
      <div className="sn2-col-pin" ref={ref}>
        <PauseBtn paused={paused} onClick={toggle} className="dk sn2-col-pause" />
        <canvas ref={cv} className="sn2-cv" aria-hidden="true" />
        <div className="l2-wrap sn2-col-in">
          <div className="sn2-col-copy" ref={copy}>
            <Dec as="h2" className="l2-head sn2-belt" style={{ '--d': 0 }}>Enough context to fix it without asking</Dec>
            <Dec as="h3" className="l2-title sn2-belt" style={{ '--d': 1 }}>One issue, not ten thousand events</Dec>
            <Dec as="p" className="l2-ch-n sn2-belt" style={{ '--d': 2 }}>01 / 06</Dec>
            <p className="l2-body sn2-belt" style={{ '--d': 3 }}>Identical exceptions collapse into a single issue with a count and a first-seen date. Minified frontend frames are resolved through your source maps, and the breadcrumbs leading up to the throw come with it, so you read what the person did rather than guessing.</p>
          </div>
          <div className={'sn2-card sn2-belt' + (done ? ' done' : '')} style={{ '--d': 2 }} ref={card} aria-hidden="true">
            <span className="sn2-tag l2-mono">TypeError</span>
            <p className="sn2-card-m">Cannot read properties of undefined</p>
            <p className="sn2-card-n"><b ref={num} className="l2-fig">10,000</b><span>events</span><em ref={one} className="l2-mono">1 issue</em></p>
            <p className="sn2-card-f l2-mono">first seen · source map · breadcrumbs</p>
          </div>
        </div>
      </div>
    </section>
  );
}

const DEST = ['Slack', 'PagerDuty', 'Opsgenie', 'Discord', 'Microsoft Teams', 'email', 'webhook'];
const TRACK = ['GitHub', 'GitLab', 'Jira', 'Bitbucket'];
const WHAT = [['New issues', 'A new issue'], ['regressions', 'A regression'], ['spikes', 'A spike']];

/* Beyond: build one alert rule from what Hanzo says Sentinel can route, and read it back as a sentence. */
function Route() {
  const [w, setW] = useState(1);
  const [d, setD] = useState(1);
  const [k, setK] = useState(2);
  // once, when the router comes into view, it builds one rule by itself (a spike → PagerDuty → Jira, then back to a
  // regression → Slack → GitHub) so the sentence visibly rewrites; any press stops it
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.6, once: true });
  const calm = useCalm();
  const [mine, setMine] = useState(false);
  useEffect(() => {
    if (!seen || calm || mine) return;
    const plan = [() => setW(2), () => setD(3), () => setK(0), () => setW(0), () => setD(1), () => setK(2)];
    const ids = plan.map((f, i) => setTimeout(f, 900 + i * 900));
    return () => ids.forEach(clearTimeout);
  }, [seen, calm, mine]);
  const pick = (list, at, set, label) => (
    <div className="sn2-rt-row" role="group" aria-label={label}>
      <p className="l2-mono">{label}</p>
      <div>{list.map((x, i) => <button key={x} type="button" aria-pressed={at === i} onClick={() => set(at === i && label === 'opens a ticket in' ? -1 : i)}>{x}</button>)}</div>
    </div>
  );
  return (
    <div className="sn2-route" ref={box} onPointerDown={() => setMine(true)} onKeyDown={() => setMine(true)}>
      {pick(WHAT.map((x) => x[0]), w, setW, 'when')}
      {pick(DEST, d, setD, 'route to')}
      {pick(TRACK, k, setK, 'opens a ticket in')}
      <p className="sn2-rt-out" aria-live="polite"><b>{WHAT[w][1]}</b> goes to <b>{DEST[d]}</b>{k >= 0 ? <> and opens the ticket in <b>{TRACK[k]}</b></> : null}.</p>
    </div>
  );
}

function Pic({ i }) {
  if (i === 1) return (
    <div className="sn2-trace">
      {[[0, 94, 'request'], [4, 30, 'service a'], [12, 66, 'service b'], [16, 20, 'service c'], [38, 34, 'service d']].map(([l, wd, t], k) => (
        <p key={k} className={k === 2 ? 'slow' : ''}><span className="l2-mono">{t}</span><i style={{ marginLeft: l + '%', width: wd + '%' }} /></p>
      ))}
      <p className="prof"><span className="l2-mono">profile</span><i style={{ marginLeft: '14%', width: '54%' }}><b /><b /><b /></i></p>
    </div>
  );
  if (i === 2) return (
    <div className="sn2-rel">
      <div className="sn2-rel-bars">{[96, 97, 95, 97, 71, 96].map((v, k) => <i key={k} className={v < 90 ? 'bad' : ''} style={{ height: v + '%', '--k': k }}><span className="l2-mono">release {k + 1}</span></i>)}</div>
      <p className="sn2-cron l2-mono"><span>cron</span>{Array.from({ length: 14 }).map((_, k) => <i key={k} className={k === 10 ? 'miss' : ''} style={{ '--k': k }} />)}</p>
    </div>
  );
  if (i === 3) return (
    <ul className="sn2-acc">{['account 1', 'account 2', 'account 3', 'account 4'].map((a, k) => <li key={a} style={{ '--k': k }}><i style={{ background: ['#0a0a0a', '#404040', '#737373', '#a3a3a3'][k] }} />{a}<em className="l2-mono">{k % 2 ? 'staging' : 'production'}</em></li>)}</ul>
  );
  if (i === 4) return <Route />;
  return (
    <div className="sn2-fork">
      <p className="a">Sentry</p>
      <svg viewBox="0 0 200 120" aria-hidden="true"><path d="M20 20 V100" fill="none" stroke="currentColor" strokeWidth="2" /><path className="sn2-fork-line" d="M20 60 C 20 90, 80 90, 160 90" fill="none" stroke="currentColor" strokeWidth="2.5" pathLength="1" /><circle cx="20" cy="20" r="6" /><circle cx="160" cy="90" r="7" className="me" /></svg>
      <p className="b">Sentinel</p>
      <p className="l2-mono sn2-fsl">Functional Source License · attribution kept current</p>
    </div>
  );
}

const FACTS = [
  ['Traces, and profiles under them', "A request that crosses four services is one trace, and the span that took the time is visible in it. Profiles go a level down to the function. Session replay shows the same failure from the browser's side."],
  ['Did this release make it worse', 'Crash-free sessions per release, so a regression shows up in the first hour of a rollout rather than in a support queue on Monday. Cron monitors catch the opposite failure — the job that stopped running and threw nothing at all.'],
  ['Which customers are hitting it', 'Events carry the identity and the environment they came from, so an issue can be read as a list of affected accounts. That turns triage from a guess about severity into a decision about who to call.'],
  ['Where the alert goes', 'New issues, regressions and spikes route to Slack, PagerDuty, Opsgenie, Discord, Microsoft Teams, email, or a webhook of your own. It can also open the ticket — GitHub, GitLab, Jira and Bitbucket are wired both ways.'],
  ['A fork, and it says so', 'Sentinel is a fork of Sentry, used under the Functional Source License with attribution kept current. Sentry is a trademark of Functional Software, Inc., and Sentinel is neither affiliated with nor endorsed by them. Naming what you forked is not the same as branding yourself with it.'],
];

/* Facts 02–06 as plain sheets; facts 02–04 glitch in, 05–06 are uncovered by a page curl. */
function Sheet({ i, t, d, how }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.3 });
  return (
    <article ref={ref} className={'sn2-sheet ' + how + (i % 2 ? ' alt' : '') + (seen ? ' in' : '')} style={{ '--i': i }}>
      <div className="sn2-sheet-copy">
        <Dec as="h3" className="l2-head">{t}</Dec>
        <Dec as="p" className="l2-ch-n">{String(i + 2).padStart(2, '0') + ' / 06'}</Dec>
        <p className="l2-body">{d}</p>
      </div>
      <div className="sn2-pic" aria-hidden={i === 3 ? undefined : true}><Pic i={i + 1} /></div>
    </article>
  );
}

function Sheets({ from, to, how }) {
  return (
    <section className={'sn2-sheets ' + how}>
      <div className="l2-wrap">
        {FACTS.slice(from, to).map(([t, d], k) => <Sheet key={t} i={from + k} t={t} d={d} how={how} />)}
      </div>
    </section>
  );
}

/* The close's object: the payoff, not the card again. The issue's events over time: they climb, the fix ships at the
   release marker, and the bars fall to nothing after it (drawn once when reached). Example data, like the hero's. */
// rounded, so the server's and the browser's Math.sin agree to the last digit (no hydration mismatch)
const AFTER = Array.from({ length: 28 }, (_, i) => (i < 19 ? +(0.25 + rnd(i + 40) * 0.55 + i * 0.015).toFixed(3) : i === 19 ? 0.12 : 0.02));
function Resolved() {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.5 });
  return (
    <div className={'sn2-end' + (seen ? ' in' : '')} ref={ref} aria-hidden="true">
      <div className="sn2-head"><span className="sn2-tag l2-mono">TypeError</span><span className="sn2-unres l2-mono">1 issue</span></div>
      <div className="sn2-end-h">
        {AFTER.map((h, i) => <i key={i} style={{ '--h': h, '--k': i }} />)}
        <span className="sn2-end-mark l2-mono">release 6</span>
      </div>
      <div className="sn2-code"><code><b>checkout/cart.ts:42</b> · applyDiscount()</code><span className="sn2-map l2-mono on">source map</span></div>
    </div>
  );
}

export default function Sentinel() {
  // entrance 5 also rolls the band's own "Get Sentinel" heading and tag (rendered by the shared Finale) as they arrive
  const root = useRef(null);
  useEffect(() => {
    const els = root.current ? [...root.current.querySelectorAll('.l2-band .l2-get-name, .l2-band .l2-get-tag')] : [];
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { io.unobserve(e.target); roll(e.target); } }), { threshold: 0.9 });
    els.forEach((el) => { el.classList.add('sn2-roll'); io.observe(el); });
    return () => io.disconnect();
  }, []);
  return (
    <main id="main" className="l2-page sn2" ref={root}>
      <StageHero look="side" kick="sentry.hanzo.ai" title={<Dec arrive="type">Hanzo Sentinel</Dec>} sub="Error tracking and performance monitoring" acts={[['Read the docs', DOCS], ['View on GitHub', GH]]}>
        <Issue />
      </StageHero>
      <Collapse />
      <Sheets from={0} to={3} how="glitch" />
      <Sheets from={3} to={5} how="curl" />
      <Finale name="Sentinel" head={<Dec arrive="roll">Get started with Hanzo Sentinel</Dec>} ask={['Read the docs', DOCS]} links={[['View on GitHub', GH]]} object={<Resolved />} prompt="Read https://hanzo.ai/skill.md and use Hanzo Sentinel in my project." tag="Error tracking" license="BSL-1.1" />
    </main>
  );
}
