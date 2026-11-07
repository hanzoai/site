// V2: a pile of paper that deals itself (the top sheet leaves on top, then tucks under), a ruled index filtered by chips, the four data-use states as a ladder, calm contact rows; no ask; deck greys only
// Signature: the legal documents as a stack of paper that deals itself, each sheet carrying its own address on hanzo.ai/legal
// Beyond: find the one you need — filter the twelve documents by kind and the cards re-flow, each opening into its document
import LegalIndex from '../../components/pages/LegalIndex';
import JsonLd from '../../components/JsonLd';
import { legalIndex, pagesIndex } from '../../components/pages/legalData';

const m = pagesIndex()['/legal'];
export const metadata = { title: m.title, description: m.description };

export default function Page() {
  return <><JsonLd route="/legal" /><LegalIndex d={legalIndex()} /></>;
}
