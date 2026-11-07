'use client';
/* Mori's own drawn objects (mr-): one per chapter and one for "Where Mori fits", so the terrain film stays the hero's
   and the cube's alone. Each is a small canvas on black, drawn in Hanzo's greys, built from the chapter's own facts:
   0 topology: a quad sphere turning, its poles closed by triangle fans (quad and tri), edges drawing in by latitude;
   1 materials: the six maps the chapter names (albedo, normal, roughness, metallic, ambient occlusion, emissive), each
     a lit sphere dealt in one by one while the light walks round them;
   2 environments: a metric grid on the floor and rooms rising from it in order, a scan line crossing the plan;
   3 export: one solid turning while the formats the chapter names land beside it, one by one, each on its own wire;
   fits: spatial understanding: a camera circles a cube, its view cone sweeping, and the points it has seen gather.
   Each builds when its chapter arrives (on), then idles; the page pause and reduced motion leave the final frame. */
import { useRef } from 'react';
import { usePaused } from '../../v2/ModelFilm';
import { useLoop, fit } from './live';

const ease = (x) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);
const W8 = (a) => `rgba(255,255,255,${a})`;
const MONO = '"Zen Mono", ui-monospace, monospace';

// rotate a point by yaw then pitch, project with a soft perspective; returns [x, y, z]
function proj(p, yaw, pitch, cx, cy, sc) {
  const cy1 = Math.cos(yaw), sy1 = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
  const x = p[0] * cy1 - p[2] * sy1, z = p[0] * sy1 + p[2] * cy1, y = p[1];
  const y2 = y * cp - z * sp, z2 = y * sp + z * cp, k = 4 / (4 + z2);
  return [cx + x * sc * k, cy + y2 * sc * k, z2];
}

// one canvas that draws while on screen; `on` restarts the build each time its chapter arrives
function Draw({ on = true, draw, className = 'cr-art mr-art' }) {
  const box = useRef(null), cv = useRef(null);
  const paused = usePaused();
  const st = useRef({ t: 0, on: false, seen: false });
  const p = useRef(paused); p.current = paused;
  const o = useRef(on); o.current = on;
  useLoop(box, (t, dt, still) => {
    const c = cv.current, s = st.current;
    if (!c) return;
    if (o.current && !s.on) { s.on = true; s.t = 0; }
    if (!o.current) s.on = false;
    const frozen = still || p.current;
    if (!frozen && s.on) s.t += dt;
    const { w, h, d } = fit(c, 1.5);
    const g = c.getContext('2d');
    g.clearRect(0, 0, w, h);
    draw(g, w, h, d, frozen ? Math.max(s.t, 9) : s.t, frozen ? 0 : dt);
  });
  return (
    <div className={className} ref={box} aria-hidden="true">
      <canvas ref={cv} />
    </div>
  );
}

/* 0. topology: a lat-long quad sphere; the polar rows are triangle fans (the tris) */
const LAT = 9, LON = 22;
function topology(state) {
  return (g, w, h, d, t, dt) => {
    state.yaw += dt * 0.35;
    const cx = w / 2, cy = h / 2, sc = Math.min(w, h) * 0.34, pitch = 0.42, yaw = state.yaw;
    const pt = (i, j) => { const la = -Math.PI / 2 + (i / LAT) * Math.PI, lo = (j / LON) * Math.PI * 2; return proj([Math.cos(la) * Math.cos(lo), Math.sin(la), Math.cos(la) * Math.sin(lo)], yaw, pitch, cx, cy, sc); };
    const seg = (a, b, alpha) => { g.strokeStyle = W8(alpha * ((a[2] + b[2]) / 2 < 0 ? 0.85 : 0.22)); g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke(); };
    g.lineWidth = d;
    for (let i = 0; i <= LAT; i++) {
      const a = ease((t - i * 0.12) / 0.7); // latitudes draw in from the south pole up
      if (a <= 0) continue;
      for (let j = 0; j < LON; j++) {
        const p0 = pt(i, j), p1 = pt(i, (j + 1) % LON);
        if (i > 0 && i < LAT) seg(p0, p1, a);
        if (i < LAT) seg(p0, pt(i + 1, j), a);
        // the fans: the rows touching each pole split into triangles, drawn last
        if ((i === 1 || i === LAT - 1) && t > 1.6) {
          const q = ease((t - 1.6) / 0.6), pole = pt(i === 1 ? 0 : LAT, 0);
          g.strokeStyle = W8(0.9 * q * (p0[2] < 0 ? 1 : 0.3)); g.beginPath(); g.moveTo(p1[0], p1[1]); g.lineTo(p0[0] + (pole[0] - p0[0]) * q, p0[1] + (pole[1] - p0[1]) * q); g.stroke();
        }
      }
    }
    // the vertices of the near side, as points
    if (t > 0.6) for (let i = 1; i < LAT; i++) for (let j = 0; j < LON; j++) { const p = pt(i, j); if (p[2] < -0.1) { g.fillStyle = W8(0.9 * ease(t - 0.6)); g.fillRect(p[0] - d, p[1] - d, 2 * d, 2 * d); } }
  };
}

