'use client';
/* Founder Program. Its idea is the merge that turns into Pro time.
   Persona: a developer who contributes to Hanzo's public repositories. Goal: claim Pro time for a merged pull request.
   CTA: "Claim a merged pull request" (the claim form on this page). Metric: lead_submit.
   V2: 8/10 MASTER scale: a 52px hero beside a pull request that merges once and stays merged; the levels as a pinned scene where your scroll merges one, then three pull requests, the count growing 64→112px while it is the moment (on the phone it counts 0, 1, 3 once); the + and − drive the level at full size; the repositories as the dark room; questions; the claim last, with kit Fields that mark what is wrong.
   Signature: the merge counter, scrubbed by your scroll: a giant count goes 0, 1, 2, 3 merged while Level 1 fills to a
   week of Pro and Level 2 to a month, the level cards lighting as each threshold is crossed.
   Beyond: your level, worked out. Count your merged pull requests and lines merged and see which level they reach,
   from Hanzo's own thresholds (your first merged pull request; three merged pull requests, or 1,000 lines merged).
   Motion: scrubbed merge scene with the growing count (signature) + line-masked hero type + the hero pull request
   merging once.
   0 UI hues. The claim form sends what hanzo.ai sends. Every word is Hanzo's; the open bounties
   are GitHub's, read live. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion, useScroll, useTransform, useMotionValueEvent } from 'motion/react';
import { A, Cta, Faq, Field } from '../kit';
import LineReveal, { NoJs } from '../v2/LineReveal';
import { SEARCH, ORGS, useBounties, SAY } from './Bounty.github';
import { claim, SUPPORT } from './Founder.claim';
import '../v2/ProgramScale.css';
import usePhoneAsk from './usePhoneAsk';
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
  const [s, setS] = useState(0); // 0 open, 1 pressing, 2 merged: it merges once, the first time it is seen, and stays merged
  const done = useRef(false);
  useEffect(() => {
    if (calm) { setS(2); return; }
    if (!seen || done.current) return;
    done.current = true;
    let live = true;
    (async () => { await wait(900); if (!live) return; setS(1); await wait(150); if (!live) return; setS(2); })();
    return () => { live = false; done.current = false; };
  }, [seen, calm]);
  const merged = s === 2;
  // a fine pointer tilts the card a little (2.5° at most); it lies flat on leave, and never under reduced motion
  const tilt = (e) => {
    const el = box.current;
    if (!el || calm || e.pointerType !== 'mouse' || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--ry', (((e.clientX - r.left) / r.width - 0.5) * 5).toFixed(2) + 'deg');
    el.style.setProperty('--rx', ((0.5 - (e.clientY - r.top) / r.height) * 5).toFixed(2) + 'deg');
  };
  const flat = () => { box.current?.style.setProperty('--rx', '0deg'); box.current?.style.setProperty('--ry', '0deg'); };
  return (
    <div className={'xfo-pr xp-obj' + (seen || calm ? ' go' : '') + (merged ? ' merged' : '')} ref={box} aria-hidden="true" onPointerMove={tilt} onPointerLeave={flat}>
      <div className="xfo-pr-top">{PR_ICON}<span className="xfo-pr-k">Founder Program</span><span className="x-mono">https://github.com/hanzoai/ui/pull/1</span></div>
      <div className="xfo-diff">
        {[['', 72], ['del', 54], ['add', 80], ['add', 46], ['', 62], ['add', 70], ['', 38]].map(([k, w], i) => (
          <span key={i} className={k}><b>{k === 'add' ? '+' : k === 'del' ? '−' : ''}</b><i style={{ width: w + '%' }} /></span>
        ))}
      </div>
      <div className="xfo-pr-row">
        <span className="xfo-slot">
          <AnimatePresence initial={false}>
            <motion.span key={merged ? 'm' : 'o'} className={'xfo-badge' + (merged ? ' merged' : '')} initial={{ y: '110%' }} animate={{ y: 0 }} exit={{ y: '-110%' }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>{PR_ICON}{merged ? 'Merged' : 'Open'}</motion.span>
          </AnimatePresence>
        </span>
        <span className={'xfo-btn' + (s === 1 ? ' press' : '') + (merged ? ' done' : '')}>{merged ? <svg className="xfo-tick" viewBox="0 0 24 24" width="22" height="22"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg> : 'Merge'}</span>
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
          <motion.div initial={{ y: 16 }} animate={{ y: 0 }} transition={{ duration: 0.5, ease: EASE, delay: 0.3 }}>
            <p className="xp-lede xfo-lede">A merged pull request in a public Hanzo repository earns Pro time, granted by hand by a Hanzo admin.</p>
            <div className="xfo-acts">
              <Cta to="/founder#claim" id="founder.hero" thumb className="xp-cta">Claim a merged pull request</Cta>
              <A to="/bounty" className="xfo-link">Find an issue</A>
            </div>
          </motion.div>
        </div>
        <motion.div className="xfo-hero-obj" initial={{ y: 40 }} animate={{ y: 0 }} transition={{ duration: 0.5, ease: EASE, delay: 0.2 }}>
          <PullRequest />
        </motion.div>
      </div>
    </section>
  );
}

/* The levels as one pinned scene: the scroll merges pull requests, the Pro time pours into each level, and the count
   grows from 64px to 112px while it is the moment. On the phone (and with reduced motion) the scene lies flat and the
   count runs 0, 1, 3 once, the first time it is seen. */
