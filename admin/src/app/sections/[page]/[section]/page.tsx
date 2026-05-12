import { notFound } from 'next/navigation';
import { getSection } from '@/lib/api';
import SectionEditor from '@/components/SectionEditor';

interface Props {
  params: Promise<{ page: string; section: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { page, section } = await params;
  return { title: `${section} | ${page} — Kairos Admin` };
}

export default async function SectionPage({ params }: Props) {
  const { page, section } = await params;

  let data;
  try {
    data = await getSection(page, section);
  } catch {
    notFound();
  }

  return <SectionEditor data={data} page={page} section={section} />;
}
