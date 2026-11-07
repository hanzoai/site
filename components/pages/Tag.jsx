'use client';
/* Hanzo Tag (governance view of the same product as /slack).
   V2: 8/10 after the hero every section now holds an object (a live PR card, a stage that follows scroll through the three rooms, product frames around the runtime), row titles rest at 21px, the Built panel is a quiet room, the close has one solid ask, and the phone shows the map on its first screen.
   Persona: a workspace owner weighing what Hanzo can see. Goal: set up Hanzo Tag. CTA: Set up Hanzo Tag (tag.hero).
   Metric: cta_click on tag.hero and tag.close (data-cta; the event layer is the conductor's).
   Signature: Mention map: one @Hanzo at the centre, rings spreading out across a field of channels, then branching into
   Canvas, Diff, Preview and the merged PR #418; click any node to read that moment of the thread.
   Beyond: "Will Hanzo see this?": pick where a message lives (a channel with @Hanzo added or not, tagged or not,
   scheduled work, a direct message) and get the answer from Hanzo's own FAQ sentences.
   Idle movers are the map and the "see" picker; the three rooms and the Built index follow your scroll (a click takes
   over), and the four promises take the light in turn under the PR card they describe.
   The field holds 42 points because Hanzo's setup card says 42 channels enabled; only the tagged one lights.
   Every word, figure and link is Hanzo's (components/pages/slackData.js). */
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion, useScroll, useTransform, useMotionValueEvent } from 'motion/react';
import { A, More } from '../kit';
import Sigil from '../Sigil';
import A2Lines from '../v2/A2Lines';
import A2Paste from '../v2/A2Paste';
import A2Faq from '../v2/A2Faq';
import '../v2/A2.css';
import { HERO, SETUP, ASK, ANSWER, STEPS, SESSION, CANVAS, WINDOW, TABS, DIFF, VIEW, WHAT, BUILT, PLATFORM, CODE, FAQ, CLOSE, Parts, Msg } from './slackData';
import './Tag.css';

const P = 'xtg';
const EASE = [0.16, 1, 0.3, 1];
/* The server cannot know the visitor's motion setting: anything that depends on it waits for the first browser render,
   so the server HTML and the first client render match (no hydration mismatch under reduced motion). */
function useMounted() {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return m;
}
function useLive(amount = 0.2) {
  const ref = useRef(null);
  const seen = useInView(ref, { amount });
  const calm = useReducedMotion();
  const mounted = useMounted();
  const still = mounted && !!calm;
  return [ref, seen && mounted && !calm, still];
}
function useEvery(ms, run, fn) {
  const f = useRef(fn);
  f.current = fn;
  useEffect(() => {
    if (!run) return;
    let t = 0;
    const tick = () => { f.current(); t = setTimeout(tick, ms); };
    t = setTimeout(tick, ms);
    return () => clearTimeout(t);
  }, [ms, run]);
}
/* A section head in the v2 grammar: kicker, a line-masked headline, one sentence. */
function Head({ kick, title, lede, id, dark, size = 'a2-headline' }) {
  return (
    <header className={`${P}-head` + (dark ? ' dark' : '')}>
      {kick && <p className="a2-kick">{kick}</p>}
      <A2Lines id={id} className={size} lines={[title]} />
      {lede && <p className="a2-lede">{lede}</p>}
    </header>
  );
}
// rounded: server and browser trig can differ in the last digit, which breaks hydration
const at = (deg, r) => [+(50 + Math.cos((deg * Math.PI) / 180) * r).toFixed(2), +(50 + Math.sin((deg * Math.PI) / 180) * r).toFixed(2)];

