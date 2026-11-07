'use client';
/* Hanzo Desktop. Signature: the app assembling itself on your own desktop. The page reads your system and draws its
   desktop (macOS menu bar and dock, Windows taskbar, Linux panel); the Hanzo window lifts out of the dock, its parts
   arrive, and then it builds one thing: Hanzo's example of rate limiting the payments API, file written, tests passing.
   Switch the system and it rebuilds there. The six things you can build are a dark room where one agent card changes
   with each point as you read. Beyond: "Cut the network" - make an agent in the page (a job, a model on your machine
   or on Hanzo Cloud), then switch the connection off and see which keeps running, and where its keys and data stay.
   Every word is Hanzo's; the job is an example. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { EASE, Rise, Copy, Mark, useTilt } from '../ui';
import { A, Go, More, SecHead } from '../kit';
import './DesktopPage.css';

const DOCS = 'https://docs.hanzo.ai/docs/apps/desktop';
const OSES = [['mac', 'macOS', 'arm64 + intel'], ['win', 'Windows', 'x64 + arm64'], ['linux', 'Linux', 'deb + rpm + AppImage']];

function useOs() {
  const [os, setOs] = useState('mac');
  useEffect(() => {
    const p = ((navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || '').toLowerCase();
    if (/win/.test(p)) setOs('win');
    else if (/linux|x11/.test(p) && !/android/i.test(navigator.userAgent)) setOs('linux');
  }, []);
  return [os, setOs];
}

const MSGS = [
  ['you', 'Add rate limiting to the payments API.'],
  ['ai', 'Read 14 files. The limiter belongs in the gateway, not the handler — one place, every route.'],
  ['ai', 'Wrote gateway/limit.go and a test at 100 req/min per key. Tests pass.'],
];

/* The desktop: chrome for the system, then the window, then the build. step 0..6 */
function Screen({ os }) {
  const ref = useRef(null);
  const seen = useInView(ref, { amount: 0.35 });
  const calm = useReducedMotion();
  const [step, setStep] = useState(6);
  const typed = useRef(null);
  useEffect(() => {
    if (!seen || calm) { setStep(6); return; }
    let alive = true, t = 0;
    const wait = (ms) => new Promise((r) => { t = setTimeout(r, ms); });
    (async () => {
      while (alive) {
        setStep(0); await wait(500);
        setStep(1); await wait(900); // window lifts out of the dock
        setStep(2); await wait(500); // chrome and tabs
        setStep(3);
        const el = typed.current, q = MSGS[0][1];
        for (let i = 1; i <= q.length && alive; i++) { if (el) el.textContent = q.slice(0, i); await wait(32); }
        await wait(500); if (!alive) return;
        setStep(4); await wait(1500);
        setStep(5); await wait(1300);
        setStep(6); await wait(6000);
      }
    })();
    return () => { alive = false; clearTimeout(t); };
  }, [seen, calm, os]);
  return (
    <div className={'dsk-screen os-' + os} ref={ref}>
      <div className="dsk-wall" aria-hidden="true" />
      {os === 'mac' && <div className="dsk-menubar" aria-hidden="true"><i className="dot" /><b /><b /><b /><span className="r"><b /><b /></span></div>}
      {os === 'linux' && <div className="dsk-panel" aria-hidden="true"><b /><span className="c" /><span className="r"><b /><b /></span></div>}
      <AnimatePresence>
        {step >= 1 && (
          <motion.div key={'w' + os} className="dsk-win" initial={{ opacity: 0, scale: 0.12, y: 260 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.25 } }} transition={{ type: 'spring', stiffness: 120, damping: 18 }}>
            <div className="dsk-title">
              {os !== 'win' && <span className="dsk-lights" aria-hidden="true"><i /><i /><i /></span>}
              <span className="dsk-name"><b>Desktop</b> — Hanzo</span>
              {os === 'win' && <span className="dsk-ctl" aria-hidden="true"><i /><i /><i /></span>}
            </div>
            <motion.nav className="dsk-tabs" aria-label="Hanzo apps" initial={false} animate={{ opacity: step >= 2 ? 1 : 0 }} transition={{ duration: 0.4 }}>
              <A to="/desktop" className="on">Desktop</A><A to="/cli">CLI</A><A to="/playground">Playground</A><A to="/cloud/api-keys">API Keys</A>
            </motion.nav>
            <div className="dsk-body">
              <motion.ul className="dsk-files" aria-hidden="true" initial={false} animate={{ opacity: step >= 2 ? 1 : 0, x: step >= 2 ? 0 : -12 }} transition={{ duration: 0.5, ease: EASE }}>
                <li className="dir">gateway</li>
                <li className={'new' + (step >= 5 ? ' on' : '')}>limit.go</li>
                <li className="dir">payments</li>
                <li className="dim" /><li className="dim" /><li className="dim short" />
              </motion.ul>
              <ul className="dsk-msgs">
                <li className={'dsk-you' + (step >= 3 ? ' on' : '')}><span ref={typed}>{MSGS[0][1]}</span></li>
                <li className={'dsk-ai' + (step >= 4 ? ' on' : '')}><Mark size={13} /><span>{MSGS[1][1]}</span></li>
                <li className={'dsk-ai' + (step >= 5 ? ' on' : '')}><Mark size={13} /><span>{MSGS[2][1]}</span><svg className="dsk-ok" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-6.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></li>
                <li className={'dsk-open' + (step >= 6 ? ' on' : '')}><A to="https://hanzo.team/">Open in the console</A></li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {os === 'mac' && <div className="dsk-dock" aria-hidden="true"><i /><i /><i className={'me' + (step === 0 ? ' bounce' : '')}><Mark size={18} /></i><i /><i /></div>}
      {os === 'win' && <div className="dsk-task" aria-hidden="true"><i /><i /><i className="me"><Mark size={16} /></i><i /><i /></div>}
      {os === 'linux' && <div className="dsk-dock lin" aria-hidden="true"><i className="me"><Mark size={18} /></i><i /><i /><i /></div>}
    </div>
  );
}

function Hero({ os, setOs }) {
  return (
    <section className="dsk-hero" aria-labelledby="dsk-h1">
      <div className="x-wrap dsk-hero-grid">
        <div className="dsk-copy">
          <motion.p className="x-kick" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>Native Desktop Client</motion.p>
          <h1 id="dsk-h1" className="dsk-h1"><span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE }}>Hanzo Desktop</motion.span></span></h1>
          <motion.p className="dsk-lede" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.25 }}>Build agents on your own machine</motion.p>
          <motion.div className="dsk-acts" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}>
            <span data-thumb="Download" data-href={DOCS} style={{ display: 'contents' }}><Go to={DOCS} solid>Download</Go></span>
            <Go to="https://github.com/hanzoai">GitHub</Go>
          </motion.div>
          <motion.div className="dsk-os" role="tablist" aria-label="System" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }}>
            {OSES.map(([k, n]) => (
              <button key={k} type="button" role="tab" aria-selected={os === k} onClick={() => setOs(k)}>
                {os === k && <motion.span layoutId="dsk-os" className="dsk-os-bg" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                <span>{n}</span>
              </button>
            ))}
          </motion.div>
        </div>
        <motion.div className="dsk-stage" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: EASE, delay: 0.2 }}>
          <Screen os={os} />
          <p className="dsk-note">Example project. Every name in it is one you would give your own. <A to="/home">Open in the console</A></p>
        </motion.div>
      </div>
    </section>
  );
}

