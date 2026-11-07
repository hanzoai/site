'use client';
/* Zen 7 (/zen/7): the next generation, not yet published. A teaser in three calm screens (docs/MASTER.md).
   The giant 7 is this page's one big thing, as the moment: Zen 7's own living field shows only through the numeral (the
   weights are there, not yet out). It sweeps in from the bottom right of the first screen and settles beside the title
   as you scroll (scale and position only). The title rests at 52px.
   Not only scroll: the title cuts in on load, the field drifts and bends to the pointer, the lineage line draws itself and
   its stations land on it, and the research room opens from a card to full width as it is reached.
V2: 8/10 the 7 rises and settles beside a 52px title (and on phone); the lineage is a pinned scrub (a marker travels Zen 6 to Zen 7, stations light and their phrase underlines); the research room draws its own 7 that drifts with the pointer; a pause for the fields
*/
// Persona: researcher who wants early Zen 7 access
// Goal: know Zen 7 is coming open-weight under Apache 2.0, and apply for research access
// CTA: Apply for research access -> /beta (data-cta zen7.hero with data-thumb; again in the research room as zen7.access)
// Metric: GitHub or weights click (researcher row, MASTER section 1); the /beta application itself has no metric id yet
// Signature: the 7 rises: a giant numeral with Zen 7's field showing through it settles beside the title as you scroll
// Beyond: the lineage line: Zen 6's own facts on one end, Zen 7 on the other, and the three things Hanzo says Zen 7 expands landing on the line as it draws
import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { EASE } from '../../ui';
import { A, Cta } from '../../kit';
import Sigil from '../../Sigil';
import './ZenSeven.css';

const GROWS = ['expanded multimodal reasoning', 'longer context', 'improved agentic coding performance'];
const LINES = ['Zen 7', 'Frontier', 'Foundation'];

/* the paragraph with each phrase the line carries marked, so a lit or hovered station underlines its own words */
const PARA = "Zen 7 is the next open-weight generation from Zoo Labs Foundation, built on the same lineage as Zen 6 but with expanded multimodal reasoning, longer context, and improved agentic coding performance. Trained with identity and agentic coding data from Hanzo's own platform.";
function Para({ on }) {
  const out = []; let rest = PARA;
  GROWS.forEach((g, i) => { const at = rest.indexOf(g); out.push(rest.slice(0, at), <mark key={g} className={on[i] ? 'on' : ''}>{g}</mark>); rest = rest.slice(at + g.length); });
  out.push(rest);
  return <p className="z7-para">{out}</p>;
}

/* reduced motion only after mount: the server cannot know it, so the first client render must match the server HTML */
function useCalm() {
  const rm = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted && !!rm;
}

function usePhone() {
  const [phone, setPhone] = useState(false);
  useEffect(() => { const mq = matchMedia('(max-width: 899px)'); const f = () => setPhone(mq.matches); f(); mq.addEventListener('change', f); return () => mq.removeEventListener('change', f); }, []);
  return phone;
}

function Stage({ still, setStill }) {
  const box = useRef(null);
  const phone = usePhone(); // phone: the stage is not pinned, so the settle runs over the stage leaving the screen
  const { scrollYProgress: p } = useScroll({ target: box, offset: phone ? ['start start', 'end start'] : ['start start', 'end end'] });
  const k = useTransform(p, phone ? [0, 0.45] : [0, 0.7], [1, 0], { clamp: true }); // 1 = risen from below, 0 = settled
  const ke = useTransform(k, (v) => v * (2 - v)); // eased out; ZenSeven.css turns it into translate and scale
  return (
    <section className="z7-stage" ref={box} aria-labelledby="z7-h">
      {/* JS off: the title, the settled 7 and the lineage stations are simply shown (common gate item 5) */}
      <noscript><style>{'.z7-art{--k:0!important}.z7-stage{height:auto!important}.z7-h .x-line-in{transform:none!important}.z7-brings{height:auto!important}.z7-brings-pin{position:relative!important}.z7-run{transform:none!important}.z7-dot,.z7-pause{display:none!important}.z7-seven path{stroke-dasharray:none!important;stroke-dashoffset:0!important}.z7-access{--open:1!important}'}</style></noscript>
      <div className="z7-pin">
        <button type="button" className="z7-pause" aria-pressed={still} onClick={() => setStill(!still)}>{still ? 'Play' : 'Pause'}<span className="z7-vh"> the moving fields</span></button>
        <motion.div className="z7-art" aria-hidden="true" style={{ '--k': ke }}>
          {/* three layers on white: the black 7, the field over it, white with a 7-shaped hole on top (so no box edge shows) */}
          <svg className="z7-mask" viewBox="0 0 600 700" preserveAspectRatio="xMidYMid slice"><text x="300" y="640" textAnchor="middle" className="z7-glyph">7</text></svg>
          <Sigil seed="zen-7" data={[7, 6, 2.0]} className="z7-sig" still={still} />
          <svg className="z7-mask" viewBox="0 0 600 700" preserveAspectRatio="xMidYMid slice">
            <defs>
              <mask id="z7-cut"><rect x="-10" y="-10" width="620" height="720" fill="#fff" /><text x="300" y="640" textAnchor="middle" className="z7-glyph">7</text></mask>
            </defs>
            <rect x="-10" y="-10" width="620" height="720" fill="#fff" mask="url(#z7-cut)" />
          </svg>
        </motion.div>
        <div className="z7-w z7-copy">
          <h1 id="z7-h" className="z7-h" data-morph-target>
            {LINES.map((l, i) => (
              <span key={l} className="x-line">
                <motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 0.7, ease: EASE, delay: 0.1 + i * 0.06 }}>{l}</motion.span>{i < LINES.length - 1 ? ' ' : ''}
              </span>
            ))}
          </h1>
          <p className="z7-lede">The next open-weight generation. Weights and reproducible checkpoints publish under Apache 2.0 upon final alignment. Apply for research access below.</p>
          <div className="z7-acts">
            <Cta to="/beta" id="zen7.hero" thumb>Apply for research access</Cta>
            <Cta to="/zen" id="zen7.hero.back" kind="link">Back to Zen</Cta>
          </div>
          <nav className="z7-crumb"><ol><li><A to="/zen">Zen</A></li><li aria-current="page">Zen 7</li></ol></nav>
        </div>
      </div>
    </section>
  );
}

