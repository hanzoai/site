'use client';
// Signature: the issue writes itself on paper, then folds into an envelope addressed to you.
// Beyond: the double opt-in drawn before you commit: subscribe, confirm the link, then the first issue; nothing in between.
/* The Hanzo newsletter.
   Persona: a builder who wants Hanzo's releases in the inbox. Goal: subscribe. CTA: "Subscribe". Metric: lead_submit.
   V2: 8/10 review fixes: the opt-in is one stage that walks its four steps once (one big at a time, a gliding marker, press to hold); statements ink in word by word with a resting caret; Subscribe and Privacy answer hover. Earlier: the 52px name with one email field under it, the paper issue tilted beside it, setting its lines once and resting; what each issue carries as three statements that grow from 48 to 64px and swell in weight only while each crosses the middle of the screen; the double opt-in as the dark room in Hanzo's own words.
   Motion: the paper setting its lines once and folding into an envelope (signature) + line-masked type + statements
   scrubbed by scroll (the page's one size moment) + a drawn tick when it is sent.
   0 UI hues. The form sends exactly what hanzo.ai sends: POST https://api.hanzo.ai/v1/marketing/subscribe
   {email, source, locale}. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView, useReducedMotion } from 'motion/react';
import { EASE, Mark } from '../ui';
import { A, Cta, Tick } from '../kit';
import Sigil from '../Sigil';
import LineReveal, { NoJs } from '../v2/LineReveal';
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
          <motion.div key="paper" className="xnl-paper" initial={{ opacity: 0, y: 80, rotate: -6 }} animate={{ opacity: 1, y: 0, rotate: -3 }} exit={{ opacity: 0, y: 60, scaleY: 0.4, rotate: 0, transition: { duration: 0.45, ease: [0.76, 0, 0.24, 1] } }} transition={{ duration: 0.5, ease: EASE, delay: 0.2 }}>
            <div className="xnl-mast">
              <Sigil seed="newsletter" data={[2, 1]} className="xnl-sigil" />
              <span className="xnl-brand"><Mark size={14} /> Hanzo</span>
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
    <motion.p className="xnl-sent" role="status" tabIndex={-1} ref={(el) => el?.focus()} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EASE }}>
      <Tick size={22} /><span>Check your inbox: we sent {email.trim()} a link to confirm.</span>
    </motion.p>
  );
  return (
    <div className="xnl-formwrap" id="subscribe" data-thumb="Subscribe" data-href="#subscribe">
      <form onSubmit={submit} noValidate aria-label="Subscribe to the newsletter" className="xnl-form">
        <input id="newsletter-email" type="email" name="email" autoComplete="email" inputMode="email" placeholder="you@example.com" aria-label="Email address" aria-invalid={!!err} aria-describedby={err ? 'newsletter-wrong' : 'newsletter-terms'} value={email} onChange={(e) => setEmail(e.target.value)} />
        <Cta type="submit" id="newsletter.subscribe" busy={state === 'busy'} className="xp-cta">Subscribe</Cta>
      </form>
      <AnimatePresence>{err && <motion.p id="newsletter-wrong" className="xnl-err" role="alert" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>{err}</motion.p>}</AnimatePresence>
      <p id="newsletter-terms" className="xnl-terms">{LEDE} We email a link to confirm first, and every issue has a one-click unsubscribe. <A to="/legal/privacy" className="xnl-link">Privacy</A>.</p>
    </div>
  );
}

// the double opt-in, in Hanzo's own words (from the line under the form)
const PATH = ['Subscribe', 'a link to confirm', 'once or twice a month', 'one-click unsubscribe'];

/* One statement of what an issue carries: it grows from 48px to 64px and its weight swells only while it crosses the
   middle of the screen, then it settles back. */
