'use client';
/* WipeScenes (owner: Cloud 2 chat). VISION.md motion 7, "Scene changes": full-screen scenes that wipe over each other
   with a clip-path as you scroll, each with its own background, so there are no hard section edges.
   Usage: <WipeScenes label="What happens at the edge" items={[...]} scene={(item, i) => <div>…</div>} className="xx-ws" />
   - Desktop: the section pins; scene i+1 rises over scene i from the bottom edge, scrubbed by the scroll.
   - Phones and reduced motion: the scenes simply follow one another, no pin and no wipe.
   Every scene is in the HTML. Styles: WipeScenes.css (prefix ws-). Give each scene's root your own background. */
import { useRef, type CSSProperties, type ReactNode } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from 'motion/react';
import './WipeScenes.css';

function Layer({ p, i, n, children }: { p: MotionValue<number>; i: number; n: number; children?: ReactNode }) {
  const span = 1 / (n - 1);
  const a = (i - 1) * span;
  const k = (v: number) => Math.min(1, Math.max(0, (v - a) / (span * 0.62)));
  const clip = useTransform(p, (v) => { const r = (1 - k(v)) * 100; return `inset(${r.toFixed(2)}% 0% 0% 0% round ${(r * 0.4).toFixed(1)}px ${(r * 0.4).toFixed(1)}px 0px 0px)`; });
  const y = useTransform(p, (v) => `${((1 - k(v)) * 6).toFixed(2)}%`);
  return (
    <div className="ws-layer" style={{ zIndex: i + 1 }}>
      <motion.div className="ws-clip" style={i === 0 ? undefined : { clipPath: clip }}>
        <motion.div className="ws-in" style={i === 0 ? undefined : { y }}>{children}</motion.div>
      </motion.div>
    </div>
  );
}

interface WipeScenesProps<T> {
  items: T[];
  scene: (item: T, i: number) => ReactNode;
  label?: string;
  className?: string;
}

export default function WipeScenes<T>({ items, scene, label, className = '' }: WipeScenesProps<T>) {
  const ref = useRef<HTMLElement>(null);
  const calm = useReducedMotion();
  const n = items.length;
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  return (
    <section ref={ref} className={`ws ${calm ? 'ws-calm' : ''} ${className}`} style={{ '--n': n } as CSSProperties} aria-label={label}>
      <div className="ws-stage">
        {items.map((it, i) => <Layer key={i} p={scrollYProgress} i={i} n={n}>{scene(it, i)}</Layer>)}
      </div>
    </section>
  );
}
