// V2: 8/10 v3 to JAMES.md: ink and greys only, no label over the h1, one line of huge type, the pill types three of Hanzo's phrases once (with a pause) then rests, the answer card with its giant numeral beside the six ways as a live list that re-ranks as you type, the enterprise line as the dark room over a slow contour field; arrivals wait for the curtain, every answer readable with JS off
// Persona: a customer or developer who needs help now · Goal: reach the right door in one step · CTA: Open Help Center (support.answer.1) · Metric: the one contact click
// Signature: Help that answers as you type: every finished word re-ranks Hanzo's six ways to get help, the list re-orders on a spring and the best one rises into the answer card under the search pill, words marked, an Enter away
// Beyond: Whatever you typed becomes the subject line of a ready-to-send email to support@hanzo.ai; when nothing matches, the answer itself becomes that email with your words shown as its subject
// Deletes: the green accent, the Support eyebrow, the invented labels (Best match, Start here, From what you typed), the endless typing loop and bouncing dots, the text-only index section
import Support from '../../components/pages/Support';
import JsonLd from '../../components/JsonLd';

export const metadata = { title: 'Support — Hanzo', description: 'Get help with Hanzo — the Help Center, documentation, live system status, and a way to reach a human.' };

export default function Page() {
  return <><JsonLd route="/support" /><Support /></>;
}
