'use client';
// Persona: Developer (an engineer who runs services and wants one place for traces, metrics and logs).
// Goal: try Hanzo O11y: read the source, then point an OTLP endpoint at it.
// CTA: "View on GitHub" → https://github.com/hanzoai/o11y (data-cta o11y.hero, o11y.close); only the hero and the close
//   carry it, and the site's sticky ask (components/Ask.jsx) carries the same words from data-thumb in between; the
//   header's "Try Hanzo" is left to Ask.jsx (outlined only while a page ask is on screen). Metric: api_key_created.
// Signature (docs/MOTION-MAP.md): flip-board. On the second screen a departure board of six services flips, digit by
//   digit, through O11y's six parts (p99, req/s, lines/min, exceptions, alert rule, wire) and as its data changes
//   underneath (one row's number moves every 1.3 s; only the changed characters flip). Pick a part to hold it, pause or
//   play; hover a row to light it. The hero keeps its pivot (a waterfall that opens span by span, once, then rests).
// Entrances, in page order (components/pages/o11y/Motion.jsx): 1 hero window ink-spread; 2 the board explode-gather;
//   3 the OTLP room pixel-resolve; 4 the six parts sticky-stack (cards stack under the header); 5 related and the close
//   cursor-trail. No pinned chapter scene; order: hero, board, OTLP room, parts, close.
// Beyond: what you keep. Pick what you run today (PromQL, any OTel SDK or collector, PagerDuty, Opsgenie, Slack,
//   Teams, email or a webhook) and the part of O11y that keeps it lights up with its own object.
// Scale: the h1 at 52 is the first screen's one big thing; the window settles 1.06 → 1; the board at 21px mono; card
//   titles 32; the room's figures 64; "Get O11y" grows 26 → 64.
// V2: 8/10 motion-map: flip-board + ink-spread, explode-gather, pixel-resolve, sticky-stack, cursor-trail
// Every word and link is Hanzo's; span names, log lines and the query are examples.
import { useEffect, useRef, useState } from 'react';
import { useLive } from './Frame';
import { Rise, Copy } from '../../ui';
import SettleStage from '../../v2/SettleStage';
import { useEnter, InkSpread, PixelResolve, CursorTrail, FlipBoard } from '../o11y/Motion';
import SpecDrawer from '../../v2/SpecDrawer';
import LaunchClose, { Arr } from '../../v2/LaunchClose';
import LineMask from '../../v2/LineMask';
import O11yConsole from './O11yConsole';
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
// the same query, allowed to break only between its tokens (never inside a word) where the pane is narrow
const QW = <>rate(<wbr />http_requests_total<wbr />[5m])</>;
const TRACES = [['GET /v1/checkout', 0.94, 1], ['POST /v1/chat', 0.62], ['GET /v1/cart', 0.41], ['POST /v1/embed', 0.33], ['GET /v1/search', 0.22]];
const LOGROWS = [['info', 'api', 'request received', 1], ['info', 'db', 'query plan: seq scan', 1], ['warn', 'api', 'waited on db', 1], ['info', 'auth', 'token verified'], ['info', 'payments', 'charge created']];

// the suite's clock: a live UTC readout in the window's bar, ticking only while the window is on screen (the one idle
// mover in the pinned scene beside the playhead); it renders after mount, so the server HTML and hydration agree
function Clock() {
  const [ref, live, calm] = useLive(0.1);
  const [now, setNow] = useState(null);
  useEffect(() => {
    setNow(new Date());
    if (!live || calm) return;
    let id;
    const tick = () => { const d = new Date(); setNow(d); id = setTimeout(tick, 1000 - d.getMilliseconds()); };
    id = setTimeout(tick, 1000 - new Date().getMilliseconds());
    return () => clearTimeout(id);
  }, [live, calm]);
  const t = now ? now.toISOString().slice(11, 19) : '';
  return <span className="ob-clock" ref={ref} aria-hidden="true"><i />{t}</span>;
}

