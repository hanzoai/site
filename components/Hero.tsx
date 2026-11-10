'use client';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { EASE, Count, fine, copyText } from './ui';
import SetupMenu from './SetupMenu';
import { Desk, MORE, Phone, Term } from './home/Devices';
import { press } from '../lib/press';
import { capture, track } from '../lib/track';
import './home/demo.css';

const PROMPT = 'Build maxpower: every AI I use in one place, and faster at coding.';
const CMD = 'curl -fsSL https://hanzo.sh | sh';

/* The halftone field behind the hero: dense at the edges like Hanzo's, with an organic traveling wave and pointer lens swell. */
function Dots({ host }) {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current, cx = cv.getContext('2d'), el = host.current;
    const G = 10, R = 170;
    const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let W = 0, H = 0, cols = 0, rows = 0, raf = 0, px = -1e4, py = -1e4, energy = 0, vis = true, ink = '';
    const t0 = performance.now();
    // the dot colour is the page's ink (.x-dots { color: var(--ink) }) at 19%: it follows light and dark
    const tone = () => { const m = getComputedStyle(cv).color.match(/[\d.]+/g) || [10, 10, 10]; ink = `rgba(${m[0]},${m[1]},${m[2]},.19)`; };
    tone();
    const draw = (now = performance.now()) => {
      const t = calm ? 0 : (now - t0) * 0.001;
      cx.clearRect(0, 0, W, H);
      cx.fillStyle = ink;
      cx.beginPath();
      const gx1 = W * (0.18 + 0.07 * Math.sin(t * 0.52));
      const gy1 = H * (0.48 + 0.14 * Math.cos(t * 0.41));
      const gx2 = W * (0.82 + 0.07 * Math.cos(t * 0.47));
      const gy2 = H * (0.52 + 0.14 * Math.sin(t * 0.37));
      for (let j = 0; j < rows; j++) {
        const y = j * G;
        const ey = Math.min(1, 0.3 + (y / Math.max(1, H)) * 0.95);
        for (let i = 0; i < cols; i++) {
          const x = i * G;
          const ex = Math.max(1 - x / Math.max(1, W * 0.3), (x - W * 0.66) / Math.max(1, W * 0.34), 0.14);
          const w1 = Math.sin(x * 0.012 + y * 0.006 - t * 1.25);
          const w2 = Math.cos(y * 0.014 - x * 0.005 + t * 0.9);
          const w3 = Math.sin((x + y) * 0.007 + t * 0.65);
          const n = 0.56 + 0.44 * (w1 * w2 * 0.65 + w3 * 0.35);
          let f = Math.max(0, Math.min(1, ex * ey * n * 1.3));
          const d1 = Math.hypot(x - gx1, y - gy1);
          if (d1 < 240) { const k1 = 1 - d1 / 240; f = Math.min(1, f + k1 * k1 * 0.28); }
          const d2 = Math.hypot(x - gx2, y - gy2);
          if (d2 < 240) { const k2 = 1 - d2 / 240; f = Math.min(1, f + k2 * k2 * 0.28); }
          if (energy > 0.01) {
            const d = Math.hypot(x - px, y - py);
            if (d < R) { const k = 1 - d / R; f = Math.min(1.12, f + k * k * 0.85 * energy); }
          }
          if (f < 0.05) continue;
          const r = f * G * 0.4;
          cx.moveTo(x + r, y);
          cx.arc(x, y, r, 0, 6.2832);
        }
      }
      cx.fill();
    };
    const tick = (now) => {
      energy *= 0.93;
      draw(now);
      raf = !calm && vis ? requestAnimationFrame(tick) : 0;
    };
    const startLoop = () => {
      if (!raf && vis && !calm) raf = requestAnimationFrame(tick);
    };
    const size = () => {
      const r = el.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
      W = r.width; H = r.height;
      cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + 'px'; cv.style.height = H + 'px';
      cx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(W / G) + 1; rows = Math.ceil(H / G) + 1;
      draw(performance.now());
    };
    const move = (e) => {
      if (!fine(e)) return;
      const r = cv.getBoundingClientRect();
      px = e.clientX - r.left; py = e.clientY - r.top; energy = 1;
      if (calm) draw(performance.now());
      else startLoop();
    };
    size();
    startLoop();
    const io = new IntersectionObserver(([en]) => { vis = en.isIntersecting; if (vis) startLoop(); });
    io.observe(el);
    const ro = new ResizeObserver(size);
    ro.observe(el);
    el.addEventListener('pointermove', move);
    // the theme can change while the page is open (the device setting): redraw in the new ink
    const mo = new MutationObserver(() => { tone(); draw(performance.now()); });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => { io.disconnect(); ro.disconnect(); mo.disconnect(); el.removeEventListener('pointermove', move); cancelAnimationFrame(raf); };
  }, [host]);
  return <canvas ref={ref} className="x-dots" aria-hidden="true" />;
}


