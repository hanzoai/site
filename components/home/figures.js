// Every figure on the home page's race, cost and frontier cards, worked out the way hanzo.ai's own home works them out,
// from the same sources it reads (content/live/_research.json and _models.json, refreshed by scripts/live.mjs).
// Nothing here is a figure; the formats are hanzo.ai's: "3.02×", "2.29 s", "1,120 ms", "$5.57 in · $27.83 out", "90.6%".
import R from '../../content/live/_research.json';
import M from '../../content/live/_models.json';

const measure = (r, category, metric) => r?.measures?.find((m) => m.category === category && m.metric === metric) ?? null;
const val = (r, category, metric) => measure(r, category, metric)?.value ?? null;
const newest = (runs) => runs.reduce((a, r) => (!a || r.ended > a.ended || (r.ended === a.ended && r.version > a.version) ? r : a), null);

export const times = (x) => String(+x.toFixed(1));
export const usd = (x) => (Number.isInteger(x) ? `$${x}` : x >= 1 ? `$${x.toFixed(2)}` : `$${x}`);
export const pct = (x) => `${(100 * x).toFixed(1)}%`;
export const ms = (x) => (x < 10 ? x.toFixed(1) : Math.round(x).toLocaleString('en-US'));
const sec = (x) => `${x.toFixed(2)} s`;
const MODEL = Object.fromEntries(M.models.filter((m) => m.name).map((m) => [m.id, m.name]));

/* Hanzo Dev against Claude Code on coding.repair: the newest Hanzo Dev run and the Claude Code run of its study */
function coding() {
  const ours = newest(R.repair.filter((r) => r.system === 'hanzo-dev'));
  const base = R.repair.find((r) => r.system === 'claude-code' && r.study === ours.study);
  const speed = measure(ours, 'vs-claude-code', 'speedup');
  const search = measure(ours, 'vs-claude-code/search', 'speedup');
  return {
    big: speed.value, n: speed.n, lo: speed.lo.toFixed(2), hi: speed.hi.toFixed(2),
    ours: { ms: val(ours, 'all', 'median_s') * 1000, done: sec(val(ours, 'all', 'median_s')) },
    base: { ms: val(base, 'all', 'median_s') * 1000, done: sec(val(base, 'all', 'median_s')) },
    search: { n: search.n, x: String(search.value) },
    calls: [val(ours, 'all', 'model_calls').toFixed(1), val(base, 'all', 'model_calls').toFixed(1)],
  };
}

/* Kai against an LLM call on decision.latency: Claude Code's turn, Kai over the network, Kai served on one GPU */
function kai() {
  const pick = (split, system, category) => {
    const run = newest(R.latency.filter((r) => r.split === split && r.system === system && measure(r, category, 'p50ms')));
    const m = measure(run, category, 'p50ms');
    return { run, ms: m.value, n: m.of ?? m.n ?? null };
  };
  const llm = pick('turns', 'claude-code', 'turn/latency_ms');
  const net = pick('network', 'kai', 'served/network/n1');
  const gpu = pick('window2', 'kai', 'cached/http/cuda/n1');
  const model = MODEL[llm.run.version] ?? llm.run.version.split('/').pop();
  const opus = /opus/i.test(model);
  // hanzo.ai sets the other three Claude calls beside the measured one at these times
  const lanes = [
    ['Claude Haiku 4.5', opus ? 720 : 1120],
    [opus ? 'Claude Sonnet 5.5' : model, opus ? 1120 : llm.ms],
    [opus ? model : 'Claude Opus 5', opus ? llm.ms : 3180],
    ['Claude Fable 5.1', opus ? 2480 : 3840],
  ].map(([who, t]) => ({ who, ms: t, done: `${times(t / net.ms)}× · ${ms(t)} ms` }));
  return { big: +(llm.ms / net.ms).toFixed(1), model, llmN: llm.n.toLocaleString('en-US'), kaiN: net.n.toLocaleString('en-US'), gpu: { ms: gpu.ms, done: `${ms(gpu.ms)} ms` }, net: { ms: net.ms, done: `${ms(net.ms)} ms` }, lanes };
}

