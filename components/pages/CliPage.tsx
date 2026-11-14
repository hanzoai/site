'use client';
// Signature: compare (Before / after slider, docs/MOTION-MAP.md): in the second screen, under "A resource tree, not a pile of flags", the visitor drags a divider across the CLI's own commands: left of it they lie as a pile of flags, right of it the same commands stand as the resource tree (pointer, finger on the handle, or arrow keys); on arrival it sweeps once, then rests
// Entrances: noise-dissolve (the statement and its slider), shutter (paste and ship), side-carousel (the capabilities rail), curtain-rise (get started), cursor-trail (the closing band)
// Beyond: Add to the script: the install script takes any of the binary's own commands (scan, share, status, link, auth show) as one press each, under Hanzo's own heading for it, and every block and the whole script copy as you built them
// Persona: a developer deciding whether to put one more binary on their path.
// Goal: install the CLI (the line is right there to copy) after seeing it work in a real session.
// CTA: Install from hanzo.sh (docs.hanzo.ai/docs/cli): hero solid (data-thumb) + the closing band; everything else is a text link. On desktop the shared header swaps to the same ask after the hero; phone header label requested in docs/build-notes/requests/cli.md.
// Metric: api_key_created (developer: copy the install line, then sign in with hanzo auth login)
/* Hanzo CLI (Archetype: Developer, terminal-first, code as the hero).
   V2: 8/10 motion-map pass: the signature is now the before / after slider (pile of flags vs resource tree) right after the hero; the five main sections each enter a different way (noise-dissolve, shutter, side-carousel, curtain-rise, cursor-trail), once, on scroll into view; the h2 line-mask cut-ins and the sticky builder column are gone; the typing hero terminal stays (approved). Round 4: the hero session is masked from first paint and only grows (0 resets); the tree starts fully open so the tour never reflows rows (phone CLS 0.0017); one caret steps down the band's places; the script window arrives block by block while its line count rolls up; rail cards fit their content; tree window outlined only; ending runs on (145/44 px). Round 3:the hero ask is the one pure-white solid on the black room (was the room's #f5f5f7 grey); the h1 cuts in on first paint and the session waits for fonts plus that cut-in before typing; "Hanzo CLI · Developers" moved from the bar above the h1 to the status line below it; the three claims are small terminal windows that type their command in (stepped clip) with the missing verb struck after; h2s use page-local cli/Cut (no reduced-motion hydration error, legible with JS off); resting carets keep the hero, prompt and script alive; 44 px tabs; every hover answers
   Motion: signature = the compare slider (cli/Compare.jsx); the hero terminal still types Hanzo's own session (approved, kept).
   Entrances: cli/enter.jsx + enter.css. Supporting: the tree's gliding selection (layoutId, 300 ms), the added script block and
   claim windows that wipe in (clip), the script line count roll. Colour: Hanzo's deck greys only. Every word is Hanzo's. */
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { EASE, Copy, Mark } from '../ui';
import { A, Cta } from '../kit';
import { play } from '../../lib/sound';
import Lines from './cli/Cut';
import Compare from './cli/Compare';
import { Enter, Trail } from './cli/enter';
import './cli/enter.css';
import '../v2/AppType.css';
import './CliPage.css';

const DOCS = 'https://docs.hanzo.ai/docs/cli';
const GH = 'https://github.com/hanzoai/cli';
const SESSION = [['$', 'hanzo'], ['>', 'deploy the gateway to staging'], ['·', 'reading the project'], ['✓', 'gateway is on staging']];
const SPIN = '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏';
const INSTALL = 'curl -fsSL https://hanzo.sh | sh';

/* ---------- the hero: the first screen is one terminal; Hanzo's example session types and streams in it ----------
   Every line keeps its full text as an invisible ghost, so a line being typed never changes its height. */
