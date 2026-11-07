'use client';
/* Hanzo beta. Its idea is getting there first: the products in early access, and three ways in.
   Persona: a builder or researcher who wants Hanzo's releases early. Goal: apply. CTA: "Apply" (/beta/apply, Hanzo's
   Beta access link). Metric: no id for /beta applications in PLAN-COMPONENTS 1.1 yet (counted as an apply click).
   V2: 8/10 grey deck: "Get there first." over the five products in early access, Kai, Enso and Zen as their own films (one plays on a phone's first screen, with a pause control), settling into one row as you scroll; the three passes are tiles carrying Hanzo's own media that open into a full sheet; one solid Apply, sticky after the hero; a dark close with the Enso film behind Feedback and Book a call.
   Signature: open: each pass is a tile that grows into a full sheet with a shared-element morph (synchronized.studio),
   its picture and words carried across, the one Apply inside.
   Beyond: the five products in early access are their own tiles, each opening into its page.
   Motion: open (state, the signature) + films that play while seen (idle) + tiles settling into a row (scroll) +
   tiles leaning on hover and the plus turning (pointer) + line-mask headline (arrival). Copy is Hanzo's only. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { A, Film, Img } from '../kit';
import LineReveal, { NoJs } from '../v2/LineReveal';
import '../v2/ProgramScale.css';
import './Beta.css';

const EASE = [0.16, 1, 0.3, 1];
const PASSES = [
  ['a', 'Beta access', 'New releases before they ship.', '/beta/apply', 'enso'],
  ['b', 'Research access', 'Research models and checkpoints to evaluate before release.', '/beta/research', 'zen'],
  ['c', 'Design partner', 'Build it with the team. Chosen from applications.', '/beta/design', null],
];
const PRODUCTS = [['Dev', '/dev'], ['Studio', '/studio'], ['Kai', '/kai', 'kai'], ['Enso', '/enso', 'enso'], ['Zen', '/zen', 'zen']];
const TILES = [PRODUCTS[2], PRODUCTS[3], PRODUCTS[4], PRODUCTS[0], PRODUCTS[1]]; // the films first, so one plays on a phone's first screen

/* Dev and Studio have no film: a quiet drawing of their window instead. */
function Sketch({ kind }) {
  if (kind === 'Dev') return (
    <span className="xbt-sk dev">
      {[62, 40, 74, 28, 55, 70, 34].map((w, i) => <i key={i} className={i === 3 ? 'add' : i === 4 ? 'del' : ''} style={{ width: w + '%' }} />)}
    </span>
  );
  return (
    <span className="xbt-sk studio">
      {[[8, 40], [30, 62], [4, 30], [44, 50]].map(([l, w], i) => <i key={i} style={{ marginLeft: l + '%', width: w + '%' }} />)}
      <b />
    </span>
  );
}

const DROP = [0, 140, 60, 190, 90]; // where each tile starts below the row it settles into

function Tile({ p, i, n, to, film, paused }) {
  const y = useTransform(p, [0, 1], [DROP[i], 0]);
  return (
    <motion.li style={{ y }}>
      <motion.div initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: EASE, delay: 0.25 + i * 0.06 }}>
        <A to={to} className={'xbt-tile' + (film ? ' film' : '')} aria-label={n}>
          {film ? (paused
            ? <Img src={`/models/${film}.webp`} w={1200} h={1500} alt="" className="xbt-film" />
            : <Film src={`/models/${film}.webm`} poster={`/models/${film}.webp`} w={1200} h={1500} className="xbt-film" data-morph />)
            : <Sketch kind={n} />}
          <span className="xbt-tile-n">{n}</span>
        </A>
      </motion.div>
    </motion.li>
  );
}

function Hero() {
  const strip = useRef(null);
  const [paused, setPaused] = useState(false);
  const { scrollYProgress } = useScroll({ target: strip, offset: ['start end', 'center center'] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.06, 1]);
  return (
    <section className="xbt-hero" aria-labelledby="xbt-h1">
      <div className="xp-wrap xp-grid xbt-top">
        <div className="xbt-copy">
          <LineReveal as="h1" id="xbt-h1" className="xp-display" lines={['Get there first.']} />
        </div>
        <div className="xbt-side">
          <p className="xp-lede xbt-lede">
            Early access to {PRODUCTS.map(([n, to], i) => (
              <span key={n}><A to={to} className="xbt-prod">{n}</A>{i < 3 ? ', ' : i === 3 ? ' and ' : '.'}</span>
            ))}
          </p>
          <A to="/beta/apply" className="x-btn solid xp-cta" data-thumb="Apply" data-cta="beta.hero">Apply<i aria-hidden="true">→</i></A>
        </div>
      </div>
      <div className="xp-wrap xbt-strip" ref={strip}>
        <div className="xbt-shelf">
          <span className="xbt-shelf-k">Hanzo beta</span>
          <button type="button" className="xbt-pause" aria-pressed={paused} aria-label={paused ? 'Play' : 'Pause'} onClick={() => setPaused((v) => !v)}>
            {paused ? <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M5 3.5v9l7-4.5z" fill="currentColor" /></svg>
              : <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M5 3.5v9M11 3.5v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>}
          </button>
        </div>
        <motion.ul className="xbt-tiles" style={{ scale }} aria-label="Early access to Dev, Studio, Kai, Enso and Zen." data-swipe-own>
          {TILES.map(([n, to, film], i) => <Tile key={n} p={scrollYProgress} i={i} n={n} to={to} film={film} paused={paused} />)}
        </motion.ul>
      </div>
    </section>
  );
}

