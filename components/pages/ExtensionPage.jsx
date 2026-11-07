'use client';
// Signature: Three browser windows fanned like a hand of cards (neutral Chrome, Firefox and Safari chrome); the one you are using is brought to the front, and the Hanzo side panel slides in over a real page and walks its five points, the stack shuffling under it on "one behaviour"
// Beyond: The page reads which browser you are in, deals that window to the front of the hero and puts that build first in the list, so your download is the first button
// Persona: someone who wants an agent to use the browser they are already signed into
// Goal: see the side panel at work on a real page in the first screen, then download the build for this browser
// CTA: "Download Extension" (github.com/hanzoai/extension/releases/latest): the hero's one solid with data-thumb, repeated by the closing band
// Metric: extension_download (data-cta extension-download, extension-download-end)
/* Hanzo Extension (Launch: the side panel leads).
   V2: 8/10 round 3 (critic 6/10 fixes): every section below the fold now has an object that answers: use tabs each run a small browser render (console, sign-in to dashboard, requests, a form filling), numbered tabs that wrap on phone; the browser list swaps a window with its build size; connector chips and the six hops answer hover/tap with the hop's own sentence; zip tiles became hairline file rows (and a file list beside Get Extension); the hero stack arrives as one piece after the h1 with its ring inside the window; tighter black room and use-case spacing
   Motion: signature = the stack and its panel (a step loop that stops off screen). Supporting: pinned chapters with
   wipes (components/v2/AppScenes), the request travelling the path, line-masked headlines.
   Greys only; every word and link is Hanzo's; the pages inside the windows are Hanzo's own pictures. */
import { useEffect, useRef, useState } from 'react';
import { motion, animate, useInView, useMotionValue, useReducedMotion } from 'motion/react';
import { Mark } from '../ui';
import { A, Cta, Img } from '../kit';
import { play } from '../../lib/sound';
import Lines from '../v2/x-edison/AppLines';
import Scenes from '../v2/AppScenes';
import Sheet from '../v2/AppSheet';
import '../v2/AppType.css';
import './ExtensionPage.css';

const DOCS = 'https://docs.hanzo.ai/docs/apps/browser';
const REL = 'https://github.com/hanzoai/extension/releases/latest';
const GLIDE = { duration: 0.3, ease: [0.16, 1, 0.3, 1] };
const DEAL = { duration: 0.5, ease: [0.4, 0, 0.2, 1] };
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

