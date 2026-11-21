/** A finding is one thing wrong on a page: its class, where, and what. */
import type { BrowserContext, Page, Request } from '@playwright/test'

export interface Finding {
  class: string
  route: string
  viewport: string
  theme: string
  detail: string
}

/** What a sweep must not record as a visit: the site's own telemetry and tag loader. Blocked, so it is not a finding. */
const TELEMETRY = /\/v1\/(event|observe|replay|analytics|insights|telemetry|project\/tags)\b|googletagmanager\.com|google-analytics\.com|facebook\.net|snap\.licdn\.com|px\.ads\.linkedin\.com|cloudflareinsights\.com/

export interface Seen {
  console: string[]
  failed: string[]
  bad: string[]
  mixed: string[]
  /** `press` once buttons are being pressed: the pointer then opens menus, closes them and warms links */
  phase: 'load' | 'press'
}

/** Collect what the page says and asks for. Writes (non-GET) are answered 204: a sweep sends no form and records no event. */
export async function watch(context: BrowserContext, page: Page): Promise<Seen> {
  const seen: Seen = { console: [], failed: [], bad: [], mixed: [], phase: 'load' }
  const written = new Set<string>()
  await context.route('**/*', (route) => {
    const { method, url } = { method: route.request().method(), url: route.request().url() }
    if (TELEMETRY.test(url)) return route.abort('blockedbyclient')
    if (method !== 'GET' && method !== 'HEAD' && method !== 'OPTIONS') {
      written.add(url)
      return route.fulfill({ status: 204, body: '' })
    }
    return route.continue()
  })
  page.on('console', (m) => {
    if (m.type() !== 'error' && m.type() !== 'warning') return
    const at = m.location()
    if (/ERR_BLOCKED_BY_CLIENT/.test(m.text()) && TELEMETRY.test(at.url)) return
    // a button pressed inside a link warms that link's page (Morph), and Chrome warns of the CSS it preloaded if the page is not opened
    if (seen.phase === 'press' && /preloaded using link preload/.test(m.text())) return
    seen.console.push(`${m.type()}: ${m.text().slice(0, 300)}${at.url ? ` (${at.url.replace(/^https?:\/\/[^/]+/, '')}:${at.lineNumber})` : ''}`)
  })
  page.on('pageerror', (e) => seen.console.push(`uncaught: ${e.message.slice(0, 300)}`))
  page.on('request', (r: Request) => {
    if (new URL(page.url() === 'about:blank' ? r.url() : page.url()).protocol === 'https:' && r.url().startsWith('http://')) seen.mixed.push(r.url())
  })
  page.on('requestfailed', (r: Request) => {
    const why = r.failure()?.errorText ?? 'failed'
    if (TELEMETRY.test(r.url()) || written.has(r.url())) return
    if (why === 'net::ERR_ABORTED') {
      // cancelled by the browser or the framework, not failed: a press's menu closing, a media element that has buffered
      // enough, Next's HEAD prefetch of a link that scrolled away
      if (seen.phase === 'press' || r.resourceType() === 'media') return
      if (r.method() === 'HEAD' && r.resourceType() === 'fetch' && new URL(r.url()).origin === new URL(page.url()).origin) return
    }
    seen.failed.push(`${r.method()} ${r.url().slice(0, 200)} ${why}`)
  })
  page.on('response', (r) => {
    if (r.status() >= 400) seen.bad.push(`${r.status()} ${r.request().method()} ${r.url().slice(0, 200)}`)
  })
  return seen
}

/** Let the page arrive: load, fonts, the arrival hold, then walk it top to bottom so lazy things load. */
export async function settle(page: Page): Promise<void> {
  await page.waitForLoadState('load', { timeout: 30_000 }).catch(() => {})
  await page.evaluate(() => document.fonts?.ready).catch(() => {})
  await page.waitForTimeout(900)
  const height = await page.evaluate(() => document.documentElement.scrollHeight)
  const step = 600
  for (let y = 0; y < Math.min(height, 24_000); y += step) {
    await page.evaluate((to) => window.scrollTo(0, to), y)
    await page.waitForTimeout(40)
  }
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
  await page.waitForTimeout(400)
  await page.waitForLoadState('networkidle', { timeout: 4_000 }).catch(() => {})
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(250)
}

