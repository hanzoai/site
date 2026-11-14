/* The shapes benchData.ts reads out of Hanzo's captured benchmark pages and BenchRun.tsx draws. */
import type { Branch } from '../htmltree';

/* one block of a page in reading order: a bare string of text (s), or an element (n) of kind t */
export interface TextBlock { t: 'text'; s: string; n?: undefined }
export interface TagBlock { t: string; n: Branch; s?: undefined }
export type Block = TextBlock | TagBlock;

/* a table as rows of strings */
export interface Grid { head: string[]; rows: string[][] }

/* a figure parsed out of a cell: its value in base units and the kind of thing it measures */
export interface Measure { v: number; dim: string }

/* a column of a table that can be drawn */
export interface Column { j: number; name: string; dim: string; vals: (number | null)[] }

/* a cell's text and its value */
export interface Figure { s: string; v: number }

export interface TrendPoint { s: string; who: string; val: string; when: string; v: number }
export interface TrendChart {
  kind: 'trend'; title: string; metric: string; ticks: string[]; dates: string[]; lo: number; hi: number;
  base: Figure | null; points: TrendPoint[];
}

export interface VersusRow { label: string; a: Figure; b: Figure }
export interface VersusChart { kind: 'versus'; title: string; heads: string[]; rows: VersusRow[] }

export interface BarCell { s: string; v: number | null }
export interface BarRow { label: string; cells: BarCell[] }
export interface BarColumn { name: string; dim: string }
export interface BarsChart { kind: 'bars'; title: string; head0: string; cols: BarColumn[]; rows: BarRow[] }

export interface OneChart { kind: 'one'; title: string; label: string; head: string; s: string }

export type Chart = TrendChart | VersusChart | BarsChart | OneChart;

export interface Section { title: string; id: string | null; blocks: Block[] }

export interface Latest { href: string; parts: string[] }

export interface Source { url: string; ids: (string | null)[] }

export interface BenchDoc {
  slug: string;
  kind: 'result' | 'paper';
  crumb: Branch | null | undefined;
  kicker: Branch | null | undefined;
  title: string;
  lede: Branch | null | undefined;
  intro: Block[];
  latest: Latest[];
  sections: Section[];
  tail: Block[];
  chart: Chart | null;
  source: Source | null;
  command: string;
  figures: string[];
}

/* a sibling card under the page: where it goes and how it is drawn */
export interface Card { href: string; title: string; seed: string; dir?: 'prev' | 'next'; hidden?: string }

/* a sibling's own line and headline figure, for the hover preview and contour */
export interface Peek { lede: string; figure: string; data: number[] }
