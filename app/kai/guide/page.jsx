import KaiGuide from '../../../components/pages/model/KaiGuide';
import JsonLd from '../../../components/JsonLd';

export const metadata = { title: "How to use Kai, Hanzo’s decision model", description: "Developer guide for Kai decision models: API reference, structured outputs, low-latency reasoning, and token pricing on Hanzo Cloud." };

export default function Page() {
  return <><JsonLd route="/kai/guide" /><KaiGuide /></>;
}
