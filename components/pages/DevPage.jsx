'use client';
/* Dev. Its idea is one sentence played out: "Describe the change. Dev ships it." The hero is a live terminal session
   (the task types, the diff streams in, the tests go green); the race is a split screen that replays the 3.02x result
   at the speed it ran; the sandbox is a fence you move with the flag you pick; the controller is a ladder the cheapest
   step wins. Beyond: "Your first session" - say what you are on, how you want to sign in, which model and whether
   Dev asks first, and the page writes your whole first session (install, sign in, start) in Hanzo's own commands,
   to copy in one go. Every word, figure and link is Hanzo's; only the code in the sample session is an illustration. */
import { useEffect, useRef, useState } from 'react';
import { motion, animate, useInView, useMotionValue, useReducedMotion, useTransform } from 'motion/react';
import { EASE, Rise, Count, Copy } from '../ui';
import { A, SecHead, Faq, Tick } from '../kit';
import './DevPage.css';

const Lk = ({ to, children, className = '', ...r }) => {
  const inner = <><span>{children}</span><i aria-hidden="true">→</i></>;
  return to.startsWith('#')
    ? <a href={to} className={'x-arrow ' + className} {...r}>{inner}</a>
    : <A to={to} className={'x-arrow ' + className} {...r}>{inner}</A>;
};
const Btn = ({ to, children, solid, ...r }) => <A to={to} className={'x-btn' + (solid ? ' solid' : '')} {...r}>{children}</A>;

/* A block of commands, each with its comment. */
function Code({ label, lines, className = '' }) {
  return (
    <div className={'xdv-code ' + className}>
      {label && <div className="xdv-code-top"><span className="x-mono">{label}</span></div>}
      <pre><code>{lines.map(([c, note], i) => (
        <span className="xdv-ln" key={i}>{c}{note && <>{'  '}<span className="c">{note}</span></>}{'\n'}</span>
      ))}</code></pre>
    </div>
  );
}

/* ---------- 1. hero: a live session ---------- */
const INSTALL = 'curl -fsSL https://hanzo.sh | sh';
const TASK = 'retry() gives up one attempt early. Fix it and run the tests.';
const DIFF = [
  ['hunk', '@@ src/retry.ts'],
  ['ctx', '  export async function retry(fn, tries = 3) {'],
  ['del', '-   for (let i = 1; i < tries; i++) {'],
  ['add', '+   for (let i = 0; i < tries; i++) {'],
  ['ctx', '      try { return await fn(); } catch (e) { last = e; }'],
  ['ctx', '    }'],
];
const TESTS = ['retries three times', 'stops at the first success', 'throws the last error'];
const STOP = Symbol('stop');

