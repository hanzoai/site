// Signature: a docker push that asks IAM first — 401 naming Hanzo IAM, short-lived token, signature checked, layers up, cosign signature landing beside the image
// V2: 8/10 object-left Stage hero where a docker push asks IAM first, scrubbable by pointer and pausable; the statement opens the pinned repository view with a token that runs out on its own; the dockerconfigjson secret deleted in the one dark room as a ledger; related as an index of cards; one ask; grey only, status by ✓ / ! marks
// Persona: Developer
// Goal: read the source, then push a first image with an IAM token
// CTA: View Source → https://github.com/hanzoai (data-cta registry.hero, registry.close; the site's sticky ask bar carries it via data-thumb)
// Metric: api_key_created
// Beyond: secret swap — one press deletes the dockerconfigjson secret and wipes in what IAM gives instead, row by row, in Hanzo's own contrasting phrases
import Registry from '../../components/pages/cloud/Registry';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/registry'].title, description: INDEX['/registry'].description };

export default function Page() {
  return <><JsonLd route="/registry" /><Registry /></>;
}
