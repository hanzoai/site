import Careers from '../../components/pages/Careers';
import JsonLd from '../../components/JsonLd';
import { board } from '../../components/pages/careersData';
import { metaOf } from '../../components/pages/htmltree';

const m = metaOf('/careers');
export const metadata = { title: m.title, description: m.description };

export default function Page() {
  return <><JsonLd route="/careers" /><Careers d={board()} /></>;
}
