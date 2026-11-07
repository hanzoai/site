'use client';
/* /contact-sales. V2: 8/10 Utility, in ink and greys only: a huge kinetic "Talk to sales" beside one question at a
   time, set big, on a card over a slow grey contour field; the answers you give gather as chips under the questions;
   what Enterprise includes as five giant numerals you light and add to your note; the launches Hanzo built as a slow
   logo rail with a pause.
   Persona: an enterprise buyer weighing data residency and vendor consolidation.
   Goal: send a qualified enquiry. CTA: "Talk to sales" (the form; data-cta contact-sales.submit). Metric: contact_sales_submit.
   Signature: the enquiry is a conversation. One question per screen of the card, set large; Enter (or the arrow) moves
   on, the answer slides away up and the next question rises, a progress line springs along. It is still one real form
   in the page and sends exactly what hanzo.ai sends (POST https://api.hanzo.ai/v1/marketing/leads, content/forms.json).
   Supporting (3): masked kinetic headline, once; the contour field behind the card (Sigil); the logo rail.
   Beyond: the five things Enterprise includes can be added to your note, from the last question or straight from the
   numerals below; each one is written into the note in Hanzo's own words, and its numeral joins the chips under the
   card, so the plan that comes back starts from what you need.
   Deletes: the violet accent and field; the "Enterprise" eyebrow over the h1; the invented labels ("Your brief",
   "Your answers gather here.", "+N from Enterprise", "+ Add to brief", "In your brief", "Next", "Back", "Sending…",
   the invented error and thank-you sentences), now icons with aria-labels or Hanzo's own sentences; the blinking
   fake caret; native title tooltips on the logos; raw <img>; the opacity-0 arrivals that hid copy with JS off. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { A, More, Img } from '../kit';
import Sigil from '../Sigil';
import MaskLines from './company/MaskLines';
import C from '../../content';
import '../v2/vc-type.css';
import './ContactSales.css';

const EASE = [0.16, 1, 0.3, 1];
const SIZES = [['1-49', '1–49 people'], ['50-249', '50–249 people'], ['250-999', '250–999 people'], ['1000-4999', '1,000–4,999 people'], ['5000+', '5,000+ people']];
const STEPS = [
  { name: 'name', label: 'Full name', type: 'text', auto: 'name', req: true, hint: 'text' },
  { name: 'email', label: 'Work email', type: 'email', auto: 'email', req: true, hint: 'email' },
  { name: 'company', label: 'Company', type: 'text', auto: 'organization', req: true, hint: 'text' },
  { name: 'size', label: 'Team size', type: 'size', req: true },
  { name: 'need', label: 'What do you want to build?', type: 'area', req: false },
];
const INCLUDES = ['Run Hanzo in your cloud, on your servers or fully offline', 'Dedicated compute, and your own models trained and hosted', 'Unlimited members, single sign-on, roles and an audit log', 'An uptime guarantee and security review in your contract', '24/7 engineering support and hands-on onboarding'];
const okEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const two = (n) => String(n).padStart(2, '0');

const Check = ({ s = 18 }) => <svg viewBox="0 0 24 24" width={s} height={s} aria-hidden="true"><path d="M6 12.5l4 4 8-9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const Plus = ({ s = 18 }) => <svg viewBox="0 0 24 24" width={s} height={s} aria-hidden="true"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>;
const ArrowR = () => <svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const ArrowL = () => <svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true"><path d="M13 8H4M7.5 4.5 4 8l3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const Bang = () => <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="currentColor" /><path d="M12 7v6.5M12 16.6v.4" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" /></svg>;

function Form({ v, setV, at, setAt, tick, need }) {
  const [bad, setBad] = useState(-1); // the step whose answer is missing or not an email
  const [state, setState] = useState('idle'); // idle | sending | sent | failed
  const refs = useRef({});
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    const el = refs.current[STEPS[at].name];
    const t = setTimeout(() => el?.focus({ preventScroll: true }), 380);
    return () => clearTimeout(t);
  }, [at]);
  const wrong = (i) => {
    const s = STEPS[i], val = v[s.name].trim();
    return (s.req && !val) || (s.name === 'email' && !okEmail(val));
  };
  const next = () => { if (wrong(at)) { setBad(at); return; } setBad(-1); if (at < STEPS.length - 1) setAt(at + 1); };
  const submit = async (e) => {
    e.preventDefault();
    for (let i = 0; i < STEPS.length; i++) if (wrong(i)) { setAt(i); setBad(i); return; }
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
  const field = (s) => {
    const common = {
      id: 'xcs-' + s.name, name: s.name, value: v[s.name], required: s.req,
      'aria-invalid': bad === STEPS.indexOf(s) || undefined,
      onChange: (e) => { setV({ ...v, [s.name]: e.target.value }); setBad(-1); },
    };
    if (s.type === 'size') return (
      <div className="xcs-sizes" role="radiogroup" aria-labelledby="xcs-l-size" aria-invalid={bad === 3 || undefined}>
        {SIZES.map(([val, l]) => (
          <label key={val} className={'xcs-size' + (v.size === val ? ' on' : '')}>
            <input type="radio" name="size" value={val} checked={v.size === val} required onChange={() => { setV({ ...v, size: val }); setBad(-1); setTimeout(() => setAt(4), 320); }} ref={(el) => { if (val === '1-49') refs.current.size = el; }} />
            <span>{l}</span>
          </label>
        ))}
      </div>
    );
    if (s.type === 'area') return (
      <>
        <textarea {...common} rows={3} ref={(el) => (refs.current[s.name] = el)} />
        <div className="xcs-need" role="group" aria-labelledby="xcs-inc-h">
          {INCLUDES.map((t, i) => {
            const on = need.includes(t);
            return (
              <button key={t} type="button" className={on ? 'on' : ''} aria-pressed={on} onClick={() => tick(t)}>
                <i aria-hidden="true">{two(i + 1)}</i>{t}<span className="xcs-need-g" aria-hidden="true">{on ? <Check s={16} /> : <Plus s={16} />}</span>
              </button>
            );
          })}
        </div>
      </>
    );
    return <input {...common} type={s.type} inputMode={s.hint} autoComplete={s.auto} enterKeyHint="next" ref={(el) => (refs.current[s.name] = el)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); next(); } }} />;
  };
  const size = SIZES.find(([k]) => k === v.size);
  const brief = [v.name.trim(), v.company.trim(), size && size[1]].filter(Boolean);
  const adds = INCLUDES.map((t, i) => (need.includes(t) ? i : -1)).filter((i) => i >= 0);
  const last = at === STEPS.length - 1;
  return (
    <div className="xcs-card vc-obj" id="xcs-form" data-thumb="Talk to sales" data-href="#xcs-form">
      {state === 'sent' ? (
        <motion.div className="xcs-sent" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }} role="status">
          <span className="xcs-sent-i"><Check s={28} /></span>
          <p className="vc-headline xcs-sent-t">We come back with a plan for your company: where Hanzo runs, what it costs and how you start.</p>
        </motion.div>
      ) : (
        <form aria-labelledby="xcs-h1" method="post" noValidate onSubmit={submit} className="xcs-form">
          <div className="xcs-top" aria-hidden="true">
            <span className="vc-kick vc-num">{two(at + 1)} / {two(STEPS.length)}</span>
            <i className="xcs-progress"><motion.b initial={false} animate={{ scaleX: (at + 1) / STEPS.length }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} /></i>
          </div>
          <div className="xcs-stage">
            {STEPS.map((s, i) => (
              <motion.div key={s.name} className={'xcs-step' + (i === at ? ' on' : '') + (bad === i ? ' bad' : '')} initial={false}
                animate={i === at ? { opacity: 1, y: 0 } : { opacity: 0, y: i < at ? -36 : 36 }}
                transition={{ duration: i === at ? 0.52 : 0.22, ease: EASE, delay: i === at ? 0.1 : 0 }}
                aria-hidden={i !== at} inert={i !== at}>
                <label htmlFor={'xcs-' + s.name} id={'xcs-l-' + s.name}>
                  <span className="xcs-q">{s.label}</span>
                  {s.type === 'size' && <span className="xcs-choose">Choose</span>}
                  {bad === i && <span className="xcs-bang" role="alert" aria-label={s.label}><Bang /></span>}
                </label>
                {field(s)}
              </motion.div>
            ))}
          </div>
          <div className="xcs-trap" aria-hidden="true">
            <label htmlFor="xcs-website">Leave this empty</label>
            <input id="xcs-website" name="website" tabIndex={-1} autoComplete="off" value={v.website} onChange={(e) => setV({ ...v, website: e.target.value })} />
          </div>
          {state === 'failed' && (
            <p className="xcs-fail" role="alert"><Bang /><span>Prefer email?</span> <a href="mailto:enterprise@hanzo.ai">enterprise@hanzo.ai</a></p>
          )}
          <div className="xcs-acts">
            <ul className="xcs-chips" aria-live="polite">
              <AnimatePresence initial={false}>
                {brief.map((b) => (
                  <motion.li key={'b' + b} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ type: 'spring', stiffness: 420, damping: 34 }}>{b}</motion.li>
                ))}
                {adds.map((i) => (
                  <motion.li key={'n' + i} className="n" layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ type: 'spring', stiffness: 420, damping: 34 }} aria-label={INCLUDES[i]}>
                    <Check s={14} />{two(i + 1)}
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
            {at > 0 && <button type="button" className="xcs-round" aria-label="Back" onClick={() => { setBad(-1); setAt(at - 1); }}><ArrowL /></button>}
            {!last
              ? <button type="button" className="xcs-round solid" aria-label="Next" onClick={next} data-cta="contact-sales.next"><ArrowR /></button>
              : <button type="submit" className="x-btn solid xcs-big" disabled={state === 'sending'} aria-busy={state === 'sending' || undefined} data-cta="contact-sales.submit">
                  <span className={state === 'sending' ? 'xcs-hide' : ''}>Talk to sales</span>
                  {state === 'sending' && <i className="xcs-ring" aria-hidden="true" />}
                </button>}
          </div>
        </form>
      )}
    </div>
  );
}

function Logo({ l, ghost }) {
  const [bad, setBad] = useState(false);
  const box = useRef(null);
  // an image that failed before the page woke up never fires onError for React: check it once
  useEffect(() => { const i = box.current?.querySelector('img'); if (i && i.complete && !i.naturalWidth) setBad(true); }, []);
  return (
    <A to={l.href} className={'xcs-logo' + (bad ? ' bad' : '')} ref={box} {...(ghost ? { tabIndex: -1, 'aria-hidden': true } : {})}>
      <Img src={l.src} alt={ghost ? '' : l.name} w={128} h={30} onError={() => setBad(true)} />
      {bad && <span aria-hidden="true">{l.name}</span>}
    </A>
  );
}

function Rail() {
  const [run, setRun] = useState(true);
  return (
    <section className="xcs-logos" aria-labelledby="xcs-logos-h" data-ask-hide>
      <div className="vc-wrap xcs-logos-h">
        <h2 id="xcs-logos-h" className="vc-title">Products Hanzo built and launched</h2>
        <button type="button" className="xcs-round" aria-label={run ? 'Pause' : 'Play'} aria-pressed={!run} onClick={() => setRun(!run)}>
          {run
            ? <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M5 3.5v9M11 3.5v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            : <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M5 3.2v9.6L12.5 8z" fill="currentColor" /></svg>}
        </button>
      </div>
      <div className="xcs-rail" data-rail>
        <div className={'xcs-track' + (run ? '' : ' held')}>
          {C.trusted.map((l) => <Logo key={l.name} l={l} />)}
          {C.trusted.map((l) => <Logo key={'g' + l.name} l={l} ghost />)}
        </div>
      </div>
    </section>
  );
}

export default function ContactSales() {
  const [v, setV] = useState({ name: '', email: '', company: '', size: '', need: '', website: '' });
  const [at, setAt] = useState(0);
  const [lit, setLit] = useState(-1);
  const need = v.need.split('\n').map((l) => l.trim());
  // Beyond: an added inclusion is a line of the note, so the request carries it in Hanzo's own words
  const tick = (t) => {
    setV((o) => { const ls = o.need.split('\n').filter((l) => l.trim()); return { ...o, need: (ls.includes(t) ? ls.filter((l) => l !== t) : [...ls, t]).join('\n') }; });
  };
  return (
    <main className="vc xcs" style={{ '--acc': '#1d1d1f' }} data-ask-name="Talk to sales">
      <section className="xcs-hero vc-scene" aria-labelledby="xcs-h1">
        <div className="vc-grid xcs-hero-g">
          <div className="xcs-copy">
            <MaskLines as="h1" id="xcs-h1" now delay={0.05} lines={['Talk to', 'sales']} className="vc-display" />
            <p className="vc-lede xcs-in">Tell us what you want to build. We come back with a plan for your company: where Hanzo runs, what it costs and how you start.</p>
          </div>
          <div className="xcs-stagewrap xcs-up">
            <div className="xcs-field" aria-hidden="true"><Sigil seed="contact-sales" data={[30, 24, 7, 5000]} className="xcs-sigil" /></div>
            <Form v={v} setV={setV} at={at} setAt={setAt} tick={tick} need={need} />
          </div>
          <div className="xcs-more xcs-in">
            <div className="xcs-routes">
              <A to="https://cal.com/hanzo/30min" className="xcs-route"><span>Or book a 30-minute call</span><b>cal.com ↗</b></A>
              <a href="mailto:enterprise@hanzo.ai" className="xcs-route"><span>Prefer email?</span><b>enterprise@hanzo.ai</b></a>
              <A to="https://hanzo.team/start" className="xcs-route"><span>Want it today?</span><b>Get Hanzo Team</b></A>
            </div>
            <p className="xcs-alt"><span>Want instant recommendations or team seat pricing?</span> <A to="/buying-specialist" className="xcs-ai">Talk to AI Buying Specialist →</A></p>
          </div>
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
                <li key={t} className={(on ? 'on' : '') + (lit === i ? ' lit' : '')} onPointerEnter={() => setLit(i)} onPointerLeave={() => setLit(-1)}>
                  <span className="xcs-inc-n vc-num" aria-hidden="true">{two(i + 1)}</span>
                  <span className="xcs-inc-t">{t}</span>
                  <button type="button" className="xcs-round" aria-pressed={on} aria-label={t} onFocus={() => setLit(i)} onBlur={() => setLit(-1)} onClick={() => { tick(t); if (!on) setAt(4); }}>
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span key={on ? 'y' : 'n'} className="xcs-g" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ type: 'spring', stiffness: 420, damping: 34 }}>
                        {on ? <Check /> : <Plus />}
                      </motion.span>
                    </AnimatePresence>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <Rail />
    </main>
  );
}
