'use client';
/* /support. V2: 8/10 Utility, answer-as-you-type, in ink and greys only: one line of huge type, a big search pill,
   and under it the answer: the best way to get help, set large with its giant numeral; beside it Hanzo's six ways to
   get help as a live list that re-ranks as you type; the enterprise line as the one dark room over a slow contour field.
   Persona: a customer or developer who needs help now. Goal: reach the right door in one step.
   CTA: "Open Help Center" (https://hanzo.help), data-cta support.answer; metric: the one contact click.
   Signature: help that answers as you type. Every finished word re-ranks the six ways, the list re-orders on a
   spring, and the best one rises into the answer card with the words that matched marked, an Enter away. On arrival
   the pill types three of Hanzo's own phrases once (with a pause control), then rests empty.
   Supporting (3): masked kinetic headline, once; the list re-ordering (layout); the dark room's contour drift.
   Beyond: whatever you typed becomes the subject line of a ready-to-send email to support@hanzo.ai; when nothing on
   the page matches, the answer itself turns into that email, your words shown as its subject.
   Deletes: the green accent; the "Support" eyebrow over the h1; the invented labels ("Best match", "Start here",
   "From what you typed", "Email support@hanzo.ai about"); the endless typing loop and the bouncing dots; the
   text-only index section (its six ways now live in the hero list); the opacity-0 arrivals that hid copy with JS off. */
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { A } from '../kit';
import Sigil from '../Sigil';
import MaskLines from './company/MaskLines';
import '../v2/vc-type.css';
import './Support.css';

