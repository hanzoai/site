'use client';
/* /support. V2: 8/10 Utility, answer-as-you-type, on Hanzo's deck: one line of display type, a search pill, and under
   it the answer, the best of Hanzo's six ways to get help, set large with its own action; beside it the six ways as
   a live list that re-orders on finished words; a closing Band with the enterprise line and its one email ask.
   Persona: a customer or developer who needs help now. Goal: reach the right door in one step.
   CTA: "Open Help Center" (https://hanzo.help), data-cta support.answer.1; metric: the one contact click.
   Signature: help that answers as you type. Each finished word (a space, or 300ms without typing) re-ranks the six
   ways: the list re-orders, the best one rises into the answer card with the words that matched marked, an Enter
   away. One letter, or a half word, changes nothing. Once the headline has landed, the pill types one of Hanzo's own
   phrases, "support ticket", which marks the Help Center's own words and leaves the ask on Open Help Center; pointer or
   focus anywhere in the hero stops it at once, and it has a Pause.
   Supporting (3): masked kinetic headline, once, after the curtain has cleared the top; the list re-ordering; the
   answer panes lifting in.
   Beyond: whatever you typed becomes the subject line of a ready-to-send email to support@hanzo.ai; when a finished
   word matches nothing on the page, the answer itself turns into that email, your words shown as its subject.
   Deletes: the green accent; the Support eyebrow over the h1; the invented labels; the giant 01–06 numerals; the ↵
   glyphs and the dead ↵ circle; the placeholder that repeated the h1; the square focus box inside the pill; the demo
   that swapped the ask; springs; six raw .x-btn (now Go); the custom dark room (now the kit Band); the opacity-0
   panes that took taps before hydration. */
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { A, Go, Band } from '../kit';
import MaskLines from './company/MaskLines';
import useArrived from './company/useArrived';
import '../v2/vc-type.css';
import './company/deck.css';
import './Support.css';

const EM = [0.16, 1, 0.3, 1]; // deck ease-emphasis
const IO = [0.4, 0, 0.2, 1]; // deck ease-in-out
const DOORS = [
  { t: 'Help Center', d: 'Search answers, browse guides, and open a support ticket. The fastest path to a resolution.', go: 'Open Help Center', to: 'https://hanzo.help' },
  { t: 'Documentation', d: 'Guides, API references, and quickstarts for every product across the Hanzo Cloud.', go: 'Read the docs', to: 'https://docs.hanzo.ai' },
  { t: 'System Status', d: 'Live uptime and incident history for every Hanzo service. Check here first if something feels off.', go: 'View status', to: 'https://status.hanzo.ai' },
  { t: 'Community', d: 'Ask questions and share what you build with other developers on the Hanzo Discord and Community.', go: 'Join the community', to: 'https://discord.gg/XthHQQj' },
  { t: 'GitHub', d: 'Report a bug, request a feature, or contribute — our SDKs and tooling are open source.', go: 'Open an issue', to: 'https://github.com/hanzoai' },
  { t: 'Email us', d: 'Prefer email? Reach the team directly and we’ll get back to you.', go: 'support@hanzo.ai', to: 'mailto:support@hanzo.ai' },
];
const DEMO = 'support ticket'; // Hanzo's own words, from the Help Center's line: the ask stays Open Help Center
// JS off: all six answers readable in order; the demo's pause steps aside (PLAN 2.3)
const NOJS = { __html: '<style>.xsp-panes{display:flex!important;flex-direction:column;gap:40px}.xsp-pane{opacity:1!important;transform:none!important;visibility:visible!important;pointer-events:auto!important}.xsp-pause{display:none!important}.xsp-in,.xsp-up{animation:none!important}.xsp .x-band .x-word,.xsp .x-band [style]{opacity:1!important;transform:none!important;filter:none!important}</style>' };

