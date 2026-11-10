'use client';
/* Signature (zoom-map): from the whole fleet down into one H100 card. Twelve racks of H100 cards sit on a white stage;
   scrolling (fine pointers, about 1.3 screens of travel) zooms about a fixed point so one lit card grows until it fills
   the screen, and the card then shows its own sheet: NVIDIA H100, 80GB HBM3 (counts up once), 16,896 CUDA cores, 528
   TCs. Touch and narrow screens: a tap on the lit card (or the card zooming itself once on arrival) runs the same zoom
   in time, and the button on the sheet zooms back out. Keyboard: the lit card is a button (Enter scrolls or zooms in),
   the sheet's button zooms out. Reduced motion rests on the sheet; JS off prints the sheet under the fleet.
   Every word and figure is Hanzo's (the card's name and its spec values); the fleet itself is unlabeled shapes. */
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { motion, animate, useMotionValue, useMotionValueEvent, useScroll, useTransform, useInView } from 'motion/react';
import { scrollToY } from '../../../lib/scroll';
import { Wipe } from './MachinesEnter';

const IO = [0.4, 0, 0.2, 1];
const EASE = [0.16, 1, 0.3, 1];
const RACKS = 12, CARDS = 6, AIM = [4, 2]; // the lit card: rack 4 (top row on desktop, the centre on a phone), card 2
const ZEND = 0.78; // share of the scroll travel spent zooming; the rest holds the sheet
const SCROLL_Q = '(min-width: 901px) and (pointer: fine) and (prefers-reduced-motion: no-preference)';
const CALM_Q = '(prefers-reduced-motion: reduce)';

const useMedia = (q) => useSyncExternalStore(
  (f) => { const m = matchMedia(q); m.addEventListener('change', f); return () => m.removeEventListener('change', f); },
  () => matchMedia(q).matches,
  () => false,
);

const H100 = [['Cores', '16,896 CUDA'], ['Tensor Cores', '528 TCs']];
const lit = (r, c) => (r * 5 + c * 3) % 7 < 3;
const fins = (n) => Array.from({ length: n }).map((_, k) => <i key={k} />);
const easeIO = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

