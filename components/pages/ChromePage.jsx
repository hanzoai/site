'use client';
/* Chrome. Signature: your browser with an AI teammate. A Chrome window with its tabs; the side agent works the active tab
   step by step (reads the DOM, checks the site policy, clicks and traces the network, posts the patch), its overlay boxes
   the element it is inspecting on the page, and the finished PR leaves the window for your code channel.
   Beyond: a site-policy tester. Type any address and see whether Hanzo's example allowlist (*.acme.inc, github.com/acme/*)
   lets the agent in, with the wildcards matched as you type; switch the policy to "Allow all sites" to compare.
   Every word is Hanzo's, including the example checkout, its policy and the agent's steps. */
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { EASE, Copy } from '../ui';
import { A, Go, SecHead } from '../kit';
import './ChromePage.css';

const STEPS = [
  ['Read active tab DOM & accessibility tree', 'https://staging.acme.inc/checkout', 'Detected 1 uncaught TypeError in CheckoutForm.tsx:142 and contrast drop on .cta-button'],
  ['Verify organization site policy', '*.acme.inc · Allowed · Password manager blocked', 'Enterprise Chrome policy verified: DOM write allowed on staging.acme.inc'],
  ['Click element & capture network trace', 'button[data-testid="submit-order"]', 'POST /api/v1/orders → 200 OK (84ms) · Screenshot attached to #bug-button-darkmode'],
  ['Post verified patch to Hanzo Team & Slack', 'PR #418 · styles/cta-button.css', 'Synced live preview artifact to #bug-button-darkmode'],
];

