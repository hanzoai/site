'use client';
/* A card that opens into its page: the card's rectangle fills the screen with ink, the next page arrives, and the ink wipes away.
   The cover lives on <body>, so it survives the route change; the destination calls useArrival() to lift it. */
import { useEffect } from 'react';

const OPEN = 'cubic-bezier(.76,0,.24,1)'; // the open transition's curve (docs/DESIGN.md)

export function openDoor(e, href, router, tone = '#0a0a0a') {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { router.push(href); return; }
  const r = e.currentTarget.getBoundingClientRect();
  const d = document.createElement('div');
  d.setAttribute('data-door', '');
  const from = `inset(${r.top}px ${innerWidth - r.right}px ${innerHeight - r.bottom}px ${r.left}px round 24px)`;
  Object.assign(d.style, { position: 'fixed', inset: '0', zIndex: '2000', background: tone, pointerEvents: 'none', clipPath: from });
  document.body.appendChild(d);
  const a = d.animate([{ clipPath: from }, { clipPath: 'inset(0px 0px 0px 0px round 0px)' }], { duration: 640, easing: OPEN, fill: 'forwards' });
  a.finished.then(() => { router.push(href); setTimeout(() => d.remove(), 8000); }, () => d.remove());
}

export function useArrival() {
  useEffect(() => {
    document.querySelectorAll('[data-door]').forEach((d) => {
      d.getAnimations().forEach((a) => a.cancel());
      d.style.clipPath = 'inset(0px 0px 0px 0px)';
      const a = d.animate([{ clipPath: 'inset(0px 0px 0px 0px)' }, { clipPath: 'inset(0px 0px 100% 0px)' }], { duration: 760, delay: 120, easing: OPEN, fill: 'forwards' });
      a.finished.then(() => d.remove(), () => d.remove());
    });
  }, []);
}
