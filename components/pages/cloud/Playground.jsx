'use client';
/* Playground, v2 launch page (Cloud 3).
   V2: 8/10 Split Stage hero with the Playground itself running eight kinds of run, opening on Iro developing so the
   first screen has Hanzo's own colour; hover a kind to preview it, pause to hold it; the "a key, a model name, and a
   message" sentence as a pinned scene whose lit phrase marks its token in the real request (hover marks it too); one
   dark room; related cards that open; grey UI, colour only from the model media.
   Signature: the playground, running. Eight kinds of run (chat to vision) take turns in one window, each drawing its own
   kind of answer on Hanzo's own model media (Iro develops, Koma's film plays, Kai's subject is found), with the run's
   tokens and cost filling beside it; hover a kind to preview it, tap it to hold it.
   Beyond: the anatomy of a first request. Scroll and the sentence lights one part at a time (a key, a model name, a
   message) while the same part lights inside the real curl request, then the Python client, so the first call reads
   as three things you already have.
   Persona: Developer. Goal: open the Playground and run a first request.
   CTA: "Open the Playground" → https://platform.hanzo.ai/playground (data-cta playground.hero, playground.close; the
   site's sticky ask bar carries the same words from data-thumb). Metric: api_key_created.
   Motion: idle = the running window (and Koma's film inside it); pointer = hovering a kind previews its run, hovering a
   phrase marks its token, the magnetic ask; state = kind tabs, curl/python, pause; arrival = the cut-in title, the
   timed wipe into the dark room; scroll = the Stage settle and the scrubbed sentence.
   Every word and link is Hanzo's; the meter shows proportions, not measured figures. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent, useReducedMotion } from 'motion/react';
import { Copy } from '../../ui';
import { Paste, useLive, useSteps } from './Frame';
import SettleStage from '../../v2/SettleStage';
import ClipWipe from '../../v2/ClipWipe';
import LaunchClose, { Arr } from '../../v2/LaunchClose';
import LineMask from '../../v2/LineMask';
import LivePause, { usePause } from '../../v2/LivePause';
import RelatedCards from '../../v2/RelatedCards';
import { A, Img, Film } from '../../kit';
import './Playground.css';

const PLAY = 'https://platform.hanzo.ai/playground';
const EASE = [0.16, 1, 0.3, 1];
const MODES = ['Chat', 'Completions', 'Decisions', 'Embeddings', 'Image', 'Video', 'Audio', 'Vision'];
const FIRST = 4; // the window opens on Image, so the first screen carries Iro's own colour; the tabs keep Hanzo's order
// relative run shape for the meter bars only: [tokens in, tokens out, time]; never shown as numbers
const RUN = [[0.3, 0.6, 0.2], [0.4, 0.9, 0.3], [0.5, 0.1, 0.1], [0.35, 0, 0.05], [0.45, 0, 0.55], [0.5, 0, 0.95], [0.4, 0, 0.35], [0.6, 0.45, 0.25]];
const rnd = (i) => { const x = Math.sin(i * 91.7) * 43758.5453; return x - Math.floor(x); };

function Chat() {
  return (
    <div className="pg-chat">
      <motion.p className="pg-bub me" initial={{ opacity: 0, y: 12, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.45, ease: EASE }}>Hello</motion.p>
      <motion.div className="pg-bub ai" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: EASE, delay: 0.45 }}>
        {[94, 82, 88, 70, 46].map((w, i) => <motion.i key={i} style={{ width: w + '%' }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.5, ease: EASE, delay: 0.7 + i * 0.3 }} />)}
      </motion.div>
    </div>
  );
}
function Completions() {
  const rows = [[100, 1], [100, 1], [64, 1], [100, 0], [100, 0], [92, 0], [100, 0], [48, 0]];
  return <div className="pg-comp">{rows.map(([w, given], i) => <motion.i key={i} className={given ? 'given' : ''} style={{ width: w + '%' }} initial={{ scaleX: given ? 1 : 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.45, ease: 'linear', delay: given ? 0 : 0.3 + (i - 3) * 0.42 }} />)}</div>;
}
function Decisions() {
  return (
    <svg className="pg-tree" viewBox="0 0 320 200" aria-hidden="true">
      <motion.path d="M160 40 C160 90 80 90 80 150" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.3 }} />
      <motion.path d="M160 40 C160 90 240 90 240 150" className="on" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.3 }} />
      <circle cx="160" cy="34" r="12" className="root" />
      <motion.circle cx="80" cy="158" r="12" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.9, type: 'spring', stiffness: 300, damping: 18 }} />
      <motion.circle cx="240" cy="158" r="12" className="pick" initial={{ scale: 0 }} animate={{ scale: [0, 1.25, 1] }} transition={{ delay: 1.1, duration: 0.6 }} />
    </svg>
  );
}
function Embeddings() {
  const hubs = [[70, 60], [220, 70], [150, 150]];
  return (
    <svg className="pg-emb" viewBox="0 0 300 200" aria-hidden="true">
      {Array.from({ length: 42 }).map((_, i) => {
        const h = hubs[i % 3];
        return <motion.circle key={i} r="4" className={'c' + (i % 3)} initial={{ cx: rnd(i + 9) * 300, cy: rnd(i + 99) * 200, opacity: 0 }} animate={{ cx: h[0] + (rnd(i) - 0.5) * 60, cy: h[1] + (rnd(i + 50) - 0.5) * 44, opacity: 1 }} transition={{ duration: 1.4, ease: EASE, delay: 0.2 + (i % 14) * 0.03 }} />;
      })}
    </svg>
  );
}
/* Iro develops: the tiles clear with CSS, so the picture comes through at first paint, with JS off too */
function Image() {
  return (
    <div className="pg-img">
      <Img src="/models/iro.webp" w={1200} h={1500} priority />
      <div className="pg-tiles">{Array.from({ length: 60 }).map((_, i) => <i key={i} style={{ '--d': (0.2 + rnd(i) * 2.2).toFixed(2) + 's' }} />)}</div>
    </div>
  );
}
function Video({ paused }) {
  const box = useRef(null);
  useEffect(() => { const v = box.current?.querySelector('video'); if (!v) return; if (paused) v.pause(); else v.play?.().catch(() => {}); }, [paused]);
  return <div className="pg-vid" ref={box}><Film src="/models/koma.webm" poster="/models/koma.webp" w={1200} h={1500} /><i className="pg-head" /></div>;
}
function Audio() {
  return <div className="pg-wave">{Array.from({ length: 56 }).map((_, i) => <i key={i} style={{ animationDelay: `${-rnd(i) * 1.2}s`, height: `${24 + rnd(i + 3) * 76}%` }} />)}</div>;
}
function Vision() {
  return (
    <div className="pg-vis">
      <Img src="/models/kai.webp" w={1200} h={1500} />
      <motion.i className="pg-box" initial={{ left: '8%', top: '10%', width: '80%', height: '78%', opacity: 0 }} animate={{ left: '30%', top: '18%', width: '38%', height: '56%', opacity: 1 }} transition={{ duration: 1.2, ease: EASE, delay: 0.3 }}>
        <motion.span initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }}>found</motion.span>
      </motion.i>
    </div>
  );
}
const CANVAS = [Chat, Completions, Decisions, Embeddings, Image, Video, Audio, Vision];

