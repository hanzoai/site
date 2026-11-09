// Persona: Developer storing objects. Goal: call the S3 API.
// CTA: "API reference" → https://docs.hanzo.ai/docs/openapi/s3 (data-cta s3.hero, s3.close; the site's sticky ask carries it). Metric: api_key_created.
// Signature: peel — one binary lifts apart into its four floating roles in 3D (HTTP gateway, filer, master, volume servers), walks KMS keys, ten data and four parity shards (four dark, still reads) and one binary protocol on those layers, then closes back into one binary
// Beyond: lose four yourself — in the hero, tap any volume servers dark, up to the four Hanzo says can be lost, and watch the object keep reading
// V2: the title first (52px, 8/5 split with the lede and ask), the erasure-coding stage beneath it (kept); then the peel of the four roles beside the four facts (no pinned chapters); one black room where the 64px figures cut in beside the prompt; deck greys; one ask
import S3 from '../../components/pages/cloud/S3';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';
import { goImport } from '../../lib/modules';

export const metadata = { title: INDEX['/s3'].title, description: INDEX['/s3'].description, other: goImport('s3') };

export default function Page() {
  return <><JsonLd route="/s3" /><S3 /></>;
}
