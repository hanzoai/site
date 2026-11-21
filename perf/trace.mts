// Where the main thread spends the time before first paint: a Chromium trace of a cold load, summarised.
import { chromium, devices } from 'playwright'
import { readFileSync } from 'node:fs'

const URL_ = process.env.URL_ ?? 'https://hanzo.ai/'
const PROFILES = {
  broadband: { mobile: false, latency: 10, down: (100 * 1024 * 1024) / 8, up: (20 * 1024 * 1024) / 8, cpu: 1 },
  fast4g: { mobile: true, latency: 70, down: (9 * 1024 * 1024) / 8, up: (1.5 * 1024 * 1024) / 8, cpu: 4 },
} as const
const browser = await chromium.launch({ args: ['--no-sandbox'] })
for (const [name, p] of Object.entries(PROFILES)) {
  const ctx = await browser.newContext(p.mobile ? { ...devices['iPhone 14'], serviceWorkers: 'block' } : { viewport: { width: 1440, height: 900 }, serviceWorkers: 'block' })
  const page = await ctx.newPage()
  const cdp = await ctx.newCDPSession(page)
  await cdp.send('Network.enable')
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: p.latency, downloadThroughput: p.down, uploadThroughput: p.up })
  if (p.cpu > 1) await cdp.send('Emulation.setCPUThrottlingRate', { rate: p.cpu })
  const file = `trace-${name}.json`
  await browser.startTracing(page, { path: file, categories: ['devtools.timeline', 'v8.execute', 'blink.user_timing', 'loading', 'disabled-by-default-devtools.timeline'] })
  await page.goto(URL_, { waitUntil: 'load', timeout: 60000 }).catch(() => {})
  await page.waitForTimeout(2500)
  await browser.stopTracing()
  const events: any[] = JSON.parse(readFileSync(file, 'utf8')).traceEvents
  const main = events.find((e) => e.name === 'thread_name' && e.args?.name === 'CrRendererMain')
  const nav = events.find((e) => e.name === 'navigationStart' && e.pid === main?.pid)
  const fcp = events.find((e) => e.name === 'firstContentfulPaint' && e.pid === main?.pid)
  const t0 = nav?.ts ?? 0, t1 = fcp?.ts ?? 0
  const inWin = events.filter((e) => e.ph === 'X' && e.pid === main?.pid && e.tid === main?.tid && e.ts >= t0 && e.ts + e.dur <= t1 + 1000)
  const by: Record<string, { n: number; ms: number }> = {}
  for (const e of inWin) { const k = e.name; (by[k] ??= { n: 0, ms: 0 }).n++; by[k].ms += e.dur / 1000 }
  console.log(`\n### ${name}: navigationStart to first contentful paint = ${((t1 - t0) / 1000).toFixed(0)} ms (main-thread complete events inside the window; nested, so not additive)`)
  console.log('| event | n | total ms |'); console.log('|---|---|---|')
  for (const [k, v] of Object.entries(by).sort((a, b) => b[1].ms - a[1].ms).slice(0, 14)) console.log(`| ${k} | ${v.n} | ${v.ms.toFixed(0)} |`)
  const top = (name2: string) => inWin.filter((e) => e.name === name2 && e.dur > 8000).sort((a, b) => b.dur - a.dur).slice(0, 6).map((e) => `${(e.dur / 1000).toFixed(0)}ms ${(e.args?.data?.url ?? e.args?.data?.fileName ?? '').toString().replace(/^https:\/\/hanzo\.ai/, '').slice(0, 70)}`)
  for (const k of ['EvaluateScript', 'v8.compile', 'ParseHTML', 'ParseAuthorStyleSheet', 'UpdateLayoutTree', 'Layout']) { const l = top(k); if (l.length) console.log(`- ${k}: ${l.join(' | ')}`) }
  // when did resources arrive relative to FCP: the last blocking CSS/script finish
  const res = events.filter((e) => e.name === 'ResourceFinish' && e.pid === main?.pid && e.ts <= t1)
  console.log(`- resources finished before FCP: ${res.length}`)
  await ctx.close()
}
await browser.close()
