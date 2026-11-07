// Persona: Developer storing objects. Goal: call the S3 API.
// CTA: "API reference" → https://docs.hanzo.ai/docs/openapi/s3 (data-cta s3.hero, s3.close; the site's sticky ask carries it). Metric: api_key_created.
// Signature: an object, kept — it breaks into ten data shards and four parity that fly to fourteen volume servers, any four go dark and it still reads
// Beyond: lose four yourself — tap any volumes dark, up to the four Hanzo says can be lost, and watch the object keep reading
// V2: 8/10 Round 3 to MASTER.md: the title first (52px, 8/5 split with the lede and ask), the object on one flat quiet stage beneath it with its legend and pause in its own top row; no cursor label; shards move on eased tweens, not springs; the four facts on one pinned diagram; one black room where the 64px figures cut in beside the prompt; deck greys; one ask
import S3 from '../../components/pages/cloud/S3';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/s3'].title, description: INDEX['/s3'].description };

export default function Page() {
  return <><JsonLd route="/s3" /><S3 /></>;
}
