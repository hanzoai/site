'use client';
/* Persona: builders looking for a working app to start from. Goal: browse the gallery. CTA: "Browse the Gallery" → gallery.hanzo.ai. Metric: signup_start (gallery handoff).
   Gallery, v2. V2: 8/10 the salon wall as the Stage (six living frames arrive huge and settle under a giant title, a spotlight walking them), frames that open into a viewer, three moves as big steps, a typed prompt, one dark closing room, amber accent
   Motion budget: signature = the walking spotlight on the wall; supporting = Stage (Settle), Open (frame to viewer morph), typing.
   Colour: none (0 UI hues); the spotlight is white light. The wall has a pause button.
   Gallery. Its idea is a gallery wall, hung salon style.
   Signature: the first screen is the wall. The title, the wall label and six frames hang at different sizes, each
   frame holding its own living contour picture; a spotlight walks from frame to frame by itself, the counter
   following it, and a click steps you up to the frame (it opens large, with the next and the previous beside it).
   Beyond: three moves from template to running app (fork it, deploy it, submit yours), each straight to its place,
   drawn from what Hanzo says every template ships with.
   Every word is Hanzo's. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { EASE, Copy, Magnetic } from '../ui';
import { A } from '../kit';
import Sigil from '../Sigil';
import LineMask from '../v2/x-gauss/LineMask';
import Settle from '../v2/Settle';
import NoJs from '../v2/x-gauss/NoJs';
import { usePause } from '../v2/x-gauss/Pause';
import '../v2/Scale.css';
import './Gallery.css';

const FRAMES = [
  ['RAG Chatbots', 'Vector + Chat + Zen, prewired. Plug your docs in, ship a branded assistant in an afternoon.'],
  ['Agent Workflows', 'Multi-step agents using the Hanzo Agent SDK. Email triage, research bots, research-to-PR pipelines.'],
  ['Deploy in One Click', 'Every template ships with a Hanzo Cloud deploy button. CI, secrets, and scaling preconfigured.'],
  ['Open Source', 'All templates Apache-2.0 in the hanzo-apps/gallery monorepo. Read the code, fork the project.'],
  ['Searchable', 'Filter by stack, product, or use case. Live previews. Embedded code playgrounds.'],
  ['Submit Yours', 'Build a template the community will love? Open a PR — we showcase the best with a paid bounty.'],
];
const pad = (n) => String(n).padStart(2, '0');
const PROMPT = 'Read https://hanzo.ai/skill.md and use Hanzo Gallery in my project.';

/* Stepping up to a frame: it opens large; arrows and Escape work, focus comes back to the frame you left. */
function Viewer({ at, setAt, close }) {
  const x = useRef(null);
  const box = useRef(null);
  useEffect(() => {
    x.current?.focus();
    const key = (e) => {
      if (e.key === 'Tab') { // keep focus inside the open frame
        const f = [...box.current.querySelectorAll('button')], i = f.indexOf(document.activeElement);
        e.preventDefault(); f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length]?.focus();
      }
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') setAt((v) => (v + 1) % 6);
      if (e.key === 'ArrowLeft') setAt((v) => (v + 5) % 6);
    };
    addEventListener('keydown', key);
    return () => removeEventListener('keydown', key);
  }, [close, setAt]);
  const [t, d] = FRAMES[at];
  return (
    <motion.div ref={box} className="xga-view" role="dialog" aria-modal="true" aria-label={t} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} onClick={(e) => e.target === e.currentTarget && close()} data-lenis-prevent>
      <motion.div className="xga-view-in" layoutId={'xga-f' + at} transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}>
        <div className="xga-view-art"><Sigil seed={'gallery-' + t} data={[at + 1, d.length]} /></div>
        <div className="xga-view-copy">
          <span className="x-mono">{pad(at + 1)} / 06</span>
          <h3>{t}</h3>
          <p>{d}</p>
          <div className="xga-view-nav">
            <button type="button" className="x-round" onClick={() => setAt((v) => (v + 5) % 6)} aria-label="Previous template">‹</button>
            <button type="button" className="x-round" onClick={() => setAt((v) => (v + 1) % 6)} aria-label="Next template">›</button>
            <button type="button" ref={x} className="w2-ghost xga-view-x" onClick={close}>Close</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Wall() {
  const [lit, setLit] = useState(0);
  const [open, setOpen] = useState(-1);
  const [hold, setHold] = useState(false);
  const [paused, pauseBtn] = usePause({ right: 12, top: 12 });
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.3 });
  const calm = useReducedMotion();
  useEffect(() => {
    if (calm || !seen || hold || paused || open >= 0) return;
    const t = setTimeout(() => setLit((v) => (v + 1) % 6), 2600);
    return () => clearTimeout(t);
  }, [lit, calm, seen, hold, paused, open]);
  useEffect(() => {
    if (open < 0) return;
    document.documentElement.style.overflow = 'hidden'; window.__lenis?.stop();
    return () => { document.documentElement.style.overflow = ''; window.__lenis?.start(); };
  }, [open]);
  const close = () => { const i = open; setOpen(-1); setTimeout(() => document.getElementById('xga-f' + i)?.focus(), 50); };
  return (
    <section className="xga-wall-sec" ref={box} aria-labelledby="xga-h1" data-morph-target>
      <div className="w2-wrap">
        <div className="xga-top">
          <div>
            <LineMask as="h1" id="xga-h1" now className="w2-display xga-h1" lines={['Gallery']} />
            <p className="xga-kick x-mono">gallery.hanzo.ai</p>
          </div>
          <motion.div className="xga-top-r" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}>
            <p className="w2-lede xga-lede">Curated template showcase for Hanzo products</p>
            <div className="xga-acts">
              <Magnetic strength={0.25}><A to="https://gallery.hanzo.ai" className="w2-cta" data-thumb="Browse the Gallery" data-cta="gallery.hero">Browse the Gallery <i aria-hidden="true">↗</i></A></Magnetic>
              <A to="https://docs.hanzo.ai/docs/studio" className="w2-ghost">Documentation</A>
            </div>
          </motion.div>
        </div>
        <Settle from={1.04} lift={30}>
        <div className="xga-wall">
          {pauseBtn}
          <aside className="xga-label" aria-label="Get Gallery">
            <h2>Get Gallery</h2>
            <p>Image + video gallery</p>
            <dl><dt>License:</dt><dd>Apache-2.0</dd></dl>
            <a href="https://github.com/hanzoai" target="_blank" rel="noopener noreferrer" className="xga-org">hanzoai</a>
            <A to="https://platform.hanzo.ai/deploy" className="w2-ghost xga-deploy">Deploy to Cloud</A>
          </aside>
          <div className="xga-plaque">
            <h2>Start from a Working App</h2>
            <span className="x-mono" aria-live="polite">{pad(lit + 1)} / 06</span>
          </div>
          {FRAMES.map(([t, d], i) => (
            <motion.button
              key={t}
              id={'xga-f' + i}
              type="button"
              layoutId={open === i ? undefined : 'xga-f' + i}
              className={'xga-frame f' + i + (lit === i ? ' lit' : '')}
              onClick={() => { setLit(i); setOpen(i); }}
              onPointerEnter={(e) => { if (e.pointerType === 'mouse') { setHold(true); setLit(i); } }}
              onPointerLeave={() => setHold(false)}
              onFocus={() => { setHold(true); setLit(i); }}
              onBlur={() => setHold(false)}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.2 + i * 0.06 }}
              aria-haspopup="dialog"
              data-cursor="View"
            >
              <span className="xga-art"><Sigil seed={'gallery-' + t} data={[i + 1, d.length]} /></span>
              <span className="xga-cap"><span className="x-mono">{pad(i + 1)}</span><b>{t}</b><span className="xga-d">{d}</span></span>
              <i className="xga-light" aria-hidden="true" />
            </motion.button>
          ))}
        </div>
        </Settle>
      </div>
      <AnimatePresence>{open >= 0 && <Viewer at={open} setAt={setOpen} close={close} />}</AnimatePresence>
    </section>
  );
}

