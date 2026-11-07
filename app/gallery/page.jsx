// V2: 8/10 the salon wall as the Stage (six living frames settle under a giant title, a spotlight walking them), frames that open into a viewer, three moves as big steps, a typed prompt, a dark closing room, amber accent
// Signature: a salon-hung gallery wall of six living contour frames, a spotlight walking frame to frame; click to step up to one
// Beyond: three moves from template to running app (fork, deploy, submit yours), each straight to its place
import Gallery from '../../components/pages/Gallery';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Gallery — Hanzo AI',
  description: 'Production-ready templates for AI agents, RAG pipelines, and full-stack apps. Clone, customize, and deploy to Hanzo Cloud in minutes.',
};

export default function Page() {
  return <><JsonLd route="/gallery" /><Gallery /></>;
}
