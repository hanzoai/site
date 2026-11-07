'use client';
/* Blog, v3 (Story archetype, editorial: a magazine's front page and its contents). Ink, greys and silvers only
   (JAMES.md 7); colour comes only from Hanzo's own model art.
   First screen: the masthead "News & Guides." on one display line, and under it the cover story.
   Signature: the cover turns itself. The six latest posts take the cover in turn: the headline wipes up out of view and
   the next wipes in, a brushed-silver curtain crosses the art plate, and the plate changes behind it: Hanzo's own Kai
   art for the Kai posts, otherwise a contour field drawn from the post's own title. The issue's six headlines sit beside
   it as an index with a hairline timing the current one; hover or tap any of them to bring it to the cover.
   Supporting (three): every picture is a living contour field from its own post's title that leans toward the pointer
   (Sigil); the publishing strip's bars rise once when reached; the month you are reading pins at the left of the
   contents as you scroll.
   Beyond: the publishing strip. Every month Hanzo has published in, from its own post dates, as a bar of its count;
   tap a month and the contents close up to just that month.
   Every word and date is Hanzo's (content/live/blog.json). */
// Persona: a developer or buyer following what Hanzo ships (arrives from the header's Learn menu, search or hanzo.blog)
// Goal: find the post worth reading now and open it
// CTA: Read the latest (the newest post) in the masthead and the ask bar; the close is the kit Band, Every post (hanzo.blog)
// Metric: post opens (data-cta="blog.*")
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { A, Band, Img } from '../kit';
import Sigil from '../Sigil';
import Lines from '../v2/Lines';
import '../v2/system.css';
import './story.css';
import './BlogIndex.css';

const Chev = () => <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M6 3.5 10.5 8 6 12.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
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
  ['cloud', 'February 27, 2026', 'Enterprise Cloud Without Enterprise Pricing: 96 vCPUs at $3,999/Month', 'Hanzo Network launches Business through Ultra enterprise cloud tiers — dedicated CPU machines from 8 to 96 vCPUs with 71–81% cost advantage over hyperscaler equivalents.', '2026-02-27-enterprise-cloud-tiers/'],
  ['ai', 'February 27, 2026', 'The Complete AI Agent Stack: Models, Compute, and Tools in One Platform', 'Hanzo AI introduces the first platform combining 100+ AI models, cloud compute, GPU access, and 260+ MCP tools under a single developer account.', '2026-02-27-full-stack-ai-agents/'],
  ['gpu', 'February 27, 2026', 'H100 GPUs at $3.48/Hour — 72% Cheaper Than AWS', 'Hanzo Bot opens on-demand H100 GPU access for AI agent developers at $3.48/hr — 72% less than AWS equivalent pricing.', '2026-02-27-gpu-access-h100/'],
  ['bots', 'February 27, 2026', 'Run AI Agents for $5/Month: Introducing Hanzo Bot', 'Hanzo Bot launches with the cheapest AI agent hosting in the industry — starting at $5/mo with free credit, integrated access to 100+ models, and H100 GPUs at $3.48/hr.', '2026-02-27-hanzo-bot-launch/'],
  ['cloud', 'February 27, 2026', 'Hanzo Network: 10–54% Cheaper Than DigitalOcean, Lightsail, and Vultr', 'Hanzo Network launches a developer cloud that undercuts DigitalOcean, AWS Lightsail, Vultr, and Linode by 10–54% — with zero egress fees, DDoS protection, and consistent global pricing included.', '2026-02-27-hanzo-network-cloud-launch/'],
  ['pricing', 'February 27, 2026', 'AI Transcription 85% Cheaper Than OpenAI: Multimodal Pricing for Bot Developers', "Hanzo Bot delivers speech-to-text at $0.0009/minute — 85% cheaper than OpenAI Whisper — plus image generation at the industry's lowest price of $0.00013/step.", '2026-02-27-multimodal-pricing/'],
  ['pricing', 'February 27, 2026', 'Hanzo Pricing Deep Dive: Every Model, Every Plan, Every Comparison', 'The comprehensive breakdown of Hanzo pricing across AI models, cloud compute, GPU access, and tools — with head-to-head comparisons against every major competitor.', '2026-02-27-pricing-deep-dive/'],
].map(([tag, date, title, desc, path]) => ({ tag, date, title, desc, to: B + path, month: date.split(' ')[0] }));
const COVER = POSTS.slice(0, 6);
const HERE = [['The Next Frontier Will Be Synthesis', '/blog/synthesis'], ['A New Pareto Frontier', '/blog/pareto-frontier'], ['Kai 1: Decisions, Not Completions', '/blog/kai-decision-models']];
const MONTHS = ['February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October'];
const pad = (n) => String(n).padStart(2, '0');
const HOLD = 6.5;

