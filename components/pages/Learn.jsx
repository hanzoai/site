'use client';
/* Learn Hanzo. The page is the map of the documentation, so it is drawn as one.
   Signature: the docs as a transit map: a train rides the Start-here line once and stops at each station, whose guide opens beneath it.
   Persona: a developer arriving to learn Hanzo (PLAN-COMPONENTS 1.1 developer row). Goal: a first working request.
   CTA: "Get started" (the quickstart). Metric: api_key_created (via the quickstart).
   V2: 8/10 MASTER scale: "Learn Hanzo" at 52px over a full-width transit map whose train rides the Start-here line once and rests, each station's guide opening beneath it and linked by its own name; what to try and go further as one index; the blog and the thinking together in the dark room; questions.
   Motion: the riding train (signature, time) + station dots answering the pointer + stations you pick (state) +
   line-mask headline from the first paint; rows open into their pages through the site's morph.
   0 UI hues. Every line and link is Hanzo's own. */
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { A, Cta, More, Faq, Img, Film } from '../kit';
import LineReveal, { NoJs } from '../v2/LineReveal';
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
  useEffect(() => {
    if (mine || calm || !seen || at >= START.length - 1) return; // one ride along the line, then it rests on MCP
    const t = setTimeout(() => setAt((v) => v + 1), 2800);
    return () => clearTimeout(t);
  }, [at, mine, calm, seen]);
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
        <motion.span className="xlr-train" aria-hidden="true" initial={false} animate={{ x: (at / (START.length - 1)) * 100 + '%' }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}><i /></motion.span>
        <div className="xlr-stops" role="tablist" aria-label="Start here" onKeyDown={keys}>
          {START.map(([t], i) => (
            <button key={t} type="button" role="tab" id={'xlr-t' + i} aria-controls={'xlr-p' + i} aria-selected={at === i} tabIndex={at === i ? 0 : -1} className={i < at ? 'past' : ''} onClick={() => { setAt(i); setMine(true); }}>
              <i aria-hidden="true" /><span>{t}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="xlr-panels">
        {START.map(([t, d, h], i) => (
          <div key={t} id={'xlr-p' + i} role="tabpanel" aria-labelledby={'xlr-t' + i} hidden={at !== i} className="xlr-panel">
            <motion.div key={at === i ? 'on' : 'off'} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
              <h3 className="xp-head"><A to={h} className="xlr-guide">{t}<i aria-hidden="true">↗</i></A></h3>
              <p className="xp-lede">{d}</p>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="xlr-hero" aria-labelledby="xlr-h1">
      <div className="xp-wrap">
        <div className="xp-grid xlr-hero-top">
          <div className="xlr-hero-h">
            <LineReveal as="h1" id="xlr-h1" className="xp-display" lines={['Learn Hanzo']} />
          </div>
          <motion.div className="xlr-hero-side" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE, delay: 0.3 }}>
            <p className="xp-lede">Start with a working request, then go as deep as you need.</p>
            <div className="xlr-acts">
              <Cta to={DOCS + 'quickstart'} id="learn.hero" thumb className="xp-cta">Get started</Cta>
              <Cta to="https://hanzo.university" kind="link" id="learn.university" className="xlr-link">Hanzo University</Cta>
            </div>
          </motion.div>
        </div>
        <motion.div className="xp-grid xlr-hero-map" initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE, delay: 0.2 }}>
          <Metro />
        </motion.div>
      </div>
    </section>
  );
}

/* What to try: one rail of six numbered cards. Proximity snap with a 16% peek; a mouse can throw it (drag with inertia),
   touch scrolls it natively, the arrows and the counter step it. Each card's title is carried across by the site's morph. */
