'use client';
/* Page-local entrances for the /blockchain family (docs/MOTION-MAP.md, rule 7). Each main section arrives its own way,
   once, when it is about 30% on screen. Nothing here is shared outside components/pages/blockchain/.
   - /blockchain: opposite-drift, scramble, grid-wave, text-mask-film (FilmHead), cursor-lens (Lens)
   - /blockchain/<product>: accordion, stretch-scroll, scramble, grow-from-point, diagonal-wipe
   `scramble` is built once here and used by both pages.
   Rules every entrance keeps: the server HTML is the final frame (JS off shows everything); a section is only set to
   its starting frame after hydration and only when it is still below the screen; reduced motion never arms; only
   transform, opacity, clip-path, mask and filter move, so nothing shifts the layout. */
import { useEffect, useRef } from 'react';

/* the last place the visitor pointed or touched (for grow-from-point and grid-wave) */
const last = { x: -1, y: -1 };
if (typeof window !== 'undefined' && !window.__bceTrack) {
  window.__bceTrack = true;
  const put = (e) => { last.x = e.clientX; last.y = e.clientY; };
  addEventListener('pointermove', put, { passive: true });
  addEventListener('pointerdown', put, { passive: true });
}

const calm = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const below = (el) => el.getBoundingClientRect().top > innerHeight * 0.9;
/* ~30% of the screen covered by the section (tall sections), or 30% of the section seen (short ones) */
function onArrive(el, go) {
  const h = Math.max(1, el.offsetHeight);
  const io = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    io.disconnect();
    go();
  }, { threshold: Math.min(0.3, (innerHeight * 0.3) / h) });
  io.observe(el);
  return () => io.disconnect();
}
const later = (fn, ms) => { const t = setTimeout(fn, ms); return () => clearTimeout(t); };

