'use client';
/* Koma: every frame tells a story. v2 launch page (Creative on Launch + Chapters, Hanzo's black and white).
   Signature: a four-shot timeline you scrub. The playhead runs Hanzo's Koma film through Shot 01 to 04, each with its
   own camera move (slow push, lateral arc, parallax pan, crane up) and a cut between them; grab the timeline (or use
   the arrow keys) and the film, the timecode and the shot follow your hand. The film settles into an anamorphic frame.
   Beyond: the studio map (Creative.jsx): every creative model serving your field, in its own words and colour. */
import { useEffect, useRef, useState } from 'react';
import { Studio } from './Studio';
import Creative, { Scene } from './Creative';
import { box as frame, film, focus } from '../../v2/Launch';
import { useLoop } from './live';
import './Koma.css';

const SHOTS = [
  ['Shot 01: Orbital Master', '24mm Prime', 'Slow Push', '50% 50%'],
  ['Shot 02: Tracking Hero', '50mm Anamorphic', 'Lateral Arc', '35% 42%'],
  ['Shot 03: Depth Cut', '85mm T1.5', 'Parallax Pan', '64% 55%'],
  ['Shot 04: Reveal Plate', '35mm Wide', 'Crane Up', '50% 30%'],
];
const LEN = 12;
const MOVE = [
  (p) => `scale(${1.04 + 0.12 * p})`,
  (p) => `translateX(${-3 + 6 * p}%) rotate(${-0.8 + 1.6 * p}deg) scale(1.14)`,
  (p) => `translateX(${4 - 8 * p}%) scale(1.16)`,
  (p) => `translateY(${4 - 8 * p}%) scale(1.16)`,
];
const pad = (n) => String(n).padStart(2, '0');

