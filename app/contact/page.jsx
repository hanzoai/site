// Signature: A switchboard: choose why you are writing and a patch cable carries you to the right route, which slides in
// Beyond: The local time in San Francisco ticking beside Hanzo's Ferry Building address, and one tap to copy hello@hanzo.ai
import Contact from '../../components/pages/Contact';
import JsonLd from '../../components/JsonLd';

export const metadata = { title: 'Contact — Hanzo AI', description: "Reach Hanzo's sales, support and press teams, book a call, or find us in San Francisco." };

export default function Page() {
  return <><JsonLd route="/contact" /><Contact /></>;
}
