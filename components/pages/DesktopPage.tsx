'use client';
// Signature: terminal (Live terminal): second screen, the window's own job run as a terminal: it types the real commands (the job, cat gateway/limit.go, go test ./gateway) and streams their real output, and the visitor picks the next command (components/pages/desktop/Terminal.jsx). The hero window still assembles itself in your system's chrome and builds the rate limiter.
// Entrances: swing-door, domino, inertia-drag, shrink-to-card, page-curl
// Beyond: Cut the network: make an agent in the page, pin its model on your machine or on Hanzo Cloud, pull the wire and watch which one keeps running and where its keys and data stay
// Persona: a developer who wants agents running on their own machine, with their own keys, offline if need be
// Goal: see the app build something real in the first screen, then download it
// CTA: "Download" (docs.hanzo.ai/docs/apps/desktop): the hero's one solid with data-thumb (the shared header carries it once the hero leaves), and the closing band's one solid
// Metric: desktop_download (data-cta desktop-download, desktop-download-end)
/* Hanzo Desktop (Launch: the app window is the hero).
   V2: 8/10 round 4 (motion map): the pinned chapters are gone; a live terminal in the second screen runs the window's job, file and test and lets you pick the next command; the three points are one domino list; five different entrances (terminal swings in, points tip like dominoes, the agent card is thrown in and can be thrown again, the systems section shrinks into a card as you leave, and that card curls away off Paste and ship); the hero window build, the cut-the-network room and every hover stay
   Motion: signature = the terminal; the hero window still builds itself (a step loop that stops off screen). One reveal
   style beyond the entrances: the line-mask cut-in, on the h1 and the closing band only. Magnetic ask.
   Greys only; every word is Hanzo's; the job in the window is Hanzo's example. */
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { Copy, Mark, Magnetic } from '../ui';
import { A, Cta } from '../kit';
import { play } from '../../lib/sound';
import Lines from './desktop/Lines';
import Terminal from './desktop/Terminal';
import { useEnter, ShrinkCard, Curl } from './desktop/enter';
import Sheet from '../v2/AppSheet';
import '../v2/AppType.css';
import './DesktopPage.css';

const DOCS = 'https://docs.hanzo.ai/docs/apps/desktop';
const GH = 'https://github.com/hanzoai';
type Os = 'mac' | 'win' | 'linux';
const OSES: [Os, string, string][] = [['mac', 'macOS', 'arm64 + intel'], ['win', 'Windows', 'x64 + arm64'], ['linux', 'Linux', 'deb + rpm + AppImage']];
const GLIDE = { duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] };

