'use client';
/* Contextual cursor (mounted once in app/layout.jsx; mouse and trackpad only, never touch; off for reduced motion).
   A small label rides beside the pointer and says what a click or drag will do; the system cursor always stays.
   It works out the word itself: Open on cards ([data-card], [data-morph], big in-site links), Drag on anything that
   scrolls sideways (rails, tracks), Play on a film with controls. How to use it on a page:
   - data-cursor="Compare" (any short word of yours) on an element to say something else;
   - data-cursor="" to say nothing there;
   - data-drag on a rail you move with your own code (one that does not scroll natively).
   Transform-only, one element, works only when the pointer moves onto a new element, sleeps when the pointer is still. */
import { useEffect, useRef, useState } from 'react';
import './Layer.css';

const BIG = (r) => r.width >= 160 && r.height >= 90;
const sideways = (e) => e.scrollWidth > e.clientWidth + 4 && /(auto|scroll)/.test(getComputedStyle(e).overflowX);
function word(el) {
  for (let e = el; e && e !== document.body; e = e.parentElement) {
    if (e.dataset?.cursor !== undefined) return e.dataset.cursor || null;
    if (e.matches?.('header, nav, form, button, input, textarea, select, [role=dialog]')) return null;
    if (e.matches?.('[data-card], [data-morph]')) return 'Open';
    if (e.tagName === 'A' && e.closest('main') && BIG(e.getBoundingClientRect())) return 'Open';
    if (e.tagName === 'VIDEO' && e.controls) return 'Play';
    if (e.matches?.('[data-drag], [data-swipe-own]') || (e.closest('main') && sideways(e))) return 'Drag';
  }
  return null;
}

export default function Cursor() {
  const el = useRef(null);
  const [w, setW] = useState(null);
  useEffect(() => {
    if (!matchMedia('(pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let x = 0, y = 0, cx = 0, cy = 0, raf = 0, last = null, at = null;
    const tick = () => {
      cx += (x - cx) * 0.22; cy += (y - cy) * 0.22;
      if (el.current) el.current.style.transform = `translate3d(${cx + 18}px, ${cy + 18}px, 0)`;
      raf = Math.abs(x - cx) + Math.abs(y - cy) > 0.3 ? requestAnimationFrame(tick) : 0;
    };
    const move = (e) => {
      x = e.clientX; y = e.clientY;
      if (e.target !== at) { // the word depends only on what is under the pointer
        at = e.target;
        const k = word(at);
        if (k !== last) { if (k && !last) { cx = x; cy = y; } last = k; setW(k); }
      }
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const out = (e) => { if (!e.relatedTarget) { last = null; at = null; setW(null); } };
    const nav = () => { at = null; last = null; setW(null); }; // a click may swap the page under a still pointer
    addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerout', out);
    addEventListener('click', nav, true);
    return () => { cancelAnimationFrame(raf); removeEventListener('pointermove', move); document.removeEventListener('pointerout', out); removeEventListener('click', nav, true); };
  }, []);
  return <div ref={el} className={'x-cur' + (w ? ' on' : '')} aria-hidden="true"><span>{w || ''}</span></div>;
}
