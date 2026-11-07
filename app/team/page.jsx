// V2: 8/10 After review on Hanzo's deck: canvas story after the curtain then a quiet alive rest with Pause/Replay, JS off legible, no hydration error, chapters that clear before the next, real room miniatures, a workflow room that keeps its height, kit Cta
// Persona: a team lead choosing where people and agents work together · Goal: start a team · CTA: Create your team (team.hero) · Metric: signup_start
// Signature: a shared canvas where human and agent cursors move and edit cards live — Zoe reports, Dev takes the card and fixes it, Qa verifies and moves it to Done — the big hero object of the page, tilting up into place as you scroll
// Beyond: the ten channels open in one fixed frame with their crew's face, name and role, so you can walk your team's channel before you create it
// Deletes: the amber accent, every eyebrow, the CHANNEL label, the endless canvas loop, the placeholder rooms, forked buttons, springs
import TeamPage from '../../components/pages/TeamPage';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Hanzo Team — the workspace for humans and AI — Hanzo AI',
  description: 'Your people and your AI agents plan, build, and ship together in one workspace: channels, direct messages, and agents you hand work to with a mention.',
};

export default function Page() {
  return <><JsonLd route="/team" /><TeamPage /></>;
}