function Window() {
  const [ref, live, calm] = useLive(0.3);
  const [paused, pause] = usePause();
  const [hov, setHov] = useState(null); // a kind under a fine pointer previews its run
  const run = live && !paused && hov === null;
  const [raw, chooseRaw, mine] = useSteps(MODES.length, 3800, run);
  const at = (raw + FIRST) % MODES.length;
  const cur = hov ?? at;
  const choose = (i) => { setHov(null); chooseRaw((i - FIRST + MODES.length) % MODES.length); };
  const Canvas = CANVAS[cur];
  const [tin, tout, secs] = RUN[cur];
  const bars = [['Tokens in', tin], ['Tokens out', tout], ['Time', secs], ['Cost', Math.min(1, (tin + tout) * 0.6 + secs * 0.5)]];
  return (
    <div className={'pg-win' + (paused ? ' paused' : '')} ref={ref}>
      <div className="pg-bar">
        <LivePause paused={paused} onToggle={pause} className="pg-pause" />
        <i /><i /><i /><span>Playground</span><b>zen</b>
      </div>
      <div className="pg-modes" role="tablist" aria-label="Kind of run" onPointerLeave={() => setHov(null)}>
        {MODES.map((m, i) => (
          <button key={m} type="button" role="tab" aria-selected={cur === i} onClick={() => choose(i)} onPointerEnter={(e) => e.pointerType === 'mouse' && setHov(i)}>
            {cur === i && <motion.i layoutId="pg-mode" className="pg-mode-bg" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
            <span>{m}</span>
            {cur === i && !mine && run && <em key={raw} className="pg-mode-t" />}
          </button>
        ))}
      </div>
      <div className="pg-body">
        <div className="pg-canvas" aria-hidden="true">
          <div className="pg-stagebox">
            {calm ? <div className="pg-cv"><Canvas paused /></div> : (
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={cur} className="pg-cv" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }} transition={{ duration: 0.35, ease: EASE }}><Canvas paused={paused} /></motion.div>
              </AnimatePresence>
            )}
          </div>
          <div className="pg-input"><span>Hello</span><b><svg viewBox="0 0 16 16" width="15" height="15"><path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></b></div>
        </div>
        <aside className="pg-run" aria-label="This run">
          <p className="pg-run-k">Run · {MODES[cur]}</p>
          <div className="pg-model"><span>Model</span><b>zen</b></div>
          <ul className="pg-meter">
            {bars.map(([l, v], i) => <li key={l} className={i === 3 ? 'cost' : ''}><span>{l}</span><i><b key={cur} style={{ '--v': v, '--d': 0.3 + i * 0.12 + 's' }} /></i></li>)}
          </ul>
        </aside>
      </div>
    </div>
  );
}

