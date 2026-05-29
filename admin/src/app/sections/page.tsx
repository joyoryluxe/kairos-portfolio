'use client';

import { useEffect, useState } from 'react';
import { getPages, getPageSections, getCloudinaryUsage, CloudinaryUsage } from '@/lib/api';
import Link from 'next/link';

// ─── Cloudinary Media Analytics Card ──────────────────────────────────────────

function ProgressBar({ percentage, color }: { percentage: number; color: string }) {
  return (
    <div style={{
      width: '100%',
      height: '6px',
      background: 'rgba(255,255,255,0.08)',
      borderRadius: '99px',
      overflow: 'hidden',
      marginTop: '8px',
    }}>
      <div style={{
        width: `${Math.min(percentage, 100)}%`,
        height: '100%',
        background: color,
        borderRadius: '99px',
        transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)',
        boxShadow: `0 0 8px ${color}88`,
      }} />
    </div>
  );
}

function CloudinaryCard({ usage }: { usage: CloudinaryUsage | null; loading: boolean }) {
  if (!usage) {
    return (
      <div className="cloudinary-analytics-card" style={{ gridColumn: '1/-1' }}>
        <div className="cloudinary-card-header">
          <span className="cloudinary-icon">☁️</span>
          <div>
            <h3>Media Analytics</h3>
            <span className="cloudinary-plan">Loading from Cloudinary...</span>
          </div>
        </div>
        <div className="cloudinary-skeleton-grid">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="cloudinary-skeleton" />
          ))}
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: 'Storage',
      value: `${usage.storage.usedGB} GB`,
      sub: usage.storage.limitGB != null
        ? `of ${usage.storage.limitGB} GB`
        : `${usage.credits.used.toFixed(2)} / ${usage.credits.limit} credits`,
      pct: usage.credits.percent,
      showPct: true,
      color: '#a78bfa',
    },
    {
      label: 'Bandwidth',
      value: `${usage.bandwidth.usedGB} GB`,
      sub: usage.bandwidth.limitGB != null
        ? `of ${usage.bandwidth.limitGB} GB`
        : `${usage.bandwidth.creditsUsage?.toFixed(2) ?? 0} credits used`,
      pct: usage.bandwidth.percentage,
      showPct: true,
      color: '#38bdf8',
    },
    {
      label: 'Transformations',
      value: usage.transformations.used.toLocaleString(),
      sub: usage.transformations.limit > 0
        ? `of ${usage.transformations.limit.toLocaleString()}`
        : `${usage.transformations.creditsUsage?.toFixed(2) ?? 0} credits used`,
      pct: usage.transformations.percentage,
      showPct: true,
      color: '#34d399',
    },
    {
      label: 'Assets',
      value: usage.objects.toLocaleString(),
      sub: `${usage.resources ?? usage.objects} files · ${usage.impressions?.toLocaleString() ?? 0} views`,
      pct: null,
      showPct: false,
      color: '#f472b6',
    },
  ];

  return (
    <div className="cloudinary-analytics-card" style={{ gridColumn: '1/-1' }}>
      <div className="cloudinary-card-header">
        <span className="cloudinary-icon">☁️</span>
        <div>
          <h3>Media Analytics <span style={{ color: '#38bdf8', fontSize: '13px', fontWeight: 400 }}>· Live</span></h3>
          <span className="cloudinary-plan">Cloudinary · {usage.plan} Plan</span>
        </div>
        <span className="cloudinary-refresh-badge">
          Updated {new Date(usage.fetchedAt).toLocaleTimeString()}
        </span>
      </div>
      <div className="cloudinary-stats-grid">
        {stats.map((s) => (
          <div key={s.label} className="cloudinary-stat-block">
            <div className="cloudinary-stat-label">{s.label}</div>
            <div className="cloudinary-stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="cloudinary-stat-sub">{s.sub}</div>
            {s.showPct && s.pct != null && (
              <>
                <ProgressBar percentage={s.pct} color={s.color} />
                <div className="cloudinary-stat-pct">{s.pct}% of credits</div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Dashboard Page ───────────────────────────────────────────────────────

export default function SectionsPage() {
  const [sections, setSections] = useState<{ name: string, path: string, icon: string, status: string }[]>([
    { name: "Hero Banner", path: "/sections/edit?page=home&section=hero", icon: "✨", status: "Published" },
    { name: "Maternity Photography", path: "/sections/edit?page=service&section=maternity", icon: "🤰", status: "Draft" },
    { name: "Interior Photography", path: "/sections/edit?page=service&section=interior", icon: "🏡", status: "Published" },
    { name: "Pricing Packages", path: "/sections/edit?page=pricing&section=packages", icon: "💎", status: "Updated" }
  ]);

  const [quickStats, setQuickStats] = useState([
    { label: "Active Pages", value: "...", trend: "Calculating...", color: "blue" },
    { label: "Total Sections", value: "...", trend: "Syncing...", color: "emerald" },
    { label: "Total Requests", value: "...", trend: "From Cloudinary", color: "purple" }
  ]);

  const [cloudinary, setCloudinary] = useState<CloudinaryUsage | null>(null);
  const [cloudinaryLoading, setCloudinaryLoading] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch sections + pages
    async function loadData() {
      try {
        const pages = await getPages();
        let totalSections = 0;
        let recentSections: { name: string, path: string, icon: string, status: string }[] = [];

        const pageIcons: Record<string, string> = {
          home: '🏠',
          pricing: '💰',
          service: '📸',
          about: '💡',
          other: '📄',
        };

        for (const p of pages) {
          const pageSections = await getPageSections(p);
          totalSections += pageSections.length;

          pageSections.slice(0, 2).forEach(s => {
            if (recentSections.length < 5) {
              recentSections.push({
                name: s.section,
                path: `/sections/edit?page=${p}&section=${s.section}`,
                icon: pageIcons[p] || "📄",
                status: s.updatedAt ? "Updated" : "Published"
              });
            }
          });
        }

        if (recentSections.length > 0) setSections(recentSections);

        setQuickStats(prev => [
          { ...prev[0], label: "Active Pages", value: pages.length.toString(), trend: "Live on site" },
          { ...prev[1], label: "Total Sections", value: totalSections.toString(), trend: "Manageable blocks" },
          prev[2], // requests — will be updated once cloudinary loads
        ]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    // Fetch real Cloudinary usage from backend
    async function loadCloudinary() {
      try {
        const data = await getCloudinaryUsage();
        setCloudinary(data);
        // Also update the "Total Requests" stat card
        setQuickStats(prev => [
          prev[0],
          prev[1],
          {
            label: "Total Requests",
            value: data.requests.toLocaleString(),
            trend: `${data.objects.toLocaleString()} assets · ${data.plan} plan`,
            color: "purple",
          },
        ]);
      } catch (err) {
        console.error('Cloudinary usage error:', err);
        setQuickStats(prev => [
          prev[0],
          prev[1],
          { ...prev[2], value: 'N/A', trend: 'API unavailable' },
        ]);
      } finally {
        setCloudinaryLoading(false);
      }
    }

    loadData();
    loadCloudinary();
  }, []);

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      {/* <div className="dashboard-header">
        <div className="header-content">
          <div className="header-title-row">
            <img src="/admin_kairos/logo.png" alt="Kairos Studio" className="header-logo" />
          <div className="header-title-group">

            <h1 className="main-title">
              Your Digital <span>Workspace.</span>
            </h1>
            <p className="subtitle">
            Centralized control for your galleries, service pages, and studio experiences.
          </p>
          </div>
          </div>
          
          <div className="header-actions">
            <a
              href="https://crm.kairosstudio.in/gallary/kairos-portal-a8f3k/login/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-glow primary"
            >
              Open Live Gallery <span>→</span>
            </a>
            <button className="btn-glow secondary">
              View Analytics
            </button>
          </div>
        </div>
        <div className="header-visual">
          <div className="visual-orb"></div>
          <div className="visual-orb delay-1"></div>
        </div>
      </div> */}

      {/* Quick Stats Grid */}
      <div className="stats-grid">
        {quickStats.map((stat, i) => (
          <div className={`stat-card border-${stat.color}`} key={i}>
            <div className="stat-label">{stat.label}</div>
            <div className={`stat-value text-${stat.color}`}>{stat.value}</div>
            <div className="stat-trend">{stat.trend}</div>
          </div>
        ))}
      </div>

      {/* Cloudinary Media Analytics — full-width row */}
      <CloudinaryCard usage={cloudinary} loading={cloudinaryLoading} />

      {/* Main Content Split */}
      <div className="dashboard-split">
        {/* Left Side: Recent Activity / Sections */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <h3>Recent Sections</h3>
            <button className="btn-text">View All</button>
          </div>
     <div className="modern-section-grid">
  {sections.map((item, i) => (
    <div className="modern-section-card" key={i}>
      
      <div className="card-top">
        <div className="modern-icon">
          {item.icon}
        </div>

        <span className={`modern-status ${item.status.toLowerCase()}`}>
          {item.status}
        </span>
      </div>

      <div className="card-content">
        <h3>{item.name}</h3>

        <p>
          Manage and customize this website section content.
        </p>
      </div>

      <div className="card-footer">
        <span className="section-meta">
          Last updated recently
        </span>

        <Link href={item.path} className="section-action-btn">
          Edit Section →
        </Link>
      </div>

    </div>
  ))}
</div>
        </div>

        {/* Right Side: Quick Actions & Status */}
        {/* <div className="dashboard-sidebar">
          <div className="dashboard-panel glass-panel">
            <div className="panel-header">
              <h3>System Status</h3>
            </div>
            <div className="status-list">
              <div className="status-item-v2">
                <div className="status-icon success"></div>
                <div className="status-text">
                  <strong>Gallery API</strong>
                  <span>Connected &amp; Syncing</span>
                </div>
              </div>
              <div className="status-item-v2">
                <div className={`status-icon ${cloudinary ? 'success' : 'pending'}`}></div>
                <div className="status-text">
                  <strong>Cloudinary</strong>
                  <span>
                    {cloudinary
                      ? `${cloudinary.objects.toLocaleString()} Assets · ${cloudinary.storage.usedGB} GB`
                      : cloudinaryLoading ? 'Fetching live data...' : 'Unavailable'
                    }
                  </span>
                </div>
              </div>
              <div className="status-item-v2">
                <div className="status-icon pending"></div>
                <div className="status-text">
                  <strong>Last Backup</strong>
                  <span>2 hours ago</span>
                </div>
              </div>
            </div>
          </div>

          <div className="quick-action-card">
            <div className="quick-action-content">
              <h4>Need Help?</h4>
              <p>Check out our documentation for tips on optimizing your galleries.</p>
              <button className="btn-outline-small">Read Docs</button>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}