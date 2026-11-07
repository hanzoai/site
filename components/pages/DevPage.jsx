'use client';
/* Hanzo Dev, v2 (VISION.md archetype A, Launch, terminal-first). One idea per screen:
     1. "Describe the change. Dev ships it." The hero is Dev itself at work: a two-pane terminal where the task is
        typed, Dev reads the repository, the diff lands in the file beside it and the tests turn green.
     2. The race, in the page's one dark room. The room opens out to the full width as you reach it, and the 3.02×
        result replays at the speed each side ran.
     3. Wherever the work is: terminal, web, cloud and Slack on a rail you throw sideways.
     4. How it works, as sheets that stack: models, the Kai controller, proof, the sandbox fence, Gen.
     5. The spec: install three ways, sign in, and your first session. 6. Source, questions, reading. 7. Paste and ship.
   Signature: the live session. The task types, the diff lands line by line in src/retry.ts and the tests go green,
   then the split-screen race replays the median task on each side, at the speed it ran.
   Supporting: headlines rise out of masks; the dark room's edges open with the scroll (clip-path); the places rail
   is dragged with inertia. The stacked sheets are layout only (CSS sticky), not motion.
   Beyond: "Your first session". Say what you are on, how you sign in, which model and whether Dev asks first, and the
   page writes your whole first session in Hanzo's own commands, to copy in one go.
   Accent: the terminal's green, from the tests going green. Every word, figure and link is Hanzo's; only the code in
   the sample session is an illustration. */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, animate, useInView, useMotionValue, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { Copy } from '../ui';
import { A, Faq } from '../kit';
import AppLines from '../v2/AppLines';
import './DevPage.css';

const Lk = ({ to, children, className = '', ...r }) => {
  const inner = <><span>{children}</span><i aria-hidden="true">→</i></>;
  return to.startsWith('#')
    ? <a href={to} className={'x-arrow ' + className} {...r}>{inner}</a>
    : <A to={to} className={'x-arrow ' + className} {...r}>{inner}</A>;
};
const Btn = ({ to, children, solid, ...r }) => <A to={to} className={'x-btn' + (solid ? ' solid' : '')} {...r}>{children}</A>;
const useIso = typeof window === 'undefined' ? useEffect : useLayoutEffect;

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

/* ---------- 1. hero: Dev at work ---------- */
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
const FILE = [DIFF[1][1].slice(2), DIFF[2][1].slice(2), DIFF[4][1].slice(2), DIFF[5][1].slice(2)];
const FIXED = DIFF[3][1].slice(2);

/* the file beside the session: Dev reads it, the edit lands on line 2, the tests below it go green */
function File({ stage, tests }) {
  return (
    <div className={'xdv-file s' + stage} aria-hidden="true">
      <div className="xdv-file-tab x-mono"><i />src/retry.ts{stage >= 2 && <em>M</em>}</div>
      <ol className="xdv-src x-mono">
        {FILE.map((l, i) => (
          <li key={i} className={i === 1 ? 'hot' : ''} style={{ '--i': i }}>
            <span className="n">{i + 1}</span>
            {i === 1
              ? <span className="xdv-swap"><span className="old">{l}</span><span className="new">{FIXED}</span></span>
              : <span>{l}</span>}
          </li>
        ))}
      </ol>
      <div className="xdv-tests">
        {TESTS.map((t, i) => <p key={t} className={'x-mono' + (tests > i ? ' ok' : '') + (stage === 3 && tests === i ? ' run' : '')}><i />{t}</p>)}
        <p className={'xdv-pass x-mono' + (stage >= 4 ? ' on' : '')}>3 passed</p>
      </div>
    </div>
  );
}

