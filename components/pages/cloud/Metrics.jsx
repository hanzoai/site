'use client';
/* Metrics, v2 launch page (Cloud 3).
   V2: 8/10 Chaptered launch: a live query console settles from full-bleed, a spike opens its own traces, six points become one pinned table that changes per chapter, one dark room.
   Signature: the spike that opens. A live chart streams three series split by the label you pick; when a spike rises the
   cursor lands on it and the traces for that window open beneath, because they were never in a different system.
   Beyond: Label check. Tick per-model, per-route, per-tenant in chapter three: the table grows a column for each while
   a time-series database would multiply series, Hanzo's own cardinality point made concrete before you pick a store.
   Motion: signature = the live chart; supporting = Stage settle and pinned chapters (scroll), the clip wipe into the
   dark room, the line-masked title. Every word and link is Hanzo's; chart and table values are drawn, not measured. */
import { useRef, useState } from 'react';
import { useFrame, useLive, useEvery, Paste, Console } from './Frame';
import SettleStage from '../../v2/SettleStage';
import PinnedChapters from '../../v2/PinnedChapters';
import ClipWipe from '../../v2/ClipWipe';
import LaunchClose from '../../v2/LaunchClose';
import LineMask from '../../v2/LineMask';
import { A } from '../../kit';
import './Metrics.css';

/* ---------- the hero object: a live query console ---------- */
const SPLIT = { 'per-model': ['zen', 'kai', 'enso'], 'per-route': ['/v1/chat', '/v1/embed', '/v1/search'], 'per-tenant': ['org a', 'org b', 'org c'] };
const N = 72, CUR = N - 12, STEP = 0.11;
const wave = (t, k) => 0.36 + 0.12 * Math.sin(t * 0.9 + k * 2.1) + 0.05 * Math.sin(t * 2.3 + k) - k * 0.07 + (k === 0 ? Math.max(0, Math.sin(t * 0.45)) ** 24 * 0.5 : 0);
const pts = (t, k) => Array.from({ length: N }, (_, i) => [(i * 100) / (N - 1), 100 - wave(t + i * STEP, k) * 100]);
const line = (p) => p.map(([x, y], i) => (i ? 'L' : 'M') + x.toFixed(2) + ' ' + y.toFixed(2)).join('');
const area = (p) => line(p) + 'L100 100L0 100Z';
const SPANS = [['gateway', 0, 92], ['chat.completion', 6, 78], ['datastore.query', 14, 18], ['model.generate', 34, 48]];
const T0 = 4.1, CX = (CUR * 100) / (N - 1);

