// Persona: a builder or researcher who wants Hanzo releases before they ship
// Goal: apply for early access
// CTA: Apply (/beta/apply), kit Cta beta.hero, beta.<pass>
// Metric: signup_start
// Signature: open: each early-access pass is a tile carrying Hanzo’s own media that grows into its full sheet with a shared-element morph, picture and words carried across
// Beyond: the five products in early access as their own tiles, Kai, Enso and Zen as their films, each opening into its page
// V2: 8/10 MASTER scale: 52px headline under the film strip (the one big thing), pass titles 32/21, close Feedback 52 with Book a call 26; no hover lifts (art drifts 12-16px), no floating cursor label; kit Cta; the opened pass is a native dialog that holds and returns focus
import Beta from '../../components/pages/Beta';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Get there first — Hanzo AI',
  description: 'Early access to Dev, Studio, Kai, Enso and Zen.',
};

export default function Page() {
  return <><JsonLd route="/beta" /><Beta /></>;
}
