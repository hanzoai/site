'use client';
// Persona: a product team deciding what to ship and how it is used.
// Goal: see a flag roll out and be killed without a deploy, and find the tool for their question.
// CTA: Open Insights (insights.hero, insights.close).
// Metric: cta_click insights.hero
// Signature: a flag you roll out by hand: a field of people lights as the flag climbs, the kill switch drops it.
// Beyond: each tour panel is the tool itself, with Hanzo's tool names as its own sub-nav; pick one and its view switches and its clause of Hanzo's sentence inks.
/* Insights (v2, archetype A Launch).
   Round 4: a resting pointer holds the tour's tab but not its panel (the views keep cycling), so the window never goes still under a mouse.
   Round 3: the finder is folded into the tour (no second pill-and-drawing block; every drawing is drawn once):
   each panel is a product view built from page words (event stream and SQL editor, flag rollout rows and kill switch,
   a replay whose cursor travels its path once and a heatmap, an experiment wired flag-to-metric with A/B bars, funnel /
   retention / paths, a rage-click spike over a stack trace and an LLM cost waterfall), each drawing itself in when its
   tab opens; Hanzo's tool names are the panel sub-nav and ink their clause of the sentence. Tab hover previews the
   panel, tabs tick, the phone rail keeps the active tab in view. The hero lights on arrival (dots at 150 ms, first
   event at 300 ms), one account grows to one big dot, the mode labels invert as the pill passes; one surface in the
   hero card, the window outlined not raised, deck radii; the dark room on the section token; invented on/off and
   true/false words gone (switch shapes). Round 2 kept: no CLS, h1 at 38%, the tool picker idea.
   Signature: a flag you roll out by hand. A field of people, each a dot; the new-dashboard flag rolls out to a share of
   them (drag it, or let it climb), the ones in the rollout light up and send button_clicked events; the kill switch
   turns it off for everyone at once.
   Supporting: kinetic title lines; the six tools as a product window whose tabs tour themselves with a progress line
   (pick one and it stays); in the dark room the provider's code beside the app it renders, flipping between
   NewDashboard and OldDashboard with the same flag.
   Greys from the deck only. Every word and link is Hanzo's; the people are dots. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, animate, useReducedMotion } from 'motion/react';
import { Cta, CodeBlock } from '../../kit';
import { useLive } from './Frame';
import { Lines, useTick } from '../../v2/LiftStage';
import ShipPrompt from '../../v2/ShipPrompt';
import GetIt from '../../v2/GetIt';
import LivePause, { usePause } from '../../v2/LivePause';
import '../../v2/v2scale.css';
import './Insights.css';

const EASE = [0.16, 1, 0.3, 1];
const N = 120;
const rank = Array.from({ length: N }, (_, i) => ({ i, r: (Math.sin(i * 12.9898) * 43758.5453) % 1 })).sort((a, b) => Math.abs(a.r) - Math.abs(b.r)).map((x) => x.i);
const order = new Array(N);
rank.forEach((cell, k) => { order[cell] = k; });
// Hanzo's three ways to roll a flag out ("a percentage, a cohort, or one account"), drawn as which people light up.
// No percentages are shown: Hanzo states none.
const MODES = ['a percentage', 'a cohort', 'one account'];
const ONE = 52;
// the field is 20 x 6 on desktop and 12 x 10 on phone; a cohort is the block in the middle of whichever grid shows
const lit = (m, i, cols) => {
  if (m === 0) return order[i] < N * 0.3;
  if (m === 2) return i === ONE;
  const R = N / cols, r = Math.floor(i / cols), c = i % cols;
  return c >= Math.round(cols * 0.27) && c < Math.round(cols * 0.73) && r >= Math.floor(R * 0.25) && r < Math.ceil(R * 0.75);
};
const fine = (e) => e.pointerType === 'mouse';

/* the rollout: a flag, a field of people, the events they send; then the kill switch, no deploy */
function Rollout() {
  const [ref, seen, calm] = useLive(0.3);
  const [paused, togglePause] = usePause();
  const live = seen && !paused;
  const [m, setM] = useState(0);
  const [kill, setKill] = useState(false);
  const [mine, setMine] = useState(false);
  const [ev, setEv] = useState(0);
  const [peek, setPeek] = useState(-1);
  const [cols, setCols] = useState(20);
  // the field arrives dark and lights in its stagger right away, so the object moves inside the first second
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    const q = matchMedia('(max-width: 899px)');
    const on = () => setCols(q.matches ? 12 : 20);
    on();
    q.addEventListener('change', on);
    return () => q.removeEventListener('change', on);
  }, []);
  useEffect(() => {
    if (calm) { setArmed(true); return; }
    const t = setTimeout(() => setArmed(true), 150);
    return () => clearTimeout(t);
  }, [calm]);
  const first = useRef(false);
  useEffect(() => {
    if (!live || first.current) return;
    first.current = true;
    const t = setTimeout(() => setEv((e) => e + 1), 300);
    return () => clearTimeout(t);
  }, [live]);
  useEffect(() => {
    if (mine || !live) return;
    const t = setTimeout(() => {
      if (kill) { setKill(false); setM(0); return; }
      if (m === MODES.length - 1) { setKill(true); return; }
      setM(m + 1);
    }, kill ? 2600 : 2400);
    return () => clearTimeout(t);
  }, [m, kill, mine, live]);
  useTick(700, live && !kill, () => setEv((e) => e + 1));
  return (
    <div className="in-roll" ref={ref}>
      <div className="in-flag">
        <div className="in-flag-top">
          <code>new-dashboard</code>
          <button type="button" role="switch" aria-checked={!kill} aria-label="Kill switch" data-sound="tick" className={'in-kill' + (kill ? ' off' : '')} onClick={() => { setMine(true); setKill(!kill); }}><i /></button>
          <LivePause paused={paused} onToggle={togglePause} inline className="in-pause" />
        </div>
        <div className="in-pct">
          <span>roll out to</span>
          <div className="in-modes" role="radiogroup" aria-label="Roll out to" onPointerLeave={() => setPeek(-1)}>
            {MODES.map((t, i) => (
              <button key={t} type="button" role="radio" data-sound="tick" aria-checked={!kill && m === i} onPointerEnter={(e) => fine(e) && setPeek(i)} onClick={() => { setMine(true); setKill(false); setM(i); setPeek(-1); }}>
                {!kill && m === i && <motion.span layoutId="in-mode" className="in-mode-bg" transition={{ duration: 0.3, ease: EASE }} />}
                <span className="in-mode-t">{t}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="in-events" aria-hidden="true">
          <AnimatePresence initial={false} mode="popLayout">
            {!kill && <motion.p key={ev} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.3, ease: EASE }}>insights.capture("button_clicked", {'{'} variant: "primary" {'}'})</motion.p>}
            {kill && <motion.p key="k" className="kill" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>turning a feature off should not require a deploy</motion.p>}
          </AnimatePresence>
        </div>
      </div>
      <div className={'in-field' + (!kill && m === 2 && armed ? ' one' : '')} aria-hidden="true">
        {Array.from({ length: N }).map((_, i) => {
          const on = armed && !kill && lit(m, i, cols);
          const pk = peek >= 0 && !on && lit(peek, i, cols);
          return <i key={i} className={(on ? 'on' : pk ? 'pk' : '') + (i === ONE ? ' me' : '')} style={{ transitionDelay: (order[i] % 30) * 10 + 'ms' }} />;
        })}
      </div>
    </div>
  );
}

