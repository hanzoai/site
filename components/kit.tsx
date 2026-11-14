'use client';
/* The page kit: parts every rebuilt page draws on. Each page still composes its own layout and its own signature
   moment; these are the shared grammar (section heads, questions, rolling numbers, ticks, the closing band).
   HOW TO USE (states and styles live in app/system.css; full list in docs/build-notes/review/SYSTEM.md):
   - Links and asks: <A to>, <Go to solid>, <More to>, <Band title action to />.
   - <Tabs id="plans" tabs={['Personal','Team','API']} value={i} onChange={setI} /> + <TabPanel id="plans" i={0} value={i}>:
     a gliding pill, arrow keys / Home / End, every panel stays in the HTML.
   - <Sheet open={o} onClose={() => setO(false)} title kicker wide>…</Sheet>: from the right on desktop, from the bottom
     on phones; Esc, scrim and close shut it; focus goes in and comes back; scroll is held. (v2/DetailSheet is the
     button-and-sheet pair; Sheet is the bare, controlled sheet for any trigger.)
   - Loading, empty, error: <Skeleton lines={3} h={…} />, <Empty title action />, <Problem title detail onRetry />.
   - Media: <Img src w h alt priority /> and <Film src poster w h /> (see their notes for the performance rules). */
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { ComponentPropsWithRef, FocusEvent, FormEvent, HTMLAttributes, InputHTMLAttributes, KeyboardEvent, MouseEvent, ReactNode, Ref, VideoHTMLAttributes } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { motion, AnimatePresence, useInView, useReducedMotion, type PanInfo, type Transition } from 'motion/react';
import { EASE, Words, Rise, Magnetic, Copy } from './ui';
import { href } from '../lib/route';
import { SPRING } from '../lib/motion';

/* A link that stays inside the site when it can. */
export function A({ to, children, className, ...rest }: Omit<ComponentPropsWithRef<'a'>, 'href'> & { to?: string }) {
  const h = to === undefined ? undefined : href(to);
  // a bare link, no wrapper: pages lay links out as grid and flex items, and Morph and Cursor read the <a> itself
  if (h && h.startsWith('/')) return <Link href={h} className={className} {...rest}>{children}</Link>;
  const ext = h && !h.startsWith('https://hanzo.ai');
  return <a href={h} className={className} {...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...rest}>{children}</a>;
}

export function Go({ to, children, solid, className = '' }: { to?: string; children?: ReactNode; solid?: boolean; className?: string }) {
  return (
    <motion.span className="x-go" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.2, ease: EASE }}>
      <A to={to} className={'x-btn' + (solid ? ' solid' : '') + ' ' + className}>{children}</A>
    </motion.span>
  );
}

export function More({ to, children }: { to?: string; children?: ReactNode }) {
  return (
    <A to={to} className="x-arrow">
      <span>{children}</span>
      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </A>
  );
}

/* Section head: a small kicker, the line, one sentence. */
export function SecHead({ kicker, title, lede, center, dark, id }: { kicker?: ReactNode; title: string; lede?: ReactNode; center?: boolean; dark?: boolean; id?: string }) {
  return (
    <header className={'x-head' + (center ? ' center' : '') + (dark ? ' dark' : '')}>
      {kicker && <Rise as="p" className="x-kick" y={10}>{kicker}</Rise>}
      <Words text={title} />
      {lede && <Rise as="p" delay={0.2}>{lede}</Rise>}
      {id && <span id={id} />}
    </header>
  );
}

/* Questions that open in place. Strictly one open at a time; the first is open by default (first={-1} for none).
   Closed answers stay in the HTML as hidden="until-found", so search engines read them and the browser's Find in page
   opens the one it finds. Each question has an address (#q-what-does-a-plan-cost) that opens it on arrival. */
