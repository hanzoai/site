'use client';
/* /brand. V2: 8/10 A brand book that is alive: the mark constructs itself on red proofing guides beside a
   128px masked headline; principles as a still manifesto; colour as the one dark room with giant swatches you copy;
   the type chapter is a full-screen specimen whose weight is yours; a working component bench; assets. Accent: proof red.
   Signature: the type specimen. Zen's variable weight sweeps on its own across a screen-filling "Aa" and the whole
   heading scale breathes with it; take the slider and the weight is yours.
   Supporting (3): masked kinetic headline, once; the mark drawing its construction lines and pieces settling in;
   contrast ratios on a split-flap board.
   Beyond: "Will this gray read?" Set any of Hanzo's six grays on Hanzo White or Hanzo Black and its contrast ratio is
   worked out from the two hex values, against the WCAG AA lines (4.5:1 body, 3:1 large). Every word is Hanzo's. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, animate, useInView, useMotionValue, useReducedMotion, useTransform } from 'motion/react';
import { Copy } from '../ui';
import { A, Flap } from '../kit';
import MaskLines from '../v2/MaskLines';
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
  useEffect(() => { const t = setTimeout(() => setLanded(true), 1500); return () => clearTimeout(t); }, []);
  useEffect(() => {
    if (calm || !live || !landed) return;
    const t = setTimeout(() => setApart((v) => !v), apart ? 1500 : 2800);
    return () => clearTimeout(t);
  }, [apart, calm, live, landed]);
  const g = [0, 22.3, 44.6, 67];
  return (
    <div className="xbr-con vc-obj" ref={ref} aria-hidden="true">
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
            animate={{ opacity: 1, x: apart ? DRIFT[i][0] : 0, y: apart ? DRIFT[i][1] : 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 18, delay: landed ? 0 : 0.6 + i * 0.07 }} />
        ))}
      </svg>
      <span className="xbr-con-l vc-kick">{apart ? 'construction' : 'mark'}</span>
    </div>
  );
}

function Hero() {
  return (
    <section className="xbr-hero vc-scene" aria-labelledby="xbr-h1">
      <div className="vc-grid xbr-hero-g">
        <div className="xbr-hero-c">
          <motion.p className="vc-kick acc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>Design System</motion.p>
          <MaskLines as="h1" id="xbr-h1" now lines={['Hanzo Brand', 'Guidelines.']} className="vc-display" />
          <motion.div className="xbr-hero-f" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, ease: EASE, delay: 0.6 }}>
            <p className="vc-lede">How to build interfaces that look like the rest of Hanzo across our platform and products.</p>
            <div className="xbr-acts">
              <a href="#assets" className="x-btn solid xbr-big" data-thumb="Download Assets">Download Assets</a>
              <A to="/press" className="x-btn xbr-big">Press Kit</A>
            </div>
          </motion.div>
        </div>
        <div className="xbr-hero-o"><Construct /></div>
      </div>
    </section>
  );
}

const PRINCIPLES = [['Minimal & Focused', 'Reduce visual noise and focus on essential elements. Each design decision should have purpose and enhance the user experience.'], ['Elegant & Refined', 'Use subtle gradients, appropriate spacing, and thoughtful typography to create elegant and sophisticated interfaces.'], ['Consistent & Cohesive', 'Maintain consistency in design patterns, spacing, and visual hierarchy to create a unified experience across all touchpoints.']];

/* A manifesto that sits still: one principle per row, the line as big as the page allows. */
function Principles() {
  return (
    <section className="vc-sec xbr-pr" aria-labelledby="xbr-pr-h">
      <div className="vc-wrap">
        <h2 id="xbr-pr-h" className="vc-kick acc xbr-pr-h">Design Principles</h2>
        <ol className="xbr-pr-l">
          {PRINCIPLES.map(([t, d], i) => (
            <li key={t} className="vc-grid">
              <span className="xbr-pr-n vc-kick vc-num">{String(i + 1).padStart(2, '0')} / 03</span>
              <h3 className="vc-display s">{t}</h3>
              <p className="vc-body">{d}</p>
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
    <motion.button type="button" className={'xbr-sw' + (big ? ' big' : '') + (dark ? ' dk' : '')} style={{ '--c': hex }} onClick={go} whileTap={{ scale: 0.98 }} aria-label={`${name} ${hex}, copy`}>
      <span className="xbr-sw-t"><b>{name}</b><span className="vc-num">{hex}</span></span>
      <AnimatePresence>{ok && <motion.span className="xbr-ok" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>Copied</motion.span>}</AnimatePresence>
    </motion.button>
  );
}

const GRAYS = [['Gray 900', '#171717'], ['Gray 800', '#262626'], ['Gray 700', '#404040'], ['Gray 600', '#525252'], ['Gray 500', '#737373'], ['Gray 400', '#A3A3A3']];
const GRADS = [['Brand Glow', 'Radial', 'radial-gradient(circle at 50% 40%, rgba(255,255,255,.35), #0A0A0B 62%)'], ['White Fade', 'Linear', 'linear-gradient(180deg, #FFFFFF, rgba(255,255,255,0))'], ['Gray Fade', 'Linear', 'linear-gradient(180deg, #404040, #0A0A0B)']];

const lum = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)).reduce((a, c, i) => a + c * [0.2126, 0.7152, 0.0722][i], 0);
const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };

function Reads() {
  const [bg, setBg] = useState('#FFFFFF');
  return (
    <div className="xbr-reads">
      <div className="xbr-reads-h">
        <h3 className="vc-title">Will this gray read?</h3>
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
              <em className={r >= 4.5 ? 'ok' : r >= 3 ? 'mid' : ''}>{r >= 4.5 ? 'AA body text' : r >= 3 ? 'AA large text only' : 'Below AA'}</em>
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
  useEffect(() => w.on('change', (v) => setVal(Math.round(v))), [w]);
  useEffect(() => {
    if (mine || calm || !live) return;
    const c = animate(w, [w.get(), 200, 900, 560], { duration: 7.5, ease: 'easeInOut', repeat: Infinity });
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
            <span className="vc-kick vc-num">Zen · {val}</span>
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
              <span className="xbr-sc-p vc-kick vc-num" aria-hidden="true">{px}px</span>
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
          <a href="/press/hanzo-press-kit.zip" download className="xbr-dl-a">
            <span className="xbr-dl-i" aria-hidden="true"><svg viewBox="0 0 16 16" width="20" height="20"><path d="M8 2.5v8M4.5 7.5 8 11l3.5-3.5M3 13.5h10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
            Logos and brand assets (ZIP)
          </a>
        </div>
        <div className="xbr-help">
          <h3 className="vc-title">Need brand assistance?</h3>
          <p className="vc-body">Our team can help with custom assets, co-branding requests, and other brand-related inquiries.</p>
          <div className="xbr-help-a">
            <A to="/contact" className="x-btn solid">Contact Us</A>
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
    <main className="vc xbr" style={{ '--acc': '#ff3b30' }}>
      <Hero />
      <Principles />
      <Colour />
      <Type />
      <Components />
      <Assets />
    </main>
  );
}
