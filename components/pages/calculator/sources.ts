// The live sources behind the token calculator ("Your AI bill three ways, read from the price list"): the endpoints
// hanzo.ai's own page reads when it opens. Each reader takes a `get(url)` that answers the parsed JSON, the way
// lib/liveSources.mjs's readers do, returns the small shape the page draws, and throws on an answer that is not the
// document it asked for. components/pages/calculator/use.js reads them in the browser, when the page opens; none is in
// scripts/live.mjs yet, so none has a build snapshot. (The Team seat is the plan list's, which the build already holds:
// content/live/_pricing.json. /v1/billing/plans answers browsers of hanzo.ai only, so it is read at build, as
// lib/plans.js reads it, and not again here.)
export const PRICING = 'https://api.hanzo.ai/v1/pricing'; // the price list: other labs' rates, ours, on-demand GPUs
export const SUMMARY = 'https://api.hanzo.ai/v1/pricing/summary'; // the price list's own count of models
export const SERVED = 'https://api.hanzo.ai/v1/models'; // what the gateway bills a model at

const need = (ok, what) => { if (!ok) throw new Error('unexpected data: ' + what); };
const list = (v) => (Array.isArray(v) ? v : null);
const object = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? v : null);

// the price list: one with no rate card or no models is not one, and drawing it would empty the page
export async function readPricing(get) {
  const d = object(await get(PRICING));
  const card = object(d?.tariff);
  need(card && list(card.rates)?.length && list(card.components) && list(card.windows), 'price list rate card');
  need(list(d.hanzoModels) && list(d.thirdPartyModels) && object(d.summary), 'price list models');
  return { updated: typeof d.updated === 'string' ? d.updated : null, hanzoModels: d.hanzoModels, thirdPartyModels: d.thirdPartyModels, gpu: list(d.infrastructure?.gpu) ?? [] };
}

export async function readSummary(get) {
  const d = object(await get(SUMMARY));
  need(d && typeof d.totalModels === 'number', 'price list summary');
  return { totalModels: d.totalModels };
}

// the models the gateway answers for, with the per-million rate it bills each at
export async function readServed(get) {
  const d = object(await get(SERVED));
  const rows = list(d?.data);
  need(rows?.length && rows.every((r) => typeof object(r)?.id === 'string'), 'model list');
  return rows.map((r) => ({ id: r.id, pricing: { input_per_million: r.pricing?.input_per_million ?? null, output_per_million: r.pricing?.output_per_million ?? null } }));
}
