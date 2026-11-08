'use client';
/* Lines (page-local to /skills): components/v2/A2Lines with one change. A2Lines reads useReducedMotion() during the
   first render, so under reduced motion the server sends translateY(105%) and the client renders none: a hydration
   mismatch (docs/build-notes/requests/skills.md). Here the first render always matches the server (masked), and reduced motion
   jumps to the final lines with a 0 s transition once mounted. Same props, same A2.css classes. */
import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import NoJs from '../../NoJs';
import { T, EMPH } from '../../v2/A2Motion';

export default function Lines({ lines, as = 'h2', className = '', now, delay = 0, id }) {
  const calm = useReducedMotion();
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.3 });
  const Tag = as;
  const go = now || seen || calm;
  return (
    <>
      <NoJs css={'.a2-ln-in{transform:none!important}.a2 [style*="opacity:0"]{opacity:1!important;transform:none!important}'} />
      <Tag className={className} id={id} ref={ref}>
        {lines.map((l, i) => (
          <span className="a2-ln" key={i}>
            <motion.span className="a2-ln-in" initial={{ y: '105%' }} animate={go ? { y: 0 } : undefined} transition={calm ? { duration: 0 } : { duration: T.line, ease: EMPH, delay: delay + i * T.stagger }}>{l}</motion.span>
            {i < lines.length - 1 ? ' ' : null}
          </span>
        ))}
      </Tag>
    </>
  );
}
