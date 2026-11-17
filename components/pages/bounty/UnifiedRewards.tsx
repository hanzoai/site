'use client';
import { useMemo, useState } from 'react';
import { A } from '../../kit';
import { SEARCH, REPOS, useBounties } from '../Bounty.github';
import type { Bounty as BountyItem } from '../Bounty.github';
import { SNAP } from '../Bounty.snapshot';
import './UnifiedRewards.css';

const SIGNUP_BOUNTY = '/signup?next=%2Fbounty';
const SIGNUP_REFERRAL = '/signup?next=%2Freferral';

const NETWORKS_14 = [
  'X (Twitter)',
  'Bluesky',
  'LinkedIn',
  'Reddit',
  'Hacker News',
  'Mastodon',
  'DEV.to',
  'Medium',
  'Hashnode',
  'YouTube',
  'TikTok',
  'Threads',
  'Instagram',
  'Facebook',
];

const SHARE_TEXT = encodeURIComponent(
  'Building with @hanzoai — unified AI cloud, Zen open-weight models, MCP tools, and open-source bounties that pay in AI credits across 600+ frontier models.'
);
const SHARE_URL = encodeURIComponent('https://hanzo.ai/bounty');

const SHARE_INTENTS = [
  { label: 'Share on X ↗', href: `https://x.com/intent/tweet?text=${SHARE_TEXT}&url=${SHARE_URL}` },
  { label: 'Post on Bluesky ↗', href: `https://bsky.app/intent/compose?text=${SHARE_TEXT}%20${SHARE_URL}` },
  { label: 'Share on LinkedIn ↗', href: `https://www.linkedin.com/sharing/share-offsite/?url=${SHARE_URL}` },
  { label: 'Post to Reddit ↗', href: `https://www.reddit.com/submit?url=${SHARE_URL}&title=${SHARE_TEXT}` },
  { label: 'Submit to HN ↗', href: `https://news.ycombinator.com/submitlink?u=${SHARE_URL}&t=${encodeURIComponent('Hanzo AI Open-Source Bounties & AI Credit Rewards')}` },
];

