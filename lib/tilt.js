/* The lean and the gloss of a card, the app's own (hanzo-inc/app components/home/chrome.tsx `useLean`, `[data-tilt]`):
   under a mouse a card leans toward the pointer and a light follows it; on a touch screen the phone's tilt does the
   same, subtler; at rest and under reduced motion, nothing moves. One listener for the page serves every `[data-tilt]`
   card, wherever it is, the home page's and the captured pages' alike.

   It writes custom properties and nothing else: --ry/--rx (the lean, degrees), --lx/--ly (the light's place on the card,
   px), --lit (its strength). The CSS (hanzo.css for the lean; `[data-tilt]` in app/globals.css for the light, which is a
   fixed layer moved by transform) turns them into a transform and an opacity, so the page paints nothing while a card
   follows the pointer. `data-lit` marks the card being painted, for `will-change`. Call lean() once; it returns the way off. */
import { onDomChange } from './domwatch';

const CARD = '[data-tilt]';
const clamp = (v) => Math.max(-1, Math.min(1, v));
const calm = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Where a light falls on a leaning card, as fractions of its face: 0 to 1 across and down. */
function paint(el, x, y, w, h, lit) {
  const s = el.style;
  const nx = (x - 0.5) * 2;
  const ny = (y - 0.5) * 2;
  s.setProperty('--nx', nx.toFixed(3));
  s.setProperty('--ny', ny.toFixed(3));
  s.setProperty('--ry', (nx * 3).toFixed(2) + 'deg');
  s.setProperty('--rx', (-ny * 3).toFixed(2) + 'deg');
  s.setProperty('--lx', (x * w).toFixed(1) + 'px');
  s.setProperty('--ly', (y * h).toFixed(1) + 'px');
  s.setProperty('--lit', lit);
  el.setAttribute('data-lit', '');
}
function rest(el) {
  for (const k of ['--nx', '--ny', '--rx', '--ry', '--lit']) el.style.removeProperty(k);
  el.removeAttribute('data-lit');
}

/* a mouse */
function mouse() {
  let on = null, x = 0, y = 0, raf = 0;
  let wantTilt = 0.5, atTilt = 0.5, tiltRaf = 0;
  const stepBlade = () => {
    atTilt += (wantTilt - atTilt) * 0.42;
    document.querySelectorAll('[data-slot="beta"]').forEach((el) => el.style.setProperty('--tilt', atTilt.toFixed(4)));
    tiltRaf = Math.abs(wantTilt - atTilt) > 0.0005 ? requestAnimationFrame(stepBlade) : 0;
  };
  const frame = () => {
    raf = 0;
    if (!on) return;
    const r = on.getBoundingClientRect();
    paint(on, (x - r.left) / r.width, (y - r.top) / r.height, r.width, r.height, '1');
  };
  const move = (e) => {
    if (e.pointerType !== 'mouse' || calm()) return;
    wantTilt = e.clientX / Math.max(1, innerWidth);
    if (!tiltRaf) tiltRaf = requestAnimationFrame(stepBlade);
    const el = e.target.closest?.(CARD) ?? null;
    if (el !== on) { if (on) rest(on); on = el; }
    if (!on) return;
    x = e.clientX; y = e.clientY;
    if (!raf) raf = requestAnimationFrame(frame);
  };
  const out = () => { if (on) rest(on); on = null; };
  document.addEventListener('pointermove', move, { passive: true });
  document.documentElement.addEventListener('mouseleave', out);
  return () => {
    document.removeEventListener('pointermove', move);
    document.documentElement.removeEventListener('mouseleave', out);
    cancelAnimationFrame(raf);
    cancelAnimationFrame(tiltRaf);
    out();
  };
}

/* a phone's tilt: left and right is `gamma`; toward and away is `beta` about the 45 degrees a phone is usually held at;
   30 degrees either way is the edge. Every card on screen is painted from the one reading, so the light moves across
   them all at once as across one pane of glass. */
function phone() {
  const seen = new Set();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) seen.add(e.target);
    else { seen.delete(e.target); rest(e.target); }
  }));
  const watched = new WeakSet();
  const scan = () => document.querySelectorAll(CARD).forEach((el) => { if (!watched.has(el)) { watched.add(el); io.observe(el); } });
  scan();
  const off = onDomChange(scan);
  let x = 0.5, y = 0.5, raf = 0;
  const frame = () => {
    raf = 0;
    for (const el of seen) paint(el, x, y, el.offsetWidth, el.offsetHeight, '0.6');
  };
  const orient = (e) => {
    if (e.beta == null || e.gamma == null || calm()) return;
    x = 0.5 + clamp(e.gamma / 30) / 2;
    y = 0.5 + clamp((e.beta - 45) / 30) / 2;
    if (!raf) raf = requestAnimationFrame(frame);
  };
  // where a browser asks before it shares the tilt (iOS, and Chromium too) it asks inside a tap; the listener is there
  // from the start and hears nothing until the answer is yes
  const ask = (e) => {
    const R = globalThis.DeviceOrientationEvent?.requestPermission;
    if (typeof R !== 'function' || !e.target.closest?.(CARD)) return;
    document.removeEventListener('click', ask, true);
    R.call(globalThis.DeviceOrientationEvent).catch(() => {});
  };
  addEventListener('deviceorientation', orient);
  document.addEventListener('click', ask, true);
  return () => {
    removeEventListener('deviceorientation', orient);
    document.removeEventListener('click', ask, true);
    cancelAnimationFrame(raf);
    off();
    io.disconnect();
    seen.forEach(rest);
  };
}

export function lean() {
  return matchMedia('(pointer: coarse)').matches ? phone() : mouse();
}
