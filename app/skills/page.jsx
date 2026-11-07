// Signature: Gateway wake-up: say a word (Postgres, comptime) and its gateway skill (discover-database, discover-zig) wakes, pulls its markdown cards and slots them into the agent, whose context bar grows only by what it loaded.
// Beyond: Follow a thread: API design → rate limiting → Redis, three files read, the paragraphs they share linked rather than repeated.
import Skills from '../../components/pages/Skills';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/skills'].title, description: INDEX['/skills'].description };

export default function Page() {
  return <><JsonLd route="/skills" /><Skills /></>;
}
