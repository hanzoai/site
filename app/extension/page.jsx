// Signature: A browser frame with the extension side panel sliding in over the page, walking its five points, then sliding away
// Beyond: The page reads which browser you are in and puts that build first, so your download is the first button
import ExtensionPage from '../../components/pages/ExtensionPage';
import JsonLd from '../../components/JsonLd';

export const metadata = { title: 'Hanzo Extension — your browser, as a tool an agent can use', description: 'Browser extension for Chrome, Firefox, and Safari. Let Hanzo AI agents navigate tabs, extract data, and automate browser tasks securely.' };

export default function Page() {
  return <><JsonLd route="/extension" /><ExtensionPage /></>;
}
