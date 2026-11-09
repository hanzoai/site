// Signature: the page is the product at work: the workspace of the first screen re-draws itself for five research fields; three real workbenches and eight walkthroughs sit in the bands below
import Science from '../../components/pages/Science';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/science'].title, description: INDEX['/science'].description };

export default function Page() {
  return <><JsonLd route="/science" /><Science /></>;
}