/* ---------- 1. the masthead and the cover (Signature) ---------- */
function Cover() {
  const [at, setAt] = useState(0);
  const [art, setArt] = useState(0);
  const [hold, setHold] = useState(false);
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.35 });
  const calm = useReducedMotion();
  const run = seen && !hold && !calm;
  useEffect(() => {
    if (!run) return;
    const t = setTimeout(() => setAt((v) => (v + 1) % COVER.length), HOLD * 1000);
    return () => clearTimeout(t);
  }, [at, run]);
  // the plate redraws behind the curtain, when it is fully closed
  useEffect(() => { if (calm) { setArt(at); return; } const t = setTimeout(() => setArt(at), 480); return () => clearTimeout(t); }, [at, calm]);
  const p = COVER[art];
  return (
    <div className="xbl-cover" ref={box} onPointerLeave={() => setHold(false)} aria-roledescription="carousel" aria-label="Latest posts">
      <div className="xbl-cover-l">
        <div className="xbl-stories">
          {COVER.map((s, i) => {
            const on = i === at;
            return (
              <article key={s.to} className={'xbl-story' + (on ? ' on' : '')} aria-hidden={!on} inert={!on ? true : undefined}>
                <motion.p className="xbl-story-m" initial={false} animate={{ opacity: on ? 1 : 0 }} transition={{ duration: on ? 0.5 : 0.2, delay: on ? 0.3 : 0 }}>
                  <span className="xbl-tag">{s.tag}</span><time>{s.date}</time>
                </motion.p>
                <a href={s.to} target="_blank" rel="noopener noreferrer" className="xbl-story-a" tabIndex={on ? 0 : -1}>
                  <motion.h3 className="v2s-headline xbl-story-t" initial={false} animate={on ? { clipPath: 'inset(-10% 0% -10% 0%)', y: 0 } : { clipPath: 'inset(-10% 0% 110% 0%)', y: -14 }} transition={on ? { duration: 1, ease: EASE, delay: 0.32 } : { duration: 0.3, ease: [0.7, 0, 0.84, 0] }} style={{ clipPath: on ? 'inset(-10% 0% -10% 0%)' : 'inset(-10% 0% 110% 0%)' }}>{s.title}</motion.h3>
                </a>
                <motion.p className="v2s-lede xbl-story-d" initial={false} animate={on ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }} transition={on ? { duration: 0.6, ease: EASE, delay: 0.5 } : { duration: 0.2 }}>{`${s.date}. ${s.desc}`}</motion.p>
              </article>
            );
          })}
        </div>
      </div>
      <a href={p.to} target="_blank" rel="noopener noreferrer" className="xbl-plate" tabIndex={-1} aria-hidden="true">
        {ART[p.tag.toLowerCase()] ? <Img key={p.to} src={ART[p.tag.toLowerCase()]} w={1200} h={1500} className="xbl-plate-img" /> : <Sigil seed={p.title} className="xbl-plate-art" />}
        <span className="xbl-plate-k v2s-num">{pad(art + 1)} / {pad(COVER.length)}</span>
        {/* reduced motion: MotionConfig skips the move, so the curtain simply stays off the plate */}
        <motion.i key={'c' + at} className="xbl-curtain" initial={{ x: '-101%' }} animate={{ x: ['-101%', '0%', '0%', '101%'] }} transition={{ duration: 1.15, times: [0, 0.4, 0.52, 1], ease: [0.76, 0, 0.24, 1] }} />
      </a>
      <ol className="xbl-index" aria-label="In this issue">
        {COVER.map((s, i) => (
          <li key={s.to} className={i === at ? 'on' : ''}>
            <button type="button" aria-pressed={i === at} onClick={() => { setAt(i); setHold(true); }} onPointerEnter={(e) => { if (e.pointerType === 'mouse') { setAt(i); setHold(true); } }} onFocus={() => { setAt(i); setHold(true); }}>
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

function Hero() {
  return (
    <section className="xbl-hero" aria-labelledby="xbl-h1" data-ask-name="Blog">
      <div className="v2s-wrap">
        <div className="xbl-mast">
          <div className="xbl-mast-l">
            <Lines as="h1" id="xbl-h1" className="v2s-display xbl-h1" now delay={0.05} lines={['News & Guides.']} />
          </div>
          <motion.div className="xbl-mast-r" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.45 }}>
            <p className="v2s-label">Blog</p>
            <p className="v2s-lede">Product launches, architecture deep dives, and how-to guides from the team building the AI workforce platform.</p>
            <div className="v2s-acts">
              <A to={POSTS[0].to} className="v2s-btn solid" data-thumb="Read the latest" data-cta="blog.hero">Read the latest</A>
              <A to="https://hanzo.blog" className="v2s-tlink">hanzo.blog<Chev /></A>
            </div>
          </motion.div>
        </div>
        <Cover />
      </div>
    </section>
  );
}

/* ---------- 2. the posts that live on this site: each opens into its page ---------- */
function Here() {
  return (
    <section className="v2s-sec tight xbl-here" aria-label="Posts on hanzo.ai">
      <div className="v2s-wrap">
        <ul className="xbl-here-g">
          {HERE.map(([t, to], i) => (
            <li key={to} className={i ? 'small' : 'big'}>
              <A to={to} className="xbl-here-a">
                <span className="xbl-here-art"><Sigil seed={to} /></span>
                <span className="xbl-here-n v2s-num" aria-hidden="true">{pad(i + 1)}</span>
                <span className={'xbl-here-t ' + (i ? 'v2s-title' : 'v2s-headline')} data-morph>{t}</span>
                <span className="xbl-here-go" aria-hidden="true"><Arr /></span>
              </A>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- 3. the contents, with the publishing strip (Beyond) ---------- */
function Strip({ m, setM, months, top }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.6 });
  return (
    <div className="xbl-strip" ref={ref} role="group" aria-label="Posts by month, 2026">
      {months.map(([k, n], i) => {
        const Tag = n ? 'button' : 'span'; // a month with no posts is a gap in the strip, not a control
        return (
          <Tag key={k} {...(n ? { type: 'button', 'aria-pressed': m === k, onClick: () => setM(m === k ? null : k) } : { role: 'img' })} className={'xbl-bar' + (m === k ? ' on' : '') + (n ? '' : ' none')} aria-label={`${k} 2026: ${n} ${n === 1 ? 'post' : 'posts'}`}>
            <span className="xbl-bar-n v2s-num" aria-hidden="true">{n || ''}</span>
            <span className="xbl-bar-c" aria-hidden="true"><i style={{ transform: `scaleY(${seen ? n / top : 0})`, transitionDelay: `${i * 60}ms` }} /></span>
            <span className="xbl-bar-k" aria-hidden="true">{k.slice(0, 3)}</span>
          </Tag>
        );
      })}
      <button type="button" className={'xbl-allbtn' + (m ? '' : ' on')} aria-pressed={!m} onClick={() => setM(null)}>All {POSTS.length}</button>
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
  const shown = m ? groups.filter(([k]) => k === m) : groups;
  return (
    <section className="v2s-sec xbl-contents" aria-labelledby="xbl-c-h">
      <div className="v2s-wrap">
        <div className="v2s-head xbl-c-head">
          <p className="v2s-label">Every post</p>
          <h2 id="xbl-c-h" className="v2s-display xbl-c-h">Contents</h2>
          <div className="xbl-c-strip"><Strip m={m} setM={setM} months={months} top={top} /></div>
        </div>
        <div className="xbl-toc">
          {shown.map(([k, list]) => (
            <motion.section key={k} className="xbl-month" initial={m ? { opacity: 0, y: 12 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }} aria-label={`${k} 2026`}>
              <div className="xbl-month-h" aria-hidden="true">
                <b>{k}</b>
                <span className="v2s-num">2026 · {pad(list.length)}</span>
              </div>
              <ol>
                {list.map((p) => (
                  <li key={p.to}>
                    <a href={p.to} target="_blank" rel="noopener noreferrer" className="xbl-row">
                      <span className="xbl-row-k">{p.tag}</span>
                      <span className="xbl-row-main">
                        <span className="xbl-row-line"><b>{p.title}</b><i aria-hidden="true" /><span className="xbl-row-d v2s-num">{p.date}</span></span>
                        <span className="xbl-row-p">{p.desc}</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ol>
            </motion.section>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function BlogIndex() {
  return (
    <main className="xbl v2s">
      {/* JavaScript off: the masthead and the first cover story show at rest */}
      <noscript><style>{'.xbl .v2-line>span,.xbl-mast-r,.xbl-story.on *{transform:none!important;opacity:1!important;clip-path:none!important}'}</style></noscript>
      <Hero />
      <Here />
      <Contents />
      <Band title="Build with Hanzo" lede="Deploy AI agents that code, market, and operate — starting free." action="Every post" to="https://hanzo.blog" note={<p className="x-band-note"><A to="https://docs.hanzo.ai">Read the docs</A></p>} />
    </main>
  );
}
