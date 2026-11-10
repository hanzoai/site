// Signature: Scrubbable film timeline: a viewer whose camera move (Dolly In, Crane Rise, Vertigo Zolly, Crash Zoom, 360° Orbit) plays on a real still, a draggable playhead crossing Koma video, Oto foley, Koe voice and Uta score tracks, the shot, rig label and Actor Lock changing as it passes; it plays by itself until you grab it.
// Beyond: "Studio or Design?": say what you are making and Hanzo's own sentence on each sends you to /design or studio.hanzo.ai.
import Studio from '../../components/pages/Studio';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/studio'].title, description: INDEX['/studio'].description };

export default function Page() {
  return <><JsonLd route="/studio" /><Studio /></>;
}
