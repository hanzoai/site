'use client';
/* The solution page's own entrances (page-local; the /solutions index has its own in soIndexEnter.js).
   Each plays once, when its section reaches the screen (IntersectionObserver). The hidden start state is CSS gated
   behind html.js and [data-ent="wait"], so with scripts off everything is simply there; reduced motion skips straight
   to the final state. Transform, opacity and clip-path only. Deck curves: emphasis for arrivals, in-out for moves. */
import { useEffect } from 'react';

const EMPH = 'cubic-bezier(.16, 1, .3, 1)';
const INOUT = 'cubic-bezier(.4, 0, .2, 1)';
const calm = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const settle = (el, anims) => Promise.all(anims.filter(Boolean).map((a) => a.finished)).then(() => { el.dataset.ent = 'done'; }, () => { el.dataset.ent = 'done'; });

/* play(el) once when el is `amount` on screen; play returns the Animations it started */
export function useEnter(ref, play, amount = 0.25) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (calm()) { el.dataset.ent = 'done'; return; }
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      el.dataset.ent = 'go';
      settle(el, play(el) || []);
    }, { threshold: amount });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, play, amount]);
}

/* 1. cursor-lens: a round lens glides across the hero film and magnifies what is under it (the playing film, drawn
   live), following the pointer when one is over the film, then closes. */
export function lens(el) {
  const cv = el.querySelector('.xs2-lens');
  if (!cv) return [];
  const box = el.getBoundingClientRect();
  const W = box.width, H = box.height, dpr = Math.min(2, devicePixelRatio || 1);
  cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
  const g = cv.getContext('2d');
  const R = Math.max(70, Math.min(140, W * 0.11)), M = 1.8, D = 2000;
  let px = null, py = null, x = W * 0.18, y = H * 0.5;
  const move = (e) => { if (e.pointerType !== 'mouse') return; const b = el.getBoundingClientRect(); px = e.clientX - b.left; py = e.clientY - b.top; };
  const leave = () => { px = null; };
  el.addEventListener('pointermove', move);
  el.addEventListener('pointerleave', leave);
  const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  return [new Promise((done) => {
    const t0 = performance.now();
    const frame = (now) => {
      const t = Math.min(1, (now - t0) / D), e = ease(t);
      const tx = px ?? W * (0.18 + 0.64 * e), ty = py ?? H * (0.5 + 0.14 * Math.sin(e * Math.PI * 2));
      x += (tx - x) * 0.2; y += (ty - y) * 0.2;
      const r = R * Math.min(1, (now - t0) / 300, (D - (now - t0)) / 300);
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, W, H);
      const v = el.querySelector('video.on') || el.querySelector('video');
      const src = v && v.readyState >= 2 && v.videoWidth ? v : el.querySelector('img');
      const sw = src && (src.videoWidth || src.naturalWidth), sh = src && (src.videoHeight || src.naturalHeight);
      if (r > 0 && sw && sh) {
        const s = Math.max(W / sw, H / sh), dw = sw * s, dh = sh * s;
        g.save();
        g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.clip();
        g.translate(x, y); g.scale(M, M); g.translate(-x, -y);
        g.drawImage(src, (W - dw) / 2, (H - dh) / 2, dw, dh);
        g.restore();
        g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2);
        g.lineWidth = 1; g.strokeStyle = 'rgba(255, 255, 255, .6)'; g.stroke();
      }
      if (t < 1) requestAnimationFrame(frame);
      else { g.clearRect(0, 0, W, H); el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); done(); }
    };
    requestAnimationFrame(frame);
  })].map((p) => ({ finished: p }));
}

/* 2. page-curl: a sheet of paper over the job curls away from the bottom-right corner (its fold drawn as the mirror of
   what has lifted), showing the job under it */
const P = (pts) => 'polygon(' + pts.map(([a, b]) => `${(a * 100).toFixed(2)}% ${(b * 100).toFixed(2)}%`).join(', ') + ')';
function curlAt(c) {
  const m = Math.min(1, c), k = Math.max(0, c - 1);
  return {
    sheet: P([[0, 0], [m, 0], [m, k], [k, m], [0, m]]),
    flap: P([[m, k], [m, c - 1], [c - 1, c - 1], [c - 1, m], [k, m]]),
  };
}
export function curl(el) {
  const sheet = el.querySelector('.xs2-curl-s'), flap = el.querySelector('.xs2-curl-f');
  if (!sheet || !flap) return [];
  const N = 16, a = [], b = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N, e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; // in-out, sampled
    const s = curlAt(2.02 * (1 - e));
    a.push({ clipPath: s.sheet }); b.push({ clipPath: s.flap });
  }
  const o = { duration: 900, easing: 'linear', fill: 'backwards' };
  return [sheet.animate(a, o), flap.animate(b, o)];
}

/* 3. sticky-stack: the cards (or rows) drop one by one onto a stack at the top of the block, then the stack spreads
   them to their places */
export function stack(el) {
  const items = [...el.querySelectorAll('[data-stack]')];
  if (!items.length) return [];
  const rs = items.map((x) => x.getBoundingClientRect());
  const n = items.length, D = n * 60 + 300 + 500;
  return items.map((it, i) => {
    const dx = rs[0].left - rs[i].left + i * 4, dy = rs[0].top - rs[i].top + i * 4;
    const pile = `translate(${dx}px, ${dy}px)`, a = (i * 60) / D, b = (i * 60 + 300) / D, c = (n * 60 + 300) / D;
    return it.animate([
      { offset: 0, transform: `translate(${dx}px, ${dy - 48}px)`, opacity: 0 },
      { offset: a, transform: `translate(${dx}px, ${dy - 48}px)`, opacity: 0, easing: EMPH },
      { offset: b, transform: pile, opacity: 1 },
      { offset: c, transform: pile, opacity: 1, easing: INOUT },
      { offset: 1, transform: 'none', opacity: 1 },
    ], { duration: D, fill: 'backwards' });
  });
}

/* 4. venetian-type: each line of type slides in from alternating sides */
export function venetian(el) {
  return [...el.querySelectorAll('[data-vt]')].map((l, i) => l.animate(
    [{ transform: `translateX(${i % 2 ? 64 : -64}px)`, opacity: 0 }, { transform: 'none', opacity: 1 }],
    { duration: 500, delay: i * 60, easing: EMPH, fill: 'backwards' },
  ));
}

/* 5. ripple: a ring spreads from the centre of the dark room and leaves the room behind it */
export function ripple(el) {
  const rings = [...el.querySelectorAll('.xs2-ring')];
  const o = { duration: 900, easing: INOUT, fill: 'backwards' };
  return [
    el.animate([{ clipPath: 'circle(0% at 50% 50%)' }, { clipPath: 'circle(75% at 50% 50%)' }], o),
    ...rings.map((r, i) => r.animate([{ transform: 'translate(-50%, -50%) scale(.02)', opacity: 0.8 }, { transform: 'translate(-50%, -50%) scale(1)', opacity: 0 }], { ...o, duration: 1100, delay: i * 140 })),
  ];
}
