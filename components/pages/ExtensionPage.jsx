'use client';
/* Extension. Signature: a browser frame with the extension's side panel sliding in over the page; it walks the five things
   Hanzo says about it (your session, no port, connected means registered, three browsers, addressable tabs), slides away
   and comes back. Below, the path from a tab to the fabric with a request travelling it, and the uses as browser tabs.
   Beyond: the page reads which browser you are in and puts that build first, so the right download is the first button.
   Every word and link is Hanzo's; the page inside the frame is Hanzo's own picture, not an invented site. */
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { EASE, Mark } from '../ui';
import { A, Go, SecHead } from '../kit';
import './ExtensionPage.css';

const POINTS = [
  ['It uses your session', 'The agent drives the browser you are already signed into, so a page behind a login is a page it can read. Nothing has to be scraped from the outside.'],
  ['No port to open', 'The extension talks to the local Hanzo daemon through a native messaging host over a Unix socket. There is no WebSocket, no localhost port, and nothing else on the machine can dial in.'],
  ['Connected means registered', 'It only reports itself connected once the daemon lists it as a provider. An open pipe to a wedged process is the failure this replaced, and it is checked on every tick.'],
  ['Three browsers, one behaviour', 'Chrome, Firefox and Safari builds come out of the same source. The evaluate rule is shared, so the same snippet from a caller behaves identically in all three.'],
  ['Tabs are addressable', "Each browser registers separately, so listing tabs asks the browser that is active — and naming a tab id from another browser's list is how you reach the other one."],
];
const MORE = [
  ['The rest of your tools, too', 'The same repo carries connectors for the software your work already lives in — documents, tickets, design files, mail, calendars — so an agent reaches them the same way it reaches a tab.'],
  ['Read a page as text', "It hands back page content, console messages and network requests, which is what makes it useful for checking your own site rather than just browsing someone else's."],
  ['Installs from a file', 'Load it unpacked in Chrome or as a temporary add-on in Firefox while you are working on it. The build produces all three targets in one command.'],
];

/* The browser: the panel slides in, turns through the five points, slides out, and comes back. */
function Browser() {
  const [at, setAt] = useState(0);
  const [open, setOpen] = useState(true);
  const [mine, setMine] = useState(false);
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.35 });
  const calm = useReducedMotion();
  useEffect(() => {
    if (mine || calm || !seen) return;
    const t = setTimeout(() => {
      if (!open) { setAt(0); setOpen(true); }
      else if (at < POINTS.length - 1) setAt(at + 1);
      else setOpen(false);
    }, open ? 3200 : 1300);
    return () => clearTimeout(t);
  }, [at, open, mine, calm, seen]);
  const go = (i) => { setAt(i); setOpen(true); setMine(true); };
  return (
    <div className="xex-browser" ref={box}>
      <div className="xex-chrome">
        <span className="xex-lights" aria-hidden="true"><i /><i /><i /></span>
        <span className="xex-url x-mono">hanzo.ai/extension</span>
        <button type="button" className={'xex-ext' + (open ? ' on' : '')} aria-pressed={open} aria-label="Hanzo Extension side panel" onClick={() => { setOpen(!open); setMine(true); }}>
          <Mark size={14} />
        </button>
      </div>
      <div className="xex-view">
        <img className="xex-page" src="/models/uta.webp" alt="" />
        <span className="xex-probe" aria-hidden="true" />
        <motion.aside className="xex-panel" inert={!open} initial={false} animate={{ x: open ? '0%' : '104%' }} transition={{ type: 'spring', stiffness: 220, damping: 30 }} aria-label="Hanzo Extension">
          <div className="xex-panel-top">
            <span className="xex-dot" aria-hidden="true" />
            <span>Hanzo Extension</span>
            <span className="x-mono">{String(at + 1).padStart(2, '0')} / 05</span>
          </div>
          <p className="xex-avail x-mono">Chrome · Firefox · Safari</p>
          <div className="xex-cards">
            {POINTS.map(([t, d], i) => (
              <motion.div key={t} className="xex-card" initial={false} animate={i === at ? { opacity: 1, y: 0 } : { opacity: 0, y: i < at ? -14 : 14 }} transition={{ duration: 0.45, ease: EASE }} aria-hidden={i !== at}>
                <h2>{t}</h2>
                <p>{d}</p>
              </motion.div>
            ))}
          </div>
          <div className="xex-tabs" role="tablist" aria-label="What the extension does">
            {POINTS.map(([t], i) => (
              <button key={t} type="button" role="tab" aria-selected={i === at} onClick={() => go(i)}><span>{t}</span></button>
            ))}
          </div>
        </motion.aside>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="xex-hero" aria-labelledby="xex-h1">
      <div className="x-wrap xex-hero-grid">
        <div>
          <motion.p className="x-kick" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>Browser extension</motion.p>
          <h1 id="xex-h1" className="xex-h1"><span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.05 }}>Hanzo Extension</motion.span></span></h1>
          <motion.p className="xex-lede" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}>Your browser, as a tool an agent can use.</motion.p>
          <motion.div className="xex-acts" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.45 }}>
            <Go to="https://docs.hanzo.ai/docs/apps/browser" solid>Availability</Go>
            <Go to="https://chat.hanzo.ai">Use Hanzo Chat</Go>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.2, ease: EASE, delay: 0.25 }}>
          <Browser />
        </motion.div>
      </div>
    </section>
  );
}

