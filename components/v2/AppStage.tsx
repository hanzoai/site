'use client';
/* Stage for the Apps 1 pages (owned by the Apps 1 chat): the hero object arrives big and settles into its place as you
   scroll, the Apple camera feel made from scale and position only.
   Usage: <Stage className="my-hero-obj" from="fill">{the product UI}</Stage>
   - from: "fill" (default) starts it edge to edge, as wide as the screen, then it settles to its own width (give the
     element a max width narrower than the page, e.g. 1180px); or a number (1.08 to 1.25) to start at that scale;
   - lift: px it rises while settling. Data attributes (data-morph-target …) pass through to the element.
   Phones and reduced motion show it settled. Transform only. */
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';

const EASE = [0.16, 1, 0.3, 1];

export default function Stage({ children, className = '', from = 'fill', lift = 60, ...rest }) {
  const ref = useRef(null);
  const calm = useReducedMotion();
  const [k, setK] = useState(typeof from === 'number' ? from : 1);
  useEffect(() => {
    const fit = () => {
      const el = ref.current; if (!el) return;
      if (innerWidth <= 900) return setK(1);
      if (typeof from === 'number') return setK(from);
      setK(Math.min(1.3, Math.max(1, (innerWidth - 8) / el.offsetWidth)));
    };
    fit(); addEventListener('resize', fit);
    return () => removeEventListener('resize', fit);
  }, [from]);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] });
  const scale = useTransform(scrollYProgress, [0.3, 1], [k, 1], { clamp: true });
  const y = useTransform(scrollYProgress, [0.3, 1], [k > 1 ? lift : 0, 0], { clamp: true });
  return (
    <motion.div
      ref={ref}
      className={className}
      style={calm ? undefined : { scale, y, transformOrigin: '50% 0%' }}
      initial={calm ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.9, ease: EASE, delay: 0.25 }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
