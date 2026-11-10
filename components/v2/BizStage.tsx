'use client';
/* BizStage: the hero object starts huge and settles into its place as you scroll (VISION motion 2, "Stage").
   Owned by the Business 1 chat.
   Usage (in the first section of a page only, since it follows the page's own scroll from the top):
     <BizStage from={1.14} over={620} className="ld-stage"><YourProductUI /></BizStage>
   Over the first `over` pixels of scroll the object goes from `from` times its size (growing down from its top edge)
   to 1, and lifts by `lift` px into place. Transform only; reduced motion shows it settled. */
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import './Biz.css';

export default function BizStage({ children, from = 1.14, over = 620, lift = 60, className = '' }) {
  const calm = useReducedMotion();
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, over], [from, 1], { clamp: true });
  const y = useTransform(scrollY, [0, over], [lift, 0], { clamp: true });
  return (
    <div className={'bz-stage ' + className}>
      <motion.div className="bz-stage-in" style={calm ? undefined : { scale, y }}>{children}</motion.div>
    </div>
  );
}
