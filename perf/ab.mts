// The home before and after, on the same runner in the same minute: the old HTML (its assets are still served by their hashed names)
// and today's, each handed to the page for https://hanzo.ai/, loaded cold and alternately under the same network and CPU.
import { chromium, devices } from 'playwright'
import { readFileSync, mkdtempSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'

const N = Number(process.env.RUNS ?? 9)
const PROFILES = {
  broadband: { mobile: false, latency: 10, down: (100 * 1024 * 1024) / 8, up: (20 * 1024 * 1024) / 8, cpu: 1 },
  fast4g: { mobile: true, latency: 70, down: (9 * 1024 * 1024) / 8, up: (1.5 * 1024 * 1024) / 8, cpu: 4 },
} as const
const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
const browser = await chromium.launch({ args: ['--no-sandbox'] })
const dir = mkdtempSync(join(tmpdir(), 'trace-'))
const med = (a: number[]) => [...a].sort((x, y) => x - y)[Math.floor(a.length / 2)]
const old = readFileSync('old.html', 'utf8')

for (const [profile, p] of Object.entries(PROFILES)) {
  const fresh = await (await fetch('https://hanzo.ai/', { headers: p.mobile ? { 'user-agent': UA } : {} })).text()
  const html = { before: old, after: fresh, 'hero only': fresh.replace(/ x-cv\b/g, '') }
  const rows: Record<string, Record<string, number[]>> = { before: {}, after: {}, 'hero only': {} }
  for (let i = 0; i < N + 1; i++) {
    for (const name of ['before', 'after', 'hero only'] as const) {
      const ctx = await browser.newContext(p.mobile ? { ...devices['iPhone 14'], serviceWorkers: 'block' } : { viewport: { width: 1440, height: 900 }, serviceWorkers: 'block' })
      await ctx.addInitScript(`(() => { window.__m = { lcp: 0 }; new PerformanceObserver(l => { for (const e of l.getEntries()) window.__m.lcp = e.startTime }).observe({ type: 'largest-contentful-paint', buffered: true }) })()`)
      const page = await ctx.newPage()
      await page.route('https://hanzo.ai/', (r) => r.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: html[name], headers: { 'content-security-policy': '' } }))
      const cdp = await ctx.newCDPSession(page)
      await cdp.send('Network.enable')
      await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: p.latency, downloadThroughput: p.down, uploadThroughput: p.up })
      if (p.cpu > 1) await cdp.send('Emulation.setCPUThrottlingRate', { rate: p.cpu })
      const file = join(dir, `${name}-${profile}-${i}.json`)
      await browser.startTracing(page, { path: file, categories: ['devtools.timeline', 'v8.execute', 'blink.user_timing', 'loading', 'disabled-by-default-devtools.timeline'] })
      await page.goto('https://hanzo.ai/', { waitUntil: 'load', timeout: 60000 }).catch(() => {})
      await page.waitForTimeout(1500)
      const lcp = await page.evaluate(() => (window as any).__m.lcp).catch(() => 0)
      await browser.stopTracing()
      await ctx.close()
      if (i === 0) continue
      const events: any[] = JSON.parse(readFileSync(file, 'utf8')).traceEvents
      const main = events.find((e) => e.name === 'thread_name' && e.args?.name === 'CrRendererMain')
      const nav = events.find((e) => e.name === 'navigationStart' && e.pid === main?.pid)
      const fcp = events.find((e) => e.name === 'firstContentfulPaint' && e.pid === main?.pid)
      if (!main || !nav || !fcp) { console.log(`  ${profile} ${name} ${i}: no fcp event`); continue }
      const t0 = nav.ts, t1 = fcp.ts
      const inWin = events.filter((e) => e.ph === 'X' && e.pid === main.pid && e.tid === main.tid && e.ts >= t0 && e.ts + e.dur <= t1 + 1000)
      const sum = (n: string) => inWin.filter((e) => e.name === n).reduce((a, e) => a + e.dur / 1000, 0)
      const m = rows[name]
      ;(m.fcp ??= []).push((t1 - t0) / 1000); (m.lcp ??= []).push(lcp); (m.busy ??= []).push(sum('RunTask'))
      ;(m.layout ??= []).push(sum('Layout')); (m.style ??= []).push(sum('UpdateLayoutTree')); (m.parse ??= []).push(sum('ParseHTML'))
    }
  }
  console.log(`\n### ${profile} (${N} cold loads each, alternating; ms; median [min])`)
  console.log('| metric | before | all of it | hero only (no x-cv) |'); console.log('|---|---|---|---|')
  for (const k of ['fcp', 'lcp', 'busy', 'layout', 'style', 'parse']) {
    const a = rows.before[k] ?? [], b = rows.after[k] ?? [], c = rows['hero only'][k] ?? []
    if (!a.length || !b.length || !c.length) continue
    console.log(`| ${k} | ${med(a).toFixed(0)} [${Math.min(...a).toFixed(0)}] | ${med(b).toFixed(0)} [${Math.min(...b).toFixed(0)}] | ${med(c).toFixed(0)} [${Math.min(...c).toFixed(0)}] |`)
  }
}
await browser.close()
