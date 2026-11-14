'use client';
/* Section entrances for /crawl, /dashboards, /datastore, /dns and /edge (docs/MOTION-MAP.md): each page's CSS names its
   own five ways in on [data-enter="…"]; this only arms and plays them. After mount, every [data-enter] still below the
   fold gets data-arm (its start state, CSS) and, on reaching ~85% of the screen, data-in (its animation). Anything
   already on screen, JS off and reduced motion stay in the final state. Attributes, not classes: React re-sets className.
   Also records the last pointer-down point as --hz-px/--hz-py on <html>, for grow-from-point entrances. */
import type React from 'react';
import { useEffect } from 'react';

export function useArrivals(root: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const main = root.current;
    if (!main || typeof IntersectionObserver === 'undefined' || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const els = [...main.querySelectorAll<HTMLElement>('[data-enter]')].filter((el) => el.getBoundingClientRect().top > innerHeight * 0.85);
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      const t = e.target as HTMLElement;
      const r = t.getBoundingClientRect();
      t.style.setProperty('--hz-ox', (((+(document.documentElement.dataset.hzPx ?? 0) || innerWidth / 2) - r.left) / r.width * 100).toFixed(1) + '%');
      t.setAttribute('data-in', '');
      io.unobserve(e.target);
    }), { rootMargin: '0px 0px -15% 0px' });
    els.forEach((el) => { el.setAttribute('data-arm', ''); io.observe(el); });
    const down = (e: PointerEvent) => { document.documentElement.dataset.hzPx = String(e.clientX); };
    addEventListener('pointerdown', down, { passive: true });
    return () => { io.disconnect(); removeEventListener('pointerdown', down); };
  }, [root]);
}
