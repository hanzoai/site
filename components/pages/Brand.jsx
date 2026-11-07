'use client';
/* /brand. Story page (treated so; MASTER 4), Hanzo's deck only.
   V2: 8/10 (7 Nov re-walk: colour-room h3s visible again on black, the contrast board swaps White to Black and back
   once in view with a gliding pill, compass ticks arrive after their circle, CSS colours on deck tokens.)
   A brand book that is a drawing, in Hanzo's own black, white and greys. The hero is the mark's
   construction drawn full-bleed across the stage (not a card): once the curtain lifts, the guides draw, the five
   pieces land, the mark opens once to show its build, and then it stays alive: its pieces lean toward the pointer
   anywhere in the hero, and the compass turns slowly (pause control). The principles are a pinned scene, one line
   replacing the last, each with its giant numeral; the colour room opens its gray strip from one bar into six; the
   type chapter is a full-screen specimen whose weight sweeps once when it is in view, then is yours; a working
   component bench; assets with the marks they contain.
   Persona: a designer, partner or journalist who needs the marks and rules (PLAN 1.1 "Investor and press").
   Goal: take the brand assets. CTA: "Download Assets" (to the assets ZIP), metric: the one contact click
   (cta_click brand.*); one solid per screen, carried by the site's shared ask bar after the hero.
   Signature: the type specimen. Zen's variable weight sweeps once across a screen-filling "Aa" with the whole heading
   scale moving in time, as soon as the specimen is on screen; then the slider puts the weight in your hand.
   Supporting (3): line-mask headlines, once; the hero drawing (draws in, leans to the pointer, its compass turning
   slowly with a pause); the principles as a pinned scene. The colour room's strip opening is its entrance.
   Beyond: set any of Hanzo's six grays on Hanzo White or Hanzo Black and see, as a shape, whether it meets the WCAG AA
   line, worked out from the two hex values (filled check 4.5:1, half disc 3:1 large text only, cross below).
   Deletes: the proof-red accent; every eyebrow and kicker over a headline ("Design System", "Design Principles",
   "01 / 03" over each principle, mono group labels); the card hero /press shared; the endless breathing and weight
   loops; invented words and figures (the contrast ratios, the weight readout and its 100 / 900, the bench echo,
   "construction", "mark", "Copied"); the tick on a failed copy.
   Every word is Hanzo's. */
import { useEffect, useRef, useState } from 'react';
import { motion, animate, useInView, useMotionValue, useReducedMotion, useTransform } from 'motion/react';
import { Cta } from '../kit';
import MaskLines from './company/MaskLines';
import PinScenes from './company/PinScenes';
import useArrived from './company/useArrived';
import '../v2/vc-type.css';
import './company/deck.css';
import './Brand.css';

const EASE = [0.16, 1, 0.3, 1];
// MASTER 3.1: no springs, no overshoot. Arrivals use ease-emphasis; things the hand moves settle in 300 ms.
const LAND = { duration: 0.8, ease: EASE };
const SOFT = { duration: 0.3, ease: EASE };
// JS off: the hero's lede, asks and the drawing show in place (PLAN 2.3)
const NOJS = { __html: '<style>.xbr-hero-f,.xbr-piece,.xbr-dr{opacity:1!important;transform:none!important}.xbr-g{stroke-dasharray:none!important;stroke-dashoffset:0!important}.xbr-ticks{opacity:1!important}.xbr-grays .xbr-sw{transform:none!important}</style>' };

const PIECES = ['M22.21 67V44.6369H0V67H22.21Z', 'M66.7038 22.3184H22.2534L0.0878906 44.6367H44.4634L66.7038 22.3184Z', 'M22.21 0H0V22.3184H22.21V0Z', 'M66.7198 0H44.5098V22.3184H66.7198V0Z', 'M66.7198 44.6369H44.5098V67H66.7198V44.6369Z'];
const FROM = [[-18, 22], [0, 0], [-18, -22], [18, -22], [18, 22]];
const DRIFT = [[-4, 4], [0, 0], [-4, -4], [4, -4], [4, 4]];
const DEPTH = [3.2, 1.2, 3.2, 3.2, 3.2]; // how far each piece leans toward the pointer (the corner blocks lean most)

