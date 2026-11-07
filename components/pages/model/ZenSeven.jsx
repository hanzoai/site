'use client';
/* Zen 7 (/zen/7): the next generation, not yet published. A teaser in three calm screens.
   Signature: the 7 rises. A giant 7, Zen 7's own living field showing only through the numeral (the weights are there,
   not yet out), sweeps in from the bottom right of the first screen and settles beside the title as you scroll
   (scale and position only).
   Beyond: the lineage line. Zen 6's own facts on one end, Zen 7 on the other, and the three things Hanzo says Zen 7
   expands landing on the line as it draws, so the step from one to the other reads at a glance.
V2: 8/10 Stage numeral that rises and settles on scroll, line-masked title, drawn lineage line, one dark room for access
*/
import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { EASE, Magnetic } from '../../ui';
import { A, More } from '../../kit';
import Sigil from '../../Sigil';
import './ZenSeven.css';

const GROWS = ['expanded multimodal reasoning', 'longer context', 'improved agentic coding performance'];
const LINES = ['Zen 7', 'Frontier', 'Foundation'];

function Stage() {
  const box = useRef(null);
  const { scrollYProgress: p } = useScroll({ target: box, offset: ['start start', 'end end'] });
  const k = useTransform(p, [0, 0.7], [1, 0], { clamp: true }); // 1 = risen from below, 0 = settled
  const ke = useTransform(k, (v) => v * (2 - v)); // eased out; ZenSeven.css turns it into translate and scale
  return (
    <section className="z7-stage" ref={box} aria-labelledby="z7-h">
      <div className="z7-pin">
        <motion.div className="z7-art" aria-hidden="true" style={{ '--k': ke }}>
          {/* three layers on white: the black 7, the field over it, white with a 7-shaped hole on top (so no box edge shows) */}
          <svg className="z7-mask" viewBox="0 0 600 700" preserveAspectRatio="xMidYMid slice"><text x="300" y="640" textAnchor="middle" className="z7-glyph">7</text></svg>
          <Sigil seed="zen-7" data={[7, 6, 2.0]} className="z7-sig" />
          <svg className="z7-mask" viewBox="0 0 600 700" preserveAspectRatio="xMidYMid slice">
            <defs>
              <mask id="z7-cut"><rect x="-10" y="-10" width="620" height="720" fill="#fff" /><text x="300" y="640" textAnchor="middle" className="z7-glyph">7</text></mask>
            </defs>
            <rect x="-10" y="-10" width="620" height="720" fill="#fff" mask="url(#z7-cut)" />
          </svg>
        </motion.div>
        <div className="z7-w z7-copy">
          <p className="z7-kick">Zen 7</p>
          <h1 id="z7-h" className="z7-h" data-morph-target>
            {LINES.map((l, i) => (
              <span key={l} className="x-line">
                <motion.span className="x-line-in" initial={{ y: '108%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.12 + i * 0.09 }}>{l}</motion.span>{i < LINES.length - 1 ? ' ' : ''}
              </span>
            ))}
          </h1>
          <p className="z7-lede">The next open-weight generation. Weights and reproducible checkpoints publish under Apache 2.0 upon final alignment. Apply for research access below.</p>
          <div className="z7-acts">
            <Magnetic><A to="/beta" className="x-btn solid z7-btn" data-thumb="Apply for research access">Apply for research access</A></Magnetic>
            <More to="/zen">Back to Zen</More>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Beyond: Zen 6 to Zen 7, the line draws and what grows lands on it */
function Lineage() {
  const seen = { once: true, amount: 0.5 };
  const calm = useReducedMotion(); // reduced motion: the line and its stations are simply there
  const draw = calm ? { duration: 0 } : { duration: 1.6, ease: EASE };
  return (
    <section className="z7-brings" aria-labelledby="z7-b">
      <div className="z7-w z7-brings-g">
        <h2 id="z7-b" className="z7-h2">What Zen{'\u00a0'}7 brings</h2>
        <p className="z7-para">Zen 7 is the next open-weight generation from Zoo Labs Foundation, built on the same lineage as Zen 6 but with expanded multimodal reasoning, longer context, and improved agentic coding performance. Trained with identity and agentic coding data from Hanzo&apos;s own platform.</p>
      </div>
      <div className="z7-w z7-line">
        <A to="/zen" className="z7-node" data-cursor="Zen 6">
          <span className="z7-node-k">Zen 6</span>
          <span>27.3B dense</span>
          <span>Text, images and video</span>
          <span>Open weights</span>
        </A>
        <div className="z7-rail">
          <svg className="z7-path h" viewBox="0 0 100 2" preserveAspectRatio="none" aria-hidden="true">
            <motion.path d="M0 1H100" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={seen} transition={draw} vectorEffect="non-scaling-stroke" />
          </svg>
          <svg className="z7-path v" viewBox="0 0 2 100" preserveAspectRatio="none" aria-hidden="true">
            <motion.path d="M1 0V100" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={seen} transition={draw} vectorEffect="non-scaling-stroke" />
          </svg>
          <ol>
            {GROWS.map((g, i) => (
              <motion.li key={g} initial={{ opacity: 0, scale: 0.86 }} whileInView={{ opacity: 1, scale: 1 }} viewport={seen} transition={calm ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 30, delay: 0.35 + i * 0.4 }}>{g}</motion.li>
            ))}
          </ol>
        </div>
        <div className="z7-node dark">
          <span className="z7-node-k">Zen 7</span>
          <span>Apache 2.0</span>
          <span>upon final alignment</span>
        </div>
      </div>
    </section>
  );
}

export default function ZenSeven() {
  return (
    <main className="z7">
      <Stage />
      <Lineage />
      <section className="z7-access" data-room="dark" aria-labelledby="z7-r">
        <Sigil seed="zen-7/access" data={[2, 0, 7]} className="z7-sig2" />
        <div className="z7-w z7-access-g">
          <h2 id="z7-r" className="z7-big">Research access</h2>
          <div className="z7-access-t">
            <p className="z7-lede">Weights and reproducible checkpoints publish under Apache 2.0 upon final alignment. Apply for research access to get early evaluation endpoints and participate in alignment feedback.</p>
            <div className="z7-acts"><Magnetic><A to="/beta" className="x-btn solid z7-btn">Apply for research access</A></Magnetic></div>
          </div>
        </div>
      </section>
    </main>
  );
}
