'use client';
// Persona: a researcher or engineer checking whether Hanzo's work holds up under scrutiny (arrives from a paper link, Benchmarks or the Research menu)
// Goal: find the paper, specification or standard they need and read it at its source
// CTA: Explore papers.hanzo.ai ↗ -> https://papers.hanzo.ai (hero, data-cta="research.hero", data-thumb) · each opened title page: Read on papers.hanzo.ai (data-cta="research.reader") · closing link: github.com/hanzoai (data-cta="research.close")
// Metric: cta_click on research.hero and research.reader (a papers.hanzo.ai or hips.hanzo.ai click), research.close for GitHub (MASTER: researchers, a GitHub click)
// Signature: word-light. The second screen is the open-source statement in the dark room, lighting word by word as it is read (each word brightens on its own stretch of the scroll, and dims again going back) (MOTION-MAP `word-light`). The desk of title pages and the opening title page stay as the hero's supporting moves.
// Beyond: "When it was published". The papers' own dates become a bar per month (each bar is a count of Hanzo's list, nothing more); press a month and the index narrows to what came out then.
/* Research. Its idea is the paper itself, typeset.
   A Story page on Hanzo's scale rhythm: the six newest title pages spread as a desk across the first screen (the one big thing) with a 52px headline over its lower left, one sheet lifting at a time and any sheet opening into its full title page; then, second, the open-source statement lighting word by word in the one dark room (the signature); the library at a glance (19 as the screen's moment), an editorial index that re-flows, every row opening the same way; deck easing only, nothing floating, every word legible with JavaScript off.
   One idea per screen, one big thing each: the desk (one sheet lifts within a second, then every few seconds; point at a
   sheet and it rises too, press it and it opens; a pause control stops the cycle), the statement in the dark room, the
   count of papers, the index (a rail of kinds and a search beside an editorial list).
   Motion: signature, the statement lighting word by word as it is read. Supporting: the desk and the open (a sheet or a
   row → its title page, 600 ms in-out), a line-mask cut-in on the h1 and the figures only, the month that follows your reading in the index rail. Idle: the desk lifting one sheet at a time (pausable). Pointer: rows fill from
   the left (400 ms), their sheet tilts 2°, bars and kinds fill. State: the list re-flows, the title page opens. Deck
   timings only (150 ms hover, 300 ms state, 400 ms moves, 600 ms open), no springs or overshoot. Ink only.
   Every word, date and link is Hanzo's. */
import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { A, More } from '../kit';
import MaskLines from './proof/MaskLines';
import SceneWipe from './proof/SceneWipe';
import LivePause, { usePause } from '../v2/LivePause';
import NoJs from '../NoJs';
import '../v2/ProofScale.css';
import '../v2/ProofRhythm.css';
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

/* ---------- hero: the six newest title pages spread as a desk; one lifts at a time; press one and it opens ---------- */
const FEATURED = PAPERS.slice(0, 6);
// where each sheet lies on the desk (% of the desk) and its tilt; the lower left stays clear for the headline
const OPEN = { duration: 0.6, ease: [0.4, 0, 0.2, 1] }; // Morph: 600 ms in-out
const LAY = [
  { x: 24, y: 2, r: -3 }, { x: 46, y: 12, r: 4 }, { x: 67, y: 3, r: -5 },
  { x: 56, y: 34, r: 5 }, { x: 0, y: 6, r: 5 }, { x: 14, y: 30, r: -4 },
];

function DeskSheet({ x, i, on, lay, hidden, pick, hold, open }) {
  const lid = 'desk-' + key(x);
  return (
    <div className="xrs-desk-s" data-on={on} style={{ '--x': lay.x + '%', '--y': lay.y + '%', '--r': lay.r + 'deg', zIndex: on ? 20 : 10 - i }}
      onPointerEnter={(e) => { if (e.pointerType === 'mouse') hold(i); }} onPointerLeave={(e) => { if (e.pointerType === 'mouse') hold(null); }}>
      <button type="button" className="xrs-desk-b" onFocus={() => pick(i)} onClick={(e) => open(x, e.currentTarget, lid)} aria-haspopup="dialog" aria-label={`Open the title page: ${x.t}`}>
        {hidden ? <span className="xrs-desk-ghost" /> : <motion.span layoutId={lid} className="xrs-desk-p" style={{ borderRadius: 8 }} transition={OPEN} aria-hidden="true"><Sheet x={x} /></motion.span>}
      </button>
    </div>
  );
}

