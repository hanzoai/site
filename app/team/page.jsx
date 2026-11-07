// V2: 8/10 v3 to JAMES.md: ink and greys only, no labels over headlines, one solid ask ("Create your team") with the shared ask bar after the hero, the live canvas plays its story once and rests with a replay control, Sigil close
// Persona: a team lead choosing where people and agents work together · Goal: start a team · CTA: Create your team (team.hero) · Metric: signup_start
// Signature: a shared canvas where human and agent cursors move and edit cards live — Zoe reports, Dev takes the card and fixes it, Qa verifies and moves it to Done — the big hero object of the page, tilting up into place as you scroll
// Beyond: go to your team's channel — Hanzo's line of ten teams is a row of buttons; press yours and the dark workflow room switches straight to its channel and crew
// Deletes: the amber accent, every eyebrow over a headline, the endless canvas loop, invented labels ("Go to your team's channel", "Source", "Deploy"), visible social-network words
import TeamPage from '../../components/pages/TeamPage';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Hanzo Team — the workspace for humans and AI — Hanzo AI',
  description: 'Your people and your AI agents plan, build, and ship together in one workspace: channels, direct messages, and agents you hand work to with a mention.',
};

export default function Page() {
  return <><JsonLd route="/team" /><TeamPage /></>;
}
