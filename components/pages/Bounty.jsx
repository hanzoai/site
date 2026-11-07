'use client';
/* Bounties & Rewards. Its idea is the ledger of what a contribution earns.
   Signature: the reward receipt. The four ways to earn print themselves onto a till receipt one line at a time, each
   with its points and credits, then the paper tears and prints again; beside the hero, the open bounties arrive live
   from GitHub with a scan running down them.
   Beyond: where would you rank? Count what you would ship (bug reports, merged bounties, referrals, tokens) and see
   the points and credits Hanzo's own rates give, placed on the line against the standings Hanzo lists.
   Every word and figure is Hanzo's; the open bounties are GitHub's, read as the page opens. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { EASE, Rise, Count } from '../ui';
import { A, Go, More, SecHead } from '../kit';
import { SEARCH, REPOS, CONTRIBUTING, useBounties, SAY } from './Bounty.github';
import './Bounty.css';

const n = (v) => v.toLocaleString('en-US');

/* The live window: open bounties straight from GitHub. */
function Open() {
  const st = useBounties();
  const items = st.kind === 'ready' ? st.open.items.slice(0, 6) : [];
  const total = st.kind === 'ready' ? st.open.total : 0;
  const more = Math.max(0, total - items.length);
  const say = st.kind === 'reading' ? SAY.reading : st.kind === 'unreachable' ? SAY.unreachable : SAY.none;
  return (
    <div className="xbo-win" data-state={st.kind === 'ready' && !total ? 'none' : st.kind}>
      <div className="xbo-win-bar">
        <i className="xbo-live" aria-hidden="true" />
        <b>Open bounties</b>
        {total > 0 && <span className="x-mono">{n(total)} open</span>}
      </div>
      {items.length ? (
        <ul className="xbo-issues" style={{ '--n': items.length }}>
          {items.map((it, i) => (
            <motion.li key={it.url} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE, delay: i * 0.05 }} style={{ '--i': i }}>
              <a href={it.url} target="_blank" rel="noopener noreferrer">
                <span className="xbo-iss-r x-mono">{`${it.repo}#${it.number}`}{it.tier && <em>{it.tier}</em>}</span>
                <span className="xbo-iss-t">{it.title}</span>
              </a>
            </motion.li>
          ))}
        </ul>
      ) : (
        <div className="xbo-say" role={st.kind === 'reading' ? 'status' : undefined} aria-live="polite">
          <p className={st.kind === 'reading' ? 'xbo-shimmer' : ''}>{say}</p>
          {st.kind === 'unreachable' && <a className="x-btn" href={SEARCH} target="_blank" rel="noopener noreferrer">Open bounties on GitHub ↗</a>}
        </div>
      )}
      {more > 0 && <a className="xbo-more" href={SEARCH} target="_blank" rel="noopener noreferrer">{n(more)} more on GitHub ↗</a>}
    </div>
  );
}

function Hero() {
  const line = (t, d) => <span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: d }}>{t}</motion.span></span>;
  return (
    <section className="xbo-hero" aria-labelledby="xbo-h1">
      <div className="x-wrap xbo-grid">
        <div>
          <motion.p className="x-kick" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>Bounties &amp; Rewards</motion.p>
          <h1 id="xbo-h1" className="xbo-h1">{line('Take an issue.', 0.05)}{line('Ship the fix.', 0.17)}</h1>
          <motion.p className="xbo-lede" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}>Open issues and bug reports across Hanzo’s repositories. Ship a fix or report a verified bug to earn AI credits and climb the global leaderboard.</motion.p>
          <motion.div className="xbo-acts" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}>
            <motion.a href={SEARCH} target="_blank" rel="noopener noreferrer" className="x-btn solid" data-thumb="Every open bounty" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>Every open bounty ↗</motion.a>
            <Go to="/leaderboard">Leaderboard</Go>
            <Go to={CONTRIBUTING}>How to contribute</Go>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.2 }}>
          <Open />
        </motion.div>
      </div>
    </section>
  );
}

