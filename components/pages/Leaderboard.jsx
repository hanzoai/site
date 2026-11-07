'use client';
// Persona: a developer or bug hunter who uses Hanzo and wants credits for contributing (arrives from /bounty, GitHub or the header)
// Goal: see how ranks are earned and start on an open bounty
// CTA: Open bounties -> /bounty (hero, the shared sticky ask, the page-local close) · data-cta leaderboard.hero / leaderboard.band
// Metric: cta_click on leaderboard.hero (a researcher-or-builder metric: a GitHub or bounty click)
// Signature: race — the global board's own ten token volumes race from zero to their exact figures, bars and tabular counters at the true ratios every frame, Linear or Log, replayable, in the second screen.
// Beyond: climb the global board yourself: a slider and stepper over the board's own ten token volumes, the rank rolling, each stop showing that org's own lines (no figure worked out on the page).
/* Leaderboard. Hanzo's own board, as it reads today, told one idea per screen.
   1. A podium as the hero object: the three hunters stand in silver and grey, the lit one in ink; the tape beside it adds the lit
      hunter's total by itself (bounty points, plus one point per 100,000 tokens: 450 + 1,060 = 1,510).
   2. The race (second screen, the page's one black room): the token board's ten orgs run from zero to their own volumes
      on one clock, so every frame holds the true ratios (@hanzo 17x the next org); it rests on Hanzo's exact figures.
      Linear first, the Log switch re-scales the running bars, Replay runs it again.
   3. How to earn, as a plain list of Hanzo's four cards beside a receipt that prints itself once and rolls each card's points.
   4. The Beyond: climb the global board, stop by stop, through the board's own volumes.
   5. The contributors as an editorial list with huge ranks; the recent rewards open in a sheet.
   6. The close: the second dark room, the h1's words at 52px and the one ask.
   Colour: none of its own (JAMES.md): the deck ramp only, named once at the top of Leaderboard.css; the lit hunter is the one ink block.
   Motion: time (the race), idle (the podium lights each hunter in turn and its tape adds up; the lists read themselves;
   the calculator climbs the board once; the receipt prints), pointer (rows fill on hover, steps lift), state (scale pill,
   sheet, rolling totals). Entrances (map rule 7), one per main section, in order: card-deal (the podium is dealt onto
   its places), rack-focus (the race room pulls into focus), focus-pull-scroll (how to earn sharpens as its ruled field
   blurs), orbit-in (the Beyond's parts orbit in), letter-cascade (the contributors' heading); no other section reveal
   (page-local, leaderboard/entrances.jsx). No pinned or scroll-scrubbed chapter scenes.
   One ask, Hanzo's "Open bounties": in the hero, sticky after it (AskBar on desktop, the thumb bar on phones), at the close.
   Every name and figure is Hanzo's.
   V2: 8/10 Motion map: race — the token board became a live race (ten volumes from zero at true ratios, replayable, Log re-scales mid-race); the pinned earn chapters, both SceneWipe rooms, the line-mask heads and the sticky contributor column are gone (earn is a plain list with its self-printing receipt); five page-local entrances (card-deal, rack-focus, focus-pull-scroll, orbit-in, letter-cascade); sections reordered hero, race, earn, beyond, contributors, close.
   Earlier, round 2: range input hydration-safe (fill on the label, suppressHydrationWarning); copy word-for-word (every visible string checked against content/live, content/pages and ui-strings: tape lines are Hanzo's own strings, the receipt prints Hanzo's card titles and rolls each card's own points, the points calculator became a scrubber over the board's own volumes, Linear/Log tabs icon-only; the +$20 PR tag kept, it is on Hanzo's card); deck greys as page tokens, 497/606 weights, deck durations, flat bars; podium and tape total in the first screen at 1470x801 and the lit block within 660px on phone; board Linear first and collapsed to three rows on phone; one receipt after the chapters on phone; scrubber result on paper with an idle climb; page-local close with line-mask h2 at 52px and data-cta leaderboard.band; hovers answer (stepper fill, reader yields to the pointer). */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, animate, useInView, useReducedMotion } from 'motion/react';
