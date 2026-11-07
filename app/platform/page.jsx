import Platform from '../../components/pages/Platform';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Hanzo Platform — one stack, down to the kernel',
  description: 'Models, agents, applications, data and infrastructure on one operating plane, from GPU kernel to autonomous agent. Run it managed or on infrastructure you control.',
};

export default function Page() {
  return <><JsonLd route="/platform" /><Platform /></>;
}
