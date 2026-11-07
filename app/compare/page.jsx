import Compare from '../../components/pages/Compare';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'How we compare, row by row, with the source on every row — Hanzo AI',
  description: 'Side-by-side technical benchmarks and pricing comparisons between Hanzo AI Cloud and AWS, Google Cloud, OpenAI, Supabase, and Vercel.',
};

export default function Page() {
  return <><JsonLd route="/compare" /><Compare /></>;
}
