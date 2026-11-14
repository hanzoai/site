/* The AI buying specialist's facts: Hanzo's seat prices, the brief it sends with every question, and Hanzo's own
   written answers (the quote card, and the answer when the chat endpoint cannot be reached). */
import { PLANS, SEATS, teamCart } from '../../lib/plans.ts';

// Hanzo's seat prices (its pricing page and the specialist's own figures), from lib/plans.js
export const P = { std: SEATS.standard.year, stdMo: SEATS.standard.month, prem: SEATS.premium.year, premMo: SEATS.premium.month, ent: SEATS.enterprise.year, save: SEATS.saving };
export const r2 = (v: number) => Math.round(v * 100) / 100;
export const usd = (v: number) => '$' + v.toLocaleString('en-US', { maximumFractionDigits: 2 });

export const BRIEF = (name: string) => [
  'You are the Hanzo AI Buying Specialist on hanzo.ai. Help visitors and customers choose the right Hanzo plan, calculate exact pricing, and start plan selection or book a sales call.', '',
  'Authoritative Hanzo Plan & Pricing Catalog (from commerce.hanzo.ai):',
  '1. Personal Plans (individual, monthly self-serve at /pricing?tab=personal):',
  '   - Free ($0/mo): Everyday chat and exploration.',
  `   - Go ($${PLANS.go.price}/mo): Everyday AI development toolkit, Hanzo Bot (hanzo.bot — unlimited bots), Hanzo Dev, CLI, MCP servers, every model (Enso Ultra, Kai, Zen), background agents, daily automations.`,
  `   - Pro ($${PLANS.pro.price}/mo): 3x more usage and higher limits than Go, Hanzo Team (hanzo.team) workspace included, Hanzo Bot (unlimited bots), custom model training, Hanzo Engine.`,
  `   - Dev ($${PLANS.dev.price}/mo): 5x more usage and higher limits than Go, Hanzo Team workspace, Hanzo Bot (unlimited bots).`,
  `   - Max ($${PLANS.max.price}/mo): 15x more usage and higher limits than Go, Hanzo Team workspace, Hanzo Bot (unlimited bots).`,
  `   - Ultra ($${PLANS.ultra.price}/mo): Unlimited usage across every model, 25x higher rate limits than Go & priority queue, Hanzo Team workspace, Hanzo Bot (unlimited bots).`,
  `2. Team Plan (2 to 100 members, self-serve at ${teamCart(10)}):`,
  `   - Standard Seat: $${P.std / 12}/member/mo billed yearly ($${P.std}/yr) or $${P.stdMo}/member/mo billed monthly. Shared workspace (chat, meetings, calendar, contacts), SSO, roles, audit log, one bill, daily automations.`,
  `   - Premium Seat: $${P.prem / 12}/member/mo billed yearly ($${P.prem.toLocaleString('en-US')}/yr) or $${P.premMo}/member/mo billed monthly. 5x more usage than Standard seats. Mix Standard and Premium seats on one team and one bill.`,
  '3. Enterprise Plan (self-serve for 20 to 500 seats at /enterprise/qualification, or custom contract for >500 seats):',
  `   - Seat price + usage at API rates: $${P.ent / 12}/seat/month billed annually ($${P.ent}/seat/year, 20-seat minimum, up to 500 seats self-serve) plus a prepaid usage balance drawn down at API rates.`,
  '   - Includes all Team features plus Audit logs, SCIM provisioning through Hanzo IAM, and deployment on Hanzo Cloud, your cloud VPC, your servers, or air-gapped.',
  '4. Sales & Calls:',
  '   - For more than 500 seats, tailored usage commitments, or sales questions, invite the user to book a call at https://cal.com/hanzo or visit /contact-sales.', '',
  'Guidelines:', '- Be concise, warm, and specific with dollar figures.', '- Never invent certifications or contractual uptime numbers.',
  '- Always end by prompting the user to start their plan selection (Personal, Team, or Enterprise) using the buttons below, or book a call at [cal.com/hanzo](https://cal.com/hanzo) for sales questions.',
  '', `The user's name is ${name}.`,
].join('\n');

