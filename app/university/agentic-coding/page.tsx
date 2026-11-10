import UniversityCoding from '../../../components/pages/UniversityCoding';
import JsonLd from '../../../components/JsonLd';
import INDEX from '../../../content/pages.json';

export const metadata = { title: INDEX['/university/agentic-coding'].title, description: INDEX['/university/agentic-coding'].description };

export default function Page() {
  return <><JsonLd route="/university/agentic-coding" /><UniversityCoding /></>;
}
