'use client';
/* AskBar (components/v2, owned by the Wave 2 "Proof" chat). Retired as a bar: the shared system now mounts one ask bar
   on every page at every width (components/Ask.jsx, docs/build-notes/review/SYSTEM.md §5), and two would show at once. AskBar
   stays so pages that use it keep working; it now only hands the shared bar what it reads:
   - data-ask-name: the page's own name in the bar;
   - data-thumb + data-href: the page's ask, used only when the page has no data-thumb of its own (the shared bar takes
     the first [data-thumb] in <main>, so a hero's own ask always wins).
   Usage (anywhere in <main>, conventionally its last child):
     <AskBar title="Leaderboard" label="Open bounties" to="/bounty" cta="open-bounties" />
   It renders one hidden, empty element: no text, no layout, nothing to tab to. */
import { href as route } from '../../lib/route';

export default function AskBar({ title, label, to, cta }) {
  return <span hidden aria-hidden="true" data-ask-name={title} data-thumb={label} data-href={route(to) || to} data-cta={cta} />;
}
