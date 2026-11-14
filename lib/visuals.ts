// Unified high-res visual & preview resolver for Hanzo AI header menus, model/product previews, and dark-cinema plates.

export type NavPreviewMode = 'model' | 'product' | 'thematic';

export interface NavPreviewSpec {
  mode: NavPreviewMode;
  kicker: string;
  poster: string;
  video?: string;
  screen?: string;
  windowBar?: string;
  tags?: string[];
  pos?: string;
  scale?: number;
  flip?: 1 | -1;
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
  vault: '/images/blog/cryptographic-vault-lattice.jpg',
  manifold: '/images/blog/quantitative-financial-manifold.jpg',
  capital: '/images/blog/sovereign-ai-capital-hero.jpg',
  workflow: '/images/blog/human-first-prompting-workflow.webp',
  terminal: '/university/developer-terminal.jpg',
  damonReveal: '/customers/damon-motorcycles/reveal.webp',
  damonRider: '/customers/damon-motorcycles/rider.webp',
  kanoaAthlete: '/customers/kanoa/athlete.webp',
} as const;

// Seamless 30fps dark-cinema category films (public/categories/<slug>.{webp,webm,mp4})
export type CategoryFilmSlug =
  | 'company'
  | 'research'
  | 'safety'
  | 'cloud'
  | 'developers'
  | 'solutions'
  | 'learn'
  | 'products';

const MODEL_META: Record<string, { kicker: string; tags: string[]; slug: string }> = {
  enso: { slug: 'enso', kicker: 'Flagship Router', tags: ['Routing', 'Agents'] },
  kai: { slug: 'kai', kicker: 'Decision Model', tags: ['Logic', 'Calibrated'] },
  zen: { slug: 'zen', kicker: 'Foundation LLM', tags: ['Reasoning', 'Apache 2.0'] },
  'zen-7': { slug: 'zen', kicker: 'Research Preview', tags: ['Frontier', 'Open Weights'] },
  koma: { slug: 'koma', kicker: 'Creative AI', tags: ['Video', 'World Sim'] },
  iro: { slug: 'iro', kicker: 'Creative AI', tags: ['Images', 'Vision'] },
  mori: { slug: 'mori', kicker: 'Creative AI', tags: ['3D', 'Spatial'] },
  oto: { slug: 'oto', kicker: 'Creative AI', tags: ['Audio', 'SFX'] },
  koe: { slug: 'koe', kicker: 'Creative AI', tags: ['Voice', 'Speech'] },
  uta: { slug: 'uta', kicker: 'Creative AI', tags: ['Music', 'Stems'] },
};

const COMPOSITIONS: ReadonlyArray<[string, number, 1 | -1]> = [
  ['50% 48%', 1.04, 1],
  ['46% 43%', 1.11, 1],
  ['54% 53%', 1.09, 1],
  ['48% 57%', 1.13, 1],
  ['53% 42%', 1.12, 1],
  ['47% 50%', 1.08, 1],
  ['55% 46%', 1.12, 1],
  ['50% 40%', 1.1, 1],
];

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

function modelSpec(key: string, override?: Partial<NavPreviewSpec>): NavPreviewSpec {
  const m = MODEL_META[key] || MODEL_META.enso;
  return {
    mode: 'model',
    kicker: m.kicker,
    poster: `/models/${m.slug}.webp`,
    video: `/models/${m.slug}.webm`,
    tags: m.tags,
    pos: '50% 50%',
    scale: 1.03,
    flip: 1,
    ...override,
  };
}

function productSpec(
  kicker: string,
  screen: string,
  windowBar: string,
  film: CategoryFilmSlug = 'products',
  tags?: string[],
): NavPreviewSpec {
  return {
    mode: 'product',
    kicker,
    poster: `/categories/${film}.webp`,
    video: `/categories/${film}.webm`,
    screen,
    windowBar,
    tags,
    pos: '50% 50%',
    scale: 1.06,
    flip: 1,
  };
}

