'use client';
// Signature: every rank is a sum you can open: the podium cycles its three hunters and each score adds itself up on a paper tape.
// Beyond: your points, worked out with the page's own rules (+50 a bug, +100 to +500 a merged pull request, +20 a referral, +1 per 100K tokens), and where your tokens would sit on the global board.
/* Leaderboard. Hanzo's own board, as it reads today. The three hunters stand on a podium; the tape under it shows how
   each total is made (bounty points, plus one point per 100,000 tokens: 450 + 1,060 = 1,510). The token board draws
   in the one dark room, on a scale you choose. Every name and figure is Hanzo's. */
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { EASE, Rise } from '../ui';
import { A, Go, More, SecHead } from '../kit';
import Sigil from '../Sigil';
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

const EARN = [
  ['Verified bug report', ['+50 pts', '+$20 AI credits'], 'Report a reproducible bug in Hanzo Dev, Cloud, Console, or SDKs. Earn +50 bounty points and up to $20 in AI credits.'],
  ['Merged bounty pull request', ['+100 pts', '+$20 AI credits'], 'Ship a merged pull request fixing an open GitHub issue labelled bounty. Earn +100 to +500 points and AI credits.'],
  ['Qualified referral', ['+20 pts', '+$5 AI credits'], 'Invite a builder who activates a paid plan or trial. Earn +20 leaderboard points and $5 in AI credits.'],
  ['100K tokens processed', ['+1 pts'], 'Every 100,000 tokens processed across Hanzo Cloud models automatically adds +1 point to your global standing.'],
];

/* The tape: one hunter's total, added line by line. */
function Tape({ h }) {
  const t = fromTokens(h[5]);
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={h[1]} className="xlb-tape" initial={{ y: -16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 12, opacity: 0, transition: { duration: 0.2 } }} transition={{ duration: 0.5, ease: EASE }}>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}><span>bounty pts</span><b>+{n(h[4])}</b></motion.p>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}><span>{n(h[5])} tokens ÷ 100K</span><b>+{n(t)}</b></motion.p>
        <motion.i initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.4, duration: 0.4, ease: EASE }} />
        <motion.p className="xlb-tape-sum" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}><span>{h[1].split(' (')[0]}</span><b>{n(h[2])} pts</b></motion.p>
      </motion.div>
    </AnimatePresence>
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
    const t = setTimeout(() => setAt((v) => (v + 1) % 3), 3600);
    return () => clearTimeout(t);
  }, [at, mine, calm, seen]);
  const order = [1, 0, 2]; // #2 left, #1 centre, #3 right
  return (
    <div className="xlb-pod" ref={ref}>
      <Sigil seed="leaderboard" data={HUNTERS.map((h) => h[2])} className="xlb-sigil" />
      <div className="xlb-pod-top"><b>Top bug hunters &amp; builders</b><span className="x-mono">217 orgs · 140.1M tokens</span></div>
      <div className="xlb-steps" role="group" aria-label="Top three hunters: press one to add up its score">
        {order.map((i) => {
          const h = HUNTERS[i];
          return (
            <button key={h[1]} type="button" className={'xlb-step s' + i + (at === i ? ' on' : '')} aria-pressed={at === i} onClick={() => { setAt(i); setMine(true); }}>
              <span className="xlb-who">{h[1]}</span>
              <span className="xlb-pts x-mono">{n(h[2])} pts</span>
              <span className="xlb-line">{h[3]}</span>
              <span className="xlb-line">{n(h[5])} tokens ({h[6]} global)</span>
              <motion.span className="xlb-block" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.9, ease: EASE, delay: 0.4 + i * 0.12 }}><b>{h[0]}</b></motion.span>
            </button>
          );
        })}
      </div>
      <Tape h={HUNTERS[at]} />
    </div>
  );
}

