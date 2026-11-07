'use client';
/* Ingress's five section entrances (motion map rule 7, in the map's order for /ingress):
   1 side-carousel  the six facts: the track glides in from the right and snaps onto the first card
   2 stretch-scroll the routing board: arrives stretched along the scroll and relaxes; while on screen it stretches a
                    little with scroll speed and relaxes again
   3 inertia-drag   the agent prompt: its card is thrown in and coasts to rest; drag it and throw it, it coasts back
   4 count-roll     the pipeline room: its step numbers roll up into their values (and roll again on every reorder)
   5 curtain-rise   the close: rises from below behind a clip
   Each plays once when its section arrives (IntersectionObserver), moves only transform and clip-path, and shows the
   final state under reduced motion and with JS off (the waiting states live under `html.js … :not([data-in])`). */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';

/* sets data-in on the element once it arrives; at once under reduced motion */
export function useArrive(margin = '0px 0px -22% 0px') {
  const ref = useRef(null);
  const calm = useReducedMotion();
  const [inn, setIn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (calm || typeof IntersectionObserver === 'undefined') { el.setAttribute('data-in', ''); setIn(true); return; }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.setAttribute('data-in', ''); setIn(true); io.disconnect(); }
    }, { rootMargin: margin, threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, [calm, margin]);
  return [ref, inn, calm];
}

/* 1. side-carousel: a horizontal snapping track with Previous / Next (keyboard: the track is focusable and scrolls
   with the arrow keys; the buttons are real buttons). */
export function SideCarousel({ items, render, label, className = '' }) {
  const [ref, , calm] = useArrive();
  const track = useRef(null);
  const [edge, setEdge] = useState([true, false]);
  const look = useCallback(() => {
    const t = track.current;
    if (!t) return;
    setEdge([t.scrollLeft < 8, t.scrollLeft > t.scrollWidth - t.clientWidth - 8]);
  }, []);
  useEffect(() => {
    const t = track.current;
    if (!t) return;
    look();
    t.addEventListener('scroll', look, { passive: true });
    addEventListener('resize', look, { passive: true });
    return () => { t.removeEventListener('scroll', look); removeEventListener('resize', look); };
  }, [look]);
  const go = (d) => {
    const t = track.current;
    const card = t?.querySelector('li');
    if (!card) return;
    t.scrollBy({ left: d * (card.offsetWidth + 12), behavior: calm ? 'auto' : 'smooth' });
  };
  return (
    <div ref={ref} className={'ig-car ' + className}>
      <ol ref={track} className="ig-car-track" tabIndex={0} aria-label={label}>
        {items.map((it, i) => <li key={i} className="ig-car-card" style={{ '--i': i }}>{render(it, i)}</li>)}
      </ol>
      <div className="ig-car-nav">
        <button type="button" data-sound="tick" aria-label="Previous" disabled={edge[0]} onClick={() => go(-1)}>←</button>
        <button type="button" data-sound="tick" aria-label="Next" disabled={edge[1]} onClick={() => go(1)}>→</button>
      </div>
    </div>
  );
}

/* 2. stretch-scroll: the child arrives stretched (scaleY from its top edge) and relaxes; then, while on screen, it
   stretches with scroll speed (up to 4%, from the edge the scroll pulls) and relaxes when the scroll stops. */
export function StretchScroll({ children, className = '' }) {
  const [ref, inn, calm] = useArrive('0px 0px -18% 0px');
  const inner = useRef(null);
  useEffect(() => {
    const el = inner.current;
    if (!inn || calm || !el) return;
    let s = 1.16, ty = 48, target = 1, raf = 0, lastY = scrollY, lastT = performance.now(), lastS = lastT, dir = 1, seen = true;
    const paint = () => { el.style.transformOrigin = dir > 0 ? '50% 0%' : '50% 100%'; el.style.transform = `translateY(${ty.toFixed(2)}px) scaleY(${s.toFixed(4)})`; };
    const loop = (now) => {
      const dt = Math.min(0.05, (now - lastT) / 1000); lastT = now;
      const k = 1 - Math.exp(-dt * 7);
      s += (target - s) * k; ty += (0 - ty) * k;
      target += (1 - target) * (1 - Math.exp(-dt * 9)); // the scroll's pull relaxes
      paint();
      raf = Math.abs(s - 1) > 0.0005 || Math.abs(ty) > 0.05 ? requestAnimationFrame(loop) : 0;
      if (!raf) { el.style.transform = ''; el.style.transformOrigin = ''; }
    };
    const kick = () => { if (!raf) { lastT = performance.now(); raf = requestAnimationFrame(loop); } };
    const onScroll = () => {
      if (!seen) return;
      const now = performance.now(), dy = scrollY - lastY, v = dy / Math.max(8, now - lastS); // px per ms
      lastY = scrollY; lastS = now;
      if (Math.abs(dy) < 1) return;
      dir = dy > 0 ? 1 : -1;
      target = Math.max(target, 1 + Math.min(0.04, Math.abs(v) * 0.012));
      kick();
    };
    const io = new IntersectionObserver(([e]) => { seen = e.isIntersecting; }, { threshold: 0 });
    io.observe(el);
    paint(); kick();
    addEventListener('scroll', onScroll, { passive: true });
    return () => { cancelAnimationFrame(raf); io.disconnect(); removeEventListener('scroll', onScroll); el.style.transform = ''; el.style.transformOrigin = ''; };
  }, [inn, calm]);
  return <div ref={ref} className={'ig-stretch ' + className}><div ref={inner} className="ig-stretch-in">{children}</div></div>;
}

