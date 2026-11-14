import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Module from '../../components/pages/Module';
import { OWNED, goImport } from '../../lib/modules';

// The listed modules are the whole set: any other address is not a module and falls through to the site's own 404.
type Props = { params: Promise<{ mod: string[] }> };

export const dynamicParams = false;

// A CATCH-ALL, because a module path is not always one segment: hanzo.ai/lz4/v4 carries a slash, the /vN suffix being
// part of the module path by Go's own rule. The param is the segments; the module path is what they join back into.
export const generateStaticParams = () => OWNED.map((mod) => ({ mod: mod.split('/') }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const mod = (await params).mod.join('/');
  return {
    title: `hanzo.ai/${mod}`,
    description: `The Go module hanzo.ai/${mod}, and where its source lives.`,
    other: goImport(mod),
  };
}

export default async function Page({ params }: Props) {
  const mod = (await params).mod.join('/');
  if (!OWNED.includes(mod)) notFound();
  return <Module name={mod} />;
}
