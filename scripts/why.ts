// What a thrown value says, cut to `n` characters, for the browser checks' FAILED lines.
export const why = (e: unknown, n = Infinity) => (e instanceof Error ? e.message : String(e)).slice(0, n);
