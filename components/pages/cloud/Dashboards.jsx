'use client';
/* Dashboards. Signature: a dashboard assembling from its queries. A widget definition is written line by line (what to
   select, how to group it) and the widget it describes drops into the grid; the next one becomes a monitor whose alert
   line sits on the same chart; a score config fills its own tile. Every tile is a saved query over one store. Below:
   the six parts as a two-column blueprint beside the example console.
   Beyond: "Watch it instead". One saved query, switched between widget and monitor: only its first word changes, and
   the alert line you drag sits on the same chart, so the alert and the chart cannot disagree (Hanzo's own claim).
   Every word and link is Hanzo's; values are drawn, not measured. */
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EASE, Rise } from '../../ui';
import { A } from '../../kit';
import { Hero, Paste, Related, Get, Console, useLive, useSteps } from './Frame';
import './Dashboards.css';

// [kind, select, group by, tile]
const DEFS = [['widget', 'latency', 'model', 'line'], ['widget', 'traces', 'route', 'bars'], ['monitor', 'error rate', 'service', 'alert'], ['score config', 'rating', 'evaluator', 'score']];

function Tile({ kind }) {
  if (kind === 'line') return <svg viewBox="0 0 100 40" preserveAspectRatio="none"><motion.path d="M0 30 L12 26 L24 28 L36 18 L48 22 L60 12 L72 16 L84 8 L100 10" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.1, ease: EASE }} /></svg>;
  if (kind === 'bars') return <div className="db-bars">{[70, 45, 88, 30, 56].map((h, i) => <motion.i key={i} initial={{ scaleY: 0 }} animate={{ scaleY: h / 100 }} transition={{ delay: i * 0.08, duration: 0.6, ease: EASE }} />)}</div>;
  if (kind === 'alert') return <svg viewBox="0 0 100 40" preserveAspectRatio="none"><line x1="0" x2="100" y1="12" y2="12" className="th" /><motion.path d="M0 32 L14 30 L28 31 L42 26 L56 28 L70 14 L80 8 L90 20 L100 24" className="err" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.1, ease: EASE }} /></svg>;
  return <div className="db-score">{[1, 2, 3, 4, 5].map((s, i) => <motion.span key={s} initial={{ scaleY: 0 }} animate={{ scaleY: [0.2, 0.35, 0.6, 1, 0.7][i] }} transition={{ delay: i * 0.07, duration: 0.5, ease: EASE }}><b>{s}</b></motion.span>)}</div>;
}

