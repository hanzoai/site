/* The funnel's one call, from anywhere on the site (hanzo-inc/app @hanzo/app lib/tags + app/providers.tsx `Stream`).
   `track` sends a moment to our stream (POST /v1/event) and to every browser tag the visitor's consent and region allow,
   under one event_id; `capture` sends a plain event to our stream alone. Both go out on the page's one @hanzo/event
   client, which components/Telemetry.jsx attaches; a moment fired before that waits on the stream and goes out with it. */
import { Analytics, track as fire } from '@hanzo/event';

class Stream extends Analytics {
  capture(...args) { this.client?.capture(...args); }
  link(url) { return this.client ? this.client.link(url) : url; }
  authorize(url) { return this.client ? this.client.authorize(url) : url; }
}
const stream = new Stream({ product: 'site', enabled: false });

/** Points the stream at the provider's client (Telemetry). */
export const attach = (client) => { stream.client = client; };
export const track = (name, params = {}) => fire(stream, name, params);
export const capture = (name, props = {}) => stream.capture(name, props);
