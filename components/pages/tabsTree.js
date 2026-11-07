/* The Tabs layout as a tree (Hanzo's own argument for it): a leaf is a shell, a split holds two children. Closing a
   pane replaces its split with the sibling, so the space goes to the sibling and nothing else moves. */
export const leaf = (id, name) => ({ id, name });
export const isLeaf = (t) => !t.dir;

export function split(t, id, dir, add, sid) {
  if (isLeaf(t)) return t.id === id ? { id: sid, dir, a: t, b: add } : t;
  const a = split(t.a, id, dir, add, sid), b = split(t.b, id, dir, add, sid);
  return a === t.a && b === t.b ? t : { ...t, a, b };
}

export function close(t, id) {
  if (isLeaf(t)) return t; // the last shell stays
  if (isLeaf(t.a) && t.a.id === id) return t.b;
  if (isLeaf(t.b) && t.b.id === id) return t.a;
  const a = close(t.a, id), b = close(t.b, id);
  return a === t.a && b === t.b ? t : { ...t, a, b };
}

export const leaves = (t) => (isLeaf(t) ? [t] : [...leaves(t.a), ...leaves(t.b)]);
