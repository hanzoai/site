// Unified high-res visual & preview resolver for Hanzo AI header menus, model/product previews, and dark-cinema plates.
// Every single one of the 108 header mega-menu options resolves to its own globally unique animation:
//   - 20 bespoke pre-rendered 30fps dark-cinema .webm films (VID:*)
//   - 33 bespoke live animated miniature product & developer workspaces (LIVE:*)
//   - 55 bespoke real-time 60fps WebGL2 dark-cinema 3D sculptures (GL:*)

export type NavPreviewMode = 'model' | 'product' | 'thematic';

export const CINEMA_SCENE_IDS = [
  // Company (11)
  'company-blog',
  'company-reviews',
  'company-careers',
  'company-news',
  'company-brand',
  'company-philosophy',
  'company-contact',
  'blog-commerce',
  'blog-bounds',
  'blog-kai',
  'blog-archive',
  // Research (4)
  'research-models',
  'research-benchmarks',
  'research-compare',
  'research-hips',
  // Products -> Creative AI (6)
  'prod-video',
  'prod-images',
  'prod-3d',
  'prod-sfx',
  'prod-voice',
  'prod-music',
  // Solutions (21)
  'sol-enterprise',
  'sol-customers',
  'sol-contact-sales',
  'sol-finance',
  'sol-sales',
  'sol-marketing',
  'sol-operations',
  'sol-design',
  'sol-cyber',
  'sol-finserv',
  'sol-healthcare',
  'sol-law',
  'sol-retail',
  'sol-government',
  'sol-education',
  'sol-content',
  'sol-research',
  'sol-agents',
  'sol-reserved',
  'sol-startups',
  'sol-partners',
  // Developers (1)
  'dev-integrations',
  // Learn & University (12)
  'learn-coding',
  'learn-guides',
  'learn-cookbook',
  'learn-docs',
  'learn-support',
  'learn-university',
  'uni-agentic-coding',
  'uni-rl',
  'uni-systems',
  'uni-practitioner',
  'uni-architect',
  'uni-marketing',
] as const;

export type CinemaSceneId = (typeof CINEMA_SCENE_IDS)[number];

export const LIVE_SCENE_IDS = [
  'desktop',
  'machines',
  'models-catalog',
  'llms-stream',
  'kai-decisions',
  'enso-routing',
  'hanzo-app',
  'hanzo-cli',
  'hanzo-dev',
  'hanzo-mcp',
  'hanzo-skills',
  'platform-overview',
  'platform-api',
  'platform-playground',
  'platform-gateway',
  'platform-agents',
  'platform-base',
  'install-cli',
  'install-extension',
  'install-ide',
  'install-downloads',
  'install-releases',
  'sol-calculator',
  'dev-docs',
  'dev-openapi',
  'dev-quickstart',
  'dev-hf',
  'dev-headless',
  'dev-apikeys',
  'dev-accelerate',
  'dev-examples',
  'dev-github',
  'dev-status',
] as const;

export type LiveSceneId = (typeof LIVE_SCENE_IDS)[number];

export interface NavPreviewSpec {
  mode: NavPreviewMode;
  kicker: string;
  poster: string;
  video?: string;
  screen?: string;
  windowBar?: string;
  live?: LiveSceneId;
  gl?: CinemaSceneId;
  summary?: string;
  tags?: string[];
  pos?: string;
  scale?: number;
  flip?: 1 | -1;
}

export function navAnimationKey(spec: NavPreviewSpec): string {
  if (spec.gl) return `GL:${spec.gl}`;
  if (spec.live) return `LIVE:${spec.live}`;
  if (spec.video) return `VID:${spec.video}`;
  if (spec.screen) return `SCREEN:${spec.screen}`;
  return `STILL:${spec.poster}`;
}

export interface PlateSpec {
  src: string;
  pos: string;
  scale: number;
  flip: 1 | -1;
}

