'use client';
/* A2Lines — line-masked kinetic type, played once (Apps 2 chat; styles in A2.css).
   Usage: <A2Lines as="h1" className="a2-display" lines={['An IDE that', 'remembers', 'your codebase']} now />
   Each line rises out of its own mask (700 ms, 60 ms apart, MASTER part 3). `now` plays on mount (a hero); otherwise it plays the first time the
   heading reaches the screen (watched on the heading itself: the masked lines are clipped, so they cannot be watched).
   Reduced motion shows the final lines. The whole sentence is in the HTML, and with JavaScript off a <noscript> rule
   shows every masked line (and anything a page started at opacity 0) in its final place. */
import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import NoJs from '../NoJs';

import { T, EMPH } from './A2Motion';

export default function A2Lines({ lines, as = 'h2', className = '', now, delay = 0, id }) {
  const calm = useReducedMotion();
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.3 });
  const Tag = as;
  const go = now || seen;
  return (
    <>
    <NoJs css={'.a2-ln-in{transform:none!important}.a2 [style*="opacity:0"]{opacity:1!important;transform:none!important}'} />
    <Tag className={className} id={id} ref={ref}>
      {lines.map((l, i) => (
        <span className="a2-ln" key={i}>
          <motion.span className="a2-ln-in" initial={calm ? false : { y: '105%' }} animate={go ? { y: 0 } : undefined} transition={{ duration: T.line, ease: EMPH, delay: delay + i * T.stagger }}>{l}</motion.span>
          {i < lines.length - 1 ? ' ' : null}
        </span>
      ))}
    </Tag>
    </>
  );
}
