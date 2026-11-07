'use client';
/* Persona: anyone weighing Hanzo's products (developers, teams, people who chat). Goal: start a first chat. CTA: "Open Chat" → /chat?skip=login. Metric: first_chat.
   Platform features. V2: 8/10 the self-playing keyboard is the hero object (display above, ten keys in three clusters); then three product rooms, each with Hanzo's own film (Enso for Chat, Zen for Dev, Iro for Design) beside its features as rows that open one at a time and step by themselves; each room opens its product; the close holds the three film cards and the one ask; greys only, colour from Hanzo's media.
   V2 (motion map, 7 Nov): the three product rooms now ride one sideways gallery (h-gallery) instead of stacking; Settle and the hero rise are gone; five page-local entrances (features/enter.*).
   Signature: h-gallery. The three product rooms (Hanzo Chat, Hanzo Dev, Hanzo Design & Cloud, each with its film) sit on one
   horizontal track; on wide screens the gallery holds the screen while vertical scroll moves the track sideways, then
   lets go (focus inside a room scrolls to it); on phones it is a swipe rail with scroll-snap (no pin); reduced motion stacks them.
   Entrances: pixel-resolve (hero words), grid-wave (the keyboard's keys, by distance from the pointer), tilt-3d-hover (Hanzo Chat room's film),
   underline-sweep (Hanzo Dev room's heading and rows), spring-snap (Hanzo Design & Cloud room).
   Motion budget: signature = the sideways gallery; supporting = the self-playing keyboard (approved demo, kept), rows that step and open (state), films (idle), magnetic primary.
   No live AI call (MASTER 3.3): the footer keeps Hanzo's own chat box. No springs: spring-snap lands on a hard ease-out, no overshoot.
   Colour: none in the UI (0 hues); colour arrives only through Hanzo's model films. One page pause stops the films and the rows; the display has its own.
   Keyboard: Hanzo's ten features are keycaps on one keyboard, set in three clusters (Hanzo Chat, Hanzo Dev, Hanzo
   Design & Cloud). It plays itself, a key pressing every couple of seconds and its feature lighting on the display
   above; press a key, tap it, or type 1 to 0 to play it yourself.
   Beyond: find the feature for a job. Type what you need (a PDF, a refactor, your voice) and the keys whose own
   descriptions say it light up; Enter plays the first.
   Every word is Hanzo's. */
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { EASE, Magnetic } from '../ui';
import { A } from '../kit';
import ModelFilm, { FilmPause, usePaused } from '../v2/ModelFilm';
import LineMask from '../v2/x-gauss/LineMask';
import NoJs from '../v2/x-gauss/NoJs';
import { usePause } from '../v2/x-gauss/Pause';
import '../v2/Scale.css';
import '../v2/x-gauss/Rhythm.css';
import usePhoneAsk from './usePhoneAsk';
import useFeaturesEnter from './features/enter';
import './Features.css';
import './features/enter.css';

