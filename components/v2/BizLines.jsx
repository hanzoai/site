'use client';
/* BizLines: kinetic type, line-masked, played once (VISION motion 4; JAMES.md "headlines cut into their line").
   Owned by the Business 1 chat.
   Usage: <BizLines as="h1" id="ld-h1" className="bz-display" lines={['Hanzo', 'Ledger']} now />
   Each line rises out of its own mask, 70 ms apart.
   - now (the hero): a pure CSS cut-in that plays on load, so it needs no JavaScript and the words are never hidden.
   - otherwise: the server HTML shows the words; once the page runs, a heading that is still below the screen is set
     down in its mask and cuts in the first time it is half on screen. JS off or reduced motion: the words simply sit. */
import { useLayoutEffect, useRef, useState } from 'react';
import { useInView } from 'motion/react';
import './Biz.css';

const useIso = typeof window === 'undefined' ? () => {} : useLayoutEffect;

export default function BizLines({ lines, as = 'h2', className = '', delay = 0, now = false, id, style }) {
  const ref = useRef(null);
  const [armed, setArmed] = useState(false);
  const seen = useInView(ref, { once: true, amount: 0.5 });
  useIso(() => {
    if (now || !ref.current || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (ref.current.getBoundingClientRect().top > innerHeight) setArmed(true);
  }, [now]);
  const Tag = as;
  const state = now ? ' now' : armed && !seen ? ' armed' : '';
  return (
    <Tag ref={ref} id={id} className={'bz-lines ' + className + state} style={{ ...style, '--d': delay + 's' }}>
      {lines.map((l, i) => (
        <span className="bz-line" key={i}>
          <span style={{ '--i': i }}>{l}</span>
        </span>
      ))}
    </Tag>
  );
}
