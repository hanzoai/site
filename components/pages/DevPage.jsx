'use client';
/* Hanzo Dev, v3 (JAMES.md, PLAN-COMPONENTS 2.16, BRIEF-v3 5.1 "Dev: terminal with a diff landing").
   Persona: a developer deciding on a coding agent. Goal: open Dev (or install it). CTA: "Open Dev" (/login?next=%2Fdev),
   one solid ask in hero, the site's sticky ask bar and the dark close. Metric: signup_start (install_copy on Install).
   One idea per screen:
     1. "Describe the change. Dev ships it." Dev at work in a two-pane terminal: the task is written, Dev reads the
        repository, the diff lands in src/retry.ts beside it and the tests pass. It plays once, then rests.
     2. The race, in the one dark middle room: its edges open out as you reach it, then each side replays its median
        task at the speed it ran, once (pause and replay).
     3. Wherever the work is: terminal, web, cloud and Slack on a rail you throw sideways.
     4. How it works, as sheets that stack: models, the Kai controller, proof, the sandbox fence, Gen.
     5. Install, three ways, then sign in. 6. Source, questions, reading. 7. The dark close: paste and ship, Open Dev.
   Signature: the live session with the diff landing in the file, then the split-screen race.
   Motion mix (JAMES.md 9): time (session, race), arrival (headline cut-in, terminal rise), pointer (the thrown rail,
   ladder and row previews), state (the selection pill on model and flag rows, the fence), scroll (the race room's
   edges only). Each sheet's small scene plays once when the sheet comes in; nothing loops.
   Greys only; a status reads by its shape (+ and -, ticks), never by a hue. Every word, figure and link is Hanzo's;
   only the code in the sample session is an illustration. Removed in v3: the invented "Your first session" builder
   (an install picker, deferred by PLAN-COMPONENTS 2.16, with words that were not Hanzo's). */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, animate, useInView, useMotionValue, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useDemo, DemoCtl } from '../v2/AppDemo';
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
  const [info, setInfo] = useState(false);
  const [live, setLive] = useState(false); // false: the server's final frame (the poster) shows
  const [stage, setStage] = useState(4);
  const [tests, setTests] = useState(3);

  /* The session writes straight into the terminal's nodes (no React state per character); the file pane only changes
     at each step. It plays once when the terminal is in view, pauses off screen, and rests on its final frame. */
  const demo = useDemo(box, async (sleep) => {
    setLive(true); setStage(0); setTests(0);
    await sleep(30);
    const el = body.current;
    if (!el) return;
    el.textContent = '';
    const add = (cls, text = '') => { const d = document.createElement('div'); d.className = 'xt ' + cls; d.textContent = text; el.appendChild(d); el.scrollTop = el.scrollHeight; return d; };
    const put = async (node, text, ms) => { for (let i = 1; i <= text.length; i++) { node.textContent = text.slice(0, i); await sleep(ms + (i % 5) * 6); } };
    const cmd = async (text) => {
      const d = add('p'); const pre = document.createElement('b'); pre.textContent = '$ '; const s = document.createElement('span');
      d.append(pre, s); const caret = document.createElement('i'); d.append(caret);
      await put(s, text, 22); caret.remove();
    };
    const step = async (label, done, work) => {
      const d = add('step', label); d.classList.add('run');
      await work(); await sleep(220);
      d.classList.remove('run'); d.classList.add('ok'); d.textContent = '✓ ' + done;
    };
    await cmd(INSTALL); await sleep(420);
    await cmd('dev'); await sleep(260);
    add('dim', 'v0.7.7 · Run /help for commands'); await sleep(340);
    const q = add('ask'); const s = document.createElement('span'); q.append('┃ ', s); const caret = document.createElement('i'); q.append(caret);
    await put(s, TASK, 18); caret.remove(); await sleep(340);
    setStage(1);
    await step('◐ Reading the repository', 'Read the repository', () => sleep(1000));
    await step('◐ Making the change', 'Made the change', async () => {
      for (const [c, line] of DIFF) { add('d ' + c, line); if (c === 'add') setStage(2); await sleep(160); }
      await sleep(360);
    });
    setStage(3);
    await step('◐ Running the tests', 'Ran the tests', async () => {
      for (const [i, line] of TESTS.entries()) {
        const r = add('test', '○ ' + line); await sleep(480);
        r.classList.add('ok'); r.textContent = '✓ ' + line; setTests(i + 1);
      }
    });
    add('done', '3 passed'); setStage(4); await sleep(380);
    add('final', 'Diff ready. Waiting for your review.');
  }, { amount: 0.3 });

  return (
    <div className="xdv-term" ref={box}>
      <div className="xdv-term-bar">
        <i aria-hidden="true" /><i aria-hidden="true" /><i aria-hidden="true" />
        <b className="x-mono">Hanzo Dev · Coding agent</b>
        <button type="button" className="xdv-info" aria-expanded={info} aria-controls="xdv-demo" onClick={() => setInfo(!info)}>(i)</button>
        <DemoCtl demo={demo} className="dark xdv-ctl" />
      </div>
      <p id="xdv-demo" className={'xdv-demo' + (info ? ' on' : '')} aria-hidden={!info}>This interactive demo runs Hanzo Dev in your browser with an in-memory workspace (@acme/api).</p>
      <div className="xdv-panes">
        <div className="xdv-term-col">
          {/* the poster: the session's final frame, in the server HTML (JS off, reduced motion, before it plays) */}
          {!live && (
            <div className="xdv-term-body xdv-poster">
              <div className="xt p"><b>$ </b>{INSTALL}</div><div className="xt p"><b>$ </b>dev</div>
              <div className="xt dim">v0.7.7 · Run /help for commands</div>
              <div className="xt ask">┃ {TASK}</div>
              <div className="xt step ok">✓ Read the repository</div><div className="xt step ok">✓ Made the change</div>
              {DIFF.map(([c, line], i) => <div key={i} className={'xt d ' + c}>{line}</div>)}
              <div className="xt step ok">✓ Ran the tests</div>
              {TESTS.map((line) => <div key={line} className="xt test ok">✓ {line}</div>)}
              <div className="xt done">3 passed</div><div className="xt final">Diff ready. Waiting for your review.</div>
            </div>
          )}
          <div className={'xdv-term-body' + (live ? '' : ' xdv-off')} ref={body} aria-hidden="true" />
        </div>
        <File stage={stage} tests={tests} />
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
          <AppLines as="h1" id="xdv-h1" className="v2a-display xdv-h1" lines={['Describe the change.', 'Dev ships it.']} soft={[1]} />
        </div>
        <motion.div className="xdv-hero-side" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}>
          <p className="xdv-lede">Hanzo Dev is a coding agent. It reads your repository, makes the change, runs the tests and shows you the diff — in your terminal, on the web, in the cloud and in Slack.</p>
          <div className="xdv-acts">
            <Btn to="/login?next=%2Fdev" solid data-thumb="Open Dev" data-cta="dev.hero">Open Dev</Btn>
            <Lk to="https://docs.hanzo.ai/docs/dev">Read the docs</Lk>
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
  const calm = useReducedMotion();
  const t = useMotionValue(MAX); // the server shows the finished race
  // the room's edges open out to the full width as it arrives (a function of the scroll, never a native timeline)
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start end', 'start 0.15'] });
  const clip = useTransform(p, (v) => {
    const k = 1 - Math.min(1, Math.max(0, v));
    return `inset(0 ${(k * 4.5).toFixed(2)}vw round ${(k * 48).toFixed(1)}px)`;
  });
  // the race runs once at the speed it ran when the board is in view, pauses off screen, and rests on its result
  const demo = useDemo(board, async (sleep) => {
    let v = 0;
    t.set(0);
    await sleep(400);
    while (v < MAX) { await sleep(32); v = Math.min(MAX, v + 0.032); t.set(v); }
  }, { amount: 0.4 });
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
          <DemoCtl demo={demo} className="dark" />
          <motion.button type="button" className="x-btn xdv-replay-btn" onClick={demo.replay} whileTap={{ scale: 0.97 }}>
            <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><path d="M13 8a5 5 0 1 1-1.6-3.7M13 2.5v3h-3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Replay race
          </motion.button>
        </div>
        <ul className="x-sr">{SIDES.map((s) => <li key={s.who}>{s.who}: {s.s.toFixed(2)} s median time a task, {s.calls} model calls a task</li>)}</ul>
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

/* A part whose small CSS scene plays once, the first time any of it reaches the screen ([data-play]); before that
   and under reduced motion it shows its resting (final) frame. */
function Play({ as = 'div', className = '', children, ...r }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0 });
  const Tag = as;
  return <Tag ref={ref} className={className} data-play={seen ? '' : undefined} {...r}>{children}</Tag>;
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
  return <div className="xdv-sc slack"><p aria-hidden="true"><i /><b /></p><span className="m"><i /><b /><b /></span><span className="m dev"><i /><b /><b /></span><span className="m"><i /><b /></span></div>;
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
          <AppLines as="h2" view id="xdv-pl-h" className="v2a-display sm" lines={['Wherever the work is.']} />
          <p className="v2a-folio">One agent</p>
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
            <Play as="li" key={t} className="xdv-pl-card">
              <div className={'xdv-pl-art ' + g} aria-hidden="true"><Scene g={g} /></div>
              <div className="xdv-pl-txt">
                <h3>{t}</h3>
                {tag && <code className="xdv-tag">{tag}</code>}
                <p>{d}</p>
              </div>
            </Play>
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
            {at === i && <motion.span layoutId={'xdv-row-' + label} className="xdv-row-bg" transition={{ type: 'spring', stiffness: 500, damping: 35 }} />}
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
    <Play as="article" className={'xdv-sheet ' + tone} style={{ '--k': n }}>
      <div className="xdv-sheet-in v2a-grid">
        <div className="xdv-sheet-l">
          <h3 className="v2a-head">{title}</h3>
          {lede && <p className="v2a-body xdv-sheet-lede">{lede}</p>}
          {links && <div className="x-row-links tight">{links}</div>}
          <p className="v2a-folio xdv-sheet-f"><span className="x-mono">{String(n + 1).padStart(2, '0')}</span>{kick}</p>
        </div>
        <div className="xdv-sheet-r">{children}</div>
      </div>
    </Play>
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

/* ---------- 5. the spec: install three ways, then sign in ---------- */
const WAYS = [
  ['hanzo.sh', 'curl -fsSL https://hanzo.sh | sh', 'Linux and macOS. One native binary, its checksum verified.'],
  ['npm', 'npm i -g hanzo', 'Every platform, Windows included. Run it as hanzo dev; the agent downloads on first run.'],
  ['Homebrew', 'brew install hanzoai/tap/hanzo-dev', 'macOS and Linux.'],
];

function Setup() {
  return (
    <section className="v2a-sec xdv-setup" id="install" aria-labelledby="xdv-in-h">
      <div className="v2a-wrap">
        <div className="v2a-grid xdv-in-head">
          <div className="xdv-in-hl">
            <AppLines as="h2" view id="xdv-in-h" className="v2a-display sm" lines={['One line, three ways.']} />
            <p className="v2a-folio">Install</p>
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
        <AppLines as="h2" view id="xdv-oss-h" className="v2a-display md" lines={['Read every line.']} />
        <p className="v2a-folio">Open source</p>
        <p className="xdv-oss-p">Dev is Apache-2.0 on GitHub. Build it, change it, send a pull request — <a href="https://github.com/hanzoai/dev" target="_blank" rel="noopener noreferrer">hanzoai/dev</a>.</p>
        <div className="x-row-links"><Lk to="https://github.com/hanzoai/dev">The source</Lk><Lk to="https://github.com/hanzoai/dev/releases">Releases</Lk></div>

        <div className="v2a-grid xdv-qa">
          <div className="xdv-qa-l"><h2 className="v2a-head">Questions &amp; Answers</h2><p className="v2a-folio">Questions</p></div>
          <div className="xdv-qa-r"><Faq items={QA} /></div>
        </div>

        <div className="xdv-read">
          <div className="v2a-grid xdv-read-h">
            <div><h2 className="v2a-head">The agent, its controller, its source.</h2><p className="v2a-folio">Read</p></div>
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
    <section className="xdv-paste" data-room="dark" aria-labelledby="xdv-paste-h">
      <div className="v2a-wrap xdv-paste-in">
        <h2 className="xdv-paste-l" id="xdv-paste-h">Paste this into any agent. It reads the skill manifest and calls Dev from there.</h2>
        <p className="v2a-folio">Paste and ship</p>
        <div className="xdv-prompt">
          <div className="xdv-prompt-top"><span className="x-mono">Agent prompt</span><Copy text={PASTE} /></div>
          <p className="x-mono">{PASTE}</p>
        </div>
        <div className="xdv-paste-go"><Btn to="/login?next=%2Fdev" solid data-thumb="Open Dev" data-cta="dev.close">Open Dev</Btn></div>
      </div>
    </section>
  );
}

export default function DevPage() {
  return (
    <main className="xdv" data-ask-name="Hanzo Dev">
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
