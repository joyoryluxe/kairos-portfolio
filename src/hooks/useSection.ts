import { useState, useEffect } from 'react';
import { getSection, getPageSections, type SectionData } from '../api/api';

/**
 * useSection  –  Fetches a single section and returns { data, loading, error }
 * Falls back gracefully if the backend is unavailable.
 */
export function useSection(page: string, section: string) {
  const [data, setData] = useState<SectionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getSection(page, section)
      .then((d) => { if (!cancelled) { setData(d); setLoading(false); } })
      .catch((e) => { if (!cancelled) { setError(e.message); setLoading(false); } });

    return () => { cancelled = true; };
  }, [page, section]);

  return { data, loading, error };
}

/**
 * usePageSections  –  Fetches ALL sections for a page, returns a keyed map.
 * e.g. sections['hero'], sections['best-shots'], etc.
 */
export function usePageSections(page: string) {
  const [sections, setSections] = useState<Record<string, SectionData>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getPageSections(page)
      .then((list) => {
        if (!cancelled) {
          const map: Record<string, SectionData> = {};
          list.forEach((s) => { map[s.section] = s; });
          setSections(map);
          setLoading(false);
        }
      })
      .catch((e) => { if (!cancelled) { setError(e.message); setLoading(false); } });

    return () => { cancelled = true; };
  }, [page]);

  return { sections, loading, error };
}
