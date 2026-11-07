'use client';
/* Hanzo Tag for Slack.
   Signature: Session replay: the #bug-button-darkmode thread plays message by message on a six-step rail you can scrub
   (1. Code trace … 6. Session complete), while the Code, View and Canvas artifacts fill in beside it.
   Beyond: Contrast slider: drag between the before (1.9:1) and after (8.9:1) Buy Now button, using only Hanzo's own
   figures and colours (#e5e7eb/#ec4899 → #1a1a1a/#f472b6).
   Every word, figure and link is Hanzo's (components/pages/slackData.js). */
import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { EASE, Rise } from '../ui';
import { A, More, SecHead, Faq } from '../kit';
import { Get, Paste, useLive, useEvery, useFrame } from './cloud/Frame';
import { HERO, SETUP, ASK, ANSWER, PEOPLE, MEMBERS, STEPS, SESSION, CANVAS, WINDOW, TABS, DIFF, VIEW, WHAT, BUILT, PLATFORM, CODE, FAQ, CLOSE, Parts, Face, Msg } from './slackData';
import './Slack.css';

const P = 'xsq';
const up = (d) => ({ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, ease: EASE, delay: d } });

/* Beyond: the same button in both colourways, split by a handle you drag (it sweeps by itself until you do). */
function Contrast({ live }) {
  const box = useRef(null);
  const knob = useRef(null);
  const [mine, setMine] = useState(false);
  const set = (v) => { box.current?.style.setProperty('--cut', v + '%'); };
  useFrame(live && !mine, (t) => { const v = 50 + Math.sin(t * 0.8) * 34; set(v); if (knob.current) knob.current.value = String(Math.round(v)); });
  const btn = (c) => <span className={`${P}-buy`} style={c}>{VIEW.button}</span>;
  return (
    <div className={`${P}-view`}>
      <p className={`${P}-cmp-ks`}><span>{VIEW.before}</span><span>{VIEW.after}</span></p>
      <div className={`${P}-cmp`} ref={box} style={{ '--cut': '50%' }}>
        <div className={`${P}-cmp-half old`}>{btn(VIEW.old)}</div>
        <div className={`${P}-cmp-half fix`} aria-hidden="true">{btn(VIEW.fix)}</div>
        <i className={`${P}-cmp-line`} aria-hidden="true" />
        <input
          ref={knob}
          type="range" min="0" max="100" defaultValue="50"
          className={`${P}-cmp-knob`}
          aria-label="Before and after the fix"
          aria-valuetext="Drag left for the fix, right for the original"
          onInput={(e) => { setMine(true); set(e.currentTarget.value); }}
        />
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

/* The signature: the code channel, replayed step by step. The rail scrubs; the artifacts follow the step. */
function Session() {
  const [ref, live, calm] = useLive(0.25);
  const [at, setAt] = useState(0);
  const [mine, setMine] = useState(false);
  const [tabHand, setTabHand] = useState(null);
  const [archived, setArchived] = useState(false);
  const rail = useRef(null);
  const drag = useRef(false);
  const list = useRef(null);
  const shown = calm && !mine ? 5 : at;
  useEffect(() => {
    if (!live || mine) return;
    const t = setTimeout(() => setAt((v) => (v + 1) % 6), at === 5 ? 5600 : 3600); // hold on the merged PR, then replay
    return () => clearTimeout(t);
  }, [at, live, mine]);
  useEffect(() => { // the replay picks up again a while after your last scrub
    if (!mine || calm) return;
    const t = setTimeout(() => setMine(false), 9000);
    return () => clearTimeout(t);
  }, [mine, at, calm]);
  // the thread scrolls inside itself, so a new message never pushes the page (no layout shift)
  useEffect(() => { const el = list.current; if (el) el.scrollTo({ top: el.scrollHeight, behavior: calm ? 'auto' : 'smooth' }); }, [shown, calm]);
  const choose = (i) => { setAt(i); setMine(true); setTabHand(null); setArchived(false); };
  const fromX = (x) => { const r = rail.current.getBoundingClientRect(); choose(Math.max(0, Math.min(5, Math.floor(((x - r.left) / r.width) * 6)))); };
  const key = (e) => {
    const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (k) { e.preventDefault(); const n = Math.max(0, Math.min(5, shown + k)); choose(n); rail.current.querySelectorAll('[role=tab]')[n]?.focus(); }
  };
  const tab = tabHand ?? SESSION[shown].tab;
  const done = shown === 5;
  return (
    <div className={`${P}-sess` + (archived ? ' archived' : '')} ref={ref}>
      <div
        className={`${P}-rail`} role="tablist" aria-label="Session steps" ref={rail} data-swipe-own data-cursor="Scrub"
        onKeyDown={key}
        onPointerDown={(e) => { if (e.pointerType === 'mouse') { drag.current = true; fromX(e.clientX); } }}
        onPointerMove={(e) => { if (drag.current) fromX(e.clientX); }}
        onPointerUp={() => { drag.current = false; }} onPointerLeave={() => { drag.current = false; }}
      >
        {STEPS.map((s, i) => (
          <button key={s} type="button" role="tab" aria-selected={shown === i} tabIndex={shown === i ? 0 : -1} className={i < shown ? 'past' : ''} onClick={() => choose(i)}>
            <span>{s}</span>
            <i className={`${P}-rail-bar`}>{shown === i && <b key={at + (mine ? 'm' : '')} className={mine || calm ? 'full' : ''} style={{ animationDuration: (at === 5 ? 5.6 : 3.6) + 's' }} />}</i>
          </button>
        ))}
      </div>
      <div className={`${P}-win`}>
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
                      {m.canvas
                        ? <Msg m={{ ...m, canvas: false }} p={P} />
                        : <Msg m={m} p={P} />}
                      {m.canvas && (
                        <button type="button" className={`${P}-canvas-card`} onClick={() => setTabHand(2)} aria-label={`${CANVAS.title}: open in Canvas`}>
                          <span className={`${P}-canvas-ico`} aria-hidden="true" />
                          <span><b>{CANVAS.title}</b><span>{CANVAS.meta}</span></span>
                          <span className={`${P}-canvas-open`}>{CANVAS.open}</span>
                        </button>
                      )}
                      {m.done && (
                        <button type="button" className={`${P}-archive`} aria-pressed={archived} onClick={() => setArchived((v) => !v)}>{WINDOW.archive}</button>
                      )}
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
                  {tab === i && <motion.span layoutId="xsq-tab" className={`${P}-tab-bg`} transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
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
    </div>
  );
}

function Hero() {
  const line = (t, d) => (
    <span className="x-line" key={t}><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: d }}>{t}</motion.span></span>
  );
  return (
    <section className={`${P}-hero`} data-room="dark" aria-labelledby="xsq-h1">
      <div className="x-wrap">
        <div className={`${P}-top`}>
          <div>
            <motion.p className={`${P}-kick`} {...up(0)}><i aria-hidden="true" />{HERO.kick}</motion.p>
            <h1 id="xsq-h1" className={`${P}-h1`}>{HERO.title.map((t, i) => line(t, 0.05 + i * 0.1))}</h1>
          </div>
          <div className={`${P}-top-r`}>
            <motion.p className={`${P}-lede`} {...up(0.35)}>{HERO.lede}</motion.p>
            <motion.div className={`${P}-acts`} {...up(0.48)}>
              <A to={HERO.acts[0][1]} className="x-btn solid" data-thumb>{HERO.acts[0][0]}</A>
              <A to={HERO.acts[1][1]} className="x-btn">{HERO.acts[1][0]}</A>
              <More to={HERO.acts[2][1]}>{HERO.acts[2][0]}</More>
            </motion.div>
          </div>
        </div>
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: EASE, delay: 0.3 }}>
          <Session />
        </motion.div>
      </div>
    </section>
  );
}