/* ---------- the first request, scrubbed ---------- */
const CURL = `curl https://api.hanzo.ai/v1/chat/completions \\
  -H "Authorization: Bearer $HANZO_API_KEY" \\
  -d '{"model":"zen","messages":[{"role":"user","content":"Hello"}]}'`;
const PY = `pip install hanzoai

import os
from hanzoai.cloud import ApiClient, Configuration, KeysApi

api = ApiClient(Configuration(
    host="https://api.hanzo.ai",
    access_token=os.environ["HANZO_API_KEY"],
))
print(KeysApi(api).get_keys().keys)`;
const PARTS = [['A key', 'HANZO_API_KEY'], ['a model name', '"zen"'], ['a message', '"Hello"']];

function marked(code, mark) {
  return code.split('\n').map((l, j) => {
    const bits = mark && l.includes(mark) ? l.split(mark).flatMap((x, i) => [i > 0 && <mark key={'m' + i}>{mark}</mark>, <span key={i}>{x}</span>]) : l;
    const c = /^\s*#/.test(l) ? 'c' : '';
    return <span key={j} className={'pg-ln ' + c}>{bits}{'\n'}</span>;
  });
}

function FirstRequest() {
  const ref = useRef(null);
  const calm = useReducedMotion();
  const [live, setLive] = useState(false); // JS off: an ordinary section with both panes in reading order
  useEffect(() => setLive(true), []);
  const [at, setAt] = useState(0); // 0..2 the three parts, 3 the whole request in Python
  const [hv, setHv] = useState(null); // a phrase under a fine pointer marks its token
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (p) => { const i = Math.min(3, Math.floor(p * 4 * 0.999)); setAt((v) => (v === i ? v : i)); });
  const jump = (i) => {
    setHv(null);
    const el = ref.current; if (!el) return;
    const y = el.getBoundingClientRect().top + scrollY + ((i + 0.5) / 4) * (el.offsetHeight - innerHeight);
    window.__lenis ? window.__lenis.scrollTo(y, { duration: calm ? 0 : 1.2, easing: (t) => 1 - Math.pow(1 - t, 4) }) : scrollTo({ top: y, behavior: calm ? 'auto' : 'smooth' });
  };
  const show = hv ?? at;
  const tab = show === 3 ? 1 : 0;
  const peek = (i) => (e) => e.pointerType === 'mouse' && setHv(i);
  return (
    <section ref={ref} className="pg-first" data-live={live || undefined}>
      <div className="pg-first-stick">
        <div className="lx-wrap pg-first-grid">
          <div className="pg-first-copy">
            <h2 className="lx-title pg-first-h">Then the same request from code</h2>
            <p className="pg-anat" data-at={show} onPointerLeave={() => setHv(null)}>
              {PARTS.map(([t], i) => (
                <span key={t} className="pg-g">
                  <button type="button" className={'pg-ph' + (show === i ? ' on' : '') + (show === 3 ? ' all' : '')} onClick={() => jump(i)} onPointerEnter={peek(i)} aria-pressed={at === i}>{t}</button>{i === 0 ? ',' : i === 1 ? ', and' : ''}
                </span>
              ))}{' '}
              <button type="button" className={'pg-ph' + (show === 3 ? ' on' : '')} onClick={() => jump(3)} onPointerEnter={peek(3)} aria-pressed={at === 3}>is the whole first request.</button>
            </p>
          </div>
          <div className="pg-req">
            <div className="pg-req-bar">
              <i /><i /><i />
              <div className="pg-req-tabs">
                <button type="button" className={tab === 0 ? 'on' : ''} aria-pressed={tab === 0} onClick={() => jump(0)}>curl</button>
                <button type="button" className={tab === 1 ? 'on' : ''} aria-pressed={tab === 1} onClick={() => jump(3)}>python</button>
              </div>
              <Copy text={tab ? PY : CURL} />
            </div>
            <div className="pg-req-panes">
              <div className="pg-req-pane" data-on={tab === 0 || undefined}><p className="pg-req-l">One request</p><pre><code>{marked(CURL, show < 3 ? PARTS[show][1] : null)}</code></pre></div>
              <div className="pg-req-pane" data-on={tab === 1 || undefined}><p className="pg-req-l">The Python client</p><pre><code>{marked(PY, 'HANZO_API_KEY')}</code></pre></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


/* ---------- every model in the catalog: Hanzo's own model films, together ---------- */
const MODELS = [['Zen', 'zen'], ['Enso', 'enso'], ['Kai', 'kai'], ['Iro', 'iro'], ['Koma', 'koma'], ['Koe', 'koe'], ['Mori', 'mori'], ['Oto', 'oto'], ['Uta', 'uta']];

function Wall() {
  const [ref, live, calm] = useLive(0.3);
  const [paused, pause] = usePause();
  const [at, setAt] = useState(0);
  const [hand, setHand] = useState(false);
  useEffect(() => {
    if (!live || paused || hand || calm) return;
    const t = setTimeout(() => setAt((a) => (a + 1) % MODELS.length), 3600);
    return () => clearTimeout(t);
  }, [live, paused, hand, calm, at]);
  return (
    <div className="pg-wall" ref={ref} onPointerLeave={() => setHand(false)}>
      <LivePause dark paused={paused} onToggle={pause} className="pg-wall-pause" />
      <ul className="pg-wall-grid">
        {MODELS.map(([n, m], i) => (
          <li key={m}>
            <A to={'/' + m} className={'pg-tile' + (i === at ? ' on' : '')} data-cursor="Open"
              onPointerEnter={(e) => { if (e.pointerType === 'mouse') { setHand(true); setAt(i); } }} onFocus={() => setAt(i)}>
              <Img src={`/models/${m}.webp`} alt="" w={1200} h={1500} className="pg-tile-img" data-morph />
              {i === at && live && !calm && !paused && <Film src={`/models/${m}.webm`} poster={`/models/${m}.webp`} w={1200} h={1500} className="pg-tile-film" />}
              <span className="pg-tile-n">{n}</span>
            </A>
          </li>
        ))}
      </ul>
    </div>
  );
}

const REL = [['CLI', '/cli'], ['Desktop', '/desktop'], ['API Keys', '/cloud/api-keys']];

export default function Playground() {
  return (
    <main className="lx pg" data-ask-name="Try a model, then ship it">
      <section className="pg-hero" data-morph-target>
        <div className="lx-wrap pg-hero-grid">
          <div className="pg-hero-copy">
            <LineMask as="h1" className="lx-display s pg-h1" lines={['Try a model,', 'then ship it']} />
            <p className="lx-body pg-lede">Chat, completions, decisions, embeddings, image, video, audio and vision, against every model in the catalog, with each run's tokens and cost beside the answer.</p>
            <div className="pg-acts">
              <A to={PLAY} className="lx-cta" data-thumb="Open the Playground" data-cta="playground.hero">Open the Playground<Arr /></A>
              <A to="/api" className="lx-ghost">Read the API</A>
            </div>
          </div>
          <SettleStage from={1.08} lift={48} className="pg-stage"><Window /></SettleStage>
        </div>
      </section>

      <FirstRequest />

      <ClipWipe dark className="pg-paste">
        <div className="lx-wrap pg-paste-grid">
          <Paste dark name="Playground" api="/v1/chat/completions" prompt="Read https://hanzo.ai/skill.md and use Hanzo Playground in my project." className="lx-paste" />
          <Wall />
        </div>
      </ClipWipe>

      <RelatedCards className="pg-rel" items={REL} />

      <LaunchClose name="Playground" tag="Hands-on sandbox for every product" seed="playground" data={[8, 3]} ask={['Open the Playground', PLAY]} cta="playground.close" />
    </main>
  );
}
