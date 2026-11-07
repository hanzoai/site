'use client';
/* /brand. V2: 8/10 A brand book that is alive, in Hanzo's own black, white and greys: the mark builds itself on its
   construction grid beside a 128px masked headline and opens up under the pointer; principles as a still manifesto,
   each with its own small demonstration in the brand's marks and gradients; colour as the one dark room with giant
   swatches you copy; the type chapter is a full-screen specimen whose weight sweeps once and then is yours; a working
   component bench; assets.
   Persona: a designer, partner or journalist who needs the marks and rules (PLAN 1.1 "Investor and press").
   Goal: take the brand assets. CTA: "Download Assets" (to the assets ZIP), metric: the one contact click
   (cta_click brand.*); one solid per screen, carried by the site's shared ask bar after the hero.
   Signature: the type specimen. Zen's variable weight sweeps once across a screen-filling "Aa" with the whole heading
   scale moving in time, then rests; the slider puts the weight in your hand.
   Supporting (3): masked kinetic headline, once; the mark drawing its construction lines and settling (and opening
   under the pointer); contrast ratios on a split-flap board.
   Beyond: Set any of Hanzo's six grays on Hanzo White or Hanzo Black and its contrast ratio is worked out from the two
   hex values against the WCAG AA lines (4.5:1 body, 3:1 large), shown as a figure and a shape (pass, large only, fail).
   Deletes: the proof-red accent and every eyebrow ("Design System", "Design Principles" as a label); the endless
   construction breathing and the endless weight sweep; the invented words ("construction", "mark", "Copied",
   "Will this gray read?", "AA body text", "AA large text only", "Below AA", "Zen ·") and the invented px sizes.
   Every word is Hanzo's. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, animate, useInView, useMotionValue, useReducedMotion, useTransform } from 'motion/react';
import { Copy, Btn } from '../ui';
import { A, Flap } from '../kit';
import { href as hrefOf } from '../../lib/route';
import MaskLines from './company/MaskLines';
import '../v2/vc-type.css';
import './Brand.css';

const EASE = [0.16, 1, 0.3, 1];
const PIECES = ['M22.21 67V44.6369H0V67H22.21Z', 'M66.7038 22.3184H22.2534L0.0878906 44.6367H44.4634L66.7038 22.3184Z', 'M22.21 0H0V22.3184H22.21V0Z', 'M66.7198 0H44.5098V22.3184H66.7198V0Z', 'M66.7198 44.6369H44.5098V67H66.7198V44.6369Z'];
const FROM = [[-18, 22], [0, 0], [-18, -22], [18, -22], [18, 22]];
const DRIFT = [[-4, 4], [0, 0], [-4, -4], [4, -4], [4, 4]];

/* The mark, built on its grid: proofing guides draw in, the five pieces land, then breathe apart and back. */
function Construct() {
  const ref = useRef(null);
  const live = useInView(ref, { amount: 0.3 });
  const calm = useReducedMotion();
  const [apart, setApart] = useState(false);
  const [landed, setLanded] = useState(false);
  const [hand, setHand] = useState(false);
  useEffect(() => { const t = setTimeout(() => setLanded(true), 1500); return () => clearTimeout(t); }, []);
  // once landed it opens to show its construction one time, then closes and rests; after that the pointer opens it
  const once = useRef(false);
  useEffect(() => {
    if (calm || !live || !landed || once.current) return;
    once.current = true;
    const a = setTimeout(() => setApart(true), 600);
    const b = setTimeout(() => setApart(false), 2300);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, [calm, live, landed]);
  const open = apart || hand;
  const g = [0, 22.3, 44.6, 67];
  return (
    <div className="xbr-con vc-obj" ref={ref} aria-hidden="true" onPointerEnter={() => setHand(true)} onPointerLeave={() => setHand(false)}>
      <svg viewBox="-24 -24 115 115">
        {g.map((v, i) => (
          <g key={v}>
            <motion.line x1={v} x2={v} y1="-24" y2="91" className="xbr-g" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.1, ease: EASE, delay: 0.2 + i * 0.06 }} />
            <motion.line y1={v} y2={v} x1="-24" x2="91" className="xbr-g" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.1, ease: EASE, delay: 0.26 + i * 0.06 }} />
          </g>
        ))}
        <motion.circle cx="33.4" cy="33.5" r="47.3" className="xbr-g red" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.6, ease: EASE, delay: 0.5 }} />
        <motion.line x1="-24" y1="91" x2="91" y2="-24" className="xbr-g red" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease: EASE, delay: 0.7 }} />
        {PIECES.map((d, i) => (
          <motion.path key={i} d={d} className="xbr-piece"
            initial={{ opacity: 0, x: FROM[i][0], y: FROM[i][1] }}
            animate={{ opacity: 1, x: open ? DRIFT[i][0] : 0, y: open ? DRIFT[i][1] : 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 18, delay: landed ? 0 : 0.6 + i * 0.07 }} />
        ))}
      </svg>
    </div>
  );
}

