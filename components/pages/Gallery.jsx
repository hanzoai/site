'use client';
/* Gallery. Its idea is a gallery wall, hung salon style.
   Signature: the first screen is the wall. The title, the wall label and six frames hang at different sizes, each
   frame holding its own living contour picture; a spotlight walks from frame to frame by itself, the counter
   following it, and a click steps you up to the frame (it opens large, with the next and the previous beside it).
   Beyond: three moves from template to running app (fork it, deploy it, submit yours), each straight to its place,
   drawn from what Hanzo says every template ships with.
   Every word is Hanzo's. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { EASE, Rise, Copy } from '../ui';
import { A, Go, More, SecHead, Band } from '../kit';
import Sigil from '../Sigil';
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
            <button type="button" ref={x} className="x-btn xga-view-x" onClick={close}>Close</button>
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
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.3 });
  const calm = useReducedMotion();
  useEffect(() => {
    if (calm || !seen || hold || open >= 0) return;
    const t = setTimeout(() => setLit((v) => (v + 1) % 6), 2600);
    return () => clearTimeout(t);
  }, [lit, calm, seen, hold, open]);
  useEffect(() => {
    if (open < 0) return;
    document.documentElement.style.overflow = 'hidden'; window.__lenis?.stop();
    return () => { document.documentElement.style.overflow = ''; window.__lenis?.start(); };
  }, [open]);
  const close = () => { const i = open; setOpen(-1); setTimeout(() => document.getElementById('xga-f' + i)?.focus(), 50); };
  return (
    <section className="xga-wall-sec" ref={box} aria-labelledby="xga-h1">
      <div className="x-wrap">
        <div className="xga-wall">
          <motion.div className="xga-title" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: EASE }}>
            <p className="x-kick">gallery.hanzo.ai</p>
            <h1 id="xga-h1" className="xga-h1">Gallery</h1>
            <p className="xga-lede">Curated template showcase for Hanzo products</p>
            <div className="xga-acts">
              <Go to="https://gallery.hanzo.ai" solid>Browse the Gallery</Go>
              <Go to="https://docs.hanzo.ai/docs/studio">Documentation</Go>
            </div>
          </motion.div>
          <motion.aside className="xga-label" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: EASE, delay: 0.15 }} aria-label="Get Gallery">
            <h2>Get Gallery</h2>
            <p>Image + video gallery</p>
            <dl><dt>License:</dt><dd>Apache-2.0</dd></dl>
            <a href="https://github.com/hanzoai" target="_blank" rel="noopener noreferrer" className="xga-org">hanzoai</a>
            <Go to="https://platform.hanzo.ai/deploy">Deploy to Cloud</Go>
          </motion.aside>
          <motion.div className="xga-plaque" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.3 }}>
            <h2>Start from a Working App</h2>
            <span className="x-mono" aria-live="polite">{pad(lit + 1)} / 06</span>
          </motion.div>
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
    <section className="x-sec xga-paste">
      <div className="x-wrap xga-paste-in">
        <SecHead title="Paste and ship" lede="Paste this into any agent. It reads the skill manifest and calls Gallery from there." />
        <Rise className="xga-term" ref={box}>
          <div className="xga-term-bar"><span className="x-mono">Agent prompt</span><Copy text={PROMPT} /></div>
          <p className="xga-term-t x-mono"><span ref={el}>{PROMPT}</span><b className={'xga-caret' + (typing ? ' on' : '')} aria-hidden="true" /></p>
        </Rise>
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
    <section className="x-sec xga-moves">
      <div className="x-wrap">
        <ol className="xga-moves-l">
          {MOVES.map(([t, d, cta, to], i) => (
            <Rise as="li" key={t} delay={i * 0.1} y={20}>
              <span className="xga-move-n x-mono">{pad(i + 1)}</span>
              <h3>{t}</h3>
              <p>{d}</p>
              <More to={to}>{cta}</More>
            </Rise>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default function Gallery() {
  return (
    <main className="xga">
      <Wall />
      <Moves />
      <Paste />
      <Band title="Skip the Boilerplate" lede="Ship your idea, not your scaffolding." action="Browse the Gallery" to="https://gallery.hanzo.ai" note={<p className="x-band-note"><A to="https://github.com/hanzo-apps/gallery">View on GitHub</A></p>} />
    </main>
  );
}
