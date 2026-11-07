'use client';
/* Settle: the Stage. The hero object arrives large and low, then settles into its place as you scroll the first
   screen away, so the camera feel comes from scale, position and clip only.
   Usage: <Settle from={1.14} lift={80}><YourHeroObject /></Settle>
   - from: starting scale; lift: starting offset in px (it rises by this much); span: px of scroll it takes (default 0.7 screen).
   - bleed: px the scaled object may run past each side of the screen (default 0: the scale is capped so nothing is cut).
   - Phones get a gentler move (half the scale change). Reduced motion: it sits in its final place.
   Owned by the Business 2 chat. */
import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';

export default function Settle({ children, from = 1.14, lift = 80, span, bleed = 0, className = '' }) {
  const ref = useRef(null);
  const calm = useReducedMotion();
  const [h, setH] = useState(800);
  const [phone, setPhone] = useState(false);
  const [cap, setCap] = useState(from);
  useEffect(() => {
    const on = () => { setH(innerHeight); setPhone(innerWidth < 900); const w = ref.current?.offsetWidth; if (w) setCap((innerWidth + 2 * bleed) / w); };
    on();
    addEventListener('resize', on);
    return () => removeEventListener('resize', on);
  }, [bleed]);
  const { scrollY } = useScroll();
  const end = span || h * 0.7;
  const f = Math.max(1, Math.min(phone ? 1 + (from - 1) / 2 : from, cap));
  const scale = useTransform(scrollY, [0, end], [f, 1], { clamp: true });
  const y = useTransform(scrollY, [0, end], [lift, 0], { clamp: true });
  return (
    <motion.div ref={ref} className={'w2-settle ' + className} style={calm ? { scale: 1, y: 0 } : { scale, y, transformOrigin: '50% 0%' }}>
      {children}
    </motion.div>
  );
}
