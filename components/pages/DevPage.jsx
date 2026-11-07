'use client';
// Persona: a developer choosing a coding agent (MASTER 1: developers).
// Goal: open Dev, or install it. Metric: signup_start (install_copy on the install commands).
// CTA: "Open Dev" -> /login?next=%2Fdev (hero, header ask bar, closing Band).
// Signature: compare (MOTION-MAP): the file beside the self-running session is a before / after slider; when Dev's change lands the divider sweeps in by itself, then the visitor drags it (or uses the arrow keys) across src/retry.ts before and after.
// Beyond: the race, each side's median task replayed at the speed it ran.
/* Hanzo Dev (MASTER 4.1, Launch: "Dev is a terminal with a diff landing"). Order (no shared sequence, MOTION-MAP):
     1. "Describe the change. Dev ships it." Dev at work, the file beside it as a before / after slider (the signature).
     2. Wherever the work is: terminal, web, cloud and Slack, each its own small UI, on a rail you throw.   [stack-drop]
     3. How it works, sheet after sheet: models, the Kai controller, proof, the sandbox fence, Gen.        [letter-cascade]
     4. The race, in the black room: each side replays its median task at the speed it ran (pause, replay).  [pendulum]
     5. Install: three ways as tabs, then sign in.                                                           [slot-roll]
     6. Source (the repository card), then questions and reading folded.                                     [zoom-through]
     7. Paste and ship, then the closing Band.
   No pinned scene and no scroll-scrubbed reveal (MOTION-MAP rule 3); each section enters its own way (components/pages/dev/enter.jsx).
   V2: 7/10 motion map: compare signature in the hero file pane (before / after slider, swept in when the change lands, draggable and keyed), five page-local entrances (stack-drop, letter-cascade, pendulum, slot-roll, zoom-through), race unpinned, sheets in plain flow, section order changed.
   Motion mix (JAMES.md 9): time (the session, the race), arrival (h1 line mask, the five entrances), pointer (the
   divider, the thrown rail, ladder and row previews), state (tab and row pills at 300 ms ease-emphasis, the fence).
   Deck greys only; a status reads by its shape (+ and -, ticks), never a hue. Every word, figure and link is Hanzo's;
   only the code in the sample session is an illustration. */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, animate, useInView, useMotionValue, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useDemo, DemoCtl } from '../v2/AppDemo';
import { EASE } from '../ui';
import { A, Faq, Cta, Band, CodeBlock, Tabs, TabPanel } from '../kit';
import AppLines from '../v2/AppLines';
import { In, Cascade, Roll } from './dev/enter';
import useCalm from '../v2/useCalm';
import './DevPage.css';

const OPEN = '/login?next=%2Fdev';
const DOCS = 'https://docs.hanzo.ai/docs/dev';
// Hanzo's own links end in a text arrow (→), so the kit Cta link carries it as text and drops its drawn one
const Lk = ({ to, children, id }) => <Cta to={to} kind="link" id={id} className="xdv-lk">{children} <i className="xdv-ar">→</i></Cta>;
const useIso = typeof window === 'undefined' ? useEffect : useLayoutEffect;
/* the kit's demo control reads reduced motion while rendering; render it only once mounted, so the server HTML and the
   first client render agree (a control is no use before scripts anyway) */
function Ctl(props) {
  const [on, setOn] = useState(false);
  useEffect(() => setOn(true), []);
  return on ? <DemoCtl {...props} /> : null;
}
const EZ = { duration: 0.3, ease: EASE }; // state changes: 300 ms, ease-emphasis, no springs (MASTER 3.1)

/* ---------- 1. hero: Dev at work ---------- */
const INSTALL = 'curl -fsSL https://hanzo.sh | sh';
const DIFF = [
  ['hunk', '@@ src/retry.ts'],
  ['ctx', '  export async function retry(fn, tries = 3) {'],
  ['del', '-   for (let i = 1; i < tries; i++) {'],
  ['add', '+   for (let i = 0; i < tries; i++) {'],
  ['ctx', '      try { return await fn(); } catch (e) { last = e; }'],
  ['ctx', '    }'],
];
/* the file as Dev reads it (an illustration, like the session): the hunk's lines plus the function's close */
const FILE = [DIFF[1][1].slice(2), '  let last;', DIFF[2][1].slice(2), DIFF[4][1].slice(2), DIFF[5][1].slice(2), '  throw last;', '}'];
const FIXED = DIFF[3][1].slice(2);
const HOT = 2; // the line the change lands on
const HIGHLIGHTS = ['Reads the repository, makes the change and runs the tests', 'Shows you the diff and waits for your review', 'In your terminal, on the web, in the cloud and in Slack', 'Enso by default, every Hanzo model by name'];
const ASK = 'Describe the change.'; // what you give Dev, in Hanzo's own words

