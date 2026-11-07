// Signature: a live terminal session where the task types, the diff lands in the file and the tests go green, then a split-screen race
// Beyond: your first session, three lines of Hanzo's own commands built from your answers
import DevPage from '../../components/pages/DevPage';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Hanzo Dev — the coding agent',
  description: 'Autonomous AI coding agent for your terminal, IDE, and cloud. Reads code, fixes bugs, runs tests, and creates PRs. Open source.',
};

export default function Page() {
  return <><JsonLd route="/dev" /><DevPage /></>;
}
