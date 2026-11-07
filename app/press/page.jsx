// V2: 8/10 Editorial story: masthead kinetic headline beside the press kit dealing its plates, the kit as an asymmetric spread, the boilerplate as a standfirst, the news as huge headlines with a card that follows the pointer, press contact as the one dark room
// Signature: the news index: six headlines set huge, one per line; point at one and the rest step back while a card with its date and summary follows the pointer on a spring
// Beyond: the boilerplate copies in one press and the press email copies beside the address, so a writer leaves with both without retyping
import Press from '../../components/pages/Press';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Press Resources. — Hanzo AI',
  description: 'Everything you need to write about Hanzo AI, Inc. Download our press kit, access brand assets, and find media contacts.',
};

export default function Page() {
  return <><JsonLd route="/press" /><Press /></>;
}
