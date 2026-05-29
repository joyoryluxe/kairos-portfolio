'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { getPages, getPageSections, SectionDoc } from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';
import Link from 'next/link';

const PAGE_ICONS: Record<string, string> = {
  home: '🏠',
  pricing: '💰',
  service: '📸',
  about: '💡',
  other: '📄',
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const currentPage = searchParams.get('page');
  const currentSection = searchParams.get('section');
  const [pagesMap, setPagesMap] = useState<Record<string, SectionDoc[]>>({});
  const [loading, setLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);

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

  const handleLogout = () => {
    logout();
    router.replace('/auth/login');
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-logo" style={{ padding: '24px 24px 16px' }}>
        <img src="/admin_kairos/logo.png" alt="Kairos Admin" style={{ height: '40px', width: 'auto', objectFit: 'contain' }} />
      </div>

      <nav className="sidebar-nav">
        <div className="page-group">
          <Link href="/sections" className={`section-link ${pathname === '/sections' ? 'active' : ''}`} onClick={onClose} style={{ marginBottom: '6px' }}>
            <span style={{ marginRight: '8px' }}>📊</span> Dashboard
          </Link>
          <a
            href="https://crm.kairosstudio.in/gallary/kairos-portal-a8f3k/login/"
            target="_blank"
            rel="noopener noreferrer"
            className="section-link"
            onClick={onClose}
            style={{
              marginBottom: '12px',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              background: 'rgba(59, 130, 246, 0.05)',
              color: 'var(--accent-light)',
            }}
          >
            <span style={{ marginRight: '8px' }}>🖼️</span> Go to Gallery
          </a>
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
              {sections.filter(s => s.section !== 'connect').map((s) => {
                const isActive = currentPage === page && currentSection === s.section;
                return (
                  <Link
                    key={s.section}
                    href={`/sections/edit?page=${encodeURIComponent(page)}&section=${encodeURIComponent(s.section)}`}
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

      {/* ── Profile & Logout Footer ───────────────────────── */}
      <div className="sidebar-footer">
        {/* Profile Card */}
        <div
          className="sidebar-profile"
          onClick={() => setShowProfile(!showProfile)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setShowProfile(!showProfile)}
          aria-expanded={showProfile}
        >
          <div className="sidebar-avatar">
            {user?.username?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="sidebar-profile-info">
            <span className="sidebar-profile-name">{user?.username || 'Admin'}</span>
            <span className="sidebar-profile-email">{user?.email || ''}</span>
          </div>
          <span className={`sidebar-profile-caret ${showProfile ? 'open' : ''}`}>›</span>
        </div>

        {/* Expandable actions */}
        {showProfile && (
          <div className="sidebar-actions">
            <div className="sidebar-role-badge">
              <span className="role-dot" />
              {user?.role || 'admin'}
            </div>
            <button className="sidebar-action-btn logout-btn" onClick={handleLogout}>
              <span>🚪</span>
              Sign Out
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