function Hero({ open, openLid }) {
  const ref = useRef(null);
  const calm = useReducedMotion();
  const live = useInView(ref, { amount: 0.2 });
  const [top, setTop] = useState(0);
  const [mine, setMine] = useState(false);
  const [dealt, setDealt] = useState(false);
  const [paused, pause] = usePause();
  const [held, setHeld] = useState(false); // the pointer is on a sheet: it owns the desk until it leaves
  const [n, setN] = useState(6); // phones lay out three sheets, so the cycle walks three
  useEffect(() => {
    const m = matchMedia('(max-width: 900px)');
    const f = () => { setN(m.matches ? 3 : 6); setTop((v) => (m.matches ? v % 3 : v)); };
    f(); m.addEventListener('change', f);
    return () => m.removeEventListener('change', f);
  }, []);
  useEffect(() => {
    if (mine || held || calm || !live || paused) return;
    const t = setTimeout(() => { setTop((v) => (v + 1) % n); setDealt(true); }, dealt ? 1600 : 900); // the first lift within a second, then one every 1.6 s (each lift moves for 0.5 s)
    return () => clearTimeout(t);
  }, [top, mine, held, calm, live, dealt, paused, n]);
  const hold = (i) => { if (i === null) { setHeld(false); return; } setHeld(true); setTop(i); };
  const go = (d) => { setMine(true); setTop((v) => (v + d + n) % n); };
  const pick = (i) => { setMine(true); setTop(i); }; // a keyboard visitor takes the desk over
  return (
    <section ref={ref} className="xrs-hero" aria-labelledby="xrs-h1">
      <div className="xrs-desk">
        {FEATURED.map((x, i) => <DeskSheet key={x.t} x={x} i={i} on={i === top} lay={LAY[i]} hidden={openLid === 'desk-' + key(x)} pick={pick} hold={hold} open={open} />)}
      </div>
      <div className="pf-wrap pf-grid xrs-hero-g">
        <div className="xrs-hero-c">
          <MaskLines as="h1" id="xrs-h1" className="pf-display xrs-h1" lines={['Work we', 'publish']} amount={0.1} />
          <div className="xrs-hero-row">
            <p className="pf-mono xrs-cap-h">Research</p>
            <p className="pf-lede xrs-lede">Hanzo builds infrastructure that has to hold up under audit, regulation and adversaries.</p>
            <div className="xrs-acts">
              <A to="https://papers.hanzo.ai" className="pf-btn solid" data-thumb="Explore papers.hanzo.ai" data-cta="research.hero">Explore papers.hanzo.ai ↗</A>
              <A to="https://hips.hanzo.ai" className="xrs-more">Specifications (HIPs) ↗</A>
              <More to="/benchmarks">Benchmarks</More>
            </div>
          </div>
        </div>
        <div className="xrs-deal">
          <div className="xrs-caps" aria-live={mine ? 'polite' : 'off'}>
            {FEATURED.map((x, i) => (
              <p key={x.t} className="xrs-cap" hidden={i !== top}>
                <span className="pf-mono">{pad(i + 1)} / {pad(n)}</span>
                <b>{x.t}</b>
                <small>{x.date}. {x.sub}</small>
              </p>
            ))}
          </div>
          <div className="xrs-deal-b">
            <LivePause paused={paused} onToggle={pause} inline className="xrs-pause" />
            <button type="button" onClick={() => go(-1)} aria-label="Previous paper"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M10 3.5 5.5 8l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
            <button type="button" onClick={() => go(1)} aria-label="Next paper"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M6 3.5 10.5 8 6 12.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
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
          {GROUPS.map(([k, , list], i) => (
            <div key={k} className={i ? 'xrs-tally-s' : 'xrs-tally-b'}>
              <MaskLines as="dd" className={i ? 'pf-figure' : 'pf-moment xl'} lines={[String(list.length - (k === 'Specifications' ? 1 : 0))]} delay={i * 0.06} />
              <dt className="pf-mono">{k}</dt>
            </div>
          ))}
        </dl>
        <div className="xrs-when-w">
          <div className="xrs-when" role="group" aria-label="When it was published">
            {MONTHS.map(([m, n], j) => (
              <button key={m} type="button" className={j && when(MONTHS[j - 1][0]) - when(m) > 1 ? 'xrs-when-gap' : undefined} aria-pressed={mon === m} onClick={() => pickMonth(mon === m ? null : m)} aria-label={`${m}: ${n} ${n === 1 ? 'paper' : 'papers'}`}>
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
  const counts = useMemo(() => Object.fromEntries(GROUPS.map(([k, , l]) => [k, l.filter((it) => it.t !== 'All HIPs' && match(it)).length])), [t, mon]); // eslint-disable-line react-hooks/exhaustive-deps
  const [all, setAll] = useState(false); // the papers index opens on the newest six; Show all opens the rest
  const folded = !all && !t && !mon;
  const [now, setNow] = useState(PAPERS[0].date); // the month you are reading, shown in the rail
  const listRef = useRef(null);
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting && e.target.dataset.d) setNow(e.target.dataset.d); }), { rootMargin: '-45% 0px -50% 0px' });
    el.querySelectorAll('li[data-d]').forEach((li) => io.observe(li));
    return () => io.disconnect();
  }, [all, kind, t, mon]);
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
          <p className="xrs-now pf-mono" aria-hidden="true"><AnimatePresence mode="popLayout" initial={false}><motion.span key={now} initial={{ y: '105%' }} animate={{ y: 0 }} exit={{ y: '-105%' }} transition={{ duration: 0.3, ease: EASE }}>{now}</motion.span></AnimatePresence></p>
          {mon && <button type="button" className="xrs-mon" onClick={() => setMon(null)} aria-label={`Showing ${mon}. Show every month`}><span className="pf-mono">{mon}</span><svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg></button>}
        </aside>
        <div className="xrs-list" ref={listRef}>
          {GROUPS.map(([k, lede, list]) => {
            const shown = kind === 'All' || kind === k;
            const rows = list.filter(match);
            return (
              <motion.div key={k} layout="position" className="xrs-group" hidden={!shown || !rows.length} transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}>
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
                      <motion.li key={it.t} layout="position" hidden={!match(it) || (folded && k === 'Papers' && i >= 6)} data-d={it.date || undefined} className={head ? 'xrs-new' : ''} transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}>
                        <div className="xrs-row">
                          <button type="button" className="xrs-row-open" onClick={(e) => open(it, e.currentTarget)} aria-haspopup="dialog" aria-label={`Open the title page: ${it.t}`}>
                            <span className="xrs-row-d pf-mono">{it.date ? (head ? it.date : '') : pad(i)}</span>
                            <span className="xrs-thumb">
                              {openKey !== id && <motion.span layoutId={id} className="xrs-thumb-s" style={{ borderRadius: 4 }} transition={OPEN}><Mini x={it} /></motion.span>}
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
                {k === 'Papers' && folded && rows.length > 6 && <button type="button" className="xrs-all" onClick={() => setAll(true)}><span>Show all</span><span className="pf-mono">{rows.length}</span></button>}
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
function Reader({ it, lid, close }) {
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
      <motion.div className="xrs-reader-scrim" onClick={close} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] } }} transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }} />
      <motion.div layoutId={lid} className="xrs-reader-sheet" style={{ borderRadius: 10 }} transition={OPEN}>
        <motion.div className="xrs-reader-in" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.3, duration: 0.3, ease: [0, 0, 0.2, 1] } }} exit={{ opacity: 0, transition: { duration: 0.15 } }}>
          <Sheet x={it} lg />
        </motion.div>
      </motion.div>
      <motion.div className="xrs-reader-bar" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.4, ease: EASE } }} exit={{ opacity: 0, transition: { duration: 0.15 } }}>
        <A to={it.to} className="pf-btn solid" data-cta="research.reader">Read on {hip ? 'hips.hanzo.ai' : 'papers.hanzo.ai'} ↗</A>
        <button ref={btn} type="button" className="xrs-reader-x" onClick={close}>Close</button>
      </motion.div>
    </div>,
    document.body,
  );
}

