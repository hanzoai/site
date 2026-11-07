// V2: 8/10 Apple-grade launch in Hanzo's own black and white: the film lands full-bleed and closes as one band into a waveform beside the headline; the live soundstage spectrogram is the one dark room, then four pinned capability chapters, a tile grid of where it fits, the studio map, the preview, Hanzo's exact model cards and a closing band
// Persona: Creative studio (researcher audience) · Goal: request research access · CTA: Request access (/research-access?models=oto, data-thumb) · metric: contact_sales_submit
// Signature: a live spectrogram — each Foley prop fires on its cue and paints its sound into the scrolling spectrum while the bus meters answer, with real sound on demand; the film settles into a waveform
// Beyond: the studio map, toured by field — every creative model that serves film, games, advertising, publishing or design and space, in its own words; tap any prop to hear it synthesised in the browser
import Oto from '../../components/pages/model/Oto';
import JsonLd from '../../components/JsonLd';

export const metadata = { title: "Oto — Give every moment its sound. | Hanzo Creative AI", description: "Film Foley, immersive sound effects, environmental audio and synchronized scene sound. Request research access and studio workflows." };

export default function Page() {
  return <><JsonLd route="/oto" /><Oto /></>;
}
