'use client';
/* PinChapters (v2; owned by the Platform + Cloud chat). Apple's sticky chapter scene: the words pin on the left while
   the picture on the right changes, and one chapter comes in as the last goes out (the picture wipes up from below as
   the old one leaves through the top; the words make a short rise). Scroll drives it; the numbered index jumps to a
   chapter and shows how far through it you are. Keyboard focus inside a chapter scrolls to it.
   Phones (≤ 900px) and reduced motion get a plain vertical story: every chapter in flow, words then picture.

   Usage:
     <PinChapters label="Planes" className="my-pc" chapters={[
       { id: 'compute', tab: 'Compute', copy: <MyWords />, visual: <MyPicture /> }, …
     ]} />
   - Every chapter is in the HTML at all times (inactive ones are faded, never removed), so parity holds.
   - Theme with CSS on your className: --pc-acc (index accent), --pc-per (scroll length per chapter, default 90vh). */
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { motion, useScroll, useMotionValueEvent, useTransform } from 'motion/react';
import './PinChapters.css';

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export interface Chapter {
  id: string;
  tab: ReactNode;
  copy: ReactNode;
  visual: ReactNode;
}

interface PinChaptersProps {
  chapters: Chapter[];
  label?: string;
  className?: string;
}

export default function PinChapters({ chapters, label, className = '' }: PinChaptersProps) {
  const track = useRef<HTMLDivElement>(null);
  const n = chapters.length;
  const [at, setAt] = useState(0);
  const { scrollYProgress } = useScroll({ target: track, offset: ['start start', 'end end'] });
  const local = useTransform(scrollYProgress, (v) => clamp(v * n - Math.min(n - 1, Math.floor(v * n))));
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const i = Math.min(n - 1, Math.max(0, Math.floor(v * n)));
    setAt((a) => (a === i ? a : i));
  });
  const pinned = useRef(true);
  useEffect(() => {
    const mq = matchMedia('(max-width: 899px), (prefers-reduced-motion: reduce)');
    const on = () => { pinned.current = !mq.matches; };
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  const go = (i: number, smooth = true) => {
    const el = track.current;
    if (!el || !pinned.current) return;
    const top = el.getBoundingClientRect().top + scrollY;
    const y = top + (el.offsetHeight - innerHeight) * ((i + 0.35) / n);
    if (window.__lenis) window.__lenis.scrollTo(y, { immediate: !smooth, force: true });
    else scrollTo({ top: y, behavior: smooth ? 'smooth' : 'auto' });
  };
  return (
    <div ref={track} className={'pc ' + className} style={{ '--pc-n': n } as CSSProperties}>
      <div className="pc-stage">
        <div className="pc-grid">
          <nav className="pc-idx" aria-label={label}>
            {chapters.map((c, i) => (
              <button key={c.id} type="button" className={i === at ? 'on' : ''} aria-current={i === at ? 'step' : undefined} onClick={() => go(i)}>
                <span className="pc-n">{String(i + 1).padStart(2, '0')}</span>
                <span className="pc-t">{c.tab}</span>
                {i === at && (
                  <motion.i layoutId={'pc-bar-' + (label || 'x')} className="pc-bar" transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }} aria-hidden="true">
                    <motion.b style={{ scaleX: local }} />
                  </motion.i>
                )}
              </button>
            ))}
          </nav>
          {chapters.map((c, i) => (
            <div key={c.id} id={c.id} className="pc-copy" style={{ '--i': i } as CSSProperties} data-on={i === at} data-past={i < at} onFocus={() => i !== at && go(i, false)}>
              {c.copy}
            </div>
          ))}
          {chapters.map((c, i) => (
            <div key={c.id + '-v'} className="pc-vis" style={{ '--i': i } as CSSProperties} data-on={i === at} data-past={i < at}>
              {c.visual}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
