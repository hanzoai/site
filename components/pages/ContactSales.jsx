'use client';
/* /contact-sales. V2: 8/10 Utility: a huge kinetic "Talk to sales" beside one question at a time, set big, on a card
   floating over a living violet contour field; the brief you are writing builds itself under the questions; what
   Enterprise includes as a numbered list you can add to that brief; the launches Hanzo built as a slow logo rail.
   Accent: violet.
   Signature: the enquiry is a conversation. One question per screen of the card, set large; Enter moves on, the
   answer slides away up and the next question rises, a progress line springs along. It is still one real form in
   the page and sends exactly what hanzo.ai sends (POST /v1/marketing/leads).
   Supporting (3): masked kinetic headline, once; the contour field behind the card (Sigil); the logo rail.
   Beyond: "Your brief". Your answers gather into a brief under the questions, and the five things Enterprise
   includes can be added to it, from the last question or straight from the list below; each one you add is written
   into your note in Hanzo's own words, so the plan that comes back starts from what you need. */
import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { A, More } from '../kit';
import Sigil from '../Sigil';
import MaskLines from './company/MaskLines';
import C from '../../content';
import '../v2/vc-type.css';
import './ContactSales.css';

const EASE = [0.16, 1, 0.3, 1];
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

function Check() {
  return <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M6 12.5l4 4 8-9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function Form({ v, setV, at, setAt, tick, need }) {
  const [err, setErr] = useState('');
  const [state, setState] = useState('idle'); // idle | sending | sent | failed
  const refs = useRef({});
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    const el = refs.current[STEPS[at].name];
    const t = setTimeout(() => el?.focus({ preventScroll: true }), 380);
    return () => clearTimeout(t);
  }, [at]);
  const check = (i) => {
    const s = STEPS[i], val = v[s.name].trim();
    if (s.req && !val) return s.type === 'size' ? 'Choose your team size.' : `Enter your ${s.label.toLowerCase()}.`;
    if (s.name === 'email' && !okEmail(val)) return 'Enter a work email address.';
    return '';
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
    const common = { id: 'xcs-' + s.name, name: s.name, value: v[s.name], required: s.req, onChange: (e) => { setV({ ...v, [s.name]: e.target.value }); setErr(''); } };
    if (s.type === 'size') return (
      <div className="xcs-sizes" role="radiogroup" aria-labelledby="xcs-l-size">
        {SIZES.map(([val, l]) => (
          <label key={val} className={'xcs-size' + (v.size === val ? ' on' : '')}>
            <input type="radio" name="size" value={val} checked={v.size === val} required onChange={() => { setV({ ...v, size: val }); setErr(''); setTimeout(() => setAt(4), 320); }} ref={(el) => { if (val === '1-49') refs.current.size = el; }} />
            <span>{l}</span>
          </label>
        ))}
      </div>
    );
    if (s.type === 'area') return (
      <>
        <textarea {...common} rows={3} ref={(el) => (refs.current[s.name] = el)} />
        <div className="xcs-need" role="group" aria-label="Add what you need from Enterprise">
          {INCLUDES.map((t) => {
            const on = need.includes(t);
            return <button key={t} type="button" className={on ? 'on' : ''} aria-pressed={on} onClick={() => { tick(t); setErr(''); }}><i aria-hidden="true">{on ? '✓' : '+'}</i>{t}</button>;
          })}
        </div>
      </>
    );
    return (
      <span className="xcs-in">
        <input {...common} type={s.type} autoComplete={s.auto} ref={(el) => (refs.current[s.name] = el)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); next(); } }} />
        {!v[s.name] && <i className="xcs-caret" aria-hidden="true" />}
      </span>
    );
  };
  const size = SIZES.find(([k]) => k === v.size);
  const brief = [v.name.trim(), v.company.trim(), size && size[1]].filter(Boolean);
  const adds = need.filter((l) => INCLUDES.includes(l)).length;
  return (
    <div className="xcs-card vc-obj" id="xcs-form" data-thumb="Talk to sales" data-href="#xcs-form">
      {state === 'sent' ? (
        <motion.div className="xcs-sent" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }} role="status">
          <span className="xcs-sent-i"><Check /></span>
          <h2 className="vc-headline">Thank you{v.name ? ', ' + v.name.split(' ')[0] : ''}.</h2>
          <p className="vc-body">We come back with a plan for your company: where Hanzo runs, what it costs and how you start.</p>
        </motion.div>
      ) : (
        <form aria-label="Talk to sales" method="post" noValidate onSubmit={submit} className="xcs-form">
          <div className="xcs-top">
            <span className="vc-kick vc-num">{String(at + 1).padStart(2, '0')} / {String(STEPS.length).padStart(2, '0')}</span>
            <i className="xcs-progress" aria-hidden="true"><motion.b initial={false} animate={{ scaleX: (at + 1) / STEPS.length }} transition={{ type: 'spring', stiffness: 160, damping: 22 }} /></i>
          </div>
          <div className="xcs-stage">
            {STEPS.map((s, i) => (
              <motion.div key={s.name} className={'xcs-step' + (i === at ? ' on' : '')} initial={false}
                animate={i === at ? { opacity: 1, y: 0 } : { opacity: 0, y: i < at ? -36 : 36 }}
                transition={{ duration: i === at ? 0.6 : 0.3, ease: EASE, delay: i === at ? 0.12 : 0 }}
                aria-hidden={i !== at} inert={i !== at}>
                <label htmlFor={'xcs-' + s.name} id={'xcs-l-' + s.name}>
                  <span className="xcs-n vc-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="xcs-q">{s.label}</span>
                  {s.type === 'size' && <span className="xcs-choose">Choose</span>}
                </label>
                {field(s, i)}
              </motion.div>
            ))}
          </div>
          <div className="xcs-trap" aria-hidden="true">
            <label htmlFor="xcs-website">Leave this empty</label>
            <input id="xcs-website" name="website" tabIndex={-1} autoComplete="off" value={v.website} onChange={(e) => setV({ ...v, website: e.target.value })} />
          </div>
          {err && <p className="xcs-err" role="alert">{err}</p>}
          {state === 'failed' && <p className="xcs-err" role="alert">That did not send. Email <a href="mailto:enterprise@hanzo.ai">enterprise@hanzo.ai</a> and we will reply.</p>}
          <div className="xcs-acts">
            {at > 0 && <button type="button" className="x-btn xcs-big" onClick={() => { setErr(''); setAt(at - 1); }}>Back</button>}
            {at < STEPS.length - 1
              ? <motion.button type="button" className="x-btn solid xcs-big" onClick={next} whileTap={{ scale: 0.97 }}>Next <kbd aria-hidden="true">↵</kbd></motion.button>
              : <motion.button type="submit" className="x-btn solid xcs-big" disabled={state === 'sending'} whileTap={{ scale: 0.97 }}>{state === 'sending' ? 'Sending…' : 'Talk to sales'}</motion.button>}
          </div>
          <div className="xcs-brief" aria-live="polite">
            <span className="vc-kick">Your brief</span>
            <span className="xcs-brief-l">
              {brief.length || adds ? <>{brief.map((b) => <b key={b}>{b}</b>)}{adds > 0 && <b className="acc">+{adds} from Enterprise</b>}</> : <em>Your answers gather here.</em>}
            </span>
          </div>
        </form>
      )}
    </div>
  );
}