const EASE = [0.16, 1, 0.3, 1];
const DOORS = [
  { t: 'Help Center', d: 'Search answers, browse guides, and open a support ticket. The fastest path to a resolution.', go: 'Open Help Center', to: 'https://hanzo.help' },
  { t: 'Documentation', d: 'Guides, API references, and quickstarts for every product across the Hanzo Cloud.', go: 'Read the docs', to: 'https://docs.hanzo.ai' },
  { t: 'System Status', d: 'Live uptime and incident history for every Hanzo service. Check here first if something feels off.', go: 'View status', to: 'https://status.hanzo.ai' },
  { t: 'Community', d: 'Ask questions and share what you build with other developers on the Hanzo Discord and Community.', go: 'Join the community', to: 'https://discord.gg/XthHQQj' },
  { t: 'GitHub', d: 'Report a bug, request a feature, or contribute — our SDKs and tooling are open source.', go: 'Open an issue', to: 'https://github.com/hanzoai' },
  { t: 'Email us', d: 'Prefer email? Reach the team directly and we’ll get back to you.', go: 'support@hanzo.ai', to: 'mailto:support@hanzo.ai' },
];
// the arrival demo types three of Hanzo's own phrases, once
const DEMO = ['support ticket', 'API references', 'incident history'];
const host = (u) => u.replace(/^mailto:/, '').replace(/^https:\/\//, '');
const pad = (n) => String(n).padStart(2, '0');

const words = (s) => s.toLowerCase().match(/[a-z0-9]+/g) || [];
const terms = (q) => words(q).filter((w) => w.length > 1);
function rank(q) {
  const qs = terms(q);
  return DOORS.map((d, i) => {
    const hay = words(d.t + ' ' + d.d + ' ' + d.go);
    const score = qs.reduce((n, w) => n + (hay.some((h) => h.startsWith(w)) ? 1 : 0), 0);
    return { i, score };
  }).sort((a, b) => b.score - a.score || a.i - b.i);
}

/* A description with the words the query matched marked. */
function Lit({ text, q }) {
  const qs = terms(q);
  if (!qs.length) return text;
  return text.split(/(\s+)/).map((p, k) => {
    const w = p.toLowerCase().replace(/[^a-z0-9]/g, '');
    return w && qs.some((x) => w.startsWith(x)) ? <mark key={k}>{p}</mark> : p;
  });
}

const Arrow = () => <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const Mail = () => <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><rect x="2.5" y="4.5" width="15" height="11" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="m3 5.5 7 5.5 7-5.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>;

function mailTo(subject) { return 'mailto:support@hanzo.ai' + (subject ? '?subject=' + encodeURIComponent(subject) : ''); }

export default function Support() {
  const [q, setQ] = useState('');
  const [mine, setMine] = useState(false);
  const [done, setDone] = useState(false); // the arrival demo has played (or was paused)
  const [peek, setPeek] = useState(-1); // a door the pointer or focus is on
  const input = useRef(null);
  const form = useRef(null);
  const go = useRef(null);
  const seen = useInView(form, { amount: 0.6 });
  const calm = useReducedMotion();
  const ranked = useMemo(() => rank(q), [q]);
  const typed = terms(q).length > 0;
  const hit = typed && ranked[0].score > 0;
  const subject = q.trim();
  // the answer: a door you point at; else the best match; with words that match nothing, the email door, carrying them
  const best = peek >= 0 ? peek : hit ? ranked[0].i : mine && subject ? 5 : 0;
  // the demo only lights and dims; the list re-orders for your own typing, so nothing jumps while you read
  const order = mine ? ranked : DOORS.map((_, i) => ranked.find((r) => r.i === i));

  // arrival: type three phrases into the pill (text written straight to the input), once, then rest empty
  useEffect(() => {
    if (mine || calm || !seen || done) return;
    let alive = true, timer = 0;
    const el = input.current;
    const sleep = (ms) => new Promise((r) => { timer = setTimeout(r, ms); });
    (async () => {
      await sleep(900);
      for (const s of DEMO) {
        for (let c = 1; c <= s.length && alive; c++) {
          el.value = s.slice(0, c);
          if (s[c] === ' ' || c === s.length) setQ(el.value);
          await sleep(55 + (c % 4) * 18);
        }
        if (!alive) return;
        await sleep(1900);
        for (let c = s.length; c >= 0 && alive; c--) { el.value = s.slice(0, c); await sleep(14); }
        if (!alive) return;
        setQ('');
        await sleep(400);
      }
      if (alive) setDone(true);
    })();
    // leaving the pill (scrolled away): clear the demo's words, so the list is not left dimmed
    return () => { alive = false; clearTimeout(timer); if (el && el.value && document.activeElement !== el) { el.value = ''; setQ(''); } };
  }, [mine, calm, seen, done]);

  const take = () => { if (!mine) { setMine(true); setDone(true); input.current.value = ''; setQ(''); } };
  const stop = () => { setDone(true); if (input.current) input.current.value = ''; setQ(''); };
  const playing = !mine && !done && !calm;

  return (
    <main className="vc xsp" style={{ '--acc': '#1d1d1f' }} data-ask-name="Support">
      <section className="xsp-hero vc-scene" aria-labelledby="xsp-h1">
        <div className="vc-grid xsp-hero-g">
          <div className="xsp-head">
            <MaskLines as="h1" id="xsp-h1" now delay={0.05} lines={['How can we help?']} className="vc-display xsp-h1" />
          </div>

          <div className="xsp-main xsp-up">
            <form role="search" aria-label="Support" ref={form} className="xsp-search" onSubmit={(e) => { e.preventDefault(); if (hit || (mine && subject)) go.current?.click(); }}>
              <label htmlFor="xsp-q" className="x-sr">How can we help?</label>
              <svg viewBox="0 0 20 20" width="28" height="28" aria-hidden="true"><circle cx="9" cy="9" r="6" fill="none" stroke="currentColor" strokeWidth="1.7" /><path d="m13.5 13.5 4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
              <input id="xsp-q" ref={input} type="search" autoComplete="off" spellCheck="false" enterKeyHint="go" placeholder="How can we help?"
                onPointerDown={take} onFocus={take} onKeyDown={take}
                onChange={(e) => { setMine(true); setDone(true); setQ(e.target.value); }} />
              {playing && (
                <button type="button" className="xsp-pause" aria-label="Pause" onClick={stop}>
                  <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M5 3.5v9M11 3.5v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                </button>
              )}
              <kbd className={'xsp-enter' + (hit || (mine && subject) ? ' on' : '')} aria-hidden="true">↵</kbd>
            </form>

            <div className="xsp-answer vc-obj">
              <span className="xsp-fig vc-num" aria-hidden="true">
                <motion.span key={best} initial={calm ? false : { y: '60%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>{pad(best + 1)}</motion.span>
              </span>
              <p className="x-sr" aria-live={mine ? 'polite' : 'off'}>{hit ? DOORS[best].t : ''}</p>
              <div className="xsp-panes">
                {DOORS.map((d, i) => {
                  const on = i === best;
                  const mail = i === 5;
                  const href = mail ? mailTo(mine ? subject : '') : d.to;
                  return (
                    <motion.div key={d.t} className="xsp-pane" initial={false}
                      animate={on ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                      transition={{ duration: on ? 0.5 : 0.18, ease: EASE, delay: on ? 0.06 : 0 }}
                      aria-hidden={!on} inert={!on}>
                      <h2 className="xsp-answer-t">{d.t}</h2>
                      <p className="xsp-answer-d"><Lit text={d.d} q={q} /></p>
                      {mail && mine && subject && <p className="xsp-subj"><Mail /><span>“{subject}”</span></p>}
                      <div className="xsp-answer-a">
                        <a ref={on ? go : undefined} href={href} className="x-btn solid xsp-big" data-cta={'support.answer.' + (i + 1)}
                          {...(i === 0 ? { 'data-thumb': d.go } : {})}
                          {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                          {mail && mine && subject ? 'Email support@hanzo.ai' : d.go} <kbd aria-hidden="true">↵</kbd>
                        </a>
                        <span className="xsp-host">{host(d.to)}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          <aside className="xsp-side xsp-in">
            <p className="vc-lede">Answers, docs, live status, and a direct line to the team.</p>
            <ol className="xsp-doors" onPointerLeave={() => setPeek(-1)}>
              {order.map(({ i, score }, at) => {
                const o = DOORS[i];
                const top = (hit && at === 0) || i === best;
                return (
                  <motion.li key={o.t} layout transition={{ type: 'spring', stiffness: 300, damping: 30 }} className={(top ? 'best ' : '') + (typed && !score ? 'dim' : '')}>
                    <A to={i === 5 ? mailTo(mine ? subject : '') : o.to} className="xsp-door" onPointerEnter={() => setPeek(i)} onFocus={() => setPeek(i)} onBlur={() => setPeek(-1)}>
                      <span className="xsp-n vc-num" aria-hidden="true">{pad(i + 1)}</span>
                      <span className="xsp-door-t">{o.t}</span>
                      <span className="xsp-door-h">{host(o.to)}</span>
                      <Arrow />
                    </A>
                  </motion.li>
                );
              })}
            </ol>
          </aside>
        </div>
      </section>

      <section className="xsp-ent" data-room="dark" aria-label="Email support@hanzo.ai">
        <Sigil seed="On an enterprise plan or need a dedicated channel?" data={[6, 24]} className="xsp-ent-s" />
        <div className="vc-grid">
          <p className="xsp-ent-t">
            On an enterprise plan or need a dedicated channel?{' '}
            <a href="mailto:support@hanzo.ai" data-cta="support.enterprise">Email <span>support@hanzo.ai</span></a>{' '}
            and we’ll route you to your team.
          </p>
        </div>
      </section>
    </main>
  );
}
