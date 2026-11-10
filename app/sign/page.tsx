// V2: 8/10 no pinned chapters: the hero desk signs the contract by itself and the five steps sit under it as buttons that take the desk there; each moment on the paper stamps; five sections, five different entrances; parts open into sheets; a signing pad; one dark close with one ask; deck greys only
// Signature: stamp — the contract on the hero desk is signed by itself and everything that lands on it stamps (drop, squash, settle): the six fields, the signature's press, the tick, the certificate jolting the page; the pad's Signed line stamps too
// Entrances: swing-door (opening), drop-in (What is in it), rack-focus (the signing pad), noise-dissolve (What it costs), accordion (Send the first one)
// Beyond: sign it here — draw your signature on a pad in the page, press Sign, and the field takes it with its certificate time; nothing is sent
import Sign from '../../components/pages/apps/Sign';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/sign'].title, description: INDEX['/sign'].description };

export default function Page() {
  return <><JsonLd route="/sign" /><Sign /></>;
}