function Logo({ l, ghost }) {
  const [bad, setBad] = useState(false);
  const img = useRef(null);
  // an image that failed before the page woke up never fires onError for React: check it once
  useEffect(() => { const i = img.current; if (i && i.complete && !i.naturalWidth) setBad(true); }, []);
  return (
    <A to={l.href} className={'xcs-logo' + (bad ? ' bad' : '')} title={l.name} {...(ghost ? { tabIndex: -1, 'aria-hidden': true } : {})}>
      <img ref={img} src={l.src} alt={ghost ? '' : l.name} loading="lazy" onError={() => setBad(true)} />
      {bad && <span aria-hidden="true">{l.name}</span>}
    </A>
  );
}

export default function ContactSales() {
  const [v, setV] = useState({ name: '', email: '', company: '', size: '', need: '', website: '' });
  const [at, setAt] = useState(0);
  const need = v.need.split('\n').map((l) => l.trim());
  // Beyond: an added inclusion is a line of the note, so the request carries it in Hanzo's own words
  const tick = (t) => {
    setV((o) => { const ls = o.need.split('\n').filter((l) => l.trim()); return { ...o, need: (ls.includes(t) ? ls.filter((l) => l !== t) : [...ls, t]).join('\n') }; });
  };
  return (
    <main className="vc xcs" style={{ '--acc': '#7b61ff' }}>
      <section className="xcs-hero vc-scene" aria-labelledby="xcs-h1">
        <div className="vc-grid xcs-hero-g">
          <div className="xcs-copy">
            <motion.p className="vc-kick acc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, ease: EASE }}>Enterprise</motion.p>
            <MaskLines as="h1" id="xcs-h1" now delay={0.05} lines={['Talk to', 'sales']} className="vc-display" />
            <motion.div className="xcs-copy-f" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, ease: EASE, delay: 0.6 }}>
              <p className="vc-lede">Tell us what you want to build. We come back with a plan for your company: where Hanzo runs, what it costs and how you start.</p>
              <div className="xcs-routes">
                <A to="https://cal.com/hanzo/30min" className="xcs-route"><span>Or book a 30-minute call</span><b>cal.com ↗</b></A>
                <a href="mailto:enterprise@hanzo.ai" className="xcs-route"><span>Prefer email?</span><b>enterprise@hanzo.ai</b></a>
                <A to="https://hanzo.team/start" className="xcs-route"><span>Want it today?</span><b>Get Hanzo Team</b></A>
              </div>
              <p className="xcs-alt"><span>Want instant recommendations or team seat pricing?</span> <A to="/buying-specialist" className="xcs-ai">Talk to AI Buying Specialist →</A></p>
            </motion.div>
          </div>
          <motion.div className="xcs-stagewrap" initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.3, ease: EASE, delay: 0.25 }}>
            <div className="xcs-field" aria-hidden="true"><Sigil seed="contact-sales" data={[30, 24, 7, 5000]} className="xcs-sigil" /></div>
            <Form v={v} setV={setV} at={at} setAt={setAt} tick={tick} need={need} />
          </motion.div>
        </div>
      </section>

      <section className="vc-sec xcs-inc" aria-labelledby="xcs-inc-h">
        <div className="vc-grid">
          <header className="xcs-inc-h">
            <MaskLines id="xcs-inc-h" lines={['What Enterprise includes']} className="vc-headline" />
            <More to="/enterprise">See everything in Enterprise</More>
          </header>
          <ol className="xcs-inc-l">
            {INCLUDES.map((t, i) => {
              const on = need.includes(t);
              return (
                <li key={t} className={on ? 'on' : ''}>
                  <span className="xcs-inc-n vc-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <span className="xcs-inc-t">{t}</span>
                  <button type="button" className="xcs-add" aria-pressed={on} aria-label={(on ? 'Remove from your brief: ' : 'Add to your brief: ') + t} onClick={() => { tick(t); if (!on) setAt(4); }}>
                    {on ? <><Check /> In your brief</> : '+ Add to brief'}
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="xcs-logos" aria-label="Products Hanzo built and launched">
        <p className="vc-kick xcs-logos-k">Products Hanzo built and launched</p>
        <div className="xcs-rail" data-rail>
          <div className="xcs-track">
            {C.trusted.map((l) => <Logo key={l.name} l={l} />)}
            {C.trusted.map((l) => <Logo key={'g' + l.name} l={l} ghost />)}
          </div>
        </div>
      </section>
    </main>
  );
}
