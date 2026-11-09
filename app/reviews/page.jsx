// Persona: a team lead or engineer deciding whether builders like them trust Hanzo
// Goal: read the reviews that match their product, or write their own
// CTA: Write a review (opens the form), Join Beta & Fan Club (/beta)
// Metric: pageview
// Signature: nine first-party reviews under one 4.9 / 5.0 summary, filtered by product, with a review form that sits in the page
// Beyond: the form collects nothing here: a review written stays in this browser and is shown first, and nothing is sent to Hanzo's API
import INDEX from '../../content/pages.json';
import Reviews from '../../components/pages/Reviews';
import JsonLd from '../../components/JsonLd';

export const metadata = { title: INDEX['/reviews'].title, description: INDEX['/reviews'].description };

export default function Page() {
  return <><JsonLd route="/reviews" /><Reviews /></>;
}
