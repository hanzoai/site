// Signature: the token race: in the dark room ten organizations’ bars race out on a log line, scrubbed by your scroll, a hundred million and half a million drawn honestly on one picture
// Beyond: count on the tiles: steppers on each way to earn total the points and AI credits Hanzo’s rates give, with a marker placed against the standings Hanzo lists
// V2: 8/10 grey deck, no eyebrow; display hero beside the live GitHub window; reward tiles you can count on; standings as big totals; the scrubbed token race as the dark room; a GitHub-style timeline; one sticky ask
import Bounty from '../../components/pages/Bounty';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Bounties — Hanzo AI',
  description: 'Open issues in Hanzo’s public repositories, each one scoped: what to change, where, and how the fix is checked.',
};

export default function Page() {
  return <><JsonLd route="/bounty" /><Bounty /></>;
}
