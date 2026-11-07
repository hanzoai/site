// Signature: jobs on a conveyor — tickets ride in by priority, the urgent one cutting ahead; two workers take them under a limiter; one fails, backs off, retries and lands in the failed set with its error while QueueEvents prints each life
// Beyond: job inspector — each fact shown working on one queue (a schedule surviving a process restart, a limiter window filling, a priority-1 job cutting ahead, backoff gaps widening, events streaming, a failed job you retry)
// V2: Centred launch in grey: title and one ask over the live conveyor (whole on the first screen, pause, the job under your pointer in its toolbar); the statement opens six pinned chapters over one job inspector with pressable tabs; worker.ts in the dark room; the free tier as a giant figure
// Persona: Developer
// Goal: try Hanzo MQ (read the source, then deploy it)
// CTA: GitHub → https://github.com/hanzoai (data-cta mq.hero, mq.close)
// Metric: api_key_created
import Mq from '../../components/pages/cloud/Mq';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/mq'].title, description: INDEX['/mq'].description };

export default function Page() {
  return <><JsonLd route="/mq" /><Mq /></>;
}
