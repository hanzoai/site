/* Conway's rule on a wrapping W×H board: a live cell with two or three neighbours stays, an empty one with three is born. */
export const W = 16, H = 10;
const GLIDER = [[1, 0], [2, 1], [0, 2], [1, 2], [2, 2]];
export const glider = (ox = 2, oy = 3) => { const g = new Uint8Array(W * H); GLIDER.forEach(([x, y]) => { g[((y + oy) % H) * W + ((x + ox) % W)] = 1; }); return g; };
export function step(g: Uint8Array) {
  const n = new Uint8Array(W * H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    let c = 0;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (dx || dy) c += g[((y + dy + H) % H) * W + ((x + dx + W) % W)];
    const i = y * W + x;
    n[i] = c === 3 || (c === 2 && g[i]) ? 1 : 0;
  }
  return n;
}
