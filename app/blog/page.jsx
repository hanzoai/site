// Signature: the cover story turns itself, six latest headlines wiping up in turn; the archive set as a book's contents
// Beyond: the publishing strip, a bar per month counted from Hanzo's own post dates, that narrows the contents to a month
import BlogIndex from '../../components/pages/BlogIndex';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Blog — Hanzo AI',
  description: 'Insights on AI agents, Zen foundation models, MCP infrastructure, and enterprise deployment from the engineers building Hanzo Cloud.',
};

export default function Page() {
  return <><JsonLd route="/blog" /><BlogIndex /></>;
}
