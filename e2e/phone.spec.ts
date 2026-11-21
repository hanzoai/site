/**
 * The phone header has a way in: at 390px the home page shows "Sign in" beside "Try Hanzo", light and dark, and it
 * goes to hanzo.ai/login, the one address of sign-in (universe docs/urls.md).
 */
import { expect, test } from '@playwright/test'

for (const scheme of ['light', 'dark'] as const) {
  test(`390px home, ${scheme}: Sign in is visible and reaches /login`, async ({ browser, baseURL }) => {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, colorScheme: scheme, baseURL })
    const page = await context.newPage()
    await page.goto('/', { waitUntil: 'load' })
    const link = page.locator('header a[data-slot="signin"]')
    await expect(link).toBeVisible()
    await expect(link).toHaveText('Sign in')
    await expect(link).toHaveAttribute('href', 'https://hanzo.ai/login')
    // next to the CTA, in the header, inside the screen, and a target a finger can hit
    const box = (await link.boundingBox())!
    expect(box.x).toBeGreaterThanOrEqual(0)
    expect(box.x + box.width).toBeLessThanOrEqual(390)
    const cta = (await page.locator('header a[data-slot="header-primary"], header a[href="https://hanzo.ai/signup"]').first().boundingBox())!
    expect(box.x + box.width).toBeLessThanOrEqual(cta.x + 1)
    await link.tap()
    await page.waitForURL(/^https:\/\/hanzo\.ai\/login/, { timeout: 30_000 })
    await context.close()
  })
}

test('1440px home has no Sign in link: the Log in menu is the desktop way in', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/', { waitUntil: 'load' })
  await expect(page.locator('header a[data-slot="signin"]')).toBeHidden()
  await expect(page.locator('header button[data-slot="login"]')).toBeVisible()
})