const HOPS = ['A tab', 'Extension', 'Native messaging host', 'Unix socket', 'Local Hanzo daemon', 'The fabric'];

function How() {
  return (
    <section className="x-sec xex-how" data-room="dark">
      <div className="x-wrap">
        <SecHead dark title="How it works" lede="The extension registers as a provider on the local fabric. Whatever can reach the fabric can then reach a tab." />
        <div className="xex-path" aria-hidden="true">
          {HOPS.map((h, i) => (
            <span key={h} className="xex-hop" style={{ '--i': i }}><b>{h}</b>{i < HOPS.length - 1 && <i><em /></i>}</span>
          ))}
        </div>
        <div className="xex-how-grid">
          {[...POINTS, ...MORE].map(([t, d], i) => (
            <div key={t} className="xex-how-i">
              <span className="xex-how-n x-mono">{String(i + 1).padStart(2, '0')}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const BUILDS = [
  ['chrome', 'Chrome', 'Full integration with Google Chrome browser with tabs context and sidebar assistance.', 'Download for Chrome'],
  ['firefox', 'Firefox', 'Fully compatible with Mozilla Firefox for privacy-conscious users and developers.', 'Download for Firefox'],
  ['edge', 'Edge', 'Enhanced experience on Microsoft Edge with optimized performance and memory profile.', 'Download for Edge'],
  ['other', 'Safari & Others', 'Safari, Brave, Opera, Arc, and other Chromium-based browsers are also fully supported.', 'All Extension Builds'],
];
const REL = 'https://github.com/hanzoai/extension/releases/latest';
// which build card is yours: read from the browser itself, in the browser only
export function which(ua, brave) {
  if (/Edg\//.test(ua)) return 'edge';
  if (/Firefox\//.test(ua)) return 'firefox';
  if (brave || /OPR\//.test(ua)) return 'other';
  if (/Chrome\//.test(ua)) return 'chrome';
  if (/Safari\//.test(ua)) return 'other';
  return null;
}
const NAME = { chrome: 'Chrome', firefox: 'Firefox', edge: 'Edge', other: null };

function Builds() {
  const [mine, setMine] = useState(null);
  useEffect(() => { setMine(which(navigator.userAgent, !!navigator.brave)); }, []);
  const order = mine ? [...BUILDS].sort((a, b) => (b[0] === mine) - (a[0] === mine)) : BUILDS;
  return (
    <section className="x-sec xex-builds" id="browsers">
      <div className="x-wrap">
        <SecHead title="Built for every major browser" lede="Direct extension builds available for Chrome, Firefox, Safari, and Edge. Install in seconds to bring Hanzo agents into your everyday browsing." />
        <ul className="xex-build-grid">
          {order.map(([k, t, d, cta]) => (
            <motion.li key={k} layout transition={{ type: 'spring', stiffness: 300, damping: 32 }} className={k === mine ? 'yours' : ''}>
              <div className="xex-build">
                {k === mine && <span className="xex-yours x-mono">{NAME[k] ? `You are on ${NAME[k]}` : 'Your browser'}</span>}
                <span className={'xex-logo ' + k} aria-hidden="true" />
                <h3>{t}</h3>
                <p>{d}</p>
                <A to={REL} className={'x-btn' + (k === mine ? ' solid' : '')} {...(k === mine ? { 'data-thumb': cta } : {})}>{cta}</A>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const USES = [
  ['Check the change you just made', 'An agent that edited a page can open it, look at what rendered, and read the console — instead of telling you it thinks the fix worked.'],
  ['Behind a login', 'An internal dashboard, a vendor console, an admin panel. It runs in the session you already have, so there is no service account to provision for a one-off task.'],
  ['Debug the request, not the guess', 'Network requests and console messages come back as data. When a page misbehaves, the agent can read what the browser saw.'],
  ['The long boring form', 'Multi-step flows that exist only in a UI and have no API behind them. It fills them in and tells you where it got stuck.'],
];

/* The uses as browser tabs: one is open at a time, and they turn by themselves until you pick one. */
function Uses() {
  const [at, setAt] = useState(0);
  const [mine, setMine] = useState(false);
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.4 });
  const calm = useReducedMotion();
  useEffect(() => {
    if (mine || calm || !seen) return;
    const t = setTimeout(() => setAt((a) => (a + 1) % USES.length), 3800);
    return () => clearTimeout(t);
  }, [at, mine, calm, seen]);
  return (
    <section className="x-sec xex-uses" ref={box}>
      <div className="x-wrap">
        <SecHead kicker="What you would use it for" title="Mostly the work that only exists inside a browser window" />
        <div className="xex-win">
          <div className="xex-strip" role="tablist" aria-label="Uses">
            {USES.map(([t], i) => (
              <button key={t} type="button" role="tab" id={'xex-u' + i} aria-controls={'xex-up' + i} aria-selected={i === at} onClick={() => { setAt(i); setMine(true); }}>
                {i === at && <motion.span layoutId="xex-tab" className="xex-tab-bg" transition={{ type: 'spring', stiffness: 420, damping: 36 }} />}
                <span className="xex-fav" aria-hidden="true" /><span className="xex-tt">{t}</span>
              </button>
            ))}
          </div>
          <div className="xex-body">
            {USES.map(([t, d], i) => (
              <motion.div key={t} id={'xex-up' + i} role="tabpanel" aria-labelledby={'xex-u' + i} className="xex-use" initial={false}
                animate={i === at ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }} transition={{ duration: 0.5, ease: EASE }} aria-hidden={i !== at}>
                <h3>{t}</h3>
                <p>{d}</p>
              </motion.div>
            ))}
            <span className="xex-load" aria-hidden="true"><motion.b key={at} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: mine || calm ? 0.4 : 3.8, ease: 'linear' }} /></span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Get() {
  return (
    <section className="x-sec xex-get">
      <div className="x-wrap">
        <div className="xex-cta">
          <h2>Get the Hanzo Extension</h2>
          <p>Available for Chrome, Firefox, Safari, and Edge. Or use Hanzo Chat directly in any browser.</p>
          <div className="xex-acts">
            <Go to={REL} solid>Download Extension</Go>
            <Go to="/chat">Open Hanzo Chat</Go>
          </div>
          <span className="xex-cta-glow" aria-hidden="true" />
        </div>
        <div className="xex-foot">
          <div className="xex-start">
            <h2>Get started with Extension</h2>
            <A to="https://docs.hanzo.ai/docs/apps/browser" className="xex-arrow">Read the docs →</A>
          </div>
          <div className="xex-card2">
            <div>
              <h2>Get Extension</h2>
              <p>Browser extension + MCP bridge</p>
            </div>
            <dl className="xex-meta">
              <div><dt>License:</dt><dd>Apache-2.0</dd></div>
              <div><dt>Source</dt><dd><A to="https://github.com/hanzoai">hanzoai</A></dd></div>
            </dl>
            <Go to="https://platform.hanzo.ai/deploy" solid>Deploy to Cloud</Go>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ExtensionPage() {
  return (
    <main className="xex">
      <Hero />
      <How />
      <Builds />
      <Uses />
      <Get />
    </main>
  );
}
