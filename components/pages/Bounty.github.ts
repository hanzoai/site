/* Open bounties, read straight from GitHub as hanzo.ai reads them: open issues labelled bounty across Hanzo's four
   public orgs. Shared by /bounty and /founder. */
import { useEffect, useState } from 'react';
export const ORGS = ['hanzoai', 'hanzo-apps', 'hanzo-go', 'hanzo-js'];
const Q = ['is:issue', 'is:open', 'label:bounty', ...ORGS.map((o) => `org:${o}`)].join(' ');
const Q_ALL = ['is:issue', 'label:bounty', ...ORGS.map((o) => `org:${o}`)].join(' ');
export const SEARCH = `https://github.com/search?type=issues&s=created&o=desc&q=${encodeURIComponent(Q)}`;
export const SEARCH_CLOSED = `https://github.com/search?type=issues&s=created&o=desc&q=${encodeURIComponent(['is:issue', 'is:closed', 'label:bounty', ...ORGS.map((o) => `org:${o}`)].join(' '))}`;
export const REPOS = `https://github.com/orgs/${ORGS[0]}/repositories?type=public`;
export const CONTRIBUTING = `https://github.com/${ORGS[0]}/.github/blob/main/CONTRIBUTING.md`;
const URL_RE = new RegExp(`^https://github\\.com/(${ORGS.join('|')})/([A-Za-z0-9._-]+)/issues/(\\d+)$`);

export interface Bounty {
  repo: string;
  number: number;
  title: string;
  url: string;
  tier: string | null;
  state?: string;
  labels?: string[];
  body?: string;
  author?: string;
  comments?: number;
  createdAt?: string;
}
export interface OpenBounties { total: number; closedTotal?: number; items: Bounty[] }
export type BountyState = { kind: 'reading' } | { kind: 'ready'; open: OpenBounties } | { kind: 'unreachable' };

// the fields read from one item of GitHub's issue search
interface Label { name?: unknown }
interface GitHubItem {
  pull_request?: unknown;
  html_url?: unknown;
  title?: unknown;
  labels?: unknown;
  state?: unknown;
  body?: unknown;
  user?: { login?: unknown } | null;
  comments?: unknown;
  created_at?: unknown;
}

function cleanExcerpt(raw: unknown): string {
  if (typeof raw !== 'string' || !raw.trim()) return '';
  const s = raw
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[#*`>_~-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return s.length > 200 ? s.slice(0, 200) + '…' : s;
}

// one GitHub item -> { repo, number, title, url, tier } or null (pull requests, other orgs, unlabelled are dropped)
export function issue(e: GitHubItem | null | undefined): Bounty | null {
  if (!e || typeof e !== 'object' || e.pull_request) return null;
  const url = typeof e.html_url === 'string' ? e.html_url : '';
  const m = URL_RE.exec(url);
  if (!m || typeof e.title !== 'string' || !e.title.trim()) return null;
  const labels = Array.isArray(e.labels) ? e.labels.map((l: Label | string | null) => (l && typeof l === 'object' ? String(l.name ?? '') : String(l))) : [];
  if (!labels.includes('bounty')) return null;
  const tier = labels.map((l: string) => /^bounty:(.+)$/.exec(l)?.[1]?.trim()).find(Boolean) ?? null;
  return { repo: `${m[1]}/${m[2]}`, number: Number(m[3]), title: e.title.trim(), url, tier };
}

export function richIssue(e: GitHubItem | null | undefined): Bounty | null {
  const base = issue(e);
  if (!base || !e) return null;
  const labels = Array.isArray(e.labels)
    ? e.labels.map((l: Label | string | null) => (l && typeof l === 'object' ? String(l.name ?? '') : String(l))).filter(Boolean).slice(0, 6)
    : [];
  const state = typeof e.state === 'string' ? e.state : 'open';
  const body = cleanExcerpt(e.body);
  const author = e.user && typeof e.user === 'object' && typeof e.user.login === 'string' ? e.user.login : 'hanzoai';
  const comments = typeof e.comments === 'number' ? e.comments : 0;
  const createdAt = typeof e.created_at === 'string' ? e.created_at.slice(0, 10) : '';
  return { ...base, state, labels, body, author, comments, createdAt };
}

export async function openBounties(signal?: AbortSignal): Promise<OpenBounties | null> {
  const r = await fetch(`https://api.github.com/search/issues?q=${encodeURIComponent(Q_ALL)}&sort=created&order=desc&per_page=100`, { headers: { accept: 'application/vnd.github+json' }, signal });
  if (!r.ok) return null;
  const d: { total_count?: unknown; items?: unknown } | null = await r.json();
  if (!d || typeof d.total_count !== 'number' || !Array.isArray(d.items)) return null;
  const items = d.items.map(richIssue).filter((b): b is Bounty => b !== null);
  const openCount = items.filter((b) => b.state !== 'closed').length;
  const closedCount = items.filter((b) => b.state === 'closed').length;
  return { total: Math.max(openCount, d.total_count - closedCount), closedTotal: closedCount, items };
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
