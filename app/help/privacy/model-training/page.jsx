import HelpArticle from '../../../../components/pages/help/HelpArticle';
import JsonLd from '../../../../components/JsonLd';
import { article, meta } from '../../../../components/pages/help/helpData';

const SLUG = 'privacy/model-training';
const m = meta(SLUG);
export const metadata = { title: m.title, description: m.description };

export default function Page() {
  return <><JsonLd route={'/help/' + SLUG} /><HelpArticle doc={article(SLUG)} /></>;
}
