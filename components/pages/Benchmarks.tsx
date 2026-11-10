'use client';
// Persona: a developer or technical buyer weighing models on accuracy, cost and speed (arrives from the header's Research menu, /models or a model page)
// Goal: see Hanzo's measured results, check how each number was taken, and start building
// CTA: Start on Hanzo Cloud -> https://platform.hanzo.ai (hero with the thumb bar, and the closing room)
// Metric: cta_click (data-cta="benchmarks.hero", "benchmarks.close")
// Signature: race (Live race). Right under the h1, lanes race in real time at Hanzo's real ratios, and the visitor picks what races: Zen 6's three builds prefilling or decoding the same tokens at their measured rates (the fastest takes one second), D-LSA against full attention at a chosen context length (8K to 10M, its measured speed-up), or the five agent CodeRace scenarios at their latencies' ratios. Each lane counts live and reads Hanzo's own figure at the finish.
// Frames (8 Nov, the home page's bar): every section reads in one 1470x801 frame and opens to the rest (tabs, folds, sheets, each benchmark's own page); every result has Hanzo's buying action beside it (Start on Hanzo Cloud, View Models & Pricing, the Go plan).
// Moments: the Zen 6 dark room opens like a curtain under a beam of light; Kai's sixteen tiles tilt in on a 3D hinge (both CSS scroll-driven, guarded).
// Beyond: Your suites. Tick the suites that look like your work and the board's summary re-adds itself for just those (how many Kai won, mean accuracy Kai against Jev), with the same arithmetic as Hanzo's eleven-suite mean.
/* Benchmarks, v2: a model launch told as a story (anthropic.com's launch pages, apple.com's chapters). One idea a
   screen; every full table, method and run opens in a sheet, so the page reads in figures and the detail is a press away.
   Supporting: the h1 alone cuts in from its line masks (the page's one reveal); Kai against Jev, the "try it" board whose
   eleven rows glide into their new order when you switch the metric, the view or the sort; plain chapters (no pinning,
   no scroll scrub). Order: statement and race, figures, Zen 6, the GPQA frontier, Enso, Kai, platform, methods, shelf.
   V2: 8/10 signature race: a live race under the h1 at the real ratios, visitor-picked (prefill, decode, D-LSA by context length, agent CodeRace); sticky stage, pinned chapters and scroll wipes removed; five entrances; sheets stay fixed and inert when closed.
   Every word and figure is Hanzo's (hanzo.ai/benchmarks and its research API). */
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, animate, useInView, useMotionValue, useMotionValueEvent, useReducedMotion, useTransform } from 'motion/react';
import { EASE } from '../ui';
import { A, More, Cta, DataTable, CodeBlock } from '../kit';
import MaskLines from '../v2/MaskLines';
import Sheet from './benchmarks/Sheet';
import ListDay from './bench/ListDay';
import NoJs from '../NoJs';
import '../v2/ProofScale.css';
import '../v2/ProofRhythm.css';
import * as D from './benchmarksData';
import './Benchmarks.css';
import { PLANS, checkout } from '../../lib/plans';

const SPRING = { duration: 0.3, ease: EASE }; // MASTER 3.1: ease-emphasis at 300ms, no springs
const API = 'https://api.hanzo.ai/v1/research/runs?org=hanzo';

/* ---------- small parts ---------- */
function useSeen(amount = 0.3) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount });
  return [ref, seen];
}


function Seg({ opts, val, set, id, label }) {
  const keys = (e) => {
    const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (!k) return;
    e.preventDefault();
    const n = (opts.indexOf(val) + k + opts.length) % opts.length;
    set(opts[n]);
    document.getElementById(id + '-' + n)?.focus();
  };
  return (
    <div className="xbm-seg" role="tablist" aria-label={label} onKeyDown={keys}>
      {opts.map((o, i) => (
        <button key={o} id={id + '-' + i} type="button" role="tab" aria-selected={val === o} tabIndex={val === o ? 0 : -1} onClick={() => set(o)}>
          {val === o && <motion.span layoutId={'seg-' + id} className="xbm-seg-bg" transition={SPRING} />}
          <span>{o}</span>
        </button>
      ))}
    </div>
  );
}

/* CSV, JSON and a link to this view: what Hanzo's boards offer, kept. */
function Tools({ name, rows, hash }) {
  const [ok, setOk] = useState(false);
  const save = (type) => {
    const cols = Object.keys(rows[0]);
    const body = type === 'csv'
      ? [cols.join(','), ...rows.map((r) => cols.map((c) => JSON.stringify(r[c] ?? '')).join(','))].join('\n')
      : JSON.stringify(rows, null, 2);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([body], { type: type === 'csv' ? 'text/csv' : 'application/json' }));
    a.download = `${name}.${type}`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  };
  const link = async () => {
    try { await navigator.clipboard.writeText(location.origin + location.pathname + location.search + '#' + hash); } catch { return; /* blocked: never claim it copied */ }
    setOk(true);
    setTimeout(() => setOk(false), 2000);
  };
  return (
    <div className="xbm-tools">
      <button type="button" onClick={() => save('csv')}><Down />CSV</button>
      <button type="button" onClick={() => save('json')}><Down />JSON</button>
      <button type="button" onClick={link}><svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><path d="M6.5 9.5l3-3M7 4.5l1-1a2.5 2.5 0 0 1 3.5 3.5l-1 1M9 11.5l-1 1A2.5 2.5 0 0 1 4.5 9l1-1" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg><span aria-live="polite">{ok ? 'Copied' : 'Copy link'}</span></button>
    </div>
  );
}
const Down = () => <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><path d="M8 2.5v8M4.5 7.5 8 11l3.5-3.5M3 13.5h10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;

/* A bar that measures itself out when it is reached (scaleX only). */
function Bar({ f, on, d = 0, tone = '' }) {
  return (
    <i className={'xbm-bar ' + tone} aria-hidden="true">
      <motion.b style={{ '--f': Math.max(0.004, Math.min(1, f)) }} initial={{ scaleX: 0 }} animate={{ scaleX: on ? Math.max(0.004, Math.min(1, f)) : 0 }} transition={{ duration: 0.5, ease: EASE, delay: d }} />
    </i>
  );
}

