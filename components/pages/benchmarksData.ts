/* Every figure on /benchmarks, as Hanzo publishes it (hanzo.ai/benchmarks and its research API, api.hanzo.ai/v1/research/runs).
   Display strings are Hanzo's exact strings; raw numbers ride beside them for sorting and drawing. */

const RUN = 'https://api.hanzo.ai/v1/research/runs?org=hanzo&id=';
export const runUrl = (id: string) => RUN + id;

/* GPQA Diamond, 198 questions: accuracy against $ per 1,000 questions. kind: router | single | reported */
type GpqaRow = [name: string, acc: number, cost: number, kind: string, aria: string, src?: string];
export const GPQA = ([
  ['DeepSeek V4 Pro', 76.3, 1.05, 'single', 'DeepSeek V4 Pro 0423 76.3%, a single model tested on the same 198 GPQA Diamond questions, $1.05 per 1,000 of them'],
  ['Sonnet 5', 77.8, 42.91, 'single', 'Claude Sonnet 5 77.8%, a single model tested on the same 198 GPQA Diamond questions, $42.91 per 1,000 of them'],
  ['Fable 5', 82.8, 14.95, 'single', 'Claude Fable 5 82.8%, a single model tested on the same 198 GPQA Diamond questions, $14.95 per 1,000 of them'],
  ['Haiku 5.5', 83.3, 1.07, 'single', 'Claude Haiku 5.5 83.3%, a single model tested on the same 198 GPQA Diamond questions, $1.07 per 1,000 of them'],
  ['Opus 4.8', 87.4, 45.01, 'single', 'Claude Opus 4.8 87.4%, a single model tested on the same 198 GPQA Diamond questions, $45.01 per 1,000 of them'],
  ['Fable 5.1', 87.9, 46.25, 'single', 'Claude Fable 5.1 87.9%, a single model tested on the same 198 GPQA Diamond questions, $46.25 per 1,000 of them'],
  ['Sonnet 5.5', 90.4, 10.41, 'single', 'Claude Sonnet 5.5 90.4%, a single model tested on the same 198 GPQA Diamond questions, $10.41 per 1,000 of them'],
  ['GPT-5.5', 90.4, 18.64, 'single', 'GPT-5.5 90.4%, a single model tested on the same 198 GPQA Diamond questions, $18.64 per 1,000 of them'],
  ['GLM 5.3', 90.9, 0.945, 'reported', 'GLM 5.3 90.9% on GPQA Diamond, reported by Epoch AI (independent), 2026-08-14; $0.945 per 1,000 questions estimated from its list price. https://epoch.ai/models/glm-5-3', 'https://epoch.ai/models/glm-5-3'],
  ['Opus 5.5', 90.9, 21.23, 'single', 'Claude Opus 5.5 90.9%, a single model tested on the same 198 GPQA Diamond questions, $21.23 per 1,000 of them'],
  ['GPT-5.6 Sol', 91.9, 10.08, 'single', 'GPT-5.6 Sol 91.9%, a single model tested on the same 198 GPQA Diamond questions, $10.08 per 1,000 of them'],
  ['Grok 4.7', 92.7, 4.57, 'reported', 'Grok 4.7 92.7% on GPQA Diamond, reported by Epoch AI (independent), 2026-09-21; $4.57 per 1,000 questions estimated from its list price. https://epoch.ai/models/grok-4-7', 'https://epoch.ai/models/grok-4-7'],
  ['Kimi K3', 93.5, 10.61, 'reported', 'Kimi K3 93.5% on GPQA Diamond, reported by Moonshot AI (lab), 2026-07-16; $10.61 per 1,000 questions estimated from its list price. https://github.com/MoonshotAI/Kimi-K3', 'https://github.com/MoonshotAI/Kimi-K3'],
  ['GPT-6 Sol', 94.3, 5.09, 'reported', 'GPT-6 Sol 94.3% on GPQA Diamond, reported by Epoch AI (independent), 2026-09-22; $5.09 per 1,000 questions estimated from its list price. https://epoch.ai/models/gpt-6-sol', 'https://epoch.ai/models/gpt-6-sol'],
  ['Enso Flash', 95.5, 3.26, 'router', 'Enso Flash at $3.26 per 1,000, its cost on new questions: 95.5% · questions it has seen'],
  ['Enso', 96.5, 10.03, 'router', 'Enso at $10.03 per 1,000, its cost on new questions: 96.5% · questions it has seen'],
  ['Enso Ultra', 98.0, 14.76, 'router', 'Enso Ultra at $14.76 per 1,000, its cost on new questions: 98.0% · questions it has seen'],
] satisfies GpqaRow[]).map(([name, acc, cost, kind, aria, src]) => ({ name, acc, cost, kind, aria, src }));

/* The 12 runs of the frontier board: [system, accuracy, cost $, tag, date, pareto] */
type RunRow = [sys: string, acc: string, cost: string, tag: string, date: string, pareto: boolean];
export const RUNS = ([
  ['enso', '92.9%', '$5.58', 'frontier', '2026-07-19', true],
  ['gpt-5.6-sol', '91.9%', '$4.08', 'frontier', '2026-07-19', true],
  ['opus-5.5', '90.9%', '$3.78', 'fill', '2026-10-16', true],
  ['sonnet-5.5', '90.4%', '$1.85', 'fill', '2026-10-16', true],
  ['gpt-5.5', '89.9%', '$11.95', 'frontier', '2026-07-19', false],
  ['fable-5.1', '87.9%', '$8.23', 'fill', '2026-10-16', false],
  ['opus-4.8', '86.4%', '$3.66', 'frontier', '2026-07-19', false],
  ['haiku-5.5', '83.3%', '$0.19', 'fill', '2026-10-16', true],
  ['fable-5', '82.8%', '$9.87', 'frontier', '2026-07-19', false],
  ['claude-5-sonnet', '77.8%', '$5.66', 'frontier', '2026-07-19', false],
  ['deepseek-v4-pro', '74.2%', '$0.203', 'frontier', '2026-07-19', false],
  ['gpt-4o', '54.5%', '$1.58', 'frontier', '2026-07-19', false],
] satisfies RunRow[]).map(([sys, acc, cost, tag, date, pareto]) => ({ sys, acc, cost, tag, date, pareto, a: parseFloat(acc), c: parseFloat(cost.slice(1)) }));