function Session() {
  const box = useRef(null);
  const body = useRef(null);
  const seen = useInView(box, { amount: 0.25 });
  const calm = useReducedMotion();
  const [n, setN] = useState(0);
  const [info, setInfo] = useState(false);
  const [stage, setStage] = useState(4);
  const [tests, setTests] = useState(3);

  /* The session writes straight into the terminal's nodes (no React state per character) and stops off screen;
     the file pane only changes at each step. */
  useEffect(() => {
    const el = body.current;
    if (!el || (!seen && !calm)) return;
    let live = true;
    const k = calm ? 0 : 1;
    const sleep = (ms) => new Promise((ok, no) => setTimeout(() => (live ? ok() : no(STOP)), ms * k));
    const add = (cls, text = '') => { const d = document.createElement('div'); d.className = 'xt ' + cls; d.textContent = text; el.appendChild(d); return d; };
    const put = async (node, text, ms) => {
      if (!k) { node.textContent = text; return; }
      for (let i = 1; i <= text.length; i++) { node.textContent = text.slice(0, i); await sleep(ms); }
    };
    const cmd = async (text) => {
      const d = add('p'); const pre = document.createElement('b'); pre.textContent = '$ '; const t = document.createElement('span');
      d.append(pre, t); const caret = document.createElement('i'); d.append(caret);
      await put(t, text, 28); caret.remove();
    };
    const step = async (label, done, work) => {
      const d = add('step', label); d.classList.add('run');
      await work(); await sleep(220);
      d.classList.remove('run'); d.classList.add('ok'); d.textContent = '✓ ' + done;
    };
    const play = async () => {
      el.textContent = ''; setStage(0); setTests(0);
      await cmd(INSTALL); await sleep(500);
      await cmd('dev'); await sleep(300);
      add('dim', 'v0.7.7 · Run /help for commands'); await sleep(400);
      const q = add('ask'); const t = document.createElement('span'); q.append('┃ ', t); const caret = document.createElement('i'); q.append(caret);
      await put(t, TASK, 24); caret.remove(); await sleep(380);
      setStage(1);
      await step('◐ Reading the repository', 'Read the repository', () => sleep(1100));
      await step('◐ Making the change', 'Made the change', async () => {
        for (const [c, s] of DIFF) { add('d ' + c, s); if (c === 'add') setStage(2); await sleep(170); }
        await sleep(400);
      });
      setStage(3);
      await step('◐ Running the tests', 'Ran the tests', async () => {
        for (const [i, s] of TESTS.entries()) {
          const r = add('test', '○ ' + s); await sleep(560);
          r.classList.add('ok'); r.textContent = '✓ ' + s; setTests(i + 1);
        }
      });
      add('done', '3 passed'); setStage(4); await sleep(420);
      add('final', 'Diff ready. Waiting for your review.');
    };
    (async () => {
      try {
        do { await play(); if (calm) return; await sleep(6000); } while (live);
      } catch (e) { if (e !== STOP) throw e; }
    })();
    return () => { live = false; };
  }, [seen, calm, n]);

  return (
    <div className="xdv-term" ref={box}>
      <div className="xdv-term-bar">
        <i aria-hidden="true" /><i aria-hidden="true" /><i aria-hidden="true" />
        <b className="x-mono">dev</b>
        <button type="button" className="xdv-info" aria-expanded={info} aria-controls="xdv-demo" onClick={() => setInfo(!info)}>(i)</button>
        <button type="button" className="xdv-replay" onClick={() => setN(n + 1)} aria-label="Replay the session">
          <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M13 8a5 5 0 1 1-1.6-3.7M13 2.5v3h-3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>
      <p id="xdv-demo" className={'xdv-demo' + (info ? ' on' : '')} aria-hidden={!info}>This interactive demo runs Hanzo Dev in your browser with an in-memory workspace (@acme/api).</p>
      <div className="xdv-panes">
        <div className="xdv-term-body" ref={body} aria-hidden="true" />
        <File stage={stage} tests={tests} />
      </div>
      {/* the whole session as text, for readers and search engines */}
      <div className="x-sr">
        <p>$ {INSTALL}</p><p>$ dev</p><p>v0.7.7 · Run /help for commands</p><p>{TASK}</p>
        <p>Read the repository</p><p>Made the change</p>{DIFF.map(([, s], i) => <p key={i}>{s}</p>)}
        <p>Ran the tests</p>{TESTS.map((s) => <p key={s}>{s}</p>)}<p>3 passed</p><p>Diff ready. Waiting for your review.</p>
      </div>
      <div className="xdv-term-foot x-mono"><span>auto</span><span>·</span><span>enso-auto</span><em>@acme/api (main)</em></div>
    </div>
  );
}

const HIGHLIGHTS = ['Reads the repository, makes the change and runs the tests', 'Shows you the diff and waits for your review', 'In your terminal, on the web, in the cloud and in Slack', 'Enso by default, every Hanzo model by name'];

