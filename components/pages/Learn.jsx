'use client';
// Signature: the docs as a transit map: a train rides the Start-here line by itself and stops at each station, whose guide opens beneath it.
// Beyond: your route: pick what you came to do and the stations for it line up in order, each one a link.
/* Learn Hanzo. The page is the map of the documentation, so it is drawn as one: five stations on the Start here line
   (the train rides it until you choose a stop), then the branch lines: what to try, where to go further, what was
   written, where the thinking is. Every line and link is Hanzo's own. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { EASE, Rise } from '../ui';
import { A, Go, More, SecHead, Faq } from '../kit';
import './Learn.css';

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
// routes are orderings of Hanzo's own stations: [label, [line, index]...]
const ROUTES = [
  ['A first request', [[START, 0], [START, 2], [TRY, 1]]],
  ['An agent', [[START, 0], [START, 3], [START, 4], [TRY, 5]]],
  ['From the terminal', [[START, 0], [START, 1], [TRY, 2]]],
  ['An interface', [[FURTHER, 0], [FURTHER, 1], [FURTHER, 2]]],
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
    const t = setTimeout(() => setAt((v) => (v + 1) % START.length), 3400);
    return () => clearTimeout(t);
  }, [at, mine, calm, seen]);
  return (
    <div className="xlr-map" ref={ref}>
      <div className="xlr-map-top"><span className="xlr-line-tag">Start here</span><span className="x-mono">{String(at + 1).padStart(2, '0')} / {String(START.length).padStart(2, '0')}</span></div>
      <div className="xlr-track">
        <i className="xlr-rail" aria-hidden="true"><motion.b initial={false} animate={{ scaleX: at / (START.length - 1) }} transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }} /></i>
        <motion.span className="xlr-train" aria-hidden="true" initial={false} animate={{ x: (at / (START.length - 1)) * 100 + '%' }} transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}><i /></motion.span>
        <div className="xlr-stops" role="tablist" aria-label="Start here">
          {START.map(([t], i) => (
            <button key={t} type="button" role="tab" id={'xlr-t' + i} aria-controls={'xlr-p' + i} aria-selected={at === i} className={i < at ? 'past' : ''} onClick={() => { setAt(i); setMine(true); }}>
              <i aria-hidden="true" /><span>{t}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="xlr-panels">
        {START.map(([t, d, h], i) => (
          <div key={t} id={'xlr-p' + i} role="tabpanel" aria-labelledby={'xlr-t' + i} hidden={at !== i} className="xlr-panel">
            <motion.div key={at === i ? 'on' : 'off'} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: EASE }}>
              <h3>{t}</h3>
              <p>{d}</p>
              <More to={h}>Open the guide</More>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Route() {
  const [r, setR] = useState(0);
  return (
    <div className="xlr-route">
      <p className="x-kick">Your route</p>
      <div className="xlr-route-k" role="radiogroup" aria-label="What you came to do">
        {ROUTES.map(([l], i) => (
          <button key={l} type="button" role="radio" aria-checked={r === i} onClick={() => setR(i)}>
            {r === i && <motion.span layoutId="xlr-route" className="xlr-route-bg" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
            <span>{l}</span>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.ol key={r} className="xlr-route-l" initial="h" animate="s" exit={{ opacity: 0, transition: { duration: 0.15 } }} variants={{ s: { transition: { staggerChildren: 0.07 } } }}>
          {ROUTES[r][1].map(([line, i], k) => (
            <motion.li key={line[i][0] + k} variants={{ h: { opacity: 0, x: -12 }, s: { opacity: 1, x: 0, transition: { duration: 0.45, ease: EASE } } }}>
              <span className="x-mono">{k + 1}</span><A to={line[i][2]}>{line[i][0]}</A>
            </motion.li>
          ))}
        </motion.ol>
      </AnimatePresence>
    </div>
  );
}

function Hero() {
  const line = (t, d) => <span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: d }}>{t}</motion.span></span>;
  return (
    <section className="xlr-hero" aria-labelledby="xlr-h1">
      <div className="x-wrap">
        <div className="xlr-hero-top">
          <div>
            <motion.p className="x-kick" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}>Learn</motion.p>
            <h1 id="xlr-h1" className="xlr-h1">{line('Learn Hanzo', 0.05)}</h1>
          </div>
          <div>
            <motion.p className="xlr-lede" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}>Start with a working request, then go as deep as you need.</motion.p>
            <motion.div className="xlr-acts" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.45 }}>
              <span data-thumb="Get started" data-href={DOCS + 'quickstart'}><Go to={DOCS + 'quickstart'} solid>Get started</Go></span>
              <Go to="https://hanzo.university">Hanzo University</Go>
            </motion.div>
          </div>
        </div>
        <motion.div className="xlr-hero-map" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.35 }}>
          <Metro />
          <Route />
        </motion.div>
      </div>
    </section>
  );
}

function Line({ tag, title, items, cols, kind }) {
  return (
    <section className={'x-sec xlr-sec xlr-' + kind} aria-label={title}>
      <div className="x-wrap">
        <div className="xlr-sec-head"><span className="xlr-line-tag">{tag}</span><SecHead title={title} /></div>
        <ol className={'xlr-stations c' + cols}>
          <i className="xlr-branch" aria-hidden="true" />
          {items.map(([t, d, h], i) => (
            <Rise as="li" key={t + h} delay={(i % cols) * 0.07} y={18}>
              <A to={h} className="xlr-st">
                <i className="xlr-dot" aria-hidden="true" />
                <b>{t}</b>
                <span>{d}</span>
                <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </A>
            </Rise>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Blog() {
  return (
    <section className="x-sec xlr-blog" aria-labelledby="xlr-blog-h">
      <div className="x-wrap xlr-blog-in">
        <div className="xlr-sticky"><span className="xlr-line-tag">Blog</span><SecHead title="From the blog" id="xlr-blog-h" /></div>
        <ol className="xlr-posts">
          {BLOG.map(([t, date, d, h], i) => (
            <Rise as="li" key={h} delay={i * 0.08}>
              <A to={h} className="xlr-post">
                <time className="x-mono" dateTime={date}>{date}</time>
                <b>{t}</b>
                <span>{d}</span>
              </A>
            </Rise>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Think() {
  return (
    <section className="x-sec xlr-think" data-room="dark" aria-labelledby="xlr-think-h">
      <div className="x-wrap">
        <SecHead dark kicker="Research" title="Read the thinking" id="xlr-think-h" />
        <div className="xlr-think-grid">
          {THINK.map(([t, d, h], i) => (
            <A key={t} to={h} className="xlr-think-a"><b>{t}</b><span>{d}</span><i aria-hidden="true">→</i></A>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Learn() {
  return (
    <main className="xlr">
      <Hero />
      <Line tag="Try" title="Pick what to try" items={TRY} cols={3} kind="try" />
      <section className="xlr-uni" aria-labelledby="xlr-uni-h">
        <div className="x-wrap">
          <A to="https://hanzo.university" className="xlr-uni-a">
              <img src="/models/zen.webp" alt="" width="320" height="320" loading="lazy" />
              <span><h2 id="xlr-uni-h">Hanzo University</h2><span>Courses and certifications live on Hanzo University.</span></span>
              <i aria-hidden="true">→</i>
          </A>
        </div>
      </section>
      <Line tag="Further" title="Go further" items={FURTHER} cols={3} kind="further" />
      <Blog />
      <Think />
      <section className="x-sec" aria-label="Questions">
        <div className="x-wrap xlr-blog-in">
          <div className="xlr-sticky"><SecHead title="Questions" /></div>
          <Faq items={QA} />
        </div>
      </section>
    </main>
  );
}