const EXTERNAL_DESCRIPTIONS: Record<string, string> = {
  'https://hanzo.app': 'Chat, build full-stack apps, orchestrate agents, and ship across web, desktop, and mobile.',
  'https://hanzo.ai/reviews': 'Verified production deployments, engineering reviews, and customer outcomes on Hanzo.',
  'https://hanzo.blog/headless-commerce-agentic-llms/': 'How commerce infrastructure becomes readable, verifiable, and payable by autonomous AI agents.',
  'https://hanzo.blog/2026-10-16-your-ai-is-planning-to-kill-you/': 'Why unconstrained generative loops drift under pressure, and how Kai enforces deterministic safety bounds.',
  'https://hanzo.blog/2026-10-07-introducing-kai/': 'Typed, calibrated discrete decisions for autonomous workflows, policy checks, and agent loops.',
  'https://hips.hanzo.ai': 'Hanzo Improvement Proposals — open standards for semantic routing, MCP tools, and sovereign compute.',
  'https://github.com/hanzoai/cli/releases': 'Signed native binaries, changelogs, and release notes for Hanzo CLI across macOS, Linux, and Windows.',
  'https://hanzo.ai/calculator': 'Estimate token, routing, and dedicated GPU inference costs across frontier models in real time.',
  'https://docs.hanzo.ai': 'Guides, architecture references, SDK quickstarts, and deployment recipes for the Hanzo stack.',
  'https://docs.hanzo.ai/docs/openapi/': 'Complete OpenAPI specification for chat, Kai decisions, multimodal media, and cloud primitives.',
  'https://docs.hanzo.ai/docs/quickstart/': 'Make your first routed model call or launch an autonomous coding agent in under two minutes.',
  'https://huggingface.co/zenlm': 'Open-weight Zen foundation models, checkpoints, and quantization cards under Apache 2.0.',
  'https://platform.hanzo.ai/api-keys': 'Create scoped API keys, set spend limits, and route across 400+ models from one console.',
  'https://platform.hanzo.ai/accelerate': 'Accelerate Claude Code, Codex, Cursor, and Hanzo Dev behind one high-throughput gateway.',
  'https://github.com/hanzoai': '1,700+ open-source repositories spanning inference kernels, MCP servers, UI kits, and cloud services.',
  'https://status.hanzo.ai': 'Live uptime, latency telemetry, and regional health across Hanzo API and Cloud edges.',
  'https://docs.hanzo.ai/docs/coding': 'Configure multi-agent worktrees, MCP toolsets, and repository guardrails for coding agents.',
  'https://docs.hanzo.ai/docs/guides/': 'Production patterns for model routing, structured outputs, RAG memory, and deterministic safety.',
  'https://docs.hanzo.ai/docs/guides/cookbook/': 'Copy-and-run notebooks and full-stack examples built on Zen, Kai, Enso, and Hanzo Cloud.',
  'https://hanzo.university': 'Structured engineering tracks, labs, and certifications for AI systems builders and researchers.',
  'https://hanzo.ai/university/agentic-coding': 'Master multi-agent software engineering, worktree orchestration, and automated verification.',
  'https://hanzo.ai/university/reinforcement-learning': 'Post-training, GRPO, reward modeling, and verifiable evaluation loops on open weights.',
  'https://hanzo.ai/university/systems-engineering': 'Bare-metal C/CUDA/Metal inference kernels, KV-cache compression, and low-latency serving.',
  'https://hanzo.ai/university/ai-practitioner': 'Prompt engineering, model routing, structured evaluation, and production AI workflows.',
  'https://hanzo.ai/university/ai-architect': 'Design sovereign VPC clusters, zero-trust KMS/IAM governance, and hybrid AI clouds.',
  'https://hanzo.ai/university/agentic-marketing': 'Automate multimodal creative pipelines, campaign variants, and attribution with Iro and Koma.',
};

export function resolveNavDescription(href: string): string | undefined {
  if (!href) return undefined;
  return EXTERNAL_DESCRIPTIONS[href] || EXTERNAL_DESCRIPTIONS[href.replace(/\/+$/, '')];
}

// High-resolution raytraced & editorial plates for static page cards (<Sigil>, <BlogIndexFrame>, <About>, etc.)
const CATEGORY_PLATES = {
  company: '/images/categories/company.webp',
  research: '/images/categories/research.webp',
  cloud: '/images/categories/cloud.webp',
  developers: '/images/categories/developers.webp',
  solutions: '/images/categories/solutions.webp',
  learn: '/images/categories/learn.webp',
  vault: '/images/blog/cryptographic-vault-lattice-web.jpg',
  manifold: '/images/blog/quantitative-financial-manifold-web.jpg',
  capital: '/images/blog/sovereign-ai-capital-hero-web.jpg',
  workflow: '/images/blog/human-first-prompting-workflow.webp',
  terminal: '/university/developer-terminal-web.jpg',
  damonReveal: '/customers/damon-motorcycles/reveal.webp',
  damonRider: '/customers/damon-motorcycles/rider.webp',
  kanoaAthlete: '/customers/kanoa/athlete.webp',
} as const;

