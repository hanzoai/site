'use client';
/* Learn Hanzo. The page is the map of the documentation, so it is drawn as one.
// Signature: word-light — Hanzo's own answer to "What is Hanzo and how does it work?" lights word by word as it is read (scroll reads it; hover, tap or arrow keys move the reading point), right under the transit map.
// Entrances: tile-flip, fold-out, opposite-drift, spiral-in, depth-parallax
   The transit map stays: a train rides the Start-here line once and stops at each station, whose guide opens beneath it.
   Persona: a developer arriving to learn Hanzo (PLAN-COMPONENTS 1.1 developer row). Goal: a first working request.
   CTA: "Get started" (the quickstart; data-cta learn.hero, data-thumb). Metric: api_key_created (via the quickstart).
   Beyond: the documentation drawn as a line you ride: each station opens its own guide in place, linked by its own name.
   V2: 9/10 motion-map pass (7 Nov): the second screen is a word-light statement (Hanzo's own first answer, lit as it is read);
   the five sections enter five ways in order: hero by a tile grid flipping away (CSS, from first paint), the index folding
   out like paper from a top hinge, the dark room's halves drifting in from opposite sides, the questions spiralling in
   from the edges, the close arriving in three depth layers at three speeds. Line-mask headlines and the map fade-up removed.
   Motion kept: the riding train leaving within 1 s, then breathing at rest under 5 s (idle) + the rail thrown with inertia,
   its numerals inking once, the question number (pointer) + stations that wipe their guide in the train's direction and
   answers that open (state). Fade-ups: the kit Faq. 0 UI hues. Every line and link is Hanzo's own. */
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { A, Cta, More, Faq, Film, Img } from '../kit';
import { NoJs } from '../v2/LineReveal';
import '../v2/ProgramScale.css';
import './Learn.css';

const EASE = [0.16, 1, 0.3, 1];
const DOCS = 'https://docs.hanzo.ai/docs/';
const START = [
  ['Getting started', 'Install, authenticate, and make your first call. The shortest path from nothing to a working request.', DOCS + 'quickstart'],
  ['CLI', 'Drive the platform from your terminal — projects, deploys, keys and logs.', DOCS + 'cli'],
  ['API reference', 'Every endpoint, parameter and response shape.', DOCS + 'openapi'],
  ['Agents', 'Define an agent once and run it from chat, the API, or your own application.', DOCS + 'openapi/agents/'],
  ['MCP', 'Connect tools and data to models over the Model Context Protocol.', DOCS + 'mcp'],
];
const TRY = [
  ['Chat', 'One thread with every model, your MCP tools, your files and a code sandbox.', '/chat'],
  ['Playground', 'Every model in every mode, with each run’s tokens and cost beside the answer.', '/playground'],
  ['Hanzo Dev', 'A coding agent that opens the files, makes the change, runs the tests and shows you the diff.', '/dev'],
  ['Zen models', 'Open-weight frontier models you can self-host anywhere, served on the Hanzo API.', '/zen'],
  ['MCP', 'Thirteen tools — shell, files, code, git, HTTP — behind one server.', '/mcp'],
  ['Agents', 'A Python SDK where an agent is a model, instructions and tools, and several can sit behind one router.', '/agents/sdk'],
];
/* Each card's still: Hanzo's own model art from public/models, matched to the product as the live pages do
   (Chat answers with Enso; Playground's window shows Iro; Hanzo Dev with Mori; Zen is Zen; MCP with Oto; Agents with
   Koma, as on /agents). Stills only: the page's two films (Zen, Kai) are the only things that play. */
