// Signature: every total is a sum that adds itself up: the podium's tape re-adds each hunter's score, then the four ways to earn pin as chapters while a receipt builds a total line by line.
// Beyond: your points, worked out with the page's own rules, and where your tokens would sit on the global board.
import Leaderboard from '../../components/pages/Leaderboard';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Leaderboard — Hanzo AI',
  description: 'Global token volume, bug bounty hunters, and open-source contributor rankings on Hanzo Cloud.',
};

export default function Page() {
  return <><JsonLd route="/leaderboard" /><Leaderboard /></>;
}
