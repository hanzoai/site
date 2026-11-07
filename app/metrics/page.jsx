// Signature: the spike that opens — the live chart runs full-bleed behind the title, split by the label you pick; every seven seconds a spike rises, the cursor lands on it and the traces for that window open beside it
// Beyond: label check — tick per-model, per-route, per-tenant and the pinned table grows a column for each while a time-series database would multiply series
// V2: 8/10 MASTER: title, lede and ask on the 8/5 split with the query toolbar; live chart and its traces side by side on one flat tile (a spike every ~5.5 s, flag rides it, traces open 3 s then rest dimmed; crosshair names the series); pinned table with its own intro and a replayed spike; black room where a point lands on the console; deck greys
// Persona: Developer · Goal: try Hanzo Metrics · CTA: "View on GitHub" → https://github.com/hanzoai/metrics (metrics.hero, metrics.close) · Metric: api_key_created
import Metrics from '../../components/pages/cloud/Metrics';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/metrics'].title, description: INDEX['/metrics'].description };

export default function Page() {
  return <><JsonLd route="/metrics" /><Metrics /></>;
}
