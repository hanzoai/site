// What the captured product pages become for /products/<name> and /products (see productsData.ts and productsIndexData.ts).
import type { Branch, Child } from './CapturedTree.ts';

export interface Link { href: string; text: string }

export interface Product {
  slug: string;
  kicker: string;
  title: string;
  lede: string;
  acts: { text: string; href: string }[];
  osTitle: string;
  os: { href: string; name: string; desc: string; current: boolean }[];
  intro: Child[];
  api: { title: string; lede: string; table: Branch; heads: string[]; ops: string[][] };
  tryIt: { title: string; toks: [string, string][] };
  measured?: { title: string; links: Link[] };
  docs?: { title: string; links: Link[] };
  site?: { title: string; links: Link[] };
}

export interface Peek { lede: string; ops: number }

export interface ProductsIndex {
  kicker: string;
  title: string;
  lede: string;
  acts: { label: string; href: string }[];
  window: string;
  layers: { name: string; line: string; href: string }[];
  backed: { title: string; lede: string; eyebrow: string; logos: { href: string; src: string; alt: string; h: number }[] };
  work: { title: string; lede: string; links: { label: string; href: string }[] };
  close: { label: string; href: string }[];
}