// one part's illustration inside its card's window (aria-hidden: the card's own words carry the meaning). Only that
// part's pane renders; `on` (the card has entered view) draws it in
function Pane({ i, on }) {
  const d = () => on || undefined;
  return (
      <div className="ob-panes" aria-hidden="true">
        {i === 0 && <div className="ob-pane ob-trs ob-live" data-on={d(0)}>
          {TRACES.map(([n, w, hot], i) => (
            <div key={n} className={'ob-tr' + (hot ? ' hot' : '')} style={{ '--i': i, '--obw': w }}><span>{n}</span><b /></div>
          ))}
        </div>}
        {i === 1 && <div className="ob-pane ob-live ob-met" data-on={d(1)}>
          <code className="ob-q">{QW}</code>
          <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="ob-chart">
            <path d="M0 30 C10 26 16 28 24 22 S38 12 48 18 62 30 72 20 88 8 100 12" />
            <path className="b" d="M0 34 C12 33 20 31 30 32 S50 28 60 30 80 26 100 28" />
          </svg>
          <p className="ob-same">the same store the traces are in</p>
        </div>}
        {i === 2 && <div className="ob-pane" data-on={d(2)}>
          <div className="ob-filter"><span>span_id</span><b>= 4f2a…</b></div>
          {LOGROWS.map(([lv, s, m, hot], i) => (
            <div key={i} className={'ob-log' + (hot ? ' hot' : '')} style={{ '--i': i }}><span className={'lv ' + lv}>{lv}</span><span>{s}</span><span>{m}</span></div>
          ))}
          <div className="ob-tail"><b /></div>
        </div>}
        {i === 3 && <div className="ob-pane" data-on={d(3)}>
          <div className="ob-ex">
            <span className="ob-ex-stack">{[1, 2, 3, 4].map((i) => <span key={i} style={{ '--i': i }}>TimeoutError</span>)}</span>
            <div><b>TimeoutError</b><em>db · SELECT cart</em></div>
            <span className="lx-fig">1,000</span>
          </div>
          {/* the trace it links to: the hero's own waterfall, small, with the span that raised it lit */}
          <ul className="ob-ex-tr">
            {SPANS.map(([s, o, x, w], i) => (
              <li key={o} className={i === SLOW ? 'hot' : ''} style={{ '--i': i }}><span>{s}</span><i><b style={{ left: x + '%', width: w + '%' }} /></i></li>
            ))}
          </ul>
          <p className="ob-same">links to the trace that raised it</p>
        </div>}
        {i === 4 && <div className="ob-pane" data-on={d(4)}>
          <div className="ob-rule"><span className="ob-k">alert rule · saved query</span><code>{QW}</code></div>
          {/* the saved query's own line, crossing its threshold where the rule fires */}
          <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="ob-chart ob-al">
            <path className="t" d="M0 14 L100 14" />
            <path d="M0 30 C10 26 16 28 24 22 S38 12 48 18 62 30 72 20 88 8 100 12" />
          </svg>
          <ul className="ob-routes">{ROUTES.map((r, n) => <li key={r} style={{ '--i': n }}>{r}</li>)}</ul>
        </div>}
        {i === 5 && <div className="ob-pane ob-wire" data-on={d(5)}>
          <ul className="ob-src"><li>OTel SDK</li><li>collector</li><li className="no">agent</li></ul>
          <span className="ob-one-wire">
            <svg viewBox="0 0 100 300" preserveAspectRatio="none" className="ob-one-lines">
              {[50, 150].map((y, i) => <path key={y} pathLength="1" style={{ '--i': i }} d={`M0 ${y} C55 ${y} 45 150 100 150`} />)}
            </svg>
          </span>
          <div className="ob-dst"><span className="ob-k">OTLP</span><b>o11y.hanzo.ai</b><em>gRPC · HTTP</em></div>
          <div className="ob-wire-k">
            <code className="ob-env"><span>OTEL_EXPORTER_OTLP_ENDPOINT=</span>https://o11y.hanzo.ai</code>
            <p className="ob-same">one endpoint variable</p>
          </div>
        </div>}
      </div>
  );
}

