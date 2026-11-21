'use client';
import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react';
import { motion, useInView, useReducedMotion, useSpring } from 'motion/react';
import { fine, copyText } from './ui';
import Dots from './Dots';
import SetupMenu from './SetupMenu';
import { Desk, MORE, Phone, Term } from './home/Devices';
import Deck from './home/Deck';
import { press } from '../lib/press';
import { APP } from '../lib/app';
import { capture, track } from '../lib/track';
import './home/demo.css';

const PROMPT = 'Build maxpower: every AI I use in one place, and faster at coding.';
const CMD = 'curl -fsSL https://hanzo.sh | sh';

/* A light that follows the pointer across "Pick all three." */
function Three({ calm }: { calm: boolean | null }) {
  const ref = useRef<HTMLSpanElement>(null);
  const light = useRef({ x: -1e4, ink: 100, tx: -1e4, tink: 100, sweep: 0, frame: 0 });
  const paint = () => {
    const el = ref.current, l = light.current;
    if (!el) return;
    el.style.setProperty('--x', `${l.x.toFixed(1)}px`);
    el.style.setProperty('--ink-mix', `${l.ink.toFixed(1)}%`);
  };
  const run = () => {
    const l = light.current;
    if (l.frame) return;
    const step = (now: number) => {
      const el = ref.current;
      if (!el) { l.frame = 0; return; }
      if (l.sweep) {
        const w = el.getBoundingClientRect().width;
        const t = Math.min(1, Math.max(0, (now - l.sweep) / 1250));
        const e = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
        l.tx = -0.25 * w + e * 1.5 * w;
        l.tink = t < 0.85 ? 32 : 100;
        if (t === 1) l.sweep = 0;
      }
      l.x += (l.tx - l.x) * (l.sweep ? 1 : 0.24);
      l.ink += (l.tink - l.ink) * 0.14;
      paint();
      const settled = !l.sweep && Math.abs(l.tx - l.x) < 0.5 && Math.abs(l.tink - l.ink) < 0.5;
      l.frame = settled ? 0 : requestAnimationFrame(step);
    };
    l.frame = requestAnimationFrame(step);
  };
  useEffect(() => () => cancelAnimationFrame(light.current.frame), []);
  const at = (e: { clientX: number }, ink: number) => {
    const el = ref.current, l = light.current;
    if (!el) return;
    l.sweep = 0;
    l.tx = e.clientX - el.getBoundingClientRect().left;
    l.tink = ink;
    if (calm) { l.x = l.tx; l.ink = ink; paint(); }
    else run();
  };
  return (
    <span
      ref={ref}
      className="x-flash"
      onPointerEnter={(e) => at(e, 32)}
      onPointerMove={(e) => at(e, 32)}
      onPointerLeave={(e) => at(e, 100)}
    >
      Pick all three.
    </span>
  );
}


