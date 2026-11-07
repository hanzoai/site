// V2: the window is the hero (name and address in its own bar, panes splitting with their tree in its sidebar), three pinned chapters on why it is shaped this way, a linked-machines map, a dark room of four running objects closing on one ask, deck greys only
// Signature: the layout is a tree, drawn live — shell panes split themselves while the tree beside them grows; close one and its sibling takes the space
// Beyond: the phone flip — the same tree as swipeable pages with the Esc, Ctrl, Tab and arrow key row
import Tabs from '../../components/pages/Tabs';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/tabs'].title, description: INDEX['/tabs'].description };

export default function Page() {
  return <><JsonLd route="/tabs" /><Tabs /></>;
}