/* 3. inertia-drag: the target inside (a CSS selector) is thrown in from the right and coasts to rest; the visitor can
   drag it sideways and throw it, and it coasts, then drifts back to its place (no spring, no overshoot). Buttons and
   links inside keep working (a drag never starts on them). */
export function InertiaDrag({ children, target, from = 1, className = '' }) {
  const [ref, inn, calm] = useArrive();
  useEffect(() => {
    const box = ref.current;
    const el = box?.querySelector(target);
    if (!inn || !el) return;
    let x = calm ? 0 : from * Math.min(520, innerWidth * 0.42), v = calm ? 0 : -2600, raf = 0, last = performance.now(), drag = null;
    const set = () => box.style.setProperty('--tx', x.toFixed(2) + 'px');
    const loop = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (!drag) {
        x += v * dt; v *= Math.exp(-dt * 4.2);
        if (Math.abs(v) < 160) x *= Math.exp(-dt * 5); // the coast spent, it drifts home
      }
      set();
      raf = drag || Math.abs(x) > 0.3 || Math.abs(v) > 4 ? requestAnimationFrame(loop) : 0;
      if (!raf) { x = 0; v = 0; set(); }
    };
    const kick = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(loop); } };
    if (!calm) { // a throw that lands at 0: start at x0 with the velocity that the decay spends exactly there
      v = -x * 4.2; set(); kick();
    } else set();
    const band = (d) => Math.sign(d) * Math.min(Math.abs(d), 160 + (Math.abs(d) - 160) * 0.25 * (Math.abs(d) > 160 ? 1 : 0));
    const down = (e) => {
      if (e.button || e.target.closest('button, a')) return;
      if (e.pointerType === 'mouse') e.preventDefault();
      drag = { x0: e.clientX - x, lx: e.clientX, lt: performance.now(), id: e.pointerId };
      v = 0; el.setPointerCapture?.(e.pointerId); box.setAttribute('data-drag', ''); kick();
    };
    const move = (e) => {
      if (!drag || drag.id !== e.pointerId) return;
      const now = performance.now();
      x = band(e.clientX - drag.x0);
      v = calm ? 0 : 0.6 * v + 0.4 * ((e.clientX - drag.lx) / Math.max(0.008, (now - drag.lt) / 1000));
      drag.lx = e.clientX; drag.lt = now;
    };
    const up = (e) => {
      if (!drag || drag.id !== e.pointerId) return;
      if (performance.now() - drag.lt > 90) v = 0;
      v = Math.max(-3000, Math.min(3000, v));
      drag = null; box.removeAttribute('data-drag'); kick();
    };
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('pointerdown', down); el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up);
      box.style.removeProperty('--tx');
    };
  }, [inn, calm, target, from, ref]);
  return <div ref={ref} className={'ig-throw ' + className} data-from={from < 0 ? 'left' : 'right'}>{children}</div>;
}

/* 4. count-roll: a number whose digits roll up into place like counters (the text itself is in the HTML; the rolling
   strip is decoration). The room it sits in carries data-in (useArrive); a changed value rolls to the new digit. */
const STRIP = Array.from({ length: 20 }, (_, i) => i % 10);
export function RollNum({ value }) {
  return (
    <span className="ig-roll">
      <span className="ig-roll-t">{value}</span>
      <span className="ig-roll-s" aria-hidden="true">
        {String(value).split('').map((c, i) => (
          <span key={i} className="ig-roll-c" style={{ '--d': Number(c) || 0, '--j': i }}><span>{STRIP.map((d, k) => <i key={k}>{d}</i>)}</span></span>
        ))}
      </span>
    </span>
  );
}

/* 5. curtain-rise: the section rises from below behind a clip */
export function CurtainRise({ children, className = '' }) {
  const [ref] = useArrive('0px 0px -12% 0px');
  return <div ref={ref} className={'ig-curtain ' + className}><div className="ig-curtain-in">{children}</div></div>;
}
