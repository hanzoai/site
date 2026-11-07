'use client';
// Signature: a phone that shows what you are agreeing to: your number lands on its To line, the three kinds of text arrive, STOP and HELP sit on its keys.
// Beyond: the consent read in parts: what, how often, cost, how to stop, purchases; each lights its own words in the paragraph and on the phone.
/* SMS opt-in. The form is hanzo.ai's own: one number, one box, one button, enabled once the box is ticked and the
   number has ten digits. It sends exactly what hanzo.ai sends: POST https://api.hanzo.ai/v1/notify/consent
   {phone, consent, channel, source, consentText}. Beside it a phone mirrors what you type. */
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EASE, Mark } from '../ui';
import { A, Tick } from '../kit';
import Sigil from '../Sigil';
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
        <div className="xsm-to"><span className="x-mono">To</span><b>{phone.trim() || '+1 (555) 000-0000'}</b></div>
        <div className={'xsm-from' + (lit === 'What' ? ' lit' : '')}><span className="xsm-av"><Mark size={12} /></span>Hanzo AI</div>
        <ul className={'xsm-msgs' + (done ? ' done' : '') + (lit === 'What' ? ' lit' : '')}>
          {KINDS.map((k, i) => <li key={k} style={{ '--i': i }}>{k}</li>)}
          <AnimatePresence>{done && <motion.li className="xsm-ok" initial={{ opacity: 0, y: 14, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }}>You&apos;re opted in</motion.li>}</AnimatePresence>
        </ul>
        <div className={'xsm-keys' + (lit === 'How to stop' ? ' lit' : '')}><span>STOP</span><span>HELP</span></div>
      </div>
    </div>
  );
}

export default function SmsOptIn() {
  const [phone, setPhone] = useState('');
  const [agree, setAgree] = useState(false);
  const [state, setState] = useState('idle'); // idle | submitting | done
  const [lit, setLit] = useState(null);
  const ready = agree && phone.replace(/[^0-9]/g, '').length >= 10;
  const submit = async (e) => {
    e.preventDefault();
    if (!ready) return;
    setState('submitting');
    try {
      await fetch('https://api.hanzo.ai/v1/notify/consent', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone, consent: true, channel: 'sms', source: 'hanzo.ai/sms-opt-in', consentText: CONSENT }) });
    } catch { /* hanzo.ai shows the same confirmation either way */ }
    setState('done');
  };
  const line = (t, d) => <span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: d }}>{t}</motion.span></span>;
  return (
    <main className="xsm">
      <section className="xsm-hero" aria-labelledby="xsm-h1">
        <div className="x-wrap xsm-grid">
          <div className="xsm-copy">
            <motion.p className="x-kick" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}>SMS Notifications</motion.p>
            <h1 id="xsm-h1" className="xsm-h1">{line('Get Hanzo', 0.05)}{line('text messages', 0.16)}</h1>
            <motion.p className="xsm-lede" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}>Opt in to receive two-factor authentication codes, account and security alerts, and transactional notifications by SMS.</motion.p>
          </div>
          <motion.div className="xsm-side" initial={{ opacity: 0, y: 30, rotate: 3 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: 1.2, ease: EASE, delay: 0.25 }}>
            <Handset phone={phone} lit={lit} done={state === 'done'} />
          </motion.div>
          <motion.div className="xsm-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}>
            <Sigil seed="sms-opt-in" data={[10]} className="xsm-sigil" />
            <AnimatePresence mode="wait" initial={false}>
              {state === 'done' ? (
                <motion.div key="done" className="xsm-done" role="status" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }}>
                  <Tick size={44} />
                  <h2>You&apos;re opted in</h2>
                  <p>Thanks — you&apos;ll now receive SMS from Hanzo at {phone}. You can reply <strong>STOP</strong> at any time to opt out, or <strong>HELP</strong> for help.</p>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={submit} className="xsm-form" exit={{ opacity: 0, y: -10 }} data-thumb="Yes, sign me up!" data-href="#phone">
                  <div>
                    <label htmlFor="phone" className="xsm-l">Mobile phone number</label>
                    <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" required placeholder="+1 (555) 000-0000" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
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
                  <motion.button type="submit" className="x-btn solid xsm-go" disabled={!ready || state === 'submitting'} whileTap={ready ? { scale: 0.98 } : undefined}>
                    {state === 'submitting' && <i className="xsm-spin" aria-hidden="true" />}Yes, sign me up!
                  </motion.button>
                  <p className="xsm-fine">By submitting, you agree to our <A to="/legal/terms" className="xsm-link">Terms of Service</A> and <A to="/legal/privacy" className="xsm-link">Privacy Policy</A>. We never sell or share your mobile number with third parties for marketing.</p>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
