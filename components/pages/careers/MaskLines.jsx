'use client';
/* MaskLines: kinetic type (VISION.md motion 4). Each line rises out of its own mask, once.
   Usage: <MaskLines as="h1" now lines={['Compilers,', 'cryptography,']} className="vc-display" />
   - `now` plays on mount (a hero); otherwise it plays when half of it is on screen.
   - The whole sentence is in the HTML; reduced motion shows it still (MotionConfig in the layout skips the transform).
   - Needs '../v2/vc-type.css' (the .vc-ml classes). Owned by the Wave 2 Company chat. */
import { motion } from 'motion/react';

const EASE = [0.16, 1, 0.3, 1];
const TAGS = { h1: motion.h1, h2: motion.h2, h3: motion.h3, p: motion.p, div: motion.div };

export default function MaskLines({ lines, as = 'h2', className = '', delay = 0, now = false, id, stagger = 0.09 }) {
  const Tag = TAGS[as] || motion.h2;
  const play = now ? { animate: 's' } : { whileInView: 's', viewport: { once: true, amount: 0.5 } };
  return (
    <Tag id={id} className={'vc-ml ' + className} initial="h" {...play} variants={{ h: {}, s: { transition: { staggerChildren: stagger, delayChildren: delay } } }}>
      {lines.map((l, i) => (
        <span className="vc-ml-l" key={i}>
          <motion.span className="vc-ml-i" variants={{ h: { y: '112%' }, s: { y: '0%', transition: { duration: 1.05, ease: EASE } } }}>
            {l}{i < lines.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