function Rail() {
  const ref = useRef(null);
  const [at, setAt] = useState(0);
  const [prog, setProg] = useState(0);
  const calm = useReducedMotion();
  const drag = useRef(null);
  const step = () => { const el = ref.current; const c = el?.children[0]; return c ? c.getBoundingClientRect().width + parseFloat(getComputedStyle(el).columnGap || 0) : 0; };
  const onScroll = () => {
    const el = ref.current; if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProg(max > 0 ? el.scrollLeft / max : 0);
    const s = step(); if (s) setAt(Math.min(TRY.length - 1, Math.round(el.scrollLeft / s)));
  };
  const go = (d) => { const el = ref.current; if (el) el.scrollBy({ left: d * step(), behavior: calm ? 'auto' : 'smooth' }); };
  const down = (e) => {
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
    <div className="xlr-rail-scene">
      <div className="xlr-rail-top">
        <h2 id="xlr-try-h" className="xp-head">Pick what to try</h2>
        <div className="xlr-rail-ctl">
          <span className="xp-count" aria-hidden="true">{String(at + 1).padStart(2, '0')} / {String(TRY.length).padStart(2, '0')}</span>
          <button type="button" className="xlr-step" aria-label="Previous" disabled={prog < 0.01} onClick={() => go(-1)}><i aria-hidden="true">←</i></button>
          <button type="button" className="xlr-step" aria-label="Next" disabled={prog > 0.99} onClick={() => go(1)}><i aria-hidden="true">→</i></button>
        </div>
      </div>
      <ul className="xlr-try" ref={ref} onScroll={onScroll} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onClickCapture={click} aria-labelledby="xlr-try-h">
        {TRY.map(([t, d, h], i) => (
          <li key={t + h}>
            <A to={h} className="xlr-card" draggable={false}>
              <span className="xlr-card-n xp-fig" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
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

/* The index: the rail, then where to go further beside Hanzo University's own film (Zen). */
function Index() {
  return (
    <section className="xp-sec xlr-index" aria-label="Pick what to try, Go further">
      <div className="xp-wrap">
        <Rail />
        <div className="xp-grid xlr-further">
          <A to="https://hanzo.university" className="xlr-uni-a">
            <span className="xlr-uni-m"><Film src="/models/zen.webm" poster="/models/zen.webp" w={1200} h={1500} /></span>
            <span className="xlr-uni-c"><b id="xlr-uni-h">Hanzo University</b><span>Courses and certifications live on Hanzo University.</span></span>
            <i aria-hidden="true">↗</i>
          </A>
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
        <h2 id="xlr-blog-h" className="xp-head">From the blog</h2>
        <ol className="xp-grid xlr-posts">
          <li className="lead">
            <A to={lead[3]} className="xlr-post">
              <time className="x-mono" dateTime={lead[1]}>{lead[1]}</time>
              <b>{lead[0]}</b>
              <span>{lead[2]}</span>
            </A>
          </li>
          {rest.map(([t, date, d, h]) => (
            <li key={h}>
              <A to={h} className="xlr-post">
                {/introducing-kai/.test(h) && <span className="xlr-post-m"><Img src="/models/kai.webp" w={1200} h={1500} alt="" /></span>}
                <time className="x-mono" dateTime={date}>{date}</time>
                <b>{t}</b>
                <span>{d}</span>
              </A>
            </li>
          ))}
        </ol>
        <div className="xp-grid xlr-thk">
          <h2 id="xlr-think-h" className="xp-head">Read the thinking</h2>
          <div className="xlr-think-grid">
            {THINK.map(([t, d, h]) => (
              <A key={t} to={h} className="xlr-think-a"><b>{t}</b><span>{d}</span><i aria-hidden="true">→</i></A>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* One solid per screen: while the hero's "Get started" is on screen the header's ask is outlined (Learn.css). */
function useHeroAsk(ref) {
  useEffect(() => {
    const main = ref.current; const ask = main?.querySelector('[data-cta="learn.hero"]');
    if (!ask) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) main.setAttribute('data-ask-on', ''); else main.removeAttribute('data-ask-on'); });
    io.observe(ask);
    return () => io.disconnect();
  }, [ref]);
}

export default function Learn() {
  const ref = useRef(null);
  useHeroAsk(ref);
  return (
    <main className="xp xlr" data-ask-on="" ref={ref}>
      <NoJs />
      <Hero />
      <Index />
      <Read />
      <section className="xp-sec tight xlr-qa" aria-labelledby="xlr-qa-h">
        <div className="xp-wrap xp-grid">
          <div className="xlr-sticky"><h2 id="xlr-qa-h" className="xp-head">Questions</h2></div>
          <div className="xlr-qa-l"><Faq items={QA} multi first={-1} /></div>
        </div>
      </section>
    </main>
  );
}
