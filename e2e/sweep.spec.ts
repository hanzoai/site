/**
 * Every page of the site, at desktop and phone width, light and dark, as a person meets it: cold, with the page's
 * own console, requests, images, fonts, layout, links and buttons asked what is wrong. One test per
 * route x viewport x theme; a test passes only with no finding, and every finding is written for the report
 * (e2e/report.ts) with its class.
 *
 *   BASE_URL=https://hanzo.ai pnpm e2e --project=pages
 *   SWEEP_ROUTES='^/(pricing|models)' SWEEP_SLUGS=all SWEEP_WORKERS=2 pnpm e2e --project=pages
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { expect, test } from '@playwright/test'
import { audit, links, pressAll, settle, timing, watch, type Finding } from './probe'
import { every, sampled, THEMES, unlistedRoutes, VIEWPORTS, type Theme, type Viewport } from './routes'

const OUT = process.env.SWEEP_OUT ?? join(import.meta.dirname, '.out')
const FILTER = process.env.SWEEP_ROUTES ? new RegExp(process.env.SWEEP_ROUTES) : null
// Buttons are pressed on one theme per width: the theme changes no handler.
const PRESS: Record<Viewport, Theme> = { desktop: 'light', mobile: 'dark' }

mkdirSync(join(OUT, 'links'), { recursive: true })

test.describe.configure({ mode: 'parallel' })

for (const route of sampled.filter((r) => !FILTER || FILTER.test(r))) {
  for (const vp of Object.keys(VIEWPORTS) as Viewport[]) {
    for (const theme of THEMES) {
      test(`${route} ${vp} ${theme}`, async ({ browser, baseURL }, info) => {
        test.setTimeout(180_000)
        const context = await browser.newContext({ ...VIEWPORTS[vp], colorScheme: theme, baseURL })
        const page = await context.newPage()
        const found: Finding[] = []
        const add = (cls: string, detail: string) => found.push({ class: cls, route, viewport: vp, theme, detail })
        try {
          const seen = await watch(context, page)
          await page.waitForTimeout(Math.random() * 500)
          const res = await page.goto(route, { waitUntil: 'domcontentloaded', timeout: 45_000 })
          if (!res) add('status', 'no response')
          else {
            if (res.status() !== 200) add('status', `${res.status()}`)
            const from = res.request().redirectedFrom()
            if (from) add('status', `redirected from ${from.url()}`)
          }
          await settle(page)
          // a page stays at its address: one that sends the visitor elsewhere by script is the front door's to know about
          if (new URL(page.url()).pathname.replace(/\/$/, '') !== route.replace(/\/$/, '') || new URL(page.url()).origin !== new URL(baseURL!).origin) add('status', `the page left for ${page.url()}`)

          for (const f of await page.evaluate(audit, { vw: VIEWPORTS[vp].viewport.width, isMobile: VIEWPORTS[vp].isMobile })) {
            if (f.class === '_theme') {
              if (f.detail !== theme) add('theme', `page wears ${f.detail}, asked for ${theme}`)
            } else if (f.class === '_canonical') {
              const path = f.detail.replace(/^https?:\/\/[^/]+/, '') || '/'
              // a page names itself, or (a short address) the listed page it is
              if (!f.detail) add('meta', 'no canonical link')
              else if (path !== route && !(unlistedRoutes.includes(route) && every.includes(path))) add('meta', `canonical ${f.detail}, page is ${route}`)
            } else add(f.class, f.detail)
          }

          // What a page weighs is the same on any machine; how fast it opens is perf.spec.ts's, which runs alone.
          const t = await page.evaluate(timing)
          if (t.bytes > 6_000_000) add('slow', `${(t.bytes / 1e6).toFixed(1)}MB transferred`)
          for (const b of t.big) add('asset', b)

          writeFileSync(join(OUT, 'links', `${info.workerIndex}-${Date.now()}-${Math.random().toString(36).slice(2)}.json`), JSON.stringify({ route, links: await page.evaluate(links) }))

          if (PRESS[vp] === theme) {
            let from = 0
            seen.phase = 'press'
            for (let again = 0; again < 6; again++) {
              const r = await pressAll(page, 'page', from)
              for (const d of r.dead) add('button', `pressing ${d} changed nothing`)
              for (const c of r.covered) add('button', `cannot be pressed: ${c}`)
              from = r.next
              if (!r.left) break
              // a press left the page: the rest are pressed on a fresh copy of it
              await page.goto(route, { waitUntil: 'domcontentloaded' })
              await settle(page)
            }
            seen.phase = 'load'
          }

          // The page's own words and requests, last, so the presses above are counted too.
          for (const c of seen.console) add('console', c)
          for (const b of seen.bad) add('request', b)
          for (const f of seen.failed) add('request', f)
          for (const m of seen.mixed) add('mixed', m)
        } catch (e) {
          add('harness', String((e as Error).message).split('\n')[0].slice(0, 200))
        } finally {
          await context.close()
        }
        await info.attach('findings', { body: JSON.stringify(found), contentType: 'application/json' })
        expect(found.map((f) => `${f.class}: ${f.detail}`)).toEqual([])
      })
    }
  }
}
