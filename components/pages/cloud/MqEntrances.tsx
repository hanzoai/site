'use client';
/* /mq's five section entrances (docs/MOTION-MAP.md, "Section entrances, in order"): shrink-to-card, iris, scramble,
   count-roll, cursor-lens. Page-local, one per section, each played once (or tied to leaving, for shrink-to-card).
   Every one renders its final state in the server HTML: a reader with JS off or with reduced motion sees the section
   whole, and none of them changes a box's size (transform, clip-path and opacity only), so nothing shifts. */
import { useEffect, useRef, useState } from 'react';
import type { ComponentProps, PointerEvent as ReactPointerEvent, ReactNode } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';

/* arms an entrance only after mount and only while its section is still below the fold, then plays it on arrival */
type Phase = 'idle' | 'armed' | 'play';
type SectionProps = ComponentProps<'section'>;

function useArrive(margin = '0px 0px -18% 0px') {
  const ref = useRef<HTMLElement>(null);
  const [st, setSt] = useState<Phase>('idle'); // idle (final, untouched) -> armed -> play
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (el.getBoundingClientRect().top < innerHeight * 0.82) return;
    setSt('armed');
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSt('play'); io.disconnect(); } }, { rootMargin: margin });
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);
  return [ref, st] as const;
}

/* 1. shrink-to-card: the quiet room the globe stands in shrinks into a rounded card as you leave it */
export function ShrinkToCard({ children, className = '', ...rest }: SectionProps) {
  const ref = useRef<HTMLElement>(null);
  const calm = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 0.85], [1, 0.9], { clamp: true });
  const r = useTransform(scrollYProgress, [0, 0.4], [0, 28], { clamp: true });
  const inset = useTransform(scrollYProgress, [0, 0.4], [0, 16], { clamp: true });
  const clip = useTransform([inset, r], ([i, v]) => `inset(0px ${i}px round ${v}px)`);
  return (
    <section ref={ref} className={'mq-shrink ' + className} {...rest}>
      <motion.div className="mq-shrink-bg" aria-hidden="true" style={calm ? undefined : { scale, clipPath: clip }} />
      <motion.div className="mq-shrink-in" style={calm ? undefined : { scale }}>{children}</motion.div>
    </section>
  );
}

/* 2. iris: a circular clip opens from the centre of the conveyor */
export function Iris({ children, className = '', ...rest }: SectionProps) {
  const [ref, st] = useArrive();
  const [done, setDone] = useState(false);
  return (
    <section ref={ref} className={'mq-iris ' + className} data-iris={done ? 'idle' : st} {...rest}>
      <div className="mq-iris-in" onTransitionEnd={(e) => e.propertyName === 'clip-path' && st === 'play' && setDone(true)}>{children}</div>
    </section>
  );
}

/* 3. scramble: the section's heading lines and fact titles decode out of scrambled characters. The real text keeps its
   box (hidden while it plays); the scramble is drawn over it, so no line ever moves. */
const GLYPHS = 'abcdefghijklmnopqrstuvwxyz#%&*+=/<>';
export function Scramble({ children, className = '', ...rest }: SectionProps) {
  const [ref, st] = useArrive('0px 0px -12% 0px');
  useEffect(() => {
    const el = ref.current;
    if (!el || st === 'idle') return;
    const items = [...el.querySelectorAll<HTMLElement>('.mq-scr')];
    const rnd = (t: string, k: number) => t.replace(/\S/g, (c) => (Math.random() < k ? GLYPHS[(Math.random() * GLYPHS.length) | 0] : c));
    items.forEach((s) => { s.dataset.on = ''; s.lastChild!.textContent = rnd(s.firstChild!.textContent!, 1); });
    if (st !== 'play') return;
    let raf = 0;
    const t0 = performance.now();
    const run = (now: number) => {
      let live = false;
      items.forEach((s, i) => {
        const text = s.firstChild!.textContent!;
        const p = Math.min(1, Math.max(0, (now - t0 - i * 70) / 650));
        if (p < 1) live = true;
        const n = Math.floor(p * text.length);
        s.lastChild!.textContent = text.slice(0, n) + rnd(text.slice(n), p < 1 ? 0.9 : 0);
        if (p >= 1) delete s.dataset.on;
      });
      if (live) raf = requestAnimationFrame(run);
    };
    raf = requestAnimationFrame(run);
    return () => { cancelAnimationFrame(raf); items.forEach((s) => delete s.dataset.on); };
  }, [st, ref]);
  return <section ref={ref} className={'mq-scramble ' + className} {...rest}>{children}</section>;
}
export const Scr = ({ children }: { children?: ReactNode }) => <span className="mq-scr"><span className="mq-scr-r">{children}</span><span className="mq-scr-f" aria-hidden="true" /></span>;

