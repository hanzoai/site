'use client';
/* A2Chapters — Apple-style sticky chapters for the Apps 2 pages (owned by the Apps 2 chat; styles in A2.css).
   Usage:
     <A2Chapters items={[{ k: 'Observe', t: 'Catch the failure', d: 'Reads the stack trace…' }, …]}
                 visual={(i, live) => <Thing step={i} live={live} />} flip={false} dark={false} label="The loop" />
   Desktop: the section is one screen per chapter. A sticky stage pins the text on one side and the picture on the other;
   as you scroll, one chapter comes in as the last goes out and visual(i, true) redraws for the active chapter. The small
   numbered index jumps to a chapter (keyboard too). Phones: a plain vertical story, each chapter with its own picture,
   visual(k, false). Reduced motion: the same states, no slide. Every chapter's words stay in the HTML. */
import { useRef, useState } from 'react';
import { useScroll, useMotionValueEvent } from 'motion/react';

export default function A2Chapters({ items, visual, flip, dark, label, className = '', head }) {
  const ref = useRef(null);
  const [on, setOn] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setOn(Math.min(items.length - 1, Math.max(0, Math.floor(v * items.length * 0.9999))));
  });
  const go = (k) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const span = el.offsetHeight - window.innerHeight;
    const y = top + span * ((k + 0.5) / items.length);
    if (window.__lenis) window.__lenis.scrollTo(y, { duration: 1.1 }); else window.scrollTo({ top: y, behavior: 'smooth' });
  };
  return (
    <section ref={ref} className={'a2-ch' + (flip ? ' flip' : '') + (dark ? ' a2-dark' : '') + ' ' + className} style={{ '--n': items.length }} aria-label={label} {...(dark ? { 'data-room': 'dark' } : {})}>
      <div className="a2-ch-stick">
        <div className="a2-wrap a2-ch-grid">
          <div className="a2-ch-copy">
            {head}
            <div className="a2-ch-nav" role="group" aria-label={label ? label + ': chapters' : 'Chapters'}>
              {items.map((c, k) => (
                <button key={k} type="button" aria-current={k === on ? 'step' : undefined} aria-label={c.t} onClick={() => go(k)}>{String(k + 1).padStart(2, '0')}</button>
              ))}
            </div>
            <div className="a2-ch-items">
              {items.map((c, k) => (
                <article key={k} className={'a2-ch-item' + (k === on ? ' on' : '')} style={{ '--dy': (k < on ? -28 : 28) + 'px' }}>
                  <div className="a2-ch-pv" aria-hidden="true">{visual(k, false)}</div>
                  {c.k && <p className="a2-kick">{c.k}</p>}
                  <h3 className="a2-headline">{c.t}</h3>
                  {typeof c.d === 'string' ? <p className="a2-body">{c.d}</p> : c.d}
                </article>
              ))}
            </div>
          </div>
          <div className="a2-ch-vis" aria-hidden="true">{visual(on, true)}</div>
        </div>
      </div>
    </section>
  );
}
