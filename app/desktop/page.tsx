// Signature: The Hanzo Desktop window assembles itself centre stage in your own system's chrome (detected): title bar, sidebar, composer, then it builds one thing in front of you, the payments rate limiter, file written and tests passing
// Beyond: Cut the network: make an agent in the page, pin its model on your machine or on Hanzo Cloud, pull the wire and watch which one keeps running and where its keys and data stay
import DesktopPage from '../../components/pages/DesktopPage';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Hanzo Desktop — Hanzo AI',
  description: 'Native desktop app for macOS, Windows, and Linux. Run local models, orchestrate AI agents, and manage cloud workspaces.',
};

export default function Page() {
  return <><JsonLd route="/desktop" /><DesktopPage /></>;
}
