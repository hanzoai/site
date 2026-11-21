// Two builds of the site, served side by side from disk, loaded cold and alternately under the same network and CPU:
// when the page paints and how long the main thread works before it. Usage: node cmp.mts <base out/> <new out/>
import { chromium, devices } from 'playwright'
import { readFileSync, mkdtempSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'

const URL_ = process.argv[2] ?? 'https://hanzo.ai/'
const N = Number(process.env.RUNS ?? 9)
const TYPES: Record<string, string> = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.avif': 'image/avif', '.mp4': 'video/mp4' }
const squeezed = new Map<string, Buffer>()

const PROFILES = {
  broadband: { mobile: false, latency: 10, down: (100 * 1024 * 1024) / 8, up: (20 * 1024 * 1024) / 8, cpu: 1 },
  fast4g: { mobile: true, latency: 70, down: (9 * 1024 * 1024) / 8, up: (1.5 * 1024 * 1024) / 8, cpu: 4 },
} as const
const browser = await chromium.launch({ args: ['--no-sandbox'] })
const dir = mkdtempSync(join(tmpdir(), 'trace-'))
const med = (a: number[]) => [...a].sort((x, y) => x - y)[Math.floor(a.length / 2)]

for (const [profile, p] of Object.entries(PROFILES)) {
  const rows: Record<string, Record<string, number[]>> = { live: {} }
  for (let i = 0; i < N + 1; i++) {
    for (const name of ['live'] as const) {
      const ctx = await browser.newContext(p.mobile ? { ...devices['iPhone 14'], serviceWorkers: 'block' } : { viewport: { width: 1440, height: 900 }, serviceWorkers: 'block' })
      await ctx.addInitScript(`(() => { window.__m = { lcp: 0 }; new PerformanceObserver(l => { for (const e of l.getEntries()) window.__m.lcp = e.startTime }).observe({ type: 'largest-contentful-paint', buffered: true }) })()`)
      const page = await ctx.newPage()
            const cdp = await ctx.newCDPSession(page)
      await cdp.send('Network.enable')
      await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: p.latency, downloadThroughput: p.down, uploadThroughput: p.up })
      if (p.cpu > 1) await cdp.send('Emulation.setCPUThrottlingRate', { rate: p.cpu })
      const file = join(dir, `${name}-${profile}-${i}.json`)
      await browser.startTracing(page, { path: file, categories: ['devtools.timeline', 'loading'] })
      await page.goto(URL_, { waitUntil: 'load', timeout: 60000 }).catch(() => {})
      await page.waitForTimeout(1500)
      const lcp = await page.evaluate(() => (window as any).__m.lcp).catch(() => 0)
      await browser.stopTracing()
      await ctx.close()
      if (i === 0) continue // the first pair warms the disk cache and the JIT of this process
      const events: any[] = JSON.parse(readFileSync(file, 'utf8')).traceEvents
      const main = events.find((e) => e.name === 'thread_name' && e.args?.name === 'CrRendererMain')
      const nav = events.find((e) => e.name === 'navigationStart' && e.pid === main?.pid)
      const fcp = events.find((e) => e.name === 'firstContentfulPaint' && e.pid === main?.pid)
      if (!main || !nav || !fcp) continue
      const t0 = nav.ts, t1 = fcp.ts
      const inWin = events.filter((e) => e.ph === 'X' && e.pid === main.pid && e.tid === main.tid && e.ts >= t0 && e.ts + e.dur <= t1 + 1000)
      const sum = (n: string) => inWin.filter((e) => e.name === n).reduce((a, e) => a + e.dur / 1000, 0)
      const m = rows[name]
      ;(m.fcp ??= []).push((t1 - t0) / 1000)
      ;(m.lcp ??= []).push(lcp)
      ;(m.busy ??= []).push(sum('RunTask'))
      ;(m.layout ??= []).push(sum('Layout'))
      ;(m.style ??= []).push(sum('UpdateLayoutTree'))
      ;(m.parse ??= []).push(sum('ParseHTML'))
    }
  }
  console.log(`\n### ${URL_} ${profile} (${N} cold loads; ms; median [min])`)
  console.log('| metric | value |'); console.log('|---|---|')
  for (const k of ['fcp', 'lcp', 'busy', 'layout', 'style', 'parse']) {
    const a = rows.live[k] ?? []
    if (!a.length) continue
    console.log(`| ${k} | ${med(a).toFixed(0)} [${Math.min(...a).toFixed(0)}] |`)
  }
}
await browser.close()
