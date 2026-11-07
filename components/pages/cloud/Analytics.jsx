'use client';
/* Analytics.
   V2: 8/10 Round 3: own hero (title across, the dashboard a full-width stage below with no window chrome, its pause in the board's strip; h1 baseline ~33%, reports peek 56px; copy and stage present at first paint); security switches are real role=switch toggles; one ask pair in the script with the API as a text disclosure; sheets lose the equal-button rows and the 64px non-numbers; phone reports are a snap rail.
   Persona: Developer who runs sites (and the team lead choosing an analytics tool).
   Goal: start Hanzo Analytics (try it, or ask for a demo).
   CTA: "Try Hanzo" → /login (data-cta analytics.hero, data-thumb for the ask bar; again as analytics.script after the
   script); "Request Demo" → /contact-sales (analytics.hero-2, quiet); "Deploy to Cloud" → platform.hanzo.ai/deploy
   (analytics.close). Metric: api_key_created (proxy on this page: the analytics.hero click).
   Signature: "From a visit to a number". Three pinned chapters whose pictures are built by the scroll itself: the
   funnel's steps rise one by one until the cliff step stands hollow, the retention cohorts fill in week by week, and
   revenue bars climb beside the traffic line that produced them, split by channel and campaign.
   Supporting: the split Stage hero (the full-width dashboard settles as you scroll; its activity line draws and its
   figures settle by CSS at first paint, never counting through other digits; the realtime list ticks while seen, with
   the board's own pause in its top strip),
   report cards that open in place into their own living picture, and the anomaly line drawing itself in the dark room.
   Motion kinds: idle (realtime list, line draws), pointer (the chart's hairline names the hour, the magnetic ask),
   time (a visit every 2.4 s), state (cards open, questions, Apply, language tabs), arrival (title cut-in, figures
   settle), scroll (the chapters, the Stage settle, the room opening).
   Beyond: "Ask it as a question". Pick the question you actually have (who is on the site right now, where the drop
   is, whether anyone came back...) and the report card that answers it opens; each question is the report's own words.
   Every word, figure and link is Hanzo's; pages and referrers in the realtime list are examples (as the dashboard says). */
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { motion, animate, useInView, useMotionValue, useMotionValueEvent, useReducedMotion, useTransform } from 'motion/react';
import { EASE } from '../../ui';
import { A, Cta, CodeBlock, Tabs, TabPanel } from '../../kit';
import KeynoteStage from '../../v2/KeynoteStage';
import KeynoteOpen from '../../v2/KeynoteOpen';
import { KeynoteSheet } from '../../v2/KeynoteSpec';
import KeynoteClose from '../../v2/KeynoteClose';
import './Analytics.css';

const mod = (a, n) => ((a % n) + n) % n;

/* [ref, live]: live while the element is on screen and motion is allowed */
function useSeen(amount = 0.25) {
  const ref = useRef(null);
  const seen = useInView(ref, { amount });
  const calm = useReducedMotion();
  return [ref, seen && !calm];
}
/* a section's entrance: the section stands in its final state in the HTML; under .js it waits in its start state
   (Analytics.css, per entrance) until it first comes into view, then data-en plays its one entrance (CSS, < 0.9 s) */
function useEnter(amount = 0.18) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount });
  return [ref, seen ? '' : undefined];
}
function En({ className, children, ...rest }) {
  const [ref, on] = useEnter();
  return <section ref={ref} data-en={on} className={className} {...rest}>{children}</section>;
}
/* calls fn every ms while run is true: a chain of timeouts (no setInterval), the latest fn each time */
function useTick(ms, run, fn) {
  const f = useRef(fn);
  f.current = fn;
  useEffect(() => {
    if (!run) return;
    let t = 0;
    const next = () => { t = setTimeout(() => { f.current(); next(); }, ms); };
    next();
    return () => clearTimeout(t);
  }, [ms, run]);
}

/* ---------- the hero: Hanzo's example dashboard, running ---------- */
const HOURS = [12, 10, 8, 7, 9, 14, 22, 34, 48, 58, 64, 70, 76, 72, 80, 86, 78, 70, 62, 54, 46, 36, 26, 18];
const VISITS = [['/pricing', 'google'], ['/docs/start', 'github.com'], ['/', 'newsletter'], ['/blog/launch', 'x.com'], ['/signup', 'direct']];
/* Hanzo's three figures, exactly as printed: they settle into place (a line mask), they never count */
const KPIS = [['Users', '127,543', '+12.4% vs last week'], ['Conversion Rate', '4.87%', '+0.8% vs last week'], ['Revenue', '$45,892', '+15.2% vs last week']];
const pt = (h, i) => [(i / 23) * 100, 100 - h];
/* the board's own live switch (the demo's pause lives in the board's top strip, not under the ask) */
const Paused = createContext(false);

/* ---------- the signature: the flip board ----------
   One split-flap tile. When its character changes, the upper flap falls and the lower one rises, stepping through the
   few characters before the new one, like a departure board. The characters are drawn from data attributes (CSS
   content), so the page's text stays the real words, held once in a screen-reader span beside the tiles.
   kick: a number; when it goes up the tile does one flap onto the character it already shows (an arrival, never
   another value). */
