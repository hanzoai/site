// The repositories Hanzo, Lux and Zoo publish and the work done in them: hanzo-inc/app's scripts/sync-oss.ts, for the two
// pages that show them (the home's open-source band and /open-source). Three steps, kept apart because they cost
// differently, and nothing here reads a page of hanzo.ai:
//   estate()   GET api.hanzo.ai/v1/git/activity, no key: the year's commits and merges, the days, the latest commits, the
//              months of every org and repository, and the forge's own figures. Every build reads it.
//   github()   GET api.github.com/orgs/<org>/repos and what only GitHub knows: stars, forks, languages, contributors, an
//              org's own description. About 150 calls, so it takes a token (GITHUB_TOKEN); a push reuses the contributors,
//              sites and org descriptions of the last read it holds.
//   combine()  the two as sync-oss.ts writes them (oss-stats.json and oss-activity.json), with no network.

/** A commit the estate lists. */
export interface Commit { repo: string; at: string; sha: string; message: string; url: string; ours?: boolean }
/** A group of the estate (hanzo, lux, zoo) as the activity feed counts it. */
export interface Counted {
  name: string; mirrors: number; daily: Record<string, number>; active: Record<string, number>; latest: Commit[];
  orgs: number; repos: number; public: number; private: number; active30: number; commits: number; merges: number; ours: number;
  contributors: number; people: number; months: number[]; mergeMonths: number[]; oursMonths: number[];
}
/** An org of the estate, as the feed lists it. */
export interface Org { name: string; group: string; github?: string; commits?: number; months?: number[]; forge?: string }
/** A repository of the estate, as the feed lists it. */
export interface Repo { repo: string; org?: string; commits: number; months?: number[]; github?: string; forge?: string }
/** The estate's year as GET /v1/git/activity answers it, its repository pages joined. */
export interface Estate {
  read: string; window: { from: string; to: string }; months: string[]; complete: boolean;
  totals: Omit<Counted, 'name' | 'mirrors' | 'daily' | 'active' | 'latest'> & { active: number };
  groups: Counted[]; orgs: Org[]; repos: Repo[];
}
/** What GitHub says of an org: its own name and description. */
interface About { name?: string | null; description?: string | null }
/** A repository card on the home and /open-source. */
export interface Card {
  repo: string; description?: string; language?: string; stars?: number; forks?: number; commits?: number; months?: number[];
  contributors?: number; faces?: string[]; pushed?: string; site?: string;
}
/** An org on a group's directory. */
export interface Entry extends About { login: string; repos: number; stars: number }
/** What GitHub says of one group: counts, languages, the orgs and the cards. */
export interface Held {
  checked: number; repos: number; public: number; stars: number; forks: number;
  languages: { name: string; count: number }[]; orgs: Entry[]; top: Card[];
}
/** What github() answers, and what a push keeps for the next one. */
export interface Hub { groups: Record<string, Held> }
/** A repository as GitHub lists an org's. */
interface Row {
  full_name: string; name: string; stargazers_count?: number; forks_count?: number; fork?: boolean; archived?: boolean;
  language?: string | null; pushed_at?: string | null; description?: string | null; homepage?: string | null;
}

const ACTIVITY = 'https://api.hanzo.ai/v1/git/activity';
const GITHUB = 'https://api.github.com';
const FORGE = 'https://git.hanzo.ai';
const DAY = 864e5;

