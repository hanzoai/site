/* What each plan includes, in Hanzo's own words from /pricing (components/pages/Pricing.jsx, as live sets them).
   The checkout, sign-up and onboarding pages show these beside the plan; nothing here is new copy. */
export const COPY = {
  free: { d: 'Chat and build with Hanzo, free.', word: 'No card needed', note: 'Instant access · Free forever', items: ['Chat on the web with Enso Auto', 'Free model requests and Kai decisions included', 'Search the web from chat', 'Write, edit and create content'] },
  go: { d: 'Your everyday AI development toolkit, with access to every model and more included usage.', head: 'Everything in Free, plus:', items: ['Build apps with Hanzo Dev', 'Connect any MCP server in Hanzo Dev', 'The Hanzo CLI for macOS, Windows and Linux', 'Every model, including Enso Ultra and Kai'] },
  pro: { x: '3x', d: 'For serious builders running agents, shipping code, and needing substantially higher limits.', head: 'Everything in Go, plus:', items: ['3x more usage than Go', '3x higher limits than Go', 'Hanzo Bot: 1 bot of your own'] },
  dev: { x: '5x', d: 'For serious builders running agents, shipping code, and needing substantially higher limits.', head: 'Everything in Pro, plus:', items: ['5x more usage than Go', '5x higher limits than Go', 'Hanzo Bot: 2 bots of your own'] },
  max: { x: '15x', d: 'For serious builders running agents, shipping code, and needing substantially higher limits.', head: 'Everything in Dev, plus:', items: ['15x more usage than Go', '15x higher limits than Go', 'Hanzo Bot: 5 bots of your own'] },
  ultra: { x: '∞', d: 'For the biggest workloads. Usage beyond what is included is paid from your prepaid balance at list price', head: 'Everything in Max, plus:', items: ['Highest included usage across every model', 'Continuous usage with no window resets', 'Hanzo Bot: 10 bots of your own'] },
  team: { d: 'For teams of 2 to 100: every model and usage for each member, one workspace, one bill.', items: ["Add premium seats to raise the team's shared usage", 'One shared workspace: chat, meetings, calendar and contacts', 'Single sign-on, roles and an audit log', 'One bill for the whole team'] },
};
// Hanzo's own billing notes (/pricing)
export const NOTE = { paid: 'No commitment · Cancel anytime', monthly: 'Billed monthly', team: 'Standard & Premium seats · From 2 members' };