const CS = ' abcdefghijklmnopqrstuvwxyz0123456789/.-,$%+';
function route(a, b, calm) {
  const ia = CS.indexOf(a), ib = CS.indexOf(b);
  if (calm || ia < 0 || ib < 0) return [b];
  const n = CS.length, dist = (ib - ia + n) % n;
  const out = [];
  for (let k = Math.max(1, dist - 4); k <= dist; k++) out.push(CS[(ia + k) % n]);
  return out.length ? out : [b];
}
function Flap({ ch, d = 0, kick = 0 }) {
  const calm = useReducedMotion();
  const [s, setS] = useState({ cur: ch, prev: ch, n: 0 });
  const shown = useRef(ch);
  useEffect(() => {
    if (ch === shown.current) return;
    const path = route(shown.current, ch, calm);
    let i = 0;
    let t = 0;
    const go = () => {
      const c = path[i++];
      setS((v) => ({ cur: c, prev: v.cur, n: v.n + 1 }));
      shown.current = c;
      if (i < path.length) t = setTimeout(go, 75);
    };
    t = setTimeout(go, d);
    return () => clearTimeout(t);
  }, [ch, d, calm]);
  useEffect(() => {
    if (!kick || calm) return;
    const t = setTimeout(() => setS((v) => ({ cur: v.cur, prev: v.cur, n: v.n + 1 })), d);
    return () => clearTimeout(t);
  }, [kick, d, calm]);
  const { cur, prev, n } = s;
  return (
    <span className={'fl' + (cur === ' ' ? ' sp' : '') + (cur === ',' || cur === '.' ? ' nar' : '')}>
      <i className="fl-h fl-t" data-c={cur} />
      <i className="fl-h fl-b" data-c={n ? prev : cur} />
      {n > 0 && <i key={'a' + n} className="fl-h fl-ft" data-c={prev} />}
      {n > 0 && <i key={'b' + n} className="fl-h fl-fb" data-c={cur} />}
    </span>
  );
}
/* a word or figure as tiles: the real text for readers, the tiles for the eye */
function FlapText({ text, w = text.length, d = 0, step = 22, kick = 0, className = '' }) {
  const s = text.padEnd(w, ' ').slice(0, w);
  return (
    <span className={'fl-w ' + className}>
      <span className="x-sr">{text}</span>
      <span className="fl-row" aria-hidden="true">{[...s].map((c, i) => <Flap key={i} ch={c} d={d + i * step} kick={kick} />)}</span>
    </span>
  );
}
/* the realtime board: each visit lands on the top row and every row flips down one (the rows never move, the tiles
   do). Hover a row to hold it while you read it; tap or press it to pin it (aria-pressed). Pause stops the board. */
