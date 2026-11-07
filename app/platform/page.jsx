// Signature: a camera through the stack: eleven plates as one slab, the night opens from it, the plates pull apart and the camera travels down group by group
// Beyond: ask the map: type a word and the plates whose own Hanzo descriptions use it light up, each with the matching phrase and its sheet
import Platform from '../../components/pages/Platform';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Hanzo Platform — one stack, down to the kernel',
  description: 'Models, agents, applications, data and infrastructure on one operating plane, from GPU kernel to autonomous agent. Run it managed or on infrastructure you control.',
};

export default function Page() {
  return <><JsonLd route="/platform" /><Platform /></>;
}
