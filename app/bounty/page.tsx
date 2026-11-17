// Persona: a developer who wants to contribute to Hanzo’s open repositories
// Goal: take an open bounty
// CTA: Every open bounty (GitHub search of Hanzo’s bounty issues), kit Cta bounty.hero
// Metric: github_click
// Signature: the token race: in the dark room ten organizations’ bars race out on a log line, scrubbed by your scroll, a hundred million and half a million drawn honestly on one picture
// Beyond: count on the tiles: steppers on each way to earn total the points and AI credits Hanzo’s rates give, with a marker placed against the standings Hanzo lists
// V2: 8/10 newest bounty arrives once over a live/snapshot GitHub window, the count ticks, a reader walks the rows; awards as a dealing deck; the take section is the PR itself, pinned while its state changes; one solid on phones
import Bounty from '../../components/pages/Bounty';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Bounties, Social Quests & AI Credit Rewards — Hanzo AI',
  description: 'Complete easy social bounties across 14 networks, invite builders with 3-tier referral rewards, or ship GitHub bounty PRs to earn points, badges, and AI credits across 600+ models.',
};

export default function Page() {
  return <><JsonLd route="/bounty" /><Bounty /></>;
}
