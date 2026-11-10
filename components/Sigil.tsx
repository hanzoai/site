'use client';
/* Generative identity: a living contour map drawn from a page's own words and numbers, so pages that share a template
   never share a picture. It drifts slowly by itself (30 fps, ~1.6 ms of maths a frame full screen), the hills lean toward
   a mouse, it pauses off screen and in background tabs, and draws one still frame for reduced motion.
   How to use it on a page:
   - <Sigil seed={slug} data={[price, contextLength, score]} className="my-hero-art" /> and size it with CSS;
   - seed: the page's own name (it places the hills); data: its real numbers from Hanzo's facts (they set the heights),
     never invented ones; colour: the element's CSS `color`; still: draw one frame only.
   The maths lives in lib/sigil.mjs and also draws every page's share card (app/og). */
import { useEffect, useRef } from 'react';
import { sigilParams, field as fieldAt, levels, contour } from '../lib/sigil.ts';

export { sigilParams };

export default function Sigil({ seed, data = [], className = '', still = false }) {
  const ref = useRef(null);
  const key = String(seed) + '|' + data.join(',');
  useEffect(() => {
    const cv = ref.current, ctx = cv.getContext('2d');
    const P = sigilParams(seed, data);
    const calm = still || matchMedia('(prefers-reduced-motion: reduce)').matches;
    let W = 0, H = 0, cols = 0, rows = 0, v = new Float32Array(0), lv = [], raf = 0, last = 0, seen = false, t0 = performance.now();
    const ptr = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, s: 0, ts: 0 };
    let ink = '';
    const field = (t) => fieldAt(P, v, cols, rows, P.cell, W, H, t, ptr);
    const size = () => {
      const r = cv.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 1.5);
      W = Math.max(1, r.width); H = Math.max(1, r.height);
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(W / P.cell) + 1; rows = Math.ceil(H / P.cell) + 1;
      v = new Float32Array(cols * rows);
      lv = levels(P, field(0));
      ink = getComputedStyle(cv).color;
    };
    const draw = (t) => {
      field(t);
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = ink;
      ctx.lineWidth = 1;
      lv.forEach((l, k) => {
        ctx.globalAlpha = k === P.focus ? 0.9 : 0.16 + (k / lv.length) * 0.22;
        ctx.lineWidth = k === P.focus ? 1.4 : 1;
        ctx.beginPath(); contour(ctx, v, cols, rows, P.cell, l); ctx.stroke();
      });
      ctx.globalAlpha = 1;
    };
    const loop = (now) => {
      raf = requestAnimationFrame(loop);
      if (now - last < 33) return; // 30 frames a second is plenty for a slow drift
      last = now;
      ptr.x += (ptr.tx - ptr.x) * 0.08; ptr.y += (ptr.ty - ptr.y) * 0.08; ptr.s += (ptr.ts - ptr.s) * 0.06;
      draw((now - t0) / 1000);
    };
    const run = () => { cancelAnimationFrame(raf); if (seen && !document.hidden && !calm) raf = requestAnimationFrame(loop); };
    size(); draw(0);
    const ro = new ResizeObserver(() => { size(); draw((performance.now() - t0) / 1000); });
    ro.observe(cv);
    const io = new IntersectionObserver(([e]) => { seen = e.isIntersecting; run(); });
    io.observe(cv);
    const vis = () => run();
    document.addEventListener('visibilitychange', vis);
    const move = (e) => { const r = cv.getBoundingClientRect(); ptr.tx = (e.clientX - r.left) / r.width; ptr.ty = (e.clientY - r.top) / r.height; ptr.ts = 1; };
    const leave = () => { ptr.ts = 0; };
    const host = cv.parentElement;
    if (!calm && matchMedia('(pointer: fine)').matches) { host.addEventListener('pointermove', move, { passive: true }); host.addEventListener('pointerleave', leave); }
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); document.removeEventListener('visibilitychange', vis); host.removeEventListener('pointermove', move); host.removeEventListener('pointerleave', leave); };
  }, [key, still]); // eslint-disable-line react-hooks/exhaustive-deps
  return <canvas ref={ref} className={'x-sigil ' + className} aria-hidden="true" />;
}