/* 1. materials: six maps as six lit spheres */
const MAPS = ['albedo', 'normal', 'roughness', 'metallic', 'ambient occlusion', 'emissive'];
function materials(state) {
  return (g, w, h, d, t, dt) => {
    state.a += dt * 0.6;
    const cols = w > h * 1.1 ? 3 : 2, rows = Math.ceil(6 / cols), pad = 16 * d;
    const cw = (w - pad * (cols + 1)) / cols, ch = (h - pad * (rows + 1)) / rows, r = Math.min(cw, ch - 30 * d) * 0.36;
    const lx = Math.cos(state.a) * 0.55, ly = -0.45 + Math.sin(state.a) * 0.2;
    MAPS.forEach((m, k) => {
      const q = ease((t - 0.15 - k * 0.22) / 0.6);
      if (q <= 0) return;
      const x0 = pad + (k % cols) * (cw + pad), y0 = pad + Math.floor(k / cols) * (ch + pad);
      g.save(); g.globalAlpha = q; g.translate(0, (1 - q) * 16 * d);
      g.fillStyle = '#0f0f0f'; g.beginPath(); g.roundRect(x0, y0, cw, ch, 12 * d); g.fill();
      const cx = x0 + cw / 2, cy = y0 + (ch - 22 * d) / 2, hx = cx + lx * r, hy = cy + ly * r;
      let gr;
      g.save(); g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2); g.clip();
      if (m === 'albedo') { // flat colour, no light: two tones in a check
        g.fillStyle = '#737373'; g.fillRect(cx - r, cy - r, 2 * r, 2 * r); g.fillStyle = '#a3a3a3';
        const s = r / 3; for (let i = -3; i < 3; i++) for (let j = -3; j < 3; j++) if ((i + j) & 1) g.fillRect(cx + i * s, cy + j * s, s, s);
      } else if (m === 'normal') { // relief: bumps lit from the moving light
        g.fillStyle = '#404040'; g.fillRect(cx - r, cy - r, 2 * r, 2 * r);
        for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++) {
          const bx = cx + i * r * 0.42, by = cy + j * r * 0.42, br = r * 0.17;
          gr = g.createRadialGradient(bx + lx * br, by + ly * br, 0, bx, by, br); gr.addColorStop(0, '#d4d4d4'); gr.addColorStop(1, '#262626');
          g.fillStyle = gr; g.beginPath(); g.arc(bx, by, br, 0, Math.PI * 2); g.fill();
        }
      } else if (m === 'roughness') { gr = g.createRadialGradient(hx, hy, 0, cx, cy, r * 1.1); gr.addColorStop(0, '#a3a3a3'); gr.addColorStop(0.6, '#525252'); gr.addColorStop(1, '#171717'); g.fillStyle = gr; g.fillRect(cx - r, cy - r, 2 * r, 2 * r); }
      else if (m === 'metallic') {
        gr = g.createLinearGradient(cx, cy - r, cx, cy + r); gr.addColorStop(0, '#d4d4d4'); gr.addColorStop(0.48, '#404040'); gr.addColorStop(0.52, '#0a0a0a'); gr.addColorStop(1, '#737373'); g.fillStyle = gr; g.fillRect(cx - r, cy - r, 2 * r, 2 * r);
        gr = g.createRadialGradient(hx, hy, 0, hx, hy, r * 0.22); gr.addColorStop(0, '#ffffff'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(cx - r, cy - r, 2 * r, 2 * r);
      } else if (m === 'ambient occlusion') { gr = g.createRadialGradient(cx, cy, r * 0.2, cx, cy, r); gr.addColorStop(0, '#e5e5e5'); gr.addColorStop(0.7, '#a3a3a3'); gr.addColorStop(1, '#262626'); g.fillStyle = gr; g.fillRect(cx - r, cy - r, 2 * r, 2 * r); }
      else { // emissive: dark body, glowing seams that pulse
        g.fillStyle = '#0a0a0a'; g.fillRect(cx - r, cy - r, 2 * r, 2 * r);
        g.strokeStyle = W8(0.55 + 0.4 * Math.sin(state.a * 2.2)); g.lineWidth = 2 * d;
        for (let i = -2; i <= 2; i++) { g.beginPath(); g.ellipse(cx, cy, r, Math.abs(i) * r * 0.3 + 1, 0, 0, Math.PI * 2); g.stroke(); }
      }
      g.restore();
      g.strokeStyle = W8(0.14); g.lineWidth = d; g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2); g.stroke();
      g.fillStyle = '#a3a3a3'; g.font = `606 ${12 * d}px ${MONO}`; g.textAlign = 'center';
      g.fillText(m.toUpperCase(), cx, y0 + ch - 12 * d);
      g.restore();
    });
  };
}

