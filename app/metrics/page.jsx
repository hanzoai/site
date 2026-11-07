// Signature: the spike that opens — a live chart split by the label you pick; a spike rises, the cursor lands on it and the traces for that window open beneath
// Beyond: label check — tick per-model, per-route, per-tenant and the pinned table grows a column for each while a time-series database would multiply series
// V2: 8/10 Chaptered launch: live query console settles from full-bleed, spike opens its traces, six points as one pinned table that changes per chapter, one dark room
import Metrics from '../../components/pages/cloud/Metrics';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/metrics'].title, description: INDEX['/metrics'].description };

export default function Page() {
  return <><JsonLd route="/metrics" /><Metrics /></>;
}
