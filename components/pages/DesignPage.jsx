'use client';
// Signature: Editorial type runs into a live workspace window: one conversation, and its tab morphs on its own between music app, deck, ad suite, visual, document and video while the matching word of the headline lights up
// Beyond: One brief: write your own brief once, choose the artifacts you want, and the set one conversation hands back is laid out with each one's format and the model behind it
/* Hanzo Design, v2 (Archetype A, launch: the workspace is the product).
   V2: 8/10 editorial 5/7 hero, oversized type running into a workspace window whose artifact morphs by itself; three pinned chapters; the six capabilities as sticky stacked sheets; One brief kept as the Beyond; the models in the one dark room open into their pages
   Motion: signature = the workspace window (the frame morphs to each artifact's shape, the headline's word follows). Supporting:
   pinned chapters (components/v2/AppScenes), line-masked headline, sheets that stack as you scroll. Accent: magenta.
   The music app is live: its spectrum dances to 124 BPM and the four synth pads play. Every word is Hanzo's; the brief is yours. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { Copy, Mark, Magnetic } from '../ui';
import { A, Go, More } from '../kit';
import { useOpener } from '../Opener';
import Lines from '../v2/AppLines';
import Scenes from '../v2/AppScenes';
import '../v2/AppType.css';
import './DesignPage.css';

const EASE = [0.16, 1, 0.3, 1];
const TABS = ['Music App', 'Presentation', 'Ad Suite', 'Visual', 'Document', 'Video'];
const KIND = ['app', 'deck', 'ad', 'visual', 'doc', 'video'];
const BADGE = ['HTML5 app', '16:9 deck', 'Multi-aspect ads', 'Iro', 'Vector PDF', 'MP4'];
const PADS = ['Sub Bass', 'Warm Pad', 'Arp Pluck', 'Air Shimmer'];
const MODES = ['BARS', 'WAVE', 'RADIAL'];
const N = 40;
const DWELL = 5200;

/* A synth pad: one short note in F# minor, made in the browser. */
function useSynth() {
  const ctx = useRef(null);
  return (i) => {
    try {
      const C = ctx.current || (ctx.current = new (window.AudioContext || window.webkitAudioContext)());
      const t = C.currentTime, o = C.createOscillator(), g = C.createGain();
      o.type = ['sine', 'triangle', 'sawtooth', 'sine'][i];
      o.frequency.value = [46.25, 185, 554.37, 1479.98][i];
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(i === 2 ? 0.04 : 0.1, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + (i === 1 ? 1.4 : 0.8));
      o.connect(g).connect(C.destination);
      o.start(t); o.stop(t + 1.5);
    } catch { /* no audio on this device: the spectrum still answers the press */ }
  };
}

