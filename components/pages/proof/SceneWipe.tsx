'use client';
/* SceneWipe, page-local copy for /research and /security (same props and look as components/v2/SceneWipe).
   Why a copy: the shared one picks its clip from useReducedMotion() during render, so under reduced motion the server
   and client styles differ (red hydration badge). Here the still state is applied after hydration.
   Requested for the shared file in docs/build-notes/requests/research.md; delete this copy once it lands. */
import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { motion, useMotionTemplate, useReducedMotion, useScroll, useTransform } from 'motion/react';
import '../../v2/ProofScale.css';

interface SceneWipeProps { children?: ReactNode; className?: string; dark?: boolean; tone?: string; label?: string; id?: string }

export default function SceneWipe({ children, className = '', dark = true, tone = '#000', label, id }: SceneWipeProps) {
  const ref = useRef<HTMLElement>(null);
  const rm = useReducedMotion();
  const [reduce, setReduce] = useState(false);
  useEffect(() => setReduce(!!rm), [rm]);
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
