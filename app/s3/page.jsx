// Signature: an object, kept — it breaks into ten data shards and four parity that fly to fourteen volume servers, any four go dark and it still reads
// Beyond: lose four yourself — tap any volumes dark, up to the four Hanzo says can be lost, and watch the object keep reading
// V2: 8/10 Round 2 to JAMES.md: the object first on a full-width stage (pausable; a volume you point at names its shard; the object reads back from the ten left), huge type beneath on the first screen; no eyebrow (Storage names the stage); ink and greys only; the four facts open on their own title; one dark room where the figures count up beside the prompt; one ask
// Persona: Developer storing objects. Goal: call the S3 API.
// CTA: "API reference" → https://docs.hanzo.ai/docs/openapi/s3 (data-cta s3.hero, s3.close; the site's sticky ask carries it). Metric: api_key_created.
import S3 from '../../components/pages/cloud/S3';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/s3'].title, description: INDEX['/s3'].description };

export default function Page() {
  return <><JsonLd route="/s3" /><S3 /></>;
}