function Hero() {
  return (
    <section className="xdv-hero" aria-labelledby="xdv-h1" data-morph-target>
      <div className="v2a-wrap v2a-grid xdv-hero-top">
        <div className="xdv-hero-h">
          <p className="v2a-kick">Hanzo Dev · Coding agent</p>
          <AppLines as="h1" id="xdv-h1" className="v2a-display xdv-h1" lines={['Describe the change.', 'Dev ships it.']} soft={[1]} />
        </div>
        <motion.div className="xdv-hero-side" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}>
          <p className="xdv-lede">Hanzo Dev is a coding agent. It reads your repository, makes the change, runs the tests and shows you the diff — in your terminal, on the web, in the cloud and in Slack.</p>
          <div className="xdv-acts">
            <Btn to="/login?next=%2Fdev" solid data-thumb="Open Dev">Open Dev</Btn>
            <Btn to="https://docs.hanzo.ai/docs/dev">Read the docs</Btn>
            <Lk to="https://github.com/hanzoai/dev">Explore GitHub examples</Lk>
          </div>
        </motion.div>
      </div>
      <motion.div className="v2a-wrap xdv-term-wrap" initial={{ opacity: 0, y: 48 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}>
        <Session />
      </motion.div>
      <ul className="v2a-wrap xdv-high">
        {HIGHLIGHTS.map((t, i) => <li key={t}><span className="x-mono">{String(i + 1).padStart(2, '0')}</span>{t}</li>)}
      </ul>
    </section>
  );
}

/* ---------- 2. the race: the dark room opens out, then each side replays at the speed it ran ---------- */
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
      <motion.p className="xdv-clock">{clock}</motion.p>
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
  const board = useRef(null);
  const seen = useInView(board, { amount: 0.35 });
  const calm = useReducedMotion();
  const t = useMotionValue(0);
  const [run, setRun] = useState(0);
  // the room's edges open out to the full width as it arrives (a function of the scroll, never a native timeline)
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start end', 'start 0.15'] });
  const clip = useTransform(p, (v) => {
    const k = 1 - Math.min(1, Math.max(0, v));
    return `inset(0 ${(k * 4.5).toFixed(2)}vw round ${(k * 48).toFixed(1)}px)`;
  });
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
    <motion.section className="xdv-race" data-room="dark" ref={ref} aria-labelledby="xdv-race" style={calm ? undefined : { clipPath: clip }}>
      <div className="v2a-wrap">
        <div className="v2a-grid xdv-race-top">
          <h2 className="xdv-race-h" id="xdv-race"><span className="xdv-big v2a-fig">3.02×</span> <span className="xdv-race-t">faster on the same coding tasks.</span></h2>
          <p className="xdv-race-l">Hanzo Dev and Claude Code were handed the same 44 coding tasks (single-fault repairs), one try each. Each clock replays that side's median time a task, at the speed it ran.</p>
        </div>
        <div className="xdv-split" ref={board}>
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
        <div className="v2a-grid xdv-verdict-row">
          <p className="xdv-verdict">3.02× faster over the 42 tasks both solved, 95% interval 2.06–4.36×.</p>
          <div className="xdv-ways">
            <p className="xdv-ways-k">By how Hanzo Dev settled a task:</p>
            <ul>
              {[['Settled by search, no model call, 24 tasks', '8.22×', '6.86–9.82×', 8.22, 6.86, 9.82], ['The model’s first edit, 4 tasks', '1.31×', '1.14–1.48×', 1.31, 1.14, 1.48]].map(([w, v, ci, x, lo, hi]) => (
                <li key={w}>
                  <span className="xdv-way">{w}</span>
                  <b className="x-mono">{v}</b><span className="xdv-ci-t x-mono"><span>·</span> <span>95%</span> <span>{ci}</span></span>
                  <i className="xdv-ci" aria-hidden="true">
                    <b style={{ width: x * 10 + '%' }} />
                    <u style={{ left: lo * 10 + '%', width: (hi - lo) * 10 + '%' }} />
                  </i>
                </li>
              ))}
            </ul>
            <Lk to="/benchmarks#coding-agent">Every coding task and both runs</Lk>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