/* The spectrum: 40 bands moving to a 124 BPM pulse, written straight to the bars (no React state per frame). */
function Spectrum({ mode, live, energy }) {
  const bars = useRef([]);
  const wave = useRef(null);
  useEffect(() => {
    if (!live) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t) => {
      const s = (t - t0) / 1000;
      const beat = Math.pow(Math.max(0, Math.sin(s * Math.PI * (124 / 60))), 8);
      const e = energy.current; energy.current *= 0.93;
      const v = [];
      for (let i = 0; i < N; i++) {
        const f = i / N;
        const x = 0.18 + (1 - f) * 0.5 * beat + 0.14 * Math.sin(s * (2 + f * 5) + i) + 0.1 * Math.sin(s * 7.3 + i * 1.7) + e * (0.55 - Math.abs(f - 0.3) * 0.5);
        v.push(Math.min(1, Math.max(0.05, x)));
      }
      if (mode === 2) bars.current.forEach((b, i) => b && (b.style.transform = `rotate(${i * 9}deg) translateY(-34%) scaleY(${v[i]})`));
      else if (mode === 0) bars.current.forEach((b, i) => b && (b.style.transform = `scaleY(${v[i]})`));
      else if (wave.current) wave.current.setAttribute('d', 'M0 50 ' + v.map((y, i) => `L${(i / (N - 1)) * 400} ${50 + (i % 2 ? -1 : 1) * y * 44}`).join(' '));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mode, live, energy]);
  if (mode === 1) {
    return (
      <svg className="dz-wave" viewBox="0 0 400 100" preserveAspectRatio="none" aria-hidden="true">
        <path ref={wave} d="M0 50 L400 50" fill="none" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <div className={'dz-spec' + (mode === 2 ? ' radial' : '')} aria-hidden="true">
      {Array.from({ length: N }).map((_, i) => (
        <i key={i} ref={(el) => (bars.current[i] = el)} style={{ transform: mode === 2 ? `rotate(${i * 9}deg) translateY(-34%) scaleY(.3)` : `scaleY(${0.2 + ((i * 37) % 11) / 20})` }} />
      ))}
    </div>
  );
}

function MusicApp({ live }) {
  const [mode, setMode] = useState(0);
  const [hit, setHit] = useState(-1);
  const energy = useRef(0);
  const synth = useSynth();
  return (
    <div className="dz-app">
      <div className="dz-app-top">
        <span className="dz-disc" aria-hidden="true"><img src="/models/uta.webp" alt="" /></span>
        <div>
          <h3>Neon Horizon Player</h3>
          <p>Interactive HTML5 WebAudio + Canvas app with real-time 60fps FFT spectrum, waveform scrubber, 3-band EQ, and 4 playable synth pads.</p>
        </div>
      </div>
      <div className="dz-track">
        <b>Neon Horizon (Master Stem)</b>
        <span className="x-mono">124 BPM · F# Minor · WebAudio 60fps FFT Visualizer</span>
      </div>
      <div className="dz-viz">
        <Spectrum mode={mode} live={live} energy={energy} />
        <div className="dz-modes" role="tablist" aria-label="Visualizer">
          {MODES.map((m, i) => <button key={m} type="button" role="tab" aria-selected={mode === i} onClick={() => setMode(i)}>{m}</button>)}
        </div>
      </div>
      <div className="dz-pads">
        {PADS.map((p, i) => (
          <motion.button key={p} type="button" className={hit === i ? 'on' : ''} whileTap={{ scale: 0.94 }}
            onClick={() => { energy.current = 1; synth(i); setHit(i); setTimeout(() => setHit((h) => (h === i ? -1 : h)), 380); }}>{p}</motion.button>
        ))}
      </div>
      <p className="dz-eq x-mono">LOW +2.5 dB · MID 0.0 dB · HIGH +1.8 dB</p>
    </div>
  );
}

function Deck({ live }) {
  const [s, setS] = useState(0);
  useEffect(() => {
    if (!live) return;
    const t = setInterval(() => setS((v) => (v + 1) % 4), 1300);
    return () => clearInterval(t);
  }, [live]);
  return (
    <div className="dz-deck">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div key={s} className="dz-slide" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.5, ease: EASE }}>
          <img src={['/models/uta.webp', '/models/oto.webp', '/models/koe.webp', '/models/iro.webp'][s]} alt="" />
          <span className="dz-slide-t">Neon Horizon</span>
          <span className="dz-slide-m x-mono">124 BPM · F# Minor</span>
        </motion.div>
      </AnimatePresence>
      <span className="dz-count x-mono">{s + 1} / 4</span>
    </div>
  );
}

function Ads() {
  return (
    <div className="dz-ads">
      {[['9:16', 'story'], ['1:1', 'square'], ['16:9', 'banner']].map(([r, k], i) => (
        <motion.div key={k} className={'dz-ad ' + k} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE, delay: 0.35 + i * 0.08 }}>
          <img src="/models/uta.webp" alt="" />
          <span className="dz-ad-t">Neon Horizon</span>
          <span className="dz-ad-r x-mono">{r}</span>
        </motion.div>
      ))}
    </div>
  );
}

function Poster() {
  return (
    <div className="dz-poster">
      <img src="/models/iro.webp" alt="" />
      <span className="dz-poster-t">Neon<br />Horizon</span>
      <span className="dz-poster-m x-mono">124 BPM · F# Minor</span>
    </div>
  );
}

