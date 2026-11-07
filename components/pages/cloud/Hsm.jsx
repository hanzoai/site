'use client';
// Persona: a security or platform engineer who already owns key hardware.
// Goal: see that the key never leaves the hardware and that the module is a line of configuration.
// CTA: View on GitHub (hsm.hero, hsm.close).
// Metric: cta_click hsm.hero
// Signature: the module, exploded: a plate stack that signs in the hero and opens layer by layer as the facts are read.
// Beyond: bring the module you already have: in chapter 06, pick AWS KMS, Google Cloud KMS, Azure Key Vault, Zymbit or the in-memory signer and the module's bottom plate and lit layer change.
/* HSM (v2, archetype A Launch).
   V2: 8/10 round 5: one module drawing, never repeated: hero, then the dark room (sticky beside the words on desktop; one pinned frame on phone where only the chapter's words swap); the lit layer carries one noun, the sentence says the rest; the active chapter title grows and settles; Paste and ship keys its prompt in once with Copy as the payoff; the close is a large type row of the modules Hanzo names; "hanzoai" is a meta line, so the one GitHub link is the button; the call line is left-aligned with a fixed-width name; the pause docks to the module and hides under reduced motion; ticks and arrows are drawn, not typed; every word is Hanzo's, said once.
   Signature: the module, exploded. One hardware module drawn as a stack of plates (the handle Hanzo holds, the
   boundary, the key, the firmware, the module itself). In the hero it is closed and signing: key id and bytes go in, a
   signature comes out, and the module under the interface changes (AWS KMS, Azure Key Vault, Google Cloud KMS, a Zymbit
   module) while the call stays the same. In the chapters it opens apart, plate by plate, each fact lighting the layer
   it is about, with labels on leader lines like a product exploded view.
   Supporting: kinetic title lines; the dark room opening from a card (clip-path on scroll); plates parting to the pointer.
   Greys only (Hanzo's deck): the module is silver and ink. Every word and link is Hanzo's. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent, useInView, useReducedMotion } from 'motion/react';
import { Cta } from '../../kit';
import { Copy } from '../../ui';
import { useLive, useSteps } from './Frame';
import { Lines } from '../../v2/LiftStage';
import '../../v2/ShipPrompt.css';
import LivePause, { usePause } from '../../v2/LivePause';
import '../../v2/v2scale.css';
import '../../v2/GetIt.css';
import './Hsm.css';

const EASE = [0.16, 1, 0.3, 1];
const MODULES = ['AWS KMS', 'Azure Key Vault', 'Google Cloud KMS', 'Zymbit'];
const LAYERS = ['handle', 'boundary', 'key', 'firmware', 'module'];
const pad = (n) => String(n).padStart(2, '0');
/* drawn marks, kept apart from Hanzo's words (a tick, an arrow): shapes, not text */
const Tk = () => <svg className="hs-tk" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const Arr = () => <svg className="hs-arr" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;

/* The hero object's settle, page-local: it paints at its final size (server and client agree, nothing snaps at load),
   then eases back and down a little as the hero scrolls away. Reduced motion holds it still in CSS (.hs-settle). */
function Settle({ children, className }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.2', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 48]);
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

/* Hero: the closed module signing, its provider changing under the same call. Frameless: the module is the big object. */
function Sign() {
  const [ref, seen] = useLive(0.3);
  const [paused, togglePause] = usePause();
  const live = seen && !paused;
  const [m] = useSteps(MODULES.length, 3400, live);
  // a fine pointer tilts the module up to 2.5° (CSS vars, no re-render); hovering parts the plates (Hsm.css)
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
        {/* the signing pulse: from the bytes through the module to the signature, once per module */}
        <i key={'p' + m} className="hs-pulse" />
        <AnimatePresence mode="popLayout">
          <motion.p key={'in' + m} className="hs-io in" initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30, transition: { duration: 0.3 } }} transition={{ duration: 0.8, ease: EASE }}>a key id and some bytes</motion.p>
          <motion.p key={'out' + m} className="hs-io out" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, transition: { duration: 0.2 } }} transition={{ duration: 0.8, ease: EASE, delay: 1.1 }}>a signature<Tk /></motion.p>
        </AnimatePresence>
        <p className="hs-call">One interface<Arr /><span className="hs-call-m"><AnimatePresence mode="wait" initial={false}><motion.b key={m} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }} transition={{ duration: 0.4, ease: EASE }}>{MODULES[m]}</motion.b></AnimatePresence></span></p>
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

