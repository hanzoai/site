'use client';
/* Hanzo Design. Signature: one conversation, every artifact. A single upload (Hanzo's own neon-horizon-master.mp3)
   sits in the chat while the workspace window beside it morphs, tab by tab, into a music app, a deck, an ad suite,
   a poster, a document and a video, all of the same track. The headline's own words are the tabs: the highlight
   glides from "visuals" to "decks" as the window changes shape. The music app is live: its spectrum dances to
   124 BPM and the four synth pads play. Further down, the six creative models sit on a dark canvas as nodes you
   open into their pages. Beyond: "One brief" - write your own brief once, choose the artifacts you want, and the set
   that one conversation hands back is laid out with each one's format and the model behind it. Nothing is sent; the
   brief is yours, every other word is Hanzo's. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { EASE, Copy, Mark, useTilt } from '../ui';
import { A, Go, More, SecHead } from '../kit';
import { useOpener } from '../Opener';
import './DesignPage.css';

// the kit's Tick, drawn still: this page's motion budget goes to its signature
const Check = ({ size = 22 }) => <svg className="x-tick" viewBox="0 0 24 24" width={size} height={size} aria-hidden="true"><circle cx="12" cy="12" r="10.5" fill="none" strokeWidth="1.5" /><path d="M7.5 12.5l3 3 6-6.5" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;

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
      <svg className="dsn-wave" viewBox="0 0 400 100" preserveAspectRatio="none" aria-hidden="true">
        <path ref={wave} d={'M0 50 L400 50'} fill="none" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <div className={'dsn-spec' + (mode === 2 ? ' radial' : '')} aria-hidden="true">
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
    <div className="dsn-app">
      <div className="dsn-app-top">
        <div>
          <h3>Neon Horizon Player</h3>
          <p>Interactive HTML5 WebAudio + Canvas app with real-time 60fps FFT spectrum, waveform scrubber, 3-band EQ, and 4 playable synth pads.</p>
        </div>
      </div>
      <div className="dsn-player">
        <div className="dsn-track">
          <span className="dsn-disc" aria-hidden="true"><img src="/models/uta.webp" alt="" /></span>
          <span>
            <b>Neon Horizon (Master Stem)</b>
            <span className="dsn-mono">124 BPM · F# Minor · WebAudio 60fps FFT Visualizer</span>
          </span>
        </div>
        <div className="dsn-viz">
          <Spectrum mode={mode} live={live} energy={energy} />
          <div className="dsn-modes" role="tablist" aria-label="Visualizer">
            {MODES.map((m, i) => (
              <button key={m} type="button" role="tab" aria-selected={mode === i} onClick={() => setMode(i)}>{m}</button>
            ))}
          </div>
        </div>
        <div className="dsn-scrub" aria-hidden="true">
          {Array.from({ length: 64 }).map((_, i) => <i key={i} style={{ height: Math.round(18 + Math.abs(Math.sin(i * 0.9) * Math.cos(i * 0.31)) * 82) + '%' }} />)}
          <b className="dsn-head" />
        </div>
        <div className="dsn-pads">
          {PADS.map((p, i) => (
            <motion.button
              key={p}
              type="button"
              className={hit === i ? 'on' : ''}
              whileTap={{ scale: 0.94 }}
              onClick={() => { energy.current = 1; synth(i); setHit(i); setTimeout(() => setHit((h) => (h === i ? -1 : h)), 380); }}
            >{p}</motion.button>
          ))}
        </div>
        <p className="dsn-eq dsn-mono">LOW +2.5 dB · MID 0.0 dB · HIGH +1.8 dB</p>
      </div>
    </div>
  );
}

/* The other five artifacts, all made from the same track. */
function Deck({ live }) {
  const [s, setS] = useState(0);
  useEffect(() => {
    if (!live) return;
    const t = setInterval(() => setS((v) => (v + 1) % 4), 1300);
    return () => clearInterval(t);
  }, [live]);
  return (
    <div className="dsn-deck">
      <div className="dsn-slide">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div key={s} className={'dsn-slide-in v' + s} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.5, ease: EASE }}>
            <img src={['/models/uta.webp', '/models/oto.webp', '/models/koe.webp', '/models/iro.webp'][s]} alt="" />
            <span className="dsn-slide-t">Neon Horizon</span>
            <span className="dsn-mono">124 BPM · F# Minor</span>
          </motion.div>
        </AnimatePresence>
        <span className="dsn-count dsn-mono">{s + 1} / 4</span>
      </div>
      <div className="dsn-thumbs" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => <i key={i} className={i === s ? 'on' : ''} />)}
      </div>
    </div>
  );
}

