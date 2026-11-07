'use client';
/* Kinetic type for the Apps 1 pages (owned by the Apps 1 chat): a headline whose lines rise out of their own masks, once.
   Usage: <Lines as="h1" className="av-display" lines={['One API for', 'models, agents', 'and tools']} now />
   - lines: the headline split where you want it to break (the words are Hanzo's; the spaces between lines stay in the text);
   - now: play on mount (heroes); otherwise it plays when half of it is on screen;
   - delay: seconds before the first line. Reduced motion shows the lines in place. Transform only. */
import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';

const EASE = [0.16, 1, 0.3, 1];

export default function Lines({ lines, as = 'h2', className = '', now = false, delay = 0, id }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.5 });
  const calm = useReducedMotion();
  const go = now || seen;
  const Tag = as;
  return (
    <Tag ref={ref} id={id} className={className}>
      {lines.map((l, i) => (
        <span key={i} className="av-ln" style={{ display: 'block', overflow: 'hidden', paddingBottom: '.08em', marginBottom: '-.08em' }}>
          <motion.span
            style={{ display: 'block' }}
            initial={calm ? false : { y: '108%' }}
            animate={go ? { y: '0%' } : undefined}
            transition={{ duration: 1.05, ease: EASE, delay: delay + i * 0.09 }}
          >
            {l}{i < lines.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