/* Each fact opens the module its own way (gap) and lights its layer. The lit layer carries one noun from the fact (the
   sentence beside it says the rest), so nothing is said twice. */
const SCENES = [
  { gap: 62, lit: [0, 2], labels: { 0: 'handle', 2: 'key' } },
  { gap: 80, lit: [2], labels: { 2: 'key' } },
  { gap: 80, lit: [1], labels: { 1: 'password' } },
  { gap: 96, lit: [3], labels: { 3: 'firmware' } },
  { gap: 96, lit: [2], labels: { 2: 'shares' }, shares: true },
  { gap: 70, lit: [4], labels: {} },
];

/* Chapter 06's modules, in the order Hanzo lists them. Picking one changes only the drawing: the name on the bottom
   plate and the lit layer (a cloud KMS keeps the key behind a handle; Zymbit holds it as shares inside its boundary;
   the in-memory signer has only the handle). No sentence is attached to any one module. */
const VENDORS = ['AWS KMS', 'Google Cloud KMS', 'Azure Key Vault', 'Zymbit', 'in-memory signer'];
const VENDOR_LIT = [[0, 2, 4], [0, 2, 4], [0, 2, 4], [1, 2, 4], [0, 4]];

function Exploded({ at, vendor }) {
  const s = SCENES[at];
  const six = at === 5;
  return (
    <div className="hs-exp" aria-hidden="true">
      <Module gap={s.gap} lit={six ? VENDOR_LIT[vendor] : s.lit} labels={six ? { 4: VENDORS[vendor] } : s.labels} shares={s.shares || (six && vendor === 3)} base={six ? VENDORS[vendor] : 'HSM'} />
    </div>
  );
}

/* The dark room: a rounded card inside the gutters that opens to full width as it is reached (clip-path, scroll-linked).
   Desktop: the chapters are in normal flow and the drawing sticks beside them, following the chapter crossing the middle
   of the screen. Phone (motion allowed, scripts on): one pinned frame, the drawing on top and one chapter's words under
   it, swapping as the room scrolls past (one chapter per stretch of scroll), so words never slide under the drawing.
   Reduced motion or no scripts on a phone: one drawing, then the chapters as a plain list. */