function Doc() {
  return (
    <div className="dz-doc">
      <span className="x-mono dz-doc-k">Neon Horizon (Master Stem)</span>
      <span className="dz-doc-h">Neon Horizon</span>
      <span className="x-mono dz-doc-m">124 BPM · F# Minor</span>
      <img src="/models/uta.webp" alt="" />
      {[92, 100, 96, 70, 100, 88, 54].map((w, i) => <motion.i key={i} style={{ width: w + '%' }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.7, ease: EASE, delay: 0.45 + i * 0.06 }} />)}
    </div>
  );
}

function Film({ live }) {
  const v = useRef(null);
  useEffect(() => { const el = v.current; if (!el) return; if (live) el.play().catch(() => {}); else el.pause(); }, [live]);
  return (
    <div className="dz-film">
      <div className="dz-film-v">
        <img src="/models/koma.webp" alt="" />
        <video ref={v} src="/models/koma.webm" muted loop playsInline preload="metadata" aria-hidden="true" />
      </div>
      <div className="dz-tl" aria-hidden="true">{[34, 22, 28, 16].map((w, i) => <i key={i} style={{ flexGrow: w }} />)}<b /></div>
    </div>
  );
}

/* ---------- the signature: one conversation, the artifact morphing in its window ---------- */
function Workspace({ at, pick, live, mine, calm }) {
  const art = [<MusicApp key="a" live={live && at === 0} />, <Deck key="d" live={live && at === 1} />, <Ads key="ad" />, <Poster key="p" />, <Doc key="doc" />, <Film key="f" live={live && at === 5} />][at];
  const key = (e, i) => {
    const n = { ArrowRight: 1, ArrowLeft: -1 }[e.key]; if (!n) return;
    const j = (i + n + TABS.length) % TABS.length; pick(j);
    e.currentTarget.parentElement.children[j]?.focus();
  };
  return (
    <div className="dz-win">
      <div className="dz-bar">
        <span className="dz-dots" aria-hidden="true"><i /><i /><i /></span>
        <div className="dz-tabs" role="tablist" aria-label="Artifacts">
          {TABS.map((t, i) => (
            <button key={t} type="button" role="tab" aria-selected={at === i} aria-controls="dz-art" tabIndex={at === i ? 0 : -1} onClick={() => pick(i)} onKeyDown={(e) => key(e, i)}>
              {at === i && <motion.span layoutId="dz-tab" className="dz-tab-bg" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}
              <span>{t}</span>
              {at === i && !mine && !calm && <i key={'p' + at} className={'dz-tab-t' + (live ? '' : ' paused')} aria-hidden="true" />}
            </button>
          ))}
        </div>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span key={at} className="dz-badge x-mono" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3, ease: EASE }}>{BADGE[at]}</motion.span>
        </AnimatePresence>
      </div>
      <div className="dz-stage" id="dz-art" role="tabpanel" aria-label={TABS[at]}>
        <motion.div layout className={'dz-frame k-' + KIND[at]} style={{ borderRadius: 16 }} transition={{ layout: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } }}>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div key={at} className="dz-art" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1, transition: { duration: 0.45, ease: EASE, delay: 0.4 } }} exit={{ opacity: 0, transition: { duration: 0.15 } }}>
              {art}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
      <div className="dz-chat">
        <div className="dz-file"><span className="dz-file-i" aria-hidden="true">♪</span><span className="x-mono">neon-horizon-master.mp3 (4.8 MB)</span></div>
        <p className="dz-msg">Uploaded neon-horizon-master.mp3 — build a full interactive music player app with a 60fps FFT spectrum visualizer, 3-band EQ, and synth pads.</p>
        <div className="dz-drop"><span aria-hidden="true">＋</span>Drop audio, image, PDF, CSV or video</div>
      </div>
    </div>
  );
}

/* Headline words that are also the tabs: the highlight follows the artifact on screen. */
function Word({ w, k, at, pick, after = '' }) {
  return (
    <span className="dz-ww">
      <span className={'dz-w' + (at === k ? ' on' : '')} onClick={() => pick(k)}>
        {at === k && <motion.span layoutId="dz-hl" className="dz-hl" transition={{ type: 'spring', stiffness: 300, damping: 30 }} aria-hidden="true" />}
        <span>{w}</span>
      </span>{after}
    </span>
  );
}

