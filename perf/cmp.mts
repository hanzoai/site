// Two builds of the site, served side by side from disk, loaded cold and alternately under the same network and CPU:
// when the page paints and how long the main thread works before it. Usage: node cmp.mts <base out/> <new out/>
import { chromium, devices } from 'playwright'
import { createServer } from 'node:http'
import { readFileSync, existsSync, statSync, mkdtempSync } from 'node:fs'
import { join, extname } from 'node:path'
import { brotliCompressSync } from 'node:zlib'
import { tmpdir } from 'node:os'

const [BASE, NEW] = process.argv.slice(2)
const N = Number(process.env.RUNS ?? 9)
const TYPES: Record<string, string> = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.avif': 'image/avif', '.mp4': 'video/mp4' }
const squeezed = new Map<string, Buffer>()

function serve(dir: string, port: number) {
  return new Promise<void>((resolve) => {
    createServer((req, res) => {
      const path = decodeURIComponent((req.url ?? '/').split('?')[0])
      const file = [join(dir, path), join(dir, path, 'index.html'), join(dir, path + '.html')].find((f) => existsSync(f) && statSync(f).isFile())
      if (!file) { res.statusCode = 404; res.end('not found'); return }
      const type = TYPES[extname(file)] ?? 'application/octet-stream'
      let body = readFileSync(file)
      res.setHeader('content-type', type)
      if (/^(text|application\/(json|javascript)|image\/svg)/.test(type) && /\bbr\b/.test(String(req.headers['accept-encoding']))) {
        let z = squeezed.get(file)
        if (!z) squeezed.set(file, (z = brotliCompressSync(body)))
        res.setHeader('content-encoding', 'br'); body = z
      }
      res.end(body)
    }).listen(port, '127.0.0.1', resolve)
  })
}
await serve(BASE, 4191)
await serve(NEW, 4192)

const PROFILES = {
  broadband: { mobile: false, latency: 10, down: (100 * 1024 * 1024) / 8, up: (20 * 1024 * 1024) / 8, cpu: 1 },
  fast4g: { mobile: true, latency: 70, down: (9 * 1024 * 1024) / 8, up: (1.5 * 1024 * 1024) / 8, cpu: 4 },
} as const
const browser = await chromium.launch({ args: ['--no-sandbox'] })
const dir = mkdtempSync(join(tmpdir(), 'trace-'))
const med = (a: number[]) => [...a].sort((x, y) => x - y)[Math.floor(a.length / 2)]

for (const [profile, p] of Object.entries(PROFILES)) {
  const rows: Record<string, Record<string, number[]>> = { base: {}, new: {} }
  for (let i = 0; i < N + 1; i++) {
    for (const [name, port] of [['base', 4191], ['new', 4192]] as const) {
      const began = Date.now()
      const ctx = await browser.newContext(p.mobile ? { ...devices['iPhone 14'], serviceWorkers: 'block' } : { viewport: { width: 1440, height: 900 }, serviceWorkers: 'block' })
      await ctx.addInitScript(`(() => { window.__m = { lcp: 0 }; new PerformanceObserver(l => { for (const e of l.getEntries()) window.__m.lcp = e.startTime }).observe({ type: 'largest-contentful-paint', buffered: true }) })()`)
      const page = await ctx.newPage()
      await page.route((u) => u.hostname !== '127.0.0.1', (r) => r.abort())
      const cdp = await ctx.newCDPSession(page)
      await cdp.send('Network.enable')
      await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: p.latency, downloadThroughput: p.down, uploadThroughput: p.up })
      if (p.cpu > 1) await cdp.send('Emulation.setCPUThrottlingRate', { rate: p.cpu })
      const file = join(dir, `${name}-${profile}-${i}.json`)
      await browser.startTracing(page, { path: file, categories: ['devtools.timeline', 'loading'] })
      await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'commit', timeout: 30000 }).catch(() => {})
      await page.waitForFunction(() => (window as any).__m?.lcp > 0, null, { timeout: 20000 }).catch(() => {})
      await page.waitForTimeout(800)
      const lcp = await page.evaluate(() => (window as any).__m.lcp).catch(() => 0)
      await browser.stopTracing()
      await ctx.close()
      if (i === 0) continue // the first pair warms the disk cache and the JIT of this process
      console.log(`  ${profile} ${name} run ${i}: lcp ${Math.round(lcp)} ms, ${((Date.now() - began) / 1000).toFixed(1)} s`)
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
  console.log(`\n### ${profile} (${N} cold loads each, alternating; ms; median [min])`)
  console.log('| metric | base | new | change |'); console.log('|---|---|---|---|')
  for (const k of ['fcp', 'lcp', 'busy', 'layout', 'style', 'parse']) {
    const a = rows.base[k] ?? [], b = rows.new[k] ?? []
    if (!a.length || !b.length) continue
    console.log(`| ${k} | ${med(a).toFixed(0)} [${Math.min(...a).toFixed(0)}] | ${med(b).toFixed(0)} [${Math.min(...b).toFixed(0)}] | ${(med(b) - med(a)).toFixed(0)} |`)
  }
}
await browser.close()