function Chapters() {
  const room = useRef(null);
  const track = useRef(null);
  const arts = useRef([]);
  const pinned = useRef(false);
  const [at, setAt] = useState(0);
  const [inView, setInView] = useState(false);
  const { scrollYProgress } = useScroll({ target: room, offset: ['start end', 'start 0.15'] });
  const inset = useTransform(scrollYProgress, [0, 1], [24, 0]);
  const round = useTransform(scrollYProgress, [0, 1], [28, 0]);
  const clipPath = useTransform([inset, round], ([i, r]) => `inset(0px ${i}px round ${r}px)`);
  const { scrollYProgress: tp } = useScroll({ target: track, offset: ['start start', 'end end'] });
  useMotionValueEvent(tp, 'change', (v) => { if (pinned.current) setAt(Math.min(FACTS.length - 1, Math.max(0, Math.floor(v * FACTS.length)))); });
  const [vendor, pick] = useSteps(VENDORS.length, 1800, at === 5 && inView);

  useEffect(() => {
    const mq = matchMedia('(max-width: 900px) and (prefers-reduced-motion: no-preference)');
    const sync = () => { pinned.current = mq.matches; };
    sync();
    mq.addEventListener('change', sync);
    const io = new IntersectionObserver((es) => es.forEach((e) => !pinned.current && e.isIntersecting && setAt(+e.target.dataset.i)), { rootMargin: '-45% 0px -45% 0px' });
    arts.current.forEach((a) => a && io.observe(a));
    const seen = new IntersectionObserver(([e]) => setInView(e.isIntersecting));
    if (room.current) seen.observe(room.current);
    return () => { io.disconnect(); seen.disconnect(); mq.removeEventListener('change', sync); };
  }, []);

  return (
    <motion.section ref={room} className="hs-ch hc" data-room="dark" aria-label="What it is" style={{ clipPath }}>
      <div className="v2-wrap hc-in" ref={track}>
        <div className="hc-frame">
        <div className="hc-copy">
          {FACTS.map(([t, d], i) => (
            <article key={t} ref={(el) => (arts.current[i] = el)} data-i={i} className="hc-art" data-on={i === at ? '' : undefined}>
              <h2 className="hc-t" id={'hs-ch-' + i}>{t}</h2>
              <p className="hc-n v2-kick">{pad(i + 1)} / {pad(FACTS.length)}{i === 0 && <span className="hc-what">What it is</span>}</p>
              <p className="hc-d">{d}</p>
              {i === 5 && (
                <div className="hs-vendors" role="tablist" aria-labelledby="hs-ch-5">
                  {VENDORS.map((v, k) => (
                    <button key={v} type="button" role="tab" aria-selected={vendor === k} onClick={() => pick(k)}>
                      {vendor === k && <motion.span layoutId="hs-vendor" className="hs-vendor-bg" transition={{ duration: 0.3, ease: EASE }} />}
                      <span className="hs-vendor-t">{v}</span>
                    </button>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
        <div className="hc-vis">
          <div className="hc-vis-in">
            <Exploded at={at} vendor={vendor} />
          </div>
        </div>
        </div>
      </div>
    </motion.section>
  );
}

const Gh = () => <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" /></svg>;

/* Paste and ship, page-local (the shared ShipPrompt's words and layout, its own stage): the prompt keys itself in once
   as it arrives, a caret at its end, and Copy answers when the line is whole. The full prompt is in the HTML (screen
   readers and scripts-off read it whole); Copy copies exactly that. Reduced motion: the whole line, no keying. */
const PROMPT = 'Read https://hanzo.ai/skill.md and use Hanzo HSM in my project.';
function Ship() {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.6 });
  const calm = useReducedMotion();
  const [n, setN] = useState(PROMPT.length);
  const armed = useRef(false);
  // before the stage is reached (it starts well below the fold), clear the line so it can key in on arrival
  useEffect(() => { if (!calm && !seen && ref.current && ref.current.getBoundingClientRect().top > innerHeight) { armed.current = true; setN(0); } }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!seen || !armed.current || n >= PROMPT.length) return;
    const t = setTimeout(() => setN((k) => Math.min(PROMPT.length, k + 2)), n === 0 ? 260 : 26);
    return () => clearTimeout(t);
  }, [seen, n]);
  const done = n >= PROMPT.length;
  return (
    <section className="sp v2-sec hs-ship">
      <div className="v2-wrap v2-grid sp-grid">
        <div className="sp-copy">
          <h2 className="v2-headline sp-h">Paste and ship</h2>
          <p className="v2-body sp-d">Paste this into any agent. It reads the skill manifest and calls HSM from there.</p>
        </div>
        <figure ref={ref} className={'hs-ship-card' + (done && armed.current ? ' done' : '')}>
          <figcaption className="hs-ship-h"><span>Agent prompt</span><Copy text={PROMPT} /></figcaption>
          <pre tabIndex={0} aria-label="Agent prompt"><code>
            <span className="hs-sr">{PROMPT}</span>
            <span aria-hidden="true">{PROMPT.slice(0, n)}<i className={'hs-caret' + (done ? ' off' : '')} /><span className="hs-rest">{PROMPT.slice(n)}</span></span>
          </code></pre>
        </figure>
      </div>
    </section>
  );
}

/* The close: the shared GetIt's words and styles. Its object is type: the modules Hanzo names, set large in the order
   Hanzo lists them, each taking the light in turn (the module drawing is not shown a third time). "hanzoai" is a quiet
   meta line beside the licence, so the one GitHub link is the button. */
function Close() {
  const [ref, live] = useLive(0.4);
  const [k] = useSteps(MODULES.length, 1600, live);
  return (
    <section className="gi hs-close" ref={ref}>
      <div className="v2-wrap gi-in">
        <div className="gi-copy">
          <h2 className="v2-display m gi-h">Get HSM</h2>
          <p className="v2-kick gi-lead">Get started with HSM</p>
          <p className="v2-lede gi-tag">Hardware security module</p>
          <div className="gi-meta">
            <span className="gi-chip"><span>License:</span> Apache-2.0</span>
            <span className="hs-meta"><Gh />hanzoai</span>
          </div>
          <div className="gi-acts">
            <Cta to="https://github.com/hanzoai" id="hsm.close" size="lg">View on GitHub</Cta>
            <p className="gi-more"><Cta to="https://platform.hanzo.ai/deploy" kind="link" id="hsm.deploy">Deploy to Cloud</Cta></p>
          </div>
        </div>
        <ul className="hs-names">
          {MODULES.map((v, i) => <li key={v} data-on={i === k ? '' : undefined}>{v}</li>)}
        </ul>
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

      <Chapters />

      <Ship />

      <Close />
    </main>
  );
}
