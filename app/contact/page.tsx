// V2: 8/10 Utility to MASTER.md and review/contact.md (round 2 at e3f60107, 7/10): resting type at live hanzo.ai sizes (h1 52px, "Visit" and "Join the community" 26px, route headings 26px), the Visit room's one big thing is the clock (address 21px, city 17px), the desktop plate's contour a step darker and redrawn as a visible 500ms draw-on with a leading hairline, the phone plate scrolls away with its heading (nothing pinned under the glass header), dead data-cursor removed; earlier: 26px community names over mono addresses with only the active row growing, no springs, visible "Copied"
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
