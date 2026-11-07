// Signature: Three browser windows fanned like a hand of cards (neutral Chrome, Firefox and Safari chrome); the one you are using is brought to the front, and the Hanzo side panel slides in over a real page and walks its five points, the stack shuffling under it on "one behaviour"
// Beyond: The page reads which browser you are in, deals that window to the front of the hero and puts that build first in the list, so your download is the first button
import ExtensionPage from '../../components/pages/ExtensionPage';
import JsonLd from '../../components/JsonLd';

export const metadata = { title: 'Hanzo Extension — your browser, as a tool an agent can use', description: 'Browser extension for Chrome, Firefox, and Safari. Let Hanzo AI agents navigate tabs, extract data, and automate browser tasks securely.' };

export default function Page() {
  return <><JsonLd route="/extension" /><ExtensionPage /></>;
}