// The six tools. Each carries its sub-tools: Hanzo's own tool names and the clause of its sentence that is theirs.
const LOG = [
  ['Events, and SQL when you need it', 'Autocapture gets you data before you have instrumented anything, and named events get you data you can trust. When a chart cannot express the question, write the query instead — it is the same table underneath.', 'events',
    [['Autocapture', 'Autocapture gets you data before you have instrumented anything'], ['named events', 'named events get you data you can trust'], ['SQL', 'write the query instead']]],
  ['Feature flags', 'Roll out to a percentage, a cohort, or one account. The flag is also a kill switch, which is the reason to reach for one: turning a feature off should not require a deploy at the worst possible moment.', 'flags',
    [['a percentage', 'Roll out to a percentage, a cohort, or one account'], ['a cohort', 'Roll out to a percentage, a cohort, or one account'], ['one account', 'Roll out to a percentage, a cohort, or one account'], ['kill switch', 'The flag is also a kill switch']]],
  ['Session replay', 'Watch what actually happened. Heatmaps and scroll depth tell you where attention went; a replay tells you why someone gave up, which no funnel ever will.', 'replay',
    [['Session replay', 'a replay tells you why someone gave up, which no funnel ever will'], ['Heatmaps and scroll depth', 'Heatmaps and scroll depth tell you where attention went']]],
  ['Experiments', 'An experiment is a flag with a metric attached to it. Pick the goal before you start, and let it run until the result means something rather than until it looks good.', 'ab',
    [['Experiments', 'An experiment is a flag with a metric attached to it'], ['A/B', 'Pick the goal before you start']]],
  ['Funnels, retention and paths', 'Funnels show where people stop, retention shows whether they came back, and paths show the route nobody designed. The third one is usually where the surprise is.', 'funnel',
    [['Funnels', 'Funnels show where people stop'], ['Retention', 'retention shows whether they came back'], ['Paths', 'paths show the route nobody designed']]],
  ['Errors and LLM cost', 'Error tracking sits beside the analytics, so a spike in rage clicks and the exception behind it are one investigation. If your product calls a model, the traces, latency and cost per generation land here too.', 'errors',
    [['Error tracking', 'a spike in rage clicks and the exception behind it are one investigation'], ['LLM cost', 'the traces, latency and cost per generation land here too']]],
];

