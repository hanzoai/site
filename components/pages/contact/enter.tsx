'use client';
/* /contact's five entrances (MOTION-MAP: tile-flip, focus-pull-scroll, tilt-3d-hover, spring-snap, vertical-ticker),
   page-local. Each section arrives its own way, once, when it scrolls into view: <Enter kind="..."> marks itself
   data-in when an IntersectionObserver first sees it, and enter.css plays that kind's keyframes. The hidden start
   states exist only under html.js and prefers-reduced-motion: no-preference, so JS off and reduced motion show the
   final state at once. Transform, opacity, clip-path and filter only. */
import { useEffect, useRef } from 'react';
import type { ElementType, ReactNode } from 'react';
import './enter.css';

type EnterProps = { kind?: string; as?: ElementType; className?: string; children?: ReactNode; [attr: string]: unknown };

export function Enter({ kind, as: Tag = 'div', className = '', children, ...rest }: EnterProps) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      el.setAttribute('data-in', '');
      io.disconnect();
    }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <Tag ref={ref} data-enter={kind} className={className} {...rest}>{children}</Tag>;
}

/* tile-flip: a 6×4 grid of page-white tiles over the patch panel flips away tile by tile (rotateY to 90°, by distance
   from the top-left), so the panel is formed out of flipping tiles. CSS only, on load (the hero is the first screen). */
export function Tiles({ cols = 6, rows = 4 }: { cols?: number; rows?: number }) {
  return (
    <span className="xcte-tiles" aria-hidden="true" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {Array.from({ length: cols * rows }, (_, k) => {
        const c = k % cols, r = Math.floor(k / cols);
        return <i key={k} style={{ '--d': (c + r) * 55 + 'ms' }} />;
      })}
    </span>
  );
}

/* tilt-3d-hover: after it has tilted in, the element leans toward a fine pointer (up to 7°) and levels out when it leaves. */
export function useTilt<T extends HTMLElement = HTMLElement>(max = 7) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !matchMedia('(hover: hover) and (pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty('--ry', (x * max * 2).toFixed(2) + 'deg');
      el.style.setProperty('--rx', (-y * max * 2).toFixed(2) + 'deg');
    };
    const leave = () => { el.style.setProperty('--ry', '0deg'); el.style.setProperty('--rx', '0deg'); };
    el.addEventListener('pointermove', move, { passive: true });
    el.addEventListener('pointerleave', leave);
    return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); };
  }, [max]);
  return ref;
}
