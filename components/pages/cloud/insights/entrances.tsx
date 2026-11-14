'use client';
/* Insights' five section entrances (Motion map rule 7), in page order:
   1 hero        pendulum        the rollout card swings in from a pivot above it and settles (CSS only, plays at first paint)
   2 tour        fold-out        the heading and the window unfold like paper from a top hinge (rotateX)
   3 statement   snap-sections   "Start with autocapture" snaps in as one screen, hard in and hard stop
   4 paste       opposite-drift  the prompt card and its words drift in from opposite sides with the scroll, then hold
   5 dark room   squash-land     the code and the app it flips drop in and land with a squash and stretch
   Each plays once. The start pose lives in entrances.css under @media (scripting: enabled) and
   (prefers-reduced-motion: no-preference), so with JavaScript off or reduced motion every section simply sits in its
   final place. Transform, opacity and clip-path only: nothing here changes layout. */
import { useEffect, useRef } from 'react';
import './entrances.css';

const calm = () => typeof matchMedia === 'undefined' || matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Arrival: sets data-go on the section the first time it crosses into the lower part of the screen. An attribute, not a
   class, so React re-rendering the section's className never takes it away. */
export function useArrive<T extends HTMLElement = HTMLElement>(margin = '0px 0px -16% 0px') {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (calm()) { el.setAttribute('data-go', ''); return; }
    const io = new IntersectionObserver((es) => {
      if (es.some((e) => e.isIntersecting)) { el.setAttribute('data-go', ''); io.disconnect(); }
    }, { rootMargin: margin });
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);
  return ref;
}

/* opposite-drift: the two halves (found by selector inside the section) sit pushed apart in opposite directions and
   come together as the section scrolls up; once they meet they stay met (it plays once). */
export function useDrift<T extends HTMLElement = HTMLElement>(selA: string, selB: string) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || calm()) return;
    const a = el.querySelector<HTMLElement>(selA), b = el.querySelector<HTMLElement>(selB);
    if (!a || !b) return;
    let raf = 0, done = false;
    const put = (k: number) => {

      const wide = innerWidth >= 900;
      const x = (wide ? 72 : 40) * k, y = (wide ? 48 : 0) * k;
      a.style.transform = k ? `translate3d(${-x}px, ${y}px, 0)` : '';
      b.style.transform = k ? `translate3d(${x}px, ${-y}px, 0)` : '';
      a.style.opacity = b.style.opacity = k ? String(1 - k * 0.6) : '';
    };
    const tick = () => {
      raf = 0;
      if (done) return;
      const r = el.getBoundingClientRect(), vh = innerHeight;
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.62)));
      const e = 1 - Math.pow(1 - p, 3);
      put(1 - e);
      if (p >= 1) { done = true; off(); }
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(tick); };
    const off = () => { removeEventListener('scroll', on); removeEventListener('resize', on); };
    addEventListener('scroll', on, { passive: true });
    addEventListener('resize', on);
    tick();
    return () => { off(); cancelAnimationFrame(raf); put(0); };
  }, [selA, selB]);
  return ref;
}
