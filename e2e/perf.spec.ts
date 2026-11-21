/**
 * How fast a page opens, cold. Run it alone (`pnpm e2e --project=perf --workers=1`): a load measured while other
 * work starves the machine says nothing about the page. Each page is opened three times in fresh contexts and the
 * fastest counts, so one slow moment of the network is not a finding; the page's server answer is held to its own
 * budget, apart from what the browser does with it.
 */
import { expect, test } from '@playwright/test'
import { timing, watch, settle, type Finding } from './probe'
import { sampled, VIEWPORTS, type Viewport } from './routes'

const FILTER = process.env.SWEEP_ROUTES ? new RegExp(process.env.SWEEP_ROUTES) : null
// The load event and the largest paint of a cold open, and the first byte of the page.
const BUDGET = { desktop: { load: 3000, lcp: 3000 }, mobile: { load: 4000, lcp: 4000 } } as const
const TTFB = 800

test.describe.configure({ mode: 'serial' })

for (const route of sampled.filter((r) => !FILTER || FILTER.test(r))) {
  for (const vp of Object.keys(VIEWPORTS) as Viewport[]) {
    test(`${route} ${vp}`, async ({ browser, baseURL }, info) => {
      test.setTimeout(120_000)
      const runs: { load: number; lcp: number; ttfb: number }[] = []
      for (let i = 0; i < 3; i++) {
        const context = await browser.newContext({ ...VIEWPORTS[vp], baseURL })
        const page = await context.newPage()
        await watch(context, page)
        await page.goto(route, { waitUntil: 'load', timeout: 45_000 }).catch(() => {})
        await page.waitForTimeout(1200)
        const t = await page.evaluate(timing)
        runs.push(t)
        await context.close()
      }
      const best = { load: Math.min(...runs.map((r) => r.load)), lcp: Math.min(...runs.map((r) => r.lcp)), ttfb: Math.min(...runs.map((r) => r.ttfb)) }
      const found: Finding[] = []
      const add = (detail: string) => found.push({ class: 'slow', route, viewport: vp, theme: '', detail })
      if (best.ttfb > TTFB) add(`first byte ${Math.round(best.ttfb)}ms over ${TTFB}ms`)
      if (best.load > BUDGET[vp].load) add(`load ${Math.round(best.load)}ms over ${BUDGET[vp].load}ms`)
      if (best.lcp > BUDGET[vp].lcp) add(`largest paint ${Math.round(best.lcp)}ms over ${BUDGET[vp].lcp}ms`)
      await info.attach('findings', { body: JSON.stringify(found), contentType: 'application/json' })
      expect(found.map((f) => f.detail)).toEqual([])
    })
  }
}
