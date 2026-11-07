import ChatPage from '../../components/pages/ChatPage';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Hanzo Chat — a chat app that does more than answer',
  description: 'AI chat that searches the web, executes code, analyzes files, and generates images in one workspace. Run in the cloud or self-hosted.',
};

export default function Page() {
  return <><JsonLd route="/chat" /><ChatPage /></>;
}
