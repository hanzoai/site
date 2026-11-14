/* Shared types for the Story pages (/about, /history, /blog) and the page-local files beside them. */

/* A node of the captured page's tree (htmltree): an element with its kept attributes and children, or a string. */
export interface Tree { t: string; a?: Record<string, string>; c: (Tree | string)[] }

/* A picture of a customer story: its file and Hanzo's caption. */
export interface Pic { src: string; alt: string }

/* Where a headline figure is stated: a chapter, the report, the lede, or the case study PDF. */
export interface Source { step?: number; report?: true; lede?: true; pdf?: string }
export interface FigureData { value: string; label: string; from?: Source | null }
export interface Chapter { n: string; title: string; text: string; img: Pic | null | undefined }
export interface Link { label: string; href: string }
export interface Report { h2: string; text: string; img: Pic }
export interface How { h2: string; steps: Chapter[] }
export interface Gallery { h2: string; imgs: Pic[] }

export interface StoryDoc {
  slug: string;
  route: string;
  back: Link;
  year: string;
  kind: string;
  name: string;
  lede: string;
  cover: Pic | null | undefined;
  figures: FigureData[];
  report: Report | null;
  how: How | null;
  gallery: Gallery | null;
  links: Link[];
}

/* The next story, for the card that opens into it at the end of the page. */
export interface Sibling {
  slug: string;
  href: string;
  name: string;
  year: string;
  kind: string;
  cover: Pic | null | undefined;
  figure: FigureData | null;
}
