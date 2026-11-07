// Signature: a magazine cover that turns itself: six latest headlines wipe through in turn while a red curtain crosses the art plate and its contour field redraws from the new title
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