export default function MachinesZoom() {
  const sec = useRef(null);
  const fleet = useRef(null);
  const aim = useRef(null);
  const back = useRef(null);
  const scrollMode = useMedia(SCROLL_Q);
  const calm = useMedia(CALM_Q);
  const geo = useRef({ s: 1 });
  const [origin, setOrigin] = useState('50% 50%');
  const z = useMotionValue(0);
  const scale = useMotionValue(1);
  const sheet = useTransform(z, [0.8, 0.97], [0, 1]);
  const [shown, setShown] = useState(false);
  const [open, setOpen] = useState(false);
  const touched = useRef(false);
  const [up, setUp] = useState(false); // hydrated: only then is the hidden sheet made inert (JS off keeps it readable)
  useEffect(() => setUp(true), []);
  const focusNext = useRef(null);
  const { scrollYProgress } = useScroll({ target: sec, offset: ['start start', 'end end'] });

  // the zoom: about a fixed point F chosen so the lit card's centre lands on the stage's centre at full scale
  const measure = () => {
    const f = fleet.current, a = aim.current;
    if (!f || !a) return;
    const W = f.offsetWidth, H = f.offsetHeight, cw = a.offsetWidth, ch = a.offsetHeight;
    if (!cw || !ch) return;
    const s = Math.max(W / cw, H / ch) * 1.12;
    const kx = a.offsetLeft + cw / 2, ky = a.offsetTop + ch / 2;
    geo.current = { s };
    setOrigin(`${(s * kx - W / 2) / (s - 1)}px ${(s * ky - H / 2) / (s - 1)}px`);
    scale.set(Math.pow(s, z.get()));
  };
  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (fleet.current) ro.observe(fleet.current);
    return () => ro.disconnect();
  }, []);

  useMotionValueEvent(z, 'change', (v) => { scale.set(Math.pow(geo.current.s, v)); setShown(v > 0.9); });

  // scroll mode: the scroll drives the zoom
  useMotionValueEvent(scrollYProgress, 'change', (p) => { if (scrollMode) z.set(easeIO(Math.min(1, p / ZEND))); });
  useEffect(() => { if (scrollMode) z.set(easeIO(Math.min(1, scrollYProgress.get() / ZEND))); }, [scrollMode]);

  // tap mode: time drives it; reduced motion rests on the sheet
  useEffect(() => { if (calm) setOpen(true); }, [calm]);
  useEffect(() => {
    if (scrollMode) return;
    const c = animate(z, open ? 1 : 0, { duration: calm ? 0 : 1.1, ease: IO });
    return () => c.stop();
  }, [open, scrollMode, calm]);
  const seen = useInView(fleet, { amount: 0.6, once: true });
  useEffect(() => {
    if (!seen || scrollMode || calm || touched.current) return;
    const t = setTimeout(() => { if (!touched.current) setOpen(true); }, 900);
    return () => clearTimeout(t);
  }, [seen, scrollMode, calm]);

  // the count: 80 is in the HTML; it counts up from 10 once, the first time the sheet is shown
  const [n, setN] = useState(80);
  const armed = useRef(false);
  useEffect(() => {
    if (calm || z.get() > 0.5) return;
    armed.current = true;
    setN(10);
  }, [calm]);
  useEffect(() => {
    const f = focusNext.current;
    if (f && shown === (f === back.current)) { f.focus({ preventScroll: true }); focusNext.current = null; }
    if (!shown || !armed.current) return;
    armed.current = false;
    const c = animate(10, 80, { duration: 1.1, ease: EASE, delay: 0.1, onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [shown]);

  const go = (inward, e) => {
    touched.current = true;
    if (e && e.detail === 0) focusNext.current = inward ? back.current : aim.current; // keyboard: follow the zoom
    if (!scrollMode) return setOpen(inward);
    const el = sec.current;
    const top = el.getBoundingClientRect().top + scrollY;
    const travel = el.offsetHeight - innerHeight;
    scrollToY(inward ? top + travel * (ZEND + 0.08) : top, { duration: 1.4 });
  };

  return (
    <section className="mc-zoom" ref={sec} data-scroll={scrollMode ? '' : undefined}>
      <Wipe className="mc-zstage">
        <motion.div className="mc-fleet" ref={fleet} style={{ scale, transformOrigin: origin }}>
          {Array.from({ length: RACKS }, (_, r) => (
            <div key={r} className="mc-zrack">
              {Array.from({ length: CARDS }, (_, c) => {
                const target = r === AIM[0] && c === AIM[1];
                const inner = <><span className="mc-card-n">H100</span><span className="mc-fins">{fins(6)}</span><span className="mc-led" /></>;
                return target ? (
                  <button key={c} ref={aim} type="button" className="mc-card on mc-ztarget" aria-label="NVIDIA H100"
                    aria-expanded={shown} aria-controls="mc-zsheet" tabIndex={shown ? -1 : 0} onClick={(e) => go(true, e)}>{inner}</button>
                ) : (
                  <span key={c} className={'mc-card' + (lit(r, c) ? ' on' : '')} aria-hidden="true">{inner}</span>
                );
              })}
            </div>
          ))}
        </motion.div>

        <motion.div id="mc-zsheet" className="mc-zsheet" style={{ opacity: sheet }} data-on={shown ? '' : undefined} inert={up && !shown ? true : undefined}>
          <div className="v2-wrap mc-zsheet-in">
            <div className="mc-zbar">
              <span className="mc-card-n">H100</span>
              <span className="mc-zbar-r">
                <span className="mc-led" aria-hidden="true" />
                <button ref={back} type="button" className="mc-zback" aria-label="NVIDIA H100" aria-expanded={shown} onClick={(e) => go(false, e)}>
                  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              </span>
            </div>
            <span className="mc-fins mc-zfins" aria-hidden="true">{fins(28)}</span>
            <div className="mc-zbody">
              <div className="mc-zhead">
                <h2 className="v2-headline">NVIDIA H100</h2>
                <p className="mc-zdesc">Dedicated GPU instances for AI/ML training</p>
              </div>
              <div className="mc-zfig">
                <dl className="mc-moment">
                  <div><dt>VRAM</dt><dd><span className="mc-cnt">{n}</span>GB HBM3</dd></div>
                </dl>
                <dl className="mc-rows">
                  {H100.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
                </dl>
              </div>
            </div>
          </div>
        </motion.div>
      </Wipe>
    </section>
  );
}
