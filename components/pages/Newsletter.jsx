'use client';
// Signature: the issue writes itself on paper, then folds into an envelope addressed to you.
// Beyond: the double opt-in drawn before you commit: subscribe, confirm the link, then the first issue; nothing in between.
/* The Hanzo newsletter. Beside the form a paper issue sets its three lines by itself, over a masthead drawn by the
   page's own Sigil. Subscribe and the sheet folds into an envelope with your address on it. The form sends exactly
   what hanzo.ai sends: POST https://api.hanzo.ai/v1/marketing/subscribe {email, source, locale}. */
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EASE, Mark, Rise } from '../ui';
import { A, SecHead, Tick } from '../kit';
import Sigil from '../Sigil';
import './Newsletter.css';

const LINES = ['New models and what they measured, the day they ship', 'What changed in the API, the CLI and Hanzo Dev', 'Engineering notes from the people who built it'];
const LEDE = 'Releases, benchmarks and engineering notes, once or twice a month.';
const ok = (e) => e.length <= 320 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

async function subscribe(email) {
  let r;
  try {
    r = await fetch('https://api.hanzo.ai/v1/marketing/subscribe', {
      method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({ email, source: 'hanzo.ai/newsletter', locale: 'en-US' }),
    });
  } catch { return 0; }
  const j = await r.json().catch(() => null);
  if (!r.ok) return r.status;
  return j?.status === 'pending' ? 200 : 502; // Hanzo counts it subscribed only once the confirm link is out
}

function Issue({ sent, email }) {
  return (
    <div className="xnl-stage" aria-hidden="true">
      <AnimatePresence mode="wait" initial={false}>
        {!sent ? (
          <motion.div key="paper" className="xnl-paper" initial={{ opacity: 0, y: 30, rotate: -2 }} animate={{ opacity: 1, y: 0, rotate: -2 }} exit={{ opacity: 0, y: 60, scaleY: 0.4, rotate: 0, transition: { duration: 0.45, ease: [0.76, 0, 0.24, 1] } }} transition={{ duration: 1, ease: EASE, delay: 0.25 }}>
            <div className="xnl-mast">
              <Sigil seed="newsletter" data={[2, 1]} className="xnl-sigil" />
              <span className="xnl-brand"><Mark size={14} /> Hanzo</span>
              <span className="xnl-issue x-mono">The newsletter</span>
            </div>
            <ol className="xnl-lines">
              {LINES.map((l, i) => <li key={l} style={{ '--i': i }}><span>{l}</span></li>)}
            </ol>
            <i className="xnl-rule" /><i className="xnl-rule short" />
          </motion.div>
        ) : (
          <motion.div key="env" className="xnl-env" initial={{ opacity: 0, y: -40, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 22 }}>
            <motion.i className="xnl-flap" initial={{ rotateX: 180 }} animate={{ rotateX: 0 }} transition={{ duration: 0.7, ease: EASE, delay: 0.25 }} />
            <span className="xnl-stamp"><Mark size={18} /></span>
            <span className="xnl-to x-mono">To</span>
            <span className="xnl-addr">{email}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Form({ email, setEmail, state, setState }) {
  const [err, setErr] = useState('');
  const submit = async (e) => {
    e.preventDefault();
    const v = email.trim();
    if (!ok(v)) return setErr('Enter an email address like you@example.com.');
    setErr(''); setState('busy');
    const s = await subscribe(v);
    if (s === 200) return setState('sent');
    setState('idle');
    setErr(s === 429 ? 'Too many tries from here. Try again in an hour.' : s === 400 ? 'Enter an email address like you@example.com.' : 'We could not reach our mail service. Try again in a minute.');
  };
  if (state === 'sent') return (
    <motion.p className="xnl-sent" role="status" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
      <Tick size={22} /><span>Check your inbox: we sent {email.trim()} a link to confirm. Nothing is sent to you until you do.</span>
    </motion.p>
  );
  return (
    <div className="xnl-formwrap" id="subscribe" data-thumb="Subscribe" data-href="#subscribe">
      <form onSubmit={submit} noValidate aria-label="Subscribe to the newsletter" className="xnl-form">
        <input id="newsletter-email" type="email" name="email" autoComplete="email" inputMode="email" placeholder="you@example.com" aria-label="Email address" aria-invalid={!!err} aria-describedby={err ? 'newsletter-wrong' : 'newsletter-terms'} value={email} onChange={(e) => setEmail(e.target.value)} />
        <motion.button type="submit" className="x-btn solid" disabled={state === 'busy'} whileTap={{ scale: 0.97 }}>{state === 'busy' ? 'Subscribing…' : 'Subscribe'}</motion.button>
      </form>
      <AnimatePresence>{err && <motion.p id="newsletter-wrong" className="xnl-err" role="alert" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>{err}</motion.p>}</AnimatePresence>
      <p id="newsletter-terms" className="xnl-terms">{LEDE} We email a link to confirm first, and every issue has a one-click unsubscribe. <A to="/legal/privacy" className="xnl-link">Privacy</A>.</p>
    </div>
  );
}

const PATH = [
  ['Subscribe', 'Email address'],
  ['Confirm', 'Nothing is sent to you until you do.'],
  ['Read', 'Once or twice a month. Every issue has a one-click unsubscribe.'],
];

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState('idle');
  const line = (t, d) => <span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: d }}>{t}</motion.span></span>;
  return (
    <main className="xnl">
      <section className="xnl-hero" aria-labelledby="xnl-h1">
        <div className="x-wrap xnl-grid">
          <div className="xnl-copy">
            <motion.p className="x-kick" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}>Newsletter</motion.p>
            <h1 id="xnl-h1" className="xnl-h1">{line('The Hanzo', 0.05)}{line('newsletter', 0.16)}</h1>
            <motion.p className="xnl-lede" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}>{LEDE}</motion.p>
            <motion.ul className="xnl-list" initial="h" animate="s" variants={{ s: { transition: { staggerChildren: 0.06, delayChildren: 0.45 } } }}>
              {LINES.map((l) => <motion.li key={l} variants={{ h: { opacity: 0, x: -10 }, s: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE } } }}><Tick size={18} />{l}</motion.li>)}
            </motion.ul>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.6 }}>
              <Form email={email} setEmail={setEmail} state={state} setState={setState} />
            </motion.div>
          </div>
          <Issue sent={state === 'sent'} email={email.trim()} />
        </div>
      </section>
      <section className="x-sec xnl-path" aria-labelledby="xnl-path-h">
        <div className="x-wrap">
          <SecHead kicker="Three steps" title="We email a link to confirm first." id="xnl-path-h" />
          <ol className="xnl-steps">
            <i className="xnl-track" aria-hidden="true"><b /></i>
            {PATH.map(([t, d], i) => (
              <Rise as="li" key={t} delay={i * 0.08}>
                <span className="xnl-n x-mono">{String(i + 1).padStart(2, '0')}</span>
                <b>{t}</b><span>{d}</span>
              </Rise>
            ))}
          </ol>
          <Rise className="xnl-home"><A to="/" className="xnl-mark" aria-label="Hanzo"><Mark size={22} /></A></Rise>
        </div>
      </section>
    </main>
  );
}
