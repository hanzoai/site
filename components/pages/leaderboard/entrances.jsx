'use client';
/* Leaderboard's five section entrances (docs/MOTION-MAP.md rule 7, "Section entrances, in order"), page-local:
   1. card-deal (hero podium)  2. rack-focus (the race room)  3. focus-pull-scroll (how to earn)
   4. orbit-in (the Beyond)    5. letter-cascade (the contributors' heading).
   Each plays once as its section arrives (IntersectionObserver; focus-pull-scroll follows the scroll and latches when
   sharp). The hidden start states live in Leaderboard.css under html.js and outside prefers-reduced-motion, so with JS
   off or reduced motion every section simply stands at its final state. Transform, opacity and filter only: no layout. */
import { useEffect, useRef, useState } from 'react';

/* true once the element is `amount` in view; then it stays true */
export function useArrive(amount = 0.25) {
  const ref = useRef(null);
  const [inn, setInn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || inn) return;
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { setInn(true); io.disconnect(); } }, { threshold: amount });
    io.observe(el);
    return () => io.disconnect();
  }, [amount, inn]);
  return [ref, inn];
}

/* a wrapper that carries the entrance name and its arrived state; CSS does the motion */
export function Arrive({ as: T = 'div', e, amount, className = '', children, ...rest }) {
  const [ref, inn] = useArrive(amount);
  return <T ref={ref} className={className} data-ent={e} data-in={inn} {...rest}>{children}</T>;
}

/* letter-cascade: the heading's letters fall into place one by one. Words stay whole for wrapping; the heading keeps
   its words as its accessible name. */
export function Cascade({ as: T = 'h2', text, className = '', id }) {
  const [ref, inn] = useArrive(0.6);
  let k = 0;
  return (
    <T ref={ref} id={id} className={className} data-ent="cascade" data-in={inn} aria-label={text}>
      {text.split(' ').map((w, wi) => (
        <span key={wi}>
          {wi > 0 && ' '}
          <span className="xlb-cw" aria-hidden="true">
            {[...w].map((c, ci) => <span key={ci} className="xlb-cl" style={{ '--k': k++ }}>{c}</span>)}
          </span>
        </span>
      ))}
    </T>
  );
}

/* focus-pull-scroll: as the section scrolls in, the focus moves from the background (an unlabeled field of ruled lines)
   to the subject: the field blurs, the subject sharpens. Driven by scroll; once the subject is sharp it latches there. */
export function FocusPull({ className = '', children, field, ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !document.documentElement.classList.contains('js')) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { el.style.setProperty('--fp', '1'); return; }
    let raf = 0;
    let done = false;
    const tick = () => {
      raf = 0;
      if (done) return;
      const r = el.getBoundingClientRect();
      const h = innerHeight;
      // 0 when the section's top meets the bottom of the screen, 1 when it reaches 35% from the top
      const p = Math.min(1, Math.max(0, (h - r.top) / (h * 0.65)));
      el.style.setProperty('--fp', p.toFixed(3));
      if (p >= 1) { done = true; el.dataset.in = 'true'; removeEventListener('scroll', on); }
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(tick); };
    tick();
    addEventListener('scroll', on, { passive: true });
    return () => { removeEventListener('scroll', on); cancelAnimationFrame(raf); };
  }, []);
  return (
    <div ref={ref} className={'xlb-fp ' + className} data-ent="focus" {...rest}>
      <div className="xlb-fp-field" aria-hidden="true">{field}</div>
      <div className="xlb-fp-subj">{children}</div>
    </div>
  );
}