/* Every system on GPQA Diamond: [system, correct, run cost, tag, date] — accuracy is correct / 198 */
type SystemRow = [sys: string, n: number, cost: string, tag: string, date: string];
export const SYSTEMS = ([
  ['enso', 184, '$5.58', 'frontier', '2026-07-19'],
  ['enso-ultra', 184, '$20.20', 'frontier', '2026-07-19'],
  ['gpt-5.6-sol', 182, '$4.08', 'frontier', '2026-07-19'],
  ['opus-5.5', 180, '$3.78', 'fill', '2026-10-16'],
  ['sonnet-5.5', 179, '$1.85', 'fill', '2026-10-16'],
  ['gpt-5.5', 178, '$11.95', 'frontier', '2026-07-19'],
  ['fable-5.1', 174, '$8.23', 'fill', '2026-10-16'],
  ['opus-4.8', 171, '$3.66', 'frontier', '2026-07-19'],
  ['haiku-5.5', 165, '$0.190', 'fill', '2026-10-16'],
  ['fable-5', 164, '$9.87', 'frontier', '2026-07-19'],
  ['claude-5-sonnet', 154, '$5.66', 'frontier', '2026-07-19'],
  ['deepseek-v4-pro', 147, '$0.203', 'frontier', '2026-07-19'],
  ['gpt-4o', 108, '$1.58', 'frontier', '2026-07-19'],
] satisfies SystemRow[]).map(([sys, n, cost, tag, date]) => ({ sys, n, cost, tag, date, acc: ((n / 198) * 100).toFixed(1) + '%', c: parseFloat(cost.slice(1)), run: runUrl(`enso.gpqa_diamond-test-${tag}-${sys}`) }));

const HF = 'https://huggingface.co/datasets/';
const TREE = 'https://github.com/hanzoai/benchmarks/tree/main/decision';
const H = (s: string) => [`${s}-harness-kai-1.4.c1856a77-kai`, `${s}-harness-20260917-jev`];

/* The Decision Suite, 16 tasks: name, data (links or a line), note, kai, jev, [kai run, jev run], re-run, bar values 0..1 */
export const SUITE = [
  { t: 'AG News', data: [['fancyzhx/ag_news', HF + 'fancyzhx/ag_news']], kai: '93.8%', jev: '86.0%', runs: H('jev.ag_news'), re: TREE },
  { t: 'DAIR Emotion', data: [['dair-ai/emotion', HF + 'dair-ai/emotion']], kai: '92.3%', jev: '60.3%', runs: H('jev.emotion'), re: TREE },
  { t: 'Banking77', data: [['mteb/banking77', HF + 'mteb/banking77']], kai: '88.0%', jev: '83.5%', runs: H('jev.banking77_full'), re: TREE },
  { t: 'Support triage', data: [['Tobi-Bueck/customer-support-tickets', HF + 'Tobi-Bueck/customer-support-tickets']], kai: '46.3%', jev: '36.5%', runs: H('app.support_triage'), re: TREE },
  { t: 'Email spam', data: [['SetFit/enron_spam', HF + 'SetFit/enron_spam']], kai: '98.5%', jev: '97.8%', runs: H('app.email_spam'), re: TREE },
  { t: 'Phishing', data: [['zefang-liu/phishing-email-dataset', HF + 'zefang-liu/phishing-email-dataset']], kai: '98.8%', jev: '90.0%', runs: H('app.phishing'), re: TREE },
  { t: 'Toxicity', data: [['lmsys/toxic-chat', HF + 'lmsys/toxic-chat']], kai: '81.0%', jev: '66.3%', runs: H('app.moderation_toxicity'), re: TREE },
  { t: 'RAG relevance', data: [['microsoft/ms_marco', HF + 'microsoft/ms_marco']], kai: '65.3%', jev: '62.0%', runs: H('app.rag_relevance'), re: TREE },
  { t: 'Model routing', data: [['openai/gsm8k', HF + 'openai/gsm8k'], ['google-research-datasets/mbpp', HF + 'google-research-datasets/mbpp']], kai: '99.8%', jev: '97.7%', runs: H('app.model_routing_domain'), re: TREE },
  { t: 'Typed decisions', data: [['LocalLLaMA/typed-decisions', HF + 'LocalLLaMA/typed-decisions']], kai: '74.6%', jev: '73.6%', runs: H('typed_decisions'), re: TREE },
  { t: 'MASSIVE, 51 languages, macro', data: [['mteb/amazon_massive_intent', HF + 'mteb/amazon_massive_intent']], kai: '90.7%', jev: '89.0%', runs: H('massive'), re: TREE },
  { t: 'Choice among 16 options', line: 'Its test cases, the gold intent and its fifteen nearest as the options.', kai: '92.0%', jev: '85.3%', runs: ['cap.cardinality-cases-kai-1.4.c1856a77-kai', 'cap.cardinality-cases-jev-1.13-jev'], re: TREE + '/capability' },
  { t: 'Choice among 77 options', line: 'Its test cases, every intent an option.', kai: '88.0%', jev: '84.3%', runs: ['cap.cardinality-cases-kai-1.4.c1856a77-kai', 'cap.cardinality-cases-jev-1.13-jev'], re: TREE + '/capability' },
  { t: 'Same request three times, identical answers', line: 'support, cancellation and severity requests the suite generates', note: 'Identical: Kai 4,200 of 4,200, Jev 1,858 of 4,200.', kai: '100.0%', jev: '44.2%', runs: ['decision.stability-all-hijack-kai-1.4', 'decision.stability-all-hijack-jev-1.13'], re: TREE + '/stability' },
  { t: 'False alarms on real benign prompts (in the wild), lower is better', low: true, data: [['TrustAIRLab/in-the-wild-jailbreak-prompts', HF + 'TrustAIRLab/in-the-wild-jailbreak-prompts']], note: 'Its regular prompts, each asked whether it is an attack. Flagged: Kai 83 of 600, Jev 126 of 600.', kai: '13.8%', jev: '21.0%', runs: ['jailbreak.wild-clean-h-kai-1.4', 'jailbreak.wild-clean-h-jev-1.13'], re: TREE + '/jailbreak-suite' },
  { t: 'Cost & deployment, per million input tokens', cost: true, note: 'Kai: $0.021 / M input tokens on api.hanzo.ai; on your own hardware (Enterprise): a cached decision in process in 0.3 ms (GPU) to 2 ms (CPU) — over 50× faster than a hosted call\'s 133 ms; a cold decision in 23–70 ms (2–6×). Jev: $0.042 / M; hosted API only, p50 133 ms per call.', kai: '$0.021 / M', jev: '$0.042 / M', bars: [0.5, 1] },
].map((r) => ({ ...r, bars: r.bars || [parseFloat(r.kai) / 100, parseFloat(r.jev) / 100] }));

