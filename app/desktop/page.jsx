import DesktopPage from '../../components/pages/DesktopPage';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Hanzo Desktop — Hanzo AI',
  description: 'Native desktop app for macOS, Windows, and Linux. Run local models, orchestrate AI agents, and manage cloud workspaces.',
};

export default function Page() {
  return <><JsonLd route="/desktop" /><DesktopPage /></>;
}
