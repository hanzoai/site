// V2: 8/10 Story on the Hanzo deck: headline with its one ask beside the press kit dealing its plates once after the curtain, the kit as a flat spread, Hanzo's boilerplate read word by word as you scroll, the four facts settling once, the news as big headlines with a card riding beside the row you point at, press contact as the one black room, assets, channels and leadership with portraits
// Persona: a journalist or analyst writing about Hanzo (MASTER: investors and press)
// Goal: leave with the kit, the facts and the right person to email
// CTA: "Contact Press Team" (mailto:press@hanzo.ai) in the hero and the shared sticky ask bar (data-thumb), data-cta press.hero; "Request Executive Bios" (press.bios) at the end; metric: one contact click
// Signature: the belief line: Hanzo's boilerplate is read word by word, each word turning from faint to ink as it scrolls through the screen, then the four facts settle into place once
// Beyond: the boilerplate copies in one press and the press email copies beside the address, so a writer leaves with both without retyping
// Deletes: the magenta accent, the kickers over the h1, over "Meet our team" and over the email and address, the "/blog" text in the news card, the visible copy label, the endless plate loop, raw img, the contact room's Sigil, springs, the portrait filter, hover transforms
import Press from '../../components/pages/Press';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Press Resources. — Hanzo AI',
  description: 'Everything you need to write about Hanzo AI, Inc. Download our press kit, access brand assets, and find media contacts.',
};

export default function Page() {
  return <><JsonLd route="/press" /><Press /></>;
}
