'use client';
// Persona: a product team deciding what to ship and how it is used.
// Goal: see a flag roll out and be killed without a deploy, and find the tool for their question.
// CTA: Open Insights (insights.hero, insights.close).
// Metric: cta_click insights.hero
// Signature: a flag you roll out by hand: a field of people lights as the flag climbs, the kill switch drops it.
// Beyond: a tool finder: pick one of the ten tools Hanzo names and its drawing and Hanzo's full sentence come back.
/* Insights (v2, archetype A Launch).
   V2: 8/10 Round 2: the hero no longer jumps (fixed flag card rows, modes on one line, field 20x6, h1 top-aligned at
   38%, CLS measured under 0.02 at both sizes); the tour window holds one height (panels stacked in one cell); the
   invented questions are gone, the finder uses Hanzo's tool names, full sentences and the tour's drawings, on a snap
   rail on phone; deck tokens only, no dot glow; 26px section heads; kill switch, tab and mode hovers that tell you
   something (a ghost of the dots a mode would light); the close carries the field and a free-tier line.
   Signature: a flag you roll out by hand. A field of people, each a dot; the new-dashboard flag rolls out to a share of
   them (drag it, or let it climb), the ones in the rollout light up and send button_clicked events; the kill switch
   turns it off for everyone at once.
   Supporting: kinetic title lines; the six tools as a product window whose tabs tour themselves with a progress line
   (pick one and it stays); in the dark room the provider's code beside the app it renders, flipping between
   NewDashboard and OldDashboard with the same flag.
   Beyond: pick one of the tools Hanzo names and its drawing comes back with Hanzo's whole sentence, its own clause in ink.
   Greys from the deck only. Every word and link is Hanzo's; the people are dots. */
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { A, Cta, CodeBlock } from '../../kit';
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
// the field is 20 x 6 on desktop and 12 x 10 on phone; a cohort is the block in the middle of whichever grid shows
const lit = (m, i, cols) => {
  if (m === 0) return order[i] < N * 0.3;
  if (m === 2) return i === 52;
  const R = N / cols, r = Math.floor(i / cols), c = i % cols;
  return c >= Math.round(cols * 0.27) && c < Math.round(cols * 0.73) && r >= Math.floor(R * 0.25) && r < Math.ceil(R * 0.75);
};
const fine = (e) => e.pointerType === 'mouse';

