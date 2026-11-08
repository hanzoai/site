'use client';
/* /playground's own entrances (motion map, 7 Nov): each main section arrives its own way, once, as it enters view.
   useEnter(ref) arms a section after hydration (so JS off and the server HTML show the final state) and fires it the
   first time it is in view; reduced motion never arms. CSS in Playground.css keys off [data-enter=armed|in].
   useScramble(ref, selector, on): decodes each target's text from scrambled characters to Hanzo's words, left to right;
   drawn by a ::after overlay (data-scr), so the element's own text is always Hanzo's. */
import { useEffect, useState } from 'react';

export function useEnter(ref, amount = 0.25) {
  const [st, setSt] = useState(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setSt('armed');
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSt('in'); io.disconnect(); } }, { threshold: amount });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, amount]);
  return st;
}

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=<>/';
export function useScramble(ref, selector, on, ms = 1100) {
  // copy rule (8 Nov): the element's own text never changes; the scramble is drawn by ::after from data-scr over it
  useEffect(() => {
    if (!on) return;
    const els = [...(ref.current?.querySelectorAll(selector) || [])].filter((el) => el.textContent.trim());
    const finals = els.map((el) => el.textContent);
    let raf = 0;
    const t0 = performance.now();
    const done = () => els.forEach((el) => el.removeAttribute('data-scr'));
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / ms);
      if (p >= 1) return done();
      els.forEach((el, k) => {
        const f = finals[k], lit = Math.floor(f.length * Math.min(1, p * 1.15 - k * 0.04));
        let s = f.slice(0, Math.max(0, lit));
        for (let i = Math.max(0, lit); i < f.length; i++) s += f[i] === ' ' ? ' ' : GLYPHS[(Math.random() * GLYPHS.length) | 0];
        el.setAttribute('data-scr', s);
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); done(); };
  }, [ref, selector, on, ms]);
}