import { EASE } from '../ui';
import { A, More } from '../kit';
import DetailSheet from '../v2/x-pascal/DetailSheet';
import AskBar from '../v2/AskBar';
import { Arrive, Cascade, FocusPull, useArrive } from './leaderboard/entrances';
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

/* The tape: one hunter's total, added line by line. Every line is Hanzo's own string for that hunter (bounty points,
   tokens and global rank); no figure is worked out on the page. */
function Tape({ h }) {
  return (
    <div className="xlb-tape xlb-card" style={{ '--d': 3 }} aria-live="polite">
      <p className="xlb-tape-k pf-mono"><span>{h[0]}</span><span>{h[7]}</span></p>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={h[1]} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.15 } }}>
          <motion.p className="xlb-tape-l" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.06, duration: 0.4, ease: EASE }}><b className="pf-mono">+{n(h[4])} bounty pts</b></motion.p>
          <motion.p className="xlb-tape-l" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.18, duration: 0.4, ease: EASE }}><b className="pf-mono">{n(h[5])} tokens ({h[6]} global)</b></motion.p>
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
  // card-deal: the three steps and the tape are dealt from one deck (off the podium's right edge) onto their places
  const [dealRef, dealt] = useArrive(0.2);
  return (
    <div className="xlb-pod pf-obj" ref={(el) => { ref.current = el; dealRef.current = el; }} data-ent="deal" data-in={dealt}>
      <div className="xlb-pod-top">
        {/* MASTER part 12: a roster that moves by itself gets a pause control, first in the DOM */}
        <button type="button" className="xlb-pause" aria-pressed={mine} aria-label="Pause" onClick={() => setMine((v) => !v)}>
          <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">{mine ? <path d="M5 3.5v9l7-4.5z" fill="currentColor" /> : <path d="M5 3.5v9M11 3.5v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}</svg>
        </button>
        <span className="xlb-pod-t">Top bug hunters &amp; builders</span>
        <span className="pf-mono">217 orgs · 140.1M tokens</span>
      </div>
      <div className="xlb-pod-body">
        <div className="xlb-steps" role="group" aria-label="Top three hunters: press one to add up its score">
          {order.map((i, slot) => {
            const h = HUNTERS[i];
            return (
              <button key={h[1]} type="button" className={'xlb-step xlb-card s' + i} style={{ '--d': slot }} data-on={at === i} aria-pressed={at === i} onClick={() => { setAt(i); setMine(true); }}>
                <span className="xlb-step-t">
                  <span className="xlb-who">{h[1].split(' (')[0]}<span className="xlb-handle"> ({h[1].split(' (')[1]}</span></span>
                  <span className="xlb-pts pf-mono">{n(h[2])} pts</span>
                  <span className="xlb-line">{h[3]}</span>
                  <span className="xlb-line">{n(h[5])} tokens ({h[6]} global)</span>
                </span>
                <span className="xlb-block">
                  <b>{h[0]}</b>
                </span>
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
            <h1 id="xlb-h1" className="pf-display m"><span className="xlb-l">Climb the ranks.</span> <span className="xlb-l">Earn AI credits.</span></h1>
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
        {/* JS off: the receipt's lines stand printed (entrance start states only apply under html.js) */}
        <noscript dangerouslySetInnerHTML={{ __html: '<style>.xlb-rcpt-ls li{opacity:1!important;transform:none!important}</style>' }} />
        <div className="xlb-hero-obj">
          <Podium />
        </div>
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
          <Cascade id="xlb-con-h" className="pf-head" text="Bug bounty & contributor leaderboard" />
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
                <span className="pf-title">{h[1]}</span>
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

const TOP = ORGS[0][3];
const RACE_S = 2.6;
// a bar's width for a token count on either scale (Log of 0 or 1 token is an empty bar)
const width = (t, k) => (k === 'Log' ? (t <= 1 ? 0 : Math.log10(t) / Math.log10(TOP)) : t / TOP);
const useIsoLayout = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/* The signature: the race. All ten volumes run on one clock p (0 to 1, the deck's in-out curve), each counter showing
   round(volume * p) and each bar that count's width, so every frame holds the board's true ratios and the race rests on
   Hanzo's exact figures. The server (and JS off, and reduced motion) renders the finish; the client resets to zero,
   runs when the board is reached, and Replay runs it again. Bars and counters are written straight to the DOM per
   frame (no React render per frame); counters are tabular and right-aligned in a fixed column, so nothing shifts. */
function Tokens() {
  // Linear first: @hanzo's lead (17x the next org) is the picture; Log is the reveal that spreads the rest out
  const [scale, setScale] = useState('Linear');
  const scaleRef = useRef('Linear');
  const [all, setAll] = useState(false);
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.3 });
  const [readRef, lit, hand] = useReader(ORGS.length, 1500);
  const bars = useRef([]);
  const nums = useRef([]);
  const p = useRef(1);
  const run = useRef(null);
  const [phase, setPhase] = useState('rest'); // rest | wait | run
  const paint = () => {
    ORGS.forEach((o, i) => {
      const v = Math.round(o[3] * p.current);
      if (nums.current[i]) nums.current[i].textContent = n(v);
      if (bars.current[i]) bars.current[i].style.transform = 'scaleX(' + width(v, scaleRef.current) + ')';
    });
  };
  const race = () => {
    run.current?.stop();
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { p.current = 1; paint(); setPhase('rest'); return; }
    p.current = 0; paint(); setPhase('run');
    run.current = animate(0, 1, {
      duration: RACE_S, ease: [0.4, 0, 0.2, 1],
      onUpdate: (v) => { p.current = v; paint(); },
      onComplete: () => { p.current = 1; paint(); setPhase('rest'); },
    });
  };
  // on the client, before the first paint after hydration: back to the start line (unless reduced motion)
  useIsoLayout(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    p.current = 0; paint(); setPhase('wait');
    return () => run.current?.stop();
  }, []);
  useEffect(() => { if (seen && phase === 'wait') { const t = setTimeout(race, 350); return () => clearTimeout(t); } }, [seen, phase]);
  const pick = (k) => { scaleRef.current = k; setScale(k); paint(); };
  return (
    <Arrive as="section" e="rack" amount={0.15} className="xlb-tok" data-room="dark" aria-label="Global token volume leaderboard">
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
        <div className="xlb-tools">
        <div className="xlb-scale" role="tablist" aria-label="Bar scale">
          {['Linear', 'Log'].map((k) => (
            // icon-only (content/ui-strings.json: a control without an approved label shows its icon, the word is its name)
            <button key={k} type="button" role="tab" aria-selected={scale === k} aria-label={k} onClick={() => pick(k)}>
              {scale === k && <motion.span layoutId="xlb-scale" className="xlb-scale-bg" transition={{ duration: 0.3, ease: EASE }} />}
              <svg className="xlb-scale-t" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
                <path d={k === 'Linear' ? 'M4 20 20 4' : 'M4 20C4 10 9 6 20 5'} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M4 4v16h16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity=".45" />
              </svg>
            </button>
          ))}
        </div>
        {/* "Replay" is a register string (content/ui-strings.json), used as the icon's name; under reduced motion it is hidden */}
        <button type="button" className="xlb-replay" aria-label="Replay" aria-controls="xlb-board" onClick={race} disabled={phase === 'run'}>
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M19 12a7 7 0 1 1-2.05-4.95M19 4.5V8h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        </div>
        <div ref={readRef} {...hand}>
        {/* phones: the top three, then the rest behind one disclosure, so the dark room is one screen, not three */}
        <ol className="xlb-board" ref={ref} id="xlb-board" data-all={all} data-race={phase}>
          {ORGS.map(([who, badge, req, t], i) => (
            <li key={who} className={'xlb-org' + (i === 0 ? ' lead' : '') + (lit === i ? ' lit' : '')} style={{ '--i': i }}>
              <span className="xlb-org-r pf-mono">#{i + 1}</span>
              <span className="xlb-org-m"><span className="xlb-org-n">{who}</span><span>{badge}</span><span className="xlb-req">{req}</span></span>
              <span className="xlb-bar" aria-hidden="true"><i ref={(el) => { bars.current[i] = el; }} style={{ '--w': width(t, scale) }} /></span>
              {/* the race counts up in the visual figure; the resting line is read as one */}
              <span className="xlb-org-t pf-mono"><span aria-hidden="true"><span ref={(el) => { nums.current[i] = el; }}>{n(t)}</span> tokens</span><span className="x-sr">{n(t) + ' tokens'}</span></span>
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
    </Arrive>
  );
}

/* The receipt beside the four ways to earn: with `print` it prints its own lines once it is reached, and the figure
   rolls to each newest line's points. */
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
  // the big figure rolls to the newest line's own points, as Hanzo prints them (+50, +100, +20, +1): nothing is summed
  return (
    <div className="xlb-rcpt pf-obj" ref={ref}>
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
        <Roll v={'+' + n(EARN[at][3][0])} className="xlb-rcpt-n" />
        <span className="xlb-rcpt-u">pts</span>
      </div>
    </div>
  );
}

/* How to earn: a plain section (the old pinned chapters' content, all of it): Hanzo's four cards as a list beside the
   receipt, which prints its own lines once it is reached. It enters by focus-pull-scroll: a field of ruled lines (an
   unlabeled shape) holds the focus, then blurs as the list and receipt sharpen. */
const FIELD = Array.from({ length: 9 }, (_, i) => <i key={i} style={{ '--r': i }} />);
function Earn() {
  return (
    <section className="pf-sec xlb-earn" aria-labelledby="xlb-earn-h">
      <FocusPull className="pf-wrap" field={FIELD}>
        <div className="xlb-earn-intro">
          <h2 id="xlb-earn-h" className="pf-head"><span className="xlb-l">How to earn points</span> <span className="xlb-l">&amp; AI credits</span></h2>
          <p className="pf-lede">Every verified bug report and merged pull request triggers an automatic email notification with your updated points, AI credits, and leaderboard rank.</p>
        </div>
        <div className="xlb-earn-body">
          <ol className="xlb-ways" aria-label="Four ways to earn">
            {EARN.map(([t, tags, d]) => (
              <li key={t} className="xlb-way">
                <h3 className="pf-title">{t}</h3>
                <span className="xlb-tags">{tags.map((g) => <span key={g} className="pf-mono">{g}</span>)}</span>
                <p className="pf-body">{d}</p>
              </li>
            ))}
          </ol>
          <Receipt print />
        </div>
      </FocusPull>
    </section>
  );
}

// the scrubber's stops are the board's own token volumes (#10 up to #1), so every figure it shows is Hanzo's
const TOKS = ORGS.map((o) => o[3]).reverse();
const ICON = { prev: 'M5 12h14', next: 'M5 12h14M12 5v14' };

/* The Beyond: climb the global board yourself. A slider and a stepper over the board's ten volumes; the rank rolls,
   and the org, its badge, requests and tokens are Hanzo's own lines. No figure is worked out on the page. */
function Calc() {
  const [k, setK] = useState(0);
  const top = TOKS.length - 1;
  const tokens = TOKS[k];
  const place = ORGS.findIndex((o) => o[3] === tokens);
  const org = ORGS[place];
  // an idle demo that runs once and ends at rest: when the scrubber is reached untouched, it climbs from #10 to
  // @hanzo's own 106,039,884 (#1), the rank rolling with each step; any touch or key hands it over
  const box = useRef(null);
  const met = useInView(box, { once: true, amount: 0.5 });
  const calm = useReducedMotion();
  const [mine, setMine] = useState(false);
  useEffect(() => {
    if (!met || mine || calm || k >= top) return;
    const t = setTimeout(() => setK((v) => Math.min(top, v + 1)), k === 0 ? 700 : 500);
    return () => clearTimeout(t);
  }, [met, mine, calm, k, top]);
  return (
    // it closes the earn chapters, so it is named by their heading and adds no heading of its own
    <Arrive as="section" e="orbit" amount={0.3} className="pf-sec xlb-calc-s" aria-labelledby="xlb-earn-h">
      <div className="pf-wrap">
        <div className="xlb-calc pf-obj" ref={box} onPointerDownCapture={() => setMine(true)} onKeyDownCapture={() => setMine(true)}>
          <div className="xlb-calc-in">
            <div className="xlb-calc-row xlb-orb" style={{ '--o': 0 }}>
              <span>{EARN[3][0]}</span>
              {/* icon-only stepper: "Previous" / "Next" are register strings (content/ui-strings.json), used as names */}
              <div className="xlb-stepper">
                <button type="button" aria-label="Previous" onClick={() => setK(Math.max(0, k - 1))} disabled={k <= 0}>
                  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d={ICON.prev} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                </button>
                <output className="pf-mono" aria-live="polite">#{place + 1}</output>
                <button type="button" aria-label="Next" onClick={() => setK(Math.min(top, k + 1))} disabled={k >= top}>
                  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d={ICON.next} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                </button>
              </div>
            </div>
            {/* the fill rides a CSS variable on the label (the same on server and client); the input itself carries no
                style, and suppressHydrationWarning keeps a style attribute added before hydration from raising an issue */}
            <label className="xlb-calc-row xlb-tok-in xlb-orb" style={{ '--f': (k / top) * 100 + '%', '--o': 1 }}>
              <span><span className="pf-mono xlb-tok-v">{n(tokens) + ' tokens'}</span></span>
              <input type="range" min="0" max={top} step="1" value={k} onChange={(e) => setK(+e.target.value)} aria-label={EARN[3][0]} aria-valuetext={n(tokens) + ' tokens'} suppressHydrationWarning />
            </label>
            {/* every org's lines share one grid cell, so the panel keeps the tallest one's height and never shifts */}
            <div className="xlb-calc-orgs xlb-orb" style={{ '--o': 2 }}>
              {ORGS.map((o, i) => (
                <div key={o[0]} className="xlb-calc-org" data-on={i === place} aria-hidden={i !== place}>
                  <p><b>{o[0]}</b> <span>{o[1]}</span></p>
                  <p>{o[2]}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="xlb-calc-out xlb-orb" style={{ '--o': 3 }} aria-live="polite">
            <div className="xlb-total"><Roll v={'#' + (place + 1)} /></div>
            {/* the rule under the rank draws once each time it changes (keyed), then rests */}
            <i key={place} className="xlb-calc-rule" aria-hidden="true" />
            <p>Global token volume leaderboard</p>
          </div>
        </div>
        <div className="xlb-end xlb-orb" style={{ '--o': 4 }}>
          <More to="/bounty">Browse open bounties</More>
        </div>
      </div>
    </Arrive>
  );
}

/* The close, page-local: the page's second dark room, simply there (the five entrances are the page's only reveals),
   the h1's words at the deck's 52px, and its one solid ask carries data-cta="leaderboard.band". */
function Close() {
  return (
    <section className="xlb-close" data-room="dark" aria-label="Climb the ranks. Earn AI credits.">
      <div className="pf-wrap xlb-close-in">
        <h2 className="pf-display xlb-close-h"><span className="xlb-l">Climb the ranks.</span> <span className="xlb-l">Earn AI credits.</span></h2>
        <A to="/bounty" className="pf-btn solid xlb-close-btn" data-cta="leaderboard.band">Open bounties</A>
      </div>
    </section>
  );
}

export default function Leaderboard() {
  return (
    <main className="xlb pf-r">
      <Hero />
      <Tokens />
      <Earn />
      <Calc />
      <Contributors />
      {/* the close: one band in the page's own words, its one solid ask, then the footer */}
      <Close />
      <AskBar title="Leaderboard" label="Open bounties" to="/bounty" cta="leaderboard.hero" />
    </main>
  );
}
