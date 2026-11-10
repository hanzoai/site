// V2: 8/10 One question at a time: the help-finder asks your words on one screen (the search pill, still answering as you type) and slides to the six ways as choices, the answer card beside it the summary that builds; five page-local entrances; the closing Band leans toward the pointer
// Persona: a customer or developer who needs help now · Goal: reach the right door in one step · CTA: Open Help Center (support.answer.1) · Metric: the one contact click
// Signature: one-question: screen 1 is the search pill (each finished word re-ranks Hanzo's six ways and the best rises into the answer card, words marked); Enter or the arrow slides to screen 2, the six ways as choices ranked by your words; the answer card is the summary as it builds (your words, the way, its action); arrow keys, Enter, Back
// Entrances: card-deal (h1), cursor-lens (lede), fold-out (question screens), tile-flip (answer card), tilt-3d-hover (closing Band)
// Beyond: Whatever you typed becomes the subject line of a ready-to-send email to support@hanzo.ai; when nothing matches, the answer itself becomes that email with your words shown as its subject
// Deletes: the green accent, the Support eyebrow, the invented labels, the giant 01–06 numerals, the ↵ glyphs and dead ↵ circle, the placeholder that repeated the h1, the square focus box in the pill, the demo that swapped the ask, springs, six raw .x-btn (now Go), the custom dark room (now the kit Band), the panes that took taps before hydration, the kit's blurred word reveal on the Band
import Support from '../../components/pages/Support';
import JsonLd from '../../components/JsonLd';

export const metadata = { title: 'Support — Hanzo', description: 'Get help with Hanzo — the Help Center, documentation, live system status, and a way to reach a human.' };

export default function Page() {
  return <><JsonLd route="/support" /><Support /></>;
}
