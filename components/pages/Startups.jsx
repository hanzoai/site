'use client';
// Signature: the application answers back: a match card assembles beside the form as you fill it (your company, stage, what you will use, your compute).
// Beyond: the track read-out: tick a tier-1 investor and the card moves you from starting free to the credits program, by the program's own rule.
/* The Hanzo Startup Program.
   Persona: a founder of an early, venture-backed team. Goal: apply for credits (or start free).
   CTA: "Apply for credits" (hero, then the header's ask after the hero).
   Metric: cta_click:startups.hero
   V2: 8/10 the program's name with its Techstars caption beneath, beside $150,000 on a split-flap board that flips again while seen; the three parts as one ladder that climbs once, one rung big at a time; the application with pill choices (no browser selects) and its live match card; the not-venture-backed close as the dark room.
   Motion: the match card assembling (signature) + the split-flap figure (idle) + the ladder climbing (time, pointer)
   + line-masked type.
   Ink and greys only. The application is hanzo.ai's own form, field for field, and it sends exactly what hanzo.ai sends:
   POST https://api.hanzo.ai/v1/form/public/hanzo.startups-apply/responses with the same answers, token and hidden
   source. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion, useScroll, useTransform, useMotionValue, animate } from 'motion/react';
import { A, Tick } from '../kit';
import LineReveal from '../v2/LineReveal';
import { ui } from '../v2/famUi';
import '../v2/ProgramScale.css';
import './Startups.css';

const EASE = [0.16, 1, 0.3, 1];
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
const pad = (n) => String(n).padStart(2, '0');
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

/* The split-flap board: its tiles fold and land, left to right, on load and again every few seconds while on screen,
   always back on their own characters, so it never shows any figure but $150,000 (reduced motion: still). */
const BOARD = '$150,000';
function Board() {
  const ref = useRef(null);
  const seen = useInView(ref, { amount: 0.5 });
  const calm = useReducedMotion();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!seen || calm) return;
    const t = setTimeout(() => setN((v) => v + 1), n ? 4200 : 250);
    return () => clearTimeout(t);
  }, [seen, calm, n]);
  return (
    <span ref={ref} className={'xst-board' + (n ? ' tick t' + (n % 2) : '')}>
      <span className="x-flap xst-flap" aria-label={BOARD}>{[...BOARD].map((c, i) => <span key={i} aria-hidden="true">{c}</span>)}</span>
    </span>
  );
}

function Hero() {
  // the figure card leans up to 2.5° toward a fine pointer and settles on leave (touch and reduced motion: still)
  const tilt = useRef(null);
  const rx = useMotionValue(0), ry = useMotionValue(0);
  const fine = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lean = (e) => {
    const el = tilt.current; if (!el || !fine()) return;
    const r = el.getBoundingClientRect();
    rx.set(-(((e.clientY - r.top) / r.height) * 2 - 1) * 2.5); ry.set((((e.clientX - r.left) / r.width) * 2 - 1) * 2.5);
  };
  const rest = () => { animate(rx, 0, { duration: 0.3, ease: [0, 0, 0.2, 1] }); animate(ry, 0, { duration: 0.3, ease: [0, 0, 0.2, 1] }); };
  return (
    <section className="xst-hero" aria-labelledby="xst-h1">
      <div className="xp-wrap xp-grid">
        <div className="xst-words">
          <LineReveal as="h1" id="xst-h1" className="xp-display md" lines={['The Hanzo', 'Startup Program']} />
          <p className="xp-kick xst-cap">Techstars ’17 — built for founders</p>
          <motion.div initial={{ y: 16 }} animate={{ y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.4 }}>
            <p className="xp-lede xst-lede">Everyone starts free. Venture-backed teams get up to $150,000 in credits.</p>
            <div className="xst-acts">
              <a href="#apply" className="xp-cta" data-thumb="Apply for credits" data-cta="startups.hero" onClick={() => setTimeout(() => document.getElementById('company')?.focus({ preventScroll: true }), 700)}><span>Apply for credits</span><i aria-hidden="true">↓</i></a>
              <A to="https://platform.hanzo.ai" className="xp-ghost">Start building free</A>
            </div>
          </motion.div>
        </div>
        <motion.div className="xst-fig" ref={tilt} onPointerMove={lean} onPointerLeave={rest} style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }} initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: EASE, delay: 0.3 }}>
          <span className="xst-art"><img src="/models/zen.webp" alt="" width="1200" height="1500" decoding="async" /></span>
          <span className="xst-fig-k x-mono" aria-hidden="true">Up to</span>
          <Board />
          <span className="xst-fig-u x-mono" aria-hidden="true">in credits</span>
        </motion.div>
      </div>
    </section>
  );
}

