'use client';
/* KeynoteLines: kinetic type. Each line of a headline rises out of its own mask, once (VISION motion 4).
   Owned by the Cloud 1 chat.
   Usage: <KeynoteLines as="h1" className="kn-display" lines={['Hanzo Engine', 'in one binary']} />
   - lines: an array (one entry per line) or a string (one line). The full text is also in the heading for readers.
   - mount: play on load (heroes). Otherwise it plays the first time the heading is seen.
   - delay: seconds before the first line; lines follow 90 ms apart. Reduced motion shows the final state. */
import { motion, useReducedMotion } from 'motion/react';
import { EASE } from '../ui';
import './Keynote.css';

export default function KeynoteLines({ as = 'h2', lines, className = '', delay = 0, mount = false, id }) {
  const calm = useReducedMotion();
  const L = Array.isArray(lines) ? lines : [lines];
  const Tag = as;
  const play = mount ? { initial: 'h', animate: 's' } : { initial: 'h', whileInView: 's', viewport: { once: true, amount: 0.5 } };
  return (
    <Tag className={'knl ' + className} id={id}>
      <span className="x-sr">{L.join(' ')}</span>
      <motion.span aria-hidden="true" className="knl-in" {...(calm ? {} : play)} variants={{ h: {}, s: { transition: { staggerChildren: 0.09, delayChildren: delay } } }}>
        {L.map((t, i) => (
          <span className="knl-row" key={i}>
            <motion.span className="knl-t" variants={calm ? undefined : { h: { y: '108%' }, s: { y: '0%', transition: { duration: 1.05, ease: EASE } } }}>{t}</motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
