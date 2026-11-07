'use client';
// Persona: a security or platform engineer who already owns key hardware.
// Goal: see that the key never leaves the hardware and that the module is a line of configuration.
// CTA: View on GitHub (hsm.hero, hsm.close).
// Metric: cta_click hsm.hero
// Signature: the module, exploded: a plate stack that signs in the hero and opens layer by layer as the facts are read.
// Beyond: Pick your module: where its key lives, threshold signing and ML-DSA-65 per module, in Hanzo's words.
/* HSM (v2, archetype A Launch).
   V2: 8/10 round 3: one hero style on server and client (no reduced-motion hydration diff); the hero signs from the first second (a bead runs bytes → key → signature) and tilts to a fine pointer; phone keeps the stage as one sticky module with the chapters swapping beneath it; dots ring on hover with their name below the row; 26px section heads with stepped gaps; the picker draws each module as line art with its own lit layers and cross-fades; deck greys only, one ask.
   Signature: the module, exploded. One hardware module drawn as a stack of plates (the handle Hanzo holds, the
   boundary, the key, the firmware, the module itself). In the hero it is closed and signing: key id and bytes go in, a
   signature comes out, and the module under the interface changes (AWS KMS, Azure Key Vault, Google Cloud KMS, a Zymbit
   module over PKCS#11) while the call stays the same. In the pinned chapters it opens apart, plate by plate, each fact
   lighting the layer it is about, with labels on leader lines like a product exploded view.
   Supporting: kinetic title lines; the module settles from huge on scroll (Stage); pinned chapters (the one dark room).
   Beyond: "Pick your module" - choose the module you already have and read where its key lives, whether it can sign by
   threshold, and where ML-DSA-65 runs on it, in Hanzo's words, including what it cannot do.
   Greys only (Hanzo's deck): the module is silver and ink. Every word and link is Hanzo's.
   Persona: a security or platform engineer who already owns key hardware (a cloud KMS or a Zymbit module).
   Goal: see that the key never leaves the hardware and that the module is a line of configuration.
   CTA: View on GitHub (hero, the sticky ask bar and the close; one solid button per screen). */
import { useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { Cta } from '../../kit';
import { useLive, useSteps } from './Frame';
import { Lines } from '../../v2/LiftStage';
import PinChapters from '../../v2/x-hypatia/PinChapters';
import ShipPrompt from '../../v2/ShipPrompt';
import GetIt from '../../v2/GetIt';
import LivePause, { usePause } from '../../v2/LivePause';
import '../../v2/v2scale.css';
import './Hsm.css';

const EASE = [0.16, 1, 0.3, 1];
const MODULES = ['AWS KMS', 'Azure Key Vault', 'Google Cloud KMS', 'Zymbit · PKCS#11'];
const LAYERS = ['handle', 'boundary', 'key', 'firmware', 'module'];

/* The hero object's settle, page-local: it paints at its final size (server and client agree, nothing snaps at load),
   then eases back and down a little as the hero scrolls away, so the module recedes as the chapters arrive. */
function Settle({ children, className }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.2', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 48]);
  // one style object on the server and on every client paint (no reduced-motion branch here, so hydration matches);
  // reduced motion holds it still in CSS (Hsm.css, .hs-settle).
  return (
    <div ref={ref} className={className}>
      <motion.div className="hs-settle" style={{ scale, y, transformOrigin: '50% 30%' }}>{children}</motion.div>
    </div>
  );
}

/* The module: five plates in one 3D stack. gap opens it; lit picks the plate in the light; labels sit on leader lines. */
function Module({ gap = 14, lit = [2], labels = {}, base, shares, small }) {
  return (
    <div className={'hm' + (small ? ' small' : '')} style={{ '--gap': gap + 'px' }}>
      <div className="hm-stack">
        {LAYERS.map((l, i) => (
          <div key={l} className={'hm-plate hm-' + l + (lit.includes(i) ? ' lit' : '')} style={{ '--z': 2 - i }}>
            {l === 'key' && (
              <div className={'hm-core' + (shares ? ' split' : '')}>
                {[0, 1, 2].map((k) => <i key={k} />)}
              </div>
            )}
            {l === 'firmware' && <div className="hm-grid" />}
            {l === 'module' && <span className="hm-name">{base}</span>}
          </div>
        ))}
      </div>
      <ul className="hm-labels">
        {LAYERS.map((l, i) => labels[i] && (
          <li key={l} className={lit.includes(i) ? 'lit' : ''} style={{ '--z': 2 - i }}><i />{labels[i]}</li>
        ))}
      </ul>
    </div>
  );
}

/* Hero: the closed module signing, its provider changing under the same call. */
function Sign() {
  const [ref, seen] = useLive(0.3);
  const [paused, togglePause] = usePause();
  const live = seen && !paused;
  const [m] = useSteps(MODULES.length, 3400, live);
  // a fine pointer tilts the module up to 2.5° (CSS vars, no re-render); touch and reduced motion stay flat (Hsm.css)
  const tilt = (e) => {
    if (e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--tx', (((e.clientX - r.left) / r.width - 0.5) * 5).toFixed(2) + 'deg');
    e.currentTarget.style.setProperty('--ty', (((e.clientY - r.top) / r.height - 0.5) * -5).toFixed(2) + 'deg');
  };
  const flat = (e) => { e.currentTarget.style.setProperty('--tx', '0deg'); e.currentTarget.style.setProperty('--ty', '0deg'); };
  return (
    <div className="lp-host">
    <LivePause paused={paused} onToggle={togglePause} className="hs-pause" />
    <div className={'hs-sign' + (live ? ' live' : '')} ref={ref} aria-hidden="true" onPointerMove={tilt} onPointerLeave={flat}>
      <Module gap={22} base={MODULES[m]} />
      {/* the signing pulse: from "key id + bytes" through the module to "signature ✓", once per module, from the first second */}
      <i key={'p' + m} className="hs-pulse" />
      <AnimatePresence mode="popLayout">
        <motion.p key={'in' + m} className="hs-io in" initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30, transition: { duration: 0.3 } }} transition={{ duration: 0.8, ease: EASE }}>key id + bytes</motion.p>
        <motion.p key={'out' + m} className="hs-io out" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, transition: { duration: 0.2 } }} transition={{ duration: 0.8, ease: EASE, delay: 1.1 }}>signature ✓</motion.p>
      </AnimatePresence>
      <p className="hs-call">One interface <span>→</span> <AnimatePresence mode="wait" initial={false}><motion.b key={m} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }} transition={{ duration: 0.4, ease: EASE }}>{MODULES[m]}</motion.b></AnimatePresence></p>
    </div>
    </div>
  );
}

