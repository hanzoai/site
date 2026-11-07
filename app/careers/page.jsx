// V2: 8/10 v3 to JAMES.md: no labels over headlines, ink and greys only, hero and its one ask fit 1470×801, one solid per screen with the ask sticky after the hero, perks pinned with numerals and Sigil, every section holds an object
// Persona: an engineer or researcher deciding whether to apply · Goal: open a role and apply · CTA: View Open Positions (careers.hero) · Metric: one contact click (cta_click careers.*)
// Signature: the open roles are a deck of full sheets; scroll and each role rises over the last while the stack behind settles back, click one and its title flies into the role page's headline
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
