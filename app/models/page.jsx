import ModelsPage from '../../components/pages/ModelsPage';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Models — Hanzo AI',
  description: 'Explore frontier models and open-weight architectures. Access Enso, Zen, and 500+ partner models through one unified OpenAI-compatible API.',
};

export default function Page() {
  return <><JsonLd route="/models" /><ModelsPage /></>;
}
