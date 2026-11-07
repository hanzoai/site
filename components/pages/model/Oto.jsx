'use client';
/* Oto: give every moment its sound. v2 launch page (Creative on Launch + Chapters, Hanzo's black and white). The film settles
   into a waveform; the soundstage is the page's one dark room.
   Signature: a live spectrogram. Each Foley prop fires on its own cue (00:01.12, 00:02.40, 00:03.85, 00:05.10) and
   paints its sound into the scrolling spectrum (a drum's broadband hit, gravel steps at 120 BPM, a vault latch's
   ringing partials, rain's high speckle) while the bus meters answer. Tap a prop to fire it; turn on Sound to hear
   it, synthesised in the browser. (An illustration of Foley, not Oto's output.)
   Beyond: the studio map (Creative.jsx): every creative model serving your field, in its own words and colour. */
import { useEffect, useRef, useState } from 'react';
import { Film } from '../../kit';
import { Studio } from './Studio';
import { usePaused } from '../../v2/ModelFilm';
import Creative, { Scene } from './Creative';
import { lerp, film, focus } from '../../v2/Launch';
import { useLoop, fit, audio, burst, tone, hush } from './live';
import './Oto.css';

const PROPS = [
  ['🥁', 'Acoustic Drumming & Floor Impacts', '98.4 dBA', '00:01.12', 1.12],
  ['👟', 'Gravel Footsteps (120 BPM)', '74.2 dBA', '00:02.40', 2.4],
  ['🔐', 'Heavy Vault Door Latch', '92.1 dBA', '00:03.85', 3.85],
  ['🌧️', 'Rain on Stained Glass', '62.8 dBA', '00:05.10', 5.1],
];
const BUS = [['Direct Prop Spot Mic', 88], ['Foley Pit Room Atmos', 79], ['Sub-Harmonic Exciter (40Hz)', 92], ['Ribbon High Air Texture', 59]];
const H = 128, LOOP = 6;
// monochrome heat: black, graphite, grey, white (no hue: colour lives only in Hanzo's films)
const LUT = (() => {
  const st = [[0, 0, 0, 0], [0.22, 22, 22, 22], [0.5, 82, 82, 82], [0.78, 190, 190, 190], [1, 255, 255, 255]];
  const o = new Uint8ClampedArray(256 * 3);
  for (let i = 0; i < 256; i++) {
    const v = i / 255, k = st.findIndex((s) => s[0] >= v), a = st[Math.max(0, k - 1)], b = st[k], f = (v - a[0]) / (b[0] - a[0] || 1);
    for (let c = 0; c < 3; c++) o[i * 3 + c] = a[c + 1] + (b[c + 1] - a[c + 1]) * f;
  }
  return o;
})();
const gauss = (y, c, w) => Math.exp(-((y - c) * (y - c)) / w);
// how much energy each prop puts at frequency y (0 low … 1 high), `age` seconds after its cue
const SOUND = [
  (y, age, r) => (age > 0.6 ? 0 : Math.exp(-age * 9) * (y < 0.25 ? 1 : 0.75 * Math.exp(-(y - 0.25) * 2.5)) * (0.75 + 0.25 * r)),
  (y, age, r) => { if (age > 2.4) return 0; const l = age % 0.5; return l < 0.09 ? (y > 0.3 && y < 0.85 ? 0.8 : 0.25) * (1 - l / 0.09) * r : 0; },
  (y, age) => (age > 2.2 ? 0 : (y < 0.18 ? Math.exp(-age * 5) : 0) + (age < 0.05 ? 0.6 : 0) + [0.31, 0.44, 0.58, 0.72].reduce((s, f, i) => s + Math.exp(-age * (1.6 + i * 0.4)) * gauss(y, f, 0.00018) * 0.85, 0)),
  (y, age, r) => (age > 2.5 ? 0 : y > 0.5 ? (r < 0.18 ? 0.35 + 0.5 * Math.random() : 0.05) * Math.min(1, age * 4, (2.5 - age) * 2) : 0),
];
const SYNTH = [
  (ac) => { tone(ac, { f: 92, type: 'sine', dur: 0.4, gain: 0.5, glide: 0.5 }); burst(ac, { f: 1800, q: 0.7, dur: 0.12, gain: 0.35 }); },
  (ac) => { for (let i = 0; i < 5; i++) { burst(ac, { f: 2600, q: 1.1, dur: 0.08, gain: 0.22, at: i * 0.5 }); burst(ac, { f: 600, q: 1, dur: 0.05, gain: 0.15, at: i * 0.5 }); } },
  (ac) => { tone(ac, { f: 55, type: 'sine', dur: 0.5, gain: 0.5, glide: 0.7 }); burst(ac, { f: 3200, type: 'highpass', dur: 0.05, gain: 0.3 }); [420, 615, 840].forEach((f, i) => tone(ac, { f, type: 'triangle', dur: 1.4 - i * 0.2, gain: 0.05 })); },
  (ac) => { for (let i = 0; i < 40; i++) burst(ac, { f: 5000 + Math.random() * 3000, q: 2, dur: 0.03, gain: 0.06 + Math.random() * 0.05, at: Math.random() * 2.2 }); },
];

