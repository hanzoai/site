// Signature: the spike that opens — the live chart sits under the title, split by the label you pick; about every six seconds a spike rises, the cursor lands on it and the traces for that window open beside it
// Beyond: label check — tick per-model, per-route, per-tenant and the table grows a column for each while a time-series database would multiply series
// V2: 8/10 chapters play by themselves once in view (desktop pinned, phone stacked); the black room is Metrics' own chart set dark, where the prompt's query lands on the line and opens its traces; the line slides by transform; one solid fill per screen
// Persona: Developer · Goal: try Hanzo Metrics · CTA: "View on GitHub" → https://github.com/hanzoai/metrics (metrics.hero, metrics.close) · Metric: api_key_created
import Metrics from '../../components/pages/cloud/Metrics';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';
import { goImport } from '../../lib/modules';

export const metadata = { title: INDEX['/metrics'].title, description: INDEX['/metrics'].description, other: goImport('metrics') };

export default function Page() {
  return <><JsonLd route="/metrics" /><Metrics /></>;
}
