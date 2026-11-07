// V2: 8/10 Utility to MASTER.md and review/support.md: deck type and neutrals only, one line of display type after the curtain clears, a 56px pill with one concentric focus ring, the answer re-ranks only on finished words (a space or 300ms), tickets finds ticket, no match becomes an email with your words, the demo types Hanzo's phrase without ever changing the ask, the preview stays reachable, a closing Band
// Persona: a customer or developer who needs help now · Goal: reach the right door in one step · CTA: Open Help Center (support.answer.1) · Metric: the one contact click
// Signature: Help that answers as you type: each finished word re-ranks Hanzo's six ways to get help, the list re-orders and the best one rises into the answer card under the search pill, words marked, an Enter away; one letter or half a word changes nothing
// Beyond: Whatever you typed becomes the subject line of a ready-to-send email to support@hanzo.ai; when nothing matches, the answer itself becomes that email with your words shown as its subject
// Deletes: the green accent, the Support eyebrow, the invented labels, the giant 01–06 numerals, the ↵ glyphs and dead ↵ circle, the placeholder that repeated the h1, the square focus box in the pill, the demo that swapped the ask, springs, six raw .x-btn (now Go), the custom dark room (now the kit Band), the panes that took taps before hydration
import Support from '../../components/pages/Support';
import JsonLd from '../../components/JsonLd';

export const metadata = { title: 'Support — Hanzo', description: 'Get help with Hanzo — the Help Center, documentation, live system status, and a way to reach a human.' };

export default function Page() {
  return <><JsonLd route="/support" /><Support /></>;
}
