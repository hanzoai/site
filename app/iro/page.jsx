// V2: 8/10 Apple-grade launch in Hanzo's own black and white: the film lands full-bleed and settles into a square canvas beside the headline; the live image-from-noise canvas comes first, then four pinned capability chapters on Iro's own film, a tile grid of where it fits, the studio map on Hanzo's black model cards, the preview, Hanzo's exact model cards and a closing band
// Persona: Creative studio (researcher audience) · Goal: request research access · CTA: Request access (/research-access?models=iro, data-thumb) · metric: contact_sales_submit
// Signature: an image resolves out of noise — the canvas runs flow matching, coarse shapes first and detail last, step 1 to 50, then reseeds; scrub, pause, reseed or reframe it; the film settles into a square canvas beside the headline
// Beyond: the studio map — pick a field and see every Hanzo creative model that serves it, in its own words and own colour; each tile opens its model
import Iro from '../../components/pages/model/Iro';
import JsonLd from '../../components/JsonLd';

export const metadata = { title: "Iro — Imagine without limits. | Hanzo Creative AI", description: "High-fidelity image generation, creative direction, editing, character design and consistent visual assets. Request research access and studio workflows." };

export default function Page() {
  return <><JsonLd route="/iro" /><Iro /></>;
}
