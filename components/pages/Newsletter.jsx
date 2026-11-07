'use client';
// Signature: one-question (docs/MOTION-MAP.md). The form asks one thing per screen and slides to the next: the address,
//   then the check (your answer summarised, Subscribe sends it), then done; the paper beside it writes each answer down
//   as it builds and folds into an envelope addressed to you.
// Beyond: the double opt-in drawn before you commit: subscribe, confirm the link, then the first issue; nothing in between.
/* The Hanzo newsletter.
   Persona: a builder who wants Hanzo's releases in the inbox. Goal: subscribe. CTA: "Subscribe". Metric: lead_submit.
   V2: 8/10 motion-map: one-question + stretch-scroll, shrink-to-card, noise-dissolve, card-deal, pixel-resolve
   Sections in order and how each enters (components/pages/newsletter/enter.jsx):
   1 hero (the one-question form and the paper) stretch-scroll; 2 what each issue carries shrink-to-card;
   3 the opt-in envelope noise-dissolve; 4 the four steps card-deal; 5 the close pixel-resolve.
   No pinned scenes. 0 UI hues. The form sends exactly what hanzo.ai sends: POST
   https://api.hanzo.ai/v1/marketing/subscribe {email, source, locale}. */
import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { EASE, Mark } from '../ui';
import { A, Cta, Tick } from '../kit';
import Sigil from '../Sigil';
import LineReveal, { NoJs } from '../v2/LineReveal';
import { StretchScroll, ShrinkToCard, NoiseDissolve, PixelResolve } from './newsletter/enter';
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
function Issue({ step, email }) {
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
              {LINES.map((l, i) => <li key={l} style={{ '--i': i }}><span><i style={{ width: [92, 78, 86][i] + '%' }} /><i style={{ width: [54, 40, 22][i] + '%' }} /></span></li>)}
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

// the double opt-in, in Hanzo's own words (from the line under the form)
const PATH = ['Subscribe', 'a link to confirm', 'once or twice a month', 'one-click unsubscribe'];

/* One statement, its words inking in once (55 ms apart) with a caret resting at the end (colour only: no reflow). */
function Words({ text, on }) {
  const words = text.split(' ');
  return (
    <span className={'xnl-ws' + (on ? ' on' : '')}>
      {words.map((w, k) => <span key={k} className="xnl-w" style={{ '--k': k }}>{w}{k < words.length - 1 ? ' ' : ''}</span>)}
      <i className="xnl-caret" aria-hidden="true" style={{ '--n': words.length }} />
    </span>
  );
}

function Row({ text, i, cur, onOn, onHot }) {
  const ref = useRef(null);
  const on = useInView(ref, { once: true, amount: 0.8 });
  useEffect(() => { if (on) onOn(i); }, [on, i, onOn]);
  return (
    <li ref={ref} className={'xnl-st' + (on ? ' on' : '') + (cur ? ' cur' : '')} onPointerEnter={(e) => { if (e.pointerType === 'mouse') onHot(i); }} onPointerLeave={() => onHot(-1)}>
      <span className="xnl-st-n x-mono" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
      <p className="xnl-st-t"><Words text={text} on={on} /></p>
    </li>
  );
}

/* What each issue carries: the three statements, said once on the page, beside the issue they make up (the hero's paper
   again, small): each statement, as its words ink in, draws its own line on the paper, and the pointer on a statement
   lights its line. Only the newest statement keeps a blinking caret. The section shrinks into a card as you leave it. */
const BARS = [[92, 54], [78, 40], [86, 22]];
function Inside() {
  const [lit, setLit] = useState(0);
  const [hot, setHot] = useState(-1);
  const onOn = useCallback((i) => setLit((v) => Math.max(v, i + 1)), []);
  return (
    <ShrinkToCard className="xnl-inside" aria-label="Releases, benchmarks and engineering notes">
      <div className="xp-wrap xnl-inside-in">
        <ol className="xnl-sts">{LINES.map((l, i) => <Row key={l} text={l} i={i} cur={i === lit - 1} onOn={onOn} onHot={setHot} />)}</ol>
        <div className="xnl-idx" aria-hidden="true">
          <div className="xnl-idx-mast"><Sigil seed="newsletter-inside" data={[1, 2]} className="xnl-sigil" /><span className="xnl-idx-mark"><Mark size={14} /></span></div>
          <ol className="xnl-idx-ls">
            {BARS.map((w, i) => (
              <li key={i} className={(i < lit ? 'on' : '') + (i === hot ? ' hot' : '')}>
                <span className="x-mono">{String(i + 1).padStart(2, '0')}</span>
                <span><i style={{ width: w[0] + '%' }} /><i style={{ width: w[1] + '%' }} /></span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </ShrinkToCard>
  );
}

/* The opt-in shown, not labelled: the hero's envelope travels through the four steps. 01 addressed and sealed; 02 the
   flap opens and the confirm link rises out; 03 the issue rises in its place; 04 its one-click unsubscribe mark rings. */
function Post({ at }) {
  return (
    <div className="xnl-post" data-at={at} aria-hidden="true">
      <div className="xnl-post-env">
        <i className="xnl-post-back" />
        <div className="xnl-post-sheet">
          <div className="xnl-post-link"><i /><svg viewBox="0 0 16 16" width="16" height="16"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
          <div className="xnl-post-issue">
            <span className="xnl-post-mast"><Mark size={12} /></span>
            <i style={{ width: '66%' }} /><i style={{ width: '52%' }} /><i style={{ width: '60%' }} />
            <span className="xnl-post-x"><svg viewBox="0 0 16 16" width="12" height="12"><path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg></span>
          </div>
        </div>
        <i className="xnl-post-front" />
        <span className="xnl-post-to"><i /><i /></span>
        <span className="xnl-post-stamp"><Mark size={14} /></span>
        <i className="xnl-post-flap" />
      </div>
    </div>
  );
}

/* the closing Subscribe stays on this page: it glides back to the form and puts the cursor in the field */
function toForm(e) {
  e.preventDefault();
  const el = document.getElementById('newsletter-email') || document.getElementById('subscribe');
  if (!el) return;
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'center' });
  setTimeout(() => el.focus({ preventScroll: true }), calm ? 0 : 600);
}

/* The double opt-in room: the envelope (noise-dissolve), the four steps dealt as cards with one large word above them
   (card-deal; they walk themselves once, 1.4 s a step, pressing one holds it), then the close (pixel-resolve). */
function Room({ toAsk }) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.4 });
  const dealt = useInView(ref, { once: true, amount: 0.4 });
  const calm = useReducedMotion();
  const [timed, setTimed] = useState(calm ? PATH.length - 1 : 0);
  const [held, setHeld] = useState(null);
  const at = held ?? timed;
  useEffect(() => {
    if (calm || held != null || !inView || timed >= PATH.length - 1) return;
    const t = setTimeout(() => setTimed((v) => v + 1), timed === 0 ? 2000 : 1400);
    return () => clearTimeout(t);
  }, [inView, timed, held, calm]);
  return (
    <section className="xp-dark xnl-path" data-room="dark" aria-labelledby="xnl-path-h">
      <div className="xp-wrap">
        <NoiseDissolve className="xnl-s3">
          <h2 id="xnl-path-h" className="xp-head">We email a link to confirm first.</h2>
          <Post at={at} />
        </NoiseDissolve>
        <div ref={ref} className={'xnl-pathobj xnl-deal' + (dealt ? ' dealt' : '')} style={{ '--at': at, '--n': PATH.length }}>
          <div className="xnl-big" aria-hidden="true">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.p key={at} className="xnl-big-t" initial={{ y: '105%' }} animate={{ y: 0 }} exit={{ y: '-105%' }} transition={{ duration: 0.5, ease: EASE }}>{PATH[at]}</motion.p>
            </AnimatePresence>
          </div>
          <ol className="xnl-steps">
            {PATH.map((t, i) => (
              <li key={t} style={{ '--i': i }}>
                <button type="button" className={'xnl-step' + (i === at ? ' on' : i < at ? ' done' : '')} aria-current={i === at ? 'step' : undefined} data-sound="tick" onClick={() => setHeld(i)}>
                  <span className="xnl-n x-mono">{String(i + 1).padStart(2, '0')}</span>
                  <b>{t}</b>
                </button>
              </li>
            ))}
          </ol>
          <span className="xnl-big-n x-mono" aria-hidden="true">{String(at + 1).padStart(2, '0')} / {String(PATH.length).padStart(2, '0')}</span>
        </div>
        <PixelResolve className="xnl-s5">
          <div className="xnl-home">
            <Cta kind="quiet" id="newsletter.close" data-sound="tap" className="xp-ghost xnl-close" aria-controls="newsletter-email" onClick={(e) => { toAsk(); toForm(e); }}>Subscribe <i aria-hidden="true">↑</i></Cta>
            <A to="/" className="xnl-mark" aria-label="Hanzo"><Mark size={22} /></A>
          </div>
          <div className="xnl-field" aria-hidden="true"><Sigil seed="newsletter-issue" data={[3, 2]} className="xnl-sigil" /></div>
        </PixelResolve>
      </div>
    </section>
  );
}

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState('ask');
  return (
    <main className="xp xnl">
      <NoJs />
      <section className="xnl-hero" aria-labelledby="xnl-h1">
        <StretchScroll className="xp-wrap xp-grid xnl-hero-in">
          <div className="xnl-copy">
            <LineReveal as="h1" id="xnl-h1" className="xp-display" lines={['The Hanzo', 'newsletter']} />
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE, delay: 0.3 }}>
              <p className="xp-lede xnl-lede">{LEDE}</p>
              <Ask email={email} setEmail={setEmail} step={step} setStep={setStep} />
            </motion.div>
          </div>
          <div className="xnl-art"><Issue step={step} email={email.trim()} /></div>
        </StretchScroll>
      </section>
      <Inside />
      <Room toAsk={() => { if (step === 'check') setStep('ask'); }} />
    </main>
  );
}
