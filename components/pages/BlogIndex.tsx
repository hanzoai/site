'use client';
/* Blog, v3 (Story archetype, editorial: a magazine's front page and its contents). Ink, greys and silvers only
   (JAMES.md 7); colour comes only from Hanzo's own model art.
   First screen: the masthead "News & Guides." on one display line, and under it the cover story.
   Signature: the cover turns itself. The six latest posts take the cover in turn: the headline wipes up out of view and
   the next wipes in, a brushed-silver curtain crosses the art plate, and the plate changes behind it: Hanzo's own Kai
   art for the Kai posts, otherwise a contour field drawn from the post's own title. The issue's six headlines sit beside
   it as an index with a hairline timing the current one; hover or tap any of them to bring it to the cover.
   MOTION-MAP signature (word-light, blog/WordLight.jsx): the masthead lede lights word by word as it is read; a hand
   takes the light word by word. Entrances, in page order (blog/enter.js + enter.css): ink-spread (cover plate),
   typewriter (on-site post titles), pendulum (publishing strip), tilt-3d-hover (contents), diagonal-wipe (band).
   Supporting: the contour fields lean toward the pointer (Sigil); the strip's bars rise once and a silver light runs
   across them. A hand on the issue index cuts straight to that story (no curtain); the timer keeps the curtain.
   Beyond: the publishing strip. Every month Hanzo has published in, from its own post dates, as a bar of its count;
   tap a month and the contents close up to just that month.
   Every word and date is Hanzo's (content/live/blog.json). */
// Persona: a developer or buyer following what Hanzo ships (arrives from the header's Learn menu, search or hanzo.blog)
// Goal: find the post worth reading now and open it
// CTA: Read the latest (the newest post) in the masthead and the ask bar; the close is the kit Band, Every post (hanzo.blog)
// Metric: post opens (data-cta="blog.*")
// 8 Nov (the home's bar): every section one frame at 1470 x 801; split headings with the drawn hairline; lit corners and drifting halftone; the cover plate swings back in 3D as each page turns (the cinematic moment); the contents are a fixed-height pane beside the publishing strip, which filters it (every post stays in the page); all six issue numbers in the page
// Signature: a magazine cover that turns itself: the headline wipes and a silver curtain crosses the art plate as it changes
// Beyond: the publishing strip: a bar per month counted from Hanzo's own post dates that narrows the contents to a month
// V2: 8/10 motion map: signature word-light (the masthead lede lights word by word; pointer, tap and arrow keys take the light), entrances ink-spread (cover plate), typewriter (on-site titles), pendulum (publishing strip), tilt-3d-hover (contents), diagonal-wipe (band); no pinned month headings, no scroll-linked band, old row/card reveals removed. Round 6: phone month bars fit the column (9 equal columns, no rail), active All 24 outlined not filled, one All 24 control, tighter cover-to-films gap. Round 5: masthead cuts in by CSS from first paint, the cover plate's first contour frame is server SVG (BlogIndexFrame), header outlined from first paint while the page's solid is on screen (no flip), phone strip scrolls inside the column with All 24 under it, card art clipped to its radius, big card fills the column, AnimatePresence popLayout. Round 4: JS off shows one cover story (NoJs, no <noscript>); one solid per screen (masthead "Read the latest" solid on desktop where the header quiets, outlined on phones beside the header's solid); the on-site trio plays Hanzo's own films (Zen, Enso, Kai) so four real visuals show with the cover; the contents show one month at a time, the bars swap it in and out, All 24 opens all; the count sits under Contents; trio tilt, count-up, idle bar sweep and row arrival kept
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useAnimate, useInView, useReducedMotion } from 'motion/react';
import { A, Cta, Film, Img } from '../kit';
import NoJs from '../NoJs';
import Sigil from '../Sigil';
import StoryClose from './StoryClose';
import StoryPause from './StoryPause';
import Frame from './BlogIndexFrame';
import WordLight from './blog/WordLight';
import Typed from './blog/Typed';
import { useEnter } from './blog/enter';
import './blog/enter.css';
import '../v2/system.css';
import './story.css';
import './BlogIndex.css';

