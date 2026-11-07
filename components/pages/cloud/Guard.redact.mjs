/* Guard's "Paste your own": the pattern detectors Hanzo lists, run in the visitor's own page (nothing is sent).
   shortcut: a few readable regexes, not Guard's real rule set; enough to show typed markers, not to protect data. */
const luhn = (d) => { let s = 0; for (let i = 0; i < d.length; i++) { let n = +d[d.length - 1 - i]; if (i % 2) { n *= 2; if (n > 9) n -= 9; } s += n; } return s % 10 === 0; };

// order matters: a key or card is claimed before the looser phone pattern sees its digits
export const RULES = [
  ['API_KEY', /\b(?:sk|pk|rk)[-_](?:live|test|proj|ant)?[-_]?[A-Za-z0-9]{8,}\b|\bAKIA[0-9A-Z]{16}\b|\bgh[pousr]_[A-Za-z0-9]{20,}\b/g],
  ['EMAIL', /\b[\w.+-]+@[\w-]+(?:\.[\w-]+)+\b/g],
  ['CARD', /\b(?:\d[ -]?){12,18}\d\b/g, (m) => luhn(m.replace(/\D/g, ''))],
  ['SSN', /\b\d{3}-\d{2}-\d{4}\b/g],
  ['IP', /\b(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)\b/g],
  // a phone is not a slice of a longer digit run (a card that failed its Luhn digit stays unmarked)
  ['PHONE', /(?:\+\d{1,3}[ .-]?)?(?:\(\d{2,4}\)[ .-]?|\b\d{2,4}[ .-])\d{3,4}[ .-]?\d{3,4}\b/g, (m, t, i) => !/\d[ .-]?$/.test(t.slice(0, i)) && !/^[ .-]?\d/.test(t.slice(i + m.length))],
];
const INJECT = /\b(?:ignore|disregard|forget)\b[^.\n]{0,40}\b(?:instructions?|rules|prompt)\b/i;

/* -> { parts: [[text, marker|null]], found: {MARKER: n}, inject: bool } */
export function redact(text) {
  let parts = [[text, null]];
  const found = {};
  for (const [mark, rx, ok = () => true] of RULES) {
    parts = parts.flatMap(([t, m]) => {
      if (m) return [[t, m]];
      const out = []; let at = 0;
      for (const hit of t.matchAll(rx)) {
        if (!ok(hit[0], t, hit.index)) continue;
        out.push([t.slice(at, hit.index), null], [hit[0], mark]); at = hit.index + hit[0].length;
        found[mark] = (found[mark] || 0) + 1;
      }
      out.push([t.slice(at), null]);
      return out.filter(([x]) => x);
    });
  }
  return { parts, found, inject: INJECT.test(text) };
}