export const COST_LINKS = [
  ['the model list', 'https://api.hanzo.ai/v1/models'],
  ['Enterprise', '/enterprise'],
  ['GPU timing', RUN + 'decision.latency-window2-dgx.cuda.f32.q8.tall-kai'],
  ['CPU timing', RUN + 'decision.latency-window2-evo.cpu.f32.q8.t8-kai'],
  ['Jev timing', RUN + 'decision.latency-network-n1-jev-1.13'],
];

/* Kai against Jev, suite by suite: accuracy (Hanzo's strings and lead) and calibration error (ECE, from the same runs) */
type BoardRow = [t: string, kai: string, jev: string, lead: string, ke: number, je: number];
export const BOARD = ([
  ['AG News', '93.8%', '86.0%', '+7.8 pp', 0.0221, 0.1023],
  ['DAIR Emotion', '92.3%', '60.3%', '+32.0 pp', 0.033, 0.2795],
  ['Banking77', '88.0%', '83.5%', '+4.5 pp', 0.0936, 0.0729],
  ['Support triage', '46.3%', '36.5%', '+9.8 pp', 0.3492, 0.4827],
  ['Email spam', '98.5%', '97.8%', '+0.7 pp', 0.0158, 0.0604],
  ['Phishing', '98.8%', '90.0%', '+8.8 pp', 0.0107, 0.0388],
  ['Toxicity', '81.0%', '66.3%', '+14.8 pp', 0.1695, 0.1768],
  ['RAG relevance', '65.3%', '62.0%', '+3.2 pp', 0.0888, 0.2788],
  ['Model routing', '99.8%', '97.7%', '+2.0 pp', 0.0023, 0.0138],
  ['Typed decisions', '74.6%', '73.6%', '+1.0 pp', 0.1398, 0.0472],
  ['MASSIVE, 51 languages', '90.7%', '89.0%', '+1.7 pp', 0.0635, 0.0638],
] satisfies BoardRow[]).map(([t, kai, jev, lead, ke, je]) => ({ t, kai, jev, lead, ke, je, k: parseFloat(kai), j: parseFloat(jev), l: parseFloat(lead) }));

export const YESNO = [
  ['A question and its paraphrase, mean |Δp| over 20 pairs', '0.124', '0.151'],
  ['A state silent on the question, answered between 0.35 and 0.65: share of 60', '81.7%', '38.3%'],
  ['Accuracy over 951 validation rows of 9 yes/no suites, pooled', '88.3%', '87.5%'],
];

export const TROLLEY = [
  ['Acted where acting kills more than it saves', '17 of 672 (2.5%)', '69 of 672 (10.3%)', '143 of 672 (21.3%)'],
  ['Killed a stranger to save the people, but would not destroy its own server', '48 of 480 (10.0%)', '180 of 480 (37.5%)', '0 of 480 (0.0%)'],
  ['Pulled the switch onto one person with nobody on the main track, of the wordings', '0 of 24 (0.0%)', '1 of 24 (4.2%)', '24 of 24 (100.0%)'],
];

export const FAMILIES = [
  ['switch', '1,734', '99.9%', '100.0%', '0'],
  ['server', '2,400', '99.8%', '100.0%', '0'],
  ['robot', '1,366', '99.9%', '100.0%', '0'],
  ['developer', '1,600', '100.0%', '100.0%', '0'],
  ['empty', '1,200', '100.0%', '100.0%', '0'],
  ['spelled', '552', '98.6%', '99.8%', '1'],
  ['bridge', '300', '58.0%', '98.9%', '2'],
];

