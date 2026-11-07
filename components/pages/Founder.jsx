'use client';
/* Founder Program. Its idea is the merge that turns into Pro time.
   Signature: a pull request merges on screen by itself. The Merge button presses, the badge turns Merged, and the Pro
   time it earns pours into a bar: a week of Pro at the first merge (Level 1), a month at the third (Level 2).
   Beyond: your level, worked out. Count your merged pull requests and lines merged and see which level they reach,
   from Hanzo's own thresholds (your first merged pull request; three merged pull requests, or 1,000 lines merged).
   The claim form sends what hanzo.ai sends. Every word is Hanzo's; the open bounties are GitHub's, read live. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { EASE, Rise } from '../ui';
import { A, Go, SecHead, Faq } from '../kit';
import { SEARCH, ORGS, useBounties, SAY } from './Bounty.github';
import { claim, SUPPORT } from './Founder.claim';
import './Founder.css';

const API = 'https://api.hanzo.ai';
const LEVELS = [
  ['Level 1', 'Founding Contributor', 'Your first merged pull request', 'A week of Pro'],
  ['Level 2', 'Founding Builder', 'Three merged pull requests, or 1,000 lines merged', 'A month of Pro, and Hanzo swag'],
];
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/* The merge: open, pressed, merged; one merge earns the week, the third earns the month. */
function Merge() {
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.4 });
  const calm = useReducedMotion();
  const [s, setS] = useState({ merged: 3, press: false, open: false });
  useEffect(() => {
    if (calm || !seen) { setS({ merged: 3, press: false, open: false }); return; }
    let live = true;
    (async () => {
      while (live) {
        for (let m = 1; m <= 3 && live; m++) {
          setS({ merged: m - 1, press: false, open: true }); await wait(m === 1 ? 1100 : 700); if (!live) return;
          setS({ merged: m - 1, press: true, open: true }); await wait(260); if (!live) return;
          setS({ merged: m, press: false, open: false }); await wait(m === 1 ? 1400 : m === 3 ? 1500 : 900);
        }
        await wait(600);
      }
    })();
    return () => { live = false; };
  }, [seen, calm]);
  const lvl = s.merged >= 3 ? 1 : s.merged >= 1 ? 0 : -1;
  return (
    <div className="xfo-merge" ref={box} aria-hidden="true">
      <div className="xfo-pr">
        <div className="xfo-pr-top">
          <svg viewBox="0 0 16 16" width="18" height="18"><circle cx="4" cy="3.5" r="1.8" fill="none" stroke="currentColor" strokeWidth="1.4" /><circle cx="4" cy="12.5" r="1.8" fill="none" stroke="currentColor" strokeWidth="1.4" /><circle cx="12" cy="12.5" r="1.8" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="M4 5.3v5.4M12 10.7V6a2 2 0 0 0-2-2H7.5M9 2.5 7.5 4 9 5.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <span className="x-mono">https://github.com/hanzoai/ui/pull/1</span>
        </div>
        <div className="xfo-pr-row">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span key={s.open ? 'o' : 'm'} className={'xfo-badge' + (s.open ? '' : ' merged')} initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} transition={{ type: 'spring', stiffness: 400, damping: 30 }}>{s.open ? 'Open' : 'Merged'}</motion.span>
          </AnimatePresence>
          <span className={'xfo-btn' + (s.press ? ' press' : '') + (s.open ? '' : ' done')}>{s.open ? 'Merge' : '✓'}</span>
        </div>
        <div className="xfo-count">
          {[0, 1, 2].map((i) => <i key={i} className={i < s.merged ? 'on' : ''} />)}
          <span className="x-mono">{s.merged} merged</span>
        </div>
      </div>
      <div className="xfo-earn">
        {LEVELS.map(([l, n, , e], i) => (
          <div key={l} className={'xfo-earn-row' + (lvl >= i ? ' on' : '')}>
            <span className="xfo-earn-k"><b>{l}</b> {n}</span>
            <span className={'xfo-bar l' + i}><motion.i initial={false} animate={{ scaleX: lvl >= i ? 1 : 0 }} transition={{ duration: lvl >= i ? 1.2 : 0.3, ease: EASE }} /></span>
            <span className="xfo-earn-e">{e}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Hero() {
  const line = (t, d) => <span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: d }}>{t}</motion.span></span>;
  return (
    <section className="xfo-hero" aria-labelledby="xfo-h1">
      <div className="x-wrap xfo-grid">
        <div>
          <motion.p className="x-kick" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>Founder Program</motion.p>
          <h1 id="xfo-h1" className="xfo-h1">{line('Merge a pull request.', 0.05)}{line('Get Pro.', 0.17)}</h1>
          <motion.p className="xfo-lede" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}>A merged pull request in a public Hanzo repository earns Pro time, granted by hand by a Hanzo admin.</motion.p>
          <motion.div className="xfo-acts" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}>
            <motion.a href="#claim" className="x-btn solid" data-thumb="Claim a merged pull request" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>Claim a merged pull request</motion.a>
            <Go to="/bounty">Find an issue</Go>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.2 }}>
          <Merge />
        </motion.div>
      </div>
    </section>
  );
}