const FACTS = [
  ['Keys never leave the hardware', 'Signing and unwrapping happen inside AWS KMS, Azure Key Vault, or a Zymbit secure module. Hanzo holds a handle, never the key.'],
  ['You send a message, you get a signature', 'The private key is made inside the module and stays there. Your code passes a key id and some bytes and receives a signature back, so there is no moment at which the key exists in your process to be leaked, logged, or written to a core dump.'],
  ['The key that opens the database', 'The password that decrypts an encrypted store is itself stored encrypted, and the module decrypts it at boot. Nothing on the disk, in the environment or in a manifest is enough on its own to read the data.'],
  ['Post-quantum, and honest about where it runs', 'ML-DSA-65 is available as a signing algorithm today. On a module with post-quantum firmware it runs inside the boundary like any other key; without one it runs in the process, which is the right answer for a service that has to be quantum-ready before the hardware is, and the wrong one to describe as hardware-backed.'],
  ['Threshold signing, where the hardware can do it', 'Some modules can run key generation and signing rounds internally, so no share is ever assembled anywhere. Shares are attested and encrypted at rest, and a share that arrives unattested is refused. Cloud key services cannot do this, and the interface says so rather than pretending.'],
  ['Bring the module you already have', 'AWS KMS, Google Cloud KMS, Azure Key Vault, a Zymbit secure compute module over local PKCS#11, or an in-memory signer for development. One Go interface behind all of them, so which module you use is a line of configuration rather than a rewrite.'],
];

/* Each fact opens the module its own way (gap), lights its layer and labels it in the fact's own words. */
const SCENES = [
  { gap: 62, lit: [0, 2], labels: { 0: 'a handle', 2: 'the key' } },
  { gap: 80, lit: [2], labels: { 0: 'key id + bytes → signature', 2: 'the private key' } },
  { gap: 80, lit: [1], labels: { 1: 'encrypted password', 2: 'decrypted at boot' } },
  { gap: 96, lit: [3], labels: { 0: 'in the process, without the firmware', 3: 'ML-DSA-65' } },
  { gap: 96, lit: [2], labels: { 1: 'no share assembled', 2: 'attested shares' }, shares: true },
  { gap: 70, lit: [4], labels: { 0: 'one Go interface', 4: 'the module you have' } },
];

function Exploded({ at }) {
  const s = SCENES[at];
  const [m] = useSteps(MODULES.length, 1600, at === 5);
  return (
    <div className="hs-exp" aria-hidden="true">
      <Module gap={s.gap} lit={s.lit} labels={s.labels} shares={s.shares} base={at === 5 ? MODULES[m] : 'HSM'} />
    </div>
  );
}

const PQ = 'On a module with post-quantum firmware it runs inside the boundary like any other key; without one it runs in the process.';
const CLOUD = ['Signing and unwrapping happen inside the module. Hanzo holds a handle, never the key.', 'Cloud key services cannot do this, and the interface says so rather than pretending.', PQ];
const PICK = [
  ['AWS KMS', ...CLOUD],
  ['Azure Key Vault', ...CLOUD],
  ['Google Cloud KMS', ...CLOUD],
  ['Zymbit · PKCS#11', 'A Zymbit secure compute module over local PKCS#11. Hanzo holds a handle, never the key.', 'Some modules can run key generation and signing rounds internally, so no share is ever assembled anywhere. A share that arrives unattested is refused.', PQ],
  ['In-memory signer', 'An in-memory signer for development.', 'Threshold signing, where the hardware can do it.', 'Without post-quantum firmware it runs in the process.'],
];