const TRY_ART = ['/models/enso.webp', '/models/iro.webp', '/models/mori.webp', '/models/zen.webp', '/models/oto.webp', '/models/koma.webp'];
const FURTHER = [
  ['Starters', 'A starter for each Hanzo product. Browse, fork, deploy.', '/gallery'],
  ['UI', 'Open-source, accessible React components built on @hanzo/gui primitives.', '/ui'],
  ['GUI', 'The cross-platform UI kit and design system behind every Hanzo app.', '/gui'],
];
const BLOG = [
  ['Optimizing for Headless Commerce in the Era of Agentic LLMs', '2026-10-26', 'Buyers are becoming agents. What it takes to be readable, signable and payable by an LLM with no human in the loop, and what Hanzo ships for it today.', 'https://hanzo.blog/headless-commerce-agentic-llms/'],
  ['Your AI is Planning To Kill You', '2026-10-25', 'Why frontier models fail when real lives are on the line, and how Hanzo Kai 1.9 enforces deterministic safety.', 'https://hanzo.blog/2026-10-16-your-ai-is-planning-to-kill-you/'],
  ['Kai 1: Decisions, Not Completions', '2026-10-07', "Kai is Hanzo's decision model, served by the Hanzo API. Give it explicit state and a listed question, and it returns a typed, calibrated answer — a choice, a score, a yes/no, or a reasoned deferral.", 'https://hanzo.blog/2026-10-07-introducing-kai/'],
];
const THINK = [
  ['Technical Blog', 'Product launches, architecture deep dives, and research essays.', '/blog'],
  ['Research papers', 'The reasoning behind the architecture, published in full.', '/research'],
  ['Source', 'The platform is open source — read it, run it, change it.', 'https://github.com/hanzoai'],
];
const QA = [
  ['What is Hanzo and how does it work?', <>Hanzo is an AI cloud on one account. Chat with frontier models, build and ship with Hanzo Dev, and call the same models from one API: Enso, our frontier model, and Kai, which makes a decision in one call. <More to="/platform">How the platform fits together</More></>],
  ['Can I keep using Claude Code?', <>Yes. Install the Hanzo CLI and sign in, then run Claude Code with its model calls going through api.hanzo.ai, or point your own Claude Code install at Hanzo. <More to={DOCS + 'guides/coding/claude-code'}>The commands, ready to copy</More></>],
  ['Where do the numbers on hanzo.ai come from?', <>Each one is read when the page opens: the race and the boards from Hanzo&apos;s research runs, the prices from our price list, and the plans from our plan list. A figure whose source does not answer is left out, never replaced with an older one. <More to="/benchmarks">Every board and its runs</More></>],
  ['How much does it cost to use?', <>Free needs no card. Paid plans are sold by the month for one person and by the member for a team, and every paid plan can be cancelled any time. Enterprise is priced with our team. <More to="/pricing">See every plan and model rate</More></>],
  ['Can Hanzo run in our own cloud or on our own GPUs?', <>Yes, with Enterprise: in your cloud, on your own servers or fully offline, with dedicated compute and your own models. <More to="/enterprise">Hanzo Enterprise</More></>],
];

