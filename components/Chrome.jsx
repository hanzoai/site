'use client';
/* The shell every page shares (mounted once in app/layout.jsx; pages import nothing from here except Marquee):
   - Smooth: Lenis weighted scrolling (fine pointers, loaded after first paint), the site-wide reduced-motion policy (MotionConfig reducedMotion="user"),
     [data-off] on any <main> section that is off screen (pause your CSS loops with `[data-off] .x { animation-play-state: paused }`),
     and every new page starting at its top.
   - Progress, Header, Footer: the scroll bar and the behaviour of Hanzo's own header and footer (their HTML is
     rendered on the server by components/Shell.jsx, so it costs no JS). Mark a dark section with data-room="dark" and
     the header turns dark over it.
   - Marquee: <Marquee items={[{ name, src, href }]} label="Trusted by" reverse /> an endless logo strip (it stands still
     under reduced motion and rests under the pointer or focus). An item with { w, h, hang } is a wordmark drawn at w x h px
     and sat on the strip's one baseline: hang is how far the logo falls below its text (a smile, a descender, a mark).
   - After every in-site navigation, focus moves to the new page's <main> h1 (tabindex -1, no ring, no scroll). */
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { MotionConfig } from 'motion/react';
import { animate, scroll } from 'motion';
import Nav from './Nav';
import HeaderTools from './HeaderTools';
import { onDomChange } from '../lib/domwatch';
import { lean } from '../lib/tilt';

/* Smooth, weighted scrolling (Lenis) and one motion policy for the whole page. */
export function Smooth({ children }) {
  // Lenis loads after first paint (it is not needed to read the page) and only for fine pointers: touch keeps native
  // scrolling, which Lenis would not change anyway (PLAN 2.13: Lenis off the first-load path, skip touch)
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !matchMedia('(pointer: fine)').matches) return;
    let l = null, dead = false;
    import('lenis').then(({ default: Lenis }) => {
      if (dead) return;
      l = new Lenis({ autoRaf: true, lerp: 0.105, wheelMultiplier: 0.9, anchors: true });
      window.__lenis = l;
    });
    return () => { dead = true; l?.destroy(); window.__lenis = null; };
  }, []);
  // every [data-tilt] card leans toward a mouse (or the phone's tilt) and a light follows it: one listener, lib/tilt.js
  useEffect(() => lean(), []);
  // every section pauses its animations while it is off screen
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.target.toggleAttribute('data-off', !e.isIntersecting)), { rootMargin: '10% 0px' });
    const watch = () => document.querySelectorAll('main > section, main > div > section').forEach((s) => io.observe(s));
    watch();
    const off = onDomChange(watch); // new pages bring new sections; observing twice is harmless
    return () => { io.disconnect(); off(); };
  }, []);
  // a new page starts at its top (the open and close transitions place the scroll themselves)
  const path = usePathname();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (window.__hzHold) return; // a close transition is restoring the previous scroll
    if (window.__hzPop) { window.__hzPop = false; return; } // Back/Forward: the browser restores where you were
    window.__lenis ? window.__lenis.scrollTo(0, { immediate: true, force: true }) : scrollTo(0, 0);
    // focus moves to the new page's h1 (screen readers hear where they are; the next Tab starts in the page), unless
    // something on the page already took focus
    let n = 0;
    const land = () => {
      const a = document.activeElement;
      if (a && a !== document.body && !a.closest('header, nav, .x-ask') && a.isConnected) return;
      const h = document.querySelector('main h1');
      if (!h) { if (n++ < 30) setTimeout(land, 100); return; }
      if (!h.hasAttribute('tabindex')) h.setAttribute('tabindex', '-1');
      h.focus({ preventScroll: true });
    };
    const t = setTimeout(land, 120);
    return () => clearTimeout(t);
  }, [path]);
  // reduced motion: Motion skips transform and layout animations for people who ask for less movement (DESIGN rule 6).
  // It decides when each element mounts, after hydration, so the server HTML and the first client render still match.
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

// the server-rendered shell (components/Shell.jsx), read lazily so children's effects can use it on mount
const shell = (name) => ({ get current() { return typeof document === 'undefined' ? null : document.querySelector(`[data-x-shell="${name}"]`); } });
const HEADER = shell('header');
const FOOTER = shell('footer');

/* Hanzo's own header (its HTML comes from the server, components/Shell.jsx): it gains its hairline once the page
   moves, turns dark over dark rooms, and its menus and tools come alive. */
export function Header() {
  const ref = HEADER;
  useEffect(() => {
    const h = ref.current?.querySelector('header');
    if (!h) return;
    const on = () => h.setAttribute('data-scrolled', String(scrollY > 8));
    on();
    addEventListener('scroll', on, { passive: true });
    // the header turns dark while it sits over a dark room, as Apple's does; watched by the browser, no layout reads on scroll
    const seen = new Set();
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => (e.isIntersecting ? seen.add(e.target) : seen.delete(e.target)));
      h.setAttribute('data-x-dark', String(seen.size > 0));
    }, { rootMargin: '-30px 0px -99% 0px' });
    const watch = () => document.querySelectorAll('[data-room=dark]').forEach((r) => io.observe(r));
    watch();
    const off = onDomChange(watch); // new pages bring new rooms; observing twice is harmless
    return () => { removeEventListener('scroll', on); io.disconnect(); off(); };
  }, []);
  return (
    <>
      <Nav headerRef={ref} />
      <HeaderTools headerRef={ref} />
    </>
  );
}

/* Hanzo's own footer (HTML from the server, components/Shell.jsx); its giant wordmark rises into place as the page ends. */
export function Footer() {
  const ref = FOOTER;
  useEffect(() => {
    const f = ref.current?.querySelector('footer');
    if (!f || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const big = [...f.querySelectorAll('*')].filter((e) => parseFloat(getComputedStyle(e).fontSize) > 120 || (e.tagName === 'svg' && e.getBoundingClientRect().width > 300));
    const el = big[0];
    if (!el) return;
    el.style.willChange = 'transform, opacity';
    const stop = scroll(animate(el, { transform: ['translateY(36%)', 'translateY(0%)'], opacity: [0.2, 1] }, { ease: 'linear' }), { target: f, offset: ['start end', 'end end'] });
    return () => stop && stop();
  }, []);
  return null;
}

/* An endless strip of logos. CSS drifts it (a transform on the compositor, nothing runs per frame in script); it rests under
   the pointer and on focus, turns the other way with `reverse`, and stands still under reduced motion and off screen. */
export function Marquee({ items, label, reverse = false, view }) {
  // each half holds the list twice so one half is always wider than the screen
  const row = (k) => items.map((l) => {
    const hidden = k > 0;
    return (
      <a key={k + l.name} href={l.href} className="x-logo" data-base={l.w ? '' : undefined} aria-hidden={hidden || undefined} tabIndex={hidden ? -1 : undefined} inert={hidden || undefined} title={l.name}>
        <img src={l.src} alt={hidden ? '' : l.name} loading="lazy" width={l.w} height={l.h} style={l.w ? { marginBottom: -l.hang } : undefined} />
      </a>
    );
  });
  return (
    <section className="x-marquee" aria-label={label} data-hz-view={view}>
      <p className="x-kicker">{label}</p>
      <div className="x-mq-view">
        <div className={'x-mq-track' + (reverse ? ' rev' : '')}>
          {row(0)}{row(1)}{row(2)}{row(3)}
        </div>
      </div>
    </section>
  );
}
