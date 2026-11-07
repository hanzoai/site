// Signature: the wall that opens. Nine flagship films on the first screen; scroll flies into Enso, and every film and card opens into its own page.
// Beyond: every model reachable. One collapsed "Every model" list links all of Hanzo's model and maker pages from /models.
import ModelsPage from '../../components/pages/ModelsPage';
import NoScript from '../../components/pages/models/NoScript';
import { makerIndex } from '../../components/pages/models/modelsData';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Models — Hanzo AI',
  description: 'Explore frontier models and open-weight architectures. Access Enso, Zen, and 500+ partner models through one unified OpenAI-compatible API.',
};

export default function Page() {
  return <><JsonLd route="/models" /><NoScript /><ModelsPage makers={makerIndex()} /></>;
}
