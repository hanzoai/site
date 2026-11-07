// V2: 8/10 Utility: huge kinetic "Talk to sales" beside one big question at a time on a card over a living violet field, your brief building itself as you answer, Enterprise's inclusions as a numbered list you add to that brief, launches on a slow logo rail
// Signature: the enquiry is a conversation: one question per screen of the card, set large; Enter moves on, the answer slides up and away and the next question rises while a progress line springs along
// Beyond: Your brief: your answers gather under the questions, and any of the five things Enterprise includes can be added from the last question or straight from the list, written into your note in Hanzo's words
import ContactSales from '../../components/pages/ContactSales';
import JsonLd from '../../components/JsonLd';

export const metadata = { title: "Talk to sales — Hanzo AI", description: "Tell us what you want to build. We come back with a plan for your company: where Hanzo runs, what it costs and how you start." };

export default function Page() {
  return <><JsonLd route="/contact-sales" /><ContactSales /></>;
}
