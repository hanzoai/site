// The captured-page tree htmltree.ts reads (strings and {t, a, c} elements), as the data readers below describe what they
// take from it: a tag name, the attributes kept (absent when none) and the children.
export interface Branch { t: string; a?: Record<string, string>; c: Child[] }
export type Child = string | Branch;

/* an attribute the reader kept, or '' when the element has none */
export const attr = (n: Branch, k: string): string => (n.a && n.a[k]) || '';

/* the element children of a branch (the text children left out) */
export const kids = (n: Branch): Branch[] => n.c.filter((k): k is Branch => typeof k !== 'string');

/* a child's tag name; a text child has none */
export const tagOf = (n: Child | undefined): string | undefined => (typeof n === 'string' ? undefined : n?.t);
