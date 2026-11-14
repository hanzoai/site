'use client';
// Signature: a phone that shows what you are agreeing to: your number lands on its To line, the three kinds of text arrive, STOP and HELP sit on its keys.
// Beyond: the consent read in parts: what, how often, cost, how to stop, purchases; each lights its own words in the paragraph and on the phone.
/* SMS opt-in.
   Persona: a Hanzo user who wants codes and alerts by text. Goal: opt in. CTA: "Yes, sign me up!". Metric: lead_submit.
   V2: 8/10 MASTER scale: a 52px headline with its caption under it and one calm form; a phone pinned beside it that mirrors your number, receives the three kinds of text once and rests, and lights what each part of the consent means; said once: no second room repeats the texts or the keys.
   Motion: the mirroring phone (signature) + line-masked type + the bubbles taking turns as you scroll + a drawn tick.
   0 UI hues. The form is hanzo.ai's own: one number, one box, one button, enabled once the box is ticked and the
   number has ten digits. It sends exactly what hanzo.ai sends: POST https://api.hanzo.ai/v1/notify/consent
   {phone, consent, channel, source, consentText}. */
import { useEffect, useState } from 'react';
import type { ChangeEvent, CSSProperties, FormEvent } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { EASE, Mark } from '../ui';
import { A, Cta, Field, Tick } from '../kit';
import LineReveal, { NoJs } from '../v2/LineReveal';
import '../v2/ProgramScale.css';
import './SmsOptIn.css';

// the consent paragraph, word for word, in the parts the chips light
const PARTS: [kind: string | null, words: string][] = [
  [null, 'I agree to receive text messages (SMS) from Hanzo AI at the number provided, '],
  ['What', 'including one-time passcodes and two-factor authentication, account and security alerts, and transactional notifications.'],
  ['How often', ' Message frequency varies.'],
  ['Cost', ' Message and data rates may apply.'],
  ['How to stop', ' Reply STOP to opt out at any time, or HELP for help.'],
  ['Purchases', ' Consent is not a condition of any purchase.'],
];
const CONSENT = PARTS.map((p) => p[1]).join('');
const KINDS = ['Two-factor authentication codes', 'Account and security alerts', 'Transactional notifications'];

/* The phone's clock is the visitor's own time, its colon ticking each second (it is a real phone, not a picture). */
function Clock() {
  const [t, setT] = useState<Date | null>(null);
  useEffect(() => { const f = () => setT(new Date()); f(); const id = setInterval(f, 1000); return () => clearInterval(id); }, []);
  if (!t) return <span>9:41</span>;
  const h = t.getHours() % 12 || 12, m = String(t.getMinutes()).padStart(2, '0');
  return <span>{h}<em className={'xsm-colon' + (t.getSeconds() % 2 ? ' off' : '')}>:</em>{m}</span>;
}

/* how the phone shows a typed US number (display only; the request sends exactly what was typed) */
function show(v: string) {
  const s = v.trim();
  const d = s.replace(/\D/g, '');
  if (/^1?\d{10}$/.test(d) && !/[a-z]/i.test(s)) { const n = d.slice(-10); return '+1 (' + n.slice(0, 3) + ') ' + n.slice(3, 6) + '-' + n.slice(6); }
  return s;
}

