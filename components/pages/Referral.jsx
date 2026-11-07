'use client';
// Signature: the link as a pipeline: builders leave your link by every way out and travel Referred, Pending, Qualified.
// Beyond: referral or affiliate, side by side from Hanzo's own terms: what each pays and what each one moves.
/* Referrals. The card is hanzo.ai's own signed-out card (your link, Copy, the three counts, read only when you are
   signed in); around it the path a referral takes is drawn running: out through the seven ways to share, in through
   the three counts. No figure is shown that Hanzo does not show. */
import { useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { EASE, Rise } from '../ui';
import { A, Go, More, SecHead } from '../kit';
import './Referral.css';

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
    <div className="xrf-win" data-slot="referral">
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
          <motion.p key={nudge} className={'xrf-signin' + (nudge ? ' on' : '')} initial={nudge ? { x: -6 } : false} animate={{ x: 0 }} transition={{ type: 'spring', stiffness: 700, damping: 12 }} aria-live="polite">Sign in and your link, and everyone it brings, is here.</motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

function How() {
  const ref = useRef(null);
  const on = useInView(ref, { once: true, amount: 0.4 });
  return (
    <section className="x-sec xrf-how" aria-labelledby="xrf-how-h">
      <div className="x-wrap">
        <SecHead kicker="Referrals" title="How it works" id="xrf-how-h" />
        <ol className="xrf-steps" ref={ref}>
          <i className="xrf-wire" aria-hidden="true"><b /></i>
          {STEPS.map(([t, k], i) => (
            <Rise as="li" key={k} delay={i * 0.09}>
              <span className="xrf-glyph"><Glyph k={k} on={on} /></span>
              <span className="xrf-n x-mono">{String(i + 1).padStart(2, '0')}</span>
              <p>{t}</p>
            </Rise>
          ))}
        </ol>
      </div>
    </section>
  );
}

const SIDES = {
  Referral: [['Pays', 'A referral pays nothing.'], ['Moves', 'Each one moves you up the beta waitlist.'], ['Counts', 'It qualifies with its first metered spend.']],
  Affiliate: [['Pays', 'Affiliates are paid on what their referrals spend.'], ['Joins', 'Apply to refer organizations to Hanzo.'], ['Terms', 'The terms are agreed with each affiliate we approve.']],
};

function Which() {
  const [side, setSide] = useState('Referral');
  return (
    <section className="x-sec xrf-which" data-room="dark" aria-labelledby="xrf-which-h">
      <div className="x-wrap xrf-which-in">
        <div>
          <Rise as="p" className="x-kick">Referral or affiliate</Rise>
          <h2 id="xrf-which-h" className="xrf-which-h">A referral pays nothing. <span>Affiliates are paid on what their referrals spend.</span></h2>
          <div className="x-row-links tight"><More to="/affiliate">Affiliates</More></div>
        </div>
        <div className="xrf-side">
          <div className="xrf-tabs" role="tablist" aria-label="Referral or affiliate">
            {Object.keys(SIDES).map((k) => (
              <button key={k} type="button" role="tab" aria-selected={side === k} aria-controls={'xrf-p-' + k} id={'xrf-t-' + k} onClick={() => setSide(k)}>
                {side === k && <motion.span layoutId="xrf-tab" className="xrf-tab-bg" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                <span>{k}</span>
              </button>
            ))}
          </div>
          {Object.entries(SIDES).map(([k, rows]) => (
            <div key={k} id={'xrf-p-' + k} role="tabpanel" aria-labelledby={'xrf-t-' + k} hidden={side !== k} className="xrf-rows">
              {rows.map(([l, t], i) => (
                <motion.div key={l} className="xrf-row" initial={{ opacity: 0, y: 14 }} animate={side === k ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, ease: EASE, delay: i * 0.06 }}>
                  <span className="x-mono">{l}</span><p>{t}</p>
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Referral() {
  const line = (t, d) => <span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: d }}>{t}</motion.span></span>;
  return (
    <main className="xrf">
      <section className="xrf-hero" aria-labelledby="xrf-h1">
        <div className="x-wrap xrf-grid">
          <div>
            <motion.p className="x-kick" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}>Referrals</motion.p>
            <h1 id="xrf-h1" className="xrf-h1">{line('Bring a builder', 0.05)}{line('to Hanzo.', 0.16)}</h1>
            <motion.p className="xrf-lede" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}>One link counts everyone who signs up through it, and who goes on to use Hanzo.</motion.p>
            <motion.div className="xrf-acts" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}>
              <span data-thumb="Get your link" data-href="https://hanzo.ai/signup?next=%2Freferral"><Go to="/signup?next=%2Freferral" solid>Get your link</Go></span>
              <Go to="/login?next=%2Freferral">Sign in</Go>
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1.2, ease: EASE, delay: 0.2 }}>
            <Card />
          </motion.div>
        </div>
      </section>
      <How />
      <Which />
    </main>
  );
}
