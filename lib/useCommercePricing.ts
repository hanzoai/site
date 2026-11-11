'use client';
/* Live client-side pricing & model merchandising reader backed by https://commerce.hanzo.ai.
   Seeds synchronously from content/live/_pricing.json and content/live/_models.json so SSR / static HTML renders
   complete figures with zero layout shift, then re-fetches commerce.hanzo.ai on mount so any edit in admin.hanzo.ai
   (Plans or Models) updates hanzo.ai immediately without rebuilding the site. */

import { useEffect, useState } from 'react';
import SNAP_PRICING from '../content/live/_pricing.json' with { type: 'json' };
import SNAP_MODELS from '../content/live/_models.json' with { type: 'json' };
import { PLANS_URL, shapePlan, readModels } from './liveSources.ts';
import { derivePlans } from './plans.ts';

const fmtRate = (n, zeroWord = 'Free') => {
  if (n == null || Number.isNaN(n)) return '—';
  if (n === 0) return zeroWord;
  const clean = +(+n).toPrecision(10);
  const str = clean >= 1 && Number.isInteger(clean * 10) && !Number.isInteger(clean) ? clean.toFixed(2) : String(clean);
  return `$${str} / MTok`;
};

const fmtCtx = (ctx) => {
  if (!ctx || ctx <= 0) return null;
  if (ctx >= 1_000_000) return `${Math.round(ctx / 1_000_000)}M ctx`;
  return `${Math.round(ctx / 1024)}K ctx`;
};