/* ---------- 3. one agent, four places: a rail you throw ---------- */
const PLACES = [
  ['Terminal', 'dev', 'In any repository. It reads the code, makes the change and runs commands in a sandbox. Bare hanzo opens the same session.', 'term'],
  ['Web', 'hanzo.ai/dev', 'Describe an app. Dev writes it, runs it and deploys it, with the database, the sign-in and the storage already there.', 'web'],
  ['Cloud', 'dev cloud exec', 'Hand a task to Hanzo’s cloud and close the laptop. dev cloud diff shows what it did; dev cloud apply puts it in your checkout.', 'cloud'],
  ['Slack', null, 'An org admin connects the workspace in Dev’s settings, and the team talks to it from their channels.', 'slack'],
];
function Scene({ g }) {
  if (g === 'term') return <div className="xdv-sc term"><p className="x-mono"><b>$</b> dev<i /></p><span /><span /><span /></div>;
  if (g === 'web') return <div className="xdv-sc web"><p className="x-mono"><i /><i /><i /><em>hanzo.ai/dev</em></p><div><span /><span /><span /><b /></div></div>;
  if (g === 'cloud') return <div className="xdv-sc cloud"><p className="x-mono"><b>$</b> dev cloud exec</p><div className="orb"><i /><i /><i /></div><p className="x-mono dim">dev cloud diff · dev cloud apply</p></div>;
  return <div className="xdv-sc slack"><p className="x-mono"># dev</p><span className="m"><i /><b /><b /></span><span className="m dev"><i /><b /><b /></span><span className="m"><i /><b /></span></div>;
}
function Places() {
  const view = useRef(null);
  const track = useRef(null);
  const x = useMotionValue(0);
  const [lim, setLim] = useState(0);
  const [drag, setDrag] = useState(false);
  useIso(() => {
    const fit = () => {
      const v = view.current, t = track.current;
      if (!v || !t) return;
      const wide = matchMedia('(min-width: 901px)').matches;
      setDrag(wide);
      setLim(wide ? Math.max(0, t.scrollWidth - v.clientWidth) : 0);
      if (!wide) x.set(0);
    };
    fit();
    addEventListener('resize', fit);
    return () => removeEventListener('resize', fit);
  }, [x]);
  const step = (d) => {
    const card = track.current?.firstElementChild?.offsetWidth || 400;
    animate(x, Math.max(-lim, Math.min(0, x.get() - d * (card + 24))), { type: 'spring', stiffness: 300, damping: 30 });
  };
  return (
    <section className="v2a-sec xdv-places" aria-labelledby="xdv-pl-h">
      <div className="v2a-wrap v2a-grid xdv-pl-head">
        <div className="xdv-pl-hl">
          <p className="v2a-kick">One agent</p>
          <AppLines as="h2" view id="xdv-pl-h" className="v2a-display sm" lines={['Wherever the work is.']} />
        </div>
        <div className="xdv-pl-hr">
          <p className="v2a-body">The same agent, the same models and the same account in every place it runs.</p>
          <div className="xdv-pl-ctl">
            <button type="button" aria-label="Previous place" onClick={() => step(-1)}>←</button>
            <button type="button" aria-label="Next place" onClick={() => step(1)}>→</button>
          </div>
        </div>
      </div>
      <div className="xdv-pl-view" ref={view} data-drag={drag ? '' : undefined}>
        <motion.ul className="xdv-pl" ref={track} style={{ x }} drag={drag ? 'x' : false} dragConstraints={{ left: -lim, right: 0 }} dragElastic={0.08} dragTransition={{ power: 0.35, timeConstant: 320 }}>
          {PLACES.map(([t, tag, d, g]) => (
            <li key={t} className="xdv-pl-card">
              <div className={'xdv-pl-art ' + g} aria-hidden="true"><Scene g={g} /></div>
              <div className="xdv-pl-txt">
                <h3>{t}</h3>
                {tag && <code className="xdv-tag">{tag}</code>}
                <p>{d}</p>
              </div>
            </li>
          ))}
        </motion.ul>
      </div>
      <div className="v2a-wrap x-row-links"><Lk to="/login?next=%2Fdev">Open Dev on the web</Lk></div>
    </section>
  );
}

