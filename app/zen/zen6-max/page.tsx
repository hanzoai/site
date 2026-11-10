import ZenMax from '../../../components/pages/model/ZenMax';
import JsonLd from '../../../components/JsonLd';

export const metadata = { title: "Zen 6 Max — Hanzo AI", description: "One model name. 3.7 trillion parameters across a routed fusion: Enso picks the specialist for each request, with a long context, tools and code." };

export default function Page() {
  return <><JsonLd route="/zen/zen6-max" /><ZenMax /></>;
}