const GROUPS = [
  ['Hanzo Chat', 'Default', [
    ['Enso Model Routing', 'Enso dynamically routes each prompt to the frontier model that answers it best, optimizing for quality, speed, and cost.'],
    ['Live Web Search & Code', 'Searches the real-time web for current facts, runs code in isolated sandboxes, and verifies computational answers automatically.'],
    ['Deep File & Document Analysis', 'Upload PDFs, documents, sheets, or codebases directly to ask complex questions, parse data tables, and extract insights.'],
    ['Bidirectional Voice', 'Dictate prompts, listen to realistic spoken answers, and converse naturally in real-time with zero-latency speech interfaces.'],
  ]],
  ['Hanzo Dev', 'CLI + Web', [
    ['Repo-Scale Coding Agent', 'Hanzo Dev scans entire codebases, identifies cross-file dependencies, writes refactors, and runs automated tests autonomously.'],
    ['Multi-Agent Acceleration', 'Accelerate Claude Code, Codex, Cursor, and Antigravity with unified API keys, team telemetry, and faster inference.'],
    ['Sandboxed Execution', 'Safe, ephemeral Linux execution containers that run build commands, migrations, and test suites with zero setup.'],
    ['Instant Headless API', 'Let autonomous background agents authenticate via crypto wallets, provision API keys, and top up balance without humans in the loop.'],
  ]],
  ['Hanzo Design & Cloud', null, [
    ['Multi-Modal Visual Canvas', 'Compose multi-step agent graphs, connect specialized models, and chain tools together in an interactive visual workspace.'],
    ['Context & Memory Systems', 'Persistent agent memory stores instructions, project rules, and codebase context across all your sessions and team members.'],
  ]],
];
const KEYS = GROUPS.flatMap(([g, tag, fs], gi) => fs.map(([t, d]) => ({ g, tag, gi, t, d })));
const CAP = (i) => String((i + 1) % 10);
const words = (s) => s.toLowerCase().match(/[a-z0-9]+/g) || [];
const pad = (n) => String(n).padStart(2, '0');
/* Hanzo's own model films: Enso routes Hanzo Chat, Zen codes in Hanzo Dev, Iro draws on the Design canvas. */
const FILMS = ['enso', 'zen', 'iro'];
const TO = ['/chat', '/dev', '/design'];
const ENTER = ['tilt', 'sweep', 'snap']; // each room's entrance (features/enter.css)

