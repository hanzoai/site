// V2: 8/10 Utility, answer-as-you-type: one line of huge type, a big search pill that types Hanzo's phrases when idle, the best way to get help rising into a large answer card as the words change, the six ways as a re-ranking index, one dark closing room
// Signature: Help that answers as you type: every finished word re-ranks Hanzo's six ways to get help and the best one rises into the answer card under the search pill, words lit, an Enter away
// Beyond: Whatever you typed becomes the subject line of a ready-to-send email to support@hanzo.ai; when nothing matches, the answer itself becomes that email
import Support from '../../components/pages/Support';
import JsonLd from '../../components/JsonLd';

export const metadata = { title: 'Support — Hanzo', description: 'Get help with Hanzo — the Help Center, documentation, live system status, and a way to reach a human.' };

export default function Page() {
  return <><JsonLd route="/support" /><Support /></>;
}