export const SHORTLIST = [
  { t: 'Every request', foot: '6,608 requests · 2,928 tools · Recall@32: a right tool among the first 32', rows: [['Recall@32', 73.6, 93.6], ['nDCG@10', 51.6, 72.3], ['Top-1', 41.4, 55.5]] },
  { t: 'Requests for a Hanzo service', foot: '670 requests · a service scored as the best of its operations', rows: [['Recall@32', 15.5, 99.9], ['nDCG@10', 3.5, 81.5], ['Top-1', 0.0, 51.0]] },
];

export const SETTLED = [
  ['Every task both solved', '42', '3.02×', '2.06–4.36×'],
  ['Settled by search, no model call', '24', '8.22×', '6.86–9.82×'],
  ['The model’s first edit', '4', '1.31×', '1.14–1.48×'],
];
export const AGENTS = [
  ['Claude Code, sonnet-5.5 default effort', '9.5', '3.8'],
  ['Hanzo Dev, dev flow fix, Kai + enso-flash', '2.3', '1.0'],
];

/* Agent tools: four handler tables */
export const TOOLS = [
  {
    h: 'Shell commands an agent should not run unasked', bench: 'mcp.command', split: 'hermes',
    note: 'Split hermes: hermes-jev-skills evals/gate/fixtures.jsonl (MIT), 118 made-up commands. The rules were frozen and read once (1 of 65 allowed: a metadata-endpoint fetch); that class and a bare `rm -rf /` were fixed after, so this run is not held out',
    cols: ['Allowed, should deny or ask', 'Ordinary, stopped', 'Must deny, denied'],
    rows: [['Current', 'Rules', '0.0% (0 / 65)', '34.0% (18 / 53)', '54.3% (19 / 35)', '0.060 ms'], ['Replaced, ae4d07b', 'Rules, then Kai', '18.5% (12 / 65)', '62.3% (33 / 53)', '14.3% (5 / 35)', '–']],
  },
  {
    h: 'Which registered tool a task needs', bench: 'mcp.select', split: 't1dev',
    note: "Split t1dev: supplied tool lists from Kai's T1 tools6 dev split (manifest 48be841f)",
    cols: ['Right tool first', 'MRR', 'Abstained'],
    rows: [['Current', 'Rules, then BM25', '73.3% (220 / 300)', '0.841', '1', '0.160 ms'], ['Replaced, ae4d07b', 'Kai', '65.7% (197 / 300)', '0.805', '43', '–']],
  },
  {
    bench: 'mcp.select', split: 'hand',
    note: 'Split hand: eight hand-labelled tasks over eight tools',
    cols: ['Right tool first', 'MRR', 'Abstained'],
    rows: [['Current', 'Rules, then BM25', '50.0% (4 / 8)', '0.590', '2', '0.100 ms'], ['Replaced, ae4d07b', 'Kai', '25.0% (2 / 8)', '0.491', '2', '–']],
  },
  {
    h: 'What kind of failure a CI log shows', bench: 'mcp.triage', split: 'ci60',
    note: 'Split ci60: 60 real CI logs from 48 public repositories, labelled from the excerpt alone without the rules in view; nameable = the 40 whose class the old six categories can name',
    cols: ['Right class', 'Right class, nameable', 'Unknown'],
    rows: [['Current', 'Rules', '70.0% (42 / 60)', '70.0% (28 / 40)', '9', '0.370 ms'], ['Replaced, ae4d07b', 'Kai', '–', '50.0% (20 / 40)', '–', '–']],
  },
];

/* Evidence behind the rows */
export const CHOICE = [['Accuracy, 4 options', '94.3%', '90.5%'], ['Accuracy, 16 options', '92.0%', '85.3%'], ['Accuracy, 77 options', '88.0%', '84.3%']];
export const MASSIVE = [
  ['af', 88, 87], ['am', 86, 85], ['ar', 92, 87], ['az', 94, 88], ['bn', 89, 86], ['cy', 86, 76], ['da', 91, 88], ['en', 95, 92],
  ['fi', 96, 89], ['fr', 92, 90], ['hy', 88, 84], ['is', 85, 84], ['jv', 84, 75], ['km', 85, 81], ['kn', 90, 87], ['lv', 89, 85],
  ['mn', 86, 84], ['ms', 93, 92], ['my', 94, 89], ['nb', 91, 86], ['nl', 93, 90], ['pt', 92, 90], ['ro', 96, 94], ['ru', 98, 94],
  ['sl', 91, 89], ['sq', 94, 76], ['sv', 95, 94], ['sw', 83, 70], ['tl', 91, 85], ['vi', 90, 89], ['zh-TW', 96, 93],
];

