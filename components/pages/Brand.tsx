'use client';
/* /brand. Story page (treated so; MASTER 4), Hanzo's deck only.
   V2: 8/10 (MOTION-MAP: signature `magnet-grid`, the dot field around the mark bends toward the cursor and ripples
   on a click, tap or Enter, and every ripple parts the mark once; entrances in order pull-back (principles),
   cursor-trail (colour room), spiral-in (type specimen), curtain-rise (components), stretch-scroll (assets); the
   pinned 01/02/03 stage is gone, the principles are plain rows; one reveal besides them, the h1 cut-in.)
   A brand book that is a drawing, in Hanzo's own black, white and greys. The hero is the mark's construction drawn
   full-bleed on a magnetic field of dots, whole on the first frame; then it lives: the dots bend to the pointer and
   ripple, the pieces lean toward the pointer, the compass turns slowly (pause control). Then the three principles
   with their giant numerals, the colour room as one scene, the type specimen whose weight sweeps once, a working
   component bench, and the assets with the marks they contain.
   Persona: a designer, partner or journalist who needs the marks and rules (PLAN 1.1 "Investor and press").
   Goal: take the brand assets. CTA: "Download Assets" (to the assets ZIP), metric: the one contact click
   (cta_click brand.*); one solid per screen, carried by the site's shared ask bar after the hero.
   Signature: `magnet-grid` (./brand/MagnetGrid.jsx). Entrances: ./brand/enter.js + enter.css.
   Supporting: the h1 cut-in (CSS), the specimen's one weight sweep then the slider, the contrast board's swap.
   Beyond: set any of Hanzo's six grays on Hanzo White or Hanzo Black and see, as a shape, whether it meets the WCAG AA
   line, worked out from the two hex values (filled check 4.5:1, half disc 3:1 large text only, cross below).
   Deletes: the proof-red accent; every eyebrow and kicker over a headline ("Design System", "Design Principles",
   "01 / 03" over each principle, mono group labels); the card hero /press shared; the endless breathing and weight
   loops; invented words and figures (the contrast ratios, the weight readout and its 100 / 900, the bench echo,
   "construction", "mark", "Copied"); the tick on a failed copy.
   Every word is Hanzo's. */
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { motion, animate, useInView, useMotionValue, useReducedMotion, useTransform } from 'motion/react';
import type { MotionValue } from 'motion/react';
import { Cta } from '../kit';
import MaskLines from './company/MaskLines';
import useArrived from './company/useArrived';
import MagnetGrid from './brand/MagnetGrid';
import useEnter from './brand/enter';
import '../v2/vc-type.css';
import './company/deck.css';
import './Brand.css';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
// MASTER 3.1: no springs, no overshoot. Arrivals use ease-emphasis; things the hand moves settle in 300 ms.
const SOFT = { duration: 0.3, ease: EASE };
const IN_OUT: [number, number, number, number] = [0.4, 0, 0.2, 1];
const PART = { duration: 0.9, ease: IN_OUT }; // the build: things that move and stay (ease-in-out)
// JS off: the hero is already whole in the server HTML (the dot field is a CSS background); Pause needs JS, so it hides
const NOJS = { __html: '<style>.xbr-pause{display:none!important}</style>' };

const PIECES = ['M22.21 67V44.6369H0V67H22.21Z', 'M66.7038 22.3184H22.2534L0.0878906 44.6367H44.4634L66.7038 22.3184Z', 'M22.21 0H0V22.3184H22.21V0Z', 'M66.7198 0H44.5098V22.3184H66.7198V0Z', 'M66.7198 44.6369H44.5098V67H66.7198V44.6369Z'];
const FROM = [[-18, 22], [0, 0], [-18, -22], [18, -22], [18, 22]];
const DEPTH = [3.2, 1.2, 3.2, 3.2, 3.2]; // how far each piece leans toward the pointer (the corner blocks lean most)

