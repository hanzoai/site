// Shapes the page shell's components share.

/** A server-rendered part of the page shell (header, footer), read lazily: `current` is its element once it exists. */
export interface Shell {
  readonly current: Element | null;
}
