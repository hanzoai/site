'use client';
/* Support. Signature: help that types. The page is a search box first; as you type (or, idle, as it types Hanzo's own
   phrases), the six ways to get help re-rank under it, the words that matched light up, and the best one is an Enter away.
   Beyond: whatever you typed becomes the subject of an email to support@hanzo.ai, ready to send from your own mail app.
   Every word and link is Hanzo's. */
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { EASE, Rise } from '../ui';
import { A } from '../kit';
import './Support.css';

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

const words = (s) => s.toLowerCase().match(/[a-z0-9]+/g) || [];
const terms = (q) => words(q).filter((w) => w.length > 1);
export function rank(q) {
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

function Desk() {
  const [q, setQ] = useState('');
  const [mine, setMine] = useState(false);
  const input = useRef(null);
  const form = useRef(null);
  const links = useRef([]);
  const seen = useInView(form, { amount: 0.6 });
  const calm = useReducedMotion();
  const ranked = useMemo(() => rank(q), [q]);
  const hit = terms(q).length > 0 && ranked[0].score > 0;
  // the demo only lights and dims; the list re-orders for your own typing, so nothing jumps while you read
  const order = mine ? ranked : DOORS.map((_, i) => ranked.find((r) => r.i === i));
  const top = ranked[0].i;

  // idle: type each phrase into the box (text written straight to the input), re-rank on each finished word
  useEffect(() => {
    if (mine || calm || !seen) return;
    let alive = true, k = 0, timer = 0;
    const el = input.current;
    const sleep = (ms) => new Promise((r) => { timer = setTimeout(r, ms); });
    (async () => {
      while (alive) {
        const s = DEMO[k++ % DEMO.length];
        for (let c = 1; c <= s.length && alive; c++) {
          el.value = s.slice(0, c);
          if (s[c] === ' ' || c === s.length) setQ(el.value);
          await sleep(55 + (c % 4) * 18);
        }
        await sleep(2200);
        for (let c = s.length; c >= 0 && alive; c--) { el.value = s.slice(0, c); await sleep(16); }
        if (alive) setQ('');
        await sleep(450);
      }
    })();
    return () => { alive = false; clearTimeout(timer); };
  }, [mine, calm, seen]);

  const take = () => { if (!mine) { setMine(true); input.current.value = ''; setQ(''); } };
  const subject = q.trim();

  return (
    <div className="xsp-desk">
      <form role="search" ref={form} className="xsp-search" onSubmit={(e) => { e.preventDefault(); if (hit) links.current[top]?.click(); }}>
        <label htmlFor="xsp-q" className="x-sr">Search support</label>
        <svg viewBox="0 0 20 20" width="22" height="22" aria-hidden="true"><circle cx="9" cy="9" r="6" fill="none" stroke="currentColor" strokeWidth="1.7" /><path d="m13.5 13.5 4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
        <input id="xsp-q" ref={input} type="search" autoComplete="off" spellCheck="false" placeholder="How can we help?"
          onPointerDown={take} onFocus={take} onKeyDown={take}
          onChange={(e) => { setMine(true); setQ(e.target.value); }} />
        {!mine && <span className="xsp-auto" aria-hidden="true"><i /><i /><i /></span>}
        <kbd className={'xsp-enter' + (hit ? ' on' : '')} aria-hidden="true">↵</kbd>
      </form>
      <p className="xsp-status" aria-live={mine ? 'polite' : 'off'}>
        {hit ? <>Best match: <b>{DOORS[top].t}</b>. Press Enter to open it.</> : ' '}
      </p>
      <ol className="xsp-doors">
        {order.map(({ i, score }) => {
          const d = DOORS[i];
          const best = hit && i === top;
          return (
            <motion.li key={d.t} layout transition={{ type: 'spring', stiffness: 380, damping: 34 }} className={(best ? 'best ' : '') + (hit && !score ? 'dim' : '')}>
              <A to={d.to} className="xsp-door" ref={(el) => { links.current[i] = el; }} {...(i === 0 ? { "data-thumb": d.go } : {})}>
                <span className="xsp-n x-mono">{String(i + 1).padStart(2, '0')}</span>
                <span className="xsp-body">
                  <h2>{d.t}</h2>
                  <span className="xsp-d"><Lit text={d.d} q={q} /></span>
                </span>
                <span className="xsp-go">{d.go}<i aria-hidden="true">→</i></span>
              </A>
            </motion.li>
          );
        })}
      </ol>
      <div className={'xsp-beyond' + (subject ? ' on' : '')} aria-hidden={!subject}>
        <a href={'mailto:support@hanzo.ai' + (subject ? '?subject=' + encodeURIComponent(subject) : '')} tabIndex={subject ? 0 : -1}>
          <span>Email support@hanzo.ai about</span> <b>“{subject || ' '}”</b><i aria-hidden="true">→</i>
        </a>
      </div>
    </div>
  );
}

export default function Support() {
  return (
    <main className="xsp">
      <section className="xsp-hero" aria-labelledby="xsp-h1">
        <div className="x-wrap">
          <motion.p className="x-kick" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>Support</motion.p>
          <h1 id="xsp-h1" className="xsp-h1"><span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.05 }}>How can we help?</motion.span></span></h1>
          <motion.p className="xsp-lede" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}>Answers, docs, live status, and a direct line to the team.</motion.p>
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: EASE, delay: 0.4 }}>
            <Desk />
          </motion.div>
        </div>
      </section>
      <section className="xsp-ent" data-room="dark">
        <div className="x-wrap">
          <Rise className="xsp-route">
            <span className="xsp-wire" aria-hidden="true"><i /></span>
            <p>
              On an enterprise plan or need a dedicated channel?{' '}
              <a href="mailto:support@hanzo.ai">Email <span>support@hanzo.ai</span></a>{' '}
              and we’ll route you to your team.
            </p>
          </Rise>
        </div>
      </section>
    </main>
  );
}