/* One piece of the mark: it lands, opens with the others, and leans toward the pointer (300 ms, ease-emphasis). */
function Piece({ d, i, go, open, mx, my }) {
  const land = useMotionValue(1);
  const op = useMotionValue(0);
  useEffect(() => { if (go) { const c = animate(land, 0, { ...LAND, delay: 0.25 + i * 0.07 }); return () => c.stop(); } }, [go]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { const c = animate(op, open ? 1 : 0, SOFT); return () => c.stop(); }, [open]); // eslint-disable-line react-hooks/exhaustive-deps
  const x = useTransform([land, op, mx], ([l, o, m]) => l * FROM[i][0] + o * DRIFT[i][0] + m * DEPTH[i]);
  const y = useTransform([land, op, my], ([l, o, m]) => l * FROM[i][1] + o * DRIFT[i][1] + m * DEPTH[i]);
  return <motion.path d={d} className="xbr-piece" style={{ x, y }} initial={{ opacity: 0 }} animate={go ? { opacity: 1 } : undefined} transition={{ duration: 0.4, delay: 0.25 + i * 0.07 }} />;
}

/* The construction, drawn full-bleed on the hero's stage. */
function Drawing({ mx, my }) {
  const ref = useRef(null);
  const live = useInView(ref, { amount: 0.3 });
  const calm = useReducedMotion();
  const ok = useArrived();
  const go = ok || calm;
  const [open, setOpen] = useState(false);
  const once = useRef(false);
  useEffect(() => { // once landed it opens to show its build one time, then closes and rests
    if (calm || !go || !live || once.current) return;
    once.current = true;
    const a = setTimeout(() => setOpen(true), 1700);
    const b = setTimeout(() => setOpen(false), 3300);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, [calm, go, live]);
  // the compass turns slowly (one turn a minute) while the hero is seen; Pause stops it (WCAG 2.2.2)
  const [spin, setSpin] = useState(true);
  const turn = useMotionValue(0);
  useEffect(() => {
    if (calm || !go || !live || !spin) return;
    const c = animate(turn, turn.get() + 360, { duration: 60, ease: 'linear', repeat: Infinity });
    return () => c.stop();
  }, [calm, go, live, spin, turn]);
  const g = [0, 22.3, 44.6, 67];
  const draw = (k) => ({ initial: { pathLength: 0 }, animate: go ? { pathLength: 1 } : undefined, transition: { duration: 1.1, ease: EASE, delay: k } });
  return (
    <div className={'xbr-dr' + (go ? ' on' : '')} ref={ref}>
      <svg viewBox="-60 -60 187 187" aria-hidden="true">
        {g.map((v, i) => (
          <g key={v}>
            <motion.line x1={v} x2={v} y1="-200" y2="270" className="xbr-g" {...draw(0.05 + i * 0.06)} />
            <motion.line y1={v} y2={v} x1="-260" x2="270" className="xbr-g" {...draw(0.1 + i * 0.06)} />
          </g>
        ))}
        <motion.g className="xbr-compass" style={{ rotate: turn, originX: '33.4px', originY: '33.5px', transformBox: 'view-box' }}>
          <motion.circle cx="33.4" cy="33.5" r="47.3" className="xbr-g c" {...draw(0.35)} />
          <motion.line x1="-30" y1="97" x2="97" y2="-30" className="xbr-g c" {...draw(0.5)} />
          <g className="xbr-ticks">{Array.from({ length: 24 }, (_, i) => {
            const a = (i / 24) * Math.PI * 2, r1 = 47.3, r2 = i % 6 ? 45.3 : 43.3;
            const f = (v) => Math.round(v * 100) / 100; // rounded: server and browser maths then print the same numbers
            return <line key={i} x1={f(33.4 + Math.cos(a) * r1)} y1={f(33.5 + Math.sin(a) * r1)} x2={f(33.4 + Math.cos(a) * r2)} y2={f(33.5 + Math.sin(a) * r2)} className="xbr-tick" />;
          })}</g>
        </motion.g>
        {PIECES.map((d, i) => <Piece key={i} d={d} i={i} go={go} open={open} mx={mx} my={my} />)}
      </svg>
      {!calm && (
        <button type="button" className="xbr-pause" aria-label={spin ? 'Pause' : 'Replay'} aria-pressed={!spin} onClick={() => setSpin((v) => !v)}>
          {spin
            ? <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M5 3.5v9M11 3.5v9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
            : <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M5 3.2v9.6L12.5 8z" fill="currentColor" /></svg>}
        </button>
      )}
    </div>
  );
}

function Hero() {
  const ok = useArrived();
  const calm = useReducedMotion();
  // the pointer anywhere in the hero pulls the pieces toward it (fine pointers only), settling in 300 ms (no spring)
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const to = (mv, v) => animate(mv, v, SOFT);
  const lean = (e) => {
    if (calm || (e.pointerType !== 'mouse' && e.pointerType !== 'pen')) return;
    const art = e.currentTarget.querySelector('.xbr-dr svg');
    if (!art) return;
    const r = art.getBoundingClientRect();
    const cx = r.left + r.width * 0.5, cy = r.top + r.height * 0.5;
    to(mx, Math.max(-1, Math.min(1, (e.clientX - cx) / (r.width * 0.9))));
    to(my, Math.max(-1, Math.min(1, (e.clientY - cy) / (r.height * 0.9))));
  };
  return (
    <section className="xbr-hero vc-scene" aria-label="Design System" data-ask-name="Hanzo Brand Guidelines" onPointerMove={lean} onPointerLeave={() => { to(mx, 0); to(my, 0); }}>
      <noscript dangerouslySetInnerHTML={NOJS} />
      <Drawing mx={mx} my={my} />
      <div className="vc-grid xbr-hero-g">
        <div className="xbr-hero-c">
          <MaskLines as="h1" id="xbr-h1" now lines={['Hanzo Brand', 'Guidelines.']} className="vc-display" />
          <motion.div className="xbr-hero-f" initial={{ opacity: 0, y: 12 }} animate={ok ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 0.52, ease: EASE, delay: 0.45 }}>
            <p className="vc-lede">How to build interfaces that look like the rest of Hanzo across our platform and products.</p>
            <div className="xbr-acts">
              <Cta to="/brand#assets" className="xbr-big" id="brand.hero" thumb>Download Assets</Cta>
              <Cta to="/press" kind="quiet" className="xbr-big" id="brand.press">Press Kit</Cta>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ---------- principles: a pinned scene, one line replacing the last, each with its giant numeral ---------- */
const PRINCIPLES = [['Minimal & Focused', 'Reduce visual noise and focus on essential elements. Each design decision should have purpose and enhance the user experience.'], ['Elegant & Refined', 'Use subtle gradients, appropriate spacing, and thoughtful typography to create elegant and sophisticated interfaces.'], ['Consistent & Cohesive', 'Maintain consistency in design patterns, spacing, and visual hierarchy to create a unified experience across all touchpoints.']];
const MarkSvg = ({ s = 40 }) => <svg viewBox="0 0 67 67" width={s} height={s} aria-hidden="true">{PIECES.map((d, i) => <path key={i} d={d} fill="currentColor" />)}</svg>;
// each numeral stands in the principle's own material: one mark in a lot of space, the Brand Glow, the mark on a grid
const Numeral = ({ i }) => (
  <div className={'xbr-num n' + i}>
    {i === 2 && <span className="xbr-num-grid" aria-hidden="true">{Array.from({ length: 16 }, (_, k) => <MarkSvg key={k} s={26} />)}</span>}
    {i === 0 && <span className="xbr-num-mark" aria-hidden="true"><MarkSvg s={30} /></span>}
    <span className="xbr-num-n vc-num"><b>{String(i + 1).padStart(2, '0')}</b> / 03</span>
  </div>
);

function Principles() {
  return (
    <section className="xbr-pr" aria-label="Design Principles">
      <PinScenes
        label="Design Principles"
        className="xbr-pin"
        scenes={PRINCIPLES.map(([t, d], i) => ({
          key: t,
          title: <h2 className="vc-display s xbr-pr-t">{t}</h2>,
          body: <p className="vc-body">{d}</p>,
          visual: <Numeral i={i} />,
        }))}
      />
    </section>
  );
}

/* ---------- colour: the one dark room ---------- */
// Copy only ticks when the clipboard really took the text; a blocked clipboard leaves the copy icon as it was.
function useCopy(text) {
  const [ok, setOk] = useState(false);
  const t = useRef(0);
  const go = async () => {
    try { await navigator.clipboard.writeText(text); } catch { return; }
    setOk(true); clearTimeout(t.current); t.current = setTimeout(() => setOk(false), 1400);
  };
  return [ok, go];
}
const CopyIcon = ({ ok }) => (ok
  ? <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><motion.path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} /></svg>
  : <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><rect x="5" y="5" width="8.5" height="8.5" rx="2" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="M10.5 3.2V3a.8.8 0 0 0-.8-.8H3a.8.8 0 0 0-.8.8v6.7c0 .44.36.8.8.8h.2" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>);

function Swatch({ name, hex, big, dark, i = 0, fan }) {
  const [ok, go] = useCopy(hex);
  const enter = fan ? { initial: { x: `${-i * 100}%` }, whileInView: { x: '0%' }, viewport: { once: true, amount: 0.7 }, transition: { duration: 0.8, ease: EASE, delay: 0.1 + (5 - i) * 0.04 } } : {};
  return (
    <motion.button type="button" className={'xbr-sw' + (big ? ' big' : '') + (dark ? ' dk' : '')} style={{ '--c': hex, zIndex: fan ? 6 - i : undefined }} onClick={go} whileTap={{ scale: 0.97 }} transition={{ duration: 0.09 }} aria-label={`${name} ${hex}`} aria-pressed={ok} {...enter}>
      <span className="xbr-sw-t"><b>{name}</b><span className="vc-num">{hex}</span></span>
      <span className="xbr-ok" aria-hidden="true"><CopyIcon ok={ok} /></span>
    </motion.button>
  );
}

const GRAYS = [['Gray 900', '#171717'], ['Gray 800', '#262626'], ['Gray 700', '#404040'], ['Gray 600', '#525252'], ['Gray 500', '#737373'], ['Gray 400', '#A3A3A3']];
const GRADS = [['Brand Glow', 'Radial', 'radial-gradient(circle at 50% 40%, rgba(255,255,255,.35), #0A0A0B 62%)'], ['White Fade', 'Linear', 'linear-gradient(180deg, #FFFFFF, rgba(255,255,255,0))'], ['Gray Fade', 'Linear', 'linear-gradient(180deg, #404040, #0A0A0B)']];

const lum = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)).reduce((a, c, i) => a + c * [0.2126, 0.7152, 0.0722][i], 0);
const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };

/* The WCAG AA line as a shape: a filled check (4.5:1, body text), a half disc (3:1, large text only), a cross (below). */
function Verdict({ r }) {
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
function Reads() {
  const [bg, setBg] = useState('#FFFFFF');
  const ref = useRef(null);
  const seen = useInView(ref, { amount: 0.6, once: true });
  const calm = useReducedMotion();
  const mine = useRef(false);
  useEffect(() => {
    if (!seen || calm || mine.current) return;
    const a = setTimeout(() => { if (!mine.current) setBg('#0A0A0B'); }, 900);
    const b = setTimeout(() => { if (!mine.current) setBg('#FFFFFF'); }, 3600);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, [seen, calm]);
  const pick = (h) => { mine.current = true; setBg(h); };
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
  return (
    <section className="vc-sec xbr-col" data-room="dark" aria-labelledby="xbr-col-h">
      <div className="vc-grid xbr-col-g">
        <header className="xbr-col-h">
          <MaskLines id="xbr-col-h" lines={['Color Palette']} className="vc-display m" />
          <p className="vc-lede">Our colors are carefully selected to create a bold, modern aesthetic.</p>
        </header>
        <h3 className="vc-title xbr-sub">Brand Colors</h3>
        <div className="xbr-brand"><Swatch name="Hanzo Black" hex="#0A0A0B" big dark /><Swatch name="Hanzo White" hex="#FFFFFF" big /></div>
        <h3 className="vc-title xbr-sub">Gray Scale</h3>
        <div className="xbr-grays">{GRAYS.map(([n, h], i) => <Swatch key={n} name={n} hex={h} dark={h !== '#A3A3A3'} i={i} fan />)}</div>
        <Reads />
        <h3 className="vc-title xbr-sub">Gradients</h3>
        <div className="xbr-grads">{GRADS.map(([n, k, bg]) => <div key={n} className="xbr-grad"><span style={{ background: bg }} /><b>{n}</b><small>{k}</small></div>)}</div>
      </div>
    </section>
  );
}

/* ---------- type: the signature. The weight sweeps once when the specimen is on screen; the slider makes it yours. ---------- */
const SCALE = [['Heading 1', 'Large page titles, hero sections', 56], ['Heading 2', 'Section titles, major divisions', 40], ['Heading 3', 'Subsection headings, feature headings', 30], ['Heading 4', 'Card titles, minor section headings', 22], ['Body Large', 'Featured paragraphs, pull quotes', 19], ['Body', 'Primary body text', 16], ['Caption', 'Supporting text, metadata, labels', 13]];

function Type() {
  const w = useMotionValue(560);
  const [val, setVal] = useState(560);
  const [mine, setMine] = useState(false);
  const calm = useReducedMotion();
  const spec = useRef(null);
  const live = useInView(spec, { amount: 0.6 }); // the specimen itself, well on screen: the sweep is seen whole
  const fw = useTransform(w, (v) => Math.round(v));
  const swept = useRef(false);
  useEffect(() => w.on('change', (v) => setVal(Math.round(v))), [w]);
  useEffect(() => {
    if (mine || calm || !live || swept.current) return;
    swept.current = true; // one sweep (under 5 s, WCAG 2.2.2), then it rests at 560 and the slider is yours
    const c = animate(w, [w.get(), 200, 900, 560], { duration: 4.6, ease: 'easeInOut' });
    return () => c.stop();
  }, [mine, calm, live, w]);
  return (
    <section className="vc-sec xbr-type" aria-labelledby="xbr-type-h">
      <div className="vc-grid xbr-type-g">
        <header className="xbr-type-h">
          <h2 id="xbr-type-h" className="vc-headline">Typography</h2>
          <p className="vc-body">Clean, readable typography is essential to our design language.</p>
        </header>
        <div className="xbr-spec" ref={spec}>
          <motion.p className="xbr-spec-a" style={{ fontWeight: fw }} aria-hidden="true">Aa</motion.p>
          <div className="xbr-spec-c">
            <input type="range" min={100} max={900} step={1} value={val} aria-label="Font weight"
              onChange={(e) => { setMine(true); w.stop(); w.set(+e.target.value); }} style={{ '--p': ((val - 100) / 8) + '%' }} />
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
    <section className="vc-sec xbr-comp" aria-labelledby="xbr-comp-h">
      <div className="vc-grid">
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
    <section className="xbr-assets" id="assets" aria-labelledby="xbr-dl-h">
      <div className="vc-grid">
        <div className="xbr-dl">
          <h2 id="xbr-dl-h" className="vc-headline">Get our brand assets for your projects and presentations.</h2>
          <div className="xbr-plates" aria-hidden="true">
            <span className="k"><MarkSvg s={44} /></span><span className="w"><MarkSvg s={44} /></span><span className="g"><MarkSvg s={44} /></span>
          </div>
          <a href="/press/hanzo-press-kit.zip" download className="xbr-dl-a" data-thumb="Download Assets" data-cta="brand.assets">
            <span className="xbr-dl-i" aria-hidden="true"><svg viewBox="0 0 16 16" width="20" height="20"><path d="M8 2.5v8M4.5 7.5 8 11l3.5-3.5M3 13.5h10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
            Logos and brand assets (ZIP)
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
  return (
    <main className="vc xbr" style={{ '--acc': 'var(--ink)' }}>
      <Hero />
      <Principles />
      <Colour />
      <Type />
      <Components />
      <Assets />
    </main>
  );
}
