'use client';
/* Mori's own motion (mr-): the five section entrances the motion map gives /mori, in page order, each page-local and
   each run once as its section comes into view (reduced motion and JS off show the final state):
   1 shrink-to-card  the viewport room (the particles signature) grows out of a card as it arrives and shrinks back
                     into a card as you leave it;
   2 side-carousel   "What Mori does": the four capabilities ride in sideways on a snapping carousel (drag, swipe,
                     arrows, keys), replacing the pinned chapters;
   3 pixel-resolve   "Where Mori fits" resolves from coarse pixels to sharp;
   4 card-deal       the studio map's six cards are dealt from a deck onto their places;
   5 scramble        "Frontier AI for everything you build." and the model names decode out of scrambled characters. */
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { MoriCap } from './MoriArt';

const EMPH = 'cubic-bezier(.16,1,.3,1)';
const calm = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
// run fn once, the first time el is a quarter in view
function once(el, fn, amount = 0.25) {
  if (!el) return () => {};
  const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { io.disconnect(); fn(); } }, { threshold: amount });
  io.observe(el);
  return () => io.disconnect();
}

/* 1. shrink-to-card: a wrapper whose room is a card on the way in and on the way out, full bleed while you are in it */
export function ShrinkCard({ children }) {
  const ref = useRef(null);
  const still = useReducedMotion();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const scale = useTransform(p, [0, 0.3, 0.7, 1], [0.86, 1, 1, 0.84]);
  const radius = useTransform(p, [0, 0.3, 0.7, 1], [32, 0, 0, 32]);
  return (
    <motion.div ref={ref} className="mr-shrink" style={still ? undefined : { scale, borderRadius: radius }}>
      {children}
    </motion.div>
  );
}

