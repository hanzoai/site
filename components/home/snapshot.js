// The build's figures for the home page's race, cost and frontier cards, worked out once on the server from the
// snapshots scripts/live.mjs refreshes before every build. app/page.jsx hands them to the page, so the browser gets the
// few figures, not the 80 KB of research runs they come from (components/home/useFigures.js reads the live ones).
import RS from '../../content/live/_research.json';
import MS from '../../content/live/_models.json';
import { figuresOf } from './figures';

export const SNAPSHOT = figuresOf(RS, MS);
