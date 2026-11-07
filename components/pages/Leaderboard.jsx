'use client';
// Persona: a developer or bug hunter who uses Hanzo and wants credits for contributing (arrives from /bounty, GitHub or the header)
// Goal: see how ranks are earned and start on an open bounty
// CTA: Open bounties -> /bounty (hero, the shared sticky ask, closing Band) · data-cta leaderboard.hero / leaderboard.band
// Metric: cta_click on leaderboard.hero (a researcher-or-builder metric: a GitHub or bounty click)
// Signature: every total is a sum that adds itself up: the podium's tape re-adds each hunter's score, then the four ways to earn pin as chapters while a receipt builds a total line by line.
// Beyond: your points, worked out with the page's own rules (+50 a bug, +100 to +500 a merged pull request, +20 a referral, +1 per 100K tokens), and where your tokens would sit on the global board.
/* Leaderboard. Hanzo's own board, as it reads today, told one idea per screen.
   1. A podium as the hero object: the three hunters stand in silver and grey, the lit one in ink; the tape beside it adds the lit
      hunter's total by itself (bounty points, plus one point per 100,000 tokens: 450 + 1,060 = 1,510).
   2. The contributors as an editorial list with huge ranks; the recent rewards open in a sheet.
   3. The one dark room opens from a rounded panel (SceneWipe): the token board, with its scale switch.
   4. How to earn, as four pinned chapters: each rule adds its line to a receipt and the total rolls on.
   5. The Beyond: your points, worked out, and where your tokens would sit on the board.
   Colour: none of its own (JAMES.md): ink, greys and silvers; the lit hunter is the one ink block.
   Motion: idle (the podium lights each hunter in turn and its tape adds up), pointer (rows fill on hover, steps lift),
   state (scale pill, sheet, rolling totals) and scroll (pinned receipt, dark-room wipe, bars drawing, headline masks).
   One ask, Hanzo's "Open bounties": in the hero, sticky after it (AskBar on desktop, the thumb bar on phones), at the close.
   Every name and figure is Hanzo's.
   V2: 8/10 podium hero with a self-adding tape and a pause control, ranks, wiped dark token room, earn rules as pinned chapters building a receipt, calculator, closing Band; MASTER scale rhythm (52/26/64, one 84px moment per screen), greys only, deck easing. */
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { EASE } from '../ui';
import { A, More } from '../kit';
import MaskLines from '../v2/MaskLines';
import PinScenes from '../v2/PinScenes';
import DetailSheet from '../v2/x-pascal/DetailSheet';
import SceneWipe from '../v2/SceneWipe';
import AskBar from '../v2/AskBar';
import '../v2/ProofScale.css';
import '../v2/ProofRhythm.css';
import './Leaderboard.css';

const ISSUES = 'https://github.com/search?type=issues&s=created&o=desc&q=is%3Aissue%20is%3Aopen%20label%3Abounty%20archived%3Afalse%20org%3Ahanzoai%20org%3Ahanzo-apps%20org%3Ahanzo-go%20org%3Ahanzo-js';
const n = (v) => v.toLocaleString('en-US');

// [rank, name, pts, short line, bounty pts, tokens, global rank, role, long line, move]
const HUNTERS = [
  ['#1', 'Zach Kelling (@zeekay)', 1510, '1 bugs · +450 bounty pts', 450, 106039884, '#1', 'Founding Maintainer · #1 Fleet', '1 verified bug reports · +450 bounty pts · 106,039,884 tokens (Global #1)', null],
  ['#2', 'zlatan mioslav (@valerypetrov)', 192, '3 bugs · +150 bounty pts · +$20 credits', 150, 4252634, '#7', 'Bug Hunter · Top 10', '3 verified bug reports · +150 bounty pts · +$20 AI credits awarded · 4,252,634 tokens (Global #7)', '▲ +5 ranks'],
  ['#3', 'Antje Worring (@zooqueen)', 252, '0 bugs · +200 bounty pts', 200, 5212081, '#3', 'Core Contributor', '0 verified bug reports · +200 bounty pts · 5,212,081 tokens (Global #3)', null],
];
const fromTokens = (t) => Math.floor(t / 100000);
// the page's own totals are bounty points plus one point per 100K tokens; keep the tape honest
if (process.env.NODE_ENV !== 'production') HUNTERS.forEach((h) => console.assert(h[4] + fromTokens(h[5]) === h[2], 'leaderboard tape does not add up for ' + h[1]));