export default function Hero() {
  const host = useRef(null);
  const fit = useRef(null);
  const calm = useReducedMotion();
  const inView = useInView(host, { amount: 0.2 });
  const live = useRef(true);
  live.current = inView;
  // the terminal's Copy copies exactly the command it shows, and says so
  const [copied, setCopied] = useState(false);
  const copyT = useRef(0);
  const copy = async () => { if (!(await copyText(CMD))) return; capture('home_copied', { block: 'hero', command: CMD }); setCopied(true); clearTimeout(copyT.current); copyT.current = setTimeout(() => setCopied(false), 1600); };

  // the landing is counted once, when the hero is first drawn; a press on Download App is read where the page transition reads it
  useEffect(() => { capture('home_viewed'); }, []);
  useEffect(() => press('.x-phone-dl', () => track('hero_demo', { control: 'phone-download' })), []);

  const [typed, setTypedState] = useState(0);
  const promptEl = useRef(null);
  const cmdEl = useRef(null);
  const setTyped = (i) => { if (promptEl.current) promptEl.current.textContent = PROMPT.slice(0, i); if (i === 0 || i === PROMPT.length) setTypedState(i); };
  const [cmdDone, setCmdDone] = useState(false);
  const setCmd = (i) => { if (cmdEl.current) cmdEl.current.textContent = CMD.slice(0, i); if (i === CMD.length) setCmdDone(true); };
  const [phase, setPhase] = useState(0);
  // after the opening, the rest of Hanzo's day plays: one scene every 6.5 s
  const [sc, setSc] = useState(-1);
  const [navPick, setNavPick] = useState(null);
  const [side, setSide] = useState(true);
  const manualRef = useRef(false);
  const holdUntilRef = useRef(0);

  const selectScene = (nextSc, navId = null) => {
    manualRef.current = true;
    holdUntilRef.current = Date.now() + 12000;
    setTyped(PROMPT.length);
    setCmd(CMD.length);
    setPhase(4);
    setSc(nextSc);
    setNavPick(navId);
  };

  useEffect(() => {
    if (calm || phase < 4) return;
    const t = setInterval(() => {
      if (!live.current || Date.now() < holdUntilRef.current) return;
      setNavPick(null);
      setSc((n) => (n + 1) % MORE.length);
    }, 6500);
    return () => clearInterval(t);
  }, [calm, phase >= 4]); // eslint-disable-line react-hooks/exhaustive-deps

  // the demo: the prompt types itself, sends, the app answers, then the day's scenes play
  useEffect(() => {
    if (calm) { setTyped(PROMPT.length); setCmd(CMD.length); setPhase(4); return; }
    let dead = false;
    const stop = () => dead || manualRef.current;
    const nap = (ms) => new Promise((r) => setTimeout(r, ms));
    const held = async () => { while (!stop() && !live.current) await nap(400); };
    (async () => {
      await nap(1100);
      (async () => { for (let i = 0; i <= CMD.length && !stop(); i++) { setCmd(i); await nap(i < 4 ? 90 : 36); } })();
      while (!stop()) {
        await held(); if (stop()) return;
        setPhase(0); setTyped(0); setSc(-1);
        for (let i = 0; i <= PROMPT.length && !stop(); i++) { setTyped(i); await nap(PROMPT[i] === ' ' ? 55 : 26); }
        await nap(500); if (stop()) return;
        setPhase(1);
        await nap(900); if (stop()) return;
        setPhase(2);
        await nap(2000); if (stop()) return;
        setPhase(3);
        await nap(1900); if (stop()) return;
        setPhase(4);
        await nap(9000 + MORE.length * 6500);
      }
    })();
    return () => { dead = true; };
  }, [calm]);

  // the stage is drawn at a fixed size and scaled to fit its column
  const [k, setK] = useState(1);
  useLayoutEffect(() => {
    const el = fit.current;
    const ro = new ResizeObserver(() => {
      const sw = parseFloat(getComputedStyle(el).getPropertyValue('--sw')) || 720;
      setK(Math.min(1.15, el.clientWidth / sw));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // pointer: the three devices turn toward it, each at its own depth
  const rx = useSpring(0, { stiffness: 90, damping: 18 });
  const ry = useSpring(0, { stiffness: 90, damping: 18 });
  const onMove = (e) => {
    if (!fine(e)) return;
    const r = host.current.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 12);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 8);
  };

  // scroll: the copy lifts away while the devices settle back
  const { scrollYProgress: p } = useScroll({ target: host, offset: ['start start', 'end start'] });
  const copyY = useTransform(p, [0, 1], [0, -90]);
  const copyO = useTransform(p, [0, 0.6], [1, 0]);
  const stageY = useTransform(p, [0, 1], [0, 120]);
  const stageS = useTransform(p, [0, 1], [1, 0.9]);

  const line = (text, d) => (
    <span className="x-line">
      <motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: d }}>{text}</motion.span>
    </span>
  );

  return (
    <section className="x-hero" data-slot="hero" ref={host} onPointerMove={onMove} onPointerLeave={() => { rx.set(0); ry.set(0); }} aria-labelledby="home-title">
      <Dots host={host} />
      <div className="x-wrap x-hero-grid">
        <motion.div className="x-hero-copy" style={{ y: copyY, opacity: copyO }}>
          <motion.a href="/blog/pareto-frontier" className="x-badge" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><path d="M8 1.5l1.6 4.2 4.2 1.6-4.2 1.6L8 13.1 6.4 8.9 2.2 7.3l4.2-1.6z" fill="currentColor" /></svg>
            A New Pareto Frontier
            <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M6 3.5 10.5 8 6 12.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </motion.a>
          <h1 id="home-title" className="x-h1">
            <span className="x-h1-a">{line('Smarter, Faster, Open Source.', 0.1)}</span>
            <span className="x-h1-b">{line('Pick all three.', 0.25)}</span>
          </h1>
          <motion.p className="x-hero-lede" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: EASE, delay: 0.5 }}>
            Frontier intelligence over <b><Count to={200} suffix="×" duration={1.8} delay={0.6} /></b> faster and <b><Count to={400} suffix="×" duration={2} delay={0.7} /></b> cheaper. Every model behind one key.
          </motion.p>
          <motion.div className="x-auth" initial="h" animate="s" variants={{ s: { transition: { staggerChildren: 0.07, delayChildren: 0.75 } } }}>
            <div className="x-auth-row">
              <motion.a variants={rise} href="https://hanzo.ai/signup?provider=google" className="x-auth-b" whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
                <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"><path fill="currentColor" d="M22.6 12.3c0-.8-.1-1.5-.2-2.3H12v4.3h6a5.1 5.1 0 0 1-2.2 3.4v2.8h3.6c2.1-2 3.2-4.9 3.2-8.2z" /><path fill="currentColor" d="M12 23c3 0 5.5-1 7.4-2.7l-3.6-2.8c-1 .7-2.3 1.1-3.8 1.1-2.9 0-5.4-2-6.3-4.6H2v2.9A11 11 0 0 0 12 23z" /><path fill="currentColor" d="M5.7 14c-.2-.7-.4-1.3-.4-2s.1-1.4.4-2V7.1H2a11 11 0 0 0 0 9.8L5.7 14z" /><path fill="currentColor" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2A11 11 0 0 0 2 7.1L5.7 10C6.6 7.4 9.1 5.4 12 5.4z" /></svg>
                Continue with Google
              </motion.a>
              <motion.a variants={rise} href="https://hanzo.ai/signup?provider=github" className="x-auth-b" whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
                <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"><path fill="currentColor" d="M12 .5a11.5 11.5 0 0 0-3.6 22.4c.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.7 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.2c0 .3.2.7.8.6A11.5 11.5 0 0 0 12 .5z" /></svg>
                Continue with GitHub
              </motion.a>
            </div>
            <motion.div variants={rise} className="x-or"><span>or</span></motion.div>
            <div className="x-auth-mag">
              <motion.a variants={rise} href="https://hanzo.ai/signup" className="x-auth-b solid" whileTap={{ scale: 0.97 }}>Continue with email</motion.a>
            </div>
          </motion.div>
        </motion.div>

        <motion.div className="x-hero-stage" ref={fit} style={{ y: stageY, scale: stageS, height: `calc(var(--sh) * ${k})` }}>
          <div className="x-fit" style={{ transform: `scale(${k})` }}>
            <motion.div className="x-3d" style={{ rotateX: rx, rotateY: ry }}>
              <Desk sc={sc} navPick={navPick} onSelectScene={selectScene} phase={phase} side={side} onSide={() => setSide((v) => !v)} promptEl={promptEl} full={typed === PROMPT.length} />
              <Term sc={sc} onSelectScene={selectScene} cmdEl={cmdEl} done={cmdDone} copy={copy} copied={copied} cmd={CMD} />
              <Phone sc={sc} phase={phase} />
            </motion.div>
          </div>
          <SetupMenu up initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 1.1 }} />
        </motion.div>
      </div>
    </section>
  );
}

const rise = { h: { opacity: 0, y: 14 }, s: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } } };
