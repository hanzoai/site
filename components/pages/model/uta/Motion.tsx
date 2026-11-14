'use client';
/* /uta's own motion (MOTION-MAP: signature film-scrub; entrances page-curl, iris, scroll-tilt, count-roll, spiral-in).
   Page-local pieces, each with its own entrance; no shared reveal. Every word is Hanzo's (creative.js `uta`).
   - Scrub: the signature. Scroll scrubs Uta's film frame by frame, forwards and back (every frame of uta.webm is a
     keyframe, so a seek lands exactly); dragging across the film scrubs too. The capability being read follows the
     film. Enters by page-curl: a paper sheet curls away from the bottom-left corner to show it.
   - Iris: the studio board opens from a circle at its centre.
   - Tilt: Hanzo's model cards lean back on rotateX with scroll speed and level out when still.
   - Fits: the 01 / 02 / 03 numbers count and roll into place like a counter.
   - Close: the closing band's headline, lede and asks spiral in from the edge to their places.
   Reduced motion and JS off show every final state (the film rests on its poster). */
import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, PointerEvent, ReactNode, RefObject } from 'react';
import { Img, Cta, More, A } from '../../../kit';
import { Magnetic } from '../../../ui';
import ModelFilm from '../../../v2/ModelFilm';
import ModelCards from '../ModelCards';
import { film } from '../../../v2/Launch';
import { C } from '../creativeData';
import './motion.css';

const d = C.uta;