/* The story in the order it happened: the mention, the six steps, and the three artifacts off the step that made them. */
const NODES = [
  { k: 'mention', label: '@Hanzo', xy: [50, 50] },
  { k: 's0', step: 0, label: STEPS[0], xy: at(-90, 29), side: 't' },
  { k: 's1', step: 1, label: STEPS[1], xy: at(-30, 29), side: 'r' },
  { k: 's2', step: 2, label: STEPS[2], xy: at(30, 29), side: 'r' },
  { k: 'view', leaf: 1, from: 3, label: TABS[1], xy: at(36, 43) },
  { k: 's3', step: 3, label: STEPS[3], xy: at(90, 29), side: 'b' },
  { k: 'code', leaf: 0, from: 5, label: TABS[0], xy: at(76, 43) },
  { k: 'canvas', leaf: 2, from: 5, label: TABS[2], xy: at(104, 43) },
  { k: 's4', step: 4, label: STEPS[4], xy: at(150, 29), side: 'l' },
  { k: 's5', step: 5, label: STEPS[5], xy: at(210, 29), side: 'l' },
];
// 41 enabled channels around the one that was tagged: 42, as the setup card says
const NAMED = [['incident-alert', [12, 16]], ['tryon-3d-lookbook', [88, 12]]];
const FIELD = Array.from({ length: 39 }, (_, k) => { const r = 47 * Math.sqrt((k + 3) / 42); const a = k * 137.508; return at(a, r); });

function Moment({ n, archived, setArchived }) {
  if (n.k === 'mention') return (<><Msg m={ASK} p={P} /><Msg m={ANSWER} p={P} /><p className={`${P}-chips`}>{SETUP.chips.map((c) => <span key={c}>{c}</span>)}</p></>);
  if (n.k === 'view') return (
    <div className={`${P}-pv`}>
      <div><span>{VIEW.before}</span><b style={VIEW.old}>{VIEW.button}</b></div>
      <div><span>{VIEW.after}</span><b style={VIEW.fix}>{VIEW.button}</b></div>
      <p>{VIEW.note}</p>
    </div>
  );
  if (n.k === 'code') return (
    <div className={`${P}-df`}>
      <p className={`${P}-df-h`}>{DIFF.head} · {DIFF.stat} <b className="add">{DIFF.add}</b> <b className="del">{DIFF.del}</b></p>
      <pre>{DIFF.lines.map(([, , s, t], i) => <span key={i} className={s === '+' ? 'add' : s === '-' ? 'del' : ''}>{s.trim() || ' '} {t}{'\n'}</span>)}</pre>
    </div>
  );
  if (n.k === 'canvas') return (
    <div className={`${P}-cv`}>
      <p className={`${P}-cv-t`}><i aria-hidden="true" /><span><b>{CANVAS.title}</b><span>{CANVAS.meta}</span></span></p>
      <p className={`${P}-cv-q`}><Parts body={SESSION[0].msgs[0].body} p={P} /></p>
      <p className={`${P}-cv-q`}><Parts body={SESSION[2].msgs[0].body} p={P} /></p>
    </div>
  );
  return (
    <>
      {SESSION[n.step].msgs.map((m, i) => <Msg key={i} m={m} p={P} />)}
      {n.step === 5 && <button type="button" className={`${P}-archive`} aria-pressed={archived} onClick={() => setArchived((v) => !v)}>{WINDOW.archive}</button>}
    </>
  );
}

