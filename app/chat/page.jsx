// Signature: the live chat runs itself, and each question visibly routes through Enso to the model that answers
// Beyond: who answers what, a spec sheet of Enso and its eight models that opens each one into its page
import ChatPage from '../../components/pages/ChatPage';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Hanzo Chat — a chat app that does more than answer',
  description: 'AI chat that searches the web, executes code, analyzes files, and generates images in one workspace. Run in the cloud or self-hosted.',
};

export default function Page() {
  return <><JsonLd route="/chat" /><ChatPage /></>;
}
