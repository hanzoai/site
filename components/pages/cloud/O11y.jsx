'use client';
// Persona: Developer (an engineer who runs services and wants one place for traces, metrics and logs).
// Goal: try Hanzo O11y: read the source, then point an OTLP endpoint at it.
// CTA: "View on GitHub" → https://github.com/hanzoai/o11y (data-cta o11y.hero, o11y.close); only the hero and the close
//   carry it, and the site's sticky ask (components/Ask.jsx) carries the same words from data-thumb in between; the
//   header's "Try Hanzo" is left to Ask.jsx (outlined only while a page ask is on screen). Metric: api_key_created.
// Signature: the pivot. One request draws itself across services as a waterfall in the dark room while a playhead
//   sweeps it; span by span it opens into the log lines written with its id, then rests on the slow span (9 s, once).
//   Hover a span to preview its logs, click to hold it, press play to run it again.
// Beyond: what you keep. Pick what you run today (PromQL, any OTel SDK or collector, PagerDuty, Opsgenie, Slack,
//   Teams, email or a webhook) and the part of O11y that keeps it lights up with its own object.
// Supporting (3): the line-masked title (arrival); the pinned suite, the same dark window walking one request through
//   six parts, each pane drawing itself as it arrives (scroll, state); the timed wipe into the OTLP room (time).
//   Kinds: idle (the pivot and its playhead, the console's build), pointer (span preview, magnetic ask), state (suite
//   tabs, keep chips, held span, pause and replay), arrival (cut-in, wipe), scroll (settle, pinned suite, close).
// Scale: the h1 at 52 is the first screen's one big thing; the window settles 1.06 → 1; chapter titles 32 beside one
//   64px figure; a thousand rows fold into one and its count settles from big to 64; "Get O11y" grows 26 → 64.
// V2: 8/10 dark waterfall hero that runs once and rests; the suite is that same window walking the request;
//   one ask (hero, site bar, close); deck greys, flat surfaces, no springs, no cursor labels.
// Every word and link is Hanzo's; span names, log lines and the query are examples.
import { useEffect, useRef, useState } from 'react';
import { Paste, useLive } from './Frame';
import SettleStage from '../../v2/SettleStage';
import PinnedChapters from '../../v2/PinnedChapters';
import ClipWipe from '../../v2/ClipWipe';
import SpecDrawer from '../../v2/SpecDrawer';
import LaunchClose, { Arr } from '../../v2/LaunchClose';
import LineMask from '../../v2/LineMask';
import LaunchConsole from '../../v2/LaunchConsole';
import LivePause from '../../v2/LivePause';
import RelatedCards from '../../v2/RelatedCards';
import { A } from '../../kit';
import './O11y.css';

const GH = 'https://github.com/hanzoai/o11y';
const ASK = 'View on GitHub';

/* ---------- the hero object: one request, pivoting once, then resting on the slow span ---------- */
// [service, operation, start %, width %]
const SPANS = [['gateway', 'GET /v1/checkout', 0, 100], ['api', 'checkout', 3, 92], ['auth', 'verify token', 5, 9], ['queue', 'enqueue receipt', 18, 7], ['db', 'SELECT cart', 27, 46], ['payments', 'charge', 76, 16]];
const LOGS = {
  4: ['db · query plan: seq scan', 'db · rows read', 'api · waited on db'],
  5: ['payments · charge created', 'payments · webhook queued'],
  1: ['api · request received', 'api · cart loaded', 'api · response sent'],
};
const PICKS = [4, 5, 1];
const RUN = [4, 5, 1, 4]; // the slow span, the next two, then back to the slow span, where it rests
const SLOW = 4;
const STEP = 3000;

