'use client';
/* Commerce's five section entrances (page-local, MOTION-MAP rule 7), in the map's order:
   scroll-tilt (the board), word-shuffle (Who takes the money), ripple (the black finder), cover-slide (the nouns),
   vertical-ticker (the spec sheet). Each runs once when its section first comes into view and leaves it in its
   normal state. The server HTML is the final state: the start state is applied only after mount, only to a section
   that is still below the fold, and never under reduced motion, so there is no hidden text and no hydration change.
   Movement is transform, clip-path and opacity only (CSS keyframes in Commerce.css under [data-enter]). */
import { useEffect, useRef } from 'react';

export function useEnter(kind: string) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    if (el.getBoundingClientRect().top < innerHeight * 0.9) return; // already on screen: stand still
    el.dataset.enter = kind + ' wait';
    let lastY = scrollY, lastT = performance.now(), v = 0;
    const onScroll = () => { const t = performance.now(); v = Math.abs(scrollY - lastY) / Math.max(1, t - lastT); lastY = scrollY; lastT = t; };
    addEventListener('scroll', onScroll, { passive: true });
    const done = () => { delete el.dataset.enter; el.style.removeProperty('--tilt'); };
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      removeEventListener('scroll', onScroll);
      el.style.setProperty('--tilt', Math.min(22, 8 + v * 6).toFixed(1) + 'deg'); // faster scroll, steeper tilt
      el.dataset.enter = kind + ' go';
      setTimeout(done, 1300);
    }, { threshold: 0.12 });
    io.observe(el);
    return () => { io.disconnect(); removeEventListener('scroll', onScroll); };
  }, [kind]);
  return ref;
}
