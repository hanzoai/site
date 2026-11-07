'use client';
/* Research. Its idea is the paper itself. The hero is a fanned stack of the six newest papers, typeset as title
   pages, that deals itself one sheet to the back every few seconds (or on a click). Signature moment: the library
   index — papers, specifications and standards in one list you filter by kind or search; on a desktop, the title
   page of the row under your pointer follows it as a live preview, tilting with the motion of your hand. The open
   source note closes the page in the one dark room. Every word, date and link is Hanzo's.
   Signature: the library index whose hovered row's title page follows the pointer as a tilting live preview.
   Beyond: "When it was published". The papers' own dates become a bar per month (each bar is a count of Hanzo's
   list, nothing more); press a month and the index narrows to what came out then. */
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion, useSpring, useTransform } from 'motion/react';
import { EASE, Rise, fine } from '../ui';
import { A, SecHead, Band } from '../kit';
import './Research.css';

const P = (t, date, sub, slug) => ({ kind: 'Papers', t, date, sub, to: `https://papers.hanzo.ai/${slug}/` });
const PAPERS = [
  P('Zen 6: Subquadratic Ultra-Long Context via Hierarchical Latent Sparse Attention', 'Nov 2026', 'Distilled & Native Latent Sparse Attention (D-LSA / N-LSA) on 27B Dense Transformers', 'zen6-latent-sparse-attention'),
  P('Kai: Calibrated Discrete Decision Intelligence for Autonomous Agent Loops', 'Oct 2026', 'Factorized Discrete Choice, Calibrated Distributions, and Deterministic Policy Governance', 'kai-decision-model'),
  P('Linkage, Not Similarity', 'Sep 2026', 'What long-term agent memory has to retrieve, and how it is measured', 'hanzo-context-memory'),
  P('Hanzo AI Chain (AIVM)', 'Aug 2026', 'Useful-Work Mining, the Native AI Coin, and Post-Quantum Omnichain Settlement', 'hanzo-ai-chain'),
  P('Cloud Economics of a Sovereign OSS Stack', 'Jun 2026', 'A Regulated Capital-Markets Migration Case Study', 'hanzo-cloud-economics'),
  P('One Native Stack for Private, Continuously-Learning AI', 'Jun 2026', 'Inference at the Bandwidth Wall, On-Device QLoRA, One Engine', 'hanzo-native-stack-thesis'),
  P('Native ROCm Inference on a Consumer RDNA3.5 APU', 'Jun 2026', 'Reaching llama.cpp Decode Parity via a Unified 1-bit-to-Full Quant Core', 'hanzo-rocm-inference'),
  P('Edge LLM Inference Across Commodity Accelerators', 'Jun 2026', 'Measured AMD, NVIDIA, and Apple Performance', 'hanzo-cross-backend-inference'),
  P('Native Training in the Hanzo Engine', 'Jun 2026', 'One Engine, One Quant Format, One Backend', 'hanzo-native-training'),
  P('Continuously-Learning Private AI', 'Jun 2026', 'Self-Improvement and Privacy in the Hanzo Native Stack', 'hanzo-continuous-learning-privacy'),
  P('Economical Serving and the hanzo.ai Platform', 'Jun 2026', 'A Bandwidth-Optimal Unified Train-and-Serve Runtime', 'hanzo-platform-infra-desktop'),
  P('The Unified Sovereign-Tenant Cloud', 'Jul 2026', 'Linear Shared-Nothing Scaling via Per-Tenant SQLite and In-Process Composition', 'hanzo-unified-tenant-cloud'),
  P('Refutation-Driven Performance Engineering', 'Jul 2026', 'An Empirical Study of a Multi-Week GPU Kernel Campaign', 'refutation-driven-perf'),
  P('Evolutionary Schedule Search in a One-Source Kernel DSL', 'Jul 2026', 'And the Continual-Improvement Loop It Anchors', 'evolutionary-schedule-search'),
  P('Hanzo Router', 'Jul 2026', 'Memory-Aware, Local-First LLM Routing with a Learned SLO-Constrained Policy', 'hanzo-router'),
  P('What a Dormant Agent Costs', 'Sep 2026', 'State, Execution and Isolation Measured Separately at a Fleet of One Million', 'hanzo-dormant-agents'),
  P('Hops Do Not Fix Multi-Hop Retrieval', 'Sep 2026', 'A Negative Result on Long-Horizon Conversational Memory, and What the Failure Actually Is', 'hanzo-multi-hop-retrieval'),
  P('Retrieval Scoped by Subject', 'Sep 2026', 'A factorial measurement of conversational memory on LoCoMo, and the negative controls that locate the effect', 'locomo-subject-scope'),
  P('Hanzo Network Whitepaper', 'Oct 2024', 'L1 Blockchain for Decentralized AI Compute', 'network-whitepaper'),
];
const HIP = 'https://hips.hanzo.ai/docs/';
const S = (kind, t, sub, slug) => ({ kind, t, sub, to: slug ? HIP + slug : 'https://hips.hanzo.ai' });
const SPECS = [
  S('Specifications', 'All HIPs', 'The specification index.'),
  S('Specifications', 'HIP-0000', 'The architecture framework.', 'hip-0000-hanzo-ai-architecture-framework'),
  S('Specifications', 'HIP-0510', 'Enso, the learned router.', 'hip-0510-enso-learned-router'),
  S('Specifications', 'HIP-1332', 'Kai, the decision model.', 'hip-1332-kai-the-decision-model'),
  S('Specifications', 'HIP-0039', 'Zen model architecture.', 'hip-0039-zen-model-architecture'),
  S('Specifications', 'HIP-1334', 'The research runtime.', 'hip-1334-research-unified-runtime'),
  S('Specifications', 'HIP-1145', 'How an experiment is recorded.', 'hip-1145-research-experiment-record'),
];
const STANDARDS = [
  S('Standards', 'HIP-0043', 'The inference engine.', 'hip-0043-llm-inference-engine-standard'),
  S('Standards', 'HIP-1211', 'The model API.', 'hip-1211-ai-the-model-api'),
  S('Standards', 'HIP-0004', 'The gateway.', 'hip-0004-llm-gateway-unified-ai-provider-interface'),
  S('Standards', 'HIP-0019', 'Tensor operations.', 'hip-0019-tensor-operations-standard'),
  S('Standards', 'HIP-1105', 'The benchmark arena.', 'hip-1105-benchmark-measurement-arena'),
];
const GROUPS = [
  ['Papers', 'Each one links to its page on papers.hanzo.ai, where the PDF and the LaTeX live.', PAPERS],
  ['Specifications', 'HIPs. The index is hips.hanzo.ai. These are the ones the families are written against.', SPECS],
  ['Standards', 'The standards the runtime, the gateway, and the benchmark arena are built to.', STANDARDS],
];
const MON = 'JanFebMarAprMayJunJulAugSepOctNovDec';
const when = (d) => +d.slice(4) * 12 + MON.indexOf(d.slice(0, 3)) / 3; // 'Nov 2026' -> a sortable number, no Date parsing
const MONTHS = [...new Set(PAPERS.map((p) => p.date))].sort((a, b) => when(b) - when(a))
  .map((m) => [m, PAPERS.filter((p) => p.date === m).length]);
