'use client';
// Signature: One Chrome window, full width, inspector-led: Hanzo's side agent works the active checkout tab step by step while a DevTools drawer follows it live (the DOM node it reads, the console error, the policy check, the network trace), then the patch lands in your code channel's tab
// Beyond: A site-policy tester: type any address and see whether Hanzo's example allowlist lets the agent in, wildcards matched as you type, with the part each * stands for marked in the address
// Persona: an engineering lead who lives in Chrome, and the admin who has to say which sites an agent may touch.
// Goal: add the extension, then set the organization's site policy.
// CTA: Add to Chrome (chromewebstore.google.com): hero solid + the one closing ask row; Configure Org Policies and every other link are text links.
// Metric: signup_start (install hand-off to the Chrome Web Store)
/* Hanzo in Chrome (Archetype: Launch, then System governance).
   V2: 8/10 round 2: kickers gone (their words sit under the window and the headings as captions); one solid ask in the hero and in one closing ask row; no floating ask bar and no PR pill flying over the window (the patch now lands in the window's own #bug-button-darkmode tab); the run plays once and rests, with Pause/Replay; grey tab stripes replaced by Hanzo's own tab names; h1 paints first at 52; the governance room opens out of a rounded card; no springs
   Motion: signature = the agent run in the window (steps, inspector panes, the channel tab). Supporting: Stage settle,
   pinned chapters with clip wipes (components/v2/AppScenes), the black room opening to full width (scroll-linked clip).
   Colour: Hanzo's deck greys only. Every word is Hanzo's, including the example checkout, its policy and the agent's steps. */
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { EASE, Copy } from '../ui';
import { A, Cta } from '../kit';
import Lines from '../v2/x-edison/AppLines';
import Stage from '../v2/AppStage';
import Scenes from '../v2/AppScenes';
import '../v2/AppType.css';
import './ChromePage.css';

const STORE = 'https://chromewebstore.google.com';
const POLICIES = '/settings/organization/products?tab=chrome';
const STEPS = [
  ['Read active tab DOM & accessibility tree', 'https://staging.acme.inc/checkout', 'Detected 1 uncaught TypeError in CheckoutForm.tsx:142 and contrast drop on .cta-button'],
  ['Verify organization site policy', '*.acme.inc · Allowed · Password manager blocked', 'Enterprise Chrome policy verified: DOM write allowed on staging.acme.inc'],
  ['Click element & capture network trace', 'button[data-testid="submit-order"]', 'POST /api/v1/orders → 200 OK (84ms) · Screenshot attached to #bug-button-darkmode'],
  ['Post verified patch to Hanzo Team & Slack', 'PR \u0023418 · styles/cta-button.css', 'Synced live preview artifact to #bug-button-darkmode'],
];
const PANES = ['Elements', 'Console', 'Network'];
const FOLLOW = [0, 1, 2, 2, 2]; // which inspector pane follows each step

const IconPause = () => <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M5.5 3.5v9M10.5 3.5v9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
const IconPlay = () => <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M5 3.5v9l7-4.5z" fill="currentColor" /></svg>;
const IconReplay = () => <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3.5 8a4.5 4.5 0 1 0 1.3-3.2M3.5 3v2.5H6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;