const REPORTS = [
  ['hanzo-inc/cloud#index-lock', '+50 pts · +$20 AI credits', 'Reported stale .git/index.lock failure during post-turn sandbox delivery on large C++ repositories (ClickHouse PR 115724).'],
  ['hanzo-inc/cloud#repo-fallback', '+50 pts', 'Reported Try Again / follow-up repository resolution failure when Forge workspace exists alongside a GitHub fork.'],
  ['hanzo-inc/cloud#slack-thread-pr-review', '+50 pts', 'Reported Slack @Hanzo thread parent context loss and multi-repo PR review handling in channel threads.'],
];

const ORGS = [
  ['@hanzo', 'Core Fleet', '2,152 requests', 106039884],
  ['@lux', 'Power Builder', '162 requests', 6361400],
  ['@zoo', 'Power Builder', '874 requests', 5212081],
  ['@dissoupov', 'Power Builder', '229 requests', 5008719],
  ['@Darkhorse7stars', 'Power Builder', '342 requests', 4826492],
  ['@TopTech126', 'Power Builder', '193 requests', 4797773],
  ['zlatan mioslav (@valerypetrov)', 'Bug Hunter · Top 10', '375 requests · 3 verified bug reports · +150 bounty pts · +$20 AI credits', 4252634],
  ['@BDTung', '1M+ Club', '65 requests', 1963129],
  ['@venuswhispers', 'Active Builder', '340 requests', 590242],
  ['@Aeonaby', 'Active Builder', '79 requests', 521279],
];

// [title, tags, words, the receipt line it adds: points, credits]. Tags are Hanzo's own, card for card (content/pages/
// leaderboard.html: the merged pull request card carries "+100 pts" and "+$20 AI credits"); the receipt prints each
// card's own title and points, so it adds no words of its own.
const EARN = [
  ['Verified bug report', ['+50 pts', '+$20 AI credits'], 'Report a reproducible bug in Hanzo Dev, Cloud, Console, or SDKs. Earn +50 bounty points and up to $20 in AI credits.', [50, 20]],
  ['Merged bounty pull request', ['+100 pts', '+$20 AI credits'], 'Ship a merged pull request fixing an open GitHub issue labelled bounty. Earn +100 to +500 points and AI credits.', [100, 20]],
  ['Qualified referral', ['+20 pts', '+$5 AI credits'], 'Invite a builder who activates a paid plan or trial. Earn +20 leaderboard points and $5 in AI credits.', [20, 5]],
  ['100K tokens processed', ['+1 pts'], 'Every 100,000 tokens processed across Hanzo Cloud models automatically adds +1 point to your global standing.', [1, 0]],
];

/* Phones (≤900px) get their own composition in a few places; the server renders the desktop one. */
function useNarrow() {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const m = matchMedia('(max-width: 900px)');
    const f = () => setNarrow(m.matches);
    f();
    m.addEventListener('change', f);
    return () => m.removeEventListener('change', f);
  }, []);
  return narrow;
}

/* A number that rolls to its new value: the old figure leaves upward, the new one arrives from below. */
function Roll({ v, className = '' }) {
  return (
    <span className={'xlb-roll ' + className}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span key={v} initial={{ y: '70%', opacity: 0 }} animate={{ y: '0%', opacity: 1 }} exit={{ y: '-70%', opacity: 0, transition: { duration: 0.15 } }} transition={{ duration: 0.3, ease: EASE }}>{v}</motion.span>
      </AnimatePresence>
    </span>
  );
}

/* A list that reads itself: while it is on screen, one row at a time is lit (every 2.8s); off screen or under reduced
   motion it rests. While the pointer is over the list the reader steps aside (no row lit by it), so the row under the
   pointer is the only one filled. Returns [ref, lit index, pointer handlers for the list]. */
function useReader(n, every = 2800) {
  const ref = useRef(null);
  const on = useInView(ref, { amount: 0.1 });
  const calm = useReducedMotion();
  const [lit, setLit] = useState(-1);
  const [hold, setHold] = useState(false);
  useEffect(() => {
    if (!on || calm || hold) return;
    const t = setTimeout(() => setLit((v) => (v + 1) % n), lit < 0 ? 600 : every);
    return () => clearTimeout(t);
  }, [on, calm, hold, lit, n, every]);
  const hand = {
    onPointerEnter: (e) => { if (e.pointerType === 'mouse') setHold(true); },
    onPointerLeave: () => setHold(false),
  };
  return [ref, hold ? -1 : lit, hand];
}

