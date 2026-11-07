'use client';
/* Bounties & Rewards. Its idea is the ledger of what a contribution earns.
   Persona: a developer who wants to contribute to Hanzo's open repositories. Goal: take an open bounty.
   CTA: "Every open bounty" (GitHub search of Hanzo's bounty issues). Metric: GitHub click (PLAN-COMPONENTS 1.1, the
   researcher/contributor row).
   V2: 8/10 grey deck: display hero beside the live GitHub window of open bounties; the four ways to earn are huge-figure tiles you can count on (steppers on each tile total your points and credits by Hanzo's own rates and place you against the listed top three); the standings as big totals; the token race scrubbed by scroll as the dark room; a GitHub-style timeline for taking a bounty.
   Signature: the token race: in the dark room the ten organizations' bars race out on a log line as you scroll.
   Beyond: count on the tiles: steppers on each way to earn add up the points and AI credits Hanzo's rates give, with a
   marker placed against the standings Hanzo lists. No words but Hanzo's.
   Motion: scrubbed race (scroll, the signature) + open bounties arriving live with a pulse (time, idle) + tiles lifting
   and steppers springing the marker (pointer, state) + line-mask headline (arrival). 0 UI hues. */
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion, useScroll, useTransform, useMotionValueEvent } from 'motion/react';
import { A } from '../kit';
import { Count } from '../ui';
import LineReveal, { NoJs } from '../v2/LineReveal';
import { SEARCH, REPOS, CONTRIBUTING, useBounties, SAY } from './Bounty.github';
import '../v2/ProgramScale.css';
import './Bounty.css';

const EASE = [0.16, 1, 0.3, 1];
const n = (v) => v.toLocaleString('en-US');

/* The live window: open bounties straight from GitHub. */
function Open() {
  const st = useBounties();
  const items = st.kind === 'ready' ? st.open.items.slice(0, 6) : [];
  const total = st.kind === 'ready' ? st.open.total : 0;
  const more = Math.max(0, total - items.length);
  const say = st.kind === 'reading' ? SAY.reading : st.kind === 'unreachable' ? SAY.unreachable : SAY.none;
  return (
    <div className="xbo-win xp-obj" data-state={st.kind === 'ready' && !total ? 'none' : st.kind}>
      <div className="xbo-win-bar">
        <i className="xbo-live" aria-hidden="true" />
        <span className="xbo-win-k">Bounties &amp; Rewards</span>
        <b>Open bounties</b>
        {total > 0 && <span className="xbo-n x-mono" aria-hidden="true">{n(total)}</span>}
      </div>
      {items.length ? (
        <ul className="xbo-issues">
          {items.map((it, i) => (
            <motion.li key={it.url} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30, delay: i * 0.06 }}>
              <a href={it.url} target="_blank" rel="noopener noreferrer">
                <span className="xbo-dot" aria-hidden="true" />
                <span className="xbo-iss-t">{it.title}</span>
                <span className="xbo-iss-r x-mono">{`${it.repo}#${it.number}`}{it.tier && <em>{it.tier}</em>}</span>
              </a>
            </motion.li>
          ))}
        </ul>
      ) : (
        <div className="xbo-say" role={st.kind === 'reading' ? 'status' : undefined} aria-live="polite">
          <span className="xbo-ghosts" aria-hidden="true"><i /><i /><i /><i /></span>
          {say && <p className="xbo-shimmer">{say}</p>}
          {st.kind === 'unreachable' && <a className="x-btn xp-ghost" href={SEARCH} target="_blank" rel="noopener noreferrer">Every open bounty<i aria-hidden="true">↗</i></a>}
          {st.kind === 'ready' && !total && <a className="x-btn xp-ghost" href="#propose">Propose a bounty<i aria-hidden="true">↓</i></a>}
        </div>
      )}
      {more > 0 && <a className="xbo-more" href={SEARCH} target="_blank" rel="noopener noreferrer"><span>Every open bounty</span><i aria-hidden="true">↗</i></a>}
    </div>
  );
}

