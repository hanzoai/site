'use client';
/* Page-local copy of components/v2/MaskLines for /integrations: reduced motion is read after hydration (the shared one
   mismatches the server HTML under reduced motion; see docs/build-notes/requests/integrations.md). */
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import '../../v2/ProofScale.css';

const EASE = [0.16, 1, 0.3, 1];

export default function MaskLines({ as = 'h2', lines, className = '', delay = 0, amount = 0.4, id, style }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount });
  const rm = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const reduce = mounted && rm; // read after hydration: server and first client render agree
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
            transition={{ duration: reduce ? 0 : 0.7, ease: EASE, delay: delay + i * 0.06 }}
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
