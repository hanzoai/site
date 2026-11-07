// V2: 8/10 Utility to MASTER.md and review/contact.md (re-review 2): deck type and neutrals only, the h1 high on the first screen with the next room peeking, flat jack tiles, the route's ask never moves and the header stays outline through every switch, the jack's action prints only where it fits whole, the cable sweeps then drifts visibly on desktop and phone, the ask above the fold at 375×667, entrances on CSS delays (a failed bundle still shows the ask), the Visit room opening from a rounded card, a closing Band
// Persona: anyone with a question for Hanzo (buyer, developer, customer, press) · Goal: reach the right people in one choice · CTA: Talk to sales (contact.hero) · Metric: the one contact click (contact_sales_submit downstream)
// Signature: a patch panel: four jacks across the top, a cable from the jack you choose into its route below, its plug lifting out of one socket and seating in the next; after the headline lands it sweeps the sockets once and lands back on Sales, then hangs and sways; on phones a short wire drops from the chosen pill
// Beyond: San Francisco's local time on a live dial beside Hanzo's Ferry Building address, and one tap to copy hello@hanzo.ai
// Deletes: the blue accent, the eyebrows over the h1 and the address, the route counters and 01–04 jack numerals, the mono URL lines, the invented clock captions, the auto-switching routes and wire pulse, the Visit room's contour map, raw .x-btn heroes, springs, the CSS that broke the Band's hover, the opacity-0 and inert states that hid three routes with JS off
import Contact from '../../components/pages/Contact';
import JsonLd from '../../components/JsonLd';

export const metadata = { title: 'Contact — Hanzo AI', description: "Reach Hanzo's sales, support and press teams, book a call, or find us in San Francisco." };

export default function Page() {
  return <><JsonLd route="/contact" /><Contact /></>;
}