/* The program as one ladder you climb: three rungs in a column, one big at a time (the others rest at medium). It
   climbs by itself once while in view (start free → bring your compute → the credits), then rests on the credits;
   pointing at or focusing a rung takes it there. The credits rung carries the same split-flap figure as the hero. */
function Ladder() {
  const ref = useRef(null);
  const calm = useReducedMotion();
  const [at, setAt] = useState(0);
  // the rung crossing the middle of the screen is the big one (scroll climbs the ladder); pointing or focusing a rung
  // takes it there too
  useEffect(() => {
    if (calm || !ref.current) return;
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) setAt(+e.target.dataset.k); }), { rootMargin: '-45% 0px -45% 0px' });
    ref.current.querySelectorAll('li').forEach((li) => io.observe(li));
    return () => io.disconnect();
  }, [calm]);
  const pick = (i) => setAt(i);
  return (
    <section className="xp-sec tight xst-prog" aria-labelledby="xst-prog-h">
      <div className="xp-wrap">
        <h2 id="xst-prog-h" className="xp-kick">The program</h2>
        <ol className="xst-ladder" ref={ref}>
          {PROGRAM.map(([t, d], i) => (
            <li key={t} data-k={i} className={'r' + i + (at === i ? ' on' : '') + (i < at ? ' past' : '')} tabIndex={0} onPointerEnter={() => pick(i)} onFocus={() => pick(i)} onClick={() => pick(i)}>
              <span className="xst-rung x-mono">{String(i + 1).padStart(2, '0')} / 03</span>
              <h3 className="xp-head">{t}</h3>
              <p className="xp-body">{d}</p>
              {i === 2 && <span className="xst-rung-fig" aria-hidden="true"><span className={'xst-board' + (at === 2 ? ' tick t1' : '')}><span className="x-flap xst-flap sm">{[...BOARD].map((c, k) => <span key={k}>{c}</span>)}</span></span></span>}
            </li>
          ))}
        </ol>
        <p className="xst-ts xp-lede"><b><span>Techstars founders:</span></b> Hanzo is a Techstars company. We offer perks tailored to each portfolio brand — mention your batch when you apply and we will match it.</p>
      </div>
    </section>
  );
}

