'use client';
/* Shared engine for the model demos: a frame loop that runs only while its element is on screen and the tab is
   visible (reduced motion draws one final frame instead), a seeded random source (server and browser agree), a canvas
   sizer, and a lazily opened audio context (browsers allow sound only after a press). */
import { useEffect, useRef } from 'react';
import type { KeyboardEvent, RefObject } from 'react';

export function useLoop(ref: RefObject<Element | null>, frame: (t: number, dt: number, still: boolean) => void, deps: unknown[] = []) {
  const fn = useRef(frame);
  fn.current = frame;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { // one final frame, redrawn on resize
      const ro = new ResizeObserver(() => fn.current(Infinity, 0, true));
      ro.observe(el);
      return () => ro.disconnect();
    }
    let raf = 0, on = false, vis = false, last = 0, t = 0;
    const tick = (now: number) => { const dt = Math.min(0.05, (now - last) / 1000 || 0); last = now; t += dt; fn.current(t, dt, false); raf = requestAnimationFrame(tick); };
    const sync = () => {
      const go = vis && !document.hidden;
      if (go && !on) { on = true; last = performance.now(); raf = requestAnimationFrame(tick); }
      else if (!go && on) { on = false; cancelAnimationFrame(raf); }
    };
    const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; sync(); }, { rootMargin: '60px' });
    io.observe(el);
    document.addEventListener('visibilitychange', sync);
    return () => { io.disconnect(); document.removeEventListener('visibilitychange', sync); cancelAnimationFrame(raf); };
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
  // reduced motion: repaint the final frame whenever a control changes state
  useEffect(() => { if (ref.current && matchMedia('(prefers-reduced-motion: reduce)').matches) fn.current(Infinity, 0, true); });
}

// films inside root play only while on screen; reduced motion keeps them still on their poster. [data-own] films run themselves.
export function useFilms(root: RefObject<Element | null>) {
  useEffect(() => {
    const vids = [...(root.current?.querySelectorAll<HTMLVideoElement>('video[autoplay]:not([data-own])') || [])];
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { vids.forEach((v) => { v.autoplay = false; v.pause(); }); return; }
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) (e.target as HTMLVideoElement).play().catch(() => {}); else (e.target as HTMLVideoElement).pause(); }));
    vids.forEach((v) => io.observe(v));
    return () => io.disconnect();
  }, [root]);
}

// arrow keys move through a group of radios or tabs (and choose, as a click would)
export function arrows(e: KeyboardEvent<HTMLElement>) {
  const dir: Record<string, number | undefined> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
  const k = dir[e.key];
  if (!k) return;
  const items = [...e.currentTarget.querySelectorAll<HTMLElement>('[role=radio],[role=tab]')];
  const i = items.findIndex((el) => el === document.activeElement);
  if (i < 0) return;
  e.preventDefault();
  const n = items[(i + k + items.length) % items.length];
  n.focus(); n.click();
}

export const rng = (a: number) => (): number => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

// size a canvas's backing store to its CSS box (device pixels, capped) and report the size
export function fit(cv: HTMLCanvasElement, cap = 2) {
  const r = cv.getBoundingClientRect();
  const d = Math.min(cap, window.devicePixelRatio || 1);
  const w = Math.max(1, Math.round(r.width * d)), h = Math.max(1, Math.round(r.height * d));
  if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
  return { w, h, d };
}

let AC: AudioContext | null = null;
export const hush = () => { if (AC && AC.state === 'running') AC.suspend(); };
export const audio = () => {
  if (!AC) { const C = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext; if (!C) return null; AC = new C(); }
  if (AC.state === 'suspended') AC.resume();
  return AC;
};
// a filtered noise burst: Foley impacts, steps, rain, percussion
export function burst(ac: AudioContext, { f = 800, q = 1, dur = 0.2, gain = 0.3, type = 'bandpass', at = 0 }: { f?: number; q?: number; dur?: number; gain?: number; type?: BiquadFilterType; at?: number }) {
  const n = Math.max(1, Math.floor(ac.sampleRate * dur));
  const buf = ac.createBuffer(1, n, ac.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 3);
  const s = ac.createBufferSource(), fl = ac.createBiquadFilter(), g = ac.createGain();
  s.buffer = buf; fl.type = type; fl.frequency.value = f; fl.Q.value = q; g.gain.value = gain;
  s.connect(fl).connect(g).connect(ac.destination);
  s.start(ac.currentTime + at);
}
// a shaped tone: notes, rings, sub drops
export function tone(ac: AudioContext, { f = 220, type = 'triangle', dur = 0.4, gain = 0.12, attack = 0.01, at = 0, glide = 0 }: { f?: number; type?: OscillatorType; dur?: number; gain?: number; attack?: number; at?: number; glide?: number }) {
  const t = ac.currentTime + at, o = ac.createOscillator(), g = ac.createGain();
  o.type = type; o.frequency.setValueAtTime(f, t);
  if (glide) o.frequency.exponentialRampToValueAtTime(Math.max(20, f * glide), t + dur);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(gain, t + attack); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(ac.destination); o.start(t); o.stop(t + dur + 0.05);
}
