/* One legal document as a page: /legal/<slug>, and the short addresses hanzo.ai has always answered on (/privacy,
   /terms, /aup, /cookies, /data-deletion). They render the same document through this one component and their
   canonical points at /legal/<slug>, so a document cannot be drawn two ways. */
import LegalDoc from './LegalDoc';
import JsonLd from '../JsonLd';
import { SLUGS, legalDoc, pagesIndex } from './legalData';

export const legalMeta = (slug: string): { title?: string; description?: string } => {
  const m = pagesIndex()['/legal/' + slug];
  return m ? { title: m.title, description: m.description } : {};
};

export default function LegalRoute({ slug }: { slug: string }) {
  return <><JsonLd route={'/legal/' + slug} /><LegalDoc doc={legalDoc(slug)} peek={Object.fromEntries(SLUGS.map((x) => [x, legalDoc(x).lede]))} /></>;
}
