// Signature: the playground, running — eight kinds of run take turns in one window on Hanzo's own model media (Iro develops, Koma's film plays, Kai's subject is found) with the run's tokens and cost filling beside it
// Beyond: the anatomy of a first request — scroll and "a key, a model name, and a message" lights one part at a time while the same part lights in the real curl request, then the Python client
// V2: 8/10 split Stage hero with the Playground running on real model media, opening on Iro so colour comes only from Hanzo's media; hover a kind to preview it, pause to hold it; the first-request sentence as a pinned scene marking its token (hover marks it too); one dark room where all nine of Hanzo's model films sit together (one plays at a time, hover picks it, each opens its model page); related cards that open; one ask; grey UI
// Persona: Developer
// Goal: open the Playground and run a first request
// CTA: Open the Playground → https://platform.hanzo.ai/playground (data-cta playground.hero, playground.close; the site's sticky ask bar carries it via data-thumb)
// Metric: api_key_created
import Playground from '../../components/pages/cloud/Playground';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/playground'].title, description: INDEX['/playground'].description };

export default function Page() {
  return <><JsonLd route="/playground" /><Playground /></>;
}
