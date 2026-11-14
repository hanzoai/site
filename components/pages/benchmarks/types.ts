/* The shapes of the figures /benchmarks draws (benchmarksData.ts holds them, Benchmarks.tsx reads them). */

/* [label, href] */
export type Link = [label: string, href: string];

/* a point of the frontier scatter: its accuracy against its cost, and where its label sits (x, y, anchor) */
export interface Point {
  name: string;
  acc: number;
  cost: number;
  kind: string;
  aria: string;
  short?: string;
  line?: string;
  lab?: [number, number, 'start' | 'middle' | 'end'];
}

/* one task of the Decision Suite, Kai against Jev: its data, or a line, a note, and the runs behind it */
export interface SuiteRow {
  t: string;
  kai: string;
  jev: string;
  data?: Link[];
  line?: string;
  note?: string;
  low?: boolean;
  cost?: boolean;
  runs?: string[];
  re?: string;
  bars?: number[];
}
export interface Suite extends SuiteRow { bars: number[] }

/* [label, baseline, shortlist] */
export type Duo = [label: string, base: number, hanzo: number];
/* [baseline label, baseline, Hanzo label, Hanzo] */
export type Quad = [baseLabel: string, base: number, hanzoLabel: string, hanzo: number];

export interface Shortlist { t: string; foot: string; rows: Duo[] }
export interface Memory { t: string; to: string; foot: string; rows: Quad[] }

/* an agent tool's handler table */
export interface ToolSet {
  h?: string;
  bench: string;
  split: string;
  note: string;
  cols: string[];
  rows: string[][];
}

/* [hardware, prefill, prefill tok/s, decode, decode tok/s] */
export type Hardware = [name: string, prefill: string, prefillRate: number, decode: string, decodeRate: number];
/* [context length, hardware · method, prefill, prefill speed-up, decode, decode speed-up] */
export type Context = [length: string, method: string, prefill: string, prefillX: number, decode: string, decodeX: number];

/* one lane of the agent race */
export interface Lap {
  latency: string;
  ms: number;
  turns: number;
  tokens: number;
  savings: string;
  detail: string;
}
export interface Scenario {
  title: string;
  target: string;
  hanzo: Lap;
  rag: Lap;
  trad: Lap & { steps: string[] };
}

/* a run on the shelf */
export interface Shelved {
  id: string;
  to: string;
  t: string;
  sys: string;
  product: string;
  category: string;
  measure: string;
  val: string;
  base: string;
  result: string;
  date: string;
  status: string;
  i: number;
  v: number;
}

/* [name, key, [value, count][], "N more"] */
export type Facet = [name: string, key: string, values: [value: string, count: number][], more?: string];

/* [product, its shelf view, its benchmark pages] */
export type Product = [name: string, view: string, pages: Link[]];