function BountyIcon({ kind }: { kind: 'star' | 'follow' | 'share' | 'invite' | 'discord' | 'badge' }) {
  switch (kind) {
    case 'star':
      return (
        <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
          <path d="m8 1.6 1.9 3.9 4.3.6-3.1 3 .7 4.3L8 11.4l-3.8 2 .7-4.3-3.1-3 4.3-.6L8 1.6Z" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinejoin="round" />
        </svg>
      );
    case 'follow':
      return (
        <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
          <circle cx="6.2" cy="5.2" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.35" />
          <path d="M1.8 13.2c0-2.2 2-3.8 4.4-3.8s4.4 1.6 4.4 3.8M12.5 5.2v4.4M10.3 7.4h4.4" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
        </svg>
      );
    case 'share':
      return (
        <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
          <circle cx="12.2" cy="3.5" r="1.9" fill="none" stroke="currentColor" strokeWidth="1.35" />
          <circle cx="3.8" cy="8" r="1.9" fill="none" stroke="currentColor" strokeWidth="1.35" />
          <circle cx="12.2" cy="12.5" r="1.9" fill="none" stroke="currentColor" strokeWidth="1.35" />
          <path d="m5.5 7.1 5-2.7M5.5 8.9l5 2.7" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
        </svg>
      );
    case 'invite':
      return (
        <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
          <path d="M6.4 9.6 9.6 6.4M5.2 11.5l-1.1 1.1a2.3 2.3 0 0 1-3.2-3.2l2-2a2.3 2.3 0 0 1 3.2 0M10.8 4.5l1.1-1.1a2.3 2.3 0 0 1 3.2 3.2l-2 2a2.3 2.3 0 0 1-3.2 0" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
        </svg>
      );
    case 'discord':
      return (
        <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
          <path d="M3.2 3.8C4.6 3.1 6.2 2.8 8 2.8s3.4.3 4.8 1c1 1.9 1.4 4.1 1.2 6.5-1.1.9-2.4 1.5-3.8 1.8l-.6-1.1c.7-.2 1.3-.5 1.8-.9-.9.4-2.1.7-3.4.7s-2.5-.3-3.4-.7c.5.4 1.1.7 1.8.9l-.6 1.1c-1.4-.3-2.7-.9-3.8-1.8-.2-2.4.2-4.6 1.2-6.5Z" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
          <circle cx="6.1" cy="7.6" r=".85" fill="currentColor" />
          <circle cx="9.9" cy="7.6" r=".85" fill="currentColor" />
        </svg>
      );
    case 'badge':
      return (
        <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
          <path d="M8 1.8 13 3.9v3.9c0 3.2-2.1 5.3-5 6.4-2.9-1.1-5-3.2-5-6.4V3.9L8 1.8Z" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinejoin="round" />
          <path d="m5.8 8.1 1.5 1.5 3-3.1" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
  }
}

export function EasySocialBounties({ from }: { from: 'bounty' | 'referral' }) {
  const claimHref = from === 'bounty' ? SIGNUP_BOUNTY : SIGNUP_REFERRAL;
  return (
    <section className="xp-sec tight xur-sec" id="social-bounties" aria-labelledby="xur-social-h">
      <div className="xp-wrap">
        <div className="xur-head">
          <div className="xur-head-l">
            <p className="xp-kick">Easy Social &amp; Community Bounties</p>
            <h2 id="xur-social-h" className="xp-head">Earn points, AI credits, and badges in under 60 seconds</h2>
            <p className="xp-body">
              Every builder can start immediately — star open-source repositories, follow official GitHub orgs, share what you build across 14 social networks, invite teammates, or add a README shield.
            </p>
          </div>
          <div className="xur-head-r">
            <A to={claimHref} className="xur-pill-btn solid">Claim &amp; verify rewards →</A>
            {from === 'bounty' ? (
              <A to="/referral" className="xur-pill-btn">Referral program</A>
            ) : (
              <A to="/bounty" className="xur-pill-btn">All GitHub bounties</A>
            )}
          </div>
        </div>

        <div className="xur-claimbar xp-obj">
          <div className="xur-claimbar-l">
            <b>One-click GitHub &amp; social post verification</b>
            <span>Link your GitHub account once to auto-credit stars, org follows, forks, and merged PRs — or paste any post URL / public handle to verify weekly shares.</span>
          </div>
          <div className="xur-claimbar-r">
            <A to="https://hanzo.app/referral" className="xur-pill-btn">Verify GitHub stars &amp; follows ↗</A>
            <A to="https://hanzo.app/referral" className="xur-pill-btn">Scan social handle or URL ↗</A>
          </div>
        </div>

        <div className="xur-social-grid">
          <article className="xur-bcard xp-obj" data-tilt="">
            <div className="xur-bcard-top">
              <div className="xur-bcard-row">
                <span className="xur-ic"><BountyIcon kind="star" /></span>
                <span className="xur-reward-tag x-mono">+1 pt / repo · Stargazer</span>
              </div>
              <h3>Star Hanzo on GitHub</h3>
              <p>Star official repositories across Hanzo AI, Zen LM, Lux, and Zoo. Star 5+ repositories to unlock the collectible Stargazer badge.</p>
            </div>
            <div className="xur-chips">
              <a className="xur-chip" href="https://github.com/hanzoai/hanzo" target="_blank" rel="noopener noreferrer">hanzoai/hanzo ↗</a>
              <a className="xur-chip" href="https://github.com/hanzoai/bot" target="_blank" rel="noopener noreferrer">hanzoai/bot ↗</a>
              <a className="xur-chip" href="https://github.com/hanzoai/mcp" target="_blank" rel="noopener noreferrer">hanzoai/mcp ↗</a>
              <a className="xur-chip" href="https://github.com/zenlm/zen" target="_blank" rel="noopener noreferrer">zenlm/zen ↗</a>
              <a className="xur-chip muted" href={REPOS} target="_blank" rel="noopener noreferrer">All repos ↗</a>
            </div>
          </article>

          <article className="xur-bcard xp-obj" data-tilt="">
            <div className="xur-bcard-top">
              <div className="xur-bcard-row">
                <span className="xur-ic"><BountyIcon kind="follow" /></span>
                <span className="xur-reward-tag x-mono">+1 pt / org · Follower</span>
              </div>
              <h3>Follow Official GitHub Orgs</h3>
              <p>Follow the four core open-source organizations in the ecosystem and verify in one click to unlock the Follower badge.</p>
            </div>
            <div className="xur-chips">
              <a className="xur-chip" href="https://github.com/hanzoai" target="_blank" rel="noopener noreferrer">@hanzoai ↗</a>
              <a className="xur-chip" href="https://github.com/zenlm" target="_blank" rel="noopener noreferrer">@zenlm ↗</a>
              <a className="xur-chip" href="https://github.com/luxfi" target="_blank" rel="noopener noreferrer">@luxfi ↗</a>
              <a className="xur-chip" href="https://github.com/zooai" target="_blank" rel="noopener noreferrer">@zooai ↗</a>
            </div>
          </article>

          <article className="xur-bcard xp-obj" data-tilt="">
            <div className="xur-bcard-top">
              <div className="xur-bcard-row">
                <span className="xur-ic"><BountyIcon kind="share" /></span>
                <span className="xur-reward-tag x-mono">Weekly bounty · 7d verified</span>
              </div>
              <h3>Weekly Social Share (14 Networks)</h3>
              <p>Share a demo, thread, tutorial, or benchmark mentioning Hanzo. Posts live for 7+ days verify automatically for weekly Share pillar points and True Advocate.</p>
            </div>
            <div className="xur-chips">
              <a className="xur-chip" href="https://x.com/hanzoai" target="_blank" rel="noopener noreferrer">X @hanzoai ↗</a>
              <a className="xur-chip" href="https://bsky.app/profile/hanzo.ai" target="_blank" rel="noopener noreferrer">Bluesky ↗</a>
              <a className="xur-chip" href="https://www.linkedin.com/company/hanzoai" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
              <a className="xur-chip" href="https://www.reddit.com/r/HanzoAI" target="_blank" rel="noopener noreferrer">r/HanzoAI ↗</a>
            </div>
          </article>

          <article className="xur-bcard xp-obj" data-tilt="">
            <div className="xur-bcard-top">
              <div className="xur-bcard-row">
                <span className="xur-ic"><BountyIcon kind="invite" /></span>
                <span className="xur-reward-tag x-mono">+50 pts · +$5 credits · 10/5/2%</span>
              </div>
              <h3>Invite Builders &amp; 3-Tier Network</h3>
              <p>Earn +25 pts when an invited builder activates, +25 pts at 30-day retention, +$5 AI credits, and 10% · 5% · 2% upline points across three network levels (+10 welcome bonus for invitees).</p>
            </div>
            <div className="xur-chips">
              <A to={SIGNUP_REFERRAL} className="xur-chip">Get ?ref= link →</A>
              <A to="/referral" className="xur-chip muted">How referrals work</A>
              <A to="/affiliate" className="xur-chip muted">15% cash affiliate →</A>
            </div>
          </article>

          <article className="xur-bcard xp-obj" data-tilt="">
            <div className="xur-bcard-top">
              <div className="xur-bcard-row">
                <span className="xur-ic"><BountyIcon kind="discord" /></span>
                <span className="xur-reward-tag x-mono">Community · Founding Dev</span>
              </div>
              <h3>Join the Hanzo Discord</h3>
              <p>Coordinate with core maintainers in #bounties, share agent workflows in #showcase, claim starter issues, and earn Community pillar standing.</p>
            </div>
            <div className="xur-chips">
              <a className="xur-chip" href="https://discord.gg/XthHQQj" target="_blank" rel="noopener noreferrer">Join Discord ↗</a>
              <A to="https://hanzo.app/referral" className="xur-chip muted">Link Discord account ↗</A>
            </div>
          </article>

          <article className="xur-bcard xp-obj" data-tilt="">
            <div className="xur-bcard-top">
              <div className="xur-bcard-row">
                <span className="xur-ic"><BountyIcon kind="badge" /></span>
                <span className="xur-reward-tag x-mono">+10 badge · +30 docs · +1 fork</span>
              </div>
              <h3>README Badges, Forks &amp; Quick Docs PRs</h3>
              <p>Embed a live Hanzo standing or deploy badge in your GitHub README (+10 pts), ship a docs or translation PR (+30 pts), or fork a repo (+1 pt).</p>
            </div>
            <div className="xur-chips">
              <A to="/badge" className="xur-chip">Open Badge Studio →</A>
              <a className="xur-chip muted" href="https://github.com/hanzoai/docs" target="_blank" rel="noopener noreferrer">hanzoai/docs ↗</a>
            </div>
          </article>
        </div>

        <div className="xur-sharestrip xp-obj">
          <div className="xur-sharestrip-top">
            <b>Supported across all 14 social &amp; developer networks</b>
            <span className="x-mono">Auto-scan handles on Bluesky · Mastodon · Reddit · Hacker News · DEV.to — or paste any post URL</span>
          </div>
          <div className="xur-nets" aria-label="Supported social networks">
            {NETWORKS_14.map((net) => (
              <span key={net} className="xur-net">{net}</span>
            ))}
          </div>
          <div className="xur-intents">
            {SHARE_INTENTS.map((it) => (
              <a key={it.label} className="xur-chip" href={it.href} target="_blank" rel="noopener noreferrer">
                {it.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ReferralProgramMerge() {
  return (
    <section className="xp-sec tight xur-sec" id="referral-program" aria-labelledby="xur-ref-h">
      <div className="xp-wrap">
        <div className="xur-head">
          <div className="xur-head-l">
            <p className="xp-kick">Merged Referral &amp; Network Program</p>
            <h2 id="xur-ref-h" className="xp-head">Bring builders to Hanzo. Compound your standing across three tiers.</h2>
            <p className="xp-body">
              Your personal referral link works alongside GitHub bounties — every builder who signs up through your link is attributed permanently and earns rewards for both of you.
            </p>
          </div>
          <div className="xur-head-r">
            <A to={SIGNUP_REFERRAL} className="xur-pill-btn solid">Get your referral link →</A>
            <A to="/referral" className="xur-pill-btn">Full referral journey</A>
          </div>
        </div>

        <div className="xur-ref-grid">
          <div className="xur-ref-card xp-obj" data-tilt="">
            <div>
              <span className="xp-kick plain">Your Personal Link</span>
              <div className="xur-ref-urlbox">
                <span className="x-mono xur-ref-url">https://hanzo.ai/?ref=your-handle</span>
                <A to="https://hanzo.app/referral" className="xur-pill-btn solid">Copy &amp; share ↗</A>
              </div>
            </div>

            <div className="xur-ref-stages" aria-label="Referral lifecycle">
              <div className="xur-ref-stage">
                <span className="x-mono">01 · Referred</span>
                <b>+10 welcome pts</b>
              </div>
              <div className="xur-ref-stage">
                <span className="x-mono">02 · Activated</span>
                <b>+25 pts + $5 cr</b>
              </div>
              <div className="xur-ref-stage active">
                <span className="x-mono">03 · 30d Retained</span>
                <b>+25 bonus pts</b>
              </div>
            </div>

            <div className="xur-chips">
              <A to="/referral" className="xur-chip">Spark → Cosmos X badges</A>
              <A to="/affiliate" className="xur-chip muted">Want cash? Affiliates earn 15% recurring →</A>
            </div>
          </div>

          <div className="xur-ref-card xp-obj" data-tilt="">
            <ul className="xur-upline-list">
              <li>
                <div className="xur-upline-l">
                  <b>Level 1 · Direct builders you invite</b>
                  <span>+25 pts on activation, +25 pts at 30d retention, +$5 AI credits, plus 10% upline match on their earned points.</span>
                </div>
                <span className="xur-reward-tag x-mono">10% match</span>
              </li>
              <li>
                <div className="xur-upline-l">
                  <b>Level 2 · Builders your invites bring</b>
                  <span>Automatic second-degree network bonus whenever builders invited by your network ship bounties or process tokens.</span>
                </div>
                <span className="xur-reward-tag x-mono">5% match</span>
              </li>
              <li>
                <div className="xur-upline-l">
                  <b>Level 3 · Third-degree ecosystem reach</b>
                  <span>Unlocks Spark, Constellation, Supernova, and Cosmos X badges as your builder graph grows.</span>
                </div>
                <span className="xur-reward-tag x-mono">2% match</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

interface TierBand {
  id: string;
  short: string;
  level: string;
  title: string;
  bands: string;
  pts: string;
  pct: number;
  desc: string;
}

const TIER_BANDS: TierBand[] = [
  {
    id: 'hacker',
    short: 'Lv 1–2',
    level: 'Lv 2',
    title: 'Hacker · Photon → Quasar',
    bands: 'Bands 01–02',
    pts: '0 – 199 pts',
    pct: 0.24,
    desc: 'Unlock instant standing by linking GitHub, starring 5 repos, following @hanzoai/@zenlm/@luxfi/@zooai, and sharing your first post.',
  },
  {
    id: 'builder',
    short: 'Lv 3–4',
    level: 'Lv 4',
    title: 'Builder · Nebula → Pulsar',
    bands: 'Bands 03–04',
    pts: '200 – 599 pts',
    pct: 0.44,
    desc: 'Ship starter bounties (+$20 AI credits), file reproducible bug reports (+50 pts), maintain a 7-day usage streak, and refer teammates.',
  },
  {
    id: 'shipper',
    short: 'Lv 5–6',
    level: 'Lv 6',
    title: 'Shipper · Nova → Supernova',
    bands: 'Bands 05–06',
    pts: '600 – 1,499 pts',
    pct: 0.65,
    desc: 'Merge multi-repo feature PRs (+$50–$100 AI credits), grow a 3-tier referral network, and display verified rank shields on GitHub.',
  },
  {
    id: 'core',
    short: 'Lv 7–8',
    level: 'Lv 8',
    title: 'Core · Magnetar → Horizon',
    bands: 'Bands 07–08',
    pts: '1,500 – 4,999 pts',
    pct: 0.84,
    desc: 'Top leaderboard hunters & ecosystem maintainers shipping P0 architecture specs, benchmarks, and high-volume cloud token workloads.',
  },
  {
    id: 'legend',
    short: 'Lv 9–10',
    level: 'Lv 10',
    title: 'Legend · Cosmos → Singularity',
    bands: 'Bands 09–10',
    pts: '5,000+ pts',
    pct: 0.97,
    desc: 'Global Hall of Fame standing across Use, Share, Community, Contribute, and Expert pillars — priority compute grants & Founding Developer.',
  },
];

const PILLARS = [
  {
    name: 'Use',
    rule: '+1 pt / 100K tokens · 7d / 30d / 100d streaks',
    desc: 'Run inference across Zen, Enso, Kai, and 600+ frontier models in Chat, Dev, CLI, Bot, or API.',
    fill: '88%',
  },
  {
    name: 'Share',
    rule: 'Weekly 14-network posts · +50 referral pts · 10/5/2%',
    desc: 'Publish verified 7-day social threads, tutorials, and invite builders through your ?ref= link.',
    fill: '76%',
  },
  {
    name: 'Community',
    rule: '+1 star · +1 follow · +1 fork · +10 README badge',
    desc: 'Star repos, follow @hanzoai/@zenlm/@luxfi/@zooai, embed README shields, and help builders in Discord.',
    fill: '92%',
  },
  {
    name: 'Contribute',
    rule: '+50 bug · +30 docs/i18n · +100–500 PR + AI credits',
    desc: 'Report reproducible bugs, improve docs & translations, and merge labelled GitHub bounty pull requests.',
    fill: '82%',
  },
  {
    name: 'Expert',
    rule: 'bounty:P0 · HIP specs · security & research ($100–$500)',
    desc: 'Author Hanzo Improvement Proposals, P0 kernel/engine optimizations, and verified security disclosures.',
    fill: '64%',
  },
];

type Rarity = 'All' | 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';

interface BadgeDef {
  name: string;
  rarity: Exclude<Rarity, 'All'>;
  pillar: string;
  rule: string;
  pts: string;
}

const BADGES: BadgeDef[] = [
  { name: 'Stargazer', rarity: 'Common', pillar: 'Community', rule: 'Star 5+ official repositories across Hanzo orgs.', pts: '+5 pts' },
  { name: 'Follower', rarity: 'Common', pillar: 'Community', rule: 'Follow @hanzoai, @zenlm, @luxfi, and @zooai on GitHub.', pts: '+4 pts' },
  { name: 'First Friend', rarity: 'Uncommon', pillar: 'Share', rule: 'Refer your first builder who activates on Hanzo.', pts: '+25 pts' },
  { name: 'Week Streak', rarity: 'Uncommon', pillar: 'Use', rule: 'Use Hanzo Chat, Dev, CLI, or API 7 days in a row.', pts: '+15 pts' },
  { name: 'First Merge', rarity: 'Rare', pillar: 'Contribute', rule: 'Land your first merged pull request in any Hanzo repo.', pts: '+100 pts' },
  { name: 'True Advocate', rarity: 'Rare', pillar: 'Share', rule: 'Publish 7-day verified posts across 3+ social networks.', pts: '+45 pts' },
  { name: 'Bug Slayer', rarity: 'Rare', pillar: 'Contribute', rule: 'File 3+ verified reproducible bug or QA reports.', pts: '+150 pts' },
  { name: 'Bounty Hunter', rarity: 'Epic', pillar: 'Contribute', rule: 'Complete 5+ labelled GitHub bounties across Hanzo.', pts: '+$250 cr' },
  { name: 'Supernova', rarity: 'Epic', pillar: 'Share', rule: 'Grow a 25+ activated builder 3-tier referral network.', pts: '10/5/2%' },
  { name: 'Founding Developer', rarity: 'Legendary', pillar: 'Expert', rule: 'Core open-source contributor & top global leaderboard hunter.', pts: 'Hall of Fame' },
];

export function GamificationShowcase({ from }: { from: 'bounty' | 'referral' }) {
  const [tierIdx, setTierIdx] = useState<number>(2);
  const [rarityFilter, setRarityFilter] = useState<Rarity>('All');

  const tier = TIER_BANDS[tierIdx];
  const radius = 46;
  const circ = 2 * Math.PI * radius;
  const dashOffset = circ * (1 - tier.pct);

  const visibleBadges = useMemo(
    () => (rarityFilter === 'All' ? BADGES : BADGES.filter((b) => b.rarity === rarityFilter)),
    [rarityFilter]
  );

  return (
    <section className="xp-sec tight xur-sec" id="gamification" aria-labelledby="xur-game-h">
      <div className="xp-wrap">
        <div className="xur-head">
          <div className="xur-head-l">
            <p className="xp-kick">Gamification · Levels, 5 Pillars &amp; Collectible Badges</p>
            <h2 id="xur-game-h" className="xp-head">Every action levels up your global Hanzo standing</h2>
            <p className="xp-body">
              Bounties, referrals, social shares, and model usage all feed one unified progression system — 10 cosmic bands, 5 reward pillars, streak multipliers, and rarity-graded badges you can embed anywhere.
            </p>
          </div>
          <div className="xur-head-r">
            <A to="/leaderboard" className="xur-pill-btn solid">Global leaderboard →</A>
            <A to="/badge" className="xur-pill-btn">README badge studio</A>
            <A to={from === 'bounty' ? SIGNUP_BOUNTY : SIGNUP_REFERRAL} className="xur-pill-btn">View your standing</A>
          </div>
        </div>

        <div className="xur-game-top">
          <div className="xur-ring-card xp-obj" data-tilt="">
            <div className="xur-ring-row">
              <svg className="xur-ring-svg" viewBox="0 0 112 112" aria-hidden="true">
                <circle className="xur-ring-bg" cx="56" cy="56" r={radius} />
                <circle
                  className="xur-ring-fg"
                  cx="56"
                  cy="56"
                  r={radius}
                  strokeDasharray={circ}
                  strokeDashoffset={dashOffset}
                />
                <text x="56" y="53" textAnchor="middle" className="xur-ring-num">{tier.level}</text>
                <text x="56" y="69" textAnchor="middle" className="xur-ring-sub">{tier.bands}</text>
              </svg>
              <div className="xur-ring-meta">
                <span className="xur-ring-k x-mono">{`Progression · ${tier.pts}`}</span>
                <h3 className="xur-ring-title">{tier.title}</h3>
                <p className="xur-ring-desc">{tier.desc}</p>
              </div>
            </div>

            <div className="xur-band-tabs" role="group" aria-label="Preview progression tiers">
              {TIER_BANDS.map((tb, idx) => (
                <button
                  key={tb.id}
                  type="button"
                  className="xur-band-btn"
                  aria-pressed={tierIdx === idx}
                  onClick={() => setTierIdx(idx)}
                >
                  {tb.short}
                </button>
              ))}
            </div>

            <div className="xur-streaks">
              <span className="xur-streak x-mono"><b>7d</b> Week Streak</span>
              <span className="xur-streak x-mono"><b>30d</b> Month Streak</span>
              <span className="xur-streak x-mono"><b>100d</b> Centurion</span>
              <span className="xur-streak x-mono"><b>1m → 36m</b> Tenure Shields</span>
            </div>
          </div>

          <div className="xur-pillars-card xp-obj" data-tilt="">
            <div className="xur-pillars-top">
              <h3>Five Reward Pillars</h3>
              <span className="xur-reward-tag x-mono">Points + AI Credits</span>
            </div>
            <ul className="xur-pillars-list">
              {PILLARS.map((p) => (
                <li key={p.name} className="xur-pillar">
                  <div className="xur-pillar-h">
                    <b>{p.name}</b>
                    <span className="x-mono">{p.rule}</span>
                  </div>
                  <p>{p.desc}</p>
                  <div className="xur-pbar" aria-hidden="true">
                    <i style={{ width: p.fill }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="xur-badges-wrap">
          <div className="xur-badges-bar">
            <h3>Collectible Rarity Badges</h3>
            <div className="xur-rfilters" role="group" aria-label="Filter badges by rarity">
              {(['All', 'Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  className="xur-rbtn"
                  aria-pressed={rarityFilter === r}
                  onClick={() => setRarityFilter(r)}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="xur-badges-grid">
            {visibleBadges.map((b) => (
              <article
                key={b.name}
                className={'xur-medal xp-obj ' + b.rarity.toLowerCase()}
                data-tilt=""
              >
                <div>
                  <div className="xur-medal-top">
                    <span className="xur-medal-emblem" aria-hidden="true">
                      <svg viewBox="0 0 16 16" width="15" height="15">
                        <path d="m8 1.7 1.8 3.7 4.1.6-3 2.9.7 4.1L8 11.1 4.4 13l.7-4.1-3-2.9 4.1-.6L8 1.7Z" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span className="xur-rarity x-mono">{b.rarity}</span>
                  </div>
                  <b style={{ marginTop: 12 }}>{b.name}</b>
                  <p>{b.rule}</p>
                </div>
                <div className="xur-medal-foot x-mono">
                  <span>{b.pillar}</span>
                  <span>{b.pts}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function issueRewardLabel(it: BountyItem): string {
  const ls = (it.labels || []).map((l) => l.toLowerCase());
  const t = (it.tier || '').toLowerCase();
  if (t === 'p0' || t === 'advanced' || t === 'l' || ls.includes('bounty:p0') || ls.includes('priority: p0') || ls.includes('research')) {
    return '+$100 AI credits';
  }
  if (t === 'starter' || t === 's' || t === 'p2' || ls.includes('bounty:starter') || ls.includes('starter')) {
    return '+$20 AI credits';
  }
  return '+$50 AI credits';
}

export function OpenBountiesMerge() {
  const st = useBounties();
  const [track, setTrack] = useState<'all' | 'p0' | 'starter' | 'qa'>('all');

  const openItems = useMemo(() => {
    const snapItems = ((SNAP.items || []) as BountyItem[]).filter((i) => (i.state || 'open') === 'open');
    if (st.kind !== 'ready' || !st.open.items.length) return snapItems;
    const byUrl = new Map<string, BountyItem>();
    for (const it of snapItems) byUrl.set(it.url, it);
    for (const it of st.open.items) {
      if ((it.state || 'open') === 'open') {
        const prev = byUrl.get(it.url);
        byUrl.set(it.url, { ...prev, ...it, labels: it.labels?.length ? it.labels : prev?.labels });
      }
    }
    return Array.from(byUrl.values());
  }, [st]);

  const totalOpen = st.kind === 'ready' ? Math.max(st.open.total, SNAP.total || openItems.length) : (SNAP.total || openItems.length);

  const shown = useMemo(() => {
    const filtered = openItems.filter((it) => {
      if (track === 'all') return true;
      const ls = (it.labels || []).map((l) => l.toLowerCase());
      if (track === 'p0') return ls.some((l) => l.includes('p0') || l.includes('research'));
      if (track === 'starter') return ls.some((l) => l.includes('starter')) || (it.tier || '').toLowerCase() === 'starter';
      if (track === 'qa') return ls.some((l) => l.includes('qa') || l.includes('test') || l.includes('bug'));
      return true;
    });
    return filtered.slice(0, 6);
  }, [openItems, track]);

  return (
    <section className="xp-sec tight xur-sec" id="open-bounties" aria-labelledby="xur-ob-h">
      <div className="xp-wrap">
        <div className="xur-head">
          <div className="xur-head-l">
            <p className="xp-kick">Open-Source GitHub Bounties</p>
            <h2 id="xur-ob-h" className="xp-head">{`Stack referrals with ${totalOpen.toLocaleString('en-US')}+ open GitHub bounties`}</h2>
            <p className="xp-body">
              Want to earn even faster? Pick an open issue, file a reproducible bug report (+$20 credits), or merge a bounty PR (+$20 to $500 in AI credits across 600+ models).
            </p>
          </div>
          <div className="xur-head-r">
            <A to="/bounty" className="xur-pill-btn solid">{`Browse all ${totalOpen.toLocaleString('en-US')} bounties →`}</A>
            <a href={SEARCH} target="_blank" rel="noopener noreferrer" className="xur-pill-btn">View on GitHub ↗</a>
          </div>
        </div>

        <div className="xur-badges-bar" style={{ marginBottom: 16 }}>
          <div className="xur-rfilters" role="group" aria-label="Filter open bounties">
            {([
              ['all', 'All open'],
              ['p0', 'Priority P0 (+$100)'],
              ['qa', 'QA & Bugfix'],
              ['starter', 'Starter (+$20)'],
            ] as const).map(([id, lbl]) => (
              <button
                key={id}
                type="button"
                className="xur-rbtn"
                aria-pressed={track === id}
                onClick={() => setTrack(id)}
              >
                {lbl}
              </button>
            ))}
          </div>
          <A to="/leaderboard" className="xur-chip muted">Top bug hunters &amp; standings →</A>
        </div>

        <div className="xur-issues-grid">
          {shown.map((it) => {
            const labels = (it.labels?.length ? it.labels : ['bounty']).slice(0, 4);
            return (
              <article key={it.url} className="xur-issue xp-obj" data-tilt="">
                <div>
                  <div className="xur-issue-top">
                    <span className="xur-issue-repo x-mono">{`${it.repo} #${it.number}`}</span>
                    <span className="xur-reward-tag x-mono">{issueRewardLabel(it)}</span>
                  </div>
                  <h3 style={{ marginTop: 10 }}>
                    <a href={it.url} target="_blank" rel="noopener noreferrer">{it.title}</a>
                  </h3>
                </div>
                <div className="xur-issue-foot">
                  <div className="xur-issue-lbls">
                    {labels.map((lbl) => (
                      <span key={lbl} className="xur-issue-lbl x-mono">{lbl}</span>
                    ))}
                  </div>
                  <a href={it.url} target="_blank" rel="noopener noreferrer" className="xur-chip">
                    Take issue ↗
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
