'use client';
/* PubSub's globe (the page's signature, docs/MOTION-MAP.md `globe`). One message is published on events.user.signup in
   one place, written into the stream EVENTS in another, then fanned out to subscribers spread around the planet:
   analytics and audit each get a copy, a queue group of three hands it to exactly one member. Acks travel home along
   dashed arcs; under "ack every" the audit copy goes unacked once and is redelivered. The globe turns to follow the
   message (camera on the hop being made) and the visitor drags it to spin it (touch: drag sideways; vertical stays
   scroll). Hovering a place names it and lights its arcs. Places are drawn, not data centres; sequence numbers are drawn.
   Drawn on one canvas (graticule, arcs, places, labels), one rAF loop that runs only while seen and unpaused. Reduced
   motion: the settled fan-out, every arc and ack drawn, still. */
import { useEffect, useRef } from 'react';
import { useInView } from 'motion/react';
import { useFrame } from '../Frame';

const RAD = Math.PI / 180;
const vec = (lat, lon) => [Math.cos(lat * RAD) * Math.sin(lon * RAD), Math.sin(lat * RAD), Math.cos(lat * RAD) * Math.cos(lon * RAD)];

// the places on this drawing (the names are the subscribers in events.go and on the bus)
export const PLACES = {
  pub: { v: vec(36, -74), name: 'publish' },
  str: { v: vec(52, -10), name: 'stream EVENTS' },
  analytics: { v: vec(38, 58), name: 'analytics' },
  audit: { v: vec(-34, 28), name: 'audit' },
  q0: { v: vec(-24, -52), name: 'queue group', q: 0 },
  q1: { v: vec(4, 74), name: 'queue group', q: 1 },
  q2: { v: vec(-4, -8), name: 'queue group', q: 2 },
};
const SUBS = ['analytics', 'audit'];
const QS = ['q0', 'q1', 'q2'];
// where the camera looks during each beat of the fan-out (yaw in radians: the longitude brought to the front)
const LOOK = [-50, -24, 12, 14, 0].map((l) => -l * RAD);

// ease-emphasis cubic-bezier(.16,1,.3,1), solved for x
function emph(x) {
  if (x <= 0) return 0; if (x >= 1) return 1;
  let t = x;
  for (let i = 0; i < 6; i++) {
    const bx = 3 * (1 - t) * (1 - t) * t * 0.16 + 3 * (1 - t) * t * t * 0.3 + t * t * t;
    const d = 3 * (1 - t) * (1 - t) * 0.16 + 6 * (1 - t) * t * (0.3 - 0.16) + 3 * t * t * (1 - 0.3);
    t -= (bx - x) / (d || 1);
    t = Math.min(1, Math.max(0, t));
  }
  return 3 * (1 - t) * (1 - t) * t + 3 * (1 - t) * t * t + t * t * t;
}

