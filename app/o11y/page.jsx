// Signature: the pivot — one request draws itself across services in the dark; the slow span lifts and opens into the log lines written with its id and the exception row that rolled up beside it
// Beyond: what you keep — pick what you run today (PromQL, an OTel SDK or collector, PagerDuty or Opsgenie, Slack, Teams, email or a webhook) and read Hanzo's own line that says it carries over
// V2: 8/10 the dark room is the first screen with the product in it (a waterfall window that pivots into its logs, hover previews, pause); the statement opens the pinned suite where six parts draw into one query; OTLP room on a timed wipe; Sigil cards; one ask; grey only
// Persona: Developer
// Goal: try Hanzo O11y (read the source, then point an OTLP endpoint at it)
// CTA: View on GitHub → https://github.com/hanzoai/o11y (data-cta o11y.hero, o11y.close; the site's sticky ask bar carries it via data-thumb)
// Metric: api_key_created
import O11y from '../../components/pages/cloud/O11y';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/o11y'].title, description: INDEX['/o11y'].description };

export default function Page() {
  return <><JsonLd route="/o11y" /><O11y /></>;
}
