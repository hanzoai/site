'use client';
/* MaskLines (components/v2, owned by the Wave 2 "Proof" chat). Kinetic type: each line of a heading rises out of its
   own mask, once, when the heading is reached (MASTER part 3: translateY 105% to 0, 700 ms, ease-emphasis, 60 ms
   between lines).
   Usage:  <MaskLines as="h1" className="pf-display" lines={['Security', 'you can read.']} />
   - lines: the heading broken where it should break (12-18ch). The whole text is in the server HTML.
   - delay (s), amount (how much must be in view), id. Reduced motion: the final state, no movement. JS off: legible.
   On a first visit it waits for the arrival curtain to lift (the 'hz-arrived' event), so the cut-in is seen. */
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import './ProofScale.css';

const EASE = [0.16, 1, 0.3, 1];

export default function MaskLines({ as = 'h2', lines, className = '', delay = 0, amount = 0.4, id, style }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount });
  const r0 = useReducedMotion();
  const [reduce, setReduce] = useState(false); // read after mount, so the first render matches the server's HTML
  useEffect(() => setReduce(!!r0), [r0]);
  // a first visit opens behind the arrival curtain (components/arrival.js): wait for it to lift, or no one sees the cut-in
  const [ready, setReady] = useState(true);
  useEffect(() => {
    if (!document.documentElement.classList.contains('x-arriving')) return;
    setReady(false);
    const go = () => setReady(true);
    addEventListener('hz-arrived', go, { once: true });
    const t = setTimeout(go, 4000); // the curtain's own failsafe is 3.5s
    return () => { removeEventListener('hz-arrived', go); clearTimeout(t); };
  }, []);
  const Tag = motion[as] || motion.h2;
  return (
    <>
    {/* JS off: the lines stand in place (an !important rule beats the inline start transform). Kept outside the
        heading so the heading's text is only its words. */}
    <noscript dangerouslySetInnerHTML={{ __html: '<style>.pf-mask-in{transform:none!important}</style>' }} />
    <Tag ref={ref} id={id} className={className} style={style}>
      {lines.map((l, i) => (
        <span key={i} className="pf-mask-l">
          <motion.span
            className="pf-mask-in"
            initial={reduce ? false : { y: '105%' }}
            animate={(seen && ready) || reduce ? { y: '0%' } : { y: '105%' }}
            transition={reduce ? { duration: 0 } : { duration: 0.7, ease: EASE, delay: delay + i * 0.06 }}
          >
            {l}
          </motion.span>
          {i < lines.length - 1 ? ' ' : null}
        </span>
      ))}
    </Tag>
    </>
  );
}
