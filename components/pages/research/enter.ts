'use client';
/* /research entrances (docs/MOTION-MAP.md row /research, in page order): split-merge (the hero: the desk from the right,
   the words from the left, on CSS from first paint), focus-pull (the dark room: the statement comes into focus while its
   heading softens and returns), scramble (the glance: 19 / 6 / 5 decode out of scrambled digits), domino (the papers
   index: rows tip up into place one after another), diagonal-wipe (the specifications and the standards: a diagonal
   clip sweeps each in). Styles in ./enter.css, keyed by data-enter.
   One IntersectionObserver marks each [data-enter] with data-in once a quarter of it (or a quarter of the screen) is in
   view, then data-done when it has played, so filtering and re-renders never replay it. Only children take a start
   state, never the observed element, so it is always measurable. Start states live under html.js without reduced
   motion; the markup is identical on server and client, and the scramble is drawn through a data attribute over the
   real digits (which never change), so nothing React renders is touched. */
import { useEffect } from 'react';

const DG = '0123456789';
function scramble(el: HTMLElement, ms = 760) {
  const real = el.textContent ?? '';
  const t0 = performance.now();
  let last = 0;
  const step = (now: number) => {
    const e = now - t0;
    if (e >= ms) { delete el.dataset.fx; return; }
    if (now - last > 50) {
      last = now;
      el.dataset.fx = Array.from(real, (c, i) => (e >= (ms * 0.45) + (i / Math.max(1, real.length)) * ms * 0.4 ? c : /\d/.test(c) ? DG[(Math.random() * 10) | 0] : c)).join('');
    }
    requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

export function useEnter(rootSel: string) {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(rootSel);
    if (!root) return undefined;
    const els = [...root.querySelectorAll<HTMLElement>('[data-enter]')];
    const timers: ReturnType<typeof setTimeout>[] = [];
    const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const play = (el: HTMLElement) => {
      el.dataset.in = '';
      if (!calm && el.dataset.enter === 'scramble') el.querySelectorAll<HTMLElement>('.xrs-scr').forEach((x, i) => timers.push(setTimeout(() => scramble(x), i * 90)));
      timers.push(setTimeout(() => { el.dataset.done = ''; }, 1800));
    };
    if (typeof IntersectionObserver === 'undefined' || calm) { els.forEach(play); return undefined; }
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (!e.isIntersecting) return;
        if (e.intersectionRatio >= 0.25 || e.intersectionRect.height >= innerHeight * 0.25) { play(e.target as HTMLElement); io.unobserve(e.target); }
      });
    }, { threshold: [0, 0.1, 0.25, 0.5] });
    els.forEach((el) => io.observe(el));
    return () => { io.disconnect(); timers.forEach(clearTimeout); };
  }, [rootSel]);
}
