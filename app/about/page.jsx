// Signature: six reasons Hanzo builds as tiles that open; a tile grows into its own full sheet (shared-element morph) and folds back
// Beyond: pick two? keep all four: the lede's four trade-offs as switches that never knock each other off, each showing the line that holds it
import About from '../../components/pages/About';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Chasing the Pareto Frontier of AI — Hanzo AI',
  description: "From SKULLY and open-source commerce, through Techstars '17, to 1,600+ open repositories and the sovereign AI cloud today — advancing AI safety, performance, equitable access, privacy, and ownership.",
};

export default function Page() {
  return <><JsonLd route="/about" /><About /></>;
}
