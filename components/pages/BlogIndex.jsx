'use client';
/* Blog. Its idea is the newsroom's front page and its contents page.
   Signature: the cover story turns itself. The six latest posts take the cover in turn, the headline set huge and
   wiping up into the next, a hairline timing each one; below, the whole archive is set like a book's contents, a
   dotted leader running from each title to its date.
   Beyond: the publishing strip. Every month Hanzo has published in, from its own post dates, as a bar of its count;
   tap a month and the contents close up to just that month.
   Every word and date is Hanzo's. */
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { EASE, Rise } from '../ui';
import { A, Go, SecHead, Band } from '../kit';
import Sigil from '../Sigil';
import './BlogIndex.css';

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
const pad = (n) => String(n).padStart(2, '0');

/* The cover: six stories in turn, the headline wiping up into the next. All six are in the page; one shows. */
function Cover() {
  const [at, setAt] = useState(0);
  const [hold, setHold] = useState(false);
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.4 });
  const calm = useReducedMotion();
  const run = seen && !hold && !calm;
  useEffect(() => {
    if (!run) return;
    const t = setTimeout(() => setAt((v) => (v + 1) % COVER.length), 5200);
    return () => clearTimeout(t);
  }, [at, run]);
  const go = (d) => setAt((v) => (v + d + COVER.length) % COVER.length);
  return (
    <div className="xbl-cover" ref={box} onPointerEnter={(e) => e.pointerType === 'mouse' && setHold(true)} onPointerLeave={() => setHold(false)} onFocus={() => setHold(true)} onBlur={() => setHold(false)} aria-roledescription="carousel" aria-label="Latest posts">
      <div className="xbl-cover-top">
        <span className="x-mono xbl-count" aria-live="polite">{pad(at + 1)} / {pad(COVER.length)}</span>
        <div className="xbl-ticks" aria-hidden="true">
          {COVER.map((p, i) => <i key={i} className={i === at ? 'on' : i < at ? 'done' : ''}>{i === at && run && <b key={'r' + at} />}</i>)}
        </div>
        <div className="xbl-nav">
          <button type="button" className="x-round" onClick={() => go(-1)} aria-label="Previous post">‹</button>
          <button type="button" className="x-round" onClick={() => go(1)} aria-label="Next post">›</button>
        </div>
      </div>
      <div className="xbl-stories">
        {COVER.map((p, i) => {
          const on = i === at;
          return (
            <article key={p.to} className={'xbl-story' + (on ? ' on' : '')} aria-hidden={!on} inert={!on}>
              <a href={p.to} target="_blank" rel="noopener noreferrer" className="xbl-story-a" tabIndex={on ? 0 : -1}>
                <span className="xbl-story-k x-mono">{p.tag}</span>
                <h3 className="xbl-story-t">
                  <span className="x-line"><motion.span className="x-line-in" initial={false} animate={on ? { y: 0, opacity: 1 } : { y: '-104%', opacity: 0 }} transition={{ duration: on ? 0.9 : 0.5, ease: EASE, delay: on ? 0.12 : 0 }}>{p.title}</motion.span></span>
                </h3>
                <motion.p className="xbl-story-d" initial={false} animate={on ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }} transition={{ duration: 0.6, ease: EASE, delay: on ? 0.32 : 0 }}>{`${p.date}. ${p.desc}`}</motion.p>
              </a>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function Hero() {
  const line = (t, d) => <span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: d }}>{t}</motion.span></span>;
  return (
    <section className="xbl-hero" aria-labelledby="xbl-h1">
      <div className="x-wrap">
        <div className="xbl-mast">
          <div>
            <motion.p className="x-kick" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>Blog</motion.p>
            <h1 id="xbl-h1" className="xbl-h1">{line('News', 0.05)}{line('& Guides.', 0.15)}</h1>
          </div>
          <motion.div className="xbl-mast-r" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}>
            <p className="xbl-lede">Product launches, architecture deep dives, and how-to guides from the team building the AI workforce platform.</p>
            <div className="xbl-acts">
              <Go to={POSTS[0].to} solid>Read the latest</Go>
              <Go to="https://hanzo.blog">hanzo.blog</Go>
            </div>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.25 }}>
          <Cover />
        </motion.div>
      </div>
    </section>
  );
}