function categoryFilmSpec(
  kicker: string,
  film: CategoryFilmSlug,
  seed: string,
  tags?: string[],
  exact = false,
): NavPreviewSpec {
  const [pos, scale, flip]: [string, number, 1 | -1] = exact ? ['50% 50%', 1.03, 1] : COMPOSITIONS[hashSeed(seed) % COMPOSITIONS.length];
  return {
    mode: 'thematic',
    kicker,
    poster: `/categories/${film}.webp`,
    video: `/categories/${film}.webm`,
    tags,
    pos,
    scale,
    flip,
  };
}

function stillThematicSpec(
  kicker: string,
  poster: string,
  seed: string,
  tags?: string[],
): NavPreviewSpec {
  const [pos, scale, flip] = COMPOSITIONS[hashSeed(seed) % COMPOSITIONS.length];
  return {
    mode: 'thematic',
    kicker,
    poster,
    tags,
    pos,
    scale,
    flip,
  };
}

export function resolveNavPreview(
  menu: string,
  head: string,
  link: { label: string; href: string; ext?: boolean },
): NavPreviewSpec {
  const href = link.href || '/';
  const lower = href.toLowerCase();
  const clean = lower.split(/[?#]/)[0].replace(/\/+$/, '') || '/';

  // 1. Flagship & Creative AI Models (seamless 30fps /models/*.webm loops)
  if (clean === '/enso') return modelSpec('enso');
  if (clean === '/kai' || lower.includes('introducing-kai')) return modelSpec('kai');
  if (clean === '/zen') return modelSpec('zen');
  if (clean === '/zen/7') return modelSpec('zen-7', { pos: '50% 56%', scale: 1.14 });
  if (clean === '/koma') return modelSpec('koma');
  if (clean === '/iro') return modelSpec('iro');
  if (clean === '/mori') return modelSpec('mori');
  if (clean === '/oto') return modelSpec('oto');
  if (clean === '/koe') return modelSpec('koe');
  if (clean === '/uta') return modelSpec('uta');
  if (clean === '/models') {
    return modelSpec('enso', { kicker: 'Model Catalog', tags: ['400+ Models', '1 Key'] });
  }
  if (lower.includes('huggingface.co/zenlm')) {
    return modelSpec('zen', { kicker: 'Open Weights', tags: ['Hugging Face', 'Apache 2.0'] });
  }

  // 2. Products, Apps, CLI, API Platform, & Developer Docs (UI Window Mockup + Animated Cinema Backdrop)
  if (lower.includes('hanzo.app')) {
    return productSpec('Apps & Tools', '/shots/app-builder-1440.webp', 'hanzo.app', 'products', ['Web', 'Desktop']);
  }
  if (clean === '/desktop') {
    return productSpec('Install', '/shots/chat-1440.webp', 'Hanzo Desktop', 'products', ['macOS', 'Linux']);
  }
  if (clean === '/extension') {
    return productSpec('Install', '/home/products/app-dark.webp', 'hanzo://extension', 'products', ['Chrome', 'Brave']);
  }
  if (clean === '/dev' || clean === '/ide' || lower.includes('/accelerate') || lower.includes('/docs/coding')) {
    return productSpec(
      clean === '/ide' ? 'Install' : 'Agentic Coding',
      '/home/products/dev-dark.webp',
      clean === '/ide' ? 'hanzo-ide' : 'hanzo dev',
      'developers',
      ['Multi-agent', 'Worktrees'],
    );
  }
  if (clean === '/cli' || clean === '/download' || lower.includes('hanzoai/cli')) {
    return productSpec(
      head || 'Command Line',
      '/home/products/cli-dark.webp',
      'hanzo — zsh',
      'developers',
      ['Single Binary', 'Cloud'],
    );
  }
  if (clean === '/mcp' || clean === '/skills' || clean === '/integrations') {
    return productSpec(
      head || 'Tooling',
      '/home/products/mcp-dark.webp',
      clean === '/skills' ? 'hanzo skills' : 'hanzo-mcp',
      'developers',
      ['MCP', 'Connectors'],
    );
  }
  if (clean === '/api' || clean === '/gateway' || lower.includes('/api-keys')) {
    return productSpec(
      'API Platform',
      '/home/products/api-dark.webp',
      'api.hanzo.ai/v1',
      'cloud',
      ['Unified Key', 'Low Latency'],
    );
  }
  if (clean === '/platform' || clean === '/playground' || clean === '/base' || clean === '/machines') {
    return productSpec(
      'API Platform',
      '/shots/docs-api-1440.webp',
      clean === '/playground' ? 'platform.hanzo.ai/playground' : 'platform.hanzo.ai',
      'cloud',
      ['Serverless', 'GPU'],
    );
  }
  if (clean === '/agents' || clean === '/solutions/agents') {
    return productSpec(
      'Autonomous Agents',
      '/shots/bots-1440-dark.webp',
      'hanzo.bot',
      'cloud',
      ['24/7 Runs', 'Sandboxed'],
    );
  }
  if (lower.includes('docs.hanzo.ai/docs/guides') || lower.includes('cookbook')) {
    return categoryFilmSpec('Guides & Cookbook', 'learn', href, ['Patterns', 'Recipes']);
  }
  if (lower.includes('docs.hanzo.ai')) {
    return productSpec(
      'Documentation',
      '/shots/docs-api-1440.webp',
      'docs.hanzo.ai',
      'developers',
      ['OpenAPI', 'Quickstart'],
    );
  }

  // 3. Thematic Category & Column Loops (seamless 30fps /categories/*.webm films)
  // Company
  if (clean === '/about') return categoryFilmSpec('Company', 'company', href, ['Pareto Frontier', 'Since 2014'], true);
  if (clean === '/philosophy') return categoryFilmSpec('Resources', 'company', href, ['First Principles', 'Open Stack']);
  if (clean === '/brand') return categoryFilmSpec('Resources', 'company', href, ['Design System', 'Identity']);
  if (clean === '/contact') return categoryFilmSpec('Resources', 'company', href, ['Global', 'Direct']);
  if (clean === '/careers') return categoryFilmSpec('Company', 'company', href, ['Remote-first', 'Engineering']);
  if (clean === '/press') return categoryFilmSpec('Company', 'company', href, ['Newsroom', 'Media']);
  if (lower.includes('/reviews')) return stillThematicSpec('Customer Proof', CATEGORY_PLATES.damonReveal, href, ['Verified', 'Production']);
  if (lower.includes('headless-commerce')) return categoryFilmSpec('Featured Essay', 'solutions', href, ['Agentic Commerce'], true);
  if (lower.includes('planning-to-kill-you')) return categoryFilmSpec('Safety Essay', 'safety', href, ['Deterministic Bounds'], true);
  if (clean === '/blog') return categoryFilmSpec('Journal', 'research', href, ['Engineering', 'Research'], true);

  // Research & Safety
  if (clean === '/benchmarks') return categoryFilmSpec('Explore Research', 'research', href, ['GPQA', 'SWE-bench'], true);
  if (clean === '/research') return categoryFilmSpec('Explore Research', 'research', href, ['Papers', 'Architectures']);
  if (clean === '/compare') return categoryFilmSpec('Explore Research', 'research', href, ['Quality', 'Cost']);
  if (lower.includes('hips.hanzo.ai')) return categoryFilmSpec('Specifications', 'developers', href, ['HIP Standards', 'Protocols'], true);
  if (clean === '/open-source') return categoryFilmSpec('Open Ecosystem', 'developers', href, ['1,700+ Repos', 'Apache 2.0']);
  if (clean === '/security' || clean === '/trust') {
    return categoryFilmSpec('Safety', 'safety', href, ['Zero-Trust', 'SOC 2 · KMS'], clean === '/security');
  }

  // Solutions
  if (clean === '/customers') return stillThematicSpec('Customer Stories', CATEGORY_PLATES.damonRider, href, ['Case Studies', 'Impact']);
  if (clean === '/solutions/finance' || clean === '/solutions/financial-services' || lower.includes('/calculator')) {
    return categoryFilmSpec(head || 'Finance', 'solutions', href, ['Calibrated', 'Auditable']);
  }
  if (clean === '/solutions/cybersecurity' || clean === '/solutions/law' || clean === '/solutions/government') {
    return categoryFilmSpec(head || 'Regulated', 'safety', href, ['Air-Gapped', 'Sovereign']);
  }
  if (clean === '/solutions/data' || clean === '/solutions/engineering' || clean === '/solutions/operations') {
    return categoryFilmSpec(head || 'Infrastructure', 'cloud', href, ['High Throughput', 'VPC']);
  }
  if (clean === '/solutions/design' || clean === '/solutions/marketing' || clean === '/solutions/content-creation' || clean === '/solutions/retail') {
    return modelSpec(clean === '/solutions/content-creation' ? 'koma' : 'iro', {
      kicker: head || 'Creative',
      tags: ['Brand Safe', 'Multi-modal'],
    });
  }
  if (clean === '/solutions/education') {
    return categoryFilmSpec('Industries', 'learn', href, ['Research', 'Campus']);
  }
  if (clean === '/solutions/research') {
    return categoryFilmSpec('Use Cases', 'research', href, ['Evaluation', 'Compute']);
  }
  if (clean === '/startups') {
    return categoryFilmSpec('Programs', 'company', href, ['Cloud Credits', 'Velocity']);
  }
  if (menu === 'Solutions') {
    return categoryFilmSpec(head || 'Solutions', 'solutions', href, ['Sovereign Cloud', 'SLA'], clean === '/solutions');
  }

  // Developers
  if (clean === '/sdks' || lower.includes('github.com/hanzoai')) {
    return categoryFilmSpec(head || 'Developers', 'developers', href, ['TS · Py · Go', 'Open Source'], clean === '/sdks');
  }
  if (lower.includes('status.hanzo.ai')) {
    return categoryFilmSpec('Infrastructure', 'cloud', href, ['Live Uptime', 'Edge'], true);
  }
  if (clean === '/gallery') {
    return modelSpec('koma', { kicker: 'Showcase', tags: ['Templates', 'Live Apps'] });
  }

  // Learn & University
  if (lower.includes('agentic-coding') || lower.includes('systems-engineering')) {
    return categoryFilmSpec('University', 'developers', href, ['Hands-on', 'Systems']);
  }
  if (lower.includes('reinforcement-learning')) {
    return categoryFilmSpec('University', 'research', href, ['RLHF & GRPO', 'Labs']);
  }
  if (lower.includes('ai-architect')) {
    return categoryFilmSpec('University', 'cloud', href, ['Sovereign VPC', 'Architecture']);
  }
  if (lower.includes('agentic-marketing')) {
    return modelSpec('iro', { kicker: 'University', tags: ['Creative Pipelines'] });
  }
  if (menu === 'Learn' || lower.includes('university') || clean === '/learn' || clean === '/support') {
    return categoryFilmSpec(head || 'Learn', 'learn', href, ['Courses', 'Guides'], clean === '/learn');
  }

  // Fallback by top-level menu
  const menuFallbacks: Record<string, [string, CategoryFilmSlug]> = {
    Company: ['Company', 'company'],
    Research: ['Research', 'research'],
    Products: ['Platform', 'cloud'],
    Solutions: ['Solutions', 'solutions'],
    Developers: ['Developers', 'developers'],
    Learn: ['Learn', 'learn'],
  };
  const [fbKick, fbFilm] = menuFallbacks[menu] || ['Hanzo AI', 'company'];
  return categoryFilmSpec(fbKick, fbFilm, href);
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
