import ApiPage from '../../components/pages/ApiPage';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'One API for models, agents and tools — Hanzo AI',
  description: 'One base URL and one key for every model, Kai decisions, agents and the rest of Hanzo at api.hanzo.ai/v1. If you have used the OpenAI API, you already know most of this. Start free: 50 requests a day.',
};

export default function Page() {
  return <><JsonLd route="/api" /><ApiPage /></>;
}
