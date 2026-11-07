'use client';
/* Koe: performance in every word. v2 launch page (Creative on Launch + Chapters, accent violet). The film settles
   into a tall capsule left of the headline.
   Signature: a voice waveform with its transcript. The waveform streams out of the playhead while the phonemes of
   "Hanzo" (/h/ /æ/ /n/ /z/ /oʊ/) light in step; each acting preset re-performs the same word (dramatic is slow and
   wide, documentary breathy and soft, gritty rough, commercial brisk and even). Tap the waveform to seek, pick a
   preset, or pause. (A drawn illustration of a performance, not Koe's audio.)
   Beyond: the studio map (Creative.jsx): every creative model serving your field, in its own words and colour. */
import { useMemo, useRef, useState } from 'react';
import { Studio } from './Studio';
import Creative, { Scene } from './Creative';
import { box as frame, focus } from '../../v2/Launch';
import { useLoop, fit, rng, arrows } from './live';
import './Koe.css';

const PH = [['/h/', 0.55, 0.85, 'H'], ['/æ/', 0.85, 1.55, 'a'], ['/n/', 1.55, 1.95, 'n'], ['/z/', 1.95, 2.45, 'z'], ['/oʊ/', 2.45, 3.6, 'o']];
const PRESETS = [
  ['Cinematic Dramatic', 1.2, 1, 0.12, 0.04],
  ['Intimate Documentary', 1, 0.5, 0.05, 0.22],
  ['Gritty Character', 0.95, 0.85, 0.45, 0.08],
  ['Warm Commercial', 0.85, 0.75, 0.03, 0.02],
];
const LEN = 5, BARS = 160;
const at = (pr, k) => [0.55 + (PH[k][1] - 0.55) * pr[1], 0.55 + (PH[k][2] - 0.55) * pr[1]];

// the performance: one amplitude per bar across the 5 seconds
function shape(pr, seed) {
  const r = rng(seed), out = new Float32Array(BARS);
  for (let i = 0; i < BARS; i++) {
    const t = (i / BARS) * LEN;
    let a = 0.025 + r() * 0.02;
    PH.forEach((p, k) => {
      const [s, e] = at(pr, k);
      if (t < s || t >= e) return;
      const u = (t - s) / (e - s), env = Math.sin(Math.PI * Math.min(1, u * 1.2 + 0.05));
      const base = [0.22 + pr[4], 0.92, 0.5, 0.32 + pr[4] * 0.5, 0.86 * (1 - u * 0.7)][k];
      const noisy = k === 0 || k === 3;
      a = base * env * pr[2] * (noisy ? 0.55 + r() * 0.6 : 0.85 + 0.15 * Math.sin(t * 70)) * (1 + (r() - 0.5) * pr[3]);
    });
    out[i] = Math.min(1, a);
  }
  return out;
}

