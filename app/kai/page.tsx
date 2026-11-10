// V2: 8/10 Apple-grade launch in Hanzo's own black and white: the film lands full-bleed and settles into a decision-node diamond; choice, score and noul pin as chapters, each answering a real guide question on Kai's film; the self-resolving decision tree is the one dark room; Kai's model cards; Hanzo's exact model cards; a closing band
// Persona: Developer
// Goal: send a first decision request
// CTA: Open Decisions (platform.hanzo.ai/decisions, data-thumb)
// Metric: api_key_created
// Signature: the decision tree that resolves itself — a state types in, choice, score and noul questions branch out and settle on their answers; the film settles into a decision-node diamond and the three question types pin as chapters
// Beyond: copy the exact guide request you just watched resolve and run it yourself; each question type's answer shape plays on a real question from the guide
import Kai from '../../components/pages/model/Kai';
import JsonLd from '../../components/JsonLd';

export const metadata = { title: "Hanzo Kai — Decision models", description: "Explore the Kai decision model family. Find specifications, evaluations and API usage in the model card for each version." };

export default function Page() {
  return <><JsonLd route="/kai" /><Kai /></>;
}