/* Posts that live on this site: each its own contour map, and the title opens into the post. */
function Here() {
  return (
    <section className="xbl-here">
      <div className="x-wrap">
        <ul className="xbl-here-list">
          {HERE.map(([t, to], i) => (
            <Rise as="li" key={to} delay={i * 0.06} y={18}>
              <A to={to} className="xbl-here-a">
                <Sigil seed={to} className="xbl-here-art" />
                <span className="xbl-here-t" data-morph>{t}</span>
                <span className="xbl-here-go" aria-hidden="true">→</span>
              </A>
            </Rise>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* The contents page, with the publishing strip on top: a bar per month, its height the posts that month. */
function Contents() {
  const [m, setM] = useState(null);
  const months = useMemo(() => {
    const c = {};
    POSTS.forEach((p) => { c[p.month] = (c[p.month] || 0) + 1; });
    return ['February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October'].map((k) => [k, c[k] || 0]);
  }, []);
  const top = Math.max(...months.map(([, n]) => n));
  const shown = m ? POSTS.filter((p) => p.month === m) : POSTS;
  // the month you are reading, from the row at the reading line
  const [now, setNow] = useState(POSTS[0].month);
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) setNow(e.target.dataset.month); }), { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('.xbl-toc > li').forEach((li) => io.observe(li));
    return () => io.disconnect();
  }, [shown]);
  return (
    <section className="x-sec xbl-contents" aria-label="Contents">
      <div className="x-wrap">
        <SecHead kicker="Every post" title="Contents" />
        <div className="xbl-strip" role="group" aria-label="Posts by month, 2026">
          {months.map(([k, n], i) => {
            const Tag = n ? 'button' : 'span'; // a month with no posts is a gap in the strip, not a control
            return (
            <Tag key={k} {...(n ? { type: 'button', 'aria-pressed': m === k, onClick: () => setM(m === k ? null : k) } : { role: 'img' })} className={'xbl-bar' + (m === k ? ' on' : '') + (n ? '' : ' none')} aria-label={`${k} 2026: ${n} ${n === 1 ? 'post' : 'posts'}`}>
              <span className="xbl-bar-n x-mono" aria-hidden="true">{n || ''}</span>
              <span className="xbl-bar-c" aria-hidden="true"><motion.i initial={{ scaleY: 0 }} whileInView={{ scaleY: n / top }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.9, ease: EASE, delay: i * 0.05 }} /></span>
              <span className="xbl-bar-k x-mono" aria-hidden="true">{k.slice(0, 3)}</span>
            </Tag>
            );
          })}
          <button type="button" className={'xbl-allbtn' + (m ? '' : ' on')} aria-pressed={!m} onClick={() => setM(null)}>All {POSTS.length}</button>
        </div>
        <div className="xbl-where" aria-hidden="true"><Sigil seed={'blog-' + now} className="xbl-where-art" /><span className="x-mono">{now} 2026</span></div>
        <ol className="xbl-toc">
          <AnimatePresence initial={false}>
            {shown.map((p) => (
              <motion.li key={p.to} data-month={p.month} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, transition: { duration: 0.15 } }} transition={{ duration: 0.45, ease: EASE }}>
                <a href={p.to} target="_blank" rel="noopener noreferrer" className="xbl-row">
                  <span className="xbl-row-k x-mono">{p.tag}</span>
                  <span className="xbl-row-main">
                    <span className="xbl-row-line"><b>{p.title}</b><i aria-hidden="true" /><span className="xbl-row-d x-mono">{p.date}</span></span>
                    <span className="xbl-row-p">{p.desc}</span>
                  </span>
                </a>
              </motion.li>
            ))}
          </AnimatePresence>
        </ol>
      </div>
    </section>
  );
}

export default function BlogIndex() {
  return (
    <main className="xbl">
      <Hero />
      <Here />
      <Contents />
      <Band title="Build with Hanzo" lede="Deploy AI agents that code, market, and operate — starting free." action="Every post" to="https://hanzo.blog" note={<p className="x-band-note"><A to="https://docs.hanzo.ai">Read the docs</A></p>} />
    </main>
  );
}
