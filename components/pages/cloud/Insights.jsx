'use client';
/* Insights. Signature: a flag you roll out by hand. A field of people, each a dot; the new-dashboard flag rolls out to a
   share of them (drag it, or let it climb), the ones in the rollout light up and start sending button_clicked events;
   the kill switch turns it off for everyone at once, no deploy. The six facts read as a release log; the code is the
   provider that holds both. Beyond: "Ask it a question" - pick the question you actually have and the tool that
   answers it comes back in Hanzo's own sentence, word by word. Every word and link is Hanzo's; the people are dots. */
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EASE, Rise, Words } from '../../ui';
import { A } from '../../kit';
import { Hero, Paste, Get, Code, useLive, useEvery } from './Frame';
import './Insights.css';

const N = 96;
const rank = Array.from({ length: N }, (_, i) => ({ i, r: (Math.sin(i * 12.9898) * 43758.5453) % 1 })).sort((a, b) => Math.abs(a.r) - Math.abs(b.r)).map((x) => x.i);
const order = new Array(N);
rank.forEach((cell, k) => { order[cell] = k; });
const STEPS = [10, 25, 50, 100];

function Rollout() {
  const [ref, live] = useLive(0.3);
  const [pct, setPct] = useState(25);
  const [kill, setKill] = useState(false);
  const [mine, setMine] = useState(false);
  const [k, setK] = useState(1);
  const [ev, setEv] = useState(0);
  useEffect(() => {
    if (mine || !live) return;
    const t = setTimeout(() => {
      if (k === STEPS.length) { setKill(true); setK(k + 1); return; }
      if (k > STEPS.length) { setKill(false); setPct(STEPS[0]); setK(1); return; }
      setPct(STEPS[k]); setK(k + 1);
    }, k >= STEPS.length ? 2600 : 2000);
    return () => clearTimeout(t);
  }, [k, mine, live]);
  useEvery(500, live && !kill && pct > 0, () => setEv((e) => e + 1));
  const on = kill ? 0 : Math.round((pct / 100) * N);
  return (
    <div className="in-roll" ref={ref}>
      <div className="in-flag">
        <div className="in-flag-top">
          <code>new-dashboard</code>
          <button type="button" role="switch" aria-checked={!kill} aria-label="Kill switch" className={'in-kill' + (kill ? ' off' : '')} onClick={() => { setMine(true); setKill(!kill); }}><i />{kill ? 'off' : 'on'}</button>
        </div>
        <label className="in-pct">
          <span>roll out to <b>{kill ? 0 : pct}%</b></span>
          <input type="range" min="0" max="100" step="5" value={pct} onChange={(e) => { setMine(true); setKill(false); setPct(+e.target.value); }} aria-label="Rollout percentage" />
        </label>
      </div>
      <div className="in-field" aria-hidden="true">
        {Array.from({ length: N }).map((_, i) => <i key={i} className={order[i] < on ? 'on' : ''} style={{ transitionDelay: (order[i] % 24) * 12 + 'ms' }} />)}
      </div>
      <div className="in-events" aria-hidden="true">
        <AnimatePresence initial={false}>
          {on > 0 && <motion.p key={ev} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>capture · button_clicked · variant: primary</motion.p>}
          {kill && <motion.p key="k" className="kill" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>kill switch · no deploy</motion.p>}
        </AnimatePresence>
      </div>
    </div>
  );
}

const LOG = [
  ['Events, and SQL when you need it', 'Autocapture gets you data before you have instrumented anything, and named events get you data you can trust. When a chart cannot express the question, write the query instead — it is the same table underneath.'],
  ['Feature flags', 'Roll out to a percentage, a cohort, or one account. The flag is also a kill switch, which is the reason to reach for one: turning a feature off should not require a deploy at the worst possible moment.'],
  ['Session replay', 'Watch what actually happened. Heatmaps and scroll depth tell you where attention went; a replay tells you why someone gave up, which no funnel ever will.'],
  ['Experiments', 'An experiment is a flag with a metric attached to it. Pick the goal before you start, and let it run until the result means something rather than until it looks good.'],
  ['Funnels, retention and paths', 'Funnels show where people stop, retention shows whether they came back, and paths show the route nobody designed. The third one is usually where the surprise is.'],
  ['Errors and LLM cost', 'Error tracking sits beside the analytics, so a spike in rage clicks and the exception behind it are one investigation. If your product calls a model, the traces, latency and cost per generation land here too.'],
];

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

