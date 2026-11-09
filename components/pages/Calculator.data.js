/* True Savings (/calculator): the operating-cost model, as hanzo.ai states it. Every figure on the page is worked out
   from a control a visitor can see and change; nothing in the headline is typed.
   Two axes are kept apart on purpose: COVERAGE (how much of a category Hanzo replaces; it carries weight) and EVIDENCE
   (how well that can be shown; it carries none). Collapsing them would let an attestation read as a verification.
   Billing basis keeps the model meaningful away from the reference deployment: per-seat rows scale on employees,
   per-engineer rows on engineers, platform-fee rows not at all. At 100 employees and 30% engineers every factor is 1,
   which is what reproduces the analyst's $613k software total exactly (Calculator.test.mjs asserts it). */

export const FTE = 220_000; // a fully loaded engineer, used for both the glue reclaimed and Hanzo's own operations
export const REF_E = 100; // the reference deployment the analyst priced against
export const REF_D = 30;

export const WEIGHT = { full: 1, partial: 0.5, experimental: 0.25, roadmap: 0 };
export const COV_LABEL = { full: 'full', partial: 'partial 50%', experimental: 'experimental 25%', roadmap: 'roadmap 0%' };
export const EV_LABEL = { verified: 'verified', gap: 'verified gap', internal: 'internal production', attested: 'management-attested', repo: 'repository-verified' };
export const COV_CYCLE = ['full', 'partial', 'experimental', 'roadmap'];

/* name, what it replaces, the Hanzo services, k = the analyst's default in $k a year at the reference deployment,
   basis = s (per seat) / e (per engineer) / f (platform fee), coverage, evidence */