function Ads() {
  return (
    <div className="dsn-ads">
      {[['9:16', 'story'], ['1:1', 'square'], ['16:9', 'banner']].map(([r, k], i) => (
        <motion.div key={k} className={'dsn-ad ' + k} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE, delay: 0.35 + i * 0.08 }}>
          <img src="/models/uta.webp" alt="" />
          <span className="dsn-ad-t">Neon Horizon</span>
          <span className="dsn-ad-cta" aria-hidden="true">▶</span>
          <span className="dsn-ad-r dsn-mono">{r}</span>
        </motion.div>
      ))}
    </div>
  );
}

function Poster() {
  return (
    <div className="dsn-poster">
      <img src="/models/iro.webp" alt="" />
      <span className="dsn-poster-t">Neon<br />Horizon</span>
      <span className="dsn-poster-m dsn-mono">124 BPM · F# Minor</span>
    </div>
  );
}

function Doc() {
  return (
    <div className="dsn-doc">
      <span className="dsn-mono dsn-doc-k">Neon Horizon (Master Stem)</span>
      <span className="dsn-doc-h">Neon Horizon</span>
      <span className="dsn-mono dsn-doc-m">124 BPM · F# Minor</span>
      <img src="/models/uta.webp" alt="" />
      {[92, 100, 96, 70, 100, 88, 54].map((w, i) => <motion.i key={i} style={{ width: w + '%' }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.7, ease: EASE, delay: 0.45 + i * 0.06 }} />)}
    </div>
  );
}

function Film({ live }) {
  const v = useRef(null);
  useEffect(() => { const el = v.current; if (!el) return; if (live) el.play().catch(() => {}); else el.pause(); }, [live]);
  return (
    <div className="dsn-film">
      <div className="dsn-film-v">
        <img src="/models/koma.webp" alt="" />
        <video ref={v} src="/models/koma.webm" muted loop playsInline preload="metadata" aria-hidden="true" />
      </div>
      <div className="dsn-tl" aria-hidden="true">
        {[34, 22, 28, 16].map((w, i) => <i key={i} style={{ flexGrow: w }} />)}
        <b className="dsn-head" />
      </div>
    </div>
  );
}

/* The workspace: one conversation on the left, the artifact on the right changing shape with the tab. */
function Workspace({ at, pick, live, mine }) {
  const art = [<MusicApp key="a" live={live && at === 0} />, <Deck key="d" live={live && at === 1} />, <Ads key="ad" />, <Poster key="p" />, <Doc key="doc" />, <Film key="f" live={live && at === 5} />][at];
  return (
    <div className="dsn-win">
      <div className="dsn-bar">
        <span className="dsn-dots" aria-hidden="true"><i /><i /><i /></span>
        <div className="dsn-tabs" role="tablist" aria-label="Artifacts">
          {TABS.map((t, i) => (
            <button key={t} type="button" role="tab" aria-selected={at === i} aria-controls="dsn-art" onClick={() => pick(i)}>
              {at === i && <motion.span layoutId="dsn-tab" className="dsn-tab-bg" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
              <span>{t}</span>
              {at === i && !mine && live && <i key={'p' + at} className="dsn-tab-time" aria-hidden="true" />}
            </button>
          ))}
        </div>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span key={at} className="dsn-badge dsn-mono" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3, ease: EASE }}>{BADGE[at]}</motion.span>
        </AnimatePresence>
      </div>
      <div className="dsn-body">
        <aside className="dsn-chat">
          <div className="dsn-drop"><span aria-hidden="true">＋</span>Drop audio, image, PDF, CSV or video</div>
          <div className="dsn-file">
            <span className="dsn-file-i" aria-hidden="true">♪</span>
            <span className="dsn-mono">neon-horizon-master.mp3 (4.8 MB)</span>
          </div>
          <p className="dsn-msg">Uploaded neon-horizon-master.mp3 — build a full interactive music player app with a 60fps FFT spectrum visualizer, 3-band EQ, and synth pads.</p>
          <ol className="dsn-made" aria-label="Artifacts in this conversation">
            {TABS.map((t, i) => (
              <li key={t} className={i === at ? 'on' : i < at || mine ? 'done' : ''}>
                <button type="button" onClick={() => pick(i)} tabIndex={-1}>
                  <i aria-hidden="true" />{t}
                </button>
              </li>
            ))}
          </ol>
        </aside>
        <div className="dsn-stage" id="dsn-art" role="tabpanel" aria-label={TABS[at]}>
          <motion.div layout className={'dsn-frame k-' + KIND[at]} style={{ borderRadius: 18 }} transition={{ layout: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } }}>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div key={at} className="dsn-art" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1, transition: { duration: 0.45, ease: EASE, delay: 0.4 } }} exit={{ opacity: 0, transition: { duration: 0.15 } }}>
                {art}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* Headline words that are also the tabs: the highlight follows the artifact on screen. */
