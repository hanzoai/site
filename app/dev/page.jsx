import DevPage from '../../components/pages/DevPage';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Hanzo Dev — the coding agent',
  description: 'Autonomous AI coding agent for your terminal, IDE, and cloud. Reads code, fixes bugs, runs tests, and creates PRs. Open source.',
};

export default function Page() {
  return <><JsonLd route="/dev" /><DevPage /></>;
}
