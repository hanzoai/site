import { join } from 'node:path'

/** The site a run asks, and where it writes (findings.json, findings.jsonl, the links each page met, Playwright's results). */
export const BASE = process.env.BASE_URL ?? 'https://hanzo.ai'
export const OUT = join(import.meta.dirname, '.out')
