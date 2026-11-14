'use client';
/* SettleStage: the Stage move (VISION motion 2). The hero object arrives big, close to full-bleed and square-cornered,
   and settles into its place on the grid with 28px corners as you scroll, scale, lift and clip only.
   Usage: <SettleStage from={1.16} className="my-stage"><ProductUI /></SettleStage>
   - from: the starting scale (1.08–1.25 reads well); lift: px it starts lower; radius: the corners it settles to.
   - Put the live product object inside; it is the page's hero. Reduced motion shows it settled. Owned by Cloud 3. */
import { useRef, type HTMLAttributes } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import './LaunchType.css';
import './SettleStage.css';

interface SettleStageProps extends HTMLAttributes<HTMLDivElement> {
  from?: number;
  lift?: number;
  radius?: number;
}

export default function SettleStage({ children, from = 1.16, lift = 40, radius = 24, className = '', ...rest }: SettleStageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const calm = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 18%'] });
  const scale = useTransform(scrollYProgress, [0.25, 1], [from, 1], { clamp: true });
  const y = useTransform(scrollYProgress, [0.25, 1], [lift, 0], { clamp: true });
  const r = useTransform(scrollYProgress, [0.25, 0.9], [4, radius], { clamp: true });
  const clip = useTransform(r, (v) => `inset(0 round ${v}px)`);
  return (
    <div ref={ref} className={'lx-settle ' + className} {...rest}>
      <motion.div className="lx-settle-in" style={calm ? undefined : { scale, y }}>
        <motion.div className="lx-settle-clip" style={calm ? { clipPath: `inset(0 round ${radius}px)` } : { clipPath: clip }}>{children}</motion.div>
      </motion.div>
    </div>
  );
}
