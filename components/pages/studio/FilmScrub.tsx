'use client';
/* The signature (film-scrub): Hanzo's own films, scrubbed by scroll frame by frame, forwards and back.
   A 2.39:1 frame (4:3 on a phone) holds still on a white stage while the section scrolls past it; the scroll is the
   playhead. The three pillars' films (Koma, Iro, Koe, 600 frames at 30 fps in all) sit end to end on one reel: the
   scroll position picks the film and its frame, a timecode (HH:MM:SS:FF) and a playhead on the ruler under the frame
   follow every frame, and the pillar the film belongs to stands under it.
   - Seeking: one rAF loop eases the shown time toward the scroll's time and only asks the video for a new frame when
     the last seek has decoded (`seeking` false), so fast scrolls never queue seeks; the loop sleeps when it has
     caught up and never runs off screen (IntersectionObserver) or in a background tab (rAF).
   - Pointer and touch: scroll (wheel, trackpad, finger) scrubs; the ruler is also a slider you can grab and drag
     (it moves the page, so scroll and playhead never disagree). Keyboard: arrows step 10 frames (Shift: 1 frame),
     Page Up/Down jump a film, Home/End.
   - Reduced motion: the posters (each film's still) stand in, no seeking; the playhead and captions still follow. */
import { useEffect, useRef, useState } from 'react';
import { useScroll, useMotionValueEvent } from 'motion/react';
import { scrollToY } from '../../../lib/scroll';

const FPS = 30;
const FRAMES = { koma: 180, iro: 240, koe: 180 }; // measured from /public/models/*.webm (ffprobe)
const pad = (n) => String(n).padStart(2, '0');
const tcode = (f) => `00:00:${pad(Math.floor(f / FPS))}:${pad(f % FPS)}`;

