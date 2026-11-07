// V2: 8/10 Story on the Hanzo deck: the kit dealing out is the signature (stack to spread, pinned, a sheen on the dark plate); heads rest at 26-32 with one big thing per screen; the lower half has a beat per section (email typed, partner hairlines drawn, channel index walking once, team plates opening); phone news is one card walking the stories; the email types inside a reserved box (no jump), Connect sets the walked handle large, one solid at the close
// Persona: a journalist or analyst writing about Hanzo (MASTER: investors and press)
// Goal: leave with the kit, the facts and the right person to email
// CTA: "Contact Press Team" (mailto:press@hanzo.ai) in the hero and the shared sticky ask bar (data-thumb), data-cta press.hero; "Request Executive Bios" (press.bios) at the end; metric: one contact click
// Signature: the kit deals out: the three press-kit plates sit as one stack beside the headline and fan out into the kit spread as the pinned stage scrolls; the boilerplate's word fill is demoted to support
// Beyond: the boilerplate copies in one press and the press email copies beside the address, so a writer leaves with both without retyping
// Deletes: the second copy of the kit plates, the 3x3 channel tiles and icon circles, the six partner boxes, the page tokens overriding deck greys, the aria-label-only captions, the magenta accent, springs, the portrait filter
import Press from '../../components/pages/Press';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Press Resources. — Hanzo AI',
  description: 'Everything you need to write about Hanzo AI, Inc. Download our press kit, access brand assets, and find media contacts.',
};

export default function Page() {
  return <><JsonLd route="/press" /><Press /></>;
}
