'use client';
/* Hanzo beta. Its idea is the pass that lets you in before release.
   V2: 8/10 rebuilt as three screens: a display hero over the five early-access products (Kai, Enso and Zen as their own films) that settle into one row as you scroll; three pass tiles that open into their own full sheet; a dark closing room for feedback and a call.
   Signature: open: each pass is a tile that opens into a full sheet with a shared-element morph (synchronized.studio),
   the pass letter, its words and its Apply stub carried across.
   Beyond: say what you are after (use it first, evaluate it first, build it with the team) and the pass made for it
   opens, read from Hanzo's own description of each.
   Motion: open (signature) + the product tiles settling into one row as you scroll + line-masked hero type.
   Accent: magenta. Every word is Hanzo's. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { A } from '../kit';
import LineReveal from '../v2/LineReveal';
import '../v2/ProgramScale.css';
import './Beta.css';

const EASE = [0.16, 1, 0.3, 1];
const PASSES = [
  ['A', 'Beta access', 'New releases before they ship.', '/beta/apply', 'Use it first'],
  ['B', 'Research access', 'Research models and checkpoints to evaluate before release.', '/beta/research', 'Evaluate it first'],
  ['C', 'Design partner', 'Build it with the team. Chosen from applications.', '/beta/design', 'Build it with the team'],
];
const PRODUCTS = [['Dev', '/dev'], ['Studio', '/studio'], ['Kai', '/kai', 'kai'], ['Enso', '/enso', 'enso'], ['Zen', '/zen', 'zen']];

/* A model's own film, playing only while it is on screen; reduced motion keeps its still. */
function Film({ name }) {
  const ref = useRef(null);
  const seen = useInView(ref, { amount: 0.2 });
  const calm = useReducedMotion();
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (seen && !calm) v.play().catch(() => {}); else v.pause();
  }, [seen, calm]);
  return <video ref={ref} className="xbt-film" src={`/models/${name}.webm`} poster={`/models/${name}.webp`} muted loop playsInline preload="metadata" data-morph />;
}

/* Dev and Studio have no film: a quiet drawing of their window instead. */
function Sketch({ kind }) {
  if (kind === 'Dev') return (
    <span className="xbt-sk dev" data-morph>
      {[62, 40, 74, 28, 55, 70, 34].map((w, i) => <i key={i} className={i === 3 ? 'add' : i === 4 ? 'del' : ''} style={{ width: w + '%' }} />)}
    </span>
  );
  return (
    <span className="xbt-sk studio" data-morph>
      {[[8, 40], [30, 62], [4, 30], [44, 50]].map(([l, w], i) => <i key={i} style={{ marginLeft: l + '%', width: w + '%' }} />)}
      <b />
    </span>
  );
}

const DROP = [0, 140, 60, 190, 90]; // where each tile starts below the row it settles into

function Tile({ p, i, n, to, film }) {
  const y = useTransform(p, [0, 1], [DROP[i], 0]);
  return (
    <motion.li style={{ y }}>
      <motion.div initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: EASE, delay: 0.25 + i * 0.06 }}>
        <A to={to} className={'xbt-tile' + (film ? ' film' : '')} aria-label={n}>
          {film ? <Film name={film} /> : <Sketch kind={n} />}
          <span className="xbt-tile-n">{n}</span>
        </A>
      </motion.div>
    </motion.li>
  );
}

function Hero() {
  const strip = useRef(null);
  const { scrollYProgress } = useScroll({ target: strip, offset: ['start end', 'center center'] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.08, 1]);
  return (
    <section className="xbt-hero" aria-labelledby="xbt-h1">
      <div className="xp-wrap xp-grid xbt-top">
        <div className="xbt-copy">
          <p className="xp-kick">Hanzo beta</p>
          <LineReveal as="h1" id="xbt-h1" className="xp-display" lines={['Get there first.']} />
        </div>
        <motion.p className="xp-lede xbt-lede" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}>
          Early access to {PRODUCTS.map(([n, to], i) => (
            <span key={n}><A to={to} className="xbt-prod">{n}</A>{i < 3 ? ', ' : i === 3 ? ' and ' : '.'}</span>
          ))}
        </motion.p>
      </div>
      <div className="xp-wrap xbt-strip" ref={strip}>
        <motion.ul className="xbt-tiles" style={{ scale }} aria-label="The products in early access" data-swipe-own>
          {PRODUCTS.map(([n, to, film], i) => <Tile key={n} p={scrollYProgress} i={i} n={n} to={to} film={film} />)}
        </motion.ul>
      </div>
    </section>
  );
}

