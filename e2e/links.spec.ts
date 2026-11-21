/**
 * Every link the sweep met, resolved once. Internal: 200 after at most one redirect. Another site's: not 404 or
 * 5xx (a site that refuses a robot, 401/403/429/999, is listed in `refused`, never counted). mailto: and tel: are
 * well formed. Runs after the `pages` project, which writes what each page links to.
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { expect, test } from '@playwright/test'
import { BASE, OUT } from './env'
import type { Finding } from './probe'

const here = new URL(BASE)
const HOME = new Set(['hanzo.ai', 'www.hanzo.ai', here.hostname])

interface Seen { pages: Set<string>; via: string }
/** What the `pages` project wrote: read when the test runs, after it, never when the file is loaded. */
function met(): Map<string, Seen> {
  const seen = new Map<string, Seen>()
  const dir = join(OUT, 'links')
  for (const f of readdirSync(dir).filter((x) => x.endsWith('.json'))) {
    const { route, links } = JSON.parse(readFileSync(join(dir, f), 'utf8')) as { route: string; links?: { href: string; via: string }[] }
    for (const l of links ?? []) {
      const s = seen.get(l.href) ?? { pages: new Set(), via: l.via }
      s.pages.add(route)
      seen.set(l.href, s)
    }
  }
  return seen
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))
const last = new Map<string, number>()
/** One request to a host every 250 ms: a link check is not a crawl. */
async function polite(host: string) {
  const at = Math.max(Date.now(), (last.get(host) ?? 0) + 250)
  last.set(host, at)
  await wait(Math.max(0, at - Date.now()))
}

test('every link the sweep met resolves', async ({ request }, info) => {
  test.setTimeout(30 * 60_000)
  const seen = met()
  const found: Finding[] = []
  const refused: string[] = []
  const where = (href: string) => [...seen.get(href)!.pages].slice(0, 3).join(' ')
  const add = (cls: string, href: string, detail: string) => found.push({ class: cls, route: where(href), viewport: '', theme: '', detail: `${href} (${seen.get(href)!.via}) ${detail}` })

  const queue = [...seen.keys()]
  await Promise.all(
    Array.from({ length: 4 }, async () => {
      for (let href = queue.shift(); href; href = queue.shift()) {
        const u = new URL(href)
        if (u.protocol === 'mailto:') {
          if (!/^mailto:[^\s@/]+@[^\s@/]+\.[^\s@/]+(\?.*)?$/i.test(href)) add('link', href, 'malformed mailto')
          continue
        }
        if (u.protocol === 'tel:') {
          if (!/^tel:\+?[0-9\-.() ]{5,}$/.test(href)) add('link', href, 'malformed tel')
          continue
        }
        // an app's deep link (claude-cli:, codex:) names no server to ask
        if (!/^https?:$/.test(u.protocol)) continue
        const mine = HOME.has(u.hostname)
        const target = mine ? new URL(u.pathname + u.search, here.origin).href : href
        await polite(u.hostname)
        // one range of the first byte: a release asset is checked, not downloaded; a second try for a busy host
        const get = (url: string) => request.get(url, { maxRedirects: 0, timeout: 20_000, headers: { 'user-agent': 'Mozilla/5.0 (compatible; hanzo-site-sweep)', ...(mine ? {} : { range: 'bytes=0-0' }) } })
        const ask = (url: string) => get(url).catch(() => wait(2000).then(() => get(url)))
        try {
          let r = await ask(target)
          let hops = 0
          while (r.status() >= 300 && r.status() < 400 && r.headers().location && hops < 6) {
            hops++
            await polite(new URL(r.headers().location, r.url()).hostname)
            r = await ask(new URL(r.headers().location, r.url()).href)
          }
          const s = r.status()
          if (mine) {
            if (s !== 200) add('link', href, `answers ${s}`)
            else if (hops > 1) add('link', href, `takes ${hops} redirects to ${r.url()}`)
          } else if ([401, 403, 429, 999].includes(s)) refused.push(`${s} ${href}`)
          else if (s === 404 || s === 410 || s >= 500) add('link', href, `answers ${s}`)
        } catch (e) {
          add('link', href, `unreachable: ${String((e as Error).message).split('\n')[0].slice(0, 100)}`)
        }
      }
    }),
  )
  writeFileSync(join(OUT, 'refused.txt'), refused.sort().join('\n'))
  await info.attach('findings', { body: JSON.stringify(found), contentType: 'application/json' })
  expect(found.map((f) => `${f.class}: ${f.detail}`)).toEqual([])
})