// which build card is yours: read from the browser itself, in the browser only
export function which(ua, brave) {
  if (/Edg\//.test(ua)) return 'edge';
  if (/Firefox\//.test(ua)) return 'firefox';
  if (brave || /OPR\//.test(ua)) return 'other';
  if (/Chrome\//.test(ua)) return 'chrome';
  if (/Safari\//.test(ua)) return 'other';
  return null;
}
// which window of the stack is yours (Edge, Brave and Opera draw like Chrome)
const stackOf = (ua) => (/Firefox\//.test(ua) ? 'firefox' : /Safari\//.test(ua) && !/Chrome\/|Chromium|Edg\//.test(ua) ? 'safari' : 'chrome');
function useBrowser() {
  const [b, setB] = useState({ build: null, win: 'chrome' });
  useEffect(() => { const ua = navigator.userAgent; setB({ build: which(ua, !!navigator.brave), win: stackOf(ua) }); }, []);
  return b;
}

/* the download leaves for GitHub: a short pressed state (300 ms), cleared again when the visitor comes back to this tab */
function useBrief() {
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    const clear = () => setBusy(false);
    addEventListener('pageshow', clear);
    document.addEventListener('visibilitychange', clear);
    return () => { removeEventListener('pageshow', clear); document.removeEventListener('visibilitychange', clear); };
  }, []);
  useEffect(() => { if (!busy) return; const t = setTimeout(() => setBusy(false), 300); return () => clearTimeout(t); }, [busy]);
  return { 'aria-busy': busy || undefined, onClick: () => setBusy(true) };
}

/* ---------- the hero: three windows, yours in front, the panel over its page ---------- */
const WINS = [['chrome', 'Chrome'], ['firefox', 'Firefox'], ['safari', 'Safari']];
const SLOTS = [ // front, back left, back right
  { x: '0%', y: '0%', rotate: 0, scale: 1, zIndex: 3 },
  { x: '-10%', y: '-5%', rotate: -5, scale: 0.9, zIndex: 1 },
  { x: '12%', y: '-11%', rotate: 5, scale: 0.88, zIndex: 2 },
];

function Chrome({ k, open, toggle, front }) {
  // only the window in front has a live button; the ones behind draw the same icon
  const ext = front
    ? <button type="button" className={'xe-ext' + (open ? ' on' : '')} aria-pressed={open} aria-label="Hanzo Extension side panel" onClick={toggle}><span><Mark size={13} /></span></button>
    : <span className="xe-ext" aria-hidden="true"><span><Mark size={13} /></span></span>;
  const url = <span className="xe-url x-mono">hanzo.ai/extension</span>;
  const nav = <span className="xe-nav" aria-hidden="true"><i /><i /><i /></span>;
  if (k === 'safari') return (
    <div className="xe-bar s-safari">
      <span className="xe-dots" aria-hidden="true"><i /><i /><i /></span>
      <span className="xe-side" aria-hidden="true" />
      {nav}
      {url}
      {ext}
    </div>
  );
  return (
    <div className={'xe-bar s-' + k}>
      <div className="xe-strip" aria-hidden="true">
        <span className="xe-dots"><i /><i /><i /></span>
        <span className="xe-tab"><Mark size={10} /><span>Hanzo Extension</span></span>
        <span className="xe-tab dim"><span>Hanzo Chat</span></span>
      </div>
      <div className="xe-tool">{nav}{k === 'firefox' && <span className="xe-shield" aria-hidden="true" />}{url}<span className="xe-puz" aria-hidden="true" />{ext}</div>
    </div>
  );
}

function Stack({ mineWin }) {
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.3 });
  const calm = useReducedMotion();
  const [front, setFront] = useState('chrome');
  const [open, setOpen] = useState(true);
  const [at, setAt] = useState(0);
  const [mine, setMine] = useState(false);
  const [held, setHeld] = useState(false);
  const walked = useRef(false);
  useEffect(() => { setFront(mineWin); }, [mineWin]);
  // the walk: five points, three browsers shuffle under "one behaviour", then the panel steps away and comes back
  useEffect(() => {
    if (mine || held || calm || !seen) return;
    let t;
    if (!open) t = setTimeout(() => { setAt(0); setOpen(true); }, 1400);
    else if (at === 3) {
      const order = [mineWin, ...WINS.map((w) => w[0]).filter((w) => w !== mineWin)];
      let n = 0;
      const step = () => { n++; setFront(order[n % 3]); if (n < 3) t = setTimeout(step, 1100); else t = setTimeout(() => setAt(4), 900); };
      t = setTimeout(step, 1000);
    } else t = setTimeout(() => { if (at < POINTS.length - 1) setAt(at + 1); else { setOpen(false); if (!walked.current) { walked.current = true; play('done'); } } }, 3600); // the walk ends: a faint chime, the first time only
    return () => clearTimeout(t);
  }, [at, open, mine, held, calm, seen, mineWin]);
  const order = [front, ...WINS.map((w) => w[0]).filter((w) => w !== front)];
  const pick = (i) => { setAt(i); setOpen(true); setMine(true); };
  const deal = (k) => { setFront(k); setMine(true); };
  const moving = open && !mine && !held && seen && !calm;
  // a 2.5° tilt toward a fine pointer (mouse or pen), flat again on leave; none on touch or under reduced motion
  const rx = useMotionValue(0), ry = useMotionValue(0);
  const tilt = (e) => {
    if (calm || e.pointerType === 'touch') return;
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 5);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 5);
  };
  const flat = () => { animate(rx, 0, GLIDE); animate(ry, 0, GLIDE); };
  return (
    <div className="xe-stage">
      <div className="xe-deal">
        <button type="button" className="xe-pause" aria-pressed={held} aria-label={held ? 'Play' : 'Pause'} onClick={() => { setHeld((h) => !h); setOpen(true); setFront(mineWin); }}>
          {held
            ? <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M5 3.5v9l7-4.5z" fill="currentColor" /></svg>
            : <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M5 3.5v9M11 3.5v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>}
        </button>
        <div className="xe-deal-tabs" role="tablist" aria-label="Browser">
          {WINS.map(([k, n]) => (
            <button key={k} type="button" role="tab" aria-selected={front === k} onClick={() => deal(k)}>
              {front === k && <motion.span layoutId="xe-deal" className="xe-deal-bg" transition={GLIDE} />}
              <span className="xe-deal-n">{n}</span>
              {mineWin === k && <i className="xe-mine" aria-hidden="true" />}
            </button>
          ))}
        </div>
      </div>
      <motion.div className="xe-tilt" style={{ rotateX: rx, rotateY: ry, transformPerspective: 1400 }} onPointerMove={tilt} onPointerLeave={flat}>
      <div className={'xe-stack f-' + front} ref={box} data-morph-target="">
        {WINS.map(([k], wi) => {
          const slot = SLOTS[order.indexOf(k)];
          const isFront = k === front;
          return (
            <motion.div key={k} className={'xe-win w-' + k + (isFront ? ' front' : '')} initial={calm ? false : { x: '0%', y: '6%', rotate: 0, scale: 0.94 }}
              animate={{ ...slot, opacity: 1 }} transition={{ ...DEAL, opacity: { duration: 0.4 } }} style={{ zIndex: slot.zIndex }} aria-hidden={!isFront}>
              <Chrome k={k} open={open} front={isFront} toggle={() => { setOpen(!open); setMine(true); }} />
              <div className="xe-view">
                <div className="xe-page">
                  <span className="xe-page-nav" aria-hidden="true"><Mark size={12} /><b>Hanzo</b></span>
                  <Img src={'/models/' + ['koma', 'zen', 'uta'][wi] + '.webp'} w={1200} h={1500} alt="" priority={isFront && wi === 0} />
                  <span className="xe-page-t" aria-hidden="true"><b>Hanzo Extension</b><span>Your browser, as a tool an agent can use.</span></span>
                </div>
                <span className="xe-probe" aria-hidden="true" />
              </div>
            </motion.div>
          );
        })}
        <div className="xe-pclip">
          <motion.aside className="xe-panel" inert={!open} initial={false} animate={{ x: open ? '0%' : '106%' }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} aria-label="Hanzo Extension">
            <div className="xe-p-top">
              <span className="xe-p-dot" aria-hidden="true" />
              <span className="xe-p-name">Hanzo Extension</span>
              <span className="x-mono av-num xe-p-n">{String(at + 1).padStart(2, '0')} / 05</span>
            </div>
            <p className="xe-avail x-mono">Chrome · Firefox · Safari</p>
            <div className="xe-cards">
              {POINTS.map(([t, d], i) => (
                <div key={t} className={'xe-card' + (i === at ? ' on' : i < at ? ' past' : '')} aria-hidden={i !== at}>
                  <h2 className="xe-card-t">{t}</h2>
                  <p>{d}</p>
                </div>
              ))}
            </div>
            <div className="xe-steps" role="tablist" aria-label="What the extension does">
              {POINTS.map(([t], i) => (
                <button key={t} type="button" role="tab" aria-selected={i === at} aria-label={t} onClick={() => pick(i)}>
                  <span className="x-mono av-num">{String(i + 1).padStart(2, '0')}</span>
                  <i>{i === at && moving && <b key={'p' + at} style={{ animationDuration: at === 3 ? '4.2s' : '3.6s' }} />}</i>
                </button>
              ))}
            </div>
          </motion.aside>
        </div>
      </div>
      </motion.div>
    </div>
  );
}

