'use client';
/* The page kit: parts every rebuilt page draws on. Each page still composes its own layout and its own signature
   moment; these are the shared grammar (section heads, questions, rolling numbers, ticks, the closing band).
   HOW TO USE (states and styles live in app/system.css; full list in docs/review/SYSTEM.md):
   - Links and asks: <A to>, <Go to solid>, <More to>, <Band title action to />.
   - <Tabs id="plans" tabs={['Personal','Team','API']} value={i} onChange={setI} /> + <TabPanel id="plans" i={0} value={i}>:
     a gliding pill, arrow keys / Home / End, every panel stays in the HTML.
   - <Sheet open={o} onClose={() => setO(false)} title kicker wide>…</Sheet>: from the right on desktop, from the bottom
     on phones; Esc, scrim and close shut it; focus goes in and comes back; scroll is held. (v2/DetailSheet is the
     button-and-sheet pair; Sheet is the bare, controlled sheet for any trigger.)
   - Loading, empty, error: <Skeleton lines={3} h={…} />, <Empty title action />, <Problem title detail onRetry />.
   - Media: <Img src w h alt priority /> and <Film src poster w h /> (see their notes for the performance rules). */
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { EASE, Words, Rise, Magnetic } from './ui';
import { href } from '../lib/route';
import { SPRING } from '../lib/motion';

/* A link that stays inside the site when it can. */
export function A({ to, children, className, ...rest }) {
  const h = href(to);
  // a bare link, no wrapper: pages lay links out as grid and flex items, and Morph and Cursor read the <a> itself
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

/* ---------- Tabs: a gliding pill over real tab buttons ----------
   tabs: labels (strings) or { label, disabled }. value: the selected index. Arrow keys move and select, Home / End jump.
   Pair with <TabPanel id i value> so every panel stays in the server HTML (hidden ones are hidden, not removed). */
export function Tabs({ id, tabs, value, onChange, label, size, className = '' }) {
  const refs = useRef([]);
  const items = tabs.map((t) => (typeof t === 'string' ? { label: t } : t));
  const move = (from, step) => {
    for (let k = 1; k <= items.length; k++) {
      const j = (from + step * k + items.length * k) % items.length;
      if (!items[j].disabled) { onChange(j); refs.current[j]?.focus(); return; }
    }
  };
  const key = (e, i) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); move(i, 1); }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); move(i, -1); }
    else if (e.key === 'Home') { e.preventDefault(); move(-1, 1); }
    else if (e.key === 'End') { e.preventDefault(); move(items.length, -1); }
  };
  return (
    <div className={'x-tablist' + (size === 'lg' ? ' lg' : '') + ' ' + className} role="tablist" aria-label={label}>
      {items.map((t, i) => (
        <button
          key={t.label}
          ref={(el) => { refs.current[i] = el; }}
          type="button"
          role="tab"
          id={`${id}-tab-${i}`}
          aria-controls={`${id}-panel-${i}`}
          aria-selected={value === i}
          tabIndex={value === i ? 0 : -1}
          disabled={t.disabled}
          className="x-tab"
          onClick={() => onChange(i)}
          onKeyDown={(e) => key(e, i)}
        >
          {value === i && <motion.span layoutId={`${id}-pill`} className="x-tab-pill" transition={SPRING.pill} aria-hidden="true" />}
          <span className="x-tab-t">{t.label}</span>
        </button>
      ))}
    </div>
  );
}
export function TabPanel({ id, i, value, children, className = '' }) {
  return (
    <div role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={value !== i} tabIndex={0} className={className}>
      {children}
    </div>
  );
}

/* ---------- Sheet: the bare, controlled sheet ---------- */
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';
export function Sheet({ open, onClose, title, kicker, wide = false, children, className = '' }) {
  const [host, setHost] = useState(null);
  const box = useRef(null);
  const back = useRef(null);
  const shut = useRef(onClose);
  shut.current = onClose;
  const tid = useId();
  useEffect(() => setHost(document.body), []);
  const phone = typeof window !== 'undefined' && matchMedia('(max-width: 700px)').matches;
  useEffect(() => {
    if (!open) return;
    back.current = document.activeElement;
    window.__lenis?.stop();
    document.documentElement.classList.add('x-lock');
    const t = setTimeout(() => box.current?.querySelector('.x-sheet2-x')?.focus(), 30);
    const key = (e) => {
      if (e.key === 'Escape') { e.stopPropagation(); shut.current(); return; }
      if (e.key !== 'Tab' || !box.current) return; // keep focus inside the sheet
      const f = [...box.current.querySelectorAll(FOCUSABLE)];
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    };
    addEventListener('keydown', key, true);
    return () => {
      clearTimeout(t); removeEventListener('keydown', key, true);
      window.__lenis?.start(); document.documentElement.classList.remove('x-lock');
      back.current?.focus?.();
    };
  }, [open]);
  if (!host) return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="x-sheet2-wrap">
          <motion.div className="x-sheet2-scrim" onClick={onClose} aria-hidden="true" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} />
          <motion.div
            ref={box}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? tid : undefined}
            className={'x-sheet2' + (wide ? ' wide' : '') + ' ' + className}
            initial={phone ? { y: '100%' } : { x: '100%' }}
            animate={phone ? { y: 0 } : { x: 0 }}
            exit={phone ? { y: '100%' } : { x: '100%' }}
            transition={SPRING.sheet}
            {...(phone ? { drag: 'y', dragConstraints: { top: 0, bottom: 0 }, dragElastic: { top: 0, bottom: 0.6 }, onDragEnd: (_, i) => { if (i.offset.y > 90 || i.velocity.y > 600) onClose(); } } : {})}
          >
            {phone && <span className="x-grip" aria-hidden="true" />}
            <div className="x-sheet2-head">
              <div>
                {kicker && <span className="x-sheet2-kick">{kicker}</span>}
                {title && <h2 id={tid}>{title}</h2>}
              </div>
              <button type="button" className="x-sheet2-x" onClick={onClose} aria-label="Close">
                <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
              </button>
            </div>
            <div className="x-sheet2-body">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    host,
  );
}

