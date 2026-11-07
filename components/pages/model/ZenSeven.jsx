'use client';
/* Zen 7: the next generation, not yet published.
   Signature: a living field seen through a giant 7. Zen 7's sigil (its contour map, drifting and bending toward the
   pointer) shows only through the numeral, the way the weights are there but not yet out.
   Beyond: the lineage line. Zen 6's own facts on one end, Zen 7 on the other, and the three things Hanzo says
   Zen 7 expands travelling along it, so the step from one to the other reads at a glance. */
import { motion } from 'motion/react';
import { EASE } from '../../ui';
import { A, More } from '../../kit';
import Sigil from '../../Sigil';
import './Model.css';
import './ZenSeven.css';

const GROWS = ['expanded multimodal reasoning', 'longer context', 'improved agentic coding performance'];

export default function ZenSeven() {
  return (
    <main className="z7">
      <section className="z7-hero" aria-labelledby="z7-h">
        <div className="x-wrap z7-hero-in">
          <div className="z7-copy">
            <p className="mb-kick">Zen 7</p>
            <h1 id="z7-h" className="mb-h z7-h" data-morph-target>Zen 7 Frontier Foundation</h1>
            <p className="mb-lede">The next open-weight generation. Weights and reproducible checkpoints publish under Apache 2.0 upon final alignment. Apply for research access below.</p>
            <div className="mb-acts">
              <A to="/beta" className="x-btn solid" data-thumb="Apply for research access">Apply for research access</A>
              <More to="/zen">Back to Zen</More>
            </div>
          </div>
          <div className="z7-art" aria-hidden="true">
            <Sigil seed="zen-7" data={[7, 6, 2.0]} className="z7-sig" />
            <svg className="z7-mask" viewBox="0 0 600 700" preserveAspectRatio="xMidYMid slice">
              <defs>
                <mask id="z7-cut"><rect width="600" height="700" fill="#fff" /><text x="300" y="610" textAnchor="middle" className="z7-glyph">7</text></mask>
              </defs>
              <rect width="600" height="700" fill="#fff" mask="url(#z7-cut)" />
            </svg>
          </div>
        </div>
      </section>
      <section className="z7-brings mb-sec" aria-labelledby="z7-b">
        <div className="x-wrap">
          <h2 id="z7-b" className="mb-h2">What Zen 7 brings</h2>
          <p className="z7-para">Zen 7 is the next open-weight generation from Zoo Labs Foundation, built on the same lineage as Zen 6 but with expanded multimodal reasoning, longer context, and improved agentic coding performance. Trained with identity and agentic coding data from Hanzo&apos;s own platform.</p>
          <div className="z7-line">
            <A to="/zen" className="z7-node">
              <span className="z7-node-k">Zen 6</span>
              <span>27.3B dense</span>
              <span>Text, images and video</span>
              <span>Open weights</span>
            </A>
            <ol className="z7-rail">
              {GROWS.map((g, i) => (
                <motion.li key={g} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.7, ease: EASE, delay: 0.2 + i * 0.12 }}>{g}</motion.li>
              ))}
              <i className="z7-pulse" aria-hidden="true" />
            </ol>
            <div className="z7-node dark">
              <span className="z7-node-k">Zen 7</span>
              <span>Apache 2.0</span>
              <span>upon final alignment</span>
            </div>
          </div>
        </div>
      </section>
      <section className="z7-access mb-sec" data-room="dark" aria-labelledby="z7-r">
        <Sigil seed="zen-7/access" data={[2, 0, 7]} className="z7-sig2" />
        <div className="x-wrap z7-access-in">
          <h2 id="z7-r" className="mb-h2">Research access</h2>
          <p className="mb-lede">Weights and reproducible checkpoints publish under Apache 2.0 upon final alignment. Apply for research access to get early evaluation endpoints and participate in alignment feedback.</p>
          <div className="mb-acts"><A to="/beta" className="x-btn solid">Apply for research access</A></div>
        </div>
      </section>
    </main>
  );
}