/* The tape: one hunter's total, added line by line. */
function Tape({ h }) {
  const t = fromTokens(h[5]);
  return (
    <div className="xlb-tape" aria-live="polite">
      <p className="xlb-tape-k pf-mono"><span>{h[0]}</span><span>{h[7]}</span></p>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={h[1]} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.15 } }}>
          <motion.p className="xlb-tape-l" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.06, duration: 0.4, ease: EASE }}><span>bounty pts</span><b className="pf-mono">+{n(h[4])}</b></motion.p>
          <motion.p className="xlb-tape-l" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.18, duration: 0.4, ease: EASE }}><span>{n(h[5])} tokens ÷ 100K</span><b className="pf-mono">+{n(t)}</b></motion.p>
          <motion.i className="xlb-tape-rule" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.3, duration: 0.4, ease: EASE }} />
          <motion.p className="xlb-tape-sum" initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.42, duration: 0.5, ease: EASE }}>
            <b>{n(h[2])}</b><span>pts · {h[1].split(' (')[0]}</span>
          </motion.p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function Podium() {
  const [at, setAt] = useState(0);
  const [mine, setMine] = useState(false);
  const calm = useReducedMotion();
  const ref = useRef(null);
  const seen = useInView(ref, { amount: 0.4 });
  useEffect(() => {
    if (mine || calm || !seen) return;
    const t = setTimeout(() => setAt((v) => (v + 1) % 3), 3800);
    return () => clearTimeout(t);
  }, [at, mine, calm, seen]);
  const order = [1, 0, 2]; // #2 left, #1 centre, #3 right
  return (
    <div className="xlb-pod pf-obj" ref={ref}>
      <div className="xlb-pod-top">
        {/* MASTER part 12: a roster that moves by itself gets a pause control, first in the DOM */}
        <button type="button" className="xlb-pause" aria-pressed={mine} aria-label="Pause" onClick={() => setMine((v) => !v)}>
          <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">{mine ? <path d="M5 3.5v9l7-4.5z" fill="currentColor" /> : <path d="M5 3.5v9M11 3.5v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}</svg>
        </button>
        <b>Top bug hunters &amp; builders</b>
        <span className="pf-mono">217 orgs · 140.1M tokens</span>
      </div>
      <div className="xlb-pod-body">
        <div className="xlb-steps" role="group" aria-label="Top three hunters: press one to add up its score">
          {order.map((i) => {
            const h = HUNTERS[i];
            return (
              <button key={h[1]} type="button" className={'xlb-step s' + i} data-on={at === i} aria-pressed={at === i} onClick={() => { setAt(i); setMine(true); }}>
                <span className="xlb-step-t">
                  <span className="xlb-who">{h[1].split(' (')[0]}<span className="xlb-handle"> ({h[1].split(' (')[1]}</span></span>
                  <span className="xlb-pts pf-mono">{n(h[2])} pts</span>
                  <span className="xlb-line">{h[3]}</span>
                  <span className="xlb-line">{n(h[5])} tokens ({h[6]} global)</span>
                </span>
                <motion.span className="xlb-block" initial={calm ? false : { scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 1, ease: EASE, delay: 0.5 + [0.12, 0, 0.24][i] }}>
                  <b>{h[0]}</b>
                </motion.span>
              </button>
            );
          })}
        </div>
        <Tape h={HUNTERS[at]} />
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="xlb-hero" aria-labelledby="xlb-h1">
      <div className="pf-wrap">
        <div className="xlb-hero-top">
          <div className="xlb-hero-h">
            <MaskLines as="h1" id="xlb-h1" className="pf-display m" lines={['Climb the ranks.', 'Earn AI credits.']} amount={0.1} />
            <p className="pf-kick xlb-cap">Leaderboard</p>
          </div>
          <div className="xlb-hero-side">
            <p className="xlb-lede">The live Hanzo leaderboard across bug bounties, open-source pull requests, and global token volume. Verified contributions earn AI credits and automatic rank updates.</p>
            <div className="xlb-acts">
              <span data-thumb="Open bounties" data-href="/bounty"><A to="/bounty" className="pf-btn solid" data-cta="leaderboard.hero">Open bounties</A></span>
              <More to={ISSUES}>GitHub issues</More>
            </div>
          </div>
        </div>
        {/* JS off: everything that arrives by motion stands at its final state */}
        <noscript dangerouslySetInnerHTML={{ __html: '<style>.xlb-hero-obj,.xlb-block{opacity:1!important;transform:none!important}.xlb-bar i{transform:scaleX(var(--w))!important}.xlb-rcpt-ls li{opacity:1!important;transform:none!important}</style>' }} />
        <motion.div className="xlb-hero-obj" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE, delay: 0.2 }}>
          <Podium />
        </motion.div>
      </div>
    </section>
  );
}

