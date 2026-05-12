'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getPages, getPageSections, SectionDoc } from '@/lib/api';
import Link from 'next/link';

const PAGE_ICONS: Record<string, string> = {
  home: '🏠',
  pricing: '💰',
  service: '📸',
  other: '📄',
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const params = useParams<{ page: string; section: string }>();
  const [pagesMap, setPagesMap] = useState<Record<string, SectionDoc[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const pages = await getPages();
        const map: Record<string, SectionDoc[]> = {};
        await Promise.all(
          pages.map(async (p) => {
            map[p] = await getPageSections(p);
          })
        );
        setPagesMap(map);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-logo">
        <h1>⚡ Kairos Admin</h1>
        <p>Studio CMS</p>
      </div>

      <nav className="sidebar-nav">
        <div className="page-group">
          <Link href="/sections" className={`section-link ${!params?.page ? 'active' : ''}`} onClick={onClose} style={{ marginBottom: '12px' }}>
            <span style={{ marginRight: '8px' }}>📊</span> Dashboard
          </Link>
        </div>
        {loading ? (
          <div className="sidebar-loading">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton" style={{ opacity: 1 - i * 0.12 }} />
            ))}
          </div>
        ) : (
          Object.entries(pagesMap).map(([page, sections]) => (
            <div key={page} className="page-group">
              <div className="page-group-label">
                <span style={{ fontSize: '14px' }}>{PAGE_ICONS[page] || '📄'}</span>
                {page}
              </div>
              {sections.map((s) => {
                const isActive = params?.page === page && params?.section === s.section;
                return (
                  <Link
                    key={s.section}
                    href={`/sections/${page}/${s.section}`}
                    className={`section-link ${isActive ? 'active' : ''}`}
                    onClick={onClose}
                  >
                    <span className="dot" />
                    {s.section}
                  </Link>
                );
              })}
            </div>
          ))
        )}
      </nav>
    </aside>
  );
}