function Assemble() {
  const [ref, live] = useLive(0.3);
  const [at, choose] = useSteps(DEFS.length, 3400, live);
  const [kind, sel, grp] = DEFS[at];
  return (
    <div className="db-stage" ref={ref}>
      <div className="db-def">
        <p className="db-k">saved query</p>
        <AnimatePresence mode="wait" initial={false}>
          <motion.pre key={at} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} aria-hidden="true">
            <motion.span initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 }}><em>{kind}</em>{'\n'}</motion.span>
            <motion.span initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}>select   <b>{sel}</b>{'\n'}</motion.span>
            <motion.span initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.65 }}>group by <b>{grp}</b>{'\n'}</motion.span>
            <motion.span initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.95 }}>from     <b>traces</b></motion.span>
          </motion.pre>
        </AnimatePresence>
        <div className="db-dots" role="tablist" aria-label="Saved queries">
          {DEFS.map((d, i) => <button key={i} type="button" role="tab" aria-selected={at === i} aria-label={d[0] + ' ' + d[1]} onClick={() => choose(i)} />)}
        </div>
      </div>
      <div className="db-grid" aria-hidden="true">
        {DEFS.map(([k, s, g, tile], i) => (
          <motion.div key={i} layout className={'db-tile t' + i + (at === i ? ' on' : '')} transition={{ type: 'spring', stiffness: 260, damping: 30 }}>
            <p className="db-tt"><b>{s}</b> by {g}<span>{k}</span></p>
            {at >= i || at === DEFS.length - 1 ? <Tile key={at === i ? 'a' + at : 's'} kind={tile} /> : <div className="db-empty" />}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* Beyond: one definition, looked at or watched. Points are the hero's drawn error-rate line, not measurements. */
const PTS = [[0, 32], [14, 30], [28, 31], [42, 26], [56, 28], [70, 14], [80, 8], [90, 20], [100, 24]];

function Watch() {
  const [mon, setMon] = useState(true);
  const [th, setTh] = useState(18); // the alert line, in chart units (smaller is higher)
  return (
    <section className="x-sec db-watch" aria-labelledby="db-watch-h">
      <div className="x-wrap db-watch-grid">
        <div>
          <h2 id="db-watch-h">Monitors</h2>
          <p>A saved query you want watched rather than looked at. Same definition as the widget beside it, kept in one place so the alert and the chart cannot disagree.</p>
          <div className="db-kind" role="radiogroup" aria-label="Saved query kind">
            {['widget', 'monitor'].map((k) => <button key={k} type="button" role="radio" aria-checked={mon === (k === 'monitor')} onClick={() => setMon(k === 'monitor')}>{k}</button>)}
          </div>
        </div>
        <div className="db-watch-box">
          <pre aria-label="Saved query"><em>{mon ? 'monitor' : 'widget'}</em>{'\n'}select   <b>error rate</b>{'\n'}group by <b>service</b>{'\n'}from     <b>traces</b></pre>
          <div className="db-watch-chart"><div className="db-plot">
            <svg viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
              <path d={PTS.map(([x, y], i) => (i ? 'L' : 'M') + x + ' ' + y).join(' ')} className="err" />
              {mon && <line x1="0" x2="100" y1={th} y2={th} className="th" />}
            </svg>
            {PTS.map(([x, y]) => <i key={x} className={mon && y < th ? 'hot' : ''} style={{ left: x + '%', top: (y / 40) * 100 + '%' }} aria-hidden="true" />)}
          </div></div>
          <label className={'db-th' + (mon ? '' : ' off')}>
            <span>alert line</span>
            <input type="range" min="4" max="36" value={40 - th} disabled={!mon} onChange={(e) => setTh(40 - +e.target.value)} />
          </label>
        </div>
      </div>
    </section>
  );
}

const PARTS = [
  ['Widgets over your own data', 'A widget names what to select and how to group it. Because it queries the store that already holds your traces, a chart cannot drift from what happened.'],
  ['Monitors', 'A saved query you want watched rather than looked at. Same definition as the widget beside it, kept in one place so the alert and the chart cannot disagree.'],
  ['One store, not two', 'Traces, observations and scores live in the service that serves the dashboards. There is no export step, no second database to keep in sync, and nothing to reconcile after an outage.'],
  ['Saved table views', 'The columns, filters and sort you arrived at are a preset you can name and return to. Presets belong to the project, so a colleague opens the view you meant.'],
  ['Scores are yours to define', 'Score configs say what good means for your application — a rating, a label, a number from an evaluator. Dashboards then aggregate the thing you actually care about.'],
  ['Permission per category', "Access is granted by category rather than per object, and the boundary is the organization on your token. Reading somebody else's project is not a URL away."],
];
const SIDE = [['Dashboards', '/dashboards'], ['Logs', '/cloud/logs'], ['Metrics', '/metrics'], ['O11y', '/o11y'], ['AI Metrics', '/cloud/ai-metrics'], ['Billing', '/billing'], ['Plans & Pricing', '/cloud/plans'], ['Sessions', '/cloud/sessions']];

export default function Dashboards() {
  return (
    <main className="db">
      <Hero look="stack" kick="Traces · observations · scores" title="Hanzo Dashboards" sub="A dashboard is a saved query" acts={[['GitHub', 'https://github.com/hanzoai/dashboards']]}>
        <Assemble />
      </Hero>
      <Watch />
      <section className="x-sec db-made">
        <div className="x-wrap">
          <div className="db-made-h"><h2>What a dashboard is made of</h2><p>Widgets, monitors, saved views and score configs — all of them queries over one store.</p></div>
          <div className="db-blue">
            {PARTS.map(([t, d], i) => <Rise key={t} className="db-part" y={16} delay={(i % 2) * 0.06}><span>{String(i + 1).padStart(2, '0')}</span><h3>{t}</h3><p>{d}</p></Rise>)}
          </div>
          <ul className="db-figs">{[['Traces', 'The thing being queried'], ['Scores', 'Yours to define'], ['Monitors', 'Saved and watched'], ['SSO', 'IAM login']].map(([a, b], i) => <li key={a}><b>{a}</b><span>{b}</span></li>)}</ul>
        </div>
      </section>
      <section className="x-sec db-start" data-room="dark">
        <div className="x-wrap db-start-grid">
          <div>
            <h2>Start from a trace</h2>
            <p>Send traces from your application, then build the view that answers the question you keep asking about them.</p>
            <div className="db-acts"><A to="https://github.com/hanzoai/dashboards" className="x-btn">View on GitHub</A></div>
            <Paste dark name="Dashboards" api="/v1/o11y/dashboards" prompt="Read https://hanzo.ai/skill.md and use Hanzo Dashboards in my project. Start with: hanzo o11y dashboards list" className="db-paste" />
          </div>
          <div>
            <div><Console name="Dashboards" api="/v1/o11y/dashboards" side={SIDE} /></div>
            <p className="db-note">Example project. Every name in it is one you would give your own.</p>
          </div>
        </div>
      </section>
      <section className="db-rel"><div className="x-wrap"><Related items={[['Logs', '/cloud/logs', 'Search every line'], ['Metrics', '/metrics', 'Time series & SLOs']]} /></div></section>
      <Get name="Dashboards" tag="Composable dashboards" repo={['hanzoai/dashboards', 'https://github.com/hanzoai/dashboards']} stars="4 stars" />
      <i hidden data-thumb="GitHub" data-href="https://github.com/hanzoai/dashboards" />
    </main>
  );
}
