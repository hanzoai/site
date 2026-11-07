'use client';
/* FamStage (Families A kit): the Stage hero object. The page's hero object (real product UI: a chart, a ledger, a
   terminal) starts big and close, and settles into its place as you scroll the first screen: scale and lift only, the
   camera feel comes from scale. Phones get half the zoom; reduced motion shows it settled.
   How to use it:
   - <FamStage className="my-hero-obj" from={1.12}>{object}</FamStage>; size the object with your own CSS;
   - from: the starting scale; span: how many px of scroll it takes to settle. */
import { useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useReducedMotion } from 'motion/react';

export default function FamStage({ children, className = '', from = 1.12, span = 520, as = 'div', ...rest }) {
  const calm = useReducedMotion();
  const { scrollY } = useScroll();
  const zoom = useMotionValue(from - 1); // the server and the first paint agree; a phone halves it after hydration
  // reduced motion settles it after hydration too, so the server's HTML and the first client render stay identical
  useEffect(() => { zoom.set(calm ? 0 : matchMedia('(max-width: 900px)').matches ? (from - 1) / 2 : from - 1); }, [from, zoom, calm]);
  const p = (v) => 1 - Math.min(1, Math.max(0, v / span));
  const scale = useTransform(() => 1 + zoom.get() * p(scrollY.get()));
  const y = useTransform(() => (zoom.get() * 600) * p(scrollY.get()));
  const Tag = motion[as];
  return (
    <Tag className={className} style={{ scale, y, transformOrigin: '50% 0%' }} {...rest}>
      {children}
    </Tag>
  );
}
