'use client';
/* The motion and control primitives every page uses. HOW TO USE (docs/build-notes/review/SYSTEM.md has the full list):
   - Headlines: <Lines as="h1" lines={['Smarter, Faster,', 'Pick all three.']} /> is the line-mask reveal (each line
     rises out of its own mask, 1.1 s, once; the words are in the server HTML). <Words> is the older word-by-word blur.
   - Arrival: <Rise> (max two fade-ups per page). Figures: <Count to={3.02} decimals={2} suffix="x" />.
   - Pointer: useTilt(), <Magnetic>. Controls: <Btn href solid small busy disabled selected>, <Arrow>, <Copy text>;
     copyText(str) → true only if the copy happened; useCalm() → true under reduced motion (live, follows changes).
   - Tokens: EASE and SPRING here, or the full set in lib/motion.js. */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { play } from '../lib/sound';
import {
  motion, AnimatePresence, animate, useInView, useMotionValue, useMotionTemplate,
  useSpring, useTransform, useReducedMotion,
} from 'motion/react';

export const EASE = [0.16, 1, 0.3, 1];

/* true when the visitor asks for less motion; follows the setting live (server and first render: false) */
export function useCalm() {
  const [calm, setCalm] = useState(false);
  useEffect(() => {
    const mq = matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setCalm(mq.matches);
    on(); mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return calm;
}
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

/* The line-mask headline reveal (BRIEF-v3 §8 pattern 2): one line per mask, rising 110% → 0 over 1.1 s, staggered
   80 ms, once in view (or on load with play="load", for a hero). Screen readers and search engines get the whole
   sentence; under reduced motion the lines are simply there. */
export function Lines({ lines, as = 'h2', className, delay = 0, play = 'view', amount = 0.5, ...rest }) {
  const Tag = motion[as];
  const list = Array.isArray(lines) ? lines : [lines];
  const show = { s: { transition: { staggerChildren: 0.08, delayChildren: delay } } };
  const when = play === 'load' ? { animate: 's' } : { whileInView: 's', viewport: { once: true, amount } };
  return (
    <Tag className={className} initial="h" {...when} variants={{ h: {}, ...show }} {...rest}>
      <span className="x-sr">{list.join(' ')}</span>
      {list.map((l, i) => (
        <span key={i} className="x-line" aria-hidden="true">
          <motion.span className="x-line-in" variants={{ h: { y: '110%' }, s: { y: '0%', transition: { duration: 1.1, ease: EASE } } }}>{l}</motion.span>
        </span>
      ))}
    </Tag>
  );
}

/* A section's heading and lede, drawn in the HTML as they are read: no reveal, so they paint with the first frame. */
export function Head({ id, title, lede, center, dark }) {
  return (
    <header className={'x-head' + (center ? ' center' : '') + (dark ? ' dark' : '')}>
      <h2 id={id}>{title}</h2>
      {lede && <p>{lede}</p>}
    </header>
  );
}

/* A number that counts up to its value when it is seen, in tabular figures. */
export function Count({ to, decimals = 0, prefix = '', suffix = '', duration = 1.6, run, className, delay = 0 }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.6 });
  const calm = useReducedMotion();
  // the page's HTML carries the real figure (search engines, no-JS readers); the browser rewinds it to 0 once the span is
  // listening (an effect, not a layout effect: Motion subscribes the text in the child's effect, which runs before this one)
  const mv = useMotionValue(to);
  useEffect(() => { if (!calm) mv.set(0); }, []); // eslint-disable-line react-hooks/exhaustive-deps
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

/* busy: a ring turns in place of the label (same width). disabled: quiet, not clickable. selected: inverted. */
export function Btn({ href, children, solid, small, busy, disabled, selected, className = '', ...rest }) {
  const off = busy || disabled;
  return (
    <motion.a
      href={off ? undefined : href}
      className={'x-btn' + (solid ? ' solid' : '') + (small ? ' sm' : '') + ' ' + className}
      aria-busy={busy || undefined}
      aria-disabled={disabled || undefined}
      aria-pressed={selected === undefined ? undefined : !!selected}
      whileHover={off ? undefined : { scale: 1.02 }}
      whileTap={off ? undefined : { scale: 0.98 }}
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

/* Copies text and says so only when it truly did (clipboard API, then a select-and-copy fallback). Returns true/false.
   Use it for any copy button: copyText(cmd).then((ok) => ok && showTick()). Never confirm a copy that failed. */
export async function copyText(text) {
  try { await navigator.clipboard.writeText(text); play('chime'); return true; } catch { /* blocked or insecure: try the old way */ }
  try {
    const ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none';
    document.body.appendChild(ta); ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    if (ok) play('chime');
    return ok;
  } catch { return false; }
}

/* Copy to clipboard; the icon turns into a drawn tick, only when the copy really happened. */
export function Copy({ text, label = 'Copy', className = '', onCopy }) {
  const [ok, setOk] = useState(false);
  const t = useRef(0);
  return (
    <motion.button
      type="button"
      className={'x-copy ' + className}
      whileTap={{ scale: 0.92 }}
      aria-label={ok ? 'Copied' : label}
      onClick={async () => {
        if (!(await copyText(text))) return; // a failed copy never says "Copied"
        onCopy?.();
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
