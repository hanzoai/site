'use client';
/* /functions entrances (docs/MOTION-MAP.md, in page order): conveyor (the hero's life, CSS from first paint), split-merge
   (the chapters' handler.js — Kubernetes line), spring-snap (the chapter rail), tile-flip (the four use-case tiles),
   grow-from-point (the close, from where the visitor last pressed). Styles in enter.css. After mount every [data-enter]
   still below the fold gets data-arm (its start state) and, at ~85% of the screen, data-in (its animation). Anything
   already on screen, JS off and reduced motion stay in their final state. Attributes, not classes: React re-sets className. */
import { useEffect } from 'react';

export function useEntrances(root) {
  useEffect(() => {
    const main = root.current;
    if (!main || typeof IntersectionObserver === 'undefined' || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const els = [...main.querySelectorAll('[data-enter]')].filter((el) => el.getBoundingClientRect().top > innerHeight * 0.85);
    let px = innerWidth / 2, py = innerHeight / 2;
    const down = (e) => { px = e.clientX; py = e.clientY; };
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      const r = e.target.getBoundingClientRect();
      e.target.style.setProperty('--fn-ox', ((px - r.left) / r.width * 100).toFixed(1) + '%');
      e.target.style.setProperty('--fn-oy', ((py - r.top) / r.height * 100).toFixed(1) + '%');
      e.target.setAttribute('data-in', '');
      io.unobserve(e.target);
    }), { rootMargin: '0px 0px -15% 0px' });
    els.forEach((el) => { el.setAttribute('data-arm', ''); io.observe(el); });
    addEventListener('pointerdown', down, { passive: true });
    return () => { io.disconnect(); removeEventListener('pointerdown', down); els.forEach((el) => el.removeAttribute('data-arm')); };
  }, [root]);
}
