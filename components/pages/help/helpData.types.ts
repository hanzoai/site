/* The shapes /help reads from Hanzo's captured pages (helpData) and draws (HelpArticle). */

// a run of words in a paragraph: plain text, a link (or a mailto, with the Cloudflare link beside it), or bold words
export interface Bold { b: string }
export interface Anchor { a: string | undefined; t: string; cf?: string }
export type Inl = string | Anchor | Bold;

// a step or bullet; a bold lead sentence stands apart when the item opens with one
export interface Item { lead?: string; inl: Inl[] }

export interface Heading { k: 'h3'; text: string }
export interface Para { k: 'p'; inl: Inl[] }
export interface List { k: 'ol' | 'ul'; items: Item[] }
export type Block = Heading | Para | List;

export interface Section { id: string; title: string; blocks: Block[] }

// the steps to a setting on one platform, and what the hand presses in each
export interface Flow { label: string; sec: string; steps: { inl: Inl[]; targets: string[] }[] }
export interface Setting { name: string; flows: Flow[]; on: string | null; offTitle: string | null; off: string[]; saved: string | null }

export interface Article {
  slug: string;
  route: string;
  kicker: string;
  title: string;
  lede: string;
  contents: { label: string; items: { id: string; text: string }[] };
  sections: Section[];
  setting?: Setting;
}