function Session() {
  const box = useRef(null);
  const body = useRef(null);
  const seen = useInView(box, { amount: 0.3 });
  const calm = useReducedMotion();
  const [n, setN] = useState(0);
  const [info, setInfo] = useState(false);

  /* The session writes straight into the terminal's nodes (no React state per character) and stops when it is off screen. */
  useEffect(() => {
    const el = body.current;
    if (!el || (!seen && !calm)) return;
    let live = true;
    const k = calm ? 0 : 1;
    const sleep = (ms) => new Promise((ok, no) => setTimeout(() => (live ? ok() : no(STOP)), ms * k));
    const add = (cls, text = '') => { const d = document.createElement('div'); d.className = 'xt ' + cls; d.textContent = text; el.appendChild(d); return d; };
    const type = async (node, text, ms) => {
      if (!k) { node.textContent = text; return; }
      for (let i = 1; i <= text.length; i++) { node.textContent = text.slice(0, i); await sleep(ms); }
    };
    const cmd = async (text) => {
      const d = add('p'); const pre = document.createElement('b'); pre.textContent = '$ '; const t = document.createElement('span');
      d.append(pre, t); const caret = document.createElement('i'); d.append(caret);
      await type(t, text, 32); caret.remove();
    };
    const step = async (label, done, work) => {
      const d = add('step', label); d.classList.add('run');
      await work(); await sleep(250);
      d.classList.remove('run'); d.classList.add('ok'); d.textContent = '✓ ' + done;
    };
    const play = async () => {
      el.textContent = '';
      await cmd(INSTALL); await sleep(700);
      await cmd('dev'); await sleep(350);
      add('dim', 'v0.7.7 · Run /help for commands'); await sleep(500);
      const q = add('ask'); const t = document.createElement('span'); q.append('┃ ', t); const caret = document.createElement('i'); q.append(caret);
      await type(t, TASK, 26); caret.remove(); await sleep(450);
      await step('◐ Reading the repository', 'Read the repository', () => sleep(900));
      await step('◐ Making the change', 'Made the change', async () => {
        for (const [c, s] of DIFF) { add('d ' + c, s); await sleep(170); }
        await sleep(300);
      });
      await step('◐ Running the tests', 'Ran the tests', async () => {
        for (const s of TESTS) {
          const r = add('test', '○ ' + s); await sleep(520);
          r.classList.add('ok'); r.textContent = '✓ ' + s;
        }
      });
      add('done', '3 passed'); await sleep(450);
      add('final', 'Diff ready. Waiting for your review.');
    };
    (async () => {
      try {
        do { await play(); if (calm) return; await sleep(6500); } while (live);
      } catch (e) { if (e !== STOP) throw e; }
    })();
    return () => { live = false; };
  }, [seen, calm, n]);

  return (
    <motion.div className="xdv-term" ref={box} initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1.2, ease: EASE, delay: 0.25 }}>
      <div className="xdv-term-bar">
        <i aria-hidden="true" /><i aria-hidden="true" /><i aria-hidden="true" />
        <b className="x-mono">dev</b>
        <button type="button" className="xdv-info" aria-expanded={info} aria-controls="xdv-demo" onClick={() => setInfo(!info)}>(i)</button>
        <button type="button" className="xdv-replay" onClick={() => setN(n + 1)} aria-label="Replay the session">
          <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M13 8a5 5 0 1 1-1.6-3.7M13 2.5v3h-3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>
      <p id="xdv-demo" className={'xdv-demo' + (info ? ' on' : '')} aria-hidden={!info}>This interactive demo runs Hanzo Dev in your browser with an in-memory workspace (@acme/api).</p>
      <div className="xdv-term-body" ref={body} aria-hidden="true" />
      {/* the whole session as text, for readers and search engines */}
      <div className="x-sr">
        <p>$ {INSTALL}</p><p>$ dev</p><p>v0.7.7 · Run /help for commands</p><p>{TASK}</p>
        <p>Read the repository</p><p>Made the change</p>{DIFF.map(([, s], i) => <p key={i}>{s}</p>)}
        <p>Ran the tests</p>{TESTS.map((s) => <p key={s}>{s}</p>)}<p>3 passed</p><p>Diff ready. Waiting for your review.</p>
      </div>
      <div className="xdv-term-foot x-mono"><span>auto</span><span>·</span><span>enso-auto</span><em>@acme/api (main)</em></div>
    </motion.div>
  );
}

