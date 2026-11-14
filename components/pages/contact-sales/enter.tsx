'use client';
/* /contact-sales entrances (docs/MOTION-MAP.md), page-local, each played once when its section scrolls into view:
   pendulum (the hero stage), accordion (the routes), grow-from-point (the inclusions, from your last pointer point),
   letter-cascade (the launches heading), text-mask-film (the closing Band's line). The initial states live only under
   html.js (JS off = the server HTML, every word visible); reduced motion shows the final state at once (enter.css). */
import { Fragment, useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import './enter.css';

// the last point the visitor clicked or moved the pointer to (viewport coordinates), for grow-from-point
const last = { x: -1, y: -1 };
let tracking = false;
function track() {
  if (tracking || typeof window === 'undefined') return;
  tracking = true;
  const note = (e: PointerEvent) => { last.x = e.clientX; last.y = e.clientY; };
  addEventListener('pointerdown', note, { passive: true });
  addEventListener('pointermove', note, { passive: true });
}

/* ref for an element that enters once: adds `in` when a quarter of it is on screen. For `grow`, the transform origin
   is first set to the visitor's last pointer point relative to the element (clamped to it; its top centre if none). */
export function useEnter<T extends HTMLElement = HTMLElement>(kind: string) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (kind === 'grow') track();
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      if (kind === 'grow') {
        const r = el.getBoundingClientRect();
        const x = last.x < 0 ? r.width / 2 : Math.min(r.width, Math.max(0, last.x - r.left));
        const y = last.y < 0 ? 0 : Math.min(r.height, Math.max(0, last.y - r.top));
        el.style.setProperty('--ox', x.toFixed(0) + 'px');
        el.style.setProperty('--oy', y.toFixed(0) + 'px');
      }
      el.classList.add('in');
    }, { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, [kind]);
  return ref;
}

/* letter-cascade: the same words, each letter in its own span (words never break inside) */
export function Letters({ text }: { text: string }) {
  let k = 0;
  return text.split(' ').map((w, i, all) => (
    <Fragment key={i}>
      <span className="xcs-word">{[...w].map((c) => <span key={k} className="xcs-ch" style={{ '--i': k++ }}>{c}</span>)}</span>
      {i < all.length - 1 ? ' ' : ''}
    </Fragment>
  ));
}

/* text-mask-film on the kit Band's line (a shared component, so it is marked from here, not edited) */
export function useFilm(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const h = root.current?.querySelector('.x-band h2');
    if (!h) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); h.classList.add('xcs-film'); } }, { threshold: 0.5 });
    io.observe(h);
    return () => io.disconnect();
  }, [root]);
}
