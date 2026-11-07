// V2: 8/10 A living brand book: the mark constructs itself on red proofing guides beside a 128px masked headline, principles as a still manifesto, colour as the one dark room of giant copyable swatches, a full-screen type specimen, a working component bench
// Signature: the type specimen, a screen-filling "Aa" whose variable weight sweeps by itself with the whole heading scale breathing in time, until the slider puts the weight in your hand
// Beyond: Will this gray read? Each of Hanzo's six grays on Hanzo White or Hanzo Black, its WCAG contrast worked out from the two hex values on a split-flap board
import Brand from '../../components/pages/Brand';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Hanzo Brand Guidelines. — Hanzo AI',
  description: 'How to draw a Hanzo interface: the marks, the type, the colour, and the spacing.',
};

export default function Page() {
  return <><JsonLd route="/brand" /><Brand /></>;
}
