// The shade a day's commits earn, cut as @hanzo/ui's Heatmap cuts it: 0 for a day without commits, then 1 to 4 up the
// quartiles of the days that had any. Days are ranked, not scaled to the busiest, so one outlier cannot flatten a year.
export function cuts(counts: number[]): number[] {
  const nz = counts.filter((v) => v > 0).sort((a, b) => a - b);
  return [0.25, 0.5, 0.75].map((p) => nz[Math.floor(nz.length * p)] ?? 0);
}

export const shade = (v: number, cut: number[]): number => (v <= 0 ? 0 : v <= cut[0] ? 1 : v <= cut[1] ? 2 : v <= cut[2] ? 3 : 4);
