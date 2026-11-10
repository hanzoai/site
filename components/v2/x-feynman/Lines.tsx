'use client';
/* Lines (v2, owned by the Story chat). Kinetic type: a heading set as explicit lines, each rising out of its own mask,
   played once. VISION.md motion 4.
   Usage: <Lines as="h1" className="v2s-display" lines={['Chasing the', <>Pareto <em>Frontier</em></>, 'of AI']} />
   - lines: one entry per visual line (string or node). On narrow screens a line may wrap inside its own mask.
   - onView: play when it scrolls into view (default: on load). delay: seconds before the first line.
   - The full text is in the HTML (search, no-JS readers); transform only; reduced motion shows it at rest
     (MotionConfig reducedMotion="user" is global). Use it for one or two statements a page, never every heading. */
import { motion } from 'motion/react';

const EASE = [0.16, 1, 0.3, 1];

export default function Lines({ as = 'h2', lines, className = '', delay = 0, onView = false, id }) {
  const Tag = as;
  const play = onView
    ? { initial: 'h', whileInView: 's', viewport: { once: true, amount: 0.5 } }
    : { initial: 'h', animate: 's' };
  return (
    <Tag className={className} id={id}>
      <motion.span style={{ display: 'block' }} {...play} variants={{ h: {}, s: { transition: { staggerChildren: 0.09, delayChildren: delay } } }}>
        {lines.map((l, i) => (
          <span key={i} className="v2s-mask">
            <motion.span variants={{ h: { y: '108%' }, s: { y: 0, transition: { duration: 1.1, ease: EASE } } }}>{l}</motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
