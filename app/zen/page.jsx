// Signature: the reasoning trace — Zen thinks out loud about which Zen to run, each step reading one fact off the two model cards beside it until the answer lands on its card
// Beyond: a chooser built only from Zen's own facts — runs on my machine, reads video, price — that ends on the model to run, then the family strip leads to every Zen with its own living sigil
import ModelPage from '../../components/ModelPage';
import Zen from '../../components/pages/model/Zen';
import JsonLd from '../../components/JsonLd';

export const metadata = { title: "The Zen family — Hanzo AI", description: "Open-weight foundation models for agentic coding. Download weights or run Zen 6 and Zen 6 Flash directly on Hanzo Cloud." };

export default function Page() {
  return <><JsonLd route="/zen" /><ModelPage slug="zen"><Zen /></ModelPage></>;
}