/** The checks that read the page's own state; they run in the page. */
export const audit = ({ vw, isMobile }: { vw: number; isMobile: boolean }) => {
  const out: { class: string; detail: string }[] = []
  const add = (c: string, detail: string) => out.push({ class: c, detail })
  const doc = document.documentElement
  const label = (el: Element) => {
    const t = ((el as HTMLElement).innerText?.trim() || el.getAttribute('aria-label') || el.getAttribute('title') || '').replace(/\s+/g, ' ').slice(0, 50)
    const id = (el as HTMLElement).id ? `#${(el as HTMLElement).id}` : ''
    const cls = typeof (el as HTMLElement).className === 'string' && (el as HTMLElement).className ? `.${(el as HTMLElement).className.trim().split(/\s+/).slice(0, 2).join('.')}` : ''
    return `${el.tagName.toLowerCase()}${id}${cls}${t ? ` "${t}"` : ''}`
  }
  const visible = (el: Element) => {
    const r = el.getBoundingClientRect()
    const s = getComputedStyle(el)
    return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && Number(s.opacity) > 0
  }

  // theme the page says it wears
  const cls = doc.className
  out.push({ class: '_theme', detail: /\bt_dark\b|\bdark\b/.test(cls) ? 'dark' : /\bt_light\b|\blight\b/.test(cls) ? 'light' : 'none' })

  // an address the edge rewrote and nothing decoded
  if (/\[email(\s|\u00a0)protected\]/.test(document.body.innerText)) add('email', 'the page shows [email protected]: an address was obfuscated at the edge and not decoded')

  // head
  if (!document.title.trim()) add('meta', 'no <title>')
  if (!doc.lang) add('meta', 'html has no lang')
  const canon = document.querySelector('link[rel=canonical]')?.getAttribute('href')
  out.push({ class: '_canonical', detail: canon ?? '' })

  // images
  for (const img of Array.from(document.images)) {
    if (!visible(img) && !img.closest('picture')) continue
    if (img.complete && img.naturalWidth === 0 && img.currentSrc) add('image', `broken ${img.currentSrc.replace(/^https?:\/\/[^/]+/, '').slice(0, 120)}`)
    // a copy of a picture made for a loop, hidden from assistive technology, has its alt on the real one
    if (img.closest('[aria-hidden=true]')) continue
    if (!img.hasAttribute('alt')) add('alt', `img without alt ${img.currentSrc.replace(/^https?:\/\/[^/]+/, '').slice(0, 100)}`)
    else if (!img.alt.trim() && img.closest('a,button') && !(img.closest('a,button') as HTMLElement).innerText.trim() && !img.closest('a,button')?.getAttribute('aria-label') && !img.closest('a,button')?.getAttribute('title'))
      add('alt', `a link or button named by an image with empty alt: ${label(img.closest('a,button')!)}`)
  }
  for (const v of Array.from(document.querySelectorAll('video'))) {
    if (v.error) add('video', `error ${v.error.code} ${v.currentSrc.replace(/^https?:\/\/[^/]+/, '')}`)
  }
  for (const f of Array.from(document.fonts ?? [])) if (f.status === 'error') add('font', `failed to load ${f.family}`)

  // horizontal overflow
  const sw = Math.max(doc.scrollWidth, document.body.scrollWidth)
  if (sw > vw + 1) {
    const wide = Array.from(document.body.querySelectorAll('*'))
      .filter((el) => {
        const r = el.getBoundingClientRect()
        if (r.width === 0 || r.right <= vw + 1) return false
        let p: Element | null = el.parentElement
        while (p && p !== document.body) {
          const o = getComputedStyle(p)
          if (/(auto|scroll|hidden|clip)/.test(o.overflowX) || o.position === 'fixed') return false
          p = p.parentElement
        }
        return true
      })
      .slice(0, 4)
      .map(label)
    add('overflow', `scrollWidth ${sw} > ${vw}${wide.length ? `: ${wide.join(' | ')}` : ''}`)
  }

  // text that runs past the edge of the screen without a scroller of its own, at any width
  const cut = new Set<string>()
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  for (let n = walker.nextNode(); n && cut.size < 5; n = walker.nextNode()) {
    const text = (n.nodeValue ?? '').trim()
    const el = n.parentElement
    if (!text || !el || !visible(el) || /^(SCRIPT|STYLE|NOSCRIPT)$/.test(el.tagName)) continue
    const range = document.createRange()
    range.selectNodeContents(n)
    const r = range.getBoundingClientRect()
    if (r.width === 0 || (r.right <= vw + 1 && r.left >= -1)) continue
    let p: Element | null = el
    let scroller = false
    while (p) {
      const o = getComputedStyle(p)
      if (/(auto|scroll|hidden|clip)/.test(o.overflowX) || o.position === 'fixed') { scroller = true; break }
      p = p.parentElement
    }
    if (!scroller) cut.add(`${label(el)} reaches ${Math.round(r.right)}px`)
  }
  for (const c of cut) add('clipped', c)

  // tap targets: the hit area is read where a finger would land, so a pseudo-element that borrows space counts
  if (isMobile) {
    const bad: string[] = []
    for (const el of Array.from(document.querySelectorAll('a[href], button, [role=button], input:not([type=hidden]), select, textarea, summary'))) {
      if (!visible(el)) continue
      const s = getComputedStyle(el)
      const text = (el as HTMLElement).parentElement
      // an inline link inside a sentence is exempt, as in WCAG 2.5.8
      if (s.display === 'inline' && text && Array.from(text.childNodes).some((c) => c.nodeType === 3 && (c.nodeValue ?? '').trim().length > 3)) continue
      const r = el.getBoundingClientRect()
      if (r.bottom < 0 || r.top > innerHeight * 40 || r.width === 0) continue
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      if (cy < 0 || cy > innerHeight || cx < 0 || cx > innerWidth) continue
      // the four edge midpoints of a 44px square, one pixel in: a round button is hit there, a narrow one only if something borrows space
      const hits = [[-21, 0], [21, 0], [0, -21], [0, 21]].filter(([dx, dy]) => {
        const x = cx + dx
        const y = cy + dy
        if (x < 0 || y < 0 || x >= innerWidth || y >= innerHeight) return true
        const at = document.elementFromPoint(x, y)
        return !!at && (el === at || el.contains(at) || at.contains(el))
      }).length
      if (hits < 4 && (r.width < 44 || r.height < 44)) bad.push(`${label(el)} ${Math.round(r.width)}x${Math.round(r.height)}`)
    }
    for (const b of bad.slice(0, 12)) add('target', b)
    if (bad.length > 12) add('target', `and ${bad.length - 12} more`)
  }

  // links that go nowhere
  for (const a of Array.from(document.querySelectorAll('a'))) {
    const href = a.getAttribute('href')
    if (!visible(a)) continue
    if (href === null || href.trim() === '' || href.trim() === '#' || /^javascript:/i.test(href)) {
      if (!a.onclick && !a.getAttribute('role') && !a.getAttribute('data-hz-action')) add('link', `${label(a)} has href ${JSON.stringify(href)}`)
    }
  }
  return out
}

