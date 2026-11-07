'use client';
/* Hanzo CLI. Signature: the resource tree. hanzo <resource> <command> laid out like a file system: open a resource,
   choose a command, and the terminal beside it prints the line and what it does. It walks itself until you take it.
   The hero is a tilted terminal running Hanzo's own example session; the capabilities read as the binary's --help
   in the dark room; the install script lights its steps as they come into view.
   Beyond: "Add to the script". The install script takes any of the binary's own commands (scan, share, status, link,
   auth show) as one press each, under Hanzo's own heading for it, and Copy hands you the script you built.
   Every word is Hanzo's. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { EASE, Rise, Copy, Mark, useTilt } from '../ui';
import { A, Go, More, SecHead } from '../kit';
import './CliPage.css';

const SESSION = [['$', 'hanzo'], ['>', 'deploy the gateway to staging'], ['·', 'reading the project'], ['✓', 'gateway is on staging']];

/* The hero terminal: Hanzo's example session, typed once each time it comes into view (the tree below is the page's
   one thing that keeps moving). */
function Session() {
  const ref = useRef(null);
  const seen = useInView(ref, { amount: 0.4 });
  const calm = useReducedMotion();
  const [n, setN] = useState(SESSION.length + 1); // the whole session is in the HTML; the browser replays it
  const rows = useRef([]);
  useEffect(() => {
    if (!seen || calm) return;
    let alive = true, t = 0;
    const run = async () => {
      const wait = (ms) => new Promise((r) => { t = setTimeout(r, ms); });
      setN(0);
      await wait(500);
      for (let i = 0; i < SESSION.length && alive; i++) {
        setN(i + 1);
        await wait(30);
        const el = rows.current[i], txt = SESSION[i][1];
        if (el && i < 2) { for (let k = 1; k <= txt.length && alive; k++) { el.textContent = txt.slice(0, k); await wait(45); } }
        await wait(i === 2 ? 1500 : 420);
      }
      if (alive) setN(SESSION.length + 1);
    };
    run();
    return () => { alive = false; clearTimeout(t); };
  }, [seen, calm]);
  const { rx, ry, on } = useTilt(4);
  return (
    <div className="cli-stage" ref={ref} {...on}>
      <motion.div className="cli-term" style={{ rotateX: rx, rotateY: ry }}>
        <div className="cli-bar">
          <span className="cli-dots" aria-hidden="true"><i /><i /><i /></span>
          <span className="cli-title"><b>CLI</b> — Hanzo</span>
        </div>
        <nav className="cli-tabs" aria-label="Hanzo apps">
          <A to="/cli" className="on">CLI</A><A to="/playground">Playground</A><A to="/desktop">Desktop</A><A to="/cloud/api-keys">API Keys</A>
        </nav>
        <ul className="cli-body">
          {SESSION.map(([p, t], i) => (
            <li key={t} className={'cli-l k' + i + (i < n ? ' on' : '')}>
              <span className="cli-p">{p}</span>
              <span ref={(el) => (rows.current[i] = el)}>{t}</span>
              {i === 2 && n === 3 && <span className="cli-spin" aria-hidden="true" />}
              {i === n - 1 && i < 2 && <span className="cli-caret" aria-hidden="true" />}
            </li>
          ))}
          <li className={'cli-l cli-open' + (n > SESSION.length ? ' on' : '')}><A to="https://hanzo.team/">Open in the console</A></li>
        </ul>
      </motion.div>
      <p className="cli-note">Example project. Every name in it is one you would give your own.</p>
    </div>
  );
}

function Hero() {
  return (
    <section className="cli-hero" aria-labelledby="cli-h1">
      <div className="x-wrap cli-hero-grid">
        <div>
          <motion.p className="x-kick" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>Hanzo CLI · Developers</motion.p>
          <h1 id="cli-h1" className="cli-h1">
            {['An AI engineer', 'in your terminal'].map((t, i) => (
              <span className="x-line" key={t}><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.05 + i * 0.12 }}>{t}</motion.span></span>
            ))}
          </h1>
          <motion.p className="cli-lede" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}>
            Type <code>hanzo</code> in a repo and you get a coding session. Type <code>hanzo</code> and a noun and you get the rest of the cloud — identity, usage, billing, clusters, machines, networks — typed straight from the API&apos;s own document.
          </motion.p>
          <motion.div className="cli-acts" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.45 }}>
            <Go to="https://docs.hanzo.ai/docs/cli" solid>Install from hanzo.sh</Go>
            <Go to="https://github.com/hanzoai/cli">View on GitHub</Go>
          </motion.div>
          <motion.p className="cli-fine" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 0.6 }}>Open source (MIT). One static Rust binary — macOS and Linux on amd64 and arm64, Windows on amd64. No runtime, no daemon.</motion.p>
        </div>
        <motion.div initial={{ opacity: 0, y: 40, rotate: -2 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: 1.2, ease: EASE, delay: 0.25 }}>
          <Session />
        </motion.div>
      </div>
    </section>
  );
}

