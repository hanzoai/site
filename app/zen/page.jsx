// V2: 8/10 Apple-grade launch in Hanzo's own black and white: the film lands full-bleed and settles into an arch around Zen's sphere; Zen's figures as heroes; open weights, Zen 6 Flash and Zen 6 pin as chapters; the reasoning trace is the one dark room; the Zen family as tiles; Hanzo's exact model cards; a closing band
// Persona: Developer · Goal: pick a Zen and run it · CTA: Try Hanzo (/login, data-thumb) · metric: signup_start
// Signature: the reasoning trace — Zen thinks out loud about which Zen to run, each step reading one fact off the two model cards beside it until the answer lands on its card; the film settles into an arch and the Zen 6 family pins as chapters
// Beyond: a chooser built only from Zen's own facts — runs on my machine, reads video, price — that ends on the model to run, then the family tiles lead to every Zen with its own living sigil
import Zen from '../../components/pages/model/Zen';
import JsonLd from '../../components/JsonLd';

export const metadata = { title: "The Zen family — Hanzo AI", description: "Open-weight foundation models for agentic coding. Download weights or run Zen 6 and Zen 6 Flash directly on Hanzo Cloud." };

export default function Page() {
  return <><JsonLd route="/zen" /><Zen /></>;
}