/** What a page links to, for the link pass: absolute, without fragments, once each. */
export const links = () => {
  const seen = new Map<string, string>()
  for (const a of Array.from(document.querySelectorAll('a[href], a[*|href]'))) {
    const raw = a.getAttribute('href') ?? a.getAttributeNS('http://www.w3.org/1999/xlink', 'href') ?? ''
    if (!raw || raw.startsWith('#') || /^javascript:/i.test(raw)) continue
    let href: string
    try { href = new URL(raw, document.baseURI).href } catch { continue }
    const where = a.closest('footer') ? 'footer' : a.closest('header, nav') ? 'nav' : 'page'
    const text = ((a as HTMLElement).innerText || a.getAttribute('aria-label') || a.getAttribute('title') || '').trim().replace(/\s+/g, ' ').slice(0, 60)
    const key = href.split('#')[0]
    if (!seen.has(key)) seen.set(key, `${where}|${text}`)
  }
  return Array.from(seen, ([href, via]) => ({ href, via }))
}

/** Responsiveness: the browser's own timings of this navigation, and the files that weigh most. */
export const timing = () =>
  new Promise<{ load: number; lcp: number; ttfb: number; bytes: number; big: string[] }>((resolve) => {
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
    let lcp = 0
    try {
      new PerformanceObserver((l) => {
        for (const e of l.getEntries()) lcp = Math.max(lcp, e.startTime)
      }).observe({ type: 'largest-contentful-paint', buffered: true })
    } catch {}
    setTimeout(() => {
      const res = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
      const bytes = res.reduce((n, r) => n + (r.transferSize || 0), 0) + (nav?.transferSize ?? 0)
      // what a file of each kind may weigh before it is a finding: a still, a script, a style, a font, a film
      const limit = (name: string) => {
        const ext = (name.split('?')[0].match(/\.([a-z0-9]+)$/i)?.[1] ?? '').toLowerCase()
        if (/^(jpe?g|png|gif|webp|avif|bmp|svg)$/.test(ext)) return 300_000
        if (/^(mp4|webm|mov|m4v|mp3|ogg|wav)$/.test(ext)) return 2_000_000
        if (ext === 'js' || ext === 'mjs') return 500_000
        if (ext === 'css') return 200_000
        if (/^(woff2?|ttf|otf)$/.test(ext)) return 300_000
        return 600_000
      }
      const big = res.filter((r) => r.transferSize > limit(r.name)).map((r) => `${Math.round(r.transferSize / 1024)}KB ${r.name.replace(/^https?:\/\/[^/]+/, '').slice(0, 90)}`)
      resolve({ load: nav ? nav.loadEventEnd : 0, lcp, ttfb: nav ? nav.responseStart : 0, bytes, big })
    }, 50)
  })

