'use client';
/* Bespoke live animated miniature product & developer workspaces for Hanzo's header mega-menu stage.
   33 distinct monochrome dark-glass UI scenes inside .x-nav-win.x-nav-win-dk (height: 114px) —
   replacing all static screenshots with authentic, multi-step live telemetry, terminals, diffs,
   DAGs, gauges, and API inspectors. */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mark } from '../ui';
import { LIVE_SCENE_IDS, type LiveSceneId } from '../../lib/visuals';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export { LIVE_SCENE_IDS, type LiveSceneId };

function useTicker(count: number, ms = 1750, reducedIdx = 0): number {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (typeof window !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIdx(reducedIdx % count);
      return;
    }
    const id = setInterval(() => setIdx((v) => (v + 1) % count), ms);
    return () => clearInterval(id);
  }, [count, ms, reducedIdx]);
  return idx;
}

function WinShell({
  title,
  chip,
  className = '',
  children,
}: {
  title: string;
  chip: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`x-nav-win x-nav-win-dk${className ? ' ' + className : ''}`}>
      <div className="x-nav-win-bar">
        <span className="x-nav-win-dots"><i /><i /><i /></span>
        <span className="x-nav-win-title">{title}</span>
        <span className="x-ndk-chip">
          <i className="x-ndk-dot" />
          <span>{chip}</span>
        </span>
      </div>
      {children}
    </div>
  );
}

/* 1. Hanzo Desktop native local workspace */
function DesktopStageWin({ title }: { title: string }) {
  const [phase, setPhase] = useState<{ sc: 0 | 1; step: 0 | 1 | 2 }>({ sc: 0, step: 0 });
  useEffect(() => {
    if (typeof window !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase({ sc: 0, step: 2 });
      return;
    }
    let alive = true;
    let t: ReturnType<typeof setTimeout> | undefined;
    const wait = (ms: number) => new Promise<void>((r) => { t = setTimeout(r, ms); });
    (async () => {
      let sc: 0 | 1 = 0;
      while (alive) {
        setPhase({ sc, step: 0 });
        await wait(520); if (!alive) return;
        setPhase({ sc, step: 1 });
        await wait(1150); if (!alive) return;
        setPhase({ sc, step: 2 });
        await wait(2700); if (!alive) return;
        sc = sc === 0 ? 1 : 0;
      }
    })();
    return () => { alive = false; clearTimeout(t); };
  }, []);

  const { sc, step } = phase;
  const done = step === 2;

  return (
    <WinShell title={title} chip={sc === 0 ? 'zen-6 · Local' : '3 agents · Local'}>
      <div className="x-ndk">
        <div className="x-ndk-side">
          <div className="x-ndk-head">
            <span className="x-ndk-mark"><Mark size={8} /></span>
            <span>{sc === 0 ? 'Agents' : 'Worktrees'}</span>
          </div>
          <div className="x-ndk-item">{sc === 0 ? '▾ gateway' : '▾ workspace'}</div>
          <div className={`x-ndk-item ind${step >= 1 ? ' on' : ''}`}>
            <span>{sc === 0 ? 'limit.go' : 'auth.go'}</span>
            {step >= 1 && <b>{sc === 0 ? '+12' : 'ok'}</b>}
          </div>
          <div className="x-ndk-item">{sc === 0 ? '▾ payments' : '▾ mcp'}</div>
          <div className="x-ndk-gpu">
            <span>{sc === 0 ? 'Metal · 84t/s' : '0ms · offline'}</span>
            <span className={`x-ndk-bars${done ? '' : ' run'}`}><i /><i /><i /></span>
          </div>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={sc}
            className="x-ndk-main"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.24, ease: EASE }}
          >
            <div className="x-ndk-prompt">
              <span className="x-ndk-you">▶</span>
              <span>{sc === 0 ? 'Add 100/min rate limit to /v1/pay' : 'Audit auth, routes & tests locally'}</span>
            </div>

            {sc === 0 ? (
              <div className="x-ndk-code">
                {step === 1 && <span className="x-ndk-sheen" />}
                <div className="x-ndk-ln"><em>1</em>func Limit(h Handler) {'{'}</div>
                <motion.div
                  className="x-ndk-ln add"
                  initial={{ opacity: 0.25, x: -4 }}
                  animate={{ opacity: step >= 1 ? 1 : 0.3, x: step >= 1 ? 0 : -4 }}
                  transition={{ duration: 0.28, ease: EASE }}
                >
                  <em>+</em>return rate.PerKey(100, h)
                  {step === 1 && <i className="x-ndk-cur" />}
                </motion.div>
                <div className="x-ndk-ln"><em>3</em>{'}'}</div>
              </div>
            ) : (
              <div className="x-ndk-lanes">
                {([
                  ['zen-6', 'gateway/auth.go', 0],
                  ['kai-1', 'policy bounds', 0.1],
                  ['mcp', 'git · 13 tools', 0.2],
                ] as const).map(([tag, sub, delay]) => (
                  <div className="x-ndk-lane" key={tag}>
                    <b>{tag}</b>
                    <span className="x-ndk-bar">
                      <motion.i
                        initial={{ scaleX: 0.18 }}
                        animate={{ scaleX: step === 0 ? 0.38 : step === 1 ? 0.78 : 1 }}
                        transition={{ duration: 0.45, ease: EASE, delay }}
                      />
                    </span>
                    <em>{done ? '✓ ok' : sub}</em>
                  </div>
                ))}
              </div>
            )}

            <div className="x-ndk-foot">
              <span className={`x-ndk-stat${done ? ' ok' : ''}`}>
                {done ? (
                  <>✓ {sc === 0 ? '14 tests pass' : 'All checks pass'}</>
                ) : (
                  <><i className="x-ndk-spin" />{sc === 0 ? 'Writing gateway/limit.go…' : 'Running 3 worktrees…'}</>
                )}
              </span>
              <span className="x-ndk-meta">{sc === 0 ? '18ms · local' : 'private · GPU'}</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </WinShell>
  );
}

