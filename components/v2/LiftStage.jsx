'use client';
/* LiftStage (owner: Cloud 2 chat). Two pieces for a v2 Stage hero (VISION.md motion 2 and 4).
   - <Lines as="h1" className="v2-display" lines={['Hanzo', 'Gateway']} delay={0.05} />
     Kinetic type: each line rises out of its own mask once, at first paint. It is a CSS animation, so it moves before
     any JavaScript runs and the words are readable with JavaScript off.
   - <Lift from={1.22} y={80} origin="50% 0%" className="...">{hero object}</Lift>
     The hero object starts huge and settles into its place as it scrolls up into view (scale, position and clip only),
     so the camera feel comes from the scroll. Phones settle from a quarter of the scale. Reduced motion: the final state.
   - useTick(ms, run, fn): calls fn every ms while run is true, with a setTimeout chain (no setInterval; it stops the
     moment run turns false, e.g. off screen or paused).
   Both need '../../v2/v2scale.css' (the .v2-line mask). */
import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';

export function Lines({ lines, as = 'h1', className = '', delay = 0.05, gap = 0.06, id, ...rest }) {
  const Tag = as;
  return (
    <Tag className={className} id={id} {...rest}>
      {lines.map((t, i) => (
        <span className="v2-line" key={i}>
          <span className="v2-cut" style={{ animationDelay: (delay + i * gap).toFixed(2) + 's' }}>{t}</span>
        </span>
      ))}
    </Tag>
  );
}

export function useTick(ms, run, fn) {
  const f = useRef(fn);
  f.current = fn;
  useEffect(() => {
    if (!run) return;
    let t;
    const step = () => { f.current(); t = setTimeout(step, ms); };
    t = setTimeout(step, ms);
    return () => clearTimeout(t);
  }, [ms, run]);
}

/* offset: when the settle starts and ends, as useScroll offsets of the object against the viewport. */
export function Lift({ children, from = 1.2, y = 60, round = 0, origin = '50% 0%', offset = ['start end', 'start 0.18'], className = '', style, ...rest }) {
  const ref = useRef(null);
  const calm = useReducedMotion();
  // phones: a gentler settle, so the object never spills past the screen's edges
  const k = useRef(1);
  useEffect(() => { if (innerWidth < 900) k.current = 0.25; }, []);
  const { scrollYProgress } = useScroll({ target: ref, offset });
  const scale = useTransform(scrollYProgress, (p) => 1 + (from - 1) * k.current * (1 - Math.min(1, Math.max(0, p))));
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