/* ---------- 4. how it works: sheets that stack ---------- */
const PICKS = [['dev', '# enso-auto, through api.hanzo.ai', 'enso-auto'], ['dev --model enso-ultra', '# name any model Hanzo serves', 'enso-ultra'], ['/model zen5-coder', '# or switch inside a session', 'zen5-coder']];
const LADDER = [
  ['An action applies', 'One candidate, its preconditions hold: it runs, and no model is asked.'],
  ['Kai decides', 'Where to fix, what to do and how hard to try, asked of Kai in one structured call.'],
  ['Generate, low effort', 'A model writes the edit, asked for as a strict schema.'],
  ['Generate, full effort', 'The same, given room to reason.'],
  ['Recover', 'A failure seen before with nothing changed picks a different action, or escalates. It never replays the loop.'],
];
const PROOF = [
  ['Verified, not predicted', 'A step is settled by what the verifier records — the exit status, the tests, the diff — never by what anything expected.'],
  ['Bound to the revision', 'Preconditions are checked just before an action runs, and an edit voids every decision made against the files as they were.'],
  ['A ledger you can replay', 'Every decision, fallback, run and verification is a line with a stable id and its reason, credentials redacted, so its time and cost can be read back.'],
];
const FLAGS = [['hanzo dev --ask', '# ask before each action', 'ask'], ['hanzo dev --no-sandbox', '# run unconfined, for this run only', 'open'], ['hanzo dev --project-mcp', "# also load this repository's .mcp.json", 'mcp']];

function Rows({ list, at, set, label, id }) {
  return (
    <div className="xdv-code">
      <div className="xdv-rows" role="group" aria-label={label}>
        {list.map(([c, note], i) => (
          <button key={c} type="button" aria-pressed={at === i} onClick={() => set(i)}>
            {at === i && <span className="xdv-row-bg" />}
            <code><span className="p">{c}</span>{'  '}<span className="c">{note}</span></code>
          </button>
        ))}
      </div>
      {id}
    </div>
  );
}

function Sheet({ n, kick, title, lede, links, children, tone = '' }) {
  return (
    <article className={'xdv-sheet ' + tone} style={{ '--k': n }}>
      <div className="xdv-sheet-in v2a-grid">
        <div className="xdv-sheet-l">
          <p className="v2a-kick"><span className="x-mono xdv-sheet-n">{String(n + 1).padStart(2, '0')}</span>{kick}</p>
          <h3 className="v2a-head">{title}</h3>
          {lede && <p className="v2a-body xdv-sheet-lede">{lede}</p>}
          {links && <div className="x-row-links tight">{links}</div>}
        </div>
        <div className="xdv-sheet-r">{children}</div>
      </div>
    </article>
  );
}

function How() {
  const [pick, setPick] = useState(0);
  const [rung, setRung] = useState(0);
  const [flag, setFlag] = useState(0);
  return (
    <section className="xdv-how" aria-label="How Dev works">
      <div className="v2a-wrap xdv-stack">
        <Sheet n={0} kick="Models" title="Enso by default. Any model by name." lede="Dev starts on enso-auto through api.hanzo.ai, so every call is metered on your Hanzo account. Every model Hanzo serves is a flag or a /model away." links={<><Lk to="/enso">Enso</Lk><Lk to="/models">Every model</Lk></>}>
          <div className="xdv-pick">
            <div className="xdv-code-top"><span className="x-mono">bash</span><span className="xdv-chip x-mono" aria-live="polite"><i aria-hidden="true" />{PICKS[pick][2]}</span></div>
            <Rows list={PICKS} at={pick} set={setPick} label="Pick how to name the model" />
          </div>
        </Sheet>
        <Sheet n={1} kick="Controller" title="Kai decides. Dev does." lede="Kai is Dev’s own controller, not an adviser. At each step it returns an operation Dev can run, or says plainly that it abstains. The cheapest step that holds is the one taken." links={<Lk to="/kai">Kai, the decision model</Lk>}>
          <ol className="xdv-ladder" onPointerLeave={(e) => { if (e.pointerType === 'mouse') setRung(0); }}>
            {LADDER.map(([t, d], i) => (
              <li key={t} className={i === rung ? 'on' : ''}>
                <button type="button" aria-pressed={i === rung} onClick={() => setRung(i)} onPointerEnter={(e) => { if (e.pointerType === 'mouse') setRung(i); }}>
                  <span className="xdv-rung-n x-mono">{String(i + 1).padStart(2, '0')}</span>
                  <span><b>{t}</b><span>{d}</span></span>
                </button>
              </li>
            ))}
          </ol>
        </Sheet>
        <Sheet n={2} kick="Proof" title="Built to be checked." lede="Nothing counts as done because a model said so." tone="ink">
          <ul className="xdv-pr">
            {PROOF.map(([t, d]) => (
              <li key={t}>
                <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><circle cx="12" cy="12" r="10.5" fill="none" strokeWidth="1.5" /><path d="M7.5 12.5l3 3 6-6.5" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <h4>{t}</h4>
                <p>{d}</p>
              </li>
            ))}
          </ul>
        </Sheet>
        <Sheet n={3} kick="Sandbox" title="Inside the fence you set." lede="Commands run in a sandbox and are approved inside it. Ask before every action, or lift the fence for one run. A repository’s own tool servers stay off until you say you trust it.">
          <div className="xdv-sbx-r">
            <div className={'xdv-fence ' + FLAGS[flag][2]} aria-hidden="true">
              <div className="xdv-fence-box" />
              <div className="xdv-fence-in"><i /><i /><i /><b /></div>
              <div className="xdv-fence-mcp"><i /><i /></div>
              <div className="xdv-fence-ask"><span /></div>
            </div>
            <Rows list={FLAGS} at={flag} set={setFlag} label="Choose a flag to see its fence" />
          </div>
        </Sheet>
        <Sheet n={4} kick="Gen" title="Dev is our agent. Gen runs any agent." lede="Hanzo Gen is the harness: Claude Code, Codex, Cursor and the rest, on Hanzo’s tools and models and linked to your account. Dev is the agent it opens when none is named." links={<Lk to="/gen">Hanzo Gen</Lk>}>
          <div className="xdv-harness" aria-hidden="true">
            <div className="xdv-agents">{['Claude Code', 'Codex', 'Cursor', 'Dev'].map((a, i) => <span key={a} style={{ '--i': i }} className={a === 'Dev' ? 'dev' : ''}>{a}</span>)}</div>
            <div className="xdv-bus"><i /><i /><i /><i /></div>
            <div className="xdv-gen-core">Gen</div>
          </div>
        </Sheet>
      </div>
    </section>
  );
}

