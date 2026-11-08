'use client';
// Signature: one-question (docs/MOTION-MAP.md). The form asks one thing per screen and slides to the next: the address,
//   then the check (your answer summarised, Subscribe sends it), then done; the paper beside it writes each answer down
//   as it builds and folds into an envelope addressed to you.
// Beyond: the issue drawn before you commit: each line Hanzo promises is a line on the paper (point at one and it lights), your address is written on it as you type, and it folds into an envelope once the confirm link is out.
/* The Hanzo newsletter.
   Persona: a builder who wants Hanzo's releases in the inbox. Goal: subscribe. CTA: "Subscribe". Metric: lead_submit.
   One screen, read in Hanzo's own order (rule 4, docs/COPY-RULE.md: a simple page stays simple): the title, the lede,
   the three things an issue carries, the form and the line under it; the paper issue beside them.
   0 UI hues. The form sends exactly what hanzo.ai sends: POST
   https://api.hanzo.ai/v1/marketing/subscribe {email, source, locale}. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { EASE, Mark } from '../ui';
import { A, Cta, Tick } from '../kit';
import Sigil from '../Sigil';
import LineReveal, { NoJs } from '../v2/LineReveal';
import { StretchScroll } from './newsletter/enter';
import '../v2/ProgramScale.css';
import './Newsletter.css';

const LINES = ['New models and what they measured, the day they ship', 'What changed in the API, the CLI and Hanzo Dev', 'Engineering notes from the people who built it'];
const LEDE = 'Releases, benchmarks and engineering notes, once or twice a month.';
const ok = (e) => e.length <= 320 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
const STEPS = ['ask', 'check', 'sent'];

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

/* The paper is the summary: it tilts toward a fine pointer (2.5° max, none on touch or reduced motion), writes the
   address as you type it, stamps itself once you have checked it, and folds into an envelope when it is sent. */
