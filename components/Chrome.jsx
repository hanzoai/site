'use client';
/* The shell every page shares (mounted once in app/layout.jsx; pages import nothing from here except Marquee):
   - Smooth: Lenis weighted scrolling, the site-wide reduced-motion policy (MotionConfig reducedMotion="user"),
     [data-off] on any <main> section that is off screen (pause your CSS loops with `[data-off] .x { animation-play-state: paused }`),
     and every new page starting at its top.
   - Progress, Header, Footer: the scroll bar and Hanzo's own header and footer. Mark a dark section with
     data-room="dark" and the header turns dark over it.
   - Marquee: <Marquee items={[{ name, src, href }]} label="Trusted by" reverse /> an endless logo strip. */
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import { motion, MotionConfig, useAnimationFrame, useInView, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from 'motion/react';
import { animate, scroll } from 'motion';
import C from '../content';
import Nav from './Nav';
import HeaderTools from './HeaderTools';

/* Smooth, weighted scrolling (Lenis) and one motion policy for the whole page. */
export function Smooth({ children }) {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const l = new Lenis({ autoRaf: true, lerp: 0.105, wheelMultiplier: 0.9, anchors: true });
    window.__lenis = l;
    return () => { l.destroy(); window.__lenis = null; };
  }, []);
  // every section pauses its animations while it is off screen
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.target.toggleAttribute('data-off', !e.isIntersecting)), { rootMargin: '10% 0px' });
    const watch = () => document.querySelectorAll('main > section, main > div > section').forEach((s) => io.observe(s));
    watch();
    const t = setInterval(watch, 1500);
    return () => { io.disconnect(); clearInterval(t); };
  }, []);
  // a new page starts at its top (the open and close transitions place the scroll themselves)
  const path = usePathname();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (window.__hzHold) return; // a close transition is restoring the previous scroll
    window.__lenis ? window.__lenis.scrollTo(0, { immediate: true, force: true }) : scrollTo(0, 0);
  }, [path]);
  // reduced motion: Motion skips transform and layout animations for people who ask for less movement (DESIGN rule 6).
  // It decides when each element mounts, after hydration, so the server HTML and the first client render still match.
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

export function Progress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 220, damping: 32, restDelta: 0.001 });
  return <motion.div className="x-progress" style={{ scaleX }} aria-hidden="true" />;
}

/* Hanzo's own header, untouched; it gains its hairline once the page moves. */
export function Header() {
  const ref = useRef(null);
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
    const mo = new MutationObserver(watch);
    mo.observe(document.body, { childList: true, subtree: false });
    const t = setInterval(watch, 1500); // new pages bring new rooms; observing twice is harmless
    return () => { removeEventListener('scroll', on); io.disconnect(); mo.disconnect(); clearInterval(t); };
  }, []);
  return (
    <>
      <div ref={ref} style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: C.header }} />
      <Nav headerRef={ref} />
      <HeaderTools headerRef={ref} />
    </>
  );
}

/* Hanzo's own footer, untouched; its giant wordmark rises into place as the page ends. */
export function Footer() {
  const ref = useRef(null);
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
  return <div ref={ref} style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: C.footer }} />;
}

const wrap = (min, max, v) => { const r = max - min; return ((((v - min) % r) + r) % r) + min; };

/* An endless strip of logos. It drifts on its own, quickens and turns with the speed and direction of the scroll, and rests under the pointer. */
export function Marquee({ items, label, reverse = false }) {
  const base = useMotionValue(0);
  const { scrollY } = useScroll();
  const v = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const factor = useTransform(v, [-1500, 0, 1500], [-3, 0, 3], { clamp: false });
  const dir = useRef(reverse ? -1 : 1);
  const [rest, setRest] = useState(false);
  const box = useRef(null);
  const seen = useInView(box);
  const x = useTransform(base, (b) => `${wrap(-50, 0, b)}%`);
  useAnimationFrame((_, delta) => {
    if (rest || !seen) return;
    let by = dir.current * -1.6 * (delta / 1000);
    const f = factor.get();
    if (f < 0) dir.current = reverse ? 1 : -1;
    else if (f > 0) dir.current = reverse ? -1 : 1;
    by += by * Math.abs(f);
    base.set(base.get() + by);
  });
  // each half holds the list twice so one half is always wider than the screen
  const row = (k) => items.map((l) => {
    const hidden = k > 0;
    return (
      <a key={k + l.name} href={l.href} className="x-logo" aria-hidden={hidden || undefined} tabIndex={hidden ? -1 : undefined} title={l.name}>
        <img src={l.src} alt={hidden ? '' : l.name} loading="lazy" />
      </a>
    );
  });
  return (
    <section className="x-marquee" aria-label={label} ref={box}>
      <p className="x-kicker">{label}</p>
      <div className="x-mq-view" onPointerEnter={() => setRest(true)} onPointerLeave={() => setRest(false)} onFocus={() => setRest(true)} onBlur={() => setRest(false)}>
        <motion.div className="x-mq-track" style={{ x }}>
          {row(0)}{row(1)}{row(2)}{row(3)}
        </motion.div>
      </div>
    </section>
  );
}