function Hero() {
  const line = (t, d) => (
    <span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: d }}>{t}</motion.span></span>
  );
  return (
    <section className="xdv-hero" aria-labelledby="xdv-h1">
      <div className="x-wrap xdv-hero-grid">
        <div>
          <motion.p className="x-kick" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>Hanzo Dev · Coding agent</motion.p>
          <h1 id="xdv-h1" className="xdv-h1">{line('Describe the change.', 0.05)}{line('Dev ships it.', 0.18)}</h1>
          <motion.p className="xdv-lede" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}>
            Hanzo Dev is a coding agent. It reads your repository, makes the change, runs the tests and shows you the diff — in your terminal, on the web, in the cloud and in Slack.
          </motion.p>
          <motion.ul className="xdv-pills" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }}>
            {['Reads the repository, makes the change and runs the tests', 'Shows you the diff and waits for your review', 'In your terminal, on the web, in the cloud and in Slack', 'Enso by default, every Hanzo model by name'].map((t, i) => <li key={t}><Tick size={18} delay={0.6 + i * 0.12} /><span>{t}</span></li>)}
          </motion.ul>
          <motion.div className="xdv-acts" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.6 }}>
            <Btn to="/login?next=%2Fdev" solid data-thumb="Open Dev">Open Dev</Btn>
            <Btn to="https://docs.hanzo.ai/docs/dev">Read the docs</Btn>
            <Lk to="https://github.com/hanzoai/dev">Explore GitHub examples</Lk>
          </motion.div>
        </div>
        <Session />
      </div>
    </section>
  );
}

/* ---------- 2. the race: a split screen at the speed it ran ---------- */
const MAX = 9.52;
const DT = MAX / 20;
const SIDES = [
  { who: 'Claude Code', s: 9.52, calls: '3.8', dots: [0.14, 0.38, 0.62, 0.86], run: 'coding.repair-held-devfix-claude-code' },
  { who: 'Hanzo Dev', s: 2.29, calls: '1.0', dots: [0.5], run: 'coding.repair-held-devfix-hanzo-dev-dc', win: true },
];

function Cell({ t, k, s }) {
  const dead = k * DT >= s;
  const o = useTransform(t, (v) => (!dead && v >= k * DT ? 1 : 0));
  return <span className={dead ? 'dead' : ''}><motion.b style={{ opacity: o }} /></span>;
}
function Dot({ t, at }) {
  const o = useTransform(t, (v) => (v >= at ? 1 : 0.14));
  return <motion.i style={{ opacity: o }} />;
}
function Side({ t, side }) {
  const { who, s, calls, dots, run, win } = side;
  const clock = useTransform(t, (v) => Math.min(v, s).toFixed(2) + ' s');
  const st = useTransform(t, (v) => (v <= 0 ? 'ready' : v >= s ? 'done' : 'running'));
  const glow = useTransform(t, (v) => (v >= s ? 1 : 0));
  return (
    <article className={'xdv-side' + (win ? ' win' : '')}>
      <header><h3>{who}</h3><motion.span className="xdv-st x-mono">{st}</motion.span></header>
      <motion.p className="xdv-clock x-mono">{clock}</motion.p>
      <p className="xdv-lab">median time a task</p>
      <div className="xdv-cells" aria-hidden="true">{Array.from({ length: 20 }).map((_, k) => <Cell key={k} t={t} k={k} s={s} />)}</div>
      <div className="xdv-calls">
        <span>model calls a task</span>
        <b className="x-mono">{calls}</b>
        <span className="xdv-dots" aria-hidden="true">{dots.map((d) => <Dot key={d} t={t} at={d * s} />)}</span>
      </div>
      <p className="xdv-run x-mono">replay of run {run}</p>
      <motion.i className="xdv-flash" style={{ opacity: glow }} aria-hidden="true" />
    </article>
  );
}