function Hero() {
  const line = (t, d) => <span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: d }}>{t}</motion.span></span>;
  return (
    <section className="xlb-hero" aria-labelledby="xlb-h1">
      <div className="x-wrap xlb-grid">
        <div>
          <motion.p className="x-kick" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}>Leaderboard</motion.p>
          <h1 id="xlb-h1" className="xlb-h1">{line('Climb the ranks.', 0.05)}{line('Earn AI credits.', 0.17)}</h1>
          <motion.p className="xlb-lede" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}>The live Hanzo leaderboard across bug bounties, open-source pull requests, and global token volume. Verified contributions earn AI credits and automatic rank updates.</motion.p>
          <motion.div className="xlb-acts" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}>
            <span data-thumb="Open bounties" data-href="/bounty"><Go to="/bounty" solid>Open bounties</Go></span>
            <Go to={ISSUES}>GitHub issues</Go>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: EASE, delay: 0.2 }}><Podium /></motion.div>
      </div>
    </section>
  );
}

function Contributors() {
  return (
    <section className="x-sec xlb-con" aria-labelledby="xlb-con-h">
      <div className="x-wrap">
        <SecHead kicker="Bounties" title="Bug bounty & contributor leaderboard" lede="Ranked by verified bug reports (+50 pts), merged bounty pull requests (+100 to +500 pts), and token volume (+1 pt per 100K tokens)." id="xlb-con-h" />
        <div className="xlb-con-grid">
          <ol className="xlb-rows">
            {HUNTERS.map((h, i) => (
              <Rise as="li" key={h[1]} delay={i * 0.08} className="xlb-row">
                <span className="xlb-rank">{h[0]}</span>
                <span className="xlb-row-m">
                  <b>{h[1]}</b>
                  <span className="xlb-role">{h[7]}{h[9] && <em>{h[9]}</em>}</span>
                  <span className="xlb-detail">{h[8]}</span>
                </span>
                <span className="xlb-row-pts x-mono">{n(h[2])} pts</span>
              </Rise>
            ))}
          </ol>
          <div className="xlb-wire">
            <h3>Recent verified bug reports &amp; rewards</h3>
            <ul>
              {REPORTS.map(([ref, gain, what], i) => (
                <li key={ref} className="xlb-receipt" style={{ '--i': i }}>
                  <span className="xlb-receipt-who x-mono">zlatan mioslav (@valerypetrov) · {ref}</span>
                  <span className="xlb-gain x-mono">{gain}</span>
                  <p>{what}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Tokens() {
  const [scale, setScale] = useState('Log');
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.25 });
  const top = ORGS[0][3];
  const w = (t) => (scale === 'Log' ? Math.log10(t) / Math.log10(top) : t / top);
  return (
    <section className="x-sec xlb-tok" data-room="dark" aria-labelledby="xlb-tok-h">
      <div className="x-wrap">
        <div className="xlb-tok-head">
          <SecHead dark kicker="Tokens" title="Global token volume leaderboard" lede="Top 10 active organizations across 217 organizations on Hanzo Cloud by total tokens processed." id="xlb-tok-h" />
          <div className="xlb-scale" role="tablist" aria-label="Bar scale">
            {['Log', 'Linear'].map((k) => (
              <button key={k} type="button" role="tab" aria-selected={scale === k} onClick={() => setScale(k)}>
                {scale === k && <motion.span layoutId="xlb-scale" className="xlb-scale-bg" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                <span>{k}</span>
              </button>
            ))}
          </div>
        </div>
        <ol className="xlb-board" ref={ref}>
          <i className="xlb-scan" aria-hidden="true" />
          {ORGS.map(([who, badge, req, t], i) => (
            <li key={who} className="xlb-org">
              <span className="xlb-org-r x-mono">#{i + 1}</span>
              <span className="xlb-org-m"><b>{who}</b><span>{badge}</span><span className="xlb-req">{req}</span></span>
              <span className="xlb-bar" aria-hidden="true"><motion.i initial={{ scaleX: 0 }} animate={seen ? { scaleX: w(t) } : {}} transition={{ type: 'spring', stiffness: 90, damping: 20, delay: seen ? i * 0.05 : 0 }} /></span>
              <span className="xlb-org-t x-mono">{n(t)} tokens</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Step({ label, v, set, step = 1, max = 99 }) {
  return (
    <div className="xlb-calc-row">
      <span>{label}</span>
      <div className="xlb-stepper">
        <button type="button" aria-label={'Fewer: ' + label} onClick={() => set(Math.max(0, v - step))} disabled={v <= 0}>−</button>
        <output className="x-mono" aria-live="polite">{v}</output>
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
  const credits = bugs * 20 + prs * 20 + refs * 5;
  const place = useMemo(() => { const i = ORGS.findIndex((o) => tokens >= o[3]); return i < 0 ? null : i + 1; }, [tokens]);
  return (
    <div className="xlb-calc">
      <div className="xlb-calc-in">
        <p className="x-kick">Your points, worked out</p>
        <Step label="Verified bug reports" v={bugs} set={setBugs} />
        <Step label="Merged bounty pull requests" v={prs} set={setPrs} />
        <div className="xlb-calc-row">
          <span>Points a pull request</span>
          <div className="xlb-per" role="radiogroup" aria-label="Points a merged pull request earns">
            {[100, 200, 300, 400, 500].map((p) => <button key={p} type="button" role="radio" aria-checked={per === p} onClick={() => setPer(p)} className="x-mono">+{p}</button>)}
          </div>
        </div>
        <Step label="Qualified referrals" v={refs} set={setRefs} />
        <label className="xlb-calc-row xlb-tok-in">
          <span>Tokens processed <b className="x-mono">{n(tokens)}</b></span>
          <input type="range" min="0" max={TOKS.length - 1} step="1" value={k} onChange={(e) => setK(+e.target.value)} aria-valuetext={n(tokens) + ' tokens'} />
        </label>
      </div>
      <div className="xlb-calc-out" aria-live="polite">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.b key={pts} className="xlb-total" initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -24, opacity: 0 }} transition={{ type: 'spring', stiffness: 380, damping: 30 }}>{n(pts)}</motion.b>
        </AnimatePresence>
        <span className="xlb-total-l">pts</span>
        <p className="xlb-calc-sum x-mono">{bugs} × 50 + {prs} × {per} + {refs} × 20 + {n(fromTokens(tokens))}</p>
        <p>Up to <b>${n(credits)}</b> in AI credits</p>
        <p>{place ? <>Your tokens would sit at <b>#{place}</b> on the global board.</> : <>Below #10 on the global board ({n(ORGS[9][3])} tokens).</>}</p>
      </div>
    </div>
  );
}

function Earn() {
  return (
    <section className="x-sec xlb-earn" aria-labelledby="xlb-earn-h">
      <div className="x-wrap">
        <SecHead kicker="Earn" title="How to earn points & AI credits" lede="Every verified bug report and merged pull request triggers an automatic email notification with your updated points, AI credits, and leaderboard rank." id="xlb-earn-h" />
        <div className="xlb-earn-grid">
          <ul className="xlb-ways">
            {EARN.map(([t, tags, d], i) => (
              <Rise as="li" key={t} delay={i * 0.06} y={18}>
                <b>{t}</b>
                <span className="xlb-tags">{tags.map((g) => <span key={g} className="x-mono">{g}</span>)}</span>
                <p>{d}</p>
              </Rise>
            ))}
          </ul>
          <Calc />
        </div>
        <div className="x-row-links"><More to="/bounty">Browse open bounties</More></div>
      </div>
    </section>
  );
}

export default function Leaderboard() {
  return (
    <main className="xlb">
      <Hero />
      <Contributors />
      <Tokens />
      <Earn />
    </main>
  );
}
