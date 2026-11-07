// Signature: a contract that signs itself — the PDF in the hero walks Hanzo's five sign-here flags: fields drop in, the link goes out, ink writes, recipients tick to signed, the certificate stamps the page
// Beyond: sign it here — draw your signature on a pad in the page, press Sign, and the field takes it with its certificate time; nothing is sent
import Sign from '../../components/pages/apps/Sign';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/sign'].title, description: INDEX['/sign'].description };

export default function Page() {
  return <><JsonLd route="/sign" /><Sign /></>;
}
