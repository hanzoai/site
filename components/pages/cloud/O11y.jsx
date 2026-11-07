'use client';
/* O11y, v2 launch page (Cloud 3).
   V2: 8/10 Dark Stage hero where one request draws itself and its slow span opens into its own logs; six parts as one pinned suite whose tab changes per chapter; OTLP ports as a spec with "what you keep"; two related cards that open.
   Signature: the pivot. One request draws itself across services as a waterfall in the dark room; the slow span lifts
   and opens into the log lines written with its id and the exception row that rolled up beside it, then the next span
   takes its turn (any span opens on a click).
   Beyond: What you keep. Pick what you run today (PromQL, an OTel SDK or collector, PagerDuty or Opsgenie, Slack, Teams,
   email or a webhook) and read Hanzo's own line that says it carries over, before moving anything.
   Motion: signature = the pivoting waterfall; supporting = Stage settle and pinned chapters (scroll), the clip wipe
   into the OTLP room, the line-masked title. Every word and link is Hanzo's; span names and log lines are examples. */
import { useState } from 'react';
import { Paste, Console, useLive, useSteps } from './Frame';
import SettleStage from '../../v2/SettleStage';
import PinnedChapters from '../../v2/PinnedChapters';
import ClipWipe from '../../v2/ClipWipe';
import SpecDrawer from '../../v2/SpecDrawer';
import LaunchClose from '../../v2/LaunchClose';
import LineMask from '../../v2/LineMask';
import { A } from '../../kit';
import './O11y.css';

/* ---------- the hero object: one request, pivoting ---------- */
// [service, operation, start %, width %]
const SPANS = [['gateway', 'GET /v1/checkout', 0, 100], ['api', 'checkout', 3, 92], ['auth', 'verify token', 5, 9], ['queue', 'enqueue receipt', 18, 7], ['db', 'SELECT cart', 27, 46], ['payments', 'charge', 76, 16]];
const LOGS = {
  4: ['db · query plan: seq scan', 'db · rows read', 'api · waited on db'],
  5: ['payments · charge created', 'payments · webhook queued'],
  1: ['api · request received', 'api · cart loaded', 'api · response sent'],
};
const PICKS = [4, 5, 1];