function Race() {
  const ref = useRef(null);
  const seen = useInView(ref, { amount: 0.35 });
  const calm = useReducedMotion();
  const t = useMotionValue(0);
  const [run, setRun] = useState(0);
  useEffect(() => {
    if (!seen) return;
    if (calm) { t.set(MAX); return; }
    let on = true, c;
    (async () => {
      while (on) {
        t.set(0);
        c = animate(t, MAX, { duration: MAX, ease: 'linear' });
        await c;
        if (!on) break;
        await new Promise((r) => setTimeout(r, 3800));
      }
    })();
    return () => { on = false; c && c.stop(); };
  }, [seen, calm, run, t]);
  return (
    <section className="x-sec xdv-race" data-room="dark" ref={ref} aria-labelledby="xdv-race">
      <div className="x-wrap">
        <SecHead dark title="3.02× faster on the same coding tasks." lede="Hanzo Dev and Claude Code were handed the same 44 coding tasks (single-fault repairs), one try each. Each clock replays that side's median time a task, at the speed it ran." id="xdv-race" />
        <div className="xdv-split">
          {SIDES.map((s) => <Side key={s.who} t={t} side={s} />)}
        </div>
        <div className="xdv-race-act">
          <motion.button type="button" className="x-btn xdv-replay-btn" onClick={() => setRun((r) => r + 1)} whileTap={{ scale: 0.96 }}>
            <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><path d="M13 8a5 5 0 1 1-1.6-3.7M13 2.5v3h-3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Replay race
          </motion.button>
        </div>
        <table className="x-sr">
          <thead><tr><th>Agent</th><th>Median time a task</th><th>Model calls a task</th></tr></thead>
          <tbody>{SIDES.map((s) => <tr key={s.who}><td>{s.who}</td><td>{s.s.toFixed(2)} s</td><td>{s.calls}</td></tr>)}</tbody>
        </table>
        <p className="xdv-verdict">3.02× faster over the 42 tasks both solved, 95% interval 2.06–4.36×.</p>
        <div className="xdv-ways">
          <p className="xdv-ways-k">By how Hanzo Dev settled a task:</p>
          <ul>
            {[['Settled by search, no model call, 24 tasks', '8.22×', '6.86–9.82×', 8.22, 6.86, 9.82], ['The model’s first edit, 4 tasks', '1.31×', '1.14–1.48×', 1.31, 1.14, 1.48]].map(([w, v, ci, x, lo, hi]) => (
              <li key={w}>
                <span className="xdv-way">{w}</span>
                <b className="x-mono">{v}</b><span className="xdv-ci-t x-mono"><span>·</span> <span>95%</span> <span>{ci}</span></span>
                <i className="xdv-ci" aria-hidden="true">
                  <motion.b initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.4, ease: EASE }} style={{ width: x * 10 + '%' }} />
                  <u style={{ left: lo * 10 + '%', width: (hi - lo) * 10 + '%' }} />
                </i>
              </li>
            ))}
          </ul>
          <Lk to="/benchmarks#coding-agent">Every coding task and both runs</Lk>
        </div>
      </div>
    </section>
  );
}

/* ---------- 3. one agent ---------- */
const PLACES = [
  ['Terminal', 'dev', 'In any repository. It reads the code, makes the change and runs commands in a sandbox. Bare hanzo opens the same session.', 'term'],
  ['Web', 'hanzo.ai/dev', 'Describe an app. Dev writes it, runs it and deploys it, with the database, the sign-in and the storage already there.', 'web'],
  ['Cloud', 'dev cloud exec', 'Hand a task to Hanzo’s cloud and close the laptop. dev cloud diff shows what it did; dev cloud apply puts it in your checkout.', 'cloud'],
  ['Slack', null, 'An org admin connects the workspace in Dev’s settings, and the team talks to it from their channels.', 'slack'],
];
function Places() {
  return (
    <section className="x-sec xdv-places">
      <div className="x-wrap">
        <SecHead kicker="One agent" title="Wherever the work is." lede="The same agent, the same models and the same account in every place it runs." />
        <ul className="xdv-pl">
          {PLACES.map(([t, tag, d, g], i) => (
            <Rise as="li" key={t} delay={i * 0.1}>
              <div className={'xdv-glyph ' + g} aria-hidden="true"><i /><i /><i /><b /></div>
              <h3>{t}</h3>
              {tag && <code className="xdv-tag">{tag}</code>}
              <p>{d}</p>
            </Rise>
          ))}
        </ul>
        <div className="x-row-links"><Lk to="/login?next=%2Fdev">Open Dev on the web</Lk></div>
      </div>
    </section>
  );
}

