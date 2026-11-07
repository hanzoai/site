// V2: 8/10 Utility to MASTER.md and review/contact.md (re-walk at 94acb12, 7/10): the community list in three sizes (26px names over their own mono addresses, only the row you are on grows 1.3x then settles back, the plate's big name), no duplicate plate name on phones (the plate rides on a white mat as a contour strip), the cable and plate name on ease-emphasis 400/300ms (no spring), a visible "Copied" with a drawn tick (role=status) after a real copy, card rewritten in the template format
// Persona: anyone with a question for Hanzo (buyer, developer, customer, press) · Goal: reach the right people in one choice · CTA: Talk to sales (contact.hero, data-thumb "Talk to sales") · Metric: the one contact click (contact_sales_submit downstream)
// Signature: a patch panel: four jacks across the top, a cable from the jack you choose into its route below, its plug lifting out of one socket and seating in the next (400ms ease-emphasis, no bounce); after the headline lands it sweeps the sockets once and lands back on Sales, then hangs and sways; on phones a short wire drops from the chosen pill
// Beyond: San Francisco's local time on a live dial beside Hanzo's Ferry Building address, and one tap to copy hello@hanzo.ai with a visible "Copied"
// Deletes: the blue accent, the eyebrows over the h1 and the address, the route counters and 01–04 jack numerals, the invented clock captions, the auto-switching routes and wire pulse, the Visit room's contour map, raw .x-btn heroes, springs, the CSS that broke the Band's hover, the opacity-0 and inert states that hid three routes with JS off, the phone plate's repeated name
import Contact from '../../components/pages/Contact';
import JsonLd from '../../components/JsonLd';

export const metadata = { title: 'Contact — Hanzo AI', description: "Reach Hanzo's sales, support and press teams, book a call, or find us in San Francisco." };

export default function Page() {
  return <><JsonLd route="/contact" /><Contact /></>;
}