/* 2. environments: rooms rising from a metric grid, seen in plan from above at an angle */
const ROOMS = [[-3, -2, 3, 2, 0.9], [0, -2, 3, 1.5, 1.4], [-3, 0, 2, 3, 0.6], [-1, 0, 4, 3, 1.1], [1.5, -3.5, 1.5, 1.5, 2.2]];
function environment(state) {
  return (g, w, h, d, t, dt) => {
    state.yaw += dt * 0.08;
    const cx = w / 2, cy = h * 0.56, sc = Math.min(w, h) * 0.4, yaw = -0.6 + Math.sin(state.yaw) * 0.25, pitch = 0.72;
    const P = (x, y, z) => proj([x / 5, -y / 5, z / 5], yaw, pitch, cx, cy, sc); // metres to a unit plan, so the perspective stays gentle
    g.lineWidth = d;
    // the metric grid: one line a metre, every fifth heavier
    const ga = ease(t / 0.8);
    for (let i = -5; i <= 5; i++) {
      g.strokeStyle = W8((i % 5 === 0 ? 0.3 : 0.1) * ga);
      let a = P(i, 0, -5), b = P(i, 0, 5); g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke();
      a = P(-5, 0, i); b = P(5, 0, i); g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke();
    }
    // the scan line crosses the plan
    const sx = -5 + ((t * 1.6) % 12);
    if (sx <= 5) { const a = P(sx, 0, -5), b = P(sx, 0, 5); g.strokeStyle = W8(0.7); g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke(); }
    // rooms rise in order; faces filled far to near so the near walls cover the far
    const boxes = ROOMS.map(([x, z, sw, sd, hh], k) => ({ x, z, sw, sd, hh: hh * ease((t - 0.6 - k * 0.35) / 0.8), k })).filter((b) => b.hh > 0.01);
    boxes.sort((a, b) => P(b.x + b.sw / 2, 0, b.z + b.sd / 2)[2] - P(a.x + a.sw / 2, 0, a.z + a.sd / 2)[2]);
    for (const b of boxes) {
      const c = [[b.x, b.z], [b.x + b.sw, b.z], [b.x + b.sw, b.z + b.sd], [b.x, b.z + b.sd]];
      const lo = c.map(([x, z]) => P(x, 0, z)), hi = c.map(([x, z]) => P(x, b.hh, z));
      const faces = [0, 1, 2, 3].map((i) => [lo[i], lo[(i + 1) % 4], hi[(i + 1) % 4], hi[i]]).sort((A, B) => (B[0][2] + B[1][2]) - (A[0][2] + A[1][2]));
      for (const f of faces) {
        g.fillStyle = ['#171717', '#262626', '#404040', '#0f0f0f'][(faces.indexOf(f) + b.k) % 4];
        g.beginPath(); f.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]))); g.closePath(); g.fill();
        g.strokeStyle = W8(0.55); g.stroke();
      }
      g.fillStyle = '#525252'; g.beginPath(); hi.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]))); g.closePath(); g.fill(); g.strokeStyle = W8(0.8); g.stroke();
    }
  };
}

