'use client';
/* Careers' own card-to-page open (synchronized.studio), page-local so the shared doorway.js stays untouched.
   openSheet(): the whole white sheet grows to fill the screen in its own white (600ms in-out), carrying a copy of its
   title and numeral; the route is pushed at once, so the role page loads while the sheet grows (no grey hold).
   useSheetLanding() (on the role page): waits for the grow to end, then flies the carried title onto the real h1 and the
   numeral onto the real numeral (500ms ease-emphasis), lifts the cover (300ms), and hands over to the real heading.
   Idempotent: React's dev double effect and a cancelled animation never remove the cover early; a failsafe clears it.
   Reduced motion: a plain route change (a cut). Also lifts any shared doorway cover ([data-door]) the same safe way. */
import { useEffect } from 'react';
import { play } from '../../../lib/sound';

const OPEN = 'cubic-bezier(.76,0,.24,1)';
const EM = 'cubic-bezier(.16,1,.3,1)';
const KEEP = ['fontFamily', 'fontSize', 'fontWeight', 'letterSpacing', 'lineHeight', 'color'];

function ghost(src: Element, box: HTMLDivElement) {
  if (!src) return null;
  const r = src.getBoundingClientRect();
  const cs = getComputedStyle(src);
  const g = document.createElement('span');
  g.textContent = src.textContent;
  KEEP.forEach((k) => { g.style[k] = cs[k]; });
  Object.assign(g.style, { position: 'absolute', left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', margin: '0', transformOrigin: '0 0', whiteSpace: 'normal', textWrap: 'balance' });
  box.appendChild(g);
  return g;
}

// el: the sheet whose rectangle grows; it must hold .xcb-sheet-t and .xcb-sheet-no
export function openSheet(e, href, router, el) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !el) { router.push(href); return; }
  play('whoosh');
  const r = el.getBoundingClientRect();
  const rad = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 24;
  const d = document.createElement('div');
  d.setAttribute('data-xcdoor', '');
  const from = `inset(${r.top}px ${innerWidth - r.right}px ${innerHeight - r.bottom}px ${r.left}px round ${rad}px)`;
  Object.assign(d.style, { position: 'fixed', inset: '0', zIndex: '2000', background: 'light-dark(#fff, var(--x-fill))', pointerEvents: 'none', clipPath: from });
  ghost(el.querySelector('.xcb-sheet-t'), d)?.setAttribute('data-t', '');
  const n = ghost(el.querySelector('.xcb-sheet-no'), d);
  if (n) { n.setAttribute('data-n', ''); n.style.width = 'auto'; n.style.color = 'var(--ink)'; }
  document.body.appendChild(d);
  const a = d.animate([{ clipPath: from }, { clipPath: 'inset(0px 0px 0px 0px round 0px)' }], { duration: 600, easing: OPEN, fill: 'forwards' });
  d._grow = a.finished.catch(() => {});
  router.push(href);
  setTimeout(() => d.isConnected && d.remove(), 6000); // failsafe
}

function fly(g, to: Element | null, dur: number) {
  if (!g || !to) return null;
  const a = g.getBoundingClientRect(), b = to.getBoundingClientRect();
  const s = (parseFloat(getComputedStyle(to).fontSize) || 1) / (parseFloat(g.style.fontSize) || 1);
  return g.animate([{ transform: 'none' }, { transform: `translate(${b.left - a.left}px, ${b.top - a.top}px) scale(${s})` }], { duration: dur, easing: EM, fill: 'forwards' }).finished.catch(() => {});
}

async function land(d: Element) {
  await d._grow;
  const h1 = document.querySelector('main h1');
  const no = document.querySelector('.xcj-no');
  const hide = [h1, no].filter(Boolean);
  hide.forEach((x) => { x.style.visibility = 'hidden'; });
  await Promise.all([fly(d.querySelector('[data-t]'), h1, 500), fly(d.querySelector('[data-n]'), no, 500)]);
  hide.forEach((x) => { x.style.visibility = ''; });
  const out = d.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, easing: 'cubic-bezier(0,0,.2,1)', fill: 'forwards' });
  out.finished.then(() => d.remove(), () => d.remove());
}

export function useSheetLanding() {
  useEffect(() => {
    document.querySelectorAll('[data-xcdoor]').forEach((d) => {
      if (d.dataset.landing) return; // already landing (dev runs effects twice)
      d.dataset.landing = '1';
      land(d);
    });
    // a shared doorway cover from another page: lift it once, never twice, never early
    document.querySelectorAll('[data-door]').forEach((d) => {
      if (d.dataset.landing) return;
      d.dataset.landing = '1';
      d.getAnimations().forEach((a) => a.cancel());
      d.style.clipPath = 'inset(0px 0px 0px 0px)';
      const a = d.animate([{ clipPath: 'inset(0px 0px 0px 0px)' }, { clipPath: 'inset(0px 0px 100% 0px)' }], { duration: 500, delay: 60, easing: OPEN, fill: 'forwards' });
      a.finished.then(() => d.remove(), () => {});
      setTimeout(() => d.isConnected && d.remove(), 1500);
    });
  }, []);
}