/* Zen 6 */
export const HW = [
  ['NVIDIA Grace-Blackwell · NVFP4 + Latent Sparse Attention (D-LSA)', '~3,665 tok/s', 3665, '~70 tok/s', 70],
  ['AMD Strix Halo · 4-bit build', '1,150–1,452 tok/s', 1150, '~37 tok/s', 37],
  ['Apple silicon · MLX build', '500–690 tok/s', 500, '64–81 tok/s', 64],
];
/* context length, hardware · method, prefill, decode (x = speed-up against full attention) */
export const LSA = [
  ['8K', '8K tokens (Hanzo Engine live) · NVIDIA Grace-Blackwell GB10 · D-LSA GPU Cache', '5.53× (3,665.5 tok/s)', 5.53, '4.92× (70.0 tok/s)', 4.92],
  ['32K', '32K tokens · NVIDIA Grace-Blackwell GB10 · D-LSA (Flat)', '8.58× (4.28 ms)', 8.58, '4.39× (0.135 ms)', 4.39],
  ['64K', '64K tokens · NVIDIA Grace-Blackwell GB10 · D-LSA (Flat)', '12.17× (6.71 ms)', 12.17, '6.46× (0.111 ms)', 6.46],
  ['128K', '128K tokens · NVIDIA Grace-Blackwell GB10 · D-LSA / N-LSA', '23.72× (6.46 ms)', 23.72, '12.77× (0.152 ms)', 12.77],
  ['256K', '256K tokens · NVIDIA Grace-Blackwell GB10 · D-LSA (Tree)', '27.50× (11.25 ms)', 27.5, '23.35× (0.157 ms)', 23.35],
  ['512K', '512K tokens · NVIDIA Grace-Blackwell GB10 · D-LSA (Tree)', '35.75× (17.09 ms)', 35.75, '42.75× (0.154 ms)', 42.75],
  ['1M', '1M tokens · NVIDIA Grace-Blackwell GB10 · D-LSA (Tree)', '46.29× (26.40 ms)', 46.29, '78.57× (0.167 ms)', 78.57],
  ['10M', '10M tokens · NVIDIA H200 · D-LSA (Tree)', '72.40×', 72.4, '42.50×', 42.5],
];

/* Agent harness: memory panels (baseline, Hanzo) */
export const MEMORY = [
  { t: 'MemoryAgentBench', to: '/benchmarks/memoryagentbench', foot: 'substring EM · pooled over the dev haystack and the three test haystacks, and the largest alone · reader: none, embedder zenlm/zen-embedding-0.6b',
    rows: [['single-hop, plain resolver', 95.5, 'single-hop, typed search', 98.3], ['multi-hop, plain resolver', 56.8, 'multi-hop, typed search', 84.5], ['262k multi-hop, plain', 33.0, '262k multi-hop, typed', 67.0]] },
  { t: 'LoCoMo', to: '/benchmarks/locomo', foot: 'test split · zen-embedding-0.6b · k=20 · ALL = every annotated evidence turn in the top 20',
    rows: [['multi-hop ALL@20, cosine', 18.8, 'multi-hop ALL@20, Hanzo', 37.5], ['R@20, cosine', 70.9, 'R@20, Hanzo', 80.7]] },
  { t: 'LongMemEval', to: '/benchmarks/longmemeval', foot: '500 questions · all-minilm vectors for both · ALL@5 = every evidence session in the top 5',
    rows: [['cosine', 85.8, 'engine, frozen on LoCoMo', 90.6]] },
];

/* The race: three agents on one target query, five scenarios (Hanzo's CodeRace figures) */
const L = (latency: string, ms: number, turns: number, tokens: number, savings: string, detail: string) => ({ latency, ms, turns, tokens, savings, detail });
export const RACE = [
  { title: 'Subsystem Logic (State Tracking & Auth)', target: 'Workspace state diffing & hashing logic',
    hanzo: L('0.7 ms', 0.7, 1, 398, '98.4%', 'In-process Trigram + Tree-Sitter AST context bundle (0 daemons)'),
    rag: L('202 ms', 202, 1, 382, '98.5%', 'Qdrant Vector DB container + Ollama mxbai-embed-large (10 GB)'),
    trad: { ...L('36.4 s', 36360, 8, 25078, '', 'Iterative grep + full file reads over stdio (8 roundtrips to LLM)'), steps: ['Grep "state"', 'Read main.go', 'Read manager.go', 'Read detector.go', 'Read state.go', 'Read cache.go', 'Read watcher.go', 'Synthesize'] } },
  { title: 'Function Signature & Implementation', target: 'func buildEmbedText(ch CodeChunk, maxChars int)',
    hanzo: L('0.05 ms', 0.05, 1, 407, '87.3%', 'Tree-Sitter exact AST node definition resolution'),
    rag: L('37 ms', 37, 1, 437, '86.4%', 'Qdrant payload filter (name + type scroll)'),
    trad: { ...L('9.0 s', 9000, 2, 3204, '', 'Grep search followed by reading the entire parent source file'), steps: ['Grep symbol name', 'Read entire source file (1,000+ lines)'] } },
  { title: 'API Surface & Route Discovery', target: 'Full surface tool and route table',
    hanzo: L('0.4 ms', 0.4, 1, 160, '98.4%', 'Tree-Sitter exports & outline scan in-process'),
    rag: L('190 ms', 190, 1, 176, '98.2%', 'Hybrid lexical + vector search across Qdrant chunks'),
    trad: { ...L('49.7 s', 49670, 11, 125687, '', 'Multi-file scan reading 11+ route and handler files into context'), steps: ['Grep tool definitions', 'Read handlers (11 files)', 'Synthesize route surface'] } },
  { title: 'Claude Code Acceleration: Zero-Model Fault Repair (Kai)', target: 'Single-token fault repair on failing unit test',
    hanzo: L('180 ms', 180, 1, 0, '100%', 'Kai deterministic test search settles fault with 0 model calls in 180ms'),
    rag: L('4.2 s', 4200, 2, 2840, '94.8%', 'Qdrant vector retrieval + 1 LLM inference turn'),
    trad: { ...L('24.8 s', 24800, 6, 55000, '', 'Native Claude Code multi-turn LLM reasoning and file editing (6 roundtrips)'), steps: ['Run test suite', 'Read failure trace', 'Inspect implementation', 'Attempt patch', 'Re-run test', 'Verify diff'] } },
  { title: 'Claude Code Acceleration: Atomic AST Refactoring', target: 'Rename BackendKind to BackendType across 10 files',
    hanzo: L('1.46 s', 1460, 2, 1480, '94.9%', 'Hanzo AST Refactor tool executes atomic multi-file rename in 18ms'),
    rag: L('14.8 s', 14800, 4, 8900, '69.0%', 'Vector search for callers + multi-step edits'),
    trad: { ...L('54.8 s', 54750, 13, 28740, '', 'Native Claude Code sequential file edits (13 LLM roundtrips)'), steps: ['Grep usages', 'Edit file 1', 'Edit file 2', 'Edit file 3', 'Edit file 4', 'Edit file 5', 'Edit file 6', 'Edit file 7', 'Edit file 8', 'Edit file 9', 'Edit file 10', 'Run typecheck', 'Synthesize diff'] } },
];