const PEAK = Math.max(...MONTHS.map((m) => m[1]));
const host = (to) => to.replace(/^https:\/\/|\/$/g, '').replace(/\/docs\//, ' / ');

/* A title page, typeset: the same sheet in the hero stack and in the index preview. */
function Sheet({ x, fig }) {
  const hip = x.kind !== 'Papers';
  return (
    <div className={'xrs-sheet' + (hip ? ' hip' : '')}>
      <div className="xrs-sheet-top"><span>{hip ? 'hips.hanzo.ai' : 'papers.hanzo.ai'}</span><span>{hip ? x.kind : x.date}</span></div>
      <p className="xrs-sheet-t">{x.t}</p>
      <p className="xrs-sheet-s">{x.sub}</p>
      <div className="xrs-sheet-by"><span>Hanzo AI</span></div>
      {fig && <div className="xrs-fig"><img src="/models/oto.webp" alt="" loading="lazy" /><span>Figure 1</span></div>}
      <div className="xrs-lines" aria-hidden="true">{Array.from({ length: fig ? 5 : 9 }).map((_, i) => <i key={i} style={{ width: 100 - ((i * 37) % 24) + '%' }} />)}</div>
    </div>
  );
}

/* ---------- hero: the stack deals itself ---------- */
const FEATURED = PAPERS.slice(0, 6);
function Stack() {
  const [top, setTop] = useState(0);
  const [mine, setMine] = useState(false);
  const calm = useReducedMotion();
  const ref = useRef(null);
  const live = useInView(ref, { amount: 0.3 });
  useEffect(() => {
    if (mine || calm || !live) return;
    const t = setTimeout(() => setTop((v) => (v + 1) % 6), 3600);
    return () => clearTimeout(t);
  }, [top, mine, calm, live]);
  const go = (d) => { setMine(true); setTop((v) => (v + d + 6) % 6); };
  return (
    <div className="xrs-stack-w" ref={ref}>
      <div className="xrs-stack">
        {FEATURED.map((x, i) => {
          const k = (i - top + 6) % 6; // 0 is on top
          return (
            <motion.a key={x.t} href={x.to} target="_blank" rel="noopener noreferrer" className="xrs-card" tabIndex={k === 0 ? 0 : -1} aria-hidden={k !== 0}
              initial={false}
              animate={{ x: k * 22, y: k * -16, rotate: k === 0 ? -2 : -2 + k * 2.2, scale: 1 - k * 0.04, opacity: k > 3 ? 0 : 1, zIndex: 10 - k }}
              transition={{ type: 'spring', stiffness: 170, damping: 24, mass: 1 }}
              whileHover={k === 0 ? { y: -8, rotate: -1 } : undefined}>
              <Sheet x={x} fig={i === 0} />
            </motion.a>
          );
        })}
      </div>
      <div className="xrs-deal">
        <button type="button" onClick={() => go(-1)} aria-label="Previous paper">←</button>
        <span className="x-mono" aria-live="polite">{String(top + 1).padStart(2, '0')} / 06</span>
        <button type="button" onClick={() => go(1)} aria-label="Next paper">→</button>
      </div>
      {/* the six featured papers, as a list (Hanzo's hero lists them) */}
      <ol className="xrs-feat">
        {FEATURED.map((x, i) => (
          <li key={x.t} className={i === top ? 'on' : ''}><button type="button" onClick={() => { setMine(true); setTop(i); }}><span className="x-mono">{String(i + 1).padStart(2, '0')}</span><span><b>{x.t}</b><small>{x.date}. {x.sub}</small></span></button></li>
        ))}
      </ol>
    </div>
  );
}

function Hero() {
  const line = (t, d) => <span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: d }}>{t}</motion.span></span>;
  return (
    <section className="xrs-hero" aria-labelledby="xrs-h1">
      <div className="x-wrap xrs-hero-g">
        <div className="xrs-hero-c">
          <motion.p className="x-kick" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>Research</motion.p>
          <h1 id="xrs-h1" className="xrs-h1">{line('Work we', 0.05)}{line('publish', 0.15)}</h1>
          <motion.p className="xrs-lede" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}>Hanzo builds infrastructure that has to hold up under audit, regulation and adversaries.</motion.p>
          <motion.div className="xrs-acts" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}>
            <A to="https://papers.hanzo.ai" className="x-btn solid" data-thumb="Explore papers.hanzo.ai">Explore papers.hanzo.ai ↗</A>
            <A to="https://hips.hanzo.ai" className="x-btn">Specifications (HIPs) ↗</A>
            <A to="/benchmarks" className="x-btn">Benchmarks</A>
          </motion.div>
          <motion.dl className="xrs-tally" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 0.7 }}>
            {GROUPS.map(([k, , list]) => <div key={k}><dt>{k}</dt><dd className="x-mono">{list.length - (k === 'Specifications' ? 1 : 0)}</dd></div>)}
          </motion.dl>
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: EASE, delay: 0.2 }}>
          <Stack />
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- the library: filter by kind, search, and a title page that follows the pointer ---------- */
function Library() {
  const [kind, setKind] = useState('All');
  const [q, setQ] = useState('');
  const [mon, setMon] = useState(null);
  const [hot, setHot] = useState(null);
  const box = useRef(null);
  const x = useSpring(0, { stiffness: 260, damping: 28 });
  const y = useSpring(0, { stiffness: 260, damping: 28 });
  const vx = useSpring(0, { stiffness: 120, damping: 16 });
  const rot = useTransform(vx, [-30, 30], [-7, 7]);
  const last = useRef(0);
  const move = (e) => {
    if (!fine(e)) return;
    const r = box.current.getBoundingClientRect();
    const nx = e.clientX - r.left;
    vx.set(Math.max(-30, Math.min(30, nx - last.current)));
    last.current = nx;
    x.set(nx);
    y.set(e.clientY - r.top);
  };
  const t = q.trim().toLowerCase();
  const match = (it) => (!mon || it.date === mon) && (!t || (it.t + ' ' + it.sub + ' ' + (it.date || '')).toLowerCase().includes(t));
  const counts = useMemo(() => Object.fromEntries(GROUPS.map(([k, , l]) => [k, l.filter(match).length])), [t, mon]); // eslint-disable-line react-hooks/exhaustive-deps
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  return (
    <section className="x-sec xrs-lib" id="papers">
      <div className="x-wrap">
        <div className="xrs-lib-bar">
          <div className="xrs-kinds" role="tablist" aria-label="Kind">
            {['All', ...GROUPS.map((g) => g[0])].map((k) => (
              <button key={k} type="button" role="tab" aria-selected={kind === k} onClick={() => setKind(k)}>
                {kind === k && <motion.span layoutId="xrs-kind" className="xrs-kind-bg" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                <span>{k}</span><span className="x-mono">{k === 'All' ? total : counts[k]}</span>
              </button>
            ))}
          </div>
          <label className="xrs-find">
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="m10.5 10.5 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find a paper or a HIP" aria-label="Find a paper or a HIP" />
          </label>
        </div>
        <div className="xrs-when" role="group" aria-label="When it was published">
          {MONTHS.map(([m, n]) => (
            <button key={m} type="button" aria-pressed={mon === m} onClick={() => setMon(mon === m ? null : m)}>
              <i aria-hidden="true"><b style={{ transform: `scaleY(${n / PEAK})` }} /></i>
              <span className="x-mono">{m}</span>
              <span className="x-mono xrs-when-n">{n}</span>
            </button>
          ))}
        </div>
        <div className="xrs-list" ref={box} onPointerMove={move} onPointerLeave={() => setHot(null)}>
          {GROUPS.map(([k, lede, list]) => {
            const shown = kind === 'All' || kind === k;
            const rows = list.filter(match);
            return (
              <motion.div key={k} layout className="xrs-group" hidden={!shown || !rows.length} transition={{ duration: 0.5, ease: EASE }}>
                <div className="xrs-group-h">
                  <h2 className="xrs-h2">{k}</h2>
                  <p>{lede}</p>
                </div>
                <ol className={'xrs-rows ' + (k === 'Papers' ? 'p' : 'h')}>
                  {list.map((it, i) => {
                    const prev = list[i - 1];
                    const head = it.date && (!prev || prev.date !== it.date);
                    return (
                      <li key={it.t} hidden={!match(it)} className={head ? 'xrs-new' : ''}>
                        <A to={it.to} className="xrs-row" onPointerEnter={(e) => fine(e) && setHot(it)} onFocus={() => setHot(null)}>
                          <span className="xrs-row-d x-mono">{it.date ? (head ? it.date : '') : String(i).padStart(2, '0')}</span>
                          <span className="xrs-row-t"><b>{it.t}</b><span>{it.sub}</span></span>
                          <span className="xrs-row-go" aria-hidden="true">↗</span>
                        </A>
                      </li>
                    );
                  })}
                </ol>
              </motion.div>
            );
          })}
          {!total && <p className="xrs-none">Nothing in the library by that name. <button type="button" onClick={() => { setQ(''); setMon(null); }}>Clear</button></p>}
          <AnimatePresence>
            {hot && (
              <motion.div className="xrs-peek" style={{ x, y, rotate: rot }} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }} transition={{ duration: 0.3, ease: EASE }} aria-hidden="true">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div key={hot.t} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.22, ease: EASE }}>
                    <Sheet x={hot} />
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

export default function Research() {
  return (
    <main className="xrs">
      <Hero />
      <Library />
      <Band
        title="Open source"
        lede={<>The systems described in these papers are open source. The cloud, the gateway, the agent runtime and the infrastructure around them are developed in the open at <A to="https://github.com/hanzoai">github.com/hanzoai</A>, and the platform pays the open-source authors whose work runs on it.</>}
        action="github.com/hanzoai"
        to="https://github.com/hanzoai"
      />
    </main>
  );
}
