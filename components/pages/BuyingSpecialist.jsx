'use client';
/* AI Buying Specialist. Its idea is the sales desk where the quote writes itself while you talk.
   Persona: a team lead choosing a Hanzo plan (PLAN-COMPONENTS 1.1 buyer). Goal: a quote and a plan. CTA: "Start Team
   Plan →" (Hanzo's own plan button), with the conversation itself as the first action. Metric: signup_start.
   V2: 8/10 grey deck: the greeting at display size with the conversation under it; Hanzo's own quote card as the dark hero object, re-pricing seat by seat by itself; the six promises as a rail you throw with inertia; one solid ask, sticky after the hero.
   Signature: the conversation on the left; beside it a quote sheet of seats, one square per member, fills and
   re-prices by itself, and when you tell the specialist your team size the sheet takes that size and the price rolls.
   Beyond: the quote card you can drag: its seats follow the slider and the annual and monthly rates re-price from
   Hanzo's own seat prices, before you type a word.
   Motion: live quote sheet (signature) + line-masked greeting + a drag rail with inertia for the promises.
   0 UI hues. The chat is real: POST https://api.hanzo.ai/v1/chat/public (model enso-free) with Hanzo's own
   specialist brief, the transcript filed as Hanzo files it, and Hanzo's own written answers when the endpoint cannot
   be reached. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion, useMotionValue, animate } from 'motion/react';
import { EASE } from '../ui';
import { A, Band } from '../kit';
import LineReveal, { NoJs } from '../v2/LineReveal';
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
/* Line by line: '#' lines become headings, runs of '-' or '1.' lines become lists, the rest paragraphs. */
function Md({ text }) {
  const out = [];
  let para = [], list = null;
  const flush = () => {
    if (para.length) { out.push(<p key={out.length}>{inline(para.join(' '))}</p>); para = []; }
    if (list) { out.push(<ul key={out.length}>{list.map(([sub, t], j) => <li key={j} className={sub ? 'sub' : ''}>{inline(t)}</li>)}</ul>); list = null; }
  };
  for (const raw of text.split('\n')) {
    const l = raw.trim();
    if (!l) { flush(); continue; }
    const h = /^#{1,4}\s+(.*)$/.exec(l);
    const li = /^([-*]|\d+\.)\s+(.*)$/.exec(l);
    if (h) { flush(); out.push(<h4 key={out.length}>{inline(h[1])}</h4>); }
    else if (li) { if (para.length) { const p2 = para; para = []; out.push(<p key={out.length}>{inline(p2.join(' '))}</p>); } (list ||= []).push([/^\s{2,}/.test(raw), li[2]]); }
    else { if (list) { const l2 = list; list = null; out.push(<ul key={out.length}>{l2.map(([sub, t], j) => <li key={j} className={sub ? 'sub' : ''}>{inline(t)}</li>)}</ul>); } para.push(l); }
  }
  flush();
  return out;
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
        <A to={q.checkoutUrl} className="x-btn">Continue with {q.plan} →</A>
        <a href="https://cal.com/hanzo" target="_blank" rel="noopener noreferrer" className="x-btn">Book a Call (cal.com/hanzo)</a>
      </div>
    </div>
  );
}

