'use client';
/* /templates' own motion (MOTION-MAP: signature `h-gallery`; entrances, in order: velocity-skew, fold-out, count-roll,
   explode-gather, shutter). Page-local on purpose: every page enters its own way, never one shared reveal.
   Each entrance arms only after hydration and only if its section is still below the fold, so the server HTML, JS off
   and reduced motion all show the finished state. Transform, opacity and clip-path only. */
import { useEffect, useRef, useState } from 'react';
import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useScroll, useTransform, useVelocity } from 'motion/react';

/* arm(): true after mount when the element starts out of view and motion is allowed; seen: it has come into view */
export function useEntrance(amount = 0.25) {
  const ref = useRef(null);
  const calm = useReducedMotion();
  const [arm, setArm] = useState(false);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || calm) return;
    const r = el.getBoundingClientRect();
    if (r.top < innerHeight * 0.9) return; // already on screen at load: it simply stays
    setArm(true);
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: amount });
    io.observe(el);
    return () => io.disconnect();
  }, [calm, amount]);
  return [ref, arm, seen];
}

/* 1. velocity-skew: the deck leans with the speed of the scroll and straightens when it stops (eased, no overshoot) */
export function VelocitySkew({ children, className = '' }) {
  const calm = useReducedMotion();
  const { scrollY } = useScroll();
  const v = useVelocity(scrollY);
  const skew = useMotionValue(0);
  useAnimationFrame(() => {
    if (calm) return;
    const target = Math.max(-5, Math.min(5, -v.get() / 400));
    const cur = skew.get();
    const next = cur + (target - cur) * 0.12;
    skew.set(Math.abs(next) < 0.01 ? 0 : next);
  });
  return <motion.div className={className} style={{ skewY: skew, transformOrigin: '50% 0%' }}>{children}</motion.div>;
}

/* the signature, h-gallery: on wide screens the vertical scroll drives the twelve panels sideways for one stretch, then
   lets go. Phones, JS off and reduced motion get a native horizontal rail (swipe / scroll), every tile reachable.
   Keyboard: focusing a tile scrolls the page to the point where that tile is in view. */
export function HGallery({ children, className = '', id, label, onTiles }) {
  const sec = useRef(null);
  const track = useRef(null);
  const calm = useReducedMotion();
  const [wide, setWide] = useState(false);
  const [dist, setDist] = useState(0);
  useEffect(() => {
    const m = matchMedia('(min-width: 900px)');
    const f = () => setWide(m.matches && !calm);
    f(); m.addEventListener('change', f);
    return () => m.removeEventListener('change', f);
  }, [calm]);
  useEffect(() => {
    if (!wide) { setDist(0); return; }
    const t = track.current;
    const measure = () => setDist(Math.max(0, t.scrollWidth - t.parentElement.clientWidth));
    measure();
    const ro = new ResizeObserver(measure); ro.observe(t); ro.observe(t.parentElement);
    return () => ro.disconnect();
  }, [wide]);
  useEffect(() => { onTiles?.(track.current); }, [onTiles]);
  const { scrollYProgress } = useScroll({ target: sec, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, (p) => -p * dist);
  const toTile = (e) => {
    if (!wide || !dist) return;
    const li = e.target.closest('li');
    if (!li) return;
    const pin = track.current.parentElement;
    pin.scrollLeft = 0;
    const p = Math.max(0, Math.min(1, (li.offsetLeft - pin.clientWidth * 0.3) / dist));
    const top = sec.current.getBoundingClientRect().top + scrollY;
    scrollTo({ top: top + p * dist, behavior: 'instant' });
  };
  return (
    <section ref={sec} id={id} className={'xtp-hg' + (wide ? ' wide' : '') + ' ' + className} aria-labelledby={label} style={wide && dist ? { height: `calc(100svh + ${dist}px)` } : undefined}>
      <div className="xtp-hg-pin" onFocus={toTile}>
        <motion.div ref={track} className="xtp-hg-track" style={wide ? { x } : undefined}>{children}</motion.div>
      </div>
    </section>
  );
}

/* 2. fold-out: each panel unfolds from its top hinge (rotateX) as the sideways track carries it into view */
export function useFoldOut(root) {
  const calm = useReducedMotion();
  useEffect(() => {
    if (!root || calm) return;
    const lis = [...root.querySelectorAll('.w2-oc > li')];
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.setAttribute('data-in', ''); io.unobserve(e.target); } }), { threshold: 0.3 });
    lis.forEach((li) => {
      const r = li.getBoundingClientRect();
      if (r.top < innerHeight && r.left < innerWidth && r.right > 0) return; // on screen at load: no fold
      li.setAttribute('data-fold', '');
      io.observe(li);
    });
    return () => io.disconnect();
  }, [root, calm]);
}

/* 3. count-roll: each digit is a strip of 0–9 that rolls to its value as the row arrives. The server paints the final
   value; an armed strip rests on 0 until it is seen. */
export function Roll({ v }) {
  const s = String(v).padStart(2, '0');
  return (
    <span className="xtp-roll" aria-hidden="true">
      {[...s].map((d, i) => (
        <span key={i} className="xtp-roll-c"><span className="xtp-roll-d" style={{ '--d': d, '--i': i }}>{'0123456789'.split('').map((n) => <span key={n}>{n}</span>)}</span></span>
      ))}
    </span>
  );
}

/* 4. explode-gather: the room's pieces start scattered (each its own offset and turn) and collapse into place.
   5. shutter: two ink bars close from the top and bottom, then open on the closing band.
   Both are CSS states driven by useEntrance (arm / in) on their section. */
export const SCATTER = [[-120, -60, -9], [140, -30, 7], [-90, 70, 5], [110, 90, -8], [0, 120, 4]];
