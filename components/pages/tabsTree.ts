/* The Tabs layout as a tree (Hanzo's own argument for it): a leaf is a shell, a split holds two children. Closing a
   pane replaces its split with the sibling, so the space goes to the sibling and nothing else moves. */
export type Dir = 'row' | 'col';
export interface Leaf { id: string; name: string; dir?: undefined }
export interface Split { id: string; dir: Dir; a: Layout; b: Layout }
export type Layout = Leaf | Split;

export const leaf = (id: string, name: string): Leaf => ({ id, name });
export const isLeaf = (t: Layout): t is Leaf => !t.dir;

export function split(t: Layout, id: string, dir: Dir, add: Layout, sid: string): Layout {
  if (isLeaf(t)) return t.id === id ? { id: sid, dir, a: t, b: add } : t;
  const a = split(t.a, id, dir, add, sid), b = split(t.b, id, dir, add, sid);
  return a === t.a && b === t.b ? t : { ...t, a, b };
}

export function close(t: Layout, id: string): Layout {
  if (isLeaf(t)) return t; // the last shell stays
  if (isLeaf(t.a) && t.a.id === id) return t.b;
  if (isLeaf(t.b) && t.b.id === id) return t.a;
  const a = close(t.a, id), b = close(t.b, id);
  return a === t.a && b === t.b ? t : { ...t, a, b };
}

export const leaves = (t: Layout): Leaf[] => (isLeaf(t) ? [t] : [...leaves(t.a), ...leaves(t.b)]);