export const ROWS = [
  { name: 'SSO & workforce identity', replaces: 'Okta / Auth0', hanzo: 'iam · zero-trust · authz', k: 10, basis: 's', cov: 'full', ev: 'internal' },
  { name: 'Customer identity (product)', replaces: 'Auth0 B2C', hanzo: 'iam (multi-tenant, per-org CEK)', k: 14, basis: 'f', cov: 'full', ev: 'internal' },
  { name: 'Secrets & KMS', replaces: 'Vault Cloud', hanzo: 'kms', k: 11, basis: 'e', cov: 'full', ev: 'internal' },
  { name: 'Observability', replaces: 'Datadog / New Relic', hanzo: 'o11y · metrics', k: 54, basis: 'e', cov: 'full', ev: 'internal' },
  { name: 'Error tracking', replaces: 'Sentry', hanzo: 'o11y (errortracking)', k: 9, basis: 'e', cov: 'full', ev: 'internal' },
  { name: 'Feature flags', replaces: 'LaunchDarkly', hanzo: 'flags', k: 7, basis: 'e', cov: 'full', ev: 'repo' },
  { name: 'Product analytics', replaces: 'Amplitude / Mixpanel', hanzo: 'analytics', k: 15, basis: 'f', cov: 'full', ev: 'internal' },
  { name: 'Event routing / CDP', replaces: 'Segment', hanzo: 'destinations · tracker', k: 22, basis: 'f', cov: 'full', ev: 'repo' },
  { name: 'Git hosting', replaces: 'GitHub Enterprise', hanzo: 'git (git.hanzo.ai)', k: 8, basis: 'e', cov: 'full', ev: 'internal' },
  { name: 'CI/CD', replaces: 'CircleCI / Actions', hanzo: 'hanzoai/ci · arc runners', k: 18, basis: 'e', cov: 'full', ev: 'internal' },
  { name: 'Container registry', replaces: 'ECR / Docker Hub', hanzo: 'registry (oci.hanzo.ai)', k: 4, basis: 'e', cov: 'full', ev: 'internal' },
  { name: 'PaaS / app hosting', replaces: 'Vercel / Heroku', hanzo: 'paas · deploy · functions', k: 13, basis: 'e', cov: 'full', ev: 'internal' },
  { name: 'App backend / BaaS', replaces: 'Supabase / Firebase', hanzo: 'base · docdb · orm', k: 15, basis: 'f', cov: 'full', ev: 'internal' },
  { name: 'Queues & streaming', replaces: 'Confluent / SQS', hanzo: 'pubsub (NATS) · kafka', k: 10, basis: 'f', cov: 'full', ev: 'repo' },
  { name: 'AI gateway & routing', replaces: 'Portkey / OpenRouter', hanzo: 'ai · zen · gateway', k: 12, basis: 'f', cov: 'full', ev: 'internal' },
  { name: 'Workflow automation', replaces: 'Zapier', hanzo: 'automations · connectorruntime · cron', k: 12, basis: 's', cov: 'full', ev: 'repo' },
  { name: 'Billing & metering', replaces: 'Chargebee / Metronome', hanzo: 'billing · usage · entitlements · pricing', k: 18, basis: 'f', cov: 'full', ev: 'internal' },
  { name: 'Commerce', replaces: 'Shopify Plus', hanzo: 'commerce · marketplace', k: 24, basis: 'f', cov: 'full', ev: 'repo' },
  { name: 'E-signature', replaces: 'DocuSign', hanzo: 'sign', k: 2, basis: 's', cov: 'full', ev: 'repo' },
  { name: 'Cap table', replaces: 'Carta', hanzo: 'captable', k: 5, basis: 'f', cov: 'full', ev: 'internal' },
  { name: 'Data rooms', replaces: 'DocSend / iDeals', hanzo: 'dataroom', k: 6, basis: 'f', cov: 'full', ev: 'repo' },
  { name: 'Referrals & affiliates', replaces: 'PartnerStack', hanzo: 'affiliates · referrals · link', k: 9, basis: 'f', cov: 'full', ev: 'repo' },
  { name: 'Experiments & evals', replaces: 'Statsig / Optimizely', hanzo: 'experiments · evals', k: 12, basis: 'f', cov: 'full', ev: 'repo' },
  { name: 'Zero-trust access', replaces: 'Tailscale / CF Access', hanzo: 'zero-trust · ingress', k: 7, basis: 's', cov: 'full', ev: 'internal' },
  { name: 'Search', replaces: 'Algolia / Elastic', hanzo: 'index · websearch', k: 12, basis: 'f', cov: 'full', ev: 'repo' },
  { name: 'Vector store', replaces: 'Pinecone', hanzo: 'knowledge', k: 8, basis: 'f', cov: 'partial', ev: 'gap' },
  { name: 'Compliance automation', replaces: 'Vanta / Drata', hanzo: 'compliance · audit · sbom · security', k: 18, basis: 'f', cov: 'full', ev: 'repo' },
  { name: 'CRM', replaces: 'Salesforce / HubSpot', hanzo: 'crm · company', k: 27, basis: 's', cov: 'full', ev: 'internal' },
  { name: 'Marketing automation', replaces: 'HubSpot Marketing', hanzo: 'marketing · campaign', k: 10, basis: 'f', cov: 'full', ev: 'repo' },
  { name: 'Projects & tasks', replaces: 'Linear / Asana', hanzo: 'projects · tasks', k: 14, basis: 's', cov: 'full', ev: 'internal' },
  { name: 'Knowledge & docs', replaces: 'Notion / Confluence', hanzo: 'knowledge · guide', k: 12, basis: 's', cov: 'full', ev: 'internal' },
  { name: 'Support & messaging', replaces: 'Intercom / Zendesk', hanzo: 'help · ask · channels · bots', k: 11, basis: 's', cov: 'full', ev: 'internal' },
  { name: 'Notifications & email', replaces: 'SendGrid / Customer.io', hanzo: 'notify', k: 7, basis: 'f', cov: 'full', ev: 'internal' },
  { name: 'Incident & status', replaces: 'PagerDuty / Statuspage', hanzo: 'o11y (incident · status)', k: 11, basis: 'e', cov: 'full', ev: 'internal' },
  { name: 'Finance ops & ledger', replaces: 'NetSuite add-ons', hanzo: 'books · treasury · ledger-fi', k: 6, basis: 'f', cov: 'full', ev: 'internal' },
  { name: 'Design & creative', replaces: 'Figma / Canva', hanzo: 'studio (studio.hanzo.ai)', k: 16, basis: 's', cov: 'full', ev: 'repo' },
  { name: 'Video, calls & calendar', replaces: 'Zoom / Calendly', hanzo: 'team (calls · calendar)', k: 18, basis: 's', cov: 'full', ev: 'internal' },
  { name: 'Office suite & drive', replaces: 'Google Workspace', hanzo: 'office · drive', k: 14, basis: 's', cov: 'full', ev: 'internal' },
  { name: 'HR & payroll', replaces: 'Gusto / Rippling', hanzo: 'hr · payroll', k: 48, basis: 's', cov: 'full', ev: 'internal' },
  { name: 'Payment orchestration', replaces: 'PSP markup over interchange+', hanzo: 'psp · x402 · wallets', k: 12, basis: 'f', cov: 'full', ev: 'repo' },
  { name: 'ERP / CMS / business apps', replaces: 'NetSuite / WordPress', hanzo: 'erp · base', k: 20, basis: 'f', cov: 'full', ev: 'internal' },
  { name: 'LLM inference & routing', replaces: 'OpenAI / Anthropic API', hanzo: 'enso (routing) · zen (self-hosted)', k: 36, basis: 'e', cov: 'full', ev: 'attested' },
];

export const AI_ROW = ROWS.length - 1;

