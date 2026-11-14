'use client';
/* The page's own entrances (docs/MOTION-MAP.md rule 7): each main section arrives a different way. This hook only
   marks the section: data-e="pre" once mounted (never on the server, so JS off and the first paint read the final
   state), then data-e="in" when it reaches the screen; ZenCatalog.css holds each section's own motion. Under reduced
   motion nothing is marked, so every section simply shows its final state. */
import { useEffect } from 'react';
import type { RefObject } from 'react';

// the last pointer or tap position on screen, for the entrances that start from the cursor (lens, grid wave)
export const ptr = { x: 0, y: 0, seen: false, touch: false };
let bound = false;
const bind = () => {
  if (bound) return;
  bound = true;
  const at = (e: PointerEvent) => { ptr.x = e.clientX; ptr.y = e.clientY; ptr.seen = true; ptr.touch = e.pointerType === 'touch'; };
  addEventListener('pointermove', at, { passive: true });
  addEventListener('pointerdown', at, { passive: true });
};

/* the point an entrance starts from, in the element's own box: the pointer when it is over the element, else its
   centre (touch, keyboard, or a pointer elsewhere) */
export function origin(el: Element) {
  const r = el.getBoundingClientRect();
  const over = ptr.seen && !ptr.touch && ptr.x >= r.left && ptr.x <= r.right && ptr.y >= r.top && ptr.y <= r.bottom;
  return over ? { x: ptr.x - r.left, y: ptr.y - r.top, over } : { x: r.width / 2, y: Math.min(r.height / 2, innerHeight / 2), over };
}

export function useEnter(ref: RefObject<Element | null>, onIn?: (el: Element) => void) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    bind();
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    el.setAttribute('data-e', 'pre');
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      onIn?.(el);
      // two frames: the pre state is painted before the section moves to its final state
      raf = requestAnimationFrame(() => { raf = requestAnimationFrame(() => el.setAttribute('data-e', 'in')); });
    }, { rootMargin: '0px 0px -18% 0px' });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
