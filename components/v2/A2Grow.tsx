'use client';
/* A2Grow — scale with rhythm (Apps 2 chat; MASTER.md 3.1 "Scale has rhythm"): a heading or figure rests at its deck
   size and grows only while it is the moment (its block crosses the middle of the screen), then settles back.
   Usage: <A2Grow to={1.6}><h2 className="a2-headline">…</h2></A2Grow>   (from = 1 by default; to < 1 shrinks instead)
   Transform only (origin left), so nothing reflows. Phones and reduced motion keep the resting size. */
import { useRef } from 'react';
import type { ReactNode } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import useNarrow from './A2Narrow';

interface A2GrowProps {
  to?: number;
  from?: number;
  origin?: string;
  className?: string;
  children?: ReactNode;
}

export default function A2Grow({ to = 1.6, from = 1, origin = '0% 50%', className = '', children }: A2GrowProps) {
  const ref = useRef<HTMLDivElement>(null);
  const calm = useReducedMotion();
  const narrow = useNarrow();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const scale = useTransform(p, (v) => {
    if (calm || narrow) return from;
    const k = Math.max(0, 1 - Math.abs(v - 0.5) / 0.32); // 0 at the edges, 1 in the middle of the screen
    const e = k * k * (3 - 2 * k);
    return from + (to - from) * e;
  });
  return <motion.div ref={ref} className={'a2-grow ' + className} style={{ scale, transformOrigin: origin }}>{children}</motion.div>;
}