function Instrument() {
  const [at, setAt] = useState(0);
  const [down, setDown] = useState(-1);
  const [mine, setMine] = useState(false);
  const [paused, pauseBtn] = usePause({ position: 'relative', right: 'auto', top: 'auto' });
  const [q, setQ] = useState('');
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.05 }); // the keyboard is tall on a phone: a sliver in view is enough
  const calm = useReducedMotion();
  const hits = useMemo(() => {
    const w = words(q).filter((x) => x.length > 1);
    if (!w.length) return null;
    return KEYS.map((k, i) => [i, words(k.t + ' ' + k.d + ' ' + k.g)]).filter(([, kw]) => w.every((x) => kw.some((y) => y.startsWith(x)))).map(([i]) => i);
  }, [q]);
  const press = (i, hand) => { setAt(i); setDown(i); if (hand) setMine(true); setTimeout(() => setDown((d) => (d === i ? -1 : d)), 180); };
  const first = useRef(true); // the first self-press lands within a second of arrival, then one every 2.1 s
  useEffect(() => {
    if (mine || calm || !seen || paused) return;
    const t = setTimeout(() => { first.current = false; press((at + 1) % KEYS.length); }, first.current ? 900 : 2100);
    return () => clearTimeout(t);
  }, [at, mine, calm, seen, paused]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const key = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey || /INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName) || !seen) return;
      const n = '1234567890'.indexOf(e.key);
      if (n >= 0) press(n, true);
    };
    addEventListener('keydown', key);
    return () => removeEventListener('keydown', key);
  }, [seen]); // eslint-disable-line react-hooks/exhaustive-deps
  const k = KEYS[at];
  return (
    <div className="xft-inst" ref={box} data-enter="wave">
      <div className="xft-screen" aria-live={mine ? 'polite' : 'off'}>
        <div className="xft-screen-top">
          <span className="x-mono">{k.g}{k.tag ? ` · ${k.tag}` : ''}</span>
          <span className="x-mono xft-count">{pad(at + 1)} / 10</span>
          <span className="xft-pause">{pauseBtn}</span>
        </div>
        <div className="xft-screen-body">
          {KEYS.map((f, i) => (
            <motion.div key={f.t} className="xft-feat" initial={false} animate={i === at ? { opacity: 1, y: 0 } : { opacity: 0, y: i < at ? -16 : 16 }} transition={i === at ? { duration: 0.45, delay: 0.12, ease: EASE } : { duration: 0.15, ease: EASE }} aria-hidden={i !== at}>
              <p className="xft-feat-t">{f.t}</p>
              <p>{f.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
      <form className="xft-find" role="search" onSubmit={(e) => { e.preventDefault(); if (hits?.length) press(hits[0], true); }}>
        <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"><circle cx="9" cy="9" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.7" /><path d="m13.2 13.2 3.6 3.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
        <input value={q} onChange={(e) => { setMine(true); setQ(e.target.value); }} aria-label="Find a feature" placeholder="Find a feature" maxLength={80} />
        <span className="xft-find-n x-mono" aria-live="polite">{hits ? `${hits.length} of 10` : ''}</span>
      </form>
      <div className="xft-board">
        {GROUPS.map(([g, tag, fs], gi) => (
          <div key={g} className={'xft-cluster c' + gi}>
            <p className="xft-cl-h"><b>{g}</b>{tag && <span>{tag}</span>}</p>
            <div className="xft-keys">
              {fs.map(([t]) => {
                const i = KEYS.findIndex((x) => x.t === t);
                const lit = hits ? hits.includes(i) : false;
                return (
                  <button key={t} type="button" className={'xft-key' + (i === at ? ' on' : '') + (i === down ? ' down' : '') + (hits && !lit ? ' dim' : '') + (lit ? ' hit' : '')} onClick={() => press(i, true)} onPointerEnter={(e) => { if (e.pointerType === 'mouse') { setMine(true); setAt(i); } }} aria-pressed={i === at} aria-keyshortcuts={CAP(i)}>
                    <span className="xft-cap x-mono" aria-hidden="true">{CAP(i)}</span>
                    <span className="xft-key-t">{t}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="xft-hero" aria-labelledby="xft-h1" data-morph-target>
      <div className="w2-wrap">
        {/* pixel-resolve: an SVG mosaic whose block size enter.js steps down to sharp */}
        <svg className="xft-px-defs" aria-hidden="true" focusable="false"><filter id="xft-px" x="0" y="0" width="1" height="1"><feFlood x="9" y="9" width="1" height="1" /><feComposite width="18" height="18" /><feTile result="a" /><feComposite in="SourceGraphic" in2="a" operator="in" /><feMorphology operator="dilate" radius="9" /></filter></svg>
        <div className="xft-top" data-enter="pixel">
          <div>
            <LineMask as="h1" id="xft-h1" now className="w2-display xft-h1" lines={['Everything you need to', 'chat, build and ship.']} />
            <p className="xft-kick x-mono">Platform Features</p>
          </div>
          <div className="xft-top-r">
            <p className="w2-lede xft-lede">Explore Hanzo Chat, Dev, and Studio — intelligent model routing, repo-scale coding agents, and unified cloud APIs.</p>
            <div className="xft-acts">
              <Magnetic strength={0.25}><A to="/chat?skip=login" className="w2-cta" data-thumb="Open Chat" data-cta="features.hero">Open Chat <i aria-hidden="true">→</i></A></Magnetic>
              <A to="/dev" className="xft-tlink">Launch Dev</A>
            </div>
          </div>
        </div>
        <Instrument />
      </div>
    </section>
  );
}

/* A product room: the features as rows (one open at a time, stepping by itself while the room is in view; hover, tap
   and focus take over) beside the product's Hanzo film, which opens the product. */
function Product({ gi }) {
  const [g, tag, fs] = GROUPS[gi];
  const ref = useRef(null);
  const seen = useInView(ref, { amount: 0.45 });
  const calm = useReducedMotion();
  const paused = usePaused();
  const [row, setRow] = useState(0);
  const [mine, setMine] = useState(false);
  useEffect(() => {
    if (!seen || calm || mine || paused) return;
    const t = setTimeout(() => setRow((v) => (v + 1) % fs.length), 2600);
    return () => clearTimeout(t);
  }, [row, seen, calm, mine, paused, fs.length]);
  const pick = (i) => { setMine(true); setRow(i); };
  return (
    <section ref={ref} className={'xft-prod p' + gi} aria-labelledby={'xft-p' + gi} style={{ '--r': row }} data-enter={ENTER[gi]} {...(gi === 1 ? { 'data-room': 'dark' } : {})}>
      <div className="w2-wrap xft-prod-in">
        <div className="xft-prod-w">
          <h2 id={'xft-p' + gi} className="w2-headline xft-prod-h"><A to={TO[gi]}>{g}</A></h2>
          {tag && <p className="xft-prod-tag x-mono">{tag}</p>}
          <ol className="xft-rows">
            {fs.map(([t], i) => (
              <li key={t} className={row === i ? 'on' : ''} style={{ '--i': i }}>
                <button type="button" aria-pressed={row === i} aria-controls={'xft-d' + gi} onClick={() => pick(i)} onFocus={() => pick(i)}>
                  <span className="x-mono">{pad(i + 1)}</span><b>{t}</b>
                </button>
              </li>
            ))}
          </ol>
          {/* one panel holds every description in the same cell, so it is as tall as the longest and never moves the page */}
          <div className="xft-desc" id={'xft-d' + gi} aria-live={mine ? 'polite' : 'off'}>
            {fs.map(([t, d], i) => <p key={t} className={row === i ? 'on' : ''} aria-hidden={row !== i}>{d}</p>)}
          </div>
        </div>
        <div className="xft-film-w">
          <A to={TO[gi]} className="xft-film" tabIndex={-1} aria-hidden="true">
            <ModelFilm slug={FILMS[gi]} play={seen && !paused} />
            <span className="xft-film-cap"><span className="x-mono">{pad(row + 1)} / {pad(fs.length)}</span><b className="xft-film-t">{fs[row][0]}</b><i>→</i></span>
            <span className="xft-film-bar">{fs.map((f, i) => <i key={i} className={row === i ? 'on' : i < row ? 'done' : ''} />)}</span>
          </A>
          {gi === 0 && <span className="xft-film-p"><FilmPause className="dark" /></span>}
        </div>
      </div>
    </section>
  );
}

/* The close: the three products as film cards, and the one ask again. */
function Band() {
  return (
    <section className="w2-sec tight xft-band" aria-label="Open Chat">
      <div className="w2-wrap xft-band-in">
        <div className="xft-band-cards">{GROUPS.map(([g], gi) => <A key={g} to={TO[gi]} className={'xft-bc b' + gi}><ModelFilm slug={FILMS[gi]} play={false} /><b>{g}</b></A>)}</div>
        <div className="xft-acts">
          <Magnetic strength={0.25}><A to="/chat?skip=login" className="w2-cta" data-thumb="Open Chat" data-cta="features.close">Open Chat <i aria-hidden="true">→</i></A></Magnetic>
          <A to="/dev" className="xft-tlink">Launch Dev</A>
        </div>
      </div>
    </section>
  );
}

/* The sideways gallery (h-gallery): the three rooms on one track. Wide screens: the section is tall and its stage
   sticks while vertical scroll moves the track (enter.js writes --gx); phones: a swipe rail with scroll-snap. */
function Gallery() {
  return (
    <div className="xft-gal">
      <div className="xft-gal-stage">
        <div className="xft-gal-track">{GROUPS.map((x, gi) => <Product key={gi} gi={gi} />)}</div>
        <span className="xft-gal-bar" aria-hidden="true"><i /></span>
      </div>
    </div>
  );
}

export default function Features() {
  usePhoneAsk();
  const root = useRef(null);
  useFeaturesEnter(root);
  return (
    <main id="main" className="xft w2 gx" ref={root}>
      <NoJs />
      <noscript><style>{'.xft-feat:not(:first-child){display:none!important}'}</style></noscript>
      <Hero />
      <Gallery />
      <Band />
    </main>
  );
}
