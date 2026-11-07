'use client';
/* AI Buying Specialist. Its idea is the sales desk where the quote writes itself while you talk.
   V2: 8/10 rebuilt as a desk and a rail: the greeting at display size with the conversation under it, the quote sheet as the dark hero object re-pricing seat by seat; the six promises as a rail you throw with inertia.
   Signature: the conversation on the left; beside it a quote sheet of seats, one square per member, fills and
   re-prices by itself, and when you tell the specialist your team size the sheet takes that size and the price rolls.
   Beyond: the seat mixer. Set members and how many take Premium; yearly and monthly totals come from Hanzo's own seat
   prices ($20 / $25 Standard, $100 / $125 Premium), with what yearly billing saves.
   Motion: live quote sheet (signature) + line-masked greeting + a drag rail with inertia for the promises.
   Accent: blue. The chat is real: POST https://api.hanzo.ai/v1/chat/public (model enso-free) with Hanzo's own
   specialist brief, the transcript filed as Hanzo files it, and Hanzo's own written answers when the endpoint cannot
   be reached. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion, useMotionValue, animate } from 'motion/react';
import { EASE } from '../ui';
import { A } from '../kit';
import LineReveal from '../v2/LineReveal';
import { P, r2, usd, BRIEF, written } from './BuyingSpecialist.data';
import '../v2/ProgramScale.css';
import './BuyingSpecialist.css';

const API = 'https://api.hanzo.ai/v1/chat/public';
const FORM = 'https://api.hanzo.ai/v1/form/public/hanzo.sales-chat/responses';
const PROMISES = [
  ['The fastest path in.', "You'll have a quote and a plan by the end of this conversation."],
  ['The best price you\'ll get.', "I'll check for our latest pricing."],
  ['I already know your account.', "If you're using Hanzo, I can see your current plan, seats, and usage."],
  ['Free to talk.', "This conversation doesn't count toward your usage."],
  ['A sales rep if you want one.', "For complex or large deals, I'll hand you to a teammate with everything you've shared already in context."],
  ['Nothing sensitive needed.', 'I can find the right plan with some basic information. Please keep confidential details out of chat.'],
];
const ASK = ['We have a team of 10 developers', 'Explain Standard vs Premium seats', 'Looking for dedicated VPC & HIPAA', 'Compare Team vs Enterprise'];

/* A small, safe markdown: paragraphs, headings, lists, bold, emphasis, code and http(s) or on-site links only. */
function inline(t) {
  const out = []; let at = 0;
  for (const m of t.matchAll(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]+)\)|\*\*(.*?)\*\*|\*(.*?)\*|`(.*?)`|\b(cal\.com\/hanzo)\b/g)) {
    if (m.index > at) out.push(t.slice(at, m.index));
    const [, lt, lh, b, em, code, cal] = m;
    out.push(lt !== undefined ? <A key={m.index} to={lh}>{lt}</A> : cal ? <a key={m.index} href="https://cal.com/hanzo" target="_blank" rel="noopener noreferrer">{cal}</a> : b !== undefined ? <strong key={m.index}>{b}</strong> : em !== undefined ? <em key={m.index}>{em}</em> : <code key={m.index}>{code}</code>);
    at = m.index + m[0].length;
  }
  if (at < t.length) out.push(t.slice(at));
  return out;
}
function Md({ text }) {
  return text.split('\n\n').map((blk, i) => {
    const ls = blk.split('\n').filter((l) => l.trim());
    if (ls.length === 1 && /^#{1,3}\s+/.test(ls[0].trim())) return <h4 key={i}>{inline(ls[0].trim().replace(/^#{1,3}\s+/, ''))}</h4>;
    if (ls.length && ls.every((l) => /^([-*]|\d+\.)\s+/.test(l.trim()))) return <ul key={i}>{ls.map((l, j) => <li key={j} className={/^\s{2,}/.test(l) ? 'sub' : ''}>{inline(l.trim().replace(/^([-*]|\d+\.)\s+/, ''))}</li>)}</ul>;
    return <p key={i}>{inline(blk)}</p>;
  });
}

function Quote({ q }) {
  return (
    <div className="xbs-quote">
      <div className="xbs-quote-h"><b>{q.plan} Configuration</b><span className="x-mono">SAVE {q.savings}% ANNUALLY</span></div>
      <div className="xbs-quote-g">
        <div><span>Annual Rate (Recommended)</span><b className="x-mono">{usd(r2(q.annualTotal / 12))}<small>/mo</small></b><span>Billed {usd(q.annualTotal)} annually upfront</span></div>
        <div><span>Monthly Rate</span><b className="x-mono">{usd(q.monthlyTotal)}<small>/mo</small></b><span>Cancel anytime</span></div>
      </div>
      <div className="xbs-quote-a">
        <A to={q.checkoutUrl} className="x-btn solid">Continue with {q.plan} →</A>
        <a href="https://cal.com/hanzo" target="_blank" rel="noopener noreferrer" className="x-btn">Book a Call (cal.com/hanzo)</a>
      </div>
    </div>
  );
}

/* The seat mixer: one square per member; Premium squares are filled. It re-prices itself until you take it. */
function Sheet({ seats, prem, setSeats, setPrem, mine }) {
  const yr = (seats - prem) * P.std + prem * P.prem;
  const mo = (seats - prem) * P.stdMo + prem * P.premMo;
  return (
    <aside className="xbs-sheet" aria-label="Team quote">
      <div className="xbs-sheet-h"><b>Hanzo Team</b><span className="x-mono">{seats} members</span></div>
      <div className="xbs-seats" aria-hidden="true">
        {Array.from({ length: 100 }, (_, i) => <i key={i} className={i < seats ? (i >= seats - prem ? 'p' : 's') : ''} />)}
      </div>
      <label className="xbs-range"><span>Members <output className="x-mono">{seats}</output></span>
        <input type="range" min={2} max={100} value={seats} onChange={(e) => { mine(); const v = +e.target.value; setSeats(v); setPrem((p) => Math.min(p, v)); }} />
      </label>
      <label className="xbs-range"><span>Premium seats <output className="x-mono">{prem}</output></span>
        <input type="range" min={0} max={seats} value={prem} onChange={(e) => { mine(); setPrem(+e.target.value); }} />
      </label>
      <dl className="xbs-tot">
        <div><dt>Billed yearly</dt><dd className="x-mono">{usd(r2(yr / 12))}<small>/mo</small></dd><dd className="xbs-sub">{usd(yr)} a year</dd></div>
        <div><dt>Billed monthly</dt><dd className="x-mono">{usd(mo)}<small>/mo</small></dd><dd className="xbs-sub">Yearly saves {usd(mo * 12 - yr)}</dd></div>
      </dl>
      <p className="xbs-legend"><i className="s" />Standard seat · $20/mo yearly, $25 monthly <i className="p" />Premium seat · $100/mo yearly, $125 monthly</p>
      <A to={`/pay/cart?plan=team&interval=year&quantity=${seats}`} className="x-btn solid xbs-start">Start Team Plan →</A>
      <p className="xbs-more">More than 100 people? <A to="/enterprise/start">Start Enterprise Plan →</A></p>
    </aside>
  );
}

/* The six promises as a rail you throw: it carries on with inertia and springs back at its ends. */
function Promises() {
  const view = useRef(null);
  const track = useRef(null);
  const x = useMotionValue(0);
  const [drag, setDrag] = useState(false);
  useEffect(() => { setDrag(matchMedia('(pointer: fine)').matches); }, []);
  const step = (d) => {
    const v = view.current, t = track.current;
    if (!v || !t) return;
    const min = Math.min(0, v.clientWidth - t.scrollWidth);
    const w = t.firstElementChild ? t.firstElementChild.getBoundingClientRect().width + 24 : 400;
    animate(x, Math.max(min, Math.min(0, x.get() - d * w)), { type: 'spring', stiffness: 300, damping: 30 });
  };
  return (
    <section className="xp-sec xbs-why" aria-labelledby="xbs-why-h">
      <div className="xp-wrap xp-grid xbs-why-head">
        <h2 id="xbs-why-h" className="xp-head">We can do all of it right here.</h2>
        <div className="xbs-why-nav">
          <button type="button" onClick={() => step(-1)} aria-label="Previous">←</button>
          <button type="button" onClick={() => step(1)} aria-label="Next">→</button>
        </div>
      </div>
      <div className="xbs-rail" ref={view} data-drag={drag ? '' : undefined} data-swipe-own>
        <motion.ul ref={track} className="xbs-track" style={drag ? { x } : undefined} drag={drag ? 'x' : false} dragConstraints={view} dragElastic={0.08} dragTransition={{ power: 0.35, timeConstant: 320 }}>
          {PROMISES.map(([b, t], i) => (
            <li key={b} className="xbs-card">
              <span className="xbs-card-n x-mono">{String(i + 1).padStart(2, '0')}</span>
              <strong className="xp-title">{b}</strong>
              <span className="xp-body">{t}</span>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

export default function BuyingSpecialist() {
  const [name, setName] = useState('there');
  const [msgs, setMsgs] = useState([]);
  const [busy, setBusy] = useState(false);
  const [val, setVal] = useState('');
  const [seats, setSeats] = useState(10);
  const [prem, setPrem] = useState(3);
  const [own, setOwn] = useState(false);
  const end = useRef(null);
  const desk = useRef(null);
  const seen = useInView(desk, { amount: 0.2 });
  const calm = useReducedMotion();
  const started = msgs.length > 0;

  useEffect(() => { const n = new URLSearchParams(location.search).get('name'); if (n && n.trim()) setName(n.trim().slice(0, 40)); }, []);
  useEffect(() => { if (started) end.current?.scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'nearest' }); }, [msgs, busy, started, calm]);
  // the sheet re-prices itself (4, 10, 25, 50 members) until you or the chat set it
  useEffect(() => {
    if (own || calm || !seen) return;
    const STEPS = [[4, 1], [10, 3], [25, 5], [50, 10]];
    const i = STEPS.findIndex(([s]) => s === seats);
    const t = setTimeout(() => { const [s, p] = STEPS[(i + 1) % STEPS.length]; setSeats(s); setPrem(p); }, 2400);
    return () => clearTimeout(t);
  }, [seats, own, calm, seen]);

  const file = (q, a, quote, list) => {
    const transcript = [...list, { role: 'user', content: q }, { role: 'assistant', content: a }].map((m) => `${m.role === 'user' ? 'Visitor' : 'Buying Specialist'}: ${m.content}`).join('\n\n');
    const answers = [{ field: 'message', text: q }, { field: 'transcript', text: transcript }];
    if (quote?.plan) answers.push({ field: 'plan', text: quote.plan });
    if (typeof quote?.seats === 'number') answers.push({ field: 'seats', number: quote.seats });
    fetch(FORM, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ answers, hidden: { program: 'chat', source: 'hanzo.ai/buying-specialist' } }) }).catch(() => {});
  };

  const send = async (text) => {
    const q = (text || val.trim() || 'Hi! Can you help me find the right plan for my team?').slice(0, 2000);
    if (busy) return;
    setVal('');
    const list = msgs;
    setMsgs([...list, { role: 'user', content: q }]);
    setBusy(true);
    const w = written(q, name);
    let a = w.content;
    try {
      const res = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ model: 'enso-free', messages: [{ role: 'system', content: BRIEF(name) }, ...list.map((m) => ({ role: m.role, content: m.content })), { role: 'user', content: q }] }) });
      const d = await res.json();
      a = d?.choices?.[0]?.message?.content?.trim() || w.content;
    } catch { /* the written answer stands in */ }
    setMsgs((m) => [...m, { role: 'assistant', content: a, quote: w.quote }]);
    if (w.quote?.plan === 'Hanzo Team') { setOwn(true); setSeats(Math.min(100, w.quote.seats)); setPrem(0); }
    file(q, a, w.quote, list);
    setBusy(false);
  };

  return (
    <main className="xp xbs">
      <section className="xbs-desk" ref={desk} aria-labelledby="xbs-h1">
        <div className="xp-wrap xbs-grid">
          <div className="xbs-chat">
            <AnimatePresence initial={false}>
              {!started && (
                <motion.div key="intro" className="xbs-intro" exit={{ opacity: 0, y: -16, transition: { duration: 0.25 } }}>
                  <motion.span className="xbs-orb" aria-hidden="true" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, ease: EASE }}><i /><i /><i /></motion.span>
                  <LineReveal as="h1" id="xbs-h1" className="xp-display sm xbs-h1" lines={[`Hi ${name}, let's find`, 'the right plan', 'for your team.']} />
                  <motion.p className="xp-lede xbs-lede" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}>I&apos;m an AI buying specialist, here to help you figure out which plan fits, what it&apos;ll cost, and how to get your team set up. We can do all of it right here.</motion.p>
                  <div className="xbs-asks">
                    {ASK.map((t, i) => (
                      <motion.button key={t} type="button" onClick={() => send(t)} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE, delay: 0.6 + i * 0.05 }} whileTap={{ scale: 0.97 }}>{`${t} →`}</motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {started && <h1 className="x-sr">{`Hi ${name}, let's find the right plan for your team.`}</h1>}
            {started && (
              <ol className="xbs-log" aria-live="polite">
                {msgs.map((m, i) => (
                  <motion.li key={i} className={m.role === 'user' ? 'me' : 'ai'} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EASE }}>
                    {m.role === 'user' ? <p>{m.content}</p> : (
                      <>
                        <span className="xbs-av" aria-hidden="true">✦</span>
                        <div className="xbs-ans">
                          <div className="xbs-bubble"><Md text={m.content} /></div>
                          {m.quote && <Quote q={m.quote} />}
                          <div className="xbs-plans">
                            <A to="/pricing?tab=personal">Start Personal Plan →</A>
                            <A to={`/pay/cart?plan=team&interval=year&quantity=${m.quote?.seats && m.quote.seats <= 100 ? m.quote.seats : 10}`}>Start Team Plan →</A>
                            <A to="/enterprise/start">Start Enterprise Plan →</A>
                            <a href="https://cal.com/hanzo" target="_blank" rel="noopener noreferrer">Sales Question? Book at cal.com/hanzo →</a>
                          </div>
                        </div>
                      </>
                    )}
                  </motion.li>
                ))}
                {busy && <li className="ai wait"><span className="xbs-av" aria-hidden="true">✦</span><span className="xbs-dots" role="status">Finding the best plan for your team...</span></li>}
              </ol>
            )}
            <div ref={end} />
            <form className="xbs-composer" data-dock onSubmit={(e) => { e.preventDefault(); if (!val.trim() && started) return; send(); }}>
              <input type="text" value={val} onChange={(e) => setVal(e.target.value)} maxLength={2000} placeholder={started ? 'Ask the Buying Specialist a question...' : 'Press enter to get started'} aria-label={started ? 'Ask the Buying Specialist a question' : 'Press enter to get started'} disabled={busy} />
              <motion.button type="submit" aria-label="Send message" disabled={busy} whileTap={{ scale: 0.9 }}>
                <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M8 13V3M4 7l4-4 4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </motion.button>
            </form>
            <p className="xbs-legal">By continuing, you agree to our <A to="/privacy">Privacy Policy</A>.</p>
          </div>
          <motion.div className="xbs-side" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.3 }}>
            <Sheet seats={seats} prem={prem} setSeats={setSeats} setPrem={setPrem} mine={() => setOwn(true)} />
          </motion.div>
        </div>
      </section>
      <Promises />
    </main>
  );
}
