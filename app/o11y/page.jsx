// Persona: Developer (an engineer who runs services and wants one place for traces, metrics and logs)
// Goal: try Hanzo O11y (read the source, then point an OTLP endpoint at it)
// CTA: View on GitHub → https://github.com/hanzoai/o11y (data-cta o11y.hero, o11y.close; the site's sticky ask carries it via data-thumb in between)
// Metric: api_key_created
// Signature: the pivot — one request draws itself across services in the dark while a playhead sweeps it; span by span it opens into the log lines written with its id, then rests on the slow span
// Beyond: what you keep — pick what you run today (PromQL, any OTel SDK or collector, PagerDuty, Opsgenie, Slack, Teams, email or a webhook) and the part of O11y that keeps it lights up with its own object
// V2: 8/10 dark waterfall hero that runs once and rests (fixed height, pause and replay); the pinned suite is that same dark window walking the request with real tabs and panes that draw; ports said once; one ask; deck greys, flat surfaces, no springs, no cursor labels
import O11y from '../../components/pages/cloud/O11y';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/o11y'].title, description: INDEX['/o11y'].description };

export default function Page() {
  return <><JsonLd route="/o11y" /><O11y /></>;
}
