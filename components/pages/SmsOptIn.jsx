'use client';
// Signature: a phone that shows what you are agreeing to: your number lands on its To line, the three kinds of text arrive, STOP and HELP sit on its keys.
// Beyond: the consent read in parts: what, how often, cost, how to stop, purchases; each lights its own words in the paragraph and on the phone.
/* SMS opt-in.
   Persona: a Hanzo user who wants codes and alerts by text. Goal: opt in. CTA: "Yes, sign me up!". Metric: lead_submit.
   V2: 8/10 MASTER scale: a 52px headline with its caption under it and one calm form; a phone pinned beside it that mirrors your number, receives the three kinds of text once and rests, and lights what each part of the consent means; then the dark room, where one bubble at a time is big while the others rest at medium, over the STOP and HELP keys.
   Motion: the mirroring phone (signature) + line-masked type + the bubbles taking turns as you scroll + a drawn tick.
   0 UI hues. The form is hanzo.ai's own: one number, one box, one button, enabled once the box is ticked and the
   number has ten digits. It sends exactly what hanzo.ai sends: POST https://api.hanzo.ai/v1/notify/consent
   {phone, consent, channel, source, consentText}. */
import { useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent, useReducedMotion } from 'motion/react';
import { EASE, Mark } from '../ui';
import { A, Cta, Field, Tick } from '../kit';
import LineReveal, { NoJs } from '../v2/LineReveal';
import '../v2/ProgramScale.css';
import './SmsOptIn.css';

// the consent paragraph, word for word, in the parts the chips light
const PARTS = [
  [null, 'I agree to receive text messages (SMS) from Hanzo AI at the number provided, '],
  ['What', 'including one-time passcodes and two-factor authentication, account and security alerts, and transactional notifications.'],
  ['How often', ' Message frequency varies.'],
  ['Cost', ' Message and data rates may apply.'],
  ['How to stop', ' Reply STOP to opt out at any time, or HELP for help.'],
  ['Purchases', ' Consent is not a condition of any purchase.'],
];
const CONSENT = PARTS.map((p) => p[1]).join('');
const KINDS = ['Two-factor authentication codes', 'Account and security alerts', 'Transactional notifications'];

function Handset({ phone, lit, done }) {
  return (
    <div className="xsm-phone" aria-hidden="true">
      <div className="xsm-screen">
        <div className="xsm-bar x-mono"><span>9:41</span><i /></div>
        <div className={'xsm-to' + (lit === 'Cost' ? ' lit' : '')}><span className="x-mono">To</span><b>{phone.trim() || '+1 (555) 000-0000'}</b></div>
        <div className={'xsm-from' + (lit === 'What' || lit === 'Purchases' ? ' lit' : '')}><span className="xsm-av"><Mark size={12} /></span>Hanzo AI</div>
        <ul className={'xsm-msgs' + (done ? ' done' : '') + (lit === 'What' || lit === 'How often' ? ' lit' : '')}>
          {KINDS.map((k, i) => <li key={k} style={{ '--i': i }}>{k}</li>)}
          <AnimatePresence>{done && <motion.li className="xsm-ok" initial={{ opacity: 0, y: 14, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>You&apos;re opted in</motion.li>}</AnimatePresence>
        </ul>
        <div className={'xsm-keys' + (lit === 'How to stop' ? ' lit' : '')}><span>STOP</span><span>HELP</span></div>
      </div>
    </div>
  );
}

/* The dark room: the three kinds of text take turns as you scroll: the one you are on is big (44px), the others rest
   at medium (26px). */
function Kinds() {
  const ref = useRef(null);
  const calm = useReducedMotion();
  const [at, setAt] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.7', 'end 0.4'] });
  useMotionValueEvent(scrollYProgress, 'change', (v) => { if (!calm) setAt(Math.min(KINDS.length - 1, Math.floor(v * KINDS.length))); });
  return (
    <section className="xp-sec xp-dark xsm-kinds" data-room="dark" aria-labelledby="xsm-kinds-h">
      <div className="xp-wrap">
        <p className="xp-kick" id="xsm-kinds-h">Hanzo AI</p>
        <ul className="xsm-bubbles" ref={ref}>
          {KINDS.map((k, i) => (
            <motion.li key={k} className={'b' + i + (at === i ? ' on' : '')} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: i * 0.06 }}>{k}</motion.li>
          ))}
        </ul>
        <div className="xsm-big-keys">
          <span className="x-mono">STOP</span><span className="x-mono">HELP</span>
          <p className="xp-lede">Reply STOP to opt out at any time, or HELP for help.</p>
        </div>
      </div>
    </section>
  );
}

