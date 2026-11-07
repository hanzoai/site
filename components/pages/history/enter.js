'use client';
/* /history, page-local motion (never shared). Two jobs, both after mount, so the server HTML is the final state:
   1. Entrances: every [data-enter] inside the page gets .xhi-in once, when its top is about a quarter into the screen
      (IntersectionObserver, once). history/enter.css plays that page's five entrances from that class.
   2. Words light up (Signature): every [data-wl] statement lights word by word as it is read. A passive scroll
      listener turns the statement's place on screen into a count and lights that many words (.lit on each word span,
      which the JSX renders, so no DOM rewrite). Wheel, trackpad, keys and touch scrolling all drive it; a press on a
      word lights the statement up to that word. Reduced motion and JS off show it lit (CSS). */
import { useEffect } from 'react';

export default function useHistoryEnter(root) {
  useEffect(() => {
    const box = root.current;
    if (!box) return undefined;
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('xhi-in');
      io.unobserve(e.target);
    }), { rootMargin: '0px 0px -25% 0px', threshold: 0 });
    box.querySelectorAll('[data-enter]').forEach((el) => io.observe(el));

    const lines = [...box.querySelectorAll('[data-wl]')].map((el) => ({ el, words: [...el.querySelectorAll('.xhi-w')], held: -1, shown: -1 }));
    let raf = 0;
    const paint = () => {
      raf = 0;
      const vh = innerHeight;
      lines.forEach((l) => {
        const r = l.el.getBoundingClientRect();
        // starts as the statement's top passes 85% of the screen, all lit by the time its bottom reaches 45%
        const p = Math.max(0, Math.min(1, (vh * 0.85 - r.top) / (r.height + vh * 0.4)));
        const n = Math.max(Math.round(p * l.words.length), l.held);
        if (n === l.shown) return;
        l.shown = n;
        l.words.forEach((w, i) => w.classList.toggle('lit', i < n));
      });
    };
    const ask = () => { if (!raf) raf = requestAnimationFrame(paint); };
    const press = (e) => {
      const w = e.target.closest?.('.xhi-w');
      const l = w && lines.find((x) => x.el.contains(w));
      if (!l) return;
      l.held = l.words.indexOf(w) + 1;
      ask();
    };
    paint();
    addEventListener('scroll', ask, { passive: true });
    addEventListener('resize', ask, { passive: true });
    box.addEventListener('pointerdown', press, { passive: true });
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      removeEventListener('scroll', ask);
      removeEventListener('resize', ask);
      box.removeEventListener('pointerdown', press);
    };
  }, [root]);
}