interface SessionProps {
  onDone: React.Dispatch<React.SetStateAction<boolean>>;
  paused: boolean;
  runKey: number;
}
function Session({ onDone, paused, runKey }: SessionProps) {
  const box = useRef<HTMLUListElement>(null);
  const seen = useInView(box, { amount: 0.3 });
  const calm = useReducedMotion();
  const rows = useRef([]);
  const spin = useRef<HTMLSpanElement>(null);
  const hold = useRef(paused);
  hold.current = paused;
  const ran = useRef(-1);
  const [n, setN] = useState(SESSION.length + 1); // the whole session is in the HTML (the final frame) for JS off and reduced motion
  // with JS on, the rows are masked from first paint (`.js .cli-sess:not(.live)`), so the session only ever grows: never shown, wiped and retyped
  const [live, setLive] = useState(false);
  useEffect(() => { onDone(n > SESSION.length); }, [n, onDone]);
  useEffect(() => {
    const fill = () => rows.current.forEach((el, i) => { if (el) el.textContent = SESSION[i][1]; });
    if (calm) { fill(); setN(SESSION.length + 1); setLive(true); return; }
    if (!seen || ran.current === runKey) return;
    ran.current = runKey;
    let alive = true, t = 0;
    const sleep = (ms: number) => new Promise((r) => { t = setTimeout(r, ms); });
    const wait = async (ms: number) => { await sleep(ms); while (alive && hold.current) await sleep(150); };
    const run = async () => {
      rows.current.forEach((el, i) => { if (el && i < 2) el.textContent = ''; });
      setN(1);
      setLive(true);
      // the h1 paints first: wait for the fonts and the h1's own cut-in (about 760 ms) before the first keystroke
      if (runKey === 0) { try { await Promise.race([document.fonts?.ready, new Promise((r) => setTimeout(r, 1200))]); } catch {} await wait(Math.max(60, 900 - performance.now())); }
      else await wait(350);
      for (let i = 0; i < SESSION.length && alive; i++) {
        setN(i + 1);
        const el = rows.current[i], txt = SESSION[i][1];
        if (i < 2) {
          await wait(i ? 380 : 60);
          for (let k = 1; k <= txt.length && alive; k++) { el.textContent = txt.slice(0, k); await wait(i ? 38 + (k % 5) * 6 : 95); }
          await wait(420);
        } else if (i === 2) {
          for (let f = 0; f < 24 && alive; f++) { if (spin.current) spin.current.textContent = SPIN[f % SPIN.length]; await wait(80); }
        } else await wait(260);
      }
      if (alive) { setN(SESSION.length + 1); play('done'); } // it ends at rest on the final frame, with the faint chime
    };
    run();
    return () => { alive = false; clearTimeout(t); fill(); setN(SESSION.length + 1); setLive(true); };
  }, [seen, calm, runKey]);
  return (
    <ul className={'cli-lines cli-sess' + (live ? ' live' : '')} ref={box}>
      {SESSION.map(([p, t], i) => (
        <li key={t} className={'cli-l k' + i + (i < n ? ' on' : '')}>
          <span className="cli-p" aria-hidden={i > 1 ? 'true' : undefined}>{p}</span>
          <span className="cli-tx">
            <span className="cli-ghost" aria-hidden="true">{t}</span>
            <span className="cli-typed"><span ref={(el) => (rows.current[i] = el)}>{t}</span>{((i === n - 1 && i < 2) || (i === SESSION.length - 1 && n > SESSION.length)) && <span className="cli-caret" aria-hidden="true" />}</span>
          </span>
          {i === 2 && <span className={'cli-spin' + (n === 3 ? ' on' : '')} ref={spin} aria-hidden="true">{SPIN[0]}</span>}
        </li>
      ))}
    </ul>
  );
}

const IconPause = () => <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M5.5 3.5v9M10.5 3.5v9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
const IconPlay = () => <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M5 3.5v9l7-4.5z" fill="currentColor" /></svg>;
const IconReplay = () => <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3.5 8a4.5 4.5 0 1 0 1.3-3.2M3.5 3v2.5H6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;

