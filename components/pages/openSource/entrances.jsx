'use client';
/* /open-source section entrances (MOTION-MAP rule 7), in page order:
   1 snap-sections (What we publish), 2 magnet-gather (Total across Hanzo), 3 scroll-tilt (Every organization),
   4 letter-cascade (Our Stewardship Commitments), 5 ripple (Contribute).
   Each plays once when its section arrives. The server renders the final state: with JS off, under reduced motion,
   or when a section is already on screen at load, nothing is hidden. Only transform, opacity and clip-path move. */
import { useEffect, useLayoutEffect, useRef } from 'react';
import './entrances.css';

const calm = () => typeof window !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/* arm an element (data-e="wait") only if it is still below the fold, then flip it to "in" when it arrives */
function arm(el, onIn, margin = '0px 0px -18% 0px') {
  if (!el || calm()) return () => {};
  if (el.getBoundingClientRect().top < innerHeight * 0.92) return () => {};
  el.dataset.e = 'wait';
  const io = new IntersectionObserver(([en]) => {
    if (!en.isIntersecting) return;
    io.disconnect();
    el.dataset.e = 'in';
    onIn?.();
  }, { rootMargin: margin });
  io.observe(el);
  return () => io.disconnect();
}

/* 1. snap-sections: the section arrives as one screen and snaps up into place; if the reader lets go close to
   its top, the page settles on it, one screen at a time (once) */
export function SnapIn({ className = '', children }) {
  const ref = useRef(null);
  useLayoutEffect(() => arm(ref.current, () => {
    const el = ref.current;
    let t = 0;
    const settle = () => {
      clearTimeout(t);
      t = setTimeout(() => {
        window.removeEventListener('scroll', settle);
        const top = el.getBoundingClientRect().top - 116; // under the 60px header and the 56px local band
        if (Math.abs(top) > 8 && Math.abs(top) < innerHeight * 0.3) {
          const y = scrollY + top;
          if (window.__lenis) window.__lenis.scrollTo(y, { duration: 0.6 }); else window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 140);
    };
    window.addEventListener('scroll', settle, { passive: true });
    settle();
  }, '0px 0px -30% 0px'), []);
  return <div ref={ref} className={'xe-snap ' + className}>{children}</div>;
}

/* 2. magnet-gather: the figures start scattered and are pulled together into the list */
const SCATTER = [[-150, -70, -7], [170, 40, 6], [-90, 110, -4], [130, -90, 5], [-170, 60, 8]];
export function Gather({ as: Tag = 'ul', className = '', items, render }) {
  const ref = useRef(null);
  useLayoutEffect(() => arm(ref.current), []);
  return (
    <Tag ref={ref} className={'xe-gather ' + className}>
      {items.map((it, i) => {
        const [x, y, r] = SCATTER[i % SCATTER.length];
        return render(it, i, { '--gx': x + 'px', '--gy': y + 'px', '--gr': r + 'deg', '--gi': i });
      })}
    </Tag>
  );
}

/* 3. scroll-tilt: the cards tip back on rotateX with the speed of the scroll and level out when it stops */
export function Tilt({ className = '', children }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || calm()) return;
    let raf = 0, on = false, last = scrollY, tilt = 0, kicked = false;
    const frame = () => {
      const y = scrollY, v = y - last; last = y;
      const want = Math.max(-12, Math.min(12, v * 0.45));
      tilt += (want - tilt) * 0.14;
      if (Math.abs(tilt) < 0.02 && Math.abs(want) < 0.02) tilt = 0;
      el.style.transform = tilt ? `perspective(1400px) rotateX(${tilt.toFixed(2)}deg)` : '';
      raf = on || tilt ? requestAnimationFrame(frame) : 0;
    };
    const io = new IntersectionObserver(([en]) => {
      on = en.isIntersecting;
      if (on && !kicked) { kicked = true; if (en.boundingClientRect.top > innerHeight * 0.4) tilt = 14; } // arrives tipped back, then levels
      if (on && !raf) { last = scrollY; raf = requestAnimationFrame(frame); }
    }, { rootMargin: '0px 0px -10% 0px' });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, []);
  return <div ref={ref} className={'xe-tilt ' + className}>{children}</div>;
}

/* 4. letter-cascade: the heading's letters fall into place one by one (the words stay whole for wrapping and reading) */
export function Cascade({ as: Tag = 'h2', text, className = '', id }) {
  const ref = useRef(null);
  useLayoutEffect(() => arm(ref.current), []);
  let c = 0;
  return (
    <Tag ref={ref} id={id} className={'xe-cascade ' + className} aria-label={text}>
      {text.split(' ').map((w, wi, all) => (
        <span key={wi} className="xe-w" aria-hidden="true">
          {[...w].map((ch, k) => <span key={k} className="xe-l" style={{ '--c': c++ }}>{ch}</span>)}
          {wi < all.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  );
}

/* 5. ripple: rings spread from the centre of the section and leave it behind them */
export function Ripple({ as: Tag = 'section', className = '', children, ...rest }) {
  const ref = useRef(null);
  useLayoutEffect(() => arm(ref.current, null, '0px 0px -25% 0px'), []);
  return (
    <Tag ref={ref} className={'xe-ripple ' + className} {...rest}>
      <span className="xe-rings" aria-hidden="true"><i /><i /><i /></span>
      <div className="xe-ripple-c">{children}</div>
    </Tag>
  );
}
