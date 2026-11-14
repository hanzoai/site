// Commits a day across every Hanzo repository, private ones counted: the calendar hanzo.ai's home draws, from the
// snapshot of api.hanzo.ai/v1/git/activity built into its page (content/live/_oss.json; scripts/live.mjs refreshes it
// before every build).
import O from '../content/live/_oss.json';
import { cuts, shade } from './heat.ts';
const G = { days: O.calendar.days as [string, number, number][] }; // the JSON import widens each row to (string | number)[]

const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const DAYS = G.days.map(([day, c, r]) => {
  const [y, m, d] = day.split('-').map(Number);
  return { y, m, d, c, r, label: `${MON[m - 1]} ${d}, ${y}` };
});
// self-check: one entry a day for a full year, every count a number
if (DAYS.length < 365 || DAYS.some((x) => !Number.isFinite(x.c) || !Number.isFinite(x.r))) throw new Error('commit calendar data is incomplete');
export const TOTAL = DAYS.reduce((a, x) => a + x.c, 0);
export const FROM = DAYS[0].label;
export const TO = DAYS.at(-1)!.label;
export const FIRST_WEEKDAY = new Date(G.days[0][0] + 'T00:00:00Z').getUTCDay();

// A day's shade (0 to 4: none, then the quartiles of the days that had commits), and the series the tiles draw: the last
// seven days, and the year in weeks counted back from the last day, so the last bar is the week the "past 7 days" tile counts.
const CUT = cuts(DAYS.map((x) => x.c));
export const level = (c: number) => shade(c, CUT);
export const LAST7 = DAYS.slice(-7).map((x) => x.c);
const W = Math.floor(DAYS.length / 7);
export const WEEKS = Array.from({ length: W }, (_, i) => {
  const end = DAYS.length - 7 * (W - 1 - i);
  return DAYS.slice(end - 7, end).reduce((s, x) => s + x.c, 0);
});
