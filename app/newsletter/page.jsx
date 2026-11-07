// Signature: the issue writes itself on paper, then folds into an envelope addressed to you.
// Beyond: the double opt-in drawn before you commit: subscribe, confirm the link, then the first issue; nothing in between.
// V2: 8/10 the name at full display size over one big email field, the paper issue as the hero object; what each issue carries as three statements whose weight swells as they cross the screen; the double opt-in as the dark room
import Newsletter from '../../components/pages/Newsletter';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Subscribe to Hanzo AI Newsletter & Developer Updates — Hanzo AI',
  description: 'Opt in to receive frontier AI model announcements (Enso, Zen 6), developer tutorials, platform updates, and technical deep dives from Hanzo AI.',
};

export default function Page() {
  return <><JsonLd route="/newsletter" /><Newsletter /></>;
}