/* 3. export: one turning icosahedron, and the formats the chapter names landing beside it */
const FORMATS = ['USDZ', 'glTF', 'GLB', 'FBX', 'OBJ', '3D Gaussian splats'];
const PHI = (1 + Math.sqrt(5)) / 2;
const ICO = [[-1, PHI, 0], [1, PHI, 0], [-1, -PHI, 0], [1, -PHI, 0], [0, -1, PHI], [0, 1, PHI], [0, -1, -PHI], [0, 1, -PHI], [PHI, 0, -1], [PHI, 0, 1], [-PHI, 0, -1], [-PHI, 0, 1]].map((p) => p.map((x) => x / Math.hypot(1, PHI)));
const ICO_E = [];
ICO.forEach((a, i) => ICO.forEach((b, j) => { if (j > i && Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) < 1.1) ICO_E.push([i, j]); }));
function exporter(state) {
  return (g, w, h, d, t, dt) => {
    state.yaw += dt * 0.5;
    const wide = w > h * 0.85, cx = wide ? w * 0.3 : w / 2, cy = wide ? h / 2 : h * 0.3, sc = Math.min(w, h) * (wide ? 0.22 : 0.18);
    const V = ICO.map((p) => proj(p, state.yaw, 0.5 + Math.sin(state.yaw * 0.7) * 0.2, cx, cy, sc));
    g.lineWidth = 1.2 * d;
    for (const [i, j] of ICO_E) { const z = (V[i][2] + V[j][2]) / 2; g.strokeStyle = W8(z < 0 ? 0.9 : 0.25); g.beginPath(); g.moveTo(V[i][0], V[i][1]); g.lineTo(V[j][0], V[j][1]); g.stroke(); }
    const n = FORMATS.length, rowH = Math.min(52 * d, (wide ? h * 0.8 : h * 0.5) / n);
    const fx = wide ? w * 0.6 : w * 0.14, fy = (wide ? h / 2 : h * 0.72) - (rowH * n) / 2, live = Math.floor(t / 1.1) % n;
    g.font = `497 ${15 * d}px "Zen", system-ui, sans-serif`; g.textAlign = 'left'; g.textBaseline = 'middle';
    FORMATS.forEach((f, k) => {
      const q = ease((t - 0.5 - k * 0.3) / 0.6);
      if (q <= 0) return;
      const y = fy + k * rowH + rowH / 2, x = fx + (1 - q) * 40 * d, bw = Math.max(g.measureText(f).width + 32 * d, 72 * d), bh = Math.min(36 * d, rowH - 8 * d);
      // the wire from the solid to the chip draws first
      g.strokeStyle = W8(0.18 * q); g.lineWidth = d; g.beginPath(); g.moveTo(cx + sc * 0.8 * (wide ? 1 : 0), cy + sc * 0.8 * (wide ? 0 : 1)); g.lineTo(cx + sc * 0.8 * (wide ? 1 : 0) + (x - cx - sc * 0.8 * (wide ? 1 : 0)) * q, cy + sc * 0.8 * (wide ? 0 : 1) + (y - cy - sc * 0.8 * (wide ? 0 : 1)) * q); g.stroke();
      const lit = t > 0.5 + n * 0.3 + 0.6 && k === live;
      g.globalAlpha = q; g.fillStyle = lit ? '#fafafa' : '#171717'; g.beginPath(); g.roundRect(x, y - bh / 2, bw, bh, bh / 2); g.fill();
      g.strokeStyle = W8(0.2); g.stroke();
      g.fillStyle = lit ? '#0a0a0a' : '#fafafa'; g.fillText(f, x + 16 * d, y + d); g.globalAlpha = 1;
    });
  };
}

