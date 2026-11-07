// Signature: a piano roll that plays — two bars in D minor at 96 BPM loop across Uta's four stems while the playhead lights each note; solo a stem, re-voice it with a preset, tap to add a melody note, turn on Sound
// Beyond: take it to your DAW — Download MIDI writes the roll as you left it, your notes included, into a Standard MIDI File at 96 BPM with one channel per stem
import ModelPage from '../../components/ModelPage';
import Creative from '../../components/pages/model/Creative';
import Uta from '../../components/pages/model/Uta';
import JsonLd from '../../components/JsonLd';

export const metadata = { title: "Uta — Compose beyond imagination. | Hanzo Creative AI", description: "Soundtracks, original songs, musical ideas, cue-driven scoring and creative music production. Request research access and studio workflows." };

export default function Page() {
  return <><JsonLd route="/uta" /><ModelPage slug="uta"><Creative slug="uta"><Uta /></Creative></ModelPage></>;
}
