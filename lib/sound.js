// Hanzo's sound kit (JAMES.md rule 10): six tiny sounds synthesized with Web Audio, so there are no audio files.
// Very quiet (master gain -24 dB), silent until the visitor's first click, tap or key, never more than one at a time,
// never while the tab is hidden, and off when the visitor mutes it (the header toggle; the choice is remembered).
// HOW TO USE (client code only):
//   import { play } from '../lib/sound';   play('done')   when your self-running demo finishes
//   or from anywhere: dispatchEvent(new CustomEvent('hz-sound', { detail: 'done' }))
//   or in markup: data-sound="tick" on a control (data-sound="" for silence).
// Wired for you already (components/Sound.jsx): a card opening into its page 'whoosh', pressing a solid ask 'tap',
// tabs/toggles/switches 'tick', Copy succeeding 'chime', ⌘K opening 'pop'. Never on hover, scroll or page load.
const KEY = 'hz-sound';
const DB = -24;
let ctx = null, master = null, noise = null, busyUntil = 0, woke = false;

export const isMuted = () => { try { return localStorage.getItem(KEY) === 'off'; } catch { return false; } };
export function setMuted(m) {
  try { localStorage.setItem(KEY, m ? 'off' : 'on'); } catch { /* private mode: the choice lasts this visit */ }
  if (typeof window !== 'undefined') dispatchEvent(new CustomEvent('hz-sound-mute', { detail: m }));
}

// the first real interaction opens the door; until then nothing can sound
if (typeof window !== 'undefined') {
  const wake = (e) => { if (e.isTrusted) woke = true; };
  addEventListener('pointerdown', wake, { capture: true, passive: true });
  addEventListener('keydown', wake, { capture: true, passive: true });
}

function audio() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = Math.pow(10, DB / 20);
    master.connect(ctx.destination);
    noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = noise.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

// small builders: an enveloped gain, a pitched voice, a filtered noise
const env = (c, t, peak, attack, release) => {
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + attack + release);
  g.connect(master);
  return g;
};
const voice = (c, t, type, f0, f1, glide, peak, attack, release) => {
  const o = c.createOscillator();
  o.type = type;
  o.frequency.setValueAtTime(f0, t);
  if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t + glide);
  o.connect(env(c, t, peak, attack, release));
  o.start(t); o.stop(t + attack + release + 0.02);
};

const SOUNDS = {
  // a card opening into its page: a soft breath of air that rises
  whoosh(c, t) {
    const s = c.createBufferSource(); s.buffer = noise;
    const f = c.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 1.1;
    f.frequency.setValueAtTime(320, t); f.frequency.exponentialRampToValueAtTime(2400, t + 0.34);
    s.connect(f); f.connect(env(c, t, 0.7, 0.09, 0.3));
    s.start(t); s.stop(t + 0.42);
    return 0.42;
  },
  // pressing the primary ask: a soft, low tap
  tap(c, t) { voice(c, t, 'sine', 880, 520, 0.06, 0.8, 0.004, 0.09); return 0.1; },
  // tabs, toggles and switches: a tiny tick
  tick(c, t) { voice(c, t, 'triangle', 2100, 2100, 0, 0.35, 0.002, 0.03); return 0.04; },
  // copy succeeded: two bright partials that ring out briefly
  chime(c, t) { voice(c, t, 'sine', 1046.5, 1046.5, 0, 0.55, 0.004, 0.42); voice(c, t + 0.05, 'sine', 1568, 1568, 0, 0.3, 0.004, 0.4); return 0.5; },
  // ⌘K opening: a soft upward pop
  pop(c, t) { voice(c, t, 'sine', 420, 840, 0.08, 0.7, 0.008, 0.12); return 0.14; },
  // a self-running demo finished: a faint two-note settle
  done(c, t) { voice(c, t, 'sine', 784, 784, 0, 0.4, 0.006, 0.6); voice(c, t + 0.08, 'sine', 1174.7, 1174.7, 0, 0.25, 0.006, 0.55); return 0.7; },
};

export function play(name) {
  if (typeof window === 'undefined' || !SOUNDS[name] || !woke || document.hidden || isMuted()) return;
  const now = performance.now();
  if (now < busyUntil) return; // never more than one sound at once
  const c = audio();
  if (!c) return;
  busyUntil = now + SOUNDS[name](c, c.currentTime + 0.005) * 1000;
}
