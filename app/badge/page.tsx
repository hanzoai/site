// Signature: interactive README.md badge studio with live GitHub profile README preview and 1-click Markdown/HTML copy
// Beyond: Deploy to Hanzo, Edit on Hanzo, Built with Hanzo, Live Profile Stats Card, and Global Leaderboard Rank badges
import Badge from '../../components/pages/Badge';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Show it off — Hanzo AI',
  description:
    'README.md badges for your GitHub repository and personal profile: Deploy to Hanzo, Edit on Hanzo, Built with Hanzo, live profile stats, and global leaderboard rank.',
};

export default function Page() {
  return (
    <>
      <JsonLd route="/badge" />
      <Badge />
    </>
  );
}