/* Agent platform */
export const PLATFORM = [
  ['477 bytes', 'State per dormant agent', '/benchmarks/fleet'],
  ['601 bytes', 'Heap per live agent, a goroutine', '/benchmarks/goroutine'],
  ['125 ns', 'Spawn one goroutine', '/benchmarks/goroutine'],
  ['107 ms — 107 ns each', 'Wake one million goroutines', '/benchmarks/goroutine'],
];
export const STARTUP = [
  ['0.034 ms', 'Resume one dormant agent', 'In process, from its stored state.', '/benchmarks/fleet'],
  ['149.6 ms', 'A sandbox that runs a shell, cold', 'pooled 35.8 ms; published <200 ms · ~1 s · 1–3 s.', '/benchmarks/platform-bench'],
  ['$0.00000063', 'One call, marginal cost', 'Against a published $0.05 credit (79,614×).', '/benchmarks/platform-bench'],
];

export const METHODS = [
  ['Every result is current.', 'Each build pulls the latest validated runs from the research API: canonical, public, and not flagged inconsistent. When the API cannot be read, or answers with fewer runs than the committed snapshot already holds, the build keeps the snapshot, and the page swaps in what the API holds once it answers in the browser.'],
  ['Every row is dated.', 'A run is dated by when it ended; the platform bench records its month.'],
  ['Live, frozen, superseded.', 'Live is the newest run the API serves for a benchmark. Frozen is a committed run file, a snapshot, or a figure transcribed from a harness’s README. Superseded is an earlier run of the same benchmark that a later one replaced; it stays in the library, so a revision’s history can be read.'],
  ['Where a number comes from.', null],
  ['Measured, not reported.', 'Every frontier point is a run Hanzo filed: the router and each single model on the same questions, at the same tag. No vendor-reported figure is on a board here.'],
  ['Prices are prices.', 'Kai beside Jev is the input-token rate each is billed, from the price list, not a cost per task. The frontier’s axis is what each run spent on the whole question set. No speed is claimed here without a measured comparison; latency, where this Kai version was timed, is in its tables.'],
  ['Comparing rows.', 'A frontier is drawn among the rows of one benchmark, never across two, and a leaderboard row compares two models on one suite. Suites measure different tasks, so the mean is a summary, not a score on any of them.'],
];

export const PAPERS = [
  ['Zen 6: Subquadratic Ultra-Long Context via Hierarchical Latent Sparse Attention', 'Distilled & Native Latent Sparse Attention (D-LSA / N-LSA) on 27B Dense Transformers', 'zen6-latent-sparse-attention'],
  ['Kai: Calibrated Discrete Decision Intelligence for Autonomous Agent Loops', 'Factorized Discrete Choice, Calibrated Distributions, and Deterministic Policy Governance', 'kai-decision-model'],
  ['Linkage, Not Similarity', 'What long-term agent memory has to retrieve, and how it is measured', 'hanzo-context-memory'],
  ['Hanzo AI Chain (AIVM)', 'Useful-Work Mining, the Native AI Coin, and Post-Quantum Omnichain Settlement', 'hanzo-ai-chain'],
  ['Cloud Economics of a Sovereign OSS Stack', 'A Regulated Capital-Markets Migration Case Study', 'hanzo-cloud-economics'],
  ['One Native Stack for Private, Continuously-Learning AI', 'Inference at the Bandwidth Wall, On-Device QLoRA, One Engine', 'hanzo-native-stack-thesis'],
  ['Native ROCm Inference on a Consumer RDNA3.5 APU', 'Reaching llama.cpp Decode Parity via a Unified 1-bit-to-Full Quant Core', 'hanzo-rocm-inference'],
  ['Edge LLM Inference Across Commodity Accelerators', 'Measured AMD, NVIDIA, and Apple Performance', 'hanzo-cross-backend-inference'],
  ['Native Training in the Hanzo Engine', 'One Engine, One Quant Format, One Backend', 'hanzo-native-training'],
  ['Continuously-Learning Private AI', 'Self-Improvement and Privacy in the Hanzo Native Stack', 'hanzo-continuous-learning-privacy'],
  ['Economical Serving and the hanzo.ai Platform', 'A Bandwidth-Optimal Unified Train-and-Serve Runtime', 'hanzo-platform-infra-desktop'],
  ['The Unified Sovereign-Tenant Cloud', 'Linear Shared-Nothing Scaling via Per-Tenant SQLite and In-Process Composition', 'hanzo-unified-tenant-cloud'],
  ['Refutation-Driven Performance Engineering', 'An Empirical Study of a Multi-Week GPU Kernel Campaign', 'refutation-driven-perf'],
  ['Evolutionary Schedule Search in a One-Source Kernel DSL', 'And the Continual-Improvement Loop It Anchors', 'evolutionary-schedule-search'],
  ['Hanzo Router', 'Memory-Aware, Local-First LLM Routing with a Learned SLO-Constrained Policy', 'hanzo-router'],
  ['What a Dormant Agent Costs', 'State, Execution and Isolation Measured Separately at a Fleet of One Million', 'hanzo-dormant-agents'],
  ['Hops Do Not Fix Multi-Hop Retrieval', 'A Negative Result on Long-Horizon Conversational Memory, and What the Failure Actually Is', 'hanzo-multi-hop-retrieval'],
  ['Retrieval Scoped by Subject', 'A factorial measurement of conversational memory on LoCoMo, and the negative controls that locate the effect', 'locomo-subject-scope'],
  ['Hanzo Network Whitepaper', 'L1 Blockchain for Decentralized AI Compute', 'network-whitepaper'],
].map(([t, s, slug]) => ({ t, s, to: `https://papers.hanzo.ai/${slug}/` }));