function Hero() {
  return (
    <section className="xbo-hero" aria-labelledby="xbo-h1">
      <div className="xp-wrap xp-grid">
        <div className="xbo-copy">
          <LineReveal as="h1" id="xbo-h1" className="xp-display md" lines={['Take an issue.', 'Ship the fix.']} />
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.4 }}>
            <p className="xp-lede xbo-lede">Open issues and bug reports across Hanzo’s repositories. Ship a fix or report a verified bug to earn AI credits and climb the global leaderboard.</p>
            <div className="xbo-acts">
              <a href={SEARCH} target="_blank" rel="noopener noreferrer" className="x-btn solid xp-cta" data-thumb="Every open bounty" data-cta="bounty.hero">Every open bounty<i aria-hidden="true">↗</i></a>
              <A to="/leaderboard" className="xbo-link">Leaderboard</A>
              <A to={CONTRIBUTING} className="xbo-link">How to contribute</A>
            </div>
          </motion.div>
        </div>
        <motion.div className="xbo-hero-win" initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: EASE, delay: 0.25 }}>
          <Open />
        </motion.div>
      </div>
    </section>
  );
}

const WAYS = [
  ['Verified bug report', 50, '+$20 AI credits', 'Report a reproducible bug in Hanzo Dev, Cloud, Console, or SDKs. Earn +50 bounty points and up to $20 in AI credits.'],
  ['Merged bounty pull request', 100, '+$20 AI credits', 'Ship a merged pull request fixing an open GitHub issue labelled bounty. Earn +100 to +500 points and AI credits.'],
  ['Qualified referral', 20, '+$5 AI credits', 'Invite a builder who activates a paid plan or trial. Earn +20 leaderboard points and $5 in AI credits.'],
  ['100K tokens processed', 1, null, 'Every 100,000 tokens processed across Hanzo Cloud models automatically adds +1 point to your global standing.'],
];

const STAND = [
  ['Zach Kelling (@zeekay)', 'Founding Maintainer · #1 Fleet', '1 bugs reported · +450 bounty pts · 106,039,884 tokens (Global #1)', 1510, null],
  ['zlatan mioslav (@valerypetrov)', 'Bug Hunter · Top 10', '3 bugs reported · +150 bounty pts · +$20 AI credits · 4,252,634 tokens (Global #7)', 192, '▲ +5 ranks'],
  ['Antje Worring (@zooqueen)', 'Core Contributor', '0 bugs reported · +200 bounty pts · 5,212,081 tokens (Global #3)', 252, null],
];

/* The four ways to earn, as tiles you can count on: a stepper on each adds to the total by Hanzo's own rates, and the
   marker on the line sits against the standings Hanzo lists. */
