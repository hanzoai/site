'use client';
/* AI Buying Specialist. Its idea is the sales desk where the quote writes itself while you talk.
   Persona: a team lead choosing a Hanzo plan (PLAN-COMPONENTS 1.1 buyer). Goal: a quote and a plan. CTA: "Start Team
   Plan →" (Hanzo's own plan button), with the conversation itself as the first action. Metric: signup_start.
   V2: 8/10 one quote object: a chat answer moves the sheet (Team or Enterprise, seats) instead of printing a second card, one ask + one link under it; the promises sheet renders the page's own UI per promise; phone first screen has the moving quote with its ask; sheet fits 801px with aligned rates; Enterprise billed annually only; phone promises stack with a card each; one solid from first paint; dark objects no longer darken the header.
   Signature: the conversation on the left; beside it a quote sheet of seats, one square per member, fills and
   re-prices by itself, and when you tell the specialist your team size the sheet takes that size and the price rolls.
   Beyond: the quote card you can drag: its seats follow the slider and the annual and monthly rates re-price from
   Hanzo's own seat prices, before you type a word.
   Motion: live quote sheet with rolling prices (signature) + line-masked greeting + the conversation arriving line by line.
   0 UI hues. The chat is real: POST https://api.hanzo.ai/v1/chat/public (model enso-free) with Hanzo's own
   specialist brief, the transcript filed as Hanzo files it, and Hanzo's own written answers when the endpoint cannot
   be reached. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { EASE } from '../ui';
import { scrollToEl } from '../../lib/scroll';
import { A, Band, Cta } from '../kit';
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
/* The one quote object. A chat answer that proposes a plan moves THIS card (plan and seats) instead of printing a
   second card. Team: 2-100 members, annual or monthly. Enterprise: 20-500 seats, billed annually only, so it shows
   one rate and no saving (one square stands for five seats). */
const teamUrl = (n) => `/pay/cart?plan=team&interval=year&quantity=${n}`;
function Sheet({ seats, setSeats, mine, plan }) {
  const ent = plan === 'ent';
  const yr = seats * (ent ? P.ent : P.std);
  const mo = seats * P.stdMo;
  const fill = ent ? Math.round(seats / 5) : seats;
  const title = ent ? 'Enterprise Configuration' : 'Hanzo Team Configuration';
  return (
    <aside className={'xbs-sheet xbs-ink' + (ent ? ' ent' : '')} id="xbs-sheet" aria-label={`${title}, ${seats} members`}>
      <div className="xbs-sheet-h"><b>{title}</b>{!ent && <span className="x-mono">SAVE {P.save}% ANNUALLY</span>}</div>
      <label className="xbs-team x-mono" htmlFor="xbs-seats"><b><Roll v={seats} /></b> members</label>
      <div className="xbs-seats" aria-hidden="true">
        {Array.from({ length: 100 }, (_, i) => <i key={i} className={i < fill ? 's' : ''} style={{ transitionDelay: (i % 20) * 8 + 'ms' }} />)}
      </div>
      <input id="xbs-seats" className="xbs-range" type="range" min={ent ? 20 : 2} max={ent ? 500 : 100} step={ent ? 5 : 1} value={seats} onChange={(e) => { mine(); setSeats(+e.target.value); }} />
      <dl className={'xbs-tot' + (ent ? ' one' : '')}>
        <div><dt>Annual Rate (Recommended)</dt><dd className="x-mono"><Roll v={usd(r2(yr / 12))} /><small>/mo</small></dd><dd className="xbs-sub">Billed {usd(yr)} annually upfront</dd></div>
        {!ent && <div><dt>Monthly Rate</dt><dd className="x-mono"><Roll v={usd(mo)} /><small>/mo</small></dd><dd className="xbs-sub">Cancel anytime</dd></div>}
      </dl>
      {ent ? (
        <>
          <Cta to="/enterprise/start" id="buying-specialist.quote" thumb className="xbs-start">Start Enterprise Plan →</Cta>
          <A to={teamUrl(Math.min(100, seats))} className="x-arrow xbs-more"><span>Start Team Plan →</span></A>
        </>
      ) : (
        <>
          <Cta to={teamUrl(seats)} id="buying-specialist.quote" thumb className="xbs-start">Start Team Plan →</Cta>
          <A to="/enterprise/start" className="x-arrow xbs-more"><span>Start Enterprise Plan →</span></A>
        </>
      )}
    </aside>
  );
}

/* The six promises around one object: a dark sheet beside the ledger that changes with the promise you are on
   (scroll, hover or focus picks it). Each scene is a small render of this page's own interface (the quote card, the
   chat, the composer) in its own words and Hanzo's prices. */
