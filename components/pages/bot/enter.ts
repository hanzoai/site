'use client';
/* /bot's five entrances (docs/MOTION-MAP.md, in page order): tile-flip (the ten workflows), ripple (each of the five
   "what a bot does" sections), grid-wave (the tools list), fold-out (install), grow-from-point (pricing).
   One IntersectionObserver plays each once when about a quarter of it is on screen.
   - The server and the first client render are identical: start states exist only under `.bt-en`, which this hook
     adds to <main> after mount (never under reduced motion), so JS off and reduced motion show everything at rest.
   - grid-wave and grow-from-point read where the visitor's pointer (or last tap) is. */
import type React from 'react';
import { useEffect } from 'react';
import './enter.css';

export default function useEntrances(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const main = ref.current;
    if (!main || matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    let px = innerWidth / 2, py = innerHeight / 2;
    const at = (e: PointerEvent) => { px = e.clientX; py = e.clientY; };
    addEventListener('pointermove', at, { passive: true });
    addEventListener('pointerdown', at, { passive: true });

    const items = [...main.querySelectorAll<HTMLElement>('[data-enter]')];
    // stagger indexes that do not depend on the pointer
    for (const el of items) {
      const kind = el.dataset.enter;
      if (kind === 'tile-flip') {
        const tiles = [...el.querySelectorAll<HTMLElement>('[data-tile]')];
        const cols = Math.max(1, Math.round((el.querySelector<HTMLElement>('[data-tiles]')?.offsetWidth ?? 0) / (tiles[0]?.offsetWidth || 1)) || 5);
        tiles.forEach((t, i) => t.style.setProperty('--k', String((i % cols) + Math.floor(i / cols))));
      }
    }
    const play = (el: HTMLElement) => {
      const kind = el.dataset.enter;
      const r = el.getBoundingClientRect();
      if (kind === 'grid-wave') {
        // each cell starts in turn by its distance from the pointer (or the middle of the screen)
        const cells = [...el.querySelectorAll<HTMLElement>('[data-cell]')].filter((c) => c.offsetParent);
        const ds = cells.map((c) => { const b = c.getBoundingClientRect(); return Math.hypot(b.left + b.width / 2 - px, b.top + b.height / 2 - py); });
        const min = Math.min(...ds);
        cells.forEach((c, i) => c.style.setProperty('--d', Math.round((ds[i] - min) * 0.9) + 'ms'));
      }
      if (kind === 'grow-from-point') {
        // grows out of the point the visitor last pointed at or tapped, clamped into the section
        const x = Math.min(Math.max(px - r.left, 0), r.width), y = Math.min(Math.max(py - r.top, 0), r.height);
        el.style.setProperty('--gx', Math.round(x) + 'px');
        el.style.setProperty('--gy', Math.round(y) + 'px');
      }
      el.classList.add('is-in');
    };
    main.classList.add('bt-en');
    const io = new IntersectionObserver((es) => {
      for (const e of es) if (e.isIntersecting) { io.unobserve(e.target); play(e.target as HTMLElement); }
    }, { threshold: 0.25 });
    // anything already on screen when this runs simply shows (no flash of a start state)
    for (const el of items) {
      const r = el.getBoundingClientRect();
      if (r.top < innerHeight * 0.85 && r.bottom > 0) el.classList.add('is-in', 'was-in');
      else io.observe(el);
    }
    return () => {
      io.disconnect();
      removeEventListener('pointermove', at);
      removeEventListener('pointerdown', at);
      main.classList.remove('bt-en');
    };
  }, [ref]);
}
