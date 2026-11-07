// Persona: a builder who wants Hanzo's releases in the inbox
// Goal: subscribe
// CTA: Subscribe (kit Cta newsletter.subscribe; the header carries it after the hero)
// Metric: lead_submit
// Signature: the issue writes itself on paper, then folds into an envelope addressed to you.
// Beyond: the double opt-in drawn before you commit: subscribe, confirm the link, then the first issue; nothing in between.
// V2: 8/10 the opt-in is one stage walking its four steps once (one big at a time, gliding marker); statements ink in word by word with a resting caret; Subscribe and Privacy answer hover
import Newsletter from '../../components/pages/Newsletter';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Subscribe to Hanzo AI Newsletter & Developer Updates — Hanzo AI',
  description: 'Opt in to receive frontier AI model announcements (Enso, Zen 6), developer tutorials, platform updates, and technical deep dives from Hanzo AI.',
};

export default function Page() {
  return <><JsonLd route="/newsletter" /><Newsletter /></>;
}
