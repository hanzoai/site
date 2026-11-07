// Signature: an object, kept — it breaks into ten data shards and four parity that fly to fourteen volume servers, any four go dark and it still reads
// Beyond: lose four yourself — tap any volumes dark, up to the four Hanzo says can be lost, and watch the object keep reading
import S3 from '../../components/pages/cloud/S3';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/s3'].title, description: INDEX['/s3'].description };

export default function Page() {
  return <><JsonLd route="/s3" /><S3 /></>;
}
