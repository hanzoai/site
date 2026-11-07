// Persona: an open-source contributor, PhD researcher or research intern
// Goal: apply for credits or an internship
// CTA: Apply for a Grant (kit Cta grants.hero → the form; Submit Grant Application grants.apply)
// Metric: lead_submit
// Signature: stamp: in the dark room the three ways to build and research land as sheets, each dropping and stopping dead with an impression ring, and a click or tap stamps one again
// Beyond: your application as it will be sent: a card beside the form writes itself as you type, under the form’s own labels
// V2: 8/10 MASTER scale: 52px hero beside the contour field with a pause control; steps and gets titles 21px under 26px heads; gets as one ledger ticked in; sheets stamp down as they enter, number 64, title 32, a quiet ask each; kit Field and Cta, wrong fields dashed and focused, success focused
import Grants from '../../components/pages/Grants';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Open Source & Research Credit Grants — Hanzo AI',
  description: 'Free API credits, GPU compute, and Hanzo Team access for open-source contributors, academic PhD researchers, and research interns.',
};

export default function Page() {
  return <><JsonLd route="/grants" /><Grants /></>;
}