export type CategoryFilmSlug =
  | 'company'
  | 'research'
  | 'safety'
  | 'trust'
  | 'cloud'
  | 'developers'
  | 'open-source'
  | 'engineering'
  | 'solutions'
  | 'learn'
  | 'products';

const MODEL_META: Record<string, { kicker: string; tags: string[]; slug: string }> = {
  enso: { slug: 'enso', kicker: 'Flagship Router', tags: ['Routing', 'Agents'] },
  kai: { slug: 'kai', kicker: 'Decision Model', tags: ['Logic', 'Calibrated'] },
  zen: { slug: 'zen', kicker: 'Foundation LLM', tags: ['Reasoning', 'Apache 2.0'] },
  'zen-7': { slug: 'zen-7', kicker: 'Next-Gen Frontier', tags: ['Preview', 'Open Weights'] },
  koma: { slug: 'koma', kicker: 'Creative AI', tags: ['Video', 'World Sim'] },
  iro: { slug: 'iro', kicker: 'Creative AI', tags: ['Images', 'Vision'] },
  mori: { slug: 'mori', kicker: 'Creative AI', tags: ['3D', 'Spatial'] },
  oto: { slug: 'oto', kicker: 'Creative AI', tags: ['Audio', 'SFX'] },
  koe: { slug: 'koe', kicker: 'Creative AI', tags: ['Voice', 'Speech'] },
  uta: { slug: 'uta', kicker: 'Creative AI', tags: ['Music', 'Stems'] },
};

const PLATE_COMPOSITIONS: ReadonlyArray<[string, number, 1 | -1]> = [
  ['50% 48%', 1.04, 1],
  ['45% 42%', 1.14, 1],
  ['55% 54%', 1.12, -1],
  ['48% 60%', 1.18, 1],
  ['54% 40%', 1.15, -1],
  ['46% 50%', 1.1, 1],
  ['56% 46%', 1.16, -1],
  ['50% 38%', 1.12, 1],
];

export function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function vidModel(key: string, summary?: string): NavPreviewSpec {
  const m = MODEL_META[key] || MODEL_META.enso;
  return {
    mode: 'model',
    kicker: m.kicker,
    poster: `/models/${m.slug}.webp`,
    video: `/models/${m.slug}.webm`,
    tags: m.tags,
    summary,
    pos: '50% 50%',
    scale: 1.03,
    flip: 1,
  };
}

function vidCat(kicker: string, film: CategoryFilmSlug, tags: string[], summary?: string): NavPreviewSpec {
  return {
    mode: 'thematic',
    kicker,
    poster: `/categories/${film}.webp`,
    video: `/categories/${film}.webm`,
    tags,
    summary,
    pos: '50% 50%',
    scale: 1.03,
    flip: 1,
  };
}

function glScene(
  gl: CinemaSceneId,
  kicker: string,
  tags: string[],
  poster = '/categories/company.webp',
  mode: 'thematic' | 'model' = 'thematic',
  summary?: string,
): NavPreviewSpec {
  return {
    mode,
    gl,
    kicker,
    poster,
    tags,
    summary,
    pos: '50% 50%',
    scale: 1.03,
    flip: 1,
  };
}

function liveWin(
  live: LiveSceneId,
  kicker: string,
  windowBar: string,
  tags: string[],
  backdrop: CategoryFilmSlug = 'products',
  summary?: string,
): NavPreviewSpec {
  return {
    mode: 'product',
    live,
    kicker,
    poster: `/categories/${backdrop}.webp`,
    windowBar,
    tags,
    summary,
    pos: '50% 50%',
    scale: 1.06,
    flip: 1,
  };
}

