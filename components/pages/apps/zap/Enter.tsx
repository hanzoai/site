'use client';
/* /zap's five section entrances (docs/MOTION-MAP.md, in order): velocity-skew, page-curl, cursor-trail, drop-in,
   pendulum. Page-local, each its own build, never one shared reveal. Every section is complete in the server HTML and
   with JS off; an entrance arms only after hydration, only for a section still below the fold, and never under reduced
   motion (useArm). Transform, opacity and clip-path only. */
import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useVelocity } from 'motion/react';

/* rest (final state, server and JS off) → armed (hidden, waiting below the fold) → play (the entrance runs once) */
export function useArm(amount = 0.25) {
  const ref = useRef<HTMLDivElement>(null);
  const [s, setS] = useState<'rest' | 'armed' | 'play'>('rest');
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (el.getBoundingClientRect().top < innerHeight * 0.92) return; // already on screen: stays at rest
    setS('armed');
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setS('play'); io.disconnect(); } }, { threshold: amount });
    io.observe(el);
    return () => io.disconnect();
  }, [amount]);
  return [ref, s] as const;
}

/* 1 · velocity-skew: rises in leaning, then leans with the speed of the scroll and straightens when it stops */
interface VSkewProps {
  children: ReactNode;
  className?: string;
}
export function VSkew({ children, className = '' }: VSkewProps) {
  const [ref, s] = useArm(0.15);
  // reduced motion is read after mount, never during render, so the server and the first client render match
  const calm = useRef(true);
  useEffect(() => { calm.current = matchMedia('(prefers-reduced-motion: reduce)').matches; }, []);
  const { scrollY } = useScroll();
  const v = useVelocity(scrollY);
  const skewY = useTransform(v, (x: number) => (calm.current ? 0 : Math.max(-2.5, Math.min(2.5, -x / 1200))));
  return (
    <div ref={ref} className={'zp-e-skew ' + className} data-e={s}>
      <motion.div style={{ skewY, transformOrigin: '50% 0' }}>{children}</motion.div>
    </div>
  );
}

/* 2 · page-curl: the white page above curls away from its bottom-left corner and shows the room underneath */
interface CurlProps {
  children: ReactNode;
}
export function Curl({ children }: CurlProps) {
  const [ref, s] = useArm(0.3);
  return (
    <div ref={ref} className="zp-e-curl" data-e={s}>
      {children}
      <i className="zp-curl-page" aria-hidden="true" />
      <i className="zp-curl-fold" aria-hidden="true" />
    </div>
  );
}

/* 3 · cursor-trail: a trail runs across the room and the packets come in as it passes them; afterwards, on a fine
   pointer, the trail follows the cursor across the room. Touch screens get the one sweep only. */
interface TrailProps {
  children: ReactNode;
}
export function Trail({ children }: TrailProps) {
  const [ref, s] = useArm(0.2);
  const dots = useRef<(HTMLElement | null)[]>([]);
  const N = 10;
  useEffect(() => {
    const el = ref.current; if (!el) return;
    el.querySelectorAll<HTMLElement>('.zp-packets > li').forEach((li, i) => li.style.setProperty('--i', String(i)));
  }, [ref]);
  useEffect(() => {
    const el = ref.current; if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const pts = Array.from({ length: N }, () => ({ x: -40, y: 0 }));
    let tx = -40, ty = 0, raf = 0, until = 0, sweep = s === 'play' ? performance.now() : 0, shown = false;
    const draw = (t: number) => {
      const W = el.clientWidth, H = el.clientHeight;
      if (sweep) {
        const k = Math.min(1, (t - sweep) / 1300);
        tx = -40 + k * (W + 80); ty = H * (0.55 + 0.18 * Math.sin(k * Math.PI * 2));
        if (k >= 1) { sweep = 0; until = t + 500; }
      }
      pts.forEach((p, i) => { const a = i ? pts[i - 1] : { x: tx, y: ty }; const f = i ? 0.45 : 0.6; p.x += (a.x - p.x) * f; p.y += (a.y - p.y) * f; });
      dots.current.forEach((d, i) => { if (d) { d.style.transform = `translate3d(${pts[i].x}px, ${pts[i].y}px, 0) scale(${1 - i / (N + 2)})`; d.style.opacity = shown ? String(0.9 - i * 0.08) : '0'; } });
      if (sweep || t < until) { raf = requestAnimationFrame(draw); } else { shown = false; dots.current.forEach((d) => { if (d) d.style.opacity = '0'; }); raf = 0; }
    };
    const kick = () => { shown = true; if (!raf) raf = requestAnimationFrame(draw); };
    if (sweep) kick();
    const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
    const move = (e: PointerEvent) => { const r = el.getBoundingClientRect(); tx = e.clientX - r.left; ty = e.clientY - r.top; until = performance.now() + 450; kick(); };
    if (fine) el.addEventListener('pointermove', move);
    return () => { cancelAnimationFrame(raf); el.removeEventListener('pointermove', move); };
  }, [s, ref]);
  return (
    <div ref={ref} className="zp-e-trail" data-e={s}>
      {children}
      <span className="zp-trail" aria-hidden="true">{Array.from({ length: N }).map((_, i) => <i key={i} ref={(d) => { dots.current[i] = d; }} />)}</span>
    </div>
  );
}

/* 4 · drop-in: falls in from above and settles with a small bounce (eased keyframes, no spring) */
interface DropProps {
  children: ReactNode;
  className?: string;
}
export function Drop({ children, className = '' }: DropProps) {
  const [ref, s] = useArm(0.25);
  return <div ref={ref} className={'zp-e-drop ' + className} data-e={s}>{children}</div>;
}

/* 5 · pendulum: hangs from its top edge, swings in and settles */
interface SwingProps {
  children: ReactNode;
}
export function Swing({ children }: SwingProps) {
  const [ref, s] = useArm(0.3);
  return <div ref={ref} className="zp-e-swing" data-e={s}>{children}</div>;
}