function Pivot() {
  const [ref, live, calm] = useLive(0.3);
  const [k, choose] = useSteps(PICKS.length, 3800, live);
  const sel = PICKS[k];
  const [svc, op] = SPANS[sel];
  return (
    <div className={'ob-pv' + (calm ? ' calm' : '')} ref={ref}>
      <div className="ob-pv-fall">
        <div className="ob-pv-head"><span className="ob-k">trace</span><b>GET /v1/checkout</b><em>slow tail first</em></div>
        <ul className="ob-pv-spans">
          {SPANS.map(([s, o, x, w], i) => {
            const can = PICKS.includes(i);
            return (
              <li key={o} style={{ '--i': i }}>
                <button type="button" data-cursor={can ? 'Pivot' : ''} disabled={!can} className={(sel === i ? 'on' : '') + (i === 4 ? ' slow' : '')} onClick={() => choose(PICKS.indexOf(i))} aria-pressed={sel === i} aria-label={`${s} ${o}${can ? ', open its logs' : ''}`}>
                  <span className="ob-pv-name"><b>{s}</b>{o}</span>
                  <span className="ob-pv-track"><i style={{ left: x + '%', width: w + '%' }} /></span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <aside className="ob-pv-open" aria-live="polite">
        <div className="ob-pv-card" key={sel}>
          <p className="ob-k">logs · same span id</p>
          <p className="ob-pv-span"><i />{svc} · {op}</p>
          <ul>{(LOGS[sel] || []).map((l) => <li key={l}>{l}</li>)}</ul>
        </div>
        <div className="ob-pv-exc">
          <p className="ob-k">exceptions</p>
          <div><b>TimeoutError</b><span className="lx-num">× 1,000</span></div>
          <em>one row, links to its trace</em>
        </div>
      </aside>
    </div>
  );
}

/* ---------- the chapters' object: the suite, one tab per part ---------- */
const TABS = ['Traces', 'Metrics', 'Logs', 'Exceptions', 'Alerts', 'OTLP'];
const ROUTES = ['PagerDuty', 'Opsgenie', 'Slack', 'Teams', 'email', 'webhook'];

function Suite({ step }) {
  return (
    <div className="ob-suite" data-step={step}>
      <div className="ob-suite-bar">
        <span className="ob-suite-host">o11y.hanzo.ai</span>
        <span className="ob-tab-now" aria-hidden="true"><i />{TABS[step]}</span>
        <div className="ob-tabs" aria-hidden="true">
          {TABS.map((t, i) => <span key={t} className={i === step ? 'on' : ''}>{t}</span>)}
          <i className="ob-tab-ink" style={{ transform: `translateX(${step * 100}%)` }} />
        </div>
      </div>
      <div className="ob-panes">
        <div className="ob-pane" data-on={step === 0 || undefined}>
          {[['GET /v1/checkout', 0.94, 1], ['POST /v1/chat', 0.62], ['GET /v1/cart', 0.41], ['POST /v1/embed', 0.33], ['GET /v1/search', 0.22]].map(([n, w, hot]) => (
            <div key={n} className={'ob-tr' + (hot ? ' hot' : '')}><span>{n}</span><b style={{ transform: `scaleX(${w})` }} /></div>
          ))}
        </div>
        <div className="ob-pane" data-on={step === 1 || undefined}>
          <code className="ob-q">rate(http_requests_total[5m])</code>
          <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="ob-chart" aria-hidden="true">
            <path d="M0 30 C10 26 16 28 24 22 S38 12 48 18 62 30 72 20 88 8 100 12" />
            <path className="b" d="M0 34 C12 33 20 31 30 32 S50 28 60 30 80 26 100 28" />
          </svg>
          <p className="ob-same">same store as the traces</p>
        </div>
        <div className="ob-pane" data-on={step === 2 || undefined}>
          <div className="ob-filter"><span>span_id</span><b>= 4f2a…</b></div>
          {[['info', 'api', 'request received', 1], ['info', 'db', 'query plan: seq scan', 1], ['warn', 'api', 'waited on db', 1], ['info', 'auth', 'token verified'], ['info', 'payments', 'charge created']].map(([lv, s, m, hot], i) => (
            <div key={i} className={'ob-log' + (hot ? ' hot' : '')}><span className={'lv ' + lv}>{lv}</span><span>{s}</span><span>{m}</span></div>
          ))}
        </div>
        <div className="ob-pane" data-on={step === 3 || undefined}>
          <div className="ob-ex"><div><b>TimeoutError</b><em>db · SELECT cart</em></div><span className="lx-num">1,000</span></div>
          <p className="ob-same">opens the trace that raised it →</p>
        </div>
        <div className="ob-pane" data-on={step === 4 || undefined}>
          <div className="ob-rule"><span className="ob-k">alert rule · saved query</span><code>rate(http_requests_total[5m])</code></div>
          <ul className="ob-routes">{ROUTES.map((r, i) => <li key={r} style={{ '--i': i }}>{r}</li>)}</ul>
        </div>
        <div className="ob-pane" data-on={step === 5 || undefined}>
          <div className="ob-ports">
            <div><span className="lx-num">4317</span><em>OTLP · gRPC</em></div>
            <div><span className="lx-num">4318</span><em>OTLP · HTTP</em></div>
          </div>
          <p className="ob-same">one endpoint variable · no agent to install</p>
        </div>
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
// [what you run now, the part that keeps it]
const KEEP = [['PromQL', 1], ['An OTel SDK or collector', 5], ['PagerDuty or Opsgenie', 4], ['Slack, Teams, email or a webhook', 4]];

function Keep() {
  const [k, setK] = useState(0);
  const [t, d] = PARTS[KEEP[k][1]];
  return (
    <div className="ob-keep">
      <p className="lx-kick">What you keep</p>
      <div className="ob-keep-c" role="group" aria-label="What you run today">
        {KEEP.map(([w], i) => <button key={w} type="button" aria-pressed={k === i} onClick={() => setK(i)}>{w}</button>)}
      </div>
      <p className="ob-keep-a" aria-live="polite" key={k}><b>{t}</b> {d}</p>
    </div>
  );
}

const SIDE = [['O11y', '/o11y'], ['Logs', '/cloud/logs'], ['Metrics', '/metrics'], ['Dashboards', '/dashboards'], ['AI Metrics', '/cloud/ai-metrics'], ['Billing', '/billing'], ['Plans & Pricing', '/cloud/plans'], ['Sessions', '/cloud/sessions']];
const Arr = () => <svg viewBox="0 0 16 16" width="22" height="22" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;

export default function O11y() {
  return (
    <main className="lx ob">
      <section className="lx-dark ob-hero" data-room="dark" data-morph-target>
        <div className="lx-wrap ob-hero-in">
          <p className="lx-kick"><b>●</b> o11y.hanzo.ai</p>
          <LineMask as="h1" className="lx-display ob-h1" lines={['Hanzo O11y']} />
          <p className="lx-lede ob-sub">Traces, metrics and logs, in one place</p>
          <A to="https://github.com/hanzoai/o11y" className="lx-cta" data-thumb="View on GitHub">View on GitHub</A>
        </div>
        <div className="lx-wrap"><SettleStage from={1.08} className="ob-stage"><Pivot /></SettleStage></div>
      </section>

      <section className="lx-sec ob-one">
        <div className="lx-wrap ob-one-grid">
          <LineMask as="h2" className="lx-display m ob-one-h" lines={['One store,', 'one query language']} inView />
          <p className="lx-lede ob-one-l">Every panel scopes to your org from the token, so a shared deployment still answers one tenant at a time.</p>
        </div>
      </section>

      <PinnedChapters label="The six parts of O11y" flip per={76} steps={PARTS.map(([t, d], i) => ({ t, d, k: String(i + 1).padStart(2, '0') }))} visual={(at) => <Suite step={at} />} />

      <ClipWipe className="ob-otlp">
        <div className="lx-wrap ob-otlp-grid">
          <div className="ob-otlp-l">
            <h2 className="lx-headline">Point an OTLP endpoint at it</h2>
            <SpecDrawer className="ob-spec" rows={[{ v: '4317', l: 'gRPC' }, { v: '4318', l: 'HTTP' }]} />
            <Keep />
          </div>
          <div className="ob-otlp-r">
            <Console light name="O11y" api="/v1/o11y" side={SIDE} />
            <p className="ob-note">Example project. Every name in it is one you would give your own.</p>
          </div>
        </div>
      </ClipWipe>

      <section className="lx-sec ob-paste">
        <div className="lx-wrap"><Paste name="O11y" api="/v1/o11y" prompt="Read https://hanzo.ai/skill.md and use Hanzo O11y in my project. Start with: hanzo o11y logs get" /></div>
      </section>

      <section className="ob-rel">
        <div className="lx-wrap">
          <p className="lx-kick">Related capabilities</p>
          <div className="ob-rel-grid">
            <A to="/cloud/logs" className="ob-rel-card"><span className="ob-rel-t" data-morph>Logs</span><span className="ob-rel-d">Search every line</span><Arr /></A>
            <A to="/metrics" className="ob-rel-card"><span className="ob-rel-t" data-morph>Metrics</span><span className="ob-rel-d">Time series & SLOs</span><Arr /></A>
          </div>
        </div>
      </section>

      <LaunchClose name="O11y" tag="Observability suite" seed="o11y" data={[4317, 4318, 4]} repo={['hanzoai/o11y', 'https://github.com/hanzoai/o11y']} stars="4 stars" />
    </main>
  );
}
