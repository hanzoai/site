// Signature: the stack is the page: Hanzo OS drawn as a window of its seven layers, the company on top, the machines at the foot, the Record as the dashed rail beside them
import ProductsIndex from '../../components/pages/ProductsIndex';
import JsonLd from '../../components/JsonLd';
import { productsIndex } from '../../components/pages/productsIndexData';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/products'].title, description: INDEX['/products'].description };

export default function Page() {
  return <><JsonLd route="/products" /><ProductsIndex d={productsIndex()} /></>;
}
