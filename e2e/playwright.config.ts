import { defineConfig } from '@playwright/test'
import { join } from 'node:path'

const OUT = process.env.SWEEP_OUT ?? join(import.meta.dirname, '.out')

/**
 * One harness, four projects: `pages` is the sweep of every route (sweep.spec.ts), `edge` holds the address
 * variants (edge.spec.ts), `perf` times a cold open of each page (perf.spec.ts, run alone with one worker), `links` resolves every link `pages` met (links.spec.ts, after it). Modest by default:
 * four workers, because it runs against the live site.
 */
export default defineConfig({
  testDir: '.',
  outputDir: join(OUT, 'results'),
  workers: Number(process.env.SWEEP_WORKERS ?? 4),
  retries: 0,
  timeout: 120_000,
  reporter: [['list', { printSteps: false }], [join(import.meta.dirname, 'report.ts'), { out: OUT }]],
  use: { baseURL: process.env.BASE_URL ?? 'https://hanzo.ai', ignoreHTTPSErrors: false, actionTimeout: 10_000 },
  projects: [
    { name: 'edge', testMatch: 'edge.spec.ts' },
    { name: 'pages', testMatch: 'sweep.spec.ts', use: { browserName: 'chromium' } },
    { name: 'perf', testMatch: 'perf.spec.ts', dependencies: ['links'], use: { browserName: 'chromium' } },
    { name: 'links', testMatch: 'links.spec.ts', dependencies: ['pages'] },
  ],
})
