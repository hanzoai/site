// Signature: the docs as a transit map: a train rides the Start-here line by itself and stops at each station, whose guide opens beneath it.
// Beyond: the documentation drawn as a line you ride: each station opens its own guide in place, linked by its own name, before you leave the page
// V2: 8/10 grey deck, no eyebrows; ‘Learn Hanzo’ at display size over a full-width transit map whose train rides by itself; try and further as tile grids that open into their pages; the blog as an editorial index; the thinking as the dark room; one sticky Get started
import Learn from '../../components/pages/Learn';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Learn Hanzo — Hanzo AI',
  description: 'Start with a working request, then go as deep as you need. Everything here is part of the documentation — this page is the map.',
};

export default function Page() {
  return <><JsonLd route="/learn" /><Learn /></>;
}
