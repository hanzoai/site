'use client';
/* MagnetGrid: /brand's signature (docs/MOTION-MAP.md `magnet-grid`). A field of dots on the mark's construction stage
   that bends toward the cursor and ripples out from a click or a tap; every ripple also parts the mark once (onRipple).
   - Pointer: fine pointers pull the nearby dots in (and ink them); a press anywhere on the stage sends a ripple.
   - Touch: tap to ripple. Keyboard: the field is a focusable control; Enter or Space ripples from the mark's centre.
   - Reduced motion: the field is drawn once, still. JS off: the same dot field is a CSS background (server HTML).
   - One rAF loop that runs only while something is moving and the stage is on screen; colours come from the page's
     tokens (--b-line2 at rest, --b-ink under the pointer), so there is no hue and no literal colour here.
   Usage: <MagnetGrid stage={ref to the element that receives the pointer} onRipple={() => ...} label="Design System" />
   Page-local to /brand. */
import { useEffect, useRef, useState } from 'react';

const GAP = 26;        // px between dots
const R = 170;         // pull radius
const PULL = 0.32;     // share of the distance a dot moves toward the pointer (at the pointer)
const MAXP = 16;       // pull cap, px
const WAVE = 0.85;     // ripple speed, px per ms
const LIFE = 1500;     // ripple life, ms
const AMP = 14;        // ripple push, px
const BAND = 34;       // ripple band width, px

export default function MagnetGrid({ stage, onRipple, label }) {
  const wrap = useRef(null);
  const cv = useRef(null);
  const [live, setLive] = useState(false);
  const api = useRef({ ripple: () => {} });
  const cb = useRef(onRipple);
  cb.current = onRipple;

  useEffect(() => {
    const onRipple = () => cb.current && cb.current();
    const host = wrap.current, c = cv.current, st = stage && stage.current;
    if (!host || !c || !st) return undefined;
    const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = c.getContext('2d');
    if (!ctx) return undefined;
    const css = getComputedStyle(host);
    const parse = (raw) => { // the tokens come back as #rrggbb or rgb(r, g, b)
      const v = raw.trim();
      const h = v.match(/^#([0-9a-f]{6})$/i);
      if (h) return [0, 2, 4].map((i) => parseInt(h[1].slice(i, i + 2), 16));
      const m = v.match(/\d+(\.\d+)?/g);
      return m ? m.slice(0, 3).map(Number) : [212, 212, 212];
    };
    const rest = parse(css.getPropertyValue('--mg-rest') || css.color);
    const ink = parse(css.getPropertyValue('--mg-ink') || css.color);
    let W = 0, H = 0, dpr = 1, dots = [], raf = 0, seen = true;
    const ptr = { x: 0, y: 0, on: false };
    const rings = [];

    const build = () => {
      const r = host.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      W = r.width; H = r.height;
      c.width = Math.round(W * dpr); c.height = Math.round(H * dpr);
      c.style.width = W + 'px'; c.style.height = H + 'px';
      dots = [];
      const ox = (W % GAP) / 2 + GAP / 2, oy = (H % GAP) / 2 + GAP / 2;
      for (let y = oy; y < H; y += GAP) for (let x = ox; x < W; x += GAP) dots.push({ x, y, dx: 0, dy: 0, k: 0 });
    };

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      for (const d of dots) {
        const k = d.k;
        const col = rest.map((v, i) => Math.round(v + (ink[i] - v) * k));
        ctx.fillStyle = `rgb(${col[0]},${col[1]},${col[2]})`;
        const s = 1.3 + k * 1.5;
        ctx.beginPath(); ctx.arc(d.x + d.dx, d.y + d.dy, s, 0, Math.PI * 2); ctx.fill();
      }
    };

    const step = (now) => {
      raf = 0;
      let busy = false;
      for (let i = rings.length - 1; i >= 0; i--) if (now - rings[i].t > LIFE) rings.splice(i, 1);
      for (const d of dots) {
        let tx = 0, ty = 0, tk = 0;
        if (ptr.on) {
          const vx = ptr.x - d.x, vy = ptr.y - d.y, dist = Math.hypot(vx, vy);
          if (dist < R && dist > 0.001) {
            const f = (1 - dist / R) ** 2;
            const m = Math.min(MAXP, dist * PULL * f);
            tx += (vx / dist) * m; ty += (vy / dist) * m; tk = Math.max(tk, f);
          }
        }
        for (const g of rings) {
          const age = now - g.t, rad = age * WAVE;
          const vx = d.x - g.x, vy = d.y - g.y, dist = Math.hypot(vx, vy) || 1;
          const band = Math.exp(-((dist - rad) ** 2) / (2 * BAND * BAND)) * (1 - age / LIFE);
          if (band > 0.01) { tx += (vx / dist) * AMP * band; ty += (vy / dist) * AMP * band; tk = Math.max(tk, band * 0.9); }
        }
        d.dx += (tx - d.dx) * 0.16; d.dy += (ty - d.dy) * 0.16; d.k += (tk - d.k) * 0.18;
        if (Math.abs(tx - d.dx) > 0.05 || Math.abs(ty - d.dy) > 0.05 || Math.abs(tk - d.k) > 0.01) busy = true;
      }
      draw();
      if ((busy || rings.length) && seen) raf = requestAnimationFrame(step);
    };
    const kick = () => { if (!raf && !calm && seen) raf = requestAnimationFrame(step); };

    const local = (e) => { const r = host.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    const move = (e) => {
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
      [ptr.x, ptr.y] = local(e); ptr.on = true; kick();
    };
    const leave = () => { ptr.on = false; kick(); };
    const ripple = (x, y) => {
      if (calm) { onRipple(); return; }
      rings.push({ x, y, t: performance.now() }); if (rings.length > 4) rings.shift();
      onRipple(); kick();
    };
    const down = (e) => {
      if (e.button > 0 || (e.target.closest && e.target.closest('a,button:not(.xbr-mg),input'))) return;
      const [x, y] = local(e); ripple(x, y);
    };
    api.current.ripple = () => ripple(W * 0.5, H * 0.5);

    build(); draw(); setLive(true);
    const ro = new ResizeObserver(() => { build(); draw(); });
    ro.observe(host);
    const io = new IntersectionObserver(([en]) => { seen = en.isIntersecting; if (seen) kick(); }, { threshold: 0 });
    io.observe(host);
    st.addEventListener('pointermove', move);
    st.addEventListener('pointerleave', leave);
    st.addEventListener('pointerdown', down);
    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      st.removeEventListener('pointermove', move); st.removeEventListener('pointerleave', leave); st.removeEventListener('pointerdown', down);
    };
  }, [stage]);

  const key = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); api.current.ripple(); } };
  return (
    <div ref={wrap} className={'xbr-mg' + (live ? ' live' : '')} role="button" tabIndex={0} aria-label={label} onKeyDown={key}>
      <canvas ref={cv} aria-hidden="true" />
    </div>
  );
}
