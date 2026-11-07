'use client';
/* openTile: the /solutions index's card-to-page open. The tile's rectangle fills the screen, the solution page arrives,
   and the cover lifts itself once the route has changed (the solution pages, another chat's files, do not call
   doorway.js's useArrival). Used instead of Morph, which times out site-wide today. Reduced motion: a plain cut.
   Usage: <A to={href} data-no-morph onClick={(e) => openTile(e, href, router)}> */
const CURVE = 'cubic-bezier(.4, 0, .2, 1)'; // deck ease-in-out: things that move and stay

export function prefetchTile(href, router) { try { router.prefetch(href); } catch { /* prefetch is a hint */ } }

export function openTile(e, href, router, tone = '#000') {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { router.push(href); return; }
  const tile = e.currentTarget;
  const r = tile.getBoundingClientRect();
  // the cover is the card itself: its film still and its name grow to fill the screen (never a flat black)
  const pic = tile.querySelector('img');
  const name = tile.querySelector('.xso-tile-n, [data-open-name]');
  const d = document.createElement('div');
  d.setAttribute('aria-hidden', 'true');
  const from = `inset(${r.top}px ${innerWidth - r.right}px ${innerHeight - r.bottom}px ${r.left}px round 24px)`;
  Object.assign(d.style, { position: 'fixed', inset: '0', zIndex: '2000', background: tone, pointerEvents: 'none', clipPath: from, overflow: 'hidden' });
  if (pic) {
    const img = document.createElement('img');
    img.src = pic.currentSrc || pic.src; img.alt = '';
    Object.assign(img.style, { position: 'absolute', inset: '0', width: '100%', height: '100%', objectFit: 'cover', objectPosition: getComputedStyle(pic).objectPosition });
    d.appendChild(img);
  }
  if (name) {
    const t = document.createElement('p');
    t.textContent = name.textContent;
    const cs = getComputedStyle(name), nr = name.getBoundingClientRect();
    Object.assign(t.style, { position: 'absolute', left: nr.left + 'px', top: nr.top + 'px', margin: '0', font: cs.font, letterSpacing: cs.letterSpacing, color: '#fafafa', whiteSpace: 'nowrap', transformOrigin: '0 0' });
    d.appendChild(t);
    // the name travels to where the page's h1 will sit (top left, below the header)
    // the name lands at the size and place of the destination's headline (52px at the h1's top left; 40 on phones)
    const k = Math.max(1, (innerWidth < 900 ? 40 : 52) / parseFloat(cs.fontSize));
    t.animate([{ transform: 'none' }, { transform: `translate(${Math.max(16, (innerWidth - 1152) / 2) - nr.left}px, ${(innerWidth < 900 ? 76 : 219) - nr.top}px) scale(${k})` }], { duration: 500, easing: CURVE, fill: 'forwards' });
  }
  document.body.appendChild(d);
  const was = location.pathname;
  router.push(href); // the route loads while the card grows
  let lifted = false;
  const lift = () => {
    if (lifted) return;
    lifted = true;
    // the cover settles onto the destination's own film (the widest picture in its first screen), then crossfades away
    const film = [...document.querySelectorAll('main img, main video')].map((x) => x.getBoundingClientRect()).find((b) => b.width > innerWidth * 0.5 && b.top < innerHeight && b.bottom > 0);
    const words = d.querySelector('p');
    if (words) words.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, fill: 'forwards' });
    const to = film ? `inset(${Math.max(0, film.top)}px ${Math.max(0, innerWidth - film.right)}px ${Math.max(0, innerHeight - film.bottom)}px ${Math.max(0, film.left)}px)` : 'inset(0px 0px 0px 0px)';
    d.animate([{ clipPath: 'inset(0px 0px 0px 0px)' }, { clipPath: to }], { duration: 450, easing: CURVE, fill: 'forwards' }).finished
      .then(() => d.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, easing: CURVE, fill: 'forwards' }).finished)
      .then(() => d.remove(), () => d.remove());
  };
  d.animate([{ clipPath: from }, { clipPath: 'inset(0px 0px 0px 0px round 0px)' }], { duration: 500, easing: CURVE, fill: 'forwards' }).finished.then(() => {
    const t0 = performance.now();
    const wait = () => {
      if (location.pathname !== was) setTimeout(lift, 60); // the new page has committed; let it paint, then crossfade
      else if (performance.now() - t0 > 6000) lift(); // never hold the screen for good
      else requestAnimationFrame(wait);
    };
    requestAnimationFrame(wait);
  }, () => d.remove());
}
