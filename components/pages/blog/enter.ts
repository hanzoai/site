'use client';
/* /blog's five entrances (docs/MOTION-MAP.md row /blog), page-local. One IntersectionObserver plays each once, when its
   top is a quarter of the way up the screen; the looks live in enter.css, each different:
   1 ink-spread (the cover plate), 2 typewriter (the on-site posts' titles), 3 pendulum (the publishing strip),
   4 tilt-3d-hover (the contents list: it arrives leaning toward the pointer, and its rows lean toward a fine pointer),
   5 diagonal-wipe (the closing band).
   Start states are scoped to html.js (set before first paint whenever scripts run) and to no-preference motion, so the
   server HTML, JS-off and reduced-motion visitors always see everything. Markup is the same on server and client. */
import type React from 'react';
import { useEffect } from 'react';

export function useEnter(root: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const host = root.current;
    if (!host || typeof IntersectionObserver === 'undefined') return;
    const items = [...host.querySelectorAll<HTMLElement>('[data-enter]')];
    let px = innerWidth / 2;
    const track = (e: PointerEvent) => { px = e.clientX; };
    addEventListener('pointermove', track, { passive: true });
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      const t = e.target as HTMLElement;
      // the list arrives leaning toward wherever the pointer last was
      if (t.dataset.enter === 'tilt') t.style.setProperty('--tx', ((px / innerWidth - 0.5) * 24).toFixed(1) + 'deg');
      t.classList.add('in');
      io.unobserve(t);
    }), { rootMargin: '0px 0px -25% 0px', threshold: 0 });
    items.forEach((t) => io.observe(t));

    // tilt-3d-hover: each contents row leans up to 3 degrees toward a fine pointer, and settles when it leaves
    const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = matchMedia('(pointer: fine)').matches;
    const tilts = items.filter((t) => t.dataset.enter === 'tilt');
    const lean = (e: PointerEvent) => {
      const row = (e.target as Element).closest?.<HTMLElement>('.xbl-row'); if (!row) return;
      const r = row.getBoundingClientRect();
      row.style.setProperty('--hx', (((e.clientX - r.left) / r.width - 0.5) * 6).toFixed(2) + 'deg');
      row.style.setProperty('--hy', ((0.5 - (e.clientY - r.top) / r.height) * 6).toFixed(2) + 'deg');
    };
    const settle = (e: PointerEvent) => { const row = (e.target as Element).closest?.<HTMLElement>('.xbl-row'); if (row) { row.style.removeProperty('--hx'); row.style.removeProperty('--hy'); } };
    if (fine && !calm) tilts.forEach((t) => { t.addEventListener('pointermove', lean); t.addEventListener('pointerout', settle); });
    return () => {
      io.disconnect(); removeEventListener('pointermove', track);
      tilts.forEach((t) => { t.removeEventListener('pointermove', lean); t.removeEventListener('pointerout', settle); });
    };
  }, [root]);
}
