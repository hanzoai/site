import History from '../../components/pages/History';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'History & Track Record — Hanzo AI — Hanzo AI',
  description: "Explore Hanzo's full history: from SKULLY, open-source commerce, and Techstars '17 to two clients that went public on Nasdaq in 2024, 1,600+ open repositories, and the sovereign AI cloud.",
};

export default function Page() {
  return <><JsonLd route="/history" /><History /></>;
}