function Match({ c }) {
  const req = [c.company.trim(), c.contactName.trim(), okEmail(c.email), c.stage, c.building.trim()];
  const done = req.filter(Boolean).length;
  // until you touch the form, the card shows the program's rule by itself: the free track, then what tier-1 backing
  // turns it into, every 3.6 s while the card is on screen (it stops for good at your first answer)
  const ref = useRef(null);
  const seen = useInView(ref, { amount: 0.5 });
  const calm = useReducedMotion();
  const blank = c.company === '' && c.contactName === '' && c.email === '' && !c.stage && c.tier1Investors.length === 0 && c.useCases.length === 0 && !c.byoCompute;
  // the card fills itself in once (about 7 s) with the form's own example answers: a company, a stage, a tier-1 backer,
  // and the track turns to the credits; then it rests there until you answer, when it shows only your answers
  const [demo, setDemo] = useState(0);
  useEffect(() => {
    if (!blank || !seen || calm || demo >= 4) return;
    const t = setTimeout(() => setDemo((v) => v + 1), demo ? 1700 : 700);
    return () => clearTimeout(t);
  }, [blank, seen, calm, demo]);
  const show = blank && demo > 0;
  const tier = show && demo >= 3 ? ['Sequoia'] : c.tier1Investors;
  const credits = tier.length > 0;
  const stage = STAGES.find((s) => s[0] === (show && demo >= 2 ? 'seed' : c.stage))?.[1];
  const co = show ? 'Acme AI' : c.company.trim();
  const shown = show ? Math.min(2, demo) : done;
  const tech = c.techstarsBatch.trim() || c.tier1Investors.includes('Techstars');
  return (
    <aside className="xst-match" aria-label="Your match" aria-live={blank ? 'off' : 'polite'} ref={ref}>
      <div className="xst-match-top">
        <svg viewBox="0 0 36 36" width="40" height="40" aria-hidden="true"><circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,.14)" strokeWidth="3" /><motion.circle cx="18" cy="18" r="15" fill="none" stroke="#737373" strokeWidth="3" strokeLinecap="round" transform="rotate(-90 18 18)" initial={false} animate={{ pathLength: shown / 5 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} /></svg>
        <div><b className="xst-co">{co || 'Company name'}</b><span className="x-mono">{shown} / 5 · {stage || 'Select stage'}</span></div>
      </div>
      <div className={'xst-track' + (credits ? ' credits' : '')}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={credits ? 'c' : 'f'} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35, ease: EASE }}>
            <span className="x-mono">{credits ? 'Backed by any of these?' : 'Everyone starts free.'}</span>
            <b>{credits ? 'Up to $150,000 in credits' : 'Start in minutes'}</b>
            <p>{credits ? tier.join(' · ') : 'Creating an account is free.'}</p>
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

function Field({ id, label, opt, req, err, children }) {
  return (
    <div className="xst-f">
      <label htmlFor={id}><span className="xst-lt">{label}</span>{opt && <span> {opt}</span>}{req && <i aria-hidden="true"> *</i>}</label>
      {children}
      {err && <p className="xst-err-i" id={id + '-e'} role="alert">{err}</p>}
    </div>
  );
}

/* One choice from a short list, as pills on the page instead of a browser menu: an APG radio group (arrow keys move
   and choose, one tab stop), the same values the select sent. The hint is Hanzo's own placeholder, shown until chosen. */