// Each group's name, the org its GitHub link opens and the repositories it leads with: the site's own editorial choices.
// The orgs of a group are the estate's: the ones GitHub holds.
export const GROUPS = {
  hanzo: { name: 'Hanzo', lead: 'hanzoai', featured: ['hanzoai/ai', 'hanzoai/engine', 'hanzoai/cloud', 'hanzoai/dev', 'hanzoai/cli', 'hanzoai/mcp', 'hanzoai/bot', 'hanzoai/ui', 'hanzoai/iam', 'hanzoai/ml', 'hanzoai/chat', 'hanzoai/gui', 'hanzoai/base', 'hanzoai/kms', 'hanzoai/flow', 'hanzoai/insights'] },
  lux: { name: 'Lux', lead: 'luxfi', featured: ['luxfi/node', 'luxfi/consensus', 'luxfi/evm', 'luxfi/threshold', 'luxfi/cli', 'luxfhe/torus'] },
  zoo: { name: 'Zoo', lead: 'zooai', featured: ['zooai/ai', 'zooai/node', 'zooai/ngo', 'zooai/proofs', 'zooai/cli', 'zooai/evm'] },
};
// implementation repositories: counted in the totals, never shown as cards
const UNLISTED = new Set(['hanzoai/laya', 'hanzoai/sensei.group', 'hanzo-apps/sensei.group', 'hanzo-community/hanzo_sensei-group']);

// A description as these pages print it (hanzo-inc/app lib/upstream.ts and scripts/claims.ts): sentences about where
// weights come from are dropped, then every clause naming an upstream checkpoint, and a description that makes a claim
// Hanzo's pages do not make is left out whole.
const NAMED = /\b(?:Qwen|Flash-Next|Tongyi|DeepSeek|MiniMax|Wan-AI|Wan2|granite|Nemotron|Bonsai|unsloth|TRELLIS|JeffreyXiang|YuE|m-a-p)/i;
const LINEAGE = /repackag|re-?host|fine-?tun\w* (?:of|from)|lineage|related open weights/i;
const CLAIMS = [
  /SOC ?2 Type ?(II|2)\b/i, /ISO[/ ]?(IEC )?27001/i, /FedRAMP/i, /PCI[- ]DSS/i, /HIPAA (BAA|compliant)/i, /BAA (signed|available|compatible)/i, /\bIL[56]\b/,
  /broker-dealer/i, /transfer[- ]agent/i, /alternative trading system/i, /\bATS, /,
  /\$[\d.,]+ of (prepaid )?credit/i, /\bincludes?\b[^.]{0,60}\bof (prepaid )?credit\b/i, /credit included/i, /included credit/i, /billed at cost from prepaid credit/i,
  /first 24 ?h(ours)?\b/i, /case study(&nbsp;|\s)*↗/i,
];
export function said(text: string | null | undefined) {
  const kept = (text?.trim() ?? '').split(/(?<=[.;])\s+/).filter((s) => !LINEAGE.test(s)).map((s) => {
    if (!NAMED.test(s)) return s;
    const clauses = s.replace(/[.;]$/, '').split(/,\s+/).filter((c) => !NAMED.test(c));
    return clauses.length ? clauses.join(', ') + (/[.;]$/.exec(s)?.[0] ?? '') : '';
  }).filter(Boolean);
  const cut = kept.join(' ').replace(/;$/, '.').trim().replace(/\s*\([^)]*$/, '').trim();
  return cut && !CLAIMS.some((p) => p.test(cut)) ? cut : undefined;
}

// The estate's year, every page of its public repositories. It must answer whole: a partial answer is not a quiet year.
export async function estate(): Promise<Estate> {
  const page = async (n: number): Promise<Omit<Estate, 'repos'> & { repos: { total: number; data: Repo[] } }> => {
    const res = await fetch(`${ACTIVITY}?limit=200&page=${n}`, { headers: { accept: 'application/json' }, signal: AbortSignal.timeout(30000) });
    if (!res.ok) throw new Error(`${res.status} from ${ACTIVITY}`);
    return res.json();
  };
  const first = await page(1);
  if (first?.complete !== true || !first.totals || !Array.isArray(first.groups) || !Array.isArray(first.orgs) || !Array.isArray(first.repos?.data)) throw new Error('unexpected data: the estate activity');
  const rest = await Promise.all(Array.from({ length: Math.max(0, Math.ceil(first.repos.total / 200) - 1) }, (_, i) => page(i + 2)));
  const repos = [first, ...rest].flatMap((p) => p.repos.data);
  if (repos.length !== first.repos.total) throw new Error(`unexpected data: ${repos.length} of the ${first.repos.total} public repositories the estate counts`);
  return { ...first, repos };
}

