'use client';
// Signature: the application answers back: a match card assembles beside the form as you fill it (your company, stage, what you will use, your compute).
// Beyond: the track read-out: tick a tier-1 investor and the card moves you from starting free to the credits program, by the program's own rule.
/* The Hanzo Startup Program. The three parts of the program take turns at the top; the application is hanzo.ai's own
   form, field for field, and it sends exactly what hanzo.ai sends: POST https://api.hanzo.ai/v1/form/public/
   hanzo.startups-apply/responses with the same answers, token and hidden source. Beside it, the match card reads
   what you have written so far. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { EASE, Rise } from '../ui';
import { A, Go, Tick } from '../kit';
import Sigil from '../Sigil';
import './Startups.css';

const PROGRAM = [
  ['Start in minutes', 'Creating an account is free. Add funds when you are ready and pay only for what you use — no subscription, no minimums.'],
  ['Bring your own compute', 'Connect your own GPUs and machines. Run cheap on hardware you already have — we meter the platform, not your iron.'],
  ['Up to $150,000 in credits', 'For venture-backed startups. Application required, and tier-1 VC backing is required for the credits program.'],
];
const STAGES = [['idea', 'Idea'], ['pre-seed', 'Pre-seed'], ['seed', 'Seed'], ['series-a', 'Series A'], ['series-b-plus', 'Series B+']];
const TIER1 = { 'Andreessen Horowitz (a16z)': 'a16z', Sequoia: 'sequoia', Benchmark: 'benchmark', Greylock: 'greylock', Accel: 'accel', 'Founders Fund': 'founders-fund', Lightspeed: 'lightspeed', 'Index Ventures': 'index-ventures', Bessemer: 'bessemer', 'Khosla Ventures': 'khosla', 'GV (Google Ventures)': 'gv', Techstars: 'techstars' };
const USES = [['ai', 'AI & inference', 'Models, agents, RAG, one API for every model'], ['deploy', 'Deploy', 'Apps, functions, edge, machines'], ['data', 'Data', 'Vector, SQL, KV, object storage'], ['compute', 'Compute', 'GPUs, training, batch jobs']];
const HEARD = { Search: 'search', 'X / Twitter': 'x', LinkedIn: 'linkedin', 'A friend or colleague': 'friend', 'A Techstars connection': 'techstars-connection', 'An investor': 'investor', 'An event or conference': 'event', 'Hanzo docs or GitHub': 'docs-github', Other: 'other' };
const EMPTY = { company: '', website: '', contactName: '', email: '', role: '', stage: '', investors: '', tier1Investors: [], amountRaised: '', teamSize: '', building: '', useCases: [], infraSpend: '', byoCompute: false, byoHardware: '', techstarsBatch: '', heardVia: '', hp: '' };
const okEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

// the body hanzo.ai sends, built the same way (blank answers are left out)
function body(c, w) {
  const t = (f, v) => (v.trim() ? [{ field: f, text: v.trim() }] : []);
  const r = (f, a) => { const x = a.filter((e) => !!e); return x.length ? [{ field: f, choices: x }] : []; };
  return {
    token: w.token,
    answers: [...t('company', c.company), ...t('website', c.website), ...t('contact_name', c.contactName), ...t('email', c.email), ...t('role', c.role), ...r('stage', [c.stage]), ...t('investors', c.investors), ...r('tier1_investors', c.tier1Investors.map((e) => TIER1[e])), ...t('amount_raised', c.amountRaised), ...t('team_size', c.teamSize), ...t('building', c.building), ...r('use_cases', c.useCases), ...t('infra_spend', c.infraSpend), { field: 'byo_compute', boolean: c.byoCompute }, ...t('byo_hardware', c.byoCompute ? c.byoHardware : ''), ...t('techstars_batch', c.techstarsBatch), ...r('heard_via', [HEARD[c.heardVia]])],
    hidden: { source: 'startups' },
    landed_at: w.landed,
    completed: true,
    path: location.pathname.replace(/\/$/, '') || '/',
  };
}

function Program() {
  const [at, setAt] = useState(0);
  const [mine, setMine] = useState(false);
  const calm = useReducedMotion();
  const ref = useRef(null);
  const seen = useInView(ref, { amount: 0.4 });
  useEffect(() => {
    if (mine || calm || !seen) return;
    const t = setTimeout(() => setAt((v) => (v + 1) % 3), 3400);
    return () => clearTimeout(t);
  }, [at, mine, calm, seen]);
  return (
    <div className="xst-prog" ref={ref}>
      <Sigil seed="startups" data={[150000, 3]} className="xst-sigil" />
      <div className="xst-prog-top"><span>The program</span><span className="x-mono">{String(at + 1).padStart(2, '0')} / 03</span></div>
      <ol className="xst-ladder">
        {PROGRAM.map(([t, d], i) => (
          <li key={t}>
            <button type="button" aria-expanded={at === i} className={at === i ? 'on' : ''} onClick={() => { setAt(i); setMine(true); }}>
              <span className="xst-rung x-mono">{String(i + 1).padStart(2, '0')}</span>
              <b>{t}</b>
            </button>
            <motion.div className="xst-rung-d" initial={false} animate={at === i ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }} transition={{ duration: 0.5, ease: EASE }} aria-hidden={at !== i}>
              <p>{d}</p>
            </motion.div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Match({ c }) {
  const req = [c.company.trim(), c.contactName.trim(), okEmail(c.email), c.stage, c.building.trim()];
  const done = req.filter(Boolean).length;
  const credits = c.tier1Investors.length > 0;
  const stage = STAGES.find((s) => s[0] === c.stage)?.[1];
  const tech = c.techstarsBatch.trim() || c.tier1Investors.includes('Techstars');
  return (
    <aside className="xst-match" aria-label="Your match" aria-live="polite">
      <div className="xst-match-top">
        <svg viewBox="0 0 36 36" width="40" height="40" aria-hidden="true"><circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,.14)" strokeWidth="3" /><motion.circle cx="18" cy="18" r="15" fill="none" stroke="#f5f5f7" strokeWidth="3" strokeLinecap="round" transform="rotate(-90 18 18)" initial={false} animate={{ pathLength: done / 5 }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} /></svg>
        <div><b className="xst-co">{c.company.trim() || 'Company name'}</b><span className="x-mono">{done} / 5 · {stage || 'Select stage'}</span></div>
      </div>
      <div className={'xst-track' + (credits ? ' credits' : '')}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={credits ? 'c' : 'f'} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35, ease: EASE }}>
            <span className="x-mono">{credits ? 'Backed by any of these?' : 'Everyone starts free.'}</span>
            <b>{credits ? 'Up to $150,000 in credits' : 'Start in minutes'}</b>
            <p>{credits ? c.tier1Investors.join(' · ') : 'Creating an account is free.'}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <ul className="xst-lit">
        {USES.map(([id, l]) => <li key={id} className={c.useCases.includes(id) ? 'on' : ''}>{l}</li>)}
      </ul>
      <p className={'xst-byo' + (c.byoCompute ? ' on' : '')}><b>Bring your own compute</b><span>{c.byoCompute ? c.byoHardware.trim() || 'What hardware do you have?' : '—'}</span></p>
      {tech && <motion.p className="xst-tech" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}><b>Techstars founders:</b> mention your batch when you apply and we will match it.</motion.p>}
    </aside>
  );
}

function Field({ id, label, opt, req, children }) {
  return (
    <div className="xst-f">
      <label htmlFor={id}>{label}{opt && <span> {opt}</span>}{req && <i aria-hidden="true"> *</i>}</label>
      {children}
    </div>
  );
}

function Apply() {
  const [c, setC] = useState(EMPTY);
  const w = useRef(null);
  if (!w.current) w.current = { token: 's_' + (typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}${Math.random()}`).replace(/[^A-Za-z0-9]/g, '').slice(0, 30), landed: new Date().toISOString() };
  useEffect(() => { w.current.landed = new Date().toISOString(); }, []); // when the visitor landed, not when the server rendered
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState(null);
  const on = (e) => setC({ ...c, [e.target.name]: e.target.value });
  const flip = (k, v) => setC((p) => ({ ...p, [k]: p[k].includes(v) ? p[k].filter((x) => x !== v) : [...p[k], v] }));
  const submit = async (e) => {
    e.preventDefault();
    const m = !c.company.trim() ? 'Company name is required.' : !c.contactName.trim() ? 'Your name is required.' : !okEmail(c.email) ? 'A valid email is required.' : !c.stage ? 'Please select your company stage.' : !c.building.trim() ? 'Tell us what you are building.' : null;
    if (m) return setErr(m);
    setBusy(true); setErr(null);
    try {
      if (!c.hp) { // a filled trap is a bot: it is thanked and nothing is sent
        const r = await fetch('https://api.hanzo.ai/v1/form/public/hanzo.startups-apply/responses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body(c, w.current)) });
        if (!r.ok) {
          const j = await r.json().catch(() => null);
          const d = j && typeof j === 'object' && typeof j.detail === 'string' ? j.detail.replace(/^form: /, '') : '';
          throw new Error(d || `Request failed (${r.status})`);
        }
      }
      setSent(true);
    } catch (x) { setErr(x instanceof Error ? x.message : 'Something went wrong. Please try again.'); } finally { setBusy(false); }
  };
  return (
    <section className="x-sec xst-apply" id="apply" aria-labelledby="xst-apply-h">
      <div className="x-wrap">
        <header className="xst-apply-h">
          <h2 id="xst-apply-h">Apply to the program</h2>
          <p>We review applications weekly. The more you share, the faster we can match you to the right tier.</p>
        </header>
        <div className="xst-apply-grid">
          <AnimatePresence mode="wait" initial={false}>
            {sent ? (
              <motion.div key="sent" className="xst-sent" role="status" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
                <Tick size={48} />
                <h3>Application received</h3>
                <p>Thanks — we review applications weekly and will be in touch by email.</p>
                <p className="xst-sent-s">Want to start building today? Create an account and pay only for what you use — no subscription required.</p>
                <div className="xst-acts"><Go to="https://platform.hanzo.ai" solid>Start free →</Go><Go to="/">Back to Home</Go></div>
              </motion.div>
            ) : (
              <motion.form key="form" className="xst-form" onSubmit={submit} noValidate exit={{ opacity: 0, y: -10 }}>
                <div className="xst-row">
                  <Field id="company" label="Company name" req><input id="company" name="company" type="text" required value={c.company} onChange={on} placeholder="Acme AI" autoComplete="organization" /></Field>
                  <Field id="website" label="Website"><input id="website" name="website" type="text" value={c.website} onChange={on} placeholder="https://acme.ai" autoComplete="url" /></Field>
                </div>
                <div className="xst-row">
                  <Field id="contactName" label="Your name" req><input id="contactName" name="contactName" type="text" required value={c.contactName} onChange={on} placeholder="Jane Smith" autoComplete="name" /></Field>
                  <Field id="email" label="Work email" req><input id="email" name="email" type="email" required value={c.email} onChange={on} placeholder="jane@acme.ai" autoComplete="email" /></Field>
                </div>
                <div className="xst-row">
                  <Field id="role" label="Your role"><input id="role" name="role" type="text" value={c.role} onChange={on} placeholder="Co-founder & CEO" autoComplete="organization-title" /></Field>
                  <Field id="stage" label="Company stage" req>
                    <select id="stage" name="stage" required value={c.stage} onChange={on}>
                      <option value="" disabled>Select stage</option>
                      {STAGES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                  </Field>
                </div>
                <Field id="investors" label="Who are your investors?" opt="(funds, angels)"><input id="investors" name="investors" type="text" value={c.investors} onChange={on} placeholder="e.g. Sequoia, plus a few angels" /></Field>
                <fieldset className="xst-set">
                  <legend>Backed by any of these? <span>(tier-1 backing qualifies you for the credits program)</span></legend>
                  <div className="xst-chips">
                    {Object.keys(TIER1).map((n) => (
                      <button key={n} type="button" aria-pressed={c.tier1Investors.includes(n)} onClick={() => flip('tier1Investors', n)}>
                        <i aria-hidden="true"><svg viewBox="0 0 24 24" width="10" height="10"><path d="M5 13l4 4L19 7" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg></i>{n}
                      </button>
                    ))}
                  </div>
                </fieldset>
                <div className="xst-row">
                  <Field id="amountRaised" label="Amount raised" opt="(optional)"><input id="amountRaised" name="amountRaised" type="text" value={c.amountRaised} onChange={on} placeholder="$2M" /></Field>
                  <Field id="teamSize" label="Team size"><input id="teamSize" name="teamSize" type="text" value={c.teamSize} onChange={on} placeholder="5" inputMode="numeric" /></Field>
                </div>
                <Field id="building" label="What are you building?" req><textarea id="building" name="building" required rows={4} value={c.building} onChange={on} placeholder="Describe your product, who it is for, and where you are today..." /></Field>
                <fieldset className="xst-set">
                  <legend>How will you use Hanzo?</legend>
                  <div className="xst-uses">
                    {USES.map(([id, l, d]) => (
                      <button key={id} type="button" aria-pressed={c.useCases.includes(id)} onClick={() => flip('useCases', id)}>
                        <i aria-hidden="true"><svg viewBox="0 0 24 24" width="10" height="10"><path d="M5 13l4 4L19 7" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg></i>
                        <span><b>{l}</b><span>{d}</span></span>
                      </button>
                    ))}
                  </div>
                </fieldset>
                <Field id="infraSpend" label="Current infra / compute spend per month" opt="(optional)"><input id="infraSpend" name="infraSpend" type="text" value={c.infraSpend} onChange={on} placeholder="$3,000 / mo" /></Field>
                <button type="button" className="xst-byo-t" aria-pressed={c.byoCompute} onClick={() => setC({ ...c, byoCompute: !c.byoCompute })}>
                  <i aria-hidden="true"><svg viewBox="0 0 24 24" width="12" height="12"><path d="M5 13l4 4L19 7" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg></i>
                  <span><b>I want to bring my own compute</b><span>Connect your own GPUs or machines and run on hardware you already own.</span></span>
                </button>
                <AnimatePresence initial={false}>
                  {c.byoCompute && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: EASE }} style={{ overflow: 'hidden' }}>
                      <Field id="byoHardware" label="What hardware do you have?"><input id="byoHardware" name="byoHardware" type="text" value={c.byoHardware} onChange={on} placeholder="e.g. 8x H100, a few Mac Studios, on-prem cluster" /></Field>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="xst-row">
                  <Field id="techstarsBatch" label="Techstars affiliation" opt="(optional)"><input id="techstarsBatch" name="techstarsBatch" type="text" value={c.techstarsBatch} onChange={on} placeholder="Batch / program, e.g. NYC W17" /></Field>
                  <Field id="heardVia" label="How did you hear about us?">
                    <select id="heardVia" name="heardVia" value={c.heardVia} onChange={on}>
                      <option value="">Select one</option>
                      {Object.keys(HEARD).map((h) => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </Field>
                </div>
                <div className="xst-trap" aria-hidden="true"><label htmlFor="hp">Do not fill this in</label><input id="hp" name="hp" type="text" tabIndex={-1} autoComplete="off" value={c.hp} onChange={on} /></div>
                <AnimatePresence>{err && <motion.p className="xst-err" role="alert" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>{err}</motion.p>}</AnimatePresence>
                <motion.button type="submit" className="x-btn solid xst-submit" disabled={busy} whileTap={{ scale: 0.98 }}>{busy ? 'Submitting...' : 'Submit application'}</motion.button>
                <p className="xst-fine">By submitting, you agree to Hanzo’s <A to="/legal/privacy" className="xst-link">Privacy Policy</A>. We use your information only to review this application.</p>
              </motion.form>
            )}
          </AnimatePresence>
          <div className="xst-match-col"><Match c={c} /></div>
        </div>
      </div>
    </section>
  );
}

export default function Startups() {
  const line = (t, d) => <span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: d }}>{t}</motion.span></span>;
  return (
    <main className="xst">
      <section className="xst-hero" aria-labelledby="xst-h1">
        <div className="x-wrap xst-grid">
          <div>
            <motion.p className="x-kick" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}>Techstars ’17 — built for founders</motion.p>
            <h1 id="xst-h1" className="xst-h1">{line('The Hanzo', 0.05)}{line('Startup Program', 0.16)}</h1>
            <motion.p className="xst-lede" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}>Everyone starts free. Venture-backed teams get up to $150,000 in credits.</motion.p>
            <motion.div className="xst-acts" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}>
              <a href="#apply" className="x-btn solid" data-thumb="Apply for credits">Apply for credits →</a>
              <Go to="https://platform.hanzo.ai">Start building free</Go>
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: EASE, delay: 0.2 }}><Program /></motion.div>
        </div>
        <div className="x-wrap">
          <Rise as="p" className="xst-ts"><b>Techstars founders:</b> Hanzo is a Techstars company. We offer perks tailored to each portfolio brand — mention your batch when you apply and we will match it.</Rise>
        </div>
      </section>
      <Apply />
      <section className="x-sec xst-not" data-room="dark" aria-labelledby="xst-not-h">
        <Rise className="x-wrap xst-not-in">
          <h2 id="xst-not-h">Not venture-backed?</h2>
          <p>You do not need to qualify to build. Start free and pay only for what you use, or create an Enterprise plan for your team.</p>
          <div className="xst-acts"><Go to="https://platform.hanzo.ai" solid>Start free</Go><Go to="/enterprise/start">Create Enterprise plan</Go></div>
        </Rise>
      </section>
    </main>
  );
}