/* The four promises, read beside the channel's own head. The line you are reading is lit. */
function Notes() {
  const [ref, live] = useLive(0.1);
  const [at, setAt] = useState(0);
  useEvery(2600, live, () => setAt((v) => (v + 1) % HERO.points.length));
  return (
    <section className={`x-sec ${P}-notes`} ref={ref}>
      <div className={`x-wrap ${P}-split`}>
        <SecHead kicker={CODE.kick} title={CODE.title} lede={CODE.lede} />
        <div>
          <ol className={`${P}-points`}>
            {HERO.points.map((t, i) => (
              <li key={t} className={at === i ? 'on' : ''}><span className="x-mono">{String(i + 1).padStart(2, '0')}</span><p>{t}</p><b className={`${P}-timer`} aria-hidden="true" /></li>
            ))}
          </ol>
          <p className={`${P}-safe`}><i aria-hidden="true">✓</i><span>{HERO.safe}</span></p>
        </div>
      </div>
    </section>
  );
}

/* The setup card: three steps connect in turn, then the first exchange plays in the channel. */
function Setup() {
  const [ref, live, calm] = useLive(0.2);
  const [k, setK] = useState(0); // 0-2 steps connecting, 3 asked, 4 Hanzo busy, 5 answered
  useEvery(1300, live, () => setK((v) => (v >= 9 ? 0 : v + 1)));
  const s = calm ? 9 : k;
  return (
    <section className={`x-sec ${P}-setup`} ref={ref}>
      <div className={`x-wrap ${P}-setup-grid`}>
        <Rise className={`${P}-card`}>
          <p className={`${P}-card-t`}><span>{SETUP.title}</span><b className={s >= 3 ? 'on' : ''}><i aria-hidden="true" />{SETUP.verified}</b></p>
          <div className={`${P}-card-h`}><Face who="hanzo" p={P} size={34} /><span><b>{SETUP.name}</b><span>{SETUP.sub}</span></span></div>
          <ol className={`${P}-card-steps`}>
            {SETUP.steps.map(([t, d], i) => (
              <li key={t} className={s > i ? 'on' : ''}><i aria-hidden="true">{s > i ? '✓' : i + 1}</i><span><b>{t}</b><span>{d}</span></span></li>
            ))}
          </ol>
          <p className={`${P}-card-m`}><span>{SETUP.model}</span><span>{SETUP.retention}</span></p>
          <div className={`${P}-mini`}>
            <p className={`${P}-mini-h`}><b>{SETUP.channel}</b><span>{SETUP.artifacts}</span></p>
            <div className={`${P}-mini-m` + (s >= 3 ? ' in' : '')}><Msg m={ASK} p={P} /></div>
            <p className={`${P}-busy` + (s === 4 ? ' in' : '')} aria-hidden="true"><i /><i /><i /></p>
            <div className={`${P}-mini-m` + (s >= 5 ? ' in' : '')}>
              <Msg m={ANSWER} p={P} />
              <p className={`${P}-chips`}>{SETUP.chips.map((c) => <span key={c}>{c}</span>)}</p>
            </div>
          </div>
        </Rise>
        <Paste name="Slack" prompt="Read https://hanzo.ai/skill.md and use Hanzo Slack in my project." className={`${P}-paste`} />
      </div>
    </section>
  );
}

