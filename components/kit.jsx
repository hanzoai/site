'use client';
/* The page kit: parts every rebuilt page draws on. Each page still composes its own layout and its own signature
   moment; these are the shared grammar (section heads, questions, rolling numbers, ticks, the closing band). */
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { EASE, Words, Rise, Magnetic } from './ui';
import { href } from '../lib/route';

/* A link that stays inside the site when it can. */
export function A({ to, children, className, ...rest }) {
  const h = href(to);
  if (h && h.startsWith('/')) return <Link href={h} className={className} {...rest}>{children}</Link>;
  const ext = h && !h.startsWith('https://hanzo.ai');
  return <a href={h} className={className} {...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...rest}>{children}</a>;
}

export function Go({ to, children, solid, className = '' }) {
  return (
    <motion.span className="x-go" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.2, ease: EASE }}>
      <A to={to} className={'x-btn' + (solid ? ' solid' : '') + ' ' + className}>{children}</A>
    </motion.span>
  );
}

export function More({ to, children }) {
  return (
    <A to={to} className="x-arrow">
      <span>{children}</span>
      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </A>
  );
}

/* Section head: a small kicker, the line, one sentence. */
export function SecHead({ kicker, title, lede, center, dark, id }) {
  return (
    <header className={'x-head' + (center ? ' center' : '') + (dark ? ' dark' : '')}>
      {kicker && <Rise as="p" className="x-kick" y={10}>{kicker}</Rise>}
      <Words text={title} />
      {lede && <Rise as="p" delay={0.2}>{lede}</Rise>}
      {id && <span id={id} />}
    </header>
  );
}

/* Questions that open in place; one open at a time. */
export function Faq({ items, dark }) {
  const [open, setOpen] = useState(0);
  return (
    <ul className={'x-faq' + (dark ? ' dark' : '')}>
      {items.map(([q, a], i) => (
        <Rise as="li" key={q} delay={i * 0.04} y={16}>
          <button type="button" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
            <span>{q}</span>
            <motion.i animate={{ rotate: open === i ? 45 : 0 }} transition={{ duration: 0.35, ease: EASE }} aria-hidden="true">+</motion.i>
          </button>
          {/* every answer stays in the page (search engines, find-in-page); closed ones are collapsed */}
          <motion.div className="x-faq-a" initial={false} animate={open === i ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }} transition={{ duration: 0.45, ease: EASE }} aria-hidden={open !== i} inert={open !== i}>
            <div>{a}</div>
          </motion.div>
        </Rise>
      ))}
    </ul>
  );
}

/* A figure on a split-flap board: each character spins through the board before it settles, left to right. */
const FLAP = '0123456789$+M,.';
export function Flap({ value, className = '' }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.6 });
  const calm = useReducedMotion();
  const [shown, setShown] = useState(value); // the real figure in the HTML; the board spins only in the browser
  useEffect(() => {
    if (!seen) return;
    if (calm) { setShown(value); return; }
    const chars = [...value];
    const start = performance.now();
    let raf = 0;
    const tick = (t) => {
      const el = (t - start) / 1000;
      let done = true;
      setShown(chars.map((c, i) => {
        const stop = 0.35 + i * 0.09;
        if (el >= stop || !/[0-9]/.test(c)) return c;
        done = false;
        return FLAP[Math.floor((el * 30 + i * 7) % 10)];
      }).join(''));
      if (!done) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, calm, value]);
  return (
    <span ref={ref} className={'x-flap ' + className} aria-label={value}>
      {[...shown].map((c, i) => <span key={i} aria-hidden="true">{c}</span>)}
    </span>
  );
}

/* A check that draws itself once it is reached. */
export function Tick({ delay = 0, size = 22 }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.8 });
  return (
    <svg ref={ref} className="x-tick" viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <motion.circle cx="12" cy="12" r="10.5" fill="none" strokeWidth="1.5" initial={{ pathLength: 0 }} animate={seen ? { pathLength: 1 } : {}} transition={{ duration: 0.6, ease: EASE, delay }} />
      <motion.path d="M7.5 12.5l3 3 6-6.5" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={seen ? { pathLength: 1 } : {}} transition={{ duration: 0.4, ease: EASE, delay: delay + 0.45 }} />
    </svg>
  );
}

/* The closing band of a page: one line, one action. */
export function Band({ title, lede, action, to, note }) {
  return (
    <section className="x-band" data-room="dark">
      <div className="x-wrap">
        <Words text={title} />
        {lede && <Rise as="p" delay={0.2}>{lede}</Rise>}
        <Rise delay={0.3} className="x-band-act">
          <Magnetic><Go to={to} solid>{action}</Go></Magnetic>
          {note}
        </Rise>
      </div>
    </section>
  );
}