/* 2. Hanzo Machines H100 rack & live hourly quote */
const MACHINE_TIERS = [
  { label: '1x H100', cards: 1, vram: '80 GB HBM3', rate: '$3.48', link: 'PCIe 5 · 7 GB/s', fill: 0.34 },
  { label: '2x H100', cards: 2, vram: '160 GB HBM3', rate: '$6.96', link: 'NVLink · 900 GB/s', fill: 0.66 },
  { label: '4x H100', cards: 4, vram: '320 GB HBM3', rate: '$13.92', link: 'NVLink · 3.6 TB/s', fill: 1.0 },
] as const;

function MachinesStageWin({ title }: { title: string }) {
  const idx = useTicker(MACHINE_TIERS.length, 1950, 2);
  const tier = MACHINE_TIERS[idx];

  return (
    <WinShell title={title} chip={tier.label} className="x-nav-win-mc">
      <div className="x-nmc">
        <div className="x-nmc-rack" aria-hidden="true">
          {[0, 1, 2, 3].map((i) => {
            const on = i < tier.cards;
            return (
              <div key={i} className={`x-nmc-blade${on ? ' on' : ''}`} style={{ transitionDelay: `${i * 55}ms` }}>
                <b>H100</b>
                <span className="x-nmc-fins"><i /><i /><i /><i /><i /><i /></span>
                <span className="x-nmc-led" />
              </div>
            );
          })}
        </div>

        <div className="x-nmc-main">
          <div className="x-nmc-tabs">
            {MACHINE_TIERS.map((t, i) => (
              <span key={t.label} className={`x-nmc-tab${i === idx ? ' on' : ''}`}>
                {t.label.split(' ')[0]}
              </span>
            ))}
            <em className="x-nmc-verb">POST /machines</em>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={tier.label}
              className="x-nmc-quote"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.22, ease: EASE }}
            >
              <div className="x-nmc-price">
                <strong>{tier.rate}</strong>
                <span>/ h</span>
                <em>{tier.vram}</em>
              </div>
              <div className="x-nmc-meter">
                <motion.i
                  initial={{ scaleX: 0.2 }}
                  animate={{ scaleX: tier.fill }}
                  transition={{ duration: 0.42, ease: EASE }}
                />
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="x-ndk-foot">
            <span className="x-ndk-stat ok">✓ Ready · {tier.cards * 80} GB</span>
            <span className="x-ndk-meta">{tier.link}</span>
          </div>
        </div>
      </div>
    </WinShell>
  );
}

