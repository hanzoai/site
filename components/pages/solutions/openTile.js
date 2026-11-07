'use client';
/* openTile: the /solutions index's card-to-page open. The tile's rectangle fills the screen, the solution page arrives,
   and the cover lifts itself once the route has changed (the solution pages, another chat's files, do not call
   doorway.js's useArrival). Used instead of Morph, which times out site-wide today. Reduced motion: a plain cut.
   Usage: <A to={href} data-no-morph onClick={(e) => openTile(e, href, router)}> */
const CURVE = 'cubic-bezier(.4, 0, .2, 1)'; // deck ease-in-out: things that move and stay

export function openTile(e, href, router, tone = '#000') {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { router.push(href); return; }
  const r = e.currentTarget.getBoundingClientRect();
  const d = document.createElement('div');
  d.setAttribute('aria-hidden', 'true');
  const from = `inset(${r.top}px ${innerWidth - r.right}px ${innerHeight - r.bottom}px ${r.left}px round 24px)`;
  Object.assign(d.style, { position: 'fixed', inset: '0', zIndex: '2000', background: tone, pointerEvents: 'none', clipPath: from });
  document.body.appendChild(d);
  const was = location.pathname;
  let lifted = false;
  const lift = () => {
    if (lifted) return;
    lifted = true;
    const a = d.animate([{ clipPath: 'inset(0px 0px 0px 0px)' }, { clipPath: 'inset(0px 0px 100% 0px)' }], { duration: 500, easing: CURVE, fill: 'forwards' });
    a.finished.then(() => d.remove(), () => d.remove());
  };
  d.animate([{ clipPath: from }, { clipPath: 'inset(0px 0px 0px 0px round 0px)' }], { duration: 500, easing: CURVE, fill: 'forwards' }).finished.then(() => {
    router.push(href);
    const t0 = performance.now();
    const wait = () => {
      if (location.pathname !== was) setTimeout(lift, 120); // the new page has committed; let it paint, then lift
      else if (performance.now() - t0 > 3000) lift(); // never hold the screen
      else requestAnimationFrame(wait);
    };
    requestAnimationFrame(wait);
  }, () => d.remove());
}
