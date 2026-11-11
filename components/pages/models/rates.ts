/* Hanzo's price list as /models prints it (api.hanzo.ai's catalogue, captured with the site): id, name, in $/M,
   out $/M, context. /models draws its cards and table from it; every model page falls back to it when its own page
   printed no rate and the gateway is out of reach, so the same model shows the same figure in card, table and page
   (PLAN-COMPONENTS 2.15). Browsers refresh it from api.hanzo.ai when the gateway answers. */
// id, name, in $/M, out $/M, context. Hanzo's catalogue as api.hanzo.ai lists it; refreshed in the browser when the gateway answers.
export const ROWS = [
  ['enso-auto', 'Enso Auto', 0.33, 1.65, 900000], ['enso-flash', 'Enso Flash', 0.33, 1.65, 900000],
  ['enso-pro', 'Enso Pro', 3.3, 16.5, 1000000], ['enso-max', 'Enso Max', 4.3, 21.5, 1000000], ['enso-ultra', 'Enso Ultra', 5.236, 26.18, 1000000],
  ['zen6', 'Zen6', 0.6, 2.4, 1048576], ['zen6-flash', 'Zen6 Flash', 0.6, 2.4, 1048576], ['zen6-coder', 'Zen6 Coder', 1.65, 13, 1048576],
  ['zen6-free', 'Zen6 Free', 0, 0, 1000000], ['zen6-max', 'Zen6 Max', 28, 168, 1048576],
  ['zen5', 'Zen5', 0, 0, 1000000], ['zen5-pro', 'Zen5 Pro', 0, 0, 1000000], ['zen5-coder', 'Zen5 Coder', 0, 0, 1000000], ['zen5-flash', 'Zen5 Flash', 0, 0, 1000000],
  ['zen5-evo', 'Zen5 Evo', 0, 0, 1000000], ['zen5-mini', 'Zen5 Mini', 0, 0, 1000000], ['zen5-spark', 'Zen5 Spark', 0, 0, 1000000],
  ['zen-vl', 'Zen VL — Vision-Language', 0, 0, 1000000], ['zen-embedding', 'Zen Embedding', 0.01, 0.01, 32768], ['zen-embedding-3', 'Zen Embedding 3', 0.17, 0.17, 32768],
  ['zen-free', 'Zen Free', 0, 0, 1000000], ['zen-guard', 'Zen Guard — Content Safety', 0, 0, 128000], ['zen-scribe', 'Zen Scribe', null, null, null], ['zen-voice-mini', 'Zen Voice Mini', null, null, null],
  ['kai', 'Kai', 0.021, 0, 32768], ['hanzo/zen', 'Zen', 0, 0, 1000000],
];
export const OTHERS = [
  ['anthropic/claude-fable-5', 'Claude Fable 5', 11.13025, 55.65125, 1000000], ['openai/gpt-3.5-turbo-0613', 'GPT-3.5 Turbo (older v0613)', 1.113025, 2.22605, 4095],
  ['google/gemini-2.5-pro', 'Gemini 2.5 Pro', 1.39128125, 11.13025, 1048576], ['deepseek/deepseek-chat', 'DeepSeek V3', 0.356168, 0.99059225, 163840],
  ['x-ai/grok-4.20', 'Grok 4.20', 1.39128125, 2.7825625, 2000000], ['meta/muse-glimmer-30b', 'Muse Glimmer 30B', 0.3339075, 1.33563, 131072], ['cohere/command-a', 'Command A', 2.7825625, 11.13025, 256000],
];

export const SNAP = Object.fromEntries([...ROWS, ...OTHERS].filter((r) => r[2] != null).map((r) => [r[0], { in: r[2], out: r[3] }]));
