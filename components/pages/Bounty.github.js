/* Open bounties, read straight from GitHub as hanzo.ai reads them: open issues labelled bounty across Hanzo's four
   public orgs. Shared by /bounty and /founder. */
import { useEffect, useState } from 'react';
export const ORGS = ['hanzoai', 'hanzo-apps', 'hanzo-go', 'hanzo-js'];
const Q = ['is:issue', 'is:open', 'label:bounty', 'archived:false', ...ORGS.map((o) => `org:${o}`)].join(' ');
export const SEARCH = `https://github.com/search?type=issues&s=created&o=desc&q=${encodeURIComponent(Q)}`;
export const REPOS = `https://github.com/orgs/${ORGS[0]}/repositories?type=public`;
export const CONTRIBUTING = `https://github.com/${ORGS[0]}/.github/blob/main/CONTRIBUTING.md`;
const URL_RE = new RegExp(`^https://github\\.com/(${ORGS.join('|')})/([A-Za-z0-9._-]+)/issues/(\\d+)$`);

// one GitHub item -> { repo, number, title, url, tier } or null (pull requests, other orgs, unlabelled are dropped)
export function issue(e) {
  if (!e || typeof e !== 'object' || e.pull_request) return null;
  const url = typeof e.html_url === 'string' ? e.html_url : '';
  const m = URL_RE.exec(url);
  if (!m || typeof e.title !== 'string' || !e.title.trim()) return null;
  const labels = Array.isArray(e.labels) ? e.labels.map((l) => (l && typeof l === 'object' ? String(l.name ?? '') : String(l))) : [];
  if (!labels.includes('bounty')) return null;
  const tier = labels.map((l) => /^bounty:(.+)$/.exec(l)?.[1]?.trim()).find(Boolean) ?? null;
  return { repo: `${m[1]}/${m[2]}`, number: Number(m[3]), title: e.title.trim(), url, tier };
}

export async function openBounties(signal) {
  const r = await fetch(`https://api.github.com/search/issues?q=${encodeURIComponent(Q)}&sort=created&order=desc&per_page=50`, { headers: { accept: 'application/vnd.github+json' }, signal });
  if (!r.ok) return null;
  const d = await r.json();
  if (!d || typeof d.total_count !== 'number' || !Array.isArray(d.items)) return null;
  const items = d.items.map(issue).filter(Boolean);
  return { total: Math.max(d.total_count, items.length), items };
}

// { kind: 'reading' | 'ready' | 'unreachable', open? } — 'ready' with no items means none is open
export function useBounties() {
  const [st, setSt] = useState({ kind: 'reading' });
  useEffect(() => {
    const c = new AbortController();
    openBounties(c.signal).then((o) => setSt(o ? { kind: 'ready', open: o } : { kind: 'unreachable' })).catch(() => { if (!c.signal.aborted) setSt({ kind: 'unreachable' }); });
    return () => c.abort();
  }, []);
  return st;
}
export const SAY = { reading: 'Asking GitHub for the open bounties.', unreachable: 'GitHub did not answer. Every open bounty is listed there.', none: 'No bounty is open right now. Propose one below.' };