function Pivot() {
  const [ref, live, calm] = useLive(0.3);
  const [paused, setPaused] = useState(false);
  const [t, setT] = useState(0);
  const [held, setHeld] = useState(null); // a clicked span stays open
  const [hov, setHov] = useState(null); // a span under a fine pointer previews its logs
  const last = RUN.length - 1;
  const done = calm || t >= last;
  const running = live && !paused && hov === null && held === null && !done;
  useEffect(() => {
    if (!running) return;
    const id = setTimeout(() => setT((v) => Math.min(last, v + 1)), STEP);
    return () => clearTimeout(id);
  }, [running, t, last]);
  const sel = hov ?? held ?? (calm ? SLOW : RUN[t]);
  const [svc, op] = SPANS[sel];
  // the one control: pause while it runs; once it rests (or a span is held), play runs it again from the top
  const stopped = paused || done || held !== null;
  const toggle = () => { if (done || held !== null) { setHeld(null); setT(0); setPaused(false); } else setPaused((p) => !p); };
  const sweep = !calm && !done && held === null && hov === null;
  return (
    <div className={'ob-pv' + (calm ? ' calm' : '')} ref={ref}>
      <div className="ob-pv-bar">
        <LivePause paused={stopped} onToggle={toggle} dark className="ob-pause" />
        <span className="ob-pv-host">o11y.hanzo.ai</span>
        <span className="ob-pv-trace"><span className="ob-k">trace</span><b>GET /v1/checkout</b></span>
      </div>
      <ul className="ob-pv-spans" data-sweep={sweep ? t % 2 : undefined} data-held={paused || !live || undefined} onPointerLeave={() => setHov(null)}>
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
                  onClick={() => { setHov(null); setHeld(i); }}>{row}</button>
              ) : (
                <div className={'ob-pv-row ' + cls}>{row}</div>
              )}
            </li>
          );
        })}
      </ul>
      <aside className="ob-pv-open" aria-live="polite">
        <div className="ob-pv-card" key={sel}>
          <p className="ob-k">logs</p>
          <p className="ob-pv-span"><i />{svc} · {op}</p>
          <ul>{(LOGS[sel] || []).map((l) => <li key={l}>{l}</li>)}</ul>
        </div>
        <div className="ob-pv-exc">
          <p className="ob-k">exceptions</p>
          <div><b>TimeoutError</b><span className="lx-num">× 1,000</span></div>
          <em>one row with a number on it</em>
        </div>
      </aside>
    </div>
  );
}

/* ---------- the chapters' object: the same dark window, walking the request through six parts ---------- */
const TABS = ['Traces', 'Metrics', 'Logs', 'Exceptions', 'Alerts', 'OTLP'];
const ROUTES = ['PagerDuty', 'Opsgenie', 'Slack', 'Teams', 'email', 'webhook'];
const Q = 'rate(http_requests_total[5m])';
const TRACES = [['GET /v1/checkout', 0.94, 1], ['POST /v1/chat', 0.62], ['GET /v1/cart', 0.41], ['POST /v1/embed', 0.33], ['GET /v1/search', 0.22]];
const LOGROWS = [['info', 'api', 'request received', 1], ['info', 'db', 'query plan: seq scan', 1], ['warn', 'api', 'waited on db', 1], ['info', 'auth', 'token verified'], ['info', 'payments', 'charge created']];

