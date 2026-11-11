/* /agents' questions, with their answers as /agents draws them and as its FAQPage states them (app/agents/page.jsx passes
   them to JsonLd): the page and the structured data read one list. The cost answer names two figures, each read from its
   source: Kai's input rate from the price list (content/live/_models.json) and the cheapest plan for a person from the plan
   list (lib/plans.js). */
import MODELS from '../../content/live/_models.json' with { type: 'json' };
import { FLOOR, usd } from '../../lib/plans.ts';

const kai = MODELS.models.find((m) => m.id === 'kai');
if (!kai) throw new Error(`kai is not in ${MODELS.source}`);
export const KAI = '$' + kai.pricing.input_per_million;

export const QA = [
  ['What is free?', 'Signing up, the API key and a small free allowance to try it. GET /v1/billing/tier, with your key, says what your account allows and what is left, and every answer carries X-RateLimit-Remaining. A person on the Free plan gets free model requests and Kai decisions; the request after the allowance answers 429 until its window resets.'],
  ['What does it cost after that?', `You pay as you go from the balance you top up: each call is billed at its model’s rate in GET /v1/pricing. Kai is ${KAI} per million input tokens, and its output is free. Plans for people start at ${usd(FLOOR.paid)} a month, and GET /v1/billing/plans lists every one.`],
  ['Can an agent sign up without a person?', 'Yes. With a wallet it needs no inbox and no person: it signs a one-time challenge from hanzo.id, a first-seen wallet gets its own account and organization, and it mints a key with the token it gets back. The whole flow is the script above. An agent with an inbox can sign up by email code instead, and one with neither has its person approve a device code once.'],
  ['How does an agent pay?', 'Over the API in stablecoins: GET /v1/billing/crypto/options lists the chains (today Base, Ethereum and Solana) and the tokens (USDC and USDT) the rail accepts, POST /v1/billing/crypto/deposit returns the address to send to, and GET /v1/billing/crypto/deposit/{id} says when it is credited. Cards, Apple Pay and Google Pay go through the checkout at hanzo.ai/pay, which needs a browser.'],
  ['How do I keep an agent from overspending?', 'Give each agent its own key with a monthly budget in cents and a rate in requests a minute: past the budget a call answers 402, past the rate 429. A session can carry its own cap, set with POST /v1/agent/sessions/{id}/budget, and a session that reaches it pauses until the cap is raised.'],
  ['Which tools can my agent use?', 'The native Hanzo MCP server, over stdio from one line in Claude Code, Codex, Cursor and Zed: npx -y hanzo mcp. It carries the Kai decision tools beside files, shell, git, code search, the browser and the computer.'],
];
