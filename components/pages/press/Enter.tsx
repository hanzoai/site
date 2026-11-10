'use client';
/* /press entrances (motion map: conveyor, pull-back, velocity-skew, orbit-in, stack-drop), one per main section, in
   page order. Page-local; each runs once as its section enters view (velocity-skew follows scroll speed and levels out).
   Every moving element carries `xen`, so the page's <noscript> rule shows the final state with JS off; under reduced
   motion (MotionConfig reducedMotion="user" in the layout) transforms jump straight to their final state. */
import { Children, useRef } from 'react';
import { motion, useInView, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from 'motion/react';

const VIEW = { once: true, amount: 0.25 };

/* conveyor: the pieces ride in from the right edge one after another on one belt, at one speed, then stop. A hairline
   belt under them runs while they ride. */
export function Conveyor({ children, className = '' }) {
  const calm = useReducedMotion();
  const n = Children.count(children);
  return (
    <motion.div className={'xen-cv ' + className} initial="off" whileInView="on" viewport={VIEW}>
      {Children.map(children, (c, i) => (
        <motion.div className="xen xen-cv-i" variants={{ off: { x: '110vw' }, on: { x: 0 } }}
          transition={calm ? { duration: 0 } : { duration: 1.05, ease: [0.45, 0, 0.2, 1], delay: 0.15 + i * 0.16 }}>
          {c}
        </motion.div>
      ))}
      <motion.span className="xen xen-belt" aria-hidden="true" variants={{ off: { opacity: 1 }, on: { opacity: 0 } }}
        transition={calm ? { duration: 0 } : { duration: 0.4, delay: 1.2 + n * 0.16 }} />
    </motion.div>
  );
}

/* pull-back: starts zoomed right in on the dark plate, then pulls back to show the whole kit. */
export function PullBack({ children, className = '', origin = '22% 40%' }) {
  const calm = useReducedMotion();
  const ref = useRef(null);
  const seen = useInView(ref, VIEW); // watch the clipping box, not the scaled child (its ratio never reaches the amount)
  return (
    <div className={'xen-pb ' + className} ref={ref}>
      <motion.div className="xen" style={{ transformOrigin: origin }} initial={{ scale: 2.6 }} animate={seen ? { scale: 1 } : { scale: 2.6 }}
        transition={calm ? { duration: 0 } : { duration: 1.3, ease: [0.16, 1, 0.3, 1] }}>
        {children}
      </motion.div>
    </div>
  );
}

/* velocity-skew: the section leans with the speed of the scroll and straightens when the page stops. */
export function VelocitySkew({ children, className = '' }) {
  const calm = useReducedMotion();
  const { scrollY } = useScroll();
  const v = useVelocity(scrollY);
  const raw = useTransform(v, [-1800, 0, 1800], [3, 0, -3], { clamp: true }); // a lean, not a lurch: 3° at a fast flick
  const skewY = useSpring(raw, { stiffness: 260, damping: 32, mass: 0.6 });
  return <motion.div className={'xen ' + className} style={{ skewY: calm ? 0 : skewY }}>{children}</motion.div>; // same markup either way (no hydration mismatch)
}

/* orbit-in: items swing into their places along an arc around a far-off centre, one after another. `go` comes from
   the parent's own in-view check (a rotated item sits far off its place, so it cannot watch itself). */
export function OrbitItem({ i, go, as = 'li', className = '', children, ...rest }) {
  const calm = useReducedMotion();
  const Tag = as === 'li' ? motion.li : as === 'aside' ? motion.aside : motion.div;
  const side = i % 2 ? -1 : 1;
  return (
    <Tag className={'xen xen-orb ' + className} style={{ transformOrigin: side > 0 ? '-70vw 50%' : '170vw 50%' }}
      initial={{ rotate: 16 * side, opacity: 0 }} animate={go ? { rotate: 0, opacity: 1 } : { rotate: 16 * side, opacity: 0 }}
      transition={calm ? { duration: 0 } : { duration: 1, ease: [0.2, 0.9, 0.25, 1], delay: 0.12 * i }} {...rest}>
      {children}
    </Tag>
  );
}

/* stack-drop: the room's layers drop from above one by one and land on each other with a short settle. */
export function StackDrop({ children, className = '' }) {
  const calm = useReducedMotion();
  return (
    <motion.div className={className} initial="off" whileInView="on" viewport={VIEW}>
      {Children.map(children, (c, i) => (
        <motion.div className="xen xen-sd" variants={{ off: { y: -96, rotate: i % 2 ? 1 : -1, opacity: 0 }, on: { y: 0, rotate: 0, opacity: 1 } }}
          transition={calm ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 32, mass: 0.9, delay: i * 0.2, opacity: { duration: 0.15, delay: i * 0.2 } }}>
          {c}
        </motion.div>
      ))}
    </motion.div>
  );
}
