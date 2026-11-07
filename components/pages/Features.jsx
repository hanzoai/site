'use client';
/* Persona: anyone weighing Hanzo's products (developers, teams, people who chat). Goal: start a first chat. CTA: "Open Chat" → /chat?skip=login. Metric: first_chat.
   Platform features. V2: 7/10 the self-playing keyboard is the hero object (display above, ten keys in three clusters), three pinned product chapters that light one feature at a time with the visual answering it, a closing band with the one ask; greys only
   Motion budget: signature = the self-playing keyboard; supporting = Settle, Chapters (PinChapters), magnetic primary.
   No springs, no live AI call (MASTER 3.3): the page's chat room is gone; the footer keeps Hanzo's own chat box.
   Colour: none (0 UI hues); the pressed key is ink. Pause buttons sit in the display bar and under the chapter visual.
   Platform features. Its idea is the instrument you play to chat, build and ship.
   Signature: Hanzo's ten features are keycaps on one keyboard, set in three clusters (Hanzo Chat, Hanzo Dev, Hanzo
   Design & Cloud). It plays itself, a key pressing every couple of seconds and its feature lighting on the display
   above; press a key, tap it, or type 1 to 0 to play it yourself.
   Beyond: find the feature for a job. Type what you need (a PDF, a refactor, your voice) and the keys whose own
   descriptions say it light up; Enter plays the first.
   Every word is Hanzo's. */
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { EASE, Magnetic } from '../ui';
import { A, Img } from '../kit';
import { useLive, useEvery } from './cloud/Frame';
import LineMask from '../v2/x-gauss/LineMask';
import Settle from '../v2/Settle';
import PinChapters from '../v2/x-gauss/PinChapters';
import NoJs from '../v2/x-gauss/NoJs';
import { usePause } from '../v2/x-gauss/Pause';
import '../v2/Scale.css';
import '../v2/x-gauss/Rhythm.css';
import './Features.css';

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
  useEffect(() => {
    if (mine || calm || !seen || paused) return;
    const t = setTimeout(() => press((at + 1) % KEYS.length), 2100);
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
    <div className="xft-inst" ref={box}>
      <div className="xft-screen" aria-live={mine ? 'polite' : 'off'}>
        <div className="xft-screen-top">
          <span className="x-mono">{k.g}{k.tag ? ` · ${k.tag}` : ''}</span>
          <span className="x-mono xft-count">{String(at + 1).padStart(2, '0')} / 10</span>
          <span className="xft-pause">{pauseBtn}</span>
        </div>
        <div className="xft-screen-body">
          {KEYS.map((f, i) => (
            <motion.div key={f.t} className="xft-feat" initial={false} animate={i === at ? { opacity: 1, y: 0 } : { opacity: 0, y: i < at ? -16 : 16 }} transition={{ duration: 0.45, ease: EASE }} aria-hidden={i !== at}>
              <p className="xft-feat-t">{f.t}</p>
              <p>{f.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
      <form className="xft-find" role="search" onSubmit={(e) => { e.preventDefault(); if (hits?.length) press(hits[0], true); }}>
        <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"><circle cx="9" cy="9" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.7" /><path d="m13.2 13.2 3.6 3.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
        <input value={q} onChange={(e) => { setMine(true); setQ(e.target.value); }} aria-label="Find a feature" maxLength={80} />
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
        <div className="xft-top">
          <div>
            <LineMask as="h1" id="xft-h1" now className="w2-display xft-h1" lines={['Everything you need to', 'chat, build and ship.']} />
            <p className="xft-kick x-mono">Platform Features</p>
          </div>
          <motion.div className="xft-top-r" initial={{ y: 14 }} animate={{ y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}>
            <p className="w2-lede xft-lede">Explore Hanzo Chat, Dev, and Studio — intelligent model routing, repo-scale coding agents, and unified cloud APIs.</p>
            <div className="xft-acts">
              <Magnetic strength={0.25}><A to="/chat?skip=login" className="w2-cta" data-thumb="Open Chat" data-cta="features.hero">Open Chat <i aria-hidden="true">→</i></A></Magnetic>
              <A to="/dev" className="xft-tlink">Launch Dev</A>
            </div>
          </motion.div>
        </div>
        <Settle from={1.02} lift={10}><Instrument /></Settle>
      </div>
    </section>
  );
}

/* Chapter visuals: each product as its own piece of UI, running by itself while it is the chapter on screen. */
function ChatUI({ k }) {
  const fs = GROUPS[0][2];
  return (
    <div className="xft-ui chat" aria-hidden="true">
      <div className="xft-ui-bar"><i /><i /><i /><span className="x-mono">Hanzo Chat</span></div>
      <div className="xft-ui-in">
        <p className="xft-ui-q">Ask Hanzo anything</p>
        <div className="xft-ui-enso"><Img src="/models/enso.webp" alt="" w={36} h={36} /><b>Enso</b></div>
        <ul className="xft-ui-chips">{fs.map(([t], i) => <li key={t} className={i === k ? 'on' : i < k ? 'done' : ''}>{t}</li>)}</ul>
      </div>
    </div>
  );
}
function DevUI({ k }) {
  const fs = GROUPS[1][2];
  return (
    <div className="xft-ui dev" aria-hidden="true">
      <div className="xft-ui-bar"><i /><i /><i /><span className="x-mono">Hanzo Dev · CLI + Web</span></div>
      <pre className="xft-ui-term x-mono">{fs.map(([t], i) => <span key={t} className={'l' + (i <= k ? ' on' : '')}><b>{i <= k ? '✓' : '·'}</b> {t}{'\n'}</span>)}<span className="xft-ui-caret" /></pre>
    </div>
  );
}
function CanvasUI({ k: row }) {
  const k = row === 0 ? 1 : 3; // canvas lights the graph; memory lights the store
  return (
    <div className="xft-ui canvas" aria-hidden="true">
      <div className="xft-ui-bar"><i /><i /><i /><span className="x-mono">Hanzo Design & Cloud</span></div>
      <div className="xft-ui-graph">
        <svg viewBox="0 0 400 220" preserveAspectRatio="none"><path d="M70 60 C 150 60, 150 110, 200 110 M70 160 C 150 160, 150 110, 200 110 M200 110 C 260 110, 270 60, 330 60 M200 110 C 260 110, 270 160, 330 160" /></svg>
        {['a', 'b', 'c', 'd', 'e'].map((c, i) => <span key={c} className={'xft-ui-node ' + c + (i <= k + 1 ? ' on' : '')} />)}
      </div>
      <div className="xft-ui-mem"><i className={k > 1 ? 'on' : ''} /><i className={k > 2 ? 'on' : ''} /><i /></div>
    </div>
  );
}

function Products() {
  const [ref, live] = useLive(0.05);
  const [paused, pauseBtn] = usePause({ right: 0, bottom: 0, top: 'auto' });
  const [ch, setCh] = useState(0);
  const [row, setRow] = useState(0); // one feature at a time: the list lights a row and the visual answers it
  useEvery(1800, live && !paused, () => setRow((v) => (v + 1) % GROUPS[ch][2].length));
  return (
    <div ref={ref}>
      <PinChapters id="xft-products" label="Hanzo Chat, Hanzo Dev, Hanzo Design & Cloud" className="xft-pin"
        chapters={GROUPS.map(([g, tag, fs], gi) => ({ k: tag || undefined, t: g, b: (
          <ul className="xft-ch-list">{fs.map(([t, d], i) => <li key={t} className={gi === ch && i === row ? 'on' : ''}><b>{t}</b><span>{d}</span></li>)}</ul>
        ) }))}
        visual={(at) => {
          if (at !== ch) setTimeout(() => { setCh(at); setRow(0); }, 0);
          return (
            <div className={'xft-vis' + (paused ? ' paused' : '')}>
              {pauseBtn}
              {[ChatUI, DevUI, CanvasUI].map((V, i) => (
                <motion.div key={i} className="xft-vis-i" initial={false} animate={{ opacity: at === i ? 1 : 0, scale: at === i ? 1 : 0.96 }} transition={{ duration: 0.5, ease: EASE }} aria-hidden={at !== i} inert={at !== i}>
                  <V k={at === i ? row : 0} />
                </motion.div>
              ))}
            </div>
          );
        }} />
    </div>
  );
}

/* The close: one band, the one ask again. */
function Band() {
  return (
    <section className="w2-sec tight xft-band" aria-label="Open Chat">
      <div className="w2-wrap xft-band-in">
        <p className="xft-band-g" aria-hidden="true">{GROUPS.map(([g]) => <span key={g}>{g}</span>)}</p>
        <div className="xft-acts">
          <Magnetic strength={0.25}><A to="/chat?skip=login" className="w2-cta" data-thumb="Open Chat" data-cta="features.close">Open Chat <i aria-hidden="true">→</i></A></Magnetic>
          <A to="/dev" className="xft-tlink">Launch Dev</A>
        </div>
      </div>
    </section>
  );
}

export default function Features() {
  return (
    <main id="main" className="xft w2 gx">
      <NoJs />
      <noscript><style>{'.xft-feat:not(:first-child){display:none!important}'}</style></noscript>
      <Hero />
      <Products />
      <Band />
    </main>
  );
}
