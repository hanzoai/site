// V2: 8/10 Utility, calm and exact: a two-line kinetic question beside a patch panel whose cable swings into the route you choose, the address as huge type over a living contour map with San Francisco's clock, the community as a typographic index
// Signature: a patch panel: four jacks across the top, a cable that hangs from the jack you choose and swings on a spring into its route below; idle, it patches each line in turn
// Beyond: San Francisco's local time on a big dial beside Hanzo's Ferry Building address, how many hours that is from your own clock, and one tap to copy hello@hanzo.ai
import Contact from '../../components/pages/Contact';
import JsonLd from '../../components/JsonLd';

export const metadata = { title: 'Contact — Hanzo AI', description: "Reach Hanzo's sales, support and press teams, book a call, or find us in San Francisco." };

export default function Page() {
  return <><JsonLd route="/contact" /><Contact /></>;
}
