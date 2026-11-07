'use client';
/* Hanzo beta. Its idea is getting there first: the products in early access, and three ways in.
   Persona: a builder or researcher who wants Hanzo's releases early. Goal: apply. CTA: "Apply" (/beta/apply, Hanzo's
   Beta access link). Metric: signup_start (an apply click).
   V2: 8/10 (v3: every product tile answers hover: films step up, Dev rewrites its diff, Studio runs its cut again, hairline strengthens, the arrow joins the name; press .97) grey deck: "Get there first." with one Apply, then the five products in early access in their own screen (Kai, Enso and Zen as films, Dev and Studio as windows that come alive; a pause control stops all of them), settling into one row; the three passes wipe in one by one, carry Hanzo's own media and open into a full sheet that holds focus; one solid Apply, sticky after the hero; a dark close with Kai's film behind Feedback and Book a call, cutting in.
   Signature: open: each pass is a tile that grows into a full sheet with a shared-element morph (synchronized.studio),
   its picture and words carried across, the one Apply inside.
   Beyond: the five products in early access are their own tiles, each opening into its page.
   Motion: open (state, the signature) + films that play while seen (idle) + tiles settling into a row (scroll) +
   tiles leaning on hover and the plus turning (pointer) + line-mask headline (arrival). Copy is Hanzo's only. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'motion/react';
import { createPortal } from 'react-dom';
import { A, Cta, Film, Img } from '../kit';
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

/* Dev and Studio have no film: their windows are drawn, and they come alive when seen (Dev's lines write in, a diff
   lands; Studio's playhead runs across the clips), once per view; the pause stops them; reduced motion shows the end. */
function Sketch({ kind, paused, beat = 0 }) {
  const ref = useRef(null);
  const seen = useInView(ref, { amount: 0.4 });
  const run = seen && !paused;
  if (kind === 'Dev') return (
    <span ref={ref} className={'xbt-sk dev' + (run ? ' run' : '')}>
      {[62, 40, 74, 28, 55, 70, 34].map((w, i) => <i key={beat + '-' + i} className={i === 3 ? 'add' : i === 4 ? 'del' : ''} style={{ width: w + '%', '--i': i }} />)}
    </span>
  );
  return (
    <span ref={ref} className={'xbt-sk studio' + (run ? ' run' : '')}>
      {[[8, 40], [30, 62], [4, 30], [44, 50]].map(([l, w], i) => <i key={beat + '-' + i} style={{ marginLeft: l + '%', width: w + '%', '--i': i }} />)}
      <b key={beat} />
    </span>
  );
}

const DROP = [0, 140, 60, 190, 90]; // where each tile starts below the row it settles into

/* Hover tells you what the product is: a film steps up out of its frame; Dev's window writes its diff again and
   Studio's playhead runs the cut again (the sketch is re-keyed so its animation replays). */
function Tile({ p, i, n, to, film, paused }) {
  const y = useTransform(p, [0, 1], [DROP[i], 0]);
  const [beat, setBeat] = useState(0);
  const replay = (e) => { if (!film && e.pointerType === 'mouse') setBeat((b) => b + 1); };
  return (
    <motion.li style={{ y }}>
      <motion.div initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: EASE, delay: 0.25 + i * 0.06 }}>
        <A to={to} className={'xbt-tile' + (film ? ' film' : '')} aria-label={n} onPointerEnter={replay} onFocus={() => !film && setBeat((b) => b + 1)}>
          {film ? (paused
            ? <Img src={`/models/${film}.webp`} w={1200} h={1500} alt="" className="xbt-film" />
            : <Film src={`/models/${film}.webm`} poster={`/models/${film}.webp`} w={1200} h={1500} className="xbt-film" data-morph />)
            : <Sketch kind={n} paused={paused} beat={beat} />}
          <span className="xbt-tile-n">{n}</span>
        </A>
      </motion.div>
    </motion.li>
  );
}

