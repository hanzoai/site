// V2: 7/10 Utility, review 6/10 fixes: the conversation plays itself once from Hanzo's field labels before anyone types (none under reduced motion), every row presses .98 and adds on a tap with its numeral inked, ease-emphasis 300ms on the progress line, chips and toggles, and the closing Band's "Talk to sales" glides back to the card; the header ask stays the shared "Try Hanzo" (requested)
// Persona: an enterprise buyer weighing data residency and vendor consolidation · Goal: send a qualified enquiry · CTA: Talk to sales (contact-sales.submit) · Metric: contact_sales_submit
// Signature: the enquiry is a conversation: one question per screen of the card, set large; Enter moves on, the answer lifts away and the next question rises while a progress line glides along and the contour field redraws for every answer. Before anyone types it plays once: "Full name" types in, lifts away, "Work email" rises, a chip lands, then rest
// Beyond: any of the five things Enterprise includes can be added to your enquiry from the last question's numerals or the giant numerals below; kept apart from your own words and joined into the note only when you send, in Hanzo's sentences
// Deletes: the violet accent and field, the Enterprise eyebrow, the invented labels, the 01 / 05 counter, cal.com ↗, the numeral chips, the raw .x-btn submit, data-ask-hide on the rail, arrow keys that chose and advanced, the blinking fake caret, native logo tooltips, raw img
import ContactSales from '../../components/pages/ContactSales';
import JsonLd from '../../components/JsonLd';

export const metadata = { title: "Talk to sales — Hanzo AI", description: "Tell us what you want to build. We come back with a plan for your company: where Hanzo runs, what it costs and how you start." };

export default function Page() {
  return <><JsonLd route="/contact-sales" /><ContactSales /></>;
}