/* The media a pass carries: a model's own picture, or Dev's window. */
function Media({ film }) {
  return film ? <Img src={`/models/${film}.webp`} w={1200} h={1500} alt="" className="xbt-pass-img" /> : <span className="xbt-pass-sk"><Sketch kind="Dev" /></span>;
}

/* The pass, opened: it grows out of its tile into a sheet over the page. */
function Sheet({ i, close }) {
  const [k, t, d, to, film] = PASSES[i];
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
      <motion.div layoutId={'xbt-pass-' + k} className={'xbt-sheet' + (film ? ' dark' : '')} data-room={film ? 'dark' : undefined} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
        <motion.div layoutId={'xbt-m-' + k} className="xbt-sheet-m" transition={{ type: 'spring', stiffness: 300, damping: 30 }}><Media film={film} /></motion.div>
        <motion.div className="xbt-sheet-in" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.6, ease: EASE } }} exit={{ opacity: 0, transition: { duration: 0.12 } }}>
          <h3 id="xbt-sheet-t" className="xp-display md">{t}</h3>
          <p className="xp-lede">{d}</p>
          <A to={to} className="x-btn solid xp-cta" data-cta={'beta.' + k}>Apply<i aria-hidden="true">→</i></A>
        </motion.div>
        <button ref={shut} type="button" className="xbt-close" onClick={close} aria-label="Close">
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
        </button>
      </motion.div>
    </div>
  );
}

function Passes() {
  const [open, setOpen] = useState(-1);
  const opener = useRef(null);
  const show = (i, el) => { opener.current = el; setOpen(i); };
  const close = () => { setOpen(-1); setTimeout(() => opener.current?.focus(), 50); };
  return (
    <section className="xp-sec xbt-passes" aria-label="Beta access, Research access, Design partner">
      <div className="xp-wrap">
        <ul className="xbt-grid">
          {PASSES.map(([k, t, d, to, film], i) => (
            <li key={k} className={'xbt-cell c' + i}>
              <motion.article layoutId={'xbt-pass-' + k} className={'xbt-pass' + (film ? ' dark' : '')} data-room={film ? 'dark' : undefined} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
                <motion.div layoutId={'xbt-m-' + k} className="xbt-pass-m" transition={{ type: 'spring', stiffness: 300, damping: 30 }}><Media film={film} /></motion.div>
                <button type="button" className="xbt-hit" onClick={(e) => show(i, e.currentTarget)} aria-haspopup="dialog" aria-label={t} data-cursor="Open" />
                <div className="xbt-pass-b">
                  <h2 className="xp-title xbt-t">{t}</h2>
                  <p className="xbt-d">{d}</p>
                  <A to={to} className="x-arrow xbt-stub"><span>Apply</span><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></A>
                </div>
                <span className="xbt-plus" aria-hidden="true"><svg viewBox="0 0 16 16" width="16" height="16"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg></span>
              </motion.article>
            </li>
          ))}
        </ul>
      </div>
      <AnimatePresence>{open >= 0 && <Sheet key={open} i={open} close={close} />}</AnimatePresence>
    </section>
  );
}

/* The close: Feedback and Book a call, over Enso's own film. */
function Foot() {
  return (
    <section className="xp-sec xp-dark xbt-foot" data-room="dark" aria-label="Feedback, Book a call">
      <div className="xbt-foot-film" aria-hidden="true"><Film src="/models/enso.webm" poster="/models/enso.webp" w={1200} h={1500} /></div>
      <div className="xp-wrap xbt-foot-in">
        <A to="/login?next=%2Fbeta" className="xbt-big">Feedback<span aria-hidden="true">→</span></A>
        <a className="xbt-big" href="https://cal.com/hanzo" target="_blank" rel="noopener noreferrer">Book a call<span aria-hidden="true">↗</span></a>
      </div>
    </section>
  );
}

export default function Beta() {
  return (
    <main className="xp xbt" data-ask-name="Hanzo beta">
      <NoJs />
      <Hero />
      <Passes />
      <Foot />
    </main>
  );
}