function Paste() {
  const text = 'Read https://hanzo.ai/skill.md and use Hanzo CLI in my project. Start with: hanzo auth login';
  return (
    <section className="cli-paste">
      <div className="x-wrap cli-paste-in">
        <div><p className="cli-paste-k">Paste and ship</p><p className="cli-paste-d">Paste this into any agent. It reads the skill manifest and calls CLI from there.</p></div>
        <div className="cli-prompt"><span className="x-mono cli-prompt-k">Agent prompt</span><code>{text}</code><Copy text={text} /></div>
      </div>
    </section>
  );
}

/* The tree: resources open like folders; each command prints its line and what it does. */
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

function Out({ cmd, desc }) {
  const ref = useRef(null);
  const calm = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el || calm) return;
    let i = 0, t = 0;
    el.textContent = '';
    const step = () => { el.textContent = cmd.slice(0, ++i); if (i < cmd.length) t = setTimeout(step, 28); };
    t = setTimeout(step, 80);
    return () => clearTimeout(t);
  }, [cmd, calm]);
  return (
    <div className="cli-out-in">
      <p className="cli-cmd"><span className="cli-p">$</span><span ref={ref}>{cmd}</span><span className="cli-caret" aria-hidden="true" /></p>
      <motion.p className="cli-what" key={desc} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE, delay: Math.min(1, cmd.length * 0.028 + 0.1) }}># {desc}</motion.p>
    </div>
  );
}

function Tree() {
  const [open, setOpen] = useState(new Set([0]));
  const [sel, setSel] = useState([0, 0]);
  const [mine, setMine] = useState(false);
  const [k, setK] = useState(0);
  const ref = useRef(null);
  const seen = useInView(ref, { amount: 0.4 });
  const calm = useReducedMotion();
  useEffect(() => {
    if (mine || !seen || calm) return;
    const t = setTimeout(() => {
      const nk = (k + 1) % TOUR.length, [r, c] = TOUR[nk];
      setK(nk); setOpen(new Set([r])); setSel([r, c]);
    }, 3600);
    return () => clearTimeout(t);
  }, [k, mine, seen, calm]);
  const toggle = (r) => { setMine(true); setOpen((o) => { const n = new Set(o); n.has(r) ? n.delete(r) : n.add(r); return n; }); };
  const pick = (r, c) => { setMine(true); setSel([r, c]); };
  const [, , cmd, desc] = [0, 0, ...TREE[sel[0]][1][sel[1]].slice(1)];
  return (
    <div className="cli-tree-box" ref={ref}>
      <ul className="cli-tree" role="tree" aria-label="hanzo">
        <li className="cli-root x-mono"><Mark size={14} />hanzo</li>
        {TREE.map(([res, cmds], r) => {
          const isOpen = open.has(r);
          return (
            <li key={res} role="treeitem" aria-expanded={isOpen} className="cli-res">
              <button type="button" className={'cli-node' + (sel[0] === r ? ' path' : '')} onClick={() => toggle(r)}>
                <motion.svg viewBox="0 0 16 16" width="12" height="12" animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.25, ease: EASE }} aria-hidden="true"><path d="m6 4 4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></motion.svg>
                <span className="x-mono">{res}</span>
                <span className="cli-n x-mono">{cmds.length}</span>
              </button>
              <motion.ul role="group" className="cli-cmds" initial={false} animate={isOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: EASE }} inert={!isOpen}>
                {cmds.map(([c, line], ci) => (
                  <li key={line} role="treeitem" aria-selected={sel[0] === r && sel[1] === ci}>
                    <button type="button" className={'cli-leaf' + (sel[0] === r && sel[1] === ci ? ' on' : '')} onClick={() => pick(r, ci)} data-cursor="Print">
                      {sel[0] === r && sel[1] === ci && <motion.span layoutId="cli-leaf" className="cli-leaf-bg" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                      <span className="x-mono">{c || res}</span>
                    </button>
                  </li>
                ))}
              </motion.ul>
            </li>
          );
        })}
      </ul>
      <div className="cli-out" aria-live="polite">
        <div className="cli-out-bar x-mono"><span>hanzo &lt;resource&gt; &lt;command&gt;</span><A to="/home">Open in the console</A></div>
        <Out cmd={cmd} desc={desc} />
      </div>
    </div>
  );
}

