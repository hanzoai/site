// A run of values as bars, tallest to the height given: @hanzo/ui's Sparkline (a bar is at least 4% tall, a value of none a
// line one pixel tall), in the markup hanzo.ai's own page prints. The fill is the band's heat (.x-bar, app/globals.css), the
// colour of the calendar's cells, so the tiles, the repository cards and the calendar read as one.
const bar = (h, none) => `<div class="is_View _grow-1 _shrink-1 _fb-0px _minW-1px _btlr-1px _btrr-1px _bbrr-1px _bblr-1px x-bar${none ? ' none' : ''}" style="height:${h}"></div>`;

export function bars(values) {
  const top = Math.max(0, ...values);
  return values.map((v) => (v > 0 ? bar(`${Math.round(Math.max(4, (100 * v) / top) * 10) / 10}%`) : bar('1px', true))).join('');
}

export default function spark(values, label, height) {
  return `<div aria-label="${label}" class="is_View _fd-row _items-flex-end _gap-2px" data-slot="sparkline" role="img" style="height:${height}px">${bars(values)}</div>`;
}