function Monitor() {
  const stage = useRef(null), vid = useRef(null), cam = useRef(null), run = useRef(null), track = useRef(null);
  const sec = useRef(null), cs = useRef(null), cut = useRef(null);
  const S = useRef({ t: 6, drag: false, idle: 0, shot: 0 });
  const [shot, setShot] = useState(0); // the server shows Hanzo's own frame: shot 01 at 00:06.00
  const [play, setPlay] = useState(true);

  const show = (t) => {
    const s = S.current, k = Math.min(3, Math.floor(t / 3)), p = (t - k * 3) / 3;
    s.t = t;
    if (cam.current) cam.current.style.transform = MOVE[k](p);
    if (run.current) run.current.style.transform = `translateX(${(t / LEN) * 100}%)`;
    if (sec.current) sec.current.textContent = pad(Math.floor(t));
    if (cs.current) cs.current.textContent = pad(Math.floor((t % 1) * 100));
    if (track.current) { track.current.setAttribute('aria-valuenow', t.toFixed(1)); track.current.setAttribute('aria-valuetext', `00:${pad(Math.floor(t))} · ${SHOTS[k][0]}`); }
    if (k !== s.shot) {
      s.shot = k; setShot(k);
      cut.current?.animate([{ opacity: 0.85 }, { opacity: 0 }], { duration: 320, easing: 'ease-out' });
    }
  };
  const seek = (t) => {
    const v = vid.current, d = v && Number.isFinite(v.duration) ? v.duration : 6;
    t = Math.max(0, Math.min(LEN - 0.01, t));
    if (v) v.currentTime = (t / LEN) * d;
    S.current.idle = 0;
    show(t);
  };
  const fromX = (e) => { const r = track.current.getBoundingClientRect(); return ((e.clientX - r.left) / r.width) * LEN; };

  useEffect(() => {
    const v = vid.current;
    v.playbackRate = 0.5; // the 6 s film spans the 12 s timeline
    const ready = () => { v.currentTime = 0; };
    if (v.readyState >= 1) ready(); else v.addEventListener('loadedmetadata', ready, { once: true });
  }, []);

  useLoop(stage, (_, dt, still) => {
    const v = vid.current, s = S.current;
    if (still) { v.pause(); show(6); return; }
    if (s.drag) return;
    if (!play) { s.idle += dt; return; }
    if (v.paused) { s.idle += dt; if (s.idle > 1.2) v.play().catch(() => {}); }
    if (Number.isFinite(v.duration) && v.duration) show((v.currentTime / v.duration) * LEN);
  });

  const toggle = () => { const v = vid.current; if (play) v.pause(); else v.play().catch(() => {}); setPlay(!play); };

  return (
    <div className="kf-stage" ref={stage}>
      <div className="kf-mon">
        <div className="kf-cam" ref={cam}>
          <video ref={vid} data-own src={film('koma', 'webm')} poster={film('koma', 'webp')} muted loop playsInline autoPlay preload="auto" aria-hidden="true" />
        </div>
        <i className="kf-thirds" aria-hidden="true" />
        <i className="kf-cut" ref={cut} aria-hidden="true" />
        <p className="kf-tag kf-tl mb-mono mb-live">REC · 4K 60FPS</p>
        <p className="kf-tag kf-tr mb-mono"><span>| SHOT 01/04</span></p>
        <p className="kf-tag kf-bl mb-mono">GUIDANCE: 7.5 · LATENT: 1080p</p>
        <p className="kf-tag kf-br mb-mono">CAMERA: ORBITAL 35mm</p>
      </div>
      <div className="kf-line">
        <div className="kf-line-h">
          <p className="mb-mono">Continuity Shot Pipeline (120 Frames Temporal Flow)</p>
          <p className="kf-tc mb-tnum"><span>00:</span><span ref={sec}>06</span>.<span ref={cs}>00</span> <span className="kf-tc-of">/ 00:12.00</span></p>
          <button type="button" className="mb-chip kf-play" aria-pressed={play} onClick={toggle}>{play ? 'Pause' : 'Play'}</button>
        </div>
        <div
          className="kf-track"
          ref={track}
          role="slider"
          tabIndex={0}
          aria-label="Timeline"
          aria-valuemin={0}
          aria-valuemax={LEN}
          aria-valuenow={6}
         
          onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); S.current.drag = true; vid.current.pause(); seek(fromX(e)); }}
          onPointerMove={(e) => { if (S.current.drag) seek(fromX(e)); }}
          onPointerUp={() => { S.current.drag = false; if (play) vid.current.play().catch(() => {}); }}
          onPointerCancel={() => { S.current.drag = false; if (play) vid.current.play().catch(() => {}); }}
          onKeyDown={(e) => { const k = { ArrowRight: 0.5, ArrowLeft: -0.5, ArrowUp: 3, ArrowDown: -3 }[e.key]; if (k) { e.preventDefault(); vid.current.pause(); seek(S.current.t + k); } }}
        >
          <ol className="kf-shots">
            {SHOTS.map(([n, lens, move, pos], i) => (
              <li key={n} data-on={shot === i ? '' : undefined}>
                <span className="kf-thumb" style={{ backgroundImage: `url(${film('koma', 'webp')})`, backgroundPosition: pos }} aria-hidden="true" />
                <b><span>{n}</span></b>
                <span>{lens} · {move}</span>
              </li>
            ))}
          </ol>
          <span className="kf-ruler" aria-hidden="true" />
          <span className="kf-run" ref={run} style={{ transform: 'translateX(50%)' }} aria-hidden="true"><i className="kf-head" /></span>
        </div>
      </div>
    </div>
  );
}

// the film closes into an anamorphic frame across the top; the headline runs beneath it
const SCOPE = frame((W, H, wide) => {
  if (wide) { const w = W * 0.88, h = Math.min(w / 2.39, H * 0.5); return { l: (W - w) / 2, t: H * 0.06, w, h, r: 16 }; }
  const w = W - 32, h = Math.min(w / 1.25, H * 0.34); return { l: 16, t: H * 0.08, w, h, r: 14 };
});

export default function Koma() {
  return (
    <Creative
      slug="koma"
      subject={[0.75, 0.5]}
      shape={SCOPE}
      aim={(W, H, wide) => (wide ? focus(0.72, 0.5, W * 0.64, H * 0.31, 1.14, [W * 0.06, H * 0.06, W * 0.94, H * 0.56])(W, H) : focus(0.72, 0.5, W / 2, H * 0.25, 1.3, [16, H * 0.08, W - 16, H * 0.42])(W, H))}
      headClass="kf-v2"
      first="chapters"
      flip
      demo={
        <Scene slug="koma" dark className="kf-scene">
          <Studio slug="koma" engine="Hanzo Koma-1 · Spatio-temporal DiT">
            <Monitor />
          </Studio>
        </Scene>
      }
    />
  );
}
