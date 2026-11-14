'use client';
/* Ledger-local entrances (the motion map gives /ledger five, in order; built here, not shared with any other page).
   1 stack-drop    the hero book: pure CSS on load (Ledger.css, .ld-book layers), so it needs no hook here
   2 velocity-skew the calculator: useSkew, it leans with the scroll speed it arrived at and straightens when still
   3 spring-snap   the three steps: useEntrance + CSS (.ld-step[data-e]) snap in from the right and overshoot
   4 word-shuffle  the dark room: useShuffle, the heading's words and the three tabs land in the wrong slots, then swap
   5 inertia-drag  Get Ledger: useEntrance + Motion inertia in Ledger.jsx (thrown in, then draggable)
   Every one plays once. Server HTML and JS off: everything sits in its true place. Reduced motion, or a section that is
   already on screen (or above it) when the page runs: no entrance, the final layout at once. Transform/opacity only. */
import type React from 'react';
import { useEffect, useLayoutEffect, useState } from 'react';

const useIso = typeof window === 'undefined' ? useEffect : useLayoutEffect;
const calmNow = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
const below = (el: HTMLElement | HTMLLIElement) => el.getBoundingClientRect().top > innerHeight * 0.92;

/* 'off' -> nothing happens; 'armed' -> set down in its start pose (it is below the screen); 'go' -> it entered, plays once */
export function useEntrance(ref: React.RefObject<HTMLElement | null> | React.RefObject<HTMLLIElement | null>, inset = '-22%') {
  const [s, setS] = useState('off');
  useIso(() => {
    const el = ref.current;
    if (!el || calmNow() || !below(el)) return;
    setS('armed');
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setS('go'); io.disconnect(); } }, { rootMargin: `0px 0px ${inset} 0px` });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return s;
}

/* velocity-skew: while a scroll listener keeps the current speed, the section's [data-skew] pieces start leaning by the
   speed it came in at (never less than a readable 4deg), follow the speed while it is moving and ease back to straight
   once the scroll stops. Then the inline transform is removed, so the true layout is all that is left. */
export function useSkew(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = ref.current;
    if (!root || calmNow() || !below(root)) return;
    let y = scrollY, t = performance.now(), v = 0, raf = 0, done = false;
    const onScroll = () => {
      const now = performance.now(), dt = Math.max(8, now - t);
      v = v * 0.6 + ((scrollY - y) / dt) * 0.4; // px per ms, smoothed
      y = scrollY; t = now;
    };
    addEventListener('scroll', onScroll, { passive: true });
    const els = [...root.querySelectorAll('[data-skew]')];
    const clamp = (n: number) => Math.max(-9, Math.min(9, n));
    const run = () => {
      const start = performance.now();
      let skew = clamp(-v * 4.5);
      if (Math.abs(skew) < 4) skew = v < 0 ? 4 : -4;
      let still = 0;
      const tick = (now: number) => {
        if (now - t > 90) v *= 0.8; // no scroll event for a moment: the speed falls away
        const target = clamp(-v * 4.5);
        skew += (target - skew) * 0.09;
        still = Math.abs(skew) < 0.05 ? still + 1 : 0;
        els.forEach((el) => { el.style.transform = `skewY(${skew.toFixed(2)}deg)`; });
        if ((still > 6 && now - start > 500) || now - start > 3200) { els.forEach((el) => { el.style.transform = ''; }); done = true; return; }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting && !done) { io.disconnect(); run(); } }, { threshold: 0 });
    io.observe(root);
    return () => { io.disconnect(); cancelAnimationFrame(raf); removeEventListener('scroll', onScroll); els.forEach((el) => { el.style.transform = ''; }); };
  }, []);
}

/* word-shuffle: each group (the heading's words, the tab buttons) is set down in the wrong slots (word i sits where word
   i + half the group sits), invisible; on entering, the pieces appear one by one in a scrambled order, then all swap
   into their own places on a slight overshoot. Measured with no transforms on, so the end is exactly the layout. */
export function useShuffle(ref: React.RefObject<HTMLElement | null>, groups: string[]) {
  useIso(() => {
    const root = ref.current;
    if (!root || calmNow() || !below(root)) return;
    const sets = groups.map((sel) => [...root.querySelectorAll(sel)]).filter((g) => g.length > 1);
    const place = () => sets.forEach((g) => {
      const r = g.map((el) => el.getBoundingClientRect());
      const n = g.length, off = Math.ceil(n / 2);
      g.forEach((el, i) => {
        const j = (i + off) % n;
        el.style.transition = 'none';
        el.style.opacity = '0';
        el.style.transform = `translate(${(r[j].left - r[i].left).toFixed(1)}px, ${(r[j].top - r[i].top).toFixed(1)}px)`;
      });
    });
    place();
    const timers = [];
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      sets.forEach((g) => {
        const order = g.map((_, i) => i).sort((a, b) => ((a * 7 + 3) % g.length) - ((b * 7 + 3) % g.length));
        order.forEach((i, k) => timers.push(setTimeout(() => { g[i].style.transition = 'opacity .18s linear'; g[i].style.opacity = '1'; }, k * 90)));
        timers.push(setTimeout(() => g.forEach((el, i) => {
          el.style.transition = `transform .62s cubic-bezier(.34, 1.4, .5, 1) ${i * 40}ms, opacity .18s linear`;
          el.style.opacity = '1';
          el.style.transform = '';
        }), order.length * 90 + 260));
        timers.push(setTimeout(() => g.forEach((el) => { el.style.transition = ''; el.style.opacity = ''; }), order.length * 90 + 260 + 620 + g.length * 40 + 60));
      });
    }, { rootMargin: '0px 0px -30% 0px' });
    io.observe(root);
    return () => { io.disconnect(); timers.forEach(clearTimeout); sets.flat().forEach((el) => { el.style.transition = ''; el.style.opacity = ''; el.style.transform = ''; }); };
  }, []);
}
