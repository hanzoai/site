'use client';
/* MqGlobe: /mq's signature (docs/MOTION-MAP.md `globe`). A dotted sphere on paper: a Fibonacci field of ink dots,
   denser and darker where they face you, ringed only by latitude lines (no meridians, no wireframe). Hollow rings are
   where jobs are added (Queue), filled squares are where they run (Worker). Each job hops from a Queue to a Worker on a
   dotted arc with a short comet tail; the priority-1 job flies heavier and faster, cutting ahead. One in five fails its
   first attempt: a dashed ring waits out an exponential backoff at that worker, then the job is handed to another
   worker; one in eleven fails all three attempts and stays as a crossed ring (the failed set) instead of vanishing.
   Drag to spin it (yaw and tilt, with inertia); on touch, a sideways swipe spins it and a vertical swipe still scrolls
   the page (touch-action: pan-y). Keyboard: focus it and use the arrow keys. A pause stops the spin and the jobs.
   Reduced motion: no spin and no flights; a still frame with its routes drawn, still draggable. JS off: an SVG outline
   of the sphere holds the same box. Points are unlabeled; deck greys only. */
import { useEffect, useRef, useState } from 'react';
import LivePause, { usePause } from '../../v2/LivePause';

const RAD = Math.PI / 180;
const INK = '10,10,10';
// unlabeled places: where jobs are added (Queue) and where they run (Worker), as [lat, lon]
const QUEUES = [[38, -96], [51, 2], [-23, -46], [35, 139]];
const WORKERS = [[47, -122], [50, 9], [1, 104], [-34, 151], [40, -74], [19, 73]];
const unit = ([la, lo]) => [Math.cos(la * RAD) * Math.sin(lo * RAD), Math.sin(la * RAD), Math.cos(la * RAD) * Math.cos(lo * RAD)];
const Q = QUEUES.map(unit), W = WORKERS.map(unit);

function fib(n) {
  const out = [], g = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (2 * (i + 0.5)) / n, r = Math.sqrt(1 - y * y), t = i * g;
    out.push([Math.cos(t) * r, y, Math.sin(t) * r]);
  }
  return out;
}
const slerp = (a, b, t) => {
  const d = Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2])), w = Math.acos(d);
  if (w < 1e-4) return a;
  const s = Math.sin(w), ka = Math.sin((1 - t) * w) / s, kb = Math.sin(t * w) / s;
  return [a[0] * ka + b[0] * kb, a[1] * ka + b[1] * kb, a[2] * ka + b[2] * kb];
};
const ang = (a, b) => Math.acos(Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2])));
const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