/* a post whose tag names a Hanzo model shows that model's own art; the rest draw their own contour field */
const ART = { kai: '/models/kai.webp', enso: '/models/enso.webp', zen: '/models/zen.webp' };
const Arr = () => <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const EASE = [0.16, 1, 0.3, 1];
const B = 'https://hanzo.blog/';
const POSTS = [
  ['commerce', 'October 26, 2026', 'Optimizing for Headless Commerce in the Era of Agentic LLMs', 'Buyers are becoming agents. What it takes to be readable, signable and payable by an LLM with no human in the loop, and what Hanzo ships for it today.', 'headless-commerce-agentic-llms/'],
  ['kai', 'October 25, 2026', 'Your AI is Planning To Kill You', 'Why frontier models fail when real lives are on the line, and how Hanzo Kai 1.9 enforces deterministic safety.', '2026-10-16-your-ai-is-planning-to-kill-you/'],
  ['Kai', 'October 7, 2026', 'Kai 1: Decisions, Not Completions', "Kai is Hanzo's decision model, served by the Hanzo API. Give it explicit state and a listed question, and it returns a typed, calibrated answer — a choice, a score, a yes/no, or a reasoned deferral.", '2026-10-07-introducing-kai/'],
  ['Decision Models', 'September 30, 2026', 'What Is a Decision Model?', 'Generative models reason in unconstrained paragraphs. Decision models decide in typed, calibrated state transitions. Here is why the next frontier of AI is not generation, but decisions.', '2026-09-30-what-is-a-decision-model/'],
  ['Enterprise AI', 'September 21, 2026', 'Top Pain Points for Investment Firms That Hanzo AI Solves', "Identify key operational challenges in private equity, venture capital, and asset management — and discover how Hanzo's sovereign AI cloud, frontier reasoning models, and agentic workflows streamline sourcing, diligence, and execution.", '2026-09-21-ai-pain-points-investment-firms/'],
  ['architecture', 'July 27, 2026', 'The router is the registry', 'Hanzo Cloud has no checked-in OpenAPI file. The live route table is the source, projected three ways, and a bijection test fails the build if any projection drifts. 1,362 operations across 963 paths, generated per process at request time.', '2026-07-27-the-router-is-the-registry/'],
  ['infrastructure', 'July 17, 2026', 'Half a Million RPS on a GB10: The Network Was the Bottleneck, Not the Box', 'We set out to see how fast our cloud data plane could go on an NVIDIA GB10. The answer taught us more about NIC receive queues than about our own code — and it more than doubled our throughput on the same wire.', '2026-07-17-half-million-rps-gb10-zip-zap/'],
  ['enso', 'July 17, 2026', 'Introducing Enso — one API, routed to the best frontier intelligence', "Enso is Hanzo's learned router: no single frontier model leads every benchmark, so Enso routes each request to the model most likely to win it — and learns from your feedback as it goes. Microsecond routing on GPU, a transparent per-request meter, and a 1% fee that pays for itself. Here is how it works, the measured results, and the cost-transparency angle a monolith cannot offer.", 'introducing-enso/'],
  ['router', 'July 7, 2026', 'Route every prompt to the right model — and cut AI cloud costs by up to 90%', "Hanzo Router places each request on the cheapest model that can still serve it — reuse a local model for free, load one that fits, or fall through to cloud. Here's the idea, what it feels like in production (qualitative), and the honest cost arithmetic (quantitative) — no fabricated benchmark.", '2026-07-07-hanzo-router-cut-ai-costs/'],
  ['datastore', 'June 26, 2026', 'Introducing Hanzo Datastore: a post-quantum-ready OLAP engine', 'A ClickHouse-derived columnar warehouse, rebuilt around storage/compute separation on Hanzo S3, profile-guided and link-time optimized to roughly half the memory, with gRPC stripped out and a path to leaderless post-quantum coordination.', '2026-06-26-introducing-datastore/'],
  ['datastore', 'June 26, 2026', 'Killing Raft: from ZooKeeper consensus to Lux Quasar, natively', 'How Hanzo Datastore replaces the NuRaft engine under ClickHouse Keeper with Lux Quasar — post-quantum, leaderless consensus linked directly into the C++ server — while keeping the ZooKeeper API that replication speaks.', '2026-06-26-killing-raft-quasar-native-coordination/'],
  ['proof-of-ai', 'June 26, 2026', 'Proof of AI: An Open-Source Cloud That Pays the Developers It Runs On', 'Hanzo Cloud is built on Proof of AI — deterministic inference any validator can re-verify on-chain — and on a commitment that 25% of what the cloud earns flows back to the open-source developers whose code it runs.', 'proof-of-ai/'],
  ['brain', 'May 12, 2026', 'Hanzo Brain: Local-First Knowledge Graph for Agents', 'A single SQLite file your agent reads from every runtime. Zero LLM round-trips for graph ops, FTS5 plus vector plus typed-edge extraction at write time.', '2026-05-12-hanzo-brain/'],
  ['zen', 'April 6, 2026', 'Zen: 1T+ Parameter MoE Architecture', "Hanzo's flagship LLM — a 1.04 trillion parameter Mixture of Experts model fused from top language models, with distributed training and on-chain model attestation.", '2026-04-06-zen-model-architecture/'],
  ['formal-verification', 'March 26, 2026', 'Hanzo Ships Formal Proofs for AI Agent Infrastructure', 'Machine-checked Lean 4 proofs for agent safety, MCP protocol, PoAI consensus, and platform operations', '2026-03-26-formal-proofs-ship/'],
  ['ai', 'February 28, 2026', 'BitDelta: Serving 14 Zen Models from One GPU Cluster', "How BitDelta's 1-bit delta compression lets us serve 14 Zen model variants from shared GPU infrastructure — the math, the architecture, and the tradeoffs.", '2026-02-28-bitdelta-multi-tenant/'],
  ['hanzo', 'February 28, 2026', "From Commerce AI to Frontier Models: Hanzo's Decade of Infrastructure", 'Twelve years of building AI infrastructure — from a real-time recommendation engine in 2014 to 94+ frontier models and a post-quantum blockchain in 2026. The technical story of how we got here.', '2026-02-28-decade-of-hanzo/'],
  ['ai', 'February 27, 2026', 'The Complete AI Agent Stack: Models, Compute, and Tools in One Platform', 'Hanzo AI introduces the first platform combining 100+ AI models, cloud compute, GPU access, and 260+ MCP tools under a single developer account.', '2026-02-27-full-stack-ai-agents/'],
  ['gpu', 'February 27, 2026', 'H100 GPUs at $3.48/Hour — 72% Cheaper Than AWS', 'Hanzo Bot opens on-demand H100 GPU access for AI agent developers at $3.48/hr — 72% less than AWS equivalent pricing.', '2026-02-27-gpu-access-h100/'],
  ['bots', 'February 27, 2026', 'Run AI Agents for $5/Month: Introducing Hanzo Bot', 'Hanzo Bot launches with the cheapest AI agent hosting in the industry — starting at $5/mo with free credit, integrated access to 100+ models, and H100 GPUs at $3.48/hr.', '2026-02-27-hanzo-bot-launch/'],
  ['cloud', 'February 27, 2026', 'Hanzo Network: 10–54% Cheaper Than DigitalOcean, Lightsail, and Vultr', 'Hanzo Network launches a developer cloud that undercuts DigitalOcean, AWS Lightsail, Vultr, and Linode by 10–54% — with zero egress fees, DDoS protection, and consistent global pricing included.', '2026-02-27-hanzo-network-cloud-launch/'],
  ['pricing', 'February 27, 2026', 'AI Transcription 85% Cheaper Than OpenAI: Multimodal Pricing for Bot Developers', "Hanzo Bot delivers speech-to-text at $0.0009/minute — 85% cheaper than OpenAI Whisper — plus image generation at the industry's lowest price of $0.00013/step.", '2026-02-27-multimodal-pricing/'],
  ['pricing', 'February 27, 2026', 'Hanzo Pricing Deep Dive: Every Model, Every Plan, Every Comparison', 'The comprehensive breakdown of Hanzo pricing across AI models, cloud compute, GPU access, and tools — with head-to-head comparisons against every major competitor.', '2026-02-27-pricing-deep-dive/'],
].map(([tag, date, title, desc, path]) => ({ tag, date, title, desc, to: B + path, month: date.split(' ')[0] }));
const COVER = POSTS.slice(0, 6);
/* each on-site post shows Hanzo's own film for the first model it is about (as its /blog/<slug> plate and keep-reading cards do) */
const HERE = [['The Next Frontier Will Be Synthesis', '/blog/synthesis', 'zen'], ['A New Pareto Frontier', '/blog/pareto-frontier', 'enso'], ['Kai 1: Decisions, Not Completions', '/blog/kai-decision-models', 'kai']];
const MONTHS = ['February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October'];
const pad = (n) => String(n).padStart(2, '0');
const HOLD = 6.5;
const calmNow = () => typeof window !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/* the number of posts counts up once when the contents are reached, large, then settles to its 64px rest */
function Count({ n, label, go, from }) {
  const [v, setV] = useState(n);
  useEffect(() => {
    if (!go || from == null || calmNow()) { setV(n); return; }
    let raf = 0; const t0 = performance.now();
    const step = (t) => { const k = Math.min(1, (t - t0) / 1100); setV(Math.round(from + (n - from) * (1 - Math.pow(1 - k, 3)))); if (k < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [go, n, from]);
  return (
    <p className={'xbl-count v2s-num' + (go ? ' go' : '')}>
      <span aria-hidden="true">{v}</span><span className="xbl-sr" aria-live="polite">{n}{label ? ' ' + label : ''}</span>
      <span className="v2s-cap" aria-hidden="true">{label}</span>
    </p>
  );
}

/* ---------- 1. the masthead and the cover (Signature) ---------- */
function Cover() {
  const [at, setAt] = useState(0);
  const [art, setArt] = useState(0);
  const [hold, setHold] = useState(false);
  const [paused, setPaused] = useState(false);
  const how = useRef('auto'); // the timer turns the page with the curtain; a hand cuts straight to its story
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.35 });
  const calm = useReducedMotion();
  const run = seen && !hold && !calm && !paused;
  useEffect(() => {
    if (!run) return;
    const t = setTimeout(() => { how.current = 'auto'; setAt((v) => (v + 1) % COVER.length); }, HOLD * 1000);
    return () => clearTimeout(t);
  }, [at, run]);
  // the plate redraws behind the curtain, when it is fully closed
  useEffect(() => { if (calm || how.current === 'hand') { setArt(at); return; } const t = setTimeout(() => setArt(at), 480); return () => clearTimeout(t); }, [at, calm]);
  // the server's static first frame of the plate stays until the living canvas has drawn its own (its effect runs first)
  const [live, setLive] = useState(false);
  useEffect(() => setLive(true), []);
  const pick = (i) => { how.current = 'hand'; setAt(i); setHold(true); };
  // the cinematic moment: as the timer turns the page, the plate swings back on its spine like a cover turning, and the
  // new art settles in behind the silver curtain
  const [plate, turn] = useAnimate();
  useEffect(() => {
    if (calm || how.current === 'hand' || !plate.current) return;
    turn(plate.current, { rotateY: [0, -11, 0], scale: [1, 0.965, 1] }, { duration: 1.15, times: [0, 0.45, 1], ease: [0.65, 0, 0.35, 1] });
  }, [at, calm, plate, turn]);
  const hand = how.current === 'hand';
  const p = COVER[art];
  return (
    <div className="xbl-cover" ref={box} onPointerLeave={() => setHold(false)} aria-roledescription="carousel" aria-label="Latest posts">
      <StoryPause paused={paused} onToggle={() => setPaused((v) => !v)} />
      <div className="xbl-cover-l">
        <div className="xbl-stories">
          {COVER.map((s, i) => {
            const on = i === at;
            return (
              <article key={s.to} className={'xbl-story' + (on ? ' on' : '')} aria-hidden={!on} inert={!on ? true : undefined}>
                <a href={s.to} target="_blank" rel="noopener noreferrer" className="xbl-story-a" tabIndex={on ? 0 : -1}>
                  <motion.h2 className="v2s-headline xbl-story-t" initial={false} animate={on ? { clipPath: 'inset(-10% 0% -10% 0%)', y: 0 } : { clipPath: 'inset(-10% 0% 110% 0%)', y: -14 }} transition={on ? (hand ? { duration: 0.25, ease: EASE, delay: 0.12 } : { duration: 1, ease: EASE, delay: 0.32 }) : { duration: hand ? 0.12 : 0.3, ease: [0.7, 0, 0.84, 0] }} style={{ clipPath: on ? 'inset(-10% 0% -10% 0%)' : 'inset(-10% 0% 110% 0%)' }}>{s.title}</motion.h2>
                </a>
                <motion.p className="xbl-story-m" initial={false} animate={{ opacity: on ? 1 : 0 }} transition={{ duration: on ? 0.4 : 0.12, delay: on ? (hand ? 0.15 : 0.4) : 0 }}>
                  <span className="xbl-tag">{s.tag}</span>
                </motion.p>
                <motion.p className="v2s-lede xbl-story-d" initial={false} animate={on ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }} transition={on ? { duration: hand ? 0.25 : 0.6, ease: EASE, delay: hand ? 0.15 : 0.5 } : { duration: hand ? 0.1 : 0.2 }}>{`${s.date}. ${s.desc}`}</motion.p>
              </article>
            );
          })}
        </div>
      </div>
      <a href={p.to} target="_blank" rel="noopener noreferrer" className="xbl-plate" tabIndex={-1} aria-hidden="true" data-enter="ink" ref={plate}>
        {ART[p.tag.toLowerCase()] ? <Img key={p.to} src={ART[p.tag.toLowerCase()]} w={1200} h={1500} className="xbl-plate-img" /> : <Sigil seed={p.title} className="xbl-plate-art" />}
        {!live && !ART[p.tag.toLowerCase()] && <Frame seed={p.title} className="xbl-plate-art" />}
        <i className="xbl-plate-ht" aria-hidden="true" />
        {/* every issue number is in the page; the plate shows the current one */}
        <span className="xbl-plate-ks">{COVER.map((s, i) => <span key={s.to} className={'xbl-plate-k v2s-num' + (i === art ? ' on' : '')}>{pad(i + 1)} / {pad(COVER.length)}</span>)}</span>
        {/* reduced motion: MotionConfig skips the move, so the curtain simply stays off the plate */}
        {!hand && <motion.i key={'c' + at} className="xbl-curtain" initial={{ x: '-101%' }} animate={{ x: ['-101%', '0%', '0%', '101%'] }} transition={{ duration: 1.15, times: [0, 0.4, 0.52, 1], ease: [0.76, 0, 0.24, 1] }} />}
      </a>
      <ol className="xbl-index" aria-label="In this issue">
        {COVER.map((s, i) => (
          <li key={s.to} className={i === at ? 'on' : ''}>
            <button type="button" aria-pressed={i === at} onClick={() => pick(i)} onPointerEnter={(e) => { if (e.pointerType === 'mouse') pick(i); }} onFocus={() => pick(i)}>
              <span className="v2s-num">{pad(i + 1)}</span>
              <b>{s.title}</b>
              {i === at && run && <i key={'t' + at} className="xbl-timer" style={{ '--hold': HOLD + 's' }} aria-hidden="true" />}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* One solid at a time from the first paint: BlogIndex.css outlines the header's ask on desktop unless <html> carries
   data-xbl-solid; after mount this sets that flag only while none of the page's own solid asks is on screen. */
function useQuietHeader() {
  useEffect(() => {
    const H = document.documentElement;
    const asks = [...document.querySelectorAll('.xbl [data-cta^="blog."]')];
    if (!asks.length || typeof IntersectionObserver === 'undefined') return;
    const vis = new Set();
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => (e.isIntersecting ? vis.add(e.target) : vis.delete(e.target)));
      if (vis.size) delete H.dataset.xblSolid; else H.dataset.xblSolid = '';
    });
    asks.forEach((a) => io.observe(a));
    return () => { io.disconnect(); delete H.dataset.xblSolid; };
  }, []);
}

function Hero() {
  useQuietHeader();
  return (
    <section className="xbl-sec xbl-hero" aria-labelledby="xbl-h1" data-ask-name="Blog" data-morph-target>
      <div className="v2s-wrap">
        <div className="xbl-mast">
          <div className="xbl-mast-l">
            {/* cut in by CSS from the first paint (no wait for scripts) */}
            <h1 id="xbl-h1" className="v2s-display xbl-h1"><span className="xbl-ln"><span>News &amp; Guides.</span></span></h1>
          </div>
          <div className="xbl-mast-r">
            <WordLight className="v2s-lede" lead={<span className="v2s-label xbl-runin">Blog</span>} text="Product launches, architecture deep dives, and how-to guides from the team building the AI workforce platform." />
            <div className="v2s-acts">
              <Cta to={POSTS[0].to} id="blog.hero" thumb>Read the latest</Cta>
              <Cta to="https://hanzo.blog" kind="link">hanzo.blog</Cta>
            </div>
          </div>
        </div>
        <Cover />
      </div>
    </section>
  );
}

/* ---------- 2. the posts that live on this site: each opens into its page ---------- */
/* fine pointers only: the art plate tilts up to 2.5 degrees toward the hand, and settles when it leaves */
const tilt = (e) => {
  if (e.pointerType !== 'mouse') return;
  const el = e.currentTarget.querySelector('.xbl-here-art'); if (!el) return;
  const r = el.getBoundingClientRect();
  el.style.setProperty('--rx', ((0.5 - (e.clientY - r.top) / r.height) * 5).toFixed(2) + 'deg');
  el.style.setProperty('--ry', (((e.clientX - r.left) / r.width - 0.5) * 5).toFixed(2) + 'deg');
};
const untilt = (e) => { const el = e.currentTarget.querySelector('.xbl-here-art'); if (el) { el.style.removeProperty('--rx'); el.style.removeProperty('--ry'); } };

function Here() {
  return (
    <section className="xbl-sec xbl-here" aria-labelledby="xbl-here-h">
      <div className="v2s-wrap">
        <h2 id="xbl-here-h" className="xbl-sr">Posts on hanzo.ai</h2>
        <ul className="xbl-here-g" data-enter="type">
          {HERE.map(([t, to, film], i) => (
            <li key={to} className={i ? 'small' : 'big'}>
              <A to={to} className="xbl-here-a" onPointerMove={tilt} onPointerLeave={untilt}>
                <span className="xbl-here-art"><Film src={`/models/${film}.webm`} poster={`/models/${film}.webp`} w={1200} h={1500} className="xbl-here-img" aria-hidden="true" /></span>
                <span className={'xbl-here-t ' + (i ? 'v2s-title' : 'v2s-headline')}><span data-morph aria-hidden="true"><Typed text={t} /></span> <Arr /><span className="x-sr">{t + ' →'}</span></span>
              </A>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- 3. the contents, in one frame: the publishing strip and the count beside a pane that holds every post ---------- */
function Strip({ m, setM, months, top }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.6 });
  return (
    <div className="xbl-strip-w">
    <div className={'xbl-strip' + (seen ? ' seen' : '')} ref={ref} role="group" aria-label="Posts by month, 2026">
      {months.map(([k, n], i) => {
        const Tag = n ? 'button' : 'span'; // a month with no posts is a gap in the strip, not a control
        return (
          <Tag key={k} {...(n ? { type: 'button', 'aria-pressed': m === k, onClick: () => setM(m === k ? null : k) } : { role: 'img' })} className={'xbl-bar' + (m === k ? ' on' : '') + (n ? '' : ' none')} aria-label={`${k} 2026: ${n} ${n === 1 ? 'post' : 'posts'}`}>
            <span className="xbl-bar-n v2s-num" aria-hidden="true">{n || ''}</span>
            <span className="xbl-bar-c" aria-hidden="true" style={{ '--i': i }}><i style={{ transform: `scaleY(${seen ? n / top : 0})`, transitionDelay: `${i * 60}ms` }} /></span>
            <span className="xbl-bar-k" aria-hidden="true">{k.slice(0, 3)}</span>
          </Tag>
        );
      })}
    </div>
      <button type="button" className={'xbl-allbtn' + (!m ? ' on' : '')} aria-pressed={!m} onClick={() => setM(null)}>All {POSTS.length}</button>
    </div>
  );
}

function Contents() {
  const [m, setM] = useState(null);
  const months = useMemo(() => {
    const c = {};
    POSTS.forEach((p) => { c[p.month] = (c[p.month] || 0) + 1; });
    return MONTHS.map((k) => [k, c[k] || 0]);
  }, []);
  const top = Math.max(...months.map(([, n]) => n));
  const groups = useMemo(() => {
    const g = [];
    POSTS.forEach((p) => { const last = g[g.length - 1]; if (last && last[0] === p.month) last[1].push(p); else g.push([p.month, [p]]); });
    return g;
  }, []);
  const pane = useRef(null);
  const head = useRef(null);
  const headSeen = useInView(head, { once: true, amount: 0.5 });
  // a month from the strip filters the pane to it (the other months stay in the page, hidden); All opens every month again
  const choose = (k) => { setM(k); const el = pane.current; if (el) el.scrollTo({ top: 0, behavior: calmNow() ? 'auto' : 'smooth' }); };
  return (
    <section className="xbl-sec xbl-contents" aria-labelledby="xbl-c-h">
      <div className="v2s-wrap xbl-c-g">
        <div className="xbl-c-side">
          <div className="xbl-c-head" ref={head}>
            <h2 id="xbl-c-h" className="xbl-c-h">Contents</h2>
            <p className="v2s-cap">Every post</p>
          </div>
          <Count key={m || 'all'} n={m ? (months.find(([k]) => k === m) || [0, 0])[1] : POSTS.length} label={m ? m + ' 2026' : ''} go={headSeen} from={m ? null : 0} />
          <div className="xbl-c-strip" data-enter="swing">
            <Strip m={m} setM={choose} months={months} top={top} />
          </div>
        </div>
        <div className="xbl-pane" data-enter="tilt">
          <div className="xbl-toc" ref={pane} data-lenis-prevent="" tabIndex={0} role="region" aria-label="Contents">
            {groups.map(([k, list]) => (
              <section key={k} className="xbl-month" hidden={m && m !== k ? true : undefined} aria-label={`${k} 2026`}>
                <div className="xbl-month-h" aria-hidden="true">
                  <b>{k}</b>
                  <span className="v2s-num">2026 · {pad(list.length)}</span>
                </div>
                <ol>
                  {list.map((p) => (
                    <li key={p.to} className="xbl-li">
                      <a href={p.to} target="_blank" rel="noopener noreferrer" className="xbl-row">
                        <span className="xbl-row-k"><span>{p.tag}</span><span className="xbl-row-d v2s-num">{p.date}</span></span>
                        <b className="xbl-row-t"><span>{p.title}</span></b>
                        <span className="xbl-row-p">{p.desc}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </section>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function BlogIndex() {
  const root = useRef(null);
  useEnter(root);
  return (
    <main id="main" className="xbl v2s" ref={root}>
      {/* JavaScript off: the masthead and the first cover story show at rest */}
      <NoJs css={'.xbl .v2-line>span,.xbl-mast-r,.xbl-story.on *,.xbl-here li,.xbl-li{transform:none!important;opacity:1!important;clip-path:none!important} .xbl-story:not(.on){visibility:hidden!important} .xbl-curtain{display:none} .xbl-month[hidden]{display:block!important} .xbl-allbtn,.xst-pause{display:none!important}'} />
      <Hero />
      <Here />
      <Contents />
      <div className="xbl-close" data-enter="wipe">
        <StoryClose title="Build with Hanzo" lede="Deploy AI agents that code, market, and operate — starting free." action="Every post" to="https://hanzo.blog" cta="blog.band" note={<p className="x-band-note"><A to="https://docs.hanzo.ai">Read the docs</A></p>} />
      </div>
    </main>
  );
}
