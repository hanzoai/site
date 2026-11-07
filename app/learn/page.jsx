// Signature: the docs as a transit map: a train rides the Start-here line by itself and stops at each station, whose guide opens beneath it.
// Beyond: your route: pick what you came to do and the stations for it line up in order, each one a link.
import Learn from '../../components/pages/Learn';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Learn Hanzo — Hanzo AI',
  description: 'Start with a working request, then go as deep as you need. Everything here is part of the documentation — this page is the map.',
};

export default function Page() {
  return <><JsonLd route="/learn" /><Learn /></>;
}
