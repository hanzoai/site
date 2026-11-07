'use client';
/* Metrics, v2 launch page (Cloud 3).
   V2: 8/10 MASTER: title, lede and ask on the 8/5 split with the query toolbar; the live chart and its traces side by side on one flat tile (nothing floats over anything); a crosshair reads the line under the pointer; six points as one pinned table opened by the section's own statement; one black room; Logs card opens; "Get Metrics" grows as you reach it; deck greys.
   Signature: the spike that opens. Three series stream across the chart, split by the label you pick; every ten
   seconds a spike rises, the cursor lands on it and the traces for that window open beside it, because they were never
   in a different system. Click the chart to hold a moment and keep its traces open.
   Beyond: Label check. Tick per-model, per-route, per-tenant in chapter three: the table grows a column for each while
   a time-series database would multiply series, Hanzo's own cardinality point made concrete before you pick a store.
   Persona: Developer. Goal: try Hanzo Metrics (read the source, then deploy).
   CTA: "View on GitHub" → https://github.com/hanzoai/metrics (data-cta metrics.hero, metrics.close; the site's thumb
   bar and sticky ask bar carry the same from data-thumb). Metric: api_key_created.
   Motion: idle = the streaming chart and the building console; pointer = the crosshair that reads the line under it,
   the magnetic ask; state = split tabs, the label check, PromQL ↔ builder, the held spike; arrival = the cut-in title,
   the timed wipe into the dark room; scroll = the pinned table only.
   Every word and link is Hanzo's; chart and table values are drawn, not measured. */
import { useEffect, useRef, useState } from 'react';
import { useFrame, useLive, Paste } from './Frame';
import PinnedChapters from '../../v2/PinnedChapters';
import ClipWipe from '../../v2/ClipWipe';
import LaunchClose, { Arr } from '../../v2/LaunchClose';
import LineMask from '../../v2/LineMask';
import LaunchConsole from '../../v2/LaunchConsole';
import LivePause, { usePause } from '../../v2/LivePause';
import RelatedCards from '../../v2/RelatedCards';
import { A } from '../../kit';
import './Metrics.css';

const GH = 'https://github.com/hanzoai/metrics';

/* ---------- the hero object: the live chart, full-bleed ---------- */
const SPLIT = { 'per-model': ['zen', 'kai', 'enso'], 'per-route': ['/v1/chat', '/v1/embed', '/v1/search'], 'per-tenant': ['org a', 'org b', 'org c'] };
const N = 96, CUR = Math.round(N * 0.62), STEP = 0.075, SPEED = 0.42;
const wave = (t, k) => 0.36 + 0.11 * Math.sin(t * 0.8 + k * 2.1) + 0.05 * Math.sin(t * 2.1 + k) - k * 0.08 + (k === 0 ? Math.max(0, Math.sin(t * 1.6)) ** 14 * 0.52 : 0);
const Y = (w) => 96 - w * 58; // field y in %: the spike peaks near 38%, well under the title
const pts = (t, k) => Array.from({ length: N }, (_, i) => [(i * 100) / (N - 1), Y(wave(t + i * STEP, k))]);
const line = (p) => p.map(([x, y], i) => (i ? 'L' : 'M') + x.toFixed(2) + ' ' + y.toFixed(2)).join('');
const area = (p) => line(p) + 'L100 100L0 100Z';
const SPANS = [['gateway', 0, 92], ['chat.completion', 6, 78], ['datastore.query', 14, 18], ['model.generate', 34, 48]];
const T0 = (Math.PI / 2 + 2 * Math.PI) / 1.6 - CUR * STEP; // the first frame has the spike under the cursor, so the server HTML shows it
const CX = (CUR * 100) / (N - 1);

