'use client';
/* Bounties & Rewards. Its idea is the ledger of what a contribution earns.
   V2: 8/10 rebuilt as five screens: display hero beside the live GitHub window of open bounties; the four ways to earn as a tile grid of huge point figures, with the rank calculator opening beneath; the standings as an editorial table of big totals; the token race as the dark room; how a bounty is taken as a GitHub timeline.
   Signature: the token race: in the dark room the ten organizations' bars race out on a log line as you scroll,
   scrubbed by the scroll itself, @hanzo's hundred million and @Aeonaby's half million drawn honestly on one picture.
   Beyond: where would you rank? Count what you would ship (bug reports, merged bounties, referrals, tokens) and see
   the points and credits Hanzo's own rates give, placed against the standings Hanzo lists.
   Motion: scrubbed race (signature) + line-masked hero type + open bounties arriving live + the rank drawer's spring.
   Accent: GitHub's open green. Every word and figure is Hanzo's; the open bounties are GitHub's, read as the page opens. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { A } from '../kit';
import LineReveal from '../v2/LineReveal';
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
        <b>Open bounties</b>
        {total > 0 && <span className="x-mono">{n(total)} open</span>}
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
          <p className={st.kind === 'reading' ? 'xbo-shimmer' : ''}>{say}</p>
          {st.kind === 'unreachable' && <a className="xp-ghost" href={SEARCH} target="_blank" rel="noopener noreferrer">Open bounties on GitHub ↗</a>}
        </div>
      )}
      {more > 0 && <a className="xbo-more" href={SEARCH} target="_blank" rel="noopener noreferrer">{n(more)} more on GitHub ↗</a>}
    </div>
  );
}

function Hero() {
  return (
    <section className="xbo-hero" aria-labelledby="xbo-h1">
      <div className="xp-wrap xp-grid">
        <div className="xbo-copy">
          <p className="xp-kick">Bounties &amp; Rewards</p>
          <LineReveal as="h1" id="xbo-h1" className="xp-display md" lines={['Take an issue.', 'Ship the fix.']} />
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.4 }}>
            <p className="xp-lede xbo-lede">Open issues and bug reports across Hanzo’s repositories. Ship a fix or report a verified bug to earn AI credits and climb the global leaderboard.</p>
            <div className="xbo-acts">
              <a href={SEARCH} target="_blank" rel="noopener noreferrer" className="xp-cta" data-thumb="Every open bounty">Every open bounty<i aria-hidden="true">↗</i></a>
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
  ['Merged bounty pull request', 100, null, 'Ship a merged pull request fixing an open GitHub issue labelled bounty. Earn +100 to +500 points and AI credits.'],
  ['Qualified referral', 20, '+$5 AI credits', 'Invite a builder who activates a paid plan or trial. Earn +20 leaderboard points and $5 in AI credits.'],
  ['100K tokens processed', 1, null, 'Every 100,000 tokens processed across Hanzo Cloud models automatically adds +1 point to your global standing.'],
];

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
        <div><span>AI credits</span><b className="x-mono">{credits ? `up to $${n(credits)}` : '—'}</b>{prs > 0 && <small>+ AI credits for merged pull requests</small>}</div>
        <div className="xbo-track" aria-hidden="true">
          <motion.i className="xbo-you" animate={{ left: pos(lo), width: `calc(${pos(hi)} - ${pos(lo)} + 6px)` }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} />
          {STAND.map((s, i) => <span key={s[0]} className="xbo-mk" style={{ left: pos(s[3]) }}><b className="x-mono">#{i + 1}</b></span>)}
        </div>
        <p className="xbo-rank-note" aria-live="polite">{passed.length ? `At the low end, past the points of ${new Intl.ListFormat('en', { type: 'conjunction' }).format(passed.map(([r]) => '#' + r))} as Hanzo lists them.` : 'Below the points of the top three as Hanzo lists them.'}</p>
      </div>
    </div>
  );
}

function Rewards() {
  const [open, setOpen] = useState(false);
  return (
    <section className="xp-sec xbo-rewards" aria-labelledby="xbo-rw">
      <div className="xp-wrap">
        <div className="xp-grid xbo-rw-head">
          <h2 id="xbo-rw" className="xp-head xbo-rw-h">Rewards &amp; points</h2>
          <p className="xp-lede xbo-rw-l">Every verified bug report, merged pull request, and token processed on Hanzo Cloud builds your standing and awards AI credits.</p>
        </div>
        <ul className="xbo-ways">
          {WAYS.map(([t, pts, cr, d], i) => (
            <li key={t} className={'xbo-way w' + i}>
              <span className="xbo-way-fig xp-fig"><span className="xbo-plus">+</span>{pts}<small> pts</small></span>
              <span className="x-sr">{`+${pts} pts`}</span>
              <div className="xbo-way-b">
                <h3 className="xp-title">{t}</h3>
                {cr && <span className="xbo-cr x-mono">{cr}</span>}
                <p className="xp-body">{d}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="xbo-drawer">
          <button type="button" className="xbo-drawer-b" aria-expanded={open} aria-controls="xbo-rank" onClick={() => setOpen((o) => !o)}>
            <span>Where would you rank?</span>
            <motion.i aria-hidden="true" animate={{ rotate: open ? 45 : 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>+</motion.i>
          </button>
          <motion.div id="xbo-rank" className="xbo-drawer-in" initial={false} animate={open ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }} transition={{ duration: 0.5, ease: EASE }} inert={!open}>
            <Rank />
          </motion.div>
        </div>
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
              <span className="xbo-total xp-fig">{n(pts)}<small> pts</small></span>
            </li>
          ))}
        </ol>
        <div className="xp-grid xbo-wire">
          <div className="xbo-wire-h">
            <h3 className="xp-title">Recent verified bug reports &amp; awards</h3>
            <A to="/leaderboard" className="xbo-link">View global token &amp; bounty leaderboard</A>
          </div>
          <ul>
            {AWARDS.map(([h, d]) => (
              <li key={h}>
                <span className="xbo-wire-k x-mono">{h}</span>
                <p>{d}</p>
                <span className="xbo-wire-p x-mono">+50 pts · +$20 AI credits</span>
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
  const scaleX = useTransform(p, [0.05 + i * 0.035, 0.55 + i * 0.03], [0, to], { clamp: true });
  return (
    <li>
      <span className="xbo-org-n x-mono">{`#${i + 1}`}</span>
      <span className="xbo-org-w"><b>{h}</b><span className="xbo-badge">{badge}</span><span className="xbo-req x-mono">{req}</span></span>
      <span className="xbo-org-bar" aria-hidden="true"><motion.i style={{ scaleX }} /></span>
      <span className="xbo-org-t x-mono">{n(t)} tokens</span>
    </li>
  );
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
            <p className="xp-kick">@hanzo · Core Fleet</p>
            <p className="xbo-vol-fig xp-fig">106,039,884</p>
            <p className="xbo-vol-u x-mono">tokens</p>
          </div>
          <div className="xbo-vol-hr">
            <h2 id="xbo-vol-h" className="xp-head">Global token volume leaderboard</h2>
            <p className="xp-body">Top 10 active organizations across 217 organizations on Hanzo Cloud by total tokens processed.</p>
          </div>
        </div>
        <ol className="xbo-orgs" ref={ref}>
          {ORGS.map((o, i) => <Lane key={o[0]} p={p} i={i} org={o} />)}
        </ol>
        <div className="xbo-scale x-mono" aria-hidden="true"><span className="xbo-scale-in">{['100K', '1M', '10M', '100M'].map((t, i) => <span key={t} style={{ left: (i / TOP) * 100 + '%' }}>{t}</span>)}</span></div>
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
              <span className="xbo-tl-k x-mono">{MARKS[i][0]}</span>
              <p className="xp-title">{t}</p>
            </li>
          ))}
        </ol>
        <div className="xbo-propose">
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
      <Hero />
      <Rewards />
      <Standings />
      <Volume />
      <Take />
    </main>
  );
}
