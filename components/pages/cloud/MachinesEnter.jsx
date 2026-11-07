'use client';
/* Machines' five section entrances (MOTION-MAP rule 7), in page order: glitch-in (hero), diagonal-wipe (the zoom),
   snap-sections (when you want a whole machine), page-curl (how renting one works), noise-dissolve (whose machine it
   is). Each plays once when its section arrives (IntersectionObserver sets data-in), moves only transform, opacity or
   clip-path (the dissolve paints a canvas over the section and clears it), and rests at its final state under reduced
   motion and with JS off: every pre-state in Machines.css sits behind `.js` and `prefers-reduced-motion: no-preference`.
   Nothing here changes layout: overlays are absolutely placed inside their section. */
import { useEffect, useRef } from 'react';
import { scrollToY } from '../../../lib/scroll';

const calm = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Sets data-in on the element once a share of it is on screen. */
function useArrive(amount = 0.25) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((es) => {
      if (es.some((e) => e.isIntersecting)) { el.setAttribute('data-in', ''); io.disconnect(); }
    }, { threshold: amount });
    io.observe(el);
    return () => io.disconnect();
  }, [amount]);
  return ref;
}

/* glitch-in: a short monochrome glitch (sliced copies jump sideways), then it holds still. */
export function Glitch({ as: Tag = 'div', className = '', children, ...rest }) {
  const ref = useArrive(0);
  return <Tag ref={ref} className={'mc-gl ' + className} {...rest}>{children}</Tag>;
}

/* diagonal-wipe: a diagonal clip sweeps across from the top-left corner. */
export function Wipe({ as: Tag = 'div', className = '', children, ...rest }) {
  const ref = useArrive(0.2);
  return <Tag ref={ref} className={'mc-dw ' + className} {...rest}>{children}</Tag>;
}

/* snap-sections: as the section comes up, the page snaps it to the top of the screen (once, scrolling down, when the
   scroll comes to rest with the section's top in the upper part of the screen) and its content snaps up into place. */
export function Snap({ as: Tag = 'section', className = '', children, ...rest }) {
  const ref = useArrive(0.2);
  useEffect(() => {
    const el = ref.current;
    if (!el || calm()) return;
    let last = scrollY, down = false, t = 0, done = false;
    const check = () => {
      if (done) return;
      const top = el.getBoundingClientRect().top;
      if (top < 0) { done = true; return off(); }
      if (down && top > 72 && top < innerHeight * 0.45) {
        done = true;
        off();
        scrollToY(scrollY + top - 60, { duration: 0.5 });
      }
    };
    const onScroll = () => { down = scrollY > last; last = scrollY; clearTimeout(t); t = setTimeout(check, 120); };
    const off = () => { removeEventListener('scroll', onScroll); clearTimeout(t); };
    addEventListener('scroll', onScroll, { passive: true });
    return off;
  }, [ref]);
  return <Tag ref={ref} className={'mc-snap ' + className} {...rest}>{children}</Tag>;
}

/* page-curl: the previous section's white surface lies over this one and curls away from the bottom-right corner,
   its folded back shading as it goes. */
export function Curl({ as: Tag = 'section', className = '', children, ...rest }) {
  const ref = useArrive(0.3);
  return (
    <Tag ref={ref} className={'mc-curl ' + className} {...rest}>
      {children}
      <span className="mc-curl-sheet" aria-hidden="true" />
      <span className="mc-curl-flap" aria-hidden="true"><i /></span>
    </Tag>
  );
}

/* noise-dissolve: the section starts under a field of grey grain that dissolves away cell by cell. */
export function Dissolve({ as: Tag = 'section', className = '', children, ...rest }) {
  const ref = useRef(null);
  const cv = useRef(null);
  useEffect(() => {
    const el = ref.current, c = cv.current;
    if (!el || !c) return;
    const hide = () => { c.style.display = 'none'; };
    if (calm()) return hide();
    const S = 3;
    let raf = 0, io;
    const w = Math.ceil(el.offsetWidth / S), h = Math.ceil(el.offsetHeight / S);
    c.width = w; c.height = h;
    const g = c.getContext('2d');
    const img = g.createImageData(w, h);
    const n = w * h, r = new Float32Array(n), shade = new Uint8Array(n);
    for (let i = 0; i < n; i++) { r[i] = Math.random(); shade[i] = 229 + ((Math.random() * 27) | 0); }
    const paint = (t) => {
      const d = img.data;
      for (let i = 0, j = 0; i < n; i++, j += 4) {
        const v = shade[i];
        d[j] = v; d[j + 1] = v; d[j + 2] = v; d[j + 3] = r[i] >= t ? 255 : 0;
      }
      g.putImageData(img, 0, 0);
    };
    paint(0);
    el.setAttribute('data-ready', '');
    io = new IntersectionObserver((es) => {
      if (!es.some((e) => e.isIntersecting)) return;
      io.disconnect();
      el.setAttribute('data-in', '');
      const t0 = performance.now(), D = 900;
      const step = (now) => {
        const p = Math.min(1, (now - t0) / D);
        paint((1 - Math.pow(1 - p, 2)) * 1.02);
        if (p < 1) raf = requestAnimationFrame(step); else hide();
      };
      raf = requestAnimationFrame(step);
    }, { threshold: 0.25 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, []);
  return (
    <Tag ref={ref} className={'mc-noise ' + className} {...rest}>
      {children}
      <canvas ref={cv} className="mc-noise-cv" aria-hidden="true" />
    </Tag>
  );
}