// a point s of the way along the great circle from a to b, lifted off the surface (hi: acks and redelivery fly higher,
// so the way home never hides under the way out)
function slerp(a, b, s, hi = 1) {
  const dot = Math.min(1, Math.max(-1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
  const om = Math.acos(dot), so = Math.sin(om) || 1;
  const ka = Math.sin((1 - s) * om) / so, kb = Math.sin(s * om) / so;
  const lift = 1 + (0.08 + 0.22 * om / Math.PI) * hi * Math.sin(Math.PI * s);
  return [(a[0] * ka + b[0] * kb) * lift, (a[1] * ka + b[1] * kb) * lift, (a[2] * ka + b[2] * kb) * lift];
}

/* the arcs a frame shows, from the beat t (0 publish, 1 stored, 2 fanned out, 3 acks, 4 settled), how far into it (p,
   0..1) and the ack policy. Each: [from, to, drawn 0..1, kind] with kind 'msg' (solid), 'ack' (dashed home), 're'
   (redelivery, dashed out). */
function arcs(t, p, ack, pick) {
  const out = [];
  const q = QS[pick];
  const to = [...SUBS, q];
  if (t === 0) out.push(['pub', 'str', emph(p / 0.9), 'msg']);
  else out.push(['pub', 'str', 1, 'msg']);
  if (t >= 2) to.forEach((s, i) => out.push(['str', s, t === 2 ? emph((p - i * 0.06) / 0.75) : 1, 'msg']));
  if (ack !== 'none' && t >= 3) {
    to.forEach((s, i) => {
      if (ack === 'every' && s === 'audit') {
        if (t === 3) out.push(['str', 'audit', emph((p - 0.2) / 0.7), 're']);
        else out.push(['str', 'audit', 1, 're'], ['audit', 'str', emph(p / 0.6), 'ack']);
      } else out.push([s, 'str', t === 3 ? emph((p - i * 0.08) / 0.7) : 1, 'ack']);
    });
  }
  return out;
}

export default function PsGlobe({ t, seq, ack, pick, run, calm, onHover, label }) {
  const wrap = useRef(null);
  const cv = useRef(null);
  const seen = useInView(wrap, { amount: 0.2 });
  const st = useRef({ yaw: LOOK[4], tilt: 0.32, vy: 0, hand: 0, drag: null, hover: null, w: 0, h: 0, dpr: 1, font: 'monospace', t0: 0 });
  const latest = useRef({ t, ack, pick, calm, label });
  latest.current = { t, ack, pick, calm, label };

  // the beat changed: note when, so the frame knows how far into it we are
  useEffect(() => { st.current.t0 = performance.now(); }, [t, seq]);

  // size the canvas to its box (the box's height is fixed in CSS, so nothing around it moves)
  useEffect(() => {
    const el = cv.current; if (!el) return;
    st.current.font = getComputedStyle(el).getPropertyValue('--mono') || 'monospace';
    const fit = () => {
      const r = el.getBoundingClientRect(), d = Math.min(2, devicePixelRatio || 1);
      Object.assign(st.current, { w: r.width, h: r.height, dpr: d });
      el.width = Math.round(r.width * d); el.height = Math.round(r.height * d);
      draw(performance.now(), 0);
    };
    fit();
    const ro = new ResizeObserver(fit); ro.observe(el);
    return () => ro.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // a still frame whenever calm, paused or off screen changes what is shown
  useEffect(() => { if (!run || !seen || calm) draw(performance.now(), 0); }, [run, seen, t, seq, ack, pick, calm, label]); // eslint-disable-line react-hooks/exhaustive-deps

  useFrame(run && seen && !calm, (now, dt) => draw(now * 1000, dt));

  function project(p, s) {
    const cy = Math.cos(s.yaw), sy = Math.sin(s.yaw), ct = Math.cos(s.tilt), stl = Math.sin(s.tilt);
    const x1 = p[0] * cy + p[2] * sy, z1 = -p[0] * sy + p[2] * cy;
    const y2 = p[1] * ct - z1 * stl, z2 = p[1] * stl + z1 * ct;
    return [x1, y2, z2];
  }

  function draw(now, dt) {
    const el = cv.current; const s = st.current; if (!el || !s.w) return;
    const { t, ack: a, pick: k, calm: c, label } = latest.current;
    const ctx = el.getContext('2d');
    const { w, h, dpr } = s;
    const R = w < 520 ? Math.min(w * 0.31, h * 0.38) : Math.min(w * 0.36, h * 0.42), cx = w / 2, cy = h / 2 + h * 0.03;
    const p = c ? 1 : Math.min(1, (now - s.t0) / ([900, 900, 1300, 1500, 1800][t] || 1000));
    // the camera: follow the beat unless a hand has the globe (it lets go 2.4 s after release, with inertia meanwhile)
    if (!s.drag) {
      if (now - s.hand < 2400) { s.yaw += s.vy * dt; s.vy *= Math.pow(0.04, dt); }
      else if (!c && dt) {
        // the planet keeps turning a little around where the message is (a slow sway, never a stop)
        let d = LOOK[t] + Math.sin(now / 3800) * 0.22 - s.yaw; d = Math.atan2(Math.sin(d), Math.cos(d));
        s.yaw += d * (1 - Math.pow(0.12, dt));
        s.tilt += (0.32 - s.tilt) * (1 - Math.pow(0.2, dt));
      }
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    const P = (v) => { const q = project(v, s); return [cx + q[0] * R, cy - q[1] * R, q[2], Math.hypot(q[0], q[1])]; };
    // the planet: a rim and a graticule, front lines brighter than the back ones seen through it
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(255,255,255,.22)';
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
    const line = (pts) => {
      for (let i = 1; i < pts.length; i++) {
        const A = pts[i - 1], B = pts[i];
        ctx.strokeStyle = A[2] > 0 && B[2] > 0 ? 'rgba(255,255,255,.14)' : 'rgba(255,255,255,.05)';
        ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.stroke();
      }
    };
    for (let lat = -60; lat <= 60; lat += 30) line(Array.from({ length: 49 }, (_, i) => P(vec(lat, i * 7.5))));
    for (let lon = 0; lon < 180; lon += 30) line(Array.from({ length: 49 }, (_, i) => P(vec(i * 7.5 - 180, lon))));
    // the arcs
    const hov = s.hover;
    for (const [f, to, d, kind] of arcs(t, p, a, k)) {
      if (d <= 0) continue;
      const lit = !hov || hov === f || hov === to;
      const A = PLACES[f].v, B = PLACES[to].v, n = 40, m = Math.max(1, Math.ceil(n * d));
      ctx.setLineDash(kind === 'msg' ? [] : kind === 're' ? [6, 5] : [3, 5]);
      ctx.lineWidth = kind === 'msg' ? 2 : 1.5;
      const hi = kind === 'msg' ? 1 : kind === 're' ? 1.7 : 2.3;
      let prev = P(slerp(A, B, 0));
      for (let i = 1; i <= m; i++) {
        const q = P(slerp(A, B, Math.min(d, i / n), hi));
        const front = q[2] > 0 || q[3] > 1;
        ctx.strokeStyle = !lit ? 'rgba(255,255,255,.14)' : front ? (kind === 'ack' ? 'rgba(255,255,255,.78)' : '#fafafa') : 'rgba(255,255,255,.2)';
        ctx.beginPath(); ctx.moveTo(prev[0], prev[1]); ctx.lineTo(q[0], q[1]); ctx.stroke();
        prev = q;
      }
      ctx.setLineDash([]);
      if (d < 1 && (prev[2] > 0 || prev[3] > 1)) { ctx.fillStyle = '#fafafa'; ctx.beginPath(); ctx.arc(prev[0], prev[1], 3.5, 0, Math.PI * 2); ctx.fill(); }
    }
    // the places and their names
    const fs = w < 520 ? 14 : 13;
    ctx.font = `500 ${fs}px ${s.font}`;
    ctx.textBaseline = 'middle';
    // a name is set on a black edge, so an arc passing under it never cuts through the letters
    const say = (str, x, y) => { ctx.save(); ctx.strokeStyle = '#000'; ctx.lineWidth = 4; ctx.lineJoin = 'round'; ctx.strokeText(str, x, y); ctx.restore(); ctx.fillText(str, x, y); };
    const hit = [];
    for (const [id, pl] of Object.entries(PLACES)) {
      const q = P(pl.v); if (q[2] < -0.05) continue;
      const isQ = pl.q !== undefined;
      const on = id === 'pub' ? true : id === 'str' ? t >= 1 || t === 0 && p >= 1 : isQ ? t >= 2 && pl.q === k : t >= 2;
      const r = id === 'str' ? 6 : isQ ? 4 : 5;
      // the publish pulse and the stream's write ring
      if (!c && id === 'pub' && t === 0) { ctx.strokeStyle = `rgba(255,255,255,${(0.6 * (1 - p)).toFixed(2)})`; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(q[0], q[1], r + 18 * emph(p), 0, Math.PI * 2); ctx.stroke(); }
      if (!c && id === 'str' && t === 1) { ctx.strokeStyle = `rgba(255,255,255,${(0.6 * (1 - p)).toFixed(2)})`; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(q[0], q[1], r + 16 * emph(p), 0, Math.PI * 2); ctx.stroke(); }
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#fafafa'; ctx.fillStyle = on ? '#fafafa' : '#000';
      ctx.beginPath();
      if (id === 'str') ctx.rect(q[0] - r, q[1] - r, r * 2, r * 2); else ctx.arc(q[0], q[1], r, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      if (hov === id) { ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.beginPath(); ctx.arc(q[0], q[1], r + 7, 0, Math.PI * 2); ctx.stroke(); }
      hit.push([id, q[0], q[1]]);
      if (q[2] < 0.12) continue;
      // names sit to the side of the globe their place is on, so they never cover the planet's middle
      const right = q[0] >= cx;
      const txt = isQ ? (pl.q === k ? 'queue group' : '') : pl.name;
      if (!txt) continue;
      ctx.fillStyle = hov && hov !== id ? '#a3a3a3' : '#fafafa';
      if (id === 'str') { // the stream's name and its newest sequence sit above it, centred
        ctx.textAlign = 'center';
        say(txt + (label && label.str ? ' · ' + label.str : ''), q[0], q[1] - 18);
        continue;
      }
      // a name that would run off the canvas reads on the other side of its place instead
      // names read away from the planet's middle; with no room there (phones) a long second line is dropped first,
      // then the name goes under its place
      let sub = label && label[id];
      const room = (tw) => (right ? q[0] + 12 + tw <= w - 2 : q[0] - 12 - tw >= 2);
      const wOf = (a, b) => Math.max(ctx.measureText(a).width, b ? ctx.measureText(b).width : 0);
      if (sub && !room(wOf(txt, sub)) && room(wOf(txt))) sub = '';
      const tw = wOf(txt, sub);
      const fitsR = right && room(tw), fitsL = !right && room(tw);
      const dy = fs * 0.62;
      if (!fitsR && !fitsL) { // still no room: the name goes under its place, kept inside the canvas
        ctx.textAlign = 'center';
        const lx = Math.min(w - 2 - tw / 2, Math.max(2 + tw / 2, q[0]));
        say(txt, lx, q[1] + 16);
        if (sub) { ctx.fillStyle = '#a3a3a3'; say(sub, lx, q[1] + 16 + dy * 2 + 1); }
        continue;
      }
      const side = right ? fitsR : !fitsL;
      ctx.textAlign = side ? 'left' : 'right';
      const lx = q[0] + (side ? 12 : -12);
      say(txt, lx, q[1] - (sub ? dy : 0));
      if (sub) { ctx.fillStyle = '#a3a3a3'; say(sub, lx, q[1] + dy + 1); }
    }
    s.hit = hit;
  }

  // the hand: drag to spin (pointer capture; touch keeps vertical scroll), hover names a place
  const down = (e) => {
    const s = st.current;
    s.drag = { x: e.clientX, y: e.clientY, yaw: s.yaw, tilt: s.tilt, lx: e.clientX, lt: performance.now(), moved: false };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const move = (e) => {
    const s = st.current;
    if (s.drag) {
      const dx = e.clientX - s.drag.x, dy = e.clientY - s.drag.y;
      if (Math.abs(dx) > 3) s.drag.moved = true;
      s.yaw = s.drag.yaw + dx * 0.008;
      if (e.pointerType === 'mouse') s.tilt = Math.max(-0.2, Math.min(0.7, s.drag.tilt + dy * 0.004));
      const now = performance.now(), ddt = Math.max(1, now - s.drag.lt);
      s.vy = ((e.clientX - s.drag.lx) * 0.008) / (ddt / 1000);
      s.drag.lx = e.clientX; s.drag.lt = now;
      s.hand = now;
      if (!run || !seen || latest.current.calm) draw(now, 0);
      return;
    }
    if (e.pointerType !== 'mouse') return;
    const r = cv.current.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    let best = null, bd = 22;
    for (const [id, hx, hy] of s.hit || []) { const d = Math.hypot(hx - x, hy - y); if (d < bd) { bd = d; best = id; } }
    if (best !== s.hover) { s.hover = best; onHover?.(best); if (!run || !seen || latest.current.calm) draw(performance.now(), 0); }
  };
  const up = (e) => {
    const s = st.current;
    if (!s.drag) return;
    if (latest.current.calm) s.vy = 0;
    s.hand = performance.now(); s.drag = null;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  };
  const leave = () => { const s = st.current; if (s.hover) { s.hover = null; onHover?.(null); if (!run || !seen) draw(performance.now(), 0); } };

  return (
    <div className="ps-globe" ref={wrap}>
      <canvas ref={cv} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onPointerLeave={leave} aria-hidden="true" />
    </div>
  );
}