/* the whole sentence, its own clause in ink and the rest quiet */
function Said({ s, k }) {
  const at = s.indexOf(k);
  if (at < 0) return <span>{s}</span>;
  // each piece is its own leaf span (scripts/copycheck.mjs reads leaves, joined by a space), so a break falls only at a
  // space: punctuation right after the key stays with it
  const pre = s.slice(0, at), m = s.slice(at + k.length).match(/^[^\s]*/)[0], post = s.slice(at + k.length + m.length);
  return <>{pre && <span>{pre}</span>}<b><span>{k + m}</span></b>{post && <span>{post}</span>}</>;
}

const Ev = ({ tag, hi }) => (
  <div className={'in-row' + (hi ? ' hi' : '')}><code>button_clicked</code><span className="in-prop">variant: "primary"</span><span className="in-tag">{tag}</span></div>
);

/* the replay: a page in line art, the visitor's path draws once and the cursor travels it */
function Replay({ on }) {
  const path = useRef(null);
  const cur = useRef(null);
  const calm = useReducedMotion();
  useEffect(() => {
    const p = path.current, c = cur.current;
    if (!p || !c) return;
    const len = p.getTotalLength();
    const put = (t) => { const pt = p.getPointAtLength(t * len); c.setAttribute('transform', `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`); };
    if (!on || calm) { put(on ? 1 : 0); return; }
    put(0);
    const a = animate(0, 1, { duration: 1.2, ease: [0.4, 0, 0.2, 1], onUpdate: put });
    return () => a.stop();
  }, [on, calm]);
  const d = 'M44 168 C 96 70, 170 190, 226 96 S 300 70, 318 150';
  return (
    <svg className="in-rp" viewBox="0 0 360 220" aria-hidden="true">
      <defs><mask id="in-rp-m"><path className="in-rp-reveal" d={d} pathLength="1" fill="none" stroke="#fff" strokeWidth="8" /></mask></defs>
      <rect className="ln" x="12" y="12" width="336" height="196" rx="12" />
      <line className="ln" x1="12" y1="40" x2="348" y2="40" />
      <rect className="ln" x="32" y="60" width="150" height="14" rx="6" />
      <rect className="ln" x="32" y="86" width="230" height="10" rx="5" />
      <rect className="ln" x="32" y="140" width="96" height="34" rx="12" />
      <rect className="ln" x="232" y="132" width="96" height="52" rx="8" />
      <path d={d} ref={path} mask="url(#in-rp-m)" className="in-rp-path" fill="none" strokeWidth="2" strokeDasharray="5 6" strokeLinecap="round" />
      <g ref={cur} transform="translate(44 168)"><path className="in-rp-cur" d="M0 0 L0 17 L4.5 12.8 L7.6 19.6 L10.4 18.4 L7.4 11.6 L13.4 11.6 Z" /></g>
    </svg>
  );
}

