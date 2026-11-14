'use client';
/* /brand's five section entrances (docs/MOTION-MAP.md, in page order): pull-back, cursor-trail, spiral-in,
   curtain-rise, stretch-scroll. Mark a section with data-enter="<name>"; useEnter(rootRef) arms the root (adds
   .xbr-armed after mount, so the server HTML and JS-off show everything in place, and the markup never differs between
   server and client), then one IntersectionObserver plays each section once when about 25% of it is in view (adds .in).
   - cursor-trail: a trail of marks sweeps across the colour room as it opens, and afterwards follows a fine pointer
     across it (a pool of 14 dots, transform and opacity only).
   - stretch-scroll: once in, the section's [data-stretch] child stretches vertically with scroll speed and relaxes
     when the scroll stops (rAF only while scrolling and on screen).
   Reduced motion: nothing is armed, so every section is simply there. Page-local to /brand; styles in ./enter.css. */
import type React from 'react';
import { useEffect } from 'react';
import './enter.css';

function trail(sec: Element) {
  const layer = document.createElement('div');
  layer.className = 'xbr-trail';
  layer.setAttribute('aria-hidden', 'true');
  sec.appendChild(layer);
  const pool = Array.from({ length: 14 }, () => { const s = document.createElement('i'); layer.appendChild(s); return s; });
  let n = 0;
  const put = (x: number, y: number) => {
    const s = pool[n++ % pool.length];
    s.style.transform = `translate(${x}px, ${y}px)`;
    s.classList.remove('go'); void s.offsetWidth; s.classList.add('go'); // restart the fade
  };
  // the entrance: a sweep from the left edge across the room, leading the clip that opens it
  const r = sec.getBoundingClientRect();
  const t0 = performance.now(), dur = 900;
  const sweep = (now: number) => {
    const p = Math.min(1, (now - t0) / dur);
    const e = 1 - (1 - p) ** 3;
    put(e * r.width, r.height * (0.32 + Math.sin(e * Math.PI * 2) * 0.12));
    if (p < 1) requestAnimationFrame(sweep);
  };
  requestAnimationFrame(sweep);
  let last = 0;
  const move = (ev: PointerEvent) => {
    if (ev.pointerType !== 'mouse' && ev.pointerType !== 'pen') return;
    const now = performance.now(); if (now - last < 28) return; last = now;
    const b = sec.getBoundingClientRect();
    put(ev.clientX - b.left, ev.clientY - b.top);
  };
  sec.addEventListener('pointermove', move);
  return () => { sec.removeEventListener('pointermove', move); layer.remove(); };
}

function stretch(sec: Element) {
  const el = sec.querySelector<HTMLElement>('[data-stretch]') || (sec as HTMLElement); // a section is an HTML element
  let y = scrollY, s = 0, raf = 0, seen = true;
  const io = new IntersectionObserver(([en]) => { seen = en.isIntersecting; }, { threshold: 0 });
  io.observe(sec);
  const tick = () => {
    raf = 0;
    const v = scrollY - y; y = scrollY;
    const target = Math.min(0.14, Math.abs(v) * 0.004);
    s += (target - s) * 0.2;
    el.style.transform = s > 0.001 ? `scaleY(${(1 + s).toFixed(4)})` : '';
    if (s > 0.001 || Math.abs(v) > 0) raf = requestAnimationFrame(tick);
  };
  const onScroll = () => { if (seen && !raf) raf = requestAnimationFrame(tick); };
  addEventListener('scroll', onScroll, { passive: true });
  return () => { removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); io.disconnect(); el.style.transform = ''; };
}

export default function useEnter(root: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = root.current;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const secs = [...el.querySelectorAll<HTMLElement>('[data-enter]')];
    el.classList.add('xbr-armed');
    const undo: (() => void)[] = [];
    const io = new IntersectionObserver((list) => {
      for (const en of list) {
        // 25% of the section, or (for a section taller than four screens) half the screen filled by it
        if (!en.isIntersecting || (en.intersectionRatio < 0.25 && en.intersectionRect.height < innerHeight * 0.5)) continue;
        const s = en.target;
        io.unobserve(s);
        s.classList.add('in');
        const k = s.getAttribute('data-enter');
        if (k === 'cursor-trail') undo.push(trail(s));
        if (k === 'stretch-scroll') undo.push(stretch(s));
      }
    }, { threshold: Array.from({ length: 21 }, (_, i) => i / 20) }); // fine steps, so a tall section is re-checked as it fills the screen
    secs.forEach((s) => io.observe(s));
    return () => { io.disconnect(); undo.forEach((f) => f()); el.classList.remove('xbr-armed'); };
  }, [root]);
}