function Paste() {
  const text = 'Read https://hanzo.ai/skill.md and use Hanzo Desktop in my project.';
  return (
    <section className="dsk-paste">
      <div className="x-wrap dsk-paste-in">
        <div><p className="dsk-paste-k">Paste and ship</p><p className="dsk-paste-d">Paste this into any agent. It reads the skill manifest and calls Desktop from there.</p></div>
        <div className="dsk-prompt"><span className="x-mono dsk-prompt-k">Agent prompt</span><code>{text}</code><Copy text={text} /></div>
      </div>
    </section>
  );
}

/* Six things you can build, in the dark: one agent card that changes with the point you are reading. */
const POINTS = [
  ['Nothing to scaffold', 'An agent is made in the window: give it a job, some tools, and a model. There is no project to create first and no file to check in before it exists.'],
  ['Local model or cloud model, per agent', 'Point one agent at a model running on your machine and another at one on Hanzo Cloud. It is a setting on the agent, not a decision about the whole install.'],
  ['They work together', 'Agents share context and hand steps to each other, so a job that needs several of them is one workflow instead of you copying between three chat windows.'],
  ['It works with the network off', 'With a local model pinned, an agent keeps running when the connection goes. Nothing has to be uploaded for it to do its job.'],
  ['Your keys stay on your machine', 'Keys and the data an agent touches stay local. An agent that has to pay for something spends from a key you hold, on hardware you own.'],
  ['MCP is how it reaches your tools', 'Agents speak the Model Context Protocol, so a tool you have already connected elsewhere works here without a second integration written for this app.'],
];

