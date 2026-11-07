// Commits a day across every Hanzo repository, private ones counted, from api.hanzo.ai/v1/git/activity: the source
// hanzo.ai's own calendar reads. scripts/live.mjs refreshes content/live/_git.json before every build (npm run build).
import G from '../content/live/_git.json';

const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const DAYS = G.days.map(([day, c, r]) => {
  const [y, m, d] = day.split('-').map(Number);
  return { y, m, d, c, r, label: `${MON[m - 1]} ${d}, ${y}` };
});
// self-check: one entry a day for a full year, every count a number
if (DAYS.length < 365 || DAYS.some((x) => !Number.isFinite(x.c) || !Number.isFinite(x.r))) throw new Error('commit calendar data is incomplete');
export const TOTAL = DAYS.reduce((a, x) => a + x.c, 0);
export const FIRST_WEEKDAY = new Date(G.days[0][0] + 'T00:00:00Z').getUTCDay();
