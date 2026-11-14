// The browser checks run after `pnpm build` (scripts/events.ts, scripts/ladder.ts): Playwright, the one in
// ~/work/hanzo-inc/app/node_modules with its browsers, and the export in out/ served as https://hanzo.ai the way the
// Sites plane serves it (<route>, <route>.html, <route>/index.html), so the host's own keys and links apply.
import { createRequire } from 'node:module';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** The part of Playwright's API these checks call. The package is the app repo's, so its own types are not here. */
export interface Request { url(): string; method(): string; postData(): string | null }
export interface Route {
  request(): Request;
  fulfill(o: { status?: number; body?: string | Buffer; headers?: Record<string, string> }): Promise<void>;
  abort(): Promise<void>;
  continue(): Promise<void>;
}
export interface Locator {
  first(): Locator;
  locator(selector: string, o?: { hasText?: string | RegExp }): Locator;
  click(): Promise<void>;
  fill(text: string): Promise<void>;
  focus(): Promise<void>;
  getAttribute(name: string): Promise<string | null>;
  inputValue(): Promise<string>;
  count(): Promise<number>;
  allTextContents(): Promise<string[]>;
  scrollIntoViewIfNeeded(): Promise<void>;
  boundingBox(): Promise<{ x: number; y: number; width: number; height: number } | null>;
  screenshot(o: { path: string }): Promise<unknown>;
  evaluate<R>(fn: (el: HTMLElement) => R): Promise<Awaited<R>>;
}
export interface ConsoleMessage { type(): string; text(): string }
export interface Page {
  close(): Promise<void>;
  on(event: 'pageerror', fn: (e: Error) => void): void;
  on(event: 'console', fn: (m: ConsoleMessage) => void): void;
  goto(url: string, o?: { waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' | 'commit' }): Promise<unknown>;
  waitForTimeout(ms: number): Promise<void>;
  evaluate<R>(fn: () => R): Promise<Awaited<R>>;
  evaluate<R, A>(fn: (arg: A) => R, arg: A): Promise<Awaited<R>>;
  locator(selector: string, o?: { hasText?: string | RegExp }): Locator;
  getByRole(role: string, o?: { name?: string | RegExp }): Locator;
  keyboard: { press(key: string): Promise<void> };
  mouse: { move(x: number, y: number, o?: { steps?: number }): Promise<void>; wheel(dx: number, dy: number): Promise<void>; down(): Promise<void>; up(): Promise<void>; click(x: number, y: number): Promise<void> };
  touchscreen: { tap(x: number, y: number): Promise<void> };
}
export interface Context {
  route(url: string | RegExp, handler: (route: Route) => unknown): Promise<void>;
  newPage(): Promise<Page>;
  addInitScript(fn: () => void): Promise<void>;
  newCDPSession(page: Page): Promise<{ send(method: string, params?: object): Promise<unknown> }>;
  close(): Promise<void>;
}
export interface Browser {
  newContext(o?: { viewport?: { width: number; height: number }; permissions?: string[]; deviceScaleFactor?: number; isMobile?: boolean; hasTouch?: boolean }): Promise<Context>;
  close(): Promise<void>;
}

const require = createRequire(path.join(os.homedir(), 'work/hanzo-inc/app/package.json'));
export const chromium: { launch(): Promise<Browser> } = require('@playwright/test').chromium;

export const OUT = fileURLToPath(new URL('../out/', import.meta.url));
export const HOST = 'https://hanzo.ai';
const TYPES: Record<string, string> = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.woff2': 'font/woff2', '.txt': 'text/plain', '.webm': 'video/webm', '.jpg': 'image/jpeg', '.ico': 'image/x-icon', '.md': 'text/markdown', '.xml': 'application/xml' };

/** Every request to https://hanzo.ai in the context is answered from out/; a page the build lacks is a 404. */
export const host = (ctx: Context) => ctx.route(/^https:\/\/hanzo\.ai\//, (route) => {
  const p = decodeURIComponent(new URL(route.request().url()).pathname);
  const clean = p.replace(/\/$/, '') || '/index';
  const f = [path.join(OUT, p), path.join(OUT, clean + '.html'), path.join(OUT, p, 'index.html')].find((c) => fs.existsSync(c) && !fs.statSync(c).isDirectory());
  if (!f) return route.fulfill({ status: 404, body: 'missing' });
  route.fulfill({ status: 200, body: fs.readFileSync(f), headers: { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' } });
});
