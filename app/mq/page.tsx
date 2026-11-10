// Persona: Developer
// Goal: try Hanzo MQ (read the source, then deploy it)
// CTA: GitHub → https://github.com/hanzoai (data-cta mq.hero, mq.close)
// Metric: github_click (the live ask is GitHub; no button here creates a key)
// Signature: jobs on a conveyor — tickets ride in by priority, the urgent one cutting ahead; two workers take them under a limiter; one fails, backs off, retries and lands in the failed set with its error while QueueEvents prints each life
// Beyond: job inspector — each fact shown working on one queue (a schedule surviving a process restart, a limiter window filling, a priority-1 job cutting ahead, backoff gaps widening, events streaming, a failed job you retry)
// V2: 8/10 Name left, line and one ask right over the live conveyor that settles; six pinned chapters over one outlined job inspector; worker.ts on graphite in the black room; the free tier as the one 64px figure; deck greys, tweens only
import Mq from '../../components/pages/cloud/Mq';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/mq'].title, description: INDEX['/mq'].description };

export default function Page() {
  return <><JsonLd route="/mq" /><Mq /></>;
}
