'use client';
/* Persona: builders looking for a working app to start from. Goal: browse the gallery. CTA: "Browse the Gallery" → gallery.hanzo.ai. Metric: signup_start (gallery handoff, data-cta gallery.hero / gallery.close).
   V2: 8/10 a salon wall that hangs real things: Hanzo's Zen film leads it as the plaque, six frames each hold a small product render made of that template's own words, a light walks them and the plaque reads the lit one out; a frame steps up into a viewer and back with no hole; fork, deploy, submit as one stage that changes; a typed prompt that never moves the page; a dark close with the wall in miniature.
   Motion budget: signature = the walking light on the wall (the plaque reads the lit frame); supporting = Settle (stage), Open (frame to viewer morph), typing; the stage below is a state change (one object, three states).
   Colour: none in the UI (0 hues); colour arrives only through Hanzo's Zen film. The wall has a pause control (light and film).
   Signature: the first screen is the wall. A light walks frame to frame by itself, the plaque under the Zen film reading
   out the lit template in Hanzo's words; pointing at a frame holds the light there, a click steps you up to it.
   Beyond: fork it, deploy it, submit yours, as one object that changes state (repo, deploy, pull request), each with
   its link straight to its place.
   Every word is Hanzo's. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { EASE, Copy, Magnetic } from '../ui';
import { A, Cta } from '../kit';
import ModelFilm, { FilmPause, usePaused } from '../v2/ModelFilm';
import LineMask from '../v2/x-gauss/LineMask';
import Settle from '../v2/Settle';
import NoJs from '../v2/x-gauss/NoJs';
import '../v2/Scale.css';
import '../v2/x-gauss/Rhythm.css';
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
const GALLERY = 'https://gallery.hanzo.ai';
const REPO = 'https://github.com/hanzo-apps/gallery';

/* A small product render for each frame, drawn only from that frame's own words (aria-hidden: the words are in the caption). */
function Render({ i, on }) {
  const c = 'xga-r xga-r' + i + (on ? ' on' : '');
  if (i === 0) return (
    <span className={c}>
      <span className="xga-r-chips">{['Vector', 'Chat', 'Zen'].map((w) => <em key={w}>{w}</em>)}</span>
      <span className="xga-r-me">Plug your docs in</span>
      <span className="xga-r-ai"><b>Zen</b>ship a branded assistant in an afternoon.</span>
    </span>
  );
  if (i === 1) return (
    <span className={c}>
      {['Email triage', 'research bots', 'research-to-PR pipelines'].map((w, k) => <span key={w} className="xga-r-step" style={{ '--k': k }}><i />{w}</span>)}
    </span>
  );
  if (i === 2) return (
    <span className={c}>
      <span className="xga-r-btn">Deploy to Cloud</span>
      <span className="xga-r-ticks">{['CI', 'secrets', 'scaling'].map((w, k) => <span key={w} style={{ '--k': k }}><i />{w}</span>)}</span>
    </span>
  );
  if (i === 3) return (
    <span className={c}>
      <span className="xga-r-repo">hanzo-apps/gallery</span>
      <span className="xga-r-tree">{['Read the code', 'fork the project', 'Apache-2.0'].map((w, k) => <span key={w} style={{ '--k': k }}>{w}</span>)}</span>
    </span>
  );
  if (i === 4) return (
    <span className={c}>
      <span className="xga-r-find">Filter by</span>
      <span className="xga-r-chips">{['stack', 'product', 'use case'].map((w, k) => <em key={w} style={{ '--k': k }}>{w}</em>)}</span>
      <span className="xga-r-prev"><i /><i /><i /></span>
    </span>
  );
  return (
    <span className={c}>
      <span className="xga-r-pr"><i />Open a PR</span>
      <span className="xga-r-tags"><em>showcase</em><em>paid bounty</em></span>
    </span>
  );
}

/* Stepping up to a frame: it opens large from the frame you clicked; arrows change what it shows (a crossfade), so
   closing flies back to the same frame. Escape closes, focus stays inside and comes back to the frame. */
