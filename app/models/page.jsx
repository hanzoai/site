// Signature: the stage that opens. Enso's film fills the first screen, pulls back into a wall of all nine flagship films, and every film and card opens into its own page.
// Beyond: the compare tray. Pin up to three models anywhere in the catalogue and a tray rises with their context window and rates side by side, from Hanzo's own price list.
import ModelsPage from '../../components/pages/ModelsPage';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Models — Hanzo AI',
  description: 'Explore frontier models and open-weight architectures. Access Enso, Zen, and 500+ partner models through one unified OpenAI-compatible API.',
};

export default function Page() {
  return <><JsonLd route="/models" /><ModelsPage /></>;
}