function Field({ lead }) {
  const [ref, live, calm] = useLive(0.15);
  const [paused, pause] = usePause();
  const [split, setSplit] = useState('per-model');
  const [spike, setSpike] = useState(true);
  const [held, setHeld] = useState(false);
  const el = useRef({ p: [], a: null, x: null, dot: null, t: T0 });
  useFrame(live && !held && !paused, (_, dt) => {
    const r = el.current;
    r.t += dt * SPEED;
    for (let k = 0; k < 3; k++) {
      const p = pts(r.t, k);
      r.p[k]?.setAttribute('d', line(p));
      if (k === 0) r.a?.setAttribute('d', area(p));
    }
    const s = wave(r.t + CUR * STEP, 0) > 0.6;
    setSpike((v) => (v === s ? v : s));
  });
  // the crosshair reads the line under a fine pointer: transforms only, no React state per move
  const move = (e) => {
    if (e.pointerType !== 'mouse' || calm) return;
    const r = el.current, box = e.currentTarget.getBoundingClientRect();
    const fx = Math.min(1, Math.max(0, (e.clientX - box.left) / box.width));
    const y = Y(wave(r.t + fx * (N - 1) * STEP, 0)) / 100 * (box.height - 24); // the svg sits 24px down
    r.x?.style.setProperty('transform', `translate3d(${e.clientX - box.left}px,0,0)`);
    r.dot?.style.setProperty('transform', `translate3d(0,${y}px,0)`);
    r.x?.setAttribute('data-on', '');
  };
  const out = () => el.current.x?.removeAttribute('data-on');
  const open = calm || held || spike;
  const series = SPLIT[split];
  const p0 = pts(T0, 0);
  return (
    <div className="mt-live" ref={ref}>
      <div className="lx-wrap mt-top">
        {lead}
        <div className="mt-tool">
          <span className="mt-host">metrics.hanzo.ai</span>
          <code className="mt-q">rate(http_requests_total[5m])</code>
          <div className="mt-split" role="group" aria-label="Split by label">
            {Object.keys(SPLIT).map((l) => <button key={l} type="button" aria-pressed={split === l} onClick={() => setSplit(l)}>{l}</button>)}
          </div>
          <ul className="mt-legend" aria-label="Series">{series.map((s, k) => <li key={s} className={'s' + k}><i />{s}</li>)}</ul>
          <LivePause paused={paused} onToggle={pause} inline className="mt-pause" />
        </div>
      </div>
      <div className="lx-wrap mt-stage">
      <button type="button" className="mt-field" aria-label={held ? 'Let the chart run again' : 'Hold this moment and open its traces'} aria-pressed={held} onClick={() => setHeld((h) => !h)} onPointerMove={move} onPointerLeave={out} data-cursor="">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <defs><linearGradient id="mt-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0a0a0a" stopOpacity=".1" /><stop offset="1" stopColor="#0a0a0a" stopOpacity="0" /></linearGradient></defs>
          {[40, 60, 80].map((y) => <line key={y} x1="0" x2="100" y1={y} y2={y} className="grid" />)}
          <path ref={(e) => (el.current.a = e)} className="fill" d={area(p0)} />
          {[2, 1, 0].map((k) => <path key={k} ref={(e) => (el.current.p[k] = e)} className={'s' + k} d={line(pts(T0, k))} />)}
          <line x1={CX} x2={CX} y1="18" y2="100" className={'cur' + (open ? ' on' : '')} />
        </svg>
        <span className={'mt-flag' + (open ? ' on' : '')} style={{ left: CX + '%' }} aria-hidden="true">
          <svg viewBox="0 0 16 16" width="14" height="14"><path d="M3 2l9 6-4 1-2 4z" fill="currentColor" /></svg>spike · {series[0]}
        </span>
        <span className="mt-x" ref={(e) => (el.current.x = e)} aria-hidden="true"><i ref={(e) => (el.current.dot = e)} /></span>
      </button>
      <div className={'mt-traces' + (open ? ' on' : '')}>
        <p className="mt-tk" aria-live="polite">{open ? <>traces for that window · <b>{series[0]}</b></> : 'a spike is the start of a question'}</p>
        <ol className="mt-fall">
          {SPANS.map(([n, x, w], i) => (
            <li key={n} style={{ '--i': i }}><span className="mt-sn">{n}</span><span className="mt-sb" aria-hidden="true"><b style={{ left: x + '%', width: w + '%' }} /></span></li>
          ))}
        </ol>
      </div>
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
  useEffect(() => {
    if (!live || step !== 1) return;
    const t = setTimeout(() => setAlt((a) => !a), 2200);
    return () => clearTimeout(t);
  }, [live, step, alt]);
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
      <section className="mt-hero" data-morph-target data-ask-name="Hanzo Metrics">
        <Field lead={(
          <div className="mt-lead">
            <LineMask as="h1" className="lx-display mt-h1" lines={['Hanzo Metrics']} />
            <p className="lx-lede mt-sub">The metrics half of Hanzo O11y</p>
            <A to={GH} className="lx-cta" data-thumb="View on GitHub" data-cta="metrics.hero">View on GitHub<Arr /></A>
          </div>
        )} />
      </section>

      <PinnedChapters label="What a metric is here" per={78}
        intro={{ title: ['What a metric', 'is here'], lede: 'A row in a column store rather than a series in a store of its own.' }}
        steps={steps}
        visual={(at) => <Table step={at} on={on} lab={<LabelCheck on={on} setOn={setOn} where="in-table" />} />} />

      <ClipWipe dark className="mt-send">
        <div className="lx-wrap mt-send-grid">
          <div className="mt-send-l">
            <h2 className="lx-headline">Send a metric, then follow it</h2>
            <Paste dark name="Metrics" api="/v1/event/insights" prompt="Read https://hanzo.ai/skill.md and use Hanzo Metrics in my project. Start with: hanzo metrics query" className="lx-paste" />
          </div>
          <div className="mt-send-r">
            <LaunchConsole name="Metrics" api="/v1/event/insights" cap="The service the session above is changing." side={SIDE} />
            <p className="mt-note">Example project. Every name in it is one you would give your own.</p>
          </div>
        </div>
      </ClipWipe>

      <RelatedCards items={[['Logs', '/cloud/logs', 'Search every line']]} />

      <LaunchClose name="Metrics" tag="Time-series metrics" seed="metrics" data={[4, 6]} ask={['View on GitHub', GH]} cta="metrics.close" repo={['hanzoai/metrics', GH]} stars="4 stars" />
    </main>
  );
}