function Metro() {
  const [at, setAt] = useState(0);
  const [mine, setMine] = useState(false);
  const calm = useReducedMotion();
  const ref = useRef(null);
  const seen = useInView(ref, { amount: 0.4 });
  const prev = useRef(0);
  const dir = at >= prev.current ? 1 : -1;
  useEffect(() => { prev.current = at; }, [at]);
  useEffect(() => {
    if (mine || calm || !seen || at >= START.length - 1) return; // one ride along the line, then it rests on MCP
    const t = setTimeout(() => setAt((v) => v + 1), at === 0 ? 900 : 2800); // leaves the first station within a second
    return () => clearTimeout(t);
  }, [at, mine, calm, seen]);
  const rest = !mine && !calm && at === START.length - 1; // the train breathes at MCP for under 5 s, then holds still
  const keys = (e) => {
    const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (!d) return;
    e.preventDefault(); setMine(true);
    const n = (at + d + START.length) % START.length; setAt(n);
    document.getElementById('xlr-t' + n)?.focus();
  };
  return (
    <div className="xlr-map xp-obj" ref={ref}>
      <div className="xlr-map-top"><span className="xlr-map-k">Learn</span><span className="xlr-line-tag">Start here</span><span className="xlr-map-n x-mono">{String(at + 1).padStart(2, '0')} / {String(START.length).padStart(2, '0')}</span></div>
      <div className="xlr-track">
        <i className="xlr-rail" aria-hidden="true"><motion.b initial={false} animate={{ scaleX: at / (START.length - 1) }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} /></i>
        <motion.span className={'xlr-train' + (rest ? ' rest' : '')} aria-hidden="true" initial={false} animate={{ x: (at / (START.length - 1)) * 100 + '%' }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}><i /></motion.span>
        <div className="xlr-stops" role="tablist" aria-label="Start here" onKeyDown={keys}>
          {START.map(([t], i) => (
            <button key={t} type="button" role="tab" id={'xlr-t' + i} aria-label={t} aria-controls={'xlr-p' + i} aria-selected={at === i} tabIndex={at === i ? 0 : -1} className={i < at ? 'past' : ''} onClick={() => { setAt(i); setMine(true); }}>
              <i aria-hidden="true" /><span>{t}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="xlr-panels">
        {START.map(([t, d, h], i) => (
          <div key={t} id={'xlr-p' + i} role="tabpanel" aria-labelledby={'xlr-t' + i} hidden={at !== i} className="xlr-panel">
            <motion.div key={at === i ? 'on' : 'off'} initial={calm ? false : { clipPath: dir > 0 ? 'inset(0% 100% 0% 0%)' : 'inset(0% 0% 0% 100%)' }} animate={{ clipPath: 'inset(0% 0% 0% 0%)', transitionEnd: { clipPath: 'none' } }} transition={{ duration: 0.3, ease: EASE }}>
              <h3 className="xp-head"><A to={h} className="xlr-guide">{t}<i aria-hidden="true">↗</i></A></h3>
              <p className="xp-lede">{d}</p>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Entrance 1, tile-flip: a 8×5 grid of paper tiles (5×8 on a phone) covers the hero and flips away corner to corner,
   each on its own vertical axis, so the title, the ask and the map are formed tile by tile. Pure CSS from first paint
   (the hero is on screen at arrival); the tiles end edge-on and invisible, take no pointer, and are absent under reduced
   motion and with JavaScript off. */
const TILES = Array.from({ length: 40 }, (_, i) => ({ '--a': (i % 8) + Math.floor(i / 8), '--b': (i % 5) + Math.floor(i / 5) }));

function Hero() {
  return (
    <section className="xlr-hero" aria-labelledby="xlr-h1">
      <div className="xp-wrap xlr-hero-wrap">
        <div className="xp-grid xlr-hero-top">
          <div className="xlr-hero-h">
            <h1 id="xlr-h1" className="xp-display">Learn Hanzo</h1>
          </div>
          <div className="xlr-hero-side">
            <p className="xp-lede">Start with a working request, then go as deep as you need.</p>
            <div className="xlr-acts">
              <Cta to={DOCS + 'quickstart'} id="learn.hero" thumb className="xp-cta">Get started</Cta>
              <Cta to="https://hanzo.university" kind="link" id="learn.university" className="xlr-link">Hanzo University</Cta>
            </div>
          </div>
        </div>
        <div className="xp-grid xlr-hero-map">
          <Metro />
        </div>
        <span className="xlr-tiles" aria-hidden="true">{TILES.map((st, i) => <i key={i} style={st} />)}</span>
      </div>
    </section>
  );
}

/* The signature, word-light: Hanzo's own first answer (the FAQ's "What is Hanzo and how does it work?", word for word)
   set at display size and lit word by word as it is read. Scroll is the reader: the lit edge follows the statement up
   the screen. A mouse over a word moves the reading point there while it hovers; a tap or click pins it there (scrolling
   on resumes the reading); with the statement focused, ← → step a word, Home and End go to either end, Esc lets scroll
   read again. Server HTML, JavaScript off and reduced motion show it fully lit. */
const SAY = 'Hanzo is an AI cloud on one account. Chat with frontier models, build and ship with Hanzo Dev, and call the same models from one API: Enso, our frontier model, and Kai, which makes a decision in one call.';
const WORDS = SAY.split(' ');

function Say() {
  const N = WORDS.length;
  const ref = useRef(null);
  const calm = useReducedMotion();
  const [read, setRead] = useState(N);
  const [hover, setHover] = useState(null);
  const [own, setOwn] = useState(null);
  const pin = useRef(null);
  useEffect(() => {
    if (calm) { setRead(N); return undefined; }
    let raf = 0;
    const measure = () => {
      raf = 0;
      const el = ref.current; if (!el) return;
      const r = el.getBoundingClientRect(); const vh = window.innerHeight;
      const p = (vh * 0.85 - r.top) / (vh * 0.4 + r.height);
      setRead(Math.max(0, Math.min(N, Math.round(p * N))));
      if (pin.current != null && Math.abs(window.scrollY - pin.current) > 120) { pin.current = null; setOwn(null); }
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(measure); };
    measure();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); if (raf) cancelAnimationFrame(raf); };
  }, [calm, N]);
  const n = hover ?? own ?? read;
  const set = (v) => { pin.current = window.scrollY; setOwn(Math.max(0, Math.min(N, v))); };
  const keys = (e) => {
    const cur = own ?? read;
    if (e.key === 'ArrowRight') set(cur + 1);
    else if (e.key === 'ArrowLeft') set(cur - 1);
    else if (e.key === 'Home') set(0);
    else if (e.key === 'End') set(N);
    else if (e.key === 'Escape') { pin.current = null; setOwn(null); return; }
    else return;
    e.preventDefault();
  };
  return (
    <section className="xp-sec xlr-say" aria-labelledby="xlr-say-k">
      <div className="xp-wrap xp-grid">
        <p className="xlr-say-t" ref={ref} tabIndex={0} onKeyDown={keys} onPointerLeave={() => setHover(null)}>
          {WORDS.map((w, i) => (
            <span key={i}>
              <span className={i < n ? 'on' : undefined} onPointerEnter={(e) => { if (e.pointerType === 'mouse') setHover(i + 1); }} onClick={() => set(i + 1)}>{w}</span>{i < N - 1 ? ' ' : ''}
            </span>
          ))}
        </p>
        {/* the question it answers sits under the statement as its caption, never as a label above it */}
        <div className="xlr-say-top">
          <span id="xlr-say-k" className="xlr-say-k">{QA[0][0]}</span>
          <span className="xlr-say-n x-mono" aria-hidden="true">{String(n).padStart(2, '0')} / {N}</span>
        </div>
        <div className="xlr-say-more"><More to="/platform">How the platform fits together</More></div>
      </div>
    </section>
  );
}

/* Entrances 2–5 are set by data-e on each part and played once, part by part, as each enters the screen (one observer for
   the page). Before it plays a part waits in its start pose only when JavaScript runs and motion is allowed (Learn.css);
   every animation fills backwards only, so it ends at the true layout and leaves hover and press transforms free. */
function useEnter(root) {
  useEffect(() => {
    const el = root.current; if (!el) return undefined;
    const parts = [...el.querySelectorAll('[data-e]')];
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) { parts.forEach((p) => p.setAttribute('data-in', '')); return undefined; }
    const io = new IntersectionObserver((list) => list.forEach((x) => {
      if (!x.isIntersecting) return;
      x.target.setAttribute('data-in', ''); io.unobserve(x.target);
    }), { rootMargin: '0px 0px -10% 0px' });
    parts.forEach((p) => io.observe(p));
    return () => io.disconnect();
  }, [root]);
}

/* What to try: one rail of six numbered cards. Proximity snap with a 16% peek; a mouse can throw it (drag with inertia),
   touch scrolls it natively, the arrows and the counter step it. Each card's title is carried across by the site's morph. */
function Rail() {
  const ref = useRef(null);
  const [at, setAt] = useState(0);
  const [prog, setProg] = useState(0);
  const calm = useReducedMotion();
  const drag = useRef(null);
  /* idle: when the rail is first in view, its numerals ink one after another across the cards on screen, like the train
     riding its stops (about 0.7 s each, under 5 s), then rest; any touch of the rail ends it. */
  const seen = useInView(ref, { amount: 0.6, once: true });
  const [lit, setLit] = useState(-1);
  const touched = useRef(false);
  const stop = () => { touched.current = true; setLit(-1); };
  useEffect(() => {
    const el = ref.current;
    if (!seen || calm || touched.current || !el) return;
    const edge = el.getBoundingClientRect().right + 1;
    const n = Math.min(TRY.length, [...el.children].filter((c) => c.getBoundingClientRect().right <= edge).length);
    let i = 0, t;
    const tick = () => { if (touched.current || i >= n) { setLit(-1); return; } setLit(i++); t = setTimeout(tick, 700); };
    t = setTimeout(tick, 250);
    return () => clearTimeout(t);
  }, [seen, calm]);
  const step = () => { const el = ref.current; const c = el?.children[0]; return c ? c.getBoundingClientRect().width + parseFloat(getComputedStyle(el).columnGap || 0) : 0; };
  const onScroll = () => {
    const el = ref.current; if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProg(max > 0 ? el.scrollLeft / max : 0);
    const s = step(); if (s) setAt(Math.min(TRY.length - 1, Math.round(el.scrollLeft / s)));
  };
  const go = (d) => { stop(); const el = ref.current; if (el) el.scrollBy({ left: d * step(), behavior: calm ? 'auto' : 'smooth' }); };
  const down = (e) => {
    if (lit >= 0) stop();
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    drag.current = { x: e.clientX, left: ref.current.scrollLeft, last: e.clientX, t: performance.now(), v: 0, moved: false };
  };
  const move = (e) => {
    const d = drag.current; if (!d) return;
    const el = ref.current; const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) > 6) { d.moved = true; el.classList.add('held'); el.setPointerCapture?.(e.pointerId); }
    if (!d.moved) return;
    const now = performance.now();
    d.v = (d.last - e.clientX) / Math.max(1, now - d.t); d.last = e.clientX; d.t = now;
    el.scrollLeft = d.left - dx;
  };
  const up = () => {
    const d = drag.current; drag.current = null;
    const el = ref.current; if (!d || !d.moved || !el) return;
    let v = d.v * 16; // px per frame
    el.dataset.thrown = '1';
    const glide = () => {
      if (calm || Math.abs(v) < 0.5) { el.classList.remove('held'); setTimeout(() => { delete el.dataset.thrown; }, 60); return; }
      el.scrollLeft += v; v *= 0.92; requestAnimationFrame(glide);
    };
    requestAnimationFrame(glide);
  };
  const click = (e) => { if (ref.current?.dataset.thrown) { e.preventDefault(); e.stopPropagation(); } };
  return (
    <div className="xlr-rail-scene" data-e="fold">
      <div className="xlr-rail-top">
        <h2 id="xlr-try-h" className="xp-head">Pick what to try</h2>
        <div className="xlr-rail-ctl">
          <span className="xp-count" aria-hidden="true">{String(at + 1).padStart(2, '0')} / {String(TRY.length).padStart(2, '0')}</span>
          <button type="button" className="xlr-step" aria-label="Previous" disabled={prog < 0.01} onClick={() => go(-1)}><i aria-hidden="true">←</i></button>
          <button type="button" className="xlr-step" aria-label="Next" disabled={prog > 0.99} onClick={() => go(1)}><i aria-hidden="true">→</i></button>
        </div>
      </div>
      <ul className="xlr-try" ref={ref} onScroll={onScroll} onWheel={(e) => { if (lit >= 0 && Math.abs(e.deltaX) > Math.abs(e.deltaY)) stop(); }} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onClickCapture={click} aria-labelledby="xlr-try-h">
        {TRY.map(([t, d, h], i) => (
          <li key={t + h}>
            <A to={h} className={'xlr-card' + (lit === i ? ' lit' : '')} draggable={false}>
              <span className="xlr-card-m" aria-hidden="true">
                <Img src={TRY_ART[i]} w={1200} h={1500} alt="" />
                <span className="xlr-card-n xp-fig">{String(i + 1).padStart(2, '0')}</span>
              </span>
              <b className="xlr-card-t" data-morph>{t}</b>
              <span className="xlr-card-d">{d}</span>
              <i aria-hidden="true">→</i>
            </A>
          </li>
        ))}
      </ul>
      <i className="xlr-rail-bar" aria-hidden="true"><b style={{ transform: `scaleX(${Math.max(0.08, prog)})` }} /></i>
    </div>
  );
}

function Rows({ items }) {
  return (
    <ul className="xlr-rows">
      {items.map(([t, d, h]) => (
        <li key={t + h}>
          <A to={h} className="xlr-row">
            <b className="xlr-row-t" data-morph>{t}</b>
            <span className="xlr-row-d">{d}</span>
            <i aria-hidden="true">→</i>
          </A>
        </li>
      ))}
    </ul>
  );
}

/* A Hanzo film in a card: the kit Film (plays only in view, poster under reduced motion and Save-Data) with a pause
   first in the card, since the loops run 6 and 8 s. The card's link is a sibling whose ::after covers the card, so the
   pause button is never nested inside a link. Films are 640–720px re-encodes of public/models (30 and 130 KB). */
function Loop({ src, poster, className }) {
  const box = useRef(null);
  const [held, setHeld] = useState(false);
  const calm = useReducedMotion();
  const once = useRef(true);
  useEffect(() => {
    const v = box.current?.querySelector('video'); if (!v) return;
    const stay = () => { if (held) v.pause(); };
    if (held) v.pause(); else if (!once.current && !calm) v.play?.().catch(() => {});
    once.current = false;
    v.addEventListener('play', stay);
    return () => v.removeEventListener('play', stay);
  }, [held, calm]);
  return (
    <span className={className} ref={box}>
      <button type="button" className="xlr-pause" aria-label="Pause" aria-pressed={held} onClick={() => setHeld((x) => !x)}>
        {held ? <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M5 3.5v9l7-4.5z" fill="currentColor" /></svg> : <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M5 3.5v9M11 3.5v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>}
      </button>
      <Film src={src} poster={poster} w={1200} h={1500} />
    </span>
  );
}

/* Hanzo University's card: Uta's film (Zen's art sits on the Zen card above), the name as the link. */
function Uni() {
  return (
    <div className="xlr-uni-a">
      <Loop className="xlr-uni-m" src="/learn/uta-720.webm" poster="/models/uta.webp" />
      <span className="xlr-uni-c"><A to="https://hanzo.university" className="xlr-uni-l"><b id="xlr-uni-h">Hanzo University</b></A><span>Courses and certifications live on Hanzo University.</span></span>
      <i aria-hidden="true">↗</i>
    </div>
  );
}

/* The index: the rail, then where to go further beside Hanzo University's own film (Zen). */
function Index() {
  return (
    <section className="xp-sec xlr-index" aria-label="Pick what to try, Go further">
      <div className="xp-wrap">
        <Rail />
        <div className="xp-grid xlr-further" data-e="fold">
          <Uni />
          <div className="xlr-col further">
            <h2 id="xlr-further-h" className="xp-head">Go further</h2>
            <Rows items={FURTHER} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* The dark room, one row: the newest post leads at the room's big size, the next two follow (Kai's still on Kai's own
   post); the thinking runs along the foot of the same room. */
function Read() {
  const [lead, ...rest] = BLOG;
  return (
    <section className="xp-sec xp-dark xlr-think" data-room="dark" aria-labelledby="xlr-blog-h">
      <div className="xp-wrap">
        <h2 id="xlr-blog-h" className="xp-head" data-e="drift-l">From the blog</h2>
        <ol className="xp-grid xlr-posts">
          <li className="lead" data-e="drift-split">
            <A to={lead[3]} className="xlr-post">
              <time className="x-mono" dateTime={lead[1]}>{lead[1]}</time>
              <b>{lead[0]}</b>
              <span>{lead[2]}</span>
            </A>
          </li>
          {rest.map(([t, date, d, h], k) => (/introducing-kai/.test(h) ? (
            <li key={h} data-e={k % 2 ? 'drift-r' : 'drift-l'}>
              <div className="xlr-post has-film">
                <Loop className="xlr-post-m" src="/learn/kai-640.webm" poster="/models/kai.webp" />
                <time className="x-mono" dateTime={date}>{date}</time>
                <A to={h} className="xlr-post-l"><b>{t}</b></A>
                <span>{d}</span>
              </div>
            </li>
          ) : (
            <li key={h} data-e={k % 2 ? 'drift-r' : 'drift-l'}>
              <A to={h} className="xlr-post">
                <time className="x-mono" dateTime={date}>{date}</time>
                <b>{t}</b>
                <span>{d}</span>
              </A>
            </li>
          )))}
        </ol>
        <div className="xp-grid xlr-thk" data-e="drift-split">
          <h2 id="xlr-think-h" className="xp-head">Read the thinking</h2>
          <ul className="xlr-think-grid">
            {THINK.map(([t, d, h]) => (
              <li key={t}><A to={h} className="xlr-think-a"><b>{t}</b><span>{d}</span><i aria-hidden="true">→</i></A></li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* One solid per screen: while the hero's or the closing "Get started" is on screen the header's ask is outlined
   (Learn.css). */
function useHeroAsk(ref) {
  useEffect(() => {
    const main = ref.current; const asks = main ? [...main.querySelectorAll('[data-cta="learn.hero"], [data-cta="learn.close"]')] : [];
    if (!asks.length) return;
    const on = new Set();
    const io = new IntersectionObserver((list) => {
      list.forEach((e) => { if (e.isIntersecting) on.add(e.target); else on.delete(e.target); });
      if (on.size) main.setAttribute('data-ask-on', ''); else main.removeAttribute('data-ask-on');
    });
    asks.forEach((a) => io.observe(a));
    return () => io.disconnect();
  }, [ref]);
}

/* The close: the page ends on its own ask, in its own words (the hero's lede and "Get started"), on paper. */
function Close() {
  return (
    <section className="xp-sec xlr-close" aria-labelledby="xlr-close-h">
      <div className="xp-wrap xp-grid" data-e="depth">
        <h2 id="xlr-close-h" className="xp-display sm xlr-close-h"><span className="xlr-d1">Start with a working request, </span><span className="xlr-d2">then go as deep as you need.</span></h2>
        <div className="xlr-close-act">
          <Cta to={DOCS + 'quickstart'} id="learn.close" className="xp-cta">Get started</Cta>
          <Cta to="https://hanzo.university" kind="link" id="learn.close-university" className="xlr-link">Hanzo University</Cta>
        </div>
      </div>
    </section>
  );
}

/* Questions: the section's one big thing is the number of the question under the pointer or focus, at figure size,
   cut in by line mask as it changes; the answers are the kit's multi-open accordion (#q-slug opens one). */
function Questions() {
  const [n, setN] = useState(1);
  const pick = (e) => {
    const li = e.target.closest?.('.x-faq > li'); if (!li) return;
    const i = Array.prototype.indexOf.call(li.parentNode.children, li) + 1;
    if (i > 0) setN(i);
  };
  /* the address follows the answers: opening one writes its #q-slug, closing the one in the address clears it */
  const hash = (e) => {
    const b = e.target.closest?.('.x-faq > li > button'); const li = b?.parentNode; if (!li?.id) return;
    requestAnimationFrame(() => {
      const url = location.pathname + location.search;
      if (b.getAttribute('aria-expanded') === 'true') history.replaceState(history.state, '', url + '#' + li.id);
      else if (location.hash === '#' + li.id) history.replaceState(history.state, '', url);
    });
  };
  return (
    <section className="xp-sec tight xlr-qa" aria-labelledby="xlr-qa-h">
      <div className="xp-wrap xp-grid" data-e="spiral">
        <div className="xlr-sticky">
          <h2 id="xlr-qa-h" className="xp-head">Questions</h2>
          <span className="xlr-qa-fig" aria-hidden="true">
            <span className="xlr-qa-mask"><motion.b key={n} className="xp-fig" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 0.4, ease: EASE }}>{String(n).padStart(2, '0')}</motion.b></span>
            <span className="xp-count">/ {String(QA.length).padStart(2, '0')}</span>
          </span>
        </div>
        <div className="xlr-qa-l" onPointerOver={pick} onFocus={pick} onClick={hash}><Faq items={QA} multi first={-1} /></div>
      </div>
    </section>
  );
}

export default function Learn() {
  const ref = useRef(null);
  useHeroAsk(ref);
  useEnter(ref);
  return (
    <main className="xp xlr" data-ask-on="" ref={ref}>
      <NoJs />
      <Hero />
      <Say />
      <Index />
      <Read />
      <Questions />
      <Close />
    </main>
  );
}