export default function MqGlobe({ label }) {
  const wrap = useRef(null);
  const cvs = useRef(null);
  const [paused, pause] = usePause();
  const [ready, setReady] = useState(false);
  const pausedRef = useRef(false);
  pausedRef.current = paused;

  useEffect(() => {
    const el = wrap.current, c = cvs.current;
    if (!el || !c) return;
    const ctx = c.getContext('2d');
    const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0, h = 0, R = 0, cx = 0, cy = 0, dpr = 1, dots = [];
    const view = { yaw: -0.6, pitch: 0.38, vy: 0, vp: 0 };
    let drag = null, seen = true, raf = 0, last = performance.now(), sim = 0, spawnAt = 0, count = 0, dirty = true;
    const jobs = [], marks = [];

    const size = () => {
      const r = el.getBoundingClientRect();
      w = el.clientWidth; h = el.clientHeight;
      dpr = Math.min(2, devicePixelRatio || 1);
      c.width = Math.round(w * dpr); c.height = Math.round(h * dpr);
      R = Math.min(w, h) * 0.43; cx = w / 2; cy = h / 2;
      dots = fib(w < 520 ? 900 : 1500);
      dirty = true;
      return r;
    };
    // rotate a unit vector by yaw (y axis) then pitch (x axis)
    const rot = (p) => {
      const cyw = Math.cos(view.yaw), syw = Math.sin(view.yaw), cp = Math.cos(view.pitch), sp = Math.sin(view.pitch);
      const x = p[0] * cyw + p[2] * syw, z1 = -p[0] * syw + p[2] * cyw;
      return [x, p[1] * cp - z1 * sp, p[1] * sp + z1 * cp];
    };
    const proj = (p, k = 1) => { const r = rot(p); return [cx + r[0] * R * k, cy - r[1] * R * k, r[2], r]; };
    const hidden = (r, k) => r[2] < 0 && (r[0] * r[0] + r[1] * r[1]) * k * k < 1;

    const spawn = (fromQ) => {
      count++;
      const q = fromQ ?? (count % Q.length);
      const wk = (count * 7 + 3) % W.length;
      const fails = count % 11 === 0 ? 3 : count % 5 === 0 ? 1 : 0;
      jobs.push({ a: Q[q], b: W[wk], wk, t0: sim, dur: 1.5 + ang(Q[q], W[wk]) * 0.5, attempt: 1, fails, hi: count % 4 === 0, phase: 'fly' });
    };

    const routes = calm ? Array.from({ length: 7 }, (_, i) => ({ a: Q[i % Q.length], b: W[(i * 7 + 3) % W.length] })) : [];

    const arcPoint = (a, b, t) => {
      const v = slerp(a, b, t), k = 1 + (0.06 + ang(a, b) * 0.12) * Math.sin(Math.PI * t);
      return [v, k];
    };

    const drawArc = (a, b, from, to, alpha, size, dotted) => {
      const steps = Math.max(8, Math.round((to - from) * 60));
      for (let i = 0; i <= steps; i++) {
        const t = from + ((to - from) * i) / steps;
        const [v, k] = arcPoint(a, b, t);
        const [x, y, , r] = proj(v, k);
        const fade = dotted ? 1 : (i / steps);
        const al = alpha * fade * (hidden(r, k) ? 0.22 : 1);
        if (al < 0.01) continue;
        ctx.fillStyle = `rgba(${INK},${al.toFixed(3)})`;
        ctx.beginPath(); ctx.arc(x, y, size * (dotted ? 1 : 0.5 + fade * 0.6), 0, 6.283); ctx.fill();
      }
    };

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      // the dotted shell: front dots in depth-shaded buckets, back dots faint
      const buckets = [[], [], [], [], [], []];
      for (const p of dots) {
        const r = rot(p);
        const b = r[2] < 0 ? 0 : 1 + Math.min(4, Math.floor(r[2] * 5));
        buckets[b].push(cx + r[0] * R, cy - r[1] * R, r[2]);
      }
      const al = [0.07, 0.2, 0.3, 0.42, 0.56, 0.72];
      buckets.forEach((arr, b) => {
        ctx.fillStyle = `rgba(${INK},${al[b]})`;
        ctx.beginPath();
        for (let i = 0; i < arr.length; i += 3) {
          const s = b === 0 ? 0.7 : 0.75 + arr[i + 2] * 0.85;
          ctx.moveTo(arr[i] + s, arr[i + 1]); ctx.arc(arr[i], arr[i + 1], s, 0, 6.283);
        }
        ctx.fill();
      });
      // latitude rings only: front solid, back dashed
      for (const la of [-60, -30, 0, 30, 60]) {
        for (const front of [false, true]) {
          ctx.beginPath();
          let pen = false;
          for (let i = 0; i <= 120; i++) {
            const [x, y, z] = proj(unit([la, i * 3]));
            if ((z >= 0) === front) { pen ? ctx.lineTo(x, y) : ctx.moveTo(x, y); pen = true; } else pen = false;
          }
          ctx.setLineDash(front ? [] : [2, 5]);
          ctx.lineWidth = la === 0 ? 1.1 : 0.8;
          ctx.strokeStyle = `rgba(${INK},${front ? (la === 0 ? 0.3 : 0.16) : 0.08})`;
          ctx.stroke();
        }
      }
      ctx.setLineDash([]);
      // the rim
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.lineWidth = 1; ctx.strokeStyle = `rgba(${INK},0.22)`; ctx.stroke();

      // routes (reduced motion: drawn still)
      for (const r of routes) {
        drawArc(r.a, r.b, 0, 1, 0.32, 1.1, true);
        const [v, k] = arcPoint(r.a, r.b, 0.5); const [x, y, , rr] = proj(v, k);
        ctx.fillStyle = `rgba(${INK},${hidden(rr, k) ? 0.25 : 1})`; ctx.beginPath(); ctx.arc(x, y, 3, 0, 6.283); ctx.fill();
      }

      // jobs in flight: a faint dotted route, a comet tail and a head
      for (const j of jobs) {
        if (j.phase !== 'fly') continue;
        const u = ease(Math.min(1, (sim - j.t0) / j.dur));
        drawArc(j.a, j.b, 0, 1, 0.12, 0.9, true);
        drawArc(j.a, j.b, Math.max(0, u - 0.28), u, j.hi ? 0.95 : 0.7, j.hi ? 2 : 1.5, false);
        const [v, k] = arcPoint(j.a, j.b, u); const [x, y, , r] = proj(v, k);
        const a = hidden(r, k) ? 0.25 : 1;
        ctx.fillStyle = `rgba(${INK},${a})`;
        ctx.beginPath(); ctx.arc(x, y, j.hi ? 4.5 : 3, 0, 6.283); ctx.fill();
        if (j.hi) { ctx.beginPath(); ctx.arc(x, y, 8, 0, 6.283); ctx.lineWidth = 1; ctx.strokeStyle = `rgba(${INK},${a * 0.5})`; ctx.stroke(); }
      }
      // backoff, completed and the failed set, at the worker
      for (const m of marks) {
        const [x, y, , r] = proj(m.p); const back = hidden(r, 1) ? 0.25 : 1;
        const age = sim - m.t0;
        ctx.lineWidth = 1.2;
        if (m.kind === 'ok') {
          const t = Math.min(1, age / 0.9);
          ctx.strokeStyle = `rgba(${INK},${(1 - t) * 0.7 * back})`;
          ctx.beginPath(); ctx.arc(x, y, 5 + t * 16, 0, 6.283); ctx.stroke();
        } else if (m.kind === 'wait') {
          const t = Math.min(1, age / m.len);
          ctx.setLineDash([3, 3]); ctx.strokeStyle = `rgba(${INK},${0.85 * back})`;
          ctx.beginPath(); ctx.arc(x, y, 10, -Math.PI / 2, -Math.PI / 2 + t * 6.283); ctx.stroke(); ctx.setLineDash([]);
        } else {
          const t = Math.min(1, age / 0.3), fade = age > m.len - 0.6 ? Math.max(0, (m.len - age) / 0.6) : 1;
          ctx.strokeStyle = `rgba(${INK},${t * fade * back})`;
          ctx.setLineDash([2.5, 2.5]); ctx.beginPath(); ctx.arc(x, y, 9, 0, 6.283); ctx.stroke(); ctx.setLineDash([]);
          ctx.beginPath(); ctx.moveTo(x - 4, y - 4); ctx.lineTo(x + 4, y + 4); ctx.moveTo(x + 4, y - 4); ctx.lineTo(x - 4, y + 4); ctx.stroke();
        }
      }
      // the places: Queue as hollow rings, Worker as filled squares
      Q.forEach((p) => {
        const [x, y, , r] = proj(p); const a = hidden(r, 1) ? 0.2 : 1;
        ctx.fillStyle = `rgba(255,255,255,${a})`; ctx.strokeStyle = `rgba(${INK},${a})`; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.arc(x, y, 5.5, 0, 6.283); ctx.fill(); ctx.stroke();
      });
      W.forEach((p) => {
        const [x, y, , r] = proj(p); const a = hidden(r, 1) ? 0.2 : 1;
        ctx.fillStyle = `rgba(${INK},${a})`; ctx.fillRect(x - 4, y - 4, 8, 8);
      });
    };

    const tick = (dt) => {
      sim += dt;
      if (sim >= spawnAt) { spawn(); spawnAt = sim + 0.55; }
      for (let i = jobs.length - 1; i >= 0; i--) {
        const j = jobs[i];
        if (j.phase === 'fly' && sim - j.t0 >= j.dur) {
          if (j.attempt <= j.fails) {
            if (j.attempt < 3) {
              const len = 0.5 * Math.pow(2, j.attempt - 1); // backoff · exponential
              marks.push({ p: j.b, kind: 'wait', t0: sim, len });
              j.phase = 'wait'; j.until = sim + len;
            } else { marks.push({ p: j.b, kind: 'bad', t0: sim, len: 6 }); jobs.splice(i, 1); }
          } else { marks.push({ p: j.b, kind: 'ok', t0: sim, len: 0.9 }); jobs.splice(i, 1); }
        } else if (j.phase === 'wait' && sim >= j.until) {
          const nx = (j.wk + 2) % W.length; // the lock is handed to another worker
          Object.assign(j, { a: j.b, b: W[nx], wk: nx, t0: sim, dur: 1.2 + ang(j.b, W[nx]) * 0.45, attempt: j.attempt + 1, phase: 'fly' });
        }
      }
      for (let i = marks.length - 1; i >= 0; i--) if (sim - marks[i].t0 > marks[i].len) marks.splice(i, 1);
    };

    const loop = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      const run = !calm && !pausedRef.current;
      if (!drag) {
        if (Math.abs(view.vy) > 0.0005 || Math.abs(view.vp) > 0.0005) {
          view.yaw += view.vy; view.pitch = Math.max(-0.9, Math.min(0.9, view.pitch + view.vp));
          const f = calm ? 0.8 : 0.94; view.vy *= f; view.vp *= f; dirty = true;
        }
        if (run) { view.yaw += dt * 0.16; dirty = true; }
      }
      if (run) { tick(dt); dirty = true; }
      if (dirty) { draw(); dirty = false; }
      raf = seen ? requestAnimationFrame(loop) : 0;
    };
    const start = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(loop); } };

    size();
    if (!calm) { for (let i = 0; i < 5; i++) { spawn(); jobs[jobs.length - 1].t0 -= i * 0.35; } }
    draw(); setReady(true); start();

    const ro = new ResizeObserver(() => { size(); draw(); });
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => { seen = e.isIntersecting && !document.hidden; if (seen) start(); });
    io.observe(el);
    const vis = () => { seen = !document.hidden; if (seen) start(); };
    document.addEventListener('visibilitychange', vis);

    const down = (e) => {
      if (e.button > 0) return;
      drag = { x: e.clientX, y: e.clientY, id: e.pointerId, touch: e.pointerType !== 'mouse' };
      view.vy = 0; view.vp = 0;
      el.setAttribute('data-drag', '');
      if (!drag.touch) el.setPointerCapture(e.pointerId);
    };
    const move = (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      drag.x = e.clientX; drag.y = e.clientY;
      const k = 1 / Math.max(120, R);
      view.vy = dx * k; view.yaw += view.vy;
      if (!drag.touch) { view.vp = dy * k; view.pitch = Math.max(-0.9, Math.min(0.9, view.pitch + view.vp)); } else view.vp = 0;
      dirty = true; start();
    };
    const up = () => { drag = null; el.removeAttribute('data-drag'); start(); };
    const key = (e) => {
      const m = { ArrowLeft: [-0.05, 0], ArrowRight: [0.05, 0], ArrowUp: [0, -0.035], ArrowDown: [0, 0.035] }[e.key];
      if (!m) return;
      e.preventDefault();
      view.vy += m[0]; view.vp += m[1]; dirty = true; start();
    };
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    el.addEventListener('keydown', key);
    return () => {
      cancelAnimationFrame(raf); raf = 0; seen = false;
      ro.disconnect(); io.disconnect();
      document.removeEventListener('visibilitychange', vis);
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
      el.removeEventListener('keydown', key);
    };
  }, []);

  return (
    <div className="mq-globe" data-ready={ready || undefined} data-paused={paused || undefined}>
      <LivePause paused={paused} onToggle={pause} className="mq-globe-pause" />
      <div ref={wrap} className="mq-globe-cv" tabIndex={0} role="img" aria-label={label}>
        <svg className="mq-globe-still" viewBox="0 0 200 200" aria-hidden="true">
          <circle cx="100" cy="100" r="86" />
          <ellipse cx="100" cy="112" rx="86" ry="24" />
          <ellipse cx="100" cy="80" rx="72" ry="19" />
          <ellipse cx="100" cy="140" rx="64" ry="14" />
        </svg>
        <canvas ref={cvs} aria-hidden="true" />
      </div>
    </div>
  );
}
