'use client';
// Signature: The Hanzo Desktop window assembles itself centre stage in your own system's chrome (detected): title bar, sidebar, composer, then it builds one thing in front of you, the payments rate limiter, file written and tests passing
// Beyond: Cut the network: make an agent in the page, pin its model on your machine or on Hanzo Cloud, pull the wire and watch which one keeps running and where its keys and data stay
/* Hanzo Desktop, v2 (Archetype A, launch: the app window is the hero).
   V2: 8/10 centred name over a huge app window that puts itself together in your OS's chrome and builds the rate limiter; three pinned chapters (picture left) with live app panes; one dark room where you cut the network on an agent; the six systems and the spec in a drawer
   Motion: signature = the window assembling and building (a step loop that stops off screen; the ask is written into a
   text node). Supporting: Stage settle, pinned chapters with wipes (components/v2/AppScenes), line-masked headline.
   Accent: sky, from the app's send button. Every word is Hanzo's; the job in the window is Hanzo's example. */
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { Copy, Mark, Magnetic } from '../ui';
import { A, Go } from '../kit';
import Lines from '../v2/AppLines';
import Stage from '../v2/AppStage';
import Scenes from '../v2/AppScenes';
import Sheet from '../v2/AppSheet';
import '../v2/AppType.css';
import './DesktopPage.css';

const DOCS = 'https://docs.hanzo.ai/docs/apps/desktop';
const GH = 'https://github.com/hanzoai';
const OSES = [['mac', 'macOS', 'arm64 + intel'], ['win', 'Windows', 'x64 + arm64'], ['linux', 'Linux', 'deb + rpm + AppImage']];
const SPRING = { type: 'spring', stiffness: 300, damping: 30 };