/**
 * Press every button of the page once and say which did nothing. Controls of the shared header, footer and corner
 * are pressed once, on the home page, so a page's own buttons are what is pressed here.
 */
export async function pressAll(
  page: Page,
  scope: 'page' | 'chrome',
  from = 0,
  limit = 10,
): Promise<{ dead: string[]; covered: string[]; next: number; left: boolean; total: number }> {
  const dead: string[] = []
  const covered: string[] = []
  const start = page.url()
  await page.evaluate(() => {
    const w = window as any
    w.__qa = { calls: [] as string[] }
    const note = (n: string) => () => { w.__qa.calls.push(n); return n === 'confirm' ? false : undefined }
    w.open = (...a: unknown[]) => { w.__qa.calls.push(`open ${String(a[0])}`); return null }
    w.alert = note('alert'); w.confirm = note('confirm'); w.prompt = note('prompt')
    try { Object.defineProperty(navigator, 'clipboard', { value: { writeText: () => { w.__qa.calls.push('clipboard'); return Promise.resolve() }, write: () => { w.__qa.calls.push('clipboard'); return Promise.resolve() } }, configurable: true }) } catch {}
    try { (navigator as any).share = () => { w.__qa.calls.push('share'); return Promise.resolve() } } catch {}
    const play = HTMLMediaElement.prototype.play
    HTMLMediaElement.prototype.play = function () { w.__qa.calls.push('play'); return play.call(this) }
    w.__qa.mut = 0
    // what the page changes of itself, bar its animation: attributes but `style`, nodes added or removed, text
    new MutationObserver((rs) => {
      for (const r of rs) if (r.type !== 'attributes' || (r.attributeName !== 'style' && r.attributeName !== 'data-qa')) w.__qa.mut++
    }).observe(document, { subtree: true, childList: true, attributes: true, characterData: true })
    let n = 0
    document.querySelectorAll('button, [role=button], input[type=submit], input[type=button], a[href="#"]').forEach((el) => el.setAttribute('data-qa', String(n++)))
  })
  const ids: string[] = await page.evaluate(
    (scopeName) => {
      const inChrome = (el: Element) => !!el.closest('header, footer, nav, [data-slot=corner], [data-slot=corner-card]')
      return Array.from(document.querySelectorAll('[data-qa]'))
        .filter((el) => {
          const r = el.getBoundingClientRect()
          const s = getComputedStyle(el)
          if (r.width === 0 || r.height === 0 || s.visibility === 'hidden' || s.display === 'none') return false
          if ((el as HTMLButtonElement).disabled || el.getAttribute('aria-disabled') === 'true' || s.pointerEvents === 'none') return false
          if (el.closest('[aria-hidden=true], [inert]')) return false
          // the option already chosen answers nothing when pressed again
          if (el.matches('[aria-selected=true], [aria-pressed=true], [aria-current], [data-on], [data-active], .on, .active')) return false
          return (scopeName === 'chrome') === inChrome(el)
        })
        .map((el) => el.getAttribute('data-qa')!)
    },
    scope,
  )
  let next = from
  for (; next < Math.min(ids.length, from + limit); next++) {
    const loc = page.locator(`[data-qa="${ids[next]}"]`).first()
    if (!(await loc.count())) continue
    const name = await loc.evaluate((el) => `${el.tagName.toLowerCase()} "${((el as HTMLElement).innerText || el.getAttribute('aria-label') || el.getAttribute('title') || el.id || '').trim().replace(/\s+/g, ' ').slice(0, 40)}"`)
    // what the page does by itself in the time a press is watched, so a demo that animates is not mistaken for an answer
    const m0 = await page.evaluate(() => (window as any).__qa.mut as number)
    await page.waitForTimeout(250)
    const noise = (await page.evaluate(() => (window as any).__qa.mut as number)) - m0
    const before = await state(page)
    const held = await loc.evaluate((el) => { const f = el.closest('form'); return !!f && (el as HTMLButtonElement).type !== 'button' && !f.checkValidity() })
    try {
      await loc.scrollIntoViewIfNeeded({ timeout: 6000 })
      // where the pointer reaches it: stacked sheets and overlapping cards cover part of a control, not all of it
      const position = await loc.evaluate((el) => {
        const r = el.getBoundingClientRect()
        for (const [fx, fy] of [[0.5, 0.5], [0.25, 0.5], [0.75, 0.5], [0.5, 0.25], [0.5, 0.75], [0.15, 0.15], [0.85, 0.15], [0.15, 0.85], [0.85, 0.85]]) {
          const x = r.left + r.width * fx
          const y = r.top + r.height * fy
          if (x < 0 || y < 0 || x >= innerWidth || y >= innerHeight) continue
          const at = document.elementFromPoint(x, y)
          if (at && (el === at || el.contains(at))) return { x: r.width * fx, y: r.height * fy }
        }
        return undefined
      })
      await loc.click({ timeout: 6000, position }).catch(async () => {
        // busy machines and arrival animations make a first try fail; the second is the answer
        await page.waitForTimeout(1500)
        await loc.click({ timeout: 10_000, position })
      })
    } catch (e) {
      const m = String((e as Error).message)
      const by = m.match(/(<[^>\n]{1,100}>)[^\n]{0,60}?intercepts pointer events/)?.[1]
      if (by) covered.push(`${name} is covered by ${by}`)
      else if (/outside of the viewport/.test(m)) covered.push(`${name}: ${m.split('\n')[0].slice(0, 100)}`)
      continue
    }
    // a press is given up to two seconds to answer: a client navigation on a slow machine is not a dead button
    let after = await state(page)
    for (let waited = 0; waited < 1500 && !moved(before, after, noise); waited += 250) {
      await page.waitForTimeout(250)
      after = await state(page)
    }
    // a submit on a form that is not yet valid is answered by the browser: it holds the form and focuses the first field to fix
    const validated = await page.evaluate(() => { const a = document.activeElement; return !!a && a.matches?.(':invalid') === true })
    if (!moved(before, after, noise) && !(held && validated)) dead.push(name)
    // what the press opened (a palette, a dialog, a menu) is closed again, as a person would, before the next press
    await page.keyboard.press('Escape')
    await page.waitForTimeout(200)
    if (page.url().split('#')[0] !== start.split('#')[0]) {
      next++
      return { dead, covered, next, left: true, total: ids.length }
    }
  }
  return { dead, covered, next, left: false, total: ids.length }
}

