/* Open bounties, read straight from GitHub as hanzo.ai reads them: open issues labelled bounty across Hanzo's four
   public orgs. Shared by /bounty and /founder. */
import { useEffect, useState } from 'react';
export const ORGS = ['hanzoai', 'hanzo-apps', 'hanzo-go', 'hanzo-js'];
const Q = ['is:issue', 'is:open', 'label:bounty', 'archived:false', ...ORGS.map((o) => `org:${o}`)].join(' ');
const Q_PR = Q + ' linked:pr';
export const SEARCH = `https://github.com/search?type=issues&s=created&o=desc&q=${encodeURIComponent(Q)}`;
export const REPOS = `https://github.com/orgs/${ORGS[0]}/repositories?type=public`;
export const CONTRIBUTING = `https://github.com/${ORGS[0]}/.github/blob/main/CONTRIBUTING.md`;
const URL_RE = new RegExp(`^https://github\\.com/(${ORGS.join('|')})/([A-Za-z0-9._-]+)/issues/(\\d+)$`);

export interface Bounty {
  repo: string;
  number: number;
  title: string;
  url: string;
  tier: string | null;
  amount: string | null;
  status: 'open' | 'has-pr' | 'claimed';
  opened: string;
}
export interface OpenBounties { total: number; items: Bounty[] }
export type BountyState = { kind: 'reading' } | { kind: 'ready'; open: OpenBounties } | { kind: 'unreachable' };

// the fields read from one item of GitHub's issue search
interface Label { name?: unknown }
interface GitHubItem { pull_request?: unknown; html_url?: unknown; title?: unknown; labels?: unknown; assignee?: unknown; created_at?: unknown }

// one GitHub item -> { repo, number, title, url, tier, amount, status, opened } or null (pull requests, other orgs, unlabelled are dropped)
export function issue(e: GitHubItem | null | undefined): Bounty | null {
  if (!e || typeof e !== 'object' || e.pull_request) return null;
  const url = typeof e.html_url === 'string' ? e.html_url : '';
  const m = URL_RE.exec(url);
  if (!m || typeof e.title !== 'string' || !e.title.trim()) return null;
  const labels = Array.isArray(e.labels) ? e.labels.map((l: Label | string | null) => (l && typeof l === 'object' ? String(l.name ?? '') : String(l))) : [];
  if (!labels.includes('bounty')) return null;
  const tier = labels.map((l: string) => /^bounty:(.+)$/.exec(l)?.[1]?.trim()).find(Boolean) ?? null;
  const amount = labels.map(amountOf).find(Boolean) ?? null;
  const opened = typeof e.created_at === 'string' ? e.created_at : '';
  return { repo: `${m[1]}/${m[2]}`, number: Number(m[3]), title: e.title.trim(), url, tier, amount, status: 'open', opened };
}

// amountOf: only when a label states it, never guessed. bounty:$500, $500, 500 USD, bounty-500
const AMOUNT_RE = /(?:^|[^-])(?:bounty-?\$?|\$)(\d{1,3}(?:,\d{3})*(?:\.\d+)?|\d+(?:\.\d+)?)\s*(?:USD|usd)?$/;
export function amountOf(label: string): string | null {
  const m = AMOUNT_RE.exec(label);
  if (!m) return null;
  return m[1] + (label.includes('USD') || label.includes('usd') ? ' USD' : '');
}

export function markStatus(items: Bounty[], prNumbers: Set<number>): Bounty[] {
  return items.map((b) => ({ ...b, status: prNumbers.has(b.number) ? 'has-pr' : b.status }));
}

export async function openBounties(signal: AbortSignal): Promise<OpenBounties | null> {
  const r = await fetch(`https://api.github.com/search/issues?q=${encodeURIComponent(Q)}&sort=created&order=desc&per_page=50`, { headers: { accept: 'application/vnd.github+json' }, signal });
  if (!r.ok) return null;
  const d: { total_count?: unknown; items?: unknown } | null = await r.json();
  if (!d || typeof d.total_count !== 'number' || !Array.isArray(d.items)) return null;
  const items = d.items.map(issue).filter((b): b is Bounty => b !== null);
  return { total: Math.max(d.total_count, items.length), items };
}

// { kind: 'reading' | 'ready' | 'unreachable', open? } — 'ready' with no items means none is open
export function useBounties() {
  const [st, setSt] = useState<BountyState>({ kind: 'reading' });
  useEffect(() => {
    const c = new AbortController();
    openBounties(c.signal).then((o) => setSt(o ? { kind: 'ready', open: o } : { kind: 'unreachable' })).catch(() => { if (!c.signal.aborted) setSt({ kind: 'unreachable' }); });
    return () => c.abort();
  }, []);
  return st;
}
// Only Hanzo's own line is spoken; when GitHub does not answer, or nothing is open, the page shows Hanzo's own links
// ("Every open bounty", "Propose a bounty") instead of a sentence of ours.
export const SAY = { reading: 'Asking GitHub for the open bounties.', unreachable: '', none: '' };
