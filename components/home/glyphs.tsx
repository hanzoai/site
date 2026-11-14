/* The icons Hanzo's apps draw (lucide, ISC licence), by lucide's own names: the desktop's rail and sidebars, the phone's
   tab bar, the plan cards. glyphs.json holds each icon's shapes; one icon is one line there. */
import { createElement } from 'react';
import type { SVGProps } from 'react';
import GLYPHS from './glyphs.json';

/** One icon's shapes: each an SVG tag and its attributes. */
type Shapes = [tag: string, attrs: Record<string, string | number>][];
const ICONS = GLYPHS as unknown as Record<string, Shapes>; // the JSON import types each icon as its own tuple

interface GlyphProps extends Omit<SVGProps<SVGSVGElement>, 'name' | 'stroke'> { name: string; size?: number; stroke?: number }

export function Glyph({ name, size = 16, stroke = 1.75, ...rest }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...rest}>
      {ICONS[name].map(([tag, a], i) => createElement(tag, { key: i, ...a }))}
    </svg>
  );
}
