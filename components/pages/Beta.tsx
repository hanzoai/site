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
import { PLANS, checkoutAbs } from '../../lib/plans';
import { useEnter, stamp } from './beta/enter';
import { press } from '../../lib/press';
import { track } from '../../lib/track';
import '../v2/ProgramScale.css';
import './Beta.css';
import './beta/enter.css';
import './Frame.css';

const EASE = [0.16, 1, 0.3, 1];
const PASSES = [
  ['a', 'Beta access', 'New releases before they ship.', '/beta/apply', 'enso'],
  ['b', 'Research access', 'Research models and checkpoints to evaluate before release.', '/beta/research', 'zen'],
  ['c', 'Design partner', 'Build it with the team. Chosen from applications.', '/beta/design', null],
];
// the program each pass opens, as the app's analytics name it
const PROGRAM = { a: 'beta', b: 'research', c: 'partner' };
const chosen = (i) => track('beta_track_selected', { program: PROGRAM[PASSES[i][0]], program_name: PASSES[i][1], from_key: false });
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

/* The opening frame: Hanzo's words over its lit halftone (entrance `venetian-type`, lines from alternating sides), then
   the five products in early access as a film strip under them (entrance `ripple`, the row opening from its middle).
   The heading, the ask, the way to a paid plan and all five tiles sit in the first screen. */
