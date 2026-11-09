// Persona: a finance or platform lead pricing what consolidating a vendor stack onto Hanzo would save
// Goal: a defensible run-rate figure, and the AI bill priced three ways from the live price list
// CTA: none; the page is the tool (a link to nothing it does not state)
// Metric: pageview
// Signature: an operating-cost model where every number follows a visible control, and the one headline tier names what is still missing until the visitor enters it
// Beyond: the token calculator under the title reads the price list, the plans and the model list from api.hanzo.ai when the page opens and says so while it reads, and when it cannot
import INDEX from '../../content/pages.json';
import Calculator from '../../components/pages/Calculator';
import JsonLd from '../../components/JsonLd';

export const metadata = { title: INDEX['/calculator'].title, description: INDEX['/calculator'].description };

export default function Page() {
  return <><JsonLd route="/calculator" /><Calculator /></>;
}