const WAYS = [
  ['Verified bug report', 50, '+$20 AI credits', 'Report a reproducible bug in Hanzo Dev, Cloud, Console, or SDKs. Earn +50 bounty points and up to $20 in AI credits.'],
  ['Merged bounty pull request', 100, null, 'Ship a merged pull request fixing an open GitHub issue labelled bounty. Earn +100 to +500 points and AI credits.'],
  ['Qualified referral', 20, '+$5 AI credits', 'Invite a builder who activates a paid plan or trial. Earn +20 leaderboard points and $5 in AI credits.'],
  ['100K tokens processed', 1, null, 'Every 100,000 tokens processed across Hanzo Cloud models automatically adds +1 point to your global standing.'],
];

/* The receipt prints its lines one by one while it is seen, tears, and prints again. */
function Receipt() {
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.35 });
  const calm = useReducedMotion();
  const [k, setK] = useState(WAYS.length); // lines printed
  const [run, setRun] = useState(0);
  useEffect(() => {
    if (calm || !seen) { setK(WAYS.length); return; }
    const t = setTimeout(() => { if (k < WAYS.length) setK(k + 1); else { setK(0); setRun((r) => r + 1); } }, k === 0 ? 500 : k < WAYS.length ? 900 : 6500);
    return () => clearTimeout(t);
  }, [k, seen, calm]);
  return (
    <div className="xbo-till" ref={box}>
      <div className="xbo-slot" aria-hidden="true" />
      <motion.div className="xbo-paper" key={run} initial={calm ? false : { y: -20, opacity: 0.6 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, ease: EASE }}>
        <p className="xbo-paper-h x-mono">Rewards &amp; points</p>
        <ol className="xbo-lines">
          {WAYS.map(([t, pts, cr, d], i) => (
            <motion.li key={t} initial={false} animate={i < k ? { opacity: 1, y: 0 } : { opacity: 0, y: -14 }} transition={{ duration: 0.55, ease: EASE }}>
              <div className="xbo-line-h">
                <h3>{t}</h3>
                <i aria-hidden="true" />
                <span className="xbo-pts x-mono">{`+${pts} pts`}</span>
              </div>
              {cr && <span className="xbo-cr x-mono">{cr}</span>}
              <p>{d}</p>
            </motion.li>
          ))}
        </ol>
        <i className="xbo-tear" aria-hidden="true" />
      </motion.div>
    </div>
  );
}

const STAND = [
  ['Zach Kelling (@zeekay)', 'Founding Maintainer · #1 Fleet', '1 bugs reported · +450 bounty pts · 106,039,884 tokens (Global #1)', 1510, null],
  ['zlatan mioslav (@valerypetrov)', 'Bug Hunter · Top 10', '3 bugs reported · +150 bounty pts · +$20 AI credits · 4,252,634 tokens (Global #7)', 192, '▲ +5 ranks'],
  ['Antje Worring (@zooqueen)', 'Core Contributor', '0 bugs reported · +200 bounty pts · 5,212,081 tokens (Global #3)', 252, null],
];

