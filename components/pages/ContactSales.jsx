'use client';
/* /contact-sales. V2: 7/10 Utility, in ink and greys only: a huge kinetic "Talk to sales" beside one question at a
   time, set big, on a card set into a slow grey contour field that redraws with each answer you give; the conversation
   plays itself once before anyone types; your answers gather as chips; what Enterprise includes as five giant numerals
   whose rows press and add on a tap; the launches Hanzo built as a slow logo rail with a pause; a closing Band whose
   one "Talk to sales" glides back to the card, then the footer.
   Persona: an enterprise buyer weighing data residency and vendor consolidation.
   Goal: send a qualified enquiry. CTA: "Talk to sales" (the form; data-cta contact-sales.submit). Metric: contact_sales_submit.
   Signature: the enquiry is a conversation. One question per screen of the card, set large; Enter (or the arrow) moves
   on, the answer slides away up and the next question rises, a progress line glides along, and the contour field
   around the card redraws for every answer. Before anyone types it plays once from Hanzo's field labels ("Full name"
   types in, lifts away, "Work email" rises, a chip lands, rest, back to the empty form). It is still one real form in
   the page and sends exactly what hanzo.ai sends (POST https://api.hanzo.ai/v1/marketing/leads, the shape in
   content/forms.json). Motion is ease-emphasis cubic-bezier(.16,1,.3,1) at 300ms; no springs in this file.
   Supporting (3): masked kinetic headline, once; the contour field answering the form (Sigil); the logo rail.
   Beyond: the five things Enterprise includes can be added to your enquiry, from the last question's five numerals
   or straight from the giant numerals below. They are kept apart from your own words and joined into the note only
   when you send, in Hanzo's own sentences, so the plan that comes back starts from what you need.
   States: idle, sending (the button stays ink with a turning ring), sent (the card keeps its height, scrolls into
   view and takes focus), failed (every answer kept, Hanzo's "Prefer email?" route). 8s timeout with one retry; the
   draft survives a reload (sessionStorage).
   Deletes: the violet accent and field; the "Enterprise" eyebrow over the h1; the invented labels ("Your brief",
   "Next", "Back", "Sending…", the invented error and thank-you sentences), now icons with aria-labels or Hanzo's own
   sentences; the "01 / 05" counter; "cal.com ↗"; the numeral chips; the blinking fake caret; native title tooltips on
   the logos; raw <img>; the raw .x-btn submit; data-ask-hide on the rail; arrow keys that chose and advanced. */
import { useEffect, useRef, useState } from 'react';
import { mirror, visit } from '@hanzo/event';
import { track } from '../../lib/track';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { A, More, Band, Img } from '../kit';
import Sigil from '../Sigil';
import MaskLines from './company/MaskLines';
import { useEnter, useFilm, Letters } from './contact-sales/enter';
import C from '../../content';
import '../v2/vc-type.css';
import './company/deck.css';
import './ContactSales.css';

const EASE = [0.16, 1, 0.3, 1]; // deck ease-emphasis; no springs (MASTER 3.1)
const T = { duration: 0.3, ease: EASE };
const API = 'https://api.hanzo.ai/v1/marketing/leads';
const DRAFT = 'hz-contact-sales-draft';
const SIZES = [['1-49', '1–49 people'], ['50-249', '50–249 people'], ['250-999', '250–999 people'], ['1000-4999', '1,000–4,999 people'], ['5000+', '5,000+ people']];
const STEPS = [
  { name: 'name', label: 'Full name', type: 'text', auto: 'name', req: true, hint: 'text' },
  { name: 'email', label: 'Work email', type: 'email', auto: 'email', req: true, hint: 'email' },
  { name: 'company', label: 'Company', type: 'text', auto: 'organization', req: true, hint: 'text' },
  { name: 'size', label: 'Team size', type: 'size', req: true },
  { name: 'need', label: 'What do you want to build?', type: 'area', req: false },
];
const INCLUDES = ['Run Hanzo in your cloud, on your servers or fully offline', 'Dedicated compute, and your own models trained and hosted', 'Unlimited members, single sign-on, roles and an audit log', 'An uptime guarantee and security review in your contract', '24/7 engineering support and hands-on onboarding'];
// JS off: every question, size and inclusion readable in order; the step controls (which need JS) step aside (PLAN 2.3)
const NOJS = { __html: '<style>.xcs-stage{display:flex!important;flex-direction:column;gap:40px;min-height:0!important;height:auto!important}.xcs-step{position:relative!important;opacity:1!important;transform:none!important}.xcs-top,.xcs-acts,.xcs-picks,.xcs-peek{display:none!important}.xcs-in,.xcs-up{animation:none!important}.xcs .x-band .x-word,.xcs .x-band [style]{opacity:1!important;transform:none!important;filter:none!important}</style>' };
const okEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const two = (n) => String(n).padStart(2, '0');