/* The shelf: the rows Hanzo's page lists before "Show all", from its build snapshot */
const ZEN = 'Zen 6 throughput & Latent Sparse Attention';
const LSAROW = (id: string, sys: string, kind: string, val: string, base: string) => [`zen-6.lsa.${id}.${kind}`, '/benchmarks/zen-6', ZEN, `Zen 6 · ${sys} vs Full Attention`, 'Zen 6', 'Throughput & subquadratic long-context attention', kind === 'prefill' ? 'D-LSA Prefill speedup' : 'D-LSA Decode speedup', val, base, 'Win', 'Nov 4, 2026'];
const TPUT = (id: string, sys: string, kind: string, val: string) => [`zen-6.${id}.${kind}`, '/benchmarks/zen-6', ZEN, `Zen 6 · ${sys}`, 'Zen 6', 'Throughput & subquadratic long-context attention', kind === 'prefill' ? 'Prefill throughput' : 'Decode throughput', val, 'no baseline', 'Unscored', 'Nov 4, 2026'];
export const SHELF = [
  LSAROW('10m-h200', 'D-LSA (Tree) · 10M tokens (NVIDIA H200)', 'prefill', '72.40×', 'baseline 1.00×'),
  LSAROW('10m-h200', 'D-LSA (Tree) · 10M tokens (NVIDIA H200)', 'decode', '42.50×', 'baseline 1.00×'),
  LSAROW('1m-gb10', 'D-LSA (Tree) · 1M tokens (NVIDIA Grace-Blackwell GB10)', 'prefill', '46.29× (26.40 ms)', 'baseline 1.00× (1,222.10 ms)'),
  LSAROW('1m-gb10', 'D-LSA (Tree) · 1M tokens (NVIDIA Grace-Blackwell GB10)', 'decode', '78.57× (0.167 ms)', 'baseline 1.00× (13.105 ms)'),
  LSAROW('512k-gb10', 'D-LSA (Tree) · 512K tokens (NVIDIA Grace-Blackwell GB10)', 'prefill', '35.75× (17.09 ms)', 'baseline 1.00× (610.86 ms)'),
  LSAROW('512k-gb10', 'D-LSA (Tree) · 512K tokens (NVIDIA Grace-Blackwell GB10)', 'decode', '42.75× (0.154 ms)', 'baseline 1.00× (6.586 ms)'),
  LSAROW('256k-gb10', 'D-LSA (Tree) · 256K tokens (NVIDIA Grace-Blackwell GB10)', 'prefill', '27.50× (11.25 ms)', 'baseline 1.00× (309.25 ms)'),
  LSAROW('256k-gb10', 'D-LSA (Tree) · 256K tokens (NVIDIA Grace-Blackwell GB10)', 'decode', '23.35× (0.157 ms)', 'baseline 1.00× (3.670 ms)'),
  LSAROW('128k-gb10', 'D-LSA / N-LSA · 128K tokens (NVIDIA Grace-Blackwell GB10)', 'prefill', '23.72× (6.46 ms)', 'baseline 1.00× (153.29 ms)'),
  LSAROW('128k-gb10', 'D-LSA / N-LSA · 128K tokens (NVIDIA Grace-Blackwell GB10)', 'decode', '12.77× (0.152 ms)', 'baseline 1.00× (1.944 ms)'),
  LSAROW('64k-gb10', 'D-LSA (Flat) · 64K tokens (NVIDIA Grace-Blackwell GB10)', 'prefill', '12.17× (6.71 ms)', 'baseline 1.00× (81.62 ms)'),
  LSAROW('64k-gb10', 'D-LSA (Flat) · 64K tokens (NVIDIA Grace-Blackwell GB10)', 'decode', '6.46× (0.111 ms)', 'baseline 1.00× (0.716 ms)'),
  LSAROW('32k-gb10', 'D-LSA (Flat) · 32K tokens (NVIDIA Grace-Blackwell GB10)', 'prefill', '8.58× (4.28 ms)', 'baseline 1.00× (36.70 ms)'),
  LSAROW('32k-gb10', 'D-LSA (Flat) · 32K tokens (NVIDIA Grace-Blackwell GB10)', 'decode', '4.39× (0.135 ms)', 'baseline 1.00× (0.593 ms)'),
  LSAROW('8k-engine', 'D-LSA GPU Cache · 8K tokens (Hanzo Engine live) (NVIDIA Grace-Blackwell GB10)', 'prefill', '5.53× (3,665.5 tok/s)', 'baseline 1.00× (662.3 tok/s)'),
  LSAROW('8k-engine', 'D-LSA GPU Cache · 8K tokens (Hanzo Engine live) (NVIDIA Grace-Blackwell GB10)', 'decode', '4.92× (70.0 tok/s)', 'baseline 1.00× (14.2 tok/s)'),
  ['zen-6.nlsa.128k.train', '/benchmarks/zen-6', ZEN, 'Zen 6 · N-LSA (Native) · 128K tokens vs Full Attention', 'Zen 6', 'Throughput & subquadratic long-context attention', 'N-LSA Training speedup', '1.60× per layer', 'baseline 1.00×', 'Win', 'Nov 4, 2026'],
  TPUT('nvidia-grace-blackwell', 'NVIDIA Grace-Blackwell', 'prefill', '~3,665 tok/s'),
  TPUT('nvidia-grace-blackwell', 'NVIDIA Grace-Blackwell', 'decode', '~70 tok/s'),
  TPUT('amd-strix-halo', 'AMD Strix Halo', 'prefill', '1,150–1,452 tok/s'),
  TPUT('amd-strix-halo', 'AMD Strix Halo', 'decode', '~37 tok/s'),
  TPUT('apple-silicon', 'Apple silicon', 'prefill', '500–690 tok/s'),
  TPUT('apple-silicon', 'Apple silicon', 'decode', '64–81 tok/s'),
  ['kai-ag-news.accuracy.kai-1-4-c1856a77', '/benchmarks/kai-ag-news', 'AG News', 'kai-1.4 · c1856a77 vs Jev', 'Kai', 'Decision harness', 'Accuracy', '93.8%', 'baseline 86.0%', 'Win', 'Oct 16, 2026'],
].map(([id, to, t, sys, product, category, measure, val, base, result, date], i) => ({ id, to, t, sys, product, category, measure, val, base, result, date, status: 'Live', i, v: parseFloat(val.replace(/[~,]/g, '')) || 0 }));

