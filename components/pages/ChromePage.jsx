'use client';
// Signature: terminal (Live terminal): the side panel's CDP session as a terminal on the second screen; it types the agent's own steps as commands and streams what Chrome DevTools Protocol returns (the clicked button and network trace, the DOM node and console error, the site-policy check) while the matching chapter shows beside it, and the visitor picks the next command; above it the full-width Chrome window runs the same checkout debug once and rests
// Entrances: 1 rack-focus = the terminal section, 2 scroll-tilt = the black room (policy tester), 3 orbit-in = the capability rows and render, 4 cover-slide = the connected surfaces (handoff rail), 5 pull-back = the closing room
// Beyond: A site-policy tester: type any address and see whether Hanzo's example allowlist lets the agent in, wildcards matched as you type, with the part each * stands for marked in the address
// Persona: an engineering lead who lives in Chrome, and the admin who has to say which sites an agent may touch.
// Goal: add the extension, then set the organization's site policy.
// CTA: Add to Chrome (chromewebstore.google.com): hero solid + the one closing ask row; Configure Org Policies and every other link are text links.
// Metric: signup_start (install hand-off to the Chrome Web Store)
/* Hanzo in Chrome (Archetype: Launch, then System governance).
   V2: 8/10 signature `terminal`: the pinned 01/02/03 chapter scene is replaced by a live CDP terminal that types and streams the page's own example and lets the visitor pick the next command, with the three chapters beside it; no scroll-scrubbed motion left (Stage settle, black-room clip opening and the scroll-walked rail are gone: the rail now walks on time); one reveal style (the closing line only); new order hero → terminal → black room → capabilities → surfaces → paste → close; round-3 fixes kept (phone side panel CLS 0, working policy pill in the window)
   Motion: signature = the live terminal (typing, streamed output, pick the next command). Supporting: the agent run in
   the window (steps, inspector panes, the channel tab), the window's pointer tilt (fine pointers only), the handoff rail
   walking by itself once in view, the policy pill (layoutId), and the closing line's cut-in (the page's one reveal).
   Colour: Hanzo's deck greys only. Every word is Hanzo's, including the example checkout, its policy and the agent's steps. */
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { EASE, Copy, useTilt } from '../ui';
import { A, Cta } from '../kit';
import { play } from '../../lib/sound';
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
  const [pol, setPol] = useState('list'); // the policy card's own toggle, like the black room's
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
  useEffect(() => { if (done && ran === runKey && !calm) play('done'); }, [done, ran, runKey, calm]); // the run is over: the faint chime
  const ctl = () => { if (done) { setPaused(false); setRunKey((k) => k + 1); } else setPaused((p) => !p); };
  const step = Math.min(n + 1, STEPS.length);
  const pane = own >= 0 ? own : FOLLOW[n];
  const tilt = useTilt(1.6); // fine pointers only: the window leans at most 1.6 degrees toward the cursor
  return (
    <div className="xch-scene" ref={box}>
      <motion.div className="xch-win av-obj" style={calm ? undefined : { rotateX: tilt.rx, rotateY: tilt.ry, transformPerspective: 1800 }} {...tilt.on}>
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
              <h3>Acme Pro Enterprise Checkout</h3>
              <p className="xch-sub">15 seats · Annual billing · Zero data retention enabled</p>
              <div className="xch-page-top">
                <p className="xch-tag x-mono">ACTIVE TAB · STAGING.ACME.INC</p>
                <p className="xch-overlay"><i />Agent overlay active</p>
              </div>
              <div className="xch-row">
                <div className={'xch-target' + (n >= 1 ? ' on' : '') + (n === 0 ? ' scan' : '')}>
                  <span className="xch-sel x-mono">button.cta-button [data-testid=&quot;submit-order&quot;]</span>
                  <span className="xch-cta-w"><span className={'xch-cta' + (n >= 3 ? ' hit' : '') + (n === 2 ? ' press' : '')}>Complete Order — $300/mo</span></span>
                  <span className="xch-ins x-mono">Inspecting DOM</span>
                  <span className="xch-wcag x-mono">WCAG AAA 8.9:1</span>
                </div>
                <div className={'xch-policy' + (n === 1 ? ' check' : '') + (n >= 2 ? ' ok' : '')}>
                  <b>Organization Site Policy</b>
                  <span className="xch-seg x-mono" role="radiogroup" aria-label="Organization Site Policy">
                    {[['list', 'Allowlist'], ['all', 'Allow all sites']].map(([k, l]) => (
                      <button key={k} type="button" role="radio" aria-checked={pol === k} className={pol === k ? 'on' : ''} onClick={() => setPol(k)} data-sound="tick">{l}</button>
                    ))}
                  </span>
                  <p className="x-mono xch-pol-line" data-on={pol === 'list' ? '' : undefined}>Allowed: *.acme.inc, github.com/acme/* · Password managers: Blocked</p>
                  <p className="x-mono xch-pol-line" data-on={pol === 'all' ? '' : undefined} aria-hidden={pol !== 'all'}>Allow all sites · Password managers: Blocked</p>
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
                const state = i < n ? 'done' + (i < n - 1 ? ' old' : '') : i === n ? 'now' : 'wait'; // only the latest finished step keeps its result open
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
            {/* phones: the latest step's detail lives in one fixed slot, so the step rows never change height */}
            <div className="xch-slot" aria-hidden="true">
              {(() => {
                const k = n === 0 ? 0 : Math.min(n, STEPS.length) - 1;
                return (
                  <div key={n} className="xch-slot-in">
                    <span className="x-mono xch-arg">{STEPS[k][1]}</span>
                    {n > 0 && <span className="xch-slot-res">{STEPS[k][2]}</span>}
                  </div>
                );
              })()}
            </div>
            <div className="xch-ask">Ask Hanzo to test a flow or extract page data...</div>
          </aside>
        </div>
      </motion.div>
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
        <div className="xch-stage" data-morph-target="">
          <Window />
        </div>
        <p className="xch-caption x-mono">Hanzo in Chrome · Browser Agent &amp; Enterprise Governance</p>
      </div>
    </section>
  );
}

