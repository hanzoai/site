'use client';
/* LiftStage (owner: Cloud 2 chat). Two pieces for a v2 Stage hero (VISION.md motion 2 and 4).
   - <Lines as="h1" className="v2-display" lines={['Hanzo', 'Gateway']} delay={0.05} />
     Kinetic type: each line rises out of its own mask once, on arrival. The words are in the HTML from the start.
   - <Lift from={1.22} y={80} origin="50% 0%" className="...">{hero object}</Lift>
     The hero object starts huge and settles into its place as it scrolls up into view (scale, position and clip only),
     so the camera feel comes from the scroll. Reduced motion: the final, settled state.
   Both need '../../v2/v2scale.css' (the .v2-line mask). */
import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';

const EASE = [0.16, 1, 0.3, 1];

export function Lines({ lines, as = 'h1', className = '', delay = 0.05, gap = 0.11, id, ...rest }) {
  const Tag = as;
  return (
    <Tag className={className} id={id} {...rest}>
      {lines.map((t, i) => (
        <span className="v2-line" key={i}>
          <motion.span initial={{ y: '108%' }} animate={{ y: '0%' }} transition={{ duration: 1.15, ease: EASE, delay: delay + i * gap }}>{t}</motion.span>
        </span>
      ))}
    </Tag>
  );
}

/* offset: when the settle starts and ends, as useScroll offsets of the object against the viewport. */
export function Lift({ children, from = 1.2, y = 60, round = 0, origin = '50% 0%', offset = ['start end', 'start 0.18'], className = '', style, ...rest }) {
  const ref = useRef(null);
  const calm = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset });
  const scale = useTransform(scrollYProgress, [0, 1], [from, 1]);
  const ty = useTransform(scrollYProgress, [0, 1], [y, 0]);
  const clip = useTransform(scrollYProgress, [0, 1], [`inset(0% ${round}% 0% ${round}% round 28px)`, 'inset(0% 0% 0% 0% round 28px)']);
  return (
    <div ref={ref} className={className} style={style} {...rest}>
      <motion.div style={calm ? undefined : { scale, y: ty, transformOrigin: origin, clipPath: round ? clip : undefined }}>
        {children}
      </motion.div>
    </div>
  );
}
