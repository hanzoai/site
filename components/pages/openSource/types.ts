// The shapes behind /open-source: what scripts/live.ts hands shape() (oss-stats and oss-activity, as lib/oss.ts's
// combine() writes them), what shape() returns and snapshot.ts holds, and what the API's activity read can replace.

export interface Language { name: string; count: number }

/* the cards and organizations as lib/oss.ts's combine() writes them: what GitHub did not say stays absent */
export interface SummaryRepo {
  repo: string;
  description?: string;
  language?: string;
  stars?: number;
  forks?: number;
  contributors?: number;
  faces?: string[];
  commits?: number;
  pushed?: string;
  forge?: string;
  months?: number[];
}

export interface SummaryOrg {
  name?: string;
  login: string;
  description?: string;
  repos: number;
  stars: number;
  commits?: number;
  months?: number[];
}

export interface SummaryGroup {
  name: string;
  lead: string;
  checked: number;
  orgs: SummaryOrg[];
  repos: number;
  stars: number;
  forks: number;
  commits: { year: number; month: number; week: number };
  estate: { merges: number };
  languages: Language[];
  top: SummaryRepo[];
}

export interface Summary {
  estate: { commits: number };
  forge: { read: string };
  groups: Record<string, SummaryGroup>;
}

export interface ActivityCommit { repo: string; message: string; at: string; url: string }

export interface ActivityGroup { daily: Record<string, number>; latest: ActivityCommit[] }

export interface Activity { from: string; to: string; groups: Record<string, ActivityGroup> }

/* the page's figures; the tuples are [label, value, note] style rows, kept as the string lists JSON holds */
export interface SnapRepo {
  name: string;
  desc: string;
  lang: string;
  stars: string;
  forks: string;
  av: string;
  more: string;
  people: string;
  commits: string;
  pushed: string;
  to: string;
  months?: number[];
}

export interface SnapEcosystem {
  stats: string[][];
  heat: string;
  window: string;
  commits: string[][];
  read: string;
  langs: string[][];
  langCap: string;
  repos: SnapRepo[];
  readTo: string;
  statTo: string[];
}

export interface SnapOrg {
  name: string;
  login: string;
  repos: string;
  commits: string;
  stars: string;
  desc: string;
  months?: number[];
}

export interface SnapGroup { key: string; name: string; sub: string; orgs: SnapOrg[] }

export interface Snapshot {
  eco: SnapEcosystem[];
  orgs: SnapGroup[];
  total: string[][];
  hero: string[][];
  read: string;
  from: string;
  to: string;
}

/* GET api.hanzo.ai/v1/git/activity: only the parts live.tsx reads */
export interface ApiGroup { name: string; commits: number; merges: number }
export interface ApiOrg { name: string; group?: string; commits?: number; months?: number[] }
export interface ApiLatest { repo: string; message: string; at: string; url: string }
export interface ApiActivity {
  complete?: boolean;
  read?: string;
  groups?: ApiGroup[];
  orgs?: ApiOrg[];
  latest?: ApiLatest[];
  totals?: { commits?: number };
}
