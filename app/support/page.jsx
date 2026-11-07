// Signature: Help that types: a search-first help desk whose six ways to get help re-rank and light up as you type
// Beyond: Whatever you typed becomes the subject line of a ready-to-send email to support@hanzo.ai
import Support from '../../components/pages/Support';
import JsonLd from '../../components/JsonLd';

export const metadata = { title: 'Support — Hanzo', description: 'Get help with Hanzo — the Help Center, documentation, live system status, and a way to reach a human.' };

export default function Page() {
  return <><JsonLd route="/support" /><Support /></>;
}
