// Signature: One button that knows your OS sits at the centre of a four-quadrant dial, and every other build fans out of it onto the orbit, grouped by product; point at one and a ray runs from your button to it with its file and size
// Beyond: Your kit: the page already guessed your system and browser; confirm them and your editor, and it lists exactly your files across Desktop, CLI, Dev, Bot, Team, IDE, browser, and editor
import DownloadPage from '../../components/pages/DownloadPage';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Download Hanzo — Hanzo AI',
  description: 'Download Hanzo Desktop, IDE, Bot, Team, CLI, Dev, and extensions for macOS, Windows, Linux, browsers, and editors. One account signs in to all of them.',
};

export default function Page() {
  return <><JsonLd route="/download" /><DownloadPage /></>;
}
