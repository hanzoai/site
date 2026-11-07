'use client';
/* Mori: build worlds, not just images. v2 launch page (Creative on Launch + Chapters, Hanzo's black and white). The film
   settles into a cube seen from above (a hexagon whose three near edges draw in); the viewport is the one dark room.
   Signature: a point cloud that turns. Points scattered through space settle onto a surface (SDF to mesh), then the
   shape keeps turning 360°; drag it to orbit (it carries your throw), and switch the view between wireframe, shaded
   and normals. (A drawn illustration of a mesh, not Mori's output.)
   Beyond: the studio map (Creative.jsx): every creative model serving your field, in its own words and colour. */
import { useMemo, useRef, useState } from 'react';
import { Specs } from './Studio';
import Creative from './Creative';
import { poly, dense, focus } from '../../v2/Launch';
import { useLoop, fit, rng, arrows } from './live';
import './Mori.css';

const U = 72, V = 26;
const MODES = ['wireframe', 'shaded', 'normals'];

function mesh() {
  const P = new Float32Array(U * V * 3), N = new Float32Array(U * V * 3), S = new Float32Array(U * V * 3), r0 = rng(42);
  const at = (u, v) => {
    const a = (u / U) * Math.PI * 2, b = (v / V) * Math.PI * 2 + a * 0.5;
    const r = 0.42 * (1 + 0.2 * Math.sin(3 * a + 2 * b));
    return [(1 + r * Math.cos(b)) * Math.cos(a), r * Math.sin(b) * 1.1, (1 + r * Math.cos(b)) * Math.sin(a)];
  };
  for (let u = 0; u < U; u++) for (let v = 0; v < V; v++) {
    const i = (u * V + v) * 3, p = at(u, v), pu = at(u + 0.01, v), pv = at(u, v + 0.01);
    const du = [pu[0] - p[0], pu[1] - p[1], pu[2] - p[2]], dv = [pv[0] - p[0], pv[1] - p[1], pv[2] - p[2]];
    let n = [du[1] * dv[2] - du[2] * dv[1], du[2] * dv[0] - du[0] * dv[2], du[0] * dv[1] - du[1] * dv[0]];
    const l = Math.hypot(...n) || 1; n = n.map((x) => x / l);
    P.set(p, i); N.set(n, i);
    // the scattered start: a random point in a ball (the field before it is meshed)
    let q; do { q = [r0() * 2 - 1, r0() * 2 - 1, r0() * 2 - 1]; } while (q[0] * q[0] + q[1] * q[1] + q[2] * q[2] > 1);
    S.set(q.map((x) => x * 1.9), i);
  }
  return { P, N, S };
}