function Scene() {
  const ref = useRef(null);
  const fig = useRef(null);
  const calm = useReducedMotion();
  const [pinned, setPinned] = useState(true);
  const [merged, setMerged] = useState(3);
  const [ran, setRan] = useState(false);
  const inView = useInView(fig, { once: true, amount: 0.6 });
  useEffect(() => {
    const m = matchMedia('(max-width: 900px), (prefers-reduced-motion: reduce)');
    const f = () => setPinned(!m.matches);
    f(); m.addEventListener('change', f);
    return () => m.removeEventListener('change', f);
  }, []);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const p = useTransform(scrollYProgress, (v) => (pinned ? v : 1));
  const grow = useTransform(p, [0, 0.62], [0.57, 1], { clamp: true });
  const count = (v) => (v < 0.12 ? 0 : v < 0.4 ? 1 : v < 0.62 ? 2 : 3);
  useMotionValueEvent(p, 'change', (v) => { if (pinned) setMerged(count(v)); });
  useEffect(() => { if (pinned) setMerged(count(p.get())); }, [pinned]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (pinned || calm || !inView || ran) return;
    setRan(true);
    setMerged(0);
    const t1 = setTimeout(() => setMerged(1), 500);
    const t2 = setTimeout(() => setMerged(3), 1300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [pinned, calm, inView]); // eslint-disable-line react-hooks/exhaustive-deps
  const fill1 = useTransform(p, [0.12, 0.3], [0, 1], { clamp: true });
  const fill2 = useTransform(p, [0.62, 0.85], [0, 1], { clamp: true });
  const lvl = merged >= 3 ? 1 : merged >= 1 ? 0 : -1;
  return (
    <section ref={ref} className={'xfo-scene' + (pinned ? '' : ' flat')} aria-labelledby="xfo-lv-h">
      <div className="xfo-pin">
        <div className="xp-wrap xp-grid xfo-scene-g">
          <div className="xfo-count">
            <h2 id="xfo-lv-h" className="xp-head xfo-lv-h">Founder levels</h2>
            <motion.p ref={fig} className="xfo-big xp-fig" aria-hidden="true" style={pinned ? { scale: grow } : undefined}>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span key={merged} initial={{ y: '60%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '-60%', opacity: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>{merged}</motion.span>
              </AnimatePresence>
            </motion.p>
            <p className="xfo-big-u x-mono" aria-hidden="true">merged pull requests</p>
            <p className="xp-body xfo-none">Granted by hand by a Hanzo admin once the pull request merges. There is no third level.</p>
          </div>
          <ol className="xfo-lv">
            {LEVELS.map(([l, n, req, e], i) => (
              <li key={l} className={'xfo-lv-c' + (lvl >= i ? ' on' : '')}>
                <span className="xfo-lv-k x-mono">{l}</span>
                <h3 className="xp-head xfo-lv-n">{n}</h3>
                <p className="xp-body">{req}</p>
                <div className="xfo-pour"><motion.i style={{ scaleX: pinned ? (i ? fill2 : fill1) : (lvl >= i ? 1 : 0) }} /></div>
                <p className="xfo-lv-e"><span aria-hidden="true">✓</span><span className="xfo-lv-et">{e}</span></p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* Count yours: the + and - drive the level, shown at full size beside them. */
function Mine() {
  const [prs, setPrs] = useState(1); // picks up where the scene's count left the first level: one merged pull request
  const [lines, setLines] = useState(0);
  const l = prs >= 3 || (prs >= 1 && lines >= 1000) ? 1 : prs >= 1 ? 0 : -1;
  const step = (set, v, d, max) => set(Math.max(0, Math.min(max, v + d)));
  return (
    <section className="xp-sec tight xfo-mine-s" aria-label="Founder levels">
      <div className="xp-wrap xp-grid">
        <div className="xfo-mine-big" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p key={l} className={'xfo-mine-r' + (l >= 0 ? ' on' : '')} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
              {l < 0 ? <><b>{LEVELS[0][0]}</b><span>{LEVELS[0][2]}</span></> : <><b>{LEVELS[l][1]}</b><span>{`${LEVELS[l][0]} · ${LEVELS[l][3]}`}</span></>}
            </motion.p>
          </AnimatePresence>
        </div>
        <div className="xfo-mine">
          <div className="xfo-mine-c">
            <div><span>Merged pull request</span><span className="xfo-st"><button type="button" data-sound="tick" onClick={() => step(setPrs, prs, -1, 99)} disabled={!prs} aria-label="Fewer merged pull requests">−</button><output className="x-mono" aria-live="polite"><AnimatePresence mode="popLayout" initial={false}><motion.span key={prs} className="xfo-roll" initial={{ y: '70%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '-70%', opacity: 0 }} transition={{ duration: 0.2, ease: EASE }}>{prs}</motion.span></AnimatePresence></output><button type="button" data-sound="tick" onClick={() => step(setPrs, prs, 1, 99)} aria-label="More merged pull requests">+</button></span></div>
            <div><span>lines merged</span><span className="xfo-st"><button type="button" data-sound="tick" onClick={() => step(setLines, lines, -250, 100000)} disabled={!lines} aria-label="Fewer lines merged">−</button><output className="x-mono" aria-live="polite"><AnimatePresence mode="popLayout" initial={false}><motion.span key={lines} className="xfo-roll" initial={{ y: '70%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '-70%', opacity: 0 }} transition={{ duration: 0.2, ease: EASE }}>{lines.toLocaleString('en-US')}</motion.span></AnimatePresence></output><button type="button" data-sound="tick" onClick={() => step(setLines, lines, 250, 100000)} aria-label="More lines merged">+</button></span></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Repos() {
  const st = useBounties();
  const room = useRef(null);
  const lit = useInView(room, { once: true, amount: 0.35 }); // the org names light one at a time, once, as the room enters
  const items = st.kind === 'ready' ? st.open.items.slice(0, 5) : [];
  const say = st.kind === 'reading' ? SAY.reading : st.kind === 'unreachable' ? SAY.unreachable : SAY.none;
  return (
    <section ref={room} className={'xp-sec xp-dark xfo-repos' + (lit ? ' lit' : '')} data-room="dark" aria-labelledby="xfo-open-h">
      <div className="xp-wrap xp-grid">
        <div className="xfo-repos-l">
          <ul className="xfo-orgs" aria-hidden="true">{ORGS.map((o, i) => <li key={o} style={{ '--i': i }}>{o}</li>)}</ul>
          <p className="xp-lede xfo-any">Any public repository of {ORGS.join(', ')} counts. The open bounties are scoped to start with.</p>
        </div>
        <div className="xfo-open">
          <h2 id="xfo-open-h" className="xp-title">Open bounties</h2>
          <div className="xfo-list">
          {items.length ? (
            <ul>
              {items.map((it, i) => (
                <motion.li key={it.url} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1], delay: i * 0.06 }}>
                  <a href={it.url} target="_blank" rel="noopener noreferrer"><span className="x-mono">{`${it.repo}#${it.number}`}</span><b>{it.title}</b><i aria-hidden="true">↗</i></a>
                </motion.li>
              ))}
            </ul>
          ) : <p className={'xfo-say' + (st.kind === 'reading' ? ' reading' : '')} role={st.kind === 'reading' ? 'status' : undefined} aria-live="polite">{say}</p>}
          </div>
          <Cta to={SEARCH} kind="quiet" id="founder.bounties" className="xp-ghost xfo-every">Every open bounty</Cta>
        </div>
      </div>
    </section>
  );
}

/* The claim: Hanzo's fields through the kit Field. Wrong fields turn dashed and the first takes focus; nothing is sent
   until all are right. Sent and refused speak only in Hanzo's own sentences. */
function Claim() {
  const [f, setF] = useState({ email: '', name: '', github: '', pull: '' });
  const [st, setSt] = useState('idle'); // idle | sending | sent | refused
  const [tried, setTried] = useState(false);
  const [msgs, setMsgs] = useState({});
  const form = useRef(null);
  const out = useRef(null);
  const c = claim(f);
  const on = (k) => (e) => setF((o) => ({ ...o, [k]: e.target.value }));
  useEffect(() => { if (st === 'sent' || st === 'refused') out.current?.focus(); }, [st]);
  const send = async (e) => {
    e.preventDefault();
    if (st === 'sending') return;
    if (!c.ok) {
      setTried(true);
      // say why on submit, in the browser's own words for that field (no invented copy)
      const m = {};
      ['email', 'github', 'pull'].forEach((k) => { if (c.bad[k]) m[k] = form.current?.querySelector(`[name="${k}"]`)?.validationMessage || ''; });
      setMsgs(m);
      const first = ['email', 'github', 'pull'].find((k) => c.bad[k]);
      form.current?.querySelector(`[name="${first}"]`)?.focus();
      return;
    }
    setSt('sending');
    try {
      const r = await fetch(`${API}/v1/marketing/leads`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(c.lead) });
      fetch(`${API}/v1/form/public/hanzo.founder-apply/responses`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(c.form) }).catch(() => {});
      setSt(r.ok ? 'sent' : 'refused');
    } catch { setSt('refused'); }
  };
  const bad = (k) => (tried && c.bad[k] ? 'true' : undefined);
  const why = (k) => (tried && c.bad[k] ? msgs[k] || undefined : undefined);
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
              <motion.div key="sent" ref={out} tabIndex={-1} className="xfo-sent" role="status" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
                <span className="xfo-sent-i" aria-hidden="true">{PR_ICON}</span>
                <span className="x-mono xfo-sent-u">{c.pull}</span>
                <p>Granted by hand by a Hanzo admin once the pull request merges.</p>
              </motion.div>
            ) : (
              <motion.form key="form" ref={form} className="xfo-form" noValidate onSubmit={send} exit={{ opacity: 0, y: -10, transition: { duration: 0.15 } }}>
                <Field className="wide" label={<span>Email of your Hanzo account</span>} name="email" type="email" required autoComplete="email" aria-required="true" aria-invalid={bad('email')} error={why('email')} value={f.email} onChange={on('email')} />
                <Field label="Name" name="name" autoComplete="name" value={f.name} onChange={on('name')} />
                <Field label={<span>GitHub username</span>} name="github" autoComplete="username" required pattern="[A-Za-z0-9\-]{1,39}" aria-required="true" aria-invalid={bad('github')} error={why('github')} placeholder="octocat" value={f.github} onChange={on('github')} />
                <Field className="wide" label={<span>Merged pull request</span>} name="pull" type="url" required pattern="https://github\.com/.+/pull/[0-9]+.*" aria-required="true" aria-invalid={bad('pull')} error={why('pull')} placeholder="https://github.com/hanzoai/ui/pull/1" value={f.pull} onChange={on('pull')} />
                {st === 'refused' && <p className="xfo-refused" ref={out} tabIndex={-1} role="alert"><span>Write to</span> <a href={c.mail}>{SUPPORT}</a> <span>with the address of the pull request.</span></p>}
                <div className="xfo-send-row">
                  <Cta type="submit" id="founder.claim" busy={st === 'sending'} className="xp-cta xfo-send">Send the claim</Cta>
                  <A to="https://hanzo.ai/privacy" className="xfo-priv">Privacy Policy</A>
                </div>
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
  ['Where do I ask about a claim?', <><span>Write to</span> <a href={`mailto:${SUPPORT}`}>{SUPPORT}</a> <span>with the address of the pull request.</span></>],
];

export default function Founder() {
  usePhoneAsk();
  return (
    <main className="xp xfo">
      <NoJs />
      <noscript><style>{'.xfo-scene{height:auto!important;padding:96px 0}.xfo-pin{position:static!important;height:auto!important}'}</style></noscript>
      <Hero />
      <Scene />
      <Mine />
      <Repos />
      <section className="xp-sec tight xfo-qa" aria-labelledby="xfo-qa-h">
        <div className="xp-wrap xp-grid">
          <h2 id="xfo-qa-h" className="xp-head xfo-qa-h">Questions</h2>
          <div className="xfo-qa-l"><Faq items={QA} /></div>
        </div>
      </section>
      <Claim />
    </main>
  );
}
