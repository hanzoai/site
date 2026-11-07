// V2: 8/10 v3 to JAMES.md and review/contact.md: ink and greys only, no labels over headlines, the Sales route and its one ask never move (the cable alone sweeps the four sockets once after the curtain and plugs back in, plug and wire one drawing), jack hover shows what the line does, all routes readable with JS off, "Visit" as the dark middle room beside a big live clock, the community plate follows the row you reach, a closing Band
// Persona: anyone with a question for Hanzo (buyer, developer, customer, press) · Goal: reach the right people in one choice · CTA: Talk to sales (contact.hero) · Metric: the one contact click (contact_sales_submit downstream)
// Signature: a patch panel: four jacks across the top, a cable from the jack you choose swinging on a spring into its route below, its plug lifting out of one socket and seating in the next; after the curtain the cable alone sweeps the sockets once and lands back on Sales
// Beyond: San Francisco's local time on a live dial beside Hanzo's Ferry Building address, and one tap to copy hello@hanzo.ai
// Deletes: the blue accent, the eyebrows over the h1 and the address, the route counters and 01–04 jack numerals, the mono URL lines, the invented clock captions, the auto-switching routes and wire pulse, the Visit room's contour map, raw .x-btn heroes, the opacity-0 and inert states that hid three routes with JS off
import Contact from '../../components/pages/Contact';
import JsonLd from '../../components/JsonLd';

export const metadata = { title: 'Contact — Hanzo AI', description: "Reach Hanzo's sales, support and press teams, book a call, or find us in San Francisco." };

export default function Page() {
  return <><JsonLd route="/contact" /><Contact /></>;
}