/* One chip per vendor that shows up on a real bill, several per category: [name, index of the ROWS line it maps to].
   A category counts while any of its vendors is selected; the counter counts vendors, not categories. 107 chips, the
   same 107 dependencies the reference deployment consolidated. */
export const VENDORS = [
  ['Okta', 0], ['Auth0', 0], ['JumpCloud', 0], ['Clerk', 1], ['Firebase Auth', 1], ['Vault', 2], ['AWS KMS', 2],
  ['Doppler', 2], ['Datadog', 3], ['New Relic', 3], ['Grafana Cloud', 3], ['Splunk', 3], ['Sentry', 4], ['Rollbar', 4],
  ['LaunchDarkly', 5], ['Split', 5], ['Amplitude', 6], ['Mixpanel', 6], ['Heap', 6], ['Segment', 7], ['RudderStack', 7],
  ['GitHub', 8], ['GitLab', 8], ['Bitbucket', 8], ['CircleCI', 9], ['Buildkite', 9], ['Docker Hub', 10], ['JFrog', 10],
  ['Vercel', 11], ['Netlify', 11], ['Heroku', 11], ['Fly.io', 11], ['Supabase', 12], ['Firebase', 12], ['Confluent', 13],
  ['Redpanda', 13], ['Portkey', 14], ['OpenRouter', 14], ['Zapier', 15], ['Make', 15], ['n8n cloud', 15],
  ['Chargebee', 16], ['Metronome', 16], ['Stripe Billing', 16], ['Shopify', 17], ['BigCommerce', 17], ['DocuSign', 18],
  ['Dropbox Sign', 18], ['Carta', 19], ['Pulley', 19], ['DocSend', 20], ['iDeals', 20], ['PartnerStack', 21],
  ['Rewardful', 21], ['Statsig', 22], ['Optimizely', 22], ['Tailscale', 23], ['CF Access', 23], ['Algolia', 24],
  ['Elastic Cloud', 24], ['Pinecone', 25], ['Weaviate', 25], ['Vanta', 26], ['Drata', 26], ['Salesforce', 27],
  ['HubSpot CRM', 27], ['Pipedrive', 27], ['HubSpot Marketing', 28], ['Mailchimp', 28], ['Klaviyo', 28], ['Linear', 29],
  ['Asana', 29], ['Jira', 29], ['Monday', 29], ['Notion', 30], ['Confluence', 30], ['Zendesk', 31], ['Intercom', 31],
  ['Front', 31], ['SendGrid', 32], ['Twilio', 32], ['Customer.io', 32], ['PagerDuty', 33], ['Statuspage', 33],
  ['Opsgenie', 33], ['QuickBooks', 34], ['Bill.com', 34], ['Figma', 35], ['Canva', 35], ['Adobe CC', 35], ['Zoom', 36],
  ['Calendly', 36], ['Loom', 36], ['Google Workspace', 37], ['Microsoft 365', 37], ['Dropbox', 37], ['Gusto', 38],
  ['Rippling', 38], ['Deel', 38], ['Stripe', 39], ['Braintree', 39], ['NetSuite', 40], ['WordPress VIP', 40],
  ['Contentful', 40], ['OpenAI API', 41], ['Anthropic API', 41], ['Azure OpenAI', 41],
];

export const SEAMS = [
  'auth bridges', 'webhooks', 'data sync', 'billing reconciliation', 'entitlements', 'audit exports',
  'pipelines', 'vendor o11y', 'incident routing', 'schema transforms', 'secret rotation', 'API migrations',
  'identity lifecycle', 'model fallbacks', 'security reviews',
];

export const SECOND_ORDER = [
  'SSO price premiums', 'per-vendor security reviews', 'DPAs', 'procurement cycles', 'duplicate observability',
  'license reclamation', 'credential sprawl', 'integration attack surface', 'onboarding speed', 'unified policy',
  'common metering', 'model portability', 'lock-in exposure', 'air-gapped deployment', 'incident response speed',
  'fewer failure domains',
];

// $1.051M above a million, $941k below it; a negative figure leads with a true minus
export const money = (n) => {
  const a = Math.abs(n);
  const sign = n < 0 ? '\u2212' : '';
  if (a >= 1e6) return `${sign}$${(a / 1e6).toFixed(3).replace(/\.?0+$/, '')}M`;
  return `${sign}$${Math.round(a / 1e3).toLocaleString('en-US')}k`;
};
export const dollars = (n) => `${n < 0 ? '\u2212' : ''}$${Math.round(Math.abs(n)).toLocaleString('en-US')}`;

// the controls a visitor opens the page with: the analyst's reference deployment
export const DEFAULTS = { E: 100, Dp: 30, cloud: 15, infraPct: 60, glueFte: 1.5, opsFte: 0.5, retained: 0, fee: 0, migration: 0, migYears: 3 };

