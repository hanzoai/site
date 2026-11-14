'use client';
/* A card that opens into its page: the card's rectangle fills the screen with ink, the next page arrives, and the ink wipes away.
   The cover lives on <body>, so it survives the route change; the destination calls useArrival() to lift it. */
import { useEffect } from 'react';
import type { MouseEvent } from 'react';

const OPEN = 'cubic-bezier(.76,0,.24,1)'; // the open transition's curve (docs/DESIGN.md)

// `el` (optional): the element whose rectangle grows (default: the clicked element), e.g. a whole card around its link.
export function openDoor(e: MouseEvent<HTMLElement>, href: string, router: { push: (href: string) => void }, tone = '#0a0a0a', el?: Element | null) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { router.push(href); return; }
  const r = (el || e.currentTarget).getBoundingClientRect();
  const d = document.createElement('div');
  d.setAttribute('data-door', '');
  const from = `inset(${r.top}px ${innerWidth - r.right}px ${innerHeight - r.bottom}px ${r.left}px round 24px)`;
  Object.assign(d.style, { position: 'fixed', inset: '0', zIndex: '2000', background: tone, pointerEvents: 'none', clipPath: from });
  document.body.appendChild(d);
  const a = d.animate([{ clipPath: from }, { clipPath: 'inset(0px 0px 0px 0px round 0px)' }], { duration: 640, easing: OPEN, fill: 'forwards' });
  // cancelled by the destination's useArrival (which takes the cover over): keep it, the arrival wipe removes it
  a.finished.then(() => { router.push(href); setTimeout(() => d.remove(), 8000); }, () => { if (!d.dataset.landing) d.remove(); });
}

export function useArrival() {
  useEffect(() => {
    document.querySelectorAll<HTMLElement>('[data-door]').forEach((d) => {
      if (d.dataset.landing) return; // already landing (React runs effects twice in development)
      d.dataset.landing = '1';
      d.getAnimations().forEach((a) => a.cancel());
      d.style.clipPath = 'inset(0px 0px 0px 0px)';
      const a = d.animate([{ clipPath: 'inset(0px 0px 0px 0px)' }, { clipPath: 'inset(0px 0px 100% 0px)' }], { duration: 760, delay: 120, easing: OPEN, fill: 'forwards' });
      a.finished.then(() => d.remove(), () => d.remove());
    });
  }, []);
}
