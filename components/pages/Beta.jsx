'use client';
/* Hanzo beta. Its idea is getting there first: the products in early access, and three ways in.
   Persona: a builder or researcher who wants Hanzo's releases early. Goal: apply. CTA: "Apply" (/beta/apply, Hanzo's
   Beta access link). Metric: signup_start (an apply click).
   V2: 8/10 (v4, MOTION-MAP: signature `stamp` — pressing a pass stamps its own name onto it as an approval mark (the
   card lifts, squashes and settles, the mark drops in with weight and stays) before it grows into its sheet; hovering
   shows the mark waiting above the card. Entrances, in page order: `ripple` (the product rail, now first: it opens
   from the centre in a ring that runs on), `venetian-type` (the hero words, lines from alternating sides),
   `zoom-through` (Beta access flies in from behind the screen), `orbit-in` (Research access and Design partner swing
   into place on a curve), `page-curl` (the white page peels from the corner to show the dark close). No scroll-scrubbed
   row, no line-mask on every heading.) Grey deck; every product tile answers hover (films step up, Dev rewrites its
   diff, Studio runs its cut again, the hairline strengthens, the arrow joins the name; press .97); one solid Apply,
   one solid per screen on the phone too; a dark close with Kai's film behind Feedback and Book a call.
   Signature: stamp (MOTION-MAP), then open: each stamped pass grows into a full sheet with a shared-element morph
   (synchronized.studio), its picture and words carried across, the one Apply inside.
   Beyond: the five products in early access are their own tiles, each opening into its page.
   Motion: stamp + open (the signature, pointer/touch/keyboard) + films that play while seen (idle) + tile hovers
   (pointer) + five page-local entrances in components/pages/beta/enter.js. Copy is Hanzo's only. */
import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { createPortal } from 'react-dom';
import { A, Cta, Film, Img } from '../kit';
import { NoJs } from '../v2/LineReveal';
import { useEnter, stamp } from './beta/enter';
import '../v2/ProgramScale.css';
import './Beta.css';
import './beta/enter.css';

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

/* Hover tells you what the product is: a film steps up out of its frame; Dev's window writes its diff again and
   Studio's playhead runs the cut again (the sketch is re-keyed so its animation replays). --d is the tile's distance
   from the middle of the row, which the ripple entrance uses. */
function Tile({ i, n, to, film, paused }) {
  const [beat, setBeat] = useState(0);
  const replay = (e) => { if (!film && e.pointerType === 'mouse') setBeat((b) => b + 1); };
  return (
    <li style={{ '--d': Math.abs(i - 2) }}>
      <A to={to} className={'xbt-tile' + (film ? ' film' : '')} aria-label={n} onPointerEnter={replay} onFocus={() => !film && setBeat((b) => b + 1)}>
        {film ? (paused
          ? <Img src={`/models/${film}.webp`} w={1200} h={1500} alt="" className="xbt-film" />
          : <Film src={`/models/${film}.webm`} poster={`/models/${film}.webp`} w={1200} h={1500} className="xbt-film" data-morph />)
          : <Sketch kind={n} paused={paused} beat={beat} />}
        <span className="xbt-tile-n">{n}</span>
      </A>
    </li>
  );
}

/* Phones keep Hanzo's "Try Hanzo" solid in the header; while this hero's own solid Apply is on screen the header's
   button reads as an outline (the same html[data-ask=quiet] the shell sets on desktop), so one solid shows at a time. */
function useOneSolidOnPhone() {
  useEffect(() => {
    const H = document.documentElement;
    const mq = matchMedia('(max-width: 900px)');
    const el = document.querySelector('main.xbt [data-cta="beta.hero"]');
    if (!el) return;
    let mine = false, vis = false;
    const apply = () => {
      if (mq.matches && vis) { H.dataset.ask = 'quiet'; mine = true; }
      else if (mine) { delete H.dataset.ask; mine = false; }
    };
    const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; apply(); });
    io.observe(el);
    const timers = [300, 1400].map((ms) => setTimeout(apply, ms)); // after the shell's own first pass
    mq.addEventListener('change', apply);
    return () => { io.disconnect(); timers.forEach(clearTimeout); mq.removeEventListener('change', apply); if (mine) delete H.dataset.ask; };
  }, []);
}

/* The words: entrance `venetian-type`, each line from the side opposite the one before. */
function Hero() {
  useOneSolidOnPhone();
  return (
    <section className="xbt-hero" aria-labelledby="xbt-h1" data-ask-name="Hanzo beta" data-enter="venetian">
      <div className="xp-wrap">
        <h1 id="xbt-h1" className="xp-display xbt-h1"><span className="xbt-v">Get there first.</span></h1>
        <div className="xbt-side">
          <p className="xp-lede xbt-lede xbt-v">
            Early access to Dev, Studio, Kai, Enso and Zen.
          </p>
          <span className="xbt-v xbt-v-cta"><Cta to="/beta/apply" id="beta.hero" thumb className="xp-cta">Apply</Cta></span>
        </div>
      </div>
    </section>
  );
}

