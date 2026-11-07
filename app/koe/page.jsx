// V2: 8/10 Apple-grade launch in Hanzo's own black and white: the film lands full-bleed and settles into a tall voice capsule left of the headline (a pill on phones); four pinned capability chapters, then the live booth waveform with its phonemes, a tile grid of where it fits, the studio map, the preview, Hanzo's exact model cards and a closing band
// Persona: Creative studio (researcher audience) · Goal: request research access · CTA: Request access (/research-access?models=koe, data-thumb) · metric: contact_sales_submit
// Signature: a voice waveform with its transcript — the phonemes of Hanzo light in step as the waveform streams, and four acting presets re-perform the same word; the film settles into a tall voice capsule
// Beyond: the studio map for voice — which creative models serve localization, game dialogue and audiobooks beside Koe, in their own words, each tile opening its model
import Koe from '../../components/pages/model/Koe';
import JsonLd from '../../components/JsonLd';

export const metadata = { title: "Koe — Performance in every word. | Hanzo Creative AI", description: "Directable speech synthesis, character performances, dubbing and multilingual dialogue. Request research access and studio workflows." };

export default function Page() {
  return <><JsonLd route="/koe" /><Koe /></>;
}
