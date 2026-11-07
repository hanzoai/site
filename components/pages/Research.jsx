'use client';
/* Research. Its idea is the paper itself, typeset.
   V2: 8/10 rebuilt as an editorial library: a staged hero deck of the six newest title pages that fans out as you scroll and deals itself, the library as a big index with a re-flowing filter rail, and every paper opening from its row into its own title page; the open-source note as the one dark room.
   The hero is the newest paper's title page, big, with the next five stacked behind it; scroll and the deck settles and
   fans open, and it deals itself one sheet to the back every few seconds (or at your hand). Then the library at a
   glance: how many papers, specifications and standards, and when they came out. Then the index itself: a rail of kinds
   and a search on the left, the papers, HIPs and standards on the right as an editorial list that re-flows as you
   filter. Press any row and its title page lifts off the row and opens to full size (shared-element morph), with the way
   to read it on papers.hanzo.ai or hips.hanzo.ai. The open-source note closes the page in the one dark room.
   Motion: signature, the open (row → title page). Supporting: the hero deck (scroll-staged, self-dealing), line-masked
   headings, the dark room wiping in. Accent: crimson, one per page.
   Signature: every paper in the library opens from its row into its own full-size title page, the small sheet lifting off the list and growing in place.
   Beyond: "When it was published". The papers' own dates become a bar per month (each bar is a count of Hanzo's list, nothing more); press a month and the index narrows to what came out then.
   Every word, date and link is Hanzo's. */
import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useInView, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { A } from '../kit';
import MaskLines from '../v2/MaskLines';
import SceneWipe from '../v2/SceneWipe';
import '../v2/ProofScale.css';
import './Research.css';

