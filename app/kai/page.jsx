import ModelPage from '../../components/ModelPage';
import Kai from '../../components/pages/model/Kai';
import JsonLd from '../../components/JsonLd';

export const metadata = { title: "Hanzo Kai — Decision models", description: "Explore the Kai decision model family. Find specifications, evaluations and API usage in the model card for each version." };

export default function Page() {
  return <><JsonLd route="/kai" /><ModelPage slug="kai"><Kai /></ModelPage></>;
}
