/* famAccent (Families A kit). JAMES.md 7 (7 Nov) replaced VISION.md's "one accent per page": Hanzo's mark is black and
   white, so the UI has 0 brand hues. Every member now takes ink; members differ by their own Sigil (seeded with their
   slug and drawn from their own figures), their data and their media, never by a UI colour.
   The functions stay so a page can keep calling them: they return ink. */
export const INK = '#1d1d1f';
export const ACCENTS = [INK];
export const accentAt = () => INK;
export const accentOf = () => INK;
