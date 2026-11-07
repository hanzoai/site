// Signature: stacked sheets: in the dark room the three ways to build and research arrive as full sheets, each pinning while the next slides over it and the one beneath settles back
// Beyond: your application as Hanzo files it: a filing card beside the form shows the track, role and every field sent
// V2: 8/10 display hero beside the page’s own living contour field; the four steps as one drawn timeline; benefits as an editorial list; the three ways as stacked sheets in the dark room; the application with its filing card
import Grants from '../../components/pages/Grants';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Open Source & Research Credit Grants — Hanzo AI',
  description: 'Free API credits, GPU compute, and Hanzo Team access for open-source contributors, academic PhD researchers, and research interns.',
};

export default function Page() {
  return <><JsonLd route="/grants" /><Grants /></>;
}