/* One piece of the mark. It is whole in the server HTML (first frame). After paint it parts along its construction
   lines to show the build and closes again (staggered), then leans toward the pointer (300 ms, ease-emphasis). */
interface PieceProps {
  d: string;
  i: number;
  open: boolean;
  mx: MotionValue<number>;
  my: MotionValue<number>;
}
function Piece({ d, i, open, mx, my }: PieceProps) {
  const part = useMotionValue(0);
  useEffect(() => { const c = animate(part, open ? 1 : 0, { ...PART, delay: (open ? i : 4 - i) * 0.06 }); return () => c.stop(); }, [open]); // eslint-disable-line react-hooks/exhaustive-deps
  const x = useTransform([part, mx], ([o, m]: number[]) => o * FROM[i][0] * 0.6 + m * DEPTH[i]);
  const y = useTransform([part, my], ([o, m]: number[]) => o * FROM[i][1] * 0.6 + m * DEPTH[i]);
  return <motion.path d={d} className="xbr-piece" style={{ x, y }} />;
}

/* The construction, drawn full-bleed on the hero's stage. */
interface DrawingProps {
  mx: MotionValue<number>;
  my: MotionValue<number>;
  stage: React.RefObject<HTMLElement | null>;
}
function Drawing({ mx, my, stage }: DrawingProps) {
  const ref = useRef<HTMLDivElement>(null);
  const live = useInView(ref, { amount: 0.3 });
  const calm = useReducedMotion();
  // visibility never waits on anything; only the idle life waits for the curtain (if any) to lift
  const ok = useArrived();
  const go = ok && !calm;
  const [open, setOpen] = useState(false);
  const once = useRef(false);
  useEffect(() => { // shown whole, it parts once along its guides to show its build, then closes and rests
    if (!go || !live || once.current) return;
    once.current = true;
    const a = setTimeout(() => setOpen(true), 700);
    const b = setTimeout(() => setOpen(false), 2600);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, [go, live]);
  // every ripple of the field (click, tap, Enter) parts the mark along its guides and closes it again
  const [ripples, setRipples] = useState(0);
  useEffect(() => {
    if (!ripples) return undefined;
    setOpen(true);
    const t = setTimeout(() => setOpen(false), 650);
    return () => clearTimeout(t);
  }, [ripples]);
  // the compass turns slowly (one turn a minute) while the hero is seen; Pause stops it (WCAG 2.2.2)
  const [spin, setSpin] = useState(true);
  const turn = useMotionValue(0);
  useEffect(() => {
    if (!go || !live || !spin) return;
    const c = animate(turn, turn.get() + 360, { duration: 60, ease: 'linear', repeat: Infinity });
    return () => c.stop();
  }, [go, live, spin, turn]);
  const g = [0, 22.3, 44.6, 67];
  // guides, circle and mark are all in the server HTML: the first frame is the finished drawing
  return (
    <div className="xbr-dr" ref={ref}>
      <MagnetGrid stage={stage} onRipple={() => setRipples((n) => n + 1)} label="Design System" />
      <svg viewBox="-60 -60 187 187" aria-hidden="true">
        {g.map((v, i) => (
          <g key={v} style={{ '--i': i }}>
            <line x1={v} x2={v} y1="-200" y2="270" className="xbr-g" />
            <line y1={v} y2={v} x1="-260" x2="270" className="xbr-g" />
          </g>
        ))}
        <motion.g className="xbr-compass" style={{ rotate: turn, originX: '33.4px', originY: '33.5px', transformBox: 'view-box' }}>
          <circle cx="33.4" cy="33.5" r="47.3" className="xbr-g c" />
          <line x1="-30" y1="97" x2="97" y2="-30" className="xbr-g c" />
          <g className="xbr-ticks">{Array.from({ length: 24 }, (_, i) => {
            const a = (i / 24) * Math.PI * 2, r1 = 47.3, r2 = i % 6 ? 45.3 : 43.3;
            const f = (v: number) => Math.round(v * 100) / 100; // rounded: server and browser maths then print the same numbers
            return <line key={i} x1={f(33.4 + Math.cos(a) * r1)} y1={f(33.5 + Math.sin(a) * r1)} x2={f(33.4 + Math.cos(a) * r2)} y2={f(33.5 + Math.sin(a) * r2)} className="xbr-tick" />;
          })}</g>
        </motion.g>
        {PIECES.map((d, i) => <Piece key={i} d={d} i={i} open={open} mx={mx} my={my} />)}
      </svg>
      {/* always rendered (same markup on server and client); CSS hides it under reduced motion, where nothing turns */}
      <button type="button" className="xbr-pause" aria-label={spin ? 'Pause' : 'Replay'} aria-pressed={!spin} onClick={() => setSpin((v) => !v)}>
        {spin
          ? <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M5 3.5v9M11 3.5v9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
          : <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M5 3.2v9.6L12.5 8z" fill="currentColor" /></svg>}
      </button>
    </div>
  );
}

function Hero() {
  const calm = useReducedMotion();
  const stage = useRef<HTMLElement>(null); // the whole hero takes the pointer for the magnet field
  // the pointer anywhere in the hero pulls the pieces toward it (fine pointers only), settling in 300 ms (no spring)
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const to = (mv: MotionValue<number>, v: number) => animate(mv, v, SOFT);
  const lean = (e: React.PointerEvent<HTMLElement>) => {
    if (calm || (e.pointerType !== 'mouse' && e.pointerType !== 'pen')) return;
    const art = e.currentTarget.querySelector('.xbr-dr svg');
    if (!art) return;
    const r = art.getBoundingClientRect();
    const cx = r.left + r.width * 0.5, cy = r.top + r.height * 0.5;
    to(mx, Math.max(-1, Math.min(1, (e.clientX - cx) / (r.width * 0.9))));
    to(my, Math.max(-1, Math.min(1, (e.clientY - cy) / (r.height * 0.9))));
  };
  return (
    <section ref={stage} className="xbr-hero vc-scene" aria-label="Design System" data-ask-name="Hanzo Brand Guidelines" onPointerMove={lean} onPointerLeave={() => { to(mx, 0); to(my, 0); }}>
      <noscript dangerouslySetInnerHTML={NOJS} />
      <Drawing mx={mx} my={my} stage={stage} />
      <div className="vc-grid xbr-hero-g">
        <div className="xbr-hero-c">
          {/* CSS cut-in from first paint at 0.1 s (MaskLines' base 0.5 s minus 0.4) */}
          <MaskLines as="h1" id="xbr-h1" now delay={-0.4} stagger={0.06} lines={['Hanzo Brand', 'Guidelines.']} className="vc-display" />
          {/* Hanzo's own label for this page, set under the headline (never a kicker over it) */}
          <p className="vc-kick xbr-kick">Design System</p>
          {/* visible in the server HTML: a transform-only CSS rise, never an opacity gate */}
          <div className="xbr-hero-f">
            <p className="vc-lede">How to build interfaces that look like the rest of Hanzo across our platform and products.</p>
            <div className="xbr-acts">
              <Cta to="/brand#assets" className="xbr-big" id="brand.hero" thumb>Download Assets</Cta>
              <Cta to="/press" kind="quiet" className="xbr-big" id="brand.press">Press Kit</Cta>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- principles: three plain rows, each with its giant numeral (no pinned stage); they pull back in ---------- */
const PRINCIPLES = [['Minimal & Focused', 'Reduce visual noise and focus on essential elements. Each design decision should have purpose and enhance the user experience.'], ['Elegant & Refined', 'Use subtle gradients, appropriate spacing, and thoughtful typography to create elegant and sophisticated interfaces.'], ['Consistent & Cohesive', 'Maintain consistency in design patterns, spacing, and visual hierarchy to create a unified experience across all touchpoints.']];
const MarkSvg = ({ s = 40 }) => <svg viewBox="0 0 67 67" width={s} height={s} aria-hidden="true">{PIECES.map((d, i) => <path key={i} d={d} fill="currentColor" />)}</svg>;
// each numeral stands in the principle's own material: one mark in a lot of space, the Brand Glow, the mark on a grid
interface NumeralProps {
  i: number;
}
const Numeral = ({ i }: NumeralProps) => (
  <div className={'xbr-num n' + i}>
    {i === 2 && <span className="xbr-num-grid" aria-hidden="true">{Array.from({ length: 16 }, (_, k) => <MarkSvg key={k} s={26} />)}</span>}
    {i === 0 && <span className="xbr-num-mark" aria-hidden="true"><MarkSvg s={30} /></span>}
    {i === 1 && <span className="xbr-num-glow" aria-hidden="true" />}
    <span className="xbr-num-n vc-num"><b>{String(i + 1).padStart(2, '0')}</b> / 03</span>
  </div>
);

function Principles() {
  return (
    <section className="xbr-pr" aria-label="Design Principles" data-enter="pull-back">
      <div className="vc-wrap xbr-pb">
        <p className="vc-kick">Design Principles</p>
        {PRINCIPLES.map(([t, d], i) => (
          <div className={'xbr-pr-row r' + i} key={t}>
            <div className="xbr-pr-w">
              <h2 className="vc-display s xbr-pr-t">{t}</h2>
              <p className="vc-body">{d}</p>
            </div>
            <div className="xbr-pr-v"><Numeral i={i} /></div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- colour: the one dark room ---------- */
// Copy only ticks when the clipboard really took the text; a blocked clipboard leaves the copy icon as it was.
function useCopy(text: string) {
  const [ok, setOk] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout> | 0>(0);
  const go = async () => {
    try { await navigator.clipboard.writeText(text); } catch { return; }
    setOk(true); clearTimeout(t.current); t.current = setTimeout(() => setOk(false), 1400);
  };
  return [ok, go] as const;
}
interface CopyIconProps {
  ok: boolean;
}
const CopyIcon = ({ ok }: CopyIconProps) => (ok
  ? <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><motion.path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} /></svg>
  : <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><rect x="5" y="5" width="8.5" height="8.5" rx="2" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="M10.5 3.2V3a.8.8 0 0 0-.8-.8H3a.8.8 0 0 0-.8.8v6.7c0 .44.36.8.8.8h.2" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>);

// The colour room arrives by its cursor-trail entrance (./brand/enter.js), so the swatches carry no reveal of their own.
interface SwatchProps {
  name: string;
  hex: string;
  big?: boolean;
  dark?: boolean;
  sel?: boolean;
}
function Swatch({ name, hex, big, dark, sel }: SwatchProps) {
  const [ok, go] = useCopy(hex);
  return (
    <motion.button type="button" className={'xbr-sw' + (big ? ' big' : '') + (dark ? ' dk' : '') + (sel ? ' sel' : '')} style={{ '--c': hex }} onClick={go} whileTap={{ scale: 0.97 }} transition={{ duration: 0.09 }} aria-label={`${name} ${hex}`} aria-pressed={ok}>
      <span className="xbr-sw-t"><b>{name}</b><span className="vc-num">{hex}</span></span>
      <span className="xbr-ok" aria-hidden="true"><CopyIcon ok={ok} /></span>
    </motion.button>
  );
}

const GRAYS = [['Gray 900', '#171717'], ['Gray 800', '#262626'], ['Gray 700', '#404040'], ['Gray 600', '#525252'], ['Gray 500', '#737373'], ['Gray 400', '#A3A3A3']];
const GRADS = [['Brand Glow', 'Radial', 'radial-gradient(circle at 50% 40%, rgba(255,255,255,.35), #0A0A0B 62%)'], ['White Fade', 'Linear', 'linear-gradient(180deg, #FFFFFF, rgba(255,255,255,0))'], ['Gray Fade', 'Linear', 'linear-gradient(180deg, #404040, #0A0A0B)']];

const lum = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)).reduce((a, c, i) => a + c * [0.2126, 0.7152, 0.0722][i], 0);
const contrast = (a: string, b: string) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };

/* The WCAG AA line as a shape: a filled check (4.5:1, body text), a half disc (3:1, large text only), a cross (below). */
interface VerdictProps {
  r: number;
}
function Verdict({ r }: VerdictProps) {
  const k = r >= 4.5 ? 'ok' : r >= 3 ? 'mid' : 'no';
  return (
    <motion.span key={k} className={'xbr-v ' + k} role="img" aria-label={k === 'ok' ? 'WCAG AA 4.5:1' : k === 'mid' ? 'WCAG AA 3:1' : 'below WCAG AA'}
      initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={SOFT}>
      <svg viewBox="0 0 20 20" width="22" height="22" aria-hidden="true">
        <circle cx="10" cy="10" r="8.5" fill={k === 'ok' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" />
        {k === 'mid' && <path d="M10 1.5a8.5 8.5 0 0 1 0 17z" fill="currentColor" />}
        {k === 'ok' && <path d="M6.3 10.4l2.4 2.4 5-5.2" fill="none" stroke="var(--bg)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />}
        {k === 'no' && <path d="M7 7l6 6M13 7l-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />}
      </svg>
    </motion.span>
  );
}

/* One thing in as another goes out: when the board is well in view, Hanzo Black slides in under the six grays, every
   verdict flips with it, then Hanzo White comes back and the switch is yours. Once; a touch stops it; calm skips it. */
interface ReadsProps {
  bg: string;
  setBg: React.Dispatch<React.SetStateAction<string>>;
}
function Reads({ bg, setBg }: ReadsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { amount: 0.6, once: true });
  const calm = useReducedMotion();
  const mine = useRef(false);
  useEffect(() => {
    if (!seen || calm || mine.current) return;
    const a = setTimeout(() => { if (!mine.current) setBg('#0A0A0B'); }, 900);
    const b = setTimeout(() => { if (!mine.current) setBg('#FFFFFF'); }, 3600);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, [seen, calm]);
  const pick = (h: string) => { mine.current = true; setBg(h); };
  return (
    <div className="xbr-reads" ref={ref} role="group" aria-label="Gray Scale on Hanzo White or Hanzo Black">
      <div className="xbr-seg" role="group" aria-label="Background">
        {[['Hanzo White', '#FFFFFF'], ['Hanzo Black', '#0A0A0B']].map(([n, h]) => <button key={h} type="button" aria-pressed={bg === h} onClick={() => pick(h)}>{bg === h && <motion.span layoutId="xbr-seg-pill" className="xbr-seg-pill" transition={SOFT} aria-hidden="true" />}<span>{n}</span></button>)}
      </div>
      <ul style={{ '--bg': bg }} className={bg === '#FFFFFF' ? 'lt' : 'dk'}>
        {GRAYS.map(([n, h]) => (
          <li key={n}>
            <span className="xbr-reads-s" style={{ color: h }} aria-hidden="true">Aa</span>
            <b>{n}</b>
            <Verdict r={contrast(h, bg)} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function Colour() {
  // one scene: the board's background is the scene's state, and the brand swatch it stands on is marked
  const [bg, setBg] = useState('#FFFFFF');
  return (
    <section className="vc-sec xbr-col" data-room="dark" aria-labelledby="xbr-col-h" data-enter="cursor-trail">
      <div className="vc-grid xbr-col-g xbr-ct">
        <header className="xbr-col-h">
          <h2 id="xbr-col-h" className="vc-display m">Color Palette</h2>
          <p className="vc-lede">Our colors are carefully selected to create a bold, modern aesthetic.</p>
        </header>
        <div className="xbr-col-l">
          <h3 className="vc-title xbr-sub">Brand Colors</h3>
          <div className="xbr-brand"><Swatch name="Hanzo Black" hex="#0A0A0B" big dark sel={bg === '#0A0A0B'} /><Swatch name="Hanzo White" hex="#FFFFFF" big sel={bg === '#FFFFFF'} /></div>
          <h3 className="vc-title xbr-sub">Gray Scale</h3>
          <div className="xbr-grays">{GRAYS.map(([n, h]) => <Swatch key={n} name={n} hex={h} dark={h !== '#A3A3A3'} />)}</div>
        </div>
        <Reads bg={bg} setBg={setBg} />
        <h3 className="vc-title xbr-sub xbr-grads-h">Gradients</h3>
        <div className="xbr-grads">{GRADS.map(([n, k, bg]) => <div key={n} className="xbr-grad"><span style={{ background: bg }} /><b>{n}</b><small>{k}</small></div>)}</div>
      </div>
    </section>
  );
}

/* ---------- type: the signature. The weight sweeps once when the specimen is on screen; the slider makes it yours. ---------- */
const SCALE: [string, string, number][] = [['Heading 1', 'Large page titles, hero sections', 56], ['Heading 2', 'Section titles, major divisions', 40], ['Heading 3', 'Subsection headings, feature headings', 30], ['Heading 4', 'Card titles, minor section headings', 22], ['Body Large', 'Featured paragraphs, pull quotes', 19], ['Body', 'Primary body text', 16], ['Caption', 'Supporting text, metadata, labels', 13]];

function Type() {
  const w = useMotionValue(560);
  const [val, setVal] = useState(560);
  const [mine, setMine] = useState(false);
  const calm = useReducedMotion();
  const spec = useRef<HTMLDivElement>(null);
  const live = useInView(spec, { amount: 0.6 }); // the specimen itself, well on screen: the sweep is seen whole
  const fw = useTransform(w, (v: number) => Math.round(v));
  const swept = useRef(false);
  // The track fill (--p) is never a React style: the CSS rests it at 560's 57.5% in the server HTML, and after mount
  // the weight writes it straight to the input, so nothing the sweep changes can differ from the server markup.
  const range = useRef<HTMLInputElement>(null);
  useEffect(() => w.on('change', (v: number) => {
    const r = Math.round(v);
    setVal(r);
    if (range.current) range.current.style.setProperty('--p', ((r - 100) / 8) + '%');
  }), [w]);
  useEffect(() => {
    if (mine || calm || !live || swept.current) return;
    swept.current = true; // one sweep (under 5 s, WCAG 2.2.2), then it rests at 560 and the slider is yours
    const c = animate(w, [w.get(), 200, 900, 560], { duration: 4.6, ease: 'easeInOut' });
    return () => c.stop();
  }, [mine, calm, live, w]);
  return (
    <section className="vc-sec xbr-type" aria-labelledby="xbr-type-h" data-enter="spiral-in">
      <div className="vc-grid xbr-type-g">
        <header className="xbr-type-h">
          <h2 id="xbr-type-h" className="vc-headline">Typography</h2>
          <p className="vc-body">Clean, readable typography is essential to our design language.</p>
        </header>
        <div className="xbr-spec" ref={spec}>
          <motion.p className="xbr-spec-a" style={{ fontWeight: fw }} aria-hidden="true">Aa</motion.p>
          <div className="xbr-spec-c">
            {/* suppressHydrationWarning: screenshot tools write an inline caret style onto inputs before hydration */}
            <input ref={range} suppressHydrationWarning type="range" min={100} max={900} step={1} value={val} aria-label="Font weight"
              onChange={(e) => { setMine(true); w.stop(); w.set(+e.target.value); }} />
          </div>
        </div>
        <ol className="xbr-scale">
          {SCALE.map(([n, d, px]) => (
            <li key={n}>
              <motion.span className="xbr-sc-n" style={{ fontSize: px, fontWeight: n.startsWith('Heading') ? fw : undefined }}>{n}</motion.span>
              <span className="xbr-sc-d">{d}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- components you can press ---------- */
function Components() {
  return (
    <section className="vc-sec xbr-comp" aria-labelledby="xbr-comp-h" data-enter="curtain-rise">
      <div className="vc-grid xbr-cr">
        <header className="xbr-comp-h">
          <h2 id="xbr-comp-h" className="vc-headline">Components</h2>
          <p className="vc-body">Reusable UI components that maintain consistency across our products.</p>
        </header>
        <div className="xbr-bench a">
          <h3 className="vc-title">Buttons</h3>
          <div className="xbr-btns">
            {[['Primary Button', 'p'], ['Secondary Button', 's'], ['Ghost Button', 'g'], ['Link Button', 'l']].map(([n, k]) => (
              <motion.button key={k} type="button" className={'xbr-b ' + k} whileTap={{ scale: 0.97 }} transition={{ duration: 0.09 }}>{n}</motion.button>
            ))}
          </div>
        </div>
        <div className="xbr-bench b">
          <h3 className="vc-title">Cards</h3>
          <motion.div className="xbr-card" whileHover={{ y: -8 }} transition={SOFT}>
            <h4 className="vc-title">Card Title</h4>
            <p>This is a standard card component with hover states and consistent styling.</p>
            <span className="xbr-card-a">Learn More →</span>
          </motion.div>
        </div>
        <div className="xbr-bench c">
          <h3 className="vc-title">Badges</h3>
          <div className="xbr-badges"><span className="xbr-badge brand">Brand Badge</span><span className="xbr-badge">Default Badge</span><span className="xbr-badge ok"><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><circle cx="8" cy="8" r="7" fill="currentColor" /><path d="M5 8.3l2 2 4-4.3" fill="none" stroke="var(--b-white)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>Success Badge</span></div>
        </div>
      </div>
    </section>
  );
}

function Assets() {
  const [ok, go] = useCopy('brand@hanzo.ai');
  return (
    <section className="xbr-assets" id="assets" aria-labelledby="xbr-dl-h" data-enter="stretch-scroll">
      <div className="vc-grid" data-stretch>
        <div className="xbr-dl">
          <h2 id="xbr-dl-h" className="vc-headline">Get our brand assets for your projects and presentations.</h2>
          <div className="xbr-plates" aria-hidden="true">
            <span className="k"><MarkSvg s={44} /></span><span className="w"><MarkSvg s={44} /></span><span className="g"><MarkSvg s={44} /></span>
          </div>
          <a href="/press/hanzo-press-kit.zip" download className="xbr-dl-a" data-thumb="Download Assets" data-cta="brand.assets">
            <span className="xbr-dl-i" aria-hidden="true"><svg viewBox="0 0 16 16" width="20" height="20"><path d="M8 2.5v8M4.5 7.5 8 11l3.5-3.5M3 13.5h10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
            <span>Logos and brand assets (ZIP)</span>
          </a>
        </div>
        <div className="xbr-help">
          <h3 className="vc-title">Need brand assistance?</h3>
          <p className="vc-body">Our team can help with custom assets, co-branding requests, and other brand-related inquiries.</p>
          <div className="xbr-help-a">
            <Cta to="/contact" kind="quiet" id="brand.contact">Contact Us</Cta>
            <a href="mailto:brand@hanzo.ai" className="xbr-mail">brand@hanzo.ai</a>
            <motion.button type="button" className="xbr-cp" aria-label="Copy" aria-pressed={ok} whileTap={{ scale: 0.97 }} transition={{ duration: 0.09 }} onClick={go}><CopyIcon ok={ok} /></motion.button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Brand() {
  const root = useRef<HTMLElement>(null);
  useEnter(root); // the five section entrances (./brand/enter.js)
  return (
    <main ref={root} className="vc xbr" style={{ '--acc': 'var(--ink)' }}>
      <Hero />
      <Principles />
      <Colour />
      <Type />
      <Components />
      <Assets />
    </main>
  );
}