// Canonical 1-to-1 animation mapping across all 108 menu options (zero shared videos, zero static stills)
const NAV_SPECS: Record<string, NavPreviewSpec> = {
  // ==================== 1. COMPANY (12) ====================
  'Company>Explore Company>About Us': vidCat('Company', 'company', ['Pareto Frontier', 'Since 2014']),
  'Company>Explore Company>Blog': glScene('company-blog', 'Editorial', ['Engineering', 'Essays'], '/categories/research.webp'),
  'Company>Explore Company>Reviews': glScene('company-reviews', 'Customer Proof', ['Verified', 'Outcomes'], '/categories/company.webp'),
  'Company>Explore Company>Careers': glScene('company-careers', 'Careers', ['Remote-first', 'Builders'], '/categories/company.webp'),
  'Company>Explore Company>News': glScene('company-news', 'Press & Media', ['Newsroom', 'Launches'], '/categories/company.webp'),
  'Company>Resources>Brand Guidelines': glScene('company-brand', 'Identity', ['Design System', 'Marks'], '/categories/company.webp'),
  'Company>Resources>Philosophy': glScene('company-philosophy', 'First Principles', ['Zen Balance', 'Open Stack'], '/categories/company.webp'),
  'Company>Resources>Contact': glScene('company-contact', 'Global Reach', ['Direct', '24/7'], '/categories/company.webp'),
  'Company>Blog>Optimizing for Headless Commerce in the Era of Agentic LLMs': glScene('blog-commerce', 'Featured Essay', ['Agentic Commerce'], '/categories/solutions.webp'),
  'Company>Blog>Your AI is Planning To Kill You': glScene('blog-bounds', 'Safety Essay', ['Bounded Loops', 'Kai'], '/categories/safety.webp'),
  'Company>Blog>Kai 1: Decisions, Not Completions': glScene('blog-kai', 'Research Essay', ['Calibrated', 'Decisions'], '/models/kai.webp'),
  'Company>Blog>All articles': glScene('blog-archive', 'Full Archive', ['All Posts', 'Chronicle'], '/categories/research.webp'),

  // ==================== 2. RESEARCH (18) ====================
  'Research>Releases>Enso': vidModel('enso'),
  'Research>Releases>Kai': vidModel('kai'),
  'Research>Releases>Zen 6': vidModel('zen'),
  'Research>Releases>Zen 7': vidModel('zen-7'),
  'Research>Creative AI>Koma': vidModel('koma'),
  'Research>Creative AI>Iro': vidModel('iro'),
  'Research>Creative AI>Mori': vidModel('mori'),
  'Research>Creative AI>Oto': vidModel('oto'),
  'Research>Creative AI>Koe': vidModel('koe'),
  'Research>Creative AI>Uta': vidModel('uta'),
  'Research>Explore Research>All models': glScene('research-models', 'Model Taxonomy', ['Foundation', 'Multimodal'], '/categories/research.webp', 'model'),
  'Research>Explore Research>Benchmarks': glScene('research-benchmarks', 'Evaluation', ['GPQA', 'SWE-bench'], '/categories/research.webp'),
  'Research>Explore Research>Overview': vidCat('Explore Research', 'research', ['Papers', 'Architectures']),
  'Research>Explore Research>Compare': glScene('research-compare', 'Head-to-Head', ['Quality', 'Latency'], '/categories/research.webp'),
  'Research>Explore Research>Open source': vidCat('Open Ecosystem', 'open-source', ['1,700+ Repos', 'Apache 2.0'], '1,700+ open-source repositories across foundation models, MCP, and cloud.'),
  'Research>Explore Research>Specifications': glScene('research-hips', 'Specifications', ['HIP Standards', 'Protocols'], '/categories/developers.webp'),
  'Research>Safety>Security': vidCat('Safety', 'safety', ['Zero-Trust', 'SOC 2 · KMS']),
  'Research>Safety>Trust & transparency': vidCat('Safety', 'trust', ['Attested', 'SOC 2 · KMS'], 'Enterprise compliance, KMS key isolation, access controls, and continuous audits.'),

  // ==================== 3. PRODUCTS (28) ====================
  'Products>AI Models>All models': liveWin('models-catalog', 'AI Models', 'platform.hanzo.ai/models', ['400+ Models', '1 Key'], 'cloud'),
  'Products>AI Models>LLMs': liveWin('llms-stream', 'Language Models', 'zen-7 · stream', ['128k Context', 'Reasoning'], 'research'),
  'Products>AI Models>Decisions': liveWin('kai-decisions', 'Decision Engine', 'kai-1 · decide', ['Calibrated', 'Policy'], 'safety'),
  'Products>AI Models>Routing': liveWin('enso-routing', 'Semantic Router', 'enso · router', ['Auto-Route', '-70% Cost'], 'cloud'),

  'Products>Creative AI>Video': glScene('prod-video', 'Video Studio', ['Cinema', '60fps'], '/models/koma.webp', 'model'),
  'Products>Creative AI>Images': glScene('prod-images', 'Image Studio', ['Photoreal', 'Brand Safe'], '/models/iro.webp', 'model'),
  'Products>Creative AI>3D': glScene('prod-3d', 'Spatial 3D', ['Meshes', 'PBR'], '/models/mori.webp', 'model'),
  'Products>Creative AI>Sound effects': glScene('prod-sfx', 'Foley & SFX', ['Spatial', '48 kHz'], '/models/oto.webp', 'model'),
  'Products>Creative AI>Voice': glScene('prod-voice', 'Speech Synthesis', ['Realtime', 'Cloning'], '/models/koe.webp', 'model'),
  'Products>Creative AI>Music': glScene('prod-music', 'Music & Stems', ['Multi-track', 'Lossless'], '/models/uta.webp', 'model'),

  'Products>Apps and tools>Hanzo App': liveWin('hanzo-app', 'Apps & Tools', 'hanzo.app', ['Web', 'Full-Stack'], 'products'),
  'Products>Apps and tools>Hanzo CLI': liveWin('hanzo-cli', 'Command Line', 'hanzo — zsh', ['Single Binary', 'Cloud'], 'developers'),
  'Products>Apps and tools>Hanzo Dev': liveWin('hanzo-dev', 'Agentic Coding', 'hanzo dev', ['Worktrees', 'Auto-PR'], 'developers'),
  'Products>Apps and tools>MCP': liveWin('hanzo-mcp', 'Model Context', 'hanzo-mcp', ['260+ Tools', 'JSON-RPC'], 'developers'),
  'Products>Apps and tools>Skills': liveWin('hanzo-skills', 'Agent Skills', 'hanzo skills', ['Composable', 'Verified'], 'developers'),

  'Products>API Platform>Overview': liveWin('platform-overview', 'API Platform', 'platform.hanzo.ai', ['99.99% SLA', 'Global'], 'cloud'),
  'Products>API Platform>API': liveWin('platform-api', 'Unified API', 'api.hanzo.ai/v1', ['OpenAI Spec', 'SSE'], 'cloud'),
  'Products>API Platform>Playground': liveWin('platform-playground', 'Workbench', 'platform.hanzo.ai/play', ['A/B Arena', 'Tuning'], 'cloud'),
  'Products>API Platform>Gateway': liveWin('platform-gateway', 'AI Gateway', 'gateway.hanzo.ai', ['Cache', 'Zero-Drop'], 'cloud'),
  'Products>API Platform>Agents': liveWin('platform-agents', 'Cloud Agents', 'hanzo.bot', ['24/7 Runs', 'MicroVM'], 'cloud'),
  'Products>API Platform>Base': liveWin('platform-base', 'Hanzo Base', 'base.hanzo.ai', ['Postgres', 'pgvector'], 'cloud'),
  'Products>API Platform>Machines': liveWin('machines', 'Compute', 'api.hanzo.ai/v1/compute', ['H100 GPU', 'Bare Metal'], 'cloud', 'Rent dedicated H100 GPU clusters by the hour with live API quotes and NVMe.'),

  'Products>Install>CLI': liveWin('install-cli', 'Install', 'curl hanzo.sh | sh', ['macOS', 'Linux · Win'], 'developers'),
  'Products>Install>Desktop app': liveWin('desktop', 'Install', 'Hanzo Desktop', ['macOS', 'Win · Linux'], 'developers', 'Run local models, MCP tools, and agents natively on macOS, Windows, and Linux.'),
  'Products>Install>Browser extension': liveWin('install-extension', 'Install', 'hanzo://extension', ['Chrome', 'Brave'], 'products'),
  'Products>Install>IDE': liveWin('install-ide', 'Install', 'hanzo-ide', ['VS Code', 'JetBrains'], 'developers'),
  'Products>Install>All downloads': liveWin('install-downloads', 'Install', 'hanzo.ai/download', ['Signed', 'Universal'], 'products'),
  'Products>Install>Release notes': liveWin('install-releases', 'Releases', 'hanzoai/cli · releases', ['Cosign', 'Changelog'], 'developers'),

  // ==================== 4. SOLUTIONS (25) ====================
  'Solutions>Explore Solutions>All solutions': vidCat('Solutions', 'solutions', ['Sovereign Cloud', 'SLA']),
  'Solutions>Explore Solutions>Enterprise': glScene('sol-enterprise', 'Enterprise', ['VPC', 'Zero-Trust'], '/categories/solutions.webp'),
  'Solutions>Explore Solutions>Customer stories': glScene('sol-customers', 'Case Studies', ['Production', 'ROI'], '/categories/solutions.webp'),
  'Solutions>Explore Solutions>Contact sales': glScene('sol-contact-sales', 'Advisory', ['Custom SLA', 'Architects'], '/categories/solutions.webp'),

  'Solutions>Teams>Finance': glScene('sol-finance', 'Teams', ['Auditable', 'Forecasting'], '/categories/solutions.webp'),
  'Solutions>Teams>Data': vidCat('Teams', 'cloud', ['Pipelines', 'Datastore']),
  'Solutions>Teams>Sales': glScene('sol-sales', 'Teams', ['Pipeline', 'Velocity'], '/categories/solutions.webp'),
  'Solutions>Teams>Marketing': glScene('sol-marketing', 'Teams', ['Omnichannel', 'Attribution'], '/categories/solutions.webp'),
  'Solutions>Teams>Operations': glScene('sol-operations', 'Teams', ['Automation', '24/7 Ops'], '/categories/solutions.webp'),
  'Solutions>Teams>Engineering': vidCat('Teams', 'engineering', ['Agents', 'Sandboxes'], 'Agents that plan, edit, and open PRs — backed by unified models and sandboxes.'),
  'Solutions>Teams>Design': glScene('sol-design', 'Teams', ['Generative', 'Brand Safe'], '/categories/solutions.webp'),

  'Solutions>Industries>Cybersecurity': glScene('sol-cyber', 'Industries', ['Threat Defense', 'SOC'], '/categories/safety.webp'),
  'Solutions>Industries>Financial services': glScene('sol-finserv', 'Industries', ['Low Latency', 'Compliant'], '/categories/solutions.webp'),
  'Solutions>Industries>Healthcare': glScene('sol-healthcare', 'Industries', ['HIPAA BAA', 'Clinical'], '/categories/safety.webp'),
  'Solutions>Industries>Law': glScene('sol-law', 'Industries', ['Zero Retention', 'Citations'], '/categories/safety.webp'),
  'Solutions>Industries>Retail': glScene('sol-retail', 'Industries', ['Commerce', 'Inventory'], '/categories/solutions.webp'),
  'Solutions>Industries>Government': glScene('sol-government', 'Industries', ['Air-Gapped', 'Sovereign'], '/categories/safety.webp'),
  'Solutions>Industries>Education': glScene('sol-education', 'Industries', ['Campus', 'Research'], '/categories/learn.webp'),

  'Solutions>Use cases>Content creation': glScene('sol-content', 'Use Cases', ['Multi-aspect', 'Studio'], '/categories/solutions.webp'),
  'Solutions>Use cases>Research': glScene('sol-research', 'Use Cases', ['Discovery', 'Synthesis'], '/categories/research.webp'),
  'Solutions>Use cases>Agents': glScene('sol-agents', 'Use Cases', ['Swarm', 'Bounded'], '/categories/cloud.webp'),

  'Solutions>Programs>Reserved tier': glScene('sol-reserved', 'Programs', ['Dedicated H100', 'Locked'], '/categories/cloud.webp'),
  'Solutions>Programs>Startups': glScene('sol-startups', 'Programs', ['Cloud Credits', 'Velocity'], '/categories/company.webp'),
  'Solutions>Programs>Partner network': glScene('sol-partners', 'Programs', ['Rev Share', 'Co-Sell'], '/categories/company.webp'),
  'Solutions>Programs>Cost calculator': liveWin('sol-calculator', 'TCO Estimator', 'hanzo.ai/calculator', ['Save 70%+', 'Live Quote'], 'solutions'),

  // ==================== 5. DEVELOPERS (12) ====================
  'Developers>Explore Developers>Documentation': liveWin('dev-docs', 'Documentation', 'docs.hanzo.ai', ['Guides', '⌘K Search'], 'developers'),
  'Developers>Explore Developers>API reference': liveWin('dev-openapi', 'API Reference', 'docs.hanzo.ai/openapi', ['OpenAPI 3.1', 'Schemas'], 'developers'),
  'Developers>Explore Developers>Quickstart': liveWin('dev-quickstart', 'Quickstart', 'quickstart.ts', ['2 Minutes', 'SDK'], 'developers'),
  'Developers>Explore Developers>SDKs': vidCat('Developers', 'developers', ['TS · Py · Go', 'Open Source']),
  'Developers>Explore Developers>Open models': liveWin('dev-hf', 'Open Weights', 'huggingface.co/zenlm', ['Apache 2.0', 'Safetensors'], 'research'),

  'Developers>Resources>Agents sign up free': liveWin('dev-headless', 'Headless Signup', 'POST /v1/agents/signup', ['$5 Credit', 'Ed25519'], 'developers'),
  'Developers>Resources>API keys': liveWin('dev-apikeys', 'Credentials', 'platform.hanzo.ai/keys', ['Scoped RBAC', 'Spend Caps'], 'cloud'),
  'Developers>Resources>Claude Code, Codex, Cursor': liveWin('dev-accelerate', 'Accelerator', 'platform.hanzo.ai/accel', ['3.4× Faster', '-58% Cost'], 'developers'),
  'Developers>Resources>Integrations': glScene('dev-integrations', 'Ecosystem', ['260+ Connectors', 'Webhooks'], '/categories/developers.webp'),
  'Developers>Resources>Examples': liveWin('dev-examples', 'Starter Gallery', 'hanzo.ai/gallery', ['Templates', '1-Click'], 'products'),

  'Developers>Community>GitHub': liveWin('dev-github', 'Open Source', 'github.com/hanzoai', ['1,700+ Repos', 'Apache 2.0'], 'open-source'),
  'Developers>Community>Status': liveWin('dev-status', 'Telemetry', 'status.hanzo.ai', ['99.99% Uptime', 'Global Edge'], 'cloud'),

  // ==================== 6. LEARN (13) ====================
  'Learn>Research & Guides>Overview': vidCat('Learn', 'learn', ['Courses', 'Guides']),
  'Learn>Research & Guides>Coding agents': glScene('learn-coding', 'Agentic Guides', ['Worktrees', 'Guardrails'], '/categories/developers.webp'),
  'Learn>Research & Guides>Guides': glScene('learn-guides', 'Architecture', ['Patterns', 'Production'], '/categories/learn.webp'),
  'Learn>Research & Guides>Cookbook': glScene('learn-cookbook', 'Cookbook', ['Notebooks', 'Recipes'], '/categories/learn.webp'),

  'Learn>Support>Documentation': glScene('learn-docs', 'Reference Codex', ['Full Stack', 'Searchable'], '/categories/learn.webp'),
  'Learn>Support>Help center': glScene('learn-support', 'Support', ['24/7 Engineers', 'SLA'], '/categories/learn.webp'),

  'Learn>Education>Education': glScene('learn-university', 'Hanzo University', ['Tracks', 'Certified'], '/categories/learn.webp'),
  'Learn>Education>Agentic coding': glScene('uni-agentic-coding', 'University Track', ['Multi-Agent', 'Labs'], '/categories/developers.webp'),
  'Learn>Education>Reinforcement learning': glScene('uni-rl', 'University Track', ['GRPO & RLHF', 'Open Weights'], '/categories/research.webp'),
  'Learn>Education>Systems engineering': glScene('uni-systems', 'University Track', ['CUDA & Metal', 'Kernels'], '/categories/developers.webp'),
  'Learn>Education>AI practitioner': glScene('uni-practitioner', 'University Track', ['Routing', 'Evaluation'], '/categories/learn.webp'),
  'Learn>Education>AI architect': glScene('uni-architect', 'University Track', ['Sovereign VPC', 'KMS'], '/categories/cloud.webp'),
  'Learn>Education>Agentic marketing': glScene('uni-marketing', 'University Track', ['Creative AI', 'Campaigns'], '/categories/solutions.webp'),
};

