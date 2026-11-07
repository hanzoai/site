import About from '../../components/pages/About';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Chasing the Pareto Frontier of AI — Hanzo AI',
  description: "From SKULLY and open-source commerce, through Techstars '17, to 1,600+ open repositories and the sovereign AI cloud today — advancing AI safety, performance, equitable access, privacy, and ownership.",
};

export default function Page() {
  return <><JsonLd route="/about" /><About /></>;
}
