'use client';
/* The Kai guide's five section entrances (docs/MOTION-MAP.md, "Section entrances, in order"): ripple, drop-in,
   tilt-3d-hover, line-draw, cover-slide. Each plays once when its section arrives and is styled by its own rules in
   KaiGuide.css ([data-enter='<name>']). A section is only ever held in its "before" state once [data-arm] is set, and
   that is set only with JS on and motion allowed, so with JS off or under reduced motion every section is simply there.
   Everything moves by transform, opacity, clip-path or a stroke offset: no box changes size, nothing shifts. */
import { useEffect, useLayoutEffect } from 'react';

const calm = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

// arm the section before paint, then mark it in once enough of it is on screen
function useArrive(ref, name, amount, margin) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.dataset.enter = name;
    if (calm()) return;
    el.dataset.arm = '';
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const el = ref.current;
    if (!el || !('arm' in el.dataset)) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.dataset.in = ''; io.disconnect(); } }, { threshold: amount, rootMargin: margin });
    io.observe(el);
    return () => io.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}

// 1. ripple: a ring spreads from the centre of the section and the content opens behind it
export function useRipple(ref) { useArrive(ref, 'ripple', 0.25, '0px'); }

// 2. drop-in: the section falls in from above and settles with a small bounce
export function useDropIn(ref) { useArrive(ref, 'drop-in', 0.2, '0px'); }

// 3. tilt-3d-hover: the tile arrives tipped back in 3D and levels; afterwards it leans toward a fine pointer, to 2.5°
export function useTiltIn(ref, tile) {
  useArrive(ref, 'tilt-3d-hover', 0.25, '0px');
  useEffect(() => {
    const el = tile.current;
    if (!el || calm() || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty('--ry', (x * 5).toFixed(2) + 'deg');
      el.style.setProperty('--rx', (-y * 5).toFixed(2) + 'deg');
    };
    const leave = () => { el.style.setProperty('--ry', '0deg'); el.style.setProperty('--rx', '0deg'); };
    el.addEventListener('pointermove', move); el.addEventListener('pointerleave', leave);
    return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}

// 4. line-draw: the black room's outline draws itself, then the room fills
export function useLineDraw(ref) { useArrive(ref, 'line-draw', 0.2, '0px'); }

// 5. cover-slide: the section slides up over the one before it
export function useCoverSlide(ref) { useArrive(ref, 'cover-slide', 0, '0px 0px -10% 0px'); }

// the outline the line-draw entrance strokes (a figure only: aria-hidden)
export function Outline() {
  return (
    <svg className="kg-outline" aria-hidden="true" focusable="false">
      <rect pathLength="1" />
    </svg>
  );
}
