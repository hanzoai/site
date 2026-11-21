// Signature: One button that knows your OS sits at the centre of a four-quadrant dial, and every other build fans out of it onto the orbit, grouped by product; point at one and a ray runs from your button to it with its file and size
// Beyond: Your kit: the page already guessed your system and browser; confirm them and your editor, and it lists exactly your files across Desktop, CLI, Dev, Bot, Team, IDE, browser, and editor
import DownloadPage from '../../components/pages/DownloadPage';
import JsonLd from '../../components/JsonLd';
import { latestDesktop, latestTag } from '../../lib/desktop';

export const metadata = {
  title: 'Download Hanzo — Hanzo AI',
  description: 'Download Hanzo Desktop for macOS, Windows, or Linux: open it, sign in, and start, no terminal needed. Browser and editor extensions, and the CLI and Dev for developers.',
};

// Desktop's latest release and the developer tools' latest tags, read from GitHub when the page is built (the browser
// asks again for Desktop). Any failure keeps DownloadPage's own last-seen values.
export default async function Page() {
  const [desktop, cli, dev, node] = await Promise.all([latestDesktop(), latestTag('cli'), latestTag('dev'), latestTag('node')]);
  return <><JsonLd route="/download" /><DownloadPage desktop={desktop} tags={{ cli, dev, node }} /></>;
}
