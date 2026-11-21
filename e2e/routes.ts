/**
 * The routes of the site, derived and never listed by hand.
 *
 * A page is a `page.tsx` under app/; a dynamic segment ([slug], [...mod]) takes its values from lib/routes.json, the
 * one list of every page the export writes (the sitemap and the link resolver read it too). So a new page, or a
 * new model, is in the sweep the day it is in the tree. `orphans` and `unlisted` are the two ways the tree and the
 * list can disagree: both are findings.
 */
import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const APP = join(ROOT, 'app')

const listed: string[] = JSON.parse(readFileSync(join(ROOT, 'lib/routes.json'), 'utf8'))
/** Pages served without a sitemap entry: a short address of another page, which its canonical names, or a page left out on purpose. */
export const unlistedRoutes: string[] = JSON.parse(readFileSync(join(ROOT, 'lib/unlisted.json'), 'utf8'))

/** Every page.tsx under app/, as the route it answers: route groups and parallel slots are no part of an address. */
function pages(dir = APP): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name)
    if (e.isDirectory()) return pages(p)
    if (!/^page\.(tsx|jsx|ts|js)$/.test(e.name)) return []
    const segs = relative(APP, dirname(p)).split('/').filter((s) => s && !/^\(.*\)$/.test(s) && !s.startsWith('@'))
    return ['/' + segs.join('/')]
  })
}

const tree = pages()
const dynamic = tree.filter((r) => r.includes('['))
const fixed = tree.filter((r) => !r.includes('['))

/** A dynamic route as a regular expression over listed routes: [slug] is one segment, [...rest] is one or more. */
const pattern = (route: string) =>
  new RegExp('^' + route.split('/').map((s) => (/^\[\.\.\./.test(s) ? '.+' : /^\[/.test(s) ? '[^/]+' : s.replace(/[.*+?^${}()|\\]/g, '\\$&'))).join('/') + '$')

/** Listed routes that no fixed page claims: each belongs to the most specific dynamic page that matches it. */
const families = new Map<string, string[]>()
for (const route of listed) {
  if (fixed.includes(route)) continue
  const owner = dynamic.filter((d) => pattern(d).test(route)).sort((a, b) => b.split('/').length - a.split('/').length || a.length - b.length)[0]
  if (owner) families.set(owner, [...(families.get(owner) ?? []), route])
}

/** Routes the tree has no page for, and pages the list does not carry. */
export const orphans = listed.filter((r) => !fixed.includes(r) && ![...families.values()].some((f) => f.includes(r)))
export const unlisted = fixed.filter((r) => !listed.includes(r))

/** How many members of each dynamic family the browser sweep opens. */
const TAKE = 2

/** Spread the picks across the family: its first, its last and the ones between, the same on every run. */
function pick(members: string[], n: number): string[] {
  const sorted = [...members].sort()
  if (n >= sorted.length) return sorted
  return Array.from({ length: n }, (_, i) => sorted[Math.round((i * (sorted.length - 1)) / Math.max(n - 1, 1))])
}

/** Every page of the site, for the cheap sweep (status, canonical): the list itself. */
export const every = listed

/** The pages the browser sweep opens: all the fixed pages, and a spread of each dynamic family. */
export const sampled = [...new Set([...fixed, ...[...families.values()].flatMap((m) => pick(m, TAKE))])].sort()

export const VIEWPORTS = {
  desktop: { viewport: { width: 1440, height: 900 }, isMobile: false, hasTouch: false, deviceScaleFactor: 1 },
  mobile: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
} as const
export const THEMES = ['light', 'dark'] as const
export type Viewport = keyof typeof VIEWPORTS
export type Theme = (typeof THEMES)[number]

