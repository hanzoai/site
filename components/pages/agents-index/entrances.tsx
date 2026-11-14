'use client';
/* /agents: the five ways its sections enter the screen (docs/MOTION-MAP.md), page-local.
   <Enter move="..."> marks itself data-in once its top is 30% up the screen (IntersectionObserver, once); the CSS in
   entrances.css plays the move on the children that carry the move's part class:
     squash-land     .agx-land  falls in, squashes on landing, stretches back and settles
     ripple          .agx-rip   rings spread from the centre; the content opens behind them in a circle
     venetian-type   .agx-v     each line slides in from alternating sides (--s: -1 left, 1 right)
     grow-from-point .agx-g     grows out of the point the visitor last clicked or pointed at
     stretch-scroll  .agx-st    lands stretched and relaxes; after that it stretches with scroll speed and relaxes again
   The hidden first state lives only under html.js and no-preference motion: JS off and reduced motion read it whole. */
import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import './entrances.css';

const RM = '(prefers-reduced-motion: reduce)';
let last = null;
let bound = false;
function track() {
  if (bound || typeof window === 'undefined') return;
  bound = true;
  const f = (e: PointerEvent) => { last = { x: e.clientX, y: e.clientY }; };
  addEventListener('pointerdown', f, { passive: true, capture: true });
  addEventListener('pointermove', f, { passive: true });
}

// after the landing: the row stretches with scroll speed and relaxes when the scroll stops
function stretch(el: never) {
  let y = scrollY, t = performance.now(), want = 1, s = 1, raf = 0;
  const frame = () => {
    s += (want - s) * 0.22;
    want = 1 + (want - 1) * 0.86;
    el.style.setProperty('--st', s.toFixed(4));
    raf = Math.abs(s - 1) > 0.001 || want > 1.001 ? requestAnimationFrame(frame) : 0;
    if (!raf) el.style.setProperty('--st', '1');
  };
  const on = () => {
    const now = performance.now(), dy = Math.abs(scrollY - y), dt = Math.max(8, now - t);
    y = scrollY; t = now;
    want = Math.max(want, 1 + Math.min(0.22, (dy / dt) * 0.07));
    if (!raf) raf = requestAnimationFrame(frame);
  };
  addEventListener('scroll', on, { passive: true });
  return () => { removeEventListener('scroll', on); cancelAnimationFrame(raf); };
}

interface EnterProps {
  as?: string;
  move: string;
  className?: string;
  children: ReactNode;
  [key: string]: unknown;
}
export function Enter({ as: T = 'div', move, className = '', children, ...rest }: EnterProps) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (move === 'grow-from-point') track();
    let off = () => {}, timer = 0;
    const io = new IntersectionObserver((es) => {
      if (!es.some((e) => e.isIntersecting)) return;
      io.disconnect();
      if (move === 'grow-from-point') {
        const r = el.getBoundingClientRect();
        const p = last ?? { x: innerWidth / 2, y: innerHeight * 0.7 };
        const x = p.x - r.left, y = p.y - r.top;
        const far = Math.max(...[[0, 0], [r.width, 0], [0, r.height], [r.width, r.height]].map(([a, b]) => Math.hypot(a - x, b - y)));
        el.style.setProperty('--gx', x + 'px');
        el.style.setProperty('--gy', y + 'px');
        el.style.setProperty('--gr', Math.ceil(far + 24) + 'px');
      }
      el.dataset.in = '';
      if (move === 'stretch-scroll' && !matchMedia(RM).matches) {
        timer = setTimeout(() => { el.dataset.done = ''; off = stretch(el); }, 1700);
      }
    }, { rootMargin: '0px 0px -30% 0px', threshold: 0 });
    io.observe(el);
    return () => { io.disconnect(); clearTimeout(timer); off(); };
  }, [move]);
  return <T ref={ref} className={`agx agx-${move} ${className}`} {...rest}>{children}</T>;
}

// venetian-type: the side and delay of line i
export const ven = (i: number, step = 28, cap = 30) => ({ '--s': i % 2 ? 1 : -1, '--d': Math.min(i, cap) * step + 'ms' });