/* ---------- the signature, the second screen, in the one dark room: the open-source statement lights word by word
   as it is read. Each word has its own short stretch of the scroll (about two words wide), so a reading head moves
   through the sentence: words ahead wait at white 22%, the word being read brightens, words behind stay lit. Scroll
   back and they dim again. ---------- */
const OPEN_A = 'The systems described in these papers are open source. The cloud, the gateway, the agent runtime and the infrastructure around them are developed in the open at';
const OPEN_B = ', and the platform pays the open-source authors whose work runs on it.';
function Word({ p, a, b, calm, children }) {
  const o = useTransform(p, [a, b], [0.22, 1]);
  // the same span on server and client; reduced motion only sets it fully visible (no different markup, no mismatch)
  return <motion.span className="xrs-w" style={{ opacity: calm ? 1 : o }}>{children}</motion.span>;
}
function Open() {
  const ref = useRef(null);
  const rm = useReducedMotion();
  const [calm, setCalm] = useState(false); // the server cannot know the setting: apply it after hydration, so markup matches
  useEffect(() => setCalm(!!rm), [rm]);
  // the statement itself is the target: it starts lighting as it enters and is whole by the time it sits mid-screen
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.88', 'end 0.58'] });
  const a = OPEN_A.split(' '), b = OPEN_B.slice(2).split(' ');
  const n = a.length + 1 + b.length;
  const W = (i, child) => <Word key={i} p={scrollYProgress} a={(i / n) * 0.94} b={((i + 2) / n) * 0.94} calm={calm}>{child}</Word>;
  const link = <A to="https://github.com/hanzoai">github.com/hanzoai</A>;
  return (
    <SceneWipe className="xrs-open" label="Open source">
      <div className="pf-sec">
        <div className="pf-wrap pf-grid xrs-open-g">
          <h2 className="pf-head xrs-open-h">Open source</h2>
          <p className="xrs-open-t" ref={ref}>
            {a.map((w, i) => W(i, w + ' '))}
            {W(a.length, <>{link}{', '}</>)}
            {b.map((w, i) => W(a.length + 1 + i, w + (i < b.length - 1 ? ' ' : '')))}
          </p>
          <div className="xrs-open-a"><A to="https://github.com/hanzoai" className="pf-btn solid" data-cta="research.close">github.com/hanzoai</A></div>
        </div>
      </div>
    </SceneWipe>
  );
}