// the question is the visitor's; the tool and the sentence after it are Hanzo's own
const ASK = [
  ['Where do people stop?', 'Funnels', 'Funnels show where people stop.'],
  ['Did they come back?', 'Retention', 'Retention shows whether they came back.'],
  ['Which way did they go?', 'Paths', 'Paths show the route nobody designed.'],
  ['Why did someone give up?', 'Session replay', 'A replay tells you why someone gave up, which no funnel ever will.'],
  ['Where did attention go?', 'Heatmaps and scroll depth', 'Heatmaps and scroll depth tell you where attention went.'],
  ['Is the new version better?', 'Experiments', 'An experiment is a flag with a metric attached to it.'],
  ['Can we turn it off, now?', 'Feature flags', 'The flag is also a kill switch: turning a feature off should not require a deploy at the worst possible moment.'],
  ['What broke behind that rage click?', 'Error tracking', 'A spike in rage clicks and the exception behind it are one investigation.'],
  ['What does each model call cost?', 'LLM cost', 'The traces, latency and cost per generation land here too.'],
  ['A chart cannot ask it.', 'SQL', 'When a chart cannot express the question, write the query instead — it is the same table underneath.'],
];

function Ask() {
  const [at, setAt] = useState(0);
  return (
    <section className="x-sec in-ask">
      <div className="x-wrap in-ask-grid">
        <div>
          <p className="x-kick">Ask it a question</p>
          <ul className="in-ask-q" role="radiogroup" aria-label="Your question">
            {ASK.map(([q], i) => <li key={q}><button type="button" role="radio" aria-checked={at === i} onClick={() => setAt(i)}>{q}</button></li>)}
          </ul>
        </div>
        <div className="in-ask-a" aria-live="polite">
          <p className="in-ask-t">{ASK[at][1]}</p>
          <Words key={at} as="p" className="in-ask-s" text={ASK[at][2]} amount={0.2} />
        </div>
      </div>
    </section>
  );
}

export default function Insights() {
  return (
    <main className="in">
      <Hero look="flip" kick="insights.hanzo.ai" title="Hanzo Insights" sub="Product analytics and feature flags" acts={[['Open Insights', 'https://insights.hanzo.ai']]}>
        <Rollout />
      </Hero>
      <section className="x-sec in-log">
        <div className="x-wrap in-log-grid">
          <div className="in-log-h">
            <h2>Ship it, then find out</h2>
            <span className="x-mono">01 / 06 — 06 / 06</span>
            <ul className="in-figs">{[['Events', 'Auto-capture'], ['Flags', 'A/B'], ['OSS', 'Self-hosted']].map(([a, b]) => <li key={a}><b>{a}</b><span>{b}</span></li>)}</ul>
          </div>
          <ol className="in-rel">
            {LOG.map(([t, d], i) => (
              <Rise as="li" key={t} y={16}>
                <span className="in-ver">{String(i + 1).padStart(2, '0')} / 06</span>
                <div><h3>{t}</h3><p>{d}</p></div>
              </Rise>
            ))}
          </ol>
        </div>
      </section>
      <Ask />
      <section className="x-sec in-code" data-room="dark">
        <div className="x-wrap in-code-grid">
          <div>
            <h2>The flag and the event, in one provider</h2>
            <Paste dark name="Insights" prompt="Read https://hanzo.ai/skill.md and use Hanzo Insights in my project." className="in-paste" />
          </div>
          <Code title="Insights" mark="new-dashboard" tabs={[{ k: 'app.tsx', code: CODE }]} />
        </div>
      </section>
      <section className="x-sec in-start">
        <div className="x-wrap in-start-grid">
          <h2>Start with autocapture</h2>
          <div>
            <p>Drop the provider in and you have data by this afternoon. Name the events that matter once you know which ones those are. There is a free tier, and the whole thing is open source if you would rather run it yourself.</p>
            <div className="in-acts"><A to="/login" className="x-btn solid">Try Hanzo</A><A to="https://github.com/hanzoai/insights" className="x-btn">View on GitHub</A></div>
          </div>
        </div>
      </section>
      <Get name="Insights" tag="Product insights + experiments" license="MIT" repo={['hanzoai/insights', 'https://github.com/hanzoai/insights']} stars="4 stars" />
    </main>
  );
}