export function buildModelGroups(modelsSnap = SNAP_MODELS) {
  const byId = Object.fromEntries((modelsSnap.models ?? []).map((m) => [m.id, m]));
  const catById = Object.fromEntries((modelsSnap.catalog ?? []).map((c) => [c.id, c]));

  const rateTuple = (id, { zeroOut = 'Free' } = {}) => {
    const m = byId[id];
    const c = catById[id];
    const p = m?.pricing;
    const inp = p?.input_per_million ?? c?.pricing?.input ?? null;
    const out = p?.output_per_million ?? c?.pricing?.output ?? null;
    const cw = p?.rates?.input_cache_write != null ? Number(p.rates.input_cache_write) * 1e6 : (c?.pricing?.cacheWrite ?? (inp != null ? inp * 1.25 : null));
    const cr = p?.rates?.input_cache_read != null ? Number(p.rates.input_cache_read) * 1e6 : (c?.pricing?.cacheRead ?? (inp != null ? inp * 0.1 : null));
    return [fmtRate(inp), fmtRate(out, zeroOut), fmtRate(cw), fmtRate(cr)];
  };

  const nameOf = (id, fallback) => catById[id]?.fullName || byId[id]?.name || fallback;
  const descOf = (id, fallback) => catById[id]?.description || byId[id]?.description || fallback;
  const ctxTag = (id, fallbackCtx) => fmtCtx(byId[id]?.context_window || catById[id]?.context || fallbackCtx);
  const orderOf = (id, fallback) => catById[id]?.order ?? fallback;

  const ensoDefs = [
    {
      id: 'enso-flash',
      fallbackOrder: 1,
      fallbackName: 'Enso Flash',
      fallbackCtx: 262144,
      fallbackDesc: 'Fast, economical Enso model for high-volume, low-latency everyday chat, coding, and tool calls.',
      chips: ['262K context', 'Low latency'],
    },
    {
      id: 'enso-pro',
      fallbackOrder: 2,
      fallbackName: 'Enso Pro',
      fallbackCtx: 1000000,
      fallbackDesc: 'Balanced frontier reasoning and coding model for production agents, tool use, and repo-scale engineering.',
      chips: ['1M context window', 'Frontier coding'],
    },
    {
      id: 'enso-max',
      fallbackOrder: 3,
      fallbackName: 'Enso Max',
      fallbackCtx: 1000000,
      fallbackDesc: 'Extended frontier reasoning model for deep multi-step architecture, research, and autonomous coding loops.',
      chips: ['1M context window', 'Deep reasoning'],
    },
    {
      id: 'enso-ultra',
      fallbackOrder: 4,
      fallbackName: 'Enso Ultra',
      fallbackCtx: 1000000,
      fallbackDesc: 'Adaptive fan-out frontier model — probes a task-appropriate model, escalates to a top-K panel when needed, then verifies and selects the best answer.',
      chips: ['1M context window', 'Adaptive fan-out'],
    },
  ].sort((a, b) => orderOf(a.id, a.fallbackOrder) - orderOf(b.id, b.fallbackOrder));

  const ensoRows = ensoDefs.map((d) => {
    const ctx = ctxTag(d.id, d.fallbackCtx);
    return {
      id: d.id,
      name: nameOf(d.id, d.fallbackName),
      // Model tags ONLY show callable model ID + technical context/endpoint — NEVER subscription plan badges.
      tags: [d.id, ...(ctx ? [ctx] : [])],
      d: descOf(d.id, d.fallbackDesc),
      chips: catById[d.id]?.features?.length ? catById[d.id].features : d.chips,
      price: rateTuple(d.id),
      cta: `Start Using ${d.id}`,
    };
  });

  const kaiSpecs = catById.kai?.specs
    ? [
        ...(catById.kai.specs.params ? [['Parameters:', catById.kai.specs.params]] : []),
        ...(catById.kai.specs.arch ? [['Architecture:', catById.kai.specs.arch]] : []),
      ]
    : [['Parameters:', '322.1M encoder, 60.2M yes/no reader'], ['Architecture:', 'Encoder (mmBERT-base, 22 layers × 768)']];

  const kaiRows = [
    {
      id: 'kai',
      name: nameOf('kai', 'Kai'),
      tags: ['kai', '/v1/decisions'],
      d: descOf('kai', 'Native encoder decision model at POST /v1/decisions — calibrated probability on every option with zero output tokens.'),
      chips: catById.kai?.features?.length ? catById.kai.features : ['choice, score & yes/no', 'Calibrated probabilities', '0 output tokens'],
      price: rateTuple('kai', { zeroOut: 'Free' }),
      cta: 'Start Using kai',
      spec: kaiSpecs,
      end: byId.kai?.endpoint || '/v1/decisions',
    },
    {
      id: 'zen6-flash-decisions',
      name: 'Kai · Zen 6 Flash',
      tags: ['zen6-flash', '/v1/decisions'],
      d: 'Fast generative structured decisions with rationale at POST /v1/decisions under strict JSON schema.',
      chips: ['Structured decisions', 'Low latency'],
      price: rateTuple('zen6-flash'),
      cta: 'Start Using zen6-flash',
      end: '/v1/decisions',
    },
    {
      id: 'zen6-decisions',
      name: 'Kai · Zen 6',
      tags: ['zen6', '/v1/decisions'],
      d: 'Frontier generative structured decisions for nuanced multi-factor judgment at POST /v1/decisions.',
      chips: ['Structured decisions', 'Multi-factor'],
      price: rateTuple('zen6'),
      cta: 'Start Using zen6',
      end: '/v1/decisions',
    },
  ];

  const zenDefs = [
    {
      id: 'zen6-flash',
      fallbackName: 'Zen 6 Flash',
      fallbackCtx: 1048576,
      fallbackDesc: 'Low-latency Zen 6 chat and routing model for high-throughput interactive and background agent loops.',
      chips: ['1M context', 'Sub-100ms TTFT'],
    },
    {
      id: 'zen6',
      fallbackName: 'Zen 6',
      fallbackCtx: 1048576,
      fallbackDesc: 'General-purpose Zen 6 frontier model for reasoning, synthesis, and multimodal tool use.',
      chips: ['1M context', 'Frontier MoE'],
    },
    {
      id: 'zen6-coder',
      fallbackName: 'Zen 6 Coder',
      fallbackCtx: 1048576,
      fallbackDesc: 'Code-specialized Zen 6 model tuned for repository-scale code generation, debugging, and agentic refactoring.',
      chips: ['1M context', 'Code-specialized'],
    },
    {
      id: 'zen6-max',
      fallbackName: 'Zen 6 Max',
      fallbackCtx: 1048576,
      fallbackDesc: 'Maximum-compute Zen 6 flagship for deep scientific, mathematical, and long-horizon autonomous reasoning.',
      chips: ['1M context', 'Maximum compute'],
    },
  ];

  const zenRows = [
    ...zenDefs.map((d) => {
      const ctx = ctxTag(d.id, d.fallbackCtx);
      return {
        id: d.id,
        name: d.fallbackName,
        tags: [d.id, ...(ctx ? [ctx] : [])],
        d: d.fallbackDesc,
        chips: d.chips,
        price: rateTuple(d.id),
        cta: `Start Using ${d.id}`,
      };
    }),
    {
      id: 'zen5',
      name: 'Zen 5 Open Weights',
      tags: ['zen5', 'apache-2.0'],
      d: 'Zen 5, Zen 5 Coder (80B MoE), Zen 5 Mini (230B MoE), Zen 5 Pro (284B MoE), Zen VL, and Zen Guard — free open weights.',
      chips: ['Open weights', 'Apache-2.0'],
      price: ['Free', 'Free', 'Free', 'Free'],
      cta: 'Explore Zen 5',
      to: '/zen/models',
    },
    {
      id: 'zen-embedding',
      name: nameOf('zen-embedding', 'Zen Embedding'),
      tags: ['zen-embedding', '/v1/embeddings'],
      d: descOf('zen-embedding', 'High-throughput dense text embeddings via /v1/embeddings for semantic search, retrieval, and clustering.'),
      chips: [ctxTag('zen-embedding', 32768) || '32K ctx', '/v1/embeddings'],
      price: [rateTuple('zen-embedding')[0], '—', rateTuple('zen-embedding')[2], rateTuple('zen-embedding')[3]],
      cta: 'Start Using zen-embedding',
    },
  ];

  return [
    {
      h: 'Hanzo Enso',
      id: 'xpr-enso-h',
      d: 'Flagship frontier models — Enso Flash, Enso Pro, Enso Max, and Enso Ultra. Metered per million tokens via one API key.',
      link: ['Explore Enso', '/enso'],
      rows: ensoRows,
    },
    {
      h: 'Hanzo Kai',
      id: 'xpr-kai-h',
      d: 'Calibrated discrete decision models — typed choice, score, and yes/no probabilities via /v1/decisions.',
      link: ['Explore Kai', '/kai'],
      rows: kaiRows,
    },
    {
      h: 'Hanzo Zen',
      id: 'xpr-zen-h',
      d: 'Sovereign frontier & open-weight models across chat, coding, vision, safety, and embeddings.',
      link: ['Explore Zen', '/zen/models'],
      rows: zenRows,
      afterNote: 'All Zen LLMs available via OpenAI-compatible API at ',
      afterCode: 'api.hanzo.ai/v1/chat/completions',
    },
  ];
}

