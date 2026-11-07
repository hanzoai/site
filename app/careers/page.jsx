// V2: 8/10 Chaptered: four-line kinetic hero beside a live hiring card, still editorial perks, roles as a deck of sheets that stack on scroll and open into their page, one dark closing room
// Signature: the open roles are a deck of full sheets; scroll and each role rises over the last while the stack behind settles back, click one and it opens into its page
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
