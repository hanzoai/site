// Persona: a developer arriving to learn Hanzo
// Goal: a first working request
// CTA: Get started (the quickstart; kit Cta learn.hero)
// Metric: api_key_created
// Signature: word-light — under the Start-here transit map, Hanzo's own answer to "What is Hanzo and how does it work?" lights word by word as it is read (scroll reads; hover, tap or arrow keys move the reading point).
// Entrances: tile-flip, fold-out, opposite-drift, spiral-in, depth-parallax
// Beyond: the documentation drawn as a line you ride: each station opens its own guide in place, linked by its own name, before you leave the page
// V2: 9/10 motion-map pass: word-light statement in the second screen; hero tiles flip away, the index folds out, the dark room drifts in from opposite sides, the questions spiral in, the close lands in three depth layers; the train, rail, films and FAQ kept
import Learn from '../../components/pages/Learn';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Learn Hanzo — Hanzo AI',
  description: 'Start with a working request, then go as deep as you need. Everything here is part of the documentation — this page is the map.',
};

export default function Page() {
  return <><JsonLd route="/learn" /><Learn /></>;
}
