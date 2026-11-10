'use client';
/* /buying-specialist entrances (docs/MOTION-MAP.md row): its five main sections each arrive a different way, in order:
   1 count-roll   the hero quote sheet: members and prices roll up from zero into their values (useRollIn)
   2 rack-focus   promises 1-2: they pull into focus from a blur
   3 swing-door   promises 3-4: two doors swing in on vertical hinges
   4 tile-flip    promises 5-6: a grid of tiles flips over to form each card
   5 split-merge  the closing band: its headline's two halves slide in from both sides and merge
   One IntersectionObserver plays each once at ~25% in view by adding .in. The start states live in enter.css under
   html.js and prefers-reduced-motion: no-preference, so the server HTML, JS off and reduced motion all show the final
   state, and the markup is the same on server and client. */
import { useEffect, useState } from 'react';

export function useEnter(rootRef) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const els = [...root.querySelectorAll('[data-enter]')];
    if (typeof IntersectionObserver === 'undefined') { els.forEach((el) => el.classList.add('in')); return; }
    const io = new IntersectionObserver((es) => {
      for (const e of es) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }, { threshold: 0.25 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [rootRef]);
}

/* count-roll: the figure starts at zero and rolls to its value in ~10 steps over 700 ms once the element is 25% in
   view; afterwards it simply follows the value. Server HTML and reduced motion show the value itself. */
export function useRollIn(ref, value) {
  const [p, setP] = useState(null); // null = done (show the value)
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || typeof IntersectionObserver === 'undefined' || !ref.current) return;
    setP(0);
    let t = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const STEPS = 10;
      let k = 0;
      const tick = () => {
        k += 1;
        if (k >= STEPS) { setP(null); return; }
        setP(1 - Math.pow(1 - k / STEPS, 2.2)); // ease out: big steps first, then it settles
        t = setTimeout(tick, 70);
      };
      t = setTimeout(tick, 70);
    }, { threshold: 0.25 });
    io.observe(ref.current);
    return () => { io.disconnect(); clearTimeout(t); setP(null); };
  }, [ref]);
  return p === null ? value : Math.round(value * p);
}
