'use client';
/* Playground, v2 launch page (Cloud 3).
   V2: 8/10 Split Stage hero with the Playground itself running eight kinds of run on real model media; the "a key, a model name, and a message" sentence as a pinned scene whose lit phrase marks its token in the real request; one dark room; related tiles that open.
   Signature: the playground, running. Eight kinds of run (chat to vision) take turns in one window, each drawing its own
   kind of answer on Hanzo's own model media (Iro develops, Koma's film plays, Kai's subject is found), with the run's
   tokens and cost filling beside it; tap a kind to hold it.
   Beyond: the anatomy of a first request. Scroll and the sentence lights one part at a time (a key, a model name, a
   message) while the same part lights inside the real curl request, then the Python client, so the first call reads
   as three things you already have.
   Motion: signature = the running window; supporting = the scrubbed sentence (one variable-weight moment), the clip
   wipe into the dark room, the line-masked title. Every word and link is Hanzo's; the meter shows proportions, not
   measured figures. */
import { useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent, useReducedMotion } from 'motion/react';
import { Copy } from '../../ui';
import { Paste, useLive, useSteps } from './Frame';
import SettleStage from '../../v2/SettleStage';
import ClipWipe from '../../v2/ClipWipe';
import LaunchClose from '../../v2/LaunchClose';
import LineMask from '../../v2/LineMask';
import { A } from '../../kit';
import './Playground.css';

const EASE = [0.16, 1, 0.3, 1];
const MODES = ['Chat', 'Completions', 'Decisions', 'Embeddings', 'Image', 'Video', 'Audio', 'Vision'];
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
function Image() {
  return (
    <div className="pg-img">
      <img src="/models/iro.webp" alt="" />
      <div className="pg-tiles">{Array.from({ length: 60 }).map((_, i) => <motion.i key={i} initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.35, delay: 0.2 + rnd(i) * 2.2 }} />)}</div>
    </div>
  );
}
function Video({ calm }) {
  return <div className="pg-vid"><video src="/models/koma.webm" poster="/models/koma.webp" muted autoPlay={!calm} loop playsInline preload="auto" /><i className="pg-head" /></div>;
}
function Audio() {
  return <div className="pg-wave">{Array.from({ length: 56 }).map((_, i) => <i key={i} style={{ animationDelay: `${-rnd(i) * 1.2}s`, height: `${24 + rnd(i + 3) * 76}%` }} />)}</div>;
}
function Vision() {
  return (
    <div className="pg-vis">
      <img src="/models/kai.webp" alt="" />
      <motion.i className="pg-box" initial={{ left: '8%', top: '10%', width: '80%', height: '78%', opacity: 0 }} animate={{ left: '30%', top: '18%', width: '38%', height: '56%', opacity: 1 }} transition={{ duration: 1.2, ease: EASE, delay: 0.3 }}>
        <motion.span initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }}>found</motion.span>
      </motion.i>
    </div>
  );
}
const CANVAS = [Chat, Completions, Decisions, Embeddings, Image, Video, Audio, Vision];

