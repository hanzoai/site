// V2: 8/10 Stage board (the self-using component board and its token panel settle into place), six pinned chapters each with its own specimen, the init room in the dark, violet accent
// Signature: the component board that uses itself — the DropdownMenu and Dialog open on their own with a focus ring walking the keyboard path while the tokens under the board retune
// Beyond: retune the tokens — pick an accent, drag the radius and density, and every component on the board moves together because every value is a token
import UiPage from '../../components/pages/apps/UiPage';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/ui'].title, description: INDEX['/ui'].description };

export default function Page() {
  return <><JsonLd route="/ui" /><UiPage /></>;
}
