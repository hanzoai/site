// Signature: one message fanning out — published, stored with its sequence, copied to every subscriber, handed to one queue-group member, acked or redelivered, replayed from any point
// Beyond: ack policy switch — the live fan-out re-runs under Hanzo's three ack choices (every message, all below a sequence, none) so redelivery appears and vanishes before you pick
import Pubsub from '../../components/pages/cloud/Pubsub';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/pubsub'].title, description: INDEX['/pubsub'].description };

export default function Page() {
  return <><JsonLd route="/pubsub" /><Pubsub /></>;
}
