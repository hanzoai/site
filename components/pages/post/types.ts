/* Shapes of a blog post (/blog/<post>): what postData.ts reads from the captured page and what the reading room draws. */

/* a node of the captured page (components/pages/htmltree.ts): a tag with its kept attributes and its children */
export interface Tree { t: string; a?: Record<string, string>; c: (string | Tree)[] }

/* a paragraph's pieces: plain words, a link ({a, t}), bold ({b}) or inline code ({c}) */
export type Piece = string | { a?: string; t?: string; b?: string; c?: string };

/* one code line is a list of [kind, text] tokens */
export type CodeLine = [string, string][];
export interface CodeTab { lang: string; lines: CodeLine[] }
export interface Link { label: string; href: string }

export type Block =
  | { k: 'h2'; text: string; id: string }
  | { k: 'code'; tabs: CodeTab[] }
  | { k: 'parts'; cards: string[][] }
  | { k: 'cta'; label: string; links: (Link & { fill: boolean })[] }
  | { k: 'sources'; label: string; links: Link[] }
  | { k: 'figure'; kind: string }
  | { k: 'p'; inl: Piece[] };

/* a block and its place in the post's body */
export interface Chunk { b: Block; i: number }
export type Para = Extract<Block, { k: 'p' }>;
export type CtaBlock = Extract<Block, { k: 'cta' }>;
export type SourcesBlock = Extract<Block, { k: 'sources' }>;
/* a chapter: its heading, the blocks under it, and the one object it draws (Gist.tsx) */
export interface Chapter { h: Extract<Block, { k: 'h2' }>; blocks: Chunk[]; gist?: GistKind | null }

/* a dot of the GPQA chart; `href` is set on the reported scores */
export interface Dot { kind: 'run' | 'reported' | 'enso'; said: string; short: string; acc: number; cost: number; href?: string }
export interface Chart { dots: Dot[]; y: number[]; x: string[]; yLabel: string; xLabel: string }

/* another post, as a card under "keep reading" */
export interface Sibling { href: string; film: string | null; title: string; chip: string; date: string; read: string }

export interface Doc {
  slug: string;
  route: string;
  film: string | null;
  back: Link;
  chip: string;
  date: string;
  read: string;
  minutes: number;
  title: string;
  lede: string;
  facts: string[][];
  body: Block[];
  frontier: Chart | null;
  next: Sibling[];
}

/* a chapter's one drawn object (Gist.tsx) */
export interface Figure { v: string; cap: string; n: number; bare: boolean }
export type Drawn = { kind: 'bars' | 'figs'; figs: Figure[]; after: number } | { kind: 'steps'; items: string[]; after: number };
export type GistKind = Drawn | { kind: 'collide'; after: number } | { kind: 'emblem'; after: number };