export default function FilmScrub({ pillars }) {
  const ref = useRef(null);
  const vids = useRef([]), tc = useRef(null), ph = useRef(null), rule = useRef(null), frame = useRef(null);
  const [on, setOn] = useState(0);
  const N = pillars.map(([, , slug]) => FRAMES[slug] || 180);
  const START = N.map((_, i) => N.slice(0, i).reduce((a, b) => a + b, 0));
  const TOTAL = START[N.length - 1] + N[N.length - 1];
  const st = useRef({ target: 0, shown: 0, k: 0, raf: 0, live: false, calm: false, near: false, f: -1 });
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  const which = (f) => { let k = 0; while (k < N.length - 1 && f >= START[k + 1]) k++; return k; };
  // one frame: ease toward the scroll's time, seek the film once its last seek has decoded, write the HUD
  const step = () => {
    const s = st.current;
    s.raf = 0;
    const d = s.target - s.shown;
    s.shown = Math.abs(d) < 0.5 || s.calm ? s.target : s.shown + d * 0.3;
    const f = Math.min(TOTAL - 1, Math.max(0, Math.round(s.shown)));
    const k = which(f);
    if (k !== s.k) { s.k = k; setOn(k); }
    let busy = false;
    const v = vids.current[k];
    if (v && !s.calm && v.readyState >= 1) {
      const t = (f - START[k] + 0.5) / FPS; // the middle of the frame, so rounding never lands on its neighbour
      if (v.seeking) busy = true;
      else if (Math.abs(v.currentTime - t) > 0.5 / FPS) { v.currentTime = t; busy = true; }
    }
    if (f !== s.f) {
      s.f = f;
      if (tc.current) tc.current.textContent = tcode(f);
      if (ph.current) ph.current.style.transform = `translate3d(${(f / (TOTAL - 1)) * 100}%, 0, 0)`;
      if (rule.current) { rule.current.setAttribute('aria-valuenow', String(f)); rule.current.setAttribute('aria-valuetext', `${tcode(f)}, ${pillars[k][4]}`); }
    }
    if (s.live && (s.shown !== s.target || busy)) s.raf = requestAnimationFrame(step);
  };
  const kick = () => { const s = st.current; if (s.live && !s.raf) s.raf = requestAnimationFrame(step); };

  useMotionValueEvent(p, 'change', (q) => {
    const s = st.current;
    s.target = Math.min(1, Math.max(0, q)) * (TOTAL - 1);
    // the frame is the moment: it grows from .92 to full size over the first tenth of the reel, then holds
    if (frame.current && !s.calm) frame.current.style.transform = `scale(${0.92 + 0.08 * Math.min(1, q / 0.1)})`;
    kick();
  });

  useEffect(() => { // after mount: reduced motion, on-screen state, when to fetch the films
    const s = st.current, el = ref.current;
    const mq = matchMedia('(prefers-reduced-motion: reduce)');
    const rm = () => { s.calm = mq.matches; if (s.calm && frame.current) frame.current.style.transform = 'none'; s.target = Math.min(1, Math.max(0, p.get())) * (TOTAL - 1); s.f = -1; kick(); };
    rm();
    mq.addEventListener('change', rm);
    const io = new IntersectionObserver(([e]) => {
      s.live = e.isIntersecting;
      if (s.live) kick(); else if (s.raf) { cancelAnimationFrame(s.raf); s.raf = 0; }
    }, { threshold: 0 });
    const pre = new IntersectionObserver(([e]) => { // fetch the films a screen before they are needed, never under reduced motion
      if (!e.isIntersecting || s.near || s.calm) return;
      s.near = true;
      vids.current.forEach((v) => { if (v) { v.preload = 'auto'; v.load(); } });
      pre.disconnect();
    }, { rootMargin: '100% 0px' });
    io.observe(el); pre.observe(el);
    const seeked = () => kick();
    vids.current.forEach((v) => v && (v.addEventListener('seeked', seeked), v.addEventListener('loadedmetadata', seeked)));
    s.live = true; kick();
    return () => {
      mq.removeEventListener('change', rm); io.disconnect(); pre.disconnect();
      vids.current.forEach((v) => v && (v.removeEventListener('seeked', seeked), v.removeEventListener('loadedmetadata', seeked)));
      if (s.raf) cancelAnimationFrame(s.raf);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // the ruler drives the page: a frame f lives at one scroll position, so grabbing the playhead just scrolls there
  const toFrame = (f) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + scrollY, range = el.offsetHeight - innerHeight;
    scrollToY(top + (Math.min(TOTAL - 1, Math.max(0, f)) / (TOTAL - 1)) * range, { immediate: true });
  };
  const fromX = (x) => { const r = rule.current.getBoundingClientRect(); return Math.round(((x - r.left) / r.width) * (TOTAL - 1)); };
  const drag = useRef(false);
  const down = (e) => { e.currentTarget.setPointerCapture?.(e.pointerId); drag.current = true; toFrame(fromX(e.clientX)); };
  const move = (e) => { if (drag.current) toFrame(fromX(e.clientX)); };
  const up = () => { drag.current = false; };
  const key = (e) => {
    const f = Math.max(0, st.current.f), k = which(f);
    const n = { ArrowRight: f + (e.shiftKey ? 1 : 10), ArrowUp: f + (e.shiftKey ? 1 : 10), ArrowLeft: f - (e.shiftKey ? 1 : 10), ArrowDown: f - (e.shiftKey ? 1 : 10),
      PageDown: START[Math.min(N.length - 1, k + 1)], PageUp: k > 0 && f === START[k] ? START[k - 1] : START[k], Home: 0, End: TOTAL - 1 }[e.key];
    if (n === undefined) return;
    e.preventDefault();
    toFrame(n);
  };

  return (
    <section className="xst-reel" ref={ref} aria-label="Three pillars">
      <div className="xst-reel-stick">
        <div className="a2-wrap">
          <div className="xst-frame" ref={frame}>
            {pillars.map(([t, , slug], i) => (
              <span key={t} className={'xst-frame-f' + (i === on ? ' on' : '')} data-film={slug}>
                <img src={`/models/${slug}.webp`} alt="" draggable="false" />
                <video ref={(el) => { vids.current[i] = el; }} src={`/models/${slug}.webm`} poster={`/models/${slug}.webp`} muted playsInline preload="none" aria-hidden="true" tabIndex={-1} disablePictureInPicture />
              </span>
            ))}
            <span className="xst-frame-rig x-mono" aria-hidden="true">{pillars[on][4]}</span>
            <span className="xst-frame-n x-mono" aria-hidden="true">{pad(on + 1)} / 03</span>
          </div>
          <div className="xst-scrub">
            <span className="xst-scrub-tc x-mono" ref={tc} aria-hidden="true">{tcode(0)}</span>
            <div
              className="xst-rule" ref={rule} role="slider" tabIndex={0} aria-label={pillars.map((x) => x[4]).join(', ')}
              aria-valuemin={0} aria-valuemax={TOTAL - 1} aria-valuenow={0} data-cursor="Scrub" data-swipe-own=""
              onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onKeyDown={key}
            >
              <span className="xst-rule-segs" aria-hidden="true">
                {pillars.map(([t, , , , rig], i) => (
                  <span key={t} className={'xst-rule-seg' + (i === on ? ' on' : '') + (i < on ? ' done' : '')} style={{ flexGrow: N[i] }}>
                    <i style={{ '--n': N[i] / FPS }} /><em className="x-mono">{rig}</em>
                  </span>
                ))}
              </span>
              <span className="xst-rule-ph" ref={ph} aria-hidden="true"><i /></span>
            </div>
          </div>
          <ol className="xst-subs">
            {pillars.map(([t, d], i) => (
              <li key={t} className={i === on ? 'on' : ''} aria-hidden={i !== on}>
                <span className="x-mono">{pad(i + 1)}</span>
                <h3 className="a2-title">{t}</h3>
                <p>{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
