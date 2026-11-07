'use client';
/* /support. V2: 8/10 Utility, answer-as-you-type: one line of huge type, a big search pill that types Hanzo's own
   phrases by itself when idle, and under it the answer: the best way to get help, set large, swapping as the words
   change; the six ways to get help as an index that re-ranks for your own typing; one dark closing room. Accent: green.
   Signature: help that answers as you type. The search pill is the hero; every finished word re-ranks Hanzo's six
   ways to get help, and the best one rises into the answer card with the words that matched lit, an Enter away.
   Supporting (3): masked kinetic headline, once; the idle typing demo; the index re-flowing (layout) for your typing.
   Beyond: whatever you typed becomes the subject of an email to support@hanzo.ai, ready to send from your own mail
   app; when nothing on the page matches, the answer itself turns into that email.
   Every word and link is Hanzo's. */
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { A } from '../kit';
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
// the idle demo types Hanzo's own phrases from the doors above
const DEMO = ['support ticket', 'API references', 'incident history', 'report a bug', 'share what you build', 'prefer email'];
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

function mailTo(subject) { return 'mailto:support@hanzo.ai' + (subject ? '?subject=' + encodeURIComponent(subject) : ''); }

export default function Support() {
  const [q, setQ] = useState('');
  const [mine, setMine] = useState(false);
  const input = useRef(null);
  const form = useRef(null);
  const go = useRef(null);
  const seen = useInView(form, { amount: 0.6 });
  const calm = useReducedMotion();
  const ranked = useMemo(() => rank(q), [q]);
  const typed = terms(q).length > 0;
  const hit = typed && ranked[0].score > 0;
  const subject = q.trim();
  // the answer: the best match; with words that match nothing, the email door, carrying what you typed
  const best = hit ? ranked[0].i : mine && subject ? 5 : 0;
  // the demo only lights and dims; the index re-orders for your own typing, so nothing jumps while you read
  const order = mine ? ranked : DOORS.map((_, i) => ranked.find((r) => r.i === i));

  // idle: type each phrase into the pill (text written straight to the input), re-rank on each finished word
  useEffect(() => {
    if (mine || calm || !seen) return;
    let alive = true, k = 0, timer = 0;
    const el = input.current;
    const sleep = (ms) => new Promise((r) => { timer = setTimeout(r, ms); });
    (async () => {
      await sleep(900);
      while (alive) {
        const s = DEMO[k++ % DEMO.length];
        for (let c = 1; c <= s.length && alive; c++) {
          el.value = s.slice(0, c);
          if (s[c] === ' ' || c === s.length) setQ(el.value);
          await sleep(55 + (c % 4) * 18);
        }
        await sleep(2600);
        for (let c = s.length; c >= 0 && alive; c--) { el.value = s.slice(0, c); await sleep(16); }
        if (alive) setQ('');
        await sleep(450);
      }
    })();
    // leaving the pill (scrolled away): clear the demo's words, so the index below is not left dimmed
    return () => { alive = false; clearTimeout(timer); if (el && el.value && document.activeElement !== el) { el.value = ''; setQ(''); } };
  }, [mine, calm, seen]);

  const take = () => { if (!mine) { setMine(true); input.current.value = ''; setQ(''); } };
  const d = DOORS[best];
  const href = best === 5 ? mailTo(mine ? subject : '') : d.to;

  return (
    <main className="vc xsp" style={{ '--acc': '#2fa45e' }}>
      <section className="xsp-hero vc-scene" aria-labelledby="xsp-h1">
        <div className="vc-grid xsp-hero-g">
          <div className="xsp-head">
            <motion.p className="vc-kick acc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, ease: EASE }}>Support</motion.p>
            <MaskLines as="h1" id="xsp-h1" now delay={0.05} lines={['How can we help?']} className="vc-display xsp-h1" />
          </div>

          <div className="xsp-main">
            <motion.form role="search" ref={form} className="xsp-search" onSubmit={(e) => { e.preventDefault(); if (hit || (mine && subject)) go.current?.click(); }}
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.3 }}>
              <label htmlFor="xsp-q" className="x-sr">Search support</label>
              <svg viewBox="0 0 20 20" width="28" height="28" aria-hidden="true"><circle cx="9" cy="9" r="6" fill="none" stroke="currentColor" strokeWidth="1.7" /><path d="m13.5 13.5 4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
              <input id="xsp-q" ref={input} type="search" autoComplete="off" spellCheck="false" placeholder="How can we help?"
                onPointerDown={take} onFocus={take} onKeyDown={take}
                onChange={(e) => { setMine(true); setQ(e.target.value); }} />
              {!mine && <span className="xsp-auto" aria-hidden="true"><i /><i /><i /></span>}
              <kbd className={'xsp-enter' + (hit ? ' on' : '')} aria-hidden="true">↵</kbd>
            </motion.form>

            <motion.div className="xsp-answer vc-obj" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: EASE, delay: 0.45 }}>
              <p className="xsp-status" aria-live={mine ? 'polite' : 'off'}>
                <span className="vc-kick acc">{hit ? 'Best match' : best === 5 ? 'Email us' : 'Start here'}</span>
                <span className="vc-kick vc-num">{pad(best + 1)} / {pad(DOORS.length)}</span>
                <span className="x-sr">{hit ? `Best match: ${d.t}. Press Enter to open it.` : ''}</span>
              </p>
              <motion.div key={best} className="xsp-answer-in" initial={calm ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: EASE }}>
                <p className="xsp-answer-t" aria-hidden="true">{d.t}</p>
                <p className="xsp-answer-d" aria-hidden="true"><Lit text={d.d} q={q} /></p>
              </motion.div>
              <div className="xsp-answer-a">
                <a ref={go} href={href} className="x-btn solid xsp-big" {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                  {best === 5 && mine && subject ? 'Email support@hanzo.ai' : d.go} <kbd aria-hidden="true">↵</kbd>
                </a>
                <span className="xsp-host">{host(d.to)}</span>
              </div>
            </motion.div>
          </div>

          <motion.aside className="xsp-side" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, ease: EASE, delay: 0.7 }}>
            <p className="vc-lede">Answers, docs, live status, and a direct line to the team.</p>
            <div className={'xsp-beyond' + (mine && subject ? ' on' : '')}>
              <span className="vc-kick">From what you typed</span>
              <a href={mailTo(mine ? subject : '')}>
                <span>Email support@hanzo.ai about</span>
                <b>“{mine && subject ? subject : '…'}”</b>
                <Arrow />
              </a>
            </div>
          </motion.aside>
        </div>
      </section>

      <section className="vc-sec tight xsp-ix" aria-label="Every way to get help">
        <div className="vc-grid">
          <ol className="xsp-doors">
            {order.map(({ i, score }, at) => {
              const o = DOORS[i];
              const top = hit && at === 0;
              return (
                <motion.li key={o.t} layout transition={{ type: 'spring', stiffness: 300, damping: 30 }} className={(top ? 'best ' : '') + (typed && !score ? 'dim' : '')}>
                  <A to={o.to} className="xsp-door" {...(i === 0 ? { 'data-thumb': o.go } : {})}>
                    <span className="xsp-n vc-num">{pad(i + 1)}</span>
                    <h2 className="xsp-door-t">{o.t}</h2>
                    <span className="xsp-door-d"><Lit text={o.d} q={q} /></span>
                    <span className="xsp-go">{o.go}<Arrow /></span>
                  </A>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="xsp-ent" data-room="dark">
        <div className="vc-grid">
          <p className="xsp-ent-t">
            On an enterprise plan or need a dedicated channel?{' '}
            <a href="mailto:support@hanzo.ai">Email <span>support@hanzo.ai</span></a>{' '}
            and we’ll route you to your team.
          </p>
        </div>
      </section>
    </main>
  );
}
