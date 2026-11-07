// Signature: a shared canvas where human and agent cursors move and edit cards live — Zoe reports, Dev takes the card and fixes it, Qa verifies and moves it to Done — then ten workflows on a turning carousel
// Beyond: go to your team's channel — Hanzo's line of ten teams is a row of buttons; press yours and the carousel turns straight to its channel and crew
import TeamPage from '../../components/pages/TeamPage';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Hanzo Team — the workspace for humans and AI — Hanzo AI',
  description: 'Your people and your AI agents plan, build, and ship together in one workspace: channels, direct messages, and agents you hand work to with a mention.',
};

export default function Page() {
  return <><JsonLd route="/team" /><TeamPage /></>;
}
