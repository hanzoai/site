// V2: 8/10 v3 to JAMES.md: Hanzo's black, white and greys only, no labels over headlines, one solid ask (Download Assets) with the shared ask bar, the mark builds and opens once then answers the pointer, principles each with a demonstration, verdicts as shapes, one weight sweep then the slider
// Persona: a designer, partner or journalist who needs the marks and rules · Goal: take the brand assets · CTA: Download Assets (brand.hero) · Metric: one contact click (the assets ZIP)
// Signature: the type specimen, a screen-filling "Aa" whose variable weight sweeps once with the whole heading scale moving in time, then rests until the slider puts the weight in your hand
// Beyond: each of Hanzo's six grays on Hanzo White or Hanzo Black, its WCAG contrast worked out from the two hex values on a split-flap board, with the AA line as a shape
// Deletes: the proof-red accent, two eyebrows, the endless breathing and weight loops, invented labels and px sizes
import Brand from '../../components/pages/Brand';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Hanzo Brand Guidelines. — Hanzo AI',
  description: 'How to draw a Hanzo interface: the marks, the type, the colour, and the spacing.',
};

export default function Page() {
  return <><JsonLd route="/brand" /><Brand /></>;
}
