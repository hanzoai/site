'use client';
// Persona: a security or platform engineer who already owns key hardware.
// Goal: see that the key never leaves the hardware and that the module is a line of configuration.
// CTA: View on GitHub (hsm.hero, hsm.close).
// Metric: cta_click hsm.hero
// Motion map: signature spotlight; entrances swing-door, pull-back, venetian-type, sticky-stack, domino
// Signature: spotlight. The black room holds the module and its first five facts; the cursor carries a light across it, and the fact under the light lights its plate in the module and comes up to full ink (touch: tap a fact to place the light; keyboard: Tab or the arrow keys move it). Reduced motion: every fact and every plate lit, no light.
// Beyond: bring the module you already have: pick AWS KMS, Google Cloud KMS, Azure Key Vault, Zymbit or the in-memory signer and the module's bottom plate and lit layer change.
/* HSM (v2, archetype A Launch).
   V2: 8/10 motion map: the spotlight room replaces the pinned chapter scene (no split here): the module and the first five facts in one dark room, the light lighting a fact and its plate; chapter 06 is its own light section with the module picker; five page-local entrances in the map's order (the hero module swings in on a hinge, the room pulls back from close up, the picker's lines slide in from alternate sides, Paste and ship's cards stack as you scroll, the close tips in like dominoes); every word is Hanzo's, said once.
   The module: one hardware module drawn as a stack of plates (the handle Hanzo holds, the boundary, the key, the
   firmware, the module itself). In the hero it is closed and signing: key id and bytes go in, a signature comes out,
   and the module under the interface changes (AWS KMS, Azure Key Vault, Google Cloud KMS, a Zymbit module) while the
   call stays the same. In the room, the fact under the light lights the layer it is about.
   Entrances: each main section carries data-entrance and gets data-in once it is a quarter in view (set on the DOM,
   not in React state, so server and client render the same). The hidden start states live in CSS under .js and
   prefers-reduced-motion: no-preference, so scripts-off and reduced motion show every section at rest.
   Greys only (Hanzo's deck): the module is silver and ink. Every word and link is Hanzo's. */
import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent, ReactNode } from 'react';
import { motion, AnimatePresence, animate, useScroll, useTransform, useMotionValue, useMotionTemplate, useInView, useReducedMotion } from 'motion/react';
import { Cta } from '../../kit';
import { Copy } from '../../ui';
import { useLive, useSteps } from './Frame';
import { Lines } from '../../v2/LiftStage';
import '../../v2/ShipPrompt.css';
import LivePause, { usePause } from '../../v2/LivePause';
import '../../v2/v2scale.css';
import '../../v2/GetIt.css';
import './Hsm.css';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const MODULES = ['AWS KMS', 'Azure Key Vault', 'Google Cloud KMS', 'Zymbit'];
const LAYERS = ['handle', 'boundary', 'key', 'firmware', 'module'];
const pad = (n: number) => String(n).padStart(2, '0');
/* drawn marks, kept apart from Hanzo's words (a tick, an arrow): shapes, not text */
const Tk = () => <svg className="hs-tk" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const Arr = () => <svg className="hs-arr" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;

/* A section's entrance: once a quarter of it is in view it gets data-in, and its CSS entrance plays. The attribute is
   written on the DOM after mount, so the server HTML and the first client render are the same. */