function Suite({ step, intro }) {
  const ref = useRef(null);
  const on = (i) => (!intro && step === i) || undefined;
  // a tab scrolls the pinned scene to its chapter, the same move as the rail's ticks (intro first, six chapters)
  const jump = (i) => {
    const sec = ref.current?.closest('.lx-pin');
    if (!sec) return;
    const y = sec.getBoundingClientRect().top + scrollY + ((i + 1.5) / (TABS.length + 1)) * (sec.offsetHeight - innerHeight);
    const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.__lenis ? window.__lenis.scrollTo(y, { duration: calm ? 0 : 1.2, easing: (x) => 1 - Math.pow(1 - x, 4) }) : scrollTo({ top: y, behavior: calm ? 'auto' : 'smooth' });
  };
  return (
    <div className="ob-suite" data-step={intro ? 'intro' : step} ref={ref}>
      <div className="ob-suite-bar">
        <span className="ob-suite-host">o11y.hanzo.ai</span>
        {!intro && <span className="ob-tab-now" aria-hidden="true" key={step}><i />{TABS[step]}</span>}
        <div className="ob-tabs" role="group" aria-label="O11y, part by part">
          {TABS.map((t, i) => <button key={t} type="button" className={on(i) ? 'on' : ''} aria-pressed={!!on(i)} onClick={() => jump(i)}>{t}</button>)}
          <i className="ob-tab-ink" aria-hidden="true" style={{ transform: `translateX(${step * 100}%)` }} />
        </div>
      </div>
      {/* an illustration of the chapter beside it: the chapter's own words carry the meaning, so readers skip it */}
      <div className="ob-panes" aria-hidden="true">
        <div className="ob-pane ob-one" data-on={intro || undefined}>
          <ul className="ob-one-tabs">{TABS.map((t, i) => <li key={t} style={{ '--i': i }}>{t}</li>)}</ul>
          <span className="ob-one-wire">
            <svg viewBox="0 0 100 600" preserveAspectRatio="none" className="ob-one-lines">
              {TABS.map((t, i) => { const y = (i + 0.5) * 100; return <path key={t} pathLength="1" style={{ '--i': i }} d={`M0 ${y} C55 ${y} 45 300 100 300`} />; })}
            </svg>
          </span>
          <code className="ob-one-q">{Q}</code>
        </div>
        <div className="ob-pane ob-trs" data-on={on(0)}>
          {TRACES.map(([n, w, hot], i) => (
            <div key={n} className={'ob-tr' + (hot ? ' hot' : '')} style={{ '--i': i, '--obw': w }}><span>{n}</span><b /></div>
          ))}
        </div>
        <div className="ob-pane" data-on={on(1)}>
          <code className="ob-q">{Q}</code>
          <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="ob-chart">
            <path d="M0 30 C10 26 16 28 24 22 S38 12 48 18 62 30 72 20 88 8 100 12" />
            <path className="b" d="M0 34 C12 33 20 31 30 32 S50 28 60 30 80 26 100 28" />
          </svg>
          <p className="ob-same">the same store the traces are in</p>
        </div>
        <div className="ob-pane" data-on={on(2)}>
          <div className="ob-filter"><span>span_id</span><b>= 4f2a…</b></div>
          {LOGROWS.map(([lv, s, m, hot], i) => (
            <div key={i} className={'ob-log' + (hot ? ' hot' : '')} style={{ '--i': i }}><span className={'lv ' + lv}>{lv}</span><span>{s}</span><span>{m}</span></div>
          ))}
        </div>
        <div className="ob-pane" data-on={on(3)}>
          <div className="ob-ex">
            <span className="ob-ex-stack">{[1, 2, 3, 4].map((i) => <span key={i} style={{ '--i': i }}>TimeoutError</span>)}</span>
            <div><b>TimeoutError</b><em>db · SELECT cart</em></div>
            <span className="lx-fig">1,000</span>
          </div>
          <p className="ob-same">links to the trace that raised it</p>
        </div>
        <div className="ob-pane" data-on={on(4)}>
          <div className="ob-rule"><span className="ob-k">alert rule · saved query</span><code>{Q}</code></div>
          <ul className="ob-routes">{ROUTES.map((r, i) => <li key={r} style={{ '--i': i }}>{r}</li>)}</ul>
        </div>
        <div className="ob-pane ob-wire" data-on={on(5)}>
          <ul className="ob-src"><li>OTel SDK</li><li>collector</li><li className="no">agent</li></ul>
          <span className="ob-one-wire">
            <svg viewBox="0 0 100 300" preserveAspectRatio="none" className="ob-one-lines">
              {[50, 150].map((y, i) => <path key={y} pathLength="1" style={{ '--i': i }} d={`M0 ${y} C55 ${y} 45 150 100 150`} />)}
            </svg>
          </span>
          <div className="ob-dst"><span className="ob-k">OTLP</span><b>o11y.hanzo.ai</b><em>gRPC · HTTP</em></div>
          <p className="ob-same ob-wire-k">one endpoint variable</p>
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
// [what you run now (Hanzo's own phrase), the part that keeps it, its object]
const KEEP = [['PromQL', 1, 'q'], ['Any OTel SDK or collector', 5, 'otlp'], ['PagerDuty, Opsgenie, Slack, Teams, email or a webhook', 4, 'routes']];
const SIDE = [['O11y', '/o11y'], ['Logs', '/cloud/logs'], ['Metrics', '/metrics'], ['Dashboards', '/dashboards'], ['AI Metrics', '/cloud/ai-metrics'], ['Billing', '/billing'], ['Plans & Pricing', '/cloud/plans'], ['Sessions', '/cloud/sessions']];

/* ---------- the OTLP room: the endpoint, what you keep, the console, and the agent prompt ---------- */
function Otlp() {
  const [k, setK] = useState(0);
  const [, part, obj] = KEEP[k];
  return (
    <div className="lx-wrap ob-otlp-grid" data-keep={obj}>
      <div className="ob-otlp-l">
        <h2 className="lx-headline">Point an OTLP endpoint at it</h2>
        <SpecDrawer className="ob-spec" rows={[{ v: '4317', l: 'gRPC' }, { v: '4318', l: 'HTTP' }]} />
        <div className="ob-keep">
          <p className="lx-kick">if you already have it</p>
          <div className="ob-keep-c" role="group" aria-label="What you run today">
            {KEEP.map(([w], i) => <button key={w} type="button" aria-pressed={k === i} onClick={() => setK(i)}>{w}</button>)}
          </div>
          <div className="ob-keep-a" aria-live="polite" key={k}>
            <b>{PARTS[part][0]}</b>
            {obj === 'q' && <code>{Q}</code>}
            {obj === 'otlp' && <span className="ob-keep-p">gRPC · HTTP</span>}
            {obj === 'routes' && <ul>{ROUTES.map((r, i) => <li key={r} style={{ '--i': i }}>{r}</li>)}</ul>}
          </div>
        </div>
      </div>
      <div className="ob-otlp-r">
        <LaunchConsole light name="O11y" api="/v1/o11y" side={SIDE} />
        <p className="ob-note">Example project. Every name in it is one you would give your own.</p>
      </div>
      <div className="ob-otlp-paste">
        <Paste name="O11y" api="/v1/o11y" prompt="Read https://hanzo.ai/skill.md and use Hanzo O11y in my project. Start with: hanzo o11y logs get" />
      </div>
    </div>
  );
}

export default function O11y() {
  return (
    <main className="lx ob">
      <section className="lx-dark ob-hero" data-room="dark" data-morph-target data-ask-name="Hanzo O11y">
        <div className="lx-wrap ob-hero-head">
          <LineMask as="h1" className="lx-display ob-h1" lines={['Hanzo O11y']} />
          <div className="ob-hero-r">
            <p className="lx-lede ob-sub">Traces, metrics and logs, in one place</p>
            <A to={GH} className="lx-cta ob-cta" data-thumb={ASK} data-cta="o11y.hero" data-cursor="">{ASK}<Arr /></A>
          </div>
        </div>
        <div className="lx-wrap"><SettleStage from={1.06} lift={24} className="ob-stage"><Pivot /></SettleStage></div>
      </section>

      <PinnedChapters
        className="ob-pin"
        label="The six parts of O11y"
        flip
        per={72}
        objH={38}
        intro={{ title: ['One store,', 'one query language'], lede: 'Every panel scopes to your org from the token, so a shared deployment still answers one tenant at a time.' }}
        steps={PARTS.map(([t, d], i) => ({ t, d, k: String(i + 1).padStart(2, '0') }))}
        visual={(at, intro) => <Suite step={at} intro={intro} />}
      />

      <ClipWipe className="ob-otlp"><Otlp /></ClipWipe>

      <RelatedCards items={[['Logs', '/cloud/logs', 'Search every line'], ['Metrics', '/metrics', 'Time series & SLOs']]} />

      <LaunchClose name="O11y" tag="Observability suite" seed="o11y" data={[4317, 4318, 4]} ask={[ASK, GH]} cta="o11y.close" repo={['hanzoai/o11y', GH]} stars="4 stars" />
    </main>
  );
}
