'use client';
/* Hanzo beta. Its idea is the pass that lets you in early.
   Signature: three passes, A, B and C, held as a fanned deck; the deck deals itself, bringing each pass to the front
   in turn, and a tap brings the one you want forward with its Apply stub.
   Beyond: say what you are after (use it first, evaluate it first, build it with the team) and the deck hands you
   the pass made for it, read from Hanzo's own description of each.
   Every word is Hanzo's. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { EASE } from '../ui';
import { A } from '../kit';
import './Beta.css';

const PASSES = [
  ['A', 'Beta access', 'New releases before they ship.', '/beta/apply', 'Use it first'],
  ['B', 'Research access', 'Research models and checkpoints to evaluate before release.', '/beta/research', 'Evaluate it first'],
  ['C', 'Design partner', 'Build it with the team. Chosen from applications.', '/beta/design', 'Build it with the team'],
];
const PRODUCTS = [['Dev', '/dev'], ['Studio', '/studio'], ['Kai', '/kai'], ['Enso', '/enso'], ['Zen', '/zen']];
const FAN = [{ x: -34, r: -9 }, { x: 0, r: 0 }, { x: 34, r: 9 }];

function Deck({ at, pick }) {
  const [fan, setFan] = useState(1); // a phone holds the deck closer, so no pass leaves the screen
  useEffect(() => { setFan(matchMedia('(max-width: 900px)').matches ? 0.4 : 1); }, []);
  return (
    <div className="xbt-deck">
      {PASSES.map(([k, t, d, to], i) => {
        const on = i === at;
        const off = (i - at + 3) % 3; // 0 front, 1 next, 2 last
        return (
          <motion.article
            key={k}
            className={'xbt-pass' + (on ? ' on' : '')}
            initial={false}
            animate={{ x: FAN[i].x * fan + '%', rotate: on ? 0 : FAN[i].r * fan, y: on ? -18 : off * 6, scale: on ? 1.04 : 0.94 }}
            transition={{ type: 'spring', stiffness: 220, damping: 24 }}
            style={{ zIndex: on ? 5 : 3 - off }}
          >
            <button type="button" className="xbt-pick" onClick={() => pick(i)} aria-pressed={on} aria-label={`${t}: ${d}`} />
            <span className="xbt-k x-mono">Pass</span>
            <b className="xbt-l">{k}</b>
            <h2 className="xbt-t">{t}</h2>
            <p className="xbt-d">{d}</p>
            <i className="xbt-perf" aria-hidden="true" />
            <A to={to} className="xbt-stub" tabIndex={on ? 0 : -1}><span>Apply</span><span aria-hidden="true">→</span></A>
          </motion.article>
        );
      })}
    </div>
  );
}

/* Feedback is filed on your Hanzo account, so the sheet asks you to sign in first. */
function Feedback() {
  const [open, setOpen] = useState(false);
  const btn = useRef(null);
  useEffect(() => {
    if (!open) return;
    const esc = (e) => { if (e.key === 'Escape') { setOpen(false); btn.current?.focus(); } };
    addEventListener('keydown', esc);
    return () => removeEventListener('keydown', esc);
  }, [open]);
  return (
    <>
      <button ref={btn} type="button" className="xbt-quiet" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="xbt-fb">Feedback</button>
      <AnimatePresence>
        {open && (
          <motion.div id="xbt-fb" className="xbt-fb" role="dialog" aria-label="Feedback" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.35, ease: EASE }}>
            <p>Sign in so this is filed on your account.</p>
            <A to="/login?next=%2Fbeta" className="x-btn solid">Log in</A>
            <button type="button" className="xbt-x" onClick={() => { setOpen(false); btn.current?.focus(); }} aria-label="Close">×</button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function Beta() {
  const [at, setAt] = useState(0);
  const [mine, setMine] = useState(false);
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.3 });
  const calm = useReducedMotion();
  useEffect(() => {
    if (mine || calm || !seen) return;
    const t = setTimeout(() => setAt((v) => (v + 1) % 3), 2800);
    return () => clearTimeout(t);
  }, [at, mine, calm, seen]);
  const pick = (i) => { setMine(true); setAt(i); };
  return (
    <main className="xbt">
      <section className="xbt-hero" ref={box} aria-labelledby="xbt-h1">
        <div className="x-wrap xbt-grid">
          <div className="xbt-copy">
            <motion.p className="x-kick" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>Hanzo beta</motion.p>
            <h1 id="xbt-h1" className="xbt-h1"><span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.05 }}>Get there first.</motion.span></span></h1>
            <motion.p className="xbt-lede" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}>
              Early access to {PRODUCTS.map(([n, to], i) => (
                <span key={n}><A to={to} className="xbt-prod">{n}</A>{i < 3 ? ', ' : i === 3 ? ' and ' : '.'}</span>
              ))}
            </motion.p>
            <motion.div className="xbt-want" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.45 }}>
              <p className="xbt-want-k">What are you after?</p>
              <div className="xbt-chips" role="radiogroup" aria-label="What are you after?">
                {PASSES.map(([k, , , , w], i) => (
                  <button key={k} type="button" role="radio" aria-checked={mine && at === i} onClick={() => pick(i)}>
                    {mine && at === i && <motion.span layoutId="xbt-chip" className="xbt-chip-bg" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                    <span>{w}</span>
                  </button>
                ))}
              </div>
              <AnimatePresence mode="wait" initial={false}>
                {mine && (
                  <motion.p key={at} className="xbt-hand" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3, ease: EASE }} aria-live="polite">
                    Pass {PASSES[at][0]}, {PASSES[at][1]}: <A to={PASSES[at][3]} data-thumb={'Apply for ' + PASSES[at][1]}>Apply →</A>
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: EASE, delay: 0.2 }}>
            <Deck at={at} pick={pick} />
          </motion.div>
        </div>
      </section>
      <section className="xbt-foot" data-room="dark">
        <div className="x-wrap xbt-foot-in">
          <Feedback />
          <motion.a href="https://cal.com/hanzo" target="_blank" rel="noopener noreferrer" className="xbt-call" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>Book a call<span aria-hidden="true">↗</span></motion.a>
        </div>
      </section>
    </main>
  );
}
