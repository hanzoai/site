// Signature: Mention map: one @Hanzo at the centre, rings spreading out across a field of channels, then branching into Canvas, Diff, Preview and the merged PR #418; click any node to read that moment of the thread.
// Beyond: "Will Hanzo see this?": pick where a message lives (a channel with @Hanzo added or not, tagged or not, scheduled work, a direct message) and get the answer from Hanzo's own FAQ sentences.
import Tag from '../../components/pages/Tag';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/tag'].title, description: INDEX['/tag'].description };

export default function Page() {
  return <><JsonLd route="/tag" /><Tag /></>;
}