const EASE = [0.16, 1, 0.3, 1];
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
const MONTHS = [...new Set(PAPERS.map((p) => p.date))].sort((a, b) => when(b) - when(a)).map((m) => [m, PAPERS.filter((p) => p.date === m).length]);
const PEAK = Math.max(...MONTHS.map((m) => m[1]));
const key = (x) => 'xrs-' + x.to.replace(/^https:\/\//, '').replace(/[^a-z0-9]+/gi, '-');
const pad = (n) => String(n).padStart(2, '0');
const LINES = [100, 92, 97, 88, 95, 76, 99, 90, 84];

function useWide() {
  const [wide, setWide] = useState(true);
  useEffect(() => { const m = matchMedia('(min-width: 901px)'); const f = () => setWide(m.matches); f(); m.addEventListener('change', f); return () => m.removeEventListener('change', f); }, []);
  return wide;
}

/* A title page, typeset: the hero deck and the reader use the same sheet. */
function Sheet({ x, lg }) {
  const hip = x.kind !== 'Papers';
  return (
    <div className={'xrs-sheet' + (hip ? ' hip' : '') + (lg ? ' lg' : '')}>
      <div className="xrs-sheet-top"><span>{hip ? 'hips.hanzo.ai' : 'papers.hanzo.ai'}</span><span>{hip ? x.kind : x.date}</span></div>
      <p className="xrs-sheet-t">{x.t}</p>
      <p className="xrs-sheet-s">{x.sub}</p>
      <p className="xrs-sheet-by">Hanzo AI</p>
      <div className="xrs-lines" aria-hidden="true">{LINES.slice(0, lg ? 9 : 7).map((w, i) => <i key={i} style={{ width: w + '%' }} />)}</div>
    </div>
  );
}

/* the small sheet on each row: what lifts off and opens */
const Mini = ({ x }) => (
  <span className={'xrs-mini' + (x.kind !== 'Papers' ? ' hip' : '')} aria-hidden="true">
    <i className="b" /><i className="t" /><i className="t s" /><i /><i /><i /><i />
  </span>
);

/* ---------- hero: the newest title pages, staged; the deck fans as you scroll and deals itself ---------- */
const FEATURED = PAPERS.slice(0, 6);

function Card({ x, k, fan }) {
  const kv = useSpring(k, { stiffness: 170, damping: 24, mass: 1 });
  useEffect(() => { kv.set(k); }, [k, kv]);
  const spread = (f) => 0.28 + 0.72 * f;
  const tx = useTransform(() => kv.get() * 28 * spread(fan.get()));
  const ty = useTransform(() => kv.get() * -14 * spread(fan.get()));
  const rot = useTransform(() => (kv.get() === 0 ? -1.5 : -1.5 + kv.get() * 2.4) * spread(fan.get()));
  const sc = useTransform(() => 1 - kv.get() * 0.035);
  const op = useTransform(() => Math.max(0, Math.min(1, 4.4 - kv.get())));
  return (
    <motion.a href={x.to} target="_blank" rel="noopener noreferrer" className="xrs-card" style={{ x: tx, y: ty, rotate: rot, scale: sc, opacity: op, zIndex: 10 - k }} tabIndex={k === 0 ? 0 : -1} aria-hidden={k !== 0}>
      <Sheet x={x} />
    </motion.a>
  );
}

function Hero() {
  const ref = useRef(null);
  const wide = useWide();
  const calm = useReducedMotion();
  const live = useInView(ref, { amount: 0.2 });
  const [top, setTop] = useState(0);
  const [mine, setMine] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const scrub = useTransform(scrollYProgress, [0, 0.75], [0, 1], { clamp: true });
  const one = useMotionValue(1);
  const staged = wide && !calm;
  const fan = staged ? scrub : one;
  const deckScale = useTransform(fan, [0, 1], staged ? [1.14, 1] : [1, 1]);
  const deckY = useTransform(fan, [0, 1], staged ? [24, 0] : [0, 0]);
  useEffect(() => {
    if (mine || calm || !live) return;
    const t = setTimeout(() => setTop((v) => (v + 1) % 6), 3400);
    return () => clearTimeout(t);
  }, [top, mine, calm, live]);
  const go = (d) => { setMine(true); setTop((v) => (v + d + 6) % 6); };
  return (
    <section ref={ref} className={'xrs-hero' + (staged ? ' staged' : '')} aria-labelledby="xrs-h1">
      <div className="xrs-hero-stick">
        <div className="pf-wrap pf-grid xrs-hero-g">
          <div className="xrs-hero-c">
            <p className="pf-kick">Research</p>
            <MaskLines as="h1" id="xrs-h1" className="pf-display xrs-h1" lines={['Work we', 'publish']} amount={0.1} />
            <p className="pf-lede xrs-lede">Hanzo builds infrastructure that has to hold up under audit, regulation and adversaries.</p>
            <div className="xrs-acts">
              <A to="https://papers.hanzo.ai" className="pf-btn solid" data-thumb="Explore papers.hanzo.ai">Explore papers.hanzo.ai ↗</A>
              <A to="https://hips.hanzo.ai" className="pf-btn">Specifications (HIPs) ↗</A>
              <A to="/benchmarks" className="pf-btn">Benchmarks</A>
            </div>
          </div>
          <div className="xrs-deck-w">
            <motion.div className="xrs-deck" style={{ scale: deckScale, y: deckY }}>
              {FEATURED.map((x, i) => <Card key={x.t} x={x} k={(i - top + 6) % 6} fan={fan} />)}
            </motion.div>
            <div className="xrs-deal">
              <button type="button" onClick={() => go(-1)} aria-label="Previous paper"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M10 3.5 5.5 8l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
              <div className="xrs-caps" aria-live={mine ? 'polite' : 'off'}>
                {FEATURED.map((x, i) => (
                  <p key={x.t} className="xrs-cap" hidden={i !== top}>
                    <span className="pf-mono">{pad(i + 1)} / 06</span>
                    <b>{x.t}</b>
                    <small>{x.date}. {x.sub}</small>
                  </p>
                ))}
              </div>
              <button type="button" onClick={() => go(1)} aria-label="Next paper"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M6 3.5 10.5 8 6 12.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- the library at a glance, and when it came out ---------- */
function Glance({ mon, pickMonth }) {
  return (
    <section className="pf-sec xrs-glance" aria-label="The library at a glance">
      <div className="pf-wrap pf-grid xrs-glance-g">
        <dl className="xrs-tally">
          {GROUPS.map(([k, , list]) => (
            <div key={k}>
              <dd className="pf-num">{list.length - (k === 'Specifications' ? 1 : 0)}</dd>
              <dt className="pf-mono">{k}</dt>
            </div>
          ))}
        </dl>
        <div className="xrs-when-w">
          <p className="pf-kick">When it was published</p>
          <div className="xrs-when" role="group" aria-label="When it was published">
            {MONTHS.map(([m, n]) => (
              <button key={m} type="button" aria-pressed={mon === m} onClick={() => pickMonth(mon === m ? null : m)} aria-label={`${m}: ${n} ${n === 1 ? 'paper' : 'papers'}`}>
                <span className="pf-mono xrs-when-n">{n}</span>
                <i aria-hidden="true"><b style={{ transform: `scaleY(${n / PEAK})` }} /></i>
                <span className="pf-mono xrs-when-m">{m}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- the index: a rail of kinds, an editorial list that re-flows, rows that open ---------- */
function Library({ mon, setMon, open, openKey }) {
  const [kind, setKind] = useState('All');
  const [q, setQ] = useState('');
  const t = q.trim().toLowerCase();
  const match = (it) => (!mon || it.date === mon) && (!t || (it.t + ' ' + it.sub + ' ' + (it.date || '')).toLowerCase().includes(t));
  const counts = useMemo(() => Object.fromEntries(GROUPS.map(([k, , l]) => [k, l.filter(match).length])), [t, mon]); // eslint-disable-line react-hooks/exhaustive-deps
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  return (
    <section className="pf-sec xrs-lib" id="papers">
      <div className="pf-wrap pf-grid xrs-lib-g">
        <aside className="xrs-rail" aria-label="Filter the library">
          <div className="xrs-kinds">
            {['All', ...GROUPS.map((g) => g[0])].map((k) => (
              <button key={k} type="button" aria-pressed={kind === k} onClick={() => setKind(k)}>
                <span>{k}</span><span className="pf-mono">{k === 'All' ? total : counts[k]}</span>
              </button>
            ))}
          </div>
          <label className="xrs-find">
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="m10.5 10.5 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find a paper or a HIP" aria-label="Find a paper or a HIP" />
          </label>
          {mon && <button type="button" className="xrs-mon" onClick={() => setMon(null)} aria-label={`Showing ${mon}. Show every month`}><span className="pf-mono">{mon}</span><svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg></button>}
        </aside>
        <div className="xrs-list">
          {GROUPS.map(([k, lede, list]) => {
            const shown = kind === 'All' || kind === k;
            const rows = list.filter(match);
            return (
              <motion.div key={k} layout="position" className="xrs-group" hidden={!shown || !rows.length} transition={{ duration: 0.5, ease: EASE }}>
                <div className="xrs-group-h">
                  <h2 className="pf-head">{k}</h2>
                  <p className="pf-body">{lede}</p>
                </div>
                <ol className={'xrs-rows ' + (k === 'Papers' ? 'p' : 'h')}>
                  {list.map((it, i) => {
                    const prev = list[i - 1];
                    const head = it.date && (!prev || prev.date !== it.date);
                    const id = key(it);
                    return (
                      <motion.li key={it.t} layout="position" hidden={!match(it)} className={head ? 'xrs-new' : ''} transition={{ duration: 0.45, ease: EASE }}>
                        <div className="xrs-row">
                          <button type="button" className="xrs-row-open" onClick={(e) => open(it, e.currentTarget)} aria-haspopup="dialog" aria-label={`Open the title page: ${it.t}`}>
                            <span className="xrs-row-d pf-mono">{it.date ? (head ? it.date : '') : pad(i)}</span>
                            <span className="xrs-thumb">
                              {openKey !== id && <motion.span layoutId={id} className="xrs-thumb-s" style={{ borderRadius: 4 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}><Mini x={it} /></motion.span>}
                            </span>
                            <span className="xrs-row-t"><b>{it.t}</b><span>{it.sub}</span></span>
                          </button>
                          <A to={it.to} className="xrs-row-go" aria-label={`${it.t} on ${it.kind === 'Papers' ? 'papers.hanzo.ai' : 'hips.hanzo.ai'}`}>
                            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M5 11 11 5M6 5h5v5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                          </A>
                        </div>
                      </motion.li>
                    );
                  })}
                </ol>
              </motion.div>
            );
          })}
          {!total && <p className="xrs-none">Nothing in the library by that name. <button type="button" onClick={() => { setQ(''); setMon(null); }}>Clear</button></p>}
        </div>
      </div>
    </section>
  );
}

/* the open title page: the row's sheet grows into it (shared layoutId), in a portal over the page */
function Reader({ it, close }) {
  const btn = useRef(null);
  useEffect(() => {
    const l = window.__lenis;
    l?.stop();
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    const t = setTimeout(() => btn.current?.focus(), 80);
    const k = (e) => { if (e.key === 'Escape') close(); };
    addEventListener('keydown', k);
    return () => { clearTimeout(t); removeEventListener('keydown', k); l?.start(); document.documentElement.style.overflow = prev; };
  }, [close]);
  const hip = it.kind !== 'Papers';
  return createPortal(
    <div className="xrs-reader" role="dialog" aria-modal="true" aria-label={it.t}>
      <motion.div className="xrs-reader-scrim" onClick={close} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.25 } }} transition={{ duration: 0.35 }} />
      <motion.div layoutId={key(it)} className="xrs-reader-sheet" style={{ borderRadius: 10 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
        <motion.div className="xrs-reader-in" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.16, duration: 0.3 } }} exit={{ opacity: 0, transition: { duration: 0.08 } }}>
          <Sheet x={it} lg />
        </motion.div>
      </motion.div>
      <motion.div className="xrs-reader-bar" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.4, ease: EASE } }} exit={{ opacity: 0, transition: { duration: 0.12 } }}>
        <A to={it.to} className="pf-btn solid">Read on {hip ? 'hips.hanzo.ai' : 'papers.hanzo.ai'} ↗</A>
        <button ref={btn} type="button" className="pf-btn" onClick={close}>Close</button>
      </motion.div>
    </div>,
    document.body,
  );
}

/* ---------- the close, in the one dark room ---------- */
function Open() {
  return (
    <SceneWipe className="xrs-open" label="Open source">
      <div className="pf-sec">
        <div className="pf-wrap pf-grid xrs-open-g">
          <MaskLines as="h2" className="pf-display xrs-open-h" lines={['Open', 'source']} />
          <div className="xrs-open-t">
            <p className="pf-lede">The systems described in these papers are open source. The cloud, the gateway, the agent runtime and the infrastructure around them are developed in the open at <A to="https://github.com/hanzoai">github.com/hanzoai</A>, and the platform pays the open-source authors whose work runs on it.</p>
            <A to="https://github.com/hanzoai" className="pf-btn solid">github.com/hanzoai</A>
          </div>
        </div>
      </div>
    </SceneWipe>
  );
}

export default function Research() {
  const [mon, setMon] = useState(null);
  const [open, setOpen] = useState(null); // { it, from }
  const pickMonth = (m) => {
    setMon(m);
    const el = document.getElementById('papers');
    if (m && el) { const y = el.getBoundingClientRect().top + scrollY - 40; window.__lenis ? window.__lenis.scrollTo(y) : scrollTo({ top: y, behavior: 'smooth' }); }
  };
  const close = useMemo(() => () => setOpen((o) => { const f = o?.from; setTimeout(() => f?.focus?.({ preventScroll: true }), 40); return null; }), []);
  return (
    <main className="xrs">
      <Hero />
      <Glance mon={mon} pickMonth={pickMonth} />
      <Library mon={mon} setMon={setMon} open={(it, from) => setOpen({ it, from })} openKey={open ? key(open.it) : null} />
      <Open />
      <AnimatePresence>{open && <Reader key={key(open.it)} it={open.it} close={close} />}</AnimatePresence>
    </main>
  );
}