function Contributors() {
  const [rowsRef, lit, hand] = useReader(HUNTERS.length, 1600);
  return (
    <section className="pf-sec xlb-con" aria-labelledby="xlb-con-h">
      <div className="pf-wrap pf-grid">
        <header className="xlb-con-head">
          <h2 id="xlb-con-h" className="pf-head">Bug bounty &amp; contributor leaderboard</h2>
          <p className="pf-body">Ranked by verified bug reports (+50 pts), merged bounty pull requests (+100 to +500 pts), and token volume (+1 pt per 100K tokens).</p>
          <DetailSheet label="Recent verified bug reports & rewards" title="Recent verified bug reports & rewards">
            <ul className="xlb-wire">
              {REPORTS.map(([ref, gain, what]) => (
                <li key={ref}>
                  <span className="xlb-wire-who pf-mono">zlatan mioslav (@valerypetrov) · {ref}</span>
                  <span className="xlb-wire-gain pf-mono">{gain}</span>
                  <p>{what}</p>
                </li>
              ))}
            </ul>
          </DetailSheet>
        </header>
        <ol className="xlb-rows" ref={rowsRef} {...hand}>
          {HUNTERS.map((h) => (
            <li key={h[1]} className={'xlb-row' + (lit === HUNTERS.indexOf(h) ? ' lit' : '')}>
              <span className="xlb-rank pf-mono">{h[0]}</span>
              <span className="xlb-row-m">
                <b className="pf-title">{h[1]}</b>
                <span className="xlb-role">{h[7]}{h[9] && <em>{h[9]}</em>}</span>
                <span className="xlb-detail">{h[8]}</span>
              </span>
              <span className="xlb-row-pts"><b>{n(h[2])}</b> pts</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Tokens() {
  // Linear first: @hanzo's lead (17x the next org) is the picture; Log is the reveal that spreads the rest out
  const [scale, setScale] = useState('Linear');
  const [all, setAll] = useState(false);
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.2 });
  const [readRef, lit, hand] = useReader(ORGS.length, 1500);
  const top = ORGS[0][3];
  const w = (t) => (scale === 'Log' ? Math.log10(t) / Math.log10(top) : t / top);
  return (
    <SceneWipe className="xlb-tok" label="Global token volume leaderboard">
      <div className="pf-wrap">
        <div className="xlb-tok-head">
          <div>
            <h2 id="xlb-tok-h" className="pf-head">Global token volume leaderboard</h2>
            <p className="pf-body">Top 10 active organizations across 217 organizations on Hanzo Cloud by total tokens processed.</p>
          </div>
          <dl className="xlb-figs">
            <div><dt>orgs</dt><dd className="pf-figure">217</dd></div>
            <div><dt>tokens</dt><dd className="pf-moment">140.1M</dd></div>
          </dl>
        </div>
        <div className="xlb-scale" role="tablist" aria-label="Bar scale">
          {['Linear', 'Log'].map((k) => (
            <button key={k} type="button" role="tab" aria-selected={scale === k} onClick={() => setScale(k)}>
              {scale === k && <motion.span layoutId="xlb-scale" className="xlb-scale-bg" transition={{ duration: 0.3, ease: EASE }} />}
              <span className="xlb-scale-t">{k}</span>
            </button>
          ))}
        </div>
        <div ref={readRef} {...hand}>
        {/* phones: the top three, then the rest behind one disclosure, so the dark room is one screen, not three */}
        <ol className="xlb-board" ref={ref} id="xlb-board" data-all={all}>
          {ORGS.map(([who, badge, req, t], i) => (
            <li key={who} className={'xlb-org' + (i === 0 ? ' lead' : '') + (lit === i ? ' lit' : '')} style={{ '--i': i }}>
              <span className="xlb-org-r pf-mono">#{i + 1}</span>
              <span className="xlb-org-m"><b>{who}</b><span>{badge}</span><span className="xlb-req">{req}</span></span>
              <span className="xlb-bar" aria-hidden="true"><motion.i style={{ '--w': w(t) }} initial={{ scaleX: 0 }} animate={seen ? { scaleX: w(t) } : {}} transition={{ duration: 0.9, ease: EASE, delay: seen ? i * 0.06 : 0 }} /></span>
              <span className="xlb-org-t pf-mono">{n(t)} tokens</span>
            </li>
          ))}
        </ol>
        {!all && (
          <button type="button" className="xlb-all" aria-expanded={all} aria-controls="xlb-board" onClick={() => setAll(true)}>
            <span>Show all</span><b className="pf-mono">{ORGS.length}</b>
          </button>
        )}
        </div>
      </div>
    </SceneWipe>
  );
}

/* The receipt the earn chapters build: lines 0..at are printed, and the total rolls. With `print` (phones, where the
   chapters stack) there is one receipt after the four chapters, and it prints its own lines once it is reached. */
function Receipt({ at: given, print = false }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.5 });
  const calm = useReducedMotion();
  const [step, setStep] = useState(-1);
  useEffect(() => {
    if (!print) return;
    if (calm) { setStep(EARN.length - 1); return; }
    if (!seen || step >= EARN.length - 1) return;
    const t = setTimeout(() => setStep((v) => v + 1), step < 0 ? 300 : 500);
    return () => clearTimeout(t);
  }, [print, seen, calm, step]);
  const at = print ? Math.max(step, 0) : given;
  const lines = EARN.slice(0, at + 1).map((e) => e[3]);
  const pts = lines.reduce((s, l) => s + l[0], 0);
  const cr = lines.reduce((s, l) => s + l[1], 0);
  return (
    <div className="xlb-rcpt pf-obj" ref={ref}>
      <p className="xlb-rcpt-k pf-mono"><span>{String(at + 1).padStart(2, '0')} / 04</span></p>
      <ul className="xlb-rcpt-ls">
        {EARN.map((e, i) => (
          <li key={e[0]} data-on={i <= at} data-new={i === at}>
            <span>{e[0]}</span>
            <b className="pf-mono">+{n(e[3][0])}</b>
          </li>
        ))}
      </ul>
      <i className="xlb-rcpt-rule" aria-hidden="true" />
      <div className="xlb-rcpt-sum">
        <Roll v={n(pts)} className="xlb-rcpt-n" />
        <span className="xlb-rcpt-u">pts<br /><span className="pf-mono">{cr ? `up to $${cr} AI credits` : ''}</span></span>
      </div>
    </div>
  );
}

function Earn() {
  const narrow = useNarrow();
  return (
    <section className="xlb-earn" aria-labelledby="xlb-earn-h">
      <div className="pf-wrap xlb-earn-intro">
        <MaskLines as="h2" id="xlb-earn-h" className="pf-head" lines={['How to earn points', '& AI credits']} />
        <p className="pf-lede">Every verified bug report and merged pull request triggers an automatic email notification with your updated points, AI credits, and leaderboard rank.</p>
      </div>
      <PinScenes
        className="xlb-earn-pin"
        label="Four ways to earn"
        per={70}
        chapters={EARN.map(([t, tags, d]) => ({
          title: t,
          body: (
            <>
              <span className="xlb-tags">{tags.map((g) => <span key={g} className="pf-mono">{g}</span>)}</span>
              <p className="pf-body">{d}</p>
            </>
          ),
        }))}
        // desktop: one pinned receipt that builds as the chapters pass; phones: one receipt after the last chapter
        visual={(at) => (narrow ? (at === EARN.length - 1 ? <Receipt at={at} print /> : null) : <Receipt at={at} />)}
      />
    </section>
  );
}

function Step({ label, v, set, step = 1, max = 99 }) {
  return (
    <div className="xlb-calc-row">
      <span>{label}</span>
      <div className="xlb-stepper">
        <button type="button" aria-label={'Fewer: ' + label} onClick={() => set(Math.max(0, v - step))} disabled={v <= 0}>−</button>
        <output className="pf-mono" aria-live="polite">{v}</output>
        <button type="button" aria-label={'More: ' + label} onClick={() => set(Math.min(max, v + step))} disabled={v >= max}>+</button>
      </div>
    </div>
  );
}

const TOKS = [0, 100000, 500000, 1000000, 2000000, 5000000, 10000000, 25000000, 50000000, 106039884, 200000000];

function Calc() {
  const [bugs, setBugs] = useState(1);
  const [prs, setPrs] = useState(1);
  const [per, setPer] = useState(100);
  const [refs, setRefs] = useState(0);
  const [k, setK] = useState(3);
  const tokens = TOKS[k];
  const pts = bugs * 50 + prs * per + refs * 20 + fromTokens(tokens);
  // credits per card tag, as Hanzo prints them: bug +$20 (up to), merged pull request +$20, referral +$5
  const credits = bugs * 20 + prs * 20 + refs * 5;
  const sum = `${bugs} × 50 + ${prs} × ${per} + ${refs} × 20 + ${n(fromTokens(tokens))}`;
  const place = useMemo(() => { const i = ORGS.findIndex((o) => tokens >= o[3]); return i < 0 ? null : i + 1; }, [tokens]);
  return (
    <section className="pf-sec xlb-calc-s" aria-labelledby="xlb-calc-h">
      <div className="pf-wrap">
        <div className="xlb-calc-head">
          <h2 id="xlb-calc-h" className="pf-head">Your points, worked out</h2>
        </div>
        <div className="xlb-calc pf-obj">
          <div className="xlb-calc-in">
            <Step label="Verified bug reports" v={bugs} set={setBugs} />
            <Step label="Merged bounty pull requests" v={prs} set={setPrs} />
            <div className="xlb-calc-row">
              <span>+100 to +500 pts</span>
              <div className="xlb-per" role="radiogroup" aria-label="Points a merged pull request earns">
                {[100, 200, 300, 400, 500].map((p) => <button key={p} type="button" role="radio" aria-checked={per === p} onClick={() => setPer(p)} className="pf-mono">+{p}</button>)}
              </div>
            </div>
            <Step label="Qualified referrals" v={refs} set={setRefs} />
            {/* the fill rides a CSS variable on the label (the same on server and client); the input itself carries no
                style, and suppressHydrationWarning keeps a style attribute added before hydration from raising an issue */}
            <label className="xlb-calc-row xlb-tok-in" style={{ '--f': (k / (TOKS.length - 1)) * 100 + '%' }}>
              <span>Tokens processed <b className="pf-mono">{n(tokens)}</b></span>
              <input type="range" min="0" max={TOKS.length - 1} step="1" value={k} onChange={(e) => setK(+e.target.value)} aria-valuetext={n(tokens) + ' tokens'} suppressHydrationWarning />
            </label>
          </div>
          <div className="xlb-calc-out" aria-live="polite">
            <div className="xlb-total"><Roll v={n(pts)} /><span className="xlb-total-l">pts</span></div>
            <p key={sum} className="xlb-calc-sum pf-mono">{sum}</p>
            <p>Up to <b>${n(credits)}</b> in AI credits</p>
            <p>{place ? <><b>#{place}</b> · Global token volume leaderboard</> : <><b>#11+</b> · Global token volume leaderboard</>}</p>
          </div>
        </div>
        <div className="xlb-end">
          <More to="/bounty">Browse open bounties</More>
        </div>
      </div>
    </section>
  );
}

/* The close, page-local until the kit Band takes a line-mask reveal and a cta prop (docs/requests/leaderboard.md): the
   page's second dark room opens from a rounded panel like the first, its words cut in by line mask at the deck's 52px,
   and its one solid ask carries data-cta="leaderboard.band" with no extra wrapper in the tab order. */
function Close() {
  return (
    <SceneWipe className="xlb-close" label="Climb the ranks. Earn AI credits.">
      <div className="pf-wrap xlb-close-in">
        <MaskLines as="h2" className="pf-display xlb-close-h" lines={['Climb the ranks.', 'Earn AI credits.']} />
        <A to="/bounty" className="pf-btn solid xlb-close-btn" data-cta="leaderboard.band">Open bounties</A>
      </div>
    </SceneWipe>
  );
}

export default function Leaderboard() {
  return (
    <main className="xlb pf-r">
      <Hero />
      <Contributors />
      <Tokens />
      <Earn />
      <Calc />
      {/* the close: one band in the page's own words, its one solid ask, then the footer */}
      <Close />
      <AskBar title="Leaderboard" label="Open bounties" to="/bounty" cta="leaderboard.hero" />
    </main>
  );
}
