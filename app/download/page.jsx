// Signature: One button that knows your OS sits at the centre of a four-quadrant dial, and every other build fans out of it onto the orbit, grouped by product; point at one and a ray runs from your button to it with its file and size
// Beyond: Your kit: the page already guessed your system and browser; confirm them and your editor, and it lists exactly your files, one per product, each with its own size and link (no Desktop on Windows, as Hanzo ships it)
import DownloadPage from '../../components/pages/DownloadPage';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Download Hanzo — Hanzo AI',
  description: 'Download the Hanzo desktop app, the CLI, and the extension for your browser and editor. One account signs in to all of them.',
};

export default function Page() {
  return <><JsonLd route="/download" /><DownloadPage /></>;
}