function Card({ k }) {
  const field = (label, on) => <span className={'dsk-f' + (on ? ' on' : '')}><em>{label}</em><b /></span>;
  return (
    <div className={'dsk-card k' + k}>
      {k === 0 && <div className="dsk-agent"><span className="dsk-agent-h"><Mark size={16} /><b /></span>{field('job', 1)}{field('tools', 1)}{field('model', 1)}</div>}
      {k === 1 && (
        <div className="dsk-pair">
          <div className="dsk-agent sm"><span className="dsk-agent-h"><Mark size={14} /><b /></span><span className="dsk-pill local">Local</span></div>
          <div className="dsk-agent sm"><span className="dsk-agent-h"><Mark size={14} /><b /></span><span className="dsk-pill cloud">Hanzo Cloud</span></div>
        </div>
      )}
      {k === 2 && (
        <div className="dsk-chain">
          {[0, 1, 2].map((i) => <div key={i} className="dsk-agent xs"><span className="dsk-agent-h"><Mark size={13} /><b /></span></div>)}
          <i className="dsk-baton" />
        </div>
      )}
      {k === 3 && (
        <div className="dsk-off">
          <svg viewBox="0 0 48 48" width="64" height="64" aria-hidden="true"><path d="M8 20a24 24 0 0 1 32 0M14 27a15 15 0 0 1 20 0M20 34a6 6 0 0 1 8 0" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /><path d="M10 10l28 28" stroke="#ff453a" strokeWidth="3" strokeLinecap="round" /></svg>
          <div className="dsk-agent sm run"><span className="dsk-agent-h"><Mark size={14} /><b /></span><span className="dsk-spin" /></div>
        </div>
      )}
      {k === 4 && (
        <div className="dsk-lap">
          <div className="dsk-lap-s"><svg viewBox="0 0 48 48" width="56" height="56" aria-hidden="true"><circle cx="17" cy="24" r="8" fill="none" stroke="currentColor" strokeWidth="3" /><path d="M25 24h16M35 24v6M41 24v5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg></div>
          <div className="dsk-lap-b" />
        </div>
      )}
      {k === 5 && (
        <div className="dsk-mcp">
          <div className="dsk-agent sm"><span className="dsk-agent-h"><Mark size={14} /><b /></span></div>
          <span className="dsk-plug x-mono">MCP</span>
          <div className="dsk-tools">{[0, 1, 2, 3].map((i) => <i key={i} style={{ animationDelay: i * 0.3 + 's' }} />)}</div>
        </div>
      )}
    </div>
  );
}

function Point({ p, i, setAt }) {
  const ref = useRef(null);
  const lit = useInView(ref, { margin: '-45% 0px -45% 0px' });
  useEffect(() => { if (lit) setAt(i); }, [lit, i, setAt]);
  return (
    <li ref={ref} className={'dsk-pt' + (lit ? ' lit' : '')}>
      <span className="dsk-pt-n x-mono">{String(i + 1).padStart(2, '0')}</span>
      <h3>{p[0]}</h3>
      <p>{p[1]}</p>
      <div className="dsk-pt-card" aria-hidden="true"><Card k={i} /></div>
    </li>
  );
}

