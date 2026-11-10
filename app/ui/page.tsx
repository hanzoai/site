// V2: the component board uses itself beside its token panel (drawn sliders, a real dialog and menu), six pinned chapters with specimens, a dark init room that types once and renders its button, one ask closes; deck greys only
// Signature: the component board that uses itself — the DropdownMenu and Dialog open on their own with a focus ring walking the keyboard path while the tokens under the board retune
// Beyond: retune the tokens — pick an accent, drag the radius and density, and every component on the board moves together because every value is a token
import UiPage from '../../components/pages/apps/UiPage';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/ui'].title, description: INDEX['/ui'].description };

export default function Page() {
  return <><JsonLd route="/ui" /><UiPage /></>;
}
