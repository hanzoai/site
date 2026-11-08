// Persona: Developer
// Goal: try Hanzo PubSub (read the source, then deploy it)
// CTA: GitHub → https://github.com/hanzoai/pubsub (data-cta pubsub.hero, pubsub.close)
// Metric: github_click (the live ask is GitHub; no button here creates a key)
// Signature: globe — one message on events.user.signup is published in one place, written into the stream EVENTS in another, fanned out round the planet to analytics, audit and one member of a queue group, and acked home; drag to spin it
// Beyond: ack policy switch — the same fan-out re-runs under Hanzo's three ack choices (every message, all below a sequence, none), so the redelivery arc and the acks appear and vanish as you pick
// V2: The black room is the hero: name, line and one ask left, the globe right with the stream tray, subscribers and ack switch under it; events.go next; the six facts as one plain numbered list (no pinned chapters); the 4222 spec in the quiet room; deck greys, tweens only
import Pubsub from '../../components/pages/cloud/Pubsub';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/pubsub'].title, description: INDEX['/pubsub'].description };

export default function Page() {
  return <><JsonLd route="/pubsub" /><Pubsub /></>;
}