/* ---------- 4. install ---------- */
const WAYS = [
  ['hanzo.sh', 'curl -fsSL https://hanzo.sh | sh', 'Linux and macOS. One native binary, its checksum verified.'],
  ['npm', 'npm i -g hanzo', 'Every platform, Windows included. Run it as hanzo dev; the agent downloads on first run.'],
  ['Homebrew', 'brew install hanzoai/tap/hanzo-dev', 'macOS and Linux.'],
];
function Install() {
  return (
    <section className="x-sec xdv-install" id="install">
      <div className="x-wrap">
        <SecHead kicker="Install" title="One line, three ways." lede="Linux, macOS and Windows. Dev updates itself the way it was installed." />
        <ul className="xdv-ways3">
          {WAYS.map(([w, c, d], i) => (
            <li key={w}>
              <span className="xdv-way3-n">{w}</span>
              <div className="xdv-cmd"><code><b>$</b> {c}</code><Copy text={c} /></div>
              <p>{d}</p>
            </li>
          ))}
        </ul>
        <div className="xdv-signin">
          <p>Then sign in. Hanzo IAM links the machine to your account.</p>
          <Code label="bash" lines={[['dev login', '# pick an account: Hanzo is the default'], ['dev login --hanzo', '# straight to your Hanzo account'], ['dev login --with-api-key', '# or paste a Hanzo API key, hidden']]} />
        </div>
        <div className="x-row-links">
          <Lk to="https://github.com/hanzoai/dev/releases/tag/v0.7.7">Latest release v0.7.7</Lk>
          <Lk to="https://docs.hanzo.ai/docs/dev">Getting started</Lk>
        </div>
      </div>
    </section>
  );
}

