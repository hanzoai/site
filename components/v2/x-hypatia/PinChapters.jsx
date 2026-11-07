'use client';
/* PinChapters (owner: Cloud 2 chat). VISION.md motion 1, "Chapters": the text pins while the visual changes, one
   chapter coming in as the last goes out (the apple.com product-page pattern).
   Usage:
     <PinChapters label="What it looks for" items={[[title, body], ...]} visual={(at) => <MyScene at={at} />}
       look="left|right" total={6} onAt={(i) => …} className="xx-ch" />
   - Desktop (> 900px): the section is n screens tall; a sticky full-height stage holds the chapter text (one at a time;
     each title rises out of its mask) and the visual, which receives the active index. Dots jump to a chapter.
   - Phone (MASTER part 11, nothing floats over content): no pin; each chapter stacks as its words, then its own visual.
   - Every chapter's words (and its "01 / 06" counter) are in the HTML. Reduced motion: chapters swap without moving.
   Styles: PinChapters.css (prefix pc-). The visual is the page's own; size it to fill .pc-vis. */
import { useEffect, useRef, useState } from 'react';
import { useScroll, useMotionValueEvent } from 'motion/react';
import './PinChapters.css';

const pad = (n) => String(n).padStart(2, '0');

export default function PinChapters({ items, visual, label, look = 'left', total, onAt, className = '', head, foot, dark }) {
  const n = items.length;
  const tot = total || n;
  const ref = useRef(null);
  const arts = useRef([]);
  const [at, setAt] = useState(0);
  const [wide, setWide] = useState(true);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  useEffect(() => {
    const m = matchMedia('(min-width: 901px)');
    const f = () => setWide(m.matches);
    f();
    m.addEventListener('change', f);
    return () => m.removeEventListener('change', f);
  }, []);

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (!wide) return;
    setAt(Math.max(0, Math.min(n - 1, Math.floor(p * n * 0.9999))));
  });

  // phone: the chapter crossing the middle of the screen is the active one
  useEffect(() => {
    if (wide) return;
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setAt(+e.target.dataset.i)), { rootMargin: '-48% 0px -48% 0px' });
    arts.current.forEach((a) => a && io.observe(a));
    return () => io.disconnect();
  }, [wide]);

  useEffect(() => { onAt && onAt(at); }, [at, onAt]);

  const go = (i) => {
    const el = ref.current;
    if (!el) return;
    if (!wide) { arts.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
    const top = el.getBoundingClientRect().top + scrollY;
    const y = top + ((i + 0.5) / n) * (el.offsetHeight - innerHeight);
    window.__lenis ? window.__lenis.scrollTo(y, { duration: 1.1 }) : scrollTo({ top: y, behavior: 'smooth' });
  };

  return (
    <section ref={ref} className={`pc pc-${look} ${dark ? 'pc-dark' : ''} ${className}`} style={{ '--n': n }} aria-label={label} data-room={dark ? 'dark' : undefined}>
      <div className="pc-stage">
        <div className="pc-in">
          <div className="pc-copy">
            {head}
            <div className="pc-arts">
              {items.map(([t, d], i) => (
                <article key={t} ref={(el) => (arts.current[i] = el)} data-i={i} className="pc-art" data-on={i === at ? '' : undefined} data-past={i < at ? '' : undefined}>
                  <p className="pc-n v2-kick">{pad(i + 1)} / {pad(tot)}</p>
                  <h3 className="pc-t"><span>{t}</span></h3>
                  {typeof d === 'string' ? <p className="pc-d">{d}</p> : <div className="pc-d">{d}</div>}
                  <div className="pc-vis-m" aria-hidden="true">{visual(i)}</div>
                </article>
              ))}
            </div>
            <nav className="pc-dots" aria-label={(label || 'Chapters') + ': go to'}>
              {items.map(([t], i) => (
                <button key={t} type="button" aria-label={t} aria-current={i === at ? 'step' : undefined} onClick={() => go(i)}><i /></button>
              ))}
            </nav>
            {foot}
          </div>
          <div className="pc-vis">
            {visual(at)}
          </div>
        </div>
      </div>
    </section>
  );
}
