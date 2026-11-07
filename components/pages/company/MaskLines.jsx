'use client';
/* MaskLines: kinetic type (VISION.md motion 4, PLAN-COMPONENTS 2.9 "line-masked rise"). Each line rises out of its own
   mask, once (translateY 105% to 0, 800ms, out-curve).
   Usage: <MaskLines as="h1" now lines={['Compilers,', 'cryptography,']} className="vc-display" />
   - `now` plays as soon as the site's arrival curtain has lifted (a hero; useArrived); otherwise when half of it is on
     screen.
   - The whole sentence is real text in the server HTML. JS off: a <noscript> rule shows it in place (PLAN 2.3).
   - Reduced motion shows it still (MotionConfig in the layout skips the transform).
   - Needs '../v2/vc-type.css' (the .vc-ml classes). Page-local kit of the Wave 2 Company chat (main's
     components/v2/MaskLines is the Proof chat's, a different piece). */
import { motion } from 'motion/react';
import useArrived from './useArrived';

const EASE = [0.16, 1, 0.3, 1];
const TAGS = { h1: motion.h1, h2: motion.h2, h3: motion.h3, p: motion.p, div: motion.div };
const NOJS = { __html: '<style>.vc-ml-i{transform:none!important}</style>' };

export default function MaskLines({ lines, as = 'h2', className = '', delay = 0, now = false, id, stagger = 0.08 }) {
  const Tag = TAGS[as] || motion.h2;
  const ok = useArrived();
  const play = now ? { animate: ok ? 's' : 'h' } : { whileInView: 's', viewport: { once: true, amount: 0.5 } };
  return (
    <>
      <noscript dangerouslySetInnerHTML={NOJS} />
      <Tag id={id} className={'vc-ml ' + className} initial="h" {...play} variants={{ h: {}, s: { transition: { staggerChildren: stagger, delayChildren: delay } } }}>
        {lines.map((l, i) => (
          <span className="vc-ml-l" key={i}>
            <motion.span className="vc-ml-i" variants={{ h: { y: '105%' }, s: { y: '0%', transition: { duration: 0.8, ease: EASE } } }}>
              {l}{i < lines.length - 1 ? ' ' : ''}
            </motion.span>
          </span>
        ))}
      </Tag>
    </>
  );
}
