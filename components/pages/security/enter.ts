'use client';
/* /security entrances (docs/MOTION-MAP.md row /security, in page order): shutter (the hero's six layers, on CSS from
   first paint), depth-parallax (the controls: the list and the carried-down stack sit at different depths and drift at
   their own speeds as the section passes, meeting at mid-screen), squash-land (the rack lands with a squash and a
   settle), scroll-tilt (the place switcher arrives tilted back and afterwards leans on rotateX with the scroll speed,
   levelling out when the page stops), slot-roll (the black room's "Ask us the hard question" rolls into place like a
   slot reel). Styles in ./enter.css, keyed by data-enter.
   One IntersectionObserver marks each [data-enter] with data-in at a quarter in view (or a quarter of the screen), then
   data-done once played. Only children take a start state, never the observed element. The two scroll-linked ones
   write one CSS variable each (--xsc-p, --xsc-tilt) in a rAF that runs only while the page scrolls and they are near
   the screen. Start states live under html.js without reduced motion; reduced motion and JS off show the final page,
   and the markup is identical on server and client. */
import { useEffect } from 'react';

export function useEnter(rootSel: string) {
  useEffect(() => {
    const root = document.querySelector(rootSel);
    if (!root) return undefined;
    const els = [...root.querySelectorAll<HTMLElement>('[data-enter]')];
    const timers: ReturnType<typeof setTimeout>[] = [];
    const play = (el: HTMLElement) => { el.dataset.in = ''; timers.push(setTimeout(() => { el.dataset.done = ''; }, 1800)); };
    if (typeof IntersectionObserver === 'undefined' || matchMedia('(prefers-reduced-motion: reduce)').matches) { els.forEach(play); return undefined; }
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (!e.isIntersecting) return;
        if (e.intersectionRatio >= 0.25 || e.intersectionRect.height >= innerHeight * 0.25) { play(e.target as HTMLElement); io.unobserve(e.target); }
      });
    }, { threshold: [0, 0.1, 0.25, 0.5] });
    els.forEach((el) => io.observe(el));

    // the two scroll-linked entrances
    const depth = root.querySelector<HTMLElement>('[data-enter="depth"]');
    const tilt = root.querySelector<HTMLElement>('[data-enter="tilt"]');
    let raf = 0, lastY = scrollY, lastT = performance.now(), v = 0, lean = 0;
    const near = (el: HTMLElement) => { const r = el.getBoundingClientRect(); return r.bottom > -innerHeight * 0.5 && r.top < innerHeight * 1.5; };
    const frame = (t: number) => {
      raf = 0;
      const dt = Math.max(1, t - lastT), y = scrollY;
      v = v * 0.8 + ((y - lastY) / dt) * 0.2; // px per ms, smoothed
      lastY = y; lastT = t;
      if (depth && near(depth)) {
        const r = depth.getBoundingClientRect();
        const p = Math.max(-1, Math.min(1, (r.top + r.height / 2 - innerHeight / 2) / innerHeight));
        depth.style.setProperty('--xsc-p', p.toFixed(3));
      }
      let moving = Math.abs(v) > 0.02;
      if (tilt && !near(tilt) && lean !== 0) { lean = 0; tilt.style.setProperty('--xsc-tilt', '0deg'); } // off screen: level at once
      if (tilt && near(tilt) && 'done' in tilt.dataset) {
        const want = Math.max(-7, Math.min(7, v * 4)); // a lean, capped at 7deg
        lean += (want - lean) * 0.18;
        if (Math.abs(lean) < 0.05 && !moving) lean = 0;
        tilt.style.setProperty('--xsc-tilt', lean.toFixed(2) + 'deg');
        if (lean !== 0) moving = true;
      }
      if (moving) raf = requestAnimationFrame(frame);
    };
    const onScroll = () => { if (!raf) { lastT = performance.now(); raf = requestAnimationFrame(frame); } };
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => { io.disconnect(); timers.forEach(clearTimeout); removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf); };
  }, [rootSel]);
}
