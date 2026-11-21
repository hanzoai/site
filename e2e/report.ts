/**
 * The findings of a run, as a table: every test attaches its own (`findings`), this joins them into findings.json
 * and prints the count per class and the first of each.
 */
import { appendFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { FullResult, Reporter, TestCase, TestResult } from '@playwright/test/reporter'
import type { Finding } from './probe'

export default class Findings implements Reporter {
  private all: Finding[] = []
  private ran = 0
  constructor(private opts: { out: string }) {}
  onTestEnd(_test: TestCase, result: TestResult) {
    this.ran++
    const a = result.attachments.find((x) => x.name === 'findings')
    let mine: Finding[] = []
    if (a?.body) mine = JSON.parse(a.body.toString()) as Finding[]
    else if (result.status !== 'passed' && result.status !== 'skipped') {
      mine = [{ class: 'harness', route: _test.title, viewport: '', theme: '', detail: (result.error?.message ?? result.status).split('\n')[0].slice(0, 200) }]
    }
    this.all.push(...mine)
    // one line per finding as it happens, so a long run can be read while it runs
    mkdirSync(this.opts.out, { recursive: true })
    if (mine.length) appendFileSync(join(this.opts.out, 'findings.jsonl'), mine.map((f) => JSON.stringify(f)).join('\n') + '\n')
  }
  onEnd(_result: FullResult) {
    mkdirSync(this.opts.out, { recursive: true })
    writeFileSync(join(this.opts.out, 'findings.json'), JSON.stringify(this.all, null, 1))
    const by = new Map<string, Finding[]>()
    for (const f of this.all) by.set(f.class, [...(by.get(f.class) ?? []), f])
    console.log(`\n${this.ran} tests, ${this.all.length} findings`)
    for (const [cls, fs] of [...by].sort((a, b) => b[1].length - a[1].length)) {
      const routes = new Set(fs.map((f) => f.route)).size
      console.log(`  ${cls.padEnd(10)} ${String(fs.length).padStart(5)} on ${routes} routes   e.g. ${fs[0].route} ${fs[0].viewport} ${fs[0].theme}: ${fs[0].detail.slice(0, 110)}`)
    }
  }
}
