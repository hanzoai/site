'use client';
/* Dashboards.
   V2: 8/10 Apple-style launch: a saved query and the widget it draws are the hero, the board then builds itself panel by panel as you scroll, the monitor's alert line is yours to drag, and the close is the dark room with Hanzo's agent prompt.
   Signature: the board builds itself. "What a dashboard is made of" pins, and as you scroll each of the six parts
   flies into its slot on a blank 12-column board (widget, monitor, one store, saved view, score config, permission),
   so by the last part the dashboard is whole; the words beside it change with each panel that lands.
   Supporting: the Stage hero (the saved query writes itself line by line and its widget draws, cycling through four
   definitions), yellow highlighter marks drawn under the four figures, and the closing dark room opening out.
   Beyond: "Watch it instead". One saved query switched between widget and monitor: only its first word changes, and
   the alert line you drag sits on the same chart, so the alert and the chart cannot disagree (Hanzo's own claim).
   Accent: dashboard yellow, for fills and marks only (text stays ink). Every word and link is Hanzo's; chart values are
   drawn, not measured. */
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { EASE } from '../../ui';
import { A } from '../../kit';
import { Console, useLive, useSteps } from './Frame';
import KeynoteStage from '../../v2/KeynoteStage';
import KeynoteClose from '../../v2/KeynoteClose';
import KeynoteLines from '../../v2/KeynoteLines';
import { useWide } from '../../v2/KeynoteChapters';
import './Dashboards.css';

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

/* a widget's picture. kind: line | bars | alert | score. th: the alert line (% from the top) for a monitor */
function Chart({ kind, th = 42, draw = true, className = '' }) {
  const calm = useReducedMotion();
  const [box, wh] = useBox();
  if (kind === 'bars' || kind === 'score') {
    const V = kind === 'bars' ? BARS.map((v) => v / 100) : SCORE;
    return (
      <div className={'db-ch db-ch-bars ' + kind + ' ' + className}>
        {V.map((v, i) => <span key={i} style={{ '--db-h': v, '--db-i': i }}><i />{kind === 'score' && <em>{i + 1}</em>}</span>)}
      </div>
    );
  }
  const P = px(kind === 'line' ? LAT : ERR, wh);
  const line = curve(P);
  const grow = calm || !draw ? false : { pathLength: 0 };
  return (
    <div className={'db-ch db-ch-line ' + kind + ' ' + className} ref={box}>
      <svg viewBox={`0 0 ${wh[0]} ${wh[1]}`} aria-hidden="true">
        {[0.25, 0.5, 0.75].map((g) => <line key={g} className="g" x1="0" x2={wh[0]} y1={g * wh[1]} y2={g * wh[1]} />)}
        {kind === 'line' && <path className="area" d={line + ` L${wh[0]} ${wh[1]} L0 ${wh[1]} Z`} />}
        {kind === 'alert' && <rect className="zone" x="0" y="0" width={wh[0]} height={(th / 100) * wh[1]} />}
        <motion.path className="ln" d={line} initial={grow} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease: EASE }} />
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
  const [ref, live] = useLive(0.3);
  const [at, choose] = useSteps(DEFS.length, 3800, live);
  const [kind, sel, grp, pic] = DEFS[at];
  return (
    <div className="kn-obj db-hero" ref={ref}>
      <div className="db-hero-bar">
        <i /><i /><i />
        <span className="db-hero-t">Dashboards</span>
        <div className="db-tabs" role="tablist" aria-label="Saved queries">
          {DEFS.map((d, i) => <button key={i} type="button" role="tab" aria-selected={at === i} onClick={() => choose(i)}>{d[1]}</button>)}
        </div>
      </div>
      <div className="db-hero-b">
        <div className="db-q">
          <p className="db-k">saved query</p>
          <pre key={at} aria-hidden="true">
            <span style={{ '--db-i': 0 }}><em>{kind}</em>{'\n'}</span>
            <span style={{ '--db-i': 1 }}>select   <b>{sel}</b>{'\n'}</span>
            <span style={{ '--db-i': 2 }}>group by <b>{grp}</b>{'\n'}</span>
            <span style={{ '--db-i': 3 }}>from     <b>traces</b></span>
          </pre>
          <p className="db-q-say">A dashboard is a saved query</p>
        </div>
        <div className="db-w">
          <p className="db-w-h"><b>{sel}</b> by {grp}<span className={kind === 'widget' ? '' : 'on'}>{kind}</span></p>
          <Chart key={at} kind={pic} className="db-w-c" />
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
  () => <><PanelHead t="rating by evaluator" k="score config" /><Chart kind="score" /></>,
  () => (
    <>
      <PanelHead t="organization" k="token" />
      <ul className="db-perm">{['dashboards', 'traces', 'scores'].map((s) => <li key={s}><span>{s}</span><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M4.5 7V5.5a3.5 3.5 0 0 1 7 0V7M3.5 7h9v6.5h-9z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg></li>)}</ul>
    </>
  ),
];

