'use client';
/* Analytics.
   V2: 8/10 Apple-style launch: the example dashboard is the hero and runs by itself, the five reports are cards that open into their own picture, "From a visit to a number" is three pinned chapters built by the scroll, the AI panel is the dark room, security is a calm spec list, and the code and community live in drawers.
   Signature: "From a visit to a number". Three pinned chapters whose pictures are built by the scroll itself: the
   funnel's steps rise one by one until the cliff drops away, the retention cohorts fill in week by week, and revenue
   bars climb beside the traffic that produced them, split by channel and campaign.
   Supporting: the Stage hero (the live dashboard starts big and settles: its figures count in, the activity line
   draws itself, the realtime list ticks), report cards that open in place into their own living picture, and the AI
   anomaly line drawing itself in the dark room.
   Beyond: "Ask it as a question". Pick the question you actually have (who is on the site right now, where the drop
   is, whether anyone came back...) and the report card that answers it opens; each question is the report's own words.
   Accent: Analytics green, from its own live chart. Every word, figure and link is Hanzo's; pages and referrers in the
   realtime list are examples. */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, animate, useInView, useMotionValue, useMotionValueEvent, useReducedMotion, useTransform } from 'motion/react';
import { EASE, Count, Copy } from '../../ui';
import { A } from '../../kit';
import { useLive, useEvery } from './Frame';
import KeynoteStage from '../../v2/KeynoteStage';
import KeynoteOpen from '../../v2/KeynoteOpen';
import KeynoteChapters from '../../v2/KeynoteChapters';
import KeynoteRoom from '../../v2/KeynoteRoom';
import KeynoteSpec, { KeynoteSheet } from '../../v2/KeynoteSpec';
import KeynoteClose from '../../v2/KeynoteClose';
import KeynoteLines from '../../v2/KeynoteLines';
import './Analytics.css';

const mod = (a, n) => ((a % n) + n) % n;

/* ---------- the hero: Hanzo's example dashboard, running ---------- */
const HOURS = [12, 10, 8, 7, 9, 14, 22, 34, 48, 58, 64, 70, 76, 72, 80, 86, 78, 70, 62, 54, 46, 36, 26, 18];
const VISITS = [['/pricing', 'google'], ['/docs/start', 'github.com'], ['/', 'newsletter'], ['/blog/launch', 'x.com'], ['/signup', 'direct']];
const KPIS = [['Users', 127543, 0, '', '+12.4% vs last week'], ['Conversion Rate', 4.87, 2, '%', '+0.8% vs last week'], ['Revenue', 45892, 0, '$', '+15.2% vs last week']];
const pt = (h, i) => [(i / 23) * 100, 100 - h];

