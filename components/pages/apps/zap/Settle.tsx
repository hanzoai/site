'use client';
/* Settle for /zap only: the same Stage move as components/v2/Settle.jsx (the wire arrives large and low, then settles as
   the first screen scrolls away), but the server and the first client render are identical, so a reduced-motion
   visitor gets no hydration mismatch. Reduced motion is read after mount (and enforced in Zap.css under
   prefers-reduced-motion). The shared file renders `none` on a calm client and the server's transform on the server;
   that bug is logged in docs/build-notes/requests/zap.md. */
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';

interface SettleProps {
  children?: ReactNode;
  from?: number;
  lift?: number;
  span?: number;
  className?: string;
}
export default function Settle({ children, from = 1.14, lift = 80, span, className = '' }: SettleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rm = useReducedMotion();
  const [calm, setCalm] = useState(false);
  useEffect(() => setCalm(!!rm), [rm]);
  const [h, setH] = useState(800);
  const [phone, setPhone] = useState(false);
  const [cap, setCap] = useState(from);
  useEffect(() => {
    const on = () => { setH(innerHeight); setPhone(innerWidth < 900); const w = ref.current?.offsetWidth; if (w) setCap(innerWidth / w); };
    on();
    addEventListener('resize', on);
    return () => removeEventListener('resize', on);
  }, []);
  const { scrollY } = useScroll();
  const end = span || h * 0.7;
  const f = Math.max(1, Math.min(phone ? 1 + (from - 1) / 2 : from, cap));
  const scale = useTransform(scrollY, [0, end], [calm ? 1 : f, 1], { clamp: true });
  const y = useTransform(scrollY, [0, end], [calm ? 0 : lift, 0], { clamp: true });
  return (
    <motion.div ref={ref} className={'w2-settle zp-settle ' + className} style={{ scale, y, transformOrigin: '50% 0%' }}>
      {children}
    </motion.div>
  );
}