function Window() {
  const [ref, live, calm] = useLive(0.3);
  const [at, choose, mine] = useSteps(MODES.length, 3800, live);
  const Canvas = CANVAS[at];
  const [tin, tout, secs] = RUN[at];
  const bars = [['Tokens in', tin], ['Tokens out', tout], ['Time', secs], ['Cost', Math.min(1, (tin + tout) * 0.6 + secs * 0.5)]];
  return (
    <div className="pg-win" ref={ref}>
      <div className="pg-bar"><i /><i /><i /><span>Playground</span><b>zen</b></div>
      <div className="pg-modes" role="tablist" aria-label="Kind of run">
        {MODES.map((m, i) => (
          <button key={m} type="button" role="tab" aria-selected={at === i} onClick={() => choose(i)}>
            {at === i && <i className="pg-mode-bg" />}
            <span>{m}</span>
            {at === i && !mine && live && <em key={at} className="pg-mode-t" />}
          </button>
        ))}
      </div>
      <div className="pg-body">
        <div className="pg-canvas" aria-hidden="true">
          <div className="pg-stagebox">
            {calm ? <div className="pg-cv"><Canvas calm /></div> : (
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={at} className="pg-cv" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }} transition={{ duration: 0.35, ease: EASE }}><Canvas /></motion.div>
              </AnimatePresence>
            )}
          </div>
          <div className="pg-input"><span>Hello</span><b><svg viewBox="0 0 16 16" width="15" height="15"><path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></b></div>
        </div>
        <aside className="pg-run" aria-label="This run">
          <p className="pg-run-k">Run · {MODES[at]}</p>
          <div className="pg-model"><span>Model</span><b>zen</b></div>
          <ul className="pg-meter">
            {bars.map(([l, v], i) => <li key={l} className={i === 3 ? 'cost' : ''}><span>{l}</span><i><b key={at} style={{ '--v': v, '--d': 0.3 + i * 0.12 + 's' }} /></i></li>)}
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
  const [at, setAt] = useState(0); // 0..2 the three parts, 3 the whole request in Python
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (p) => { const i = Math.min(3, Math.floor(p * 4 * 0.999)); setAt((v) => (v === i ? v : i)); });
  const jump = (i) => {
    const el = ref.current; if (!el) return;
    const y = el.getBoundingClientRect().top + scrollY + ((i + 0.5) / 4) * (el.offsetHeight - innerHeight);
    window.__lenis ? window.__lenis.scrollTo(y, { duration: 1 }) : scrollTo({ top: y, behavior: calm ? 'auto' : 'smooth' });
  };
  const tab = at === 3 ? 1 : 0;
  return (
    <section ref={ref} className="pg-first">
      <div className="pg-first-stick">
        <div className="lx-wrap pg-first-grid">
          <div className="pg-first-copy">
            <p className="lx-kick">curl · python</p>
            <h2 className="lx-title pg-first-h">Then the same request from code</h2>
            <p className="pg-anat" data-at={at}>
              {PARTS.map(([t], i) => (
                <span key={t} className="pg-g">
                  <button type="button" className={'pg-ph' + (at === i ? ' on' : '') + (at === 3 ? ' all' : '')} onClick={() => jump(i)} aria-pressed={at === i}>{t}</button>{i === 0 ? ',' : i === 1 ? ', and' : ''}
                </span>
              ))}{' '}
              <button type="button" className={'pg-ph' + (at === 3 ? ' on' : '')} onClick={() => jump(3)} aria-pressed={at === 3}>is the whole first request.</button>
            </p>
          </div>
          <div className="pg-req">
            <div className="pg-req-bar">
              <i /><i /><i />
              <div className="pg-req-tabs" aria-hidden="true"><span className={tab === 0 ? 'on' : ''}>curl</span><span className={tab === 1 ? 'on' : ''}>python</span></div>
              <Copy text={tab ? PY : CURL} />
            </div>
            <div className="pg-req-panes">
              <div className="pg-req-pane" data-on={tab === 0 || undefined}><p className="pg-req-l">One request</p><pre><code>{marked(CURL, at < 3 ? PARTS[at][1] : null)}</code></pre></div>
              <div className="pg-req-pane" data-on={tab === 1 || undefined}><p className="pg-req-l">The Python client</p><pre><code>{marked(PY, 'HANZO_API_KEY')}</code></pre></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const REL = [['CLI', '/cli'], ['Desktop', '/desktop'], ['API Keys', '/cloud/api-keys']];
const Arr = () => <svg viewBox="0 0 16 16" width="20" height="20" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;

export default function Playground() {
  return (
    <main className="lx pg">
      <section className="pg-hero" data-morph-target>
        <div className="lx-wrap pg-hero-grid">
          <div className="pg-hero-copy">
            <p className="lx-kick"><b>●</b> Playground</p>
            <LineMask as="h1" className="lx-display s pg-h1" lines={['Try a model,', 'then ship it']} />
            <p className="lx-body pg-lede">Chat, completions, decisions, embeddings, image, video, audio and vision, against every model in the catalog, with each run's tokens and cost beside the answer.</p>
            <div className="pg-acts">
              <A to="https://platform.hanzo.ai/playground" className="lx-cta" data-thumb="Open the Playground">Open the Playground</A>
              <A to="/api" className="lx-ghost">Read the API</A>
            </div>
          </div>
          <SettleStage from={1.1} lift={60} className="pg-stage"><Window /></SettleStage>
        </div>
      </section>

      <FirstRequest />

      <ClipWipe dark className="pg-paste">
        <div className="lx-wrap"><Paste dark name="Playground" api="/v1/chat/completions" prompt="Read https://hanzo.ai/skill.md and use Hanzo Playground in my project." /></div>
      </ClipWipe>

      <section className="pg-rel">
        <div className="lx-wrap">
          <p className="lx-kick">Related capabilities</p>
          <ul className="pg-rel-grid">
            {REL.map(([t, to]) => <li key={t}><A to={to} className="pg-rel-card"><span data-morph>{t}</span><Arr /></A></li>)}
          </ul>
        </div>
      </section>

      <LaunchClose name="Playground" tag="Hands-on sandbox for every product" seed="playground" data={[8, 3]} />
    </main>
  );
}
