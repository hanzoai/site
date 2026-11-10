'use client';
/* /zen signature: Particles form it. About 900 ink dots drift in from a scatter and assemble into Zen's own picture:
   the sphere (denser toward its lit top-left, as in Zen's film) over three rings. The pointer pushes them apart and
   they settle back when it leaves; a tap scatters them from the tap point. One rAF, only while on screen and not paused
   (the page pause stops it); the canvas is capped at 2x DPR. Reduced motion draws the formed picture once, still. */
import { useEffect, useRef } from 'react';
import { usePaused } from '../../../v2/ModelFilm';

const N = 900;

// the target picture in unit space (0..1 square): sphere dots weighted toward the light, then three rings
function shape(rand) {
  const pts = [];
  const cx = 0.5, cy = 0.4, r = 0.27;
  while (pts.length < N * 0.62) {
    const a = rand() * Math.PI * 2, d = Math.sqrt(rand()) * r;
    const x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d;
    const light = 1 - Math.hypot(x - (cx - r * 0.45), y - (cy - r * 0.45)) / (r * 1.9); // brighter toward top-left
    if (rand() < 0.18 + Math.max(0, light) * 0.95) pts.push([x, y, 0.35 + Math.max(0, light) * 0.6]);
  }
  const rings = [[0.34, 0.08], [0.41, 0.105], [0.47, 0.13]];
  while (pts.length < N) {
    const [rx, ry] = rings[pts.length % 3];
    const a = rand() * Math.PI * 2;
    const x = 0.5 + Math.cos(a) * rx, y = 0.74 + Math.sin(a) * ry;
    if (Math.sin(a) < 0 && Math.hypot(x - cx, y - cy) < r) continue; // the ring's far side passes behind the sphere
    pts.push([x, y, 0.28, pts.length % 3, a]);
  }
  return pts;
}

function seeded(s) { return () => ((s = (s * 16807) % 2147483647) / 2147483647); }

export default function Swarm({ label }) {
  const cv = useRef(null);
  const paused = usePaused();
  const pausedRef = useRef(paused);
  pausedRef.current = paused;
  useEffect(() => {
    const c = cv.current;
    const g = c.getContext('2d');
    const rand = seeded(7);
    const home = shape(rand);
    const RINGS = [[0.34, 0.08], [0.41, 0.105], [0.47, 0.13]];
    const P = home.map(([x, y, a, k, ang]) => ({ hx: x, hy: y, a, k, ang, x: rand(), y: rand() * 1.2 - 0.1, vx: 0, vy: 0 }));
    const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let W = 0, H = 0, S = 0, ox = 0, oy = 0, raf = 0, on = false;
    const ptr = { x: -9, y: -9, in: false };
    const size = () => {
      const r = c.getBoundingClientRect(), d = Math.min(2, devicePixelRatio || 1);
      W = r.width; H = r.height; S = Math.min(W, H); ox = (W - S) / 2; oy = (H - S) / 2;
      c.width = Math.round(W * d); c.height = Math.round(H * d); g.setTransform(d, 0, 0, d, 0, 0);
    };
    const draw = () => {
      g.clearRect(0, 0, W, H);
      g.fillStyle = getComputedStyle(c).color || '#0a0a0a'; // the page's ink (#0a0a0a, Hanzo's foreground in dark), read each frame so a device switch follows
      for (const p of P) { g.globalAlpha = p.a; g.fillRect(ox + p.x * S - 1, oy + p.y * S - 1, 2.2, 2.2); }
      g.globalAlpha = 1;
    };
    const step = () => {
      raf = 0;
      if (!on || pausedRef.current) return;
      const px = (ptr.x - ox) / S, py = (ptr.y - oy) / S, R = 0.13;
      for (const p of P) {
        if (p.k === undefined) continue; // the rings turn slowly, like the ripples in Zen's film
        p.ang += 0.0016 * (p.k + 1);
        const [rx, ry] = RINGS[p.k];
        p.hx = 0.5 + Math.cos(p.ang) * rx; p.hy = 0.74 + Math.sin(p.ang) * ry;
        p.a = Math.sin(p.ang) < 0 && Math.hypot(p.hx - 0.5, p.hy - 0.4) < 0.27 ? 0 : 0.28; // behind the sphere: hidden
      }
      let moving = true;
      for (const p of P) {
        let ax = (p.hx - p.x) * 0.045, ay = (p.hy - p.y) * 0.045; // pull home
        if (ptr.in) {
          const dx = p.x - px, dy = p.y - py, d = Math.hypot(dx, dy);
          if (d < R && d > 0.0001) { const f = (1 - d / R) * 0.012; ax += (dx / d) * f; ay += (dy / d) * f; }
        }
        p.vx = (p.vx + ax) * 0.82; p.vy = (p.vy + ay) * 0.82; // damped: settles without overshoot
        p.x += p.vx; p.y += p.vy;
      }
      draw();
      if (moving) raf = requestAnimationFrame(step);
    };
    const wake = () => { if (on && !raf && !pausedRef.current) raf = requestAnimationFrame(step); };
    size();
    if (calm) { P.forEach((p) => { p.x = p.hx; p.y = p.hy; }); draw(); }
    else draw();
    const io = new IntersectionObserver(([e]) => { on = e.isIntersecting; if (on && !calm) wake(); }, { threshold: 0.2 });
    io.observe(c);
    const ro = new ResizeObserver(() => { size(); draw(); });
    ro.observe(c);
    const pos = (e) => { const r = c.getBoundingClientRect(); ptr.x = e.clientX - r.left; ptr.y = e.clientY - r.top; };
    const move = (e) => { if (calm || e.pointerType === 'touch') return; pos(e); ptr.in = true; wake(); };
    const leave = () => { ptr.in = false; wake(); };
    const tap = (e) => {
      if (calm) return;
      pos(e);
      const tx = (ptr.x - ox) / S, ty = (ptr.y - oy) / S;
      for (const p of P) { const dx = p.x - tx, dy = p.y - ty, d = Math.hypot(dx, dy) || 0.001; const f = Math.max(0, 0.32 - d) * 0.22; p.vx += (dx / d) * f; p.vy += (dy / d) * f; }
      wake();
    };
    c.addEventListener('pointermove', move);
    c.addEventListener('pointerleave', leave);
    c.addEventListener('pointerdown', tap);
    return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); c.removeEventListener('pointermove', move); c.removeEventListener('pointerleave', leave); c.removeEventListener('pointerdown', tap); };
  }, []);
  // resume after the page pause lifts
  useEffect(() => { if (!paused) cv.current?.dispatchEvent(new PointerEvent('pointerleave')); }, [paused]);
  return <canvas ref={cv} className="ze-swarm-cv" role="img" aria-label={label} />;
}
