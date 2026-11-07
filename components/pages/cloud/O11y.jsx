'use client';
/* O11y. Signature: a trace waterfall you can pivot from. One request draws itself across services as a waterfall,
   the slow span is singled out, and the log lines written with that span's id appear beside it, because the pivot is a
   click; an exception rolls up into one row with a count. The six parts read as a numbered column beside the example
   console, and the closing line is the OTLP endpoint. Every word and link is Hanzo's; span names are examples.
   Beyond: What you keep. Pick what you run today (PromQL, an OTel SDK or collector, PagerDuty or Opsgenie, Slack,
   Teams, email or a webhook) and read Hanzo's own line that says it carries over, so a team can tell before moving
   that nothing gets rewritten. */
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EASE, Rise, Words } from '../../ui';
import { Hero, Paste, Related, Get, Console, useLive, useSteps } from './Frame';
import './O11y.css';

// [service, operation, start %, width %]
const SPANS = [['gateway', 'GET /v1/checkout', 0, 100], ['api', 'checkout', 3, 92], ['auth', 'verify token', 5, 9], ['queue', 'enqueue receipt', 18, 7], ['db', 'SELECT cart', 27, 46], ['payments', 'charge', 76, 16]];
const LOGS = {
  4: ['db · query plan: seq scan', 'db · rows read', 'api · waited on db'],
  5: ['payments · charge created', 'payments · webhook queued'],
  1: ['api · request received', 'api · cart loaded', 'api · response sent'],
};
const PICKS = [4, 5, 1];

function Waterfall() {
  const [ref, live] = useLive(0.3);
  const [k, choose] = useSteps(PICKS.length, 3600, live);
  const sel = PICKS[k];
  return (
    <div className="ob-fall" ref={ref}>
      <div className="ob-trace">
        <div className="ob-head"><span>trace</span><b>GET /v1/checkout</b><em>sorted by the slow tail</em></div>
        <ul className="ob-spans">
          {SPANS.map(([svc, op, s, w], i) => (
            <li key={op}>
              <button type="button" data-cursor="Pivot" className={(sel === i ? 'on' : '') + (i === 4 ? ' slow' : '')} onClick={() => choose(PICKS.indexOf(i) >= 0 ? PICKS.indexOf(i) : 0)} aria-pressed={sel === i} aria-label={svc + ' ' + op}>
                <span className="ob-name"><b>{svc}</b>{op}</span>
                <span className="ob-track"><motion.i initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.7, ease: EASE, delay: 0.1 + i * 0.12 }} style={{ left: s + '%', width: w + '%' }} /></span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="ob-side" aria-hidden="true">
        <p className="ob-k">logs · same span id</p>
        <AnimatePresence mode="wait" initial={false}>
          <motion.ul key={sel} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: EASE }}>
            {(LOGS[sel] || []).map((l) => <li key={l}>{l}</li>)}
          </motion.ul>
        </AnimatePresence>
        <div className="ob-exc"><p className="ob-k">exceptions</p><div><b>TimeoutError</b><span>× 1,000</span></div><em>one row, links to its trace</em></div>
      </div>
    </div>
  );
}

const PARTS = [
  ['Traces and APM', 'Follow one request across services, queues and databases. Sort by the slow tail rather than the average, and open the span that spent the time.'],
  ['Metrics', 'Write PromQL if you already have it, or build the query in the UI if you do not. Both run against the same store the traces are in.'],
  ['Logs', 'Search structured logs by field, not by regex over a blob. A span carries the id its log lines were written with, so the pivot is a click.'],
  ['Exceptions', 'Errors are grouped and counted rather than listed, so a thousand of the same stack trace is one row with a number on it — and it links to the trace that raised it.'],
  ['Dashboards and alerts', 'An alert rule is a saved query, so what fires at three in the morning is something you already looked at. It reaches PagerDuty, Opsgenie, Slack, Teams, email or a webhook.'],
  ['OpenTelemetry on the wire', 'OTLP over gRPC on 4317 and HTTP on 4318. Any OTel SDK or collector points at it by setting one endpoint variable — there is no agent of ours to install.'],
];
// [what you run now, the part that keeps it, that part's own words]
const KEEP = [['PromQL', 1], ['An OTel SDK or collector', 5], ['PagerDuty or Opsgenie', 4], ['Slack, Teams, email or a webhook', 4]];

function Keep() {
  const [k, setK] = useState(0);
  const [t, d] = PARTS[KEEP[k][1]];
  return (
    <div className="ob-keep">
      <p className="ob-k">What you keep</p>
      <div className="ob-keep-c" role="group" aria-label="What you run today">
        {KEEP.map(([w], i) => <button key={w} type="button" aria-pressed={k === i} onClick={() => setK(i)}>{w}</button>)}
      </div>
      <p className="ob-keep-a" aria-live="polite"><b>{t}</b> {d}</p>
    </div>
  );
}

const SIDE = [['O11y', '/o11y'], ['Logs', '/cloud/logs'], ['Metrics', '/metrics'], ['Dashboards', '/dashboards'], ['AI Metrics', '/cloud/ai-metrics'], ['Billing', '/billing'], ['Plans & Pricing', '/cloud/plans'], ['Sessions', '/cloud/sessions']];

export default function O11y() {
  return (
    <main className="ob">
      <Hero kick="o11y.hanzo.ai" title="Hanzo O11y" sub="Traces, metrics and logs, in one place" acts={[['View on GitHub', 'https://github.com/hanzoai/o11y']]}>
        <Waterfall />
      </Hero>
      <section className="x-sec ob-one" data-room="dark" data-thumb="View on GitHub" data-href="https://github.com/hanzoai/o11y">
        <div className="x-wrap ob-one-grid">
          <div className="ob-one-l">
            <Words text="One store, one query language" />
            <p>Every panel scopes to your org from the token, so a shared deployment still answers one tenant at a time.</p>
            <motion.div className="ob-wipe" initial={{ clipPath: 'inset(0 0 100% 0 round 22px)' }} whileInView={{ clipPath: 'inset(0 0 0% 0 round 22px)' }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.9, ease: EASE }}><Console name="O11y" api="/v1/o11y" side={SIDE} /></motion.div>
            <p className="ob-note">Example project. Every name in it is one you would give your own.</p>
          </div>
          <ol className="ob-parts">{PARTS.map(([t, d], i) => <Rise as="li" key={t} y={18}><span>{String(i + 1).padStart(2, '0')}</span><div><h3>{t}</h3><p>{d}</p></div></Rise>)}</ol>
        </div>
      </section>
      <section className="x-sec ob-otlp">
        <div className="x-wrap ob-otlp-grid">
          <div>
            <h2>Point an OTLP endpoint at it</h2>
            <div className="ob-ports" aria-hidden="true"><span><b>4317</b>gRPC</span><span><b>4318</b>HTTP</span></div>
            <Keep />
          </div>
          <Paste name="O11y" api="/v1/o11y" prompt="Read https://hanzo.ai/skill.md and use Hanzo O11y in my project. Start with: hanzo o11y logs get" className="ob-paste" />
        </div>
        <div className="x-wrap"><Related className="ob-rel" items={[['Logs', '/cloud/logs', 'Search every line'], ['Metrics', '/metrics', 'Time series & SLOs']]} /></div>
      </section>
      <Get name="O11y" tag="Observability suite" repo={['hanzoai/o11y', 'https://github.com/hanzoai/o11y']} stars="4 stars" />
    </main>
  );
}
