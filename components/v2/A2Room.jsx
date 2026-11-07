'use client';
/* A2Room — a black room that enters as a rounded card inside the gutters and opens to full width as it is reached
   (Apps 2 chat; MASTER.md 3.1 "Rooms"). Usage: <A2Room className="my-dark" aria-labelledby="h">…</A2Room>
   It is a <section data-room="dark"> (the header turns dark over it); the opening is a clip-path tied to scroll, so
   nothing reflows. Phones, reduced motion and no JavaScript see it open. At most two per page, never back to back. */
import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import useNarrow from './A2Narrow';

export default function A2Room({ className = '', children, ...rest }) {
  const ref = useRef(null);
  const calm = useReducedMotion();
  const narrow = useNarrow();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start end', 'start 0.25'] });
  const clip = useTransform(p, (v) => {
    if (calm || narrow) return 'inset(0px 0px round 0px)';
    const k = 1 - Math.min(1, Math.max(0, v));
    const g = Math.round(k * 32), r = Math.round(k * 24);
    return `inset(0px ${g}px round ${r}px)`;
  });
  return (
    <motion.section ref={ref} className={'a2-dark ' + className} data-room="dark" style={{ clipPath: clip }} {...rest}>
      {children}
    </motion.section>
  );
}
