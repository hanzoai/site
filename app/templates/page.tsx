// V2: the riffling deck of live windows is the first screen's object (drag flips, never opens), a dense wall of twelve previews that open into sheets, the setup room in the dark, a closing band with the one ask; deck greys only
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
