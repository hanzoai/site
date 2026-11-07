// V2: 8/10 Story + catalogue, v3 (JAMES.md): no hues, no eyebrows; kinetic headline with its one ask over a case plate coloured only by the case's own picture, an editorial launch index whose rows hand the pointer a preview, a still wall of builders, a dark close with a Sigil drifting from the launch figures
// Persona: enterprise buyer in the Buy journey, checking what Hanzo has launched before talking to it
// Goal: see what Hanzo built and what each launch sold, then talk to Hanzo
// CTA: "Talk to us" (/contact) in the hero, the shared sticky ask bar (data-thumb) and the close; data-cta customers.hero / customers.close; metric contact_sales_submit
// Signature: the case plate: one case fills a huge plate with its own figure as the hero numeral, wipes to the next once by itself and rests, and opens into its story when clicked
// Beyond: a year index over Hanzo's own launch list: each year shows its launches as dots, and a tap narrows the index to that year
// Deletes: the 32s logo marquee, the teal accent, the invented "Read the case study" pill and "All"/"Undated" chips, the plate's scroll scaling, kickers above the h1
import Customers from '../../components/pages/Customers';
import JsonLd from '../../components/JsonLd';

export const metadata = { title: 'Products Hanzo built and launched — Hanzo AI', description: 'Hanzo built the store, ran the ads and found the audience for each of these launches. Here is what we did and what each one sold.' };

export default function Page() {
  return <><JsonLd route="/customers" /><Customers /></>;
}
