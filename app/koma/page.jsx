// V2: 8/10 Apple-grade launch in amber: the film lands full-bleed and settles into an anamorphic frame across the top with the headline split beneath it; four pinned capability chapters on Koma's film, then the scrubbable cinema monitor as the one dark room, a tile grid of where it fits, the studio map and the preview
// Signature: a four-shot timeline you scrub — the playhead runs Koma's film through four camera moves with a cut between each, and the film, timecode and shot follow your hand; the film settles into an anamorphic frame across the top
// Beyond: the studio map — every Hanzo creative model that serves your field, in its own words and colour, each tile opening its model; Koma's chapters frame its own film shot by shot
import Koma from '../../components/pages/model/Koma';
import JsonLd from '../../components/JsonLd';

export const metadata = { title: "Koma — Every frame tells a story. | Hanzo Creative AI", description: "Cinematic video generation, character continuity, motion, animation, and shot-level creative control. Request research access and studio workflows." };

export default function Page() {
  return <><JsonLd route="/koma" /><Koma /></>;
}
