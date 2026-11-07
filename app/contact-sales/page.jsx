import ContactSales from '../../components/pages/ContactSales';
import JsonLd from '../../components/JsonLd';

export const metadata = { title: "Talk to sales \u2014 Hanzo AI", description: "Tell us what you want to build. We come back with a plan for your company: where Hanzo runs, what it costs and how you start." };

export default function Page() {
  return <><JsonLd route="/contact-sales" /><ContactSales /></>;
}
