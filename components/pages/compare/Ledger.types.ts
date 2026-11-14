/* The shapes of a /compare/<page> read from Hanzo's captured page (compareData.ts) and drawn by the ledger (Ledger.tsx). */
export type Link = { href: string; label: string };
/* v is the verdict read from the cell's first words: yes, no, none, figure or part */
export type Cell = { t: string; v: string; link?: Link | null };
export type Row = { label: string; cells: Cell[]; mark?: string };
export type Side = {
  h2: string;
  lede: string;
  toggles: string[];
  corner: string;
  head: string[];
  cols: string[];
  prov: string;
  measured: Row[];
  reported: Row[];
  note: { k: string; t: string } | null;
};
export type Em = { em: string };
export type Para = (string | Em)[];
export type HonestDoc = { h2: string; paras: Para[] };
export type DeeperDoc = { h2: string; links: Link[] };
export type CompareDoc = {
  slug: string;
  route: string;
  label: string;
  h1: string;
  lede: string;
  side?: Side;
  honest?: HonestDoc;
  deeper?: DeeperDoc;
};