const ROWS = 5;
function FlipBoard({ live }) {
  const [k, setK] = useState(0);
  const [hover, setHover] = useState(-1);
  const [pin, setPin] = useState({});
  const paused = useContext(Paused);
  useTick(2400, live && !paused, () => setK((v) => v + 1));
  const rowAt = (j) => VISITS[mod(j - k, VISITS.length)];
  const [frozen, setFrozen] = useState({});
  const hold = (j, on) => setFrozen((f) => { const n = { ...f }; if (on) n[j] = n[j] || rowAt(j); else delete n[j]; return n; });
  return (
    <div className="an-fb-board">
      <p className="an-rt-h"><i />Realtime</p>
      <ul className="an-fb-rows">
        {Array.from({ length: ROWS }, (_, j) => {
          const held = !!pin[j] || hover === j;
          const [page, ref] = held && frozen[j] ? frozen[j] : rowAt(j);
          return (
            <li key={j}>
              <button
                type="button"
                className={'an-fb-row' + (held ? ' held' : '')}
                aria-pressed={!!pin[j]}
                onPointerEnter={(e) => { if (e.pointerType === 'mouse') { hold(j, true); setHover(j); } }}
                onPointerLeave={(e) => { if (e.pointerType === 'mouse') { setHover(-1); if (!pin[j]) hold(j, false); } }}
                onClick={() => { const on = !pin[j]; hold(j, on || hover === j); setPin((p) => ({ ...p, [j]: on })); }}
              >
                <i className="an-fb-dot" aria-hidden="true" />
                <FlapText text={page} w={12} d={j * 90} />
                <FlapText text={ref} w={10} d={j * 90 + 140} className="an-fb-ref" />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* the size of a drawing area in pixels, so a line can be drawn in real pixels (an even stroke, an exact length) */
function useBox(w0 = 600, h0 = 240) {
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
/* a smooth curve through the points (Catmull-Rom as cubic Béziers) */
function curve(P) {
  let d = `M${P[0][0]} ${P[0][1]}`;
  for (let i = 0; i < P.length - 1; i++) {
    const a = P[i - 1] || P[i], b = P[i], c = P[i + 1], e = P[i + 2] || c;
    const f = (v) => +v.toFixed(1);
    d += ` C${f(b[0] + (c[0] - a[0]) / 6)} ${f(b[1] + (c[1] - a[1]) / 6)} ${f(c[0] - (e[0] - b[0]) / 6)} ${f(c[1] - (e[1] - b[1]) / 6)} ${c[0]} ${c[1]}`;
  }
  return d;
}
const poly = (P) => P.map(([x, y], i) => (i ? 'L' : 'M') + x + ' ' + y).join(' ');

/* the activity chart: the line draws itself by CSS at first paint; a hairline follows the pointer and the hour it
   points at is read out in the chart's own header (in the flow, never over the chart) */
function Activity() {
  const [at, setAt] = useState(-1);
  const [box, wh] = useBox();
  const P = px(HOURS.map(pt), wh);
  const line = curve(P);
  const area = line + ` L${wh[0]} ${wh[1]} L0 ${wh[1]} Z`;
  const move = (e) => {
    if (e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    setAt(Math.round(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)) * 23));
  };
  const [x, y] = pt(HOURS[at < 0 ? 23 : at], at < 0 ? 23 : at);
  return (
    <div className="an-live">
      <div className="an-live-h">
        <p>Live User Activity</p>
        <span className="an-at kn-fig" aria-hidden="true">{at >= 0 ? String(at).padStart(2, '0') + ':00' : ''}</span>
        <span>Pageviews</span><b className="kn-fig">1,240</b><b className="kn-fig dim">876</b><em>+24.5%</em>
      </div>
      <div className="an-chart" ref={box} onPointerMove={move} onPointerLeave={() => setAt(-1)}>
        <svg viewBox={`0 0 ${wh[0]} ${wh[1]}`} aria-hidden="true">
          {[0.25, 0.5, 0.75].map((g) => <line key={g} x1="0" x2={wh[0]} y1={g * wh[1]} y2={g * wh[1]} className="an-grid" />)}
          <path d={area} className="an-area" />
          <path d={line} className="an-line" pathLength="1" />
        </svg>
        <span className={'an-now' + (at < 0 ? '' : ' hold')} style={{ left: x + '%', top: y + '%' }} aria-hidden="true" />
        {at >= 0 && <span className="an-hair" style={{ left: x + '%' }} aria-hidden="true" />}
      </div>
      <div className="an-axis">{['00:00', '06:00', '12:00', '18:00', '24:00'].map((h) => <span key={h}>{h}</span>)}</div>
    </div>
  );
}

function Board() {
  const [ref, live] = useSeen(0.25);
  const [paused, setPaused] = useState(false);
  /* the KPI tiles flap once onto Hanzo's figures as the board opens (one flap each, never another number) */
  const [kick, setKick] = useState(0);
  useEffect(() => { const t = setTimeout(() => setKick(1), 120); return () => clearTimeout(t); }, []);
  return (
    <div className="kn-obj an-board" ref={ref} data-paused={paused ? '' : undefined}>
      <div className="an-bar">
        <button type="button" className="an-live-btn" aria-pressed={paused} aria-label="Pause" onClick={() => setPaused((v) => !v)}>
          {paused
            ? <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M4.5 3v10l8.5-5z" fill="currentColor" /></svg>
            : <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><rect x="4" y="3" width="2.6" height="10" rx="1" fill="currentColor" /><rect x="9.4" y="3" width="2.6" height="10" rx="1" fill="currentColor" /></svg>}
        </button>
        <span>Hanzo Analytics Dashboard</span><em>example</em>
        <p className="kn-kick an-bar-k">Web analytics you host yourself</p>
      </div>
      <Paused.Provider value={paused}>
      <div className="an-kpis">
        {KPIS.map(([t, v, ch], i) => (
          <div key={t} className="an-kpi">
            <p>{t}</p>
            <b className="an-kfig"><FlapText text={v} d={i * 120} step={45} kick={kick} className="lt" /></b>
            <span>{ch}</span>
          </div>
        ))}
      </div>
      <div className="an-main">
        <FlipBoard live={live} />
        <Activity />
      </div>
      </Paused.Provider>
    </div>
  );
}

/* ---------- the five reports, as cards that open into their own picture ---------- */
const REPORTS = [
  { id: 'realtime', title: 'Realtime', ask: ['Who is on the site right now'], d: 'Who is on the site right now, which page they are on and how they got there. Useful the hour you ship something and the hour something breaks.' },
  { id: 'journeys', title: 'Journeys', ask: ['The route people actually took'], d: 'The route people actually took through the site, laid out as a tree. It rarely matches the one in the navigation, and that gap is the finding.' },
  { id: 'funnels', title: 'Funnels, goals and retention', ask: ['Where the drop is', 'Whether anyone came back'], d: 'Define the steps and see where the drop is. Goals count the thing you care about, and retention answers the harder question of whether anyone came back.' },
  { id: 'events', title: 'Events', ask: ['Track a click or a signup'], d: 'Track a click or a signup with a name and a few properties. No schema to declare up front and nothing to migrate when you add one.' },
  { id: 'attribution', title: 'Attribution and UTM', ask: ['Which channel, campaign and referrer brought the session that converted'], d: 'Which channel, campaign and referrer brought the session that converted — including the touch that started it, not only the one that closed it.' },
];

function ArtRealtime() {
  return (
    <div className="an-art an-art-rt">
      {VISITS.slice(0, 4).map(([p, r], i) => <p key={p} style={{ '--an-i': i }}><i /><b>{p}</b><span>{r}</span></p>)}
    </div>
  );
}
function ArtJourneys() {
  return (
    <div className="an-art an-art-j">
      <svg viewBox="0 0 240 150" aria-hidden="true">
        <path className="an-j-p" d="M24 75 C70 75 70 34 116 34 M24 75 C70 75 70 116 116 116 M116 34 C162 34 162 20 208 20 M116 34 C162 34 162 56 208 56 M116 116 C162 116 162 116 208 116" />
        <path className="an-j-hot" d="M24 75 C70 75 70 116 116 116 C162 116 162 116 208 116" />
        {[[24, 75], [116, 34], [116, 116], [208, 20], [208, 56]].map(([x, y]) => <circle key={x + '-' + y} cx={x} cy={y} r="7" />)}
        <circle className="hot" cx="208" cy="116" r="8" />
      </svg>
    </div>
  );
}
function ArtFunnel() {
  return (
    <div className="an-art an-art-f">
      {[100, 82, 76, 31, 27].map((w, k) => <span key={k} style={{ '--an-w': w / 100, '--an-i': k }} className={k === 3 ? 'cliff' : ''}><i /></span>)}
    </div>
  );
}
function ArtEvents() {
  return (
    <div className="an-art an-art-e">
      {[['signup', '{ … }'], ['button_click', "{ buttonId: 'signup_button' }"], ['purchase_completed', "{ currency: 'USD' }"], ['signup', '{ … }']].map(([e, p], k) => <p key={k} style={{ '--an-i': k }}><b>{e}</b> <span>{p}</span></p>)}
    </div>
  );
}
function ArtAttribution() {
  return (
    <div className="an-art an-art-a">
      <div className="an-a-bar">{[['channel', 34], ['campaign', 41], ['referrer', 25]].map(([l, w], k) => <span key={l} style={{ flexGrow: w, '--an-i': k }}><em>{l}</em></span>)}</div>
      <div className="an-a-ends"><span>the touch that started it</span><span>the one that closed it</span></div>
    </div>
  );
}
const ARTS = [ArtRealtime, ArtJourneys, ArtFunnel, ArtEvents, ArtAttribution];

const Arrow = () => <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;

function Reports() {
  const grid = useRef(null);
  const [q, setQ] = useState(-1);
  const ask = REPORTS.flatMap((r, i) => r.ask.map((t) => [t, i]));
  const open = (k, i) => { setQ(k); grid.current?.querySelectorAll('.kno-card')[i]?.click(); };
  const [en, on] = useEnter(0.12);
  // idle: while the cards are seen and nobody points at them, each one plays its picture in turn, one round, then rests
  const seen = useInView(grid, { amount: 0.3 });
  const calm = useReducedMotion();
  const [held, setHeld] = useState(false);
  useEffect(() => {
    const cards = grid.current ? [...grid.current.querySelectorAll('.kno-card')] : [];
    if (!seen || held || calm || !cards.length) return;
    let k = 0, t;
    const step = () => {
      cards.forEach((c, j) => c.classList.toggle('an-walk', j === k));
      k += 1;
      t = setTimeout(k <= cards.length ? step : () => cards.forEach((c) => c.classList.remove('an-walk')), 2400);
    };
    t = setTimeout(step, 500);
    return () => { clearTimeout(t); cards.forEach((c) => c.classList.remove('an-walk')); };
  }, [seen, held, calm]);
  return (
    <section ref={en} data-en={on} className="kn-sec an-rep en-focus">
      <div className="kn-wrap">
        <div className="kn-grid an-rep-h">
          <div className="an-rep-ht">
            <h2 className="kn-headline">The reports</h2>
            <p className="kn-lede">Each one answers a question you would otherwise export a CSV to answer.</p>
          </div>
          <div className="an-ask">
            <div className="an-ask-q" role="group" aria-label="Ask it as a question">
              {ask.map(([t, i], k) => (
                <button key={t} type="button" aria-haspopup="dialog" aria-pressed={q === k} onClick={() => open(k, i)}>
                  <span>{t}</span>
                  <Arrow />
                </button>
              ))}
            </div>
            <p className="kn-kick">Ask it as a question</p>
          </div>
        </div>
        <div ref={grid} className="an-rep-grid" onPointerEnter={() => setHeld(true)} onFocus={() => setHeld(true)}>
          <KeynoteOpen
            cols={3}
            items={REPORTS.map((r, i) => {
              const Art = ARTS[i];
              return { id: r.id, kick: String(i + 1).padStart(2, '0'), title: r.title, sub: r.ask.join(' · '), art: <Art />, body: <p>{r.d}</p> };
            })}
          />
        </div>
      </div>
    </section>
  );
}

/* ---------- the signature: from a visit to a number, built by the scroll ---------- */

/* progress for a chapter picture: the scroll through it on desktop (p); on phones it builds once when seen */
function useBuild(p, on) {
  const calm = useReducedMotion();
  // the first render matches the server's (empty) picture; reduced motion completes it right after, never by scroll
  const own = useMotionValue(0);
  useEffect(() => {
    if (calm) { own.set(1); return; }
    if (p || !on) return;
    const c = animate(own, 1, { duration: 1.4, ease: EASE });
    return () => c.stop();
  }, [p, on, calm, own]);
  return calm ? own : p || own;
}
/* map the build onto a sub-range so the picture is complete well before the chapter ends */
function useSpan(src, a, b) {
  return useTransform(src, [a, b], [0, 1], { clamp: true });
}
function useStepsOf(src, n) {
  const [k, setK] = useState(() => Math.round(src.get() * n));
  useMotionValueEvent(src, 'change', (v) => setK(Math.round(v * n)));
  useEffect(() => setK(Math.round(src.get() * n)), [src, n]);
  return k;
}

const STEPS = [100, 82, 76, 31, 27];
const Drop = () => <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M6 6l12 12M18 9v9H9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
function Bar({ b, k, w, cliff, drop }) {
  const s = useSpan(b, k * 0.08, 0.16 + k * 0.08);
  const sy = useTransform(s, (v) => v * w);
  return (
    <div className={'an-fb' + (cliff ? ' cliff' : '')}>
      <span className="an-fb-col"><motion.i style={{ scaleY: sy }} /></span>
      <em>{cliff && <motion.span className="an-cliff" style={{ opacity: drop }}><Drop /></motion.span>}Step {k + 1}</em>
    </div>
  );
}
function FunnelScene({ p, on }) {
  const b = useBuild(p, on);
  const drop = useSpan(b, 0.42, 0.56);
  return (
    <div className="kn-obj an-sc an-sc-f">
      <p className="kn-kick an-sc-k">Funnels and goals</p>
      <div className="an-fbars">
        {STEPS.map((w, k) => <Bar key={k} b={b} k={k} w={w / 100} cliff={k === 3} drop={drop} />)}
      </div>
      <p className="an-sc-note">The step with the cliff is the one worth a week of work.</p>
    </div>
  );
}

const WEEKS = 8;
const COH = 6;
function RetentionScene({ p, on }) {
  const b = useBuild(p, on);
  const total = Array.from({ length: COH }, (_, r) => WEEKS - r).reduce((a, x) => a + x, 0);
  const s = useSpan(b, 0.04, 0.7);
  const n = useStepsOf(s, total);
  let idx = 0;
  return (
    <div className="kn-obj an-sc an-sc-r">
      <p className="kn-kick an-sc-k">Retention by the week someone arrived</p>
      <div className="an-coh" aria-hidden="true">
        {Array.from({ length: COH }, (_, r) => (
          <div key={r} className="an-coh-r">
            <span className="an-coh-l">W{r + 1}</span>
            {Array.from({ length: WEEKS }, (_, c) => {
              if (c >= WEEKS - r) return <i key={c} className="none" />;
              const shown = idx++ < n;
              const v = c === 0 ? 1 : Math.max(0.14, 0.62 - c * 0.07 + (r % 3) * 0.03);
              return <i key={c} className={shown ? 'on' : ''} style={{ '--an-v': v }} />;
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

const TRAFFIC = [30, 38, 34, 46, 52, 48, 60, 66, 58, 72];
const REV = [[10, 6], [14, 8], [12, 6], [18, 10], [22, 12], [18, 10], [26, 14], [30, 16], [24, 12], [34, 18]];
function RevBar({ b, k, ch, ca }) {
  const s = useSpan(b, 0.08 + k * 0.05, 0.3 + k * 0.05);
  return (
    <span className="an-rb">
      <motion.i className="ca" style={{ height: ca + '%', scaleY: s }} />
      <motion.i className="ch" style={{ height: ch + '%', scaleY: s }} />
    </span>
  );
}
function RevenueScene({ p, on }) {
  const b = useBuild(p, on);
  const draw = useSpan(b, 0.02, 0.5);
  const [box, wh] = useBox(600, 400);
  const line = curve(px(TRAFFIC.map((v, i) => [5 + (i / (TRAFFIC.length - 1)) * 90, 100 - v]), wh));
  return (
    <div className="kn-obj an-sc an-sc-v">
      <div className="an-v-key"><span><i className="t" />traffic</span><span><i className="ch" />channel</span><span><i className="ca" />campaign</span></div>
      <div className="an-v-plot" ref={box}>
        <svg viewBox={`0 0 ${wh[0]} ${wh[1]}`} aria-hidden="true"><motion.path d={line} style={{ pathLength: draw }} /></svg>
        <div className="an-v-bars">{REV.map(([ch, ca], k) => <RevBar key={k} b={b} k={k} ch={ch} ca={ca} />)}</div>
      </div>
      <p className="an-sc-note">Revenue shows up beside the traffic that produced it.</p>
    </div>
  );
}
const SCENES = [FunnelScene, RetentionScene, RevenueScene];
const VISIT = [
  ['Where they stop', 'Build the funnel from steps you already track and read the drop between them. The step with the cliff is the one worth a week of work.', 'Funnels and goals'],
  ['Whether they return', 'Retention by the week someone arrived. Growth that comes only from new visitors looks identical to growth that lasts, until you look at this.', 'Retention and journeys'],
  ['What it was worth', 'Send the order value with the event and revenue shows up beside the traffic that produced it, split by channel and campaign.', 'Revenue and attribution'],
];
/* "From a visit to a number" as one quick section (no pinned stage): three cards side by side, each picture building
   itself once when the row is seen. Entrance: noise-dissolve. */
function Visit() {
  const [en, on] = useEnter(0.15);
  const calm = useReducedMotion();
  return (
    <section ref={en} data-en={on} className="kn-sec an-visit en-noise">
      <div className="kn-wrap">
        <div className="an-ch-head">
          <h2 className="kn-headline">{'From a visit '}<br />to a number</h2>
          <div className="an-ch-r">
            <p className="kn-lede">A pageview is not worth much on its own. It gets interesting once it is joined to the step someone stopped at, the campaign that sent them and the money that followed.</p>
            <Cta to="https://docs.hanzo.ai/docs/projects/hanzoai/insights" kind="link" id="analytics.reports-docs">Read how reports work</Cta>
          </div>
        </div>
        <ol className="an-visit-g">
          {VISIT.map(([t, d, tag], i) => {
            const S = SCENES[i];
            return (
              <li key={t}>
                <div className="an-visit-pic"><S on={on !== undefined || !!calm} /></div>
                <h3 className="kn-title">{t}</h3>
                <p className="an-visit-d">{d}</p>
                <p className="kn-kick">{tag}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/* "Add the script", moved up to follow the reports (the action before the explanation). Entrance: ripple. */
function AddScript() {
  const [en, on] = useEnter(0.15);
  return (
    <section ref={en} data-en={on} className="kn-sec an-add en-ripple">
      <div className="kn-wrap kn-grid an-add-g">
        <div className="an-add-t">
          <h2 className="kn-headline">Add the script</h2>
          <p className="kn-lede">One tag on the page and the dashboard fills in on its own. Host it yourself or let us run it — the software is the same either way.</p>
          <ol className="an-add-l">
            {[['One tag', 'Paste it into the head of your site. Pageviews start arriving before you have decided what to name anything.'], ['Your data stays yours', 'The events live in your own Postgres, MySQL or MariaDB. Nothing is sampled, and nothing is held back from an export.'], ['Open source, MIT', 'Run it on a small server for as long as you like. The hosted version is the same code with the operations taken care of.']].map(([t, d], i) => <li key={t}><span className="kn-fig">{String(i + 1).padStart(2, '0')}</span><div><b>{t}</b><p>{d}</p></div></li>)}
          </ol>
          <div className="kn-acts">
            <Cta to="/login" kind="quiet" id="analytics.script">Try Hanzo</Cta>
            <Cta to="/contact-sales" kind="link" id="analytics.script-2">Request Demo</Cta>
          </div>
          <p className="an-nocard">No credit card required.</p>
          {/* the API is a text disclosure under the ask pair, so the pair is the only ask here */}
          <div className="an-disc"><KeynoteSheet label="A script, then an API" title="A script, then an API"><ApiSheet /></KeynoteSheet></div>
        </div>
        <div className="an-add-o"><Script /></div>
      </div>
    </section>
  );
}

/* ---------- if you sell something: the commerce board ---------- */
function Commerce() {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.4 });
  return (
    <div className="kn-obj an-shop" ref={ref} data-in={seen ? '' : undefined}>
      <div className="an-shop-h"><p>Commerce Dashboard</p><em>example</em></div>
      <div className="an-shop-k">
        <div><p>Sales Performance</p><b className="an-kfig"><FlapText text="4.78%" step={50} kick={seen ? 1 : 0} className="lt lg" /></b><span>+0.6%</span></div>
        <div><p>Avg. Order Value</p><b className="an-kfig"><FlapText text="$87.32" d={150} step={50} kick={seen ? 1 : 0} className="lt lg" /></b><span>+2.4%</span></div>
      </div>
      <p className="kn-kick an-shop-s">Product Recommendations</p>
      <ul>
        {[['Premium Headphones', 98], ['Wireless Keyboard', 85], ['Smart Watch', 79]].map(([t, v], i) => (
          <li key={t} style={{ '--an-w': v / 100, '--an-i': i }}><span>{t}</span><i><b /></i><em className="kn-fig">{v}</em></li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- the dark room: AI analysis in action ---------- */
function Apply() {
  const [done, setDone] = useState(false);
  return (
    <button type="button" className={'an-apply' + (done ? ' done' : '')} aria-pressed={done} onClick={() => setDone((v) => !v)}>
      <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" /></svg>
      Apply Recommendation
    </button>
  );
}
const ANOM = [[0, 30], [10, 28], [20, 29], [30, 27], [40, 28], [50, 26], [58, 8], [66, 24], [76, 27], [86, 26], [100, 27]];
function AiPanel() {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.35 });
  const [box, wh] = useBox(400, 96);
  const line = poly(px(ANOM.map(([x, y]) => [x, y * 2.5]), wh));
  return (
    <div className="an-ai-p" ref={ref} data-in={seen ? '' : undefined}>
      <p className="an-ai-ph"><i />AI Analysis in Action</p>
      <div className="an-anom">
        <div className="an-anom-h"><b>Traffic Anomaly Detection</b><span className="an-flag">Anomaly Detected</span></div>
        <div className="an-anom-plot" ref={box}>
          <svg viewBox={`0 0 ${wh[0]} ${wh[1]}`} aria-hidden="true"><path d={line} pathLength="1" /></svg>
          <span className="an-spike" aria-hidden="true" />
        </div>
        <div className="an-anom-f"><p>Unusual traffic spike</p><p className="an-conf">Confidence: 98.7%</p></div>
      </div>
      <p className="kn-kick an-ai-s">AI Insights</p>
      <ul className="an-ins">
        {[['Traffic Anomaly', 'Unusual spike detected at 14:32 UTC'], ['Conversion Opportunity', 'Checkout abandonment 23% higher on mobile'], ['Performance Alert', 'API latency increased by 150ms']].map(([a, b], i) => (
          <li key={a} style={{ '--an-i': i }}><b>{a}</b><span>{b}</span></li>
        ))}
      </ul>
      <div className="an-rec">
        <p className="kn-kick an-ai-s">AI Recommendation</p>
        <p className="an-rec-t">Based on the traffic pattern analysis, we recommend scaling your infrastructure in the US-West region for the next 3 hours.</p>
        <Apply />
      </div>
    </div>
  );
}

/* ---------- the script, and the API behind it ---------- */
const JS = `import { HanzoAnalytics } from 'hanzo-analytics';

// Initialize analytics with your project ID
const analytics = new HanzoAnalytics('YOUR_PROJECT_ID');

// Track page views automatically
analytics.trackPageViews();

// Track custom events
analytics.track('button_click', {
  buttonId: 'signup_button',
  page: '/home'
});`;

const FULL = `// Initialize Hanzo Analytics in your app
import { HanzoAnalytics } from 'hanzo-analytics';

// Configure your instance
const analytics = new HanzoAnalytics({
  projectId: 'YOUR_PROJECT_ID',
  options: {
    autoPageviews: true,
    trackClicks: true,
    debugMode: false
  }
});

// Track custom events
analytics.track('purchase_completed', {
  productId: 'prod_123',
  price: 89.99,
  currency: 'USD'
});

// Identify users
analytics.identify('user_123', {
  name: 'Jane Smith',
  email: 'jane@example.com',
  plan: 'premium'
});`;

/* the kit's CodeBlock, with the editor's line numbers in a gutter beside it (in the flow, the code's own column) */
function Script() {
  const n = JS.split('\n').length;
  return (
    <div className="an-script">
      <div className="an-script-code">
        <ol className="an-gut" aria-hidden="true">{Array.from({ length: n }, (_, i) => <li key={i}>{i + 1}</li>)}</ol>
        <CodeBlock code={JS} label="analytics.js" />
      </div>
      <CodeBlock className="an-npm" code="npm install hanzo-analytics" prompt />
    </div>
  );
}

const LANGS = ['JavaScript', 'Python', 'API'];
function ApiSheet() {
  const [lang, setLang] = useState(0);
  return (
    <div className="an-api">
      <p className="kn-lede">The tag collects pageviews on its own. Everything past that is a function call.</p>
      <div className="an-code">
        <Tabs id="an-lang" label="Language" tabs={LANGS} value={lang} onChange={setLang} />
        <TabPanel id="an-lang" i={0} value={lang}>
          <CodeBlock code={FULL} label="JavaScript" />
          {/* Hanzo's page links the sample's address (Cloudflare's email guard); the kit's CodeBlock is plain text, so the link sits under it */}
          <p className="an-code-note"><A to="/cdn-cgi/l/email-protection">jane@example.com</A></p>
        </TabPanel>
        {LANGS.slice(1).map((l, j) => (
          <TabPanel key={l} id="an-lang" i={j + 1} value={lang} className="an-other">
            <p className="kn-title">{l}</p>
            <Cta to="https://docs.hanzo.ai/docs/openapi" kind="quiet" id={'analytics.api-' + l.toLowerCase()}>API Reference</Cta>
          </TabPanel>
        ))}
      </div>
      <p className="kn-kick">What you are signing up for</p>
      <ul className="an-sign">
        {[['Your database, your rows', 'It runs against Postgres, MySQL or MariaDB — one you already operate. The raw events stay somewhere you can query directly.'], ['Many sites, one install', 'Add a site, get a tracking id. Group people into teams, and share a board with someone who should not have an account.'], ['Open source, MIT', 'Read it, fork it, run it on a small server for as long as you like. The hosted version exists so you do not have to.']].map(([t, d]) => <li key={t}><b>{t}</b><span>{d}</span></li>)}
      </ul>
      <div className="kn-acts">
        <Cta to="https://docs.hanzo.ai/docs/analytics" kind="quiet" id="analytics.api-docs">View Documentation</Cta>
        <Cta to="https://docs.hanzo.ai/docs/openapi" kind="link" id="analytics.api-ref">API Reference</Cta>
        <Cta to="https://github.com/hanzoai/insights" kind="link" id="analytics.api-examples">Example Projects</Cta>
      </div>
    </div>
  );
}

/* ---------- security: the features as a settings panel, the audit as a document ---------- */
const FEATS = ['End-to-end encryption', 'Data residency controls', 'Custom data retention policies', 'Role-based access control', 'Regular security audits', 'Privacy-focused data collection', 'Automated compliance monitoring'];
function SecPanel() {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.3 });
  const [on, setOn] = useState(() => FEATS.map(() => true));
  const [touched, setTouched] = useState(false);
  const flip = (i) => {
    setTouched(true);
    setOn((v) => v.map((x, j) => (j === i ? !x : x)));
    dispatchEvent(new CustomEvent('hz-sound', { detail: 'tick' }));
  };
  return (
    <ul ref={ref} className="kn-obj an-feats" data-in={seen ? '' : undefined} data-touched={touched ? '' : undefined}>
      {FEATS.map((f, i) => (
        <li key={f} style={{ '--an-i': i }}>
          <button type="button" role="switch" aria-checked={on[i]} onClick={() => flip(i)}>
            <span>{f}</span><i className="an-sw" aria-hidden="true" />
          </button>
        </li>
      ))}
    </ul>
  );
}
function AuditDoc() {
  return (
    <div className="an-doc">
      <div className="an-doc-pg" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="20" height="20"><path d="M7 3h7l4 4v14H7z M14 3v4h4 M10 12h5 M10 15.5h5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" /></svg>
        <span /><span /><span /><span />
      </div>
      <p><b>Continual internal audits</b> Report on request.</p>
    </div>
  );
}

/* ---------- community: the repository as an object (a contribution grid that fills in), then the resources ---------- */
const CW = 26;
const contrib = (c, r) => { const v = (c * 7 + r * 13 + c * r) % 11; return v < 3 ? 0 : v < 6 ? 1 : v < 9 ? 2 : 3; };
function Repo() {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.4 });
  return (
    <A to="https://github.com/hanzoai/insights" className="kn-obj an-repo">
      <span className="an-repo-h">
        <svg viewBox="0 0 16 16" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38v-1.33c-2.23.48-2.7-1.07-2.7-1.07-.36-.92-.89-1.17-.89-1.17-.73-.5.06-.49.06-.49.8.06 1.23.83 1.23.83.72 1.23 1.88.87 2.34.67.07-.52.28-.87.51-1.07-1.78-.2-3.65-.89-3.65-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" /></svg>
        <b>Open source, MIT</b>
        <Arrow />
      </span>
      <span ref={ref} className="an-repo-g" aria-hidden="true" data-in={seen ? '' : undefined}>
        {Array.from({ length: CW }, (_, c) => (
          <span key={c} style={{ '--an-c': c }}>{Array.from({ length: 7 }, (_, r) => <i key={r} data-l={contrib(c, r)} />)}</span>
        ))}
      </span>
    </A>
  );
}

/* ---------- community and resources ---------- */
const RES =[['Documentation', 'Comprehensive guides and API references', 'https://docs.hanzo.ai/docs/analytics'], ['Community Forum', 'Join discussions with developers and AI experts', 'https://discord.gg/XthHQQj'], ['Examples', 'Sample projects showcasing Hanzo Analytics', 'https://github.com/hanzoai/insights'], ['Support', 'Get help from our team and community', '/support']];

export default function Analytics() {
  return (
    <main className="kn an">
      <KeynoteStage
        look="split"
        className="an-hero"
        title={['Hanzo Analytics']}
        lede="Traffic, sessions and revenue for the sites you run, in a dashboard you can read without training."
        acts={[['Try Hanzo', '/login'], ['Request Demo', '/contact-sales']]}
        cta="analytics.hero"
        from={1.08}
        pause={false}
      >
        <Board />
      </KeynoteStage>

      <Reports />

      <AddScript />

      <Visit />

      <En className="kn-sec an-sell en-stretch">
        <div className="kn-wrap kn-grid an-sell-g">
          <div className="an-sell-obj"><Commerce /></div>
          <div className="an-sell-t">
            <h2 className="kn-headline">If you sell something</h2>
            <p className="kn-lede">Revenue is a report here, not an integration you buy on top.</p>
            <ol className="an-sell-l">
              {[['Revenue beside the traffic', 'Send an amount and a currency with the event and it lands in the same reports as everything else. Totals, order values and the sessions behind them.'], ['Which campaign paid for itself', 'Attribution splits revenue across the channels and campaigns that touched the session, so spend can be argued with numbers rather than instinct.'], ['The checkout, step by step', 'Cart to payment as a funnel, with the abandonment rate per step. Add a goal for the one step you would defend in a meeting.']].map(([t, d]) => <li key={t}><h3 className="an-h3">{t}</h3><p>{d}</p></li>)}
            </ol>
          </div>
        </div>
      </En>

      {/* the one graphite room: it simply is dark (no scrubbed opening); its cards are dealt onto the table */}
      <En className="kn-sec an-ai en-deal" data-room="dark">
        <div className="kn-wrap kn-grid an-ai-g">
          <div className="an-ai-t">
            <h2 className="kn-headline">{'AI-Powered '}<br />{'Observability '}<br />&amp; Monitoring</h2>
            <p className="kn-lede">Proactively identify issues and opportunities with AI-powered insights and monitoring.</p>
            <ul className="an-ai-l">
              {[['Real-time anomaly detection', 'Automatically identify unusual patterns and potential issues before they impact your business.'], ['Predictive alerts and proactive monitoring', 'Get alerted about potential problems before they occur with AI-powered predictive monitoring.'], ['Deep integration with Hanzo Cloud and Base', 'Connect your analytics with your entire infrastructure for comprehensive visibility.']].map(([t, d]) => <li key={t}><b>{t}</b><span>{d}</span></li>)}
            </ul>
          </div>
          <div className="an-ai-o"><AiPanel /></div>
        </div>
      </En>

      {/* the spec, page-local: plain rows that stand (no fade-in), the panel and the audit card as its objects */}
      <section className="kn-sec kfs an-spec">
        <div className="kn-wrap">
          <div className="kfs-h">
            <h2 className="kn-headline">Enterprise-Grade Security &amp; Compliance</h2>
            <p className="kn-kick">Hanzo Analytics</p>
            <p className="kn-lede">Secure by design, ensuring your data meets stringent compliance standards.</p>
          </div>
          <dl className="kfs-rows">
            {[
              ['Security Features', <SecPanel />],
              ['Security and assurance', <AuditDoc />],
              ['Data protection', <p>EU data handling, deletion, and export on request.</p>],
              ['Privacy by design', <p>Collected because it is used, not because it can be.</p>],
              ['Data Privacy Commitment', <div className="an-commit"><p>Hanzo Analytics collects what a report uses and nothing else. You choose where the data lives, how long it is kept, and who on your team can read it, and you can export or delete it on request.</p><A to="/legal/privacy" className="an-more">Read our privacy policy →</A></div>],
            ].map(([k, v]) => <div key={k} className="kfs-row kn-grid"><dt className="kn-kick">{k}</dt><dd>{v}</dd></div>)}
          </dl>
        </div>
      </section>

      <section className="kn-sec an-com">
        <div className="kn-wrap kn-grid an-com-g">
          <div className="an-com-t">
            <h2 className="kn-headline">Powered by Community, Improved by Collaboration</h2>
            <p className="kn-lede">Join thousands of developers building the future of analytics together.</p>
            <Repo />
            <KeynoteSheet label="Open Source at Our Core" title="Open Source at Our Core">
              <div className="an-oss">
                <p className="kn-lede">Hanzo Analytics is fully open-source, fostering innovation and collaboration among thousands of global developers.</p>
                <div className="kn-acts">
                  <Cta to="https://docs.hanzo.ai" kind="quiet" id="analytics.oss-docs">View Docs</Cta>
                  <Cta to="https://github.com/hanzoai" kind="link" id="analytics.oss-repo">View Repository</Cta>
                </div>
                <h3 className="an-h3">Open Source</h3>
                <p className="an-oss-p">Hanzo Analytics is fully open source, with a vibrant community of developers contributing from around the world. Join us on GitHub to collaborate on the future of analytics.</p>
                <div className="kn-acts"><Cta to="https://github.com/hanzoai/insights" kind="link" id="analytics.oss-github">GitHub Repo</Cta></div>
                <ul className="an-stats">{[['M+', 'Downloads'], ['K+', 'GitHub Stars'], ['', 'Contributors']].map(([a, b]) => <li key={b}><b className={'kn-fig' + (a ? '' : ' none')}>{a || <span aria-hidden="true">—</span>}</b><span>{b}</span></li>)}</ul>
              </div>
            </KeynoteSheet>
          </div>
          <div className="an-res">
            <h3 className="an-h3">Resources</h3>
            <p className="an-res-p">Access comprehensive documentation, tutorials, and examples to help you make the most of Hanzo Analytics.</p>
            <ul className="an-res-l">
              {RES.map(([t, d, to]) => (
                <li key={t}><A to={to} className="an-r"><b>{t}</b><span>{d}</span><Arrow /></A></li>
              ))}
            </ul>
            <Cta to="https://docs.hanzo.ai/docs/analytics" kind="link" id="analytics.resources">Browse All Resources</Cta>
          </div>
        </div>
      </section>

      <KeynoteClose light className="an-close" name="Analytics" tag="Product analytics on your data" lead="Get started with Analytics" cta="analytics.close">
        <div className="kn-acts an-close-l">
          <Cta to="https://docs.hanzo.ai/docs/projects/hanzoai/insights" kind="link" id="analytics.close-docs">Read the docs</Cta>
          <Cta to="https://github.com/hanzoai" kind="link" id="analytics.close-github">View on GitHub</Cta>
        </div>
      </KeynoteClose>
    </main>
  );
}