function useOs() {
  const [os, setOs] = useState('mac');
  const [mine, setMine] = useState(null);
  useEffect(() => {
    const p = ((navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || '').toLowerCase();
    const k = /win/.test(p) ? 'win' : /linux|x11/.test(p) && !/android/i.test(navigator.userAgent) ? 'linux' : 'mac';
    setOs(k); setMine(k);
  }, []);
  return [os, setOs, mine];
}

const MSGS = [
  ['you', 'Add rate limiting to the payments API.'],
  ['ai', 'Read 14 files. The limiter belongs in the gateway, not the handler — one place, every route.'],
  ['ai', 'Wrote gateway/limit.go and a test at 100 req/min per key. Tests pass.'],
];

/* the file tree and the file being written, drawn as code-shaped strokes (no invented code) */
const TREE = [['dir', 'gateway'], ['new', 'limit.go'], ['bar', 64], ['bar', 46], ['dir', 'payments'], ['bar', 70], ['bar', 52], ['bar', 60], ['bar', 38], ['bar', 56], ['bar', 44]];
const CODE = [
  [0, [['k', 16], ['t', 30]]], [0, []], [0, [['k', 12], ['t', 22], ['s', 18]]], [1, [['t', 28], ['k', 8], ['t', 20]]],
  [1, [['k', 10], ['t', 34]]], [2, [['t', 24], ['s', 26]]], [2, [['k', 14], ['t', 18]]], [1, [['t', 12]]], [0, [['t', 6]]], [0, []],
  [0, [['k', 16], ['t', 26], ['s', 12]]], [1, [['t', 30], ['k', 10], ['t', 16]]], [1, [['k', 12], ['s', 30]]], [0, [['t', 6]]], [0, []],
  [0, [['k', 12], ['t', 34]]], [1, [['t', 20], ['s', 22]]], [1, [['k', 10], ['t', 26], ['t', 12]]], [2, [['t', 30]]], [1, [['t', 8]]], [0, [['t', 6]]],
];

/* ---------- the hero window: it puts itself together, then builds the limiter. s = 0..9 ---------- */
function Window({ os }) {
  const box = useRef(null);
  const ask = useRef(null);
  const seen = useInView(box, { amount: 0.3 });
  const calm = useReducedMotion();
  const [s, setS] = useState(9);
  useEffect(() => {
    if (!seen || calm) { setS(9); return; }
    let alive = true, t = 0, first = true;
    const wait = (ms) => new Promise((r) => { t = setTimeout(r, ms); });
    (async () => {
      while (alive) {
        if (ask.current) ask.current.textContent = '';
        setS(0); await wait(first ? 120 : 520);
        setS(1); await wait(420); // the title bar drops in
        setS(2); await wait(360); // the sidebar
        setS(3); await wait(440); // toolbar and composer
        setS(4);
        const q = MSGS[0][1];
        for (let i = 1; i <= q.length && alive; i++) { if (ask.current) ask.current.textContent = q.slice(0, i); await wait(26); }
        await wait(520); if (!alive) return;
        setS(5); await wait(1900); // it reads the repo
        setS(6); await wait(1700); // writes limit.go
        setS(7); await wait(1800); // the test runs and passes
        setS(8); await wait(700);
        setS(9); await wait(5600);
        first = false;
      }
    })();
    return () => { alive = false; clearTimeout(t); };
  }, [seen, calm, os]);
  let cls = ' at' + s;
  for (let i = 1; i <= s; i++) cls += ' s' + i;
  return (
    <div className={'dk-win os-' + os + cls} ref={box}>
      <div className="dk-bar">
        {os === 'mac' && <span className="dk-lights" aria-hidden="true"><i /><i /><i /></span>}
        {os === 'win' && <span className="dk-appi" aria-hidden="true"><Mark size={14} /></span>}
        <span className="dk-name"><b>Desktop</b> — Hanzo</span>
        <nav className="dk-tabs" aria-label="Hanzo apps">
          <A to="/desktop" className="on">Desktop</A><A to="/cli">CLI</A><A to="/playground">Playground</A><A to="/cloud/api-keys">API Keys</A>
        </nav>
        {os === 'win' && <span className="dk-ctl" aria-hidden="true"><i /><i /><i /></span>}
        {os === 'linux' && <span className="dk-close" aria-hidden="true"><i /></span>}
      </div>
      <div className="dk-main">
        <aside className="dk-side" aria-hidden="true">
          <span className="dk-search" />
          <ul className="dk-tree">
            {TREE.map(([k, v], i) => (
              <li key={i} className={'t-' + k}>{k === 'bar' ? <i style={{ width: v + '%' }} /> : v}</li>
            ))}
            <span className="dk-scan" />
          </ul>
        </aside>
        <div className="dk-chat">
          <ul className="dk-msgs">
            <li className="dk-you"><span>{MSGS[0][1]}</span></li>
            <li className="dk-ai dk-ai1"><span className="dk-av"><Mark size={12} /></span><span className="dk-ai-t">{MSGS[1][1]}</span></li>
            <li className="dk-ai dk-ai2"><span className="dk-av"><Mark size={12} /></span><span className="dk-ai-t">{MSGS[2][1]}</span></li>
            <li className="dk-open"><A to="https://hanzo.team/">Open in the console</A></li>
          </ul>
          <div className="dk-compose" aria-hidden="true">
            <span className="dk-ask"><span ref={ask} /><i className="dk-caret" /></span>
            <span className="dk-send"><svg viewBox="0 0 16 16" width="16" height="16"><path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
          </div>
        </div>
        <div className="dk-code" aria-hidden="true">
          <div className="dk-code-tab"><span className="x-mono">gateway/<b>limit.go</b></span></div>
          <ol className="dk-lines">
            {CODE.map(([ind, segs], i) => (
              <li key={i} style={{ '--i': i, paddingLeft: 18 * ind }}>{segs.map(([c, w], j) => <b key={j} className={'c-' + c} style={{ width: w + '%' }} />)}</li>
            ))}
          </ol>
          <div className="dk-test">
            <span className="x-mono">100 req/min per key</span>
            <i className="dk-test-bar"><b /></i>
            <span className="dk-pass"><svg viewBox="0 0 16 16" width="14" height="14"><path d="M3.5 8.5l3 3 6-6.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>Tests pass</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Hero({ os, setOs, mine }) {
  return (
    <section className="dk-hero" aria-labelledby="dk-h1">
      <div className="av-wrap dk-top">
        <p className="av-kick"><b>Native Desktop Client</b></p>
        <Lines as="h1" id="dk-h1" className="av-display dk-h1" lines={['Hanzo Desktop']} now delay={0.05} />
        <p className="av-lede dk-lede">Build agents on your own machine</p>
        <div className="av-acts dk-acts">
          <Magnetic strength={0.25}><Go to={DOCS} solid>Download</Go></Magnetic>
          <i hidden data-thumb="Download" data-href={DOCS} />
          <Go to={GH}>GitHub</Go>
        </div>
      </div>
      <div className="av-wrap">
        <Stage className="dk-stage" id="dk-stage" data-morph-target="">
          <Window os={os} />
        </Stage>
        <div className="dk-under">
          <div className="dk-os" role="tablist" aria-label="System">
            {OSES.map(([k, n, arch]) => (
              <button key={k} type="button" role="tab" aria-selected={os === k} onClick={() => setOs(k)} data-cursor={arch}>
                {os === k && <motion.span layoutId="dk-os" className="dk-os-bg" transition={SPRING} />}
                <span className="dk-os-n">{n}</span>
                {mine === k && <i className="dk-mine" aria-hidden="true" />}
              </button>
            ))}
          </div>
          <p className="dk-note">Example project. Every name in it is one you would give your own. <A to="/home">Open in the console</A></p>
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

const Head = ({ w = 46 }) => <div className="dk-pane-h"><span className="dk-ico"><Mark size={13} /></span><b className="dk-sk" style={{ width: w + '%' }} /></div>;
const Check = () => <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3.5 8.5l3 3 6-6.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;

function Scaffold({ on }) {
  return (
    <div className={'dk-vis dk-new' + (on ? ' on' : '')} aria-hidden="true">
      <div className="dk-pane">
        <div className="dk-new-h"><Head w={40} /><span className="dk-run"><i />Running</span></div>
        <div className="dk-fld f1"><em className="x-mono">job</em><span className="dk-val"><span className="dk-wipe">{MSGS[0][1]}</span></span></div>
        <div className="dk-fld f2"><em className="x-mono">tools</em><span className="dk-val"><span className="dk-chip">MCP</span></span></div>
        <div className="dk-fld f3"><em className="x-mono">model</em><span className="dk-val"><span className="dk-chip ac">Local</span></span></div>
      </div>
    </div>
  );
}

function PerAgent({ on }) {
  return (
    <div className={'dk-vis dk-per' + (on ? ' on' : '')} aria-hidden="true">
      {[['Running on your machine', 52], ['On Hanzo Cloud', 36]].map(([where, w], i) => (
        <div key={where} className={'dk-pane dk-agent a' + i}>
          <Head w={w} />
          <div className="dk-seg"><i className="dk-seg-th" /><span>Local</span><span>Hanzo Cloud</span></div>
          <p className="dk-where"><i />{where}</p>
        </div>
      ))}
    </div>
  );
}

function Together({ on }) {
  return (
    <div className={'dk-vis dk-tog' + (on ? ' on' : '')} aria-hidden="true">
      <div className="dk-flow">
        {[56, 40, 48].map((w, i) => (
          <div key={i} className="dk-pane dk-node" style={{ '--i': i }}>
            <Head w={w} />
            <i className="dk-node-bar"><b /></i>
            <span className="dk-node-ok"><Check /></span>
          </div>
        ))}
      </div>
      <div className="dk-ctx"><em className="x-mono">context</em><i style={{ '--i': 0 }} /><i style={{ '--i': 1 }} /><i style={{ '--i': 2 }} /></div>
    </div>
  );
}

const CHAPTERS = [Scaffold, PerAgent, Together].map((V, i) => ({
  kick: ['Agents', 'Models', 'Workflows'][i],
  title: POINTS[i][0],
  body: <p className="av-body">{POINTS[i][1]}</p>,
  visual: (on) => <V on={on} />,
}));

function Build() {
  return (
    <>
      <section className="dk-intro">
        <div className="av-wrap av-grid">
          <Lines as="h2" className="av-display s dk-intro-h" lines={['What you can', 'build in it']} />
          <p className="av-lede dk-intro-l">Free and open source. Download it, and the first agent is a few minutes of clicking.</p>
        </div>
      </section>
      <Scenes label="What you can build in it" items={CHAPTERS} flip />
    </>
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
  const pick = (v) => { setLocal(v); setNote(v ? 4 : 3); };
  return (
    <section className="av-sec av-dark dk-dark" data-room="dark" aria-labelledby="dk-off-h">
      <div className="av-wrap">
        <p className="av-kick dk-off-k">It works with the network off</p>
        <Lines as="h2" id="dk-off-h" className="av-display s" lines={['Cut the network']} />
        <div className="av-grid dk-off">
          <div className="dk-off-l">
            <label className="dk-job"><span className="av-kick">Give it a job</span><input value={job} onChange={(e) => setJob(e.target.value)} maxLength={90} /></label>
            <div className="dk-radio" role="radiogroup" aria-label="Model">
              <button type="button" role="radio" aria-checked={local} onClick={() => pick(true)}>Local model</button>
              <button type="button" role="radio" aria-checked={!local} onClick={() => pick(false)}>Hanzo Cloud</button>
            </div>
            <button type="button" role="switch" aria-checked={net} className={'dk-net' + (net ? '' : ' off')} onClick={cut}><i />{net ? 'Network on' : 'Network off'}</button>
            <ol className="dk-notes">
              {POINTS.slice(3).map(([t, d], j) => {
                const i = j + 3, open = note === i;
                return (
                  <li key={t} className={open ? 'open' : ''}>
                    <button type="button" aria-expanded={open} onClick={() => setNote(open ? -1 : i)}>
                      <span className="x-mono av-num">{String(i + 1).padStart(2, '0')}</span><span>{t}</span><i aria-hidden="true" />
                    </button>
                    <p>{d}</p>
                  </li>
                );
              })}
            </ol>
          </div>
          <div className={'dk-card' + (runs ? '' : ' wait') + (net ? '' : ' cut')} aria-live="polite">
            <div className="dk-map" aria-hidden="true">
              <div className="dk-site"><span className="av-kick">Your machine</span><div className="dk-slot">{local && <motion.span layoutId="dk-agent" className="dk-token" transition={SPRING}><Mark size={16} /></motion.span>}</div></div>
              <div className="dk-wire"><i /><i /><b>×</b></div>
              <div className="dk-site"><span className="av-kick">Hanzo Cloud</span><div className="dk-slot">{!local && <motion.span layoutId="dk-agent" className="dk-token" transition={SPRING}><Mark size={16} /></motion.span>}</div></div>
            </div>
            <p className="dk-stat"><b />{runs ? 'Running' : 'Waiting for the connection'}</p>
            <p className="dk-card-job">{job.trim() || 'An agent with no job yet.'}</p>
            <dl className="dk-card-dl">
              <div><dt className="x-mono">Model</dt><dd>{local ? 'Running on your machine' : 'On Hanzo Cloud'}</dd></div>
              <div><dt className="x-mono">Keys and data</dt><dd>{local ? 'Keys and the data an agent touches stay local.' : 'It is a setting on the agent, not a decision about the whole install.'}</dd></div>
            </dl>
            <p className="dk-say">{local ? 'With a local model pinned, an agent keeps running when the connection goes. Nothing has to be uploaded for it to do its job.' : runs ? 'Point one agent at a model running on your machine and another at one on Hanzo Cloud.' : 'Pin a local model and it keeps running when the connection goes.'}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- every system: three huge rows; pick one and the window above rebuilds in it. The spec opens in a drawer. ---------- */
function Everywhere({ os, setOs, mine }) {
  const show = (k) => {
    setOs(k);
    const el = document.getElementById('dk-stage'); if (!el) return;
    const y = el.getBoundingClientRect().top + scrollY - 96;
    window.__lenis ? window.__lenis.scrollTo(y, { duration: 1.2 }) : scrollTo({ top: y, behavior: 'smooth' });
  };
  return (
    <section className="av-sec dk-every">
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
              <button type="button" className={os === k ? 'on' : ''} aria-pressed={os === k} onClick={() => show(k)} data-cursor="Show">
                <span className="dk-ol-n">{n}{mine === k && <i className="dk-mine" aria-hidden="true" />}</span>
                <span className="dk-ol-a x-mono">{arch}</span>
                <span className="dk-ol-go" aria-hidden="true"><svg viewBox="0 0 16 16" width="20" height="20"><path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- the end: one action, the repo card, and the line to paste into an agent ---------- */
function End() {
  const text = 'Read https://hanzo.ai/skill.md and use Hanzo Desktop in my project.';
  return (
    <section className="av-sec dk-end">
      <div className="av-wrap av-grid dk-end-g">
        <div className="dk-end-l">
          <Lines as="h2" className="av-display s" lines={['Download it', 'and build one']} />
          <p className="av-lede">Pick a model, describe the job, hand it the tools. If the model is a local one, the whole thing runs without an account.</p>
          <div className="av-acts"><Go to={DOCS} solid>Download</Go><Go to={GH}>View on GitHub</Go></div>
          <div className="dk-rel">
            <p className="av-kick">Related capabilities</p>
            <div>{[['CLI', '/cli'], ['Playground', '/playground'], ['API Keys', '/cloud/api-keys']].map(([t, to]) => <A key={t} to={to} className="dk-rel-a">{t}</A>)}</div>
            <A to={DOCS} className="dk-docs">Desktop docs →</A>
          </div>
        </div>
        <div className="dk-get">
          <span className="dk-get-i"><Mark size={26} /></span>
          <h3 className="av-title">Get Desktop</h3>
          <p className="dk-get-d">Desktop client</p>
          <dl className="x-mono"><div><dt>License:</dt><dd>Apache-2.0</dd></div></dl>
          <div className="dk-get-acts">
            <A to={GH} className="dk-gh x-mono">hanzoai</A>
            <Go to="https://platform.hanzo.ai/deploy" solid>Deploy to Cloud</Go>
            <Go to={DOCS}>Self-host</Go>
          </div>
        </div>
      </div>
      <div className="av-wrap dk-paste">
        <div className="dk-paste-l">
          <p className="av-title">Paste and ship</p>
          <p className="av-body">Paste this into any agent. It reads the skill manifest and calls Desktop from there.</p>
        </div>
        <div className="dk-prompt">
          <span className="av-kick">Agent prompt</span>
          <code>{text}</code>
          <Copy text={text} />
        </div>
      </div>
    </section>
  );
}

export default function DesktopPage() {
  const [os, setOs, mine] = useOs();
  return (
    <main className="av dk" style={{ '--ac': '#0a9cff' }}>
      <Hero os={os} setOs={setOs} mine={mine} />
      <Build />
      <Offline />
      <Everywhere os={os} setOs={setOs} mine={mine} />
      <End />
    </main>
  );
}
