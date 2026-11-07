'use client';
/* LineReveal: v2 kinetic type (docs/VISION.md, motion 4), owned by the Wave 2 Programs chat.
   Each line of a headline rises out of its own mask, once, 90 ms apart. The words are in the HTML from the server;
   reduced motion shows them in place (MotionConfig reducedMotion="user").
   Usage: <LineReveal as="h1" className="xp-display" lines={['Refer customers', 'to Hanzo']} />
   - onView: play when it scrolls into view (default: on arrival, for a hero);
   - delay: seconds before the first line. Needs components/v2/ProgramScale.css for the .xp-l masks. */
import { useRef } from 'react';
import { motion, useInView } from 'motion/react';

const EASE = [0.16, 1, 0.3, 1];

export default function LineReveal({ lines, as = 'h2', className = '', id, delay = 0, onView = false }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.5 });
  const go = onView ? seen : true;
  const Tag = as;
  return (
    <Tag ref={ref} id={id} className={className}>
      {lines.map((l, i) => (
        <span className="xp-l" key={i}>
          <motion.span initial={{ y: '108%' }} animate={go ? { y: '0%' } : { y: '108%' }} transition={{ duration: 1.05, ease: EASE, delay: delay + i * 0.09 }}>{l}</motion.span>
        </span>
      ))}
    </Tag>
  );
}
