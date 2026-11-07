// V2: the self-playing keyboard is the hero object (display above, ten keys in three clusters, sticky display on phone); three product rooms with Hanzo's films (Chat split, Dev full-bleed black, Design wide film over two rows), each film moving to the open feature; a close with the three film cards and the one ask; no live AI call; deck greys only
// Signature: Hanzo's ten features as keycaps on one keyboard that plays itself, each key lighting its feature on the display
// Beyond: find the feature for a job: type what you need and the keys whose own descriptions say it light up
import Features from '../../components/pages/Features';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Features — Hanzo Chat, Dev, Studio and Cloud',
  description: 'Explore all features of Hanzo: autonomous repo-scale coding with Hanzo Dev, unified intelligent chat with Enso, visual composition in Studio, and cloud APIs.',
};

export default function Page() {
  return <><JsonLd route="/features" /><Features /></>;
}
