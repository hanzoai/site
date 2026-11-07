// Signature: the reconcile loop, live — git on one side, the cluster on the other, a sweep logging created, reverted or already in sync
// Beyond: break it yourself — edit by hand, remove a file from git, install twice, push or turn on autoscaling, and the loop answers as Hanzo says it does
import Operator from '../../components/pages/Operator';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/operator'].title, description: INDEX['/operator'].description };

export default function Page() {
  return <><JsonLd route="/operator" /><Operator /></>;
}
