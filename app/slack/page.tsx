// Signature: Session replay: the #bug-button-darkmode thread plays message by message on a six-step rail you can scrub (1. Code trace … 6. Session complete), while the Code, View and Canvas artifacts fill in beside it.
// Beyond: Contrast slider: drag between the before (1.9:1) and after (8.9:1) Buy Now button, using only Hanzo's own figures and colours.
import Slack from '../../components/pages/Slack';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/slack'].title, description: INDEX['/slack'].description };

export default function Page() {
  return <><JsonLd route="/slack" /><Slack /></>;
}
