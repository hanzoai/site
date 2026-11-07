// Signature: the spike that opens — the live chart runs full-bleed behind the title, split by the label you pick; every seven seconds a spike rises, the cursor lands on it and the traces for that window open beside it
// Beyond: label check — tick per-model, per-route, per-tenant and the pinned table grows a column for each while a time-series database would multiply series
// V2: 8/10 The live chart is the first screen (full-bleed under a one-line title, crosshair follows the pointer, spike opens traces); pinned table opened by its own statement; one dark room; Logs card opens; grey only
// Persona: Developer · Goal: try Hanzo Metrics · CTA: "View on GitHub" → https://github.com/hanzoai/metrics (metrics.hero, metrics.close) · Metric: api_key_created
import Metrics from '../../components/pages/cloud/Metrics';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/metrics'].title, description: INDEX['/metrics'].description };

export default function Page() {
  return <><JsonLd route="/metrics" /><Metrics /></>;
}