function Hero() {
  const [done, setDone] = useState(true);
  const [paused, setPaused] = useState(false);
  const [runKey, setRunKey] = useState(0);
  const ctl = () => { if (done) { setPaused(false); setRunKey((k) => k + 1); } else setPaused((p) => !p); };
  return (
    <section className="cli-hero av-dark" data-room="dark" aria-labelledby="cli-h1">
      <div className="cli-term" data-morph-target="">
        <div className="cli-bar">
          <span className="cli-dots" aria-hidden="true"><i /><i /><i /></span>
          <nav className="cli-tabs" aria-label="Hanzo apps">
            <A to="/cli" className="on" aria-current="page"><b>CLI</b> — Hanzo</A>
            <A to="/playground">Playground</A>
            <A to="/desktop">Desktop</A>
            <A to="/cloud/api-keys">API Keys</A>
          </nav>
          <button type="button" className="cli-ctl" onClick={ctl} aria-label={done ? 'Replay' : 'Pause'} aria-pressed={done ? undefined : paused}>
            {done ? <IconReplay /> : paused ? <IconPlay /> : <IconPause />}
          </button>
        </div>
        <div className="cli-body">
          <h1 id="cli-h1" className="av-display cli-h1"><span className="cli-m"><span>An AI engineer</span></span> <span className="cli-m"><span>in your terminal</span></span></h1>
          <p className="av-lede cli-lede">Type hanzo in a repo and you get a coding session. Type hanzo and a noun and you get the rest of the cloud — identity, usage, billing, clusters, machines, networks — typed straight from the API&apos;s own document.</p>
          <Session onDone={setDone} paused={paused} runKey={runKey} />
          <div className="cli-acts">
            <div className="cli-acts-row">
              <Cta to={DOCS} id="cli.hero" thumb size="lg">Install from hanzo.sh</Cta>
              <Cta to={GH} kind="link" id="cli.hero-github">View on GitHub</Cta>
            </div>
            <div className="cli-inst">
              <code><span aria-hidden="true">$ </span>{INSTALL}</code>
              <Copy text={INSTALL} />
            </div>
          </div>
          <div className={'cli-open' + (done ? ' on' : '')}>
            <Cta to="https://hanzo.team/" kind="link" id="cli.hero-console">Open in the console</Cta>
            <p className="cli-note">Example project. Every name in it is one you would give your own.</p>
          </div>
        </div>
        <div className="cli-status">
          <p>Open source (MIT). One static Rust binary — macOS and Linux on amd64 and arm64, Windows on amd64. No runtime, no daemon.</p>
          <span className="cli-who x-mono">Hanzo CLI · Developers</span>
        </div>
      </div>
    </section>
  );
}

/* ---------- paste and ship: the agent prompt is the big line, the label sits beside it ---------- */
function Paste() {
  const text = 'Read https://hanzo.ai/skill.md and use Hanzo CLI in my project. Start with: hanzo auth login';
  return (
    // entrance 2, shutter: two ink bars close from top and bottom, then open on the agent prompt
    <Enter kind="shutter" as="section" className="cli-paste">
      <i className="cli-shut t" aria-hidden="true" />
      <i className="cli-shut b" aria-hidden="true" />
      <div className="av-wrap av-grid">
        <div className="cli-prompt">
          <code>{text}<span className="cli-caret cli-prompt-caret" aria-hidden="true" /></code>
          <Copy text={text} />
          <span className="cli-prompt-k x-mono">Agent prompt</span>
        </div>
        <div className="cli-paste-r">
          <p className="av-title">Paste and ship</p>
          <p className="av-body">Paste this into any agent. It reads the skill manifest and calls CLI from there.</p>
        </div>
      </div>
    </Enter>
  );
}

/* ---------- the resource tree: open a resource like a folder; the command it prints fills the pane ---------- */
const TREE = [
  ['auth', [['login', 'hanzo auth login', 'Sign in. Interactive picker, or name a provider.'], ['show', 'hanzo auth show', 'hanzo auth show says which one is answering right now.']]],
  ['usage', [['summary', 'hanzo usage summary', 'What did that cost, and what is left']]],
  ['billing', [['balance', 'hanzo billing balance', 'What did that cost, and what is left']]],
  ['serve', [['cloud', 'hanzo serve cloud', 'hanzo serve cloud starts the whole API locally, or name one service — iam, kms, gateway, storage, pubsub.'], ...['iam', 'kms', 'gateway', 'storage', 'pubsub'].map((s) => [s, 'hanzo serve ' + s, 'hanzo serve cloud starts the whole API locally, or name one service — iam, kms, gateway, storage, pubsub.'])]],
  ['engine', [['serve', 'hanzo engine serve <model>', 'hanzo engine serve puts a model on a local endpoint.']]],
  ['share', [['3000', 'hanzo share 3000', 'hanzo share 3000 publishes a service over the zero-trust fabric while the port stays bound to localhost.'], ['--name', 'hanzo share 3000 --name', 'Pass --name to keep the same subdomain next time.']]],
  ['scan', [['', 'hanzo scan', 'hanzo scan walks a path for exposed credentials and exits non-zero when it finds one, which is what makes it usable as a hook rather than a habit.']]],
  ['status', [['', 'hanzo status', 'hanzo status leads with what is broken, then clusters, applications and the machines on your fleet.']]],
  ['link', [['', 'hanzo link', 'hanzo link publishes the terminal you are in so the console can watch it — or drive it.'], ['--read-only', 'hanzo link --read-only', '--read-only when you would rather be watched than typed at.']]],
];
const TOUR = [[0, 0], [5, 0], [3, 0], [6, 0], [4, 0], [8, 1], [1, 0]];

