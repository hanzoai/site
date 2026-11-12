// node scripts/ladder.ts  (after `pnpm build`): the usage slider on the home and /pricing, in a real browser at 1440, 900,
// 390 and 360, against two catalogs, with every name, price and slug read from the catalog the page is given, never typed here.
//
//   snapshot  commerce does not answer, so the page stands on the build's plan list (content/live/_pricing.json)
//   live      the page reads commerce.hanzo.ai/v1/billing/plans itself, as on hanzo.ai; this script reads the same list
//
// At every stop, reached by the keyboard: the card's name, price and checkout slug are that rung's, the slider says so
// to a screen reader, the stop is named by its multiple of Go (the owner's ladder: 3x 5x 15x 25x 50x ∞) and the last is
// ∞ exactly when Unlimited is sold. A drag (a mouse on a desk, a finger on a phone) reaches the last stop and a tap on a
// stop's name lands there. The card keeps its height and the slider its place, the page never scrolls sideways, and the
// first paint does not shift. A catalog that lacks Ultimate and Unlimited is the fallback: the slider stops at the
// highest rung it sells, whatever the build's list held. Screens of Pro, Max and the last stop go to shots/ladder/.
// The exit code is 1 if any check failed.
import fs from 'node:fs';
import { chromium, host, HOST } from './host.ts';
import { PLANS_URL } from '../lib/liveSources.ts';
import SNAP from '../content/live/_pricing.json' with { type: 'json' };

// the usage ladder above Go, lowest first, and each rung's multiple of Go's usage (hanzo/plans subscription.json)
const LADDER = [['pro-3x', '3x'], ['dev-5x', '5x'], ['max-15x', '15x'], ['ultra', '25x'], ['ultimate', '50x'], ['unlimited', '∞']];
const SHOTS = new URL('../shots/ladder/', import.meta.url).pathname;
fs.mkdirSync(SHOTS, { recursive: true });

// a catalog's rungs, as the page must show them: the ladder's slugs it lists, each with its name and monthly price
const rungsOf = (rows) => LADDER.filter(([s]) => rows[s]).map(([slug, x]) => ({ slug, x, name: rows[slug].name, price: rows[slug].price }));
const live = await (await fetch(PLANS_URL, { signal: AbortSignal.timeout(15000) })).json();
if (!Array.isArray(live)) throw new Error('unexpected data from ' + PLANS_URL);
const CATALOGS = {
  snapshot: rungsOf(SNAP.plans),
  live: rungsOf(Object.fromEntries(live.map((p) => [p.slug, { name: p.name, price: p.price / 100 }]))),
};

const results = [];
const ok = (label, pass, why = '') => { results.push(pass); console.log(`${pass ? 'ok  ' : 'FAIL'} ${label}${pass ? '' : '  ' + why}`); };

// what each page's ladder card shows now; a name or price on its way out (Motion pops it out of the flow) is not read
const CARDS = {
  home: { path: '/', card: '.x-pricing .x-plan.strong', read: (c) => ({
    name: c.querySelector('h3').textContent.trim(),
    price: [...c.querySelectorAll('.x-price-roll b')].filter((b) => getComputedStyle(b).position !== 'absolute').pop()?.textContent.trim(),
    href: c.querySelector('a.x-btn').getAttribute('href'),
  }) },
  pricing: { path: '/pricing', card: '.xpr-card[data-id="pro"]', read: (c) => ({
    name: [...c.querySelectorAll('.xpr-c-name .xpr-swap-i')].filter((s) => getComputedStyle(s).position !== 'absolute').pop()?.textContent.trim(),
    price: c.querySelector('.xpr-fig .v2-odo-t').textContent.trim(),
    href: c.querySelector('a.xpr-cta').getAttribute('href'),
    lit: [...document.querySelectorAll('.xpr-lad-c')].findIndex((x) => x.classList.contains('lit')),
    cols: document.querySelectorAll('.xpr-lad-c').length,
    table: document.querySelectorAll('.xpr-cmp thead th').length,
  }) },
};

