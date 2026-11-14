/* Shapes of the /models family: a captured page's tree, a model's card, and the two documents the pages draw. */

/* a node of a captured page (htmltree): `t` the tag, `a` the kept attributes, `c` the children */
export interface Tree {
  t: string;
  a?: Record<string, string>;
  c: Leaf[];
}
export type Leaf = string | Tree;

/* dollars per million tokens, in and out */
export interface Rate {
  in: number;
  out: number;
}

/* a page's entry in content/pages.json */
export interface PageMeta {
  title: string;
  description: string;
}

export interface Link {
  label: string;
  href: string;
}

/* a card of a maker's shelf, as the captured page prints it */
export interface Card {
  href: string;
  name: string;
  ctx: string | null;
  desc: string;
  tags: string[];
  mid?: string;
  id?: string;
}

/* a card with its live rate and token count read (providerCards, or the gateway's list in useShelf) */
export interface Sibling extends Card {
  id: string;
  tokens: number | null;
  price?: string | null;
  rate?: Rate | null;
}

/* a point of the sibling field and a row of the bill comparer */
export interface Point {
  name: string;
  href: string;
  ctx?: string | null;
  tokens?: number | null;
  rate?: Rate | null;
}

/* a captured <pre> as lines of [kind, text] tokens, plus its plain text */
export interface Code {
  lines: [string, string][][];
  text: string;
}

export interface Sample extends Code {
  lang: string;
}

export interface Fact {
  label: string;
  value: string | null;
  live?: boolean;
}

export interface FactGroup {
  title: string | null;
  notes: string[];
  facts: Fact[];
}

export interface Crumb {
  label: string;
  href?: string;
}

export interface Band {
  title: string;
  lede: string;
  actions: Link[];
  nodes?: Leaf[];
}

export interface Loose {
  kind: 'loose';
  title: string;
  nodes: Leaf[];
}

export interface ModelDoc {
  slug: string;
  model: string;
  route: string;
  crumbs: Crumb[];
  label: string;
  name: string;
  lede: string;
  actions: Link[];
  links: Link[];
  facts: FactGroup[];
  quick: { title: string; key: Link | null; samples: Sample[]; price: boolean; note: string } | null;
  more: { title: string; cards: Card[]; all: Link | null } | null;
  family: { title: string; links: { href: string | null; label: string; note: string }[] } | null;
  extra: Loose[];
  band: Band | null;
  id: string;
  ctx: string | null;
  tokens: number | null;
  price: string | null;
  rate: Rate | null;
  modalities: string | null;
  siblings: Sibling[];
  cardCtx: string | null;
  provider: { slug: string; name: string; route: string };
}

export interface ProviderDoc {
  slug: string;
  route: string;
  name: string;
  h1: string;
  count: string;
  lede: string;
  actions: Link[];
  guest: { title: string | null; key: string | null; note: string | null; prompt: string; label: string | null; code: string };
  cards: Sibling[];
  band: { title: string; lede: string; actions: Link[] } | null;
}

export interface Maker {
  slug: string;
  name: string;
  href: string;
  models: { href: string; name: string }[];
}