/* Count what you would ship; Hanzo's rates give the points and credits, placed against the listed standings. */
function Rank() {
  const [v, setV] = useState([1, 1, 0, 10]); // bugs, merged PRs, referrals, 100K-token blocks
  const [mine, setMine] = useState(false);
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.4 });
  const calm = useReducedMotion();
  const DEMO = [[1, 1, 0, 10], [2, 1, 1, 20], [3, 2, 1, 50], [0, 1, 2, 5]];
  const [d, setD] = useState(0);
  useEffect(() => {
    if (mine || calm || !seen) return;
    const t = setTimeout(() => { const nx = (d + 1) % DEMO.length; setD(nx); setV(DEMO[nx]); }, 2600);
    return () => clearTimeout(t);
  }, [d, mine, calm, seen]); // eslint-disable-line react-hooks/exhaustive-deps
  const [bugs, prs, refs, blocks] = v;
  const lo = bugs * 50 + prs * 100 + refs * 20 + blocks;
  const hi = bugs * 50 + prs * 500 + refs * 20 + blocks;
  const credits = bugs * 20 + refs * 5;
  const set = (i, x) => { setMine(true); setV((o) => o.map((y, j) => (j === i ? Math.max(0, Math.min(i === 3 ? 100000 : 999, x)) : y))); };
  const F = [['Verified bug reports', 'up to $20 credits each'], ['Merged bounty pull requests', '+100 to +500 pts each'], ['Qualified referrals', '$5 credits each'], ['Tokens processed', '+1 pt per 100,000']];
  const MAX = 1700;
  const pos = (p) => Math.min(100, (p / MAX) * 100) + '%';
  const passed = STAND.map((s, i) => [i + 1, s[3]]).filter(([, p]) => lo > p);
  return (
    <div className="xbo-rank" ref={box}>
      <h3 className="xbo-rank-h">Where would you rank?</h3>
      <div className="xbo-steppers">
        {F.map(([t, rate], i) => (
          <div key={t} className="xbo-step">
            <span className="xbo-step-t"><b>{t}</b><small>{rate}</small></span>
            <span className="xbo-step-c">
              <button type="button" onClick={() => set(i, v[i] - 1)} aria-label={`Fewer ${t.toLowerCase()}`} disabled={!v[i]}>−</button>
              <output className="x-mono" aria-live="polite">{i === 3 ? n(v[i] * 100000) : v[i]}</output>
              <button type="button" onClick={() => set(i, v[i] + 1)} aria-label={`More ${t.toLowerCase()}`}>+</button>
            </span>
          </div>
        ))}
      </div>
      <div className="xbo-out">
        <div><span>Points</span><b className="x-mono">{lo === hi ? n(lo) : `${n(lo)} – ${n(hi)}`}</b></div>
        <div><span>AI credits</span><b className="x-mono">{credits ? `up to $${n(credits)}` : '—'}{prs > 0 && <small> + AI credits for merged pull requests</small>}</b></div>
      </div>
      <div className="xbo-track" aria-hidden="true">
        <motion.i className="xbo-you" animate={{ left: pos(lo), width: `calc(${pos(hi)} - ${pos(lo)} + 4px)` }} transition={{ type: 'spring', stiffness: 160, damping: 24 }} />
        {STAND.map((s, i) => <span key={s[0]} className="xbo-mk" style={{ left: pos(s[3]) }}><b className="x-mono">#{i + 1}</b></span>)}
      </div>
      <p className="xbo-rank-note" aria-live="polite">{passed.length ? `At the low end, past the points of ${new Intl.ListFormat('en', { type: 'conjunction' }).format(passed.map(([r]) => '#' + r))} as Hanzo lists them.` : 'Below the points of the top three as Hanzo lists them.'}</p>
    </div>
  );
}

function Rewards() {
  return (
    <section className="x-sec xbo-rewards">
      <div className="x-wrap xbo-split">
        <div className="xbo-sticky">
          <SecHead title="Rewards & points" lede="Every verified bug report, merged pull request, and token processed on Hanzo Cloud builds your standing and awards AI credits." />
          <Rise delay={0.15}><Rank /></Rise>
        </div>
        <Receipt />
      </div>
    </section>
  );
}

const AWARDS = [
  ['zlatan mioslav (@valerypetrov) · hanzo-inc/cloud#index-lock', 'Reported stale .git/index.lock failure during post-turn sandbox delivery on large C++ repositories (ClickHouse PR 115724).'],
  ['zlatan mioslav (@valerypetrov) · hanzo-inc/cloud#repo-fallback', 'Reported Try Again / follow-up repository resolution failure when Forge workspace exists alongside a GitHub fork.'],
  ['zlatan mioslav (@valerypetrov) · hanzo-inc/cloud#slack-thread-pr-review', 'Reported Slack @Hanzo thread parent context loss and multi-repo PR review handling in channel threads.'],
];

function Standings() {
  return (
    <section className="x-sec xbo-stand">
      <div className="x-wrap">
        <SecHead title="Top bug hunters & contributors" lede="Builders climbing the ranks through verified bug reports, merged bounties, and global token volume." />
        <ol className="xbo-podium">
          {STAND.map(([who, role, line, pts, up], i) => (
            <li key={who}>
              <span className="xbo-pos">{`#${i + 1}`}</span>
              <span className="xbo-who">
                <b>{who}</b>
                <span className="xbo-role">{role}{up && <em className="xbo-up">{up}</em>}</span>
                <span className="xbo-line x-mono">{line}</span>
              </span>
              <span className="xbo-total x-mono"><Count to={pts} suffix=" pts" /></span>
            </li>
          ))}
        </ol>
        <div className="xbo-wire">
          <h3>Recent verified bug reports &amp; awards</h3>
          <ul>
            {AWARDS.map(([h, d], i) => (
              <li key={h}>
                <span className="xbo-wire-h x-mono">{h}</span>
                <span className="xbo-wire-p x-mono">+50 pts · +$20 AI credits</span>
                <p>{d}</p>
              </li>
            ))}
          </ul>
          <div className="x-row-links"><More to="/leaderboard">View global token &amp; bounty leaderboard</More></div>
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

/* Token volume on a log line: one hundred million and half a million share one picture honestly. */
function Volume() {
  const top = LOG(ORGS[0][3]);
  return (
    <section className="x-sec xbo-vol" data-room="dark">
      <div className="x-wrap">
        <SecHead dark title="Global token volume leaderboard" lede="Top 10 active organizations across 217 organizations on Hanzo Cloud by total tokens processed." />
        <ol className="xbo-orgs">
          {ORGS.map(([h, badge, req, t], i) => (
            <li key={h}>
              <span className="xbo-org-n x-mono">{`#${i + 1}`}</span>
              <span className="xbo-org-w"><b>{h}</b><span className="xbo-badge">{badge}</span><span className="xbo-req x-mono">{req}</span></span>
              <span className="xbo-org-bar" aria-hidden="true"><motion.i initial={{ scaleX: 0 }} whileInView={{ scaleX: LOG(t) / top }} viewport={{ once: true, amount: 0.8 }} transition={{ duration: 1.1, ease: EASE, delay: i * 0.05 }} /></span>
              <span className="xbo-org-t x-mono">{n(t)} tokens</span>
            </li>
          ))}
        </ol>
        <p className="xbo-scale x-mono" aria-hidden="true"><span>100K</span><span>1M</span><span>10M</span><span>100M</span></p>
      </div>
    </section>
  );
}

const TAKE = ['Say on the issue that you are taking it.', 'Open a pull request that says Fixes and the issue’s number.', 'A maintainer reviews it, merges it, and credits your account with points and AI credits.'];

function Take() {
  return (
    <section className="x-sec xbo-take">
      <div className="x-wrap">
        <SecHead title="How a bounty is taken" />
        <ol className="xbo-take-steps">
          {TAKE.map((t, i) => (
            <li key={t}>
              <span className="xbo-take-n x-mono">{String(i + 1).padStart(2, '0')}</span>
              <p>{t}</p>
            </li>
          ))}
        </ol>
        <p className="xbo-take-note">Verified bug reports and merged bounties earn Hanzo AI credits and leaderboard points, with email notifications sent as you climb ranks.</p>
        <div className="xbo-propose">
          <div>
            <h3>Propose a bounty</h3>
            <p>Found something worth fixing? Open an issue in its repository saying what is wrong, where, and how a fix is checked, and ask for the bounty label. A maintainer decides.</p>
            <div className="x-row-links tight"><More to={REPOS}>Hanzo’s repositories</More></div>
          </div>
          <p className="xbo-sec">A security issue goes to <a href="mailto:security@hanzo.ai">security@hanzo.ai</a>, never to a public issue.</p>
        </div>
      </div>
    </section>
  );
}

export default function Bounty() {
  return (
    <main className="xbo">
      <Hero />
      <Rewards />
      <Standings />
      <Volume />
      <Take />
    </main>
  );
}
