'use client';
/* /beta's page-local motion (docs/MOTION-MAP.md row /beta): the five entrances and the `stamp` signature.
   Entrances, in page order (styles in ./enter.css, keyed by data-enter):
     ripple    the product rail opens from its middle in a ring that runs on past it
     venetian  the hero's lines slide in from alternating sides
     zoom      Beta access flies in from far behind the screen
     orbit     Research access and Design partner swing into place on a curve
     curl      the white page peels from the bottom corner to show the dark close
   One IntersectionObserver plays each once at 25% in view by setting data-in. Start states are hidden only under
   html.js (set by the layout before first paint) and only without reduced motion, so the server HTML, JS off and
   reduced motion all show the final page, and the markup is the same on server and client. */
import { useEffect } from 'react';

const calm = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

export function useEnter(ref) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const els = [...root.querySelectorAll('[data-enter]')];
    if (calm() || typeof IntersectionObserver !== 'function') { els.forEach((e) => { e.dataset.in = ''; }); return; }
    const io = new IntersectionObserver((list) => list.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.dataset.in = '';
      io.unobserve(e.target);
    }), { threshold: 0.25 });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [ref]);
}

/* The signature: the card takes the blow (lifts, squashes, settles) while the pass's mark drops onto it with weight
   and settles at its angle; `done` runs once the mark has landed. Reduced motion: no movement, the mark is simply there. */
export function stamp(card, done) {
  const mark = card?.querySelector('.xbt-mark');
  if (!card || !mark || calm() || typeof card.animate !== 'function') { done(); return; }
  card.animate([
    { transform: 'none' },
    { transform: 'translateY(-6px) scale(1.012)', offset: 0.32 },
    { transform: 'translateY(4px) scale(1.014, .962)', offset: 0.58 },
    { transform: 'translateY(-1px) scale(.996, 1.006)', offset: 0.8 },
    { transform: 'none' },
  ], { duration: 460, easing: 'cubic-bezier(.3, 0, .2, 1)' });
  mark.animate([
    { opacity: 0, transform: 'translateY(-70px) scale(1.8) rotate(-2deg)' },
    { opacity: 1, transform: 'translateY(0) scale(.9) rotate(-11deg)', offset: 0.5 },
    { opacity: 1, transform: 'scale(1.05) rotate(-10deg)', offset: 0.72 },
    { opacity: 1, transform: 'scale(1) rotate(-10deg)' },
  ], { duration: 460, easing: 'cubic-bezier(.45, 0, .2, 1)' });
  setTimeout(done, 600);
}