/* The signature: the mention and everything it grew into, walked in order until you pick a node. */
function MentionMap() {
  const [ref, live, calm] = useLive(0.25);
  const [k, setK] = useState(0);
  const [mine, setMine] = useState(false);
  const [archived, setArchived] = useState(false);
  const [again, setAgain] = useState(0); // a tap on the open moment plays it again
  const cur = calm && !mine ? NODES.length - 1 : k;
  useEffect(() => {
    if (!live || mine) return;
    const t = setTimeout(() => setK((v) => (v + 1) % NODES.length), k === NODES.length - 1 ? 4800 : 2600);
    return () => clearTimeout(t);
  }, [k, live, mine]);
  useEffect(() => { // the walk picks up again a while after your last pick
    if (!mine || calm) return;
    const t = setTimeout(() => setMine(false), 9000);
    return () => clearTimeout(t);
  }, [mine, k, calm]);
  const pick = (i) => { setK(i); setMine(true); setAgain((v) => v + 1); };
  const done = cur === NODES.length - 1;
  const parent = (n, i) => (n.from !== undefined ? NODES[n.from].xy : i === 0 ? null : [50, 50]);
  return (
    <>
      <div className={`${P}-map` + (archived ? ' archived' : '')} ref={ref}>
        <div className={`${P}-map-bar`}>
          <span>{WINDOW.title}</span>
          <em className={done ? 'ok' : ''}><i aria-hidden="true" /><span className={`${P}-swap`}><span aria-hidden={done}>{WINDOW.working}</span><span aria-hidden={!done}>{WINDOW.ready}</span></span></em>
        </div>
        <div className={`${P}-field`}>
          <svg viewBox="0 0 100 100" aria-hidden="true">
            {FIELD.map(([x, y], i) => <circle key={i} cx={x} cy={y} r=".7" className={`${P}-dot`} />)}
            {NAMED.map(([c, [x, y]]) => <circle key={c} cx={x} cy={y} r="1.1" className={`${P}-dot named`} />)}
            {NODES.map((n, i) => {
              const p = parent(n, i);
              if (!p) return null;
              const [x, y] = n.xy, mx = (p[0] + x) / 2 + (y - p[1]) * 0.12, my = (p[1] + y) / 2 - (x - p[0]) * 0.12;
              return (
                <motion.path key={n.k} d={`M${p[0]} ${p[1]} Q${mx} ${my} ${x} ${y}`} className={`${P}-edge` + (n.leaf !== undefined ? ' leaf' : '') + (i === cur ? ' cur' : '')}
                  initial={false} animate={{ pathLength: i <= cur ? 1 : 0, opacity: i <= cur ? 1 : 0 }} transition={{ duration: 0.9, ease: EASE }} />
              );
            })}
          </svg>
          {[0, 1, 2].map((i) => <i key={i} className={`${P}-ring`} style={{ animationDelay: i * 1.6 + 's' }} aria-hidden="true" />)}
          {NAMED.map(([c, [x, y]]) => <span key={c} className={`${P}-chan`} style={{ left: x + '%', top: y + '%' }}># {c}</span>)}
          {NODES.map((n, i) => (
            <button
              key={n.k} type="button" aria-pressed={cur === i} aria-controls={`${P}-m-${n.k}`} aria-label={n.k === 'mention' ? '@Hanzo in #bug-button-darkmode' : n.label}
              className={`${P}-node ${n.k === 'mention' ? 'core' : n.leaf !== undefined ? 'leaf' : 'step'} ${n.side || ''}` + (i <= cur ? ' lit' : '') + (cur === i ? ' cur' : '')}
              style={{ left: n.xy[0] + '%', top: n.xy[1] + '%' }}
              onClick={() => pick(i)} data-cursor="Read"
            >
              {n.k === 'mention' ? <><b>@Hanzo</b><span>#bug-button-darkmode</span></> : n.step !== undefined ? <><b>{n.step + 1}</b><span className={`${P}-node-l`}>{n.label}</span></> : <b>{n.label}</b>}
            </button>
          ))}
        </div>
        <div className={`${P}-legend`}>
          <p><b>{WINDOW.team}</b> <span>{WINDOW.host}</span></p>
          <p className={`${P}-legend-nav`}>{WINDOW.nav.join(' · ')}</p>
          {WINDOW.groups.map(([g, chans]) => (
            <p key={g}><span className={`${P}-legend-g`}>{g}</span> {chans.map((c) => <span key={c} className={c === 'bug-button-darkmode' ? 'on' : ''}># {c}{c === 'bug-button-darkmode' && <em className={`${P}-swap`}><span aria-hidden={done}>{WINDOW.badge}</span><span aria-hidden={!done}>{WINDOW.prReady}</span></em>} </span>)}</p>
          ))}
          <p className={`${P}-legend-r`}><span>{WINDOW.repo}</span> <span>{WINDOW.branch}</span> <span>{WINDOW.artifacts}</span></p>
        </div>
      </div>
      <div className={`${P}-rail`} aria-hidden="true" data-swipe-own>
        {NODES.map((n, i) => (
          <button key={n.k} type="button" aria-pressed={cur === i} tabIndex={-1} onClick={() => pick(i)}>{n.k === 'mention' ? '@Hanzo' : n.label}</button>
        ))}
      </div>
      {/* every moment sits in one cell, so the panel keeps the height of the tallest and nothing below it jumps */}
      <div className={`${P}-moment` + (archived ? ' archived' : '')} aria-live="polite">
        {NODES.map((n, i) => (
          <div key={cur === i ? n.k + again : n.k} id={`${P}-m-${n.k}`} className={`${P}-m` + (cur === i ? ' on' : '')} aria-hidden={cur !== i} inert={cur !== i}>
            <p className={`${P}-m-k`}><span>{String(i + 1).padStart(2, '0')} / {String(NODES.length).padStart(2, '0')}</span>{n.k === 'mention' ? '@Hanzo · #bug-button-darkmode' : n.label}</p>
            <Moment n={n} archived={archived} setArchived={setArchived} />
          </div>
        ))}
      </div>
    </>
  );
}

function Hero() {
  return (
    <section className={`${P}-hero`} aria-labelledby="xtg-h1">
      <div className={`a2-wrap ${P}-hero2`}>
        <div className={`${P}-copy`}>
          <p className="a2-kick"><b>@</b> {HERO.kick}</p>
          <A2Lines as="h1" id="xtg-h1" className={`a2-headline ${P}-h1`} lines={HERO.title} now />
          <p className="a2-body">{HERO.lede}</p>
          <div className={`a2-acts ${P}-acts`}>
            <A to={HERO.acts[0][1]} className="x-btn solid" data-thumb={HERO.acts[0][0]} data-cta="tag.hero">{HERO.acts[0][0]}</A>
            <A to={HERO.acts[1][1]} className={`x-btn ${P}-wimse`}>{HERO.acts[1][0]}</A>
          </div>
          <p className={`${P}-docs`}><More to={HERO.acts[2][1]}>{HERO.acts[2][0]}</More></p>
        </div>
        <div className={`${P}-hero-grid`}>
          <MentionMap />
        </div>
      </div>
    </section>
  );
}

/* The four promises under the one thing they produce: the pull request, drawn in as it arrives. Each promise takes the
   light in turn; pointing at one gives it the light. */
function Channels() {
  const [ref, live] = useLive(0.15);
  const card = useRef(null);
  const shown = useInView(card, { once: true, amount: 0.4 });
  const [i, setI] = useState(0);
  useEvery(2800, live, () => setI((v) => (v + 1) % 4));
  return (
    <section className={`a2-sec ${P}-chans`} ref={ref}>
      <div className="a2-wrap">
        <div className={`${P}-chans-g`}>
          <Head kick={CODE.kick} title={CODE.title} lede={CODE.lede} size="a2-display s" />
          <div className={`${P}-pr` + (shown ? ' in' : '')} ref={card} aria-hidden="true">
            <p className={`${P}-pr-h`}><span>{DIFF.head}</span><span>{DIFF.stat} <b>{DIFF.add}</b> <b>{DIFF.del}</b></span></p>
            <p className={`${P}-pr-f`}><span>{DIFF.file}</span><em>{DIFF.viewed}</em></p>
            <ol className={`${P}-pr-l`}>
              {DIFF.lines.map(([a, b, s, t], k) => (
                <li key={k} className={s === '+' ? 'add' : s === '-' ? 'del' : ''} style={{ '--i': k }}><span>{a ?? ''}</span><span>{b ?? ''}</span><code>{s.trim() || ' '} {t}</code></li>
              ))}
            </ol>
            <p className={`${P}-pr-c`}><i /><span><b>{CANVAS.title}</b><span>{CANVAS.meta}</span></span><em>{SESSION[5].msgs[0].done}</em></p>
          </div>
        </div>
        <ul className={`${P}-quad`}>
          {HERO.points.map((t, k) => <li key={t} className={i === k ? 'on' : ''} onPointerEnter={() => setI(k)}><span className="x-mono">{String(k + 1).padStart(2, '0')}</span><p>{t}</p><b className={`${P}-timer`} aria-hidden="true" /></li>)}
        </ul>
        <p className={`${P}-safe`}>{HERO.safe}</p>
      </div>
    </section>
  );
}

/* Three steps along one wire: each connects in turn, then the identity check lights. */
function Setup() {
  const [ref, live, calm] = useLive(0.3);
  const [s, setS] = useState(0);
  useEvery(1500, live, () => setS((v) => (v >= 5 ? 0 : v + 1)));
  const n = calm ? 4 : s;
  return (
    <section className={`a2-sec ${P}-setup`} ref={ref}>
      <div className="a2-wrap">
        <div className={`${P}-setup-h`}>
          <h2 className="a2-display s">{SETUP.name}</h2>
          <p className={`${P}-setup-s`}>{SETUP.sub}</p>
          <p className={`${P}-setup-t`}>{SETUP.title}</p>
        </div>
        <div className={`${P}-wire`} style={{ '--n': Math.min(n, 3) }}>
          <i className={`${P}-wire-l`} aria-hidden="true"><b /></i>
          <ol>
            {SETUP.steps.map(([t, d], i) => (
              <li key={t} className={n > i ? 'on' : ''}>
                <span className={`${P}-wire-n x-mono`}>{n > i ? '✓' : i + 1}</span>
                <b>{t}</b>
                <span className="x-mono">{d}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className={`${P}-setup-f`}>
          <span className={n >= 3 ? 'on' : ''}><i aria-hidden="true" />{SETUP.verified}</span>
          <span>{SETUP.model}</span>
          <span>{SETUP.retention}</span>
          <span>{SETUP.artifacts}</span>
        </div>
      </div>
    </section>
  );
}

/* What each room looks like, drawn from the same channel: the mention, the canvas and diff, the federated identity. */
function RoomArt({ k }) {
  if (k === 0) return <div className={`${P}-art t0`}><Msg m={ASK} p={P} /><Msg m={ANSWER} p={P} /></div>;
  if (k === 1) return (
    <div className={`${P}-art t1`}>
      <p className={`${P}-cv-t`}><i /><span><b>{CANVAS.title}</b><span>{CANVAS.meta}</span></span></p>
      <pre>{DIFF.lines.slice(3, 8).map(([, , s, t], i) => <span key={i} className={s === '+' ? 'add' : 'del'}>{s} {t}{'\n'}</span>)}</pre>
    </div>
  );
  return (
    <div className={`${P}-art t2`}>
      <p className={`${P}-art-v`}><i>✓</i>{SETUP.verified}</p>
      <p className={`${P}-art-role`}><b>{BUILT.items[4][0]}</b><span>{SETUP.steps[2][1]}</span></p>
      <p className={`${P}-art-tok`}>{[6, 10, 4, 13, 7, 9, 5, 11].map((w, i) => <i key={i} style={{ '--w': w, '--i': i }} />)}</p>
    </div>
  );
}

/* What it is: the three rooms; the one at the middle of the screen is the one the stage beside them shows. */
function What() {
  const list = useRef(null);
  const [i, setI] = useState(0);
  const { scrollYProgress: p } = useScroll({ target: list, offset: ['start 0.7', 'end 0.45'] });
  useMotionValueEvent(p, 'change', (v) => setI(Math.min(2, Math.max(0, Math.floor(v * 3)))));
  const fill = useTransform(p, (v) => { const x = Math.min(1, Math.max(0, v)) * 3; return x >= 3 ? 1 : x - Math.floor(x); });
  return (
    <section className={`a2-sec ${P}-what`}>
      <div className="a2-wrap">
        <Head kick={WHAT.kick} title={WHAT.title} lede={WHAT.lede} />
        <div className={`${P}-what-g`}>
          <ol className={`${P}-rows`} ref={list}>
            {WHAT.items.map(([n, t, d], k) => (
              <li key={n} className={i === k ? 'on' : ''} onPointerEnter={() => setI(k)}>
                <span className="x-mono">{n}</span><h3>{t}</h3><p>{d}</p>
                <div className={`${P}-row-art`} aria-hidden="true"><RoomArt k={k} /></div>
                {i === k ? <motion.b className={`${P}-timer`} style={{ scaleX: fill }} aria-hidden="true" /> : <b className={`${P}-timer`} aria-hidden="true" />}
              </li>
            ))}
          </ol>
          <div className={`${P}-stage`} aria-hidden="true">
            {WHAT.items.map(([n], k) => <div key={n} className={`${P}-stage-p` + (i === k ? ' on' : '')}><RoomArt k={k} /></div>)}
          </div>
        </div>
      </div>
    </section>
  );
}

/* Six features as an index you read one at a time; it follows your scroll until you choose one. */
function Built() {
  const list = useRef(null);
  const [i, setI] = useState(0);
  const [mine, setMine] = useState(false);
  const n = BUILT.items.length;
  const { scrollYProgress: p } = useScroll({ target: list, offset: ['start 0.75', 'end 0.4'] });
  useMotionValueEvent(p, 'change', (v) => { if (!mine) setI(Math.min(n - 1, Math.max(0, Math.floor(v * n)))); });
  const fill = useTransform(p, (v) => { const x = Math.min(1, Math.max(0, v)) * n; return x >= n ? 1 : x - Math.floor(x); });
  return (
    <section className={`a2-sec ${P}-built`}>
      <div className="a2-wrap">
        <Head kick={BUILT.kick} title={BUILT.title} />
        <div className={`${P}-idx`}>
          <div role="tablist" aria-label={BUILT.kick} aria-orientation="vertical" className={`${P}-idx-l`} ref={list}>
            {BUILT.items.map(([t], k) => (
              <button key={t} type="button" role="tab" aria-selected={i === k} aria-controls={`${P}-b-${k}`} onClick={() => { setI(k); setMine(true); }}>
                <span className="x-mono">{String(k + 1).padStart(2, '0')}</span>{t}
                {i === k && !mine && <motion.i className={`${P}-idx-t`} style={{ scaleX: fill }} aria-hidden="true" />}
              </button>
            ))}
          </div>
          <div className={`${P}-idx-r`}>
            <div className={`${P}-idx-stack`}>
            {BUILT.items.map(([t, d], k) => (
              <div key={t} id={`${P}-b-${k}`} role="tabpanel" aria-hidden={i !== k} inert={i !== k} className={`${P}-idx-p` + (i === k ? ' on' : '')}>
                <span className={`${P}-idx-n`} aria-hidden="true">{String(k + 1).padStart(2, '0')}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
            </div>
            <More to={BUILT.console[1]}>{BUILT.console[0]}</More>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Beyond: where does your message live? Hanzo's own answers, quoted with the question they answer. */
const DM = FAQ[4][1].slice(FAQ[4][1].indexOf('Direct messages'));
const SEE = [
  ['In a channel @Hanzo was added to, and someone tags @Hanzo', 'Reads and responds', [[FAQ[0][1], FAQ[0][0]], [FAQ[1][1], FAQ[1][0]]]],
  ['In a channel @Hanzo was added to, and nobody tags it', 'Quiet', [[BUILT.items[0][1], BUILT.items[0][0]]]],
  ['In a channel @Hanzo was never added to', 'Not read', [[HERO.safe, null]]],
  ['Scheduled work your team set up', 'Posts as scheduled', [[BUILT.items[3][1], BUILT.items[3][0]], [FAQ[1][1], FAQ[1][0]]]],
  ['A direct message to Hanzo', 'Counts on your own plan', [[DM, FAQ[4][0]]]],
];

function See() {
  const [ref, live] = useLive(0.05);
  const [i, setI] = useState(0);
  const [mine, setMine] = useState(false);
  useEvery(3400, live && !mine, () => setI((v) => (v + 1) % SEE.length));
  return (
    <section className={`a2-sec a2-dark ${P}-see`} data-room="dark" ref={ref}>
      <div className="a2-wrap">
        <Head dark kick="Will Hanzo see this?" title={FAQ[0][0]} size="a2-display s" />
        <div className={`${P}-see-g`}>
          <div role="radiogroup" aria-label="Where the message lives" className={`${P}-see-l`}>
            {SEE.map(([q], k) => (
              <button key={q} type="button" role="radio" aria-checked={i === k} onClick={() => { setI(k); setMine(true); }}>
                <i aria-hidden="true" />{q}
                {i === k && !mine && <b className={`${P}-see-t`} aria-hidden="true" />}
              </button>
            ))}
          </div>
          <div className={`${P}-see-a`} aria-live="polite">
            <div className={`${P}-see-stack`}>
            {SEE.map(([q, v, quotes], k) => (
              <div key={q} aria-hidden={i !== k} inert={i !== k} className={i === k ? 'on' : ''}>
                <p className={`${P}-verdict`}>{v}</p>
                {quotes.map(([t, src]) => (
                  <blockquote key={t}><p>{t}</p>{src && <cite>{src}</cite>}</blockquote>
                ))}
              </div>
            ))}
            </div>
            <p className={`${P}-see-train`}><b>{FAQ[5][0]}</b> {FAQ[5][1]}</p>
          </div>
        </div>
        <div className={`${P}-see-faq`}>
          <h3 className={`${P}-see-qh`}>Questions</h3>
          <A2Faq items={FAQ} dark />
        </div>
      </div>
    </section>
  );
}

/* Four products around one runtime; a signal crosses between them. Each quadrant shows its surface as a small frame. */
function Platform() {
  return (
    <section className={`a2-sec ${P}-plat`}>
      <div className="a2-wrap">
        <Head kick={PLATFORM.kick} title={PLATFORM.title} />
        <div className={`${P}-cross`}>
          <i className={`${P}-cross-h`} aria-hidden="true"><b /></i>
          <i className={`${P}-cross-v`} aria-hidden="true"><b /></i>
          <i className={`${P}-cross-c`} aria-hidden="true" />
          {PLATFORM.items.map(([t, d], k) => (
            <div key={t} className={`${P}-cross-i`}>
              <span className={`${P}-frame f${k}`} aria-hidden="true"><i /><i /><i /><i /><i /></span>
              <div><h3>{t}</h3><p>{d}</p></div>
            </div>
          ))}
        </div>
        <div className={`${P}-runtime`}>
          <p>{PLATFORM.runtime}</p>
          <ul>{PLATFORM.links.map(([t, to]) => <li key={t}><A to={to} className={`${P}-rt`}>{t}</A></li>)}</ul>
          <More to={PLATFORM.team[1]}>{PLATFORM.team[0]}</More>
        </div>
      </div>
    </section>
  );
}

/* The close: one solid ask; the two Explore links and the deploy door are quiet. */
function Close() {
  return (
    <section className={`a2-sec ${P}-close`}>
      <Sigil seed="hanzo-tag" data={[42, 418, 8.9, 28, 3, 32, 9]} className={`${P}-sigil`} />
      <div className={`a2-wrap a2-grid ${P}-close-in`}>
        <div className={`${P}-close-copy`}>
          <p className="a2-kick">{CLOSE.title}</p>
          <h2 className="a2-display s">{CLOSE.lede}</h2>
          <p className="a2-lede">{CLOSE.note}</p>
          <div className={`a2-acts ${P}-close-acts`}>
            <A to={CLOSE.acts[0][1]} className="x-btn solid" data-cta="tag.close">{CLOSE.acts[0][0]}</A>
            <More to={CLOSE.acts[1][1]}>{CLOSE.acts[1][0]}</More>
            <More to={CLOSE.acts[2][1]}>{CLOSE.acts[2][0]}</More>
          </div>
        </div>
        <div className={`${P}-get`}>
          <h2>Get Hanzo Tag</h2>
          <More to="https://platform.hanzo.ai/deploy">Deploy to Cloud</More>
        </div>
      </div>
    </section>
  );
}

export default function Tag() {
  return (
    <main className={`a2 ${P}`}>
      <Hero />
      <Channels />
      <Setup />
      <A2Paste name="Tag" text="Read https://hanzo.ai/skill.md and use Hanzo Tag in my project." />
      <What />
      <Built />
      <See />
      <Platform />
      <Close />
    </main>
  );
}