function What() {
  const [ref, live] = useLive(0.3);
  const [at, setAt] = useState(0);
  useEvery(3000, live, () => setAt((v) => (v + 1) % 3));
  return (
    <section className={`x-sec ${P}-what`} ref={ref}>
      <div className="x-wrap">
        <SecHead kicker={WHAT.kick} title={WHAT.title} lede={WHAT.lede} />
        <ol className={`${P}-what-l`}>
          {WHAT.items.map(([n, t, d], i) => (
            <li key={n} className={at === i ? 'on' : ''} onPointerEnter={() => setAt(i)}>
              <span className={`${P}-what-n x-mono`}>{n}</span>
              <h3>{t}</h3>
              <p>{d}</p>
              <i className={`${P}-what-bar`} aria-hidden="true" />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* Six features, run like a scheduled routine: each row takes its turn, a timestamp-free tick beside it. */
function Built() {
  const [ref, live] = useLive(0.05);
  const [at, setAt] = useState(0);
  useEvery(2200, live, () => setAt((v) => (v + 1) % BUILT.items.length));
  return (
    <section className={`x-sec ${P}-built`} ref={ref}>
      <div className={`x-wrap ${P}-split`}>
        <div className={`${P}-sticky`}>
          <SecHead kicker={BUILT.kick} title={BUILT.title} />
          <More to={BUILT.console[1]}>{BUILT.console[0]}</More>
        </div>
        <ul className={`${P}-runs`}>
          {BUILT.items.map(([t, d], i) => (
            <li key={t} className={at === i ? 'on' : i < at ? 'ran' : ''}>
              <i className={`${P}-run-dot`} aria-hidden="true" />
              <span><b>{t}</b><span>{d}</span></span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* One runtime, four places: a pulse runs the line through each of them. */
function Platform() {
  return (
    <section className={`x-sec ${P}-plat`}>
      <div className="x-wrap">
        <SecHead kicker={PLATFORM.kick} title={PLATFORM.title} />
        <div className={`${P}-line`}>
          <i className={`${P}-line-w`} aria-hidden="true"><b /></i>
          <ol>
            {PLATFORM.items.map(([t, d], i) => (
              <li key={t} style={{ '--i': i }}><i className={`${P}-stop`} aria-hidden="true" /><h3>{t}</h3><p>{d}</p></li>
            ))}
          </ol>
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

function Questions() {
  return (
    <section className={`x-sec ${P}-faq`}>
      <i className={`${P}-wire`} aria-hidden="true"><b /></i>
      <div className={`x-wrap ${P}-split`}>
        <div className={`${P}-sticky`}>
          <SecHead title="Questions" />
        </div>
        <Faq items={FAQ} />
      </div>
    </section>
  );
}

function Close() {
  return (
    <section className={`x-sec ${P}-close`}>
      <i className={`${P}-wire`} aria-hidden="true"><b /></i>
      <div className="x-wrap">
        <Rise>
          <p className="x-kick">{CLOSE.title}</p>
          <h2 className={`${P}-close-h`}>{CLOSE.lede}</h2>
          <p className={`${P}-close-n`}>{CLOSE.note}</p>
        </Rise>
        <div className={`${P}-acts`}>
          <A to={CLOSE.acts[0][1]} className="x-btn solid">{CLOSE.acts[0][0]}</A>
          <A to={CLOSE.acts[1][1]} className="x-btn">{CLOSE.acts[1][0]}</A>
          <A to={CLOSE.acts[2][1]} className="x-btn">{CLOSE.acts[2][0]}</A>
        </div>
      </div>
    </section>
  );
}

export default function Slack() {
  return (
    <main className={P}>
      <Hero />
      <Notes />
      <Setup />
      <What />
      <Built />
      <Platform />
      <Questions />
      <Close />
      <Get name="Hanzo Tag" license={null} repo={null} />
    </main>
  );
}