/* the realtime list: a new visit slides in on top, the rest move down a row (transform only, no layout animation) */
function Realtime({ live }) {
  const [k, setK] = useState(0);
  const ul = useRef(null);
  useEvery(2400, live, () => setK((v) => v + 1));
  useLayoutEffect(() => {
    const el = ul.current;
    if (!el || !k) return;
    const h = el.children[1] ? el.children[1].offsetTop - el.children[0].offsetTop : 0;
    el.style.transition = 'none';
    el.style.transform = `translate3d(0, ${-h}px, 0)`;
    el.getBoundingClientRect();
    el.style.transition = 'transform .55s cubic-bezier(.16, 1, .3, 1)';
    el.style.transform = 'translate3d(0, 0, 0)';
  }, [k]);
  return (
    <div className="an-rt" aria-hidden="true">
      <p className="an-rt-h"><i />Realtime</p>
      <div className="an-rt-win">
        <ul ref={ul}>
          {[0, 1, 2, 3, 4].map((j) => {
            const [page, ref] = VISITS[mod(j - k, VISITS.length)];
            return <li key={k - j} className={j === 0 && k ? 'new' : ''}><b>{page}</b><span>{ref}</span></li>;
          })}
        </ul>
      </div>
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

/* the activity chart: the line draws itself; a hairline follows the pointer and names the hour */
function Activity() {
  const calm = useReducedMotion();
  const [at, setAt] = useState(-1);
  const [box, wh] = useBox();
  const P = px(HOURS.map(pt), wh);
  const line = curve(P);
  const area = line + ` L${wh[0]} ${wh[1]} L0 ${wh[1]} Z`;
  const move = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setAt(Math.round(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)) * 23));
  };
  const [x, y] = pt(HOURS[at < 0 ? 23 : at], at < 0 ? 23 : at);
  return (
    <div className="an-live">
      <div className="an-live-h">
        <p>Live User Activity</p>
        <span>Pageviews</span><b className="kn-fig">1,240</b><b className="kn-fig dim">876</b><em>+24.5%</em>
      </div>
      <div className="an-chart" ref={box} onPointerMove={move} onPointerLeave={() => setAt(-1)}>
        <svg viewBox={`0 0 ${wh[0]} ${wh[1]}`} aria-hidden="true">
          <defs><linearGradient id="an-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#a3a3a3" stopOpacity=".26" /><stop offset="1" stopColor="#a3a3a3" stopOpacity="0" /></linearGradient></defs>
          {[0.25, 0.5, 0.75].map((g) => <line key={g} x1="0" x2={wh[0]} y1={g * wh[1]} y2={g * wh[1]} className="an-grid" />)}
          <motion.path d={area} fill="url(#an-g)" initial={calm ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6, duration: 0.9 }} />
          <motion.path d={line} className="an-line" initial={calm ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.4, ease: EASE, delay: 0.5 }} />
        </svg>
        <span className={'an-now' + (at < 0 ? '' : ' hold')} style={{ left: x + '%', top: y + '%' }} aria-hidden="true" />
        {at >= 0 && <span className="an-hair" style={{ left: x + '%' }} aria-hidden="true"><em>{String(at).padStart(2, '0')}:00</em></span>}
      </div>
      <div className="an-axis">{['00:00', '06:00', '12:00', '18:00', '24:00'].map((h) => <span key={h}>{h}</span>)}</div>
    </div>
  );
}

