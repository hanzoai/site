'use client';
/* Ingress's signature (motion map: `globe`): a turning globe of dots. Requests leave points around the world (the
   hostnames), arc into the one edge (hanzoai/ingress, on 80 and 443) and are routed on to a backend. A backend that
   stops answering health checks drops out of rotation (it goes hollow and no arc lands on it) and is put back when it
   recovers, as the page's own copy says. Points and arcs carry no labels; the legend beside it uses the page's words.
   - Pointer: drag to spin (yaw) and tilt, with inertia on release. Touch: swipe sideways to spin (touch-action pan-y,
     so a vertical swipe still scrolls the page). Keyboard: the globe is focusable; arrow keys spin and tilt it.
   - Idle: it turns by itself and routes a request about every half second while on screen; LivePause stops both.
   - Reduced motion: no idle turn; a still frame with a few requests mid-route (drag still turns it, without inertia).
   - JS off: a flat disc of the same size (CSS), so the layout never moves. Canvas size is fixed by aspect-ratio. */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import LivePause, { usePause } from '../../v2/LivePause';

const TAU = Math.PI * 2;
const rad = (d) => (d * Math.PI) / 180;
// a point on the unit sphere from latitude and longitude (degrees)
const ll = (lat, lon) => [Math.cos(rad(lat)) * Math.sin(rad(lon)), Math.sin(rad(lat)), Math.cos(rad(lat)) * Math.cos(rad(lon))];
// the dotted sphere (golden spiral)
const N = 1150;
const DOTS = Array.from({ length: N }, (_, i) => {
  const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = i * 2.399963;
  return [Math.cos(th) * r, y, Math.sin(th) * r];
});
// unlabeled places: one edge, three backends behind it, and the points requests come from
const EDGE = ll(18, 8);
const BACK = [ll(42, 46), ll(-14, 40), ll(30, -34)];
const SRC = [[52, -118], [38, -78], [-22, -46], [6, -70], [60, 12], [48, 92], [22, 112], [-34, 150], [34, 136], [-8, 112], [-30, 22], [10, -14], [64, -20], [44, 162]].map(([a, b]) => ll(a, b));
const DOWN = 1; // the backend that leaves and rejoins rotation
const EVERY = 0.55; // a new request every 0.55 s of globe time
const LIFE = 2.6;
const LEG1 = 1.0, LEG2 = 0.75;

