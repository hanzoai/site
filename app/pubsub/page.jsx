// Persona: Developer
// Goal: try Hanzo PubSub (read the source, then deploy it)
// CTA: GitHub → https://github.com/hanzoai/pubsub (data-cta pubsub.hero, pubsub.close)
// Metric: github_click (the live ask is GitHub; no button here creates a key)
// Signature: one message fanning out — published, stored with its sequence, copied to every subscriber, handed to one queue-group member, acked or redelivered, replayed from any point
// Beyond: ack policy switch — the live fan-out re-runs under Hanzo's three ack choices (every message, all below a sequence, none) so redelivery appears and vanishes before you pick
// V2: 8/10 The black room is the hero: name, line and one ask left, the bus right where one message drops into the stream and fans out down drawn wires; six pinned chapters over one outlined server inspector; the 4222 spec in the quiet room; deck greys, tweens only
import Pubsub from '../../components/pages/cloud/Pubsub';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/pubsub'].title, description: INDEX['/pubsub'].description };

export default function Page() {
  return <><JsonLd route="/pubsub" /><Pubsub /></>;
}
