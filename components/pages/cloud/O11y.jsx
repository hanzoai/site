'use client';
/* O11y, v2 launch page (Cloud 3).
   V2: 8/10 The dark room is the first screen and the product is in it: one request's waterfall in its own window under
   the title, pivoting span by span into its logs (hover previews, click holds, a pause stops it); the section's own
   statement opens the pinned suite, where six lines draw into one query; the OTLP room opens on a timed wipe; grey only.
   Signature: the pivot. One request draws itself across services as a waterfall in the dark room; the slow span lifts
   and opens into the log lines written with its id and the exception row that rolled up beside it, then the next span
   takes its turn (any span opens on a click; hovering one previews its logs).
   Beyond: What you keep. Pick what you run today (PromQL, an OTel SDK or collector, PagerDuty or Opsgenie, Slack, Teams,
   email or a webhook) and read Hanzo's own line that says it carries over, before moving anything.
   Persona: Developer. Goal: try Hanzo O11y (read the source, then point an OTLP endpoint at it).
   CTA: "View on GitHub" → https://github.com/hanzoai/o11y (data-cta o11y.hero, o11y.close; the site's sticky ask bar
   carries the same words from data-thumb). Metric: api_key_created.
   Motion: idle = the pivoting waterfall and the building console; pointer = a hovered span previews its logs, the
   magnetic ask; state = the suite's tab, the what-you-keep chips, a held span; arrival = the cut-in title, the timed
   wipe into the OTLP room; scroll = the Stage settle and the pinned suite.
   Every word and link is Hanzo's; span names, log lines and the query are examples. */
import { useState } from 'react';
import { Paste, useLive, useSteps } from './Frame';
import SettleStage from '../../v2/SettleStage';
import PinnedChapters from '../../v2/PinnedChapters';
import ClipWipe from '../../v2/ClipWipe';
import SpecDrawer from '../../v2/SpecDrawer';
import LaunchClose, { Arr } from '../../v2/LaunchClose';
import LineMask from '../../v2/LineMask';
import LaunchConsole from '../../v2/LaunchConsole';
import LivePause, { usePause } from '../../v2/LivePause';
import RelatedCards from '../../v2/RelatedCards';
import { A } from '../../kit';
import './O11y.css';

const GH = 'https://github.com/hanzoai/o11y';

/* ---------- the hero object: one request, pivoting ---------- */
// [service, operation, start %, width %]
const SPANS = [['gateway', 'GET /v1/checkout', 0, 100], ['api', 'checkout', 3, 92], ['auth', 'verify token', 5, 9], ['queue', 'enqueue receipt', 18, 7], ['db', 'SELECT cart', 27, 46], ['payments', 'charge', 76, 16]];
const LOGS = {
  4: ['db · query plan: seq scan', 'db · rows read', 'api · waited on db'],
  5: ['payments · charge created', 'payments · webhook queued'],
  1: ['api · request received', 'api · cart loaded', 'api · response sent'],
};
const PICKS = [4, 5, 1];
const SLOW = 4;

