'use client';
/* /api entrances (MOTION-MAP row: line-draw, underline-sweep, invert-flash, shutter, swing-door), page-local.
   One IntersectionObserver marks each [data-enter] once with data-in when about a quarter of it (or a quarter of the
   screen) is in view; enter.css plays the entrance named by data-enter. The markup is identical on server and client:
   start states live in enter.css under html.js and prefers-reduced-motion: no-preference, so JS off and reduced motion
   show everything in its final state. */
import { useEffect } from 'react';

export function useEnter(rootSel) {
  useEffect(() => {
    const root = document.querySelector(rootSel);
    if (!root) return;
    const els = [...root.querySelectorAll('[data-enter]')];
    const timers = [];
    if (typeof IntersectionObserver === 'undefined') { els.forEach((el) => { el.dataset.in = ''; }); return; }
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (!e.isIntersecting) return;
        const h = e.intersectionRect.height;
        if (e.intersectionRatio >= 0.25 || h >= innerHeight * 0.25) {
          const el = e.target;
          el.dataset.in = '';
          io.unobserve(el);
          // once played, later content (a filtered row, say) appears at once, not through the entrance again
          timers.push(setTimeout(() => { el.dataset.done = ''; }, 1600));
        }
      });
    }, { threshold: [0, 0.1, 0.25, 0.5] });
    els.forEach((el) => io.observe(el));
    return () => { io.disconnect(); timers.forEach(clearTimeout); };
  }, [rootSel]);
}

/* line-draw: the card's outline, drawn by enter.css (one path length, dash offset 1 to 0), then the card fills */
export function Draw({ r = 16 }) {
  return (
    <svg className="api-draw" aria-hidden="true" focusable="false">
      <rect x="1" y="1" rx={r} ry={r} pathLength="1" />
    </svg>
  );
}