/* The seat mixer: one square per member; Premium squares are filled. It re-prices itself until you take it. */
/* A price that rolls: the new figure rises into place as the old one leaves. */
function Roll({ v }) {
  return (
    <span className="xbs-roll">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span key={v} initial={{ y: '70%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '-70%', opacity: 0, transition: { duration: 0.18 } }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>{v}</motion.span>
      </AnimatePresence>
    </span>
  );
}

/* The hero object: Hanzo's own quote card, the one the specialist writes into a reply, for a team of N members. It
   re-prices itself (4, 10, 25, 50) until you drag the seats or tell the chat your size. Every word on it is the
   card's own. */
function Sheet({ seats, setSeats, mine }) {
  const yr = seats * P.std;
  const mo = seats * P.stdMo;
  return (
    <aside className="xbs-sheet" data-room="dark" aria-label={`Hanzo Team Configuration, ${seats} members`}>
      <div className="xbs-sheet-h"><b>Hanzo Team Configuration</b><span className="x-mono">SAVE {P.save}% ANNUALLY</span></div>
      <p className="xbs-team x-mono" aria-hidden="true"><b>{seats}</b> members</p>
      <div className="xbs-seats" aria-hidden="true">
        {Array.from({ length: 100 }, (_, i) => <i key={i} className={i < seats ? 's' : ''} style={{ transitionDelay: (i % 20) * 8 + 'ms' }} />)}
      </div>
      <input className="xbs-range" type="range" min={2} max={100} value={seats} aria-label="members" onChange={(e) => { mine(); setSeats(+e.target.value); }} />
      <dl className="xbs-tot">
        <div><dt>Annual Rate (Recommended)</dt><dd className="x-mono"><Roll v={usd(r2(yr / 12))} /><small>/mo</small></dd><dd className="xbs-sub">Billed {usd(yr)} annually upfront</dd></div>
        <div><dt>Monthly Rate</dt><dd className="x-mono"><Roll v={usd(mo)} /><small>/mo</small></dd><dd className="xbs-sub">Cancel anytime</dd></div>
      </dl>
      <A to={`/pay/cart?plan=team&interval=year&quantity=${seats}`} className="x-btn solid xbs-start" data-thumb="Start Team Plan →" data-cta="buying-specialist.quote">Start Team Plan →</A>
      <A to="/enterprise/start" className="x-arrow xbs-more"><span>Start Enterprise Plan →</span></A>
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
    animate(x, Math.max(min, Math.min(0, x.get() - d * w)), { duration: 0.3, ease: [0.16, 1, 0.3, 1] });
  };
  return (
    <section className="xp-sec xbs-why" aria-label="The fastest path in.">
      <div className="xp-wrap xp-grid xbs-why-head">
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
  const cycle = useRef(0);
  const ask = useRef(null);
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
    const STEPS = [10, 25, 50, 4, 10]; // one cycle through, then it rests on 10
    const i = STEPS.indexOf(seats, cycle.current);
    if (i < 0 || i >= STEPS.length - 1) return;
    const t = setTimeout(() => { cycle.current = i + 1; setSeats(STEPS[i + 1]); }, 2400);
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
    if (w.quote?.plan === 'Hanzo Team') { setOwn(true); setSeats(Math.min(100, w.quote.seats)); }
    file(q, a, w.quote, list);
    setBusy(false);
  };

  return (
    <main className="xp xbs">
      <NoJs />
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
                      <motion.button key={t} type="button" onClick={() => { send(t); setTimeout(() => ask.current?.focus(), 60); }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE, delay: 0.6 + i * 0.05 } }} whileTap={{ scale: 0.97, transition: { duration: 0.12 } }}>{`${t} →`}</motion.button>
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
            <form className={'xbs-composer' + (started ? ' live' : '')} onSubmit={(e) => { e.preventDefault(); if (!val.trim() && started) return; send(); }}>
              <input ref={ask} type="text" value={val} onChange={(e) => setVal(e.target.value)} maxLength={2000} placeholder={started ? 'Ask the Buying Specialist a question...' : 'Press enter to get started'} aria-label={started ? 'Ask the Buying Specialist a question' : 'Press enter to get started'} disabled={busy} />
              <motion.button type="submit" aria-label="Send message" disabled={busy} whileTap={{ scale: 0.9 }}>
                <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M8 13V3M4 7l4-4 4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </motion.button>
            </form>
            <p className="xbs-legal">By continuing, you agree to our <A to="/privacy">Privacy Policy</A>.</p>
          </div>
          <motion.div className="xbs-side" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.3 }}>
            <Sheet seats={seats} setSeats={setSeats} mine={() => setOwn(true)} />
          </motion.div>
        </div>
      </section>
      <Promises />
      <Band title="The fastest path in." lede="You'll have a quote and a plan by the end of this conversation." action="Start Team Plan →" to={`/pay/cart?plan=team&interval=year&quantity=${seats}`} />
    </main>
  );
}