function Scope() {
  const [ref, live, calm] = useLive(0.25);
  const [split, setSplit] = useState('per-model');
  const [spike, setSpike] = useState(false);
  const [held, setHeld] = useState(false);
  const el = useRef({ p: [], a: null });
  useFrame(live && !held, (t) => {
    const r = el.current;
    for (let k = 0; k < 3; k++) {
      const p = pts(t, k);
      r.p[k]?.setAttribute('d', line(p));
      if (k === 0) r.a?.setAttribute('d', area(p));
    }
    const s = wave(t + CUR * STEP, 0) > 0.62;
    setSpike((v) => (v === s ? v : s));
  });
  const open = calm || held || spike;
  const series = SPLIT[split];
  const p0 = pts(T0, 0);
  return (
    <div className="mt-scope" ref={ref}>
      <div className="mt-bar">
        <span className="mt-dots" aria-hidden="true"><i /><i /><i /></span>
        <span className="mt-host">metrics.hanzo.ai</span>
        <div className="mt-split" role="group" aria-label="Split by label">
          {Object.keys(SPLIT).map((l) => <button key={l} type="button" aria-pressed={split === l} onClick={() => setSplit(l)}>{l}</button>)}
        </div>
      </div>
      <div className="mt-q"><code>rate(http_requests_total[5m])</code><ul className="mt-legend">{series.map((s, k) => <li key={s} className={'s' + k}><i />{s}</li>)}</ul></div>
      <button type="button" className="mt-plot" aria-label={held ? 'Let the chart run again' : 'Hold the spike and open its traces'} aria-pressed={held} onClick={() => setHeld((h) => !h)} data-cursor={held ? 'Run' : 'Open'}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <defs><linearGradient id="mt-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="var(--acc)" stopOpacity=".2" /><stop offset="1" stopColor="var(--acc)" stopOpacity="0" /></linearGradient></defs>
          {[25, 50, 75].map((y) => <line key={y} x1="0" x2="100" y1={y} y2={y} className="grid" />)}
          <path ref={(e) => (el.current.a = e)} className="fill" d={area(p0)} />
          {[2, 1, 0].map((k) => <path key={k} ref={(e) => (el.current.p[k] = e)} className={'s' + k} d={line(pts(T0, k))} />)}
          <line x1={CX} x2={CX} y1="0" y2="100" className={'cur' + (open ? ' on' : '')} />
        </svg>
        <span className={'mt-flag' + (open ? ' on' : '')} style={{ left: CX + '%' }}>spike · {series[0]}</span>
      </button>
      <div className={'mt-traces' + (open ? ' on' : '')}>
        <p className="mt-tk" aria-live="polite">{open ? <>traces for that window · <b>{series[0]}</b></> : 'a spike is the start of a question'}</p>
        <ol className="mt-fall" aria-hidden={!open}>
          {SPANS.map(([n, x, w], i) => (
            <li key={n} style={{ '--i': i }}><span className="mt-sn">{n}</span><span className="mt-sb"><b style={{ left: x + '%', width: w + '%' }} /></span></li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/* ---------- the chapters' object: a metric as a row ---------- */
const ROWS = [
  ['metric', 'http_requests_total', 0.46, 'zen', '/v1/chat', 'org a'],
  ['trace', 'chat.completion', 0.72, 'zen', '/v1/chat', 'org a'],
  ['log', 'request served', 0.2, 'zen', '/v1/chat', 'org a'],
  ['metric', 'http_requests_total', 0.38, 'kai', '/v1/embed', 'org b'],
  ['trace', 'embed', 0.3, 'kai', '/v1/embed', 'org b'],
  ['metric', 'http_requests_total', 0.52, 'enso', '/v1/search', 'org c'],
  ['log', 'request served', 0.18, 'enso', '/v1/search', 'org c'],
];
const TAGS = ['per-model', 'per-route', 'per-tenant'];
const COL = { 'per-model': 'model', 'per-route': 'route', 'per-tenant': 'tenant' };

function Table({ step, on, lab }) {
  const [ref, live] = useLive(0.3);
  const [alt, setAlt] = useState(false);
  useEvery(2200, live && step === 1, () => setAlt((a) => !a));
  const picked = TAGS.filter((_, i) => on[i]).map((t) => COL[t]);
  const by = picked.length ? `sum by (${picked.join(', ')}) ` : '';
  const mode = step === 1 ? (alt ? 'builder' : 'PromQL') : step === 4 ? 'kept as a rule' : step === 5 ? 'org from your token' : 'one query';
  return (
    <div className="mt-tab" ref={ref} data-step={step}>
      <div className="mt-tab-bar">
        <span className="mt-dots" aria-hidden="true"><i /><i /><i /></span>
        <span className="mt-store">Hanzo Datastore</span>
        <span className={'mt-chip' + (step === 4 ? ' on' : '')}>alert rule</span>
        <span className={'mt-chip' + (step === 5 ? ' on' : '')}>token · org a</span>
      </div>
      <div className="mt-tab-q">
        {step === 1 && alt ? (
          <span className="mt-pills"><i>http_requests_total</i><i>rate</i><i>5m</i></span>
        ) : (
          <code>{step >= 2 && step <= 4 ? by : ''}rate(http_requests_total[5m]){step === 5 ? '{tenant="org a"}' : ''}</code>
        )}
        <span className="mt-mode" key={mode}>{mode}</span>
      </div>
      <div className="mt-grid" role="table" aria-label="Metrics, logs and traces as rows in one column store">
        <div className="mt-row head" role="row">
          {['kind', 'name', 'value', 'model', 'route', 'tenant'].map((c) => <span key={c} role="columnheader" className={'c-' + c + ((picked.includes(c) && step === 2) || (c === 'tenant' && step === 5) ? ' lit' : '')}>{c}</span>)}
        </div>
        {ROWS.map(([kind, name, v, model, route, tenant], i) => {
          const hot = step === 0 || (step === 1 && kind === 'metric') || (step === 3 && i < 3) || (step === 4 && i === 0);
          const gone = step === 5 && tenant !== 'org a';
          return (
            <div key={i} role="row" className={'mt-row' + (hot ? ' hot' : '') + (gone ? ' gone' : '') + (step === 3 && i === 0 ? ' spike' : '')} style={{ '--i': i }}>
              <span role="cell" className="c-kind"><i className={'k-' + kind} />{kind}</span>
              <span role="cell" className="c-name">{name}</span>
              <span role="cell" className="c-value"><b style={{ transform: `scaleX(${step === 3 && i === 0 ? 1 : v})` }} /></span>
              <span role="cell" className={'c-model' + (picked.includes('model') && step === 2 ? ' lit' : '')}>{model}</span>
              <span role="cell" className={'c-route' + (picked.includes('route') && step === 2 ? ' lit' : '')}>{route}</span>
              <span role="cell" className={'c-tenant' + ((picked.includes('tenant') && step === 2) || step === 5 ? ' lit' : '')}>{tenant}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-tab-lab">{lab}</div>
    </div>
  );
}

function LabelCheck({ on, setOn, where = '' }) {
  const picked = TAGS.filter((_, i) => on[i]);
  const f = picked.length ? picked.map((l) => l.slice(4) + 's').join(' × ') : 'one';
  return (
    <div className={'mt-lab ' + where}>
      <div className="mt-lab-c" role="group" aria-label="Labels to add">
        {TAGS.map((l, i) => <button key={l} type="button" aria-pressed={on[i]} onClick={() => setOn(on.map((v, j) => (j === i ? !v : v)))}>{l}</button>)}
      </div>
      <dl className="mt-lab-r" aria-live="polite">
        <div><dt>In a time-series database</dt><dd>series = {f}</dd></div>
        <div><dt>Here</dt><dd>{picked.length} more column{picked.length === 1 ? '' : 's'}</dd></div>
      </dl>
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

const SIDE = [['Metrics', '/metrics'], ['Logs', '/cloud/logs'], ['Dashboards', '/dashboards'], ['O11y', '/o11y'], ['AI Metrics', '/cloud/ai-metrics'], ['Billing', '/billing'], ['Plans & Pricing', '/cloud/plans'], ['Sessions', '/cloud/sessions']];

export default function Metrics() {
  const [on, setOn] = useState([true, false, false]);
  const steps = POINTS.map(([t, d], i) => ({ t, d, extra: i === 2 ? <LabelCheck on={on} setOn={setOn} where="in-copy" /> : null }));
  return (
    <main className="lx mt">
      <section className="mt-hero" data-morph-target>
        <div className="lx-wrap mt-hero-grid">
          <div className="mt-hero-l">
            <p className="lx-kick"><b>●</b> metrics.hanzo.ai</p>
            <LineMask as="h1" className="lx-display mt-h1" lines={['Hanzo', 'Metrics']} />
          </div>
          <div className="mt-hero-r">
            <p className="lx-lede mt-sub">The metrics half of Hanzo O11y</p>
            <A to="https://github.com/hanzoai/metrics" className="lx-cta" data-thumb="View on GitHub">View on GitHub</A>
          </div>
        </div>
        <div className="lx-wrap"><SettleStage from={1.06} className="mt-stage"><Scope /></SettleStage></div>
      </section>

      <section className="lx-sec mt-what">
        <div className="lx-wrap mt-what-grid">
          <LineMask as="h2" className="lx-display m" lines={['What a metric', 'is here']} inView />
          <p className="lx-lede mt-what-l">A row in a column store rather than a series in a store of its own.</p>
        </div>
      </section>

      <PinnedChapters label="What a metric is here" steps={steps} per={78} visual={(at) => <Table step={at} on={on} lab={<LabelCheck on={on} setOn={setOn} where="in-table" />} />} />

      <ClipWipe dark className="mt-send">
        <div className="lx-wrap mt-send-grid">
          <div className="mt-send-l">
            <h2 className="lx-headline">Send a metric, then follow it</h2>
            <Paste dark name="Metrics" api="/v1/event/insights" prompt="Read https://hanzo.ai/skill.md and use Hanzo Metrics in my project. Start with: hanzo metrics query" className="lx-paste" />
          </div>
          <div className="mt-send-r">
            <Console name="Metrics" api="/v1/event/insights" cap="The service the session above is changing." side={SIDE} />
            <p className="mt-note">Example project. Every name in it is one you would give your own.</p>
          </div>
        </div>
      </ClipWipe>

      <section className="mt-rel">
        <div className="lx-wrap">
          <p className="lx-kick">Related capabilities</p>
          <A to="/cloud/logs" className="mt-rel-card">
            <span className="mt-rel-t" data-morph>Logs</span>
            <span className="mt-rel-d">Search every line</span>
            <svg viewBox="0 0 16 16" width="22" height="22" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </A>
        </div>
      </section>

      <LaunchClose name="Metrics" tag="Time-series metrics" seed="metrics" data={[4, 6]} repo={['hanzoai/metrics', 'https://github.com/hanzoai/metrics']} stars="4 stars" />
    </main>
  );
}
