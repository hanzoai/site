import McpPage from '../../components/pages/McpPage';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Hanzo MCP — 260+ tools and 1,538 cloud operations for AI agents — Hanzo AI',
  description: 'Model Context Protocol server for AI agents: filesystem, shell, AST code intelligence, Kai sub-10ms decisions, browser CDP, issue tracker, persistent memory, and 117 Hanzo Cloud services over stdio or streamable HTTP.',
};

export default function Page() {
  return <><JsonLd route="/mcp" /><McpPage /></>;
}
