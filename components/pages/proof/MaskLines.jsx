'use client';
/* MaskLines, page-local copy for /research and /security (same props and look as components/v2/MaskLines).
   Why a copy: the shared one reads useReducedMotion() during render and writes a <noscript> inside a client
   component, so under reduced motion its server and client HTML differ and Next shows the red hydration badge.
   Here reduced motion is applied after hydration and JS-off styles go through the shared <NoJs>.
   Requested for the shared file in docs/requests/research.md; delete this copy once it lands. */
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import NoJs from '../../NoJs';
import '../../v2/ProofScale.css';

const EASE = [0.16, 1, 0.3, 1];

export default function MaskLines({ as = 'h2', lines, className = '', delay = 0, amount = 0.4, id, style }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount });
  const rm = useReducedMotion();
  const [reduce, setReduce] = useState(false);
  useEffect(() => setReduce(!!rm), [rm]);
  // a first visit opens behind the arrival curtain: wait for it to lift, or no one sees the cut-in
  const [ready, setReady] = useState(true);
  useEffect(() => {
    if (!document.documentElement.classList.contains('x-arriving')) return;
    setReady(false);
    const go = () => setReady(true);
    addEventListener('hz-arrived', go, { once: true });
    const t = setTimeout(go, 4000);
    return () => { removeEventListener('hz-arrived', go); clearTimeout(t); };
  }, []);
  const Tag = motion[as] || motion.h2;
  return (
    <>
      <NoJs css=".pf-mask-in{transform:none!important}" />
      <Tag ref={ref} id={id} className={className} style={style}>
        {lines.map((l, i) => (
          <span key={i} className="pf-mask-l">
            <motion.span
              className="pf-mask-in"
              initial={{ y: '105%' }}
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
