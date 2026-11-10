// V2: 8/10 After review, on Hanzo's deck: colour-room titles visible on black, the contrast board swaps White/Black once in view; the mark's construction drawn full-bleed (not a card), arriving after the curtain, then alive (pieces lean to the pointer, compass turns with a pause); principles pinned with giant numerals; gray strip fans open; specimen sweeps when in view; JS off legible; no invented words or figures
// Persona: a designer, partner or journalist who needs the marks and rules · Goal: take the brand assets · CTA: Download Assets (brand.hero) · Metric: one contact click (the assets ZIP)
// Signature: the type specimen, a screen-filling "Aa" whose variable weight sweeps once as soon as it is on screen, the whole heading scale moving in time, then rests until the slider puts the weight in your hand
// Beyond: each of Hanzo's six grays on Hanzo White or Hanzo Black, its WCAG AA verdict worked out from the two hex values and shown as a shape
// Deletes: the proof-red accent, every eyebrow and kicker over a headline, the card hero shared with /press, the endless loops, invented words and figures, the tick on a failed copy
import Brand from '../../components/pages/Brand';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Hanzo Brand Guidelines. — Hanzo AI',
  description: 'How to draw a Hanzo interface: the marks, the type, the colour, and the spacing.',
};

export default function Page() {
  return <><JsonLd route="/brand" /><Brand /></>;
}
