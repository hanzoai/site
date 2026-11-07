// V2: 8/10 Editorial story, v3 (JAMES.md): no hues or eyebrows; masthead kinetic headline with its one ask beside the press kit dealing its plates once, the kit as an asymmetric spread, the boilerplate as a standfirst, the news as huge headlines with a card that follows the pointer, press contact as the one dark room over a Sigil, leadership with portraits
// Persona: a journalist or analyst writing about Hanzo (PLAN 1.1 "Investor and press")
// Goal: leave with the kit, the facts and the right person to email
// CTA: "Contact Press Team" (mailto:press@hanzo.ai) in the hero and the shared sticky ask bar (data-thumb), data-cta press.hero; "Request Executive Bios" (press.bios) at the end; metric: one contact click
// Signature: the news index: six headlines set huge, one per line; point at one and the rest step back while a card with its date and summary follows the pointer on a spring
// Beyond: the boilerplate copies in one press and the press email copies beside the address, so a writer leaves with both without retyping
// Deletes: the magenta accent, the kickers over the h1, over "Meet our team" and over the email and address, the "/blog" text in the news card, the visible copy label, the endless plate loop, raw img
import Press from '../../components/pages/Press';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Press Resources. — Hanzo AI',
  description: 'Everything you need to write about Hanzo AI, Inc. Download our press kit, access brand assets, and find media contacts.',
};

export default function Page() {
  return <><JsonLd route="/press" /><Press /></>;
}
