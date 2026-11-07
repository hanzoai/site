// V2: 8/10 Launch page: the live shared canvas is the big hero object and tilts up into place on scroll, three pinned chapters, a bento of rooms, ten workflows in one dark room, the code channel as a wide window, a spec sheet and one closing action
// Signature: a shared canvas where human and agent cursors move and edit cards live — Zoe reports, Dev takes the card and fixes it, Qa verifies and moves it to Done — the big hero object of the page, tilting up into place as you scroll
// Beyond: go to your team's channel — Hanzo's line of ten teams is a row of buttons; press yours and the dark workflow room switches straight to its channel and crew
import TeamPage from '../../components/pages/TeamPage';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Hanzo Team — the workspace for humans and AI — Hanzo AI',
  description: 'Your people and your AI agents plan, build, and ship together in one workspace: channels, direct messages, and agents you hand work to with a mention.',
};

export default function Page() {
  return <><JsonLd route="/team" /><TeamPage /></>;
}