/* ---------- 5. the spec: install, sign in, your first session ---------- */
const WAYS = [
  ['hanzo.sh', 'curl -fsSL https://hanzo.sh | sh', 'Linux and macOS. One native binary, its checksum verified.'],
  ['npm', 'npm i -g hanzo', 'Every platform, Windows included. Run it as hanzo dev; the agent downloads on first run.'],
  ['Homebrew', 'brew install hanzoai/tap/hanzo-dev', 'macOS and Linux.'],
];
// every line below is one of Hanzo's own commands on this page; the choices only pick between them
const FIRST = {
  sys: [['Linux or macOS', 0], ['Windows', 1], ['Homebrew', 2]],
  login: [['Hanzo account', 'dev login --hanzo'], ['Pick an account', 'dev login'], ['API key', 'dev login --with-api-key']],
  model: [['enso-auto', ''], ['enso-ultra', ' --model enso-ultra']],
};

function Setup() {
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
    <section className="v2a-sec xdv-setup" id="install" aria-labelledby="xdv-in-h">
      <div className="v2a-wrap">
        <div className="v2a-grid xdv-in-head">
          <div className="xdv-in-hl">
            <p className="v2a-kick">Install</p>
            <AppLines as="h2" view id="xdv-in-h" className="v2a-display sm" lines={['One line, three ways.']} />
          </div>
          <p className="v2a-body xdv-in-hr">Linux, macOS and Windows. Dev updates itself the way it was installed.</p>
        </div>
        <ul className="xdv-spec">
          {WAYS.map(([w, c, d]) => (
            <li key={w}>
              <span className="xdv-spec-n">{w}</span>
              <div className="xdv-cmd"><code><b>$</b> {c}</code><Copy text={c} /></div>
              <p>{d}</p>
            </li>
          ))}
        </ul>
        <div className="v2a-grid xdv-signin">
          <p className="v2a-title">Then sign in. Hanzo IAM links the machine to your account.</p>
          <Code label="bash" lines={[['dev login', '# pick an account: Hanzo is the default'], ['dev login --hanzo', '# straight to your Hanzo account'], ['dev login --with-api-key', '# or paste a Hanzo API key, hidden']]} />
        </div>
        <div className="x-row-links">
          <Lk to="https://github.com/hanzoai/dev/releases/tag/v0.7.7">Latest release v0.7.7</Lk>
          <Lk to="https://docs.hanzo.ai/docs/dev">Getting started</Lk>
        </div>

        <div className="xdv-first">
          <div className="xdv-first-l">
            <p className="v2a-kick">Your first session</p>
            <h3 className="v2a-head">Three lines, yours.</h3>
            <p className="v2a-body">Install, sign in, start. Dev updates itself the way it was installed.</p>
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
      </div>
    </section>
  );
}