const slerp = (a, b, u) => {
  const d = Math.min(1, Math.max(-1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
  const w = Math.acos(d);
  if (w < 1e-4) return a;
  const s = Math.sin(w), k1 = Math.sin((1 - u) * w) / s, k2 = Math.sin(u * w) / s;
  return [a[0] * k1 + b[0] * k2, a[1] * k1 + b[1] * k2, a[2] * k1 + b[2] * k2];
};
// the loop of the page's copy: 0 in rotation, 1-2 out of rotation, 3 put back when it recovers (the board's phases)
export const phaseAt = (clock) => Math.floor(clock / 5) % 4;
const isDown = (clock) => { const p = phaseAt(clock); return p === 1 || p === 2; };
// request i: which source sends it and which backend serves it (round robin over the backends in rotation)
const route = (i, spawn) => {
  const live = isDown(spawn) ? [0, 2] : [0, 1, 2];
  return [SRC[(i * 5) % SRC.length], live[i % live.length]];
};

export default function IngressGlobe({ onPhase }) {
  const box = useRef(null);
  const cv = useRef(null);
  const seen = useInView(box, { amount: 0.25 });
  const calm = useReducedMotion();
  const [paused, togglePause] = usePause();
  const live = seen && !paused && !calm;
  const st = useRef({ yaw: -0.25, tilt: 0.38, vy: 0, vt: 0, clock: 9.4, drag: null, last: 0, idleAt: -10, raf: 0, size: [0, 0], dpr: 1 });
  const liveRef = useRef(live);
  liveRef.current = live;
  const phaseRef = useRef(-1);

  const draw = useCallback(() => {
    const c = cv.current, s = st.current;
    if (!c) return;
    const [w, h] = s.size;
    if (!w || !h) return;
    const g = c.getContext('2d');
    g.setTransform(s.dpr, 0, 0, s.dpr, 0, 0);
    g.clearRect(0, 0, w, h);
    const R = Math.min(w, h) * 0.46, cx = w / 2, cy = h / 2;
    const cy0 = Math.cos(s.yaw), sy0 = Math.sin(s.yaw), ct = Math.cos(s.tilt), stt = Math.sin(s.tilt);
    const proj = (p, lift = 1) => {
      const X = p[0] * cy0 + p[2] * sy0, Z = -p[0] * sy0 + p[2] * cy0;
      const Y = p[1] * ct - Z * stt, Z2 = p[1] * stt + Z * ct;
      return [cx + X * R * lift, cy - Y * R * lift, Z2];
    };
    // the limb (the soft body is the disc's CSS background, so JS off shows the same sphere)
    g.strokeStyle = 'rgba(10, 10, 10, .14)'; g.lineWidth = 1;
    g.beginPath(); g.arc(cx, cy, R, 0, TAU); g.stroke();
    for (const p of DOTS) {
      const [x, y, z] = proj(p);
      if (z < 0) continue;
      g.fillStyle = `rgba(10, 10, 10, ${(0.1 + z * 0.32).toFixed(3)})`;
      g.beginPath(); g.arc(x, y, 0.8 + z * 0.9, 0, TAU); g.fill();
    }
    const clock = s.clock;
    const down = isDown(clock);
    const hits = new Set();
    let edgeHit = 0;
    // requests in flight: source -> edge, then edge -> backend, along lifted great circles
    const first = Math.max(0, Math.floor((clock - LIFE) / EVERY));
    for (let i = first; i * EVERY <= clock; i++) {
      const spawn = i * EVERY, age = clock - spawn;
      if (age < 0 || age > LIFE) continue;
      const [src, b] = route(i, spawn);
      const fade = 1 - Math.min(1, Math.max(0, (age - (LEG1 + LEG2)) / (LIFE - LEG1 - LEG2)));
      const leg = (a, z, p, lw) => {
        if (p <= 0) return;
        const d = Math.acos(Math.min(1, a[0] * z[0] + a[1] * z[1] + a[2] * z[2]));
        const hgt = 0.06 + d * 0.16, n = 36, end = Math.round(n * Math.min(1, p));
        let prev = null;
        g.lineWidth = lw;
        for (let k = 0; k <= end; k++) {
          const u = k / n, q = proj(slerp(a, z, u), 1 + hgt * Math.sin(Math.PI * u));
          if (prev && q[2] > -0.05 && prev[2] > -0.05) {
            g.strokeStyle = `rgba(10, 10, 10, ${(fade * (0.25 + 0.6 * u)).toFixed(3)})`;
            g.beginPath(); g.moveTo(prev[0], prev[1]); g.lineTo(q[0], q[1]); g.stroke();
          }
          prev = q;
        }
        if (p < 1 && prev && prev[2] > -0.05) { g.fillStyle = `rgba(10, 10, 10, ${fade.toFixed(3)})`; g.beginPath(); g.arc(prev[0], prev[1], 2.4, 0, TAU); g.fill(); }
      };
      const p1 = age / LEG1, p2 = (age - LEG1) / LEG2;
      leg(src, EDGE, p1, 1.3);
      leg(EDGE, BACK[b], p2, 1.6);
      if (p1 >= 1 && p1 < 1.4) edgeHit = Math.max(edgeHit, 1 - (p1 - 1) / 0.4);
      if (p2 >= 1) hits.add(b);
    }
    // the sources: small ink points
    for (const p of SRC) {
      const [x, y, z] = proj(p);
      if (z < 0) continue;
      g.fillStyle = `rgba(10, 10, 10, ${(0.35 + z * 0.5).toFixed(3)})`;
      g.beginPath(); g.arc(x, y, 2.6, 0, TAU); g.fill();
    }
    // the backends: ink squares; the one out of rotation is hollow
    BACK.forEach((p, i) => {
      const [x, y, z] = proj(p);
      const a = z < 0 ? 0.18 : 1;
      const sz = hits.has(i) ? 6.5 : 5.5;
      g.lineWidth = 1.6;
      if (i === DOWN && down) { g.strokeStyle = `rgba(10, 10, 10, ${a})`; g.strokeRect(x - sz, y - sz, sz * 2, sz * 2); }
      else { g.fillStyle = `rgba(10, 10, 10, ${a})`; g.fillRect(x - sz, y - sz, sz * 2, sz * 2); }
    });
    // the edge: a filled point in a ring that opens each time a request lands
    {
      const [x, y, z] = proj(EDGE);
      const a = z < 0 ? 0.2 : 1;
      g.fillStyle = `rgba(10, 10, 10, ${a})`;
      g.beginPath(); g.arc(x, y, 5, 0, TAU); g.fill();
      g.strokeStyle = `rgba(10, 10, 10, ${(a * 0.55).toFixed(3)})`; g.lineWidth = 1.4;
      g.beginPath(); g.arc(x, y, 11, 0, TAU); g.stroke();
      if (edgeHit > 0 && z >= 0) {
        g.strokeStyle = `rgba(10, 10, 10, ${(edgeHit * 0.6).toFixed(3)})`;
        g.beginPath(); g.arc(x, y, 11 + (1 - edgeHit) * 14, 0, TAU); g.stroke();
      }
    }
    const ph = phaseAt(clock);
    if (ph !== phaseRef.current) { phaseRef.current = ph; onPhase && onPhase(ph); }
  }, [onPhase]);

  // one rAF loop: it runs while the globe turns by itself, is dragged or still coasting, then stops
  const kick = useCallback(() => {
    const s = st.current;
    if (s.raf) return;
    s.last = performance.now();
    const loop = (now) => {
      const dt = Math.min(0.05, (now - s.last) / 1000);
      s.last = now;
      const run = liveRef.current;
      if (!s.drag) {
        s.yaw += s.vy * dt; s.tilt += s.vt * dt;
        const k = Math.exp(-dt * 2.6);
        s.vy *= k; s.vt *= k;
        if (run && now / 1000 - s.idleAt > 1.2) s.vy += (0.16 - s.vy) * Math.min(1, dt * 1.5); // ease back into the idle turn
        s.tilt += (0.38 - s.tilt) * Math.min(1, dt * 0.8) * (Math.abs(s.vt) < 0.05 ? 1 : 0);
      }
      s.tilt = Math.max(-0.9, Math.min(0.9, s.tilt));
      if (run) s.clock += dt;
      draw();
      const coasting = Math.abs(s.vy) > 0.002 || Math.abs(s.vt) > 0.002 || Math.abs(s.tilt - 0.38) > 0.002;
      s.raf = run || s.drag || coasting ? requestAnimationFrame(loop) : 0;
    };
    s.raf = requestAnimationFrame(loop);
  }, [draw]);

  // size the canvas to its box (the box's size is fixed by CSS, so this never moves the layout)
  useEffect(() => {
    const c = cv.current, s = st.current;
    if (!c) return;
    const fit = () => {
      const w = c.clientWidth, h = c.clientHeight, dpr = Math.min(2, window.devicePixelRatio || 1);
      s.size = [w, h]; s.dpr = dpr;
      c.width = Math.round(w * dpr); c.height = Math.round(h * dpr);
      draw();
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(c);
    return () => ro.disconnect();
  }, [draw]);

  useEffect(() => {
    const s = st.current;
    if (live) { s.vy = s.vy || 0.16; kick(); }
    else draw();
  }, [live, kick, draw]);
  useEffect(() => () => { cancelAnimationFrame(st.current.raf); st.current.raf = 0; }, []);

  const onDown = (e) => {
    const s = st.current;
    if (e.button !== undefined && e.button !== 0) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    s.drag = { x: e.clientX, y: e.clientY, t: performance.now(), id: e.pointerId };
    s.vy = 0; s.vt = 0;
    box.current?.setAttribute('data-drag', '');
    kick();
  };
  const onMove = (e) => {
    const s = st.current, d = s.drag;
    if (!d || d.id !== e.pointerId) return;
    const now = performance.now(), dt = Math.max(1, now - d.t) / 1000;
    const w = s.size[0] || 400;
    const dyaw = ((e.clientX - d.x) / w) * 3.2;
    const dtilt = e.pointerType === 'touch' ? 0 : ((e.clientY - d.y) / w) * 2.4; // phones: sideways only, the page keeps its vertical scroll
    s.yaw += dyaw; s.tilt = Math.max(-0.9, Math.min(0.9, s.tilt + dtilt));
    s.vy = calm ? 0 : 0.7 * s.vy + 0.3 * (dyaw / dt);
    s.vt = calm ? 0 : 0.7 * s.vt + 0.3 * (dtilt / dt);
    d.x = e.clientX; d.y = e.clientY; d.t = now;
  };
  const onUp = (e) => {
    const s = st.current;
    if (!s.drag || s.drag.id !== e.pointerId) return;
    if (performance.now() - s.drag.t > 90) { s.vy = 0; s.vt = 0; } // a hold before release: no throw
    s.vy = Math.max(-6, Math.min(6, s.vy)); s.vt = Math.max(-4, Math.min(4, s.vt));
    s.drag = null; s.idleAt = performance.now() / 1000;
    box.current?.removeAttribute('data-drag');
    kick();
  };
  const onKey = (e) => {
    const s = st.current;
    const k = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key];
    if (!k) return;
    e.preventDefault();
    if (calm) { s.yaw += k[0] * 0.3; s.tilt = Math.max(-0.9, Math.min(0.9, s.tilt + k[1] * 0.2)); draw(); return; }
    s.vy += k[0] * 1.4; s.vt += k[1] * 0.9; s.idleAt = performance.now() / 1000;
    kick();
  };

  return (
    <div className="ig-globe" ref={box}>
      <LivePause paused={paused} onToggle={togglePause} className="ig-globe-pause" />
      <div className="ig-globe-disc" tabIndex={0} role="img" aria-labelledby="ig-lede" onKeyDown={onKey}
        onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
        <canvas ref={cv} aria-hidden="true" />
      </div>
    </div>
  );
}
