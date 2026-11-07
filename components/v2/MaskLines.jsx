'use client';
/* MaskLines (components/v2, owned by the Wave 2 "Proof" chat). Kinetic type: each line of a heading rises out of its
   own mask, once, when the heading is reached (VISION.md motion 4, "line-masked reveals, played once").
   Usage:  <MaskLines as="h1" className="pf-display" lines={['Security', 'you can read.']} />
   - lines: the heading broken where it should break (12-18ch). The whole text is in the server HTML.
   - delay (s), amount (how much must be in view), id. Reduced motion: the final state, no movement. JS off: legible. */
import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import './ProofScale.css';

const EASE = [0.16, 1, 0.3, 1];

export default function MaskLines({ as = 'h2', lines, className = '', delay = 0, amount = 0.4, id, style }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount });
  const reduce = useReducedMotion();
  const Tag = motion[as] || motion.h2;
  return (
    <Tag ref={ref} id={id} className={className} style={style}>
      {/* JS off: the lines stand in place (an !important rule beats the inline start transform) */}
      <noscript dangerouslySetInnerHTML={{ __html: '<style>.pf-mask-in{transform:none!important}</style>' }} />
      {lines.map((l, i) => (
        <span key={i} className="pf-mask-l">
          <motion.span
            className="pf-mask-in"
            initial={reduce ? false : { y: '110%' }}
            animate={seen || reduce ? { y: '0%' } : { y: '110%' }}
            transition={{ duration: 1, ease: EASE, delay: delay + i * 0.075 }}
          >
            {l}
          </motion.span>
          {i < lines.length - 1 ? ' ' : null}
        </span>
      ))}
    </Tag>
  );
}
