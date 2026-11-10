// V2: 8/10 re-review fixes: one quiet skill row with a gliding pill, perks crossfade and stay in view on phones, phone numerals clear of titles, a sheet opens in its own white carrying its title onto the role h1 (careers/door.js), the next section peeks at 1470×801, JS off and reduced motion clean
// Persona: an engineer or researcher deciding whether to apply · Goal: open a role and apply · CTA: View Open Positions (careers.hero) · Metric: one contact click (cta_click careers.*)
// Signature: the open roles are a deck of full sheets; scroll and each role rises over the last while the stack behind settles back, click one and the sheet opens into its page
// Beyond: Match what you know: tap the skills you have, word for word from Hanzo's role descriptions, and the roles that ask for them stay lit with the words marked
import Careers from '../../components/pages/Careers';
import JsonLd from '../../components/JsonLd';
import { board } from '../../components/pages/careersData';
import { metaOf } from '../../components/pages/htmltree';

const m = metaOf('/careers');
export const metadata = { title: m.title, description: m.description };

export default function Page() {
  return <><JsonLd route="/careers" /><Careers d={board()} /></>;
}