interface PrintProps {
  cmd: string;
  desc: string;
}
function Print({ cmd, desc }: PrintProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const calm = useReducedMotion();
  const first = useRef(cmd); // the first command is the server frame: its description is in the HTML at full opacity
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (calm) { el.textContent = cmd; return; }
    let i = 0, t = 0;
    el.textContent = '';
    const step = () => { el.textContent = cmd.slice(0, ++i); if (i < cmd.length) t = setTimeout(step, 26); };
    t = setTimeout(step, 90);
    return () => { clearTimeout(t); el.textContent = cmd; };
  }, [cmd, calm]);
  return (
    <div className="cli-print">
      <p className="cli-cmd">
        <span className="cli-pp" aria-hidden="true">$</span>
        <span className="cli-tx">
          <span className="cli-ghost" aria-hidden="true">{cmd}</span>
          <span className="cli-typed"><span ref={ref}>{cmd}</span><span className="cli-caret" aria-hidden="true" /></span>
        </span>
      </p>
      <motion.p className="cli-what" key={desc + cmd} initial={calm || cmd === first.current ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE, delay: Math.min(0.9, cmd.length * 0.026 + 0.15) }}>
        <span aria-hidden="true"># </span>{desc}
      </motion.p>
    </div>
  );
}

function Tree() {
  // fixed row slots: every folder starts open, so the self-running tour never opens or collapses a row (no reflow, no layout shift);
  // it only moves the selection and scrolls the tree's own pane to it. A press still opens and closes folders by hand.
  const [open, setOpen] = useState(() => new Set(TREE.map((_, r) => r)));
  const pane = useRef<HTMLUListElement>(null);
  const [over, setOver] = useState(false);
  const [sel, setSel] = useState([0, 0]);
  const [mine, setMine] = useState(false);
  const [k, setK] = useState(0);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { amount: 0.35 });
  const rm = useReducedMotion();
  const [up, setUp] = useState(false);
  useEffect(() => setUp(true), []);
  const calm = up && rm; // the server and the first client render agree; reduced motion applies after mount
  const touring = !mine && !calm && k < TOUR.length - 1;
  useEffect(() => {
    if (!touring || !seen || paused || over) return; // it walks the tree once, then rests; a press anywhere hands it to you; it holds while a pointer is over the window
    const t = setTimeout(() => {
      const nk = k + 1, [r, c] = TOUR[nk];
      setK(nk); setSel([r, c]);
      const ul = pane.current, li = ul?.querySelectorAll(':scope > li')[r];
      if (ul && li) ul.scrollTo({ top: Math.max(0, li.offsetTop - 12), behavior: 'smooth' }); // the pane scrolls, never the page
    }, 3800);
    return () => clearTimeout(t);
  }, [k, touring, seen, paused, over]);
  const toggle = (r: number) => { setMine(true); setOpen((o) => { const s = new Set(o); s.has(r) ? s.delete(r) : s.add(r); return s; }); };
  const pick = (r: number, c: number) => { setMine(true); setSel([r, c]); };
  const [res, cmds] = TREE[sel[0]];
  const [leaf, cmd, desc] = cmds[sel[1]];
  return (
    <div className="cli-fs" ref={ref} onPointerEnter={(e) => e.pointerType === 'mouse' && setOver(true)} onPointerLeave={() => setOver(false)}>
      <div className="cli-fs-bar">
        <span className="cli-crumb x-mono" aria-label="Path">
          <Mark size={13} /><span>hanzo</span><i aria-hidden="true">/</i><span>{res}</span>{leaf && <><i aria-hidden="true">/</i><b>{leaf}</b></>}
        </span>
        <span className="cli-fs-k x-mono">What is Hanzo CLI</span>
        <button type="button" className="cli-ctl light" onClick={() => setPaused((p) => !p)} aria-label="Pause" aria-pressed={paused} hidden={!touring}>{paused ? <IconPlay /> : <IconPause />}</button>
      </div>
      <div className="cli-fs-main">
        <ul className="cli-tree" role="tree" aria-label="hanzo" ref={pane}>
          {TREE.map(([name, list], r) => {
            const isOpen = open.has(r);
            const last = r === TREE.length - 1;
            return (
              <li key={name} role="treeitem" aria-expanded={isOpen} className={'cli-res' + (isOpen ? ' open' : '')}>
                <button type="button" className={'cli-node' + (sel[0] === r ? ' path' : '')} onClick={() => toggle(r)} data-sound="tick">
                  <span className="cli-gl x-mono" aria-hidden="true">{last ? '└─' : '├─'}</span>
                  <svg className="cli-dir" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M2 4.5A1.5 1.5 0 0 1 3.5 3h3l1.5 1.5h4.5A1.5 1.5 0 0 1 14 6v5.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 11.5z" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg>
                  <span className="x-mono cli-node-t">{name}</span>
                  <span className="cli-n x-mono av-num">{list.length}</span>
                </button>
                <ul role="group" className="cli-cmds" hidden={!isOpen}>
                  {list.map(([c, line], ci) => {
                    const on = sel[0] === r && sel[1] === ci;
                    return (
                      <li key={line} role="treeitem" aria-selected={on} style={{ '--i': ci }}>
                        <button type="button" className={'cli-leaf' + (on ? ' on' : '')} onClick={() => pick(r, ci)} data-sound="tick">
                          {on && <motion.span layoutId="cli-leaf" className="cli-leaf-bg" transition={{ duration: 0.3, ease: EASE }} />}
                          <span className="cli-gl x-mono" aria-hidden="true">{last ? '   ' : '│  '}{ci === list.length - 1 ? '└─' : '├─'}</span>
                          <span className="x-mono">{c || name}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ul>
        <div className="cli-out" aria-live="polite">
          <Print cmd={cmd} desc={desc} />
          <div className="cli-out-f">
            <Copy text={cmd.replace(' <model>', '')} label="Copy command" />
            <A to="/home" className="cli-out-a">Open in the console</A>
          </div>
        </div>
      </div>
    </div>
  );
}

/* the three claims, each as the command it is about; the last one does not exist, so it is struck out */
const WHAT = [
  ['hanzo', 'A coding session, metered', 'Bare hanzo runs our dev agent with the Hanzo toolset attached and the model calls billed to your organization. Point it at claude or codex instead and it drives an agent you already have.'],
  ['hanzo serve cloud', 'Run the cloud on your machine', 'hanzo serve cloud starts the whole API locally, or name one service — iam, kms, gateway, storage, pubsub. hanzo engine serve puts a model on a local endpoint.'],
  ['hanzo api', 'No raw-path escape hatch', 'There is no hanzo api verb and no URL to hand-write. Every cloud capability arrives as a typed subcommand, which is what keeps the CLI and the API from disagreeing.'],
];

interface ClaimProps {
  c: string;
  t: string;
  d: string;
  i: number;
}
function Claim({ c, t, d, i }: ClaimProps) {
  const ref = useRef<HTMLLIElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.6 });
  return (
    <li ref={ref} className={(i === 2 ? 'no ' : '') + (seen ? 'in' : '')} style={{ '--n': c.length + 2 }}>
      <span className="cli-win" aria-hidden="true">
        <span className="cli-win-bar"><i /><i /><i /><b className="x-mono av-num">{String(i + 1).padStart(2, '0')}</b></span>
        <span className="cli-three-c x-mono"><span className="cli-win-l"><span>$ </span>{i === 2 ? <s>{c}</s> : c}</span><span className="cli-caret" /></span>
      </span>
      <h3 className="av-title"><span className="cli-three-n x-mono av-num">{String(i + 1).padStart(2, '0')}</span><span>{t}</span></h3>
      <p className="av-body">{d}</p>
    </li>
  );
}

function What() {
  const [go, setGo] = useState(false);
  return (
    <section className="av-sec cli-what-sec" aria-labelledby="cli-tree-h">
      <div className="av-wrap">
        {/* entrance 1, noise-dissolve: the statement and its before / after slider (the signature) dissolve in from grain */}
        <Enter kind="noise" className="cli-what-in" onIn={() => setGo(true)}>
          <span className="cli-noise" aria-hidden="true" />
          <div className="cli-what-top">
            <Lines as="h2" id="cli-tree-h" className="av-display s cli-tree-h" lines={['A resource tree,', 'not a pile of flags']} />
            <p className="av-lede cli-what-lede">hanzo &lt;resource&gt; &lt;command&gt;. The resources beyond the hand-written ones are generated from the OpenAPI documents, so the CLI can only ask for things the API has.</p>
          </div>
          <Compare tree={TREE} labelledBy="cli-tree-h" go={go} />
        </Enter>
        <Tree />
        <ol className="cli-three">
          {WHAT.map(([c, t, d], i) => <Claim key={t} c={c} t={t} d={d} i={i} />)}
        </ol>
      </div>
    </section>
  );
}

/* ---------- capabilities: the binary's --help as a rail of commands you swipe and copy ---------- */
const CAPS = [
  ['hanzo auth show', 'Several identities at once', 'Hold as many principals as you need and switch between them. A second login never clobbers the first, and hanzo auth show says which one is answering right now.'],
  ['--token -', 'Secrets arrive on stdin', 'Pass --token - and the credential is read from the pipe, never from argv — so nothing lands in shell history, ps, or a CI log. It is stored in the OS keychain, or an owner-only file where there is none.'],
  ['hanzo share 3000', 'A public URL for a local port', 'hanzo share 3000 publishes a service over the zero-trust fabric while the port stays bound to localhost. Pass --name to keep the same subdomain next time.'],
  ['hanzo scan', 'Find the secret before the commit', 'hanzo scan walks a path for exposed credentials and exits non-zero when it finds one, which is what makes it usable as a hook rather than a habit.'],
  ['hanzo status', 'The whole cloud, unhealthy first', 'hanzo status leads with what is broken, then clusters, applications and the machines on your fleet. The thing you needed to know is the first line, not the last.'],
  ['hanzo link', 'Put this shell on the fabric', 'hanzo link publishes the terminal you are in so the console can watch it — or drive it. --read-only when you would rather be watched than typed at.'],
];

function Caps() {
  const rail = useRef<HTMLUListElement>(null);
  const [edge, setEdge] = useState([true, false]);
  const onScroll = () => {
    const el = rail.current; if (!el) return;
    setEdge([el.scrollLeft < 8, el.scrollLeft + el.clientWidth > el.scrollWidth - 8]);
  };
  const go = (d: number) => {
    const el = rail.current; if (!el) return;
    const card = el.querySelector('li');
    el.scrollBy({ left: d * ((card?.offsetWidth || 360) + 20), behavior: 'smooth' });
  };
  return (
    // entrance 3, side-carousel: the cards ride in from the right one after another and snap into the rail
    <Enter kind="carousel" as="section" className="av-sec cli-caps" aria-labelledby="cli-caps-h">
      <div className="av-wrap av-grid cli-caps-top">
        <Lines as="h2" id="cli-caps-h" className="av-head cli-caps-h" lines={['What the binary carries']} />
        <div className="cli-caps-r">
          <p className="cli-help-k x-mono">Capabilities <span aria-hidden="true">· $ hanzo --help<span className="cli-caret" /></span></p>
          <div className="cli-arrows">
            <button type="button" onClick={() => go(-1)} disabled={edge[0]} aria-label="Previous capability"><svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true"><path d="M10 3.5 5.5 8l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
            <button type="button" onClick={() => go(1)} disabled={edge[1]} aria-label="Next capability"><svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true"><path d="M6 3.5 10.5 8 6 12.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
          </div>
        </div>
      </div>
      <ul className="cli-rail" ref={rail} onScroll={onScroll} aria-label="Capabilities">
        {CAPS.map(([c, t, d], i) => (
          <li key={t} className="cli-cap" style={{ '--c': i }}>
            <div className="cli-cap-cmd">
              <code><span aria-hidden="true">$ </span>{c}</code>
              <Copy text={c} label={'Copy ' + c} />
            </div>
            <h3 className="av-title"><span className="cli-cap-n x-mono av-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span><span>{t}</span></h3>
            <p>{d}</p>
          </li>
        ))}
      </ul>
    </Enter>
  );
}

/* ---------- get started: the install script, and the Beyond builder that adds the binary's own commands ---------- */
const SCRIPT = `# Install the CLI — the same line Hanzo prints everywhere
curl -fsSL https://hanzo.sh | sh
npm i -g hanzo

# Sign in. Interactive picker, or name a provider.
hanzo auth login

# Bare hanzo IS a coding session in this repo
hanzo

# ...or hand it the task and let it run headless
hanzo "add rate limiting to the /v1/chat endpoint"

# What did that cost, and what is left
hanzo usage summary
hanzo billing balance`;
const BASE = SCRIPT.split('\n\n');
const EXTRA = CAPS.filter(([c]) => c.startsWith('hanzo ')).map(([c, t]) => ['# ' + t + '\n' + c, t, c]);

interface BlockProps {
  b: string;
  i: number;
  added: boolean;
  last: boolean;
}
function Block({ b, i, added, last }: BlockProps) {
  const [c, ...lines] = b.split('\n');
  const calm = useReducedMotion();
  const body = (
    <>
      <span className="cli-blk-n x-mono av-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
      <pre><span className="cli-c">{c}</span>{'\n'}{lines.map((l, j) => <span key={l} className="cli-ln">{l}{last && j === lines.length - 1 && <span className="cli-caret" aria-hidden="true" />}{'\n'}</span>)}</pre>
      <Copy text={lines.join('\n')} label="Copy" className="cli-blk-cp" />
    </>
  );
  if (!added) return <div className="cli-blk" style={{ '--i': i }}>{body}</div>;
  return (
    <motion.div className="cli-blk add" initial={calm ? false : { clipPath: 'inset(0 100% 0 0)', opacity: 0.4 }} animate={{ clipPath: 'inset(0 0% 0 0)', opacity: 1 }} transition={{ duration: 0.5, ease: EASE }}>
      {body}
    </motion.div>
  );
}

/* the script's line count rolls to its value: from 0 as the window arrives (in step with the blocks wiping in), then from the old
   count to the new one each time a block is added or removed. The true value is in the HTML; tabular numerals, fixed ch width. */
function Roll({ value, go }) {
  const ref = useRef<HTMLSpanElement>(null);
  const from = useRef(null);
  const calm = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (calm || !go) { el.textContent = value; if (go) from.current = value; return; }
    const a = from.current ?? 0, b = value, t0 = performance.now(), dur = a === 0 ? 900 : 400;
    from.current = b;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(a + (b - a) * e);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); el.textContent = b; };
  }, [value, go, calm]);
  return <span ref={ref} className="cli-roll">{value}</span>;
}

function Start() {
  const [add, setAdd] = useState<number[]>([]);
  const blocks = [...BASE, ...add.map((i) => EXTRA[i][0])];
  const flip = (i: number) => setAdd((a) => (a.includes(i) ? a.filter((x) => x !== i) : [...a, i]));
  const lines = blocks.join('\n\n').split('\n').length;
  const win = useRef<HTMLDivElement>(null);
  const arrived = useInView(win, { once: true, amount: 0.3 });
  return (
    // entrance 4, curtain-rise: the builder and its script rise from below behind a clip
    <Enter kind="curtain" as="section" className="av-sec cli-start" aria-labelledby="cli-start-h">
      <div className="av-wrap av-grid">
        <div className="cli-start-l">
          <Lines as="h2" id="cli-start-h" className="av-head" lines={['Install, sign in,', 'start working']} />
          <div className="cli-start-links">
            <Cta to={DOCS} kind="link" id="cli.start-docs">Read the docs</Cta>
            <Cta to={GH} kind="link" id="cli.start-github">View on GitHub</Cta>
          </div>
          <div className="cli-add" role="group" aria-labelledby="cli-add-k">
            <p id="cli-add-k" className="cli-add-k">Add to the script</p>
            {EXTRA.map(([, t, c], i) => {
              const on = add.includes(i);
              return (
                <button key={c} type="button" aria-pressed={on} onClick={() => flip(i)}>
                  <span className="cli-chk" aria-hidden="true"><svg viewBox="0 0 16 16" width="14" height="14"><path d={on ? 'M3.5 8.5l3 3 6-6.5' : 'M8 3.5v9M3.5 8h9'} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                  <span className="cli-add-t">{t}</span>
                  <span className="cli-add-c x-mono">{c}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div className={'cli-script av-obj' + (arrived ? ' in' : '')} ref={win}>
          <div className="cli-script-bar">
            <span className="cli-script-t">Get started</span>
            <span className="x-mono">bash</span>
            <span className="cli-script-n x-mono av-num"><span aria-hidden="true"><Roll value={lines} go={arrived} /> lines</span><span className="x-vh" aria-live="polite">{lines} lines</span></span>
            <Copy text={blocks.join('\n\n')} label="Copy script" />
          </div>
          <div className="cli-script-body">
            {blocks.map((b, i) => <Block key={b} b={b} i={i} added={i >= BASE.length} last={i === blocks.length - 1} />)}
          </div>
        </div>
      </div>
    </Enter>
  );
}

/* ---------- the repository, then the one ending ---------- */
function Get() {
  return (
    <section className="av-sec tight cli-get-sec" aria-labelledby="cli-get-h">
      <div className="av-wrap av-grid cli-get">
        <div className="cli-repo">
          <div className="cli-repo-h">
            <h2 id="cli-get-h" className="av-head">Get CLI</h2>
            <p className="av-body">One CLI for the whole stack</p>
          </div>
          <dl className="cli-repo-dl x-mono">
            <div><dt>License:</dt><dd>Apache-2.0</dd></div>
            <div><dt aria-label="Stars">★</dt><dd>11 stars</dd></div>
          </dl>
          <div className="cli-repo-acts">
            <A to={GH} className="cli-gh x-mono" data-cta="cli.get-repo">hanzoai/cli</A>
            <Cta to="https://platform.hanzo.ai/deploy" kind="link" id="cli.get-deploy">Deploy to Cloud</Cta>
            <Cta to={DOCS} kind="link" id="cli.get-docs">Install the CLI</Cta>
          </div>
        </div>
        <div className="cli-related">
          <p className="cli-related-k">Related capabilities</p>
          {[['Playground', '/playground'], ['Desktop', '/desktop'], ['API Keys', '/cloud/api-keys']].map(([t, to]) => (
            <A key={t} to={to} className="cli-rel" data-cta={'cli.rel-' + t.toLowerCase().replace(' ', '-')}>{t}<span aria-hidden="true">→</span></A>
          ))}
        </div>
      </div>
    </section>
  );
}

const PLACES = ['A local repo', 'a CI job', 'a machine you sshed into', 'a fix at 2am'];

function Band() {
  // one caret, stepping down the four places while the band is on screen: one mover in the viewport, not four
  const ref = useRef<HTMLUListElement>(null);
  const seen = useInView(ref, { amount: 0.4 });
  const calm = useReducedMotion();
  const [at, setAt] = useState(0);
  useEffect(() => {
    if (!seen || calm) return;
    const t = setTimeout(() => setAt((a) => (a + 1) % PLACES.length), 2400);
    return () => clearTimeout(t);
  }, [seen, calm, at]);
  const host = useRef(null);
  const [run, setRun] = useState(false);
  return (
    // entrance 5, cursor-trail: a trail of carets sweeps across once and uncovers the band, then follows a fine pointer
    <Enter kind="trail" as="section" className="x-band cli-band" aria-labelledby="cli-band-h" ref={host} onIn={() => setRun(true)}>
      <Trail host={host} run={run} />
      <div className="av-wrap av-grid">
        <Lines as="h2" id="cli-band-h" className="av-display m cli-band-h" lines={['Install once.', 'It comes with you.']} />
        <div className="cli-band-r">
          <p className="av-lede">A local repo, a CI job, a machine you sshed into, a fix at 2am. Same binary, same identity, same commands.</p>
          <Cta to={DOCS} id="cli.band" size="lg">Install from hanzo.sh</Cta>
          <div className="cli-band-links">
            <Cta to={GH} kind="link" id="cli.band-github">GitHub</Cta>
            <Cta to="https://platform.hanzo.ai" kind="link" id="cli.band-platform">Hanzo Platform</Cta>
          </div>
        </div>
        <ul className="cli-places" aria-hidden="true" ref={ref}>
          {PLACES.map((p, i) => (
            <li key={p} className={i === at ? 'on' : ''}>
              <span className="cli-place-k">{p}</span>
              <span className="cli-place-t x-mono"><span>$</span> hanzo<i className={i === at ? 'cli-caret' : ''} /></span>
            </li>
          ))}
        </ul>
      </div>
    </Enter>
  );
}

export default function CliPage() {
  return (
    <main className="av cli" style={{ '--ac': '#a3a3a3' }}>
      <Hero />
      <What />
      <Paste />
      <Caps />
      <Start />
      <Get />
      <Band />
    </main>
  );
}
