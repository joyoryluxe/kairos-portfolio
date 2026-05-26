'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, notFound } from 'next/navigation';
import { getSection, SectionDoc } from '@/lib/api';
import SectionEditor from '@/components/SectionEditor';

function EditContent() {
  const searchParams = useSearchParams();
  const page = searchParams.get('page');
  const section = searchParams.get('section');

  const [data, setData] = useState<SectionDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!page || !section) {
      setError(true);
      setLoading(false);
      return;
    }

    async function load() {
      try {
        setLoading(true);
        const result = await getSection(page!, section!);
        setData(result);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [page, section]);

  if (loading) {
    return (
      <div className="empty-state-v2">
        <div className="empty-state-content">
          <div className="loader"></div>
          <p>Initializing editor for {page}/{section}...</p>
        </div>
      </div>
    );
  }

  if (error || !data) return notFound();

  return <SectionEditor data={data} page={page!} section={section!} />;
}

export default function SectionEditPage() {
  return (
    <Suspense fallback={
      <div className="empty-state-v2">
        <div className="empty-state-content">
          <div className="loader"></div>
          <p>Loading editor...</p>
        </div>
      </div>
    }>
      <EditContent />
    </Suspense>
  );
}