function Hero({ paused, setPaused }) {
  useOneSolidOnPhone();
  return (
    <section className="zf-sec xbt-open" aria-labelledby="xbt-h1" data-ask-name="Hanzo beta">
      <div className="xp-wrap">
        <div className="xbt-shelf">
          <span className="xbt-shelf-k">Hanzo beta</span>
          <button type="button" className="xbt-pause" aria-pressed={paused} aria-label={paused ? 'Play' : 'Pause'} onClick={() => setPaused((v) => !v)}>
            {paused ? <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M5 3.5v9l7-4.5z" fill="currentColor" /></svg>
              : <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M5 3.5v9M11 3.5v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>}
          </button>
        </div>
        <div className="xbt-hero" data-enter="venetian">
          <h1 id="xbt-h1" className="xp-display xbt-h1"><span className="xbt-v">Get there first.</span></h1>
          <div className="xbt-side">
            <p className="xp-lede xbt-lede xbt-v">
              Early access to Dev, Studio, Kai, Enso and Zen.
            </p>
            <span className="xbt-v xbt-v-cta">
              <Cta to="/beta/apply" id="beta.hero" thumb className="xp-cta">Apply</Cta>
              <a href="#xbt-paid" className="xbt-golink" data-cta="beta.hero.go">Go is ${PLANS.go.price}/month</a>
            </span>
          </div>
        </div>
      </div>
      <div className="xp-wrap xbt-strip" data-enter="ripple" role="group" aria-label="Early access to Dev, Studio, Kai, Enso and Zen.">
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
  // a pass's Apply is a page of this site: its press is read where the page transition reads it
  useEffect(() => press('.xbt-pass .xbt-stub', (a) => chosen(PASSES.findIndex(([, , , to]) => a.getAttribute('href').startsWith(to)))), []);
  const show = (i, el) => {
    if (busy.current) return;
    busy.current = true;
    opener.current = el;
    chosen(i);
    const card = el.closest('.xbt-pass');
    setMarked((m) => ({ ...m, [PASSES[i][0]]: (m[PASSES[i][0]] || 0) + 1 }));
    stamp(card, () => { busy.current = false; setOpen(i); });
  };
  const close = useCallback(() => { setOpen(-1); setTimeout(() => opener.current?.focus({ preventScroll: true }), 650); }, []);
  return (
    <section className="zf-sec xbt-passes" aria-label="Beta access, Research access, Design partner">
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

/* The way from the waitlist to a paid plan (Zack's GA list, 8 Nov): the Beta access pass on the left, the Go plan on
   the right, joined by a line a light runs along. Apply keeps your place in line; Go's checkout skips it. Every word is
   Hanzo's own (the beta passes, the home page's "Go is $8/month", /pricing's Go card); the price is lib/plans.js. */
const GO_LINES = ['Every model, including Enso Ultra and Kai', 'Build apps with Hanzo Dev', 'Usage included on every model'];
const Ck = () => <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
function Paid() {
  return (
    <section id="xbt-paid" className="zf-sec xbt-paid" aria-labelledby="xbt-paid-h">
      <div className="xp-wrap">
        <div className="zf-head">
          <h2 id="xbt-paid-h">Skip the wait, go paid.</h2>
          <p>Free to start · Go is ${PLANS.go.price}/month, every model</p>
        </div>
        <div className="xbt-route zf-rise">
          <div className="xbt-stop wait zf-lift">
            <div className="xbt-stop-m" aria-hidden="true"><Img src="/models/enso.webp" w={1200} h={1500} alt="" /></div>
            <span className="xbt-key x-mono">A</span>
            <div className="xbt-stop-b">
              <h3>Beta access</h3>
              <p>New releases before they ship.</p>
              <A to="/beta/apply" className="x-arrow xbt-stub" data-cta="beta.paid.apply"><span>Apply</span><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></A>
            </div>
          </div>
          <div className="xbt-wire" aria-hidden="true"><i /><b /></div>
          <div className="xbt-stop go zf-lift zf-dots">
            <div className="xbt-go-top">
              <h3>{PLANS.go.name}</h3>
              <p className="xbt-go-d">Your everyday AI development toolkit, with access to every model and more included usage.</p>
            </div>
            <p className="xbt-price"><b>${PLANS.go.price}</b><span>USD/month</span></p>
            <ul className="xbt-go-l">{GO_LINES.map((t) => <li key={t}><Ck />{t}</li>)}</ul>
            <div className="xbt-go-a">
              <Cta to={checkoutAbs(PLANS.go.id, 'beta')} id="beta.paid.go" className="xp-cta">Try Hanzo</Cta>
              <span className="xbt-go-n">No commitment · Cancel anytime</span>
            </div>
            <A to="/pricing" className="x-arrow xbt-all" data-cta="beta.paid.pricing"><span>Every plan, model rate and tool price</span><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></A>
          </div>
        </div>
      </div>
    </section>
  );
}

/* The close, the page's dark room: Feedback and Book a call over Kai's own film. The room opens like a curtain as it
   arrives (Frame.css), a beam sweeping down; the film starts from its first frame once the room is on screen. */
function Foot() {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.4 });
  return (
    <section ref={ref} className="zf-room xbt-foot" data-room="dark" data-ask-hide aria-label="Feedback, Book a call">
      <div className="xbt-foot-film" aria-hidden="true"><Film key={seen ? 'on' : 'off'} src="/models/kai.webm" poster="/models/kai.webp" w={1200} h={1500} loop={false} /></div>
      <div className="xp-wrap xbt-foot-in">
        <A to="/login?next=%2Fbeta" className="xbt-big" onClick={() => track('beta_feedback_opened', { from: 'home', program: 'none' })}>Feedback<span aria-hidden="true">→</span></A>
        <A to="/pricing" className="xbt-big sm" data-cta="beta.go-paid">Skip the wait, go paid<span aria-hidden="true">→</span></A>
        <a className="xbt-big sm" href="https://cal.com/hanzo" target="_blank" rel="noopener noreferrer" onClick={() => track('beta_call_booked', { from: 'landing' })}>Book a call<span aria-hidden="true">↗</span></a>
      </div>
    </section>
  );
}

export default function Beta() {
  const [paused, setPaused] = useState(false);
  const root = useRef(null);
  useEnter(root);
  useEffect(() => { track('beta_viewed', { initial_program: 'none', resumed: false }); }, []);
  return (
    <main className="xp xbt zf" ref={root}>
      <NoJs />
      <Hero paused={paused} setPaused={setPaused} />
      <Passes paused={paused} />
      <Paid />
      <Foot />
    </main>
  );
}