// the four facts, after the terminal (so the signature arrives on the second screen), leading into the black room
function Facts() {
  return (
    <section className="xch-facts-sec" aria-label="Governed by your organization">
      <div className="av-wrap av-grid xch-facts">
        <p className="av-title xch-gov">Governed by your organization: admins control site allowlists, blocklists, and password-manager boundaries from one console.</p>
        <ol>
          {FACTS.map((t, i) => <li key={t}><span className="xch-fn x-mono av-num">{String(i + 1).padStart(2, '0')}</span><span>{t}</span></li>)}
        </ol>
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

/* ---------- the signature: the side panel's CDP session as a live terminal ----------
   The window above shows the run; here the same session is a terminal. It types each command (one of the agent's own
   steps), then streams what Chrome DevTools Protocol hands back: the page's own example output. It plays the three
   commands once, then rests; the visitor picks the next command at any time (mouse, touch or keyboard). Beside it,
   the chapter that command proves (Hanzo's three "What it is" chapters, word for word). Each command replaces the
   log (top-down, fixed height), so nothing above a new line ever moves. */
const WHAT = [
  { title: 'Acts in your live tabs', body: 'Navigates pages, fills forms, clicks controls, and extracts structured data from any web application you are already signed into.' },
  { title: 'Bridges browser to IDE & CLI', body: 'Streams live DOM styles, console logs, and network timings straight to Hanzo Dev, VS Code, JetBrains, and Code Channels over MCP.' },
  { title: 'Zero-trust admin controls', body: 'Organization owners toggle extension access, block password manager interaction, and enforce domain allowlists or blocklists across every seat.' },
];
// [command, [[tag, text, kind]]]: tags are the real CDP domains the side panel uses; texts are the page's own example
const CMDS = [
  ['Click element & capture network trace', [
    ['Input.dispatchMouseEvent', 'button[data-testid="submit-order"]'],
    ['ok', 'Navigates pages'], ['ok', 'fills forms'], ['ok', 'clicks controls'], ['ok', 'extracts structured data'],
    ['Network.responseReceived', 'POST /api/v1/orders → 200 OK (84ms)'],
    ['Page.captureScreenshot', 'Screenshot attached to #bug-button-darkmode', 'hi'],
  ]],
  ['Read active tab DOM & accessibility tree', [
    ['DOM.getDocument', '<button class="cta-button" data-testid="submit-order">'],
    ['CSS.getComputedStyle', 'contrast drop on .cta-button'],
    ['Runtime.exceptionThrown', 'Detected 1 uncaught TypeError in CheckoutForm.tsx:142', 'err'],
    ['MCP', 'Hanzo Dev · VS Code · JetBrains · Code Channels', 'hi'],
  ]],
  ['Verify organization site policy', [
    ['policy', '*.acme.inc · Allowed · Password manager blocked'],
    ['ok', 'toggle extension access'], ['ok', 'block password manager interaction'], ['ok', 'enforce domain allowlists or blocklists'],
    ['policy', 'Enterprise Chrome policy verified: DOM write allowed on staging.acme.inc', 'hi'],
  ]],
];

function Terminal() {
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.35 });
  const calm = useReducedMotion();
  const [at, setAt] = useState(0); // the command on screen
  const [shown, setShown] = useState(CMDS[0][1].length); // server and reduced motion: the first command's full output
  const [typing, setTyping] = useState(-1); // characters of the command typed so far (-1: typed in full)
  const [auto, setAuto] = useState(true); // plays the three once, until the visitor picks
  const [busy, setBusy] = useState(false);
  const timers = useRef([]);
  const started = useRef(false);
  const stop = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  const run = (i, chain) => {
    stop();
    setAt(i);
    if (calm) { setTyping(-1); setShown(CMDS[i][1].length); setBusy(false); return; }
    const cmd = CMDS[i][0];
    let t = 0;
    const at_ = (ms, fn) => timers.current.push(setTimeout(fn, (t += ms)));
    setBusy(true); setShown(0); setTyping(0);
    for (let k = 1; k <= cmd.length; k++) at_(k === 1 ? 160 : 22, () => setTyping(k));
    at_(240, () => setTyping(-1));
    CMDS[i][1].forEach((_, k) => at_(k === 0 ? 260 : 300, () => setShown(k + 1)));
    at_(0, () => { setBusy(false); if (i === CMDS.length - 1) play('done'); });
    if (chain && i < CMDS.length - 1) at_(2600, () => run(i + 1, true));
    else if (chain) at_(0, () => setAuto(false));
  };
  useEffect(() => {
    if (!seen || started.current || calm) return;
    started.current = true;
    run(0, true);
  }, [seen, calm]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => stop, []);
  const pick = (i) => { setAuto(false); run(i, false); };
  const ctl = () => { if (auto && busy) { setAuto(false); stop(); setTyping(-1); setShown(CMDS[at][1].length); setBusy(false); } else { setAuto(true); run(0, true); } };
  const cmd = CMDS[at][0];
  const typed = typing < 0 ? cmd : cmd.slice(0, typing);
  return (
    <section className="av-sec xch-term-sec" aria-labelledby="xch-what-h" ref={box} data-enter="rack-focus">
      <div className="av-wrap av-grid">
        <div className="xch-term-l">
          <h2 id="xch-what-h" className="av-display s">Real-time browser intelligence under enterprise control</h2>
          <p className="av-lede">Stop copying and pasting screenshots, stack traces, and table rows between tabs.</p>
          <p className="xch-cap-k x-mono">What it is</p>
          <div className="xch-chap">
            {WHAT.map((w, i) => (
              <div key={w.title} className="xch-chap-i" data-on={i === at ? '' : undefined} aria-hidden={i !== at}>
                <p className="xch-chap-n x-mono av-num">{String(i + 1).padStart(2, '0')} / 03</p>
                <h3 className="av-head">{w.title}</h3>
                <p className="av-body">{w.body}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="xch-term" role="group" aria-label="Hanzo in Chrome, CDP session">
          <div className="xch-term-bar">
            <span className="xch-lights" aria-hidden="true"><i /><i /><i /></span>
            <span className="xch-term-t x-mono"><i aria-hidden="true" />CDP attached · staging.acme.inc/checkout</span>
            <button type="button" className="xch-term-ctl" onClick={ctl} aria-label={auto && busy ? 'Pause' : 'Replay'}>{auto && busy ? <IconPause /> : <IconReplay />}</button>
          </div>
          <div className="xch-term-log x-mono" aria-live="polite">
            <p className="xch-term-cmd"><span className="xch-term-ps" aria-hidden="true">›</span><span>{typed}</span>{typing >= 0 && <i className="xch-caret" aria-hidden="true" />}</p>
            {CMDS[at][1].slice(0, shown).map(([tag, text, kind]) => (
              <p key={at + tag + text} className={'xch-term-out' + (kind ? ' ' + kind : '')}>
                <span className="xch-term-tag">{tag === 'ok' ? '✓' : tag}</span><span>{text}</span>
              </p>
            ))}
            {!busy && typing < 0 && shown >= CMDS[at][1].length && <p className="xch-term-cmd rest" aria-hidden="true"><span className="xch-term-ps">›</span><i className="xch-caret" /></p>}
          </div>
          <div className="xch-term-pick" role="group" aria-label="Pick the next command">
            <p className="xch-term-pk x-mono" aria-hidden="true">next command</p>
            {CMDS.map(([c], i) => (
              <button key={c} type="button" className={'x-mono' + (i === at ? ' on' : '')} aria-pressed={i === at} onClick={() => pick(i)} data-sound="tick">
                <span aria-hidden="true">›</span>{c}<i aria-hidden="true">↵</i>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- capabilities: hairline rows; the row you point at (or tap) shows its own small product render ----------
   The two governance capabilities ("Wildcard site allowlists & blocklists", "Password manager guardrails") are said once,
   in the black room below, where the tester lets you try them. */
const CAPS = [
  ['Live DOM & CSS inspection', 'Select any element on staging or production to inspect computed tokens, contrast ratios, and component props, then generate the exact patch.', 'dom'],
  ['Visual QA & bug reproduction', 'Ask Hanzo in Chrome to reproduce a reported bug, capture the failing network request, and post a Canvas summary to your code channel.', 'qa'],
  ['Cross-tab synthesis', 'Compare specifications in one tab against a live deployment or pull request in another and flag every discrepancy.', 'tabs'],
  ['Direct handoff to Hanzo Bot & Team', 'Start a task in your Chrome side panel and hand long-running background execution to a cloud resident bot or Slack code channel.', 'hand'],
];
const IconLock = () => <svg viewBox="0 0 40 40" width="28" height="28" aria-hidden="true"><rect x="10" y="17" width="20" height="14" rx="3" /><path d="M14 17v-4a6 6 0 0 1 12 0v4" /></svg>;
const IconOk = () => <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M3.5 8.5l3 3 6-6.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;

// each render reuses the window's own example (Hanzo's words), cropped to the one thing the row is about
const RENDER = {
  dom: () => (
    <div className="xcr xcr-dom">
      <div className="xcr-pick">
        <span className="xcr-sel x-mono">button.cta-button</span>
        <span className="xcr-btn">Complete Order — $300/mo</span>
      </div>
      <div className="xcr-props x-mono">
        <p><span>contrast drop on .cta-button</span><i>!</i></p>
        <p className="fix"><span>WCAG AAA 8.9:1</span><i><IconOk /></i></p>
      </div>
      <p className="xcr-foot x-mono">PR &#35;418 · styles/cta-button.css</p>
    </div>
  ),
  qa: () => (
    <div className="xcr xcr-qa x-mono">
      <p className="xcr-err"><i>×</i>Detected 1 uncaught TypeError in CheckoutForm.tsx:142</p>
      <div className="xcr-req"><b>POST</b><span>/api/v1/orders</span><em>200 OK</em><span className="xcr-bar"><s /></span></div>
      <p className="xcr-to"><span className="xcr-hash">#</span>Screenshot attached to #bug-button-darkmode</p>
    </div>
  ),
  tabs: () => (
    <div className="xcr xcr-tabs">
      <div className="xcr-tab"><p className="xcr-tab-h"><i />PR &#35;418</p><p className="x-mono">styles/cta-button.css</p><p className="x-mono mark">WCAG AAA 8.9:1</p></div>
      <span className="xcr-vs x-mono" aria-hidden="true">≠</span>
      <div className="xcr-tab live"><p className="xcr-tab-h"><i />staging.acme.inc</p><span className="xcr-mini-btn">Complete Order — $300/mo</span><p className="x-mono mark">contrast drop on .cta-button</p></div>
    </div>
  ),
  hand: () => (
    <div className="xcr xcr-hand">
      <div className="xcr-panel"><span className="xcr-av">H</span><span><b>Hanzo in Chrome</b><span className="x-mono">Step 4 /4</span></span></div>
      <span className="xcr-pipe" aria-hidden="true"><s /></span>
      <p className="xcr-post"><i><IconOk /></i>Post verified patch to Hanzo Team &amp; Slack</p>
      <p className="xcr-foot x-mono">Synced live preview artifact to #bug-button-darkmode</p>
    </div>
  ),
};

function Caps() {
  const [on, setOn] = useState(0);
  const pick = (i) => () => setOn(i);
  const hover = (i) => (e) => { if (e.pointerType === 'mouse') setOn(i); };
  return (
    <section className="av-sec xch-caps-sec" aria-labelledby="xch-caps-h" data-enter="orbit-in">
      <div className="av-wrap">
        <div className="av-grid xch-caps-top">
          <h2 id="xch-caps-h" className="av-head xch-caps-l">Built for engineering, design, and operations</h2>
          <div className="xch-caps-r">
            <p className="xch-cap-k x-mono">Capabilities</p>
            <Cta to="/extension" kind="link" id="chrome.caps-extension">Explore all browser extension features</Cta>
          </div>
        </div>
        <div className="av-grid xch-caps-body">
          <ol className="xch-rows">
            {CAPS.map(([t, d], i) => (
              <li key={t} className={on === i ? 'on' : ''} onPointerEnter={hover(i)}>
                <h3 className="xch-row-h">
                  <button type="button" aria-expanded={on === i} aria-controls={'xch-cap-' + i} onClick={pick(i)} onFocus={pick(i)}>
                    <span className="xch-row-n x-mono av-num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="xch-row-t">{t}</span>
                    <svg className="xch-row-a" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </button>
                </h3>
                <div className="xch-row-d" id={'xch-cap-' + i}><p>{d}</p></div>
              </li>
            ))}
          </ol>
          <div className="xch-render" aria-hidden="true">
            {CAPS.map(([t, , g], i) => <div key={t} className="xch-render-f" data-on={on === i ? '' : undefined}>{RENDER[g]()}</div>)}
            <p className="xch-render-k x-mono"><span className="av-num">{String(on + 1).padStart(2, '0')}</span> / 04</p>
          </div>
        </div>
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
  return (
    <section className="av-sec xch-pol av-dark" data-room="dark" aria-labelledby="xch-pol-h" data-enter="scroll-tilt">
      <div className="av-wrap av-grid">
        <div className="xch-pol-l">
          <h2 id="xch-pol-h" className="av-head">Wildcard site allowlists &amp; blocklists</h2>
          <p className="av-body">Configure Allow All Sites with sensitive exclusions or Block All Sites with approved internal domains in Organization Settings.</p>
          <div className="xch-pm">
            <IconLock />
            <div>
              <h3 className="av-title">Password manager guardrails</h3>
              <p className="av-body">Keep credential vaults isolated by default; organization admins explicitly control whether agents can interact with password managers.</p>
            </div>
          </div>
        </div>
        <div className="xch-tester">
          <div className="xch-mode" role="radiogroup" aria-label="Policy">
            {[['list', 'Allowlist'], ['all', 'Allow all sites']].map(([k, l]) => (
              <button key={k} type="button" role="radio" aria-checked={mode === k} onClick={() => setMode(k)} data-sound="tick">
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
          {/* pick or type an address; the verdict sits right under the field, so the answer is always in view */}
          <div className="xch-try">{TRY.map((t) => <button key={t} type="button" className={'x-mono' + (v === t ? ' on' : '')} onClick={() => setV(t)} data-sound="tick">{t}</button>)}</div>
          <label className="xch-field">
            <span className="x-sr">An address to test</span>
            <span className="xch-https x-mono" aria-hidden="true">https://</span>
            <input value={v} onChange={(e) => setV(e.target.value)} spellCheck="false" autoComplete="off" className="x-mono" />
          </label>
          <p className="xch-mirror x-mono" aria-hidden="true"><Marked v={v} res={mode === 'list' ? res : null} /></p>
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
    </section>
  );
}

/* ---------- connected surfaces: where a finding goes next ---------- */
const SURF = [
  ['Hanzo in Chrome', 'Interactive side-panel agent inside Chrome, Brave, Edge, and Arc with enterprise site governance.'],
  ['Hanzo Team (hanzo.team)', 'Full workspace with Code Channels, Canvas artifacts, boards, docs, and AI teammates.'],
  ['Hanzo Tag for Slack (/slack)', 'Bring @Hanzo and Code Channels directly into your existing Slack channels and threads.'],
  ['Hanzo Bot (hanzo.bot)', 'Autonomous resident teammates with their own sandboxed computer, browser, terminal, and schedule.'],
];

// the small card each product shows while the handoff rests on it (Hanzo's words from the window and the four lines)
const HAND = [
  () => (
    <div className="xcr xcr-hand">
      <div className="xcr-panel"><span className="xcr-av">H</span><span><b>Hanzo in Chrome</b><span className="x-mono">Side-panel browser agent · Enso Ultra</span></span></div>
      <p className="xcr-post"><i><IconOk /></i>Post verified patch to Hanzo Team &amp; Slack</p>
      <p className="xcr-foot x-mono">Chrome · Brave · Edge · Arc</p>
    </div>
  ),
  () => (
    <div className="xcr xcr-team">
      <div className="xcr-side x-mono"><span>Code Channels</span><b>#bug-button-darkmode</b><span>Canvas</span></div>
      <div className="xcr-msg"><p className="x-mono">PR &#35;418 · styles/cta-button.css</p><p>Synced live preview artifact to #bug-button-darkmode</p></div>
    </div>
  ),
  () => (
    <div className="xcr xcr-slack">
      <p className="xcr-chan x-mono">#bug-button-darkmode</p>
      <div className="xcr-msg"><span className="xcr-av">H</span><p><b>@Hanzo</b> Screenshot attached to #bug-button-darkmode</p></div>
      <p className="xcr-foot x-mono">channels and threads</p>
    </div>
  ),
  () => (
    <div className="xcr xcr-bot">
      <p className="xcr-chan x-mono"><i />hanzo.bot</p>
      <div className="xcr-kit x-mono">{['computer', 'browser', 'terminal', 'schedule'].map((t, i) => <span key={t} style={{ '--i': i }}>{t}</span>)}</div>
      <p className="xcr-foot x-mono">sandboxed</p>
    </div>
  ),
];

function Surfaces() {
  const rail = useRef(null);
  const [auto, setAuto] = useState(0);
  const [pick, setPick] = useState(-1);
  // the handoff walks Chrome → Team → Slack → Bot by itself once the strip is in view (time, not scroll), then rests on
  // Bot; pointing at, focusing or tapping a product jumps to it
  const seen = useInView(rail, { amount: 0.4, once: true });
  const calm = useReducedMotion();
  useEffect(() => {
    if (!seen || calm || auto >= 3) return;
    const t = setTimeout(() => setAuto((a) => a + 1), 1800);
    return () => clearTimeout(t);
  }, [seen, calm, auto]);
  const on = pick >= 0 ? pick : auto;
  const choose = (i) => () => setPick(i);
  const hover = (i) => (e) => { if (e.pointerType === 'mouse') setPick(i); };
  return (
    <section className="av-sec xch-surf" aria-labelledby="xch-surf-h" data-enter="cover-slide">
      <div className="av-wrap">
        <div className="av-grid xch-surf-top">
          <h2 id="xch-surf-h" className="av-head xch-surf-l">One agent family across browser, Slack, workspace, and cloud</h2>
          <div className="xch-surf-r">
            <p className="xch-cap-k x-mono">Connected surfaces</p>
            <Cta to="/slack" kind="link" id="chrome.surf-slack">See Hanzo Tag for Slack</Cta>
          </div>
        </div>
        <div className="xch-hand-wrap" ref={rail} style={{ '--k': on }} onPointerLeave={() => setPick(-1)}>
          <div className="xch-stops">
            <span className="xch-rail" aria-hidden="true"><s /></span>
            <ol>
              {SURF.map(([t], i) => (
                <li key={t} className={(i < on ? 'past' : '') + (i === on ? ' on' : '')} onPointerEnter={hover(i)}>
                  <h3 className="xch-stop-h">
                    <button type="button" aria-pressed={i === on} aria-controls={'xch-surf-' + i} onClick={choose(i)} onFocus={choose(i)}>
                      <span className="xch-stop-dot" aria-hidden="true" />
                      <span className="xch-surf-n x-mono av-num">{String(i + 1).padStart(2, '0')}</span>
                      <span className="xch-stop-t">{t}</span>
                    </button>
                  </h3>
                </li>
              ))}
            </ol>
          </div>
          <div className="av-grid xch-hand">
            <div className="xch-hand-d">
              {SURF.map(([t, d], i) => <p key={t} id={'xch-surf-' + i} className="av-lede" data-on={i === on ? '' : undefined}>{d}</p>)}
            </div>
            <div className="xch-hand-r" aria-hidden="true">
              {HAND.map((R, i) => <div key={i} className="xch-render-f" data-on={i === on ? '' : undefined}><R /></div>)}
            </div>
          </div>
        </div>
        <div className="xch-next">
          <div className="xch-next-row">
            <div className="xch-next-l">
              <h3 className="av-title">Looking for Firefox, Safari, or local IDE DevTools bridges?</h3>
              <p className="av-body">Hanzo Extension supports Chrome, Brave, Edge, Firefox, and Safari with native WebSocket &amp; ZAP binary protocol bridges into VS Code and JetBrains.</p>
            </div>
            <div className="xch-next-r">
              <div className="xch-more-links">
                {[['/extension', 'All Browser Extensions', 'extension'], ['/slack', 'Hanzo Tag for Slack', 'slack'], ['/tag', 'Hanzo Tag Governance', 'tag'], ['/bot', 'Hanzo Bot', 'bot']].map(([to, l, k]) => (
                  <A key={to} to={to} className="xch-pill" data-cta={'chrome.more-' + k}><span>{l}</span><span className="xch-pill-to x-mono" aria-hidden="true">{to}</span></A>
                ))}
              </div>
              <p className="xch-get-line"><span>Get Hanzo in Chrome</span><span aria-hidden="true">·</span><Cta to="https://platform.hanzo.ai/deploy" kind="link" id="chrome.get-deploy">Deploy to Cloud</Cta></p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- the one ending: a quiet room with the ask ---------- */
function Close() {
  return (
    <section className="x-band xch-close" aria-labelledby="xch-close-h" data-enter="pull-back">
      <div className="av-wrap av-grid xch-close-in">
        <div className="xch-close-l">
          <h2 id="xch-close-h" className="av-display m"><span>Put Hanzo in every tab</span> <span>your team works in.</span></h2>
          {/* the page ends on its product: the tester's verdict, resting in a small Chrome frame */}
          <div className="xch-rest" aria-hidden="true">
            <div className="xch-rest-bar x-mono"><span className="xch-lights"><i /><i /><i /></span><span className="xch-rest-url">staging.acme.inc/checkout</span><span className="xch-rest-cdp"><i />CDP attached</span></div>
            <div className="xch-rest-v">
              <i>✓</i>
              <span><b>Allowed</b><span className="x-mono">matches *.acme.inc · * = staging</span></span>
            </div>
          </div>
        </div>
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

/* ---------- the five entrances: each main section arrives its own way, once, when it first comes into view ----------
   The final state is the server HTML; the start state applies only under html.js until `data-in` is set, and never under
   reduced motion (CSS). scroll-tilt also leans the black room with the scroll's speed (max 5°) and levels out. */
function useEntrances() {
  useEffect(() => {
    const els = [...document.querySelectorAll('.xch [data-enter]')];
    if (!('IntersectionObserver' in window)) { els.forEach((el) => { el.dataset.in = ''; }); return undefined; }
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.dataset.in = ''; io.unobserve(e.target); } }), { threshold: 0.12 });
    els.forEach((el) => io.observe(el));
    const room = document.querySelector('.xch [data-enter="scroll-tilt"] > .av-wrap');
    let last = scrollY, lastT = performance.now(), rest = 0;
    const onScroll = () => {
      if (!room || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const r = room.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) { last = scrollY; return; }
      const now = performance.now();
      const v = (scrollY - last) / Math.max(16, now - lastT); // px per ms
      last = scrollY; lastT = now;
      room.style.setProperty('--lean', Math.max(-5, Math.min(5, v * 4)).toFixed(2) + 'deg');
      clearTimeout(rest); rest = setTimeout(() => room.style.setProperty('--lean', '0deg'), 120);
    };
    addEventListener('scroll', onScroll, { passive: true });
    return () => { io.disconnect(); removeEventListener('scroll', onScroll); clearTimeout(rest); };
  }, []);
}

export default function ChromePage() {
  useEntrances();
  return (
    <main className="av xch" style={{ '--ac': '#737373' }}>
      <Hero />
      <Terminal />
      <Facts />
      <Policy />
      <Caps />
      <Surfaces />
      <Paste />
      <Close />
    </main>
  );
}