function Board() {
  const stage = useRef(null), cv = useRef(null), clock = useRef(null), meters = useRef([]), pads = useRef([]);
  const S = useRef({ t: 1.12, ev: [], col: new Float32Array(H), lv: [0, 0, 0, 0], acc: 0 });
  const [sound, setSound] = useState(false);
  const soundRef = useRef(false);
  soundRef.current = sound;
  useEffect(() => hush, []);

  const fire = (i) => {
    S.current.ev.push({ k: i, age: 0, tick: true });
    const p = pads.current[i];
    p?.animate([{ transform: 'scale(.95)' }, { transform: 'scale(1)' }], { duration: 520, easing: 'cubic-bezier(.16,1,.3,1)' });
    p?.querySelector('.ot-ring')?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 900, easing: 'ease-out' });
    if (soundRef.current) { const ac = audio(); if (ac) SYNTH[i](ac); }
  };

  const paused = usePaused();
  const pausedRef = useRef(paused);
  pausedRef.current = paused;
  useLoop(stage, (_, dt, still0) => {
    const still = still0 || pausedRef.current;
    const c = cv.current, s = S.current;
    if (!c) return;
    const r = c.getBoundingClientRect();
    const W = Math.max(120, Math.min(640, Math.round(r.width / 2)));
    if (c.width !== W || c.height !== H) { c.width = W; c.height = H; }
    const g = c.getContext('2d');
    if (still) { // one still frame: each prop once, side by side
      const img = g.createImageData(W, H);
      for (let x = 0; x < W; x++) for (let yy = 0; yy < H; yy++) {
        const k = Math.floor((x / W) * 4), age = ((x / W) * 4 - k) * 1.5, y = 1 - yy / H;
        const v = Math.min(1, 0.05 + SOUND[k](y, age, Math.random())), o = (yy * W + x) * 4, L = Math.floor(v * 255) * 3;
        img.data[o] = LUT[L]; img.data[o + 1] = LUT[L + 1]; img.data[o + 2] = LUT[L + 2]; img.data[o + 3] = 255;
      }
      g.putImageData(img, 0, 0);
      return;
    }
    const prev = s.t;
    s.t = (s.t + dt) % LOOP;
    PROPS.forEach((p, i) => { if ((prev < p[4] && s.t >= p[4]) || (s.t < prev && p[4] < s.t)) fire(i); });
    if (clock.current) { const sec = Math.floor(s.t), cs = Math.floor((s.t % 1) * 100); clock.current.textContent = `00:0${sec}.${String(cs).padStart(2, '0')}`; }
    // 120 columns a second
    s.acc += dt * 120;
    const n = Math.min(8, Math.floor(s.acc));
    s.acc -= n;
    for (let j = 0; j < n; j++) {
      s.ev.forEach((e) => { e.age += 1 / 120; });
      s.ev = s.ev.filter((e) => e.age < 2.6);
      g.drawImage(c, -1, 0);
      const col = g.createImageData(1, H), d = col.data;
      let mark = false;
      for (let yy = 0; yy < H; yy++) {
        const y = 1 - yy / H;
        let v = 0.04 + Math.random() * 0.05 + (y < 0.08 ? 0.12 : 0);
        for (const e of s.ev) v += SOUND[e.k](y, e.age, Math.random());
        v = Math.min(1, v);
        s.col[yy] = v;
        const L = Math.floor(v * 255) * 3, o = yy * 4;
        d[o] = LUT[L]; d[o + 1] = LUT[L + 1]; d[o + 2] = LUT[L + 2]; d[o + 3] = 255;
      }
      for (const e of s.ev) if (e.tick) { e.tick = false; mark = true; }
      if (mark) for (let yy = 0; yy < 5; yy++) { const o = yy * 4; d[o] = d[o + 1] = d[o + 2] = 255; }
      g.putImageData(col, W - 1, 0);
    }
    // the bus: four bands of the newest column, smoothed
    const band = (a, b) => { let m = 0; for (let yy = Math.floor((1 - b) * H); yy < Math.floor((1 - a) * H); yy++) m += s.col[yy]; return m / Math.max(1, (b - a) * H); };
    const want = [band(0.3, 0.7), band(0, 1), band(0, 0.15), band(0.75, 1)];
    want.forEach((w, i) => {
      s.lv[i] += (Math.min(1, w * 1.8) - s.lv[i]) * Math.min(1, dt * (w > s.lv[i] ? 30 : 6));
      const m = meters.current[i];
      if (m) m.style.transform = `scaleX(${0.04 + s.lv[i] * 0.96})`;
    });
  });

  return (
    <div className="ot-board" ref={stage}>
      <div className="ot-head">
        <p className="mb-mono">48 kHz / 24-BIT FLAC</p>
        <p className="mb-mono ot-k">TRANSIENT PERCUSSION</p>
        <p className="ot-clock mb-tnum" ref={clock}>00:01.12</p>
        <p className="mb-mono">CONTACT SYNC: 0.00ms</p>
        <button type="button" className="mb-chip ot-sound" aria-pressed={sound} onClick={() => { if (sound) hush(); else audio(); setSound(!sound); }}>{sound ? 'Sound on' : 'Sound off'}</button>
      </div>
      <div className="ot-main">
        <div className="ot-props">
          <p className="mb-mono ot-props-h">Soundstage Props &amp; Kinematics (Trigger to Sync)</p>
          <ul>
            {PROPS.map(([e, n, db, tc], i) => (
              <li key={n}>
                <button type="button" className="ot-pad" ref={(el) => (pads.current[i] = el)} onClick={() => fire(i)} aria-label={'Fire ' + n}>
                  <i className="ot-ring" aria-hidden="true" />
                  <span className="ot-emo">{e}</span>
                  <span className="ot-pad-n">{n}</span>
                  <span className="ot-pad-m mb-tnum">{db} · {tc}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="ot-spec">
          <canvas ref={cv} aria-label="Frequency spectrum, scrolling as each prop sounds" role="img" />
          <p className="ot-spec-t mb-mono">FREQUENCY SPECTRUM · Birch Mallets on Resonant Mahogany Stage Pit</p>
          <p className="ot-spec-b mb-mono">DOLBY ATMOS · 96kHz / 32-BIT</p>
          <i className="ot-now" aria-hidden="true" />
        </div>
      </div>
      <div className="ot-bus">
        <div className="ot-bus-h"><p className="mb-mono">DAW multi-channel bus</p><p className="mb-mono">PEAK: -1.2 dBFS · LUFS: -16.4</p></div>
        <ul>
          {BUS.map(([n, v], i) => (
            <li key={n}>
              <span className="ot-ch">{n}</span>
              <span className="ot-meter"><i ref={(el) => (meters.current[i] = el)} /><b style={{ left: v + '%' }} /></span>
              <span className="ot-v mb-tnum">{v}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// the film closes into a waveform: a band whose edges follow a sound's envelope. It closes as one band (its top edge
// comes down from above the screen, its bottom edge up from below), so every frame between reads as sound.
const WAVE = (t, W, H, wide) => {
  const n = 30, x0 = wide ? W * 0.47 : W * 0.05, x1 = wide ? W * 0.96 : W * 0.95, cy = wide ? H * 0.5 : H * 0.25, A = wide ? H * 0.38 : H * 0.18;
  const amp = (k) => { const u = k / (n - 1); const env = Math.pow(Math.sin(Math.PI * u), 0.55); return A * (0.12 + 0.88 * env * Math.abs(0.55 * Math.sin(u * 19.3) + 0.3 * Math.sin(u * 41.7 + 1.2) + 0.28 * Math.sin(u * 7.1 + 0.4))); };
  const M = Math.max(W, H) * 0.3, pt = (k, sgn) => {
    const u = k / (n - 1), x = lerp(-M + u * (W + 2 * M), x0 + u * (x1 - x0), t), y = lerp(sgn < 0 ? -M : H + M, cy + sgn * amp(k), t);
    return `${x.toFixed(1)}px ${y.toFixed(1)}px`;
  };
  const top = Array.from({ length: n }, (_, k) => pt(k, -1)), bot = Array.from({ length: n }, (_, k) => pt(n - 1 - k, 1));
  return `polygon(${[...top, ...bot].join(',')})`;
};

export default function Oto() {
  return (
    <Creative
      slug="oto"
      subject={[0.5, 0.55]}
      shape={WAVE}
      aim={(W, H, wide) => (wide ? null : focus(0.5, 0.55, W / 2, H * 0.25, 1.2, [W * 0.05, H * 0.07, W * 0.95, H * 0.43])(W, H))}
      headClass="ot-v2"
      first="demo"
      demo={
        <Scene slug="oto" dark className="ot-scene">
          <div className="ot-top">
            <figure className="ot-cam">
              <Film src={film('oto', 'webm')} poster={film('oto', 'webp')} w={1200} h={1500} />
              <figcaption className="mb-mono mb-live">LIVE SOUNDSTAGE PIT · CAM 01</figcaption>
            </figure>
          </div>
          <Studio slug="oto" className="ot-studio" engine="Hanzo Oto-1 Neural Foley Engine" specs={[['Synchronous Foley', 'Impacts & Steps', 'Sample-Accurate'], ['Environmental Ambience', 'Spatial Reverb', 'B-format Ambisonics'], ['Master Output', 'Lossless FLAC', '96kHz / 24-bit']]}>
            <Board />
          </Studio>
        </Scene>
      }
    />
  );
}
