// Signature: a docker push that asks IAM first — 401 naming Hanzo IAM, short-lived token, signature checked, layers up, cosign signature landing beside the image
// Beyond: secret swap — one press deletes the dockerconfigjson secret and wipes in what IAM gives instead, row by row, in Hanzo's own contrasting phrases
import Registry from '../../components/pages/cloud/Registry';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/registry'].title, description: INDEX['/registry'].description };

export default function Page() {
  return <><JsonLd route="/registry" /><Registry /></>;
}