/* 3–33. Bespoke Live Product & Developer Scenes */
export default function StageLiveWin({ scene, title }: { scene: LiveSceneId; title: string }) {
  const tick = useTicker(3, 1750, 2);

  if (scene === 'desktop') return <DesktopStageWin title={title} />;
  if (scene === 'machines') return <MachinesStageWin title={title} />;

  switch (scene) {
    case 'models-catalog': {
      const filters = ['All · 412', 'Frontier', 'Apache 2.0'] as const;
      const rows = [
        ['zen-7', '128k · MoE', '$0.40/M', 0.96],
        ['kai-1', 'Calibrated', '$0.25/M', 0.84],
        ['enso', 'Auto-route', '$0.18/M', 0.72],
      ] as const;
      return (
        <WinShell title={title} chip={filters[tick]}>
          <div className="x-nlw">
            <div className="x-nlw-tabs">
              {filters.map((f, i) => <span key={f} className={`x-nmc-tab${i === tick ? ' on' : ''}`}>{f}</span>)}
              <em className="x-nmc-verb">1 API key</em>
            </div>
            <div className="x-nlw-rows">
              {rows.map(([m, kind, cost, w], i) => (
                <div key={m} className={`x-nlw-row${i === tick ? ' hi' : ''}`}>
                  <b>{m}</b>
                  <span>{kind}</span>
                  <i className="x-nlw-mini"><u style={{ transform: `scaleX(${w})` }} /></i>
                  <em>{cost}</em>
                </div>
              ))}
            </div>
          </div>
        </WinShell>
      );
    }

    case 'llms-stream': {
      const steps = [
        { chip: 'thinking · 120ms', line1: '▾ Reasoning (4 steps verified)', line2: 'Synthesizing lock-free ring buffer…', tok: '94 tok/s' },
        { chip: 'streaming · zen-7', line1: '✓ Reasoning collapsed · 0 hallucinations', line2: 'pub fn push(&self, v: T) -> Result<()>', tok: '148 tok/s' },
        { chip: 'done · Apache 2.0', line1: '✓ Verified against cargo test', line2: 'Zero allocations · O(1) atomic CAS', tok: 'TTFT 34ms' },
      ][tick];
      return (
        <WinShell title={title} chip={steps.chip}>
          <div className="x-nlw">
            <div className="x-ndk-prompt">
              <span className="x-ndk-you">zen</span>
              <span>{steps.line1}</span>
            </div>
            <div className="x-ndk-code">
              <span className="x-ndk-sheen" key={tick} />
              <div className="x-ndk-ln add"><em>▸</em>{steps.line2}<i className="x-ndk-cur" /></div>
            </div>
            <div className="x-ndk-foot">
              <span className="x-ndk-stat ok">✓ 128k context</span>
              <span className="x-ndk-meta">{steps.tok}</span>
            </div>
          </div>
        </WinShell>
      );
    }

    case 'kai-decisions': {
      const probs = ([
        [['APPROVE', 0.96, '96.4%'], ['REVIEW', 0.09, '3.1%'], ['BLOCK', 0.03, '0.5%']],
        [['ESCALATE', 0.14, '6.2%'], ['APPROVE', 0.91, '92.8%'], ['BLOCK', 0.04, '1.0%']],
        [['APPROVE', 0.98, '98.7%'], ['REVIEW', 0.05, '1.1%'], ['BLOCK', 0.02, '0.2%']],
      ] as const)[tick];
      return (
        <WinShell title={title} chip="ECE 0.008">
          <div className="x-nlw">
            <div className="x-ndk-lanes">
              {probs.map(([lbl, v, pct]) => (
                <div className="x-ndk-lane" key={lbl}>
                  <b>{lbl.slice(0, 4)}</b>
                  <span className="x-ndk-bar"><motion.i animate={{ scaleX: v }} transition={{ duration: 0.4, ease: EASE }} /></span>
                  <em>{pct}</em>
                </div>
              ))}
            </div>
            <div className="x-ndk-foot">
              <span className="x-ndk-stat ok">✓ Decision: APPROVE</span>
              <span className="x-ndk-meta">p=0.987 · 9ms</span>
            </div>
          </div>
        </WinShell>
      );
    }

    case 'enso-routing': {
      const routes = [
        { q: 'Refactor distributed raft log', dst: 'zen-7', save: '-42% latency', idx: 0 },
        { q: 'Approve $18,400 wire policy?', dst: 'kai-1', save: '99.4% calib', idx: 1 },
        { q: 'Classify 50k support tickets', dst: 'zen-mini', save: '-74% cost', idx: 2 },
      ][tick];
      return (
        <WinShell title={title} chip={`→ ${routes.dst}`}>
          <div className="x-nlw">
            <div className="x-ndk-prompt">
              <span className="x-ndk-you">in</span>
              <span>{routes.q}</span>
            </div>
            <div className="x-nlw-dag">
              {['zen-7', 'kai-1', 'zen-mini'].map((m, i) => (
                <span key={m} className={`x-nlw-node${i === routes.idx ? ' on' : ''}`}>
                  <b>{m}</b>
                  <i>{i === routes.idx ? '● active' : 'standby'}</i>
                </span>
              ))}
            </div>
            <div className="x-ndk-foot">
              <span className="x-ndk-stat ok">✓ Routed in 1.4ms</span>
              <span className="x-ndk-meta">{routes.save}</span>
            </div>
          </div>
        </WinShell>
      );
    }

    case 'hanzo-app': {
      const stages = ['Prompting UI…', 'Wiring Postgres…', 'Live · hanzo.app'][tick];
      return (
        <WinShell title={title} chip={stages}>
          <div className="x-ndk">
            <div className="x-ndk-side">
              <div className="x-ndk-head"><span className="x-ndk-mark"><Mark size={8} /></span><span>Builder</span></div>
              <div className={`x-ndk-item${tick === 0 ? ' on' : ''}`}><span>page.tsx</span><b>UI</b></div>
              <div className={`x-ndk-item${tick === 1 ? ' on' : ''}`}><span>schema.sql</span><b>DB</b></div>
              <div className={`x-ndk-item${tick === 2 ? ' on' : ''}`}><span>edge SSL</span><b>✓</b></div>
            </div>
            <div className="x-ndk-main">
              <div className="x-nlw-cards">
                {[0, 1, 2].map((k) => (
                  <div key={k} className={`x-nlw-card${k <= tick ? ' on' : ''}`}>
                    <i /><u />
                  </div>
                ))}
              </div>
              <div className="x-ndk-foot">
                <span className="x-ndk-stat ok">✓ Preview live</span>
                <span className="x-ndk-meta">Full-stack · 1 click</span>
              </div>
            </div>
          </div>
        </WinShell>
      );
    }

    case 'hanzo-cli': {
      const cmds = [
        ['$ hanzo chat -m zen-7 "optimize sql"', '▸ Added composite index · 11.4x faster'],
        ['$ hanzo mcp serve --tools git,db', '▸ 18 MCP tools exposed on stdio'],
        ['$ hanzo deploy --prod', '✓ Live at https://api.acme.ai (380ms)'],
      ][tick];
      return (
        <WinShell title={title} chip="zsh · v2.14">
          <div className="x-nlw">
            <div className="x-ndk-code" style={{ height: 58 }}>
              <div className="x-ndk-ln add"><em>$</em>{cmds[0].slice(2)}</div>
              <div className="x-ndk-ln"><em>›</em>{cmds[1]}<i className="x-ndk-cur" /></div>
            </div>
            <div className="x-ndk-foot">
              <span className="x-ndk-stat ok">✓ Single binary</span>
              <span className="x-ndk-meta">macOS · Linux · Win</span>
            </div>
          </div>
        </WinShell>
      );
    }

    case 'hanzo-dev': {
      return (
        <WinShell title={title} chip={tick === 2 ? 'PR #418 ready' : '3 agents active'}>
          <div className="x-nlw">
            <div className="x-ndk-lanes">
              {([
                ['plan', 'spec & AST graph', tick >= 0 ? 1 : 0.4],
                ['edit', '+48 −12 across 4 files', tick >= 1 ? 1 : 0.35],
                ['test', 'pnpm test · 62 pass', tick >= 2 ? 1 : 0.25],
              ] as const).map(([k, desc, v]) => (
                <div className="x-ndk-lane" key={k}>
                  <b>{k}</b>
                  <span className="x-ndk-bar"><motion.i animate={{ scaleX: v }} transition={{ duration: 0.38, ease: EASE }} /></span>
                  <em>{v === 1 ? '✓' : desc.split(' ')[0]}</em>
                </div>
              ))}
            </div>
            <div className="x-ndk-foot">
              <span className="x-ndk-stat ok">✓ Git worktree isolated</span>
              <span className="x-ndk-meta">PR #418</span>
            </div>
          </div>
        </WinShell>
      );
    }

    case 'hanzo-mcp': {
      const calls = [
        { tool: 'postgres.query', arg: '{"sql":"SELECT count(*) FROM orgs"}', res: 'rows: 14,820 · 3ms' },
        { tool: 'github.create_pr', arg: '{"base":"main","head":"fix/kms"}', res: 'PR #902 opened · 18ms' },
        { tool: 'browser.snapshot', arg: '{"url":"https://hanzo.ai"}', res: 'DOM + a11y tree · 42ms' },
      ][tick];
      return (
        <WinShell title={title} chip="JSON-RPC 2.0">
          <div className="x-nlw">
            <div className="x-ndk-prompt">
              <span className="x-ndk-you">⚡</span>
              <span>tools/call · <b>{calls.tool}</b></span>
            </div>
            <div className="x-ndk-code">
              <div className="x-ndk-ln"><em>→</em>{calls.arg}</div>
              <div className="x-ndk-ln add"><em>←</em>{calls.res}</div>
            </div>
            <div className="x-ndk-foot">
              <span className="x-ndk-stat ok">✓ 260+ servers</span>
              <span className="x-ndk-meta">stdio · SSE</span>
            </div>
          </div>
        </WinShell>
      );
    }

    case 'hanzo-skills': {
      const steps = ['1. Audit Repo', '2. Patch AST', '3. Verify CI'] as const;
      return (
        <WinShell title={title} chip={`Step ${tick + 1}/3`}>
          <div className="x-nlw">
            <div className="x-nlw-dag">
              {steps.map((s, i) => (
                <span key={s} className={`x-nlw-node${i <= tick ? ' on' : ''}`}>
                  <b>{s}</b>
                  <i>{i < tick ? '✓ done' : i === tick ? '● running' : 'queued'}</i>
                </span>
              ))}
            </div>
            <div className="x-ndk-foot">
              <span className="x-ndk-stat ok">✓ SKILL.md verified</span>
              <span className="x-ndk-meta">Composable DAG</span>
            </div>
          </div>
        </WinShell>
      );
    }

    case 'platform-overview': {
      const bars = [0.45, 0.62, 0.58, 0.78, 0.71, 0.88, 0.94, 1.0];
      const rps = ['44.8k req/s', '48.2k req/s', '51.6k req/s'][tick];
      return (
        <WinShell title={title} chip="99.99% SLA">
          <div className="x-nlw">
            <div className="x-nlw-spark">
              {bars.map((h, i) => (
                <i
                  key={i}
                  style={{ height: `${Math.min(100, Math.round((h - ((i + tick) % 3) * 0.08) * 100))}%` }}
                  className={i >= 5 ? 'hi' : ''}
                />
              ))}
              <div className="x-nlw-kpi">
                <strong>{rps}</strong>
                <span>IAD · FRA · NRT</span>
              </div>
            </div>
            <div className="x-ndk-foot">
              <span className="x-ndk-stat ok">✓ All edges healthy</span>
              <span className="x-ndk-meta">p95 19ms</span>
            </div>
          </div>
        </WinShell>
      );
    }

    case 'platform-api': {
      const lines = [
        'POST /v1/chat/completions HTTP/2',
        'model: "enso-auto" · stream: true',
        '200 OK · data: {"delta":"Ready"}',
      ];
      return (
        <WinShell title={title} chip="200 OK · SSE">
          <div className="x-nlw">
            <div className="x-ndk-code" style={{ height: 58 }}>
              {lines.map((ln, i) => (
                <div key={ln} className={`x-ndk-ln${i === tick ? ' add' : ''}`}>
                  <em>{i + 1}</em>{ln}
                </div>
              ))}
            </div>
            <div className="x-ndk-foot">
              <span className="x-ndk-stat ok">✓ OpenAI compatible</span>
              <span className="x-ndk-meta">api.hanzo.ai/v1</span>
            </div>
          </div>
        </WinShell>
      );
    }

    case 'platform-playground': {
      return (
        <WinShell title={title} chip="A/B Compare">
          <div className="x-nlw">
            <div className="x-nlw-ab">
              <div className={`x-nlw-pane${tick !== 1 ? ' on' : ''}`}>
                <b>zen-7</b>
                <span>148 tok/s · 99.1%</span>
                <i className="x-ndk-bar"><u style={{ width: tick === 0 ? '68%' : '100%' }} /></i>
              </div>
              <div className={`x-nlw-pane${tick === 1 ? ' on' : ''}`}>
                <b>zen-6</b>
                <span>118 tok/s · 96.4%</span>
                <i className="x-ndk-bar"><u style={{ width: tick === 0 ? '54%' : '92%' }} /></i>
              </div>
            </div>
            <div className="x-ndk-foot">
              <span className="x-ndk-stat ok">temp 0.2 · top_p 0.95</span>
              <span className="x-ndk-meta">Side-by-side</span>
            </div>
          </div>
        </WinShell>
      );
    }

    case 'platform-gateway': {
      const states = [
        { badge: 'CACHE HIT · 0.8ms', sub: 'Semantic vector match · $0.00' },
        { badge: 'ROUTED · 14ms', sub: 'Primary us-east → zen-7' },
        { badge: 'FAILOVER · 0 drop', sub: 'Auto-rerouted eu-west in 3ms' },
      ][tick];
      return (
        <WinShell title={title} chip="Zero-drop">
          <div className="x-nlw">
            <div className="x-nmc-quote">
              <div className="x-nmc-price">
                <strong>{states.badge}</strong>
                <em>PII Guard ✓</em>
              </div>
              <div className="x-nlw-sub">{states.sub}</div>
            </div>
            <div className="x-ndk-foot">
              <span className="x-ndk-stat ok">✓ Rate-limit & DLP</span>
              <span className="x-ndk-meta">400+ upstreams</span>
            </div>
          </div>
        </WinShell>
      );
    }

    case 'platform-agents': {
      const bots = [
        ['pr-reviewer', 'Merged #814', '24/7'],
        ['sec-auditor', '0 CVEs found', 'cron 5m'],
        ['oncall-sre', 'p99 nominal', 'webhook'],
      ] as const;
      return (
        <WinShell title={title} chip="3 sandboxes">
          <div className="x-nlw">
            <div className="x-nlw-rows">
              {bots.map(([name, st, trig], i) => (
                <div key={name} className={`x-nlw-row${i === tick ? ' hi' : ''}`}>
                  <b>● {name}</b>
                  <span>{st}</span>
                  <em>{trig}</em>
                </div>
              ))}
            </div>
            <div className="x-ndk-foot">
              <span className="x-ndk-stat ok">✓ Firecracker microVM</span>
              <span className="x-ndk-meta">Persistent mem</span>
            </div>
          </div>
        </WinShell>
      );
    }

    case 'platform-base': {
      const tabs = ['Postgres', 'pgvector', 'S3 + Auth'] as const;
      const metrics = [
        ['orgs · 14.8k rows', 'RLS enforced · 0.9ms'],
        ['embeddings · 2.4M', 'HNSW recall 99.2% · 2ms'],
        ['kms-buckets · 4.1 TB', 'Zero-egress · JWT SSO'],
      ][tick];
      return (
        <WinShell title={title} chip={tabs[tick]}>
          <div className="x-nlw">
            <div className="x-nlw-tabs">
              {tabs.map((t, i) => <span key={t} className={`x-nmc-tab${i === tick ? ' on' : ''}`}>{t}</span>)}
            </div>
            <div className="x-ndk-code">
              <div className="x-ndk-ln add"><em>✓</em>{metrics[0]}</div>
              <div className="x-ndk-ln"><em>↳</em>{metrics[1]}</div>
            </div>
          </div>
        </WinShell>
      );
    }

    case 'install-cli': {
      const pct = [0.38, 0.76, 1.0][tick];
      const msg = ['Downloading darwin-arm64…', 'Verifying SHA-256 cosign…', '✓ Installed /usr/local/bin/hanzo'][tick];
      return (
        <WinShell title={title} chip="hanzo.sh">
          <div className="x-nlw">
            <div className="x-ndk-prompt">
              <span className="x-ndk-you">$</span>
              <span>curl -fsSL https://hanzo.sh | sh</span>
            </div>
            <div className="x-nmc-quote">
              <div className="x-nlw-sub">{msg}</div>
              <div className="x-nmc-meter"><motion.i animate={{ scaleX: pct }} transition={{ duration: 0.4, ease: EASE }} /></div>
            </div>
          </div>
        </WinShell>
      );
    }

    case 'install-extension': {
      const actions = ['Summarizing DOM (1,840 nodes)…', 'Extracted 12 pricing rows → JSON', '✓ Synced to Hanzo Workspace'][tick];
      return (
        <WinShell title={title} chip="Chrome · Brave">
          <div className="x-nlw">
            <div className="x-ndk-prompt">
              <span className="x-ndk-you">⌘E</span>
              <span>Active Tab · Side-panel Agent</span>
            </div>
            <div className="x-ndk-code">
              <div className="x-ndk-ln add"><em>▸</em>{actions}</div>
            </div>
            <div className="x-ndk-foot">
              <span className="x-ndk-stat ok">✓ Manifest V3</span>
              <span className="x-ndk-meta">Local privacy</span>
            </div>
          </div>
        </WinShell>
      );
    }

    case 'install-ide': {
      return (
        <WinShell title={title} chip="VS Code · JetBrains">
          <div className="x-nlw">
            <div className="x-nlw-tabs">
              <span className="x-nmc-tab on">router.ts</span>
              <span className="x-nmc-tab">agent.ts</span>
              <em className="x-nmc-verb">Tab to accept</em>
            </div>
            <div className="x-ndk-code">
              <div className="x-ndk-ln"><em>8</em>const res = await hz.route(req);</div>
              <div className="x-ndk-ln add">
                <em>+</em>{tick === 0 ? 'return res.stream(); // ghost' : 'return res.stream({ cache: true }); ✓'}
              </div>
            </div>
          </div>
        </WinShell>
      );
    }

    case 'install-downloads': {
      const builds = [
        ['macOS Universal', 'Hanzo-2.14-arm64.dmg', 'Signed ✓'],
        ['Linux x86_64 / ARM', 'hanzo-2.14.AppImage', 'SHA256 ✓'],
        ['Windows 11 x64', 'HanzoSetup-2.14.msi', 'EV Cert ✓'],
      ] as const;
      return (
        <WinShell title={title} chip="v2.14.0">
          <div className="x-nlw">
            <div className="x-nlw-rows">
              {builds.map(([os, pkg, sig], i) => (
                <div key={os} className={`x-nlw-row${i === tick ? ' hi' : ''}`}>
                  <b>{os.split(' ')[0]}</b>
                  <span>{pkg}</span>
                  <em>{sig}</em>
                </div>
              ))}
            </div>
            <div className="x-ndk-foot">
              <span className="x-ndk-stat ok">✓ Notarized builds</span>
              <span className="x-ndk-meta">Auto-update</span>
            </div>
          </div>
        </WinShell>
      );
    }

    case 'install-releases': {
      const rels = [
        ['v2.14.0', 'Zen-7 local quantization + MCP v2', 'Latest'],
        ['v2.13.4', 'Zero-copy worktree diff engine', 'Verified'],
        ['v2.13.0', 'Kai-1 policy hooks in CLI', 'Signed'],
      ] as const;
      return (
        <WinShell title={title} chip="cosign ✓">
          <div className="x-nlw">
            <div className="x-nlw-rows">
              {rels.map(([ver, note, tag], i) => (
                <div key={ver} className={`x-nlw-row${i === tick ? ' hi' : ''}`}>
                  <b>{ver}</b>
                  <span>{note}</span>
                  <em>{tag}</em>
                </div>
              ))}
            </div>
            <div className="x-ndk-foot">
              <span className="x-ndk-stat ok">✓ SLSA Level 3</span>
              <span className="x-ndk-meta">github.com/hanzoai</span>
            </div>
          </div>
        </WinShell>
      );
    }

    case 'sol-calculator': {
      const vols = [
        { tok: '50M tok/d', hz: '$420', legacy: '$1,480', save: 'Save 71%' },
        { tok: '250M tok/d', hz: '$1,890', legacy: '$6,900', save: 'Save 73%' },
        { tok: '1B tok/d', hz: '$6,400', legacy: '$24,500', save: 'Save 74%' },
      ][tick];
      return (
        <WinShell title={title} chip={vols.save}>
          <div className="x-nlw">
            <div className="x-nlw-tabs">
              <span className="x-nmc-tab on">{vols.tok}</span>
              <em className="x-nmc-verb">Enso routed</em>
            </div>
            <div className="x-nlw-ab">
              <div className="x-nlw-pane on">
                <b>Hanzo AI</b>
                <span>{vols.hz} / mo</span>
                <i className="x-ndk-bar"><u style={{ width: '32%' }} /></i>
              </div>
              <div className="x-nlw-pane">
                <b>Legacy API</b>
                <span>{vols.legacy} / mo</span>
                <i className="x-ndk-bar"><u style={{ width: '100%' }} /></i>
              </div>
            </div>
          </div>
        </WinShell>
      );
    }

    case 'dev-docs': {
      const hits = [
        ['Quickstart', '/docs/quickstart · 2 min setup'],
        ['Enso Router', '/docs/routing · Semantic policies'],
        ['MCP Servers', '/docs/mcp · 260+ tool connectors'],
      ] as const;
      return (
        <WinShell title={title} chip="⌘K Search">
          <div className="x-nlw">
            <div className="x-ndk-prompt">
              <span className="x-ndk-you">⌕</span>
              <span>Search architecture, SDKs & guides…</span>
            </div>
            <div className="x-nlw-rows">
              {hits.slice(0, 2).map(([h, sub], i) => (
                <div key={h} className={`x-nlw-row${i === tick % 2 ? ' hi' : ''}`}>
                  <b>{i === 0 ? hits[tick][0] : h}</b>
                  <span>{i === 0 ? hits[tick][1] : sub}</span>
                  <em>↵</em>
                </div>
              ))}
            </div>
          </div>
        </WinShell>
      );
    }

    case 'dev-openapi': {
      const eps = [
        ['POST', '/v1/chat/completions', '200 SSE'],
        ['POST', '/v1/kai/decide', '200 Typed'],
        ['POST', '/v1/machines/quote', '200 GPU'],
      ] as const;
      return (
        <WinShell title={title} chip="OpenAPI 3.1">
          <div className="x-nlw">
            <div className="x-nlw-rows">
              {eps.map(([verb, ep, code], i) => (
                <div key={ep} className={`x-nlw-row${i === tick ? ' hi' : ''}`}>
                  <b>{verb}</b>
                  <span>{ep}</span>
                  <em>{code}</em>
                </div>
              ))}
            </div>
            <div className="x-ndk-foot">
              <span className="x-ndk-stat ok">✓ Typed schemas</span>
              <span className="x-ndk-meta">cURL · TS · Py · Go</span>
            </div>
          </div>
        </WinShell>
      );
    }

    case 'dev-quickstart': {
      return (
        <WinShell title={title} chip="118ms · 200 OK">
          <div className="x-nlw">
            <div className="x-ndk-code" style={{ height: 58 }}>
              <div className="x-ndk-ln"><em>1</em>import Hanzo from &apos;@hanzo/ai&apos;;</div>
              <div className="x-ndk-ln"><em>2</em>const r = await hz.chat(&apos;Hello&apos;);</div>
              <div className="x-ndk-ln add">
                <em>✓</em>{tick === 0 ? 'Connecting edge…' : 'zen-7: "Ready in 118ms."'}
              </div>
            </div>
            <div className="x-ndk-foot">
              <span className="x-ndk-stat ok">✓ Under 2 minutes</span>
              <span className="x-ndk-meta">Zero config</span>
            </div>
          </div>
        </WinShell>
      );
    }

    case 'dev-hf': {
      const cards = [
        ['zenlm/zen-7-72b', 'BF16 · GGUF', 'Apache 2.0'],
        ['zenlm/zen-6-32b', 'safetensors', 'Apache 2.0'],
        ['zenlm/kai-1-14b', 'Calibrated', 'Apache 2.0'],
      ] as const;
      return (
        <WinShell title={title} chip="zenlm · HF">
          <div className="x-nlw">
            <div className="x-nlw-rows">
              {cards.map(([repo, fmt, lic], i) => (
                <div key={repo} className={`x-nlw-row${i === tick ? ' hi' : ''}`}>
                  <b>{repo.split('/')[1]}</b>
                  <span>{fmt}</span>
                  <em>{lic}</em>
                </div>
              ))}
            </div>
            <div className="x-ndk-foot">
              <span className="x-ndk-stat ok">✓ Open weights</span>
              <span className="x-ndk-meta">vLLM · mlx · llama.cpp</span>
            </div>
          </div>
        </WinShell>
      );
    }

    case 'dev-headless': {
      const steps = [
        'POST /v1/agents/signup (Ed25519 pubkey)',
        'Challenge solved in 4ms · zero CAPTCHA',
        'Issued hz_agent_live_9f2a… + $5.00 credit',
      ];
      return (
        <WinShell title={title} chip="Autonomous">
          <div className="x-nlw">
            <div className="x-ndk-code" style={{ height: 58 }}>
              {steps.map((s, i) => (
                <div key={s} className={`x-ndk-ln${i === tick ? ' add' : ''}`}>
                  <em>{i === 2 ? '✓' : '→'}</em>{s}
                </div>
              ))}
            </div>
            <div className="x-ndk-foot">
              <span className="x-ndk-stat ok">✓ $5 free credit</span>
              <span className="x-ndk-meta">No human gate</span>
            </div>
          </div>
        </WinShell>
      );
    }

    case 'dev-apikeys': {
      const keys = [
        ['hz_live_prod…8a1', 'chat · kai', '$142 / $500'],
        ['hz_live_ci…3f9', 'evals-only', '$18 / $100'],
        ['hz_live_dev…0c4', 'local-mcp', '$4 / $50'],
      ] as const;
      return (
        <WinShell title={title} chip="RBAC · KMS">
          <div className="x-nlw">
            <div className="x-nlw-rows">
              {keys.map(([k, scope, cap], i) => (
                <div key={k} className={`x-nlw-row${i === tick ? ' hi' : ''}`}>
                  <b>{k}</b>
                  <span>{scope}</span>
                  <em>{cap}</em>
                </div>
              ))}
            </div>
            <div className="x-ndk-foot">
              <span className="x-ndk-stat ok">✓ Hard spend caps</span>
              <span className="x-ndk-meta">Per-org scopes</span>
            </div>
          </div>
        </WinShell>
      );
    }

    case 'dev-accelerate': {
      const tools = [
        { name: 'Claude Code', speed: '3.2× tok/s', save: '-58% cost' },
        { name: 'OpenAI Codex', speed: '2.9× tok/s', save: '0-ms cache' },
        { name: 'Cursor IDE', speed: '3.6× tok/s', save: '400+ models' },
      ][tick];
      return (
        <WinShell title={title} chip={tools.speed}>
          <div className="x-nlw">
            <div className="x-nlw-tabs">
              {['Claude', 'Codex', 'Cursor'].map((t, i) => (
                <span key={t} className={`x-nmc-tab${i === tick ? ' on' : ''}`}>{t}</span>
              ))}
              <em className="x-nmc-verb">{tools.save}</em>
            </div>
            <div className="x-ndk-code">
              <div className="x-ndk-ln add"><em>✓</em>BASE_URL=https://api.hanzo.ai/v1</div>
            </div>
            <div className="x-ndk-foot">
              <span className="x-ndk-stat ok">✓ Drop-in gateway</span>
              <span className="x-ndk-meta">{tools.name}</span>
            </div>
          </div>
        </WinShell>
      );
    }

    case 'dev-examples': {
      const demos = [
        ['Agentic Commerce', 'Next.js + Kai + Stripe'],
        ['Multi-Repo Coder', 'Hanzo Dev + MCP Git'],
        ['Realtime Voice Concierge', 'Koe + Enso WebRTC'],
      ][tick];
      return (
        <WinShell title={title} chip={`Demo ${tick + 1}/3`}>
          <div className="x-nlw">
            <div className="x-nmc-quote">
              <div className="x-nmc-price">
                <strong>{demos[0]}</strong>
                <em>Clone ↗</em>
              </div>
              <div className="x-nlw-sub">{demos[1]}</div>
            </div>
            <div className="x-ndk-foot">
              <span className="x-ndk-stat ok">✓ 1-click deploy</span>
              <span className="x-ndk-meta">40+ templates</span>
            </div>
          </div>
        </WinShell>
      );
    }

    case 'dev-github': {
      const repos = ['hanzoai/engine · C++/CUDA', 'hanzoai/mcp · 260+ tools', 'hanzoai/ui · React/TS'][tick];
      return (
        <WinShell title={title} chip="1,700+ repos">
          <div className="x-nlw">
            <div className="x-nlw-heat" aria-hidden="true">
              {Array.from({ length: 24 }, (_, i) => {
                const lv = ((i * 7 + tick * 5) % 5);
                return <i key={i} className={`lv${lv}`} />;
              })}
            </div>
            <div className="x-ndk-foot">
              <span className="x-ndk-stat ok">★ {repos}</span>
              <span className="x-ndk-meta">Apache 2.0</span>
            </div>
          </div>
        </WinShell>
      );
    }

    case 'dev-status': {
      const edges = [
        'us-east 11ms · nominal',
        'eu-central 14ms · nominal',
        'ap-northeast 18ms · nominal',
      ][tick];
      return (
        <WinShell title={title} chip="99.996% 90d">
          <div className="x-nlw">
            <div className="x-nlw-uptime" aria-hidden="true">
              {Array.from({ length: 22 }, (_, i) => (
                <i key={i} className={i === (19 + tick) % 22 ? 'pulse' : ''} />
              ))}
            </div>
            <div className="x-ndk-foot">
              <span className="x-ndk-stat ok">✓ Operational</span>
              <span className="x-ndk-meta">{edges}</span>
            </div>
          </div>
        </WinShell>
      );
    }
  }
}
