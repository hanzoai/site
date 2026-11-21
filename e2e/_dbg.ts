import { chromium } from '@playwright/test'
const browser = await chromium.launch({ args: ['--no-sandbox'] })
const page = await (await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })).newPage()
await page.goto('https://hanzo.ai/about', { waitUntil: 'load' }); await page.waitForTimeout(2500)
console.log(await page.evaluate(() => Array.from(document.querySelectorAll('header a, header button')).filter((e) => e.getBoundingClientRect().width > 0).map((e) => {
  const r = e.getBoundingClientRect(); const cx = r.left + r.width / 2, cy = r.top + r.height / 2
  const hits = [[-21, -21], [21, -21], [-21, 21], [21, 21]].map(([dx, dy]) => { const a = document.elementFromPoint(cx + dx, cy + dy); return a === e || e.contains(a) ? 'self' : a ? a.tagName + ((a as HTMLElement).dataset.slot ? '[' + (a as HTMLElement).dataset.slot + ']' : '') : 'none' }).join(',')
  return `${(e as HTMLElement).innerText.trim().slice(0, 10) || e.getAttribute('aria-label')?.slice(0, 12)} ${Math.round(r.width)}x${Math.round(r.height)} ${hits} ${e.getAttribute('aria-controls') ?? ''}`
}).join('\n')))
await browser.close()
