'use client';
/* /about's five section entrances (docs/MOTION-MAP.md), in page order:
     Why We Build → ink-spread · Track record → magnet-gather · Founders → squash-land ·
     Zen of Hanzo → letter-cascade · Open source & safety (the dark room) → accordion
   Each section carries data-enter="<name>"; the styles are in enter.css. One IntersectionObserver plays each once when
   its top has come a quarter of the screen into view. The start states only apply under main.xab-enter, a class added here after mount,
   so the server HTML (and JS off) shows everything at rest, and the markup is the same on server and client. A section
   already past or on screen when the page loads is marked played at once (no flash). Reduced motion: no class, no
   entrances, every section at rest. */
import { useEffect } from 'react';
import './enter.css';

export function useEntrances() {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const main = document.querySelector('main.xab');
    if (!main) return;
    const els = [...main.querySelectorAll('[data-enter]')];
    els.forEach((el) => { if (el.getBoundingClientRect().top < innerHeight * 0.75) el.classList.add('is-in'); });
    main.classList.add('xab-enter');
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    }), { threshold: 0, rootMargin: '0px 0px -25% 0px' }); // its top has come a quarter of the screen into view (tall sections too)
    els.forEach((el) => { if (!el.classList.contains('is-in')) io.observe(el); });
    return () => { io.disconnect(); main.classList.remove('xab-enter'); };
  }, []);
}
