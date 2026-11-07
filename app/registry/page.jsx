// Signature: a docker push that asks IAM first — 401 naming Hanzo IAM, short-lived token, signature checked, layers up, cosign signature landing beside the image
// V2: 8/10 Object-left Stage hero where a docker push asks IAM first and the token travels to the terminal; six facts as one pinned repository view; the dockerconfigjson secret deleted in the one dark room; related cards that open
// Beyond: secret swap — one press deletes the dockerconfigjson secret and wipes in what IAM gives instead, row by row, in Hanzo's own contrasting phrases
import Registry from '../../components/pages/cloud/Registry';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/registry'].title, description: INDEX['/registry'].description };

export default function Page() {
  return <><JsonLd route="/registry" /><Registry /></>;
}