function Hero() {
  return (
    <section className="xbr-hero vc-scene" aria-label="Design System" data-ask-name="Hanzo Brand Guidelines">
      <div className="vc-grid xbr-hero-g">
        <div className="xbr-hero-c">
          <MaskLines as="h1" id="xbr-h1" now lines={['Hanzo Brand', 'Guidelines.']} className="vc-display" />
          <motion.div className="xbr-hero-f" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, ease: EASE, delay: 0.6 }}>
            <p className="vc-lede">How to build interfaces that look like the rest of Hanzo across our platform and products.</p>
            <div className="xbr-acts">
              <Btn href="#assets" solid className="xbr-big" data-thumb="Download Assets" data-cta="brand.hero">Download Assets</Btn>
              <Btn href={hrefOf('/press')} className="xbr-big" data-cta="brand.press">Press Kit</Btn>
            </div>
          </motion.div>
        </div>
        <div className="xbr-hero-o"><Construct /></div>
      </div>
    </section>
  );
}

const PRINCIPLES = [['Minimal & Focused', 'Reduce visual noise and focus on essential elements. Each design decision should have purpose and enhance the user experience.'], ['Elegant & Refined', 'Use subtle gradients, appropriate spacing, and thoughtful typography to create elegant and sophisticated interfaces.'], ['Consistent & Cohesive', 'Maintain consistency in design patterns, spacing, and visual hierarchy to create a unified experience across all touchpoints.']];

/* A manifesto that sits still: one principle per row, the line as big as the page allows, and beside it the
   principle shown in the brand's own material: one mark in a lot of space, the Brand Glow, the mark repeated on a grid. */