function useOs(): [Os, (k: Os) => void, Os | null] {
  const [os, setOs] = useState<Os>('mac');
  const [mine, setMine] = useState<Os | null>(null);
  useEffect(() => {
    const uad = (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData; // not in lib.dom yet
    const p = ((uad && uad.platform) || navigator.platform || '').toLowerCase();
    const k: Os = /win/.test(p) ? 'win' : /linux|x11/.test(p) && !/android/i.test(navigator.userAgent) ? 'linux' : 'mac';
    setOs(k); setMine(k);
  }, []);
  return [os, setOs, mine];
}

const MSGS = [
  ['you', 'Add rate limiting to the payments API.'],
  ['ai', 'Read 14 files. The limiter belongs in the gateway, not the handler — one place, every route.'],
  ['ai', 'Wrote gateway/limit.go and a test at 100 req/min per key. Tests pass.'],
];
// the run log beside the thread: Hanzo's own steps from the thread, each with its state drawn as a shape
const STEPS: [string, number][] = [['Read 14 files.', 5], ['gateway/limit.go', 6], ['100 req/min per key', 7], ['Tests pass.', 8]];

// the file the thread names, drawn as the file: gateway/limit.go, 100 req/min per key (the visual of Hanzo's own example)
const CODE = [
  'package gateway',
  '',
  '// 100 req/min per key',
  'func Limit(h http.Handler) http.Handler {',
  '  return rate.PerKey(100, time.Minute, h)',
  '}',
];

const Tick = () => <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3.5 8.5l3 3 6-6.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;

/* ---------- the hero window: it puts itself together, then builds the limiter. s = 0..9 ---------- */
function Window({ os }: { os: Os }) {
  const box = useRef<HTMLDivElement>(null);
  const ask = useRef<HTMLSpanElement>(null);
  const seen = useInView(box, { amount: 0.3 });
  const calm = useReducedMotion();
  const [s, setS] = useState(0); // the server draws the empty frame; with JS off every part shows (the hidden states are .js only)
  const [held, setHeld] = useState(false); // the pause control: the window rests on its finished frame
  useEffect(() => {
    if (calm || held) { setS(9); if (ask.current) ask.current.textContent = ''; return; }
    if (!seen) return;
    let alive = true, t: ReturnType<typeof setTimeout> | undefined, first = true;
    const wait = (ms: number) => new Promise<void>((r) => { t = setTimeout(r, ms); });
    (async () => {
      while (alive) {
        if (ask.current) ask.current.textContent = '';
        if (first) {
          setS(0); await wait(80);
          setS(1); await wait(380); // the title bar drops in
          setS(2); await wait(320); // the sidebar and the run log
          setS(3); await wait(360); // toolbar and composer
        } else { setS(3); await wait(700); } // later runs keep the window built and only clear the thread
        setS(4);
        const q = MSGS[0][1];
        for (let i = 1; i <= q.length && alive; i++) { if (ask.current) ask.current.textContent = q.slice(0, i); await wait(first ? 16 : 24); }
        await wait(first ? 260 : 420); if (!alive) return;
        setS(5); await wait(first ? 1500 : 1900); // it reads the repo
        setS(6); await wait(1600); // writes limit.go
        setS(7); await wait(1700); // the test runs
        setS(8); if (first) play('done'); await wait(700); // and passes: a faint chime, the first time only
        setS(9); await wait(5600);
        first = false;
      }
    })();
    return () => { alive = false; clearTimeout(t); };
  }, [seen, calm, os, held]);
  let cls = ' at' + s;
  for (let i = 1; i <= s; i++) cls += ' s' + i;
  return (
    <div className={'dk-win os-' + os + cls} ref={box}>
      <div className="dk-bar">
        <button type="button" className="dk-pause" aria-pressed={held} aria-label={held ? 'Play' : 'Pause'} onClick={() => setHeld((h) => !h)}>
          {held
            ? <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M5 3.5v9l7-4.5z" fill="currentColor" /></svg>
            : <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M5 3.5v9M11 3.5v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>}
        </button>
        {os === 'mac' && <span className="dk-lights" aria-hidden="true"><i /><i /><i /></span>}
        {os === 'win' && <span className="dk-appi" aria-hidden="true"><Mark size={14} /></span>}
        <span className="dk-name">Desktop — Hanzo</span>
        <nav className="dk-tabs" aria-label="Hanzo apps">
          <A to="/desktop" className="on">Desktop</A><A to="/cli">CLI</A><A to="/playground">Playground</A><A to="/cloud/api-keys">API Keys</A>
        </nav>
        {os === 'win' && <span className="dk-ctl" aria-hidden="true"><i /><i /><i /></span>}
        {os === 'linux' && <span className="dk-close" aria-hidden="true"><i /></span>}
      </div>
      <div className="dk-main">
        <aside className="dk-side" aria-hidden="true">
          <p className="dk-side-h"><span className="dk-side-i"><Mark size={11} /></span>Desktop</p>
          <ul className="dk-tree">
            <li className="t-dir">gateway</li>
            <li className="t-new">limit.go</li>
            <li className="t-dir">payments</li>
            <span className="dk-scan" />
          </ul>
          <p className="dk-model x-mono"><i />Local model</p>
        </aside>
        <div className="dk-chat">
          <ul className="dk-msgs">
            <li className="dk-you"><span>{MSGS[0][1]}</span></li>
            <li className="dk-ai dk-ai1"><span className="dk-av"><Mark size={12} /></span><span className="dk-ai-t">{MSGS[1][1]}</span></li>
            <li className="dk-ai dk-ai2"><span className="dk-av"><Mark size={12} /></span><span className="dk-ai-t">{MSGS[2][1]}</span></li>
            <li className="dk-open"><A to="https://hanzo.team/" data-cta="desktop-window-console">Open in the console</A></li>
          </ul>
          <div className="dk-compose" aria-hidden="true">
            <span className="dk-ask"><span ref={ask} /><i className="dk-caret" /></span>
            <span className="dk-send"><svg viewBox="0 0 16 16" width="16" height="16"><path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
          </div>
        </div>
        <div className="dk-log" aria-hidden="true">
          <div className="dk-log-tab"><span className="x-mono">gateway/<b>limit.go</b></span></div>
          <ol className="dk-steps">
            {STEPS.map(([t, at]) => (
              <li key={t} className={'x-mono' + (s >= at + 1 || s === 9 ? ' done' : s === at ? ' run' : '')}>
                <span className="dk-st"><i /><Tick /></span><span className="dk-st-t">{t}</span>
              </li>
            ))}
          </ol>
          <pre className="dk-code x-mono">
            {CODE.map((l, i) => <span key={i} className={'dk-ln' + (l.startsWith('//') ? ' cm' : '')} style={{ '--l': i }}><em>{i + 1}</em>{l || ' '}</span>)}
          </pre>
          <div className="dk-test x-mono">
            <span className="dk-test-cmd">$ go test ./gateway</span>
            <span className="dk-test-out">ok  gateway  100 req/min per key</span>
            <span className="dk-pass"><Tick />Tests pass.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

type OsProps = { os: Os; setOs: (k: Os) => void; mine: Os | null };

function Hero({ os, setOs, mine }: OsProps) {
  return (
    <section className="dk-hero" aria-labelledby="dk-h1">
      <div className="av-wrap dk-top">
        <Lines as="h1" id="dk-h1" className="av-display dk-h1" lines={['Hanzo Desktop']} now delay={0.05} />
        <div className="dk-row">
          <p className="av-lede dk-lede">Build agents on your own machine</p>
          <div className="dk-acts">
            <Magnetic strength={0.2}><Cta to={DOCS} id="desktop-download" thumb size="lg">Download</Cta></Magnetic>
            <Cta to={GH} id="desktop-github" kind="link">GitHub</Cta>
          </div>
        </div>
      </div>
      <div className="av-wrap">
        <div className="dk-stage" id="dk-stage" data-morph-target="">
          <Window os={os} />
        </div>
        <div className="dk-under">
          <p className="dk-under-k x-mono">Native Desktop Client</p>
          <div className="dk-os" role="tablist" aria-label="System">
            {OSES.map(([k, n, arch]) => (
              <button key={k} type="button" role="tab" aria-selected={os === k} onClick={() => setOs(k)}>
                {os === k && <motion.span layoutId="dk-os" className="dk-os-bg" transition={GLIDE} />}
                <span className="dk-os-n">{n}</span>
                {mine === k && <i className="dk-mine" aria-hidden="true" />}
              </button>
            ))}
          </div>
          <p className="dk-note"><span>Example project. Every name in it is one you would give your own.</span> <A to="/home">Open in the console</A></p>
        </div>
      </div>
    </section>
  );
}

/* ---------- chapters: three app panes, each plays once when its chapter shows ---------- */
const POINTS = [
  ['Nothing to scaffold', 'An agent is made in the window: give it a job, some tools, and a model. There is no project to create first and no file to check in before it exists.'],
  ['Local model or cloud model, per agent', 'Point one agent at a model running on your machine and another at one on Hanzo Cloud. It is a setting on the agent, not a decision about the whole install.'],
  ['They work together', 'Agents share context and hand steps to each other, so a job that needs several of them is one workflow instead of you copying between three chat windows.'],
  ['It works with the network off', 'With a local model pinned, an agent keeps running when the connection goes. Nothing has to be uploaded for it to do its job.'],
  ['Your keys stay on your machine', 'Keys and the data an agent touches stay local. An agent that has to pay for something spends from a key you hold, on hardware you own.'],
  ['MCP is how it reaches your tools', 'Agents speak the Model Context Protocol, so a tool you have already connected elsewhere works here without a second integration written for this app.'],
];

/* ---------- the signature: the window's job as a live terminal; pick the next command ---------- */
const RUNS = [
  { p: '>', cmd: MSGS[0][1], out: [MSGS[1][1], MSGS[2][1]] },
  { p: '$', cmd: 'cat gateway/limit.go', out: CODE, code: true },
  { p: '$', cmd: 'go test ./gateway', out: ['ok  gateway  100 req/min per key', 'Tests pass.'], ok: 'Tests pass.' },
];

function Build() {
  const door = useEnter<HTMLDivElement>(0.25);
  return (
    <section className="av-sec dk-build" aria-labelledby="dk-build-h">
      <div className="av-wrap av-grid">
        <div className="dk-build-l">
          <h2 id="dk-build-h" className="av-display s">What you can build in it</h2>
          <p className="av-lede">Free and open source. Download it, and the first agent is a few minutes of clicking.</p>
        </div>
        <div className="dk-build-r en-swing" ref={door}>
          <div className="en-door"><Terminal runs={RUNS} labelledBy="dk-build-h" /></div>
        </div>
      </div>
    </section>
  );
}

/* ---------- the three points, one quick list; they tip into place like dominoes ---------- */
function Points() {
  const row = useEnter<HTMLOListElement>(0.3);
  return (
    <section className="av-sec tight dk-points" aria-label="What you can build in it">
      <div className="av-wrap">
        <ol className="dk-pts en-domino" ref={row}>
          {POINTS.slice(0, 3).map(([t, d], i) => (
            <li key={t} style={{ '--i': i }}>
              <span className="x-mono av-num">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="av-head">{t}</h3>
              <p className="av-body">{d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- the dark room (Beyond): one agent, its model here or on Hanzo Cloud, and a wire you can cut ---------- */
function Offline() {
  const [job, setJob] = useState(MSGS[0][1]);
  const [local, setLocal] = useState(true);
  const [net, setNet] = useState(true);
  const [note, setNote] = useState(3);
  const runs = local || net;
  const cut = () => { setNet(!net); setNote(3); };
  const pick = (v: boolean) => { setLocal(v); setNote(v ? 4 : 3); };
  const thrown = useEnter<HTMLDivElement>(0.3);
  return (
    <section className="av-sec av-dark dk-dark" data-room="dark" aria-labelledby="dk-off-h">
      <div className="av-wrap">
        <h2 id="dk-off-h" className="av-display s">Cut the network</h2>
        <div className="av-grid dk-off">
          <div className="dk-off-l">
            <label className="dk-job"><span className="dk-job-k x-mono">Give it a job</span><input value={job} onChange={(e) => setJob(e.target.value)} maxLength={90} /></label>
            <div className="dk-radio" role="radiogroup" aria-label="Model">
              <button type="button" role="radio" aria-checked={local} data-sound="tick" onClick={() => pick(true)}>Local model</button>
              <button type="button" role="radio" aria-checked={!local} data-sound="tick" onClick={() => pick(false)}>Hanzo Cloud</button>
            </div>
            <button type="button" role="switch" aria-checked={net} className={'dk-net' + (net ? '' : ' off')} onClick={cut}><i />{net ? 'Network on' : 'Network off'}</button>
            <ol className="dk-notes">
              {POINTS.slice(3).map(([t, d], j) => {
                const i = j + 3, open = note === i;
                return (
                  <li key={t} className={open ? 'open' : ''}>
                    <button type="button" aria-expanded={open} data-sound="tick" onClick={() => setNote(open ? -1 : i)}>
                      <span className="x-mono av-num">{String(i + 1).padStart(2, '0')}</span><span>{t}</span><i aria-hidden="true" />
                    </button>
                    <p>{d}</p>
                  </li>
                );
              })}
            </ol>
          </div>
          <div className="dk-throw en-throw" ref={thrown}>
          <motion.div className={'dk-card' + (runs ? '' : ' wait') + (net ? '' : ' cut')} aria-live="polite"
            drag="x" dragSnapToOrigin dragElastic={0.5} dragMomentum dragTransition={{ bounceStiffness: 260, bounceDamping: 22 }}
            whileDrag={{ rotate: 2, scale: 0.98 }}>
            <div className="dk-map" aria-hidden="true">
              <div className="dk-site"><span className="dk-site-k x-mono">Your machine</span><div className="dk-slot">{local && <motion.span layoutId="dk-agent" className="dk-token" transition={GLIDE}><Mark size={16} /></motion.span>}</div></div>
              <div className="dk-wire"><i /><i /><b>×</b></div>
              <div className="dk-site"><span className="dk-site-k x-mono">Hanzo Cloud</span><div className="dk-slot">{!local && <motion.span layoutId="dk-agent" className="dk-token" transition={GLIDE}><Mark size={16} /></motion.span>}</div></div>
            </div>
            <p className="dk-stat"><b />{runs ? 'Running' : 'Waiting for the connection'}</p>
            <p className="dk-card-job">{job.trim() || 'An agent with no job yet.'}</p>
            <dl className="dk-card-dl">
              <div><dt className="x-mono">Model</dt><dd>{local ? 'Running on your machine' : 'On Hanzo Cloud'}</dd></div>
              <div><dt className="x-mono">Keys and data</dt><dd>{local ? 'Keys and the data an agent touches stay local.' : 'It is a setting on the agent, not a decision about the whole install.'}</dd></div>
            </dl>
            <p className="dk-say">{local ? 'With a local model pinned, an agent keeps running when the connection goes. Nothing has to be uploaded for it to do its job.' : runs ? 'Point one agent at a model running on your machine and another at one on Hanzo Cloud.' : 'Pin a local model and it keeps running when the connection goes.'}</p>
          </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- every system: three huge rows; pick one and the window above rebuilds in it. The spec opens in a drawer. ---------- */
function Everywhere({ os, setOs, mine }: OsProps) {
  const show = (k: Os) => {
    setOs(k);
    const el = document.getElementById('dk-stage'); if (!el) return;
    const y = el.getBoundingClientRect().top + scrollY - 96;
    window.__lenis ? window.__lenis.scrollTo(y, { duration: 1.2 }) : scrollTo({ top: y, behavior: 'smooth' });
  };
  return (
    <ShrinkCard className="av-sec dk-every">
      <div className="av-wrap av-grid">
        <div className="dk-every-l">
          <h2 className="av-head">Available everywhere you work</h2>
          <p className="av-body">Native installers for macOS (Apple Silicon + Intel), Windows, and Linux.</p>
          <Sheet label="See the spec" kick="Native Desktop Client" title="Hanzo Desktop">
            <dl className="av-spec dk-spec">
              <dt>Systems</dt><dd>{OSES.map(([k, n, a]) => <span key={k} className="dk-spec-os"><b>{n}</b> <span className="x-mono">{a}</span></span>)}</dd>
              <dt>Installers</dt><dd>Native installers for macOS (Apple Silicon + Intel), Windows, and Linux.</dd>
              <dt>Version</dt><dd><span className="x-mono">v1.1.52</span> · <A to="/download">Every build</A></dd>
              <dt>Models</dt><dd>Point one agent at a model running on your machine and another at one on Hanzo Cloud.</dd>
              <dt>Offline</dt><dd>With a local model pinned, an agent keeps running when the connection goes.</dd>
              <dt>Account</dt><dd>If the model is a local one, the whole thing runs without an account.</dd>
              <dt>Tools</dt><dd>Agents speak the Model Context Protocol, so a tool you have already connected elsewhere works here without a second integration written for this app.</dd>
              <dt>License:</dt><dd>Apache-2.0</dd>
              <dt>Source</dt><dd><A to={GH}>hanzoai</A></dd>
              <dt>Docs</dt><dd><A to={DOCS}>Desktop docs →</A></dd>
            </dl>
          </Sheet>
        </div>
        <ul className="dk-oslist">
          {OSES.map(([k, n, arch]) => (
            <li key={k}>
              <button type="button" className={os === k ? 'on' : ''} aria-pressed={os === k} onClick={() => show(k)}>
                <span className="dk-ol-n">{n}{mine === k && <i className="dk-mine" aria-hidden="true" />}</span>
                <span className="dk-ol-a x-mono">{arch}</span>
                <span className="dk-ol-go" aria-hidden="true"><svg viewBox="0 0 16 16" width="20" height="20"><path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </ShrinkCard>
  );
}

/* ---------- before the end: the line to paste into an agent, the repo, the related apps ---------- */
function Kit() {
  const text = 'Read https://hanzo.ai/skill.md and use Hanzo Desktop in my project.';
  const curl = useEnter(0.35);
  return (
    <section className="av-sec tight dk-kit en-curl-host" ref={curl}>
      <Curl />
      <div className="av-wrap av-grid">
        <div className="dk-kit-l">
          <h2 className="av-head">Paste and ship</h2>
          <p className="av-body">Paste this into any agent. It reads the skill manifest and calls Desktop from there.</p>
          <div className="dk-prompt">
            <span className="dk-prompt-k x-mono">Agent prompt</span>
            <code>{text}</code>
            <Copy text={text} />
          </div>
          <div className="dk-rel">
            <p className="dk-rel-k x-mono">Related capabilities</p>
            <div>{[['CLI', '/cli'], ['Playground', '/playground'], ['API Keys', '/cloud/api-keys']].map(([t, to]) => <A key={t} to={to} className="dk-rel-a" data-cta={'desktop-related-' + t.toLowerCase().replace(/ /g, '-')}>{t}</A>)}</div>
            <A to={DOCS} className="dk-docs" data-cta="desktop-docs">Desktop docs →</A>
          </div>
        </div>
        <div className="dk-get">
          <span className="dk-get-i"><Mark size={26} /></span>
          <h3 className="av-title">Get Desktop</h3>
          <p className="dk-get-d">Desktop client</p>
          <dl className="x-mono"><div><dt>License:</dt><dd>Apache-2.0</dd></div></dl>
          <div className="dk-get-acts">
            <A to={GH} className="dk-gh x-mono" data-cta="desktop-repo">hanzoai</A>
            <Cta to="https://platform.hanzo.ai/deploy" id="desktop-deploy" kind="quiet">Deploy to Cloud</Cta>
            <Cta to={DOCS} id="desktop-self-host" kind="link">Self-host</Cta>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- the one closing band: the hero's ask again ---------- */
function End() {
  return (
    <section className="x-band dk-band" aria-labelledby="dk-end-h">
      <div className="av-wrap dk-band-in">
        <Lines as="h2" id="dk-end-h" className="av-display m" lines={['Download it', 'and build one']} />
        <p className="av-lede">Pick a model, describe the job, hand it the tools. If the model is a local one, the whole thing runs without an account.</p>
        <div className="dk-band-acts">
          <Cta to={DOCS} id="desktop-download-end" size="lg">Download</Cta>
          <Cta to={GH} id="desktop-github-end" kind="link">View on GitHub</Cta>
        </div>
      </div>
    </section>
  );
}

export default function DesktopPage() {
  const [os, setOs, mine] = useOs();
  return (
    <main className="av dk" style={{ '--ac': '#737373' }}>
      <Hero os={os} setOs={setOs} mine={mine} />
      <Build />
      <Points />
      <Offline />
      <Everywhere os={os} setOs={setOs} mine={mine} />
      <Kit />
      <End />
    </main>
  );
}
