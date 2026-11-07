import ModelPage from '../../components/ModelPage';
import Enso from '../../components/pages/model/Enso';
import JsonLd from '../../components/JsonLd';

export const metadata = { title: "Hanzo Enso — Choose an outcome", description: "Intelligent model routing for frontier AI. Enso balances quality, latency, cost, and policy across top models and agents via one API." };

export default function Page() {
  return <><JsonLd route="/enso" /><ModelPage slug="enso"><Enso /></ModelPage></>;
}