function Statement({ text, i }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.6 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const wght = useTransform(scrollYProgress, [0.15, 0.5, 0.85], [280, 606, 280]);
  const fontVariationSettings = useTransform(wght, (w) => `'wght' ${Math.round(w)}`);
  const scale = useTransform(scrollYProgress, [0.15, 0.5, 0.85], [0.75, 1, 0.75]);
  const x = useTransform(scrollYProgress, [0, 1], [i % 2 ? -40 : 40, i % 2 ? 40 : -40]);
  const words = text.split(' ');
  return (
    <li ref={ref} className={'xnl-st s' + i + (seen ? ' on' : '')}>
      <span className="xnl-st-n x-mono">{String(i + 1).padStart(2, '0')}</span>
      <motion.p className="xnl-st-t" style={{ fontVariationSettings, x, scale }}>
        {words.map((w, k) => <span key={k} className="xnl-w" style={{ '--k': k }}>{w}{k < words.length - 1 ? ' ' : ''}</span>)}
        <i className="xnl-caret" aria-hidden="true" style={{ '--n': words.length }} />
      </motion.p>
    </li>
  );
}

/* The double opt-in as one object that changes: one step large on the stage at a time, the four as a rail under it
   with a gliding marker. It walks the four once when it comes into view (1.4 s a step), then rests on the last;
   pressing a step shows it. */
function Path() {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.5 });
  const calm = useReducedMotion();
  const [at, setAt] = useState(calm ? PATH.length - 1 : 0);
  const [held, setHeld] = useState(false);
  useEffect(() => {
    if (calm || held || !inView || at >= PATH.length - 1) return;
    const t = setTimeout(() => setAt((v) => v + 1), 1400);
    return () => clearTimeout(t);
  }, [inView, at, held, calm]);
  return (
    <div ref={ref} className="xnl-pathobj" style={{ '--at': at, '--n': PATH.length }}>
      <div className="xnl-big" aria-hidden="true">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.p key={at} className="xnl-big-t" initial={{ y: '105%' }} animate={{ y: 0 }} exit={{ y: '-105%' }} transition={{ duration: 0.5, ease: EASE }}>{PATH[at]}</motion.p>
        </AnimatePresence>
        <span className="xnl-big-n x-mono">{String(at + 1).padStart(2, '0')} / {String(PATH.length).padStart(2, '0')}</span>
      </div>
      <ol className="xnl-steps">
        <i className="xnl-fill" aria-hidden="true" />
        {PATH.map((t, i) => (
          <li key={t}>
            <button type="button" className={'xnl-step' + (i === at ? ' on' : i < at ? ' done' : '')} aria-current={i === at ? 'step' : undefined} onClick={() => { setHeld(true); setAt(i); }}>
              <span className="xnl-n x-mono">{String(i + 1).padStart(2, '0')}</span>
              <b>{t}</b>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState('idle');
  return (
    <main className="xp xnl">
      <NoJs />
      <section className="xnl-hero" aria-labelledby="xnl-h1">
        <div className="xp-wrap xp-grid">
          <div className="xnl-copy">
            <LineReveal as="h1" id="xnl-h1" className="xp-display" lines={['The Hanzo', 'newsletter']} />
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE, delay: 0.3 }}>
              <p className="xp-lede xnl-lede">{LEDE}</p>
              <Form email={email} setEmail={setEmail} state={state} setState={setState} />
            </motion.div>
          </div>
          <div className="xnl-art"><Issue sent={state === 'sent'} email={email.trim()} /></div>
        </div>
      </section>
      <section className="xp-sec xnl-inside" aria-label="Releases, benchmarks and engineering notes">
        <ol className="xnl-sts">
          {LINES.map((l, i) => <Statement key={l} text={l} i={i} />)}
        </ol>
      </section>
      <section className="xp-sec xp-dark xnl-path" data-room="dark" aria-labelledby="xnl-path-h">
        <div className="xp-wrap">
          <h2 id="xnl-path-h" className="xp-head">We email a link to confirm first.</h2>
          <Path />
          <div className="xnl-home">
            <Cta to="#subscribe" kind="quiet" id="newsletter.close" className="xp-ghost xnl-close">Subscribe <i aria-hidden="true">↑</i></Cta>
            <A to="/" className="xnl-mark" aria-label="Hanzo"><Mark size={22} /></A>
          </div>
        </div>
      </section>
    </main>
  );
}