function Issue({ step, email, hot }) {
  const tilt = useRef(null);
  const calm = useReducedMotion();
  const move = (e) => {
    if (calm || e.pointerType !== 'mouse' || !tilt.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    tilt.current.style.transform = `rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg)`;
  };
  const leave = () => { if (tilt.current) tilt.current.style.transform = ''; };
  const sent = step === 'sent';
  return (
    <div className="xnl-stage" aria-hidden="true" onPointerMove={move} onPointerLeave={leave}>
      <div className="xnl-tilt" ref={tilt}>
      <AnimatePresence mode="wait" initial={false}>
        {!sent ? (
          <motion.div key="paper" className={'xnl-paper' + (step === 'check' ? ' checked' : '')} initial={{ opacity: 0, y: 80, rotate: -6 }} animate={{ opacity: 1, y: 0, rotate: -3 }} exit={{ opacity: 0, y: 60, scaleY: 0.4, rotate: 0, transition: { duration: 0.45, ease: [0.76, 0, 0.24, 1] } }} transition={{ duration: 0.5, ease: EASE, delay: 0.2 }}>
            <div className="xnl-mast">
              <Sigil seed="newsletter" data={[2, 1]} className="xnl-sigil" />
              <span className="xnl-brand"><Mark size={14} /> Hanzo</span>
            </div>
            <ol className="xnl-lines xnl-bars">
              {LINES.map((l, i) => <li key={l} className={i === hot ? 'hot' : undefined} style={{ '--i': i }}><span><i style={{ width: [92, 78, 86][i] + '%' }} /><i style={{ width: [54, 40, 22][i] + '%' }} /></span></li>)}
            </ol>
            <p className={'xnl-paper-to' + (email ? ' on' : '')}><span className="x-mono">To</span><b>{email}</b><span className="xnl-paper-stamp"><Mark size={14} /></span></p>
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
    </div>
  );
}

/* One question at a time. Three panels on one track that slides: ask (the address), check (your answer summarised;
   Subscribe sends it, the arrow goes back), sent (Hanzo's own result line). The answer builds in the summary under
   the track and on the paper. Only the panel in view is focusable. */
function Ask({ email, setEmail, step, setStep }) {
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const field = useRef(null), send = useRef(null), done = useRef(null);
  const at = STEPS.indexOf(step);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    const t = setTimeout(() => (step === 'ask' ? field.current : step === 'check' ? send.current : done.current)?.focus({ preventScroll: true }), 320);
    return () => clearTimeout(t);
  }, [step]);
  const next = (e) => {
    e.preventDefault();
    const v = email.trim();
    if (!ok(v)) return setErr('Enter an email address like you@example.com.');
    setErr(''); setStep('check');
  };
  const go = async () => {
    setErr(''); setBusy(true);
    const s = await subscribe(email.trim());
    setBusy(false);
    if (s === 200) return setStep('sent');
    setErr(s === 429 ? 'Too many tries from here. Try again in an hour.' : s === 400 ? 'Enter an email address like you@example.com.' : 'We could not reach our mail service. Try again in a minute.');
  };
  const panel = (i) => ({ className: 'xnl-q' + (i === at ? ' on' : ''), style: { '--d': i - at }, inert: i !== at ? true : undefined, 'aria-hidden': i !== at || undefined });
  return (
    <div className="xnl-formwrap" id="subscribe" data-thumb="Subscribe" data-href="#subscribe">
      <div className="xnl-track" data-step={step}>
        <div {...panel(0)}>
          <form onSubmit={next} noValidate aria-label="Subscribe to the newsletter" className="xnl-form">
            <input ref={field} id="newsletter-email" type="email" name="email" autoComplete="email" inputMode="email" enterKeyHint="next" placeholder="you@example.com" aria-label="Email address" aria-invalid={!!err && step === 'ask'} aria-describedby={err ? 'newsletter-wrong' : 'newsletter-terms'} value={email} onChange={(e) => { setEmail(e.target.value); if (err && ok(e.target.value.trim())) setErr(''); }} />
            <Cta type="submit" id="newsletter.subscribe" className="xp-cta">Subscribe</Cta>
          </form>
        </div>
        <div {...panel(1)}>
          <div className="xnl-form xnl-check">
            <button type="button" className="xnl-back" aria-label="Previous" onClick={() => setStep('ask')} data-sound="tick">
              <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M13 8H4M7.5 4.5 4 8l3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <b className="xnl-answer">{email.trim()}</b>
            <Cta ref={send} id="newsletter.send" busy={busy} className="xp-cta" onClick={go} data-sound="tap">Subscribe</Cta>
          </div>
        </div>
        <div {...panel(2)}>
          <p className="xnl-sent" role="status" tabIndex={-1} ref={done}>
            <Tick size={22} /><span>Check your inbox: we sent {email.trim()} a link to confirm.</span>
          </p>
        </div>
      </div>
      <AnimatePresence>{err && <motion.p id="newsletter-wrong" className="xnl-err" role="alert" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>{err}</motion.p>}</AnimatePresence>
      <ol className="xnl-sum" aria-hidden="true">
        {STEPS.map((s, i) => <li key={s} className={i < at ? 'done' : i === at ? 'on' : ''}><span className="x-mono">{String(i + 1).padStart(2, '0')}</span>{i === 0 ? <b>{email.trim()}</b> : (i < at || at === 2) ? <Tick size={14} /> : null}</li>)}
      </ol>
      <p id="newsletter-terms" className="xnl-terms">{LEDE} We email a link to confirm first, and every issue has a one-click unsubscribe. <A to="/legal/privacy" className="xnl-link">Privacy</A>.</p>
    </div>
  );
}

const check = <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState('ask');
  const [hot, setHot] = useState(-1);
  return (
    <main className="xp xnl">
      <NoJs />
      <section className="xnl-hero" aria-labelledby="xnl-h1">
        <StretchScroll className="xp-wrap xp-grid xnl-hero-in">
          <div className="xnl-copy">
            <LineReveal as="h1" id="xnl-h1" className="xp-display" lines={['The Hanzo', 'newsletter']} />
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE, delay: 0.3 }}>
              <p className="xp-lede xnl-lede">{LEDE}</p>
              {/* what each issue carries, as Hanzo lists it; pointing at one lights its line on the paper */}
              <ul className="xnl-list" onPointerLeave={() => setHot(-1)}>
                {LINES.map((l, i) => <li key={l} style={{ '--i': i }} onPointerEnter={(e) => { if (e.pointerType === 'mouse') setHot(i); }}>{check}{l}</li>)}
              </ul>
              <Ask email={email} setEmail={setEmail} step={step} setStep={setStep} />
            </motion.div>
          </div>
          <div className="xnl-art"><Issue step={step} email={email.trim()} hot={hot} /></div>
        </StretchScroll>
      </section>
    </main>
  );
}
