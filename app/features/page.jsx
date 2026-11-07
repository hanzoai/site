// V2: 8/10 Stage keyboard (the self-playing instrument settles into place), three pinned product chapters with their own live product UI, the real chat as the dark room, pink accent
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