/* How each module draws in the picker (line art, the layer that answers lit): a cloud KMS keeps the key in the module and
   hands Hanzo a handle (handle + key lit, opening wider for each provider); Zymbit holds the key as shares inside its
   boundary; the in-memory signer has no boundary to speak of, so only the handle (your process) is lit. */
const PICKED = [
  { gap: 16, lit: [0, 2] },
  { gap: 22, lit: [0, 2] },
  { gap: 28, lit: [0, 2] },
  { gap: 30, lit: [1, 2] },
  { gap: 10, lit: [0] },
];

/* Beyond: pick your module. */
function Pick() {
  const [at, setAt] = useState(0);
  const [, key, thr, pq] = PICK[at];
  return (
    <section className="v2-sec hs-pick">
      <div className="v2-wrap">
        <div className="hs-pick-head v2-grid">
          <div className="hs-pick-hl">
            <h2 className="v2-display s">Pick your module</h2>
          </div>
          <p className="v2-lede hs-pick-f">One Go interface behind all of them, so which module you use is a line of configuration rather than a rewrite.</p>
        </div>
        <div className="hs-pick-tabs" role="tablist" aria-label="Module">
          {PICK.map(([m], i) => (
            <button key={m} type="button" role="tab" aria-selected={at === i} aria-controls="hs-pick-p" onClick={() => setAt(i)}>
              {at === i && <motion.span layoutId="hs-tab" className="hs-tab-bg" transition={{ duration: 0.3, ease: EASE }} />}
              <span className="hs-tab-t">{m}</span>
            </button>
          ))}
        </div>
        {/* one sheet split 8/5: the module you picked (its name on the bottom plate) and where its key lives, large;
            threshold signing and ML-DSA-65 as hairline rows beside it. Every tab changes the plate, the name and the words. */}
        <div className="hs-pick-p" id="hs-pick-p" role="tabpanel" aria-live="polite">
          <div className="hs-pick-main">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={'o' + at} className="hs-pick-obj" aria-hidden="true" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, transition: { duration: 0.15 } }} transition={{ duration: 0.3, ease: EASE }}>
                <Module gap={PICKED[at].gap} lit={PICKED[at].lit} base={PICK[at][0]} shares={at === 3} small />
              </motion.div>
            </AnimatePresence>
            <dl className="hs-pick-key">
              <AnimatePresence mode="wait" initial={false}>
                <motion.p key={'n' + at} className="hs-pick-name" aria-hidden="true" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, transition: { duration: 0.15 } }} transition={{ duration: 0.3, ease: EASE }}>{PICK[at][0]}</motion.p>
              </AnimatePresence>
              <dt>The key</dt>
              <AnimatePresence mode="wait" initial={false}>
                <motion.dd key={'k' + at} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, transition: { duration: 0.15 } }} transition={{ duration: 0.3, ease: EASE }}>{key}</motion.dd>
              </AnimatePresence>
            </dl>
          </div>
          <dl className="hs-pick-rows">
            {[['Threshold signing', thr], ['ML-DSA-65', pq]].map(([t, d]) => (
              <div key={t}>
                <dt>{t}</dt>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.dd key={at + t} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, transition: { duration: 0.15 } }} transition={{ duration: 0.3, ease: EASE }}>{d}</motion.dd>
                </AnimatePresence>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

export default function Hsm() {
  return (
    <main className="v2 hs">
      <section className="hs-hero">
        <div className="v2-wrap v2-grid hs-hero-grid">
          <div className="hs-hero-copy">
            <Lines as="h1" className="v2-display hs-h1" lines={['Hanzo', 'HSM']} data-morph-target="" />
            <p className="v2-body hs-lede v2-in" style={{ animationDelay: '.3s' }}>One interface to the key hardware you already trust — AWS KMS, Azure Key Vault, Google Cloud KMS, or a Zymbit module over PKCS#11. Generate keys, sign with them, and unwrap with them, without the private material ever reaching your process.</p>
            <div className="v2-acts v2-in" style={{ animationDelay: '.42s' }}><Cta to="https://github.com/hanzoai" id="hsm.hero" thumb>View on GitHub</Cta></div>
          </div>
          <Settle className="hs-hero-obj">
            <Sign />
          </Settle>
        </div>
      </section>

      <PinChapters className="hs-ch" dark label="What it is" items={FACTS} look="right" foot={<p className="v2-kick hs-ch-k">What it is</p>} visual={(at) => <Exploded at={at} />} />

      <ShipPrompt name="HSM" prompt="Read https://hanzo.ai/skill.md and use Hanzo HSM in my project." />

      <Pick />

      <GetIt name="HSM" tag="Hardware security module" seed="hsm" data={[65, 11, 4]} lead="Get started with HSM" ask={['View on GitHub', 'https://github.com/hanzoai', 'hsm.close']} />
    </main>
  );
}