// Run fn over items, n at a time, keeping the order of the answers.
async function pool<T, R>(items: T[], n: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => { while (next < items.length) { const i = next++; out[i] = await fn(items[i]); } }));
  return out;
}

// What only GitHub knows. `kept` is the last read this returned; with `thrifty` its cards' contributors and sites and its
// orgs' descriptions are reused instead of asked again.
export async function github({ index, token, kept, thrifty }: { index: Estate; token?: string; kept?: Partial<Hub> | null; thrifty?: boolean }): Promise<{ source: string; groups: Record<string, Held> }> {
  if (!token) throw new Error('needs GITHUB_TOKEN: the organizations take about 150 requests and GitHub allows 60 an hour without one');
  const head = { accept: 'application/vnd.github+json', authorization: 'Bearer ' + token };
  // a read asked again when the network drops it or GitHub says wait: one slow answer in two thousand must not cost the year
  const call = async (url: string): Promise<Response> => {
    for (let i = 0; ; i++) {
      try {
        const res = await fetch(url, { headers: head, signal: AbortSignal.timeout(20000) });
        if (i < 2 && (res.status === 403 || res.status === 429 || res.status >= 500)) { await res.body?.cancel(); throw new Error(String(res.status)); }
        return res;
      } catch (e) { if (i === 2) throw e; await new Promise((r) => setTimeout(r, 2000 * (i + 1))); }
    }
  };
  const fail = (url: string, res: Response) => new Error(`${res.status} from ${url}${res.headers.get('x-ratelimit-remaining') === '0' ? ' (rate limited)' : ''}`);
  const last = (link: string | null, n: number) => Number(/[?&]page=(\d+)>; rel="last"/.exec(link ?? '')?.[1] ?? n);
  // one page of an org's public repositories and the number of its last page; null for an org gone from GitHub
  const one = async (org: string, n: number): Promise<{ rows: Row[]; last: number } | null> => {
    const url = `${GITHUB}/orgs/${org}/repos?type=public&per_page=100&page=${n}`;
    const res = await call(url);
    if (res.status === 404 && n === 1) return null;
    if (!res.ok) throw fail(url, res);
    const rows = await res.json();
    if (!Array.isArray(rows)) throw new Error('unexpected data: ' + url);
    return { rows, last: last(res.headers.get('link'), n) };
  };
  const list = async (org: string) => {
    const first = await one(org, 1);
    if (!first) return null;
    return [first, ...(await Promise.all(Array.from({ length: first.last - 1 }, (_, i) => one(org, i + 2))))].flatMap((p) => p!.rows); // a page after the first is never null
  };
  // how many people GitHub counts as a repository's contributors, and the first five, bots left out of both
  const people = async (full: string): Promise<{ contributors: number; faces: string[] }> => {
    const url = `${GITHUB}/repos/${full}/contributors?per_page=100`;
    const res = await call(url);
    if (!res.ok) throw fail(url, res);
    const humans = (await res.json() as { login?: string; type?: string }[]).filter((r) => r.login && r.type !== 'Bot');
    const faces = humans.slice(0, 5).map((r) => r.login!);
    // a hundred or more is a page to count: ask for one a page and read the last
    if (last(res.headers.get('link'), 1) > 1) {
      const more = await call(url.replace('per_page=100', 'per_page=1'));
      if (!more.ok) throw fail(url, more);
      return { contributors: last(more.headers.get('link'), 1), faces };
    }
    return { contributors: humans.length, faces };
  };
  // a project's own site, kept only when it answers a reader: a card links nothing that does not open
  const site = async (url?: string | null): Promise<string | undefined> => {
    if (!url || !/^https:\/\/[^\s]+$/.test(url.trim())) return undefined;
    try {
      const res = await fetch(url.trim(), { redirect: 'follow', signal: AbortSignal.timeout(10000), headers: { 'user-agent': 'Mozilla/5.0 (compatible; hanzo.ai site)' } });
      return res.ok ? url.trim() : undefined;
    } catch { return undefined; }
  };

  const indexed = new Map(index.repos.map((r) => [r.repo.toLowerCase(), r]));
  const year = new Map([...indexed].map(([k, r]) => [k, r.commits]));
  const groups: Record<string, Held> = {};
  for (const [group, g] of Object.entries(GROUPS)) {
    const orgs = index.orgs.filter((o) => o.group === group && o.github).map((o) => o.name).sort();
    const held = (await pool(orgs, 8, async (org) => ({ org, rows: await list(org) }))).filter((l): l is { org: string; rows: Row[] } => l.rows != null);
    const rows = held.flatMap((l) => l.rows);
    const own = rows.filter((r) => !r.fork);
    // the top of a group: the most starred, then forked, then committed to, then the newest
    const rank = (a: Row, b: Row) => (b.stargazers_count ?? 0) - (a.stargazers_count ?? 0) || (b.forks_count ?? 0) - (a.forks_count ?? 0)
      || (year.get(b.full_name.toLowerCase()) ?? 0) - (year.get(a.full_name.toLowerCase()) ?? 0) || Date.parse(b.pushed_at ?? '0') - Date.parse(a.pushed_at ?? '0');
    const shown = own.filter((r) => !UNLISTED.has(r.full_name));
    const lead = g.featured.map((full) => shown.find((r) => r.full_name === full && !r.archived)).filter((r): r is Row => r != null);
    const picked = [...lead, ...shown.filter((r) => !r.archived && !lead.includes(r)).sort(rank)].slice(0, Math.max(6, g.featured.length));
    const cards = new Map((kept?.groups?.[group]?.top ?? []).map((c) => [c.repo, c]));
    const top = await pool(picked, 6, async (r) => {
      const c = cards.get(r.full_name);
      const [who, home]: [{ contributors?: number; faces?: string[] }, string | undefined] = thrifty && c?.contributors != null ? [c, c.site] : await Promise.all([people(r.full_name), site(r.homepage)]);
      // a repository public on GitHub but not on the forge is not in the estate's list: its year is the last one read
      const f = indexed.get(r.full_name.toLowerCase());
      return { repo: r.full_name, description: said(r.description), language: r.language ?? undefined, stars: r.stargazers_count ?? 0, forks: r.forks_count ?? 0, commits: f?.commits || c?.commits, months: f?.months ?? c?.months, contributors: who.contributors, faces: who.faces, pushed: r.pushed_at ?? undefined, site: home };
    });
    const tongues = new Map<string, number>();
    for (const r of own) if (r.language) tongues.set(r.language, (tongues.get(r.language) ?? 0) + 1);
    const languages = [...tongues].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([name, count]) => ({ name, count }));
    const holding = held.filter((l) => l.rows.some((r) => !r.fork));
    const orgsKept = new Map((kept?.groups?.[group]?.orgs ?? []).map((o): [string, About] => [o.login, o]));
    const about: About[] = await pool(holding, 10, async ({ org }): Promise<About> => {
      if (thrifty && orgsKept.has(org)) return orgsKept.get(org)!;
      const url = `${GITHUB}/orgs/${org}`;
      const res = await call(url);
      if (!res.ok) throw fail(url, res);
      return res.json();
    });
    const directory = holding.map(({ org, rows: mine }, i) => ({
      login: org, name: about[i].name?.trim() || undefined, description: said(about[i].description),
      repos: mine.filter((r) => !r.fork).length, stars: mine.filter((r) => !r.fork).reduce((n, r) => n + (r.stargazers_count ?? 0), 0),
    }));
    groups[group] = {
      checked: held.length, repos: own.length, public: rows.length,
      stars: rows.reduce((n, r) => n + (r.stargazers_count ?? 0), 0),
      forks: rows.reduce((n, r) => n + (r.forks_count ?? 0) + (r.fork ? 1 : 0), 0),
      languages, orgs: directory, top,
    };
  }
  return { source: GITHUB + '/orgs', groups };
}

