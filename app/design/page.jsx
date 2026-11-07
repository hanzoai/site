// Signature: Editorial type runs into a live workspace window: one conversation, and its tab morphs on its own between music app, deck, ad suite, visual, document and video while the matching word of the headline lights up
// Beyond: One brief: write your own brief once, choose the artifacts you want, and the set one conversation hands back is laid out with each one's format and the model behind it
import DesignPage from '../../components/pages/DesignPage';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Hanzo Design — Create visuals, presentations, documents, ads & interactive apps',
  description: 'The AI creative workspace inside Hanzo. Upload any file — audio, images, PDFs, or datasets — to create visuals, slide decks, documents, ads, videos, and interactive music apps.',
};

export default function Page() {
  return <><JsonLd route="/design" /><DesignPage /></>;
}
