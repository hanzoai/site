'use client';
/* /philosophy entrances (docs/MOTION-MAP.md row /philosophy, in page order): typewriter (the laws heading), venetian-type
   (the premise sentence), fold-out (the 64 patterns' view), invert-flash (the method ring), side-carousel (the stack
   rows). Styles in ./enter.css, keyed by data-enter.
   One IntersectionObserver marks each [data-enter] with data-in once a quarter of it (or a quarter of the screen) is in
   view, then data-done when its entrance has played, so later re-renders never replay it. Only children or
   pseudo-elements of the observed element take a start state, never the element itself, so it is always measurable.
   Start states live in enter.css under html.js and prefers-reduced-motion: no-preference: the server HTML, JS off and
   reduced motion all show the final page, and the markup is identical on server and client. */
import { useEffect } from 'react';

export function useEnter(rootSel) {
  useEffect(() => {
    const root = document.querySelector(rootSel);
    if (!root) return undefined;
    const els = [...root.querySelectorAll('[data-enter]')];
    const timers = [];
    const play = (el) => { el.dataset.in = ''; timers.push(setTimeout(() => { el.dataset.done = ''; }, 1800)); };
    if (typeof IntersectionObserver === 'undefined' || matchMedia('(prefers-reduced-motion: reduce)').matches) { els.forEach(play); return undefined; }
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (!e.isIntersecting) return;
        if (e.intersectionRatio >= 0.25 || e.intersectionRect.height >= innerHeight * 0.25) { play(e.target); io.unobserve(e.target); }
      });
    }, { threshold: [0, 0.1, 0.25, 0.5] });
    els.forEach((el) => io.observe(el));
    return () => { io.disconnect(); timers.forEach(clearTimeout); };
  }, [rootSel]);
}
