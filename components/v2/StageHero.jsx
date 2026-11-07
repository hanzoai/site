'use client';
/* StageHero — the v2 launch hero (Cloud 4 chat; VISION.md motion 2, "Stage").
   Usage:
     <StageHero kick="sentry.hanzo.ai" title={['Hanzo Sentinel']} sub="Error tracking…" lede="…"
                acts={[['Read the docs', url], ['View on GitHub', url]]} look="rise|split|side|frame" dark cue="Scroll">
       <YourLiveProductObject />
     </StageHero>
   - The title lines rise out of a mask once (kinetic type). The first act is the magnetic primary and the phone thumb action.
   - The object starts large and settles into place as the hero scrolls away, using scale, position and clip only:
     rise  = centred copy, the object big and low, then up into place;
     split = the title on 8 columns, the line and actions on 4 beside it (editorial), the object rising under both;
     side  = copy on 5 columns, the object on 7, arriving from the right edge;
     frame = the object full-bleed behind the copy, then clipped into a 28px card.
   - Desktop pins for ~75svh so the settle reads. Phones and reduced motion get the settled state with no pin.
   - Put the page accent on <main style={{ '--ac': '#…' }}> (see components/v2/Launch.css). */
import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, useMotionTemplate } from 'motion/react';
import { EASE, Magnetic } from '../ui';
import { A } from '../kit';
import { useWide } from './useWide';
import './Launch.css';

const up = (d) => ({ initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, ease: EASE, delay: d } });

const LOOKS = {
  rise: { s: [1.22, 1], y: ['14svh', '-27svh'], x: ['0%', '0%'], clip: [0, 0] },
  split: { s: [1.14, 1], y: ['12svh', '-20svh'], x: ['0%', '0%'], clip: [0, 0] },
  side: { s: [1.16, 1], y: ['6svh', '0svh'], x: ['22%', '0%'], clip: [0, 0] },
  frame: { s: [1.08, 1], y: ['0svh', '0svh'], x: ['0%', '0%'], clip: [0, 1] },
};

export default function StageHero({ kick, title, sub, lede, acts = [], look = 'rise', dark, cue, thumb, children, className = '', id }) {
  const ref = useRef(null);
  const calm = useReducedMotion();
  const wide = useWide();
  const on = wide && !calm;
  const L = LOOKS[look] || LOOKS.rise;
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const s = useTransform(p, [0, 0.85], L.s);
  const y = useTransform(p, [0, 0.85], L.y);
  const x = useTransform(p, [0, 0.85], L.x);
  const k = useTransform(p, [0, 0.85], L.clip);
  const inset = useTransform(k, (v) => `inset(${v * 7}% ${v * 6}% ${v * 7}% ${v * 6}% round ${v * 28}px)`);
  const clip = useMotionTemplate`${inset}`;
  const copyY = useTransform(p, [0, 0.8], ['0svh', look === 'rise' || look === 'split' ? '-22svh' : '-4svh']);
  // opacity as a function, not a range: Motion would hand a range to a scroll-linked WAAPI animation, which forgets its clamp
  const [o0, o1] = look === 'rise' || look === 'split' ? [0.15, 0.6] : [0.25, 0.8], oEnd = look === 'side' ? 0.16 : 0;
  const copyO = useTransform(p, (v) => 1 - (1 - oEnd) * Math.min(1, Math.max(0, (v - o0) / (o1 - o0))));
  const cueO = useTransform(p, (v) => Math.max(0, 1 - v / 0.12));
  const copyPE = useTransform(copyO, (v) => (v < 0.2 ? 'none' : 'auto'));
  const lines = Array.isArray(title) ? title : [title];
  const objStyle = on ? (look === 'frame' ? { clipPath: clip, scale: s } : { scale: s, y, x }) : undefined;
  return (
    <section ref={ref} id={id} className={`l2-stage ${look} ${dark ? 'l2-dark' : ''} ${className}`} data-room={dark ? 'dark' : undefined}>
      <div className="l2-stage-pin">
        <div className={look === 'side' ? 'l2-wrap l2-stage-in' : 'l2-stage-in'} style={look === 'side' ? undefined : { display: 'contents' }}>
          <motion.div className={look === 'side' ? 'l2-stage-copy' : 'l2-wrap l2-stage-copy'} style={on ? { y: copyY, opacity: copyO, pointerEvents: copyPE } : undefined}>
            {kick && <motion.p className="l2-kick l2-stage-kick" {...up(0)}><i aria-hidden="true" />{kick}</motion.p>}
            <h1 className="l2-display">
              {lines.map((t, i) => (
                <span className="l2-ln" key={i}><motion.span initial={calm ? false : { y: '108%' }} animate={{ y: 0 }} transition={{ duration: 1.15, ease: EASE, delay: 0.08 + i * 0.12 }}>{t}</motion.span></span>
              ))}
            </h1>
            {sub && <motion.p className="l2-lede" {...up(0.32)}>{sub}</motion.p>}
            {lede && <motion.p className="l2-lede" {...up(0.4)}>{lede}</motion.p>}
            {acts.length > 0 && (
              <motion.div className="l2-acts" {...up(0.5)}>
                {acts.map(([t, to], i) => (i === 0
                  ? <Magnetic key={t} strength={0.25}><A to={to} className="x-btn solid" data-thumb={thumb || t}>{t}</A></Magnetic>
                  : <A key={t} to={to} className="x-btn">{t}</A>))}
              </motion.div>
            )}
          </motion.div>
          <motion.div className="l2-stage-obj" style={objStyle} initial={calm ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2, ease: EASE, delay: 0.2 }}>
            {children}
          </motion.div>
        </div>
        {cue && on && <motion.p className="l2-stage-cue" aria-hidden="true" style={{ opacity: cueO }}>{cue}</motion.p>}
      </div>
    </section>
  );
}