/* ---------- 5. models ---------- */
const PICKS = [['dev', '# enso-auto, through api.hanzo.ai', 'enso-auto'], ['dev --model enso-ultra', '# name any model Hanzo serves', 'enso-ultra'], ['/model zen5-coder', '# or switch inside a session', 'zen5-coder']];
function Models() {
  const [k, setK] = useState(0);
  const [mine, setMine] = useState(false);
  return (
    <section className="x-sec xdv-models">
      <div className="x-wrap xdv-split2">
        <div>
          <SecHead kicker="Models" title="Enso by default. Any model by name." lede="Dev starts on enso-auto through api.hanzo.ai, so every call is metered on your Hanzo account. Every model Hanzo serves is a flag or a /model away." />
          <div className="x-row-links tight"><Lk to="/enso">Enso</Lk><Lk to="/models">Every model</Lk></div>
        </div>
        <div className="xdv-pick">
          <div className="xdv-code">
            <div className="xdv-code-top"><span className="x-mono">bash</span><span className="xdv-chip x-mono" aria-live="polite"><i aria-hidden="true" />{PICKS[k][2]}</span></div>
            <div className="xdv-rows" role="group" aria-label="Pick how to name the model">
              {PICKS.map(([c, note], i) => (
                <button key={c} type="button" aria-pressed={k === i} onClick={() => { setK(i); setMine(true); }}>
                  {k === i && <motion.span layoutId="xdv-pick" className="xdv-row-bg" transition={{ type: 'spring', stiffness: 420, damping: 36 }} />}
                  <code><span className="p">{c}</span>{'  '}<span className="c">{note}</span></code>
                  {k === i && !mine && <i className="xdv-tick-bar" aria-hidden="true" onAnimationEnd={() => setK((v) => (v + 1) % PICKS.length)} />}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- 6. controller: a ladder ---------- */
const LADDER = [
  ['An action applies', 'One candidate, its preconditions hold: it runs, and no model is asked.'],
  ['Kai decides', 'Where to fix, what to do and how hard to try, asked of Kai in one structured call.'],
  ['Generate, low effort', 'A model writes the edit, asked for as a strict schema.'],
  ['Generate, full effort', 'The same, given room to reason.'],
  ['Recover', 'A failure seen before with nothing changed picks a different action, or escalates. It never replays the loop.'],
];
function Controller() {
  const ref = useRef(null);
  const seen = useInView(ref, { amount: 0.4 });
  const calm = useReducedMotion();
  const [at, setAt] = useState(0);
  useEffect(() => {
    if (!seen || calm) return;
    const id = setTimeout(() => setAt((v) => (v + 1) % LADDER.length), 2600);
    return () => clearTimeout(id);
  }, [seen, calm, at]);
  return (
    <section className="x-sec xdv-ctl" ref={ref}>
      <div className="x-wrap xdv-split2 top">
        <div className="xdv-sticky">
          <SecHead kicker="Controller" title="Kai decides. Dev does." lede="Kai is Dev’s own controller, not an adviser. At each step it returns an operation Dev can run, or says plainly that it abstains. The cheapest step that holds is the one taken." />
          <div className="x-row-links tight"><Lk to="/kai">Kai, the decision model</Lk></div>
        </div>
        <ol className="xdv-ladder">
          {LADDER.map(([t, d], i) => (
            <li key={t} className={i === at ? 'on' : i < at ? 'past' : ''} onPointerEnter={(e) => { if (e.pointerType === 'mouse') setAt(i); }}>
              <span className="xdv-rung-n x-mono">{String(i + 1).padStart(2, '0')}</span>
              <span><b>{t}</b><span>{d}</span></span>
              {i === at && <motion.i layoutId="xdv-rung" className="xdv-rung-bg" aria-hidden="true" transition={{ type: 'spring', stiffness: 300, damping: 34 }} />}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- 7. proof ---------- */
const PROOF = [
  ['Verified, not predicted', 'A step is settled by what the verifier records — the exit status, the tests, the diff — never by what anything expected.'],
  ['Bound to the revision', 'Preconditions are checked just before an action runs, and an edit voids every decision made against the files as they were.'],
  ['A ledger you can replay', 'Every decision, fallback, run and verification is a line with a stable id and its reason, credentials redacted, so its time and cost can be read back.'],
];
function Proof() {
  return (
    <section className="x-sec xdv-proof">
      <div className="x-wrap">
        <SecHead kicker="Proof" title="Built to be checked." lede="Nothing counts as done because a model said so." />
        <ul className="xdv-pr">
          {PROOF.map(([t, d], i) => (
            <Rise as="li" key={t} delay={i * 0.1}>
              <Tick size={30} delay={0.2 + i * 0.15} />
              <h3>{t}</h3>
              <p>{d}</p>
            </Rise>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- 8. sandbox: the fence ---------- */
const FLAGS = [['hanzo dev --ask', '# ask before each action', 'ask'], ['hanzo dev --no-sandbox', '# run unconfined, for this run only', 'open'], ['hanzo dev --project-mcp', "# also load this repository's .mcp.json", 'mcp']];
function Sandbox() {
  const [k, setK] = useState(0);
  const mode = FLAGS[k][2];
  return (
    <section className="x-sec xdv-sbx">
      <div className="x-wrap xdv-split2">
        <div>
          <SecHead kicker="Sandbox" title="Inside the fence you set." lede="Commands run in a sandbox and are approved inside it. Ask before every action, or lift the fence for one run. A repository’s own tool servers stay off until you say you trust it." />
          <div className="xdv-code">
            <div className="xdv-rows" role="group" aria-label="Choose a flag to see its fence">
              {FLAGS.map(([c, note], i) => (
                <button key={c} type="button" aria-pressed={k === i} onClick={() => setK(i)}>
                  {k === i && <motion.span layoutId="xdv-flag" className="xdv-row-bg" transition={{ type: 'spring', stiffness: 420, damping: 36 }} />}
                  <code><span className="p">{c}</span>{'  '}<span className="c">{note}</span></code>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className={'xdv-fence ' + mode} aria-hidden="true">
          <div className="xdv-fence-box" />
          <div className="xdv-fence-in"><i /><i /><i /><b /></div>
          <div className="xdv-fence-mcp"><i /><i /></div>
          <div className="xdv-fence-ask"><span /></div>
        </div>
      </div>
    </section>
  );
}

/* ---------- 9. gen ---------- */
function Gen() {
  return (
    <section className="x-sec xdv-gen">
      <div className="x-wrap xdv-split2">
        <div>
          <SecHead kicker="Gen" title="Dev is our agent. Gen runs any agent." lede="Hanzo Gen is the harness: Claude Code, Codex, Cursor and the rest, on Hanzo’s tools and models and linked to your account. Dev is the agent it opens when none is named." />
          <div className="x-row-links tight"><Lk to="/gen">Hanzo Gen</Lk></div>
        </div>
        <div className="xdv-harness" aria-hidden="true">
          <div className="xdv-agents">{['Claude Code', 'Codex', 'Cursor', 'Dev'].map((a, i) => <span key={a} style={{ '--i': i }} className={a === 'Dev' ? 'dev' : ''}>{a}</span>)}</div>
          <div className="xdv-bus"><i /><i /><i /><i /></div>
          <div className="xdv-gen-core">Gen</div>
        </div>
      </div>
    </section>
  );
}

/* ---------- 10. open source ---------- */
function Source() {
  return (
    <section className="x-sec xdv-oss">
      <div className="x-wrap">
        <SecHead kicker="Open source" title="Read every line." />
        <p className="xdv-oss-p">Dev is Apache-2.0 on GitHub. Build it, change it, send a pull request — <a href="https://github.com/hanzoai/dev" target="_blank" rel="noopener noreferrer">hanzoai/dev</a>.</p>
        <div className="x-row-links"><Lk to="https://github.com/hanzoai/dev">The source</Lk><Lk to="https://github.com/hanzoai/dev/releases">Releases</Lk></div>
      </div>
    </section>
  );
}

/* ---------- 11. questions ---------- */
const QA = [
  ['What does it cost?', 'Dev is free and open source. Its model calls go through api.hanzo.ai and are metered on your Hanzo account at the price list’s rates, so one account and one bill cover every model.'],
  ['Which systems does it run on?', 'Linux, macOS and Windows. hanzo.sh installs it on Linux and macOS, npm everywhere, Homebrew on macOS and Linux.'],
  ['How does it update?', 'The way it was installed: from its own release, from npm, or from Homebrew.'],
  ['Can I bring a key instead of signing in?', 'Yes. dev login --with-api-key takes a Hanzo API key, hidden as it is typed or read from piped stdin.'],
  ['How is Dev different from Gen?', 'Dev is Hanzo’s coding agent. Gen is the harness that runs any coding agent, Dev included, on Hanzo’s tools and models.'],
];

/* ---------- 12. read ---------- */
const READ = [
  ['Start', [['Docs', 'Install, sign in, the first session.', 'https://docs.hanzo.ai/docs/dev'], ['Install', 'hanzo.sh, npm or Homebrew.', '#install'], ['Hanzo CLI', 'hanzo, and the session it opens.', '/cli']]],
  ['Models', [['Enso', 'The default.', '/enso'], ['Kai', 'The controller.', '/kai'], ['Every model', null, '/models']]],
  ['Source', [['hanzoai/dev', 'Apache-2.0.', 'https://github.com/hanzoai/dev'], ['Releases', null, 'https://github.com/hanzoai/dev/releases'], ['Hanzo Gen', 'The harness for every agent.', '/gen'], ['Hanzo Kata', 'Test, repair, and the pull request.', '/kata']]],
];
function Read() {
  return (
    <section className="x-sec xdv-read">
      <div className="x-wrap">
        <SecHead kicker="Read" title="The agent, its controller, its source." lede="Where to start, what Dev thinks with, and the code." />
        <div className="xdv-cols">
          {READ.map(([h, items], i) => (
            <div key={h}>
              <h3>{h}</h3>
              <ul>
                {items.map(([t, d, to]) => {
                  const inner = <><b>{t}</b>{d && <span>{d}</span>}<i aria-hidden="true">→</i></>;
                  return <li key={t}>{to.startsWith('#') ? <a href={to}>{inner}</a> : <A to={to}>{inner}</A>}</li>;
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- 13. paste and ship ---------- */
const PASTE = 'Read https://hanzo.ai/skill.md and use Hanzo Dev in my project. Start with: dev';
function Paste() {
  return (
    <section className="x-sec xdv-paste">
      <div className="x-wrap">
        <p className="x-kick">Paste and ship</p>
        <p className="xdv-paste-l">Paste this into any agent. It reads the skill manifest and calls Dev from there.</p>
        <div className="xdv-prompt">
          <div className="xdv-prompt-top"><span className="x-mono">Agent prompt</span><Copy text={PASTE} /></div>
          <p className="x-mono">{PASTE}</p>
        </div>
      </div>
    </section>
  );
}

// every line below is one of Hanzo's own commands on this page; the choices only pick between them
const FIRST = {
  sys: [['Linux or macOS', 0], ['Windows', 1], ['Homebrew', 2]],
  login: [['Hanzo account', 'dev login --hanzo'], ['Pick an account', 'dev login'], ['API key', 'dev login --with-api-key']],
  model: [['enso-auto', ''], ['enso-ultra', ' --model enso-ultra']],
};

function First() {
  const [sys, setSys] = useState(0);
  const [login, setLogin] = useState(0);
  const [model, setModel] = useState(0);
  const [ask, setAsk] = useState(false);
  const lines = [WAYS[FIRST.sys[sys][1]][1], FIRST.login[login][1], 'dev' + FIRST.model[model][1] + (ask ? ' --ask' : '')];
  const row = (label, list, at, set) => (
    <fieldset className="xdv-first-q">
      <legend>{label}</legend>
      <div role="radiogroup" aria-label={label}>{list.map(([t], i) => <button key={t} type="button" role="radio" aria-checked={at === i} onClick={() => set(i)}>{t}</button>)}</div>
    </fieldset>
  );
  return (
    <section className="x-sec xdv-first">
      <div className="x-wrap xdv-split2">
        <div>
          <SecHead kicker="Your first session" title="Three lines, yours." lede="Install, sign in, start. Dev updates itself the way it was installed." />
          {row('You are on', FIRST.sys, sys, setSys)}
          {row('Sign in with', FIRST.login, login, setLogin)}
          {row('Model', FIRST.model, model, setModel)}
          <label className="xdv-first-ask"><input type="checkbox" checked={ask} onChange={() => setAsk(!ask)} /> Ask before each action</label>
        </div>
        <div className="xdv-first-out">
          <ol>{lines.map((l, i) => <li key={i}><span className="x-mono">{i + 1}</span><code><b>$</b> {l}</code></li>)}</ol>
          <Copy text={lines.join('\n')} label="Copy all three" />
        </div>
      </div>
    </section>
  );
}

export default function DevPage() {
  return (
    <main className="xdv">
      <Hero />
      <Race />
      <Places />
      <Install />
      <First />
      <Models />
      <Controller />
      <Proof />
      <Sandbox />
      <Gen />
      <Source />
      <section className="x-sec xdv-qa">
        <div className="x-wrap xdv-split2 top">
          <div className="xdv-sticky"><SecHead kicker="Questions" title="Questions & Answers" /></div>
          <Faq items={QA} />
        </div>
      </section>
      <Read />
      <Paste />
    </main>
  );
}