export function resolveNavPreview(
  menu: string,
  head: string,
  link: { label: string; href: string; ext?: boolean },
): NavPreviewSpec {
  const exact = NAV_SPECS[`${menu}>${head}>${link.label}`];
  if (exact) return exact;

  // Deterministic fallback if a new nav link is ever added dynamically
  const idx = hashSeed(`${menu}|${head}|${link.label}|${link.href}`) % CINEMA_SCENE_IDS.length;
  return glScene(CINEMA_SCENE_IDS[idx], head || menu || 'Hanzo AI', ['Hanzo AI']);
}

const FALLBACK_POOL = [
  CATEGORY_PLATES.research,
  CATEGORY_PLATES.cloud,
  CATEGORY_PLATES.developers,
  CATEGORY_PLATES.solutions,
  CATEGORY_PLATES.company,
  CATEGORY_PLATES.learn,
  CATEGORY_PLATES.vault,
  CATEGORY_PLATES.manifold,
  CATEGORY_PLATES.capital,
] as const;

export function resolvePlate(seed: string, data: ReadonlyArray<number | string> = []): PlateSpec {
  const s = String(seed || 'hanzo').toLowerCase();
  const key = s + '|' + data.join(',');
  const h = hashSeed(key);
  const [pos, scale, flip] = PLATE_COMPOSITIONS[h % PLATE_COMPOSITIONS.length];

  // Exact or slug-matched Hanzo models
  if (/\benso\b/.test(s)) return { src: '/models/enso.webp', pos, scale, flip };
  if (/\bkai\b/.test(s)) return { src: '/models/kai.webp', pos, scale, flip };
  if (/\bzen\b/.test(s)) return { src: '/models/zen.webp', pos, scale, flip };
  if (/\bkoma\b|video/.test(s)) return { src: '/models/koma.webp', pos, scale, flip };
  if (/\biro\b|image|design|visual|brand|art/.test(s)) return { src: '/models/iro.webp', pos, scale, flip };
  if (/\bmori\b|3d|spatial/.test(s)) return { src: '/models/mori.webp', pos, scale, flip };
  if (/\boto\b|sound|audio/.test(s)) return { src: '/models/oto.webp', pos, scale, flip };
  if (/\bkoe\b|voice|speech/.test(s)) return { src: '/models/koe.webp', pos, scale, flip };
  if (/\buta\b|music/.test(s)) return { src: '/models/uta.webp', pos, scale, flip };

  // Domain-matched high-res plates
  if (/sec|kms|iam|auth|vault|guard|cert|secret|trust|cyber|law|legal|risk|gov|formal|proof|kill/.test(s)) {
    return { src: CATEGORY_PLATES.vault, pos, scale, flip };
  }
  if (/fin|bill|cost|price|calc|commerce|quant|invest|grant|sales|pay|revenue|token|credit/.test(s)) {
    return { src: CATEGORY_PLATES.manifold, pos, scale, flip };
  }
  if (/customer|case|review|damon/.test(s)) {
    return { src: h % 2 === 0 ? CATEGORY_PLATES.damonRider : CATEGORY_PLATES.damonReveal, pos, scale, flip };
  }
  if (/career|role|team|about|press|company|enterprise|startup|investor|capital|thesis/.test(s)) {
    return { src: h % 2 === 0 ? CATEGORY_PLATES.company : CATEGORY_PLATES.capital, pos, scale, flip };
  }
  if (/solution|health|retail|market|affiliat|reserv/.test(s)) {
    return { src: CATEGORY_PLATES.solutions, pos, scale, flip };
  }
  if (/learn|univ|edu|guide|blog|post|story|news|support|doc/.test(s)) {
    return { src: h % 3 === 0 ? CATEGORY_PLATES.terminal : CATEGORY_PLATES.learn, pos, scale, flip };
  }
  if (/dev|cli|mcp|sdk|oss|git|repo|integrat|code|coder|agent|crew|bot/.test(s)) {
    return { src: CATEGORY_PLATES.developers, pos, scale, flip };
  }
  if (/bench|gpqa|eval|research|model|llm|openai|anthropic|google|meta|deepseek|mistral|qwen|xai/.test(s)) {
    return { src: h % 2 === 0 ? CATEGORY_PLATES.research : '/models/enso.webp', pos, scale, flip };
  }
  if (/cloud|compute|machine|gateway|net|reg|node|mq|stor|sql|vec|redis|o11y|metric|log|engine|deploy|base|platform|chain|block|rpc|validator/.test(s)) {
    return { src: CATEGORY_PLATES.cloud, pos, scale, flip };
  }

  return { src: FALLBACK_POOL[h % FALLBACK_POOL.length], pos, scale, flip };
}
