// V2: 8/10 Stage stack (the documents arrive as paper that deals itself), filter chips with cards that re-flow and open into their document, the data-use ladder, calm contact rows, sepia accent
// Signature: the legal documents as a stack of paper that deals itself, each sheet carrying its own address on hanzo.ai/legal
// Beyond: find the one you need — filter the eleven documents by kind and the cards re-flow, each opening into its document
import LegalIndex from '../../components/pages/LegalIndex';
import JsonLd from '../../components/JsonLd';
import { legalIndex, pagesIndex } from '../../components/pages/legalData';

const m = pagesIndex()['/legal'];
export const metadata = { title: m.title, description: m.description };

export default function Page() {
  return <><JsonLd route="/legal" /><LegalIndex d={legalIndex()} /></>;
}
