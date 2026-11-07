// V2: 8/10 Stage hero (the live dial arrives huge and settles), three pinned chapters, cards and drawers that open into sheets, one dark room, signal-red accent
// Signature: the dial that decides and shows its work — pick a stage, signals light, the needle swings to a score and the plane returns an action with its reasons, summoning a person past the line
// Beyond: attribution by hand — set any signal back to neutral and score again; the drop is that signal's contribution, exactly how Hanzo says its scores explain themselves
import Risk from '../../components/pages/apps/Risk';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/risk'].title, description: INDEX['/risk'].description };

export default function Page() {
  return <><JsonLd route="/risk" /><Risk /></>;
}