function Board() {
  const [ref, live] = useLive(0.25);
  return (
    <div className="kn-obj an-board" ref={ref}>
      <div className="an-bar"><i /><i /><i /><span>Hanzo Analytics Dashboard</span><em>example</em></div>
      <div className="an-kpis">
        {KPIS.map(([t, v, d, u, ch]) => (
          <div key={t} className="an-kpi">
            <p>{t}</p>
            <b className="kn-fig">{u === '$' ? <Count to={v} prefix="$" duration={1.8} /> : <Count to={v} decimals={d} suffix={u} duration={1.8} />}</b>
            <span>{ch}</span>
          </div>
        ))}
      </div>
      <div className="an-main">
        <Activity />
        <Realtime live={live} />
      </div>
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

function Reports() {
  const grid = useRef(null);
  const [q, setQ] = useState(-1);
  const ask = REPORTS.flatMap((r, i) => r.ask.map((t) => [t, i]));
  const open = (k, i) => { setQ(k); grid.current?.querySelectorAll('.kno-card')[i]?.click(); };
  return (
    <section className="kn-sec an-rep">
      <div className="kn-wrap">
        <div className="kn-grid an-rep-h">
          <div className="an-rep-ht">
            <KeynoteLines className="kn-display sm" lines="The reports" />
            <p className="kn-lede">Each one answers a question you would otherwise export a CSV to answer.</p>
          </div>
          <div className="an-ask">
            <p className="kn-kick ac">Ask it as a question</p>
            <div className="an-ask-q" role="group" aria-label="Ask it as a question">
              {ask.map(([t, i], k) => (
                <button key={t} type="button" aria-haspopup="dialog" aria-pressed={q === k} onClick={() => open(k, i)}>
                  <span>{t}</span>
                  <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div ref={grid} className="an-rep-grid">
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
  const own = useMotionValue(calm ? 1 : 0);
  const full = useMotionValue(1);
  useEffect(() => {
    if (p || calm || !on) return;
    const c = animate(own, 1, { duration: 1.8, ease: EASE });
    return () => c.stop();
  }, [p, on, calm, own]);
  if (calm) return full;
  return p || own;
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
function Bar({ b, k, w, cliff }) {
  const s = useSpan(b, k * 0.08, 0.16 + k * 0.08);
  const sy = useTransform(s, (v) => v * w);
  return (
    <div className={'an-fb' + (cliff ? ' cliff' : '')}>
      <span className="an-fb-col"><motion.i style={{ scaleY: sy }} /></span>
      <em>Step {k + 1}</em>
    </div>
  );
}
function FunnelScene({ p, on }) {
  const b = useBuild(p, on);
  const drop = useSpan(b, 0.42, 0.56);
  return (
    <div className="kn-obj an-sc an-sc-f">
      <p className="an-sc-k">Funnels and goals</p>
      <div className="an-fbars">
        {STEPS.map((w, k) => <Bar key={k} b={b} k={k} w={w / 100} cliff={k === 3} />)}
        <motion.span className="an-cliff" style={{ opacity: drop }} aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22"><path d="M6 6l12 12M18 9v9H9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </motion.span>
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
      <p className="an-sc-k">Retention by the week someone arrived</p>
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

/* ---------- if you sell something: the commerce board ---------- */
function Commerce() {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.4 });
  return (
    <div className="kn-obj an-shop" ref={ref} data-in={seen ? '' : undefined}>
      <div className="an-shop-h"><p>Commerce Dashboard</p><em>example</em></div>
      <div className="an-shop-k">
        <div><p>Sales Performance</p><b className="kn-fig">4.78%</b><span>+0.6%</span></div>
        <div><p>Avg. Order Value</p><b className="kn-fig">$87.32</b><span>+2.4%</span></div>
      </div>
      <p className="an-shop-s">Product Recommendations</p>
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
  const calm = useReducedMotion();
  const [box, wh] = useBox(400, 96);
  const line = poly(px(ANOM.map(([x, y]) => [x, y * 2.5]), wh));
  return (
    <div className="an-ai-p" ref={ref} data-in={seen ? '' : undefined}>
      <p className="an-ai-ph"><i />AI Analysis in Action</p>
      <div className="an-anom">
        <div className="an-anom-h"><b>Traffic Anomaly Detection</b><span className="an-flag">Anomaly Detected</span></div>
        <div className="an-anom-plot" ref={box}>
          <svg viewBox={`0 0 ${wh[0]} ${wh[1]}`} aria-hidden="true">
            <motion.path d={line} initial={calm ? false : { pathLength: 0 }} animate={seen ? { pathLength: 1 } : undefined} transition={{ duration: 1.8, ease: EASE, delay: 0.2 }} />
          </svg>
          <span className="an-spike" aria-hidden="true" />
        </div>
        <div className="an-anom-f"><p>Unusual traffic spike</p><p className="an-conf">Confidence: 98.7%</p></div>
      </div>
      <p className="an-ai-s">AI Insights</p>
      <ul className="an-ins">
        {[['Traffic Anomaly', 'Unusual spike detected at 14:32 UTC'], ['Conversion Opportunity', 'Checkout abandonment 23% higher on mobile'], ['Performance Alert', 'API latency increased by 150ms']].map(([a, b], i) => (
          <li key={a} style={{ '--an-i': i }}><b>{a}</b><span>{b}</span></li>
        ))}
      </ul>
      <div className="an-rec">
        <p className="an-ai-s">AI Recommendation</p>
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

/* light colour for JavaScript: comments, strings, keywords. The email in Hanzo's sample keeps Hanzo's own link. */
const KW = /\b(import|from|const|new|true|false)\b/;
function js(line) {
  if (/^\s*\/\//.test(line)) return <span className="c">{line}</span>;
  return line.split(/('[^']*')/).map((p, i) => {
    if (i % 2) return p === "'jane@example.com'" ? <span key={i} className="s">'<A to="/cdn-cgi/l/email-protection" className="an-mail">jane@example.com</A>'</span> : <span key={i} className="s">{p}</span>;
    return <span key={i}>{p.split(KW).map((w, j) => (j % 2 ? <span key={j} className="k">{w}</span> : w))}</span>;
  });
}
function Lines({ code, num }) {
  return <pre className="an-pre"><code>{code.split('\n').map((l, i) => <span key={i} className="an-ln">{num && <em>{i + 1}</em>}{js(l)}{'\n'}</span>)}</code></pre>;
}

function Script() {
  return (
    <div className="kn-obj ink an-script">
      <div className="an-script-bar"><i /><i /><i /><span>analytics.js</span><Copy text={JS} /></div>
      <Lines code={JS} num />
      <div className="an-npm"><code><b>$</b> npm install hanzo-analytics</code><Copy text="npm install hanzo-analytics" /></div>
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
        <div className="an-code-bar">
          <div className="an-langs" role="tablist" aria-label="Language">
            {LANGS.map((l, i) => <button key={l} type="button" role="tab" aria-selected={lang === i} onClick={() => setLang(i)}>{l}</button>)}
          </div>
          {lang === 0 && <Copy text={FULL} />}
        </div>
        <div className="an-code-b" hidden={lang !== 0}><Lines code={FULL} /></div>
        {lang !== 0 && (
          <div className="an-other">
            <p className="kn-title">{LANGS[lang]}</p>
            <A to="https://docs.hanzo.ai/docs/openapi" className="kn-btn solid">API Reference</A>
          </div>
        )}
      </div>
      <p className="kn-kick">What you are signing up for</p>
      <ul className="an-sign">
        {[['Your database, your rows', 'It runs against Postgres, MySQL or MariaDB — one you already operate. The raw events stay somewhere you can query directly.'], ['Many sites, one install', 'Add a site, get a tracking id. Group people into teams, and share a board with someone who should not have an account.'], ['Open source, MIT', 'Read it, fork it, run it on a small server for as long as you like. The hosted version exists so you do not have to.']].map(([t, d]) => <li key={t}><b>{t}</b><span>{d}</span></li>)}
      </ul>
      <div className="kn-acts">
        <A to="https://docs.hanzo.ai/docs/analytics" className="kn-btn">View Documentation</A>
        <A to="https://docs.hanzo.ai/docs/openapi" className="kn-btn">API Reference</A>
        <A to="https://github.com/hanzoai/insights" className="kn-btn">Example Projects</A>
      </div>
    </div>
  );
}

/* ---------- community and resources ---------- */
const RES = [['Documentation', 'Comprehensive guides and API references', 'https://docs.hanzo.ai/docs/analytics'], ['Community Forum', 'Join discussions with developers and AI experts', 'https://discord.gg/XthHQQj'], ['Examples', 'Sample projects showcasing Hanzo Analytics', 'https://github.com/hanzoai/insights'], ['Support', 'Get help from our team and community', '/support']];
const Arrow = () => <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;

export default function Analytics() {
  return (
    <main className="kn an" style={{ '--ac': '#a3a3a3' }}>
      <KeynoteStage
        look="side"
        size="md"
        kick="Web analytics you host yourself"
        title={['Hanzo', 'Analytics']}
        lede="Traffic, sessions and revenue for the sites you run, in a dashboard you can read without training."
        acts={[['Try Hanzo', '/login'], ['Request Demo', '/contact-sales']]}
        from={1.06}
      >
        <Board />
      </KeynoteStage>

      <Reports />

      <KeynoteChapters
        className="an-ch"
        head={(
          <div className="an-ch-head">
            <KeynoteLines className="kn-display sm" lines={['From a visit', 'to a number']} />
            <div className="an-ch-r">
              <p className="kn-lede">A pageview is not worth much on its own. It gets interesting once it is joined to the step someone stopped at, the campaign that sent them and the money that followed.</p>
              <A to="https://docs.hanzo.ai/docs/projects/hanzoai/insights" className="an-more"><span>Read how reports work</span><Arrow /></A>
            </div>
          </div>
        )}
        items={VISIT.map(([t, d, tag]) => ({ kick: tag, title: t, body: <p>{d}</p> }))}
        visual={(i, on, p) => { const S = SCENES[i]; return <S on={on} p={p} />; }}
        swap="scale"
        side="left"
        count
      />

      <section className="kn-sec an-sell">
        <div className="kn-wrap kn-grid an-sell-g">
          <div className="an-sell-obj"><Commerce /></div>
          <div className="an-sell-t">
            <KeynoteLines className="kn-headline" lines="If you sell something" />
            <p className="kn-lede">Revenue is a report here, not an integration you buy on top.</p>
            <ol className="an-sell-l">
              {[['Revenue beside the traffic', 'Send an amount and a currency with the event and it lands in the same reports as everything else. Totals, order values and the sessions behind them.'], ['Which campaign paid for itself', 'Attribution splits revenue across the channels and campaigns that touched the session, so spend can be argued with numbers rather than instinct.'], ['The checkout, step by step', 'Cart to payment as a funnel, with the abandonment rate per step. Add a goal for the one step you would defend in a meeting.']].map(([t, d]) => <li key={t}><h3 className="kn-title">{t}</h3><p>{d}</p></li>)}
            </ol>
          </div>
        </div>
      </section>

      <KeynoteRoom className="kn-sec an-ai">
        <div className="kn-wrap kn-grid an-ai-g">
          <div className="an-ai-t">
            <KeynoteLines className="kn-display sm" lines={['AI-Powered', 'Observability', '& Monitoring']} />
            <p className="kn-lede">Proactively identify issues and opportunities with AI-powered insights and monitoring.</p>
            <ul className="an-ai-l">
              {[['Real-time anomaly detection', 'Automatically identify unusual patterns and potential issues before they impact your business.'], ['Predictive alerts and proactive monitoring', 'Get alerted about potential problems before they occur with AI-powered predictive monitoring.'], ['Deep integration with Hanzo Cloud and Base', 'Connect your analytics with your entire infrastructure for comprehensive visibility.']].map(([t, d]) => <li key={t}><b>{t}</b><span>{d}</span></li>)}
            </ul>
          </div>
          <div className="an-ai-o"><AiPanel /></div>
        </div>
      </KeynoteRoom>

      <section className="kn-sec an-add">
        <div className="kn-wrap kn-grid an-add-g">
          <div className="an-add-t">
            <KeynoteLines className="kn-display sm" lines="Add the script" />
            <p className="kn-lede">One tag on the page and the dashboard fills in on its own. Host it yourself or let us run it — the software is the same either way.</p>
            <ol className="an-add-l">
              {[['One tag', 'Paste it into the head of your site. Pageviews start arriving before you have decided what to name anything.'], ['Your data stays yours', 'The events live in your own Postgres, MySQL or MariaDB. Nothing is sampled, and nothing is held back from an export.'], ['Open source, MIT', 'Run it on a small server for as long as you like. The hosted version is the same code with the operations taken care of.']].map(([t, d], i) => <li key={t}><span className="kn-fig">{String(i + 1).padStart(2, '0')}</span><div><b>{t}</b><p>{d}</p></div></li>)}
            </ol>
            <div className="kn-acts">
              <A to="/login" className="kn-btn solid">Try Hanzo</A>
              <A to="/contact-sales" className="kn-btn">Request Demo</A>
              <KeynoteSheet label="A script, then an API" title="A script, then an API"><ApiSheet /></KeynoteSheet>
            </div>
            <p className="an-nocard">No credit card required.</p>
          </div>
          <div className="an-add-o"><Script /></div>
        </div>
      </section>

      <KeynoteSpec
        className="an-spec"
        kick="Hanzo Analytics"
        title="Enterprise-Grade Security & Compliance"
        aside={<p className="kn-lede">Secure by design, ensuring your data meets stringent compliance standards.</p>}
        rows={[
          ['Security Features', <ul className="an-feats">{['End-to-end encryption', 'Data residency controls', 'Custom data retention policies', 'Role-based access control', 'Regular security audits', 'Privacy-focused data collection', 'Automated compliance monitoring'].map((f) => <li key={f}><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>{f}</li>)}</ul>],
          ['Security and assurance', <p><b>Continual internal audits</b> Report on request.</p>],
          ['Data protection', <p>EU data handling, deletion, and export on request.</p>],
          ['Privacy by design', <p>Collected because it is used, not because it can be.</p>],
          ['Data Privacy Commitment', <div className="an-commit"><p>Hanzo Analytics collects what a report uses and nothing else. You choose where the data lives, how long it is kept, and who on your team can read it, and you can export or delete it on request.</p><A to="/legal/privacy" className="an-more">Read our privacy policy →</A></div>],
        ]}
      />

      <section className="kn-sec an-com">
        <div className="kn-wrap kn-grid an-com-g">
          <div className="an-com-t">
            <KeynoteLines className="kn-headline" lines={['Powered by Community,', 'Improved by Collaboration']} />
            <p className="kn-lede">Join thousands of developers building the future of analytics together.</p>
            <KeynoteSheet label="Open Source at Our Core" title="Open Source at Our Core">
              <div className="an-oss">
                <p className="kn-lede">Hanzo Analytics is fully open-source, fostering innovation and collaboration among thousands of global developers.</p>
                <div className="kn-acts"><A to="https://docs.hanzo.ai" className="kn-btn solid">View Docs</A><A to="https://github.com/hanzoai" className="kn-btn">View Repository</A></div>
                <ul className="an-stats">{[['M+', 'Downloads'], ['K+', 'GitHub Stars'], ['', 'Contributors']].map(([a, b]) => <li key={b}><b className={'kn-fig' + (a ? '' : ' none')}>{a || <span aria-hidden="true">—</span>}</b><span>{b}</span></li>)}</ul>
                <h3 className="kn-title">Open Source</h3>
                <p className="an-oss-p">Hanzo Analytics is fully open source, with a vibrant community of developers contributing from around the world. Join us on GitHub to collaborate on the future of analytics.</p>
                <div className="kn-acts"><A to="https://github.com/hanzoai/insights" className="kn-btn">GitHub Repo</A></div>
              </div>
            </KeynoteSheet>
          </div>
          <div className="an-res">
            <h3 className="kn-title">Resources</h3>
            <p className="an-res-p">Access comprehensive documentation, tutorials, and examples to help you make the most of Hanzo Analytics.</p>
            <ul className="an-res-l">
              {RES.map(([t, d, to]) => (
                <li key={t}><A to={to} className="an-r"><b>{t}</b><span>{d}</span><Arrow /></A></li>
              ))}
            </ul>
            <A to="https://docs.hanzo.ai/docs/analytics" className="an-more"><span>Browse All Resources</span><Arrow /></A>
          </div>
        </div>
      </section>

      <KeynoteClose light className="an-close" name="Analytics" tag="Product analytics on your data" lead="Get started with Analytics">
        <div className="kn-acts an-close-l">
          <A to="https://docs.hanzo.ai/docs/projects/hanzoai/insights" className="kn-btn">Read the docs</A>
          <A to="https://github.com/hanzoai" className="kn-btn">View on GitHub</A>
        </div>
      </KeynoteClose>
    </main>
  );
}
