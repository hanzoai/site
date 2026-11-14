'use client';
/* The /models family's entrance triggers (docs/MOTION-MAP.md rule 7). Only the moment is shared here: each section's
   way of arriving is its own CSS (ModelsPage.css for /models, models.css for /models/*). Once per section, when its
   top passes 82% of the screen; reduced motion lands at once; with JavaScript off nothing waits (html:not(.js)). */
import { useEffect, useRef, useState } from 'react';

export const calmNow = () => typeof window !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/* [ref, in]: `in` turns true once the element enters view (true at once under reduced motion) */
export function useEnter<T extends HTMLElement = HTMLElement>(margin = '0px 0px -18% 0px') {
  const ref = useRef<T>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (calmNow()) { setOn(true); return undefined; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { rootMargin: margin });
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);
  return [ref, on] as const;
}

/* card-deal: a list's items wait in one deck on the first item's place, then are dealt out to their own places, one
   after another. Measured in the browser (any grid or rail); items past `max` only fade. data-deal drives the CSS. */
export function useDeal(max = 10) {
  const ref = useRef<HTMLUListElement>(null);
  useEffect(() => {
    const ul = ref.current;
    if (!ul || calmNow()) return undefined;
    ul.dataset.deal = 'wait';
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const items = ([...ul.children] as HTMLElement[]).filter((li) => !li.hidden);
      if (!items.length) { ul.dataset.deal = 'done'; return; }
      const a = items[0].getBoundingClientRect();
      items.forEach((li, i) => {
        const r = li.getBoundingClientRect();
        const far = i > max;
        li.style.setProperty('--dx', (far ? 0 : Math.round(a.left - r.left)) + 'px');
        li.style.setProperty('--dy', (far ? 24 : Math.round(a.top - r.top)) + 'px');
        li.style.setProperty('--i', String(Math.min(i, max)));
      });
      ul.dataset.deal = 'deck';
      void ul.offsetWidth;
      raf = requestAnimationFrame(() => { raf = requestAnimationFrame(() => { ul.dataset.deal = 'go'; }); });
      setTimeout(() => { ul.dataset.deal = 'done'; }, 700 + 70 * max + 200);
    }, { rootMargin: '0px 0px -15% 0px' });
    io.observe(ul);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [max]);
  return ref;
}
