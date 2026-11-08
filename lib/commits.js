// Commits a day across every Hanzo repository, private ones counted: the calendar hanzo.ai's home draws, from the
// snapshot of api.hanzo.ai/v1/git/activity built into its page (content/live/_oss.json; scripts/live.mjs refreshes it
// before every build).
import O from '../content/live/_oss.json';
const G = O.calendar;

const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const DAYS = G.days.map(([day, c, r]) => {
  const [y, m, d] = day.split('-').map(Number);
  return { y, m, d, c, r, label: `${MON[m - 1]} ${d}, ${y}` };
});
// self-check: one entry a day for a full year, every count a number
if (DAYS.length < 365 || DAYS.some((x) => !Number.isFinite(x.c) || !Number.isFinite(x.r))) throw new Error('commit calendar data is incomplete');
export const TOTAL = DAYS.reduce((a, x) => a + x.c, 0);
export const FROM = DAYS[0].label;
export const TO = DAYS.at(-1).label;
export const FIRST_WEEKDAY = new Date(G.days[0][0] + 'T00:00:00Z').getUTCDay();
