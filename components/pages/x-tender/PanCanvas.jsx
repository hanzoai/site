'use client';
/* PanCanvas (x-tender): the drag-canvas primitive. A viewport the visitor pans with the pointer or a finger; the page lays
   its own parts out inside it with ordinary CSS (a grid, flex, absolute boxes) and the canvas measures what it got.
   Usage:
     const pan = useRef(null);
     <PanCanvas ref={pan} label="The six modules" className="my-pan" bar={<MyButtons />} onFocus={(id) => setLit(id)}>
       <div className="my-world"> ... <article data-pan-item="keys"> ... </article> ... </div>
     </PanCanvas>
     pan.current.to('keys')   // glide that item to the middle of the view
     pan.current.reset()      // back to where it started
   What it does: drag with inertia (pointer and touch, a 6px threshold so taps still click; a drag never clicks), soft
   edges past the bounds that settle back (no overshoot), arrow keys pan when the canvas has focus (Shift: further, Home:
   reset), horizontal wheel / trackpad swipes pan, Tab into an item off view glides it into view. onFocus(id) names the
   data-pan-item nearest the middle whenever that changes. The bar above the view holds the page's own controls, a
   four-way arrow icon (the "drag to explore" cue, no words) and the reset button.
   Styling: the page styles .xt-pan, .xt-pan-bar, .xt-pan-view (it gets --pan-x/--pan-y for a background that moves
   with the world), .xt-pan-world, .xt-pan-tools, .xt-pan-hand, .xt-pan-reset; .is-drag is on the view while dragging.
   Motion: one rAF loop, alive only while something glides, stopped off screen. Reduced motion: no inertia, no glides,
   no hint nudge (jumps instead). Server and first client render are identical (the world sits at 0,0 until mounted). */
import { useEffect, useImperativeHandle, useRef } from 'react';
import { useCalm } from '../../ui';

const FRICTION = 325; // ms: the inertia's time constant
const EDGE = 0.35; // how far past an edge a drag still follows
const EIO = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2); // ease-in-out, things that move and stay

const Hand = () => <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="M10 2.5v15M2.5 10h15M10 2.5 7.6 4.9M10 2.5l2.4 2.4M10 17.5l-2.4-2.4M10 17.5l2.4-2.4M2.5 10l2.4-2.4M2.5 10l2.4 2.4M17.5 10l-2.4-2.4M17.5 10l-2.4 2.4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const Home = () => <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="M4.2 8.2A6.2 6.2 0 1 1 4 12.4M4 3.8v4.6h4.6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;

