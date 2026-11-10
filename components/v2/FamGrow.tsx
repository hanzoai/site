'use client';
/* FamGrow (Families A kit): scale has rhythm (docs/build-notes/MASTER.md, James 7 Nov). A figure or heading rests at its live
   hanzo.ai size (figures 64px, headings 26px) and grows past it only while it is the moment: as it crosses the middle
   of the screen it swells (transform only, so nothing around it moves), then settles back as you scroll on. Use it on
   the one big thing of a screen, never on everything; leave room around it. Reduced motion keeps it at rest.
   How to use it:
   - <FamGrow to={1.75}><b className="v2f-num v2f-fig">93.8%</b></FamGrow>;
   - to: the scale at the moment (1.75 takes a 64px figure to 112px); origin: the transform origin. */
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';

export default function FamGrow({ children, to = 1.75, origin = '0% 100%', className = '', as = 'span' }) {
  const ref = useRef(null);
  const calm = useReducedMotion();
  const [on, setOn] = useState(false); // after hydration only, so the server's HTML and the first paint agree
  useEffect(() => setOn(!calm), [calm]);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const scale = useTransform(scrollYProgress, [0.2, 0.45, 0.55, 0.8], [1, to, to, 1], { clamp: true });
  const Tag = motion[as];
  return (
    <Tag ref={ref} className={'v2f-grow ' + className} style={on ? { scale, transformOrigin: origin, display: 'inline-block' } : { display: 'inline-block' }}>
      {children}
    </Tag>
  );
}
