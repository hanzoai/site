// Signature: Full-bleed draggable case gallery that drifts by itself; each case opens into its story; every launch on a timeline
// Beyond: A year scrubber over 2015 to 2020 that counts each year's launches from Hanzo's own list; drag or tap to jump there
import Customers from '../../components/pages/Customers';
import JsonLd from '../../components/JsonLd';

export const metadata = { title: 'Products Hanzo built and launched — Hanzo AI', description: 'Hanzo built the store, ran the ads and found the audience for each of these launches. Here is what we did and what each one sold.' };

export default function Page() {
  return <><JsonLd route="/customers" /><Customers /></>;
}
