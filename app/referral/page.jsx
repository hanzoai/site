// Signature: the counts in motion: Referred → Pending → Qualified at display size over a small rail of the link, answering the scroll, with a pause
// Beyond: the four steps as one object that happens, runs once and rests; pick any step to replay it
// V2: 8/10 one facet per section, only Hanzo's words; the dark room opens from a card with two pay tracks; closes on the ask; one ask at every width
import Referral from '../../components/pages/Referral';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Bring a builder to Hanzo — Hanzo AI',
  description: 'One link counts everyone who signs up through it, and who goes on to use Hanzo.',
};

export default function Page() {
  return <><JsonLd route="/referral" /><Referral /></>;
}