function Hero() {
  const [at, setAtS] = useState(0);
  const [mine, setMine] = useState(false);
  const calm = useReducedMotion();
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.3 });
  const live = seen && !calm;
  const pick = (i) => { setAtS(i); setMine(true); };
  useEffect(() => {
    if (mine || !live) return;
    const t = setTimeout(() => setAtS((v) => (v + 1) % TABS.length), DWELL);
    return () => clearTimeout(t);
  }, [at, mine, live]);
  const W = (w, k, after) => <Word w={w} k={k} at={at} pick={pick} after={after} />;
  return (
    <section className="dz-hero" ref={box} aria-labelledby="dz-h1">
      <div className="av-wrap dz-ed">
        <p className="av-kick dz-kick"><b>Hanzo Design</b> · Creative AI Workspace</p>
        <Lines as="h1" id="dz-h1" className="dz-h1" now delay={0.05}
          lines={[<>Create {W('visuals', 3, ',')} {W('decks', 1, ',')}</>, <>{W('docs', 4, ',')} {W('ads', 2, ',')}</>, <>{W('videos', 5)} &amp;</>, W(<>interactive<br />apps</>, 0)]} />
        <motion.div className="dz-win-wrap" initial={calm ? false : { clipPath: 'inset(8% 0 0 0 round 28px)', opacity: 0, y: 40 }} animate={{ clipPath: 'inset(0% 0 0 0 round 28px)', opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: EASE, delay: 0.3 }}>
          <Workspace at={at} pick={pick} live={live} mine={mine} calm={calm} />
        </motion.div>
        <div className="dz-under-l">
          <p className="av-lede">Your AI design studio inside Hanzo. Upload any file — a music track, product photo, PDF, or dataset — and turn it into visuals, presentations, documents, ads, videos, or a full-blown interactive music &amp; visualizer app.</p>
          <div className="av-acts">
            <Magnetic strength={0.25}><Go to="/design" solid>Open Design</Go></Magnetic>
            <i hidden data-thumb="Open Design" data-href="/design" />
            <Go to="https://docs.hanzo.ai/docs/apps/design">Read the docs</Go>
          </div>
          <p className="dz-studio">Need full multi-shot AI cinema &amp; camera rigs? <A to="https://studio.hanzo.ai">Open studio.hanzo.ai.</A></p>
        </div>
      </div>
      <div className="av-wrap av-grid dz-under">
        <ul className="dz-facts">
          {['Visuals, images, posters, presentations, documents, ads, video & music in tabs', 'Upload any file — even an MP3/WAV track to build a full interactive music player & visualizer app', 'Export vector PDFs, 16:9 slide decks, multi-aspect ads, MP4 clips, and standalone HTML5 apps'].map((t, i) => (
            <li key={t}><span className="x-mono av-num">{String(i + 1).padStart(2, '0')}</span>{t}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- what it is: three pinned chapters ---------- */
function Files({ on }) {
  return (
    <div className={'dz-vis dz-files' + (on ? ' on' : '')} aria-hidden="true">
      <div className="dz-files-in">{['.mp3', '.wav', '.flac', 'PDF', 'CSV', 'JSON'].map((f, k) => <span key={f} className="x-mono" style={{ '--k': k }}>{f}</span>)}</div>
      <div className="dz-slot"><span className="dz-file-i">♪</span><span className="x-mono">neon-horizon-master.mp3 (4.8 MB)</span></div>
    </div>
  );
}
function Shapes({ on }) {
  return (
    <div className={'dz-vis dz-shapes' + (on ? ' on' : '')} aria-hidden="true">
      <span className="deck"><img src="/models/oto.webp" alt="" /><em className="x-mono">16:9</em></span>
      <span className="doc"><b />{[90, 100, 84, 100, 62, 92, 70].map((w, j) => <i key={j} style={{ width: w + '%' }} />)}<em className="x-mono">PDF</em></span>
      <span className="ad"><img src="/models/mori.webp" alt="" /><em className="x-mono">9:16</em></span>
    </div>
  );
}
function Eq({ on }) {
  return (
    <div className={'dz-vis dz-eqv' + (on ? ' on' : '')} aria-hidden="true">
      <div className="dz-eq-bars">{Array.from({ length: 24 }).map((_, k) => <i key={k} style={{ animationDelay: -k * 0.13 + 's', animationDuration: 0.6 + (k % 4) * 0.17 + 's' }} />)}</div>
      <div className="dz-eq-pads">{PADS.map((p) => <span key={p}>{p}</span>)}</div>
    </div>
  );
}

const STEPS = [
  { title: 'Upload any content', body: <p className="av-body">Drop in audio (.mp3, .wav, .flac), images, video clips, PDFs, Office docs, or CSV/JSON data. Every uploaded file is wired directly into the visuals, decks, and apps you create.</p>, visual: (on) => <Files on={on} /> },
  { title: 'Presentations, documents & ads', body: <p className="av-body">Generate 16:9 keynote slide decks, typeset brand &amp; technical documents with vector PDF export, and multi-format social and display ad campaigns.</p>, visual: (on) => <Shapes on={on} /> },
  { title: 'Interactive music & visual apps', body: <p className="av-body">Upload a song or audio stem and build a full-blown interactive WebAudio music app with a 60fps FFT spectrum visualizer, waveform scrubber, 3-band EQ, and playable synth pads.</p>, visual: (on) => <Eq on={on} /> },
];

function What() {
  return (
    <>
      <section className="av-sec dz-what">
        <div className="av-wrap av-grid">
          <div className="dz-what-l">
            <p className="av-kick">What is Hanzo Design</p>
            <h2 className="av-display s">One conversation, every creative artifact in a tab</h2>
          </div>
          <p className="av-lede dz-what-r">Describe what you need or drop in your raw files. Hanzo Design creates and iterates on each artifact side-by-side in live tabs you can inspect, play, and export.</p>
        </div>
      </section>
      <Scenes label="What is Hanzo Design" items={STEPS} flip className="dz-sc" />
    </>
  );
}

/* ---------- capabilities: six sheets that stack as you scroll ---------- */
const CAPS = [
  ['Visuals, images & posters', 'High-resolution imagery, product photography, posters, and vector brand assets powered by Iro.', 'visual', 'Powered by Iro'],
  ['Slide decks & presentations', 'Structured 16:9 slide decks with keyboard navigation, speaker flow, and vector PDF download.', 'deck', '16:9 · vector PDF'],
  ['Documents & print-ready PDFs', 'Editorial reports, brand guidelines, and one-pagers with live preview and native PDF typesetting.', 'doc', 'Native PDF typesetting'],
  ['Ads & campaign kits', 'Social, story, and banner ads with matched art direction, headline lockups, and conversion CTAs.', 'ads', 'Social · story · banner'],
  ['Video & motion loops', 'Short product loops, animated promos, and motion graphics rendered with Koma and browser-native MP4 export.', 'video', 'Koma · MP4'],
  ['Music, voice & interactive apps', 'Original music (Uta), narration (Koe), sound effects (Oto), and self-contained interactive HTML5/Canvas/WebAudio apps.', 'music', 'Uta · Koe · Oto'],
];

function CapArt({ k }) {
  if (k === 'visual') return <span className="dz-ca dz-ca-visual"><img src="/models/iro.webp" alt="" /><b>Neon<br />Horizon</b></span>;
  if (k === 'deck') return <span className="dz-ca dz-ca-deck">{[0, 1, 2].map((i) => <i key={i}><img src={['/models/oto.webp', '/models/uta.webp', '/models/koe.webp'][i]} alt="" /></i>)}</span>;
  if (k === 'doc') return <span className="dz-ca dz-ca-doc">{[0, 1].map((p) => <i key={p}><b />{[90, 100, 84, 100, 62, 96, 74].map((w, j) => <em key={j} style={{ width: w + '%' }} />)}</i>)}</span>;
  if (k === 'ads') return <span className="dz-ca dz-ca-ads">{['story', 'square', 'banner'].map((s) => <i key={s} className={s}><img src="/models/mori.webp" alt="" /></i>)}</span>;
  if (k === 'video') return <span className="dz-ca dz-ca-video"><img src="/models/koma.webp" alt="" /><span className="dz-tl">{[34, 22, 28, 16].map((w, i) => <i key={i} style={{ flexGrow: w }} />)}<b /></span></span>;
  return <span className="dz-ca dz-ca-music">{Array.from({ length: 28 }).map((_, i) => <i key={i} style={{ animationDelay: -i * 0.11 + 's', animationDuration: 0.7 + (i % 5) * 0.13 + 's' }} />)}</span>;
}

function Caps() {
  return (
    <section className="av-sec dz-caps">
      <div className="av-wrap">
        <div className="av-grid dz-caps-top">
          <p className="av-kick dz-caps-k">Capabilities</p>
          <h2 className="av-head dz-caps-h">Everything a creative team ships</h2>
        </div>
        <ol className="dz-stack">
          {CAPS.map(([t, d, k, tag], i) => (
            <li key={t} className={'dz-sheet c-' + k} style={{ '--i': i }}>
              <div className="dz-sheet-t">
                <span className="x-mono dz-sheet-n av-num">{String(i + 1).padStart(2, '0')} / 06</span>
                <h3 className="av-head">{t}</h3>
                <p className="av-body">{d}</p>
                <span className="x-mono dz-sheet-tag">{tag}</span>
              </div>
              <div className="dz-sheet-a"><CapArt k={k} /></div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- Beyond: one brief, every artifact titled with it ---------- */
function Brief() {
  const [brief, setBrief] = useState('');
  const [on, setOn] = useState(() => CAPS.map(() => true));
  const title = brief.trim() || 'Your brief';
  const picked = CAPS.filter((_, i) => on[i]);
  return (
    <section className="av-sec dz-brief">
      <div className="av-wrap av-grid">
        <div className="dz-brief-l">
          <p className="av-kick"><b>One conversation, every artifact</b></p>
          <h2 className="av-display m">One brief</h2>
          <input className="dz-brief-in" value={brief} onChange={(e) => setBrief(e.target.value)} maxLength={80} placeholder="Your brief" aria-label="Your brief" />
          <div className="dz-brief-pick" role="group" aria-label="Artifacts">
            {CAPS.map(([t], i) => <button key={t} type="button" aria-pressed={on[i]} onClick={() => setOn((v) => v.map((x, k) => (k === i ? !x : x)))}>{t}</button>)}
          </div>
        </div>
        <div className="dz-brief-r">
          {picked.length ? (
            <ul className="dz-brief-set" aria-live="polite">
              {picked.map(([t, , k, tag]) => (
                <li key={t} className={'k-' + k}>
                  <span className="dz-brief-art" aria-hidden="true"><CapArt k={k} /></span>
                  <span className="dz-brief-k x-mono">{tag}</span>
                  <b>{title}</b>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          ) : <p className="dz-brief-none">Choose at least one artifact.</p>}
        </div>
      </div>
    </section>
  );
}

/* ---------- the dark room: every creative model; each opens into its page ---------- */
const NODES = [
  ['iro', 'Iro', 'Image generation and visual understanding.', 'Images'],
  ['koma', 'Koma', 'Video generation and world simulation.', 'Video'],
  ['oto', 'Oto', 'Sound generation and audio understanding.', 'Audio'],
  ['koe', 'Koe', 'Voice synthesis and speech understanding.', 'Voice'],
  ['uta', 'Uta', 'Music generation and composition.', 'Music'],
  ['mori', 'Mori', '3D generation and spatial understanding.', '3D'],
];

function Model({ n }) {
  const [slug, name, desc, kind] = n;
  const opener = useOpener();
  const box = useRef(null);
  const vid = useRef(null);
  const play = (yes) => { const v = vid.current; if (!v || matchMedia('(prefers-reduced-motion: reduce)').matches) return; if (yes) v.play().catch(() => {}); else v.pause(); };
  return (
    <li>
      <a href={'/' + slug} ref={box} className="dz-model" data-cursor="Open"
        onClick={(e) => opener.open(e, { el: box.current, src: `/models/${slug}.webp`, href: '/' + slug, key: slug })}
        onPointerEnter={() => play(true)} onPointerLeave={() => play(false)} onFocus={() => play(true)} onBlur={() => play(false)}>
        <span className="dz-model-m">
          <img src={`/models/${slug}.webp`} alt="" />
          <video ref={vid} src={`/models/${slug}.webm`} muted loop playsInline preload="none" aria-hidden="true" />
        </span>
        <span className="dz-model-t">
          <span className="dz-model-k x-mono">{kind}</span>
          <b>{name}</b>
          <span>{desc}</span>
        </span>
      </a>
    </li>
  );
}

function Studio() {
  return (
    <section className="av-sec av-dark dz-dark" data-room="dark">
      <div className="av-wrap av-grid">
        <div className="dz-dark-l">
          <span className="dz-hub"><Mark size={22} /><span>Hanzo Design</span></span>
          <h2 className="av-head">Every creative model, in one studio.</h2>
          <p className="av-body">Video, image, 3D, sound, voice and music, each a node on the canvas. Open one to see what it makes.</p>
          <div className="dz-dark-links">
            <More to="/pricing">Explore model pricing</More>
            <More to="/models">View full model catalog</More>
          </div>
        </div>
        <ul className="dz-models">{NODES.map((n) => <Model key={n[0]} n={n} />)}</ul>
      </div>
    </section>
  );
}

/* ---------- start ---------- */
const PASTE = 'Read https://hanzo.ai/skill.md and use Hanzo Design in my project.';

function Start() {
  return (
    <section className="av-sec dz-start">
      <div className="av-wrap">
        <div className="av-grid dz-start-g">
          <div className="dz-start-l">
            <h2 className="av-display m">Start creating in Hanzo Design</h2>
            <p className="av-lede">Open the Design workspace in your browser and upload your first file.</p>
            <div className="av-acts">
              <Go to="/design" solid>Open Design</Go>
              <Go to="https://studio.hanzo.ai">Open Hanzo Studio (Cinema)</Go>
            </div>
          </div>
          <div className="dz-repo">
            <span className="dz-repo-mark"><Mark size={22} /></span>
            <p className="av-title">Get Design</p>
            <p className="av-body">Creative AI workspace for visuals, decks, documents, ads &amp; interactive apps</p>
            <dl className="x-mono"><div><dt>License:</dt><dd>Apache-2.0</dd></div></dl>
            <div className="dz-repo-acts">
              <A to="https://github.com/hanzoai" className="dz-gh">
                <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M8 0a8 8 0 0 0-2.53 15.59c.4.07.55-.17.55-.38v-1.33c-2.23.48-2.7-1.07-2.7-1.07-.36-.92-.89-1.17-.89-1.17-.73-.5.06-.49.06-.49.8.06 1.23.83 1.23.83.72 1.23 1.88.87 2.34.67.07-.52.28-.87.5-1.07-1.78-.2-3.65-.89-3.65-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.66 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8 8 0 0 0 8 0Z" /></svg>
                hanzoai
              </A>
              <Go to="https://platform.hanzo.ai/deploy" solid>Deploy to Cloud</Go>
            </div>
          </div>
        </div>
        <div className="dz-paste">
          <div className="dz-paste-l">
            <p className="av-title">Paste and ship</p>
            <p className="av-body">Paste this into any agent. It reads the skill manifest and calls Design from there.</p>
          </div>
          <div className="dz-prompt">
            <span className="av-kick">Agent prompt</span>
            <code className="x-mono">{PASTE}</code>
            <Copy text={PASTE} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function DesignPage() {
  return (
    <main className="av dz" style={{ '--ac': '#ff2d78' }}>
      <Hero />
      <What />
      <Caps />
      <Brief />
      <Studio />
      <Start />
    </main>
  );
}