function Choice({ id, label, req, hint, opts, value, set, err }) {
  const box = useRef(null);
  const key = (e, i) => {
    const d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const n = (i + d + opts.length) % opts.length;
    set(opts[n][0]);
    box.current?.querySelectorAll('[role=radio]')[n]?.focus();
  };
  const cur = opts.findIndex((o) => o[0] === value);
  return (
    <fieldset className="xst-set xst-choice">
      <legend id={id + '-l'}><span className="xst-lt">{label}</span>{req && <i aria-hidden="true"> *</i>} <span className="xst-hint" aria-hidden={!!value}>{value ? '' : hint}</span></legend>
      <div className="xst-chips" role="radiogroup" aria-labelledby={id + '-l'} aria-required={req || undefined} aria-invalid={err ? true : undefined} aria-describedby={err ? id + '-e' : undefined} ref={box} id={id}>
        {opts.map(([v, l], i) => (
          <button key={v} type="button" role="radio" aria-checked={value === v} tabIndex={(cur < 0 ? i === 0 : i === cur) ? 0 : -1} onClick={() => set(v)} onKeyDown={(e) => key(e, i)}>
            <i aria-hidden="true" className="xst-dot" /><span>{l}</span>
          </button>
        ))}
      </div>
      {err && <p className="xst-err-i" id={id + '-e'} role="alert">{err}</p>}
    </fieldset>
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
  const [bad, setBad] = useState(null); // the field the message belongs to: it is marked invalid and the message sits under it
  const on = (e) => { setErr(null); setBad(null); setC({ ...c, [e.target.name]: e.target.value }); };
  const inv = (id) => (bad === id ? { 'aria-invalid': true, 'aria-describedby': id + '-e' } : {});
  const fe = (id) => (bad === id ? err : null);
  // the form in three steps; Next checks only the step you are on and takes you to the first field it needs
  const [step, setStep] = useState(0);
  const formTop = () => document.getElementById('apply')?.querySelector('.xst-steps')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  const go = (i) => { setErr(null); setStep(i); setTimeout(formTop, 0); };
  const need0 = () => (!c.company.trim() ? ['company', 'Company name is required.'] : !c.contactName.trim() ? ['contactName', 'Your name is required.'] : !okEmail(c.email) ? ['email', 'A valid email is required.'] : !c.stage ? ['stage', 'Please select your company stage.'] : null);
  const next = () => {
    const miss = step === 0 ? need0() : null;
    if (miss) {
      setErr(miss[1]); setBad(miss[0]);
      setTimeout(() => (document.querySelector(`#${miss[0]} [role=radio]`) || document.getElementById(miss[0]))?.focus(), 0);
      return;
    }
    go(step + 1);
  };
  const flip = (k, v) => setC((p) => ({ ...p, [k]: p[k].includes(v) ? p[k].filter((x) => x !== v) : [...p[k], v] }));
  const submit = async (e) => {
    e.preventDefault();
    if (step < 2 && document.documentElement.classList.contains('js')) { next(); return; } // Enter on an early step moves on
    const m0 = need0();
    if (m0) { setStep(0); }
    const m = !c.company.trim() ? 'Company name is required.' : !c.contactName.trim() ? 'Your name is required.' : !okEmail(c.email) ? 'A valid email is required.' : !c.stage ? 'Please select your company stage.' : !c.building.trim() ? 'Tell us what you are building.' : null;
    if (m) {
      // the first invalid field takes focus, so the message and the place to fix it are together
      const id = !c.company.trim() ? 'company' : !c.contactName.trim() ? 'contactName' : !okEmail(c.email) ? 'email' : !c.stage ? 'stage' : 'building';
      setTimeout(() => (document.querySelector(`#${id} [role=radio]`) || document.getElementById(id))?.focus(), 0);
      setBad(id);
      return setErr(m);
    }
    setBusy(true); setErr(null); setBad(null);
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
    } catch (x) { setErr(x instanceof Error && !(x instanceof TypeError) ? x.message : 'Something went wrong. Please try again.'); } // a network failure gets Hanzo's sentence, never the browser's finally { setBusy(false); }
  };
  return (
    <section className="xp-sec xst-apply" id="apply" aria-labelledby="xst-apply-h">
      <div className="xp-wrap">
        <header className="xp-grid xst-apply-h">
          <h2 id="xst-apply-h" className="xp-display sm">Apply to the program</h2>
          <p className="xp-lede">We review applications weekly. The more you share, the faster we can match you to the right tier.</p>
        </header>
        <div className="xst-apply-grid">
          <AnimatePresence mode="wait" initial={false}>
            {sent ? (
              <motion.div key="sent" className="xst-sent" role="status" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
                <Tick size={48} />
                <h3>Application received</h3>
                <p>Thanks — we review applications weekly and will be in touch by email.</p>
                <p className="xst-sent-s">Want to start building today? Create an account and pay only for what you use — no subscription required.</p>
                <div className="xst-acts"><A to="https://platform.hanzo.ai" className="xp-cta">Start free →</A><A to="/" className="xp-ghost">Back to Home</A></div>
              </motion.div>
            ) : (
              <motion.form key="form" className="xst-form" onSubmit={submit} noValidate exit={{ opacity: 0, y: -10 }}>
                {/* three steps, one screen each (with JS off all three show as one form) */}
                <div className="xst-steps" aria-hidden="true">{[0, 1, 2].map((i) => <i key={i} className={i < step ? 'done' : i === step ? 'on' : ''} />)}<span className="x-mono">{pad(step + 1)} / 03</span></div>
                <div className={'xst-step' + (step === 0 ? ' on' : '')}>
                <div className="xst-row">
                  <Field id="company" err={fe('company')} label="Company name" req><input id="company" name="company" {...inv('company')} type="text" required value={c.company} onChange={on} placeholder="Acme AI" autoComplete="organization" /></Field>
                  <Field id="website" label="Website"><input id="website" name="website" type="text" value={c.website} onChange={on} placeholder="https://acme.ai" autoComplete="url" /></Field>
                </div>
                <div className="xst-row">
                  <Field id="contactName" err={fe('contactName')} label="Your name" req><input id="contactName" name="contactName" {...inv('contactName')} type="text" required value={c.contactName} onChange={on} placeholder="Jane Smith" autoComplete="name" /></Field>
                  <Field id="email" err={fe('email')} label="Work email" req><input id="email" name="email" {...inv('email')} type="email" required value={c.email} onChange={on} placeholder="jane@acme.ai" autoComplete="email" /></Field>
                </div>
                <div className="xst-row">
                  <Field id="role" label="Your role"><input id="role" name="role" type="text" value={c.role} onChange={on} placeholder="Co-founder & CEO" autoComplete="organization-title" /></Field>
                  <Choice id="stage" label="Company stage" req hint="Select stage" err={fe('stage')} opts={STAGES} value={c.stage} set={(v) => { setErr(null); setBad(null); setC((p) => ({ ...p, stage: v })); }} />
                </div>
                </div>
                <div className={'xst-step' + (step === 1 ? ' on' : '')}>
                <Field id="investors" label="Who are your investors?" opt="(funds, angels)"><input id="investors" name="investors" type="text" value={c.investors} onChange={on} placeholder="e.g. Sequoia, plus a few angels" /></Field>
                <fieldset className="xst-set">
                  <legend>Backed by any of these? <span>(tier-1 backing qualifies you for the credits program)</span></legend>
                  <div className="xst-chips">
                    {Object.keys(TIER1).map((n) => (
                      <button key={n} type="button" aria-pressed={c.tier1Investors.includes(n)} onClick={() => flip('tier1Investors', n)}>
                        <i aria-hidden="true"><svg viewBox="0 0 24 24" width="10" height="10"><path d="M5 13l4 4L19 7" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg></i><span>{n}</span>
                      </button>
                    ))}
                  </div>
                </fieldset>
                <div className="xst-row">
                  <Field id="amountRaised" label="Amount raised" opt="(optional)"><input id="amountRaised" name="amountRaised" type="text" value={c.amountRaised} onChange={on} placeholder="$2M" /></Field>
                  <Field id="teamSize" label="Team size"><input id="teamSize" name="teamSize" type="text" value={c.teamSize} onChange={on} placeholder="5" inputMode="numeric" /></Field>
                </div>
                </div>
                <div className={'xst-step' + (step === 2 ? ' on' : '')}>
                <Field id="building" err={fe('building')} label="What are you building?" req><textarea id="building" name="building" {...inv('building')} required rows={4} value={c.building} onChange={on} placeholder="Describe your product, who it is for, and where you are today..." /></Field>
                <fieldset className="xst-set">
                  <legend><span className="xst-lt">How will you use Hanzo?</span></legend>
                  <div className="xst-uses">
                    {USES.map(([id, l, d]) => (
                      <button key={id} type="button" aria-pressed={c.useCases.includes(id)} onClick={() => flip('useCases', id)}>
                        <i aria-hidden="true"><svg viewBox="0 0 24 24" width="10" height="10"><path d="M5 13l4 4L19 7" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg></i>
                        <span><span className="xst-u-t">{l}</span><span>{d}</span></span>
                      </button>
                    ))}
                  </div>
                </fieldset>
                <Field id="infraSpend" label="Current infra / compute spend per month" opt="(optional)"><input id="infraSpend" name="infraSpend" type="text" value={c.infraSpend} onChange={on} placeholder="$3,000 / mo" /></Field>
                <button type="button" className="xst-byo-t" aria-pressed={c.byoCompute} onClick={() => setC({ ...c, byoCompute: !c.byoCompute })}>
                  <i aria-hidden="true"><svg viewBox="0 0 24 24" width="12" height="12"><path d="M5 13l4 4L19 7" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg></i>
                  <span><span className="xst-u-t">I want to bring my own compute</span><span>Connect your own GPUs or machines and run on hardware you already own.</span></span>
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
                </div>
                <div className="xst-row one">
                  <Choice id="heardVia" label="How did you hear about us?" hint="Select one" opts={Object.keys(HEARD).map((h) => [h, h])} value={c.heardVia} set={(v) => setC((p) => ({ ...p, heardVia: p.heardVia === v ? '' : v }))} />
                </div>
                </div>
                <div className="xst-trap" aria-hidden="true"><label htmlFor="hp">Do not fill this in</label><input id="hp" name="hp" type="text" tabIndex={-1} autoComplete="off" value={c.hp} onChange={on} /></div>
                <AnimatePresence>{err && !bad && <motion.p className="xst-err" role="alert" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>{err}</motion.p>}</AnimatePresence>
                <div className="xst-nav">
                  {/* "Next" and "Previous" await James's yes in the register, so they are arrows with those names, and
                      the next step's number */}
                  {step > 0 && <button type="button" className="xp-ghost xst-prev" aria-label={ui('previous')} onClick={() => go(step - 1)}><i aria-hidden="true">←</i></button>}
                  {step < 2 && <button type="button" className="xp-cta xst-next" aria-label={ui('next')} onClick={() => next()}><span className="x-mono" aria-hidden="true">{pad(step + 2)} / 03</span><i aria-hidden="true">→</i></button>}
                  <button type="submit" className={'xp-cta xst-submit' + (step < 2 ? ' later' : '')} disabled={busy}>{busy ? 'Submitting...' : 'Submit application'}</button>
                </div>
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
  return (
    <main id="main" className="xp xst">
      <Hero />
      <Ladder />
      <Apply />
      <Not />
    </main>
  );
}

/* The free track as the close's object: the card the application starts on, its four uses lighting in turn the way
   metered use moves between them (idle; still under reduced motion). Every word is already on the page. */
function Free() {
  const ref = useRef(null);
  const seen = useInView(ref, { amount: 0.4 });
  const calm = useReducedMotion();
  const [k, setK] = useState(0);
  useEffect(() => {
    if (!seen || calm) return;
    const t = setInterval(() => setK((v) => (v + 1) % USES.length), 1600);
    return () => clearInterval(t);
  }, [seen, calm]);
  return (
    <div className="xst-free" ref={ref} aria-hidden="true">
      <span className="x-mono">Everyone starts free.</span>
      <b>Start in minutes</b>
      <p>Creating an account is free.</p>
      <ul>{USES.map(([id, l], i) => <li key={id} className={i === k ? 'on' : ''}><span>{l}</span><i style={{ '--w': [64, 38, 52, 28][i] + '%' }} /></li>)}</ul>
    </div>
  );
}

function Not() {
  const ref = useRef(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start end', 'start 0.35'] });
  const clip = useTransform(p, [0, 1], ['inset(0px 24px round 28px)', 'inset(0px 0px round 0px)']);
  return (
    <>
      <motion.section ref={ref} style={{ clipPath: clip }} className="xp-sec xp-dark xst-not" data-room="dark" aria-labelledby="xst-not-h">
        <div className="xp-wrap xp-grid">
          <LineReveal onView id="xst-not-h" className="xp-display md xst-not-h" lines={['Not venture-backed?']} />
          <Free />
          <div className="xst-not-r">
            <p className="xp-lede">You do not need to qualify to build. Start free and pay only for what you use, or create an Enterprise plan for your team.</p>
            <div className="xst-acts"><A to="https://platform.hanzo.ai" className="xp-cta">Start free</A><A to="/enterprise/start" className="xp-ghost">Create Enterprise plan</A></div>
          </div>
        </div>
      </motion.section>
    </>
  );
}
