'use client';
/* Operative's five section entrances (docs/MOTION-MAP.md rule 7), in page order: iris, accordion, zoom-through,
   deal, orbit-in. Each section plays its own once, when 20% of it is on screen.
   The server HTML is the final state: nothing is hidden until this hook has run, so JS off shows everything.
   After hydration a section that is still below the fold is set to `wait` (its hidden pose: transform, opacity or
   clip-path only, so nothing reflows), then to `in` when it arrives, which runs its keyframes once (fill backwards,
   so the finished section carries no leftover transform). Reduced motion never leaves the final state.
   Each watches its section, so a clip-path hidden pose (the iris) still has an area to intersect. */
import { useEffect, useRef, useState } from 'react';

export function useEnter(amount = 0.2) {
  const ref = useRef(null);
  const [state, setState] = useState('done');
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    const r = el.getBoundingClientRect();
    if (r.top < innerHeight * 0.9 && r.bottom > 0) return; // already on screen when the page woke: leave it be
    setState('wait');
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      setState('in');
      io.disconnect();
    }, { threshold: amount });
    io.observe(el.closest('section') || el); // the section, not the element: a clip-path hidden pose (the iris) has no area to intersect
    return () => io.disconnect();
  }, [amount]);
  return [ref, state];
}