function Booth() {
  const stage = useRef(null), cv = useRef(null), sEl = useRef(null), csEl = useRef(null), cells = useRef([]), letters = useRef([]);
  const [pi, setPi] = useState(0);
  const [play, setPlay] = useState(true);
  const S = useRef({ t: 1.9, hold: 0, k: -2 });
  const amps = useMemo(() => PRESETS.map((p, i) => shape(p, 11 + i)), []);

  const mark = (t) => {
    const pr = PRESETS[pi];
    let k = -1;
    PH.forEach((_, j) => { const [s, e] = at(pr, j); if (t >= s && t < e) k = j; });
    const done = PH.filter((_, j) => t >= at(pr, j)[1]).length;
    const key = k * 10 + done;
    if (key === S.current.k) return;
    S.current.k = key;
    PH.forEach((_, j) => {
      const st = j === k ? 'on' : j < done ? 'done' : '';
      [cells.current[j], letters.current[j]].forEach((el) => { if (el && el.dataset.s !== st) el.dataset.s = st; });
    });
  };

  useLoop(stage, (_, dt, still) => {
    const c = cv.current, s = S.current;
    if (!c) return;
    if (still) s.t = LEN;
    else if (play) {
      if (s.t < LEN) s.t = Math.min(LEN, s.t + dt);
      else if ((s.hold += dt) > 1.1) { s.t = 0; s.hold = 0; }
    }
    const { w, h, d } = fit(c);
    const g = c.getContext('2d'), A = amps[pi], bw = w / BARS, mid = h / 2;
    g.clearRect(0, 0, w, h);
    for (let i = 0; i < BARS; i++) {
      const t = (i / BARS) * LEN, x = i * bw + bw * 0.2, bwid = Math.max(1, bw * 0.6);
      if (t > s.t) { g.fillStyle = 'rgba(255,255,255,.14)'; g.fillRect(x, mid - d, bwid, 2 * d); continue; }
      const grow = Math.min(1, (s.t - t) / 0.12), a = A[i] * grow * (h * 0.46);
      g.fillStyle = s.t - t < 0.25 ? '#ffffff' : 'rgba(245,245,247,.78)';
      g.fillRect(x, mid - a, bwid, Math.max(2 * d, a * 2));
    }
    g.fillStyle = '#ff453a';
    g.fillRect(Math.min(w - 2 * d, (s.t / LEN) * w), 0, 2 * d, h);
    const sec = Math.floor(s.t), cs = Math.floor((s.t % 1) * 100);
    if (sEl.current) sEl.current.textContent = String(Math.min(5, sec));
    if (csEl.current) csEl.current.textContent = String(s.t >= LEN ? 0 : cs).padStart(2, '0');
    mark(s.t);
  });

  const seek = (e) => { const r = cv.current.getBoundingClientRect(); S.current.t = Math.max(0, Math.min(LEN, ((e.clientX - r.left) / r.width) * LEN)); S.current.hold = 0; };
  const choose = (i) => { setPi(i); S.current.t = 0; S.current.hold = 0; S.current.k = -2; setPlay(true); };

  return (
    <div className="ko-booth" ref={stage}>
      <div className="ko-top">
        <p className="mb-mono">FLOW-MATCHING ACOUSTIC STAGE · STREAMING PHONEMES</p>
        <p className="ko-tc mb-tnum"><span>00:0</span><span ref={sEl}>1</span>.<span ref={csEl}>90</span> <span className="ko-tc-of">/ 00:05.00 · TTFT: 180ms</span></p>
        <button type="button" className="mb-chip" aria-pressed={play} onClick={() => setPlay(!play)}>{play ? 'Pause' : 'Play'}</button>
      </div>
      <div className="ko-wave" data-cursor="Seek" role="slider" tabIndex={0} aria-label="Voice waveform: seek" aria-valuemin={0} aria-valuemax={LEN} aria-valuenow={1.9} onKeyDown={(e) => { const k = { ArrowRight: 0.25, ArrowLeft: -0.25 }[e.key]; if (k) { e.preventDefault(); S.current.t = Math.max(0, Math.min(LEN, S.current.t + k)); S.current.hold = 0; } }}>
        <canvas ref={cv} aria-hidden="true" onPointerDown={seek} />
      </div>
      <div className="ko-script">
        <ol className="ko-ph" aria-label="Phonemes">
          {PH.map(([p], i) => <li key={p} ref={(el) => (cells.current[i] = el)}>{p}</li>)}
        </ol>
        <p className="ko-word" role="img" aria-label="Hanzo">{PH.map(([, , , l], i) => <span key={i} ref={(el) => (letters.current[i] = el)} aria-hidden="true">{l}</span>)}</p>
      </div>
      <div className="ko-presets">
        <p className="mb-mono">ACTING PRESET:</p>
        <div className="mb-chips" role="radiogroup" aria-label="Acting preset" onKeyDown={arrows}>
          {PRESETS.map(([n], i) => <button key={n} type="button" role="radio" aria-checked={pi === i} className="mb-chip" onClick={() => choose(i)}>{n}</button>)}
        </div>
      </div>
    </div>
  );
}

// the film closes into a tall capsule on the left (a horizontal one on phones); the headline sits right of it
const CAPSULE = frame((W, H, wide) => {
  if (wide) { const w = Math.min(W * 0.2, H * 0.4), h = H * 0.84; return { l: W * 0.26 - w / 2, t: (H - h) / 2, w, h, r: w / 2 }; }
  const h = H * 0.3; return { l: 20, t: H * 0.07, w: W - 40, h, r: h / 2 };
});

export default function Koe() {
  return (
    <Creative
      slug="koe"
      accent="#7b4dff"
      ink="#5b32d6"
      shape={CAPSULE}
      aim={(W, H, wide) => (wide ? focus(0.66, 0.45, W * 0.26, H * 0.5, 1.25) : focus(0.68, 0.45, W / 2, H * 0.22, 1.5))(W, H)}
      headClass="ko-v2"
      first="chapters"
      demo={
        <Scene slug="koe" className="ko-scene" k="Live booth" title="One word, four performances." lede="The waveform streams out of the playhead while the phonemes of “Hanzo” light in step. Each acting preset re-performs the same word; tap the waveform to seek.">
          <Studio slug="koe" engine="" specs={[['Zero-Shot Cloning', 'Reference Audio', '3.0s Clean Sample'], ['Sub-Second Latency', 'First Token', '< 200ms'], ['Synthesis Engine', 'Hanzo Koe-1 Engine', 'Neural Flow-Matching']]}>
            <Booth />
          </Studio>
        </Scene>
      }
    />
  );
}