function Pivot() {
  const [ref, live, calm] = useLive(0.3);
  const [paused, pause] = usePause();
  const [hov, setHov] = useState(null); // a span under a fine pointer previews its logs
  const [k, choose] = useSteps(PICKS.length, 3800, live && !paused && hov === null);
  const sel = hov ?? PICKS[k];
  const [svc, op] = SPANS[sel];
  return (
    <div className={'ob-pv' + (calm ? ' calm' : '')} ref={ref}>
      <div className="ob-pv-bar">
        <LivePause paused={paused} onToggle={pause} dark className="ob-pause" />
        <span className="ob-pv-host">o11y.hanzo.ai</span>
        <span className="ob-pv-trace"><span className="ob-k">trace</span><b>GET /v1/checkout</b></span>
        <em className="ob-pv-slow">slow tail first</em>
      </div>
      <ul className="ob-pv-spans" onPointerLeave={() => setHov(null)}>
        {SPANS.map(([s, o, x, w], i) => {
          const row = (
            <>
              <span className="ob-pv-name"><b>{s}</b>{o}</span>
              <span className="ob-pv-track"><i style={{ left: x + '%', width: w + '%' }} /></span>
            </>
          );
          const cls = (sel === i ? 'on' : '') + (i === SLOW ? ' slow' : '');
          return (
            <li key={o} style={{ '--i': i }}>
              {PICKS.includes(i) ? (
                <button type="button" className={'ob-pv-row ' + cls} aria-pressed={sel === i} aria-label={`${s} ${o}, open its logs`}
                  onPointerEnter={(e) => e.pointerType === 'mouse' && setHov(i)}
                  onClick={() => { setHov(null); choose(PICKS.indexOf(i)); }}>{row}</button>
              ) : (
                <div className={'ob-pv-row ' + cls}>{row}</div>
              )}
            </li>
          );
        })}
      </ul>
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

/* ---------- the chapters' object: the suite, one tab per part; the intro draws all six into one query ---------- */
const TABS = ['Traces', 'Metrics', 'Logs', 'Exceptions', 'Alerts', 'OTLP'];
const ROUTES = ['PagerDuty', 'Opsgenie', 'Slack', 'Teams', 'email', 'webhook'];
const Q = 'rate(http_requests_total[5m])';

function Suite({ step, intro }) {
  const on = (i) => (!intro && step === i) || undefined;
  return (
    <div className="ob-suite" data-step={intro ? 'intro' : step}>
      <div className="ob-suite-bar">
        <span className="ob-suite-host">o11y.hanzo.ai</span>
        {!intro && <span className="ob-tab-now" aria-hidden="true" key={step}><i />{TABS[step]}</span>}
        <div className="ob-tabs" aria-hidden="true">
          {TABS.map((t, i) => <span key={t} className={on(i) ? 'on' : ''}>{t}</span>)}
          <i className="ob-tab-ink" style={{ transform: `translateX(${step * 100}%)` }} />
        </div>
      </div>
      <div className="ob-panes">
        <div className="ob-pane ob-one" data-on={intro || undefined} aria-hidden="true">
          <ul className="ob-one-tabs">{TABS.map((t, i) => <li key={t} style={{ '--i': i }}>{t}</li>)}</ul>
          <span className="ob-one-wire">
            <svg viewBox="0 0 100 600" preserveAspectRatio="none" className="ob-one-lines">
              {TABS.map((t, i) => { const y = (i + 0.5) * 100; return <path key={t} pathLength="1" style={{ '--i': i }} d={`M0 ${y} C55 ${y} 45 300 100 300`} />; })}
            </svg>
          </span>
          <code className="ob-one-q">{Q}</code>
        </div>
        <div className="ob-pane" data-on={on(0)}>
          {[['GET /v1/checkout', 0.94, 1], ['POST /v1/chat', 0.62], ['GET /v1/cart', 0.41], ['POST /v1/embed', 0.33], ['GET /v1/search', 0.22]].map(([n, w, hot]) => (
            <div key={n} className={'ob-tr' + (hot ? ' hot' : '')}><span>{n}</span><b style={{ transform: `scaleX(${w})` }} /></div>
          ))}
        </div>
        <div className="ob-pane" data-on={on(1)}>
          <code className="ob-q">{Q}</code>
          <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="ob-chart" aria-hidden="true">
            <path d="M0 30 C10 26 16 28 24 22 S38 12 48 18 62 30 72 20 88 8 100 12" />
            <path className="b" d="M0 34 C12 33 20 31 30 32 S50 28 60 30 80 26 100 28" />
          </svg>
          <p className="ob-same">same store as the traces</p>
        </div>
        <div className="ob-pane" data-on={on(2)}>
          <div className="ob-filter"><span>span_id</span><b>= 4f2a…</b></div>
          {[['info', 'api', 'request received', 1], ['info', 'db', 'query plan: seq scan', 1], ['warn', 'api', 'waited on db', 1], ['info', 'auth', 'token verified'], ['info', 'payments', 'charge created']].map(([lv, s, m, hot], i) => (
            <div key={i} className={'ob-log' + (hot ? ' hot' : '')}><span className={'lv ' + lv}>{lv}</span><span>{s}</span><span>{m}</span></div>
          ))}
        </div>
        <div className="ob-pane" data-on={on(3)}>
          <div className="ob-ex"><div><b>TimeoutError</b><em>db · SELECT cart</em></div><span className="lx-num">1,000</span></div>
          <p className="ob-same">opens the trace that raised it →</p>
        </div>
        <div className="ob-pane" data-on={on(4)}>
          <div className="ob-rule"><span className="ob-k">alert rule · saved query</span><code>{Q}</code></div>
          <ul className="ob-routes">{ROUTES.map((r, i) => <li key={r} style={{ '--i': i }}>{r}</li>)}</ul>
        </div>
        <div className="ob-pane" data-on={on(5)}>
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

export default function O11y() {
  return (
    <main className="lx ob" data-ask-name="Hanzo O11y">
      <section className="lx-dark ob-hero" data-room="dark" data-morph-target>
        <div className="lx-wrap ob-hero-in">
          <LineMask as="h1" className="lx-display ob-h1" lines={['Hanzo O11y']} />
          <p className="lx-lede ob-sub">Traces, metrics and logs, in one place</p>
          <A to={GH} className="lx-cta" data-thumb="View on GitHub" data-cta="o11y.hero">View on GitHub<Arr /></A>
        </div>
        <div className="lx-wrap"><SettleStage from={1.03} lift={16} className="ob-stage"><Pivot /></SettleStage></div>
      </section>

      <PinnedChapters
        label="The six parts of O11y"
        flip
        per={72}
        intro={{ title: ['One store,', 'one query language'], lede: 'Every panel scopes to your org from the token, so a shared deployment still answers one tenant at a time.' }}
        steps={PARTS.map(([t, d], i) => ({ t, d, k: String(i + 1).padStart(2, '0') }))}
        visual={(at, intro) => <Suite step={at} intro={intro} />}
      />

      <ClipWipe className="ob-otlp">
        <div className="lx-wrap ob-otlp-grid">
          <div className="ob-otlp-l">
            <h2 className="lx-headline">Point an OTLP endpoint at it</h2>
            <SpecDrawer className="ob-spec" rows={[{ v: '4317', l: 'gRPC' }, { v: '4318', l: 'HTTP' }]} />
            <Keep />
          </div>
          <div className="ob-otlp-r">
            <LaunchConsole light name="O11y" api="/v1/o11y" side={SIDE} />
            <p className="ob-note">Example project. Every name in it is one you would give your own.</p>
          </div>
        </div>
      </ClipWipe>

      <section className="lx-sec ob-paste">
        <div className="lx-wrap"><Paste name="O11y" api="/v1/o11y" prompt="Read https://hanzo.ai/skill.md and use Hanzo O11y in my project. Start with: hanzo o11y logs get" /></div>
      </section>

      <RelatedCards items={[['Logs', '/cloud/logs', 'Search every line'], ['Metrics', '/metrics', 'Time series & SLOs']]} />

      <LaunchClose name="O11y" tag="Observability suite" seed="o11y" data={[4317, 4318, 4]} ask={['View on GitHub', GH]} cta="o11y.close" repo={['hanzoai/o11y', GH]} stars="4 stars" />
    </main>
  );
}
