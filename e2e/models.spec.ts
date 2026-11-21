/**
 * The model ids hanzo.ai shows are ids the gateway serves: no Zen 4 or Qwen 2 anywhere on the model pages, no Zen 5
 * in a code sample or on /sdks and /models, and every id in a code sample is in the live GET /v1/models. (The
 * /zen/models catalog still lists the Zen 5 rows, whose sizes Zen 6 has no published figures for: see LLM.md.)
 */
import { expect, test } from '@playwright/test'
import { every } from './routes'

// the three model pages, and every integration page, whose samples configure a client with a model id
const ROUTES = ['/sdks', '/models', '/zen/models', ...every.filter((r) => r.startsWith('/integrations/'))]
const OLD = /\b(zen[-_ ]?4|qwen[-_ ]?2(?:\.\d)?(?![\d]))\b/i

async function served(request: import('@playwright/test').APIRequestContext): Promise<Set<string>> {
  const r = await request.get('https://api.hanzo.ai/v1/models')
  expect(r.ok()).toBe(true)
  const body = await r.json()
  return new Set<string>((body.data ?? body).map((m: { id: string }) => m.id))
}

/** The ids a code sample names: model="x", model: "x", "model": "x", --model x, /model x. */
const idsIn = (code: string) =>
  [...code.matchAll(/(?:\bmodel\s*[=:]\s*|"model"\s*:\s*|--model[ =]|\/model )["']?([A-Za-z0-9][A-Za-z0-9._:/-]*)(?![A-Za-z0-9._:/-]|["']?\()/g)]
    .map((m) => m[1])
    // a client's own provider prefix (LiteLLM's `openai/zen6`) is not part of the id; a variable (`model = new Foo`) is no id
    .map((id) => id.replace(/^openai\/(?=zen|enso|kai)/, ''))
    .filter((id) => !/^(your|\$|\{|<|new$|hanzo$)/i.test(id))

for (const route of ROUTES) {
  test(`${route}: no Zen 4 or Qwen 2, and every id in a code sample is served`, async ({ page, request }) => {
    await page.goto(route, { waitUntil: 'load' })
    await page.waitForTimeout(1500)
    const text = await page.evaluate(() => document.body.innerText)
    expect(text.match(OLD)?.[0] ?? null, `${route} names a retired model`).toBeNull()
    const code = await page.evaluate(() => Array.from(document.querySelectorAll('pre, code')).map((e) => e.textContent ?? '').join('\n'))
    const ids = [...new Set(idsIn(code))]
    const live = await served(request)
    expect(ids.filter((id) => !live.has(id)), `ids in a code sample of ${route} the gateway does not serve`).toEqual([])
    expect(ids.filter((id) => /^zen[-]?5/.test(id)), `${route} shows a Zen 5 id in a code sample`).toEqual([])
    if (route !== '/zen/models') expect(text.match(/\bzen[-]?5\b/i)?.[0] ?? null, `${route} names Zen 5`).toBeNull()
  })
}
