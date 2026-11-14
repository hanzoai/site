import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import UniversityCourse from '../../../components/pages/UniversityCourse';
import JsonLd from '../../../components/JsonLd';
import INDEX from '../../../content/pages.json';
import { COURSE_PAGES, findCourse } from '../../../components/pages/universityData';

// the page index by route, each with Hanzo's own title and description
const PAGES: Record<string, { title?: string; description?: string }> = INDEX;

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => COURSE_PAGES.map((c) => ({ slug: c.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const m = PAGES['/university/' + slug];
  return m ? { title: m.title, description: m.description } : {};
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const course = findCourse(slug);
  if (!course || course.slug === 'agentic-coding') notFound();
  return <><JsonLd route={'/university/' + slug} /><UniversityCourse course={course} /></>;
}