function Hero() {
  return (
    <section className="xbt-hero" aria-labelledby="xbt-h1" data-ask-name="Hanzo beta">
      <div className="xp-wrap">
        <LineReveal as="h1" id="xbt-h1" className="xp-display xbt-h1" lines={['Get there first.']} />
        <div className="xbt-side">
          <p className="xp-lede xbt-lede">
            Early access to {PRODUCTS.map(([n, to], i) => (
              <span key={n}><A to={to} className="xbt-prod">{n}</A>{i < 3 ? ', ' : i === 3 ? ' and ' : '.'}</span>
            ))}
          </p>
          <Cta to="/beta/apply" id="beta.hero" thumb className="xp-cta">Apply</Cta>
        </div>
      </div>
    </section>
  );
}

/* The five products in early access, in their own screen: the films first, settling into one row as you scroll. */
function Strip({ paused, setPaused }) {
  const strip = useRef(null);
  const { scrollYProgress } = useScroll({ target: strip, offset: ['start end', 'center center'] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.06, 1]);
  return (
    <section className="xbt-strip-s" aria-label="Early access to Dev, Studio, Kai, Enso and Zen.">
      <div className="xp-wrap xbt-strip" ref={strip}>
        <div className="xbt-shelf">
          <span className="xbt-shelf-k">Hanzo beta</span>
          <button type="button" className="xbt-pause" aria-pressed={paused} aria-label={paused ? 'Play' : 'Pause'} onClick={() => setPaused((v) => !v)}>
            {paused ? <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M5 3.5v9l7-4.5z" fill="currentColor" /></svg>
              : <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M5 3.5v9M11 3.5v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>}
          </button>
        </div>
        <motion.ul className="xbt-tiles" style={{ scale }} data-swipe-own>
          {TILES.map(([n, to, film], i) => <Tile key={n} p={scrollYProgress} i={i} n={n} to={to} film={film} paused={paused} />)}
        </motion.ul>
      </div>
    </section>
  );
}

/* The media a pass carries: a model's own picture, or Dev's window. */
function Media({ film, paused }) {
  return film ? <Img src={`/models/${film}.webp`} w={1200} h={1500} alt="" className={'xbt-pass-img ' + film} /> : <span className="xbt-pass-sk"><Sketch kind="Dev" paused={paused} /></span>;
}

/* The pass, opened: it grows out of its tile into a sheet over the page. */
/* The pass, opened: it grows out of its tile into a native modal <dialog> (focus held and returned by the browser;
   Esc, the scrim, Close and Back all close it). */
function Sheet({ i, close }) {
  const [k, t, d, to, film] = PASSES[i];
  const dlg = useRef(null);
  useEffect(() => {
    const el = dlg.current;
    if (el && !el.open) el.showModal();
    const cancel = (e) => { e.preventDefault(); history.back(); };
    const back = () => close();
    el?.addEventListener('cancel', cancel);
    history.pushState({ xbtSheet: true }, '');
    addEventListener('popstate', back);
    window.__lenis?.stop();
    document.documentElement.style.overflow = 'hidden';
    return () => { el?.removeEventListener('cancel', cancel); removeEventListener('popstate', back); window.__lenis?.start(); document.documentElement.style.overflow = ''; if (el?.open) el.close(); };
  }, [close]);
  return createPortal(
    <dialog ref={dlg} className="xbt-sheet-wrap xp" aria-labelledby="xbt-sheet-t">
      <motion.div className="xbt-veil" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} onClick={() => history.back()} />
      <motion.div layoutId={'xbt-pass-' + k} className={'xbt-sheet' + (film ? ' dark' : '')} data-room={film ? 'dark' : undefined} transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}>
        <button type="button" className="xbt-close" onClick={() => history.back()} aria-label="Close" autoFocus>
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
        </button>
        <motion.div layoutId={'xbt-m-' + k} className="xbt-sheet-m" transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}><Media film={film} /></motion.div>
        <motion.div className="xbt-sheet-in" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.4, ease: EASE } }} exit={{ opacity: 0, transition: { duration: 0.15 } }}>
          <h3 id="xbt-sheet-t" className="xp-display md">{t}</h3>
          <p className="xp-lede">{d}</p>
          <Cta to={to} id={'beta.' + k} className="xp-cta">Apply</Cta>
        </motion.div>
      </motion.div>
    </dialog>,
    document.body,
  );
}

