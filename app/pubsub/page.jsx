// Signature: one message fanning out — published, stored with its sequence, copied to every subscriber, handed to one queue-group member, acked or redelivered, replayed from any point
// Beyond: ack policy switch — the live fan-out re-runs under Hanzo's three ack choices (every message, all below a sequence, none) so redelivery appears and vanishes before you pick
// V2: Poster launch in grey: full-bleed dark bus (toolbar with NATS JetStream, pause, replay point under the pointer) over a giant title and its one ask; the statement opens six pinned chapters over one server inspector whose rows open each chapter; 4222 spec in the light room; events.go beside "Put it between your services"
// Persona: Developer
// Goal: try Hanzo PubSub (read the source, then deploy it)
// CTA: GitHub → https://github.com/hanzoai/pubsub (data-cta pubsub.hero, pubsub.close)
// Metric: api_key_created
import Pubsub from '../../components/pages/cloud/Pubsub';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/pubsub'].title, description: INDEX['/pubsub'].description };

export default function Page() {
  return <><JsonLd route="/pubsub" /><Pubsub /></>;
}
