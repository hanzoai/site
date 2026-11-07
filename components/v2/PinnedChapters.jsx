'use client';
/* PinnedChapters: the Apple product-page backbone (VISION motion 1). The words pin while one product object changes
   beneath them: as you scroll, one chapter comes in as the last goes out. Every chapter's words are in the HTML.
   Usage:
     <PinnedChapters
       label="How MQ works"                       // names the rail for screen readers
       steps={[{ t: 'Scheduling', d: 'A cron…' }]} // Hanzo's words; k optional (defaults to "01 / 06")
       visual={(at) => <Board step={at} />}        // ONE object that changes state per chapter
       flip                                        // object on the left
       per={80}                                    // svh of scroll per chapter
     />
   Desktop: 5/7 split, words left. Phone: the object sits on top, the words below, still one at a time.
   The rail of ticks jumps to a chapter (keyboard too). Reduced motion swaps without moving. Owned by Cloud 3. */
import { useRef, useState } from 'react';
import { useScroll, useMotionValueEvent } from 'motion/react';
import './LaunchType.css';
import './PinnedChapters.css';

const pad = (n) => String(n).padStart(2, '0');

export default function PinnedChapters({ steps, visual, label = 'Chapters', flip, per = 80, className = '', id, dark, kick }) {
  const ref = useRef(null);
  const n = steps.length;
  const [at, setAt] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const i = Math.min(n - 1, Math.max(0, Math.floor(p * n * 0.999)));
    setAt((v) => (v === i ? v : i));
  });
  const jump = (i) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const y = top + ((i + 0.5) / n) * (el.offsetHeight - window.innerHeight);
    window.__lenis ? window.__lenis.scrollTo(y, { duration: 1.1 }) : window.scrollTo({ top: y, behavior: 'smooth' });
  };
  return (
    <section ref={ref} id={id} className={`lx-pin ${flip ? 'flip' : ''} ${dark ? 'lx-dark' : ''} ${className}`} style={{ '--n': n, '--per': per + 'svh' }} data-room={dark ? 'dark' : undefined}>
      <div className="lx-pin-stick">
        <div className="lx-wrap lx-pin-grid">
          <div className="lx-pin-copy">
            {kick && <p className="lx-kick lx-pin-kick">{kick}</p>}
            <div className="lx-pin-steps">
              {steps.map((s, i) => (
                <article key={i} className="lx-pin-step" data-at={i < at ? 'past' : i === at ? 'on' : 'next'}>
                  <p className="lx-kick lx-pin-k">{s.k || `${pad(i + 1)} / ${pad(n)}`}</p>
                  {s.t && <h3 className="lx-pin-t">{s.t}</h3>}
                  <p className="lx-pin-d">{s.d}</p>
                  {s.extra}
                </article>
              ))}
            </div>
            <nav className="lx-pin-rail" aria-label={label}>
              {steps.map((s, i) => (
                <button key={i} type="button" aria-current={i === at ? 'step' : undefined} aria-label={`${pad(i + 1)}${s.t ? ': ' + s.t : ''}`} onClick={() => jump(i)}>
                  <i style={{ transform: `scaleX(${i === at ? 1 : i < at ? 0.55 : 0.3})` }} />
                </button>
              ))}
            </nav>
          </div>
          <div className="lx-pin-obj">{visual(at)}</div>
        </div>
      </div>
    </section>
  );
}
