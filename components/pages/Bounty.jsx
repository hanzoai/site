'use client';
/* Bounties & Rewards. Its idea is the ledger of what a contribution earns.
   Persona: a developer who wants to contribute to Hanzo's open repositories. Goal: take an open bounty.
   CTA: "Every open bounty" (GitHub search of Hanzo's bounty issues). Metric: github_click.
   V2: 8/10 grey deck: display hero beside the GitHub window of open bounties (live, or the build snapshot) where the newest bounty arrives once and the count ticks up, then a reader walks the rows; countable reward tiles; the standings as big totals; the awards as one deck that deals; the token race as one pinned scene in the dark room; how a bounty is taken as the PR itself, pinned while it goes open → pull request → merged; a closing band with the page's headline and its one ask, held in the header to the footer.
   Signature: the token race: in the dark room the ten organizations' bars race out on a log line as you scroll.
   Beyond: count on the tiles: steppers on each way to earn add up the points and AI credits Hanzo's rates give, with a
   marker placed against the standings Hanzo lists. No words but Hanzo's.
   Motion: scrubbed race with @hanzo's figure growing 52→84px while it is the moment (scroll, the signature) + open
   bounty arriving and the count ticking (time, idle) + the awards deck dealing (time) + steppers gliding the marker (pointer,
   state) + line-mask headline (arrival) + the PR changing state as it is read (state). 0 UI hues. */
import { useEffect, useRef, useState } from 'react';
import { motion, animate, useInView, useReducedMotion, useTransform, useMotionValue, useMotionValueEvent } from 'motion/react';
import { A, Cta } from '../kit';
import { Count } from '../ui';
import LineReveal, { NoJs } from '../v2/LineReveal';
import { SEARCH, REPOS, CONTRIBUTING, useBounties, SAY } from './Bounty.github';
import { SNAP } from './Bounty.snapshot';
import { useEnter } from './bounty/enter';
import './bounty/enter.css';
import '../v2/ProgramScale.css';
import './Bounty.css';

const EASE = [0.16, 1, 0.3, 1];
const n = (v) => v.toLocaleString('en-US');

/* The live window: open bounties straight from GitHub, the build snapshot until it answers (or when it does not).
   Once the list is in, the newest bounty arrives at the top and the count ticks up by one; then a quiet reader walks
   the rows (paused under the pointer, off screen and under reduced motion). */
function Open({ st }) {
  const live = st.kind === 'ready';
  const data = live ? st.open : SNAP;
  const items = data.items.slice(0, 6);
  const total = data.total;
  const more = Math.max(0, total - items.length);
  const calm = useReducedMotion();
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.4 });
  const [arrived, setArrived] = useState(false);
  const [walk, setWalk] = useState(-1);
  const [hold, setHold] = useState(false);
  useEffect(() => {
    if (calm) { setArrived(true); return; }
    const t = setTimeout(() => setArrived(true), 2400);
    return () => clearTimeout(t);
  }, [calm]);
  useEffect(() => {
    if (!arrived || calm || !seen || hold || !items.length) return;
    const t = setTimeout(() => setWalk((w) => (w + 1) % items.length), walk < 0 ? 2600 : 3200);
    return () => clearTimeout(t);
  }, [arrived, calm, seen, hold, walk, items.length]);
  const say = SAY.none;
  return (
    <div ref={box} className="xbo-win xp-obj" data-state={live && !total ? 'none' : 'ready'}
      onPointerEnter={() => setHold(true)} onPointerLeave={() => setHold(false)} onFocus={() => setHold(true)} onBlur={() => setHold(false)}>
      <div className="xbo-win-bar">
        <i className="xbo-live" aria-hidden="true" />
        <span className="xbo-win-k">Bounties &amp; Rewards</span>
        <b>Open bounties</b>
        {total > 0 && (
          <span className="xbo-n x-mono" aria-hidden="true">
            <span className="xbo-roll" data-on={arrived ? 'y' : 'n'}><i>{n(Math.max(0, total - 1))}</i><i>{n(total)}</i></span>
          </span>
        )}
      </div>
      {items.length ? (
        <ul className="xbo-issues">
          {items.map((it, i) => (
            <li key={it.url} style={{ '--i': i }} className={(i === 0 ? (arrived ? 'fresh' : 'pend') : '') + (walk === i ? ' walk' : '')}>
              <div className="xbo-iss-in">
                <a href={it.url} target="_blank" rel="noopener noreferrer" tabIndex={i === 0 && !arrived ? -1 : undefined}>
                  <span className="xbo-dot" aria-hidden="true" />
                  <span className="xbo-iss-t">{it.title}</span>
                  <span className="xbo-iss-r x-mono">{`${it.repo}#${it.number}`}{it.tier && <em>{it.tier}</em>}</span>
                </a>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="xbo-say" role={st.kind === 'reading' ? 'status' : undefined} aria-live="polite">
          <span className="xbo-ghosts" aria-hidden="true"><i /><i /><i /><i /></span>
          {say && <p className="xbo-shimmer">{say}</p>}
          <Cta to="#propose" kind="quiet" id="bounty.propose" className="xp-ghost">Propose a bounty</Cta>
        </div>
      )}
      <p className="xbo-asking x-mono" role="status" data-on={st.kind === 'reading' ? 'y' : 'n'} aria-hidden={st.kind === 'reading' ? undefined : true}><span>{SAY.reading}</span></p>
      {more > 0 && <a className="xbo-more" href={SEARCH} target="_blank" rel="noopener noreferrer" data-cta="bounty.window"><span>Every open bounty</span><i aria-hidden="true">↗</i></a>}
    </div>
  );
}

/* Phones keep Hanzo's "Try Hanzo" solid in the header; while this hero's own solid ask is on screen the header's
   button reads as an outline (the same html[data-ask=quiet] the shell sets on desktop), so one solid shows at a time. */
function useOneSolidOnPhone() {
  useEffect(() => {
    const H = document.documentElement;
    const mq = matchMedia('(max-width: 700px)');
    const el = document.querySelector('main.xbo [data-cta="bounty.hero"]');
    if (!el) return;
    let mine = false, vis = false;
    const apply = () => {
      if (mq.matches && vis) { H.dataset.ask = 'quiet'; mine = true; }
      else if (mine) { delete H.dataset.ask; mine = false; }
    };
    const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; apply(); });
    io.observe(el);
    const timers = [300, 1400].map((ms) => setTimeout(apply, ms)); // after the shell's own first pass
    mq.addEventListener('change', apply);
    return () => { io.disconnect(); timers.forEach(clearTimeout); mq.removeEventListener('change', apply); if (mine) delete H.dataset.ask; };
  }, []);
}