// The estate and GitHub as sync-oss.ts writes them: `sum` is oss-stats.json (per group the counts, the languages, the
// organizations and the cards; the estate whole; the forge) and `act` is oss-activity.json (per group the days and the
// newest commits). A mirror the forge holds counts once among a group's stars and once among its forks.
export function combine(index: Estate, gh: Hub) {
  const today = Date.parse(`${index.window.to}T00:00:00Z`);
  const indexed = new Map(index.repos.map((r) => [r.repo.toLowerCase(), r]));
  const forged = new Map(index.orgs.map((o) => [o.name.toLowerCase(), o]));
  const groups: Record<string, unknown> = {}, groupsAct: Record<string, unknown> = {};
  for (const [group, g] of Object.entries(GROUPS)) {
    const counted = index.groups.find((x) => x.name === group);
    const h = gh.groups[group];
    if (!counted || !h) throw new Error(`${g.name}: the estate's activity or GitHub names no such group`);
    const days = (n: number) => { let sum = 0; for (let t = today - (n - 1) * DAY; t <= today; t += DAY) sum += counted.daily[new Date(t).toISOString().slice(0, 10)] ?? 0; return sum; };
    groups[group] = {
      name: g.name, lead: g.lead, checked: h.checked,
      orgs: h.orgs.map((o) => { const f = forged.get(o.login.toLowerCase()); return { ...o, commits: f?.commits, months: f?.months, forge: f?.forge }; })
        .sort((a, b) => b.repos - a.repos || a.login.localeCompare(b.login)),
      repos: h.repos, public: h.public, stars: h.stars + counted.mirrors, forks: h.forks + counted.mirrors,
      commits: { year: counted.commits, month: days(30), week: days(7) }, active30: counted.active30,
      estate: Object.fromEntries((['orgs', 'repos', 'public', 'private', 'active30', 'commits', 'merges', 'ours', 'contributors', 'people', 'months', 'mergeMonths', 'oursMonths'] as const).map((k) => [k, counted[k]])),
      languages: h.languages,
      // only the page the estate lists: a forge address made up from a name is a 404 for a repository the forge does not mirror
      top: h.top.map((c) => { const r = indexed.get(c.repo.toLowerCase()); return { ...c, commits: r?.commits || c.commits, months: r?.months ?? c.months, forge: r?.forge }; }),
    };
    groupsAct[group] = {
      daily: counted.daily, active: counted.active,
      latest: counted.latest.slice(0, 8).map((c) => { const home = indexed.get(c.repo.toLowerCase())?.github; return { repo: c.repo, at: c.at, sha: c.sha.slice(0, 7), message: c.message.slice(0, 100), url: home ? `${home}/commit/${c.sha}` : c.url, ours: c.ours }; }),
    };
  }
  const t = index.totals;
  return {
    sum: {
      read: index.read, source: ACTIVITY, groups,
      estate: { read: index.read, window: index.window, months: index.months, complete: index.complete, orgs: t.orgs, repos: t.repos, public: t.public, private: t.private, active: t.active, active30: t.active30, commits: t.commits, merges: t.merges, ours: t.ours, contributors: t.contributors, people: t.people, monthly: t.months, mergeMonths: t.mergeMonths, oursMonths: t.oursMonths },
      // the forge's public figures: what it serves a reader who is signed out
      forge: { read: index.read, source: FORGE, repos: t.public, community: index.repos.filter((r) => r.org === 'hanzo-community').length, ours: index.repos.filter((r) => r.github).length },
    },
    act: { read: index.read, source: ACTIVITY, from: index.window.from, to: index.window.to, groups: groupsAct },
  };
}