function useEnter() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    // a quarter in view, or (for a section taller than the screen, like the room on a phone) its top fifth of the screen
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.setAttribute('data-in', ''); io.disconnect(); } }, { threshold: [0.25, 0.04], rootMargin: '0px 0px -20% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

/* The hero object's settle, page-local: it paints at its final size (server and client agree, nothing snaps at load),
   then eases back and down a little as the hero scrolls away. Reduced motion holds it still in CSS (.hs-settle). */
function Settle({ children, className }: { children?: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
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
interface ModuleProps {
  gap?: number;
  lit?: number[];
  labels?: Record<number, string>;
  base?: string;
  shares?: boolean;
  small?: boolean;
}

function Module({ gap = 14, lit = [2], labels = {}, base, shares, small }: ModuleProps) {
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
  const tilt = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--tx', (((e.clientX - r.left) / r.width - 0.5) * 5).toFixed(2) + 'deg');
    e.currentTarget.style.setProperty('--ty', (((e.clientY - r.top) / r.height - 0.5) * -5).toFixed(2) + 'deg');
  };
  const flat = (e: PointerEvent<HTMLElement>) => { e.currentTarget.style.setProperty('--tx', '0deg'); e.currentTarget.style.setProperty('--ty', '0deg'); };
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
const SCENES: { gap: number; lit: number[]; labels: Record<number, string>; shares?: boolean }[] = [
  { gap: 62, lit: [0, 2], labels: { 0: 'handle', 2: 'key' } },
  { gap: 80, lit: [2], labels: { 2: 'key' } },
  { gap: 80, lit: [1], labels: { 1: 'password' } },
  { gap: 96, lit: [3], labels: { 3: 'firmware' } },
  { gap: 96, lit: [2], labels: { 2: 'shares' }, shares: true },
];

/* Chapter 06's modules, in the order Hanzo lists them. Picking one changes only the drawing: the name on the bottom
   plate and the lit layer (a cloud KMS keeps the key behind a handle; Zymbit holds it as shares inside its boundary;
   the in-memory signer has only the handle). No sentence is attached to any one module. */
const VENDORS = ['AWS KMS', 'Google Cloud KMS', 'Azure Key Vault', 'Zymbit', 'in-memory signer'];
const VENDOR_LIT = [[0, 2, 4], [0, 2, 4], [0, 2, 4], [1, 2, 4], [0, 4]];

/* The signature: the spotlight room. A rounded black card that opens to full width as it is reached (clip-path on
   scroll), holding the module on one side and the first five facts on the other, all in normal flow (nothing pins).
   A soft light follows the cursor across the room; the fact under it comes up to full ink and lights its plate in the
   module. Touch: tap a fact to place the light. Keyboard: Tab to a fact, or the arrow keys from one fact to the next.
   Reduced motion: no light, every fact at full ink and every plate lit (Hsm.css). Entrance: pull-back. */
function Room() {
  const room = useRef<HTMLElement>(null);
  const enter = useEnter();
  const facts = useRef<(HTMLElement | null)[]>([]);
  const [at, setAt] = useState(0);
  const lx = useMotionValue(-400);
  const ly = useMotionValue(-400);
  const light = useMotionTemplate`radial-gradient(circle 340px at ${lx}px ${ly}px, rgba(255, 255, 255, .10), rgba(255, 255, 255, .03) 45%, transparent 72%)`;
  const { scrollYProgress } = useScroll({ target: room, offset: ['start end', 'start 0.15'] });
  const inset = useTransform(scrollYProgress, [0, 1], [24, 0]);
  const round = useTransform(scrollYProgress, [0, 1], [28, 0]);
  const clipPath = useTransform([inset, round], ([i, r]) => `inset(0px ${i}px round ${r}px)`);

  const centre = (i: number): [number, number] | null => {
    const r = room.current, f = facts.current[i];
    if (!r || !f) return null;
    const a = r.getBoundingClientRect(), b = f.getBoundingClientRect();
    return [b.left - a.left + Math.min(b.width * 0.42, 260), b.top - a.top + b.height / 2];
  };
  const glide = (i: number) => {
    const c = centre(i);
    if (!c) return;
    animate(lx, c[0], { duration: 0.5, ease: EASE });
    animate(ly, c[1], { duration: 0.5, ease: EASE });
  };
  // the light rests on the first fact until the visitor moves it
  useEffect(() => { const c = centre(0); if (c) { lx.set(c[0]); ly.set(c[1]); } }, []); // eslint-disable-line react-hooks/exhaustive-deps
  // phones: the module stays stuck at the top of the room and the facts scroll up under it; the fact that reaches the
  // reading line just below the module takes the light (and lights its plate), so the one stage answers every fact
  useEffect(() => {
    const mq = matchMedia('(max-width: 900px)');
    let raf = 0;
    const f = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!mq.matches) return;
        const vis = room.current?.querySelector('.hc-vis');
        const line = (vis ? vis.getBoundingClientRect().bottom : 0) + innerHeight * 0.12;
        let best = 0, gap = Infinity;
        facts.current.forEach((el, i) => {
          if (!el) return;
          const b = el.getBoundingClientRect();
          const d = Math.abs(b.top + Math.min(b.height, 120) / 2 - line);
          if (d < gap) { gap = d; best = i; }
        });
        setAt(best);
      });
    };
    addEventListener('scroll', f, { passive: true });
    return () => { cancelAnimationFrame(raf); removeEventListener('scroll', f); };
  }, []);

  const under = (y: number) => {
    let best = at, gap = Infinity;
    facts.current.forEach((f, i) => {
      if (!f) return;
      const b = f.getBoundingClientRect();
      const d = y < b.top ? b.top - y : y > b.bottom ? y - b.bottom : 0;
      if (d < gap) { gap = d; best = i; }
    });
    return best;
  };
  const move = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse' || !room.current) return;
    const a = room.current.getBoundingClientRect();
    lx.set(e.clientX - a.left);
    ly.set(e.clientY - a.top);
    const i = under(e.clientY);
    if (i !== at) setAt(i);
  };
  const place = (i: number) => { setAt(i); glide(i); };
  const keys = (e: KeyboardEvent, i: number) => {
    const n = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0;
    if (!n) return;
    e.preventDefault();
    const j = Math.max(0, Math.min(SCENES.length - 1, i + n));
    facts.current[j]?.focus();
  };
  const s = SCENES[at];
  return (
    <motion.section ref={room} className="hs-ch hc" data-room="dark" aria-label="What it is" style={{ clipPath }} onPointerMove={move}>
      <motion.div className="hc-light" aria-hidden="true" style={{ background: light }} />
      <div ref={enter} data-entrance="pull-back" className="v2-wrap hc-in">
        <div className="hc-vis" aria-hidden="true">
          <div className="hs-exp">
            <Module gap={s.gap} lit={s.lit} labels={s.labels} shares={s.shares} base="HSM" />
          </div>
        </div>
        <div className="hc-copy">
          {FACTS.slice(0, 5).map(([t, d], i) => (
            <article
              key={t}
              ref={(el) => { facts.current[i] = el; }}

              className="hc-art"
              data-on={i === at ? '' : undefined}
              tabIndex={0}
              aria-labelledby={'hs-ch-' + i}
              onFocus={() => place(i)}
              onPointerDown={(e) => { if (e.pointerType !== 'mouse') place(i); }}
              onKeyDown={(e) => keys(e, i)}
            >
              <h2 className="hc-t" id={'hs-ch-' + i}>{t}</h2>
              <p className="hc-n v2-kick">{pad(i + 1)} / {pad(FACTS.length)}{i === 0 && <span className="hc-what">What it is</span>}</p>
              <p className="hc-d">{d}</p>
            </article>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

/* Chapter 06 on its own: a light section with the module picker beside the module. Picking a module changes only the
   drawing; the picker cycles by itself while the section is in view until the visitor takes it. Entrance:
   venetian-type, each line sliding in from alternate sides. */
function Picker() {
  const enter = useEnter();
  const [ref, live] = useLive(0.3);
  const [vendor, pick] = useSteps(VENDORS.length, 1800, live);
  const [t, d] = FACTS[5];
  return (
    <section className="hs-pick v2-sec" ref={ref}>
      <div ref={enter} data-entrance="venetian-type" className="v2-wrap v2-grid hs-pick-grid">
        <div className="hs-pick-copy">
          <h2 className="hs-pick-t vt-l" id="hs-ch-5">{t}</h2>
          <p className="hs-pick-n v2-kick vt-l">{pad(6)} / {pad(FACTS.length)}</p>
          <p className="hs-pick-d vt-l">{d}</p>
          <div className="hs-vendors vt-l" role="tablist" aria-labelledby="hs-ch-5">
            {VENDORS.map((v, k) => (
              <button key={v} type="button" role="tab" aria-selected={vendor === k} onClick={() => pick(k)}>
                {vendor === k && <motion.span layoutId="hs-vendor" className="hs-vendor-bg" transition={{ duration: 0.3, ease: EASE }} />}
                <span className="hs-vendor-t">{v}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="hs-pick-vis vt-l" aria-hidden="true">
          <Module gap={70} lit={VENDOR_LIT[vendor]} labels={{ 4: VENDORS[vendor] }} shares={vendor === 3} base={VENDORS[vendor]} />
        </div>
      </div>
    </section>
  );
}

const Gh = () => <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" /></svg>;

/* Paste and ship, page-local (the shared ShipPrompt's words and layout, its own stage): the prompt keys itself in once
   as it arrives, a caret at its end, and Copy answers when the line is whole. The full prompt is in the HTML (screen
   readers and scripts-off read it whole); Copy copies exactly that. Reduced motion: the whole line, no keying.
   Entrance: stack. The words card rises in, then the prompt card rises in under it. */
const PROMPT = 'Read https://hanzo.ai/skill.md and use Hanzo HSM in my project.';
function Ship() {
  const enter = useEnter();
  const ref = useRef<HTMLElement>(null);
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
      <div ref={enter} data-entrance="sticky-stack" className="v2-wrap hs-stack">
        <div className="hs-card hs-card-1">
          <h2 className="v2-headline sp-h">Paste and ship</h2>
          <p className="v2-body sp-d">Paste this into any agent. It reads the skill manifest and calls HSM from there.</p>
        </div>
        <figure ref={ref} className={'hs-card hs-card-2 hs-ship-card' + (done && armed.current ? ' done' : '')}>
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
   Hanzo lists them, each taking the light in turn. "hanzoai" is a quiet meta line beside the licence, so the one GitHub
   link is the button. Entrance: domino, the lines tipping into place one after another. */
function Close() {
  const enter = useEnter();
  const [ref, live] = useLive(0.4);
  const [k] = useSteps(MODULES.length, 1600, live);
  return (
    <section className="gi hs-close" ref={ref}>
      <div ref={enter} data-entrance="domino" className="v2-wrap gi-in">
        <div className="gi-copy">
          <h2 className="v2-display m gi-h dm">Get HSM</h2>
          <p className="v2-kick gi-lead dm">Get started with HSM</p>
          <p className="v2-lede gi-tag dm">Hardware security module</p>
          <div className="gi-meta dm">
            <span className="gi-chip"><span>License:</span> Apache-2.0</span>
            <span className="hs-meta"><Gh />hanzoai</span>
          </div>
          <div className="gi-acts dm">
            <Cta to="https://github.com/hanzoai" id="hsm.close" size="lg">View on GitHub</Cta>
            <p className="gi-more"><Cta to="https://platform.hanzo.ai/deploy" kind="link" id="hsm.deploy">Deploy to Cloud</Cta></p>
          </div>
        </div>
        <ul className="hs-names">
          {MODULES.map((v, i) => <li key={v} className="dm" data-on={i === k ? '' : undefined}><span>{v}</span></li>)}
        </ul>
      </div>
    </section>
  );
}

/* The hero: entrance swing-door. The module swings in on a vertical hinge at its left edge as the page opens. */
function Hero() {
  const enter = useEnter();
  return (
    <section className="hs-hero">
      <div className="v2-wrap v2-grid hs-hero-grid">
        <div className="hs-hero-copy">
          <Lines as="h1" className="v2-display hs-h1" lines={['Hanzo', 'HSM']} data-morph-target="" />
          <p className="v2-body hs-lede v2-in" style={{ animationDelay: '.3s' }}>One interface to the key hardware you already trust — AWS KMS, Azure Key Vault, Google Cloud KMS, or a Zymbit module over PKCS#11. Generate keys, sign with them, and unwrap with them, without the private material ever reaching your process.</p>
          <div className="v2-acts v2-in" style={{ animationDelay: '.42s' }}><Cta to="https://github.com/hanzoai" id="hsm.hero" thumb>View on GitHub</Cta></div>
        </div>
        <Settle className="hs-hero-obj">
          <div ref={enter} data-entrance="swing-door" className="hs-door">
            <Sign />
          </div>
        </Settle>
      </div>
    </section>
  );
}

export default function Hsm() {
  return (
    <main className="v2 hs">
      <Hero />
      <Room />
      <Picker />
      <Ship />
      <Close />
    </main>
  );
}
