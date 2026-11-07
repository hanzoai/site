'use client';
/* /enterprise entrances (docs/MOTION-MAP.md): scramble, snap-sections, inertia-drag, diagonal-wipe, line-draw, in that
   page order. Page-local, each plays once when its section scrolls into view (IntersectionObserver). The server HTML is
   the final state; initial states exist only under html.js and prefers-reduced-motion: no-preference (enter.css), and
   reduced motion marks every section "in" at once. */
import { useEffect, useRef, useState } from 'react';
import './enter.css';

const calmNow = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

// true once the element has come into view (or at once under reduced motion)
export function useEnter(amount = 0.2) {
  const ref = useRef(null);
  const [inn, setIn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (calmNow() || typeof IntersectionObserver !== 'function') { setIn(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setIn(true); io.disconnect(); } }, { threshold: amount });
    io.observe(el);
    return () => io.disconnect();
  }, [amount]);
  return [ref, inn];
}

// a section that enters one way: k is the entrance name, used as the class xe-en-<k>
export function Enter({ k, as: T = 'section', className = '', amount, children, ...rest }) {
  const [ref, inn] = useEnter(amount);
  return <T ref={ref} className={`${className} xe-en xe-en-${k}${inn ? ' in' : ''}`} {...rest}>{children}</T>;
}

/* scramble: the characters scramble and decode into the words, left to right (about 700 ms). The real words stay in
   the layout (hidden while it runs) so nothing reflows; the scrambled copy lies over them, aria-hidden. */
const GLYPHS = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghkmnpqrstuvwxyz0123456789';
export function Scramble({ text, run, delay = 0, ms = 700 }) {
  const [out, setOut] = useState(null);
  useEffect(() => {
    if (!run || calmNow()) return;
    let raf = 0, t0 = 0, wait = setTimeout(() => {
      const step = (t) => {
        if (!t0) t0 = t;
        const p = Math.min(1, (t - t0) / ms);
        const done = Math.floor(p * text.length * 1.15 - text.length * 0.15);
        let s = '';
        for (let i = 0; i < text.length; i++) {
          const c = text[i];
          s += i <= done || c === ' ' || c === '.' ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
        setOut(p < 1 ? s : null);
        if (p < 1) raf = requestAnimationFrame(step);
      };
      setOut(text.replace(/[^ .]/g, () => GLYPHS[(Math.random() * GLYPHS.length) | 0]));
      raf = requestAnimationFrame(step);
    }, delay);
    return () => { clearTimeout(wait); cancelAnimationFrame(raf); };
  }, [run, text, delay, ms]);
  return (
    <span className={'xe-scr' + (out ? ' run' : '')}>
      <span className="xe-scr-t">{text}</span>
      {out ? <span className="xe-scr-o" aria-hidden="true">{out}</span> : null}
    </span>
  );
}