export function buildCompareDiff(plans) {
  const order = [plans.free, plans.go, plans.pro, plans.dev, plans.max, plans.ultra];
  const usageLine = (p, fallback) => p.features.find((f) => /usage/i.test(f)) || fallback;
  const limitLine = (p, fallback) => {
    const raw = p.features.find((f) => /higher limits|rate limits/i.test(f));
    if (!raw) return fallback;
    const hasPrio = p.features.some((f) => /priority queue/i.test(f));
    const short = raw.replace(/\s+every 5 hours and every day/i, ' than Go');
    return hasPrio && !/priority/i.test(short) ? `${short} & priority queue` : short;
  };
  return [
    [
      'Usage',
      [
        'Free daily requests & Kai decisions',
        usageLine(order[1], 'Usage included on every model'),
        usageLine(order[2], '3x more usage than Go'),
        usageLine(order[3], '5x more usage than Go'),
        usageLine(order[4], '15x more usage than Go'),
        usageLine(order[5], 'Unlimited usage across every model'),
      ],
    ],
    [
      'Limits',
      [
        'Standard daily pool',
        'Standard paid limits',
        limitLine(order[2], '3x higher limits than Go'),
        limitLine(order[3], '5x higher limits than Go'),
        limitLine(order[4], '15x higher limits than Go'),
        limitLine(order[5], '25x higher limits than Go & priority queue'),
      ],
    ],
    ['Hanzo Bot', order.map((p) => (p.hasBot ? 'Unlimited bots (hanzo.bot)' : null))],
    ['Hanzo Team', order.map((p) => (p.hasTeam ? 'Included (hanzo.team)' : null))],
    [
      'Models',
      order.map((p, i) =>
        i === 0 ? 'Enso Auto & Kai' : p.earlyAccess ? 'Every model + early access' : 'Every model (Enso, Kai, Zen)',
      ),
    ],
    [
      'Dev, CLI & MCP',
      order.map((_, i) => (i === 0 ? 'Web & desktop chat' : 'Hanzo Dev, CLI, MCP & background agents')),
    ],
    [
      'Engine & Training',
      order.map((p, i) => (i === 0 ? null : p.hasEngine ? 'Custom training & Hanzo Engine' : 'Daily automations')),
    ],
    [
      'Support',
      order.map((p, i) =>
        i === 0
          ? 'Community support'
          : i === 1
            ? 'Priority inference & support'
            : p.features.some((f) => /priority queue/i.test(f))
              ? 'Dedicated support & priority queue'
              : 'Dedicated support',
      ),
    ],
  ];
}

function buildState(rawPlans, modelsSnap) {
  const derived = derivePlans(rawPlans);
  return {
    ...derived,
    rawPlans,
    groups: buildModelGroups(modelsSnap),
    compareDiff: buildCompareDiff(derived.plans),
  };
}

const INITIAL = buildState(SNAP_PRICING.plans, SNAP_MODELS);

let livePromise = null;
const getJson = async (url) => {
  const r = await fetch(url, { credentials: 'omit', signal: AbortSignal.timeout(8000) });
  if (!r.ok) throw new Error(`${r.status} from ${url}`);
  return r.json();
};

const fetchLive = () =>
  (livePromise ??= Promise.all([
    getJson(PLANS_URL).then((list) => {
      if (!Array.isArray(list)) throw new Error('invalid plans');
      const map = { ...SNAP_PRICING.plans };
      for (const p of list) {
        if (p?.slug && Number.isFinite(p.price)) map[p.slug] = shapePlan(p);
      }
      return map;
    }),
    readModels(getJson).catch(() => SNAP_MODELS),
  ]).then(([rawPlans, modelsSnap]) => buildState(rawPlans, modelsSnap)));

export default function useCommercePricing() {
  const [state, setState] = useState(INITIAL);
  useEffect(() => {
    let active = true;
    fetchLive().then(
      (fresh) => {
        if (active) setState(fresh);
      },
      () => {},
    );
    return () => {
      active = false;
    };
  }, []);
  return state;
}