/* ---------- scramble: characters scramble and decode into the text (left to right) ---------- */
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=<>/$';
const rnd = () => GLYPHS[(Math.random() * GLYPHS.length) | 0];
const garble = (s, upto) => s.split('').map((ch, i) => (i < upto || /\s|[.,:;()'’-]/.test(ch) ? ch : rnd())).join('');
function scramble(el, sel) {
  const nodes = [];
  el.querySelectorAll(sel).forEach((t) => {
    const w = document.createTreeWalker(t, NodeFilter.SHOW_TEXT);
    for (let n = w.nextNode(); n; n = w.nextNode()) if (n.nodeValue.trim()) nodes.push({ n, s: n.nodeValue });
  });
  if (!nodes.length) return null;
  const hold = [...el.querySelectorAll(sel)].map((t) => [t, t.style.minHeight]);
  hold.forEach(([t]) => { t.style.minHeight = t.offsetHeight + 'px'; }); // the garbled line may wrap differently: hold the height
  nodes.forEach((o) => { o.n.nodeValue = garble(o.s, 0); });
  let raf = 0;
  const finish = () => { cancelAnimationFrame(raf); nodes.forEach((o) => { o.n.nodeValue = o.s; }); hold.forEach(([t, m]) => { t.style.minHeight = m; }); };
  const play = () => {
    const t0 = performance.now();
    let tick = 0;
    const frame = (t) => {
      let busy = false;
      const flick = t - tick > 45;
      if (flick) tick = t;
      nodes.forEach((o, k) => {
        const p = Math.min(1, Math.max(0, (t - t0 - k * 90) / (420 + o.s.length * 14)));
        if (p < 1) busy = true;
        if (flick || p >= 1) o.n.nodeValue = p >= 1 ? o.s : garble(o.s, Math.floor(o.s.length * p));
      });
      if (busy) raf = requestAnimationFrame(frame); else finish();
    };
    raf = requestAnimationFrame(frame);
  };
  return { play, finish };
}

/* ---------- the generic section entrance ---------- */
/* fx: 'scramble' | 'accordion' | 'grid-wave' | 'grow-from-point' | 'diagonal-wipe' | 'stretch-scroll' | 'opposite-drift'
   pick: the selector of the parts that move (scramble: the text; accordion: the rows; grid-wave: the cells) */
export function Enter({ fx, pick, as: Tag = 'div', className = '', children, ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || calm()) return;
    const offs = [];
    const set = (s) => { el.dataset.st = s; };

    if (fx === 'opposite-drift' || fx === 'stretch-scroll') return scrolled(el, fx);
    if (!below(el)) return;

    if (fx === 'scramble') {
      const s = scramble(el, pick || 'h2, h3');
      if (!s) return;
      offs.push(onArrive(el, s.play), s.finish);
      return () => offs.forEach((f) => f());
    }
    set('armed');
    if (fx === 'accordion') {
      el.querySelectorAll(pick).forEach((r, k) => { r.style.setProperty('--k', k); r.dataset.fold = k % 2 ? 'b' : 'a'; });
    }
    if (fx === 'grid-wave') {
      const cells = [...el.querySelectorAll(pick)];
      offs.push(onArrive(el, () => {
        const r = el.getBoundingClientRect();
        const inside = last.x >= 0 && last.y >= 0;
        const ox = inside ? last.x : r.left + r.width / 2, oy = inside ? Math.min(Math.max(last.y, r.top), r.bottom) : r.top + Math.min(r.height, innerHeight) / 2;
        let far = 0;
        cells.forEach((c) => { const b = c.getBoundingClientRect(); const d = Math.hypot(b.left + b.width / 2 - ox, b.top + b.height / 2 - oy); far = Math.max(far, d); c.style.setProperty('--gw', Math.round(d * 0.75) + 'ms'); });
        set('play');
        offs.push(later(() => { set('done'); cells.forEach((c) => c.style.removeProperty('--gw')); }, Math.min(2400, far * 0.75) + 900));
      }));
      return () => { offs.forEach((f) => f()); delete el.dataset.st; };
    }
    if (fx === 'grow-from-point') {
      offs.push(onArrive(el, () => {
        const r = el.getBoundingClientRect();
        const has = last.x >= 0;
        const x = has ? Math.min(Math.max(last.x - r.left, 0), r.width) : r.width / 2;
        const y = has ? Math.min(Math.max(last.y - r.top, 0), r.height) : r.height / 2;
        el.style.setProperty('--gx', x + 'px');
        el.style.setProperty('--gy', y + 'px');
        set('play');
        offs.push(later(() => set('done'), 1100));
      }));
      return () => { offs.forEach((f) => f()); delete el.dataset.st; };
    }
    offs.push(onArrive(el, () => { set('play'); offs.push(later(() => set('done'), fx === 'accordion' ? 1600 : 1200)); }));
    return () => { offs.forEach((f) => f()); delete el.dataset.st; };
  }, [fx, pick]);
  return <Tag ref={ref} className={'bce ' + className} data-fx={fx} {...rest}>{children}</Tag>;
}

/* the two entrances that follow the scroll while the section comes in, then stand still for good:
   - opposite-drift: [data-drift="-1"] parts drift in from the left and [data-drift="1"] from the right, in step with
     the scroll, and meet when the section is a third of the way up the screen;
   - stretch-scroll: the section is drawn out vertically by the speed of the scroll (and by how far it still has to
     come), and relaxes to its true shape as the scroll slows. */
function scrolled(el, fx) {
  const top0 = el.getBoundingClientRect().top;
  if (top0 < innerHeight * 0.4) return; // already in place
  const parts = fx === 'opposite-drift' ? [...el.querySelectorAll('[data-drift]')] : [el.querySelector('[data-stretch]') || el];
  let raf = 0, lastY = scrollY, lastT = performance.now(), v = 0, s = 1, done = false;
  const clear = () => parts.forEach((p) => { p.style.transform = ''; p.style.opacity = ''; p.style.transformOrigin = ''; });
  const frame = () => {
    raf = 0;
    if (done) return;
    const r = el.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (r.top - innerHeight * 0.33) / (innerHeight * 0.62))); // 1 = just below, 0 = in place
    const now = performance.now();
    const dt = Math.max(8, now - lastT);
    v = v * 0.8 + (Math.abs(scrollY - lastY) / dt) * 0.2; // px per ms, smoothed
    lastY = scrollY; lastT = now;
    if (fx === 'opposite-drift') {
      const e = p * p * (3 - 2 * p);
      parts.forEach((q) => { const d = +q.dataset.drift || 0; q.style.transform = e ? `translate3d(${d * e * 22}vw, 0, 0)` : ''; q.style.opacity = e ? String(1 - e * 0.65) : ''; });
      if (p === 0) { done = true; clear(); return; }
    } else {
      const want = 1 + Math.min(0.32, v * 0.12 + p * 0.22);
      s += (want - s) * 0.18;
      parts.forEach((q) => { q.style.transformOrigin = '50% 0'; q.style.transform = `scaleY(${s.toFixed(4)})`; });
      if (p === 0 && s < 1.004) { done = true; clear(); return; }
    }
    raf = requestAnimationFrame(frame); // keep easing while the scroll is still (stretch relaxes; drift is exact)
  };
  const kick = () => { if (!raf && !done) raf = requestAnimationFrame(frame); };
  frame();
  addEventListener('scroll', kick, { passive: true });
  return () => { cancelAnimationFrame(raf); removeEventListener('scroll', kick); clear(); };
}

