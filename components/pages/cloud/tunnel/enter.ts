'use client';
/* /tunnel only. useEnter: marks a section `data-in` the first time a share of it is on screen, so its own CSS entrance
   plays once. Each section on the page has a different entrance (Tunnel.css: noise-dissolve, explode-gather, count-roll,
   spiral-in, glitch-in); this hook only says "now". The hidden start states live under `html.js` and
   `prefers-reduced-motion: no-preference`, so JS off and reduced motion always show the final state. */
import { useEffect, useRef, useState } from 'react';

export function useEnter(amount = 0.18) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || on) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { threshold: amount });
    io.observe(el);
    return () => io.disconnect();
  }, [amount, on]);
  return [ref, on];
}

/* a small deterministic scatter, so the server and the browser draw the same fragments */
export const scatter = (i, k = 1) => {
  const a = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
  return a - Math.floor(a);
};
