'use client';
/* openTile: the /solutions index's card-to-page open. The tile's rectangle fills the screen, the solution page arrives,
   and the cover lifts itself once the route has changed (the solution pages, another chat's files, do not call
   doorway.js's useArrival). Used instead of Morph, which times out site-wide today. Reduced motion: a plain cut.
   Usage: <A to={href} data-no-morph onClick={(e) => openTile(e, href, router)}> */
import type { MouseEvent } from 'react';

const CURVE = 'cubic-bezier(.4, 0, .2, 1)'; // deck ease-in-out: things that move and stay
const text = (n: Element) => (n.textContent ?? '').trim();

/* the part of the Next router a tile needs */
export interface TileRouter { push(href: string): void; prefetch(href: string): void }

export function prefetchTile(href: string, router: TileRouter) { try { router.prefetch(href); } catch { /* prefetch is a hint */ } }

export function openTile(e: MouseEvent<HTMLElement>, href: string, router: TileRouter, tone = '#000') {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { router.push(href); return; }
  const tile = e.currentTarget;
  const r = tile.getBoundingClientRect();
  // the cover is the card itself: its film still and its name grow to fill the screen (never a flat black)
  const pic = tile.querySelector('img');
  // the page opens on the picture you clicked: the destination's hero takes the tile's film (Solution.jsx reads it)
  const slug = pic && /\/([a-z0-9-]+)\.webp/.exec(pic.currentSrc || pic.src || '');
  try { if (slug) sessionStorage.setItem('hz-tile-film', JSON.stringify({ href: href.replace(/\/$/, ''), film: slug[1] })); } catch { /* storage is a nicety */ }
  const name = tile.querySelector<HTMLElement>('.xso-tile-n, [data-open-name]');
  const d = document.createElement('div');
  d.setAttribute('aria-hidden', 'true');
  const from = `inset(${r.top}px ${innerWidth - r.right}px ${innerHeight - r.bottom}px ${r.left}px round 24px)`;
  // under the header (z 40), so the site's header never disappears behind a slab while the page loads
  Object.assign(d.style, { position: 'fixed', inset: '0', zIndex: '35', background: tone, pointerEvents: 'none', clipPath: from, overflow: 'hidden' });
  const top = document.querySelector('header')?.getBoundingClientRect().bottom || 0;
  if (pic) {
    const img = document.createElement('img');
    img.src = pic.currentSrc || pic.src; img.alt = '';
    Object.assign(img.style, { position: 'absolute', inset: '0', width: '100%', height: '100%', objectFit: 'cover', objectPosition: getComputedStyle(pic).objectPosition });
    d.appendChild(img);
  }
  let words: HTMLParagraphElement | null = null, lay: HTMLDivElement | null = null;
  if (name) {
    // the name is set as the destination's headline (52px, 40 on phones, the h1 column's width, so the same line
    // breaks) at the h1's place, and starts shrunk onto the card's name (FLIP): it lands exactly where the h1 will be
    const cs = getComputedStyle(name), nr = name.getBoundingClientRect();
    const phone = innerWidth < 900, fs = phone ? 40 : 52;
    const left = phone ? 16 : Math.max(16, (innerWidth - 1152) / 2), y = phone ? 76 : 219;
    const w = phone ? innerWidth - 32 : Math.min(1152, innerWidth - 32) * 8 / 13 - 16;
    words = document.createElement('p');
    words.textContent = name.textContent;
    Object.assign(words.style, { position: 'absolute', left: left + 'px', top: y + 'px', width: w + 'px', maxWidth: '13ch', margin: '0', fontFamily: cs.fontFamily, fontSize: fs + 'px', fontWeight: '497', lineHeight: '1.04', letterSpacing: '-0.03em', color: '#fafafa', transformOrigin: '0 0', textWrap: 'balance' });
    // the name rides on its own layer above the growing cover, so the cover's clip never cuts it mid-flight
    lay = document.createElement('div'); lay.setAttribute('aria-hidden', 'true');
    Object.assign(lay.style, { position: 'fixed', inset: '0', zIndex: '36', pointerEvents: 'none' });
    lay.appendChild(words); document.body.appendChild(lay);
    const k = parseFloat(cs.fontSize) / fs;
    words.animate([{ transform: `translate(${nr.left - left}px, ${nr.top - y}px) scale(${k})` }, { transform: 'none' }], { duration: 420, easing: CURVE, fill: 'forwards' });
    // the destination's h1 skips its own cut-in while the name hands over to it
    document.documentElement.setAttribute('data-tile-open', '');
  }
  document.body.appendChild(d);
  const was = location.pathname;
  router.push(href); // the route loads while the card grows
  let lifted = false;
  const lift = () => {
    if (lifted) return;
    lifted = true;
    // the new page starts at its top (the router's own scroll can land a frame late), then the cover is measured
    if (scrollY) scrollTo({ top: 0, behavior: 'instant' });
    // the cover settles onto the destination's own film (the widest picture in its first screen), then crossfades away
    const film = [...document.querySelectorAll('main .xs2-film, main img, main video')].map((x) => x.getBoundingClientRect()).find((b) => b.width > innerWidth * 0.5 && b.top < innerHeight && b.bottom > 0);
    // the travelling name hands over to the real h1 (which now sits exactly under it), then the cover settles
    // the travelling name hands over to the real h1, re-placed on its measured box so it sits exactly on it
    const h1 = document.querySelector('main .xs2-h1') || document.querySelector('main h1');
    if (words && h1) { const hr = h1.getBoundingClientRect(), wr = words.getBoundingClientRect(); words.animate([{ transform: getComputedStyle(words).transform }, { transform: `translate(${hr.left - wr.left}px, ${hr.top - wr.top}px)` }], { duration: 140, easing: CURVE, fill: 'forwards' }); }
    // a name that is not the h1's own words (an index tile's short name) steps aside at once, never over the h1
    const same = words && h1 && text(words) === text(h1).slice(0, text(words).length);
    if (words) words.animate([{ opacity: 1 }, { opacity: 0 }], { duration: same ? 160 : 120, delay: same ? 120 : 0, fill: 'forwards' });
    // the h1 itself remembers it has landed (so its cut-in never replays), then the page-wide hold is lifted
    if (h1) h1.setAttribute('data-landed', '');
    document.documentElement.removeAttribute('data-tile-open');
    const to = film ? `inset(${Math.max(top, film.top)}px ${Math.max(0, innerWidth - film.right)}px ${Math.max(0, innerHeight - film.bottom)}px ${Math.max(0, film.left)}px)` : `inset(${top}px 0px 0px 0px)`;
    d.animate([{ clipPath: `inset(${top}px 0px 0px 0px)` }, { clipPath: to }], { duration: 360, easing: CURVE, fill: 'forwards' }).finished
      .then(() => d.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, easing: CURVE, fill: 'forwards' }).finished)
      .then(() => { d.remove(); lay?.remove(); }, () => { d.remove(); lay?.remove(); });
  };
  d.animate([{ clipPath: from }, { clipPath: `inset(${top}px 0px 0px 0px round 0px)` }], { duration: 420, easing: CURVE, fill: 'forwards' }).finished.then(() => {
    const t0 = performance.now();
    const wait = () => {
      if (location.pathname !== was && document.querySelector('main .xs2-h1')) setTimeout(lift, 40); // the solution page itself has painted // the new page has committed; let it paint, then crossfade
      else if (performance.now() - t0 > 6000) { document.documentElement.removeAttribute('data-tile-open'); lift(); } // never hold the screen for good
      else requestAnimationFrame(wait);
    };
    requestAnimationFrame(wait);
  }, () => { d.remove(); lay?.remove(); });
}
