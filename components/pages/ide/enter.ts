'use client';
/* /ide entrances (page-local; docs/MOTION-MAP.md). The server HTML is the final picture. After mount this hook marks
   each [data-enter] block with .ide-in once its top is a quarter of the way up the screen (IntersectionObserver, once),
   and enter.css plays that block's entrance. It also feeds the tilt-3d-hover cards (--rx, --ry) from the pointer, fine
   pointers only and never under reduced motion (checked here, after mount, never while rendering). */
import { useEffect } from 'react';

export default function useIdeEnter(root) {
  useEffect(() => {
    const el = root.current;
    if (!el) return undefined;
    const marks = [...el.querySelectorAll('[data-enter]')];
    const io = new IntersectionObserver((es) => {
      for (const e of es) if (e.isIntersecting) { e.target.classList.add('ide-in'); io.unobserve(e.target); }
    }, { rootMargin: '0px 0px -25% 0px', threshold: 0 });
    marks.forEach((m) => io.observe(m));
    const off = [];
    const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!calm && fine) {
      el.querySelectorAll('[data-enter="tilt-3d-hover"]').forEach((box) => {
        const cards = [...box.querySelectorAll('[data-tilt]')];
        const move = (ev) => {
          for (const c of cards) {
            const r = c.getBoundingClientRect();
            const x = Math.max(-1, Math.min(1, (ev.clientX - (r.left + r.width / 2)) / (r.width / 2 + 160)));
            const y = Math.max(-1, Math.min(1, (ev.clientY - (r.top + r.height / 2)) / (r.height / 2 + 160)));
            c.style.setProperty('--ry', (x * 2.5).toFixed(2) + 'deg');
            c.style.setProperty('--rx', (-y * 2.5).toFixed(2) + 'deg');
          }
        };
        const leave = () => cards.forEach((c) => { c.style.setProperty('--rx', '0deg'); c.style.setProperty('--ry', '0deg'); });
        box.addEventListener('pointermove', move, { passive: true });
        box.addEventListener('pointerleave', leave, { passive: true });
        off.push(() => { box.removeEventListener('pointermove', move); box.removeEventListener('pointerleave', leave); });
      });
    }
    return () => { io.disconnect(); off.forEach((f) => f()); };
  }, [root]);
}