function Viewer({ at, from, setAt, close }) {
  const x = useRef(null);
  const box = useRef(null);
  useEffect(() => {
    x.current?.focus();
    const key = (e) => {
      if (e.key === 'Tab') {
        const f = [...box.current.querySelectorAll('button, a')], i = f.indexOf(document.activeElement);
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
      <motion.div className="xga-view-in" layoutId={'xga-f' + from} transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={at} className="xga-view-body" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <div className={'xga-view-art' + (at === 1 || at === 3 ? ' dk' : '')}><Render i={at} on /></div>
            <div className="xga-view-copy">
              <span className="x-mono">{pad(at + 1)} / 06</span>
              <h3>{t}</h3>
              <p>{d}</p>
              <A to={GALLERY} className="xga-link" data-cta="gallery.viewer">Browse the Gallery <i aria-hidden="true">↗</i></A>
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="xga-view-nav">
          <button type="button" className="x-round" onClick={() => setAt((v) => (v + 5) % 6)} aria-label="Previous template">‹</button>
          <button type="button" className="x-round" onClick={() => setAt((v) => (v + 1) % 6)} aria-label="Next template">›</button>
          <button type="button" ref={x} className="x-round xga-view-x" onClick={close} aria-label="Close">×</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Wall() {
  const [lit, setLit] = useState(0);
  const [open, setOpen] = useState(-1);
  const [from, setFrom] = useState(-1);
  const [hold, setHold] = useState(false);
  const paused = usePaused();
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.3 });
  const calm = useReducedMotion();
  useEffect(() => {
    if (calm || !seen || hold || paused || open >= 0) return;
    const t = setTimeout(() => setLit((v) => (v + 1) % 6), 2800);
    return () => clearTimeout(t);
  }, [lit, calm, seen, hold, paused, open]);
  useEffect(() => {
    if (open < 0) return;
    document.documentElement.style.overflow = 'hidden'; window.__lenis?.stop();
    return () => { document.documentElement.style.overflow = ''; window.__lenis?.start(); };
  }, [open >= 0]); // eslint-disable-line react-hooks/exhaustive-deps
  const close = () => { const i = from; setLit(open); setOpen(-1); setTimeout(() => { setFrom(-1); document.getElementById('xga-f' + i)?.focus(); }, 650); };
  return (
    <section className="xga-wall-sec" ref={box} aria-labelledby="xga-h1" data-morph-target>
      <div className="w2-wrap">
        <div className="xga-top">
          <div>
            <LineMask as="h1" id="xga-h1" now className="w2-display xga-h1" lines={['Gallery']} />
            <p className="xga-kick x-mono">gallery.hanzo.ai</p>
          </div>
          <motion.div className="xga-top-r" initial={{ y: 14 }} animate={{ y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}>
            <p className="w2-lede xga-lede">Curated template showcase for Hanzo products</p>
            <div className="xga-acts">
              <Magnetic strength={0.25}><Cta to={GALLERY} id="gallery.hero" thumb size="lg">Browse the Gallery</Cta></Magnetic>
              <Cta to="https://docs.hanzo.ai/docs/studio" kind="link">Documentation</Cta>
            </div>
          </motion.div>
        </div>
        <Settle from={1.04} lift={30}>
        <div className="xga-wall">
          <div className="xga-plaque">
            <ModelFilm slug="zen" play={!paused} className="xga-film" />
            <div className="xga-plaque-t">
              <h2>Start from a Working App</h2>
              <span className="x-mono">{pad(lit + 1)} / 06</span>
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.p key={lit} className="xga-plaque-d" aria-hidden="true" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3, ease: EASE }}><b>{FRAMES[lit][0]}</b> {FRAMES[lit][1]}</motion.p>
            </AnimatePresence>
            <span className="xga-pause"><FilmPause className="dark" /></span>
          </div>
          {FRAMES.map(([t, d], i) => (
            <motion.button
              key={t}
              id={'xga-f' + i}
              type="button"
              layoutId={from === i ? undefined : 'xga-f' + i}
              className={'xga-frame f' + i + (lit === i ? ' lit' : '')}
              onClick={() => { setLit(i); setFrom(i); setOpen(i); }}
              onPointerEnter={(e) => { if (e.pointerType === 'mouse') { setHold(true); setLit(i); } }}
              onPointerLeave={() => setHold(false)}
              onFocus={() => { setHold(true); setLit(i); }}
              onBlur={() => setHold(false)}
              initial={{ y: 30 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.2 + i * 0.06 }}
              aria-haspopup="dialog"
              data-cursor=""
            >
              <span className={'xga-art' + (i === 1 || i === 3 ? ' dk' : '')} aria-hidden="true"><Render i={i} on={lit === i} /></span>
              <span className="xga-cap"><span className="x-mono">{pad(i + 1)}</span><b>{t}</b><span className="xga-d">{d}</span></span>
            </motion.button>
          ))}
          <aside className="xga-label" aria-label="Get Gallery">
            <h2>Get Gallery</h2>
            <p>Image + video gallery</p>
            <dl><dt>License:</dt><dd>Apache-2.0</dd></dl>
            <a href="https://github.com/hanzoai" target="_blank" rel="noopener noreferrer" className="xga-org">hanzoai<span className="x-sr"> (opens in a new tab)</span></a>
            <Cta to="https://platform.hanzo.ai/deploy" kind="quiet" className="xga-deploy">Deploy to Cloud</Cta>
          </aside>
        </div>
        </Settle>
      </div>
      <AnimatePresence>{open >= 0 && <Viewer at={open} from={from} setAt={setOpen} close={close} />}</AnimatePresence>
    </section>
  );
}

/* The prompt types itself into the box when you reach it; the full prompt holds the box's height, so nothing moves. */
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
          <p className="xga-term-t x-mono">
            <span className="xga-term-ghost" aria-hidden="true">{PROMPT}</span>
            <span className="xga-term-live"><span ref={el}>{PROMPT}</span><b className={'xga-caret' + (typing ? ' on' : '')} aria-hidden="true" /></span>
          </p>
        </div>
      </div>
    </section>
  );
}