/* ---------- 6. source, questions, reading ---------- */
const QA = [
  ['What does it cost?', 'Dev is free and open source. Its model calls go through api.hanzo.ai and are metered on your Hanzo account at the price list’s rates, so one account and one bill cover every model.'],
  ['Which systems does it run on?', 'Linux, macOS and Windows. hanzo.sh installs it on Linux and macOS, npm everywhere, Homebrew on macOS and Linux.'],
  ['How does it update?', 'The way it was installed: from its own release, from npm, or from Homebrew.'],
  ['Can I bring a key instead of signing in?', 'Yes. dev login --with-api-key takes a Hanzo API key, hidden as it is typed or read from piped stdin.'],
  ['How is Dev different from Gen?', 'Dev is Hanzo’s coding agent. Gen is the harness that runs any coding agent, Dev included, on Hanzo’s tools and models.'],
];
const READ = [
  ['Start', [['Docs', 'Install, sign in, the first session.', 'https://docs.hanzo.ai/docs/dev'], ['Install', 'hanzo.sh, npm or Homebrew.', '#install'], ['Hanzo CLI', 'hanzo, and the session it opens.', '/cli']]],
  ['Models', [['Enso', 'The default.', '/enso'], ['Kai', 'The controller.', '/kai'], ['Every model', null, '/models']]],
  ['Source', [['hanzoai/dev', 'Apache-2.0.', 'https://github.com/hanzoai/dev'], ['Releases', null, 'https://github.com/hanzoai/dev/releases'], ['Hanzo Gen', 'The harness for every agent.', '/gen'], ['Hanzo Kata', 'Test, repair, and the pull request.', '/kata']]],
];
function Source() {
  return (
    <section className="v2a-sec xdv-oss" aria-labelledby="xdv-oss-h">
      <div className="v2a-wrap">
        <p className="v2a-kick">Open source</p>
        <AppLines as="h2" view id="xdv-oss-h" className="v2a-display md" lines={['Read every line.']} />
        <p className="xdv-oss-p">Dev is Apache-2.0 on GitHub. Build it, change it, send a pull request — <a href="https://github.com/hanzoai/dev" target="_blank" rel="noopener noreferrer">hanzoai/dev</a>.</p>
        <div className="x-row-links"><Lk to="https://github.com/hanzoai/dev">The source</Lk><Lk to="https://github.com/hanzoai/dev/releases">Releases</Lk></div>

        <div className="v2a-grid xdv-qa">
          <div className="xdv-qa-l"><p className="v2a-kick">Questions</p><h2 className="v2a-head">Questions &amp; Answers</h2></div>
          <div className="xdv-qa-r"><Faq items={QA} /></div>
        </div>

        <div className="xdv-read">
          <div className="v2a-grid xdv-read-h">
            <div><p className="v2a-kick">Read</p><h2 className="v2a-head">The agent, its controller, its source.</h2></div>
            <p className="v2a-body">Where to start, what Dev thinks with, and the code.</p>
          </div>
          <div className="xdv-cols">
            {READ.map(([h, items]) => (
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
      </div>
    </section>
  );
}

/* ---------- 7. paste and ship: the one action ---------- */
const PASTE = 'Read https://hanzo.ai/skill.md and use Hanzo Dev in my project. Start with: dev';
function Paste() {
  return (
    <section className="v2a-sec xdv-paste">
      <div className="v2a-wrap xdv-paste-in">
        <p className="v2a-kick">Paste and ship</p>
        <p className="xdv-paste-l">Paste this into any agent. It reads the skill manifest and calls Dev from there.</p>
        <div className="xdv-prompt">
          <div className="xdv-prompt-top"><span className="x-mono">Agent prompt</span><Copy text={PASTE} /></div>
          <p className="x-mono">{PASTE}</p>
        </div>
        <div className="xdv-paste-go"><Btn to="/login?next=%2Fdev" solid>Open Dev</Btn></div>
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
      <How />
      <Setup />
      <Source />
      <Paste />
    </main>
  );
}