const words = (s) => s.toLowerCase().match(/[a-z0-9]+/g) || [];
const terms = (q) => words(q).filter((w) => w.length > 2); // one letter or two is not a search yet
// a query word matches a page word that starts with it, or (4+ letters) one it starts with: "tickets" finds "ticket"
const hits = (w, h) => h.startsWith(w) || (w.length >= 4 && h.length >= 4 && w.startsWith(h));
function rank(q) {
  const qs = terms(q);
  return DOORS.map((d, i) => {
    const hay = words(d.t + ' ' + d.d + ' ' + d.go);
    const score = qs.reduce((n, w) => n + (hay.some((h) => hits(w, h)) ? 1 : 0), 0);
    return { i, score };
  }).sort((a, b) => b.score - a.score || a.i - b.i);
}

/* A description with the words the query matched marked (the mark is drawn, so no word moves). */
function Lit({ text, q }) {
  const qs = terms(q);
  if (!qs.length) return text;
  return text.split(/(\s+)/).map((p, k) => {
    const w = p.toLowerCase().replace(/[^a-z0-9]/g, '');
    return w && qs.some((x) => hits(x, w)) ? <mark key={k}>{p}</mark> : p;
  });
}

const Arrow = () => <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const Mail = () => <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><rect x="2.5" y="4.5" width="15" height="11" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="m3 5.5 7 5.5 7-5.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>;

function mailTo(subject) { return 'mailto:support@hanzo.ai' + (subject ? '?subject=' + encodeURIComponent(subject) : ''); }

/* go: at once on a return visit; 550ms after the arrival curtain starts lifting on a first visit (the top is clear). */
function useGo() {
  const [curtain] = useState(() => typeof document !== 'undefined' && document.documentElement.classList.contains('x-arriving'));
  const ok = useArrived();
  const [go, setGo] = useState(false);
  useEffect(() => {
    if (!ok) return;
    const t = setTimeout(() => setGo(true), curtain ? 550 : 0);
    return () => clearTimeout(t);
  }, [ok, curtain]);
  return [go, curtain];
}

