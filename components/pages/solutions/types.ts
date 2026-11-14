/* Shared types for the /solutions family: what solData.ts reads from Hanzo's captured pages and what the pages draw. */
import type { Tree } from '../story/types';

export type { Tree };

export interface PageMeta { title: string; description: string }

export interface Link { label: string; href: string }
export interface Job { title: string; text: string }

/* the hero's reel: the film, the label, each job, the product names */
export interface Reel { label: string; steps: Job[]; names: string[]; slug: string | null }
export interface Product { href: string; name: string; text: string }
export interface Runs { title: string; lede: string; items: Product[]; links: Link[] }
export interface Security { title: string; items: Job[]; links: Link[] }
export interface Capacity { title: string; lede: string; head: string[]; rows: string[][] }
export interface More { title: string; links: Link[] }
export interface Band { title: string; lede: string; actions: Link[] }
export interface Extra { title: string; nodes: (Tree | string)[] }

export interface BaseDoc {
  slug: string;
  route: string;
  label: string;
  title: string;
  lede: string;
  actions: Link[];
  reel: Reel | null;
  runs: Runs | null;
  security: Security | null;
  capacity: Capacity | null;
  more: More | null;
  band: Band | null;
  extra: Extra[];
}

/* a sibling the page links to, and what its card opens into */
export interface Sibling {
  slug: string;
  href: string;
  title: string;
  label: string;
  i: number;
  film: string | null;
  first: string;
  n: [number, number];
}

export type SolutionDoc = BaseDoc & { i: number; sibs: Sibling[] };

/* what the index and the comparer need of every solution */
export interface Brief {
  slug: string;
  href: string;
  title: string;
  label: string;
  film: string | null;
  steps: string[];
  names: string[];
  products: string[];
}

export interface Entry { href: string; slug: string; name: string; text: string }
export interface Group { title: string; items: Entry[] }
export interface Reserved { title: string; text: string; link: Link }
export interface IndexDoc {
  label: string;
  title: string;
  lede: (Tree | string)[];
  actions: Link[];
  film: string;
  groups: Group[];
  reserved: Reserved | null;
}

/* what a page gets about the other solutions: the film and the jobs (index), the products (a solution page) */
export interface Near { film?: string | null; steps?: string[]; products?: string[] }
