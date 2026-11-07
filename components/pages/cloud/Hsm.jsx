'use client';
/* HSM. Signature: the key that never comes out. Bytes and a key id go into the module, a signature comes back, and the
   key glows inside the boundary the whole time; the module behind the one interface changes (AWS KMS, Azure Key
   Vault, Google Cloud KMS, a Zymbit module over PKCS#11) while the call stays the same. The six facts are read beside a
   module drawing that shows each one. Beyond: "Pick your module" - choose the module you already have and read, in
   Hanzo's words, where its key lives, whether it can sign by threshold, and where ML-DSA-65 runs on it: the honest
   answer per module, including the ones that cannot. Every word and link is Hanzo's. */
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EASE, Rise } from '../../ui';
import { Hero, Paste, Get, useLive, useSteps } from './Frame';
import './Hsm.css';

const MODULES = ['AWS KMS', 'Azure Key Vault', 'Google Cloud KMS', 'Zymbit · PKCS#11'];

function Sign() {
  const [ref, live] = useLive(0.3);
  const [m] = useSteps(MODULES.length, 3200, live);
  return (
    <div className="hs-sign" ref={ref} aria-hidden="true">
      <div className="hs-proc">
        <p className="hs-k">your process</p>
        <div className="hs-chip">key id</div>
        <div className="hs-chip">bytes</div>
        <motion.div key={'s' + m} className="hs-chip sig" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.5, duration: 0.6, ease: EASE }}>signature</motion.div>
      </div>
      <div className="hs-pipe">
        <motion.i key={'a' + m} className="in" initial={{ x: '-100%' }} animate={{ x: '100%' }} transition={{ duration: 0.9, ease: [0.6, 0, 0.3, 1], delay: 0.2 }} />
        <motion.i key={'b' + m} className="out" initial={{ x: '100%' }} animate={{ x: '-100%' }} transition={{ duration: 0.9, ease: [0.6, 0, 0.3, 1], delay: 1.1 }} />
      </div>
      <div className="hs-mod">
        <div className="hs-bound">
          <span className="hs-key"><svg viewBox="0 0 24 24" width="30" height="30"><circle cx="8" cy="12" r="4.5" /><path d="M12.5 12H21v3M17.5 12v2.5" /></svg></span>
          <p>the key stays here</p>
        </div>
        <div className="hs-names">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p key={m} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35, ease: EASE }}>{MODULES[m]}</motion.p>
          </AnimatePresence>
        </div>
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
// what the drawing shows for each fact: [outside the boundary, inside the boundary]
const DRAW = [['a handle', 'the key'], ['key id + bytes → signature', 'the private key'], ['encrypted password', 'decrypted at boot'], ['in the process, without the firmware', 'ML-DSA-65'], ['attested shares', 'no share assembled'], ['one Go interface', 'the module you have']];

function What() {
  const [at, setAt] = useState(0);
  return (
    <section className="x-sec hs-what">
      <div className="x-wrap hs-what-grid">
        <div className="hs-draw" aria-hidden="true">
          <p className="hs-draw-k">What it is · {String(at + 1).padStart(2, '0')} / 06</p>
          <div className="hs-box">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={at} className="hs-box-in" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, transition: { duration: 0.15 } }} transition={{ duration: 0.4, ease: EASE }}>
                <span className="hs-out">{DRAW[at][0]}</span>
                <span className="hs-in">{DRAW[at][1]}</span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <div>
          <Rise as="h2" className="hs-what-h">What it is</Rise>
          <ol className="hs-facts">
            {FACTS.map(([t, d], i) => (
              <li key={t} className={at === i ? 'on' : ''}>
                <button type="button" onClick={() => setAt(i)} onMouseEnter={() => setAt(i)} onFocus={() => setAt(i)} aria-pressed={at === i}>
                  <span className="hs-n">{String(i + 1).padStart(2, '0')} / 06</span>
                  <span className="hs-t">{t}</span>
                </button>
                <p>{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

// [module, where the key lives, threshold signing, ML-DSA-65]: each line is Hanzo's, said of that kind of module
const PQ = 'On a module with post-quantum firmware it runs inside the boundary like any other key; without one it runs in the process.';
const CLOUD = ['Inside the module. Hanzo holds a handle, never the key.', 'Cloud key services cannot do this, and the interface says so rather than pretending.', PQ];
const PICK = [
  ['AWS KMS', ...CLOUD],
  ['Azure Key Vault', ...CLOUD],
  ['Google Cloud KMS', ...CLOUD],
  ['Zymbit · PKCS#11', 'Inside the secure compute module, over local PKCS#11. Hanzo holds a handle, never the key.', 'Where the hardware can do it: key generation and signing rounds run internally, so no share is ever assembled anywhere. A share that arrives unattested is refused.', PQ],
  ['In-memory signer', 'An in-memory signer, for development.', 'Not here: threshold signing is for modules whose hardware can do it.', 'Without post-quantum firmware it runs in the process.'],
];

function Pick() {
  const [at, setAt] = useState(0);
  const [, key, thr, pq] = PICK[at];
  return (
    <section className="x-sec hs-pick">
      <div className="x-wrap">
        <p className="x-kick">Bring the module you already have</p>
        <h2 className="hs-pick-h">Pick your module</h2>
        <div className="hs-pick-tabs" role="tablist" aria-label="Module">
          {PICK.map(([m], i) => <button key={m} type="button" role="tab" aria-selected={at === i} aria-controls="hs-pick-p" onClick={() => setAt(i)}>{m}</button>)}
        </div>
        <dl className="hs-pick-p" id="hs-pick-p" role="tabpanel" aria-live="polite">
          <div><dt>The key</dt><dd>{key}</dd></div>
          <div><dt>Threshold signing</dt><dd>{thr}</dd></div>
          <div><dt>ML-DSA-65</dt><dd>{pq}</dd></div>
        </dl>
        <p className="hs-pick-f">One Go interface behind all of them, so which module you use is a line of configuration rather than a rewrite.</p>
      </div>
    </section>
  );
}

export default function Hsm() {
  return (
    <main className="hs">
      <Hero
        dark
        title="Hanzo HSM"
        lede="One interface to the key hardware you already trust — AWS KMS, Azure Key Vault, Google Cloud KMS, or a Zymbit module over PKCS#11. Generate keys, sign with them, and unwrap with them, without the private material ever reaching your process."
        acts={[['View on GitHub', 'https://github.com/hanzoai']]}
      >
        <Sign />
      </Hero>
      <What />
      <Pick />
      <section className="x-sec hs-paste">
        <div className="x-wrap">
          <Rise as="h2" className="hs-start">Get started with HSM</Rise>
          <Paste name="HSM" prompt="Read https://hanzo.ai/skill.md and use Hanzo HSM in my project." />
        </div>
      </section>
      <Get name="HSM" tag="Hardware security module" />
    </main>
  );
}
