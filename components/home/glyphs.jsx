/* The icons Hanzo's apps draw (lucide, ISC licence), by lucide's own names: the desktop's rail and sidebars, the phone's
   tab bar, the plan cards. glyphs.json holds each icon's shapes; one icon is one line there. */
import { createElement } from 'react';
import GLYPHS from './glyphs.json';

export function Glyph({ name, size = 16, stroke = 1.75, ...rest }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...rest}>
      {GLYPHS[name].map(([tag, a], i) => createElement(tag, { key: i, ...a }))}
    </svg>
  );
}
