'use client';
/* /gui's own section entrances (docs/MOTION-MAP.md: split-merge, velocity-skew, domino, cursor-lens, grow-from-point).
   Page-local, never shared. Each section carries data-entrance="<name>"; the CSS in Gui.css draws the entrance.
   The server HTML is the final state: a section is only "armed" (put in its start state) by JS, after mount, when it is
   below the fold and motion is allowed, so JS off, reduced motion and hydration all show the finished page. */
import type React from 'react';
import { useEffect } from 'react';

const calm = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/* last point the visitor clicked or pointed at, in page coordinates (grow-from-point grows from it) */
const last: { x: number | null; y: number | null } = { x: null, y: null };
if (typeof window !== 'undefined') {
  const keep = (e: PointerEvent) => { last.x = e.pageX; last.y = e.pageY; };
  addEventListener('pointerdown', keep, { passive: true });
  addEventListener('pointermove', keep, { passive: true });
}

/* arms the section and plays its entrance once it is a quarter of the way into the screen */
export function useEnter<T extends HTMLElement>(ref: React.RefObject<T | null>, onIn?: (el: T) => void) {
  useEffect(() => {
    const el = ref.current;
    if (!el || calm()) return;
    const r = el.getBoundingClientRect();
    if (r.top < innerHeight * 0.75) return; // already on screen at load: leave it finished
    el.dataset.arm = '';
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      if (onIn) onIn(el);
      requestAnimationFrame(() => { el.dataset.in = ''; });
    }, { rootMargin: '0px 0px -25% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [ref]); // eslint-disable-line react-hooks/exhaustive-deps
}

/* grow-from-point: the section grows out of the last point clicked (or pointed at); with none, from its centre */
export function useGrowFromPoint(ref: React.RefObject<HTMLElement | null>) {
  useEnter(ref, (el) => {
    const b = el.getBoundingClientRect();
    const top = b.top + scrollY, left = b.left + scrollX;
    const x = last.x == null ? b.width / 2 : Math.max(0, Math.min(b.width, last.x - left));
    const y = last.y == null ? b.height / 2 : Math.max(0, Math.min(b.height, last.y - top));
    el.style.setProperty('--gx', x.toFixed(0) + 'px');
    el.style.setProperty('--gy', y.toFixed(0) + 'px');
  });
}

/* velocity-skew: the chapter list leans with the speed of the scroll (4deg at most) and straightens when it stops */
export function useVelocitySkew(ref: React.RefObject<HTMLOListElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el || calm()) return;
    let prev = scrollY, cur = 0, raf = 0, seen = false;
    const io = new IntersectionObserver(([e]) => { seen = e.isIntersecting; });
    io.observe(el);
    const tick = () => {
      const v = scrollY - prev; prev = scrollY;
      const target = Math.max(-4, Math.min(4, v * 0.12));
      cur += (target - cur) * 0.16;
      el.style.setProperty('--sk', cur.toFixed(3) + 'deg');
      if (Math.abs(cur) > 0.01 || Math.abs(target) > 0.01) raf = requestAnimationFrame(tick);
      else { el.style.setProperty('--sk', '0deg'); raf = 0; }
    };
    const onScroll = () => { if (seen && !raf) { prev = scrollY; raf = requestAnimationFrame(tick); } };
    addEventListener('scroll', onScroll, { passive: true });
    return () => { io.disconnect(); removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, [ref]);
}

/* cursor-lens: a ring follows a fine pointer over the platform cards and the card under it magnifies; on arrival the
   lens sweeps across the row once and each card resolves as it passes (touch gets the sweep only) */
export function useLens(ref: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el || calm() || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const cards = () => [...el.querySelectorAll(':scope .gu-plats > li')];
    const move = (e: PointerEvent) => {
      const b = el.getBoundingClientRect();
      el.style.setProperty('--lx', (e.clientX - b.left).toFixed(0) + 'px');
      el.style.setProperty('--ly', (e.clientY - b.top).toFixed(0) + 'px');
      el.dataset.lens = '';
      cards().forEach((li) => {
        const r = li.getBoundingClientRect();
        li.classList.toggle('gu-lensed', e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom);
      });
    };
    const leave = () => { delete el.dataset.lens; cards().forEach((li) => li.classList.remove('gu-lensed')); };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); };
  }, [ref]);
}
