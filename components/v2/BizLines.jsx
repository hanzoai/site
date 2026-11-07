'use client';
/* BizLines: kinetic type, line-masked, played once (VISION motion 4). Owned by the Business 1 chat.
   Usage: <BizLines as="h1" id="ld-h1" className="bz-display" lines={['Hanzo', 'Ledger']} />
   Each line rises out of its own mask, 70 ms apart. In the hero (now) it plays on load; elsewhere (inView) it plays
   the first time the heading is half on screen. Reduced motion: the words are simply there. The words are real text. */
import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { EASE } from '../ui';
import './Biz.css';

export default function BizLines({ lines, as = 'h2', className = '', delay = 0, now = false, id, style }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.5 });
  const calm = useReducedMotion();
  const go = now || seen;
  const Tag = as;
  return (
    <Tag ref={ref} id={id} className={className} style={style}>
      {lines.map((l, i) => (
        <span className="bz-line" key={i}>
          <motion.span initial={calm ? false : { y: '108%' }} animate={go || calm ? { y: 0 } : { y: '108%' }} transition={{ duration: 1.05, ease: EASE, delay: delay + i * 0.07 }}>{l}</motion.span>
        </span>
      ))}
    </Tag>
  );
}
