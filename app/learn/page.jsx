// Persona: a developer arriving to learn Hanzo
// Goal: a first working request
// CTA: Get started (the quickstart; kit Cta learn.hero)
// Metric: api_key_created
// Signature: the docs as a transit map: a train rides the Start-here line once, by itself, and stops at each station, whose guide opens beneath it.
// Beyond: the documentation drawn as a line you ride: each station opens its own guide in place, linked by its own name, before you leave the page
// V2: 8/10 MASTER scale: 52px headline over the map, the train rides once and rests; what to try and go further folded into one index; the blog and the thinking together as the dark room; questions; kit Cta and Img; no pills, no lifts
import Learn from '../../components/pages/Learn';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Learn Hanzo — Hanzo AI',
  description: 'Start with a working request, then go as deep as you need. Everything here is part of the documentation — this page is the map.',
};

export default function Page() {
  return <><JsonLd route="/learn" /><Learn /></>;
}