const WHAT = [
  ['A coding session, metered', 'Bare hanzo runs our dev agent with the Hanzo toolset attached and the model calls billed to your organization. Point it at claude or codex instead and it drives an agent you already have.'],
  ['Run the cloud on your machine', 'hanzo serve cloud starts the whole API locally, or name one service — iam, kms, gateway, storage, pubsub. hanzo engine serve puts a model on a local endpoint.'],
  ['No raw-path escape hatch', 'There is no hanzo api verb and no URL to hand-write. Every cloud capability arrives as a typed subcommand, which is what keeps the CLI and the API from disagreeing.'],
];

function What() {
  return (
    <section className="x-sec cli-what-sec">
      <div className="x-wrap">
        <SecHead kicker="What is Hanzo CLI" title="A resource tree, not a pile of flags" lede="hanzo <resource> <command>. The resources beyond the hand-written ones are generated from the OpenAPI documents, so the CLI can only ask for things the API has." />
        <div><Tree /></div>
        <ol className="cli-three">
          {WHAT.map(([t, d], i) => (
            <li key={t}>
              <span className="cli-three-n x-mono">{String(i + 1).padStart(2, '0')}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* The binary's --help, in the dark: each row a command, its heading and what it does. */
const CAPS = [
  ['hanzo auth show', 'Several identities at once', 'Hold as many principals as you need and switch between them. A second login never clobbers the first, and hanzo auth show says which one is answering right now.'],
  ['--token -', 'Secrets arrive on stdin', 'Pass --token - and the credential is read from the pipe, never from argv — so nothing lands in shell history, ps, or a CI log. It is stored in the OS keychain, or an owner-only file where there is none.'],
  ['hanzo share 3000', 'A public URL for a local port', 'hanzo share 3000 publishes a service over the zero-trust fabric while the port stays bound to localhost. Pass --name to keep the same subdomain next time.'],
  ['hanzo scan', 'Find the secret before the commit', 'hanzo scan walks a path for exposed credentials and exits non-zero when it finds one, which is what makes it usable as a hook rather than a habit.'],
  ['hanzo status', 'The whole cloud, unhealthy first', 'hanzo status leads with what is broken, then clusters, applications and the machines on your fleet. The thing you needed to know is the first line, not the last.'],
  ['hanzo link', 'Put this shell on the fabric', 'hanzo link publishes the terminal you are in so the console can watch it — or drive it. --read-only when you would rather be watched than typed at.'],
];

function Caps() {
  return (
    <section className="x-sec cli-dark" data-room="dark">
      <div className="x-wrap">
        <SecHead dark kicker="Capabilities" title="What the binary carries" />
        <p className="cli-help-k x-mono">$ hanzo --help</p>
        <ul className="cli-help">
          {CAPS.map(([c, t, d], i) => (
            <Rise as="li" key={t} delay={i * 0.05} y={16}>
              <span className="cli-help-c x-mono">{c}</span>
              <div className="cli-help-b"><h3>{t}</h3><p>{d}</p></div>
            </Rise>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* The install script: its steps light as they come into view. */
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

function Block({ b, i }) {
  const ref = useRef(null);
  const lit = useInView(ref, { margin: '-30% 0px -40% 0px' });
  const [c, ...lines] = b.split('\n');
  return (
    <div ref={ref} className={'cli-blk' + (lit ? ' lit' : '')}>
      <span className="cli-blk-n x-mono">{i + 1}</span>
      <pre><span className="cli-c">{c}</span>{'\n'}{lines.map((l) => <span key={l} className="cli-ln">{l}{'\n'}</span>)}</pre>
    </div>
  );
}

/* Beyond: the binary's own commands, each under its own heading, added to the script you copy. */
const EXTRA = CAPS.filter(([c]) => c.startsWith('hanzo ')).map(([c, t]) => '# ' + t + '\n' + c);

function Start() {
  const [add, setAdd] = useState([]);
  const blocks = [...SCRIPT.split('\n\n'), ...add.map((i) => EXTRA[i])];
  const flip = (i) => setAdd((a) => (a.includes(i) ? a.filter((x) => x !== i) : [...a, i]));
  return (
    <section className="x-sec cli-start">
      <div className="x-wrap cli-start-in">
        <div className="cli-sticky">
          <SecHead kicker="Get started" title="Install, sign in, start working" />
          <div className="x-row-links tight cli-start-l"><More to="https://docs.hanzo.ai/docs/cli">Read the docs</More><More to="https://github.com/hanzoai/cli">View on GitHub</More></div>
        </div>
        <div className="cli-script">
          <div className="cli-script-bar"><span className="x-mono">bash</span><Copy text={blocks.join('\n\n')} /></div>
          <div className="cli-script-body">{blocks.map((b, i) => <Block key={b} b={b} i={i} />)}</div>
          <div className="cli-add" role="group" aria-label="Add to the script">
            <span className="x-mono">+</span>
            {EXTRA.map((b, i) => <button key={b} type="button" className="x-mono" aria-pressed={add.includes(i)} onClick={() => flip(i)}>{b.split('\n')[1]}</button>)}
          </div>
        </div>
      </div>
    </section>
  );
}

/* Install once: the same prompt, wherever you are. */
const PLACES = ['A local repo', 'a CI job', 'a machine you sshed into', 'a fix at 2am'];

function Carry() {
  return (
    <section className="x-sec cli-carry">
      <div className="x-wrap">
        <div className="cli-carry-top">
          <SecHead title="Install once. It comes with you." lede="A local repo, a CI job, a machine you sshed into, a fix at 2am. Same binary, same identity, same commands." />
          <div className="cli-carry-acts">
            <Go to="https://docs.hanzo.ai/docs/cli" solid>Install the CLI</Go>
            <Go to="https://github.com/hanzoai/cli">GitHub</Go>
            <Go to="https://platform.hanzo.ai">Hanzo Platform</Go>
          </div>
        </div>
        <div className="cli-places" aria-hidden="true">
          {PLACES.map((p, i) => (
            <Rise key={p} className="cli-place" delay={i * 0.08}>
              <span className="cli-place-k">{p}</span>
              <span className="cli-place-t x-mono"><span className="cli-p">$</span> hanzo<i style={{ animationDelay: i * 0.25 + 's' }} /></span>
            </Rise>
          ))}
        </div>
        <div className="cli-related">
          <p className="x-kick">Related capabilities</p>
          <div className="cli-related-l">
            {[['Playground', '/playground'], ['Desktop', '/desktop'], ['API Keys', '/cloud/api-keys']].map(([t, to]) => <A key={t} to={to} className="cli-rel">{t}<span aria-hidden="true">→</span></A>)}
          </div>
        </div>
      </div>
    </section>
  );
}

function Get() {
  const { rx, ry, glow, on } = useTilt(4, 'rgba(0,0,0,.05)');
  return (
    <section className="cli-get">
      <div className="x-wrap">
        <div>
          <motion.div className="cli-repo" style={{ rotateX: rx, rotateY: ry }} {...on}>
            <motion.span className="x-mglow" style={{ background: glow }} aria-hidden="true" />
            <div>
              <h2>Get CLI</h2>
              <p>One CLI for the whole stack</p>
            </div>
            <dl className="x-mono"><div><dt>License:</dt><dd>Apache-2.0</dd></div><div><dt>★</dt><dd>11 stars</dd></div></dl>
            <div className="cli-repo-acts">
              <A to="https://github.com/hanzoai/cli" className="cli-gh x-mono">hanzoai/cli</A>
              <Go to="https://platform.hanzo.ai/deploy" solid>Deploy to Cloud</Go>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default function CliPage() {
  return (
    <main className="cli">
      <Hero />
      <Paste />
      <What />
      <Caps />
      <Start />
      <Carry />
      <Get />
      <i hidden data-thumb="Install from hanzo.sh" data-href="https://docs.hanzo.ai/docs/cli" />
    </main>
  );
}
