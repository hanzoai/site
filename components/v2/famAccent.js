/* famAccent (Families A kit): one accent per page. Family members take their accent by their place in the family, so
   neighbours never share one; the accent paints the page's buttons, chart ink and contour, never tinted boxes.
   How to use it: <main className="v2f" style={{ '--acc': accentAt(i) }}> with i the member's index in its family,
   or accentOf(slug) when the order is not known. */
export const ACCENTS = ['#0071e3', '#bf4800', '#1a7f37', '#8e3fd6', '#d70015', '#0a7f8c', '#a2770b', '#4f46e5', '#c21e56', '#2f6f4f', '#b34700', '#0062a3'];
export const accentAt = (i) => ACCENTS[((i % ACCENTS.length) + ACCENTS.length) % ACCENTS.length];
export function accentOf(seed) {
  let h = 2166136261;
  for (const c of String(seed)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); }
  return accentAt(Math.abs(h));
}