const MOVES = [
  ['Fork it', 'All templates Apache-2.0 in the hanzo-apps/gallery monorepo.', 'View on GitHub', REPO, 3],
  ['Deploy it', 'CI, secrets, and scaling preconfigured.', 'Deploy to Cloud', 'https://platform.hanzo.ai/deploy', 2],
  ['Submit yours', 'Open a PR — we showcase the best with a paid bounty.', 'View on GitHub', REPO, 5],
];

/* Three moves, one object: the same template goes repo → deploy → pull request. It steps by itself while in view
   (until you pick one), and every move keeps its link straight to its place. */
function Moves() {
  const ref = useRef(null);
  const seen = useInView(ref, { amount: 0.5 });
  const calm = useReducedMotion();
  const paused = usePaused();
  const [at, setAt] = useState(0);
  const [mine, setMine] = useState(false);
  useEffect(() => {
    if (!seen || calm || mine || paused) return;
    const t = setTimeout(() => setAt((v) => (v + 1) % 3), 3200);
    return () => clearTimeout(t);
  }, [at, seen, calm, mine, paused]);
  return (
    <section className="w2-sec xga-moves" ref={ref}>
      <div className="w2-wrap xga-moves-in">
        <ol className="xga-moves-l">
          {MOVES.map(([t, d, cta, to], i) => (
            <li key={t} className={at === i ? 'on' : ''}>
              <button type="button" className="xga-move-b" aria-pressed={at === i} onClick={() => { setMine(true); setAt(i); }}>
                <span className="xga-move-n x-mono">{pad(i + 1)}</span>
                <h3>{t}</h3>
              </button>
              <div className="xga-move-x" inert={at !== i}>
                <p className="w2-body">{d}</p>
                <A to={to} className="xga-link">{cta} <i aria-hidden="true">→</i></A>
              </div>
            </li>
          ))}
        </ol>
        <div className="xga-moves-obj" aria-hidden="true">
          <span className="xga-moves-bar"><i /><i /><i /><b className="x-mono">hanzo-apps/gallery</b></span>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={at} className={'xga-moves-st' + (at === 0 ? ' dk' : '')} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
              <Render i={MOVES[at][4]} on />
            </motion.div>
          </AnimatePresence>
          <span className="xga-moves-dots">{MOVES.map((m, i) => <i key={i} className={at === i ? 'on' : ''} />)}</span>
        </div>
      </div>
    </section>
  );
}

export default function Gallery() {
  return (
    <main id="main" className="xga w2 gx">
      <NoJs />
      <Wall />
      <Moves />
      <Paste />
      <section className="w2-sec xga-band w2-dark" data-room="dark">
        <div className="w2-wrap xga-band-in">
          <div className="xga-band-l">
            <h2 className="w2-display">Skip the Boilerplate</h2>
            <div className="xga-mini" aria-hidden="true">{FRAMES.map(([t], i) => <span key={t} className={'xga-mini-f dk m' + i}><Render i={i} on /></span>)}</div>
          </div>
          <div className="xga-band-r">
            <p className="w2-lede">Ship your idea, not your scaffolding.</p>
            <div className="xga-acts"><Cta to={GALLERY} id="gallery.close" size="lg">Browse the Gallery</Cta><Cta to={REPO} kind="link">View on GitHub</Cta></div>
          </div>
        </div>
      </section>
    </main>
  );
}
