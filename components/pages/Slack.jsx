'use client';
/* Hanzo Tag for Slack.
   V2: 8/10 the scene's thread now scrolls inside the window so the merged PR and Archive Channel land in view at step 6, every heading is Hanzo's own (the setup card is labelled by its own name; Hanzo's sentence heads the close only), the setup demo plays once from the ask and ends at rest in one 429px card, sections hand over at 72px, and the lit promise alone grows to 21px.
   Persona: an engineering lead whose team lives in Slack. Goal: set up Hanzo Tag. CTA: Set up Hanzo Tag (slack.hero).
   Metric: cta_click on slack.hero and slack.close (data-cta; the event layer is the conductor's).
   Signature: scroll plays the thread. A white first screen with the headline hands over to the one dark room, where
   the Slack window pins and settles to full size; each stretch of scroll plays the next step of #bug-button-darkmode
   (1. Code trace … 6. Session complete) while the Code, View and Canvas artifacts follow the step. The step rail on
   top jumps to any step. Phones pin a compact window under a 44px snap rail, and scroll plays it the same way.
   After it: the promises light the matching part of a window crop as each is read; the setup card connects in three
   steps beside its channel and the first exchange plays once, then rests; the three rooms as one tile that swaps; the six features open in a sheet; the
   platform as one runtime with the product you point at drawn in ink; questions; the close.
   Beyond: Contrast slider: drag between the before (1.9:1) and after (8.9:1) Buy Now button, using only Hanzo's own
   figures; both colourways are drawn as greys of equal luminance, so no hue reaches the page.
   Every word, figure and link is Hanzo's (components/pages/slackData.js). */
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion, useScroll, useTransform, useMotionValueEvent } from 'motion/react';
import { A, More } from '../kit';
import A2Lines from './skills/Lines';
import A2Paste from '../v2/A2Paste';
import A2Faq from '../v2/A2Faq';
import A2Sheet from '../v2/A2Sheet';
import useNarrow from '../v2/A2Narrow';
import { HERO, SETUP, ASK, ANSWER, PEOPLE, MEMBERS, STEPS, SESSION, CANVAS, WINDOW, TABS, DIFF, VIEW, WHAT, BUILT, PLATFORM, CODE, FAQ, CLOSE, Parts, Face, Msg } from './slackData';
import '../v2/A2.css';
import './Slack.css';

const P = 'xsq';
const EMPH = [0.16, 1, 0.3, 1];

/* The server knows nothing of the visitor's motion setting or the clock, so anything that depends on them waits for
   the first browser render (the server HTML and the first client render stay identical: no hydration mismatch). */
function useMounted() {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return m;
}
function useCalm() {
  const calm = useReducedMotion();
  return useMounted() && !!calm;
}

