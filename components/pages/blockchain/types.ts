/* The shapes bcData.ts reads out of Hanzo's captured pages and the /blockchain templates draw. */

/* a captured <pre> as lines of [kind, text] tokens (kind from hanzo.ai's data-code), plus its plain text */
export interface Sample {
  lines: [string, string][][];
  text: string;
}

/* ---------- a section flattened into its words, in reading order ---------- */
export interface Pre { k: 'pre'; code: Sample }
export interface Head { k: 'h1' | 'h2' | 'h3'; text: string; parts: string[] }
export interface Anchor { k: 'a'; text: string; href: string; slot: string | undefined; parts: string[] }
export interface Button { k: 'button'; text: string; slot: string | undefined; parts: string[] }
export interface Para { k: 'p'; text: string; slot: string | undefined }
export interface Bullet { k: 'li'; text: string }
export interface Chip { k: 'chip'; text: string; parts: string[] }
export interface Span { k: 'span'; text: string }
export type Row = Pre | Head | Anchor | Button | Para | Bullet | Chip | Span;
export type Kind = Row['k'];
export type Of<K extends Kind> = Row & { k: K };

/* ---------- /blockchain/<product> ---------- */
export interface Link { label: string; href: string }
export interface Item { title: string; text: string; bullets: string[]; link: Link | null }
export interface Hero {
  chip: string;
  title: string;
  claim: string;
  lede: string;
  features: Item[];
  back: Anchor | null;
  actions: Link[];
}
export interface Key {
  title: string;
  sub: string;
  stats: string[][];
  actions: string[];
  note: string;
  trusted: { label: string; tags: string[] } | null;
}
export interface CodeBlock { kind: 'code'; title: string; lede: string; langs: string[]; file: string | null; code: Sample; items: Item[] }
export interface ChainsBlock { kind: 'chains'; title: string; chains: string[] }
export interface ItemsBlock { kind: 'items'; title: string; lede: string; items: Item[]; cols: string }
export interface GetBlock { kind: 'get'; title: string; text: string; chips: string[]; github: Anchor | null; deploy: Anchor | null }
export interface BandBlock { kind: 'band'; title: string; lede: string; links: Link[]; buttons: string[] }
export type Block = CodeBlock | ChainsBlock | ItemsBlock | GetBlock | BandBlock;
export interface Product {
  slug: string;
  route: string;
  kind: 'product';
  i: number;
  blocks: Block[];
  chains: string[];
  hero?: Hero;
  key?: Key;
}

/* every product's supported chains, for "which products run on my chain" */
export interface Cover { slug: string; href: string; name: string; chains: string[]; i: number; claim: string }

/* ---------- /blockchain/directory ---------- */
export interface Mark { p: string; on: boolean }
export interface Card { name: string; id: string | null; kind: string; marks: Mark[] }
export interface Listing {
  slug: string;
  route: string;
  kind: 'directory';
  i: number;
  label: string;
  title: string;
  lede: string;
  search: string | null;
  filters: string[];
  legendLabel: string;
  legend: string[];
  cards: Card[];
  unused: number;
}

/* ---------- /blockchain ---------- */
export interface Piece { href: string; name: string; text: string; cta: string }
export interface Group { title: string; text: string }
export interface PiecesBlock { kind: 'pieces'; title: string; lede: string; cards: Piece[] }
export interface GroupsBlock { kind: 'groups'; title: string; lede: string; groups: Group[] }
export interface AgentBlock { kind: 'agent'; chip: string; title: string[]; lede: string; bullets: string[]; file: string | null; code: Sample }
export interface NetworksBlock { kind: 'chains'; title: string; lede: string; chains: string[] }
export interface EndBlock { kind: 'band'; title: string; lede: string; buttons: string[]; links: Link[]; points: string[] }
export type Section = PiecesBlock | GroupsBlock | AgentBlock | NetworksBlock | EndBlock;
export interface Overview {
  chip: string;
  title: string[];
  lede: string;
  actions: string[];
  note: string;
  cats: string[];
  facts: string[][];
  blocks: Section[];
}