/* 2. side-carousel: the capabilities as cards on a horizontal snapping track */
export function CapsCarousel({ d }) {
  const sec = useRef(null), track = useRef(null);
  const [at, setAt] = useState(0);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const cards = [...track.current.children];
    if (!calm()) cards.forEach((li) => { li.style.transform = 'translateX(70vw)'; }); // waiting off to the right (JS only)
    const off = once(sec.current, () => {
      setSeen(true);
      if (calm()) return;
      cards.forEach((li, i) => {
        li.style.transform = '';
        li.animate(
          [{ transform: 'translateX(70vw)' }, { transform: 'translateX(-12px)', offset: 0.78 }, { transform: 'none' }],
          { duration: 1000, delay: i * 110, easing: EMPH, fill: 'backwards' },
        );
      });
    });
    return () => { off(); cards.forEach((li) => { li.style.transform = ''; }); };
  }, []);
  // which card is in front: the one nearest the track's left edge
  useEffect(() => {
    const t = track.current;
    const onScroll = () => {
      const cards = [...t.children], x = t.scrollLeft;
      let best = 0, bd = Infinity;
      cards.forEach((c, i) => { const dd = Math.abs(c.offsetLeft - t.offsetLeft - x); if (dd < bd) { bd = dd; best = i; } });
      setAt(best);
    };
    t.addEventListener('scroll', onScroll, { passive: true });
    return () => t.removeEventListener('scroll', onScroll);
  }, []);
  const go = (i) => {
    const t = track.current, n = t.children.length, j = Math.max(0, Math.min(n - 1, i));
    t.scrollTo({ left: t.children[j].offsetLeft - t.offsetLeft, behavior: calm() ? 'auto' : 'smooth' });
  };
  // mouse drag with a throw; touch and trackpads scroll natively
  const drag = useRef(null);
  const down = (e) => { if (e.pointerType !== 'mouse') return; drag.current = { x: e.clientX, l: track.current.scrollLeft, v: 0, t: performance.now(), moved: false }; track.current.setPointerCapture(e.pointerId); track.current.dataset.drag = ''; };
  const move = (e) => {
    const g = drag.current; if (!g) return;
    const dx = e.clientX - g.x, now = performance.now();
    g.v = (g.l - dx - track.current.scrollLeft) / Math.max(1, now - g.t); g.t = now;
    if (Math.abs(dx) > 4) g.moved = true;
    track.current.scrollLeft = g.l - dx;
  };
  const up = () => {
    const g = drag.current; if (!g) return;
    drag.current = null; delete track.current.dataset.drag;
    const t = track.current, w = t.children[0]?.offsetWidth || 1;
    go(Math.round((t.scrollLeft + g.v * 260) / (w + 12)));
  };
  return (
    <section className="lv-sec mr-caps" ref={sec} aria-labelledby="mr-caps-h">
      <div className="x-wrap">
        <div className="mr-caps-sh">
          <div>
            <h2 id="mr-caps-h" className="lv-h">What {d.name} does</h2>
            <p className="lv-side">Capabilities</p>
          </div>
          <div className="mr-caps-nav">
            <button type="button" className="mr-caps-b" aria-label="Previous" disabled={at === 0} onClick={() => go(at - 1)}>
              <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M13 8H4M7.5 4.5 4 8l3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <span className="mr-caps-n mb-tnum" aria-hidden="true">{String(at + 1).padStart(2, '0')} / {String(d.caps.length).padStart(2, '0')}</span>
            <button type="button" className="mr-caps-b" aria-label="Next" disabled={at === d.caps.length - 1} onClick={() => go(at + 1)}>
              <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
        </div>
      </div>
      <ol className="mr-track" ref={track} tabIndex={0} aria-label={`What ${d.name} does`}
        onKeyDown={(e) => { if (e.key === 'ArrowRight') { e.preventDefault(); go(at + 1); } if (e.key === 'ArrowLeft') { e.preventDefault(); go(at - 1); } }}
        onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
        {d.caps.map(([t, x], i) => (
          <li key={t} className="mr-card" data-on={i === at ? '' : undefined}>
            <div className="mr-card-art"><MoriCap i={i} on={seen && i === at} /></div>
            <h3>{t}</h3>
            <p>{x}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

// the pixelate filters (coarse to sharp); one hidden svg on the page
const PX = [36, 24, 16, 10, 6, 3];
export function PixelFilters() {
  return (
    <svg className="mr-px-defs" width="0" height="0" aria-hidden="true" focusable="false">
      {PX.map((s) => (
        <filter key={s} id={'mr-px-' + s} x="0" y="0" width="1" height="1" colorInterpolationFilters="sRGB">
          <feFlood x={s / 2} y={s / 2} width="1" height="1" />
          <feComposite width={s} height={s} />
          <feTile result="a" />
          <feComposite in="SourceGraphic" in2="a" operator="in" />
          <feMorphology operator="dilate" radius={s / 2} />
        </filter>
      ))}
    </svg>
  );
}

/* 3-5: the entrances that act on sections Creative.jsx draws (fits, map, model cards), found inside Mori's main */
const GLYPHS = '#%&@$*+=?/<>[]{}01';
function scramble(nodes) {
  const items = nodes.map((n) => ({ n, s: n.nodeValue }));
  const total = 1100, t0 = performance.now();
  const tick = (now) => {
    const k = Math.min(1, (now - t0) / total);
    items.forEach(({ n, s }, j) => {
      const kk = Math.max(0, Math.min(1, k * 1.25 - j * 0.04)), cut = Math.floor(s.length * kk);
      let o = s.slice(0, cut);
      for (let i = cut; i < s.length; i++) o += s[i] === ' ' ? ' ' : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      n.nodeValue = o;
    });
    if (k < 1) requestAnimationFrame(tick); else items.forEach(({ n, s }) => { n.nodeValue = s; });
  };
  requestAnimationFrame(tick);
}

export function useEntrances() {
  useEffect(() => {
    const main = document.querySelector('main:has([data-hero=mori])') || document.querySelector('main');
    if (!main || calm()) return;
    const offs = [];
    // 3. pixel-resolve: the fits section holds coarse pixels until it is in view, then steps down to sharp
    const fits = main.querySelector('.cr-fits');
    if (fits) {
      fits.style.filter = `url(#mr-px-${PX[0]})`;
      offs.push(once(fits, () => {
        PX.forEach((s, i) => setTimeout(() => { fits.style.filter = `url(#mr-px-${s})`; }, 150 + i * 160));
        setTimeout(() => { fits.style.filter = ''; }, 150 + PX.length * 160);
      }, 0.3));
    }
    // 4. card-deal: the six cards wait as a deck under the grid, then are dealt to their places one by one
    const grid = main.querySelector('.cr-map-grid');
    if (grid) {
      const tiles = [...grid.children];
      const pose = () => {
        const g = grid.getBoundingClientRect(), cx = g.left + g.width / 2, cy = g.bottom + 40;
        return tiles.map((li, i) => { const r = li.getBoundingClientRect(); return `translate(${cx - (r.left + r.width / 2)}px, ${cy - (r.top + r.height / 2)}px) rotate(${(i % 2 ? 1 : -1) * (3 + i)}deg)`; });
      };
      const p0 = pose();
      tiles.forEach((li, i) => { li.style.transform = p0[i]; li.style.zIndex = String(10 - i); });
      offs.push(once(grid, () => {
        tiles.forEach((li) => { li.style.transform = ''; });
        const p = pose(); // measured at rest, then each card starts from the deck
        tiles.forEach((li, i) => {
          li.animate([{ transform: p[i] }, { transform: 'none' }], { duration: 650, delay: 200 + i * 130, easing: EMPH, fill: 'backwards' })
            .finished.then(() => { li.style.zIndex = ''; }, () => {});
        });
      }, 0.2));
    }
    // 5. scramble: the model cards' headline, its line and every model name decode as the section arrives
    const mc = main.querySelector('.mc');
    if (mc) {
      const texts = [...mc.querySelectorAll('.mc-h, .mc-sub, .mc-t')].map((el) => [...el.childNodes].find((n) => n.nodeType === 3 && n.nodeValue.trim())).filter(Boolean);
      offs.push(once(mc, () => scramble(texts), 0.2));
    }
    return () => {
      offs.forEach((f) => f());
      if (fits) fits.style.filter = '';
      grid && [...grid.children].forEach((li) => { li.style.transform = ''; li.style.zIndex = ''; });
    };
  }, []);
}
