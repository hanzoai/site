import CliPage from '../../components/pages/CliPage';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'A senior engineer in your shell — Hanzo AI',
  description: 'One unified CLI for autonomous coding, model inference, and cloud deployments. Plan, edit, deploy, and monitor directly from your terminal.',
};

export default function Page() {
  return <><JsonLd route="/cli" /><CliPage /></>;
}