function Build() {
  const [at, setAt] = useState(0);
  return (
    <section className="x-sec dsk-dark" data-room="dark">
      <div className="x-wrap">
        <SecHead dark title="What you can build in it" lede="Free and open source. Download it, and the first agent is a few minutes of clicking." />
        <div className="dsk-build">
          <ol className="dsk-pts">{POINTS.map((p, i) => <Point key={p[0]} p={p} i={i} setAt={setAt} />)}</ol>
          <div className="dsk-sticky" aria-hidden="true">
            <div className="dsk-card-box">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div key={at} className="dsk-card-in" initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }} transition={{ duration: 0.55, ease: EASE }}>
                  <Card k={at} />
                </motion.div>
              </AnimatePresence>
              <span className="dsk-card-n x-mono">{String(at + 1).padStart(2, '0')} / 06</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Everywhere({ os, setOs }) {
  return (
    <section className="x-sec dsk-every">
      <div className="x-wrap">
        <SecHead title="Available everywhere you work" lede="Native installers for macOS (Apple Silicon + Intel), Windows, and Linux." />
        <div className="dsk-oses">
          {OSES.map(([k, n, arch], i) => (
            <Rise key={k} delay={i * 0.07}>
              <button type="button" className={'dsk-os-t os-' + k + (os === k ? ' on' : '')} onClick={() => { setOs(k); document.getElementById('dsk-h1')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }} aria-pressed={os === k}>
                <span className="dsk-os-g" aria-hidden="true"><i /><i /><i /></span>
                <span className="dsk-os-n">{n}</span>
                <span className="dsk-os-a x-mono">{arch}</span>
              </button>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  );
}

function End() {
  const { rx, ry, glow, on } = useTilt(4, 'rgba(0,0,0,.05)');
  return (
    <section className="x-sec dsk-end">
      <div className="x-wrap dsk-end-in">
        <div>
          <SecHead title="Download it and build one" lede="Pick a model, describe the job, hand it the tools. If the model is a local one, the whole thing runs without an account." />
          <div className="dsk-end-acts"><Go to={DOCS} solid>Download</Go><Go to="https://github.com/hanzoai">View on GitHub</Go></div>
          <div className="dsk-rel">
            <p className="x-kick">Related capabilities</p>
            <div>{[['CLI', '/cli'], ['Playground', '/playground'], ['API Keys', '/cloud/api-keys']].map(([t, to]) => <A key={t} to={to} className="dsk-rel-a">{t}</A>)}</div>
            <A to={DOCS} className="dsk-docs">Desktop docs →</A>
          </div>
        </div>
        <div>
          <motion.div className="dsk-repo" style={{ rotateX: rx, rotateY: ry }} {...on}>
            <motion.span className="x-mglow" style={{ background: glow }} aria-hidden="true" />
            <span className="dsk-repo-i"><Mark size={22} /></span>
            <h2>Get Desktop</h2>
            <p>Desktop client</p>
            <dl className="x-mono"><div><dt>License:</dt><dd>Apache-2.0</dd></div></dl>
            <div className="dsk-repo-acts">
              <A to="https://github.com/hanzoai" className="dsk-gh x-mono">hanzoai</A>
              <Go to="https://platform.hanzo.ai/deploy" solid>Deploy to Cloud</Go>
              <Go to={DOCS}>Self-host</Go>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* Cut the network: one agent, its model local or on Hanzo Cloud; the status says what Hanzo says happens. */
function Offline() {
  const [job, setJob] = useState('Add rate limiting to the payments API.');
  const [local, setLocal] = useState(true);
  const [net, setNet] = useState(true);
  const runs = local || net;
  return (
    <section className="x-sec dsk-off">
      <div className="x-wrap dsk-off-grid">
        <div>
          <p className="x-kick">It works with the network off</p>
          <h2>Cut the network</h2>
          <label className="dsk-off-f"><span>Give it a job</span><input value={job} onChange={(e) => setJob(e.target.value)} maxLength={90} /></label>
          <div className="dsk-off-row" role="radiogroup" aria-label="Model">
            <button type="button" role="radio" aria-checked={local} onClick={() => setLocal(true)}>Local model</button>
            <button type="button" role="radio" aria-checked={!local} onClick={() => setLocal(false)}>Hanzo Cloud</button>
          </div>
          <button type="button" role="switch" aria-checked={net} className={'dsk-off-net' + (net ? '' : ' off')} onClick={() => setNet(!net)}><i />{net ? 'Network on' : 'Network off'}</button>
        </div>
        <div className={'dsk-off-card' + (runs ? '' : ' wait')} aria-live="polite">
          <p className="dsk-off-k"><b className={runs ? 'ok' : ''} />{runs ? 'Running' : 'Waiting for the connection'}</p>
          <p className="dsk-off-job">{job.trim() || 'An agent with no job yet.'}</p>
          <dl>
            <div><dt>Model</dt><dd>{local ? 'Running on your machine' : 'On Hanzo Cloud'}</dd></div>
            <div><dt>Keys and data</dt><dd>{local ? 'Keys and the data an agent touches stay local.' : 'It is a setting on the agent, not a decision about the whole install.'}</dd></div>
          </dl>
          <p className="dsk-off-say">{local ? 'With a local model pinned, an agent keeps running when the connection goes. Nothing has to be uploaded for it to do its job.' : runs ? 'Point one agent at a model running on your machine and another at one on Hanzo Cloud.' : 'Pin a local model and it keeps running when the connection goes.'}</p>
        </div>
      </div>
    </section>
  );
}

export default function DesktopPage() {
  const [os, setOs] = useOs();
  return (
    <main className="dsk">
      <Hero os={os} setOs={setOs} />
      <Paste />
      <Build />
      <Offline />
      <Everywhere os={os} setOs={setOs} />
      <End />
    </main>
  );
}