function Passes({ paused }) {
  const [open, setOpen] = useState(-1);
  const opener = useRef(null);
  const show = (i, el) => { opener.current = el; setOpen(i); };
  const close = () => { setOpen(-1); setTimeout(() => opener.current?.focus({ preventScroll: true }), 650); };
  return (
    <section className="xp-sec xbt-passes" aria-label="Beta access, Research access, Design partner">
      <div className="xp-wrap">
        <ul className="xbt-grid">
          {PASSES.map(([k, t, d, to, film], i) => (
            <motion.li key={k} className={'xbt-cell c' + i} initial={{ clipPath: 'inset(18% 0 0 0 round 24px)', y: 40 }} whileInView={{ clipPath: 'inset(0% 0 0 0 round 24px)', y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.5, ease: EASE, delay: i * 0.06 }}>
              <motion.article layoutId={'xbt-pass-' + k} className={'xbt-pass' + (film ? ' dark' : '')} data-room={film ? 'dark' : undefined} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
                <motion.div layoutId={'xbt-m-' + k} className="xbt-pass-m" transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}><Media film={film} paused={paused} /></motion.div>
                <button type="button" className="xbt-hit" onClick={(e) => show(i, e.currentTarget)} aria-haspopup="dialog" aria-label={t} />
                <div className="xbt-pass-b">
                  <h2 className="xp-title xbt-t">{t}</h2>
                  <p className="xbt-d">{d}</p>
                  <A to={to} className="x-arrow xbt-stub"><span>Apply</span><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></A>
                </div>
                <span className="xbt-plus" aria-hidden="true"><svg viewBox="0 0 16 16" width="16" height="16"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg></span>
              </motion.article>
            </motion.li>
          ))}
        </ul>
      </div>
      <AnimatePresence>{open >= 0 && <Sheet key={open} i={open} close={close} />}</AnimatePresence>
    </section>
  );
}

/* A line that cuts in from its mask once its mask is seen (the mask is watched, not the hidden line). */
function Cut({ i, children }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.3 });
  return <span className="xp-l" ref={ref}><motion.span style={{ display: 'block' }} initial={{ y: '105%' }} animate={seen ? { y: '0%' } : { y: '105%' }} transition={{ duration: 0.7, ease: EASE, delay: 0.2 + i * 0.06 }}>{children}</motion.span></span>;
}

/* The close: Feedback and Book a call over Kai's own film. The room arrives as a rounded card inside the margins that
   opens to full width; the film starts from its first frame once the room is on screen and plays once. */
function Foot() {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.4 });
  return (
    <motion.section ref={ref} className="xp-sec xp-dark xbt-foot" data-room="dark" data-ask-hide aria-label="Feedback, Book a call" initial={{ clipPath: 'inset(0% 2.5% round 24px)' }} whileInView={{ clipPath: 'inset(0% 0% round 0px)' }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.5, ease: EASE }}>
      <div className="xbt-foot-film" aria-hidden="true"><Film key={seen ? 'on' : 'off'} src="/models/kai.webm" poster="/models/kai.webp" w={1200} h={1500} loop={false} /></div>
      <div className="xp-wrap xbt-foot-in">
        <Cut i={0}><A to="/login?next=%2Fbeta" className="xbt-big">Feedback<span aria-hidden="true">→</span></A></Cut>
        <Cut i={1}><a className="xbt-big sm" href="https://cal.com/hanzo" target="_blank" rel="noopener noreferrer">Book a call<span aria-hidden="true">↗</span></a></Cut>
      </div>
    </motion.section>
  );
}

export default function Beta() {
  const [paused, setPaused] = useState(false);
  return (
    <main className="xp xbt">
      <NoJs />
      <Hero />
      <Strip paused={paused} setPaused={setPaused} />
      <Passes paused={paused} />
      <Foot />
    </main>
  );
}
