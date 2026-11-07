import DownloadPage from '../../components/pages/DownloadPage';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Download Hanzo — Hanzo AI',
  description: 'Download the Hanzo desktop app, the CLI, and the extension for your browser and editor. One account signs in to all of them.',
};

export default function Page() {
  return <><JsonLd route="/download" /><DownloadPage /></>;
}
