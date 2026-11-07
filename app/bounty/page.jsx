// Persona: a developer who wants to contribute to Hanzo’s open repositories
// Goal: take an open bounty
// CTA: Every open bounty (GitHub search of Hanzo’s bounty issues), kit Cta bounty.hero
// Metric: github_click
// Signature: the token race: in the dark room ten organizations’ bars race out on a log line, scrubbed by your scroll, a hundred million and half a million drawn honestly on one picture
// Beyond: count on the tiles: steppers on each way to earn total the points and AI credits Hanzo’s rates give, with a marker placed against the standings Hanzo lists
// V2: 8/10 MASTER scale: 52px headline beside the live GitHub window, tile figures 64/44, totals 44, @hanzo’s figure grows 52→84 only while the race runs; awards as one window; the take timeline inks in as it is read; kit Cta; no hover lifts
import Bounty from '../../components/pages/Bounty';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Bounties — Hanzo AI',
  description: 'Open issues in Hanzo’s public repositories, each one scoped: what to change, where, and how the fix is checked.',
};

export default function Page() {
  return <><JsonLd route="/bounty" /><Bounty /></>;
}
