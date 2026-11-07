'use client';
// Signature: every way out, in motion: the seven ways to share your link run past as display-size rails in opposite directions, the link riding between them, beside hanzo.ai's own referral card.
// Beyond: referral or affiliate, side by side from Hanzo's own terms: what each pays and what each one moves.
/* Referrals.
   V2: 8/10 rebuilt: display headline beside hanzo.ai's own signed-out referral card as the hero object (your link, Copy, the three counts, read only when signed in); every way out as two display-size rails running in opposite directions; the four steps with their glyphs drawing; referral and affiliate side by side as the dark room.
   Motion: the rails (signature) + line-masked type + glyphs that draw themselves + the card's flow of builders.
   Accent: lime. No figure is shown that Hanzo does not show. */
import { useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { A } from '../kit';
import LineReveal from '../v2/LineReveal';
import '../v2/ProgramScale.css';
import './Referral.css';

const EASE = [0.16, 1, 0.3, 1];
const WAYS = ['X', 'LinkedIn', 'Facebook', 'Bluesky', 'Reddit', 'Hacker News', 'Email'];
const COUNTS = ['Referred', 'Pending', 'Qualified'];
const STEPS = [
  ['Share it anywhere: every way out carries your link.', 'share'],
  ['An account that signs up through it is yours, once and for good.', 'lock'],
  ['It qualifies with its first metered spend.', 'meter'],
  ['Each one moves you up the beta waitlist.', 'up'],
];

function Glyph({ k, on }) {
  const d = {
    share: 'M8 16l16-8M8 16l16 8M8 16h0', lock: 'M10 15v-3a6 6 0 0 1 12 0v3M8 15h16v11H8z', meter: 'M6 22a10 10 0 0 1 20 0M16 22l5-7', up: 'M8 24h4v-5h4v-5h4V9h4',
  }[k];
  return (
    <svg viewBox="0 0 32 32" width="32" height="32" aria-hidden="true">
      <motion.path d={d} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={on ? { pathLength: 1 } : {}} transition={{ duration: 0.9, ease: EASE }} />
    </svg>
  );
}

function Card() {
  const [nudge, setNudge] = useState(0);
  return (
    <div className="xrf-win xp-obj" data-slot="referral">
      <div className="xrf-win-top"><i /><i /><i /><span className="x-mono">Your referral link</span></div>
      <div className="xrf-win-in">
        <div className="xrf-link">
          <span className="x-mono xrf-url">hanzo.ai/?ref=…</span>
          <button type="button" className="xrf-copy" aria-disabled="true" aria-label="Copy link" onClick={() => setNudge((n) => n + 1)}>
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><rect x="5" y="5" width="8.5" height="8.5" rx="2" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="M10.5 3.2V3a.8.8 0 0 0-.8-.8H3a.8.8 0 0 0-.8.8v6.7c0 .44.36.8.8.8h.2" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
            Copy
          </button>
        </div>
        <ul className="xrf-ways" aria-label="Every way out carries your link">
          {WAYS.map((w, i) => <li key={w} style={{ '--i': i }}>{w}</li>)}
        </ul>
        <div className="xrf-counts">
          <i className="xrf-flow" aria-hidden="true">{[0, 1, 2, 3, 4].map((k) => <b key={k} style={{ '--k': k }} />)}</i>
          {COUNTS.map((c) => (
            <div key={c} className="xrf-count"><span className="x-mono">—</span><span>{c}</span></div>
          ))}
        </div>
        <p className="xrf-q">An account qualifies with its first metered spend.</p>
        <AnimatePresence mode="popLayout">
          <motion.p key={nudge} className={'xrf-signin' + (nudge ? ' on' : '')} initial={nudge ? { x: -6 } : false} animate={{ x: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} aria-live="polite">Sign in and your link, and everyone it brings, is here.</motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="xrf-hero" aria-labelledby="xrf-h1">
      <div className="xp-wrap xp-grid">
        <div className="xrf-words">
          <p className="xp-kick">Referrals</p>
          <LineReveal as="h1" id="xrf-h1" className="xp-display md" lines={['Bring a builder', 'to Hanzo.']} />
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.4 }}>
            <p className="xp-lede xrf-lede">One link counts everyone who signs up through it, and who goes on to use Hanzo.</p>
            <div className="xrf-acts">
              <A to="/signup?next=%2Freferral" className="xp-cta" data-thumb="Get your link">Get your link<i aria-hidden="true">→</i></A>
              <A to="/login?next=%2Freferral" className="xp-ghost">Sign in</A>
            </div>
          </motion.div>
        </div>
        <motion.div className="xrf-card" initial={{ opacity: 0, y: 60, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1.3, ease: EASE, delay: 0.25 }}>
          <Card />
        </motion.div>
      </div>
    </section>
  );
}

