// The live sources behind the home page's race, cost and frontier figures: the same endpoints hanzo.ai's own home
// fetches when it opens (api.hanzo.ai research runs, models and pricing). scripts/live.mjs reads them at build time into
// content/live/_research.json and _models.json; components/home/useFigures.js reads them again at page load. Each reader
// returns exactly the shape of those files and throws if a source answers with something unexpected.
export const RUNS = 'https://api.hanzo.ai/v1/research/runs?org=hanzo';
export const MODELS = 'https://api.hanzo.ai/v1/models?id=anthropic/claude-fable-5.1,anthropic/claude-opus-5,anthropic/claude-sonnet-5.5,enso,enso-flash,enso-pro,enso-ultra,kai,openai/gpt-5.5,openai/gpt-6-astra,zen6,zen6-coder,zen6-flash';
export const PRICES = 'https://api.hanzo.ai/v1/pricing/models?id=anthropic/claude-fable-5,anthropic/claude-fable-5.1,anthropic/claude-haiku-5.5,anthropic/claude-opus-4.8,anthropic/claude-opus-5.5,anthropic/claude-sonnet-5,anthropic/claude-sonnet-5.5,deepseek/deepseek-v4-pro,openai/gpt-4o,openai/gpt-5.5,openai/gpt-5.6-sol,openai/gpt-6-sol,moonshotai/kimi-k3,x-ai/grok-4.7,z-ai/glm-5.3,enso,enso-flash,enso-ultra,kai';

const need = (ok, what) => { if (!ok) throw new Error('unexpected data: ' + what); };

export async function readResearch(get) {
  const one = async (q) => { const d = await get(`${RUNS}&${q}&view=summary&limit=200`); need(Array.isArray(d.data) && d.data.length > 0, q); return d.data; };
  const [repair, latency, gpqa] = await Promise.all([
    one('benchmark=coding.repair&category=all,vs-claude-code'),
    one('benchmark=decision.latency&metric=p50ms'),
    one('benchmark=enso.gpqa_diamond&category=all,vs-claude-code'),
  ]);
  return { repair, latency, gpqa };
}

export async function readModels(get) {
  const [m, p] = await Promise.all([get(MODELS), get(PRICES)]);
  need(Array.isArray(m.data) && m.data.some((x) => x.id === 'kai' && x.pricing?.input_per_million > 0), 'models with prices');
  need(Array.isArray(p.models) && p.models.length > 0, 'pricing models');
  return { models: m.data.map((x) => ({ id: x.id, name: x.name, pricing: x.pricing })), names: Object.fromEntries(p.models.map((x) => [x.id ?? x.name, x.fullName ?? x.name])) };
}
