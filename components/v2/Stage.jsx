'use client';
/* Stage (v2, owned by the Home chat): the hero object starts huge and settles into its place as you scroll.
   The scene pins for `length` screens of scroll and hands you its progress p (a MotionValue, 0 → 1) to drive your own
   transforms (scale, position, clip only). On phones (under `below` px) and with reduced motion nothing pins, and
   `pinned` is false: lay the scene out in plain flow with CSS and leave the transforms off.
   Usage:
     import Stage from '../v2/Stage';
     <Stage length={1.1} className="my-stage">
       {(p, pinned) => {
         const s = useTransform(p, [0, 1], [1.4, 1]);   // hooks belong in a child component; see Hero.jsx
         return <Thing style={pinned ? { scale: s } : undefined} />;
       }}
     </Stage>
   `pinned` is null until the page has measured itself (first paint): keep the moving object hidden until then.
   Needs components/v2/system.css. */
import { useEffect, useRef, useState } from 'react';
import { useMotionValue, useReducedMotion, useScroll } from 'motion/react';
import './Stage.css';

export default function Stage({ length = 1, below = 900, className = '', children, ...rest }) {
  const ref = useRef(null);
  const calm = useReducedMotion();
  const [pinned, setPinned] = useState(null);
  useEffect(() => {
    const m = matchMedia(`(min-width: ${below}px)`);
    const f = () => setPinned(m.matches && !calm);
    f();
    m.addEventListener('change', f);
    return () => m.removeEventListener('change', f);
  }, [below, calm]);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const still = useMotionValue(1);
  return (
    <div ref={ref} className={'v2-stage ' + className} data-pinned={pinned === null ? undefined : String(pinned)} style={{ '--v2-len': length }} {...rest}>
      <div className="v2-stage-in">{children(pinned ? scrollYProgress : still, pinned)}</div>
    </div>
  );
}
