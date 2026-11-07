'use client';
/* LineMask: kinetic type, played once. Each line rises out of its own mask (VISION motion 4).
   Usage: <LineMask as="h1" className="lx-display" lines={['Hanzo', 'Metrics']} />  — plays on mount (a hero);
          <LineMask lines={[...]} inView />                                         — plays when first scrolled to.
   The whole sentence is in the HTML from the start; reduced motion shows it set. Owned by Cloud 3. */
import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import './LaunchType.css';

const EASE = [0.16, 1, 0.3, 1];

export default function LineMask({ lines, as = 'h2', className = '', delay = 0, inView = false, stagger = 0.09, ...rest }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.5 });
  const calm = useReducedMotion();
  const go = !inView || seen;
  const Tag = as;
  return (
    <Tag ref={ref} className={className} {...rest}>
      {lines.map((t, i) => (
        <span className="lx-line" key={i}>
          <motion.span
            initial={calm ? false : { y: '108%' }}
            animate={go ? { y: 0 } : undefined}
            transition={{ duration: 1.05, ease: EASE, delay: delay + i * stagger }}
          >{t}</motion.span>
        </span>
      ))}
    </Tag>
  );
}