function Fly({ p, k, on, calm, children }) {
  const a = k * 0.15, b = a + 0.13;
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

function Build() {
  const run = useRef(null);
  const wide = useWide();
  const calm = useReducedMotion();
  const { scrollYProgress: p } = useScroll({ target: run, offset: ['start start', 'end end'] });
  const [at, setAt] = useState(0);
  useMotionValueEvent(p, 'change', (v) => setAt(Math.min(5, Math.max(0, Math.floor(v * 6 * 0.9999)))));
  const fill = useTransform(p, [0, 1], [0, 1]);
  const go = (i) => {
    const el = run.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const y = top + ((el.offsetHeight - window.innerHeight) * (i + 0.6)) / 6;
    window.__lenis ? window.__lenis.scrollTo(y, { duration: 1.1 }) : window.scrollTo({ top: y, behavior: 'smooth' });
  };
  return (
    <section className="db-build">
      <div className="kn-wrap kn-grid db-build-h">
        <KeynoteLines className="kn-display sm db-build-t" lines={['What a dashboard', 'is made of']} />
        <p className="kn-lede db-build-l">Widgets, monitors, saved views and score configs — all of them queries over one store.</p>
      </div>
      {wide ? (
        <div ref={run} className="db-run">
          <div className="db-pin">
            <div className="kn-wrap kn-grid db-pin-g">
              <div className="db-say">
                {PARTS.map(([t, d], i) => (
                  <article key={t} className="db-say-a" data-on={at === i ? '' : undefined} data-pos={at > i ? 'past' : at < i ? 'next' : 'now'}>
                    <p className="db-n kn-fig">{pad(i + 1)} / 06</p>
                    <h3 className="kn-headline">{t}</h3>
                    <p className="db-d">{d}</p>
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
      ) : (
        <ol className="kn-wrap db-list">
          {PARTS.map(([t, d], i) => <PhonePart key={t} i={i} t={t} d={d} />)}
        </ol>
      )}
    </section>
  );
}

/* phones: each part, then its panel landing as it is seen */
function PhonePart({ i, t, d }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.35 });
  const P = PANELS[i];
  return (
    <li ref={ref} className="db-li" data-in={seen ? '' : undefined}>
      <p className="db-n kn-fig">{pad(i + 1)} / 06</p>
      <h3 className="kn-title">{t}</h3>
      <p className="db-d">{d}</p>
      <div className="db-panel db-li-p" aria-hidden="true"><P /></div>
    </li>
  );
}

/* ---------- Beyond: watch it instead ---------- */
function Watch() {
  const [mon, setMon] = useState(true);
  const [th, setTh] = useState(42);
  const plot = useRef(null);
  const held = useRef(false);
  const to = (e) => {
    const r = plot.current.getBoundingClientRect();
    setTh(Math.round(Math.min(88, Math.max(12, ((e.clientY - r.top) / r.height) * 100))));
  };
  return (
    <section className="kn-sec db-watch">
      <div className="kn-wrap kn-grid db-watch-g">
        <div className="db-watch-t">
          <p className="kn-kick">Monitors</p>
          <KeynoteLines className="kn-headline" lines={['The alert and the chart', 'cannot disagree']} />
          <p className="kn-body">A saved query you want watched rather than looked at. Same definition as the widget beside it, kept in one place so the alert and the chart cannot disagree.</p>
          <div className="db-kind" role="radiogroup" aria-label="Saved query kind">
            {['widget', 'monitor'].map((k) => <button key={k} type="button" role="radio" aria-checked={mon === (k === 'monitor')} onClick={() => setMon(k === 'monitor')}>{k}</button>)}
          </div>
        </div>
        <div className="kn-obj db-watch-o">
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

/* ---------- the four figures, marked ---------- */
function Figures() {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.4 });
  return (
    <section className="db-figs-s">
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
  return (
    <main className="kn db" style={{ '--ac': '#d4d4d4', '--ac-ink': '#0a0a0a' }}>
      <KeynoteStage
        look="split"
        size="md"
        kick="Traces · observations · scores"
        title={['Hanzo Dashboards']}
        lede="A dashboard is a saved query"
        acts={[['GitHub', 'https://github.com/hanzoai/dashboards']]}
        from={1.05}
      >
        <Saved />
      </KeynoteStage>

      <Build />

      <Watch />

      <Figures />

      <section className="kn-sec db-start">
        <div className="kn-wrap kn-grid db-start-g">
          <div className="db-start-t">
            <KeynoteLines className="kn-display sm" lines={['Start from', 'a trace']} />
            <p className="kn-lede">Send traces from your application, then build the view that answers the question you keep asking about them.</p>
            <div className="kn-acts"><A to="https://github.com/hanzoai/dashboards" className="kn-btn solid">View on GitHub</A></div>
          </div>
          <div className="db-start-o">
            <Console light name="Dashboards" api="/v1/o11y/dashboards" side={SIDE} />
            <p className="db-note">Example project. Every name in it is one you would give your own.</p>
          </div>
        </div>
      </section>

      <KeynoteClose
        className="db-close"
        name="Dashboards"
        tag="Composable dashboards"
        repo={['hanzoai/dashboards', 'https://github.com/hanzoai/dashboards']}
        stars="4 stars"
        api="/v1/o11y/dashboards"
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
