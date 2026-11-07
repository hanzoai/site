// Signature: every rank is a sum you can open: the podium cycles its three hunters and each score adds itself up on a paper tape.
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
