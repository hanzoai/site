'use client';
/* Settle: the Stage. The hero object arrives large and low, then settles into its place as you scroll the first
   screen away, so the camera feel comes from scale, position and clip only.
   Usage: <Settle from={1.14} lift={80}><YourHeroObject /></Settle>
   - from: starting scale; lift: starting offset in px (it rises by this much); span: px of scroll it takes (default 0.7 screen).
   - Phones get a gentler move (half the scale change). Reduced motion: it sits in its final place.
   Owned by the Business 2 chat. */
import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';

export default function Settle({ children, from = 1.14, lift = 80, span, className = '' }) {
  const ref = useRef(null);
  const calm = useReducedMotion();
  const [h, setH] = useState(800);
  const [phone, setPhone] = useState(false);
  useEffect(() => {
    const on = () => { setH(innerHeight); setPhone(innerWidth < 900); };
    on();
    addEventListener('resize', on);
    return () => removeEventListener('resize', on);
  }, []);
  const { scrollY } = useScroll();
  const end = span || h * 0.7;
  const f = phone ? 1 + (from - 1) / 2 : from;
  const scale = useTransform(scrollY, [0, end], [f, 1], { clamp: true });
  const y = useTransform(scrollY, [0, end], [lift, 0], { clamp: true });
  if (calm) return <div className={'w2-settle ' + className}>{children}</div>;
  return (
    <motion.div ref={ref} className={'w2-settle ' + className} style={{ scale, y, transformOrigin: '50% 0%' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}>
      {children}
    </motion.div>
  );
}