/* Hanzo's facets for the whole library of 166 results */
export const FACETS = [
  ['Product', 'product', [['Kai', 120], ['Zen 6', 26], ['Agent harness', 8], ['Agent platform', 12]]],
  ['Category', 'category', [['Decision harness', 115], ['Throughput & subquadratic long-context attention', 23], ['Platform, agents, and sandboxes', 9], ['Memory and retrieval', 6], ['Capability', 3], ['Cost and start-up', 3], ['Engine prefill vs llama.cpp', 3], ['Latency', 2]], '2 more'],
  ['Measure', 'measure', [['Accuracy', 67], ['Calibration error (ECE)', 51], ['D-LSA Decode speedup', 8], ['D-LSA Prefill speedup', 8], ['Decode throughput', 3], ['Prefill throughput', 3], ['Prefill throughput vs llama.cpp', 3], ['substring EM', 3]], '20 more'],
  ['Measured by', 'by', [['Hanzo', 166]]],
  ['Date', 'date', [['Nov 2026', 23], ['Oct 2026', 42], ['Sep 2026', 98], ['Jul 2026', 3]]],
  ['Status', 'state', [['Live', 48], ['Frozen', 23], ['Superseded', 95]]],
  ['Result', 'result', [['Win', 146], ['Unscored', 20]]],
];
export const VIEWS = [
  ['Live results', '?state=live#all'],
  ['Kai, every revision', '?product=Kai&category=Decision%20harness&measure=Accuracy&order=name#all'],
  ['Superseded runs', '?state=superseded#all'],
  ['Zen 6 and the engine', '?product=Zen%206#all'],
  ['Not measured by Hanzo', '?by=Vendor&by=Board#all'],
];

/* Every benchmark page, by product */
export const PAGES = [
  ['Enso', '?product=Enso#all', [['GPQA-Diamond', '/benchmarks/gpqa']]],
  ['Kai', '?product=Kai#all', [['AG News', '/benchmarks/kai-ag-news'], ['DAIR Emotion', '/benchmarks/kai-dair-emotion'], ['Banking77', '/benchmarks/kai-banking77'], ['Support triage', '/benchmarks/kai-support-triage'], ['Email spam', '/benchmarks/kai-email-spam'], ['Phishing', '/benchmarks/kai-phishing'], ['Toxicity', '/benchmarks/kai-toxicity'], ['RAG relevance', '/benchmarks/kai-rag-relevance'], ['Model routing', '/benchmarks/kai-model-routing'], ['Typed decisions', '/benchmarks/kai-typed-decisions'], ['MASSIVE', '/benchmarks/kai-massive'], ['Choosing among many options', '/benchmarks/kai-choice-size'], ['Latency of one decision', '/benchmarks/kai-latency']]],
  ['Zen 6', '?product=Zen%206#all', [['Zen 6 throughput & Latent Sparse Attention', '/benchmarks/zen-6'], ['Engine prefill on CUDA vs llama.cpp', '/benchmarks/inference']]],
  ['Agent harness', '?product=Agent%20harness#all', [['LoCoMo', '/benchmarks/locomo'], ['MemoryAgentBench', '/benchmarks/memoryagentbench'], ['LongMemEval', '/benchmarks/longmemeval'], ['CronQuestions', '/benchmarks/cronquestions'], ['RepoBench-R', '/benchmarks/repobench-r'], ['LoCoMo · subject scope', '/benchmarks/locomo-subject-scope'], ['LoCoMo-Conv', '/benchmarks/locomo-conv']]],
  ['Agent platform', '?product=Agent%20platform#all', [['Platform bench', '/benchmarks/platform-bench'], ['Fleet residency', '/benchmarks/fleet'], ['Live agent footprint', '/benchmarks/goroutine'], ['Sandbox cold start', '/benchmarks/sandbox']]],
];