/* ---------- loading, empty, error ----------
   Skeleton holds the exact box the content will take, so nothing moves when it arrives. Give it the real height. */
export function Skeleton({ lines = 0, h, w = '100%', radius, className = '', label = 'Loading' }) {
  if (lines) {
    return (
      <span className={'x-skel-group ' + className} role="status" aria-label={label} style={{ display: 'block' }}>
        {Array.from({ length: lines }, (_, i) => <span key={i} className="x-skel x-skel-line" style={{ width: i === lines - 1 && lines > 1 ? '62%' : w }} />)}
      </span>
    );
  }
  return <span className={'x-skel ' + className} role="status" aria-label={label} style={{ height: h, width: w, borderRadius: radius }} />;
}
/* Nothing to show yet: say so in the page's (Hanzo's) words and offer the one next step. */
export function Empty({ title, detail, action, to, center = false, className = '' }) {
  return (
    <div className={'x-state' + (center ? ' center' : '') + ' ' + className}>
      <span className="x-state-mark" aria-hidden="true"><svg viewBox="0 0 16 16" width="16" height="16"><circle cx="8" cy="8" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeDasharray="2.5 2.5" /></svg></span>
      {title && <p className="x-state-t">{title}</p>}
      {detail && <p className="x-state-d">{detail}</p>}
      {action && to && <More to={to}>{action}</More>}
    </div>
  );
}
/* Something failed: what happened, and a way on (retry, or the place it lives on hanzo.ai). role="alert" announces it. */
export function Problem({ title, detail, onRetry, retry = 'Try again', action, to, center = false, className = '' }) {
  return (
    <div className={'x-state error' + (center ? ' center' : '') + ' ' + className} role="alert">
      <span className="x-state-mark" aria-hidden="true"><svg viewBox="0 0 16 16" width="16" height="16"><path d="M8 4.5v4.2M8 11.2v.3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg></span>
      {title && <p className="x-state-t">{title}</p>}
      {detail && <p className="x-state-d">{detail}</p>}
      <div className="x-row-links tight">
        {onRetry && <button type="button" className="x-btn sm" onClick={onRetry}>{retry}</button>}
        {action && to && <More to={to}>{action}</More>}
      </div>
    </div>
  );
}

/* ---------- media: the performance rules, built in ----------
   Img: always give w and h (the box is reserved, CLS 0). `priority` only on the ONE image that is the page's LCP (it
   loads eagerly with fetchpriority=high); everything else is lazy and decodes off the main thread. First-view images
   ≤ 250 KB, AVIF or WebP where Hanzo has them. */
export function Img({ src, alt, w, h, priority = false, sizes, className = '', style, ...rest }) {
  return (
    <img
      src={src}
      alt={alt ?? ''}
      width={w}
      height={h}
      sizes={sizes}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : 'auto'}
      className={'x-media ' + className}
      style={style}
      {...rest}
    />
  );
}
/* Film: a muted, looping clip that plays only while it is on screen and the tab is visible, never under reduced motion
   or Data Saver (the poster stays), and never downloads before it nears the screen. Give w and h (or a .x-ratio box).
   No autoplay clip above 1.5 MB; nothing autoplays above the fold before first paint. */
export function Film({ src, poster, w, h, label, className = '', loop = true, ...rest }) {
  const ref = useRef(null);
  const [near, setNear] = useState(false);
  const calm = useReducedMotion();
  const play = useCallback((v, on) => { if (!v) return; if (on) v.play?.().catch(() => {}); else v.pause?.(); }, []);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const save = navigator.connection?.saveData;
    let seen = false;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setNear(true);
      seen = e.intersectionRatio > 0.15;
      play(v, seen && !calm && !save && !document.hidden);
    }, { rootMargin: '300px 0px', threshold: [0, 0.15] });
    io.observe(v);
    const vis = () => play(v, seen && !calm && !save && !document.hidden);
    document.addEventListener('visibilitychange', vis);
    return () => { io.disconnect(); document.removeEventListener('visibilitychange', vis); v.pause?.(); };
  }, [calm, play]);
  return (
    <video
      ref={ref}
      className={'x-media ' + className}
      width={w}
      height={h}
      poster={poster}
      muted
      playsInline
      loop={loop}
      preload="none"
      aria-label={label}
      {...(label ? {} : { 'aria-hidden': true })}
      {...rest}
    >
      {near && <source src={src} />}
    </video>
  );
}
