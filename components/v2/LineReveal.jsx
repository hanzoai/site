'use client';
/* LineReveal: v2 kinetic type (docs/VISION.md, motion 4), owned by the Wave 2 Programs chat.
   Each line of a headline rises out of its own mask, once: 105% to 0 in 700 ms, ease-emphasis, 60 ms apart (MASTER part 3). The words are in the HTML from the server;
   reduced motion shows them in place (MotionConfig reducedMotion="user").
   Usage: <LineReveal as="h1" className="xp-display" lines={['Refer customers', 'to Hanzo']} />
   Also exports <NoJs />: put it once in a Programs page's <main>; with JavaScript off it shows every final state
   (no transform or opacity left from an entrance) and lays sticky chapters out as their plain story.
   - onView: play when it scrolls into view (default: on arrival, for a hero). The arrival version is pure CSS, so the
     headline cuts in from the first paint, before any JavaScript runs, and still ends in place with JavaScript off;
   - delay: seconds before the first line. Needs components/v2/ProgramScale.css for the .xp-l masks. */
import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import SharedNoJs from '../NoJs';

const EASE = [0.16, 1, 0.3, 1];

export default function LineReveal({ lines, as = 'h2', className = '', id, delay = 0, onView = false }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.5 });
  const go = onView ? seen : true;
  const Tag = as;
  if (!onView) return (
    <Tag id={id} className={className}>
      {lines.map((l, i) => (
        <span className="xp-l" key={i}><span className="xp-cut" style={{ '--i': i, '--d': delay + 's' }}>{l}</span></span>
      ))}
    </Tag>
  );
  return (
    <Tag ref={ref} id={id} className={className}>
      {lines.map((l, i) => (
        <span className="xp-l" key={i}>
          <motion.span initial={{ y: '105%' }} animate={go ? { y: '0%' } : { y: '105%' }} transition={{ duration: 0.7, ease: EASE, delay: delay + i * 0.06 }}>{l}</motion.span>
        </span>
      ))}
    </Tag>
  );
}

/* With JavaScript off nothing animates, so every element shows its final state. */
const NOJS = '<style>.xp [style]{transform:none!important;opacity:1!important;clip-path:none!important}.xpc{height:auto!important;padding:96px 0}.xpc-pin{display:none!important}.xpc-story{display:block!important;width:min(100% - 48px,1440px);margin:0 auto}.xpc-rail-p{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px}.xpc-sstage{position:relative;height:340px;margin-bottom:24px}.xpc-dots{display:none}</style>';
export function NoJs() {
  return <SharedNoJs css={NOJS} />;
}