// once a piece is properly on screen, it says so (data-in); each piece's CSS decides how it arrives
export function useIn(ref: RefObject<Element | null>, margin = '0px 0px -30% 0px') {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { rootMargin: margin, threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return on;
}

/* The signature: scroll scrubs the film. */
export function Scrub() {
  const sec = useRef<HTMLElement>(null), box = useRef<HTMLElement>(null), bar = useRef<HTMLElement>(null), num = useRef<HTMLElement>(null);
  const on = useIn(sec, '0px 0px -55% 0px');
  const [at, setAt] = useState(0);
  useEffect(() => {
    const s = sec.current, v = box.current?.querySelector('video');
    if (!s || !v || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    v.preload = 'auto';
    v.src = film('uta', 'webm');
    let raf = 0, last = -1, idx = 0, idle: ReturnType<typeof setTimeout> | 0 = 0, drift = 0, seen = false, p0 = 0, off = 0, tt = 0;
    const read = () => { const r = s.getBoundingClientRect(); const run = r.height - innerHeight; return run > 0 ? Math.min(1, Math.max(0, -r.top / run)) : 0; };
    // the film at a point p (0..1) of its run: seek it, and the counter, bar and capability being read follow it
    const show = (p: number) => {
      const D = v.duration || 6, t = p * (D - 0.04);
      if (v.readyState >= 1 && Math.abs(t - last) > 0.016) { v.currentTime = t; last = t; }
      if (bar.current) bar.current.style.transform = `scaleX(${p.toFixed(4)})`;
      if (num.current) num.current.textContent = String(Math.round(p * 179) + 1).padStart(3, '0');
    };
    const tick = () => {
      raf = 0;
      const p = read();
      off = 0; show(p); p0 = p;
      const i = Math.min(3, Math.floor(p * 4));
      if (i !== idx) { idx = i; setAt(i); }
      // at rest the film keeps playing inside the capability being read: a slow loop through its quarter of the
      // film, so the pinned screen is never still; the next scroll takes the film back to where the scroll is
      cancelAnimationFrame(drift); drift = 0; clearTimeout(idle);
      idle = setTimeout(() => { if (seen && !document.hidden) { tt = performance.now(); drift = requestAnimationFrame(roll); } }, 700);
    };
    const roll = (now: number) => {
      const dt = Math.min(0.05, (now - tt) / 1000); tt = now;
      const lo = idx / 4, span = 0.25;
      off = (off + dt * 0.035) % span; // a quarter of the film in about 7 s
      show(lo + ((p0 - lo + off) % span + span) % span);
      drift = requestAnimationFrame(roll);
    };
    const go = () => { if (!raf) raf = requestAnimationFrame(tick); };
    const io = new IntersectionObserver(([e]) => { seen = e.isIntersecting; if (seen) go(); else { cancelAnimationFrame(drift); drift = 0; clearTimeout(idle); } }, { threshold: 0.2 });
    if (box.current) io.observe(box.current);
    addEventListener('scroll', go, { passive: true });
    addEventListener('resize', go);
    v.addEventListener('loadedmetadata', go);
    go();
    return () => { cancelAnimationFrame(raf); cancelAnimationFrame(drift); clearTimeout(idle); io.disconnect(); removeEventListener('scroll', go); removeEventListener('resize', go); v.removeEventListener('loadedmetadata', go); };
  }, []);
  // drag across the film to scrub it: a full width of drag is the whole film
  const drag = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse' || e.buttons !== 1) return;
    const s = sec.current, w = e.currentTarget.getBoundingClientRect().width;
    if (!s) return;
    scrollBy(0, (e.movementX / w) * (s.offsetHeight - innerHeight));
  };
  return (
    <section className="ut-scrub" ref={sec} data-in={on ? '' : undefined} aria-labelledby="ut-caps-h">
      <div className="ut-scrub-pin">
        <div className="x-wrap ut-scrub-in">
          <div className="ut-scrub-l">
            <h2 id="ut-caps-h" className="lv-h">What {d.name} does</h2>
            <p className="lv-side">Capabilities</p>
            <ol className="ut-caps">
              {d.caps.map(([t], i) => (
                <li key={t} data-on={i === at ? '' : undefined}>
                  <span className="ut-caps-n mb-tnum" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <h3>{t}</h3>
                </li>
              ))}
            </ol>
            {/* the bodies share one cell, so the one being read never changes the column's height */}
            <div className="ut-caps-x" aria-live="off">
              {d.caps.map(([t, x], i) => <p key={t} data-on={i === at ? '' : undefined}>{x}</p>)}
            </div>
          </div>
          <figure className="ut-scrub-film" ref={box} onPointerMove={drag} aria-hidden="true">
            <Img src={film('uta', 'webp')} w={1200} h={1500} />
            <ModelFilm slug="uta" play={false} />
            <figcaption className="ut-scrub-meta mb-tnum"><b ref={num}>001</b> / 180<span className="ut-scrub-bar"><i ref={bar} /></span></figcaption>
          </figure>
        </div>
        <span className="ut-curl" aria-hidden="true" />
      </div>
    </section>
  );
}

/* The studio board opens like an iris. */
export function Iris({ children }: { children?: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const on = useIn(ref, '0px 0px -25% 0px');
  return <div className="ut-iris" ref={ref} data-in={on ? '' : undefined}>{children}</div>;
}

/* Hanzo's model cards lean with scroll speed and level out when still; they first arrive leaning back. */
export function Tilt() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0, live = false, seen = false, tilt = 18, y = scrollY, tt = performance.now(), vel = 0;
    const frame = (now: number) => {
      const dt = Math.max(16, now - tt);
      vel = vel * 0.8 + ((scrollY - y) / dt) * 0.2;
      y = scrollY; tt = now;
      if (!seen && el.getBoundingClientRect().top < innerHeight * 0.75) seen = true; // arrived: level out
      const target = seen ? Math.max(-9, Math.min(9, vel * 6)) : 18;
      tilt += (target - tilt) * 0.1;
      el.style.setProperty('--ut-tilt', tilt.toFixed(2) + 'deg');
      // keep running until it has come to rest, even after it leaves the screen
      raf = live || Math.abs(tilt - target) > 0.05 || Math.abs(vel) > 0.01 ? requestAnimationFrame(frame) : 0;
    };
    const io = new IntersectionObserver(([e]) => {
      live = e.isIntersecting;
      if (live && !raf) { y = scrollY; tt = performance.now(); raf = requestAnimationFrame(frame); }
    }, { threshold: 0 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, []);
  return <div className="ut-tilt" ref={ref}><ModelCards slug="uta" /></div>;
}

// a number that rolls into its value: a reel of digits behind each place (the digits themselves are decoration)
const REEL = '01234567890123456789'.split('');
function Count({ n, i }: { n: string; i: number }) {
  return (
    <span className="ut-cnt mb-tnum" aria-label={n}>
      {n.split('').map((c, k) => (
        <span key={k} className="ut-cnt-c" aria-hidden="true">
          <span className="ut-cnt-r" style={{ '--d': 10 + Number(c), '--i': i * 2 + k } as CSSProperties}>{REEL.map((r, j) => <span key={j}>{r}</span>)}</span>
        </span>
      ))}
    </span>
  );
}

/* Where it fits: Hanzo's three rooms, their numbers counting in. */
export function Fits() {
  const ref = useRef<HTMLElement>(null);
  const on = useIn(ref, '0px 0px -25% 0px');
  return (
    <section className="lv-sec cr-fits ut-fits" ref={ref} data-in={on ? '' : undefined} aria-labelledby="cr-fits-uta">
      <div className="x-wrap cr-fits-in">
        <div className="cr-fits-l">
          <div className="lv-sh">
            <h2 id="cr-fits-uta" className="lv-h">Where {d.name} fits</h2>
            <p className="lv-side">In production</p>
          </div>
          <ol className="cr-fits-list">
            {d.fits.map(([k, t, x], i) => (
              <li key={t}>
                <span className="cr-fit-n"><Count n={String(i + 1).padStart(2, '0')} i={i} /></span>
                <h3>{t}</h3>
                <p className="cr-fit-x">{x}</p>
                <p className="cr-fit-k">{k}</p>
              </li>
            ))}
          </ol>
        </div>
        <figure className="cr-fits-art ut-fits-art">
          <Img src={film('uta', 'webp')} w={1200} h={1500} />
          <ModelFilm slug="uta" play={on} />
        </figure>
      </div>
    </section>
  );
}

/* The closing band: the kit Band's words and asks, spiralling in to their places. */
export function Close() {
  const ref = useRef<HTMLElement>(null);
  const on = useIn(ref, '0px 0px -20% 0px');
  return (
    <section className="x-band ut-band" ref={ref} data-room="dark" data-in={on ? '' : undefined} aria-label="Uta">
      {/* the band's object: Uta's four stems, faint behind the words, rising and falling like a mix at rest */}
      <span className="ut-band-stems" aria-hidden="true">{[0, 1, 2, 3].map((i) => <i key={i} style={{ '--i': i } as CSSProperties} />)}</span>
      <div className="x-wrap">
        <h2 className="ut-sp" style={{ '--i': 0 } as CSSProperties}>Try Uta on your own work</h2>
        <p className="ut-sp" style={{ '--i': 1 } as CSSProperties}>Samples of Uta&apos;s own output publish only after blind review, so the pictures here are illustrations. A studio can apply now to test it in its own pipeline.</p>
        <div className="x-band-act ut-sp" style={{ '--i': 2 } as CSSProperties}>
          <Magnetic><Cta to="/research-access?models=uta" id="uta.band" thumb>Request access</Cta></Magnetic>
          <p className="cr-band-note ut-band-note"><More to="/models">Every model</More><A to="/beta/research">Research preview</A></p>
        </div>
      </div>
    </section>
  );
}
