'use client';
/* Affiliates. Its idea is the link that remembers who sent it.
   Signature: the hero is one address bar that writes the affiliate link (https://hanzo.ai/?aff=<code>) by itself; a
   signal runs down the link and an org lands under your name, the three rules lighting as it lands.
   Beyond: the attribution check. Pick a case (your link first, another affiliate first, your own org) and see who the
   org is attributed to, worked only from Hanzo's rule: first touch, one affiliate per org, never your own.
   Every word and figure is Hanzo's. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { EASE, Rise, Copy } from '../ui';
import { A, SecHead } from '../kit';
import './Affiliate.css';

const MAIL = 'mailto:hello@hanzo.ai?subject=Affiliate%20application';
const LINK = 'https://hanzo.ai/?aff=<code>';
const RULES = ['first touch', 'one affiliate per org', 'never your own'];
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/* The address bar types the link; the org rides down to "you". Loops while seen; still for reduced motion. */
function Link() {
  const box = useRef(null);
  const typed = useRef(null);
  const seen = useInView(box, { amount: 0.4 });
  const calm = useReducedMotion();
  const [phase, setPhase] = useState(3); // 0 writing the link, 1 travelling, 2 landed (rules lighting), 3 held
  useEffect(() => {
    if (calm || !seen) { if (typed.current) typed.current.textContent = LINK; setPhase(3); return; }
    let live = true;
    (async () => {
      while (live) {
        setPhase(0);
        for (let i = 0; i <= LINK.length && live; i++) { if (typed.current) typed.current.textContent = LINK.slice(0, i); await wait(i < 18 ? 34 : 70); }
        if (!live) return;
        await wait(350); setPhase(1);
        await wait(1100); if (!live) return; setPhase(2);
        await wait(2600); if (!live) return; setPhase(3);
        await wait(1800);
      }
    })();
    return () => { live = false; };
  }, [seen, calm]);
  return (
    <div className="xaf-stage" ref={box} aria-hidden="true">
      <div className="xaf-bar">
        <i /><i /><i />
        <span className="xaf-url"><span ref={typed}>{LINK}</span><b className={'xaf-caret' + (phase === 0 ? ' on' : '')} /></span>
      </div>
      <div className="xaf-wire">
        <motion.span className="xaf-pulse" initial={false} animate={phase === 1 ? { y: ['0%', '100%'], opacity: [0, 1, 1, 0] } : { y: '0%', opacity: 0 }} transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }} />
      </div>
      <div className="xaf-land">
        <motion.span className="xaf-org" initial={false} animate={phase >= 2 ? { y: 0, opacity: 1, scale: 1 } : { y: -40, opacity: 0, scale: 0.9 }} transition={{ type: 'spring', stiffness: 260, damping: 22 }}>
          <span className="xaf-org-i">Org</span>
          <span>signs up through the link</span>
        </motion.span>
        <span className={'xaf-you' + (phase >= 2 ? ' on' : '')}>is attributed to you</span>
        <ul className="xaf-rules">
          {RULES.map((r, i) => (
            <motion.li key={r} initial={false} animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0.25, y: 6 }} transition={{ duration: 0.5, ease: EASE, delay: phase >= 2 ? 0.25 + i * 0.18 : 0 }}>{r}</motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Hero() {
  const line = (t, d) => <span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: d }}>{t}</motion.span></span>;
  return (
    <section className="xaf-hero" aria-labelledby="xaf-h1">
      <div className="x-wrap xaf-grid">
        <div>
          <motion.p className="x-kick" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>Affiliates</motion.p>
          <h1 id="xaf-h1" className="xaf-h1">{line('Refer customers', 0.05)}{line('to Hanzo', 0.16)}</h1>
          <motion.p className="xaf-lede" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}>Apply to become an affiliate. Every application is reviewed, and the terms are agreed with each affiliate we approve.</motion.p>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}>
            <motion.a href={MAIL} className="x-btn solid xaf-apply" data-thumb="Apply" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>Apply<span aria-hidden="true">→</span></motion.a>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, ease: EASE, delay: 0.15 }}>
          <Link />
        </motion.div>
      </div>
    </section>
  );
}

