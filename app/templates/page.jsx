// V2: 8/10 Stage deck (the riffling deck of live windows arrives huge and settles), a shelf of all twelve whose tiles open into sheets, the setup room in the dark, deck greys only
// Signature: a deck of live browser windows that riffles itself; pull one forward and its address bar types its .hanzo.app name.
// Beyond: the commands for the template in front, with its slug and its source repository filled in, ready to copy.
import Templates from '../../components/pages/Templates';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Start from a product — Hanzo AI',
  description: 'Open a finished product, edit it in Hanzo, and bring it into any coding agent you already use.',
};

export default function Page() {
  return <><JsonLd route="/templates" /><Templates /></>;
}