function Viewport() {
  const stage = useRef(null), cv = useRef(null), deg = useRef(null);
  const geo = useMemo(mesh, []);
  const [mode, setMode] = useState(0);
  const S = useRef({ yaw: 0.6, pitch: 0.42, vy: 0, vp: 0, drag: null, born: 0, q: new Float32Array(U * V * 3), proj: new Float32Array(U * V * 3), nz: new Float32Array(U * V * 3) });

  useLoop(stage, (t, dt, still) => {
    const c = cv.current, s = S.current;
    if (!c) return;
    const { w, h, d } = fit(c, 1.5);
    const g = c.getContext('2d');
    if (!still) {
      s.born += dt;
      if (!s.drag) { s.yaw += (0.32 + s.vy) * dt; s.pitch += s.vp * dt; s.vy *= 0.94; s.vp *= 0.9; s.pitch += (0.42 - s.pitch) * dt * 0.6; }
    } else s.born = 9;
    const wide = w / d > 760;
    const cx = w * (wide ? 0.64 : 0.5), cy = h * (wide ? 0.5 : 0.48), sc = Math.min(w * (wide ? 0.5 : 0.9), h) * 0.32;
    const cyw = Math.cos(s.yaw), syw = Math.sin(s.yaw), cp = Math.cos(s.pitch), sp = Math.sin(s.pitch);
    const { P, N, S: start } = geo, q = s.q, n = U * V;
    const { proj, nz } = s;
    for (let i = 0; i < n; i++) {
      const k = i * 3, delay = (i % V) / V * 0.5 + Math.floor(i / V) / U * 0.4;
      const e = Math.min(1, Math.max(0, (s.born - delay) / 1.4)), f = 1 - Math.pow(1 - e, 3);
      for (let j = 0; j < 3; j++) q[k + j] = start[k + j] + (P[k + j] - start[k + j]) * f;
      let x = q[k] * cyw - q[k + 2] * syw, z = q[k] * syw + q[k + 2] * cyw, y = q[k + 1];
      const y2 = y * cp - z * sp, z2 = y * sp + z * cp;
      const persp = 4.2 / (4.2 + z2);
      proj[k] = cx + x * sc * persp; proj[k + 1] = cy + y2 * sc * persp; proj[k + 2] = z2;
      const a = N[k], b = N[k + 1], cc = N[k + 2];
      const nx = a * cyw - cc * syw, nzz = a * syw + cc * cyw;
      nz[k] = nx; nz[k + 1] = b * cp - nzz * sp; nz[k + 2] = b * sp + nzz * cp;
    }
    g.clearRect(0, 0, w, h);
    const settled = s.born > 2.2;
    const m = settled ? mode : 0;
    if (m === 0 || !settled) {
      g.lineWidth = d * 0.8;
      for (let b = 0; b < 3; b++) { // three depth bands, far to near
        g.strokeStyle = `rgba(255,255,255,${[0.08, 0.16, 0.3][b] * (settled ? 1 : Math.min(1, s.born / 2.2))})`;
        g.beginPath();
        for (let u = 0; u < U; u++) for (let v = 0; v < V; v++) {
          const i = (u * V + v) * 3, zb = proj[i + 2] > 0.35 ? 0 : proj[i + 2] > -0.35 ? 1 : 2;
          if (zb !== b) continue;
          const r = (((u + 1) % U) * V + v) * 3, dn = (u * V + ((v + 1) % V)) * 3;
          g.moveTo(proj[i], proj[i + 1]); g.lineTo(proj[r], proj[r + 1]);
          g.moveTo(proj[i], proj[i + 1]); g.lineTo(proj[dn], proj[dn + 1]);
        }
        g.stroke();
      }
      for (let i = 0; i < n; i++) {
        const k = i * 3, near = 0.35 + 0.65 * (1 - (proj[k + 2] + 1.5) / 3);
        g.fillStyle = `rgba(255,255,255,${Math.max(0.15, Math.min(1, near))})`;
        g.fillRect(proj[k] - d, proj[k + 1] - d, 2 * d, 2 * d);
      }
    } else {
      const quads = [];
      for (let u = 0; u < U; u++) for (let v = 0; v < V; v++) {
        const a = (u * V + v) * 3, b = (((u + 1) % U) * V + v) * 3, c2 = (((u + 1) % U) * V + ((v + 1) % V)) * 3, e = (u * V + ((v + 1) % V)) * 3;
        quads.push([proj[a + 2] + proj[c2 + 2], a, b, c2, e]);
      }
      quads.sort((x, y) => y[0] - x[0]);
      for (const [, a, b, c2, e] of quads) {
        if (m === 1) { const lit = Math.max(0, -nz[a] * 0.4 - nz[a + 1] * 0.55 - nz[a + 2] * 0.73); const v = Math.round(28 + lit * 215); g.fillStyle = `rgb(${v},${v},${v + 4})`; }
        else g.fillStyle = `rgb(${Math.round((nz[a] * 0.5 + 0.5) * 255)},${Math.round((nz[a + 1] * 0.5 + 0.5) * 255)},${Math.round((-nz[a + 2] * 0.5 + 0.5) * 255)})`;
        g.beginPath(); g.moveTo(proj[a], proj[a + 1]); g.lineTo(proj[b], proj[b + 1]); g.lineTo(proj[c2], proj[c2 + 1]); g.lineTo(proj[e], proj[e + 1]); g.closePath(); g.fill();
      }
    }
    if (deg.current) deg.current.style.transform = `rotate(${(s.yaw * 180) / Math.PI}deg)`;
  });

  const down = (e) => { e.currentTarget.setPointerCapture(e.pointerId); S.current.drag = { x: e.clientX, y: e.clientY, t: performance.now() }; };
  const move = (e) => {
    const s = S.current, dr = s.drag;
    if (!dr) return;
    const dx = e.clientX - dr.x, dy = e.clientY - dr.y, dtm = Math.max(16, performance.now() - dr.t) / 1000;
    s.yaw += dx * 0.01; s.pitch = Math.max(-1.1, Math.min(1.3, s.pitch + dy * 0.008));
    s.vy = (dx * 0.01) / dtm * 0.5; s.vp = (dy * 0.008) / dtm * 0.5;
    s.drag = { x: e.clientX, y: e.clientY, t: performance.now() };
  };
  const up = () => { S.current.drag = null; };

  return (
    <div className="mr-view" ref={stage}>
      <div className="mb-bar mr-bar"><i /><i /><i /><b>studio.hanzo.ai / <span>mori-1</span></b><em>mori</em><em>example</em></div>
      <canvas ref={cv} className="mr-cv" role="img" aria-label="A 3D mesh turning; drag or use the arrow keys to orbit" tabIndex={0} onKeyDown={(e) => { const s = S.current, k = { ArrowLeft: [-0.3, 0], ArrowRight: [0.3, 0], ArrowUp: [0, -0.2], ArrowDown: [0, 0.2] }[e.key]; if (k) { e.preventDefault(); s.yaw += k[0]; s.pitch = Math.max(-1.1, Math.min(1.3, s.pitch + k[1])); } }} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} />
      <div className="mr-hud mr-tl">
        <p className="mb-mono">SDF ➔ QUAD MESH: 245,820 TRIS</p>
        <p className="mb-mono mr-spin"><i ref={deg} aria-hidden="true" />SPINNING · 360°</p>
      </div>
      <div className="mr-hud mr-tr">
        <p className="mb-mono">PBR CHANNELS: ALBEDO · NORMAL · ROUGHNESS · METALLIC</p>
        <p className="mb-mono">EXPORTS: GLTF · USDZ · FBX</p>
      </div>
      <div className="mr-modes mb-chips" role="radiogroup" aria-label="View" onKeyDown={arrows}>
        {MODES.map((m, i) => <button key={m} type="button" role="radio" aria-checked={mode === i} className="mb-chip" onClick={() => setMode(i)}>{m}</button>)}
      </div>
    </div>
  );
}

