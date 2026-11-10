/* NoJs: with JavaScript off, every word on a w2 page is legible (PLAN-COMPONENTS §4 line 5). Motion's server render
   writes the entrance's first frame inline (opacity 0, a line pushed out of its mask); this noscript sheet sets the
   final state instead, and stacks pinned chapters. Usage: <NoJs /> once inside the page's <main className="… w2">.
   Owned by the Business 2 chat. */
import SharedNoJs from '../../NoJs';
const CSS = `.w2 [style*="opacity:0"]{opacity:1!important}
.w2 .x-line-in,.w2 .w2-settle{transform:none!important}
.w2 .w2-pin{height:auto!important}.w2 .w2-pin-stick{position:static!important;height:auto!important}
.w2 .w2-pin-texts{display:flex!important;flex-direction:column;gap:48px}.w2 .w2-pin-t{transform:none!important}
.w2 .w2-pin-visual{display:none}`;

export default function NoJs() {
  return <SharedNoJs css={CSS} />;
}