/* Desktop: once the hero's ask has gone by, the header's button says "Every open bounty" down to the footer. The shell
   writes it once and caches that it did; when the header's text is put back under it (a header re-render), the shell
   does not notice and "Try Hanzo" returns mid-page. This re-asserts the page's ask, only while the hero's ask is above
   the header, and leaves everything else to the shell (docs/requests/bounty.md). */
function useHoldHeaderAsk() {
  useEffect(() => {
    const mq = matchMedia('(min-width: 701px)');
    const hero = document.querySelector('main.xbo [data-cta="bounty.hero"]');
    const head = document.querySelector('header[data-slot=masthead]');
    if (!hero || !head) return;
    const label = hero.textContent.trim();
    const to = hero.getAttribute('href');
    let t = 0;
    const fix = () => {
      const btn = head.querySelector('a[data-x-ask]');
      if (!btn || !mq.matches || hero.getBoundingClientRect().bottom >= 60) return;
      if (btn.textContent !== label) btn.textContent = label;
      if (btn.getAttribute('href') !== to) btn.setAttribute('href', to);
      if (btn.getAttribute('data-cta') !== 'header-ask') btn.setAttribute('data-cta', 'header-ask');
    };
    const soon = () => { clearTimeout(t); t = setTimeout(fix, 120); };
    addEventListener('scroll', soon, { passive: true });
    const mo = new MutationObserver(soon);
    mo.observe(head, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['href'] });
    return () => { clearTimeout(t); removeEventListener('scroll', soon); mo.disconnect(); };
  }, []);
}

