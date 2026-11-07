// Signature: the timeline scrub: one pinned scene where your scroll rolls a giant year like an odometer and each year's story comes in as the last goes out
// Beyond: your year: type the year you started and a split-flap board turns to what Hanzo was building then, with its posts
import History from '../../components/pages/History';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'History & Track Record — Hanzo AI — Hanzo AI',
  description: "Explore Hanzo's full history: from SKULLY, open-source commerce, and Techstars '17 to two clients that went public on Nasdaq in 2024, 1,600+ open repositories, and the sovereign AI cloud.",
};

export default function Page() {
  return <><JsonLd route="/history" /><History /></>;
}