const STEP = [1, 1, 1, 1];
function Rewards() {
  const [v, setV] = useState([1, 1, 0, 10]); // bug reports, merged bounty pull requests, qualified referrals, 100K-token blocks
  const [mine, setMine] = useState(false);
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.3 });
  const calm = useReducedMotion();
  const DEMO = [[1, 1, 0, 10], [2, 1, 1, 20], [3, 2, 1, 50], [0, 1, 2, 5]];
  const [d, setD] = useState(0);
  useEffect(() => {
    if (mine || calm || !seen) return;
    const t = setTimeout(() => { const nx = (d + 1) % DEMO.length; setD(nx); setV(DEMO[nx]); }, 2800);
    return () => clearTimeout(t);
  }, [d, mine, calm, seen]); // eslint-disable-line react-hooks/exhaustive-deps
  const [bugs, prs, refs, blocks] = v;
  const lo = bugs * 50 + prs * 100 + refs * 20 + blocks;
  const hi = bugs * 50 + prs * 500 + refs * 20 + blocks;
  const credits = bugs * 20 + prs * 20 + refs * 5;
  const set = (i, x) => { setMine(true); setV((o) => o.map((y, j) => (j === i ? Math.max(0, Math.min(i === 3 ? 1000 : 99, x)) : y))); };
  const MAX = 1700;
  const pos = (p) => Math.min(100, (p / MAX) * 100) + '%';
  return (
    <section className="xp-sec xbo-rewards" aria-labelledby="xbo-rw" ref={box}>
      <div className="xp-wrap">
        <div className="xp-grid xbo-rw-head">
          <h2 id="xbo-rw" className="xp-head xbo-rw-h">Rewards &amp; points</h2>
          <p className="xp-lede xbo-rw-l">Every verified bug report, merged pull request, and token processed on Hanzo Cloud builds your standing and awards AI credits.</p>
        </div>
        <ul className="xbo-ways">
          {WAYS.map(([t, pts, cr, d2], i) => (
            <li key={t} className={'xbo-way w' + i}>
              <span className="xbo-way-fig xp-fig"><span className="xbo-plus">+</span><Count to={pts} /><small> pts</small></span>
              <span className="x-sr">{`+${pts} pts`}</span>
              <div className="xbo-way-b">
                <h3 className="xp-title">{t}</h3>
                {cr && <span className="xbo-cr x-mono">{cr}</span>}
                <p className="xp-body">{d2}</p>
              </div>
              <span className="xbo-step-c">
                <button type="button" onClick={() => set(i, v[i] - STEP[i])} aria-label={'− ' + t} disabled={!v[i]}>−</button>
                <output className="x-mono" aria-live="polite" aria-label={t}>{i === 3 ? n(v[i] * 100000) : v[i]}</output>
                <button type="button" onClick={() => set(i, v[i] + STEP[i])} aria-label={'+ ' + t}>+</button>
              </span>
            </li>
          ))}
        </ul>
        <div className="xbo-total" aria-live="polite">
          <div className="xbo-total-n"><b className="xp-fig">{lo === hi ? n(lo) : `${n(lo)} – ${n(hi)}`}</b><span className="x-mono">pts</span></div>
          <div className="xbo-total-c"><b className="xp-fig">{`+$${n(credits)}`}</b><span className="x-mono">AI credits</span></div>
          <div className="xbo-track" aria-hidden="true">
            <motion.i className="xbo-you" animate={{ left: pos(lo), width: `calc(${pos(hi)} - ${pos(lo)} + 8px)` }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} />
            {STAND.map((st, i) => <span key={st[0]} className="xbo-mk" style={{ left: pos(st[3]) }}><b className="x-mono">#{i + 1}</b></span>)}
          </div>
        </div>
      </div>
    </section>
  );
}

const AWARDS = [
  ['zlatan mioslav (@valerypetrov) · hanzo-inc/cloud#index-lock', '+50 pts · +$20 AI credits', 'Reported stale .git/index.lock failure during post-turn sandbox delivery on large C++ repositories (ClickHouse PR 115724).'],
  ['zlatan mioslav (@valerypetrov) · hanzo-inc/cloud#repo-fallback', '+50 pts', 'Reported Try Again / follow-up repository resolution failure when Forge workspace exists alongside a GitHub fork.'],
  ['zlatan mioslav (@valerypetrov) · hanzo-inc/cloud#slack-thread-pr-review', '+50 pts', 'Reported Slack @Hanzo thread parent context loss and multi-repo PR review handling in channel threads.'],
];

function Standings() {
  return (
    <section className="xp-sec tight xbo-stand" aria-labelledby="xbo-st">
      <div className="xp-wrap">
        <div className="xp-grid xbo-rw-head">
          <h2 id="xbo-st" className="xp-head xbo-rw-h">Top bug hunters &amp; contributors</h2>
          <p className="xp-lede xbo-rw-l">Builders climbing the ranks through verified bug reports, merged bounties, and global token volume.</p>
        </div>
        <ol className="xbo-podium">
          {STAND.map(([who, role, line, pts, up], i) => (
            <li key={who}>
              <span className="xbo-pos x-mono">{`#${i + 1}`}</span>
              <span className="xbo-who">
                <b>{who}</b>
                <span className="xbo-role">{role}{up && <em className="xbo-up">{up}</em>}</span>
                <span className="xbo-line x-mono">{line}</span>
              </span>
              <span className="xbo-pts xp-fig">{n(pts)}<small> pts</small></span>
            </li>
          ))}
        </ol>
        <div className="xp-grid xbo-wire">
          <div className="xbo-wire-h">
            <h3 className="xp-title">Recent verified bug reports &amp; awards</h3>
            <A to="/leaderboard" className="xbo-link">View global token &amp; bounty leaderboard</A>
          </div>
          <ul>
            {AWARDS.map(([h, prize, d]) => (
              <li key={h}>
                <span className="xbo-wire-k x-mono">{h}</span>
                <p>{d}</p>
                <span className="xbo-wire-p x-mono">{prize}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

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
const LOG = (t) => Math.log10(t) - 5; // 100K tokens sits at the left edge; @hanzo's 106M at the right
const TOP = LOG(ORGS[0][3]);

function Lane({ p, i, org }) {
  const [h, badge, req, t] = org;
  const to = LOG(t) / TOP;
  const scaleX = useTransform(p, [0.05 + i * 0.035, 0.55 + i * 0.03], [0, 1], { clamp: true });
  return (
    <li className="xbo-lane">
      <span className="xbo-org-n x-mono">{`#${i + 1}`}</span>
      <span className="xbo-org-w"><b>{h}</b><span className="xbo-badge">{badge}</span><span className="xbo-req x-mono">{req}</span></span>
      <span className="xbo-org-bar" aria-hidden="true"><motion.i style={{ scaleX, width: (to * 100).toFixed(1) + '%' }} /></span>
      <span className="xbo-org-t x-mono">{n(t)} tokens</span>
    </li>
  );
}

/* @hanzo's figure counts with the race; the server and no-JS page carry the real figure. */
function Tally({ p, to }) {
  const ref = useRef(null);
  const v = useTransform(p, [0.05, 0.55], [0, to], { clamp: true });
  useMotionValueEvent(v, 'change', (x) => { if (ref.current) ref.current.textContent = n(Math.round(x)); });
  useEffect(() => { if (ref.current) ref.current.textContent = n(Math.round(v.get())); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return <span ref={ref}>{n(to)}</span>;
}

/* The token race, scrubbed by the scroll, on a log line. */
function Volume() {
  const ref = useRef(null);
  const calm = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.85'] });
  const p = useTransform(scrollYProgress, (v) => (calm ? 1 : v));
  return (
    <section className="xp-sec xp-dark xbo-vol" data-room="dark" aria-labelledby="xbo-vol-h">
      <div className="xp-wrap">
        <div className="xp-grid xbo-vol-head">
          <div className="xbo-vol-hl">
            <p className="xbo-vol-fig xp-fig"><Tally p={p} to={ORGS[0][3]} /></p>
            <p className="xbo-vol-u x-mono"><span>@hanzo</span><span>Core Fleet</span><span>tokens</span></p>
          </div>
          <div className="xbo-vol-hr">
            <h2 id="xbo-vol-h" className="xp-head">Global token volume leaderboard</h2>
            <p className="xp-body">Top 10 active organizations across 217 organizations on Hanzo Cloud by total tokens processed.</p>
          </div>
        </div>
        <ol className="xbo-orgs" ref={ref}>
          {ORGS.map((o, i) => <Lane key={o[0]} p={p} i={i} org={o} />)}
        </ol>
        <div className="xbo-scale x-mono" aria-hidden="true"><span className="xbo-scale-in">{['100K', '1M'].map((t, i) => <span key={t} style={{ left: (i / TOP) * 100 + '%' }}>{t}</span>)}</span></div>
      </div>
    </section>
  );
}

const TAKE = ['Say on the issue that you are taking it.', 'Open a pull request that says Fixes and the issue’s number.', 'A maintainer reviews it, merges it, and credits your account with points and AI credits.'];
const MARKS = [['Issue', 'open'], ['Pull request', 'pr'], ['Merged', 'merged']];

function Take() {
  return (
    <section className="xp-sec xbo-take" aria-labelledby="xbo-take-h">
      <div className="xp-wrap xp-grid">
        <div className="xbo-take-l">
          <h2 id="xbo-take-h" className="xp-head">How a bounty is taken</h2>
          <p className="xp-body xbo-take-note">Verified bug reports and merged bounties earn Hanzo AI credits and leaderboard points, with email notifications sent as you climb ranks.</p>
        </div>
        <ol className="xbo-tl">
          {TAKE.map((t, i) => (
            <li key={t} className={MARKS[i][1]}>
              <span className="xbo-tl-m" aria-hidden="true" />
              <p className="xp-title">{t}</p>
            </li>
          ))}
        </ol>
        <div className="xbo-propose" id="propose">
          <h3 className="xp-title">Propose a bounty</h3>
          <p className="xp-body">Found something worth fixing? Open an issue in its repository saying what is wrong, where, and how a fix is checked, and ask for the bounty label. A maintainer decides.</p>
          <A to={REPOS} className="xbo-link">Hanzo’s repositories</A>
        </div>
        <p className="xbo-sec xp-body">A security issue goes to <a href="mailto:security@hanzo.ai">security@hanzo.ai</a>, never to a public issue.</p>
      </div>
    </section>
  );
}

export default function Bounty() {
  return (
    <main className="xp xbo">
      <NoJs />
      <Hero />
      <Rewards />
      <Standings />
      <Volume />
      <Take />
    </main>
  );
}
