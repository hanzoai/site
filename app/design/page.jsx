import DesignPage from '../../components/pages/DesignPage';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Hanzo Design — Create visuals, presentations, documents, ads & interactive apps',
  description: 'The AI creative workspace inside Hanzo. Upload any file — audio, images, PDFs, or datasets — to create visuals, slide decks, documents, ads, videos, and interactive music apps.',
};

export default function Page() {
  return <><JsonLd route="/design" /><DesignPage /></>;
}
