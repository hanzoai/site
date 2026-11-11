'use client';
/* /beta's page-local entrance observer: plays once at 25% in view by setting data-in. Start states hide only under
   html.js and without reduced motion, so server HTML, JS off and reduced motion all show the final page. */
import { useEffect, type RefObject } from 'react';

const calm = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

export function useEnter(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const els = [...root.querySelectorAll<HTMLElement>('[data-enter]')];
    if (calm() || typeof IntersectionObserver !== 'function') {
      els.forEach((e) => { e.dataset.in = ''; });
      return;
    }
    const io = new IntersectionObserver((list) => list.forEach((e) => {
      if (!e.isIntersecting) return;
      (e.target as HTMLElement).dataset.in = '';
      io.unobserve(e.target);
    }), { threshold: 0.2 });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [ref]);
}