/* each tool's view, from its own words; shapes and Hanzo's labels only, no figures */
function View({ k, v, on }) {
  if (k === 'events') {
    if (v === 2) return (
      <div className="in-v in-v-sql">
        <p className="in-q"><span>write the query instead</span><i className="in-caret" /></p>
        <p className="in-cap">it is the same table underneath</p>
        {['Autocapture', 'named events', 'Autocapture'].map((t, i) => <Ev key={i} tag={t} />)}
      </div>
    );
    return (
      <div className="in-v in-v-ev">
        {['Autocapture', 'named events', 'Autocapture', 'named events', 'Autocapture'].map((t, i) => <Ev key={i} tag={t} hi={(v === 0) === (t === 'Autocapture')} />)}
      </div>
    );
  }
  if (k === 'flags') {
    const off = v === 3;
    return (
      <div className={'in-v in-v-fl' + (off ? ' off' : '')}>
        <div className="in-fl-h"><code>new-dashboard</code><i className={'in-sw' + (off ? '' : ' on')} /></div>
        <p className="in-cap">Roll out to</p>
        {MODES.map((t, i) => (
          <div key={t} className={'in-row' + (!off && v === i ? ' hi' : '')}>
            <i className="in-radio" /><span>{t}</span>
            <b className="in-reach">{Array.from({ length: 24 }).map((_, j) => <i key={j} className={!off && (i === 0 ? order[j] % 10 < 3 : i === 1 ? j >= 8 && j < 16 : j === 11) ? 'on' : ''} style={{ '--id': j }} />)}</b>
          </div>
        ))}
        <div className={'in-row in-row-k' + (off ? ' hi' : '')}><span>kill switch</span><i className={'in-sw' + (off ? '' : ' on')} /></div>
      </div>
    );
  }
  if (k === 'replay') {
    if (v === 1) return (
      <div className="in-v in-v-hm">
        <svg className="in-rp" viewBox="0 0 360 220" aria-hidden="true">
          <rect className="ln" x="12" y="12" width="336" height="196" rx="12" />
          <line className="ln" x1="12" y1="40" x2="348" y2="40" />
          <rect className="ln" x="32" y="60" width="150" height="14" rx="6" />
          <rect className="ln" x="32" y="86" width="230" height="10" rx="5" />
          <rect className="ln" x="32" y="140" width="96" height="34" rx="12" />
          <rect className="ln" x="232" y="132" width="96" height="52" rx="8" />
          {[[80, 157, 0], [280, 158, 1], [108, 67, 2]].map(([x, y, i]) => (
            <g key={i} className="in-heat" style={{ '--id': i }} transform={`translate(${x} ${y})`}><circle r="26" /><circle r="16" /><circle r="7" /></g>
          ))}
          <line className="in-depth-t" x1="340" y1="40" x2="340" y2="208" />
          <line className="in-depth" x1="340" y1="40" x2="340" y2="140" pathLength="1" />
          <line className="in-fold" x1="12" y1="140" x2="348" y2="140" />
        </svg>
      </div>
    );
    return (
      <div className="in-v in-v-rp">
        <Replay on={on} />
        <div className="in-scrub"><i /></div>
      </div>
    );
  }
  if (k === 'ab') return (
    <div className={'in-v in-v-ab' + (v === 1 ? ' bars' : ' wire')}>
      <div className="in-wire"><code>new-dashboard</code><svg viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true"><line x1="0" y1="5" x2="100" y2="5" pathLength="1" /></svg><code>button_clicked</code></div>
      <div className="in-bars">
        <div><b style={{ '--ih': 0.58 }} /><span>A</span></div>
        <div className="b"><b style={{ '--ih': 0.78 }} /><span>B</span></div>
      </div>
    </div>
  );
  if (k === 'funnel') {
    if (v === 1) return (
      <div className="in-v in-v-rt">
        {Array.from({ length: 6 }).map((_, r) => (
          <div key={r} className="in-rt-r">{Array.from({ length: 6 - r }).map((_, c) => <i key={c} style={{ '--id': r + c, '--is': c }} />)}</div>
        ))}
      </div>
    );
    if (v === 2) return (
      <div className="in-v in-v-pa">
        <svg viewBox="0 0 360 200" aria-hidden="true">
          {[['M30 100 C 110 100, 110 40, 180 40', 0], ['M30 100 C 110 100, 110 100, 180 100', 1], ['M180 40 C 250 40, 250 60, 330 60', 2], ['M180 100 C 250 100, 250 60, 330 60', 3]].map(([d, i]) => <path key={i} d={d} pathLength="1" className="in-pa-l" style={{ '--id': i }} />)}
          <path d="M30 100 C 90 160, 140 180, 200 160 S 300 150, 330 140" pathLength="1" className="in-pa-l odd" />
          {[[30, 100], [180, 40], [180, 100], [330, 60], [330, 140]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="7" className={'in-pa-n' + (i === 4 ? ' odd' : '')} style={{ '--id': i }} />)}
        </svg>
      </div>
    );
    return (
      <div className="in-v in-v-fn">
        {[['Start with autocapture', 1], ['Paste and ship', 0.72], ['Get Insights', 0.48], ['Open Insights', 0.3]].map(([t, w], i) => (
          <div key={t} className="in-row"><span>{t}</span><b><i style={{ '--iw': w, '--id': i }} /></b></div>
        ))}
      </div>
    );
  }
  if (v === 1) return (
    <div className="in-v in-v-cost">
      {[['traces', 0, 1], ['latency', 0.12, 0.7], ['cost per generation', 0.3, 0.5]].map(([t, x, w], i) => (
        <div key={t} className="in-row"><span>{t}</span><b><i style={{ '--ix': x, '--iw': w, '--id': i }} /></b></div>
      ))}
    </div>
  );
  return (
    <div className="in-v in-v-er">
      <div className="in-spike"><span>rage clicks</span><svg viewBox="0 0 200 40" preserveAspectRatio="none" aria-hidden="true"><polyline points="0,34 30,33 60,34 90,32 112,30 124,6 136,30 160,33 200,34" pathLength="1" /></svg></div>
      <p className="in-cap">the exception behind it</p>
      <ol className="in-trace">
        {['useFeatureFlag("new-dashboard")', 'MyApp', 'InsightsProvider', 'App'].map((t, i) => <li key={t} style={{ '--id': i }}><code>{t}</code></li>)}
      </ol>
    </div>
  );
}

