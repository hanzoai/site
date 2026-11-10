'use client';
/* StageSettle (v2; owned by the Platform + Cloud chat). Apple's stage move for a hero object: it starts large and tipped
   back like a lid, and as the page scrolls it settles flat into its place. The camera feel comes from scale, rotateX
   and y only (one transform), so it holds 60fps. Reduced motion shows it settled.

   Usage:
     <StageSettle className="my-stage" over={560} from={{ rotateX: 20, scale: 1.06, y: 24 }}>{heroObject}</StageSettle>
   - over: how many pixels of scroll the settle takes (from the top of the page).
   - from: the starting pose; the end pose is always flat (0, 1, 0). */
import { motion, useScroll, useTransform } from 'motion/react';
import useCalm from './useCalm';

export default function StageSettle({ children, className = '', over = 560, from = {} }) {
  const calm = useCalm();
  const { scrollY } = useScroll();
  // computed in JS (a plain range map may be handed to the browser's scroll timeline, which can misread the range)
  const t = useTransform(scrollY, (v) => 1 - Math.min(1, Math.max(0, v / over)));
  const rotateX = useTransform(t, (k) => (from.rotateX ?? 18) * k);
  const scale = useTransform(t, (k) => 1 + ((from.scale ?? 1.05) - 1) * k);
  const y = useTransform(t, (k) => (from.y ?? 0) * k);
  return (
    <div className={'v2-stage ' + className} style={{ perspective: 1800, perspectiveOrigin: '50% 0%' }}>
      <motion.div style={calm ? undefined : { rotateX, scale, y, transformOrigin: '50% 100%' }}>{children}</motion.div>
    </div>
  );
}
