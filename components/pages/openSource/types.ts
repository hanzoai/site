// The shapes behind /open-source: what scripts/live.ts hands shape() (oss-stats and oss-activity, as lib/oss.ts's
// combine() writes them), what shape() returns and snapshot.ts holds, and what the API's activity read can replace.

import type { combine } from '../../../lib/oss.ts';

export interface Language { name: string; count: number }

/* what lib/oss.ts's combine() hands shape(): oss-stats (sum) and oss-activity (act) */
export type Summary = ReturnType<typeof combine>['sum'];
export type Activity = ReturnType<typeof combine>['act'];

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
