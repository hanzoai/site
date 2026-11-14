// What /oss/<org> shows, read from the captured page by ossData.ts.
import type { Child } from '../CapturedTree.ts';

export interface PageMeta { title: string; description: string }

export interface Figure { value: string; n: number; label: string }

export interface Count { title: string; figures: Figure[]; notes: string[]; spark: number[] | null }

export interface RepoRow {
  name: string;
  href: string | null;
  forge: string | null;
  forgeLabel?: string | null;
  lang: string | null;
  stars: number | null;
  forks: number | null;
  desc: string;
  pushed: string | null;
  at?: string | null;
  commits: string;
  nCommits: number;
  archived?: string | null;
  spark: number[] | null;
}

export interface Repos { title: string; search: string | null; items: RepoRow[]; total: string | null; more: string | null }

export interface Near { org: string; i: number; name: string; lede: string; repos: Figure | null; commits: Figure | null; data: number[] }

export interface OrgDoc {
  org: string;
  route: string;
  label: string;
  name: string;
  lede: string;
  links: { label: string; href: string }[];
  counts: Count[];
  repos: Repos | null;
  extra: { title: string; nodes: Child[] }[];
  key: Figure[];
  spark: number[] | null;
  i: number;
  near: Near[];
}