/* Every way out, as two rails running in opposite directions; the link rides between them. */
function Rails() {
  const row = (k) => WAYS.map((w) => <span key={k + w} className="xrf-rw">{w}<i aria-hidden="true" /></span>);
  return (
    <section className="xrf-rails" aria-label="Every way out carries your link">
      <div className="xrf-rail a" aria-hidden="true"><div className="xrf-run">{row('a')}{row('b')}</div></div>
      <div className="xrf-rail b" aria-hidden="true"><div className="xrf-run">{[0, 1, 2, 3, 4, 5].map((k) => <span key={k} className="xrf-rl x-mono">hanzo.ai/?ref=…</span>)}</div></div>
      <div className="xrf-rail a slow" aria-hidden="true"><div className="xrf-run">{COUNTS.concat(COUNTS, COUNTS, COUNTS).map((c, k) => <span key={k} className="xrf-rc">{c}<i aria-hidden="true">→</i></span>)}</div></div>
    </section>
  );
}

function How() {
  const ref = useRef(null);
  const on = useInView(ref, { once: true, amount: 0.4 });
  return (
    <section className="xp-sec xrf-how" aria-labelledby="xrf-how-h">
      <div className="xp-wrap">
        <div className="xp-grid xrf-how-head">
          <h2 id="xrf-how-h" className="xp-head">How it works</h2>
        </div>
        <ol className="xrf-steps" ref={ref}>
          {STEPS.map(([t, k], i) => (
            <li key={k}>
              <span className="xrf-glyph"><Glyph k={k} on={on} /></span>
              <span className="xrf-n x-mono">{String(i + 1).padStart(2, '0')}</span>
              <p className="xp-title">{t}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const SIDES = [
  ['Referral', [['Pays', 'A referral pays nothing.'], ['Moves', 'Each one moves you up the beta waitlist.'], ['Counts', 'It qualifies with its first metered spend.']]],
  ['Affiliate', [['Pays', 'Affiliates are paid on what their referrals spend.'], ['Joins', 'Apply to become an affiliate.'], ['Terms', 'The terms are agreed with each affiliate we approve.']]],
];

/* Referral or affiliate, side by side (the one dark room). */
function Which() {
  return (
    <section className="xp-sec xp-dark xrf-which" data-room="dark" aria-labelledby="xrf-which-h">
      <div className="xp-wrap">
        <p className="xp-kick">Referral or affiliate</p>
        <h2 id="xrf-which-h" className="xp-display sm xrf-which-h">A referral pays nothing. <span><A to="/affiliate">Affiliates</A> are paid on what their referrals spend.</span></h2>
        <div className="xrf-sides">
          {SIDES.map(([k, rows], j) => (
            <div key={k} className={'xrf-side s' + j}>
              <h3 className="xp-title">{k}</h3>
              <dl>
                {rows.map(([l, t]) => <div key={l}><dt className="x-mono">{l}</dt><dd>{t}</dd></div>)}
              </dl>
              {j === 1 && <A to="/affiliate" className="xrf-more">Affiliates</A>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Referral() {
  return (
    <main className="xp xrf">
      <Hero />
      <Rails />
      <How />
      <Which />
    </main>
  );
}