/* fits: a camera circles a cube, its view cone sweeping; the points it has seen gather on the cube */
const CUBE = [[-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1], [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]].map((p) => p.map((x) => x * 0.55));
const CUBE_E = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]];
function scan(state) {
  if (!state.pts) {
    let a = 7; const r = () => { a = (a * 16807) % 2147483647; return a / 2147483647; };
    state.pts = Array.from({ length: 420 }, () => { const f = Math.floor(r() * 6), u = r() * 2 - 1, v = r() * 2 - 1, ax = f >> 1, s = f & 1 ? 1 : -1, p = [0, 0, 0]; p[ax] = s; p[(ax + 1) % 3] = u; p[(ax + 2) % 3] = v; return { p: p.map((x) => x * 0.55), n: ax, s, seen: 0 }; });
  }
  return (g, w, h, d, t, dt) => {
    state.cam += dt * 0.5;
    const cx = w / 2, cy = h / 2, sc = Math.min(w, h) * 0.34, yaw = 0.5, pitch = 0.5;
    const camP = [Math.cos(state.cam) * 1.9, -0.7, Math.sin(state.cam) * 1.9];
    const C = proj(camP, yaw, pitch, cx, cy, sc);
    // the orbit
    g.lineWidth = d; g.strokeStyle = W8(0.14); g.beginPath();
    for (let i = 0; i <= 64; i++) { const a = (i / 64) * Math.PI * 2, p = proj([Math.cos(a) * 1.9, -0.7, Math.sin(a) * 1.9], yaw, pitch, cx, cy, sc); i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]); }
    g.stroke();
    // points facing the camera are seen, and stay
    for (const q of state.pts) {
      if (q.p[q.n] * camP[q.n] > 0 && dt) q.seen = Math.min(1, q.seen + dt * 1.2);
      if (dt === 0) q.seen = 1;
      if (q.seen <= 0) continue;
      const p = proj(q.p, yaw, pitch, cx, cy, sc);
      g.fillStyle = W8(q.seen * (p[2] < 0 ? 0.9 : 0.35)); g.fillRect(p[0] - d, p[1] - d, 2 * d, 2 * d);
    }
    const V = CUBE.map((p) => proj(p, yaw, pitch, cx, cy, sc));
    g.strokeStyle = W8(0.4 * ease(t / 0.8));
    for (const [i, j] of CUBE_E) { g.beginPath(); g.moveTo(V[i][0], V[i][1]); g.lineTo(V[j][0], V[j][1]); g.stroke(); }
    // the view cone: the camera to the cube's silhouette
    g.strokeStyle = W8(0.35); g.fillStyle = W8(0.05);
    const c0 = Math.atan2(cy - C[1], cx - C[0]);
    const ang = (p) => { let a = Math.atan2(p[1] - C[1], p[0] - C[0]) - c0; while (a > Math.PI) a -= 2 * Math.PI; while (a < -Math.PI) a += 2 * Math.PI; return a; };
    const far = V.slice().sort((a, b) => ang(a) - ang(b));
    g.beginPath(); g.moveTo(C[0], C[1]); g.lineTo(far[0][0], far[0][1]); g.lineTo(far[far.length - 1][0], far[far.length - 1][1]); g.closePath(); g.fill(); g.stroke();
    g.fillStyle = '#fafafa'; g.beginPath(); g.arc(C[0], C[1], 4 * d, 0, Math.PI * 2); g.fill();
  };
}

const makers = [topology, materials, environment, exporter];
export function MoriCap({ i, on }) {
  const s = useRef(null);
  if (!s.current) s.current = makers[i]({ yaw: 0.4, a: 0.8 });
  return <Draw on={on} draw={s.current} />;
}

export function MoriFits({ seen }) {
  const s = useRef(null);
  if (!s.current) s.current = scan({ cam: 0.3 });
  return <Draw on={seen} draw={s.current} className="cr-fits-art mr-art mr-fits-art" />;
}
