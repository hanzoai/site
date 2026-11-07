'use client';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  motion, AnimatePresence, animate, useInView, useMotionValue, useMotionTemplate,
  useSpring, useTransform, useReducedMotion,
} from 'motion/react';

export const EASE = [0.16, 1, 0.3, 1];
export const SPRING = { type: 'spring', stiffness: 260, damping: 26, mass: 0.8 };
export const mod = (a, n) => ((a % n) + n) % n;
export const fine = (e) => e.pointerType === 'mouse' || e.pointerType === 'pen';

/* A heading that arrives word by word, rising out of a blur. */
export function Words({ text, as = 'h2', className, delay = 0, amount = 0.6 }) {
  const Tag = motion[as];
  const words = text.split(' ');
  return (
    <Tag
      className={className}
      initial="h"
      whileInView="s"
      viewport={{ once: true, amount }}
      variants={{ h: {}, s: { transition: { staggerChildren: 0.055, delayChildren: delay } } }}
    >
      <span className="x-sr">{text}</span>
      {words.map((w, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          className="x-word"
          variants={{
            h: { opacity: 0, y: '0.42em', filter: 'blur(12px)' },
            s: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1, ease: EASE } },
          }}
        >
          {w}
          {i < words.length - 1 ? ' ' : ''}
        </motion.span>
      ))}
    </Tag>
  );
}

/* Fades and rises into place once, when it reaches the screen. */
export function Rise({ children, delay = 0, y = 28, className, as = 'div', amount = 0.3, ...rest }) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.9, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function Head({ title, lede, center, dark }) {
  return (
    <header className={'x-head' + (center ? ' center' : '') + (dark ? ' dark' : '')}>
      <Words text={title} />
      {lede && <Rise as="p" delay={0.25}>{lede}</Rise>}
    </header>
  );
}

/* A number that counts up to its value when it is seen, in tabular figures. */
export function Count({ to, decimals = 0, prefix = '', suffix = '', duration = 1.6, run, className, delay = 0 }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.6 });
  const calm = useReducedMotion();
  // the page's HTML carries the real figure (search engines, no-JS readers); the browser rewinds it to 0 before first paint
  const mv = useMotionValue(to);
  useLayoutEffect(() => { if (!calm) mv.set(0); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const fmt = (v) => prefix + v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
  const text = useTransform(mv, fmt);
  const go = run === undefined ? seen : run;
  useEffect(() => {
    if (!go) return;
    if (calm) { mv.set(to); return; }
    mv.set(0);
    const c = animate(mv, to, { duration, ease: EASE, delay });
    return () => c.stop();
  }, [go, to]); // eslint-disable-line react-hooks/exhaustive-deps
  return <motion.span ref={ref} className={className}>{text}</motion.span>;
}

/* Pointer physics for a card: a spring tilt and a light that follows the pointer. */
export function useTilt(max = 7, light = 'rgba(255,255,255,.14)') {
  const rx = useSpring(0, { stiffness: 180, damping: 18 });
  const ry = useSpring(0, { stiffness: 180, damping: 18 });
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const glow = useMotionTemplate`radial-gradient(520px circle at ${mx}% ${my}%, ${light}, transparent 55%)`;
  const onPointerMove = (e) => {
    if (!fine(e)) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * max * 2);
    rx.set(-(py - 0.5) * max * 2);
    mx.set(px * 100);
    my.set(py * 100);
  };
  const onPointerLeave = () => { rx.set(0); ry.set(0); };
  return { rx, ry, glow, on: { onPointerMove, onPointerLeave } };
}

/* An element that leans toward the pointer, then springs home. */
export function Magnetic({ children, strength = 0.3, className }) {
  const x = useSpring(0, { stiffness: 260, damping: 17, mass: 0.5 });
  const y = useSpring(0, { stiffness: 260, damping: 17, mass: 0.5 });
  return (
    <motion.span
      className={'x-mag ' + (className || '')}
      style={{ x, y }}
      onPointerMove={(e) => {
        if (!fine(e)) return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * strength);
        y.set((e.clientY - r.top - r.height / 2) * strength);
      }}
      onPointerLeave={() => { x.set(0); y.set(0); }}
    >
      {children}
    </motion.span>
  );
}

export function Btn({ href, children, solid, small, className = '', ...rest }) {
  return (
    <motion.a
      href={href}
      className={'x-btn' + (solid ? ' solid' : '') + (small ? ' sm' : '') + ' ' + className}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2, ease: EASE }}
      {...rest}
    >
      {children}
    </motion.a>
  );
}

export function Arrow({ href, children, className = '' }) {
  return (
    <motion.a
      href={href}
      className={'x-arrow ' + className}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2, ease: EASE }}
    >
      <span>{children}</span>
      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </motion.a>
  );
}

/* Copy to clipboard; the icon turns into a drawn tick. */
export function Copy({ text, label = 'Copy', className = '' }) {
  const [ok, setOk] = useState(false);
  const t = useRef(0);
  return (
    <motion.button
      type="button"
      className={'x-copy ' + className}
      whileTap={{ scale: 0.92 }}
      aria-label={ok ? 'Copied' : label}
      onClick={async () => {
        try { await navigator.clipboard.writeText(text); } catch { /* clipboard blocked: the tick still confirms the press */ }
        setOk(true);
        clearTimeout(t.current);
        t.current = setTimeout(() => setOk(false), 1600);
      }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {ok ? (
          <motion.svg key="ok" viewBox="0 0 16 16" width="14" height="14" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }} aria-hidden="true">
            <motion.path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.35, ease: EASE }} />
          </motion.svg>
        ) : (
          <motion.svg key="cp" viewBox="0 0 16 16" width="14" height="14" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }} aria-hidden="true">
            <rect x="5" y="5" width="8.5" height="8.5" rx="2" fill="none" stroke="currentColor" strokeWidth="1.4" />
            <path d="M10.5 3.2V3a.8.8 0 0 0-.8-.8H3a.8.8 0 0 0-.8.8v6.7c0 .44.36.8.8.8h.2" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </motion.svg>
        )}
      </AnimatePresence>
      <span className="x-copy-t">{ok ? 'Copied' : label}</span>
    </motion.button>
  );
}

export function Mark({ size = 16 }) {
  return (
    <svg viewBox="0 0 67 67" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M22.21 67V44.6369H0V67H22.21Z" />
      <path d="M66.7038 22.3184H22.2534L0.0878906 44.6367H44.4634L66.7038 22.3184Z" />
      <path d="M22.21 0H0V22.3184H22.21V0Z" />
      <path d="M66.7198 0H44.5098V22.3184H66.7198V0Z" />
      <path d="M66.7198 44.6369H44.5098V67H66.7198V44.6369Z" />
    </svg>
  );
}