const WORD_TAB = { visuals: 3, decks: 1, docs: 4, ads: 2, videos: 5, 'interactive apps': 0 };

function Word({ w, at, pick, after = '' }) {
  const k = WORD_TAB[w];
  return (
    <span className="dsn-ww">
      <span className={'dsn-w' + (at === k ? ' on' : '')} onClick={() => pick(k)}>
        {at === k && <motion.span layoutId="dsn-hl" className="dsn-hl" transition={{ type: 'spring', stiffness: 300, damping: 32 }} aria-hidden="true" />}
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
  return (
    <section className="dsn-hero" ref={box} aria-labelledby="dsn-h1">
      <div className="x-wrap">
        <motion.p className="x-kick" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>Hanzo Design · Creative AI Workspace</motion.p>
        <motion.h1 id="dsn-h1" className="dsn-h1" initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: 1.1, ease: EASE, delay: 0.05 }}>
          Create <Word w="visuals" after="," at={at} pick={pick} /> <Word w="decks" after="," at={at} pick={pick} /> <Word w="docs" after="," at={at} pick={pick} /> <Word w="ads" after="," at={at} pick={pick} /> <Word w="videos" at={at} pick={pick} /> &amp; <Word w="interactive apps" at={at} pick={pick} />
        </motion.h1>
        <div className="dsn-intro">
          <motion.p className="dsn-lede" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}>
            Your AI design studio inside Hanzo. Upload any file — a music track, product photo, PDF, or dataset — and turn it into visuals, presentations, documents, ads, videos, or a full-blown interactive music &amp; visualizer app.
          </motion.p>
          <motion.div className="dsn-acts" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.42 }}>
            <div className="dsn-btns">
              <Go to="/design" solid>Open Design</Go>
              <Go to="https://docs.hanzo.ai/docs/apps/design">Read the docs</Go>
            </div>
            <p className="dsn-studio">Need full multi-shot AI cinema &amp; camera rigs? <A to="https://studio.hanzo.ai">Open studio.hanzo.ai.</A></p>
          </motion.div>
        </div>
      </div>
      <motion.div className="x-wrap dsn-win-wrap" initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: EASE, delay: 0.35 }}>
        <Workspace at={at} pick={pick} live={live} mine={mine} />
      </motion.div>
      <div className="x-wrap">
        <ul className="dsn-facts">
          {['Visuals, images, posters, presentations, documents, ads, video & music in tabs', 'Upload any file — even an MP3/WAV track to build a full interactive music player & visualizer app', 'Export vector PDFs, 16:9 slide decks, multi-aspect ads, MP4 clips, and standalone HTML5 apps'].map((t, i) => (
            <li key={t}><Check size={18} /><span>{t}</span></li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Paste() {
  const text = 'Read https://hanzo.ai/skill.md and use Hanzo Design in my project.';
  return (
    <section className="dsn-paste">
      <div className="x-wrap dsn-paste-in">
        <div className="dsn-paste-l">
          <p className="dsn-paste-k">Paste and ship</p>
          <p className="dsn-paste-d">Paste this into any agent. It reads the skill manifest and calls Design from there.</p>
        </div>
        <div className="dsn-prompt">
          <span className="dsn-prompt-k dsn-mono">Agent prompt</span>
          <code>{text}</code>
          <Copy text={text} />
        </div>
      </div>
    </section>
  );
}

/* Three steps, one line running through them: files in, artifacts out. */
const STEPS = [
  ['Upload any content', 'Drop in audio (.mp3, .wav, .flac), images, video clips, PDFs, Office docs, or CSV/JSON data. Every uploaded file is wired directly into the visuals, decks, and apps you create.'],
  ['Presentations, documents & ads', 'Generate 16:9 keynote slide decks, typeset brand & technical documents with vector PDF export, and multi-format social and display ad campaigns.'],
  ['Interactive music & visual apps', 'Upload a song or audio stem and build a full-blown interactive WebAudio music app with a 60fps FFT spectrum visualizer, waveform scrubber, 3-band EQ, and playable synth pads.'],
];

function Glyph({ i }) {
  if (i === 0) {
    return (
      <div className="dsn-g dsn-g-files" aria-hidden="true">
        {['.mp3', '.wav', '.flac', 'PDF', 'CSV', 'JSON'].map((f, k) => <span key={f} style={{ animationDelay: k * 0.7 + 's' }}>{f}</span>)}
        <b />
      </div>
    );
  }
  if (i === 1) {
    return (
      <div className="dsn-g dsn-g-shape" aria-hidden="true">
        <span className="deck"><b /><em /><em /></span>
        <span className="doc"><b /><em /><em /><em /><em /></span>
        <span className="ad"><b /><em /></span>
      </div>
    );
  }
  return <div className="dsn-g dsn-g-eq" aria-hidden="true">{Array.from({ length: 14 }).map((_, k) => <i key={k} style={{ animationDelay: -k * 0.13 + 's', animationDuration: 0.6 + (k % 4) * 0.17 + 's' }} />)}</div>;
}

function What() {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.35 });
  return (
    <section className="x-sec dsn-what" ref={ref}>
      <div className="x-wrap">
        <SecHead kicker="What is Hanzo Design" title="One conversation, every creative artifact in a tab" lede="Describe what you need or drop in your raw files. Hanzo Design creates and iterates on each artifact side-by-side in live tabs you can inspect, play, and export." />
        <div className="dsn-flow">
          <svg className="dsn-flow-line" viewBox="0 0 1000 4" preserveAspectRatio="none" aria-hidden="true">
            <motion.path d="M0 2H1000" strokeWidth="2" fill="none" initial={{ pathLength: 0 }} animate={seen ? { pathLength: 1 } : {}} transition={{ duration: 1.6, ease: EASE, delay: 0.2 }} />
          </svg>
          {STEPS.map(([t, d], i) => (
            <motion.article key={t} className="dsn-step" initial={{ opacity: 0, y: 30 }} animate={seen ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.9, ease: EASE, delay: 0.3 + i * 0.18 }}>
              <span className="dsn-step-n dsn-mono">{String(i + 1).padStart(2, '0')}</span>
              <Glyph i={i} />
              <h3>{t}</h3>
              <p>{d}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* What a creative team ships: each artifact drawn at its own shape, each one alive, its export named on hover. */
const CAPS = [
  ['Visuals, images & posters', 'High-resolution imagery, product photography, posters, and vector brand assets powered by Iro.', 'visual', 'Powered by Iro'],
  ['Slide decks & presentations', 'Structured 16:9 slide decks with keyboard navigation, speaker flow, and vector PDF download.', 'deck', '16:9 · vector PDF'],
  ['Documents & print-ready PDFs', 'Editorial reports, brand guidelines, and one-pagers with live preview and native PDF typesetting.', 'doc', 'Native PDF typesetting'],
  ['Ads & campaign kits', 'Social, story, and banner ads with matched art direction, headline lockups, and conversion CTAs.', 'ads', 'Social · story · banner'],
  ['Video & motion loops', 'Short product loops, animated promos, and motion graphics rendered with Koma and browser-native MP4 export.', 'video', 'Koma · MP4'],
  ['Music, voice & interactive apps', 'Original music (Uta), narration (Koe), sound effects (Oto), and self-contained interactive HTML5/Canvas/WebAudio apps.', 'music', 'Uta · Koe · Oto'],
];

function CapArt({ k }) {
  const v = useRef(null);
  useEffect(() => {
    if (k !== 'video' || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(([e]) => { const el = v.current; if (!el) return; if (e.isIntersecting) el.play().catch(() => {}); else el.pause(); }, { threshold: 0.3 });
    io.observe(v.current);
    return () => io.disconnect();
  }, [k]);
  if (k === 'visual') return <span className="dsn-ca dsn-ca-visual"><img src="/models/iro.webp" alt="" /></span>;
  if (k === 'deck') return <span className="dsn-ca dsn-ca-deck">{[0, 1, 2].map((i) => <i key={i}><img src={['/models/oto.webp', '/models/uta.webp', '/models/koe.webp'][i]} alt="" /></i>)}</span>;
  if (k === 'doc') return <span className="dsn-ca dsn-ca-doc"><i><b />{[90, 100, 84, 100, 62].map((w, j) => <em key={j} style={{ width: w + '%' }} />)}</i></span>;
  if (k === 'ads') return <span className="dsn-ca dsn-ca-ads">{['story', 'square', 'banner'].map((s) => <i key={s} className={s}><img src="/models/mori.webp" alt="" /></i>)}</span>;
  if (k === 'video') return <span className="dsn-ca dsn-ca-video"><img src="/models/koma.webp" alt="" /><video ref={v} src="/models/koma.webm" muted loop playsInline preload="none" aria-hidden="true" /><b /></span>;
  return <span className="dsn-ca dsn-ca-music">{Array.from({ length: 22 }).map((_, i) => <i key={i} style={{ animationDelay: -i * 0.11 + 's', animationDuration: 0.7 + (i % 5) * 0.13 + 's' }} />)}</span>;
}

function Cap({ c, i }) {
  const [t, d, k, tag] = c;
  const { rx, ry, glow, on } = useTilt(4, 'rgba(255,255,255,.35)');
  return (
    <div className={'dsn-cap c-' + k}>
      <motion.div className="dsn-cap-in" style={{ rotateX: rx, rotateY: ry }} {...on} tabIndex={0}>
        <CapArt k={k} />
        <motion.span className="x-mglow" style={{ background: glow }} aria-hidden="true" />
        <span className="dsn-cap-tag dsn-mono">{tag}</span>
        <h3>{t}</h3>
        <p>{d}</p>
      </motion.div>
    </div>
  );
}

function Caps() {
  return (
    <section className="x-sec dsn-caps">
      <div className="x-wrap">
        <SecHead kicker="Capabilities" title="Everything a creative team ships" />
        <div className="dsn-bento">{CAPS.map((c, i) => <Cap key={c[0]} c={c} i={i} />)}</div>
      </div>
    </section>
  );
}

/* The models as nodes on a canvas, wired to Design. Open one and its picture lifts into its own page. */
const NODES = [
  ['iro', 'Iro', 'Image generation and visual understanding.', 'Images', [16, 22]],
  ['koma', 'Koma', 'Video generation and world simulation.', 'Video', [50, 9]],
  ['oto', 'Oto', 'Sound generation and audio understanding.', 'Audio', [84, 22]],
  ['koe', 'Koe', 'Voice synthesis and speech understanding.', 'Voice', [16, 78]],
  ['uta', 'Uta', 'Music generation and composition.', 'Music', [50, 91]],
  ['mori', 'Mori', '3D generation and spatial understanding.', '3D', [84, 78]],
];

function Node({ n, i, hot, setHot }) {
  const [slug, name, desc, kind, [x, y]] = n;
  const opener = useOpener();
  const box = useRef(null);
  const vid = useRef(null);
  const play = (yes) => { const v = vid.current; if (!v || matchMedia('(prefers-reduced-motion: reduce)').matches) return; if (yes) v.play().catch(() => {}); else v.pause(); };
  return (
    <motion.li className={'dsn-node' + (hot === i ? ' hot' : '')} style={{ '--x': x + '%', '--y': y + '%', '--d': i * -1.3 + 's' }} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.8, ease: EASE, delay: 0.1 + i * 0.07 }}>
      <a
        href={'/' + slug}
        ref={box}
        className="dsn-node-a"
        onClick={(e) => opener.open(e, { el: box.current, src: `/models/${slug}.webp`, href: '/' + slug, key: slug })}
        onPointerEnter={() => { setHot(i); play(true); }}
        onPointerLeave={() => { setHot(-1); play(false); }}
        onFocus={() => setHot(i)}
        onBlur={() => setHot(-1)}
      >
        <span className="dsn-node-m">
          <img src={`/models/${slug}.webp`} alt="" />
          <video ref={vid} src={`/models/${slug}.webm`} muted loop playsInline preload="none" aria-hidden="true" />
        </span>
        <span className="dsn-node-t">
          <b>{name}</b>
          <span className="dsn-node-d">{desc}</span>
          <span className="dsn-node-k dsn-mono">{kind}</span>
        </span>
      </a>
    </motion.li>
  );
}

function Canvas() {
  const [hot, setHot] = useState(-1);
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.3 });
  return (
    <section className="x-sec dsn-dark" data-room="dark">
      <div className="x-wrap">
        <SecHead dark center title="Every creative model, in one studio." lede="Video, image, 3D, sound, voice and music, each a node on the canvas. Open one to see what it makes." />
        <div className="dsn-canvas" ref={ref}>
          <svg className="dsn-wires" viewBox="0 0 1200 660" preserveAspectRatio="none" aria-hidden="true">
            {NODES.map(([s, , , , [x, y]], i) => {
              const X = x * 12, Y = y * 6.6, my = (330 + Y) / 2;
              return <motion.path key={s} className={hot === i ? 'hot' : ''} d={`M600 330 C600 ${my}, ${X} ${my}, ${X} ${Y}`} initial={{ pathLength: 0 }} animate={seen ? { pathLength: 1 } : {}} transition={{ duration: 1.2, ease: EASE, delay: 0.2 + i * 0.08 }} />;
            })}
          </svg>
          <motion.div className="dsn-hub" initial={{ opacity: 0, scale: 0.7 }} animate={seen ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.9, ease: EASE }}>
            <Mark size={26} /><span>Hanzo Design</span>
          </motion.div>
          <ul className="dsn-nodes">{NODES.map((n, i) => <Node key={n[0]} n={n} i={i} hot={hot} setHot={setHot} />)}</ul>
        </div>
        <div className="x-row-links dsn-dark-links">
          <More to="/pricing">Explore model pricing</More>
          <More to="/models">View full model catalog</More>
        </div>
      </div>
    </section>
  );
}

function Start() {
  const { rx, ry, glow, on } = useTilt(5, 'rgba(0,0,0,.05)');
  return (
    <section className="x-sec dsn-start">
      <div className="x-wrap dsn-start-in">
        <div>
          <SecHead title="Start creating in Hanzo Design" lede="Open the Design workspace in your browser and upload your first file." />
          <div className="dsn-btns">
            <Go to="/design" solid>Open Design</Go>
            <Go to="https://studio.hanzo.ai">Open Hanzo Studio (Cinema)</Go>
          </div>
        </div>
        <div>
          <motion.div className="dsn-repo" style={{ rotateX: rx, rotateY: ry }} {...on}>
            <motion.span className="x-mglow" style={{ background: glow }} aria-hidden="true" />
            <span className="dsn-repo-mark"><Mark size={22} /></span>
            <h2>Get Design</h2>
            <p>Creative AI workspace for visuals, decks, documents, ads &amp; interactive apps</p>
            <dl className="dsn-mono">
              <div><dt>License:</dt><dd>Apache-2.0</dd></div>
            </dl>
            <div className="dsn-repo-acts">
              <A to="https://github.com/hanzoai" className="dsn-gh">
                <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M8 0a8 8 0 0 0-2.53 15.59c.4.07.55-.17.55-.38v-1.33c-2.23.48-2.7-1.07-2.7-1.07-.36-.92-.89-1.17-.89-1.17-.73-.5.06-.49.06-.49.8.06 1.23.83 1.23.83.72 1.23 1.88.87 2.34.67.07-.52.28-.87.5-1.07-1.78-.2-3.65-.89-3.65-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.66 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8 8 0 0 0 8 0Z" /></svg>
                hanzoai
              </A>
              <Go to="https://platform.hanzo.ai/deploy" solid>Deploy to Cloud</Go>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* One brief: the visitor's words become the title of every artifact Hanzo Design lists. */
function Brief() {
  const [brief, setBrief] = useState('');
  const [on, setOn] = useState(() => CAPS.map(() => true));
  const title = brief.trim() || 'Your brief';
  const picked = CAPS.filter((_, i) => on[i]);
  return (
    <section className="x-sec dsn-brief">
      <div className="x-wrap">
        <p className="x-kick">One conversation, every artifact</p>
        <h2 className="dsn-brief-h">One brief</h2>
        <input className="dsn-brief-in" value={brief} onChange={(e) => setBrief(e.target.value)} maxLength={80} placeholder="Your brief" aria-label="Your brief" />
        <div className="dsn-brief-pick" role="group" aria-label="Artifacts">
          {CAPS.map(([t], i) => <button key={t} type="button" aria-pressed={on[i]} onClick={() => setOn((v) => v.map((x, k) => (k === i ? !x : x)))}>{t}</button>)}
        </div>
        {picked.length ? (
          <ul className="dsn-brief-set" aria-live="polite">
            {picked.map(([t, , k, tag]) => (
              <li key={t} className={'k-' + k}>
                <span className="dsn-brief-k x-mono">{tag}</span>
                <b>{title}</b>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        ) : <p className="dsn-brief-none">Choose at least one artifact.</p>}
      </div>
    </section>
  );
}

export default function DesignPage() {
  return (
    <main className="dsn">
      <Hero />
      <Paste />
      <What />
      <Caps />
      <Brief />
      <Canvas />
      <Start />
    </main>
  );
}