/* Four steps on one line. */
function Steps() {
  const steps = [
    <>Apply with <code className="xaf-code">POST /v1/affiliate/apply</code><Copy text="POST /v1/affiliate/apply" />, or write to <a href={MAIL}>hello@hanzo.ai</a>.</>,
    <>We review the application and reply.</>,
    <>Once approved you have a code and a link, <code className="xaf-code">{LINK}</code>.</>,
    <>An org that signs up through the link is attributed to you: first touch, one affiliate per org, never your own.</>,
  ];
  return (
    <section className="x-sec xaf-how">
      <div className="x-wrap xaf-how-grid">
        <SecHead title="How it works" />
        <div className="xaf-steps-wrap">
          <i className="xaf-rail" aria-hidden="true" />
          <ol className="xaf-steps">
            {steps.map((s, i) => (
              <Rise as="li" key={i} y={18} delay={i * 0.05}>
                <span className="xaf-n x-mono">{String(i + 1).padStart(2, '0')}</span>
                <p>{s}</p>
              </Rise>
            ))}
          </ol>
          <Rise as="p" className="xaf-note">A <A to="/referral">referral</A> on its own pays nothing.</Rise>
        </div>
      </div>
    </section>
  );
}

const CASES = [
  ['Your link comes first', 'An org signs up through your link.', true, 'Attributed to you.', 'first touch'],
  ['Another affiliate came first', 'The org reached Hanzo through another affiliate’s link before yours.', false, 'Not to you.', 'first touch, one affiliate per org'],
  ['It is your own org', 'You sign your own org up through your link.', false, 'Not to you.', 'never your own'],
];

/* The attribution check: three cases, Hanzo's rule decides each. It walks them by itself until you choose. */
function Check() {
  const [at, setAt] = useState(0);
  const [mine, setMine] = useState(false);
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.4 });
  const calm = useReducedMotion();
  useEffect(() => {
    if (mine || calm || !seen) return;
    const t = setTimeout(() => setAt((v) => (v + 1) % CASES.length), 3200);
    return () => clearTimeout(t);
  }, [at, mine, calm, seen]);
  const keys = (e) => {
    const k = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (!k) return;
    e.preventDefault(); setMine(true);
    const n = (at + k + CASES.length) % CASES.length; setAt(n);
    document.getElementById('xaf-case-' + n)?.focus();
  };
  const c = CASES[at];
  return (
    <section className="x-sec xaf-dark" data-room="dark" ref={box} aria-labelledby="xaf-check">
      <div className="x-wrap">
        <SecHead dark kicker="Attribution" title="Who an org is attributed to." lede="One rule decides every case: first touch, one affiliate per org, never your own." />
        <span id="xaf-check" className="x-sr">Attribution check</span>
        <div className="xaf-check">
          <div className="xaf-cases" role="tablist" aria-label="Choose a case" aria-orientation="vertical" onKeyDown={keys}>
            {CASES.map(([t, d], i) => (
              <button key={t} id={'xaf-case-' + i} type="button" role="tab" aria-selected={at === i} tabIndex={at === i ? 0 : -1} aria-controls="xaf-verdict" onClick={() => { setMine(true); setAt(i); }}>
                {at === i && <motion.span layoutId="xaf-case" className="xaf-case-bg" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                <b>{t}</b><span>{d}</span>
              </button>
            ))}
          </div>
          <div className="xaf-verdict" id="xaf-verdict" role="tabpanel" aria-live="polite">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div key={at} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
                <span className={'xaf-mark' + (c[2] ? ' yes' : '')} aria-hidden="true">{c[2] ? '✓' : '×'}</span>
                <p className="xaf-v">{c[3]}</p>
                <p className="xaf-why">The rule: <b>{c[4]}</b>.</p>
              </motion.div>
            </AnimatePresence>
            {!mine && !calm && <i className="xaf-timer" key={'t' + at} aria-hidden="true" />}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Affiliate() {
  return (
    <main className="xaf">
      <Hero />
      <Steps />
      <Check />
    </main>
  );
}