// The AI sub-calculator is off by default, so the headline stays the analyst's figure until a visitor prices their own bill.
export const AI_DEFAULTS = {
  spend: 10, // $k a month
  routable: 60, // % of addressable spend that can move to a cheaper model
  selfHost: 50, // % of routed spend that can run on Zen
  ensoSave: 55, // % saved by routing alone
  zenCost: 12, // Zen's cost as a % of the frontier price
  frontier: 25, // % that must stay frontier: pass-through, never counted
  overhead: 10, // eval and fallback overhead against the gross saving
  gpuUtil: 70, // % GPU utilization
  batch: 40, // % of self-hosted work that is batch
};

/* [key, label, min, max, step] of the sub-calculator's nine sliders, in the order the page shows them */
export const AI_CONTROLS = [
  ['spend', 'AI spend / month ($k)', 0, 500, 1],
  ['frontier', 'Must stay frontier (%)', 0, 100, 5],
  ['routable', 'Routable to cheaper models (%)', 0, 100, 5],
  ['selfHost', 'Of routed, self-hostable (%)', 0, 100, 5],
  ['ensoSave', 'Enso routing saving (%)', 0, 90, 5],
  ['zenCost', 'Zen cost vs frontier (%)', 1, 100, 1],
  ['gpuUtil', 'GPU utilization (%)', 10, 100, 5],
  ['batch', 'Batch vs interactive mix (%)', 0, 100, 5],
  ['overhead', 'Eval / fallback overhead (%)', 0, 50, 5],
];

// the eligible saving on the AI bill, a year: frontier pass-through is never counted
export const aiSaving = (ai) => {
  const annual = ai.spend * 1000 * 12;
  const passthrough = annual * (ai.frontier / 100);
  const addressable = annual - passthrough;
  const routed = addressable * (ai.routable / 100);
  const hosted = routed * (ai.selfHost / 100);
  const routedOnly = routed - hosted;
  // low utilization raises the effective self-hosted unit cost; batch work lowers it
  const zenRatio = (ai.zenCost / 100) * (70 / Math.max(ai.gpuUtil, 1)) * (1 - 0.25 * (ai.batch / 100));
  const gross = hosted * Math.max(1 - zenRatio, 0) + routedOnly * (ai.ensoSave / 100);
  return Math.max(gross * (1 - ai.overhead / 100), 0);
};

// the grade a coverage chip takes when clicked: full, partial, experimental, roadmap, and round again
export const nextCov = (c) => COV_CYCLE[(COV_CYCLE.indexOf(c) + 1) % COV_CYCLE.length];

export const initial = () => ({
  ...DEFAULTS,
  cov: ROWS.map((r) => r.cov),
  price: {}, // a visitor's own figures, $k a year, by row
  von: VENDORS.map(() => true),
  aiOn: false,
  ai: { ...AI_DEFAULTS },
});

/* The whole model. `s` is the page's state (initial() has every field): the six controls, the three deductions and
   their years, the coverage grade of each row, the prices a visitor typed over, the vendors selected, and the AI
   sub-calculator. Four tiers come out: gross, run-rate, fully adjusted and three-year value. */
export function model(s) {
  const D = Math.round((s.E * s.Dp) / 100);
  const saving = aiSaving(s.ai);
  const on = ROWS.map((_, i) => VENDORS.some(([, c], k) => c === i && s.von[k]));
  const value = ROWS.map((r, i) => {
    if (s.price[i] !== undefined) return s.price[i] * 1000;
    if (i === AI_ROW && s.aiOn) return saving;
    const factor = r.basis === 's' ? s.E / REF_E : r.basis === 'e' ? D / REF_D : 1;
    return r.k * 1000 * factor;
  });
  const software = value.reduce((sum, v, i) => (on[i] ? sum + v * WEIGHT[s.cov[i]] : sum), 0);
  const infra = s.cloud * 1000 * 12 * (s.infraPct / 100);
  const glue = s.glueFte * FTE;
  const ops = s.opsFte * FTE;
  const gross = software + infra + glue;
  const runRate = gross - ops;
  const amortized = s.migration > 0 ? s.migration / Math.max(s.migYears, 1) : 0;
  const adjusted = runRate - s.retained - s.fee - amortized;
  // default 0 means "not included until entered": the fully adjusted tier stays explicitly incomplete
  const hasDeductions = s.retained > 0 || s.fee > 0 || s.migration > 0;
  const vendorCount = s.von.filter(Boolean).length;
  return { D, saving, on, value, software, infra, glue, ops, gross, runRate, amortized, adjusted, hasDeductions, vendorCount };
}
