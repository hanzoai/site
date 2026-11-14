'use client';
/* The signature (particles): a cloud of white dots assembles into the rack, four servers of eight GPUs, server by
   server; the pointer or a finger scatters them and they reform. One dot is 9 GB of GPU memory, so a B300 GPU is a
   block of 32 dots (288 GB) and a B200 GPU a block of 20 (180 GB): switching servers sends the difference back to the
   cloud. The planning range reshapes it: Qualification draws the bracket, Isolated pools tint the GPUs per specialist,
   Redundant pools split a twin rack off across a dashed failure domain. Keyboard: arrow keys steer a ring that
   scatters the dots, Enter or Space bursts them. Monochrome only; the loop (live.js useLoop) pauses off screen and in
   background tabs; the canvas is sized to devicePixelRatio max 1.5; reduced motion draws the formed rack, still. */
import { useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent } from 'react';
import { useLoop, fit, rng } from '../live';

// one rack: 4 servers x 8 GPUs x 32 dots, plus each server's chassis outline; two racks; the bracket; the domain line
const GPU = 4 * 8 * 32, OUT = 4 * 80, RACK = GPU + OUT, BR = 64, DOM = 48;
const N = RACK * 2 + BR + DOM;
const pool = (s: number, g: number) => Math.min(2, Math.floor((s * 8 + g) / 11)); // 32 GPUs in three pools of 11, 11, 10
const TINT = [1, 0.55, 0.3];

function make() {
  const r = rng(6);
  const P = {
    x: new Float32Array(N), y: new Float32Array(N), vx: new Float32Array(N), vy: new Float32Array(N),
    tx: new Float32Array(N), ty: new Float32Array(N), a: new Float32Array(N), ta: new Float32Array(N),
    s: new Float32Array(N), ts: new Float32Array(N), hu: new Float32Array(N), hv: new Float32Array(N),
    ph: new Float32Array(N), wait: new Float32Array(N), home: new Uint8Array(N),
  };
  for (let i = 0; i < N; i++) { P.hu[i] = r(); P.hv[i] = r(); P.ph[i] = r() * 6.283; P.a[i] = 0.1; }
  return P;
}

// targets for the current server (k), step (at: 0 the rack, 1-3 the planning range) and canvas size
type Particles = ReturnType<typeof make>;
interface Field { P: Particles; W: number; H: number; sp: number; key: string; born: number; px: number; py: number; near: boolean; kb: boolean; bang: number; t: number }
function layout(P: Particles, W: number, H: number, k: number, at: number) {
  const plan = Math.max(0, at - 1), twin = plan === 2;
  const sp = Math.min(W / 98.2, H / 54.6);
  const inP = 1.6 * sp, bw = 4 * sp, bg = 1.2 * sp, rw = 43.6 * sp, sh = 11.2 * sp, sg = 1.6 * sp, gap = 6 * sp;
  const rackH = 4 * sh + 3 * sg, top = (H - rackH) / 2, cx = W / 2;
  const x0 = [twin ? cx - gap / 2 - rw : cx - rw / 2, cx + gap / 2];
  const dot = Math.max(1.3, sp * 0.62);
  const cloud = (i: number) => { P.home[i] = 1; P.ta[i] = 0.1; P.ts[i] = Math.max(1.1, dot * 0.6); };
  const put = (i: number, x: number, y: number, a: number, s: number) => { P.home[i] = 0; P.tx[i] = x; P.ty[i] = y; P.ta[i] = a; P.ts[i] = s; };
  for (let rk = 0; rk < 2; rk++) {
    const on = rk === 0 || twin, base = rk * RACK;
    for (let s = 0; s < 4; s++) {
      const sy = top + s * (sh + sg);
      for (let g = 0; g < 8; g++) {
        const gx = x0[rk] + inP + g * (bw + bg);
        const a = plan >= 1 ? TINT[pool(s, g)] : 0.92;
        for (let j = 0; j < 32; j++) {
          const i = base + (s * 8 + g) * 32 + j;
          const row = (j >> 2) + (k === 1 ? 3 : 0);
          if (!on || (k === 1 && j >= 20)) { cloud(i); continue; }
          put(i, gx + (j & 3) * sp + sp / 2, sy + inP + row * sp + sp / 2, a, dot);
        }
      }
      // the chassis: dots around the server's edge, quieter than the GPUs
      const per = 2 * (rw + sh), step = per / 80;
      for (let j = 0; j < 80; j++) {
        const i = base + GPU + s * 80 + j;
        if (!on) { cloud(i); continue; }
        let d = j * step, x, y;
        if (d < rw) { x = d; y = 0; } else if ((d -= rw) < sh) { x = rw; y = d; } else if ((d -= sh) < rw) { x = rw - d; y = sh; } else { d -= rw; x = 0; y = sh - d; }
        put(i, x0[rk] + x, sy + y, 0.34, dot * 0.55);
      }
    }
  }
  // Qualification: a bracket of dots down the left of the rack
  for (let j = 0; j < BR; j++) {
    const i = RACK * 2 + j;
    if (at !== 1) { cloud(i); continue; }
    const bx = x0[0] - 2.2 * sp;
    if (j < 56) put(i, bx, top + (j / 55) * rackH, 0.8, dot * 0.7);
    else { const t = j - 56; put(i, bx + ((t & 3) + 1) * sp * 0.4, t < 4 ? top : top + rackH, 0.8, dot * 0.7); }
  }
  // Redundant: the failure domain, dashed down the middle
  for (let j = 0; j < DOM; j++) {
    const i = RACK * 2 + BR + j;
    if (!twin || j % 4 === 3) { cloud(i); continue; }
    put(i, cx, top + (j / (DOM - 1)) * rackH, 0.55, dot * 0.6);
  }
  return sp;
}

