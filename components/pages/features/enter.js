'use client';
/* /features only: the five section entrances (pixel-resolve, grid-wave, tilt-3d-hover, underline-sweep, spring-snap)
   and the sideways gallery (h-gallery). The server paints every section in its final state; after mount this hook
   marks a section `xft-in` when about a quarter of it is in view (once), and the CSS in enter.css plays its entrance.
   Reduced motion: enter.css shows the final states and this hook only marks the sections. */
import { useEffect } from 'react';

const PX = [18, 12, 8, 5, 3]; // pixel-resolve: block sizes, coarse to fine, ~110 ms each

function pixelResolve(el) {
  const f = document.getElementById('xft-px');
  if (!f) return el.classList.add('xft-done');
  const [fl, co, mo] = [f.querySelector('feFlood'), f.querySelector('feComposite'), f.querySelector('feMorphology')];
  let k = 0;
  const step = () => {
    if (k >= PX.length) { el.classList.add('xft-done'); return; }
    const s = PX[k++], h = Math.floor(s / 2);
    fl.setAttribute('x', h); fl.setAttribute('y', h);
    co.setAttribute('width', s); co.setAttribute('height', s);
    mo.setAttribute('radius', h);
    setTimeout(step, 110);
  };
  step();
}

export default function useFeaturesEnter(root) {
  useEffect(() => {
    const main = root.current;
    if (!main) return;
    const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
    let px = innerWidth / 2, py = innerHeight * 0.6, moved = false;
    const off = [];
    const on = (t, e, f, o = { passive: true }) => { t.addEventListener(e, f, o); off.push(() => t.removeEventListener(e, f, o)); };
    on(window, 'pointermove', (e) => { px = e.clientX; py = e.clientY; moved = true; });

    const play = (el) => {
      const kind = el.dataset.enter;
      if (calm) { el.classList.add('xft-in', 'xft-done'); return; }
      if (kind === 'pixel') { el.classList.add('xft-in'); pixelResolve(el); return; }
      if (kind === 'wave') {
        // each key waits by its distance from the pointer (or from where a thumb would be): a ripple outward
        const ox = moved ? px : innerWidth / 2, oy = moved ? py : el.getBoundingClientRect().top;
        el.querySelectorAll('.xft-key').forEach((k) => {
          const r = k.getBoundingClientRect(), d = Math.hypot(r.left + r.width / 2 - ox, r.top + r.height / 2 - oy);
          k.style.setProperty('--d', Math.round(Math.min(d, 1200) * 0.38) + 'ms');
        });
      }
      if (kind === 'tilt') { el.style.setProperty('--tx', '0deg'); el.style.setProperty('--ty', '0deg'); }
      el.classList.add('xft-in');
      setTimeout(() => el.classList.add('xft-done'), 1400);
    };

    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      const need = 0.25 * Math.min(e.boundingClientRect.height, innerHeight);
      const needW = 0.25 * Math.min(e.boundingClientRect.width, innerWidth);
      if (e.intersectionRect.height < need || e.intersectionRect.width < needW) return;
      io.unobserve(e.target); play(e.target);
    }), { threshold: [0, 0.1, 0.2, 0.25, 0.35, 0.5, 0.75, 1] });
    main.querySelectorAll('[data-enter]').forEach((el) => io.observe(el));
    off.push(() => io.disconnect());

    // tilt-3d-hover: the room's film leans toward the pointer as it arrives, then follows it (2.5° at most)
    main.querySelectorAll('[data-enter="tilt"]').forEach((el) => {
      const lean = (x, y, big) => {
        const r = el.getBoundingClientRect(), a = big ? 14 : 2.5;
        const nx = Math.max(-1, Math.min(1, ((x - r.left) / r.width) * 2 - 1)), ny = Math.max(-1, Math.min(1, ((y - r.top) / r.height) * 2 - 1));
        el.style.setProperty('--tx', (nx * a).toFixed(2) + 'deg');
        el.style.setProperty('--ty', (-ny * a * 0.6).toFixed(2) + 'deg');
      };
      lean(px, py, true);
      if (!fine || calm) return;
      on(window, 'pointermove', (e) => { if (!el.classList.contains('xft-in')) lean(e.clientX, e.clientY, true); });
      on(el, 'pointermove', (e) => { if (el.classList.contains('xft-done')) lean(e.clientX, e.clientY, false); });
      on(el, 'pointerleave', () => { if (el.classList.contains('xft-done')) { el.style.setProperty('--tx', '0deg'); el.style.setProperty('--ty', '0deg'); } });
    });

    // h-gallery: on wide screens the section is tall and its stage holds still; vertical scroll moves the track
    // of rooms sideways for that stretch, then lets go. Phones get a swipe rail (CSS scroll-snap, no pin).
    const gal = main.querySelector('.xft-gal'), track = gal?.querySelector('.xft-gal-track');
    if (gal && track) {
      const wide = matchMedia('(min-width: 900px)');
      const set = () => {
        if (!wide.matches || calm) { track.style.removeProperty('--gx'); gal.style.removeProperty('--gp'); return; }
        const r = gal.getBoundingClientRect(), run = r.height - innerHeight;
        const p = Math.max(0, Math.min(1, -r.top / Math.max(1, run)));
        const dist = track.scrollWidth - document.documentElement.clientWidth;
        track.style.setProperty('--gx', (-p * dist).toFixed(1) + 'px');
        gal.style.setProperty('--gp', p.toFixed(4));
      };
      set();
      on(window, 'scroll', set);
      on(window, 'resize', set);
      // keyboard: focus inside a room that is off to the side scrolls the page to that room
      on(track, 'focusin', (e) => {
        if (!wide.matches || calm) return;
        const panel = e.target.closest('.xft-prod');
        const panels = [...track.querySelectorAll(':scope > .xft-prod')], i = panels.indexOf(panel);
        if (i < 0) return;
        const run = gal.offsetHeight - innerHeight, top = gal.getBoundingClientRect().top + scrollY;
        const dist = track.scrollWidth - document.documentElement.clientWidth;
        const want = Math.max(0, Math.min(dist, panel.offsetLeft - (document.documentElement.clientWidth - panel.offsetWidth) / 2));
        const y = top + (want / Math.max(1, dist)) * run;
        if (Math.abs(scrollY - y) > 4) { window.__lenis ? window.__lenis.scrollTo(y, { immediate: true }) : scrollTo(0, y); }
      });
    }
    return () => off.forEach((f) => f());
  }, [root]);
}
