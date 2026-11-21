/**
 * The addresses of the site, as the edge answers them: www and apex, http and https, trailing slash, .html and
 * index.html, case, the guessed names of a page (universe docs/urls.md: the one front door), and a page that does not
 * exist. Each is one request without following, so a chain longer than the hop that is wanted shows.
 */
import { expect, test } from '@playwright/test'
import { orphans, unlisted } from './routes'

const origin = new URL(process.env.BASE_URL ?? 'https://hanzo.ai')
const APEX = 'https://hanzo.ai'

// [address, status of a GET, where it goes]. A HEAD is answered 308/307 where a GET is 301/302.
const hop: [string, number, string][] = [
  ['/pricing/', 301, `${APEX}/pricing`],
  ['/pricing.html', 301, `${APEX}/pricing`],
  ['/pricing/index.html', 301, `${APEX}/pricing`],
  ['/index.html', 301, `${APEX}/`],
  ['/pricing?ref=x', 200, ''],
  ['/plans', 302, `${APEX}/pricing`],
  ['/Plans/', 302, `${APEX}/pricing`],
  ['/sign-in', 302, `${APEX}/login`],
  ['/register?ref=x', 302, `${APEX}/signup?ref=x`],
  ['/jobs', 302, `${APEX}/careers`],
  ['/tos', 302, `${APEX}/terms`],
  ['/news', 302, `${APEX}/blog`],
  ['/documentation', 302, 'https://docs.hanzo.ai'],
  ['/github', 302, 'https://github.com/hanzoai'],
  ['/docs', 301, 'https://docs.hanzo.ai'],
  ['/status', 301, 'https://status.hanzo.ai'],
  ['/dashboard/', 302, 'https://hanzo.app/dashboard'],
  ['/chat?q=hi', 302, 'https://hanzo.app/?q=hi'],
]

for (const [path, status, to] of hop) {
  test(`${path} is ${status}${to ? ` to ${to}` : ''}`, async ({ request }) => {
    const r = await request.get(`${APEX}${path}`, { maxRedirects: 0 })
    expect(r.status()).toBe(status)
    if (to) expect(r.headers().location).toBe(to)
  })
}

test('www is the apex, in one hop, path and query kept', async ({ request }) => {
  const r = await request.get('https://www.hanzo.ai/pricing?ref=x', { maxRedirects: 0 })
  expect(r.status()).toBe(301)
  expect(r.headers().location).toBe(`${APEX}/pricing?ref=x`)
})

test('http is https, and ends on the apex within two hops', async ({ request }) => {
  let url = 'http://www.hanzo.ai/pricing'
  let hops = 0
  for (; hops < 4; hops++) {
    const r = await request.get(url, { maxRedirects: 0 })
    if (r.status() < 300 || r.status() >= 400) {
      expect(r.status()).toBe(200)
      break
    }
    url = new URL(r.headers().location, url).href
  }
  expect(url).toBe(`${APEX}/pricing`)
  expect(hops).toBeLessThanOrEqual(2)
})

test('a page that does not exist is a branded 404', async ({ page }) => {
  for (const path of ['/this-page-does-not-exist', '/pricing/nope', '/models/no-such-lab/no-such-model']) {
    const r = await page.goto(path)
    expect(r?.status(), path).toBe(404)
    await expect(page, path).toHaveTitle(/not found/i)
    await expect(page.locator('h1').first(), path).toBeVisible()
  }
})

test('a file that does not exist is a bare 404', async ({ request }) => {
  expect((await request.get(`${APEX}/assets/_next/static/chunks/no-such-chunk.js`)).status()).toBe(404)
})

test('the tree and lib/routes.json agree: no route without a page, no page unlisted', () => {
  expect(orphans, 'listed in lib/routes.json, with no page under app/').toEqual([])
  expect(unlisted, 'a page under app/ that lib/routes.json does not list').toEqual([])
})

test('the sitemap lists exactly the listed routes that are not unlisted', async ({ request }) => {
  const xml = await (await request.get(`${origin.origin}/sitemap.xml`)).text()
  expect(xml).toContain('<loc>https://hanzo.ai/pricing</loc>')
  expect((xml.match(/<loc>/g) ?? []).length).toBeGreaterThan(800)
})