const browser = await chromium.launch();
for (const [source, want] of Object.entries(CATALOGS)) {
  const n = want.length;
  console.log(`\n${source}: ${want.map((r) => `${r.name} ${r.x} $${r.price}`).join(' · ')}`);
  ok(`${source}: the ladder runs from Pro`, want[0]?.slug === 'pro-3x' && n >= 4, want.map((r) => r.slug).join());
  for (const width of [1440, 900, 390, 360]) {
    const phone = width < 600;
    const ctx = await browser.newContext({ viewport: { width, height: phone ? 844 : 900 }, deviceScaleFactor: phone ? 3 : 1, isMobile: phone, hasTouch: phone });
    await ctx.addInitScript(() => {
      localStorage.setItem('hz-consent', JSON.stringify({ necessary: true }));
      window.__cls = 0;
      new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
    });
    await ctx.route(/.*/, (r) => r.abort()); // nothing else leaves the machine
    await ctx.route(/^https:\/\/api\.hanzo\.ai\//, (r) => r.fulfill({ status: 200, body: '{}', headers: { 'content-type': 'application/json', 'access-control-allow-origin': HOST, 'access-control-allow-credentials': 'true', 'access-control-allow-headers': '*' } }));
    if (source === 'live') await ctx.route(PLANS_URL, (r) => r.continue()); // commerce, for real
    await host(ctx);
    for (const [where, C] of Object.entries(CARDS)) {
      const at = `${source} ${where} ${width}`;
      const page = await ctx.newPage();
      const errors = [];
      page.on('pageerror', (e) => errors.push(String(e).slice(0, 160)));
      page.on('console', (m) => m.type() === 'error' && !/Failed to load resource|ERR_FAILED/.test(m.text()) && errors.push(m.text().slice(0, 160)));
      await page.goto(HOST + C.path, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);
      const card = page.locator(C.card);
      await card.scrollIntoViewIfNeeded();
      await page.waitForTimeout(600);
      const input = card.locator('.x-usage input');
      const read = () => card.evaluate(C.read);

      const stops = await card.locator('.x-usage li').allTextContents();
      ok(`${at}: the stops are ${want.map((r) => r.x).join(' ')}`, stops.join(' ') === want.map((r) => r.x).join(' '), stops.join(' '));
      ok(`${at}: the last stop is ∞ exactly when Unlimited is sold`, (stops.at(-1) === '∞') === want.some((r) => r.slug === 'unlimited'), stops.at(-1));
      ok(`${at}: the slider goes no higher than the highest rung sold`, (await input.getAttribute('max')) === String(n - 1), await input.getAttribute('max'));
      const box = await input.boundingBox();
      const face = await card.evaluate((c) => { const s = getComputedStyle(c); return c.clientWidth - parseFloat(s.paddingLeft) - parseFloat(s.paddingRight); });
      ok(`${at}: the slider fills the card and is a 44px target`, Math.abs(box.width - face) < 1 && box.height >= 44, `${box.width}x${box.height} in ${face}`);
      const tall = (await card.boundingBox()).height;

      await input.focus();
      await page.keyboard.press('Home');
      for (let k = 0; k < n; k++) {
        if (k) await page.keyboard.press('ArrowRight');
        await page.waitForTimeout(550);
        const r = want[k];
        const got = await read();
        const plan = new URL(got.href, HOST).searchParams.get('plan');
        ok(`${at}: stop ${k + 1} is ${r.name}, $${r.price}, checkout ${r.slug}`, got.name === r.name && got.price === '$' + r.price && plan === r.slug && new URL(got.href, HOST).pathname === '/pay/confirm/card', JSON.stringify(got));
        const said = await input.getAttribute('aria-valuetext');
        ok(`${at}: stop ${k + 1} is told as "${said}"`, said === `${r.name}, ${r.x === '∞' ? 'no usage caps' : r.x + ' usage'}, $${r.price} a month`, said);
        if (where === 'pricing') ok(`${at}: the comparison lights ${r.name}`, got.lit === k + 2 && got.cols === n + 2, `lit ${got.lit} of ${got.cols}`);
        const now = await input.boundingBox();
        const h = (await card.boundingBox()).height;
        ok(`${at}: at ${r.name} the card and the slider stay put`, Math.abs(h - tall) < 0.5 && Math.abs(now.y - box.y) < 0.5, `height ${tall} -> ${h}, slider ${box.y} -> ${now.y}`);
        const name = { 0: 'pro', 2: 'max', [n - 1]: 'last' }[k];
        if (name && (width === 1440 || width === 390)) await card.screenshot({ path: `${SHOTS}${where}-${width}-${source}-${name}.png` });
      }

      // a pointer: drag from the first stop to the last, then a tap on the third stop's name
      await page.keyboard.press('Home');
      await page.waitForTimeout(300);
      const b = await input.boundingBox();
      const xAt = (k) => b.x + 22 + ((b.width - 44) * k) / (n - 1);
      const y = b.y + 14;
      if (phone) {
        const cdp = await ctx.newCDPSession(page);
        const touch = (type, x) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y }] });
        await touch('touchStart', xAt(0));
        for (let i = 1; i <= 16; i++) await touch('touchMove', xAt(0) + ((xAt(n - 1) - xAt(0)) * i) / 16);
        await touch('touchEnd');
      } else {
        await page.mouse.move(xAt(0), y);
        await page.mouse.down();
        for (let i = 1; i <= 16; i++) await page.mouse.move(xAt(0) + ((xAt(n - 1) - xAt(0)) * i) / 16, y);
        await page.mouse.up();
      }
      await page.waitForTimeout(700);
      const end = await read();
      ok(`${at}: a ${phone ? 'finger' : 'mouse'} drags to ${want[n - 1].name}`, (await input.inputValue()) === String(n - 1) && new URL(end.href, HOST).searchParams.get('plan') === want[n - 1].slug, `${await input.inputValue()} ${end.href}`);
      if (phone) await page.touchscreen.tap(xAt(2), b.y + b.height - 8);
      else await page.mouse.click(xAt(2), b.y + b.height - 8);
      await page.waitForTimeout(700);
      ok(`${at}: a tap on "${want[2].x}" goes to ${want[2].name}`, (await input.inputValue()) === '2' && (await read()).name === want[2].name, await input.inputValue());

      if (where === 'pricing') {
        await page.locator('.xpr-lad-more > summary').click();
        await page.waitForTimeout(400);
        ok(`${at}: the full comparison has a column for every plan`, (await read()).table === n + 3, String((await read()).table));
      }
      const over = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      ok(`${at}: no sideways scroll`, over <= 0, `${over}px`);
      // the first paint is the catalog's when the build's list is what the page reads; a live list newer than the build's moves it
      const cls = await page.evaluate(() => window.__cls);
      if (source === 'snapshot') ok(`${at}: CLS ${cls.toFixed(4)}`, cls < 0.01, String(cls));
      else console.log(`note ${at}: CLS ${cls.toFixed(4)} (the build's list against today's)`);
      ok(`${at}: no page or console error`, errors.length === 0, errors.join(' | '));
      await page.close();
    }
    await ctx.close();
  }
}
await browser.close();
const failed = results.filter((p) => !p).length;
console.log(`\n${results.length - failed} of ${results.length} checks passed`);
process.exit(failed ? 1 : 0);
