// Persona: a builder who wants Hanzo's releases in the inbox
// Goal: subscribe
// CTA: Subscribe (kit Cta newsletter.subscribe; the header carries it after the hero)
// Metric: lead_submit
// Signature: the issue writes itself on paper, then folds into an envelope addressed to you.
// Beyond: the double opt-in drawn before you commit: subscribe, confirm the link, then the first issue; nothing in between.
// V2: 8/10 two pinned scenes: a second issue composed line by line (one statement at 44px) and the opt-in walked by scroll; the paper tilts and writes your address; no phone shift; one solid per screen
import Newsletter from '../../components/pages/Newsletter';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Subscribe to Hanzo AI Newsletter & Developer Updates — Hanzo AI',
  description: 'Opt in to receive frontier AI model announcements (Enso, Zen 6), developer tutorials, platform updates, and technical deep dives from Hanzo AI.',
};

export default function Page() {
  return <><JsonLd route="/newsletter" /><Newsletter /></>;
}
