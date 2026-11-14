'use client';
/* Signature (particles): Zen 7's mark is the numeral itself. A dense field of small monochrome dots, sampled from the
   page's own 7 (the --sans face at 497), gathers out of a loose cloud into the 7 when it first comes on screen, then
   breathes. The pointer scatters the dots near it and they spring back; a press or a tap bursts them from that point.
   Keyboard: focus the 7, arrow keys move the scattering point, Enter or Space bursts it.
   One canvas, DPR max 1.5, paused off screen, in a background tab and by the page's Pause; reduced motion draws the
   formed 7 once and holds it. Colour is the canvas's CSS colour (Hanzo's ink), so no colour lives in this file. */
import { useEffect, useRef } from 'react';

const TAU = Math.PI * 2;

// the dots (parallel typed arrays, one slot per dot) and the field's measured box and flags
interface Field {
  n: number;
  x: Float32Array; y: Float32Array; vx: Float32Array; vy: Float32Array;
  hx: Float32Array; hy: Float32Array; ph: Float32Array; dl: Float32Array;
  W: number; H: number; cw: number; ch: number; cx: number; cy: number; r: number; R: number; dpr: number; ink: string;
  mx: number; my: number; kx: number; ky: number; born: number; last: number; raf: number;
  seen: boolean; vis: boolean; hidden: boolean; still: boolean; ready: boolean; gone: boolean;
}