/* In-page anchors and shelf views stay in this tab (the kit's A sends anything not on hanzo.ai to a new one). */
function L({ to, ...p }) { return /^[#?]/.test(to) ? <a href={to} {...p} /> : <A to={to} {...p} />; }

const Chev = () => <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M6 3.5 10.5 8 6 12.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const Up = () => <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true"><path d="m5 12 7-7 7 7M12 19V5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>;

/* The kit's one table (DataTable), fed from header and row arrays; the caption names it in Hanzo's words. */
function Table({ head, rows, caption, className = '' }) {
  const cols = head.map((h, i) => ({ key: 'c' + i, label: h, num: i > 0 }));
  const objs = rows.map((r) => Object.fromEntries(r.map((c, i) => ['c' + i, c])));
  return <DataTable caption={caption} cols={cols} rows={objs} className={'xbm-dt ' + className} />;
}

/* A reading marker that walks the rows of a visual (first step 1.2s after it is seen, then one row every 1.8s), so each screen has one quiet live object.
   The lit row's band cross-fades in place (300ms ease-emphasis), so it never paints over a neighbour. Pointing at a row brings the marker to it (and the walk carries on from
   there); a press, or keyboard focus inside, holds it (WCAG 2.2.2 pause). Off screen and under reduced motion it rests. */
function useWalk(n, on = true, ms = 1800) {
  const ref = useRef(null);
  const vis = useInView(ref, { amount: 0.3 });
  const calm = useReducedMotion();
  const [hold, setHold] = useState(false);
  const [k, setK] = useState(0);
  const first = useRef(true);
  const live = on && vis && !hold && !calm && n > 1;
  useEffect(() => {
    if (!live) { first.current = true; return; }
    const t = setTimeout(() => { first.current = false; setK((v) => (v + 1) % n); }, first.current ? 1200 : ms);
    return () => clearTimeout(t);
  }, [k, live, n, ms]);
  const root = { onClick: () => setHold((h) => !h), onFocusCapture: () => setHold(true), onBlurCapture: () => setHold(false), 'data-step': k };
  const pick = (i) => ({ onPointerEnter: () => { first.current = true; setK(i); } });
  return [ref, calm ? -1 : k, root, pick];
}

/* A fold under a long list: the list shows its head, the press shows the rest (every row is in the HTML all along).
   It names only a count, so no words are added to Hanzo's. */
function Fold({ n, open, set, controls }) {
  return (
    <button type="button" className="xbm-fold" aria-expanded={open} aria-controls={controls} onClick={() => set(!open)}>
      <i aria-hidden="true"><svg viewBox="0 0 16 16" width="13" height="13"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg></i>
      <span className="x-mono">{open ? '−' : '+'}{n}</span>
    </button>
  );
}

/* The sheet's contents carry the page's scope (its colours and type), since a sheet lives outside the page. */
const In = ({ children }) => <div className="xbm-in">{children}</div>;

/* The buying action that stands beside every result, in Hanzo's own words: Start on Hanzo Cloud, and either the price
   list or the Go plan (go). */
function Buy({ id, go, className = '' }) {
  return (
    <div className={'xbm-buy ' + className}>
      <Cta to="https://platform.hanzo.ai" id={'benchmarks.' + id} size="sm">Start on Hanzo Cloud</Cta>
      {go
        ? <Cta to={checkout(PLANS.go.id)} kind="link" id={'benchmarks.' + id + '.go'}>{`Use every model here, Go is $${PLANS.go.price}/month`}</Cta>
        : <Cta to="/pricing" kind="link" id={'benchmarks.' + id + '.pricing'}>View Models &amp; Pricing</Cta>}
    </div>
  );
}

/* Tabs that fold a section into one frame: the chosen pane shows, the rest stay in the page as hidden="until-found"
   (set by hand, React treats hidden as a boolean), so Find in page and an address inside a folded pane open it. */
function Tabs({ id, label, tabs, className = '', aside }) {
  const [at, setAt] = useState(0);
  const panes = useRef([]);
  useEffect(() => {
    panes.current.forEach((el, i) => { if (!el) return; if (i === at) el.removeAttribute('hidden'); else el.setAttribute('hidden', 'until-found'); });
  }, [at]);
  useEffect(() => {
    const offs = panes.current.map((el, i) => { if (!el) return null; const f = () => setAt(i); el.addEventListener('beforematch', f); return () => el.removeEventListener('beforematch', f); });
    const open = () => {
      const h = decodeURIComponent(location.hash.slice(1)).replace(/"/g, '');
      if (!h) return;
      const k = panes.current.findIndex((el) => el && el.querySelector('[id="' + h + '"]'));
      if (k >= 0) setAt(k);
    };
    open();
    addEventListener('hashchange', open);
    return () => { offs.forEach((f) => f && f()); removeEventListener('hashchange', open); };
  }, []);
  const keys = (e) => {
    const k = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 1, ArrowUp: -1 }[e.key];
    if (!k) return;
    e.preventDefault();
    const n = (at + k + tabs.length) % tabs.length;
    setAt(n);
    document.getElementById(id + '-t' + n)?.focus();
  };
  return (
    <div className={'xbm-tabs ' + className}>
      <div className="xbm-tabs-h">
        <div className="xbm-tabs-l" role="tablist" aria-label={label} onKeyDown={keys}>
          {tabs.map((t, i) => (
            <button key={i} id={id + '-t' + i} type="button" role="tab" aria-selected={at === i} aria-controls={id + '-p' + i} tabIndex={at === i ? 0 : -1} onClick={() => setAt(i)}>
              {at === i && <motion.span layoutId={'xbm-tab-' + id} className="xbm-tabs-bg" transition={SPRING} />}
              <span className="xbm-tabs-t">{t.tab}</span>
            </button>
          ))}
        </div>
        {aside}
      </div>
      {tabs.map((t, i) => (
        <div key={i} ref={(el) => { panes.current[i] = el; }} role="tabpanel" id={id + '-p' + i} aria-labelledby={id + '-t' + i} hidden={i !== at} className="xbm-pane">{t.body}</div>
      ))}
    </div>
  );
}

/* ---------- the scatter: accuracy against cost, log axis, the frontier as a dashed step ---------- */
function Scatter({ pts, x0, x1, y0, y1, xt, yt, w = 640, h = 420, xLab, yLab, auto, labels, title, amount = 0.35, lead = 2200 }) {
  const P = { l: 44, r: 18, t: 16, b: 46 };
  // rounded: Math.log differs in the last digit between the server and the browser, which breaks hydration
  const X = (c) => Math.round((P.l + ((Math.log(c) - Math.log(x0)) / (Math.log(x1) - Math.log(x0))) * (w - P.l - P.r)) * 10) / 10;
  const Y = (a) => Math.round((h - P.b - ((a - y0) / (y1 - y0)) * (h - P.t - P.b)) * 10) / 10;
  const byCost = useMemo(() => pts.map((p, i) => ({ ...p, i })).sort((a, b) => a.cost - b.cost), [pts]);
  const front = useMemo(() => { let best = -1; return byCost.filter((p) => (p.acc > best ? ((best = p.acc), true) : false)); }, [byCost]);
  const d = front.map((p, i) => (i ? `H${X(p.cost).toFixed(1)}V${Y(p.acc).toFixed(1)}` : `M${X(p.cost).toFixed(1)} ${Y(p.acc).toFixed(1)}`)).join('') + `H${w - P.r}`;
  const [ref, seen] = useSeen(amount);
  const live = useInView(ref, { amount: 0.1 });
  const calm = useReducedMotion();
  const [act, setAct] = useState(null);
  const [mine, setMine] = useState(false);
  const [pause, setPause] = useState(false);
  const step = useRef(0);
  useEffect(() => {
    if (!auto || mine || pause || calm || !seen || !live) return;
    const t = setTimeout(() => { const p = byCost[step.current++ % byCost.length]; setAct(p.i); }, act === null ? lead : 1900);
    return () => clearTimeout(t);
  }, [auto, mine, pause, calm, seen, live, act, byCost]);
  const hold = (i) => { setMine(true); setAct(i); };
  return (
    <div className="xbm-sc" ref={ref}>
      <svg viewBox={`0 0 ${w} ${h}`} role="group" aria-label={title}>
        {yt.map((v) => <g key={v}><line x1={P.l} x2={w - P.r} y1={Y(v)} y2={Y(v)} className="xbm-grid" /><text x={P.l - 8} y={Y(v) + 4} textAnchor="end" className="xbm-tick">{v}</text></g>)}
        {xt.map(([v, l]) => <g key={l}><line x1={X(v)} x2={X(v)} y1={P.t} y2={h - P.b} className="xbm-grid v" /><text x={X(v)} y={h - P.b + 18} textAnchor="middle" className="xbm-tick">{l}</text></g>)}
        <text x={P.l} y={h - 6} className="xbm-axl">{xLab}</text>
        {yLab && <text x={12} y={P.t + 2} className="xbm-axl" transform={`rotate(-90 12 ${P.t + 2})`} textAnchor="end">{yLab}</text>}
        <motion.path d={d} className="xbm-front" initial={{ pathLength: 0 }} animate={{ pathLength: seen ? 1 : 0 }} transition={{ duration: 1.2, ease: EASE, delay: 0.3 }} />
        {byCost.map((p, k) => {
          const on = act === p.i, isF = front.includes(p);
          return (
            <g key={p.name} transform={`translate(${X(p.cost).toFixed(1)} ${Y(p.acc).toFixed(1)})`} className={'xbm-pt ' + p.kind + (isF ? ' f' : '') + (on ? ' on' : '')}>
              <motion.circle r={p.kind === 'router' ? 7.5 : 5} initial={{ scale: 0, opacity: 0 }} animate={seen ? { scale: 1, opacity: 1 } : {}} transition={{ duration: 0.3, ease: EASE, delay: 0.1 + k * 0.06 }} />
              <circle r="16" className="xbm-ring" />
              {labels && (p.kind === 'router' || isF) && <text x={p.lab ? p.lab[0] : p.kind === 'router' ? -12 : 9} y={p.lab ? p.lab[1] : p.kind === 'router' ? 4 : -9} textAnchor={p.lab ? p.lab[2] : p.kind === 'router' ? 'end' : 'start'} className="xbm-lab">{p.name}</text>}
              <circle r="15" className="xbm-hit" tabIndex={0} aria-label={p.aria} onPointerEnter={() => { setPause(true); setAct(p.i); }} onPointerLeave={() => { setPause(false); setAct(null); }} onFocus={() => hold(p.i)} onBlur={() => setAct(null)} onClick={() => hold(p.i)} />
            </g>
          );
        })}
      </svg>
      {/* every point's record is in the page; the one in reach reads in a band under the chart (nothing floats over it) */}
      {pts.map((p, i) => {
        return (
          <div key={p.name} className={'xbm-read' + (act === i ? ' on' : '')} aria-hidden={act !== i}>
            <b><span>{p.short || p.name + ' ' + p.acc.toFixed(1) + '%'}</span></b>
            <span>{p.line || p.aria}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- 1. Stage: the frontier starts huge under the headline and settles beside its caption ---------- */
const HEAD = [
  ['16 of 16', 'Decisions · Decision Suite tasks won · Kai vs Jev', 'Every task of the suite, its row linking its runs and how to re-run it.', '#decision-suite'],
  ['50% less', 'Cost · Input-token price · Kai vs Jev', '$0.021 against $0.042 per million input tokens, as each is billed. A price, not a cost per task.', '/pricing'],
  ['~3,665 tok/s', 'Speed · Prefill · Zen 6 on NVIDIA Grace-Blackwell', 'Decode ~70 tok/s · 141.2 tok/s with DFlash2 · 46.29× prefill & 78.57× decode at 1M context (99.8% KV pruned) · measured by Hanzo on Nov 4, 2026.', '#zen'],
];

const NOJS = '<style>.xbm-stage-aside>*{opacity:1!important;transform:none!important}.xbm-pt circle:first-child{opacity:1!important;transform:none!important}.xbm-bar b{transform:scaleX(var(--f))!important}.xbm-trk-bar b{transform:none!important}.xbm-ix-wrap{height:auto!important}.xbm-mb,.xbm-b477,.xbm-b477-l{opacity:1!important;transform:none!important}.xbm-facets{height:auto!important;opacity:1!important}.xbm-sc{padding-bottom:0!important}.xbm-read{position:static!important;display:block!important;opacity:1!important;transform:none!important;width:auto!important;max-width:none!important;margin:0!important;padding:6px 0!important;background:none!important;color:inherit!important;box-shadow:none!important;border-top:1px solid rgba(0,0,0,.08)}.xbm-read span{color:#6e6e73!important}</style>';

function Hero() {
  // the lede, meta and ask arrive after the h1 has cut in (same wait as MaskLines: the arrival curtain lifts first)
  const [inn, setInn] = useState(false);
  useEffect(() => {
    if (!document.documentElement.classList.contains('x-arriving')) { setInn(true); return; }
    const go = () => setInn(true);
    addEventListener('hz-arrived', go, { once: true });
    const t = setTimeout(go, 4000);
    return () => { removeEventListener('hz-arrived', go); clearTimeout(t); };
  }, []);
  return (
    <section className="xbm-sec xbm-hero" aria-labelledby="xbm-h1">
      {/* JS off: nothing that starts hidden or offset stays that way */}
      <NoJs css={NOJS} />
      <div className="pf-wrap xbm-stage-head" data-in={inn ? 'true' : undefined}>
          <div className="xbm-stage-hgrid">
            <MaskLines as="h1" id="xbm-h1" className="pf-display xbm-h1" lines={['Intelligence,', 'cost and speed,', 'each measured.']} amount={0.1} />
            <div className="xbm-stage-aside">
              <p className="xbm-lede">Zen 6 prefills ~3,665 tokens a second and decodes ~70 on NVIDIA Grace-Blackwell, measured Nov 4, 2026.</p>
              <p className="xbm-pill"><i aria-hidden="true" />Hanzo AI · Benchmarks · Last measured Oct 16, 2026</p>
              <div className="xbm-acts">
                <Cta to="https://platform.hanzo.ai" id="benchmarks.hero" thumb data-href="https://platform.hanzo.ai">Start on Hanzo Cloud</Cta>
                <a href="#enso" className="xbm-go">The results<Chev /></a>
                <a href="#all" className="xbm-go">Every benchmark<Chev /></a>
              </div>
            </div>
          </div>
      </div>
      {/* the scoreboard: the three headline results, each opening to its full numbers */}
      <Figures />
    </section>
  );
}

/* the signature: what was measured, raced live at its real ratios; the visitor picks what races (the race takes the
   stage, its five names stand beside it as the title) */
function RaceSec() {
  return (
    <section className="xbm-sec xbm-racesec" aria-label="Race">
      <RaceTrack />
    </section>
  );
}

/* ---------- the GPQA frontier: Enso's accuracy against cost, its points reading themselves ---------- */
function Frontier() {
  const reported = D.GPQA.filter((q) => q.kind === 'reported');
  return (
    <section className="xbm-sec xbm-front-s" aria-labelledby="xbm-front-h">
        <div className="pf-wrap xbm-stage-grid">
          <div className="xbm-stage-cap">
            <h2 className="pf-head" id="xbm-front-h">A New Pareto Frontier of Intelligence</h2>
            <p className="pf-body">GPQA Diamond challenges AI with 198 graduate-level science questions. See how Enso balances accuracy and cost across 1,000 answers.</p>
            <p className="xbm-src">
              <span className="xbm-key router">Enso</span><span className="xbm-key single">single model, same 198 questions</span><span className="xbm-key reported">reported:</span>
              {reported.map((q, i) => <span key={q.name}><A to={q.src}>{q.name}</A>{i < reported.length - 1 ? ', ' : ''}</span>)}
            </p>
            <p className="xbm-open"><More to="/benchmarks/gpqa">GPQA-Diamond</More></p>
            <Buy id="frontier" go />
          </div>
          <div className="xbm-stage-slot">
            <figure className="pf-obj xbm-stage-obj">
              <Scatter pts={D.GPQA} x0={0.7} x1={62} y0={74} y1={100} yt={[75, 80, 85, 90, 95, 100]} xt={[[1, '$1'], [3, '$3'], [10, '$10'], [30, '$30']]} w={640} h={400}
                xLab="cheaper ← $ per 1,000 questions → dearer" yLab="GPQA Diamond %" auto labels amount={0.3} lead={900} title="GPQA Diamond: accuracy against dollars per 1,000 questions" />
            </figure>
          </div>
        </div>
    </section>
  );
}

/* ---------- 2. the three figures, each a hero ---------- */
function Figures() {
  return (
    <div className="xbm-figs" aria-label="Benchmarks" role="group">
      <div className="pf-wrap">
        <ul className="xbm-figs-l">
          {HEAD.map(([v, k, d, to]) => (
            <li key={v}>
              <L to={to} className="xbm-fig">
                <span className="xbm-fig-v">{v}</span>
                <span className="xbm-fig-t"><b><span>{k}</span></b><span>{d}</span></span>
                <i aria-hidden="true"><span>→</span></i>
              </L>
            </li>
          ))}
        </ul>
        <p className="xbm-figs-cta"><Cta to={checkout(PLANS.go.id)} kind="link" id="benchmarks.figs">{`Use every model here, Go is $${PLANS.go.price}/month`}</Cta></p>
      </div>
    </div>
  );
}

/* ---------- the rail: products, scroll-spy, and a jump-to search ---------- */
const RAIL = [['zen', 'Zen 6'], ['enso', 'Enso'], ['kai', 'Kai'], ['harness', 'Agent harness'], ['platform', 'Agent platform'], ['methods', 'Methods'], ['all', 'Every benchmark']];
const JUMP = D.PAGES.flatMap(([prod, , list]) => list.map(([t, to]) => ({ t, to, prod })));

function Rail() {
  const [at, setAt] = useState('');
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const box = useRef(null);
  useEffect(() => {
    // scroll-spy reads just under the 116px stacked header + rail; dark tracks whether the Zen 6 room physically sits behind the 56px rail
    const io = new IntersectionObserver((es) => es.forEach((e) => (e.isIntersecting ? setAt(e.target.id) : setAt((a) => (a === e.target.id ? '' : a)))), { rootMargin: '-128px 0px -65% 0px' });
    RAIL.forEach(([id]) => { const el = document.getElementById(id); if (el) io.observe(el); });
    const zen = document.getElementById('zen');
    const syncDark = () => {
      if (!zen) return;
      const r = zen.getBoundingClientRect();
      setDark(r.top <= 126 && r.bottom >= 116);
    };
    syncDark();
    window.addEventListener('scroll', syncDark, { passive: true });
    window.addEventListener('resize', syncDark);
    const key = (e) => {
      if (e.key === '/' && !/input|textarea/i.test(document.activeElement?.tagName || '')) { e.preventDefault(); setOpen(true); }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', key);
    return () => { io.disconnect(); window.removeEventListener('scroll', syncDark); window.removeEventListener('resize', syncDark); window.removeEventListener('keydown', key); };
  }, []);
  useEffect(() => {
    if (!open) return;
    box.current?.querySelector('input')?.focus();
    const out = (e) => { if (!box.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('pointerdown', out);
    return () => document.removeEventListener('pointerdown', out);
  }, [open]);
  const hits = JUMP.filter((j) => (j.t + ' ' + j.prod).toLowerCase().includes(q.trim().toLowerCase()));
  return (
    <nav className={'xbm-rail' + (dark ? ' dark' : '')} aria-label="Benchmarks by product">
      <div className="pf-wrap xbm-rail-in">
        <ul className="xbm-rail-l">
          {RAIL.map(([id, t]) => (
            <li key={id}>
              <a href={'#' + id} aria-current={at === id ? 'true' : undefined}>
                {at === id && <motion.span layoutId="xbm-rail" className="xbm-rail-bg" transition={SPRING} />}
                <span>{t}</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="xbm-jump" ref={box}>
          <button type="button" aria-expanded={open} aria-controls="xbm-jump-p" onClick={() => setOpen((v) => !v)}>
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="m10.5 10.5 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            <span className="xbm-jump-t">Jump to a benchmark</span><kbd>/</kbd>
          </button>
          <AnimatePresence>
            {open && (
              <motion.div id="xbm-jump-p" className="xbm-jump-p" initial={{ opacity: 0, y: -6, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -4, transition: { duration: 0.15, ease: [0, 0, 0.2, 1] } }} transition={{ duration: 0.3, ease: EASE }}>
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Benchmark or product" aria-label="Jump to a benchmark"
                  onKeyDown={(e) => { if (e.key === 'Enter' && hits[0]) location.href = hits[0].to; }} />
                <ul>
                  {hits.slice(0, 9).map((j) => <li key={j.to}><A to={j.to}><span>{j.t}</span><small><span>{j.prod}</span></small></A></li>)}
                  {!hits.length && <li className="xbm-none">No benchmark by that name.</li>}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}

/* ---------- 3. Enso ---------- */
const LAB = { enso: [12, 5, 'start'], 'gpt-5.6-sol': [-4, -14, 'middle'], 'opus-5.5': [-6, 20, 'middle'] };

function Systems() {
  const [sort, setSort] = useState('Accuracy');
  const sys = useMemo(() => {
    const by = { Accuracy: (a, b) => b.n - a.n, 'Run cost': (a, b) => a.c - b.c, System: (a, b) => a.sys.localeCompare(b.sys) };
    return [...D.SYSTEMS].sort(by[sort]);
  }, [sort]);
  const [ref, seen] = useSeen(0.05);
  return (
    <div className="xbm-sys" ref={ref}>
      <div className="xbm-sys-head">
        <p className="xbm-p">GPQA Diamond · enso.gpqa_diamond, split test · every row a research run, read from api.hanzo.ai when the page opens · sorted by accuracy</p>
        <div className="xbm-bar-row tight"><span className="xbm-lbl">Sort</span><Seg id="sys" label="Sort systems" opts={['Accuracy', 'Run cost', 'System']} val={sort} set={setSort} /></div>
      </div>
      <div className="xbm-tw">
        <ol className="xbm-lb" aria-label="Every system on GPQA Diamond">
          <li className="xbm-lb-h" aria-hidden="true"><span>System</span><span>Accuracy</span><span>Correct</span><span>Run cost</span><span>Tag, date</span></li>
          {sys.map((s, i) => (
            <motion.li key={s.sys} layout transition={SPRING} className={'xbm-lb-r' + (s.sys.startsWith('enso') ? ' me' : '')}>
              <span className="xbm-lb-n"><em><span>{String(i + 1).padStart(2, '0')}</span></em><b><span>{s.sys}</span></b> <A to={s.run} className="xbm-run">run</A></span>
              <span className="xbm-lb-acc"><Bar f={(s.n / 198 - 0.5) / 0.5} on={seen} d={0.1 + i * 0.04} tone={s.sys.startsWith('enso') ? 'acc' : ''} /><b><span>{s.acc}</span></b></span>
              <span className="x-mono">{s.n} of 198</span>
              <span className="x-mono">{s.cost}</span>
              <span className="xbm-tag">{s.tag} · {s.date}</span>
            </motion.li>
          ))}
        </ol>
      </div>
      <p className="xbm-note">Each system&apos;s frontier run, else its v1 run, else its fill run: the three put the same prompts to a model. A run cost is the input and output tokens the run records at the price list&apos;s rate for its own model id, the router&apos;s included, at list prices, <ListDay />; a dash is a run that records no tokens, a model the list does not price, or a list that could not be read.</p>
    </div>
  );
}

function Enso() {
  const runs = D.RUNS.map((r) => ({ name: r.sys, acc: r.a, cost: r.c, kind: r.sys === 'enso' ? 'router' : 'single', aria: `${r.sys} ${r.acc} at ${r.cost}, ${r.tag} · ${r.date}${r.pareto ? ', Pareto-efficient' : ''}`, short: `${r.sys} · ${r.acc}`, lab: LAB[r.sys], line: `${r.cost} for the whole set · ${r.tag} · ${r.date}` }));
  return (
    <section className="xbm-sec xbm-enso" id="enso">
      <div className="pf-wrap xbm-enso-g">
        <div className="xbm-enso-copy">
          <h2 className="pf-head">Enso on the boards it was run on.</h2>
          <p className="xbm-cap">Enso · intelligence per dollar</p>
          <p className="pf-body">Accuracy against what the run cost at list prices, on a log axis, for each board where Enso’s router is on the frontier. Every point is a research run, read when the page opens, and its cost is the tokens it records on the whole question set at the price list’s rate for its own model id. The dashed line joins the runs no other run beats on both.</p>
          <div className="xbm-opens">
            <Sheet label="The 12 runs as a table" ghost kicker="GPQA Diamond · 12 runs" title="The frontier, one benchmark at a time" wide>
              <In>
                <Table caption="The 12 runs as a table" head={['System', 'Accuracy', 'Run cost', 'Tag, date', 'Pareto']} rows={D.RUNS.map((r) => [r.sys, r.acc, r.cost, <>{r.tag} · {r.date}</>, r.pareto ? 'yes' : ''])} />
                <p className="xbm-note">One benchmark at a time: the frontier is drawn only among runs of the same benchmark, never across two. Filled points are Pareto-efficient — no other run scores higher for less. Hanzo&apos;s router is the large point in the brightest ink, labelled in bold; the single models are grey. A run&apos;s cost is the input and output tokens it records on the whole question set at the price list&apos;s rate for its own model id, the router&apos;s included, at list prices, <ListDay />. Hover or tab to a point for its record.</p>
              </In>
            </Sheet>
            <Sheet label="Every system on GPQA Diamond" ghost title="Every system on GPQA Diamond" wide>
              <In><Systems /></In>
            </Sheet>
          </div>
          <Buy id="enso" go />
        </div>
        <figure id="frontier" className="pf-obj xbm-enso-obj">
          <figcaption className="xbm-obj-h">
            <span className="xbm-obj-t">The frontier, one benchmark at a time</span>
            <span className="xbm-lbl">Benchmark</span>
            <div className="xbm-seg" role="group" aria-label="Benchmark">
              <button type="button" aria-pressed="true"><span className="xbm-seg-bg" /><span>GPQA Diamond · 12 runs</span></button>
              <A to={API + '&benchmark=enso.livecodebench'} className="xbm-seg-out">LiveCodeBench · 12 runs ↗</A>
            </div>
          </figcaption>
          <Scatter pts={runs} x0={0.14} x1={16} y0={50} y1={96} yt={[50, 55, 60, 65, 70, 75, 80, 85, 90, 95]} xt={[[0.3, '$0.3'], [1, '$1'], [3, '$3'], [10, '$10']]} w={1000} h={460}
            xLab="LIST-PRICE COST OF THE WHOLE SET, $, LOG SCALE" labels title="GPQA Diamond, 12 runs: accuracy against list-price cost of the whole set" />
          <div className="xbm-obj-f">
            <Tools name="enso-gpqa-frontier" hash="frontier" rows={D.RUNS.map(({ sys, acc, cost, tag, date, pareto }) => ({ system: sys, accuracy: acc, run_cost: cost, tag, date, pareto: pareto ? 'yes' : '' }))} />
          </div>
        </figure>
      </div>
    </section>
  );
}

/* ---------- 4. Kai: sixteen of sixteen ---------- */
function Duel({ r, i }) {
  const [ref, seen] = useSeen(0.4);
  const runs = r.runs ? [['kai-1.4 run', D.runUrl(r.runs[0])], ['Jev run', D.runUrl(r.runs[1])], ['re-run', r.re]] : D.COST_LINKS;
  return (
    <li ref={ref} className="xbm-duel">
      <div className="xbm-duel-t">
        <span className="xbm-duel-n">{String(i + 1).padStart(2, '0')}</span>
        <div>
          <b><span>{r.t}</span></b>
          {r.data && <span className="xbm-duel-d">{r.data.map(([t, to], k) => <A key={t} to={to}>{t}{k < r.data.length - 1 ? ' · ' : ''}</A>)}</span>}
          {r.line && <span className="xbm-duel-d">{r.line}</span>}
          {r.note && <span className="xbm-duel-note">{r.note}</span>}
        </div>
      </div>
      <div className="xbm-duel-v">
        <span className="xbm-who">Kai</span><Bar f={r.bars[0]} on={seen} d={0.15} tone="acc" /><b><span>{r.kai}</span></b>
        <span className="xbm-who">Jev</span><Bar f={r.bars[1]} on={seen} d={0.25} /><b className="j"><span>{r.jev}</span></b>
      </div>
      <div className="xbm-duel-l">{runs.map(([t, to]) => <A key={t} to={to}>{t}</A>)}</div>
    </li>
  );
}

function Kai() {
  const [ref, seen] = useSeen(0.25);
  const [all, setAll] = useState(false);
  return (
    <section className="xbm-sec xbm-kai" id="kai">
      <div className="pf-wrap xbm-kai-g">
        <div className="xbm-kai-copy" id="decision-suite">
          <h2 className="pf-head xbm-kai-h">Kai wins 16 of 16 tasks of the Decision Suite against Jev.</h2>
          <p className="xbm-cap">Kai · decisions</p>
          <p className="pf-body">Each task was fixed on 2026-10-15. The frozen harness&apos;s suites Kai leads are below.</p>
          <div className="xbm-opens">
            <Sheet id="xbm-suite-b" label="Decision Suite" ghost title="Decision Suite: Kai wins 16 of 16 tasks against Jev" wide>
              <In>
                <div className="xbm-duel-h" aria-hidden="true"><span>Task</span><span>Kai / Jev</span><span>Runs</span></div>
                <ol className="xbm-duels">{D.SUITE.map((r, i) => <Duel key={r.t} r={r} i={i} />)}</ol>
                <p className="xbm-note">Accuracy unless a row names its measure; the same questions to both models. Each row names its data and links its runs.</p>
                <p className="xbm-rerun"><span>Re-run any row</span><More to="https://github.com/hanzoai/benchmarks/blob/main/decision/SUITE.md">hanzoai/benchmarks decision/SUITE.md</More></p>
              </In>
            </Sheet>
          </div>
          <Buy id="kai" />
        </div>
        <div className="xbm-kai-vis">
        <button type="button" className="pf-figure xbm-kai-n" aria-expanded={all} aria-controls="xbm-tiles" onClick={() => setAll((v) => !v)}>16 of 16</button>
        <ol id="xbm-tiles" className={'xbm-tiles' + (all ? ' all' : '')} ref={ref} aria-label="Decision Suite, Kai against Jev">
          {D.SUITE.map((r, i) => (
            <li key={r.t} className="xbm-tile">
              {/* a tile opens the suite's sheet: every row, its data, its runs and how to re-run it */}
              <button type="button" className="xbm-tile-b" aria-haspopup="dialog" onClick={() => document.getElementById('xbm-suite-b')?.click()}>
                <span className="xbm-tile-t">{r.t}</span>
                <span className="xbm-tile-v"><b><span>{r.kai}</span></b><span className="j">{r.jev}</span></span>
                <Bar f={r.bars[0]} on={seen} d={0.05 + i * 0.035} tone="acc" />
                <Bar f={r.bars[1]} on={seen} d={0.1 + i * 0.035} />
              </button>
            </li>
          ))}
        </ol>
        <Fold n={D.SUITE.length - 8} open={all} set={setAll} controls="xbm-tiles" />
        </div>
      </div>
    </section>
  );
}

/* ---------- 5. the board: try it ---------- */
const fmtE = (v) => v.toFixed(4);
/* each suite's own page (the index's Kai list), so a row opens to its full numbers */
const kaiPage = (t) => (D.PAGES.find(([p]) => p === 'Kai')?.[2].find(([n]) => t === n || t.startsWith(n + ',')) || [])[1];
function Board() {
  const [metric, setMetric] = useState('Accuracy');
  const [view, setView] = useState('Chart');
  const [sort, setSort] = useState('Largest lead');
  const [mine, setMine] = useState([]);
  const pickS = (t) => setMine((m) => (m.includes(t) ? m.filter((x) => x !== t) : [...m, t]));
  const sub = D.BOARD.filter((b) => mine.includes(b.t));
  const avg = (k) => (Math.floor((sub.reduce((a, b) => a + b[k], 0) / sub.length) * 10) / 10).toFixed(1); // Hanzo's 84.4 is 84.46 cut, not rounded
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    if (q.get('metric') === 'ece') setMetric('Calibration error');
    if (q.get('view') === 'table') setView('Table');
    const s = { kai: 'Kai', jev: 'Jev', name: 'Name' }[q.get('sort')];
    if (s) setSort(s);
  }, []);
  // the view is kept in the address, as on Hanzo's board
  const keep = (k, v, dflt) => { const q = new URLSearchParams(location.search); v === dflt ? q.delete(k) : q.set(k, v); const s = q.toString(); history.replaceState(null, '', location.pathname + (s ? '?' + s : '') + location.hash); };
  const setM = (v) => { setMetric(v); keep('metric', v === 'Accuracy' ? '' : 'ece', ''); };
  const setV = (v) => { setView(v); keep('view', v.toLowerCase(), 'chart'); };
  const setS = (v) => { setSort(v); keep('sort', { 'Largest lead': '', Kai: 'kai', Jev: 'jev', Name: 'name' }[v], ''); };
  const ece = metric !== 'Accuracy';
  const rows = useMemo(() => {
    const r = D.BOARD.map((b) => ({ ...b, kv: ece ? b.ke : b.k, jv: ece ? b.je : b.j, gap: ece ? b.je - b.ke : b.l }));
    const dir = ece ? 1 : -1;
    const by = { 'Largest lead': (a, b) => b.gap - a.gap, Kai: (a, b) => dir * (a.kv - b.kv), Jev: (a, b) => dir * (a.jv - b.jv), Name: (a, b) => a.t.localeCompare(b.t) };
    return r.sort(by[sort]);
  }, [ece, sort]);
  const max = ece ? 0.5 : 100;
  const [ref, seen] = useSeen(0.15);
  const [all, setAll] = useState(false);
  const [wref, w, whold, wpick] = useWalk(all ? D.BOARD.length : 5);
  return (
    <section className="xbm-sec xbm-lead" aria-labelledby="xbm-lead-h">
      <div className="pf-wrap">
        <div className="xbm-board" id="leaderboard" ref={ref}>
          <div className="xbm-board-head">
            <div>
              <h2 className="pf-head" id="xbm-lead-h">Kai against Jev, suite by suite</h2>
              <p className="xbm-cap">Leaderboard</p>
              <p className="pf-body">The suites Kai leads, both models on the same questions, each row dated by its runs. Sort by the lead, switch to calibration error, draw it as a chart or a table; the view is kept in the address, and the rows are read from the research API when the page opens.</p>
            </div>
            <div className="xbm-won">
              <span className="pf-figure">11</span>
              <p className="xbm-won-k"><b><span>Suites won · Kai vs Jev</span></b> <span>AG News, DAIR Emotion, Banking77, Support triage, Email spam, Phishing, Toxicity, RAG relevance, Model routing, Typed decisions, MASSIVE, 51 languages. Every row a research run of kai-1.4 and of Jev on the same questions; mean accuracy across these 11 suites 84.4% against 76.6%.</span></p>
              <Sheet label="Evidence behind the rows" ghost title="Evidence behind the rows" wide>
                <In><Evidence /></In>
              </Sheet>
            </div>
            <Buy id="board" />
          </div>
          <div className="xbm-board-main">
          <div className="xbm-ctl">
            <span className="xbm-lbl">Metric</span><Seg id="m" label="Metric" opts={['Accuracy', 'Calibration error']} val={metric} set={setM} />
            <span className="xbm-lbl">View</span><Seg id="v" label="View" opts={['Chart', 'Table']} val={view} set={setV} />
            <span className="xbm-lbl">Sort</span><Seg id="s" label="Sort" opts={['Largest lead', 'Kai', 'Jev', 'Name']} val={sort} set={setS} />
            <Tools name={'kai-vs-jev-' + (ece ? 'ece' : 'accuracy')} hash="leaderboard" rows={rows.map((r) => ({ suite: r.t, kai: ece ? fmtE(r.ke) : r.kai, jev: ece ? fmtE(r.je) : r.jev, lead: ece ? fmtE(r.je - r.ke) : r.lead, kai_ended: '2026-10-16', jev_ended: '2026-09-25' }))} />
          </div>
          <p className="xbm-sum" aria-live="polite">
            {sub.length ? <><b className="x-mono"><span>{sub.filter((b) => b.l > 0).length}</span></b> of {sub.length} {sub.length === 1 ? 'suite' : 'suites'} you ticked won · mean accuracy across them <b className="x-mono"><span>{avg('k')}%</span></b> against <span className="x-mono">{avg('j')}%</span> <button type="button" className="xbm-all" onClick={() => setMine([])}>All 11</button></>
              : <><b className="x-mono"><span>11</span></b> suites won · mean accuracy across these 11 suites <b className="x-mono"><span>84.4%</span></b> against <span className="x-mono">76.6%</span></>}
          </p>
          {ece && <p className="xbm-ece">Calibration error (ECE): lower is better.</p>}
          <ol ref={wref} {...whold} id="xbm-rows" className={'xbm-rows xbm-turn s' + (w & 1) + ' ' + view.toLowerCase() + (all ? ' all' : '')} aria-label={'Kai against Jev, ' + metric}>
            {rows.map((r, i) => {
              const win = r.gap > 0;
              return (
                <motion.li key={r.t} layout transition={SPRING} className={'xbm-row xbm-w' + (w === i ? ' lit' : '')} {...wpick(i)}>
                  <span className="xbm-row-t"><button type="button" className="xbm-mine" aria-pressed={mine.includes(r.t)} aria-label={'Count ' + r.t + ' as my kind of work'} onClick={() => pickS(r.t)}><i aria-hidden="true" /></button><em className="x-mono"><span>{String(i + 1).padStart(2, '0')}</span></em><span>{kaiPage(r.t) ? <A to={kaiPage(r.t)} className="xbm-row-a"><b><span>{r.t}</span></b></A> : <b><span>{r.t}</span></b>}<small><span>Kai Oct 16, 2026 · Jev Sep 25, 2026</span></small></span></span>
                  <span className="xbm-row-bars">
                    <span className="xbm-who">Kai</span><Bar f={r.kv / max} on={seen} d={0.05 + i * 0.03} tone="acc" /><b className="x-mono"><span>{ece ? fmtE(r.ke) : r.kai}</span></b>
                    <span className="xbm-who">Jev</span><Bar f={r.jv / max} on={seen} d={0.1 + i * 0.03} /><b className="x-mono j"><span>{ece ? fmtE(r.je) : r.jev}</span></b>
                  </span>
                  <span className="xbm-row-lead x-mono">{ece ? (r.ke - r.je > 0 ? '+' : '−') + fmtE(Math.abs(r.ke - r.je)) : r.lead}</span>
                  <span className={'xbm-win' + (win ? '' : ' no')}>{win ? <><Up />Win</> : 'Jev lower'}</span>
                </motion.li>
              );
            })}
          </ol>
          <Fold n={D.BOARD.length - 5} open={all} set={setAll} controls="xbm-rows" />
          <ul className="xbm-foot">
            <li>Every cell a research run of kai-1.4 and of Jev, on the same questions.</li>
            <li>Accuracy: higher is better; a lead is in percentage points.</li>
            <li>Suites measure different tasks, so their rows are compared within a row, not across.</li>
          </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

const SRC = (what, extra) => `api.hanzo.ai/v1/research/runs?org=hanzo · ${what} · Kai kai-1.4@c1856a77 · ${extra} · measured 2026-10-16`;
const EVID = ['Ahead of Jev at 4, 16 and 77 options', 'The same request, answered three times', 'The frozen harness, the suites Kai leads', 'The languages of the multilingual suite Kai leads on'];

function Evidence() {
  const [at, setAt] = useState(0);
  const [ref, seen] = useSeen(0.05);
  return (
    <div className="xbm-ev" ref={ref}>
      <div className="xbm-ev-tabs" role="tablist" aria-label="Evidence behind the rows">
        {EVID.map((t, i) => (
          <button key={t} type="button" role="tab" id={'xbm-ev-' + i} aria-selected={at === i} aria-controls={'xbm-evp-' + i} onClick={() => setAt(i)}>
            <span className="x-mono">{String(i + 1).padStart(2, '0')}</span><span>{t}</span>
            {at === i && <motion.i layoutId="xbm-ev" className="xbm-ev-bar" transition={SPRING} />}
          </button>
        ))}
      </div>
      <div className="xbm-ev-panes">
        {/* every panel stays in the page; the chosen one is shown */}
        <div role="tabpanel" id="xbm-evp-0" aria-labelledby="xbm-ev-0" hidden={at !== 0} className="xbm-ev-p">
          <p className="xbm-cap">Every option scored</p>
          <Table caption="Every option scored" head={['Measure', 'Kai', 'Jev']} rows={D.CHOICE.map(([m, k, j]) => [m, <b key="k"><span>{k}</span></b>, j])} />
          <p className="xbm-note">The same cases to both. Kai measured on CPU F32-Q8_0 (evo), the device production answers on.</p>
          <p className="xbm-srcl"><span>Source</span><A to={API}>{SRC('capability', 'commit 9492aa5')}</A></p>
        </div>
        <div role="tabpanel" id="xbm-evp-1" aria-labelledby="xbm-ev-1" hidden={at !== 1} className="xbm-ev-p">
          <p className="xbm-ev-k">Requests whose three answers are identical</p>
          <div className="xbm-big2">
            <div><span>Kai</span><b><span>100.0%</span></b><Bar f={1} on={seen && at === 1} tone="acc" /></div>
            <div><span>Jev</span><b className="j"><span>44.2%</span></b><Bar f={0.442} on={seen && at === 1} d={0.1} /></div>
          </div>
          <p className="xbm-note">Every request of the decision-hijack suite sent three times to each model; identical when all three agree on the decision and its probabilities. Kai on CPU, the device production answers on; Jev through its API.</p>
          <p className="xbm-srcl"><span>Source</span><A to={API}>{SRC('stability', 'commit 9492aa5')}</A></p>
        </div>
        <div role="tabpanel" id="xbm-evp-2" aria-labelledby="xbm-ev-2" hidden={at !== 2} className="xbm-ev-p">
          <p className="xbm-ev-k">The frozen harness: Kai leads Jev on 11 suites</p>
          <Table caption="The frozen harness: Kai leads Jev on 11 suites" head={['Suite', 'Kai', 'Jev']} rows={[...D.BOARD.map((b) => [b.t, b.kai, b.jev]), ['Mean, these 11 suites', <b key="m"><span>84.4%</span></b>, '76.6%']]} />
          <p className="xbm-note">The suites of the frozen harness Kai leads, each a research run of kai-1.4 and of Jev on the same questions.</p>
          <p className="xbm-srcl"><span>Source</span><A to="https://github.com/hanzoai/benchmarks/tree/5f616dd13167bc407bd1a56645c0982f297e9e4a/decision">{SRC('harness', 'harness 5f616dd')}</A></p>
        </div>
        <div role="tabpanel" id="xbm-evp-3" aria-labelledby="xbm-ev-3" hidden={at !== 3} className="xbm-ev-p">
          <p className="xbm-ev-k">MASSIVE: ahead of Jev on 31 languages</p>
          <ul className="xbm-langs" aria-label="Language, Kai, Jev">
            {D.MASSIVE.map(([l, k, j]) => (
              <li key={l}><b><span>{l}</span></b><span className="x-mono">{k.toFixed(1)}%</span><span className="x-mono j">{j.toFixed(1)}%</span><i aria-hidden="true"><em style={{ width: k + '%' }} /><em className="j" style={{ width: j + '%' }} /></i></li>
            ))}
          </ul>
          <p className="xbm-note"><span>The languages of the multilingual suite Kai leads, each as MASSIVE names it, the same questions to both.</span> <span className="x-sr">Language</span></p>
        </div>
      </div>
    </div>
  );
}

function PairPanel({ t, to, foot, rows, a = 'BM25', b = 'shortlist', paired, on, lit = -1, litId, pick }) {
  const [ref, seen] = useSeen(0.35);
  const go = on ?? seen;
  const max = Math.max(...rows.flatMap((r) => (paired ? [r[1], r[3]] : [r[1], r[2]])), 1);
  return (
    <div className="xbm-pp" ref={ref}>
      <p className="xbm-pp-t">{to ? <L to={to}>{t}</L> : t}</p>
      <ul>
        {rows.map((r, i) => {
          const [la, va, lb, vb] = paired ? r : [`${r[0]}, ${a}`, r[1], `${r[0]}, ${b}`, r[2]];
          return (
            <li key={la} className={pick ? 'xbm-w' + (lit === i ? ' lit' : '') : undefined} {...(pick ? pick(i) : {})}>
              <span>{la}</span><Bar f={va / max} on={go} d={i * 0.08} /><b className="x-mono j"><span>{va.toFixed(1)}</span></b>
              <span>{lb}</span><Bar f={vb / max} on={go} d={0.1 + i * 0.08} tone="acc" /><b className="x-mono"><span>{vb.toFixed(1)}</span></b>
            </li>
          );
        })}
      </ul>
      <p className="xbm-pp-f">{foot}</p>
    </div>
  );
}

function ToolTable({ x }) {
  return (
    <div className="xbm-tool">
      {x.h && <h4>{x.h}</h4>}
      <p className="xbm-note">{x.note}</p>
      <Table caption={x.h || x.note} head={['Handler', 'What decides', ...x.cols, 'Median time']} rows={x.rows} />
      <p className="xbm-runl">Research runs of <code>{x.bench}</code> on split <code>{x.split}</code>, ended <code>2026-10-15</code>; the current handler at commit <code>863cb8a</code>: <A to={`${API}&benchmark=${x.bench}`}>GET /v1/research/runs?org=hanzo&amp;benchmark={x.bench}</A></p>
    </div>
  );
}

/* ---------- 6. Kai, beyond the suites: seven pinned chapters ---------- */
const pct = (s) => { const m = String(s).match(/\(([\d.]+)%\)/); return m ? parseFloat(m[1]) : 0; };

function VisYesNo({ on }) {
  const [ref, w, hold, pick] = useWalk(D.YESNO.length, on);
  return (
    <div className={'pf-obj xbm-vis xbm-turn s' + (w & 1)} ref={ref} {...hold}>
      <ul className="xbm-yn">
        {D.YESNO.map(([t, k, j], i) => (
          <li key={t} className={'xbm-w' + (w === i ? ' lit' : '')} {...pick(i)}>
            <span className="xbm-yn-t">{t}</span>
            <span className="xbm-yn-k"><span className="xbm-who">Kai</span><b><span>{k}</span></b></span>
            <span className="xbm-yn-j"><span className="xbm-who">Jev</span><b className="x-mono"><span>{j}</span></b></span>
          </li>
        ))}
      </ul>
    </div>
  );
}
function VisTrolley({ on }) {
  const who = [['Kai', 'acc'], ['Jev', ''], ['GPT-6 Luna', 'pale']];
  const [ref, w, hold, pick] = useWalk(D.TROLLEY.length, on);
  return (
    <div className={'pf-obj xbm-vis xbm-turn s' + (w & 1)} ref={ref} {...hold}>
      <p className="xbm-vis-h"><span>Check · lower is better</span></p>
      <ul className="xbm-tr">
        {D.TROLLEY.map((r, i) => (
          <li key={r[0]} className={'xbm-w' + (w === i ? ' lit' : '')} {...pick(i)}>
            <span className="xbm-tr-t">{r[0]}</span>
            {who.map(([w, tone], k) => (
              <span key={w} className="xbm-tr-r"><span className="xbm-who">{w}</span><Bar f={pct(r[k + 1]) / 100} on={on} d={i * 0.12 + k * 0.06} tone={tone} /><b className={'x-mono' + (k ? ' j' : '')}><span>{r[k + 1]}</span></b></span>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
}
function VisShort() {
  const n = D.SHORTLIST.reduce((a, x) => a + x.rows.length, 0);
  const [ref, w, hold, pick] = useWalk(n);
  let o = 0;
  return (
    <div className={'xbm-vis-pp s' + (w & 1)} ref={ref} {...hold}>
      {D.SHORTLIST.map((s) => { const off = o; o += s.rows.length; return <PairPanel key={s.t} t={s.t} to="#shortlist" foot={s.foot} rows={s.rows} lit={w - off} pick={(i) => pick(off + i)} />; })}
    </div>
  );
}
function VisCode({ on }) {
  const [ref, w, hold, pick] = useWalk(D.SETTLED.length, on);
  return (
    <div className={'pf-obj xbm-vis xbm-vis-code xbm-turn s' + (w & 1)} ref={ref} {...hold}>
      <span className="pf-moment">3.02×</span>
      <p className="xbm-vis-k"><b><span>faster on the 42 tasks both solved</span></b> <span>95% interval 2.06–4.36×.</span></p>
      <ul className="xbm-set">
        {D.SETTLED.map((r, i) => <li key={r[0]} className={'xbm-w' + (w === i ? ' lit' : '')} {...pick(i)}><span>{r[0]}</span><Bar f={parseFloat(r[2]) / 8.22} on={on} d={i * 0.1} tone={i ? '' : 'acc'} /><b className="x-mono"><span>{r[2]}</span></b></li>)}
      </ul>
    </div>
  );
}
function VisTools() {
  const [ref, w, hold, pick] = useWalk(D.TOOLS.length);
  return (
    <ul className={'xbm-vis-tools s' + (w & 1)} ref={ref} {...hold}>
      {D.TOOLS.map((x, i) => (
        <li key={x.split} className={'pf-obj xbm-w' + (w === i ? ' lit' : '')} {...pick(i)}>
          <span className="xbm-lbl">{x.bench} · {x.split}</span>
          <b><span>{x.h || x.note}</span></b>
          <span className="xbm-vt-r"><span>{x.rows[0][0]} · {x.rows[0][1]}</span><b className="x-mono"><span>{x.rows[0][2]}</span></b></span>
          <span className="xbm-vt-r j"><span>{x.rows[1][0]} · {x.rows[1][1]}</span><b className="x-mono"><span>{x.rows[1][2]}</span></b></span>
          <small><span>{x.cols[0]}</span></small>
        </li>
      ))}
    </ul>
  );
}
function VisPrice({ on }) {
  const [ref, w, hold, pick] = useWalk(2, on);
  return (
    <div className={'pf-obj xbm-vis xbm-vis-price xbm-turn s' + (w & 1)} ref={ref} {...hold}>
      <p className="xbm-lbl">Input-token price · Kai vs Jev</p>
      <div className={'xbm-pr xbm-w' + (w === 0 ? ' lit' : '')} {...pick(0)}><span className="xbm-who">Kai</span><Bar f={0.5} on={on} tone="acc" /><b className="x-mono"><span>$0.021 / M</span></b></div>
      <div className={'xbm-pr xbm-w' + (w === 1 ? ' lit' : '')} {...pick(1)}><span className="xbm-who">Jev</span><Bar f={1} on={on} d={0.1} /><b className="x-mono j"><span>$0.042 / M</span></b></div>
      <div className="xbm-pr0"><span className="pf-figure">$0</span><span className="xbm-lbl">Per output token</span></div>
    </div>
  );
}
const KAI_VIS = [VisYesNo, VisTrolley, VisCode, VisPrice];

function KaiMore() {
  const chapters = [
    {
      title: 'Yes or no, read from the state',
      body: <>
        <p className="pf-body">Production Kai answers a yes/no question with a reader trained for it. The tests below are the ones it leads Jev on, both models given the same questions and the same rows.</p>
        <Sheet label="Test" ghost title="Yes or no, read from the state">
          <In><Table caption="Yes or no, read from the state" head={['Test', 'Kai', 'Jev']} rows={D.YESNO.map(([t, k, j]) => [t, <b key="k"><span>{k}</span></b>, j])} /><p className="xbm-note">Kai is kai-1.2, read 2026-10-08; Jev is typesafe/jev-1.13 through the API, read 2026-10-06. Hanzo-measured; harness private.</p></In>
        </Sheet>
      </>,
    },
    {
      title: 'The trolley problem, decided on the counts',
      body: <>
        <p className="pf-body">Kai does not weigh lives by preference. Its policy acts on the counts it grounds from the scene, and escalates to a person where it cannot ground them. On trolley-bench&apos;s 5,240 setups, scored by the article&apos;s own rules, the checks below are the ones Kai leads Jev on; every check is lower is better, and GPT-6 Luna&apos;s recorded answers stand beside both.</p>
        <Sheet label="trolley-bench" ghost title="The trolley problem, decided on the counts" wide>
          <In>
            <Table caption="The trolley problem, decided on the counts" head={['Check', 'Kai', 'Jev', 'GPT-6 Luna']} rows={D.TROLLEY.map(([t, k, j, g]) => [t, <b key="k"><span>{k}</span></b>, j, g])} />
            <p className="xbm-note">Kai is kai-1.8 through its nio/harm@1 policy, read 2026-10-20; Jev is typesafe/jev-1.13 and GPT-6 Luna is gpt-6-luna, each the benchmark&apos;s recorded answers. zachlandes/trolley-bench at cde97d7. Hanzo-scored by the article&apos;s rules; the scorer reproduces the article&apos;s numbers from the recorded answers.</p>
            <p className="xbm-say">Before any of it, Kai was qualified on 14,832 sealed trolley-structured scenes in two registers it had never read (quarry and piste), hashed before the model was frozen and read once. Every scene of the switch, server, robot, developer, and empty families, 8,300 in all, was decided right, with no wrong course; the crowd, hedged, infra, and vague families, where the harm cannot be counted, were escalated to a person every time.</p>
            <Table caption="14,832 sealed trolley-structured scenes" head={['Family', 'Scenes', 'Coverage', 'Accuracy', 'Wrong']} rows={D.FAMILIES} />
            <p className="xbm-note">ground-8, read 2026-10-20 at the qualified floor. Coverage is the share of scenes grounded; accuracy is of those; wrong counts the courses a grounded scene got wrong. Hanzo-measured; the sealed set is private.</p>
          </In>
        </Sheet>
      </>,
    },
    {
      title: 'Verified coding-agent performance',
      body: <>
        <span id="coding-agent" className="xbm-anchor" />
        <p className="pf-body">Hanzo Dev, with Kai and Enso Flash on api.hanzo.ai, against native Claude Code on held-out repository repairs. Each task is one fault its visible test fails on, and counts as solved only when a hidden verifier passes. Speed is the paired wall time over the tasks both solved.</p>
        <Sheet label="coding.repair" ghost title="Verified coding-agent performance" wide>
          <In>
            <Table caption="Verified coding-agent performance" head={['Tasks both solved, by how Hanzo Dev settled them', 'Tasks', 'Speed', '95% interval']} rows={D.SETTLED} />
            <Table caption="Hanzo Dev, with Kai and Enso Flash on api.hanzo.ai" head={['Agent', 'Median seconds', 'Model calls a task']} rows={D.AGENTS} />
            <p className="xbm-note">The fastest tasks are settled by a search with no model call: it tries single-token edits of the kinds these faults are drawn from against the visible test alone, and never reads a hidden test or the fault. These results are specific to this benchmark, one attempt a task; they are not a claim about general-purpose coding.</p>
            <p className="xbm-runl"><span>Research runs of coding.repair on split held, ended 2026-10-15, harness commit 8e966be: GET /v1/research/runs?benchmark=coding.repair.</span></p>
          </In>
        </Sheet>
      </>,
    },
    {
      title: 'Price',
      body: <>
        <p className="pf-body">Input-token price · Kai vs Jev: <b className="xbm-ink"><span>$0.021 / M</span></b> against <b className="xbm-ink"><span>$0.042 / M</span></b>. <b className="xbm-ink"><span>$0</span></b> <span>Per output token. A decision returns a choice, a score or a yes/no probability, and writes no text, so the price list bills no output.</span></p>
        <p className="xbm-note">Jev is typesafe/jev-1.13-20260917 through OpenRouter.</p>
      </>,
    },
  ];
  return <Chapters id="kai-more" className="xbm-kaimore" label="Kai" chapters={chapters} list={KAI_VIS} buy={<Buy id="kai-more" />} />;
}

/* Plain chapters: each one a quick section of its own (copy beside its visual), no pinning and no scroll scrub.
   A chapter's visual starts its own walk when it is reached. */
function Chapter({ c, V, i, still }) {
  const [ref, seen] = useSeen(0.25);
  return (
    <article ref={ref} className={'xbm-ch' + (i & 1 ? ' flip' : '')}>
      <div className="xbm-ch-t">
        {c.title && <h3 className="pf-head">{c.title}</h3>}
        {c.kicker && <p className="pf-kick xbm-ch-cap">{c.kicker}</p>}
        {c.body}
        {c.buy}
      </div>
      <div className="xbm-ch-v"><V on={seen} progress={still} /></div>
    </article>
  );
}
/* the chapters fold into tabs: a tab names its chapter (its kicker and title, as the chapter has them), the pane holds
   the copy beside its visual, and Hanzo's buying action stands in every pane */
function Chapters({ chapters, list, className = '', label, id, dark, buy }) {
  const still = useMotionValue(0.5);
  const tabs = chapters.map((c, i) => ({
    tab: <>{c.kicker && <span className="xbm-tab-k">{c.kicker}</span>}<span className="xbm-tab-n">{c.title}</span></>,
    body: <Chapter c={{ ...c, buy }} V={list[i]} i={i} still={still} />,
  }));
  return (
    <section id={id} className={'xbm-sec xbm-chs ' + className} aria-label={label} data-room={dark ? 'dark' : undefined}>
      <div className="pf-wrap">
        <Tabs id={'xbm-' + (id || 'ch') + '-tabs'} label={label} tabs={tabs} />
      </div>
    </section>
  );
}

/* the tool shortlist and the MCP handlers: two plain screens after the pinned story */
function KaiTools() {
  return (
    <section className="xbm-sec xbm-ktools" aria-labelledby="xbm-kt-h">
      <div className="pf-wrap">
        <Tabs id="xbm-kt-tabs" label="Kai" tabs={[
          {
            tab: 'Finding the right tool in a large catalog',
            body: (
              <div className="xbm-kt" id="shortlist">
                <div>
                  <h2 className="pf-head" id="xbm-kt-h">Finding the right tool in a large catalog</h2>
                  <p className="pf-body">Kai’s tool-relevance head, in development, ranks a shortlist of 32 tools drawn from the whole catalog. The shortlist is an open embedding model, zen-embedding-0.6B, with a small BM25 term; nothing is trained for it. Here it is scored against BM25 alone on a dev catalog Hanzo assembled from public tool-calling sets and its own API: 2,928 tools, 6,608 requests.</p>
                  <p className="xbm-note">An internal dev set, not a public benchmark: one run, 2026-10-11. Retrieval only, not an agent result.</p>
                  <Buy id="shortlist" />
                </div>
                <VisShort />
              </div>
            ),
          },
          {
            tab: 'Agent tools',
            body: (
              <div className="xbm-kt two">
                <div>
                  <h2 className="pf-head">Agent tools</h2>
                  <p className="pf-body">Tool handlers in Hanzo MCP, each run on the same cases as the handler it replaced. Each row says what decides it, rules, BM25 or Kai, as its run records. A rate is shown with its count.</p>
                  <div className="xbm-opens">
                    <Sheet label="Handler" ghost title="Agent tools" wide>
                      <In><div className="xbm-toolgrid">{D.TOOLS.map((x) => <ToolTable key={x.split} x={x} />)}</div></In>
                    </Sheet>
                  </div>
                  <Buy id="tools" />
                </div>
                <VisTools />
              </div>
            ),
          },
        ]} />
      </div>
    </section>
  );
}

/* ---------- 7. Zen 6: the dark room, three chapters; scrolling the second sweeps the context dial ---------- */
function Dial({ progress, on = true, from = 1 / 3, to = 2 / 3 }) {
  const [at, setAt] = useState(6);
  const ref = useRef(null);
  const last = useRef(0);
  const calm = useReducedMotion();
  const [hold, setHold] = useState(false);
  useMotionValueEvent(progress, 'change', (p) => {
    last.current = Date.now();
    const l = (p - from) / (to - from);
    if (l < 0 || l > 1) return;
    setAt(Math.min(D.LSA.length - 1, Math.floor(l * D.LSA.length)));
  });
  // when the scroll rests (0.9s), the dial steps on by itself, one length every 1.8s; a press or keyboard focus holds it
  useEffect(() => {
    if (!on || calm || hold) return;
    let t, prev = 0;
    const step = () => {
      const now = Date.now();
      if (now - last.current > 900 && now - prev > 1800) { prev = now; setAt((v) => (v + 1) % D.LSA.length); }
      t = setTimeout(step, 300);
    };
    t = setTimeout(step, 300);
    return () => clearTimeout(t);
  }, [on, calm, hold]);
  const r = D.LSA[at];
  const maxP = 72.4, maxD = 78.57;
  return (
    <div className="xbm-dial" ref={ref} onClick={() => setHold(true)} onFocusCapture={() => setHold(true)} onBlurCapture={() => setHold(false)}>
      <div className="xbm-dial-read">
        <p className="xbm-dial-k">Context length</p>
        {/* a fixed box: the old and the new length cross inside it, absolutely placed, so nothing around them moves */}
        <div className="xbm-dial-nb">
          <AnimatePresence initial={false}>
            <motion.p key={at} className="xbm-dial-n" initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -24, opacity: 0 }} transition={SPRING}>{r[0]}</motion.p>
          </AnimatePresence>
        </div>
        {/* every length's line sits in one cell, sized by the longest, so the dial never changes height as it steps */}
        <div className="xbm-dial-sb">{D.LSA.map((l, i) => <p key={l[0]} className={'xbm-dial-s' + (i === at ? ' on' : '')} aria-hidden={i === at ? undefined : true}>{l[1]}</p>)}</div>
        <div className="xbm-dial-x">
          <div><span>Prefill</span><b><span>{r[2]}</span></b><i className="xbm-gauge"><motion.em animate={{ scaleX: r[3] / maxP }} transition={SPRING} /></i></div>
          <div><span>Decode</span><b><span>{r[4]}</span></b><i className="xbm-gauge"><motion.em animate={{ scaleX: r[5] / maxD }} transition={SPRING} /></i></div>
        </div>
        <p className="xbm-dial-k">against full attention</p>
      </div>
      {/* the fill is set on the wrapper, not the input: a screenshot taken before hydration (Playwright hides the caret with an
          inline style on every input) would otherwise read as a hydration mismatch; the inputs also carry suppressHydrationWarning */}
      <div className="xbm-dial-ctl" style={{ '--p': ((at / (D.LSA.length - 1)) * 100).toFixed(2) + '%' }}>
        <input type="range" min={0} max={D.LSA.length - 1} step={1} value={at} onChange={(e) => setAt(+e.target.value)} aria-label="Context length" aria-valuetext={r[0] + ' tokens'} suppressHydrationWarning />
        <ol className="xbm-dial-ticks">{D.LSA.map((l, i) => <li key={l[0]}><button type="button" className={i === at ? 'on' : ''} onClick={() => setAt(i)} aria-label={l[0] + ' tokens'}>{l[0]}</button></li>)}</ol>
      </div>
    </div>
  );
}

function Speedups({ title, col, max, on, lit = -1, pick }) {
  const [ref, seen] = useSeen(0.3);
  return (
    <div className="xbm-spd" ref={ref}>
      <p className="xbm-spd-t"><A to="/benchmarks/zen-6">{title}</A></p>
      <ul>
        {[...D.LSA].reverse().map((l, i) => (
          <li key={l[0]} className={pick ? 'xbm-w' + (lit === D.LSA.length - 1 - i ? ' lit' : '') : undefined} {...(pick ? pick(D.LSA.length - 1 - i) : {})}>
            <span className="x-mono">{l[0]}</span>
            <Bar f={l[col + 1] / max} on={on ?? seen} d={i * 0.06} tone="acc" />
            <b className="x-mono"><span>{l[col]}</span></b>
          </li>
        ))}
      </ul>
      <p className="xbm-spd-f">against full attention</p>
    </div>
  );
}

function VisHW({ on }) {
  const [ref, w, hold, pick] = useWalk(D.HW.length, on);
  return (
    <div className={'xbm-hw xbm-turn s' + (w & 1)} ref={ref} {...hold}>
      {[['Prefill, tokens a second', 1, 2, 3665, 'the low end of a range is the bar'], ['Decode, tokens a second', 3, 4, 70, 'one request']].map(([t, v, n, max, f], g) => (
        <div key={t} className="xbm-hw-g">
          <p className="xbm-spd-t"><A to="/benchmarks/zen-6">{t}</A></p>
          <ul>
            {D.HW.map((h, i) => (
              <li key={h[0]} className={'xbm-w' + (w === i ? ' lit' : '')} {...pick(i)}><span>{h[0]}</span><Bar f={h[n] / max} on={on} d={g * 0.2 + i * 0.08} tone="acc" /><b className="x-mono"><span>{h[v]}</span></b></li>
            ))}
          </ul>
          <p className="xbm-spd-f">{f}</p>
        </div>
      ))}
    </div>
  );
}
function VisDial({ progress, on }) { return <Dial progress={progress} on={on} />; }
function VisSpeed({ on }) {
  const [ref, w, hold, pick] = useWalk(D.LSA.length, on);
  return (
    <div className={'xbm-spds xbm-turn s' + (w & 1)} ref={ref} {...hold}>
      <Speedups title="Latent Sparse Attention (D-LSA) prefill speedup" col={2} max={72.4} on={on} lit={w} pick={pick} />
      <Speedups title="Latent Sparse Attention (D-LSA) decode speedup" col={4} max={78.57} on={on} lit={w} pick={pick} />
    </div>
  );
}
const ZEN_VIS = [VisHW, VisDial, VisSpeed];

function Zen() {
  const chapters = [
    {
      kicker: 'Zen 6 · speed on our own hardware & Latent Sparse Attention', title: <span className="pf-moment xbm-zen-n">~3,665 tok/s</span>,
      body: <>
        <p className="pf-lede">Zen 6 prefills ~3,665 tokens a second on NVIDIA Grace-Blackwell and scales 72.40× faster at 10M tokens with Latent Sparse Attention.</p>
        <A to="/benchmarks/zen-6" className="xbm-zlink">
          <b><span>Prefill · Zen 6 on NVIDIA Grace-Blackwell</span></b>
          <span>Decode ~70 tok/s · 141.2 tok/s with DFlash2 · 46.29× prefill & 78.57× decode at 1M context (99.8% KV pruned) · measured by Hanzo on Nov 4, 2026.</span>
        </A>
      </>,
    },
    {
      kicker: 'Latent Sparse Attention (D-LSA) prefill speedup · 10M tokens on NVIDIA H200', title: <span className="pf-moment xbm-zen-n">72.40×</span>,
      body: <>
        <p className="pf-body">42.50× decode speedup at 10M tokens · 46.29× (26.40 ms) prefill and 78.57× (0.167 ms) decode at 1M tokens on NVIDIA Grace-Blackwell GB10 (99.8% KV pruned) · RULER 95.2% vs 95.4% full attention · N-LSA 1.6× faster training at 128K.</p>
        <More to="/benchmarks/zen-6">Zen 6 throughput & Latent Sparse Attention</More>
      </>,
    },
    {
      title: <>Subquadratic <span className="xbm-nb">Ultra-Long Context</span></>,
      body: <>
        <p className="xbm-paper"><A to="https://papers.hanzo.ai/zen6-latent-sparse-attention/">Zen 6: Subquadratic Ultra-Long Context via Hierarchical Latent Sparse Attention →</A></p>
        <Sheet label="Context length" ghost title="Zen 6 throughput & Latent Sparse Attention" wide>
          <In><Table caption="Zen 6 throughput & Latent Sparse Attention" head={['Context length', 'Hardware · method', 'Prefill', 'Decode']} rows={D.LSA.map((l) => [l[0], l[1], l[2], l[4]])} /></In>
        </Sheet>
      </>,
    },
  ];
  return <Chapters id="zen" className="xbm-zen xbm-zenroom" label="Zen 6" chapters={chapters} list={ZEN_VIS} dark buy={<Buy id="zen" className="dark" />} />;
}

/* ---------- 8. Agent harness ---------- */
/* the three lanes carry Hanzo's own labels, emoji included (copy rule, 8 Nov: every word as hanzo.ai has it) */
function Lane({ k, name, x, p, running, figs, desc, tone }) {
  const xr = useRef(x);
  xr.current = x;
  const mv = useTransform(p, (v) => {
    const { ms, latency } = xr.current;
    if (v >= 1) return latency;
    const t = v * ms;
    return ms < 1000 ? t.toFixed(ms < 1 ? 2 : ms < 10 ? 1 : 0) + ' ms' : (t / 1000).toFixed(1) + ' s';
  });
  return (
    <div className={'xbm-lane ' + tone}>
      <div className="xbm-lane-h">
        <span className="xbm-badge"><span>{k}</span></span>
        <span className="xbm-lane-n">{name}</span>
        <span className="xbm-lane-f x-mono">{running ? <motion.strong>{mv}</motion.strong> : <strong><span>{x.latency}</span></strong>}{figs}</span>
      </div>
      <i className="xbm-lane-bar" aria-hidden="true"><motion.b style={{ scaleX: p }} /></i>
      <div className="xbm-lane-d">{desc}</div>
    </div>
  );
}

function Race() {
  const [at, setAt] = useState(0);
  const [running, setRunning] = useState(false);
  const [stepI, setStepI] = useState(0);
  const p = [useMotionValue(1), useMotionValue(1), useMotionValue(1)];
  const totRef = useRef(0);
  totRef.current = D.RACE[at].trad.tokens;
  const tok = useTransform(p[2], (v) => Math.round(v * totRef.current).toLocaleString('en-US'));
  const box = useRef(null);
  const seen = useInView(box, { once: true, amount: 0.5 });
  const calm = useReducedMotion();
  const ctl = useRef([]);
  const sc = D.RACE[at];
  const run = () => {
    ctl.current.forEach((c) => c.stop());
    if (calm) { p.forEach((m) => m.set(1)); return; }
    p.forEach((m) => m.set(0));
    setRunning(true);
    // real ratios: the slowest lane takes 6s and every other lane its own latency's share of that
    const T = 6, dur = (ms) => Math.max(0.0001, (ms / sc.trad.ms) * T);
    ctl.current = [
      animate(p[0], 1, { duration: dur(sc.hanzo.ms), ease: 'linear' }),
      animate(p[1], 1, { duration: dur(sc.rag.ms), ease: 'linear' }),
      animate(p[2], 1, { duration: T, ease: 'linear', onUpdate: (v) => setStepI(Math.min(sc.trad.steps.length - 1, Math.floor(v * sc.trad.steps.length))), onComplete: () => setRunning(false) }),
    ];
  };
  useEffect(() => { if (seen) run(); }, [seen]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => ctl.current.forEach((c) => c.stop()), []);
  const pick = (i) => { ctl.current.forEach((c) => c.stop()); setRunning(false); p.forEach((m) => m.set(1)); setAt(i); };
  const speed = (ms) => (sc.trad.ms / ms > 1000 ? '100×+' : Math.round(sc.trad.ms / ms) + '×');
  return (
    <div className="xbm-race" ref={box}>
      <div className="xbm-race-top">
        <div>
          <h3 className="pf-head">Agent Code Intelligence: The Race</h3>
          <p className="pf-body">How Hanzo Dev and Hanzo MCP accelerate agentic code comprehension compared to traditional raw-file reading and containerized local RAG stacks (Qdrant + Ollama). Benchmarked across production multi-language repositories.</p>
        </div>
        <Sheet label="Architecture" ghost title="Agent Code Intelligence: The Race" wide>
          <In>
            <Table caption="Agent Code Intelligence: The Race" head={['Architecture', 'Latency', 'Tool Turns', 'Tokens Injected', 'Token Savings', 'Speedup']} className="xbm-race-t" rows={[
              ['Traditional Agent (Grep + Whole File Reads)', sc.trad.latency, sc.trad.turns, sc.trad.tokens.toLocaleString('en-US'), 'Baseline', '1.0×'],
              ['Containerized Local RAG (Qdrant + Ollama)', sc.rag.latency, sc.rag.turns, sc.rag.tokens.toLocaleString('en-US'), sc.rag.savings, (sc.trad.ms / sc.rag.ms).toFixed(1) + '×'],
              [<b key="h"><span>Hanzo Native (`hanzo dev` / `hanzo code claude`)</span></b>, <b key="l"><span>{sc.hanzo.latency}</span></b>, <b key="t"><span>{sc.hanzo.turns}</span></b>, <b key="k"><span>{sc.hanzo.tokens.toLocaleString('en-US')}</span></b>, <b key="s"><span>{sc.hanzo.savings}</span></b>, <b key="x"><span>{speed(sc.hanzo.ms)}</span></b>],
            ]} />
            <p className="xbm-note">In a real agentic workflow (e.g. Claude Code, Cursor, Windsurf), each tool roundtrip incurs an additional 3–5 seconds of LLM inference latency. By replacing 6–13 iterative file exploration roundtrips with Hanzo’s in-process AST indexing (`code_context`, `code_tool`, `hanzo_refactor`) and Kai deterministic test-driven search, Hanzo Dev accelerates Claude Code by <b><span>20× to 50× (and up to 137× on zero-model search-settled faults)</span></b>, while slashing token consumption by <b><span>90% to 100%</span></b>.</p>
            <p className="xbm-runl">Research runs on benchmarks claude-acceleration and code-rag-navigation, harness commit hanzoai/benchmarks:{' '}
              <A to={API + '&benchmark=claude-acceleration'}>GET /v1/research/runs?org=hanzo&amp;benchmark=claude-acceleration</A>{' '}
              <A to={API + '&benchmark=code-rag-navigation'}>GET /v1/research/runs?org=hanzo&amp;benchmark=code-rag-navigation</A>{' '}
              <A to="https://api.hanzo.ai/v1/benchmark/leaderboard?benchmark=code-rag-navigation">GET /v1/benchmark/leaderboard?benchmark=code-rag-navigation</A>
            </p>
          </In>
        </Sheet>
      </div>
      <div className="xbm-race-tabs" role="tablist" aria-label="Race scenario">
        {D.RACE.map((r, i) => (
          <button key={r.title} type="button" role="tab" aria-selected={at === i} onClick={() => pick(i)}>
            {at === i && <motion.span layoutId="xbm-race" className="xbm-race-bg" transition={SPRING} />}
            <span>{r.title}</span>
          </button>
        ))}
      </div>
      <div className="pf-obj xbm-arena">
        <div className="xbm-arena-h">
          <div>
            <p className="xbm-lbl">TARGET QUERY</p>
            <p className="xbm-target">{sc.target}</p>
            {/* every scenario's query is in the page */}
            <ul className="x-sr">{D.RACE.map((r) => <li key={r.title}>{r.title}: {r.target}</li>)}</ul>
          </div>
          <button type="button" className="xbm-run-b" onClick={run} disabled={running}>
            <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">{running ? <path d="M13 8a5 5 0 1 1-1.5-3.5M13 2.5v3h-3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /> : <path d="M5 3.5v9l7-4.5z" fill="currentColor" />}</svg>
            {running ? 'Racing...' : 'Run Race Simulation'}
          </button>
        </div>
        <Lane k="⚡ Hanzo native" name="hanzo dev + hanzo-mcp" x={sc.hanzo} p={p[0]} running={running} tone="me"
          figs={<><span>{sc.hanzo.turns} turn</span><span>{sc.hanzo.tokens.toLocaleString('en-US')} tokens (<strong><span>{sc.hanzo.savings} saved</span></strong>)</span></>}
          desc={<>{sc.hanzo.detail} <strong><span>Zero Docker, Zero background model daemons</span></strong></>} />
        <Lane k="⚙️ Local RAG" name="Qdrant Container + Ollama (phi3 / mxbai)" x={sc.rag} p={p[1]} running={running} tone="mid"
          figs={<><span>{sc.rag.turns} turn{sc.rag.turns > 1 ? 's' : ''}</span><span>{sc.rag.tokens.toLocaleString('en-US')} tokens</span></>}
          desc={<>{sc.rag.detail} <strong><span>Requires 16 GB RAM + Docker daemon</span></strong></>} />
        <Lane k="🐌 Traditional agent" name="Claude Code / Cursor (Raw Grep + File Reads)" x={sc.trad} p={p[2]} running={running} tone="slow"
          figs={<><span>{sc.trad.turns} turns</span><span>{running ? <motion.span>{tok}</motion.span> : sc.trad.tokens.toLocaleString('en-US')} tokens</span></>}
          desc={<><span>{running ? <>Active Step: <em><span>{sc.trad.steps[stepI]}</span></em></> : sc.trad.detail}</span><span className="xbm-burn">{running ? 'Burning prompt tokens...' : 'Context saturated (blowup)'}</span><span className="x-sr">Burning prompt tokens...</span></>} />
      </div>
    </div>
  );
}

/* ---------- the signature: a live race, at the real ratios, of what the visitor picks ----------
   Prefill and decode race Zen 6's three builds to the same token count in real time (the fastest takes one second, the
   rest their own rate's share). Latent Sparse Attention races D-LSA against full attention at a chosen context length
   (full attention takes 6s, D-LSA 6s divided by its measured speed-up). The agent race runs Hanzo's five CodeRace
   scenarios at their latencies' ratios. Every lane's figure is Hanzo's own, read out when it finishes. Reduced motion:
   every lane rests at its finish; picking still works. */
const TRACKS = ['Prefill, tokens a second', 'Decode, tokens a second', 'Latent Sparse Attention (D-LSA) prefill speedup', 'Latent Sparse Attention (D-LSA) decode speedup', 'Agent Code Intelligence: The Race'];
const n0 = (v) => Math.round(v).toLocaleString('en-US');
const TONE = ['me', 'mid', 'slow'];

function lanesFor(t, li) {
  if (t < 2) {
    const [lab, col] = t === 0 ? [1, 2] : [3, 4];
    const top = Math.max(...D.HW.map((h) => h[col]));
    return D.HW.map((h, i) => ({ name: h[0], secs: top / h[col], count: (v) => n0(v * top) + ' tokens', final: h[lab], tone: TONE[i] }));
  }
  const r = D.LSA[li], pre = t === 2, x = pre ? r[3] : r[5], T = 6;
  return [
    { k: 'D-LSA', name: r[1], secs: T / x, count: (v) => Math.round(v * 100) + '%', final: pre ? r[2] : r[4], tone: 'me' },
    { k: 'Full Attention', name: 'against full attention', secs: T, count: (v) => Math.round(v * 100) + '%', final: '1.00×', tone: 'slow' },
  ];
}

function TrackLane({ k, name, p, count, final, tone }) {
  const txt = useTransform(p, (v) => (v >= 1 ? final : count(v)));
  return (
    <div className={'xbm-lane ' + tone}>
      <div className="xbm-lane-h">
        {k && <span className="xbm-badge">{k}</span>}
        <span className="xbm-lane-n">{name}</span>
        <span className="xbm-lane-f x-mono"><motion.strong>{txt}</motion.strong></span>
      </div>
      <i className="xbm-lane-bar xbm-trk-bar" aria-hidden="true"><motion.b style={{ scaleX: p }} /></i>
    </div>
  );
}

function RaceTrack() {
  const [t, setT] = useState(0);
  const [li, setLi] = useState(6);
  const [running, setRunning] = useState(false);
  const p = [useMotionValue(1), useMotionValue(1), useMotionValue(1)];
  const box = useRef(null);
  const seen = useInView(box, { once: true, amount: 0.3 });
  const live = useInView(box, { amount: 0.05 });
  const calm = useReducedMotion();
  const ctl = useRef([]);
  const lanes = t < 4 ? lanesFor(t, li) : [];
  const run = (ls = lanes) => {
    ctl.current.forEach((c) => c.stop());
    if (calm || !ls.length) { p.forEach((m) => m.set(1)); setRunning(false); return; }
    p.forEach((m) => m.set(0));
    setRunning(true);
    const end = Math.max(...ls.map((l) => l.secs));
    ctl.current = ls.map((l, i) => animate(p[i], 1, { duration: l.secs, ease: 'linear', onComplete: l.secs === end ? () => setRunning(false) : undefined }));
  };
  // it runs when reached, again on every pick, and again each time it comes back into view; off screen it rests at the finish
  useEffect(() => {
    if (seen && live) run();
    else { ctl.current.forEach((c) => c.stop()); p.forEach((m) => m.set(1)); setRunning(false); }
  }, [seen, live, t, li]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => ctl.current.forEach((c) => c.stop()), []);
  const keys = (e) => {
    const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (!k) return;
    e.preventDefault();
    const n = (t + k + TRACKS.length) % TRACKS.length;
    setT(n);
    document.getElementById('xbm-trk-' + n)?.focus();
  };
  return (
    <div className="pf-wrap xbm-trk" id="race" ref={box}>
      <div className="xbm-trk-side">
        <div className="xbm-race-tabs xbm-trk-tabs" role="tablist" aria-label="Race" onKeyDown={keys}>
          {TRACKS.map((r, i) => (
            <button key={r} id={'xbm-trk-' + i} type="button" role="tab" aria-selected={t === i} aria-controls={'xbm-trkp-' + i} tabIndex={t === i ? 0 : -1} onClick={() => setT(i)}>
              {t === i && <motion.span layoutId="xbm-trk" className="xbm-race-bg" transition={SPRING} />}
              <span>{r}</span>
            </button>
          ))}
        </div>
        <Buy id="race" />
      </div>
      <div className="xbm-trk-stage">
      {/* every race stays in the page; the picked one is shown */}
      {TRACKS.slice(0, 4).map((r, i) => (
        <div key={r} role="tabpanel" id={'xbm-trkp-' + i} aria-labelledby={'xbm-trk-' + i} hidden={t !== i} className="pf-obj xbm-arena xbm-trk-a">
          <div className="xbm-arena-h">
            <div>
              <p className="xbm-lbl">{i < 2 ? 'Zen 6 · speed on our own hardware & Latent Sparse Attention' : 'Context length'}</p>
              {i >= 2 && (
                <ol className="xbm-dial-ticks xbm-trk-ticks" aria-label="Context length">
                  {D.LSA.map((l, k) => <li key={l[0]}><button type="button" className={k === li ? 'on' : ''} aria-pressed={k === li} onClick={() => setLi(k)}>{l[0]}</button></li>)}
                </ol>
              )}
            </div>
            <button type="button" className="xbm-run-b" onClick={() => run()} disabled={running}>
              <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">{running ? <path d="M13 8a5 5 0 1 1-1.5-3.5M13 2.5v3h-3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /> : <path d="M5 3.5v9l7-4.5z" fill="currentColor" />}</svg>
              {running ? 'Racing...' : 'Run Race Simulation'}
            </button>
          </div>
          {t === i && lanes.map((l, k) => <TrackLane key={t + '-' + li + '-' + k} {...l} p={p[k]} />)}
          <p className="xbm-spd-f">{i < 2 ? 'the low end of a range is the bar' : 'against full attention'}</p>
        </div>
      ))}
      <div role="tabpanel" id="xbm-trkp-4" aria-labelledby="xbm-trk-4" hidden={t !== 4}>
        <Race />
      </div>
      </div>
    </div>
  );
}

function Graph() {
  const [ref, seen] = useSeen(0.4);
  // log scale: 0.063 ms against 5,357 ms
  const Lg = (v) => (Math.log10(v) + 2) / (Math.log10(5357) + 2);
  return (
    <div className="xbm-graph" ref={ref}>
      {[['0.063 ms', 0.063, 'Hanzo graph, through the API', 'acc'], ['5,357 ms', 5357, 'Semantica temporal query', '']].map(([v, n, t, tone], i) => (
        <A key={v} to="/benchmarks/cronquestions" className={'xbm-graph-c ' + tone}>
          <b className="x-mono"><span>{v}</span></b>
          <span>{t}</span>
          <Bar f={Lg(n)} on={seen} d={i * 0.15} tone={tone} />
          <small><span>median question · Hits@1 99.88%</span></small>
        </A>
      ))}
    </div>
  );
}

function Harness() {
  return (
    <section className="xbm-sec xbm-harness" id="harness">
      <div className="pf-wrap">
        <div className="xbm-h-top">
          <div>
            <h2 className="pf-head xbm-h-head">On LoCoMo, Hanzo&apos;s context engine finds 2.0× the multi-hop evidence cosine does.</h2>
            <p className="xbm-cap">Agent harness · what the agent remembers and finds</p>
          </div>
          <div className="xbm-h-side">
            <A to="/benchmarks/locomo" className="xbm-h-fig">
              <span className="pf-moment">2.0×</span>
              <span><b><span>Multi-hop ALL@20 · LoCoMo</span></b><span>37.5% against cosine&apos;s 18.8% on the test split: every annotated evidence turn in the top 20.</span></span>
            </A>
            <Buy id="harness" />
          </div>
        </div>
        <Tabs id="xbm-h-tabs" label="Agent harness" className="xbm-h-tabs" tabs={[
          {
            tab: 'Memory and retrieval',
            body: (
              <div className="xbm-mem">
                <div className="xbm-mem-h">
                  <h3 className="pf-title">Memory and retrieval</h3>
                  <p className="pf-body">What a memory finds in a long conversation, and what a reader does with it. Each panel is one metric, the baseline and Hanzo on the same data, the same embedder and the same cut-off, drawn on one scale.</p>
                </div>
                <div className="xbm-pps mem">
                  <PairPanel t={D.MEMORY[0].t} to={D.MEMORY[0].to} foot={D.MEMORY[0].foot} rows={D.MEMORY[0].rows} paired />
                  <div className="xbm-pps-col">{D.MEMORY.slice(1).map((m) => <PairPanel key={m.t} t={m.t} to={m.to} foot={m.foot} rows={m.rows} paired />)}</div>
                </div>
              </div>
            ),
          },
          {
            tab: 'Knowledge graph',
            body: (
              <div className="xbm-two">
                <div>
                  <h3 className="pf-title">Knowledge graph</h3>
                  <p className="pf-body">Point-in-time questions over facts that begin and end, against another temporal store on the same data. On the CronQuestions types the harness covers, the Hanzo graph answers 99.88% and Semantica 99.88%; what differs is the price of a question.</p>
                </div>
                <Graph />
              </div>
            ),
          },
          {
            tab: 'Code',
            body: (
              <div className="xbm-two">
                <div>
                  <h3 className="pf-title">Code</h3>
                  <p className="pf-body">Cross-file retrieval in a repository, scored apart from generation. Typed links are regular expressions over imports, definitions and identifiers; no model reads anything in that row.</p>
                </div>
                <PairPanel t="RepoBench-R" to="/benchmarks/repobench-r" foot="cross-file-first · test split · R@1" rows={[['dense retrieval', 18.8, 'typed links', 31.4]]} paired />
              </div>
            ),
          },
        ]} />
      </div>
    </section>
  );
}

/* ---------- 9. Agent platform: 477 bytes against a megabyte, drawn to scale ---------- */
function Bytes() {
  const [ref, seen] = useSeen(0.5);
  return (
    <div className="xbm-bytes" ref={ref} aria-hidden="true">
      <motion.div className="xbm-mb" initial={{ scale: 0 }} animate={seen ? { scale: 1 } : {}} transition={{ duration: 0.5, ease: EASE }}><span>~1 MB</span></motion.div>
      <motion.i className="xbm-b477" initial={{ scale: 0 }} animate={seen ? { scale: 1 } : {}} transition={{ duration: 0.3, ease: EASE, delay: 0.6 }} />
      <motion.span className="xbm-b477-l" initial={{ opacity: 0 }} animate={seen ? { opacity: 1 } : {}} transition={{ delay: 0.75, duration: 0.3, ease: [0, 0, 0.2, 1] }}>477 bytes, to scale</motion.span>
    </div>
  );
}

function Platform() {
  return (
    <section className="xbm-sec xbm-plat" id="platform">
      <div className="pf-wrap xbm-plat-g">
        <div className="xbm-plat-top">
          <div>
            <h2 className="pf-head">A dormant agent costs 477 bytes.</h2>
            <p className="xbm-cap">Agent platform · what an agent costs</p>
            <A to="/benchmarks/platform-bench" className="xbm-plat-fig">
              <b className="pf-moment"><span>477 bytes</span></b>
              <span><b><span>State per dormant agent</span></b><span>Against a published ~1 MB (2,198×). 1M agents: 455 MB on disk vs ~977 GB.</span></span>
            </A>
            <Buy id="platform" />
          </div>
          <Bytes />
        </div>
        <div className="xbm-plat-col">
        <div className="xbm-plat-h">
          <h3 className="pf-title">Platform, agents, and sandboxes</h3>
          <p className="pf-body">What an agent costs at rest, what a live one costs to wake, and what a sandbox costs to start.</p>
          <Sheet label="Platform bench" ghost title="Platform, agents, and sandboxes">
            <In><p>A live agent here is a goroutine: it shares one address space with every other, and nothing about it is an isolation boundary. Code that has to be isolated gets a microVM. The goroutine timings are the median of one pass on an Apple M4 Max, 16 cores. Every figure here is transcribed from the harness&apos;s README rather than read from a run file, and each page names the command that prints it.</p></In>
          </Sheet>
        </div>
        <ul className="xbm-spec">
          {D.PLATFORM.map(([v, t, to]) => (
            <li key={t}><A to={to}><b><span>{v}</span></b><span>{t}</span><i aria-hidden="true"><span>→</span></i></A></li>
          ))}
        </ul>
        </div>
        <div className="xbm-plat-col">
        <h3 className="pf-title xbm-gap">Start-up and cost</h3>
        <ul className="xbm-spec">
          {D.STARTUP.map(([v, t, d, to]) => (
            <li key={t}><A to={to}><b><span>{v}</span></b><span><span>{t}</span><small><span>{d}</span></small></span><i aria-hidden="true"><span>→</span></i></A></li>
          ))}
        </ul>
        </div>
      </div>
    </section>
  );
}

/* ---------- 10. Methods ---------- */
function Methods() {
  const cmd = 'git clone https://github.com/hanzoai/benchmarks && cd benchmarks/brain && node results.mjs';
  return (
    <section className="xbm-sec xbm-methods" id="methods">
      <div className="pf-wrap xbm-meth-g">
        <div>
          <h2 className="pf-head">How every number was taken</h2>
          <p className="xbm-cap">Methods</p>
          <div className="xbm-opens">
            <Sheet label="Methodology" ghost title="Methodology" wide>
              <In>
                <ol className="xbm-laws">
                  {D.METHODS.map(([b, t], i) => (
                    <li key={b}>
                      <span className="x-mono">{String(i + 1).padStart(2, '0')}</span>
                      <p><b><span>{b}</span></b> {t ?? <>Kai’s and Enso’s rows are research runs, served at <A to={API}>the research API</A> and read when this page opens. The memory, graph and code panels read the committed run files of the benchmarks repository. Kai’s yes/no table and the tool shortlist are Hanzo-measured reads the research API does not file: each is its run’s report, copied unchanged, and names its model, date and count.</>}</p>
                    </li>
                  ))}
                </ol>
              </In>
            </Sheet>
          </div>
        </div>
        <div className="xbm-meth-r">
          <div className="xbm-cmd">
            <p>The memory and code panels regenerate from the committed runs on a fresh clone:</p>
            <CodeBlock code={cmd} prompt className="xbm-cmd-cb" />
          </div>
          <div className="xbm-papers">
            <h3 className="pf-title">The research</h3>
            <p className="pf-body">Every paper the library publishes. A benchmark’s own page names the paper that reports it, where one does. Specifications are the <A to="https://hips.hanzo.ai">HIPs</A>.</p>
            <Sheet label="papers.hanzo.ai" ghost title="The research" wide>
              <In>
                <ol className="xbm-plist">
                  {D.PAPERS.map((p, i) => (
                    <li key={p.t}><A to={p.to}><span className="x-mono">{String(i + 1).padStart(2, '0')}</span><span><b><span>{p.t}</span></b><small><span>{p.s}</span></small></span><i aria-hidden="true"><span>↗</span></i></A></li>
                  ))}
                </ol>
              </In>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
}


/* ---------- 11. the shelf: every run, re-ordering, filtering and comparing ---------- */
const ORDERS = ['Newest', 'Largest lead', 'Benchmark', 'Value'];
const month = (d) => d.replace(/ \d+,/, '');
const KEYOF = { product: 'product', category: 'category', measure: 'measure', by: () => 'Hanzo', date: (r) => month(r.date), state: 'status', result: 'result' };
const valOf = (r, k) => (typeof KEYOF[k] === 'function' ? KEYOF[k](r) : r[KEYOF[k]]);
const lead = (r) => { const m = r.base.match(/baseline ([\d.]+)/); return m ? r.v / parseFloat(m[1]) : 0; };

function Shelf() {
  const [order, setOrder] = useState('Newest');
  const [f, setF] = useState({});
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [pick, setPick] = useState([]);
  const [all, setAll] = useState(false);
  const [ix, setIx] = useState(false);
  const apply = (search) => {
    const s = new URLSearchParams(search);
    const n = {};
    for (const k of Object.keys(KEYOF)) { const v = s.getAll(k); if (v.length) n[k] = v.map((x) => (k === 'state' ? x[0].toUpperCase() + x.slice(1) : x)); }
    setF(n);
    const o = { name: 'Benchmark', value: 'Value', lead: 'Largest lead' }[s.get('order')];
    setOrder(o || 'Newest');
  };
  useEffect(() => { apply(location.search); }, []);
  const go = (e, to) => {
    e.preventDefault();
    apply(to.split('#')[0]);
    history.replaceState(null, '', location.pathname + to.split('#')[0] + '#all');
    const el = document.getElementById('all');
    if (!el) return;
    if (window.__lenis) window.__lenis.scrollTo(el, { offset: -(parseFloat(getComputedStyle(el).scrollMarginTop) || 124) });
    else el.scrollIntoView({ behavior: 'smooth' });
  };
  const toggle = (k, v) => setF((o) => { const cur = o[k] || []; const nx = cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v]; const c = { ...o, [k]: nx }; if (!nx.length) delete c[k]; return c; });
  const rows = useMemo(() => {
    const t = q.trim().toLowerCase();
    const r = D.SHELF.filter((x) => Object.entries(f).every(([k, vs]) => vs.includes(valOf(x, k))) && (!t || [x.t, x.sys, x.product, x.category, x.measure].join(' ').toLowerCase().includes(t)));
    const by = { Newest: (a, b) => new Date(b.date) - new Date(a.date) || a.i - b.i, 'Largest lead': (a, b) => lead(b) - lead(a), Benchmark: (a, b) => a.t.localeCompare(b.t) || a.i - b.i, Value: (a, b) => b.v - a.v };
    return [...r].sort(by[order]);
  }, [f, q, order]);
  const sel = (r) => setPick((p) => (p.includes(r.id) ? p.filter((x) => x !== r.id) : p.length && D.SHELF.find((x) => x.id === p[0]).t !== r.t ? [r.id] : [...p, r.id]));
  const picked = D.SHELF.filter((x) => pick.includes(x.id));
  const pmax = Math.max(...picked.map((x) => x.v), 1);
  const nf = Object.values(f).flat().length;
  return (
    <section className="xbm-sec xbm-shelf" id="all">
      <div className="pf-wrap xbm-shelf-g">
        <div className="xbm-shelf-side">
        <div className="xbm-shelf-h">
          <div>
            <h2 className="pf-head">Every benchmark, every run</h2>
            <p className="xbm-cap">Every benchmark</p>
          </div>
          <p className="pf-body">One shelf for everything above, by the same five products: each Kai revision on each suite it leads, each Enso tier on the frontiers it holds, each Zen 6 reading, each memory and platform pass. Search it, filter it, pick rows of one benchmark to compare, and open any of them for its history, conditions, hardware, source and the command that reproduces it.</p>
        </div>
        <div className="xbm-views">
          <span className="xbm-lbl">Views</span>
          {D.VIEWS.map(([t, to]) => <a key={t} href={to} onClick={(e) => go(e, to)}>{t}</a>)}
        </div>
        <Buy id="shelf" />
        <div className="xbm-index">
          <h3 className="pf-title xbm-ix-t">
            <button type="button" className="xbm-ix-fold" aria-expanded={ix} aria-controls="xbm-ix" onClick={() => setIx((v) => !v)}>
              <span>Every benchmark page</span>
              <i aria-hidden="true"><svg viewBox="0 0 16 16" width="14" height="14"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg></i>
            </button>
          </h3>
          <motion.div id="xbm-ix" className="xbm-ix-wrap" initial={false} animate={ix ? { height: 'auto' } : { height: 0 }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }} inert={!ix}>
          <div className="xbm-index-g">
            {D.PAGES.map(([prod, to, list]) => (
              <div key={prod} className="xbm-ix">
                <p className="xbm-ix-h"><a href={to} onClick={(e) => go(e, to)}>{prod}</a><small><span>filter the shelf to it</span></small></p>
                <ul>{list.map(([t, l]) => <li key={l + t}><A to={l}><span>{t}</span><i aria-hidden="true"><span>→</span></i></A></li>)}</ul>
              </div>
            ))}
          </div>
          </motion.div>
        </div>
        </div>
        <div className="xbm-shelf-main">
        <div className="xbm-ctl">
          <span className="xbm-lbl">Order</span><Seg id="o" label="Order" opts={ORDERS} val={order} set={setOrder} />
          <Tools name="hanzo-benchmarks-shelf" hash="all" rows={rows.map(({ t, sys, product, category, measure, val, base, result, date, status }) => ({ benchmark: t, system: sys, product, category, measure, value: val, baseline: base, result, date, status }))} />
        </div>
        <div className="xbm-find">
          <label className="xbm-search"><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="m10.5 10.5 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search the shelf" aria-label="Search the shelf" suppressHydrationWarning /></label>
          <button type="button" className={'xbm-fbtn' + (open ? ' on' : '')} aria-expanded={open} aria-controls="xbm-facets" onClick={() => setOpen((v) => !v)}>Filters{nf ? <b><span>{nf}</span></b> : null}</button>
        </div>
        <motion.div id="xbm-facets" className="xbm-facets" initial={false} animate={open ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }} inert={!open} aria-hidden={!open}>
          <div className="xbm-facets-in">
            {D.FACETS.map(([name, k, vals, more]) => (
              <div key={name} className="xbm-fg">
                <p>{name}</p>
                <div>
                  {vals.map(([v, n]) => <button key={v} type="button" aria-pressed={(f[k] || []).includes(v)} onClick={() => toggle(k, v)}><span>{v}</span> <span className="x-mono">{n}</span></button>)}
                  {more && <span className="xbm-more">{more}</span>}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        <p className="xbm-count" aria-live="polite"><b className="x-mono"><span>{rows.length}</span></b> of 166 results, 24 benchmarks{nf || q ? <button type="button" onClick={() => { setF({}); setQ(''); }}>Clear</button> : null}</p>
        <ol id="xbm-shelf-l" className={'xbm-shelf-l' + (all || nf || q ? ' all' : '')} aria-label="Results">
          <AnimatePresence initial={false}>
            {rows.map((r) => (
              <motion.li key={r.id} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.15, ease: [0, 0, 0.2, 1] } }} transition={SPRING} className={'xbm-sr' + (pick.includes(r.id) ? ' on' : '')}>
                <label className="xbm-chk"><input type="checkbox" checked={pick.includes(r.id)} onChange={() => sel(r)} aria-label={`Compare ${r.t}, ${r.sys.replace(/ vs .*/, '')}`} suppressHydrationWarning /><i aria-hidden="true" /></label>
                <span className="xbm-sr-t"><A to={r.to}>{r.t}</A><span className="xbm-sr-s">{r.sys.replace(/ vs (.*)$/, '')}{/ vs /.test(r.sys) && <span className="xbm-vs"> vs {r.sys.split(' vs ')[1]}</span>}</span><small><span>{r.product} · {r.category} · {r.measure}</span></small></span>
                <span className="xbm-sr-v"><b className="x-mono"><span>{r.val}</span></b><small className="x-mono"><span>{r.base}</span></small></span>
                <span className={'xbm-win' + (r.result === 'Win' ? '' : ' no')} aria-label={r.result}>{r.result === 'Win' && <Up />}<span>{r.result}</span></span>
                <span className="xbm-sr-d"><span>{r.date}</span><small><span>{r.status} · Hanzo-measured</span></small></span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ol>
        {!rows.length && (
          <div className="xbm-empty">
            <p><b><span>No run on this page matches.</span></b> The rows shown here are the newest of the library; the full shelf of 166 is filed in the research API.</p>
            <More to={API}>Show all 166</More>
          </div>
        )}
        <div className="xbm-shelf-more">
        {rows.length > 4 && !nf && !q && <Fold n={rows.length - 4} open={all} set={setAll} controls="xbm-shelf-l" />}
        {rows.length > 0 && <div className="xbm-showall"><More to={API}>Show all 166</More></div>}
        </div>
        <AnimatePresence>
          {picked.length > 0 && (
            <motion.div className="xbm-cmp" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 16, opacity: 0, transition: { duration: 0.15, ease: [0, 0, 0.2, 1] } }} transition={SPRING} role="region" aria-label="Compare">
              <div className="xbm-cmp-h"><b><span>{picked[0].t}</span></b><span>{picked.length === 1 ? 'Pick another row of this benchmark to compare' : `Comparing ${picked.length}`}</span><button type="button" onClick={() => setPick([])}>Clear</button></div>
              <ul>{picked.map((x) => <li key={x.id}><span>{x.sys.replace(/^Zen 6 · /, '').replace(/ vs .*/, '')} · {x.measure}</span><Bar f={x.v / pmax} on tone="acc" /><b className="x-mono"><span>{x.val}</span></b></li>)}</ul>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/* ---------- 12. the close: the one ask again, in the closing room ---------- */
function Close() {
  return (
    <section className="xbm-close" data-room="dark" aria-labelledby="xbm-close-h">
      <div className="pf-wrap xbm-close-g">
        <h2 id="xbm-close-h" className="pf-display">Build on Hanzo Cloud</h2>
        <div className="xbm-close-a">
          <Cta to="https://platform.hanzo.ai" id="benchmarks.close">Start on Hanzo Cloud</Cta>
          <p className="xbm-close-n"><span>Hanzo AI Cloud ·</span> <A to="/pricing">View Models &amp; Pricing</A></p>
        </div>
      </div>
    </section>
  );
}

export default function Benchmarks() {
  return (
    <main className="xbm pf-r" data-turn>
      <Hero />
      <RaceSec />
      <div className="xbm-body">
        <Rail />
        <Zen />
        <Frontier />
        <Enso />
        <Kai />
        <Board />
        <KaiMore />
        <KaiTools />
        <Harness />
        <Platform />
        <Methods />
        <Shelf />
      </div>
      <Close />
      {/* the (+) sheets open over the page from here (display: contents: never a section of its own) */}
      <div className="xbm-sheets" />
    </main>
  );
}