/* 4. count-roll: the free tier's figure rolls each digit up into its value, like a slot */
export function CountRoll({ children, className = '', ...rest }: SectionProps) {
  const [ref, st] = useArrive('0px 0px -20% 0px');
  return <section ref={ref} className={'mq-roll ' + className} data-roll={st} {...rest}>{children}</section>;
}
export function Roll({ value, className = '' }: { value: string; className?: string }) {
  return (
    <span className={'mq-rl ' + className} aria-hidden="true">
      {[...value].map((ch, i) => (/\d/.test(ch)
        ? <span key={i} className="mq-rl-d" style={{ '--d': 10 + Number(ch), '--i': i }}><span className="mq-rl-s">{'01234567890123456789'.split('').map((d, k) => <span key={k}>{d}</span>)}</span><span className="mq-rl-w">{ch}</span></span>
        : <span key={i} className="mq-rl-c" style={{ '--i': i }}>{ch}</span>))}
    </span>
  );
}

/* 5. cursor-lens: on arrival a round lens sweeps once across worker.ts, magnifying it; then it follows a fine pointer
   (on touch, a tap places it for a moment). The lens holds an inert copy of the code, scaled about the lens centre. */
export function CursorLens({ children, className = '', ...rest }: Omit<SectionProps, 'children'> & { children: (play: boolean) => ReactNode }) {
  const [ref, st] = useArrive('0px 0px -25% 0px');
  return <section ref={ref} className={'mq-lensroom ' + className} {...rest}>{children(st === 'play')}</section>;
}
export function Lens({ children: lens, play }: { children: ReactNode; play: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const glass = useRef<HTMLDivElement>(null);
  const [wd, setWd] = useState(0);
  useEffect(() => {
    const b = box.current;
    if (!b) return;
    const ro = new ResizeObserver(() => setWd(b.offsetWidth));
    ro.observe(b);
    return () => ro.disconnect();
  }, []);
  const place = (x: number, y: number, on: boolean) => {
    const g = glass.current;
    if (!g) return;
    g.style.setProperty('--x', x + 'px');
    g.style.setProperty('--y', y + 'px');
    g.dataset.on = on ? '1' : '0';
  };
  useEffect(() => {
    if (!play || !box.current) return;
    const b = box.current, W = b.offsetWidth, H = b.offsetHeight;
    let raf = 0;
    const t0 = performance.now();
    const run = (now: number) => {
      const p = Math.min(1, (now - t0) / 1800);
      const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      place(W * (0.12 + 0.76 * e), H * (0.36 + 0.22 * Math.sin(e * Math.PI)), p < 1);
      if (p < 1) raf = requestAnimationFrame(run);
    };
    raf = requestAnimationFrame(run);
    return () => cancelAnimationFrame(raf);
  }, [play]);
  const calmNow = () => typeof window !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || calmNow()) return;
    const r = box.current!.getBoundingClientRect();
    place(e.clientX - r.left, e.clientY - r.top, true);
  };
  const tapT = useRef<ReturnType<typeof setTimeout>>(undefined);
  const onDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' || calmNow()) return;
    const r = box.current!.getBoundingClientRect();

    place(e.clientX - r.left, e.clientY - r.top, true);
    clearTimeout(tapT.current);
    tapT.current = setTimeout(() => place(e.clientX - r.left, e.clientY - r.top, false), 1600);
  };
  return (
    <div ref={box} className="mq-lens-box" onPointerMove={onMove} onPointerLeave={() => place(0, 0, false)} onPointerDown={onDown}>
      {lens}
      <div ref={glass} className="mq-lens" data-on="0" aria-hidden="true">
        <div className="mq-lens-copy" inert style={{ width: wd || undefined }}>{lens}</div>
      </div>
    </div>
  );
}
