'use client';
/* Hanzo's hero halftone, ported from live hanzo.ai's own `Dither` (its deployed bundle, 8 Nov): a 7px grid of dots whose size
   follows a soft field of three blobs (bright at the top right, the bottom right and the bottom left), drawn in the page's
   foreground at 34%, faded at the edges (top 12%, bottom 18%, sides 6%) and drifting 2.5% / 1.5% over 26 s while in view.
   Live draws it behind the hero of its product pages. Ours shows it in dark only (html:not(.light)): bright mode stays as it
   was. Usage: <HeroDither /> as the first child of a hero with position: relative (it fills the hero, under its content).
   Slice C2's pages only; Hanzo's own wording and media are untouched (aria-hidden, no text). */
import { useEffect, useRef } from 'react';
import './HeroDither.css';

const blobs = (b) => (x, y) => Math.min(1, b.reduce((s, [i, n, a]) => s + Math.exp(-((x - i) ** 2 + (y - n) ** 2) / (a * a)), 0)) ** 1.4;
const FIELD = blobs([[0.98, 0.18, 0.36], [0.78, 0.96, 0.36], [0.04, 0.96, 0.28]]);
const CELL = 7;
const fade = (a, b, dir) => `linear-gradient(to ${dir}, transparent, #fff ${(100 * a).toFixed(1)}%, #fff ${((1 - b) * 100).toFixed(1)}%, transparent)`;
const MASK = [fade(0.12, 0.18, 'bottom'), fade(0.06, 0.06, 'right')].join(', ');

export default function HeroDither({ className = '' }) {
  const drift = useRef(null), cv = useRef(null);
  useEffect(() => {
    const c = cv.current, box = drift.current;
    if (!c || !box) return;
    const ctx = c.getContext('2d');
    const draw = () => {
      const dpr = Math.min(2, devicePixelRatio || 1), w = c.clientWidth, h = c.clientHeight;
      if (w < 1 || h < 1 || getComputedStyle(box).display === 'none') return;
      if (c.width !== Math.round(w * dpr)) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); }
      const cols = Math.max(1, Math.floor(w / CELL)), rows = Math.max(1, Math.floor(h / CELL)), half = CELL / 2;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = getComputedStyle(c).color;
      for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
        const n = FIELD(i / cols, j / rows);
        if (n <= 0.02) continue;
        ctx.beginPath(); ctx.arc(i * CELL + half, j * CELL + half, Math.min(half, half * Math.min(1, n)), 0, 2 * Math.PI); ctx.fill();
      }
    };
    draw();
    const ro = new ResizeObserver(draw); ro.observe(c);
    // the theme can change while the page is open: draw when it turns dark, in the new foreground
    const mo = new MutationObserver(draw); mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    let anim = null, io = null;
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches && typeof box.animate === 'function') {
      anim = box.animate([{ transform: 'translate3d(0, 0, 0)' }, { transform: 'translate3d(-2.5%, 1.5%, 0)' }], { duration: 26000, direction: 'alternate', iterations: Infinity, easing: 'ease-in-out' });
      anim.pause();
      io = new IntersectionObserver(([e]) => (e && e.isIntersecting ? anim.play() : anim.pause()));
      io.observe(box);
    }
    return () => { ro.disconnect(); mo.disconnect(); if (io) io.disconnect(); if (anim) anim.cancel(); };
  }, []);
  return (
    <div className={'hz-dither ' + className} aria-hidden="true">
      <div ref={drift} className="hz-dither-d">
        <canvas ref={cv} data-slot="dots" style={{ WebkitMaskImage: MASK, maskImage: MASK, WebkitMaskComposite: 'source-in', maskComposite: 'intersect' }} />
      </div>
    </div>
  );
}