/* ---------- the window: the agent works the tab, the inspector follows it, the patch lands in the channel's tab ---------- */
function Inspector({ n, pane, setPane }) {
  return (
    <div className="xch-dev" aria-label="Inspector">
      <div className="xch-dev-tabs" role="tablist" aria-label="Inspector panes">
        {PANES.map((p, i) => (
          <button key={p} type="button" role="tab" aria-selected={pane === i} onClick={() => setPane(i)}>
            {p}<i className="xch-badge" aria-hidden="true" data-on={i === 1 && n >= 1 ? '' : undefined}>{n >= 2 ? 2 : 1}</i>
          </button>
        ))}
        <span className="xch-dev-k x-mono">CDP attached</span>
      </div>
      <div className="xch-dev-body x-mono">
        <div className="xch-pane" hidden={pane !== 0}>
          <p className="xch-dom d0"><span className="t">&lt;button</span> <span className="a">class</span>=<span className="v">&quot;cta-button&quot;</span> <span className="a">data-testid</span>=<span className="v">&quot;submit-order&quot;</span><span className="t">&gt;</span></p>
          <p className="xch-dom d1">Complete Order — $300/mo</p>
          <p className="xch-dom d2"><span className="t">&lt;/button&gt;</span></p>
          <p className={'xch-warn' + (n >= 1 ? ' on' : '')}><i aria-hidden="true">!</i>contrast drop on .cta-button</p>
        </div>
        <div className="xch-pane" hidden={pane !== 1}>
          <p className={'xch-log err' + (n >= 1 ? ' on' : '')}><i aria-hidden="true">×</i>Detected 1 uncaught TypeError in CheckoutForm.tsx:142</p>
          <p className={'xch-log ok' + (n >= 2 ? ' on' : '')}><i aria-hidden="true">✓</i>Enterprise Chrome policy verified: DOM write allowed on staging.acme.inc</p>
        </div>
        <div className="xch-pane" hidden={pane !== 2}>
          <div className={'xch-net' + (n >= 3 ? ' on' : n === 2 ? ' wait' : '')}>
            <span className="m">POST</span><span className="p">/api/v1/orders</span><span className="s">200 OK</span><span className="ms">84ms</span>
            <span className="xch-fall" aria-hidden="true"><b /></span>
          </div>
          <p className={'xch-shot' + (n >= 3 ? ' on' : '')}>Screenshot attached to #bug-button-darkmode</p>
        </div>
      </div>
    </div>
  );
}