/* Hanzo's own written answers: used for the quote card, and as the answer when the endpoint cannot be reached. */
export function written(q: string, name: string) {
  const o = q.toLowerCase();
  const sm = r2(P.std / 12), pm = r2(P.prem / 12), em = r2(P.ent / 12);
  const w = o.match(/\b(\d+)\s*(people|developers?|engineers?|members?|seats?|devs?|users?)?\b/);
  const b = w ? parseInt(w[1], 10) : null;
  if (o.includes('enterprise') || o.includes('vpc') || o.includes('dedicated') || o.includes('cluster') || (b && b > 100)) {
    const e = Math.min(500, Math.max(20, b ?? 20));
    return { content: ['For organizations deploying at scale, **Hanzo Enterprise** is built for both self-serve setup (20 to 500 seats) and custom contracts (>500 seats).', '', 'Here is how Enterprise works:', `- **Seat Price + Usage at API Rates**: **$${em}/seat/month** billed annually ($${P.ent}/seat/year, 20-seat minimum, up to 500 seats self-serve) plus a prepaid usage balance drawn down at API rates.`, '- **Deployment Options**: Run on Hanzo Cloud, in your own cloud VPC (AWS, GCP, Azure), on your own servers, or in air-gapped environments.', '- **Security & Governance**: Centralized SSO, SCIM provisioning through Hanzo IAM, role-based access control, and audit logs.', '', 'You can start your Enterprise plan setup right now, or book a call with our sales team at [cal.com/hanzo](https://cal.com/hanzo).'].join('\n'), quote: { plan: 'Enterprise', seats: e, monthlyTotal: null, annualTotal: e * P.ent, savings: null, checkoutUrl: '/enterprise/start' } }; // billed annually only (the brief): no monthly rate, so no saving
  }
  if (b && b > 1) {
    const yr = b * P.std, mo = b * P.stdMo, ns = Math.max(1, Math.round(0.7 * b)), np = b - ns, mix = ns * P.std + np * P.prem;
    return { content: [`For a team of **${b} members**, the **Hanzo Team** plan provides the best balance of pooled usage, shared workspaces, and team controls.`, '', 'You have two seat tiers that you can mix on one single bill:', `- **Standard Seat**: **$${sm}/seat/mo** billed annually ($${P.std} upfront) or $${P.stdMo}/mo monthly. Ideal for engineers writing code, using Claude Code / Cursor, and running everyday agentic workflows.`, `- **Premium Seat**: **$${pm}/seat/mo** billed annually ($${P.prem.toLocaleString('en-US')} upfront) or $${P.premMo}/mo monthly. Provides **5× more usage**, higher rate limits, and priority inference across every model.`, '', `### Your Pricing Options for ${b} Seats:`, `- **All Standard (${b} seats)**: **$${b * sm}/mo** billed annually ($${yr}/year), saving $${12 * mo - yr} vs monthly.`, `- **Mixed Setup (${ns} Standard + ${np} Premium)**: **$${r2(mix / 12)}/mo** billed annually ($${mix}/year).`, '', 'Both setups include unified billing, team workspaces, SSO, and shared automations.'].join('\n'), quote: { plan: 'Hanzo Team', seats: b, monthlyTotal: mo, annualTotal: yr, savings: P.save, checkoutUrl: teamCart(b) } };
  }
  if (o.includes('standard') || o.includes('premium') || o.includes('difference') || o.includes('seat')) {
    return { content: ["Here is the exact breakdown between Hanzo's two seat tiers:", '', `### 1. Standard Seat ($${sm}/mo annual / $${P.stdMo} monthly)`, '- **Everything in Hanzo Pro**, plus shared company workspaces.', '- Access to every model (Enso, Zen, Kai, Sonnet, Opus, GPT-5).', '- Hanzo Dev and full CLI tooling (Claude Code, Cursor, Codex acceleration).', '- Pooled limits and unified billing across your team.', '', `### 2. Premium Seat ($${pm}/mo annual / $${P.premMo} monthly)`, '- **5× higher usage allowances** and 5× higher request limits.', '- **Priority inference** during peak frontier model congestion.', '- Early access to unreleased models and experimental agentic harnesses.', '', 'Organizations can **freely mix** Standard and Premium seats on a single team account. For instance, in a 10-person engineering team, you can assign 8 Standard seats and 2 Premium seats for lead researchers.'].join('\n') };
  }
  if (o.includes('compare') || o.includes('vs')) {
    return { content: ['Here is a side-by-side comparison between **Team** and **Enterprise**:', '', `- **Hanzo Team** ($${sm}–$${pm}/seat/mo):`, '  - Self-serve signup starting at 2 seats.', `  - Mix Standard ($${sm}) and Premium ($${pm}) seats.`, '  - Multi-user workspace, shared chat, meetings, and shared storage.', '  - Centralized credit card or invoicing.', '', '- **Hanzo Enterprise** (Custom pricing):', '  - For organizations with strict compliance, security, or massive scale requirements.', '  - Custom VPC deployment (AWS, GCP, Azure, or on-premises).', '  - Dedicated GPU clusters with guaranteed inference latency SLAs.', '  - Enterprise SAML SSO, SCIM, and contracted 24/7 technical support.', '', 'How many team members are you planning to onboard?'].join('\n') };
  }
  return { content: [`Great to meet you, ${name}! I can help you configure the right setup for your team.`, '', 'To give you the exact numbers and plan recommendation:', '1. **How many people** will be using Hanzo?', '2. **What are your primary use cases** (e.g. coding agents, Claude Code acceleration, model routing, or custom APIs)?', '3. Do you have specific **compliance requirements** like custom VPC or SSO?'].join('\n') };
}