const MarkSvg = ({ s = 40 }) => <svg viewBox="0 0 67 67" width={s} height={s} aria-hidden="true">{PIECES.map((d, i) => <path key={i} d={d} fill="currentColor" />)}</svg>;
const SHOW = [
  <span key="a" className="xbr-show a"><MarkSvg s={28} /></span>,
  <span key="b" className="xbr-show b" style={{ background: 'radial-gradient(circle at 50% 40%, rgba(255,255,255,.35), #0A0A0B 62%)' }} />,
  <span key="c" className="xbr-show c">{Array.from({ length: 9 }, (_, i) => <MarkSvg key={i} s={22} />)}</span>,
];
function Principles() {
  return (
    <section className="vc-sec xbr-pr" aria-label="Design Principles">
      <div className="vc-wrap">
        <ol className="xbr-pr-l">
          {PRINCIPLES.map(([t, d], i) => (
            <li key={t} className="vc-grid">
              <span className="xbr-pr-n vc-kick vc-num">{String(i + 1).padStart(2, '0')} / 03</span>
              <h3 className="vc-display s">{t}</h3>
              <p className="vc-body">{d}</p>
              {SHOW[i]}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- colour: the one dark room ---------- */
function Swatch({ name, hex, big, dark }) {
  const [ok, setOk] = useState(false);
  const go = async () => { try { await navigator.clipboard.writeText(hex); } catch { /* blocked: the label still confirms */ } setOk(true); setTimeout(() => setOk(false), 1400); };
  return (
    <motion.button type="button" className={'xbr-sw' + (big ? ' big' : '') + (dark ? ' dk' : '')} style={{ '--c': hex }} onClick={go} whileTap={{ scale: 0.98 }} aria-label={`${name} ${hex}`} aria-pressed={ok}>
      <span className="xbr-sw-t"><b>{name}</b><span className="vc-num">{hex}</span></span>
      <span className="xbr-ok" aria-hidden="true">
        <AnimatePresence initial={false} mode="popLayout">
          {ok
            ? <motion.svg key="t" viewBox="0 0 16 16" width="16" height="16" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }}><motion.path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.35 }} /></motion.svg>
            : <motion.svg key="c" viewBox="0 0 16 16" width="16" height="16" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }}><rect x="5" y="5" width="8.5" height="8.5" rx="2" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="M10.5 3.2V3a.8.8 0 0 0-.8-.8H3a.8.8 0 0 0-.8.8v6.7c0 .44.36.8.8.8h.2" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></motion.svg>}
        </AnimatePresence>
      </span>
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
    <span className={'xbr-v ' + k} role="img" aria-label={k === 'ok' ? 'WCAG AA 4.5:1' : k === 'mid' ? 'WCAG AA 3:1' : 'below WCAG AA'}>
      <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true">
        <circle cx="10" cy="10" r="8.5" fill={k === 'ok' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" />
        {k === 'mid' && <path d="M10 1.5a8.5 8.5 0 0 1 0 17z" fill="currentColor" />}
        {k === 'ok' && <path d="M6.3 10.4l2.4 2.4 5-5.2" fill="none" stroke="var(--bg)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />}
        {k === 'no' && <path d="M7 7l6 6M13 7l-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />}
      </svg>
    </span>
  );
}

function Reads() {
  const [bg, setBg] = useState('#FFFFFF');
  return (
    <div className="xbr-reads" role="group" aria-label="Gray Scale on Hanzo White or Hanzo Black">
      <div className="xbr-reads-h">
        <div className="xbr-seg" role="group" aria-label="Background">
          {[['Hanzo White', '#FFFFFF'], ['Hanzo Black', '#0A0A0B']].map(([n, h]) => <button key={h} type="button" aria-pressed={bg === h} onClick={() => setBg(h)}>{n}</button>)}
        </div>
      </div>
      <ul style={{ '--bg': bg }} className={bg === '#FFFFFF' ? 'lt' : 'dk'}>
        {GRAYS.map(([n, h]) => {
          const r = contrast(h, bg);
          return (
            <li key={n}>
              <span className="xbr-reads-s" style={{ color: h }} aria-hidden="true">Aa</span>
              <b>{n}</b>
              <Flap value={r.toFixed(2) + ':1'} className="vc-num" />
              <Verdict r={r} />
            </li>
          );
        })}
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
        <h3 className="vc-kick xbr-sub">Brand Colors</h3>
        <div className="xbr-brand"><Swatch name="Hanzo Black" hex="#0A0A0B" big dark /><Swatch name="Hanzo White" hex="#FFFFFF" big /></div>
        <h3 className="vc-kick xbr-sub">Gray Scale</h3>
        <div className="xbr-grays">{GRAYS.map(([n, h]) => <Swatch key={n} name={n} hex={h} dark={h !== '#A3A3A3'} />)}</div>
        <Reads />
        <h3 className="vc-kick xbr-sub">Gradients</h3>
        <div className="xbr-grads">{GRADS.map(([n, k, bg]) => <div key={n} className="xbr-grad"><span style={{ background: bg }} /><b>{n}</b><small className="vc-kick">{k}</small></div>)}</div>
      </div>
    </section>
  );
}

/* ---------- type: the signature. The weight sweeps by itself; the slider makes it yours. ---------- */
const SCALE = [['Heading 1', 'Large page titles, hero sections', 56], ['Heading 2', 'Section titles, major divisions', 40], ['Heading 3', 'Subsection headings, feature headings', 30], ['Heading 4', 'Card titles, minor section headings', 22], ['Body Large', 'Featured paragraphs, pull quotes', 19], ['Body', 'Primary body text', 16], ['Caption', 'Supporting text, metadata, labels', 13]];

function Type() {
  const w = useMotionValue(560);
  const [val, setVal] = useState(560);
  const [mine, setMine] = useState(false);
  const calm = useReducedMotion();
  const ref = useRef(null);
  const live = useInView(ref, { amount: 0.25 });
  const fw = useTransform(w, (v) => Math.round(v));
  const swept = useRef(false);
  useEffect(() => w.on('change', (v) => setVal(Math.round(v))), [w]);
  useEffect(() => {
    if (mine || calm || !live) return;
    if (swept.current) return;
    swept.current = true; // one sweep (under 5 s, WCAG 2.2.2), then it rests at 560 and the slider is yours
    const c = animate(w, [w.get(), 200, 900, 560], { duration: 4.6, ease: 'easeInOut' });
    return () => c.stop();
  }, [mine, calm, live, w]);
  return (
    <section className="vc-sec xbr-type" ref={ref} aria-labelledby="xbr-type-h">
      <div className="vc-grid xbr-type-g">
        <header className="xbr-type-h">
          <h2 id="xbr-type-h" className="vc-headline">Typography</h2>
          <p className="vc-body">Clean, readable typography is essential to our design language.</p>
        </header>
        <div className="xbr-spec">
          <motion.p className="xbr-spec-a" style={{ fontWeight: fw }} aria-hidden="true">Aa</motion.p>
          <div className="xbr-spec-c">
            <span className="xbr-spec-v vc-num" aria-hidden="true">{val}</span>
            <input type="range" min={100} max={900} step={1} value={val} aria-label="Font weight"
              onChange={(e) => { setMine(true); w.stop(); w.set(+e.target.value); }} style={{ '--p': ((val - 100) / 8) + '%' }} />
            <span className="xbr-spec-r vc-kick vc-num" aria-hidden="true"><span>100</span><span>900</span></span>
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
  const [pressed, setPressed] = useState('');
  const t = useRef(0);
  const press = (n) => { setPressed(n); clearTimeout(t.current); t.current = setTimeout(() => setPressed(''), 1100); };
  return (
    <section className="vc-sec xbr-comp" aria-labelledby="xbr-comp-h">
      <div className="vc-grid">
        <header className="xbr-comp-h">
          <h2 id="xbr-comp-h" className="vc-headline">Components</h2>
          <p className="vc-body">Reusable UI components that maintain consistency across our products.</p>
        </header>
        <div className="xbr-bench a">
          <h3 className="vc-kick">Buttons</h3>
          <div className="xbr-btns">
            {[['Primary Button', 'p'], ['Secondary Button', 's'], ['Ghost Button', 'g'], ['Link Button', 'l']].map(([n, k]) => (
              <motion.button key={k} type="button" className={'xbr-b ' + k} whileTap={{ scale: 0.95 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} onClick={() => press(n)}>{n}</motion.button>
            ))}
          </div>
          <p className="xbr-out vc-kick" aria-live="polite">{pressed ? '→ ' + pressed : ' '}</p>
        </div>
        <div className="xbr-bench b">
          <h3 className="vc-kick">Cards</h3>
          <motion.div className="xbr-card" whileHover={{ y: -8 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
            <h4 className="vc-title">Card Title</h4>
            <p>This is a standard card component with hover states and consistent styling.</p>
            <span className="xbr-card-a">Learn More →</span>
          </motion.div>
        </div>
        <div className="xbr-bench c">
          <h3 className="vc-kick">Badges</h3>
          <div className="xbr-badges"><span className="xbr-badge brand">Brand Badge</span><span className="xbr-badge">Default Badge</span><span className="xbr-badge ok">Success Badge</span></div>
        </div>
      </div>
    </section>
  );
}

function Assets() {
  return (
    <section className="xbr-assets" id="assets" aria-label="Assets">
      <div className="vc-grid">
        <div className="xbr-dl">
          <p className="vc-headline">Get our brand assets for your projects and presentations.</p>
          <a href="/press/hanzo-press-kit.zip" download className="xbr-dl-a" data-thumb="Download Assets" data-cta="brand.assets">
            <span className="xbr-dl-i" aria-hidden="true"><svg viewBox="0 0 16 16" width="20" height="20"><path d="M8 2.5v8M4.5 7.5 8 11l3.5-3.5M3 13.5h10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
            Logos and brand assets (ZIP)
          </a>
        </div>
        <div className="xbr-help">
          <h3 className="vc-title">Need brand assistance?</h3>
          <p className="vc-body">Our team can help with custom assets, co-branding requests, and other brand-related inquiries.</p>
          <div className="xbr-help-a">
            <Btn href={hrefOf('/contact')} data-cta="brand.contact">Contact Us</Btn>
            <a href="mailto:brand@hanzo.ai" className="xbr-mail">brand@hanzo.ai</a>
            <Copy text="brand@hanzo.ai" label="Copy" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Brand() {
  return (
    <main className="vc xbr" style={{ '--acc': '#1d1d1f' }}>
      <Hero />
      <Principles />
      <Colour />
      <Type />
      <Components />
      <Assets />
    </main>
  );
}