function Scene({ i, seats }) {
  const yr = seats * P.std, mo = seats * P.stdMo;
  const grid = (fill, cls = '') => (
    <div className={'xbs-sg ' + cls}>{Array.from({ length: 40 }, (_, k) => <i key={k} className={k < fill ? 's' : ''} style={{ '--k': k }} />)}</div>
  );
  const ai = (text, extra) => (
    <div className="xbs-mai"><span className="xbs-av dk">✦</span><div className="xbs-mans"><p className="xbs-mb">{text}</p>{extra}</div></div>
  );
  if (i === 0) return (<>
    <p className="xbs-sx x-mono"><b><Roll v={seats} /></b> members</p>
    {grid(Math.min(40, seats), 'sweep')}
    <p className="xbs-sp"><Roll v={usd(r2(yr / 12))} /><small>/mo</small></p>
  </>);
  if (i === 1) return (<>
    <div className="xbs-sheet-h"><b>Hanzo Team Configuration</b><span className="x-mono xbs-save">SAVE {P.save}% ANNUALLY</span></div>
    <div className="xbs-mt">
      <div className="on"><span className="x-mono">Annual Rate (Recommended)</span><b><Roll v={usd(r2(yr / 12))} /><small>/mo</small></b></div>
      <div><span className="x-mono">Monthly Rate</span><b><Roll v={usd(mo)} /><small>/mo</small></b></div>
    </div>
  </>);
  if (i === 2) return (<>
    <div className="xbs-sheet-h"><b>Hanzo Team Configuration</b></div>
    <p className="xbs-sx x-mono"><b><Roll v={seats} /></b> members</p>
    {grid(Math.min(40, seats))}
    <div className="xbs-mr"><b style={{ width: `${seats}%` }} /><i className="xbs-mr-t" style={{ left: `${seats}%` }} /></div>
  </>);
  if (i === 3) return (<div className="xbs-mchat">
    <p className="xbs-mme">We have a team of {seats} developers</p>
    {ai(<>For a team of <strong>{seats} members</strong>, the <strong>Hanzo Team</strong> plan provides the best balance of pooled usage, shared workspaces, and team controls.</>)}
    <p className="xbs-mwait">Finding the best plan for your team...</p>
  </div>);
  if (i === 4) return (<div className="xbs-mchat">
    {ai(<>For organizations deploying at scale, <strong>Hanzo Enterprise</strong> is built for both self-serve setup (20 to 500 seats) and custom contracts (&gt;500 seats).</>,
      <span className="xbs-mpill">Book a Call (cal.com/hanzo)</span>)}
    <p className="xbs-mlink">Sales Question? Book at cal.com/hanzo →</p>
  </div>);
  return (<div className="xbs-mcomp">
    <div className="xbs-min"><span className="xbs-mtype">We have a team of {seats} developers</span><i className="xbs-msend">↑</i></div>
    <p className="xbs-mlegal">By continuing, you agree to our <u>Privacy Policy</u>.</p>
  </div>);
}