/* Beyond: the same button in both colourways, split by a handle you drag (it sweeps by itself until you do). */
function Contrast({ live }) {
  const box = useRef(null);
  const knob = useRef(null);
  const mounted = useMounted();
  const [mine, setMine] = useState(false);
  const set = (v) => { box.current?.style.setProperty('--cut', v + '%'); };
  useEffect(() => {
    if (!live || mine || !mounted) return;
    let raf = 0;
    const loop = (now) => { const v = 50 + Math.sin(now / 1000 * 0.8) * 34; set(v); if (knob.current) knob.current.value = String(Math.round(v)); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [live, mine, mounted]);
  const btn = (c) => <span className={`${P}-buy`} style={c}>{VIEW.button}</span>;
  return (
    <div className={`${P}-view`}>
      <p className={`${P}-cmp-ks`}><span>{VIEW.before}</span><span>{VIEW.after}</span></p>
      <div className={`${P}-cmp`} ref={box}>
        <div className={`${P}-cmp-half old`}>{btn(VIEW.old)}</div>
        <div className={`${P}-cmp-half fix`} aria-hidden="true">{btn(VIEW.fix)}</div>
        <i className={`${P}-cmp-line`} aria-hidden="true" />
        {/* the range input is a browser control whose inline style the browser writes itself: it renders after mount */}
        {mounted && (
          <input ref={knob} type="range" min="0" max="100" defaultValue="50" className={`${P}-cmp-knob`} aria-label="Before and after the fix" aria-valuetext="Drag left for the fix, right for the original"
            onInput={(e) => { setMine(true); set(e.currentTarget.value); }} />
        )}
      </div>
      <p className={`${P}-view-note`}>{VIEW.note}</p>
    </div>
  );
}

function Diff() {
  return (
    <div className={`${P}-diff`}>
      <p className={`${P}-diff-h`}>{DIFF.head}</p>
      <p className={`${P}-diff-s`}>{DIFF.stat} <b className="add">{DIFF.add}</b> <b className="del">{DIFF.del}</b></p>
      <p className={`${P}-diff-f`}><span>{DIFF.file}</span><em>{DIFF.viewed}</em></p>
      <table className={`${P}-diff-t`}>
        <tbody>
          {DIFF.lines.map(([a, b, s, t], i) => (
            <tr key={i} className={s === '+' ? 'add' : s === '-' ? 'del' : ''} style={{ '--i': i }}>
              <td>{a ?? ''}</td><td>{b ?? ''}</td><td><span className={`${P}-sign`}>{s.trim()}</span>{t}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Canvas() {
  const say = [['dev', SESSION[0].msgs[0].body], ['zoe', SESSION[2].msgs[0].body], ['qa', SESSION[4].msgs[0].body]];
  return (
    <div className={`${P}-cv`}>
      <p className={`${P}-cv-t`}>{CANVAS.title}</p>
      <p className={`${P}-cv-m`}>{CANVAS.meta}</p>
      <ol>{say.map(([w, b]) => <li key={w}><Face who={w} p={P} size={22} /><span><b>{PEOPLE[w].name}</b> <Parts body={b} p={P} /></span></li>)}</ol>
    </div>
  );
}

/* The window, drawn at a given step. */
function Window({ shown, live, tabHand, setTabHand, archived, setArchived }) {
  const list = useRef(null);
  const calm = useCalm();
  useEffect(() => { const el = list.current; if (el) el.scrollTo({ top: el.scrollHeight, behavior: calm ? 'auto' : 'smooth' }); }, [shown, calm]);
  const tab = tabHand ?? SESSION[shown].tab;
  const done = shown === 5;
  return (
    <div className={`${P}-win` + (archived ? ' archived' : '')}>
      <div className={`${P}-win-bar`}>
        <i /><i /><i />
        <span className={`${P}-win-t`}>{WINDOW.title}</span>
        <span className={`${P}-win-st` + (done ? ' ok' : '')}><i aria-hidden="true" /><span className={`${P}-swap`}><span aria-hidden={done}>{WINDOW.working}</span><span aria-hidden={!done}>{WINDOW.ready}</span></span></span>
      </div>
      <div className={`${P}-win-body`}>
        <nav className={`${P}-side`} aria-label="Workspace">
          <p className={`${P}-team`}><b>{WINDOW.team}</b><span>{WINDOW.host}</span></p>
          <ul className={`${P}-nav`}>{WINDOW.nav.map((n) => <li key={n}>{n}</li>)}</ul>
          {WINDOW.groups.map(([g, chans]) => (
            <div key={g} className={`${P}-grp`}>
              <p>{g}</p>
              <ul>
                {chans.map((c) => (
                  <li key={c} className={c === 'bug-button-darkmode' ? 'on' : ''}>
                    <span># {c}</span>
                    {c === 'bug-button-darkmode' && <em className={`${P}-swap` + (done ? ' ok' : '')}><span aria-hidden={done}>{WINDOW.badge}</span><span aria-hidden={!done}>{WINDOW.prReady}</span></em>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <div className={`${P}-thread`}>
          <div className={`${P}-th-h`}>
            <p><b># bug-button-darkmode</b><span>{WINDOW.repo}</span><span className={`${P}-branch`}>{WINDOW.branch}</span></p>
            <div className={`${P}-who`}>
              {MEMBERS.map((w) => (
                <button key={w} type="button" className={`${P}-who-i`} aria-label={`${PEOPLE[w].name}, ${PEOPLE[w].role}`}>
                  <Face who={w} p={P} size={26} />
                  <span className={`${P}-tip`}><b>{PEOPLE[w].name}</b>{PEOPLE[w].role}</span>
                </button>
              ))}
            </div>
            <span className={`${P}-arts`}>{WINDOW.artifacts}</span>
          </div>
          <div className={`${P}-msgs`} aria-live="polite" ref={list}>
            {SESSION.map((s, i) => (
              <div key={i} className={`${P}-step`} hidden={i > shown}>
                {s.msgs.map((m, k) => (
                  <div key={k}>
                    <Msg m={m.canvas ? { ...m, canvas: false } : m} p={P} />
                    {m.canvas && (
                      <button type="button" className={`${P}-canvas-card`} onClick={() => setTabHand(2)} aria-label={`${CANVAS.title}: open in Canvas`}>
                        <span className={`${P}-canvas-ico`} aria-hidden="true" />
                        <span><b>{CANVAS.title}</b><span>{CANVAS.meta}</span></span>
                        <span className={`${P}-canvas-open`}>{CANVAS.open}</span>
                      </button>
                    )}
                    {m.done && <button type="button" className={`${P}-archive`} aria-pressed={archived} onClick={() => setArchived((v) => !v)}>{WINDOW.archive}</button>}
                  </div>
                ))}
              </div>
            ))}
            {!done && <p className={`${P}-busy in`} aria-hidden="true"><i /><i /><i /></p>}
          </div>
        </div>
        <div className={`${P}-art`}>
          <p className={`${P}-art-k`}>Artifacts</p>
          <div className={`${P}-tabs`} role="tablist" aria-label="Artifacts">
            {TABS.map((t, i) => (
              <button key={t} type="button" role="tab" aria-selected={tab === i} onClick={() => setTabHand(i)}>
                {tab === i && <motion.span layoutId="xsq-tab" className={`${P}-tab-bg`} transition={{ duration: 0.3, ease: EMPH }} />}
                <span>{t}</span>
              </button>
            ))}
          </div>
          <div className={`${P}-pane`} hidden={tab !== 0}><Diff /></div>
          <div className={`${P}-pane`} hidden={tab !== 1}><Contrast live={live && tab === 1} /></div>
          <div className={`${P}-pane`} hidden={tab !== 2}><Canvas /></div>
        </div>
      </div>
    </div>
  );
}

/* The signature: the one dark room pins the window; scroll plays the steps (phones too, in a compact pinned window). */
function Scene() {
  const ref = useRef(null);
  const rail = useRef(null);
  const narrow = useNarrow();
  const calm = useCalm();
  const live = useInView(ref, { amount: 0.2 });
  const [at, setAt] = useState(0);
  const [tabHand, setTabHand] = useState(null);
  const [archived, setArchived] = useState(false);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const scale = useTransform(p, (v) => (narrow || calm ? 1 : 0.9 + Math.min(1, v / 0.08) * 0.1));
  useMotionValueEvent(p, 'change', (v) => {
    const k = Math.min(5, Math.max(0, Math.floor(((v - 0.06) / 0.94) * 6)));
    setAt((o) => { if (o !== k) { setTabHand(null); setArchived(false); } return k; });
  });
  // the phone rail is a snap strip: the step being played slides into view in it
  useEffect(() => {
    const el = rail.current;
    if (!narrow || !el) return;
    const b = el.children[at];
    if (b) el.scrollTo({ left: b.offsetLeft - 16, behavior: calm ? 'auto' : 'smooth' });
  }, [at, narrow, calm]);
  const go = (i) => {
    const el = ref.current;
    const y = el.getBoundingClientRect().top + scrollY + (el.offsetHeight - innerHeight) * (0.06 + ((i + 0.5) / 6) * 0.94);
    window.__lenis ? window.__lenis.scrollTo(y, { duration: 1.1 }) : scrollTo({ top: y, behavior: calm ? 'auto' : 'smooth' });
  };
  const key = (e) => {
    const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (k) { e.preventDefault(); go(Math.max(0, Math.min(5, at + k))); }
  };
  return (
    <section className={`a2-dark ${P}-scene`} data-room="dark" ref={ref} aria-label="A code channel, step by step">
      <div className={`${P}-stick`}>
        <div className="a2-wrap">
          <div className={`${P}-rail`} role="tablist" aria-label="Session steps" onKeyDown={key} ref={rail}>
            {STEPS.map((s, i) => (
              <button key={s} type="button" role="tab" aria-selected={at === i} tabIndex={at === i ? 0 : -1} className={i < at ? 'past' : ''} onClick={() => go(i)}>
                <span>{s}</span><i className={`${P}-rail-bar`}><b /></i>
              </button>
            ))}
          </div>
          <motion.div className={`${P}-obj`} style={{ scale }}>
            <Window shown={at} live={live} tabHand={tabHand} setTabHand={setTabHand} archived={archived} setArchived={setArchived} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Hero() {
  return (
    <section className={`${P}-hero`} aria-labelledby="xsq-h1">
      <div className="a2-wrap a2-grid">
        <div className={`${P}-hero-l`}>
          <p className="a2-kick"><i className={`${P}-dot`} aria-hidden="true" />{HERO.kick}</p>
          <A2Lines as="h1" id="xsq-h1" className={`a2-display ${P}-h1`} lines={HERO.title} now />
        </div>
        <div className={`${P}-hero-r`}>
          <p className="a2-lede">{HERO.lede}</p>
          <div className="a2-acts">
            <A to={HERO.acts[0][1]} className="x-btn solid" data-thumb={HERO.acts[0][0]} data-cta="slack.hero">{HERO.acts[0][0]}</A>
            <A to={HERO.acts[1][1]} className={`x-btn ${P}-quiet`}>{HERO.acts[1][0]}</A>
          </div>
          <p className={`${P}-docs`}><More to={HERO.acts[2][1]}>{HERO.acts[2][0]}</More></p>
        </div>
      </div>
    </section>
  );
}

/* One promise: it lights its part of the window crop when it reaches the middle of the screen (or is pointed at). */
function Point({ t, i, on, setOn }) {
  const ref = useRef(null);
  const mid = useInView(ref, { margin: '-42% 0px -42% 0px' });
  useEffect(() => { if (mid) setOn(i); }, [mid, i, setOn]);
  return (
    <li ref={ref} className={on ? 'on' : ''} onPointerEnter={() => setOn(i)}>
      <span className="x-mono">{String(i + 1).padStart(2, '0')}</span><p>{t}</p>
    </li>
  );
}

/* A crop of the same channel, light: each promise has its part, and the one being read is drawn in full. */
function Crop({ on }) {
  const r = (k) => `${P}-crop-r` + (on === k ? ' on' : '');
  return (
    <div className={`${P}-crop`} aria-hidden="true">
      <p className={`${P}-crop-bar`}><i /><i /><i /><span>{SETUP.channel}</span></p>
      <div className={r(0)}><Msg m={ASK} p={P} /></div>
      <div className={r(1)}>
        <p className={`${P}-crop-tabs`}>{TABS.map((t, k) => <span key={t} className={k === 0 ? 'on' : ''}>{t}</span>)}</p>
        <p className={`${P}-chips`}>{SETUP.chips.map((c) => <span key={c}>{c}</span>)}</p>
      </div>
      <div className={r(2)}>
        <p className={`${P}-crop-id`}><i>✓</i><span><b>{SETUP.steps[2][0]}</b><span>{SETUP.steps[2][1]}</span></span></p>
      </div>
      <div className={r(3)}>
        <p className={`${P}-crop-log`}><b>{BUILT.items[5][0]}</b><span>{SETUP.retention}</span></p>
      </div>
    </div>
  );
}

/* The four promises beside the code-channel headline and its window crop; the safety line under them. */
function Notes() {
  const [on, setOn] = useState(0);
  return (
    <section className={`a2-sec ${P}-notes`} aria-labelledby="xsq-notes-h">
      <div className="a2-wrap a2-grid">
        <div className={`${P}-notes-h`}>
          <p className="a2-kick"><b>{CODE.kick}</b></p>
          <A2Lines id="xsq-notes-h" className="a2-headline" lines={[CODE.title]} />
          <p className="a2-body">{CODE.lede}</p>
          <Crop on={on} />
        </div>
        <div className={`${P}-notes-l`}>
          <ol className={`${P}-points`}>{HERO.points.map((t, i) => <Point key={t} t={t} i={i} on={on === i} setOn={setOn} />)}</ol>
          <p className={`${P}-safe`}><i aria-hidden="true">✓</i><span>{HERO.safe}</span></p>
        </div>
      </div>
    </section>
  );
}

/* The setup card: three steps connect in turn beside the channel, then the first exchange plays there and stays.
   Hanzo's own sentence for this ("Connect @Hanzo to your Slack workspace in three steps.") heads the close, where
   the live page has it, so the card carries its own name as the section's label. The demo plays once: the ask is
   already in the channel (so the dark box is never empty), the steps tick, Hanzo answers, and it ends at rest. */
function Setup() {
  const ref = useRef(null);
  const live = useInView(ref, { amount: 0.6 });
  const calm = useCalm();
  const [k, setK] = useState(9); // the HTML shows the finished exchange; the browser plays it once from the ask
  const pos = useRef(-1); // -1: not begun; it pauses while out of view and resumes where it was
  useEffect(() => {
    if (!live || calm || pos.current >= 9) return;
    if (pos.current < 0) { pos.current = 0; setK(0); }
    let t = 0;
    const tick = () => {
      pos.current = Math.min(9, pos.current + 1);
      setK(pos.current);
      if (pos.current < 9) t = setTimeout(tick, 1000);
    };
    t = setTimeout(tick, 1000);
    return () => clearTimeout(t);
  }, [live, calm]);
  const s = calm ? 9 : k;
  return (
    <section className={`a2-sec ${P}-setup`} ref={ref} aria-labelledby="xsq-setup-h">
      <div className="a2-wrap">
        <div className={`${P}-card`}>
          <div className={`${P}-card-a`}>
            <p className={`${P}-card-t`}><span>{SETUP.title}</span><b className={s >= 3 ? 'on' : ''}><i aria-hidden="true" />{SETUP.verified}</b></p>
            <div className={`${P}-card-h`}><Face who="hanzo" p={P} size={34} /><span><b id="xsq-setup-h">{SETUP.name}</b><span>{SETUP.sub}</span></span></div>
            <ol className={`${P}-card-steps`}>
              {SETUP.steps.map(([t, d], i) => <li key={t} className={s > i ? 'on' : ''}><i aria-hidden="true">{s > i ? '✓' : i + 1}</i><span><b>{t}</b><span>{d}</span></span></li>)}
            </ol>
            <p className={`${P}-card-m`}><span>{SETUP.model}</span><span>{SETUP.retention}</span></p>
          </div>
          <div className={`${P}-mini`}>
            <p className={`${P}-mini-h`}><b>{SETUP.channel}</b><span>{SETUP.artifacts}</span></p>
            <div className={`${P}-mini-m in`}><Msg m={ASK} p={P} /></div>
            <p className={`${P}-busy` + (s === 4 ? ' in' : '')} aria-hidden="true"><i /><i /><i /></p>
            <div className={`${P}-mini-m` + (s >= 5 ? ' in' : '')}>
              <Msg m={ANSWER} p={P} />
              <p className={`${P}-chips`}>{SETUP.chips.map((c) => <span key={c}>{c}</span>)}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* The picture inside the rooms tile, one per room, drawn from the same channel. */
function RoomArt({ k }) {
  if (k === 0) return (
    <div className={`${P}-ra chans`}>
      {WINDOW.groups.map(([g, chans]) => (
        <div key={g}>
          <p className={`${P}-ra-g`}>{g}</p>
          {chans.map((c) => <p key={c} className={`${P}-ra-c` + (c === 'bug-button-darkmode' ? ' on' : '')}><span># {c}</span>{c === 'bug-button-darkmode' && <em>{WINDOW.prReady}</em>}</p>)}
        </div>
      ))}
      <p className={`${P}-ra-merged`}><i />{SESSION[5].msgs[0].done}</p>
    </div>
  );
  if (k === 1) return (
    <div className={`${P}-ra art`}>
      <p className={`${P}-ra-cv`}><i /><span><b>{CANVAS.title}</b><span>{CANVAS.meta}</span></span></p>
      <pre className={`${P}-ra-diff`}>{DIFF.lines.slice(3, 8).map(([, , s, t], i) => <span key={i} className={s === '+' ? 'add' : 'del'}>{s} {t}{'\n'}</span>)}</pre>
    </div>
  );
  return (
    <div className={`${P}-ra id`}>
      <p className={`${P}-ra-tok`}>{[5, 9, 4, 12, 7, 10, 6].map((w, i) => <i key={i} style={{ '--w': w }} />)}</p>
      <p className={`${P}-ra-v`}><i>✓</i>{SETUP.verified}</p>
      <p className={`${P}-ra-role`}><b>{SETUP.steps[2][0]}</b><span>{SETUP.steps[2][1]}</span></p>
    </div>
  );
}

/* What it is: the three rooms as one tile that swaps, and the six features one tap away. */
function What() {
  const [i, setI] = useState(0);
  return (
    <section className={`a2-sec ${P}-what`} aria-labelledby="xsq-what-h">
      <div className="a2-wrap">
        <div className={`a2-grid ${P}-what-head`}>
          <p className="a2-kick">{WHAT.kick}</p>
          <A2Lines id="xsq-what-h" className="a2-display s" lines={[WHAT.title]} />
          <p className="a2-lede">{WHAT.lede}</p>
        </div>
        <div className={`${P}-rooms`}>
          <div className={`${P}-rooms-l`} role="tablist" aria-label={WHAT.kick} aria-orientation="vertical">
            {WHAT.items.map(([n, t], k) => (
              <button key={n} type="button" role="tab" id={`${P}-rt-${k}`} aria-selected={i === k} aria-controls={`${P}-rp-${k}`} onClick={() => setI(k)} onPointerEnter={() => setI(k)}>
                <span className="x-mono">{n}</span><span className="a2-title">{t}</span><i aria-hidden="true" />
              </button>
            ))}
          </div>
          <div className={`${P}-rooms-stage`}>
            {WHAT.items.map(([n, , d], k) => (
              <div key={n} id={`${P}-rp-${k}`} role="tabpanel" aria-labelledby={`${P}-rt-${k}`} aria-hidden={i !== k} inert={i !== k} className={`${P}-rooms-p` + (i === k ? ' on' : '')}>
                <RoomArt k={k} />
                <p>{d}</p>
              </div>
            ))}
          </div>
        </div>
        <div className={`${P}-built`}>
          <div>
            <p className="a2-kick">{BUILT.kick}</p>
            <h2 className="a2-headline">{BUILT.title}</h2>
          </div>
          <ul className={`${P}-built-l`}>{BUILT.items.map(([t]) => <li key={t}>{t}</li>)}</ul>
          <div className={`${P}-built-acts`}>
            <A2Sheet label="How each one works" title={BUILT.title} btnClass={`${P}-sheet-btn`}>
              <ul className={`${P}-runs`}>{BUILT.items.map(([t, d]) => <li key={t}><b>{t}</b><span>{d}</span></li>)}</ul>
              <p className={`${P}-runs-more`}><More to={BUILT.console[1]}>{BUILT.console[0]}</More></p>
            </A2Sheet>
          </div>
        </div>
      </div>
    </section>
  );
}

/* One runtime, four places: a line the signal runs along, a drop to each product, the one you point at in ink. */
function Platform() {
  const [i, setI] = useState(0);
  return (
    <section className={`a2-sec ${P}-plat`} aria-labelledby="xsq-plat-h">
      <div className="a2-wrap">
        <div className={`${P}-plat-head`}>
          <p className="a2-kick">{PLATFORM.kick}</p>
          <h2 id="xsq-plat-h" className="a2-headline">{PLATFORM.title}</h2>
        </div>
        <div className={`${P}-plat-map`} aria-hidden="true">
          <i className={`${P}-plat-rail`}><b /></i>
          {PLATFORM.items.map(([t], k) => <i key={t} className={`${P}-plat-drop` + (i === k ? ' on' : '')} style={{ '--k': k }} />)}
        </div>
        <ol className={`${P}-plat-l`}>
          {PLATFORM.items.map(([t, d], k) => (
            <li key={t} className={i === k ? 'on' : ''} tabIndex={0} aria-current={i === k ? 'true' : undefined} onPointerEnter={() => setI(k)} onFocus={() => setI(k)} onClick={() => setI(k)}>
              <span className={`${P}-mark m${k}`} aria-hidden="true"><i /><i /><i /><i /></span>
              <h3>{t}</h3><p>{d}</p>
            </li>
          ))}
        </ol>
        <div className={`${P}-runtime`}>
          <p>{PLATFORM.runtime}</p>
          <ul>{PLATFORM.links.map(([t, to]) => <li key={t}><A to={to} className={`${P}-rt`}>{t}</A></li>)}</ul>
          <More to={PLATFORM.team[1]}>{PLATFORM.team[0]}</More>
        </div>
      </div>
    </section>
  );
}

function Questions() {
  return (
    <section className={`a2-sec ${P}-faq`} aria-labelledby="xsq-faq-h">
      <div className="a2-wrap a2-grid">
        {/* Hanzo's page gives its questions no label of its own: the heading is for screen readers only */}
        <h2 id="xsq-faq-h" className={`${P}-sr`}>Questions</h2>
        <div className={`${P}-faq-l`}><A2Faq items={FAQ} /></div>
      </div>
    </section>
  );
}

/* The close: one solid ask; the two Explore links and Deploy to Cloud are quiet text links. */
function Close() {
  return (
    <section className={`a2-sec ${P}-close`} aria-labelledby="xsq-close-h">
      <div className="a2-wrap a2-grid">
        <div className={`${P}-close-copy`}>
          <p className="a2-kick">{CLOSE.title}</p>
          <h2 id="xsq-close-h" className="a2-display s">{CLOSE.lede}</h2>
          <p className="a2-lede">{CLOSE.note}</p>
          <div className={`a2-acts ${P}-close-acts`}>
            <A to={CLOSE.acts[0][1]} className="x-btn solid" data-cta="slack.close">{CLOSE.acts[0][0]}</A>
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

export default function Slack() {
  return (
    <main className={`a2 ${P}`}>
      <Hero />
      <Scene />
      <Notes />
      <Setup />
      <A2Paste name="Slack" text="Read https://hanzo.ai/skill.md and use Hanzo Slack in my project." />
      <What />
      <Platform />
      <Questions />
      <Close />
    </main>
  );
}
