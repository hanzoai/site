'use client';
/* Founder Program. Its idea is the merge that turns into Pro time.
   Persona: a developer who contributes to Hanzo's public repositories. Goal: claim Pro time for a merged pull request.
   CTA: "Claim a merged pull request" (the claim form on this page). Metric: no id in PLAN-COMPONENTS 1.1 yet (the claim
   sends a marketing lead).
   V2: 8/10 grey deck, no eyebrow; rebuilt around one scrubbed scene: a display hero beside a pull request that merges itself; then the levels as a pinned scene where your scroll merges one, then three pull requests and the Pro time pours in; the repositories as the dark room; a calm claim form; questions.
   Signature: the merge counter, scrubbed by your scroll: a giant count goes 0, 1, 2, 3 merged while Level 1 fills to a
   week of Pro and Level 2 to a month, the level cards lighting as each threshold is crossed.
   Beyond: your level, worked out. Count your merged pull requests and lines merged and see which level they reach,
   from Hanzo's own thresholds (your first merged pull request; three merged pull requests, or 1,000 lines merged).
   Motion: scrubbed merge scene (signature) + line-masked hero type + the hero pull request merging itself.
   0 UI hues. The claim form sends what hanzo.ai sends. Every word is Hanzo's; the open bounties
   are GitHub's, read live. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion, useScroll, useTransform, useMotionValueEvent } from 'motion/react';
import { A, Faq } from '../kit';
import LineReveal from '../v2/LineReveal';
import { SEARCH, ORGS, useBounties, SAY } from './Bounty.github';
import { claim, SUPPORT } from './Founder.claim';
import '../v2/ProgramScale.css';
import './Founder.css';

const EASE = [0.16, 1, 0.3, 1];
const API = 'https://api.hanzo.ai';
const LEVELS = [
  ['Level 1', 'Founding Contributor', 'Your first merged pull request', 'A week of Pro'],
  ['Level 2', 'Founding Builder', 'Three merged pull requests, or 1,000 lines merged', 'A month of Pro, and Hanzo swag'],
];
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const PR_ICON = <svg viewBox="0 0 16 16" width="20" height="20" aria-hidden="true"><circle cx="4" cy="3.5" r="1.8" fill="none" stroke="currentColor" strokeWidth="1.4" /><circle cx="4" cy="12.5" r="1.8" fill="none" stroke="currentColor" strokeWidth="1.4" /><circle cx="12" cy="12.5" r="1.8" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="M4 5.3v5.4M12 10.7V6a2 2 0 0 0-2-2H7.5M9 2.5 7.5 4 9 5.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>;

/* The hero object: a pull request that merges itself while it is on screen. */
function PullRequest() {
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.4 });
  const calm = useReducedMotion();
  const [s, setS] = useState(2); // 0 open, 1 pressing, 2 merged
  useEffect(() => {
    if (calm || !seen) { setS(2); return; }
    let live = true;
    (async () => {
      while (live) {
        setS(0); await wait(2200); if (!live) return;
        setS(1); await wait(300); if (!live) return;
        setS(2); await wait(3200);
      }
    })();
    return () => { live = false; };
  }, [seen, calm]);
  const merged = s === 2;
  return (
    <div className="xfo-pr xp-obj" ref={box} aria-hidden="true">
      <div className="xfo-pr-top">{PR_ICON}<span className="xfo-pr-k">Founder Program</span><span className="x-mono">https://github.com/hanzoai/ui/pull/1</span></div>
      <div className="xfo-diff">
        {[['', 72], ['del', 54], ['add', 80], ['add', 46], ['', 62], ['add', 70], ['', 38]].map(([k, w], i) => (
          <span key={i} className={k}><b>{k === 'add' ? '+' : k === 'del' ? '−' : ''}</b><i style={{ width: w + '%' }} /></span>
        ))}
      </div>
      <div className="xfo-pr-row">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span key={merged ? 'm' : 'o'} className={'xfo-badge' + (merged ? ' merged' : '')} initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -16, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>{PR_ICON}{merged ? 'Merged' : 'Open'}</motion.span>
        </AnimatePresence>
        <span className={'xfo-btn' + (s === 1 ? ' press' : '') + (merged ? ' done' : '')}>{merged ? '✓' : 'Merge'}</span>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="xfo-hero" aria-labelledby="xfo-h1">
      <div className="xp-wrap xp-grid">
        <div className="xfo-copy">
          <LineReveal as="h1" id="xfo-h1" className="xp-display md" lines={['Merge a pull request.', 'Get Pro.']} />
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.4 }}>
            <p className="xp-lede xfo-lede">A merged pull request in a public Hanzo repository earns Pro time, granted by hand by a Hanzo admin.</p>
            <div className="xfo-acts">
              <a href="#claim" className="x-btn solid xp-cta" data-thumb="Claim a merged pull request" data-cta="founder.hero">Claim a merged pull request<i aria-hidden="true">↓</i></a>
              <A to="/bounty" className="xfo-link">Find an issue</A>
            </div>
          </motion.div>
        </div>
        <motion.div className="xfo-hero-obj" initial={{ opacity: 0, y: 60, rotate: 2 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: 1.3, ease: EASE, delay: 0.25 }}>
          <PullRequest />
        </motion.div>
      </div>
    </section>
  );
}

