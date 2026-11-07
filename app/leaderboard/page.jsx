// Signature: race — the global board's own ten token volumes race from zero to their exact figures, bars and tabular counters at the true ratios every frame, Linear or Log, replayable, in the second screen.
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