function Hero({ mineWin }) {
  const brief = useBrief();
  return (
    <section className="xe-hero" aria-labelledby="xe-h1">
      <div className="av-wrap av-grid xe-hero-g">
        <div className="xe-hero-l">
          <Lines as="h1" id="xe-h1" className="av-display xe-h1" lines={['Hanzo Extension']} now delay={0.05} />
          <p className="av-lede">Your browser, as a tool an agent can use.</p>
          <div className="xe-acts">
            <Cta to={REL} id="extension-download" thumb size="lg" {...brief}>Download Extension</Cta>
            <div className="xe-links">
              <Cta to={DOCS} id="extension-availability" kind="link">Availability</Cta>
              <Cta to="https://chat.hanzo.ai" id="extension-chat" kind="link">Use Hanzo Chat</Cta>
            </div>
          </div>
        </div>
        <div className="xe-hero-r"><Stack mineWin={mineWin} /></div>
      </div>
    </section>
  );
}

/* ---------- the black room: a request travels from the fabric to a tab ---------- */
const HOPS = ['A tab', 'Extension', 'Native messaging host', 'Unix socket', 'Local Hanzo daemon', 'The fabric'];

// one sentence per stop, each its own (Hanzo's words, split where one sentence covers two stops)
const [NMH, PORT] = POINTS[1][1].split(/(?<=socket\.) /);
const HOP_SAY = [POINTS[4][1], POINTS[0][1], NMH, PORT, POINTS[2][1], 'The extension registers as a provider on the local fabric. Whatever can reach the fabric can then reach a tab.'];
function How() {
  const [hot, setHot] = useState(3);
  return (
    <section className="av-sec av-dark xe-how" data-room="dark" aria-labelledby="xe-how-h">
      <div className="av-wrap">
        <div className="av-grid xe-how-top">
          <Lines as="h2" id="xe-how-h" className="av-display s xe-how-h" lines={['How it works']} />
          <p className="av-lede xe-how-l">The extension registers as a provider on the local fabric. Whatever can reach the fabric can then reach a tab.</p>
        </div>
        <ol className="xe-path" aria-label="From a tab to the fabric">
          {HOPS.map((h, i) => (
            <li key={h} style={{ '--i': i }} className={(i === 0 ? 'end tab' : i === HOPS.length - 1 ? 'end fab' : '') + (i === hot ? ' hot' : i < hot ? ' past' : ' ahead')}>
              <button type="button" aria-pressed={i === hot} onPointerEnter={(e) => e.pointerType === 'mouse' && setHot(i)} onFocus={() => setHot(i)} onClick={() => { setHot(i); play('tick'); }}>
                <span className="x-mono av-num">{String(i + 1).padStart(2, '0')}</span>
                <b>{h}</b>
              </button>
            </li>
          ))}
          <span className="xe-track" aria-hidden="true"><span className="xe-run"><i /></span></span>
        </ol>
        <p className="xe-hop-say" aria-live="polite"><span className="x-mono av-num">{String(hot + 1).padStart(2, '0')}</span><span key={hot}>{HOP_SAY[hot]}</span></p>
      </div>
    </section>
  );
}