export default function SmsOptIn() {
  const [phone, setPhone] = useState('');
  const [agree, setAgree] = useState(false);
  const [state, setState] = useState('idle'); // idle | submitting | done; a refused send returns to idle with the number kept
  const [failed, setFailed] = useState(false);
  const [lit, setLit] = useState(null);
  const ready = agree && phone.replace(/[^0-9]/g, '').length >= 10;
  const submit = async (e) => {
    e.preventDefault();
    if (!ready) return;
    setState('submitting'); setFailed(false);
    let ok = false;
    try {
      const r = await fetch('https://api.hanzo.ai/v1/notify/consent', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone, consent: true, channel: 'sms', source: 'hanzo.ai/sms-opt-in', consentText: CONSENT }) });
      ok = r.ok;
    } catch { /* not sent */ }
    // the consent is a record: only a 2xx shows "You're opted in"; otherwise the number stays and the field is marked
    if (ok) setState('done');
    else { setState('idle'); setFailed(true); setTimeout(() => document.querySelector('.xsm-form [name="phone"]')?.focus(), 0); }
  };
  return (
    <main className="xp xsm">
      <NoJs />
      <section className="xsm-hero" aria-labelledby="xsm-h1">
        <div className="xp-wrap xsm-grid">
          <div className="xsm-words">
            <LineReveal as="h1" id="xsm-h1" className="xp-display md" lines={['Get Hanzo', 'text messages']} />
            <p className="xp-kick xsm-cap">SMS Notifications</p>
            <motion.p className="xp-lede xsm-lede" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE, delay: 0.3 }}>Opt in to receive two-factor authentication codes, account and security alerts, and transactional notifications by SMS.</motion.p>
          </div>
          <motion.div className="xsm-side" initial={{ opacity: 0, y: 48 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}>
            <Handset phone={phone} lit={lit} done={state === 'done'} />
          </motion.div>
          <motion.div className="xsm-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE, delay: 0.4 }}>
            <AnimatePresence mode="wait" initial={false}>
              {state === 'done' ? (
                <motion.div key="done" className="xsm-done" role="status" tabIndex={-1} ref={(el) => el?.focus()} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
                  <Tick size={56} />
                  <h2 className="xp-head">You&apos;re opted in</h2>
                  <p>Thanks — you&apos;ll now receive SMS from Hanzo at {phone}. You can reply <strong>STOP</strong> at any time to opt out, or <strong>HELP</strong> for help.</p>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={submit} id="sms" className="xsm-form" exit={{ opacity: 0, y: -10, transition: { duration: 0.15 } }} data-thumb="Yes, sign me up!" data-href="#sms">
                  <Field className="xsm-f" label="Mobile phone number" name="phone" type="tel" autoComplete="tel" aria-required="true" aria-invalid={failed ? 'true' : undefined} placeholder="+1 (555) 000-0000" value={phone} onChange={(e) => { setPhone(e.target.value); setFailed(false); }} />
                  <div className="xsm-parts" role="group" aria-label="Read the consent in parts">
                    {PARTS.filter((p) => p[0]).map(([k]) => (
                      <button key={k} type="button" aria-pressed={lit === k} onClick={() => setLit(k)} onMouseEnter={() => setLit(k)} onMouseLeave={() => setLit(null)} onFocus={() => setLit(k)} onBlur={() => setLit(null)}>{k}</button>
                    ))}
                  </div>
                  <label className="xsm-agree">
                    <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} aria-label="I agree to receive SMS from Hanzo" />
                    <span className="xsm-box" aria-hidden="true"><svg viewBox="0 0 16 16" width="14" height="14"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                    <span className="xsm-consent">{PARTS.map(([k, t]) => <span key={t} className={k && lit === k ? 'lit' : ''}>{t}</span>)}</span>
                  </label>
                  <Cta type="submit" id="sms-opt-in.submit" busy={state === 'submitting'} disabled={!ready} className="xp-cta xsm-go">Yes, sign me up!</Cta>
                  <p className="xsm-fine">By submitting, you agree to our <A to="/legal/terms" className="xsm-link">Terms of Service</A> and <A to="/legal/privacy" className="xsm-link">Privacy Policy</A>. We never sell or share your mobile number with third parties for marketing.</p>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
      <Kinds />
    </main>
  );
}
