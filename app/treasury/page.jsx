// V2: 8/10 dark-room Stage (split.num writes itself and the money pours out as the object settles), five pinned ledger chapters, a wallet with a hold you drive, deck greys only
// Signature: the split that writes itself in a dark room — Numscript's split.num is written line by line and each named destination pours its stream of money out of @users:001 until the split balances
// Beyond: hold it, then pay — a wallet you drive: take $100 at checkout, hold it, pay the seller on delivery or release it, and watch each state change arrive as an event
import Treasury from '../../components/pages/apps/Treasury';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/treasury'].title, description: INDEX['/treasury'].description };

export default function Page() {
  return <><JsonLd route="/treasury" /><Treasury /></>;
}