export default function ParticleRack({ k, at, label }: { k: number; at: number; label?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const [init] = useState<Field>(() => ({ P: make(), W: 0, H: 0, sp: 6, key: '', born: -1, px: 0, py: 0, near: false, kb: false, bang: 0, t: 0 }));
  const S = useRef(init);

  useLoop(box, (t, dt, still) => {
    const c = cv.current, st = S.current, P = st.P;
    if (!c) return;
    const W = c.clientWidth, H = c.clientHeight;
    if (!W || !H) return;
    const { d } = fit(c, 1.5);
    const key = `${W}x${H}:${k}:${at}`;
    if (key !== st.key) {
      const first = !st.key || st.W !== W || st.H !== H;
      st.W = W; st.H = H; st.sp = layout(P, W, H, k, at);
      if (first && st.born < 0) for (let i = 0; i < N; i++) { P.x[i] = P.hu[i] * W; P.y[i] = P.hv[i] * H; }
      else if (!first) for (let i = 0; i < N; i++) if (!P.home[i]) { P.vx[i] += (Math.sin(i * 12.9) * 0.9); P.vy[i] += (Math.cos(i * 7.3) * 0.9); } // a shiver as the plan changes
      st.key = key;
    }
    const ctx = c.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(d, 0, 0, d, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#fafafa';
    if (still) { // reduced motion: the rack formed and still, the cloud a quiet ground
      for (let i = 0; i < N; i++) {
        const hx = P.home[i] ? P.hu[i] * W : P.tx[i], hy = P.home[i] ? P.hv[i] * H : P.ty[i], s = P.ts[i];
        ctx.globalAlpha = P.ta[i]; ctx.fillRect(hx - s / 2, hy - s / 2, s, s);
      }
      ctx.globalAlpha = 1;
      return;
    }
    if (st.born < 0) {
      st.born = t;
      // the servers slot in top to bottom, the twin after its rack
      for (let i = 0; i < N; i++) {
        const rk = i < RACK ? 0 : i < RACK * 2 ? 1 : 2, loc = i % RACK;
        const s = rk < 2 ? (loc < GPU ? Math.floor(loc / 256) : Math.floor((loc - GPU) / 80)) : 4;
        P.wait[i] = 0.25 + s * 0.16 + rk * 0.3 + P.hu[i] * 0.25;
      }
    }
    const age = t - st.born, f = Math.min(2, dt * 60);
    const R = Math.max(40, st.sp * 10), R2 = R * R;
    const near = st.near;
    let bang = 0;
    if (st.bang) { bang = st.bang; st.bang = 0; }
    for (let i = 0; i < N; i++) {
      let gx, gy;
      if (P.home[i] || age < P.wait[i]) { gx = P.hu[i] * W + Math.sin(t * 0.35 + P.ph[i]) * 7; gy = P.hv[i] * H + Math.cos(t * 0.3 + P.ph[i]) * 7; }
      else { gx = P.tx[i]; gy = P.ty[i]; }
      let vx = P.vx[i] + (gx - P.x[i]) * 0.045 * f, vy = P.vy[i] + (gy - P.y[i]) * 0.045 * f;
      if (near || bang) {
        const dx = P.x[i] - st.px, dy = P.y[i] - st.py, q = dx * dx + dy * dy;
        const r2 = bang ? R2 * 4 : R2;
        if (q < r2 && q > 0.01) {
          const dd = Math.sqrt(q), w = 1 - dd / Math.sqrt(r2);
          const push = (bang ? 16 : 2.6) * w * w * f;
          vx += (dx / dd) * push; vy += (dy / dd) * push;
        }
      }
      const damp = Math.pow(0.84, f);
      vx *= damp; vy *= damp;
      P.vx[i] = vx; P.vy[i] = vy; P.x[i] += vx * f; P.y[i] += vy * f;
      const ta = P.home[i] || age < P.wait[i] ? 0.1 : P.ta[i];
      P.a[i] += (ta - P.a[i]) * 0.08 * f;
      P.s[i] += ((P.home[i] || age < P.wait[i] ? Math.max(1.1, P.ts[i] * 0.6) : P.ts[i]) - P.s[i]) * 0.1 * f;
      const s = P.s[i] || 1.2;
      ctx.globalAlpha = P.a[i];
      ctx.fillRect(P.x[i] - s / 2, P.y[i] - s / 2, s, s);
    }
    ctx.globalAlpha = 1;
    if (st.kb && near) { // the keyboard's ring
      ctx.strokeStyle = 'rgba(250,250,250,.7)'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(st.px, st.py, R * 0.7, 0, 6.283); ctx.stroke();
    }
  }, []);

  const calm = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const at_ = (e: PointerEvent) => { const c = cv.current; if (!c) return; const r = c.getBoundingClientRect(); const st = S.current; st.px = e.clientX - r.left; st.py = e.clientY - r.top; st.kb = false; };
  const move = (e: PointerEvent) => { if (calm()) return; at_(e); S.current.near = true; };
  const down = (e: PointerEvent) => { if (calm()) return; at_(e); S.current.near = true; S.current.bang = 1; };
  const leave = () => { S.current.near = false; };
  const key = (e: KeyboardEvent) => {
    if (calm()) return;
    const st = S.current, step = Math.max(12, st.sp * 4);
    const dirs: Record<string, number[] | undefined> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
    const m = dirs[e.key];
    if (!st.kb || !st.near) { st.px = st.W / 2; st.py = st.H / 2; }
    if (m) { e.preventDefault(); st.kb = true; st.near = true; st.px = Math.min(st.W, Math.max(0, st.px + m[0] * step)); st.py = Math.min(st.H, Math.max(0, st.py + m[1] * step)); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); st.kb = true; st.near = true; st.bang = 1; }
    else if (e.key === 'Escape') { st.near = false; st.kb = false; }
  };
  return (
    <div className="zx-field" ref={box} role="img" aria-label={label} tabIndex={0}
      onPointerMove={move} onPointerDown={down} onPointerLeave={leave} onPointerCancel={leave} onPointerUp={(e) => { if (e.pointerType !== 'mouse') leave(); }}
      onKeyDown={key} onBlur={leave}>
      <canvas ref={cv} className="zx-field-c" aria-hidden="true" />
    </div>
  );
}