/** The observable state of the page, as far as a press can change it. */
async function state(page: Page) {
  return page.evaluate(() => {
    const w = window as any
    const aria = Array.from(document.querySelectorAll('[aria-expanded],[aria-pressed],[aria-checked],[aria-selected],[aria-current],[aria-hidden],[open],[data-state],[data-open],[data-active]'))
      .map((el) => `${el.getAttribute('aria-expanded')}${el.getAttribute('aria-pressed')}${el.getAttribute('aria-checked')}${el.getAttribute('aria-selected')}${el.getAttribute('aria-current')}${el.getAttribute('aria-hidden')}${el.hasAttribute('open')}${el.getAttribute('data-state')}${el.getAttribute('data-open')}${el.getAttribute('data-active')}`)
      .join('|')
    const dialogs = document.querySelectorAll('dialog[open], [role=dialog], [role=menu], [role=listbox], [popover]:popover-open').length
    const active = document.activeElement
    const body = document.body.innerText.length
    const classes = Array.from(document.querySelectorAll('html, body, header, nav, main, section, form, dialog, [role=dialog], [data-slot]')).map((e) => e.className).join('|').length
    const invalid = document.querySelectorAll(':invalid, [aria-invalid=true]').length
    return {
      url: location.href,
      scrollY: Math.round(scrollY),
      aria,
      dialogs,
      focus: active ? `${active.tagName}${active.id}${(active as HTMLElement).getAttribute?.('data-qa') ?? ''}` : '',
      body,
      classes,
      nodes: document.getElementsByTagName('*').length,
      invalid,
      calls: w.__qa?.calls.length ?? 0,
      resources: performance.getEntriesByType('resource').length,
      mut: w.__qa?.mut ?? 0,
    }
  })
}

const moved = (a: Awaited<ReturnType<typeof state>>, b: Awaited<ReturnType<typeof state>>, noise: number) =>
  a.url !== b.url || Math.abs(a.scrollY - b.scrollY) > 20 || a.aria !== b.aria || a.dialogs !== b.dialogs || a.body !== b.body || a.invalid !== b.invalid || a.calls !== b.calls || a.resources !== b.resources || b.mut - a.mut > noise * 1.5 + 1
