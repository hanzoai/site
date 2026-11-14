// The live sources behind the home page's race, cost and frontier figures and /pricing's live plan & model catalog:
// commerce.hanzo.ai serves plans (/v1/billing/plans) and per-token model pricing (/v1/models and /v1/pricing/models);
// api.hanzo.ai serves research benchmark runs. scripts/live.ts reads them at build time into content/live/_*.json, and
// client hooks read commerce.hanzo.ai again at page load so admin.hanzo.ai edits appear live without a rebuild.
export const COMMERCE = 'https://commerce.hanzo.ai';
export const PLANS_URL = `${COMMERCE}/v1/billing/plans`;
export const RUNS = 'https://api.hanzo.ai/v1/research/runs?org=hanzo';
export const MODELS = `${COMMERCE}/v1/models?id=anthropic/claude-fable-5.1,anthropic/claude-opus-5,anthropic/claude-sonnet-5.5,enso-auto,enso-flash,enso-max,enso-pro,enso-ultra,kai,openai/gpt-5.5,openai/gpt-6-astra,zen6,zen6-coder,zen6-flash,zen6-max,zen-embedding,zen-embedding-3`;
export const PRICES = `${COMMERCE}/v1/pricing/models?id=anthropic/claude-fable-5,anthropic/claude-fable-5.1,anthropic/claude-haiku-5.5,anthropic/claude-opus-4.8,anthropic/claude-opus-5.5,anthropic/claude-sonnet-5,anthropic/claude-sonnet-5.5,deepseek/deepseek-v4-pro,openai/gpt-4o,openai/gpt-5.5,openai/gpt-5.6-sol,openai/gpt-6-sol,moonshotai/kimi-k3,x-ai/grok-4.7,z-ai/glm-5.3,enso-auto,enso-flash,enso-pro,enso-max,enso-ultra,kai,zen6-flash,zen6,zen6-coder,zen6-max,zen-embedding,zen-embedding-3,zen5,zen5-coder,zen5-mini,zen5-pro,zen-vl,zen-guard`;

/** A plan as GET /v1/billing/plans lists it (prices in cents). */
export interface Listed {
  slug: string;
  name: string;
  category: string;
  description?: string;
  price: number;
  priceAnnual?: number | null;
  interval: string;
  perSeat?: boolean;
  popular?: boolean;
  features?: string[];
  licensing?: { products?: string[]; earlyAccess?: boolean };
  limits?: { minSeats?: number; maxMembers?: number; bots?: number; teamGuests?: number };
}

/** One figure a benchmark run filed. */
export interface Measure { category: string; metric: string; value: number; n?: number; of?: number | null; lo?: number; hi?: number }
/** A benchmark run as GET /v1/research/runs lists it (view=summary). */
export interface Run { id: string; system: string; version: string; study?: string; split?: string; ended: string; measures?: Measure[] }
/** A model as GET /v1/models lists it. */
interface Served {
  id: string;
  name?: string;
  description?: string;
  family?: string;
  context_window?: number;
  endpoint?: string;
  pricing?: { input_per_million?: number; output_per_million?: number; rates?: { input_cache_write?: string; input_cache_read?: string } };
}
/** A model as GET /v1/pricing/models lists it. */
interface Priced {
  id?: string;
  name: string;
  fullName?: string;
  description?: string;
  family?: string;
  order?: unknown;
  context?: unknown;
  endpoint?: string;
  features?: string[];
  specs?: { params?: string; arch?: string };
  pricing?: { input?: number | null; output?: number | null; cacheWrite?: number | null; cacheRead?: number | null };
}
/** A model as the page keeps it: what /v1/models says, with the blanks filled. */
export interface Model {
  id: string;
  name?: string;
  description: string;
  family: string;
  context_window: number | null;
  endpoint: string | null;
  pricing?: Served['pricing'];
}
/** A model as the price list keeps it. */
export interface Catalog {
  id: string;
  fullName: string;
  description: string;
  family: string;
  order: number | null;
  context: number | null;
  endpoint: string | null;
  features: string[];
  specs: Priced['specs'] | null;
  pricing: Priced['pricing'] | null;
}
/** What readModels answers (content/live/_models.json). */
export interface Models { models: Model[]; catalog: Catalog[]; names: Record<string, string> }
/** What readResearch answers: the runs behind the home's race, cost and frontier cards. */
export interface Research { repair: Run[]; latency: Run[]; gpqa: Run[] }
/** A GET that answers parsed JSON: the page's `fetch`, or the build's. What it answers is checked by `need` before it is read. */
export type Get = <T>(url: string) => Promise<T>;

function need(ok: boolean, what: string): asserts ok { if (!ok) throw new Error('unexpected data: ' + what); }

export function shapePlan(p: Listed) {
  return {
    name: p.name,
    category: p.category,
    description: p.description ?? '',
    price: p.price / 100,
    priceAnnual: p.priceAnnual == null ? null : p.priceAnnual / 100,
    interval: p.interval,
    perSeat: !!p.perSeat,
    popular: !!p.popular,
    features: Array.isArray(p.features) ? p.features : [],
    products: Array.isArray(p.licensing?.products) ? p.licensing.products : [],
    earlyAccess: !!p.licensing?.earlyAccess,
    minSeats: p.limits?.minSeats ?? null,
    maxMembers: p.limits?.maxMembers ?? null,
    bots: p.limits?.bots ?? 0,
    teamGuests: p.limits?.teamGuests ?? 0,
  };
}

export async function readResearch(get: Get): Promise<Research> {
  const one = async (q: string) => { const d = await get<{ data: Run[] }>(`${RUNS}&${q}&view=summary&limit=200`); need(Array.isArray(d.data) && d.data.length > 0, q); return d.data; };
  const [repair, latency, gpqa] = await Promise.all([
    one('benchmark=coding.repair&category=all,vs-claude-code'),
    one('benchmark=decision.latency&metric=p50ms'),
    one('benchmark=enso.gpqa_diamond&category=all,vs-claude-code'),
  ]);
  return { repair, latency, gpqa };
}

export async function readModels(get: Get): Promise<Models> {
  const [m, p] = await Promise.all([get<{ data: Served[] }>(MODELS), get<{ models: Priced[] }>(PRICES)]);
  need(Array.isArray(m.data) && m.data.some((x) => x.id === 'kai' && (x.pricing?.input_per_million ?? 0) > 0), 'models with prices');
  need(Array.isArray(p.models) && p.models.length > 0, 'pricing models');
  return {
    models: m.data.map((x) => ({
      id: x.id,
      name: x.name,
      description: x.description ?? '',
      family: x.family ?? '',
      context_window: x.context_window ?? null,
      endpoint: x.endpoint ?? null,
      pricing: x.pricing,
    })),
    catalog: p.models.map((x) => ({
      id: x.id ?? x.name,
      fullName: x.fullName ?? x.name,
      description: x.description ?? '',
      family: x.family ?? '',
      order: typeof x.order === 'number' ? x.order : null,
      context: typeof x.context === 'number' ? x.context : null,
      endpoint: x.endpoint ?? null,
      features: Array.isArray(x.features) ? x.features : [],
      specs: x.specs ?? null,
      pricing: x.pricing ?? null,
    })),
    names: Object.fromEntries(p.models.map((x) => [x.id ?? x.name, x.fullName ?? x.name])),
  };
}

/** A plan as the site holds it (shapePlan's answer, and content/live/_pricing.json). */
export type Plan = ReturnType<typeof shapePlan>;
