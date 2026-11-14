/* The shapes cloudData.ts reads out of Hanzo's captured product pages and the /cloud/<slug> template draws. */

export interface Link { label: string; href: string }
export interface Crumb { label: string; href: string | undefined }
export interface Fact { k: string; v: string }

/* the product's console: its sidebar, and one of three kinds of example (a project's services, a conversation, a CLI session) */
export interface Sibling { label: string; href: string; current: boolean }
export interface Service { name: string; state: string; note: string }
export interface Line { g: string; text: string }
export interface Surface {
  title: string[];
  siblings: Sibling[];
  rows: Service[];
  turns: string[];
  lines: Line[];
  caption: string;
  host: string[];
  console: Link | null;
  note: string;
}

/* the "Paste and ship" prompt and the endpoint it calls */
export interface Endpoint { eyebrow: string; lede: string; label: string; api: string[]; prompt: string }

/* the related products */
export interface Neighbour { href: string; label: string; desc: string }
export interface Kin { eyebrow: string; more: Link[]; items: Neighbour[] }

export interface Product {
  slug: string;
  kind: 'product';
  crumb: Crumb[];
  label: string;
  name: string;
  lede: string;
  actions: Link[];
  badges: string[];
  meta: Fact[];
  window: Surface | null;
  ship: Endpoint | null;
  desc: string[];
  features: string[];
  motto: string;
  related: Kin | null;
  live: string[];
  liveLinks: string[];
}

/* /cloud/local: a boot story and a terminal session */
export interface Step { cmd: boolean; text: string; time: string }
export interface Figure { value: string; label: string }
export interface Story {
  id: string;
  eyebrow: string;
  title: string;
  lede: string;
  figures: Figure[];
  actions: Link[];
  cwd: string;
  lines: Step[];
}
export interface Local {
  slug: string;
  kind: 'local';
  label: string;
  name: string;
  lede: string;
  boot: Story;
  live: string[];
  liveLinks: string[];
}
export type Page = Product | Local;

/* a product that names its Google Cloud counterpart, for the finder */
export interface Pair { slug: string; name: string; google: string; api: string; group: string }
/* what a neighbour shows when you point at it */
export interface Preview { name: string; label: string; lede: string; api: string; google: string }
/* the numbers that shape a Sigil */
export interface Glyph { seed: string; data: number[] }