export default function Particles7({ still }: { still: boolean }) {
  const wrap = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const api = useRef<{ setStill(v: boolean): void } | null>(null);

  useEffect(() => {
    const wrapEl = wrap.current, canvas = cv.current;
    const ctx2d = canvas && canvas.getContext('2d');
    if (!wrapEl || !canvas || !ctx2d) return;
    // function declarations below do not keep the null checks above, so the checked values are named again
    const el: HTMLDivElement = wrapEl, c: HTMLCanvasElement = canvas, ctx: CanvasRenderingContext2D = ctx2d;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const zone = el.closest('section') || el;
    const S: Field = {
      n: 0, x: new Float32Array(0), y: new Float32Array(0), vx: new Float32Array(0), vy: new Float32Array(0), hx: new Float32Array(0), hy: new Float32Array(0), ph: new Float32Array(0), dl: new Float32Array(0),
      W: 0, H: 0, cw: 0, ch: 0, cx: 0, cy: 0, r: 1.1, R: 96, dpr: 1, ink: '',
      mx: -1e5, my: -1e5, kx: 0, ky: 0, born: 0, last: 0, raf: 0,
      seen: false, vis: false, hidden: document.hidden, still: false, ready: false, gone: false,
    };

    function build() {
      const W = el.clientWidth, H = el.clientHeight;
      const cw = c.clientWidth, ch = c.clientHeight;
      if (!W || !H || !cw || !ch) return;
      if (S.ready && W === S.W && H === S.H && cw === S.cw && ch === S.ch) return;
      S.W = W; S.H = H;
      const P = (cw - W) / 2, Q = (ch - H) / 2;
      S.dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      c.width = Math.round(cw * S.dpr); c.height = Math.round(ch * S.dpr);
      S.cw = cw; S.ch = ch; S.cx = cw / 2; S.cy = ch / 2;
      const cs = getComputedStyle(c);
      S.ink = cs.color;
      const phone = W < 420;
      S.r = phone ? 0.95 : 1.15;
      S.R = phone ? 64 : 96;
      /* the glyph, laid out like the old SVG 7 (viewBox 600x700, slice, baseline 640, size 820) */
      const o = document.createElement('canvas');
      o.width = W; o.height = H;
      const g = o.getContext('2d');
      if (!g) return;
      const s = Math.max(W / 600, H / 700);
      g.font = `497 ${820 * s}px ${cs.fontFamily}`;
      g.textAlign = 'center'; g.textBaseline = 'alphabetic';
      g.fillText('7', W / 2, (H - 700 * s) / 2 + 640 * s);
      const img = g.getImageData(0, 0, W, H).data;
      const step = Math.max(3.3, Math.min(5.6, W / 112));
      const hx: number[] = [], hy: number[] = [];
      for (let yy = step / 2, row = 0; yy < H; yy += step * 0.866, row++) {
        for (let xx = (row % 2 ? step / 2 : 0) + step / 4; xx < W; xx += step) {
          if (img[((yy | 0) * W + (xx | 0)) * 4 + 3] > 140) { hx.push(xx + P); hy.push(yy + Q); }
        }
      }
      const n = hx.length, old = S.ready && S.born;
      S.n = n;
      S.hx = Float32Array.from(hx); S.hy = Float32Array.from(hy);
      S.x = new Float32Array(n); S.y = new Float32Array(n); S.vx = new Float32Array(n); S.vy = new Float32Array(n);
      S.ph = new Float32Array(n); S.dl = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        S.ph[i] = Math.random() * TAU;
        if (reduce || old) { S.x[i] = S.hx[i]; S.y[i] = S.hy[i]; continue; }
        /* a loose cloud over the whole field; each dot is called home after its own short delay */
        const a = Math.random() * TAU, d = Math.sqrt(Math.random());
        S.x[i] = S.cx + Math.cos(a) * d * cw * 0.62;
        S.y[i] = S.cy + Math.sin(a) * d * ch * 0.6;
        S.dl[i] = 120 + Math.random() * 820 + (S.hy[i] / ch) * 260;
      }
      S.ready = true;
      S.kx = S.cx; S.ky = S.cy;
    }

    function draw(alpha: number) {
      ctx.setTransform(S.dpr, 0, 0, S.dpr, 0, 0);
      ctx.clearRect(0, 0, S.cw, S.ch);
      const a = new Path2D(), b = new Path2D(), r = S.r;
      for (let i = 0; i < S.n; i++) {
        const p = i % 6 === 0 ? b : a;
        p.moveTo(S.x[i] + r, S.y[i]);
        p.arc(S.x[i], S.y[i], r, 0, TAU);
      }
      ctx.fillStyle = S.ink;
      ctx.globalAlpha = alpha; ctx.fill(a);
      ctx.globalAlpha = alpha * 0.42; ctx.fill(b);
      ctx.globalAlpha = 1;
    }

    function frame(now: number) {
      S.raf = 0;
      const dt = Math.min(2, Math.max(0.25, (now - S.last) / 16.667 || 1));
      S.last = now;
      const t = now - S.born, ts = now / 1000;
      const breath = 1 + 0.013 * Math.sin(ts * 1.15);
      const K = 0.05, damp = Math.pow(0.87, dt), R = S.R, R2 = R * R, F = 3.1;
      const { x, y, vx, vy, hx, hy, ph, dl, cx, cy, mx, my } = S;
      for (let i = 0; i < S.n; i++) {
        let ax, ay;
        if (t > dl[i]) {
          const tx = cx + (hx[i] - cx) * breath + Math.sin(ts * 1.6 + ph[i]) * 0.6;
          const ty = cy + (hy[i] - cy) * breath + Math.cos(ts * 1.3 + ph[i]) * 0.6;
          ax = (tx - x[i]) * K; ay = (ty - y[i]) * K;
        } else {
          ax = Math.sin(ts * 0.9 + ph[i]) * 0.03; ay = Math.cos(ts * 0.7 + ph[i]) * 0.03;
        }
        const dx = x[i] - mx, dy = y[i] - my, d2 = dx * dx + dy * dy;
        if (d2 < R2 && d2 > 0.01) {
          const d = Math.sqrt(d2), f = (1 - d / R) * F;
          ax += (dx / d) * f; ay += (dy / d) * f;
        }
        vx[i] = (vx[i] + ax * dt) * damp; vy[i] = (vy[i] + ay * dt) * damp;
        x[i] += vx[i] * dt; y[i] += vy[i] * dt;
      }
      draw(Math.min(1, t / 520));
      loop();
    }

    function loop() {
      const on = S.ready && S.vis && !S.hidden && !S.still && !reduce && !S.gone;
      if (on && !S.raf) { S.last = performance.now(); S.raf = requestAnimationFrame(frame); }
      if (!on && S.raf) { cancelAnimationFrame(S.raf); S.raf = 0; }
    }

    function still() { if (S.ready) draw(1); }

    function burst(px: number, py: number, power = 1) {
      if (reduce || S.still) return;
      const RB = S.R * 2.1, RB2 = RB * RB;
      for (let i = 0; i < S.n; i++) {
        const dx = S.x[i] - px, dy = S.y[i] - py, d2 = dx * dx + dy * dy;
        if (d2 > RB2) continue;
        const d = Math.sqrt(d2) || 1, f = (1 - d / RB) * 15 * power * (0.7 + Math.random() * 0.6);
        S.vx[i] += (dx / d) * f; S.vy[i] += (dy / d) * f;
      }
    }

    const local = (e: PointerEvent): [number, number] => {
      const q = c.getBoundingClientRect();
      return [(e.clientX - q.left) * (S.cw / q.width), (e.clientY - q.top) * (S.ch / q.height)];
    };
    let lift: ReturnType<typeof setTimeout> | undefined;
    const onMove = (e: PointerEvent) => { if (reduce) return; [S.mx, S.my] = local(e); };
    const off = () => { S.mx = -1e5; S.my = -1e5; };
    const onDown = (e: PointerEvent) => {
      if (reduce) return;
      const [px, py] = local(e);
      if (px < -40 || py < -40 || px > S.cw + 40 || py > S.ch + 40) return;
      burst(px, py, e.pointerType === 'touch' ? 1.15 : 0.9);
      if (e.pointerType === 'touch') { S.mx = px; S.my = py; clearTimeout(lift); lift = setTimeout(off, 360); }
    };
    const onUp = (e: PointerEvent) => { if (e.pointerType !== 'mouse') { clearTimeout(lift); lift = setTimeout(off, 260); } };
    const onKey = (e: KeyboardEvent) => {
      if (reduce) return;
      const k = e.key, st = 22;
      if (k === 'ArrowLeft' || k === 'ArrowRight' || k === 'ArrowUp' || k === 'ArrowDown') {
        e.preventDefault();
        S.kx = Math.max(0, Math.min(S.cw, S.kx + (k === 'ArrowLeft' ? -st : k === 'ArrowRight' ? st : 0)));
        S.ky = Math.max(0, Math.min(S.ch, S.ky + (k === 'ArrowUp' ? -st : k === 'ArrowDown' ? st : 0)));
        S.mx = S.kx; S.my = S.ky;
      } else if (k === 'Enter' || k === ' ') {
        e.preventDefault();
        burst(S.kx, S.ky, 1.1);
      }
    };
    const onFocus = () => { if (!reduce && el.matches(':focus-visible')) { S.mx = S.kx; S.my = S.ky; } };
    const onVis = () => { S.hidden = document.hidden; loop(); };

    zone.addEventListener('pointermove', onMove, { passive: true });
    zone.addEventListener('pointerleave', off);
    zone.addEventListener('pointerdown', onDown, { passive: true });
    zone.addEventListener('pointerup', onUp, { passive: true });
    zone.addEventListener('pointercancel', onUp, { passive: true });
    el.addEventListener('keydown', onKey);
    el.addEventListener('focus', onFocus);
    el.addEventListener('blur', off);
    document.addEventListener('visibilitychange', onVis);

    const io = new IntersectionObserver(([e]) => {
      S.vis = e.isIntersecting;
      if (S.vis && !S.seen && S.ready) { S.seen = true; S.born = performance.now(); }
      loop();
    }, { threshold: 0.05 });
    const ro = new ResizeObserver(() => { build(); if (reduce || S.still) still(); loop(); });

    let alive = true;
    const start = () => {
      if (!alive) return;
      build();
      if (reduce) still();
      io.observe(c); ro.observe(el);
    };
    (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(start, start);

    api.current = { setStill(v: boolean) { S.still = v; if (v) still(); loop(); } };
    return () => {
      alive = false; S.gone = true; loop(); clearTimeout(lift);
      io.disconnect(); ro.disconnect();
      zone.removeEventListener('pointermove', onMove);
      zone.removeEventListener('pointerleave', off);
      zone.removeEventListener('pointerdown', onDown);
      zone.removeEventListener('pointerup', onUp);
      zone.removeEventListener('pointercancel', onUp);
      el.removeEventListener('keydown', onKey);
      el.removeEventListener('focus', onFocus);
      el.removeEventListener('blur', off);
      document.removeEventListener('visibilitychange', onVis);
      api.current = null;
    };
  }, []);

  useEffect(() => { api.current?.setStill(still); }, [still]);

  return (
    <div ref={wrap} className="z7-art" role="button" tabIndex={0} aria-label="Zen 7">
      <canvas ref={cv} className="z7-field" aria-hidden="true" />
      {/* JS off: the formed 7 as type (ZenSeven.css shows it only from the hero's noscript rule) */}
      <svg className="z7-fall" viewBox="0 0 600 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><text x="300" y="640" textAnchor="middle">7</text></svg>
    </div>
  );
}
