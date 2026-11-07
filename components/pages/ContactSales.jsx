'use client';
/* Talk to sales. Signature: the form is a conversation. One question at a time, Enter moves on, a progress line fills,
   and the whole form is still one real form in the page; a contour field drawn from the page's own figures (the
   30-minute call, 24/7 support, teams of 5,000+) drifts behind the copy. It sends exactly what hanzo.ai sends
   (POST /v1/marketing/leads).
   Beyond: "Tick what you need". The last question offers the five things Enterprise includes as chips; each one you
   tick is written into your note, so the plan that comes back starts from what you need. Hanzo's words only. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EASE, Rise } from '../ui';
import { A, More, Tick } from '../kit';
import Sigil from '../Sigil';
import C from '../../content';
import './ContactSales.css';

const SIZES = [['1-49', '1–49 people'], ['50-249', '50–249 people'], ['250-999', '250–999 people'], ['1000-4999', '1,000–4,999 people'], ['5000+', '5,000+ people']];
const STEPS = [
  { name: 'name', label: 'Full name', type: 'text', auto: 'name', req: true },
  { name: 'email', label: 'Work email', type: 'email', auto: 'email', req: true },
  { name: 'company', label: 'Company', type: 'text', auto: 'organization', req: true },
  { name: 'size', label: 'Team size', type: 'size', req: true },
  { name: 'need', label: 'What do you want to build?', type: 'area', req: false },
];
const INCLUDES = ['Run Hanzo in your cloud, on your servers or fully offline', 'Dedicated compute, and your own models trained and hosted', 'Unlimited members, single sign-on, roles and an audit log', 'An uptime guarantee and security review in your contract', '24/7 engineering support and hands-on onboarding'];
const okEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

function Form() {
  const [at, setAt] = useState(0);
  const [v, setV] = useState({ name: '', email: '', company: '', size: '', need: '', website: '' });
  const [err, setErr] = useState('');
  const [state, setState] = useState('idle'); // idle | sending | sent | failed
  const refs = useRef({});
  useEffect(() => { if (at > 0) refs.current[STEPS[at].name]?.focus({ preventScroll: true }); }, [at]);
  const check = (i) => {
    const s = STEPS[i], val = v[s.name].trim();
    if (s.req && !val) return s.type === 'size' ? 'Choose your team size.' : `Enter your ${s.label.toLowerCase()}.`;
    if (s.name === 'email' && !okEmail(val)) return 'Enter a work email address.';
    return '';
  };
  const need = v.need.split('\n').map((l) => l.trim());
  // Beyond: a ticked inclusion is a line of the note, so the request carries it in Hanzo's own words
  const tick = (t) => {
    setV((o) => { const ls = o.need.split('\n').filter((l) => l.trim()); return { ...o, need: (ls.includes(t) ? ls.filter((l) => l !== t) : [...ls, t]).join('\n') }; });
    setErr(''); setAt(4);
  };
  const next = () => { const e = check(at); setErr(e); if (!e && at < STEPS.length - 1) setAt(at + 1); };
  const submit = async (e) => {
    e.preventDefault();
    for (let i = 0; i < STEPS.length; i++) { const m = check(i); if (m) { setAt(i); setErr(m); return; } }
    if (v.website) { setState('sent'); return; } // the honeypot was filled: a bot, quietly accepted
    setState('sending');
    let consent = '';
    try { consent = localStorage.getItem('hz-consent') || ''; } catch {}
    const params = new URLSearchParams(location.search);
    const tags = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].filter((k) => params.get(k)).map((k) => k + '=' + params.get(k)).join('&');
    try {
      const r = await fetch('https://api.hanzo.ai/v1/marketing/leads', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: v.name.trim(), email: v.email.trim(), company: v.company.trim(), size: v.size, need: v.need.trim(), source: 'hanzo.ai/contact-sales', visit: { consent, tags, userAgent: navigator.userAgent, url: location.href } }),
      });
      setState(r.ok ? 'sent' : 'failed');
    } catch { setState('failed'); }
  };
  const field = (s, i) => {
    const common = { id: 'xcs-' + s.name, name: s.name, value: v[s.name], required: s.req, onFocus: () => setAt(i), onChange: (e) => { setV({ ...v, [s.name]: e.target.value }); setErr(''); } };
    if (s.type === 'size') return (
      <div className="xcs-sizes" role="radiogroup" aria-labelledby="xcs-l-size">
        {SIZES.map(([val, l]) => (
          <label key={val} className={'xcs-size' + (v.size === val ? ' on' : '')}>
            <input type="radio" name="size" value={val} checked={v.size === val} required onFocus={() => setAt(i)} onChange={() => { setV({ ...v, size: val }); setErr(''); setTimeout(() => setAt(4), 250); }} ref={(el) => { if (val === '1-49') refs.current.size = el; }} />
            {v.size === val && <motion.span layoutId="xcs-size" className="xcs-size-bg" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
            <span>{l}</span>
          </label>
        ))}
      </div>
    );
    if (s.type === 'area') return (
      <>
        <textarea {...common} rows={4} ref={(el) => (refs.current[s.name] = el)} />
        <div className="xcs-need" role="group" aria-label="Add what you need from Enterprise">
          {INCLUDES.map((t) => {
            const on = need.includes(t);
            return <button key={t} type="button" className={on ? 'on' : ''} aria-pressed={on} onClick={() => tick(t)}><i aria-hidden="true">{on ? '✓' : '+'}</i>{t}</button>;
          })}
        </div>
      </>
    );
    return <input {...common} type={s.type} autoComplete={s.auto} ref={(el) => (refs.current[s.name] = el)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); next(); } }} />;
  };
  return (
    <div className="xcs-card" id="xcs-form" data-thumb="Talk to sales" data-href="#xcs-form">
      <AnimatePresence mode="wait" initial={false}>
        {state === 'sent' ? (
          <motion.div key="sent" className="xcs-sent" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }} role="status">
            <Tick size={44} />
            <h2>Thank you{v.name ? ', ' + v.name.split(' ')[0] : ''}.</h2>
            <p>We come back with a plan for your company: where Hanzo runs, what it costs and how you start.</p>
          </motion.div>
        ) : (
          <motion.form key="form" aria-label="Talk to sales" method="post" noValidate onSubmit={submit} initial={false} exit={{ opacity: 0, y: -10 }}>
            <i className="xcs-progress" aria-hidden="true"><motion.b animate={{ scaleX: (at + 1) / STEPS.length }} transition={{ type: 'spring', stiffness: 160, damping: 24 }} /></i>
            {STEPS.map((s, i) => (
              <motion.div key={s.name} className={'xcs-step' + (i === at ? ' on' : '') + (i < at ? ' done' : '')} initial={false} animate={{ opacity: i === at ? 1 : i < at ? 0.55 : 0.3 }} transition={{ duration: 0.4, ease: EASE }}>
                <label htmlFor={'xcs-' + s.name} id={'xcs-l-' + s.name}>
                  <span className="xcs-n x-mono">{String(i + 1).padStart(2, '0')}</span>{s.label}
                  {s.type === 'size' && <span className="xcs-choose">Choose</span>}
                </label>
                {field(s, i)}
              </motion.div>
            ))}
            <div className="xcs-trap" aria-hidden="true">
              <label htmlFor="xcs-website">Leave this empty</label>
              <input id="xcs-website" name="website" tabIndex={-1} autoComplete="off" value={v.website} onChange={(e) => setV({ ...v, website: e.target.value })} />
            </div>
            <AnimatePresence>{err && <motion.p className="xcs-err" role="alert" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>{err}</motion.p>}</AnimatePresence>
            {state === 'failed' && <p className="xcs-err" role="alert">That did not send. Email <a href="mailto:enterprise@hanzo.ai">enterprise@hanzo.ai</a> and we will reply.</p>}
            <div className="xcs-acts">
              {at > 0 && <button type="button" className="x-btn" onClick={() => setAt(at - 1)}>Back</button>}
              {at < STEPS.length - 1
                ? <motion.button type="button" className="x-btn solid" onClick={next} whileTap={{ scale: 0.97 }}>Next</motion.button>
                : <motion.button type="submit" className="x-btn solid" disabled={state === 'sending'} whileTap={{ scale: 0.97 }}>{state === 'sending' ? 'Sending…' : 'Talk to sales'}</motion.button>}
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ContactSales() {
  return (
    <main className="xcs">
      <section className="x-wrap xcs-top">
        <Sigil seed="contact-sales" data={[30, 24, 7, 5000]} className="xcs-sigil" />
        <div className="xcs-copy">
          <motion.p className="x-kick" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Enterprise</motion.p>
          <h1 className="xcs-h1"><span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE }}>Talk to sales</motion.span></span></h1>
          <motion.p className="xcs-lede" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}>Tell us what you want to build. We come back with a plan for your company: where Hanzo runs, what it costs and how you start.</motion.p>
          <motion.div className="xcs-alt" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, ease: EASE, delay: 0.35 }}>
            <p>Want instant recommendations or team seat pricing?</p>
            <A to="/buying-specialist" className="xcs-ai">Talk to AI Buying Specialist →</A>
          </motion.div>
          <motion.div className="xcs-routes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, ease: EASE, delay: 0.45 }}>
            <A to="https://cal.com/hanzo/30min" className="xcs-route"><span>Or book a 30-minute call</span><i>↗</i></A>
            <a href="mailto:enterprise@hanzo.ai" className="xcs-route"><span>Prefer email?</span><b>enterprise@hanzo.ai</b></a>
            <A to="https://hanzo.team/start" className="xcs-route"><span>Want it today?</span><b>Get Hanzo Team</b></A>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: EASE, delay: 0.2 }}><Form /></motion.div>
      </section>
      <section className="x-wrap xcs-inc">
        <Rise as="h2">What Enterprise includes</Rise>
        <ul>{INCLUDES.map((t, i) => <Rise as="li" key={t} delay={i * 0.06}><Tick delay={i * 0.08} />{t}</Rise>)}</ul>
        <More to="/enterprise">See everything in Enterprise</More>
      </section>
      <section className="xcs-logos" aria-label="Products Hanzo built and launched">
        <p className="x-kick">Products Hanzo built and launched</p>
        <div className="xcs-logo-row">
          {C.trusted.map((l, i) => (
            <motion.span key={l.name} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.04 }}>
              <A to={l.href} className="xcs-logo" title={l.name}><img src={l.src} alt={l.name} loading="lazy" /></A>
            </motion.span>
          ))}
        </div>
      </section>
    </main>
  );
}