/* The six tools in one window; tabs tour themselves with a progress line until you pick one. Hover a tab and its
   panel previews; inside a panel, Hanzo's tool names switch the view and ink their clause. */
function Tour() {
  const [ref, seen] = useLive(0.35);
  const [paused, togglePause] = usePause();
  const [hold, setHold] = useState(false);
  const live = seen && !paused;
  const touring = live && !hold;
  const [at, setAt] = useState(0);
  const [sub, setSub] = useState(0);
  const [peek, setPeek] = useState(-1);
  const [mine, setMine] = useState(false);
  const [onNav, setOnNav] = useState(false); // a pointer on a panel's own tool names holds its view too
  const rail = useRef(null);
  const go = (i) => { setAt(i); setSub(0); };
  useEffect(() => {
    if (!touring || mine) return;
    const t = setTimeout(() => go((at + 1) % LOG.length), 5200);
    return () => clearTimeout(t);
  }, [at, touring, mine]);
  // inside a toured panel the sub-tools step through too, so each tool shows every view it has. A resting pointer
  // holds the tab (so its words can be read) but not the panel: its views keep cycling, so the window never goes dead.
  useEffect(() => {
    const n = LOG[at][3].length;
    if (!live || mine || onNav || n < 2 || (!hold && sub >= n - 1)) return;
    const t = setTimeout(() => setSub((s) => (s + 1) % n), hold ? 2600 : Math.round(5200 / n));
    return () => clearTimeout(t);
  }, [at, sub, live, hold, mine, onNav]);
  // on the phone rail, keep the active tab fully in view as the tour moves (the rail scrolls, never the page)
  useEffect(() => {
    const r = rail.current;
    if (!r || r.scrollWidth <= r.clientWidth) return;
    const b = r.children[at];
    if (!b) return;
    const left = b.offsetLeft - 10, right = b.offsetLeft + b.offsetWidth + 10;
    if (left < r.scrollLeft || right > r.scrollLeft + r.clientWidth) r.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
  }, [at]);
  const shown = peek >= 0 ? peek : at;
  return (
    <section className={'v2-sec in-tour' + (seen ? ' seen' : '')}>
      <div className="v2-wrap">
        <div className="v2-grid in-tour-h">
          <h2 className="v2-display s">Ship it, then find out</h2>
          <ul className="in-figs">{[['Events', 'Auto-capture'], ['Flags', 'A/B'], ['OSS', 'Self-hosted']].map(([a, b], i) => <li key={a} style={{ '--id': i }}><b>{a}</b><span>{b}</span></li>)}</ul>
        </div>
        <div className="in-win v2-obj" ref={ref} onPointerEnter={(e) => fine(e) && setHold(true)} onPointerLeave={() => { setHold(false); setPeek(-1); }}>
          <div className="in-win-bar"><span className="in-dots"><i /><i /><i /></span><span>insights.hanzo.ai</span><LivePause paused={paused} onToggle={togglePause} inline className="in-pause" /></div>
          <div className="in-win-body">
            <div className="in-tabs" role="tablist" aria-label="Ship it, then find out" ref={rail} onPointerLeave={() => setPeek(-1)}>
              {LOG.map(([t], i) => (
                <button key={t} type="button" role="tab" data-sound="tick" id={'in-t' + i} aria-selected={at === i} aria-controls={'in-p' + i} className={peek === i && at !== i ? 'pk' : ''}
                  onPointerEnter={(e) => fine(e) && setPeek(i)} onClick={() => { go(i); setMine(true); setPeek(-1); }}>
                  <span className="in-tab-n">{String(i + 1).padStart(2, '0')} / 06</span>
                  <span className="in-tab-t">{t}</span>
                  {at === i && !mine && touring && <i className="in-tab-bar" key={at} />}
                </button>
              ))}
            </div>
            {/* every panel sits in one grid cell, so the window is always as tall as the tallest one and never pushes the page */}
            <div className="in-panels">
              {LOG.map(([t, d, k, tools], i) => {
                const on = shown === i;
                const v = i === at ? sub : 0;
                return (
                  <div key={t} id={'in-p' + i} role="tabpanel" aria-labelledby={'in-t' + i} aria-hidden={!on} inert={!on} className={'in-panel' + (on ? ' on' : '')}>
                    <div className="in-ui">
                      <div className="in-ui-nav" role="group" aria-label={t} onPointerEnter={(e) => fine(e) && setOnNav(true)} onPointerLeave={() => setOnNav(false)}>
                        {tools.map(([name], j) => (
                          <button key={name} type="button" data-sound="tick" aria-pressed={v === j}
                            onPointerEnter={(e) => { if (fine(e) && i === at) setSub(j); }}
                            onClick={() => { if (i !== at) go(i); setSub(j); setMine(true); setPeek(-1); }}>{name}</button>
                        ))}
                      </div>
                      <div className="in-ui-b" aria-hidden="true"><View key={k + v} k={k} v={v} on={on} /></div>
                    </div>
                    <div className="in-panel-c">
                      <h3 className="v2-headline">{t}</h3>
                      <p className="v2-body in-said"><Said s={d} k={tools[v][1]} /></p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const CODE = `import { InsightsProvider, useFeatureFlag } from "@hanzo/insights-react"

function App() {
  return (
    <InsightsProvider
      apiKey="ins_proj_xxx"
      host="https://insights.hanzo.ai"
    >
      <MyApp />
    </InsightsProvider>
  )
}

function MyApp() {
  // Feature flags
  const showNewUI = useFeatureFlag("new-dashboard")

  // Track events
  insights.capture("button_clicked", { variant: "primary" })

  return showNewUI ? <NewDashboard /> : <OldDashboard />
}`;

/* the app the code renders: the same flag flips it */
function Flip() {
  const [ref, seen] = useLive(0.3);
  const [paused, togglePause] = usePause();
  const live = seen && !paused;
  const [on, setOn] = useState(true);
  useTick(2800, live, () => setOn((v) => !v));
  return (
    <div className="lp-host">
    <LivePause paused={paused} onToggle={togglePause} className="in-flip-pause" dark />
    <div className="in-flip" ref={ref} aria-hidden="true">
      <p className="in-flip-k"><code>showNewUI</code><i className={'in-sw d' + (on ? ' on' : '')} /></p>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={on ? 'n' : 'o'} className={'in-app ' + (on ? 'new' : 'old')} initial={{ opacity: 0, rotateY: -12, scale: 0.97 }} animate={{ opacity: 1, rotateY: 0, scale: 1 }} exit={{ opacity: 0, rotateY: 12, scale: 0.97, transition: { duration: 0.2 } }} transition={{ duration: 0.6, ease: EASE }}>
          <p className="in-app-t">{on ? '<NewDashboard />' : '<OldDashboard />'}</p>
          {on ? (
            <>
              <svg className="in-app-c" viewBox="0 0 300 90" preserveAspectRatio="none"><polyline points="0,80 40,70 80,74 120,52 160,58 200,34 240,40 300,14" pathLength="1" /></svg>
              <div className="in-app-r">{[0.9, 0.62, 0.4].map((w, i) => <i key={i} style={{ '--iw': w, '--id': i }} />)}</div>
            </>
          ) : (
            <div className="in-app-r old">{[0.7, 0.7, 0.7, 0.7].map((w, i) => <i key={i} style={{ '--iw': w, '--id': i }} />)}</div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
    </div>
  );
}

export default function Insights() {
  return (
    <main className="v2 in">
      <section className="in-hero">
        <div className="v2-wrap v2-grid in-hero-g">
          <div className="in-hero-obj"><Rollout /></div>
          <div className="in-hero-c">
            <Lines as="h1" className="v2-display in-h1" lines={['Hanzo', 'Insights']} data-morph-target="" />
            <p className="v2-lede in-sub v2-in" style={{ animationDelay: '.3s' }}>Product analytics and feature flags</p>
            <Cta to="https://insights.hanzo.ai" id="insights.hero" thumb>Open Insights</Cta>
          </div>
        </div>
      </section>

      <Tour />

      <section className="in-code v2-dark" data-room="dark">
        <div className="v2-wrap">
          <h2 className="v2-display s in-code-h">The flag and the event, in one provider</h2>
          <div className="in-code-g">
            <CodeBlock code={CODE} label="app.tsx" className="in-code-c" />
            <Flip />
          </div>
        </div>
      </section>

      <section className="v2-sec in-start">
        <div className="v2-wrap v2-grid">
          <h2 className="v2-display m in-start-h">Start with autocapture</h2>
          <div className="in-start-r">
            <p className="v2-lede">Drop the provider in and you have data by this afternoon. Name the events that matter once you know which ones those are. There is a free tier, and the whole thing is open source if you would rather run it yourself.</p>
            <div className="v2-acts"><Cta to="/login" kind="quiet" id="insights.try-hanzo">Try Hanzo</Cta><Cta to="https://github.com/hanzoai/insights" kind="quiet" id="insights.view-on-github">View on GitHub</Cta></div>
          </div>
        </div>
      </section>

      <ShipPrompt name="Insights" prompt="Read https://hanzo.ai/skill.md and use Hanzo Insights in my project." flip className="in-ship" />

      <GetIt name="Insights" tag="Product insights + experiments" seed="insights" data={[4, 6]} license="MIT" repo={['hanzoai/insights', 'https://github.com/hanzoai/insights']} stars="4 stars" ask={['Open Insights', 'https://insights.hanzo.ai', 'insights.close']} className="in-get">
        <p className="in-get-p">There is a free tier, and the whole thing is open source if you would rather run it yourself.</p>
      </GetIt>
    </main>
  );
}
