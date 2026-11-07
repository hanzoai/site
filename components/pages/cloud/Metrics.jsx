'use client';
/* Metrics. Signature: a live chart whose spike leads somewhere. Series stream across the chart, split by a label you
   choose (per-model, per-route, per-tenant: labels a time-series database would balk at are just columns here); a spike
   rises, a cursor lands on it, and the traces for that window open beneath, because they were never in a different
   system. The six points are a strip of index cards over the example console. Every word and link is Hanzo's; series
   values are drawn, not measured.
   Beyond: Label check. Tick the labels you want (per-model, per-route, per-tenant) and see what each costs in a
   time-series database (series multiply) against here (one more column each), Hanzo's own cardinality point made
   concrete before you pick a store. */
import { useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { EASE, Rise } from '../../ui';
import { Hero, Paste, Related, Get, Console, useLive, useFrame } from './Frame';
import './Metrics.css';

const LABELS = { 'per-model': ['zen', 'kai', 'enso'], 'per-route': ['/v1/chat', '/v1/embed', '/v1/search'], 'per-tenant': ['org a', 'org b', 'org c'] };
const N = 60;
const wave = (t, k) => 0.42 + 0.16 * Math.sin(t * 0.9 + k * 2.1) + 0.08 * Math.sin(t * 2.3 + k) + (k === 0 ? Math.max(0, Math.sin(t * 0.35)) ** 18 * 0.42 : 0);

const pathAt = (t, k) => Array.from({ length: N }, (_, i) => (i ? 'L' : 'M') + (i * (100 / (N - 1))).toFixed(2) + ' ' + (100 - wave(t + i * 0.12, k) * 100).toFixed(2)).join('');

function Chart() {
  const [ref, live] = useLive(0.3);
  const [label, setLabel] = useState('per-model');
  const [spike, setSpike] = useState(false);
  const paths = useRef([]);
  const dot = useRef(null);
  const t0 = useRef(0);
  useFrame(live, (t) => {
    t0.current = t;
    let peak = 0;
    for (let k = 0; k < 3; k++) {
      if (k === 0) peak = wave(t + (N - 8) * 0.12, 0);
      paths.current[k]?.setAttribute('d', pathAt(t, k));
    }
    if (dot.current) dot.current.setAttribute('cy', (100 - peak * 100).toFixed(2));
    const s = peak > 0.75;
    setSpike((p) => (p === s ? p : s));
  });
  const series = LABELS[label];
  return (
    <div className="mt-chart" ref={ref}>
      <div className="mt-top">
        <code className="mt-q">rate(http_requests_total[5m])</code>
        <div className="mt-labels" role="group" aria-label="Split by label">
          {Object.keys(LABELS).map((l) => <button key={l} type="button" aria-pressed={label === l} onClick={() => setLabel(l)}>{l}</button>)}
        </div>
      </div>
      <div className="mt-plot" aria-hidden="true">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none">
          {[20, 40, 60, 80].map((y) => <line key={y} x1="0" x2="100" y1={y} y2={y} className="grid" />)}
          {[0, 1, 2].map((k) => <path key={k} ref={(el) => (paths.current[k] = el)} className={'s' + k} d={pathAt(1.2, k)} />)}
          <line x1={(N - 8) * (100 / (N - 1))} x2={(N - 8) * (100 / (N - 1))} y1="0" y2="100" className={'cur' + (spike ? ' on' : '')} />
          <circle ref={dot} cx={(N - 8) * (100 / (N - 1))} cy="50" r="1.4" className={'dot' + (spike ? ' on' : '')} />
        </svg>
        <ul className="mt-legend">{series.map((s, k) => <li key={s} className={'s' + k}><i />{s}</li>)}</ul>
      </div>
      <div className="mt-traces" aria-hidden="true">
        <AnimatePresence mode="wait" initial={false}>
          {spike ? (
            <motion.div key="t" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: EASE }}>
              <p className="mt-k">traces for that window · {series[0]}</p>
              <div className="mt-rows">{[88, 64, 52].map((w, i) => <span key={i}><b style={{ width: w + '%' }} /></span>)}</div>
            </motion.div>
          ) : (
            <motion.p key="w" className="mt-k idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>a spike is the start of a question</motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const POINTS = [
  ['One store, not four', 'Metrics go where the logs and traces already are — Hanzo Datastore, a column store. Nothing to run beside it and nothing to keep in sync with it.'],
  ['PromQL, or the builder', 'Bring the PromQL you already wrote, or assemble the query in the UI without learning it. Both compile to the same thing.'],
  ['Labels you would not dare add', 'Per-model, per-route, per-tenant. A column store counts distinct values for a living, so a label that would multiply series in a time-series database is just another column here.'],
  ['The number leads somewhere', 'A spike on a chart is the start of a question, not the end. Click it and you are in the traces for that window, because they were never in a different system.'],
  ['Alerts are saved queries', 'You write the query, look at it, then keep it as a rule. What pages you is something you have already seen return the answer you expected.'],
  ['Scoped to your org', 'Every query carries the org from your token, so one deployment serves many tenants and no panel can read across them.'],
];
const LABELS = ['per-model', 'per-route', 'per-tenant'];

function LabelCheck() {
  const [on, setOn] = useState([true, false, false]);
  const picked = LABELS.filter((_, i) => on[i]);
  const f = picked.length ? picked.map((l) => l.slice(4) + 's').join(' × ') : 'one';
  return (
    <div className="mt-lab">
      <p className="mt-k">Label check</p>
      <div className="mt-lab-c" role="group" aria-label="Labels to add">
        {LABELS.map((l, i) => <button key={l} type="button" aria-pressed={on[i]} onClick={() => setOn(on.map((v, j) => (j === i ? !v : v)))}>{l}</button>)}
      </div>
      <dl className="mt-lab-r" aria-live="polite">
        <div><dt>In a time-series database</dt><dd>series = {f}</dd></div>
        <div><dt>Here</dt><dd>{picked.length} more column{picked.length === 1 ? '' : 's'}</dd></div>
      </dl>
    </div>
  );
}

/* the console leans back as it arrives and stands up as you scroll to it */
function Lean({ children }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] });
  const rx = useTransform(scrollYProgress, [0, 1], [14, 0]);
  const sc = useTransform(scrollYProgress, [0, 1], [0.94, 1]);
  return <motion.div ref={ref} className="mt-lean" style={{ rotateX: rx, scale: sc, transformPerspective: 1400 }}>{children}</motion.div>;
}

