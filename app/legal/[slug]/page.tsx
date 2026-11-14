import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import LegalRoute, { legalMeta } from '../../../components/pages/LegalRoute';
import { SLUGS } from '../../../components/pages/legalData';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => SLUGS.map((slug) => ({ slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return legalMeta((await params).slug);
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  if (!SLUGS.includes(slug)) notFound();
  return <LegalRoute slug={slug} />;
}
