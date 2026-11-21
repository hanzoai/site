// The tree and lib/routes.json agree: every page under app/ is listed, and every listed route has a page, so
// the browser sweep (e2e/) and the sitemap cannot go stale.
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { orphans, sampled, unlisted } from '../e2e/routes.ts'

test('every listed route has a page, and every page is listed', () => {
  assert.deepEqual(orphans, [], 'listed in lib/routes.json with no page under app/')
  assert.deepEqual(unlisted, [], 'a page under app/ that lib/routes.json does not list')
})

test('the sweep reaches the home page and a dynamic family', () => {
  assert.ok(sampled.includes('/'))
  assert.ok(sampled.some((r) => r.startsWith('/models/')))
})
