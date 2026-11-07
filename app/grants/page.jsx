// Signature: stacked sheets: in the dark room the three ways to build and research arrive as full sheets, each pinning while the next slides over it and the one beneath settles back
// Beyond: your application as it will be sent: a card beside the form writes itself as you type, under the form’s own labels
// V2: 8/10 grey deck, no eyebrow; the page’s living contour field as the hero art; one drawn timeline; the three ways as stacked sheets in the dark room; the application with its card; one sticky Apply
import Grants from '../../components/pages/Grants';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Open Source & Research Credit Grants — Hanzo AI',
  description: 'Free API credits, GPU compute, and Hanzo Team access for open-source contributors, academic PhD researchers, and research interns.',
};

export default function Page() {
  return <><JsonLd route="/grants" /><Grants /></>;
}
