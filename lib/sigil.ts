// The Sigil's maths, shared by the living canvas (components/Sigil.jsx) and the share cards (app/og): a page's seed
// places the hills, its real numbers set their heights, and marching squares draws the contour lines.
export interface Hill { x: number; y: number; a: number; w: number; sp: number; ph: number; orb: number }
export interface SigilParams { hills: Hill[]; levels: number; focus: number; cell: number }
/** Where the pointer leans the hills: x and y as fractions of the canvas, s the strength (0 at rest). */
export interface Pointer { x: number; y: number; s: number }
/** A canvas context, or anything with these two. */
export interface Pen { moveTo(x: number, y: number): void; lineTo(x: number, y: number): void }

const hash = (s: string) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
const rng = (a: number) => () => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

export function sigilParams(seed: string | number, data: (number | string)[] = []): SigilParams {
  const r = rng(hash(String(seed)));
  const nums = data.map(Number).filter((v) => Number.isFinite(v) && v !== 0);
  const logs = nums.map((v) => Math.log10(Math.abs(v) + 1));
  const top = Math.max(1, ...logs);
  const n = 3 + Math.floor(r() * 4);
  const hills = Array.from({ length: n }, (_, i) => ({
    x: 0.12 + r() * 0.76, y: 0.12 + r() * 0.76,
    a: (r() < 0.28 ? -1 : 1) * (0.45 + (logs.length ? logs[i % logs.length] / top : r()) * 0.9),
    w: 0.11 + r() * 0.2, sp: 0.05 + r() * 0.09, ph: r() * 6.283, orb: 0.02 + r() * 0.05,
  }));
  return { hills, levels: 7 + Math.floor(r() * 6), focus: Math.floor(r() * 4) + 2, cell: 12 + Math.floor(r() * 5) };
}

// the height field at time t (seconds) on a cols×rows grid of `cell` px over W×H; ptr {x, y, s} leans hills toward the pointer
export function field(P: SigilParams, v: Float32Array, cols: number, rows: number, cell: number, W: number, H: number, t: number, ptr: Pointer) {
  const asp = W / (H || 1);
  // where each hill sits this frame, worked out once rather than at every grid point
  const at = P.hills.map((h) => [
    h.x + Math.cos(t * h.sp + h.ph) * h.orb + (ptr.x - h.x) * ptr.s * 0.18,
    h.y + Math.sin(t * h.sp * 1.3 + h.ph) * h.orb + (ptr.y - h.y) * ptr.s * 0.18,
    h.a, 1 / (h.w * h.w),
  ]);
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    const x = (i * cell) / W, y = (j * cell) / H;
    let f = 0;
    for (const [hx, hy, a, k] of at) {
      const dx = (x - hx) * asp, dy = y - hy;
      f += a * Math.exp(-(dx * dx + dy * dy) * k);
    }
    v[j * cols + i] = f;
  }
  return v;
}

// evenly spaced contour heights between the field's lowest and highest points
export function levels(P: SigilParams, v: Float32Array) {
  let lo = Infinity, hi = -Infinity;
  for (const x of v) { if (x < lo) lo = x; if (x > hi) hi = x; }
  return Array.from({ length: P.levels }, (_, k) => lo + ((hi - lo) * (k + 1)) / (P.levels + 1));
}

// marching squares: one level's segments, drawn with pen.moveTo/lineTo (a canvas context, or anything with those two)
export function contour(pen: Pen, v: Float32Array, cols: number, rows: number, cell: number, lv: number) {
  const lerp = (a: number, b: number) => (lv - a) / (b - a || 1e-6);
  for (let j = 0; j < rows - 1; j++) {
    for (let i = 0; i < cols - 1; i++) {
      const k = j * cols + i, a = v[k], b = v[k + 1], c = v[k + cols + 1], d = v[k + cols];
      const m = +(a > lv) | (+(b > lv) << 1) | (+(c > lv) << 2) | (+(d > lv) << 3);
      if (m === 0 || m === 15) continue;
      const x = i * cell, y = j * cell;
      const T = [x + lerp(a, b) * cell, y], R = [x + cell, y + lerp(b, c) * cell], B = [x + lerp(d, c) * cell, y + cell], L = [x, y + lerp(a, d) * cell];
      const seg = (p: number[], q: number[]) => { pen.moveTo(p[0], p[1]); pen.lineTo(q[0], q[1]); };
      switch (m) {
        case 1: case 14: seg(L, T); break;
        case 2: case 13: seg(T, R); break;
        case 3: case 12: seg(L, R); break;
        case 4: case 11: seg(R, B); break;
        case 6: case 9: seg(T, B); break;
        case 7: case 8: seg(L, B); break;
        case 5: seg(L, T); seg(R, B); break;
        case 10: seg(T, R); seg(L, B); break;
      }
    }
  }
}