const qslug = (q: ReactNode) => (typeof q === 'string' ? 'q-' + q.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) : undefined);
export function Faq({ items, dark, first = 0, onOpen }: { items: readonly (readonly ReactNode[])[]; dark?: boolean; first?: number; onOpen?: (question: ReactNode) => void }) {
  const initOpen = first >= 0 && first < items.length ? first : -1;
  const [open, setOpen] = useState(initOpen);
  const [shut, setShut] = useState(() => new Set(items.map((_, i) => i).filter((i) => i !== initOpen)));
  const bodies = useRef<(HTMLDivElement | null)[]>([]);
  const show = useCallback((i: number) => {
    setShut((s) => { const n = new Set(s); n.delete(i); return n; });
    setOpen(i);
  }, []);
  // onOpen hears each question as the reader opens it, never as it is closed
  const toggle = (i: number) => {
    if (open === i) { setOpen(-1); return; }
    show(i);
    onOpen?.(items[i][0]);
  };
  // React treats `hidden` as a boolean, so "until-found" is set by hand once the answer has fully closed
  useEffect(() => {
    bodies.current.forEach((el, i) => { if (!el) return; if (shut.has(i) && open !== i) el.setAttribute('hidden', 'until-found'); else el.removeAttribute('hidden'); });
  }, [shut, open]);
  useEffect(() => {
    const offs = bodies.current.map((el, i) => { if (!el) return null; const f = () => show(i); el.addEventListener('beforematch', f); return () => el.removeEventListener('beforematch', f); });
    const h = decodeURIComponent(location.hash.slice(1));
    const at = items.findIndex(([q]) => qslug(q) === h);
    if (at >= 0) { show(at); setTimeout(() => document.getElementById(h)?.scrollIntoView({ block: 'center' }), 120); }
    return () => offs.forEach((f) => f && f());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <ul className={'x-faq' + (dark ? ' dark' : '')}>
      {items.map(([q, a], i) => {
        const on = open === i;
        return (
          <li key={typeof q === 'string' ? q : i} id={qslug(q)}>
            <button type="button" aria-expanded={on} aria-controls={`${qslug(q) || 'q' + i}-a`} onClick={() => toggle(i)}>
              <span>{q}</span>
              <i className="x-faq-ic" aria-hidden="true">
                <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M3 8h10" />
                  <path className="x-faq-v" d="M8 3v10" />
                </svg>
              </i>
            </button>
            <motion.div
              className="x-faq-a"
              initial={false}
              animate={on ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
              transition={{ duration: 0.42, ease: EASE }}
              onAnimationComplete={() => { if (!on) setShut((s) => new Set(s).add(i)); }}
            >
              <div id={`${qslug(q) || 'q' + i}-a`} ref={(el) => { bodies.current[i] = el; }}>{a}</div>
            </motion.div>
          </li>
        );
      })}
    </ul>
  );
}

/* A figure on a split-flap board: each character spins through the board before it settles, left to right. */
const FLAP = '0123456789$+M,.';
export function Flap({ value, className = '' }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.6 });
  const calm = useReducedMotion();
  const [shown, setShown] = useState(value); // the real figure in the HTML; the board spins only in the browser
  useEffect(() => {
    if (!seen) return;
    if (calm) { setShown(value); return; }
    const chars = [...value];
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
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
export function Tick({ delay = 0, size = 22 }: { delay?: number; size?: number }) {
  const ref = useRef<SVGSVGElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.8 });
  return (
    <svg ref={ref} className="x-tick" viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <motion.circle cx="12" cy="12" r="10.5" fill="none" strokeWidth="1.5" initial={{ pathLength: 0 }} animate={seen ? { pathLength: 1 } : {}} transition={{ duration: 0.6, ease: EASE, delay }} />
      <motion.path d="M7.5 12.5l3 3 6-6.5" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={seen ? { pathLength: 1 } : {}} transition={{ duration: 0.4, ease: EASE, delay: delay + 0.45 }} />
    </svg>
  );
}

/* The closing band of a page: one line, one action. */
export function Band({ title, lede, action, to, note }: { title: string; lede?: ReactNode; action?: ReactNode; to?: string; note?: ReactNode }) {
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

interface TabItem { label: string; disabled?: boolean }

/* ---------- Tabs: a gliding pill over real tab buttons ----------
   tabs: labels (strings) or { label, disabled }. value: the selected index. Arrow keys move and select, Home / End jump.
   Pair with <TabPanel id i value> so every panel stays in the server HTML (hidden ones are hidden, not removed). */
export function Tabs({ id, tabs, value, onChange, label, size, className = '' }: { id: string; tabs: (string | TabItem)[]; value: number; onChange: (i: number) => void; label?: string; size?: string; className?: string }) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const items: TabItem[] = tabs.map((t) => (typeof t === 'string' ? { label: t } : t));
  const move = (from: number, step: number) => {
    for (let k = 1; k <= items.length; k++) {
      const j = (from + step * k + items.length * k) % items.length;
      if (!items[j].disabled) { onChange(j); refs.current[j]?.focus(); return; }
    }
  };
  const key = (e: KeyboardEvent, i: number) => {
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
          {value === i && <motion.span layoutId={`${id}-pill`} className="x-tab-pill" transition={SPRING.pill as Transition} aria-hidden="true" />}
          <span className="x-tab-t">{t.label}</span>
        </button>
      ))}
    </div>
  );
}
export function TabPanel({ id, i, value, children, className = '' }: { id: string; i: number; value: number; children?: ReactNode; className?: string }) {
  return (
    <div role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={value !== i} tabIndex={0} className={className}>
      {children}
    </div>
  );
}