function Window() {
  const [n, setN] = useState(STEPS.length); // the server shows the finished run
  const [live, setLive] = useState(false); // the PR leaves the window only after a run the visitor watched
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.35 });
  const calm = useReducedMotion();
  useEffect(() => { if (!calm) setN(0); }, [calm]);
  useEffect(() => {
    if (calm || !seen) return;
    const t = setTimeout(() => { setLive(true); setN((v) => (v >= STEPS.length ? 0 : v + 1)); }, n >= STEPS.length ? 3800 : n === 0 ? 1200 : 2300);
    return () => clearTimeout(t);
  }, [n, seen, calm]);
  const step = Math.min(n + 1, STEPS.length);
  return (
    <div className="xch-win" ref={box}>
      <div className="xch-tabs" aria-hidden="true">
        <span className="xch-lights"><i /><i /><i /></span>
        <span className="xch-tab on"><i />Acme Pro Enterprise Checkout</span>
        <span className="xch-tab"><i /><b /></span>
        <span className="xch-tab"><i /><b /></span>
        <span className="xch-tab"><i /><b /></span>
      </div>
      <div className="xch-bar">
        <span className="xch-url x-mono">https://staging.acme.inc/checkout</span>
        <span className="xch-cdp x-mono"><i />CDP attached</span>
      </div>
      <div className="xch-split">
        <div className="xch-page">
          <p className="xch-tag x-mono">ACTIVE TAB · STAGING.ACME.INC</p>
          <p className="xch-overlay"><i />Agent overlay active</p>
          <h3>Acme Pro Enterprise Checkout</h3>
          <p className="xch-sub">15 seats · Annual billing · Zero data retention enabled</p>
          <div className={'xch-target' + (n >= 1 ? ' on' : '')}>
            <span className="xch-sel x-mono">button.cta-button [data-testid=&quot;submit-order&quot;]</span>
            <span className="xch-ins x-mono">Inspecting DOM</span>
            <span className="xch-wcag x-mono">WCAG AAA 8.9:1</span>
            <span className={'xch-cta' + (n >= 3 ? ' hit' : '')}>Complete Order — $300/mo</span>
          </div>
          <div className="xch-policy">
            <b>Organization Site Policy</b>
            <span className="xch-seg x-mono"><span className="on">Allowlist</span><span>Allow all sites</span></span>
            <p className="x-mono">Allowed: *.acme.inc, github.com/acme/* · Password managers: Blocked</p>
          </div>
        </div>
        <aside className="xch-agent" aria-label="Hanzo in Chrome, side-panel agent">
          <div className="xch-agent-top">
            <span className="xch-av" aria-hidden="true">H</span>
            <span><b>Hanzo in Chrome</b><span>Side-panel browser agent · Enso Ultra</span></span>
          </div>
          <p className="xch-count x-mono">Step <AnimatePresence mode="popLayout" initial={false}><motion.span key={step} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }}>{step}</motion.span></AnimatePresence> /4</p>
          <ol className="xch-steps">
            {STEPS.map(([t, a, r], i) => {
              const state = i < n ? 'done' : i === n ? 'now' : 'wait';
              return (
                <li key={t} className={state}>
                  <span className="xch-dot" aria-hidden="true" />
                  <span>
                    <b>{t}</b>
                    <span className="x-mono xch-arg">{a}</span>
                    <motion.span className="xch-res" initial={false} animate={{ opacity: i < n ? 1 : 0, y: i < n ? 0 : -4 }} transition={{ duration: 0.4, ease: EASE }}>{r}</motion.span>
                  </span>
                </li>
              );
            })}
          </ol>
          <div className="xch-ask">Ask Hanzo to test a flow or extract page data...</div>
        </aside>
      </div>
      <AnimatePresence>
        {live && n >= STEPS.length && (
          <motion.span key="pr" className="xch-pr x-mono" aria-hidden="true" initial={{ opacity: 0, y: 0, scale: 0.9 }} animate={{ opacity: [0, 1, 1, 0], y: [0, -10, -10, -60], scale: [0.9, 1, 1, 0.92] }} transition={{ duration: 3.4, times: [0, 0.15, 0.7, 1], ease: EASE }}>
            PR #418 · styles/cta-button.css → #bug-button-darkmode
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

function Hero() {
  return (
    <section className="xch-hero" aria-labelledby="xch-h1">
      <div className="x-wrap">
        <div className="xch-hero-copy">
          <motion.p className="x-kick" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>Hanzo in Chrome · Browser Agent &amp; Enterprise Governance</motion.p>
          <h1 id="xch-h1" className="xch-h1">
            {['Your browser, with an AI teammate', 'built into the side panel.'].map((t, i) => (
              <span className="x-line" key={t}><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.05 + i * 0.12 }}>{t}</motion.span></span>
            ))}
          </h1>
          <div className="xch-hero-row">
            <motion.p className="xch-lede" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}>
              Hanzo in Chrome reads the live DOM, runs multi-step workflows across your web apps, debugs frontend issues from console and network traces, and respects your organization’s site allowlists and password-manager guardrails.
            </motion.p>
            <motion.div className="xch-acts" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}>
              <A to="https://chromewebstore.google.com" className="x-btn solid" data-thumb="Add to Chrome">Add to Chrome</A>
              <A to="/settings/organization/products?tab=chrome" className="x-btn">Configure Org Policies</A>
              <A to="https://docs.hanzo.ai/docs/apps/browser" className="xch-doc">Browser docs</A>
            </motion.div>
          </div>
        </div>
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: EASE, delay: 0.3 }}>
          <Window />
        </motion.div>
        <div className="xch-facts">
          <ul>
            {['Side-panel agent that sees your active tab, accessibility tree, console errors, and network requests in real time.', 'Automates multi-tab workflows across CRMs, issue trackers, docs, and internal dashboards using your existing session.', 'Enterprise site policies: allow all sites or restrict the extension to an explicit domain allowlist with wildcard patterns.', 'Connected to Hanzo Team, Hanzo Tag (Slack), and Hanzo Bot so browser findings turn directly into code channel PRs.'].map((t, i) => (
              <li key={t}><span className="xch-fn x-mono">{String(i + 1).padStart(2, '0')}</span>{t}</li>
            ))}
          </ul>
          <p className="xch-gov">Governed by your organization: admins control site allowlists, blocklists, and password-manager boundaries from one console.</p>
        </div>
      </div>
    </section>
  );
}

const PASTE = 'Read https://hanzo.ai/skill.md and use Hanzo Chrome in my project.';

function Paste() {
  return (
    <section className="xch-paste-sec">
      <div className="x-wrap xch-paste">
        <div>
          <p className="x-kick">Paste and ship</p>
          <p className="xch-paste-l">Paste this into any agent. It reads the skill manifest and calls Chrome from there.</p>
        </div>
        <div className="xch-prompt">
          <div className="xch-prompt-top"><span className="x-mono">Agent prompt</span><Copy text={PASTE} label="Copy the agent prompt" /></div>
          <pre className="x-mono">{PASTE}<span className="xch-cur" aria-hidden="true" /></pre>
        </div>
      </div>
    </section>
  );
}

const WHAT = [
  ['Acts in your live tabs', 'Navigates pages, fills forms, clicks controls, and extracts structured data from any web application you are already signed into.'],
  ['Bridges browser to IDE & CLI', 'Streams live DOM styles, console logs, and network timings straight to Hanzo Dev, VS Code, JetBrains, and Code Channels over MCP.'],
  ['Zero-trust admin controls', 'Organization owners toggle extension access, block password manager interaction, and enforce domain allowlists or blocklists across every seat.'],
];
const CAPS = [
  ['Live DOM & CSS inspection', 'Select any element on staging or production to inspect computed tokens, contrast ratios, and component props, then generate the exact patch.'],
  ['Visual QA & bug reproduction', 'Ask Hanzo in Chrome to reproduce a reported bug, capture the failing network request, and post a Canvas summary to your code channel.'],
  ['Cross-tab synthesis', 'Compare specifications in one tab against a live deployment or pull request in another and flag every discrepancy.'],
  ['Password manager guardrails', 'Keep credential vaults isolated by default; organization admins explicitly control whether agents can interact with password managers.'],
  ['Wildcard site allowlists & blocklists', 'Configure Allow All Sites with sensitive exclusions or Block All Sites with approved internal domains in Organization Settings.'],
  ['Direct handoff to Hanzo Bot & Team', 'Start a task in your Chrome side panel and hand long-running background execution to a cloud resident bot or Slack code channel.'],
];

function What() {
  return (
    <section className="x-sec xch-what">
      <div className="x-wrap">
        <SecHead kicker="What it is" title="Real-time browser intelligence under enterprise control" lede="Stop copying and pasting screenshots, stack traces, and table rows between tabs." />
        <ol className="xch-three">
          {WHAT.map(([t, d], i) => (
            <li key={t}>
              <span className="xch-big x-mono">{String(i + 1).padStart(2, '0')}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </li>
          ))}
        </ol>
        <div className="xch-caps-h">
          <SecHead kicker="Capabilities" title="Built for engineering, design, and operations" />
        </div>
        <div className="xch-caps">
          {CAPS.map(([t, d], i) => (
            <div key={t} className="xch-cap">
              <span className="xch-inspect" aria-hidden="true" style={{ animationDelay: i * 1.1 + 's' }} />
              <h3>{t}</h3>
              <p>{d}</p>
            </div>
          ))}
        </div>
        <div className="x-row-links"><A to="/extension" className="xch-arrow">Explore all browser extension features →</A></div>
      </div>
    </section>
  );
}

/* The example policy from Hanzo's own screen, as Chrome-style wildcard patterns. */
const ALLOW = ['*.acme.inc', 'github.com/acme/*'];
export function allowed(input, mode) {
  if (mode === 'all') return { ok: true, by: null };
  const u = input.trim().toLowerCase().replace(/^[a-z]+:\/\//, '');
  if (!u) return null;
  const [host, ...rest] = u.split('/');
  const path = '/' + rest.join('/');
  for (const p of ALLOW) {
    const [ph, ...pr] = p.split('/');
    const pp = pr.length ? '/' + pr.join('/') : null;
    const hostOk = ph.startsWith('*.') ? host.endsWith(ph.slice(1)) && host.length > ph.length - 1 : host === ph;
    const pathOk = !pp || (pp.endsWith('*') ? path.startsWith(pp.slice(0, -1)) : path === pp);
    if (hostOk && pathOk) return { ok: true, by: p };
  }
  return { ok: false, by: null };
}
const TRY = ['staging.acme.inc/checkout', 'github.com/acme/web', 'github.com/hanzoai', 'acme.inc'];

function Policy() {
  const [mode, setMode] = useState('list');
  const [v, setV] = useState(TRY[0]);
  const res = useMemo(() => allowed(v, mode), [v, mode]);
  return (
    <section className="x-sec xch-pol" data-room="dark" aria-labelledby="xch-pol-h">
      <div className="x-wrap xch-pol-grid">
        <div>
          <p className="x-kick">Organization Site Policy</p>
          <h2 id="xch-pol-h" className="xch-pol-h">Wildcard site allowlists &amp; blocklists</h2>
          <p className="xch-pol-l">Configure Allow All Sites with sensitive exclusions or Block All Sites with approved internal domains in Organization Settings.</p>
          <p className="xch-pol-l">Keep credential vaults isolated by default; organization admins explicitly control whether agents can interact with password managers.</p>
        </div>
        <div className="xch-tester">
          <div className="xch-mode" role="radiogroup" aria-label="Policy">
            {[['list', 'Allowlist'], ['all', 'Allow all sites']].map(([k, l]) => (
              <button key={k} type="button" role="radio" aria-checked={mode === k} onClick={() => setMode(k)}>
                {mode === k && <motion.span layoutId="xch-mode" className="xch-mode-bg" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                <span>{l}</span>
              </button>
            ))}
          </div>
          <p className="xch-rule x-mono">Allowed: *.acme.inc, github.com/acme/* · Password managers: Blocked</p>
          <label className="xch-field">
            <span className="x-sr">An address to test</span>
            <span className="xch-https x-mono" aria-hidden="true">https://</span>
            <input value={v} onChange={(e) => setV(e.target.value)} spellCheck="false" autoComplete="off" className="x-mono" />
          </label>
          <div className="xch-try">{TRY.map((t) => <button key={t} type="button" className={v === t ? 'on' : ''} onClick={() => setV(t)}>{t}</button>)}</div>
          <div className="xch-verdict" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              {res && (
                <motion.p key={res.ok + '|' + (res.by || '') + mode} className={res.ok ? 'ok' : 'no'} initial={{ opacity: 0, y: 10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3, ease: EASE }}>
                  <i aria-hidden="true">{res.ok ? '✓' : '×'}</i>
                  <span><b>{res.ok ? 'Allowed' : 'Not on the allowlist'}</b><span className="x-mono">{mode === 'all' ? 'Allow all sites' : res.by ? 'matches ' + res.by : 'the agent stays out'}</span></span>
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          <span className="xch-sweep" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}

const SURF = [
  ['Hanzo in Chrome', 'Interactive side-panel agent inside Chrome, Brave, Edge, and Arc with enterprise site governance.'],
  ['Hanzo Team (hanzo.team)', 'Full workspace with Code Channels, Canvas artifacts, boards, docs, and AI teammates.'],
  ['Hanzo Tag for Slack (/slack)', 'Bring @Hanzo and Code Channels directly into your existing Slack channels and threads.'],
  ['Hanzo Bot (hanzo.bot)', 'Autonomous resident teammates with their own sandboxed computer, browser, terminal, and schedule.'],
];

function Surfaces() {
  const [at, setAt] = useState(0);
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.4 });
  const calm = useReducedMotion();
  useEffect(() => {
    if (calm || !seen) return;
    const t = setTimeout(() => setAt((a) => (a + 1) % SURF.length), 2400);
    return () => clearTimeout(t);
  }, [at, seen, calm]);
  return (
    <section className="x-sec xch-surf" ref={box}>
      <div className="x-wrap">
        <SecHead kicker="Connected surfaces" title="One agent family across browser, Slack, workspace, and cloud" />
        <div className="xch-surf-row">
          <i className="xch-surf-line" aria-hidden="true"><motion.b animate={{ x: at * 100 + '%' }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} /></i>
          {SURF.map(([t, d], i) => (
            <div key={t} className={'xch-surf-c' + (i === at ? ' on' : '')} onPointerEnter={() => setAt(i)}>
              <span className="xch-surf-n x-mono">{String(i + 1).padStart(2, '0')}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </div>
          ))}
        </div>
        <div className="x-row-links"><A to="/slack" className="xch-arrow">See Hanzo Tag for Slack →</A></div>
        <div className="xch-more">
          <div>
            <h3>Looking for Firefox, Safari, or local IDE DevTools bridges?</h3>
            <p>Hanzo Extension supports Chrome, Brave, Edge, Firefox, and Safari with native WebSocket &amp; ZAP binary protocol bridges into VS Code and JetBrains.</p>
          </div>
          <div className="xch-more-links">
            <A to="/extension" className="xch-pill">All Browser Extensions</A>
            <A to="/slack" className="xch-pill">Hanzo Tag for Slack</A>
            <A to="/tag" className="xch-pill">Hanzo Tag Governance</A>
            <A to="/bot" className="xch-pill">Hanzo Bot</A>
          </div>
        </div>
      </div>
    </section>
  );
}

function Close() {
  return (
    <section className="x-sec xch-close">
      <div className="x-wrap">
        <div className="xch-close-card">
          <p className="x-kick">Hanzo in Chrome</p>
          <h2>Put Hanzo in every tab your team works in.</h2>
          <p className="xch-close-l">Install the Chrome extension in seconds and manage organization-wide site permissions from Hanzo Admin Settings.</p>
          <div className="xch-acts">
            <Go to="https://chromewebstore.google.com" solid>Add to Chrome</Go>
            <Go to="/settings/organization/products?tab=chrome">Manage Chrome Policies</Go>
            <A to="/team" className="xch-doc">Explore Hanzo Team</A>
          </div>
          <span className="xch-tabs-deco" aria-hidden="true">{[0, 1, 2, 3, 4].map((k) => <i key={k} style={{ animationDelay: k * 0.4 + 's' }} />)}</span>
        </div>
        <div className="xch-get">
          <h2>Get Hanzo in Chrome</h2>
          <Go to="https://platform.hanzo.ai/deploy" solid>Deploy to Cloud</Go>
        </div>
      </div>
    </section>
  );
}

export default function ChromePage() {
  return (
    <main className="xch">
      <Hero />
      <Paste />
      <What />
      <Policy />
      <Surfaces />
      <Close />
    </main>
  );
}
