// Hanzo's header menus, exactly as hanzo.ai shows them (read from the live site, 7 Nov 2026).
// Pages this site does not have (Hanzo's app, /reviews, /university...) link to hanzo.ai.
// Each column: [heading, [label, href, flags]]; flags: B = large link, X = opens another site.
// Investors is the footer's only (Zach, hanzo-inc/app#204): no menu lists it (scripts/investors.test.mjs).
const parse = (cols) => cols.map((c) => {
  const [head, ...links] = c.split(';');
  return { head: head.slice(1), links: links.map((l) => { const [label, href, ...f] = l.split('|'); return { label, href, big: f.includes('B'), ext: f.includes('X') }; }) };
});

export const NAV = {
  Company: parse([
    '#Explore Company;About Us|/about|B;Blog|/blog|B;Reviews|https://hanzo.ai/reviews|B;Careers|/careers|B;News|/press|B',
    '#Resources;Brand Guidelines|/brand;Philosophy|/philosophy;Contact|/contact',
    '#Blog;Optimizing for Headless Commerce in the Era of Agentic LLMs|https://hanzo.blog/headless-commerce-agentic-llms/|X;Your AI is Planning To Kill You|https://hanzo.blog/2026-10-16-your-ai-is-planning-to-kill-you/|X;Kai 1: Decisions, Not Completions|https://hanzo.blog/2026-10-07-introducing-kai/|X;All articles|/blog',
  ]),
  Research: parse([
    '#Releases;Enso|/enso|B;Kai|/kai|B;Zen 6|/zen|B;Zen 7|/zen/7|B',
    '#Creative AI;Koma|/koma;Iro|/iro;Mori|/mori;Oto|/oto;Koe|/koe;Uta|/uta',
    '#Explore Research;All models|/models;Benchmarks|/benchmarks;Overview|/research;Compare|/compare;Open source|/open-source;Specifications|https://hips.hanzo.ai|X',
    '#Safety;Security|/security;Trust & transparency|/trust',
  ]),
  Products: parse([
    '#AI Models;All models|/models|B;LLMs|/zen|B;Decisions|/kai|B;Routing|/enso|B',
    '#Creative AI;Video|/koma;Images|/iro;3D|/mori;Sound effects|/oto;Voice|/koe;Music|/uta',
    '#Apps and tools;Hanzo App|https://hanzo.app|X;Hanzo CLI|/cli;Hanzo Dev|/dev;MCP|/mcp;Skills|/skills',
    '#API Platform;Overview|/platform;API|/api;Playground|/playground;Gateway|/gateway;Agents|/agents;Base|/base;Machines|/machines',
    '#Install;CLI|/cli;Desktop app|/desktop;Browser extension|/extension;IDE|/ide;All downloads|/download;Release notes|https://github.com/hanzoai/cli/releases|X',
  ]),
  Solutions: parse([
    '#Explore Solutions;All solutions|/solutions|B;Enterprise|/enterprise|B;Customer stories|/customers|B;Contact sales|/contact-sales|B',
    '#Teams;Finance|/solutions/finance;Data|/solutions/data;Sales|/solutions/sales;Marketing|/solutions/marketing;Operations|/solutions/operations;Engineering|/solutions/engineering;Design|/solutions/design',
    '#Industries;Cybersecurity|/solutions/cybersecurity;Financial services|/solutions/financial-services;Healthcare|/solutions/healthcare;Law|/solutions/law;Retail|/solutions/retail;Government|/solutions/government;Education|/solutions/education',
    '#Use cases;Content creation|/solutions/content-creation;Research|/solutions/research;Agents|/solutions/agents',
    '#Programs;Reserved tier|/solutions/reserved;Startups|/startups;Partner network|/affiliate;Cost calculator|https://hanzo.ai/calculator',
  ]),
  Developers: parse([
    '#Explore Developers;Documentation|https://docs.hanzo.ai|B|X;API reference|https://docs.hanzo.ai/docs/openapi/|B|X;Quickstart|https://docs.hanzo.ai/docs/quickstart/|B|X;SDKs|/sdks|B;Open models|https://huggingface.co/zenlm|B|X',
    '#Resources;Agents sign up free|/agents#headless;API keys|https://platform.hanzo.ai/api-keys|X;Claude Code, Codex, Cursor|https://platform.hanzo.ai/accelerate|X;Integrations|/integrations;Examples|/gallery',
    '#Community;GitHub|https://github.com/hanzoai|X;Status|https://status.hanzo.ai|X',
  ]),
  Learn: parse([
    '#Research & Guides;Overview|/learn;Coding agents|https://docs.hanzo.ai/docs/coding|X;Guides|https://docs.hanzo.ai/docs/guides/|X;Cookbook|https://docs.hanzo.ai/docs/guides/cookbook/|X',
    '#Support;Documentation|https://docs.hanzo.ai|X;Help center|/support',
    '#Education;Education|https://hanzo.university|X;Agentic coding|https://hanzo.ai/university/agentic-coding;Reinforcement learning|https://hanzo.ai/university/reinforcement-learning;Systems engineering|https://hanzo.ai/university/systems-engineering;AI practitioner|https://hanzo.ai/university/ai-practitioner;AI architect|https://hanzo.ai/university/ai-architect;Agentic marketing|https://hanzo.ai/university/agentic-marketing',
  ]),
};
export const MENUS = Object.keys(NAV);
