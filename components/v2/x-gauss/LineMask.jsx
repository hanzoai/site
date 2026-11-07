'use client';
/* LineMask: kinetic type. Each line rises out of its own mask, once.
   Usage: <LineMask as="h1" className="w2-display" lines={['One risk plane', 'for accounts,']} />
   - now: play on mount (heroes); otherwise it plays the first time it is on screen.
   - The full text is one string for screen readers; the masked lines are aria-hidden.
   Reduced motion: the site's MotionConfig makes the rise instant, so lines are simply there. Owned by the Business 2 chat. */
import { motion } from 'motion/react';
import '../Scale.css';

const EASE = [0.16, 1, 0.3, 1];

export default function LineMask({ as = 'h2', lines, className = '', now = false, delay = 0, id }) {
  const Tag = motion[as];
  const play = now ? { initial: 'h', animate: 's' } : { initial: 'h', whileInView: 's', viewport: { once: true, amount: 0.6 } };
  return (
    <Tag id={id} className={'w2-mask ' + className} {...play} variants={{ h: {}, s: { transition: { staggerChildren: 0.09, delayChildren: delay } } }}>
      <span className="x-sr">{lines.join(' ')}</span>
      {lines.map((t, i) => (
        <span key={i} className="x-line" aria-hidden="true">
          <motion.span className="x-line-in" variants={{ h: { y: '108%' }, s: { y: 0, transition: { duration: 1.1, ease: EASE } } }}>{t}</motion.span>
        </span>
      ))}
    </Tag>
  );
}