/* Beyond: Zen 6 to Zen 7 as a pinned scrub (desktop): your scroll carries a marker along the line; each station lights
   as it passes and underlines its phrase above; Zen 7 fills when the marker arrives. Phone: the same, down a vertical line. */
function Lineage() {
  const box = useRef(null);
  const calm = useCalm();
  const phone = usePhone();
  const { scrollYProgress: p } = useScroll({ target: box, offset: phone ? ['start 0.75', 'end 0.6'] : ['start start', 'end end'] });
  const m = useTransform(p, phone ? [0, 1] : [0.12, 0.82], [0, 1], { clamp: true });
  const [at, setAt] = useState(0);
  const [hover, setHover] = useState(-1);
  useMotionValueEvent(m, 'change', (v) => setAt(v));
  const k = calm ? 1 : at;
  const lit = GROWS.map((_, i) => k >= (i + 0.5) / GROWS.length);
  const run = phone ? { scaleY: calm ? 1 : m } : { scaleX: calm ? 1 : m };
  const go = useTransform(m, (v) => `${(calm ? 1 : v) * 100}%`);
  return (
    <section className="z7-brings" ref={box} aria-labelledby="z7-b">
      <div className="z7-brings-pin">
        <div className="z7-w z7-brings-g">
          <h2 id="z7-b" className="z7-h2">What Zen{'\u00a0'}7 brings</h2>
          <Para on={lit.map((l, i) => l || hover === i)} />
        </div>
        <div className="z7-w z7-line">
          <A to="/zen" className="z7-node">
            <span className="z7-node-k">Zen 6</span>
            <span>27.3B dense</span>
            <span>Text, images and video</span>
            <span>Open weights</span>
          </A>
          <div className="z7-rail">
            <i className="z7-track" aria-hidden="true" />
            <motion.i className="z7-run" aria-hidden="true" style={run} />
            <motion.i className="z7-dot" aria-hidden="true" style={phone ? { y: go } : { x: go }}><b /></motion.i>
            <ol>
              {GROWS.map((g, i) => (
                <li key={g} className={lit[i] ? 'lit' : ''} onPointerEnter={() => setHover(i)} onPointerLeave={() => setHover(-1)}>{g}</li>
              ))}
            </ol>
          </div>
          <div className={'z7-node z7-node7' + (k >= 0.98 ? ' here' : '')}>
            <span className="z7-node-k">Zen 7</span>
            <span>Apache 2.0</span>
            <span>upon final alignment</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* the research room: the page's one black room; it enters as a rounded card inside the gutters and opens to full
   width as it is reached (ZenSeven.css turns --open into the clip) */
function Access({ still }) {
  const room = useRef(null);
  const calm = useCalm();
  const { scrollYProgress: rp } = useScroll({ target: room, offset: ['start end', 'start 0.3'] });
  const [d, setD] = useState([0, 0]);
  /* the room's own 7, drawn once as line art (1.2 s) and drifting up to 28px toward a fine pointer */
  const drift = (e) => {
    if (calm || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    setD([((e.clientX - r.left) / r.width - 0.5) * 56, ((e.clientY - r.top) / r.height - 0.5) * 56]);
  };
  return (
    <motion.section className="z7-access" data-room="dark" data-ask-hide aria-labelledby="z7-r" ref={room} style={{ '--open': rp }} onPointerMove={drift} onPointerLeave={() => setD([0, 0])}>
      <Sigil seed="zen-7/access" data={[2, 0, 7]} className="z7-sig2" still={still} />
      <svg className="z7-seven" viewBox="0 0 600 700" aria-hidden="true" style={{ transform: `translate(${d[0]}px, ${d[1]}px)` }}>
        <motion.path d="M120 110H480L250 620" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true, amount: 0.4 }} transition={calm ? { duration: 0 } : { duration: 1.2, ease: EASE }} />
      </svg>
      <div className="z7-w z7-access-g">
        <h2 id="z7-r" className="z7-big">Research access</h2>
        <p className="z7-lede">Weights and reproducible checkpoints publish under Apache 2.0 upon final alignment. Apply for research access to get early evaluation endpoints and participate in alignment feedback.</p>
        <div className="z7-acts"><Cta to="/beta" id="zen7.access">Apply for research access</Cta></div>
      </div>
    </motion.section>
  );
}

export default function ZenSeven() {
  const [still, setStill] = useState(false);
  return (
    <main className="z7">
      <Stage still={still} setStill={setStill} />
      <Lineage />
      <Access still={still} />
    </main>
  );
}
