// /bot/details is the same page as /bot, which the sitemap offers: its canonical is /bot.
import Bot from '../../../components/pages/Bot';
import JsonLd from '../../../components/JsonLd';

export { metadata } from '../page';

export default function Page() {
  return <><JsonLd route="/bot" /><Bot /></>;
}
