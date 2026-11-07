'use client';
/* Brand. Its idea is a brand book that is alive. The hero draws the Hanzo mark from its five pieces on a construction
   grid, and the pieces keep breathing apart and back. Signature moment: the type specimen — Zen's weight sweeps on its
   own, and a slider puts the weight in your hand; the headings of the scale follow your hand. Swatches copy their hex on a click,
   the components work when you press them.
   Signature: the type specimen, Zen's weight sweeping on its own and then in your hand.
   Beyond: "Will this gray read?" Set any of Hanzo's six grays on Hanzo White or Hanzo Black and its contrast ratio is
   worked out from the two hex values, against the WCAG AA lines (4.5:1 body, 3:1 large); switching the background
   flips the ratios on a split-flap board. Every word is Hanzo's. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, animate, useInView, useMotionValue, useReducedMotion, useTransform } from 'motion/react';
import { EASE, Rise, Copy } from '../ui';
import { A, SecHead, Flap } from '../kit';
import './Brand.css';

const PIECES = ['M22.21 67V44.6369H0V67H22.21Z', 'M66.7038 22.3184H22.2534L0.0878906 44.6367H44.4634L66.7038 22.3184Z', 'M22.21 0H0V22.3184H22.21V0Z', 'M66.7198 0H44.5098V22.3184H66.7198V0Z', 'M66.7198 44.6369H44.5098V67H66.7198V44.6369Z'];
const DRIFT = [[-6, 6], [0, 0], [-6, -6], [6, -6], [6, 6]];

function Construct() {
  const [apart, setApart] = useState(false);
  const calm = useReducedMotion();
  const ref = useRef(null);
  const live = useInView(ref, { amount: 0.3 });
  useEffect(() => {
    if (calm || !live) return;
    const t = setTimeout(() => setApart((v) => !v), apart ? 1400 : 2600);
    return () => clearTimeout(t);
  }, [apart, calm, live]);
  return (
    <div className="xbr-con" ref={ref} aria-hidden="true">
      <svg viewBox="-20 -20 107 107">
        {[0, 22.3, 44.6, 67].map((v) => <g key={v}><line x1={v} x2={v} y1="-20" y2="87" className="xbr-g" /><line y1={v} y2={v} x1="-20" x2="87" className="xbr-g" /></g>)}
        <circle cx="33.4" cy="33.5" r="47" className="xbr-g c" />
        {PIECES.map((d, i) => (
          <motion.path key={i} d={d} className="xbr-piece" initial={{ opacity: 0, x: DRIFT[i][0] * 4, y: DRIFT[i][1] * 4 }}
            animate={{ opacity: 1, x: apart ? DRIFT[i][0] : 0, y: apart ? DRIFT[i][1] : 0 }} transition={{ type: 'spring', stiffness: 90, damping: 16, delay: live && !apart ? i * 0.04 : 0 }} />
        ))}
      </svg>
      <span className="xbr-con-l x-mono">{apart ? 'construction' : 'mark'}</span>
    </div>
  );
}

function Hero() {
  const line = (t, d) => <span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: d }}>{t}</motion.span></span>;
  return (
    <section className="xbr-hero" aria-labelledby="xbr-h1">
      <div className="x-wrap xbr-hero-g">
        <div>
          <motion.p className="x-kick" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>Design System</motion.p>
          <h1 id="xbr-h1" className="xbr-h1">{line('Hanzo Brand', 0.05)}{line('Guidelines.', 0.15)}</h1>
          <motion.p className="xbr-lede" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}>How to build interfaces that look like the rest of Hanzo across our platform and products.</motion.p>
          <motion.div className="xbr-acts" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}>
            <motion.span className="x-go" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}><a href="#assets" className="x-btn solid" data-thumb>Download Assets</a></motion.span>
            <motion.span className="x-go" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}><A to="/press" className="x-btn">Press Kit</A></motion.span>
          </motion.div>
        </div>
        <motion.div className="xbr-hero-v" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, ease: EASE, delay: 0.2 }}>
          <Construct />
          <div className="xbr-tile" aria-hidden="true"><img src="/models/kai.webp" alt="" /></div>
        </motion.div>
      </div>
    </section>
  );
}

const PRINCIPLES = [['Minimal & Focused', 'Reduce visual noise and focus on essential elements. Each design decision should have purpose and enhance the user experience.'], ['Elegant & Refined', 'Use subtle gradients, appropriate spacing, and thoughtful typography to create elegant and sophisticated interfaces.'], ['Consistent & Cohesive', 'Maintain consistency in design patterns, spacing, and visual hierarchy to create a unified experience across all touchpoints.']];

function Principles() {
  return (
    <section className="x-sec xbr-pr">
      <div className="x-wrap">
        <SecHead title="Design Principles" />
        <ol className="xbr-pr-l">
          {PRINCIPLES.map(([t, d], i) => (
            <Rise as="li" key={t} delay={i * 0.1}>
              <span className="x-mono">{String(i + 1).padStart(2, '0')} / 03</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </Rise>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- colour: a swatch copies its hex ---------- */