export default function PanCanvas({ ref, label, className = '', bar, onFocus, children, resetLabel = 'Reset the view', hint = true }) {
  const view = useRef(null);
  const world = useRef(null);
  const calm = useCalm();
  const calmRef = useRef(calm);
  calmRef.current = calm;
  const focusCb = useRef(onFocus);
  focusCb.current = onFocus;
  const S = useRef(null);
  if (!S.current) S.current = { x: 0, y: 0, vx: 0, vy: 0, b: { x0: 0, x1: 0, y0: 0, y1: 0 }, vw: 0, vh: 0, items: [], lit: null, raf: 0, mode: null, tw: null, seen: false, touched: false, home: { x: 0, y: 0 }, ready: false };

  useImperativeHandle(ref, () => ({ to: (id) => S.current.goItem?.(id), reset: () => S.current.goHome?.() }), []);

  useEffect(() => {
    const s = S.current, v = view.current, w = world.current;
    if (!v || !w) return undefined;
    const clampX = (x) => Math.min(s.b.x1, Math.max(s.b.x0, x));
    const clampY = (y) => Math.min(s.b.y1, Math.max(s.b.y0, y));
    const soft = (p, lo, hi) => (p > hi ? hi + (p - hi) * EDGE : p < lo ? lo + (p - lo) * EDGE : p);

    const lightNearest = () => {
      const cx = s.vw / 2 - s.x, cy = s.vh / 2 - s.y;
      let best = null, bd = Infinity;
      s.items.forEach((it) => { const d = (it.cx - cx) ** 2 + (it.cy - cy) ** 2; if (d < bd) { bd = d; best = it.id; } });
      if (best !== s.lit) { s.lit = best; focusCb.current?.(best); }
    };
    const apply = () => {
      w.style.transform = `translate3d(${s.x.toFixed(2)}px, ${s.y.toFixed(2)}px, 0)`;
      v.style.setProperty('--pan-x', s.x.toFixed(1) + 'px');
      v.style.setProperty('--pan-y', s.y.toFixed(1) + 'px');
      lightNearest();
    };
    const measure = () => {
      s.vw = v.clientWidth; s.vh = v.clientHeight;
      const W = w.offsetWidth, H = w.offsetHeight;
      s.b = W <= s.vw ? { x0: (s.vw - W) / 2, x1: (s.vw - W) / 2 } : { x0: s.vw - W, x1: 0 };
      Object.assign(s.b, H <= s.vh ? { y0: (s.vh - H) / 2, y1: (s.vh - H) / 2 } : { y0: s.vh - H, y1: 0 });
      const wr = w.getBoundingClientRect();
      s.items = [...w.querySelectorAll('[data-pan-item]')].map((el) => {
        const r = el.getBoundingClientRect();
        return { id: el.dataset.panItem, el, x: r.left - wr.left, y: r.top - wr.top, w: r.width, h: r.height, cx: r.left - wr.left + r.width / 2, cy: r.top - wr.top + r.height / 2 };
      });
      s.home = { x: s.b.x1, y: s.b.y1 };
      if (!s.ready) { s.ready = true; s.x = s.home.x; s.y = s.home.y; }
      if (s.mode !== 'drag') { s.x = clampX(s.x); s.y = clampY(s.y); }
      apply();
    };

    const stop = () => { cancelAnimationFrame(s.raf); s.raf = 0; s.mode = null; s.tw = null; };
    let last = 0;
    const frame = (now) => {
      const dt = Math.min(48, now - (last || now)); last = now;
      if (s.mode === 'tween') {
        const t = s.tw, k = Math.min(1, (now - t.t0) / t.ms), e = EIO(k);
        s.x = t.fx + (t.tx - t.fx) * e; s.y = t.fy + (t.ty - t.fy) * e;
        apply();
        if (k >= 1) { const done = t.done; stop(); done?.(); return; }
      } else if (s.mode === 'coast') {
        const out = s.x > s.b.x1 || s.x < s.b.x0 || s.y > s.b.y1 || s.y < s.b.y0;
        const decay = Math.exp(-dt / (out ? FRICTION / 4 : FRICTION));
        s.x += s.vx * dt; s.y += s.vy * dt; s.vx *= decay; s.vy *= decay;
        apply();
        if (Math.hypot(s.vx, s.vy) < 0.02) { stop(); settle(); return; }
      } else { s.raf = 0; return; }
      s.raf = requestAnimationFrame(frame);
    };
    const run = () => { if (!s.raf && s.seen) { last = 0; s.raf = requestAnimationFrame(frame); } };
    const glide = (tx, ty, ms = 600, done) => {
      tx = clampX(tx); ty = clampY(ty);
      if (calmRef.current || !s.seen) { stop(); s.x = tx; s.y = ty; apply(); done?.(); return; }
      cancelAnimationFrame(s.raf); s.raf = 0;
      s.mode = 'tween'; s.tw = { fx: s.x, fy: s.y, tx, ty, ms, t0: performance.now(), done };
      run();
    };
    const settle = () => { const tx = clampX(s.x), ty = clampY(s.y); if (tx !== s.x || ty !== s.y) glide(tx, ty, 300); };
    s.goItem = (id) => {
      const it = s.items.find((i) => i.id === id);
      if (!it) return;
      s.touched = true;
      glide(Math.max(s.vw / 2 - it.cx, 24 - it.x), Math.max(s.vh / 2 - it.cy, 24 - it.y), 700); // centred, or its top-left in view when it is bigger than the view
    };
    s.goHome = () => { s.touched = true; glide(s.home.x, s.home.y, 700); };

    /* drag: a 6px threshold so a tap is still a click, then the world follows the hand; letting go coasts */
    let down = null;
    const onDown = (e) => {
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      if (e.target.closest('input, textarea, select, [contenteditable="true"]')) return;
      down = { id: e.pointerId, sx: e.clientX, sy: e.clientY, x: s.x, y: s.y, t: performance.now(), lx: e.clientX, ly: e.clientY, on: false };
      addEventListener('pointermove', onMove);
      addEventListener('pointerup', onUp);
      addEventListener('pointercancel', onUp);
    };
    const onMove = (e) => {
      if (!down || e.pointerId !== down.id) return;
      const dx = e.clientX - down.sx, dy = e.clientY - down.sy;
      if (!down.on) {
        if (Math.hypot(dx, dy) < 6) return;
        down.on = true; s.touched = true; stop(); s.mode = 'drag'; s.vx = 0; s.vy = 0;
        v.classList.add('is-drag'); v.style.userSelect = 'none';
        try { v.setPointerCapture(e.pointerId); } catch { /* the pointer left already */ }
      }
      const now = performance.now(), dt = Math.max(1, now - down.t);
      const k = Math.min(1, dt / 60);
      s.vx = s.vx * (1 - k) + ((e.clientX - down.lx) / dt) * k;
      s.vy = s.vy * (1 - k) + ((e.clientY - down.ly) / dt) * k;
      down.t = now; down.lx = e.clientX; down.ly = e.clientY;
      s.x = soft(down.x + dx, s.b.x0, s.b.x1); s.y = soft(down.y + dy, s.b.y0, s.b.y1);
      apply();
    };
    const onUp = (e) => {
      if (!down || e.pointerId !== down.id) return;
      removeEventListener('pointermove', onMove); removeEventListener('pointerup', onUp); removeEventListener('pointercancel', onUp);
      const was = down.on, held = performance.now() - down.t > 90; down = null;
      if (held) { s.vx = 0; s.vy = 0; } // the hand stopped before letting go: no throw
      if (!was) return;
      v.classList.remove('is-drag'); v.style.userSelect = '';
      eat = true; setTimeout(() => { eat = false; }, 0);
      if (!calmRef.current && Math.hypot(s.vx, s.vy) > 0.05) { s.mode = 'coast'; run(); if (!s.raf) { s.mode = null; settle(); } }
      else { s.mode = null; s.vx = s.vy = 0; settle(); }
    };
    let eat = false;
    const onClick = (e) => { if (eat) { e.preventDefault(); e.stopPropagation(); eat = false; } };

    /* keys: arrows pan (Shift: a screen), Home goes back; only when the canvas itself, or a non-text item in it, has focus */
    const onKey = (e) => {
      if (e.target.closest('input, textarea, select')) return;
      const step = e.shiftKey ? Math.round(s.vw * 0.8) : 160;
      const d = { ArrowLeft: [step, 0], ArrowRight: [-step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] }[e.key];
      if (d) {
        const tx = clampX((s.tw?.tx ?? s.x) + d[0]), ty = clampY((s.tw?.ty ?? s.y) + d[1]);
        if (tx === s.x && ty === s.y && !s.tw) return; // at the edge: let the page have the key
        e.preventDefault(); s.touched = true; glide(tx, ty, 300);
      } else if (e.key === 'Home') { e.preventDefault(); s.goHome(); }
    };
    /* Tab into an item that is off view: glide it in */
    const onFocusIn = (e) => {
      if (e.target === v) return;
      const el = e.target.closest('[data-pan-item]');
      if (!el) return;
      const r = e.target.getBoundingClientRect(), vr = v.getBoundingClientRect();
      if (r.left >= vr.left + 8 && r.right <= vr.right - 8 && r.top >= vr.top + 8 && r.bottom <= vr.bottom - 8) return;
      s.goItem(el.dataset.panItem);
    };
    const onScroll = () => { if (v.scrollLeft || v.scrollTop) { v.scrollLeft = 0; v.scrollTop = 0; } };
    /* a sideways swipe on a trackpad (or Shift+wheel) pans; an up/down wheel still scrolls the page */
    const onWheel = (e) => {
      const dx = e.deltaX || (e.shiftKey ? e.deltaY : 0);
      if (!dx || Math.abs(dx) < Math.abs(e.shiftKey ? 0 : e.deltaY)) return;
      const tx = clampX(s.x - dx);
      if (tx === s.x) return;
      e.preventDefault(); e.stopPropagation(); stop(); s.touched = true;
      s.x = tx; apply();
    };

    v.addEventListener('pointerdown', onDown);
    v.addEventListener('click', onClick, true);
    v.addEventListener('keydown', onKey);
    v.addEventListener('focusin', onFocusIn);
    v.addEventListener('scroll', onScroll);
    v.addEventListener('wheel', onWheel, { passive: false });
    const ro = new ResizeObserver(measure);
    ro.observe(v); ro.observe(w);
    measure();
    let nudged = false;
    const io = new IntersectionObserver(([en]) => {
      s.seen = en.isIntersecting;
      if (!s.seen) { if (s.raf) { const t = s.tw; stop(); if (t) { s.x = t.tx; s.y = t.ty; apply(); } else settle(); } return; }
      /* the cue, once: the world leans a little the way it goes, then comes back, so it reads as something to pull */
      if (hint && !nudged && !s.touched && !calmRef.current && s.b.x0 < s.b.x1) {
        nudged = true;
        const hx = s.x, hy = s.y;
        setTimeout(() => { if (!s.touched) glide(hx - 72, hy - (s.b.y0 < s.b.y1 ? 28 : 0), 900, () => { if (!s.touched) glide(hx, hy, 900); }); }, 500);
      }
    }, { threshold: 0.35 });
    io.observe(v);
    return () => {
      stop(); ro.disconnect(); io.disconnect();
      v.removeEventListener('pointerdown', onDown); v.removeEventListener('click', onClick, true);
      v.removeEventListener('keydown', onKey); v.removeEventListener('focusin', onFocusIn);
      v.removeEventListener('scroll', onScroll); v.removeEventListener('wheel', onWheel);
      removeEventListener('pointermove', onMove); removeEventListener('pointerup', onUp); removeEventListener('pointercancel', onUp);
    };
  }, [hint]);

  return (
    <div className={'xt-pan ' + className}>
      <div className="xt-pan-bar">
        {bar}
        <span className="xt-pan-tools">
          <span className="xt-pan-hand" aria-hidden="true"><Hand /></span>
          <button type="button" className="xt-pan-reset" onClick={() => S.current.goHome?.()} aria-label={resetLabel}><Home /></button>
        </span>
      </div>
      <div ref={view} className="xt-pan-view" tabIndex={0} role="region" aria-roledescription="canvas" aria-label={label + ': drag to explore, or use the arrow keys'} style={{ position: 'relative', overflow: 'hidden', touchAction: 'none' }}>
        <div ref={world} className="xt-pan-world" style={{ position: 'absolute', left: 0, top: 0, width: 'max-content', willChange: 'transform' }}>{children}</div>
      </div>
    </div>
  );
}