/* The levels as one pinned scene: the scroll merges pull requests, the Pro time pours into each level. */
function Scene() {
  const ref = useRef(null);
  const [pinned, setPinned] = useState(true);
  const [merged, setMerged] = useState(3);
  useEffect(() => {
    const m = matchMedia('(max-width: 900px), (prefers-reduced-motion: reduce)');
    const f = () => setPinned(!m.matches);
    f(); m.addEventListener('change', f);
    return () => m.removeEventListener('change', f);
  }, []);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const p = useTransform(scrollYProgress, (v) => (pinned ? v : 1));
  const count = (v) => (v < 0.12 ? 0 : v < 0.4 ? 1 : v < 0.62 ? 2 : 3);
  useMotionValueEvent(p, 'change', (v) => setMerged(count(v)));
  useEffect(() => { setMerged(count(p.get())); }, [pinned]); // eslint-disable-line react-hooks/exhaustive-deps
  const fill1 = useTransform(p, [0.12, 0.3], [0, 1], { clamp: true });
  const fill2 = useTransform(p, [0.62, 0.85], [0, 1], { clamp: true });
  const lvl = merged >= 3 ? 1 : merged >= 1 ? 0 : -1;
  return (
    <section ref={ref} className={'xfo-scene' + (pinned ? '' : ' flat')} aria-labelledby="xfo-lv-h">
      <div className="xfo-pin">
        <div className="xp-wrap xp-grid xfo-scene-g">
          <div className="xfo-count">
            <h2 id="xfo-lv-h" className="xp-head xfo-lv-h">Founder levels</h2>
            <p className="xfo-big xp-fig" aria-hidden="true">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span key={merged} initial={{ y: '60%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '-60%', opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>{merged}</motion.span>
              </AnimatePresence>
            </p>
            <p className="xfo-big-u x-mono" aria-hidden="true">merged pull requests</p>
            <p className="xp-body xfo-none">Granted by hand by a Hanzo admin once the pull request merges. There is no third level.</p>
          </div>
          <ol className="xfo-lv">
            {LEVELS.map(([l, n, req, e], i) => (
              <li key={l} className={'xfo-lv-c' + (lvl >= i ? ' on' : '')}>
                <span className="xfo-lv-k x-mono">{l}</span>
                <h3 className="xp-head xfo-lv-n">{n}</h3>
                <p className="xp-body">{req}</p>
                <div className="xfo-pour"><motion.i style={{ scaleX: i ? fill2 : fill1 }} /></div>
                <p className="xfo-lv-e"><span aria-hidden="true">✓</span>{e}</p>
              </li>
            ))}
          </ol>
        </div>
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
    <section className="xp-sec tight xfo-mine-s" aria-label="Founder levels">
      <div className="xp-wrap xp-grid">
        <div className="xfo-mine-h" aria-hidden="true">{PR_ICON}</div>
        <div className="xfo-mine">
          <div className="xfo-mine-c">
            <div><span>Merged pull request</span><span className="xfo-st"><button type="button" onClick={() => step(setPrs, prs, -1, 99)} disabled={!prs} aria-label="Fewer merged pull requests">−</button><output className="x-mono" aria-live="polite">{prs}</output><button type="button" onClick={() => step(setPrs, prs, 1, 99)} aria-label="More merged pull requests">+</button></span></div>
            <div><span>lines merged</span><span className="xfo-st"><button type="button" onClick={() => step(setLines, lines, -250, 100000)} disabled={!lines} aria-label="Fewer lines merged">−</button><output className="x-mono" aria-live="polite">{lines.toLocaleString('en-US')}</output><button type="button" onClick={() => step(setLines, lines, 250, 100000)} aria-label="More lines merged">+</button></span></div>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.p key={l} className={'xfo-mine-r' + (l >= 0 ? ' on' : '')} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} aria-live="polite">
              {l < 0 ? <><b>{LEVELS[0][0]}</b><span>{LEVELS[0][2]}</span></> : <><b>{LEVELS[l][0]} · {LEVELS[l][1]}</b><span>{LEVELS[l][3]}</span></>}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function Repos() {
  const st = useBounties();
  const items = st.kind === 'ready' ? st.open.items.slice(0, 5) : [];
  const say = st.kind === 'reading' ? SAY.reading : st.kind === 'unreachable' ? SAY.unreachable : SAY.none;
  return (
    <section className="xp-sec xp-dark xfo-repos" data-room="dark" data-ask-hide aria-labelledby="xfo-open-h">
      <div className="xp-wrap xp-grid">
        <div className="xfo-repos-l">
          <ul className="xfo-orgs" aria-hidden="true">{ORGS.map((o) => <li key={o}>{o}</li>)}</ul>
          <p className="xp-lede xfo-any">Any public repository of {ORGS.join(', ')} counts. The open bounties are scoped to start with.</p>
        </div>
        <div className="xfo-open">
          <h2 id="xfo-open-h" className="xp-title">Open bounties</h2>
          {items.length ? (
            <ul>
              {items.map((it, i) => (
                <motion.li key={it.url} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30, delay: i * 0.06 }}>
                  <a href={it.url} target="_blank" rel="noopener noreferrer"><span className="x-mono">{`${it.repo}#${it.number}`}</span><b>{it.title}</b><i aria-hidden="true">↗</i></a>
                </motion.li>
              ))}
            </ul>
          ) : <p className={'xfo-say' + (st.kind === 'reading' ? ' reading' : '')} role={st.kind === 'reading' ? 'status' : undefined} aria-live="polite">{say}</p>}
          <a className="x-btn xp-ghost xfo-every" href={SEARCH} target="_blank" rel="noopener noreferrer">Every open bounty<i aria-hidden="true">↗</i></a>
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
    <section className="xp-sec xfo-claim" id="claim" aria-labelledby="xfo-claim-h">
      <div className="xp-wrap xp-grid">
        <div className="xfo-claim-l">
          <h2 id="xfo-claim-h" className="xp-display sm">Claim it</h2>
          <p className="xp-lede">Send the merged pull request. A Hanzo admin checks the merge and grants the Pro time by hand to the Hanzo account at your email.</p>
        </div>
        <div className="xfo-claim-r">
          <AnimatePresence mode="wait" initial={false}>
            {st === 'sent' ? (
              <motion.div key="sent" className="xfo-sent" role="status" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
                <span className="xfo-sent-i" aria-hidden="true">{PR_ICON}</span>
                <b>Sent.</b>
                <p>A Hanzo admin checks the merge and writes to {f.email.trim()} once the Pro time is granted.</p>
              </motion.div>
            ) : (
              <motion.form key="form" className="xfo-form" noValidate onSubmit={send} exit={{ opacity: 0, y: -10 }}>
                <label><span>Email of your Hanzo account</span><input id="founder-email" type="email" autoComplete="email" required value={f.email} onChange={on('email')} /></label>
                <label><span>Name</span><input id="founder-name" autoComplete="name" value={f.name} onChange={on('name')} /></label>
                <label><span>GitHub username</span><input id="founder-github" autoComplete="username" required placeholder="octocat" value={f.github} onChange={on('github')} /></label>
                <label className="wide"><span>Merged pull request</span><input id="founder-pull" type="url" required placeholder="https://github.com/hanzoai/ui/pull/1" value={f.pull} onChange={on('pull')} /></label>
                {st === 'refused' && <p className="xfo-refused" role="alert">It did not go through. Send the same to <a href={c.mail}>{SUPPORT}</a> instead.</p>}
                <button type="submit" className="x-btn solid xp-cta xfo-send" data-cta="founder.claim" disabled={!c.ok || st === 'sending'} aria-disabled={!c.ok}>{st === 'sending' ? 'Sending…' : 'Send the claim'}</button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
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
    <main className="xp xfo">
      <Hero />
      <Scene />
      <Mine />
      <Repos />
      <Claim />
      <section className="xp-sec tight xfo-qa" aria-labelledby="xfo-qa-h">
        <div className="xp-wrap xp-grid">
          <h2 id="xfo-qa-h" className="xp-head xfo-qa-h">Questions</h2>
          <div className="xfo-qa-l"><Faq items={QA} /></div>
        </div>
      </section>
    </main>
  );
}