function Promises({ seats }) {
  const [on, setOn] = useState(0);
  const rows = useRef([]);
  useEffect(() => {
    const io = new IntersectionObserver((es) => { for (const e of es) if (e.isIntersecting) setOn(+e.target.dataset.i); }, { rootMargin: '-42% 0px -48% 0px' });
    rows.current.forEach((r) => r && io.observe(r));
    return () => io.disconnect();
  }, []);
  return (
    <section className="xp-sec xbs-why" aria-label="The fastest path in.">
      <div className="xp-wrap xbs-why-g">
        <div className="xbs-stage-w"><div className="xbs-stage xbs-ink" aria-hidden="true">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={on} className="xbs-scene" initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -12, transition: { duration: 0.18 } }} transition={{ duration: 0.45, ease: EASE }}>
              <Scene i={on} seats={seats} />
            </motion.div>
          </AnimatePresence>
          <div className="xbs-pips">{PROMISES.map((_, k) => <i key={k} className={k === on ? 'on' : ''} />)}</div>
        </div></div>
        <ol className="xbs-ledger">
          {PROMISES.map(([b, t], i) => (
            <li key={b} ref={(el) => { rows.current[i] = el; }} data-i={i} className={i === on ? 'on' : ''} onMouseEnter={() => setOn(i)} onFocus={() => setOn(i)} tabIndex={-1}>
              <i className="xbs-mark" aria-hidden="true" />
              <strong className="xp-title">{b}</strong>
              <span className="xp-body">{t}</span>
              {/* under 900px the scenes stack: each promise carries its own small card, nothing pinned over the list */}
              <motion.div className="xbs-pcard xbs-ink" aria-hidden="true" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.5, ease: EASE }}>
                <div className="xbs-scene"><Scene i={i} seats={seats} /></div>
              </motion.div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* One solid at a time, from the first paint: BuyingSpecialist.css outlines the header's ask on this route unless
   <html> carries data-xbs-solid. This hook sets that flag only while none of the page's own solid asks (the phone
   quote's, the sheet's, the closing band's) is on screen. It re-reads the DOM each time, because the chat swaps the
   phone quote out and the sheet's ask changes with the plan. */
function useQuietHeader() {
  useEffect(() => {
    const H = document.documentElement;
    let raf = 0;
    const check = () => {
      raf = 0;
      const on = [...document.querySelectorAll('main.xbs .x-btn.solid, main.xbs .x-band a')].some((el) => {
        const r = el.getBoundingClientRect();
        return r.height > 0 && r.bottom > 0 && r.top < innerHeight;
      });
      if (on) delete H.dataset.xbsSolid; else H.dataset.xbsSolid = '';
    };
    const ask = () => { if (!raf) raf = requestAnimationFrame(check); };
    addEventListener('scroll', ask, { passive: true }); addEventListener('resize', ask);
    const t = setInterval(ask, 1000); // the chat can swap asks in or out without a scroll
    check();
    return () => { removeEventListener('scroll', ask); removeEventListener('resize', ask); clearInterval(t); cancelAnimationFrame(raf); delete H.dataset.xbsSolid; };
  }, []);
}

/* Phone only: once the sheet's own ask has gone by, a slim bar under the thumb carries "Start Team Plan →" with the
   sheet's live figures beside it. It steps aside for the sheet's button, the closing band, the footer and the keyboard. */
function Dock({ seats, plan }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const mq = matchMedia('(max-width: 700px)');
    let raf = 0;
    const inView = (sel) => [...document.querySelectorAll(sel)].some((el) => { const r = el.getBoundingClientRect(); return r.height > 0 && r.top < innerHeight && r.bottom > 0; });
    const check = () => {
      raf = 0;
      const typing = document.activeElement?.matches?.('input[type="text"], textarea');
      setOn(mq.matches && scrollY > innerHeight * 0.75 && !typing && !inView('.xbs-start, #xbs-sheet, .x-band, footer, .x-cookie'));
    };
    const ask = () => { if (!raf) raf = requestAnimationFrame(check); };
    addEventListener('scroll', ask, { passive: true }); addEventListener('resize', ask); addEventListener('focusin', ask); addEventListener('focusout', ask); mq.addEventListener('change', ask);
    const t = setInterval(ask, 1500); // the cookie note can leave without a scroll
    check();
    return () => { removeEventListener('scroll', ask); removeEventListener('resize', ask); removeEventListener('focusin', ask); removeEventListener('focusout', ask); mq.removeEventListener('change', ask); clearInterval(t); cancelAnimationFrame(raf); };
  }, []);
  return (
    <AnimatePresence>
      {on && (
        <motion.div className="xbs-dock" data-dock initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%', transition: { duration: 0.2 } }} transition={{ duration: 0.4, ease: EASE }}>
          <a className="xbs-dock-q x-mono" href="#xbs-sheet" aria-label={`${plan === 'ent' ? 'Enterprise' : 'Hanzo Team'} Configuration, ${seats} members`}><b><Roll v={seats} /></b> members <b><Roll v={usd(r2(seats * (plan === 'ent' ? P.ent : P.std) / 12))} /></b>/mo</a>
          {plan === 'ent'
            ? <Cta to="/enterprise/start" id="buying-specialist.dock" kind="quiet" size="sm" className="xbs-dock-go">Start Enterprise Plan →</Cta>
            : <Cta to={teamUrl(seats)} id="buying-specialist.dock" kind="quiet" size="sm" className="xbs-dock-go">Start Team Plan →</Cta>}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function BuyingSpecialist() {
  const [name, setName] = useState('there');
  const [msgs, setMsgs] = useState([]);
  const [busy, setBusy] = useState(false);
  const [val, setVal] = useState('');
  const [seats, setSeats] = useState(10);
  const [plan, setPlan] = useState('team');
  const cycle = useRef(0);
  const ask = useRef(null);
  const [own, setOwn] = useState(false);
  const end = useRef(null);
  const desk = useRef(null);
  const seen = useInView(desk, { amount: 0.2 });
  const calm = useReducedMotion();
  const started = msgs.length > 0;
  useQuietHeader();

  useEffect(() => { const n = new URLSearchParams(location.search).get('name'); if (n && n.trim()) setName(n.trim().slice(0, 40)); }, []);
  // keep the question just asked in view: the newest message of yours lands at the top, its answer arrives under it
  useEffect(() => {
    if (!started) return;
    // wait for the greeting to finish leaving (0.25s), so the target does not move under the scroll
    const t = setTimeout(() => {
      const mine = document.querySelectorAll('.xbs-log li.me');
      const el = mine[mine.length - 1];
      if (el) scrollToEl(el, { offset: -100, immediate: !!calm });
    }, 320);
    return () => clearTimeout(t);
  }, [msgs.length, started, calm]);
  // the sheet re-prices itself (4, 10, 25, 50 members) until you or the chat set it
  useEffect(() => {
    if (own || calm || !seen) return;
    const STEPS = [10, 25, 50, 4, 10]; // one cycle through, then it rests on 10
    const i = STEPS.indexOf(seats, cycle.current);
    if (i < 0 || i >= STEPS.length - 1) return;
    const t = setTimeout(() => { cycle.current = i + 1; setSeats(STEPS[i + 1]); }, i === 0 ? 900 : 2400); // the first move lands inside a second
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
    // the answer's plan moves the one quote card; no second card is printed in the chat
    if (w.quote) { setOwn(true); setPlan(w.quote.plan === 'Enterprise' ? 'ent' : 'team'); setSeats(w.quote.plan === 'Enterprise' ? w.quote.seats : Math.min(100, w.quote.seats)); }
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
                  <LineReveal as="h1" id="xbs-h1" className="xp-display xbs-h1" lines={[`Hi ${name}, let's find`, 'the right plan', 'for your team.']} />
                  <motion.p className="xp-lede xbs-lede" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE, delay: 0.3 }}>I&apos;m an AI buying specialist, here to help you figure out which plan fits, what it&apos;ll cost, and how to get your team set up. We can do all of it right here.</motion.p>
                  <div className="xbs-mini xbs-ink">
                    <a className="xbs-mini-q" href="#xbs-sheet" aria-label={`Hanzo Team Configuration, ${seats} members`}><span className="x-mono"><b><Roll v={seats} /></b> members</span><span className="x-mono"><b><Roll v={usd(r2(seats * P.std / 12))} /></b>/mo</span><i className="xbs-mini-bar" aria-hidden="true"><b style={{ transform: `scaleX(${seats / 100})` }} /></i></a>
                    <Cta to={teamUrl(seats)} id="buying-specialist.mini" className="xbs-start xbs-mini-go">Start Team Plan →</Cta>
                  </div>
                  <div className="xbs-asks">
                    {ASK.map((t, i) => (
                      <motion.button key={t} type="button" onClick={() => { send(t); setTimeout(() => ask.current?.focus({ preventScroll: true }), 60); }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE, delay: 0.5 + i * 0.06 } }} whileTap={{ scale: 0.97, transition: { duration: 0.09 } }}>{`${t} →`}</motion.button>
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
                          {/* one ask for the plan this answer proposes (the quote card beside it has moved to it), one text link */}
                          <div className="xbs-plans">
                            {m.quote?.plan === 'Enterprise'
                              ? <Cta to="/enterprise/start" kind="link" id="buying-specialist.reply">Start Enterprise Plan</Cta>
                              : <Cta to={teamUrl(m.quote?.seats && m.quote.seats <= 100 ? m.quote.seats : 10)} kind="link" id="buying-specialist.reply">Start Team Plan</Cta>}
                            <a className="xbs-call" href="https://cal.com/hanzo" target="_blank" rel="noopener noreferrer">Sales Question? Book at cal.com/hanzo →</a>
                          </div>
                        </div>
                      </>
                    )}
                  </motion.li>
                ))}
                {busy && <li className="ai wait"><span className="xbs-av" aria-hidden="true">✦</span><span className="xbs-dots" role="status">Finding the best plan for your team...</span></li>}
              </ol>
            )}
            <form className={'xbs-composer' + (started ? ' live' : '')} onSubmit={(e) => { e.preventDefault(); if (!val.trim() && started) return; send(); }}>
              <label className="x-sr" htmlFor="xbs-ask">{started ? 'Ask the Buying Specialist a question...' : 'Press enter to get started'}</label>
              <input ref={ask} id="xbs-ask" type="text" value={val} onChange={(e) => setVal(e.target.value)} maxLength={2000} placeholder={started ? 'Ask the Buying Specialist a question...' : 'Press enter to get started'} disabled={busy} />
              <motion.button type="submit" aria-label="Send message" disabled={busy} whileTap={{ scale: 0.97, transition: { duration: 0.09 } }}>
                <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M8 13V3M4 7l4-4 4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </motion.button>
            </form>
            <p className="xbs-legal" ref={end}>By continuing, you agree to our <A to="/privacy">Privacy Policy</A>.</p>
          </div>
          <motion.div className="xbs-side" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE, delay: 0.2 }}>
            <Sheet seats={seats} setSeats={setSeats} mine={() => setOwn(true)} plan={plan} />
          </motion.div>
        </div>
      </section>
      <Promises seats={seats} />
      <Band title="The fastest path in." lede="You'll have a quote and a plan by the end of this conversation." action="Start Team Plan →" to={`/pay/cart?plan=team&interval=year&quantity=${seats}`} />
      <Dock seats={seats} plan={plan} />
    </main>
  );
}
