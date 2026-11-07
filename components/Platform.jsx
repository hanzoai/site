'use client';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, animate, useInView, useMotionValue, useMotionValueEvent, useReducedMotion, useTransform } from 'motion/react';
import { EASE, Head, mod } from './ui';
import { A } from './kit';
import C from '../content';

const P = C.products;
const N = P.length;
const HOLD = 4.8; // seconds each product holds the stage while it plays by itself

function Slide({ i, pos, W, active, onPick }) {
  const off = useTransform(pos, (v) => mod(i - v + N / 2, N) - N / 2);
  const transform = useTransform(off, (d) => {
    const a = Math.abs(d);
    const x = d * W * 0.64;
    const z = -Math.min(a, 3) * 230;
    const r = Math.max(-58, Math.min(58, -d * 34));
    const s = 1 - Math.min(a, 2) * 0.05;
    return `translate3d(${x}px,0,${z}px) rotateY(${r}deg) scale(${s})`;
  });
  const opacity = useTransform(off, (d) => { const a = Math.abs(d); return a > 2.7 ? 0 : a > 1.7 ? 1 - (a - 1.7) : 1; });
  const zIndex = useTransform(off, (d) => 100 - Math.round(Math.abs(d) * 10));
  const shade = useTransform(off, (d) => Math.min(Math.abs(d), 1.6) * 0.32);
  const p = P[i];
  const on = active === i;
  return (
    <motion.article
      className={'x-slide' + (on ? ' on' : '')}
      style={{ transform, opacity, zIndex }}
      onClick={() => !on && onPick(i)}
      aria-roledescription="slide"
      aria-label={`${i + 1} of ${N}: ${p.name}`}
      inert={!on}
    >
      <div className="x-slide-vis" dangerouslySetInnerHTML={{ __html: p.vis }} />
      <footer className="x-slide-f">
        <div><b>{p.name}</b><A className="x-slide-addr" to={p.addr.startsWith('hanzo.ai/') ? p.addr.slice(8) : 'https://' + p.addr} aria-label={`Open Hanzo ${p.name} at ${p.addr}`}>{p.addr}</A></div>
        <div className="x-slide-acts">
          {p.acts.map((a, k) => (
            <motion.a key={a.label} href={a.href} className={'x-btn sm' + (k === p.acts.length - 1 ? ' solid' : '')} whileTap={{ scale: 0.96 }}>{a.label}{k === p.acts.length - 1 ? ' ↗' : ''}</motion.a>
          ))}
        </div>
      </footer>
      <motion.i className="x-slide-shade" style={{ opacity: shade }} aria-hidden="true" />
    </motion.article>
  );
}

export default function Platform() {
  const sec = useRef(null);
  const stage = useRef(null);
  const calm = useReducedMotion();
  const seen = useInView(sec, { amount: 0.45 });
  const pos = useMotionValue(0);
  const [active, setActive] = useState(0);
  const [W, setW] = useState(560);
  const [auto, setAuto] = useState(true);
  const [held, setHeld] = useState(false);
  const drag = useRef({ start: 0, moved: false });

  useMotionValueEvent(pos, 'change', (v) => { const a = mod(Math.round(v), N); setActive((c) => (c === a ? c : a)); });
  useLayoutEffect(() => {
    const ro = new ResizeObserver(([e]) => setW(Math.min(620, e.contentRect.width * (e.contentRect.width < 700 ? 0.86 : 0.46))));
    ro.observe(stage.current);
    return () => ro.disconnect();
  }, []);

  const go = (t) => animate(pos, t, calm ? { duration: 0 } : { type: 'spring', stiffness: 150, damping: 24, mass: 1 });
  const to = (i) => { const cur = Math.round(pos.get()); let d = mod(i - cur, N); if (d > N / 2) d -= N; go(cur + d); };
  const step = (d) => go(Math.round(pos.get()) + d);
  const take = () => setAuto(false);

  // it plays by itself while on screen, rests while you read, stops for good once you take over
  const playing = auto && seen && !held && !calm;
  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => step(1), HOLD * 1000);
    return () => clearTimeout(t);
  }, [playing, active]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section className="x-sec x-platform" id="products" ref={sec} aria-labelledby="products-h">
      <div className="x-wrap">
        <Head title="Hanzo is the AI-native company platform." lede="A vertically integrated agentic operating system for business — intelligence, applications, computer-use agents, developer tools, MCP, and cloud infrastructure designed together in one workspace." />
      </div>
      <motion.div
        className="x-cover"
        ref={stage}
        aria-roledescription="carousel"
        aria-label="Hanzo products"
        onPointerEnter={() => setHeld(true)}
        onPointerLeave={() => setHeld(false)}
        onFocus={() => setHeld(true)}
        onBlur={() => setHeld(false)}
        onPanStart={() => { take(); drag.current = { start: pos.get(), moved: true }; }}
        onPan={(_, info) => pos.set(drag.current.start - info.offset.x / (W * 0.64))}
        onPanEnd={(_, info) => { go(Math.round(pos.get() - (info.velocity.x / (W * 0.64)) * 0.22)); setTimeout(() => { drag.current.moved = false; }, 0); }}
        onClickCapture={(e) => { if (drag.current.moved) { e.preventDefault(); e.stopPropagation(); } }}
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.1, ease: EASE }}
      >
        <div className="x-cover-3d" style={{ '--cw': W + 'px' }}>
          {P.map((_, i) => <Slide key={i} i={i} pos={pos} W={W} active={active} onPick={(k) => { take(); to(k); }} />)}
        </div>
      </motion.div>
      <div className="x-wrap x-cover-nav">
        <motion.button type="button" className="x-round" aria-label="Previous product" onClick={() => { take(); step(-1); }} whileTap={{ scale: 0.9 }}>‹</motion.button>
        <div
          className="x-pills"
          role="tablist"
          aria-label="Choose a product"
          onKeyDown={(e) => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); take(); step(e.key === 'ArrowRight' ? 1 : -1); } }}
        >
          {P.map((p, i) => (
            <button key={p.name} type="button" role="tab" aria-selected={active === i} tabIndex={active === i ? 0 : -1} onClick={() => { take(); to(i); }}>
              {active === i && (
                <motion.span layoutId="pill" className="x-pill-bg" transition={{ type: 'spring', stiffness: 400, damping: 34 }}>
                  {playing && <span key={active} className="x-pill-fill" style={{ animationDuration: HOLD + 's' }} />}
                </motion.span>
              )}
              <span className="x-pill-t">{p.name}</span>
            </button>
          ))}
        </div>
        <motion.button type="button" className="x-round" aria-label="Next product" onClick={() => { take(); step(1); }} whileTap={{ scale: 0.9 }}>›</motion.button>
      </div>
    </section>
  );
}
