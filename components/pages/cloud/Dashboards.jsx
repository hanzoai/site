'use client';
/* Dashboards.
   V2: 8/10 Launch page on the deck: a 52px title over a saved query and the widget it draws (the one big thing: the query types itself and its chart draws by CSS from first paint, cycling through four definitions, pausable); the board then builds itself panel by panel as you scroll; the monitor's alert line is yours to drag; four words marked as the proof strip; the example console; the graphite close with Hanzo's agent prompt.
   Persona: Developer running an AI application who already sends traces (a Hanzo O11y user).
   Goal: get Hanzo Dashboards (read the source on GitHub, then deploy it).
   CTA: "GitHub" → https://github.com/hanzoai/dashboards (data-cta dashboards.hero, data-thumb for the ask bar); "View on
   GitHub" (dashboards.start) after the console; "Deploy to Cloud" → platform.hanzo.ai/deploy (dashboards.close).
   Metric: api_key_created (proxy on this page: the dashboards.hero click).
   Signature: the board builds itself. "What a dashboard is made of" pins, and as you scroll each of the six parts flies
   into its slot on a blank 12-column board (widget, monitor, one store, saved view, score config, permission), so by
   the last part the dashboard is whole; the words beside it change with each panel that lands.
   Supporting: the Stage hero (the saved query types itself line by line and its widget draws, cycling through four
   definitions while seen; a tab stops it), a marker drawn under the four words, and the closing graphite room.
   Entrances (docs/MOTION-MAP.md, arrive.js arms them): diagonal-wipe (the hero object, from first paint), curtain-rise
   (the board's heading), stack-drop (the monitor's three layers), explode-gather (the four words), cursor-lens (the
   example console, a lens sweeps it once and then follows the pointer). Panel 1 is already landed when the board pins;
   chapter 02 shows only its head, the Watch section says Monitors once. Phones keep one sticky board.
   Motion kinds: idle (the cycling query), time (typing), pointer (drag the alert line), state (tabs, widget/monitor),
   arrival (title cut-in, marks), scroll (the board build, the Stage settle, the room opening).
   Beyond: "Watch it instead". One saved query switched between widget and monitor: only its first word changes, and
   the alert line you drag sits on the same chart, so the alert and the chart cannot disagree (Hanzo's own claim).
   Every word and link is Hanzo's; chart values are drawn, not measured, and print no numbers. */
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValueEvent, useScroll, useTransform } from 'motion/react';
import { A, Cta } from '../../kit';
import { useCalm } from '../../ui';
import KeynoteStage, { useStagePause } from './SafeStage';
import KeynoteClose from './SafeClose';
import KeynoteLines from '../../v2/KeynoteLines';
import ExampleConsole from './ExampleConsole';
import { CursorLens, Lens } from './MqEntrances';
import { useArrivals } from './arrive';
import { scrollToY } from '../../../lib/scroll';
import './Dashboards.css';

/* [ref, live]: live while the element is on screen and motion is allowed */
function useSeen(amount = 0.25) {
  const ref = useRef(null);
  const seen = useInView(ref, { amount });
  const calm = useCalm();
  return [ref, seen && !calm];
}
/* steps through n every ms while run; choosing one by hand stops the cycle (timeouts, no setInterval) */
function useCycle(n, ms, run) {
  const [at, setAt] = useState(0);
  const [mine, setMine] = useState(false);
  useEffect(() => {
    if (!run || mine) return;
    const t = setTimeout(() => setAt((v) => (v + 1) % n), ms);
    return () => clearTimeout(t);
  }, [at, run, mine, n, ms]);
  return [at, (i) => { setAt(i); setMine(true); }];
}

/* ---------- drawing in real pixels (even strokes, exact line lengths) ---------- */
function useBox(w0 = 600, h0 = 300) {
  const ref = useRef(null);
  const [box, setBox] = useState([w0, h0]);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(([e]) => { const r = e.contentRect; if (r.width && r.height) setBox([r.width, r.height]); });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, box];
}
const px = (P, [w, h]) => P.map(([x, y]) => [+(x / 100 * w).toFixed(1), +(y / 100 * h).toFixed(1)]);
function curve(P) {
  let d = `M${P[0][0]} ${P[0][1]}`;
  const f = (v) => +v.toFixed(1);
  for (let i = 0; i < P.length - 1; i++) {
    const a = P[i - 1] || P[i], b = P[i], c = P[i + 1], e = P[i + 2] || c;
    d += ` C${f(b[0] + (c[0] - a[0]) / 6)} ${f(b[1] + (c[1] - a[1]) / 6)} ${f(c[0] - (e[0] - b[0]) / 6)} ${f(c[1] - (e[1] - b[1]) / 6)} ${c[0]} ${c[1]}`;
  }
  return d;
}

/* the drawn series (shapes, not measurements): [x %, y % from the top] */
const LAT = [[0, 75], [12.5, 65], [25, 70], [37.5, 45], [50, 55], [62.5, 30], [75, 40], [87.5, 20], [100, 25]];
const ERR = [[0, 80], [14, 75], [28, 77.5], [42, 65], [56, 70], [70, 35], [80, 20], [90, 50], [100, 60]];
const BARS = [70, 45, 88, 30, 56, 64, 38];
const SCORE = [0.2, 0.35, 0.6, 1, 0.7];

/* a widget's picture. kind: line | bars | alert | score. th: the alert line (% from the top) for a monitor.
   draw: the line draws itself (CSS, so it runs at first paint without the script) */
function Chart({ kind, th = 42, draw = true, className = '' }) {
  const [box, wh] = useBox();
  if (kind === 'bars' || kind === 'score') {
    const V = kind === 'bars' ? BARS.map((v) => v / 100) : SCORE;
    return (
      <div className={'db-ch db-ch-bars ' + kind + (draw ? ' draw ' : ' ') + className}>
        {V.map((v, i) => <span key={i} style={{ '--db-h': v, '--db-i': i }}><i />{kind === 'score' && <em>{i + 1}</em>}</span>)}
      </div>
    );
  }
  const P = px(kind === 'line' ? LAT : ERR, wh);
  const line = curve(P);
  return (
    <div className={'db-ch db-ch-line ' + kind + (draw ? ' draw ' : ' ') + className} ref={box}>
      <svg viewBox={`0 0 ${wh[0]} ${wh[1]}`} aria-hidden="true">
        {[0.25, 0.5, 0.75].map((g) => <line key={g} className="g" x1="0" x2={wh[0]} y1={g * wh[1]} y2={g * wh[1]} />)}
        {kind === 'line' && <path className="area" d={line + ` L${wh[0]} ${wh[1]} L0 ${wh[1]} Z`} />}
        {kind === 'alert' && <rect className="zone" x="0" y="0" width={wh[0]} height={(th / 100) * wh[1]} />}
        <path className="ln" d={line} pathLength="1" />
        {kind === 'alert' && <line className="th" x1="0" x2={wh[0]} y1={(th / 100) * wh[1]} y2={(th / 100) * wh[1]} />}
      </svg>
      {kind === 'alert' && ERR.map(([x, y]) => <i key={x} className={'pt' + (y < th ? ' hot' : '')} style={{ left: x + '%', top: y + '%' }} />)}
    </div>
  );
}

/* ---------- the hero: a saved query, and the widget it draws ---------- */
// [kind, select, group by, picture]
const DEFS = [['widget', 'latency', 'model', 'line'], ['widget', 'traces', 'route', 'bars'], ['monitor', 'error rate', 'service', 'alert'], ['score config', 'rating', 'evaluator', 'score']];

function Saved() {
  const [ref, live] = useSeen(0.3);
  const paused = useStagePause();
  const [at, choose] = useCycle(DEFS.length, 3800, live && !paused);
  const tabs = useRef([]);
  const [peek, setPeek] = useState(-1); // a hovered tab shows a ghost of its picture behind the current one
  const [kind, sel, grp, pic] = DEFS[at];
  const key = (e, i) => {
    const n = DEFS.length;
    const j = e.key === 'ArrowRight' ? (i + 1) % n : e.key === 'ArrowLeft' ? (i - 1 + n) % n : e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : -1;
    if (j < 0) return;
    e.preventDefault();
    choose(j);
    tabs.current[j]?.focus();
  };
  return (
    <div className="kn-obj db-hero" ref={ref}>
      <div className="db-hero-bar">
        <i /><i /><i />
        <span className="db-hero-t">Dashboards</span>
        <div className="db-tabs" role="tablist" aria-label="Saved queries">
          {DEFS.map((d, i) => (
            <button key={i} ref={(el) => { tabs.current[i] = el; }} type="button" role="tab" id={'db-tab-' + i} aria-controls="db-def" aria-selected={at === i} tabIndex={at === i ? 0 : -1} onClick={() => choose(i)} onKeyDown={(e) => key(e, i)} onPointerEnter={(e) => e.pointerType === 'mouse' && setPeek(i)} onPointerLeave={() => setPeek(-1)}>{d[1]}</button>
          ))}
        </div>
      </div>
      <div className="db-hero-b" role="tabpanel" id="db-def" aria-labelledby={'db-tab-' + at}>
        <div className="db-q">
          <pre key={at} aria-hidden="true">
            <span className="db-l" style={{ '--db-i': 0 }}><em>{kind}</em></span>
            <span className="db-l" style={{ '--db-i': 1 }}>select   <b>{sel}</b></span>
            <span className="db-l" style={{ '--db-i': 2 }}>group by <b>{grp}</b></span>
            <span className="db-l" style={{ '--db-i': 3 }}>from     <b>traces</b></span>
          </pre>
          <p className="db-q-say">A dashboard is a saved query</p>
        </div>
        <div className="db-w">
          <p className="db-w-h"><b>{sel}</b> by {grp}<span className={kind === 'widget' ? '' : 'on'}>{kind}</span></p>
          <div className="db-w-c">
            <Chart key={at} kind={pic} />
            {peek >= 0 && peek !== at && <Chart key={'p' + peek} kind={DEFS[peek][3]} className="db-ghost" />}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- the signature: the board builds itself ---------- */
const PARTS = [
  ['Widgets over your own data', 'A widget names what to select and how to group it. Because it queries the store that already holds your traces, a chart cannot drift from what happened.'],
  ['Monitors', 'A saved query you want watched rather than looked at. Same definition as the widget beside it, kept in one place so the alert and the chart cannot disagree.'],
  ['One store, not two', 'Traces, observations and scores live in the service that serves the dashboards. There is no export step, no second database to keep in sync, and nothing to reconcile after an outage.'],
  ['Saved table views', 'The columns, filters and sort you arrived at are a preset you can name and return to. Presets belong to the project, so a colleague opens the view you meant.'],
  ['Scores are yours to define', 'Score configs say what good means for your application — a rating, a label, a number from an evaluator. Dashboards then aggregate the thing you actually care about.'],
  ['Permission per category', "Access is granted by category rather than per object, and the boundary is the organization on your token. Reading somebody else's project is not a URL away."],
];
// each panel's slot on the 12-column board and where it flies in from: [x %, y %, turn deg]
const SLOTS = ['1 / 1 / 3 / 8', '1 / 8 / 3 / 13', '3 / 1 / 5 / 5', '3 / 5 / 5 / 10', '3 / 10 / 4 / 13', '4 / 10 / 5 / 13'];
const FROM = [[-46, -18, -6], [52, -30, 7], [-40, 70, 5], [0, 90, -4], [90, 10, 8], [70, 80, -7]];
const pad = (n) => String(n).padStart(2, '0');

function PanelHead({ t, k }) {
  return <p className="db-ph"><b>{t}</b>{k && <span>{k}</span>}</p>;
}
const PANELS = [
  () => <><PanelHead t="latency by model" k="widget" /><Chart kind="line" draw={false} /></>,
  () => <><PanelHead t="error rate by service" k="monitor" /><Chart kind="alert" draw={false} /></>,
  () => (
    <>
      <PanelHead t="one store" />
      <ul className="db-store">{['Traces', 'observations', 'scores'].map((s, i) => <li key={s} style={{ '--db-i': i }}><i />{s}</li>)}</ul>
    </>
  ),
  () => (
    <>
      <PanelHead t="saved view" k="preset" />
      <div className="db-tbl">
        <div className="db-tbl-chips"><span>columns</span><span>filters</span><span>sort</span></div>
        {Array.from({ length: 5 }, (_, r) => <p key={r}>{[46, 28, 62, 18].map((w, c) => <i key={c} style={{ width: ((w + r * 13 * (c + 1)) % 60) + 26 + '%' }} />)}</p>)}
      </div>
    </>
  ),
  () => <><PanelHead t="rating by evaluator" k="score config" /><Chart kind="score" draw={false} /></>,
  () => (
    <>
      <PanelHead t="organization" k="token" />
      <ul className="db-perm">{['dashboards', 'traces', 'scores'].map((s) => <li key={s}><span>{s}</span><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M4.5 7V5.5a3.5 3.5 0 0 1 7 0V7M3.5 7h9v6.5h-9z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg></li>)}</ul>
    </>
  ),
];

function Fly({ p, k, on, calm, children }) {
  // panel 1 is already in its slot when the run pins (never an empty board); the other five land through the run
  const a = k ? 0.02 + (k - 1) * 0.17 : -1, b = k ? a + 0.13 : -0.5;
  const t = useTransform(p, [a, b], [0, 1], { clamp: true });
  const e = useTransform(t, (v) => 1 - Math.pow(1 - v, 3));
  const [fx, fy, fr] = FROM[k];
  const x = useTransform(e, (v) => `${fx * (1 - v)}%`);
  const y = useTransform(e, (v) => `${fy * (1 - v)}%`);
  const rotate = useTransform(e, (v) => fr * (1 - v));
  const scale = useTransform(e, [0, 1], [0.82, 1]);
  const opacity = useTransform(t, [0, 0.35, 1], [0, 1, 1]);
  return (
    <motion.div className="db-panel" data-on={on ? '' : undefined} style={{ gridArea: SLOTS[k], ...(calm ? {} : { x, y, rotate, scale, opacity }) }}>
      {children}
    </motion.div>
  );
}

/* Wide screens pin the board (CSS, once the script runs); phones get each part then its panel. Both are in the HTML
   and the breakpoint picks one, so nothing swaps after hydration; with JS off the wide layout simply stacks. */
function Build() {
  const run = useRef(null);
  const calm = useCalm();
  const { scrollYProgress: p } = useScroll({ target: run, offset: ['start start', 'end end'] });
  const [at, setAt] = useState(0);
  useMotionValueEvent(p, 'change', (v) => setAt(Math.min(5, Math.max(0, Math.floor(v * 6 * 0.9999)))));
  const fill = useTransform(p, [0, 1], [0, 1]);
  const go = (i) => {
    const el = run.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    scrollToY(top + ((el.offsetHeight - window.innerHeight) * (i + 0.6)) / 6, { duration: 1.1 });
  };
  return (
    <section className="db-build">
      <div className="kn-wrap kn-grid db-build-h" data-enter="curtain">
        <KeynoteLines className="kn-headline db-build-t" lines={['What a dashboard', 'is made of']} />
        <p className="kn-lede db-build-l">Widgets, monitors, saved views and score configs — all of them queries over one store.</p>
      </div>
      <div ref={run} className="db-run db-wide">
        <div className="db-pin">
          <div className="kn-wrap kn-grid db-pin-g">
            <div className="db-say">
              {PARTS.map(([t, d], i) => (
                <article key={t} className="db-say-a" data-on={at === i ? '' : undefined} data-pos={at > i ? 'past' : at < i ? 'next' : 'now'}>
                  <h3 className="kn-headline">{t}</h3>
                  {i !== 1 && <p className="db-d">{d}</p>}
                  <p className="db-n kn-fig">{pad(i + 1)} / 06</p>
                </article>
              ))}
              <nav className="db-rail" aria-label="Parts">
                <span className="db-track" aria-hidden="true"><motion.i style={{ scaleX: fill }} /></span>
                {PARTS.map(([t], i) => <button key={t} type="button" aria-current={at === i ? 'step' : undefined} aria-label={`Part ${i + 1}: ${t}`} onClick={() => go(i)}><span className="kn-fig">{pad(i + 1)}</span></button>)}
              </nav>
            </div>
            <div className="db-board" aria-hidden="true">
              {SLOTS.map((s, i) => <span key={i} className="db-slot" style={{ gridArea: s }} />)}
              {PANELS.map((P, i) => <Fly key={i} p={p} k={i} on={at === i} calm={calm}><P /></Fly>)}
            </div>
          </div>
        </div>
      </div>
      <PhoneBuild />
    </section>
  );
}

/* phones: one sticky board; each part scrolls under it and lands its panel in its slot */
function PhoneBuild() {
  const [at, setAt] = useState(0);
  return (
    <div className="db-narrow db-mob">
      <div className="kn-wrap db-board db-mob-board" aria-hidden="true">
        {SLOTS.map((s, i) => <span key={i} className="db-slot" style={{ gridArea: s }} />)}
        {PANELS.map((P, i) => <div key={i} className="db-panel db-mob-p" style={{ gridArea: SLOTS[i] }} data-in={i <= at ? '' : undefined} data-on={i === at ? '' : undefined}><P /></div>)}
      </div>
      <ol className="kn-wrap db-list">
        {PARTS.map(([t, d], i) => <PhonePart key={t} i={i} t={t} d={i === 1 ? null : d} onSeen={setAt} />)}
      </ol>
    </div>
  );
}
function PhonePart({ i, t, d, onSeen }) {
  const ref = useRef(null);
  const seen = useInView(ref, { amount: 0.6 });
  useEffect(() => { if (seen) onSeen(i); }, [seen, i, onSeen]);
  return (
    <li ref={ref} className="db-li">
      <h3 className="kn-title">{t}</h3>
      {d && <p className="db-d">{d}</p>}
      <p className="db-n kn-fig">{pad(i + 1)} / 06</p>
    </li>
  );
}

/* ---------- Beyond: watch it instead ---------- */
const KINDS = ['widget', 'monitor'];
function Watch() {
  const [mon, setMon] = useState(true);
  const [th, setTh] = useState(42);
  const plot = useRef(null);
  const held = useRef(false);
  const radios = useRef([]);
  const to = (e) => {
    const r = plot.current.getBoundingClientRect();
    setTh(Math.round(Math.min(88, Math.max(12, ((e.clientY - r.top) / r.height) * 100))));
  };
  const key = (e, i) => {
    if (!['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(e.key)) return;
    e.preventDefault();
    const j = 1 - i;
    setMon(KINDS[j] === 'monitor');
    radios.current[j]?.focus();
  };
  return (
    <section className="kn-sec db-watch">
      <div className="kn-wrap kn-grid db-watch-g">
        <div className="db-watch-t">
          <KeynoteLines className="kn-headline" lines="Monitors" />
          <p className="kn-body">A saved query you want watched rather than looked at. Same definition as the widget beside it, kept in one place so the alert and the chart cannot disagree.</p>
          <div className="db-kind" role="radiogroup" aria-label="Saved query kind">
            {KINDS.map((k, i) => {
              const on = mon === (k === 'monitor');
              return <button key={k} ref={(el) => { radios.current[i] = el; }} type="button" role="radio" aria-checked={on} tabIndex={on ? 0 : -1} onClick={() => setMon(k === 'monitor')} onKeyDown={(e) => key(e, i)}>{k}</button>;
            })}
          </div>
        </div>
        <div className="kn-obj db-watch-o" data-enter="stack">
          <div className="db-watch-top">
            <pre aria-label="Saved query"><em key={mon ? 'm' : 'w'}>{mon ? 'monitor' : 'widget'}</em>{'\n'}select   <b>error rate</b>{'\n'}group by <b>service</b>{'\n'}from     <b>traces</b></pre>
            <p className="db-ph"><b>error rate by service</b><span className={mon ? 'on' : ''}>{mon ? 'monitor' : 'widget'}</span></p>
          </div>
          <div
            ref={plot}
            className={'db-plot' + (mon ? ' mon' : '')}
            onPointerDown={(e) => { if (!mon) return; held.current = true; e.currentTarget.setPointerCapture(e.pointerId); to(e); }}
            onPointerMove={(e) => held.current && to(e)}
            onPointerUp={() => { held.current = false; }}
            onPointerCancel={() => { held.current = false; }}
          >
            <Chart kind={mon ? 'alert' : 'line'} th={th} draw={false} className="db-watch-c" />
            {mon && <span className="db-handle" style={{ top: th + '%' }} aria-hidden="true"><i /></span>}
          </div>
          <div className="db-watch-foot">
            <label className={'db-th' + (mon ? '' : ' off')}>
              <span>alert line</span>
              <input type="range" min="12" max="88" value={100 - th} disabled={!mon} onChange={(e) => setTh(100 - +e.target.value)} />
            </label>
            <p className="db-hot" aria-live="polite"><i className={mon ? 'on' : ''} />{mon ? 'watched' : 'looked at'}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- the four words, marked ---------- */
function Figures() {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.4 });
  return (
    <section className="db-figs-s" data-enter="explode">
      <ul ref={ref} className="kn-wrap db-figs" data-in={seen ? '' : undefined}>
        {[['Traces', 'The thing being queried'], ['Scores', 'Yours to define'], ['Monitors', 'Saved and watched'], ['SSO', 'IAM login']].map(([a, b], i) => (
          <li key={a} style={{ '--db-i': i }}><b><span>{a}</span><i aria-hidden="true" /></b><span className="db-figs-d">{b}</span></li>
        ))}
      </ul>
    </section>
  );
}

const SIDE = [['Dashboards', '/dashboards'], ['Logs', '/cloud/logs'], ['Metrics', '/metrics'], ['O11y', '/o11y'], ['AI Metrics', '/cloud/ai-metrics'], ['Billing', '/billing'], ['Plans & Pricing', '/cloud/plans'], ['Sessions', '/cloud/sessions']];
const Arrow = () => <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;

export default function Dashboards() {
  const root = useRef(null);
  useArrivals(root);
  return (
    <main className="kn db" ref={root}>
      <KeynoteStage
        look="split"
        kick="Traces · observations · scores"
        title={['Hanzo Dashboards']}
        lede="A dashboard is a saved query"
        acts={[['GitHub', 'https://github.com/hanzoai/dashboards']]}
        cta="dashboards.hero"
        from={1.05}
      >
        <Saved />
      </KeynoteStage>

      <Build />

      <Watch />

      <Figures />

      <CursorLens className="kn-sec db-start">{(play) => (
        <div className="kn-wrap kn-grid db-start-g">
          <div className="db-start-t">
            <KeynoteLines className="kn-headline" lines={['Start from', 'a trace']} />
            <p className="kn-lede">Send traces from your application, then build the view that answers the question you keep asking about them.</p>
            <div className="kn-acts"><Cta to="https://github.com/hanzoai/dashboards" id="dashboards.start">View on GitHub</Cta></div>
          </div>
          <div className="db-start-o">
            <Lens play={play}><ExampleConsole name="Dashboards" api="/v1/o11y/dashboards" side={SIDE} /></Lens>
            <p className="db-note">Example project. Every name in it is one you would give your own.</p>
          </div>
        </div>
      )}</CursorLens>

      <KeynoteClose
        className="db-close"
        name="Dashboards"
        tag="Composable dashboards"
        repo={['hanzoai/dashboards', 'https://github.com/hanzoai/dashboards']}
        stars="4 stars"
        api="/v1/o11y/dashboards"
        cta="dashboards.close"
        prompt="Read https://hanzo.ai/skill.md and use Hanzo Dashboards in my project. Start with: hanzo o11y dashboards list"
      >
        <div className="db-rel">
          <p className="kn-kick">Related capabilities</p>
          <ul>
            {[['Logs', '/cloud/logs', 'Search every line'], ['Metrics', '/metrics', 'Time series & SLOs']].map(([t, to, d]) => (
              <li key={t}><A to={to} className="db-rel-a"><b>{t}</b><span>{d}</span><Arrow /></A></li>
            ))}
          </ul>
        </div>
      </KeynoteClose>
    </main>
  );
}