// 4. sticky-stack: each part is a card that sticks under the header and the next one stacks over it
function Card({ i, t, d }) {
  const [ref, inn] = useEnter(0.35);
  return (
    <li className="ob-card" ref={ref} style={{ '--i': i }}>
      <div className="ob-card-t">
        <h3 className="ob-card-h">{t}</h3>
        <p className="ob-card-k">{String(i + 1).padStart(2, '0')}</p>
        <p className="ob-card-d">{d}</p>
      </div>
      <div className="ob-suite ob-card-w">
        <div className="ob-suite-bar">
          <span className="ob-suite-host">o11y.hanzo.ai</span>
          <span className="ob-tab-now" aria-hidden="true"><i />{TABS[i]}</span>
        </div>
        <Pane i={i} on={inn} />
      </div>
    </li>
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

/* The agent prompt: Frame's Paste markup and classes, with the namespace chip printed whole as hanzo.ai prints it
   ("api /v1/o11y", one run of mono). */
const PROMPT = 'Read https://hanzo.ai/skill.md and use Hanzo O11y in my project. Start with: hanzo o11y logs get';
function ObPaste() {
  return (
    <Rise className="cf-paste">
      <div className="cf-paste-h">
        <p className="cf-paste-t">Paste and ship</p>
        <p className="cf-paste-d">Paste this into any agent. It reads the skill manifest and calls O11y from there.</p>
      </div>
      <div className="cf-paste-box">
        <div className="cf-paste-bar">
          <span className="cf-paste-k">Agent prompt</span>
          <span className="cf-api">api /v1/o11y</span>
          <Copy text={PROMPT} />
        </div>
        <pre className="cf-paste-code"><code>{PROMPT}</code><span className="cf-caret" aria-hidden="true" /></pre>
      </div>
    </Rise>
  );
}

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
        <O11yConsole light name="O11y" api="/v1/o11y" side={SIDE} />
        <p className="ob-note">Example project. Every name in it is one you would give your own.</p>
      </div>
      <div className="ob-otlp-paste">
        <ObPaste />
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
        {/* 1. the hero window, entering by ink-spread */}
        <div className="lx-wrap"><SettleStage from={1.06} lift={24} className="ob-stage"><InkSpread><Pivot /></InkSpread></SettleStage></div>
      </section>

      {/* 2. the signature, entering by explode-gather: one board, six services, flipping through O11y's six parts */}
      <section className="ob-sig">
        <div className="lx-wrap ob-sig-grid">
          <FlipBoard tabs={TABS} label="The six parts of O11y" clock={<Clock />} />
          <div className="ob-sig-t ob-xg-t">
            <h2 className="ob-sig-h"><span>One store,</span> <span>one query language</span></h2>
            <p className="ob-sig-l">Every panel scopes to your org from the token, so a shared deployment still answers one tenant at a time.</p>
          </div>
        </div>
      </section>

      {/* 3. the OTLP room, entering by pixel-resolve */}
      <section className="ob-otlp"><PixelResolve><Otlp /></PixelResolve></section>

      {/* 4. the six parts, entering by sticky-stack */}
      <section className="ob-parts" aria-label="The six parts of O11y">
        <ol className="lx-wrap ob-stack">{PARTS.map(([t, d], i) => <Card key={t} i={i} t={t} d={d} />)}</ol>
      </section>

      {/* 5. related and the close, entering by cursor-trail */}
      <CursorTrail>
        <RelatedCards items={[['Logs', '/cloud/logs', 'Search every line'], ['Metrics', '/metrics', 'Time series & SLOs']]} />
        <LaunchClose name="O11y" tag="Observability suite" seed="o11y" data={[4317, 4318, 4]} ask={[ASK, GH]} cta="o11y.close" repo={[<span key="r">hanzoai/o11y</span>, GH]} stars="4 stars" />
      </CursorTrail>
    </main>
  );
}