/* the rollout: a flag, a field of people, the events they send; then the kill switch, no deploy */
function Rollout() {
  const [ref, seen] = useLive(0.3);
  const [paused, togglePause] = usePause();
  const live = seen && !paused;
  const [m, setM] = useState(0);
  const [kill, setKill] = useState(false);
  const [mine, setMine] = useState(false);
  const [ev, setEv] = useState(0);
  const [peek, setPeek] = useState(-1);
  const [cols, setCols] = useState(20);
  useEffect(() => {
    const q = matchMedia('(max-width: 899px)');
    const on = () => setCols(q.matches ? 12 : 20);
    on();
    q.addEventListener('change', on);
    return () => q.removeEventListener('change', on);
  }, []);
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
          <button type="button" role="switch" aria-checked={!kill} aria-label="Kill switch" className={'in-kill' + (kill ? ' off' : '')} onClick={() => { setMine(true); setKill(!kill); }}><i /><span>{kill ? 'off' : 'on'}</span></button>
          <LivePause paused={paused} onToggle={togglePause} inline className="in-pause" />
        </div>
        <div className="in-pct">
          <span>roll out to</span>
          <div className="in-modes" role="radiogroup" aria-label="Roll out to" onPointerLeave={() => setPeek(-1)}>
            {MODES.map((t, i) => (
              <button key={t} type="button" role="radio" data-sound="tick" aria-checked={!kill && m === i} onPointerEnter={(e) => fine(e) && setPeek(i)} onClick={() => { setMine(true); setKill(false); setM(i); setPeek(-1); }}>
                {!kill && m === i && <motion.span layoutId="in-mode" className="in-mode-bg" transition={{ duration: 0.3, ease: EASE }} />}
                <span>{t}</span>
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
      <div className="in-field" aria-hidden="true">
        {Array.from({ length: N }).map((_, i) => {
          const on = !kill && lit(m, i, cols);
          const pk = peek >= 0 && !on && lit(peek, i, cols);
          return <i key={i} className={on ? 'on' : pk ? 'pk' : ''} style={{ transitionDelay: (order[i] % 30) * 10 + 'ms' }} />;
        })}
      </div>
    </div>
  );
}

const LOG = [
  ['Events, and SQL when you need it', 'Autocapture gets you data before you have instrumented anything, and named events get you data you can trust. When a chart cannot express the question, write the query instead — it is the same table underneath.', 'events'],
  ['Feature flags', 'Roll out to a percentage, a cohort, or one account. The flag is also a kill switch, which is the reason to reach for one: turning a feature off should not require a deploy at the worst possible moment.', 'flags'],
  ['Session replay', 'Watch what actually happened. Heatmaps and scroll depth tell you where attention went; a replay tells you why someone gave up, which no funnel ever will.', 'replay'],
  ['Experiments', 'An experiment is a flag with a metric attached to it. Pick the goal before you start, and let it run until the result means something rather than until it looks good.', 'ab'],
  ['Funnels, retention and paths', 'Funnels show where people stop, retention shows whether they came back, and paths show the route nobody designed. The third one is usually where the surprise is.', 'funnel'],
  ['Errors and LLM cost', 'Error tracking sits beside the analytics, so a spike in rage clicks and the exception behind it are one investigation. If your product calls a model, the traces, latency and cost per generation land here too.', 'errors'],
];

/* each tool's drawing, from its own words; shapes only, no figures */
function Pane({ k }) {
  if (k === 'events') return (
    <div className="in-p-ev">
      {['Autocapture', 'named events', 'button_clicked', 'new-dashboard'].map((e, i) => <p key={e} style={{ '--d': i }}><i />{e}</p>)}
      <p className="sql">write the query instead</p>
    </div>
  );
  if (k === 'flags') return (
    <div className="in-p-fl">
      {[['a percentage', 60], ['a cohort', 35], ['one account', 8]].map(([t, w]) => <div key={t}><span>{t}</span><b><i style={{ width: w + '%' }} /></b></div>)}
      <p><i />kill switch</p>
    </div>
  );
  if (k === 'replay') return (
    <div className="in-p-rp">
      <svg viewBox="0 0 320 180" aria-hidden="true"><rect x="8" y="8" width="304" height="164" rx="14" fill="#fff" stroke="rgba(0,0,0,.08)" /><rect x="28" y="30" width="140" height="12" rx="6" fill="#ededed" /><rect x="28" y="54" width="220" height="10" rx="5" fill="#f2f2f2" /><rect x="28" y="120" width="96" height="30" rx="10" fill="#ededed" /><path d="M60 150 C 110 60, 180 160, 230 80 S 270 60, 286 120" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="5 6" strokeLinecap="round" /><circle cx="286" cy="120" r="7" fill="currentColor" /></svg>
      <p>why someone gave up</p>
    </div>
  );
  if (k === 'ab') return (
    <div className="in-p-ab">
      <div><span>A</span><b style={{ height: '58%' }} /></div>
      <div className="b"><span>B</span><b style={{ height: '72%' }} /></div>
      <p>a flag with a metric attached</p>
    </div>
  );
  if (k === 'funnel') return (
    <div className="in-p-fn">
      {[100, 72, 48, 30].map((w, i) => <i key={i} style={{ width: w + '%' }} />)}
      <p>where people stop</p>
    </div>
  );
  return (
    <div className="in-p-er">
      <p className="x">rage clicks</p>
      <p className="t">the exception behind it</p>
      <p className="c">cost per generation</p>
    </div>
  );
}

/* The six tools in one window; tabs tour themselves with a progress line until you pick one. */
function Tour() {
  const [ref, seen] = useLive(0.35);
  const [paused, togglePause] = usePause();
  const live = seen && !paused;
  const [at, setAt] = useState(0);
  const [mine, setMine] = useState(false);
  useEffect(() => {
    if (!live || mine) return;
    const t = setTimeout(() => setAt((v) => (v + 1) % LOG.length), 5200);
    return () => clearTimeout(t);
  }, [at, live, mine]);
  return (
    <section className="v2-sec in-tour">
      <div className="v2-wrap">
        <div className="v2-grid in-tour-h">
          <h2 className="v2-display s">Ship it, then find out</h2>
          <ul className="in-figs">{[['Events', 'Auto-capture'], ['Flags', 'A/B'], ['OSS', 'Self-hosted']].map(([a, b]) => <li key={a}><b>{a}</b><span>{b}</span></li>)}</ul>
        </div>
        <div className="in-win v2-obj" ref={ref}>
          <div className="in-win-bar"><span className="in-dots"><i /><i /><i /></span><span>insights.hanzo.ai</span><LivePause paused={paused} onToggle={togglePause} inline className="in-pause" /></div>
          <div className="in-win-body">
            <div className="in-tabs" role="tablist" aria-label="Ship it, then find out">
              {LOG.map(([t], i) => (
                <button key={t} type="button" role="tab" id={'in-t' + i} aria-selected={at === i} aria-controls={'in-p' + i} onClick={() => { setAt(i); setMine(true); }}>
                  <span className="in-tab-n">{String(i + 1).padStart(2, '0')} / 06</span>
                  <span className="in-tab-t">{t}</span>
                  {at === i && !mine && live && <i className="in-tab-bar" key={at} />}
                </button>
              ))}
            </div>
            {/* every panel sits in one grid cell, so the window is always as tall as the tallest one and never pushes the page */}
            <div className="in-panels">
            {LOG.map(([t, d, k], i) => (
              <div key={t} id={'in-p' + i} role="tabpanel" aria-labelledby={'in-t' + i} aria-hidden={at !== i} inert={at !== i} className={'in-panel' + (at === i ? ' on' : '')}>
                <div className="in-panel-v" aria-hidden="true"><Pane k={k} /></div>
                <div className="in-panel-c">
                  <h3 className="v2-headline">{t}</h3>
                  <p className="v2-body">{d}</p>
                </div>
              </div>
            ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// The ten tools Hanzo names, each with Hanzo's whole sentence about it (never cut): [tool, sentence, its own clause, drawing]
const S_FUN = 'Funnels show where people stop, retention shows whether they came back, and paths show the route nobody designed.';
const S_RP = 'Heatmaps and scroll depth tell you where attention went; a replay tells you why someone gave up, which no funnel ever will.';
const ASK = [
  ['Funnels', S_FUN, 'Funnels show where people stop', 'funnel'],
  ['Retention', S_FUN, 'retention shows whether they came back', 'funnel'],
  ['Paths', S_FUN, 'paths show the route nobody designed', 'funnel'],
  ['Session replay', S_RP, 'a replay tells you why someone gave up, which no funnel ever will', 'replay'],
  ['Heatmaps and scroll depth', S_RP, 'Heatmaps and scroll depth tell you where attention went', 'replay'],
  ['Experiments', 'An experiment is a flag with a metric attached to it.', 'An experiment is a flag with a metric attached to it', 'ab'],
  ['Feature flags', 'The flag is also a kill switch, which is the reason to reach for one: turning a feature off should not require a deploy at the worst possible moment.', 'The flag is also a kill switch', 'flags'],
  ['Error tracking', 'Error tracking sits beside the analytics, so a spike in rage clicks and the exception behind it are one investigation.', 'a spike in rage clicks and the exception behind it are one investigation', 'errors'],
  ['LLM cost', 'If your product calls a model, the traces, latency and cost per generation land here too.', 'the traces, latency and cost per generation land here too', 'errors'],
  ['SQL', 'When a chart cannot express the question, write the query instead — it is the same table underneath.', 'write the query instead', 'events'],
];

/* the whole sentence, its own clause in ink and the rest quiet */
function Said({ s, k }) {
  const at = s.indexOf(k);
  return <>{s.slice(0, at)}<b>{k}</b>{s.slice(at + k.length)}</>;
}

/* Beyond: a tool finder. Pick a tool; its drawing and Hanzo's sentence come back. */
function Ask() {
  const [at, setAt] = useState(0);
  return (
    <section className="v2-sec in-ask">
      <div className="v2-wrap v2-grid">
        <div className="in-ask-l">
          <ul className="in-ask-q" role="radiogroup" aria-label="Ship it, then find out">
            {ASK.map(([q], i) => <li key={q}><button type="button" role="radio" data-sound="tick" aria-checked={at === i} onClick={() => setAt(i)}>{q}</button></li>)}
          </ul>
        </div>
        <div className="in-ask-a" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={at} className="in-ask-in" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10, transition: { duration: 0.15 } }} transition={{ duration: 0.55, ease: EASE }}>
              <div className="in-ask-v in-panel-v" aria-hidden="true"><Pane k={ASK[at][3]} /></div>
              <div className="in-ask-c">
                <p className="in-ask-t">{ASK[at][0]}</p>
                <p className="in-ask-s"><Said s={ASK[at][1]} k={ASK[at][2]} /></p>
              </div>
            </motion.div>
          </AnimatePresence>
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
      <p className="in-flip-k"><code>showNewUI</code><span className={on ? 'on' : ''}>{on ? 'true' : 'false'}</span></p>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={on ? 'n' : 'o'} className={'in-app ' + (on ? 'new' : 'old')} initial={{ opacity: 0, rotateY: -12, scale: 0.97 }} animate={{ opacity: 1, rotateY: 0, scale: 1 }} exit={{ opacity: 0, rotateY: 12, scale: 0.97, transition: { duration: 0.2 } }} transition={{ duration: 0.6, ease: EASE }}>
          <p className="in-app-t">{on ? '<NewDashboard />' : '<OldDashboard />'}</p>
          <div className="in-app-g">{[0, 1, 2, 3, 4, 5].map((i) => <i key={i} />)}</div>
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

      <Ask />

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
