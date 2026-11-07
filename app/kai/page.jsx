// V2: 8/10 Apple-grade launch in cobalt: the film lands full-bleed and settles into a decision-node diamond; choice, score and noul pin as chapters, each answering a real guide question on the film; the self-resolving decision tree is the one dark room; model cards, spec sheet, one call to action
// Signature: the decision tree that resolves itself — a state types in, choice, score and noul questions branch out and settle on their answers; the film settles into a decision-node diamond and the three question types pin as chapters
// Beyond: copy the exact guide request you just watched resolve and run it yourself; each question type's answer shape plays on a real question from the guide
import Kai from '../../components/pages/model/Kai';
import JsonLd from '../../components/JsonLd';

export const metadata = { title: "Hanzo Kai — Decision models", description: "Explore the Kai decision model family. Find specifications, evaluations and API usage in the model card for each version." };

export default function Page() {
  return <><JsonLd route="/kai" /><Kai /></>;
}