/* The pass, opened: it grows out of its tile into a sheet over the page. */
function Sheet({ i, close }) {
  const [k, t, d, to, w] = PASSES[i];
  const shut = useRef(null);
  useEffect(() => {
    const esc = (e) => { if (e.key === 'Escape') close(); };
    addEventListener('keydown', esc);
    window.__lenis?.stop();
    document.documentElement.style.overflow = 'hidden';
    shut.current?.focus();
    return () => { removeEventListener('keydown', esc); window.__lenis?.start(); document.documentElement.style.overflow = ''; };
  }, [close]);
  return (
    <div className="xbt-sheet-wrap" role="dialog" aria-modal="true" aria-labelledby="xbt-sheet-t">
      <motion.div className="xbt-veil" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} onClick={close} />
      <motion.div layoutId={'xbt-pass-' + k} className="xbt-sheet" transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
        <motion.span layoutId={'xbt-l-' + k} className="xbt-l" transition={{ type: 'spring', stiffness: 300, damping: 30 }}>{k}</motion.span>
        <motion.div className="xbt-sheet-in" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.6, ease: EASE } }} exit={{ opacity: 0, transition: { duration: 0.12 } }}>
          <p className="xp-kick">Pass {k} · {w}</p>
          <h3 id="xbt-sheet-t" className="xp-display md">{t}</h3>
          <p className="xp-lede">{d}</p>
          <A to={to} className="xp-cta" data-thumb={'Apply for ' + t}>Apply<i aria-hidden="true">→</i></A>
        </motion.div>
        <button ref={shut} type="button" className="xbt-close" onClick={close} aria-label="Close">×</button>
      </motion.div>
    </div>
  );
}

function Passes() {
  const [open, setOpen] = useState(-1);
  const [want, setWant] = useState(-1);
  const opener = useRef(null);
  const show = (i, el) => { opener.current = el; setOpen(i); };
  const close = () => { setOpen(-1); setTimeout(() => opener.current?.focus(), 50); };
  return (
    <section className="xp-sec xbt-passes" aria-labelledby="xbt-want-h">
      <div className="xp-wrap">
        <div className="xp-grid xbt-want">
          <div className="xbt-want-head">
            <p className="xp-kick">Three passes</p>
            <LineReveal onView id="xbt-want-h" className="xp-head" lines={['What are you after?']} />
          </div>
          <div className="xbt-chips" role="radiogroup" aria-label="What are you after?">
            {PASSES.map(([k, , , , w], i) => (
              <button key={k} type="button" role="radio" aria-checked={want === i} onClick={(e) => { setWant(i); show(i, e.currentTarget); }}>
                {w}<span aria-hidden="true">→</span>
              </button>
            ))}
          </div>
        </div>
        <ul className="xbt-grid">
          {PASSES.map(([k, t, d, to], i) => (
            <li key={k} className={'xbt-cell c' + i}>
              <motion.article layoutId={'xbt-pass-' + k} className={'xbt-pass' + (want === i ? ' want' : '')} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
                <button type="button" className="xbt-hit" onClick={(e) => show(i, e.currentTarget)} aria-haspopup="dialog" data-cursor="Open"><span className="x-sr">Open {t}</span></button>
                <motion.span layoutId={'xbt-l-' + k} className="xbt-l" transition={{ type: 'spring', stiffness: 300, damping: 30 }}>{k}</motion.span>
                <span className="xbt-pk x-mono">Pass</span>
                <h2 className="xp-title xbt-t">{t}</h2>
                <p className="xbt-d">{d}</p>
                <A to={to} className="xbt-stub" {...(i === 0 ? { 'data-thumb': 'Apply' } : {})}><span>Apply</span><span aria-hidden="true">→</span></A>
                <span className="xbt-plus" aria-hidden="true">+</span>
              </motion.article>
            </li>
          ))}
        </ul>
      </div>
      <AnimatePresence>{open >= 0 && <Sheet key={open} i={open} close={close} />}</AnimatePresence>
    </section>
  );
}

/* Feedback is filed on your Hanzo account, so it asks you to sign in first. */
function Foot() {
  const [fb, setFb] = useState(false);
  return (
    <section className="xp-sec xp-dark xbt-foot" data-room="dark" aria-label="Feedback and a call">
      <div className="xp-wrap xp-grid">
        <div className="xbt-foot-a">
          <button type="button" className="xbt-big" onClick={() => setFb((v) => !v)} aria-expanded={fb} aria-controls="xbt-fb">Feedback<span aria-hidden="true">{fb ? '−' : '+'}</span></button>
          <motion.div id="xbt-fb" className="xbt-fb" initial={false} animate={fb ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }} transition={{ duration: 0.45, ease: EASE }} inert={!fb}>
            <div>
              <p className="xp-body">Sign in so this is filed on your account.</p>
              <A to="/login?next=%2Fbeta" className="xp-cta">Log in</A>
            </div>
          </motion.div>
        </div>
        <a className="xbt-big call" href="https://cal.com/hanzo" target="_blank" rel="noopener noreferrer">Book a call<span aria-hidden="true">↗</span></a>
      </div>
    </section>
  );
}

export default function Beta() {
  return (
    <main className="xp xbt">
      <Hero />
      <Passes />
      <Foot />
    </main>
  );
}