function Window() {
  const [n, setN] = useState(STEPS.length); // the server shows the finished run (the rest frame)
  const [own, setOwn] = useState(-1); // a pane the visitor chose; cleared on replay
  const [paused, setPaused] = useState(false);
  const [runKey, setRunKey] = useState(0);
  const [ran, setRan] = useState(-1);
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.15 });
  const calm = useReducedMotion();
  // the run plays once when it is first seen (and again on Replay), then rests on its last frame
  useEffect(() => {
    if (calm || !seen || ran === runKey) return;
    setRan(runKey); setOwn(-1); setN(0);
  }, [seen, calm, runKey, ran]);
  useEffect(() => {
    if (calm || !seen || paused || n >= STEPS.length || ran !== runKey) return;
    const t = setTimeout(() => setN((v) => v + 1), n === 0 ? 1300 : 2400);
    return () => clearTimeout(t);
  }, [n, seen, calm, paused, ran, runKey]);
  const done = n >= STEPS.length;
  const ctl = () => { if (done) { setPaused(false); setRunKey((k) => k + 1); } else setPaused((p) => !p); };
  const step = Math.min(n + 1, STEPS.length);
  const pane = own >= 0 ? own : FOLLOW[n];
  return (
    <div className="xch-scene" ref={box}>
      <div className="xch-win av-obj">
        <div className="xch-tabs" aria-hidden="true">
          <span className="xch-lights"><i /><i /><i /></span>
          <span className="xch-tab on"><i />Acme Pro Enterprise Checkout</span>
          <span className={'xch-tab chan' + (done ? ' hit' : '')}><i />#bug-button-darkmode</span>
          <span className="xch-tab"><i />PR &#35;418 · styles/cta-button.css</span>
          <span className="xch-tab"><i />Hanzo Team (hanzo.team)</span>
        </div>
        <div className="xch-bar">
          <span className="xch-nav" aria-hidden="true"><svg viewBox="0 0 16 16" width="16" height="16"><path d="M10 3.5 5.5 8l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg><svg viewBox="0 0 16 16" width="16" height="16"><path d="M6 3.5 10.5 8 6 12.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
          <span className="xch-url x-mono"><svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><rect x="3.5" y="7" width="9" height="6.5" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="M5.5 7V5.5a2.5 2.5 0 0 1 5 0V7" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>https://staging.acme.inc/checkout</span>
          <span className="xch-cdp x-mono"><i />CDP attached</span>
          <button type="button" className="xch-ctl" onClick={ctl} aria-label={done ? 'Replay' : 'Pause'} aria-pressed={done ? undefined : paused}>{done ? <IconReplay /> : paused ? <IconPlay /> : <IconPause />}</button>
        </div>
        <div className="xch-split">
          <div className="xch-left">
            <div className="xch-page">
              <div className="xch-page-top">
                <p className="xch-tag x-mono">ACTIVE TAB · STAGING.ACME.INC</p>
                <p className="xch-overlay"><i />Agent overlay active</p>
              </div>
              <h3>Acme Pro Enterprise Checkout</h3>
              <p className="xch-sub">15 seats · Annual billing · Zero data retention enabled</p>
              <div className="xch-row">
                <div className={'xch-target' + (n >= 1 ? ' on' : '') + (n === 0 ? ' scan' : '')}>
                  <span className="xch-sel x-mono">button.cta-button [data-testid=&quot;submit-order&quot;]</span>
                  <span className="xch-cta-w"><span className={'xch-cta' + (n >= 3 ? ' hit' : '') + (n === 2 ? ' press' : '')}>Complete Order — $300/mo</span></span>
                  <span className="xch-ins x-mono">Inspecting DOM</span>
                  <span className="xch-wcag x-mono">WCAG AAA 8.9:1</span>
                </div>
                <div className={'xch-policy' + (n === 1 ? ' check' : '') + (n >= 2 ? ' ok' : '')}>
                  <b>Organization Site Policy</b>
                  <span className="xch-seg x-mono"><span className="on">Allowlist</span><span>Allow all sites</span></span>
                  <p className="x-mono">Allowed: *.acme.inc, github.com/acme/* · Password managers: Blocked</p>
                </div>
              </div>
            </div>
            <Inspector n={n} pane={pane} setPane={setOwn} />
          </div>
          <aside className="xch-agent" aria-label="Hanzo in Chrome, side-panel agent">
            <div className="xch-agent-top">
              <span className="xch-av" aria-hidden="true">H</span>
              <span><b>Hanzo in Chrome</b><span>Side-panel browser agent · Enso Ultra</span></span>
            </div>
            <p className="xch-count x-mono">Step <AnimatePresence mode="popLayout" initial={false}><motion.span key={step} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} transition={{ duration: 0.3, ease: EASE }}>{step}</motion.span></AnimatePresence> /4</p>
            <ol className="xch-steps">
              {STEPS.map(([t, a, r], i) => {
                const state = i < n ? 'done' : i === n ? 'now' : 'wait';
                return (
                  <li key={t} className={state}>
                    <span className="xch-dot" aria-hidden="true" />
                    <span>
                      <b>{t}</b>
                      <span className="x-mono xch-arg">{a}</span>
                      <span className="xch-res">{r}</span>
                    </span>
                  </li>
                );
              })}
            </ol>
            <div className="xch-ask">Ask Hanzo to test a flow or extract page data...</div>
          </aside>
        </div>
      </div>
    </div>
  );
}

const FACTS = ['Side-panel agent that sees your active tab, accessibility tree, console errors, and network requests in real time.', 'Automates multi-tab workflows across CRMs, issue trackers, docs, and internal dashboards using your existing session.', 'Enterprise site policies: allow all sites or restrict the extension to an explicit domain allowlist with wildcard patterns.', 'Connected to Hanzo Team, Hanzo Tag (Slack), and Hanzo Bot so browser findings turn directly into code channel PRs.'];

function Hero() {
  return (
    <section className="xch-hero" aria-labelledby="xch-h1">
      <div className="av-wrap av-grid xch-top">
        <h1 id="xch-h1" className="av-display xch-h1"><span>Your browser, with an AI teammate</span> <span>built into the side panel.</span></h1>
        <div className="xch-top-r">
          <p className="av-body xch-lede">Hanzo in Chrome reads the live DOM, runs multi-step workflows across your web apps, debugs frontend issues from console and network traces, and respects your organization’s site allowlists and password-manager guardrails.</p>
          <div className="xch-acts">
            <Cta to={STORE} id="chrome.hero" thumb>Add to Chrome</Cta>
            <Cta to={POLICIES} kind="link" id="chrome.hero-policies">Configure Org Policies</Cta>
            <Cta to="https://docs.hanzo.ai/docs/apps/browser" kind="link" id="chrome.hero-docs">Browser docs</Cta>
          </div>
        </div>
      </div>
      <div className="av-wrap">
        <Stage className="xch-stage" data-morph-target="">
          <Window />
        </Stage>
        <p className="xch-caption x-mono">Hanzo in Chrome · Browser Agent &amp; Enterprise Governance</p>
        <div className="av-grid xch-facts">
          <p className="av-title xch-gov">Governed by your organization: admins control site allowlists, blocklists, and password-manager boundaries from one console.</p>
          <ol>
            {FACTS.map((t, i) => <li key={t}><span className="xch-fn x-mono av-num">{String(i + 1).padStart(2, '0')}</span><span>{t}</span></li>)}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ---------- paste and ship: one line ---------- */
const PASTE = 'Read https://hanzo.ai/skill.md and use Hanzo Chrome in my project.';

function Paste() {
  return (
    <section className="xch-paste-sec">
      <div className="av-wrap">
        <div className="xch-paste">
          <div className="xch-paste-l">
            <p className="av-title">Paste and ship</p>
            <p className="xch-paste-d">Paste this into any agent. It reads the skill manifest and calls Chrome from there.</p>
          </div>
          <div className="xch-prompt">
            <code>{PASTE}</code>
            <Copy text={PASTE} label="Copy the agent prompt" />
            <span className="xch-prompt-k x-mono">Agent prompt</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- act one: agent work, three pinned chapters with their own live UI ---------- */
function Tabs({ on }) {
  return (
    <div className={'xch-vis xch-v1' + (on ? ' on' : '')} aria-hidden="true">
      <div className="xch-mini">
        <div className="xch-mini-tabs">{['CRMs', 'issue trackers', 'docs', 'internal dashboards'].map((t, i) => <span key={t} className={'t' + i}>{t}</span>)}</div>
        <div className="xch-mini-body">
          {['Navigates pages', 'fills forms', 'clicks controls', 'extracts structured data'].map((t, i) => (
            <div key={t} className="xch-act" style={{ '--i': i }}><span className="x-mono">{String(i + 1).padStart(2, '0')}</span><span>{t}</span><i className="xch-act-ok"><svg viewBox="0 0 16 16" width="14" height="14"><path d="M3.5 8.5l3 3 6-6.5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" /></svg></i></div>
          ))}
        </div>
      </div>
      <p className="xch-mini-k x-mono">using your existing session</p>
    </div>
  );
}

function Bridge({ on }) {
  return (
    <div className={'xch-vis xch-v2' + (on ? ' on' : '')} aria-hidden="true">
      <div className="xch-src">{['live DOM styles', 'console logs', 'network timings'].map((t, i) => <span key={t} style={{ '--i': i }}>{t}</span>)}</div>
      <div className="xch-mcp"><i /><span className="x-mono">MCP</span><i /></div>
      <div className="xch-dst">{['Hanzo Dev', 'VS Code', 'JetBrains', 'Code Channels'].map((t, i) => <span key={t} style={{ '--i': i }}>{t}</span>)}</div>
    </div>
  );
}

function Admin({ on }) {
  return (
    <div className={'xch-vis xch-v3' + (on ? ' on' : '')} aria-hidden="true">
      <div className="xch-admin">
        <p className="xch-admin-k x-mono">Organization owners</p>
        {[['toggle extension access', 'on'], ['block password manager interaction', 'block'], ['enforce domain allowlists or blocklists', 'on']].map(([t, s], i) => (
          <div key={t} className={'xch-tog ' + s} style={{ '--i': i }}><span>{t}</span><i><b /></i></div>
        ))}
        <p className="xch-admin-f x-mono">across every seat</p>
      </div>
    </div>
  );
}

const WHAT = [
  { title: 'Acts in your live tabs', body: <p className="av-body">Navigates pages, fills forms, clicks controls, and extracts structured data from any web application you are already signed into.</p>, visual: (on) => <Tabs on={on} /> },
  { title: 'Bridges browser to IDE & CLI', body: <p className="av-body">Streams live DOM styles, console logs, and network timings straight to Hanzo Dev, VS Code, JetBrains, and Code Channels over MCP.</p>, visual: (on) => <Bridge on={on} /> },
  { title: 'Zero-trust admin controls', body: <p className="av-body">Organization owners toggle extension access, block password manager interaction, and enforce domain allowlists or blocklists across every seat.</p>, visual: (on) => <Admin on={on} /> },
];

function What() {
  return (
    <>
      <section className="av-sec xch-what" aria-labelledby="xch-what-h">
        <div className="av-wrap av-grid">
          <Lines as="h2" id="xch-what-h" className="av-display s xch-what-l" lines={['Real-time browser intelligence', 'under enterprise control']} />
          <div className="xch-what-r">
            <p className="av-lede">Stop copying and pasting screenshots, stack traces, and table rows between tabs.</p>
            <p className="xch-cap-k x-mono">What it is</p>
          </div>
        </div>
      </section>
      <Scenes label="What it is" items={WHAT} flip tone={['#fff', '#f5f5f5', '#fff']} />
    </>
  );
}

/* ---------- capabilities: six tiles ---------- */
const CAPS = [
  ['Live DOM & CSS inspection', 'Select any element on staging or production to inspect computed tokens, contrast ratios, and component props, then generate the exact patch.', 'dom'],
  ['Visual QA & bug reproduction', 'Ask Hanzo in Chrome to reproduce a reported bug, capture the failing network request, and post a Canvas summary to your code channel.', 'qa'],
  ['Cross-tab synthesis', 'Compare specifications in one tab against a live deployment or pull request in another and flag every discrepancy.', 'tabs'],
  ['Password manager guardrails', 'Keep credential vaults isolated by default; organization admins explicitly control whether agents can interact with password managers.', 'lock'],
  ['Wildcard site allowlists & blocklists', 'Configure Allow All Sites with sensitive exclusions or Block All Sites with approved internal domains in Organization Settings.', 'star'],
  ['Direct handoff to Hanzo Bot & Team', 'Start a task in your Chrome side panel and hand long-running background execution to a cloud resident bot or Slack code channel.', 'hand'],
];
const GLYPH = {
  dom: <><rect x="6" y="9" width="28" height="22" rx="4" /><path d="M14 17l-4 3 4 3M26 17l4 3-4 3M22 15l-4 10" /></>,
  qa: <><circle cx="18" cy="18" r="8" /><path d="M24 24l7 7" /></>,
  tabs: <><rect x="5" y="11" width="13" height="18" rx="3" /><rect x="22" y="11" width="13" height="18" rx="3" /><path d="M18 20h4" /></>,
  lock: <><rect x="10" y="17" width="20" height="14" rx="3" /><path d="M14 17v-4a6 6 0 0 1 12 0v4" /></>,
  star: <><path d="M20 8v24M9.6 14l20.8 12M9.6 26l20.8-12" /></>,
  hand: <><rect x="5" y="12" width="14" height="16" rx="3" /><path d="M23 20h12M30 15l5 5-5 5" /></>,
};

function Caps() {
  return (
    <section className="av-sec xch-caps-sec" aria-labelledby="xch-caps-h">
      <div className="av-wrap">
        <div className="av-grid xch-caps-top">
          <Lines as="h2" id="xch-caps-h" className="av-head xch-caps-l" lines={['Built for engineering, design, and operations']} />
          <div className="xch-caps-r">
            <p className="xch-cap-k x-mono">Capabilities</p>
            <Cta to="/extension" kind="link" id="chrome.caps-extension">Explore all browser extension features</Cta>
          </div>
        </div>
        <ul className="xch-caps">
          {CAPS.map(([t, d, g], i) => (
            <li key={t} className={'xch-cap' + (i === 3 || i === 4 ? ' gov' : '')}>
              <svg className="xch-glyph" viewBox="0 0 40 40" width="40" height="40" aria-hidden="true">{GLYPH[g]}</svg>
              <h3 className="av-title">{t}</h3>
              <p>{d}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- act two, the black room: governance, and the Beyond policy tester ---------- */
const ALLOW = ['*.acme.inc', 'github.com/acme/*'];
// Chrome-style wildcard patterns from Hanzo's own example policy. Returns which pattern let the address in, and what its * stood for.
export function allowed(input, mode) {
  if (mode === 'all') return { ok: true, by: null, star: '' };
  const u = input.trim().toLowerCase().replace(/^[a-z]+:\/\//, '');
  if (!u) return null;
  const [host, ...rest] = u.split('/');
  const path = '/' + rest.join('/');
  for (const p of ALLOW) {
    const [ph, ...pr] = p.split('/');
    const pp = pr.length ? '/' + pr.join('/') : null;
    const hostOk = ph.startsWith('*.') ? host.endsWith(ph.slice(1)) && host.length > ph.length - 1 : host === ph;
    const pathOk = !pp || (pp.endsWith('*') ? path.startsWith(pp.slice(0, -1)) : path === pp);
    if (hostOk && pathOk) {
      const star = ph.startsWith('*.') ? host.slice(0, host.length - ph.length + 1) : path.slice(pp.length - 1);
      return { ok: true, by: p, star, host, path, where: ph.startsWith('*.') ? 'host' : 'path' };
    }
  }
  return { ok: false, by: null, star: '' };
}
const TRY = ['staging.acme.inc/checkout', 'github.com/acme/web', 'github.com/hanzoai', 'acme.inc'];

function Marked({ v, res }) {
  const u = v.trim().replace(/^[a-z]+:\/\//i, '');
  if (!res || !res.ok || !res.star) return <span>{u || ' '}</span>;
  const i = res.where === 'host' ? 0 : u.toLowerCase().indexOf(res.path) + res.path.length - res.star.length;
  return <span>{u.slice(0, i)}<mark>{u.slice(i, i + res.star.length)}</mark>{u.slice(i + res.star.length)}</span>;
}

function Policy() {
  const [mode, setMode] = useState('list');
  const [v, setV] = useState(TRY[0]);
  const res = useMemo(() => allowed(v, mode), [v, mode]);
  const ref = useRef(null);
  const calm = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 0.2'] });
  const clip = useTransform(scrollYProgress, [0, 1], ['inset(0% 3% 0% 3% round 24px)', 'inset(0% 0% 0% 0% round 0px)']);
  return (
    <motion.section ref={ref} className="av-sec xch-pol av-dark" data-room="dark" aria-labelledby="xch-pol-h" style={calm ? undefined : { clipPath: clip }}>
      <div className="av-wrap av-grid">
        <div className="xch-pol-l">
          <Lines as="h2" id="xch-pol-h" className="av-head" lines={['Wildcard site allowlists & blocklists']} />
          <p className="av-body">Configure Allow All Sites with sensitive exclusions or Block All Sites with approved internal domains in Organization Settings.</p>
          <p className="av-body xch-pm"><svg viewBox="0 0 40 40" width="28" height="28" aria-hidden="true">{GLYPH.lock}</svg><span>Keep credential vaults isolated by default; organization admins explicitly control whether agents can interact with password managers.</span></p>
        </div>
        <div className="xch-tester">
          <div className="xch-mode" role="radiogroup" aria-label="Policy">
            {[['list', 'Allowlist'], ['all', 'Allow all sites']].map(([k, l]) => (
              <button key={k} type="button" role="radio" aria-checked={mode === k} onClick={() => setMode(k)}>
                {mode === k && <motion.span layoutId="xch-mode" className="xch-mode-bg" transition={{ duration: 0.3, ease: EASE }} />}
                <span>{l}</span>
              </button>
            ))}
          </div>
          <ul className="xch-pats" aria-label="Allowed patterns">
            {ALLOW.map((p) => {
              const hit = mode === 'list' && res && res.by === p;
              return <li key={p} className={'x-mono' + (hit ? ' hit' : '') + (mode === 'all' ? ' off' : '')}><i aria-hidden="true" />{p}</li>;
            })}
            <li className="x-mono pm"><i aria-hidden="true" />Password managers: Blocked</li>
          </ul>
          <p className="xch-rule x-mono">Allowed: *.acme.inc, github.com/acme/* · Password managers: Blocked</p>
          <label className="xch-field">
            <span className="x-sr">An address to test</span>
            <span className="xch-https x-mono" aria-hidden="true">https://</span>
            <input value={v} onChange={(e) => setV(e.target.value)} spellCheck="false" autoComplete="off" className="x-mono" />
          </label>
          <p className="xch-mirror x-mono" aria-hidden="true"><Marked v={v} res={mode === 'list' ? res : null} /></p>
          <div className="xch-try">{TRY.map((t) => <button key={t} type="button" className={'x-mono' + (v === t ? ' on' : '')} onClick={() => setV(t)}>{t}</button>)}</div>
          <div className="xch-verdict" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              {res && (
                <motion.p key={res.ok + '|' + (res.by || '') + mode} className={res.ok ? 'ok' : 'no'} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3, ease: EASE }}>
                  <i aria-hidden="true">{res.ok ? '✓' : '×'}</i>
                  <span><b>{res.ok ? 'Allowed' : 'Not on the allowlist'}</b><span className="x-mono">{mode === 'all' ? 'Allow all sites' : res.by ? 'matches ' + res.by + (res.star ? ' · * = ' + res.star : '') : 'the agent stays out'}</span></span>
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

/* ---------- connected surfaces: where a finding goes next ---------- */
const SURF = [
  ['Hanzo in Chrome', 'Interactive side-panel agent inside Chrome, Brave, Edge, and Arc with enterprise site governance.'],
  ['Hanzo Team (hanzo.team)', 'Full workspace with Code Channels, Canvas artifacts, boards, docs, and AI teammates.'],
  ['Hanzo Tag for Slack (/slack)', 'Bring @Hanzo and Code Channels directly into your existing Slack channels and threads.'],
  ['Hanzo Bot (hanzo.bot)', 'Autonomous resident teammates with their own sandboxed computer, browser, terminal, and schedule.'],
];

function Surfaces() {
  return (
    <section className="av-sec xch-surf" aria-labelledby="xch-surf-h">
      <div className="av-wrap">
        <div className="av-grid xch-surf-top">
          <Lines as="h2" id="xch-surf-h" className="av-head xch-surf-l" lines={['One agent family across browser, Slack, workspace, and cloud']} />
          <div className="xch-surf-r">
            <p className="xch-cap-k x-mono">Connected surfaces</p>
            <Cta to="/slack" kind="link" id="chrome.surf-slack">See Hanzo Tag for Slack</Cta>
          </div>
        </div>
        <ol className="xch-surf-row">
          {SURF.map(([t, d], i) => (
            <li key={t} className={i === 0 ? 'here' : ''}>
              <span className="xch-surf-n x-mono av-num">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="av-title">{t}</h3>
              <p>{d}</p>
            </li>
          ))}
        </ol>
        <div className="xch-more">
          <div>
            <h3 className="av-title">Looking for Firefox, Safari, or local IDE DevTools bridges?</h3>
            <p className="av-body">Hanzo Extension supports Chrome, Brave, Edge, Firefox, and Safari with native WebSocket &amp; ZAP binary protocol bridges into VS Code and JetBrains.</p>
          </div>
          <div className="xch-more-links">
            <A to="/extension" className="xch-pill" data-cta="chrome.more-extension">All Browser Extensions</A>
            <A to="/slack" className="xch-pill" data-cta="chrome.more-slack">Hanzo Tag for Slack</A>
            <A to="/tag" className="xch-pill" data-cta="chrome.more-tag">Hanzo Tag Governance</A>
            <A to="/bot" className="xch-pill" data-cta="chrome.more-bot">Hanzo Bot</A>
          </div>
        </div>
        <div className="xch-get">
          <h3 className="av-title">Get Hanzo in Chrome</h3>
          <Cta to="https://platform.hanzo.ai/deploy" kind="link" id="chrome.get-deploy">Deploy to Cloud</Cta>
        </div>
      </div>
    </section>
  );
}

/* ---------- the one ending: a quiet room with the ask ---------- */
function Close() {
  return (
    <section className="x-band xch-close" aria-labelledby="xch-close-h">
      <div className="av-wrap av-grid">
        <Lines as="h2" id="xch-close-h" className="av-display m xch-close-l" lines={['Put Hanzo in every tab', 'your team works in.']} />
        <div className="xch-close-r">
          <p className="av-lede">Install the Chrome extension in seconds and manage organization-wide site permissions from Hanzo Admin Settings.</p>
          <Cta to={STORE} id="chrome.band" size="lg">Add to Chrome</Cta>
          <div className="xch-close-links">
            <Cta to={POLICIES} kind="link" id="chrome.band-policies">Manage Chrome Policies</Cta>
            <Cta to="/team" kind="link" id="chrome.band-team">Explore Hanzo Team</Cta>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ChromePage() {
  return (
    <main className="av xch" style={{ '--ac': '#737373' }} data-ask="off">
      <Hero />
      <Paste />
      <What />
      <Caps />
      <Policy />
      <Surfaces />
      <Close />
    </main>
  );
}
