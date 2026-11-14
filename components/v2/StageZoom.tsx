'use client';
/* StageZoom (components/v2, owned by the Wave 2 "Proof" chat). The Stage move (VISION.md motion 2): the hero object
   starts huge and settles into its place as you scroll, by scale and position only. The object rides a sticky
   runway, so the camera feel comes without moving the page under it.
   Usage:
     <StageZoom runway={170} from={1.5} to={1} className="xbm-stage">
       {(p) => <Chart progress={p} />}      // or plain children; p = MotionValue 0..1 across the runway
     </StageZoom>
   Props: runway (svh of scroll the settle takes, ≥100), from / to (scale), y (px the object rises while settling),
   origin (transform-origin), className. Phones (≤900px) and reduced motion: the object simply sits at its final size. */
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react';

interface StageZoomProps {
  children?: ReactNode | ((p: MotionValue<number>) => ReactNode);
  runway?: number;
  from?: number;
  to?: number;
  y?: number;
  origin?: string;
  className?: string;
}

export default function StageZoom({ children, runway = 170, from = 1.5, to = 1, y = 0, origin = '50% 50%', className = '' }: StageZoomProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [wide, setWide] = useState(true);
  useEffect(() => { const m = matchMedia('(min-width: 901px)'); const f = () => setWide(m.matches); f(); m.addEventListener('change', f); return () => m.removeEventListener('change', f); }, []);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const scale = useTransform(scrollYProgress, [0, 0.85], [from, to], { clamp: true });
  const ty = useTransform(scrollYProgress, [0, 0.85], [y, 0], { clamp: true });
  const still = reduce || !wide;
  const body = typeof children === 'function' ? children(scrollYProgress) : children;
  if (still) return <div className={'pf-stage still ' + className}>{body}</div>;
  return (
    <div ref={ref} className={'pf-stage ' + className} style={{ position: 'relative', height: runway + 'svh' }}>
      <div style={{ position: 'sticky', top: 0, height: '100svh', display: 'grid', alignItems: 'center', overflow: 'hidden' }}>
        <motion.div style={{ scale, y: ty, transformOrigin: origin }}>{body}</motion.div>
      </div>
    </div>
  );
}