const SIDE = [['Metrics', '/metrics'], ['Logs', '/cloud/logs'], ['Dashboards', '/dashboards'], ['O11y', '/o11y'], ['AI Metrics', '/cloud/ai-metrics'], ['Billing', '/billing'], ['Plans & Pricing', '/cloud/plans'], ['Sessions', '/cloud/sessions']];

export default function Metrics() {
  return (
    <main className="mt">
      <Hero look="stack" kick="metrics.hanzo.ai" title="Hanzo Metrics" sub="The metrics half of Hanzo O11y" acts={[['View on GitHub', 'https://github.com/hanzoai/metrics']]}>
        <Chart />
      </Hero>
      <section className="x-sec mt-what" data-thumb="View on GitHub" data-href="https://github.com/hanzoai/metrics">
        <div className="x-wrap">
          <div className="mt-what-h"><h2>What a metric is here</h2><div><p>A row in a column store rather than a series in a store of its own.</p><LabelCheck /></div></div>
          <ol className="mt-cards">{POINTS.map(([t, d], i) => <Rise as="li" key={t} delay={(i % 3) * 0.06} y={20}><span>{String(i + 1).padStart(2, '0')}</span><h3>{t}</h3><p>{d}</p></Rise>)}</ol>
        </div>
      </section>
      <section className="x-sec mt-send" data-room="dark">
        <div className="x-wrap mt-send-grid">
          <div>
            <h2>Send a metric, then follow it</h2>
            <Paste dark name="Metrics" api="/v1/event/insights" prompt="Read https://hanzo.ai/skill.md and use Hanzo Metrics in my project. Start with: hanzo metrics query" className="mt-paste" />
          </div>
          <div>
            <Lean><Console name="Metrics" api="/v1/event/insights" cap="The service the session above is changing." side={SIDE} /></Lean>
            <p className="mt-note">Example project. Every name in it is one you would give your own.</p>
          </div>
        </div>
      </section>
      <section className="mt-rel"><div className="x-wrap"><Related items={[['Logs', '/cloud/logs', 'Search every line']]} /></div></section>
      <Get name="Metrics" tag="Time-series metrics" repo={['hanzoai/metrics', 'https://github.com/hanzoai/metrics']} stars="4 stars" />
    </main>
  );
}
