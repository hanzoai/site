// Signature: jobs on a conveyor — tickets ride in by priority, the urgent one cutting ahead; two workers take them under a limiter; one fails, backs off, retries and lands in the failed set with its error while QueueEvents prints each life
// Beyond: job inspector — each fact shown working on one queue (a schedule surviving a process restart, a limiter window filling, a priority-1 job cutting ahead, backoff gaps widening, events streaming, a failed job you retry)
// V2: 8/10 Centred launch: live job conveyor settles under a huge title, six facts pin over one job inspector, worker.ts in the one dark room, free tier as a spec sheet
import Mq from '../../components/pages/cloud/Mq';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/mq'].title, description: INDEX['/mq'].description };

export default function Page() {
  return <><JsonLd route="/mq" /><Mq /></>;
}