/* Count yours: which level do they reach? */
function Mine() {
  const [prs, setPrs] = useState(0);
  const [lines, setLines] = useState(0);
  const l = prs >= 3 || (prs >= 1 && lines >= 1000) ? 1 : prs >= 1 ? 0 : -1;
  const step = (set, v, d, max) => set(Math.max(0, Math.min(max, v + d)));
  return (
    <div className="xfo-mine">
      <h3>Where do yours land?</h3>
      <div className="xfo-mine-c">
        <div><span>Merged pull requests</span><span className="xfo-st"><button type="button" onClick={() => step(setPrs, prs, -1, 99)} disabled={!prs} aria-label="Fewer merged pull requests">−</button><output className="x-mono" aria-live="polite">{prs}</output><button type="button" onClick={() => step(setPrs, prs, 1, 99)} aria-label="More merged pull requests">+</button></span></div>
        <div><span>Lines merged</span><span className="xfo-st"><button type="button" onClick={() => step(setLines, lines, -250, 100000)} disabled={!lines} aria-label="Fewer lines merged">−</button><output className="x-mono" aria-live="polite">{lines.toLocaleString('en-US')}</output><button type="button" onClick={() => step(setLines, lines, 250, 100000)} aria-label="More lines merged">+</button></span></div>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.p key={l} className={'xfo-mine-r' + (l >= 0 ? ' on' : '')} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3, ease: EASE }} aria-live="polite">
          {l < 0 ? 'Level 1 starts at your first merged pull request.' : <><b>{LEVELS[l][0]} · {LEVELS[l][1]}</b><span>{LEVELS[l][3]}</span></>}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

function Levels() {
  return (
    <section className="x-sec xfo-levels">
      <div className="x-wrap">
        <SecHead title="Founder levels" />
        <div className="xfo-lv">
          {LEVELS.map(([l, n, req, e], i) => (
            <Rise key={l} className={'xfo-lv-c l' + i} delay={i * 0.1}>
              <span className="xfo-lv-k x-mono">{l}</span>
              <h3>{n}</h3>
              <p className="xfo-lv-req">{req}</p>
              <p className="xfo-lv-e"><span aria-hidden="true">✓</span>{e}</p>
            </Rise>
          ))}
          <div className="xfo-lv-none"><p>Granted by hand by a Hanzo admin once the pull request merges. There is no third level.</p></div>
        </div>
        <Rise delay={0.1}><Mine /></Rise>
      </div>
    </section>
  );
}

function Repos() {
  const st = useBounties();
  const items = st.kind === 'ready' ? st.open.items.slice(0, 6) : [];
  const say = st.kind === 'reading' ? SAY.reading : st.kind === 'unreachable' ? SAY.unreachable : SAY.none;
  return (
    <section className="x-sec xfo-repos" data-room="dark">
      <div className="x-wrap xfo-repos-in">
        <div>
          <p className="xfo-any">Any public repository of {ORGS.join(', ')} counts. The open bounties are scoped to start with.</p>
          <div className="xfo-orgs" aria-hidden="true">{ORGS.map((o, i) => <span key={o} style={{ '--i': i }}>{o}</span>)}</div>
        </div>
        <div className="xfo-open">
          <h2>Open bounties</h2>
          {items.length ? (
            <ul>
              {items.map((it, i) => (
                <motion.li key={it.url} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, ease: EASE, delay: i * 0.05 }}>
                  <a href={it.url} target="_blank" rel="noopener noreferrer"><span className="x-mono">{`${it.repo}#${it.number}`}</span><b>{it.title}</b><i aria-hidden="true">↗</i></a>
                </motion.li>
              ))}
            </ul>
          ) : <p className={'xfo-say' + (st.kind === 'reading' ? ' reading' : '')} role={st.kind === 'reading' ? 'status' : undefined} aria-live="polite">{say}</p>}
          <a className="x-btn xfo-every" href={SEARCH} target="_blank" rel="noopener noreferrer">Every open bounty ↗</a>
        </div>
      </div>
    </section>
  );
}

