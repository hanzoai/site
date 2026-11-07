'use client';
/* /desktop's own fork of components/v2/x-edison/AppLines (shared, not edited): a headline whose lines rise out of their
   own masks, once. Two differences: the first render is the same on server and client whatever the motion setting
   (reduced motion only changes the transition to an instant one, so there is no hydration mismatch), and with JS off
   DesktopPage.css sets the lines in place (html:not(.js)). Transform only. */
import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';

const EASE = [0.16, 1, 0.3, 1];

export default function Lines({ lines, as = 'h2', className = '', now = false, delay = 0, id }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.5 });
  const calm = useReducedMotion();
  const go = now || seen || calm;
  const Tag = as;
  return (
    <Tag ref={ref} id={id} className={className}>
      {lines.map((l, i) => (
        <span key={i} className="av-ln" style={{ display: 'block', overflow: 'hidden', paddingBottom: '.08em', marginBottom: '-.08em' }}>
          <motion.span
            style={{ display: 'block' }}
            initial={{ y: '108%' }}
            animate={go ? { y: '0%' } : undefined}
            transition={calm ? { duration: 0 } : { duration: 0.7, ease: EASE, delay: delay + i * 0.06 }}
          >
            {l}{i < lines.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
