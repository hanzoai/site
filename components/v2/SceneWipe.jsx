'use client';
/* SceneWipe (components/v2, owned by the Wave 2 "Proof" chat). A scene change with no hard edge (VISION.md motion 7):
   the section's room (dark by default) arrives as a rounded panel inset from the page and opens to full bleed as you
   scroll into it, by clip-path only. Use it for the page's one dark room.
   Usage:  <SceneWipe className="xtr-dark" label="…">…content…</SceneWipe>
   Props: dark (default true; sets data-room="dark" so the header turns dark), tone (the room's colour, default #000),
   label (aria-label), id. Reduced motion and phones: the room is simply there, full bleed. */
import { useEffect, useRef, useState } from 'react';
import { motion, useMotionTemplate, useReducedMotion, useScroll, useTransform } from 'motion/react';
import './ProofScale.css';

export default function SceneWipe({ children, className = '', dark = true, tone = '#000', label, id }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const [wide, setWide] = useState(true);
  useEffect(() => { const m = matchMedia('(min-width: 901px)'); const f = () => setWide(m.matches); f(); m.addEventListener('change', f); return () => m.removeEventListener('change', f); }, []);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 0.1'] });
  const side = useTransform(scrollYProgress, [0, 1], [5, 0]);
  const top = useTransform(scrollYProgress, [0, 1], [56, 0]);
  const round = useTransform(scrollYProgress, [0, 1], [40, 0]);
  const clip = useMotionTemplate`inset(${top}px ${side}% 0px ${side}% round ${round}px ${round}px 0px 0px)`;
  const still = reduce || !wide;
  return (
    <section ref={ref} id={id} className={'pf-wipe ' + className} data-room={dark ? 'dark' : undefined} aria-label={label} style={{ position: 'relative', isolation: 'isolate', color: dark ? '#f5f5f7' : undefined }}>
      <motion.div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: -1, background: tone, clipPath: still ? 'none' : clip }} />
      {children}
    </section>
  );
}
