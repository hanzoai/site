'use client';
/* /cli only: the five entrances (docs/MOTION-MAP.md: noise-dissolve, shutter, side-carousel, curtain-rise, cursor-trail),
   one per main section, in page order. Page-local by rule: never a shared reveal.
   <Enter kind="noise" as="section" className="…">…</Enter> adds `.in` once, when the element first scrolls into view
   (IntersectionObserver, play once). The initial states live in enter.css under `.js` only, so JS off and the server HTML
   show the final state; reduced motion shows the final state at once (CSS). Transform / opacity / clip-path / filter only. */
import type React from 'react';
import { forwardRef, useEffect, useRef, useState } from 'react';

interface EnterProps extends React.HTMLAttributes<HTMLElement> {
  kind: string;
  as?: 'div' | 'section';
  onIn?: () => void;
}
export const Enter = forwardRef<HTMLElement, EnterProps>(function Enter({ kind, as: Tag = 'div', className = '', onIn, children, ...rest }, outer) {
  const ref = useRef<HTMLElement | null>(null);
  const [inn, setIn] = useState(false);
  const cb = useRef(onIn);
  cb.current = onIn;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') { setIn(true); return; }
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      setIn(true); cb.current?.(); io.disconnect();
    }, { threshold: 0, rootMargin: '0px 0px -18% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const set = (el: HTMLElement | null) => { ref.current = el; if (typeof outer === 'function') outer(el); else if (outer) outer.current = el; };
  return <Tag ref={set} className={'cli-e ' + (inn ? 'in ' : '') + className} data-e={kind} {...rest}>{children}</Tag>;
});

/* cursor-trail: a short trail of terminal carets follows the pointer across the section. On arrival it runs once by itself
   (left to right, in step with the section's clip reveal), so phones and keyboards get the entrance too; afterwards it follows
   a fine pointer and fades when the pointer rests. Fixed-size, absolutely placed, transform and opacity only. */
const N = 9;
interface Point { x: number; y: number }
/* the run-once pass left to right when the section arrives */
interface Sweep { t0: number; dur: number; x0: number; x1: number; y: number; amp: number }
interface TrailProps {
  host: React.RefObject<HTMLElement | null>;
  run: boolean;
}
export function Trail({ host, run }: TrailProps) {
  const box = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = box.current, hostEl = host.current;
    if (!el || !hostEl) return;
    const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (calm) return;
    const dots = [...el.querySelectorAll<HTMLElement>('i')]; // the trail's carets
    const pts = dots.map(() => ({ x: -40, y: -40 }));
    let target: Point | null = null, raf = 0, idle = 0, last = performance.now(), auto: Sweep | null = null;
    const frame = (t: number) => {
      if (auto) {
        const p = Math.min(1, (t - auto.t0) / auto.dur), e = 1 - Math.pow(1 - p, 3);
        target = { x: auto.x0 + (auto.x1 - auto.x0) * e, y: auto.y + Math.sin(p * Math.PI * 2) * auto.amp };
        if (p >= 1) { auto = null; idle = t - 400; }
        last = t;
      }
      if (target) {
        const head = target;
        pts.forEach((pt, i) => {
          const lead = i === 0 ? head : pts[i - 1];
          const k = i === 0 ? 0.5 : 0.42;
          pt.x += (lead.x - pt.x) * k; pt.y += (lead.y - pt.y) * k;
          dots[i].style.transform = `translate3d(${pt.x}px, ${pt.y}px, 0)`;
        });
      }
      const resting = !auto && t - last > 700;
      el.style.opacity = resting ? '0' : '1';
      if (resting && t - last > 1400) { raf = 0; return; } // sleeps until the pointer moves again
      raf = requestAnimationFrame(frame);
    };
    const wake = () => { if (!raf) raf = requestAnimationFrame(frame); };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const r = hostEl.getBoundingClientRect();
      const p = { x: e.clientX - r.left, y: e.clientY - r.top };
      if (!target) pts.forEach((pt) => { pt.x = p.x; pt.y = p.y; });
      target = p; last = performance.now(); auto = null; wake();
    };
    hostEl.addEventListener('pointermove', move);
    if (run) {
      const r = hostEl.getBoundingClientRect();
      const y = Math.min(r.height * 0.32, 220);
      pts.forEach((pt) => { pt.x = -20; pt.y = y; });
      auto = { t0: performance.now(), dur: 1100, x0: -20, x1: r.width + 20, y, amp: 18 };
      wake();
    }
    return () => { hostEl.removeEventListener('pointermove', move); cancelAnimationFrame(raf); raf = 0; };
  }, [host, run]);
  return (
    <span className="cli-trail" ref={box} aria-hidden="true">
      {Array.from({ length: N }, (_, i) => <i key={i} style={{ '--k': i }} />)}
    </span>
  );
}