export default function Hero() {
  const host = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const calm = useReducedMotion();
  const inView = useInView(host, { amount: 0.2 });
  const live = useRef(true);
  live.current = inView;
  // the terminal's Copy copies the active CLI command it shows, and says so
  const [copied, setCopied] = useState(false);
  const copyT = useRef<ReturnType<typeof setTimeout>>(undefined);
  const copy = async (cmdText = CMD) => {
    const line = typeof cmdText === 'string' && cmdText ? cmdText : CMD;
    if (!(await copyText(line))) return;
    capture('home_copied', { block: 'hero', command: line });
    setCopied(true);
    clearTimeout(copyT.current);
    copyT.current = setTimeout(() => setCopied(false), 1600);
  };

  // the landing is counted once, when the hero is first drawn; a press on Download App is read where the page transition reads it
  useEffect(() => { capture('home_viewed'); }, []);
  useEffect(() => press('.x-phone-dl', () => track('hero_demo', { control: 'phone-download' })), []);

  // Safari fallback for CSS tan(atan2(100cqw, var(--sw))): keep --k-js synced with the stage's live width
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const sync = () => {
      const w = el.clientWidth;
      if (!w) return;
      const rawSw = parseFloat(getComputedStyle(el).getPropertyValue('--sw'));
      const sw = rawSw > 0 ? rawSw : (window.innerWidth <= 640 ? 390 : 720);
      const k = Math.min(1.15, w / sw);
      el.style.setProperty('--k-js', k.toFixed(4));
    };
    sync();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(sync) : null;
    ro?.observe(el);
    window.addEventListener('resize', sync, { passive: true });
    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', sync);
    };
  }, []);

  // Start populated on SSR and first paint so Desktop and Phone never flash blank white on load or loop wrap
  const [typed, setTypedState] = useState(PROMPT.length);
  const promptEl = useRef<HTMLSpanElement>(null);
  const setTyped = (i: number) => { if (promptEl.current) promptEl.current.textContent = PROMPT.slice(0, i); if (i === 0 || i === PROMPT.length) setTypedState(i); };
  const [phase, setPhase] = useState(4);
  // scene -1 is the opening maxpower build; then the rest of Hanzo's day plays: one scene every 6.5 s, wrapping back to -1
  const [sc, setSc] = useState(-1);
  const [navPick, setNavPick] = useState<string | null>(null);
  const [side, setSide] = useState(true);
  const holdUntilRef = useRef(0);

  const selectScene = (nextSc: number, navId: string | null = null) => {
    holdUntilRef.current = Date.now() + 12000;
    setTyped(PROMPT.length);
    setPhase(4);
    setSc(nextSc);
    setNavPick(navId);
  };

  useEffect(() => {
    if (calm) return;
    holdUntilRef.current = Date.now() + 5200;
    const t = setInterval(() => {
      if (!live.current || Date.now() < holdUntilRef.current) return;
      setNavPick(null);
      setSc((n) => ((n + 2) % (MORE.length + 1)) - 1);
    }, 6200);
    return () => clearInterval(t);
  }, [calm]);


  // pointer: the three devices turn toward it, each at its own depth
  const rx = useSpring(0, { stiffness: 90, damping: 18 });
  const ry = useSpring(0, { stiffness: 90, damping: 18 });
  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (!fine(e)) return;
    const r = host.current!.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 6);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 4);
  };

  const line = (content: ReactNode, idx: string) => (
    <span className="x-line">
      <span className="x-line-in"><span data-line={idx}>{content}</span></span>
    </span>
  );

  return (
    <section className="x-hero" data-slot="hero" ref={host} onPointerMove={onMove} onPointerLeave={() => { rx.set(0); ry.set(0); }} aria-labelledby="home-title">
      <Dots host={host} />
      <div className="x-wrap x-hero-grid">
        <div className="x-hero-copy">
          <a href="/blog/pareto-frontier" className="x-badge">
            <span className="x-badge-shine" aria-hidden="true" />
            <svg className="x-badge-spark" viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><path d="M8 1.5l1.6 4.2 4.2 1.6-4.2 1.6L8 13.1 6.4 8.9 2.2 7.3l4.2-1.6z" fill="currentColor" /></svg>
            <span className="x-badge-t">A New Pareto Frontier</span>
            <svg className="x-badge-chev" viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M6 3.5 10.5 8 6 12.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </a>
          <h1 id="home-title" className="x-h1">
            <span className="x-h1-a">{line('Smarter, Faster, Open Source.', '1')}</span>
            <span className="x-h1-b">{line(<Three calm={calm} />, '2')}</span>
          </h1>
          <p className="x-hero-lede">
            Frontier intelligence over <b>200×</b> faster and <span className="x-nowrap"><b>400×</b> cheaper.</span> Agentic OS for organizations of every size.
          </p>
          <div className="x-auth">
            <div className="x-auth-row">
              <a href={`${APP}/signup?provider=google`} className="x-auth-b">
                <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"><path fill="currentColor" d="M22.6 12.3c0-.8-.1-1.5-.2-2.3H12v4.3h6a5.1 5.1 0 0 1-2.2 3.4v2.8h3.6c2.1-2 3.2-4.9 3.2-8.2z" /><path fill="currentColor" d="M12 23c3 0 5.5-1 7.4-2.7l-3.6-2.8c-1 .7-2.3 1.1-3.8 1.1-2.9 0-5.4-2-6.3-4.6H2v2.9A11 11 0 0 0 12 23z" /><path fill="currentColor" d="M5.7 14c-.2-.7-.4-1.3-.4-2s.1-1.4.4-2V7.1H2a11 11 0 0 0 0 9.8L5.7 14z" /><path fill="currentColor" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2A11 11 0 0 0 2 7.1L5.7 10C6.6 7.4 9.1 5.4 12 5.4z" /></svg>
                Continue with Google
              </a>
              <a href={`${APP}/signup?provider=github`} className="x-auth-b">
                <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"><path fill="currentColor" d="M12 .5a11.5 11.5 0 0 0-3.6 22.4c.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.7 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.2c0 .3.2.7.8.6A11.5 11.5 0 0 0 12 .5z" /></svg>
                Continue with GitHub
              </a>
            </div>
            <div className="x-or"><span>or</span></div>
            <div className="x-auth-mag">
              <a href={`${APP}/signup`} className="x-auth-b solid">Continue with email</a>
            </div>
          </div>
        </div>

        <div className="x-hero-show">
          <div className="x-hero-stage" ref={stageRef}>
            <div className="x-fit">
              <motion.div className="x-3d" style={{ rotateX: rx, rotateY: ry }}>
                <Desk sc={sc} navPick={navPick} onSelectScene={selectScene} phase={phase} side={side} onSide={() => setSide((v) => !v)} promptEl={promptEl} full={typed === PROMPT.length} />
                <Term onSelectScene={selectScene} calm={calm} inView={inView} copy={copy} copied={copied} />
                <Phone sc={sc} navPick={navPick} onSelectScene={selectScene} phase={phase} />
              </motion.div>
            </div>
          </div>
          <Deck stage={stageRef} />
          <SetupMenu up />
        </div>
      </div>
    </section>
  );
}