/* the signature (MOTION-MAP: compare): the file beside the session is a before / after slider. Before Dev's change the
   whole pane is the file as it was; when the change lands the divider sweeps to the middle by itself, and from then on
   the visitor drags it (or uses the arrow keys) to compare the file before and after the edit. */
function Src({ after }) {
  return (
    <ol className="xdv-src x-mono">
      {FILE.map((l, i) => (
        <li key={i} className={i === HOT ? (after ? 'hot add' : 'hot del') : ''}>
          <span className="n">{i + 1}</span>
          <span><b className="sg">{i === HOT ? (after ? '+' : '−') : ' '}</b>{i === HOT && after ? FIXED : l}</span>
        </li>
      ))}
    </ol>
  );
}
function File({ stage, pre }) {
  const [pos, setPos] = useState(50); // the divider, in % of the pane's width; the server shows it at rest, mid-way
  const [held, setHeld] = useState(false); // the visitor has taken the divider: the demo no longer moves it
  const box = useRef(null);
  useEffect(() => {
    if (held) return;
    if (pre || stage < 2) { setPos(100); return; } // before the change: the whole pane is the file as it was
    let raf = 0; const t0 = performance.now();
    const step = (t) => { const k = Math.min(1, (t - t0) / 900); setPos(100 - 50 * (1 - Math.pow(1 - k, 3))); if (k < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [stage, pre, held]);
  const at = (x) => { const r = box.current.getBoundingClientRect(); setHeld(true); setPos(Math.max(0, Math.min(100, ((x - r.left) / r.width) * 100))); };
  const down = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    at(e.clientX);
  };
  return (
    <div className={'xdv-file s' + stage + (pre ? ' pre' : '')}>
      <div className="xdv-file-tab x-mono"><i />src/retry.ts<em className="xdv-file-ct"><b>+1</b> <s>−1</s> <u>M</u></em></div>
      <div className="xdv-cmp" ref={box} style={{ '--p': pos + '%' }}
        onPointerDown={down} onPointerMove={(e) => { if (e.currentTarget.hasPointerCapture(e.pointerId)) at(e.clientX); }}>
        <div className="xdv-cmp-a" aria-hidden="true"><Src /></div>
        <div className="xdv-cmp-b" aria-hidden="true"><Src after /></div>
        <span className="xdv-cmp-bar" aria-hidden="true"><i /></span>
        <input className="xdv-cmp-r" type="range" min="0" max="100" step="1" value={Math.round(pos)} aria-label="src/retry.ts −1 +1"
          onChange={(e) => { setHeld(true); setPos(+e.target.value); }} />
      </div>
    </div>
  );
}

function Session() {
  const box = useRef(null);
  const body = useRef(null);
  const [info, setInfo] = useState(false);
  const [live, setLive] = useState(false); // false: the server's final frame (the poster) shows
  const [stage, setStage] = useState(3);

  /* The session writes straight into the terminal's nodes (no React state per character); the file pane only changes
     at each step. It plays once when the terminal is in view (6 to 8 s), pauses off screen, and rests on its last frame. */
  const demo = useDemo(box, async (sleep) => {
    setLive(true); setStage(0);
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
    await cmd(INSTALL); await sleep(380);
    await cmd('dev'); await sleep(240);
    add('dim', 'v0.7.7 · Run /help for commands'); await sleep(320);
    const q = add('ask'); const s = document.createElement('span'); q.append('┃ ', s); const caret = document.createElement('i'); q.append(caret);
    await put(s, ASK, 40); caret.remove(); await sleep(360);
    const step = add('step run', '◐ ' + HIGHLIGHTS[0]);
    setStage(1); await sleep(1100);
    setStage(2); await sleep(900);
    setStage(3); await sleep(500);
    step.classList.remove('run'); step.classList.add('ok'); step.textContent = '✓ ' + HIGHLIGHTS[0];
    await sleep(380);
    add('final', '✓ ' + HIGHLIGHTS[1]);
  }, { amount: 0.25 });

  return (
    <div className="xdv-term" ref={box}>
      <div className="xdv-term-bar">
        <i aria-hidden="true" /><i aria-hidden="true" /><i aria-hidden="true" />
        <b className="x-mono">Hanzo Dev · Coding agent</b>
        <button type="button" className="xdv-info" aria-expanded={info} aria-controls="xdv-demo" onClick={() => setInfo(!info)}>(i)</button>
        <Ctl demo={demo} className="dark xdv-ctl" />
      </div>
      <p id="xdv-demo" className={'xdv-demo' + (info ? ' on' : '')} aria-hidden={!info}>This interactive demo runs Hanzo Dev in your browser with an in-memory workspace (@acme/api).</p>
      <div className="xdv-panes">
        <div className="xdv-term-col">
          {/* the poster: the session's final frame, in the server HTML (JS off, reduced motion, before it plays) */}
          {!live && (
            <div className="xdv-term-body xdv-poster">
              <div className="xt p"><b>$ </b>{INSTALL}</div><div className="xt p"><b>$ </b>dev</div>
              <div className="xt dim">v0.7.7 · Run /help for commands</div>
              <div className="xt ask">┃ {ASK}</div>
              <div className="xt step ok">✓ {HIGHLIGHTS[0]}</div>
              <div className="xt final">✓ {HIGHLIGHTS[1]}</div>
            </div>
          )}
          <div className={'xdv-term-body' + (live ? '' : ' xdv-off')} ref={body} aria-hidden="true" />
        </div>
        {/* until the session plays, the file shows its before state (with scripts on and motion allowed); the server's
            HTML keeps the landed change for JS off and reduced motion */}
        <File stage={stage} pre={!live} />
      </div>
      <ul className="x-sr">{DIFF.map(([, s], i) => <li key={i}>{s}</li>)}</ul>
      <div className="xdv-term-foot x-mono"><span>auto</span><span>·</span><span>enso-auto</span><span className="xdv-foot-h">{HIGHLIGHTS[3]}</span><em>@acme/api (main)</em></div>
    </div>
  );
}

function Hero() {
  return (
    <section className="xdv-hero" aria-labelledby="xdv-h1" data-morph-target data-ask-name="Hanzo Dev">
      <div className="v2a-wrap v2a-grid xdv-hero-top">
        <div className="xdv-hero-h">
          <AppLines as="h1" id="xdv-h1" className="v2a-display xdv-h1" lines={['Describe the change.', 'Dev ships it.']} />
        </div>
        {/* the lede and the asks arrive with the h1 by CSS (no wait for scripts): in by 600 ms */}
        <div className="xdv-hero-side xdv-arrive" style={{ '--d': '180ms' }}>
          <p className="xdv-lede">Hanzo Dev is a coding agent. It reads your repository, makes the change, runs the tests and shows you the diff — in your terminal, on the web, in the cloud and in Slack.</p>
          <div className="xdv-acts">
            <Cta to={OPEN} id="dev.hero" thumb size="lg">Open Dev</Cta>
            <Lk to={DOCS} id="dev.docs">Read the docs</Lk>
            <Lk to="https://github.com/hanzoai/dev" id="dev.github">Explore GitHub examples</Lk>
          </div>
        </div>
      </div>
      <div className="v2a-wrap xdv-term-wrap xdv-arrive" style={{ '--d': '360ms' }}>
        <Session />
      </div>
    </section>
  );
}

/* ---------- 2. the race: the room opens out, the figure grows as the moment, then each side replays its median ---------- */
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
/* the clock runs in real time while that side works and stops on its own median (Hanzo's figure), never past it */
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
  const calm = useCalm(); // read after mount, so the server HTML and the first render agree
  const t = useMotionValue(MAX); // the server shows the finished race (JS off); the browser sets it ready at once
  // with motion the board starts ready (0.00 s) and races when reached; with reduced motion it shows the finished race
  useEffect(() => { t.set(matchMedia('(prefers-reduced-motion: reduce)').matches ? MAX : 0); }, [calm, t]);
  const demo = useDemo(board, async (sleep) => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { t.set(MAX); return; } // calm: the finished race, never 0.00
    let v = 0;
    t.set(0);
    await sleep(500);
    while (v < MAX) { await sleep(32); v = Math.min(MAX, v + 0.032); t.set(v); }
  }, { amount: 0.3 }); // a third of the board on screen (on a phone the two clocks stack, so the whole board never fits)
  return (
    <section className="xdv-race" data-room="dark" ref={ref} aria-labelledby="xdv-race">
      <div className="xdv-race-pin">
        <div className="v2a-wrap">
          <div className="v2a-grid xdv-race-top">
            <h2 className="xdv-race-h" id="xdv-race"><span className="xdv-big v2a-fig">3.02×</span> <span className="xdv-race-t">faster on the same coding tasks.</span></h2>
            <p className="xdv-race-l">Hanzo Dev and Claude Code were handed the same 44 coding tasks (single-fault repairs), one try each. Each clock replays that side's median time a task, at the speed it ran.</p>
          </div>
          {/* entrance 3 (pendulum): the two sides swing in from their top edge and settle */}
          <In kind="pendulum" className="xdv-split" boxRef={board}>
            {SIDES.map((s) => <Side key={s.who} t={t} side={s} />)}
          </In>
          <div className="xdv-race-act">
            <Ctl demo={demo} className="dark" />
            <Cta kind="quiet" onClick={demo.replay} id="dev.race" className="xdv-replay-btn">Replay race</Cta>
          </div>
        </div>
      </div>
      <div className="xdv-race-after"><div className="v2a-wrap">
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
            <Lk to="/benchmarks#coding-agent" id="dev.benchmarks">Every coding task and both runs</Lk>
          </div>
        </div>
      </div></div>
    </section>
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

/* ---------- 3. one agent, four places: each its own small UI, in Hanzo's words, on a rail you throw ---------- */
const PLACES = [
  ['Terminal', 'dev', 'In any repository. It reads the code, makes the change and runs commands in a sandbox. Bare hanzo opens the same session.', 'term'],
  ['Web', 'hanzo.ai/dev', 'Describe an app. Dev writes it, runs it and deploys it, with the database, the sign-in and the storage already there.', 'web'],
  ['Cloud', 'dev cloud exec', 'Hand a task to Hanzo’s cloud and close the laptop. dev cloud diff shows what it did; dev cloud apply puts it in your checkout.', 'cloud'],
  ['Slack', null, 'An org admin connects the workspace in Dev’s settings, and the team talks to it from their channels.', 'slack'],
];
function Scene({ g }) {
  if (g === 'term') return <div className="xdv-sc term x-mono"><p><b>$</b> dev</p><p className="dim">v0.7.7 · Run /help for commands</p><p className="box">┃ {ASK}</p></div>;
  if (g === 'web') return <div className="xdv-sc web"><p className="x-mono"><i /><i /><i /><em>hanzo.ai/dev</em></p><div><span className="t">Describe an app.</span><span className="c"><b /><b /><b /></span><span className="k"><svg viewBox="0 0 16 16" width="14" height="14"><path d="M8 13V3M4 7l4-4 4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></span></div></div>;
  if (g === 'cloud') return <div className="xdv-sc cloud x-mono"><p><b>$</b> dev cloud exec</p><p><b>$</b> dev cloud diff</p><p><b>$</b> dev cloud apply</p></div>;
  return <div className="xdv-sc slack"><p className="who"><i>H</i><b>Hanzo Dev</b></p><p className="msg">{HIGHLIGHTS[1]}</p><p className="msg dim">{HIGHLIGHTS[0]}</p></div>;
}
function Places() {
  const view = useRef(null);
  const track = useRef(null);
  const x = useMotionValue(0);
  const [lim, setLim] = useState(0);
  const [pitch, setPitch] = useState(452); // one card and its gap
  const [drag, setDrag] = useState(false);
  useIso(() => {
    const fit = () => {
      const v = view.current, tr = track.current;
      if (!v || !tr) return;
      const wide = matchMedia('(min-width: 900px)').matches;
      setDrag(wide);
      const first = tr.firstElementChild;
      const pt = first ? first.offsetWidth + (parseFloat(getComputedStyle(tr).columnGap) || 12) : 452;
      setPitch(pt);
      // the end rounds up to a whole card, so the last stop also lands a card's edge on the gutter
      setLim(wide ? Math.ceil(Math.max(0, tr.scrollWidth - v.clientWidth) / pt - 0.02) * pt : 0);
      if (!wide) x.set(0);
    };
    fit();
    addEventListener('resize', fit);
    return () => removeEventListener('resize', fit);
  }, [x]);
  // each step lands a card's left edge on the gutter (gap included), so no card stops cut through its words
  const step = (d) => {
    const at = Math.round(-x.get() / pitch);
    animate(x, -Math.min(lim, Math.max(0, (at + d) * pitch)), EZ);
  };
  return (
    <section className="v2a-sec xdv-places" aria-labelledby="xdv-pl-h">
      <div className="v2a-wrap v2a-grid xdv-pl-head">
        <div className="xdv-pl-hl">
          <h2 id="xdv-pl-h" className="v2a-head">Wherever the work is.</h2>
          <p className="v2a-folio">One agent</p>
        </div>
        <div className="xdv-pl-hr">
          <p className="v2a-body">The same agent, the same models and the same account in every place it runs.</p>
          <p className="xdv-pl-cap">{HIGHLIGHTS[2]}</p>
          <div className="xdv-pl-ctl">
            <button type="button" aria-label="Previous place" onClick={() => step(-1)}>←</button>
            <button type="button" aria-label="Next place" onClick={() => step(1)}>→</button>
          </div>
        </div>
      </div>
      {/* entrance 1 (stack-drop): the four places drop from above and stack onto their places, one after another */}
      <In kind="stack-drop" className="xdv-pl-view" boxRef={view} data-drag={drag ? '' : undefined}>
        <motion.ul className="xdv-pl" ref={track} style={{ x }} drag={drag ? 'x' : false} dragConstraints={{ left: -lim, right: 0 }} dragElastic={0.08} dragTransition={{ power: 0.35, timeConstant: 320, modifyTarget: (v) => Math.round(v / pitch) * pitch }}>
          {PLACES.map(([name, tag, d, g], i) => (
            <Play as="li" key={name} className="xdv-pl-card" style={{ '--d': i }}>
              <div className={'xdv-pl-art ' + g} aria-hidden="true"><Scene g={g} /></div>
              <div className="xdv-pl-txt">
                <h3>{name}</h3>
                {tag && <code className="xdv-tag">{tag}</code>}
                <p>{d}</p>
              </div>
            </Play>
          ))}
        </motion.ul>
      </In>
      <div className="v2a-wrap xdv-pl-more"><Lk to={OPEN} id="dev.web">Open Dev on the web</Lk></div>
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

function Rows({ list, at, set, label }) {
  return (
    <div className="xdv-code">
      <div className="xdv-rows" role="group" aria-label={label}>
        {list.map(([c, note], i) => (
          <button key={c} type="button" aria-pressed={at === i} onClick={() => set(i)}>
            {at === i && <motion.span layoutId={'xdv-row-' + label} className="xdv-row-bg" transition={EZ} />}
            <code><span className="p">{c}</span>{'  '}<span className="c">{note}</span></code>
          </button>
        ))}
      </div>
    </div>
  );
}

function Sheet({ n, kick, title, lede, links, children }) {
  return (
    // entrance 2 (letter-cascade): as each sheet arrives its title's letters fall into place one by one
    <In as="article" kind="letter-cascade" amount={0.3} className={'xdv-sheet' + (n % 2 ? ' flip' : '')} style={{ '--k': n }}>
      <div className="xdv-sheet-in v2a-grid">
        <div className="xdv-sheet-l">
          <h3 className="v2a-head"><Cascade text={title} /></h3>
          {lede && <p className="v2a-body xdv-sheet-lede">{lede}</p>}
          {links && <div className="xdv-sheet-links">{links}</div>}
          <p className="v2a-folio xdv-sheet-f"><span className="x-mono">{String(n + 1).padStart(2, '0')}</span>{kick}</p>
        </div>
        <div className="xdv-sheet-r">{children}</div>
      </div>
    </In>
  );
}

function How() {
  const [pick, setPick] = useState(0);
  const [rung, setRung] = useState(0);
  const [flag, setFlag] = useState(0);
  return (
    <section className="xdv-how" aria-label="How Dev works">
      <div className="v2a-wrap xdv-stack">
        <Sheet n={0} kick="Models" title="Enso by default. Any model by name." lede="Dev starts on enso-auto through api.hanzo.ai, so every call is metered on your Hanzo account. Every model Hanzo serves is a flag or a /model away." links={<><Lk to="/enso" id="dev.enso">Enso</Lk><Lk to="/models" id="dev.models">Every model</Lk></>}>
          <div className="xdv-pick">
            <div className="xdv-code-top"><span className="x-mono">bash</span><span className="xdv-chip x-mono" aria-live="polite"><i aria-hidden="true" />{PICKS[pick][2]}</span></div>
            <Rows list={PICKS} at={pick} set={setPick} label="Pick how to name the model" />
          </div>
        </Sheet>
        <Sheet n={1} kick="Controller" title="Kai decides. Dev does." lede="Kai is Dev’s own controller, not an adviser. At each step it returns an operation Dev can run, or says plainly that it abstains. The cheapest step that holds is the one taken." links={<Lk to="/kai" id="dev.kai">Kai, the decision model</Lk>}>
          <div className="xdv-ladder-wrap">
            <ol className="xdv-ladder" onPointerLeave={(e) => { if (e.pointerType === 'mouse') setRung(0); }}>
              {LADDER.map(([name], i) => (
                <li key={name} className={i === rung ? 'on' : ''}>
                  <button type="button" aria-pressed={i === rung} aria-controls="xdv-rung" onClick={() => setRung(i)} onPointerEnter={(e) => { if (e.pointerType === 'mouse') setRung(i); }} onFocus={() => setRung(i)}>
                    {i === rung && <motion.span layoutId="xdv-rung-bg" className="xdv-rung-bg" transition={EZ} />}
                    <span className="xdv-rung-n x-mono">{String(i + 1).padStart(2, '0')}</span>
                    <b>{name}</b>
                  </button>
                </li>
              ))}
            </ol>
            {/* every rung's line stays in the HTML; one shows at a time, in a box of fixed height, so nothing moves */}
            <div className="xdv-rung-d" id="xdv-rung" aria-live="polite">
              {LADDER.map(([name, d], i) => <p key={name} hidden={i !== rung}>{d}</p>)}
            </div>
          </div>
        </Sheet>
        <Sheet n={2} kick="Proof" title="Built to be checked." lede="Nothing counts as done because a model said so.">
          {/* the object: the verifier's ledger for the hero's change, one line per thing it records, each settling in turn
              (words already on this page: the file, its +1 −1, the exit status, the tests, the diff) */}
          <Play className="xdv-ledger x-mono" aria-hidden="true">
            <p className="xdv-led-h"><i /><span>{PROOF[2][0]}</span><em>@acme/api (main)</em></p>
            <ol>
              {[['src/retry.ts', '+1 −1'], ['the exit status', '✓'], ['the tests', '✓'], ['the diff', '+1 −1']].map(([k, v], i) => (
                <li key={k} style={{ '--i': i }}><span className="n">{String(i + 1).padStart(2, '0')}</span><span className="k">{k}</span><span className="v">{v}</span><i className="ok" /></li>
              ))}
            </ol>
            <p className="xdv-led-f">✓ {HIGHLIGHTS[1]}</p>
          </Play>
          <ul className="xdv-pr">
            {PROOF.map(([name, d]) => (
              <li key={name}>
                <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><circle cx="12" cy="12" r="10.5" fill="none" strokeWidth="1.5" /><path d="M7.5 12.5l3 3 6-6.5" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <h4>{name}</h4>
                <p>{d}</p>
              </li>
            ))}
          </ul>
        </Sheet>
        <Sheet n={3} kick="Sandbox" title="Inside the fence you set." lede="Commands run in a sandbox and are approved inside it. Ask before every action, or lift the fence for one run. A repository’s own tool servers stay off until you say you trust it.">
          <div className="xdv-sbx-r">
            <div className={'xdv-fence ' + FLAGS[flag][2]} aria-hidden="true">
              <div className="xdv-fence-box" />
              <div className="xdv-fence-in x-mono"><p><b>$</b> {FLAGS[flag][0]}</p><p className="c">{FLAGS[flag][1]}</p></div>
              <div className="xdv-fence-mcp x-mono"><i>.mcp.json</i></div>
              <div className="xdv-fence-ask"><span /></div>
            </div>
            <Rows list={FLAGS} at={flag} set={setFlag} label="Choose a flag to see its fence" />
          </div>
        </Sheet>
        <Sheet n={4} kick="Gen" title="Dev is our agent. Gen runs any agent." lede="Hanzo Gen is the harness: Claude Code, Codex, Cursor and the rest, on Hanzo’s tools and models and linked to your account. Dev is the agent it opens when none is named." links={<Lk to="/gen" id="dev.gen">Hanzo Gen</Lk>}>
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

/* ---------- 5. install: three ways as tabs, one command at a time, then sign in ---------- */
const WAYS = [
  ['hanzo.sh', 'curl -fsSL https://hanzo.sh | sh', 'Linux and macOS. One native binary, its checksum verified.'],
  ['npm', 'npm i -g hanzo', 'Every platform, Windows included. Run it as hanzo dev; the agent downloads on first run.'],
  ['Homebrew', 'brew install hanzoai/tap/hanzo-dev', 'macOS and Linux.'],
];
const SIGNIN = 'dev login                 # pick an account: Hanzo is the default\ndev login --hanzo         # straight to your Hanzo account\ndev login --with-api-key  # or paste a Hanzo API key, hidden';

function Setup() {
  const [way, setWay] = useState(0);
  return (
    // entrance 4 (slot-roll): the heading's letters roll up into place like a slot machine
    <In as="section" kind="slot-roll" amount={0.25} className="v2a-sec xdv-setup" id="install" aria-labelledby="xdv-in-h">
      <div className="v2a-wrap">
        <div className="v2a-grid xdv-in-head">
          <div className="xdv-in-hl">
            <h2 id="xdv-in-h" className="v2a-head"><Roll text="One line, three ways." /></h2>
            <p className="v2a-folio">Install</p>
          </div>
          <p className="v2a-body xdv-in-hr">Linux, macOS and Windows. Dev updates itself the way it was installed.</p>
        </div>
        <div className="v2a-grid xdv-in-body">
          <div className="xdv-in-l">
            <Tabs id="xdv-way" tabs={WAYS.map(([w]) => w)} value={way} onChange={setWay} label="One line, three ways." size="lg" />
            {WAYS.map(([w, c, d], i) => (
              <TabPanel key={w} id="xdv-way" i={i} value={way} className="xdv-way-p">
                <CodeBlock code={c} label={w} prompt />
                <p>{d}</p>
              </TabPanel>
            ))}
          </div>
          <div className="xdv-in-r">
            <p className="v2a-title">Then sign in. Hanzo IAM links the machine to your account.</p>
            <CodeBlock code={SIGNIN} label="bash" />
            <div className="xdv-in-links">
              <Lk to="https://github.com/hanzoai/dev/releases/tag/v0.7.7" id="dev.release">Latest release v0.7.7</Lk>
              <Lk to={DOCS} id="dev.start">Getting started</Lk>
            </div>
          </div>
        </div>
      </div>
    </In>
  );
}

/* ---------- 6. source, then questions and reading, folded ---------- */
const QA = [
  ['What does it cost?', 'Dev is free and open source. Its model calls go through api.hanzo.ai and are metered on your Hanzo account at the price list’s rates, so one account and one bill cover every model.'],
  ['Which systems does it run on?', 'Linux, macOS and Windows. hanzo.sh installs it on Linux and macOS, npm everywhere, Homebrew on macOS and Linux.'],
  ['How does it update?', 'The way it was installed: from its own release, from npm, or from Homebrew.'],
  ['Can I bring a key instead of signing in?', 'Yes. dev login --with-api-key takes a Hanzo API key, hidden as it is typed or read from piped stdin.'],
  ['How is Dev different from Gen?', 'Dev is Hanzo’s coding agent. Gen is the harness that runs any coding agent, Dev included, on Hanzo’s tools and models.'],
];
const READ = [
  ['Start', [['Docs', 'Install, sign in, the first session.', DOCS], ['Install', 'hanzo.sh, npm or Homebrew.', '#install'], ['Hanzo CLI', 'hanzo, and the session it opens.', '/cli']]],
  ['Models', [['Enso', 'The default.', '/enso'], ['Kai', 'The controller.', '/kai'], ['Every model', null, '/models']]],
  ['Source', [['hanzoai/dev', 'Apache-2.0.', 'https://github.com/hanzoai/dev'], ['Releases', null, 'https://github.com/hanzoai/dev/releases'], ['Hanzo Gen', 'The harness for every agent.', '/gen'], ['Hanzo Kata', 'Test, repair, and the pull request.', '/kata']]],
];
function Source() {
  return (
    <section className="v2a-sec xdv-oss" aria-labelledby="xdv-oss-h">
      <div className="v2a-wrap v2a-grid xdv-oss-top">
        <div className="xdv-oss-l">
          <h2 id="xdv-oss-h" className="v2a-head">Read every line.</h2>
          <p className="v2a-folio">Open source</p>
        </div>
        <div className="xdv-oss-r">
          <p className="xdv-oss-p">Dev is Apache-2.0 on GitHub. Build it, change it, send a pull request — <A to="https://github.com/hanzoai/dev">hanzoai/dev</A>.</p>
          <div className="xdv-oss-links"><Lk to="https://github.com/hanzoai/dev" id="dev.source">The source</Lk><Lk to="https://github.com/hanzoai/dev/releases" id="dev.releases">Releases</Lk></div>
        </div>
      </div>
      {/* the repository as an object: its name, licence and latest release, all words already on this page */}
      <div className="v2a-wrap">
        {/* entrance 5 (zoom-through): the repository flies in from far behind the screen */}
        <In kind="zoom-through" amount={0.3} className="xdv-repo x-mono" aria-hidden="true">
          <span className="xdv-repo-n"><i />hanzoai/dev</span>
          <span className="xdv-repo-t">Apache-2.0</span>
          <span className="xdv-repo-t">v0.7.7</span>
          <span className="xdv-repo-tree">{FILE.map((l, i) => <b key={i} style={{ '--i': i }}>{l || ' '}</b>)}</span>
        </In>
      </div>
      <div className="v2a-wrap v2a-grid xdv-qa">
        <div className="xdv-qa-l">
          <h2 className="v2a-head">Questions &amp; Answers</h2>
          <p className="v2a-folio">Questions</p>
        </div>
        <Play className="xdv-qa-r">
          <Faq items={QA} multi />
          <details className="xdv-read">
            <summary>
              <span><b>The agent, its controller, its source.</b><span>Where to start, what Dev thinks with, and the code.</span></span>
              <i aria-hidden="true">+</i>
            </summary>
            <p className="v2a-folio">Read</p>
            <div className="xdv-cols">
              {READ.map(([h, items]) => (
                <div key={h}>
                  <h3>{h}</h3>
                  <ul>
                    {items.map(([name, d, to]) => {
                      const inner = <><b>{name}</b>{d && <span>{d}</span>}<i aria-hidden="true">→</i></>;
                      return <li key={name}>{to.startsWith('#') ? <a href={to}>{inner}</a> : <A to={to}>{inner}</A>}</li>;
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </details>
        </Play>
      </div>
    </section>
  );
}

/* ---------- 7. paste and ship, then the closing Band ---------- */
const GO = '/pay/confirm/card?plan=go&returnUrl=https%3A%2F%2Fhanzo.ai%2Fdev'; // the Go plan, approved by James for the close
const PASTE = 'Read https://hanzo.ai/skill.md and use Hanzo Dev in my project. Start with: dev';
function Paste() {
  return (
    <section className="v2a-sec xdv-paste" aria-labelledby="xdv-paste-h">
      <div className="v2a-wrap v2a-grid xdv-paste-in">
        <div className="xdv-paste-l">
          <h2 className="v2a-head" id="xdv-paste-h">Paste this into any agent. It reads the skill manifest and calls Dev from there.</h2>
          <p className="v2a-folio">Paste and ship</p>
        </div>
        <Play className="xdv-paste-r"><CodeBlock code={PASTE} label="Agent prompt" /></Play>
      </div>
    </section>
  );
}

export default function DevPage() {
  return (
    <main className="xdv">
      <Hero />
      <Places />
      <How />
      <Race />
      <Setup />
      <Source />
      <Paste />
      <Band title="Describe the change. Dev ships it." action="Open Dev" to={OPEN} note={<><Cta kind="quiet" to={GO} id="dev.close-go" className="xdv-go">Get Hanzo Dev, $8/month</Cta><Lk to={DOCS} id="dev.close-docs">Read the docs</Lk></>} />
    </main>
  );
}