/* The prompt types itself into the box when you reach it. */
function Paste() {
  const box = useRef(null);
  const el = useRef(null);
  const seen = useInView(box, { once: true, amount: 0.6 });
  const calm = useReducedMotion();
  const [typing, setTyping] = useState(false);
  useEffect(() => {
    if (!seen || calm || !el.current) return;
    let i = 0, live = true;
    setTyping(true);
    const tick = () => { if (!live || !el.current) return; el.current.textContent = PROMPT.slice(0, ++i); if (i < PROMPT.length) setTimeout(tick, 26); else setTyping(false); };
    el.current.textContent = '';
    setTimeout(tick, 300);
    return () => { live = false; if (el.current) el.current.textContent = PROMPT; };
  }, [seen, calm]);
  return (
    <section className="w2-sec xga-paste">
      <div className="w2-wrap xga-paste-in">
        <div className="xga-paste-h">
          <h2 className="w2-headline">Paste and ship</h2>
          <p className="w2-lede">Paste this into any agent. It reads the skill manifest and calls Gallery from there.</p>
        </div>
        <div className="xga-term" ref={box}>
          <div className="xga-term-bar"><span className="x-mono">Agent prompt</span><Copy text={PROMPT} /></div>
          <p className="xga-term-t x-mono"><span ref={el}>{PROMPT}</span><b className={'xga-caret' + (typing ? ' on' : '')} aria-hidden="true" /></p>
        </div>
      </div>
    </section>
  );
}

const MOVES = [
  ['Fork it', 'All templates Apache-2.0 in the hanzo-apps/gallery monorepo.', 'View on GitHub', 'https://github.com/hanzo-apps/gallery'],
  ['Deploy it', 'CI, secrets, and scaling preconfigured.', 'Deploy to Cloud', 'https://platform.hanzo.ai/deploy'],
  ['Submit yours', 'Open a PR — we showcase the best with a paid bounty.', 'View on GitHub', 'https://github.com/hanzo-apps/gallery'],
];

function Moves() {
  return (
    <section className="w2-sec xga-moves">
      <div className="w2-wrap">
        <ol className="xga-moves-l">
          {MOVES.map(([t, d, cta, to], i) => (
            <li key={t}>
              <span className="xga-move-n w2-fig">{pad(i + 1)}</span>
              <h3 className="w2-headline">{t}</h3>
              <p className="w2-body">{d}</p>
              <A to={to} className="xga-move-a">{cta} <i aria-hidden="true">→</i></A>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default function Gallery() {
  return (
    <main className="xga w2">
      <NoJs />
      <Wall />
      <Moves />
      <Paste />
      <section className="w2-sec xga-band w2-dark" data-room="dark">
        <div className="w2-wrap xga-band-in">
          <h2 className="w2-display">Skip the Boilerplate</h2>
          <div className="xga-band-r">
            <p className="w2-lede">Ship your idea, not your scaffolding.</p>
            <div className="xga-acts"><A to="https://gallery.hanzo.ai" className="w2-cta" data-cta="gallery.close">Browse the Gallery <i aria-hidden="true">↗</i></A><A to="https://github.com/hanzo-apps/gallery" className="w2-ghost">View on GitHub</A></div>
          </div>
        </div>
      </section>
    </main>
  );
}
