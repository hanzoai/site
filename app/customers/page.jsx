// V2: 8/10 Story + catalogue: kinetic headline over one huge case plate that swaps Damon and KANOA by itself and opens into the case study, every launch as an editorial index, a calm logo belt, one dark room
// Signature: the case plate: one case fills a huge plate with its figure as the hero numeral, wipes to the next by itself, widens to the full grid as it reaches you, and opens into its story when clicked
// Beyond: a year index over Hanzo's own launch list: each year shows how many launches it holds, and a tap narrows the index to that year
import Customers from '../../components/pages/Customers';
import JsonLd from '../../components/JsonLd';

export const metadata = { title: 'Products Hanzo built and launched — Hanzo AI', description: 'Hanzo built the store, ran the ads and found the audience for each of these launches. Here is what we did and what each one sold.' };

export default function Page() {
  return <><JsonLd route="/customers" /><Customers /></>;
}