const Check = ({ s = 18 }) => <svg viewBox="0 0 24 24" width={s} height={s} aria-hidden="true"><path d="M6 12.5l4 4 8-9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const Plus = ({ s = 18 }) => <svg viewBox="0 0 24 24" width={s} height={s} aria-hidden="true"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>;
const ArrowR = () => <svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const ArrowL = () => <svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true"><path d="M13 8H4M7.5 4.5 4 8l3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const Out = () => <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M5 11 11 5M6 5h5v5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const Bang = () => <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="currentColor" /><path d="M12 7v6.5M12 16.6v.4" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" /></svg>;

/* one POST with an 8s timeout */
async function post(body) {
  const c = new AbortController();
  const t = setTimeout(() => c.abort(), 8000);
  try { return await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, signal: c.signal }); }
  finally { clearTimeout(t); }
}

function Form({ v, setV, at, setAt, adds, toggle }) {
  const [bad, setBad] = useState(-1); // the step whose answer is missing or not an email
  const [state, setState] = useState('idle'); // idle | sending | sent | failed
  const [hold, setHold] = useState(0); // the card's height when sending began, kept into the sent state
  const [peek, setPeek] = useState(-1); // the inclusion under the pointer or focus
  const [hyd, setHyd] = useState(false);
  useEffect(() => setHyd(true), []);
  const card = useRef(null);
  const status = useRef(null);
  const refs = useRef({});
  const first = useRef(true);
  const calm = useReducedMotion();
  /* the demo: before anyone types, the conversation plays once from Hanzo's own field labels. "Full name" types into the
     first field (an aria-hidden overlay, never the field's value), lifts away, "Work email" rises, a chip lands, a rest,
     then the empty live form returns. It never submits, never writes the draft and never moves focus; the first
     pointer, key or focus on the card ends it at once. Reduced motion: no demo. */
  const [demo, setDemo] = useState(null); // { at, text, chip } while it plays
  const live = useRef({});
  live.current = { v, at, adds, state };
  const timers = useRef([]);
  const done = useRef(false);
  const stopDemo = () => { done.current = true; timers.current.forEach(clearTimeout); timers.current = []; setDemo(null); };
  useEffect(() => {
    if (calm || !hyd || done.current) return;
    const el = card.current;
    if (!el) return;
    const later = (ms, f) => timers.current.push(setTimeout(f, ms));
    const fresh = () => { const s = live.current; return s.state === 'idle' && s.at === 0 && !s.adds.length && !Object.values(s.v).some(Boolean); };
    let tries = 0;
    const play = () => {
      if (done.current) return;
      if (!fresh()) { done.current = true; return; } // a restored draft or an early answer: nothing to show
      if (document.documentElement.classList.contains('x-arriving') && tries++ < 12) { later(300, play); return; }
      done.current = true;
      const word = STEPS[0].label;
      let t = 0;
      setDemo({ at: 0, text: '', chip: null });
      for (let k = 1; k <= word.length; k++) later((t += 80), () => setDemo({ at: 0, text: word.slice(0, k), chip: null }));
      later((t += 500), () => setDemo({ at: 1, text: word, chip: null })); // the answer lifts away, the next question rises
      later((t += 420), () => setDemo({ at: 1, text: word, chip: word })); // a chip lands
      later((t += 1800), () => { timers.current = []; setDemo(null); }); // rest, then back to the empty live form
    };
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); later(700, play); } }, { threshold: 0.5 });
    io.observe(el);
    const stop = () => { if (!done.current || timers.current.length) stopDemo(); };
    el.addEventListener('pointerdown', stop);
    el.addEventListener('focusin', stop);
    el.addEventListener('keydown', stop);
    return () => { io.disconnect(); timers.current.forEach(clearTimeout); timers.current = []; el.removeEventListener('pointerdown', stop); el.removeEventListener('focusin', stop); el.removeEventListener('keydown', stop); };
  }, [calm, hyd]); // eslint-disable-line react-hooks/exhaustive-deps
  const shown = demo ? demo.at : at; // the step on screen (the demo only moves pictures; focus and inert follow `at`)
  // the card is sized to its one question: the stage takes the height of the step on screen and eases to the next one
  const stepEls = useRef([]);
  const [sh, setSh] = useState(null);
  useEffect(() => {
    const el = stepEls.current[shown];
    if (!el) return;
    const ro = new ResizeObserver(() => setSh(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, [shown, state]);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    const el = refs.current[STEPS[at].name];
    const t = setTimeout(() => {
      el?.focus({ preventScroll: true });
      // phones: the step can outgrow the screen; bring the card's buttons into view (after your own tap or Enter)
      if (matchMedia('(max-width: 900px)').matches) card.current?.scrollIntoView({ block: 'nearest', behavior: calm ? 'auto' : 'smooth' });
    }, 380);
    return () => clearTimeout(t);
  }, [at]); // eslint-disable-line react-hooks/exhaustive-deps
  // sent: the card keeps its height, comes into view where you are, and the status takes focus
  useEffect(() => {
    if (state !== 'sent') return;
    card.current?.scrollIntoView({ block: 'nearest', behavior: calm ? 'auto' : 'smooth' });
    const t = setTimeout(() => status.current?.focus({ preventScroll: true }), 60);
    return () => clearTimeout(t);
  }, [state, calm]);
  const wrong = (i) => {
    const s = STEPS[i], val = v[s.name].trim();
    return (s.req && !val) || (s.name === 'email' && !okEmail(val));
  };
  const next = () => { if (wrong(at)) { setBad(at); return; } setBad(-1); if (at < STEPS.length - 1) setAt(at + 1); };
  const submit = async (e) => {
    e.preventDefault();
    if (state === 'sending') return;
    for (let i = 0; i < STEPS.length; i++) if (wrong(i)) { setAt(i); setBad(i); return; }
    setHold(card.current?.offsetHeight || 0);
    // the honeypot was filled: a bot, quietly accepted, and counted
    if (v.website) { track('sales_trapped', { lead_source: 'contact-sales' }); setState('sent'); return; }
    setState('sending');
    // the visit as cloud reads it (consent, the ad click, the browser ids, which tags already saw the lead), and the
    // campaign the visit arrived with
    const seen = visit();
    const params = new URLSearchParams(location.search);
    const campaign = Object.fromEntries(['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].filter((k) => params.get(k)).map((k) => [k, params.get(k)]));
    // the note: your own words, then each inclusion you added, in Hanzo's sentence, one per line (same `need` field)
    const need = [v.need.trim(), ...adds.map((i) => INCLUDES[i])].filter(Boolean).join('\n');
    const body = JSON.stringify({ name: v.name.trim(), email: v.email.trim(), company: v.company.trim(), size: v.size, need, source: 'hanzo.ai/contact-sales', visit: seen, ...(Object.keys(campaign).length ? { campaign } : {}) });
    let r = null;
    try { r = await post(body); } catch { try { r = await post(body); } catch { r = null; } } // timeout or network: one retry
    let lead;
    if (r && r.ok) { setState('sent'); try { sessionStorage.removeItem(DRAFT); } catch {} lead = (await r.json().catch(() => null))?.lead; }
    else setState('failed');
    // the moment: a lead the CRM filed is stated by cloud on our stream, so the ad tags hear it under the lead's id and
    // our stream is not told twice; one that was not filed still counts
    const moment = { lead_source: 'contact-sales', company_size: v.size };
    if (lead) mirror('sales_contacted', { ...moment, lead_id: lead }, lead, seen.tags);
    else track('sales_contacted', moment);
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
          // a pointer or a tap chooses and moves on; arrow keys only choose; Enter moves on (WCAG 3.2.2)
          <label key={val} className={'xcs-size' + (v.size === val ? ' on' : '')} onClick={(e) => { if (e.detail > 0) setTimeout(() => setAt(4), 320); }}>
            <input type="radio" name="size" value={val} checked={v.size === val} required
              onChange={() => { setV({ ...v, size: val }); setBad(-1); }}
              // Enter keeps the answer you chose; it only picks the focused size when none is chosen yet
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); if (!v.size) setV({ ...v, size: val }); setBad(-1); setAt(4); } }}
              // Back to this step focuses the chosen size (roving focus), never the first one
              ref={(el) => { if (v.size ? val === v.size : val === '1-49') refs.current.size = el; }} />
            <span key={v.size === val ? 'y' : 'n'} className={v.size === val ? 'xcs-stamp' : undefined}>{l}</span>
          </label>
        ))}
      </div>
    );
    if (s.type === 'area') return (
      <>
        <textarea {...common} rows={3} ref={(el) => (refs.current[s.name] = el)} />
        <div className="xcs-picks" role="group" aria-labelledby="xcs-inc-h" onPointerLeave={() => setPeek(-1)}>
          {INCLUDES.map((t, i) => {
            const on = adds.includes(i);
            return (
              <button key={t} type="button" className={'xcs-pick' + (on ? ' on' : '')} aria-pressed={on} aria-label={t}
                onPointerEnter={() => setPeek(i)} onFocus={() => setPeek(i)} onBlur={() => setPeek(-1)} onClick={() => { toggle(i); setPeek(i); }}>
                <span key={on ? 'y' : 'n'} className={'vc-num' + (on ? ' xcs-stamp' : '')}>{two(i + 1)}</span>
              </button>
            );
          })}
        </div>
        <p className="xcs-peek" aria-hidden="true">{peek >= 0 ? INCLUDES[peek] : ''}</p>
      </>
    );
    return <input {...common} type={s.type} inputMode={s.hint} autoComplete={s.auto} enterKeyHint="next" ref={(el) => (refs.current[s.name] = el)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); next(); } }} />;
  };
  const size = SIZES.find(([k]) => k === v.size);
  const brief = [v.name.trim(), v.company.trim(), size && size[1]].filter(Boolean);
  const last = at === STEPS.length - 1;
  const sending = state === 'sending';
  return (
    <div className="xcs-card vc-obj" id="xcs-form" ref={card} data-thumb="Talk to sales" data-href="#xcs-form" style={hold ? { minHeight: hold } : undefined}>
      <noscript dangerouslySetInnerHTML={NOJS} />
      {state === 'sent' ? (
        <motion.div className="xcs-sent" ref={status} tabIndex={-1} role="status" initial={calm ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EASE }}>
          <motion.span className="xcs-sent-i xcs-stamp" initial={false}>
            <svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true"><motion.path d="M6 12.5l4 4 8-9" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" initial={calm ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.45, ease: EASE, delay: 0.15 }} /></svg>
          </motion.span>
          <p className="vc-headline xcs-sent-t">We come back with a plan for your company: where Hanzo runs, what it costs and how you start.</p>
          <ul className="xcs-chips">{brief.map((b) => <li key={b}>{b}</li>)}</ul>
        </motion.div>
      ) : (
        <form aria-labelledby="xcs-h1" method="post" noValidate onSubmit={submit} className="xcs-form">
          <div className="xcs-top" aria-hidden="true">
            <i className="xcs-progress"><motion.b initial={false} animate={{ scaleX: (shown + 1) / STEPS.length }} transition={T} /></i>
          </div>
          <motion.div className="xcs-stage" initial={false} animate={sh ? { height: sh } : undefined} transition={T}>
            {STEPS.map((s, i) => (
              <motion.div key={s.name} ref={(el) => { stepEls.current[i] = el; }} className={'xcs-step' + (i === shown ? ' on' : '') + (bad === i ? ' bad' : '')} initial={false}
                animate={i === shown ? { opacity: 1, y: 0 } : { opacity: 0, y: i < shown ? -16 : 16 }}
                transition={{ duration: i === shown ? 0.3 : 0.15, ease: EASE, delay: i === shown ? 0.06 : 0 }}
                {...(hyd && i !== at ? { 'aria-hidden': true, inert: true } : {})}>
                <label htmlFor={s.type === 'size' ? undefined : 'xcs-' + s.name} id={'xcs-l-' + s.name}>
                  <span className="xcs-q">{s.label}</span>
                  {s.type === 'size' && <span className="xcs-choose">Choose</span>}
                  {bad === i && <span className="xcs-bang" role="alert" aria-label={s.label}><Bang /></span>}
                </label>
                {field(s)}
                {i === 0 && demo && <span className="xcs-ghost" aria-hidden="true">{demo.text}</span>}
              </motion.div>
            ))}
          </motion.div>
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
                {/* each answer stamps onto the card as a chip (the signature: drop, squash, settle); the layout glide and
                    the exit are ease-emphasis 300ms */}
                {(demo ? [] : brief).map((b) => (
                  <motion.li key={'b' + b} layout initial={false} exit={{ opacity: 0, y: -8 }} transition={{ ...T, layout: T }}><span className="xcs-stamp">{b}</span></motion.li>
                ))}
                {demo?.chip && <motion.li key="demo" className="xcs-demo-chip" aria-hidden="true" initial={false} exit={{ opacity: 0, y: -8 }} transition={T}><span className="xcs-stamp">{demo.chip}</span></motion.li>}
              </AnimatePresence>
            </ul>
            <div className="xcs-btns">
              {at > 0 && <button type="button" className="xcs-round" aria-label="Back" onClick={() => { setBad(-1); setAt(at - 1); }}><ArrowL /></button>}
              {!last
                ? <button type="button" className="xcs-round solid" aria-label="Next" onClick={next} data-cta="contact-sales.next"><ArrowR /></button>
                : <button type="submit" className="xcs-send" aria-disabled={sending || undefined} aria-busy={sending || undefined} data-cta="contact-sales.submit">
                    <span className={sending ? 'xcs-hide' : ''}>Talk to sales</span>
                    {sending && <i className="xcs-ring" aria-hidden="true" />}
                  </button>}
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

/* the launches as a logo rail: Hanzo's own customer logos (public/logos/customers, as live shows them), each a real
   link; a logo that cannot load steps aside for its name set as type */
function Name({ l, ghost }) {
  const [bad, setBad] = useState(false);
  const ref = useRef(null);
  useEffect(() => { const i = ref.current; if (i && i.complete && !i.naturalWidth) setBad(true); }, []);
  return (
    <A to={l.href} className="xcs-logo" {...(ghost ? { tabIndex: -1, 'aria-hidden': true } : {})}>
      {bad ? <span>{l.name}</span> : <Img ref={ref} src={l.src} alt={ghost ? '' : l.name + ' logo'} w={160} h={40} onError={() => setBad(true)} />}
    </A>
  );
}

function Rail() {
  const [run, setRun] = useState(true);
  const calm = useReducedMotion();
  const box = useRef(null);
  const track = useRef(null);
  const live = useRef(true); // false while paused, hovered or focused
  const held = useRef(false);
  live.current = run && !held.current;
  // a slow drift (40px/s) whose speed answers the scroll: scrolling either way adds up to 600px/s, easing back after
  useEffect(() => {
    if (calm) return;
    const el = track.current, wrap = box.current;
    if (!el || !wrap) return;
    let x = 0, raf = 0, last = 0, lastY = window.scrollY, boost = 0;
    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      const dt = last ? Math.min(64, now - last) / 1000 : 0;
      last = now;
      const y = window.scrollY;
      const speed = dt ? Math.abs(y - lastY) / dt : 0;
      lastY = y;
      boost += (Math.min(speed * 0.35, 600) - boost) * 0.08;
      if (!live.current) return;
      x -= (40 + boost) * dt;
      const half = el.scrollWidth / 2;
      if (half && -x >= half) x += half;
      el.style.transform = 'translate3d(' + x.toFixed(2) + 'px,0,0)';
    };
    const io = new IntersectionObserver(([e]) => { cancelAnimationFrame(raf); last = 0; lastY = window.scrollY; if (e.isIntersecting) raf = requestAnimationFrame(tick); });
    io.observe(wrap);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, [calm]);
  const hold = (h) => () => { held.current = h; live.current = run && !h; };
  const cascade = useEnter('cascade');
  return (
    <section className="xcs-logos" aria-labelledby="xcs-logos-h">
      <div className="vc-wrap xcs-logos-h">
        <h2 id="xcs-logos-h" className="vc-title xcs-e xcs-e-cascade" ref={cascade}>
          {/* the heading's own words as one line; the falling letters are a picture of it that hands over once they land */}
          <span className="xcs-cas-real">Products Hanzo built and launched</span>
          <span className="xcs-cas-fx" aria-hidden="true"><Letters text="Products Hanzo built and launched" /></span>
        </h2>
        <button type="button" className="xcs-round" aria-label={run ? 'Pause' : 'Play'} aria-pressed={!run} onClick={() => setRun(!run)}>
          {run
            ? <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M5 3.5v9M11 3.5v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            : <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M5 3.2v9.6L12.5 8z" fill="currentColor" /></svg>}
        </button>
      </div>
      <div className="xcs-rail" data-rail ref={box} onPointerEnter={hold(true)} onPointerLeave={hold(false)} onFocus={hold(true)} onBlur={hold(false)}>
        <div className="xcs-track" ref={track}>
          {C.trusted.map((l) => <Name key={l.name} l={l} />)}
          {C.trusted.map((l) => <Name key={'g' + l.name} l={l} ghost />)}
        </div>
      </div>
    </section>
  );
}

/* What Enterprise includes: a plain list (no pinned scene, MOTION-MAP rule 3) that grows out of your last pointer point
   (grow-from-point). Numerals rest at 64px. Adding one, from a row or the +, stamps it: the numeral and the + land with
   a short drop, a squash and a settle (the signature); the same inclusion stamps onto the card's last step too. */
function Includes({ adds, toggle }) {
  const [lit, setLit] = useState(-1);
  const grow = useEnter('grow');
  return (
    <section className="vc-sec xcs-inc" aria-labelledby="xcs-inc-h">
      <div className="vc-grid">
        <header className="xcs-inc-h">
          <h2 id="xcs-inc-h" className="vc-headline">What Enterprise includes</h2>
          <More to="/enterprise">See everything in Enterprise</More>
        </header>
        <ol className="xcs-inc-l xcs-e xcs-e-grow" ref={grow}>
          {INCLUDES.map((t, i) => {
            const on = adds.includes(i);
            return (
              // the whole row answers: a .98 press, and a click or tap on it adds it (the + stays the keyboard control)
              <li key={t} className={(on ? 'on' : '') + (lit === i ? ' lit' : '')}
                onPointerEnter={() => setLit(i)} onPointerLeave={() => setLit(-1)}
                onClick={(e) => { if (!e.target.closest('button')) toggle(i); }}>
                <span className="xcs-inc-n vc-num" aria-hidden="true"><span key={on ? 'y' : 'n'} className={on ? 'xcs-stamp' : undefined}>{two(i + 1)}</span></span>
                <span className="xcs-inc-x">
                  <span className="xcs-inc-t">{t}</span>
                  {/* adds to the enquiry where you are: no focus move, no step change */}
                  <button type="button" className="xcs-round" aria-pressed={on} aria-label={t}
                    onFocus={() => setLit(i)} onBlur={() => setLit(-1)} onClick={() => toggle(i)}>
                    <span key={on ? 'y' : 'n'} className={'xcs-g' + (on ? ' xcs-stamp' : '')}>{on ? <Check /> : <Plus />}</span>
                  </button>
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

export default function ContactSales() {
  const [v, setV] = useState({ name: '', email: '', company: '', size: '', need: '', website: '' });
  const [at, setAt] = useState(0);
  const [adds, setAdds] = useState([]); // the inclusions you added, kept apart from your own words until you send
  const toggle = (i) => setAdds((a) => (a.includes(i) ? a.filter((x) => x !== i) : [...a, i].sort()));
  // the draft survives a reload in this tab (PLAN 2.1); nothing leaves the browser until you press Talk to sales
  const loaded = useRef(false);
  useEffect(() => {
    try {
      const d = JSON.parse(sessionStorage.getItem(DRAFT) || 'null');
      if (d) { setV((o) => ({ ...o, ...d.v, website: '' })); setAdds(d.adds || []); setAt(d.at || 0); }
    } catch {}
    loaded.current = true;
  }, []);
  useEffect(() => {
    if (!loaded.current) return;
    const { website, ...rest } = v; // eslint-disable-line no-unused-vars
    try { sessionStorage.setItem(DRAFT, JSON.stringify({ v: rest, adds, at })); } catch {}
  }, [v, adds, at]);
  const sizeAt = SIZES.findIndex(([k]) => k === v.size);
  const calm = useReducedMotion();
  // the Band's "Talk to sales" glides back up to the card and puts you in the question you are on (no reload, no jump)
  const back = (e) => {
    const a = e.target.closest?.('.x-band a[href*="#xcs-form"]');
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button > 0) return;
    e.preventDefault();
    const card = document.getElementById('xcs-form');
    if (!card) return;
    card.scrollIntoView({ block: 'center', behavior: calm ? 'auto' : 'smooth' });
    const f = card.querySelector('.xcs-step.on input:not([type=radio]), .xcs-step.on textarea, .xcs-step.on input:checked, .xcs-step.on input[type=radio]');
    setTimeout(() => f?.focus({ preventScroll: true }), calm ? 0 : 900);
  };
  const root = useRef(null);
  const pendulum = useEnter('pendulum');
  const accordion = useEnter('accordion');
  useFilm(root);
  return (
    <main className="vc xcs" ref={root} style={{ '--acc': '#0a0a0a' }} data-ask-name="Talk to sales" onClickCapture={back}>
      <section className="xcs-hero vc-scene" aria-labelledby="xcs-h1">
        <div className="vc-grid xcs-hero-g">
          <div className="xcs-copy">
            <MaskLines as="h1" id="xcs-h1" now delay={0.05} lines={['Talk to', 'sales']} className="vc-display" />
            <p className="vc-lede">Tell us what you want to build. We come back with a plan for your company: where Hanzo runs, what it costs and how you start.</p>
          </div>
          <div className="xcs-stagewrap xcs-e xcs-e-pendulum" ref={pendulum}>
            {/* the field answers the form: every answer you give redraws its hills (a short cross-fade) */}
            <motion.div key={at + '.' + adds.length + '.' + sizeAt} className="xcs-field" aria-hidden="true" initial={{ opacity: 0.2 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, ease: EASE }}>
              <Sigil seed="contact-sales" data={[30 + at * 9, 24 + adds.length * 11, 7 + Math.max(0, sizeAt) * 3, 5000]} className="xcs-sigil" />
            </motion.div>
            <Form v={v} setV={setV} at={at} setAt={setAt} adds={adds} toggle={toggle} />
          </div>
          <div className="xcs-more xcs-e xcs-e-accordion" ref={accordion}>
            <div className="xcs-routes">
              <A to="https://cal.com/hanzo/30min" className="xcs-route"><span className="xcs-rl">Or book a 30-minute call</span><span className="xcs-rv" aria-hidden="true"><Out /></span></A>
              <a href="mailto:enterprise@hanzo.ai" className="xcs-route"><span className="xcs-rl">Prefer email?</span><span className="xcs-rv">enterprise@hanzo.ai</span></a>
              <A to="https://hanzo.team/start" className="xcs-route"><span className="xcs-rl">Want it today?</span><span className="xcs-rv">Get Hanzo Team</span></A>
            </div>
            <p className="xcs-alt"><span>Want instant recommendations or team seat pricing?</span> <A to="/buying-specialist" className="xcs-ai">Talk to AI Buying Specialist →</A></p>
          </div>
        </div>
      </section>

      <Includes adds={adds} toggle={toggle} />

      <Rail />
      <Band title="Tell us what you want to build." action="Talk to sales" to="/contact-sales#xcs-form" />
    </main>
  );
}