// the film closes into a cube seen from above: a hexagon, its three near edges drawn in once it settles
const hexAt = (W, H, wide) => {
  const c = wide ? [W * 0.71, H * 0.5] : [W / 2, H * 0.25], R = wide ? Math.min(H * 0.44, W * 0.25) : Math.min(W * 0.42, H * 0.2);
  return { c, V: [-90, -30, 30, 90, 150, 210].map((a) => [c[0] + R * Math.cos((a * Math.PI) / 180), c[1] + R * Math.sin((a * Math.PI) / 180)]) };
};
const HEX = poly((W, H, wide) => dense(hexAt(W, H, wide).V, 5));
const EDGES = (W, H, wide) => {
  const { c, V } = hexAt(W, H, wide);
  return (
    <svg className="mr-edges" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      {[V[3], V[5], V[1]].map(([x, y], i) => <line key={i} x1={c[0]} y1={c[1]} x2={x} y2={y} />)}
    </svg>
  );
};

export default function Mori() {
  return (
    <Creative
      slug="mori"
      shape={HEX}
      aim={(W, H, wide) => (wide ? null : focus(0.6, 0.6, W / 2, H * 0.25, 1.3, [W * 0.1, H * 0.04, W * 0.9, H * 0.46])(W, H))}
      over={EDGES}
      headClass="mr-v2"
      first="chapters"
      flip
      demo={
        <section className="lv-room mr-room" data-room="dark" aria-label="Mori">
          <div className="mr-stage">
            <Viewport />
          </div>
          <div className="mr-below x-wrap">
            <div className="mr-specs"><Specs rows={[['Topology Quality', 'Quad-Dominant', 'Animation Ready'], ['UV Unwrapping', 'Automatic Atlas', 'On'], ['Geometry Engine', 'Hanzo Mori-1 Engine', 'SDF to mesh']]} /></div>
            <p className="mb-cap">An example of the canvas in Hanzo Design. Generation runs on Hanzo Cloud.</p>
          </div>
        </section>
      }
    />
  );
}
