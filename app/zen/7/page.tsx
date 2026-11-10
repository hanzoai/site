import ZenSeven from '../../../components/pages/model/ZenSeven';
import JsonLd from '../../../components/JsonLd';

export const metadata = { title: "Zen 7 Frontier Foundation — Hanzo AI", description: "Zen 7, the next open-weight generation. Apply for research access." };

export default function Page() {
  return <><JsonLd route="/zen/7" /><ZenSeven /></>;
}
