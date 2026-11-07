'use client';
/* Uta: compose beyond imagination. v2 launch page (Creative on Launch + Chapters, Hanzo's black and white). The film splits
   into four stems, faders of different heights, beside the headline.
   Signature: a piano roll that plays. Two bars in D minor at 96 BPM loop by themselves across Uta's four stems
   (timpani, low strings and tuba, horns and strings, choir and cello); the playhead lights each note as it sounds.
   Solo a stem, switch the composition preset (each one re-voices the same score), tap the roll to add or remove a
   melody note, and turn on Sound to hear it, synthesised in the browser. (An illustration, not Uta's output.)
   Beyond: "Take it to your DAW". Download MIDI writes the roll as you left it, your notes included, into a Standard
   MIDI File at the same 96 BPM, one channel per stem, so the sketch opens in any music app. Nothing leaves the page. */
import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { Film, Img, Cta, More, A } from '../../kit';
import { Magnetic } from '../../ui';
import ModelFilm from '../../v2/ModelFilm';
import { Studio } from './Studio';
import Creative, { Scene } from './Creative';
import { lerp, film, focus, Lines } from '../../v2/Launch';
import { useLoop, fit, audio, tone, burst, hush, arrows } from './live';
import { midi } from './Uta.midi.mjs';
import './Uta.css';

const ROWS = [74, 72, 70, 69, 67, 65, 64, 62, 57, 53, 50, 45, 38]; // D5 … D2, D minor
const R = (m) => ROWS.indexOf(m);
const TRACKS = [['Timpani & Concert Percussion', '88%'], ['Double Bass & Tuba Sub 40Hz', '76%'], ['French Horns & Symphonic Strings', '94%'], ['Chamber Choir & Solo Cello', '82%']];
const SCORE = [
  ...[[0, 50], [6, 45], [8, 50], [14, 45], [16, 50], [22, 45], [24, 50], [26, 50], [28, 50], [30, 50]].map(([s, m]) => [0, s, 1, R(m)]),
  ...[[0, 6, 38], [8, 6, 45], [16, 6, 38], [24, 4, 45], [28, 4, 38]].map(([s, l, m]) => [1, s, l, R(m)]),
  ...[[0, 62], [0, 65], [8, 62], [8, 67], [16, 57], [16, 64], [24, 57], [24, 65]].map(([s, m]) => [2, s, 8, R(m)]),
  ...[[0, 4, 69], [4, 4, 74], [8, 2, 72], [10, 2, 70], [12, 4, 69], [16, 4, 67], [20, 2, 69], [22, 2, 70], [24, 6, 69]].map(([s, l, m]) => [3, s, l, R(m)]),
];
const PRESETS = [
  ['Symphonic Orchestral', 'triangle', 0.05, 0.08],
  ['Cyberpunk Synthwave', 'sawtooth', 0.01, 0.035],
  ['Film Trailer Braam', 'square', 0.08, 0.03],
  ['Lo-Fi Ambient Chill', 'sine', 0.03, 0.09],
];
const STEPS = 32, STEP = 60 / 96 / 4; // a sixteenth at 96 BPM
const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);
const SHADE = ['#f5f5f7', '#8e8e93', '#5a5a5e', '#ffffff'];

