// V2: 8/10 Stage window (shell panes and their live tree settle into place), three pinned chapters on why it is shaped this way, a linked-machines map, a dark tile room, terminal-green accent
// Signature: the layout is a tree, drawn live — shell panes split themselves while the tree beside them grows; close one and its sibling takes the space
// Beyond: the phone flip — the same tree as swipeable pages with the Esc, Ctrl, Tab and arrow key row
import Tabs from '../../components/pages/Tabs';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/tabs'].title, description: INDEX['/tabs'].description };

export default function Page() {
  return <><JsonLd route="/tabs" /><Tabs /></>;
}
