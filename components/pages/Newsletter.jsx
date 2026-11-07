'use client';
// Signature: the issue writes itself on paper, then folds into an envelope addressed to you.
// Beyond: the double opt-in drawn before you commit: subscribe, confirm the link, then the first issue; nothing in between.
/* The Hanzo newsletter.
   V2: 8/10 rebuilt: the name at full display size with one big email field under it, the paper issue tilted beside it as the hero object; what each issue carries as three statements whose weight swells as each one crosses the middle of the screen; the double opt-in as the dark room.
   Motion: the paper setting its lines and folding into an envelope (signature) + line-masked type + variable-weight
   statements scrubbed by scroll (the page's one weight moment) + a drawn tick when it is sent.
   Accent: postmark red. The form sends exactly what hanzo.ai sends: POST https://api.hanzo.ai/v1/marketing/subscribe
   {email, source, locale}. */
import { useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { EASE, Mark } from '../ui';
import { A, Tick } from '../kit';
import Sigil from '../Sigil';
import LineReveal from '../v2/LineReveal';
import '../v2/ProgramScale.css';
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
          <motion.div key="paper" className="xnl-paper" initial={{ opacity: 0, y: 80, rotate: -6 }} animate={{ opacity: 1, y: 0, rotate: -3 }} exit={{ opacity: 0, y: 60, scaleY: 0.4, rotate: 0, transition: { duration: 0.45, ease: [0.76, 0, 0.24, 1] } }} transition={{ duration: 1.2, ease: EASE, delay: 0.3 }}>
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
          <motion.div key="env" className="xnl-env" initial={{ opacity: 0, y: -40, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
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
        <button type="submit" className="xp-cta" disabled={state === 'busy'}>{state === 'busy' ? 'Subscribing…' : 'Subscribe'}</button>
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

/* One statement of what an issue carries: its weight swells as it crosses the middle of the screen. */
function Statement({ text, i }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const wght = useTransform(scrollYProgress, [0.15, 0.5, 0.85], [280, 680, 280]);
  const fontVariationSettings = useTransform(wght, (w) => `'wght' ${Math.round(w)}`);
  const x = useTransform(scrollYProgress, [0, 1], [i % 2 ? -40 : 40, i % 2 ? 40 : -40]);
  return (
    <li ref={ref} className={'xnl-st s' + i}>
      <span className="xnl-st-n x-mono">{String(i + 1).padStart(2, '0')}</span>
      <motion.p className="xnl-st-t" style={{ fontVariationSettings, x }}>{text}</motion.p>
    </li>
  );
}

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState('idle');
  return (
    <main className="xp xnl">
      <section className="xnl-hero" aria-labelledby="xnl-h1">
        <div className="xp-wrap xp-grid">
          <div className="xnl-copy">
            <p className="xp-kick">Newsletter</p>
            <LineReveal as="h1" id="xnl-h1" className="xp-display" lines={['The Hanzo', 'newsletter']} />
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.4 }}>
              <p className="xp-lede xnl-lede">{LEDE}</p>
              <Form email={email} setEmail={setEmail} state={state} setState={setState} />
            </motion.div>
          </div>
          <div className="xnl-art"><Issue sent={state === 'sent'} email={email.trim()} /></div>
        </div>
      </section>
      <section className="xp-sec xnl-inside" aria-label="In every issue">
        <ol className="xnl-sts">
          {LINES.map((l, i) => <Statement key={l} text={l} i={i} />)}
        </ol>
      </section>
      <section className="xp-sec xp-dark xnl-path" data-room="dark" aria-labelledby="xnl-path-h">
        <div className="xp-wrap">
          <p className="xp-kick">Three steps</p>
          <LineReveal onView id="xnl-path-h" className="xp-display sm" lines={['We email a link', 'to confirm first.']} />
          <ol className="xnl-steps">
            {PATH.map(([t, d], i) => (
              <li key={t}>
                <span className="xnl-n x-mono">{String(i + 1).padStart(2, '0')}</span>
                <b>{t}</b><span>{d}</span>
              </li>
            ))}
          </ol>
          <div className="xnl-home">
            <a href="#subscribe" className="xp-cta">Subscribe<i aria-hidden="true">↑</i></a>
            <A to="/" className="xnl-mark" aria-label="Hanzo"><Mark size={22} /></A>
          </div>
        </div>
      </section>
    </main>
  );
}