function Roll() {
  const stage = useRef(null), cv = useRef(null), sec = useRef(null), cs = useRef(null), flow = useRef(null), lights = useRef([]);
  const S = useRef({ t: 0, step: -1, notes: SCORE.map((n) => [...n]), tc: 90.1 });
  const [pre, setPre] = useState(0);
  const [solo, setSolo] = useState(-1);
  const [sound, setSound] = useState(false);
  const [play, setPlay] = useState(true);
  const calm = useReducedMotion();
  useEffect(() => { if (calm) setPlay(false); }, [calm]); // reduced motion: the roll rests, and says so
  const live = useRef({});
  live.current = { pre, solo, sound };
  useEffect(() => hush, []);

  const voice = (n) => {
    const { pre: p, sound: on } = live.current;
    if (!on) return;
    const ac = audio();
    if (!ac) return;
    const [tr, , len, row] = n, m = ROWS[row], dur = len * STEP, P = PRESETS[p];
    if (tr === 0) { tone(ac, { f: hz(m), type: 'sine', dur: 0.45, gain: 0.35, glide: 0.75 }); burst(ac, { f: 260, type: 'lowpass', dur: 0.12, gain: 0.25 }); return; }
    tone(ac, { f: hz(p === 2 && tr === 1 ? m - 12 : m), type: tr === 1 && p !== 2 ? 'sine' : P[1], dur: dur * 0.95, gain: tr === 1 ? P[3] * 1.4 : P[3], attack: P[2] });
  };

  useLoop(stage, (_, dt, still) => {
    const c = cv.current, s = S.current, { solo: so, pre: p } = live.current;
    if (!c) return;
    if (!still && play) { s.t = (s.t + dt) % (STEPS * STEP); s.tc = s.tc + dt > 225 ? 0 : s.tc + dt; }
    const step = Math.floor(s.t / STEP);
    if (step !== s.step) {
      s.step = step;
      const on = [0, 0, 0, 0];
      s.notes.forEach((n) => { if (step >= n[1] && step < n[1] + n[2]) on[n[0]] = 1; if (n[1] === step && (so < 0 || so === n[0]) && !still && play) voice(n); });
      on.forEach((v, i) => { const el = lights.current[i]; if (el) el.dataset.on = v && (so < 0 || so === i) ? '1' : '0'; });
      if (sec.current) { sec.current.textContent = String(Math.floor(s.tc % 60)).padStart(2, '0'); cs.current.textContent = String(Math.floor((s.tc % 1) * 100)).padStart(2, '0'); }
    }
    if (flow.current) flow.current.style.transform = `scaleX(${s.t / (STEPS * STEP)})`;
    const { w, h, d } = fit(c);
    const g = c.getContext('2d'), cw = w / STEPS, rh = h / ROWS.length, x0 = (s.t / STEP) * cw;
    g.fillStyle = '#0a0a0a'; g.fillRect(0, 0, w, h);
    for (let r = 0; r < ROWS.length; r++) if ([70, 65, 57, 53, 45].includes(ROWS[r])) { g.fillStyle = '#111114'; g.fillRect(0, r * rh, w, rh); }
    for (let i = 0; i <= STEPS; i++) { g.fillStyle = i % 16 === 0 ? 'rgba(255,255,255,.22)' : i % 4 === 0 ? 'rgba(255,255,255,.1)' : 'rgba(255,255,255,.035)'; g.fillRect(i * cw, 0, d, h); }
    const rad = [3, 1, 6, 10][p] * d;
    s.notes.forEach(([tr, st, len, row]) => {
      const x = st * cw + d, y = row * rh + rh * 0.14, ww = len * cw - 2 * d, hh = rh * 0.72;
      const hot = step >= st && step < st + len && play;
      const dim = so >= 0 && so !== tr;
      g.globalAlpha = dim ? 0.18 : hot ? 1 : tr === 3 ? 0.9 : 0.7;
      g.fillStyle = hot ? '#ffffff' : SHADE[tr];
      g.beginPath(); g.roundRect(x, y - (hot ? d : 0), ww, hh + (hot ? 2 * d : 0), Math.min(rad, hh / 2)); g.fill();
      if (tr === 2 && !hot) { g.strokeStyle = '#8e8e93'; g.lineWidth = d; g.stroke(); }
    });
    g.globalAlpha = 1;
    g.fillStyle = '#f5f5f5'; g.fillRect(x0, 0, 2 * d, h);
  });

  const save = () => {
    const url = URL.createObjectURL(new Blob([midi(S.current.notes.map(([tr, st, len, row]) => [tr, st, len, ROWS[row]]), 96)], { type: 'audio/midi' }));
    const a = Object.assign(document.createElement('a'), { href: url, download: 'uta-sketch.mid' });
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const tap = (e) => {
    const r = cv.current.getBoundingClientRect();
    const st = Math.floor(((e.clientX - r.left) / r.width) * STEPS), row = Math.floor(((e.clientY - r.top) / r.height) * ROWS.length);
    const s = S.current, hit = s.notes.findIndex((n) => n[0] === 3 && n[3] === row && st >= n[1] && st < n[1] + n[2]);
    if (hit >= 0) s.notes.splice(hit, 1); else { const n = [3, Math.min(STEPS - 2, st), 2, row]; s.notes.push(n); const was = live.current.sound; if (was) voice(n); }
  };

  return (
    <div className="ut-board" ref={stage}>
      <div className="ut-pre">
        <p className="mb-mono">Composition Style Presets</p>
        <div className="mb-chips" role="radiogroup" aria-label="Composition style" onKeyDown={arrows}>
          {PRESETS.map(([n], i) => <button key={n} type="button" role="radio" aria-checked={pre === i} className="mb-chip" onClick={() => setPre(i)}>{n}</button>)}
        </div>
      </div>
      <div className="ut-status">
        <b className="mb-tnum">96 BPM</b><b>D MINOR</b>
        <span className="mb-mono mb-live ut-live" data-off={play ? undefined : ''} aria-hidden={play ? undefined : 'true'}>STREAMING ACTIVE</span>
        <span className="ut-tc mb-tnum"><span>01:</span><span ref={sec}>30</span>.<span ref={cs}>10</span> <span className="ut-of">/ 03:45.00</span></span>
        <button type="button" className="mb-chip" aria-pressed={play} onClick={() => setPlay(!play)}>{play ? 'Pause' : 'Play'}</button>
        <button type="button" className="mb-chip" onClick={save}>Download MIDI</button>
        <button type="button" className="mb-chip" aria-pressed={sound} onClick={() => { if (sound) hush(); else audio(); setSound(!sound); }}>{sound ? 'Sound on' : 'Sound off'}</button>
      </div>
      <div className="ut-main">
        <ul className="ut-tracks">
          {TRACKS.map(([n, v], i) => (
            <li key={n} ref={(el) => (lights.current[i] = el)} data-on="0">
              <span className="ut-tn">{n}</span>
              <span className="ut-lv"><i style={{ transform: `scaleX(${parseInt(v, 10) / 100})` }} /></span>
              <span className="ut-v mb-tnum">{v}</span>
              <button type="button" className="ut-solo" aria-label={'Solo ' + n} aria-pressed={solo === i} onClick={() => setSolo(solo === i ? -1 : i)}>SOLO</button>
            </li>
          ))}
        </ul>
        <div className="ut-roll">
          <canvas ref={cv} role="img" aria-label="Piano roll in D minor at 96 BPM; tap to add or remove a melody note" onPointerDown={tap} />
        </div>
      </div>
      <div className="ut-flow">
        <span className="mb-mono">TIMELINE FLOW:</span>
        <b>CHORUS [BAR 17-32]</b>
        <span className="ut-bar"><i ref={flow} /></span>
      </div>
      <div className="ut-cue">
        <figure className="ut-mon">
          <Film src={film('uta', 'webm')} poster={film('uta', 'webp')} w={1200} h={1500} />
          <figcaption><span className="mb-mono mb-live">PLAYING · 4K 60FPS</span><span className="mb-mono">CINEMA SCORE</span><span className="mb-mono">SURROUND 7.1.4</span></figcaption>
        </figure>
        <div className="ut-cue-t">
          <p className="ut-q">SCORE CUE: “Timpani crescendo into full orchestral tutti with soaring legato violins and brass choir.”</p>
          <p className="mb-mono">Live Philharmonic Hall Recording · Abbey Road Master</p>
          <p className="ut-eng">Hanzo Uta-1 generates full broadcast multi-stem compositions with synchronized video cue anchors and lossless stem isolation.</p>
        </div>
      </div>
    </div>
  );
}

// the film splits into Uta's four stems: four faders rising left to right from one floor
const STEMS = (t, W, H, wide) => {
  const x0 = wide ? W * 0.5 : W * 0.06, x1 = wide ? W * 0.94 : W * 0.94, B = wide ? H * 0.9 : H * 0.47, gap = wide ? 18 : 10;
  const tops = wide ? [0.5, 0.36, 0.22, 0.08] : [0.33, 0.26, 0.19, 0.13]; // a crescendo, rising with the film's fan of lines
  const bw = (x1 - x0 - 3 * gap) / 4, M = Math.max(W, H) * 0.5;
  const pts = [];
  tops.forEach((f, i) => {
    const a = x0 + i * (bw + gap), b = a + bw, a0 = (i * W) / 4, b0 = ((i + 1) * W) / 4, T = H * f;
    pts.push([lerp(a0, a, t), lerp(H + M, B, t)], [lerp(a0, a, t), lerp(-M, T, t)], [lerp(b0, b, t), lerp(-M, T, t)], [lerp(b0, b, t), lerp(H + M, B, t)]);
  });
  return `polygon(${pts.map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`).join(',')})`;
};

// each capability chapter gets its own picture of Uta's film: the whole fan (01), the film under a moving playhead
// with its cuts (02, cue scoring), the film split into four stems (03, stem separation), the film over a D-minor
// keyboard lighting the roll's scale (04, theory controls). No words of ours; all aria-hidden pictures.
const KEYS = [38, 45, 50, 53, 57, 62, 64, 65, 67, 69, 70, 72, 74];
function capArt(i, on, base) {
  return (
    <div className={'cr-art ut-art ut-art-' + i} style={base} data-on={on ? '' : undefined} aria-hidden="true">
      <Img src={film('uta', 'webp')} w={1200} h={1500} />
      <ModelFilm slug="uta" play={on} />
      {i === 1 && <span className="ut-cue-l"><i /><i /><i /><b /></span>}
      {i === 3 && <span className="ut-keys">{KEYS.map((m, k) => <i key={m} style={{ '--k': k }} />)}</span>}
    </div>
  );
}

// the closing band, page-local: the kit Band's words, its headline cut in by line mask (the kit Band's word reveal
// blurs, which MASTER part 9 bans); final with JS off. Its two links are 44px and alike.
function Close() {
  return (
    <section className="x-band ut-band" data-room="dark" aria-label="Uta">
      <div className="x-wrap">
        <Lines reveal lines={['Try Uta on your own work']} />
        <p>Samples of Uta&apos;s own output publish only after blind review, so the pictures here are illustrations. A studio can apply now to test it in its own pipeline.</p>
        <div className="x-band-act">
          <Magnetic><Cta to="/research-access?models=uta" id="uta.band" thumb>Request access</Cta></Magnetic>
          <p className="cr-band-note ut-band-note"><More to="/models">Every model</More><A to="/beta/research">Research preview</A></p>
        </div>
      </div>
    </section>
  );
}

// phone: the stage holds the film full-bleed with the name, lede and ask until the visitor scrolls (or 6 s pass),
// then settles into the stems, eased; desktop is untouched (its settle follows the scroll already)
function useHold() {
  useEffect(() => {
    const el = document.documentElement;
    if (innerWidth > 900 || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const pin = document.querySelector('.lv-stage[data-hero="uta"] .lv-pin');
    if (!pin) return;
    const { width: W, height: H } = pin.getBoundingClientRect();
    el.style.setProperty('--ut-hold', STEMS(0, W, H, false));
    el.dataset.utHold = '';
    const go = () => { delete el.dataset.utHold; removeEventListener('scroll', on); clearTimeout(t); };
    const on = () => { if (scrollY > 8) go(); };
    const t = setTimeout(go, 6000);
    addEventListener('scroll', on, { passive: true });
    return () => { go(); el.style.removeProperty('--ut-hold'); };
  }, []);
}

export default function Uta() {
  useHold();
  return (
    <Creative
      capArt={capArt}
      map={false}
      band={<Close />}
      slug="uta"
      shape={STEMS}
      pos="50% 88%"
      subject={[0.7, 0.66]}
      aim={(W, H, wide) => (wide ? focus(0.66, 0.66, W * 0.72, H * 0.55, 1.12, [W * 0.5, H * 0.08, W * 0.94, H * 0.9], [0.5, 0.88]) : focus(0.7, 0.66, W / 2, H * 0.3, 1.3, [W * 0.06, H * 0.06, W * 0.94, H * 0.47], [0.5, 0.88]))(W, H)}
      headClass="ut-v2"
      first="demo"
      demo={
        <Scene slug="uta" className="ut-scene">
          <Studio slug="uta" specs={[['Arrangement Span', 'Full Compositions', 'Up to 4 Minutes'], ['Stem Separation', 'Isolated Codebooks', '4 Master Stems'], ['Score Synchronization', 'Frame-Accurate', 'Zero Cue Drift']]}>
            <Roll />
          </Studio>
        </Scene>
      }
    />
  );
}