function Swatch({ name, hex, big, dark }) {
  const [ok, setOk] = useState(false);
  const go = async () => { try { await navigator.clipboard.writeText(hex); } catch { /* blocked: the label still confirms */ } setOk(true); setTimeout(() => setOk(false), 1400); };
  return (
    <motion.button type="button" className={'xbr-sw' + (big ? ' big' : '') + (dark ? ' dk' : '')} style={{ '--c': hex }} onClick={go} whileTap={{ scale: 0.97 }} aria-label={`${name} ${hex}, copy`}>
      <span className="xbr-sw-c" />
      <span className="xbr-sw-t"><b>{name}</b><span className="x-mono">{hex}</span></span>
      <AnimatePresence>{ok && <motion.span className="xbr-ok" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>Copied</motion.span>}</AnimatePresence>
    </motion.button>
  );
}

const GRAYS = [['Gray 900', '#171717'], ['Gray 800', '#262626'], ['Gray 700', '#404040'], ['Gray 600', '#525252'], ['Gray 500', '#737373'], ['Gray 400', '#A3A3A3']];
const GRADS = [['Brand Glow', 'Radial', 'radial-gradient(circle at 50% 40%, rgba(255,255,255,.35), #0A0A0B 62%)'], ['White Fade', 'Linear', 'linear-gradient(180deg, #FFFFFF, rgba(255,255,255,0))'], ['Gray Fade', 'Linear', 'linear-gradient(180deg, #404040, #0A0A0B)']];

/* Beyond: WCAG contrast of each gray on the chosen brand background, from the hex values alone */
const lum = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)).reduce((a, c, i) => a + c * [0.2126, 0.7152, 0.0722][i], 0);
const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };

function Reads() {
  const [bg, setBg] = useState('#FFFFFF');
  return (
    <div className="xbr-reads">
      <div className="xbr-reads-h">
        <h3 className="xbr-h3">Will this gray read?</h3>
        <div className="xbr-reads-bg" role="group" aria-label="Background">
          {[['Hanzo White', '#FFFFFF'], ['Hanzo Black', '#0A0A0B']].map(([n, h]) => <button key={h} type="button" aria-pressed={bg === h} onClick={() => setBg(h)}>{n}</button>)}
        </div>
      </div>
      <ul style={{ '--bg': bg }}>
        {GRAYS.map(([n, h]) => {
          const r = contrast(h, bg);
          return (
            <li key={n}>
              <span className="xbr-reads-s" style={{ color: h }} aria-hidden="true">Aa</span>
              <b>{n}</b>
              <Flap value={r.toFixed(2) + ':1'} className="x-mono" />
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
    <section className="x-sec xbr-col" data-room="dark">
      <div className="x-wrap">
        <SecHead dark title="Color Palette" lede="Our colors are carefully selected to create a bold, modern aesthetic." />
        <h3 className="xbr-h3">Brand Colors</h3>
        <div className="xbr-brand"><Swatch name="Hanzo Black" hex="#0A0A0B" big dark /><Swatch name="Hanzo White" hex="#FFFFFF" big /></div>
        <h3 className="xbr-h3">Gray Scale</h3>
        <div className="xbr-grays">{GRAYS.map(([n, h]) => <Swatch key={n} name={n} hex={h} dark={h !== '#A3A3A3'} />)}</div>
        <Reads />
        <h3 className="xbr-h3">Gradients</h3>
        <div className="xbr-grads">{GRADS.map(([n, k, bg]) => <div key={n} className="xbr-grad"><span style={{ background: bg }} /><b>{n}</b><small className="x-mono">{k}</small></div>)}</div>
      </div>
    </section>
  );
}

/* ---------- type: the weight is yours ---------- */
const SCALE = [['Heading 1', 'Large page titles, hero sections', 56], ['Heading 2', 'Section titles, major divisions', 40], ['Heading 3', 'Subsection headings, feature headings', 30], ['Heading 4', 'Card titles, minor section headings', 22], ['Body Large', 'Featured paragraphs, pull quotes', 19], ['Body', 'Primary body text', 16], ['Caption', 'Supporting text, metadata, labels', 13]];

function Type() {
  const w = useMotionValue(560);
  const [val, setVal] = useState(560);
  const [mine, setMine] = useState(false);
  const calm = useReducedMotion();
  const ref = useRef(null);
  const live = useInView(ref, { amount: 0.3 });
  const fw = useTransform(w, (v) => Math.round(v));
  useEffect(() => w.on('change', (v) => setVal(Math.round(v))), [w]);
  useEffect(() => {
    if (mine || calm || !live) return;
    const c = animate(w, [560, 200, 900, 560], { duration: 7, ease: 'easeInOut', repeat: Infinity });
    return () => c.stop();
  }, [mine, calm, live, w]);
  return (
    <section className="x-sec xbr-type" ref={ref}>
      <div className="x-wrap">
        <SecHead title="Typography" lede="Clean, readable typography is essential to our design language." />
        <div className="xbr-spec">
          <motion.p className="xbr-spec-a" style={{ fontWeight: fw }} aria-hidden="true">Aa</motion.p>
          <div className="xbr-spec-c">
            <span className="x-mono">Zen · {val}</span>
            <input type="range" min={100} max={900} step={1} value={val} aria-label="Font weight"
              onChange={(e) => { setMine(true); w.stop(); w.set(+e.target.value); }} style={{ '--p': ((val - 100) / 8) + '%' }} />
            <span className="xbr-spec-r x-mono"><span>100</span><span>900</span></span>
          </div>
        </div>
        <ol className="xbr-scale">
          {SCALE.map(([n, d, px]) => (
            <li key={n}>
              <motion.span className="xbr-sc-n" style={{ fontSize: px, fontWeight: mine && n.startsWith('Heading') ? fw : undefined }}>{n}</motion.span>
              <span className="xbr-sc-d">{d}</span>
              <span className="xbr-sc-p x-mono" aria-hidden="true">{px}px</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- components you can try ---------- */
function Components() {
  const [pressed, setPressed] = useState('');
  const press = (n) => { setPressed(n); setTimeout(() => setPressed(''), 900); };
  return (
    <section className="x-sec xbr-comp">
      <div className="x-wrap">
        <SecHead title="Components" lede="Reusable UI components that maintain consistency across our products." />
        <div className="xbr-comp-g">
          <div className="xbr-bench">
            <h3>Buttons</h3>
            <div className="xbr-btns">
              {[['Primary Button', 'p'], ['Secondary Button', 's'], ['Ghost Button', 'g'], ['Link Button', 'l']].map(([n, k]) => (
                <motion.button key={k} type="button" className={'xbr-b ' + k} whileHover={{ scale: k === 'l' ? 1 : 1.03 }} whileTap={{ scale: 0.95 }} onClick={() => press(n)}>{n}</motion.button>
              ))}
            </div>
            <p className="xbr-out x-mono" aria-live="polite">{pressed ? '→ ' + pressed : ' '}</p>
          </div>
          <div className="xbr-bench">
            <h3>Cards</h3>
            <motion.div className="xbr-card" whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }}>
              <h4>Card Title</h4>
              <p>This is a standard card component with hover states and consistent styling.</p>
              <span className="xbr-card-a">Learn More →</span>
            </motion.div>
          </div>
          <div className="xbr-bench">
            <h3>Badges</h3>
            <div className="xbr-badges"><span className="xbr-badge brand">Brand Badge</span><span className="xbr-badge">Default Badge</span><span className="xbr-badge ok">Success Badge</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Assets() {
  return (
    <section className="xbr-assets" id="assets">
      <div className="x-wrap">
        <div className="xbr-assets-g">
          <div className="xbr-dl">
            <p>Get our brand assets for your projects and presentations.</p>
            <a href="/press/hanzo-press-kit.zip" download className="xbr-dl-a">
              <span className="xbr-dl-i" aria-hidden="true"><svg viewBox="0 0 16 16" width="18" height="18"><path d="M8 2.5v8M4.5 7.5 8 11l3.5-3.5M3 13.5h10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
              Logos and brand assets (ZIP)
            </a>
          </div>
          <div className="xbr-help">
            <h3>Need brand assistance?</h3>
            <p>Our team can help with custom assets, co-branding requests, and other brand-related inquiries.</p>
            <div className="xbr-help-a">
              <A to="/contact" className="x-btn solid">Contact Us</A>
              <a href="mailto:brand@hanzo.ai" className="xbr-mail">brand@hanzo.ai</a>
              <Copy text="brand@hanzo.ai" label="Copy" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Brand() {
  return (
    <main className="xbr">
      <Hero />
      <Principles />
      <Colour />
      <Type />
      <Components />
      <Assets />
    </main>
  );
}