function Hero({ st }) {
  useOneSolidOnPhone();
  useHoldHeaderAsk();
  return (
    <section className="xbo-hero" aria-labelledby="xbo-h1">
      <div className="xp-wrap xp-grid">
        <div className="xbo-copy">
          <LineReveal as="h1" id="xbo-h1" className="xp-display md" lines={['Take an issue.', 'Ship the fix.']} />
          <div className="xbo-in" style={{ '--d': '.12s' }}>
            <p className="xp-lede xbo-lede">Open issues and bug reports across Hanzo’s repositories. Ship a fix or report a verified bug to earn AI credits and climb the global leaderboard.</p>
            <div className="xbo-acts">
              <Cta to={SEARCH} id="bounty.hero" thumb className="xp-cta">Every open bounty</Cta>
              <A to="/leaderboard" className="xbo-link" data-cta="bounty.leaderboard">Leaderboard</A>
              <A to={CONTRIBUTING} className="xbo-link" data-cta="bounty.contributing">How to contribute</A>
            </div>
          </div>
        </div>
        <div className="xbo-hero-win xbo-in" style={{ '--d': '.05s', '--y': '32px' }}>
          <Open st={st} />
        </div>
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
        <ul className="xbo-ways" data-enter="fold-out">
          {WAYS.map(([t, pts, cr, d2], i) => (
            <li key={t} className={'xbo-way w' + i} style={{ '--k': i }}>
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
            <motion.i className="xbo-you" animate={{ left: pos(lo), width: `calc(${pos(hi)} - ${pos(lo)} + 8px)` }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} />
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

/* The awards as one deck: the front report is read, the two behind it peek; it deals the next one every 5s while in
   view (paused under the pointer or focus), and the three bars below pick one and show its time running. */
const DEAL = 5000;
function Awards() {
  const [cur, setCur] = useState(0);
  const [hold, setHold] = useState(false);
  const ref = useRef(null);
  const seen = useInView(ref, { amount: 0.5 });
  const calm = useReducedMotion();
  const run = seen && !hold && !calm;
  useEffect(() => {
    if (!run) return;
    const t = setTimeout(() => setCur((c) => (c + 1) % AWARDS.length), DEAL);
    return () => clearTimeout(t);
  }, [cur, run]);
  return (
    <div className="xbo-deck" ref={ref} onPointerEnter={() => setHold(true)} onPointerLeave={() => setHold(false)} onFocus={() => setHold(true)} onBlur={() => setHold(false)}>
      <ul className="xp-obj xbo-aw">
        {AWARDS.map(([h, prize, d], i) => {
          const pos = (i - cur + AWARDS.length) % AWARDS.length;
          return (
            <li key={h} data-pos={pos} onClick={() => pos && setCur(i)}>
              <span className="xbo-wire-k x-mono">{h}</span>
              <p>{d}</p>
              <span className="xbo-wire-p x-mono">{prize}</span>
            </li>
          );
        })}
      </ul>
      <div className="xbo-deck-pg">
        {AWARDS.map(([h], i) => (
          <button key={h} type="button" aria-label={h} aria-pressed={i === cur} data-sound="tick" onClick={() => setCur(i)}>
            <i key={i === cur ? 'on' + cur : 'off'} data-run={i === cur && run ? 'y' : 'n'} />
          </button>
        ))}
      </div>
    </div>
  );
}

function Standings() {
  return (
    <section className="xp-sec tight xbo-stand" aria-labelledby="xbo-st">
      <div className="xp-wrap">
        <div className="xp-grid xbo-rw-head">
          <h2 id="xbo-st" className="xp-head xbo-rw-h">Top bug hunters &amp; contributors</h2>
          <p className="xp-lede xbo-rw-l">Builders climbing the ranks through verified bug reports, merged bounties, and global token volume.</p>
        </div>
        <ol className="xbo-podium" data-enter="domino">
          {STAND.map(([who, role, line, pts, up], i) => (
            <li key={who} style={{ '--k': i }}>
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
          <Awards />
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

/* The token race, a plain section on a log line: once it is in view the ten bars race out in time (2.6s) while
   @hanzo's figure counts and grows; reduced motion shows the finished race. */
function Volume() {
  const ref = useRef(null);
  const p = useMotionValue(0);
  const seen = useInView(ref, { amount: 0.3, once: true });
  useEffect(() => {
    if (!seen) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { p.set(1); return; }
    const c = animate(p, 1, { duration: 2.6, ease: [0.33, 0, 0.2, 1], delay: 0.35 });
    return () => c.stop();
  }, [seen, p]);
  const grow = useTransform(p, [0.05, 0.55], [0.62, 1], { clamp: true }); // 52px while the race waits, 84px once it has run
  return (
    <section className="xp-sec xp-dark xbo-vol" data-room="dark" aria-labelledby="xbo-vol-h">
      <div className="xbo-vpin" ref={ref}>
      <div className="xp-wrap xbo-vstage" data-enter="blinds">
        <div className="xp-grid xbo-vol-head">
          <div className="xbo-vol-hl">
            <motion.p className="xbo-vol-fig xp-fig" style={{ scale: grow }}><Tally p={p} to={ORGS[0][3]} /></motion.p>
            <p className="xbo-vol-u x-mono"><span>@hanzo</span><span>Core Fleet</span><span>tokens</span></p>
          </div>
          <div className="xbo-vol-hr">
            <h2 id="xbo-vol-h" className="xp-head">Global token volume leaderboard</h2>
            <p className="xp-body">Top 10 active organizations across 217 organizations on Hanzo Cloud by total tokens processed.</p>
          </div>
        </div>
        <ol className="xbo-orgs">
          {ORGS.map((o, i) => <Lane key={o[0]} p={p} i={i} org={o} />)}
        </ol>
        <div className="xbo-scale x-mono" aria-hidden="true"><span className="xbo-scale-in">{['100K', '1M'].map((t, i) => <span key={t} style={{ left: (i / TOP) * 100 + '%' }}>{t}</span>)}</span></div>
      </div>
      </div>
    </section>
  );
}

const TAKE = ['Say on the issue that you are taking it.', 'Open a pull request that says Fixes and the issue’s number.', 'A maintainer reviews it, merges it, and credits your account with points and AI credits.'];
const PROPOSE = 'Propose a bounty';

function Glyph() {
  return (
    <svg className="xbo-gl" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
      <g className="g0" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="2.6" fill="currentColor" stroke="none" /></g>
      <g className="g1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="6.5" cy="5.5" r="2.2" /><circle cx="6.5" cy="18.5" r="2.2" /><circle cx="17.5" cy="18.5" r="2.2" /><path d="M6.5 7.7v8.6M17.5 16.3V9.5a3 3 0 0 0-3-3H11" /><path d="m13 4.3-2.2 2.2L13 8.7" /></g>
      <g className="g2"><circle cx="12" cy="12" r="11" fill="currentColor" /><path d="m7.2 12.3 3.1 3.1 6.5-6.6" fill="none" stroke="var(--xbo-gl-on, #fff)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></g>
    </svg>
  );
}

/* The signature, one question at a time: how a bounty is taken, one step per screen, sliding to the next, with the
   answer summarised as it builds in the PR beside it (the issue you picked, the "Fixes" line, what a merge credits).
   It never submits anything: picking an issue only fills the summary, and the only ways out are links to GitHub.
   Keyboard: every choice and arrow is a button; ← → move between steps when the flow has focus. Touch: swipe. JS off:
   every step is shown in order. Reduced motion: steps change without the slide. */
function Take({ st }) {
  const issues = ((st.kind === 'ready' && st.open.items.length) ? st.open.items : SNAP.items).slice(0, 3);
  const [q, setQ] = useState(0);
  const [pick, setPick] = useState(null);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const it = pick != null ? issues[pick] || issues[0] : null;
  const last = TAKE.length; // the 4th screen is "Propose a bounty"
  const go = (i) => setQ(Math.max(0, Math.min(last, i)));
  const choose = (i) => { setPick(i); setTimeout(() => setQ((x) => (x === 0 ? 1 : x)), 420); };
  const sx = useRef(null);
  const onDown = (e) => { sx.current = e.clientX; };
  const onUp = (e) => {
    if (sx.current == null) return;
    const dx = e.clientX - sx.current; sx.current = null;
    if (Math.abs(dx) > 56) go(q + (dx < 0 ? (q === 0 && !it ? 0 : 1) : -1));
  };
  const onKey = (e) => {
    if (e.target.closest('a')) return;
    if (e.key === 'ArrowRight' && !(q === 0 && !it)) { e.preventDefault(); go(q + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(q - 1); }
  };
  const ref = it ? `${it.repo}#${it.number}` : '';
  const merged = WAYS[1];
  const off = (i) => (ready && q !== i ? true : undefined);
  const name = (i) => (i < TAKE.length ? TAKE[i] : PROPOSE);
  return (
    <section className="xp-sec xbo-take" aria-labelledby="xbo-take-h">
      <div className="xp-wrap">
        <div className="xp-grid xbo-take-head">
          <h2 id="xbo-take-h" className="xp-head">How a bounty is taken</h2>
          <p className="xp-body xbo-take-note">Verified bug reports and merged bounties earn Hanzo AI credits and leaderboard points, with email notifications sent as you climb ranks.</p>
        </div>
        <div className="xp-grid xbo-flow" data-enter="conveyor">
          <div className="xbo-q xp-obj" style={{ '--k': 0 }} onKeyDown={onKey} onPointerDown={onDown} onPointerUp={onUp} onPointerCancel={() => { sx.current = null; }}>
            <div className="xbo-q-track" style={{ '--q': q }}>
              <div className="xbo-q-step" inert={off(0)} aria-hidden={off(0)}>
                <p className="xbo-q-prompt">{TAKE[0]}</p>
                <ul className="xbo-q-pick">
                  {issues.map((x, i) => (
                    <li key={x.url}>
                      <button type="button" aria-pressed={pick === i} data-sound="tick" onClick={() => choose(i)}>
                        <span className="xbo-dot" aria-hidden="true" />
                        <span className="xbo-q-t">{x.title}</span>
                        <span className="xbo-q-r x-mono">{`${x.repo}#${x.number}`}{x.tier && <em>{x.tier}</em>}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="xbo-q-step" inert={off(1)} aria-hidden={off(1)}>
                <p className="xbo-q-prompt">{TAKE[1]}</p>
                <p className="xbo-q-code x-mono"><span>Fixes</span> <b>{ref || '#'}</b><i className="xbo-caret" aria-hidden="true" /></p>
              </div>
              <div className="xbo-q-step" inert={off(2)} aria-hidden={off(2)}>
                <p className="xbo-q-prompt">{TAKE[2]}</p>
                <p className="xbo-q-earn"><span className="xp-fig">{`+${merged[1]}`}<small> pts</small></span><span className="xbo-cr x-mono">{merged[2]}</span></p>
              </div>
              <div className="xbo-q-step xbo-propose" id="propose" inert={off(3)} aria-hidden={off(3)}>
                <h3 className="xbo-q-prompt">{PROPOSE}</h3>
                <p className="xp-body">Found something worth fixing? Open an issue in its repository saying what is wrong, where, and how a fix is checked, and ask for the bounty label. A maintainer decides.</p>
                <A to={REPOS} className="xbo-link">Hanzo’s repositories</A>
                <p className="xbo-sec xp-body">A security issue goes to <a href="mailto:security@hanzo.ai">security@hanzo.ai</a>, never to a public issue.</p>
              </div>
            </div>
            <div className="xbo-q-nav">
              <button type="button" className="xbo-q-arrow" aria-label={name(Math.max(0, q - 1))} disabled={q === 0} onClick={() => go(q - 1)}>←</button>
              <span className="xbo-q-dots">
                {[0, 1, 2, 3].map((i) => (
                  <button key={i} type="button" aria-label={name(i)} aria-current={q === i ? 'step' : undefined} disabled={i > 0 && i < 3 && !it} data-sound="tick" onClick={() => go(i)}><i /></button>
                ))}
              </span>
              <button type="button" className="xbo-q-arrow" aria-label={name(Math.min(last, q + 1))} disabled={q === last || (q === 0 && !it)} onClick={() => go(q + 1)}>→</button>
            </div>
          </div>
          <div className="xbo-pr xp-obj" style={{ '--k': 1 }} data-step={Math.min(2, q)} data-has={it ? 'y' : 'n'} aria-live="polite">
            <div className="xbo-pr-head">
              <Glyph />
              {it ? (
                <a className="xbo-pr-t" href={it.url} target="_blank" rel="noopener noreferrer"><b>{it.title}</b><span className="x-mono">{ref}</span></a>
              ) : (
                <span className="xbo-pr-t xbo-pr-wait" aria-hidden="true"><b /><span /></span>
              )}
            </div>
            <ol className="xbo-sum">
              <li className={it ? 'on' : ''}><span className="xbo-tl-m" aria-hidden="true" /><span className="x-mono">{ref || '—'}</span></li>
              <li className={it && q >= 1 ? 'on' : ''}><span className="xbo-tl-m" aria-hidden="true" /><span className="x-mono">{it && q >= 1 ? `Fixes ${ref}` : '—'}</span></li>
              <li className={it && q >= 2 ? 'on' : ''}><span className="xbo-tl-m" aria-hidden="true" /><span className="x-mono">{it && q >= 2 ? `+${merged[1]} pts · ${merged[2]}` : '—'}</span></li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

/* The closing band: the page's own headline types itself out, then its one ask. */
function Close() {
  return (
    <section className="x-band xbo-band" data-room="dark" aria-labelledby="xbo-band-h">
      <div className="xp-wrap">
        <h2 id="xbo-band-h" className="xbo-band-h" data-enter="typewriter">
          <span className="xbo-tw"><span>Take an issue.</span></span>
          <span className="xbo-tw"><span>Ship the fix.</span></span>
        </h2>
        <div className="x-band-act">
          <Cta to={SEARCH} id="bounty.band" size="lg" className="xp-cta">Every open bounty</Cta>
        </div>
      </div>
    </section>
  );
}

export default function Bounty() {
  const st = useBounties();
  const main = useRef(null);
  useEnter(main);
  return (
    <main className="xp xbo" ref={main}>
      <NoJs />
      <Hero st={st} />
      <Take st={st} />
      <Rewards />
      <Standings />
      <Volume />
      <Close />
    </main>
  );
}