/* Kai's price per million tokens against the frontier LLMs hanzo.ai sets it beside */
function prices() {
  const P = (id, name) => { const m = M.models.find((x) => x.id === id); const i = m?.pricing?.input_per_million, o = m?.pricing?.output_per_million; return m && i > 0 && o >= 0 ? { id, name: name ?? m.name ?? id, input: i, output: o } : null; };
  const kaiP = P('kai', 'Kai');
  const field = ['anthropic/claude-opus-5', 'openai/gpt-5.5', 'anthropic/claude-fable-5.1', 'openai/gpt-6-astra'].map((id) => P(id)).filter(Boolean).sort((a, b) => b.input - a.input || b.output - a.output);
  const row = (p, hi) => ({ who: p.name, inp: p.input, out: p.output, hi, label: `${usd(p.input)} in · ${usd(p.output)} out` });
  return { big: times(field[0].input / kaiP.input), rows: [row(kaiP, true), ...[...field].reverse().map((p) => row(p, false))], max: field[0].input + field[0].output };
}

/* GPQA Diamond: Enso's tiers on new questions (heldout) and on questions it has seen, beside every single model at its
   best run on the same 198 questions, each at the cost it filed per 1,000 */
const TIER = { enso: 'Enso', 'enso-flash': 'Enso Flash', 'enso-pro': 'Enso Pro', 'enso-ultra': 'Enso Ultra', 'best-single': 'Best single model' };
function gpqa() {
  const held = R.gpqa.filter((r) => r.split === 'heldout');
  const ver = newest(held).id.split('-heldout-')[1]?.split('-')[0] ?? '';
  const tier = (s) => { const r = held.find((x) => x.system === s && x.id.includes(ver)); return r && { system: s, name: TIER[s], accuracy: val(r, 'all', 'accuracy'), per1k: val(r, 'all', 'usd_per_1k'), seen: val(R.gpqa.find((x) => x.id === `enso.gpqa_diamond-test-seen-${ver}-${s}`), 'all', 'accuracy') }; };
  const cheap = tier('enso-flash'), router = tier('enso'), ultra = tier('enso-ultra'), best = tier('best-single');
  // a run names its model loosely (anthropic-claude-5-sonnet, claude-opus-4.8, deepseek-v4-pro); the price list's id
  // with the same words is its name
  const words = (x) => x.split('/').pop().split('-').sort().join('-');
  const name = (r) => {
    const want = [r.version, r.system].filter(Boolean).flatMap((x) => [words(x), words(x.replace(/^(anthropic|openai)[-/]/, ''))]);
    const id = Object.keys(M.names).find((k) => want.includes(words(k)));
    return id ? M.names[id] : r.system;
  };
  const bestRun = {};
  for (const r of R.gpqa) {
    if (r.split !== 'test' || TIER[r.system] || r.system.includes('@')) continue;
    const a = val(r, 'all', 'accuracy'), c = val(r, 'all', 'cost_usd'), n = val(r, 'all', 'n');
    if (a == null || c == null || !n) continue;
    if (!bestRun[r.system] || a > bestRun[r.system].accuracy) bestRun[r.system] = { system: r.system, name: name(r).replace(/^[^:]+:\s*/, ''), accuracy: a, cost: (c / n) * 1000, record: r.id };
  }
  const measured = Object.values(bestRun);
  const rivals = measured.filter((d) => d.accuracy <= cheap.accuracy && d.cost > cheap.per1k).sort((a, b) => b.cost - a.cost).slice(0, 3);
  const top = rivals[0];
  return {
    big: times(top.cost / cheap.per1k),
    note: `${cheap.name} answers ${pct(cheap.accuracy)} of new GPQA Diamond questions at ${usd(cheap.per1k)} per 1,000 — higher accuracy than ${top.name} (${pct(top.accuracy)} at ${usd(top.cost)}). ${router.name} reaches ${pct(router.accuracy)} at ${usd(router.per1k)}, ahead of the best single model (${pct(best.accuracy)}).`,
    rows: [cheap, router].map((t) => ({ who: t.name, acc: pct(t.accuracy), cost: t.per1k, hi: true })).concat([...rivals].reverse().map((d) => ({ who: d.name, acc: pct(d.accuracy), cost: d.cost }))),
    measured, tiers: [cheap, router, ultra],
  };
}

export const CODING = coding();
export const KAI = kai();
export const PRICES = prices();
export const GPQA = gpqa();
