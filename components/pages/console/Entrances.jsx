'use client';
/* Console's five section entrances (MOTION-MAP rule 7), page-local, one hook per section, each its own move:
     1 useStickyStack   the canvas section: its heading sticks at the top and the dark canvas card stacks over it
     2 useDepthParallax the client facts: the copy and the four fact cards rise at different depths, then hold
     3 useTicker        Find it by typing it: the heading rides a vertical ticker of module names into place
     4 useSpringSnap    Get Console: the columns snap in from opposite sides and overshoot, then settle
     5 useVelocitySkew  the close: it skews with scroll speed and straightens when still
   Usage: const ref = useStickyStack(); <section ref={ref}> ... (layers are found by class inside the section).
   Hydration-safe: server and first render are the final state; start states are classes set in effects. Reduced
   motion (useCalm): nothing runs, final state. Transform and opacity only. */
import { useEffect, useRef } from 'react';
import { useCalm } from '../../ui';
import './Entrances.css';

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/* the section's own scroll, only while it is near the screen: fn(rect, vh) once per frame */
function onScrollNear(el, fn) {
  let near = false, raf = 0;
  const run = () => { raf = 0; fn(el.getBoundingClientRect(), innerHeight); };
  const ask = () => { if (near && !raf) raf = requestAnimationFrame(run); };
  const io = new IntersectionObserver(([e]) => { near = e.isIntersecting; ask(); }, { rootMargin: '20% 0px 20% 0px' });
  io.observe(el);
  addEventListener('scroll', ask, { passive: true });
  addEventListener('resize', ask);
  return () => { io.disconnect(); cancelAnimationFrame(raf); removeEventListener('scroll', ask); removeEventListener('resize', ask); };
}

/* 1 sticky-stack: the heading card pins under the header; the canvas card rides up and stacks over it, pushing it back */
export function useStickyStack() {
  const ref = useRef(null);
  const calm = useCalm();
  useEffect(() => {
    const el = ref.current;
    if (!el || calm) return undefined;
    const head = el.querySelector('.cs-cv-head'), card = el.querySelector('.cs-cv-card');
    if (!head || !card) return undefined;
    el.classList.add('en-stack');
    const off = onScrollNear(el, (r, vh) => {
      const c = card.getBoundingClientRect(), h = head.getBoundingClientRect();
      const rise = clamp((vh - c.top) / (vh * 0.55));
      card.style.transform = rise < 1 ? `translate3d(0, ${((1 - rise) * 96).toFixed(1)}px, 0) scale(${(0.94 + rise * 0.06).toFixed(4)})` : '';
      const cover = clamp((h.bottom - c.top) / Math.max(1, h.height));
      head.style.transform = cover > 0 ? `scale(${(1 - cover * 0.06).toFixed(4)})` : '';
      head.style.opacity = cover > 0 ? (1 - cover * 0.7).toFixed(3) : '';
    });
    return () => { off(); el.classList.remove('en-stack'); card.style.transform = ''; head.style.transform = ''; head.style.opacity = ''; };
  }, [calm]);
  return ref;
}

/* 2 depth-parallax: each layer starts lower by its depth and meets the others as the section arrives; then it lets go */
export function useDepthParallax() {
  const ref = useRef(null);
  const calm = useCalm();
  useEffect(() => {
    const el = ref.current;
    if (!el || calm) return undefined;
    const layers = [el.querySelector('.cs-client-copy'), ...el.querySelectorAll('.cs-facts > li')].filter(Boolean);
    const depth = [36, 72, 150, 110, 190];
    if (el.getBoundingClientRect().top < innerHeight * 0.3) return undefined; // already read: final state
    let done = false;
    const clear = () => layers.forEach((l) => { l.style.transform = ''; });
    const off = onScrollNear(el, (r, vh) => {
      if (done) return;
      const p = clamp((vh - r.top) / (vh * 0.75));
      if (p >= 1) { done = true; clear(); return; }
      const e = 1 - Math.pow(1 - p, 2);
      layers.forEach((l, i) => { l.style.transform = `translate3d(0, ${((1 - e) * depth[i % depth.length]).toFixed(1)}px, 0)`; });
    });
    return () => { off(); clear(); };
  }, [calm]);
  return ref;
}

/* plays once at ~30% in view: pre class first (set here, never on the server), then go, then clean */
function useOnce(pre, go, ms) {
  const ref = useRef(null);
  const calm = useCalm();
  useEffect(() => {
    const el = ref.current;
    if (!el || calm) return undefined;
    if (el.getBoundingClientRect().top < innerHeight * 0.7) return undefined; // already on screen: final state
    el.classList.add(pre);
    let t = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      el.classList.add(go);
      t = setTimeout(() => el.classList.remove(pre, go), ms);
    }, { threshold: 0.3 });
    io.observe(el);
    return () => { io.disconnect(); clearTimeout(t); el.classList.remove(pre, go); };
  }, [calm, pre, go, ms]);
  return ref;
}

/* 3 vertical-ticker: the reel of module names runs up through the heading's window and stops on the heading */
export const useTicker = () => useOnce('tk-pre', 'tk-go', 1700);

/* 4 spring-snap: from the sides, past the mark, back */
export const useSpringSnap = () => useOnce('sn-pre', 'sn-go', 1500);

/* 5 velocity-skew: scroll speed leans the close; when the page stops it straightens out */
export function useVelocitySkew() {
  const ref = useRef(null);
  const calm = useCalm();
  useEffect(() => {
    const el = ref.current;
    const box = el?.querySelector('.bz-wrap');
    if (!el || !box || calm) return undefined;
    let near = false, raf = 0, lastY = scrollY, lastT = performance.now(), cur = 0, want = 0;
    const tick = () => {
      raf = 0;
      want *= 0.86;
      cur += (want - cur) * 0.18;
      if (Math.abs(cur) < 0.01 && Math.abs(want) < 0.01) { cur = 0; box.style.transform = ''; return; }
      box.style.transform = `skewY(${cur.toFixed(3)}deg)`;
      if (near) raf = requestAnimationFrame(tick);
    };
    const onScroll = () => {
      const now = performance.now(), dt = Math.max(8, now - lastT), v = (scrollY - lastY) / dt;
      lastY = scrollY; lastT = now;
      if (!near) return;
      want = clamp(v * -1.6, -5, 5);
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => { near = e.isIntersecting; if (!near) { cancelAnimationFrame(raf); raf = 0; cur = want = 0; box.style.transform = ''; } });
    io.observe(el);
    addEventListener('scroll', onScroll, { passive: true });
    return () => { io.disconnect(); cancelAnimationFrame(raf); removeEventListener('scroll', onScroll); box.style.transform = ''; };
  }, [calm]);
  return ref;
}
