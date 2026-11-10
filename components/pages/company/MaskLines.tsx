'use client';
/* MaskLines: kinetic type (MASTER part 3, "the h1 cut in by line mask"). Each line rises out of its own mask, once
   (translateY 120% to 0, 800ms, ease-emphasis, 80ms between lines; 120% so no ascender peeks before the cut).
   Usage: <MaskLines as="h1" now lines={['Compilers,', 'cryptography,']} className="vc-display" />
   - `now` (a hero): a CSS animation that plays at first paint, independent of hydration. It waits half a second, and
     while the site's arrival curtain is up it is paused, so it starts about 0.5s after the curtain begins to lift.
   - otherwise: it plays when half of it is on screen (Motion whileInView).
   - The whole sentence is real text in the server HTML. JS off: hero lines still play (CSS); in-view lines show in
     place through a <noscript> rule. Reduced motion shows them still.
   - Needs '../v2/vc-type.css' (the .vc-ml classes). Page-local kit of the Wave 2 Company chat (main's
     components/v2/MaskLines is the Proof chat's, a different piece). */
import { motion } from 'motion/react';
import './MaskLines.css';

const EASE = [0.16, 1, 0.3, 1];
const TAGS = { h1: motion.h1, h2: motion.h2, h3: motion.h3, p: motion.p, div: motion.div };
const PLAIN = { h1: 'h1', h2: 'h2', h3: 'h3', p: 'p', div: 'div' };
const NOJS = { __html: '<style>.vc-ml-i{transform:none!important}</style>' };

export default function MaskLines({ lines, as = 'h2', className = '', delay = 0, now = false, id, stagger = 0.08 }) {
  if (now) {
    const Tag = PLAIN[as] || 'h2';
    return (
      <Tag id={id} className={'vc-ml ' + className}>
        {lines.map((l, i) => (
          <span className="vc-ml-l" key={i}>
            <span className="vc-ml-i vc-ml-css" style={{ '--d': (0.5 + delay + i * stagger).toFixed(2) + 's' }}>
              {l}{i < lines.length - 1 ? ' ' : ''}
            </span>
          </span>
        ))}
      </Tag>
    );
  }
  const Tag = TAGS[as] || motion.h2;
  return (
    <>
      <noscript dangerouslySetInnerHTML={NOJS} />
      <Tag id={id} className={'vc-ml ' + className} initial="h" whileInView="s" viewport={{ once: true, amount: 0.5 }} variants={{ h: {}, s: { transition: { staggerChildren: stagger, delayChildren: delay } } }}>
        {lines.map((l, i) => (
          <span className="vc-ml-l" key={i}>
            <motion.span className="vc-ml-i" variants={{ h: { y: '120%' }, s: { y: '0%', transition: { duration: 0.8, ease: EASE } } }}>
              {l}{i < lines.length - 1 ? ' ' : ''}
            </motion.span>
          </span>
        ))}
      </Tag>
    </>
  );
}
