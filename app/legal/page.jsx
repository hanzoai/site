import LegalIndex from '../../components/pages/LegalIndex';
import JsonLd from '../../components/JsonLd';
import { legalIndex, pagesIndex } from '../../components/pages/legalData';

const m = pagesIndex()['/legal'];
export const metadata = { title: m.title, description: m.description };

export default function Page() {
  return <><JsonLd route="/legal" /><LegalIndex d={legalIndex()} /></>;
}
