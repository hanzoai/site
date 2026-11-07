'use client';
/* /iam's own motion (page-local, docs/MOTION-MAP.md row `/iam`).
   - useEnter(): marks a section [data-in] once its top passes 75% of the screen, so its entrance (IamMotion.css, keyed by
     data-entrance) runs once. The attribute is written to the DOM, never React state, so the server HTML and the first
     client render are identical. Reduced motion and JS off never hide anything (the CSS only hides inside html.js and
     prefers-reduced-motion: no-preference).
   - <Decode>: the page's signature. Text resolves out of scrambled characters when it arrives, and again on hover or focus.
     The real characters are in the server HTML; the scramble only rewrites the same text node on the client and restores
     it; the element carries the real text as its accessible name while it runs. Reduced motion: no scramble. */
import { useCallback, useEffect, useImperativeHandle, useRef, forwardRef } from 'react';

const POOL = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&*+=/<>';
const calmNow = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

export function useEnter() {
  const seen = useRef(false);
  return useCallback((el) => {
    if (!el || seen.current || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver((es) => {
      if (es.some((e) => e.isIntersecting)) { seen.current = true; el.setAttribute('data-in', ''); io.disconnect(); }
    }, { rootMargin: '0px 0px -25% 0px', threshold: 0 });
    io.observe(el);
  }, []);
}

export const Decode = forwardRef(function Decode({ text, as: Tag = 'span', className = '', name = true, ms = 700, ...rest }, api) {
  const vis = useRef(null);
  const busy = useRef(false);
  const run = useCallback(() => {
    const el = vis.current, node = el && el.firstChild;
    if (!node || busy.current || calmNow()) return;
    busy.current = true;
    el.style.minWidth = el.getBoundingClientRect().width + 'px';
    const t0 = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - t0) / ms);
      const keep = Math.floor(p * text.length);
      let out = '';
      for (let i = 0; i < text.length; i++) {
        const c = text[i];
        out += i < keep || c === ' ' || c === '.' ? c : POOL[(Math.random() * POOL.length) | 0];
      }
      node.nodeValue = out;
      if (p < 1) requestAnimationFrame(step);
      else { node.nodeValue = text; el.style.minWidth = ''; busy.current = false; }
    };
    requestAnimationFrame(step);
  }, [text, ms]);
  useImperativeHandle(api, () => ({ run }), [run]);
  // it decodes once as it arrives
  useEffect(() => {
    const el = vis.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { io.disconnect(); run(); } }, { rootMargin: '0px 0px -15% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [run]);
  return (
    <Tag
      className={'ia-dc ' + className}
      aria-label={name ? text : undefined}
      onPointerEnter={(e) => { if (e.pointerType === 'mouse') run(); }}
      onFocus={run}
      {...rest}
    >
      <span ref={vis} className="ia-dc-t" aria-hidden={name ? 'true' : undefined}>{text}</span>
    </Tag>
  );
});