/* ---------- Sheet: the bare, controlled sheet ---------- */
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';
export function Sheet({ open, onClose, title, kicker, wide = false, children, className = '' }: { open: boolean; onClose: () => void; title?: ReactNode; kicker?: ReactNode; wide?: boolean; children?: ReactNode; className?: string }) {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const back = useRef<HTMLElement | null>(null);
  const shut = useRef(onClose);
  shut.current = onClose;
  const tid = useId();
  useEffect(() => setHost(document.body), []);
  const phone = typeof window !== 'undefined' && matchMedia('(max-width: 700px)').matches;
  useEffect(() => {
    if (!open) return;
    back.current = document.activeElement as HTMLElement | null;
    window.__lenis?.stop();
    document.documentElement.classList.add('x-lock');
    const t = setTimeout(() => box.current?.querySelector<HTMLElement>('.x-sheet2-x')?.focus(), 30);
    const key = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') { e.stopPropagation(); shut.current(); return; }
      if (e.key !== 'Tab' || !box.current) return; // keep focus inside the sheet
      const f = [...box.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
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
            transition={SPRING.sheet as Transition}
            {...(phone ? { drag: 'y' as const, dragConstraints: { top: 0, bottom: 0 }, dragElastic: { top: 0, bottom: 0.6 }, onDragEnd: (_: unknown, i: PanInfo) => { if (i.offset.y > 90 || i.velocity.y > 600) onClose(); } } : {})}
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
export function Skeleton({ lines = 0, h, w = '100%', radius, className = '', label = 'Loading' }: { lines?: number; h?: number | string; w?: number | string; radius?: number | string; className?: string; label?: string }) {
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
export function Empty({ title, detail, action, to, center = false, className = '' }: { title?: ReactNode; detail?: ReactNode; action?: ReactNode; to?: string; center?: boolean; className?: string }) {
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
export function Problem({ title, detail, onRetry, retry = 'Try again', action, to, center = false, className = '' }: { title?: ReactNode; detail?: ReactNode; onRetry?: () => void; retry?: ReactNode; action?: ReactNode; to?: string; center?: boolean; className?: string }) {
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
export function Img({ src, alt, w, h, priority = false, sizes, className = '', style, ...rest }: Omit<ComponentPropsWithRef<'img'>, 'width' | 'height'> & { w?: number | string; h?: number | string; priority?: boolean }) {
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
export function Film({ src, poster, w, h, label, className = '', loop = true, ...rest }: Omit<VideoHTMLAttributes<HTMLVideoElement>, 'width' | 'height' | 'src'> & { src: string; w?: number | string; h?: number | string; label?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);
  const calm = useReducedMotion();
  const play = useCallback((v: HTMLVideoElement | null, on: boolean) => { if (!v) return; if (on) v.play?.().catch(() => {}); else v.pause?.(); }, []);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const save = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
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

/* ---------- Cta: the one button ----------
   kind: 'solid' (the one per screen) | 'quiet' (outlined) | 'link' (text with a chevron). size: 'sm' 36 | 'md' 44 | 'lg' 52.
   to: a link (internal pages stay in the site); without `to` it is a <button> (onClick). id: the analytics id, sent as
   a cta_click event and written as data-cta. thumb: true makes it the page's ask (the ask bar carries its words).
   busy / disabled as on Btn. Leaving for another site (hanzo.ai/signup, the console) shows a short pressed state. */
export function Cta({ to, onClick, children, kind = 'solid', size = 'md', id, thumb, busy, disabled, className = '', ref, ...rest }: Omit<HTMLAttributes<HTMLElement>, 'onClick'> & { ref?: Ref<HTMLButtonElement>; type?: 'button' | 'submit' | 'reset'; target?: string; to?: string; onClick?: (e: MouseEvent<HTMLElement>) => void; kind?: string; size?: string; id?: string; thumb?: boolean; busy?: boolean; disabled?: boolean }) {
  const [leaving, setLeaving] = useState(false);
  const cls = kind === 'link' ? 'x-arrow' : 'x-btn' + (kind === 'solid' ? ' solid' : '') + (size === 'lg' ? ' lg' : size === 'sm' ? ' sm' : '');
  const fire = (e: MouseEvent<HTMLElement>) => {
    dispatchEvent(new CustomEvent('hz-event', { detail: { name: 'cta_click', id, label: typeof children === 'string' ? children : undefined, path: location.pathname } }));
    if (to && /^https?:/.test(href(to) || '') && !e.metaKey && !e.ctrlKey) { setLeaving(true); setTimeout(() => setLeaving(false), 2500); }
    onClick?.(e);
  };
  const props = {
    className: cls + ' ' + className,
    'data-cta': id,
    'data-thumb': thumb ? (typeof children === 'string' ? children : '') : undefined,
    'aria-busy': busy || leaving || undefined,
    'aria-disabled': disabled || undefined,
    onClick: disabled ? (e: MouseEvent<HTMLElement>) => e.preventDefault() : fire,
    ...rest,
  };
  const body = kind === 'link'
    ? <><span>{children}</span><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></>
    : children;
  if (to && !disabled) return <A to={to} {...props} ref={ref as unknown as Ref<HTMLAnchorElement>}>{body}</A>; // the ref is for whichever element renders: a button, or an anchor with `to`
  return <button type="button" disabled={disabled} {...props} ref={ref}>{body}</button>;
}

/* ---------- Field: Hanzo's own input ----------
   <Field label="Work email" name="email" type="email" required autoComplete="email" hint="…" />
   48 px, 16 px text (no zoom on phones), a real <label>, hint and error tied by aria-describedby, checked on blur
   (the browser's own message), aria-invalid while wrong. as="textarea" for long answers. */
export function Field({ label, name, type = 'text', as, hint, error, required, className = '', onBlur, ...rest }: Omit<InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>, 'onBlur' | 'name' | 'type' | 'required'> & { rows?: number; label: ReactNode; name?: string; type?: string; as?: 'input' | 'textarea'; hint?: ReactNode; error?: ReactNode; required?: boolean; onBlur?: (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void }) {
  const id = useId();
  const [msg, setMsg] = useState('');
  const shown = error || msg;
  const Tag = as === 'textarea' ? 'textarea' : 'input';
  const im = type === 'email' ? 'email' : type === 'tel' ? 'tel' : type === 'url' ? 'url' : undefined;
  return (
    <div className={'x-field ' + className}>
      <label htmlFor={id}>{label}{required && <span aria-hidden="true"> *</span>}</label>
      <Tag
        id={id}
        name={name}
        type={Tag === 'input' ? type : undefined}
        inputMode={im}
        required={required}
        aria-invalid={shown ? true : undefined}
        aria-describedby={hint || shown ? id + '-m' : undefined}
        className="x-input2"
        onBlur={(e) => { setMsg(e.target.checkValidity() ? '' : e.target.validationMessage); onBlur?.(e); }}
        onInput={(e: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => { if (msg && (e.target as HTMLInputElement).checkValidity()) setMsg(''); }}
        {...rest}
      />
      <span id={id + '-m'} className="x-field-msg" aria-live="polite">{shown || hint || ''}</span>
    </div>
  );
}

/* ---------- DataTable: the one table ----------
   cols: [{ key, label, num, subject }]; rows: objects keyed the same. The first column is the row header (sticky).
   subject: the column being compared gets a grey tint (never a hue). A missing value renders an honest "—" with
   gap (an accessible name for it, from content/ui-strings.json when approved). caption is required (it names the table). */
export function DataTable({ caption, cols, rows, gap = 'No value', className = '' }: { caption: ReactNode; cols: { key: string; label: ReactNode; num?: boolean; subject?: boolean }[]; rows: Record<string, ReactNode>[]; gap?: string; className?: string }) {
  const id = useId();
  return (
    <div className={'x-table-wrap ' + className} role="region" aria-labelledby={id} tabIndex={0}>
      <table className="x-table">
        <caption id={id}>{caption}</caption>
        <thead>
          <tr>{cols.map((c) => <th key={c.key} scope="col" className={c.num ? 'num' : undefined} data-subject={c.subject || undefined}>{c.label}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {cols.map((c, j) => {
                const v = r[c.key];
                const cell = v === undefined || v === null || v === '' ? <span className="x-gap" aria-label={gap}>—</span> : v;
                return j === 0
                  ? <th key={c.key} scope="row" data-subject={c.subject || undefined}>{cell}</th>
                  : <td key={c.key} className={c.num ? 'num' : undefined} data-subject={c.subject || undefined}>{cell}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------- CodeBlock: the one code surface ----------
   <CodeBlock code={'curl -fsSL https://hanzo.sh | sh'} prompt label="Install" />
   13.5/1.65 mono on a dark plate; scrolls on its own (keyboard reachable); lines starting with # or // are dimmed.
   prompt draws a "$ " that is not selectable and not copied. Copy copies exactly the displayed code, and says
   Copied only if it really copied. */
export function CodeBlock({ code, label, prompt = false, copy = true, className = '' }: { code: string; label?: string; prompt?: boolean; copy?: boolean; className?: string }) {
  const lines = String(code).replace(/\n$/, '').split('\n');
  return (
    <figure className={'x-codeblock ' + className} data-room="dark">
      {(label || copy) && (
        <figcaption className="x-codeblock-h">
          <span>{label}</span>
          {copy && <Copy text={lines.join('\n')} />}
        </figcaption>
      )}
      <pre tabIndex={0} aria-label={label || 'Code'}><code>
        {lines.map((l, i) => (
          <span key={i} className={'x-codeblock-l' + (/^\s*(#|\/\/)/.test(l) ? ' c' : '')}>
            {prompt && l.trim() && !/^\s*(#|\/\/)/.test(l) && <span className="x-codeblock-p" aria-hidden="true">$ </span>}
            {l || ' '}{'\n'}
          </span>
        ))}
      </code></pre>
    </figure>
  );
}

/* ---------- Stat: a figure exactly as Hanzo prints it ----------
   <Stat value="1,600+" label="open repositories" />  value is a string and is shown byte for byte; if it starts
   with a number and sits below the fold, it counts up to it once (same separators and decimals) when it arrives.
   Tabular figures and a fixed width, so nothing shifts while it counts. */
export function Stat({ value, label, note, as = 'div', className = '' }: { value: string; label?: ReactNode; note?: ReactNode; as?: 'div' | 'span' | 'li' | 'p' | 'dd' | 'dt'; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);
  const calm = useReducedMotion();
  const m = /^([^0-9]*)([0-9][0-9,]*(?:\.[0-9]+)?)(.*)$/.exec(value || '');
  useEffect(() => {
    const el = ref.current;
    if (!m || calm || !el) return;
    if (el.getBoundingClientRect().top < innerHeight) return; // already on screen: never rewind what was read
    const [, pre, num, post] = m;
    const target = parseFloat(num.replace(/,/g, ''));
    const dec = (num.split('.')[1] || '').length;
    const commas = num.includes(',');
    const fmt = (v: number) => pre + (commas ? v.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }) : v.toFixed(dec)) + post;
    setShown(fmt(0));
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (t: number) => {
        const k = Math.min(1, (t - t0) / 1200), ease = 1 - Math.pow(1 - k, 4);
        setShown(k < 1 ? fmt(target * ease) : value);
        if (k < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.6 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [value, calm]); // eslint-disable-line react-hooks/exhaustive-deps
  const Tag = as;
  return (
    <Tag className={'x-stat ' + className}>
      <span ref={ref} className="x-stat-v" style={{ minWidth: value.length + 'ch' }} aria-label={value}><span aria-hidden="true">{shown}</span></span>
      {label && <span className="x-stat-l">{label}</span>}
      {note && <span className="x-stat-n">{note}</span>}
    </Tag>
  );
}
