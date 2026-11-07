// Signature: the reward receipt that prints the four ways to earn line by line, beside open bounties arriving live from GitHub
// Beyond: where would you rank: count what you would ship and see Hanzo's rates placed against its listed standings
import Bounty from '../../components/pages/Bounty';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Bounties — Hanzo AI',
  description: 'Open issues in Hanzo’s public repositories, each one scoped: what to change, where, and how the fix is checked.',
};

export default function Page() {
  return <><JsonLd route="/bounty" /><Bounty /></>;
}