function Claim() {
  const [f, setF] = useState({ email: '', name: '', github: '', pull: '' });
  const [st, setSt] = useState('idle'); // idle | sending | sent | refused
  const c = claim(f);
  const on = (k) => (e) => setF((o) => ({ ...o, [k]: e.target.value }));
  const send = async (e) => {
    e.preventDefault();
    if (!c.ok || st === 'sending') return;
    setSt('sending');
    try {
      const r = await fetch(`${API}/v1/marketing/leads`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(c.lead) });
      fetch(`${API}/v1/form/public/hanzo.founder-apply/responses`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(c.form) }).catch(() => {});
      setSt(r.ok ? 'sent' : 'refused');
    } catch { setSt('refused'); }
  };
  return (
    <section className="x-sec xfo-claim" id="claim" aria-labelledby="xfo-claim-h">
      <div className="x-wrap xfo-claim-in">
        <div>
          <h2 id="xfo-claim-h" className="xfo-claim-h">Claim it</h2>
          <p className="xfo-claim-p">Send the merged pull request. A Hanzo admin checks the merge and grants the Pro time by hand to the Hanzo account at your email.</p>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          {st === 'sent' ? (
            <motion.div key="sent" className="xfo-sent" role="status" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.45, ease: EASE }}>
              <b>Sent.</b>
              <p>A Hanzo admin checks the merge and writes to {f.email.trim()} once the Pro time is granted.</p>
            </motion.div>
          ) : (
            <motion.form key="form" className="xfo-form" noValidate onSubmit={send} exit={{ opacity: 0, y: -10 }}>
              <label><span>Email of your Hanzo account</span><input id="founder-email" type="email" autoComplete="email" required value={f.email} onChange={on('email')} /></label>
              <label><span>Name</span><input id="founder-name" autoComplete="name" value={f.name} onChange={on('name')} /></label>
              <label><span>GitHub username</span><input id="founder-github" autoComplete="username" required placeholder="octocat" value={f.github} onChange={on('github')} /></label>
              <label><span>Merged pull request</span><input id="founder-pull" type="url" required placeholder="https://github.com/hanzoai/ui/pull/1" value={f.pull} onChange={on('pull')} /></label>
              {st === 'refused' && <p className="xfo-refused" role="alert">It did not go through. Send the same to <a href={c.mail}>{SUPPORT}</a> instead.</p>}
              <motion.button type="submit" className="x-btn solid xfo-send" disabled={!c.ok || st === 'sending'} aria-disabled={!c.ok} whileTap={c.ok ? { scale: 0.97 } : undefined}>{st === 'sending' ? 'Sending…' : 'Send the claim'}</motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

const QA = [
  ['Who grants the Pro time, and when?', 'A Hanzo admin, by hand, once the pull request has merged and you have sent it with the form on this page. Nothing grants it automatically.'],
  ['Which pull requests count?', `One a maintainer merges into a public repository of ${ORGS.join(', ')}. Level 2 is three merged pull requests, or 1,000 lines merged.`],
  ['Does a bounty pay?', 'No. A bounty is an issue scoped for an outside fix, and the points it names are reputation, not money. Its merged fix counts toward a level like any other pull request.'],
  ['Where do I ask about a claim?', <>Write to <a href={`mailto:${SUPPORT}`}>{SUPPORT}</a> with the address of the pull request.</>],
];

export default function Founder() {
  return (
    <main className="xfo">
      <Hero />
      <Levels />
      <Repos />
      <Claim />
      <section className="x-sec xfo-qa">
        <div className="x-wrap xfo-qa-in">
          <SecHead title="Questions" />
          <Faq items={QA} />
        </div>
      </section>
    </main>
  );
}