export default function Research() {
  const [mon, setMon] = useState(null);
  const [open, setOpen] = useState(null); // { it, from, lid }
  const pickMonth = (m) => {
    setMon(m);
    const el = document.getElementById('papers');
    if (m && el) { const y = el.getBoundingClientRect().top + scrollY - 40; window.__lenis ? window.__lenis.scrollTo(y) : scrollTo({ top: y, behavior: 'smooth' }); }
  };
  const close = useMemo(() => () => setOpen((o) => { const f = o?.from; setTimeout(() => f?.focus?.({ preventScroll: true }), 40); return null; }), []);
  return (
    <main id="main" className="xrs pf-r">
      {/* JavaScript off: all six hero captions are listed, and nothing waits on a script to be seen */}
      <NoJs css=".xrs-w{opacity:1!important}.xrs-cap[hidden]{display:grid!important;visibility:visible!important}.xrs-caps{display:grid!important;gap:14px}.xrs-cap{grid-area:auto!important}.xrs-deal-b,.xrs-all,.xrs-now{display:none!important}.xrs-rows li[hidden]{display:block!important}" />
      <Hero open={(it, from, lid) => setOpen({ it, from, lid })} openLid={open ? open.lid : null} />
      <Open />
      <Glance mon={mon} pickMonth={pickMonth} />
      <Library mon={mon} setMon={setMon} open={(it, from) => setOpen({ it, from, lid: key(it) })} openKey={open ? open.lid : null} />
      <AnimatePresence>{open && <Reader key={open.lid} it={open.it} lid={open.lid} close={close} />}</AnimatePresence>
    </main>
  );
}
