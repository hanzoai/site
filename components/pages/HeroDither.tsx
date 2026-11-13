'use client';
/* Unified 10px topological halftone wave heightfield + Blinn-Phong cursor gleam across all Hanzo subpage heroes,
   matching the home Hero.tsx Dots field 1:1 with zero zoom distortion. */
import { useEffect, useRef } from 'react';
import './HeroDither.css';

const fade = (a: number, b: number, dir: string) =>
  `linear-gradient(to ${dir}, transparent, #fff ${(100 * a).toFixed(1)}%, #fff ${((1 - b) * 100).toFixed(1)}%, transparent)`;
const MASK = [fade(0.08, 0.18, 'bottom'), fade(0.03, 0.03, 'right')].join(', ');

export default function HeroDither({ className = '' }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const cvRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const cv = cvRef.current;
    const box = wrapRef.current;
    if (!cv || !box) return;
    const cx = cv.getContext('2d');
    if (!cx) return;
    const host = box.parentElement?.parentElement || box;

    const G = 10, R = 255, Z_SCALE = 68, LIGHT_Z = 108;
    const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let W = 0, H = 0, cols = 0, rows = 0, raf = 0, vis = true;
    let tx = -1e4, ty = -1e4, lx = -1e4, ly = -1e4, inside = false, energy = 0, boost = 0;
    let rgb = '245,245,245';
    const ambientAlphas = [0.085, 0.155, 0.235];
    const gleamAlphas = [0.32, 0.44, 0.56, 0.68, 0.8, 0.92];
    let ambientStyles = ambientAlphas.map((a) => `rgba(${rgb},${a})`);
    let gleamStyles = gleamAlphas.map((a) => `rgba(${rgb},${a})`);

    const tone = () => {
      const m = getComputedStyle(cv).color.match(/[\d.]+/g) || ['245', '245', '245'];
      rgb = `${m[0]},${m[1]},${m[2]}`;
      ambientStyles = ambientAlphas.map((a) => `rgba(${rgb},${a})`);
      gleamStyles = gleamAlphas.map((a) => `rgba(${rgb},${a})`);
    };
    tone();

    const amb: number[][] = [[], [], []];
    const glm: number[][] = [[], [], [], [], [], []];

    const draw = () => {
      if (W < 1 || H < 1 || getComputedStyle(box).display === 'none') return;
      cx.clearRect(0, 0, W, H);
      for (let b = 0; b < 3; b++) amb[b].length = 0;
      for (let b = 0; b < 6; b++) glm[b].length = 0;

      const gx1 = W * 0.18, gy1 = H * 0.62;
      const gx2 = W * 0.82, gy2 = H * 0.52;
      const invH = 1 / Math.max(1, H);
      const wLeft = Math.max(1, W * 0.3);
      const wRight = Math.max(1, W * 0.34);
      const lit = energy > 0.01 && lx > -5e3;
      const r2Max = R * R;

      for (let j = 0; j < rows; j++) {
        const y = j * G;
        const rawEy = 0.28 + y * invH * 0.95;
        const ey = rawEy < 1 ? rawEy : 1;
        const dey = rawEy < 1 ? invH * 0.95 : 0;

        for (let i = 0; i < cols; i++) {
          const x = i * G;
          const leftRamp = 1 - x / wLeft;
          const rightRamp = (x - W * 0.66) / wRight;
          let ex = 0.14, dex = 0;
          if (leftRamp >= rightRamp && leftRamp > 0.14) {
            ex = leftRamp; dex = -1 / wLeft;
          } else if (rightRamp > 0.14) {
            ex = rightRamp; dex = 1 / wRight;
          }

          const p1 = x * 0.012 + y * 0.006;
          const p2 = y * 0.014 - x * 0.005;
          const p3 = (x + y) * 0.007;
          const w1 = Math.sin(p1), c1 = Math.cos(p1);
          const w2 = Math.cos(p2), s2 = Math.sin(p2);
          const w3 = Math.sin(p3), c3 = Math.cos(p3);
          const wave = w1 * w2 * 0.65 + w3 * 0.35;
          const dwx = 0.65 * (0.012 * c1 * w2 + w1 * 0.005 * s2) + 0.35 * 0.007 * c3;
          const dwy = 0.65 * (0.006 * c1 * w2 - w1 * 0.014 * s2) + 0.35 * 0.007 * c3;

          const n = 0.56 + 0.44 * wave;
          const dnx = 0.44 * dwx;
          const dny = 0.44 * dwy;

          let f = ex * ey * n * 1.24;
          let dfx = (dex * ey * n + ex * ey * dnx) * 1.24;
          let dfy = (ex * dey * n + ex * ey * dny) * 1.24;

          const dx1 = x - gx1, dy1 = y - gy1, d1Sq = dx1 * dx1 + dy1 * dy1;
          if (d1Sq < 57600) {
            const d1 = Math.sqrt(d1Sq) || 1;
            const k1 = 1 - d1 / 240;
            f += k1 * k1 * 0.24;
            const gSlope = (-0.48 * k1) / (240 * d1);
            dfx += gSlope * dx1;
            dfy += gSlope * dy1;
          }
          const dx2 = x - gx2, dy2 = y - gy2, d2Sq = dx2 * dx2 + dy2 * dy2;
          if (d2Sq < 57600) {
            const d2 = Math.sqrt(d2Sq) || 1;
            const k2 = 1 - d2 / 240;
            f += k2 * k2 * 0.24;
            const gSlope = (-0.48 * k2) / (240 * d2);
            dfx += gSlope * dx2;
            dfy += gSlope * dy2;
          }

          const z = f < 0 ? 0 : f > 1 ? 1 : f;
          if (z < 0.05) continue;

          const sx = -dfx * Z_SCALE, sy = -dfy * Z_SCALE;
          const invN = 1 / Math.sqrt(sx * sx + sy * sy + 1);
          const nx = sx * invN, ny = sy * invN, nz = invN;

          let drawX = x + nx * z * 2.4;
          let drawY = y + ny * z * 2.4;
          let r = z * G * 0.38;
          let gleamBucket = -1;

          if (lit) {
            const vx = lx - x, vy = ly - y;
            const dSq = vx * vx + vy * vy;
            if (dSq < r2Max) {
              const dist2 = Math.sqrt(dSq);
              const falloff = 1 - dist2 / R;
              const atten = falloff * falloff * (3 - 2 * falloff);
              const vz = LIGHT_Z - z * 44;
              const invL = 1 / Math.sqrt(dSq + vz * vz);
              const ldx = vx * invL, ldy = vy * invL, ldz = vz * invL;
              const ndotl = Math.max(0, nx * ldx + ny * ldy + nz * ldz);
              const hzf = ldz + 1;
              const invHalf = 1 / Math.sqrt(ldx * ldx + ldy * ldy + hzf * hzf);
              const ndoth = Math.max(0, (nx * ldx + ny * ldy + nz * hzf) * invHalf);
              const ndoth2 = ndoth * ndoth;
              const ndoth4 = ndoth2 * ndoth2;
              const spec = ndoth4 * ndoth4 * ndoth4;
              const crestFactor = Math.max(0.06, Math.min(1, (wave + 0.72) * 0.68)) * (0.2 + 0.8 * z);
              const gleam = atten * energy * crestFactor * (0.42 * ndotl + 1.05 * spec);
              const reliefLift = gleam * (0.35 + 0.65 * z);
              r = Math.min(G * 0.48, r + reliefLift * G * 0.16);
              drawX -= (vx / R) * z * 2.2 * atten * energy;
              drawY -= (vy / R) * z * 2.2 * atten * energy;
              if (gleam > 0.07) gleamBucket = Math.min(5, Math.floor((gleam - 0.07) * 7.2));
            }
          }

          if (gleamBucket >= 0) glm[gleamBucket].push(drawX, drawY, r);
          else amb[z < 0.28 ? 0 : z < 0.56 ? 1 : 2].push(drawX, drawY, r);
        }
      }

      for (let b = 0; b < 3; b++) {
        const arr = amb[b];
        if (!arr.length) continue;
        cx.fillStyle = ambientStyles[b];
        cx.beginPath();
        for (let k = 0; k < arr.length; k += 3) {
          const dx = arr[k], dy = arr[k + 1], dr = arr[k + 2];
          cx.moveTo(dx + dr, dy);
          cx.arc(dx, dy, dr, 0, 6.2832);
        }
        cx.fill();
      }
      for (let b = 0; b < 6; b++) {
        const arr = glm[b];
        if (!arr.length) continue;
        cx.fillStyle = gleamStyles[b];
        cx.beginPath();
        for (let k = 0; k < arr.length; k += 3) {
          const dx = arr[k], dy = arr[k + 1], dr = arr[k + 2];
          cx.moveTo(dx + dr, dy);
          cx.arc(dx, dy, dr, 0, 6.2832);
        }
        cx.fill();
      }
    };

    const tick = () => {
      boost *= 0.9;
      const target = inside ? Math.min(1, 0.72 + boost * 0.28) : 0;
      energy += (target - energy) * (inside ? 0.18 : 0.08);
      if (lx < -5e3 && tx > -5e3) { lx = tx; ly = ty; }
      else if (tx > -5e3) { lx += (tx - lx) * 0.28; ly += (ty - ly) * 0.28; }
      draw();
      raf = (energy > 0.01 || inside) && vis ? requestAnimationFrame(tick) : 0;
    };
    const startLoop = () => {
      if (!raf && vis && (energy > 0.01 || inside)) raf = requestAnimationFrame(tick);
    };
    const size = () => {
      const r = box.getBoundingClientRect();
      const dpr = Math.min(devicePixelRatio || 1, 2);
      W = r.width; H = r.height;
      if (W < 1 || H < 1) return;
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      cv.style.width = W + 'px';
      cv.style.height = H + 'px';
      cx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(W / G) + 1;
      rows = Math.ceil(H / G) + 1;
      tone();
      draw();
    };
    const move = (e: PointerEvent) => {
      if (calm || e.pointerType === 'touch') return;
      const r = box.getBoundingClientRect();
      const nx = e.clientX - r.left, ny = e.clientY - r.top;
      if (tx > -5e3) {
        const sp = Math.hypot(nx - tx, ny - ty);
        boost = Math.min(1.4, boost + sp * 0.016);
      }
      tx = nx; ty = ny; inside = true;
      startLoop();
    };
    const leave = () => { inside = false; startLoop(); };

    size();
    const ro = new ResizeObserver(size);
    ro.observe(box);
    const mo = new MutationObserver(() => { tone(); draw(); });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    const io = new IntersectionObserver(([e]) => {
      vis = Boolean(e && e.isIntersecting);
      if (vis) draw();
      else if (raf) { cancelAnimationFrame(raf); raf = 0; }
    });
    io.observe(box);

    host.addEventListener('pointermove', move as EventListener, { passive: true });
    host.addEventListener('pointerleave', leave, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
      io.disconnect();
      host.removeEventListener('pointermove', move as EventListener);
      host.removeEventListener('pointerleave', leave);
    };
  }, []);

  return (
    <div className={'hz-dither ' + className} aria-hidden="true">
      <div ref={wrapRef} className="hz-dither-d">
        <canvas
          ref={cvRef}
          data-slot="dots"
          style={{ WebkitMaskImage: MASK, maskImage: MASK, WebkitMaskComposite: 'source-in', maskComposite: 'intersect' }}
        />
      </div>
    </div>
  );
}
