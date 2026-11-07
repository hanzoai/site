// V2: 8/10 v3 to JAMES.md: ink and greys only, no labels over any headline, hero and its one ask fit 1470×801 and 375×812, the patch panel patches each line once then rests, "Visit" as the dark room with a live clock, the community beside a contour plate that redraws on hover
// Persona: anyone with a question for Hanzo (buyer, developer, customer, press) · Goal: reach the right people in one choice · CTA: Talk to sales (contact.hero) · Metric: the one contact click (contact_sales_submit downstream)
// Signature: a patch panel: four jacks across the top, a cable that hangs from the jack you choose and swings on a spring into its route below; on arrival it patches each line once, then rests on Sales
// Beyond: San Francisco's local time on a live dial beside Hanzo's Ferry Building address, and one tap to copy hello@hanzo.ai
// Deletes: the blue accent, the eyebrows over the h1 and the address, the route counters, the invented clock captions, the endless patching loop and wire pulse, the text-only community list
import Contact from '../../components/pages/Contact';
import JsonLd from '../../components/JsonLd';

export const metadata = { title: 'Contact — Hanzo AI', description: "Reach Hanzo's sales, support and press teams, book a call, or find us in San Francisco." };

export default function Page() {
  return <><JsonLd route="/contact" /><Contact /></>;
}
