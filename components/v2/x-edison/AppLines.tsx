'use client';
/* Kinetic type for the Apps 1 pages (owned by the Apps 1 chat): a headline whose lines rise out of their own masks, once.
   Usage: <Lines as="h1" className="av-display" lines={['One API for', 'models, agents', 'and tools']} now />
   - lines: the headline split where you want it to break (the words are Hanzo's; the spaces between lines stay in the text);
   - now: play on mount (heroes); otherwise it plays when half of it is on screen;
   - delay: seconds before the first line. Reduced motion shows the lines in place. Transform only. */
import { useRef, type ReactNode } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';

const EASE = [0.16, 1, 0.3, 1] as const;

interface LinesProps {
  lines: ReactNode[];
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  className?: string;
  now?: boolean;
  delay?: number;
  id?: string;
}

export default function Lines({ lines, as = 'h2', className = '', now = false, delay = 0, id }: LinesProps) {
  const ref = useRef<HTMLHeadingElement>(null);
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
            transition={{ duration: 0.7, ease: EASE, delay: delay + i * 0.06 }}
          >
            {l}{i < lines.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
