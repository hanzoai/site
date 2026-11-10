// V2: 8/10 Story/Catalogue on the Hanzo deck: headline with its lede and one ask side by side, a case plate whose line starts the moment the curtain lifts and which opens into its story, every launch as a scene (rows past a pinned stage that brings in each launch's figures), a year filter that narrows the list, builders as a calm row of names, a black close where the launch figures slide by
// Persona: enterprise buyer in the Buy journey, checking what Hanzo has launched before talking to it
// Goal: see what Hanzo built and what each launch sold, then talk to Hanzo
// CTA: "Talk to us" (/contact) beside the lede, in the shared sticky ask bar (data-thumb) and in the close; data-cta customers.hero / customers.close; metric contact_sales_submit
// Signature: the launch stage: scroll the index and each launch's logo and figures rise into a pinned stage as its row reaches the middle; point at a row and the stage answers; phones get a sticky year rail that marks the year being read
// Beyond: a year index over Hanzo's own launch list: each year shows its launches as dots, and a tap narrows the index to that year
// Deletes: the pointer preview over its own row, the hand-rolled case tabs (kit Tabs), the 01/02 marks, the backer tiles, the closing Sigil, springs, the plate shadow, data-morph on the plate (doorway open)
import Customers from '../../components/pages/Customers';
import JsonLd from '../../components/JsonLd';

export const metadata = { title: 'Products Hanzo built and launched — Hanzo AI', description: 'Hanzo built the store, ran the ads and found the audience for each of these launches. Here is what we did and what each one sold.' };

export default function Page() {
  return <><JsonLd route="/customers" /><Customers /></>;
}
