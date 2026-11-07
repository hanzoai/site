'use client';
/* MagnetGrid (/press signature, motion map `magnet-grid`): the press kit as a field of dots. Hanzo's mark is drawn in
   the field (ink dots inside the mark, grey dots around it). The field bends toward the cursor (or a finger) and a
   click or tap sends a ripple out from that point. On arrival one ripple runs from the mark's centre, then the field
   rests, apart from three slow idle ripples from points of the mark (one every 5.2 s while on screen and untouched,
   finite like the kit's sheen); it only animates while something is moving (pointer near, ripple alive, dots settling), and only on screen.
   Reduced motion: a still field. JS off: the quiet tile with the mark (the SVG fallback underneath).
   Page-local to /press. */
import { useEffect, useRef } from 'react';
import { Mark } from '../../ui';

const MARK = ['M22.21 67V44.6369H0V67H22.21Z', 'M66.7038 22.3184H22.2534L0.0878906 44.6367H44.4634L66.7038 22.3184Z', 'M22.21 0H0V22.3184H22.21V0Z', 'M66.7198 0H44.5098V22.3184H66.7198V0Z', 'M66.7198 44.6369H44.5098V67H66.7198V44.6369Z'];

export default function MagnetGrid({ className = '', label }) {
  const wrap = useRef(null);
  const cv = useRef(null);
  useEffect(() => {
    const box = wrap.current, c = cv.current;
    if (!box || !c) return undefined;
    const ctx = c.getContext('2d');
    const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let W = 0, H = 0, dpr = 1, dots = [], raf = 0, seen = false, last = 0;
    const ptr = { x: -1e4, y: -1e4, on: false };
    const rip = [];
    const build = () => {
      const r = box.getBoundingClientRect();
      W = r.width; H = r.height; dpr = Math.min(2, devicePixelRatio || 1);
      c.width = Math.round(W * dpr); c.height = Math.round(H * dpr);
      const gap = W < 480 ? 13 : 16;
      const S = Math.min(W, H) * 0.56, ox = (W - S) / 2, oy = (H - S) / 2, k = S / 67;
      const paths = MARK.map((d) => new Path2D(d));
      const hit = (x, y) => { const mx = (x - ox) / k, my = (y - oy) / k; return paths.some((p) => ctx.isPointInPath(p, mx, my)); };
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      dots = [];
      for (let y = gap / 2; y < H; y += gap) for (let x = gap / 2; x < W; x += gap) {
        dots.push({ hx: x, hy: y, x, y, m: hit(x, y) });
      }
    };
    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      for (const d of dots) {
        ctx.fillStyle = d.m ? '#0a0a0a' : '#a3a3a3';
        const s = d.m ? 2.6 : 1.4;
        const bulge = d.b || 0;
        ctx.beginPath(); ctx.arc(d.x, d.y, s + bulge, 0, 6.2832); ctx.fill();
      }
    };
    const step = (t) => {
      raf = 0;
      const R = Math.max(110, Math.min(W, H) * 0.36);
      let moving = false;
      for (let i = rip.length - 1; i >= 0; i--) if (t - rip[i].t0 > 1800) rip.splice(i, 1);
      for (const d of dots) {
        let tx = d.hx, ty = d.hy, b = 0;
        if (ptr.on) {
          const dx = ptr.x - d.hx, dy = ptr.y - d.hy, dist = Math.hypot(dx, dy);
          if (dist < R && dist > 0.01) { const f = (1 - dist / R) ** 2; tx += (dx / dist) * f * 22; ty += (dy / dist) * f * 22; b += f * 1.6; }
        }
        for (const r of rip) {
          const dx = d.hx - r.x, dy = d.hy - r.y, dist = Math.hypot(dx, dy) || 1;
          const age = t - r.t0, front = age * 0.55, w = 34;
          const a = Math.exp(-((dist - front) ** 2) / (2 * w * w)) * (1 - age / 1800) * 14;
          tx += (dx / dist) * a; ty += (dy / dist) * a; b += a * 0.08;
        }
        d.x += (tx - d.x) * 0.2; d.y += (ty - d.y) * 0.2; d.b = (d.b || 0) + (b - (d.b || 0)) * 0.2;
        if (Math.abs(tx - d.x) > 0.05 || Math.abs(ty - d.y) > 0.05) moving = true;
      }
      draw();
      if (seen && (moving || rip.length || ptr.on && t - last < 600)) raf = requestAnimationFrame(step);
    };
    const kick = () => { if (!raf && seen && !calm) raf = requestAnimationFrame(step); };
    const at = (e) => { const r = c.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    const move = (e) => { [ptr.x, ptr.y] = at(e); ptr.on = true; last = performance.now(); kick(); };
    const leave = () => { ptr.on = false; kick(); };
    const down = (e) => { const [x, y] = at(e); rip.push({ x, y, t0: performance.now() }); if (rip.length > 4) rip.shift(); if (e.pointerType !== 'mouse') { ptr.x = x; ptr.y = y; ptr.on = true; last = performance.now(); setTimeout(leave, 500); } kick(); };
    build(); draw();
    let arrived = false, idle = 0, idles = 0;
    const breathe = () => {
      idle = 0;
      if (idles >= 3) return;
      if (seen && !ptr.on && !rip.length) {
        const ink = dots.filter((d) => d.m);
        const d = ink[Math.floor(Math.random() * ink.length)];
        if (d) { rip.push({ x: d.hx, y: d.hy, t0: performance.now() }); idles += 1; kick(); }
      }
      idle = setTimeout(breathe, 5200);
    };
    const io = new IntersectionObserver(([en]) => {
      seen = en.isIntersecting;
      if (seen && !arrived && !calm) { arrived = true; rip.push({ x: W / 2, y: H / 2, t0: performance.now() + 250 }); idle = setTimeout(breathe, 5200); }
      kick();
    }, { threshold: 0.3 });
    io.observe(box);
    const ro = new ResizeObserver(() => { build(); draw(); });
    ro.observe(box);
    if (!calm) {
      c.addEventListener('pointermove', move);
      c.addEventListener('pointerleave', leave);
      c.addEventListener('pointerdown', down);
    }
    return () => { clearTimeout(idle); io.disconnect(); ro.disconnect(); cancelAnimationFrame(raf); c.removeEventListener('pointermove', move); c.removeEventListener('pointerleave', leave); c.removeEventListener('pointerdown', down); };
  }, []);
  return (
    <div ref={wrap} className={'xmg ' + className}>
      <noscript><span className="xmg-fb" aria-hidden="true"><Mark size={96} /></span></noscript>
      <canvas ref={cv} className="xmg-cv" aria-hidden="true" />
    </div>
  );
}
