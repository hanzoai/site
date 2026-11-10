// Signature: the playground, running — eight kinds of run take turns in one window on Hanzo's own model media (Iro develops, Koma's film plays, Kai's subject is found) with the run's tokens and cost filling beside it
// Beyond: the anatomy of a first request — scroll and "a key, a model name, and a message" lights one part at a time while the same part lights in the real curl request, then the Python client
// V2: 8/10 the Playground runs eight kinds of run on Hanzo's own (greyscale) model media in a hero window that arrives once with no snap; the first-request sentence reads itself once in a 240svh scene with a live caret; nine model films in the dark room; header ask solid; no springs, deck greys and radii
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