/* ---------- text-mask-film: a film plays through the letters of a headline ---------- */
/* The headline is real ink text. Over it sits an aria-hidden copy whose letters are windows onto a grey film (Hanzo's
   own clip, desaturated): while the film plays the words are made of it; then the copy fades and the ink stays. */
export function FilmHead({ as: Tag = 'h2', id, className = '', text, src = '/learn/zen-720.webm' }) {
  const box = useRef(null);
  useEffect(() => {
    const el = box.current;
    if (!el || calm() || !below(el)) return;
    const v = el.querySelector('video');
    el.dataset.st = 'armed';
    v.src = src;
    const offs = [onArrive(el, () => {
      el.dataset.st = 'play';
      v.currentTime = 0;
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
      offs.push(later(() => { el.dataset.st = 'done'; }, 2600), later(() => { v.pause(); v.removeAttribute('src'); v.load(); delete el.dataset.st; }, 3400));
    })];
    return () => offs.forEach((f) => f());
  }, [src]);
  return (
    <div className="bce-film" ref={box}>
      <Tag id={id} className={className}>{text}</Tag>
      <span className="bce-film-m" aria-hidden="true">
        <video muted playsInline loop preload="auto" tabIndex={-1} />
        <span className={'bce-film-t ' + className}>{text}</span>
      </span>
    </div>
  );
}

/* ---------- cursor-lens: a circular lens follows the cursor and magnifies ---------- */
/* On arrival the lens sweeps once across the section and the content develops behind it; afterwards it follows a fine
   pointer over the section (touch: press and drag to move it). The magnified copy is aria-hidden and inert. */
export function Lens({ children, className = '', zoom = 1.7 }) {
  const box = useRef(null);
  useEffect(() => {
    const el = box.current;
    if (!el || calm()) return;
    const lens = el.querySelector('.bce-lens');
    const show = (x, y) => { el.style.setProperty('--lx', x + 'px'); el.style.setProperty('--ly', y + 'px'); el.style.setProperty('--bw', el.offsetWidth + 'px'); };
    const at = (e) => { const r = el.getBoundingClientRect(); show(e.clientX - r.left, e.clientY - r.top); };
    const on = (e) => { if (el.dataset.st === 'play') return; at(e); lens.dataset.on = ''; };
    const off = () => { if (el.dataset.st !== 'play') delete lens.dataset.on; };
    let tm = 0;
    const up = (e) => { if (e.pointerType !== 'mouse') { clearTimeout(tm); tm = setTimeout(off, 700); } };
    el.addEventListener('pointermove', on);
    el.addEventListener('pointerdown', on);
    el.addEventListener('pointerleave', off);
    el.addEventListener('pointerup', up);
    const offs = [() => { clearTimeout(tm); el.removeEventListener('pointermove', on); el.removeEventListener('pointerdown', on); el.removeEventListener('pointerleave', off); el.removeEventListener('pointerup', up); }];
    if (below(el)) {
      el.dataset.st = 'armed';
      el.style.setProperty('--rev', '0%');
      offs.push(onArrive(el, () => {
        el.dataset.st = 'play';
        lens.dataset.on = '';
        const r = el.getBoundingClientRect();
        const t0 = performance.now(), D = 1500;
        let raf = 0;
        const frame = (t) => {
          const p = Math.min(1, (t - t0) / D);
          const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
          const x = -60 + e * (r.width + 120);
          show(x, r.height * (0.5 + Math.sin(e * Math.PI * 2) * 0.22));
          el.style.setProperty('--rev', ((x / r.width) * 100).toFixed(1) + '%');
          if (p < 1) raf = requestAnimationFrame(frame);
          else { delete el.dataset.st; delete lens.dataset.on; el.style.removeProperty('--rev'); }
        };
        raf = requestAnimationFrame(frame);
        offs.push(() => cancelAnimationFrame(raf));
      }));
    }
    return () => offs.forEach((f) => f());
  }, []);
  return (
    <div className={'bce-lensbox ' + className} ref={box} style={{ '--z': zoom }}>
      <div className="bce-lens-base">{children}</div>
      <div className="bce-lens" aria-hidden="true" inert>
        <div className="bce-lens-in">{children}</div>
      </div>
    </div>
  );
}
