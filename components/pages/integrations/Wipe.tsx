'use client';
/* Page-local copy of components/v2/SceneWipe for /integrations: the same room, but reduced motion is read after
   hydration (the shared one mismatches the server HTML under reduced motion; see docs/build-notes/requests/integrations.md). */
import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { motion, useMotionTemplate, useReducedMotion, useScroll, useTransform } from 'motion/react';
import '../../v2/ProofScale.css';

interface Props { children?: ReactNode; className?: string; dark?: boolean; tone?: string; label?: string; id?: string }

export default function SceneWipe({ children, className = '', dark = true, tone = '#000', label, id }: Props) {
  const ref = useRef<HTMLElement>(null);
  // reduced motion is read only after hydration, so the server HTML and the first client render agree
  const rm = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const reduce = mounted && rm;
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
