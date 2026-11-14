'use client';
/* /grants entrances (page-local; never shared). The server HTML holds every final state; after mount this hook:
   - adds .xgr-in to each [data-enter] section once it is about 25% in view (IntersectionObserver, once);
   - grid-wave (hero art): times each tile by its distance from the pointer (or the corner by the headline), and
     ripples the grid again from wherever the art is pointed at or tapped;
   - cover-slide / shrink-to-card: writes --xgr-p (0..1) from a passive scroll listener;
   - stamp (the signature): each way's sheet lands with weight once in view (.xgr-stamped), and a click or tap on a
     sheet stamps it again from that point (--sx/--sy).
   Reduced motion: the CSS ignores all of it and shows the final state. */
import { useEffect } from 'react';
import type { RefObject } from 'react';

const restart = (el: HTMLElement, cls: string) => { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); };

function waveFrom(grid: HTMLElement, x: number, y: number) {
  const r = grid.getBoundingClientRect();
  const tiles = grid.children as HTMLCollectionOf<HTMLElement>;
  let max = 1;
  const d: number[] = [];
  for (const t of tiles) {
    const q = t.getBoundingClientRect();
    const v = Math.hypot(q.left + q.width / 2 - x, q.top + q.height / 2 - y);
    d.push(v); if (v > max) max = v;
  }
  for (let i = 0; i < tiles.length; i++) tiles[i].style.setProperty('--d', Math.round((d[i] / max) * 520) + 'ms');
  return r;
}

export default function useEnter(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const vh = () => innerHeight || 800;
    const seen = (e: IntersectionObserverEntry) => e.isIntersecting && (e.intersectionRatio >= 0.25 || e.intersectionRect.height >= vh() * 0.25);

    /* grid-wave: the hero art's tiles */
    const grid = el.querySelector<HTMLElement>('.xgr-grid');
    const art = grid && grid.parentElement;
    let pointer: [number, number] | null = null;
    const onMove = (e: PointerEvent) => { pointer = [e.clientX, e.clientY]; };
    const onRipple = (e: PointerEvent) => {
      if (!grid || !grid.parentElement?.closest('.xgr-in')) return;
      waveFrom(grid, e.clientX, e.clientY);
      restart(grid, 'xgr-ripple');
    };
    if (art) {
      art.addEventListener('pointerenter', onRipple);
      art.addEventListener('pointerdown', onRipple);
      el.addEventListener('pointermove', onMove, { passive: true });
    }

    const io = new IntersectionObserver((list) => {
      for (const e of list) {
        if (!seen(e)) continue;
        const t = e.target as HTMLElement;
        if (t.matches('[data-stamp]')) t.classList.add('xgr-stamped');
        else {
          if (t.dataset.enter === 'grid-wave' && grid && art) {
            const a = art.getBoundingClientRect();
            const [x, y] = pointer || [a.left, a.top + a.height * 0.35];
            waveFrom(grid, x, y);
          }
          t.classList.add('xgr-in');
        }
        io.unobserve(t);
      }
    }, { threshold: [0, 0.1, 0.25, 0.5] });
    el.querySelectorAll('[data-enter],[data-stamp]').forEach((s) => io.observe(s));

    /* stamp again where the sheet is clicked or tapped (a tap, not a scroll; links and buttons keep their own job) */
    const onStamp = (e: MouseEvent) => {
      const tg = e.target as Element;
      const li = tg.closest<HTMLElement>('[data-stamp]');
      if (!li || tg.closest('a,button')) return;
      const r = li.getBoundingClientRect();
      li.style.setProperty('--sx', Math.round(e.clientX - r.left) + 'px');
      li.style.setProperty('--sy', Math.round(e.clientY - r.top) + 'px');
      restart(li, 'xgr-stamped');
    };
    el.addEventListener('click', onStamp);

    /* scroll-linked: cover-slide rises over the section before it, shrink-to-card folds the section away as you leave */
    const cover = el.querySelectorAll<HTMLElement>('[data-enter="cover-slide"]');
    const shrink = el.querySelectorAll<HTMLElement>('[data-enter="shrink-to-card"]');
    let raf = 0;
    const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
    const tick = () => {
      raf = 0;
      const h = vh();
      cover.forEach((s) => { const top = s.getBoundingClientRect().top; s.style.setProperty('--xgr-p', clamp((h - top) / (h * 0.7)).toFixed(3)); });
      shrink.forEach((s) => { const b = s.getBoundingClientRect().bottom; s.style.setProperty('--xgr-p', clamp((h - b) / (h * 0.55)).toFixed(3)); });
    };
    const onScroll = () => { if (!raf) raf = window.requestAnimationFrame(tick); };
    tick();
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll, { passive: true });
    return () => {
      io.disconnect();
      removeEventListener('scroll', onScroll); removeEventListener('resize', onScroll);
      el.removeEventListener('click', onStamp);
      el.removeEventListener('pointermove', onMove);
      if (art) { art.removeEventListener('pointerenter', onRipple); art.removeEventListener('pointerdown', onRipple); }
      if (raf) cancelAnimationFrame(raf);
    };
  }, [root]);
}