export default function Support() {
  const [q, setQ] = useState(''); // what is in the pill
  const [dq, setDq] = useState(''); // the settled query: finished words only
  const [mine, setMine] = useState(false);
  const [done, setDone] = useState(false); // the demo has played, or was stopped
  const [peek, setPeek] = useState(-1); // a door the pointer or focus is on
  const [hyd, setHyd] = useState(false);
  const [go, curtain] = useGo();
  const input = useRef(null);
  const form = useRef(null);
  const btn = useRef(null);
  const seen = useInView(form, { amount: 0.6 });
  const calm = useReducedMotion();
  useEffect(() => setHyd(true), []);

  // a word is finished at a space, or after 300ms without typing
  useEffect(() => {
    if (/\s$/.test(q) || !q) { setDq(q); return; }
    const t = setTimeout(() => setDq(q), 300);
    return () => clearTimeout(t);
  }, [q]);

  const ranked = useMemo(() => rank(dq), [dq]);
  const typed = terms(dq).length > 0;
  const hit = typed && ranked[0].score > 0;
  const subject = q.trim();
  // the answer: a door you point at; else the best match; with finished words that match nothing, the email door
  const best = peek >= 0 ? peek : hit ? ranked[0].i : mine && typed ? 5 : 0;
  const order = mine ? ranked : DOORS.map((_, i) => ranked.find((r) => r.i === i));

  // the demo, once, after the headline has landed: type Hanzo's phrase, hold, clear, rest
  useEffect(() => {
    if (mine || calm || !seen || done || !go) return;
    let alive = true, timer = 0;
    const el = input.current;
    const sleep = (ms) => new Promise((r) => { timer = setTimeout(r, ms); });
    (async () => {
      await sleep(1200);
      for (let c = 1; c <= DEMO.length && alive; c++) {
        el.value = DEMO.slice(0, c);
        if (DEMO[c] === ' ' || c === DEMO.length) { setQ(el.value); setDq(el.value); }
        await sleep(60 + (c % 4) * 18);
      }
      if (!alive) return;
      await sleep(2600);
      for (let c = DEMO.length; c >= 0 && alive; c--) { el.value = DEMO.slice(0, c); await sleep(14); }
      if (alive) { setQ(''); setDq(''); setDone(true); }
    })();
    return () => { alive = false; clearTimeout(timer); };
  }, [mine, calm, seen, done, go]);

  const stop = () => { if (done || mine) return; setDone(true); if (input.current) input.current.value = ''; setQ(''); setDq(''); };
  const take = () => { if (!mine) { stop(); setMine(true); setDone(true); } };
  const playing = !mine && !done && !calm;
  const live = mine && typed ? DOORS[best].t : '';

  return (
    <main className="vc xsp" style={{ '--acc': '#0a0a0a' }} data-ask-name="Support" data-go={go || undefined}>
      <section className="xsp-hero" aria-labelledby="xsp-h1">
        <div className="vc-grid xsp-hero-g" onFocusCapture={stop} onPointerLeave={() => setPeek(-1)}>
          <div className="xsp-head">
            <MaskLines as="h1" id="xsp-h1" now delay={curtain ? 0.55 : 0.05} lines={['How can we help?']} className="vc-display xsp-h1" />
          </div>

          <div className="xsp-main xsp-up" onPointerEnter={stop}>
            <form role="search" aria-label="Support" ref={form} className="xsp-search" onSubmit={(e) => { e.preventDefault(); if (hit || (mine && typed)) btn.current?.click(); }}>
              <label htmlFor="xsp-q" className="x-sr">How can we help?</label>
              <svg viewBox="0 0 20 20" width="24" height="24" aria-hidden="true"><circle cx="9" cy="9" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="m13.5 13.5 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
              <input id="xsp-q" ref={input} type="search" autoComplete="off" spellCheck="false" enterKeyHint="go"
                onPointerDown={take} onFocus={take} onKeyDown={take}
                onChange={(e) => { setMine(true); setDone(true); setQ(e.target.value); }} />
              {playing && (
                <button type="button" className="xsp-pause" aria-label="Pause" onClick={stop}>
                  <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M5 3.5v9M11 3.5v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                </button>
              )}
            </form>

            <div className="xsp-answer">
              <p className="x-sr" aria-live={mine ? 'polite' : 'off'}>{live}</p>
              <div className="xsp-panes">
                {DOORS.map((d, i) => {
                  const on = i === best;
                  const mail = i === 5;
                  const href = mail ? mailTo(mine ? subject : '') : d.to;
                  return (
                    <motion.div key={d.t} className={'xsp-pane' + (on ? ' on' : '')} initial={false}
                      animate={on ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                      transition={{ duration: on ? 0.3 : 0.15, ease: EM, delay: on ? 0.05 : 0 }}
                      {...(hyd && !on ? { 'aria-hidden': true, inert: true } : {})}>
                      <h2 className="xsp-answer-t">{d.t}</h2>
                      <p className="xsp-answer-d"><Lit text={d.d} q={dq} /></p>
                      {mail && mine && typed && <p className="xsp-subj"><Mail /><span>“{subject}”</span></p>}
                      <div className="xsp-answer-a">
                        <span className="xsp-go" data-cta={'support.answer.' + (i + 1)} {...(i === 0 ? { 'data-thumb': d.go } : {})} ref={on ? (el) => { btn.current = el?.querySelector('a'); } : undefined}>
                          <Go to={href} solid className="xsp-big">{mail && mine && typed ? 'Email support@hanzo.ai' : d.go}</Go>
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          <aside className="xsp-side xsp-in">
            <p className="vc-lede">Answers, docs, live status, and a direct line to the team.</p>
            <ol className="xsp-doors" onPointerEnter={stop}>
              {order.map(({ i, score }) => {
                const o = DOORS[i];
                return (
                  <motion.li key={o.t} layout transition={{ duration: 0.3, ease: IO }} className={i === best ? 'best' : typed && score ? 'match' : ''}>
                    <A to={i === 5 ? mailTo(mine ? subject : '') : o.to} className="xsp-door" onPointerEnter={() => setPeek(i)} onFocus={() => setPeek(i)}>
                      <span className="xsp-door-t">{o.t}</span>
                      <Arrow />
                    </A>
                  </motion.li>
                );
              })}
            </ol>
          </aside>
          <noscript dangerouslySetInnerHTML={NOJS} />
        </div>
      </section>

      <Band title="On an enterprise plan or need a dedicated channel?" action="Email support@hanzo.ai" to="mailto:support@hanzo.ai"
        note={<span className="xsp-note">and we’ll route you to your team.</span>} />
    </main>
  );
}
