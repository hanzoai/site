'use client';
/* /cli only: a headline whose lines rise out of their own masks once, when half of it is on screen.
   Page-local stand-in for v2/x-edison/AppLines (shared, not ours): the server HTML is the final frame (no inline
   transform), so JS off is legible and reduced motion hydrates without a mismatch. The mask is a CSS class:
   `.js .cli-cut:not(.in)` holds each line at translateY(108%); `.in` lets it rise (700 ms, ease-emphasis, 60 ms apart).
   Usage: <Cut as="h2" id="x" className="av-head" lines={['Install, sign in,', 'start working']} /> */
import { useRef } from 'react';
import { useInView } from 'motion/react';

export default function Cut({ lines, as = 'h2', className = '', id }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.5 });
  const Tag = as;
  return (
    <Tag ref={ref} id={id} className={'cli-cut ' + (seen ? 'in ' : '') + className}>
      {lines.map((l, i) => (
        <span key={i} className="cli-cut-m">
          <span className="cli-cut-l" style={{ '--d': i * 60 + 'ms' }}>{l}{i < lines.length - 1 ? ' ' : ''}</span>
        </span>
      ))}
    </Tag>
  );
}
