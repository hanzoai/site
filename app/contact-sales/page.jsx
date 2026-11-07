// V2: 8/10 v3 to JAMES.md: ink and greys only, no label over the h1, the hero and its one ask (the card's arrow) fit 1470×801 and 375×812, invented labels replaced by icons and Hanzo's own sentences, Enterprise's inclusions as five giant numerals you light and add, a logo rail with a pause; arrivals wait for the curtain, every answer readable with JS off
// Persona: an enterprise buyer weighing data residency and vendor consolidation · Goal: send a qualified enquiry · CTA: Talk to sales (contact-sales.submit) · Metric: contact_sales_submit
// Signature: the enquiry is a conversation: one question per screen of the card, set large; Enter moves on, the answer slides up and away and the next question rises while a progress line springs along
// Beyond: any of the five things Enterprise includes can be added to your note, from the last question or straight from the giant numerals, written in Hanzo's words, with its numeral joining the chips under the card
// Deletes: the violet accent and field, the Enterprise eyebrow, the invented labels (Your brief, Next, Back, Sending…, the error and thank-you sentences), the blinking fake caret, native logo tooltips, raw img
import ContactSales from '../../components/pages/ContactSales';
import JsonLd from '../../components/JsonLd';

export const metadata = { title: "Talk to sales — Hanzo AI", description: "Tell us what you want to build. We come back with a plan for your company: where Hanzo runs, what it costs and how you start." };

export default function Page() {
  return <><JsonLd route="/contact-sales" /><ContactSales /></>;
}
