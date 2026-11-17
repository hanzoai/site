/* Open bounties, read straight from GitHub as hanzo.ai reads them: open issues labelled bounty across Hanzo's three
   public orgs. Shared by /bounty and /founder. */
import { useEffect, useState } from 'react';
export const ORGS = ['hanzoai', 'hanzo-apps', 'hanzo-go'];
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
export type BountyState = { kind: 'reading' } | { kind: 'ready'; open: OpenBounties; updated: number } | { kind: 'unreachable' };

// the fields read from one item of GitHub's issue search
interface Label { name?: unknown }
interface GitHubItem { pull_request?: unknown; html_url?: unknown; title?: unknown; labels?: unknown; assignee?: unknown; assignees?: unknown; created_at?: unknown }

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
  const a = e.assignee;
  const as = e.assignees;
  const hasAssignee = (a && typeof a === 'object') || (Array.isArray(as) && as.length > 0);
  return { repo: `${m[1]}/${m[2]}`, number: Number(m[3]), title: e.title.trim(), url, tier, amount, status: hasAssignee ? 'claimed' : 'open', opened };
}

// amountOf: only when a label states it, never guessed. bounty:$500, $500, 500 USD, bounty-500
const MONEY_RE = /\d{1,3}(?:,\d{3})*(?:\.\d+)?|\d+(?:\.\d+)?/;
export function amountOf(label: string): string | null {
  const plain = /^\s*\d[\d,]*(\.\d+)?\s*USD\s*$/i.test(label.trim());
  const m = /(?:bounty[:-]?\$?|\$)/i.test(label) ? MONEY_RE.exec(label.replace(/^.*?(?:bounty[:-]?\$?|\$)/i, '')) : plain ? MONEY_RE.exec(label.trim()) : null;
  if (!m) return null;
  return m[0] + (/\bUSD\b/i.test(label) ? ' USD' : '');
}

// key PRs by repo#number so hanzoai/hips#18 and hanzoai/cloud#18 never collide; claimed wins over has-pr
export function markStatus(items: Bounty[], prKeys: Set<string>): Bounty[] {
  return items.map((b) => {
    if (b.status === 'claimed') return b;
    return { ...b, status: prKeys.has(`${b.repo}#${b.number}`) ? 'has-pr' : 'open' };
  });
}

// search issues, paginating (per_page=100) until all are read, cap 1000. status is the HTTP status of a failed
// read (null on success / network error); items may be partial on failure.
export async function searchPages(q: string, signal: AbortSignal, limit = 1000): Promise<{ total: number; items: Bounty[]; status: number | null } | null> {
  const headers = { accept: 'application/vnd.github+json' };
  let page = 1;
  let items: Bounty[] = [];
  let total = 0;
  for (;;) {
    const n = page++;
    let r: Response;
    try {
      r = await fetch(`https://api.github.com/search/issues?q=${encodeURIComponent(q)}&sort=created&order=desc&per_page=100&page=${n}`, { headers, signal });
    } catch {
      // a thrown fetch (network error, CORS, abort) is a failure
      return { total, items, status: 0 };
    }
    if (!r.ok) return { total, items, status: r.status };
    let d: { total_count?: unknown; items?: unknown } | null;
    try {
      d = await r.json();
    } catch {
      d = null;
    }
    // a malformed body on any page after the first is a failure, not a success with a partial list
    if (!d || typeof d.total_count !== 'number' || !Array.isArray(d.items)) return { total, items, status: n > 1 ? 0 : null };
    total = d.total_count;
    items = items.concat(d.items.map(issue).filter((b): b is Bounty => b !== null));
    if (d.items.length < 100 || items.length >= limit) break;
  }
  return { total, items: items.slice(0, limit), status: null };
}

export async function openBounties(signal: AbortSignal): Promise<{ total: number; items: Bounty[]; status: number | null } | null> {
  const first = await searchPages(Q, signal);
  if (!first) return null;
  const pr = await searchPages(Q_PR, signal);
  const prKeys = new Set(pr ? pr.items.map((b) => `${b.repo}#${b.number}`) : []);
  return { total: first.total, items: markStatus(first.items, prKeys), status: first.status };
}

// { kind: 'reading' | 'ready' | 'unreachable', open?, updated? } — 'ready' with no items means none is open.
// Re-reads every 60s while the tab is visible, immediately when it becomes visible again, aborts in-flight reads on
// unmount, backs off to 5 min after a 403/429, and never replaces a good list with an empty or failed one.
export function useBounties() {
  const [st, setSt] = useState<BountyState>({ kind: 'reading' });
  useEffect(() => {
    const c = new AbortController();
    let timer: any = 0;
    let backoffUntil = 0;
    let lastGood: { total: number; items: Bounty[] } | null = null;
    let reading = false;

    const read = async () => {
      if (c.signal.aborted || reading) return;
      reading = true;
      let o: { total: number; items: Bounty[]; status: number | null } | null = null;
      try {
        o = await openBounties(c.signal);
      } catch {
        o = null;
      } finally {
        reading = false;
      }
      if (c.signal.aborted) return;
      const now = Date.now();
      if (o && o.status === null) {
        lastGood = { total: o.total, items: o.items };
        setSt({ kind: 'ready', open: o, updated: now });
        backoffUntil = 0;
      } else {
        const status = o?.status ?? null;
        if (status === 403 || status === 429) backoffUntil = now + 5 * 60 * 1000;
        // never replace a good list with an empty or failed one; rely on lastGood (not a stale st.kind)
        if (!lastGood) setSt({ kind: 'unreachable' });
      }
      schedule();
    };

    const schedule = () => {
      clearTimeout(timer);
      if (document.visibilityState !== 'visible') return;
      const now = Date.now();
      const delay = now < backoffUntil ? backoffUntil - now : 60 * 1000;
      timer = setTimeout(() => { if (!c.signal.aborted) read(); }, delay);
    };

    const onVis = () => {
      if (document.visibilityState === 'visible') { read(); schedule(); }
    };
    read();
    addEventListener('visibilitychange', onVis);
    return () => {
      clearTimeout(timer);
      c.abort();
      removeEventListener('visibilitychange', onVis);
    };
  }, []);
  return st;
}

// Only Hanzo's own line is spoken; when GitHub does not answer, or nothing is open, the page shows Hanzo's own links
// ("Every open bounty", "Propose a bounty") instead of a sentence of ours.
export const SAY = { reading: 'Asking GitHub for the open bounties.', unreachable: '', none: '' };