/* The five products in early access, first on the page: entrance `ripple`, the row opening from its middle. */
function Strip({ paused, setPaused }) {
  return (
    <section className="xbt-strip-s" aria-label="Early access to Dev, Studio, Kai, Enso and Zen.">
      <div className="xp-wrap xbt-strip" data-enter="ripple">
        <div className="xbt-shelf">
          <span className="xbt-shelf-k">Hanzo beta</span>
          <button type="button" className="xbt-pause" aria-pressed={paused} aria-label={paused ? 'Play' : 'Pause'} onClick={() => setPaused((v) => !v)}>
            {paused ? <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M5 3.5v9l7-4.5z" fill="currentColor" /></svg>
              : <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M5 3.5v9M11 3.5v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>}
          </button>
        </div>
        <ul className="xbt-tiles" data-swipe-own>
          {TILES.map(([n, to, film], i) => <Tile key={n} i={i} n={n} to={to} film={film} paused={paused} />)}
        </ul>
      </div>
    </section>
  );
}

/* The media a pass carries: a model's own picture, or Dev's window. */
function Media({ film, paused }) {
  return film ? <Img src={`/models/${film}.webp`} w={1200} h={1500} alt="" className={'xbt-pass-img ' + film} /> : <span className="xbt-pass-sk"><Sketch kind="Dev" paused={paused} /></span>;
}

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

/* The signature, `stamp`: pressing a pass (pointer, tap, Enter or Space) stamps the pass's own name onto it as an
   approval mark, and the card takes the blow (lift, squash, settle); the mark stays, and the stamped pass then grows
   into its sheet. Entrances: Beta access `zoom-through`; Research access and Design partner `orbit-in`. */
function Passes({ paused }) {
  const [open, setOpen] = useState(-1);
  const [marked, setMarked] = useState({});
  const opener = useRef(null);
  const busy = useRef(false);
  const show = (i, el) => {
    if (busy.current) return;
    busy.current = true;
    opener.current = el;
    const card = el.closest('.xbt-pass');
    setMarked((m) => ({ ...m, [PASSES[i][0]]: (m[PASSES[i][0]] || 0) + 1 }));
    stamp(card, () => { busy.current = false; setOpen(i); });
  };
  const close = useCallback(() => { setOpen(-1); setTimeout(() => opener.current?.focus({ preventScroll: true }), 650); }, []);
  return (
    <section className="xp-sec xbt-passes" aria-label="Beta access, Research access, Design partner">
      <div className="xp-wrap">
        <ul className="xbt-grid">
          {PASSES.map(([k, t, d, to, film], i) => (
            <li key={k} className={'xbt-cell c' + i} data-enter={i === 0 ? 'zoom' : 'orbit'} style={{ '--o': i - 1 }}>
              <motion.article layoutId={'xbt-pass-' + k} className={'xbt-pass' + (film ? ' dark' : '')} data-room={film ? 'dark' : undefined} data-stamped={marked[k] ? '' : undefined} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
                <motion.div layoutId={'xbt-m-' + k} className="xbt-pass-m" transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}><Media film={film} paused={paused} /></motion.div>
                <button type="button" className="xbt-hit" onClick={(e) => show(i, e.currentTarget)} aria-haspopup="dialog" aria-label={t} />
                <div className="xbt-pass-b">
                  <h2 className="xp-title xbt-t">{t}</h2>
                  <p className="xbt-d">{d}</p>
                  <A to={to} className="x-arrow xbt-stub"><span>Apply</span><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></A>
                </div>
                <span className="xbt-mark" aria-hidden="true"><span>{t}</span></span>
                <span className="xbt-key x-mono">{k.toUpperCase()}</span>
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

/* The close: Feedback and Book a call over Kai's own film. Entrance `page-curl`: the white page peels away from the
   bottom corner to show the dark room; the film starts from its first frame once the room is on screen and plays once. */
function Foot() {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.4 });
  return (
    <section ref={ref} className="xp-sec xp-dark xbt-foot" data-room="dark" data-ask-hide aria-label="Feedback, Book a call" data-enter="curl">
      <div className="xbt-foot-film" aria-hidden="true"><Film key={seen ? 'on' : 'off'} src="/models/kai.webm" poster="/models/kai.webp" w={1200} h={1500} loop={false} /></div>
      <div className="xp-wrap xbt-foot-in">
        <A to="/login?next=%2Fbeta" className="xbt-big">Feedback<span aria-hidden="true">→</span></A>
        <A to="/pricing" className="xbt-big sm" data-cta="beta.go-paid">Skip the wait, go paid<span aria-hidden="true">→</span></A>
        <a className="xbt-big sm" href="https://cal.com/hanzo" target="_blank" rel="noopener noreferrer">Book a call<span aria-hidden="true">↗</span></a>
      </div>
      <span className="xbt-curl" aria-hidden="true" />
    </section>
  );
}

export default function Beta() {
  const [paused, setPaused] = useState(false);
  const root = useRef(null);
  useEnter(root);
  return (
    <main className="xp xbt" ref={root}>
      <NoJs />
      <Strip paused={paused} setPaused={setPaused} />
      <Hero />
      <Passes paused={paused} />
      <Foot />
    </main>
  );
}
