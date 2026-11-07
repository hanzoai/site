'use client';
/* The post's five entrances (docs/MOTION-MAP.md, /blog/*), each section its own way, in page order:
   1. pendulum        the hero's film card swings in from its top edge and settles (pure CSS from first paint, enter.css)
   2. typewriter      each chapter heading types itself out behind a caret
   3. grid-wave       the plate's facts (or, on a post with the Game of Life, its board) ripple in by distance from
                      the pointer (from the grid's top-left corner when there is no pointer)
   4. page-curl       each next-post card's cover curls away from its bottom-right corner to show the picture
   5. underline-sweep the closing line: an underline sweeps under each word in turn
   One IntersectionObserver plays each once when about a quarter is in view. Start states live only under
   main.xbg-enter, a class added on mount, so server HTML, JS off and reduced motion show everything at rest. */
import { useEffect } from 'react';

export function useEnter() {
  useEffect(() => {
    const main = document.querySelector('main.xbg');
    if (!main || typeof IntersectionObserver === 'undefined') return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let px = null, py = null;
    const track = (e) => { px = e.clientX; py = e.clientY; };
    addEventListener('pointermove', track, { passive: true });
    const timers = [];

    const type = (h) => {
      const text = h.textContent;
      const tw = document.createElement('span');
      tw.className = 'xbg-tw';
      tw.setAttribute('aria-hidden', 'true');
      h.appendChild(tw);
      h.dataset.typing = '';
      const per = Math.max(14, Math.min(36, 760 / text.length));
      let n = 0;
      const tick = () => {
        n += 1;
        tw.textContent = text.slice(0, n);
        if (n < text.length) timers.push(setTimeout(tick, per));
        else timers.push(setTimeout(() => { tw.remove(); delete h.dataset.typing; }, 420));
      };
      tick();
    };
    const wave = (g) => {
      const r = g.getBoundingClientRect();
      const ox = px ?? r.left, oy = py ?? r.top;
      const kids = [...g.children];
      const far = Math.max(1, ...kids.map((k) => { const b = k.getBoundingClientRect(); return Math.hypot(b.left + b.width / 2 - ox, b.top + b.height / 2 - oy); }));
      kids.forEach((k) => {
        const b = k.getBoundingClientRect();
        k.style.setProperty('--d', Math.round((Math.hypot(b.left + b.width / 2 - ox, b.top + b.height / 2 - oy) / far) * 520) + 'ms');
      });
      timers.push(setTimeout(() => { g.dataset.in = 'done'; kids.forEach((k) => k.style.removeProperty('--d')); }, 1400));
    };

    const io = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        io.unobserve(el);
        if (el.dataset.enter === 'grid-wave') wave(el);
        el.dataset.in = el.dataset.in || '1';
        if (el.dataset.enter === 'typewriter') type(el);
      });
    }, { threshold: 0.25 });
    const els = [...main.querySelectorAll('[data-enter]:not([data-enter="pendulum"])')];
    // anything already on screen at mount keeps its rest state (never hide what was being read)
    els.forEach((el) => { const b = el.getBoundingClientRect(); if (b.top < innerHeight && b.bottom > 0) el.dataset.in = 'done'; else io.observe(el); });
    main.classList.add('xbg-enter');
    return () => { io.disconnect(); removeEventListener('pointermove', track); timers.forEach(clearTimeout); main.classList.remove('xbg-enter'); };
  }, []);
}