/* ---------- three pinned chapters ---------- */
function Tools({ on }) {
  const sats = ['documents', 'tickets', 'design files', 'mail', 'calendars', 'A tab'];
  const [hot, setHot] = useState(-1);
  return (
    <div className={'xe-vis xe-tools' + (on ? ' on' : '') + (hot >= 0 ? ' has-hot' : '')} aria-hidden="true" onPointerLeave={(e) => e.pointerType === 'mouse' && setHot(-1)}>
      <span className="xe-hub"><Mark size={22} /></span>
      {sats.map((s, i) => (
        <span key={s} className={'xe-sat' + (s === 'A tab' ? ' tab' : '') + (i === hot ? ' hot' : '')} style={{ '--a': i * 60 - 90 + 'deg', '--i': i }}>
          <i className="xe-spoke">{i === hot && <em key={'r' + i} className="xe-pulse" />}</i>
          <b onPointerEnter={(e) => e.pointerType === 'mouse' && setHot(i)} onClick={() => setHot(i)}>{s}</b>
        </span>
      ))}
    </div>
  );
}

const Glyph = ({ k }) => (
  <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
    {k === 0 && <path d="M4 2.5h5.5L12 5v8.5H4zM6 7.5h4M6 10h4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />}
    {k === 1 && <><rect x="2" y="3" width="12" height="10" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="m4.5 6.5 2 1.5-2 1.5M8 10h3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></>}
    {k === 2 && <path d="M3 5.5h9.5M10 3l2.5 2.5L10 8M13 10.5H3.5M6 8l-2.5 2.5L6 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />}
  </svg>
);

/* what the extension hands back, read out as text: the page's own words, then what it registered, then where it went */
const READ = [
  ['page content', ['Hanzo Extension', 'Your browser, as a tool an agent can use.']],
  ['console messages', ['Connected means registered']],
  ['network requests', ['hanzo.ai/extension']],
];
function Text({ on }) {
  return (
    <div className={'xe-vis xe-text' + (on ? ' on' : '')} aria-hidden="true">
      <ul className="xe-outs">
        {READ.map(([l, lines], i) => (
          <li key={l} style={{ '--i': i }}>
            <span className="xe-outs-h"><span className="xe-outs-i"><Glyph k={i} /></span><em>{l}</em></span>
            <span className="xe-outs-v x-mono">{lines.map((t, j) => <span key={t} className="xe-type" style={{ '--n': t.length, '--d': (0.5 + i * 0.9 + j * 0.45).toFixed(2) + 's' }}>{t}</span>)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const SIZE = { chrome: '976 KB', firefox: '956 KB', safari: '310 KB', edge: null, other: '310 KB' };
function Build({ on }) {
  return (
    <div className={'xe-vis xe-build' + (on ? ' on' : '')} aria-hidden="true">
      <span className="xe-src x-mono">hanzoai/extension</span>
      <svg className="xe-fork" viewBox="0 0 600 72" preserveAspectRatio="none"><path d="M300 0 100 72M300 0v72M300 0l200 72" /></svg>
      <ul className="xe-zips">
        {['chrome', 'firefox', 'safari'].map((b, i) => (
          <li key={b} style={{ '--i': i }}><span className="xe-zip-i" /><span className="x-mono">{`hanzo-ai-${b}-v1.9.31.zip`}</span><em className="x-mono">{SIZE[b]}</em></li>
        ))}
      </ul>
    </div>
  );
}

const CHAPTERS = [Tools, Text, Build].map((V, i) => ({
  kick: ['Connectors', 'Read', 'Build'][i],
  title: MORE[i][0],
  body: <p className="av-body">{MORE[i][1]}</p>,
  visual: (on) => <V on={on} />,
}));

/* ---------- Beyond: your browser's build comes first ---------- */
const BUILDS = [
  ['chrome', 'Chrome', 'Full integration with Google Chrome browser with tabs context and sidebar assistance.', 'Download for Chrome'],
  ['firefox', 'Firefox', 'Fully compatible with Mozilla Firefox for privacy-conscious users and developers.', 'Download for Firefox'],
  ['edge', 'Edge', 'Enhanced experience on Microsoft Edge with optimized performance and memory profile.', 'Download for Edge'],
  ['other', 'Safari & Others', 'Safari, Brave, Opera, Arc, and other Chromium-based browsers are also fully supported.', 'All Extension Builds'],
];
const NAME = { chrome: 'Chrome', firefox: 'Firefox', edge: 'Edge', other: null };

/* the build you are pointing at, as one figure: its name and its size, rolling in when it changes; under it the three
   builds' sizes as hairline bars, the one you point at in ink (Edge has no size of its own on the page, so it shows none) */
const BAR = ['chrome', 'firefox', 'safari'];
function Peek({ k }) {
  const name = BUILDS.find((b) => b[0] === k)[1];
  const lit = k === 'edge' ? 'chrome' : k === 'other' ? 'safari' : k;
  return (
    <div className="xe-peek" aria-hidden="true">
      <span className="xe-peek-n" key={'n' + k}>{name}</span>
      <span className="xe-peek-f av-num" key={'f' + k}>{SIZE[k] || 'v1.9.31'}</span>
      <span className="xe-peek-bars">
        {BAR.map((b) => <span key={b} className={b === lit ? 'on' : ''} style={{ '--xw': parseInt(SIZE[b], 10) / 976 }}><i /><em className="x-mono">{SIZE[b]}</em></span>)}
      </span>
    </div>
  );
}

function Builds({ mine }) {
  const order = mine ? [...BUILDS].sort((a, b) => (b[0] === mine) - (a[0] === mine)) : BUILDS;
  const [hot, setHot] = useState(null);
  const lead = mine || 'chrome'; // the one filled ask: your browser's build (Chrome when it cannot tell)
  const show = hot || lead;
  const brief = useBrief();
  return (
    <section className="av-sec xe-builds" id="browsers">
      <div className="av-wrap av-grid">
        <div className="xe-builds-l">
          <h2 className="av-head">Built for every major browser</h2>
          <p className="av-body">Direct extension builds available for Chrome, Firefox, Safari, and Edge. Install in seconds to bring Hanzo agents into your everyday browsing.</p>
          <Peek k={show} />
        </div>
        <ul className="xe-rows">
          {order.map(([k, t, d, cta]) => (
            <motion.li key={k} layout transition={DEAL} className={(k === mine ? 'yours' : '') + (k === show ? ' hot' : '')}
              onPointerEnter={(e) => e.pointerType === 'mouse' && setHot(k)} onFocus={() => setHot(k)} onClick={() => setHot(k)}>
              <h3 className="av-title">{t}</h3>
              <p>{d}</p>
              {k === mine && <span className="xe-yours x-mono">{NAME[k] ? `You are on ${NAME[k]}` : 'Your browser'}</span>}
              {k === lead
                ? <Cta to={REL} id={'extension-build-' + k} {...brief}>{cta}</Cta>
                : <span className="xe-row-a"><Cta to={REL} id={'extension-build-' + k} kind="link">{cta}</Cta>{SIZE[k] && <em className="xe-row-sz x-mono">{SIZE[k]}</em>}</span>}
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- the uses, as browser tabs you open ---------- */
const USES = [
  ['Check the change you just made', 'An agent that edited a page can open it, look at what rendered, and read the console — instead of telling you it thinks the fix worked.'],
  ['Behind a login', 'An internal dashboard, a vendor console, an admin panel. It runs in the session you already have, so there is no service account to provision for a one-off task.'],
  ['Debug the request, not the guess', 'Network requests and console messages come back as data. When a page misbehaves, the agent can read what the browser saw.'],
  ['The long boring form', 'Multi-step flows that exist only in a UI and have no API behind them. It fills them in and tells you where it got stuck.'],
];

/* what the agent sees, per use: a page and its console, a dashboard behind a sign-in, the requests, a form filling in */
const T = (t, d, cls = '') => <span className={'xe-type ' + cls} style={{ '--n': t.length, '--d': d + 's' }}>{t}</span>;
function UseRender({ i }) {
  return (
    <div className={'xe-ur u' + i} aria-hidden="true">
      {/* 01: the page it just changed, ringed as it looks, and what came back from the console */}
      {i === 0 && <div className="xe-ur-check">
        <div className="xe-ur-page"><Img src="/models/koma.webp" w={1200} h={1500} alt="" /><span><b>Hanzo Extension</b><span>Your browser, as a tool an agent can use.</span></span><i className="xe-ur-ring" /></div>
        <div className="xe-ur-log x-mono"><em>console messages</em>{T('page content', 0.9)}{T('console messages', 1.3)}</div>
      </div>}
      {/* 02: the three places a login guards, unlocking one by one in the session you already have */}
      {i === 1 && <ul className="xe-ur-locks">
        {['An internal dashboard', 'a vendor console', 'an admin panel'].map((t, n) => (
          <li key={t} style={{ '--i': n }}><span className="xe-ur-lock" /><b>{t}</b></li>
        ))}
      </ul>}
      {/* 03: the request's own path, hop by hop, as data the agent can read */}
      {i === 2 && <ol className="xe-ur-trace x-mono">
        <em>network requests</em>
        {HOPS.slice(0, 5).map((h, n) => <li key={h} style={{ '--i': n, '--xw': [0.18, 0.32, 0.54, 0.7, 1][n] }}><span>{h}</span><i /></li>)}
      </ol>}
      {/* 04: a multi-step flow filled in, and the step where it got stuck */}
      {i === 3 && <div className="xe-ur-form">
        <span className="xe-ur-step x-mono">{['01', '02', '03'].map((n, k) => <i key={n} style={{ '--i': k }}>{n}</i>)}</span>
        <span className="xe-ur-f">{T('Multi-step flows', 0.4)}</span>
        <span className="xe-ur-f">{T('exist only in a UI', 1.2)}</span>
        <span className="xe-ur-f stuck"><b className="xe-ur-caret" /><em className="x-mono">where it got stuck</em></span>
      </div>}
    </div>
  );
}

function Uses() {
  const [at, setAt] = useState(0);
  const tabs = useRef([]);
  const key = (e) => {
    const n = USES.length;
    const go = e.key === 'ArrowRight' ? (at + 1) % n : e.key === 'ArrowLeft' ? (at + n - 1) % n : e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : -1;
    if (go < 0) return;
    e.preventDefault(); setAt(go); tabs.current[go]?.focus();
  };
  return (
    <section className="av-sec tight xe-uses">
      <div className="av-wrap">
        <div className="xe-uses-l">
          <h2 className="av-head">Mostly the work that only exists inside a browser window</h2>
          <p className="xe-uses-k x-mono">What you would use it for</p>
        </div>
        <div className="xe-tabwin">
          <div className="xe-tabs" role="tablist" aria-label="What you would use it for" onKeyDown={key}>
            {USES.map(([t], i) => (
              <button key={t} ref={(el) => { tabs.current[i] = el; }} type="button" role="tab" id={'xe-u' + i} aria-controls={'xe-up' + i} aria-selected={i === at} tabIndex={i === at ? 0 : -1} onClick={() => setAt(i)}>
                {i === at && <motion.span layoutId="xe-tab" className="xe-tab-bg" transition={GLIDE} />}
                <span className="xe-fav x-mono" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span><span className="xe-tt">{t}</span>
              </button>
            ))}
          </div>
          <div className="xe-tabbody">
            {USES.map(([t, d], i) => (
              <div key={t} id={'xe-up' + i} role="tabpanel" aria-labelledby={'xe-u' + i} className={'xe-use' + (i === at ? ' on' : '')} hidden={i !== at}>
                <span className="x-mono av-num xe-use-n">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="x-sr">{t}</h3>
                <p className="av-lede">{d}</p>
                <UseRender i={i} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- before the end: the docs, the repo and the spec ---------- */
function Get() {
  return (
    <section className="av-sec tight xe-get">
      <div className="av-wrap av-grid xe-get-g">
        <div className="xe-start">
          <h2 className="av-head">Get started with Extension</h2>
          <Cta to={DOCS} id="extension-docs" kind="link">Read the docs</Cta>
        </div>
        <div className="xe-card2">
          <span className="xe-card2-i"><Mark size={24} /></span>
          <h2 className="av-title">Get Extension</h2>
          <p>Browser extension + MCP bridge</p>
          <dl className="xe-meta x-mono">
            <div><dt>License:</dt><dd>Apache-2.0</dd></div>
            <div><dt>Source</dt><dd><A to="https://github.com/hanzoai" data-cta="extension-repo">hanzoai</A></dd></div>
          </dl>
          <div className="xe-card2-a">
            <Cta to="https://platform.hanzo.ai/deploy" id="extension-deploy" kind="quiet">Deploy to Cloud</Cta>
            <Sheet label="See the spec" kick="Browser extension" title="Hanzo Extension">
              <dl className="av-spec">
                <dt>Browsers</dt><dd>Chrome · Firefox · Safari</dd>
                <dt>Builds</dt><dd>Direct extension builds available for Chrome, Firefox, Safari, and Edge.</dd>
                <dt>Version</dt><dd><span className="x-mono">v1.9.31</span> · Chrome 976 KB · Firefox 956 KB · Safari 310 KB · <A to="/download">Every build</A></dd>
                <dt>Transport</dt><dd>The extension talks to the local Hanzo daemon through a native messaging host over a Unix socket.</dd>
                <dt>Ports</dt><dd>There is no WebSocket, no localhost port, and nothing else on the machine can dial in.</dd>
                <dt>Session</dt><dd>The agent drives the browser you are already signed into.</dd>
                <dt>Returns</dt><dd>Page content, console messages and network requests.</dd>
                <dt>Install</dt><dd>Load it unpacked in Chrome or as a temporary add-on in Firefox while you are working on it.</dd>
                <dt>License:</dt><dd>Apache-2.0</dd>
                <dt>Docs</dt><dd><A to={DOCS}>Read the docs →</A></dd>
              </dl>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- the one closing band: the hero's ask again ---------- */
function End() {
  const brief = useBrief();
  return (
    <section className="x-band xe-band" aria-labelledby="xe-end-h">
      <div className="av-wrap xe-band-in">
        <Lines as="h2" id="xe-end-h" className="av-display m" lines={['Get the Hanzo', 'Extension']} />
        <p className="av-lede">Available for Chrome, Firefox, Safari, and Edge. Or use Hanzo Chat directly in any browser.</p>
        <div className="xe-band-acts">
          <Cta to={REL} id="extension-download-end" size="lg" {...brief}>Download Extension</Cta>
          <Cta to="/chat" id="extension-chat-end" kind="link">Open Hanzo Chat</Cta>
        </div>
      </div>
    </section>
  );
}

export default function ExtensionPage() {
  const { build, win } = useBrowser();
  return (
    <main className="av xe" style={{ '--ac': '#737373' }}>
      <Hero mineWin={win} />
      <How />
      <Scenes label="More of the extension" items={CHAPTERS} tone={['#ffffff', '#f5f5f5', '#fafafa']} />
      <Builds mine={build} />
      <Uses />
      <Get />
      <End />
    </main>
  );
}