function Handset({ phone, lit, done, failed }: { phone: string; lit: string | null; done: boolean; failed: boolean }) {
  return (
    <div className="xsm-phone" aria-hidden="true">
      <div className="xsm-screen">
        <div className="xsm-bar x-mono"><Clock /><i /></div>
        <div className={'xsm-to' + (lit === 'Cost' ? ' lit' : '') + (failed ? ' fail' : '')}><span className="x-mono">To</span><b>{show(phone) || '+1 (555) 000-0000'}</b></div>
        <div className={'xsm-from' + (lit === 'What' || lit === 'Purchases' ? ' lit' : '')}><span className="xsm-av"><Mark size={12} /></span>Hanzo AI</div>
        <ul className={'xsm-msgs' + (done ? ' done' : '') + (lit === 'What' || lit === 'How often' ? ' lit' : '')}>
          {KINDS.map((k, i) => <li key={k} style={{ '--i': i } as CSSProperties}>{k}</li>)}
          <AnimatePresence>{done && <motion.li className="xsm-ok" initial={{ opacity: 0, y: 14, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>You&apos;re opted in</motion.li>}</AnimatePresence>
        </ul>
        <div className={'xsm-keys' + (lit === 'How to stop' ? ' lit' : '')}><span>STOP</span><span>HELP</span></div>
      </div>
    </div>
  );
}

export default function SmsOptIn() {
  const [phone, setPhone] = useState('');
  const [agree, setAgree] = useState(false);
  const [state, setState] = useState<'idle' | 'submitting' | 'done'>('idle'); // idle | submitting | done; a refused send returns to idle with the number kept
  const [failed, setFailed] = useState<string | false>(false);
  const [lit, setLit] = useState<string | null>(null);
  // once, after the texts land, the consent reads itself in parts (each part lights its words and the phone), then rests;
  // any touch of the form stops it
  const [tour, setTour] = useState(true);
  const calm = useReducedMotion();
  useEffect(() => {
    if (!tour || calm) return;
    const keys = PARTS.filter((p) => p[0]).map((p) => p[0]);
    const ids = keys.map((k, i) => setTimeout(() => setLit(k), 900 + i * 1300));
    ids.push(setTimeout(() => { setLit(null); setTour(false); }, 900 + keys.length * 1300));
    return () => ids.forEach(clearTimeout);
  }, [tour, calm]);
  const stopTour = () => { if (tour) { setTour(false); setLit(null); } };
  const ready = agree && phone.replace(/[^0-9]/g, '').length >= 10;
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!ready) return;
    setState('submitting'); setFailed(false);
    let ok = false, why = 'Request failed';
    try {
      const r = await fetch('https://api.hanzo.ai/v1/notify/consent', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone, consent: true, channel: 'sms', source: 'hanzo.ai/sms-opt-in', consentText: CONSENT }) });
      ok = r.ok;
      if (!ok) why = `Request failed (${r.status})`;
    } catch { /* not sent */ }
    // the consent is a record: only a 2xx shows "You're opted in"; otherwise the number stays, the field is marked and
    // the reason shows in words beside the submit (the same wording as Hanzo's own application forms)
    if (ok) setState('done');
    else {
      setState('idle'); setFailed(why);
      setTimeout(() => {
        document.querySelector<HTMLInputElement>('.xsm-form [name="phone"]')?.focus({ preventScroll: true });
        // the reason is on screen: if it landed under the fold, the page moves just enough to show it
        const r = document.querySelector('.xsm-err')?.getBoundingClientRect();
        if (r && r.bottom > innerHeight - 16) window.scrollTo({ top: scrollY + r.bottom - innerHeight + 32, behavior: 'smooth' });
      }, 0);
    }
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
            <Handset phone={phone} lit={lit} done={state === 'done'} failed={!!failed} />
          </motion.div>
          <motion.div className="xsm-card" initial={{ y: 16 }} animate={{ y: 0 }} transition={{ duration: 0.5, ease: EASE, delay: 0.4 }}>
            <AnimatePresence mode="wait" initial={false}>
              {state === 'done' ? (
                <motion.div key="done" className="xsm-done" role="status" tabIndex={-1} ref={(el) => el?.focus()} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
                  <Tick size={56} />
                  <h2 className="xp-head">You&apos;re opted in</h2>
                  <p>Thanks — you&apos;ll now receive SMS from Hanzo at {show(phone)}. You can reply <strong>STOP</strong> at any time to opt out, or <strong>HELP</strong> for help.</p>
                </motion.div>
              ) : (
                <motion.form key="form" onPointerDown={stopTour} onFocus={stopTour} onSubmit={submit} id="sms" className="xsm-form" exit={{ opacity: 0, y: -10, transition: { duration: 0.15 } }} data-thumb="Yes, sign me up!" data-href="#sms">
                  <Field className="xsm-f" label="Mobile phone number" name="phone" type="tel" autoComplete="tel" aria-required="true" aria-invalid={failed ? 'true' : undefined} placeholder="+1 (555) 000-0000" value={phone} onChange={(e: ChangeEvent<HTMLInputElement>) => { setPhone(e.target.value); setFailed(false); }} />
                  <div className="xsm-parts" role="group" aria-label="Read the consent in parts">
                    {PARTS.filter((p) => p[0]).map(([k]) => (
                      <button key={k} type="button" aria-pressed={lit === k} onClick={() => { setTour(false); setLit(k); }} onPointerEnter={(e) => { if (e.pointerType === 'mouse') setLit(k); }} onPointerLeave={(e) => { if (e.pointerType === 'mouse') setLit(null); }} onFocus={(e) => { if (e.target.matches(':focus-visible')) setLit(k); }} onBlur={(e) => { if (e.target.matches(':focus-visible')) setLit(null); }}>{k}</button>
                    ))}
                  </div>
                  <label className="xsm-agree">
                    <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} aria-label="I agree to receive SMS from Hanzo" />
                    <span className="xsm-box" aria-hidden="true"><svg viewBox="0 0 16 16" width="14" height="14"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                    <span className="xsm-consent">{PARTS.map(([k, t]) => <span key={t} className={k && lit === k ? 'lit' : ''}>{t}</span>)}</span>
                  </label>
                  <Cta type="submit" id="sms-opt-in.submit" busy={state === 'submitting'} disabled={!ready} className="xp-cta xsm-go">Yes, sign me up!</Cta>
                  {failed && <p className="xsm-err" role="alert"><i aria-hidden="true">!</i>{failed}</p>}
                  <p className="xsm-fine">By submitting, you agree to our <A to="/legal/terms" className="xsm-link">Terms of Service</A> and <A to="/legal/privacy" className="xsm-link">Privacy Policy</A>. We never sell or share your mobile number with third parties for marketing.</p>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
      {/* said once: the three kinds of text and STOP / HELP live on the phone and in the consent itself, so there is
          no second room repeating them */}
    </main>
  );
}
