'use client';
// Signature: the docs as a transit map: a train rides the Start-here line by itself and stops at each station, whose guide opens beneath it.
// Beyond: your route: pick what you came to do and the stations for it line up in order, each one a link.
/* Learn Hanzo. The page is the map of the documentation, so it is drawn as one.
   Persona: a developer arriving to learn Hanzo (PLAN-COMPONENTS 1.1 developer row). Goal: a first working request.
   CTA: "Get started" (the quickstart). Metric: api_key_created (via the quickstart).
   V2: 8/10 grey deck, no eyebrows; rebuilt: "Learn Hanzo" at full display size over a full-width transit map whose train rides the Start-here line by itself, each station's guide opening beneath it and linked by its own name; the things to try and go further as a tile grid whose cards open into their pages; the blog as an editorial index; the thinking as the dark room; questions.
   Motion: the riding train (signature, idle/time) + tiles lifting and the station dots answering the pointer + stations
   you pick (state) + line-mask headline from the first paint; cards open into their pages through the site's morph.
   0 UI hues. Every line and link is Hanzo's own. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { A, More, Faq } from '../kit';
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
    if (mine || calm || !seen) return;
    const t = setTimeout(() => setAt((v) => (v + 1) % START.length), 3600);
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
        <i className="xlr-rail" aria-hidden="true"><motion.b initial={false} animate={{ scaleX: at / (START.length - 1) }} transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }} /></i>
        <motion.span className="xlr-train" aria-hidden="true" initial={false} animate={{ x: (at / (START.length - 1)) * 100 + '%' }} transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}><i /></motion.span>
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
          <motion.div className="xlr-hero-side" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}>
            <p className="xp-lede">Start with a working request, then go as deep as you need.</p>
            <div className="xlr-acts">
              <A to={DOCS + 'quickstart'} className="x-btn solid xp-cta" data-thumb="Get started" data-cta="learn.hero">Get started<i aria-hidden="true">→</i></A>
              <A to="https://hanzo.university" className="xlr-link">Hanzo University</A>
            </div>
          </motion.div>
        </div>
        <motion.div className="xp-grid xlr-hero-map" initial={{ opacity: 0, y: 48 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: EASE, delay: 0.3 }}>
          <Metro />
        </motion.div>
      </div>
    </section>
  );
}

/* A branch line as a tile grid: every card opens into its page (the site's morph carries the title across). */
function Tiles({ tag, title, items, kind }) {
  return (
    <section className={'xp-sec tight xlr-tiles xlr-' + kind} aria-labelledby={'xlr-' + kind + '-h'}>
      <div className="xp-wrap">
        <div className="xlr-sec-head"><h2 id={'xlr-' + kind + '-h'} className="xp-head">{title}</h2></div>
        <ul className={'xlr-grid n' + items.length}>
          {items.map(([t, d, h], i) => (
            <li key={t + h} className={'t' + i}>
              <A to={h} className="xlr-tile">
                {h === '/zen' && <img className="xlr-tile-img" src="/models/zen.webp" alt="" width="600" height="750" loading="lazy" />}
                <span className="xlr-tile-n x-mono">{String(i + 1).padStart(2, '0')}</span>
                <b className="xlr-tile-t" data-morph>{t}</b>
                <span className="xlr-tile-d">{d}</span>
                <i className="xlr-tile-go" aria-hidden="true">→</i>
              </A>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Uni() {
  return (
    <section className="xlr-uni" aria-labelledby="xlr-uni-h">
      <div className="xp-wrap">
        <A to="https://hanzo.university" className="xlr-uni-a">
          <img src="/models/zen.webp" alt="" width="320" height="320" loading="lazy" />
          <span><h2 id="xlr-uni-h" className="xp-head">Hanzo University</h2><span className="xp-lede">Courses and certifications live on Hanzo University.</span></span>
          <i aria-hidden="true">↗</i>
        </A>
      </div>
    </section>
  );
}

function Blog() {
  return (
    <section className="xp-sec xlr-blog" aria-labelledby="xlr-blog-h">
      <div className="xp-wrap xp-grid">
        <div className="xlr-sticky"><h2 id="xlr-blog-h" className="xp-head">From the blog</h2></div>
        <ol className="xlr-posts">
          {BLOG.map(([t, date, d, h]) => (
            <li key={h}>
              <A to={h} className="xlr-post">
                <time className="x-mono" dateTime={date}>{date}</time>
                <b>{t}</b>
                <span>{d}</span>
              </A>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Think() {
  return (
    <section className="xp-sec xp-dark xlr-think" data-room="dark" aria-labelledby="xlr-think-h">
      <div className="xp-wrap">
        <LineReveal onView id="xlr-think-h" className="xp-display md" lines={['Read the thinking']} />
        <div className="xlr-think-grid">
          {THINK.map(([t, d, h]) => (
            <A key={t} to={h} className="xlr-think-a"><b>{t}</b><span>{d}</span><i aria-hidden="true">→</i></A>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Learn() {
  return (
    <main className="xp xlr">
      <NoJs />
      <Hero />
      <Tiles tag="Try" title="Pick what to try" items={TRY} kind="try" />
      <Uni />
      <Tiles tag="Further" title="Go further" items={FURTHER} kind="further" />
      <Blog />
      <Think />
      <section className="xp-sec tight xlr-qa" aria-labelledby="xlr-qa-h">
        <div className="xp-wrap xp-grid">
          <div className="xlr-sticky"><h2 id="xlr-qa-h" className="xp-head">Questions</h2></div>
          <div className="xlr-qa-l"><Faq items={QA} /></div>
        </div>
      </section>
    </main>
  );
}
